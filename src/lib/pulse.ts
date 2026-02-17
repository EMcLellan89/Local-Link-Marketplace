/**
 * LOCAL-LINK PULSE™ - Core Library
 *
 * Provides helper functions for Pulse features:
 * - Feed algorithm and sorting
 * - Points calculation and management
 * - Claims tracking
 * - Leaderboard calculations
 * - Boost management
 * - Performance subscriptions
 */

import { supabase } from './supabase';

// =============================================================================
// TYPES
// =============================================================================

export interface PulseDeal {
  id: string;
  merchant_id: string;
  title: string;
  short_description?: string;
  description?: string;
  original_value_cents: number;
  price_cents: number;
  boost_type: 'none' | 'standard_7day' | 'flash_friday' | 'homepage_featured' | 'push_blast';
  boost_expires_at?: string;
  view_count: number;
  claim_count: number;
  city?: string;
  flash_friday_eligible: boolean;
  image_url?: string;
  end_at?: string;
  status: string;
  merchants?: {
    business_name: string;
    city?: string;
  };
}

export interface PulseCity {
  id: string;
  name: string;
  state: string;
  status: 'pilot' | 'public' | 'inactive';
  merchant_count: number;
  active_deal_count: number;
}

export interface PulsePoints {
  balance: number;
  lifetime: number;
  recent: Array<{
    action: string;
    points: number;
    description: string;
    created_at: string;
  }>;
}

export interface PulseLeaderboard {
  rank: number;
  customer_id: string;
  points: number;
  customer?: {
    first_name?: string;
    last_name?: string;
  };
}

// =============================================================================
// FEED ALGORITHM
// =============================================================================

/**
 * Calculate feed score for a deal based on revenue potential, boosts, and engagement
 */
export function calculateFeedScore(deal: PulseDeal): number {
  // Base score: revenue potential (price * expected conversion)
  const baseScore = deal.price_cents * 0.1; // Assume 10% conversion

  // Boost multiplier
  const boostMultipliers = {
    none: 1.0,
    standard_7day: 5.0,
    flash_friday: 10.0,
    homepage_featured: 15.0,
    push_blast: 20.0,
  };
  const boostMultiplier = boostMultipliers[deal.boost_type] || 1.0;

  // Recency score (newer deals get slight boost)
  const hoursOld = deal.end_at
    ? (new Date(deal.end_at).getTime() - Date.now()) / (1000 * 60 * 60)
    : 168; // Default 7 days
  const recencyScore = Math.max(0.5, Math.min(2.0, hoursOld / 168));

  // Engagement score (views, claims)
  const engagementScore = (deal.view_count * 0.1 + deal.claim_count * 10);

  return baseScore * boostMultiplier * recencyScore + engagementScore;
}

/**
 * Get Pulse feed for a city with revenue-weighted sorting
 */
