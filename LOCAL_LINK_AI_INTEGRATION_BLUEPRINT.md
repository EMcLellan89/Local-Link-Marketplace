# Local-Link AI™ Integration Blueprint
## Building the 3-Mode System Inside Local-Link Marketplace

---

## 🎯 STRATEGIC OVERVIEW

**What We're Building:**
A unified platform with 3 internal modes that creates a self-distributing marketplace economy.

**The 3 Modes:**
1. **Merchant Mode** - Existing businesses using Local-Link (AI-enhanced)
2. **Partner/Earner Mode** - NEW: People earning by bringing merchants
3. **Agency Mode** - Scale tier with white-label, teams, multi-city

**Why This Works:**
- Customers become earners
- Earners become agencies
- Agencies need TradeHive + AdSuite
- Platform distributes itself
- "AI income" is real commission revenue

---

## 🗄️ DATABASE ARCHITECTURE

### NEW TABLES NEEDED

#### 1. **user_modes** (Role Management)
```sql
CREATE TABLE user_modes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  mode_type TEXT NOT NULL, -- 'customer', 'merchant', 'partner', 'agency', 'admin'
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  activated_at TIMESTAMPTZ,
  tier TEXT, -- For partner/agency: 'starter', 'pro', 'agency', 'white_label'
  monthly_fee DECIMAL(10,2),
  features JSONB, -- Mode-specific feature flags
  limits JSONB, -- Usage limits per tier
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, mode_type)
);

-- User can have multiple active modes simultaneously
-- Example: Someone can be both a customer AND a partner
```

**Why This Design:**
- Users can activate multiple modes
- Easy to upgrade/downgrade tiers
- Feature gating per mode
- Usage tracking per role

---

#### 2. **partner_profiles** (Enhanced Partner System)
```sql
CREATE TABLE partner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL UNIQUE,
  partner_code TEXT UNIQUE NOT NULL, -- Referral/tracking code
  partner_tier TEXT DEFAULT 'starter', -- 'starter', 'pro', 'agency', 'white_label'

  -- Territory Management
  assigned_territories TEXT[], -- Array of territory IDs or ZIP codes
  primary_city TEXT,
  primary_state TEXT,
  territory_status TEXT DEFAULT 'active', -- 'active', 'pending', 'suspended'

  -- Performance Metrics
  total_merchants_onboarded INTEGER DEFAULT 0,
  active_merchants INTEGER DEFAULT 0,
  total_commission_earned DECIMAL(10,2) DEFAULT 0,
  monthly_recurring_revenue DECIMAL(10,2) DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,

  -- Commission Structure
  base_commission_rate DECIMAL(5,2) DEFAULT 20.00, -- 20%
  bonus_tier_rate DECIMAL(5,2) DEFAULT 0,
  override_rate DECIMAL(5,2), -- Admin can override

  -- Training & Certification
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  certification_level TEXT, -- 'basic', 'advanced', 'master'
  training_modules_completed TEXT[],

  -- AI Usage Tracking
  ai_credits_remaining INTEGER DEFAULT 1000,
  ai_credits_used INTEGER DEFAULT 0,
  ai_credits_reset_date TIMESTAMPTZ,

  -- Performance Score
  performance_score INTEGER DEFAULT 0, -- 0-100
  quality_score INTEGER DEFAULT 0, -- 0-100
  merchant_retention_rate DECIMAL(5,2),

  -- Payout Information
  payout_method TEXT DEFAULT 'bank_transfer', -- 'bank_transfer', 'paypal', 'stripe'
  payout_frequency TEXT DEFAULT 'monthly', -- 'weekly', 'bi_weekly', 'monthly'
  minimum_payout_threshold DECIMAL(10,2) DEFAULT 100.00,
  next_payout_date TIMESTAMPTZ,

  -- Status & Flags
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'terminated', 'pending_approval'
  suspension_reason TEXT,
  suspended_at TIMESTAMPTZ,

  -- Metadata
  referral_source TEXT,
  signup_ip TEXT,
  signup_device TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

#### 3. **partner_merchant_assignments** (Tracking)
```sql
CREATE TABLE partner_merchant_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partner_profiles(id) NOT NULL,
  merchant_id UUID REFERENCES merchants(id) NOT NULL,

  -- Attribution
  attribution_type TEXT, -- 'direct_signup', 'assisted', 'territory_claim'
  attribution_date TIMESTAMPTZ DEFAULT now(),

  -- Onboarding Tracking
  onboarding_step TEXT, -- 'contacted', 'demo_scheduled', 'signed_up', 'activated', 'churned'
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,

  -- Commission Eligibility
  commission_eligible BOOLEAN DEFAULT true,
  commission_start_date TIMESTAMPTZ DEFAULT now(),
  commission_end_date TIMESTAMPTZ, -- If merchant churns or partner loses territory

  -- Performance
  merchant_lifetime_value DECIMAL(10,2) DEFAULT 0,
  total_commission_earned DECIMAL(10,2) DEFAULT 0,

  -- Notes
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(partner_id, merchant_id)
);
```

---

#### 4. **partner_commissions** (Enhanced)
```sql
-- This table already exists, but we'll enhance it

