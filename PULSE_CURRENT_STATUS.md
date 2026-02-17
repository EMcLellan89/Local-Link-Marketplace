# LOCAL-LINK PULSE™ — CURRENT BUILD STATUS

## 📊 WHAT'S ALREADY BUILT

### ✅ CUSTOMER SIDE (Already Exists)

#### **Browse Deals Page** (`/customer/deals`)
**File:** `src/pages/customer/DealsPage.tsx`

**Current Features:**
- Grid view of all active deals
- Category filtering (Restaurant, Services, Retail, etc.)
- Heart/favorite functionality
- Deal cards showing:
  - Deal image or placeholder
  - Title and description
  - Merchant name and city
  - Original price (struck through)
  - Deal price (green)
  - Savings percentage badge
  - "View Deal" button
- Dev mode support with mock data
- Empty state handling
- Loading states

**What's Missing for Pulse:**
- ❌ Real-time "What's Happening Now" feed
- ❌ Expiring soon sorting/weighting
- ❌ Boosted deal visibility
- ❌ Flash Friday integration
- ❌ Social proof counters (X people claimed today)
- ❌ Sponsored labels
- ❌ Points/rewards system integration
- ❌ City detection/switching
- ❌ Leaderboards
- ❌ Events and jobs feed
- ❌ Login-gated claiming with auto-account creation

#### **Deal Detail Page** (`/deal/:id`)
**File:** `src/pages/customer/DealDetailPage.tsx`

**Current Features:**
- Full deal information
- Redemption instructions
- Purchase flow
- Favorite toggle

**What's Missing for Pulse:**
- ❌ Live claim counter
- ❌ Points earned display
- ❌ Referral link generation
- ❌ Boost indicator

---

### ✅ MERCHANT SIDE (Already Exists)

#### **Manage Deals Page** (`/merchant/deals`)
**File:** `src/pages/merchant/MerchantDealsPage.tsx`

**Current Features:**
- List view of all merchant deals
- Status badges (active, inactive, draft, etc.)
- Deal metrics:
  - Price and original value
  - Quantity sold / total
  - End date
- Quick actions:
  - Toggle active/inactive
  - Delete deal
  - Create new deal button
- Empty state with CTA
- Error handling

**What's Missing for Pulse:**
- ❌ Pulse Performance section
- ❌ Boost purchase options ($29, $49, $99, $149)
- ❌ Live feed preview
- ❌ Deal performance analytics (views, claims, conversion)
- ❌ Flash Friday enrollment
- ❌ Push notification blast option
- ❌ Growth Coach AI integration
- ❌ Milestone tracker
- ❌ AI Upgrade Bot prompts
- ❌ Tier-based deal limits enforcement
- ❌ Real-time ranking in feed

#### **Create Deal Flow** (`/merchant/deals/new`)
**Current Features:**
- Basic deal creation form (assumed, page not reviewed)

**What's Missing for Pulse:**
- ❌ Tier-based creation limits
- ❌ Boost upsell during creation
- ❌ Auto-suggest optimal timing
- ❌ Category-specific templates

---

## 🗄️ DATABASE STRUCTURE

### ✅ Existing Tables

#### **`deals` table**
Already exists with:
- `id`, `merchant_id`, `title`, `slug`
- `short_description`, `description`
- `original_value_cents`, `price_cents`
- `commission_rate`
- `max_quantity`, `quantity_sold`, `per_customer_limit`
- `start_at`, `end_at`
- `status` (draft, active, inactive, etc.)
- `redemption_instructions`
- `image_url`
- `featured_until`
- `created_at`, `updated_at`

**What's Missing:**
- ❌ `boost_type` column (none, standard_7day, flash_friday, homepage, push_blast)
- ❌ `boost_expires_at` column
- ❌ `boost_purchase_id` column (link to Stripe payment)
- ❌ `view_count` column
- ❌ `claim_count` column (for social proof)
- ❌ `performance_enabled` boolean
- ❌ `city` column (for city-based filtering)

#### **`events` table**
Already exists (basic structure for calendar events)

**What's Missing:**
- ❌ Integration into Pulse feed
- ❌ Boost options for events
- ❌ RSVP/attendance tracking
- ❌ Points rewards for attending

#### **`jobs` table**
Already exists (basic job postings)

**What's Missing:**
- ❌ Integration into Pulse feed
- ❌ Application tracking
- ❌ Featured job boosts

#### **`weekly_creative_winners` table**
Already exists for StoryLab creative tracking

**Needs Adaptation:**
- ❌ Convert to `pulse_weekly_winners` for local city leaderboards
- ❌ Track points, not just creative performance
- ❌ City-based segmentation

---

## 🚫 COMPLETELY MISSING COMPONENTS

### Consumer Features
1. **Pulse Feed Engine** - Revenue-weighted + AI-personalized feed
2. **City Selector** - Hybrid IP + manual override
3. **Points System** - Earn, track, redeem points
4. **Leaderboards** - City monthly, national quarterly, lifetime
5. **Referral Engine** - Unique links, tracking, rewards
6. **Auto-Account Creation** - Browse without login, claim creates account
7. **Social Proof Counters** - "X claimed today" real-time updates
8. **Flash Friday Feed** - Special Friday deal section
9. **Badges System** - Achievement badges for users

### Merchant Features
1. **Pulse Dashboard Section** - Separate Pulse analytics
2. **Boost Purchase Flow** - Stripe checkout for boosts
3. **Performance Subscription** - Upgrade to Performance tier ($199/$149)
4. **Growth Coach AI** - Daily/weekly/monthly/annual plans
5. **AI Upgrade Bot** - Activity-based upgrade prompts
6. **Milestone Rewards** - Auto-issue boost credits
7. **Feed Preview** - See how deal appears in Pulse
8. **Real-time Analytics** - Live view/claim/conversion metrics

