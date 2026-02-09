# StoryLab → Local-Link Integration Guide

This document explains how StoryLab (running on its own infrastructure) reports sales to Local-Link for commission tracking and partner payouts.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        StoryLab                              │
│  - Separate Supabase database                               │
│  - Own website (locallinkstorylab.com)                      │
│  - Handles: AI, PDFs, customer orders                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ POST /functions/v1/external-sale-ingest
                  │ (When order is finalized)
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      Local-Link                              │
│  - Partner system                                            │
│  - Commission tracking                                       │
│  - Payout processing                                         │
│  - Admin dashboards                                          │
└─────────────────────────────────────────────────────────────┘
```

## Getting Your API Credentials

1. **Admin Access Required**: Log into Local-Link admin panel
2. **Navigate to**: Admin → External Sales Ingest
3. **Find StoryLab System**: You'll see the registered StoryLab system
4. **Copy Credentials**:
   - `API Key`: Used for authentication (X-API-Key header)
   - `Webhook Secret`: Used for signature verification (optional but recommended)
   - `Webhook Endpoint`: The URL to POST sales to

## API Endpoint

**URL**: `https://your-locallink-domain.com/functions/v1/external-sale-ingest`

**Method**: `POST`

**Headers**:
```
X-API-Key: sk_storylab_[your_api_key]
Content-Type: application/json
X-Signature: [hmac_signature] (optional but recommended)
X-Timestamp: [unix_timestamp_ms] (required if using signature)
```

## Request Payload

### Required Fields

```json
{
  "external_order_id": "storylab_order_12345",
  "product_key": "storylab-kids-basic",
  "amount_cents": 2997
}
```

### Full Payload Example

```json
{
  "external_order_id": "storylab_order_12345",
  "product_key": "storylab-kids-basic",
  "product_name": "StoryLab Kids - Basic Book",
  "amount_cents": 2997,
  "currency": "USD",
  "partner_ref_code": "PARTNER123",
  "customer_email": "parent@example.com",
  "customer_name": "Jane Smith",
  "metadata": {
    "book_title": "My Adventure",
    "character_name": "Tommy",
    "order_type": "digital"
  }
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `external_order_id` | string | Yes | Your unique order ID (must be unique per order) |
| `product_key` | string | Yes | Product identifier (determines commission rate) |
| `product_name` | string | No | Human-readable product name |
| `amount_cents` | integer | Yes | Sale amount in cents (e.g., $29.97 = 2997) |
| `currency` | string | No | Currency code (default: USD) |
| `partner_ref_code` | string | No | Partner's referral code (if this was a referred sale) |
| `customer_email` | string | No | Customer email for tracking |
| `customer_name` | string | No | Customer name |
| `metadata` | object | No | Additional data to store |

## Response Format

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "success": true,
    "duplicate": false,
    "event_id": "uuid-here",
    "partner_id": "uuid-here",
    "commission_id": "uuid-here",
    "commission_cents": 899,
    "message": "Sale recorded and commission created"
  },
  "system": "StoryLab"
}
```

### Duplicate Response (200 OK)

If you send the same order again (idempotent):

```json
{
  "success": true,
  "data": {
    "success": true,
    "duplicate": true,
    "event_id": "uuid-here",
    "message": "Event already processed"
  },
  "system": "StoryLab"
}
```

### Error Responses

**401 Unauthorized**
```json
{
  "error": "Invalid or inactive API key"
}
```

**400 Bad Request**
```json
{
  "error": "Missing required fields: external_order_id, product_key, amount_cents"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to process sale",
  "details": "Error message here"
}
```

## Implementation Examples

### Node.js / TypeScript

```typescript
async function reportSaleToLocalLink(order: any) {
  const payload = {
    external_order_id: order.id,
    product_key: order.product_key,
    product_name: order.product_name,
    amount_cents: order.total_cents,
    partner_ref_code: order.referral_code || null,
    customer_email: order.customer_email,
    customer_name: order.customer_name,
    metadata: {
      book_title: order.book_title,
      created_at: order.created_at
    }
  };

  const response = await fetch(
    'https://your-locallink-domain.com/functions/v1/external-sale-ingest',
    {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.LOCALLINK_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error('Failed to report sale:', result);
    throw new Error(result.error || 'Failed to report sale');
  }

  console.log('Sale reported:', result);
  return result;
}
```

### With Signature Verification (Recommended)

```typescript
import crypto from 'crypto';

async function reportSaleWithSignature(order: any) {
  const timestamp = Date.now().toString();
  const payload = {
    external_order_id: order.id,
    product_key: order.product_key,
    amount_cents: order.total_cents,
    partner_ref_code: order.referral_code || null,
  };

  const payloadString = JSON.stringify(payload);

  // Create signature: HMAC-SHA256(timestamp.payload)
  const signedPayload = `${timestamp}.${payloadString}`;
  const signature = crypto
    .createHmac('sha256', process.env.LOCALLINK_WEBHOOK_SECRET!)
    .update(signedPayload)
    .digest('hex');

  const response = await fetch(
    'https://your-locallink-domain.com/functions/v1/external-sale-ingest',
    {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.LOCALLINK_API_KEY!,
        'X-Signature': signature,
        'X-Timestamp': timestamp,
        'Content-Type': 'application/json',
      },
      body: payloadString,
    }
  );

  return await response.json();
}
```

### Python

