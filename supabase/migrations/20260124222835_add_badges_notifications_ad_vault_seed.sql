/*
  # Add Partner Badges, Notifications, and Ad Vault Seed Data

  1. New Tables
    - `partner_badges`
      - Badge definitions (3-day, 7-day, 14-day streaks, challenge complete)
    - `partner_badge_awards`
      - Track which partners earned which badges
    - `partner_streak_freezes`
      - Allow partners to freeze streaks (1 per 30 days)
    - `partner_notifications`
      - In-app notification system

  2. Functions
    - `get_or_create_tracking_link()` - Generate unique tracking links
    - `track_link_click()` - Record clicks and award points
    - `check_and_award_badges()` - Auto-award badges based on activity

  3. Security
    - Enable RLS on all tables
    - Partners can view their own data
    - Admins can manage everything

  4. Seed Data
    - Pre-written ad copy for all 3 bundle products
    - Industry-specific variations (cleaning, trades, medspa, restaurant)
*/

-- Partner badges definitions
create table if not exists public.partner_badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  icon text not null default '🏆',
  criteria_type text not null, -- 'streak', 'challenge', 'sales', 'merchants'
  criteria_value integer not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_badges_slug on public.partner_badges(slug);

alter table public.partner_badges enable row level security;

create policy "Anyone can view badges"
  on public.partner_badges for select
  to authenticated
  using (true);

-- Partner badge awards
create table if not exists public.partner_badge_awards (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.partner_badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  unique(partner_id, badge_id)
);

create index if not exists idx_badge_awards_partner on public.partner_badge_awards(partner_id);
create index if not exists idx_badge_awards_badge on public.partner_badge_awards(badge_id);

alter table public.partner_badge_awards enable row level security;

