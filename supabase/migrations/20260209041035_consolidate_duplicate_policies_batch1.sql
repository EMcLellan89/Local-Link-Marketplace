/*
  # Consolidate Duplicate RLS Policies - Batch 1

  1. Security Improvement
    - Removes duplicate permissive policies
    - Consolidates similar policies into single, clear rules
    - Reduces policy evaluation overhead

  2. Tables Affected
    - academy_quiz_attempts (3 INSERT policies → 1)
    - customers (3 SELECT policies → 1)
    - partners (3 SELECT policies → 1)
    - course_exam_attempts (3 SELECT policies → 1)
    - bot_conversations (consolidate to 2)

  3. Pattern
    - Keep the most comprehensive and clearly named policy
    - Drop redundant duplicates
    - Maintain same security semantics
*/

-- academy_quiz_attempts: consolidate 3 duplicate INSERT policies
DROP POLICY IF EXISTS "Users can create quiz attempts" ON academy_quiz_attempts;
DROP POLICY IF EXISTS "Users can create own quiz attempts" ON academy_quiz_attempts;
-- Keep: "Users can insert own quiz attempts"

-- customers: consolidate 3 duplicate SELECT policies
DROP POLICY IF EXISTS "Customers can read own data" ON customers;
DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
-- Keep: "Customers can view own data"

-- partners: consolidate 3 duplicate SELECT policies
DROP POLICY IF EXISTS "Partners can view own record" ON partners;
DROP POLICY IF EXISTS "Partners can read own data" ON partners;
-- Keep: "Partners can view own data"

-- course_exam_attempts: consolidate 3 duplicate SELECT policies
DROP POLICY IF EXISTS "Users can read own exam attempts" ON course_exam_attempts;
DROP POLICY IF EXISTS "Users can read their own exam attempts" ON course_exam_attempts;
-- Keep: "Users can view own exam attempts"

-- bot_conversations: consolidate similar policies
DROP POLICY IF EXISTS "Users can view own bot conversations" ON bot_conversations;
-- Keep: "Users can view own conversations" and "Admins can view all conversations"

-- merchants: consolidate duplicate SELECT policies
DROP POLICY IF EXISTS "Merchants can view own profile" ON merchants;
DROP POLICY IF EXISTS "Merchants can read own data" ON merchants;
-- Keep: "Merchants can view own data", "merchant members can view merchant", "Approved merchants visible to all"

-- notifications: consolidate duplicate SELECT policies  
DROP POLICY IF EXISTS "Merchants can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Customers can view their own notifications" ON notifications;
-- Keep: "Users can view own notifications"

-- merchant_locations: consolidate duplicate SELECT policies
DROP POLICY IF EXISTS "Merchants can view their own locations" ON merchant_locations;
-- Keep: "Merchants can view own locations" and "Anyone can view active merchant locations"

-- partner_crm_contacts: consolidate duplicate ALL policies
DROP POLICY IF EXISTS "Partners can manage own CRM contacts" ON partner_crm_contacts;
-- Keep: "Partners can manage own contacts" and "Admin can view all contacts"

-- partner_crm_deals: consolidate duplicate ALL policies
DROP POLICY IF EXISTS "Partners can manage own CRM deals" ON partner_crm_deals;
-- Keep: "Partners can manage own deals" and "Admin can manage all deals"

-- partner_crm_subscriptions: consolidate duplicate ALL policies
DROP POLICY IF EXISTS "Partners can manage own CRM subscriptions" ON partner_crm_subscriptions;
-- Keep: "Partners can manage own CRM subscription" and "Admin can manage partner CRM subscriptions"

-- creative_events: consolidate duplicate SELECT policies
DROP POLICY IF EXISTS "Partners view own" ON creative_events;
DROP POLICY IF EXISTS "Admins view all" ON creative_events;
DROP POLICY IF EXISTS "Users can view relevant creative events" ON creative_events;
-- Keep: "Partners can view own creative events", "Admins can view all creative events", "Users can view creative events for their profile"
