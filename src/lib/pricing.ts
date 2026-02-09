import { supabaseAdmin } from "./supabaseAdmin";

export type PricingItemType = "subscription" | "dfy" | "addon" | "print";

export type PricingItem = {
  business_key: string;
  item_key: string;
  item_type: PricingItemType;
  name: string;
  description?: string | null;
  stripe_price_id: string;
  amount_cents: number;
  currency: string;
  meta: any;
};

export async function getPricingItem(params: { business_key: string; item_key: string }): Promise<PricingItem> {
  const { data, error } = await supabaseAdmin
    .from("pricing_items")
    .select("business_key,item_key,item_type,name,description,stripe_price_id,amount_cents,currency,meta")
    .eq("business_key", params.business_key)
    .eq("item_key", params.item_key)
    .eq("is_active", true)
    .single();

  if (error) throw error;
  return data as PricingItem;
}

export async function listPricing(params: { business_key: string }): Promise<PricingItem[]> {
  const { data, error } = await supabaseAdmin
    .from("pricing_items")
    .select("business_key,item_key,item_type,name,description,stripe_price_id,amount_cents,currency,meta,sort_order")
    .eq("business_key", params.business_key)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []) as PricingItem[];
}
