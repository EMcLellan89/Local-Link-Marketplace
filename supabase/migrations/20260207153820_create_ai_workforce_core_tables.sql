/*
  # AI Workforce Core Tables
  
  1. New Tables
    - `ai_events` - Event stream for triggering bot workflows
    - `ai_jobs` - Job queue for bot execution
    - `ai_runs` - Execution logs and metrics
    - `ai_prompt_templates` - Reusable prompt templates
    - `ai_agents` - Bot registry and configuration
    - `comm_outbox` - Communication queue for SMS/Email
    - `audit_actions_log` - Comprehensive audit trail
    
  2. Security
    - Enable RLS on all tables
    - Create indexes for performance
    - Add idempotency support
*/

-- Event stream: "something happened"
create table if not exists ai_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  entity_type text not null,
  entity_id uuid not null,
  actor_user_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists ai_events_type_idx on ai_events(event_type, created_at desc);
create index if not exists ai_events_entity_idx on ai_events(entity_type, entity_id, created_at desc);

-- Job queue: "work to be done"
create table if not exists ai_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  priority int not null default 5,
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed','cancelled')),
  run_at timestamptz not null default now(),
  locked_at timestamptz,
  locked_by text,
  attempts int not null default 0,
  max_attempts int not null default 5,
  idempotency_key text,
  context jsonb not null default '{}'::jsonb,
  last_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists ai_jobs_due_idx on ai_jobs(status, run_at, priority);
create unique index if not exists ai_jobs_idempotency_uniq on ai_jobs(idempotency_key) where idempotency_key is not null;

-- Run log: "what happened"
create table if not exists ai_runs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references ai_jobs(id) on delete cascade,
  job_type text not null,
  status text not null check (status in ('succeeded','failed')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  model text,
  tokens_in int,
  tokens_out int,
  output jsonb not null default '{}'::jsonb,
  error text
);

create index if not exists ai_runs_job_idx on ai_runs(job_id, started_at desc);

-- Prompt templates by bot + task
create table if not exists ai_prompt_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  description text,
  system_prompt text not null,
  user_prompt text not null,
  output_schema jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Agent registry
create table if not exists ai_agents (
  id uuid primary key default gen_random_uuid(),
  agent_key text not null unique,
  description text,
  enabled boolean not null default true,
  default_model text not null default 'gpt-4o-mini',
  max_tokens int not null default 900,
  temperature numeric not null default 0.2,
  created_at timestamptz default now()
);

-- Communication outbox
create table if not exists comm_outbox (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('sms','email')),
  to_address text not null,
  subject text,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued','sent','failed')),
  provider text,
  provider_message_id text,
  last_error text,
  attempts int not null default 0,
  max_attempts int not null default 5,
  next_retry_at timestamptz,
  created_at timestamptz default now(),
  sent_at timestamptz
);

create index if not exists comm_outbox_due_idx on comm_outbox(status, next_retry_at, created_at);

-- Central audit log
create table if not exists audit_actions_log (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null,
  actor_key text,
  action_type text not null,
  entity_type text not null,
  entity_id uuid not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists audit_actions_entity_idx on audit_actions_log(entity_type, entity_id, created_at desc);

-- Trigger for updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_ai_jobs_updated_at on ai_jobs;
create trigger trg_ai_jobs_updated_at
before update on ai_jobs
for each row execute function set_updated_at();

-- RLS Policies
alter table ai_events enable row level security;
alter table ai_jobs enable row level security;
alter table ai_runs enable row level security;
alter table ai_prompt_templates enable row level security;
alter table ai_agents enable row level security;
alter table comm_outbox enable row level security;
alter table audit_actions_log enable row level security;

-- Admin-only access for AI tables
create policy "Admin full access to ai_events"
  on ai_events for all
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin full access to ai_jobs"
  on ai_jobs for all
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin full access to ai_runs"
  on ai_runs for all
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin full access to templates"
  on ai_prompt_templates for all
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin full access to agents"
  on ai_agents for all
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin full access to comm_outbox"
  on comm_outbox for all
  using (auth.jwt()->>'role' = 'admin');

create policy "Admin full access to audit log"
  on audit_actions_log for all
  using (auth.jwt()->>'role' = 'admin');
