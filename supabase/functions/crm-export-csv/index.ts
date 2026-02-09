import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ExportRequest {
  merchantId: string;
  targetCrm: 'adsuite' | 'tradehive' | 'other';
  startDate?: string;
  endDate?: string;
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

    const body: ExportRequest = await req.json();
    const { merchantId, targetCrm, startDate, endDate } = body;

    // Verify merchant ownership
    const { data: merchant, error: merchantError } = await supabaseClient
      .from("merchants")
      .select("id")
      .eq("id", merchantId)
      .eq("user_id", user.id)
      .single();

    if (merchantError || !merchant) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch leads for export
    let query = supabaseClient
      .from("crm_leads")
      .select("*")
      .eq("merchant_id", merchantId)
      .order("created_at", { ascending: false });

    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data: leads, error: leadsError } = await query;

    if (leadsError) {
      throw leadsError;
    }

    // Generate CSV content
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Company",
      "Status",
      "Lead Source",
      "Deal Value",
      "Created Date",
      "Last Contact",
      "Notes"
    ];

    const csvRows = [headers.join(",")];

    for (const lead of leads || []) {
      const row = [
        lead.id,
        lead.first_name || "",
        lead.last_name || "",
        lead.email || "",
        lead.phone || "",
        lead.company_name || "",
        lead.status || "",
        lead.source || "",
        lead.deal_value_cents ? (lead.deal_value_cents / 100).toString() : "0",
        lead.created_at || "",
        lead.last_contact_at || "",
        (lead.notes || "").replace(/,/g, ";")
      ];
      csvRows.push(row.map(field => `"${field}"`).join(","));
    }

    const csvContent = csvRows.join("\n");

    // Create export record
    const { data: exportRecord, error: exportError } = await supabaseClient
      .from("crm_csv_exports")
      .insert({
        merchant_id: merchantId,
        target_crm: targetCrm,
        lead_count: leads?.length || 0,
        export_status: "completed",
        exported_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: user.id
      })
      .select()
      .single();

    if (exportError) {
      console.error("Error creating export record:", exportError);
    }

    // Return CSV as downloadable file
    return new Response(csvContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="leads_export_${targetCrm}_${new Date().toISOString().split('T')[0]}.csv"`
      },
    });

  } catch (error: any) {
    console.error("Error in crm-export-csv:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
