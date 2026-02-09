/*
  # Multi-Tenant Organization Tables
  
  Step-by-step table creation.
*/

-- Organizations table
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('merchant', 'partner', 'internal')),
  name text not null,
  timezone text not null default 'America/New_York',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Org membership
create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'merchant', 'partner', 'staff')),
  created_at timestamptz not null default now(),
  unique(org_id, profile_id)
);

-- Merchant settings
create table if not exists public.merchant_settings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique references public.organizations(id) on delete cascade,
  industry text,
  service_area text[],
  phone text,
  website text,
  logo_url text,
  primary_offer text,
  onboarding_complete boolean not null default false,
  referral_name text,
  referral_id int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Partner relationships
create table if not exists public.partner_relationships (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.organizations(id) on delete cascade,
  merchant_org_id uuid not null references public.organizations(id) on delete cascade,
  commission_rate numeric not null default 0.10,
  status text not null default 'active' check (status in ('active', 'paused', 'terminated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(partner_org_id, merchant_org_id)
);
