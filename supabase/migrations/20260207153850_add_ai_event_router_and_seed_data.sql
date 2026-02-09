/*
  # AI Event Router and Seed Data
  
  1. Functions
    - `ai_route_event_to_jobs()` - Automatically creates jobs from events
    - `ai_emit_event()` - Helper to emit events from app code
    
  2. Seed Data
    - Register core AI agents
    - Add prompt templates
    - Set default configurations
*/

-- Event → Job Router
create or replace function ai_route_event_to_jobs()
returns trigger language plpgsql
security definer
set search_path = public
as $$
declare
  k text;
begin
  -- LEADS / SALES PIPELINE
  if new.event_type = 'LEAD_CREATED' then
    k := 'lead:' || new.entity_id::text;

    insert into ai_jobs(job_type, priority, run_at, idempotency_key, context)
    values
      ('QUALIFY_LEAD', 1, now(), k || ':qualify', jsonb_build_object('lead_id', new.entity_id, 'partner_id', new.payload->>'partner_id')),
      ('MATCH_OFFER',  2, now(), k || ':match',   jsonb_build_object('lead_id', new.entity_id)),
      ('SCHEDULE_NURTURE_SEQUENCE', 3, now(), k || ':nurture', jsonb_build_object('lead_id', new.entity_id))
    on conflict (idempotency_key) do nothing;
  end if;

  -- CHECKOUT / BILLING
  if new.event_type = 'CHECKOUT_COMPLETED' then
    k := 'checkout:' || new.entity_id::text;

    insert into ai_jobs(job_type, priority, run_at, idempotency_key, context)
    values
      ('ONBOARD_CLIENT', 1, now(), k||':onboard', new.payload),
      ('REQUEST_REVIEW', 6, now() + interval '7 days', k||':review', new.payload)
    on conflict (idempotency_key) do nothing;
  end if;

  -- FINANCIAL ENGINE
  if new.event_type = 'MONTH_CLOSE_DUE' then
    k := 'monthclose:' || new.entity_id::text;
    insert into ai_jobs(job_type, priority, run_at, idempotency_key, context)
    values
      ('RISK_SCAN', 2, now(), k||':risk', new.payload),
      ('GENERATE_PNL', 2, now(), k||':pnl', new.payload)
    on conflict (idempotency_key) do nothing;
  end if;

  -- SUPPORT TICKETS
  if new.event_type = 'TICKET_CREATED' then
    k := 'ticket:' || new.entity_id::text;
    insert into ai_jobs(job_type, priority, run_at, idempotency_key, context)
    values ('SUPPORT_TRIAGE', 2, now(), k||':triage', new.payload)
    on conflict (idempotency_key) do nothing;
  end if;

  return new;
end $$;

drop trigger if exists trg_ai_route_events on ai_events;
create trigger trg_ai_route_events
after insert on ai_events
for each row execute function ai_route_event_to_jobs();

-- Helper function to emit events
create or replace function ai_emit_event(
  p_event_type text,
  p_entity_type text,
  p_entity_id uuid,
  p_actor_user_id uuid,
  p_payload jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare eid uuid;
begin
  insert into ai_events(event_type, entity_type, entity_id, actor_user_id, payload)
  values (p_event_type, p_entity_type, p_entity_id, p_actor_user_id, coalesce(p_payload,'{}'::jsonb))
  returning id into eid;

  return eid;
end $$;

-- Seed AI Agents
insert into ai_agents(agent_key, description, enabled, default_model, max_tokens, temperature) values
('QualifyBot','Qualifies leads and scores intent', true, 'gpt-4o-mini', 700, 0.2),
('MatchBot','Matches leads to best product bundle', true, 'gpt-4o-mini', 700, 0.2),
('DealBot','Builds proposals and checkout links', true, 'gpt-4o-mini', 900, 0.2),
('NurtureBot','Manages follow-up sequences', true, 'gpt-4o-mini', 700, 0.2),
('OnboardBot','Guides client onboarding', true, 'gpt-4o-mini', 900, 0.2),
('HelpBot','Support triage and answers', true, 'gpt-4o-mini', 700, 0.2),
('RiskBot','Scans for compliance issues', true, 'gpt-4o-mini', 700, 0.1),
('AuditBot','Generates audit packets', true, 'gpt-4o-mini', 700, 0.2),
('UpsellBot','Detects upsell opportunities', true, 'gpt-4o-mini', 700, 0.2),
('ChiefBot','Daily executive briefing', true, 'gpt-4o-mini', 900, 0.2)
on conflict (agent_key) do nothing;

-- Seed Prompt Templates
insert into ai_prompt_templates(template_key, description, system_prompt, user_prompt, output_schema)
values (
'QUALIFY_LEAD_V1',
'Qualify lead and assign score + next action',
'You are QualifyBot for Local-Link. Be concise. Do not give legal/tax advice. Output STRICT JSON only.',
'Lead JSON:\n{{lead_json}}\n\nReturn JSON with:\n{ "score":0-100, "summary":"", "best_next_step":"", "questions":[], "notes":"" }',
'{"type":"object","properties":{"score":{"type":"integer"},"summary":{"type":"string"},"best_next_step":{"type":"string"},"questions":{"type":"array"},"notes":{"type":"string"}},"required":["score","summary","best_next_step","notes"]}'
)
on conflict (template_key) do update set
system_prompt=excluded.system_prompt,
user_prompt=excluded.user_prompt,
output_schema=excluded.output_schema,
is_active=true;
