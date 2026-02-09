/*
  # Add Promotional Swag Products
  
  1. Changes
    - Adds promotional swag products from printfection catalog
    - Prices are marked up 20% from base prices
    - Includes product images and descriptions
    
  2. Products Added
    - Tile Mate 2024 tracker
    - Golf polos (men's)
    - Phone-mount bottles (24oz and 32oz)
    - Wood bottle opener
    - YETI Rambler tumbler
    - Custom t-shirts and sweatshirts
    - Tote bags, caps, and pens
*/

-- Add promotional swag products with 20% markup
INSERT INTO printing_products (category, name, description, stock_type, size, turnaround, pricing, is_active, image_url) VALUES
  (
    'promotional_swag',
    'Tile Mate 2024 Tracker',
    'Bluetooth tracker with custom logo engraving',
    'Tech Accessory',
    'Compact Size',
    '2-3 weeks + ship',
    '{"1": 2580, "10": 2580, "25": 2580, "50": 2580, "100": 2580}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  ),
  (
    'promotional_swag',
    'Ghost Golf Links Polo (Men''s)',
    'Premium golf polo with embroidered logo',
    'Performance Fabric',
    'S-3XL',
    '2-3 weeks + ship',
    '{"1": 13780, "10": 13780, "25": 13780, "50": 13780, "100": 13780}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'
  ),
  (
    'promotional_swag',
    'Ghost Golf Performance Polo (Men''s)',
    'Athletic performance polo with custom branding',
    'Moisture-Wicking',
    'S-3XL',
    '2-3 weeks + ship',
    '{"1": 12589, "10": 12589, "25": 12589, "50": 12589, "100": 12589}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'
  ),
  (
    'promotional_swag',
    'Ringo Phone-Mount Bottle (32 oz)',
    'Large insulated bottle with phone mount and logo',
    'Stainless Steel',
    '32 oz',
    '2-3 weeks + ship',
    '{"1": 7790, "10": 7790, "25": 7790, "50": 7790, "100": 7790}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'
  ),
  (
    'promotional_swag',
    'Ringo Phone-Mount Bottle (24 oz)',
    'Compact insulated bottle with phone mount',
    'Stainless Steel',
    '24 oz',
    '2-3 weeks + ship',
    '{"1": 6868, "10": 6868, "25": 6868, "50": 6868, "100": 6868}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400'
  ),
  (
    'promotional_swag',
    'Bullware Wood Bottle Opener',
    'Rustic wood bottle opener with laser engraving',
    'Natural Wood',
    '5 inches',
    '1-2 weeks + ship',
    '{"1": 605, "10": 605, "25": 605, "50": 605, "100": 605}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'
  ),
  (
    'promotional_swag',
    'YETI Rambler Tumbler (20 oz)',
    'Premium insulated tumbler with logo laser engraving',
    'Stainless Steel',
    '20 oz',
    '2-3 weeks + ship',
    '{"1": 4538, "10": 4538, "25": 4538, "50": 4538, "100": 4538}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1534056421656-e5b4dc752169?w=400'
  ),
  (
    'promotional_swag',
    'Custom Logo T-Shirts',
    'High-quality cotton t-shirts with screen printing',
    '100% Cotton',
    'S-3XL',
    '1-2 weeks + ship',
    '{"12": 1800, "24": 1440, "50": 1200, "100": 960, "250": 720}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
  ),
  (
    'promotional_swag',
    'Embroidered Sweatshirts',
    'Premium sweatshirts with embroidered logo',
    'Cotton Blend',
    'S-3XL',
    '2-3 weeks + ship',
    '{"12": 3600, "24": 3240, "50": 2880, "100": 2520, "250": 2160}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
  ),
  (
    'promotional_swag',
    'Custom Tote Bags',
    'Reusable canvas tote bags with screen printing',
    'Canvas',
    '15x16 inches',
    '1-2 weeks + ship',
    '{"25": 720, "50": 600, "100": 480, "250": 360, "500": 300}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400'
  ),
  (
    'promotional_swag',
    'Branded Baseball Caps',
    'Adjustable caps with embroidered logo',
    'Cotton Twill',
    'One Size',
    '2-3 weeks + ship',
    '{"12": 1440, "24": 1200, "50": 1080, "100": 960, "250": 840}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'
  ),
  (
    'promotional_swag',
    'Custom Pens (Bulk)',
    'Retractable pens with logo imprint',
    'Plastic',
    'Standard',
    '1-2 weeks + ship',
    '{"100": 120, "250": 90, "500": 72, "1000": 60, "2500": 48}'::jsonb,
    true,
    'https://images.unsplash.com/photo-1586943759066-a7e7c57bc8d6?w=400'
  );