export async function getPulseFeed(city?: string, limit = 50) {
  let query = supabase
    .from('deals')
    .select(`
      *,
      merchants!inner(business_name, city)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (city) {
    query = query.eq('city', city);
  }

  const { data: deals, error } = await query;

  if (error) throw error;
  if (!deals) return [];

  // Calculate scores and sort
  const scoredDeals = (deals as any[]).map((deal) => ({
    ...deal,
    _feedScore: calculateFeedScore(deal as PulseDeal),
  }));

  scoredDeals.sort((a, b) => b._feedScore - a._feedScore);

  return scoredDeals;
}

/**
 * Get Flash Friday deals (special Friday section)
 */
export async function getFlashFridayDeals(city?: string) {
  const today = new Date().getDay();
  const isFriday = today === 5;

  if (!isFriday) return [];

  let query = supabase
    .from('deals')
    .select(`
      *,
      merchants!inner(business_name, city)
    `)
    .eq('status', 'active')
    .eq('flash_friday_eligible', true)
    .order('boost_type', { ascending: false })
    .limit(20);

  if (city) {
    query = query.eq('city', city);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data || [];
}

// =============================================================================
// POINTS SYSTEM
// =============================================================================

/**
 * Award points to a customer
 */
export async function awardPoints(
  customerId: string,
  action: string,
  points: number,
  description: string,
  referenceId?: string,
  referenceType?: string
) {
  // Insert point record
  const { error: pointError } = await supabase.from('pulse_points').insert({
    customer_id: customerId,
    action,
    points,
    description,
    reference_id: referenceId,
    reference_type: referenceType,
  });

  if (pointError) throw pointError;

  // Update customer balance
  const { error: updateError } = await supabase.rpc('update_customer_points', {
    p_customer_id: customerId,
    p_points: points,
  });

  if (updateError) {
    // If function doesn't exist, update manually
    const { data: customer } = await supabase
      .from('customers')
      .select('points_balance, lifetime_points')
      .eq('id', customerId)
      .single();

    if (customer) {
      await supabase
        .from('customers')
        .update({
          points_balance: (customer.points_balance || 0) + points,
          lifetime_points: (customer.lifetime_points || 0) + Math.max(0, points),
        })
        .eq('id', customerId);
    }
  }

  return { success: true };
}

/**
 * Get points balance for a customer
 */
export async function getPointsBalance(customerId: string): Promise<PulsePoints> {
  const { data: customer } = await supabase
    .from('customers')
    .select('points_balance, lifetime_points')
    .eq('id', customerId)
    .single();

  const { data: recent } = await supabase
    .from('pulse_points')
    .select('action, points, description, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    balance: customer?.points_balance || 0,
    lifetime: customer?.lifetime_points || 0,
    recent: recent || [],
  };
}

// =============================================================================
// CLAIMS SYSTEM
// =============================================================================

/**
 * Claim a deal (no purchase required)
 */
export async function claimDeal(customerId: string, dealId: string) {
  const pointsPerClaim = 10;

  // Insert claim
  const { data: claim, error } = await supabase
    .from('pulse_claims')
    .insert({
      customer_id: customerId,
      deal_id: dealId,
      points_awarded: pointsPerClaim,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      // Already claimed today
      return { success: false, message: 'Already claimed today' };
    }
    throw error;
  }

  // Award points
  await awardPoints(
    customerId,
    'claim_deal',
    pointsPerClaim,
    'Claimed deal',
    dealId,
    'deal'
  );

  // Increment deal claim count
  await supabase.rpc('increment_deal_claims', { deal_id: dealId });

  return { success: true, claim };
}

/**
 * Check if user has claimed a deal today
 */
export async function hasClaimedToday(customerId: string, dealId: string) {
  const { data } = await supabase
    .from('pulse_claims')
    .select('id')
    .eq('customer_id', customerId)
    .eq('deal_id', dealId)
    .eq('claimed_date', new Date().toISOString().split('T')[0])
    .maybeSingle();

  return !!data;
}

// =============================================================================
// LEADERBOARD
// =============================================================================

/**
 * Get leaderboard for a city
 */
export async function getCityLeaderboard(
  city: string,
  type: 'city_monthly' | 'national_quarterly' | 'lifetime' = 'city_monthly',
  limit = 100
): Promise<PulseLeaderboard[]> {
  const { data, error } = await supabase
    .from('pulse_leaderboards')
    .select(`
      rank,
      customer_id,
      points,
      customers:customer_id(first_name, last_name)
    `)
    .eq('city', city)
    .eq('leaderboard_type', type)
    .order('rank', { ascending: true })
    .limit(limit);

  if (error) throw error;

  return (data || []).map((row: any) => ({
    rank: row.rank,
    customer_id: row.customer_id,
    points: row.points,
    customer: row.customers,
  }));
}

/**
 * Get user's leaderboard position
 */
export async function getUserLeaderboardPosition(
  customerId: string,
  city: string,
  type: 'city_monthly' | 'national_quarterly' | 'lifetime' = 'city_monthly'
) {
  const { data } = await supabase
    .from('pulse_leaderboards')
    .select('rank, points')
    .eq('customer_id', customerId)
    .eq('city', city)
    .eq('leaderboard_type', type)
    .maybeSingle();

  return data;
}

// =============================================================================
// CITIES
// =============================================================================

/**
 * Get all active Pulse cities
 */
export async function getActiveCities() {
  const { data, error } = await supabase
    .from('pulse_cities')
    .select('*')
    .in('status', ['pilot', 'public'])
    .order('name');

  if (error) throw error;
  return data || [];
}

/**
 * Detect user's city from IP (placeholder - implement with IP geolocation service)
 */
export async function detectUserCity(): Promise<string | null> {
  // TODO: Implement IP geolocation
  // For now, default to Pepperell for pilot
  return 'Pepperell';
}

// =============================================================================
// BOOSTS
// =============================================================================

/**
 * Get boost pricing
 */
export const BOOST_PRICING = {
  standard_7day: 2900, // $29
  flash_friday: 4900, // $49
  homepage_featured: 9900, // $99
  push_blast: 14900, // $149
};

/**
 * Check if merchant can purchase a boost
 */
export async function canPurchaseBoost(merchantId: string, dealId: string) {
  // Check if deal exists and belongs to merchant
  const { data: deal } = await supabase
    .from('deals')
    .select('id, merchant_id, boost_type, boost_expires_at')
    .eq('id', dealId)
    .eq('merchant_id', merchantId)
    .single();

  if (!deal) {
    return { can: false, reason: 'Deal not found' };
  }

  // Check if already boosted
  if (deal.boost_type !== 'none' && deal.boost_expires_at) {
    const expiry = new Date(deal.boost_expires_at);
    if (expiry > new Date()) {
      return { can: false, reason: 'Deal already boosted' };
    }
  }

  return { can: true };
}

// =============================================================================
// PERFORMANCE SUBSCRIPTIONS
// =============================================================================

export const PERFORMANCE_PRICING = {
  performance_standard: 19900, // $199/mo
  performance_partner: 14900, // $149/mo (partner rate)
};

/**
 * Check if merchant has active Performance subscription
 */
export async function hasPerformanceSubscription(merchantId: string) {
  const { data } = await supabase
    .from('pulse_performance_subscriptions')
    .select('id, status, minimum_term_end')
    .eq('merchant_id', merchantId)
    .eq('status', 'active')
    .maybeSingle();

  return !!data;
}

// =============================================================================
// MILESTONES
// =============================================================================

/**
 * Get merchant milestones and progress
 */
export async function getMerchantMilestones(merchantId: string) {
  const { data: milestones } = await supabase
    .from('pulse_milestones')
    .select('*')
    .eq('is_active', true);

  const { data: progress } = await supabase
    .from('pulse_milestone_progress')
    .select('*')
    .eq('merchant_id', merchantId);

  const progressMap = new Map(progress?.map((p) => [p.milestone_id, p]) || []);

  return (milestones || []).map((milestone) => ({
    ...milestone,
    progress: progressMap.get(milestone.id) || {
      current_value: 0,
      completed: false,
    },
  }));
}

// =============================================================================
// REFERRALS
// =============================================================================

/**
 * Generate unique referral code for customer
 */
export async function generateReferralCode(customerId: string) {
  const { data: customer } = await supabase
    .from('customers')
    .select('referral_code, first_name, last_name')
    .eq('id', customerId)
    .single();

  if (customer?.referral_code) {
    return customer.referral_code;
  }

  // Generate code: FIRSTNAME + 4 random chars
  const firstName = customer?.first_name || 'USER';
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `${firstName.toUpperCase().substring(0, 6)}${random}`;

  // Update customer
  await supabase
    .from('customers')
    .update({ referral_code: code })
    .eq('id', customerId);

  return code;
}

/**
 * Track referral click
 */
export async function trackReferralClick(referralCode: string) {
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('referral_code', referralCode)
    .single();

  if (!customer) return { success: false };

  await supabase.from('pulse_referrals').insert({
    referrer_id: customer.id,
    referral_code: referralCode,
    clicked_at: new Date().toISOString(),
  });

  return { success: true, referrerId: customer.id };
}

// =============================================================================
// BADGES
// =============================================================================

/**
 * Get customer badges
 */
export async function getCustomerBadges(customerId: string) {
  const { data } = await supabase
    .from('pulse_user_badges')
    .select(`
      awarded_at,
      pulse_badges(*)
    `)
    .eq('customer_id', customerId)
    .order('awarded_at', { ascending: false });

  return data || [];
}

/**
 * Check and award badges based on achievements
 */
export async function checkAndAwardBadges(customerId: string) {
  const { data: customer } = await supabase
    .from('customers')
    .select('lifetime_points')
    .eq('id', customerId)
    .single();

  if (!customer) return;

  const points = customer.lifetime_points || 0;

  // Get all badges
  const { data: badges } = await supabase
    .from('pulse_badges')
    .select('id, points_required')
    .eq('is_active', true);

  // Get already awarded badges
  const { data: awarded } = await supabase
    .from('pulse_user_badges')
    .select('badge_id')
    .eq('customer_id', customerId);

  const awardedIds = new Set(awarded?.map((a) => a.badge_id) || []);

  // Award new badges
  for (const badge of badges || []) {
    if (!awardedIds.has(badge.id) && points >= (badge.points_required || 0)) {
      await supabase.from('pulse_user_badges').insert({
        customer_id: customerId,
        badge_id: badge.id,
      });
    }
  }
}
