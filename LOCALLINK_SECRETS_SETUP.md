# LocalLink Integration Secrets Setup

## Required Secrets for FrontDesk AI Pro

These secrets enable FrontDesk AI Pro to send sale notifications back to LocalLink for partner attribution and commission tracking.

### Where to Set These

**Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/functions
2. Click "Environment Variables"
3. Add these 4 secrets:

### The 4 Required Secrets

#### 1. `LOCALLINK_INGEST_URL`
- **Purpose:** Endpoint where FrontDesk AI Pro sends sale data
- **Example:** `https://app.local-link.com/api/ingest/sale`
- **Get it from:** Local-Link Documentation or support team

#### 2. `LOCALLINK_INGEST_SECRET`
- **Purpose:** Authentication secret for sending sale data
- **Format:** Usually starts with `sk_live_` or similar
- **Get it from:** Local-Link Dashboard → Settings → API Keys → "Ingest Secret"

#### 3. `LOCAL_LINK_WEBHOOK_URL`
- **Purpose:** Callback endpoint for refunds/updates
- **Example:** `https://app.local-link.com/api/webhooks/frontdesk-ai-pro`
- **Get it from:** Local-Link Documentation or support team

#### 4. `LOCAL_LINK_API_KEY`
- **Purpose:** General API authentication
- **Format:** Usually starts with `pk_live_` or similar
- **Get it from:** Local-Link Dashboard → Settings → API Keys → "API Key"

---

## How to Get These Values

### Contact Local-Link Team

Send this message to Local-Link support:

> Hi! I'm setting up FrontDesk AI Pro integration with Local-Link for automatic sales attribution.
>
> I need the following credentials for production:
>
> 1. **LOCALLINK_INGEST_SECRET** - Authentication secret for sale notifications
> 2. **LOCAL_LINK_API_KEY** - API key for general authentication
> 3. **LOCALLINK_INGEST_URL** - Endpoint URL for sending sale data
> 4. **LOCAL_LINK_WEBHOOK_URL** - Webhook callback endpoint
>
> Please provide the production values for my FrontDesk AI Pro account.

---

## Via Supabase CLI (Alternative)

```bash
# After getting values from Local-Link, set them:
supabase secrets set LOCALLINK_INGEST_URL="https://your-url.com/api/ingest/sale"
supabase secrets set LOCALLINK_INGEST_SECRET="sk_live_your_secret_here"
supabase secrets set LOCAL_LINK_WEBHOOK_URL="https://your-url.com/api/webhooks/frontdesk"
supabase secrets set LOCAL_LINK_API_KEY="pk_live_your_key_here"
```

---

## Testing the Integration

After setting secrets:

1. Make a test purchase in FrontDesk AI Pro
2. Check Supabase Edge Function logs for: `[LocalLink] Sale notification SUCCESS`
3. Verify sale appears in Local-Link dashboard with correct partner attribution

---

## What These Enable

With these secrets configured, every FrontDesk AI Pro sale will:

✅ Automatically notify LocalLink
✅ Attribute the sale to the referring partner
✅ Trigger partner commission calculations
✅ Enable refund handling via webhook callbacks

This ensures partners get credit for every sale they refer!
