# LocalLink Environment Variables - Quick Start

## The 4 Variables You Saw in Your Screenshot

Based on your screenshot showing:
- `LOCAL_LINKS_WEBHOOK_URL`
- `LOCAL_LINKS_API_KEY`
- `LOCALLINK_INGEST_URL`
- `LOCALLINK_INGEST_SECRET`

Here's the exact mapping:

---

## Correct Variable Names (Updated for Consistency)

```env
# Your Screenshot Name → Correct Variable Name in .env

LOCAL_LINKS_WEBHOOK_URL     →  LOCAL_LINK_WEBHOOK_URL
LOCAL_LINKS_API_KEY         →  LOCAL_LINK_API_KEY
LOCALLINK_INGEST_URL        →  LOCAL_LINK_INGEST_URL
LOCALLINK_INGEST_SECRET     →  LOCAL_LINK_INGEST_SECRET
```

---

## Where to Set These in `.env`

Open `/tmp/cc-agent/61305854/project/.env` and add:

```env
# Local-Link Integration (Sales/Accounting Attribution)
LOCAL_LINK_INGEST_URL=https://local-link.com/api/ingest/sale
LOCAL_LINK_INGEST_SECRET=your_secret_from_locallink_dashboard
LOCAL_LINK_WEBHOOK_URL=https://local-link.com/api/webhooks/frontdesk-ai-pro
LOCAL_LINK_API_KEY=your_api_key_from_locallink_dashboard
```

---

## Where to Get the Values

### From Local-Link Dashboard:

1. **Login to Local-Link**
   - Go to: `https://local-link.com/dashboard`

2. **Navigate to API Settings**
   - Look for: "Settings" → "API Keys" or "Integrations"

3. **Copy These Values:**

   **LOCAL_LINK_INGEST_SECRET:**
   - Label might be: "Ingest Secret", "Sale Webhook Secret", or "API Secret"
   - Format: Usually starts with `sk_` or similar
   - Used for: Authenticating sale notifications from FrontDesk AI Pro

   **LOCAL_LINK_API_KEY:**
   - Label might be: "API Key", "Public Key", or "Integration Key"
   - Format: Usually starts with `pk_` or similar
   - Used for: General API authentication

   **LOCAL_LINK_INGEST_URL:**
   - Should be provided by Local-Link team
   - Default: `https://local-link.com/api/ingest/sale`
   - Ask: "What's the endpoint URL for sale ingestion?"

   **LOCAL_LINK_WEBHOOK_URL:**
   - Should be provided by Local-Link team
   - Default: `https://local-link.com/api/webhooks/frontdesk-ai-pro`
   - Ask: "What's the webhook callback URL for FrontDesk AI Pro?"

---

## Contact Local-Link Team

If you can't find these in the dashboard, email/contact Local-Link support:

**What to Ask:**
> "I'm integrating FrontDesk AI Pro with Local-Link for sales attribution.
> I need the following credentials:
>
> 1. LOCAL_LINK_INGEST_SECRET (for authenticating sale notifications)
> 2. LOCAL_LINK_API_KEY (for API calls)
> 3. LOCAL_LINK_INGEST_URL (endpoint for sale data)
> 4. LOCAL_LINK_WEBHOOK_URL (webhook callback endpoint)
>
> Please provide the production values for my account."

---

## Example with Real Values

```env
# ✅ GOOD - Real values from Local-Link
LOCAL_LINK_INGEST_URL=https://local-link.com/api/ingest/sale
LOCAL_LINK_INGEST_SECRET=sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4
LOCAL_LINK_WEBHOOK_URL=https://local-link.com/api/webhooks/frontdesk-ai-pro
LOCAL_LINK_API_KEY=pk_live_zyxwvutsrqponmlkjihgfedcba

# ❌ BAD - Placeholder values (won't work)
LOCAL_LINK_INGEST_SECRET=your_local_link_secret_here
LOCAL_LINK_API_KEY=your_local_link_api_key_here
```

---

## Testing After Setup

1. **Check Variables Are Set:**
   ```bash
   cat .env | grep LOCAL_LINK
   ```

2. **Make a Test Purchase:**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Complete checkout

3. **Check Logs:**
   - Supabase Dashboard → Edge Functions → `marketplace-stripe-webhook`
   - Look for: `[LocalLink] Sale notification SUCCESS`

4. **Verify in Local-Link:**
   - Check Local-Link dashboard for new sale
   - Confirm partner attribution

---

## Quick Status Check

### ✅ Variables Are Set When:
- `.env` file has all 4 variables
- Values are NOT the default placeholders
- Values start with real credentials (like `sk_live_...` or `pk_live_...`)

### ✅ Integration Is Working When:
- Supabase logs show: `[LocalLink] Sale notification SUCCESS`
- Sales appear in Local-Link dashboard
- Partner attribution is correct

### ❌ Needs Attention When:
- Logs show: `[LocalLink] Integration not configured`
- Logs show: `401 Unauthorized` or `404 Not Found`
- Sales not appearing in Local-Link

---

## Summary

**You need 4 values from Local-Link:**
1. `LOCAL_LINK_INGEST_SECRET` (for authentication)
2. `LOCAL_LINK_API_KEY` (for API calls)
3. `LOCAL_LINK_INGEST_URL` (sale endpoint)
4. `LOCAL_LINK_WEBHOOK_URL` (webhook endpoint)

**Once you have them:**
1. Add to `.env` file
2. Make a test purchase
3. Verify in Local-Link dashboard

**The integration is already live and waiting for your credentials!**
