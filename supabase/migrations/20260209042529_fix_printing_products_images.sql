/*
  # Fix Printing Products Image URLs

  1. Updates
    - Fix all broken image URLs in printing_products table
    - Use stock photos from Pexels for professional product images

  2. Security
    - Only updates image_url column
    - Preserves all other product data
*/

-- Business Cards
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE 'Business Cards%';

-- Flyers
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE 'Flyers%';

-- Brochures
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE 'Brochures%';

-- Door Hangers
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/7045839/pexels-photo-7045839.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE 'Door Hangers%';

-- Rack Cards
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/6694588/pexels-photo-6694588.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE 'Rack Cards%';

-- Envelopes
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/6256088/pexels-photo-6256088.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE 'Envelopes%';

-- Letterhead
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE 'Letterhead%';

-- Yard Signs
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/1350561/pexels-photo-1350561.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE 'Yard Signs%';

-- A-Frame Signs
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE 'A-Frame Signs%';

-- Notepads
UPDATE printing_products 
SET image_url = 'https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE name LIKE '%Notepads%';