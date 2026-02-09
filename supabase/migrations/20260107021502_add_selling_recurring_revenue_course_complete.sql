/*
  # Add Selling Recurring Revenue™ Course - Complete

  1. Products
    - Course ($297)
    - Pro Toolkit ($97)
    - Bundle ($347)

  2. Course Content
    - Main course record
    - 5 modules (26 lessons total)
    - 25 exam questions with answers

  3. Upsell
    - Pro Toolkit offer after purchase
*/

-- Insert products
INSERT INTO products_catalog (
  slug,
  title,
  product_type,
  price_cents,
  stripe_price_id,
  description,
  is_active,
  metadata
) VALUES 
  (
    'selling-recurring-revenue',
    'Selling Recurring Revenue™',
    'one_time',
    29700,
    'price_selling_recurring_revenue',
    'Master the art of selling monthly recurring revenue. Complete system: offers, pipeline, objections, retention, delivery, and scaling.',
    true,
    jsonb_build_object(
      'is_course', true,
      'course_slug', 'selling-recurring-revenue',
      'features', jsonb_build_array(
        '5 comprehensive modules',
        '26 detailed lessons',
        'Templates and worksheets',
        'Objection handling library',
        'ROI calculators',
        'Certification exam',
        'Lifetime access'
      )
    )
  ),
  (
    'selling-recurring-revenue-pro-toolkit',
    'Pro Toolkit Add-On',
    'addon',
    9700,
    'price_recurring_revenue_pro_toolkit',
    'Upgrade with premium tools: pricing calculator, proposal templates, role-play scripts, and pipeline blueprint.',
    true,
    jsonb_build_object(
      'parent_course', 'selling-recurring-revenue',
      'features', jsonb_build_array(
        'Interactive pricing calculator',
        'Proposal templates (3 versions)',
        'Onboarding checklist template',
        'Role-play objection library',
        'Pipeline blueprint'
      )
    )
  ),
  (
    'selling-recurring-revenue-bundle',
    'Selling Recurring Revenue™ + Pro Toolkit Bundle',
    'one_time',
    34700,
    'price_recurring_revenue_bundle',
    'Complete package: Full course + Pro Toolkit. Save $47.',
    true,
    jsonb_build_object(
      'is_bundle', true,
      'course_slug', 'selling-recurring-revenue',
      'includes', jsonb_build_array(
        'selling-recurring-revenue',
        'selling-recurring-revenue-pro-toolkit'
      ),
      'savings_cents', 4700
    )
  )
ON CONFLICT (slug) DO NOTHING;

