/*
  # My Budget Buster - Complete Application Schema
  
  1. Overview
    Full database schema for the My Budget Buster budgeting application
    Supports both Manual and Connected (Plaid) modes
    
  2. Core Tables
    - budget_buster_users - User accounts and subscription info
    - budget_buster_accounts - Bank accounts (manual and Plaid)
    - budget_buster_transactions - All transactions
    - budget_buster_bills - Bills and subscriptions
    - budget_buster_debts - Debt tracking
    - budget_buster_debt_settings - Snowball/Avalanche strategy
    - budget_buster_savings_goals - Dream Mode savings goals
    - budget_buster_momentum - Gamification and streaks
    - budget_buster_ai_insights - AI-generated insights
    - budget_buster_webhook_outbox - Crash-proof webhook delivery
    
  3. Security
    - Full RLS policies
    - User data isolation
    - Admin access for support
*/

-- =====================================================
-- USERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Auth linkage (to profiles if integrated, or standalone)
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  
  -- Plan & Subscription
  plan_type TEXT NOT NULL DEFAULT 'trial' CHECK (plan_type IN ('trial', 'manual', 'connected', 'lifetime')),
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  
  -- Billing
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_id UUID REFERENCES budget_buster_subscriptions(id),
  
  -- Referral tracking
  referred_by_partner_id UUID REFERENCES partners(id),
  referral_code TEXT,
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  
  -- Activity
  last_active_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bb_users_profile ON budget_buster_users(profile_id) WHERE profile_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bb_users_email ON budget_buster_users(email);
CREATE INDEX IF NOT EXISTS idx_bb_users_stripe ON budget_buster_users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bb_users_partner ON budget_buster_users(referred_by_partner_id) WHERE referred_by_partner_id IS NOT NULL;

ALTER TABLE budget_buster_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own account"
  ON budget_buster_users FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can update own account"
  ON budget_buster_users FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Service role full access users"
  ON budget_buster_users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- ACCOUNTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES budget_buster_users(id) ON DELETE CASCADE,
  
  -- Account details
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'credit', 'loan', 'investment', 'cash')),
  connection_type TEXT NOT NULL DEFAULT 'manual' CHECK (connection_type IN ('manual', 'plaid')),
  
  -- Balance
  balance DECIMAL(12, 2) NOT NULL DEFAULT 0,
  available_balance DECIMAL(12, 2),
  
  -- Institution
  institution_name TEXT,
  account_name TEXT NOT NULL,
  account_number_last_4 TEXT,
  
  -- Plaid
  plaid_account_id TEXT,
  plaid_access_token TEXT,
  plaid_last_sync TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bb_accounts_user ON budget_buster_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bb_accounts_type ON budget_buster_accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_bb_accounts_plaid ON budget_buster_accounts(plaid_account_id) WHERE plaid_account_id IS NOT NULL;

ALTER TABLE budget_buster_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own accounts"
  ON budget_buster_accounts FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users manage own accounts"
  ON budget_buster_accounts FOR ALL
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Service role full access accounts"
  ON budget_buster_accounts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- TRANSACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES budget_buster_users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES budget_buster_accounts(id) ON DELETE CASCADE,
  
  -- Transaction details
  amount DECIMAL(12, 2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer')),
  category TEXT NOT NULL,
  description TEXT,
  
  -- Date
  transaction_date DATE NOT NULL,
  
  -- Source
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'plaid')),
  plaid_transaction_id TEXT UNIQUE,
  
  -- Tags and notes
  tags TEXT[],
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bb_transactions_user ON budget_buster_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bb_transactions_account ON budget_buster_transactions(account_id) WHERE account_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bb_transactions_date ON budget_buster_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_bb_transactions_category ON budget_buster_transactions(category);
CREATE INDEX IF NOT EXISTS idx_bb_transactions_plaid ON budget_buster_transactions(plaid_transaction_id) WHERE plaid_transaction_id IS NOT NULL;

ALTER TABLE budget_buster_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own transactions"
  ON budget_buster_transactions FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users manage own transactions"
  ON budget_buster_transactions FOR ALL
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Service role full access transactions"
  ON budget_buster_transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- BILLS & SUBSCRIPTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES budget_buster_users(id) ON DELETE CASCADE,
  
  -- Bill details
  name TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  due_date INTEGER NOT NULL CHECK (due_date >= 1 AND due_date <= 31),
  
  -- Frequency
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'annual', 'one_time')),
  
  -- Type
  is_subscription BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'paused')),
  
  -- Reminders
  remind_days_before INTEGER DEFAULT 3,
  last_reminded_at TIMESTAMPTZ,
  
  -- Linked transaction
  auto_categorize_as TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bb_bills_user ON budget_buster_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bb_bills_due ON budget_buster_bills(due_date);
CREATE INDEX IF NOT EXISTS idx_bb_bills_status ON budget_buster_bills(status);
CREATE INDEX IF NOT EXISTS idx_bb_bills_subscription ON budget_buster_bills(is_subscription);

