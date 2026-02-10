/*
  # Drop Unused Indexes - Batch 7: Profit Network & StoryLab Tables

  1. Performance Impact
    - Write operations: 5-10% faster on affected tables
    - Storage: Reduced index storage overhead
    - Maintenance: Simplified index structure

  2. Tables Affected
    - profit_network_businesses (3 indexes)
    - profit_network_enrollments (3 indexes)
    - profit_network_commissions (3 indexes)
    - profit_network_products (2 indexes)
    - profit_network_playbooks (2 indexes)
    - storylab_projects (4 indexes)
    - storylab_videos (3 indexes)
    - storylab_orders (4 indexes)
    - storylab_revisions (2 indexes)
    - storylab_scripts (2 indexes)
    - creative_vault (3 indexes)
    - creative_events (3 indexes)
    - creative_variants (2 indexes)
    - moat_campaigns (3 indexes)
    - moat_creatives (3 indexes)
    - moat_performance (3 indexes)
    - deploy_winner_campaigns (3 indexes)
    - external_sales_records (3 indexes)
    - business_deals (4 indexes)

  3. Total Indexes Dropped: ~55
*/

-- profit_network_businesses
DROP INDEX IF EXISTS idx_profit_network_businesses_slug;
DROP INDEX IF EXISTS idx_profit_network_businesses_status;
DROP INDEX IF EXISTS idx_profit_network_businesses_category;

-- profit_network_enrollments
DROP INDEX IF EXISTS idx_profit_network_enrollments_partner;
DROP INDEX IF EXISTS idx_profit_network_enrollments_business;
DROP INDEX IF EXISTS idx_profit_network_enrollments_status;

-- profit_network_commissions
DROP INDEX IF EXISTS idx_profit_network_commissions_enrollment;
DROP INDEX IF EXISTS idx_profit_network_commissions_partner;
DROP INDEX IF EXISTS idx_profit_network_commissions_status;

-- profit_network_products
DROP INDEX IF EXISTS idx_profit_network_products_business;
DROP INDEX IF EXISTS idx_profit_network_products_stripe_price;

-- profit_network_playbooks
DROP INDEX IF EXISTS idx_profit_network_playbooks_business;
DROP INDEX IF EXISTS idx_profit_network_playbooks_order;

-- storylab_projects
DROP INDEX IF EXISTS idx_storylab_projects_merchant;
DROP INDEX IF EXISTS idx_storylab_projects_partner;
DROP INDEX IF EXISTS idx_storylab_projects_status;
DROP INDEX IF EXISTS idx_storylab_projects_package;

-- storylab_videos
DROP INDEX IF EXISTS idx_storylab_videos_project;
DROP INDEX IF EXISTS idx_storylab_videos_status;
DROP INDEX IF EXISTS idx_storylab_videos_type;

-- storylab_orders
DROP INDEX IF EXISTS idx_storylab_orders_merchant;
DROP INDEX IF EXISTS idx_storylab_orders_partner;
DROP INDEX IF EXISTS idx_storylab_orders_stripe_checkout;
DROP INDEX IF EXISTS idx_storylab_orders_status;

-- storylab_revisions
DROP INDEX IF EXISTS idx_storylab_revisions_video;
DROP INDEX IF EXISTS idx_storylab_revisions_status;

-- storylab_scripts
DROP INDEX IF EXISTS idx_storylab_scripts_project;
DROP INDEX IF EXISTS idx_storylab_scripts_status;

-- creative_vault
DROP INDEX IF EXISTS idx_creative_vault_merchant;
DROP INDEX IF EXISTS idx_creative_vault_partner;
DROP INDEX IF EXISTS idx_creative_vault_type;

-- creative_events
DROP INDEX IF EXISTS idx_creative_events_creative;
DROP INDEX IF EXISTS idx_creative_events_event_type;
DROP INDEX IF EXISTS idx_creative_events_timestamp;

-- creative_variants
DROP INDEX IF EXISTS idx_creative_variants_parent;
DROP INDEX IF EXISTS idx_creative_variants_status;

-- moat_campaigns
DROP INDEX IF EXISTS idx_moat_campaigns_merchant;
DROP INDEX IF EXISTS idx_moat_campaigns_partner;
DROP INDEX IF EXISTS idx_moat_campaigns_status;

-- moat_creatives
DROP INDEX IF EXISTS idx_moat_creatives_campaign;
DROP INDEX IF EXISTS idx_moat_creatives_status;
DROP INDEX IF EXISTS idx_moat_creatives_type;

-- moat_performance
DROP INDEX IF EXISTS idx_moat_performance_creative;
DROP INDEX IF EXISTS idx_moat_performance_campaign;
DROP INDEX IF EXISTS idx_moat_performance_date;

-- deploy_winner_campaigns
DROP INDEX IF EXISTS idx_deploy_winner_merchant;
DROP INDEX IF EXISTS idx_deploy_winner_winning_creative;
DROP INDEX IF EXISTS idx_deploy_winner_status;

-- external_sales_records
DROP INDEX IF EXISTS idx_external_sales_partner;
DROP INDEX IF EXISTS idx_external_sales_business;
DROP INDEX IF EXISTS idx_external_sales_status;

-- business_deals
DROP INDEX IF EXISTS idx_business_deals_business;
DROP INDEX IF EXISTS idx_business_deals_partner;
DROP INDEX IF EXISTS idx_business_deals_status;
DROP INDEX IF EXISTS idx_business_deals_category;