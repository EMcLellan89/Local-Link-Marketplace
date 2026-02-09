# Referral Verification System - Complete Implementation Guide

## Overview

This system enables partner referral tracking across signup and checkout flows with:
- **Referral ID# 2428** = silent lifetime-free trigger (no "Friends & Family" language)
- **Auto-verification** from `?ref=partner_slug` links
- **Manual entry** with Referral Name + Referral ID# verification
- **Complete attribution** chain stored in database

---

## 1. Endpoint: GET /functions/v1/referral-resolve

### Purpose
Resolves a referral by partner slug OR manual ID entry. Returns verification status.

### Request Examples

**Auto-verify from link:**
```
GET /functions/v1/referral-resolve?ref=john-smith-3817
```

**Manual verification:**
```
GET /functions/v1/referral-resolve?referral_id=3817&referral_name=John%20Smith
```

**Special case (ID 2428):**
```
GET /functions/v1/referral-resolve?referral_id=2428&referral_name=Family
```

### Response Format

**Success (normal partner):**
```json
{
  "ok": true,
  "verified": true,
  "partner": {
    "id": "uuid",
    "display_name": "John Smith",
    "tier": "pro",
    "status": "active"
  },
  "referral": {
    "referral_name": "John Smith",
    "referral_id": 3817,
    "partner_id": "uuid",
    "grants_lifetime_free": false
  }
}
```

**Success (ID 2428 - silent lifetime free):**
```json
{
  "ok": true,
  "verified": true,
  "partner": null,
  "referral": {
    "referral_name": "Family",
    "referral_id": 2428,
    "partner_id": null,
    "grants_lifetime_free": true
  }
}
```

**Error:**
```json
{
  "ok": false,
  "verified": false,
  "error": "Invalid Referral ID#"
}
```

---

## 2. Signup Page Wiring (`/register`)

### State Variables
```typescript
const [wasReferred, setWasReferred] = useState(false);
const [referralName, setReferralName] = useState('');
const [referralId, setReferralId] = useState('');
const [refVerified, setRefVerified] = useState(false);
const [refVerifyMsg, setRefVerifyMsg] = useState('');
const [refGrantsLifetime, setRefGrantsLifetime] = useState(false);
const [refPartnerDisplay, setRefPartnerDisplay] = useState('');
const [verifyingRef, setVerifyingRef] = useState(false);
const [autoFilled, setAutoFilled] = useState(false);
```

### Auto-fill from ?ref= Query Param
```typescript
useEffect(() => {
  const refSlug = searchParams.get('ref');
  if (refSlug) {
    setWasReferred(true);
    setAutoFilled(true);
    verifyReferralBySlug(refSlug);
  }
}, [searchParams]);

async function verifyReferralBySlug(refSlug: string) {
  setVerifyingRef(true);

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/referral-resolve?ref=${encodeURIComponent(refSlug)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();

  if (data.ok && data.verified) {
    setRefVerified(true);
    setReferralName(data.referral.referral_name || '');
    setReferralId(String(data.referral.referral_id || ''));
    setRefGrantsLifetime(data.referral.grants_lifetime_free || false);
    setRefPartnerDisplay(data.partner?.display_name || '');
  }

  setVerifyingRef(false);
}
```

### Manual Verification Button
```typescript
async function verifyReferralManual() {
  if (!referralId) {
    setRefVerifyMsg('Please enter Referral ID#');
    return;
  }

  setVerifyingRef(true);

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/referral-resolve?referral_id=${encodeURIComponent(referralId)}&referral_name=${encodeURIComponent(referralName)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = await response.json();

  if (data.ok && data.verified) {
    setRefVerified(true);
    setReferralName(data.referral.referral_name || referralName);
    setReferralId(String(data.referral.referral_id || ''));
    setRefGrantsLifetime(data.referral.grants_lifetime_free || false);
  } else {
    setRefVerified(false);
    setRefVerifyMsg(data.error || 'Invalid referral');
  }

  setVerifyingRef(false);
}
```

### UI Component Structure
```jsx
<div className="border-t border-slate-200 pt-4">
  {/* Checkbox Toggle */}
  <label className="flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={wasReferred}
      onChange={(e) => setWasReferred(e.target.checked)}
      disabled={autoFilled}
    />
    <span>I was referred by a Partner</span>
  </label>

  {wasReferred && (
    <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
      {/* Show inputs if NOT auto-filled from link */}
      {!autoFilled && (
        <>
          <Input
            label="Referral Name"
            placeholder="e.g., John Smith"
            value={referralName}
            onChange={(e) => setReferralName(e.target.value)}
          />
          <Input
            type="number"
            label="Referral ID#"
            placeholder="e.g., 3817"
            value={referralId}
            onChange={(e) => setReferralId(e.target.value)}
          />
          <Button onClick={verifyReferralManual} disabled={verifyingRef || !referralId}>
            {verifyingRef ? 'Verifying...' : 'Verify Referral'}
          </Button>
        </>
      )}

      {/* Show read-only if auto-filled */}
      {autoFilled && (
        <div className="text-sm text-slate-600">
          <div><strong>Referral Name:</strong> {referralName}</div>
          <div><strong>Referral ID#:</strong> {referralId}</div>
        </div>
      )}

      {/* Verification Status */}
      {refVerified && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded">
          <CheckCircle className="w-4 h-4" />
          <span>✓ Verified{refPartnerDisplay ? ` - ${refPartnerDisplay}` : ''}</span>
        </div>
      )}

      {!refVerified && refVerifyMsg && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded">
          <XCircle className="w-4 h-4" />
          <span>{refVerifyMsg}</span>
        </div>
      )}
    </div>
  )}
</div>
```

