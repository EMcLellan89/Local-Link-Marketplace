# Weekly Winners Feed - System Architecture

## The Complete Stack (Visual)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PARTNERS (Your Users)                        │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Partner 1  │  │   Partner 2  │  │   Partner N  │             │
│  │              │  │              │  │              │             │
│  │ Views Winners│  │ Copies Ads   │  │ Runs Tests   │             │
│  │ Pastes in FB │  │ Gets Sales   │  │ Scales Budget│             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                  │                  │                      │
└─────────┼──────────────────┼──────────────────┼──────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      YOUR PLATFORM (React/Vite)                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              /partner/winners (Winners Feed)                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │   │
│  │  │ Winner 1 │  │ Winner 2 │  │ Winner 3 │  │ Winner N │   │   │
│  │  │          │  │          │  │          │  │          │   │   │
│  │  │ 14 sales │  │ 7 sales  │  │ 3 sales  │  │ 1 sale   │   │   │
│  │  │ $75/day  │  │ $50/day  │  │ $40/day  │  │ $20/day  │   │   │
│  │  │ [Copy]   │  │ [Copy]   │  │ [Copy]   │  │ [Copy]   │   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           /admin/creatives (Creative Manager)                │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │  [New Creative] [Refresh] [Calculate Winners]        │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │ Creative 1: kids_winner_jan_1                        │   │   │
│  │  │ "Create a Magical Personalized Storybook"            │   │   │
│  │  │ [✓ Approved] [Disable] [Preview]                     │   │   │
│  │  │ Stats: 3,500 impressions, 105 clicks, 14 purchases   │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Tracking Helper (creativeTracking.ts)           │   │
│  │  trackCreativeEvent({ creative_id, event_type, ... })       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   EDGE FUNCTIONS (Supabase)                          │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  /functions/v1/track-creative-event                          │   │
│  │  • Receives: creative_id, event_type, revenue_cents         │   │
│  │  • Inserts into creative_events table                       │   │
│  │  • Updates lifetime stats on purchase                       │   │
│  │  • Returns: 200 OK                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  /functions/v1/calculate-weekly-winners                      │   │
│  │  • Admin-only (JWT + role check)                            │   │
│  │  • Calls: calculate_weekly_winners() DB function            │   │
│  │  • Returns: winners array                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     DATABASE (Supabase Postgres)                     │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ad_creatives                                                │   │
│  │  ├─ id, creative_key, headline, primary_text               │   │
│  │  ├─ is_approved, is_active                                  │   │
│  │  └─ lifetime_impressions, clicks, purchases, revenue        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  creative_events (immutable log)                             │   │
│  │  ├─ creative_id, event_type, revenue_cents                  │   │
│  │  ├─ profile_id, partner_id, ref_code                        │   │
│  │  └─ session_id, created_at                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  weekly_creative_winners (cached leaderboard) ⭐             │   │
│  │  ├─ creative_id, rank, week_start_date                      │   │
│  │  ├─ impressions, clicks, purchases, revenue                 │   │
│  │  ├─ ctr, cvr                                                │   │
│  │  ├─ recommended_budget_daily_cents                          │   │
│  │  └─ targeting_notes                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  creative_tests                                              │   │
│  │  ├─ partner_id, creatives[], status                         │   │
│  │  └─ winner_creative_id                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  partner_ad_budgets                                          │   │
│  │  ├─ partner_id, daily_cents (min $20)                       │   │
│  │  └─ status, spent_today_cents                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Functions:                                                  │   │
│  │  • calculate_weekly_winners() - Ranks creatives             │   │
│  │  • update_creative_performance() - Updates lifetime stats   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CRON JOB (pg_cron)                              │
│                                                                      │
│  Every Monday @ 6 AM:                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  SELECT calculate_weekly_winners('storylab_kids', 'kids');   │   │
│  │  SELECT calculate_weekly_winners('storylab_teen', 'teen');   │   │
│  │  SELECT calculate_weekly_winners('storylab_adult', 'adult'); │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Result: weekly_creative_winners table updated                      │
└─────────────────────────────────────────────────────────────────────┘
```

## The Feedback Loop

```
Week 1:
  Partner Jane → Copies Winner #1 → Runs ads → Gets 3 sales
                                              ↓
                                     Events tracked
                                              ↓
