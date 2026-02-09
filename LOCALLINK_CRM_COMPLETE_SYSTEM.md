# Local-Link CRM - Complete Universal Business Hub

**Implementation Date:** February 7, 2026
**Status:** ✅ COMPLETE - Database Ready

---

## Overview

A comprehensive CRM system modeled after TradeHive CRM with full business management capabilities. Includes contact management, sales pipelines, email marketing, automation, invoicing, payment processing, AI features, and integrated accounting (Local-Link Books Lite & Pro).

---

## Pricing Structure

### 5-Tier System

| Tier | Price | Contacts | Key Features |
|------|-------|----------|--------------|
| **Starter CRM** | **$45/mo** | 100 | Basic CRM, 1 pipeline, tasks, reporting |
| **Professional CRM** | **$145/mo** | 1,000 | 3 pipelines, email campaigns, automation, **Books Lite** |
| **Business CRM** | **$299/mo** | 5,000 | Unlimited pipelines, SMS, **Books Pro**, AI add-ons available |
| **Enterprise CRM** | **$499/mo** | 25,000 | Everything unlimited, 5 AI features included, priority support |
| **Enterprise Plus** | **Custom** | Unlimited | White-label, custom development, dedicated infrastructure |

---

## Core Features by Tier

### Starter CRM ($45/month)
**Perfect for:** Solopreneurs and small teams getting started

**Features:**
- Contact management (up to 100 contacts)
- 1 sales pipeline with customizable stages
- Task management and reminders
- Basic reporting and dashboards
- Email integration
- Mobile app access
- Standard support

**What's NOT Included:**
- Email campaigns
- Automation
- Custom fields
- Local-Link Books
- AI features

---

### Professional CRM ($145/month)
**Perfect for:** Growing businesses needing professional tools

**Features:**
- Everything in Starter, plus:
- Contact management (up to 1,000 contacts)
- 3 sales pipelines
- Email campaigns (500 emails/month)
- Custom fields for contacts and deals
- Marketing automation (5 workflows)
- **Local-Link Books Lite**
  - Invoice creation and tracking
  - Expense tracking
  - Basic financial reports
- Enhanced reporting
- Calendar integration
- File storage (5GB)
- Priority support

**Books Lite Features:**
- Create and send invoices
- Track expenses
- Basic profit & loss
- Tax categorization
- Receipt uploads

---

### Business CRM ($299/month)
**Perfect for:** Established businesses with teams

**Features:**
- Everything in Professional, plus:
- Contact management (up to 5,000 contacts)
- Unlimited sales pipelines
- Email campaigns (5,000 emails/month)
- SMS campaigns (1,000 SMS/month)
- Advanced automation (25 workflows)
- **Local-Link Books Pro**
  - Full accounting suite
  - Multi-business tracking
  - Advanced tax preparation
  - Profit & loss statements
  - Cash flow forecasting
  - 1099 preparation
- Advanced reporting & analytics
- Team collaboration tools
- Document management (25GB)
- Basic API access
- Integrations (Zapier, etc.)
- Custom branding
- Dedicated account manager
- **AI Features Available** (paid add-ons)

**Books Pro Features:**
- Everything in Books Lite
- Multi-business accounting
- Chart of accounts
- Bank reconciliation
- Advanced tax reports
- Cash flow forecasting
- Quarterly reports
- 1099 contractor tracking
- Audit trails

**AI Add-Ons Available:**
All AI features require Business tier or higher:
- AI Lead Scoring (1 credit/use)
- AI Email Writer (2 credits/use)
- AI Meeting Summarizer (3 credits/use)
- AI Contact Enrichment (5 credits/use)
- AI Sentiment Analysis (2 credits/use)

---

### Enterprise CRM ($499/month)
**Perfect for:** Large organizations needing unlimited power

