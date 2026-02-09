# Partner "Share & Earn" Tracking System

## Overview

The Share & Earn system allows partners to share tracked links to any product/service and earn commissions automatically — without running ads themselves (which prevents Facebook account bans).

---

## 🎯 Core Concept

**YOU run the ads** → Partners share links organically → AI bots close deals → Commissions tracked automatically

### Why This Works

✅ **Facebook-safe**: Only YOUR business manager runs ads
✅ **No partner ad accounts needed**: Prevents bans/rejections
✅ **100% organic sharing**: Partners share on social, DMs, groups
✅ **Full attribution**: Every click tracked to partner
✅ **Clean compliance**: No affiliate policy violations

---

## 🔗 Partner Slug System

### How It Works

Every partner gets a unique slug in their partner record:

**Partner Slug Format**: `/p/{partner_id}` or `/p/{custom_slug}`

**Example**:
```
Partner ID: 48392
Partner Slug: locallinkmarketplace.com/p/48392
```

**Or custom** (if allowed):
```
Partner: John Smith
Custom Slug: locallinkmarketplace.com/p/johnsmith
```

### URL Structure

**Product URL**:
```
locallinkmarketplace.com/marketplace/autoscale
```

**Partner Tracked URL**:
```
locallinkmarketplace.com/p/48392/marketplace/autoscale
```

**Business Sale URL**:
```
locallinkmarketplace.com/p/48392/business/hvac-pros-denver
```

---

## 📍 "Share & Earn" Button (UI Spec)

### Placement

Every page with a product/service MUST have:

**Button Location**: Top right of page header

**Button Design**:
```
[🔗 Share & Earn]
```

**Styling**:
- Small, non-intrusive
- Green gradient (matches earnings/money theme)
- Icon: Link or Share icon from lucide-react
- Sticky on scroll (optional)

### Button States

**Not Logged In as Partner**:
- Button hidden OR
- Shows "Become a Partner" link

**Logged In as Partner**:
- Button active and clickable
- Shows partner's unique link

### Click Behavior

When partner clicks "Share & Earn":

1. Modal/drawer opens
2. Shows partner's unique tracked link
3. One-click copy to clipboard
4. Share buttons: Facebook, Twitter, LinkedIn, Email
5. QR code (optional, for in-person)

---

## 🎨 Share Modal Design

### Modal Content

**Header**:
```
Share This & Earn {commission_percent}%
```

**Tracked Link Display**:
```
Your Unique Link:
┌──────────────────────────────────────┐
│ locallinkmarketplace.com/p/48392/... │  [Copy]
└──────────────────────────────────────┘
```

**Share Buttons**:
- Facebook
- Twitter/X
- LinkedIn
- WhatsApp
- Copy Link
- Email

**Commission Preview**:
```
Commission: {commission_percent}%

Example:
If this product sells for $497:
Your commission: ${commission_amount}
```

**How to Share**:
- Post on your Facebook timeline
- Share in relevant Facebook groups
- Send via direct message
- Add to your email signature
- Share in LinkedIn posts

---

## 📊 Tracking Implementation

### Frontend (React)

**Share Button Component**:
```typescript
import { Link, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ShareAndEarnButton({
  pageUrl,
  productName,
  commissionPercent
}) {
  const { user, partner } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Generate partner tracking URL
  const trackedUrl = `${window.location.origin}/p/${partner.slug}${pageUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trackedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!partner) return null; // Hide for non-partners

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700"
      >
        <Link className="w-4 h-4" />
        Share & Earn
      </button>

      {/* Modal implementation */}
      {showModal && (
        <ShareModal
          trackedUrl={trackedUrl}
          productName={productName}
          commissionPercent={commissionPercent}
          onClose={() => setShowModal(false)}
          onCopy={handleCopy}
          copied={copied}
        />
      )}
    </>
  );
}
```

### Backend (Tracking)

**Supabase Table**: `partner_tracking_clicks` (already exists)

**When partner link is clicked**:

1. Extract partner_id from URL `/p/{partner_id}`
2. Store click event:
   - partner_id
   - page_url
   - clicked_at timestamp
   - visitor IP/user agent
   - referrer

3. Set cookie/session:
   - `partner_ref={partner_id}`
   - Expires: 30 days (standard)

4. Redirect to actual page

**Edge Function**: `track-partner-click`

```typescript
Deno.serve(async (req) => {
  const url = new URL(req.url);
  const partnerId = url.pathname.split('/')[2]; // /p/{partner_id}/...
  const targetPath = url.pathname.replace(`/p/${partnerId}`, '');

  // Log click to database
  await supabase
    .from('partner_tracking_clicks')
    .insert({
      partner_id: partnerId,
      target_url: targetPath,
      referrer: req.headers.get('referer'),
      user_agent: req.headers.get('user-agent'),
      ip_address: req.headers.get('x-forwarded-for')
    });

  // Set cookie for attribution
  const headers = new Headers({
    'Location': targetPath,
    'Set-Cookie': `partner_ref=${partnerId}; Max-Age=2592000; Path=/; HttpOnly; Secure`
  });

  return new Response(null, {
    status: 302,
    headers
  });
});
```

---

## 💰 Commission Attribution

### On Purchase

When customer completes purchase:

1. Check for `partner_ref` cookie
2. If exists, attribute sale to that partner
3. Calculate commission using `get_partner_commission_rate_bps()`
4. Insert commission record
5. Clear or update cookie

**Commission Record**:
```sql
INSERT INTO marketplace_affiliate_commissions (
  affiliate_id, -- partner_id from cookie
  order_id,
  product_id,
  sale_amount_cents,
  commission_amount_cents,
  commission_rate_bps,
  status
) VALUES (
  partner_id_from_cookie,
  order_id,
  product_id,
  sale_amount,
  sale_amount * (commission_rate / 10000),
  commission_rate,
  'pending'
);
```

---

## 📈 Partner Dashboard Stats

### Tracking Performance Widget

**My Shared Links Performance**:
```
Total Clicks: 1,247
Conversions: 23
Conversion Rate: 1.84%
Total Earned: $4,582.50

