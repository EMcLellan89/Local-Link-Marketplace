/*
  # Marketing for Trades™ - Module 4 Lessons

  1. Module 4: Offline Marketing That Works (Lessons 16-20)
    - Yard Signs + Door Hangers
    - Truck Branding + QR Tracking
    - Postcards + Local Link
    - Referral Partners
    - Reputation + Neighbor Proof Strategy
*/

-- Module 4 Lessons (Offline Marketing That Works)
INSERT INTO public.course_lessons (module_id, lesson_index, title, content_md, video_duration_minutes, resources, is_preview)
VALUES
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4),
    16,
    'Yard Signs + Door Hangers (The Right Way)',
    E'# Place Near Completed Jobs\n\nYard signs work because **neighbors see proof**: you just completed work nearby. Place signs near every job site (with permission).\n\n## Yard Sign Checklist\n\n- **Service name** (e.g., "Tree Removal," "HVAC Repair")\n- **Phone number** (large, readable from street)\n- **Town name** (optional but helps local SEO)\n- **QR code** (links to estimate form or reviews)\n- **Trust badge** (licensed, insured, 20 years)\n- **Before/after photo** (if space allows)\n\n## Door Hangers\n\nAfter completing a job, hang door hangers on 20-30 nearby homes.\n\n**Message:**\n"We just completed [service] for your neighbor at [address]. Special offer for [street/neighborhood]."\n\n## Tracking\n\n> Use **unique phone numbers or QR codes** per neighborhood to track which areas convert best.\n\n## Exercise\n\nCreate yard sign and door hanger copy:\n- Yard sign copy (service + phone + trust badge)\n- Door hanger copy (neighbor social proof message)\n- QR landing page URL',
    12,
    '{"downloads": ["Yard Sign Design Template", "Door Hanger Template", "QR Code Setup Guide"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4),
    17,
    'Truck Branding + QR Tracking',
    E'# Trucks Are Moving Billboards\n\nYour trucks are seen by **thousands of people per week**. Make them work for you with clear branding and a CTA.\n\n## Truck Wrap Essentials\n\n- **Company name** (large, readable)\n- **Primary service** (HVAC, Plumbing, Tree Service)\n- **Phone number** (3-4 inch tall minimum)\n- **Town/area served**\n- **Trust badge** (licensed, insured, BBB)\n- **QR code** (optional: links to estimate form)\n- **Before/after photo wrap** (if full wrap)\n\n## QR Code Strategy\n\nAdd a QR code that links to:\n1. Estimate booking form, or\n2. Google review page\n\nUse a unique QR per town or campaign to track conversions.\n\n## Maintenance\n\n> **Keep trucks clean.** A dirty truck with great branding looks unprofessional.\n\n## Exercise\n\nCreate truck branding plan:\n- Truck wrap copy (name, service, phone, trust badge)\n- QR landing page design (estimate or review)\n- Photo of current truck for reference',
    10,
    '{"downloads": ["Truck Wrap Design Guide", "Branding Checklist"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4),
    18,
    'Postcards + Local Link (How to Use Print to Book Jobs)',
    E'# Consistent Frequency Wins\n\nOne postcard doesn''t work. **Consistent postcards (monthly or seasonal)** build familiarity and trust. Frequency beats creativity.\n\n## Postcard Strategy\n\n- **Target:** Choose 1-2 neighborhoods (500-1000 homes)\n- **Frequency:** Monthly or quarterly\n- **Offer:** Seasonal service (spring AC tune-up, fall furnace check, winter tree trimming)\n- **Message:** Problem + solution + trust + CTA\n- **Exclusive:** Mention exclusive Local-Link category or guarantee\n\n## Postcard Template\n\n**Front:**\n- Bold headline (e.g., "Spring AC Special")\n- Photo\n- Offer\n\n**Back:**\n- 3 bullets why choose us\n- Phone number\n- QR code\n- Expiration date\n\n## Using Local-Link Print Services\n\n> Local-Link offers **postcard design + printing + mailing**. Upload your list, choose template, approve proof, and we handle the rest.\n\n## Exercise\n\nCreate postcard offer and copy:\n- Target neighborhood (address list)\n- Seasonal offer (headline + details)\n- Postcard copy (front + back)\n- CTA and expiration date',
    14,
    '{"downloads": ["Postcard Design Templates", "Neighborhood Targeting Guide", "Direct Mail ROI Calculator"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4),
    19,
    'Referral Partners: Property Managers, Realtors, HOAs',
    E'# Partnerships Beat Paid Leads\n\n**One property manager** can send you 5-10 jobs per month. **One realtor** can refer you to every new homeowner. Partnerships create recurring work.\n\n## Best Partners for Trades\n\n- **Property managers** (need reliable trades for rentals)\n- **Realtors** (refer to new homeowners and investors)\n- **HOA boards** (need vendors for community maintenance)\n- **General contractors** (subcontract work)\n- **Insurance agents** (refer for claims work)\n\n## Partner Pitch\n\n**Message:**\n"I''ll make you look good. Fast response, fair pricing, clean work, great communication. Your clients will thank you. Here''s my portfolio: [link]."\n\n## Partner Outreach Scripts\n\n**Email:**\n"Hi [Name], I work with property managers in [town] and wanted to see if you need a reliable [service] vendor."\n\n**Call:** Same message but shorter.\n\n**In-person:** Bring portfolio and business cards.\n\n## Exercise\n\nWrite partner outreach email and call script:\n- Email template to property managers\n- Call script for realtors\n- Portfolio document or link\n- List of 10 partners to contact',
    16,
    '{"downloads": ["Partner Outreach Templates", "Partnership Agreement Template", "Portfolio Builder"]}',
    false
  ),
  (
    (SELECT id FROM course_modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'marketing-for-trades') AND module_index = 4),
    20,
    'Reputation + "Neighbor Proof" Strategy',
    E'# Trades Grow by Social Proof in One Town\n\n**Neighbor proof** = When neighbors see you working locally, they trust you more. This is why focusing on 5-10 towns wins.\n\n## Town Takeover Checklist\n\n- Get **20+ reviews** mentioning the town\n- Complete **50+ jobs** in the town (document with photos)\n- Place **yard signs** after every job\n- Send **postcards** to target neighborhoods\n- Partner with **local realtors and property managers**\n- Sponsor a **local event or sports team**\n- Join **local Facebook groups** (minimal activity)\n- Get listed on **town directories and chambers**\n\n## Social Proof Signals\n\nDisplay:\n- "X jobs completed in [town]"\n- "X years serving [town]"\n- "X happy customers in [town]"\n- "Exclusive [service] provider in [town]" (if applicable)\n\n## Momentum\n\n> Once you **dominate one town**, expansion is easier. Customers in nearby towns see your reputation and trust you faster.\n\n## Exercise\n\nBuild Town Takeover checklist:\n- Choose 1 target town\n- Complete 8-item Town Takeover checklist\n- Current status of each item\n- 30-day action plan',
    18,
    '{"downloads": ["Town Takeover Checklist", "Local Sponsorship Guide", "Social Proof Template"]}',
    false
  );
