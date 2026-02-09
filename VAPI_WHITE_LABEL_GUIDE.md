# Vapi Voice AI - White-Label Reseller Model

## Overview

The Vapi integration is configured as a **white-label reseller model** where:

1. **You have ONE Vapi account** (platform-level billing)
2. **You bill merchants separately** based on their usage
3. **Merchants never see or need Vapi credentials**
4. **Each merchant gets their own personalized AI assistant**
5. **Full usage tracking and profit margins**

## How It Works

```
Platform Admin → ONE Vapi Account → All Merchant Calls → Individual Billing
```

### Billing Flow

1. **Vapi bills YOU** for all calls across all merchants
2. **Platform tracks usage per merchant** (minutes, calls, costs)
3. **YOU bill merchants** based on their usage + your markup

### Profit Model

- **Vapi charges**: ~$0.05/minute (varies by AI model + voice)
- **You charge merchants**: $0.08/minute for overage
- **Your profit margin**: $0.03/minute on overage calls
- **Included minutes**: Set per merchant (typically 100-500 minutes/month included in CRM subscription)

## Admin Setup (One-Time)

### 1. Get Your Vapi Account

1. Sign up at [vapi.ai](https://vapi.ai)
2. Go to Settings → API Keys
3. Copy:
   - API Key (starts with `sk_live_...`)
   - Public Key (starts with `pk_live_...`)
   - Account ID (optional, from dashboard)

### 2. Configure Platform

1. Log into your admin dashboard
2. Navigate to: **Admin → Platform Vapi Config** (`/admin/platform-vapi`)
3. Enter your Vapi credentials:
   - Vapi API Key
   - Vapi Public Key
   - Account ID (optional)
4. Set monthly budget alert (e.g., $1,000)
5. Enable "Platform Vapi"
6. Click "Save Platform Configuration"

### 3. Configure Webhook in Vapi Dashboard

In your Vapi dashboard:

1. Go to Settings → Webhooks
2. Add Server URL: `https://[your-supabase-project].supabase.co/functions/v1/vapi-webhook`
3. Enable events:
   - `assistant-request`
   - `status-update`
   - `end-of-call-report`
   - `conversation-update`
4. Save webhook configuration

## Merchant Provisioning

### Automatic Provisioning

When a merchant subscribes to a CRM plan that includes Voice AI:

```sql
SELECT provision_vapi_for_merchant(
  p_merchant_id := 'merchant-uuid',
  p_included_minutes := 100  -- Minutes included in their plan
);
```

This automatically:
- Creates their Vapi configuration
- Sets included minutes
- Sets overage rate ($0.08/min default)
- Enables voice AI for them

### Manual Provisioning

From the admin dashboard, you can:

1. Set included minutes per merchant
2. Set custom overage rates
3. Enable/disable voice AI per merchant
4. View usage and billing

## Merchant Experience

### What Merchants Do

1. **Navigate to**: Communications Hub → Configure AI Voice
2. **See usage dashboard**: Minutes used, included, overage
3. **Customize AI assistant**:
   - Name the assistant
   - Customize first message
   - Write system prompt (personality/instructions)
   - Select AI model (GPT-4, Claude, etc.)
   - Choose voice provider and voice
4. **Select tools**: Which CRM actions the AI can perform
5. **Save configuration**

### What Merchants DON'T Do

- ❌ No Vapi account needed
- ❌ No API keys to manage
- ❌ No phone number provisioning
- ❌ No billing with Vapi
- ❌ No technical setup

## Usage Tracking & Billing

### Real-Time Usage Tracking

Every call automatically tracks:

- **Duration** (seconds → rounded up to minutes)
- **Cost** (what Vapi charged you)
- **Merchant charge** (what you charge merchant)
- **Margin** (your profit)
- **Transcript** (full call transcript)
- **Summary** (AI-generated summary)
- **Tool calls** (CRM actions taken)

### Monthly Billing Calculation

```
Merchant Bill Calculation:
- First [included_minutes]: FREE (included in subscription)
- Overage minutes: [minutes_used - included_minutes] × $0.08

Example:
- Included: 100 minutes
- Used: 150 minutes
- Overage: 50 minutes
- Charge: 50 × $0.08 = $4.00
```

### Your Profit Margin

```
Your Margin Calculation:
Revenue: [overage_minutes] × $0.08
Cost: [total_platform_cost from Vapi]
Margin: Revenue - Cost

Example:
- Overage minutes: 50
- Your revenue: 50 × $0.08 = $4.00
- Vapi cost: 50 × $0.05 = $2.50
- Your profit: $4.00 - $2.50 = $1.50 (60% margin)
```

## Platform Dashboard

### Admin View

At `/admin/platform-vapi`, you see:

- **Active merchants** using Voice AI
- **Total calls this month**
- **Total revenue** (what you charged merchants)
- **Total cost** (what Vapi charged you)
- **Profit margin** (revenue - cost)
- **Usage trends** over time

### Per-Merchant View

You can view for each merchant:

- Minutes used this month
- Included vs. overage minutes
- Cost breakdown
- Call logs with transcripts
- AI assistant configuration
- Tool usage statistics

## Database Schema

### Platform Level

**platform_vapi_config** (ONE record for entire platform)
- `vapi_api_key` - Your Vapi API key
- `vapi_public_key` - Your Vapi public key
- `is_active` - Enable/disable platform-wide
- `monthly_budget_cents` - Alert threshold
- `current_month_spend_cents` - Track total spend

### Merchant Level

**vapi_configurations**
- `merchant_id` - Which merchant
- `included_minutes_monthly` - Minutes in subscription
- `overage_rate_per_minute_cents` - Rate for overage (default: 8 = $0.08)
- `current_month_minutes` - Minutes used this billing period
- `current_month_cost_cents` - Cost this billing period

**vapi_assistants**
- `merchant_id` - Which merchant
- `name` - Assistant name
- `system_prompt` - AI personality/instructions
- `first_message` - Greeting
- `voice_provider` - PlayHT, ElevenLabs, etc.
- `model` - GPT-4, Claude, etc.

**vapi_call_logs**
- `merchant_id` - Which merchant
- `duration_seconds` - Call length
- `transcript` - Full conversation
- `summary` - AI-generated summary
- `platform_cost_cents` - What Vapi charged
- `merchant_charge_cents` - What you charged merchant
- `margin_cents` - Your profit

## Billing Functions

### Record Call Billing

```sql
SELECT record_vapi_call_billing(
  p_merchant_id := 'merchant-uuid',
  p_call_id := 'vapi-call-id',
  p_duration_seconds := 180,
  p_platform_cost_cents := 15  -- $0.15 from Vapi
);

-- Returns:
{
  "success": true,
  "minutes_used": 3,
  "merchant_charge_cents": 24,  -- $0.24 (3 min × $0.08)
  "platform_cost_cents": 15,     -- $0.15 (what Vapi charged)
  "margin_cents": 9,              -- $0.09 profit
  "total_minutes_this_month": 103
}
```

### Reset Monthly Billing

Run on the 1st of each month (automated via cron):

```sql
SELECT reset_vapi_monthly_billing();

-- Resets for ALL merchants:
-- - current_month_minutes = 0
-- - current_month_cost_cents = 0
-- - Preserves included_minutes (stays same)
```

## Pricing Tiers

### Suggested Pricing Models

**Basic CRM (No Voice AI)**
- $79/month
- No voice minutes included
- Add Voice AI: +$20/month for 100 minutes

**Professional CRM**
- $159/month
- 100 voice minutes included
- $0.08/minute overage

**Premium CRM**
- $299/month
- 500 voice minutes included
- $0.08/minute overage

**Enterprise**
- Custom pricing
- Unlimited voice minutes (or very high limit)
- Volume discounts

## Cost Analysis

### Your Costs (from Vapi)

| AI Model | Voice Provider | Cost/Minute |
|----------|---------------|-------------|
| GPT-3.5  | PlayHT       | ~$0.03     |
| GPT-4    | PlayHT       | ~$0.05     |
| GPT-4    | ElevenLabs   | ~$0.06     |
| Claude-3 | Deepgram     | ~$0.05     |

### Your Revenue

| Merchant Tier | Included Minutes | Overage Rate | Monthly Revenue Potential |
|--------------|------------------|--------------|--------------------------|
| Basic        | 0                | $0.08/min    | Usage-based              |
| Professional | 100              | $0.08/min    | $20/month + overage      |
| Premium      | 500              | $0.08/min    | $50/month + overage      |

### Profit Examples

**Professional Merchant (100 included, 50 overage)**
- Revenue: $20 base + (50 × $0.08) = $24/month
- Cost: 150 min × $0.05 = $7.50/month
- Profit: $24 - $7.50 = $16.50/month (220% margin)

**Heavy User (500 included, 500 overage)**
- Revenue: $50 base + (500 × $0.08) = $90/month
- Cost: 1,000 min × $0.05 = $50/month
- Profit: $90 - $50 = $40/month (80% margin)

## Advanced Features

### Custom Phone Numbers

Each merchant can have their own dedicated phone number:

1. Purchase phone number in Vapi dashboard
2. Assign to merchant in database
3. Merchant's AI assistant answers all calls to that number

### Multiple Assistants

Merchants can create multiple assistants for different purposes:
- Sales assistant
- Support assistant
- After-hours assistant
- Specific product/service assistants

### Call Routing

Route calls based on:
- Time of day
- Caller ID
- IVR menu selection
- CRM data (returning customer vs. new lead)

### Custom Tools

Create custom tool-calling functions for specific industries:
- HVAC: Check availability, price quotes, seasonal promotions
- Dental: Appointment rescheduling, insurance verification
- Legal: Case intake, document requests, billing questions

## Monitoring & Alerts

### Platform Alerts

Set up alerts for:
- Monthly budget threshold reached
- Individual merchant excessive usage
- Failed calls or errors
- Tool calling failures

### Merchant Alerts

Notify merchants when:
- They reach 80% of included minutes
- They go into overage
- Their assistant isn't configured properly
- Call volume spikes (potential issue or opportunity)

## Best Practices

### For Platform Admins

1. **Monitor costs daily** - Watch your Vapi bill
2. **Review usage patterns** - Identify outliers
3. **Adjust pricing** as needed - Based on actual costs
4. **Test assistants** - Periodically test merchant configurations
5. **Provide training** - Help merchants optimize their assistants

### For Merchants

1. **Start with good prompts** - Clear instructions = better AI
2. **Monitor usage** - Stay within included minutes
3. **Test thoroughly** - Make test calls before going live
4. **Update regularly** - Refine prompts based on real calls
5. **Review transcripts** - Learn from actual conversations

## Troubleshooting

### Common Issues

**Problem**: Calls not recording
- Check webhook URL in Vapi dashboard
- Verify platform config is active
- Check edge function logs

**Problem**: Billing not tracking
- Verify `record_vapi_call_billing` is being called
- Check for function errors in logs
- Ensure merchant has valid configuration

**Problem**: High costs
- Review which AI models merchants are using (GPT-4 vs 3.5)
- Check for long call durations (possible loops)
- Verify assistants have proper conversation flow

## Support & Documentation

### For Merchants

Provide merchants with:
- Setup guide (configure AI assistant)
- Best practices (write good prompts)
- Usage monitoring (track minutes)
- Troubleshooting (common issues)

### For Your Team

- Platform admin guide (this document)
- Technical architecture (database schema, functions)
- Monitoring dashboard (usage, costs, margins)
- Escalation procedures (Vapi support, bugs)

## Future Enhancements

### Planned Features

1. **Advanced analytics** - Call sentiment, conversion rates
2. **A/B testing** - Test different prompts/voices
3. **Call recording** - Save call audio files
4. **Live monitoring** - Listen to calls in real-time
5. **AI training** - Improve assistants from call data

### Integration Opportunities

- **Zapier** - Connect to 5,000+ apps
- **Slack** - Call notifications and alerts
- **Salesforce** - Deep CRM integration
- **HubSpot** - Marketing automation
- **QuickBooks** - Automated invoicing for call costs

---

**Status**: ✅ Production Ready (White-Label Model)

**Last Updated**: January 2024

**Questions?** Contact your platform admin team.
