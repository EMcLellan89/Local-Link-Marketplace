import { supabase } from './supabase';

export interface UsageLimit {
  tier_type: 'merchant' | 'partner';
  tier_slug: string;
  limit_key: string;
  limit_value: number;
  limit_type: 'hard' | 'soft';
  description: string;
}

export interface UsageTracking {
  user_type: 'merchant' | 'partner';
  user_id: string;
  usage_key: string;
  current_value: number;
  period_start: string;
  period_end: string;
}

export async function getUsageLimit(
  tierType: 'merchant' | 'partner',
  tierSlug: string,
  limitKey: string
): Promise<UsageLimit | null> {
  const { data, error } = await supabase
    .from('usage_limits')
    .select('*')
    .eq('tier_type', tierType)
    .eq('tier_slug', tierSlug)
    .eq('limit_key', limitKey)
    .maybeSingle();

  if (error) {
    console.error('Error fetching usage limit:', error);
    return null;
  }

  return data;
}

export async function getCurrentUsage(
  userType: 'merchant' | 'partner',
  userId: string,
  usageKey: string
): Promise<number> {
  const today = new Date();
  const periodStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const { data, error } = await supabase
    .from('usage_tracking')
    .select('current_value')
    .eq('user_type', userType)
    .eq('user_id', userId)
    .eq('usage_key', usageKey)
    .gte('period_start', periodStart.toISOString().split('T')[0])
    .lte('period_end', periodEnd.toISOString().split('T')[0])
    .maybeSingle();

  if (error) {
    console.error('Error fetching current usage:', error);
    return 0;
  }

  return (data as any)?.current_value || 0;
}

export async function incrementUsage(
  userType: 'merchant' | 'partner',
  userId: string,
  usageKey: string,
  amount: number = 1
): Promise<boolean> {
  const today = new Date();
  const periodStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const { data: existing, error: fetchError } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_type', userType)
    .eq('user_id', userId)
    .eq('usage_key', usageKey)
    .gte('period_start', periodStart.toISOString().split('T')[0])
    .lte('period_end', periodEnd.toISOString().split('T')[0])
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking usage:', fetchError);
    return false;
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('usage_tracking')
      .update({
        current_value: (existing as any).current_value + amount,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', (existing as any).id);

    if (updateError) {
      console.error('Error updating usage:', updateError);
      return false;
    }
  } else {
    const { error: insertError } = await supabase
      .from('usage_tracking')
      .insert({
        user_type: userType,
        user_id: userId,
        usage_key: usageKey,
        current_value: amount,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0]
      } as any);

    if (insertError) {
      console.error('Error creating usage tracking:', insertError);
      return false;
    }
  }

  return true;
}

export async function decrementUsage(
  userType: 'merchant' | 'partner',
  userId: string,
  usageKey: string,
  amount: number = 1
): Promise<boolean> {
  const today = new Date();
  const periodStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const { data: existing, error: fetchError } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_type', userType)
    .eq('user_id', userId)
    .eq('usage_key', usageKey)
    .gte('period_start', periodStart.toISOString().split('T')[0])
    .lte('period_end', periodEnd.toISOString().split('T')[0])
    .maybeSingle();

  if (fetchError || !existing) {
    console.error('Error checking usage:', fetchError);
    return false;
  }

  const newValue = Math.max(0, (existing as any).current_value - amount);

  const { error: updateError } = await supabase
    .from('usage_tracking')
    .update({
      current_value: newValue,
      updated_at: new Date().toISOString()
    } as any)
    .eq('id', (existing as any).id);

  if (updateError) {
    console.error('Error decrementing usage:', updateError);
    return false;
  }

  return true;
}

export async function checkLimit(
  userType: 'merchant' | 'partner',
  userId: string,
  tierSlug: string,
  limitKey: string
): Promise<{ allowed: boolean; current: number; limit: number; message?: string }> {
  const limit = await getUsageLimit(userType, tierSlug, limitKey);

  if (!limit) {
    return { allowed: true, current: 0, limit: -1, message: 'No limit configured' };
  }

  if (limit.limit_value === -1) {
    return { allowed: true, current: 0, limit: -1, message: 'Unlimited' };
  }

  const current = await getCurrentUsage(userType, userId, limitKey);

  if (current >= limit.limit_value) {
    const limitType = limit.limit_type === 'hard' ? 'Hard' : 'Soft';
    return {
      allowed: limit.limit_type === 'soft',
      current,
      limit: limit.limit_value,
      message: `${limitType} limit reached (${current}/${limit.limit_value}). ${limit.description}`
    };
  }

  const percentUsed = (current / limit.limit_value) * 100;

  if (percentUsed >= 80) {
    return {
      allowed: true,
      current,
      limit: limit.limit_value,
      message: `Warning: ${percentUsed.toFixed(0)}% of limit used (${current}/${limit.limit_value})`
    };
  }

  return { allowed: true, current, limit: limit.limit_value };
}

export async function getMerchantTier(merchantId: string): Promise<string> {
  const { data: merchant, error } = await supabase
    .from('merchants')
    .select('subscription_plan')
    .eq('id', merchantId)
    .maybeSingle();

  if (error || !merchant) {
    console.error('Error fetching merchant tier:', error);
    return 'starter';
  }

  const plan = (merchant as any).subscription_plan || 'free';

  if (plan === 'free' || plan === 'starter') return 'starter';
  if (plan === 'growth' || plan === 'pro') return 'growth';
  if (plan === 'scale' || plan === 'enterprise') return 'scale';

  return 'starter';
}

export async function getPartnerTier(partnerId: string): Promise<string> {
  const { data: subscription, error } = await supabase
    .from('partner_subscriptions')
    .select(`
      partner_subscription_tiers (
        slug
      )
    `)
    .eq('partner_id', partnerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !subscription) {
    console.error('Error fetching partner tier:', error);
    return 'partner';
  }

  return (subscription as any).partner_subscription_tiers?.slug || 'partner';
}

export async function hasAddon(merchantId: string, featureFlag: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('merchant_addon_subscriptions')
    .select(`
      automation_addons!inner (
        feature_flag
      )
    `)
    .eq('merchant_id', merchantId)
    .eq('status', 'active')
    .eq('automation_addons.feature_flag', featureFlag);

  if (error) {
    console.error('Error checking addon:', error);
    return false;
  }

  return data && data.length > 0;
}

export async function getUsageSummary(
  userType: 'merchant' | 'partner',
  userId: string,
  tierSlug: string
): Promise<{
  [key: string]: {
    current: number;
    limit: number;
    percentUsed: number;
    limitType: 'hard' | 'soft';
    description: string;
  }
}> {
  const { data: limits, error } = await supabase
    .from('usage_limits')
    .select('*')
    .eq('tier_type', userType)
    .eq('tier_slug', tierSlug);

  if (error || !limits) {
    console.error('Error fetching limits:', error);
    return {};
  }

  const summary: any = {};

  for (const limit of limits) {
    const current = await getCurrentUsage(userType, userId, (limit as any).limit_key);
    const percentUsed = (limit as any).limit_value === -1 ? 0 : (current / (limit as any).limit_value) * 100;

    summary[(limit as any).limit_key] = {
      current,
      limit: (limit as any).limit_value,
      percentUsed: Math.min(100, percentUsed),
      limitType: (limit as any).limit_type,
      description: (limit as any).description
    };
  }

  return summary;
}
