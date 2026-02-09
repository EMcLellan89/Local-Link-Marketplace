-- ============================================================
-- COMPLETE LOCAL-LINK CONTENT & AUTOMATION PLATFORM SCHEMA
-- Run this after the base org + subscription migrations
-- ============================================================

-- REFERRALS & COMMISSION TRACKING
-- ============================================================

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_partner_org_id uuid not null references public.organizations(id) on delete cascade,
  referral_code text not null unique,
  referral_name text,
  clicks int not null default 0,
  signups int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_referrals_partner on public.referrals(referrer_partner_org_id) where not exists (select 1 from pg_indexes where indexname = 'idx_referrals_partner');
create index idx_referrals_code on public.referrals(referral_code) where not exists (select 1 from pg_indexes where indexname = 'idx_referrals_code');

create table if not exists public.partner_uplines (
  id uuid primary key default gen_random_uuid(),
  child_partner_org_id uuid not null unique references public.organizations(id) on delete cascade,
  upline_partner_org_id uuid not null references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint partner_uplines_no_self_ref check (child_partner_org_id != upline_partner_org_id)
);

create index idx_partner_uplines_child on public.partner_uplines(child_partner_org_id);
create index idx_partner_uplines_upline on public.partner_uplines(upline_partner_org_id);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.organizations(id) on delete cascade,
  merchant_org_id uuid not null references public.organizations(id) on delete cascade,
  subscription_id text,
  amount numeric not null default 0,
  rate numeric not null default 0.10,
  status text not null default 'pending' check (status in ('pending', 'earned', 'paid')),
  period_start date,
  period_end date,
  created_at timestamptz not null default now()
);

create index idx_commissions_partner on public.commissions(partner_org_id);
create index idx_commissions_merchant on public.commissions(merchant_org_id);
create index idx_commissions_status on public.commissions(status);

create table if not exists public.commission_splits (
  id uuid primary key default gen_random_uuid(),
  stripe_subscription_id text not null,
  invoice_id text not null,
  merchant_org_id uuid not null references public.organizations(id) on delete cascade,
  recipient_partner_org_id uuid not null references public.organizations(id) on delete cascade,
  role text not null check (role in ('partner', 'upline')),
  rate numeric not null,
  amount numeric not null,
  status text not null default 'earned' check (status in ('earned', 'paid')),
  created_at timestamptz not null default now()
);

create index idx_commission_splits_sub on public.commission_splits(stripe_subscription_id);
create index idx_commission_splits_recipient on public.commission_splits(recipient_partner_org_id);

create table if not exists public.short_links (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  slug text not null unique,
  destination_url text not null,
  clicks int not null default 0,
  campaign_id uuid,
  content_id uuid,
  created_at timestamptz not null default now()
);

create index idx_short_links_org on public.short_links(org_id);
create index idx_short_links_slug on public.short_links(slug);

-- CONTENT ENGINE
-- ============================================================

create table if not exists public.content_templates (
  id uuid primary key default gen_random_uuid(),
  industry text not null,
  format text not null check (format in ('post', 'email', 'sms', 'video_script', 'blog')),
  prompt text not null,
  default_cta text,
  tags text[],
  created_at timestamptz not null default now()
);

create index idx_content_templates_industry on public.content_templates(industry);
create index idx_content_templates_format on public.content_templates(format);

create table if not exists public.campaign_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null,
  goal text not null,
  duration_days int not null default 30,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  template_id uuid references public.campaign_templates(id) on delete set null,
  name text not null,
  goal text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'completed')),
  start_date date,
  end_date date,
  created_at timestamptz not null default now()
);

create index idx_campaigns_org on public.campaigns(org_id);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  format text not null,
  title text,
  body text not null,
  media_urls text[],
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  created_at timestamptz not null default now()
);

create index idx_content_items_org on public.content_items(org_id);
create index idx_content_items_status on public.content_items(status);

create table if not exists public.content_calendar (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  content_id uuid not null references public.content_items(id) on delete cascade,
  scheduled_for timestamptz not null,
  channels text[] not null,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_content_calendar_org on public.content_calendar(org_id);
create index idx_content_calendar_scheduled on public.content_calendar(scheduled_for);

-- CRM SYSTEM
-- ============================================================

create table if not exists public.crm_pipelines (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_crm_pipelines_org on public.crm_pipelines(org_id);

create table if not exists public.crm_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.crm_pipelines(id) on delete cascade,
  name text not null,
  position int not null,
  created_at timestamptz not null default now()
);

create index idx_crm_stages_pipeline on public.crm_stages(pipeline_id);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  stage_id uuid references public.crm_stages(id) on delete set null,
  name text not null,
  email text,
  phone text,
  source text,
  notes text,
  created_at timestamptz not null default now()
);

create index idx_leads_org on public.leads(org_id);
create index idx_leads_stage on public.leads(stage_id);

create table if not exists public.attribution_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  source text not null,
  campaign_id uuid,
  content_id uuid,
  value_estimate numeric not null default 0,
  created_at timestamptz not null default now()
);

create index idx_attribution_events_org on public.attribution_events(org_id);

-- SEED DEFAULT CRM FUNCTION
-- ============================================================

