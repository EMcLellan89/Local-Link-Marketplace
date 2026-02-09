/*
  # Add Partner Swipe Assets System

  1. Partner Assets Table
    - Stores swipe copy (email, SMS, DM)
    - Auto-delivered on partner approval
    - Copy-paste ready for affiliates

  2. Asset Templates
    - Email swipes (5 versions)
    - SMS swipes (3 versions)
    - DM scripts
    - UGC video scripts
    - Subject lines

  3. Automatic Delivery
    - Trigger on partner approval
    - Inserts all swipe assets

  4. Security
    - RLS for partner access only
*/

-- Partner assets table
CREATE TABLE IF NOT EXISTS public.partner_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug text NOT NULL DEFAULT 'selling-recurring-revenue',
  asset_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_assets_partner 
  ON public.partner_assets(partner_id, asset_type);

CREATE INDEX IF NOT EXISTS idx_partner_assets_product 
  ON public.partner_assets(product_slug);

ALTER TABLE public.partner_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own assets"
  ON public.partner_assets FOR SELECT
  TO authenticated
  USING (auth.uid() = partner_id);

-- Master swipe templates (global)
CREATE TABLE IF NOT EXISTS public.swipe_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text NOT NULL,
  asset_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  category text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_swipe_templates_product 
  ON public.swipe_templates(product_slug, asset_type);

-- Seed swipe templates for Selling Recurring Revenue
INSERT INTO public.swipe_templates (product_slug, asset_type, title, content, category, metadata) VALUES

-- EMAIL SWIPES
('selling-recurring-revenue', 'email_swipe', 'Email #1 - Announcement', 
'Subject: Stop chasing one-off sales — build monthly income instead

Hey {{FirstName}},

If you''re tired of starting at $0 every month, you''re not alone.

Most business owners struggle because they sell one-time projects, not monthly recurring offers — which means:
• constant prospecting
• unpredictable income
• burnout

I recently came across a training that breaks this cycle down step-by-step.

It teaches:
• how to package recurring offers
• how to price without hourly rates
• how to close monthly clients without being pushy
• how to retain and expand accounts

The best part?
It doesn''t just teach theory — it gives you the exact templates to use.

You get:
✓ a pricing calculator
✓ an offer stack builder
✓ discovery call questions
✓ objection response scripts
✓ a monthly proposal template

So instead of guessing, you can actually execute.

👉 Check it out here:
{{AffiliateLink}}

If you want predictable monthly income without ads or social media, this is a great place to start.

— {{YourName}}',
'email', '{"commission": "30%", "price": "$349"}'),

('selling-recurring-revenue', 'email_swipe', 'Email #2 - Toolkit Angle',
'Subject: The templates make this ridiculously easy

Hey {{FirstName}},

Quick heads up — the reason most people fail at recurring revenue isn''t motivation.

It''s execution.

They don''t know:
• what to charge
• how to structure the offer
• what to say on the call
• how to handle objections

That''s why I like this training.

Yes, it teaches how recurring revenue works —
but it also gives you the Pro Toolkit, which includes:

✔ a pricing calculator
✔ offer tier builder
✔ discovery call questions
✔ objection responses
✔ proposal templates
✔ retention & upsell playbooks

You''re not guessing. You''re following a system.

If you want the shortcut instead of trial-and-error, grab the course + toolkit bundle here:

👉 {{AffiliateLink}}

— {{YourName}}',
'email', '{"commission": "30%", "price": "$349"}'),

('selling-recurring-revenue', 'email_swipe', 'Email #3 - If I Had to Start Today',
'Subject: If I had to start from scratch today, I''d do this

Hey {{FirstName}},

If I were starting over and wanted recurring monthly income, here''s exactly what I''d do:

1️⃣ Pick a recurring problem businesses already have
2️⃣ Package it into a simple monthly offer
3️⃣ Price it around outcomes, not hours
4️⃣ Use a clean proposal
5️⃣ Focus on retention, not churn

That''s literally what this course walks you through.

And the Pro Toolkit makes it even easier by giving you:
• pricing sheets
• scripts
• templates
• checklists

You don''t need ads.
You don''t need social media.
You just need a clear offer and a repeatable process.

👉 Start here:
{{AffiliateLink}}

— {{YourName}}',
'email', '{"commission": "30%", "price": "$349"}'),

