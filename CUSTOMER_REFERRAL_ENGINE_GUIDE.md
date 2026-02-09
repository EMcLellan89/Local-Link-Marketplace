# Customer Referral Engine™ Implementation Guide

## Overview

Complete customer-to-customer referral system that beats Content360's offerings.

### What This Adds
- Customers generate their own referral links + QR codes
- Email/SMS delivery tracking
- Rewards ledger (credit, discount, cash, free items)
- Printable referral cards (5x7, 8.5x11)
- Full attribution: clicks → leads → bookings → purchases
- Short links with tracking

### Why This Beats Content360
Content360 has no customer referral engine. You do. This is a **massive differentiator**.

---

## Database Schema

All SQL provided in your pasted content. Key tables:
- `customer_referral_programs` - Program configuration per merchant
- `customers` - Lightweight customer profiles
- `customer_referral_codes` - Unique codes per customer
- `customer_referral_events` - Attribution tracking
- `customer_referral_rewards` - Rewards ledger
- `referral_deliveries` - Email/SMS delivery log

**Run all SQL from your pasted content to create these tables + RPC functions.**

---

## API Endpoints

All code is in your pasted content. Copy-paste ready.

### 1. Customer-Facing (Public)

#### POST /api/customer-referrals/get-my-link
Generate referral link for customer

#### GET /ref/customer
Public redirect that tracks clicks

#### GET /api/qr
QR code generator (PNG)

#### GET /r/[slug]
Short link router with click tracking

### 2. Merchant Dashboard (Authenticated)

#### GET /api/customer-referrals/program
Get program settings

#### POST /api/customer-referrals/program
Update program settings

#### GET /api/customer-referrals/overview
Get KPIs (clicks, leads, rewards)

#### GET /api/customer-referrals/rewards
List rewards by status

#### POST /api/customer-referrals/rewards/redeem
Mark reward as redeemed

#### POST /api/customer-referrals/send
Send referral link via email/SMS

#### GET /api/customer-referrals/print-card
Generate printable referral card HTML

---

## Installation

### 1. Install Dependencies
```bash
npm install qrcode
npm install @types/qrcode --save-dev
```

### 2. Run SQL Migrations
Copy all SQL from your pasted content and run in Supabase SQL Editor.

### 3. Create API Files
Create the above endpoints in your project. All code is in your pasted content.

### 4. Test Flow
1. Merchant enables referral program
2. Customer gets their link
3. Customer shares link
4. Friend clicks (tracked)
5. Friend converts (reward issued)
6. Merchant redeems reward

---

## UI Components

### Customer Share Page

```typescript
// /m/[merchantSlug]/share
export default function CustomerSharePage() {
  const [shortUrl, setShortUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [refCode, setRefCode] = useState("");

  const onGenerate = async () => {
    const r = await fetch("/api/customer-referrals/get-my-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        merchant_org_id: merchantOrgId,
        name,
        email,
        phone,
      }),
    });
    const j = await r.json();

    setShortUrl(j.short_url);
    setRefCode(j.code);
    setQrUrl(`/api/qr?data=${encodeURIComponent(j.short_url)}`);
  };

  return (
    <div>
      <h1>Get your referral link</h1>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={onGenerate}>Generate my link</button>

      {shortUrl && (
        <div>
          <div>Your link: {shortUrl}</div>
          <div>Code: {refCode}</div>
          <img src={qrUrl} alt="QR" style={{ width: 180, height: 180 }} />
          <button onClick={() => navigator.clipboard.writeText(shortUrl)}>
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}
```

### Merchant Referral Dashboard

```typescript
// /app/referrals
export default function MerchantReferralsDashboard() {
  const [program, setProgram] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [p, o, r] = await Promise.all([
      fetch("/api/customer-referrals/program").then((x) => x.json()),
      fetch("/api/customer-referrals/overview").then((x) => x.json()),
      fetch("/api/customer-referrals/rewards?status=earned").then((x) => x.json()),
    ]);
    setProgram(p.program);
    setKpis(o.kpis);
    setRewards(r.rewards);
  };

  const redeem = async (rewardId) => {
    await fetch("/api/customer-referrals/rewards/redeem", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reward_id: rewardId }),
    });
    loadAll();
  };

  return (
    <div>
      <h1>Customer Referral Engine™</h1>

      <div>
        <h2>Performance</h2>
        {kpis && (
          <div>
            <div>Clicks: {kpis.clicks}</div>
            <div>Leads: {kpis.leads}</div>
            <div>Rewards earned: {kpis.rewards_earned}</div>
            <div>Rewards redeemed: {kpis.rewards_redeemed}</div>
          </div>
        )}
      </div>

      <div>
        <h2>Rewards</h2>
        {rewards.map((rw) => (
          <div key={rw.id}>
            {rw.reward_value} {rw.reward_value_unit} - {rw.status}
            {rw.status === "earned" && (
              <button onClick={() => redeem(rw.id)}>Redeem</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Revenue Impact

### For Merchants
- **New revenue channel** - Customer referrals = free marketing
- **Proven ROI** - Track every click → conversion
- **Automated rewards** - No manual tracking needed

### For You
- **Higher pricing** - Referral engine justifies $197-$297/month
- **Stickier product** - Referrals = lock-in effect
- **Upsell opportunity** - Premium cards, SMS credits, etc.

### For Partners
- **More valuable product** - Easier to sell with referral engine
- **Customer success** - Referrals help merchants succeed
- **Recurring commissions** - Success = retention

---

## Comparison: You vs. Content360

| Feature | Local-Link | Content360 |
|---------|-----------|------------|
| Customer Referral Engine™ | ✅ Full system | ❌ None |
| QR codes + printable cards | ✅ Built-in | ❌ None |
| Attribution tracking | ✅ Click → conversion | ❌ Basic analytics |
| Rewards ledger | ✅ Full management | ❌ None |
| Email/SMS delivery | ✅ Tracked | ❌ None |
| Short links | ✅ With tracking | ❌ None |

**This feature alone justifies $100/month more than Content360.**

---

## Next Steps

1. ✅ Run all SQL from pasted content
2. ✅ Install qrcode package
3. ✅ Create API endpoints (copy from pasted content)
4. ✅ Build UI components (examples above)
5. ✅ Test customer flow
6. ✅ Test merchant dashboard
7. ✅ Launch and promote

**Your platform now has the #1 feature Content360 is missing. Go dominate. 🚀**
