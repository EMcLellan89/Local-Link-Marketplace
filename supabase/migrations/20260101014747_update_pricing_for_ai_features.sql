/*
  # Update Pricing to Reflect AI Features

  ## Summary
  This migration updates pricing across merchant and partner tiers to reflect the new AI features 
  that are now built into the platform. TradeHive CRM, AdSuite CRM, and all other services remain 
  unchanged.

  ## Changes Made

  ### Merchant Subscription Tiers (Core Platform Access)
  All merchant tiers increased by $50/month to reflect:
  - AI deal generation and copywriting
  - AI pricing optimization
  - AI promotion suggestions
  - Predictive analytics and insights

  - **Founders**: $199/mo → $249/mo
  - **Standard**: $249/mo → $299/mo  
  - **Premium**: $299/mo → $349/mo

  ### Partner Subscription Tiers
  Partner tiers increased to reflect enhanced AI integration:
  - Inline AI tools (no more JSON prompts)
  - Advanced AI automation
  - White-label AI features

  - **Partner Tier**: $49/mo ($470.40/yr) → $69/mo ($662.40/yr)
  - **Master Partner**: $149/mo ($1430.40/yr) → $179/mo ($1721.60/yr)
  - **White-Label**: $499/mo ($4790.40/yr) → $549/mo ($5270.40/yr)

  ## What Stays the Same
  - Local-Link CRM pricing (Starter, Professional, Enterprise)
  - Territory pricing (City, Region, State, Country)
  - Professional Services (all one-time/hourly services)
  - Add-ons (webhooks, analytics, compliance, etc.)
  - TradeHive CRM and AdSuite CRM (external products)
*/

-- ============================================================
-- UPDATE MERCHANT SUBSCRIPTION TIERS
-- ============================================================

UPDATE subscription_tiers 
SET monthly_price = 249
WHERE name = 'Founders' AND monthly_price = 199;

UPDATE subscription_tiers 
SET monthly_price = 299
WHERE name = 'Standard' AND monthly_price = 249;

UPDATE subscription_tiers 
SET monthly_price = 349
WHERE name = 'Premium' AND monthly_price = 299;

-- ============================================================
-- UPDATE PARTNER SUBSCRIPTION TIERS
-- ============================================================

UPDATE partner_subscription_tiers 
SET 
  monthly_price_cents = 6900,
  annual_price_cents = 66240
WHERE slug = 'partner' AND monthly_price_cents = 4900;

UPDATE partner_subscription_tiers 
SET 
  monthly_price_cents = 17900,
  annual_price_cents = 172160
WHERE slug = 'master' AND monthly_price_cents = 14900;

UPDATE partner_subscription_tiers 
SET 
  monthly_price_cents = 54900,
  annual_price_cents = 527040
WHERE slug = 'white_label' AND monthly_price_cents = 49900;
