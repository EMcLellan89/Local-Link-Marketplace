/*
  # Update Local Paws Passport Course - Tier-Based Commission Structure
  
  Updates all lesson content to reflect that commission is based on partner tier:
  - Partner Tier & Master Partner: 80% revenue share
  - White-Label Partner: 70% revenue share
  
  Also updates exam questions to reflect accurate commission structure.
*/

-- Update Module 1, Lesson 2: Business Model & Pricing with tier-based commission
UPDATE course_lessons
SET 
  content_md = '# Business Model & Pricing Tiers

## The Exclusive Partnership Model

Local Paws Passport™ is funded by local business partners, not ads or subscriptions.

**Who Pays:** Local Businesses (Monthly subscription)  
**Who Gets It Free:** Pet Owners, Shelters, Animal Control, Towns

## The Three Pricing Tiers

### Standard Partner — $97/month
- Verified listing in town directory
- Exclusive category placement
- Community Pet Safety Partner status
- Physical welcome kit (window sticker, counter card, QR flyers)

### Featured Partner — $197/month
Everything in Standard, plus priority directory placement and featured partner badge.

### Premier/Emergency Partner — $297/month
Everything in Featured, plus top placement, emergency visibility, and sponsorship recognition.

## Why Exclusivity Matters

**Only ONE business per category, per town.** Once filled, it closes.

This creates:
- Urgency ("If you don''t claim this, your competitor will")
- Value (no dilution, no competition)
- Trust (pet owners know exactly who to call)

## Your Commission Structure (Based on Your Partner Tier)

As a territory partner, your earnings depend on your subscription tier:

### Partner Tier ($69/month) - 80% Revenue Share
- Standard Partner ($97/month): You keep **$77.60/month**
- Featured Partner ($197/month): You keep **$157.60/month**
- Premier Partner ($297/month): You keep **$237.60/month**

### Master Partner ($179/month) - 80% Revenue Share
- Same as Partner Tier: **80% of all merchant subscriptions**

### White-Label Partner ($549/month) - 70% Revenue Share
- Standard Partner ($97/month): You keep **$67.90/month**
- Featured Partner ($197/month): You keep **$137.90/month**
- Premier Partner ($297/month): You keep **$207.90/month**

**Plus:** $200+ bonus for merchant services signups (credit card processing)

### Example Earnings (Partner Tier at 80%):
- 10 Standard Partners = $776/month recurring
- 5 Featured Partners = $788/month recurring
- 2 Premier Partners = $475.20/month recurring
- **Total = $2,039.20/month** from just 17 businesses

**Scale that across multiple towns in your territory.**',
  updated_at = now()
WHERE id = 'e610c2ed-2030-469e-9c81-d2a917d05c5d';

-- Update Module 1, Lesson 4: Territory & Exclusivity to reflect tier-based commission
UPDATE course_lessons
SET 
  content_md = '# Territory Structure & Exclusivity Rules

## How Territories Work

You are assigned **exclusive geographic territories** by town, county, or region. You own your territory—no competition from other Local Paws Passport™ partners.

## Category Exclusivity

Within each town, sign **one business per category:**

1. Veterinary Services (General + Emergency as separate)
2. Pet Stores & Feed
3. Grooming Services
4. Boarding & Daycare
5. Training & Behavior

**Once a category is filled in a town, it closes.**

## Territory Rights & Responsibilities

**Your Rights:**
- Exclusive selling rights in your territory
- All revenue share from your signups (80% for Partner/Master tiers, 70% for White-Label)
- Protected from other partners

**Your Responsibilities:**
- Active outreach to businesses
- Professional representation
- Partner support after signup

## Multi-Town Strategy

Start with ONE town. Master it. Then expand to adjacent towns.

## Pricing Integrity

All partners sell at the same price tiers. No custom discounting. Maintains fairness and brand positioning.

## Revenue Share Structure

Your earnings depend on your partner tier subscription:

**Partner Tier ($69/month) & Master Partner ($179/month):**
- 80% of all merchant subscription revenue
- You keep $77.60 of every $97/month Standard subscription
- You keep $157.60 of every $197/month Featured subscription
- You keep $237.60 of every $297/month Premier subscription

**White-Label Partner ($549/month):**
- 70% of all merchant subscription revenue (lower due to higher upfront value)
- You keep $67.90 of every $97/month Standard subscription
- You keep $137.90 of every $197/month Featured subscription
- You keep $207.90 of every $297/month Premier subscription

## Priority Order

1. Emergency Vet (highest value - Premier tier)
2. General Vet (highest trust)
3. Pet Store (high foot traffic)
4. Groomer (frequent interaction)
5. Boarding & Training

