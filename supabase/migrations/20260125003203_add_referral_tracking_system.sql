/*
  # Add Referral Tracking System

  This migration adds a comprehensive referral tracking system for partner attribution.

  ## Key Features
  1. Referral ID# + Name captured on all partner-referred transactions
  2. ID 2428 permanently reserved (silent lifetime-free trigger)
  3. Referral data stored on profiles, checkout sessions, and orders
  4. Full attribution chain for commission tracking

  ## Changes
  
  ### Profiles
  - Add referral_name and referral_id columns for user signup attribution
  
  ### Partners
  - Ensure referral_id column exists with unique constraint
  
  ### Checkout Sessions
  - Add referral_name and referral_id columns for attribution tracking
  
  ### Orders
  - Add referral_name and referral_id columns for permanent audit trail
  
  ### Marketplace Checkout Sessions
  - Add referral_name and referral_id columns
  
  ## Security
  - No RLS changes needed (inherits from parent tables)
  - referral_id=2428 is checked in application logic (grants lifetime free)
*/

-- Add referral tracking to profiles (signup attribution)
alter table public.profiles
add column if not exists referral_name text,
add column if not exists referral_id int;

create index if not exists idx_profiles_referral_id
on public.profiles(referral_id)
where referral_id is not null;

-- Ensure partners table has referral_id with unique constraint
alter table public.partners
add column if not exists referral_id int unique;

create index if not exists idx_partners_referral_id
on public.partners(referral_id)
where referral_id is not null;

-- Add referral tracking to marketplace_checkout_sessions
alter table public.marketplace_checkout_sessions
add column if not exists referral_name text,
add column if not exists referral_id int;

create index if not exists idx_marketplace_checkout_sessions_referral_id
on public.marketplace_checkout_sessions(referral_id)
where referral_id is not null;

-- Add referral tracking to marketplace_orders (if table exists)
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'marketplace_orders'
  ) then
    alter table public.marketplace_orders
    add column if not exists referral_name text,
    add column if not exists referral_id int;

    create index if not exists idx_marketplace_orders_referral_id
    on public.marketplace_orders(referral_id)
    where referral_id is not null;
  end if;
end $$;

-- Add referral tracking to orders table (if exists)
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'orders'
  ) then
    alter table public.orders
    add column if not exists referral_name text,
    add column if not exists referral_id int;

    create index if not exists idx_orders_referral_id
    on public.orders(referral_id)
    where referral_id is not null;
  end if;
end $$;

-- Create sequence for auto-generating partner referral IDs (starts at 3000, never reaches 2428)
create sequence if not exists public.partner_referral_id_seq
start with 3000
increment by 1;

-- Helper function to get next partner referral ID
create or replace function public.next_partner_referral_id()
returns bigint
language sql
security definer
set search_path = public
as $$
  select nextval('public.partner_referral_id_seq');
$$;

-- Helper function to validate referral (used by application logic)
create or replace function public.validate_referral(
  p_referral_id int default null,
  p_ref_slug text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner record;
  v_result jsonb;
begin
  -- Special case: 2428 is always valid (silent lifetime-free trigger)
  if p_referral_id = 2428 then
    return jsonb_build_object(
      'valid', true,
      'referral_id', 2428,
      'partner_id', null,
      'grants_lifetime_free', true
    );
  end if;

  -- Try to resolve by referral_id first
  if p_referral_id is not null then
    select * into v_partner
    from public.partners
    where referral_id = p_referral_id
    and status = 'active';

    if found then
      return jsonb_build_object(
        'valid', true,
        'referral_id', v_partner.referral_id,
        'partner_id', v_partner.id,
        'partner_name', v_partner.display_name,
        'tier', v_partner.tier,
        'grants_lifetime_free', false
      );
    end if;
  end if;

  -- Try to resolve by partner slug
  if p_ref_slug is not null then
    select * into v_partner
    from public.partners
    where referral_partner_link_slug = p_ref_slug
    and status = 'active';

    if found then
      return jsonb_build_object(
        'valid', true,
        'referral_id', v_partner.referral_id,
        'partner_id', v_partner.id,
        'partner_name', v_partner.display_name,
        'tier', v_partner.tier,
        'grants_lifetime_free', false
      );
    end if;
  end if;

  -- No valid referral found
  return jsonb_build_object(
    'valid', false,
    'error', 'Invalid referral'
  );
end;
$$;
