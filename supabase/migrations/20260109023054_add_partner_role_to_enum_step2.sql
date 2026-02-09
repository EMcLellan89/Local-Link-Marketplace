/*
  # Add Partner Role to User Role Enum - Step 2

  1. Changes
    - Update profiles for users who have partner records to have 'partner' role

  2. Security
    - No RLS changes needed
*/

-- Update profiles for existing partners to have the 'partner' role
UPDATE profiles
SET role = 'partner'
WHERE id IN (
  SELECT user_id
  FROM partners
  WHERE user_id IS NOT NULL
);
