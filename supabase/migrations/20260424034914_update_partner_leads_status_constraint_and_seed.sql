/*
  # Update partner_leads status constraint and seed demo leads + territories

  1. Drop old status check constraint on partner_leads
  2. Add new constraint matching UI statuses:
     prospect, contacted, interested, demo_scheduled, signed, lost
  3. Seed 12 realistic partner leads
  4. Seed 3 partner territories
*/

-- Update the status check constraint
ALTER TABLE partner_leads DROP CONSTRAINT IF EXISTS partner_leads_status_check;
ALTER TABLE partner_leads ADD CONSTRAINT partner_leads_status_check
  CHECK (status = ANY (ARRAY['prospect','contacted','interested','demo_scheduled','signed','lost','new','demo_booked','proposal_sent','closed_won','closed_lost']));

-- Seed partner leads
DO $$
DECLARE
  v_partner_id uuid;
BEGIN
  SELECT id INTO v_partner_id FROM partners ORDER BY created_at LIMIT 1;

  INSERT INTO partner_leads (id, partner_id, business_name, contact_name, name, email, phone, city, state, category, status, product_interest, estimated_value_cents, notes, last_contacted_at, created_at)
  VALUES
    (gen_random_uuid(), v_partner_id, 'Sunrise Bakery', 'Maria Santos', 'Maria Santos', 'maria@sunrisebakery.com', '(512) 555-3001', 'Austin', 'TX', 'Food & Beverage', 'signed', '1Hub CRM Pro', 9700, 'Signed Pro plan. Wants to add AI bots next month.', now() - interval '5 days', now() - interval '45 days'),
    (gen_random_uuid(), v_partner_id, 'Downtown Coffee Co', 'James Liu', 'James Liu', 'james@downtowncoffee.com', '(512) 555-3002', 'Austin', 'TX', 'Food & Beverage', 'interested', 'Loyalty + Deals', 4700, 'Wants to see loyalty rewards demo. Callback Friday.', now() - interval '3 days', now() - interval '38 days'),
    (gen_random_uuid(), v_partner_id, 'Elite Fitness Studio', 'Rachel Kim', 'Rachel Kim', 'rachel@elitefitness.com', '(512) 555-3003', 'Round Rock', 'TX', 'Fitness', 'demo_scheduled', 'AutoScale + AI Bots', 14700, 'Demo set for next Tuesday at 2pm. Very interested.', now() - interval '1 days', now() - interval '30 days'),
    (gen_random_uuid(), v_partner_id, 'ProSmile Dental', 'Dr. Alex Chen', 'Dr. Alex Chen', 'alex@prosmile.com', '(512) 555-3004', 'Cedar Park', 'TX', 'Dental', 'contacted', 'Enterprise Plan', 29700, 'Left voicemail. Sending email follow-up today.', now() - interval '7 days', now() - interval '25 days'),
    (gen_random_uuid(), v_partner_id, 'TruGreen Landscaping', 'Bob Martinez', 'Bob Martinez', 'bob@trugreen-atx.com', '(512) 555-3005', 'Austin', 'TX', 'Home Services', 'prospect', 'Starter Plan', 2700, 'Cold outreach. Needs follow up next week.', null, now() - interval '20 days'),
    (gen_random_uuid(), v_partner_id, 'Westlake Animal Clinic', 'Dr. Sara Park', 'Dr. Sara Park', 'sara@westlakevet.com', '(512) 555-3006', 'Austin', 'TX', 'Veterinary', 'signed', 'Pro Plan + Paws Course', 9700, 'Great fit! Uses platform daily. High engagement.', now() - interval '2 days', now() - interval '55 days'),
    (gen_random_uuid(), v_partner_id, 'SparkClean Services', 'Tony Ramos', 'Tony Ramos', 'tony@sparkclean.com', '(512) 555-3007', 'Pflugerville', 'TX', 'Home Services', 'lost', 'Starter Plan', 2700, 'Went with competitor. Price-sensitive. Check back in 6 months.', now() - interval '30 days', now() - interval '60 days'),
    (gen_random_uuid(), v_partner_id, 'Lakewood Medical Spa', 'Gina Williams', 'Gina Williams', 'gina@lakewoodmedspa.com', '(512) 555-3008', 'Austin', 'TX', 'Healthcare', 'interested', 'Enterprise + AI Suite', 29700, 'Very interested in AI receptionist. Has 2 locations.', now() - interval '4 days', now() - interval '15 days'),
    (gen_random_uuid(), v_partner_id, 'Texan Title Company', 'Harold Banks', 'Harold Banks', 'harold@texantitle.com', '(512) 555-3009', 'Round Rock', 'TX', 'Real Estate', 'prospect', '1Hub CRM Starter', 4700, 'Referral from Robert Martinez at Hill Country RE.', null, now() - interval '10 days'),
    (gen_random_uuid(), v_partner_id, 'Halo Beauty Bar', 'Keisha Thompson', 'Keisha Thompson', 'keisha@halobeauty.com', '(512) 555-3010', 'Austin', 'TX', 'Beauty & Personal Care', 'demo_scheduled', 'Pro Plan', 9700, 'Loved the demo. Sending contract Monday.', now() - interval '1 days', now() - interval '8 days'),
    (gen_random_uuid(), v_partner_id, 'Oak Hill Law Firm', 'Nathan Cross', 'Nathan Cross', 'nathan@oakhilllaw.com', '(512) 555-3011', 'Austin', 'TX', 'Legal', 'contacted', 'Pro Plan', 9700, 'Interested in client intake automation.', now() - interval '6 days', now() - interval '12 days'),
    (gen_random_uuid(), v_partner_id, 'Refresh Juice & Wellness', 'Amber Cole', 'Amber Cole', 'amber@refreshjuice.com', '(512) 555-3012', 'Cedar Park', 'TX', 'Food & Beverage', 'prospect', 'Starter Plan', 2700, 'New location opening in 60 days. Follow up then.', null, now() - interval '5 days');

  -- Seed partner territories
  INSERT INTO partner_territories (id, partner_id, city, state, county, status, exclusive, total_merchants, active_merchants, monthly_revenue, granted_at, created_at)
  VALUES
    (gen_random_uuid(), v_partner_id, 'Austin', 'TX', 'Travis County', 'active', true, 34, 28, 14200.00, now() - interval '150 days', now() - interval '150 days'),
    (gen_random_uuid(), v_partner_id, 'Round Rock', 'TX', 'Williamson County', 'active', false, 18, 14, 6800.00, now() - interval '120 days', now() - interval '120 days'),
    (gen_random_uuid(), v_partner_id, 'Cedar Park', 'TX', 'Williamson County', 'pending', true, 0, 0, 0.00, null, now() - interval '7 days');
END $$;
