/*
  # Add Missing Foreign Key Indexes - Batch 1
  
  Adds covering indexes for unindexed foreign keys to improve query performance.
  
  1. Indexes Added
    - crm_tasks.assigned_to
    - customer_referrals.referrer_customer_id
    - invoice_items.invoice_id
    - job_applications.partner_id
*/

CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to 
  ON crm_tasks(assigned_to);

CREATE INDEX IF NOT EXISTS idx_customer_referrals_referrer_customer_id 
  ON customer_referrals(referrer_customer_id);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id 
  ON invoice_items(invoice_id);

CREATE INDEX IF NOT EXISTS idx_job_applications_partner_id 
  ON job_applications(partner_id);
