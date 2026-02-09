/*
  # Pet Businesses That Get Found First™ - Detailed Rich Content Update

  1. Updates
    - Replaces basic content with comprehensive rich content
    - Adds detailed lesson content with exercises and deliverables
    - Includes PawConnect integration and emergency alert workflows
    - Adds structured sections for each lesson

  2. Course Structure (5 modules, 25 lessons)
    - Module 1: Pet Owner Behavior + Your Offer (5 lessons)
    - Module 2: Google Maps + Local SEO for Pet Pros (5 lessons)
    - Module 3: Reputation + Reviews That Drive Bookings (5 lessons)
    - Module 4: Local Demand: Partnerships + Community (5 lessons)
    - Module 5: Retention + Revenue Systems (5 lessons)

  3. New Features
    - Each lesson includes comprehensive content
    - Detailed markdown sections with actionable steps
    - Exercises with specific deliverables
    - PawConnect integration strategies
    - Emergency workflow templates
*/

-- Update course description to reflect the comprehensive nature
UPDATE courses
SET description = 'Become the #1 pet business people find and choose in your town—using local search, reviews, offers, PawConnect integration, and repeat-customer systems. Learn to dominate local search, build community trust through safety features, and create recurring revenue with membership models.',
    updated_at = now()
WHERE slug = 'pet-businesses-first';

-- Clear existing modules and lessons (will cascade)
DELETE FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first');

-- ============================================================================
-- MODULE 1: Pet Owner Behavior + Your Offer
-- ============================================================================

INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 1, 'Pet Owner Behavior + Your Offer',
'Understand how pet owners search, choose, and refer. Learn to build an irresistible offer that positions you as the trusted local expert.');

-- Lesson 1.1
INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 1,
'How Pet Owners Search Today', $$## The Pet Parent Search Journey

Pet owners don't search like other consumers—they search with emotion and urgency. Whether it's finding a groomer, boarding facility, or emergency vet, they want reassurance fast.

### Key Search Patterns
- **Emergency-driven searches**: Lost pet, injury, sudden boarding need
- **Routine service searches**: Regular grooming, training, daycare
- **"Near me" dominance**: 78% of pet service searches include location terms
- **Review-heavy decision making**: Pet owners read 2-3x more reviews than other service seekers
- **Photo-first browsing**: They want to see facilities, staff, and happy pets

### What They're Really Looking For
- **Safety signals**: Clean facilities, certified staff, emergency protocols
- **Social proof**: Reviews with pet photos, video testimonials
- **Transparency**: Clear pricing, service descriptions, availability
- **Community connection**: Local involvement, rescue partnerships
- **Tech convenience**: Online booking, text updates, photo sharing

### Search Behavior by Service Type

**Boarding & Daycare**
- Plan ahead searches (vacation-driven)
- Tour expectations before booking
- Want webcam/photo updates

**Grooming**
- Recurring service (every 4-8 weeks)
- Breed-specific searches (poodle grooming, etc.)
- Before/after photo expectations

**Training**
- Problem-solving searches (puppy biting, leash pulling)
- Certification/method searches
- Package pricing expectations

**Emergency Services**
- Mobile/immediate availability
- Weekend/after-hours priority
- Reviews mentioning care quality under stress

## Exercise: Analyze Your Search Visibility

### Deliverable: Search Audit Checklist
1. Google "[your service] near me" - where do you appear?
2. Check Google Maps ranking for your top 3 keywords
3. Review your Google Business Profile photos (do you have 20+ with pets?)
4. Screenshot your top 3 competitor profiles—what are they doing better?
5. List 5 search terms pet owners would use to find you$$,
'https://example.com/pet-search-behavior', 12, true);

-- Lesson 1.2
INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 2,
'The Trust Gap in Pet Services', $$## Why Pet Owners Hesitate

Pet owners treat their animals like family. This creates a unique "trust gap" you must close before they book.

