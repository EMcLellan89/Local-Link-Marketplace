/*
  # Drop Unused Indexes - Batch 14: Playbooks, Profit Network, Storylab, White Label
  
  ## Additional Unused Indexes:
  - Partner playbooks
  - Profit network
  - Storylab
  - White label licensing
*/

-- Playbooks
DROP INDEX IF EXISTS idx_partner_playbook_lessons_created_at;
DROP INDEX IF EXISTS idx_partner_playbook_lessons_playbook_id;
DROP INDEX IF EXISTS idx_partner_playbook_progress_completed_at;
DROP INDEX IF EXISTS idx_partner_playbook_progress_partner_id;
DROP INDEX IF EXISTS idx_partner_playbook_progress_playbook_id;
DROP INDEX IF EXISTS idx_partner_playbooks_category;
DROP INDEX IF EXISTS idx_partner_playbooks_created_at;
DROP INDEX IF EXISTS idx_partner_playbooks_playbook_type;

-- Profit Network
DROP INDEX IF EXISTS idx_profit_network_businesses_created_at;
DROP INDEX IF EXISTS idx_profit_network_businesses_status;
DROP INDEX IF EXISTS idx_profit_network_orders_created_at;
DROP INDEX IF EXISTS idx_profit_network_orders_partner_id;
DROP INDEX IF EXISTS idx_profit_network_orders_status;
DROP INDEX IF EXISTS idx_profit_network_playbooks_business_id;
DROP INDEX IF EXISTS idx_profit_network_playbooks_created_at;

-- Storylab
DROP INDEX IF EXISTS idx_storylab_orders_order_date;
DROP INDEX IF EXISTS idx_storylab_orders_status;
DROP INDEX IF EXISTS idx_storylab_statements_period_end;
DROP INDEX IF EXISTS idx_storylab_statements_period_start;
DROP INDEX IF EXISTS idx_storylab_statements_status;

-- White Label
DROP INDEX IF EXISTS idx_white_label_licenses_expiry_date;
DROP INDEX IF EXISTS idx_white_label_licenses_license_type;
DROP INDEX IF EXISTS idx_white_label_licenses_status;

-- Additional specialized indexes
DROP INDEX IF EXISTS idx_marketplace_categories_parent_id;
DROP INDEX IF EXISTS idx_marketplace_payout_batches_status;
DROP INDEX IF EXISTS idx_marketplace_product_reviews_rating;
DROP INDEX IF EXISTS idx_marketplace_referrals_referrer_id;
DROP INDEX IF EXISTS idx_merchant_services_service_type;
DROP INDEX IF EXISTS idx_partner_bundles_bundle_type;
DROP INDEX IF EXISTS idx_partner_bundles_created_at;
DROP INDEX IF EXISTS idx_partner_challenge_participants_joined_at;
DROP INDEX IF EXISTS idx_partner_challenges_end_date;
DROP INDEX IF EXISTS idx_partner_challenges_start_date;
DROP INDEX IF EXISTS idx_partner_challenges_status;
DROP INDEX IF EXISTS idx_partner_crm_contacts_contact_type;
DROP INDEX IF EXISTS idx_partner_crm_deals_deal_type;
DROP INDEX IF EXISTS idx_partner_crm_deals_status;
DROP INDEX IF EXISTS idx_partner_overrides_created_at;
DROP INDEX IF EXISTS idx_partner_overrides_override_type;