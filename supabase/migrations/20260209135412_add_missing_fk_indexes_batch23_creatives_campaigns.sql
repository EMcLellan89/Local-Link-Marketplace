/*
  # Add Missing Foreign Key Indexes - Batch 23: Creatives & Partner Campaigns

  1. Changes
    - Add indexes for creative_events (creative_id, partner_id, profile_id)
    - Add indexes for creative_tests (partner_id, winner_creative_id)
    - Add indexes for weekly_creative_winners (creative_id)
    - Add indexes for partner_campaigns (creative_id, partner_id)
    - Add indexes for partner_ledger (campaign_id, partner_id)
    - Add indexes for sales_events (attributed_partner_id)
    - Add indexes for referral_attribution (attributed_partner_id)
    
  2. Rationale
    - Creative tracking requires efficient event logging
    - Campaign management needs partner and creative lookups
    - Attribution tracking needs partner queries
    
  3. Performance Impact
    - Faster creative performance queries
    - Better campaign ROI tracking
    - Improved attribution reporting
*/

-- Creative Events
CREATE INDEX IF NOT EXISTS idx_creative_events_creative_id ON creative_events(creative_id);
CREATE INDEX IF NOT EXISTS idx_creative_events_partner_id ON creative_events(partner_id);
CREATE INDEX IF NOT EXISTS idx_creative_events_profile_id ON creative_events(profile_id);

-- Creative Tests
CREATE INDEX IF NOT EXISTS idx_creative_tests_partner_id ON creative_tests(partner_id);
CREATE INDEX IF NOT EXISTS idx_creative_tests_winner_creative_id ON creative_tests(winner_creative_id);

-- Weekly Creative Winners
CREATE INDEX IF NOT EXISTS idx_weekly_creative_winners_creative_id ON weekly_creative_winners(creative_id);

-- Partner Campaigns
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_creative_id ON partner_campaigns(creative_id);
CREATE INDEX IF NOT EXISTS idx_partner_campaigns_partner_id ON partner_campaigns(partner_id);

-- Partner Ledger
CREATE INDEX IF NOT EXISTS idx_partner_ledger_campaign_id ON partner_ledger(campaign_id);
CREATE INDEX IF NOT EXISTS idx_partner_ledger_partner_id ON partner_ledger(partner_id);

-- Sales Events & Attribution
CREATE INDEX IF NOT EXISTS idx_sales_events_attributed_partner_id ON sales_events(attributed_partner_id);
CREATE INDEX IF NOT EXISTS idx_referral_attribution_attributed_partner_id ON referral_attribution(attributed_partner_id);
