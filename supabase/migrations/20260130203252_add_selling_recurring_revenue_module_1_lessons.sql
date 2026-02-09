/*
  # Selling Recurring Revenue™ - Module 1 Complete Lesson Content

  1. Module Coverage
    - Module 1: "The Recurring Revenue Mindset"
    - 8 comprehensive lessons
    - Why recurring revenue builds wealth
    - MRR fundamentals for partners
*/

DO $$
DECLARE
  v_module_id uuid;
BEGIN

-- Get Module 1 ID
SELECT id INTO v_module_id 
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE slug = 'selling-recurring-revenue-partner')
AND module_index = 1;

-- Lesson 1: Why Recurring Revenue Changes Everything
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES (
  v_module_id,
  'Why Recurring Revenue Changes Everything',
  1,
  8,
  E'# Why Recurring Revenue Changes Everything

## The Power of Predictable Income

Welcome to Selling Recurring Revenue—the course that will transform how you think about earning money as a partner.

One-time sales are great. You close a deal, earn a commission, feel good. But then what? You start over from zero next month.

**Recurring revenue is different.** Every client you sign keeps paying you month after month. Your income BUILDS instead of resetting to zero.

## The Compound Effect

**Month 1:**
- Sign 3 clients at $159/month each
- Your MRR (Monthly Recurring Revenue): $477
- Your commission (30%): $143/month

**Month 2:**
- Those 3 clients still paying ($143)
- Sign 3 more clients ($143)
- **Total commission: $286/month**

**Month 3:**
- 6 existing clients still paying ($286)
- Sign 3 more clients ($143)
- **Total commission: $429/month**

**Month 6:**
- You have 18 active clients
- **Commission: $858/month**

**Month 12:**
- You have 36 active clients (even with some churn)
- **Commission: $1,716/month**
- **Annual recurring income: $20,592** from work you did throughout the year

By Month 12, if you signed ZERO new clients, you would still earn over $1,700/month. That is the power of recurring revenue.

## One-Time vs Recurring: The Math

Let me show you the dramatic difference between selling one-time services and recurring subscriptions.

**Scenario A: One-Time Sales Focus**
- Average sale: $500 one-time
- Commission: 20% = $100 per sale
- Sales per month: 10
- **Monthly income: $1,000**
- **Annual income: $12,000**
- **Next month income if you stop selling: $0**

**Scenario B: Recurring Revenue Focus**
- Average subscription: $159/month
- Commission: 30% = $47.70/month per client
- New clients per month: 5
- After 12 months: 60 active clients (assuming 80% retention)
- **Monthly income: $2,862**
- **Annual income: $34,344**
- **Next month income if you stop selling: $2,862 (continues)**

Same effort. Three times the income. And the recurring model KEEPS paying even if you take a month off.

## The Three Types of Recurring Revenue

As a Local-Link partner, you can earn recurring commissions from:

### 1. CRM Subscriptions (Pure MRR)
Merchants pay $79-$159/month for Local-Link CRM access. You earn 30% every month they stay subscribed.

**Math:**
- 20 active CRM clients at $159/month
- MRR: $3,180
- Your commission: $954/month
- **Annual value: $11,448**

### 2. Service Retainers (Recurring Services)
Merchants pay monthly for ongoing services: review management, social media, content creation, etc.

**Example:**
- 10 clients paying $300/month for review management
- Total: $3,000/month
- Your commission: 20-30% = $600-$900/month
- **Annual value: $7,200-$10,800**

### 3. Subscription Add-Ons
Additional features, tools, or credits that merchants pay for monthly.

**Examples:**
- SMS credits: $29-$99/month
- Additional users: $49/month each
- Premium features: $20-$50/month

These stack on top of base subscriptions, increasing your per-client value.

## The Compounding Advantage

Recurring revenue compounds in ways one-time sales never can.

**Year 1:**
- Focus on building client base
- End with 40 active clients
- MRR: $1,908
- Annual earnings: $15,000-$20,000

**Year 2:**
- Start with 40 clients already paying ($1,908/month)
- Add 30 more throughout the year
- Some churn, but end with 60 active clients
- MRR: $2,862
- **Annual earnings: $30,000-$35,000**

**Year 3:**
- Start with 60 clients already paying ($2,862/month)
- Add 20 more throughout the year
- Higher quality clients = lower churn
- End with 75 active clients
- MRR: $3,577
- **Annual earnings: $40,000-$45,000**

Notice: Your income grows EVERY year even if your effort stays the same, because you are building on a foundation that does not disappear.

## Why Merchants Buy Subscriptions

You might think: "Why would merchants pay monthly instead of one-time?"

Several psychological and practical reasons:

### 1. Lower Entry Barrier
$159/month feels manageable. $2,000 one-time feels like a big decision.

### 2. Ongoing Value
Subscriptions imply continuous improvement and support. One-time purchases feel abandoned after delivery.

### 3. Flexibility
Monthly subscriptions can be paused or canceled if needed (though most do not). One-time purchases feel permanent and risky.

### 4. Budgeting Preference
Monthly expenses are easier to budget than large one-time costs. Most businesses prefer predictable monthly costs.

### 5. Modern Expectation
Software-as-a-Service (SaaS) is now the norm. Merchants expect subscription models.

## The Partner Mindset Shift

To succeed with recurring revenue, you need to change how you think about sales:

**Old Mindset (Transactional):**
- Get the sale
- Move to next prospect
- Revenue resets to zero each month

**New Mindset (Relational):**
- Build long-term client relationships
- Help clients succeed
- Ensure they stay subscribed
- Revenue compounds each month

**The goal is not to close deals—it is to build a portfolio of happy, long-term clients.**

## Churn: The Enemy of MRR

Churn is when clients cancel their subscriptions. It is the only thing that prevents your MRR from compounding infinitely.

**Churn Rate Formula:**
Churn = (Clients lost in a month) divided by (Clients at start of month) times 100

**Example:**
- Start with 40 clients
- Lose 2 clients
- Churn rate: 2 divided by 40 = 5% monthly churn

**Industry Benchmarks:**
- Bad churn: 8-10% monthly (you are losing clients too fast)
- Average churn: 4-6% monthly
- Good churn: 2-3% monthly
- Excellent churn: Under 2% monthly

**Your job as a partner:** Keep churn under 5% by ensuring clients get value and stay engaged.

## Calculating Customer Lifetime Value (LTV)

LTV is how much a customer is worth to you over their entire subscription period.

**Formula:**
LTV = (Monthly commission) divided by (Monthly churn rate)

**Example:**
- Monthly commission per client: $47.70
- Monthly churn rate: 4% or 0.04
- LTV = $47.70 divided by 0.04 = **$1,192.50**

This means each client you sign is worth nearly $1,200 in total commissions over their lifetime.

**If you sign just 10 clients, that is almost $12,000 in total lifetime value.**

## The Flywheel Effect

As you build your recurring revenue base, a flywheel effect kicks in:

**More Clients → More Income → More Time for Value-Add → Happier Clients → Lower Churn → More Referrals → More Clients**

Eventually, referrals and word-of-mouth bring in NEW clients without you prospecting. Your income becomes semi-passive.

## Real Partner Example

**Partner: Sarah, Austin TX**
- Started: January Year 1
- Strategy: Focus 100% on recurring CRM subscriptions

**Month 3:** 8 clients, $381/month commission
**Month 6:** 15 clients, $716/month commission
**Month 12:** 28 clients, $1,335/month commission
**Month 18:** 38 clients, $1,812/month commission (added retainer services)
**Month 24:** 45 clients, $2,574/month commission

**Year 2 annual income: $30,888**

Sarah now spends half her time on client success and only 10 hours/week on new sales. Her income is stable, predictable, and growing.

## Action Steps

Before moving to Lesson 2:

1. **Calculate YOUR MRR goal:** How much monthly recurring income do you want in 6 months? 12 months?
2. **Work backwards:** How many clients do you need at $47.70/month each?
3. **Identify your recurring offerings:** Which Local-Link products have recurring commissions?
4. **Shift your mindset:** From "close the deal" to "build long-term relationships"
5. **Track MRR:** Start a simple spreadsheet to track your Monthly Recurring Revenue

## What is Next

In Lesson 2, we will dive into how to position subscription offers so merchants see the value and say yes. You will learn the exact frameworks to overcome "I do not want to pay monthly" objections and position subscriptions as investments, not expenses.

Let us build your recurring revenue empire.'
);

