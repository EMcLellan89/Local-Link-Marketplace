# Admin Affiliate Payout System - Implementation Guide

## 🎯 Overview

Complete admin toolkit for managing affiliate commissions and payouts through RPC functions and a streamlined UI workflow.

---

## 🔧 Available RPC Functions

### 1. approve_affiliate_commissions

**Purpose**: Batch approve pending commissions

**Usage**:
```typescript
const { data, error } = await supabase.rpc('approve_affiliate_commissions', {
  commission_ids: [
    'uuid-1',
    'uuid-2',
    'uuid-3'
  ]
});

// Returns:
{
  success: true,
  updated_count: 3,
  total_approved_cents: 5880
}
```

**Behavior**:
- Only updates commissions with `status = 'pending'`
- Automatically recalculates partner pending amounts
- Returns count and total approved value

---

### 2. process_affiliate_payout

**Purpose**: Process payment and mark commissions as paid

**Usage**:
```typescript
const { data, error } = await supabase.rpc('process_affiliate_payout', {
  p_commission_ids: ['uuid-1', 'uuid-2'],
  p_payout_method: 'paypal',
  p_transaction_id: 'PAYPAL_TXN_123456',
  p_notes: 'Monthly payout - January 2026'
});

// Returns:
{
  success: true,
  payout_id: 'uuid',
  partner_id: 'uuid',
  amount_cents: 5880,
  commission_count: 2
}
```

**Behavior**:
- Only processes commissions with `status = 'approved'`
- All commissions must belong to same partner
- Creates payout record in `affiliate_payouts`
- Updates commission status to `paid`
- Updates partner totals

**Validation**:
- Returns error if commissions not approved
- Returns error if multiple partners in batch
- Returns error if no commissions found

---

### 3. get_pending_commissions_by_partner

**Purpose**: Get all pending commissions grouped by partner

**Usage**:
```typescript
const { data, error } = await supabase.rpc('get_pending_commissions_by_partner');

// Returns array:
[
  {
    partner_id: 'uuid',
    partner_name: 'Acme Marketing',
    partner_email: 'partner@acme.com',
    referral_code: 'ACME2026',
    commission_rate: 0.20,
    total_pending_cents: 5880,
    commission_count: 3,
    oldest_commission_date: '2026-01-01T12:00:00Z',
    commission_ids: ['uuid-1', 'uuid-2', 'uuid-3']
  }
]
```

**Use Case**: Perfect for admin dashboard showing all partners awaiting payout

---

### 4. cancel_affiliate_commission

**Purpose**: Cancel/refund a commission (e.g., customer refund)

**Usage**:
```typescript
const { data, error } = await supabase.rpc('cancel_affiliate_commission', {
  p_commission_id: 'uuid',
  p_reason: 'Customer requested refund'
});

// Returns:
{
  success: true,
  commission_id: 'uuid',
  cancelled_amount_cents: 1940,
  reason: 'Customer requested refund'
}
```

**Behavior**:
- Updates commission status to `cancelled`
- Recalculates partner pending amounts
- Cannot cancel already paid commissions

---

### 5. get_partner_commission_summary

**Purpose**: Get detailed commission summary for a partner

**Usage**:
```typescript
const { data, error } = await supabase.rpc('get_partner_commission_summary', {
  p_partner_id: 'uuid'
});

// Returns:
{
  partner_id: 'uuid',
  total_commissions_cents: 15880,
  pending_cents: 3940,
  approved_cents: 5880,
  paid_cents: 6060,
  cancelled_cents: 0,
  total_count: 8,
  pending_count: 2,
  approved_count: 3,
  paid_count: 3
}
```

**Use Case**: Partner detail view showing complete commission history

---

## 🎨 Admin UI Implementation

### Pending Commissions Dashboard

```tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AffiliatePendingCommissions() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingCommissions();
  }, []);

  async function loadPendingCommissions() {
    const { data, error } = await supabase.rpc('get_pending_commissions_by_partner');
    if (error) {
      console.error(error);
      return;
    }
    setPartners(data || []);
    setLoading(false);
  }

  async function approveCommissions(commissionIds: string[]) {
    const { data, error } = await supabase.rpc('approve_affiliate_commissions', {
      commission_ids: commissionIds
    });

    if (error) {
      alert('Error approving commissions');
      return;
    }

    alert(`Approved ${data.updated_count} commissions totaling $${(data.total_approved_cents / 100).toFixed(2)}`);
    loadPendingCommissions();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Affiliate Commissions</h2>

      {partners.map((partner) => (
        <div key={partner.partner_id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{partner.partner_name}</h3>
              <p className="text-sm text-gray-600">{partner.partner_email}</p>
              <p className="text-sm text-gray-500">Code: {partner.referral_code}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ${(partner.total_pending_cents / 100).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                {partner.commission_count} commissions
              </div>
            </div>
          </div>

          <button
            onClick={() => approveCommissions(partner.commission_ids)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Approve All
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### Approved Commissions - Ready for Payout

```tsx
export default function ApprovedCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  async function loadApprovedCommissions() {
    const { data } = await supabase
      .from('affiliate_commissions')
      .select(`
        *,
        partners (
          id,
          company_name,
          email,
          payout_method,
          payout_details
        )
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    setCommissions(data || []);
  }

  async function processPayout(commissionIds: string[], transactionId: string) {
    const { data, error } = await supabase.rpc('process_affiliate_payout', {
      p_commission_ids: commissionIds,
      p_payout_method: 'paypal',
      p_transaction_id: transactionId,
      p_notes: 'Batch payout processed'
    });

    if (error) {
      alert('Payout failed: ' + error.message);
      return;
    }

    alert(`Payout successful! $${(data.amount_cents / 100).toFixed(2)} sent to partner`);
    loadApprovedCommissions();
  }

  // Group commissions by partner
  const groupedByPartner = commissions.reduce((acc, comm) => {
    const partnerId = comm.partners.id;
    if (!acc[partnerId]) {
      acc[partnerId] = {
        partner: comm.partners,
        commissions: [],
        total: 0
      };
    }
    acc[partnerId].commissions.push(comm);
    acc[partnerId].total += comm.commission_cents;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Approved - Ready for Payout</h2>

      {Object.entries(groupedByPartner).map(([partnerId, group]) => (
        <div key={partnerId} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">{group.partner.company_name}</h3>
              <p className="text-sm text-gray-600">{group.partner.email}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${(group.total / 100).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                {group.commissions.length} commissions
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {group.commissions.map((comm) => (
              <div key={comm.id} className="flex justify-between text-sm">
                <span>{comm.product_name}</span>
                <span className="font-semibold">
                  ${(comm.commission_cents / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const txnId = prompt('Enter PayPal Transaction ID:');
              if (txnId) {
                processPayout(
                  group.commissions.map(c => c.id),
                  txnId
                );
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Process Payout
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 Complete Admin Workflow

### Step 1: Review Pending Commissions
```typescript
// Load all pending commissions grouped by partner
const { data: pending } = await supabase.rpc('get_pending_commissions_by_partner');
```

**Display**:
- Partner name and contact
- Total pending amount
- Number of commissions
- Oldest commission date (aging)

**Actions**:
- Approve all for partner
- Approve individual commissions
- View commission details
- Cancel fraudulent commissions

---

### Step 2: Approve Commissions
```typescript
// Approve selected commissions
const { data } = await supabase.rpc('approve_affiliate_commissions', {
  commission_ids: selectedIds
});
```

**Validation**:
- Review for fraud patterns
- Verify order wasn't refunded
- Check partner agreement terms

---

### Step 3: Process Payout
```typescript
// Send payment via PayPal/Stripe/Bank
// Record transaction ID from payment provider

const { data } = await supabase.rpc('process_affiliate_payout', {
  p_commission_ids: approvedIds,
  p_payout_method: 'paypal',
  p_transaction_id: 'PAYPAL_TXN_123',
  p_notes: 'Monthly payout - January 2026'
});
```

**External Steps**:
1. Log into payment provider (PayPal, Stripe, etc)
2. Send payment to partner
3. Get transaction ID
4. Enter transaction ID in admin
5. System marks commissions as paid

---

### Step 4: Handle Refunds/Cancellations
```typescript
// If customer gets refund, cancel the commission
const { data } = await supabase.rpc('cancel_affiliate_commission', {
  p_commission_id: commissionId,
  p_reason: 'Customer refund processed'
});
```

---

## 📊 Admin Dashboard Metrics

### Key Performance Indicators

```typescript
// Total pending payouts
const { data: pending } = await supabase
  .from('affiliate_commissions')
  .select('commission_cents')
  .eq('status', 'pending');

const totalPending = pending.reduce((sum, c) => sum + c.commission_cents, 0);

// Total paid this month
const { data: paid } = await supabase
  .from('affiliate_commissions')
  .select('commission_cents')
  .eq('status', 'paid')
  .gte('paid_at', startOfMonth);

const totalPaidThisMonth = paid.reduce((sum, c) => sum + c.commission_cents, 0);

// Top performers
const { data: topAffiliates } = await supabase
  .from('partners')
  .select('company_name, total_commission_earned, total_conversions')
  .eq('affiliate_enabled', true)
  .order('total_commission_earned', { ascending: false })
  .limit(10);
```

---

## 🔒 Security Considerations

### Access Control
```typescript
// Check admin role before allowing function calls
const { data: { user } } = await supabase.auth.getUser();

const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (profile.role !== 'admin') {
  throw new Error('Unauthorized');
}
```

### Audit Trail
All payout functions automatically log:
- Who performed the action (via auth.uid())
- When it was performed
- What was changed
- Transaction IDs for external payments

### Fraud Detection
Monitor for:
- Same IP multiple referrals
- Suspicious conversion patterns
- Self-referrals
- Abnormally high conversion rates
- Chargebacks from referred customers

---

## 🚀 Automation Opportunities

### Auto-Approve Low-Risk Commissions
```sql
-- Commissions under $50 from established partners
UPDATE affiliate_commissions
SET status = 'approved'
WHERE status = 'pending'
  AND commission_cents < 5000
  AND partner_id IN (
    SELECT id FROM partners
    WHERE total_conversions > 10
    AND (SELECT COUNT(*) FROM affiliate_commissions WHERE partner_id = partners.id AND status = 'cancelled') = 0
  );
```

### Scheduled Payout Batches
```typescript
// Run every Monday morning
async function weeklyPayoutBatch() {
  const { data: readyForPayout } = await supabase
    .from('affiliate_commissions')
    .select('id, partner_id, commission_cents')
    .eq('status', 'approved')
    .gte('created_at', sevenDaysAgo);

  // Group by partner
  // Process PayPal mass payout
  // Call process_affiliate_payout for each partner
}
```

---

## 📧 Email Notifications

### Commission Approved
```typescript
// Send when admin approves
await sendEmail({
  to: partner.email,
  subject: 'Your commissions have been approved!',
  body: `You have $${amount} approved and will be paid out soon.`
});
```

### Payout Processed
```typescript
// Send when payment sent
await sendEmail({
  to: partner.email,
  subject: 'Payment sent - $' + amount,
  body: `Your commission payout has been sent via ${method}.
         Transaction ID: ${transactionId}
         Amount: $${amount}`
});
```

---

## 🧪 Testing

### Test Scenario 1: Complete Payout Flow
```typescript
// 1. Create test commission
const { data: commission } = await supabase
  .from('affiliate_commissions')
  .insert({
    partner_id: testPartnerId,
    product_slug: 'test-product',
    order_total_cents: 10000,
    commission_cents: 2000,
    status: 'pending'
  })
  .select()
  .single();

// 2. Approve
const { data: approved } = await supabase.rpc('approve_affiliate_commissions', {
  commission_ids: [commission.id]
});

console.assert(approved.success === true);
console.assert(approved.updated_count === 1);

// 3. Process payout
const { data: payout } = await supabase.rpc('process_affiliate_payout', {
  p_commission_ids: [commission.id],
  p_payout_method: 'test',
  p_transaction_id: 'TEST_123'
});

console.assert(payout.success === true);
console.assert(payout.amount_cents === 2000);

// 4. Verify status
const { data: verified } = await supabase
  .from('affiliate_commissions')
  .select('status')
  .eq('id', commission.id)
  .single();

console.assert(verified.status === 'paid');
```

---

## 📋 Quick Reference

### Payout Statuses
- **pending**: Awaiting admin approval
- **approved**: Approved, ready for payment
- **paid**: Payment sent, commission complete
- **cancelled**: Cancelled due to refund or fraud

### Typical Commission Rates
- Standard affiliates: 20%
- Premium affiliates: 25%
- VIP affiliates: 30%
- Strategic partners: Custom rates

### Payout Methods
- PayPal
- Stripe Connect
- Bank transfer
- Check (mail)
- Store credit

### Minimum Payout Thresholds
- Standard: $50
- Premium: $25
- VIP: $10 (fast track)

---

## 🎯 Success Metrics

Track these KPIs:
- Average time from pending → paid
- Percentage auto-approved
- Fraud rate (cancelled / total)
- Partner satisfaction score
- Payment processing costs
- Payout accuracy (zero errors)
