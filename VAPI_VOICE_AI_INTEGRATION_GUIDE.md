# Vapi Voice AI Integration Guide

## Overview

This platform integrates with Vapi.ai to provide AI-powered voice assistants that can handle customer calls, qualify leads, schedule appointments, and update your CRM automatically using tool-calling (function calling).

## Architecture

```
Customer calls → Twilio → Vapi (AI Voice Layer) → Tool Calls → Supabase Edge Functions → Database
```

## Features

✅ **AI-Powered Voice Assistants**
- Natural language understanding
- Real-time conversation
- Interruption handling
- Custom personalities via system prompts

✅ **CRM Integration via Tool Calling**
- Create leads automatically
- Schedule appointments
- Look up customer information
- Update lead status
- All actions logged in database

✅ **Multiple Voice & AI Models**
- Voice providers: PlayHT, ElevenLabs, Deepgram, Azure
- AI models: GPT-4, GPT-3.5, Claude 3 Sonnet, Claude 3 Opus

✅ **Call Logging & Analytics**
- Full call transcripts
- AI-generated summaries
- Call duration & costs
- Tool call history

## Database Schema

### Tables Created

1. **vapi_configurations**
   - Stores API keys and merchant settings
   - One per merchant

2. **vapi_assistants**
   - AI assistant configurations
   - System prompts, voice settings, model selection
   - Multiple assistants per merchant

3. **vapi_tools**
   - Function definitions for tool calling
   - Links to edge function endpoints
   - Configurable per assistant

4. **vapi_call_logs**
   - Complete call history
   - Transcripts and summaries
   - Cost tracking

## Edge Functions (Tools)

### 1. vapi-webhook
**Endpoint:** `/functions/v1/vapi-webhook`

Handles all webhooks from Vapi:
- `assistant-request` - Returns assistant configuration for incoming calls
- `status-update` - Updates call status in real-time
- `end-of-call-report` - Saves transcript and summary
- `conversation-update` - Real-time transcript updates

### 2. vapi-tool-create-lead
**Endpoint:** `/functions/v1/vapi-tool-create-lead`

Creates or updates a lead in the CRM.

**Parameters:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "notes": "Interested in HVAC service",
  "source": "voice_call"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Created new lead for John Doe",
  "lead_id": "uuid"
}
```

### 3. vapi-tool-schedule-appointment
**Endpoint:** `/functions/v1/vapi-tool-schedule-appointment`

Schedules an appointment and creates/updates customer record.

**Parameters:**
```json
{
  "customer_name": "Jane Smith",
  "customer_phone": "+1234567890",
  "customer_email": "jane@example.com",
  "appointment_date": "2024-03-15",
  "appointment_time": "14:00",
  "service_type": "HVAC Maintenance",
  "notes": "Annual checkup"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment scheduled for Jane Smith on Friday, March 15, 2024 at 2:00 PM",
  "appointment_id": "uuid",
  "confirmation_details": {
    "date": "Friday, March 15, 2024",
    "time": "2:00 PM",
    "service": "HVAC Maintenance"
  }
}
```

### 4. vapi-tool-lookup-customer
**Endpoint:** `/functions/v1/vapi-tool-lookup-customer`

Looks up customer information by phone, email, or name.

**Parameters:**
```json
{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "found": true,
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "customer_since": "January 2023",
    "total_purchases": 5,
    "active_deals": 2,
    "recent_appointments": [
      {
        "date": "March 1, 2024",
        "service": "HVAC Repair",
        "status": "completed"
      }
    ]
  },
  "message": "Found customer John Doe. They have been a customer since January 2023 with 5 total purchases."
}
```

### 5. vapi-tool-update-lead-status
**Endpoint:** `/functions/v1/vapi-tool-update-lead-status`

Updates lead status in the CRM pipeline.

**Parameters:**
```json
{
  "phone": "+1234567890",
  "status": "qualified",
  "notes": "Ready to schedule service"
}
```

**Status Options:** `new`, `contacted`, `qualified`, `proposal`, `won`, `lost`

**Response:**
```json
{
  "success": true,
  "message": "Updated John Doe's status from contacted to qualified",
  "lead_id": "uuid"
}
```

## Setup Instructions

### 1. Get Vapi API Keys

1. Sign up at [vapi.ai](https://vapi.ai)
2. Go to Dashboard → API Keys
3. Copy your:
   - API Key (starts with `sk_live_...`)
   - Public Key (starts with `pk_live_...`)
4. Go to Phone Numbers → Create or select a phone number
5. Copy the Phone Number ID

### 2. Configure in Platform

1. Navigate to: **Communications Hub → Configure AI Voice**
2. Enter your Vapi API credentials:
   - Vapi API Key
   - Vapi Public Key
   - Phone Number ID
3. Check "Enable Vapi Voice AI"

### 3. Customize AI Assistant

**Assistant Name:** Give your assistant a name (e.g., "Sales Assistant")

**First Message:** What the AI says when answering
```
Hello! Thank you for calling [Business Name]. How can I help you today?
```

**System Prompt:** Define personality and capabilities
```
You are a helpful sales assistant for [Business Name]. Your role is to:
- Greet callers warmly and professionally
- Answer questions about our products and services
- Qualify leads by asking about their needs and timeline
- Schedule appointments when requested
- Create leads in the CRM for follow-up
- Look up existing customer information

