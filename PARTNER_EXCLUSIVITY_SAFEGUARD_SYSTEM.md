# Partner Exclusivity Safeguard System

## Overview

Your Local-Link platform maintains **territorial and merchant exclusivity** to protect partner investments and encourage long-term relationship building. This safeguard system protects against the downsides of exclusivity (inactive partners, merchant dissatisfaction) while maintaining all the benefits.

---

## Exclusivity Model

### ✅ Territory Exclusivity
- Each territory assigned to **ONE partner only**
- Partner has exclusive rights to sign merchants in their territory
- Prevents territory conflicts and commission disputes
- Creates "territory owner" mentality vs. commission hunters

### ✅ Merchant Exclusivity
- Each merchant has **ONE assigned partner**
- That partner earns all recurring commissions from that merchant
- Clear attribution = clean accounting
- Partner incentivized to support merchant success long-term

---

## Safeguard Components

### 1. Inactivity Detection System

**Three-Tier Warning System:**

| Days Inactive | Warning Level | Action |
|--------------|---------------|---------|
| 30-59 days   | Minor         | Email warning, log in dashboard |
| 60-89 days   | Moderate      | Urgent warning + 30-day deadline |
| 90+ days     | Severe        | Final warning (strike) + 14-day deadline |

**Strike System:**
- 3 severe warnings (strikes) = Territory recovery
- Strikes issued for 90+ day inactivity
- Partner notified before each strike
- Admin can reset strikes manually

**Inactivity Defined As:**
- No merchant signups in X days
- OR no platform login in X days
- Whichever is worse

### 2. Performance Tracking

**Activity Score (0-100):**
- Merchants signed in last 30 days: 5 points each (max 40)
- Deals created in last 30 days: 2 points each (max 20)
- Recent login (within 7 days): 20 points
- Recent merchant activity: 20 points

**Performance Tiers:**
- Starter: 0-25 score
- Growth: 26-50 score
- Pro: 51-75 score
- Enterprise: 76-100 score

Tier affects commission rates and features.

### 3. Merchant Reassignment Process

**When Can Merchants Request Reassignment?**
- After 90 days with current partner
- Any reason (poor service, unresponsive, wants different partner)
- Admin approval required

**Reassignment Process:**
1. Merchant submits request with reason
2. Admin reviews (check merchant tenure, partner history)
3. If approved:
   - Merchant moved to new partner
   - **Original partner receives 90-day residual commission**
   - Clean handoff with no hard feelings

**Why 90-Day Residual?**
- Fair compensation for partner's initial work
- Prevents gaming the system
- Incentivizes smooth transition
- Original partner still invested in merchant success during transition

### 4. Territory Recovery System

**When Territories Are Recovered:**
- Partner receives 3 strikes (90+ day inactivity warnings)
- Partner status changed to "Suspended"
- Territory status changed to "Recovering"
- Territory made available for reassignment after 30-day recovery period

**What Happens to Merchants?**
- Existing merchants stay with original partner
- Partner still earns commission on existing merchants
- Cannot sign NEW merchants until reinstated
- If partner wants to resume, can apply for reinstatement

**Recovery Log:**
- All recoveries logged with reason and metrics
- Audit trail for compliance
- Track merchants affected
- Document inactivity details

---

## Database Schema

### New Tables

**partner_performance_metrics**
- Tracks monthly performance (merchants signed, revenue, activity score)
- Used for tier upgrades/downgrades
- Historical performance data

**partner_warnings**
- Warning history (type, severity, deadline)
- Resolution tracking
- Automated + manual warnings

**merchant_reassignment_requests**
- Merchant-initiated partner changes
- Approval workflow
- Residual commission tracking

**territory_recovery_log**
- Audit trail of territory recoveries
- Documents inactivity and warnings
- Compliance record

### Updated Tables

**partners**
- `performance_tier` - Current performance tier
- `last_merchant_signup` - Last time they signed a merchant
- `last_login` - Last platform access
- `total_merchants` - Running count
- `active_warnings` - Current unresolved warnings
- `inactivity_strike_count` - 0-3 strikes

**merchants**
- `original_partner_id` - Who signed them originally
- `partner_assigned_at` - When assigned to current partner
- `residual_commission_end_date` - When residual period ends

---

## Automated Functions

### Edge Function: partner-inactivity-scanner

**What It Does:**
- Checks all active partners for inactivity
- Issues warnings based on thresholds
- Recovers territories after 3 strikes
- Updates partner metrics

**Run Schedule:**
- Manually via Admin UI
- Can be scheduled via cron (recommended: daily)