### Form Submission Validation
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Block if referral was started but not verified
  if (wasReferred && !refVerified) {
    setError('Please verify referral before creating account');
    return;
  }

  await signUp(email, password, role);

  // Store referral in profiles after signup
  if (wasReferred && refVerified && referralId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({
        referral_name: referralName || null,
        referral_id: referralId ? Number(referralId) : null,
      }).eq('id', user.id);
    }
  }

  navigate('/dashboard');
};
```

---

## 3. Checkout Page Wiring (Marketplace/Academy)

### Reusable Component
We've created a reusable `ReferralVerification` component at:
```
/src/components/ReferralVerification.tsx
```

### Usage in Checkout Flow
```typescript
import ReferralVerification from '../components/ReferralVerification';

function CheckoutPage() {
  const [referralData, setReferralData] = useState<{
    referralName: string;
    referralId: string;
    partnerId: string | null;
    grantsLifetimeFree: boolean;
  } | null>(null);

  return (
    <div>
      {/* Your product selection UI */}

      {/* Referral Verification Section */}
      <ReferralVerification
        onVerified={(data) => setReferralData(data)}
      />

      {/* Checkout Button */}
      <Button onClick={handleCheckout}>
        Complete Purchase
      </Button>
    </div>
  );
}
```

### Checkout API Call
```typescript
async function handleCheckout() {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-marketplace-checkout-session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        product_slug: selectedProduct.slug,
        pricing: selectedPricing,
        ref: searchParams.get('ref') || undefined,
        referral_name: referralData?.referralName || undefined,
        referral_id: referralData?.referralId || undefined,
      }),
    }
  );

  const data = await response.json();

  // Redirect to Stripe or handle lifetime-free flow
  if (data.stripe_checkout_url) {
    window.location.href = data.stripe_checkout_url;
  } else if (data.comped) {
    // ID 2428 bypasses Stripe, grants lifetime free
    navigate('/partner/welcome?comped=1');
  }
}
```

---

## 4. Backend: Checkout Session Creation

The `create-marketplace-checkout-session` function now:

### Resolves Referrals
```typescript
let partner: any = null;
let resolvedReferralId: number | null = null;
let resolvedReferralName: string | null = null;
let grantsLifetimeFree = false;

// Special case: referral_id=2428 grants lifetime free
if (referral_id && Number(referral_id) === 2428) {
  resolvedReferralId = 2428;
  resolvedReferralName = referral_name || "Family";
  grantsLifetimeFree = true;
  partner = null;
} else if (ref) {
  // Resolve by partner slug
  const { data: p } = await supabaseAdmin
    .from("partners")
    .select("id, referral_id, display_name, tier, status")
    .eq("referral_partner_link_slug", ref)
    .maybeSingle();

  if (p && p.status === "active") {
    partner = p;
    resolvedReferralId = p.referral_id;
    resolvedReferralName = p.display_name || referral_name;
  }
} else if (referral_id) {
  // Resolve by manually entered referral_id
  const { data: p } = await supabaseAdmin
    .from("partners")
    .select("id, referral_id, display_name, tier, status")
    .eq("referral_id", Number(referral_id))
    .maybeSingle();

  if (p && p.status === "active") {
    partner = p;
    resolvedReferralId = p.referral_id;
    resolvedReferralName = p.display_name || referral_name;
  }
}
```

### Stores in Checkout Session
```typescript
await supabaseAdmin
  .from("marketplace_checkout_sessions")
  .insert({
    product_id: product.id,
    price_id: price.id,
    partner_id: partner?.id ?? null,
    referral_name: resolvedReferralName,
    referral_id: resolvedReferralId,
    // ... other fields
  });
