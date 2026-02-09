/*
  # Add Promotional Swag Products with 20% Price Increase
  
  1. Products Added
    - Adds promotional swag items and apparel products
    - All prices increased by 20% from base prices
    - Products categorized under 'promotional_swag'
    
  2. Pricing Structure
    - All prices converted to cents
    - Base prices increased by 20% markup
    - Quantity-based pricing tiers
*/

-- First batch of products
INSERT INTO printing_products (category, name, description, pricing, is_active, image_url) VALUES
('promotional_swag', 'Tile Mate 2024', 'Bluetooth tracker for keys', '{"1": 2580, "25": 2460, "50": 2340, "100": 2220}'::jsonb, true, null),
('promotional_swag', 'Ghost Golf Links Polo (Men)', 'Premium golf polo', '{"1": 13780, "12": 13110, "24": 12450, "48": 11790}'::jsonb, true, null),
('promotional_swag', 'Ghost Golf Performance Polo', 'Performance polo', '{"1": 12589, "12": 11970, "24": 11351, "48": 10732}'::jsonb, true, null),
('promotional_swag', 'Ringo Phone-Mount Bottle 32oz', 'Bottle with phone mount', '{"1": 77904, "12": 74064, "24": 70224, "48": 66384}'::jsonb, true, null),
('promotional_swag', 'Ringo Phone-Mount Bottle 24oz', 'Bottle with phone mount', '{"1": 68676, "12": 65304, "24": 61932, "48": 58560}'::jsonb, true, null),
('promotional_swag', 'Bullware Wood Bottle Opener', 'Wooden bottle opener', '{"50": 605, "100": 575, "250": 545, "500": 515}'::jsonb, true, null),
('promotional_swag', 'Recycled Felt Shopper Tote', 'Sustainable tote bag', '{"25": 792, "50": 752, "100": 712, "250": 672}'::jsonb, true, null),
('promotional_swag', 'Reborn Recycled Aluminum Pen', 'Eco-friendly pen', '{"100": 216, "250": 205, "500": 194, "1000": 183}'::jsonb, true, null),
('promotional_swag', 'Asbury Recycled Aluminum Bottle', 'Recycled water bottle', '{"25": 685, "50": 651, "100": 617, "250": 583}'::jsonb, true, null),
('promotional_swag', 'Feltro Upcycled Mouse Pad', 'Sustainable mouse pad', '{"25": 1586, "50": 1508, "100": 1430, "250": 1352}'::jsonb, true, null),
('promotional_swag', 'Peninsula Leather Keychain', 'Premium leather keychain', '{"50": 432, "100": 410, "250": 389, "500": 367}'::jsonb, true, null),
('promotional_swag', 'Dash Acrylic Tumbler 17oz', 'Clear acrylic tumbler', '{"24": 996, "48": 946, "100": 897, "250": 847}'::jsonb, true, null),
('promotional_swag', 'Sona rPET Bamboo Lid Bottle', 'Eco bottle with bamboo lid', '{"25": 666, "50": 633, "100": 600, "250": 567}'::jsonb, true, null),
('promotional_swag', 'Recycled Cotton Twill Tote', 'Sustainable cotton tote', '{"50": 306, "100": 291, "250": 275, "500": 260}'::jsonb, true, null),
('promotional_swag', 'Clear Crossbody Bag', 'Transparent crossbody', '{"24": 936, "48": 890, "100": 843, "250": 797}'::jsonb, true, null),
('promotional_swag', 'Clear Mini Backpack', 'Transparent backpack', '{"24": 1330, "48": 1264, "100": 1197, "250": 1131}'::jsonb, true, null),
('promotional_swag', 'Renew rPET Packable Tote', 'Packable eco tote', '{"50": 731, "100": 694, "250": 658, "500": 621}'::jsonb, true, null),
('promotional_swag', 'Bi-Fold MagSafe Charger', 'Multi-device travel charger', '{"1": 44856, "12": 42636, "24": 40416, "48": 38196}'::jsonb, true, null),
('promotional_swag', 'Perka Clayton Travel Mug', 'Insulated travel mug', '{"24": 27924, "48": 26550, "100": 25176, "250": 23802}'::jsonb, true, null),
('promotional_swag', 'Perka Kerstin Steel Mug', 'Stainless steel mug', '{"24": 24000, "48": 22800, "100": 21600, "250": 20400}'::jsonb, true, null),
('promotional_swag', 'Gildan SoftStyle Youth Tee', 'Soft youth t-shirt', '{"12": 718, "24": 682, "48": 646, "100": 610}'::jsonb, true, null),
('promotional_swag', 'YETI Rambler Stackable Mug', 'YETI stackable mug', '{"1": 35832, "12": 34060, "24": 32288, "48": 30516}'::jsonb, true, null),
('promotional_swag', 'YETI Rambler Bottle 18oz', 'YETI insulated bottle', '{"1": 45696, "12": 43424, "24": 41152, "48": 38880}'::jsonb, true, null),
('promotional_swag', 'YETI Rambler Tumbler 20oz', 'YETI insulated tumbler', '{"1": 45384, "12": 43148, "24": 40912, "48": 38676}'::jsonb, true, null),
('promotional_swag', 'YETI Rambler Tumbler 30oz', 'Large YETI tumbler', '{"1": 54168, "12": 51476, "24": 48784, "48": 46092}'::jsonb, true, null),
('promotional_swag', 'Beats Fit Pro Earbuds', 'Premium wireless earbuds', '{"1": 271368, "6": 257790, "12": 244212, "24": 230634}'::jsonb, true, null),
('promotional_swag', 'Rains Tote Bag', 'Waterproof tote bag', '{"1": 134460, "6": 127770, "12": 121080, "24": 114390}'::jsonb, true, null),
('promotional_swag', 'Rains Book Daypack', 'Waterproof daypack', '{"1": 164460, "6": 156330, "12": 148200, "24": 140070}'::jsonb, true, null),
('promotional_swag', 'Rains Book Backpack', 'Waterproof backpack', '{"1": 164460, "6": 156330, "12": 148200, "24": 140070}'::jsonb, true, null),
('promotional_swag', 'CALPAK Luka Laptop Tote', 'Expandable laptop tote', '{"1": 104040, "6": 98910, "12": 93780, "24": 88650}'::jsonb, true, null),
('promotional_swag', 'CALPAK Luka Duffel', 'Premium travel duffel', '{"1": 133296, "6": 126756, "12": 120216, "24": 113676}'::jsonb, true, null),
('promotional_swag', 'Topo Designs Global Briefcase', 'Travel briefcase', '{"1": 163596, "6": 155490, "12": 147384, "24": 139278}'::jsonb, true, null),
('promotional_swag', 'Topo Designs Rover Pack', 'Classic backpack', '{"1": 127596, "6": 121260, "12": 114924, "24": 108588}'::jsonb, true, null),
('promotional_swag', '4-in-1 Apple Watch Cable', 'Multi-device cable', '{"25": 1586, "50": 1508, "100": 1430, "250": 1352}'::jsonb, true, null),
('promotional_swag', 'S''well Tumbler with Straw', 'Premium tumbler', '{"1": 35328, "12": 33582, "24": 31836, "48": 30090}'::jsonb, true, null),
('promotional_swag', 'Beats Studio Buds', 'Noise-cancelling earbuds', '{"1": 193728, "6": 184142, "12": 174556, "24": 164970}'::jsonb, true, null),
('promotional_swag', 'Accordio Light', 'Portable light', '{"12": 51708, "24": 49155, "48": 46602, "100": 44049}'::jsonb, true, null),
('promotional_swag', 'Atlantis Andy Knit Beanie', 'Sustainable beanie', '{"24": 19044, "48": 18102, "100": 17160, "250": 16218}'::jsonb, true, null),
('promotional_swag', 'Topo Designs Light Pack', 'Lightweight daypack', '{"1": 87804, "6": 83490, "12": 79176, "24": 74862}'::jsonb, true, null),
('promotional_swag', 'Big Blanket Stretch 10x10', 'Extra large blanket', '{"1": 161532, "6": 153510, "12": 145488, "24": 137466}'::jsonb, true, null),
('promotional_swag', 'Built-In Cables Power Bank', 'Power bank with cables', '{"12": 24960, "24": 23712, "48": 22464, "100": 21216}'::jsonb, true, null),
('promotional_swag', 'Tahoe Weekender Backpack', 'Large weekender pack', '{"6": 153816, "12": 146172, "24": 138528, "48": 130884}'::jsonb, true, null),
('promotional_swag', 'mophie MagSafe Charger', 'MagSafe travel charger', '{"1": 134628, "6": 127962, "12": 121296, "24": 114630}'::jsonb, true, null),
('promotional_swag', 'MiiR Wine Gift Set', 'Drinkware gift set', '{"1": 109032, "6": 103680, "12": 98328, "24": 92976}'::jsonb, true, null),
('promotional_swag', 'Hilana Upcycled Throw', 'Upcycled blanket', '{"1": 63180, "6": 60060, "12": 56940, "24": 53820}'::jsonb, true, null),
('promotional_swag', 'Quilted Laptop Sleeve', 'Custom laptop sleeve', '{"25": 23016, "50": 21870, "100": 20724, "250": 19578}'::jsonb, true, null),
('promotional_swag', 'Quartet Desktop Pad', 'Dry-erase desk pad', '{"12": 49740, "24": 47253, "48": 44766, "100": 42279}'::jsonb, true, null),
('promotional_swag', 'Stanley Quencher 40oz', 'Large Stanley tumbler', '{"1": 52668, "12": 50070, "24": 47472, "48": 44874}'::jsonb, true, null),
('promotional_swag', 'Cactus Leather Journal Set', 'Sustainable journal', '{"25": 33996, "50": 32310, "100": 30624, "250": 28938}'::jsonb, true, null),
('promotional_swag', 'CableCatch Organizer', 'Desk cable management', '{"50": 862, "100": 819, "250": 776, "500": 733}'::jsonb, true, null),
('promotional_swag', 'DeskShield Desk Mat', 'Premium desk mat', '{"12": 32616, "24": 31005, "48": 29394, "100": 27783}'::jsonb, true, null);
