/*
  # Financial Engine - Core Tables (Fixed Dependencies)

  1. Core Entities
    - `merchants` - Business accounts
    - `providers` - Bookkeepers/firms who deliver services
    - `merchant_members` - Team access to merchant accounts
    - `provider_assignments` - Provider-merchant relationships

  2. Security
    - Enable RLS on all tables
    - Helper functions after all tables exist
*/

-- Core merchant entity
create table if not exists merchants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  industry text,
  created_at timestamptz default now()
);

alter table merchants enable row level security;

-- Providers (bookkeepers/firms)
create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  business_name text not null,
  contact_email text,
  contact_phone text,
  status text not null default 'pending' check (status in ('pending','approved','paused','suspended')),
  created_at timestamptz default now()
);

alter table providers enable row level security;

-- Merchant team members
create table if not exists merchant_members (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('merchant_owner','merchant_staff','accountant')),
  created_at timestamptz default now(),
  unique (merchant_id, user_id)
);

alter table merchant_members enable row level security;

-- Provider assignments (needed before helper functions)
create table if not exists provider_assignments (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  provider_id uuid not null references providers(id) on delete cascade,
  status text not null default 'active' check (status in ('active','paused','ended')),
  created_at timestamptz default now(),
  unique (merchant_id, provider_id)
);

alter table provider_assignments enable row level security;

-- Indexes
create index if not exists merchants_email_idx on merchants(email);
create index if not exists merchant_members_user_idx on merchant_members(user_id);
create index if not exists merchant_members_merchant_idx on merchant_members(merchant_id);
create index if not exists providers_user_idx on providers(user_id);
create index if not exists provider_assignments_merchant_idx on provider_assignments(merchant_id);
create index if not exists provider_assignments_provider_idx on provider_assignments(provider_id);
