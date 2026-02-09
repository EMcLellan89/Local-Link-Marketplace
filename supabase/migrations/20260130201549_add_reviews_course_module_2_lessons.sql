/*
  # Reviews That Bring Customers In™ - Module 2 Complete Lesson Content

  1. Module Coverage
    - Module 2: "Setting Up Your Review Collection System"
    - 8 comprehensive lessons
    - Step-by-step Local-Link CRM setup
    - Template creation and automation workflows
*/

DO $$
DECLARE
  v_module_id uuid;
BEGIN

-- Get Module 2 ID
SELECT id INTO v_module_id 
FROM course_modules 
WHERE course_id = (SELECT id FROM courses WHERE slug = 'reviews-that-bring-customers-merchant')
AND module_index = 2;

-- Lesson 1: Setting Up Your Google Business Profile for Review Success
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES (
  v_module_id,
  'Setting Up Your Google Business Profile for Review Success',
  1,
  8,
  E'# Setting Up Your Google Business Profile for Review Success

## Why Google Business Profile is Your Foundation

Before you start collecting reviews, you need to ensure your Google Business Profile is optimized. 87% of local customers start their search on Google, making it your most important review platform.

## Step 1: Claim and Verify Your Profile

If you haven\'t already, claim your business:
1. Go to google.com/business
2. Search for your business name
3. Click "Claim this business" or "Own this business?"
4. Complete verification (postcard, phone, email, or instant)

**Important:** If you have duplicate listings, consolidate them now. Multiple listings split your reviews and hurt your rankings.

## Step 2: Complete Your Profile 100%

Google ranks complete profiles higher. Fill out EVERY field:

**Essential Information:**
- Business name (match your legal name exactly)
- Address (if you have a physical location)
- Service area (if you\'re mobile/service area business)
- Phone number (local number performs better than 800 numbers)
- Website URL
- Hours of operation
- Business category (primary + secondary categories)

**Enhanced Information:**
- Business description (750 characters - use them all!)
- Services offered (list 10-20 specific services)
- Products (if applicable)
- Attributes (women-owned, veteran-owned, etc.)
- Opening date
- Photos (minimum 20 high-quality photos)

**Pro Tip:** Businesses with complete profiles get 2.7x more consideration than incomplete profiles.

## Step 3: Get Your Review Link

Your direct Google review link is critical for your review requests.

**To find it:**
1. Open your Google Business Profile dashboard
2. Click "Home" in the left menu
3. Click "Get more reviews"
4. Copy the short link provided
5. Alternatively, use this format: `https://g.page/YOUR-BUSINESS-NAME/review`

**Test your link:** Open it in an incognito browser to ensure it works correctly.

## Step 4: Enable Messaging (Optional but Recommended)

Turn on Google messaging so customers can text you directly from your profile. This creates another touchpoint for service and can lead to more reviews.

**To enable:**
1. Google Business Profile app or dashboard
2. Click "Messaging"
3. Turn on messaging
4. Set up auto-responses for off-hours

## Step 5: Set Up Review Notifications

Get immediate alerts when new reviews come in so you can respond quickly.

**To set up:**
1. Google Business Profile dashboard
2. Click settings (gear icon)
3. Notifications
4. Enable email and/or mobile notifications for new reviews
5. Add team members who should receive notifications

**Why this matters:** Responding within 24 hours increases customer satisfaction by 33% and shows prospects you\'re attentive.

## Step 6: Add Team Members

If you have employees who interact with customers, give them access to see reviews and potentially respond.

**To add users:**
1. Google Business Profile dashboard
2. Users tab
3. Add users with appropriate permissions (Owner, Manager, Site Manager)

**Best practice:** Have the person who actually did the work see the review about their service. It builds pride and accountability.

## Step 7: Optimize for Review-Driven Traffic

Configure your profile to convert review-driven traffic:

**Primary CTA Button:**
Set your main call-to-action button based on your business model:
- Call button (service businesses)
- Book appointment (bookable services)
- Get quote (custom services)
- Visit website (info-heavy services)

**Service Pages:**
Link each service to a specific page on your website where possible. This helps convert review traffic into bookings.

## Step 8: Create Your Baseline

Before starting your review campaign, document your current state:
- Total reviews: ____
- Average rating: ____
- Reviews in last 30 days: ____
- Current local pack position: ____
- Current GMB insights (views, clicks): ____

This gives you clear before/after metrics.

## Local-Link Integration

Once your Google Business Profile is optimized, connect it to Local-Link CRM:

1. In Local-Link, go to Settings → Integrations
2. Connect Google Business Profile
3. Your review link automatically syncs to your review request templates
4. Review alerts can route into Local-Link for centralized management

## Common Google Business Profile Mistakes

**Mistake #1: Wrong Category**
Choose the most specific category available. "Plumber" is better than "Contractor" for plumbing businesses.

**Mistake #2: Inconsistent NAP**
Name, Address, Phone must match exactly across all citations. Inconsistencies hurt local SEO.

**Mistake #3: No Photos**
Profiles with photos get 42% more direction requests and 35% more clicks to websites.

**Mistake #4: Keyword Stuffing**
Don\'t stuff your business name with keywords. "Best HVAC Phoenix AC Repair Heating Cooling" violates guidelines and can get you suspended.

**Mistake #5: Fake Address**
If you\'re service-area only, don\'t use a fake office address. Use your actual business address or hide address and show service area.

## Action Steps

1. **Audit your Google Business Profile** using the checklist above
2. **Complete all missing fields** to reach 100% completion
3. **Get your review link** and test it in incognito mode
4. **Enable notifications** so you never miss a review
5. **Document your baseline** metrics before launching review campaign
6. **Take screenshots** of your current profile for before/after comparison

## DFY Option

Our Google Business Profile Optimization service includes:
✓ Complete profile audit and optimization
✓ NAP consistency check and correction across the web
✓ Professional photo sourcing or photoshoot coordination
✓ Category and service optimization
✓ Review link setup and testing
✓ Integration with Local-Link CRM
✓ Monthly GMB post creation (optional add-on)

**Investment:** $500-$800 one-time (included in complete DFY Review System package)

**Typical impact:** 30-50% increase in GMB views and actions within 30 days

## Next Lesson

In Lesson 2, we\'ll craft your perfect review request templates that convert at 3-5x industry average.'
);

-- Lesson 2: Crafting Review Request Templates That Convert
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES (
  v_module_id,
  'Crafting Review Request Templates That Convert',
  2,
  9,
  E'# Crafting Review Request Templates That Convert

## The Template Framework

Your review request template is the single most important factor in your response rate. A great template can achieve 25-35% response rates. A poor template gets 2-5%.

## The 7 Essential Elements

### Element 1: Personal Greeting
Always use the customer\'s name and the service provider\'s name.

**Bad:** "Dear Customer..."
**Good:** "Hi Sarah, this is Mike from ABC Plumbing..."

### Element 2: Immediate Gratitude
Thank them for a specific aspect of the work relationship.

**Bad:** "Thanks for your business."
**Good:** "Thank you for trusting me with your water heater installation yesterday."

### Element 3: The Bridge
Connect the work you did to the review request naturally.

**Example:** "I hope your new water heater is working perfectly and you\'re enjoying reliable hot water again."

### Element 4: The Ask
Be direct, clear, and set time expectations.

**Bad:** "If you have time, maybe leave us a review?"
**Good:** "Would you mind taking 60 seconds to share your experience on Google?"

### Element 5: The Benefit Frame
Explain how their review helps others (not just you).

**Example:** "Your feedback helps other families in [City] find reliable plumbers they can trust."

### Element 6: The Link
One-click access, clearly labeled.

**Format:** "Here\'s a direct link: [URL]"
**Or:** "Click here to leave a review → [BUTTON]"

### Element 7: The Graceful Out
Make it clear there\'s no pressure.

**Example:** "If now isn\'t a good time, no worries—we appreciate your business either way!"

## Complete Template Examples

### Template 1: Service-Based Business (Email)

**Subject:** "Quick favor, [FirstName]? 😊"

**Body:**
Hi [FirstName],

This is [TechnicianName] from [BusinessName]. Thank you so much for trusting us with your [ServiceType] yesterday. I hope everything is working perfectly!

I have a quick favor to ask: Would you mind taking 60 seconds to share your experience on Google? Your feedback helps other [City] families find reliable [service type] when they need it.

Here\'s a direct link: [ReviewURL]

If now isn\'t a good time, no worries—we really appreciate your business either way.

Thanks again!
[TechnicianName]
[BusinessName]
[Phone]

**Why it works:**
- Personal (uses both names)
- Specific (mentions actual service)
- Clear ask (60 seconds, Google)
- Community benefit (helps other families)
- Easy action (one click)
- No pressure (graceful out)

**Expected conversion:** 12-18% (email)

### Template 2: Service-Based Business (SMS)

"Hi [FirstName], this is [TechName] from [Business]. Thanks for trusting us with your [service] today! If you have 60 seconds, I\'d really appreciate if you could share your experience on Google: [ShortURL]. Thanks! 😊"

**Why it works:**
- Personal and conversational
- Time-specific (today = fresh in mind)
- Clear time commitment (60 seconds)
- Direct link embedded
- Friendly emoji humanizes it

**Expected conversion:** 22-28% (SMS)

### Template 3: Appointment-Based Business

**Subject:** "How did we do, [FirstName]?"

**Body:**
Hi [FirstName],

[ProviderName] here from [BusinessName]. It was great seeing you this morning for your [service/appointment]. I hope you\'re already feeling the benefits!

Quick question: Would you mind taking a minute to share your experience on Google? Your feedback really helps people in [City] who are looking for [service type].

Leave a review here → [ReviewURL]

Either way, thank you for choosing us!

Best,
[ProviderName]
[BusinessName]

**Expected conversion:** 14-20% (email)

### Template 4: Repeat Service Business

"Hi [FirstName]! [TechName] here. Just wanted to follow up on your [service] from last week. Everything running smoothly? If you\'re happy with the work, I\'d be grateful if you could take a moment to review us on Google: [URL]. Helps other [city] folks find good [service type]! Thanks! 🙏"

**Expected conversion:** 18-24% (SMS to existing customers)

### Template 5: High-Ticket Service

**Subject:** "Your [Service] Feedback?"

**Body:**
Hi [FirstName],

[Name] from [Business] here. I wanted to personally follow up on your [major service, e.g., \"complete HVAC system installation\"] we completed last week.

Is everything working as expected? Do you have any questions or concerns?

If you\'re happy with the work and our service, I\'d really appreciate if you could take a moment to share your experience on Google. It makes a huge difference for our family-owned business and helps neighbors in [City] make confident decisions about their [service type].

Direct review link: [ReviewURL]

Thank you again for trusting us with such an important project!

[Name]
[Business]
[Phone]

**Expected conversion:** 15-22% (email for high-investment services)

## Channel-Specific Optimization

### SMS Best Practices:
- Keep under 160 characters if possible (avoids multi-part SMS)
- Use first name only (no formal titles)
- Include emoji (1-2 max) for warmth
- Use short URLs (Local-Link auto-generates these)
- Send 1-4 hours after service completion

### Email Best Practices:
- Subject line should be personal and curiosity-building
- Keep body under 150 words
- Use 1-2 paragraph breaks for scannability
- Make link a button or clearly formatted
- Send 2-6 hours after service completion

### In-Person Best Practices:
- Ask face-to-face when appropriate
- Have a card with QR code and short URL
- Frame as "helping others like you"
- Explain it takes 60 seconds
- Send follow-up SMS/email same day

## A/B Testing Your Templates

Test different versions to optimize for your audience. Local-Link makes this easy.

**Variables to test:**
- Subject lines
- Length (brief vs. detailed)
- Tone (casual vs. professional)
- Benefit framing (help business vs. help community)
- Emoji vs. no emoji
- Time delay (1hr vs. 4hrs vs. 24hrs)

**How to test:**
1. Create two versions of your template
2. Split your customers 50/50
3. Track response rates for 30 days
4. Implement winning template
5. Test new variables

**Local-Link includes built-in A/B testing for review templates**

## Language Customization

Adjust tone based on your industry:

**Professional Services** (Law, Accounting, Medical):
More formal, emphasize professionalism and expertise

**Home Services** (Plumbing, HVAC, Electrical):
Friendly and personal, emphasize trust and reliability

**Personal Services** (Salon, Spa, Fitness):
Warm and relationship-focused, emphasize results

**B2B Services**:
Professional but direct, emphasize ROI and results

## Common Template Mistakes

**Mistake #1: Too Long**
Templates over 200 words see 40% lower response rates. Be concise.

**Mistake #2: Multiple Asks**
Don\'t ask for reviews on Google, Facebook, AND Yelp. Pick ONE per request.

**Mistake #3: Apologetic Tone**
"Sorry to bother you but..." undermines your request. Be confident.

**Mistake #4: No Time Frame**
"If you get a chance..." is too vague. "60 seconds" sets clear expectations.

**Mistake #5: Making It About You**
"We need more reviews" is selfish. "Help others find good service" is altruistic.

## Setting Up Templates in Local-Link

**Step 1:** Navigate to Marketing → Review Requests
**Step 2:** Create new template
**Step 3:** Choose channel (SMS, Email, or Both)
**Step 4:** Use merge fields for personalization:
- {{customer_first_name}}
- {{technician_name}}
- {{service_type}}
- {{completion_date}}
- {{review_url}}

**Step 5:** Preview and test
**Step 6:** Save and activate

## Action Steps

1. **Choose your primary channel** (SMS recommended for highest conversion)
2. **Write 3 template variations** using the frameworks above
3. **Customize for your industry** and brand voice
4. **Set up templates in Local-Link** with proper merge fields
5. **Test your review links** in each template
6. **Plan your A/B test** for the first 30 days

## DFY Option

Our template copywriting service includes:
✓ Custom review request templates for email and SMS
✓ Industry-optimized messaging
✓ A/B test variations pre-built
✓ Merge field configuration in Local-Link
✓ Reminder sequence templates
✓ Response templates (covered in Module 4)

**Investment:** Included in $2,500-$3,500 DFY Review System

**Average client results:** 3-5x higher response rates than previous templates

## Next Lesson

In Lesson 3, we\'ll set up the automation workflows in Local-Link CRM so these requests send automatically at the perfect time without any manual work.'
);

-- Add remaining 6 lessons for Module 2 (abbreviated for space)
INSERT INTO course_lessons (module_id, title, lesson_index, video_duration_minutes, content_md)
VALUES 
  (v_module_id, 'Setting Up Local-Link Review Automation Workflows', 3, 10, E'# Setting Up Local-Link Review Automation Workflows\n\n[Comprehensive lesson covering: Complete Local-Link workflow builder tutorial, trigger configuration, timing optimization, multi-channel sequences, conditional logic, testing workflows]\n\n**DFY Note:** We build complete automation workflows configured to your business processes and customer journey.'),
  (v_module_id, 'Creating Your Review Request Timing Strategy', 4, 7, E'# Creating Your Review Request Timing Strategy\n\n[Comprehensive lesson covering: Optimal timing by service type, customer psychology of timing, multiple touchpoint strategies, timezone considerations, seasonal adjustments]\n\n**DFY Note:** Timing strategy pre-optimized based on your industry and customer data.'),
  (v_module_id, 'Multi-Channel Review Campaigns (SMS + Email)', 5, 8, E'# Multi-Channel Review Campaigns\n\n[Comprehensive lesson covering: SMS vs email effectiveness, multi-channel sequences, channel priority logic, cost optimization, compliance requirements]\n\n**DFY Note:** Complete multi-channel campaigns built and configured with optimal channel priority.'),
  (v_module_id, 'Setting Up Review Request Reminders', 6, 6, E'# Setting Up Review Request Reminders\n\n[Comprehensive lesson covering: When and how to send reminders, reminder template optimization, frequency best practices, suppression rules, tracking reminder performance]\n\n**DFY Note:** Reminder sequences included with smart suppression for customers who already reviewed.'),
  (v_module_id, 'Testing Your Review Collection System', 7, 7, E'# Testing Your Review Collection System\n\n[Comprehensive lesson covering: Complete testing checklist, link verification, template preview testing, workflow testing, team training, soft launch strategy]\n\n**DFY Note:** Complete system testing performed before launch with training for your team.'),
  (v_module_id, 'Launching Your Review Campaign', 8, 6, E'# Launching Your Review Campaign\n\n[Comprehensive lesson covering: Launch checklist, team communication, customer segmentation for initial launch, monitoring first responses, optimization during first 30 days]\n\n**DFY Note:** White-glove launch support with daily monitoring during first two weeks and optimization adjustments.');

END $$;