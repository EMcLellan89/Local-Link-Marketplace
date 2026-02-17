/*
  # LOCAL-LINK PULSE™ Core System - Complete database infrastructure

  ## New Tables: 15 Pulse tables
  ## Extends: deals, merchants, customers
  ## Security: RLS enabled
  ## Performance: Comprehensive indexes
*/

DO $$ BEGIN CREATE TYPE pulse_boost_type AS ENUM ('none','standard_7day','flash_friday','homepage_featured','push_blast'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE pulse_point_action AS ENUM ('claim_deal','purchase_deal','refer_friend','complete_profile','first_purchase','review_merchant','social_share','flash_friday_claim','double_points_promotion','admin_award'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE pulse_badge_tier AS ENUM ('bronze','silver','gold','platinum','diamond'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE pulse_leaderboard_type AS ENUM ('city_monthly','national_quarterly','lifetime'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE deals ADD COLUMN IF NOT EXISTS boost_type pulse_boost_type DEFAULT 'none';
ALTER TABLE deals ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMPTZ;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS boost_purchase_id UUID;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS claim_count INTEGER DEFAULT 0;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS performance_enabled BOOLEAN DEFAULT false;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS flash_friday_eligible BOOLEAN DEFAULT false;

ALTER TABLE merchants ADD COLUMN IF NOT EXISTS performance_enabled BOOLEAN DEFAULT false;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS performance_expires_at TIMESTAMPTZ;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS growth_coach_tier TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS total_boosts_purchased INTEGER DEFAULT 0;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS points_balance INTEGER DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS lifetime_points INTEGER DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS referred_by_code TEXT;

CREATE TABLE IF NOT EXISTS pulse_cities (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, state TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pilot', merchant_count INTEGER DEFAULT 0, active_deal_count INTEGER DEFAULT 0, launch_date DATE, pilot_start_date DATE, go_live_threshold INTEGER DEFAULT 50, coordinates JSONB, timezone TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now(), UNIQUE(name, state));
CREATE TABLE IF NOT EXISTS pulse_feed_weights (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE, base_score NUMERIC(10,2) DEFAULT 0, boost_multiplier NUMERIC(5,2) DEFAULT 1.0, recency_score NUMERIC(5,2) DEFAULT 1.0, engagement_score NUMERIC(5,2) DEFAULT 0, final_score NUMERIC(10,2), calculated_at TIMESTAMPTZ DEFAULT now(), created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS pulse_points (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE, action pulse_point_action NOT NULL, points INTEGER NOT NULL, reference_id UUID, reference_type TEXT, description TEXT, expires_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS pulse_claims (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE, deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE, claimed_at TIMESTAMPTZ DEFAULT now(), claimed_date DATE DEFAULT CURRENT_DATE, converted_to_purchase BOOLEAN DEFAULT false, purchase_id UUID REFERENCES purchases(id), points_awarded INTEGER, UNIQUE(customer_id, deal_id, claimed_date));
CREATE TABLE IF NOT EXISTS pulse_badges (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL UNIQUE, description TEXT, tier pulse_badge_tier NOT NULL, icon_url TEXT, points_required INTEGER, special_condition TEXT, is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS pulse_user_badges (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE, badge_id UUID NOT NULL REFERENCES pulse_badges(id) ON DELETE CASCADE, awarded_at TIMESTAMPTZ DEFAULT now(), UNIQUE(customer_id, badge_id));
CREATE TABLE IF NOT EXISTS pulse_leaderboards (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE, leaderboard_type pulse_leaderboard_type NOT NULL, city TEXT, rank INTEGER NOT NULL, points INTEGER NOT NULL, period_start DATE NOT NULL, period_end DATE NOT NULL, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now(), UNIQUE(customer_id, leaderboard_type, period_start, city));
CREATE TABLE IF NOT EXISTS pulse_leaderboard_history (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), leaderboard_type pulse_leaderboard_type NOT NULL, city TEXT, period_start DATE NOT NULL, period_end DATE NOT NULL, rankings JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now(), UNIQUE(leaderboard_type, period_start, city));
CREATE TABLE IF NOT EXISTS pulse_boosts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE, deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE, boost_type pulse_boost_type NOT NULL, price_cents INTEGER NOT NULL, stripe_payment_id TEXT, stripe_payment_intent_id TEXT, status TEXT DEFAULT 'pending', starts_at TIMESTAMPTZ DEFAULT now(), expires_at TIMESTAMPTZ NOT NULL, impressions INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, conversions INTEGER DEFAULT 0, partner_id UUID REFERENCES partners(id), commission_amount_cents INTEGER, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS pulse_performance_subscriptions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE, tier TEXT NOT NULL, price_cents INTEGER NOT NULL, stripe_subscription_id TEXT UNIQUE, stripe_customer_id TEXT, status TEXT DEFAULT 'active', current_period_start TIMESTAMPTZ, current_period_end TIMESTAMPTZ, cancel_at_period_end BOOLEAN DEFAULT false, cancellation_requested_at TIMESTAMPTZ, minimum_term_end TIMESTAMPTZ, partner_id UUID REFERENCES partners(id), commission_rate NUMERIC(5,2) DEFAULT 20.00, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS pulse_growth_plans (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE, plan_type TEXT NOT NULL, generated_at TIMESTAMPTZ DEFAULT now(), plan_data JSONB NOT NULL, completed_steps INTEGER DEFAULT 0, total_steps INTEGER NOT NULL, expires_at TIMESTAMPTZ, is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS pulse_milestones (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL UNIQUE, description TEXT, merchant_tier TEXT, goal_type TEXT NOT NULL, goal_value INTEGER NOT NULL, reward_type TEXT, reward_value INTEGER, icon TEXT, is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS pulse_milestone_progress (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE, milestone_id UUID NOT NULL REFERENCES pulse_milestones(id) ON DELETE CASCADE, current_value INTEGER DEFAULT 0, completed BOOLEAN DEFAULT false, completed_at TIMESTAMPTZ, reward_claimed BOOLEAN DEFAULT false, reward_claimed_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now(), UNIQUE(merchant_id, milestone_id));
CREATE TABLE IF NOT EXISTS pulse_referrals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), referrer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE, referral_code TEXT NOT NULL, referred_customer_id UUID REFERENCES customers(id), referred_email TEXT, status TEXT DEFAULT 'pending', points_awarded INTEGER DEFAULT 0, reward_type TEXT, clicked_at TIMESTAMPTZ, signed_up_at TIMESTAMPTZ, first_purchase_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS pulse_referral_rewards (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), referral_id UUID NOT NULL REFERENCES pulse_referrals(id) ON DELETE CASCADE, customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE, reward_type TEXT NOT NULL, reward_amount INTEGER, status TEXT DEFAULT 'pending', awarded_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now());

CREATE INDEX IF NOT EXISTS idx_deals_pulse_feed ON deals(city, status, boost_type, end_at DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_feed_weights_deal ON pulse_feed_weights(deal_id);
CREATE INDEX IF NOT EXISTS idx_pulse_points_customer ON pulse_points(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulse_claims_customer ON pulse_claims(customer_id, claimed_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulse_user_badges_customer ON pulse_user_badges(customer_id);
CREATE INDEX IF NOT EXISTS idx_pulse_leaderboards_city ON pulse_leaderboards(city, leaderboard_type, rank);
CREATE INDEX IF NOT EXISTS idx_pulse_boosts_merchant ON pulse_boosts(merchant_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_subs_merchant ON pulse_performance_subscriptions(merchant_id, status);
CREATE INDEX IF NOT EXISTS idx_pulse_referrals_code ON pulse_referrals(referral_code);

ALTER TABLE pulse_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_feed_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_leaderboard_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_performance_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_growth_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_milestone_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON pulse_cities FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admin manage" ON pulse_cities FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Public read weights" ON pulse_feed_weights FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Own points" ON pulse_points FOR SELECT TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY "Own claims read" ON pulse_claims FOR SELECT TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY "Own claims write" ON pulse_claims FOR INSERT TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY "Public badges" ON pulse_badges FOR SELECT TO authenticated, anon USING (is_active = true);
CREATE POLICY "Own badges" ON pulse_user_badges FOR SELECT TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY "Public leaderboards" ON pulse_leaderboards FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Public history" ON pulse_leaderboard_history FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Own boosts" ON pulse_boosts FOR SELECT TO authenticated USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));
CREATE POLICY "Own subs" ON pulse_performance_subscriptions FOR SELECT TO authenticated USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));
CREATE POLICY "Own plans" ON pulse_growth_plans FOR SELECT TO authenticated USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));
CREATE POLICY "Public milestones" ON pulse_milestones FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Own progress" ON pulse_milestone_progress FOR SELECT TO authenticated USING (merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid()));
CREATE POLICY "Own referrals" ON pulse_referrals FOR SELECT TO authenticated USING (referrer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));
CREATE POLICY "Own rewards" ON pulse_referral_rewards FOR SELECT TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

INSERT INTO pulse_cities (name, state, status, pilot_start_date, go_live_threshold, timezone) VALUES ('Pepperell', 'MA', 'pilot', CURRENT_DATE, 50, 'America/New_York') ON CONFLICT (name, state) DO NOTHING;
INSERT INTO pulse_badges (name, description, tier, points_required) VALUES ('Deal Explorer', 'Claimed your first deal', 'bronze', 0), ('Savvy Saver', 'Saved $100 on deals', 'bronze', 100), ('Local Supporter', 'Purchased from 5 different merchants', 'silver', 250), ('Deal Hunter', 'Claimed 25 deals', 'silver', 500), ('Community Champion', 'Referred 10 friends', 'gold', 1000), ('Elite Saver', 'Saved $1000 on deals', 'gold', 2500), ('Pulse VIP', 'Top 10 in city leaderboard', 'platinum', 5000), ('Legend', 'Top 3 nationally', 'diamond', 10000) ON CONFLICT (name) DO NOTHING;
INSERT INTO pulse_milestones (name, description, merchant_tier, goal_type, goal_value, reward_type, reward_value) VALUES ('First Deal', 'Create your first deal', 'all', 'deal_count', 1, 'boost_credit', 2900), ('10 Sales', 'Make 10 sales', 'all', 'total_sales', 10, 'boost_credit', 4900), ('$1000 Revenue', 'Generate $1000 in revenue', 'all', 'revenue_amount', 100000, 'boost_credit', 9900), ('50 Sales', 'Make 50 sales', 'all', 'total_sales', 50, 'feature_unlock', 1), ('5 Star Rating', 'Maintain 5-star rating with 10+ reviews', 'all', 'rating_threshold', 5, 'boost_credit', 4900) ON CONFLICT (name) DO NOTHING;