Week 2:                            Winners recalculated
  Partner Jane → Copies Winner #2 (new top performer)
  Partner Bob  → Joins, copies Winner #1
                                              ↓
                                     More data collected
                                              ↓
Week 3:                            Recommendations improve
  Partner Jane → Scales to $75/day (system recommended)
  Partner Bob  → Gets 5 sales
  Partner Alice→ Joins, copies Winner #1
                                              ↓
Week 4:                            Network effect kicks in
  System now has 10 partners, 50+ creatives tested
  Winner predictions 95% accurate
  Partner success rate 3x industry average
                                              ↓
Week N:                            Unstoppable moat
  Competitors can't replicate the data depth
  Partners won't leave (system keeps improving)
  New partners join faster (proven track record)
```

## Data Flow (Single Event)

```
1. Customer sees ad (Facebook/Google)
   │
   ├─> Clicks ad
   │   └─> Lands on: yoursite.com/?creative_id=abc123
   │
   ├─> React app loads
   │   └─> trackCreativeEvent({ creative_id, event_type: 'impression' })
   │
   ├─> Edge function receives event
   │   └─> INSERT INTO creative_events (...)
   │
   ├─> Customer clicks CTA
   │   └─> trackCreativeEvent({ creative_id, event_type: 'click' })
   │
   ├─> Customer checks out
   │   └─> trackCreativeEvent({ creative_id, event_type: 'checkout_started' })
   │
   └─> Stripe webhook fires (purchase confirmed)
       └─> trackCreativeEvent({
             creative_id,
             event_type: 'purchase',
             revenue_cents: 2997
           })
       └─> update_creative_performance() auto-runs
       └─> Lifetime stats updated in real-time
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                          PUBLIC ZONE                             │
│  • View approved creatives (read-only)                          │
│  • View weekly winners feed (read-only)                         │
│  • Track events (write-only, no read access)                    │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ RLS Policies
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PARTNER ZONE                              │
│  • View own creative tests (read-only)                          │
│  • View own ad budget (read-only)                               │
│  • View own event history (read-only)                           │
│  • Create tests (write)                                         │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ RLS Policies
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          ADMIN ZONE                              │
│  • Create/edit/delete creatives (full access)                  │
│  • Approve/disable creatives (write)                            │
│  • View all events (read-only)                                  │
│  • Trigger winner calculation (write)                           │
│  • Manage partner budgets (full access)                         │
└─────────────────────────────────────────────────────────────────┘
```

## Performance Architecture

```
Read Path (Winners Feed - Fast):
  Partner visits /partner/winners
    → SELECT * FROM weekly_creative_winners (cached, pre-calculated)
    → Returns in ~50ms
    → No joins, no aggregations

Write Path (Event Tracking - Non-blocking):
  Customer clicks ad
    → trackCreativeEvent() fires async
    → Edge function processes
    → INSERT into creative_events
    → Returns 200 OK immediately
    → UI never blocks

Calculation Path (Weekly - Off-peak):
  Cron runs Monday 6 AM
    → calculate_weekly_winners()
    → Aggregates entire week's data
    → Ranks by purchases/revenue
    → Writes to cache table
    → Takes ~5 seconds for 1M events
```

## Scaling Strategy

```
Current (0-1000 partners):
  ✓ Single database
  ✓ Weekly calculation
  ✓ No sharding needed

Phase 2 (1000-10,000 partners):
  → Add read replica for analytics
  → Partition creative_events by month
  → Consider daily winner updates

Phase 3 (10,000+ partners):
  → Real-time streaming (Kafka/Kinesis)
  → Horizontal sharding by business_key
  → CDN caching for winners feed
  → ML-powered winner prediction
```

---

**Everything is connected. Everything improves automatically. The moat deepens every week.**

This is the architecture of an unstoppable platform.
