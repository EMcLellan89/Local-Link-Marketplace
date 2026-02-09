# Customer Referral Email & SMS Delivery System

Complete email and SMS delivery system for customer referral links with QR codes and short links.

## Features Implemented

### 1. Database Infrastructure
- **Short Links Table**: Stores shortened URLs for better SMS delivery and tracking
- **Click Tracking**: Automatically tracks clicks on short links
- **Email/SMS Timestamps**: Tracks when referral links are sent to customers

### 2. Edge Functions Deployed

#### QR Code Generator (`/functions/v1/generate-qr-code`)
- Generates QR code images for referral links
- Public endpoint (no authentication required)
- Returns PNG images
- Supports custom sizes (up to 600px)

#### Short Link Redirect (`/functions/v1/redirect-short-link`)
- Redirects `/l/XXXXXX` short codes to full referral URLs
- Tracks click counts
- Public endpoint for customer access

#### Email Sender (`/functions/v1/send-referral-email`)
- Generates personalized referral link for customer
- Creates short link for easy sharing
- Sends beautiful HTML email with QR code
- Requires merchant authentication

#### SMS Sender (`/functions/v1/send-referral-sms`)
- Generates personalized referral link for customer
- Creates short link for SMS-friendly format
- Sends text message via Twilio
- Requires merchant authentication and customer consent

### 3. Merchant UI Updates

New features in **Merchant Referral Cards** page (`/merchant/referrals/cards`):

- **Phone Input Field**: Enter customer phone number (E.164 format or 10-digit US)
- **SMS Consent Checkbox**: Required compliance checkbox before sending SMS
- **Email Customer Button**: Sends email with referral link and QR code
- **Text Customer (SMS) Button**: Sends SMS with shortened referral link
- **Generate Card Button**: Creates printable QR cards (existing feature)

## Setup Requirements

### Required Environment Variables

Add these to your Supabase project secrets:

```bash
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Local-Link <noreply@yourdomain.com>

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_FROM_NUMBER=+1XXXXXXXXXX
```

### How to Configure:

1. **Resend Email** (https://resend.com)
   - Sign up and verify your domain
   - Get your API key from dashboard
   - Add `RESEND_API_KEY` to Supabase secrets

2. **Twilio SMS** (https://twilio.com)
   - Create account and get a phone number
   - Get Account SID and Auth Token from dashboard
   - Add all three Twilio variables to Supabase secrets

## User Flow

### For Merchants

1. Navigate to **Referrals** dashboard
2. Click **Print Cards** button
3. Enter customer information:
   - Name (optional)
   - Email (required for email)
   - Phone (required for SMS)
4. Check SMS consent checkbox (if sending SMS)
5. Choose delivery method:
   - **Generate card**: Print QR cards for in-person handout
   - **Email customer**: Send via email with embedded QR code
   - **Text customer**: Send via SMS with short link

### For Customers

When customers receive their referral link:

1. **Via Email**:
   - Beautiful HTML email with QR code image
   - Short link for easy copying/sharing
   - Direct button to open referral page

2. **Via SMS**:
   - Short link (e.g., `yourdomain.com/l/ABC123`)
   - Reward information
   - Easy to forward to friends

3. **Via Print Card**:
   - Scannable QR code
   - Printed on 5x7 or letter-size paper
   - Perfect for in-person referrals

## Technical Details

### Short Link Format
- Format: `/l/[6-character code]`
- Example: `https://yourdomain.com/l/AB12CD`
- Automatically redirects to full referral URL
- Tracks click count for analytics

### Email Template
- Responsive HTML design
- Embedded QR code image
- Brand-neutral styling
- Works in all major email clients

### SMS Message Format
```
[Program Name]: You earn $25 • Friend gets $15
Share your link:
https://yourdomain.com/l/ABC123
```

### Security & Compliance

- **SMS Consent**: Required checkbox before sending SMS (TCPA compliance)
- **Authentication**: All endpoints require merchant authentication
- **RLS Policies**: Row-level security on all database tables
- **Data Privacy**: Customer email/phone stored securely

### Database Schema

**referral_short_links**:
- `id`: UUID primary key
- `merchant_id`: Foreign key to profiles
- `destination_url`: Full referral URL
- `short_code`: 6-character unique code
- `click_count`: Number of clicks tracked
- `created_at`: Timestamp

**profiles** (tracking columns added):
- `referral_link_email_sent_at`: Timestamp of last email sent
- `referral_link_sms_sent_at`: Timestamp of last SMS sent

## Testing Checklist

- [ ] Resend API key configured and domain verified
- [ ] Twilio credentials configured and phone number active
- [ ] Email arrives with QR code visible
- [ ] SMS arrives with short link
- [ ] Short link redirects correctly
- [ ] QR code scans to correct URL
- [ ] Click tracking increments
- [ ] Print cards generate correctly

## Cost Considerations

### Resend Pricing
- Free tier: 100 emails/day, 3,000/month
- Pro: $20/month for 50,000 emails

### Twilio Pricing
- SMS: ~$0.0075 per message (US)
- Phone number: $1-$2/month
- No monthly minimum

### QR Code API
- Uses free external service (qrserver.com)
- No API key required
- Production recommendation: Consider self-hosted solution

## Next Steps

1. **Set up environment variables** in Supabase
2. **Test email delivery** with your domain
3. **Test SMS delivery** with your Twilio number
4. **Verify short links** redirect correctly
5. **Train merchants** on the three delivery options

## Support & Troubleshooting

### Email not sending?
- Check RESEND_API_KEY is set correctly
- Verify domain in Resend dashboard
- Check EMAIL_FROM matches verified domain

### SMS not sending?
- Verify TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER
- Check phone number format (E.164)
- Verify Twilio account has SMS credits

### Short links not working?
- Check redirect-short-link function is deployed
- Verify short link was created in database
- Test with browser dev tools to see redirect

### QR codes not generating?
- Check generate-qr-code function is deployed
- Verify external QR API is accessible
- Check image loads in browser directly

## Future Enhancements

Potential additions:
- Auto-send email after first purchase
- Bulk email/SMS campaigns
- Click analytics dashboard
- Custom QR code styling
- WhatsApp integration
- A/B testing for message templates
