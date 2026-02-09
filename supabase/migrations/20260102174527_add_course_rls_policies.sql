/*
  # Add RLS Policies for Course System

  ## Security Model:
  - Products: Public can read active products
  - Orders: Users can only read their own orders
  - Courses/Modules/Lessons: Public can read course structure (access control via enrollments)
  - Enrollments: Users can only read their own enrollments
  - Progress: Users can read/write their own progress
  - Certificates: Users can read their own certificates
  - Course Affiliates: Users can manage their own affiliate account
  - Referrals/Payouts: Users can read their own affiliate data
*/

-- =====================================================
-- PRODUCTS & ORDERS
-- =====================================================

ALTER TABLE products_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products_catalog FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- COURSE CONTENT (PUBLIC READABLE)
-- =====================================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can view course modules"
  ON course_modules FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view course lessons"
  ON course_lessons FOR SELECT
  USING (true);

-- =====================================================
-- ENROLLMENTS & PROGRESS
-- =====================================================

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
  ON enrollments FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their own progress"
  ON lesson_progress FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
  ON lesson_progress FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON lesson_progress FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- CERTIFICATES
-- =====================================================

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates"
  ON certificates FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Note: Certificate verification by code will be done via edge function
-- that uses service role to query without RLS

-- =====================================================
-- COURSE AFFILIATES
-- =====================================================

ALTER TABLE course_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_affiliate_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own affiliate account"
  ON course_affiliates FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own affiliate account"
  ON course_affiliates FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their affiliate referrals"
  ON course_affiliate_referrals FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_affiliates
      WHERE course_affiliates.id = affiliate_id
      AND course_affiliates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their affiliate payouts"
  ON course_affiliate_payouts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_affiliates
      WHERE course_affiliates.id = affiliate_id
      AND course_affiliates.user_id = auth.uid()
    )
  );