Top Performing Links:
1. AutoScale™ → 487 clicks, 8 sales, $1,960
2. Financial Engine → 312 clicks, 6 sales, $1,478
3. Business Deals → 284 clicks, 5 sales, $840
```

### Individual Link Stats

Partner can see performance per product:

```
Product: Local-Link AutoScale™

Your Link:
locallinkmarketplace.com/p/48392/marketplace/autoscale

Performance:
- Clicks: 487
- Sales: 8
- Commission Earned: $1,960
- Best Platform: Facebook Groups (312 clicks)

[View Analytics] [Share Again]
```

---

## 🎨 Frontend Routes

### Product Pages
Every product/service page needs:

```typescript
<ShareAndEarnButton
  pageUrl="/marketplace/autoscale"
  productName="AutoScale™"
  commissionPercent={partnerCommissionRate}
/>
```

### Business Sale Pages

```typescript
<ShareAndEarnButton
  pageUrl={`/business/${business.slug}`}
  productName={business.name}
  commissionPercent={partnerCommissionRate}
/>
```

### Course Pages

```typescript
<ShareAndEarnButton
  pageUrl={`/academy/course/${courseSlug}`}
  productName={courseName}
  commissionPercent={partnerCommissionRate}
/>
```

---

## 🔐 Security Considerations

### Cookie Security
- HttpOnly (prevents JavaScript access)
- Secure (HTTPS only)
- SameSite=Strict (CSRF protection)
- 30-day expiration (industry standard)

### Fraud Prevention
- Track IP addresses
- Detect self-referrals (partner IP = customer IP)
- Flag suspicious patterns:
  - Same IP multiple purchases
  - Rapid-fire clicks
  - Click-to-purchase < 30 seconds

### Double Attribution
If customer has:
- Partner cookie (from link share)
- Campaign referral (from YOUR ads)

**Priority**:
1. Partner link (most recent)
2. Campaign referral (fallback)

---

## 📱 Mobile Optimization

### Share Sheet (Native)

On mobile, use Web Share API:

```typescript
const handleMobileShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: productName,
        text: `Check out ${productName}`,
        url: trackedUrl
      });
    } catch (err) {
      // Fallback to copy
      handleCopy();
    }
  }
};
```

---

## 🚀 Implementation Checklist

### Frontend
- [ ] Create `ShareAndEarnButton` component
- [ ] Add to all product pages
- [ ] Add to all business sale pages
- [ ] Add to all course pages
- [ ] Create share modal/drawer
- [ ] Implement copy-to-clipboard
- [ ] Add social share buttons
- [ ] Mobile Web Share API

### Backend
- [ ] Create `/p/{partner_id}/*` route handler
- [ ] Deploy `track-partner-click` edge function
- [ ] Cookie setting logic
- [ ] Click tracking to database
- [ ] Commission attribution on purchase
- [ ] Fraud detection rules

### Partner Dashboard
- [ ] Tracking performance widget
- [ ] Link performance breakdown
- [ ] QR code generator (optional)
- [ ] Share link history

### Admin Tools
- [ ] Partner link generator
- [ ] Custom slug assignment
- [ ] Click/conversion reports
- [ ] Fraud detection alerts

---

## 📊 Analytics & Reporting

### Partner View
- Total clicks this week/month
- Conversion rate
- Best performing links
- Earnings per link

### Admin View
- Total partner-driven traffic
- Conversion rates by partner tier
- Top performing partners
- Link sharing velocity

---

## ✅ Status

- [x] Database schema ready (`partner_tracking_clicks` exists)
- [x] Commission system ready (`get_partner_commission_rate_bps`)
- [ ] Share button component (needs build)
- [ ] Tracking route handler (needs build)
- [ ] Cookie attribution logic (needs build)
- [ ] Partner dashboard widget (needs build)

---

*Last Updated: 2026-02-07*