ALTER TABLE partner_commissions ADD COLUMN IF NOT EXISTS partner_merchant_assignment_id UUID REFERENCES partner_merchant_assignments(id);
ALTER TABLE partner_commissions ADD COLUMN IF NOT EXISTS commission_tier TEXT; -- 'base', 'bonus', 'override', 'team'
ALTER TABLE partner_commissions ADD COLUMN IF NOT EXISTS payment_batch_id UUID; -- For grouping payouts
ALTER TABLE partner_commissions ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES invoices(id); -- Link to merchant invoice that generated commission
ALTER TABLE partner_commissions ADD COLUMN IF NOT EXISTS deal_id UUID REFERENCES deals(id); -- If commission from marketplace deal
ALTER TABLE partner_commissions ADD COLUMN IF NOT EXISTS description TEXT;
```

---

#### 5. **partner_payouts** (Commission Disbursement)
```sql
CREATE TABLE partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partner_profiles(id) NOT NULL,

  -- Payout Details
  payout_period_start TIMESTAMPTZ NOT NULL,
  payout_period_end TIMESTAMPTZ NOT NULL,

  -- Amounts
  gross_commission DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  adjustments DECIMAL(10,2) DEFAULT 0, -- Bonuses, penalties, refunds
  net_payout DECIMAL(10,2) NOT NULL,

  -- Commission Breakdown
  marketplace_commissions DECIMAL(10,2) DEFAULT 0,
  crm_commissions DECIMAL(10,2) DEFAULT 0,
  addon_commissions DECIMAL(10,2) DEFAULT 0,
  merchant_services_commissions DECIMAL(10,2) DEFAULT 0,
  team_commissions DECIMAL(10,2) DEFAULT 0, -- If agency with team

  -- Payment Processing
  payout_method TEXT, -- 'bank_transfer', 'paypal', 'stripe', 'check'
  payout_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
  payout_date TIMESTAMPTZ,
  payout_reference TEXT, -- Bank transaction ID, PayPal ID, etc.

  -- Related Records
  commission_ids UUID[], -- Array of partner_commissions.id included in this payout
  transaction_count INTEGER,

  -- Metadata
  notes TEXT,
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

#### 6. **ai_prompt_library** (The AI Engine)
```sql
CREATE TABLE ai_prompt_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Prompt Identification
  prompt_name TEXT NOT NULL,
  prompt_category TEXT NOT NULL, -- 'outreach', 'deal_creation', 'objection_handling', 'copywriting', 'lead_research', 'onboarding'
  prompt_subcategory TEXT, -- 'cold_dm', 'email', 'call_script', 'follow_up'

  -- Target Mode
  available_to_modes TEXT[], -- ['partner', 'agency', 'merchant']
  required_tier TEXT, -- 'starter', 'pro', 'agency', null (available to all)

  -- Prompt Content
  prompt_template TEXT NOT NULL, -- The actual prompt with {{variables}}
  system_instructions TEXT, -- System message for AI
  variable_placeholders TEXT[], -- ['city', 'industry', 'business_name', 'pain_point']

  -- Output Configuration
  expected_output_format TEXT, -- 'text', 'json', 'markdown', 'list'
  max_tokens INTEGER DEFAULT 500,
  temperature DECIMAL(3,2) DEFAULT 0.7,

  -- Usage Context
  use_case_description TEXT,
  example_input JSONB, -- Example variable values
  example_output TEXT, -- Example result

  -- Versioning
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  replaces_prompt_id UUID REFERENCES ai_prompt_library(id), -- For version tracking

  -- Performance Tracking
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2), -- Based on user feedback
  average_rating DECIMAL(3,2), -- 1-5 stars

  -- Access Control
  visibility TEXT DEFAULT 'all', -- 'all', 'pro_only', 'agency_only', 'admin_only'

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Example Prompts to Pre-populate:**

```sql
-- Prompt 1: Find Local Business Prospects
INSERT INTO ai_prompt_library (prompt_name, prompt_category, prompt_subcategory, available_to_modes, prompt_template, variable_placeholders, use_case_description) VALUES (
  'Find Restaurant Prospects in City',
  'lead_research',
  'prospect_discovery',
  ARRAY['partner', 'agency'],
  'List 20 restaurants in {{city}}, {{state}} that would benefit from a local deals marketplace. Focus on {{cuisine_type}} restaurants. For each restaurant, provide: 1) Name, 2) Estimated monthly revenue, 3) Why they would benefit from offering deals, 4) Suggested deal idea.',
  ARRAY['city', 'state', 'cuisine_type'],
  'Helps partners quickly identify and research potential merchant prospects in their territory'
);

