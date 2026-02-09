import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature",
};

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      details_submitted?: boolean;
      charges_enabled?: boolean;
      payouts_enabled?: boolean;
      requirements?: {
        disabled_reason?: string;
      };
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Required environment variables not configured");
    }

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.text();

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let event: StripeEvent;
    try {
      event = JSON.parse(body);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (event.type === "account.updated") {
      const account = event.data.object;
      const accountId = account.id;

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (account.details_submitted !== undefined) {
        updateData.connect_details_submitted = account.details_submitted;
      }
      if (account.charges_enabled !== undefined) {
        updateData.connect_charges_enabled = account.charges_enabled;
      }
      if (account.payouts_enabled !== undefined) {
        updateData.connect_payouts_enabled = account.payouts_enabled;
      }

      const isFullyEnabled =
        account.details_submitted === true &&
        account.charges_enabled === true &&
        account.payouts_enabled === true;

      updateData.connect_enabled = isFullyEnabled;

      if (account.requirements?.disabled_reason) {
        updateData.connect_disabled_reason = account.requirements.disabled_reason;
      } else {
        updateData.connect_disabled_reason = null;
      }

      const { error: updateError } = await supabaseClient
        .from("ugc_creators")
        .update(updateData)
        .eq("stripe_connect_account_id", accountId);

      if (updateError) {
        console.error("Error updating creator Connect status:", updateError);
        throw updateError;
      }

      console.log(`Updated Connect status for account ${accountId}:`, updateData);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in stripe-connect-webhook:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
