# Complete Platform Video Walkthrough Guide

## Overview
LocalLink Marketplace - A comprehensive local business deals platform with merchant tools, CRM, and partner network.

---

# 🛍️ CUSTOMER EXPERIENCE

## Landing Page (/)
**What Users See:**
- Hero section with value proposition
- "Find Local Deals" and "List Your Business" CTAs
- Featured deals carousel
- How it works section (3-step process)
- Benefits grid
- Social proof/testimonials
- Footer with links

**Actions Available:**
- Browse deals without login
- Sign up/Login buttons
- Navigate to business information pages

---

## Registration & Login (/register, /login)
**Registration Page:**
- Email and password fields
- Account type selection (Customer or Merchant)
- Terms acceptance checkbox
- Automatic profile creation on signup
- Redirects to appropriate dashboard based on role

**Login Page:**
- Email/password authentication
- "Forgot Password" link
- Role-based dashboard redirect after login
- Error handling for invalid credentials

---

## Customer Dashboard (/dashboard)
**Main View - Browse Deals (/deals):**
- Grid of available deals from local merchants
- Each deal card shows:
  - Deal image
  - Business name and category
  - Deal title and description
  - Original price (crossed out)
  - Discounted price (highlighted in green)
  - Savings amount and percentage
  - "View Deal" button
  - Favorite heart icon
  - Location/distance info

**Filtering & Search:**
- Search bar for keywords
- Category filter dropdown
- Location/radius filter
- Price range slider
- Sort by: Newest, Popular, Expiring Soon, Highest Savings

**Deal Statistics:**
- Number of deals available
- Active filters badge
- Recently viewed section

---

## Deal Detail Page (/deal/:id)
**Top Section:**
- Large deal image/gallery
- Business logo and name (clickable)
- Deal title (large, bold)
- Star rating and review count
- Category badge

**Pricing Card:**
- Original price (strikethrough)
- Discounted price (large, green)
- Savings amount and percentage
- "Buy Now" button (prominent, green)
- Quantity available indicator
- Expiration date countdown

**Details Tabs:**
1. **Description Tab:**
   - Full deal description
   - What's included
   - Terms and conditions
   - Fine print

2. **Business Info Tab:**
   - Business address with map
   - Hours of operation
   - Phone number (click to call)
   - Website link
   - About the business

3. **Reviews Tab:**
   - Average rating breakdown (5 stars, 4 stars, etc.)
   - Customer reviews with:
     - Reviewer name
     - Star rating
     - Review date
     - Review text
     - Helpful votes
   - "Write a Review" button (if purchased)

**Additional Features:**
- Share deal button (social media)
- Favorite/Save for later
- Report deal button
- Similar deals section at bottom

---

## Checkout Page (/checkout/:id)
**Order Summary:**
- Deal image thumbnail
- Deal title
- Quantity selector (if applicable)
- Price breakdown:
  - Subtotal
  - Tax (calculated)
  - Service fee
  - Total amount (bold)

**Payment Section:**
- Powered by GoPayBright logo
- Payment method selection:
  - Credit/Debit card
  - Digital wallets (if configured)
- Billing information form:
  - Cardholder name
  - Card number
  - Expiration date
  - CVV
  - Billing address

**Order Details:**
- Customer email confirmation
- Purchase terms checkbox
- "Complete Purchase" button (prominent)
- Security badges (SSL, PCI compliant)

**Promo Code:**
- Promo code input field
- "Apply" button
- Discount display when applied

---

## Payment Status Page (/payment/status)
**Processing View:**
- Loading spinner
- "Processing your payment..."
- "Please do not close this window"

**Success View:**
- Green checkmark icon
- "Payment Successful!" message
- Order number
- "View Purchase" button
- "Continue Shopping" button

**Failure View:**
- Red X icon
- "Payment Failed" message
- Error reason
- "Try Again" button
- "Contact Support" link

---

## Purchase Confirmation (/purchase/:id)
**Success Banner:**
- Large green checkmark
- "Purchase Successful!" headline
- Order confirmation number

**Voucher/Deal Details:**
- QR code (for redemption)
- Unique redemption code
- Deal title and description
- Business name and address
- Expiration date
- Redemption instructions

**What's Next Section:**
- How to redeem at business
- Contact information for questions
- Add to calendar button
- Get directions button

**Action Buttons:**
- Download PDF voucher
- Email confirmation
- Print voucher
- View all purchases

**Business Contact Card:**
- Business name
- Phone number
- Address with map link
- Hours of operation
- "Call Now" and "Get Directions" buttons

---

## My Purchases (/purchases)
**Page Header:**
- "My Purchases" title
- Total purchases count
- Search/filter bar

**Filters:**
- Status: All, Active, Redeemed, Expired
- Date range picker
- Business name search

**Purchase List:**
Each purchase card shows:
- Deal thumbnail image
- Deal title
- Business name
- Purchase date
- Amount paid
- Redemption status badge:
  - 🟢 Active (green)
  - 🔵 Redeemed (blue)
  - 🔴 Expired (red)
- QR code icon (click to show)
- "View Details" button
- "Redeem" button (if active)
- "Write Review" button (if redeemed)

**Empty State:**
- "No purchases yet" message
- "Browse Deals" button
- Recommended deals section

**Quick Actions:**
- Download all receipts
- Filter by merchant
- Export purchase history

---

## Favorites Page (/favorites)
**Header:**
- "Saved Deals" title
- Count of saved items
- "Clear All" button

**Grid of Saved Deals:**
- Same card layout as deals page
- Heart icon (filled, clickable to unsave)
- "Expired" badge if deal is no longer active
- Last saved date
- Quick buy button

**Organization:**
- Sort by: Recently Saved, Expiring Soon, Price
- Filter by category
- Search within favorites

**Empty State:**
- "No saved deals yet" illustration
- "Start browsing" button
- Popular deals suggestions

---

## Profile Page (/profile)
**Profile Header:**
- Profile avatar (editable)
- Customer name
- Member since date
- Purchase statistics:
  - Total purchases
  - Total savings
  - Favorite category

**Account Information Section:**
- Email address (verified badge)
- Phone number (optional)
- Location/City
- "Edit Profile" button

**Preferences Tab:**
- Email notifications toggle
- SMS notifications toggle
- Deal categories of interest (checkboxes)
- Preferred location radius
- Language preference

**Payment Methods Tab:**
- Saved payment methods list
- Default payment indicator
- "Add New Card" button
- "Edit" and "Remove" options
- Security information

**Purchase History Tab:**
- Recent purchases summary
- Total spent this month/year
- Most frequent merchant
- Download history button

**Privacy & Security Tab:**
- Change password form
- Two-factor authentication toggle
- Privacy settings
- Account deletion option

**Support Section:**
- FAQ link
- Contact support button
- Help center link

---

# 🏪 MERCHANT EXPERIENCE

## Merchant Dashboard (/merchant/dashboard)

### Dashboard Overview
**Top Stats Row (4 Cards):**
1. **Total Revenue**
   - Current month revenue
   - Percentage change from last month
   - Trending up/down icon
   - Graph icon to view details

2. **Active Deals**
   - Number of live deals
   - Deals pending approval
   - Performance indicator
   - "Create New" quick link

3. **Total Sales**
   - Number of vouchers sold
   - This month vs last month
   - Conversion rate
   - "View All" link

4. **Customer Reviews**
   - Average rating (stars)
   - Number of reviews
   - Recent sentiment (positive/negative)
   - "Manage Reviews" link

**Charts Section:**
1. **Sales Over Time:**
   - Line graph showing last 30 days
   - Revenue vs units sold toggle
   - Date range selector
   - Export data button

2. **Top Performing Deals:**
   - Bar chart of best deals
   - Metrics: Revenue, Units Sold, Views
   - Clickable to view deal details

**Recent Activity Feed:**
- Latest purchases
- New reviews
- Deal status changes
- Payment notifications
- Each item shows:
  - Icon for activity type
  - Description
  - Timestamp
  - Quick action button

**Quick Actions Widget:**
- Create New Deal (large button)
- View Pending Redemptions
- Check Messages
- Run Reports
- Update Business Hours

**Subscription Status Card:**
- Current tier (Starter/Pro/Premium)
- Features included
- Usage metrics (deals limit, etc.)
- "Upgrade" button if applicable
- Renewal date

**Tips & Resources:**
- Getting started checklist
- Video tutorials
- Best practices articles
- Success stories
- Community forum link

---

## Left Navigation Menu

### 📊 Deals & Sales

#### My Deals (/merchant/deals)
**Page Layout:**
- "Create New Deal" button (top right, prominent)
- Search and filter bar
- View toggle: Grid/List

**Filters:**
- Status: All, Draft, Active, Paused, Expired, Pending Approval
- Category dropdown
- Date range
- Performance metrics filter

**Deal Cards/Rows Show:**
- Deal image thumbnail
- Title and description preview
- Status badge (color-coded)
- Original price / Sale price
- Total sold / Remaining quantity
- Revenue generated
- Active dates (start/end)
- Performance metrics:
  - Views count
  - Conversion rate
  - Average rating
- Action buttons:
  - Edit
  - Pause/Resume
  - Duplicate
  - Archive
  - View Analytics

**Bulk Actions:**
- Select multiple deals
- Pause/Resume selected
- Delete selected
- Export selected

**Empty State:**
- "Create your first deal" CTA
- Video tutorial embed
- Deal creation tips

---

#### Create Deal (/merchant/deals/new)
**Step 1 - Basic Information:**
- Deal title input
  - Character counter
  - **"AI Assist" button** - Generates catchy titles
