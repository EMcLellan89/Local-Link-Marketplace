/*
  # Add Missing Foreign Key Indexes - Batch 27: LocalLink & AutoScale

  1. Changes
    - Add indexes for ai_runs (job_id)
    - Add indexes for ll_brand_profiles (partner_id)
    - Add indexes for ll_autoscale_clients (brand_profile_id, partner_id)
    - Add indexes for ll_autoscale_workflows (client_id)
    - Add indexes for ll_autoscale_bot_runs (client_id)
    - Add indexes for ll_comm_outbox (client_id)
    - Add indexes for ll_circuit_breakers (client_id)
    - Add indexes for ll_partner_commission_rules (partner_id)
    - Add indexes for partner_special_overrides (approved_by)
    
  2. Rationale
    - LocalLink AutoScale requires efficient client queries
    - Brand profiles need partner lookups
    - Circuit breakers need client filtering
    
  3. Performance Impact
    - Faster AutoScale workflow execution
    - Better brand profile management
    - Improved commission rule queries
*/

-- AI Runs
CREATE INDEX IF NOT EXISTS idx_ai_runs_job_id ON ai_runs(job_id);

-- LocalLink Brand Profiles
CREATE INDEX IF NOT EXISTS idx_ll_brand_profiles_partner_id ON ll_brand_profiles(partner_id);

-- LocalLink AutoScale Clients
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_clients_brand_profile_id ON ll_autoscale_clients(brand_profile_id);
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_clients_partner_id ON ll_autoscale_clients(partner_id);

-- LocalLink AutoScale Workflows
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_workflows_client_id ON ll_autoscale_workflows(client_id);

-- LocalLink AutoScale Bot Runs
CREATE INDEX IF NOT EXISTS idx_ll_autoscale_bot_runs_client_id ON ll_autoscale_bot_runs(client_id);

-- LocalLink Communications Outbox
CREATE INDEX IF NOT EXISTS idx_ll_comm_outbox_client_id ON ll_comm_outbox(client_id);

-- LocalLink Circuit Breakers
CREATE INDEX IF NOT EXISTS idx_ll_circuit_breakers_client_id ON ll_circuit_breakers(client_id);

-- LocalLink Partner Commission Rules
CREATE INDEX IF NOT EXISTS idx_ll_partner_commission_rules_partner_id ON ll_partner_commission_rules(partner_id);

-- Partner Special Overrides
CREATE INDEX IF NOT EXISTS idx_partner_special_overrides_approved_by ON partner_special_overrides(approved_by);
