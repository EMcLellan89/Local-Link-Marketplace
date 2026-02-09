/*
  # Add AI Tools to Marketplace for Partner Sales

  1. New Marketplace Products
    - All 10 new AI bot products
    - 2 new bundle packages
    - Partners earn commission based on their tier
    
  2. Commission Structure (commission_rate_bp = basis points, 100bp = 1%)
    - Basic tier: 20% commission (2000bp)
    - Pro tier: 30% commission (3000bp)
    - Elite tier: 40% commission (4000bp)
    - Enterprise tier: 50% commission (5000bp)
    
  3. Features
    - All products are recurring monthly subscriptions
    - Partners get recurring commissions on active subscriptions
    - Includes metadata with ad copy, benefits, and target audience
*/

-- Insert new AI bot products into marketplace_affiliate_products
INSERT INTO marketplace_affiliate_products (
  sku, 
  name, 
  type, 
  price_cents, 
  currency, 
  commission_rate_bp, 
  active, 
  stripe_price_id,
  recurring,
  description,
  category,
  metadata
) VALUES
(
  'AI-MARKETING-FUNNELS-MONTHLY',
  'AI Marketing Funnels Bot',
  'service',
  29700,
  'USD',
  3000,
  true,
  'price_ai_marketing_funnels_monthly',
  true,
  'Build complete marketing funnels in minutes. Creates landing pages, email sequences, thank you pages, and upsell pages. Includes A/B testing, analytics, and conversion optimization.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Creates complete funnels in minutes',
      'Includes landing pages, email sequences, thank you pages',
      'A/B testing and analytics built-in',
      'Conversion optimization tools',
      'No coding required',
      '24/7 automated lead nurturing'
    ],
    'target_audience', 'Business owners who want to convert more leads into customers',
    'ad_copy', 'Turn More Visitors Into Customers With AI-Powered Marketing Funnels. Build professional funnels in minutes, not weeks. Includes landing pages, email sequences, and conversion optimization. No tech skills needed. Start converting more leads today!',
    'ad_headline', '3X Your Conversions With AI Marketing Funnels',
    'ad_cta', 'Get Your AI Marketing Funnel',
    'demo_available', true
  )
),
(
  'AI-CONTENT-CALENDAR-MONTHLY',
  'AI Content Calendar Bot',
  'service',
  14700,
  'USD',
  3000,
  true,
  'price_ai_content_calendar_monthly',
  true,
  'Never run out of content ideas. Generates a full 30-day content calendar with posts, captions, and hashtags for all your social platforms.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Full 30-day content calendar',
      'Posts, captions, and hashtags included',
      'Tailored to your industry',
      'Optimized for engagement',
      'Multi-platform support',
      'Saves 10+ hours per month'
    ],
    'target_audience', 'Business owners struggling with consistent social media posting',
    'ad_copy', 'Never Run Out Of Content Ideas Again! Get a full 30-day content calendar with ready-to-post content for Facebook, Instagram, LinkedIn, and more. Tailored to your industry. Optimized for engagement. Save 10+ hours every month!',
    'ad_headline', 'Your 30-Day Content Calendar, Done For You',
    'ad_cta', 'Get My Content Calendar',
    'demo_available', true
  )
),
(
  'AI-LANDING-PAGE-OPTIMIZER-MONTHLY',
  'AI Landing Page Optimizer Bot',
  'service',
  19700,
  'USD',
  3000,
  true,
  'price_ai_landing_page_optimizer_monthly',
  true,
  'Maximize conversions with AI-powered optimization. Analyzes your landing pages, suggests improvements, and automatically tests variations.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'AI-powered conversion optimization',
      'Automatic A/B testing',
      'Increase conversions 30-50%',
      'Analyzes heat maps and user behavior',
      'Suggests proven improvements',
      'Set it and forget it'
    ],
    'target_audience', 'Business owners with landing pages that aren''t converting well',
    'ad_copy', 'Increase Landing Page Conversions By 30-50% With AI. Our AI analyzes your pages, tests variations, and automatically implements winners. Turn more visitors into customers without hiring a conversion expert. Start optimizing today!',
    'ad_headline', 'Double Your Landing Page Conversions With AI',
    'ad_cta', 'Optimize My Landing Pages',
    'demo_available', true
  )
),
(
  'AI-EMAIL-SEQUENCE-BUILDER-MONTHLY',
  'AI Email Sequence Builder Bot',
  'service',
  17700,
  'USD',
  3000,
  true,
  'price_ai_email_sequence_builder_monthly',
  true,
  'Pre-built email sequences for every scenario: welcome series, abandoned cart, post-purchase, re-engagement, and more. Fully customizable and proven to convert.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Pre-built email sequences for every scenario',
      'Welcome series, abandoned cart, winback',
      'Proven templates that convert',
      'Fully customizable',
      'Automated delivery',
      'Increases customer lifetime value'
    ],
    'target_audience', 'Business owners who want to automate email marketing',
    'ad_copy', 'Done-For-You Email Sequences That Convert Like Crazy. Get proven email templates for welcome, abandoned cart, post-purchase, and more. Just customize with your branding and watch sales roll in on autopilot!',
    'ad_headline', 'Proven Email Sequences, Ready To Deploy',
    'ad_cta', 'Get My Email Sequences',
    'demo_available', true
  )
),
(
  'AI-COMPETITOR-ANALYSIS-MONTHLY',
  'AI Competitor Analysis Bot',
  'service',
  24700,
  'USD',
  3000,
  true,
  'price_ai_competitor_analysis_monthly',
  true,
  'Know exactly what your competitors are doing. Monitors their prices, promotions, ads, reviews, and SEO strategy. Get weekly competitive intelligence reports.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Monitors competitor prices and promotions',
      'Tracks their ads and keywords',
      'Analyzes their reviews',
      'Weekly intelligence reports',
      'Stay one step ahead',
      'Identify opportunities they''re missing'
    ],
    'target_audience', 'Business owners in competitive markets who need an edge',
    'ad_copy', 'Know Exactly What Your Competitors Are Doing (Before They Know You Know). Our AI monitors their prices, ads, reviews, and SEO 24/7. Get weekly reports with actionable insights. Stay one step ahead of the competition!',
    'ad_headline', 'Competitive Intelligence On Autopilot',
    'ad_cta', 'Start Monitoring Competitors',
    'demo_available', true
  )
),
(
  'AI-LOCAL-SEO-OPTIMIZER-MONTHLY',
  'AI Local SEO Optimizer Bot',
  'service',
  22700,
  'USD',
  3000,
  true,
  'price_ai_local_seo_optimizer_monthly',
  true,
  'Dominate local search results. Optimizes your Google Business Profile, manages citations, monitors rankings, and generates location-specific content.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Optimizes Google Business Profile',
      'Manages citations across 50+ directories',
      'Monitors local rankings',
      'Generates location-specific content',
      'Shows up first in local searches',
      'Brings in more local customers'
    ],
    'target_audience', 'Local business owners who want more foot traffic and phone calls',
    'ad_copy', 'Show Up First When Customers Search For You. Our AI optimizes your Google Business Profile, manages citations, and creates location-specific content. Dominate local search results and get more customers walking through your door!',
    'ad_headline', 'Dominate Local Search In Your Area',
    'ad_cta', 'Boost My Local Rankings',
    'demo_available', true
  )
),
(
  'AI-CHATBOT-BUILDER-MONTHLY',
  'AI Chatbot Builder Bot',
  'service',
  19700,
  'USD',
  3000,
  true,
  'price_ai_chatbot_builder_monthly',
  true,
  'Add a smart AI chatbot to your website in minutes. Answers FAQs, qualifies leads, books appointments, and provides 24/7 customer support.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Smart AI chatbot for your website',
      'Answers FAQs instantly',
      'Qualifies leads 24/7',
      'Books appointments automatically',
      'Provides customer support',
      'No coding required'
    ],
    'target_audience', 'Business owners who miss leads after hours or can''t answer questions fast enough',
    'ad_copy', '24/7 Customer Support Without Hiring Staff. Add a smart AI chatbot to your website in minutes. Answers questions, qualifies leads, and books appointments even when you sleep. Never miss another lead!',
    'ad_headline', 'Your 24/7 AI Sales Assistant',
    'ad_cta', 'Add AI Chatbot To My Site',
    'demo_available', true
  )
),
(
  'AI-AD-CAMPAIGN-MANAGER-MONTHLY',
  'AI Ad Campaign Manager Bot',
  'service',
  27700,
  'USD',
  3000,
  true,
  'price_ai_ad_campaign_manager_monthly',
  true,
  'Set-and-forget ad campaign management. Automatically creates, tests, and optimizes Facebook, Google, and Instagram ads. Adjusts bids, pauses underperformers, and scales winners.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Creates and optimizes ads automatically',
      'Works with Facebook, Google, Instagram',
      'Adjusts bids in real-time',
      'Pauses underperformers',
      'Scales winning ads',
      'Maximize your return on ad spend'
    ],
    'target_audience', 'Business owners spending on ads who want better results',
    'ad_copy', 'Stop Wasting Money On Ads That Don''t Work. Our AI creates, tests, and optimizes your Facebook, Google, and Instagram ads automatically. Pauses losers. Scales winners. Maximize your ROI without becoming an ad expert!',
    'ad_headline', 'AI-Managed Ad Campaigns That Actually Work',
    'ad_cta', 'Optimize My Ad Campaigns',
    'demo_available', true
  )
),
(
  'AI-VIDEO-SCRIPT-WRITER-MONTHLY',
  'AI Video Script Writer Bot',
  'service',
  16700,
  'USD',
  3000,
  true,
  'price_ai_video_script_writer_monthly',
  true,
  'Professional video scripts in seconds. Creates engaging scripts for explainer videos, testimonials, ads, social media, and more. Includes hooks, body, CTA, and b-roll suggestions.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Professional video scripts in seconds',
      'Explainer, testimonial, ad scripts',
      'Includes hooks and CTAs',
      'B-roll suggestions included',
      'Optimized for engagement',
      'Save hours on script writing'
    ],
    'target_audience', 'Business owners who want to create video content but struggle with scripting',
    'ad_copy', 'Create Professional Video Scripts In Seconds. Get engaging scripts for explainer videos, ads, testimonials, and social media. Includes hooks, CTAs, and even b-roll suggestions. Start creating video content that converts!',
    'ad_headline', 'Video Scripts That Hook & Convert',
    'ad_cta', 'Get My Video Scripts',
    'demo_available', true
  )
),
(
  'AI-TESTIMONIAL-GENERATOR-MONTHLY',
  'AI Testimonial Generator Bot',
  'service',
  12700,
  'USD',
  3000,
  true,
  'price_ai_testimonial_generator_monthly',
  true,
  'Turn customer feedback into powerful testimonials. Analyzes reviews, messages, and surveys to create compelling testimonials with permission. Automatically formats for website, social, and ads.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Turns feedback into testimonials',
      'Analyzes reviews and messages',
      'Creates compelling copy',
      'Formats for website, social, ads',
      'Gets customer permission',
      'Builds social proof automatically'
    ],
    'target_audience', 'Business owners with happy customers but no testimonials',
    'ad_copy', 'Turn Happy Customers Into Powerful Testimonials. Our AI analyzes your reviews and feedback to create compelling testimonials you can use everywhere. Build social proof on autopilot!',
    'ad_headline', 'Social Proof That Sells For You',
    'ad_cta', 'Generate My Testimonials',
    'demo_available', true
  )
),
-- Bundle Packages
(
  'MARKETING-AUTOMATION-SUITE-MONTHLY',
  'Marketing Automation Suite',
  'bundle',
  99700,
  'USD',
  3500,
  true,
  'price_marketing_automation_suite_monthly',
  true,
  'Complete marketing automation in one package. Includes AI Marketing Funnels Bot, AI Content Calendar Bot, AI Email Sequence Builder Bot, AI Ad Campaign Manager Bot, and AI Landing Page Optimizer Bot. Save over $250/month.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Complete marketing automation',
      '5 powerful AI bots included',
      'Marketing funnels + content + email + ads + optimization',
      'Save over $250/month',
      'Everything you need to grow',
      'Priority support included'
    ],
    'target_audience', 'Business owners who want complete marketing automation',
    'ad_copy', 'Complete Marketing Automation For 70% Less. Get AI Marketing Funnels, Content Calendar, Email Sequences, Ad Manager, and Landing Page Optimizer in one package. Everything you need to automate your marketing and grow your business. Save over $250/month!',
    'ad_headline', 'Your Entire Marketing Team, Automated',
    'ad_cta', 'Get Marketing Automation Suite',
    'demo_available', true
  )
),
(
  'LOCAL-BUSINESS-DOMINATION-MONTHLY',
  'Local Business Domination Package',
  'bundle',
  89700,
  'USD',
  3500,
  true,
  'price_local_business_domination_monthly',
  true,
  'Everything you need to dominate your local market. Includes AI Local SEO Optimizer Bot, AI Reputation Monitor Bot, AI Review Responder Bot, AI Competitor Analysis Bot, and AI Chatbot Builder Bot. Save over $200/month.',
  'ai_tools',
  jsonb_build_object(
    'benefits', ARRAY[
      'Dominate your local market',
      '5 AI bots for local business',
      'Local SEO + reputation + reviews + competitor tracking + chatbot',
      'Save over $200/month',
      'Show up first in searches',
      'Priority support included'
    ],
    'target_audience', 'Local business owners who want to dominate their market',
    'ad_copy', 'Dominate Your Local Market With AI. Get Local SEO Optimizer, Reputation Monitor, Review Responder, Competitor Analysis, and Chatbot in one package. Show up first. Get more reviews. Beat competitors. Save over $200/month!',
    'ad_headline', 'Own Your Local Market With AI',
    'ad_cta', 'Start Dominating Locally',
    'demo_available', true
  )
);
