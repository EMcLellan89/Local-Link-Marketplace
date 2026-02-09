/*
  # Fix Missing Foreign Key Indexes - Batch 2 (Admin & Affiliate Tables)
  
  1. Performance
    - Add indexes on all unindexed foreign keys in admin and affiliate tables
  
  2. Tables Updated
    - admin_crm_activities
    - admin_crm_contacts
    - admin_crm_list_members
    - admin_sessions
    - affiliate_clicks
    - affiliate_commissions
    - affiliate_partners
    - affiliate_payouts
    - affiliate_referrals
*/

CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_contact_id ON admin_crm_activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_project_id ON admin_crm_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_activities_team_member_id ON admin_crm_activities(team_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_contacts_assigned_to_team_member ON admin_crm_contacts(assigned_to_team_member);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_company_id ON admin_crm_list_members(company_id);
CREATE INDEX IF NOT EXISTS idx_admin_crm_list_members_contact_id ON admin_crm_list_members(contact_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_converted_user_id ON affiliate_clicks(converted_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_id ON affiliate_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_partner_id ON affiliate_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_referred_user_id ON affiliate_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_partners_user_id ON affiliate_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_partner_id ON affiliate_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_partner_id ON affiliate_referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred_user_id ON affiliate_referrals(referred_user_id);
