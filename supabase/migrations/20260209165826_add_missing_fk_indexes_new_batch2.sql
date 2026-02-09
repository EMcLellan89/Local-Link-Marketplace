/*
  # Add Missing Foreign Key Indexes - New Batch 2
  
  1. New Indexes
    - idx_certificates_course_id on certificates(course_id)
    - idx_creative_events_creative_id on creative_events(creative_id)
    - idx_crm_activities_merchant_id on crm_activities(merchant_id)
    - idx_crm_contacts_assigned_to on crm_contacts(assigned_to)
    - idx_customer_referral_rewards_merchant_id on customer_referral_rewards(merchant_id)
    - idx_customer_referrals_merchant_id on customer_referrals(merchant_id)
    - idx_customer_rewards_ledger_customer_id on customer_rewards_ledger(customer_id)
    - idx_dfy_fulfillment_tasks_order_id on dfy_fulfillment_tasks(order_id)
  
  2. Performance
    - Improves join and foreign key lookup performance
    - Essential for query optimization
*/

-- certificates.course_id
CREATE INDEX IF NOT EXISTS idx_certificates_course_id 
ON certificates(course_id);

-- creative_events.creative_id
CREATE INDEX IF NOT EXISTS idx_creative_events_creative_id 
ON creative_events(creative_id);

-- crm_activities.merchant_id
CREATE INDEX IF NOT EXISTS idx_crm_activities_merchant_id 
ON crm_activities(merchant_id);

-- crm_contacts.assigned_to
CREATE INDEX IF NOT EXISTS idx_crm_contacts_assigned_to 
ON crm_contacts(assigned_to);

-- customer_referral_rewards.merchant_id
CREATE INDEX IF NOT EXISTS idx_customer_referral_rewards_merchant_id 
ON customer_referral_rewards(merchant_id);

-- customer_referrals.merchant_id
CREATE INDEX IF NOT EXISTS idx_customer_referrals_merchant_id 
ON customer_referrals(merchant_id);

-- customer_rewards_ledger.customer_id
CREATE INDEX IF NOT EXISTS idx_customer_rewards_ledger_customer_id 
ON customer_rewards_ledger(customer_id);

-- dfy_fulfillment_tasks.order_id
CREATE INDEX IF NOT EXISTS idx_dfy_fulfillment_tasks_order_id 
ON dfy_fulfillment_tasks(order_id);