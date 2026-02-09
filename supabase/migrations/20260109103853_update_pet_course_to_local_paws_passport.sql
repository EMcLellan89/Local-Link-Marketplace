/*
  # Rebrand Pet Business Course to Local Paws Passport™ with PetConnect CRM
  
  1. Course Updates
    - Update course title to "Local Paws Passport™ with PetConnect CRM"
    - Update slug to "local-paws-passport-petconnect-crm"
    - Update subtitle and description
    - Keep course published and accessible
  
  2. Module Updates
    - Module 1: Understanding Local Paws Passport™ Platform
    - Module 2: Identifying & Approaching Local Businesses
    - Module 3: The Sales Presentation & Partner Benefits
    - Module 4: Closing Deals & Territory Management
    - Module 5: Partner Support & Revenue Growth
  
  3. Pricing
    - Course remains at $197 (as shown in screenshot)
    - Teaches partners how to sell exclusive territory rights to local businesses
*/

-- Update the course information
UPDATE courses
SET 
  title = 'Local Paws Passport™ with PetConnect CRM',
  slug = 'local-paws-passport-petconnect-crm',
  subtitle = 'Sell exclusive pet safety partnerships to local businesses',
  description = 'Master the art of selling Local Paws Passport™ to veterinarians, pet stores, groomers, and trainers in your exclusive territory. Learn the platform, perfect your pitch, and build recurring revenue by helping communities reunite lost pets faster.',
  updated_at = now()
WHERE id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f';

-- Update Module 1: Understanding Local Paws Passport™
UPDATE course_modules
SET 
  title = 'Understanding Local Paws Passport™ Platform',
  description = 'Learn what Local Paws Passport™ is, why communities need it, and how the exclusive partnership model creates value for local pet businesses while solving a real community problem.',
  updated_at = now()
WHERE course_id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f'
  AND module_index = 1;

-- Update Module 2: Identifying & Approaching Businesses
UPDATE course_modules
SET 
  title = 'Identifying & Approaching Local Businesses',
  description = 'Master the art of identifying the right businesses in your territory, researching their needs, and making warm introductions that lead to conversations. Learn which business types convert best and why.',
  updated_at = now()
WHERE course_id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f'
  AND module_index = 2;

-- Update Module 3: The Sales Presentation & Benefits
UPDATE course_modules
SET 
  title = 'The Sales Presentation & Partner Benefits',
  description = 'Deliver a compelling pitch that positions Local Paws Passport™ as community infrastructure, not advertising. Learn to handle objections, demonstrate ROI, and close on exclusivity.',
  updated_at = now()
WHERE course_id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f'
  AND module_index = 3;

-- Update Module 4: Closing Deals & Territory Management
UPDATE course_modules
SET 
  title = 'Closing Deals & Territory Management',
  description = 'Navigate pricing tiers, sign agreements, fulfill welcome kits, and manage your territory strategically. Learn to prioritize categories and build momentum town by town.',
  updated_at = now()
WHERE course_id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f'
  AND module_index = 4;

-- Update Module 5: Partner Support & Revenue Growth
UPDATE course_modules
SET 
  title = 'Partner Support & Revenue Growth',
  description = 'Support your partners post-signup, maximize retention, identify expansion opportunities, and scale your territory income. Learn to build recurring revenue and community trust.',
  updated_at = now()
WHERE course_id = '55b2c984-58ca-4f1b-9ae8-1337db30e15f'
  AND module_index = 5;
