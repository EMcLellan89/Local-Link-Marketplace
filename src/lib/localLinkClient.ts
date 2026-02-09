/**
 * Local-Link API integration for sales attribution
 * Sends sales events to Local-Link so they can be attributed to partner campaigns
 */

const LOCAL_LINK_BASE_URL = import.meta.env.VITE_LOCAL_LINK_BASE_URL || 'https://api.locallink.example';
const LOCAL_LINK_INGEST_SECRET = import.meta.env.VITE_LOCAL_LINK_INGEST_SECRET || '';

export interface SaleEvent {
  ref_code: string; // Partner ref code (e.g., "STORY_PARTNER123")
  order_id: string; // Stripe charge ID or order ID
  amount_cents: number; // Sale amount in cents
  product_key?: string; // Product identifier (e.g., "storylab_kids_basic")
  customer_email?: string; // Customer email for deduplication
  metadata?: Record<string, unknown>; // Additional context
}

/**
 * Post a sale event to Local-Link for attribution
 * @param sale - Sale event details
 * @returns Response from Local-Link API
 */
export async function postSaleToLocalLink(sale: SaleEvent): Promise<boolean> {
  if (!LOCAL_LINK_INGEST_SECRET) {
    console.warn('[Local-Link] No ingest secret configured, skipping sale post');
    return false;
  }

  try {
    const response = await fetch(`${LOCAL_LINK_BASE_URL}/api/ingest/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOCAL_LINK_INGEST_SECRET}`,
      },
      body: JSON.stringify({
        ref_code: sale.ref_code,
        order_id: sale.order_id,
        amount_cents: sale.amount_cents,
        product_key: sale.product_key || 'unknown',
        customer_email: sale.customer_email || '',
        metadata: sale.metadata || {},
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Local-Link] Sale post failed:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log('[Local-Link] Sale posted successfully:', result);
    return true;
  } catch (error) {
    console.error('[Local-Link] Error posting sale:', error);
    return false;
  }
}

/**
 * Batch post multiple sales to Local-Link
 * @param sales - Array of sale events
 * @returns Number of successfully posted sales
 */
export async function postSaleBatchToLocalLink(sales: SaleEvent[]): Promise<number> {
  let successCount = 0;

  // Post sales sequentially to avoid rate limiting
  for (const sale of sales) {
    const success = await postSaleToLocalLink(sale);
    if (success) successCount++;
  }

  return successCount;
}

/**
 * Extract ref code from Stripe metadata or URL parameters
 * @param metadata - Stripe metadata object
 * @returns ref_code string or null
 */
export function extractRefCode(metadata: Record<string, string> | undefined): string | null {
  if (!metadata) return null;

  // Check for ref_code in metadata
  if (metadata.ref_code) return metadata.ref_code;
  if (metadata.refCode) return metadata.refCode;
  if (metadata.ref) return metadata.ref;

  // Check for partner_id and construct ref code
  if (metadata.partner_id) {
    return `STORY_${metadata.partner_id}`;
  }

  return null;
}
