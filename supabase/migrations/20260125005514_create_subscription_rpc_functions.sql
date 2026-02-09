/*
  # Subscription Management RPC Functions
  
  ## Functions
  
  ### rpc_recompute_org_features
  - Merges base plan features + all active add-on features
  - Stores result in org_features table
  - Used for fast feature gating in UI
  
  ### rpc_upsert_subscription_from_checkout
  - Called from Stripe webhook after checkout.session.completed
  - Creates/updates subscription + base subscription item
  
  ### rpc_sync_subscription_items
  - Called from Stripe webhook on subscription.updated
  - Syncs all subscription items from Stripe to DB
  - Marks missing items as canceled
  
  ### rpc_update_subscription_status
  - Quick status update (no full sync)
  
  ## Merge Rules for Features
  - Boolean: true wins over false
  - Numeric: sum (e.g., sms_credits)
  - Other: last write wins
*/

-- Recompute effective features for an org
create or replace function public.rpc_recompute_org_features(p_org_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_features jsonb := '{}'::jsonb;
  v_base_plan_id uuid;
  v_base_features jsonb;
  v_addon record;
  v_addon_features jsonb;
  v_key text;
  v_val jsonb;
begin
  -- Get base plan features
  select plan_id into v_base_plan_id
  from subscriptions
  where org_id = p_org_id
  limit 1;

  if v_base_plan_id is not null then
    select features into v_base_features from plans where id = v_base_plan_id;
    v_features := coalesce(v_base_features, '{}'::jsonb);
  end if;

  -- Merge add-on features
  for v_addon in
    select si.plan_id
    from subscription_items si
    where si.org_id = p_org_id
      and si.item_type = 'addon'
      and si.status = 'active'
      and si.plan_id is not null
  loop
    select features into v_addon_features from plans where id = v_addon.plan_id;
    v_addon_features := coalesce(v_addon_features, '{}'::jsonb);

    -- Merge each key
    for v_key, v_val in
      select key, value from jsonb_each(v_addon_features)
    loop
      -- Boolean: true wins
      if jsonb_typeof(v_val) = 'boolean' then
        if (v_val::text = 'true') then
          v_features := jsonb_set(v_features, array[v_key], 'true'::jsonb, true);
        elsif not (v_features ? v_key) then
          v_features := jsonb_set(v_features, array[v_key], 'false'::jsonb, true);
        end if;

      -- Numeric: sum
      elsif jsonb_typeof(v_val) = 'number' then
        if (v_features ? v_key) and jsonb_typeof(v_features->v_key) = 'number' then
          v_features := jsonb_set(
            v_features,
            array[v_key],
            to_jsonb((v_features->>v_key)::numeric + (v_val::text)::numeric),
            true
          );
        else
          v_features := jsonb_set(v_features, array[v_key], v_val, true);
        end if;

      -- Other: set
      else
        v_features := jsonb_set(v_features, array[v_key], v_val, true);
      end if;
    end loop;
  end loop;

  -- Store result
  insert into org_features(org_id, effective_features, updated_at)
  values (p_org_id, v_features, now())
  on conflict (org_id) do update
    set effective_features = excluded.effective_features,
        updated_at = now();

  return v_features;
end $$;

-- Upsert subscription from Stripe checkout
create or replace function public.rpc_upsert_subscription_from_checkout(
  p_org_id uuid,
  p_stripe_customer_id text,
  p_stripe_subscription_id text,
  p_base_price_id text,
  p_status text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base_plan_id uuid;
begin
  -- Find plan by Stripe price ID
  select id into v_base_plan_id
  from plans
  where stripe_price_id = p_base_price_id
  limit 1;

  -- Upsert subscription
  insert into subscriptions(org_id, plan_id, stripe_customer_id, stripe_subscription_id, status)
  values (p_org_id, v_base_plan_id, p_stripe_customer_id, p_stripe_subscription_id, p_status)
  on conflict (org_id) do update
    set plan_id = excluded.plan_id,
        stripe_customer_id = excluded.stripe_customer_id,
        stripe_subscription_id = excluded.stripe_subscription_id,
        status = excluded.status,
        updated_at = now();

  -- Create placeholder base item (will be updated by sync)
  insert into subscription_items(
    org_id, stripe_subscription_id, stripe_subscription_item_id,
    stripe_price_id, plan_id, item_type, quantity, status
  )
  values (
    p_org_id, p_stripe_subscription_id, 'si_PENDING_BASE_ITEM',
    p_base_price_id, v_base_plan_id, 'base', 1, 'active'
  )
  on conflict (stripe_subscription_item_id) do nothing;

  -- Recompute features
  perform rpc_recompute_org_features(p_org_id);
end $$;

-- Sync subscription items from Stripe
create or replace function public.rpc_sync_subscription_items(
  p_org_id uuid,
  p_stripe_subscription_id text,
  p_items jsonb,
  p_status text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_item_id text;
  v_price_id text;
  v_qty int;
  v_plan_id uuid;
  v_item_type text;
begin
  -- Update subscription status
  update subscriptions
  set status = p_status,
      updated_at = now()
  where org_id = p_org_id;

  -- Mark all existing items as canceled first
  update subscription_items
  set status = 'canceled', updated_at = now()
  where org_id = p_org_id
    and stripe_subscription_id = p_stripe_subscription_id;

  -- Re-activate/create items from Stripe data
  for v_item in
    select * from jsonb_array_elements(p_items)
  loop
    v_item_id := v_item->>'id';
    v_price_id := v_item#>>'{price,id}';
    v_qty := coalesce((v_item->>'quantity')::int, 1);

    -- Find plan
    select id into v_plan_id from plans where stripe_price_id = v_price_id limit 1;

    -- Determine item type (addon if features->>'addon' = 'true')
    if v_plan_id is not null then
      select (case when coalesce((features->>'addon')::boolean, false) = true then 'addon' else 'base' end)
      into v_item_type
      from plans where id = v_plan_id;
    else
      v_item_type := 'base'; -- fallback
    end if;

    -- Upsert item
    insert into subscription_items(
      org_id, stripe_subscription_id, stripe_subscription_item_id,
      stripe_price_id, plan_id, item_type, quantity, status
    )
    values (
      p_org_id, p_stripe_subscription_id, v_item_id,
      v_price_id, v_plan_id, v_item_type, v_qty, 'active'
    )
    on conflict (stripe_subscription_item_id) do update
      set stripe_price_id = excluded.stripe_price_id,
          plan_id = excluded.plan_id,
          item_type = excluded.item_type,
          quantity = excluded.quantity,
          status = excluded.status,
          updated_at = now();
  end loop;

  -- Recompute features
  perform rpc_recompute_org_features(p_org_id);
end $$;

-- Quick status update
create or replace function public.rpc_update_subscription_status(
  p_stripe_subscription_id text,
  p_status text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update subscriptions
  set status = p_status,
      updated_at = now()
  where stripe_subscription_id = p_stripe_subscription_id;
end $$;

-- View: org access summary
create or replace view public.v_org_access as
select
  o.id as org_id,
  o.name as org_name,
  o.type as org_type,
  s.status as subscription_status,
  p.name as base_plan_name,
  p.price_monthly as base_price_monthly,
  ofe.effective_features,
  ofe.updated_at as features_updated_at
from organizations o
left join subscriptions s on s.org_id = o.id
left join plans p on p.id = s.plan_id
left join org_features ofe on ofe.org_id = o.id;
