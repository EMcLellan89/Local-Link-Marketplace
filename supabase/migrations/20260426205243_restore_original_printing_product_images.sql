/*
  # Restore original printing product images

  Restores the image URLs that were set in the fix_printing_products_images migration
  (20260209042529) — the intended original images for each printing product category.
*/

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'business_cards';

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'flyers';

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'brochures';

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/7045839/pexels-photo-7045839.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'door_hangers';

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/6694588/pexels-photo-6694588.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'rack_cards';

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/6256088/pexels-photo-6256088.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'envelopes';

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'letterhead';

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/1350561/pexels-photo-1350561.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'yard_signs';

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'a_frame_signs';

UPDATE printing_products SET image_url = 'https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE category = 'notepads';
