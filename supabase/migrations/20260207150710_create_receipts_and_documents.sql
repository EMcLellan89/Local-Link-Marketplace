/*
  # Financial Engine - Receipts & Documents

  1. Receipt Management
    - `receipts` - Uploaded receipt files with extraction
    - Links to transactions for matching
    
  2. Security
    - RLS policies for merchant access
*/

-- Receipts
create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  file_path text not null,
  status text not null default 'uploaded' check (status in ('uploaded','parsing','parsed','linked','failed')),
  extracted jsonb default '{}'::jsonb,
  linked_transaction_id uuid references transactions(id) on delete set null,
  created_at timestamptz default now()
);

alter table receipts enable row level security;

-- RLS policies
create policy "members can select receipts"
on receipts for select
using (is_merchant_member(merchant_id));

create policy "members can insert receipts"
on receipts for insert
with check (is_merchant_member(merchant_id));

create policy "members can update receipts"
on receipts for update
using (is_merchant_member(merchant_id));

-- Indexes
create index if not exists receipts_merchant_idx on receipts(merchant_id);
create index if not exists receipts_linked_tx_idx on receipts(linked_transaction_id);
create index if not exists receipts_status_idx on receipts(merchant_id, status);
