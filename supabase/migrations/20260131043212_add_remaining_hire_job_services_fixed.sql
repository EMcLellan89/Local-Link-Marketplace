/*
  # Add Remaining Hire Job Services (Fixed)

  Add the remaining 9 job service types:
  - Email Campaign Manager
  - Customer Service Rep
  - Data Entry Specialist
  - Video Editor
  - Bookkeeper
  - Market Research Analyst
  - Appointment Setter
  - Community Manager
*/

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
  'LL_HIRE_EMAIL_BASIC',
  'Email Campaign Manager - Basic',
  'service',
  50000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'email_campaign_manager',
    'campaigns_per_month', 4,
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Email marketing campaigns and newsletter management. 4 campaigns per month.',
  'hire_jobs'
),
(
  'LL_HIRE_EMAIL_STANDARD',
  'Email Campaign Manager - Standard',
  'service',
  80000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'email_campaign_manager',
    'campaigns_per_month', 8,
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Email marketing campaigns and newsletter management. 8 campaigns per month.',
  'hire_jobs'
),
(
  'LL_HIRE_EMAIL_PREMIUM',
  'Email Campaign Manager - Premium',
  'service',
  120000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'email_campaign_manager',
    'campaigns_per_month', 12,
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Email marketing campaigns and newsletter management. 12 campaigns per month.',
  'hire_jobs'
),
(
  'LL_HIRE_CS_15HR',
  'Customer Service Rep - 15 Hours',
  'service',
  45000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'customer_service_rep',
    'hours', 15,
    'turnaround', 'Ongoing support'
  ),
  'Professional customer support and inquiry handling. 15 hours of service.',
  'hire_jobs'
),
(
  'LL_HIRE_CS_30HR',
  'Customer Service Rep - 30 Hours',
  'service',
  85000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'customer_service_rep',
    'hours', 30,
    'turnaround', 'Ongoing support'
  ),
  'Professional customer support and inquiry handling. 30 hours of service.',
  'hire_jobs'
),
(
  'LL_HIRE_CS_60HR',
  'Customer Service Rep - 60 Hours',
  'service',
  150000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'customer_service_rep',
    'hours', 60,
    'turnaround', 'Ongoing support'
  ),
  'Professional customer support and inquiry handling. 60 hours of service.',
  'hire_jobs'
),
(
  'LL_HIRE_DATA_SMALL',
  'Data Entry - Small Project',
  'service',
  30000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'data_entry',
    'entries', 'up to 500',
    'turnaround', '5-7 days'
  ),
  'Accurate data entry and database management. Up to 500 entries.',
  'hire_jobs'
),
(
  'LL_HIRE_DATA_MEDIUM',
  'Data Entry - Medium Project',
  'service',
  55000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'data_entry',
    'entries', '501-1500',
    'turnaround', '7-10 days'
  ),
  'Accurate data entry and database management. 501-1500 entries.',
  'hire_jobs'
),
(
  'LL_HIRE_DATA_LARGE',
  'Data Entry - Large Project',
  'service',
  95000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'data_entry',
    'entries', '1501-3000',
    'turnaround', '10-14 days'
  ),
  'Accurate data entry and database management. 1501-3000 entries.',
  'hire_jobs'
),
(
  'LL_HIRE_VIDEO_SHORT',
  'Video Editor - Short Video',
  'service',
  30000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'video_editor',
    'length', 'under 3 min',
    'turnaround', '5-7 days'
  ),
  'Professional video editing for marketing and content. Short videos under 3 minutes.',
  'hire_jobs'
),
(
  'LL_HIRE_VIDEO_LONG',
  'Video Editor - Long Video',
  'service',
  50000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'video_editor',
    'length', '3-10 min',
    'turnaround', '7-10 days'
  ),
  'Professional video editing for marketing and content. Videos 3-10 minutes.',
  'hire_jobs'
),
(
  'LL_HIRE_VIDEO_PACKAGE',
  'Video Editor - 5 Videos Package',
  'service',
  120000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'video_editor',
    'videos', 5,
    'turnaround', '10-14 days'
  ),
  'Professional video editing package. 5 short videos under 3 minutes each.',
  'hire_jobs'
),
(
  'LL_HIRE_BOOKKEEPER_BASIC',
  'Bookkeeper - Basic',
  'service',
  40000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'bookkeeper',
    'transactions', 'up to 50',
    'turnaround', 'Monthly ongoing',
    'billing_interval', 'month'
  ),
  'Monthly bookkeeping and financial record management. Up to 50 transactions.',
  'hire_jobs'
),
(
  'LL_HIRE_BOOKKEEPER_STANDARD',
  'Bookkeeper - Standard',
  'service',
  70000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'bookkeeper',
    'transactions', '51-150',
    'turnaround', 'Monthly ongoing',
    'billing_interval', 'month'
  ),
  'Monthly bookkeeping and financial record management. 51-150 transactions.',
  'hire_jobs'
),
(
  'LL_HIRE_BOOKKEEPER_PREMIUM',
  'Bookkeeper - Premium',
  'service',
  110000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'bookkeeper',
    'transactions', '151-300',
    'turnaround', 'Monthly ongoing',
    'billing_interval', 'month'
  ),
  'Monthly bookkeeping and financial record management. 151-300 transactions.',
  'hire_jobs'
),
(
  'LL_HIRE_RESEARCH_BASIC',
  'Market Research - Basic Report',
  'service',
  40000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'market_research',
    'report_type', 'basic',
    'turnaround', '7-10 days'
  ),
  'Competitor analysis and market research reports. Basic research report.',
  'hire_jobs'
),
(
  'LL_HIRE_RESEARCH_COMPREHENSIVE',
  'Market Research - Comprehensive Report',
  'service',
  70000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'market_research',
    'report_type', 'comprehensive',
    'turnaround', '10-14 days'
  ),
  'Competitor analysis and market research reports. Comprehensive report.',
  'hire_jobs'
),
(
  'LL_HIRE_RESEARCH_INDEPTH',
  'Market Research - In-Depth Analysis',
  'service',
  120000,
  'USD',
  6000,
  true,
  false,
  jsonb_build_object(
    'job_type', 'market_research',
    'report_type', 'indepth',
    'turnaround', '14-21 days'
  ),
  'Competitor analysis and market research reports. In-depth analysis with strategy.',
  'hire_jobs'
),
(
  'LL_HIRE_APPT_SETTER_PT',
  'Appointment Setter - Part-Time',
  'service',
  50000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'appointment_setter',
    'hours', '20 hours/month',
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Outbound calling and appointment booking services. 20 hours per month.',
  'hire_jobs'
),
(
  'LL_HIRE_APPT_SETTER_FT',
  'Appointment Setter - Full-Time',
  'service',
  90000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'appointment_setter',
    'hours', '40 hours/month',
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Outbound calling and appointment booking services. 40 hours per month.',
  'hire_jobs'
),
(
  'LL_HIRE_APPT_SETTER_INTENSIVE',
  'Appointment Setter - Intensive',
  'service',
  160000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'appointment_setter',
    'hours', '80 hours/month',
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Outbound calling and appointment booking services. 80 hours per month.',
  'hire_jobs'
),
(
  'LL_HIRE_COMMUNITY_BASIC',
  'Community Manager - Basic',
  'service',
  55000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'community_manager',
    'hours', '10 hours/week',
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Online community engagement and moderation. 10 hours per week.',
  'hire_jobs'
),
(
  'LL_HIRE_COMMUNITY_STANDARD',
  'Community Manager - Standard',
  'service',
  95000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'community_manager',
    'hours', '20 hours/week',
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Online community engagement and moderation. 20 hours per week.',
  'hire_jobs'
),
(
  'LL_HIRE_COMMUNITY_PREMIUM',
  'Community Manager - Premium',
  'service',
  170000,
  'USD',
  6000,
  true,
  true,
  jsonb_build_object(
    'job_type', 'community_manager',
    'hours', '40 hours/week',
    'turnaround', 'Ongoing monthly',
    'billing_interval', 'month'
  ),
  'Online community engagement and moderation. 40 hours per week.',
  'hire_jobs'
)
ON CONFLICT (sku) DO UPDATE SET
  price_cents = EXCLUDED.price_cents,
  commission_rate_bp = EXCLUDED.commission_rate_bp,
  metadata = EXCLUDED.metadata,
  active = EXCLUDED.active;
