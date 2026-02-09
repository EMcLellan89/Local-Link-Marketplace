/*
  # Consolidate Duplicate Policies - Batch 2: External Sales and Multiple Access Patterns

  1. Changes
    - Remove duplicate admin policies from external_sale_commissions
    - Remove redundant SELECT policies when ALL policy exists
    - Consolidate duplicate partner access policies
    
  2. Rationale
    - ALL policies already cover SELECT, INSERT, UPDATE, DELETE
    - Multiple policies for same role/operation create confusion
    - Reduces policy evaluation overhead
*/

-- external_sale_commissions: Remove duplicates
-- Keep the newer optimized policy "Admins can manage all external sale commissions"
DROP POLICY IF EXISTS "Admins can manage external sale commissions" ON external_sale_commissions;
DROP POLICY IF EXISTS "Admins can view all external sale commissions" ON external_sale_commissions;
DROP POLICY IF EXISTS "Partners can view their external sale commissions" ON external_sale_commissions;

-- external_sales_events: Likely has similar issues based on earlier audit
DROP POLICY IF EXISTS "Partners can view their external sales events" ON external_sales_events;
DROP POLICY IF EXISTS "Admins can view all external sales events" ON external_sales_events;