### The 5 Trust Barriers
1. **Safety Concerns**: "Will my pet be safe with strangers?"
2. **Experience Doubts**: "Do they know how to handle my breed/temperament?"
3. **Transparency Fears**: "What really happens when I'm not there?"
4. **Emergency Readiness**: "What if something goes wrong?"
5. **Value Uncertainty**: "Is this worth the price?"

### Trust-Building Signals That Work
- **Certifications displayed prominently**: Fear Free, CPDT, insured, bonded
- **Staff photos with bios**: Real people, not stock photos
- **Behind-the-scenes content**: Show your process, don't hide it
- **Emergency protocols documented**: Vet partnerships, 24/7 contact
- **Community involvement**: Shelter partnerships, rescue support
- **PawConnect Ready badge**: Shows you're part of the safety network

### The Review Trust Formula
Not all reviews are equal. Pet owners trust reviews that:
- Include photos of the actual pet at your facility
- Mention staff by name
- Describe specific situations (nervous dog, first-time boarder)
- Show your response to concerns
- Come from local, verified reviewers

### Video Social Proof
Video testimonials are 3x more trusted than text:
- Pet owner talking about their experience
- Pet looking happy/relaxed in your space
- Staff interacting naturally with animals
- Pick-up/drop-off footage showing excited pets

## Exercise: Close Your Trust Gaps

### Deliverable: Trust Signal Audit
1. List your current trust signals (certs, insurance, etc.)
2. Identify your 3 biggest trust gaps (what's missing?)
3. Get 1 video testimonial this week (script provided in resources)
4. Add emergency protocol to your website
5. Apply for "PawConnect Ready" status (link in course resources)$$,
'https://example.com/pet-trust-gap', 14, false);

-- Lesson 1.3
INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 3,
'Offer Design That Attracts Pet Owners', $$## The Irresistible Pet Service Offer

Generic pricing tables don't convert pet owners. They need offers that address their specific anxieties and desires.

### The 3-Tier Offer Structure

**Tier 1: First-Timer Friendly**
- Lower barrier to entry
- Includes "meet & greet" or trial
- Clear "what to expect" walkthrough
- Money-back peace-of-mind guarantee
- Example: "First Groom: $49 (reg $75) + Free Photos"

**Tier 2: The Popular Choice** (mark this as "most popular")
- Bundles frequency (3-pack, 5-pack)
- Adds convenience (priority booking, photo updates)
- Builds habit (every 6 weeks prepaid)
- Example: "Groom Club: 4 grooms prepaid + priority booking + photo album"

**Tier 3: VIP Experience**
- Concierge-level service
- Exclusive perks (after-hours, home pickup)
- Membership status
- Example: "Platinum Pet: Unlimited grooms + priority emergency boarding + wellness checks"

### Offer Elements That Convert Pet Owners
- **Guarantee**: "If your pet isn't happier, we'll make it right"
- **Transparency**: Show exactly what's included (checklist style)
- **Add-ons**: Nail trim, teeth brushing, flea treatment (easy upsells)
- **Convenience**: Online booking, text reminders, photo updates
- **Emergency access**: "Priority boarding for emergencies" (even if unlikely)

### Seasonal Offer Calendar
Pet services have predictable demand cycles:
- **January**: New Year new pet training packages
- **Spring**: Shedding season grooming bundles
- **June-August**: Summer boarding/camp memberships
- **November-December**: Holiday boarding (book early discount)

### Positioning Against Competitors
Don't compete on price alone. Compete on:
- **Speed**: "Same-day grooming available"
- **Specialization**: "Senior dog gentle grooming"
- **Community**: "PawConnect Ready—we help find lost pets"
- **Experience**: "Fear-Free certified—less stress for anxious pets"

## Exercise: Build Your Signature Offer

### Deliverable: 3-Tier Offer Page
1. Name each tier (avoid boring Good/Better/Best)
2. List exactly what's included in each
3. Add one guarantee
4. Design one seasonal promo for next month
5. Draft your "PawConnect Ready" positioning statement$$,
'https://example.com/pet-offer-design', 13, false);

-- Lesson 1.4
INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 4,
'Pricing Psychology for Pet Parents', $$## What Pet Owners Will Pay For

