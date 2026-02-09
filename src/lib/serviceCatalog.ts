export type ServiceSlug =
  | 'marketing'
  | 'crm_migration'
  | 'ai_automations'
  | 'ad_swipe_file'
  | 'website_services'
  | 'printing_services'
  | 'ugc_content'
  | 'leads_outreach'
  | 'appointment_setting'
  | 'recruiting_tools'
  | 'postcard_advertising';

export const SERVICE_TO_PRODUCT_KEY: Record<ServiceSlug, string> = {
  marketing: 'marketing',
  crm_migration: 'crm_migration',
  ai_automations: 'ai_automations',
  ad_swipe_file: 'ad_swipe_file',
  website_services: 'website_services',
  printing_services: 'printing_services',
  ugc_content: 'ugc_content',
  leads_outreach: 'leads_outreach',
  appointment_setting: 'appointment_setting',
  recruiting_tools: 'recruiting_tools',
  postcard_advertising: 'postcard_advertising',
};

export const SERVICE_CATALOG: Record<ServiceSlug, {
  name: string;
  description: string;
  estimatedPrice?: string;
  courseAvailable: boolean;
}> = {
  marketing: {
    name: 'Marketing Strategy & Execution',
    description: 'Complete marketing campaigns including strategy, ad creation, and execution',
    estimatedPrice: '$500-2000',
    courseAvailable: true,
  },
  crm_migration: {
    name: 'CRM Migration & Setup',
    description: 'Migrate your customer data and set up your CRM system',
    estimatedPrice: '$300-1000',
    courseAvailable: true,
  },
  ai_automations: {
    name: 'AI Automation Setup',
    description: 'Configure AI bots for lead qualification, follow-ups, and customer service',
    estimatedPrice: '$400-1500',
    courseAvailable: true,
  },
  ad_swipe_file: {
    name: 'Ad Swipe File Access',
    description: 'Get proven ad templates and marketing materials',
    estimatedPrice: '$297',
    courseAvailable: false,
  },
  website_services: {
    name: 'Website Design & Development',
    description: 'Professional website design and development services',
    estimatedPrice: '$1000-5000',
    courseAvailable: true,
  },
  printing_services: {
    name: 'Printing & Design Services',
    description: 'Business cards, flyers, brochures, and promotional materials',
    estimatedPrice: '$50-500',
    courseAvailable: false,
  },
  ugc_content: {
    name: 'UGC Video Content Creation',
    description: 'Professional user-generated content videos for ads',
    estimatedPrice: '$199-999',
    courseAvailable: true,
  },
  leads_outreach: {
    name: 'Lead Generation & Outreach',
    description: 'We find and contact leads for your business',
    estimatedPrice: '$200-1000/mo',
    courseAvailable: true,
  },
  appointment_setting: {
    name: 'Appointment Setting Service',
    description: 'Professional callers book appointments for your business',
    estimatedPrice: '$500-2500/mo',
    courseAvailable: false,
  },
  recruiting_tools: {
    name: 'Recruiting & Hiring Support',
    description: 'Resume writing, job templates, and hiring funnel setup',
    estimatedPrice: '$150-750',
    courseAvailable: false,
  },
  postcard_advertising: {
    name: 'Postcard Marketing Campaign',
    description: 'Design, print, and mail postcards to your target audience',
    estimatedPrice: '$300-1000',
    courseAvailable: false,
  },
};
