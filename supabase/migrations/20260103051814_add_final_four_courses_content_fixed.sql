/*
  # Final Four Courses Content - Fixed

  Adds comprehensive modules and lessons for:
  - Course 8: Pet Businesses That Get Found First™ (5 modules, 25 lessons)
  - Course 9: Care Coordination for Families™ (5 modules, 24 lessons)
  - Course 10: Start a Local Service Side Hustle™ (5 modules, 26 lessons)
  - Course 11: Online Sales Without Ads™ (5 modules, 27 lessons)
*/

-- ============================================================================
-- COURSE 8: Pet Businesses That Get Found First™ - 5 Modules, 25 Lessons
-- ============================================================================

-- Module 1: Pet Industry Marketing Basics
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 1, 'Pet Industry Marketing Basics', 'Understanding pet owner psychology')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 1, 'The Pet Parent Mindset', 'Why pet owners treat pets like family. Emotional purchasing decisions, willingness to pay premium, and loyalty factors.', 'https://example.com/video164', 11, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 2, 'Pet Industry Market Segments', 'Dogs vs cats vs exotic pets. Service needs, spending patterns, and targeting the right pet owners for your business.', 'https://example.com/video165', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 3, 'Trust Factors in Pet Services', 'Why pet owners are extra cautious. Certifications, insurance, testimonials, and trust signals that overcome hesitation.', 'https://example.com/video166', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 4, 'Pricing Psychology for Pet Services', 'What pet owners will pay for. Premium positioning, package deals, and membership models that maximize value.', 'https://example.com/video167', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 5, 'Seasonality in Pet Business', 'Demand patterns throughout the year. Holiday boarding, summer grooming, and planning for fluctuations.', 'https://example.com/video168', 9, false)
ON CONFLICT DO NOTHING;

-- Module 2: Local SEO for Pet Businesses
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 2, 'Local SEO for Pet Businesses', 'Ranking for pet-related searches')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 1, 'Google Business Profile for Pet Services', 'Pet-specific optimization. Photos with animals, service highlights, and review generation from happy pet parents.', 'https://example.com/video169', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 2, 'Keyword Strategy for Pet Businesses', 'What pet owners search for. "Near me" searches, breed-specific keywords, and emergency service terms.', 'https://example.com/video170', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 3, 'Pet Business Website Essentials', 'Converting visitors to bookings. Service pages, pricing transparency, online booking, and mobile optimization.', 'https://example.com/video171', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 4, 'Content Marketing for Pet Services', 'Blog topics that attract pet owners. Care tips, breed guides, and answering common pet parent questions.', 'https://example.com/video172', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 5, 'Reviews and Reputation Management', 'Getting 5-star reviews from pet owners. Photo reviews, testimonials with pets, and showcasing happy customers.', 'https://example.com/video173', 10, false)
ON CONFLICT DO NOTHING;

-- Module 3: Social Media for Pet Services
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 3, 'Social Media for Pet Services', 'Content that pet owners engage with')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 1, 'Instagram for Pet Businesses', 'Visual content strategy. Before/after grooming, client pet features, and stories that build following.', 'https://example.com/video174', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 2, 'Facebook Groups and Local Communities', 'Engaging in pet parent groups. Providing value, establishing expertise, and ethical self-promotion.', 'https://example.com/video175', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 3, 'User-Generated Content Strategy', 'Getting clients to post about your business. Photo permissions, resharing client posts, and building social proof.', 'https://example.com/video176', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 4, 'Social Media Content Calendar', 'Consistent posting without overwhelm. Content themes, batch creation, and scheduling tools for pet businesses.', 'https://example.com/video177', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 5, 'Going Viral with Pet Content', 'Creating shareable moments. Cute factor, storytelling, and leveraging trending formats for reach.', 'https://example.com/video178', 14, false)
ON CONFLICT DO NOTHING;

-- Module 4: Partnerships and Referrals
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 4, 'Partnerships and Referrals', 'Vet clinics, groomers, and cross-promotion')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 4), 1, 'Building Veterinarian Relationships', 'Referral partnerships with vets. Approach strategy, what vets look for, and maintaining relationships.', 'https://example.com/video179', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 4), 2, 'Pet Store Collaborations', 'Cross-promotion with retail. In-store flyers, events, and commission-based referral programs.', 'https://example.com/video180', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 4), 3, 'Complementary Service Partnerships', 'Dog trainers, groomers, walkers, sitters. Building referral networks across pet services.', 'https://example.com/video181', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 4), 4, 'Client Referral Programs', 'Incentivizing word-of-mouth. Referral discounts, loyalty programs, and VIP client benefits.', 'https://example.com/video182', 10, false)
ON CONFLICT DO NOTHING;