- Deal description textarea
  - Rich text editor
  - **"AI Assist" button** - Generates compelling copy
  - Formatting toolbar (bold, italic, lists)
- Category selection (dropdown with icons)
- Deal image upload:
  - Drag and drop
  - Max size indicator
  - Image preview
  - Crop/resize tools
- Additional images gallery (up to 5)

**Step 2 - Pricing:**
- Original price input
- Discounted price input
- Savings calculation (auto-calculated, shown in green)
- Discount percentage (auto-calculated)
- **"Optimize Price" AI button** - Suggests optimal pricing
- Quantity available
- Purchase limits per customer

**Step 3 - Terms & Conditions:**
- Expiration date picker
- Valid days of week (checkbox grid)
- Valid hours (time range)
- Redemption instructions (textarea)
- Terms and conditions (textarea)
- Exclusions or restrictions
- Refund policy selection

**Step 4 - Preview:**
- Preview of customer-facing deal card
- All details review
- "Save as Draft" button
- "Submit for Approval" button

**AI Features (Inline):**
When clicking "AI Assist":
- Modal appears with loading state
- AI generates suggestions based on:
  - Business type
  - Category
  - Price point
  - Target audience
- User can:
  - Accept suggestion
  - Regenerate
  - Edit and use
  - Cancel

---

#### Redemptions (/merchant/redemptions)
**Page Features:**
- Real-time redemption feed
- Search by customer name/code
- Filter by date, status, deal

**Redemption List:**
Each redemption shows:
- Customer name (optional photo)
- Deal title
- Purchase date
- Redemption code (QR code icon)
- Status:
  - ⏳ Pending (yellow)
  - ✅ Redeemed (green)
  - ❌ Expired (red)
  - 🔴 Flagged (red - suspicious)
- Action buttons:
  - "Verify Code" - opens QR scanner
  - "Mark as Redeemed"
  - "View Details"
  - "Contact Customer"

**QR Code Scanner:**
- Camera access for scanning
- Manual code entry option
- Instant validation
- Success/error feedback
- Automatic status update

**Statistics Panel:**
- Today's redemptions
- This week's redemptions
- Pending redemptions
- Redemption rate

**Export Options:**
- Download CSV
- Print list
- Email summary

---

### 👥 Customer Management

#### CRM Dashboard (/merchant/crm-dashboard)
**Overview Stats:**
- Total customers
- New customers this month
- Customer retention rate
- Average customer value
- Repeat purchase rate

**Customer Segments Pie Chart:**
- New customers
- Repeat customers
- VIP customers (high spenders)
- At-risk customers (inactive)

**Recent Customers List:**
- Name and contact info
- Last purchase date
- Total purchases count
- Total spent amount
- Customer since date
- Tags/labels
- Quick actions (email, call, view profile)

**Customer Lifecycle View:**
- New → Active → Loyal → At Risk visualization
- Number in each stage
- Click to see customers in stage

---

#### CRM Full System (/merchant/crm)
**Customer Table Columns:**
- Checkbox (bulk select)
- Customer name and avatar
- Email address
- Phone number
- Total purchases
- Total spent
- Last purchase date
- Status (Active/Inactive)
- Tags
- Actions (view/edit/message)

**Advanced Filters:**
- Purchase frequency (1-time, repeat, VIP)
- Spending range slider
- Last purchase date range
- Tags filter
- Location/city
- Deal categories purchased
- Custom field filters

**Customer Detail View (Click Row):**
Opens side panel with:
- Contact information
- Purchase history timeline
- Total lifetime value
- Average order value
- Favorite deal categories
- Communication history
- Notes section (add internal notes)
- Task assignments
- Custom fields
- Related customers (referrals)

**Bulk Actions:**
- Send email campaign to selected
- Add tags
- Export contacts
- Create customer segment
- Delete customers

**Top Bar Actions:**
- Import customers (CSV upload)
- Export all data
- Create new customer
- Sync with external tools

---

#### CRM Marketplace (/merchant/crm-marketplace)
**Subscription Tiers Display:**

**Starter Plan - $69/month:**
- Up to 1,000 contacts
- Basic email campaigns
- Contact segmentation
- Purchase tracking
- Basic reporting
- Mobile app access
- Email support
- "Choose Plan" button

**Professional Plan - $159/month:**
- Up to 10,000 contacts
- Advanced email automation
- SMS campaigns (500/month)
- AI-powered insights
- Advanced segmentation
- Custom fields (unlimited)
- API access
- Priority support
- Marketing automation
- "Most Popular" badge
- "Choose Plan" button

**Enterprise Plan - $299/month:**
- Unlimited contacts
- Everything in Pro
- SMS campaigns (2,500/month)
- Multi-location support
- Advanced AI features
- White-label options
- Dedicated account manager
- Custom integrations
- Advanced analytics & reporting
- "Choose Plan" button

**Feature Comparison Table:**
- Side-by-side feature comparison
- Check marks for included features
- Highlighted differences
- "See all features" expandable

**Add-ons Section:**
- Extra SMS credits
- Additional team members
- Premium templates
- Advanced analytics
- Prices shown per add-on

**FAQ Section:**
- Common CRM questions
- Pricing questions
- Migration help
- Cancellation policy

---

#### Leads (/merchant/leads)
**Lead Capture Sources:**
- Website form submissions
- Deal inquiry forms
- Email signups
- Social media
- Manual entry
- Import from file

**Lead List View:**
Each lead shows:
- Lead name and company
- Contact information (email, phone)
- Lead source icon
- Lead score (hot/warm/cold)
- Status: New, Contacted, Qualified, Converted, Lost
- Assigned to (team member)
- Created date
- Last activity
- Next follow-up date
- Action buttons:
  - Call
  - Email
  - Schedule meeting
  - Convert to customer
  - Archive

**Lead Detail Panel:**
- Contact information form
- Lead score calculation
- Activity timeline
- Email history
- Call logs
- Notes section
- Attached files
- Deal value estimate
- Conversion probability

**Lead Board View (Kanban):**
- Columns: New → Contacted → Qualified → Proposal → Won/Lost
- Drag and drop leads between stages
- Count and total value per column
- Filter and search within board

**Lead Scoring:**
- Automatic scoring based on:
  - Engagement level
  - Budget indicators
  - Timeline urgency
  - Company size
  - Industry match
- Manual score adjustment
- Score change history

---

### 📧 Marketing & Communication

#### Marketing Campaigns (/merchant/marketing)
**Campaign Dashboard:**
- Active campaigns count
- Total reach this month
- Open rate average
- Click-through rate
- Revenue attributed to campaigns

**Campaign List:**
Each campaign shows:
- Campaign name
- Type (Email/SMS/Push)
- Status (Draft/Scheduled/Sent/Active)
- Recipients count
- Sent date/time
- Performance metrics:
  - Delivery rate
  - Open rate
  - Click rate
  - Conversion rate
  - Revenue generated
- Actions: Edit, Duplicate, Archive, View Report

**Create Campaign Button → Opens Wizard:**

**Step 1 - Campaign Type:**
- Email campaign
- SMS campaign
- Push notification
- Multi-channel campaign

**Step 2 - Audience Selection:**
- All customers
- Select segments
- Custom filter builder:
  - Purchase history
  - Location
  - Customer value
  - Last activity
  - Tags
- Estimated reach count
- Test audience option

**Step 3 - Message Creation:**

For Email:
- Subject line (with preview)
- Preview text
- Template selection (gallery view):
  - Welcome email
  - Deal announcement
  - Newsletter
  - Re-engagement
  - Custom HTML
- Drag-and-drop editor:
  - Text blocks
  - Images
  - Buttons
  - Deal cards
  - Social links
  - Footer
- Personalization tags: {{customer_name}}, {{deal_name}}, etc.
- AI content suggestions
- Mobile preview toggle
- Send test email

For SMS:
- Message text (160 char counter)
- Personalization tokens
- Link shortening
- Opt-out text
- Send test SMS

**Step 4 - Scheduling:**
- Send immediately
- Schedule for date/time
- Recurring campaign setup
- Time zone consideration
- Batch sending options

**Step 5 - Review & Send:**
- Preview of message
- Audience summary
- Cost estimate (for SMS)
- Confirmation checkbox
- "Send Campaign" button

**Campaign Analytics (Click Report):**
- Overview metrics
- Opens over time graph
- Click map (what links clicked)
- Device breakdown
- Location map
- Unsubscribe rate
- Spam complaints
- Conversion tracking
- Revenue attribution
- Export report

---

#### Reviews Management (/merchant/reviews)
**Overview Stats:**
- Average rating (large, prominent)
- Total reviews count
- Rating distribution bar chart (5⭐ to 1⭐)
- Recent rating trend (up/down)
- Response rate

**Review Feed:**
Each review shows:
- Customer name and photo
- Star rating (1-5 stars)
- Review text
- Review date
- Deal purchased
- Verified purchase badge
- Helpful count
- Your response (if responded)
- Status: New, Responded, Flagged
- Action buttons:
  - Respond
  - Thank customer
  - Report/Flag
  - Share (if positive)

**Response Editor:**
- Text area for reply
- Character counter
- Template responses:
  - Thank you for positive review
  - Apology for negative review
  - Request for more details
  - Resolution offer
- Save as template option
- "Post Response" button

**Filters:**
- Rating filter (all, 5⭐, 4⭐, etc.)
- Date range
- Responded/Not responded
- Deals filter
- Keyword search

**Review Requests:**
- Send review request to customers
- Automatic reminders after redemption
- Email template customization
- Timing settings (days after purchase)

