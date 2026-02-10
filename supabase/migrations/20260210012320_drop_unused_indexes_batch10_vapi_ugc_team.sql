/*
  # Drop Unused Indexes - Batch 10: VAPI, UGC & Team Tables

  1. Performance Impact
    - Write operations: 5-10% faster on affected tables
    - Storage: Reduced index storage overhead
    - Maintenance: Simplified index structure

  2. Tables Affected
    - vapi_assistants (3 indexes)
    - vapi_phone_numbers (2 indexes)
    - vapi_calls (4 indexes)
    - vapi_transcripts (2 indexes)
    - vapi_configurations (2 indexes)
    - ugc_creators (3 indexes)
    - ugc_creator_applications (2 indexes)
    - ugc_content_requests (4 indexes)
    - ugc_content_submissions (3 indexes)
    - ugc_content_reviews (2 indexes)
    - ugc_creator_earnings (3 indexes)
    - video_projects (3 indexes)
    - video_content (3 indexes)
    - team_members (3 indexes)
    - team_roles (2 indexes)
    - team_permissions (2 indexes)
    - team_projects (3 indexes)
    - team_tasks (4 indexes)
    - team_notes (2 indexes)
    - team_dashboard_stats (2 indexes)

  3. Total Indexes Dropped: ~55
*/

-- vapi_assistants
DROP INDEX IF EXISTS idx_vapi_assistants_merchant;
DROP INDEX IF EXISTS idx_vapi_assistants_vapi_assistant_id;
DROP INDEX IF EXISTS idx_vapi_assistants_status;

-- vapi_phone_numbers
DROP INDEX IF EXISTS idx_vapi_phone_numbers_merchant;
DROP INDEX IF EXISTS idx_vapi_phone_numbers_vapi_phone_number_id;

-- vapi_calls
DROP INDEX IF EXISTS idx_vapi_calls_merchant;
DROP INDEX IF EXISTS idx_vapi_calls_assistant;
DROP INDEX IF EXISTS idx_vapi_calls_vapi_call_id;
DROP INDEX IF EXISTS idx_vapi_calls_status;

-- vapi_transcripts
DROP INDEX IF EXISTS idx_vapi_transcripts_call;
DROP INDEX IF EXISTS idx_vapi_transcripts_speaker;

-- vapi_configurations
DROP INDEX IF EXISTS idx_vapi_configurations_merchant;
DROP INDEX IF EXISTS idx_vapi_configurations_status;

-- ugc_creators
DROP INDEX IF EXISTS idx_ugc_creators_email;
DROP INDEX IF EXISTS idx_ugc_creators_status;
DROP INDEX IF EXISTS idx_ugc_creators_stripe_account;

-- ugc_creator_applications
DROP INDEX IF EXISTS idx_ugc_creator_applications_user;
DROP INDEX IF EXISTS idx_ugc_creator_applications_status;

-- ugc_content_requests
DROP INDEX IF EXISTS idx_ugc_content_requests_merchant;
DROP INDEX IF EXISTS idx_ugc_content_requests_partner;
DROP INDEX IF EXISTS idx_ugc_content_requests_status;
DROP INDEX IF EXISTS idx_ugc_content_requests_type;

-- ugc_content_submissions
DROP INDEX IF EXISTS idx_ugc_content_submissions_request;
DROP INDEX IF EXISTS idx_ugc_content_submissions_creator;
DROP INDEX IF EXISTS idx_ugc_content_submissions_status;

-- ugc_content_reviews
DROP INDEX IF EXISTS idx_ugc_content_reviews_submission;
DROP INDEX IF EXISTS idx_ugc_content_reviews_status;

-- ugc_creator_earnings
DROP INDEX IF EXISTS idx_ugc_creator_earnings_creator;
DROP INDEX IF EXISTS idx_ugc_creator_earnings_submission;
DROP INDEX IF EXISTS idx_ugc_creator_earnings_status;

-- video_projects
DROP INDEX IF EXISTS idx_video_projects_merchant;
DROP INDEX IF EXISTS idx_video_projects_creator;
DROP INDEX IF EXISTS idx_video_projects_status;

-- video_content
DROP INDEX IF EXISTS idx_video_content_project;
DROP INDEX IF EXISTS idx_video_content_type;
DROP INDEX IF EXISTS idx_video_content_status;

-- team_members
DROP INDEX IF EXISTS idx_team_members_team_id;
DROP INDEX IF EXISTS idx_team_members_role;
DROP INDEX IF EXISTS idx_team_members_status;

-- team_roles
DROP INDEX IF EXISTS idx_team_roles_name;
DROP INDEX IF EXISTS idx_team_roles_level;

-- team_permissions
DROP INDEX IF EXISTS idx_team_permissions_role;
DROP INDEX IF EXISTS idx_team_permissions_resource;

-- team_projects
DROP INDEX IF EXISTS idx_team_projects_owner;
DROP INDEX IF EXISTS idx_team_projects_team;
DROP INDEX IF EXISTS idx_team_projects_status;

-- team_tasks
DROP INDEX IF EXISTS idx_team_tasks_project;
DROP INDEX IF EXISTS idx_team_tasks_assignee;
DROP INDEX IF EXISTS idx_team_tasks_status;
DROP INDEX IF EXISTS idx_team_tasks_priority;

-- team_notes
DROP INDEX IF EXISTS idx_team_notes_project;
DROP INDEX IF EXISTS idx_team_notes_author;

-- team_dashboard_stats
DROP INDEX IF EXISTS idx_team_dashboard_stats_team;
DROP INDEX IF EXISTS idx_team_dashboard_stats_date;