**Process:**
1. Query all active partners
2. Calculate days since last activity
3. Issue appropriate warnings
4. Recover territories if needed
5. Send notifications (email/SMS)
6. Log all actions

### Helper Functions

**calculate_partner_activity_score(partner_id, days)**
- Returns 0-100 activity score
- Used for performance tier calculations
- Factors in logins, signups, deals

**check_partner_inactivity(partner_id)**
- Returns inactivity assessment
- Recommends warning level
- Shows days inactive

**approve_merchant_reassignment(request_id, admin_id, notes)**
- Processes reassignment approval
- Sets residual commission period
- Updates merchant assignment
- Creates audit log

---

## Admin UI

### Partner Safeguards Dashboard (`/admin/partner-safeguards`)

**Four Tabs:**

1. **Overview**
   - System status
   - Protection rules summary
   - Quick stats

2. **Active Warnings**
   - All unresolved warnings
   - Severity filtering
   - One-click resolution

3. **Inactive Partners**
   - Partners with 30+ day inactivity
   - Activity scores
   - Strike counts
   - Days inactive

4. **Reassignment Requests**
   - Pending merchant reassignment requests
   - Approve/deny workflow
   - Reason review

**Actions:**
- Run inactivity scan manually
- Resolve warnings
- Approve/deny reassignments
- View recovery history

---

## Benefits vs. Risks

### ✅ Benefits of Exclusivity (KEPT)

**For Partners:**
- Protected investment in territory
- Predictable recurring income
- Long-term relationship incentive
- No commission disputes
- Territory ownership pride

**For Platform:**
- Simple, clean accounting
- Partner commitment
- Reduced conflicts
- Scalable model
- Clear legal structure

**For Merchants:**
- Dedicated support
- Consistent contact
- Long-term relationship
- Partner invested in success

### ⚠️ Risks of Exclusivity (MITIGATED)

| Risk | Mitigation |
|------|------------|
| Inactive partners block growth | Automatic territory recovery after 90 days + warnings |
| Bad partner hurts merchants | Merchant can request reassignment after 90 days |
| Land grabbing | Performance tracking + inactivity detection |
| Quality variance | Warning system gives partners chance to improve |
| Merchant stuck | Admin can override + reassignment process |

---

## Operational Procedures

### Daily Operations

1. **Run Inactivity Scanner**
   - Manual: Visit `/admin/partner-safeguards` and click "Run Inactivity Scan"
   - Automatic: Set up cron job to call edge function daily
   - Review warnings issued
   - Check territories recovered

2. **Review New Warnings**
   - Check severity levels
   - Verify accuracy
   - Reach out to partners proactively

3. **Process Reassignment Requests**
   - Review merchant reason
   - Check partner history
   - Approve/deny with notes
   - Notify both parties

### Weekly Operations

1. **Performance Review**
   - Check partner activity scores
   - Identify at-risk partners
   - Reach out proactively before warnings

2. **Warning Follow-ups**
   - Check if warned partners improved
   - Resolve warnings if appropriate
   - Issue reminders on deadlines

### Monthly Operations

1. **Territory Health Check**
   - Review all territories
   - Identify underperforming regions
   - Plan partner support/training

2. **Performance Tier Updates**
   - Calculate updated activity scores
   - Upgrade/downgrade partner tiers
   - Adjust commission rates accordingly

---

## Commission Rules During Transition

### Merchant Reassignment

**Scenario:** Merchant reassigned from Partner A to Partner B

**For 90 days after reassignment:**
- Partner B (new): Earns full recurring commission
- Partner A (original): Earns residual commission (same %)
- Platform: Absorbs residual cost (worth it for merchant satisfaction)

**After 90 days:**
- Partner B: Earns full commission
- Partner A: No longer earns from this merchant
- Normal commission structure resumes

### Territory Recovery

**Scenario:** Territory recovered from Partner A

**Existing Merchants:**
- Partner A keeps earning commission on existing merchants
- Partner A cannot sign NEW merchants
- If Partner A reinstated, can resume signing merchants

**New Merchants After Recovery:**
- Territory available for new partner
- New partner earns commission on their signups
- No impact on Partner A's existing merchants

---

## Email Notifications

### Warning Emails

**30-Day Warning (Minor):**
```
Subject: Partner Activity Notice - 30 Days

Hi [Partner Name],

We noticed it's been 30+ days since your last merchant signup or login.
To maintain your territory in good standing, please:

- Log in to your partner dashboard
- Sign at least 1 new merchant in the next 30 days

Your territory: [Territory Name]
Last activity: [Date]

Need help? Contact your partner success manager.
```

