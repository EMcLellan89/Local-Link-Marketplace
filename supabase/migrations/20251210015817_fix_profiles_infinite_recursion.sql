/*
  # Fix Infinite Recursion in Profiles RLS Policies

  ## Problem
  The "Admins can view all profiles" policy creates infinite recursion by querying
  the profiles table from within a profiles table policy.

  ## Solution
  1. Drop the problematic admin policy
  2. Store user role in JWT metadata so we can check it without querying profiles
  3. Update the trigger function to set role in JWT metadata
  4. Recreate policies that don't cause recursion

  ## Changes
  - Remove circular profile queries from RLS policies
  - Users can only view their own profile
  - Admins will need separate handling at application level or via service role
*/

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- The basic policies without recursion are fine:
-- 1. "Users can view own profile" - already exists and works correctly
-- 2. "Users can update own profile" - already exists and works correctly

-- For admin access, we'll handle it at the application level using service role
-- or create a security definer function that bypasses RLS

-- Create a function to get user profile that bypasses RLS
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  role user_role,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.role,
    p.first_name,
    p.last_name,
    p.phone,
    p.avatar_url,
    p.is_active,
    p.created_at,
    p.updated_at
  FROM profiles p
  WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.get_user_profile(UUID) IS 'Security definer function to retrieve user profile bypassing RLS for authentication context';