**Features:**
- Everything in Business, plus:
- Contact management (up to 25,000 contacts)
- Unlimited everything
- Email campaigns (25,000 emails/month)
- SMS campaigns (5,000 SMS/month)
- Unlimited automation
- **Local-Link Books Pro Plus**
  - Multi-entity consolidation
  - Advanced budgeting
  - Custom report builder
- **5 AI Features Included** (monthly credits)
- Advanced AI features available:
  - AI Sales Forecasting
  - AI Chatbot
  - AI Call Transcription
  - AI Next Best Action
  - AI Data Insights
- Custom reporting & dashboards
- Team management & permissions
- Document management (100GB)
- Full API access
- All integrations
- White-label options
- Priority support 24/7
- Onboarding & training
- Quarterly business reviews

---

### Enterprise Plus (Custom Pricing)
**Perfect for:** Large enterprises needing custom solutions

**Features:**
- Unlimited contacts
- Unlimited everything
- Complete white-label
- Full API & webhooks
- AI features (unlimited credits)
- Custom development
- Dedicated infrastructure
- 24/7 premium support
- On-site training
- Custom SLAs
- Multi-tenant support
- Advanced security features
- Compliance certifications

---

## Database Schema

### Core Tables

**ll_crm_pricing_tiers**
- Stores the 5 pricing tiers with features and limits
- Includes AI feature availability and Books tier

**ll_crm_subscriptions**
- Tracks merchant CRM subscriptions
- Links to pricing tiers
- Manages AI credits and contact counts
- Tracks billing cycles

**ll_crm_contacts**
- Universal contact/lead management
- Custom fields support (JSONB)
- Lead scoring and status tracking
- Engagement metrics (emails sent/opened/clicked)
- Lifetime value tracking
- Tag system for categorization

**ll_crm_pipelines**
- Customizable sales pipelines
- Configurable stages (JSONB)
- Multiple pipelines per merchant

**ll_crm_deals**
- Opportunity/deal tracking
- Links to contacts and pipelines
- Probability and value tracking
- Win/loss tracking with reasons

**ll_crm_activities**
- Activity timeline for contacts/deals
- Task management
- Call logs, meetings, notes
- Assignments and due dates

---

### Marketing & Automation

**ll_crm_email_campaigns**
- Email campaign management
- Targeting and segmentation
- Performance tracking (opens, clicks, bounces)
- Schedule and send management

**ll_crm_email_sends**
- Individual email tracking per recipient
- Engagement metrics per contact
- Delivery status

**ll_crm_workflows**
- Marketing automation workflows
- Trigger-based actions
- Multi-step sequences
- Performance analytics

**ll_crm_workflow_executions**
- Track individual workflow runs
- Execution logs
- Error handling

---

### Documents & Files

**ll_crm_documents**
- File storage for contacts/deals
- Document categorization
- Access control
- Storage path management

---

### Invoicing & Payments

**ll_crm_invoices**
- Full invoice management
- Line items (JSONB)
- Tax calculations
- Status tracking (draft, sent, paid, overdue)
- Payment tracking
- Automated invoice numbers

**ll_crm_payments**
- Payment recording and tracking
- Multiple payment methods
- Stripe integration
- Links to invoices and contacts
- Automatic invoice status updates

---

### AI Features (Gated by Subscription)

**ll_crm_ai_features**
- Catalog of available AI features
- Credit costs per use
- Minimum tier requirements
- Feature descriptions

**Pre-loaded AI Features:**
1. **AI Lead Scoring** (1 credit) - Tier 3+
   - Automatically score leads based on behavior
2. **AI Email Writer** (2 credits) - Tier 3+
   - Generate personalized email content
3. **AI Meeting Summarizer** (3 credits) - Tier 3+
   - Summarize meetings and extract actions
4. **AI Contact Enrichment** (5 credits) - Tier 3+
   - Enrich contacts with company data
5. **AI Sales Forecasting** (10 credits) - Tier 4+
   - Predict deal outcomes
6. **AI Chatbot** (1 credit/msg) - Tier 4+
   - AI-powered customer chat
