# 1099-NEC Generation System - Complete Guide

## Overview

The 1099 Generation System allows admins to generate, manage, and distribute IRS Form 1099-NEC (Nonemployee Compensation) for partners who earned $600 or more in commission payments during a tax year.

This system integrates with the existing W-9 DocuSign system to ensure all required tax information is collected before 1099 generation.

---

## System Architecture

### Database Tables

1. **`partner_1099_documents`**
   - Stores generated 1099 forms
   - Links to partners and their W-9 documents
   - Tracks status: draft, generated, sent, filed
   - Records all compensation amounts and tax withholdings

2. **`partner_1099_corrections`**
   - Tracks amended/corrected 1099 forms
   - Links original and corrected forms
   - Records reason for correction

### Key Functions

1. **`get_partners_eligible_for_1099(tax_year)`**
   - Returns all partners who earned $600+ in specified year
   - Shows W-9 completion status
   - Shows existing 1099 status

2. **`calculate_partner_1099_amount(partner_id, tax_year)`**
   - Calculates exact total compensation from paid commissions
   - Only includes commissions with status = 'paid'

3. **`generate_1099_batch(tax_year, generated_by)`**
   - Generates 1099 forms for all eligible partners
   - Only generates for partners with completed W-9
   - Admin-only function with security checks

4. **`get_1099_data(1099_id)`**
   - Retrieves formatted data for PDF generation
   - Includes payer and recipient information
   - Masks sensitive tax ID numbers

---

## Accessing the 1099 Manager

### URL
```
https://yourdomain.com/admin/1099-manager
```

### Access Requirements
- Admin role required
- Must be logged in with admin credentials
- Navigate from admin dashboard or use direct URL

---

## Using the 1099 Manager

### Step 1: Select Tax Year

1. Use the dropdown at the top to select the tax year
2. Default: Previous year (e.g., in 2025, defaults to 2024)
3. Can view up to 10 years of historical data

### Step 2: Review Eligible Partners

The system shows:
- **Total Eligible Partners**: Partners who earned $600+
- **Forms Generated**: Already created 1099s
- **Missing W-9**: Partners who need to complete W-9

### Step 3: Generate 1099 Batch

1. Review the "Ready for 1099 generation" banner
2. Click **Generate Batch** button
3. Confirm the action
4. System generates 1099s for all eligible partners with W-9s

**What happens:**
- Creates 1099-NEC record for each partner
- Calculates exact compensation from commission records
- Links to partner's W-9 document
- Sets status to "generated"
- Records admin who generated the batch

### Step 4: Review Generated Forms

The table shows all generated 1099s with:
- Partner name and email
- Business name (from W-9)
- Total compensation amount
- Current status
- Generation date
- Action buttons

### Step 5: Download/Print Forms

1. Click the **Download** icon next to any 1099
2. Opens formatted 1099-NEC form in new window
3. Use browser's Print function to:
   - Print directly to printer
   - Save as PDF
   - Send to recipient

### Step 6: Mark Status

**Mark as Sent:**
- Use after mailing forms to partners
- Updates status to "sent"
- Records sent date

**Mark as Filed:**
- Use after filing with IRS
- Updates status to "filed"
- Records filed date

### Step 7: Export Data

1. Click **Export CSV** button
2. Downloads spreadsheet with all 1099 data
3. Use for:
   - IRS electronic filing systems
   - Accounting software import
   - Record keeping
   - Audit trail

---

## Form 1099-NEC Details

### Box 1: Nonemployee Compensation
- Shows total commission payments for the year
- Only includes paid commissions (status = 'paid')
- Calculated from `affiliate_commissions` table
- Must be $600 or more to generate 1099

### Box 4: Federal Income Tax Withheld
- Currently set to $0.00
- Can be updated if backup withholding required
- Rare for independent contractors

### Box 5-7: State Tax Information
- State tax withheld
- State identification number
- State income
- Customize based on your state requirements

### Payer Information (Your Company)
The form shows your company as the payer:
- **Name**: LocalLink Marketplace LLC
- **Address**: 123 Business Street
- **City, State, ZIP**: Los Angeles, CA 90001
- **Phone**: (555) 123-4567
- **EIN**: 12-3456789

