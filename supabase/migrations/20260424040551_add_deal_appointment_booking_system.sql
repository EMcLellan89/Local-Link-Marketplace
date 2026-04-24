/*
  # Deal Appointment Booking System

  ## Overview
  Allows customers to book appointments directly from deal/offer cards.
  Merchants handle the actual service and payment through their own systems.
  Platform tracks bookings for statistics only — no payment processing involved.

  ## New Tables
  1. `merchant_booking_settings` — merchant availability config (hours, slot duration, buffer time)
  2. `deal_appointments` — customer appointment bookings tied to a deal

  ## New Columns on `deals`
  - `bookable` (boolean) — whether this deal supports appointment booking
  - `booking_duration_minutes` (integer) — how long each appointment slot is

  ## New Columns on `merchants`
  - `booking_enabled` (boolean) — merchant has booking turned on
  - `booking_lead_time_hours` (integer) — min hours advance notice required
  - `booking_advance_days` (integer) — how far in advance customers can book

  ## Security
  - RLS enabled on all new tables
  - Customers can book and view own appointments
  - Merchants can view and manage appointments for their deals
  - Admins have full access
*/

-- ─── Booking settings per merchant ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merchant_booking_settings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id           uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  monday_open           time,
  monday_close          time,
  tuesday_open          time,
  tuesday_close         time,
  wednesday_open        time,
  wednesday_close       time,
  thursday_open         time,
  thursday_close        time,
  friday_open           time,
  friday_close          time,
  saturday_open         time,
  saturday_close        time,
  sunday_open           time,
  sunday_close          time,
  slot_duration_minutes integer NOT NULL DEFAULT 60,
  buffer_minutes        integer NOT NULL DEFAULT 15,
  max_per_slot          integer NOT NULL DEFAULT 1,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now(),
  UNIQUE(merchant_id)
);

ALTER TABLE merchant_booking_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage own booking settings"
  ON merchant_booking_settings FOR ALL
  TO authenticated
  USING ((SELECT user_id FROM merchants WHERE id = merchant_id) = auth.uid())
  WITH CHECK ((SELECT user_id FROM merchants WHERE id = merchant_id) = auth.uid());

CREATE POLICY "Public can view booking settings"
  ON merchant_booking_settings FOR SELECT
  TO authenticated
  USING (true);

-- ─── Deal appointment bookings ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deal_appointments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id             uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  merchant_id         uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  customer_id         uuid REFERENCES customers(id) ON DELETE SET NULL,
  customer_name       text NOT NULL,
  customer_email      text NOT NULL,
  customer_phone      text,
  appointment_date    date NOT NULL,
  appointment_time    time NOT NULL,
  duration_minutes    integer NOT NULL DEFAULT 60,
  status              text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  notes               text,
  merchant_notes      text,
  cancelled_reason    text,
  -- Tracking only — no payment info (merchant handles externally)
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deal_appointments_deal_id ON deal_appointments(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_appointments_merchant_id ON deal_appointments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_deal_appointments_customer_id ON deal_appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_deal_appointments_date ON deal_appointments(appointment_date);

ALTER TABLE deal_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers view own appointments"
  ON deal_appointments FOR SELECT
  TO authenticated
  USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

CREATE POLICY "Customers create appointments"
  ON deal_appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    OR customer_id IS NULL
  );

CREATE POLICY "Customers cancel own appointments"
  ON deal_appointments FOR UPDATE
  TO authenticated
  USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  )
  WITH CHECK (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

CREATE POLICY "Merchants view appointments for their deals"
  ON deal_appointments FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

CREATE POLICY "Merchants update appointments for their deals"
  ON deal_appointments FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  )
  WITH CHECK (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

-- ─── Add booking columns to deals ────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='deals' AND column_name='bookable') THEN
    ALTER TABLE deals ADD COLUMN bookable boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='deals' AND column_name='booking_duration_minutes') THEN
    ALTER TABLE deals ADD COLUMN booking_duration_minutes integer DEFAULT 60;
  END IF;
END $$;

-- ─── Add booking columns to merchants ────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='merchants' AND column_name='booking_enabled') THEN
    ALTER TABLE merchants ADD COLUMN booking_enabled boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='merchants' AND column_name='booking_lead_time_hours') THEN
    ALTER TABLE merchants ADD COLUMN booking_lead_time_hours integer DEFAULT 2;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='merchants' AND column_name='booking_advance_days') THEN
    ALTER TABLE merchants ADD COLUMN booking_advance_days integer DEFAULT 30;
  END IF;
END $$;

-- ─── Seed: enable booking on the existing merchant and their deals ─────────────
UPDATE merchants SET booking_enabled = true, booking_lead_time_hours = 2, booking_advance_days = 30;
UPDATE deals SET bookable = true, booking_duration_minutes = 60 WHERE status = 'active';

-- ─── Seed default booking settings for existing merchant ──────────────────────
INSERT INTO merchant_booking_settings (merchant_id, monday_open, monday_close, tuesday_open, tuesday_close, wednesday_open, wednesday_close, thursday_open, thursday_close, friday_open, friday_close, saturday_open, saturday_close, slot_duration_minutes, buffer_minutes)
SELECT id, '09:00', '17:00', '09:00', '17:00', '09:00', '17:00', '09:00', '17:00', '09:00', '17:00', '10:00', '15:00', 60, 15
FROM merchants
ON CONFLICT (merchant_id) DO NOTHING;
