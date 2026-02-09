# pg_cron Setup Guide

pg_cron is now enabled in your Supabase database. This allows you to schedule recurring jobs directly in PostgreSQL.

## Cron Syntax Reference

```
 ┌───────────── minute (0 - 59)
 │ ┌───────────── hour (0 - 23)
 │ │ ┌───────────── day of month (1 - 31)
 │ │ │ ┌───────────── month (1 - 12)
 │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
 │ │ │ │ │
 * * * * *
```

## Common Patterns

- `* * * * *` - Every minute
- `0 * * * *` - Every hour (at minute 0)
- `0 0 * * *` - Daily at midnight
- `0 3 * * *` - Daily at 3am
- `0 0 * * 0` - Weekly on Sunday
- `0 0 1 * *` - Monthly on 1st day
- `*/5 * * * *` - Every 5 minutes
- `0 */6 * * *` - Every 6 hours

## Recommended Cron Jobs for Your Platform

### 1. Daily Partner Nudges (Already Implemented)
Your platform already has an edge function for this. Schedule it:

```sql
-- Run daily at 9am to send partner nudges
SELECT cron.schedule(
  'daily-partner-nudges',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/daily-partner-nudges',
      headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) AS request_id;
  $$
);
```

### 2. Weekly Payout Batch Processing
```sql
-- Run every Friday at 2am
SELECT cron.schedule(
  'weekly-payout-batch',
  '0 2 * * 5',
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/weekly-payout-batch',
      headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) AS request_id;
  $$
);
```

### 3. Scan Inactive Territories
```sql
-- Run daily at 1am
SELECT cron.schedule(
  'scan-inactive-territories',
  '0 1 * * *',
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/scan-inactive-territories',
      headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) AS request_id;
  $$
);
```

### 4. Clean Up Old Sessions
```sql
-- Run daily at 2am
SELECT cron.schedule(
  'cleanup-old-sessions',
  '0 2 * * *',
  $$
  DELETE FROM admin_sessions
  WHERE expires_at < NOW();
  $$
);
```

### 5. Update Partner Health Scores
```sql
-- Run every hour
SELECT cron.schedule(
  'update-partner-health',
  '0 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/partner-health',
      headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) AS request_id;
  $$
);
```

### 6. Process Email Queue
```sql
-- Run every 5 minutes
SELECT cron.schedule(
  'process-email-queue',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/email-worker',
      headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) AS request_id;
  $$
);
```

### 7. Process SMS Queue
```sql
-- Run every 5 minutes
SELECT cron.schedule(
  'process-sms-queue',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'YOUR_SUPABASE_URL/functions/v1/sms-worker',
      headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) AS request_id;
  $$
);
```

### 8. Expire Old Deals
```sql
-- Run daily at 1am
SELECT cron.schedule(
  'expire-old-deals',
  '0 1 * * *',
  $$
  UPDATE deals
  SET status = 'expired'
  WHERE end_date < NOW()
    AND status = 'active';
  $$
);
```

### 9. Calculate Partner Commissions
```sql
-- Run daily at 3am
SELECT cron.schedule(
  'calculate-commissions',
  '0 3 * * *',
  $$
  SELECT calculate_pending_commissions();
  $$
);
```

### 10. Archive Old Transactions
```sql
-- Run monthly on 1st at 3am
SELECT cron.schedule(
  'archive-old-transactions',
  '0 3 1 * *',
  $$
  INSERT INTO transactions_archive
  SELECT * FROM transactions
  WHERE created_at < NOW() - INTERVAL '1 year';

  DELETE FROM transactions
  WHERE created_at < NOW() - INTERVAL '1 year';
  $$
);
```

### 11. Budget Buster AI Insights
```sql
-- Run daily at 4am for users who have enabled AI insights
SELECT cron.schedule(
  'generate-budget-insights',
  '0 4 * * *',
  $$
  INSERT INTO budget_buster_ai_insights (user_id, insight_type, message, impact_amount)
  SELECT
    user_id,
    'spending_pattern',
    'You spent ' || SUM(amount)::text || ' on dining this month',
    SUM(amount)
  FROM budget_buster_transactions
  WHERE category = 'Dining'
    AND created_at >= DATE_TRUNC('month', NOW())
  GROUP BY user_id
  HAVING SUM(amount) > 500;
  $$
);
```

### 12. Subscription Renewal Reminders
```sql
-- Run daily at 10am
SELECT cron.schedule(
  'subscription-renewal-reminders',
  '0 10 * * *',
  $$
  INSERT INTO notifications (customer_id, type, message)
  SELECT
    customer_id,
    'subscription_renewal',
    'Your subscription renews in 3 days'
  FROM paybright_subscriptions
  WHERE next_billing_date = CURRENT_DATE + INTERVAL '3 days'
    AND status = 'active';
  $$
);
```

## Management Commands

### View All Scheduled Jobs
```sql
SELECT * FROM cron.job;
```

### View Job Run History
```sql
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 50;
```

### Unschedule a Job
```sql
SELECT cron.unschedule('job-name');
```

### Update a Job Schedule
```sql
-- Unschedule old, schedule new
SELECT cron.unschedule('job-name');
SELECT cron.schedule('job-name', '0 5 * * *', 'SELECT my_function()');
```

## Best Practices

1. **Use Service Role Key**: Always use your Supabase service role key (not anon key) when calling edge functions from cron
2. **Handle Failures**: Monitor `cron.job_run_details` for failed jobs
3. **Avoid Long-Running Jobs**: Keep jobs under 5 minutes; use edge functions for longer tasks
4. **Test First**: Test your SQL or edge function manually before scheduling
5. **Monitor Performance**: Check job execution times and adjust frequency if needed
6. **Use Transactions**: Wrap multi-step operations in transactions for data consistency
7. **Add Logging**: Log job execution to your own audit table for debugging

## Important Notes

- All times are in UTC
- Jobs run with postgres user privileges
- Failed jobs are logged but don't retry automatically
- You can call edge functions using `extensions.http` (pg_net extension)
- Maximum execution time depends on your Supabase plan

## Environment Variables

Make sure to replace placeholders:
- `YOUR_SUPABASE_URL` - Your Supabase project URL
- `YOUR_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)

## Example: Enable Daily Partner Nudges

```sql
-- Schedule the daily partner nudges to run at 9am UTC every day
SELECT cron.schedule(
  'daily-partner-nudges',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/daily-partner-nudges',
      headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) AS request_id;
  $$
);
```

Check if it's scheduled:
```sql
SELECT jobid, schedule, command, jobname
FROM cron.job
WHERE jobname = 'daily-partner-nudges';
```

## Troubleshooting

If jobs aren't running:
1. Check `cron.job_run_details` for errors
2. Verify your edge function is working by calling it manually
3. Ensure service role key is correct
4. Check timezone (all times are UTC)
5. Verify the cron expression is valid

Example error check:
```sql
SELECT jobid, start_time, status, return_message
FROM cron.job_run_details
WHERE status = 'failed'
ORDER BY start_time DESC;
```