**IMPORTANT**: Update this information in the edge function before production use:
- Edit: `supabase/functions/generate-1099-pdf/index.ts`
- Search for: `'payer'` in the `get_1099_data` function
- Replace with your actual business information

### Recipient Information (Partner)
Pulled from partner's W-9 form:
- Business name or individual name
- Address
- Tax ID (SSN or EIN) - masked for security
- Tax classification

---

## Important Tax Compliance Notes

### IRS Requirements

1. **$600 Threshold**
   - Must issue 1099-NEC if paid $600+ in a calendar year
   - Includes all forms of nonemployee compensation
   - No exceptions for small amounts

2. **Filing Deadlines**
   - **January 31**: Deadline to furnish Copy B to recipients
   - **January 31**: Deadline to file Copy A with IRS (if paper filing)
   - **March 31**: Deadline for electronic filing to IRS

3. **Required Information**
   - Payer's name, address, and EIN
   - Recipient's name, address, and TIN
   - Total nonemployee compensation
   - Any federal or state tax withheld

### W-9 Requirement

**CRITICAL**: You cannot generate a 1099 without a completed W-9 on file.

The W-9 provides:
- Recipient's legal name
- Business name (if applicable)
- Tax identification number (SSN or EIN)
- Address
- Tax classification
- Certification and signature

If a partner is missing their W-9:
1. They appear in "Missing W-9" count
2. Cannot generate 1099 for them
3. Must complete W-9 via DocuSign first
4. System enforces this automatically

### Corrections

If you need to correct a 1099:
1. Generate new corrected 1099
2. Mark original as "corrected"
3. Record correction reason
4. Send corrected form to recipient
5. File correction with IRS

---

## Security & Privacy

### Tax ID Masking
- SSN/EIN numbers are masked in generated PDFs
- Shows only last 4 digits (e.g., XXX-XX-1234)
- Full numbers stored securely in database
- Only admins can access full numbers

### Row Level Security (RLS)
- Admins: Full access to all 1099 records
- Partners: Can only view their own sent/filed 1099s
- Draft/generated forms hidden from partners until sent

### Access Control
- Only admin role can generate 1099s
- Only admin role can mark status changes
- Only admin role can export CSV data
- All actions logged with user ID and timestamp

---

## Workflow Recommendations

### Annual Process (Recommended Timeline)

**Early January:**
1. Review all partners who earned commissions previous year
2. Verify all eligible partners have W-9s on file
3. Send W-9 reminders to partners missing forms

**Mid January (Week 2-3):**
1. Wait for all W-9s to be completed
2. Generate 1099 batch for previous tax year
3. Review all generated forms for accuracy

**Late January (Week 3-4):**
1. Download/print all 1099 forms
2. Mail Copy B to all partners
3. Mark forms as "sent" in system
4. Keep Copy A for IRS filing

**Before January 31:**
1. File Copy A with IRS (paper or electronic)
2. Mark forms as "filed" in system
3. Export CSV for accounting records

**Post-Filing:**
1. Respond to any correction requests
2. Generate amended 1099s if needed
3. Maintain records for 3+ years

---

## Partner View (Optional)

Partners can view their 1099s after you mark them as "sent":
- Partners see their own 1099 in their partner dashboard
- Can download PDF copy
- Can verify amounts match their records
- Cannot edit or delete forms

---

## Troubleshooting

### "Partner earned $600+ but not showing as eligible"

**Check:**
1. Are commissions marked as "paid"?
2. Is the paid_at date in the correct tax year?
3. Did commissions get reversed/refunded?

**Solution:**
- Query: `SELECT * FROM affiliate_commissions WHERE partner_id = '[ID]' AND status = 'paid' AND EXTRACT(YEAR FROM paid_at) = 2024`

### "Cannot generate 1099 for partner"

**Check:**
1. Does partner have completed W-9?
2. Is W-9 status = 'completed'?
3. Did they earn at least $600?

**Solution:**
- Check W-9 status: `SELECT * FROM partner_w9_documents WHERE partner_id = '[ID]' AND status = 'completed'`

### "Compensation amount seems incorrect"