7. **AI Call Transcription** (5 credits) - Tier 4+
   - Transcribe and analyze calls
8. **AI Sentiment Analysis** (2 credits) - Tier 3+
   - Analyze customer sentiment
9. **AI Next Best Action** (3 credits) - Tier 4+
   - Recommend next steps
10. **AI Data Insights** (5 credits) - Tier 4+
    - AI-powered analytics

**ll_crm_ai_usage**
- Track AI feature usage
- Credit consumption logging
- Results storage

---

### Local-Link Books Integration

**ll_books_expenses**
- Expense tracking
- Receipt storage
- Tax categorization
- Vendor management

**ll_books_income**
- Income tracking
- Linked to invoices
- Category management
- Accounting codes

---

## Helper Functions

### `get_ll_crm_subscription_status(merchant_id)`
Returns comprehensive subscription info:
- Is subscription active
- Tier name and contact limit
- Contacts used
- AI enabled status
- AI credits remaining
- Books tier level

### `can_use_ll_crm_ai_feature(merchant_id, feature_name)`
Check if merchant can use specific AI feature:
- Validates tier requirements
- Checks AI addon enabled
- Verifies credit availability

### `use_ll_crm_ai_credits(merchant_id, feature_id, credits)`
Deduct AI credits when feature used:
- Validates credit availability
- Updates subscription credits
- Returns success/failure

### `generate_ll_crm_invoice_number(merchant_id)`
Generate sequential invoice numbers:
- Format: INV-00001, INV-00002, etc.
- Unique per merchant

---

## Automated Triggers

### Contact Count Tracking
- Automatically updates `contact_count` in subscription when contacts added/removed
- Prevents exceeding contact limits

### Invoice Payment Updates
- When payment recorded, automatically updates invoice:
  - `amount_paid` increases
  - `amount_due` decreases
  - Status changes to `paid` when fully paid
  - `paid_at` timestamp set

### Contact Lifetime Value
- When payment recorded, automatically updates contact:
  - `lifetime_value` increases
  - `total_purchases` increments

---

## Security (RLS Policies)

All tables have Row Level Security enabled with the following policies:

**Merchants can only:**
- View their own CRM data
- Create/update/delete their own records
- Cannot access other merchants' data

**Public Access:**
- Pricing tiers are viewable by all authenticated users
- AI features catalog is viewable by all authenticated users

**Admin Access:**
- Internal team has full access (handled by separate policies)

---

## AI Features - How They Work

### Gating Mechanism

1. **Tier Check:** Feature requires minimum tier level
2. **Add-On Check:** AI add-on must be enabled in subscription
3. **Credit Check:** Merchant must have sufficient credits

### Enabling AI Features

**For Business Tier ($299/mo):**
```
Merchant purchases "AI Add-On Pack"
- Gets 50 AI credits/month
- Can use any Tier 3+ AI features
- Credits reset monthly
```

**For Enterprise Tier ($499/mo):**
```
AI Features Included:
- 5 featured AI tools included
- 100 AI credits/month included
- Access to advanced AI features
- Credits reset monthly
```

**For Enterprise Plus:**
```
Unlimited AI Credits
All AI features available
Custom AI development available
```

### Using AI Features

Frontend calls AI feature:
```javascript
// 1. Check if feature available
const canUse = await supabase.rpc('can_use_ll_crm_ai_feature', {
  merchant_id_input: merchantId,
  feature_name_input: 'AI Email Writer'
});

if (!canUse) {
  // Show upgrade prompt or buy credits
  return;
}

// 2. Use the feature
const result = await callAIFeature(...);

// 3. Deduct credits
await supabase.rpc('use_ll_crm_ai_credits', {
  merchant_id_input: merchantId,
  feature_id_input: featureId,
  credits_to_use: 2
});

// 4. Log usage
await supabase.from('ll_crm_ai_usage').insert({
  merchant_id: merchantId,
  feature_id: featureId,
  credits_used: 2,
  result: result
});
```

