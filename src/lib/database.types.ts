export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'customer' | 'merchant' | 'admin'
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'customer' | 'merchant' | 'admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'customer' | 'merchant' | 'admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      merchants: {
        Row: {
          id: string
          user_id: string
          business_name: string
          slug: string
          description: string | null
          category_id: string | null
          website_url: string | null
          phone: string | null
          email: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string
          latitude: number | null
          longitude: number | null
          status: 'pending' | 'approved' | 'rejected' | 'suspended'
          subscription_plan: string
          stripe_connect_id: string | null
          commission_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          slug: string
          description?: string | null
          category_id?: string | null
          website_url?: string | null
          phone?: string | null
          email?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          latitude?: number | null
          longitude?: number | null
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          subscription_plan?: string
          stripe_connect_id?: string | null
          commission_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          slug?: string
          description?: string | null
          category_id?: string | null
          website_url?: string | null
          phone?: string | null
          email?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          latitude?: number | null
          longitude?: number | null
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          subscription_plan?: string
          stripe_connect_id?: string | null
          commission_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          default_city: string | null
          default_postal_code: string | null
          loyalty_points: number
          is_premium: boolean
          premium_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          default_city?: string | null
          default_postal_code?: string | null
          loyalty_points?: number
          is_premium?: boolean
          premium_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          default_city?: string | null
          default_postal_code?: string | null
          loyalty_points?: number
          is_premium?: boolean
          premium_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          merchant_id: string
          title: string
          slug: string
          short_description: string | null
          description: string | null
          original_value_cents: number
          price_cents: number
          commission_rate: number
          max_quantity: number | null
          quantity_sold: number
          per_customer_limit: number | null
          start_at: string
          end_at: string | null
          status: 'draft' | 'pending_approval' | 'active' | 'paused' | 'expired' | 'rejected'
          redemption_instructions: string | null
          image_url: string | null
          featured_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          title: string
          slug: string
          short_description?: string | null
          description?: string | null
          original_value_cents: number
          price_cents: number
          commission_rate?: number
          max_quantity?: number | null
          quantity_sold?: number
          per_customer_limit?: number | null
          start_at?: string
          end_at?: string | null
          status?: 'draft' | 'pending_approval' | 'active' | 'paused' | 'expired' | 'rejected'
          redemption_instructions?: string | null
          image_url?: string | null
          featured_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          title?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          original_value_cents?: number
          price_cents?: number
          commission_rate?: number
          max_quantity?: number | null
          quantity_sold?: number
          per_customer_limit?: number | null
          start_at?: string
          end_at?: string | null
          status?: 'draft' | 'pending_approval' | 'active' | 'paused' | 'expired' | 'rejected'
          redemption_instructions?: string | null
          image_url?: string | null
          featured_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          customer_id: string
          deal_id: string
          stripe_payment_id: string | null
          quantity: number
          amount_paid_cents: number
          commission_cents: number
          merchant_payout_cents: number
          status: 'pending' | 'paid' | 'refunded' | 'partially_refunded'
          purchased_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          deal_id: string
          stripe_payment_id?: string | null
          quantity?: number
          amount_paid_cents: number
          commission_cents: number
          merchant_payout_cents: number
          status?: 'pending' | 'paid' | 'refunded' | 'partially_refunded'
          purchased_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          deal_id?: string
          stripe_payment_id?: string | null
          quantity?: number
          amount_paid_cents?: number
          commission_cents?: number
          merchant_payout_cents?: number
          status?: 'pending' | 'paid' | 'refunded' | 'partially_refunded'
          purchased_at?: string
        }
      }
      redemptions: {
        Row: {
          id: string
          purchase_id: string
          redeemed_at: string
          redeemed_by: string | null
          channel: string
          notes: string | null
        }
        Insert: {
          id?: string
          purchase_id: string
          redeemed_at?: string
          redeemed_by?: string | null
          channel?: string
          notes?: string | null
        }
        Update: {
          id?: string
          purchase_id?: string
          redeemed_at?: string
          redeemed_by?: string | null
          channel?: string
          notes?: string | null
        }
      }
      payouts: {
        Row: {
          id: string
          merchant_id: string
          amount_cents: number
          status: 'pending' | 'processing' | 'paid' | 'failed'
          stripe_payout_id: string | null
          period_start: string | null
          period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          amount_cents: number
          status?: 'pending' | 'processing' | 'paid' | 'failed'
          stripe_payout_id?: string | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          amount_cents?: number
          status?: 'pending' | 'processing' | 'paid' | 'failed'
          stripe_payout_id?: string | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_events: {
        Row: {
          id: string
          customer_id: string
          source: string
          points: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          source: string
          points: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          source?: string
          points?: number
          description?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'merchant' | 'admin'
      merchant_status: 'pending' | 'approved' | 'rejected' | 'suspended'
      deal_status: 'draft' | 'pending_approval' | 'active' | 'paused' | 'expired' | 'rejected'
      purchase_status: 'pending' | 'paid' | 'refunded' | 'partially_refunded'
      payout_status: 'pending' | 'processing' | 'paid' | 'failed'
    }
  }
}
