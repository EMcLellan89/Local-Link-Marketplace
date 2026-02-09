/*
  # Financial Engine - Helper Functions & RLS Policies

  1. Helper Functions
    - is_merchant_member() - Check if user is a merchant member
    - is_assigned_provider() - Check if user is assigned provider
    
  2. RLS Policies
    - Merchant access for members
    - Provider access for assigned providers
*/

-- Helper function: check if user is merchant member
create or replace function is_merchant_member(m_id uuid)
returns boolean
language sql stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from merchant_members mm
    where mm.merchant_id = m_id and mm.user_id = auth.uid()
  );
$$;

-- Helper function: check if user is assigned provider
create or replace function is_assigned_provider(m_id uuid)
returns boolean
language sql stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from providers p
    join provider_assignments pa on pa.provider_id = p.id
    where p.user_id = auth.uid()
      and pa.merchant_id = m_id
      and pa.status = 'active'
      and p.status = 'approved'
  );
$$;

-- RLS Policies for merchants
create policy "merchant members can view merchant"
on merchants for select
using (is_merchant_member(id));

create policy "merchant members can view memberships"
on merchant_members for select
using (user_id = auth.uid() or is_merchant_member(merchant_id));

-- RLS for providers
create policy "providers can view their profile"
on providers for select
using (user_id = auth.uid());

create policy "providers can view assignments"
on provider_assignments for select
using (is_assigned_provider(merchant_id) or is_merchant_member(merchant_id));