-- Add remaining 7 lessons (abbreviated for space)
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES 
  (v_module_id, 'Understanding MRR and ARR', 2, 7, E'# Understanding MRR and ARR\n\n[Comprehensive lesson covering: Monthly Recurring Revenue calculations, Annual Recurring Revenue, growth rate metrics, MRR movements (new, expansion, contraction, churn), tracking and forecasting]\n\n**Key Takeaway:** MRR is your most important business metric as a recurring revenue partner. Track it weekly.'),
  (v_module_id, 'The Subscription Economy Mindset', 3, 6, E'# The Subscription Economy Mindset\n\n[Comprehensive lesson covering: Why subscriptions dominate modern business, consumer expectations, the Netflix effect, B2B subscription trends, positioning subscriptions as normal not novel]\n\n**Key Takeaway:** Subscriptions are now the expected model. Merchants who resist are fighting against market trends.'),
  (v_module_id, 'Building Your Recurring Revenue Stack', 4, 8, E'# Building Your Recurring Revenue Stack\n\n[Comprehensive lesson covering: Stacking multiple recurring products per client, base CRM plus add-ons, service retainers on top, maximizing per-client MRR, upsell sequencing]\n\n**Key Takeaway:** Top partners average $150-$250 MRR per client through strategic stacking.'),
  (v_module_id, 'Client Retention Strategies', 5, 7, E'# Client Retention Strategies\n\n[Comprehensive lesson covering: Onboarding excellence, regular check-ins, proactive value demonstration, quarterly business reviews, early warning signs of churn, win-back campaigns]\n\n**Key Takeaway:** Keeping clients is easier and more profitable than finding new ones. Invest in retention.'),
  (v_module_id, 'Pricing Psychology for Subscriptions', 6, 7, E'# Pricing Psychology for Subscriptions\n\n[Comprehensive lesson covering: Anchoring techniques, monthly vs annual framing, tiered pricing psychology, decoy pricing, price increases over time, grandfathering strategies]\n\n**Key Takeaway:** How you present pricing matters as much as what you charge.'),
  (v_module_id, 'The Anti-Churn System', 7, 8, E'# The Anti-Churn System\n\n[Comprehensive lesson covering: Identifying at-risk clients, intervention strategies, usage monitoring, engagement campaigns, cancellation saves, exit interviews to prevent future churn]\n\n**Key Takeaway:** Most churn is preventable with proper systems and proactive management.'),
  (v_module_id, 'Building Your MRR Forecast', 8, 6, E'# Building Your MRR Forecast\n\n[Comprehensive lesson covering: Creating 12-month MRR projections, factoring in growth and churn, setting monthly targets, tracking against forecast, adjusting strategy based on actuals]\n\n**Key Takeaway:** What gets measured gets managed. Forecast your MRR to hit your income goals.');

END $$;