---

## Invoice and Payment Flow

### Creating an Invoice

```javascript
// 1. Generate invoice number
const { data: invoiceNum } = await supabase.rpc('generate_ll_crm_invoice_number', {
  merchant_id_input: merchantId
});

// 2. Create invoice
const invoice = await supabase.from('ll_crm_invoices').insert({
  merchant_id: merchantId,
  contact_id: contactId,
  invoice_number: invoiceNum,
  invoice_date: new Date(),
  due_date: addDays(new Date(), 30),
  line_items: [
    { description: 'Service', quantity: 1, rate: 500, amount: 500 }
  ],
  subtotal: 500,
  tax_rate: 8.5,
  tax_amount: 42.50,
  total_amount: 542.50,
  amount_due: 542.50,
  status: 'draft'
});

// 3. Send invoice (mark as sent)
await supabase.from('ll_crm_invoices')
  .update({ status: 'sent', sent_at: new Date() })
  .eq('id', invoice.id);
```

### Recording a Payment

```javascript
// Payment automatically updates invoice via trigger
const payment = await supabase.from('ll_crm_payments').insert({
  merchant_id: merchantId,
  invoice_id: invoiceId,
  contact_id: contactId,
  payment_amount: 542.50,
  payment_date: new Date(),
  payment_method: 'credit_card',
  stripe_payment_intent_id: 'pi_xxx'
});

// Trigger automatically:
// - Updates invoice amount_paid
// - Updates invoice amount_due
// - Sets status to 'paid' if fully paid
// - Updates contact lifetime_value
// - Increments contact total_purchases
```

---

## Books Lite vs Books Pro

### Books Lite (Included in Professional CRM)

**Core Features:**
- Invoice creation and tracking
- Expense tracking with receipts
- Basic income tracking
- Simple profit & loss
- Tax category assignment
- Export to CSV

**Use Case:**
Freelancers and small businesses that need basic bookkeeping and invoicing.

### Books Pro (Included in Business CRM+)

**All of Books Lite, plus:**
- Multi-business accounting
- Chart of accounts customization
- Bank account reconciliation
- Advanced tax reports (Schedule C ready)
- Cash flow forecasting
- Quarterly financial statements
- 1099 contractor tracking
- Detailed audit trails
- Custom financial reports
- Integration with QuickBooks/Xero

**Use Case:**
Growing businesses that need comprehensive accounting and tax preparation.

---

## Implementation Roadmap

### Phase 1: Core CRM (Completed ✅)
- [x] Database schema created
- [x] Pricing tiers configured
- [x] Contacts and leads management
- [x] Pipelines and deals
- [x] Activities and tasks
- [x] RLS policies implemented
- [x] Helper functions created

### Phase 2: Marketing & Automation
- [ ] Email campaign UI
- [ ] Workflow builder UI
- [ ] Email template editor
- [ ] Campaign analytics dashboard
- [ ] Workflow execution engine

### Phase 3: Invoicing & Payments
- [ ] Invoice creation UI
- [ ] Invoice templates
- [ ] Payment recording UI
- [ ] Stripe payment integration
- [ ] Payment reminders
- [ ] Overdue invoice tracking

### Phase 4: AI Features
- [ ] AI feature marketplace UI
- [ ] Credit purchase flow
- [ ] AI Lead Scoring implementation
- [ ] AI Email Writer implementation
- [ ] AI Meeting Summarizer implementation
- [ ] AI usage dashboard

### Phase 5: Books Integration
- [ ] Books Lite dashboard
- [ ] Expense tracking UI
- [ ] Income/expense reports
- [ ] Books Pro features
- [ ] Tax reports
- [ ] Multi-business support

### Phase 6: Mobile & Integrations
- [ ] Mobile app (React Native)
- [ ] Zapier integration
- [ ] Calendar sync (Google/Outlook)
- [ ] Email sync (Gmail/Outlook)
- [ ] API documentation
- [ ] Webhook system

