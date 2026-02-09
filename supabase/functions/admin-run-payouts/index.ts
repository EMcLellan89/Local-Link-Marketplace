import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
    });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const run_type = body.run_type ?? "manual";
    const notes = body.notes ?? null;

    // Create payout batch
    const { data: batch, error: batchErr } = await supabase
      .from("payout_batches")
      .insert({ run_type, notes, status: "processing" })
      .select("id")
      .single();

    if (batchErr || !batch) {
      return new Response(
        JSON.stringify({ error: batchErr?.message ?? "Failed to create batch" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    try {
      // Load owed commissions
      const { data: owed, error: owedErr } = await supabase
        .from("commission_ledger")
        .select("id, recipient_partner_id, commission_owed_cents")
        .eq("status", "owed");

      if (owedErr) throw new Error(owedErr.message);

      // Group by partner
      const byPartner = new Map<string, { ledgerIds: string[]; total: number }>();
      for (const row of owed ?? []) {
        if (!byPartner.has(row.recipient_partner_id)) {
          byPartner.set(row.recipient_partner_id, { ledgerIds: [], total: 0 });
        }
        const agg = byPartner.get(row.recipient_partner_id)!;
        agg.ledgerIds.push(row.id);
        agg.total += row.commission_owed_cents;
      }

      console.log(`Processing payouts for ${byPartner.size} partners`);

      // Pay each partner
      for (const [partnerId, agg] of byPartner.entries()) {
        if (agg.total <= 0) continue;

        const { data: partner } = await supabase
          .from("partners")
          .select("stripe_connect_account_id,is_active_subscriber,display_name")
          .eq("id", partnerId)
          .maybeSingle();

        if (!partner?.is_active_subscriber) {
          console.log(`Skipping inactive partner ${partnerId}`);
          continue;
        }

        if (!partner?.stripe_connect_account_id) {
          console.log(`Skipping partner ${partnerId} - no Stripe Connect account`);
          continue;
        }

        // Create Stripe transfer
        const transfer = await stripe.transfers.create({
          amount: agg.total,
          currency: "usd",
          destination: partner.stripe_connect_account_id,
          metadata: {
            payout_batch_id: batch.id,
            recipient_partner_id: partnerId,
          },
        });

        console.log(`✅ Transfer ${transfer.id} created for ${partner.display_name}: $${(agg.total / 100).toFixed(2)}`);

        // Mark ledger rows as paid
        await supabase
          .from("commission_ledger")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
            payout_batch_id: batch.id,
          })
          .in("id", agg.ledgerIds);
      }

      // Complete batch
      await supabase
        .from("payout_batches")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", batch.id);

      console.log(`✅ Payout batch ${batch.id} completed`);

      return new Response(
        JSON.stringify({ ok: true, payout_batch_id: batch.id }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (e: any) {
      // Mark batch as failed
      await supabase
        .from("payout_batches")
        .update({ status: "failed" })
        .eq("id", batch.id);

      console.error("Payout run failed:", e);

      return new Response(
        JSON.stringify({ error: e?.message ?? "Payout run failed", payout_batch_id: batch.id }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (err: any) {
    console.error("Handler error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Handler error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