-- Module 5: Pet Business Growth
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 5, 'Pet Business Growth', 'Scaling services and adding revenue streams')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 1, 'Adding Service Lines', 'Expanding beyond core offering. Adding grooming to boarding, training to daycare, and natural progressions.', 'https://example.com/video183', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 2, 'Membership and Subscription Models', 'Recurring revenue in pet services. Unlimited daycare plans, grooming subscriptions, and wellness packages.', 'https://example.com/video184', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 3, 'Hiring and Training Pet Care Staff', 'Building your team. Finding reliable pet lovers, training standards, and quality control.', 'https://example.com/video185', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 4, 'Multiple Location Strategy', 'Growing your footprint. When to expand, location selection, and managing multiple facilities.', 'https://example.com/video186', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 5, 'Building a Pet Business Brand', 'Standing out in competitive markets. Niche positioning, brand personality, and premium service delivery.', 'https://example.com/video187', 10, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COURSE 9: Care Coordination for Families™ - 5 Modules, 24 Lessons
-- ============================================================================

-- Module 1: Family Services Marketing
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'care-coordination-for-families'), 1, 'Family Services Marketing', 'Building trust with concerned families')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 1), 1, 'Understanding Family Decision-Making', 'Who chooses care services. Adult children for senior care, parents for childcare, and family dynamics in selection.', 'https://example.com/video188', 12, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 1), 2, 'Emotional Marketing for Care Services', 'Trust, safety, and peace of mind. Messaging that resonates with concerned family members.', 'https://example.com/video189', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 1), 3, 'Compliance and Credentialing', 'Certifications that matter. Background checks, insurance, licensing - what families look for and expect.', 'https://example.com/video190', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 1), 4, 'Care Service Niches', 'Senior care, childcare, special needs, disability support. Choosing your focus and specialization.', 'https://example.com/video191', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 1), 5, 'Pricing Sensitivity in Care', 'Balancing affordability with quality. Payment models, insurance billing, and value justification.', 'https://example.com/video192', 14, false)
ON CONFLICT DO NOTHING;

-- Module 2: Senior Care Marketing
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'care-coordination-for-families'), 2, 'Senior Care Marketing', 'Reaching adult children and seniors')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 2), 1, 'Marketing to Adult Children', 'Targeting the decision-makers. Where adult children search for senior care and what concerns they have.', 'https://example.com/video193', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 2), 2, 'Local SEO for Senior Services', 'Ranking for senior care searches. "Assisted living near me", "home care services", and local visibility.', 'https://example.com/video194', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 2), 3, 'Senior Community Engagement', 'Reaching seniors directly. Senior centers, retirement communities, and grassroots marketing.', 'https://example.com/video195', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 2), 4, 'Content Marketing for Elder Care', 'Educational content that attracts families. Caregiver tips, navigating Medicare, and aging-in-place guides.', 'https://example.com/video196', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 2), 5, 'Handling Objections in Senior Care', 'Overcoming resistance. Cost concerns, guilt about placement, and family disagreements.', 'https://example.com/video197', 12, false)
ON CONFLICT DO NOTHING;

-- Module 3: Reputation in Care Services
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'care-coordination-for-families'), 3, 'Reputation in Care Services', 'Reviews and trust-building in sensitive niches')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 3), 1, 'Review Generation in Sensitive Services', 'Asking for reviews tactfully. Timing, approach, and making it easy for grateful families to share experiences.', 'https://example.com/video198', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 3), 2, 'Video Testimonials That Build Trust', 'Capturing powerful stories. Family testimonials, staff introductions, and facility tours that overcome fear.', 'https://example.com/video199', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 3), 3, 'Handling Negative Feedback', 'Crisis management in care services. Responding to complaints, resolving family concerns, and protecting reputation.', 'https://example.com/video200', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 3), 4, 'Transparency and Communication', 'Building trust through openness. Regular updates to families, incident reporting, and proactive communication.', 'https://example.com/video201', 10, false)
ON CONFLICT DO NOTHING;