-- Prompt 2: Cold DM Script
INSERT INTO ai_prompt_library (prompt_name, prompt_category, prompt_subcategory, available_to_modes, prompt_template, variable_placeholders, use_case_description) VALUES (
  'Instagram Cold DM for Restaurants',
  'outreach',
  'cold_dm',
  ARRAY['partner', 'agency'],
  'Write a friendly Instagram DM to {{business_name}}, a {{business_type}} in {{city}}. Mention their {{specific_detail}} that I noticed. Introduce Local-Link Marketplace as a way to fill empty tables during {{slow_period}}. Keep it under 100 words, casual tone, end with a question.',
  ARRAY['business_name', 'business_type', 'city', 'specific_detail', 'slow_period'],
  'Personalized cold outreach that doesn''t feel spammy'
);

-- Prompt 3: Deal Offer Generator
INSERT INTO ai_prompt_library (prompt_name, prompt_category, prompt_subcategory, available_to_modes, prompt_template, variable_placeholders, use_case_description) VALUES (
  'Create Restaurant Deal Offer',
  'deal_creation',
  'offer_builder',
  ARRAY['partner', 'agency', 'merchant'],
  'Create a compelling deal offer for {{business_name}}, a {{business_type}}. Their goal is to {{goal}} during {{timeframe}}. Current pricing: {{current_pricing}}. Suggest: 1) Deal title, 2) Discount percentage, 3) Terms and restrictions, 4) Why this will work.',
  ARRAY['business_name', 'business_type', 'goal', 'timeframe', 'current_pricing'],
  'AI-generated deal offers that merchants can use immediately'
);
```

---

#### 7. **ai_prompt_usage** (Tracking & Credits)
```sql
CREATE TABLE ai_prompt_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  partner_id UUID REFERENCES partner_profiles(id), -- If user is a partner

  -- Prompt Details
  prompt_id UUID REFERENCES ai_prompt_library(id) NOT NULL,
  prompt_variables JSONB, -- The actual values used

  -- AI Response
  ai_output TEXT,
  tokens_used INTEGER,
  cost_cents INTEGER, -- Cost in cents (for tracking)

  -- User Feedback
  user_rating INTEGER, -- 1-5 stars
  user_feedback TEXT,
  was_helpful BOOLEAN,

  -- Result Tracking
  resulted_in_merchant_signup BOOLEAN DEFAULT false,
  merchant_id UUID REFERENCES merchants(id), -- If this prompt led to a signup

  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

#### 8. **partner_training_progress** (Onboarding System)
```sql
CREATE TABLE partner_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partner_profiles(id) NOT NULL,

  -- Module Tracking
  module_id TEXT NOT NULL,
  module_name TEXT NOT NULL,
  module_type TEXT, -- 'video', 'quiz', 'interactive', 'reading', 'live_call'

  -- Progress
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'failed'
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,

  -- Quiz/Assessment
  quiz_score INTEGER, -- Percentage if quiz
  attempts_count INTEGER DEFAULT 0,
  passed BOOLEAN,

  -- Certification
  grants_certification TEXT, -- If completing this grants a certification

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(partner_id, module_id)
);
```

---

