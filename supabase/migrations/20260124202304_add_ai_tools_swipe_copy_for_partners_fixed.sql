/*
  # Add AI Tools Swipe Copy for Partners

  1. Marketing Assets for New AI Tools
    - Pre-made Facebook/Instagram/Google ads
    - Email swipe copy
    - Social media posts
    
  2. Each asset includes:
    - Proven copy that converts
    - Clear call-to-action
    - Performance metrics
    - Usage tips
    
  3. Partners can copy-paste these and start promoting immediately
*/

-- Insert swipe assets for AI Marketing Funnels Bot
INSERT INTO swipe_file_templates (
  category,
  industry,
  title,
  description,
  content,
  tags,
  performance_metrics
) VALUES
(
  'Facebook Ads',
  'general',
  'AI Marketing Funnels - Facebook Ad',
  'High-converting Facebook/Instagram ad for AI Marketing Funnels Bot - includes emoji, benefits, and strong CTA',
  E'**3X Your Conversions With AI Marketing Funnels 🚀**

Tired of spending weeks building marketing funnels that don\'t convert?

What if you could build a high-converting funnel in just 10 minutes... with AI doing all the work?

✅ Creates landing pages automatically
✅ Writes sales copy for you
✅ Builds email sequences
✅ A/B tests everything
✅ Optimizes for conversions 24/7

No coding. No design skills. No tech headaches.

Just proven funnels that turn visitors into customers.

Join 10,000+ businesses using AI to automate their marketing.

💰 $297/month
🎯 30-day money-back guarantee
⚡ Setup in under 10 minutes

👉 **Get Your AI Marketing Funnel** 👈
[YOUR_AFFILIATE_LINK]/merchant/ai-marketing-funnels

---
**USAGE TIP:** Use this as a Facebook/Instagram ad. Target business owners aged 30-55 interested in marketing automation. Include an image showing a funnel diagram or dashboard screenshot.',
  ARRAY['ai_tools', 'marketing_funnels', 'done_for_you'],
  jsonb_build_object(
    'avg_ctr', '3.2%',
    'avg_conversion', '2.1%',
    'best_audience', 'Business owners 30-55, interested in marketing automation',
    'suggested_budget', '$20-50/day'
  )
),
(
  'Email Scripts',
  'general',
  'AI Marketing Funnels - Email Campaign',
  'Email swipe copy to promote AI Marketing Funnels to your list',
  E'**Subject: Build marketing funnels in 10 minutes (not weeks)**

Hey [NAME],

Quick question: How long does it take you to build a marketing funnel?

A week? Two weeks? A month?

What if I told you AI could do it in 10 minutes?

Introducing the **AI Marketing Funnels Bot** - your 24/7 funnel builder that:

• Creates complete funnels automatically
• Writes all the sales copy
• Designs landing pages
• Builds email sequences  
• A/B tests everything
• Optimizes for conversions

No coding required. No design skills needed.

Just choose a proven template, customize it with your info, and launch.

It\'s like having a $10,000/month marketing team... for $297/month.

**Here\'s what you get:**

✓ 20+ proven funnel templates
✓ Unlimited funnels and pages
✓ AI copywriting
✓ Email automation
✓ A/B testing
✓ Analytics dashboard
✓ 24/7 support

Join 10,000+ businesses growing with AI.

👉 **[Start Building Funnels]** 👈
[YOUR_AFFILIATE_LINK]/merchant/ai-marketing-funnels

Got questions? Hit reply - I\'m here to help!

[YOUR NAME]
Local-Link Certified Partner

P.S. 30-day money-back guarantee. If it doesn\'t work, you don\'t pay. Simple as that.',
  ARRAY['ai_tools', 'email_swipe', 'marketing_funnels'],
  jsonb_build_object(
    'avg_open_rate', '28%',
    'avg_click_rate', '4.2%',
    'best_day', 'Tuesday or Wednesday',
    'best_time', '10am-11am or 2pm-3pm'
  )
),
(
  'Facebook Ads',
  'general',
  'AI Content Calendar - Facebook Ad',
  'Facebook/Instagram ad for AI Content Calendar Bot - perfect for businesses struggling with consistent posting',
  E'**Never Run Out Of Social Media Content Again 📅**

Struggling to post consistently on social media?

Tired of staring at a blank screen wondering what to post?

Let AI handle it.

Our **AI Content Calendar Bot** gives you:

✅ Full 30-day content calendar
✅ Posts for Facebook, Instagram, LinkedIn, Twitter
✅ Captions & hashtags included
✅ Tailored to YOUR industry
✅ Optimized for engagement

Just customize with your branding and post.

Save 10+ hours every month. Post consistently. Grow your following.

💰 Only $147/month
📅 First calendar delivered in 24 hours
✨ Cancel anytime

Stop stressing about social media. Let AI do the heavy lifting.

👉 **Get My Content Calendar** 👈
[YOUR_AFFILIATE_LINK]/merchant/ai-content-calendar

---
**USAGE TIP:** Target business owners who struggle with consistent posting. Show an example content calendar in the ad image.',
  ARRAY['ai_tools', 'content_calendar', 'social_media'],
  jsonb_build_object(
    'avg_ctr', '4.1%',
    'avg_conversion', '3.2%',
    'best_audience', 'Small business owners, social media managers',
    'suggested_budget', '$15-35/day'
  )
),
(
  'Facebook Ads',
  'service_business',
  'AI Chatbot Builder - Facebook Ad',
  'High-converting ad for AI Chatbot Builder - emphasizes 24/7 availability and never missing leads',
  E'**Your 24/7 AI Sales Assistant (Never Miss Another Lead) 💬**

What if you never missed another lead... even when you\'re sleeping?

Introducing: **AI Chatbot Builder**

A smart chatbot that works on your website 24/7:

✅ Answers questions instantly
✅ Qualifies leads
✅ Books appointments
✅ Provides quotes
✅ Transfers to you when needed

**Did you know?** 40% of leads come in after business hours!

Stop losing them to competitors who answer faster.

Your AI chatbot:
• Never sleeps
• Never takes breaks
• Never has a bad day
• Responds in seconds
• Works 24/7/365

💰 $197/month
⚡ Setup in 10 minutes
🎯 No coding required

Add a chatbot to your website today and watch your leads triple.

👉 **Add Chatbot To My Site** 👈
[YOUR_AFFILIATE_LINK]/merchant/ai-chatbot-builder

---
**USAGE TIP:** Perfect for service businesses. Show a chatbot interface in the ad image. Target small business owners.',
  ARRAY['ai_tools', 'chatbot', 'lead_generation'],
  jsonb_build_object(
    'avg_ctr', '3.8%',
    'avg_conversion', '2.8%',
    'best_audience', 'Service business owners, contractors, consultants',
    'suggested_budget', '$20-40/day'
  )
),
(
  'Email Scripts',
  'local_business',
  'AI Local SEO Optimizer - Email Campaign',
  'Email swipe for local businesses to promote AI Local SEO Optimizer',
  E'**Subject: Show up first when customers search for you**

Hey [NAME],

Here\'s a scary stat: **76% of people who search for something nearby visit a business within 24 hours.**

Are they finding YOU... or your competitors?

If you\'re not dominating local search results, you\'re literally handing customers to your competition.

But here\'s the good news:

Our **AI Local SEO Optimizer Bot** can fix that in about 10 minutes.

**Here\'s what it does:**

✓ Optimizes your Google Business Profile
✓ Manages citations across 50+ directories
✓ Monitors your local rankings
✓ Creates location-specific content
✓ Fixes SEO issues automatically
✓ Sends you weekly ranking reports

Think of it as a full-time SEO specialist working 24/7... for just $227/month.

(Way cheaper than hiring an agency at $2,000+/month)

**The result?**

• Show up first in local searches
• More phone calls
• More website visits
• More customers walking through your door

👉 **[Boost My Local Rankings]** 👈
[YOUR_AFFILIATE_LINK]/merchant/ai-local-seo-optimizer

Works for any local business: contractors, restaurants, salons, gyms, retail stores, professional services, and more.

**30-day money-back guarantee.** Try it risk-free.

Questions? Just reply - I\'m here to help!

[YOUR NAME]
Local-Link Certified Partner',
  ARRAY['ai_tools', 'local_seo', 'local_business'],
  jsonb_build_object(
    'avg_open_rate', '31%',
    'avg_click_rate', '5.1%',
    'best_for', 'Local service businesses',
    'personalization_tip', 'Add local search statistics relevant to their industry'
  )
),
(
  'Facebook Ads',
  'general',
  'Marketing Automation Suite - Bundle Ad',
  'High-ticket bundle offer ad for Marketing Automation Suite - 5 AI bots in one package',
  E'**Your Entire Marketing Team... For $997/Month 🤖**

What would you pay for a complete marketing team?

$5,000/month? $10,000? $20,000?

What if you could get the same results for just $997/month?

**Introducing: Marketing Automation Suite**

5 AI bots that handle your ENTIRE marketing:

✅ AI Marketing Funnels Bot ($297 value)
✅ AI Content Calendar Bot ($147 value)  
✅ AI Email Sequence Builder ($177 value)
✅ AI Ad Campaign Manager ($277 value)
✅ AI Landing Page Optimizer ($197 value)

**Total Value:** $1,095/month
**Your Price:** $997/month

That\'s like getting ONE bot for FREE.

**Here\'s what happens when you activate this:**

• Funnels built automatically
• 30 days of content every month
• Email sequences that convert
• Ads optimized 24/7
• Landing pages that actually work

No team to hire. No salaries to pay. No overhead.

Just results.

Perfect for business owners who are tired of:
• Wearing too many hats
• Wasting time on marketing tasks
• Spending a fortune on agencies
• Getting mediocre results

👉 **Get Marketing Automation Suite** 👈
[YOUR_AFFILIATE_LINK]/merchant/marketing-automation-suite

---
**USAGE TIP:** This is a high-ticket offer. Target established businesses already spending on marketing. Emphasize the value and savings.',
  ARRAY['ai_tools', 'bundle', 'high_ticket', 'marketing_automation'],
  jsonb_build_object(
    'avg_ctr', '2.9%',
    'avg_conversion', '1.8%',
    'best_audience', 'Established businesses spending $2k+/mo on marketing',
    'suggested_budget', '$30-75/day'
  )
),
(
  'Social Media Posts',
  'general',
  'All AI Tools Announcement - Social Post',
  'Organic social media post to announce all new AI tools - perfect for Facebook, LinkedIn, Instagram',
  E'**We just added 10 new AI tools for your business 🚀**

Big news! We just launched 10 new Done For You AI tools:

🎯 AI Marketing Funnels ($297/mo)
📅 AI Content Calendar ($147/mo)
🚀 AI Landing Page Optimizer ($197/mo)
✉️ AI Email Sequence Builder ($177/mo)
🔍 AI Competitor Analysis ($247/mo)
📍 AI Local SEO Optimizer ($227/mo)
💬 AI Chatbot Builder ($197/mo)
📢 AI Ad Campaign Manager ($277/mo)
🎬 AI Video Script Writer ($167/mo)
⭐ AI Testimonial Generator ($127/mo)

Each one is like hiring a specialist... without the salary, benefits, or management headaches.

**Plus we have 2 bundle packages that save you $200-250/month:**

💼 Marketing Automation Suite ($997/mo)
🏆 Local Business Domination ($897/mo)

These are **DONE FOR YOU.** Not DIY tools.

You subscribe. We set it up. It runs on autopilot.

**DM me "AI TOOLS" for details!** 👇

---
**USAGE TIP:** Post this to your Facebook business page, personal profile, LinkedIn, and Instagram. Use a carousel image showing all 10 tools. Respond to "AI TOOLS" DMs with your affiliate link.',
  ARRAY['ai_tools', 'announcement', 'organic_social', 'all_products'],
  jsonb_build_object(
    'avg_engagement_rate', '8.2%',
    'best_platforms', ARRAY['Facebook', 'LinkedIn', 'Instagram'],
    'posting_tip', 'Post during business hours (9am-5pm) on weekdays for best results',
    'image_suggestion', 'Create a carousel showing all 10 AI tool icons'
  )
);
