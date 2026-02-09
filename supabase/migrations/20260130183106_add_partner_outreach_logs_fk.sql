/*
  # Add Foreign Key Constraint to partner_outreach_logs

  1. Data Integrity
    - Add foreign key constraint from partner_outreach_logs.partner_id to partners.id
    - Ensures referential integrity
    - Prevents orphaned records

  2. Performance
    - Add index on partner_id (if not exists)
*/

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_partner_outreach_logs_partner'
      AND table_name = 'partner_outreach_logs'
  ) THEN
    ALTER TABLE public.partner_outreach_logs
    ADD CONSTRAINT fk_partner_outreach_logs_partner
    FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure index exists on partner_id
CREATE INDEX IF NOT EXISTS idx_partner_outreach_logs_partner_id
  ON public.partner_outreach_logs(partner_id);
