import { supabase } from './supabase';

export interface CourseAccessInfo {
  hasAccess: boolean;
  tier: 'core' | 'accelerator' | 'dfy' | null;
  isEnrolled: boolean;
}

/**
 * Check if user has access to the Blog Growth System course
 * and return their tier level
 */
export async function checkBlogCourseAccess(userId: string): Promise<CourseAccessInfo> {
  try {
    // Check enrollment status
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('status, course_id')
      .eq('user_id', userId)
      .eq('course_id', (
        await supabase
          .from('courses')
          .select('id')
          .eq('slug', 'blog-growth-system')
          .maybeSingle()
      )?.data?.id || '')
      .maybeSingle();

    if (!enrollment) {
      return { hasAccess: false, tier: null, isEnrolled: false };
    }

    // Get user's highest tier by checking their orders
    const { data: orders } = await supabase
      .from('marketplace_orders')
      .select(`
        id,
        status,
        marketplace_products (
          slug,
          name
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'paid')
      .in('marketplace_products.slug', [
        'blog-growth-self-implement',
        'blog-growth-accelerator',
        'blog-growth-dfy'
      ]);

    if (!orders || orders.length === 0) {
      return { hasAccess: false, tier: null, isEnrolled: true };
    }

    // Determine highest tier
    const productSlugs = orders
      .map(o => (o as any).marketplace_products?.slug)
      .filter(Boolean);

    let tier: 'core' | 'accelerator' | 'dfy' | null = null;

    if (productSlugs.includes('blog-growth-dfy')) {
      tier = 'dfy';
    } else if (productSlugs.includes('blog-growth-accelerator')) {
      tier = 'accelerator';
    } else if (productSlugs.includes('blog-growth-self-implement')) {
      tier = 'core';
    }

    return {
      hasAccess: tier !== null,
      tier,
      isEnrolled: true
    };
  } catch (error) {
    console.error('Error checking blog course access:', error);
    return { hasAccess: false, tier: null, isEnrolled: false };
  }
}

/**
 * Get tier-specific features for the Blog Growth System
 */
export function getTierFeatures(tier: 'core' | 'accelerator' | 'dfy' | null) {
  const features = {
    core: {
      name: 'Self-Implement',
      canAccessCourse: true,
      canAccessTemplates: false,
      canAccessPartnerNetwork: false,
      canRequestDFY: false,
      canAccessJobBoard: false,
      features: [
        'Full 8-Module Blog Growth System',
        'Step-by-step blog writing training',
        'AI prompt frameworks',
        'Distribution & ROI tracking',
        'Lifetime access to updates',
        'Merchant Blog Certification'
      ]
    },
    accelerator: {
      name: 'Implementation Accelerator',
      canAccessCourse: true,
      canAccessTemplates: true,
      canAccessPartnerNetwork: true,
      canRequestDFY: false,
      canAccessJobBoard: true,
      features: [
        'Everything in Self-Implement',
        'Blog topic plan (12 months)',
        'Writing templates + checklists',
        'Partner hiring guidance',
        'Priority job posting in Local-Link',
        'Verified Merchant badge',
        'Direct implementation support'
      ]
    },
    dfy: {
      name: 'Done-For-You Path',
      canAccessCourse: true,
      canAccessTemplates: true,
      canAccessPartnerNetwork: true,
      canRequestDFY: true,
      canAccessJobBoard: true,
      features: [
        'Everything in Accelerator',
        'Blog strategy & complete setup',
        'DFY blog execution via vetted partners',
        'Monthly performance reporting',
        'Content management oversight',
        'Dedicated account manager'
      ]
    }
  };

  return tier ? features[tier] : null;
}

/**
 * Check if user can access a specific lesson based on their tier
 */
export function canAccessLesson(
  tier: 'core' | 'accelerator' | 'dfy' | null,
  lessonIndex: number
): boolean {
  // All tiers can access all course lessons
  // Tier restrictions apply to additional resources, not lessons
  return tier !== null;
}
