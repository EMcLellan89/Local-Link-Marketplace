/*
  # Add Reviews and Ratings System

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `merchant_id` (uuid, references merchants)
      - `deal_id` (uuid, references deals, nullable)
      - `purchase_id` (uuid, references purchases, nullable)
      - `rating` (integer, 1-5)
      - `title` (text)
      - `comment` (text)
      - `is_verified_purchase` (boolean)
      - `helpful_count` (integer)
      - `status` (text: pending, approved, rejected)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `review_responses`
      - `id` (uuid, primary key)
      - `review_id` (uuid, references reviews)
      - `merchant_id` (uuid, references merchants)
      - `response_text` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `review_helpful_votes`
      - `id` (uuid, primary key)
      - `review_id` (uuid, references reviews)
      - `customer_id` (uuid, references customers)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Customers can create reviews for their purchases
    - Customers can view all approved reviews
    - Merchants can respond to reviews about their business
    - Merchants can view all reviews (including pending)
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create review responses table
CREATE TABLE IF NOT EXISTS review_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create review helpful votes table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, customer_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id ON reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_deal_id ON reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Customers can create reviews for their purchases"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view approved reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (status = 'approved');

CREATE POLICY "Merchants can view all reviews about their business"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Review responses policies
CREATE POLICY "Merchants can create responses to their reviews"
  ON review_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view review responses"
  ON review_responses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Merchants can update their own responses"
  ON review_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants
      WHERE merchants.id = merchant_id
      AND merchants.user_id = auth.uid()
    )
  );

-- Review helpful votes policies
CREATE POLICY "Customers can vote reviews helpful"
  ON review_helpful_votes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view helpful votes"
  ON review_helpful_votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers can delete their own votes"
  ON review_helpful_votes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Function to update helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for helpful count
DROP TRIGGER IF EXISTS trigger_update_review_helpful_count ON review_helpful_votes;
CREATE TRIGGER trigger_update_review_helpful_count
  AFTER INSERT OR DELETE ON review_helpful_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_helpful_count();

-- Function to update merchant average rating
CREATE OR REPLACE FUNCTION update_merchant_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be used to maintain a cached average rating on merchants table
  -- We'll add that column in a future migration if needed
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
