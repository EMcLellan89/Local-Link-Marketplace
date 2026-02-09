/*
  # Seed Profit Network Playbooks - Batch 1: Core Platform (1-5)

  Seeds comprehensive playbooks for:
  1. Local-Link Marketplace
  2. Local-Link AI OS
  3. Local-Link Revenue System
  4. Local-Link StoryLab
  5. Local-Link Foundry
*/

-- 1. Local-Link Marketplace
INSERT INTO profit_network_playbooks (business_id, title, description, target_audience, selling_strategy, fb_advertising_info, commission_info, year_one_projection, key_benefits, common_objections, sales_scripts, content)
SELECT 
  id,
  'Local-Link Marketplace - Complete Local Business Growth Platform',
  'Local-Link Marketplace is the ultimate all-in-one platform for local businesses to manage customers, run marketing campaigns, automate follow-ups, and drive repeat revenue. It combines CRM, marketing automation, deal creation, customer loyalty programs, and revenue optimization tools in one easy-to-use system. Perfect for businesses that want to stop losing customers and start building a predictable revenue engine.',
  'LOCAL BUSINESSES: Restaurants, salons, spas, fitness studios, retail stores, professional services (lawyers, accountants, consultants), home services (HVAC, plumbing, landscaping), healthcare providers, automotive services, real estate agents, insurance agents, and any business with repeat customers. Ideal for businesses doing $250K-$5M annually who are tired of chasing new customers and want to maximize their existing database.',
  'SELLING STRATEGY:
1. Problem Identification: "Are you tracking every customer interaction? Do you know when customers are about to churn?"
2. Paint the Picture: "Local-Link Marketplace turns your customer database into a revenue-generating machine. Every customer gets automated follow-ups, birthday offers, win-back campaigns, and loyalty rewards."
3. ROI Focus: "If you have 500 customers and we bring back just 20 lost customers spending $100 each, that''s $2,000 in found money. Our system typically pays for itself in the first month."
4. Demo the Dashboard: Show them real dashboards with customer lifetime value, churn risk alerts, and automated campaign results.
5. Close: "Let''s start with a 30-day pilot. We''ll import your customers, set up 3 automated campaigns, and you''ll see results within 2 weeks."',
  'FACEBOOK ADVERTISING STRATEGY:
We run targeted Facebook ads to local business owners in your territory featuring:
- Carousel ads showing before/after customer retention stats
- Video testimonials from restaurant/salon owners showing revenue increases
- Lead magnet: "Free Customer Retention Audit - See How Much Revenue You''re Losing"
- Retargeting sequences with case studies and ROI calculators

Our ads target business owners aged 30-65, interested in: business management software, QuickBooks, Square, Toast POS, Shopify, and small business groups. We use radius targeting around commercial districts and business parks.

Your unique tracking link is embedded in every ad, landing page, and email sequence. When someone books a demo or signs up for a trial, you get full attribution credit.',
  'COMMISSION STRUCTURE:
- Flat 25% commission on ALL sales from your tracking link
- Recurring revenue model: Average customer pays $297/month
- Your commission: $74.25 per customer per month
- Customer lifetime: Typically 24+ months
- Lifetime value per sale: $1,782+ in commissions

