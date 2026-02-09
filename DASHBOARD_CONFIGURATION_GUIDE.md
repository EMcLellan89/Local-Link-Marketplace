# Supabase Dashboard Configuration Guide

This guide covers security settings and configurations that must be applied through the Supabase Dashboard (not via migrations).

---

## 🔐 Auth Configuration Settings

### 1. Leaked Password Protection

**Status:** ⚠️ Currently Disabled (Recommended to Enable)

**What it does:** Checks user passwords against the HaveIBeenPwned database to prevent users from using compromised passwords.

**How to enable:**
1. Navigate to: `Authentication > Policies` in Supabase Dashboard
2. Find "Leaked Password Protection"
3. Toggle the setting to **Enabled**

**Recommendation:** **Enable this feature** to enhance account security. It prevents users from setting passwords that have been exposed in data breaches.

---

### 2. Auth Database Connection Strategy

**Status:** ⚠️ Currently using Fixed (10 connections)

**Issue:** Your Auth server uses a fixed number (10) of database connections. If you scale up your database instance, the Auth server won't automatically benefit from additional resources.

**Recommended Fix:** Switch to percentage-based allocation

**How to fix:**
1. Navigate to: `Project Settings > Database` in Supabase Dashboard
2. Look for "Connection Pooling" or "Auth Pooler" settings
3. Change from "Fixed" to "Percentage-based"
4. Set an appropriate percentage (e.g., 10-20% of total connections)

**Why this matters:** Percentage-based allocation scales automatically as you upgrade your database instance, ensuring the Auth server can handle increased load.

---

## ✅ Multiple Permissive Policies (Intentional)

**Status:** ✅ These are intentional and secure by design

The following tables have multiple RLS policies that appear as warnings but are **intentionally designed this way** for different user roles and access patterns:

### Tables with Multi-Role Access

These tables need different policies for different user types (customers, merchants, admins):

#### Customer & Merchant Dual Access
- `notifications` - Customers see their own, merchants see their own
- `support_tickets` - Both can create and view their own tickets
- `paybright_transactions` - Both view their own transaction history
- `paybright_subscriptions` - Both view their own subscriptions
- `paybright_audit_log` - Both view their own audit logs

#### Admin, Partner, & User Multi-Access
- `partners` - Admins manage all, partners view their own
- `territories` - Admins manage, partners view assigned territories
- `payout_batches` - Admins manage, partners view their own
- `transactions` - Admins view all, partners view their own
- `expansion_requests` - Admins manage, partners can create and view own
- `partner_warning_logs` - Admins manage, partners view their own warnings
- `certifications` - Admins manage, partners view their own

#### UGC & Creator System
- `ugc_orders` - Admins manage all, creators view assigned, merchants view their orders
- `ugc_creators` - Admins manage all, creators manage their own profiles
- `ugc_packages` - Admins manage, anyone can view active packages
- `ugc_assets` - Admins manage all, creators upload to orders, participants view
- `ugc_payouts` - Admins manage, creators view their own

#### Public + Role-Specific Access
- `merchants` - Public can view approved merchants, merchants view their own full profile
- `merchant_locations` - Public can view active locations, merchants view all their own
- `printing_products` - Admins manage, anyone can view active products
- `website_templates` - Admins manage, anyone can view active templates
- `printing_orders` - Admins manage all, merchants manage their own
- `qr_codes` - Partners manage their own, public can scan (read-only)
- `reviews` - Customers view approved reviews, merchants view all reviews about their business
- `deal_locations` - Anyone can view, merchants can manage their deal locations

#### Service & System Access
- `partner_subscriptions` - Partners view own, service role manages all
- `territory_licenses` - Partners view own, service role manages all
- `merchant_addon_subscriptions` - Merchants view own, service role manages all
- `service_bookings` - Users view own, service role manages all
- `usage_tracking` - Users view own, service role manages all
- `notification_queue` - Users view own, service role manages all
- `system_settings` - Anyone can view public settings, service role manages all (applies to all roles: anon, authenticated, authenticator, dashboard_user)

#### Special Cases
- `loyalty_contract_uploads` - Admins manage all, merchants manage their own
- `merchant_orders` - Admins view all, merchants view their own
- `merchant_subscriptions` - Admins view all, merchants view their own
- `gift_cards` - Customers view their own, merchants view cards for their business
- `campaign_recipients` - Customers view campaigns sent to them, merchants view recipients of their campaigns
- `survey_responses` - Customers view their own, merchants view responses to their surveys
- `postcard_mailings` - Admins manage, authenticated users can view
- `postcard_placements` - Admins manage, authenticated users can view
- `partner_applications` - Admins manage, anyone can submit (public applications)

### Why Multiple Policies Are Correct

**Multiple permissive policies are the RIGHT approach when:**
1. Different user roles need different access to the same data
2. Some data is public while other data requires authentication/ownership
3. Admins need full access while users need restricted access
4. Service roles need system-level access while users need user-level access

**Do NOT consolidate these policies** - they serve distinct security purposes!

---

## 📊 Index Management Notes

### Unused Indexes (Now Removed)

**Action Taken:** All unused indexes have been dropped in migrations

**What was done:**
- Analyzed index usage patterns
- Dropped 300+ unused indexes
- Kept all foreign key indexes (critical for performance)
- Kept all primary key and unique constraint indexes (required)

**Benefits:**
- **Faster writes:** Less index maintenance overhead
- **Reduced storage:** Less disk space used
- **Better vacuum performance:** Fewer indexes to maintain

**Monitoring:** In production, you should periodically check for unused indexes:

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexrelname NOT LIKE 'pg_%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## 🎯 Summary Checklist

- [ ] **Enable Leaked Password Protection** (Auth > Policies)
- [ ] **Switch to Percentage-based Auth Connections** (Settings > Database)
- [x] **Multiple Permissive Policies** - These are intentional, no action needed
- [x] **Unused Indexes** - Already dropped via migrations
- [x] **Function Search Paths** - Already fixed via migrations
- [x] **RLS Policy Optimization** - Already optimized via migrations

---

## 📝 Notes

### Settings That Can Only Be Changed in Dashboard
1. Auth settings (password policies, providers, email templates)
2. Database connection pooling strategies
3. API rate limits
4. Storage bucket policies
5. Edge Functions environment variables
6. Custom domain configuration
7. Project-level security settings

### Settings That Should Be Changed via Migrations
1. Database schema (tables, columns, constraints)
2. RLS policies
3. Database functions and triggers
4. Indexes
5. Foreign key relationships
6. Table-level security

---

**Last Updated:** January 2026
**Platform:** Supabase Dashboard
**Required Role:** Project Owner or Admin
