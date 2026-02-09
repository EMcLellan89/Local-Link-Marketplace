import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-LL-Webhook-Timestamp, X-LL-Webhook-Signature, X-LL-Idempotency-Key",
};

// Tier commission rates (basis points)
function tierToBps(tier: string): number {
  switch (tier?.toLowerCase()) {
    case "starter": return 1000;      // 10%
    case "growth": return 1200;       // 12%
    case "pro": return 1500;          // 15%
    case "enterprise": return 2000;   // 20%
    default: return 0;
  }
}

// Calculate week start (Monday)
function weekStartISO(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (date.getUTCDay() + 6) % 7; // Monday=0
  date.setUTCDate(date.getUTCDate() - day);
  return date.toISOString().slice(0, 10);
}

// Convert ArrayBuffer to hex string
function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * POST /webhooks/external/:business_id
 *
 * Receives sales events from external businesses.
 *
 * Headers:
 * - X-LL-Webhook-Timestamp: Unix timestamp
 * - X-LL-Webhook-Signature: HMAC-SHA256 signature
 * - X-LL-Idempotency-Key: Optional idempotency key
 *
 * Body:
 * {
 *   "event_id": "unique-event-id",
 *   "event_type": "payment.succeeded",
 *   "occurred_at": "2024-01-01T00:00:00Z",
 *   "customer_email": "customer@example.com",
 *   "sku": "product-sku",
 *   "paid_amount": 99.99,
 *   "currency": "USD",
 *   "referral_slug": "john-smith-3817",  // optional
 *   "partner_id": "uuid"  // optional
 * }
 */

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const business_id = pathParts[2] ?? ""; // /webhooks/external/:business_id

    if (!business_id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing business_id in path" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rawBody = await req.text();

    // Get webhook secret for this business
    const secret =
      Deno.env.get(`LOCAL_LINK_WEBHOOK_SECRET_${business_id}`) ||
      Deno.env.get("LOCAL_LINK_WEBHOOK_SECRET");

    if (!secret) {
      console.error("Missing webhook secret for business:", business_id);
      return new Response(
        JSON.stringify({ ok: false, error: "Server missing webhook secret" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify signature if provided
    const ts = req.headers.get("x-ll-webhook-timestamp");
    const sig = req.headers.get("x-ll-webhook-signature");

    if (ts && sig) {
      const signed = `${ts}.${rawBody}`;
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const digest = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(signed)
      );
      const expected = toHex(digest);

      if (expected !== sig) {
        console.error("Invalid signature");
        return new Response(
          JSON.stringify({ ok: false, error: "Invalid signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check timestamp tolerance (5 minutes)
      const now = Math.floor(Date.now() / 1000);
      const tsNum = Number(ts);
      if (!Number.isFinite(tsNum) || Math.abs(now - tsNum) > 300) {
        console.error("Timestamp outside tolerance");
        return new Response(
          JSON.stringify({ ok: false, error: "Timestamp outside tolerance" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const idem = req.headers.get("x-ll-idempotency-key") ?? null;

    // Extract required fields
    const event_id = String(payload?.event_id || payload?.id || idem || "").trim();
    const event_type = String(payload?.event_type || "").trim();
    const occurred_at = payload?.occurred_at || new Date().toISOString();
    const sku = String(payload?.sale?.sku || payload?.sku || "").trim();
    const paid_amount = Number(payload?.sale?.paid_amount ?? payload?.paid_amount ?? 0);
    const customer_email = String(
      payload?.customer?.customer_email ||
        payload?.customer_email ||
        payload?.customer?.email ||
        ""
    )
      .trim()
      .toLowerCase();

    const referral_slug = String(
      payload?.referral?.referral_slug ||
        payload?.referral_slug ||
        payload?.metadata?.ref ||
        ""
    ).trim() || null;

    const partner_id_in = (payload?.referral?.partner_id || payload?.partner_id || null) as
      | string
      | null;

    if (!event_id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing event_id" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!event_type) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing event_type" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!sku) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing sku" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resolve partner attribution
    let partner: any = null;

    // Try partner_id first
    if (partner_id_in) {
      const { data, error } = await supabaseAdmin
        .from("partners")
        .select("id, partner_id_num, tier_key, status")
        .eq("id", partner_id_in)
        .maybeSingle();

      if (!error && data && data.status === "Active") {
        partner = data;
      }
    }

    // Fallback: referral_slug
    if (!partner && referral_slug) {
      const { data, error } = await supabaseAdmin
        .from("partners")
        .select("id, partner_id_num, tier_key, status")
        .eq("referral_slug", referral_slug)
        .maybeSingle();

      if (!error && data && data.status === "Active") {
        partner = data;
      }
    }

    // Fallback: email attribution lookup
    if (!partner && customer_email) {
      const { data, error } = await supabaseAdmin
        .from("referral_attribution")
        .select("attributed_partner_id, partner_id_num")
        .eq("visitor_email", customer_email)
        .order("last_seen_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length) {
        const pid = data[0].attributed_partner_id;
        const { data: p2 } = await supabaseAdmin
          .from("partners")
          .select("id, partner_id_num, tier_key, status")
          .eq("id", pid)
          .maybeSingle();

        if (p2 && p2.status === "Active") {
          partner = p2;
        }
      }
    }

    // Insert sales event (idempotent)
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("sales_events")
      .insert({
        business_id,
        event_id,
        event_type,
        occurred_at,
        customer_email: customer_email || null,
        sku,
        paid_amount: paid_amount || 0,
        currency: String(payload?.currency || payload?.sale?.currency || "USD"),
        attributed_partner_id: partner?.id ?? null,
        partner_id_num: partner?.partner_id_num ?? null,
        referral_slug: referral_slug,
        raw_payload: payload,
      })
      .select("id")
      .maybeSingle();

    // If duplicate, return success (idempotent)
    if (insErr && (insErr.message || "").toLowerCase().includes("duplicate")) {
      return new Response(
        JSON.stringify({ ok: true, idempotent: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (insErr) {
      console.error("Insert error:", insErr);
      return new Response(
        JSON.stringify({ ok: false, error: `DB insert error: ${insErr.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create commission if partner exists and paid_amount > 0
    if (partner && paid_amount > 0 && inserted?.id) {
      const bps = tierToBps(partner.tier_key);
      const commission_amount = Math.round((paid_amount * (bps / 10000)) * 100) / 100;
      const wk = weekStartISO(new Date(occurred_at));

      await supabaseAdmin.from("commission_ledger").insert({
        sale_event_id: inserted.id,
        recipient_partner_id: partner.id,
        partner_tier: partner.tier_key,
        commission_rate_bps: bps,
        commission_owed_cents: Math.round(commission_amount * 100),
        status: "pending",
        week_start: wk,
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        sale_event_id: inserted?.id ?? null,
        partner_applied: Boolean(partner),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ ok: false, error: `Server error: ${error.message || "Unknown error"}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