IMPORTANT: You earn commissions for the entire customer lifecycle. If they stay for 2 years, you earn $1,782. If they stay for 5 years, you earn $4,455.',
  '{
    "conservative": {
      "monthly_sales": 3,
      "avg_monthly_subscription": 297,
      "annual_recurring_revenue": 10692,
      "year_one_commission": 2673,
      "year_two_total": 5346,
      "notes": "3 new customers per month, 50% retention"
    },
    "moderate": {
      "monthly_sales": 8,
      "avg_monthly_subscription": 297,
      "annual_recurring_revenue": 28512,
      "year_one_commission": 7128,
      "year_two_total": 14256,
      "notes": "8 new customers per month, 70% retention"
    },
    "aggressive": {
      "monthly_sales": 15,
      "avg_monthly_subscription": 297,
      "annual_recurring_revenue": 53460,
      "year_one_commission": 13365,
      "year_two_total": 26730,
      "notes": "15 new customers per month, 80% retention"
    }
  }'::jsonb,
  ARRAY[
    'All-in-one platform eliminates need for multiple tools',
    'Automated customer retention campaigns recover lost revenue',
    'Built-in loyalty program increases repeat visits by 40%',
    'Smart deal creation system with QR codes for easy redemption',
    'Real-time analytics show exactly which customers are at risk',
    'Mobile app for on-the-go customer management',
    'Integration with existing POS and payment systems',
    'White-label option for larger clients'
  ],
  '[
    {
      "objection": "We already use [Square/Toast/Mailchimp]",
      "response": "Those are great tools, but they don''t talk to each other. Local-Link connects everything and adds the intelligence layer that predicts which customers are leaving and automatically wins them back. Think of us as the brain that makes your existing tools smarter."
    },
    {
      "objection": "We don''t have time to learn new software",
      "response": "We handle the entire setup. We import your customers, design your campaigns, and set up automation. You literally just approve campaigns and watch the revenue roll in. Most owners spend less than 10 minutes per week in the system."
    },
    {
      "objection": "How do I know this will work for my business?",
      "response": "Let''s do a free audit. Give me access to your customer list (just names and visit dates, no personal info), and I''ll show you exactly how many customers you''ve lost in the last 12 months and what they''re worth. Then you decide if winning them back is worth it."
    }
  ]'::jsonb,
  '[
    {
      "scenario": "Cold Outreach - Restaurant Owner",
      "script": "Hi [Name], I help restaurants fill tables during slow periods using their existing customer database. Quick question: do you track customers who used to come in regularly but haven''t been back in 60+ days? Most restaurants we work with have 100-300 of these ghost customers worth $50K-$150K in lost revenue. Would a 15-minute call to see how many you have make sense?"
    },
    {
      "scenario": "Discovery Call Opening",
      "script": "Thanks for jumping on the call. I''ve reviewed your business, and I think we can help you add $3K-$8K per month in recovered revenue. Let me ask you a few questions: 1) How many customers do you have in your database? 2) What percentage come back regularly? 3) Do you currently have any automated win-back campaigns running? Based on your answers, I''ll show you exactly what we can do."
    },
    {
      "scenario": "Closing",
      "script": "Here''s what I propose: We start with a 30-day pilot for $297. We''ll import your database, set up 3 automated campaigns (birthday offers, win-back sequence for lost customers, and a VIP loyalty program), and track results. If we don''t recover at least $1,500 in new revenue in 30 days, we''ll refund every penny. Fair?"
    }
  ]'::jsonb,
  '# Local-Link Marketplace Partner Playbook

## Executive Summary
Local-Link Marketplace is a comprehensive customer retention and revenue optimization platform for local businesses. Your commission potential: $2,673 - $13,365 in year one, growing exponentially as customers renew.

## What It Is
An all-in-one platform that helps local businesses:
- Track and manage every customer interaction
- Automate win-back campaigns for lost customers
- Create and manage deals, promotions, and loyalty programs
- Send targeted campaigns based on customer behavior
- Integrate with existing POS and payment systems
- Predict which customers are at risk of churning

## Why It Sells
1. **Solves Real Pain**: Business owners know they''re losing customers but don''t have time to manually reach out
2. **Quick ROI**: Recovering just 10-20 lost customers typically pays for the annual subscription
3. **Passive Revenue**: Once set up, campaigns run automatically
4. **Proven Results**: Our clients see 30-40% increases in repeat customer rates

## Your Role
You don''t need to be a tech expert. Your job is to:
1. Identify local businesses with 200+ customers
2. Schedule demos (we provide the demo script and materials)
3. Share success stories and case studies
4. Follow up with prospects (our AI bot handles most of this)

## Commission Math
- Monthly subscription: $297
- Your 25% commission: $74.25/month per customer
- Average customer stays 24 months minimum
- Per-customer lifetime commission: $1,782

If you sign just 5 customers, that''s $371.25/month recurring = $4,455/year minimum.

## The Sales Process
1. **Prospect Identification** (AI-assisted)
2. **Initial Outreach** (Email/FB message templates provided)
3. **Demo Call** (We can do the demo or you can use our recorded version)
4. **Trial Setup** (Automated)
5. **Onboarding** (Our team handles this)
6. **Commission Payment** (Weekly)

## Marketing Support
- We run FB ads in your territory
- Landing pages with your tracking link
- Email nurture sequences
- Case studies and testimonials
- Sales collateral and presentations
- ROI calculators

## Success Tips
1. Target businesses with high repeat customer potential (restaurants, salons, fitness)
2. Lead with the "Lost Customer Audit" - it''s free and shows immediate value
3. Focus on the money they''re LOSING, not the money they need to spend
4. Use local business Facebook groups to share success stories
5. Partner with local business chambers and networking groups

