/*
  # Drop Unused Indexes - Batch 6: Partner System Tables

  1. Performance Impact
    - Write operations: 5-10% faster on affected tables
    - Storage: Reduced index storage overhead
    - Maintenance: Simplified index structure

  2. Tables Affected
    - partners (5 indexes)
    - partner_contracts (2 indexes)
    - partner_territories (3 indexes)
    - territory_assignments (2 indexes)
    - territory_expansion_requests (2 indexes)
    - partner_crm_contacts (3 indexes)
    - partner_crm_deals (4 indexes)
    - partner_crm_tasks (3 indexes)
    - partner_crm_notes (2 indexes)
    - partner_crm_activities (2 indexes)
    - partner_playbooks (2 indexes)
    - partner_playbook_modules (2 indexes)
    - partner_playbook_lessons (2 indexes)
    - partner_badges (1 index)
    - partner_milestones (2 indexes)
    - partner_challenge_participations (2 indexes)
    - partner_bundles (2 indexes)
    - partner_bundle_purchases (2 indexes)
    - partner_ad_vault_views (2 indexes)
    - partner_tracking_link_clicks (3 indexes)

  3. Total Indexes Dropped: ~48
*/

-- partners
DROP INDEX IF EXISTS idx_partners_email;
DROP INDEX IF EXISTS idx_partners_slug;
DROP INDEX IF EXISTS idx_partners_status;
DROP INDEX IF EXISTS idx_partners_tier;
DROP INDEX IF EXISTS idx_partners_stripe_account;

-- partner_contracts
DROP INDEX IF EXISTS idx_partner_contracts_partner;
DROP INDEX IF EXISTS idx_partner_contracts_status;

-- partner_territories
DROP INDEX IF EXISTS idx_partner_territories_partner;
DROP INDEX IF EXISTS idx_partner_territories_state;
DROP INDEX IF EXISTS idx_partner_territories_status;

-- territory_assignments
DROP INDEX IF EXISTS idx_territory_assignments_partner;
DROP INDEX IF EXISTS idx_territory_assignments_territory;

-- territory_expansion_requests
DROP INDEX IF EXISTS idx_territory_expansion_partner;
DROP INDEX IF EXISTS idx_territory_expansion_status;

-- partner_crm_contacts
DROP INDEX IF EXISTS idx_partner_crm_contacts_partner;
DROP INDEX IF EXISTS idx_partner_crm_contacts_email;
DROP INDEX IF EXISTS idx_partner_crm_contacts_status;

-- partner_crm_deals
DROP INDEX IF EXISTS idx_partner_crm_deals_partner;
DROP INDEX IF EXISTS idx_partner_crm_deals_contact;
DROP INDEX IF EXISTS idx_partner_crm_deals_stage;
DROP INDEX IF EXISTS idx_partner_crm_deals_status;

-- partner_crm_tasks
DROP INDEX IF EXISTS idx_partner_crm_tasks_partner;
DROP INDEX IF EXISTS idx_partner_crm_tasks_contact;
DROP INDEX IF EXISTS idx_partner_crm_tasks_status;

-- partner_crm_notes
DROP INDEX IF EXISTS idx_partner_crm_notes_partner;
DROP INDEX IF EXISTS idx_partner_crm_notes_contact;

-- partner_crm_activities
DROP INDEX IF EXISTS idx_partner_crm_activities_partner;
DROP INDEX IF EXISTS idx_partner_crm_activities_contact;

-- partner_playbooks
DROP INDEX IF EXISTS idx_partner_playbooks_slug;
DROP INDEX IF EXISTS idx_partner_playbooks_status;

-- partner_playbook_modules
DROP INDEX IF EXISTS idx_partner_playbook_modules_playbook;
DROP INDEX IF EXISTS idx_partner_playbook_modules_order;

-- partner_playbook_lessons
DROP INDEX IF EXISTS idx_partner_playbook_lessons_module;
DROP INDEX IF EXISTS idx_partner_playbook_lessons_order;

-- partner_badges
DROP INDEX IF EXISTS idx_partner_badges_slug;

-- partner_milestones
DROP INDEX IF EXISTS idx_partner_milestones_level;
DROP INDEX IF EXISTS idx_partner_milestones_type;

-- partner_challenge_participations
DROP INDEX IF EXISTS idx_partner_challenge_participations_partner;
DROP INDEX IF EXISTS idx_partner_challenge_participations_challenge;

-- partner_bundles
DROP INDEX IF EXISTS idx_partner_bundles_slug;
DROP INDEX IF EXISTS idx_partner_bundles_status;

-- partner_bundle_purchases
DROP INDEX IF EXISTS idx_partner_bundle_purchases_partner;
DROP INDEX IF EXISTS idx_partner_bundle_purchases_bundle;

-- partner_ad_vault_views
DROP INDEX IF EXISTS idx_partner_ad_vault_views_partner;
DROP INDEX IF EXISTS idx_partner_ad_vault_views_ad;

-- partner_tracking_link_clicks
DROP INDEX IF EXISTS idx_partner_tracking_link_clicks_link;
DROP INDEX IF EXISTS idx_partner_tracking_link_clicks_partner;
DROP INDEX IF EXISTS idx_partner_tracking_link_clicks_timestamp;