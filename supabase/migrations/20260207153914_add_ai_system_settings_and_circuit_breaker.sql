/*
  # AI System Settings and Circuit Breaker
  
  1. Tables
    - `ai_system_settings` - Global controls and kill switch
    - `ai_circuit_breaker` - Auto-throttling state
    - `ai_health_snapshots` - Health metrics over time
    - `comm_outbox_dead` - Dead letter queue for failed messages
    
  2. Views
    - `ai_health_15m` - Rolling 15-minute health metrics
*/

-- Global system settings
create table if not exists ai_system_settings (
  id int primary key default 1,
  bots_enabled boolean not null default true,
  safety_mode text not null default 'normal' check (safety_mode in ('normal','conservative','lockdown')),
  max_jobs_per_run int not null default 50,
  fail_rate_open_threshold numeric not null default 0.15,
  comm_fail_rate_open_threshold numeric not null default 0.10,
  min_events_for_eval int not null default 25,
  throttle_jobs_per_run int not null default 10,
  keep_failed_outbox_rows boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into ai_system_settings (id) values (1)
on conflict (id) do nothing;

drop trigger if exists trg_ai_settings_updated_at on ai_system_settings;
create trigger trg_ai_settings_updated_at
before update on ai_system_settings
for each row execute function set_updated_at();

-- Circuit breaker state
create table if not exists ai_circuit_breaker (
  id int primary key default 1,
  state text not null default 'closed' check (state in ('closed','open','half_open')),
  reason text,
  opened_at timestamptz,
  cooldown_minutes int not null default 30,
  last_eval_at timestamptz,
  last_fail_rate numeric,
  last_comm_fail_rate numeric,
  auto_recovery boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into ai_circuit_breaker (id) values (1)
on conflict (id) do nothing;

drop trigger if exists trg_ai_cb_updated_at on ai_circuit_breaker;
create trigger trg_ai_cb_updated_at
before update on ai_circuit_breaker
for each row execute function set_updated_at();

-- Health snapshots
create table if not exists ai_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  window_minutes int not null default 15,
  ts timestamptz not null default now(),
  jobs_total int not null default 0,
  jobs_failed int not null default 0,
  jobs_fail_rate numeric not null default 0,
  comm_total int not null default 0,
  comm_failed int not null default 0,
  comm_fail_rate numeric not null default 0,
  created_at timestamptz default now()
);

create index if not exists ai_health_snapshots_ts_idx on ai_health_snapshots(ts desc);

-- Dead letter queue
create table if not exists comm_outbox_dead (
  id uuid primary key default gen_random_uuid(),
  original_outbox_id uuid,
  channel text not null check (channel in ('sms','email')),
  to_address text not null,
  subject text,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  provider text,
  last_error text,
  attempts int not null default 0,
  max_attempts int not null default 5,
  failed_at timestamptz not null default now(),
  status text not null default 'dead' check (status in ('dead','resent','suppressed')),
  admin_note text,
  acted_by uuid,
  acted_at timestamptz
);

create index if not exists comm_outbox_dead_failed_idx
on comm_outbox_dead(status, failed_at desc);

-- Rolling health view (15 minutes)
create or replace view ai_health_15m as
with j as (
  select
    count(*) as jobs_total,
    sum(case when status='failed' then 1 else 0 end) as jobs_failed
  from ai_runs
  where started_at >= now() - interval '15 minutes'
),
c as (
  select
    count(*) as comm_total,
    sum(case when status='failed' then 1 else 0 end) as comm_failed
  from comm_outbox
  where created_at >= now() - interval '15 minutes'
)
select
  15 as window_minutes,
  now() as ts,
  j.jobs_total,
  j.jobs_failed,
  case when j.jobs_total=0 then 0 else (j.jobs_failed::numeric / j.jobs_total::numeric) end as jobs_fail_rate,
  c.comm_total,
  c.comm_failed,
  case when c.comm_total=0 then 0 else (c.comm_failed::numeric / c.comm_total::numeric) end as comm_fail_rate
from j, c;

-- RLS Policies
alter table ai_system_settings enable row level security;
alter table ai_circuit_breaker enable row level security;
alter table ai_health_snapshots enable row level security;
alter table comm_outbox_dead enable row level security;

create policy "Admin access to system settings"
  on ai_system_settings for all
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin access to circuit breaker"
  on ai_circuit_breaker for all
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin access to health snapshots"
  on ai_health_snapshots for all
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin access to dead letter queue"
  on comm_outbox_dead for all
  using (auth.jwt()->>'role' = 'admin');
