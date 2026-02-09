/*
  # Add Missing Foreign Key Indexes - Security Audit Batch 4

  1. Purpose
    - Continue adding missing foreign key indexes
    
  2. Tables Updated (Batch 4 - Partner tables continued)
    - partner_deal_sync_log
    - partner_dfy_tracking_links
    - partner_milestone_badges
    - partner_milestone_certs
    - partner_outreach_logs
    - partner_playbook_completions
    - partner_quarterly_taxes
    - partner_service_qualifications
    - partner_tax_payments
    - partner_tax_settings
    - partner_team_members
    - partner_tracking_links
    - partner_uplines
    - profit_network_enrollments
    - project_assignments
    - purchases
    - redemptions
*/

-- Partner deal sync
CREATE INDEX IF NOT EXISTS idx_partner_deal_sync_log_partner_deal_id
  ON partner_deal_sync_log(partner_deal_id);

-- Partner DFY tracking
CREATE INDEX IF NOT EXISTS idx_partner_dfy_tracking_links_product_id
  ON partner_dfy_tracking_links(product_id);

-- Partner milestones
CREATE INDEX IF NOT EXISTS idx_partner_milestone_badges_badge_id
  ON partner_milestone_badges(badge_id);

CREATE INDEX IF NOT EXISTS idx_partner_milestone_certs_cert_id
  ON partner_milestone_certs(cert_id);

-- Partner outreach
CREATE INDEX IF NOT EXISTS idx_partner_outreach_logs_partner_id
  ON partner_outreach_logs(partner_id);

-- Partner playbooks
CREATE INDEX IF NOT EXISTS idx_partner_playbook_completions_playbook_id
  ON partner_playbook_completions(playbook_id);

-- Partner taxes
CREATE INDEX IF NOT EXISTS idx_partner_quarterly_taxes_bank_account_id
  ON partner_quarterly_taxes(bank_account_id);

-- Partner services
CREATE INDEX IF NOT EXISTS idx_partner_service_qualifications_service_id
  ON partner_service_qualifications(service_id);

-- Partner tax payments
CREATE INDEX IF NOT EXISTS idx_partner_tax_payments_bank_account_id
  ON partner_tax_payments(bank_account_id);

CREATE INDEX IF NOT EXISTS idx_partner_tax_settings_autopay_bank_account_id
  ON partner_tax_settings(autopay_bank_account_id);

-- Partner team
CREATE INDEX IF NOT EXISTS idx_partner_team_members_partner_id
  ON partner_team_members(partner_id);

CREATE INDEX IF NOT EXISTS idx_partner_team_members_user_id
  ON partner_team_members(user_id);

-- Partner tracking
CREATE INDEX IF NOT EXISTS idx_partner_tracking_links_product_slug
  ON partner_tracking_links(product_slug);

-- Partner uplines
CREATE INDEX IF NOT EXISTS idx_partner_uplines_upline_partner_id
  ON partner_uplines(upline_partner_id);

-- Profit network
CREATE INDEX IF NOT EXISTS idx_profit_network_enrollments_approved_by
  ON profit_network_enrollments(approved_by);

-- Projects
CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id
  ON project_assignments(project_id);

-- Purchases
CREATE INDEX IF NOT EXISTS idx_purchases_customer_id
  ON purchases(customer_id);

CREATE INDEX IF NOT EXISTS idx_purchases_deal_id
  ON purchases(deal_id);

-- Redemptions
CREATE INDEX IF NOT EXISTS idx_redemptions_purchase_id
  ON redemptions(purchase_id);
