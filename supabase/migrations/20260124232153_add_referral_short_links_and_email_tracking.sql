/*
  # Add Referral Short Links and Email Tracking

  1. New Tables
    - `referral_short_links`
      - `id` (uuid, primary key)
      - `merchant_id` (uuid, foreign key to profiles)
      - `destination_url` (text, the full referral URL)
      - `short_code` (text, unique 6-char code)
      - `click_count` (int, tracks clicks)
      - `created_at` (timestamptz)

  2. Updates to Existing Tables
    - Add `referral_link_email_sent_at` to track when referral email was sent
    - Add `referral_link_sms_sent_at` to track when referral SMS was sent

  3. Security
    - Enable RLS on `referral_short_links` table
    - Add policies for authenticated access
    - Add indexes for performance

  4. Functions
    - `get_or_create_short_link` - Idempotent function to create or retrieve short links
*/

-- Create short links table
create table if not exists public.referral_short_links (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  destination_url text not null,
  short_code text not null,
  click_count int not null default 0,
  created_at timestamptz not null default now(),
  unique(merchant_id, destination_url),
  unique(short_code)
);

-- Add indexes
create index if not exists idx_referral_short_links_merchant on public.referral_short_links(merchant_id);
create index if not exists idx_referral_short_links_short_code on public.referral_short_links(short_code);
create index if not exists idx_referral_short_links_dest on public.referral_short_links(destination_url);

-- Enable RLS
alter table public.referral_short_links enable row level security;

-- RLS Policies for referral_short_links
create policy "Merchants can view own short links"
  on public.referral_short_links
  for select
  to authenticated
  using (merchant_id = auth.uid());

create policy "Merchants can create own short links"
  on public.referral_short_links
  for insert
  to authenticated
  with check (merchant_id = auth.uid());

create policy "Public can read short links for redirect"
  on public.referral_short_links
  for select
  to anon
  using (true);

-- Add tracking columns to profiles
alter table public.profiles
add column if not exists referral_link_email_sent_at timestamptz,
add column if not exists referral_link_sms_sent_at timestamptz;

-- Create function to get or create short link
create or replace function public.get_or_create_short_link(
  p_merchant_id uuid,
  p_destination_url text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_short_code text;
  v_attempts int := 0;
  v_max_attempts int := 12;
begin
  -- Check if short link already exists for this destination
  select short_code into v_short_code
  from public.referral_short_links
  where merchant_id = p_merchant_id
    and destination_url = p_destination_url
  limit 1;

  if v_short_code is not null then
    return v_short_code;
  end if;

  -- Generate new short code
  while v_attempts < v_max_attempts loop
    v_short_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));

    begin
      insert into public.referral_short_links (merchant_id, destination_url, short_code)
      values (p_merchant_id, p_destination_url, v_short_code)
      on conflict (short_code) do nothing
      returning short_code into v_short_code;

      if v_short_code is not null then
        return v_short_code;
      end if;
    exception when others then
      -- Continue to next attempt
      null;
    end;

    v_attempts := v_attempts + 1;
  end loop;

  raise exception 'Failed to generate unique short code after % attempts', v_max_attempts;
end;
$$;