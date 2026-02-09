import { supabaseAdmin } from "./supabaseAdmin";
import { getCommissionRateV2 } from "./commissionV2";

const HOLD_DAYS = Number(process.env.COMMISSION_HOLD_DAYS || 15);

function addDays(d: Date, days: number) {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + days);
  return x;
}

export async function finalizePaidOrderFromStripe(params: {
  order_id: string;
  business_key: string;
  vertical_key: string;
  order_type: "subscription" | "dfy" | "addon" | "print";
  item_key: string;
  amount_total_cents: number;
  currency: string;
  stripe_payment_intent_id?: string | null;
  stripe_subscription_id?: string | null;
  partner_id?: string | null;
}) {
  const gross = params.amount_total_cents;
  const refundable = gross;
  const net = gross; // refine later if you want fees/cogs

  await supabaseAdmin
    .from("orders")
    .update({
      status: "paid",
      amount_gross_cents: gross,
      amount_refundable_cents: refundable,
      amount_net_cents: net,
      currency: params.currency || "usd",
      stripe_payment_intent_id: params.stripe_payment_intent_id || null,
      stripe_subscription_id: params.stripe_subscription_id || null,
      business_key: params.business_key,
      vertical_key: params.vertical_key,
      item_key: params.item_key,
    })
    .eq("id", params.order_id);

  if (!params.partner_id) return;

  const rate = await getCommissionRateV2({
    partner_id: params.partner_id,
    business_key: params.business_key,
    order_type: params.order_type,
  });

  const commissionCents = Math.max(0, Math.floor(net * rate));
  const holdUntil = addDays(new Date(), HOLD_DAYS).toISOString();

  await supabaseAdmin.from("commissions").insert({
    order_id: params.order_id,
    partner_id: params.partner_id,
    commission_cents: commissionCents,
    status: "held",
    hold_until: holdUntil,
  });

  // For Profit Network we still track rev; for membership tiers you already have RPCs
  // Use your increment_partner_active_rev_v2 if you want, but Profit Network is flat anyway.
}

export async function markOrderRefunded(params: { order_id: string }) {
  await supabaseAdmin.from("orders").update({ status: "refunded" }).eq("id", params.order_id);
  await supabaseAdmin.from("commissions").update({ status: "reversed" }).eq("order_id", params.order_id);
}
