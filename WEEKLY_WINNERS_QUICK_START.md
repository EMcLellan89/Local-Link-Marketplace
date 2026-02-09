# Weekly Winners Feed - Quick Start Guide

## What You Just Got

The **killer feature** that makes your platform unstoppable: a self-improving creative system that partners rely on.

## Test It Right Now (5 Minutes)

### Step 1: Seed Test Data

Run this SQL in your Supabase SQL Editor:

```bash
# Copy the seed file content and run it
cat SEED_WEEKLY_WINNERS_TEST_DATA.sql
```

This creates:
- 5 sample creatives (3 winners, 2 testing)
- ~1 week of realistic event data (impressions, clicks, purchases)
- Calculates the weekly winners automatically

### Step 2: View The Winners Feed

**As a Partner:**
1. Navigate to `/partner/winners`
2. See the top 3-4 performing creatives
3. Click "Copy Headline" or "Copy Complete Ad"
4. See recommended budgets ($75/day, $50/day, etc.)
5. Read targeting notes ("Hot! Scale immediately")

**As Admin:**
1. Navigate to `/admin/creatives`
2. See all 5 creatives with lifetime stats
3. Try creating a new creative
4. Approve/disable creatives
5. Click "Calculate Winners" to refresh the leaderboard

### Step 3: Test Event Tracking

Add this to any landing page component:

```typescript
import { trackCreativeEvent, getCreativeIdFromUrl } from '@/lib/creativeTracking';

// Track impression when page loads
useEffect(() => {
  const creative_id = getCreativeIdFromUrl();
  if (creative_id) {
    trackCreativeEvent({ creative_id, event_type: "impression" });
  }
}, []);
```

Then visit: `/your-page?creative_id=YOUR_CREATIVE_UUID`

Check the database:
```sql
SELECT * FROM creative_events ORDER BY created_at DESC LIMIT 10;
```

## Production Setup

### 1. Enable Weekly Auto-Calculation

Set up a cron job (runs every Monday at 6 AM):

```sql
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

### 2. Add Tracking to Checkout Flow

**Checkout page load:**
```typescript
useEffect(() => {
  const creative_id = getCreativeIdFromUrl();
  if (creative_id) {
    trackCreativeEvent({ creative_id, event_type: "checkout_started" });
  }
}, []);
```

**Stripe webhook (order confirmed):**
```typescript
// In your stripe webhook handler
await trackCreativeEvent({
  creative_id: metadata.creative_id,
  event_type: "purchase",
  revenue_cents: amount_total,
  profile_id: customer_id,
});
```

### 3. Add Navigation Links

**Partner Dashboard:**
```tsx
<a href="/partner/winners">Weekly Winners</a>
```

**Admin Dashboard:**
```tsx
<a href="/admin/creatives">Manage Creatives</a>
```

## How Partners Use It

### Week 1: Partner Jane joins
- Views winners feed
- Copies #1 winner ad copy
- Sets budget to $50/day (recommended)
- Follows targeting notes ("Test broad audiences")
- Gets 3 sales first week

### Week 2: System learns
- Jane's sales tracked as events
- Creative #1 stays at top
- New winner emerges (#4 beats #3)
- Jane copies new winner
- Gets 5 sales this week

### Week 3: Network effect kicks in
- 10 partners now using winner #1
- More data = better recommendations
- New creative tested (#6)
- Winner #1 budget recommendation increases to $75/day
- Everyone wins

## The Moat

Every week:
1. More partners test creatives
2. More data collected
3. Better winners identified
4. Partners get better results
5. More partners join

**Competitors can't replicate this feedback loop.**

## Metrics To Watch

### Partner Success Metrics
- % of partners using winners feed (target: 80%+)
- Sales increase after using winners (target: 2-3x)
- Retention rate of winners feed users (target: 90%+)

### System Health Metrics
- Events tracked per week (target: 10,000+)
- Creatives with 100+ impressions (target: 20+)
- Weekly winner calculation success rate (target: 100%)

### Business Metrics
- Revenue per winning creative (track monthly)
- Partner ROI using winners vs. not (A/B test)
- Time to first sale (winners users vs. others)

## Troubleshooting

**No winners showing:**
```sql
-- Check if calculation ran
SELECT * FROM weekly_creative_winners ORDER BY created_at DESC LIMIT 1;

-- Force recalculation
SELECT calculate_weekly_winners('storylab_kids', 'kids');
```

**Events not tracking:**
```typescript
// Check browser console for errors
// Verify creative_id in URL
console.log(getCreativeIdFromUrl());
```

**Performance slow:**
```sql
-- Check if indexes exist
SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'public' AND tablename LIKE 'creative%';
```

## Next Steps

1. **Seed test data** (run SQL file)
2. **View winners feed** (`/partner/winners`)
3. **Test admin panel** (`/admin/creatives`)
4. **Enable cron job** (auto weekly calculation)
5. **Add tracking to checkout** (capture purchase events)
6. **Monitor metrics** (partner usage + system health)

## Support

- Documentation: `WEEKLY_WINNERS_FEED_COMPLETE.md`
- Seed data: `SEED_WEEKLY_WINNERS_TEST_DATA.sql`
- Edge functions: Already deployed
- Routes: Already configured

**Everything is ready. Just seed the data and test!**

---

*This is the feature that makes partners successful and the network effect unstoppable.*