('selling-recurring-revenue', 'email_swipe', 'Email #4 - Not Salesy',
'Subject: "I''m not salesy" — read this

Hey {{FirstName}},

A lot of people avoid selling recurring services because they don''t want to feel pushy.

That''s fair.

What I like about this training is that it teaches ethical, outcome-based selling — not pressure tactics.

It shows you:
• how to ask better questions
• how to let the client convince themselves
• how to respond to objections calmly
• how to close with a start date, not pressure

And the objection scripts in the Pro Toolkit alone are worth it.

If selling makes you uncomfortable, this actually makes it easier.

👉 Take a look:
{{AffiliateLink}}

— {{YourName}}',
'email', '{"commission": "30%", "price": "$349"}'),

('selling-recurring-revenue', 'email_swipe', 'Email #5 - Final Nudge',
'Subject: One more nudge — build monthly income that sticks

Hey {{FirstName}},

If you''re still relying on one-off sales, nothing changes until the system changes.

Recurring revenue gives you:
• predictability
• stability
• breathing room

This course shows you how to:
✔ sell recurring offers
✔ retain clients
✔ expand accounts
✔ build monthly income without ads

And the course + Pro Toolkit bundle gives you everything you need to implement right away.

👉 Get access here:
{{AffiliateLink}}

If monthly income is a goal this year, this is worth your time.

— {{YourName}}',
'email', '{"commission": "30%", "price": "$349"}'),

-- SMS SWIPES
('selling-recurring-revenue', 'sms_swipe', 'SMS #1 - Awareness',
'Tired of chasing one-off sales?
This training shows how to sell recurring monthly offers (no ads, no social).
Includes plug-and-play templates.
👉 {{AffiliateLink}}',
'sms', '{"max_length": "160 chars"}'),

('selling-recurring-revenue', 'sms_swipe', 'SMS #2 - Toolkit Angle',
'The Pro Toolkit gives you pricing calculators, scripts, and proposals so you don''t guess.
Course + Toolkit bundle here 👉 {{AffiliateLink}}',
'sms', '{"max_length": "160 chars"}'),

('selling-recurring-revenue', 'sms_swipe', 'SMS #3 - Objection-Free',
'Not "salesy"? This course teaches ethical, outcome-based recurring sales.
No pressure tactics.
👉 {{AffiliateLink}}',
'sms', '{"max_length": "160 chars"}'),

-- DM SWIPES
('selling-recurring-revenue', 'dm_swipe', 'DM Version - Facebook/IG/LinkedIn',
'Quick question — are you selling one-off services or monthly offers right now?

If you want predictable income, this course breaks down how to sell recurring revenue and gives you all the templates to execute.

Here''s the bundle I recommend 👉 {{AffiliateLink}}',
'dm', '{"platforms": ["facebook", "instagram", "linkedin"]}'),

-- SUBJECT LINES
('selling-recurring-revenue', 'subject_line', 'Set A - Direct #1', 'Stop starting at $0 every month', 'subject_line', '{"set": "A", "style": "direct"}'),
('selling-recurring-revenue', 'subject_line', 'Set A - Direct #2', 'Build monthly income without ads', 'subject_line', '{"set": "A", "style": "direct"}'),
('selling-recurring-revenue', 'subject_line', 'Set A - Direct #3', 'The recurring revenue playbook', 'subject_line', '{"set": "A", "style": "direct"}'),
('selling-recurring-revenue', 'subject_line', 'Set B - Curiosity #1', 'This fixed my inconsistent income', 'subject_line', '{"set": "B", "style": "curiosity"}'),
('selling-recurring-revenue', 'subject_line', 'Set B - Curiosity #2', 'Why one-time sales keep you stuck', 'subject_line', '{"set": "B", "style": "curiosity"}'),
('selling-recurring-revenue', 'subject_line', 'Set B - Curiosity #3', 'The templates most people don''t have', 'subject_line', '{"set": "B", "style": "curiosity"}'),
('selling-recurring-revenue', 'subject_line', 'Set C - Toolkit Focus #1', 'The templates make this easy', 'subject_line', '{"set": "C", "style": "toolkit"}'),
('selling-recurring-revenue', 'subject_line', 'Set C - Toolkit Focus #2', 'Don''t guess what to charge', 'subject_line', '{"set": "C", "style": "toolkit"}'),
('selling-recurring-revenue', 'subject_line', 'Set C - Toolkit Focus #3', 'Plug-and-play recurring offers', 'subject_line', '{"set": "C", "style": "toolkit"}'),

