import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MigrationRequest {
  merchantId: string;
  sourceCrm: 'adsuite' | 'tradehive' | 'other';
  sourceDataFile?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: MigrationRequest = await req.json();
    const { merchantId, sourceCrm, sourceDataFile } = body;

    // Verify merchant ownership
    const { data: merchant, error: merchantError } = await supabaseClient
      .from("merchants")
      .select("id, business_name")
      .eq("id", merchantId)
      .eq("user_id", user.id)
      .single();

    if (merchantError || !merchant) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create migration request
    const { data: migrationRequest, error: migrationError } = await supabaseClient
      .from("crm_migration_requests")
      .insert({
        merchant_id: merchantId,
        source_crm: sourceCrm,
        destination_crm: 'locallink',
        migration_status: 'requested',
        source_data_file: sourceDataFile,
        ai_bot_assigned: 'CRM-Migration-Bot-v1',
        migration_log: [
          {
            timestamp: new Date().toISOString(),
            event: 'Migration request created',
            details: `Migration from ${sourceCrm} to LocalLink CRM requested by ${merchant.business_name}`
          }
        ]
      })
      .select()
      .single();

    if (migrationError) {
      throw migrationError;
    }

    // Send notification to admin/support team about new migration request
    // This would trigger the AI bot to start analyzing the data

    return new Response(
      JSON.stringify({
        success: true,
        migrationRequestId: migrationRequest.id,
        status: migrationRequest.migration_status,
        message: "CRM migration request created successfully. Our AI-powered migration bot will analyze your data and begin the migration process. You'll receive updates via email.",
        estimatedTime: "2-4 hours"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in crm-migration-request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
