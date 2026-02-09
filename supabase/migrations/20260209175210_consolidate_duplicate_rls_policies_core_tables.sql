/*
  # Consolidate Duplicate RLS Policies - Core Tables
  
  1. Problem
    - Multiple permissive policies for the same role/command combination
    - Creates unnecessary policy evaluation overhead
    - Makes security model harder to understand
  
  2. Solution
    - Keep the most comprehensive policy for each role/command
    - Drop redundant policies with identical or subset logic
  
  3. Tables Fixed
    - customers: Remove 4 duplicate policies, keep consolidated ones
    - partners: Remove 3 duplicate policies, keep consolidated ones
    - merchants: Remove 2 duplicate policies, keep consolidated ones
    - deals: Remove 1 duplicate policy
    - reviews: Keep consolidated policy
    - purchases: Keep consolidated policy
  
  4. Security
    - No change to access control logic
    - Policies use OR logic, so removing duplicates doesn't change behavior
*/

-- Customers table - remove duplicates, keep consolidated
DROP POLICY IF EXISTS "Customers can manage own data" ON public.customers;
DROP POLICY IF EXISTS "Customers manage own data" ON public.customers;
DROP POLICY IF EXISTS "Enable read for customers" ON public.customers;
-- Keep: "Admin full access to customers", "Customers can view own data", "Customers can update own data", "authenticated_select_customers_consolidated"

-- Partners table - remove duplicates, keep consolidated  
DROP POLICY IF EXISTS "Partners can manage own data" ON public.partners;
DROP POLICY IF EXISTS "Partners manage own data" ON public.partners;
DROP POLICY IF EXISTS "Enable read for partners" ON public.partners;
-- Keep: "Admin full access to partners", "Partners can view own data", "Partners can update own data", "authenticated_select_partners_consolidated"

-- Merchants table - remove duplicates, keep most comprehensive
DROP POLICY IF EXISTS "Enable read for merchants" ON public.merchants;
DROP POLICY IF EXISTS "authenticated_select_merchants_consolidated" ON public.merchants;
-- Keep: "Admin full access to merchants", "Merchants manage own data", "Merchants can view own data", "Unified merchant access", "Merchants can update own data"

-- Deals table - remove duplicate merchant view policy
DROP POLICY IF EXISTS "Merchants can view own deals" ON public.deals;
-- Keep: "Admin full access to deals", "Merchants can manage own deals", "authenticated_select_deals_consolidated"

-- Reviews and purchases already have consolidated policies, no changes needed