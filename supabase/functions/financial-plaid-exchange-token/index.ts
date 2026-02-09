import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { plaidClient } from "../_shared/plaidClient.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { public_token, merchant_id } = await req.json();

    if (!public_token || !merchant_id) {
      return new Response(
        JSON.stringify({ error: "Missing public_token or merchant_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const plaid = plaidClient();
    const supabase = supabaseAdmin();

    const exchangeResponse = await plaid.itemPublicTokenExchange({
      public_token,
    });

    const access_token = exchangeResponse.data.access_token;
    const item_id = exchangeResponse.data.item_id;

    const { data: connection, error: connError } = await supabase
      .from("bank_connections")
      .insert({
        merchant_id,
        plaid_item_id: item_id,
        plaid_access_token: access_token,
        status: "active",
      })
      .select()
      .single();

    if (connError) {
      console.error("[Plaid Exchange] Bank connection insert error:", connError);
      throw new Error("Failed to store bank connection");
    }

    const accountsResponse = await plaid.accountsGet({
      access_token,
    });

    const accounts = accountsResponse.data.accounts;

    for (const account of accounts) {
      await supabase.from("bank_accounts").insert({
        merchant_id,
        connection_id: connection.id,
        plaid_account_id: account.account_id,
        name: account.name,
        official_name: account.official_name || null,
        type: account.type,
        subtype: account.subtype || null,
        mask: account.mask || null,
        current_balance: account.balances.current,
        available_balance: account.balances.available || null,
        iso_currency_code: account.balances.iso_currency_code || "USD",
      });
    }

    console.log(`[Plaid Exchange] Stored ${accounts.length} accounts for merchant ${merchant_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        connection_id: connection.id,
        accounts_count: accounts.length
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Plaid Exchange Token] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
