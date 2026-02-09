/*
  # Add Missing Foreign Key Indexes - Batch 8: Partner System Tables
  
  1. Performance Optimization
    - Adds indexes to unindexed foreign key columns for partner-related tables
  
  2. Tables Covered
    - partner_agreement_acceptances (user_id)
    - partner_agreements (partner_id)
    - partner_applications (reviewed_by)
    - partner_assets (partner_id)
    - partner_campaigns (partner_id)
    - partner_crm_contacts (partner_id)
    - partner_crm_deals (contact_id, partner_id)
    - partner_outreach_logs (partner_id)
    - partner_tax_payments (partner_id)
    - partner_team_members (user_id)
    - partners (user_id)
*/

DO $$
BEGIN
  -- Partner agreements
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_agreement_acceptances' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_agreement_acceptances_user_id ON partner_agreement_acceptances(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_agreements' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_agreements_partner_id ON partner_agreements(partner_id);
  END IF;
  
  -- Partner applications
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_applications' AND column_name = 'reviewed_by') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_applications_reviewed_by ON partner_applications(reviewed_by);
  END IF;
  
  -- Partner assets and campaigns
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_assets' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_assets_partner_id ON partner_assets(partner_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_campaigns' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_campaigns_partner_id ON partner_campaigns(partner_id);
  END IF;
  
  -- Partner CRM
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_crm_contacts' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_crm_contacts_partner_id ON partner_crm_contacts(partner_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_crm_deals' AND column_name = 'contact_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_contact_id ON partner_crm_deals(contact_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_crm_deals' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_crm_deals_partner_id ON partner_crm_deals(partner_id);
  END IF;
  
  -- Partner outreach and tax
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_outreach_logs' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_outreach_logs_partner_id ON partner_outreach_logs(partner_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_tax_payments' AND column_name = 'partner_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_partner_id ON partner_tax_payments(partner_id);
  END IF;
  
  -- Partner team
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_team_members' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partner_team_members_user_id ON partner_team_members(user_id);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
  END IF;
END $$;