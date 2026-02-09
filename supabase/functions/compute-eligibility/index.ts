import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ELIGIBILITY_CONFIG = {
  minTrainingPercent: 100,
  maxActiveTerritoriesPerPartner: 10,
  minPaidTx30d: 3,
  minGross30d: 300,
  maxChargebackRatePct30d: 2.5,
  scorePass: 70,
};

function safeRate(n: number, d: number) {
  if (!d) return 0;
  return (n / d) * 100;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { partner_id } = await req.json();
    if (!partner_id) {
      throw new Error("partner_id required");
    }

    const now = new Date();
    const start30d = new Date(now);
    start30d.setDate(start30d.getDate() - 30);

    const [certRes, activeTerritoriesRes, liveDealsRes, txPaidRes, txAllRes, txChargebacksRes] = await Promise.all([
      supabase
        .from("partner_certifications")
        .select("*")
        .eq("partner_id", partner_id)
        .maybeSingle(),
      supabase
        .from("territories")
        .select("id", { count: "exact", head: true })
        .eq("assigned_partner_id", partner_id)
        .eq("status", "Assigned"),
      supabase
        .from("deals")
        .select("id", { count: "exact", head: true })
        .eq("partner_id", partner_id)
        .eq("status", "Live"),
      supabase
        .from("transactions")
        .select("gross_amount")
        .eq("partner_id", partner_id)
        .eq("payment_status", "Paid")
        .gte("created_at", start30d.toISOString())
        .lte("created_at", now.toISOString()),
      supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("partner_id", partner_id)
        .gte("created_at", start30d.toISOString())
        .lte("created_at", now.toISOString()),
      supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("partner_id", partner_id)
        .eq("payment_status", "Chargeback")
        .gte("created_at", start30d.toISOString())
        .lte("created_at", now.toISOString()),
    ]);

    const cert = certRes.data;
    const activeTerritories = activeTerritoriesRes.count || 0;
    const liveDeals = liveDealsRes.count || 0;
    const txPaid = txPaidRes.data || [];
    const txAll30d = txAllRes.count || 0;
    const chargebacks30d = txChargebacksRes.count || 0;

    const trainingPercent = cert?.training_completed_percent ?? 0;
    const certified =
      !!cert &&
      cert.status === "Active" &&
      trainingPercent >= ELIGIBILITY_CONFIG.minTrainingPercent;

    const paidTx30d = txPaid.length;
    const gross30d = txPaid.reduce(
      (s, t) => s + parseFloat(String(t.gross_amount || 0)),
      0
    );
    const chargebackRate30d = safeRate(chargebacks30d, txAll30d);

    const reasons: string[] = [];
    let score = 0;

    if (certified) {
      score += 40;
    } else {
      reasons.push(
        "Certification incomplete (training must be 100% and status Active)."
      );
    }

    if (paidTx30d >= ELIGIBILITY_CONFIG.minPaidTx30d) {
      score += 20;
    } else {
      reasons.push(
        `Needs at least ${ELIGIBILITY_CONFIG.minPaidTx30d} paid transactions in last 30 days.`
      );
    }

    if (gross30d >= ELIGIBILITY_CONFIG.minGross30d) {
      score += 15;
    } else {
      reasons.push(
        `Needs at least $${ELIGIBILITY_CONFIG.minGross30d} gross paid volume in last 30 days.`
      );
    }

    if (chargebackRate30d <= ELIGIBILITY_CONFIG.maxChargebackRatePct30d) {
      score += 10;
    } else {
      reasons.push(
        `Chargeback rate too high (${chargebackRate30d.toFixed(2)}% in last 30 days).`
      );
    }

    if (liveDeals >= 2) {
      score += 10;
    } else {
      reasons.push("Needs at least 2 Live deals to prove readiness.");
    }

    if (activeTerritories < ELIGIBILITY_CONFIG.maxActiveTerritoriesPerPartner) {
      score += 5;
    } else {
      reasons.push("Active territory cap reached.");
    }

    const eligible = score >= ELIGIBILITY_CONFIG.scorePass && certified;

    return Response.json(
      {
        eligible,
        score,
        reasons,
        metrics: {
          certified,
          trainingPercent,
          activeTerritories,
          liveDeals,
          paidTx30d,
          gross30d,
          chargebacks30d,
          chargebackRate30d,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400, headers: corsHeaders }
    );
  }
});
