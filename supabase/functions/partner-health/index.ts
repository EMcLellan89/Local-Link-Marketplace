import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("partner_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || !profile.partner_id) {
      throw new Error("Partner scope missing");
    }

    const partnerId = profile.partner_id;
    const now = new Date();
    const start30d = new Date(now);
    start30d.setDate(start30d.getDate() - 30);

    const [paidTxRes, allTxRes, chargebacksRes, grossSumRes, eligibilityData] = await Promise.all([
      supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("partner_id", partnerId)
        .eq("payment_status", "Paid")
        .gte("created_at", start30d.toISOString())
        .lte("created_at", now.toISOString()),
      supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("partner_id", partnerId)
        .gte("created_at", start30d.toISOString())
        .lte("created_at", now.toISOString()),
      supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("partner_id", partnerId)
        .eq("payment_status", "Chargeback")
        .gte("created_at", start30d.toISOString())
        .lte("created_at", now.toISOString()),
      supabase
        .from("transactions")
        .select("gross_amount")
        .eq("partner_id", partnerId)
        .eq("payment_status", "Paid")
        .gte("created_at", start30d.toISOString())
        .lte("created_at", now.toISOString()),
      supabase.functions.invoke("compute-eligibility", { body: { partner_id: partnerId } }),
    ]);

    const paidTx = paidTxRes.count || 0;
    const allTx = allTxRes.count || 0;
    const chargebacks = chargebacksRes.count || 0;
    const grossData = grossSumRes.data || [];
    const gross = grossData.reduce((sum, tx) => sum + (parseFloat(String(tx.gross_amount || 0))), 0);
    const chargebackRate = allTx ? (chargebacks / allTx) * 100 : 0;

    return Response.json(
      {
        ok: true,
        last30d: {
          paidTx,
          gross,
          chargebacks,
          chargebackRate,
        },
        eligibility: eligibilityData.data || {},
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