Always be friendly, concise, and helpful. Use the available tools to take actions when appropriate. If you schedule an appointment, confirm the date and time with the customer.

Business Hours: Monday-Friday, 9 AM - 5 PM
Services: [List your services]
```

**Voice & Model Settings:**
- AI Model: GPT-4 (recommended for best results)
- Voice Provider: PlayHT, ElevenLabs, or Deepgram
- Voice ID: Choose from provider's voice library

### 4. Select Tools

Check which actions your AI can perform:
- ✅ **create_lead** - Create leads from calls
- ✅ **schedule_appointment** - Book appointments
- ✅ **lookup_customer** - Access customer history
- ✅ **update_lead_status** - Move leads through pipeline

### 5. Configure Vapi Dashboard

In your Vapi dashboard:

1. Go to Phone Numbers → Select your number
2. Set Server URL: `https://[your-project].supabase.co/functions/v1/vapi-webhook`
3. Enable webhooks:
   - assistant-request
   - status-update
   - end-of-call-report
   - conversation-update

## Usage Examples

### Example 1: Lead Qualification Call

**Customer:** "Hi, I'm interested in getting my AC serviced"

**AI:** "Great! I'd be happy to help. Can I get your name and phone number?"

**Customer:** "Sure, it's John Doe, 555-123-4567"

**AI:** *[Calls create_lead tool with customer info]*
"Thanks John! I've created a record for you. What type of issue are you having with your AC?"

**Customer:** "It's not cooling properly"

**AI:** *[Updates lead notes]*
"I understand. Would you like to schedule a service appointment?"

**Result:** Lead created in CRM with status "new"

### Example 2: Appointment Booking

**Customer:** "I'd like to schedule a maintenance appointment"

**AI:** "I'd be happy to help you schedule that. What's your name and phone number?"

**Customer:** "Jane Smith, 555-987-6543"

**AI:** *[Calls lookup_customer tool]*
"Thanks Jane! I see you're an existing customer. When would you like to come in?"

**Customer:** "How about next Tuesday at 2 PM?"

**AI:** *[Calls schedule_appointment tool]*
"Perfect! I've scheduled your maintenance appointment for Tuesday, March 15th at 2:00 PM. You'll receive a confirmation text shortly. Is there anything else I can help with?"

**Result:** Appointment created in database, customer record updated

### Example 3: Customer Lookup

**Customer:** "Hi, I need to check on my recent service"

