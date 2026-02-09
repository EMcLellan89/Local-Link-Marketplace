/*
  # Consolidate Duplicate Policies - Batch 1: Academy Tables

  1. Changes
    - Consolidate duplicate INSERT policies on academy_enrollments
    - Consolidate duplicate INSERT policies on academy_certifications
    
  2. Rationale
    - Multiple PERMISSIVE policies for the same operation create OR-based access
    - Duplicate policies with identical logic are redundant
    - Consolidating reduces policy evaluation overhead
*/

-- academy_enrollments: Remove duplicate INSERT policy
DROP POLICY IF EXISTS "Users can insert own enrollments" ON academy_enrollments;

-- academy_certifications: Consolidate duplicate policies
DROP POLICY IF EXISTS "Users can insert own certifications" ON academy_certifications;
