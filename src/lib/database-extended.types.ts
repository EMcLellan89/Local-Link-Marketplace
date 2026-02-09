// Extended database types for tables not in the generated types file
// This file provides type safety for database operations

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  password_hash?: string;
  created_at?: string;
}

export interface AdminSession {
  id: string;
  admin_user_id: string;
  token: string;
  expires_at: string;
  created_at?: string;
  admin_users?: AdminUser;
}

export interface Appointment {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_type: string;
  appointment_date: string;
  duration_minutes: number;
  status: string;
  notes: string;
  created_at?: string;
}

export interface PartnerApplication {
  id?: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  partner_type: 'Agency' | 'Publisher' | 'Media' | 'SalesTeam';
  requested_territory: string;
  current_coverage: string | null;
  est_merchants_30d: number | null;
  notes: string | null;
  status: string;
  created_at?: string;
}

export interface PostcardMailing {
  id?: string;
  name: string;
  mail_date: string;
  print_deadline: string;
  total_spots: number;
  spots_filled: number;
  circulation: number;
  status: string;
  cost: number;
  created_at?: string;
}

export interface ProductCommissionRule {
  id?: string;
  name: string;
  type: string;
  stripe_price_id: string | null;
  commission_rate_bp: number;
  active: boolean;
  created_at?: string;
}

export interface UsageTracking {
  id?: string;
  user_type: 'merchant' | 'partner';
  user_id: string;
  usage_key: string;
  current_value: number;
  period_start: string;
  period_end: string;
  created_at?: string;
  updated_at?: string;
}

export interface MerchantSubscription {
  id: string;
  merchant_id: string;
  subscription_plan: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface InAppNudge {
  id: string;
  user_id: string;
  nudge_type: string;
  is_dismissed: boolean;
  dismissed_at: string | null;
  created_at?: string;
}

export interface PartnerAsset {
  id: string;
  partner_id: string;
  asset_type: string;
  file_url: string;
  created_at?: string;
}

export interface UnifiedSale {
  id: string;
  amount_paid_cents: number;
  status: string;
  created_at?: string;
}

export interface PartnerOverride {
  id: string;
  partner_id: string;
  max_active_territories_override: number | null;
  max_open_requests_override: number | null;
  allow_expansion_despite_score: boolean;
  created_at?: string;
}

export interface Partner {
  id: string;
  user_id: string;
  training_completed_percent: number;
  status: string;
  created_at?: string;
}

export interface PartnerSale {
  id: string;
  gross_amount: number;
  created_at?: string;
}

export interface UserEntitlement {
  id: string;
  user_id: string;
  course_id: string | null;
  entitlement_type: string;
  granted_by: string | null;
  expires_at: string | null;
  created_at?: string;
}

export interface MerchantLimit {
  id: string;
  merchant_id: string;
  limit_key: string;
  limit_value: number;
  limit_type: string;
  description: string | null;
  created_at?: string;
}

export interface InternalTeamMember {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  last_login: string | null;
  created_at?: string;
}

// Helper type for database insert operations
export type DBInsert<T> = Omit<T, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// Helper type for database update operations
export type DBUpdate<T> = Partial<Omit<T, 'id' | 'created_at'>> & {
  updated_at?: string;
};