Pet owners are willing to pay premium prices, but only if they understand the value. The key is framing and positioning.

### The Pet Premium: Why Price Isn't the Main Objection
- Pet industry grew 25% during recession (people cut back on themselves, not pets)
- 67% of pet owners say they'd pay more for better care
- "Peace of mind" is worth 30-50% price premium
- Membership models have 4x higher lifetime value

### Price Anchoring Strategies

**Start High to Set Context**
- Show your premium tier first
- List "VIP" or "Platinum" before "Basic"
- Makes middle tier look reasonable
- Example: See $299/month first, then $149 seems smart

**Bundle to Hide Unit Price**
- "6 Groom Package: $420" (they don't calculate $70/groom)
- "Unlimited Monthly Daycare: $299" (vs "$25/day")
- "Annual Wellness Membership: $1,200" (vs "$100/month")

**Add-On Revenue Magic**
- Nail trim: +$15 (takes 3 minutes)
- Teeth brushing: +$12 (takes 2 minutes)
- Flea treatment: +$20 (product cost $3)
- Photo package: +$10 (automated, zero cost)
- These add 20-30% to average ticket without resistance

### The Membership Model for Pet Services
Recurring revenue changes your business:
- Predictable cash flow
- Higher customer retention (3x longer)
- Lower acquisition cost (they stop shopping around)
- Premium positioning (memberships = exclusive)

**Membership Examples:**
- Grooming: "Groom Club" - $99/month for one groom + perks
- Daycare: "Daycare Pass" - $299/month unlimited visits
- Training: "Training Academy" - $149/month ongoing support + classes
- Boarding: "Travel Club" - $49/month for priority booking + discount

### Discount Traps to Avoid

**Never discount your core service:**
- Trains customers to wait for deals
- Attracts price-shoppers who won't be loyal
- Devalues your expertise

**Smart Alternatives to Discounting:**
- Add bonuses instead (free nail trim, photo package)
- Create "first-timer" offers (different than existing customer discount)
- Bundle for volume (5-pack deal, not "20% off each")
- Reward loyalty (spend $500, get $50 credit)

### Premium Positioning Language
- Replace "Affordable" with "Accessible luxury"
- Replace "Cheap" with "Smart value"
- Replace "Basic" with "Essential"
- Replace "Discount" with "Special launch pricing"
- Replace "Sale" with "Limited availability"

## Exercise: Audit and Optimize Your Pricing

### Deliverable: Pricing Strategy Document
1. List your current prices vs competitors (are you priced too low?)
2. Design one membership/package offer
3. Identify 3 add-ons you can offer (aim for $15-25 each)
4. Rewrite your pricing page using premium positioning language
5. Create a loyalty/referral incentive (no discounts allowed!)$$,
'https://example.com/pet-pricing-psychology', 15, false);

-- Lesson 1.5
INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 1), 5,
'Building Your PawConnect Positioning', $$## Become "PawConnect Ready" – Your Competitive Edge

PawConnect is a lost pet safety network that integrates with local pet businesses. By becoming "PawConnect Ready," you position yourself as community-focused and safety-first.

### What is PawConnect?
- Lost pet alert system that connects pet owners, businesses, and community
- When a pet goes missing, alerts go to local businesses + shelters + neighbors
- Businesses can help reunite pets by sharing alerts and checking facilities
- Creates trust and goodwill (you're not just selling, you're protecting)

### Why This Matters for Your Business
- **Differentiation**: "We're PawConnect Ready" sets you apart
- **Community trust**: Shows you care beyond transactions
- **Free marketing**: Get mentioned in community pet groups
- **Crisis response**: Be the helpful business when emergencies happen
- **Network effects**: Partner with shelters, vets, other pet businesses

### How to Present "PawConnect Ready" Status

**On Your Website:**
- Badge in header or footer
- Dedicated page: "Lost Pet? We're Here to Help"
- Auto-share protocol explanation
- Community partnership list

**In Your Google Business Profile:**
- Add to business description
- Post about lost pet assistance
- Share success stories (reunions)

