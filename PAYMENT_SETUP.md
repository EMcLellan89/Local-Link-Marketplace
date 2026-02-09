# Dual Payment Processor Setup

This platform uses **both Stripe and PayBright** for payment processing, providing redundancy and maximizing transaction success rates.

## Why Two Payment Processors?

Using multiple payment processors is a best practice because:

1. **Higher Approval Rates** - If one processor declines a transaction, the system automatically tries the other
2. **Redundancy** - If one service experiences downtime, payments continue processing
3. **Geographic Coverage** - Different processors have better performance in different regions
4. **Risk Management** - Diversifies merchant account risk
5. **Customer Preference** - Some customers may be blocked by one processor but not the other

## Current Configuration

### Stripe (Primary)
- **Use Cases**: All payments - course purchases, marketplace deals, subscriptions, merchant services
- **Advantages**: Global coverage, excellent documentation, easy integration, trusted worldwide
- **Status**: Primary payment processor for entire platform

### PayBright (Secondary/Backup)
- **Use Cases**: Automatic fallback for all payment types
- **Advantages**: Canadian market focus, flexible payment plans
- **Status**: Backup processor, activated if Stripe fails

## How the Fallback System Works

```
┌─────────────────┐
│ Payment Request │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Try Stripe      │────── Success ──────┐
│  (Primary)      │                     │
└────────┬────────┘                     │
         │                              │
      Failed                            │
         │                              │
         ▼                              ▼
┌─────────────────┐              ┌──────────┐
│ Try PayBright   │──── Success ──│ Complete │
│  (Fallback)     │              └──────────┘
└────────┬────────┘
         │
      Failed
         │
         ▼
  ┌──────────────┐
  │ Show Error   │
  │ Both Failed  │
  └──────────────┘
```

## Environment Variables Required

### Stripe Configuration (Required - Primary)
```env
STRIPE_SECRET_KEY=sk_live_xxx (or sk_test_xxx for testing)
STRIPE_PUBLISHABLE_KEY=pk_live_xxx (or pk_test_xxx for testing)
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Get your Stripe credentials:**
1. Sign up at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy your Secret and Publishable keys
4. For webhooks: Developers → Webhooks → Add endpoint

### PayBright Configuration (Optional - Backup)
```env
PAYBRIGHT_API_KEY=your_api_key
PAYBRIGHT_MERCHANT_ID=your_merchant_id
PAYBRIGHT_API_URL=https://api.paybright.com/v1
VITE_GOPAYBRIGHT_WEBHOOK_SECRET=your_webhook_secret
```

**Get your PayBright credentials:**
1. Sign up at https://gopaybright.com
2. Go to Dashboard → API Settings
3. Copy your API Key and Merchant ID
4. Generate a webhook secret for transaction verification

## Testing the Setup

### Check Payment Processor Status

```typescript
import { getAvailableProviders } from './lib/payments';

const providers = getAvailableProviders();
console.log('Available providers:', providers);
// Output: ['paybright', 'stripe'] or ['paybright'] or ['stripe']
```

### Test a Payment with Fallback

```typescript
import { initiatePayment } from './lib/payments';

const result = await initiatePayment({
  amount: 9999, // $99.99 in cents
  currency: 'USD',
  description: 'Test Purchase',
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  preferredProvider: 'stripe', // Will try PayBright if Stripe fails
});

if (result.success) {
  console.log(`Payment successful with ${result.provider}`);
  if (result.fallbackUsed) {
    console.log('Note: Fallback provider was used');
  }
} else {
  console.error('Payment failed:', result.error);
}
```

## Payment Flow by Feature

| Feature | Primary Processor | Fallback | Notes |
|---------|------------------|----------|-------|
| Course Purchases | Stripe | PayBright | Global audience, trusted brand |
| Marketplace Deals | Stripe | PayBright | Worldwide coverage |
| Subscriptions | Stripe | PayBright | Excellent recurring payment support |
| Merchant Services | Stripe | PayBright | B2B transactions |
| All Payments | Stripe | PayBright | Unified payment experience |

## Webhook Configuration

Both processors need webhook endpoints configured:

### Stripe Webhook (Primary)
- **URL**: `https://yourdomain.com/functions/v1/course-stripe-webhook`
- **Events**: checkout.session.completed, payment_intent.succeeded

### PayBright Webhook (Backup)
- **URL**: `https://yourdomain.com/functions/v1/paybright-webhook`
- **Events**: payment.succeeded, payment.failed, payment.refunded

## Monitoring & Logs

Monitor both payment processors:

1. **Stripe Dashboard**: https://dashboard.stripe.com (Primary)
   - Payment history
   - Dispute management
   - Webhook event logs
   - Real-time monitoring

2. **PayBright Dashboard**: https://dashboard.gopaybright.com (Backup)
   - Transaction history
   - Failed payments
   - Webhook logs

3. **Supabase Logs**: Check `paybright_transactions` table
   ```sql
   SELECT provider, status, COUNT(*) as count
   FROM paybright_transactions
   WHERE created_at > NOW() - INTERVAL '7 days'
   GROUP BY provider, status;
   ```

## Error Handling

The system automatically handles common scenarios:

- **Provider Down**: Switches to backup provider
- **Card Declined**: Can retry with different processor
- **Rate Limiting**: Queues requests and retries
- **Webhook Failures**: Stores for retry in `webhook_event_store` table

## Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Always verify webhook signatures** before processing
3. **Use HTTPS** for all payment communications
4. **Store credentials** in environment variables only
5. **Log failed transactions** for fraud detection
6. **Implement rate limiting** on payment endpoints

## Getting Help

- **Stripe Support** (Primary): https://support.stripe.com
- **PayBright Support** (Backup): https://gopaybright.com/support
- **Platform Issues**: Check logs in Supabase Dashboard

## Next Steps

1. **Add Stripe credentials** to your `.env` file (Required)
2. **Add PayBright credentials** for backup redundancy (Recommended)
3. Test with small amounts using Stripe test keys first
4. Monitor transaction success rates in Stripe Dashboard
5. Set up alerts for payment failures in both systems
6. Keep both processors active for maximum reliability

---

**Pro Tip**: Start with test/sandbox keys for both processors before going live. This lets you test the fallback system without risking real money.
