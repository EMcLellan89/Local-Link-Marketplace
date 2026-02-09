/*
  # Add Missing Foreign Key Indexes - Batch 18: Commissions & Challenges

  1. Changes
    - Add indexes for commission_ledger (batch_id, order_id, payout_batch_id)
    - Add indexes for partner_challenge_enrollments (partner_id)
    - Add indexes for partner_challenge_progress (partner_id)
    - Add indexes for partner_activity_log (partner_id)
    - Add indexes for partner_streak_freezes (partner_id)
    - Add indexes for partner_notifications (partner_id)
    
  2. Rationale
    - Commission tracking requires efficient batch lookups
    - Partner challenges need fast enrollment queries
    - Activity logging needs partner filtering
    
  3. Performance Impact
    - Faster commission calculations
    - Better challenge leaderboard performance
    - Improved notification delivery
*/

-- Commission Ledger
CREATE INDEX IF NOT EXISTS idx_commission_ledger_batch_id ON commission_ledger(batch_id);
CREATE INDEX IF NOT EXISTS idx_commission_ledger_order_id ON commission_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_commission_ledger_payout_batch_id ON commission_ledger(payout_batch_id);

-- Partner Challenge Enrollments
CREATE INDEX IF NOT EXISTS idx_partner_challenge_enrollments_partner_id ON partner_challenge_enrollments(partner_id);

-- Partner Challenge Progress
CREATE INDEX IF NOT EXISTS idx_partner_challenge_progress_partner_id ON partner_challenge_progress(partner_id);

-- Partner Activity Log
CREATE INDEX IF NOT EXISTS idx_partner_activity_log_partner_id ON partner_activity_log(partner_id);

-- Partner Streak Freezes
CREATE INDEX IF NOT EXISTS idx_partner_streak_freezes_partner_id ON partner_streak_freezes(partner_id);

-- Partner Notifications
CREATE INDEX IF NOT EXISTS idx_partner_notifications_partner_id ON partner_notifications(partner_id);
