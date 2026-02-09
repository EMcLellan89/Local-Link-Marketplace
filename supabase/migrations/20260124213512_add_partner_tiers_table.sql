/*
  # Add Partner Tiers Table

  1. New Tables
    - `partner_tiers` - Defines partner tier levels with commission rates

  2. Initial Data
    - Starter (10% commission, $218/month)
    - Pro (15% commission, $658/month)
    - Enterprise (20% commission, $1798/month)
*/

-- Partner tiers
create table if not exists public.partner_tiers (
  key text primary key,
  name text not null,
  monthly_cost_usd int not null,
  commission_rate_bps int not null
);

comment on table public.partner_tiers is 'Partner tier definitions with commission rates (bps = basis points, 1000 = 10%)';

-- Seed tier data
insert into public.partner_tiers (key, name, monthly_cost_usd, commission_rate_bps)
values
('starter','Starter Partner',218,1000),
('pro','Pro Partner',658,1500),
('enterprise','Enterprise Partner',1798,2000)
on conflict (key) do update set
  name = excluded.name,
  monthly_cost_usd = excluded.monthly_cost_usd,
  commission_rate_bps = excluded.commission_rate_bps;
