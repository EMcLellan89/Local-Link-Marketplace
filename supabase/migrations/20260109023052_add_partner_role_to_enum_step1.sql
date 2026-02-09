/*
  # Add Partner Role to User Role Enum - Step 1

  1. Changes
    - Add 'partner' as a valid user role in the user_role enum

  2. Notes
    - This must be committed before the new value can be used
    - Step 2 migration will update existing profiles
*/

-- Add 'partner' to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'partner';
