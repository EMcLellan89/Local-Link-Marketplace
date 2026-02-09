import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key, X-Signature, X-Timestamp, Apikey",
};

interface SalePayload {
  external_order_id: string;
  product_key: string;
  product_name?: string;
  amount_cents: number;
  currency?: string;
  partner_ref_code?: string;
  customer_email?: string;
  customer_name?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Get API key from header
    const apiKey = req.headers.get("X-API-Key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing X-API-Key header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get signature and timestamp for verification
    const signature = req.headers.get("X-Signature");
    const timestamp = req.headers.get("X-Timestamp");

    // Initialize Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify API key and get external system
    const { data: externalSystem, error: systemError } = await supabase
      .from("external_systems")
      .select("*")
      .eq("api_key", apiKey)
      .eq("is_active", true)
      .maybeSingle();

    if (systemError || !externalSystem) {
      console.error("Invalid API key:", systemError);
      return new Response(
        JSON.stringify({ error: "Invalid or inactive API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const payload: SalePayload = await req.json();

    // Validate required fields
    if (!payload.external_order_id || !payload.product_key || !payload.amount_cents) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: external_order_id, product_key, amount_cents",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify webhook signature if provided
    if (signature && timestamp) {
      const isValid = await verifyWebhookSignature(
        externalSystem.webhook_secret,
        signature,
        timestamp,
        JSON.stringify(payload)
      );

      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response(
          JSON.stringify({ error: "Invalid webhook signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Generate idempotency key
    const idempotencyKey = `${externalSystem.system_key}_${payload.external_order_id}_${payload.amount_cents}`;

    // Process the sale using the database function
    const { data: result, error: processError } = await supabase.rpc(
      "process_external_sale",
      {
        p_external_system_id: externalSystem.id,
        p_external_order_id: payload.external_order_id,
        p_idempotency_key: idempotencyKey,
        p_product_key: payload.product_key,
        p_product_name: payload.product_name || null,
        p_amount_cents: payload.amount_cents,
        p_partner_ref_code: payload.partner_ref_code || null,
        p_customer_email: payload.customer_email || null,
        p_customer_name: payload.customer_name || null,
        p_metadata: payload.metadata || {},
        p_raw_payload: payload,
      }
    );

    if (processError) {
      console.error("Error processing sale:", processError);
      return new Response(
        JSON.stringify({
          error: "Failed to process sale",
          details: processError.message,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        system: externalSystem.system_name,
      }),
      {
        status: result.duplicate ? 200 : 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Verify webhook signature using HMAC-SHA256
 */
async function verifyWebhookSignature(
  secret: string,
  signature: string,
  timestamp: string,
  payload: string
): Promise<boolean> {
  try {
    // Check timestamp is recent (within 5 minutes)
    const now = Date.now();
    const requestTime = parseInt(timestamp);
    const fiveMinutes = 5 * 60 * 1000;

    if (Math.abs(now - requestTime) > fiveMinutes) {
      console.error("Timestamp too old");
      return false;
    }

    // Create signed payload: timestamp.payload
    const signedPayload = `${timestamp}.${payload}`;

    // Create HMAC-SHA256 signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(signedPayload)
    );

    // Convert to hex string
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Compare signatures (constant-time comparison would be better in production)
    return computedSignature === signature;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}
