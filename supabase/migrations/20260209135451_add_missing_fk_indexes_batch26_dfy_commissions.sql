/*
  # Add Missing Foreign Key Indexes - Batch 26: DFY Intakes & Commissions

  1. Changes
    - Add indexes for dfy_intakes (merchant_id, provider_id)
    - Add indexes for dfy_updates (intake_id)
    - Add indexes for cleanup_quote_requests (merchant_id, partner_id)
    - Add indexes for commissions (merchant_id, partner_id)
    - Add indexes for client_vault_artifacts (merchant_id)
    - Add indexes for partner_earnings_simulator (plan_code)
    
  2. Rationale
    - DFY services require merchant and provider lookups
    - Commission tracking needs partner queries
    - Quote requests need merchant filtering
    
  3. Performance Impact
    - Faster DFY intake processing
    - Better commission calculations
    - Improved quote management
*/

-- DFY Intakes
CREATE INDEX IF NOT EXISTS idx_dfy_intakes_merchant_id ON dfy_intakes(merchant_id);
CREATE INDEX IF NOT EXISTS idx_dfy_intakes_provider_id ON dfy_intakes(provider_id);

-- DFY Updates
CREATE INDEX IF NOT EXISTS idx_dfy_updates_intake_id ON dfy_updates(intake_id);

-- Cleanup Quote Requests
CREATE INDEX IF NOT EXISTS idx_cleanup_quote_requests_merchant_id ON cleanup_quote_requests(merchant_id);
CREATE INDEX IF NOT EXISTS idx_cleanup_quote_requests_partner_id ON cleanup_quote_requests(partner_id);

-- Commissions
CREATE INDEX IF NOT EXISTS idx_commissions_merchant_id ON commissions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_commissions_partner_id ON commissions(partner_id);

-- Client Vault Artifacts
CREATE INDEX IF NOT EXISTS idx_client_vault_artifacts_merchant_id ON client_vault_artifacts(merchant_id);

-- Partner Earnings Simulator
CREATE INDEX IF NOT EXISTS idx_partner_earnings_simulator_plan_code ON partner_earnings_simulator(plan_code);