---

## Subscription Upgrade Paths

### Starter → Professional
**Benefits:**
- 10x more contacts (100 → 1,000)
- Email campaigns unlock
- Automation workflows
- Books Lite included
- Save ~$1,200/year vs buying separate tools

### Professional → Business
**Benefits:**
- 5x more contacts (1,000 → 5,000)
- Unlimited pipelines
- SMS campaigns
- Books Pro upgrade (full accounting)
- AI features available
- Team collaboration
- API access

### Business → Enterprise
**Benefits:**
- 5x more contacts (5,000 → 25,000)
- 5 AI features included
- Advanced AI features
- White-label options
- Priority support 24/7
- Dedicated account manager
- Quarterly reviews

### Enterprise → Enterprise Plus
**Benefits:**
- Unlimited everything
- Custom development
- Dedicated infrastructure
- Multi-tenant support
- Custom SLAs
- On-site training

---

## API Endpoints (Future)

### Contacts
- `POST /api/crm/contacts` - Create contact
- `GET /api/crm/contacts` - List contacts
- `GET /api/crm/contacts/:id` - Get contact
- `PATCH /api/crm/contacts/:id` - Update contact
- `DELETE /api/crm/contacts/:id` - Delete contact

### Deals
- `POST /api/crm/deals` - Create deal
- `GET /api/crm/deals` - List deals
- `PATCH /api/crm/deals/:id/stage` - Move deal stage

### Invoices
- `POST /api/crm/invoices` - Create invoice
- `GET /api/crm/invoices` - List invoices
- `POST /api/crm/invoices/:id/send` - Send invoice
- `POST /api/crm/invoices/:id/payments` - Record payment

### AI Features
- `POST /api/crm/ai/lead-score` - Score a lead
- `POST /api/crm/ai/email-writer` - Generate email
- `POST /api/crm/ai/enrich` - Enrich contact

---

## Marketing Messaging

### For Starter Tier
"Get started with professional CRM for just $45/month. Perfect for solopreneurs managing up to 100 contacts."

### For Professional Tier
"Everything you need to grow your business. CRM + Email Marketing + Accounting for $145/month."

### For Business Tier
"The complete business management system. CRM + Marketing Automation + Full Accounting + AI Features available."

### For Enterprise Tier
"Unlimited power for large teams. Everything included plus 5 AI features and dedicated support."

---

## Technical Stack

**Database:** PostgreSQL (Supabase)
**Backend:** Supabase Functions (Deno)
**Frontend:** React + TypeScript
**Authentication:** Supabase Auth
**Storage:** Supabase Storage
**Payments:** Stripe
**Email:** SendGrid / Brevo
**SMS:** Twilio

---

## Summary

Local-Link CRM is a comprehensive, AI-powered business management system that combines:

✅ **CRM** - Contacts, leads, deals, pipelines
✅ **Marketing** - Email campaigns, SMS, automation
✅ **Invoicing** - Professional invoices and payment tracking
✅ **Accounting** - Books Lite & Pro for financial management
✅ **AI Features** - 10 AI tools to boost productivity (gated by tier)
✅ **Team Collaboration** - Multi-user support and permissions
✅ **Mobile Ready** - Full mobile app access

**Pricing:** $45 → $145 → $299 → $499 → Custom
**Target:** Small businesses to large enterprises
**USP:** Only CRM that includes full accounting + AI features in one platform

**Status:** Database complete and ready for frontend implementation.

---

**Next Steps:**
1. Build frontend UI components
2. Implement Stripe subscription checkout
3. Create invoice templates and PDF generation
4. Integrate AI features with OpenAI API
5. Build marketing automation engine
6. Launch beta program

**Implementation Date:** February 7, 2026
**Migration Files:**
- `create_locallink_crm_comprehensive_system.sql`
- `add_locallink_crm_advanced_features.sql`
- `add_locallink_crm_rls_and_functions.sql`