ALTER TABLE budget_buster_bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own bills"
  ON budget_buster_bills FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users manage own bills"
  ON budget_buster_bills FOR ALL
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Service role full access bills"
  ON budget_buster_bills FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- DEBTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES budget_buster_users(id) ON DELETE CASCADE,
  
  -- Debt details
  creditor TEXT NOT NULL,
  debt_type TEXT CHECK (debt_type IN ('credit_card', 'student_loan', 'auto_loan', 'mortgage', 'personal_loan', 'medical', 'other')),
  
  -- Amounts
  original_balance DECIMAL(12, 2),
  current_balance DECIMAL(12, 2) NOT NULL,
  
  -- Terms
  interest_rate DECIMAL(5, 2) NOT NULL,
  minimum_payment DECIMAL(12, 2) NOT NULL,
  
  -- Payment tracking
  extra_payment DECIMAL(12, 2) DEFAULT 0,
  
  -- Order for snowball/avalanche
  payoff_priority INTEGER,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  paid_off_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bb_debts_user ON budget_buster_debts(user_id);
CREATE INDEX IF NOT EXISTS idx_bb_debts_priority ON budget_buster_debts(payoff_priority);
CREATE INDEX IF NOT EXISTS idx_bb_debts_active ON budget_buster_debts(is_active);

ALTER TABLE budget_buster_debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own debts"
  ON budget_buster_debts FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users manage own debts"
  ON budget_buster_debts FOR ALL
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Service role full access debts"
  ON budget_buster_debts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- DEBT SETTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_debt_settings (
  user_id UUID PRIMARY KEY REFERENCES budget_buster_users(id) ON DELETE CASCADE,
  
  -- Strategy
  strategy TEXT NOT NULL DEFAULT 'snowball' CHECK (strategy IN ('snowball', 'avalanche')),
  
  -- Extra payment amount
  monthly_extra_payment DECIMAL(12, 2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE budget_buster_debt_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own debt settings"
  ON budget_buster_debt_settings FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users manage own debt settings"
  ON budget_buster_debt_settings FOR ALL
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Service role full access debt settings"
  ON budget_buster_debt_settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- SAVINGS GOALS (DREAM MODE) TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES budget_buster_users(id) ON DELETE CASCADE,
  
  -- Goal details
  name TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  
  -- Timeline
  target_date DATE,
  
  -- Visual
  image_url TEXT,
  color TEXT DEFAULT '#4F46E5',
  icon TEXT,
  
  -- Contribution
  contribution_amount DECIMAL(12, 2),
  contribution_frequency TEXT CHECK (contribution_frequency IN ('weekly', 'biweekly', 'monthly')),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ,
  
  -- Display order
  display_order INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bb_savings_user ON budget_buster_savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_bb_savings_active ON budget_buster_savings_goals(is_active);
CREATE INDEX IF NOT EXISTS idx_bb_savings_order ON budget_buster_savings_goals(display_order);

ALTER TABLE budget_buster_savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own savings goals"
  ON budget_buster_savings_goals FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users manage own savings goals"
  ON budget_buster_savings_goals FOR ALL
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Service role full access savings"
  ON budget_buster_savings_goals FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- MOMENTUM & GAMIFICATION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_momentum (
  user_id UUID PRIMARY KEY REFERENCES budget_buster_users(id) ON DELETE CASCADE,
  
  -- Score
  score INTEGER DEFAULT 0,
  
  -- Streaks
  streak_weeks INTEGER DEFAULT 0,
  longest_streak_weeks INTEGER DEFAULT 0,
  
  -- Activity
  last_active_date DATE,
  
  -- Milestones
  transactions_logged INTEGER DEFAULT 0,
  debts_paid_off INTEGER DEFAULT 0,
  goals_completed INTEGER DEFAULT 0,
  months_closed INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE budget_buster_momentum ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own momentum"
  ON budget_buster_momentum FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users manage own momentum"
  ON budget_buster_momentum FOR ALL
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Service role full access momentum"
  ON budget_buster_momentum FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- AI INSIGHTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES budget_buster_users(id) ON DELETE CASCADE,
  
  -- Insight type
  insight_type TEXT NOT NULL CHECK (insight_type IN ('alert', 'suggestion', 'warning', 'celebration', 'focus')),
  
  -- Content
  title TEXT,
  message TEXT NOT NULL,
  
  -- Action
  action_label TEXT,
  action_url TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  
  -- Display
  priority INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bb_ai_user ON budget_buster_ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_bb_ai_type ON budget_buster_ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_bb_ai_read ON budget_buster_ai_insights(is_read);
CREATE INDEX IF NOT EXISTS idx_bb_ai_created ON budget_buster_ai_insights(created_at DESC);

ALTER TABLE budget_buster_ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own insights"
  ON budget_buster_ai_insights FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Users update own insights"
  ON budget_buster_ai_insights FOR UPDATE
  TO authenticated
  USING (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    user_id IN (SELECT id FROM budget_buster_users WHERE profile_id = auth.uid())
  );

CREATE POLICY "Service role full access ai insights"
  ON budget_buster_ai_insights FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- WEBHOOK OUTBOX TABLE (CRASH-PROOF)
-- =====================================================

CREATE TABLE IF NOT EXISTS budget_buster_webhook_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Webhook details
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  
  -- Target
  webhook_url TEXT NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  retries INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Response
  last_error TEXT,
  last_attempt_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bb_webhook_status ON budget_buster_webhook_outbox(status);
CREATE INDEX IF NOT EXISTS idx_bb_webhook_created ON budget_buster_webhook_outbox(created_at DESC);

ALTER TABLE budget_buster_webhook_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access webhooks"
  ON budget_buster_webhook_outbox FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