### Database Tables Needed
1. **`pulse_boosts`** - Track boost purchases and status
2. **`pulse_performance_subscriptions`** - Track Performance tier subscriptions
3. **`pulse_points`** - Points ledger for users
4. **`pulse_badges`** - Achievement badges
5. **`pulse_user_badges`** - User badge awards
6. **`pulse_leaderboards`** - City/national rankings
7. **`pulse_claims`** - Track deal claims (separate from purchases)
8. **`pulse_referrals`** - Referral tracking
9. **`pulse_cities`** - City activation status (pilot vs public)
10. **`pulse_growth_plans`** - AI-generated merchant plans
11. **`pulse_milestones`** - Merchant milestone definitions
12. **`pulse_milestone_progress`** - Track merchant progress

### Admin Features
1. **Pulse Moderation Dashboard** - Review/approve deals for feed
2. **City Activation Manager** - Enable cities when they hit 50 merchants
3. **Boost Purchase Tracking** - Revenue from boosts
4. **Performance Subscription Manager** - Track Performance tier revenue
5. **Weekly Winner Calculator** - Run leaderboard calculations
6. **Badge Award System** - Award badges manually or via triggers

### Revenue Infrastructure
1. **Stripe Boost Products** - 4 boost SKUs created
2. **Stripe Performance Products** - 2 Performance subscription SKUs
3. **Commission Tracking** - Link boosts to partner attribution
4. **3-Month Minimum Enforcement** - Block cancellation before 3 months
5. **Tier-based Access Control** - Prevent Starter from accessing Performance

---

## 💰 REVENUE MODEL SUMMARY

### What Exists Now
- Basic deal subscriptions (4-tier merchant pricing)
- Commission tracking on deal purchases
- Stripe integration for subscriptions

### What's Missing for Pulse Revenue
1. **Boost Revenue Stream** - $29/$49/$99/$149 one-time purchases
2. **Performance Add-on Revenue** - $199/$149 monthly (3-month min)
3. **Flash Friday Premium** - $49 weekly placements
4. **Push Notification Blasts** - $149 per send
5. **Double Points Sponsorships** - Future revenue stream
6. **Sentext Referral Commission** - White-label loyalty integration

---

## 🎯 WHAT THIS MEANS

### Good News
✅ Foundation is solid - basic deals system works
✅ Merchant and customer pages exist
✅ Database structure is in place
✅ Authentication and role-based access works
✅ Stripe integration exists

### Reality Check
⚠️ **PULSE DOES NOT EXIST YET**

This is what we have:
- Traditional deal marketplace (Groupon-style)
- Basic browse and purchase flow
- Merchant deal management

This is what Pulse needs to be:
- Real-time "what's happening now" social feed
- Revenue-weighted algorithmic sorting
- Points and gamification system
- City-based community features
- Multi-layered monetization (boosts, performance, etc.)

---

## 🚀 BUILD PRIORITY (To Create Pulse)

### Phase 1 - Core Feed Engine (Consumer)
1. Extend `deals` table with boost/performance columns
2. Create `pulse_cities` table with Pepperell seeded
3. Build feed algorithm (revenue-weighted sorting)
4. Add city detection and selector
5. Create Pulse feed page (replace/enhance DealsPage)
6. Add social proof counters (real-time claims)
7. Implement browse-without-login, claim-with-login flow

### Phase 2 - Points & Engagement
1. Create `pulse_points` and `pulse_claims` tables
2. Build points ledger system
3. Create leaderboard tables and calculations
4. Build leaderboard UI (city/national)
5. Implement referral tracking system
6. Create badges system

### Phase 3 - Merchant Monetization
1. Create `pulse_boosts` table
2. Build boost purchase flow (Stripe integration)
3. Add boost management to merchant dashboard
4. Create `pulse_performance_subscriptions` table
5. Build Performance upgrade flow
6. Implement 3-month minimum enforcement
7. Add feed preview and analytics

### Phase 4 - Growth & Retention
1. Build Growth Coach AI system
2. Create milestone tracking
3. Implement AI Upgrade Bot triggers
4. Add Performance feature gates
5. Build merchant analytics dashboard

### Phase 5 - Admin Control
1. Build city activation dashboard
2. Create boost/Performance revenue tracking
3. Build weekly winner calculator
4. Add badge award system
5. Create moderation dashboard

---

## 📈 THE GAP ANALYSIS

**Current State:**
Traditional deal marketplace with basic browse/buy flow.

**Pulse Vision:**
Real-time social feed with AI-powered sorting, points gamification, city-based community, and multi-layered monetization.

**Build Estimate:**
- ~15 new database tables
- ~25 new pages/components
- ~10 Stripe products
- ~8 new API endpoints/edge functions
- Significant algorithm development (feed sorting, AI recommendations)

**This is a 2-3 week full build for a complete Pulse system.**

---

## ✅ NEXT STEPS

Would you like me to:

**Option A:** Build the full Pulse system from scratch (comprehensive 2-3 week build)

**Option B:** Create a Phase 1 MVP (Core feed + boosts only, 3-5 days)

**Option C:** Just add boost purchasing to existing deals (quickest, 1 day)

**Option D:** Focus on specific component (tell me what's most important to prove first)

Let me know which direction maximizes revenue fastest for the Pepperell pilot.
