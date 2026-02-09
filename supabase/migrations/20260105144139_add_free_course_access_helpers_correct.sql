/*
  # Add Free Course Access Helpers

  Creates helper functions and logic for:
  1. Auto-granting Reviews course to Pro subscribers
  2. Auto-granting Partner Accelerator to approved partners
  3. Checking subscription and partner status
*/

-- Function to check if user has active Pro subscription
create or replace function public.has_active_pro_subscription(p_user_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.user_subscriptions
    where user_id = p_user_id
      and plan_slug = 'local-link-pro'
      and status in ('active', 'trialing')
  );
$$;

-- Function to check if user is approved partner
create or replace function public.is_approved_partner(p_user_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.partners
    where user_id = p_user_id
      and status = 'Active'
  );
$$;

-- Function to grant free course access based on entitlements
create or replace function public.sync_free_course_access(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  has_pro boolean;
  is_partner boolean;
begin
  -- Check conditions
  select public.has_active_pro_subscription(p_user_id) into has_pro;
  select public.is_approved_partner(p_user_id) into is_partner;

  -- Grant Reviews course if Pro
  if has_pro then
    insert into public.user_entitlements(user_id, entitlement, source)
    values (p_user_id, 'course_access', 'reviews-course-pro-bonus')
    on conflict (user_id, entitlement) do nothing;

    insert into public.enrollments(user_id, course_slug, product_slug, status)
    values (p_user_id, 'reviews-that-convert', 'reviews-course', 'active')
    on conflict (user_id, course_slug) do update set status = 'active';
  end if;

  -- Grant Partner Accelerator if partner
  if is_partner then
    insert into public.user_entitlements(user_id, entitlement, source)
    values (p_user_id, 'course_access', 'partner-accelerator-role-bonus')
    on conflict (user_id, entitlement) do nothing;

    insert into public.enrollments(user_id, course_slug, product_slug, status)
    values (p_user_id, 'partner-accelerator', 'partner-accelerator', 'active')
    on conflict (user_id, course_slug) do update set status = 'active';
  end if;
end $$;

-- Grant execute permissions
grant execute on function public.has_active_pro_subscription(uuid) to authenticated;
grant execute on function public.is_approved_partner(uuid) to authenticated;
grant execute on function public.sync_free_course_access(uuid) to authenticated;
