/*
  # Seed Community Marketplace Products (v2)

  ## Summary
  Seeds all community visibility products using the correct marketplace_products schema.
  Uses product_type field instead of category. Includes all 21 new products across
  community visibility, food & dining, kids & family, giveaways, and seasonal guides.
*/

INSERT INTO marketplace_products (
  name, slug, description, product_type, is_active
) VALUES

-- Community Visibility
('Community Event Listing', 'community-event-listing', 'Post one community event on the Local-Link calendar. Visible for 30 days with RSVP tracking and a shareable event page linked to the merchant profile.', 'community_visibility', true),
('Featured Event Placement', 'featured-event-placement', 'Featured event badge, top-of-calendar placement, sponsor section on event page, and priority RSVP email inclusion. $97 one-time.', 'community_visibility', true),
('Event Boost Package', 'event-boost-package', 'Featured event placement + homepage feature rotation + social media mention + weekly community email digest. $197 one-time.', 'community_visibility', true),
('Weekly Community Sponsor', 'weekly-community-sponsor', 'Sponsor box on community page, logo on weekly event email, "Supporting Local" badge. $297/week recurring.', 'community_visibility', true),
('Local Visibility Monthly', 'local-visibility-monthly', '2 featured events/month, 2 featured offers/month, community sponsor placement, email mention, monthly report. $497/month.', 'community_visibility', true),
('Community Dominator', 'community-dominator', 'Weekly featured placement, homepage spotlight, category sponsorship, 4 event/offer boosts, priority reporting. $997/month.', 'community_visibility', true),

-- Food & Dining
('Today''s Special Feature', 'food-todays-special-feature', 'Feature a merchant''s daily special at the top of the Food & Dining page for one day. $49 one-time.', 'food_dining', true),
('Weekly Dining Feature', 'food-weekly-dining-feature', 'Featured restaurant card in dining section for 7 days, including Thursday weekly digest. $147 one-time.', 'food_dining', true),
('Monthly Restaurant Spotlight', 'food-monthly-restaurant-spotlight', 'Recurring top-of-page placement in Food & Dining, pinned card, weekly email mention, monthly analytics. $397/month.', 'food_dining', true),
('Dining Category Sponsor', 'food-dining-category-sponsor', 'Own the Food & Dining category: permanent banner, first position, category newsletter, exclusive branding. $497/month.', 'food_dining', true),

-- Kids & Family
('Featured Kids Program', 'kids-featured-program', 'One-time featured placement in the Kids & Family section for a class, camp, activity, or program. $97 one-time.', 'kids_family', true),
('Kids Monthly Visibility', 'kids-monthly-visibility', 'Recurring featured placement in Kids & Family: unlimited monthly listings, homepage rotation, parent email. $297/month.', 'kids_family', true),
('Birthday Guide Listing', 'kids-birthday-guide-listing', 'Permanent placement in the Birthday Ideas section — venues, activity centers, experience businesses. $97 one-time.', 'kids_family', true),
('Camp Feature', 'kids-camp-feature', 'Featured in the Camps section for 30 days with detail page and RSVP/inquiry button. $197 one-time.', 'kids_family', true),
('Family Category Sponsor', 'kids-family-category-sponsor', 'Own the Kids & Family category: exclusive banner, first position across all family sections, parent newsletter. $497/month.', 'kids_family', true),

-- Giveaways
('Sponsored Giveaway', 'giveaway-sponsored', 'Run a community giveaway: entry page, social sharing, email capture, winner announcement. $147 one-time.', 'giveaways', true),
('Premium Giveaway Placement', 'giveaway-premium-placement', 'Homepage giveaway card, top community page placement, all weekly digest emails. $297 one-time.', 'giveaways', true),
('Giveaway Email Boost', 'giveaway-email-boost', 'Add-on: dedicated email blast to opted-in community members to maximize entries. $97 one-time.', 'giveaways', true),

-- Seasonal Guides
('Seasonal Guide Listing', 'seasonal-guide-listing', 'Business listed in a seasonal guide (Holiday, Summer, Back-to-School, etc.). $97 one-time.', 'seasonal_guides', true),
('Seasonal Guide Featured Placement', 'seasonal-guide-featured', 'Top featured card in a seasonal guide with image, description, and CTA link. $197 one-time.', 'seasonal_guides', true),
('Seasonal Category Sponsor', 'seasonal-category-sponsor', 'Sponsor an entire seasonal guide: banner, exclusive branding, email inclusion, cross-promotion. $497/month.', 'seasonal_guides', true)

ON CONFLICT (slug) DO NOTHING;
