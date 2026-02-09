# Bundled CRM Pricing - Quick Reference

## New Pricing (Effective Immediately)

All merchant subscriptions now include LocalLink CRM bundled in:

| Tier | Old Price | New Price | CRM Tier | Contacts | Team | Books |
|------|-----------|-----------|----------|----------|------|-------|
| **Starter** | $149 | **$179** | Basic CRM | 500 | 2 | Lite |
| **Founders** | $249 | **$279** | Professional CRM | 2,500 | 5 | Pro |
| **Standard** | $299 | **$349** | Business CRM | 10,000 | 15 | Pro |
| **Premium** | $349 | **$449** | Enterprise CRM | Unlimited | Unlimited | Pro |

## Annual Pricing (11% Discount)

- Starter: $1,913/year (save $235)
- Founders: $2,983/year (save $365)
- Standard: $3,733/year (save $455)
- Premium: $4,801/year (save $587)

## What's Included

### Every Tier Gets:
- Marketplace access
- Postcard placement
- Full CRM system (tier-based)
- Lead auto-capture
- Customer management
- Books (Lite or Pro)
- Team collaboration
- Mobile app access

### CRM Features by Tier:

**Basic CRM** (Starter)
- 500 contacts, Books Lite, 2 team members

**Professional CRM** (Founders)
- 2,500 contacts, Books Pro, 5 team members, AI prompts

**Business CRM** (Standard)
- 10,000 contacts, Books Pro, 15 team members, AI tools, automation

**Enterprise CRM** (Premium)
- Unlimited everything, full AI suite, API access, white-label

## Key Talking Points

1. "CRM is included, not an add-on"
2. "Leads automatically capture from marketplace"
3. "One login, one system, one price"
4. "Grow your CRM as your business grows"
5. "No separate subscriptions to manage"

## Database Function

Check merchant CRM access:
```sql
SELECT * FROM get_merchant_crm_access('merchant-uuid');
```

## Status

- Migration: Applied
- Documentation: Complete
- Build: Verified
- Status: Production Ready

---

**Full Documentation:** See MERCHANT_BUNDLED_CRM_PRICING_COMPLETE.md
