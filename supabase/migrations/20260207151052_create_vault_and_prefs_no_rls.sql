/*
  # Create Vault & Prefs Tables (No RLS Yet)

  Create tables first, add RLS policies later
*/

-- Audit log table (no RLS needed - internal only)
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  action text not null,
  record_id uuid,
  merchant_id uuid,
  actor_user_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz default now()
);

create index if not exists audit_log_merchant_idx on audit_log(merchant_id, created_at desc);

-- Client vault artifacts
create table if not exists client_vault_artifacts (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  artifact_type text not null,
  year int,
  month int,
  file_path text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Notification preferences
create table if not exists notification_preferences (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  email_enabled boolean not null default true,
  sms_enabled boolean not null default false,
  sms_phone text,
  weekly_day int not null default 1,
  created_at timestamptz default now(),
  unique (merchant_id)
);

-- Partner earnings simulator
create table if not exists partner_earnings_simulator (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  plan_code text not null references plan_pricing(code),
  client_count int not null default 0,
  created_at timestamptz default now(),
  unique (partner_id, plan_code)
);

-- Partner certifications
create table if not exists partner_certifications (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  certification_code text not null,
  awarded_at timestamptz default now(),
  unique (partner_id, certification_code)
);
