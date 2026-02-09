/*
  # Add Landing Pages Category

  1. Changes
    - Update swipe_file_templates category constraint to include 'Landing Pages'
    - This allows merchants to access pre-made landing page templates
*/

-- Drop existing constraint
ALTER TABLE swipe_file_templates DROP CONSTRAINT IF EXISTS swipe_file_templates_category_check;

-- Add new constraint with Landing Pages included
ALTER TABLE swipe_file_templates ADD CONSTRAINT swipe_file_templates_category_check 
CHECK (category IN (
  'Facebook Ads',
  'Instagram Ads',
  'Google Ads',
  'Postcard Templates',
  'Flyer Templates',
  'Landing Pages',
  'Email Scripts',
  'Sales Scripts',
  'Social Media Posts',
  'Deal Ideas',
  'Phone Scripts'
));