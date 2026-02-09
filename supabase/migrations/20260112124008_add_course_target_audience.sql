/*
  # Add Target Audience to Courses

  1. Changes
    - Adds target_audience column to courses table
    - Values: 'merchant', 'partner', 'creator', 'both'
    - Updates existing courses with appropriate target audiences

  2. Course Categorization
    - Merchant courses: Local Customers on Autopilot, Marketing for Trades, Local Paws Passport, AI & Reviews
    - Partner courses: Partner Accelerator, Selling Recurring Revenue
    - Creator courses: UGC From Home
    - Both: One-Shot Website Acquisition (OSWA)

  3. Security
    - No RLS changes needed
*/

-- Add target_audience column to courses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'target_audience'
  ) THEN
    ALTER TABLE courses ADD COLUMN target_audience text DEFAULT 'both' CHECK (target_audience IN ('merchant', 'partner', 'creator', 'both'));
  END IF;
END $$;

-- Update existing courses with appropriate target audiences

-- Merchant-focused courses
UPDATE courses SET target_audience = 'merchant'
WHERE slug IN (
  'local-customers-on-autopilot',
  'marketing-for-trades',
  'local-paws-passport',
  'ai-receptionist-missed-calls',
  'reviews-that-convert'
);

-- Partner-focused courses
UPDATE courses SET target_audience = 'partner'
WHERE slug IN (
  'partner-accelerator',
  'selling-recurring-revenue'
);

-- Creator-focused courses
UPDATE courses SET target_audience = 'creator'
WHERE slug IN (
  'ugc-from-home'
);

-- Universal courses (available to everyone)
UPDATE courses SET target_audience = 'both'
WHERE slug IN (
  'one-shot-website-acquisition'
);

-- Add indexes for filtering
CREATE INDEX IF NOT EXISTS idx_courses_target_audience ON courses(target_audience);
CREATE INDEX IF NOT EXISTS idx_courses_published_audience ON courses(is_published, target_audience);