#### 9. **partner_activities** (Activity Feed)
```sql
CREATE TABLE partner_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partner_profiles(id) NOT NULL,

  -- Activity Details
  activity_type TEXT NOT NULL, -- 'merchant_contacted', 'demo_scheduled', 'merchant_signed_up', 'deal_created', 'commission_earned', 'training_completed'
  activity_title TEXT NOT NULL,
  activity_description TEXT,

  -- Related Records
  related_merchant_id UUID REFERENCES merchants(id),
  related_deal_id UUID REFERENCES deals(id),
  related_commission_id UUID REFERENCES partner_commissions(id),

  -- Metrics
  activity_value DECIMAL(10,2), -- Commission amount, deal value, etc.

  -- Metadata
  metadata JSONB, -- Additional context

  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

#### 10. **partner_goals** (Gamification & Motivation)
```sql
CREATE TABLE partner_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partner_profiles(id) NOT NULL,

  -- Goal Details
  goal_type TEXT NOT NULL, -- 'merchants_onboarded', 'revenue_generated', 'deals_created', 'training_completed'
  goal_name TEXT NOT NULL,
  goal_description TEXT,

  -- Target & Progress
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0,

  -- Timeline
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,

  -- Reward
  reward_type TEXT, -- 'bonus_commission', 'credit', 'badge', 'tier_upgrade'
  reward_value DECIMAL(10,2),
  reward_description TEXT,

  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'failed', 'expired'
  completed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

#### 11. **partner_team_members** (Agency Mode - Team Management)
```sql
CREATE TABLE partner_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_partner_id UUID REFERENCES partner_profiles(id) NOT NULL, -- The agency owner
  team_member_user_id UUID REFERENCES profiles(id) NOT NULL, -- The team member

  -- Role & Permissions
  role TEXT DEFAULT 'member', -- 'manager', 'member', 'viewer'
  permissions JSONB, -- Granular permissions

  -- Territory Access
  allowed_territories TEXT[], -- Which territories can they work in
  allowed_cities TEXT[],

  -- Commission Split
  commission_split_percentage DECIMAL(5,2), -- What % of commission does team member get
  base_salary DECIMAL(10,2), -- If agency pays salary

  -- Performance
  merchants_onboarded INTEGER DEFAULT 0,
  commission_earned DECIMAL(10,2) DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'removed'
  invited_at TIMESTAMPTZ DEFAULT now(),
  joined_at TIMESTAMPTZ,
  removed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(agency_partner_id, team_member_user_id)
);
```

---

#### 12. **partner_leaderboard** (Materialized View for Performance)
```sql
-- This could be a materialized view refreshed daily
CREATE MATERIALIZED VIEW partner_leaderboard AS
SELECT
  pp.id,
  pp.user_id,
  p.first_name,
  p.last_name,
  pp.partner_tier,
  pp.total_merchants_onboarded,
  pp.active_merchants,
  pp.total_commission_earned,
  pp.monthly_recurring_revenue,
  pp.performance_score,
  pp.primary_city,
  pp.primary_state,
  RANK() OVER (ORDER BY pp.total_commission_earned DESC) as earnings_rank,
  RANK() OVER (ORDER BY pp.total_merchants_onboarded DESC) as merchants_rank,
  RANK() OVER (ORDER BY pp.monthly_recurring_revenue DESC) as mrr_rank
FROM partner_profiles pp
JOIN profiles p ON pp.user_id = p.id
WHERE pp.status = 'active';

-- Refresh this view daily
CREATE INDEX idx_partner_leaderboard_earnings_rank ON partner_leaderboard(earnings_rank);
CREATE INDEX idx_partner_leaderboard_merchants_rank ON partner_leaderboard(merchants_rank);
```

---

## 🔐 ROLES & PERMISSIONS SYSTEM

### Role Hierarchy

```
SUPER_ADMIN
  └── ADMIN
       ├── AGENCY (White-Label)
       │    └── AGENCY_MANAGER
       │         └── PARTNER_PRO
       │              └── PARTNER_STARTER
       │                   └── MERCHANT
       │                        └── CUSTOMER
```

### Permission Matrix

