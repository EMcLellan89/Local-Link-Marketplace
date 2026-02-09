# Weekly Winners Feed - Quick Reference Card

## 🚀 Test It Right Now (2 Minutes)

```sql
-- 1. Seed test data (run in Supabase SQL Editor)
-- Copy/paste: SEED_WEEKLY_WINNERS_TEST_DATA.sql
```

```bash
# 2. View the feed
Navigate to: /partner/winners
```

```bash
# 3. Manage creatives
Navigate to: /admin/creatives
```

## 📋 Key URLs

| Page | URL | Who |
|------|-----|-----|
| Winners Feed | `/partner/winners` | Partners |
| Creative Manager | `/admin/creatives` | Admins |
| Track Event API | `/functions/v1/track-creative-event` | Public |
| Calculate Winners | `/functions/v1/calculate-weekly-winners` | Admins |

## 🔧 Integration Snippets

### Track Impression (Landing Page)
```typescript
import { trackCreativeEvent, getCreativeIdFromUrl } from '@/lib/creativeTracking';

useEffect(() => {
  const creative_id = getCreativeIdFromUrl();
  if (creative_id) {
    trackCreativeEvent({ creative_id, event_type: "impression" });
  }
}, []);
```

### Track Click (Button)
```typescript
<button onClick={async () => {
  await trackCreativeEvent({
    creative_id: getCreativeIdFromUrl(),
    event_type: "click"
  });
  navigate("/checkout");
}}>
  Get Started
</button>
```

### Track Purchase (Webhook)
```typescript
await trackCreativeEvent({
  creative_id: order.metadata.creative_id,
  event_type: "purchase",
  revenue_cents: order.amount_total,
  profile_id: customer_id,
});
```

## 🤖 Enable Auto-Calculation

```sql
-- Run every Monday at 6 AM
SELECT cron.schedule(
  'calculate-weekly-winners',
  '0 6 * * 1',
  $$
    SELECT calculate_weekly_winners('storylab_kids', 'kids');
    SELECT calculate_weekly_winners('storylab_teen', 'teen');
    SELECT calculate_weekly_winners('storylab_adult', 'adult');
  $$
);
```

## 🔍 Quick Checks

### Check if winners exist
```sql
SELECT * FROM weekly_creative_winners
ORDER BY rank LIMIT 10;
```

### Check event volume
```sql
SELECT
  event_type,
  COUNT(*) as count
FROM creative_events
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY event_type;
```

### Force recalculation
```sql
SELECT calculate_weekly_winners('storylab_kids', 'kids');
```

### View creative performance
```sql
SELECT
  creative_key,
  lifetime_purchases,
  lifetime_revenue_cents / 100.0 as revenue_dollars
FROM ad_creatives
WHERE is_approved = true
ORDER BY lifetime_purchases DESC
LIMIT 10;
```

## 📊 Key Metrics Dashboard

```sql
-- Partner adoption rate
SELECT
  COUNT(DISTINCT partner_id) as active_partners,
  COUNT(*) as total_events,
  COUNT(*) FILTER (WHERE event_type = 'purchase') as purchases,
  SUM(revenue_cents) / 100.0 as revenue_dollars
FROM creative_events
WHERE created_at > NOW() - INTERVAL '7 days';
```

```sql
-- Top performing creatives
SELECT
  c.creative_key,
  c.headline,
  w.purchases,
  w.revenue_cents / 100.0 as revenue,
  w.ctr * 100 as ctr_percent,
  w.cvr * 100 as cvr_percent,
  w.recommended_budget_daily_cents / 100.0 as daily_budget
FROM weekly_creative_winners w
JOIN ad_creatives c ON w.creative_id = c.id
ORDER BY w.rank
LIMIT 5;
```

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| No winners showing | Run `calculate_weekly_winners()` |
| Events not tracking | Check edge function deployed |
| Slow queries | Verify indexes exist |
| Missing creative_id | Check URL has `?creative_id=uuid` |

## 📚 Documentation Files

- `WEEKLY_WINNERS_QUICK_START.md` - 5-minute test guide
- `WEEKLY_WINNERS_FEED_COMPLETE.md` - Full technical docs
- `MOAT_SYSTEM_DEPLOYED.md` - Deployment status
- `MOAT_ARCHITECTURE_VISUAL.md` - System architecture
- `SEED_WEEKLY_WINNERS_TEST_DATA.sql` - Test data

## 🎯 Success Criteria

✅ Winners feed shows top 10 creatives
✅ Copy buttons work
✅ Budget recommendations show
✅ Targeting notes display
✅ Events track correctly
✅ Admin can create/approve creatives
✅ Weekly calculation runs
✅ Partners report higher conversion

## 💡 Pro Tips

1. **Seed real data early** - Better recommendations
2. **Run calculation manually first week** - Verify it works
3. **Share winners feed with all partners** - Adoption is key
4. **Monitor creative_events growth** - Should increase daily
5. **Track partner sales correlation** - Winners users vs. non-users
6. **Celebrate wins publicly** - Share success stories
7. **Iterate on recommendations** - Adjust thresholds based on data

## ⚡ Quick Commands

```bash
# Deploy edge functions
supabase functions deploy track-creative-event
supabase functions deploy calculate-weekly-winners

# View edge function logs
supabase functions logs track-creative-event
supabase functions logs calculate-weekly-winners

# Run build
npm run build

# Start dev server (auto-runs)
# (handled by system)
```

## 🎨 Color Guide (Winners Feed)

- 🥇 Gold badge = #1 winner
- 🥈 Silver badge = #2 winner
- 🥉 Bronze badge = #3 winner
- 🔵 Blue box = Budget recommendation
- 🟠 Orange box = Targeting notes
- 🟢 Green text = Revenue/purchases

## 📈 Expected Growth Pattern

```
Week 1: 3-5 creatives, 500 events, 1 winner emerges
Week 2: 8-12 creatives, 2,000 events, top 3 stable
Week 4: 20+ creatives, 10,000 events, top 5 proven
Week 8: 50+ creatives, 50,000 events, system predictions accurate
Week 12: 100+ creatives, 200,000 events, moat established
```

## 🔒 Security Checklist

- [x] RLS enabled on all tables
- [x] Admin endpoints require JWT + role check
- [x] Event tracking is write-only
- [x] Winners feed is public (by design)
- [x] No PII in events table
- [x] Function search paths secured

## ⚠️ What NOT To Do

❌ Don't delete old events (needed for lifetime stats)
❌ Don't skip RLS policies
❌ Don't run calculation during peak hours (use cron)
❌ Don't approve untested creatives
❌ Don't track PII in events
❌ Don't disable event tracking (breaks system)

## ✅ Production Checklist

- [ ] Seed test data
- [ ] Test admin UI
- [ ] Test partner UI
- [ ] Test event tracking
- [ ] Enable cron job
- [ ] Add tracking to checkout
- [ ] Monitor first week
- [ ] Verify auto-calculation works
- [ ] Track partner adoption
- [ ] Measure success correlation

---

**This card has everything you need. Bookmark it.**

Test → Deploy → Monitor → Win.