**AI:** "I can help with that. What's your phone number?"

**Customer:** "555-111-2222"

**AI:** *[Calls lookup_customer tool]*
"Thanks! I see you're John Doe and you've been a customer since January 2023. Your most recent appointment was an HVAC repair on March 1st which was completed successfully. How can I help you today?"

**Result:** Customer feels recognized, AI has context for conversation

## Call Logging

All calls are automatically logged in the `vapi_call_logs` table:

- **Call details:** Duration, cost, status
- **Full transcript:** Everything said on the call
- **AI summary:** Key points and outcomes
- **Tool calls:** All actions taken (leads created, appointments scheduled, etc.)
- **Customer linking:** Automatically links to customer record

## Analytics & Reporting

Access call analytics from the CRM dashboard:

- Total calls handled
- Average call duration
- Lead conversion rate
- Appointment booking rate
- Cost per call
- Most common call reasons

## Pricing

Vapi charges approximately:
- **$0.05/minute** for voice calls
- Includes AI model costs (GPT-4)
- Includes voice synthesis costs
- No setup fees

Plus your Twilio costs for phone numbers and connectivity.

## Best Practices

### System Prompt Tips

1. **Be specific about your business:**
   - Include services, pricing, hours
   - Mention key differentiators
   - Add common FAQs

2. **Set clear boundaries:**
   ```
   If asked about pricing outside your knowledge, say:
   "I'd be happy to have our team reach out with detailed pricing.
   Can I schedule a callback?"
   ```

3. **Guide tool usage:**
   ```
   When a caller shows interest, always create a lead with their contact info
   and notes about what they need.
   ```

### Voice Selection

- **Professional businesses:** Choose clear, neutral voices
- **Friendly/casual:** Warmer, more expressive voices
- **Test multiple:** Try different voices to find best fit

### Tool Configuration

- **Start simple:** Enable 2-3 tools initially
- **Monitor usage:** Check which tools are being used most
- **Add gradually:** Enable more tools as you see patterns

## Troubleshooting

### Assistant Not Responding

1. Check Vapi configuration is active
2. Verify API keys are correct
3. Check webhook URL in Vapi dashboard
4. Review edge function logs

### Tools Not Working

1. Verify tool endpoints are accessible
2. Check edge function logs for errors
3. Ensure merchant_id is properly configured
4. Test tools individually via Postman

### Call Quality Issues

1. Check voice provider settings
2. Try different AI models
3. Adjust temperature setting (0.7 recommended)
4. Review system prompt for clarity

## Advanced Configuration

### Custom Tools

You can create additional tools for your specific needs:

1. Create new edge function in `supabase/functions/`
2. Add tool to `vapi_tools` table
3. Update assistant configuration
4. Test with sample parameters

### Multi-Language Support

1. Set transcriber language in assistant config
2. Write system prompt in target language
3. Select appropriate voice for language
4. Test with native speakers

### After-Hours Handling

Add to system prompt:
```
Our business hours are Monday-Friday, 9 AM - 5 PM.
If a caller contacts us outside these hours, inform them and offer to:
1. Schedule a callback during business hours
2. Create a lead for the team to follow up
3. Direct them to our website for urgent needs
```

## Security & Compliance

- All API keys encrypted in database
- Call recordings stored securely in Vapi
- HIPAA-compliant configuration available
- PCI-DSS compliant for payment discussions
- Automatic PII redaction options available

## Support

For issues or questions:
1. Check edge function logs in Supabase
2. Review call logs in CRM
3. Check Vapi dashboard for call details
4. Contact Vapi support for voice/AI issues

## Next Steps

After setup:
1. Make test calls to verify functionality
2. Review first 10 calls for quality
3. Adjust system prompt based on real conversations
4. Train staff on reviewing call logs
5. Set up alerts for high-priority calls
6. Create reporting dashboards

---

**Integration Status:** ✅ Production Ready

**Last Updated:** January 2024