| Feature | Customer | Merchant | Partner Starter | Partner Pro | Agency | Admin |
|---------|----------|----------|-----------------|-------------|--------|-------|
| Browse Deals | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Purchase Deals | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Deals | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| View Partner Dashboard | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| AI Prompt Access (Basic) | ❌ | ❌ | ✅ (50/mo) | ✅ (500/mo) | ✅ (Unlimited) | ✅ |
| AI Prompt Access (Advanced) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Territory Claims | ❌ | ❌ | ✅ (1 city) | ✅ (5 cities) | ✅ (Unlimited) | ✅ |
| Commission Tracking | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Lead Research Tool | ❌ | ❌ | ✅ (Limited) | ✅ | ✅ | ✅ |
| Merchant Onboarding | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Team Management | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| White-Label Options | ❌ | ❌ | ❌ | ❌ | ✅ (Paid) | ✅ |
| Multi-Location Management | ❌ | ✅ (Enterprise) | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ✅ (Enterprise) | ❌ | ❌ | ✅ | ✅ |

---

## 💰 PRICING & COMMISSION STRUCTURE

### Partner Tier Pricing

| Tier | Monthly Fee | Features |
|------|-------------|----------|
| **Starter** | $0 (Free) | - 1 territory/city<br>- 50 AI prompts/month<br>- 15% base commission<br>- Basic training |
| **Pro** | $97/month | - Up to 5 territories<br>- 500 AI prompts/month<br>- 20% base commission<br>- Advanced AI tools<br>- Priority support |
| **Agency** | $197/month | - Unlimited territories<br>- Unlimited AI prompts<br>- 25% base commission<br>- Team management (5 seats)<br>- White-label option (+$299/mo)<br>- API access |

### Commission Structure

**Base Commissions (Recurring Monthly Revenue from Merchants):**

| Merchant Product | Partner Commission |
|------------------|-------------------|
| CRM Starter ($49/mo) | 20% = $9.80/mo |
| CRM Professional ($129/mo) | 20% = $25.80/mo |
| CRM Enterprise ($249/mo) | 20% = $49.80/mo |
| Add-on Services | 15% |
| Marketplace Transactions | 5% of platform fee |
| Merchant Services Processing | 0.1% of volume |

**One-Time Bonuses:**

- Merchant Activation: $50
- First Deal Created: $25
- Merchant Services Signup: $200
- Website Package Sale: 15% of package price

**Tier Bonuses:**

| Monthly MRR | Bonus Rate |
|-------------|------------|
| $0 - $1,000 | Base rate |
| $1,001 - $5,000 | +2% |
| $5,001 - $10,000 | +5% |
| $10,001+ | +8% |

**Example Earnings:**

Partner brings on 10 merchants:
- 5 on CRM Professional ($129/mo) = $129/mo/each × 20% = $25.80 × 5 = **$129/mo**
- 3 on CRM Starter ($49/mo) = $9.80 × 3 = **$29.40/mo**
- 2 on CRM Enterprise ($249/mo) = $49.80 × 2 = **$99.60/mo**

**Total Monthly Recurring Commission: $258/mo**
**Plus Activation Bonuses: $500 (one-time)**

After 6 months: **$1,548 recurring + bonuses**

This makes the "AI income" claim legitimate and attractive.

---

## 🎨 NAVIGATION & USER FLOW

### Main Navigation (Conditional Based on Active Modes)

```
┌─────────────────────────────────────────────────────┐
│  LOCAL-LINK MARKETPLACE                    [Avatar] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  IF mode = 'customer':                              │
│    🏠 Home                                          │
│    💎 Deals                                         │
│    ❤️  Favorites                                     │
│    📦 My Purchases                                  │
│    👤 Profile                                       │
│    💰 Earn with Local-Link  ← NEW ENTRY POINT      │
│                                                      │
│  IF mode = 'merchant':                              │
│    📊 Dashboard                                     │
│    💎 My Deals                                      │
│    👥 CRM                                           │
│    📄 Invoices                                      │
│    📈 Analytics                                     │
│    🎯 Marketing                                     │
│    ⚙️  Settings                                      │
│                                                      │
│  IF mode = 'partner' OR 'agency':                   │
│    💰 Partner Dashboard  ← NEW                     │
│    🎯 Find Businesses  ← AI-powered                │
│    📝 Outreach Tools  ← AI scripts                 │
│    👥 My Merchants                                  │
│    💵 Commissions                                   │
│    🤖 AI Tools                                      │
│    📚 Training                                      │
│    🏆 Leaderboard                                   │
│                                                      │
│  IF mode = 'agency':                                │
│    + Team Management                                │
│    + Territory Management                           │
│    + White-Label Settings                           │
│    + API Access                                     │
│                                                      │
│  IF mode = 'admin':                                 │
│    🔧 Admin Dashboard                               │
│    📋 All features...                               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Partner Mode Activation Flow

**Step 1: Discovery (From Customer Mode)**
```
User sees banner/CTA:
"Want to Earn $500+/month? Help local businesses grow."
[Learn How to Earn] button
```

**Step 2: Partner Intro Page**
```
Headline: "Turn Local Connections into Income"

