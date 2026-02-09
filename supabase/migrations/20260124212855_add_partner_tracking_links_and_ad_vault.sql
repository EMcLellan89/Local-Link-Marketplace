/*
  # Add Partner Tracking Links and Ad Vault Tables

  1. New Tables
    - `partner_tracking_links`
      - `id` (uuid, primary key)
      - `partner_id` (uuid, references profiles)
      - `product_slug` (text, references dfy_products)
      - `slug` (text, unique - short token used in ?ref=)
      - `created_at` (timestamptz)
      - Unique constraint on (partner_id, product_slug)
    
    - `dfy_ad_vault`
      - `id` (uuid, primary key)
      - `product_slug` (text, references dfy_products)
      - `channel` (text, default 'facebook')
      - `headline` (text)
      - `primary_text` (text)
      - `cta` (text, default 'Learn More')
      - `notes` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Partners can read their own tracking links
    - Partners can read ad vault content
    - Admins can manage everything

  3. Indexes
    - Foreign key indexes for performance
    - Lookup indexes for common queries
*/

-- Partner tracking links table
create table if not exists public.partner_tracking_links (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.profiles(id) on delete cascade,
  product_slug text not null references public.dfy_products(slug) on delete cascade,
  slug text unique not null,
  created_at timestamptz not null default now(),
  unique(partner_id, product_slug)
);

create index if not exists idx_partner_links_partner on public.partner_tracking_links(partner_id);
create index if not exists idx_partner_links_product on public.partner_tracking_links(product_slug);
create index if not exists idx_partner_links_slug on public.partner_tracking_links(slug);

alter table public.partner_tracking_links enable row level security;

create policy "Partners can view their own tracking links"
  on public.partner_tracking_links for select
  to authenticated
  using (
    auth.uid() = partner_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Partners can create their own tracking links"
  on public.partner_tracking_links for insert
  to authenticated
  with check (auth.uid() = partner_id);

create policy "Admins can manage all tracking links"
  on public.partner_tracking_links for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- DFY Ad Vault table
create table if not exists public.dfy_ad_vault (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null references public.dfy_products(slug) on delete cascade,
  channel text not null default 'facebook',
  headline text not null,
  primary_text text not null,
  cta text not null default 'Learn More',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ad_vault_product on public.dfy_ad_vault(product_slug);

alter table public.dfy_ad_vault enable row level security;

create policy "Partners can view ad vault content"
  on public.dfy_ad_vault for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('partner', 'admin')
    )
  );

create policy "Admins can manage ad vault content"
  on public.dfy_ad_vault for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

comment on table public.partner_tracking_links is 'Tracking links for partners to promote DFY products';
comment on table public.dfy_ad_vault is 'Pre-written ad copy for partners to use when promoting DFY products';