## Resources
- Demo video library
- Case study database
- Email templates
- Objection handling guide
- ROI calculator
- Proposal templates'
FROM profit_network_businesses
WHERE name = 'Local-Link Marketplace™'
ON CONFLICT (business_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  target_audience = EXCLUDED.target_audience,
  selling_strategy = EXCLUDED.selling_strategy,
  fb_advertising_info = EXCLUDED.fb_advertising_info,
  commission_info = EXCLUDED.commission_info,
  year_one_projection = EXCLUDED.year_one_projection,
  key_benefits = EXCLUDED.key_benefits,
  common_objections = EXCLUDED.common_objections,
  sales_scripts = EXCLUDED.sales_scripts,
  content = EXCLUDED.content,
  updated_at = now();

-- 2. Local-Link AI OS
INSERT INTO profit_network_playbooks (business_id, title, description, target_audience, selling_strategy, fb_advertising_info, commission_info, year_one_projection, key_benefits, content)
SELECT 
  id,
  'Local-Link AI OS - Revolutionary AI Operating System for Business',
  'Local-Link AI OS is the world''s first AI operating system designed specifically for local businesses. It''s not just another chatbot - it''s a complete AI workforce that handles customer service, appointment scheduling, lead qualification, follow-ups, content creation, and business intelligence. Think of it as hiring 10 employees for the price of one, but they never sleep, never take breaks, and never make mistakes.',
  'PROGRESSIVE BUSINESSES: Forward-thinking business owners who understand AI is the future. Perfect for service businesses drowning in customer inquiries, appointment scheduling, and follow-ups. Ideal for: healthcare providers, legal practices, real estate agencies, home service contractors, consulting firms, and any business spending $5K+ monthly on admin staff. Best for businesses doing $500K+ annually who want to scale without hiring.',
  'SELLING STRATEGY:
1. Future-Forward Opening: "What if I told you that in 2026, your biggest competitor will be running on AI while you''re still manually answering phones?"
2. Demonstrate AI: Use our live demo to show AI answering questions, booking appointments, and qualifying leads in real-time
3. Cost Comparison: "You''re paying a receptionist $3,500/month for 40 hours/week. Our AI works 24/7/365 for $497/month. That''s 96% cost savings."
4. Show Intelligence: Demonstrate how the AI learns from every interaction and gets smarter over time
5. Risk Reversal: "Start with just one use case - let our AI handle after-hours calls for 30 days. You''ll never go back."',
  'FACEBOOK ADVERTISING: We run AI-focused ads showing businesses how competitors are using AI to steal their customers. Video ads feature split-screen comparisons: business using AI vs. business without AI. Ads target business owners interested in: artificial intelligence, automation, business software, and productivity tools. Strong emphasis on "Don''t get left behind" messaging.',
  'COMMISSION: $497/month subscription = $124.25/month per customer. Average 36-month retention = $4,473 lifetime value per sale.',
  '{
    "conservative": {"monthly_sales": 2, "avg_monthly_subscription": 497, "annual_recurring_revenue": 11928, "year_one_commission": 2982},
    "moderate": {"monthly_sales": 5, "avg_monthly_subscription": 497, "annual_recurring_revenue": 29820, "year_one_commission": 7455},
    "aggressive": {"monthly_sales": 10, "avg_monthly_subscription": 497, "annual_recurring_revenue": 59640, "year_one_commission": 14910}
  }'::jsonb,
  ARRAY['24/7 AI workforce that never sleeps', '96% cost savings vs. human staff', 'Handles unlimited simultaneous conversations', 'Learns and improves from every interaction', 'Multi-channel: phone, text, email, chat', 'Integrates with existing business systems', 'Enterprise-grade security and compliance', 'ROI typically achieved in first 30 days'],
  '# Local-Link AI OS Partner Playbook

## The Big Picture
This is the flagship AI product. It''s premium-priced ($497/month) but delivers insane ROI. Your commission: $124.25/month per customer, $1,491/year, $4,473+ over 3 years per customer.

## Perfect Prospect Profile
- Currently employing admin/receptionist staff
- Missing calls/leads after hours
- Spending money on answering services
- Frustrated with staff turnover
- Tech-forward mindset
- Annual revenue $500K+

## The Irresistible Offer
"Replace your $3,500/month receptionist with a $497/month AI that works 24/7 and never calls in sick."

## Demo Strategy
1. Have them text a question to our demo number
2. Watch AI respond instantly with perfect information
3. Show them the dashboard with all conversations logged
4. Compare cost: Human ($42K/year) vs AI ($5,964/year)

## Objections & Responses
- "Customers want to talk to real people" → "Our AI sounds human and customers can''t tell the difference. Plus it transfers complex issues to humans."
- "Too expensive" → "Compared to what? A part-time employee costs more and works fewer hours."
- "What if it makes mistakes" → "It''s trained on your business and gets smarter daily. Plus every conversation is logged for quality control."

## Commission Snowball Effect
- Month 1: Sign 2 customers = $248.50/month
- Month 3: 6 total customers = $745.50/month
- Month 6: 12 total customers = $1,491/month
- Month 12: 24 total customers = $2,982/month

This is a wealth-building product.'
FROM profit_network_businesses
WHERE name = 'Local-Link AI OS™'
ON CONFLICT (business_id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, updated_at = now();

-- Continue with remaining Core Platform businesses (3-5)...
-- I''ll create the remaining ones in subsequent migrations to avoid overly long content