**60-Day Warning (Moderate):**
```
Subject: ACTION REQUIRED - Territory Activity Warning

Hi [Partner Name],

It's been 60+ days without activity. This is important.

To keep your territory assignment:
- Sign at least 1 merchant within 30 days
- Log in and review your dashboard

If no activity within 30 days, we'll need to review your territory assignment.

We're here to help. Reply to schedule a call.
```

**90-Day Warning (Severe/Strike):**
```
Subject: FINAL WARNING - Territory Recovery in 14 Days

Hi [Partner Name],

This is your final warning before territory recovery.

Status:
- 90+ days without merchant signup
- Strike issued against your account
- 14 days to take action

Required action:
- Sign at least 2 merchants within 14 days
- Complete partner training refresher
- Schedule call with your manager

After 3 strikes, your territory will be recovered and reassigned.

This is serious. Let's talk today.
```

### Reassignment Emails

**To Merchant (Request Received):**
```
Subject: Partner Change Request Received

Hi [Business Name],

We received your request to change partners.

Current partner: [Partner A]
Reason: [Merchant's reason]

Our team will review and respond within 3 business days.

If approved, Partner [A] will continue earning for 90 days to ensure smooth transition.
```

**To Partner (Reassignment Approved):**
```
Subject: Merchant Reassignment Notice - Residual Commission

Hi [Partner Name],

Merchant [Business Name] has been reassigned to a new partner at their request.

You will continue earning residual commission for 90 days:
- Same commission rate
- Automatic payouts
- No action required

After 90 days, commission transfers fully to new partner.

Questions? Contact support.
```

---

## Success Metrics

Track these metrics monthly:

- **Territory Recovery Rate** - % of territories recovered (target: <5%)
- **Reassignment Rate** - % of merchants requesting reassignment (target: <2%)
- **Warning Resolution Rate** - % of warnings resolved without escalation (target: >80%)
- **Average Partner Activity Score** - Platform-wide average (target: >60)
- **Strike Rate** - % of partners with strikes (target: <10%)
- **Partner Retention** - % of partners active after 12 months (target: >90%)

---

## Best Practices

### For Admins

1. **Be Proactive** - Don't wait for 90 days. Reach out at 30.
2. **Communicate Clearly** - Partners should know the rules upfront
3. **Fair But Firm** - Apply rules consistently
4. **Document Everything** - Use the audit logs
5. **Support Success** - Help partners before they fail

### For Partners

1. **Stay Active** - Log in weekly minimum
2. **Sign Merchants Regularly** - Target 2-3/month minimum
3. **Support Your Merchants** - Their success = your income
4. **Respond to Warnings** - Take them seriously
5. **Ask for Help** - Use partner success resources

---

## Implementation Checklist

- [x] Database migration applied (partner safeguard system)
- [x] Edge function deployed (inactivity scanner)
- [x] Admin UI created (safeguards dashboard)
- [ ] Set up cron job for daily scans
- [ ] Configure email templates
- [ ] Add email sending to edge function
- [ ] Test warning workflow end-to-end
- [ ] Test reassignment workflow
- [ ] Test territory recovery
- [ ] Document in partner agreement/terms
- [ ] Train admin team on procedures
- [ ] Communicate to existing partners

---

## Future Enhancements

1. **SMS Notifications** - In addition to email
2. **Partner Support Bot** - AI assistant for at-risk partners
3. **Automatic Tier Adjustments** - Based on performance scores
4. **Territory Marketplace** - Partners can trade/sell territories
5. **Performance Leaderboards** - Gamification for engagement
6. **Predictive Analytics** - Flag at-risk partners before inactivity
7. **Partner Success Playbook** - Automated best practices delivery
8. **White-Label Reporting** - Partners can show merchants their value

---

## Support

**For Admin Questions:**
- Review `/admin/partner-safeguards` dashboard
- Check audit logs for history
- Contact platform support

**For Partner Questions:**
- Partner success manager (assigned to each partner)
- Partner portal help center
- Email: partners@locallink.com

---

## Summary

✅ **Exclusivity model maintained** - Partners and merchants have exclusive relationships

✅ **Inactive partners detected** - 30/60/90 day automatic monitoring

✅ **Territory protection** - Recovery after 3 strikes, not arbitrary

✅ **Merchant rights protected** - Can request reassignment after 90 days

✅ **Fair transitions** - 90-day residual commission on reassignments

✅ **Audit trail** - Complete logging for compliance

✅ **Admin control** - Manual overrides and review process

**Result:** Best of both worlds - exclusivity benefits with accountability safeguards.
