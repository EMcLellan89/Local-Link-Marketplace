/*
  # Add Hire Jobs System and Partner Payout Tracking

  1. Changes to dfy_jobs
    - Make service_id nullable (for generic job postings)
    - Add partner_payout_cents for commission tracking
    
  2. New Job Service Products
    - Add 12 work-from-home job services to marketplace
    - Prices range from $150-$1700 with 60% partner commission
    - Categories include administrative, content, support, etc.
*/

-- Make service_id nullable for generic job postings
ALTER TABLE dfy_jobs ALTER COLUMN service_id DROP NOT NULL;

-- Add partner payout tracking
ALTER TABLE dfy_jobs ADD COLUMN IF NOT EXISTS partner_payout_cents integer;

-- Add index for payout tracking
CREATE INDEX IF NOT EXISTS idx_dfy_jobs_payout ON dfy_jobs(partner_payout_cents) WHERE partner_payout_cents IS NOT NULL;

-- Insert Virtual Assistant service products
INSERT INTO marketplace_affiliate_products (
  sku,
  name,
  type,
  price_cents,
  currency,
  commission_rate_bp,
  active,
  recurring,
  metadata,
  description,
  category
) VALUES 
(
  'LL_HIRE_VA_10HR',
  'Virtual Assistant - 10 Hours',
  'service',
  35000,
  'USD',
  6000, -- 60% commission = $210
  true,
  false,
  jsonb_build_object(
    'job_type', 'virtual_assistant',
    'hours', 10,
    'turnaround', 'Ongoing support',
    'deliverables', jsonb_build_array(
      'Email management & scheduling',
      'Calendar coordination',
      'Data entry & file organization',
      'Customer communication',
      'Research & documentation'
    )
  ),
  'Professional administrative support for daily business tasks. 10 hours of expert virtual assistant service.',
  'hire_jobs'
),
(
  'LL_HIRE_VA_20HR',
  'Virtual Assistant - 20 Hours',
  'service',
  65000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'virtual_assistant',
    'hours', 20,
    'turnaround', 'Ongoing support'
  ),
  'Professional administrative support for daily business tasks. 20 hours of expert virtual assistant service.',
  'hire_jobs'
),
(
  'LL_HIRE_VA_40HR',
  'Virtual Assistant - 40 Hours',
  'service',
  120000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'virtual_assistant',
    'hours', 40,
    'turnaround', 'Ongoing support'
  ),
  'Professional administrative support for daily business tasks. 40 hours of expert virtual assistant service.',
  'hire_jobs'
),
(
  'LL_HIRE_CONTENT_WRITER_1',
  'Content Writer - 1 Article (500-750 words)',
  'service',
  20000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'content_writer',
    'articles', 1,
    'word_count', '500-750',
    'turnaround', '5-7 days'
  ),
  'Professional blog posts and web content. SEO-optimized with 2 rounds of revisions.',
  'hire_jobs'
),
(
  'LL_HIRE_CONTENT_WRITER_LONG',
  'Content Writer - 1 Article (1000-1500 words)',
  'service',
  35000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'content_writer',
    'articles', 1,
    'word_count', '1000-1500',
    'turnaround', '5-7 days'
  ),
  'Professional blog posts and web content. SEO-optimized with 2 rounds of revisions.',
  'hire_jobs'
),
(
  'LL_HIRE_CONTENT_WRITER_5',
  'Content Writer - 5 Articles Package',
  'service',
  80000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'content_writer',
    'articles', 5,
    'word_count', '500-750',
    'turnaround', '7-10 days'
  ),
  'Professional blog posts and web content. 5 articles package with SEO optimization.',
  'hire_jobs'
),
(
  'LL_HIRE_LETTER_WRITER_1',
  'Professional Letter Writer - 1 Letter',
  'service',
  15000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'letter_writer',
    'letters', 1,
    'turnaround', '2-3 days'
  ),
  'Business letters, proposals, and formal communications with professional formatting.',
  'hire_jobs'
),
(
  'LL_HIRE_LETTER_WRITER_3',
  'Professional Letter Writer - 3 Letters',
  'service',
  40000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'letter_writer',
    'letters', 3,
    'turnaround', '5-7 days'
  ),
  'Business letters, proposals, and formal communications. 3 letters package.',
  'hire_jobs'
),
(
  'LL_HIRE_LETTER_WRITER_6',
  'Professional Letter Writer - 6 Letters',
  'service',
  70000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'letter_writer',
    'letters', 6,
    'turnaround', '7-10 days'
  ),
  'Business letters, proposals, and formal communications. 6 letters package.',
  'hire_jobs'
),
(
  'LL_HIRE_SOCIAL_MEDIA_BASIC',
  'Social Media Manager - Basic',
  'service',
  60000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'social_media_manager',
    'posts_per_month', 15,
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Monthly social media management. 15 posts/month with engagement and analytics.',
  'hire_jobs'
),
(
  'LL_HIRE_SOCIAL_MEDIA_STANDARD',
  'Social Media Manager - Standard',
  'service',
  100000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'social_media_manager',
    'posts_per_month', 30,
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Monthly social media management. 30 posts/month with engagement and analytics.',
  'hire_jobs'
),
(
  'LL_HIRE_SOCIAL_MEDIA_PREMIUM',
  'Social Media Manager - Premium',
  'service',
  160000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'social_media_manager',
    'posts_per_month', 60,
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Monthly social media management. 60 posts/month with engagement and analytics.',
  'hire_jobs'
)
ON CONFLICT (sku) DO UPDATE SET
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  metadata = EXCLUDED.metadata,
  active = EXCLUDED.active;
