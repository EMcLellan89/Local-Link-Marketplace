import { supabase } from './supabase';

export interface TrackingLink {
  id: string;
  partner_id: string;
  product_slug: string;
  slug: string;
  created_at: string;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  criteria_type: string;
  criteria_value: number;
}

export interface BadgeAward {
  id: string;
  partner_id: string;
  badge_id: string;
  awarded_at: string;
  badge?: Badge;
}

export interface Notification {
  id: string;
  partner_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'badge_earned';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export async function getOrCreateTrackingLink(
  partnerId: string,
  productSlug: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('get_or_create_tracking_link', {
      p_partner_id: partnerId,
      p_product_slug: productSlug
    });

    if (error) throw error;
    return data as string;
  } catch (error) {
    console.error('Error getting tracking link:', error);
    return null;
  }
}

export async function getPartnerTrackingLinks(
  partnerId: string
): Promise<TrackingLink[]> {
  try {
    const { data, error } = await supabase
      .from('partner_tracking_links')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading tracking links:', error);
    return [];
  }
}

export async function getPartnerBadges(partnerId: string): Promise<BadgeAward[]> {
  try {
    const { data, error } = await supabase
      .from('partner_badge_awards')
      .select(`
        *,
        badge:partner_badges(*)
      `)
      .eq('partner_id', partnerId)
      .order('awarded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading badges:', error);
    return [];
  }
}

export async function getAllBadges(): Promise<Badge[]> {
  try {
    const { data, error } = await supabase
      .from('partner_badges')
      .select('*')
      .order('criteria_value', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading all badges:', error);
    return [];
  }
}

export async function getPartnerNotifications(
  partnerId: string,
  unreadOnly: boolean = false
): Promise<Notification[]> {
  try {
    let query = supabase
      .from('partner_notifications')
      .select('*')
      .eq('partner_id', partnerId);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('partner_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification read:', error);
    return false;
  }
}

export async function markAllNotificationsRead(partnerId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('partner_notifications')
      .update({ is_read: true })
      .eq('partner_id', partnerId)
      .eq('is_read', false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    return false;
  }
}

export function buildTrackingUrl(
  baseUrl: string,
  trackingSlug: string
): string {
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('ref', trackingSlug);
  return url.toString();
}

export function buildFullTrackingUrl(
  productSlug: string,
  trackingSlug: string
): string {
  const baseUrl = `${window.location.origin}/merchant/done-for-you/${productSlug}`;
  return buildTrackingUrl(baseUrl, trackingSlug);
}

export async function checkAndAwardBadges(partnerId: string): Promise<void> {
  try {
    await supabase.rpc('check_and_award_badges', {
      p_partner_id: partnerId
    });
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}

export interface MergedDayContent {
  day: number;
  title: string;
  hook: string;
  caption: string;
  fullPost: string;
  trackingUrl: string;
  tip: string;
}

export async function buildDayCaptions(
  partnerId: string,
  productSlug: string,
  dailyPrompts: Array<{
    day: number;
    title: string;
    post: string;
    cta: string;
    tip: string;
  }>
): Promise<MergedDayContent[]> {
  const trackingSlug = await getOrCreateTrackingLink(partnerId, productSlug);

  if (!trackingSlug) {
    return dailyPrompts.map(prompt => ({
      day: prompt.day,
      title: prompt.title,
      hook: prompt.post,
      caption: prompt.cta,
      fullPost: `${prompt.post}\n\n${prompt.cta}`,
      trackingUrl: '',
      tip: prompt.tip
    }));
  }

  const trackingUrl = buildFullTrackingUrl(productSlug, trackingSlug);

  return dailyPrompts.map(prompt => ({
    day: prompt.day,
    title: prompt.title,
    hook: prompt.post,
    caption: prompt.cta,
    fullPost: `${prompt.post}\n\n${prompt.cta}\n\n${trackingUrl}`,
    trackingUrl,
    tip: prompt.tip
  }));
}
