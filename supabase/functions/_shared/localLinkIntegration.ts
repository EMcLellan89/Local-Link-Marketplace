/**
 * LocalLink Integration for Edge Functions
 * Sends sales and accounting data to LocalLink platform for partner attribution
 */

export interface LocalLinkSaleData {
  order_id: string; // Unique order/transaction ID
  ref_code?: string; // Partner ref code (e.g., "PARTNER_123" or from partner_id)
  amount_cents: number; // Total sale amount in cents
  product_key: string; // Product identifier (e.g., "frontdesk-ai-pro-basic")
  product_name?: string; // Human readable product name
  customer_email?: string; // Customer email for deduplication
  customer_id?: string; // Internal customer ID
  partner_id?: string; // Partner ID if attributed
  commission_amount_cents?: number; // Commission earned (if applicable)
  metadata?: Record<string, any>; // Additional context
  timestamp?: string; // ISO timestamp (defaults to now)
}

/**
 * Post a sale event to LocalLink for accounting/attribution
 * This is called from webhook handlers when payments are completed
 */
export async function sendSaleToLocalLink(sale: LocalLinkSaleData): Promise<boolean> {
  const ingestUrl = Deno.env.get("LOCAL_LINK_INGEST_URL");
  const ingestSecret = Deno.env.get("LOCAL_LINK_INGEST_SECRET");

  if (!ingestUrl || !ingestSecret) {
    console.warn("[LocalLink] Integration not configured, skipping sale notification");
    console.warn("[LocalLink] Set LOCAL_LINK_INGEST_URL and LOCAL_LINK_INGEST_SECRET");
    return false;
  }

  try {
    const payload = {
      ref_code: sale.ref_code || (sale.partner_id ? `PARTNER_${sale.partner_id}` : "DIRECT"),
      order_id: sale.order_id,
      amount_cents: sale.amount_cents,
      product_key: sale.product_key,
      product_name: sale.product_name || sale.product_key,
      customer_email: sale.customer_email || "",
      customer_id: sale.customer_id || "",
      partner_id: sale.partner_id || null,
      commission_amount_cents: sale.commission_amount_cents || 0,
      metadata: sale.metadata || {},
      timestamp: sale.timestamp || new Date().toISOString(),
      source: "frontdesk-ai-pro",
    };

    console.log("[LocalLink] Sending sale data:", {
      order_id: payload.order_id,
      amount: `$${(payload.amount_cents / 100).toFixed(2)}`,
      product: payload.product_key,
      partner: payload.partner_id || "none",
    });

    const response = await fetch(ingestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ingestSecret}`,
        "X-Source": "frontdesk-ai-pro",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[LocalLink] Sale notification failed:", {
        status: response.status,
        error: errorText,
        order_id: sale.order_id,
      });
      return false;
    }

    const result = await response.json();
    console.log("[LocalLink] Sale notification SUCCESS:", {
      order_id: sale.order_id,
      result,
    });

    return true;
  } catch (error: any) {
    console.error("[LocalLink] Error sending sale:", {
      order_id: sale.order_id,
      error: error.message,
      stack: error.stack,
    });
    return false;
  }
}

/**
 * Batch send multiple sales (useful for bulk operations or migrations)
 */
export async function sendSalesBatchToLocalLink(sales: LocalLinkSaleData[]): Promise<number> {
  let successCount = 0;

  console.log(`[LocalLink] Batch sending ${sales.length} sales...`);

  for (const sale of sales) {
    const success = await sendSaleToLocalLink(sale);
    if (success) successCount++;
    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`[LocalLink] Batch complete: ${successCount}/${sales.length} successful`);

  return successCount;
}

/**
 * Send subscription renewal to LocalLink
 */
export async function sendSubscriptionRenewalToLocalLink(data: {
  subscription_id: string;
  partner_id?: string;
  amount_cents: number;
  product_key: string;
  customer_email?: string;
}): Promise<boolean> {
  return sendSaleToLocalLink({
    order_id: `SUB_${data.subscription_id}_${Date.now()}`,
    ref_code: data.partner_id ? `PARTNER_${data.partner_id}` : undefined,
    amount_cents: data.amount_cents,
    product_key: data.product_key,
    customer_email: data.customer_email,
    metadata: {
      type: "subscription_renewal",
      subscription_id: data.subscription_id,
    },
  });
}

/**
 * Send refund notification to LocalLink
 */
export async function sendRefundToLocalLink(data: {
  order_id: string;
  amount_cents: number;
  reason?: string;
}): Promise<boolean> {
  const webhookUrl = Deno.env.get("LOCAL_LINK_WEBHOOK_URL");
  const apiKey = Deno.env.get("LOCAL_LINK_API_KEY");

  if (!webhookUrl || !apiKey) {
    console.warn("[LocalLink] Webhook not configured for refunds");
    return false;
  }

  try {
    const response = await fetch(`${webhookUrl}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        order_id: data.order_id,
        amount_cents: data.amount_cents,
        reason: data.reason || "refund",
        timestamp: new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (error: any) {
    console.error("[LocalLink] Error sending refund:", error);
    return false;
  }
}