```

### Attaches to Stripe Metadata
```typescript
const stripeSession = await stripe.checkout.sessions.create({
  // ... other params
  metadata: {
    product_id: product.id,
    price_id: price.id,
    partner_id: partner?.id ?? "",
    referral_name: resolvedReferralName ?? "",
    referral_id: resolvedReferralId ? String(resolvedReferralId) : "",
    // ... other metadata
  },
});
```

---

## 5. Database Schema

### Tables with Referral Tracking

**profiles:**
```sql
alter table profiles
add column referral_name text,
add column referral_id int;
```

**partners:**
```sql
alter table partners
add column referral_id int unique;
```

**marketplace_checkout_sessions:**
```sql
alter table marketplace_checkout_sessions
add column referral_name text,
add column referral_id int;
```

**marketplace_orders (created by webhook):**
```sql
alter table marketplace_orders
add column referral_name text,
add column referral_id int;
```

### Helper Functions

**Get next partner referral ID:**
```sql
select public.next_partner_referral_id();
-- Returns: 3000, 3001, 3002... (never 2428)
```

**Validate referral:**
```sql
select public.validate_referral(
  p_referral_id := 3817,
  p_ref_slug := null
);
```

Returns:
```json
{
  "valid": true,
  "referral_id": 3817,
  "partner_id": "uuid",
  "partner_name": "John Smith",
  "tier": "pro",
  "grants_lifetime_free": false
}
```

---

## 6. Special Case: ID 2428 (Silent Lifetime Free)

### No "Friends & Family" Language Anywhere
- UI just shows: "✓ Verified"
- No special badges, no special messaging
- Backend silently handles lifetime-free grant

### How It Works

**In referral-resolve endpoint:**
```typescript
if (referral_id === "2428") {
  return {
    ok: true,
    verified: true,
    partner: null,
    referral: {
      referral_name: referral_name || "Family",
      referral_id: 2428,
      partner_id: null,
      grants_lifetime_free: true,
    },
  };
}
```

**In checkout creation:**
```typescript
if (referral_id && Number(referral_id) === 2428) {
  // Bypass Stripe entirely
  // Grant lifetime partner-side subscription
  // No commissions created
  return { ok: true, comped: true, redirect_url: "/partner/welcome?comped=1" };
}
```

---

## 7. Testing Flows

### Test 1: Partner Link Auto-Verify
1. Visit: `/register?ref=john-smith-3817`
2. ✓ Checkbox auto-checked
3. ✓ Referral fields auto-filled
4. ✓ Status shows "Verified - John Smith"
5. ✓ Submit creates account with referral stored

### Test 2: Manual Entry
1. Visit: `/register`
2. Check "I was referred by a Partner"
3. Enter: Name = "Jane Doe", ID# = 4102
4. Click "Verify Referral"
5. ✓ Shows "Verified - Jane Doe"
6. ✓ Submit stores referral_id=4102

### Test 3: ID 2428 (Silent Free)
1. Visit: `/register`
2. Check "I was referred by a Partner"
3. Enter: Name = "Family", ID# = 2428
4. Click "Verify Referral"
5. ✓ Shows "Verified" (no partner name)
6. ✓ Submit grants lifetime-free access
7. ✓ No "Friends & Family" language anywhere

### Test 4: Checkout with Referral
1. Visit: `/marketplace/products/core-academy?ref=john-smith-3817`
2. ✓ Referral auto-verified
3. Click "Purchase"
4. ✓ Stripe metadata includes referral_id + referral_name
5. ✓ After payment, webhook creates commission for partner

---

## 8. Production Checklist

### Frontend
- [x] Signup page has referral section
- [x] Checkout pages have referral section
- [x] Auto-fill from ?ref= links
- [x] Manual verification with "Verify" button
- [x] Validation prevents unverified referrals
- [x] No "Friends & Family" language

### Backend
- [x] `referral-resolve` endpoint deployed
- [x] Checkout session stores referral fields
- [x] Stripe metadata includes referral data
- [x] ID 2428 bypasses Stripe (lifetime free)
- [x] Database columns added to all tables
- [x] Helper functions created

### Database
- [x] `referral_id` and `referral_name` columns added
- [x] Indexes created for performance
- [x] Sequence created (starts at 3000)
- [x] ID 2428 permanently reserved

### Security
- [x] Referral validation prevents fake IDs
- [x] Active partner status checked
- [x] No commissions created for ID 2428
- [x] RLS policies inherited from parent tables

---

## 9. Key URLs

**Production:**
- Signup with referral: `https://app.local-link.com/register?ref=partner-slug`
- Checkout with referral: `https://app.local-link.com/marketplace/products/slug?ref=partner-slug`

**API Endpoints:**
- Verify referral: `GET /functions/v1/referral-resolve?referral_id=3817`
- Create checkout: `POST /functions/v1/create-marketplace-checkout-session`

---

## 10. Success Criteria

✅ **Partner Attribution:** Every sale tracks referral_name + referral_id
✅ **No Disputes:** Referral ID# is the source of truth
✅ **Clean Commissions:** Partners only earn on verified active referrals
✅ **Silent Comp:** ID 2428 grants lifetime free without public messaging
✅ **Audit Trail:** Full referral data stored in orders table forever
✅ **PE-Ready:** Clean data structure ready for acquisition due diligence

---

## Complete! 🎉

The referral verification system is fully operational with:
- ✅ Edge function deployed (`referral-resolve`)
- ✅ Signup page updated with auto-verify + manual entry
- ✅ Checkout session creation handles all referral cases
- ✅ Database migrations applied
- ✅ ID 2428 permanently reserved (silent lifetime-free)
- ✅ Build successful

All referral data flows from URL → verification → checkout → Stripe → webhook → commissions.