Sections:
- How It Works (4 simple steps)
- What You'll Earn (commission calculator)
- Who This Is For (side hustlers, sales reps, etc.)
- Success Stories (testimonials)
- AI Tools Preview (show the power)

CTA: [Activate Partner Mode - Free]
```

**Step 3: Partner Activation**
```
Quick form:
- Why do you want to be a partner? (dropdown)
- What city will you focus on? (text)
- Do you have sales experience? (yes/no)
- Agree to Partner Agreement (checkbox)

[Activate My Partner Dashboard]
```

**Step 4: Onboarding Wizard**
```
Welcome to Partner Mode!

Complete these to get started:
1. ✅ Choose Your Territory (completed)
2. ⏳ Watch: How to Find Prospects (3 min video)
3. ⏳ Try Your First AI Tool
4. ⏳ Send Your First Outreach Message
5. ⏳ Complete Partner Training (20 min)

Progress: 20% Complete

[Continue Onboarding]
```

**Step 5: Partner Dashboard (First View)**
```
┌─────────────────────────────────────────────────────┐
│  Welcome, John! Let's get your first merchant.      │
│                                                      │
│  Your Territory: Austin, TX                         │
│  Merchants Onboarded: 0                             │
│  Commission This Month: $0                          │
│  Next Goal: Onboard 1 merchant → Earn $50 bonus    │
│                                                      │
│  [🎯 Find My First Prospect] ← CTA                 │
└─────────────────────────────────────────────────────┘

Your To-Do List:
□ Find 10 prospects in Austin
□ Send 5 outreach messages
□ Complete training module 1
□ Schedule first demo call

AI Tools Quick Start:
→ Find Restaurants in Austin
→ Generate Cold DM Script
→ Create Follow-Up Email
```

---

## 🤖 AI PROMPT LIBRARY STRUCTURE

### Categories & Use Cases

**1. Lead Research & Prospecting**
- Find businesses by type/location
- Research business details
- Identify pain points
- Suggest deal ideas
- Find decision-maker contact info

**2. Outreach Scripts**
- Cold DMs (Instagram, Facebook)
- Cold emails
- Call scripts
- Follow-up sequences
- Objection handling responses

**3. Deal Creation**
- Offer idea generator
- Deal copy writer
- Terms & conditions writer
- Urgency/scarcity creator
- Pricing strategy advisor

**4. Merchant Onboarding**
- Setup checklists
- Training scripts
- FAQ responders
- Feature explainers
- Success tips

**5. Copywriting**
- Email subject lines
- Social media posts
- Ad copy
- Landing page copy
- SMS messages

**6. Problem Solving**
- Objection handlers
- Troubleshooting guides
- FAQs
- Best practices

### Prompt Template Variables

Standard variables available in all prompts:
- `{{user_first_name}}`
- `{{user_city}}`
- `{{user_territory}}`
- `{{business_name}}`
- `{{business_type}}`
- `{{business_city}}`
- `{{industry}}`
- `{{pain_point}}`
- `{{goal}}`
- `{{timeframe}}`
- `{{budget}}`
- `{{current_marketing}}`

---

## 🔄 INTEGRATION WITH EXISTING FEATURES

### How Modes Interact

**Scenario 1: Customer → Partner**
1. Customer browses deals (customer mode)
2. Sees "Earn with Local-Link" banner
3. Activates partner mode
4. Now has access to BOTH customer features AND partner dashboard
5. Can still buy deals while also earning commissions

**Scenario 2: Partner → Agency**
1. Partner brings on 10 merchants
2. Hits $2,000 MRR threshold
3. Gets notification: "Ready to scale? Upgrade to Agency"
4. Upgrades to Agency tier
5. Can now add team members, manage multiple territories
6. Gets API access for custom integrations

**Scenario 3: Merchant → Partner**
1. Merchant already using CRM
2. Sees partner opportunity
3. Activates partner mode
4. Now earns commission by referring other merchants
5. Can use same login to toggle between merchant dashboard and partner dashboard

### Mode Toggle UI

```
Top right of navigation:

