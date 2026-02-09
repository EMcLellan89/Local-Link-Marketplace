/*
  # Add Missing Foreign Key Indexes - Batch 22: Profit Network & StoryLab

  1. Changes
    - Add indexes for profit_network_ad_costs (partner_id)
    - Add indexes for profit_network_deductions (enrollment_id, partner_id, sale_id)
    - Add indexes for profit_network_statements (enrollment_id)
    - Add indexes for story_books (project_id)
    - Add indexes for story_assets (book_id)
    - Add indexes for bot_runs (profile_id)
    - Add indexes for story_jobs (book_id, profile_id)
    - Add indexes for story_audit_logs (book_id, profile_id)
    
  2. Rationale
    - Profit network tracking requires efficient partner queries
    - StoryLab operations need fast book and profile lookups
    
  3. Performance Impact
    - Faster profit calculations
    - Better StoryLab project management
*/

-- Profit Network
CREATE INDEX IF NOT EXISTS idx_profit_network_ad_costs_partner_id ON profit_network_ad_costs(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_enrollment_id ON profit_network_deductions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_partner_id ON profit_network_deductions(partner_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_deductions_sale_id ON profit_network_deductions(sale_id);
CREATE INDEX IF NOT EXISTS idx_profit_network_statements_enrollment_id ON profit_network_statements(enrollment_id);

-- StoryLab
CREATE INDEX IF NOT EXISTS idx_story_books_project_id ON story_books(project_id);
CREATE INDEX IF NOT EXISTS idx_story_assets_book_id ON story_assets(book_id);
CREATE INDEX IF NOT EXISTS idx_bot_runs_profile_id ON bot_runs(profile_id);
CREATE INDEX IF NOT EXISTS idx_story_jobs_book_id ON story_jobs(book_id);
CREATE INDEX IF NOT EXISTS idx_story_jobs_profile_id ON story_jobs(profile_id);
CREATE INDEX IF NOT EXISTS idx_story_audit_logs_book_id ON story_audit_logs(book_id);
CREATE INDEX IF NOT EXISTS idx_story_audit_logs_profile_id ON story_audit_logs(profile_id);
