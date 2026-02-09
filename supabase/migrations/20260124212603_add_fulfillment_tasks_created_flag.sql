/*
  # Add fulfillment tasks created flag

  1. Changes
    - Add `fulfillment_tasks_created` boolean column to `dfy_orders` table
    - Defaults to false
    - Used to ensure tasks are only auto-generated once per order

  2. Purpose
    - Prevents duplicate task creation on webhook retries
    - Tracks whether auto-fulfillment tasks have been generated
*/

alter table public.dfy_orders
add column if not exists fulfillment_tasks_created boolean not null default false;

comment on column public.dfy_orders.fulfillment_tasks_created is 'Flag indicating whether auto-fulfillment tasks have been created for this order';