-- Module 4: Healthcare Partnerships
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'care-coordination-for-families'), 4, 'Healthcare Partnerships', 'Working with referral sources')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 4), 1, 'Hospital Discharge Planning Relationships', 'Connecting with case managers. How hospitals choose care providers and getting on preferred lists.', 'https://example.com/video202', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 4), 2, 'Physician Referral Networks', 'Building doctor relationships. Marketing to medical practices and becoming their go-to care recommendation.', 'https://example.com/video203', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 4), 3, 'Working with Care Managers', 'Geriatric care managers and social workers. Professional referral partnerships in elder care.', 'https://example.com/video204', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 4), 4, 'Insurance and Medicare Navigation', 'Understanding payment models. Medicare coverage, Medicaid, long-term care insurance, and billing.', 'https://example.com/video205', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 4), 5, 'Community Organization Partnerships', 'AARP, Alzheimer''s Association, aging agencies. Leveraging nonprofit connections for referrals.', 'https://example.com/video206', 10, false)
ON CONFLICT DO NOTHING;

-- Module 5: Care Business Operations
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'care-coordination-for-families'), 5, 'Care Business Operations', 'Scaling compassionate services')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 5), 1, 'Hiring Compassionate Caregivers', 'Finding and retaining quality staff. Screening, training, and creating culture of care.', 'https://example.com/video207', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 5), 2, 'Scheduling and Logistics', 'Managing caregiver schedules. Matching caregivers to clients, handling emergencies, and backup coverage.', 'https://example.com/video208', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 5), 3, 'Quality Assurance in Care', 'Maintaining high standards. Supervision, family feedback, incident tracking, and continuous improvement.', 'https://example.com/video209', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'care-coordination-for-families') AND module_index = 5), 4, 'Scaling Your Care Business', 'Growth without sacrificing quality. Systems, hiring, and maintaining the personal touch at scale.', 'https://example.com/video210', 11, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COURSE 10: Start a Local Service Side Hustle™ - 5 Modules, 26 Lessons
-- ============================================================================

-- Module 1: Choosing Your Service Niche
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'local-service-side-hustle'), 1, 'Choosing Your Service Niche', 'Low-investment service businesses that work')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 1), 1, 'Best Side Hustles for Beginners', 'Low barrier to entry services. Lawn care, cleaning, pressure washing, handyman, and more.', 'https://example.com/video211', 11, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 1), 2, 'Skills You Already Have', 'Monetizing existing abilities. Identifying transferable skills and service opportunities in your area.', 'https://example.com/video212', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 1), 3, 'Market Research for Local Services', 'Validating demand. Checking competition, pricing research, and testing interest before starting.', 'https://example.com/video213', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 1), 4, 'Seasonal vs Year-Round Services', 'Income consistency considerations. Choosing services with steady demand or planning for seasonality.', 'https://example.com/video214', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 1), 5, 'Residential vs Commercial Focus', 'Target market selection. Homeowners vs businesses - which matches your schedule and goals.', 'https://example.com/video215', 9, false)
ON CONFLICT DO NOTHING;

-- Module 2: Starting With No Money
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'local-service-side-hustle'), 2, 'Starting With No Money', 'Launching without equipment or investment')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 2), 1, 'Bootstrap Service Business Strategy', 'Starting with zero dollars. Using what you have, renting equipment, and client-funded growth.', 'https://example.com/video216', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 2), 2, 'Free Marketing That Works', 'Getting customers without ad spend. Word of mouth, social media, door knocking, and referrals.', 'https://example.com/video217', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 2), 3, 'Using Client Deposits to Fund Growth', 'Getting paid upfront. Deposit strategies that provide working capital for equipment and supplies.', 'https://example.com/video218', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 2), 4, 'Equipment and Tool Strategy', 'What to buy first. Essential vs nice-to-have, quality vs budget, and upgrade timing.', 'https://example.com/video219', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 2), 5, 'Insurance and Licensing on a Budget', 'Legal protection basics. Minimum insurance requirements, business licenses, and staying compliant cheaply.', 'https://example.com/video220', 10, false)
ON CONFLICT DO NOTHING;

