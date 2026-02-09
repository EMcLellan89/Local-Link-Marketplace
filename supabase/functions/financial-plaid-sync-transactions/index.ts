import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { plaidClient } from "../_shared/plaidClient.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { merchant_id } = await req.json();

    const supabase = supabaseAdmin();
    const plaid = plaidClient();

    const connectionsQuery = merchant_id
      ? supabase.from("bank_connections").select("*").eq("merchant_id", merchant_id).eq("status", "active")
      : supabase.from("bank_connections").select("*").eq("status", "active");

    const { data: connections, error: connError } = await connectionsQuery;

    if (connError) {
      throw new Error(`Failed to fetch connections: ${connError.message}`);
    }

    let totalSynced = 0;

    for (const connection of connections || []) {
      try {
        const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        const endDate = new Date().toISOString().split("T")[0];

        const transactionsResponse = await plaid.transactionsGet({
          access_token: connection.plaid_access_token,
          start_date: startDate,
          end_date: endDate,
        });

        const transactions = transactionsResponse.data.transactions;

        const { data: accounts } = await supabase
          .from("bank_accounts")
          .select("id, plaid_account_id")
          .eq("connection_id", connection.id);

        const accountMap = new Map(
          accounts?.map((a) => [a.plaid_account_id, a.id]) || []
        );

        for (const tx of transactions) {
          const account_id = accountMap.get(tx.account_id);

          if (!account_id) continue;

          const { error: txError } = await supabase
            .from("transactions")
            .upsert(
              {
                merchant_id: connection.merchant_id,
                account_id,
                plaid_transaction_id: tx.transaction_id,
                date: tx.date,
                name: tx.name,
                amount: tx.amount,
                iso_currency_code: tx.iso_currency_code || "USD",
                pending: tx.pending,
                raw: tx,
              },
              {
                onConflict: "plaid_transaction_id",
              }
            );

          if (txError) {
            console.error(`[Plaid Sync] Transaction upsert error:`, txError);
          } else {
            totalSynced++;
          }
        }

        await supabase
          .from("bank_connections")
          .update({ last_sync_at: new Date().toISOString() })
          .eq("id", connection.id);

        console.log(
          `[Plaid Sync] Synced ${transactions.length} transactions for connection ${connection.id}`
        );
      } catch (error) {
        console.error(`[Plaid Sync] Error syncing connection ${connection.id}:`, error.message);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        connections_synced: connections?.length || 0,
        transactions_synced: totalSynced,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Plaid Sync Transactions] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
