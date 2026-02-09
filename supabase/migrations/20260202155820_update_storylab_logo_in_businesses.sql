/*
  # Update StoryLab Logo in Profit Network Businesses

  Updates all three StoryLab businesses to use the new Local-Link StoryLab logo.

  1. Changes
    - Update StoryLab Kids logo_url to use new logo
    - Update StoryLab Teen logo_url to use new logo
    - Update StoryLab Adult logo_url to use new logo

  2. Security
    - No RLS changes, existing policies remain in place
*/

-- Update all StoryLab logos to use the new Local-Link StoryLab logo
UPDATE profit_network_businesses
SET logo_url = '/image copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy copy.png'
WHERE name IN ('StoryLab Kids', 'StoryLab Teen', 'StoryLab Adult');