-- Module 3: Getting First Customers Fast
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'local-service-side-hustle'), 3, 'Getting First Customers Fast', 'Landing clients in your first week')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 3), 1, 'The Friends and Family Launch', 'Your first customers. Discounted rates, testimonials, and leveraging personal network.', 'https://example.com/video221', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 3), 2, 'Door-to-Door That Works', 'Neighborhood canvassing. Scripts, timing, and turning no''s into future yes''s.', 'https://example.com/video222', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 3), 3, 'Facebook Marketplace and Local Groups', 'Free online advertising. Post templates, group rules, and building credibility online.', 'https://example.com/video223', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 3), 4, 'Pricing for Quick Sales', 'Competitive pricing strategy. Undercutting to build portfolio vs value pricing for sustainability.', 'https://example.com/video224', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 3), 5, 'Converting Quotes to Jobs', 'Sales skills for service providers. Presenting estimates, handling objections, and closing same-day.', 'https://example.com/video225', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 3), 6, 'Building Social Proof Fast', 'Getting testimonials and photos. Documenting work, review requests, and showcasing results.', 'https://example.com/video226', 9, false)
ON CONFLICT DO NOTHING;

-- Module 4: Side Hustle Operations
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'local-service-side-hustle'), 4, 'Side Hustle Operations', 'Managing work alongside your day job')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 4), 1, 'Scheduling Around Your Day Job', 'Time management for side hustlers. Evenings, weekends, and maximizing limited availability.', 'https://example.com/video227', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 4), 2, 'Setting Client Expectations', 'Managing availability. Being upfront about schedules and avoiding customer frustration.', 'https://example.com/video228', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 4), 3, 'Avoiding Burnout', 'Sustainable side hustle pace. Knowing when to say no, rest importance, and work-life balance.', 'https://example.com/video229', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 4), 4, 'Finances and Bookkeeping', 'Money management basics. Separating business funds, tracking expenses, and preparing for taxes.', 'https://example.com/video230', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 4), 5, 'Reinvesting vs Taking Home', 'Growth strategy. How much to reinvest in equipment and marketing vs personal income.', 'https://example.com/video231', 9, false)
ON CONFLICT DO NOTHING;

-- Module 5: Scaling to Full-Time
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'local-service-side-hustle'), 5, 'Scaling to Full-Time', 'When and how to quit your job')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 5), 1, 'Signs You''re Ready to Go Full-Time', 'Financial indicators. Revenue benchmarks, savings requirements, and confidence signals.', 'https://example.com/video232', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 5), 2, 'Financial Planning for the Leap', 'Preparing to quit your job. Emergency fund, health insurance, and income replacement plan.', 'https://example.com/video233', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 5), 3, 'Scaling Your Service Capacity', 'Handling more customers. Systems, equipment upgrades, and potentially hiring help.', 'https://example.com/video234', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 5), 4, 'Hiring Your First Helper', 'When and how to bring on help. 1099 vs W2, finding reliable people, and training.', 'https://example.com/video235', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'local-service-side-hustle') AND module_index = 5), 5, 'Building a Real Business', 'Going beyond self-employed. Systems, processes, and creating a business that can run without you.', 'https://example.com/video236', 14, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COURSE 11: Online Sales Without Ads™ - 5 Modules, 27 Lessons
-- ============================================================================

-- Module 1: Outreach Foundations
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'online-sales-without-ads'), 1, 'Outreach Foundations', 'Building a systematic sales process')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 1), 1, 'Why Ads Are Not the Answer', 'The outreach advantage. Lower cost, better fit, relationship-based sales, and sustainable pipeline.', 'https://example.com/video237', 11, true),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 1), 2, 'Outbound vs Inbound Mindset', 'Proactive vs reactive sales. Taking control of your pipeline instead of waiting for leads.', 'https://example.com/video238', 10, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 1), 3, 'The Numbers Game', 'Outreach metrics that matter. Activity goals, response rates, conversion rates, and how many touches it really takes.', 'https://example.com/video239', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 1), 4, 'Building a Sales System', 'Consistent daily activities. Time blocking, CRM setup, and creating repeatable processes.', 'https://example.com/video240', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 1), 5, 'Overcoming Outreach Fear', 'Rejection mindset. Getting comfortable with no''s and viewing outreach as service, not spam.', 'https://example.com/video241', 9, false)
ON CONFLICT DO NOTHING;

