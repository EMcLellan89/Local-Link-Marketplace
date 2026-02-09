import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type UserRole = 'customer' | 'merchant' | 'admin';
export type MerchantStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type DealStatus = 'draft' | 'pending_approval' | 'active' | 'paused' | 'expired' | 'rejected';
export type PurchaseStatus = 'pending' | 'paid' | 'refunded' | 'partially_refunded';
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';