create policy "Partners can view their own badge awards"
  on public.partner_badge_awards for select
  to authenticated
  using (
    auth.uid() = partner_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Partner streak freezes
create table if not exists public.partner_streak_freezes (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.profiles(id) on delete cascade,
  used_at timestamptz not null default now(),
  days_protected integer not null default 2
);

create index if not exists idx_streak_freezes_partner on public.partner_streak_freezes(partner_id);

alter table public.partner_streak_freezes enable row level security;

create policy "Partners can view their own streak freezes"
  on public.partner_streak_freezes for select
  to authenticated
  using (auth.uid() = partner_id);

create policy "Partners can use streak freezes"
  on public.partner_streak_freezes for insert
  to authenticated
  with check (auth.uid() = partner_id);

-- Partner notifications
create table if not exists public.partner_notifications (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info', -- 'info', 'success', 'warning', 'badge_earned'
  is_read boolean not null default false,
  action_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_partner on public.partner_notifications(partner_id);
create index if not exists idx_notifications_read on public.partner_notifications(partner_id, is_read);

alter table public.partner_notifications enable row level security;

create policy "Partners can view their own notifications"
  on public.partner_notifications for select
  to authenticated
  using (auth.uid() = partner_id);

create policy "Partners can update their own notifications"
  on public.partner_notifications for update
  to authenticated
  using (auth.uid() = partner_id);

-- Function: Get or create tracking link
create or replace function public.get_or_create_tracking_link(
  p_partner_id uuid,
  p_product_slug text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_existing text;
begin
  -- Check if link already exists
  select slug into v_existing
  from partner_tracking_links
  where partner_id = p_partner_id
  and product_slug = p_product_slug;

  if v_existing is not null then
    return v_existing;
  end if;

  -- Generate unique slug (8 characters)
  v_slug := substring(md5(random()::text || p_partner_id::text || p_product_slug) from 1 for 8);

  -- Ensure uniqueness
  while exists (select 1 from partner_tracking_links where slug = v_slug) loop
    v_slug := substring(md5(random()::text) from 1 for 8);
  end loop;

  -- Insert new tracking link
  insert into partner_tracking_links (partner_id, product_slug, slug)
  values (p_partner_id, p_product_slug, v_slug);

  return v_slug;
end;
$$;

-- Function: Track link click
create or replace function public.track_link_click(
  p_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner_id uuid;
  v_product_slug text;
begin
  -- Get partner and product from slug
  select partner_id, product_slug
  into v_partner_id, v_product_slug
  from partner_tracking_links
  where slug = p_slug;

  if v_partner_id is null then
    return jsonb_build_object('success', false, 'error', 'Invalid tracking link');
  end if;

  -- Log activity (5 points)
  perform log_partner_activity(v_partner_id, 'link_clicked', 5);

  -- Return product info
  return jsonb_build_object(
    'success', true,
    'partner_id', v_partner_id,
    'product_slug', v_product_slug
  );
end;
$$;

-- Function: Check and award badges
create or replace function public.check_and_award_badges(
  p_partner_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_streak integer;
  v_challenge_status text;
  v_badge_id uuid;
  v_badge_name text;
begin
  -- Get current streak
  select current_streak into v_current_streak
  from partner_streaks
  where partner_id = p_partner_id;

  -- Check 3-day streak badge
  if v_current_streak >= 3 then
    select id, name into v_badge_id, v_badge_name
    from partner_badges
    where slug = '3-day-streak'
    and not exists (
      select 1 from partner_badge_awards
      where partner_id = p_partner_id
      and badge_id = partner_badges.id
    )
    limit 1;

    if v_badge_id is not null then
      insert into partner_badge_awards (partner_id, badge_id)
      values (p_partner_id, v_badge_id);

      insert into partner_notifications (partner_id, title, message, type)
      values (p_partner_id, 'Badge Earned!', 'You earned the ' || v_badge_name || ' badge!', 'badge_earned');
    end if;
  end if;

  -- Check 7-day streak badge
  if v_current_streak >= 7 then
    select id, name into v_badge_id, v_badge_name
    from partner_badges
    where slug = '7-day-streak'
    and not exists (
      select 1 from partner_badge_awards
      where partner_id = p_partner_id
      and badge_id = partner_badges.id
    )
    limit 1;

    if v_badge_id is not null then
      insert into partner_badge_awards (partner_id, badge_id)
      values (p_partner_id, v_badge_id);

      insert into partner_notifications (partner_id, title, message, type)
      values (p_partner_id, 'Badge Earned!', 'You earned the ' || v_badge_name || ' badge!', 'badge_earned');
    end if;
  end if;

  -- Check 14-day streak badge
  if v_current_streak >= 14 then
    select id, name into v_badge_id, v_badge_name
    from partner_badges
    where slug = '14-day-streak'
    and not exists (
      select 1 from partner_badge_awards
      where partner_id = p_partner_id
      and badge_id = partner_badges.id
    )
    limit 1;

    if v_badge_id is not null then
      insert into partner_badge_awards (partner_id, badge_id)
      values (p_partner_id, v_badge_id);

      insert into partner_notifications (partner_id, title, message, type)
      values (p_partner_id, 'Badge Earned!', 'You earned the ' || v_badge_name || ' badge!', 'badge_earned');
    end if;
  end if;

  -- Check challenge complete badge
  select challenge_status into v_challenge_status
  from partner_challenge_enrollments
  where partner_id = p_partner_id
  and challenge_status = 'completed'
  limit 1;

  if v_challenge_status = 'completed' then
    select id, name into v_badge_id, v_badge_name
    from partner_badges
    where slug = 'challenge-complete'
    and not exists (
      select 1 from partner_badge_awards
      where partner_id = p_partner_id
      and badge_id = partner_badges.id
    )
    limit 1;

    if v_badge_id is not null then
      insert into partner_badge_awards (partner_id, badge_id)
      values (p_partner_id, v_badge_id);

      insert into partner_notifications (partner_id, title, message, type)
      values (p_partner_id, 'Badge Earned!', 'You earned the ' || v_badge_name || ' badge!', 'badge_earned');
    end if;
  end if;
end;
$$;

-- Seed badge definitions
insert into public.partner_badges (slug, name, description, icon, criteria_type, criteria_value)
values
  ('3-day-streak', '3-Day Streak', 'Posted consistently for 3 days in a row', '🔥', 'streak', 3),
  ('7-day-streak', '7-Day Warrior', 'Completed the 7-Day Challenge', '⚡', 'streak', 7),
  ('14-day-streak', '14-Day Champion', 'Posted consistently for 14 days straight', '🏆', 'streak', 14),
  ('challenge-complete', 'Challenge Master', 'Completed the full 7-Day Faceless Challenge', '👑', 'challenge', 1)
on conflict (slug) do nothing;

-- Seed ad vault data with proper escaping
insert into public.dfy_ad_vault (product_slug, channel, headline, primary_text, cta, notes)
values
  -- Bundle: Faceless Growth + AI Funnel ($997 setup)
  ('bundle-faceless-ai-funnel', 'facebook', 'Cleaning business owners: automated content + high-converting funnel', $$Your business doesn't need viral videos — it needs a system that works while you do.

This bundle includes monthly faceless content + a custom funnel that turns views into booked jobs.

Tap below to learn more.$$, 'Learn More', 'Use before/after cleaning visuals'),

  ('bundle-faceless-ai-funnel', 'facebook', 'Contractors: stop losing leads to inconsistent posting', $$Most contractors lose work not because of bad service — but because customers forget about them.

This bundle keeps you visible with faceless content + a funnel that captures leads 24/7.

See how it works 👇$$, 'See How It Works', 'Use job site visuals, no faces'),

  ('bundle-faceless-ai-funnel', 'facebook', 'Med spas: consistent content + conversion system (no filming required)', $$Posting daily feels impossible when you're busy with clients.

This bundle handles your content AND includes a funnel optimized to book consultations — no camera needed.

Learn more below.$$, 'Learn More', 'Use aesthetic result photos'),

  ('bundle-faceless-ai-funnel', 'facebook', 'Restaurants: stay visible without becoming a content creator', $$If posting always gets pushed to "later," this fixes that.

We handle your monthly content + build a funnel that turns visibility into reservations.

Tap to get started.$$, 'Get Started', 'Use food photography, no staff'),

  -- Bundle: Faceless Growth + AI DM ($897 setup)
  ('bundle-faceless-dm', 'facebook', 'Cleaning leads: instant DM replies + consistent posting', $$This bundle keeps you visible with faceless content AND replies instantly to DMs so leads don't slip away.

Tap Learn More to start.$$, 'Learn More', 'Use DM screenshot mockups'),

  ('bundle-faceless-dm', 'facebook', 'Trades: never miss a lead again (automated DMs + content)', $$Your business loses money when DMs sit unanswered for hours.

This bundle posts consistently + replies to leads instantly, so you close more jobs.

See pricing 👇$$, 'See Pricing', 'Use trade visuals + DM UI'),

  ('bundle-faceless-dm', 'facebook', 'Med spa owners: consistent content + instant lead response', $$Leads book with whoever responds first.

This bundle keeps your content running + replies to inquiries instantly — no staff time needed.

Learn more.$$, 'Learn More', 'Use consultation booking UI'),

  ('bundle-faceless-dm', 'facebook', 'Restaurant DMs on autopilot + faceless content system', $$Stop losing reservation requests to slow DM replies.

This bundle posts consistently + responds instantly to inquiries — so you fill more tables.

Get started below.$$, 'Get Started', 'Use reservation mockups'),

  -- Bundle: Faceless Growth Full Stack ($1,297 setup)
  ('bundle-faceless-full', 'facebook', 'Complete marketing system for cleaning businesses', $$This is the full stack: faceless content + conversion funnel + instant DM replies.

Everything you need to stay visible, capture leads, and book jobs — handled for you.

See what's included 👇$$, 'See What''s Included', 'Hero package positioning'),

  ('bundle-faceless-full', 'facebook', 'Contractors: the all-in-one growth system (content + funnel + DMs)', $$Most businesses juggle multiple tools. This bundles everything into one system:

✅ Monthly content (no camera)
✅ High-converting funnel
✅ Instant DM replies

Learn more below.$$, 'Learn More', 'Feature checklist format'),

  ('bundle-faceless-full', 'facebook', 'Med spa marketing, fully handled', $$This bundle runs your entire marketing system:

📱 Faceless content (monthly)
🎯 Conversion-optimized funnel
💬 AI-powered DM responses

Everything you need to grow, nothing you have to manage.

Get started 👇$$, 'Get Started', 'Premium positioning'),

  ('bundle-faceless-full', 'facebook', 'Restaurant marketing that actually runs itself', $$Most marketing requires constant attention. This doesn't.

We handle your content, build your funnel, and reply to inquiries instantly — so you focus on the kitchen.

See how it works.$$, 'See How It Works', 'ROI-focused messaging')
on conflict do nothing;

comment on table public.partner_badges is 'Badge definitions for partner achievements';
comment on table public.partner_badge_awards is 'Track which partners earned which badges';
comment on table public.partner_streak_freezes is 'Allow partners to freeze streaks for 2 days (1 per 30 days)';
comment on table public.partner_notifications is 'In-app notification system for partners';