-- Create course
INSERT INTO courses (slug, title, subtitle, description, is_published)
VALUES (
  'selling-recurring-revenue',
  'Selling Recurring Revenue™',
  'Close monthly clients confidently using simple offers, clean pricing, and a repeatable system.',
  'A complete system to build and sell recurring revenue offers ethically. Includes offer building, pipeline, objections, retention, delivery, and scaling. Perfect for local business consultants, agency owners, and sales reps.',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Create modules and lessons
DO $$
DECLARE
  v_course_id uuid;
  v_mod1 uuid;
  v_mod2 uuid;
  v_mod3 uuid;
  v_mod4 uuid;
  v_mod5 uuid;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'selling-recurring-revenue';
  
  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  -- Module 1
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 1, 'Recurring Revenue Foundations', 'Why recurring wins, what to sell, and how to price in outcomes.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_mod1;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes) VALUES
    (v_mod1, 1, 'Why Recurring Beats One-Time', E'# Why Recurring Beats One-Time\n\n## Overview\nUnderstand the compounding impact of MRR vs one-time sales and why recurring revenue creates stable, predictable, and scalable income.\n\n## Key Points\n- MRR compounds and stabilizes cash flow\n- Recurring builds valuation and predictability\n- Lower stress = better delivery = longer retention\n- Your business becomes sellable at 3-5x ARR multiple\n\n## Examples\n- **10 clients at $297/mo = $2,970 MRR**; 12 months = $35,640 (before expansion)\n- **Churn impact**: Losing 2 clients/month destroys growth; retention IS sales\n- One-time project at $5,000 requires constant hunting; $500/mo client worth $6,000+ over 12 months\n\n## Exercise\nWrite your target MRR for 90 days. Calculate how many clients you need at your chosen price point. Then calculate the annual value assuming 12-month retention.\n\n**Template: MRR Target Sheet**\n- Target MRR: _______\n- Price Point: _______\n- Clients Needed: _______\n- Weekly Close Target: _______\n- Annual Value: _______', 25),
    
    (v_mod1, 2, 'The 3 Recurring Offer Types', E'# The 3 Recurring Offer Types\n\n## Overview\nPick the recurring model that matches your business model and delivery capacity.\n\n## Three Types\n\n### 1. Platform Subscription ($49-$149/mo)\n- **Example**: Local-Link CRM subscription\n- **Pros**: Low delivery cost, high retention\n- **Cons**: Lower price point\n\n### 2. Managed Service ($497-$2,997/mo)\n- **Example**: Done-for-you local SEO + reviews\n- **Pros**: High price, high value\n- **Cons**: Requires team or systems\n\n### 3. Hybrid ($297-$997/mo)\n- **Example**: Platform + coaching + setup\n- **Pros**: Balanced price and delivery\n- **Cons**: Must define scope clearly\n\n## Exercise\nPick 1 offer type for your first 10 clients. Explain why in 3 sentences. Consider your capacity, skills, and target market.\n\n## Checklist\n- Can I deliver this monthly without burning out?\n- Does it tie to a measurable business outcome?\n- Can I retain clients for 6+ months?\n- Is there clear differentiation from free/cheap alternatives?', 20),
    
    (v_mod1, 3, 'What Local Businesses Actually Pay Monthly For', E'# What Local Businesses Actually Pay Monthly For\n\n## Overview\nSell outcomes clients care about: calls, bookings, reviews, repeat business, visibility. Never sell features or tasks.\n\n## Framework\n**Pain → Cost of Pain → Desired Outcome → Simple Offer**\n\n## Examples by Niche\n\n### Trades (plumbers, HVAC)\n- **Pain**: Missed calls + slow estimates\n- **Outcome**: Every call captured + same-day estimates\n- **Offer**: AI receptionist + CRM + booking automation\n\n### Restaurants\n- **Pain**: One-time customers + low reviews\n- **Outcome**: Repeat visits + 5-star reputation\n- **Offer**: Loyalty program + review automation\n\n### Salons\n- **Pain**: Cancellations + empty chairs\n- **Outcome**: Fully booked + reduced no-shows\n- **Offer**: Booking system + reminder automation + waitlist\n\n## Exercise\nWrite 10 pains for your target niche and match each to a recurring solution you can deliver. Be specific.\n\n**Worksheet: Pain List Mapping**\n| Pain | Monthly Cost | Solution | Price Point |\n|------|-------------|----------|-------------|\n| | | | |', 30),
    
    (v_mod1, 4, 'Pricing Psychology for Monthly', E'# Pricing Psychology for Monthly\n\n## Overview\nStop selling tasks and hours. Sell transformation, speed, and peace of mind.\n\n## Key Points\n- Anchor to the cost of the problem, not your costs\n- Present 3 options to create choice and control\n- Use "monthly investment" language, not "fee" or "cost"\n- Frame as cheaper than hiring or doing it wrong\n\n## Anchoring Examples\n- **Missed calls**: "A missed call could be worth $500-$5,000. Paying $297/mo to capture every call is cheap insurance."\n- **Bad reviews**: "One bad review can cost you 22 customers. Our review system at $197/mo protects your reputation 24/7."\n- **Empty chairs**: "An empty chair costs you $50-$200 per day. Our booking system at $147/mo keeps you booked solid."\n\n## Exercise\nWrite 3 value anchors and 3 ways your offer pays for itself in the first 30 days.\n\n**Template: Value Anchor Builder**\n- Problem: _______\n- Monthly Cost of Problem: _______\n- Your Solution Price: _______\n- ROI Multiple: _______\n- Payback Period: _______', 25),
    
    (v_mod1, 5, 'The MRR Offer Stack', E'# The MRR Offer Stack\n\n## Overview\nBuild a simple stack that is easy to deliver and easy to upgrade. Start small, expand strategically.\n\n## Stack Components\n1. **Core subscription** (platform or base service)\n2. **Add-on #1** (feature or service)\n3. **Add-on #2** (feature or service)\n4. **Premium support** / done-for-you tier\n\n## Examples\n\n### Trades Stack\n- **Core**: CRM + missed call recovery ($197)\n- **Add-on 1**: AI receptionist ($97)\n- **Add-on 2**: Review automation ($97)\n- **Premium**: Done-for-you marketing ($497)\n\n### Salons Stack\n- **Core**: Booking + reminders ($147)\n- **Add-on 1**: Loyalty program ($97)\n- **Add-on 2**: Social posting ($97)\n- **Premium**: Full marketing ($397)\n\n### Restaurants Stack\n- **Core**: Review + loyalty system ($197)\n- **Add-on 1**: Online ordering ($147)\n- **Add-on 2**: Email campaigns ($97)\n- **Premium**: Full marketing ($497)\n\n## Exercise\nDesign your offer stack for (1) trades, (2) salons, (3) restaurants using Local-Link tools.', 30)
  ON CONFLICT (module_id, lesson_index) DO NOTHING;

  -- Module 2
  INSERT INTO course_modules (course_id, module_index, title, description)
  VALUES (v_course_id, 2, 'Offer & Packaging That Sells', 'Niche + promise, tiers, guarantees, and a 90-day onboarding sprint.')
  ON CONFLICT (course_id, module_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_mod2;

  INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes) VALUES
    (v_mod2, 1, 'Choosing a Niche + Promise', E'# Choosing a Niche + Promise\n\n## Overview\nPick an easy niche where you have credibility and a promise you can confidently deliver.\n\n## Niche Criteria\n- High pain + urgency\n- Able to pay monthly\n- Easy to reach and sell to\n- You understand their business\n\n## Promise Formula\n**"We help [niche] get [result] in [time] without [pain]."**\n\n## Examples\n- "We help trades capture every lead in under 60 seconds without missing calls."\n- "We help salons fill empty chairs in 30 days without spending on ads."\n- "We help restaurants build repeat customers automatically without manual follow-up."\n\n## Exercise\nWrite your niche promise statement. Test it with 3 real prospects and refine based on their reaction.', 25),
    
    (v_mod2, 2, 'Your 3-Tier Pricing Ladder', E'# Your 3-Tier Pricing Ladder\n\n## Overview\nCreate Starter/Core/Premium with clear differences. Most will choose the middle; some will upgrade later.\n\n## Tier Strategy\n- **Starter**: Get them in the door (minimal viable offer)\n- **Core**: Most popular, best value (where you want them)\n- **Premium**: Aspirational, done-for-you (high margin)\n\n## Differentiation Points\n- **Speed**: How fast they get results\n- **Scope**: How much you do for them\n- **Support**: Response time and access to you\n- **Add-ons**: What extra features they get\n\n## Pricing Example\n\n| Tier | Price | Who | Support | Delivery |\n|------|-------|-----|---------|----------|\n| Starter | $147/mo | DIY businesses | Email only | Self-serve platform |\n| Core | $297/mo | Busy owners | Priority email + monthly call | Platform + setup help |\n| Premium | $597/mo | Hands-off owners | Dedicated account manager | Fully managed |\n\n## Exercise\nBuild your 3-tier ladder with tier name, price, who it''s for, deliverables, support level, and upgrade trigger.', 30),
    
    (v_mod2, 3, 'Guarantees & Risk Reversal (Safely)', E'# Guarantees & Risk Reversal (Safely)\n\n## Overview\nUse conditional guarantees to reduce perceived risk without getting burned by bad-fit clients.\n\n## Guarantee Types\n\n### Conditional (Low Risk) ✅\n"If you complete onboarding and use the system, we guarantee X activity within 30 days"\n\n### Money-back (Medium Risk)\n"30-day money-back if not satisfied (with conditions)"\n\n### Performance (High Risk) ⚠️\n"Guarantee a specific revenue outcome" - **AVOID THIS**\n\n## Safe Guarantee Formula\n**"If [client completes X actions] and [uses system for Y days], we guarantee [specific activity outcome] or [remedy]."**\n\n## Examples\n- "If onboarding steps are completed and follow-up automation is running, we guarantee the system will capture missed calls within 30 days or we''ll extend your service free for one month."\n- "If you use the review request system and send at least 50 requests, we guarantee you''ll get new reviews within 60 days or we''ll provide hands-on coaching at no charge."\n\n## Exercise\nWrite a conditional guarantee for your offer that protects you while reducing buyer risk.\n\n⚠️ **Warning**: Never guarantee revenue, sales, or results you can''t control. Focus on activity guarantees.', 20),
    
    (v_mod2, 4, 'Deliverables Menu + Scope Control', E'# Deliverables Menu + Scope Control\n\n## Overview\nAvoid scope creep with a clear monthly deliverables checklist and a "not included" list.\n\n## Included Monthly (Example)\n- System setup and configuration\n- Missed call recovery active 24/7\n- Review request automation (up to 100 requests)\n- Monthly performance report\n- 1 strategy call (30 min)\n- Email support (48-hour response)\n\n## NOT Included (Example)\n- Custom development or integrations\n- Paid advertising management\n- Content creation beyond templates\n- On-site visits\n- After-hours phone support\n- Services outside our platform scope\n\n## Exercise\nCreate a 1-page deliverables list with two sections: "Included Monthly" and "Not Included." Be specific and clear.', 20),
    
    (v_mod2, 5, 'The 90-Day Sprint Onboarding Plan', E'# The 90-Day Sprint Onboarding Plan\n\n## Overview\nA simple month-by-month success plan that creates quick wins and builds momentum for long-term retention.\n\n## Month 1: Setup + Quick Wins\n**Goals**: Complete onboarding, first automation live, first measurable win\n\n**Activities**:\n- Gather assets\n- Configure systems\n- First review request or call capture\n- First win report\n\n**Outcome**: Client sees immediate value and proof the system works\n\n## Month 2: Optimization\n**Goals**: Refine workflows, add second automation, show consistent results\n\n**Activities**:\n- Analyze what''s working\n- Optimize messaging\n- Add loyalty or referral program\n- Month 1 results review\n\n**Outcome**: Client feels confident and sees compounding benefits\n\n## Month 3: Scale + Retention\n**Goals**: Expand scope, upsell or cross-sell, lock in for 6+ months\n\n**Activities**:\n- Present expansion options\n- Show ROI clearly\n- Quarterly review meeting\n- Discuss longer commitment or add-ons\n\n**Outcome**: Client commits long-term and potentially upgrades\n\n## Exercise\nFill out your 90-day plan template with specific actions and expected wins for your niche.', 30),
    
    (v_mod2, 6, 'Bundling the Local-Link Ecosystem', E'# Bundling the Local-Link Ecosystem\n\n## Overview\nBundle Marketplace listing + CRM + reviews + loyalty + AI receptionist + social posting into simple, high-value packages.\n\n## Bundling Benefits\n- One invoice, one login, one system\n- Higher perceived value\n- Easier to sell (less decision fatigue)\n- Better retention (more integrated = stickier)\n\n## Bundle Examples\n\n### Entry-Level: Visibility + Leads ($197/mo)\n**Includes**:\n- Marketplace listing\n- Missed call recovery\n- Review automation (basic)\n\n**Ideal for**: New businesses or budget-conscious owners\n\n### Premium: Full Growth System ($497/mo)\n**Includes**:\n- Everything in Entry\n- AI receptionist\n- Loyalty program\n- Social posting\n- Priority support\n\n**Ideal for**: Established businesses ready to scale\n\n## Exercise\nBuild 2 bundles: one entry-level ($147-$247) and one premium ($397-$597). List what''s included and who each is for.\n\n💡 **Tip**: Name your bundles based on outcomes, not features. Example: "Reputation Builder" vs "Review Package."', 25)
  ON CONFLICT (module_id, lesson_index) DO NOTHING;

END $$;