**Review Insights:**
- Common keywords in reviews
- Sentiment analysis (AI-powered)
- Trending topics
- Areas for improvement

---

### 📋 Invoicing & Payments

#### Invoicing Dashboard (/merchant/invoices)
**Overview Cards:**
- Total invoiced this month
- Outstanding balance
- Paid invoices count
- Overdue invoices count

**Invoice List Table:**
Columns:
- Invoice # (clickable)
- Customer name
- Issue date
- Due date
- Amount
- Amount paid
- Balance due
- Status badge:
  - 📝 Draft (gray)
  - 📧 Sent (blue)
  - ✅ Paid (green)
  - ⏰ Overdue (red)
  - ⚠️ Partial (orange)
- Actions dropdown:
  - View/Edit
  - Send to customer
  - Record payment
  - Download PDF
  - Duplicate
  - Void
  - Delete

**Filters & Search:**
- Status filter
- Date range picker
- Customer search
- Amount range
- Sort by: Date, Amount, Status

**Top Actions:**
- "New Invoice" button (prominent, green)
- Import invoices
- Export to CSV
- Print list

**Invoice Detail View (Click Row):**
Opens full invoice with:
- Invoice header (logo, invoice #, date)
- Bill To (customer info)
- Bill From (your business)
- Line items table
- Subtotal, tax, total
- Payment terms
- Notes
- Payment history log
- Action buttons:
  - Edit
  - Send
  - Record Payment
  - Download PDF
  - Print

**Payment Settings Link:**
- Connect GoPayBright account
- Payment methods accepted
- Default terms (Net 30, etc.)
- Late fee settings
- Invoice template customization

---

#### Create Invoice (/merchant/invoices/new)
**Customer Section:**
- Customer name (required)
  - Searchable dropdown of existing customers
  - Or enter new customer
- Customer email (optional but recommended)
  - For sending invoice

**Invoice Details:**
- Invoice date (auto-filled, editable)
- Due date (auto-calculated as +30 days, editable)
- Invoice number (auto-generated, editable)
- Purchase order # (optional)

**Line Items Section:**
Editable table with:
- Description column (text input)
- Quantity column (number)
- Rate column (price per unit)
- Amount column (auto-calculated: qty × rate)
- Delete icon (trash can)

**Add Line Item Button:**
- Adds new row to table
- Can add unlimited items
- Must have at least 1 item

**Calculations (Right Side):**
- Subtotal (sum of all line items)
- Tax rate input (% field)
- Tax amount (auto-calculated)
- **Total** (bold, large, green)

**Additional Info:**
- Notes field (textarea)
  - Internal notes or customer messages
- Terms field (pre-filled)
  - "Payment due within 30 days"
  - Editable

**Actions:**
- "Create Invoice" button (primary)
  - Saves to database
  - Redirects to invoice list
- "Cancel" button
  - Returns to invoice list
  - Doesn't save

**After Creation:**
- Success message
- Option to:
  - Send to customer immediately
  - Download PDF
  - Create another
  - View invoice

**Payment Link:**
- Automatically generated when invoice created
- Secure GoPayBright checkout
- Customer can pay by card
- Payment status updates automatically

---

### 💳 Subscription & Services

#### Loyalty Program (/merchant/loyalty)
**Program Overview:**
- Current loyalty members
- Active loyalty campaigns
- Points issued this month
- Redemptions this month

**Program Types:**
1. **Points-Based:**
   - Points per dollar spent
   - Redemption rate
   - Point expiration rules
   - Member dashboard access

2. **Stamp Card:**
   - Number of stamps required
   - Reward description
   - Digital card template
   - Scan to stamp feature

3. **Tiered Membership:**
   - Bronze/Silver/Gold levels
   - Benefits per tier
   - Upgrade criteria
   - Tier badges

**Create Loyalty Program:**
- Program name
- Type selection
- Rules configuration
- Reward definition
- Terms and conditions
- Launch date

**Member Management:**
- List of loyalty members
- Points balance
- Tier status
- Activity history
- Manual point adjustment
- Send rewards

**Loyalty Analytics:**
- Enrollment rate
- Active vs inactive members
- Redemption rate
- Member lifetime value
- Engagement metrics

---

#### Postcards (/merchant/postcards)
**Direct Mail Marketing Tool:**

**Campaign Dashboard:**
- Campaigns sent
- Total postcards mailed
- Estimated delivery dates
- Response rate tracking

**Create Postcard Campaign:**

**Step 1 - Design:**
- Template gallery:
  - Grand opening
  - New deal announcement
  - Holiday special
  - Thank you card
  - Re-engagement
  - Custom design
- Front design editor:
  - Upload image
  - Add headline
  - Business logo
  - Decorative elements
- Back design editor:
  - Message area
  - Deal details
  - QR code inclusion
  - Call to action
  - Contact info

**Step 2 - Audience:**
- Import mailing list (CSV)
- Select from CRM contacts
- Geographic targeting:
  - Radius around business
  - Zip codes
  - Neighborhoods
- Demographic filters
- Estimated recipients count

**Step 3 - Review & Order:**
- Design preview (front and back)
- Recipient count
- Price per postcard
- Total cost
- Estimated delivery: 5-7 business days
- "Place Order" button

**Checkout (/merchant/postcards/checkout):**
- Order summary
- Payment method selection
- Billing address
- Promo code field
- Total with breakdown
- "Complete Order" button

**Confirmation (/merchant/postcards/confirmation):**
- Order confirmation #
- Estimated ship date
- Estimated delivery window
- Track order button
- Download recipient list
- Create another campaign

**Past Campaigns:**
- List of sent campaigns
- Preview images
- Recipients count
- Delivery status
- Response tracking
- ROI calculation
- Reorder button

---

#### Printing Services (/merchant/printing)
**Print Product Categories:**

**1. Business Cards:**
- Standard (3.5" × 2")
- Spot UV
- Foil stamping
- Rounded corners
- Pricing: $X for 500, $Y for 1000

**2. Flyers:**
- Sizes: 5.5"×8.5", 8.5"×11", 11"×17"
- Single or double-sided
- Glossy or matte finish
- Bulk pricing

**3. Brochures:**
- Bi-fold, Tri-fold
- Multiple paper weights
- Full color
- Pricing per quantity

**4. Banners:**
- Vinyl banners
- Custom sizes
- Grommets included
- Indoor/outdoor options

**5. Yard Signs:**
- 18"×24", 24"×36"
- Corrugated plastic
- H-stakes included
- Weather resistant

**6. Door Hangers:**
- Die-cut designs
- Full color
- Perforation option
- Distribution service available

**7. Promotional Swag:**
- Branded t-shirts
- Hats
- Pens
- Tote bags
- Mugs
- Custom items

**Product Selection:**
- Click product category card
- Opens configuration:
  - Quantity selector
  - Size/options dropdowns
  - Paper/material choice
  - Turnaround time
  - Price updates in real-time
  - "Add to Cart" button

**Design Options:**
- Upload your design (PDF, PNG, JPG)
- Use design templates
- Order design service:
  - Professional designer
  - 2 revision rounds
  - $99-$299 depending on complexity

**Design Service Page (/merchant/printing/design-service):**
- Design service options:
  - Basic: $99 (business cards, simple flyers)
  - Standard: $199 (brochures, complex layouts)
  - Premium: $299 (custom illustrations, full branding)
- What's included per tier
- Turnaround time: 3-5 business days
- Portfolio examples
- "Order Design" button

**Design Service Checkout (/merchant/printing/design-service/checkout):**
- Service tier selected
- Design brief form:
  - What you need designed
  - Brand colors
  - Design preferences
  - Inspiration links
  - File uploads
- Contact preferences
- Payment
- "Submit Order" button

**Design Service Confirmation (/merchant/printing/design-service/confirmation):**
- Order confirmed
- Designer will contact you within 24 hours
- Project timeline
- What to expect next
- Upload additional assets link

**Shopping Cart:**
- Items added
- Quantity adjustments
- Remove items
- Apply promo code
- Subtotal
- Shipping cost (if applicable)
- Tax
- Total
- "Proceed to Checkout" button

**Print Order Checkout:**
- Review items
- Shipping address
- Shipping method:
  - Standard (5-7 days)
  - Expedited (2-3 days)
  - Rush (next day - extra fee)
- Payment information
- Order notes
- "Place Order" button

**Order Confirmation:**
- Order # and receipt
- Estimated production time
- Estimated ship date
- Track order link
- Contact for changes

**Order History:**
- Past print orders
- Status tracking
- Reorder button
- Download invoice

---

#### Websites (/merchant/websites)
**Website Builder Service:**

**Overview:**
- "Get a Professional Website" headline
- Benefits of having a website
- Pricing: Starting at $299 one-time setup + $29/month hosting

**Website Templates Gallery:**
Browse by industry:
- Restaurants
- Retail shops
- Professional services
- Home services
- Health & wellness
- Automotive
- Beauty & spa

**Template Features:**
- Responsive design (mobile-friendly)
- SEO optimized
- Contact forms
- Google Maps integration
- Social media links
- Online booking integration
- Deal showcase
- Photo galleries
- Testimonials section
- Blog capabilities

**Template Preview:**
- Click template to see full preview
- Desktop/mobile view toggle
- Live demo link
- "Choose This Template" button

**Website Order Process:**

**Step 1 - Template Selection:**
- Choose template
- Select industry

**Step 2 - Customization:**
- Business name
- Business description
- Color scheme preferences
- Logo upload
- Content requirements
- Special features needed:
  - E-commerce
  - Appointment booking
  - Menu/catalog
  - Payment processing
  - Blog

**Step 3 - Domain:**
- Use existing domain
- Register new domain (+$15/year)
- Use free subdomain (yourbusiness.locallink.com)

**Step 4 - Hosting Plan:**
- Basic: $29/month
  - 1 website
  - 10GB storage
  - Free SSL
  - Basic support
- Professional: $59/month
  - 1 website
  - 50GB storage
  - Free SSL
  - Priority support
  - SEO tools
  - Analytics

**Step 5 - Review & Order:**
- Setup cost: $299
- First month hosting
- Domain cost (if applicable)
- Total
- Timeline: Website ready in 7-10 days
- "Place Order" button

**Website Management (After Launch):**
- Edit content (CMS access)
- Update images
- Add pages
- View analytics
- SEO settings
- Form submissions
- Support tickets

---

#### Merchant Services Application (/merchant/merchant-services/application)
**Payment Processing Application:**

**Why Apply:**
- Accept credit cards in-store
- Lower processing fees
- Next-day funding
- POS equipment options
- Fraud protection

**Application Form Sections:**

**1. Business Information:**
- Legal business name
- DBA (Doing Business As)
- Business type (LLC, Corp, Sole Prop, etc.)
- Tax ID / EIN
- Business address
- Years in business
- Website URL
- Business phone

**2. Owner Information:**
- Full name
- SSN (encrypted)
- Date of birth
- Home address
- Ownership percentage
- Driver's license upload

**3. Banking Information:**
- Bank name
- Routing number
- Account number
- Account type (checking/savings)
- Bank statement upload

**4. Processing Information:**
- Average monthly sales volume
- Average transaction amount
- Highest transaction amount
- Products/services sold
- Processing history
- Current processor (if switching)

**5. Business Documents Upload:**
- Voided check
- Government-issued ID
- Business license
- Articles of incorporation (if applicable)

**6. Terms & Conditions:**
- Processing agreement
- Pricing terms
- ACH authorization
- Electronic signature

**Submit Application Button**

**After Submission:**
- Application received confirmation
- Review timeline: 1-3 business days
- Status tracking dashboard
- Next steps information

**Application Status Page:**
- Status badge:
  - Under Review
  - Approved
  - More Info Needed
  - Declined
- Processing timeline
- Contact underwriting team
- Upload additional documents

---

### 💰 Business Growth

#### Business Capital (/merchant/capital)
**Working Capital Loans:**

**Hero Section:**
- "Grow Your Business with Capital"
- "Get up to $50,000"
- "Fast approval, flexible terms"

**How It Works:**
1. Apply in minutes
2. Get approved in 24 hours
3. Receive funds in 2-3 days
4. Repay with a % of daily sales

**Loan Calculator:**
- Amount slider ($1,000 - $50,000)
- Term selector (3, 6, 12 months)
- Estimated monthly payment
- Total repayment amount
- Factor rate display
- "Check Eligibility" button

**Benefits:**
- No collateral required
- No personal guarantee
- Flexible repayment
- Fast funding
- No hidden fees

**Application Form:**

**Business Performance:**
- Monthly revenue
- Time in business
- Business bank account statements (upload)
- Revenue documentation

**Use of Funds:**
- Inventory
- Equipment
- Marketing
- Hiring
- Expansion
- Working capital

**Business & Owner Details:**
- Business info (pre-filled from profile)
- Owner info (pre-filled)
- Bank connection (Plaid integration):
  - Connect bank account securely
  - Automatic verification
  - Or manual upload

**Submit Application:**
- Review terms
- Electronic signature
- "Submit for Review"

**Capital Dashboard:**
- Current loans
- Payment history
- Available offers
- Next payment due
- Payoff amount
- Transaction history

---

#### Recruiting (/merchant/recruiting)
**Hiring Tools & Services:**

**Job Board Integration:**
- Post to LocalLink Jobs Network
- Indeed integration
- Monster integration
- Social media sharing

**Services Available:**

**1. Job Post Templates - $29:**
- Industry-specific templates
- SEO-optimized
- Required qualifications section
- Benefits section
- Application instructions
- 30+ templates available

**Template Gallery:**
- Search by position type
- Preview templates
- Customize before checkout
- "Buy Template" button

**Checkout (/merchant/recruiting/job-templates-checkout):**
- Template selected
- Customization form:
  - Job title
  - Company name
  - Location
  - Salary range
- Payment
- "Complete Purchase"

**Confirmation (/merchant/recruiting/job-templates-confirmation):**
- Download template (Word/PDF)
- Email copy
- Post to job boards link
- Buy more templates

**2. Resume Review Service - $49:**
- Professional recruiter reviews candidate resumes
- Ranked by fit
- Detailed assessment
- 48-hour turnaround

**How It Works:**
- Upload job description
- Upload candidate resumes (up to 20)
- Get ranked results with notes
- Schedule interviews with top candidates

**Checkout (/merchant/recruiting/resume-writing-checkout):**
- Service details
- Upload job description
- Upload resumes (drag-and-drop, multiple files)
- Special instructions
- Payment
- "Submit Order"

**Confirmation (/merchant/recruiting/resume-writing-confirmation):**
- Order received
- Results delivered in 48 hours
- Email notification when ready
- Track order status

**3. Hiring Funnel Setup - $199:**
- Custom application page
- Automated screening questions
- Email automation
- Applicant tracking
- Interview scheduling
- One-time setup fee

**What's Included:**
- Branded career page
- Application form builder
- Automated responses
- Candidate pipeline
- Team collaboration tools
- Interview schedule integration
- Offer letter templates

**Checkout (/merchant/recruiting/hiring-funnel-checkout):**
- Service overview
- Setup questionnaire:
  - Company size
  - Hiring frequency
  - Positions hiring for
  - Current hiring process
  - Pain points
- Payment
- "Get Started"

**Confirmation (/merchant/recruiting/hiring-funnel-confirmation):**
- Setup call scheduled
- Onboarding checklist
- Timeline: 7-10 days
- Access credentials email
- Support contact

**Applicant Tracking:**
- All applications in one place
- Filter by position
- Status tracking (Applied → Screening → Interview → Offer → Hired)
- Notes and ratings
- Team collaboration
- Email templates

---

#### Appointment Setting (/merchant/appointment-setting or /merchant/services/appointment-setting)
**Appointment Booking System:**

**Service Overview:**
- Professional appointment booking
- Calendar synchronization
- Automated reminders
- No-show reduction
- Starting at $49/month

**Features:**
- Online booking widget for website
- Calendar integrations (Google, Outlook)
- SMS/email reminders
- Customer self-scheduling
- Buffer time between appointments
- Team member scheduling
- Service duration settings
- Custom availability rules

**Pricing Tiers:**

**Basic - $49/month:**
- 1 calendar
- Unlimited appointments
- Email reminders
- Basic customization

**Pro - $99/month:**
- 3 calendars (team members)
- SMS + email reminders
- Custom branding
- Payment collection
- Advanced availability rules

**Enterprise - $199/month:**
- Unlimited calendars
- Multi-location support
- Advanced integrations
- Priority support
- Analytics & reporting

**Setup Process (/merchant/services/appointment-setting):**
- Service tier selection
- "Get Started" button

**Checkout (/merchant/services/appointment-setting/checkout):**
- Tier selected
- Monthly price
- Initial setup form:
  - Business hours
  - Service types offered
  - Duration per service
  - Team members
- Payment method
- First month payment
- "Subscribe" button

**Confirmation (/merchant/services/appointment-setting/confirmation):**
- Subscription active
- Setup wizard link
- Embed code for website
- Calendar sync instructions
- Training video
- Support contacts

**Appointment Dashboard:**
- Today's appointments
- Upcoming appointments (calendar view)
- Past appointments
- No-shows tracking
- Customer management
- Automated messages

**Calendar View:**
- Day/Week/Month views
- Drag-and-drop rescheduling
- Color coding by service type
- Availability blocks
- Sync with personal calendar

---

### 📊 Analytics & Reporting

#### Analytics (/merchant/analytics)
**Dashboard Overview:**

**Date Range Selector:**
- Last 7 days
- Last 30 days
- Last 90 days
- This month
- Last month
- Custom range

**Key Metrics Cards:**
1. Total Revenue
2. Total Orders
3. Average Order Value
4. Conversion Rate

**Charts & Graphs:**

**1. Revenue Trends:**
- Line graph showing daily revenue
- Compare to previous period
- Toggle: Revenue vs Units
- Export data

**2. Sales by Deal:**
- Bar chart showing top performing deals
- Revenue per deal
- Units sold per deal
- Clickable to drill down

**3. Customer Acquisition:**
- New vs returning customers
- Customer lifetime value trend
- Retention rate

**4. Traffic & Engagement:**
- Deal page views
- View-to-purchase conversion
- Average time on page
- Bounce rate

**5. Geographic Performance:**
- Map showing sales by location
- Top cities/zip codes
- Distance from business

**6. Time Analysis:**
- Sales by day of week
- Sales by hour of day
- Peak selling times
- Best days for deals

**7. Marketing Attribution:**
- Sales by source:
  - Direct
  - Email campaign
  - Social media
  - Referral
  - Organic search
- ROI by channel

**8. Deal Performance Table:**
Columns:
- Deal name
- Views
- Purchases
- Conversion rate
- Revenue
- Average rating
- Status
- Actions (view details)

**Custom Reports:**
- Report builder tool
- Select metrics
- Choose date range
- Apply filters
- Save report template
- Schedule email delivery

**Export Options:**
- Export to CSV
- Export to Excel
- Export to PDF
- Schedule automated reports
- Email to team members

**Insights Panel:**
- AI-powered insights:
  - "Your best day is Friday"
  - "Conversion rate increased 15%"
  - "Recommended: Create more dinner deals"
  - Trend alerts
  - Anomaly detection

---

### ⚙️ Settings & Support

#### Settings (/merchant/settings)
**Navigation Tabs:**

**1. Business Profile:**
- Business name (editable)
- Legal business name
- Business type/category
- Description (shows on deals)
- Logo upload (square, min 500px)
- Cover image upload
- Address (Google Maps autocomplete)
- Phone number (click-to-call format)
- Email address
- Website URL
- Social media links:
  - Facebook
  - Instagram
  - Twitter
  - LinkedIn
- Business hours editor:
  - Days of week
  - Open/close times
  - Closed days
  - Holiday hours
- "Save Changes" button

**2. Notifications:**
- Email Notifications (toggle each):
  - New purchase
  - New review
  - Deal approved/rejected
  - Low inventory alert
  - Payment received
  - Refund processed
  - Weekly summary
  - Monthly reports
- SMS Notifications:
  - Critical alerts only
  - All notifications
  - Off
- Push Notifications (mobile app)
- Notification frequency:
  - Real-time
  - Daily digest
  - Weekly digest

**3. Payment Settings (/merchant/payment-settings):**
- Connected Payment Methods:
  - GoPayBright status (Connected/Not Connected)
  - "Configure GoPayBright" button
  - Account status
  - Payout schedule (daily, weekly)
  - Next payout date
  - Available balance

- Bank Account Information:
  - Bank name
  - Last 4 digits of account
  - Routing number
  - "Update Bank Account"

- Payout Settings:
  - Automatic payouts toggle
  - Payout frequency
  - Minimum payout amount
  - Payout method

- Fee Structure Display:
  - Platform fee percentage
  - Processing fee percentage
  - Per-transaction fee
  - Monthly subscription cost

**4. Team Management:**
- Team members list:
  - Name and email
  - Role (Owner, Manager, Staff)
  - Permissions
  - Status (Active/Pending/Suspended)
  - Last login
  - Actions (edit, remove)

- "Invite Team Member" button:
  - Email input
  - Role selection:
    - Owner (full access)
    - Manager (all except billing)
    - Staff (deals, redemptions only)
  - Custom permissions checklist:
    - Create deals
    - Edit deals
    - View analytics
    - Manage customers
    - Process refunds
    - Access settings
  - Send invite

- Permission Templates:
  - Preset role permissions
  - Customize as needed

**5. Subscription & Billing:**
- Current plan display:
  - Plan name
  - Monthly cost
  - Features included
  - Usage limits:
    - Active deals (X of Y)
    - Team members (X of Y)
  - Next billing date
  - "Upgrade Plan" button
  - "Cancel Subscription" link

- Billing history:
  - Invoice date
  - Description
  - Amount
  - Status
  - Download PDF

- Payment method:
  - Card ending in XXXX
  - Expiration date
  - "Update Payment Method"

- Invoices:
  - Download past invoices
  - Tax documents

**6. Account Security:**
- Change password form:
  - Current password
  - New password
  - Confirm password
  - Password strength indicator

- Two-factor authentication:
  - Enable 2FA toggle
  - Setup via SMS or authenticator app
  - Backup codes

- Login history:
  - Date/time
  - IP address
  - Location
  - Device/browser
  - "Not you?" report link

- Active sessions:
  - Current session
  - Other sessions
  - "Log out all devices" button

**7. API & Integrations:**
- API key generation
- Webhook configuration
- Third-party integrations:
  - Zapier
  - Mailchimp
  - QuickBooks
  - Stripe
  - Square
- OAuth apps authorized
- Developer documentation link

**8. Data & Privacy:**
- Download my data:
  - Customers
  - Deals
  - Purchases
  - Analytics
  - All data (complete export)

- Delete account:
  - Warning message
  - Data retention policy
  - Confirmation required
  - "Permanently Delete Account" (red button)

---

#### Support (/merchant/support)
**Support Dashboard:**

**Quick Actions:**
- "Submit a Ticket" (prominent button)
- "Live Chat" (if available)
- "Call Support" (business hours shown)
- "Email Support"

**Help Categories:**
1. **Getting Started:**
   - Account setup
   - Creating your first deal
   - Setting up payments
   - Video tutorials

2. **Deal Management:**
   - Deal creation best practices
   - Pricing strategies
   - Deal approval process
   - Managing inventory

3. **Payments & Billing:**
   - Understanding fees
   - Payout schedule
   - Refund process
   - Tax information

4. **Customer Management:**
   - CRM tutorials
   - Email campaigns
   - Review management
   - Loyalty programs

5. **Technical Issues:**
   - Login problems
   - Payment errors
   - Website issues
   - App troubleshooting

**FAQ Accordion:**
- Common questions expanded/collapsed
- Search functionality
- "Was this helpful?" feedback
- "Contact Support" if not resolved

**Submit a Ticket:**
- Subject line
- Category dropdown:
  - Technical issue
  - Billing question
  - Feature request
  - Report a bug
  - Other
- Priority:
  - Low
  - Normal
  - High
  - Urgent
- Description (rich text)
- Attach files (screenshots, etc.)
- "Submit Ticket" button

**Ticket History:**
- List of past tickets
- Ticket #
- Subject
- Status: Open, In Progress, Resolved, Closed
- Last updated
- Assigned to
- Click to view conversation

**Ticket Detail View:**
- Full ticket thread
- Add reply
- Upload additional files
- Close ticket
- Reopen ticket
- Satisfaction rating (after resolution)

**Knowledge Base:**
- Searchable articles
- Video tutorials
- Step-by-step guides
- Best practices
- Case studies
- Community forum link

**System Status:**
- All systems operational (green)
- Or current issues/maintenance
- Subscribe to status updates

**Contact Information:**
- Support email
- Phone number (business hours)
- Live chat hours
- Response time expectations
  - Email: 24 hours
  - Chat: Immediate
  - Phone: Immediate (during hours)

---

### 💼 Additional Merchant Features

#### Upgrade Page (/merchant/upgrade)
**Current Plan Display:**
- Your current tier
- Features you have
- Usage statistics
- "Change Plan" button

**Tier Comparison Table:**

**Starter - $79/month:**
- 5 active deals
- Basic analytics
- Email support
- Payment processing
- Customer database
- Deal templates
- "Current Plan" or "Choose Plan"

**Professional - $159/month:**
- 25 active deals
- Advanced analytics
- CRM included
- Priority support
- Email marketing
- Review management
- API access
- "Most Popular" badge
- "Choose Plan"

**Premium - $299/month:**
- Unlimited deals
- Advanced AI features
- White-label options
- Dedicated account manager
- Custom integrations
- Multi-location support
- Advanced reporting
- "Choose Plan"

**Upgrade Flow:**
- Select new tier
- Shows prorated amount
- Immediate upgrade
- Downgrade at end of period

**Tier Upgrade Checkout (/merchant/tier-upgrade/checkout):**
- New plan summary
- Prorated charge calculation
- Next billing date
- Payment method
- "Confirm Upgrade" button

**Tier Upgrade Success (/merchant/tier-upgrade/success):**
- Congratulations message
- New features unlocked
- What's changed
- Next steps
- "Go to Dashboard"

---

#### Addons Marketplace (/merchant/addons)
**Available Addons:**

**1. Advanced Analytics - $29/month:**
- Custom reports
- Competitor insights
- Predictive analytics
- Data export

**2. SMS Marketing - $49/month:**
- 500 SMS per month
- Campaign builder
- Auto-responses
- Opt-in management

**3. Multi-Location - $99/month:**
- Manage multiple locations
- Centralized dashboard
- Location-specific deals
- Consolidated reporting

**4. White Label - $199/month:**
- Remove LocalLink branding
- Custom domain
- Your logo everywhere
- Custom emails

**5. API Access - $49/month:**
- REST API
- Webhooks
- Documentation
- Developer support

**Each Addon Card:**
- Feature list
- Pricing
- "Add to Cart" button
- "Learn More" link

**Addon Checkout (/merchant/addons/checkout):**
- Selected addons
- Monthly cost per addon
- Total monthly increase
- First payment (prorated)
- "Activate Addons" button

**Addon Success (/merchant/addons/success):**
- Addons activated
- How to access new features
- Setup guides
- "Return to Dashboard"

---

#### Subscription Management (/merchant/subscription/checkout)
**Monthly Subscription Payment:**
- For recurring billing
- Auto-renewal settings
- Payment method update
- Subscription history

**Payment Complete (/merchant/subscription/payment-complete):**
- Payment successful
- Receipt details
- Next billing date
- Download invoice
- Update billing info

---

#### Swipe File Access (/merchant/swipe-file)
**Marketing Swipe File Library:**

**What's Included:**
- 500+ proven marketing templates
- Email campaigns
- Social media posts
- Ad copy
- Landing pages
- Video scripts
- SMS campaigns

**Pricing:**
- $99 one-time payment
- Lifetime access
- Free updates
- New templates added monthly

**Preview:**
- Browse template categories
- See example templates
- "Unlock Full Access" button

**Templates Page (/merchant/swipe-file/templates):**
- Search and filter
- Category navigation:
  - Email Marketing
  - Social Media
  - Landing Pages
  - Ad Copy
  - SMS Messages
  - Video Scripts
  - Print Ads
- Preview template
- Copy to clipboard
- Customize online
- Download

**Template Detail:**
- Full template view
- Use case description
- Industry examples
- Customization tips
- "Copy Template" button
- "Edit Online" button

**Checkout (/merchant/swipe-file/checkout):**
- Swipe file access: $99
- What's included
- Payment method
- "Complete Purchase" button

**Payment Complete (/merchant/swipe-file/payment-complete):**
- Access granted
- "Browse Templates" button
- Bookmark this link
- Share with team

**Landing Page Builder:**
When accessing landing page templates:
- Template selection
- Drag-and-drop editor
- Mobile preview
- Publish to custom URL
- Lead capture forms
- Analytics tracking

**Checkout (/merchant/swipe-file/landing-page-checkout):**
- Selected template
- Customization options
- Domain selection
- Hosting included
- Payment
- "Launch Landing Page"

**Processing (/merchant/swipe-file/landing-page-processing):**
- Building your page...
- Progress indicator
- Estimated time: 2-3 minutes
- "Your page is live!" message
- Preview link
- Edit link
- Share link

---

#### UGC (User-Generated Content) (/merchant/ugc-request)
**Creator Network Access:**

**Request UGC Content:**
- Professional content creators
- Product reviews
- Testimonial videos
- Social media content
- Photography

**Content Types:**
- Product unboxing video
- Testimonial video (30s, 60s)
- Social media photos
- Instagram Reels/TikTok
- Blog review
- Story highlights

**Pricing:**
- Photo package: $99 (5 photos)
- Video testimonial: $199 (60s)
- Social media bundle: $299 (3 videos + 10 photos)
- Custom package: Quote based

**Request Form:**
- Content type selection
- Product/service description
- Key messages
- Target audience
- Delivery timeline
- Budget
- Special requirements

**Creator Matching:**
- AI matches your request to creators
- Creator profiles shown:
  - Portfolio samples
  - Ratings
  - Price range
  - Availability
- Select creator
- Send request

**UGC Orders (/merchant/ugc-orders):**
- Active projects
- Project status:
  - Matching creator
  - In production
  - Review & feedback
  - Completed
- Message creator
- Approve/request revisions
- Download final content
- Leave review

**Content Library:**
- All completed UGC content
- Download high-res files
- Usage rights included
- Share directly to social media
- Embed on website

---

# 👔 ADMIN EXPERIENCE

## Admin Login (/admin/login)
**Separate Admin Authentication:**
- Admin email input
- Admin password input
- Remember me checkbox
- "Admin Login" button
- Different from regular user login
- Secure session management
- No "Create Account" option

**Security Features:**
- Session timeout after 30 minutes
- IP restriction (optional)
- Activity logging
- Audit trail

---

## Admin Dashboard (/admin/dashboard)
**Enhanced Admin Dashboard Overview:**

**Top Statistics Row:**
1. **Total Merchants:**
   - Active merchants count
   - Pending approvals badge
   - Growth percentage
   - "View All" link

2. **Total Customers:**
   - Registered customers
   - New this month
   - Growth trend
   - "View All" link

3. **Platform Revenue:**
   - Total GMV (Gross Merchandise Value)
   - Platform fees collected
   - Month-over-month growth
   - "View Details" link

4. **Active Deals:**
   - Total live deals
   - Pending approval count
   - Deal categories breakdown
   - "Review Deals" link

**Quick Actions Panel:**
- Approve pending merchants
- Review partner applications
- Create territory
- Generate reports
- View support tickets
- System announcements
- "Take Action" buttons for each

**Recent Activity Feed:**
- Real-time platform events:
  - New merchant signup
  - Deal submission
  - Partner application
  - Large purchase
  - Territory claim
  - Review flag
- Timestamp for each
- Quick action buttons
- Filter by activity type

**Charts & Analytics:**

**1. Revenue Trends (Line Graph):**
- Last 30/60/90 days
- Platform fees
- Merchant earnings
- Partner commissions
- Toggle different metrics

**2. User Growth (Area Chart):**
- Customers
- Merchants
- Partners
- Creators
- Cumulative growth

**3. Top Performing Cities (Bar Chart):**
- Sales by city
- Number of active merchants
- Average deal value
- Growth rate

**4. Deal Categories (Pie Chart):**
- Category distribution
- Revenue by category
- Deals per category
- Click to filter

**Platform Health Indicators:**
- System uptime: 99.9%
- API response time: <200ms
- Error rate: <0.1%
- Active sessions
- Database status
- Edge function status
- "System Status" dashboard link

**Alerts & Notifications:**
- Critical alerts (red badge)
- Pending actions (yellow badge)
- System notifications
- Click to expand details
- Mark as read
- Set reminders

---

## Left Admin Navigation

### 🏪 Merchant Management

#### Merchant Applications (/admin/merchant-applications)
**Application Queue:**

**Filter Bar:**
- Status: Pending, Approved, Rejected, More Info Needed
- Date submitted range
- Business category
- Location/city
- Application score (auto-calculated)

**Application List Table:**
Columns:
- Checkbox (bulk actions)
- Business name
- Owner name
- Category
- Location
- Submitted date
- Application score (1-100)
  - Based on completeness, risk factors
  - Color-coded (green high, yellow medium, red low)
- Status badge
- Actions:
  - View Details
  - Approve
  - Reject
  - Request Info

**Bulk Actions:**
- Approve selected
- Reject selected
- Export selected
- Assign to reviewer

**Application Detail View (Click Row):**
Opens side panel or full page:

**Business Information Tab:**
- Legal business name
- DBA
- Business address (map shown)
- Category and subcategory
- Years in business
- Tax ID/EIN
- Business license # and expiration
- Website
- Phone and email

**Owner Information Tab:**
- Full name
- Email and phone
- Address
- SSN (masked, view with permission)
- Date of birth
- Ownership percentage
- Background check status
- ID verification status

**Financial Information Tab:**
- Bank account details (verified/not verified)
- Expected monthly revenue
- Processing history
- Credit check results
- Risk assessment score

**Documents Tab:**
- Business license (view/download)
- Owner ID (view/download)
- Bank statement (view/download)
- Tax documents (view/download)
- Additional documents
- Document verification status

**Risk Assessment Panel:**
- Automated risk score
- Fraud indicators:
  - Address verification
  - Phone verification
  - Email verification
  - Business verification
  - Credit check
- Manual review notes
- Similar merchant detection
- Watchlist check

**Action Buttons:**
- "Approve Application" (green button)
  - Opens confirmation modal
  - Sends welcome email
  - Creates merchant account
  - Grants dashboard access

- "Request More Information" (yellow button)
  - Template messages:
    - Need better quality ID
    - Need updated license
    - Need bank verification
    - Custom message
  - Auto-emails merchant
  - Sets follow-up reminder

- "Reject Application" (red button)
  - Rejection reasons dropdown:
    - Incomplete information
    - Failed verification
    - High risk
    - Policy violation
    - Duplicate account
    - Other (specify)
  - Sends rejection email
  - Option to blacklist
  - Can add notes

**Activity Log:**
- All actions taken on application
- Reviewer notes
- Status changes
- Communications sent
- Merchant responses

**Internal Notes:**
- Private admin notes
- Tag other admins
- Set reminders
- Add flags

---

#### All Merchants (/admin/merchants)
**Merchant Management Dashboard:**

**Search & Filters:**
- Search by name, email, business
- Status filter: Active, Pending, Suspended, Closed
- Category filter
- Location filter
- Date joined range
- Performance filters:
  - Revenue range
  - Deal count
  - Rating range

**Merchant List Table:**
Columns:
- Merchant ID
- Business name (with logo thumbnail)
- Owner name and email
- Category
- Location/city
- Status badge
- Date joined
- Active deals count
- Total revenue
- Commission earned
- Average rating
- Last active
- Actions dropdown:
  - View Profile
  - View Deals
  - View Transactions
  - Edit
  - Suspend
  - Unsuspend
  - Send Message
  - Login As (impersonate)
  - Delete

**Merchant Detail View:**

**Overview Tab:**
- Business profile information
- Subscription tier
- Account status
- Key metrics:
  - Lifetime revenue
  - Total deals created
  - Total sales
  - Refund rate
  - Average rating
- Account manager assigned
- Tags and notes

**Deals Tab:**
- All deals from this merchant
- Status breakdown
- Performance metrics per deal
- Quick approve/reject
- Edit deal

**Transactions Tab:**
- All purchases
- Revenue timeline
- Refund history
- Payout history
- Export data

**Analytics Tab:**
- Revenue trends
- Customer acquisition
- Deal performance
- Conversion rates
- Custom date ranges

**Communications Tab:**
- Email history
- Support tickets
- Sent campaigns
- Scheduled messages

**Billing Tab:**
- Subscription history
- Payment method
- Invoices
- Credits/debits
- Next billing date

**Settings Tab:**
- Edit merchant profile
- Change subscription tier
- Apply discounts
- Fee adjustments
- Feature flags

**Activity Log:**
- Login history
- Actions taken
- Changes made
- Support interactions

**Admin Actions:**
- Send email
- Add credit
- Apply discount
- Suspend account
- Close account
- Transfer ownership
- Merge accounts
- Reset password

---

### 🤝 Partner Management

#### Partner Applications (/admin/partner-applications)
**Partner Applicant Queue:**

**Filter Options:**
- Status: New, Under Review, Approved, Declined
- Territory requested
- Date applied
- Application score
- Source (referral, organic, etc.)

**Application List:**
Each application shows:
- Applicant name
- Email and phone
- Territory requested
- Application date
- Score/rating
- Status
- Actions:
  - View Details
  - Approve
  - Decline
  - Request Interview

**Application Detail View:**

**Personal Information:**
- Full name
- Email, phone
- Address
- LinkedIn profile
- Resume/CV upload
- Cover letter

**Territory Selection:**
- Requested territory (map view)
- Reason for selection
- Familiarity with area
- Competition analysis

**Experience Section:**
- Sales experience
- Marketing experience
- Local business experience
- Relevant skills
- Previous earnings
- References

**Business Plan:**
- Target merchant types
- Marketing strategy
- First 30/60/90 day plan
- Revenue projections
- Investment capacity

**Qualification Questions:**
- Why do you want to be a partner?
- How will you recruit merchants?
- Conflict of interest disclosure
- Time commitment
- Financing plan

**Background Check:**
- Criminal background status
- Credit check status
- Reference checks
- Verification status

**Interview Notes:**
- Schedule interview button
- Interview date/time
- Interviewer name
- Interview notes field
- Rating scale
- Recommendation

**Decision Actions:**
- "Approve" button:
  - Assign territory
  - Set commission structure
  - Send welcome package
  - Grant dashboard access
  - Schedule onboarding

- "Decline" button:
  - Reason for decline
  - Feedback to applicant
  - Future consideration option
  - Send notification

- "Request Interview":
  - Send calendar invite
  - Prepare questions
  - Set reminder

**Applicant Communication:**
- Send email
- Schedule call
- Track correspondence
- Add to follow-up list

---

#### Partner Analytics (/admin/analytics)
**Partner Performance Dashboard:**

**Overall Statistics:**
- Total active partners
- Total territories covered
- Total merchants onboarded by partners
- Total commission paid
- Average partner earnings
- Top performing partners

**Partner Performance Table:**
Columns:
- Partner name
- Territory/territories
- Merchants recruited
- Active merchants
- Monthly revenue from merchants
- Commission earned (this month)
- Commission earned (all time)
- Performance rating
- Status (Active/Inactive/On Hold)
- Actions

**Performance Metrics:**
- Recruitment rate
- Merchant retention rate
- Average deal quality
- Response time
- Training completion %
- Customer satisfaction score

**Filters:**
- Territory
- Performance level (High/Medium/Low)
- Active status
- Date range
- Commission range

**Individual Partner Details (Click Row):**

**Performance Dashboard:**
- Earnings timeline (graph)
- Merchants recruited over time
- Territory map with merchant pins
- Success metrics

**Merchant Portfolio:**
- List of merchants recruited
- Status of each merchant
- Revenue per merchant
- Deal performance

**Commissions:**
- Commission structure
- Payouts history
- Pending payouts
- Lifetime earnings

**Activity:**
- Login frequency
- Platform usage
- Training modules completed
- Support tickets

**Goals & Targets:**
- Monthly recruitment goal
- Progress to goal
- Bonus eligibility
- Performance incentives

**Admin Actions:**
- Adjust commission rate
- Award bonus
- Issue warning
- Suspend partner
- Terminate partnership
- Assign additional territory

---

#### Territory Management (/admin/territories)
**Territory Overview Map:**
- Interactive map showing all territories
- Color-coded by status:
  - 🟢 Green: Active with partner
  - 🟡 Yellow: Available
  - 🔴 Red: Inactive/At Risk
  - 🔵 Blue: Reserved
- Click territory to view details
- Zoom and pan
- Filter by region

**Territory List View:**
Table showing:
- Territory name (City/Region)
- Postal codes included
- Partner assigned (or "Available")
- Number of merchants
- Revenue generated
- Status
- Last activity date
- Actions:
  - View Details
  - Edit Boundaries
  - Assign Partner
  - Make Available
  - Merge with another
  - Split territory

**Territory Detail View:**

**Overview:**
- Territory name
- Geographic boundaries (map)
- Postal codes/zip codes
- Population
- Business density
- Market potential score

**Assignment:**
- Current partner (if assigned)
- Assignment date
- Performance metrics
- Commission structure
- Contract terms
- Renewal date

**Merchants:**
- List of merchants in territory
- Active vs inactive
- Categories represented
- Total revenue
- Growth trend

**Analytics:**
- Market penetration %
- Growth opportunity
- Competitive landscape
- Demographics

**Activity:**
- Partner actions
- Merchant signups
- Deal creation
- Customer engagement

**Admin Actions:**
- Assign to partner
- Unassign partner
- Edit boundaries
- Set commission rate
- Mark as priority
- Add notes

---

#### Territory Creation (/admin/territories/create)
**Create New Territory:**

**Step 1 - Basic Information:**
- Territory name (e.g., "Downtown Seattle")
- Description
- Territory type:
  - City
  - Neighborhood
  - Region
  - County
  - Custom

**Step 2 - Geographic Definition:**
- Map interface
- Draw boundaries tool:
  - Click to place points
  - Create polygon
  - Adjust boundaries
- Or enter postal codes (comma-separated)
- Or upload boundary file (GeoJSON)
- Population within bounds (auto-calculated)
- Business count estimate

**Step 3 - Market Information:**
- Estimated merchants available
- Competition analysis
- Average business revenue in area
- Target merchant categories
- Market maturity (New/Growing/Mature/Saturated)

**Step 4 - Commission Structure:**
- Default commission rate %
- Bonus structure
- Performance tiers
- Override allowance

**Step 5 - Requirements:**
- Minimum partner qualifications
- Training requirements
- Performance expectations
- Reporting requirements

**Step 6 - Review & Create:**
- Preview territory details
- Review map
- Set status (Available/Reserved)
- "Create Territory" button

**After Creation:**
- Territory created successfully
- Option to assign partner immediately
- Option to make available for applications
- Add to territory list

---

#### Inactivity Scanner (/admin/territories/inactivity)
**Territory Health Monitor:**

**At-Risk Territories:**
Dashboard showing territories with:
- No merchant signups in 60 days
- Partner inactive for 30 days
- Revenue decline >50%
- Merchant churn rate high
- Low engagement score

**Alert List:**
Each alert shows:
- Territory name
- Partner assigned
- Issue type:
  - 🔴 No Activity (90+ days)
  - 🟠 Low Activity (60+ days)
  - 🟡 Declining Performance
  - ⚠️ High Churn Rate
- Days since last activity
- Recommended action
- Actions:
  - Contact Partner
  - Schedule Review
  - Reassign Territory
  - Provide Support
  - Issue Warning
  - Dismiss Alert

**Automated Actions:**
- Auto-email partner at 30 days inactive
- Escalate to admin at 60 days
- Warning at 75 days
- Territory revocation at 90 days

**Partner Outreach:**
- Send check-in email
- Schedule call
- Offer additional training
- Assign support resources
- Create performance improvement plan

**Territory Reassignment:**
- Revoke from inactive partner
- Notify partner of revocation
- Make available for new partner
- Transfer existing merchants
- Smooth transition plan

**Performance Reports:**
- Territory health scores
- Partner engagement metrics
- Early warning indicators
- Historical trends
- Predictive analytics

---

#### Expansion Requests (/admin/expansion-requests)
**Partner Expansion Queue:**

**Request List:**
Each request shows:
- Partner name (current territory)
- Requested territory
- Request date
- Justification summary
- Current performance metrics
- Recommendation score (AI-calculated)
- Status: Pending, Approved, Declined, Under Review
- Actions

**Filter Options:**
- Status
- Partner performance level
- Territory requested
- Date submitted

**Request Detail View:**

**Partner Performance:**
- Current territory(s)
- Merchants recruited
- Revenue generated
- Retention rate
- Quality score
- Time as partner
- Training completion
- Warnings/issues

**Expansion Request:**
- Territory requested (map view)
- Reason for request
- Business plan for new territory
- Resource allocation plan
- Timeline
- Expected outcomes

**Eligibility Check:**
- Minimum performance met? (Yes/No)
- Territory available? (Yes/No)
- No active warnings? (Yes/No)
- Training current? (Yes/No)
- Financial capacity? (Yes/No)
- Overall recommendation: Approve/Deny/Review

**Decision Panel:**
- Approve button:
  - Assign territory
  - Send approval notification
  - Update partner dashboard
  - Adjust commission structure
  - Schedule onboarding for new territory

- Decline button:
  - Reason for decline
  - Feedback to partner
  - When they can reapply
  - Send notification

- Request More Info:
  - Specific questions
  - Additional requirements
  - Interview scheduling

**Conditional Approval:**
- Approve with conditions:
  - Performance targets
  - Time milestones
  - Training requirements
  - Probation period

**Communication:**
- Message partner
- Schedule meeting
- Track conversation

---

### 🎨 Content Management

#### UGC Management (/admin/ugc)
**Creator Network Admin:**

**Creator Applications:**
- Pending applications
- Application review
- Portfolio assessment
- Accept/Reject creators

**Active Creators:**
List of approved creators:
- Name and profile photo
- Portfolio link
- Rating (from merchants)
- Jobs completed
- On-time delivery rate
- Category specialization
- Availability status
- Actions:
  - View Profile
  - View Work
  - Suspend
  - Feature Creator

**Project Monitoring:**
- All active projects
- Project status tracking
- Merchant satisfaction
- Issue resolution
- Quality assurance

**Content Library:**
- All UGC created
- Search and filter
- Quality ratings
- Usage rights verification
- Content moderation

**Creator Performance:**
- Top rated creators
- Most productive
- Specialization areas
- Earnings leaderboard

**Dispute Resolution:**
- Merchant complaints
- Revision requests
- Quality issues
- Resolution actions

**Creator Payouts:**
- Payout schedule
- Pending payments
- Payment history
- Tax documentation

---

### 📊 Reports & Analytics

#### Platform Analytics
**Comprehensive Reporting:**

**Revenue Reports:**
- Gross Merchandise Value (GMV)
- Platform fees collected
- Merchant earnings
- Partner commissions
- Creator payouts
- Net revenue
- By time period
- By category
- By location

**User Analytics:**
- Total users (customers)
- Active users (DAU/MAU)
- New signups
- Churn rate
- User lifetime value
- Cohort analysis
- Retention curves

**Merchant Analytics:**
- Active merchants
- Deals created
- Deal approval rate
- Average deal performance
- Merchant satisfaction
- Subscription distribution
- Churn analysis

**Deal Analytics:**
- Total deals
- Active deals
- Category distribution
- Average discount
- Conversion rates
- Popular categories
- Seasonal trends

**Geographic Reports:**
- Performance by city
- Territory coverage
- Market penetration
- Growth opportunities
- Competition analysis

**Financial Reports:**
- Income statement
- Cash flow
- Accounts receivable
- Accounts payable
- Tax reporting
- Audit trails

**Custom Report Builder:**
- Select metrics
- Choose dimensions
- Apply filters
- Set date ranges
- Schedule delivery
- Export formats
- Save templates

---

### ⚙️ System Management

#### Settings (/admin/settings)

**Platform Settings:**
- Platform name
- Logo and branding
- Color scheme
- Domain configuration
- SEO settings
- Analytics integration

**Commission Structure:**
- Default merchant commission %
- Partner commission %
- Creator commission %
- Payment processor fees
- Minimum payout amounts

**Deal Approval:**
- Auto-approval rules
- Manual review required for:
  - High discount %
  - Certain categories
  - New merchants
- Review SLA (Service Level Agreement)

**Email Configuration:**
- SMTP settings
- Email templates
- Sender addresses
- Email signature
- Delivery tracking

**Payment Settings:**
- GoPayBright configuration
- Supported payment methods
- Currency settings
- Payout schedule
- Refund policy

**Security:**
- Two-factor authentication enforcement
- Password policies
- Session timeout
- IP whitelisting
- Rate limiting

**Feature Flags:**
- Enable/disable features:
  - AI assistance
  - UGC network
  - Partner program
  - CRM addons
  - Each feature toggle

**Notifications:**
- Admin alert thresholds
- Automated emails
- SMS notifications
- Push notifications
- Webhook configuration

**Integrations:**
- Zapier
- Mailchimp
- QuickBooks
- Google Analytics
- Facebook Pixel
- API keys

**Maintenance:**
- Schedule maintenance window
- System announcements
- Downtime notifications
- Backup schedule
- Data retention policies

---

#### User Management (/admin/users)
**All Users Dashboard:**

**Search & Filters:**
- Search by name, email
- Role filter: Customer, Merchant, Partner, Admin
- Status: Active, Inactive, Suspended, Deleted
- Registration date range
- Location
- Last active

**User List Table:**
- User ID
- Name and avatar
- Email
- Phone
- Role badge
- Status
- Date joined
- Last active
- Total purchases (if customer)
- Total revenue (if merchant)
- Actions:
  - View Profile
  - Edit
  - Suspend
  - Unsuspend
  - Delete
  - Login As
  - Reset Password
  - Send Email

**User Detail View:**
- Profile information
- Account history
- Transactions
- Activity log
- Support tickets
- Communications
- Admin notes

**Bulk Actions:**
- Export users
- Send bulk email
- Update status
- Delete multiple

---

#### Admin Team (/admin/team)
**Admin User Management:**

**Admin List:**
- Name
- Email
- Role:
  - Super Admin (full access)
  - Admin (most access)
  - Support (limited access)
  - Analyst (view only)
- Last login
- Actions taken (count)
- Status
- Actions

**Invite Admin:**
- Email
- Role selection
- Permissions:
  - Merchant management
  - Partner management
  - User management
  - Financial access
  - Settings access
  - Content moderation
- Send invite

**Admin Activity Log:**
- All admin actions
- Timestamp
- Admin who performed action
- Action type
- Target (merchant, user, etc.)
- IP address
- Audit trail for compliance

---

### 📞 Support Management

#### Support Tickets
**Ticket Queue:**

**Filters:**
- Status: Open, In Progress, Resolved, Closed
- Priority: Low, Normal, High, Urgent
- Category: Technical, Billing, General
- Assigned to: Any Admin, Unassigned, Me
- Requester type: Customer, Merchant, Partner
- Date range

**Ticket List:**
- Ticket #
- Subject
- Requester name and role
- Category
- Priority badge
- Status
- Assigned to
- Created date
- Last updated
- Actions

**Ticket Detail:**
- Full conversation thread
- Requester information
- Ticket history
- Internal notes
- Attachments
- Related tickets
- Assign to admin
- Change status
- Change priority
- Add tags
- Merge tickets
- Set SLA timer

**Response Editor:**
- Rich text reply
- Canned responses
- Attach files
- Internal note toggle
- Send and close option
- Send and keep open

**SLA Tracking:**
- First response time
- Resolution time
- SLA breach alerts
- Performance metrics

---

### 📧 Communications

#### Email Campaigns
**Send Platform-Wide Communications:**

**Campaign Types:**
- Announcements
- Feature updates
- Promotions
- Educational content
- Surveys

**Audience Selection:**
- All users
- Customers only
- Merchants only
- Partners only
- Custom segment

**Email Builder:**
- Subject line
- Preview text
- Template selection
- Drag-and-drop editor
- Personalization
- A/B testing
- Schedule send

**Campaign Analytics:**
- Sent count
- Delivered
- Opened
- Clicked
- Bounced
- Unsubscribed
- Conversions

---

### 📈 System Monitoring

#### System Health
**Real-Time Platform Status:**

**Uptime Monitor:**
- Current status (all green or issues)
- Uptime percentage (30-day)
- Incident history
- Scheduled maintenance

**Services Status:**
- API: Operational
- Database: Operational
- Edge Functions: Operational
- Payment Processing: Operational
- Email Delivery: Operational
- SMS Gateway: Operational

**Performance Metrics:**
- Average response time
- Error rate
- Request volume
- Active connections
- Database queries/second

**Alerts:**
- Slow response time
- High error rate
- Service down
- Disk space low
- Memory usage high

**Logs:**
- Error logs
- Access logs
- Transaction logs
- Search logs
- Export logs

---

# 📝 Additional Features Across All Roles

## Notifications System
**In-App Notifications (Bell Icon in Header):**
- Dropdown showing recent notifications
- Unread count badge
- Mark as read
- Clear all
- View all notifications page

**Notification Types:**

**For Customers:**
- Purchase confirmation
- Deal expiring soon
- Favorite deal back in stock
- New deals in favorite categories
- Review request
- Refund processed

**For Merchants:**
- New purchase
- New review
- Deal approved/rejected
- Low inventory alert
- Payment received
- Subscription renewal
- Support ticket reply

**For Partners:**
- New merchant signup
- Commission earned
- Territory expansion approved
- Performance milestone reached
- Training reminder

**For Admins:**
- New applications (merchant/partner)
- Urgent support ticket
- System alert
- Performance anomaly
- Payment issue

## Search Functionality
**Global Search (Search Bar in Header):**
- Searches relevant content based on role
- Recent searches
- Search suggestions
- Filter results by type
- Keyboard shortcut (Cmd/Ctrl + K)

## Help & Documentation
**Available Throughout Platform:**
- Contextual help buttons (? icon)
- Tooltips on hover
- Video tutorials
- Step-by-step guides
- FAQ sections
- Live chat support (business hours)
- Knowledge base
- Community forum

## Mobile Responsiveness
**All Pages Optimized for Mobile:**
- Responsive grid layouts
- Touch-friendly buttons
- Mobile navigation menu
- Swipeable cards
- Mobile-optimized forms
- Camera access (QR scanning)
- Click-to-call/email
- Maps integration

## Accessibility Features
- Screen reader compatible
- Keyboard navigation
- High contrast mode
- Font size adjustment
- Alt text on images
- ARIA labels
- Focus indicators
- Semantic HTML

---

# 🎬 VIDEO WALKTHROUGH STRUCTURE SUGGESTION

## Part 1: Introduction (2-3 minutes)
- What is LocalLink Marketplace
- Who is it for
- Key value propositions
- Platform overview

## Part 2: Customer Journey (5-7 minutes)
- Landing page tour
- Browsing deals
- Deal detail page
- Purchase process
- Redemption experience
- Managing purchases and favorites
- Writing reviews

## Part 3: Merchant Dashboard (15-20 minutes)
- Dashboard overview
- Creating a deal with AI assistance
- Managing deals and redemptions
- CRM system
- Marketing campaigns
- Invoicing
- Analytics
- All merchant services (printing, websites, etc.)
- Settings and support

## Part 4: Admin Panel (10-15 minutes)
- Admin dashboard
- Merchant approval process
- Partner management
- Territory system
- Platform analytics
- System settings
- Support tools

## Part 5: Advanced Features (5-10 minutes)
- Partner portal
- UGC creator network
- AI features throughout
- Integrations
- Mobile experience

## Part 6: Conclusion (2-3 minutes)
- Platform benefits recap
- Pricing overview
- Getting started steps
- Support and resources
- Call to action

---

**Total Recommended Video Length: 40-60 minutes**

Consider breaking into multiple videos:
- Part 1: Customer Experience (15 min)
- Part 2: Merchant Hub (25 min)
- Part 3: Admin & Management (20 min)

This gives you a complete, detailed guide for your video walkthrough!
