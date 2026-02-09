/*
  # Add Missing Foreign Key Indexes - Batch 1 (Safe)
  
  Adds indexes for foreign key columns that are missing covering indexes.
  Uses conditional logic to only create indexes where tables and columns exist.
  
  ## Tables Covered:
  - academy_quiz_attempts
  - accounting_assets
  - appointments
  - budget_buster_transactions
  - certificates
  - creative_events
  - crm_activities
  - crm_contacts
  - crm_deals
  - crm_tasks
*/

DO $$
BEGIN
  -- academy_quiz_attempts
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'academy_quiz_attempts' 
    AND column_name = 'course_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_academy_quiz_attempts_course_id 
      ON academy_quiz_attempts(course_id);
  END IF;

  -- accounting_assets
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'accounting_assets' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_accounting_assets_merchant_id 
      ON accounting_assets(merchant_id);
  END IF;

  -- appointments
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'appointments' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_appointments_merchant_id 
      ON appointments(merchant_id);
  END IF;

  -- budget_buster_transactions
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'budget_buster_transactions' 
    AND column_name = 'user_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_budget_buster_transactions_user_id 
      ON budget_buster_transactions(user_id);
  END IF;

  -- certificates
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'certificates' 
    AND column_name = 'user_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_certificates_user_id 
      ON certificates(user_id);
  END IF;

  -- creative_events
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'creative_events' 
    AND column_name = 'partner_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_creative_events_partner_id 
      ON creative_events(partner_id);
  END IF;

  -- crm_activities
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'crm_activities' 
    AND column_name = 'contact_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_crm_activities_contact_id 
      ON crm_activities(contact_id);
  END IF;

  -- crm_contacts
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'crm_contacts' 
    AND column_name = 'merchant_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_crm_contacts_merchant_id 
      ON crm_contacts(merchant_id);
  END IF;

  -- crm_deals
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'crm_deals' 
    AND column_name = 'contact_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_crm_deals_contact_id 
      ON crm_deals(contact_id);
  END IF;

  -- crm_tasks
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'crm_tasks' 
    AND column_name = 'assigned_to'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to 
      ON crm_tasks(assigned_to);
  END IF;
END $$;