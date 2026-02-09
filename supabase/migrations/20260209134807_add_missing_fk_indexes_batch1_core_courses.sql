/*
  # Add Missing Foreign Key Indexes - Batch 1: Core Course Tables

  1. Changes
    - Add B-tree indexes for unindexed foreign keys on course system tables
    - Add indexes for key relationship columns
    
  2. Rationale
    - Foreign keys without indexes cause poor JOIN performance
    - Each index improves query planning for foreign key lookups
    - Using IF NOT EXISTS to avoid conflicts with existing indexes
    
  3. Performance Impact
    - Improved JOIN performance on foreign key columns
    - Faster constraint validation
    - Better query plan optimization
*/

-- Course system tables
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliates_user_id ON course_affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_affiliate_id ON course_affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_referred_user_id ON course_affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_order_id ON course_affiliate_referrals(order_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_payouts_affiliate_id ON course_affiliate_payouts(affiliate_id);

-- Orders table
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
