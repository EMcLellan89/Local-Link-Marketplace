# PayBright Payment Integration Guide

This guide explains how to use the PayBright payment processing integration in LocalLink Marketplace.

## Overview

PayBright is integrated for processing:
- Customer deal purchases
- Merchant subscription payments
- Merchant service payments
- One-time and recurring payments
- Full and partial refunds

## Features

- ✅ One-time payments
- ✅ Recurring subscriptions
- ✅ Full and partial refunds
- ✅ Webhook integration for real-time updates
- ✅ Sandbox and live environments
- ✅ Secure HMAC-SHA256 signature verification
- ✅ Transaction tracking and history

## Getting Started

### 1. Get PayBright Credentials

Contact the PayBright team to obtain:
- API Key (Account ID)
- API Token (Secret)
- Credentials for both sandbox and production environments

### 2. Configure PayBright in Merchant Dashboard

1. Log in as a merchant
2. Navigate to **Payment Settings** in the sidebar
3. Enter your PayBright credentials:
   - API Key
   - API Token
   - Select environment (Sandbox or Live)
4. Enable PayBright payments
5. Click **Save Configuration**

### 3. Database Tables

The integration creates the following tables:

- `paybright_config` - Merchant PayBright configuration
- `paybright_transactions` - All payment transactions
- `paybright_subscriptions` - Recurring subscription management
- `paybright_refunds` - Refund tracking
- `paybright_webhook_events` - Webhook event logs

### 4. Edge Functions

Three Edge Functions handle payment processing:

#### paybright-auth
Initiates payment authorization and returns checkout HTML.

**Endpoint:** `/functions/v1/paybright-auth`

**Request:**
```json
{
  "merchantId": "uuid",
  "transactionType": "deal_purchase",
  "amount": 50.00,
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "M5H 2N2",
    "country": "CA",
    "phone": "416-555-0100"
  }
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "uuid",
  "paybrightReference": "ref123",
  "checkoutHtml": "<html>...</html>"
}
```

#### paybright-webhook
Handles PayBright payment status callbacks.

**Endpoint:** `/functions/v1/paybright-webhook`

This endpoint is called by PayBright when payment status changes. It:
- Verifies webhook signature
- Updates transaction status
- Logs webhook events
- Triggers any necessary follow-up actions

#### paybright-refund
Processes refund requests.

**Endpoint:** `/functions/v1/paybright-refund`

**Request:**
```json
{
  "transactionId": "uuid",
  "amount": 25.00,
  "reason": "Customer requested refund"
}
```

## Using PayBright in Your Code

### Import the helper functions

```typescript
import {
  initiatePayBrightPayment,
  refundPayBrightTransaction,
  getPayBrightTransaction,
  getPayBrightTransactions,
  formatPayBrightAmount,
  getPayBrightStatusColor,
  getPayBrightStatusLabel
} from '../lib/paybright';
```

### Initiate a Payment

```typescript
const result = await initiatePayBrightPayment({
  merchantId: 'merchant-uuid',
  transactionType: 'deal_purchase',
  referenceId: 'deal-uuid',
  referenceTable: 'deals',
  amount: 50.00,
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main St',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5H 2N2',
    country: 'CA',
    phone: '416-555-0100'
  }
});

if (result.success) {
  // Display checkoutHtml in an iframe or modal
  const checkoutContainer = document.getElementById('checkout');
  checkoutContainer.innerHTML = result.checkoutHtml;
} else {
  console.error(result.error);
}
```

### Process a Refund

```typescript
const result = await refundPayBrightTransaction(
  'transaction-uuid',
  25.00, // Optional: partial refund amount
  'Customer requested refund' // Optional: reason
);

if (result.success) {
  console.log('Refund processed:', result.refundId);
} else {
  console.error(result.error);
}
```

### Get Transaction Details

```typescript
const result = await getPayBrightTransaction('transaction-uuid');

if (result.success) {
  console.log('Transaction:', result.transaction);
}
```

### List Transactions

```typescript
const result = await getPayBrightTransactions({
  merchantId: 'merchant-uuid',
  status: 'completed'
});

if (result.success) {
  console.log('Transactions:', result.transactions);
}
```

## Transaction Statuses

- `pending` - Payment initiated but not completed
- `authorized` - Payment approved, ready for capture
- `captured` - Payment captured
- `completed` - Payment fully processed
- `failed` - Payment failed
- `voided` - Payment authorization cancelled
- `refunded` - Payment fully refunded
- `partially_refunded` - Payment partially refunded

## Security

- API tokens are encrypted in the database
- All API calls use HMAC-SHA256 signature verification
- Webhook signatures are verified before processing
- RLS policies restrict access to authorized users only

## Testing

1. Start with sandbox environment
2. Use PayBright's test credentials
3. Test various payment scenarios:
   - Successful payment
   - Failed payment
   - Partial refund
   - Full refund
   - Webhook delivery

## Production Deployment

1. Switch to live environment in Payment Settings
2. Enter production API credentials
3. Configure webhook URL: `https://yourdomain.com/functions/v1/paybright-webhook`
4. Test with small transactions first
5. Monitor webhook events and transaction logs

## Webhook Configuration

Contact PayBright to configure your webhook URL:

```
https://yourdomain.com/functions/v1/paybright-webhook
```

The webhook will receive payment status updates including:
- Payment completed
- Payment pending
- Payment failed

## Support

For PayBright-specific questions:
- Contact PayBright support team
- Review [PayBright API Documentation](https://developer.paybright.com)

For integration issues:
- Check Edge Function logs in Supabase dashboard
- Review webhook event logs in `paybright_webhook_events` table
- Check transaction status in `paybright_transactions` table

## Important Notes

- PayBright has been acquired by Affirm
- New integrations through Adyen are not available
- Direct PayBright API integration still works
- Keep API credentials secure and never commit to version control
- Always test in sandbox before going live
- Monitor refund limits and policies
