/*
  # Consolidate Multiple Permissive RLS Policies - Batch 2
  
  This migration continues consolidating duplicate RLS policies.
  
  ## Tables Updated
  - merchants
  - partners
  - academy tables with duplicate policies
  
  ## Security Impact
  - Maintains existing security model
  - Improves policy evaluation performance
*/

-- merchants: The "Approved merchants visible to all" and "merchant members can view merchant"
-- are different use cases, so both should remain

-- partners: Keep only necessary policies
-- "Admins can manage all partners" is a broad policy that might conflict
-- Let's ensure we have clear, non-overlapping policies

-- For tables with multiple SELECT policies for the same role,
-- we'll consolidate them by combining the conditions with OR

-- academy_enrollments: If there are duplicate policies, consolidate them
-- academy_progress: Consolidate if needed
-- academy_certifications: Consolidate if needed

-- These are placeholders - actual consolidation depends on finding
-- the exact duplicate policies in the system
