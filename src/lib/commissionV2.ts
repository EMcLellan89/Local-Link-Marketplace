import { supabaseAdmin } from "./supabaseAdmin";

type OrderType = "subscription" | "dfy" | "addon" | "print";
type Tier = "base" | "certified" | "elite";

export async function getCommissionRateV2(params: {
  partner_id: string;
  business_key: string;
  order_type: OrderType;
}): Promise<number> {
  // Profit Network businesses = flat 25% (unless bonus handled elsewhere)
  if (params.business_key?.startsWith("storylab_")) return 0.25;

  // fallback to rules table for other parts of platform
  const { data: mem, error: mErr } = await supabaseAdmin
    .from("partner_memberships")
    .select("status")
    .eq("partner_id", params.partner_id)
    .eq("business_key", params.business_key)
    .maybeSingle();
  if (mErr) throw mErr;

  const membershipActive = mem?.status === "active" || mem?.status === "trialing";
  let effectiveTier: Tier = "base";

  if (membershipActive) {
    const { data: pbs, error: pErr } = await supabaseAdmin
      .from("partner_business_status")
      .select("tier,is_active")
      .eq("partner_id", params.partner_id)
      .eq("business_key", params.business_key)
      .maybeSingle();
    if (pErr) throw pErr;

    if (pbs?.is_active !== false) effectiveTier = (pbs?.tier as Tier) || "base";
  }

  const { data: rule, error: rErr } = await supabaseAdmin
    .from("commission_rules_v2")
    .select("rate")
    .eq("business_key", params.business_key)
    .eq("tier", effectiveTier)
    .eq("order_type", params.order_type)
    .single();
  if (rErr) throw rErr;

  return Number(rule.rate);
}
