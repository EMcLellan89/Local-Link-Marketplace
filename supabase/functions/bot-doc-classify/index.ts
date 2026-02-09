import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { job_id, context } = await req.json();
    const supabase = supabaseAdmin();

    // This is a placeholder bot that would classify uploaded documents
    // In production, this would use OCR + AI to categorize receipts, invoices, contracts, etc.

    const documentId = context.document_id || context.entity_id;

    if (!documentId) {
      throw new Error("document_id required in context");
    }

    // Get agent config
    const { data: agent } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("agent_key", "DocBot")
      .eq("enabled", true)
      .maybeSingle();

    if (!agent) {
      throw new Error("DocBot not enabled");
    }

    // Simulate document classification
    // In production, you would:
    // 1. Fetch the document from storage
    // 2. Use OCR to extract text
    // 3. Use AI to classify the document type
    // 4. Extract key data (date, amount, vendor, etc.)
    // 5. File it in the appropriate system

    const classifications = [
      "receipt",
      "invoice",
      "contract",
      "tax_document",
      "bank_statement",
      "other",
    ];

    const classification = {
      document_id: documentId,
      type: "receipt",
      confidence: 0.95,
      extracted_data: {
        date: new Date().toISOString().split("T")[0],
        amount: 49.99,
        vendor: "Office Supply Store",
        category: "office_expenses",
      },
    };

    // Log audit action
    await supabase.from("audit_actions_log").insert({
      actor_type: "bot",
      actor_key: "DocBot",
      action_type: "DOCUMENT_CLASSIFIED",
      entity_type: "document",
      entity_id: documentId,
      details: classification,
    });

    return new Response(
      JSON.stringify({
        success: true,
        model: agent.default_model,
        tokens_in: 0,
        tokens_out: 0,
        output: classification,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[DocBot] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