```python
import requests
import hmac
import hashlib
import time
import json

def report_sale_to_locallink(order):
    timestamp = str(int(time.time() * 1000))

    payload = {
        'external_order_id': order['id'],
        'product_key': order['product_key'],
        'amount_cents': order['total_cents'],
        'partner_ref_code': order.get('referral_code'),
        'customer_email': order.get('customer_email')
    }

    payload_str = json.dumps(payload)

    # Create signature
    signed_payload = f"{timestamp}.{payload_str}"
    signature = hmac.new(
        LOCALLINK_WEBHOOK_SECRET.encode(),
        signed_payload.encode(),
        hashlib.sha256
    ).hexdigest()

    response = requests.post(
        'https://your-locallink-domain.com/functions/v1/external-sale-ingest',
        headers={
            'X-API-Key': LOCALLINK_API_KEY,
            'X-Signature': signature,
            'X-Timestamp': timestamp,
            'Content-Type': 'application/json'
        },
        json=payload
    )

    return response.json()
```

## When to Send the Webhook

**IMPORTANT**: Only send the webhook when the order is **finalized and paid**.

### Recommended Flow:

1. Customer completes checkout in StoryLab
2. Payment is processed successfully
3. Order status is set to "completed" or "paid" in your database
4. **NOW** send the webhook to Local-Link
5. Store the `event_id` from the response for your records

### Don't Send For:

- Abandoned carts
- Pending payments
- Failed payments
- Refunded orders (handle separately)
- Test orders (unless in test mode)

## Error Handling & Retries

### Idempotency

The system is **fully idempotent**. You can safely retry the same order multiple times:

- Uses combination of `external_system_id` + `idempotency_key`
- Idempotency key is generated from: `system_key` + `order_id` + `amount`
- Duplicate requests return 200 with `duplicate: true`

### Retry Strategy

```typescript
async function reportSaleWithRetry(order: any, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await reportSaleToLocalLink(order);
      return result;
    } catch (error) {
      lastError = error;

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
```

### Failed Webhooks

If a webhook fails:

1. **Log it** in your system
2. **Retry** with exponential backoff
3. **Alert** your team if retries exhausted
4. **Manual submission** via admin UI if needed

Local-Link stores all attempts and failures for debugging.

## Product Keys & Commission Rates

Product keys determine the commission rate partners receive:

| Product Key | Commission Rate | Description |
|-------------|----------------|-------------|
| `storylab-kids-basic` | 30% | Basic children's book |
| `storylab-kids-premium` | 30% | Premium children's book |
| `storylab-teen-basic` | 30% | Teen book - basic |
| `storylab-teen-premium` | 30% | Teen book - premium |
| `storylab-adult-basic` | 30% | Adult book - basic |
| `storylab-adult-premium` | 30% | Adult book - premium |

Default commission rate is **30%** if product not found.

## Partner Attribution

### How It Works

1. Customer clicks partner's link: `storylab.com?ref=PARTNER123`
2. StoryLab stores `PARTNER123` with the order
3. When reporting to Local-Link, include `partner_ref_code: "PARTNER123"`
4. Local-Link looks up the partner and creates commission automatically

### No Partner

If there's no referral code, simply omit `partner_ref_code` or set it to `null`:

```json
{
  "external_order_id": "order_123",
  "product_key": "storylab-kids-basic",
  "amount_cents": 2997,
  "partner_ref_code": null
}
```

The sale will be recorded but no commission created.

## Monitoring & Debugging

### Admin Dashboard

Local-Link admins can view:

- All incoming sales events
- Processing status (pending, completed, failed)
- Commissions generated
- Partner attribution
- Error messages

### Check Integration Status

Send a test sale and check:

1. **Logs**: Check your application logs
2. **Response**: Verify you got a success response
3. **Admin UI**: Check Local-Link admin → External Sales Ingest → Events tab
4. **Partner Dashboard**: Partner should see commission in their dashboard

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Wrong API key | Double-check API key |
| 400 Bad Request | Missing required field | Verify payload has all required fields |
| No commission created | Invalid partner code | Verify partner exists and is active |
| Duplicate ignored | Same order sent twice | This is normal - idempotency working |

## Testing

### Test in Development

1. Use the API key from Local-Link admin
2. Send a test order with a known partner code
3. Check the admin dashboard
4. Verify commission appears

### Example Test

```bash
curl -X POST https://your-locallink-domain.com/functions/v1/external-sale-ingest \
  -H "X-API-Key: sk_storylab_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "external_order_id": "test_order_' $(date +%s) '",
    "product_key": "storylab-kids-basic",
    "product_name": "Test Book",
    "amount_cents": 2997,
    "partner_ref_code": "TESTPARTNER",
    "customer_email": "test@example.com"
  }'
```

## Security Best Practices

1. **Store API Key Securely**
   - Use environment variables
   - Never commit to version control
   - Rotate periodically

2. **Use Signature Verification**
   - Prevents unauthorized webhook calls
   - Protects against replay attacks
   - Validates payload integrity

3. **HTTPS Only**
   - All webhook calls must use HTTPS
   - Never send API keys over HTTP

4. **Rate Limiting**
   - Implement sensible rate limits on your side
   - Don't hammer the endpoint if there are issues

## Support

If you encounter issues:

1. Check this documentation
2. Review error messages in the response
3. Check Local-Link admin dashboard for details
4. Contact Local-Link support with:
   - Order ID
   - Timestamp of request
   - Error message
   - Full request payload (redact sensitive data)

---

## Quick Reference

**Endpoint**: `POST /functions/v1/external-sale-ingest`

**Required Headers**:
- `X-API-Key: sk_storylab_[key]`
- `Content-Type: application/json`

**Required Fields**:
- `external_order_id`
- `product_key`
- `amount_cents`

**When to Send**: After payment is confirmed and order is finalized

**Retries**: Safe to retry - fully idempotent

**Commission**: Automatic if valid partner code provided
