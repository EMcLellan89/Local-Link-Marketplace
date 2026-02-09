/*
  # Seed Complete DFY Services Catalog
  
  All Done-For-You services with correct pricing, categories, and requirements
*/

INSERT INTO dfy_services (slug, name, description, category, merchant_price_cents, billing_type, requires_sample, estimated_turnaround_days)
VALUES
  -- Content & Authority Services
  ('letter-writing-single', 'Letter Writing — Single Letter', 'Professionally written letter for customer reactivation, business outreach, or partnership development', 'content', 9900, 'one_time', true, 3),
  ('letter-writing-sequence', 'Letter Writing — 3-Letter Sequence', 'Three-letter campaign sequence designed to maximize response and engagement', 'content', 24900, 'one_time', true, 5),
  ('letter-writing-monthly', 'Letter Writing — Monthly Campaign', 'Ongoing monthly letter campaigns with custom messaging and audience targeting', 'content', 39900, 'monthly', true, NULL),
  
  ('email-marketing-setup', 'Email Marketing — Setup', 'Complete email marketing setup including campaign strategy, list segmentation, and automation configuration', 'content', 29900, 'one_time', true, 5),
  ('email-marketing-lite', 'Email Marketing — Lite (2-4 sends/mo)', 'Monthly email campaign management with 2-4 sends per month', 'content', 29900, 'monthly', true, NULL),
  ('email-marketing-pro', 'Email Marketing — Pro (4-8 sends/mo)', 'Professional email marketing with 4-8 sends, segmentation, and performance optimization', 'content', 49900, 'monthly', true, NULL),
  ('email-marketing-scale', 'Email Marketing — Scale (8+ sends/mo)', 'Enterprise email marketing with 8+ sends, advanced automation, and A/B testing', 'content', 69900, 'monthly', true, NULL),
  
  ('sms-marketing-setup', 'SMS Marketing — Setup', 'SMS campaign setup with compliance, opt-in flows, and automation rules', 'content', 19900, 'one_time', true, 3),
  ('sms-marketing-lite', 'SMS Marketing — Lite', 'Monthly SMS campaigns for appointment reminders, promotions, and reactivation', 'content', 19900, 'monthly', true, NULL),
  ('sms-marketing-pro', 'SMS Marketing — Pro', 'Professional SMS marketing with segmentation and performance tracking', 'content', 34900, 'monthly', true, NULL),
  ('sms-marketing-scale', 'SMS Marketing — Scale', 'Enterprise SMS with advanced automation and multi-campaign management', 'content', 49900, 'monthly', true, NULL),
  
  ('blog-writing-setup', 'Blog Setup — Foundation', 'Blog structure, categories, SEO basics, and posting workflow setup', 'content', 49700, 'one_time', true, 7),
  ('blog-writing-single', 'Blog Writing — Single Post', '1 SEO blog post (800-1200 words) with CTA and internal link plan', 'content', 15000, 'one_time', true, 5),
  ('blog-writing-monthly-4', 'Blog Writing — 4 Posts/Month', 'Monthly blog writing with 4 SEO-optimized posts and content calendar', 'content', 49900, 'monthly', true, NULL),
  
  ('social-content-8', 'Social Media Content — 8 Posts/Month', 'Monthly social media content creation with 8 platform-ready posts', 'content', 29900, 'monthly', true, NULL),
  ('social-content-16', 'Social Media Content — 16 Posts/Month', 'Comprehensive social media content with 16 posts, scheduling, and engagement strategy', 'content', 49900, 'monthly', true, NULL),
  
  ('sales-scripts-pack', 'Sales Scripts — Complete Pack', 'Professional sales scripts including discovery calls, objection handling, and closing scripts', 'content', 29900, 'one_time', true, 5),
  ('sales-scripts-optimization', 'Call Handling Script Optimization — Monthly', 'Monthly script refinement based on call performance and conversion data', 'content', 9900, 'monthly', true, NULL),
  
  ('proposals-template-set', 'Proposal & Estimate Templates — Set', 'Professional proposal and estimate templates customized for your industry and services', 'content', 19900, 'one_time', true, 5),
  ('proposals-custom', 'Proposal & Estimate Templates — Custom', 'Fully customized proposals with your branding, pricing structure, and terms', 'content', 39900, 'one_time', true, 7),
  
  -- Visibility & Reputation Services
  ('gbp-setup', 'Google Business Profile — Setup', 'Complete GBP optimization including profile setup, photo optimization, and Q&A management', 'visibility', 19900, 'one_time', true, 5),
  ('gbp-monthly', 'Google Business Profile — Monthly Management', 'Ongoing GBP management with weekly posts, Q&A responses, and profile optimization', 'visibility', 29900, 'monthly', true, NULL),
  
  ('review-management-setup', 'Review Management — Setup', 'Review system setup with monitoring, response workflows, and request campaigns', 'visibility', 19900, 'one_time', true, 3),
  ('review-management-monthly', 'Review Management — Monthly', 'Ongoing review monitoring, professional responses, and reputation management', 'visibility', 14900, 'monthly', true, NULL),
  
  ('reputation-responses', 'Reputation Response Management — Monthly', 'Professional review response management across all platforms to protect and enhance your reputation', 'visibility', 9900, 'monthly', true, NULL),
  
  ('citations-setup', 'Directory & Citation Management — Setup', 'Complete local directory setup across 50+ platforms to improve local SEO and trust signals', 'visibility', 29900, 'one_time', true, 7),
  ('citations-maintenance', 'Directory & Citation Management — Maintenance', 'Ongoing citation monitoring, updates, and new directory additions', 'visibility', 14900, 'monthly', true, NULL),
  
  ('seo-setup', 'SEO Setup — On-Page + Local', 'On-page SEO basics and local SEO checklist implementation', 'visibility', 49700, 'one_time', true, 7),
  ('seo-monthly', 'SEO Ongoing — Monthly', 'Monthly SEO optimization with content guidance and performance reporting', 'visibility', 39900, 'monthly', true, NULL),
  
  -- Operations & Support Services
  ('va-starter', 'Virtual Assistant — Starter (10 hrs/mo)', 'Virtual assistant support with 10 hours monthly for CRM updates, lead follow-up, scheduling', 'operations', 39900, 'monthly', true, NULL),
  ('va-growth', 'Virtual Assistant — Growth (20 hrs/mo)', 'Professional VA support with 20 hours monthly for comprehensive business operations', 'operations', 74900, 'monthly', true, NULL),
  ('va-scale', 'Virtual Assistant — Scale (40 hrs/mo)', 'Enterprise VA support with 40 hours monthly for multi-location or high-volume operations', 'operations', 129900, 'monthly', true, NULL),
  
  ('crm-management-setup', 'CRM Management — Setup', 'CRM setup with pipelines, automation rules, and workflow configuration', 'operations', 29900, 'one_time', true, 5),
  ('crm-management-monthly', 'CRM Management — Monthly', 'Ongoing CRM management with pipeline optimization and automation maintenance', 'operations', 49900, 'monthly', true, NULL),
  
  ('appointment-setting-hourly-10', 'Appointment Setting — 10 Hours/Month', 'Human-backed appointment setting with 10 hours of monthly coverage plus per-meeting charges', 'operations', 55000, 'monthly', true, NULL),
  ('appointment-setting-hourly-20', 'Appointment Setting — 20 Hours/Month', 'Professional appointment setting with 20 hours monthly coverage for consistent lead flow', 'operations', 110000, 'monthly', true, NULL),
  ('appointment-setting-hourly-40', 'Appointment Setting — 40 Hours/Month', 'Enterprise appointment setting with 40 hours monthly coverage for high-volume businesses', 'operations', 200000, 'monthly', true, NULL),
  
  -- Automation & Conversion Services
  ('ai-automation-setup', 'AI Automation Setup', 'AI automation setup for missed calls, lead routing, and customer communication', 'automation', 29900, 'one_time', true, 5),
  ('ai-automation-monthly', 'AI Automation Management — Monthly', 'Ongoing AI automation optimization and performance monitoring', 'automation', 14900, 'monthly', true, NULL),
  
  ('landing-page-single', 'Landing Page — Single Page', 'Custom landing page designed to convert traffic into leads with clear CTAs and mobile optimization', 'automation', 79900, 'one_time', true, 7),
  ('landing-page-ab-variant', 'Landing Page — A/B Variant Add-On', 'Additional landing page variant for split testing and conversion optimization', 'automation', 19900, 'one_time', true, 5),
  ('landing-page-optimization', 'Landing Page — Monthly Optimization', 'Ongoing landing page optimization with performance tracking and iterative improvements', 'automation', 19900, 'monthly', true, NULL),
  
  ('ai-sales-page-build', 'AI Sales Page Build (DFY)', 'Partner builds conversion page copy with proven frameworks, sections, and CTAs', 'automation', 49700, 'one_time', true, 5),
  ('ai-lead-magnet', 'AI Lead Magnet + Landing Page (DFY)', 'Lead magnet content and landing page copy with opt-in optimization', 'automation', 29700, 'one_time', true, 5),
  ('ai-ebook', 'AI Ebook/Workbook (DFY)', 'Complete ebook or workbook with outline, content, and layout-ready structure', 'automation', 59700, 'one_time', true, 10),
  ('ai-ad-creative', 'AI Ad Creative Pack (DFY)', '10 ad angles + 10 hooks + 10 headlines + 5 video scripts', 'automation', 39700, 'one_time', true, 5),
  ('ai-website-copy-refresh', 'AI Website Copy Refresh (DFY)', 'Complete website copywriting refresh for higher conversion', 'automation', 69700, 'one_time', true, 10),
  
  ('ugc-pack-5', 'UGC Content Pack — 5 Videos', '5 short-form UGC videos (15-30 seconds) with hooks, captions, and usage rights', 'automation', 29700, 'one_time', true, 7),
  ('ugc-monthly', 'UGC Content Monthly — 12 Videos', 'Monthly UGC production with 12 videos for consistent authentic content', 'automation', 59700, 'monthly', true, NULL),
  
  -- Strategic Services
  ('revenue-recovery-setup', 'Missed Revenue Recovery — Setup', 'Complete setup for missed call recovery, form abandonment follow-up, and stale lead reactivation', 'strategic', 19900, 'one_time', true, 5),
  ('revenue-recovery-monthly', 'Missed Revenue Recovery — Monthly', 'Ongoing revenue recovery with systematic follow-up and reactivation campaigns', 'strategic', 19900, 'monthly', true, NULL),
  
  ('seasonal-campaign-standard', 'Seasonal Campaign — Standard', 'Complete seasonal campaign including emails, SMS, letters, landing page, and posting schedule', 'strategic', 69900, 'one_time', true, 14),
  ('seasonal-campaign-premium', 'Seasonal Campaign — Premium', 'Premium seasonal campaign with extended reach and multi-channel coordination', 'strategic', 99900, 'one_time', true, 21)
ON CONFLICT (slug) DO NOTHING;

-- Update metadata for products_catalog to reference DFY services
UPDATE products_catalog
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{dfy_service}',
  'true'::jsonb
)
WHERE slug LIKE 'dfy-%';