┌──────────────────────────────────────┐
│  Mode: [Merchant ▼]                  │
│                                       │
│  Switch to:                           │
│  → Customer Mode                      │
│  → Partner Mode                       │
│  → Agency Mode                        │
└──────────────────────────────────────┘
```

---

## 📊 ANALYTICS & TRACKING

### Partner Dashboard KPIs

**Overview Cards:**
1. Active Merchants
2. Monthly Recurring Commission
3. This Month's Earnings
4. Total Lifetime Earnings
5. Current Tier & Next Tier Progress
6. Pending Commissions
7. Next Payout Date & Amount

**Charts:**
- Commission trend (last 12 months)
- Merchant acquisition funnel
- Territory performance
- AI tool usage & effectiveness
- Outreach activity & conversion rates

**Activity Feed:**
- Recent merchant activities
- Commission notifications
- Goal progress updates
- Training completions
- Leaderboard changes

---

## 🚀 MVP IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
- ✅ Create database tables
- ✅ Add user_modes management
- ✅ Build role/permission system
- ✅ Create partner_profiles table
- ✅ Basic commission tracking

### Phase 2: Partner Dashboard (Week 3-4)
- Partner activation flow
- Partner dashboard UI
- Commission tracker
- Territory selection
- Basic AI prompt library (10 prompts)

### Phase 3: AI Tools (Week 5-6)
- AI prompt execution engine
- Credit/usage tracking
- Prompt result saving
- User feedback collection
- AI tool UI

### Phase 4: Outreach Tools (Week 7-8)
- Lead research tool
- Prospect list builder
- Outreach script generator
- Activity tracking
- Follow-up reminders

### Phase 5: Agency Mode (Week 9-10)
- Team management
- Multi-territory access
- Commission splits
- White-label options
- API access

### Phase 6: Gamification (Week 11-12)
- Goals & challenges
- Leaderboards
- Badges & achievements
- Bonus programs
- Success stories

---

## 🎯 SUCCESS METRICS

### Partner Success Indicators
- % of partners who onboard 1st merchant in 30 days
- Average time to first commission
- % of partners still active at 90 days
- Average MRR per partner
- % of partners who upgrade to Pro/Agency

### Platform Success Indicators
- Partner-sourced merchant signups vs. direct signups
- Partner-sourced merchant LTV vs. direct LTV
- Partner-sourced merchant retention rate
- AI prompt usage and effectiveness
- Partner satisfaction score

### Revenue Targets
- Month 1: 50 partners, $5K commission payout
- Month 3: 200 partners, $25K commission payout
- Month 6: 500 partners, $75K commission payout
- Month 12: 1,000 partners, $200K+ commission payout

---

## 🔥 COMPETITIVE ADVANTAGES

**Why This Beats Competitors:**

❌ **Groupon:** No partner program, no distribution, just ads
❌ **GoDaddy/Wix:** Affiliate programs pay once, then nothing
❌ **Vendasta:** White-label only, no individual earner path
❌ **HighLevel:** Expensive, no built-in marketplace

✅ **Local-Link with Partner Mode:**
- Recurring commissions (not one-time)
- Real AI tools that actually help
- Built-in marketplace for instant validation
- Free to start, upgrade as you grow
- Works for side hustlers AND agencies
- Self-distributing flywheel

---

## 📝 NEXT STEPS - CHOOSE YOUR PATH

Now that we have the complete database architecture and system design, we can build:

**Option A: Build the Database Schema First**
- Create all new tables
- Add RLS policies
- Create indexes
- Write database functions
- Test with sample data

**Option B: Build Partner Dashboard UI**
- Activation flow
- Partner dashboard layout
- Commission tracker UI
- Territory selection UI
- Mode switching UI

**Option C: Build AI Prompt System**
- Prompt library UI
- Prompt execution engine
- Credit tracking
- Result saving
- User feedback

**Option D: Build Complete Onboarding Flow**
- Landing page updates
- "Earn with Local-Link" section
- Partner activation wizard
- Training module system
- First-use experience

**Option E: Write All the AI Prompts**
- 50+ proven prompts
- Test and validate each
- Categorize and tag
- Create example outputs
- Build prompt marketplace

---

**What should we build first?** 🚀

Each option will make the vision real. Pick the one that excites you most or that you want to demo first.