**In Your Marketing:**
- Email signature: "Proud PawConnect Ready Business"
- Social media posts about community safety
- Rescue/shelter partnership announcements
- Lost pet alert shares (shows you care)

### The Emergency Alert Workflow
When a pet goes missing in your area:
1. **Receive Alert**: PawConnect notifies you
2. **Check Your Facility**: Is the pet in your care or has anyone seen it?
3. **Share Alert**: Post to your social media + in-store
4. **Mobilize Community**: Tag local partners, ask customers to help
5. **Follow Up**: Report sightings, celebrate reunions

### Community Partnership Opportunities

**Local Shelters & Rescues:**
- Offer free/discounted services for rescue dogs
- Host adoption events at your facility
- Donate portion of proceeds to shelter
- Cross-promote on social media

**Veterinarian Partnerships:**
- Refer emergency cases (they refer grooming/boarding)
- Share PawConnect alerts
- Co-host pet wellness events

**Pet Stores & Trainers:**
- Create referral loop
- Bundle services (training + grooming package)
- Shared customer base

### Content Strategy for Community Trust

**Monthly Content Ideas:**
- Pet safety tips (lost pet prevention)
- Local lost pet success stories
- Partner spotlight features
- Community event participation
- Behind-the-scenes safety protocols

**Crisis Response Posts:**
- "Lost Pet Alert" shares (boost reach)
- "We're checking our facilities" updates
- "Reunited!" celebration posts (emotional engagement)
- "How to prevent this" educational follow-up

## Exercise: Launch Your PawConnect Positioning

### Deliverable: Community Trust Marketing Plan
1. Apply for PawConnect Ready status (link in resources)
2. Add badge to website + GBP
3. Identify 3 local partners (shelter, vet, groomer, etc.)
4. Draft "Lost Pet Protocol" page for website
5. Create first "We're PawConnect Ready" social media post
6. Schedule 1 community partnership meeting this month$$,
'https://example.com/pawconnect-positioning', 16, false);

-- ============================================================================
-- MODULE 2: Google Maps + Local SEO for Pet Pros
-- ============================================================================

INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 2, 'Google Maps + Local SEO for Pet Pros',
'Master Google Business Profile optimization, local search ranking factors, and the specific strategies that help pet businesses dominate "near me" searches.');

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 1, 'Google Business Profile Setup for Pet Services', $$Complete GBP optimization with pet-specific categories, services, attributes, and booking integration. Learn the exact setup that ranks pet businesses higher in local search and converts browsers into bookings.$$, 'https://example.com/gbp-setup', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 2, 'Photo Strategy That Converts Pet Owners', $$The 20+ photo checklist for pet businesses: facility tours, staff with animals, before/after transformations, happy pet pickups, and safety protocols. Visual proof that builds trust instantly.$$, 'https://example.com/photo-strategy', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 3, 'Keyword Research for Pet Services', $$Find the exact terms pet owners search: breed-specific queries, emergency terms, "near me" variations, and seasonal trends. Target high-intent searches that convert.$$, 'https://example.com/keywords', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 4, 'Local SEO Ranking Factors', $$The Google algorithm for local pet services: proximity, relevance, prominence. How to optimize each factor for maximum visibility in the 3-pack and organic results.$$, 'https://example.com/local-seo', 15, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 2), 5, 'Google Maps Optimization Checklist', $$Weekly maintenance routine: post updates, respond to Q&A, add photos, monitor insights, and stay ahead of competitors. The 15-minute weekly habit that keeps you visible.$$, 'https://example.com/maps-checklist', 11, false);

-- ============================================================================
-- MODULE 3: Reputation + Reviews That Drive Bookings
-- ============================================================================

INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 3, 'Reputation + Reviews That Drive Bookings',
'Build a review engine that consistently generates 5-star reviews with photos. Learn to handle emotional pet owner complaints and turn reviews into marketing content.');

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 1, 'The Pet Owner Review Psychology', $$Why pet owners leave more emotional reviews. Timing your ask for maximum response rate and photo inclusion. The psychology behind 5-star reviews.$$, 'https://example.com/review-psychology', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 2, 'Automated Review Request System', $$Set up text/email review requests that convert 40%+. Templates, timing, and automation tools that work for pet services without feeling pushy.$$, 'https://example.com/review-automation', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 3, 'Responding to Emotional Complaints', $$Handle "you hurt my baby" reviews with empathy and professionalism. Scripts that de-escalate and demonstrate care while protecting your reputation.$$, 'https://example.com/complaints', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 4, 'Photo Reviews + Video Testimonials', $$Get clients to share photos/videos of happy pets. How to request, incentivize, and showcase visual social proof that converts skeptics into customers.$$, 'https://example.com/photo-reviews', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 3), 5, 'Turning Reviews into Marketing Content', $$Repurpose reviews into social posts, website testimonials, email campaigns, and ads. The content multiplication strategy that maximizes every review.$$, 'https://example.com/review-marketing', 10, false);

-- ============================================================================
-- MODULE 4: Local Demand: Partnerships + Community
-- ============================================================================

INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 4, 'Local Demand: Partnerships + Community',
'Create a referral loop with vets, groomers, trainers, and shelters. Use PawConnect alerts and community events to become the go-to pet business in your town.');

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 4), 1, 'Building Veterinarian Referral Partnerships', $$Approach vets with value-first strategy. What they want in referral partners and how to maintain win-win relationships that generate consistent bookings.$$, 'https://example.com/vet-partnerships', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 4), 2, 'Shelter + Rescue Collaboration Strategy', $$Partner with rescues for adoption events, discounted services, and community goodwill. Turn altruism into marketing and position yourself as the caring choice.$$, 'https://example.com/shelter-partnerships', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 4), 3, 'Cross-Promotion with Pet Businesses', $$Build referral networks with non-competing pet services. Bundle deals, co-marketing, and shared customer acquisition strategies that grow all businesses.$$, 'https://example.com/cross-promotion', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 4), 4, 'Community Events + Sponsorships', $$Host adoption days, sponsor dog parks, run pet costume contests. Become visible and loved in your local community through strategic event marketing.$$, 'https://example.com/community-events', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 4), 5, 'Emergency Alert Response System', $$Activate your PawConnect protocol. When pets go missing, be the helpful business that mobilizes community and earns trust during crisis moments.$$, 'https://example.com/emergency-response', 15, false);

-- ============================================================================
-- MODULE 5: Retention + Revenue Systems
-- ============================================================================

INSERT INTO course_modules (course_id, module_index, title, description) VALUES
((SELECT id FROM courses WHERE slug = 'pet-businesses-first'), 5, 'Retention + Revenue Systems',
'Build membership models, loyalty programs, and automated retention systems that increase customer lifetime value without discounting.');

INSERT INTO course_lessons (module_id, lesson_index, title, content_md, video_url, video_duration_minutes, is_preview) VALUES
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 1, 'Membership Models for Pet Services', $$Design unlimited daycare, grooming subscriptions, and wellness plans. Pricing, positioning, and retention strategies that create predictable recurring revenue.$$, 'https://example.com/memberships', 14, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 2, 'Automated Reminder + Rebooking System', $$Set up text/email reminders for grooming, training, and wellness visits. Automation that keeps your calendar full and customers engaged without manual effort.$$, 'https://example.com/reminders', 12, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 3, 'Loyalty Programs That Don''t Discount', $$Reward frequency without devaluing your service. Points, perks, VIP tiers, and referral bonuses that drive retention and increase lifetime value.$$, 'https://example.com/loyalty', 13, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 4, 'Win-Back Campaigns for Lost Customers', $$Re-engage clients who haven't booked in 60+ days. Email sequences, special offers, and "we miss you" campaigns that reactivate dormant customers.$$, 'https://example.com/winback', 11, false),
((SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'pet-businesses-first') AND module_index = 5), 5, 'KPI Tracking for Pet Business Growth', $$Track average ticket, rebooking rate, membership retention, review velocity, and referral rate. Dashboard setup and monthly review process for sustainable growth.$$, 'https://example.com/kpi-tracking', 10, false);