-- Module 2: Finding and Qualifying Prospects
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'online-sales-without-ads'), 2, 'Finding and Qualifying Prospects', 'Building targeted lead lists')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 2), 1, 'Ideal Customer Profile', 'Who to target. Industry, company size, roles, and pain points that match your solution.', 'https://example.com/video242', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 2), 2, 'Finding Contact Information', 'Lead generation tools. LinkedIn Sales Navigator, email finders, and verification tools.', 'https://example.com/video243', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 2), 3, 'LinkedIn for Prospecting', 'Building targeted lists on LinkedIn. Search techniques, boolean searches, and profile analysis.', 'https://example.com/video244', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 2), 4, 'Qualifying Before Outreach', 'Who to actually contact. Signs of good fit, budget indicators, and avoiding time-wasters.', 'https://example.com/video245', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 2), 5, 'Building Your Prospect Database', 'CRM organization. Tagging, segmentation, and keeping lists fresh and actionable.', 'https://example.com/video246', 10, false)
ON CONFLICT DO NOTHING;

-- Module 3: Cold Outreach That Works
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'online-sales-without-ads'), 3, 'Cold Outreach That Works', 'Email and LinkedIn strategies that book meetings')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 3), 1, 'Cold Email Fundamentals', 'What makes emails get opened and read. Subject lines, preview text, and sender name optimization.', 'https://example.com/video247', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 3), 2, 'The Perfect Cold Email', 'Structure that converts. Personalization, problem/solution, clear CTA, and keeping it short.', 'https://example.com/video248', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 3), 3, 'Email Sequence Strategy', 'Multi-touch campaigns. 5-7 email sequence, varying angles, and knowing when to stop.', 'https://example.com/video249', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 3), 4, 'LinkedIn Connection Requests', 'Getting accepted. Personalized requests, profile optimization, and connection strategies.', 'https://example.com/video250', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 3), 5, 'LinkedIn InMail and Messaging', 'Converting connections to conversations. Message templates, timing, and non-salesy approaches.', 'https://example.com/video251', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 3), 6, 'A/B Testing Your Outreach', 'Continuous improvement. Testing subject lines, angles, and CTAs to improve response rates.', 'https://example.com/video252', 10, false)
ON CONFLICT DO NOTHING;

-- Module 4: Relationship Building at Scale
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'online-sales-without-ads'), 4, 'Relationship Building at Scale', 'Nurturing leads to warm prospects')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 4), 1, 'Warming Up Cold Leads', 'Multi-channel engagement. Social media interaction, content sharing, and staying visible.', 'https://example.com/video253', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 4), 2, 'Providing Value Before Asking', 'Content marketing for outreach. Sharing insights, offering help, and building goodwill.', 'https://example.com/video254', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 4), 3, 'Personalization at Scale', 'One-to-one feel with volume. Using templates effectively, merge tags, and when to truly personalize.', 'https://example.com/video255', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 4), 4, 'Long-Term Nurture Strategy', 'Playing the long game. Monthly check-ins, staying on radar, and timing for future opportunities.', 'https://example.com/video256', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 4), 5, 'Leveraging Mutual Connections', 'Warm introductions. Getting referrals, using mutual connections, and network effects.', 'https://example.com/video257', 10, false)
ON CONFLICT DO NOTHING;

-- Module 5: Closing and Follow-Up
INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'online-sales-without-ads'), 5, 'Closing and Follow-Up', 'Converting conversations to customers')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 5), 1, 'Discovery Call Framework', 'First conversation structure. Qualifying questions, uncovering pain, and determining fit.', 'https://example.com/video258', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 5), 2, 'Handling Objections', 'Common pushback and responses. Price, timing, competition, and "need to think about it".', 'https://example.com/video259', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 5), 3, 'Proposal Best Practices', 'Winning proposals. Formatting, pricing presentation, and standing out from competition.', 'https://example.com/video260', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 5), 4, 'Closing Techniques', 'Asking for the business. Trial closes, assumptive closes, and creating urgency without pressure.', 'https://example.com/video261', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 5), 5, 'Following Up on Proposals', 'Post-proposal strategy. Follow-up timing, addressing concerns, and preventing ghosting.', 'https://example.com/video262', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'online-sales-without-ads') AND module_index = 5), 6, 'Building Long-Term Client Relationships', 'From customer to advocate. Delivery excellence, upselling opportunities, and generating referrals.', 'https://example.com/video263', 14, false)
ON CONFLICT DO NOTHING;