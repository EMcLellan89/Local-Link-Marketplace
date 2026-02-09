import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { dealId } = await req.json();

    if (!dealId) {
      throw new Error('Deal ID is required');
    }

    // Get deal details
    const { data: deal, error: dealError } = await supabaseAdmin
      .from('business_deals')
      .select('*, vendor:vendors(*)')
      .eq('id', dealId)
      .single();

    if (dealError || !deal) {
      throw new Error('Deal not found');
    }

    // Generate guide content based on deal category
    const guideContent = generateGuideContent(deal);

    // Check if guide already exists
    const guideSlug = `how-to-use-${deal.slug}`;
    const { data: existingGuide } = await supabaseAdmin
      .from('growth_guides')
      .select('id')
      .eq('slug', guideSlug)
      .single();

    if (existingGuide) {
      // Update existing guide
      await supabaseAdmin
        .from('growth_guides')
        .update({
          title: guideContent.title,
          description: guideContent.description,
          content: guideContent.content,
          related_deal_ids: [dealId],
          updated_at: new Date().toISOString()
        })
        .eq('id', existingGuide.id);

      return new Response(
        JSON.stringify({
          success: true,
          guide_id: existingGuide.id,
          message: 'Guide updated successfully'
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      // Create new guide
      const { data: newGuide, error: insertError } = await supabaseAdmin
        .from('growth_guides')
        .insert({
          title: guideContent.title,
          slug: guideSlug,
          category: getCategoryName(deal.category),
          description: guideContent.description,
          content: guideContent.content,
          related_deal_ids: [dealId],
          thumbnail_url: deal.image_url,
          author: 'Local-Link AI',
          read_time_minutes: guideContent.read_time_minutes,
          status: 'published',
          published_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          guide_id: newGuide.id,
          message: 'Guide created successfully'
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error generating guide:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'marketing_ads': 'Marketing',
    'ai_automation': 'Automation',
    'crm_sms': 'CRM & Sales',
    'web_hosting': 'Web & Tech',
    'reviews_reputation': 'Reviews & Reputation',
    'analytics': 'Analytics',
    'design_video': 'Design & Creative',
    'operations': 'Operations',
    'accounting': 'Accounting',
    'hr_payroll': 'HR & Payroll',
    'ecommerce': 'E-commerce'
  };
  return categoryMap[category] || 'Business Growth';
}

function generateGuideContent(deal: any) {
  const vendorName = deal.vendor?.name || 'this tool';
  const title = `How to Use ${vendorName} to Grow Your Local Business`;
  const description = `A complete guide to getting started with ${vendorName} and maximizing your ROI. Learn setup, best practices, and proven strategies.`;

  let content = `# ${title}

## Introduction

${deal.description || `${vendorName} is a powerful tool for local businesses looking to grow.`}

This guide will walk you through everything you need to know to get started and see results fast.

---

## Why ${vendorName}?

`;

  // Add features as benefits
  if (deal.features && deal.features.length > 0) {
    deal.features.forEach((feature: string) => {
      content += `- **${feature}**: Perfect for local businesses looking to scale efficiently\n`;
    });
  }

  content += `

---

## Getting Started

### Step 1: Sign Up & Setup

1. Click the deal link above to get your exclusive discount
2. Create your account using your business email
3. Complete the onboarding wizard
4. Connect your existing tools (if applicable)

### Step 2: Initial Configuration

`;

  // Category-specific setup instructions
  if (deal.category === 'crm_sms') {
    content += `
- Import your existing contacts
- Set up your sales pipeline stages
- Configure your email signature
- Connect your phone number for SMS
- Create your first automation workflow
`;
  } else if (deal.category === 'marketing_ads') {
    content += `
- Connect your social media accounts
- Set up tracking pixels
- Define your target audience
- Create your first campaign
- Set your budget and schedule
`;
  } else if (deal.category === 'reviews_reputation') {
    content += `
- Claim your business listings
- Connect review platforms (Google, Yelp, Facebook)
- Set up automated review requests
- Configure notification alerts
- Create response templates
`;
  } else {
    content += `
- Complete your business profile
- Configure your preferences
- Connect integrations
- Set up your team (if applicable)
- Run through the tutorial
`;
  }

  content += `

### Step 3: Launch Your First Campaign

Now that you're set up, it's time to see results:

1. **Define Your Goal**: What do you want to achieve? (More leads, reviews, sales, etc.)
2. **Create Your Campaign**: Use templates to get started quickly
3. **Test Before Scaling**: Start small and measure results
4. **Optimize**: Review analytics and adjust based on performance

---

## Best Practices for Local Businesses

### Do's:
- Start with one clear goal
- Use templates and proven strategies
- Monitor your analytics weekly
- Respond to all customer interactions
- Keep your information up to date

### Don'ts:
- Don't try to do everything at once
- Don't ignore negative feedback
- Don't set and forget - optimization is key
- Don't skip the training resources
- Don't compare yourself to enterprise businesses

---

## Advanced Tips

Once you've mastered the basics, try these advanced strategies:

1. **Automation**: Set up workflows to save time on repetitive tasks
2. **Segmentation**: Target different customer groups with personalized messages
3. **A/B Testing**: Test different approaches to see what works best
4. **Integration**: Connect with your other tools for seamless operations
5. **Analytics**: Dive deep into data to find opportunities

---

## Measuring Success

Track these key metrics:

`;

  if (deal.category === 'crm_sms') {
    content += `
- **Lead Conversion Rate**: % of leads that become customers
- **Response Time**: How quickly you follow up
- **Pipeline Value**: Total value of deals in progress
- **Customer Lifetime Value**: Average revenue per customer
`;
  } else if (deal.category === 'reviews_reputation') {
    content += `
- **Average Star Rating**: Your overall rating across platforms
- **Review Velocity**: New reviews per month
- **Response Rate**: % of reviews you respond to
- **Sentiment Score**: Positive vs negative feedback ratio
`;
  } else {
    content += `
- **ROI**: Return on investment
- **Engagement Rate**: How customers interact with your content
- **Conversion Rate**: % of visitors who take action
- **Growth Rate**: Month-over-month improvement
`;
  }

  content += `

---

## Troubleshooting Common Issues

**Issue**: Not seeing results?
- **Solution**: Give it at least 30 days and ensure you're following best practices

**Issue**: Too complicated to use?
- **Solution**: Start with just one feature and master it before expanding

**Issue**: Expensive?
- **Solution**: Use this exclusive deal to get started at a discount, then scale as you see ROI

---

## Next Steps

Ready to get started? Click the link below to claim your exclusive Local-Link deal:

👉 [Get ${vendorName} Now](#)

**Questions?** Check out our community forum or contact support for help.

---

## Related Resources

- [${vendorName} Official Documentation](${deal.vendor?.website || '#'})
- [Local Business Growth Strategies](/marketplace/growth-guides)
- [Customer Success Stories](/marketplace/case-studies)

`;

  return {
    title,
    description,
    content,
    read_time_minutes: Math.ceil(content.length / 1000)
  };
}
