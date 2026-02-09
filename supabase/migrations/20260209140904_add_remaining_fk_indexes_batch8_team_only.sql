/*
  # Add Missing Foreign Key Indexes - Batch 8: Team Only

  This migration adds B-tree indexes for foreign key columns in team tables.
  
  ## Tables Updated:
  - team_members (manager_id)
*/

-- Team Management Tables
CREATE INDEX IF NOT EXISTS idx_team_members_manager_id ON team_members(manager_id);
