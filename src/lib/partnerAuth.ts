/**
 * Partner authentication utilities for API endpoints
 */

import { supabase } from './supabase';

export interface PartnerAuthResult {
  partnerId: string;
  userId: string;
}

/**
 * Verify user is authenticated and get their partner ID
 * @returns Partner ID and user ID
 * @throws Error if not authenticated or not a partner
 */
export async function requirePartner(): Promise<PartnerAuthResult> {
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Authentication required');
  }

  // Look up partner record by user_id
  const { data: partner, error: partnerError } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (partnerError || !partner) {
    throw new Error('Partner account not found');
  }

  return {
    partnerId: partner.id,
    userId: user.id,
  };
}

/**
 * Check if current user is a partner (without throwing)
 * @returns Partner info or null if not authenticated/not a partner
 */
export async function getPartnerIfExists(): Promise<PartnerAuthResult | null> {
  try {
    return await requirePartner();
  } catch {
    return null;
  }
}
