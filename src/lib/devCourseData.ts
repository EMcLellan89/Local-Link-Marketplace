export interface DevCourseLesson {
  id: string;
  lesson_index: number;
  title: string;
  video_duration_minutes: number;
}

export interface DevCourseModule {
  id: string;
  module_index: number;
  title: string;
  description: string;
  lessons: DevCourseLesson[];
}

export interface DevCourseData {
  title: string;
  subtitle: string;
  modules: DevCourseModule[];
}

export const devCourseData: Record<string, DevCourseData> = {
  'local-customers-on-autopilot': {
    title: 'Local Customers on Autopilot™',
    subtitle: 'Get customers without ads using Local-Link',
    modules: [
      {
        id: '1',
        module_index: 1,
        title: 'How Local Customers Buy Today (2026)',
        description: 'Understand modern local buyer behavior and where Local-Link wins.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'The Death of Traditional Advertising', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'How Modern Buyers Search Locally', video_duration_minutes: 14 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'The Local-Link Advantage', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'Understanding Buyer Psychology', video_duration_minutes: 15 },
          { id: 'lesson-1-5', lesson_index: 5, title: 'Converting Browsers to Buyers', video_duration_minutes: 16 },
          { id: 'lesson-1-6', lesson_index: 6, title: 'Your Local Market Analysis', video_duration_minutes: 11 }
        ]
      },
      {
        id: '2',
        module_index: 2,
        title: 'Listing That Converts',
        description: 'Build a listing that turns views into calls/messages.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Writing Headlines That Hook', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Descriptions That Sell', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Photo Strategy for Local Services', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Optimizing for Search', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Building Social Proof', video_duration_minutes: 11 },
          { id: 'lesson-2-6', lesson_index: 6, title: 'Call-to-Action Mastery', video_duration_minutes: 10 }
        ]
      },
      {
        id: '3',
        module_index: 3,
        title: 'Offers That Bring Buyers',
        description: 'Offer ladder + scarcity without discounting yourself into loss.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Designing Irresistible Offers', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Creating Urgency Without Desperation', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'The Offer Ladder Strategy', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Pricing for Profit', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Package Bundling', video_duration_minutes: 15 },
          { id: 'lesson-3-6', lesson_index: 6, title: 'Testing and Optimizing Offers', video_duration_minutes: 10 }
        ]
      },
      {
        id: '4',
        module_index: 4,
        title: 'Reviews Engine + Reputation',
        description: 'Automate reviews and protect against reputation damage.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'The Review Request System', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Automation Without Being Pushy', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Responding to Negative Reviews', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Building a 5-Star Reputation', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Using Reviews as Marketing', video_duration_minutes: 15 }
        ]
      },
      {
        id: '5',
        module_index: 5,
        title: 'Loyalty + Repeat Business',
        description: 'Turn first-time customers into repeat buyers.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'The Repeat Business Framework', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Follow-Up Sequences That Convert', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Building a Loyalty Program', video_duration_minutes: 13 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Referral Systems', video_duration_minutes: 11 },
          { id: 'lesson-5-5', lesson_index: 5, title: 'Customer Retention Metrics', video_duration_minutes: 10 },
          { id: 'lesson-5-6', lesson_index: 6, title: 'Maximizing Lifetime Value', video_duration_minutes: 12 }
        ]
      },
      {
        id: '6',
        module_index: 6,
        title: 'CRM Tracking + Automation',
        description: 'Install a simple pipeline that prints revenue.',
        lessons: [
          { id: 'lesson-6-1', lesson_index: 1, title: 'Choosing Your CRM', video_duration_minutes: 13 },
          { id: 'lesson-6-2', lesson_index: 2, title: 'Pipeline Setup', video_duration_minutes: 12 },
          { id: 'lesson-6-3', lesson_index: 3, title: 'Automating Follow-Ups', video_duration_minutes: 14 },
          { id: 'lesson-6-4', lesson_index: 4, title: 'Lead Scoring and Prioritization', video_duration_minutes: 11 },
          { id: 'lesson-6-5', lesson_index: 5, title: 'Reporting and Optimization', video_duration_minutes: 15 }
        ]
      }
    ]
  },
  'ugc-from-home': {
    title: 'UGC From Home™',
    subtitle: 'Stay-at-home income creating content (no followers needed)',
    modules: [
      {
        id: '3',
        module_index: 1,
        title: 'UGC Foundations',
        description: 'What brands actually pay for and how to position yourself.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'What is UGC and Why Brands Need It', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'No Followers Required - Why That\'s OK', video_duration_minutes: 14 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Equipment You Actually Need', video_duration_minutes: 10 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'Finding Your Niche', video_duration_minutes: 13 },
          { id: 'lesson-1-5', lesson_index: 5, title: 'Realistic Income Expectations', video_duration_minutes: 11 }
        ]
      },
      {
        id: '4',
        module_index: 2,
        title: 'High-Converting UGC Structure',
        description: 'Make videos brands can run as ads.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'The Hook Formula', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Scripting for Conversions', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'On-Camera Confidence (Even if Shy)', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Editing Basics', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Lighting and Sound', video_duration_minutes: 11 },
          { id: 'lesson-2-6', lesson_index: 6, title: 'Batch Creating Content', video_duration_minutes: 10 }
        ]
      },
      {
        id: '5',
        module_index: 3,
        title: 'Portfolio + Offer',
        description: 'Build a portfolio before you get clients.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Creating Practice Content', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Building Your Portfolio Site', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Package Design', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Pricing Strategy', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Terms and Contracts', video_duration_minutes: 15 },
          { id: 'lesson-3-6', lesson_index: 6, title: 'Case Studies and Testimonials', video_duration_minutes: 10 }
        ]
      },
      {
        id: '6',
        module_index: 4,
        title: 'Outreach Pipeline',
        description: 'Find brands and get replies consistently.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Finding Brands to Contact', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Email Outreach Templates', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Social Media DM Strategy', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Following Up Without Being Annoying', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Daily Outreach Routine', video_duration_minutes: 10 }
        ]
      },
      {
        id: '7',
        module_index: 5,
        title: 'Pricing + Negotiation',
        description: 'Charge confidently and handle objections cleanly.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'Market Rate Research', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Value-Based Pricing', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Handling Price Objections', video_duration_minutes: 13 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Negotiation Scripts', video_duration_minutes: 11 },
          { id: 'lesson-5-5', lesson_index: 5, title: 'When to Walk Away', video_duration_minutes: 10 }
        ]
      },
      {
        id: '8',
        module_index: 6,
        title: 'Retainers + Monthly Income',
        description: 'Turn one-off projects into predictable monthly revenue.',
        lessons: [
          { id: 'lesson-6-1', lesson_index: 1, title: 'Retainer Package Design', video_duration_minutes: 13 },
          { id: 'lesson-6-2', lesson_index: 2, title: 'Pitching Monthly Relationships', video_duration_minutes: 12 },
          { id: 'lesson-6-3', lesson_index: 3, title: 'Delivering Consistent Value', video_duration_minutes: 14 },
          { id: 'lesson-6-4', lesson_index: 4, title: 'Client Retention Strategies', video_duration_minutes: 11 },
          { id: 'lesson-6-5', lesson_index: 5, title: 'Scaling Your UGC Business', video_duration_minutes: 15 }
        ]
      }
    ]
  },
  'pet-businesses-first': {
    title: 'Pet Businesses That Get Found First™',
    subtitle: 'Marketing for groomers, vets, trainers & pet stores',
    modules: [
      {
        id: 'module-1',
        module_index: 1,
        title: 'Pet Owner Behavior + Your Offer',
        description: 'Understand how pet owners search, choose, and refer',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'How Pet Owners Search Today', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'The Trust Gap in Pet Services', video_duration_minutes: 14 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Offer Design That Attracts Pet Owners', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'Pricing Psychology for Pet Parents', video_duration_minutes: 15 },
          { id: 'lesson-1-5', lesson_index: 5, title: 'Building Your PawConnect Positioning', video_duration_minutes: 16 }
        ]
      },
      {
        id: 'module-2',
        module_index: 2,
        title: 'Google Maps + Local SEO for Pet Pros',
        description: 'Master Google Business Profile optimization',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Google Business Profile Setup for Pet Services', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Photo Strategy That Converts Pet Owners', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Keyword Research for Pet Services', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Local SEO Ranking Factors', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Google Maps Optimization Checklist', video_duration_minutes: 11 }
        ]
      },
      {
        id: 'module-3',
        module_index: 3,
        title: 'Reputation + Reviews That Drive Bookings',
        description: 'Build a review engine that generates 5-star reviews',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'The Pet Owner Review Psychology', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Automated Review Request System', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Responding to Emotional Complaints', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Photo Reviews + Video Testimonials', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Turning Reviews into Marketing Content', video_duration_minutes: 10 }
        ]
      },
      {
        id: 'module-4',
        module_index: 4,
        title: 'Local Demand: Partnerships + Community',
        description: 'Create a referral loop with vets, groomers, and shelters',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Building Veterinarian Referral Partnerships', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Shelter + Rescue Collaboration Strategy', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Cross-Promotion with Pet Businesses', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Community Events + Sponsorships', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Emergency Alert Response System', video_duration_minutes: 15 }
        ]
      },
      {
        id: 'module-5',
        module_index: 5,
        title: 'Retention + Revenue Systems',
        description: 'Build membership models and loyalty programs',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'Membership Models for Pet Services', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Automated Reminder + Rebooking System', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Loyalty Programs That Don\'t Discount', video_duration_minutes: 13 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Win-Back Campaigns for Lost Customers', video_duration_minutes: 11 },
          { id: 'lesson-5-5', lesson_index: 5, title: 'KPI Tracking for Pet Business Growth', video_duration_minutes: 10 }
        ]
      }
    ]
  },
  'ai-receptionist-missed-calls': {
    title: 'AI Receptionist & Missed Call Recovery™',
    subtitle: 'Automate appointment booking and customer service',
    modules: [
      {
        id: '5',
        module_index: 1,
        title: 'Missed Call Math',
        description: 'Know exactly what missed calls cost you.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'The True Cost of Missed Calls', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'Tracking Your Call Volume', video_duration_minutes: 11 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Calculating Lost Revenue', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'The ROI of AI Reception', video_duration_minutes: 10 }
        ]
      },
      {
        id: '6',
        module_index: 2,
        title: 'Receptionist Setup',
        description: 'Configure tone, rules, and boundaries.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Setting Up Your AI Voice', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Creating Call Scripts', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Setting Business Rules', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Training Your AI', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Testing Before Going Live', video_duration_minutes: 11 }
        ]
      },
      {
        id: '7',
        module_index: 3,
        title: 'Booking Workflow',
        description: 'Turn calls into appointments automatically.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Calendar Integration', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Booking Logic Setup', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Confirmation Systems', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Handling Complex Requests', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Rescheduling Automation', video_duration_minutes: 10 }
        ]
      },
      {
        id: '8',
        module_index: 4,
        title: 'Follow-Up Automation',
        description: 'Recover jobs you would have lost.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Missed Call Follow-Up Sequences', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'SMS and Email Integration', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Callback Scheduling', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Voicemail Drop Strategy', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Converting Cold Leads', video_duration_minutes: 15 }
        ]
      },
      {
        id: '9',
        module_index: 5,
        title: 'CRM Handoff + Reporting',
        description: 'Track and improve performance.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'CRM Integration', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Call Analytics Dashboard', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Performance Optimization', video_duration_minutes: 13 }
        ]
      }
    ]
  },
  'reviews-that-convert': {
    title: 'Reviews That Bring Customers In™',
    subtitle: 'Turn 5-star reviews into paying customers',
    modules: [
      {
        id: '10',
        module_index: 1,
        title: 'Review Psychology',
        description: 'Why reviews drive calls more than ads.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'The Psychology of Social Proof', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'How Customers Read Reviews', video_duration_minutes: 11 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Review Platforms That Matter', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'The 5-Star Advantage', video_duration_minutes: 10 }
        ]
      },
      {
        id: '11',
        module_index: 2,
        title: 'Asking Scripts',
        description: 'Get reviews without awkwardness.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'The Perfect Timing', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'In-Person Request Scripts', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Text Message Templates', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Email Follow-Up Sequences', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Making It Easy for Customers', video_duration_minutes: 11 },
          { id: 'lesson-2-6', lesson_index: 6, title: 'Incentives That Work', video_duration_minutes: 10 }
        ]
      },
      {
        id: '12',
        module_index: 3,
        title: 'Automation System',
        description: 'Make reviews consistent.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Setting Up Automation', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Trigger-Based Requests', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Multi-Platform Strategy', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Tracking and Reporting', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Optimizing Response Rates', video_duration_minutes: 10 }
        ]
      },
      {
        id: '13',
        module_index: 4,
        title: 'Responding Like a Pro',
        description: 'Protect reputation with responses.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Response Templates', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Handling Negative Reviews', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Turning Critics Into Fans', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Legal Considerations', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'When to Escalate', video_duration_minutes: 10 }
        ]
      },
      {
        id: '14',
        module_index: 5,
        title: 'Turn Reviews Into Content',
        description: 'Use reviews to market everywhere.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'Creating Social Media Posts', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Website Testimonial Pages', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Video Testimonials', video_duration_minutes: 13 }
        ]
      }
    ]
  },
  'partner-accelerator': {
    title: 'Local-Link Partner Accelerator™',
    subtitle: 'Build a 6-figure Local-Link partnership',
    modules: [
      {
        id: '15',
        module_index: 1,
        title: 'Ecosystem Overview + What to Sell',
        description: 'Know what to recommend and why.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'Understanding the Local-Link Platform', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'Core Services and Add-Ons', video_duration_minutes: 14 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Commission Structure', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'Target Customer Profiles', video_duration_minutes: 15 },
          { id: 'lesson-1-5', lesson_index: 5, title: 'Territory Management Basics', video_duration_minutes: 11 }
        ]
      },
      {
        id: '16',
        module_index: 2,
        title: 'Prospecting + Lead Sources',
        description: 'Find business owners daily.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Identifying Ideal Prospects', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'LinkedIn Prospecting', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Local Networking Events', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Referral Systems', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Cold Outreach That Works', video_duration_minutes: 11 },
          { id: 'lesson-2-6', lesson_index: 6, title: 'Building a Daily Pipeline', video_duration_minutes: 10 }
        ]
      },
      {
        id: '17',
        module_index: 3,
        title: 'Sales Calls (Non-Pushy)',
        description: 'Convert without pressure.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Discovery Call Framework', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Asking Better Questions', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Presenting Solutions', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Handling Objections', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Closing Techniques', video_duration_minutes: 10 }
        ]
      },
      {
        id: '18',
        module_index: 4,
        title: 'Bundling + Pricing Strategy',
        description: 'Increase deal size and retention.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Creating Package Bundles', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Value-Based Pricing', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Upselling and Cross-Selling', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Annual Contracts', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Payment Plans', video_duration_minutes: 10 }
        ]
      },
      {
        id: '19',
        module_index: 5,
        title: 'Partner Ops + Scaling Income',
        description: 'Run partner income like a business.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'CRM and Pipeline Management', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Client Onboarding Process', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Retention and Renewals', video_duration_minutes: 13 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Building a Team', video_duration_minutes: 11 },
          { id: 'lesson-5-5', lesson_index: 5, title: 'Scaling to Multiple Territories', video_duration_minutes: 15 }
        ]
      }
    ]
  },
  'selling-recurring-revenue': {
    title: 'Selling Recurring Revenue™',
    subtitle: 'Land monthly retainers from local businesses',
    modules: [
      {
        id: '20',
        module_index: 1,
        title: 'Recurring Revenue Foundations',
        description: 'Why subscriptions win and how to package them.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'The Subscription Economy', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'Why Businesses Buy Retainers', video_duration_minutes: 14 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Recurring vs One-Time', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'Service Packages That Stick', video_duration_minutes: 15 },
          { id: 'lesson-1-5', lesson_index: 5, title: 'Pricing Models', video_duration_minutes: 11 }
        ]
      },
      {
        id: '21',
        module_index: 2,
        title: 'Discovery Calls That Convert',
        description: 'Get to the real pain and budget.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Pre-Call Research', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Opening the Call', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Uncovering Pain Points', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Budget Qualification', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Next Steps Framework', video_duration_minutes: 11 }
        ]
      },
      {
        id: '22',
        module_index: 3,
        title: 'Objections + Negotiation',
        description: 'Handle pushback like a pro.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Common Objections', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Price Objections', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Timing Objections', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Authority Objections', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Negotiation Tactics', video_duration_minutes: 10 },
          { id: 'lesson-3-6', lesson_index: 6, title: 'When to Walk Away', video_duration_minutes: 12 }
        ]
      },
      {
        id: '23',
        module_index: 4,
        title: 'Retention + Renewals',
        description: 'Keep clients long-term.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Onboarding for Success', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Regular Check-Ins', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Delivering ROI', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Renewal Conversations', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Saving Churning Clients', video_duration_minutes: 10 }
        ]
      },
      {
        id: '24',
        module_index: 5,
        title: 'Systems + Forecasting',
        description: 'Predict revenue and hit targets.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'Building a Sales Dashboard', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Revenue Forecasting', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Churn Analysis', video_duration_minutes: 13 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Setting Growth Goals', video_duration_minutes: 11 },
          { id: 'lesson-5-5', lesson_index: 5, title: 'Scaling Your System', video_duration_minutes: 15 }
        ]
      }
    ]
  },
  'marketing-for-trades': {
    title: 'Marketing for Trades (No Ads Required)™',
    subtitle: 'Plumbing, HVAC, electrical, roofing & more',
    modules: [
      {
        id: '25',
        module_index: 1,
        title: 'Trade Buyer Behavior',
        description: 'Know what makes homeowners call now.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'Emergency vs Planned Services', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'How Homeowners Search for Trades', video_duration_minutes: 14 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Trust Factors in Trade Services', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'Seasonal Demand Patterns', video_duration_minutes: 15 },
          { id: 'lesson-1-5', lesson_index: 5, title: 'Price vs Value Perception', video_duration_minutes: 11 }
        ]
      },
      {
        id: '26',
        module_index: 2,
        title: 'Google Maps Optimization',
        description: 'Win local search without ads.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Google Business Profile Setup', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Photos That Convert', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Service Area Optimization', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Review Strategy', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Ranking Factors', video_duration_minutes: 11 }
        ]
      },
      {
        id: '27',
        module_index: 3,
        title: 'Local-Link Listing + Offers',
        description: 'Turn Local-Link into a job pipeline.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Creating Your Listing', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Offer Design for Trades', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Emergency Service Promotions', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Maintenance Plans', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Seasonal Campaigns', video_duration_minutes: 10 }
        ]
      },
      {
        id: '28',
        module_index: 4,
        title: 'Follow-Up Systems That Win Jobs',
        description: 'Close more estimates.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'The Estimate Follow-Up System', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Text and Email Templates', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Handling Price Shoppers', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Urgency and Scarcity', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Converting to Loyal Customers', video_duration_minutes: 10 }
        ]
      },
      {
        id: '29',
        module_index: 5,
        title: 'Referral Flywheel',
        description: 'Turn jobs into neighbors and repeats.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'Asking for Referrals', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Neighbor Marketing', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Yard Signs and Door Hangers', video_duration_minutes: 13 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Maintenance Reminders', video_duration_minutes: 11 },
          { id: 'lesson-5-5', lesson_index: 5, title: 'Building Customer Lifetime Value', video_duration_minutes: 10 }
        ]
      }
    ]
  },
  'care-coordination-for-families': {
    title: 'Care Coordination for Families™',
    subtitle: 'Home health, senior care & family services marketing',
    modules: [
      {
        id: '35',
        module_index: 1,
        title: 'The Care Chaos Problem',
        description: 'What breaks families and how to fix it.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'Understanding the Care Crisis', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'Family Decision Dynamics', video_duration_minutes: 14 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Building Trust Quickly', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'Your Service Positioning', video_duration_minutes: 15 },
          { id: 'lesson-1-5', lesson_index: 5, title: 'Marketing with Empathy', video_duration_minutes: 11 }
        ]
      },
      {
        id: '36',
        module_index: 2,
        title: 'Setting Up the System',
        description: 'Roles, permissions, and routines.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Care Coordination Basics', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Technology Setup', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Family Communication Plans', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Provider Management', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Documentation Systems', video_duration_minutes: 11 }
        ]
      },
      {
        id: '37',
        module_index: 3,
        title: 'Safety + Emergency Planning',
        description: 'Be ready without panic.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Emergency Contact Systems', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Medical Information Management', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Crisis Response Plans', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Safety Protocols', video_duration_minutes: 11 }
        ]
      },
      {
        id: '38',
        module_index: 4,
        title: 'Communication + Providers',
        description: 'Keep everyone aligned.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Family Meeting Frameworks', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Provider Coordination', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Update Systems', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Conflict Resolution', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Building Care Team Collaboration', video_duration_minutes: 10 }
        ]
      },
      {
        id: '39',
        module_index: 5,
        title: 'Routines That Reduce Stress',
        description: 'Make it sustainable.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'Daily Routine Templates', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Self-Care for Caregivers', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Long-Term Planning', video_duration_minutes: 13 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Maintaining Quality of Life', video_duration_minutes: 11 }
        ]
      }
    ]
  },
  'local-service-side-hustle': {
    title: 'Start a Local Service Side Hustle™',
    subtitle: 'Start a service business with little to no startup cost',
    modules: [
      {
        id: '40',
        module_index: 1,
        title: 'Pick the Right Hustle',
        description: 'Choose based on speed-to-cash.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'Service Business Opportunities', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'Startup Cost Analysis', video_duration_minutes: 14 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Skill Assessment', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'Market Demand Research', video_duration_minutes: 15 },
          { id: 'lesson-1-5', lesson_index: 5, title: 'Making Your Decision', video_duration_minutes: 11 }
        ]
      },
      {
        id: '41',
        module_index: 2,
        title: 'Setup Basics',
        description: 'Start clean and professional.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Business Registration', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Insurance Requirements', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Basic Equipment', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Pricing Your Services', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Creating Your Brand', video_duration_minutes: 11 }
        ]
      },
      {
        id: '42',
        module_index: 3,
        title: 'Get Customers Without Ads',
        description: 'Local outreach that works.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Door-to-Door Strategy', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Flyer and Postcard Marketing', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Local Facebook Groups', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Nextdoor Marketing', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Word-of-Mouth Systems', video_duration_minutes: 10 },
          { id: 'lesson-3-6', lesson_index: 6, title: 'Local-Link Listing Setup', video_duration_minutes: 12 }
        ]
      },
      {
        id: '43',
        module_index: 4,
        title: 'Customer Experience',
        description: 'Get repeat buyers fast.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Professional Communication', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Setting Expectations', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Delivering Quality Work', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Getting Reviews', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Building Loyalty', video_duration_minutes: 10 }
        ]
      },
      {
        id: '44',
        module_index: 5,
        title: 'Scale Safely',
        description: 'Grow without chaos.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'When to Raise Prices', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Hiring Help', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Managing Growth', video_duration_minutes: 13 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Systems and Processes', video_duration_minutes: 11 },
          { id: 'lesson-5-5', lesson_index: 5, title: 'Going Full-Time', video_duration_minutes: 15 }
        ]
      }
    ]
  },
  'online-sales-without-ads': {
    title: 'Online Sales Without Ads™',
    subtitle: 'Systematic outreach, relationships & closing',
    modules: [
      {
        id: '45',
        module_index: 1,
        title: 'Offer Design That Sells',
        description: 'Build an irresistible offer without ads.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'Understanding Your Target Market', video_duration_minutes: 12 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'Crafting Your Core Offer', video_duration_minutes: 14 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Value Stacking Techniques', video_duration_minutes: 13 },
          { id: 'lesson-1-4', lesson_index: 4, title: 'Pricing Strategy', video_duration_minutes: 15 },
          { id: 'lesson-1-5', lesson_index: 5, title: 'Testing and Iteration', video_duration_minutes: 11 }
        ]
      },
      {
        id: '46',
        module_index: 2,
        title: 'Organic Content That Converts',
        description: 'Post with intention and get DMs.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Content Strategy Framework', video_duration_minutes: 14 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Writing Engaging Posts', video_duration_minutes: 12 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Platform-Specific Tactics', video_duration_minutes: 13 },
          { id: 'lesson-2-4', lesson_index: 4, title: 'Building Authority', video_duration_minutes: 15 },
          { id: 'lesson-2-5', lesson_index: 5, title: 'Call-to-Action Strategies', video_duration_minutes: 11 }
        ]
      },
      {
        id: '47',
        module_index: 3,
        title: 'DM Closing System',
        description: 'Close without being salesy.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'Starting Conversations', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Qualifying Prospects', video_duration_minutes: 12 },
          { id: 'lesson-3-3', lesson_index: 3, title: 'Moving to Close', video_duration_minutes: 14 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Handling Objections', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Follow-Up Sequences', video_duration_minutes: 10 },
          { id: 'lesson-3-6', lesson_index: 6, title: 'Payment Collection', video_duration_minutes: 12 }
        ]
      },
      {
        id: '48',
        module_index: 4,
        title: 'Simple Funnel Setup',
        description: 'Minimal tech, maximum results.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Funnel Basics', video_duration_minutes: 13 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Landing Page Setup', video_duration_minutes: 12 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Email Sequence Design', video_duration_minutes: 14 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'Automation Tools', video_duration_minutes: 11 },
          { id: 'lesson-4-5', lesson_index: 5, title: 'Tracking and Analytics', video_duration_minutes: 10 }
        ]
      },
      {
        id: '49',
        module_index: 5,
        title: 'Delivery + Retention',
        description: 'Create happy buyers who refer.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'Onboarding Experience', video_duration_minutes: 14 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Delivering Exceptional Service', video_duration_minutes: 12 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Getting Testimonials', video_duration_minutes: 13 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Referral Systems', video_duration_minutes: 11 },
          { id: 'lesson-5-5', lesson_index: 5, title: 'Upselling and Renewals', video_duration_minutes: 10 },
          { id: 'lesson-5-6', lesson_index: 6, title: 'Building Community', video_duration_minutes: 12 }
        ]
      }
    ]
  },
  'facebook-monetization-local': {
    title: 'Facebook Monetization for Local Businesses™',
    subtitle: 'Turn Views Into Leads, Sales, and Monthly Income',
    modules: [
      {
        id: '50',
        module_index: 1,
        title: 'The Facebook Money Machine',
        description: 'Why Facebook is the fastest path to revenue without ads.',
        lessons: [
          { id: 'lesson-1-1', lesson_index: 1, title: 'The 3 Revenue Streams Hidden in Your Facebook', video_duration_minutes: 14 },
          { id: 'lesson-1-2', lesson_index: 2, title: 'Income Models That Work for Local Businesses', video_duration_minutes: 12 },
          { id: 'lesson-1-3', lesson_index: 3, title: 'Why Most Businesses Fail at Facebook (And How to Win)', video_duration_minutes: 13 }
        ]
      },
      {
        id: '51',
        module_index: 2,
        title: 'Profile & Bio Setup That Sells',
        description: 'Position yourself as the obvious choice.',
        lessons: [
          { id: 'lesson-2-1', lesson_index: 1, title: 'Your Money-Making Profile Structure', video_duration_minutes: 15 },
          { id: 'lesson-2-2', lesson_index: 2, title: 'Bio Formula That Converts Browsers to Buyers', video_duration_minutes: 11 },
          { id: 'lesson-2-3', lesson_index: 3, title: 'Visual Identity and Trust Signals', video_duration_minutes: 10 }
        ]
      },
      {
        id: '52',
        module_index: 3,
        title: 'Content That Converts',
        description: 'Post with purpose and generate sales conversations.',
        lessons: [
          { id: 'lesson-3-1', lesson_index: 1, title: 'The 80/20 Content Rule', video_duration_minutes: 13 },
          { id: 'lesson-3-2', lesson_index: 2, title: 'Engagement Posts That Start Buying Conversations', video_duration_minutes: 14 },
          { id: 'lesson-3-3', lesson_index: 3, title: '30-Day Content Calendar Template', video_duration_minutes: 12 },
          { id: 'lesson-3-4', lesson_index: 4, title: 'Video vs Text vs Images: What Works Best', video_duration_minutes: 11 },
          { id: 'lesson-3-5', lesson_index: 5, title: 'Story Selling Framework', video_duration_minutes: 10 }
        ]
      },
      {
        id: '53',
        module_index: 4,
        title: 'Monetization Methods',
        description: 'Multiple ways to generate income from Facebook.',
        lessons: [
          { id: 'lesson-4-1', lesson_index: 1, title: 'Recurring Memberships and Subscriptions', video_duration_minutes: 14 },
          { id: 'lesson-4-2', lesson_index: 2, title: 'Lead Magnet to Low-Ticket to High-Ticket Ladder', video_duration_minutes: 13 },
          { id: 'lesson-4-3', lesson_index: 3, title: 'Group Offers and Challenges', video_duration_minutes: 12 },
          { id: 'lesson-4-4', lesson_index: 4, title: 'DM Sales System (Conversation to Close)', video_duration_minutes: 17 }
        ]
      },
      {
        id: '54',
        module_index: 5,
        title: 'Funnels That Print Money',
        description: 'Build simple systems that convert consistently.',
        lessons: [
          { id: 'lesson-5-1', lesson_index: 1, title: 'Post to DM to Deal Funnel', video_duration_minutes: 15 },
          { id: 'lesson-5-2', lesson_index: 2, title: 'Trip Wire Offer Strategy', video_duration_minutes: 13 },
          { id: 'lesson-5-3', lesson_index: 3, title: 'Upsell and Cross-Sell Framework', video_duration_minutes: 12 },
          { id: 'lesson-5-4', lesson_index: 4, title: 'Automated Follow-Up Sequences', video_duration_minutes: 11 }
        ]
      },
      {
        id: '55',
        module_index: 6,
        title: 'Local-Link CRM Integration',
        description: 'Connect Facebook leads to automated systems.',
        lessons: [
          { id: 'lesson-6-1', lesson_index: 1, title: 'CRM Setup and Facebook Integration', video_duration_minutes: 16 },
          { id: 'lesson-6-2', lesson_index: 2, title: 'Lead Capture Automation', video_duration_minutes: 14 },
          { id: 'lesson-6-3', lesson_index: 3, title: 'Customer Referral Engine Setup', video_duration_minutes: 13 },
          { id: 'lesson-6-4', lesson_index: 4, title: 'Deal Tracking and Pipeline Management', video_duration_minutes: 12 }
        ]
      },
      {
        id: '56',
        module_index: 7,
        title: 'Scaling Without Burning Out',
        description: 'Grow revenue without working more hours.',
        lessons: [
          { id: 'lesson-7-1', lesson_index: 1, title: 'The Rule of 10 (When to Hire Help)', video_duration_minutes: 14 },
          { id: 'lesson-7-2', lesson_index: 2, title: 'Metrics That Matter: Revenue Per Engaged Follower', video_duration_minutes: 18 },
          { id: 'lesson-7-3', lesson_index: 3, title: 'Batch Content Creation System', video_duration_minutes: 13 },
          { id: 'lesson-7-4', lesson_index: 4, title: 'Delegation and VA Management', video_duration_minutes: 12 }
        ]
      },
      {
        id: '57',
        module_index: 8,
        title: 'Launch Your Money Machine',
        description: 'Your 30-day action plan to first sales.',
        lessons: [
          { id: 'lesson-8-1', lesson_index: 1, title: '30-Day Monetization Launch Plan', video_duration_minutes: 20 },
          { id: 'lesson-8-2', lesson_index: 2, title: 'Week 1-4 Milestones and Metrics', video_duration_minutes: 15 },
          { id: 'lesson-8-3', lesson_index: 3, title: 'Troubleshooting Common Issues', video_duration_minutes: 12 },
          { id: 'lesson-8-4', lesson_index: 4, title: 'Certification Exam Preparation', video_duration_minutes: 10 }
        ]
      }
    ]
  }
};