## Key Principles

- Exclusivity creates value—protect it
- Territory integrity matters—respect boundaries
- Quality over quantity—sign the right partners
- Scale methodically—master one town first',
  updated_at = now()
WHERE id = 'cc6b7007-86b6-4d12-9d60-d5e397edd399';

-- Update Module 5, Lesson 5: Maximizing Revenue
UPDATE course_lessons
SET 
  content_md = '# Maximizing Lifetime Revenue per Territory

## Revenue Levers

1. **New Partner Acquisition** (Most effort)
2. **Upsells to Higher Tiers** (Medium effort)
3. **Retention/Preventing Churn** (Low effort)
4. **Territory Expansion** (Strategic effort)
5. **Referral Generation** (Passive effort)

**Pull all levers, but prioritize retention and upsells for compounding growth.**

## Territory Revenue Model (Partner Tier at 80% revenue share)

### Example: 3 Towns, 7 Partners Per Town = 21 Partners

**Conservative Mix:**
- 15 Standard @ $97 = $1,455/month (you keep $1,164/month)
- 4 Featured @ $197 = $788/month (you keep $630.40/month)
- 2 Premier @ $297 = $594/month (you keep $475.20/month)

**Total Merchant MRR: $2,837/month**  
**Your 80% Share: $2,269.60/month**

**Annual Recurring: $27,235.20**

**Scale to 6 towns = $54,470.40/year** (with same mix per town)

## White-Label Partners (70% revenue share)

Same 21 partners example:
- Your 70% share: $1,985.90/month
- Annual: $23,830.80
- Scale to 6 towns: $47,661.60/year

**Note:** White-Label partners pay higher subscription ($549/month) but get custom branding, API access, and can scale to 100 territories.

## The Long Game

**Year 1:** Build foundation (10-20 partners)  
**Year 2:** Scale and optimize (30-50 partners)  
**Year 3:** Mature territory (50-70+ partners)  
**Year 4+:** Passive income with minimal new acquisition

**Recurring revenue compounds.**

## Avoid These Traps

❌ Focusing only on acquisition (churn kills you)  
❌ Neglecting existing partners (they leave quietly)  
❌ Over-promising results (sets you up for cancellations)  
❌ Expanding too fast (quality suffers)

✅ Build slowly, retain fiercely, scale methodically.

## Upgrading Your Partner Tier

As your territory grows, consider upgrading:

**Start with Partner Tier ($69/month):**
- Perfect for getting started
- 80% revenue share
- Up to 10 territories

**Upgrade to Master Partner ($179/month) when:**
- You have 10+ territories
- You need priority support
- You want advanced analytics

**Upgrade to White-Label ($549/month) when:**
- You have 25+ territories
- You want your own brand
- You need API access
- You want custom domain

## Final Thought

**This is not a get-rich-quick model. It''s a build-wealth-steadily model.**

Do the work. Support your partners. Grow deliberately.

**In 2-3 years, you''ll have a territory generating $2,000-5,000/month in recurring revenue.**

That''s life-changing income.',
  updated_at = now()
WHERE module_id IN (SELECT id FROM course_modules WHERE course_id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f' AND module_index = 5)
  AND lesson_index = 5;

-- Update exam question 3 about commission rate
UPDATE course_exam_questions
SET 
  question_text = 'What is your recurring revenue share on all partner subscriptions as a Partner Tier member?',
  options = '[
    {"id": "a", "text": "50%"},
    {"id": "b", "text": "70%"},
    {"id": "c", "text": "80%"},
    {"id": "d", "text": "90%"}
  ]'::jsonb,
  correct_option_id = 'c',
  explanation = 'As a Partner Tier or Master Partner member, you earn 80% revenue share on every merchant subscription. White-Label Partners earn 70% due to their higher tier benefits and upfront value.'
WHERE course_id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f'
  AND question_index = 3;

-- Update exam question 12 about commission calculation
UPDATE course_exam_questions
SET 
  question_text = 'If you have 10 Standard partners at $97/month and you''re on the Partner Tier (80% revenue share), what is your monthly recurring revenue?',
  options = '[
    {"id": "a", "text": "$194"},
    {"id": "b", "text": "$776"},
    {"id": "c", "text": "$970"},
    {"id": "d", "text": "$1,164"}
  ]'::jsonb,
  correct_option_id = 'b',
  explanation = '10 partners × $97/month = $970 total MRR. Your 80% revenue share = $776/month in recurring income. Note: This assumes you''re on Partner Tier or Master Partner. White-Label partners would earn 70%.'
WHERE course_id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f'
  AND question_index = 12;