create or replace function public.rpc_seed_default_crm(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pipeline_id uuid;
begin
  insert into crm_pipelines(org_id, name, is_default)
  values (p_org_id, 'Default Pipeline', true)
  returning id into v_pipeline_id;

  insert into crm_stages(pipeline_id, name, position) values
    (v_pipeline_id, 'New Lead', 1),
    (v_pipeline_id, 'Contacted', 2),
    (v_pipeline_id, 'Estimate/Quote', 3),
    (v_pipeline_id, 'Booked', 4),
    (v_pipeline_id, 'Won', 5),
    (v_pipeline_id, 'Lost', 6);
end $$;

-- ATTACH PARTNER REFERRAL FUNCTION
-- ============================================================

create or replace function public.rpc_attach_partner_referral_v2(
  p_merchant_org_id uuid,
  p_referral_id text,
  p_referral_name text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner_org_id uuid;
  v_rate numeric;
begin
  select referrer_partner_org_id into v_partner_org_id
  from referrals
  where referral_code = p_referral_id
  limit 1;

  if v_partner_org_id is null then return; end if;

  -- Determine rate from partner's current plan
  select (case
    when exists(select 1 from subscriptions s join plans p on p.id=s.plan_id where s.org_id=v_partner_org_id and p.name ilike '%Enterprise%') then 0.20
    when exists(select 1 from subscriptions s join plans p on p.id=s.plan_id where s.org_id=v_partner_org_id and p.name ilike '%Pro%') then 0.15
    else 0.10 end)
  into v_rate;

  insert into partner_relationships(partner_org_id, merchant_org_id, commission_rate)
  values (v_partner_org_id, p_merchant_org_id, v_rate)
  on conflict (partner_org_id, merchant_org_id) do nothing;

  -- Update merchant settings with referral info
  update merchant_settings
  set referral_name = p_referral_name,
      referral_id = p_referral_id::int
  where org_id = p_merchant_org_id;
end $$;

-- COMMISSION SPLIT CREATION (WITH UPLINE 7%)
-- ============================================================

create or replace function public.rpc_create_commission_splits_from_invoice(
  p_stripe_subscription_id text,
  p_invoice_id text,
  p_amount_paid bigint
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_merchant_org_id uuid;
  v_partner_org_id uuid;
  v_upline_partner_org_id uuid;
  v_partner_rate numeric;
  v_partner_amount numeric;
  v_upline_amount numeric;
  v_upline_active boolean;
begin
  -- Find merchant org
  select org_id into v_merchant_org_id
  from subscriptions
  where stripe_subscription_id = p_stripe_subscription_id
  limit 1;

  if v_merchant_org_id is null then return; end if;

  -- Find partner + rate
  select partner_org_id, commission_rate
  into v_partner_org_id, v_partner_rate
  from partner_relationships
  where merchant_org_id = v_merchant_org_id
  and status = 'active'
  limit 1;

  if v_partner_org_id is null then return; end if;

  v_partner_amount := (p_amount_paid::numeric / 100.0) * v_partner_rate;

  -- Insert partner commission
  insert into commission_splits(
    stripe_subscription_id, invoice_id, merchant_org_id,
    recipient_partner_org_id, role, rate, amount, status
  ) values (
    p_stripe_subscription_id, p_invoice_id, v_merchant_org_id,
    v_partner_org_id, 'partner', v_partner_rate, v_partner_amount, 'earned'
  );

  -- Check for upline
  select upline_partner_org_id into v_upline_partner_org_id
  from partner_uplines
  where child_partner_org_id = v_partner_org_id;

  if v_upline_partner_org_id is not null then
    -- Check if upline has active subscription
    select exists(
      select 1 from subscriptions
      where org_id = v_upline_partner_org_id
      and status = 'active'
    ) into v_upline_active;

    if v_upline_active then
      v_upline_amount := (p_amount_paid::numeric / 100.0) * 0.07;

      insert into commission_splits(
        stripe_subscription_id, invoice_id, merchant_org_id,
        recipient_partner_org_id, role, rate, amount, status
      ) values (
        p_stripe_subscription_id, p_invoice_id, v_merchant_org_id,
        v_upline_partner_org_id, 'upline', 0.07, v_upline_amount, 'earned'
      );
    end if;
  end if;
end $$;

-- DFY 30-DAY INSTALL FUNCTION
-- ============================================================

create or replace function public.rpc_install_dfy_30_days(
  p_org_id uuid,
  p_goal text,
  p_frequency int,
  p_channels text[]
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_industry text;
  v_template record;
  v_content_id uuid;
  v_campaign_id uuid;
  v_start date := current_date;
  v_end date := current_date + interval '30 days';
  v_count int := 0;
begin
  select industry into v_industry from merchant_settings where org_id = p_org_id;

  -- Create starter campaign
  insert into campaigns(org_id, template_id, name, goal, status, start_date, end_date)
  select p_org_id, id, name, p_goal, 'active', v_start, v_end
  from campaign_templates
  where industry in (v_industry, 'all')
  order by (case when industry = v_industry then 0 else 1 end), created_at desc
  limit 1
  returning id into v_campaign_id;

  -- Create 30 days of content
  for v_template in
    select * from content_templates
    where (industry = v_industry or industry = 'all')
      and format = 'post'
    order by random()
    limit (p_frequency * 4)
  loop
    insert into content_items(org_id, format, title, body, status, campaign_id)
    values (p_org_id, v_template.format, 'DFY Post', v_template.prompt, 'scheduled', v_campaign_id)
    returning id into v_content_id;

    insert into content_calendar(org_id, content_id, scheduled_for, channels)
    values (p_org_id, v_content_id, (now() + (v_count * interval '2 days')), p_channels);

    v_count := v_count + 1;
  end loop;

  return jsonb_build_object(
    'campaign_id', v_campaign_id,
    'scheduled_posts', v_count
  );
end $$;