-- UGC VIDEO SCRIPTS
('selling-recurring-revenue', 'ugc_script', 'UGC #1 - Templates Saved Me',
'Script:
"I bought the course, but the real game-changer was the Pro Toolkit.
It literally hands you the pricing calculator, the proposal template, and the objection scripts.
So instead of guessing what to say or what to charge… you just plug it in.
If you want recurring income fast, get the bundle — course + toolkit."

Caption:
Stop chasing one-off sales.
This shows how to sell recurring monthly offers without ads — and gives you the templates to execute.
🔗 Link in bio',
'ugc', '{"duration": "15-30s", "format": "talking_head"}'),

('selling-recurring-revenue', 'ugc_script', 'UGC #2 - If You Hate Selling',
'Script:
"If selling makes you uncomfortable, this toolkit fixes that.
It gives you the discovery questions, the objection responses, and a clean proposal you can use immediately.
So you don''t sound salesy — you sound professional.
Bundle is $349 and it''s the easiest ''yes'' I''ve made."

Caption:
The difference isn''t motivation — it''s templates.
Pricing. Proposals. Objection scripts.
Everything included.
👇 Get the bundle',
'ugc', '{"duration": "15-30s", "format": "talking_head"}'),

('selling-recurring-revenue', 'ugc_script', 'UGC #3 - How I Would Use It Today',
'Script:
"If I had to start today, I''d do this:
Use the pricing calculator, pick a tier ladder, run the discovery script, send the proposal.
That''s literally what the Pro Toolkit gives you.
It''s plug-and-play. Get the bundle."

Caption:
Hate social media? Same.
This system works through real conversations and simple offers.
No ads. No posting.
👉 Learn how',
'ugc', '{"duration": "15-30s", "format": "talking_head"}'),

('selling-recurring-revenue', 'ugc_script', 'UGC #4 - No Social Media',
'Script:
"I hate social media — so I needed something practical.
This toolkit helps you sell recurring offers through real conversations and simple systems.
No posting, no ads, no cringe.
Course + toolkit bundle is the move."

Caption:
You don''t need to be pushy to sell recurring revenue.
This teaches ethical, outcome-based sales — and how to retain clients.
🔗 Access here',
'ugc', '{"duration": "15-30s", "format": "talking_head"}'),

('selling-recurring-revenue', 'ugc_script', 'UGC #5 - Objection Killer',
'Script:
"The objection scripts alone are worth it.
''Too expensive.'' ''Need to think.'' ''Send info.''
It tells you exactly how to respond without being pushy.
If you want monthly income, get the bundle."

Caption:
Stop starting at $0 every month.
Build predictable recurring income with proven templates.
👇 Link below',
'ugc', '{"duration": "15-30s", "format": "talking_head"}')

ON CONFLICT DO NOTHING;

-- Function to deliver swipe assets to partner
CREATE OR REPLACE FUNCTION public.deliver_swipe_assets_to_partner(p_partner_id uuid, p_product_slug text DEFAULT 'selling-recurring-revenue')
RETURNS void AS $$
BEGIN
  -- Insert all active swipe templates as partner assets
  INSERT INTO public.partner_assets (partner_id, product_slug, asset_type, title, content, metadata)
  SELECT 
    p_partner_id,
    st.product_slug,
    st.asset_type,
    st.title,
    st.content,
    st.metadata
  FROM public.swipe_templates st
  WHERE st.product_slug = p_product_slug
  AND st.is_active = true
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-deliver swipe assets when partner CRM is activated
CREATE OR REPLACE FUNCTION public.auto_deliver_swipes_on_partner_activation()
RETURNS trigger AS $$
BEGIN
  -- Check if this is a Partner CRM subscription activation
  IF NEW.subscription_tier IN ('partner_crm_basic', 'partner_crm_pro') 
     AND NEW.status = 'active' 
     AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    
    -- Deliver swipe assets
    PERFORM deliver_swipe_assets_to_partner(NEW.user_id, 'selling-recurring-revenue');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to user_subscriptions (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_subscriptions') THEN
    DROP TRIGGER IF EXISTS trigger_auto_deliver_swipes ON user_subscriptions;
    CREATE TRIGGER trigger_auto_deliver_swipes
      AFTER INSERT OR UPDATE ON user_subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION auto_deliver_swipes_on_partner_activation();
  END IF;
END $$;

-- Trigger: Also deliver on partner application approval
CREATE OR REPLACE FUNCTION public.auto_deliver_swipes_on_partner_approval()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    PERFORM deliver_swipe_assets_to_partner(NEW.user_id, 'selling-recurring-revenue');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_partner_approval_swipes ON partner_applications;
CREATE TRIGGER trigger_partner_approval_swipes
  AFTER INSERT OR UPDATE ON partner_applications
  FOR EACH ROW
  EXECUTE FUNCTION auto_deliver_swipes_on_partner_approval();