**Check:**
1. Query total paid commissions for the year
2. Verify commission statuses are 'paid'
3. Check for any refunds or chargebacks

**Solution:**
- Recalculate: `SELECT * FROM calculate_partner_1099_amount('[partner_id]', 2024)`

### "Form won't download"

**Check:**
1. Edge function deployed correctly?
2. Browser blocking pop-ups?
3. Check browser console for errors

**Solution:**
- Verify edge function: `supabase functions list`
- Test directly: `supabase functions invoke generate-1099-pdf --data '{"form_1099_id":"[ID]"}'`

---

## Database Queries for Admins

### Get all eligible partners for 2024
```sql
SELECT * FROM get_partners_eligible_for_1099(2024);
```

### Get total compensation for specific partner
```sql
SELECT * FROM calculate_partner_1099_amount('[partner-id]', 2024);
```

### View all generated 1099s for 2024
```sql
SELECT
  p.full_name,
  p.email,
  doc.total_compensation,
  doc.status,
  doc.generated_at
FROM partner_1099_documents doc
JOIN partners p ON p.id = doc.partner_id
WHERE doc.tax_year = 2024
ORDER BY doc.generated_at DESC;
```

### Find partners missing W-9
```sql
SELECT
  p.id,
  p.full_name,
  p.email,
  SUM(c.amount) as total_earned
FROM partners p
JOIN affiliate_commissions c ON c.partner_id = p.id
WHERE c.status = 'paid'
  AND EXTRACT(YEAR FROM c.paid_at) = 2024
  AND NOT EXISTS (
    SELECT 1 FROM partner_w9_documents w9
    WHERE w9.partner_id = p.id
    AND w9.status = 'completed'
  )
GROUP BY p.id, p.full_name, p.email
HAVING SUM(c.amount) >= 600;
```

---

## Customization

### Update Payer Information

Edit: `supabase/functions/generate-1099-pdf/index.ts`

Find the `payer` object in `get_1099_data` function and update:

```typescript
'payer', jsonb_build_object(
  'name', 'YOUR COMPANY NAME LLC',
  'address', 'YOUR STREET ADDRESS',
  'city_state_zip', 'YOUR CITY, STATE ZIP',
  'phone', '(555) 123-4567',
  'ein', 'XX-XXXXXXX'  // Your actual EIN
)
```

Then redeploy the function:
```bash
supabase functions deploy generate-1099-pdf
```

### Customize PDF Layout

The 1099 form HTML is in the `generateForm1099HTML` function.

You can modify:
- Styling (fonts, colors, spacing)
- Layout (box sizes, positioning)
- Additional instructions
- Company branding

---

## Production Checklist

Before using in production:

- [ ] Update payer information with your company details
- [ ] Verify your company EIN is correct
- [ ] Test with a few sample 1099s
- [ ] Verify amounts match commission records
- [ ] Ensure W-9 system is functioning
- [ ] Review IRS filing deadlines
- [ ] Set up record retention policy
- [ ] Train admin staff on process
- [ ] Prepare partner communication templates
- [ ] Establish correction process

---

## Support & Additional Resources

### IRS Resources
- [Form 1099-NEC Instructions](https://www.irs.gov/forms-pubs/about-form-1099-nec)
- [General 1099 Instructions](https://www.irs.gov/forms-pubs/about-form-1099-misc)
- [Independent Contractor vs Employee](https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee)

### System Integration
- W-9 DocuSign System: See `W9_DOCUSIGN_INTEGRATION_GUIDE.md`
- Commission System: See `PARTNER_COMMISSION_SYSTEM.md`
- Partner Dashboard: See `PARTNER_SYSTEM_GUIDE.md`

### Questions?
Contact your tax advisor or CPA for specific tax compliance questions. This system provides the technical infrastructure but does not constitute tax advice.

---

## System Maintenance

### Annual Review
- Review eligibility threshold ($600)
- Update tax forms if IRS revises
- Review state tax requirements
- Update payer information if changed

### Database Maintenance
- Archive old 1099 records after 7 years
- Backup 1099 data regularly
- Maintain audit logs
- Review and update RLS policies

---

**Last Updated**: February 9, 2026
**Version**: 1.0
**Status**: Production Ready
