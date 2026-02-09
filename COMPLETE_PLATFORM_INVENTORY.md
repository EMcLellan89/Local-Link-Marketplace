# Complete Platform Inventory - Local Link Marketplace

## 📱 CUSTOMER SIDE (Front-End)

### Public Pages (No Login Required)

#### Landing Page (`/`)
**Features:**
- Hero section with platform value proposition
- Featured deals carousel/grid
- How it works section (4-step process)
- Benefits for customers
- Benefits for businesses
- Call-to-action buttons
- Mobile responsive design
- Fast loading performance

#### About Page (`/about`)
**Features:**
- Company mission and vision
- Team information
- Platform history
- Core values
- Contact information
- Social proof/testimonials

#### How It Works (`/how-it-works`)
**Features:**
- Customer journey explained
- Merchant journey explained
- Visual step-by-step guides
- Benefits highlighted
- FAQs preview
- Sign-up CTAs

#### For Businesses (`/for-businesses`)
**Features:**
- Business benefits overview
- Success stories
- Platform capabilities
- ROI calculator concept
- Pricing preview
- Demo request form
- Sign-up CTA

#### Business Pricing (`/business-pricing`)
**Features:**
- CRM tier comparison
  - Starter: $49/month
  - Professional: $129/month
  - Enterprise: $249/month
- Feature breakdowns
- Add-on services pricing
- Custom enterprise solutions
- Contact sales option

#### FAQ Page (`/faq`)
**Features:**
- Customer FAQs
- Merchant FAQs
- Partner FAQs
- Search functionality
- Category filtering
- Expandable answers

#### Partner Application (`/partner-application`)
**Features:**
- Partner program information
- Benefits overview
- Territory model explanation
- Commission structure details
- Application form
  - Personal information
  - Business experience
  - Territory preferences
  - Financial qualifications
  - References
- Application submission
- Status tracking

### Authentication Pages

#### Customer Registration (`/register`)
**Features:**
- Email/password registration
- Form validation
- Password strength indicator
- Terms and conditions checkbox
- Referral code input
- Account type selection (Customer/Merchant)
- Automatic profile creation
- Email verification (optional)
- Redirect to appropriate dashboard

#### Customer Login (`/login`)
**Features:**
- Email/password login
- Remember me checkbox
- Forgot password link
- Error handling
- Secure authentication (Supabase)
- Session management
- Auto-redirect if logged in

### Customer Dashboard & Features (Requires Login)

#### Deals Marketplace (`/deals`)
**Browse & Search:**
- All active deals display
- Grid/list view options
- Search by business name or deal title
- Real-time search results

**Filtering:**
- Category filter (Restaurant, Retail, Services, Entertainment, Health & Wellness, Automotive, Home Services)
- Price range slider
- Discount percentage filter
- Location filter (future)
- Business rating filter (future)

**Sorting:**
- Newest first
- Price: Low to High
- Price: High to Low
- Discount % (highest first)
- Most popular (future)

**Deal Cards Display:**
- Business name and logo
- Category badge
- Deal title
- Short description preview
- Original price (strikethrough)
- Sale price (highlighted)
- Percentage savings badge
- "View Deal" button
- Favorite/heart icon
- Deal image

#### Deal Detail Page (`/deals/:id`)
**Deal Information:**
- Full deal title
- Complete description
- High-quality deal image
- Gallery images (if available)
- Business information section
- Business logo
- Business name and category
- Business address
- Business phone
- Business website link

**Pricing Details:**
- Original price
- Sale price
- Savings amount and percentage
- Price breakdown
- Quantity selector
- Total calculation

**Deal Terms:**
- Terms and conditions
- Restrictions and exclusions
- Redemption instructions
- Valid dates
- Expiration policy
- Fine print

**Actions:**
- Add to cart/Purchase button
- Add to favorites (heart icon)
- Share deal (social media icons)
- Report deal
- Print deal

**Social Proof:**
- Business rating and reviews
- Number of purchases
- Recently purchased indicator

#### Checkout Page (`/checkout`)
**Step 1: Review Order**
- Deal details summary
- Quantity selection
- Subtotal calculation
- Tax calculation
- Total amount due
- Promo code input
- Apply discount

**Step 2: Customer Information**
- First name
- Last name
- Email address
- Phone number
- Address (if required)
- Special instructions

**Step 3: Payment**
- GoPayBright integration
- Credit/debit card input
- Billing address
- Save payment method option
- Secure payment badge
- Terms acceptance
- Complete purchase button

**Security Features:**
- SSL encryption
- PCI compliance
- Secure checkout badge
- Privacy policy link

#### Payment Status Page (`/payment-status`)
**Features:**
- Real-time payment verification
- Loading states
- Success messaging
- Failure handling with retry
- Order confirmation details
- Transaction ID display
- Next steps instructions
- Contact support option
- Auto-redirect to confirmation

#### Purchase Confirmation (`/purchase-confirmation/:id`)
**Confirmation Display:**
- Success message
- Order number
- Purchase date and time
- Deal details purchased
- Quantity and total paid
- Transaction ID

**Redemption Details:**
- Unique redemption code (alphanumeric)
- QR code (scannable by merchant)
- QR code download button
- Redemption instructions
- Merchant contact information
- Merchant address and map link
- Valid until date
- Terms reminder

**Actions:**
- Download voucher as PDF
- Email voucher to myself
- Print voucher
- Add to Apple/Google Wallet (future)
- Share gift option (future)

**Email Confirmation:**
- Automatic email sent
- PDF attachment included
- All purchase details
- Redemption code and QR

#### My Purchases (`/purchases`)
**Purchase History:**
- All purchased deals listed
- Chronological order (newest first)
- Purchase date
- Business name
- Deal title
- Amount paid
- Status badge

**Filtering:**
- Active (not redeemed)
- Redeemed
- Expired
- All purchases

**Purchase Cards Display:**
- Deal thumbnail
- Business name
- Purchase date
- Status (Active/Redeemed/Expired)
- Redemption code
- Actions menu

**Actions Per Purchase:**
- View voucher details
- View QR code
- Download voucher
- Email voucher
- Print voucher
- Buy again
- Request refund (if eligible)
- Leave review (after redemption)

**Statistics:**
- Total purchases
- Total spent
- Total saved
- Active vouchers count

#### Favorites Page (`/favorites`)
**Saved Deals:**
- All favorited deals
- Deal cards with full info
- Remove from favorites option
- Quick view deal details
- Purchase directly
- Share favorites
- Empty state if no favorites

**Features:**
- Add/remove with heart icon
- Notification when deal expires soon
- Notification when deal price changes
- Organize into lists (future)

#### Customer Profile (`/profile`)
**Personal Information Section:**
- Profile photo upload
- First name
- Last name
- Email address (verified badge)
- Phone number
- Date of birth (optional)
- Address
- Edit profile button
- Save changes

**Purchase History Summary:**
- Total purchases count
- Total amount spent
- Total money saved
- Favorite categories
- Most visited businesses
- Purchase frequency stats

**Preferences Section:**
- Email notifications toggle
  - New deals in favorite categories
  - Deal expiration reminders
  - Special offers
  - Newsletter
- SMS notifications toggle
  - Purchase confirmations
  - Redemption reminders
- Push notifications (future)
- Language preference
- Currency preference

**Referral Program:**
- Unique referral code
- Referral link
- Share buttons (email, SMS, social)
- Number of successful referrals
- Rewards earned
- Referral leaderboard
- Terms and conditions

**Payment Methods:**
- Saved cards display (last 4 digits)
- Add new card
- Remove card
- Set default payment method

**Account Security:**
- Change password
- Two-factor authentication
- Login history
- Active sessions
- Security settings

**Account Management:**
- Delete account option
- Export my data
- Privacy settings
- Terms acceptance history

---

## 🏪 MERCHANT SIDE (Front-End)

### Merchant Onboarding

#### Merchant Registration
**Same as customer registration with:**
- Account type: "Merchant" selected
- Additional business fields
- Agreement to merchant terms
- Commission structure acceptance

#### Merchant Onboarding (`/merchant/onboarding`)
**Step 1: Business Information**
- Business legal name
- Business DBA (Doing Business As)
- Business category selection
- Business description (elevator pitch)
- Year established
- Number of employees
- Business registration number
- Tax ID/EIN

**Step 2: Contact Information**
- Business email
- Business phone
- Business address (full)
- Mailing address (if different)
- Website URL
- Booking/reservation link

**Step 3: Business Hours**
- Days of operation
- Opening times
- Closing times
- Special hours
- Holiday schedule
- Timezone

**Step 4: Social Media**
- Facebook page URL
- Instagram handle
- Twitter handle
- LinkedIn profile
- TikTok handle
- YouTube channel
- Yelp page

**Step 5: Branding**
- Business logo upload
- Logo preview
- Image crop/resize tool
- Cover photo upload
- Brand colors selection

**Step 6: Bank Information**
- Bank name
- Account holder name
- Account number
- Routing number
- Account type (Checking/Savings)
- Verification document upload

**Step 7: Review & Submit**
- Review all information
- Edit any section
- Terms and conditions
- Submit for approval
- Estimated approval time

### Merchant Dashboard

#### Main Dashboard (`/merchant/dashboard`)
**Overview Metrics (Top Cards):**
- Total deals created
- Active deals count
- Total revenue generated
- Revenue this month
- Total purchases (all-time)
- Purchases this month
- Pending redemptions count
- Redemption rate percentage
- New customers this month
- Returning customers
- Average order value
- Total customers in database

**Revenue Charts:**
- Daily revenue (last 30 days) - Line chart
- Monthly revenue comparison - Bar chart
- Revenue by deal - Pie chart
- Revenue by category - Donut chart

**Recent Activity Feed:**
- Latest purchases (last 10)
  - Customer name
  - Deal purchased
  - Amount
  - Time ago
- Recent redemptions (last 10)
  - Customer name
  - Deal redeemed
  - Location
  - Time ago
- New customer reviews
- New leads captured
- Pending actions requiring attention

**Quick Actions Panel:**
- Create New Deal button
- View All Purchases
- Redeem Voucher
- View Analytics
- Check Messages
- Manage Settings
- Access CRM
- Create Invoice
- View Reports

**Deal Performance Table:**
- Top 5 performing deals
- Deal name
- Total purchases
- Revenue generated
- Average rating
- Quick actions (Edit, Pause, View)

**Alerts & Notifications:**
- Deals expiring soon
- Low inventory alerts
- Pending customer inquiries
- Payment issues
- Account setup incomplete
- Subscription payment due

**Upcoming Events/Calendar:**
- Scheduled deals
- Marketing campaigns
- Appointments
- Tasks and reminders

### Deal Management

#### Create Deal Page (`/merchant/deals/create`)
**Basic Information:**
- Deal title (required, max 100 chars)
- Deal description (rich text editor, max 1000 chars)
- Deal category (dropdown)
- Deal type selection:
  - Percentage Off
  - Dollar Amount Off
  - Buy One Get One (BOGO)
  - Fixed Price
  - Package Deal
  - Service Bundle

**Pricing Configuration:**
- Original price (required)
- Sale price (required)
- Automatic discount calculation
- Discount percentage display
- Cost of goods sold (for profit tracking)
- Profit margin calculation
- Minimum price alert

**Inventory Management:**
- Total quantity available
- Unlimited option checkbox
- Quantity per customer limit
- Daily purchase limit per customer
- Total purchase limit per customer
- Low inventory alert threshold
- Inventory tracking enabled/disabled

**Scheduling:**
- Deal start date & time
- Deal end date & time
- Always available option
- Specific days of week
- Specific times of day
- Recurring deal setup
- Seasonal availability

**Terms & Conditions:**
- Redemption instructions (text editor)
- Restrictions and exclusions
- Expiration policy
- Refund policy
- Cancellation policy
- Fine print
- Age requirements
- Appointment required checkbox

**Media Upload:**
- Primary deal image (required)
- Image upload (drag & drop or browse)
- Image preview
- Crop/resize tool
- Gallery images (up to 5 additional)
- Video upload (optional, future)

**SEO & Marketing:**
- Meta title
- Meta description
- Keywords/tags
- Featured deal checkbox
- Promoted deal checkbox
- Social media auto-post

**Preview & Publish:**
- Live preview of deal card
- Preview as customer sees it
- Save as draft
- Publish immediately
- Schedule publication

#### Manage Deals Page (`/merchant/deals`)
**Deal List View:**
- All deals table/grid
- Deal thumbnail
- Deal title
- Category badge
- Status (Active, Draft, Paused, Expired, Scheduled)
- Price and discount
- Total purchases
- Revenue generated
- Inventory remaining
- Valid dates
- Actions menu

**Filtering:**
- Status filter (All, Active, Draft, Paused, Expired, Scheduled)
- Category filter
- Date range filter
- Price range filter
- Performance filter (High/Medium/Low)

**Sorting:**
- Newest first
- Oldest first
- Most purchases
- Highest revenue
- Lowest inventory
- Expiring soon

**Bulk Actions:**
- Select multiple deals
- Pause selected
- Resume selected
- Duplicate selected
- Archive selected
- Delete selected
- Export selected

**Actions Per Deal:**
- View deal (as customer sees it)
- Edit deal
- Duplicate deal
- Pause/Resume deal
- View analytics
- View purchases
- Share deal (get link)
- Promote deal
- Archive deal
- Delete deal

**Deal Analytics (Per Deal):**
- Impressions (views)
- Click-through rate
- Purchases
- Conversion rate
- Revenue
- Average order value
- Customer ratings
- Performance score
- Recommendations

#### Deal Redemption Page (`/merchant/redemption`)
**Redemption Methods:**
- Scan QR code (camera access)
- Manual code entry
- Search by customer name
- Search by order number

**Redemption Process:**
1. Scan/enter code
2. Verify customer information
3. Display purchase details:
   - Customer name
   - Deal purchased
   - Purchase date
   - Quantity
   - Redemption code
   - Terms and conditions
4. Confirm redemption button
5. Optional: Customer signature capture
6. Complete redemption
7. Email confirmation to customer

**Redemption History:**
- All redeemed purchases
- Date and time redeemed
- Customer name
- Deal redeemed
- Redeemed by (staff member)
- Location (if multi-location)
- Revenue amount
- Export redemption report

**Filter Redemptions:**
- Date range
- Deal type
- Staff member
- Location
- Export filtered results

**Redemption Analytics:**
- Total redemptions
- Redemption rate
- Average time to redeem
- Peak redemption times
- Expiration rate (unredeemed)

### CRM System

#### CRM Marketplace (`/merchant/crm-marketplace`)
**Pricing Tiers Display:**

**Starter Plan - $49/month:**
- Up to 500 leads
- Lead capture from marketplace
- Local-Link Lite Accounting
- Create & send invoices
- Accept payments online
- Basic income & expense tracking
- Contact management
- Basic pipeline
- Activity logging
- Task management
- Lead source tracking
- Basic notifications
- Email support
- Mobile access
- Data export
- Subscribe button

**Professional Plan - $129/month (Most Popular badge):**
- Up to 2,500 leads
- Everything in Starter
- Local-Link Pro Accounting
- Advanced invoicing & recurring billing
- Payment reminders & auto-follow-ups
- P&L statements
- Cash flow forecasting
- Tax reporting & categorization
- Advanced ad performance & ROI
- Deal performance breakdown
- Conversion tracking
- Advanced filtering
- Custom fields & tags
- Lead scoring
- Email integration & templates
- Marketing campaigns
- Customer segmentation
- Reviews & ratings management
- Automated notifications
- Reports & analytics
- Customer preferences
- Referral program
- Priority support
- Team collaboration (5 users)
- Subscribe button

**Enterprise Plan - $249/month:**
- Unlimited leads
- Everything in Professional
- Local-Link Pro Accounting (Multi-location)
- Multi-currency invoicing
- Advanced financial reporting
- Budget tracking
- Inventory management integration
- Automated bookkeeping
- Advanced automation & workflows
- Multi-location business management
- Gift cards & membership management
- Customer survey system
- Full support ticket system
- Deal templates & scheduling
- Revenue forecasting
- API access & webhooks
- Custom integrations
- CSV import/export
- Advanced security & permissions
- Dedicated account manager
- White-label options
- Unlimited users
- Custom training & onboarding
- 99.9% uptime SLA
- Priority feature requests
- Contact sales button

**Comparison Table:**
- Side-by-side feature comparison
- Highlight differences
- Check marks for included features
- "Most Popular" badge
- "Best Value" badge

**FAQ Section:**
- Common CRM questions
- Billing questions
- Feature questions
- Migration questions

#### CRM Dashboard (`/merchant/crm-dashboard`)
**Lead Pipeline View:**
- Visual pipeline columns:
  - New Leads
  - Contacted
  - Qualified
  - Proposal Sent
  - Negotiation
  - Won
  - Lost
- Drag-and-drop between stages
- Lead cards with key info
- Quick actions on cards
- Filter pipeline
- Stage conversion rates
- Bottleneck identification

**Lead List View:**
- All leads in table format
- Lead name
- Company
- Email
- Phone
- Lead source
- Status/Stage
- Assigned to
- Last activity
- Next task
- Actions menu

**Lead Details Panel:**
- Full contact information
- Company details
- Lead source
- Lead score
- Tags
- Custom fields
- Communication history
- Deal purchases from marketplace
- Notes (chronological)
- Attachments
- Related contacts
- Tasks and reminders

**Activity Timeline:**
- All interactions logged
- Calls logged
- Emails sent/received
- Meetings scheduled
- Status changes
- Deal purchases
- Form submissions
- Website visits (if tracked)
- Automated activities

**Quick Add Lead:**
- Add lead form (sidebar)
- Name (required)
- Email
- Phone
- Company
- Source
- Initial notes
- Assign to team member
- Save button

**Search & Filter:**
- Global search across all fields
- Filter by status
- Filter by source
- Filter by assigned user
- Filter by date range
- Filter by tags
- Filter by custom fields
- Save custom filters
- Quick filters (My Leads, Hot Leads, Overdue Tasks)

**Bulk Actions:**
- Select multiple leads
- Assign to user
- Change status
- Add tags
- Send email
- Create task
- Export selected
- Delete selected

**Lead Analytics:**
- Total leads
- Leads by stage
- Conversion rates per stage
- Average time in stage
- Lead sources performance
- Lead score distribution
- Pipeline value
- Forecasted revenue

#### CRM - Lead Detail Page (`/merchant/crm/:id`)
**Contact Information Card:**
- Profile photo
- Full name
- Job title
- Company name
- Email address (click to email)
- Phone number (click to call)
- Address
- Social media links
- Edit contact button

**Lead Score & Status:**
- Lead score (0-100)
- Status/Stage badge
- Assigned to (team member)
- Lead source
- Created date
- Last activity date
- Next scheduled task

**Quick Actions:**
- Send email
- Log call
- Schedule meeting
- Create task
- Add note
- Change status
- Assign to someone
- Add tags
- Convert to customer

**Activity & Communication Tab:**
- All activities chronologically
- Filter by activity type
- Add new activity
- Activity types:
  - Notes
  - Calls
  - Emails
  - Meetings
  - Tasks
  - Status changes
  - Deal purchases

**Marketplace Activity Tab:**
- Deals viewed by this customer
- Deals favorited
- Deals purchased
- Total spent
- Purchase frequency
- Last purchase date
- Favorite categories

**Tasks & Reminders Tab:**
- All tasks for this lead
- Overdue tasks highlighted
- Upcoming tasks
- Completed tasks
- Add new task form:
  - Task title
  - Description
  - Due date & time
  - Priority (Low/Medium/High)
  - Assigned to
  - Reminder settings

**Files & Attachments Tab:**
- All files related to lead
- Upload new files
- Drag & drop upload
- File preview
- Download files
- Organize into folders
- File version history

**Related Contacts Tab:**
- Other contacts at same company
- Relationships defined
- Quick add contact
- Link existing contact

**Custom Fields:**
- All custom fields defined
- Edit values
- Add new custom field
- Field types (Text, Number, Date, Dropdown, Checkbox, URL)

**Lead Notes:**
- Chronological notes
- Rich text editor
- Add new note
- Edit notes
- Pin important notes
- Search notes
- Filter by author

#### CRM Migration Page (`/merchant/crm-migration`)
**Import Wizard:**

**Step 1: Choose Source**
- Select CRM type:
  - Generic CSV
  - Salesforce
  - HubSpot
  - Zoho CRM
  - Pipedrive
  - Other
- Instructions per type
- Sample file download

**Step 2: Upload File**
- Drag & drop file upload
- Browse file option
- File validation
- File preview (first 10 rows)
- Supported formats (.csv, .xlsx, .xls)
- File size limit display

**Step 3: Field Mapping**
- Your file columns → Our fields
- Automatic matching suggestions
- Manual mapping interface
- Required fields highlighted
- Optional fields
- Custom field creation
- Skip columns option
- Preview mapped data

**Step 4: Data Validation**
- Validate data integrity
- Show errors and warnings
- Duplicate detection
- Invalid email detection
- Missing required fields
- Fix errors before import
- Skip invalid rows option

**Step 5: Import Options**
- Import settings:
  - Update existing records
  - Skip duplicates
  - Create new only
- Tag imported records
- Assign to user
- Set default values
- Notification preferences

**Step 6: Review & Import**
- Summary of import:
  - Total records
  - Valid records
  - Records to import
  - Records to skip
  - Errors count
- Start import button
- Cancel and review

**Step 7: Import Progress**
- Progress bar
- Records imported count
- Real-time status
- Error log
- Success log
- Cancel import option

**Step 8: Import Complete**
- Success message
- Import summary:
  - Successfully imported
  - Skipped records
  - Failed records
- Download error report
- View imported records
- Import history

**Import History:**
- All previous imports
- Import date
- File name
- Records imported
- Status
- Download original file
- Download error report
- Re-import option

### Invoicing & Accounting

#### Invoicing Dashboard (`/merchant/invoices`)
**Overview Statistics:**
- Total invoices created (all-time)
- Outstanding balance (awaiting payment)
- Total paid (all-time revenue)
- Overdue invoices count
- Average invoice amount
- Average time to payment

**Quick Actions:**
- Create New Invoice button (prominent)
- Import Invoices
- Export Invoices
- Settings

**Invoice List:**
- All invoices table
- Invoice number
- Customer name
- Date issued
- Due date
- Amount
- Status badge:
  - Draft (gray)
  - Sent (blue)
  - Viewed (purple)
  - Paid (green)
  - Overdue (red)
  - Cancelled (dark gray)
- Actions menu

**Search & Filter:**
- Search by invoice number, customer, email
- Filter by status
- Filter by date range
- Filter by amount range
- Sort by date, amount, customer
- Advanced filters

**Actions Per Invoice:**
- View invoice details
- Send invoice via email
- Copy payment link
- Mark as sent
- Mark as paid (manual)
- Send payment reminder
- Download PDF
- Print invoice
- Edit invoice (if draft)
- Duplicate invoice
- Cancel invoice
- Delete invoice (if draft only)

**Bulk Actions:**
- Select multiple invoices
- Send reminders
- Mark as sent
- Download PDFs
- Export to CSV
- Delete selected (drafts only)

**Revenue Charts:**
- Monthly revenue trend
- Paid vs Outstanding
- Average payment time
- Customer payment behavior

**Overdue Invoices Section:**
- All overdue invoices highlighted
- Days overdue
- Quick send reminder
- Customer contact info
- Escalation options

**Recent Payments:**
- Latest payments received
- Customer name
- Invoice number
- Amount paid
- Payment date
- Payment method

#### Create Invoice Page (Coming Soon UI)
**Currently shows:**
- "Invoice creation UI coming soon" message
- Explanation of current functionality:
  - Invoices created automatically from CRM
  - Payment links generated
  - GoPayBright integration active
- Link to CRM Dashboard
- Link to documentation
- Contact support button

**Planned Features (for reference):**
- Customer selection dropdown
- Add new customer inline
- Invoice date picker
- Due date picker
- Payment terms dropdown
- Line items table:
  - Description
  - Quantity
  - Unit price
  - Tax rate
  - Amount
  - Add/remove line buttons
- Subtotal calculation
- Tax calculation
- Discount field
- Total amount
- Payment instructions
- Notes to customer
- Terms and conditions
- Recurring invoice setup
- Attach files
- Save as draft
- Send invoice
- Preview invoice

### Marketing & Growth Tools

#### Marketing Dashboard (`/merchant/marketing`)
**Campaign Overview:**
- Active campaigns
- Campaign performance metrics
- Total reach
- Engagement rate
- Conversion rate
- ROI calculation

**Email Marketing:**
- Create email campaign
- Email templates library
- Drag-and-drop editor
- Recipient list management
- Segmentation options
- A/B testing setup
- Schedule sending
- Email performance tracking
- Open rates
- Click rates
- Unsubscribe rates

**Customer Segmentation:**
- Create segments
- Segment by purchase history
- Segment by demographics
- Segment by behavior
- Segment by preferences
- Segment by spend
- Segment by engagement
- Custom segments
- Segment size display
- Export segments

**Marketing Automation:**
- Automation workflows
- Welcome series
- Abandoned cart recovery
- Re-engagement campaigns
- Birthday/anniversary emails
- Post-purchase follow-up
- Review request automation
- Win-back campaigns
- Trigger setup
- Delay settings
- Condition logic

**Campaign Calendar:**
- Visual calendar
- Schedule campaigns
- View scheduled
- Drag to reschedule
- Campaign types color-coded

**Campaign Templates:**
- Pre-built templates
- Industry-specific templates
- Holiday templates
- Seasonal templates
- Promotional templates
- Customize templates

**Performance Analytics:**
- Campaign comparison
- Best performing campaigns
- Engagement trends
- Conversion funnel
- Revenue attribution
- Customer journey

#### Reviews & Ratings Page (`/merchant/reviews`)
**Review Overview:**
- Average rating (stars)
- Total reviews count
- Rating distribution (5-star to 1-star)
- Recent trend (up/down)
- Review response rate
- Average response time

**All Reviews List:**
- Customer name (or anonymous)
- Rating (stars)
- Review text
- Date posted
- Deal reviewed (if applicable)
- Verified purchase badge
- Response status
- Actions menu

**Filter Reviews:**
- All ratings
- 5 stars only
- 4 stars only
- 3 stars only
- 2 stars only
- 1 star only
- With response
- Without response
- Date range

**Sort Reviews:**
- Newest first
- Oldest first
- Highest rated
- Lowest rated
- Most helpful

**Review Actions:**
- Respond to review
- Edit response
- Flag inappropriate
- Report spam
- Like review
- Mark as helpful
- Share review

**Review Response:**
- Text editor
- Response templates
- Save response
- Publish response
- Private message option
- Automated thank you

**Review Collection:**
- Automated review requests
- Email invitation templates
- SMS invitation templates
- QR code for reviews
- Review link generation
- Timing settings (X days after purchase)
- Incentive options

**Review Analytics:**
- Review velocity (reviews per month)
- Sentiment analysis
- Common keywords
- Improvement suggestions
- Competitive benchmarking

**Public Review Page:**
- Public-facing review page
- Embeddable widget
- Share link
- Featured reviews
- Customize display

#### Analytics Page (`/merchant/analytics`)
**Dashboard Overview:**
- Key metrics summary
- Date range selector
- Export report button
- Customize dashboard
- Schedule reports

**Revenue Analytics:**
- Total revenue (selected period)
- Revenue trend chart (line graph)
- Revenue by deal (pie chart)
- Revenue by category (bar chart)
- Revenue by day of week
- Revenue by time of day
- Month-over-month comparison
- Year-over-year comparison
- Revenue forecast

**Customer Analytics:**
- Total customers
- New customers (period)
- Returning customers (period)
- Customer acquisition cost
- Customer lifetime value
- Average order value
- Purchase frequency
- Customer retention rate
- Customer churn rate
- Customer segmentation breakdown

**Deal Performance:**
- Top 10 performing deals
- Bottom 10 performing deals
- Deal impressions
- Click-through rate
- Conversion rate per deal
- Revenue per deal
- Profit margin per deal
- Average rating per deal
- Deal comparison tool

**Traffic & Engagement:**
- Profile views
- Deal views
- Search appearances
- Click-through rate
- Time on page
- Bounce rate
- Traffic sources
- Geographic distribution

**Conversion Funnel:**
- Impression to click
- Click to deal view
- Deal view to purchase
- Purchase to redemption
- Drop-off points identified
- Conversion optimization tips

**Marketing Performance:**
- Campaign performance
- Email open rates
- Email click rates
- Social media engagement
- Ad spend and ROI
- Channel attribution
- Marketing funnel

**Custom Reports:**
- Create custom report
- Select metrics
- Select dimensions
- Add filters
- Schedule report
- Export formats (PDF, Excel, CSV)
- Share reports

**Comparative Analytics:**
- Compare time periods
- Compare deals
- Compare campaigns
- Benchmark against industry
- Goal tracking
- Performance scoring

#### Loyalty & Repeat Business (`/merchant/loyalty`)
**Loyalty Programs:**

**Points Program:**
- Points earning rules
- Points per dollar spent
- Bonus point events
- Point redemption rules
- Point expiration settings
- Point balance tracking
- Automatic point awards

**Stamp/Visit Program:**
- Visits required for reward
- Digital stamp card design
- Automatic stamp on purchase
- Reward selection
- Visit tracking
- Expiration settings

**Dollar-Based Rewards:**
- Spend threshold for reward
- Reward value or percentage
- Reward tiers
- Automatic reward issuance
- Reward expiration

**Tiered Membership:**
- Membership tiers (Bronze, Silver, Gold, Platinum)
- Tier requirements
- Tier benefits per level
- Automatic tier upgrades
- Tier retention rules
- Exclusive deals per tier

**Member Dashboard:**
- View active members
- Member tier distribution
- Total rewards issued
- Total rewards redeemed
- Member engagement score
- Top members leaderboard

**Program Performance:**
- Total enrolled members
- Active members
- Reward redemption rate
- Program ROI
- Member spend increase
- Member retention impact

**Postcard Marketing:**
- Create postcard campaign
- Postcard design templates
- Custom design upload
- Postcard text editor
- Mailing list selection
- Target by ZIP code
- Target demographics
- Previous customer targeting
- EDDM (Every Door Direct Mail)

**Postcard Pricing:**
- Quantity selector
- Price calculator
- Design service add-on
- Mailing list upload
- Order summary
- Checkout

**Campaign Tracking:**
- Unique promo codes
- QR codes with tracking
- Campaign response rate
- ROI calculation
- A/B test results
- Redemption tracking

**Subscription Management:**
- Recurring revenue programs
- Create subscription plan
- Plan pricing tiers
- Billing frequency
- Subscription benefits
- Member management
- Subscription analytics
- Churn analysis

#### Postcards Page (`/merchant/postcards`)
**Campaign Manager:**
- All postcard campaigns
- Create new campaign
- Campaign status
- Delivery status
- Performance metrics

**Design Studio:**
- Template gallery
- Blank canvas
- Drag-and-drop editor
- Text tools
- Image upload
- Logo placement
- Color picker
- Font selector
- Preview (front & back)

**Mailing List:**
- Upload CSV
- Select from CRM
- Target by criteria
- ZIP code targeting
- Radius targeting
- Demographic filters
- Mailing list validation
- Duplicate removal

**Order & Checkout:**
- Postcard quantity
- Price calculation
- Shipping time estimate
- Promo code per campaign
- QR code generation
- Tracking setup
- Payment
- Order confirmation

**Campaign Analytics:**
- Postcards mailed
- Estimated delivery
- Promo code usage
- QR code scans
- Conversions
- ROI
- Cost per acquisition

#### Printing Services Page (`/merchant/printing`)
**Product Categories:**
- Business Cards
- Flyers & Brochures
- Posters & Banners
- Signage
- Marketing Materials
- Promotional Products

**Business Cards Section:**
- Standard (500) - $79
- Premium (1000) - $129
- Luxury (1500) - $179
- Design templates
- Custom design upload
- Paper options
- Finish options (Matte, Glossy, Uncoated)
- Add to cart

**Flyers & Brochures:**
- Flyers (500) - $89
- Brochures (250) - $149
- Tri-fold Brochures (500) - $199
- Size options
- Paper weight
- Color options
- Design templates

**Posters & Banners:**
- Posters 18x24 (10) - $129
- Banners 3x6 (1) - $89
- Vinyl Banners 4x8 (1) - $149
- Material options
- Indoor/outdoor options
- Mounting options

**Signage:**
- Yard Signs (10) - $99
- A-Frame Signs (1) - $179
- Window Decals (10) - $69
- Sizes and materials
- Weather resistance
- Installation options

**Promotional Products:**
- T-Shirts - from $12/ea
- Pens - $0.89/ea
- Mugs - $8/ea
- Tote Bags - $6/ea
- Keychains - $2/ea
- Magnets - $1.50/ea
- Stickers - $0.50/ea
- Water Bottles - $10/ea
- USB Drives - $5/ea
- Notebooks - $4/ea
- Quantity pricing tiers
- Customization options
- Color options

**Design Services:**
- Logo design - $299
- Business card design - $99
- Flyer design - $149
- Brochure design - $249
- Brand package - $999
- Upload requirements
- Revision rounds
- Turnaround time

**Shopping Cart & Checkout:**
- Cart summary
- Quantity editing
- Design upload
- Artwork approval
- Shipping address
- Shipping speed options
- Payment
- Order tracking

**Order History:**
- All printing orders
- Order status
- Reorder option
- Download artwork
- Track shipment
- Order details

#### Websites Page (`/merchant/websites`)
**Website Templates:**
- Template gallery
- Filter by industry:
  - Restaurant
  - Retail
  - Services
  - Professional
  - Healthcare
  - Fitness
  - Beauty
  - Automotive
- Template preview
- Live demo links
- Features list per template

**Template Details:**
- Template name
- Page count
- Features included:
  - Mobile responsive
  - SEO optimized
  - Contact forms
  - Google Maps
  - Social media integration
  - Online booking
  - E-commerce
  - Blog
  - Gallery
  - Testimonials
  - Live chat
- Customization options
- Price

**Website Packages:**
- Basic Template - $499
  - 5 pages
  - Mobile responsive
  - Basic SEO
  - Contact form
  - Social links
- Standard - $799
  - 10 pages
  - Everything in Basic
  - Google Maps
  - Image gallery
  - Newsletter signup
- Premium - $1,999
  - Custom design
  - 20 pages
  - Advanced SEO
  - Blog integration
  - E-commerce ready
- E-commerce - $2,999
  - Online store
  - Product catalog
  - Shopping cart
  - Payment processing
  - Inventory management
- Enterprise - $4,999+
  - Fully custom
  - Unlimited pages
  - Advanced features
  - API integrations
  - Dedicated support

**Additional Services:**
- Monthly hosting - $29/month
- Domain registration
- Email hosting
- SSL certificate
- Website maintenance
- Content updates
- SEO services
- Analytics setup

**Order Process:**
- Select package
- Provide information:
  - Business details
  - Content
  - Images
  - Brand guidelines
  - Feature requirements
- Design phase
- Review and revisions
- Launch
- Training

**Website Management:**
- Current websites
- Edit content (CMS)
- Update images
- Add pages
- Blog management
- SEO settings
- Analytics dashboard
- Support tickets

#### Ad Swipe File Page (`/merchant/swipe-file`)
**Access Options:**
- Monthly: $49/month
- One-Time: $497
- Lifetime: $997
- Feature comparison
- Subscribe buttons

**Template Library (After Subscription):**
- 500+ proven templates
- Categories:
  - E-commerce Ads
  - Service Business Ads
  - Restaurant Promotions
  - Retail Campaigns
  - Event Marketing
  - Holiday Campaigns
  - Seasonal Promotions
  - Grand Opening
  - Email Templates
  - Social Media Posts
  - Landing Pages
  - Sales Letters
  - Video Scripts

**Template Browser:**
- Search templates
- Filter by category
- Filter by industry
- Filter by format
- Sort by popularity
- Sort by newest
- Favorite templates

**Template Detail:**
- Preview image
- Template description
- Use case
- Industry
- Conversion rate data
- Copywriting formula
- Design notes
- Download formats
- Edit online option

**My Templates:**
- Saved/favorited templates
- Download history
- Customized templates
- Organize into folders

**Copywriting Resources:**
- Headline formulas
- Hook examples
- Call-to-action templates
- Emotional triggers
- Persuasion techniques
- Storytelling frameworks

#### AI & Automations Page (`/merchant/ai-bots`)
**AI Chatbot Section:**
- Chatbot builder
- Pre-trained responses
- Custom training
- FAQ integration
- 24/7 availability
- Multi-language support
- Lead qualification
- Appointment booking
- Order status updates
- Customer support
- Widget customization
- Analytics dashboard

**Marketing Automation:**
- Automated email sequences
- Drip campaigns
- Trigger-based emails
- SMS automation
- Social media scheduling
- Post scheduling
- Content calendar
- Auto-responders
- Lead nurturing
- Cart abandonment

**AI Content Creation:**
- Ad copy generator
  - Input: product/service
  - Output: multiple variations
- Social media post generator
  - Platform selection
  - Tone selection
  - Topic input
- Email subject lines
- Product descriptions
- Blog post ideas
- Video script outlines
- Meta descriptions
- Hashtag suggestions

**Workflow Automation:**
- Visual workflow builder
- Trigger selection
- Action selection
- Condition logic
- Delay settings
- Workflow templates:
  - New lead notification
  - Welcome sequence
  - Birthday greetings
  - Review requests
  - Reorder reminders
  - Appointment reminders

**Automation Analytics:**
- Active automations
- Trigger count
- Success rate
- Time saved
- ROI calculation
- Optimization tips

#### Recruiting Tools Page (`/merchant/recruiting`)
**Job Posting Section:**
- Create job posting
- Job title
- Job description (editor)
- Requirements
- Qualifications
- Salary range
- Job type (Full-time, Part-time, Contract)
- Location
- Benefits
- Application deadline

**Multi-Platform Distribution:**
- Indeed
- LinkedIn
- ZipRecruiter
- Google Jobs
- Facebook Jobs
- Craigslist
- Company career page
- One-click posting to all

**Applicant Tracking:**
- All applicants dashboard
- Applicant cards
- Resume viewing
- Application status:
  - New
  - Reviewing
  - Phone Screen
  - Interview Scheduled
  - Interviewed
  - Offer Made
  - Hired
  - Rejected
- Drag-and-drop status change
- Filter by status
- Search applicants

**Applicant Detail:**
- Personal information
- Resume (PDF viewer)
- Cover letter
- Application answers
- Interview notes
- Team feedback
- Rating/scoring
- Interview availability
- Communication history
- Schedule interview
- Send messages
- Make offer
- Reject applicant

**Interview Scheduling:**
- Calendar integration
- Available time slots
- Send interview invitations
- Video meeting link generation
- Interview reminders
- Interview feedback form

**Hiring Funnel:**
- Pre-screening questions
- Skills assessments
- Personality tests
- Reference checks
- Background checks ($29/candidate)
- Offer letter generation
- E-signature
- Onboarding checklist

**Resume Services:**
- Professional Resume Writing - $199
  - Professional writer assigned
  - 1-hour consultation
  - Draft within 5 days
  - 2 revision rounds
  - Cover letter included
  - LinkedIn optimization
- Executive Resume - $399
  - Everything in Professional
  - C-level positioning
  - Achievement highlights
  - Executive summary
  - 3 revision rounds
  - Thank you letter

**Interview Coaching:**
- $149/hour
- Mock interviews
- Question preparation
- Answer strategies
- Body language tips
- Confidence building
- Industry-specific prep

**Job Templates:**
- Position description templates
- Interview question banks
- Evaluation rubrics
- Offer letter templates
- Rejection email templates
- Onboarding checklists

**Recruiting Analytics:**
- Total job postings
- Total applicants
- Application sources
- Time to hire
- Cost per hire
- Quality of hire
- Offer acceptance rate
- Hiring funnel metrics

#### Business Capital Page (`/merchant/capital`)
**Capital Overview:**
- Working capital loans
- Equipment financing
- Term loans
- Lines of credit
- Revenue-based financing
- Merchant cash advances

**Loan Products:**

**Working Capital:**
- Amount: $5,000 - $500,000
- Term: 3-24 months
- No collateral required
- Fast approval (24-48 hours)
- Revenue-based repayment
- Starting at 1.2% factor rate
- Apply button

**Equipment Financing:**
- Amount: $10,000 - $500,000
- Term: 12-60 months
- New or used equipment
- Equipment as collateral
- Tax benefits
- Starting at 4.9% APR
- Apply button

**Term Loan:**
- Amount: $25,000 - $500,000
- Term: 1-5 years
- Fixed monthly payments
- Competitive rates
- No prepayment penalty
- Starting at 6.5% APR
- Apply button

**Line of Credit:**
- Amount: $10,000 - $250,000
- Revolving credit
- Pay interest only on used amount
- Flexible repayment
- Starting at 8% APR
- Apply button

**Loan Calculator:**
- Loan amount slider
- Term selector
- Rate input
- Calculate payment
- Total cost display
- Interest paid
- APR calculation

**Application Process:**

**Step 1: Basic Information**
- Business name
- Contact information
- Years in business
- Business structure
- Industry

**Step 2: Financial Information**
- Annual revenue
- Monthly revenue
- Bank statements upload
- Tax returns (optional)
- Outstanding debt

**Step 3: Loan Details**
- Desired loan amount
- Purpose of loan
- Desired term
- Collateral (if applicable)

**Step 4: Review & Submit**
- Review application
- E-signature
- Terms acceptance
- Submit

**Application Status:**
- Application tracking
- Approval status
- Required documents
- Loan officer contact
- Messages/updates

**Active Loans:**
- Loan balance
- Payment schedule
- Next payment due
- Payment history
- Make payment
- Early payoff calculator
- Refinance option

**Loan Analytics:**
- Total borrowed
- Total repaid
- Outstanding balance
- Payment history
- Credit score impact
- Refinancing opportunities

### Merchant Services & Settings

#### Merchant Services Application (`/merchant/merchant-services`)
**Application Type Selection:**
- Standard Business
- High-Risk Business
- Info about each type
- Industry check

**Standard Business Application:**

**Business Information:**
- Legal business name
- DBA name
- Federal Tax ID
- Business type
- Business category
- Years in business
- Website URL

**Processing Information:**
- Expected monthly volume
- Average transaction size
- Card present percentage
- Card not present percentage
- Largest transaction
- Seasonal business (yes/no)

**Bank Information:**
- Bank name
- Account holder name
- Account number
- Routing number
- Account type
- Bank statement upload

**Business Owner Information:**
- Full name
- SSN (encrypted)
- Date of birth
- Home address
- Phone
- Email
- Ownership percentage

**Documentation Upload:**
- Business license
- Voided check
- Driver's license
- Articles of incorporation
- Recent bank statements (3 months)

**High-Risk Business Application:**
(All standard fields PLUS)

**Industry Specific:**
- High-risk industry type:
  - CBD/Hemp
  - Nutraceuticals
  - Adult Entertainment
  - Travel Services
  - Subscription Services
  - Forex/Crypto
  - Collection Agencies
  - Tech Support
  - Tobacco/Vape
  - Firearms
  - Debt Relief
  - Credit Repair
  - Gaming
  - Telemarketing
- Monthly volume (higher limits)
- Average ticket size
- Chargeback history
- Previous processor info
- Reason for termination (if applicable)

**Risk Mitigation:**
- Fraud prevention measures
- Customer verification process
- Refund policy
- Shipping policy
- Terms of service
- Privacy policy URL
- Customer service hours
- Dispute resolution process

**Compliance:**
- Industry licenses upload
- Compliance certificates
- Age verification process
- Restricted states/countries
- Product/service descriptions
- Marketing materials

**Additional Documentation:**
- Processing history (6-12 months)
- Chargeback reports
- Tax returns
- Personal financial statement
- Business plan
- Supplier agreements

**Review & Submit:**
- Application review
- Accuracy confirmation
- E-signature
- Submit for underwriting
- Estimated approval time (3-7 business days)

**Application Status:**
- Under review
- Additional info needed
- Approved
- Declined
- Reason for status
- Next steps
- Contact underwriter

**Approved - Next Steps:**
- Welcome message
- Account setup
- Equipment ordering
- API credentials
- Testing mode
- Go-live checklist

#### Payment Settings Page (`/merchant/payment-settings`)
**GoPayBright Integration:**
- Connection status (Connected/Disconnected)
- API credentials display (masked)
- Test mode toggle
- Live mode toggle
- Webhook URL display
- Webhook secret
- Connection test button
- Reconnect button
- Documentation link

**Payout Settings:**
- Bank account on file
- Change bank account
- Payout schedule:
  - Daily
  - Weekly (select day)
  - Bi-weekly
  - Monthly (select date)
- Minimum payout threshold
- Automatic payouts toggle
- Manual payout button

**Payout History:**
- All payouts table
- Payout date
- Amount
- Status (Pending, Completed, Failed)
- Bank account (last 4)
- Transaction count
- View details
- Download statement

**Payment Methods:**
- Accepted cards display
  - Visa
  - Mastercard
  - American Express
  - Discover
  - Debit cards
- Enable/disable per card type
- Alternative payment methods (future)
- Currency settings

**Tax Settings:**
- Tax collection enabled
- Tax rate percentage
- Tax ID display
- Tax exempt customers
- Tax reporting

**Payment Notifications:**
- Email on successful payment
- Email on failed payment
- SMS notifications
- Webhook notifications
- Notification recipients
- Custom notification messages

**Transaction Settings:**
- Minimum transaction amount
- Maximum transaction amount
- Tip/gratuity options
- Surcharge options
- Convenience fees
- Refund policy
- Partial refund enabled

**Security Settings:**
- PCI compliance status
- Fraud detection enabled
- 3D Secure enabled
- Address verification
- CVV verification
- Velocity checks
- Blocked cards list

#### Support Center (`/merchant/support`)
**Support Dashboard:**
- Knowledge base search
- Popular articles
- Quick links
- Video tutorials
- Contact options

**Knowledge Base:**
- Getting Started
- Creating Deals
- Managing Customers
- CRM Guide
- Invoicing Help
- Marketing Tools
- Analytics & Reports
- Troubleshooting
- FAQs
- Search articles
- Browse by category
- Recently viewed

**Video Tutorials:**
- Tutorial library
- Getting started series
- Feature deep dives
- Best practices
- Success stories
- Filter by topic
- Search videos

**Create Support Ticket:**
- Ticket form
- Subject
- Category dropdown
- Priority level
- Description (rich text)
- Attach screenshots
- Attach files
- Current page info
- Browser info
- Submit ticket

**My Tickets:**
- All support tickets
- Open tickets
- Closed tickets
- Ticket number
- Subject
- Status
- Priority
- Created date
- Last updated
- Assigned to
- View ticket

**Ticket Detail:**
- Full conversation
- Ticket status
- Priority
- Created date
- Support agent assigned
- Add reply
- Attach files
- Mark as resolved
- Rate support experience

**Contact Options:**
- Email support (all tiers)
- Phone support (Professional & Enterprise)
- Live chat (Professional & Enterprise)
- Support hours display
- Expected response time
- Emergency contact (Enterprise)

**System Status:**
- Platform status
- All systems operational
- Incidents history
- Scheduled maintenance
- Subscribe to updates

#### Settings Page (`/merchant/settings`)
**Tabs:**
- Business Profile
- Account Settings
- Notification Preferences
- Team Management
- Billing & Subscription

**Business Profile Tab:**
- All business information
- Edit business name
- Edit description
- Edit contact info
- Edit address
- Edit phone
- Edit website
- Edit social media
- Business hours
- Logo management
- Cover photo
- Save changes

**Account Settings Tab:**
- Email address
- Change email
- Password section
- Change password
- Two-factor authentication
  - Enable/disable
  - Setup with authenticator app
  - Backup codes
- Login history
  - Date/time
  - IP address
  - Location
  - Device
  - Browser
- Active sessions
  - Current session
  - Other sessions
  - Revoke session
- Security settings
- Privacy settings

**Notification Preferences Tab:**
- Email Notifications:
  - New purchase
  - New redemption
  - New review
  - New lead
  - Payment received
  - Payment failed
  - Deal expiring soon
  - Low inventory
  - Customer messages
  - System updates
  - Marketing tips
  - Newsletter
- SMS Notifications:
  - New purchase
  - Payment received
  - Critical alerts
- Push Notifications (future)
- Notification frequency
- Quiet hours
- Email digest option

**Team Management Tab:**
(Professional & Enterprise only)
- Current team members
- Member name
- Email
- Role
- Permissions
- Status
- Last active
- Actions

**Add Team Member:**
- Email address
- First name
- Last name
- Role selection:
  - Owner
  - Admin
  - Manager
  - Staff
  - Read-only
- Custom permissions
- Send invitation

**Role Permissions:**
- View deals
- Create deals
- Edit deals
- Delete deals
- Redeem vouchers
- View customers
- Manage customers
- View invoices
- Create invoices
- View reports
- Manage settings
- Manage team
- Full access

**Billing & Subscription Tab:**
- Current plan display
- Plan features
- Plan cost
- Billing cycle
- Next payment date
- Upgrade plan button
- Downgrade plan button
- Cancel subscription

**Payment Method:**
- Card on file (last 4 digits)
- Expiration date
- Update payment method
- Add new payment method
- Remove payment method

**Billing History:**
- All invoices
- Invoice date
- Amount
- Status (Paid, Pending, Failed)
- Download invoice PDF
- View details

**Usage & Limits:**
- Current usage metrics
- CRM leads used / limit
- Storage used / limit
- Team members used / limit
- API calls used / limit
- Email sends used / limit
- Upgrade for more

**Subscription Management:**
- View plan comparison
- Upgrade now
- Downgrade (confirm)
- Cancel subscription (confirm)
- Cancellation feedback
- Reactivate subscription

---

## 🔧 BACKEND & INFRASTRUCTURE

### Database Architecture (Supabase/PostgreSQL)

#### Core Tables

**1. profiles**
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- first_name
- last_name
- phone
- address
- city
- state
- zip_code
- date_of_birth
- profile_picture_url
- created_at
- updated_at
- RLS policies for user access

**2. customers**
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- referral_code (unique)
- referred_by (UUID, FK to customers)
- total_purchases
- total_spent
- total_saved
- favorite_categories (array)
- email_notifications_enabled
- sms_notifications_enabled
- created_at
- updated_at
- RLS policies

**3. merchants**
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- business_name
- business_legal_name
- business_category
- business_description
- tax_id
- website_url
- logo_url
- cover_photo_url
- phone
- email
- address
- city
- state
- zip_code
- latitude
- longitude
- business_hours (JSONB)
- social_media (JSONB)
- status (pending, approved, active, suspended, rejected)
- approval_date
- subscription_tier (starter, professional, enterprise)
- subscription_status (active, cancelled, past_due)
- subscription_start_date
- subscription_end_date
- stripe_customer_id
- total_revenue
- total_deals
- total_customers
- rating_average
- rating_count
- created_at
- updated_at
- RLS policies

**4. deals**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- title
- description
- category
- deal_type (percentage_off, dollar_off, bogo, fixed_price, package, bundle)
- original_price
- sale_price
- discount_percentage
- cost_of_goods
- profit_margin
- image_url
- gallery_images (array)
- total_quantity
- quantity_sold
- quantity_remaining
- unlimited_quantity
- per_customer_limit
- daily_limit_per_customer
- start_date
- end_date
- always_available
- days_available (array)
- times_available (JSONB)
- recurring
- terms_and_conditions
- redemption_instructions
- restrictions
- expiration_days
- status (draft, active, paused, expired, archived)
- is_featured
- is_promoted
- view_count
- click_count
- conversion_rate
- created_at
- updated_at
- RLS policies

**5. purchases**
- id (UUID, PK)
- customer_id (UUID, FK to customers)
- merchant_id (UUID, FK to merchants)
- deal_id (UUID, FK to deals)
- quantity
- original_price
- sale_price
- discount_amount
- subtotal
- tax_amount
- total_amount
- payment_intent_id
- payment_status (pending, completed, failed, refunded)
- payment_method
- redemption_code (unique)
- qr_code_url
- redeemed
- redeemed_at
- redeemed_by (UUID, FK to profiles)
- redemption_location
- expired
- refunded
- refund_amount
- refund_reason
- created_at
- updated_at
- RLS policies

**6. favorites**
- id (UUID, PK)
- customer_id (UUID, FK to customers)
- deal_id (UUID, FK to deals)
- created_at
- Unique constraint on (customer_id, deal_id)
- RLS policies

**7. reviews**
- id (UUID, PK)
- customer_id (UUID, FK to customers)
- merchant_id (UUID, FK to merchants)
- deal_id (UUID, FK to deals, nullable)
- purchase_id (UUID, FK to purchases, nullable)
- rating (1-5)
- review_text
- verified_purchase
- merchant_response
- merchant_response_at
- helpful_count
- flagged
- status (pending, approved, rejected)
- created_at
- updated_at
- RLS policies

#### CRM Tables

**8. crm_leads**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- customer_id (UUID, FK to customers, nullable)
- first_name
- last_name
- email
- phone
- company
- job_title
- address
- city
- state
- zip_code
- lead_source (marketplace, website, referral, walkin, manual, import, other)
- lead_status (new, contacted, qualified, proposal, negotiation, won, lost)
- lead_score (0-100)
- assigned_to (UUID, FK to profiles)
- tags (array)
- custom_fields (JSONB)
- estimated_value
- expected_close_date
- lost_reason
- won_date
- notes
- created_at
- updated_at
- RLS policies

**9. crm_activities**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- lead_id (UUID, FK to crm_leads)
- activity_type (note, call, email, meeting, task, status_change, purchase)
- subject
- description
- activity_date
- created_by (UUID, FK to profiles)
- created_at
- RLS policies

**10. crm_tasks**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- lead_id (UUID, FK to crm_leads)
- assigned_to (UUID, FK to profiles)
- title
- description
- due_date
- priority (low, medium, high)
- status (pending, in_progress, completed, cancelled)
- reminder_date
- completed_at
- created_by (UUID, FK to profiles)
- created_at
- updated_at
- RLS policies

**11. crm_subscriptions**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- tier (starter, professional, enterprise)
- status (active, cancelled, past_due)
- current_leads_count
- max_leads
- price
- billing_cycle (monthly, yearly)
- start_date
- end_date
- next_billing_date
- stripe_subscription_id
- created_at
- updated_at
- RLS policies

#### Invoicing & Accounting Tables

**12. invoices**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- customer_id (UUID, FK to customers, nullable)
- lead_id (UUID, FK to crm_leads, nullable)
- invoice_number (unique, auto-generated)
- customer_name
- customer_email
- customer_phone
- customer_address
- invoice_date
- due_date
- payment_terms
- subtotal
- tax_rate
- tax_amount
- discount_amount
- total_amount
- amount_paid
- balance_due
- status (draft, sent, viewed, paid, overdue, cancelled)
- payment_link
- payment_intent_id
- paid_at
- notes
- terms_and_conditions
- recurring (boolean)
- recurring_frequency (weekly, monthly, quarterly, yearly)
- next_invoice_date
- sent_at
- viewed_at
- reminder_sent_at
- created_at
- updated_at
- RLS policies

**13. invoice_line_items**
- id (UUID, PK)
- invoice_id (UUID, FK to invoices)
- description
- quantity
- unit_price
- tax_rate
- tax_amount
- line_total
- created_at
- RLS policies

**14. payments**
- id (UUID, PK)
- invoice_id (UUID, FK to invoices, nullable)
- merchant_id (UUID, FK to merchants)
- customer_id (UUID, FK to customers, nullable)
- amount
- payment_method (card, cash, check, bank_transfer, ach)
- payment_date
- transaction_id
- reference_number
- notes
- created_at
- RLS policies

**15. expenses**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- category (rent, utilities, payroll, marketing, supplies, equipment, insurance, other)
- vendor
- description
- amount
- expense_date
- payment_method
- receipt_url
- tax_deductible
- notes
- created_at
- updated_at
- RLS policies

**16. expense_categories**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- name
- description
- created_at
- RLS policies

#### Marketing & Loyalty Tables

**17. marketing_campaigns**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- campaign_name
- campaign_type (email, sms, social, postcard)
- status (draft, scheduled, active, completed, cancelled)
- target_segment (JSONB)
- content (JSONB)
- scheduled_date
- sent_date
- recipients_count
- opened_count
- clicked_count
- converted_count
- revenue_generated
- cost
- roi
- created_at
- updated_at
- RLS policies

**18. customer_segments**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- segment_name
- description
- criteria (JSONB)
- customer_count
- created_at
- updated_at
- RLS policies

**19. email_templates**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- template_name
- subject_line
- html_content
- text_content
- variables (array)
- created_at
- updated_at
- RLS policies

**20. loyalty_programs**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- program_type (points, stamps, dollar_based, tiered)
- program_name
- description
- rules (JSONB)
- rewards (JSONB)
- status (active, paused, expired)
- enrolled_count
- created_at
- updated_at
- RLS policies

**21. loyalty_members**
- id (UUID, PK)
- loyalty_program_id (UUID, FK to loyalty_programs)
- customer_id (UUID, FK to customers)
- points_balance
- stamps_count
- tier_level
- tier_name
- lifetime_points
- enrolled_date
- last_activity_date
- created_at
- updated_at
- RLS policies

**22. loyalty_transactions**
- id (UUID, PK)
- loyalty_member_id (UUID, FK to loyalty_members)
- transaction_type (earn, redeem, expire, adjust)
- points_amount
- description
- purchase_id (UUID, FK to purchases, nullable)
- created_at
- RLS policies

**23. postcard_campaigns**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- campaign_name
- quantity
- design_url
- design_template
- design_customization (JSONB)
- mailing_list (JSONB)
- target_zip_codes (array)
- promo_code
- qr_code_url
- price
- status (draft, ordered, printing, mailed, completed)
- ordered_date
- mailed_date
- responses_count
- conversions_count
- roi
- created_at
- updated_at
- RLS policies

**24. subscriptions**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- plan_name
- plan_description
- price
- billing_frequency (weekly, monthly, yearly)
- benefits (JSONB)
- subscriber_count
- status (active, paused)
- created_at
- updated_at
- RLS policies

**25. subscription_members**
- id (UUID, PK)
- subscription_id (UUID, FK to subscriptions)
- customer_id (UUID, FK to customers)
- status (active, paused, cancelled)
- start_date
- end_date
- next_billing_date
- stripe_subscription_id
- created_at
- updated_at
- RLS policies

#### Printing & Services Tables

**26. printing_products**
- id (UUID, PK)
- category (business_cards, flyers, brochures, posters, banners, signage, marketing_materials, promotional_products)
- product_name
- description
- base_price
- quantity_included
- image_url
- options (JSONB)
- specifications (JSONB)
- status (active, inactive)
- created_at
- updated_at
- RLS policies (public read)

**27. printing_orders**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- order_number (unique)
- products (JSONB)
- subtotal
- shipping_cost
- tax_amount
- total_amount
- design_files (array)
- shipping_address (JSONB)
- shipping_speed
- status (pending, processing, printing, shipped, delivered, cancelled)
- tracking_number
- payment_intent_id
- payment_status
- ordered_date
- shipped_date
- delivered_date
- created_at
- updated_at
- RLS policies

**28. website_templates**
- id (UUID, PK)
- template_name
- description
- category
- features (array)
- page_count
- price
- preview_url
- demo_url
- thumbnail_url
- status (active, inactive)
- created_at
- updated_at
- RLS policies (public read)

**29. website_orders**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- template_id (UUID, FK to website_templates, nullable)
- package_type (basic, standard, premium, ecommerce, enterprise)
- price
- business_info (JSONB)
- content_provided (JSONB)
- design_preferences (JSONB)
- status (pending, design, review, development, launched)
- domain_name
- hosting_url
- payment_intent_id
- payment_status
- ordered_date
- launched_date
- created_at
- updated_at
- RLS policies

**30. swipe_file_templates**
- id (UUID, PK)
- category (ecommerce, service, restaurant, retail, event, holiday, seasonal, email, social, landing, sales_letter, video_script)
- template_name
- description
- industry
- format
- preview_image_url
- template_file_url
- conversion_rate
- use_cases (array)
- copywriting_formula
- design_notes
- popularity_score
- created_at
- updated_at
- RLS policies (subscribers only)

**31. swipe_file_subscriptions**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- subscription_type (monthly, one_time, lifetime)
- price_paid
- status (active, cancelled, expired)
- start_date
- end_date
- stripe_subscription_id (nullable)
- created_at
- updated_at
- RLS policies

#### Recruiting Tables

**32. job_postings**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- job_title
- job_description
- requirements
- qualifications
- salary_range_min
- salary_range_max
- job_type (full_time, part_time, contract, temporary)
- location
- remote_option
- benefits
- application_deadline
- status (draft, active, paused, filled, closed)
- platforms (array)
- views_count
- applications_count
- created_at
- updated_at
- RLS policies

**33. job_applications**
- id (UUID, PK)
- job_posting_id (UUID, FK to job_postings)
- merchant_id (UUID, FK to merchants)
- applicant_name
- applicant_email
- applicant_phone
- resume_url
- cover_letter
- application_answers (JSONB)
- status (new, reviewing, phone_screen, interview_scheduled, interviewed, offer_made, hired, rejected)
- rating
- interview_notes
- interview_date
- team_feedback (JSONB)
- rejection_reason
- created_at
- updated_at
- RLS policies

#### Business Capital Tables

**34. capital_applications**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- loan_type (working_capital, equipment, term_loan, line_of_credit)
- requested_amount
- loan_term
- business_revenue_annual
- business_revenue_monthly
- purpose
- documents (JSONB)
- status (pending, under_review, approved, declined, funded)
- approval_amount
- approval_terms (JSONB)
- decline_reason
- funded_date
- application_date
- reviewed_date
- created_at
- updated_at
- RLS policies

**35. capital_loans**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- application_id (UUID, FK to capital_applications)
- loan_amount
- interest_rate
- term_months
- payment_amount
- payment_frequency
- total_payments
- payments_made
- balance_remaining
- status (active, paid_off, defaulted)
- funded_date
- first_payment_date
- last_payment_date
- created_at
- updated_at
- RLS policies

**36. loan_payments**
- id (UUID, PK)
- loan_id (UUID, FK to capital_loans)
- payment_amount
- principal_amount
- interest_amount
- payment_date
- payment_method
- transaction_id
- created_at
- RLS policies

#### Merchant Services Tables

**37. merchant_processing_applications**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- application_type (standard, high_risk)
- business_info (JSONB)
- processing_info (JSONB)
- bank_info (JSONB)
- owner_info (JSONB)
- documents (JSONB)
- high_risk_info (JSONB, nullable)
- status (pending, under_review, approved, declined, active)
- approval_date
- decline_reason
- merchant_account_id
- rates (JSONB)
- created_at
- updated_at
- RLS policies

**38. payment_transactions**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- transaction_type (sale, refund, void)
- amount
- fee_amount
- net_amount
- card_type
- card_last4
- transaction_id
- payment_intent_id
- status (pending, completed, failed)
- transaction_date
- settled_date
- created_at
- RLS policies

**39. merchant_payouts**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- payout_amount
- fee_amount
- net_amount
- transaction_count
- payout_date
- bank_account_last4
- status (pending, completed, failed)
- stripe_payout_id
- created_at
- RLS policies

#### Admin & Partner Tables

**40. admins**
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- role (super_admin, admin, support)
- permissions (JSONB)
- created_at
- updated_at
- RLS policies

**41. admin_activities**
- id (UUID, PK)
- admin_id (UUID, FK to admins)
- activity_type
- description
- affected_entity_type
- affected_entity_id
- metadata (JSONB)
- created_at
- RLS policies

**42. partner_applications**
- id (UUID, PK)
- applicant_name
- email
- phone
- business_experience
- territory_preferences (array)
- financial_qualifications (JSONB)
- references (JSONB)
- application_data (JSONB)
- status (pending, under_review, approved, declined)
- reviewed_by (UUID, FK to admins)
- reviewed_at
- decline_reason
- created_at
- updated_at
- RLS policies

**43. partners**
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- partner_code (unique)
- territories (array)
- commission_rate
- tier (bronze, silver, gold, platinum)
- total_revenue
- total_merchants
- total_commission_earned
- training_completed
- training_completion_date
- performance_score
- status (active, suspended, terminated)
- created_at
- updated_at
- RLS policies

**44. territories**
- id (UUID, PK)
- territory_name
- zip_codes (array)
- state
- partner_id (UUID, FK to partners, nullable)
- status (available, assigned, inactive, pending_review)
- population
- merchant_count
- revenue
- assignment_date
- performance_metrics (JSONB)
- created_at
- updated_at
- RLS policies

**45. expansion_requests**
- id (UUID, PK)
- partner_id (UUID, FK to partners)
- requested_territories (array)
- justification
- performance_history (JSONB)
- status (pending, approved, declined, counter_offered)
- reviewed_by (UUID, FK to admins)
- reviewed_at
- admin_notes
- created_at
- updated_at
- RLS policies

**46. partner_commissions**
- id (UUID, PK)
- partner_id (UUID, FK to partners)
- commission_type (marketplace, crm_subscription, addon_service, merchant_services)
- revenue_amount
- commission_rate
- commission_amount
- merchant_id (UUID, FK to merchants)
- transaction_date
- payout_date
- payout_status (pending, paid)
- created_at
- RLS policies

**47. partner_overrides**
- id (UUID, PK)
- partner_id (UUID, FK to partners)
- override_type
- override_value
- reason
- expires_at
- created_by (UUID, FK to admins)
- created_at
- RLS policies

**48. inactivity_warnings**
- id (UUID, PK)
- territory_id (UUID, FK to territories)
- partner_id (UUID, FK to partners)
- warning_type (low_activity, no_merchants, compliance_issue)
- severity (low, medium, high, critical)
- issue_description
- resolution_deadline
- status (pending, acknowledged, resolved, escalated)
- created_at
- resolved_at
- RLS policies

**49. appointments**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants, nullable)
- admin_id (UUID, FK to admins)
- appointment_type (onboarding, support, sales, training)
- scheduled_date
- duration_minutes
- location_type (in_person, video, phone)
- location_details
- meeting_link
- notes
- status (scheduled, completed, cancelled, no_show)
- created_at
- updated_at
- RLS policies

**50. notifications**
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- notification_type
- title
- message
- link
- read
- read_at
- created_at
- RLS policies

**51. webhook_events**
- id (UUID, PK)
- event_type
- source (gopaybright, stripe, other)
- payload (JSONB)
- processed
- processed_at
- error_message
- created_at
- RLS policies

**52. system_settings**
- id (UUID, PK)
- setting_key (unique)
- setting_value (JSONB)
- description
- updated_by (UUID, FK to admins)
- updated_at
- created_at
- RLS policies

#### Additional Tables

**53. customer_preferences**
- id (UUID, PK)
- customer_id (UUID, FK to customers)
- preferred_categories (array)
- price_range_min
- price_range_max
- deal_alert_frequency
- notification_preferences (JSONB)
- created_at
- updated_at
- RLS policies

**54. referrals**
- id (UUID, PK)
- referrer_id (UUID, FK to customers)
- referee_id (UUID, FK to customers)
- referral_code
- status (pending, completed)
- reward_earned
- reward_paid
- created_at
- completed_at
- RLS policies

**55. gift_cards**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- card_code (unique)
- initial_balance
- current_balance
- purchaser_customer_id (UUID, FK to customers)
- recipient_email
- recipient_name
- message
- status (active, redeemed, expired, cancelled)
- purchased_date
- expires_at
- created_at
- updated_at
- RLS policies

**56. memberships**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- membership_name
- description
- price
- billing_frequency
- benefits (JSONB)
- member_count
- status (active, inactive)
- created_at
- updated_at
- RLS policies

**57. membership_subscribers**
- id (UUID, PK)
- membership_id (UUID, FK to memberships)
- customer_id (UUID, FK to customers)
- status (active, paused, cancelled)
- start_date
- end_date
- next_billing_date
- created_at
- updated_at
- RLS policies

**58. surveys**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- survey_title
- description
- questions (JSONB)
- status (draft, active, closed)
- response_count
- created_at
- updated_at
- RLS policies

**59. survey_responses**
- id (UUID, PK)
- survey_id (UUID, FK to surveys)
- customer_id (UUID, FK to customers, nullable)
- responses (JSONB)
- submitted_at
- RLS policies

**60. support_tickets**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- ticket_number (unique)
- subject
- category
- priority (low, medium, high, critical)
- description
- status (open, in_progress, waiting_response, resolved, closed)
- assigned_to (UUID, FK to admins, nullable)
- created_at
- resolved_at
- updated_at
- RLS policies

**61. support_ticket_messages**
- id (UUID, PK)
- ticket_id (UUID, FK to support_tickets)
- sender_id (UUID, FK to profiles)
- message
- attachments (array)
- created_at
- RLS policies

**62. deal_templates**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- template_name
- template_data (JSONB)
- created_at
- updated_at
- RLS policies

**63. deal_schedules**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- template_id (UUID, FK to deal_templates)
- recurrence_rule (JSONB)
- next_publish_date
- status (active, paused)
- created_at
- updated_at
- RLS policies

**64. ad_performance**
- id (UUID, PK)
- merchant_id (UUID, FK to merchants)
- deal_id (UUID, FK to deals, nullable)
- campaign_id (UUID, FK to marketing_campaigns, nullable)
- impressions
- clicks
- conversions
- revenue
- cost
- roi
- date
- created_at
- RLS policies

**65. customer_journey_tracking**
- id (UUID, PK)
- customer_id (UUID, FK to customers, nullable)
- session_id
- page_views (JSONB)
- actions (JSONB)
- referrer
- device_type
- browser
- location
- created_at
- RLS policies

### Database Functions

**1. create_customer_on_signup()**
- Trigger function
- Creates customer record after user registration
- Generates unique referral code
- Sets default preferences

**2. create_merchant_on_signup()**
- Trigger function
- Creates merchant record after user registration
- Sets initial status to "pending"
- Creates default settings

**3. update_deal_quantities()**
- Trigger function
- Updates quantity_remaining after purchase
- Checks if deal should be paused (sold out)
- Updates conversion rates

**4. update_merchant_revenue()**
- Trigger function
- Updates merchant total revenue after payment
- Updates total purchases count
- Recalculates average order value

**5. update_lead_count()**
- Trigger function
- Updates CRM subscription usage
- Checks if limit exceeded
- Triggers notifications

**6. calculate_commission()**
- Function
- Calculates partner commission
- Applies tier bonuses
- Records commission transaction

**7. generate_invoice_number()**
- Function
- Auto-generates unique invoice numbers
- Format: INV-00001
- Sequential numbering

**8. check_eligibility()**
- Function
- Checks customer eligibility for purchase
- Validates per-customer limits
- Checks expiration dates

**9. process_redemption()**
- Function
- Validates redemption code
- Updates purchase status
- Sends confirmation emails
- Updates analytics

**10. calculate_territory_performance()**
- Function
- Aggregates territory metrics
- Calculates performance scores
- Identifies underperforming territories

**11. send_payment_reminder()**
- Function
- Sends automated invoice reminders
- Tracks reminder history
- Updates reminder timestamps

**12. expire_deals()**
- Scheduled function (cron)
- Checks for expired deals
- Updates deal status
- Sends merchant notifications

**13. process_recurring_invoices()**
- Scheduled function (cron)
- Generates recurring invoices
- Sends to customers
- Updates next invoice dates

**14. calculate_merchant_payouts()**
- Scheduled function (weekly)
- Calculates payout amounts
- Deducts platform fees
- Initiates bank transfers

### Row Level Security (RLS) Policies

**All tables have comprehensive RLS policies including:**

**For Customers:**
- View own data only
- Create own favorites
- View own purchases
- Update own profile
- View public deal data

**For Merchants:**
- View own business data
- Manage own deals
- View own customers/purchases
- Manage own CRM data
- View own financial data
- Cannot access other merchants' data

**For Admins:**
- View all data
- Manage all merchants
- Manage partners
- Access financial reports
- System settings access

**For Partners:**
- View assigned territory data
- View merchants in territory
- View commission data
- Cannot access other partners' data

**Public Access:**
- View active deals
- View merchant public profiles
- View public reviews
- No access to sensitive data

### Indexes for Performance

**Primary Indexes:**
- All foreign keys indexed
- Email fields indexed
- Status fields indexed
- Date fields indexed for range queries
- Search fields (full-text search indexes)

**Composite Indexes:**
- (merchant_id, status) on deals
- (customer_id, created_at) on purchases
- (merchant_id, lead_status) on crm_leads
- (merchant_id, status) on invoices
- (partner_id, created_at) on partner_commissions

### Edge Functions (Supabase)

**1. appointment-notification**
- Sends email notifications for appointments
- Triggered when appointment created/updated
- Includes calendar invite
- Reminder emails before appointment

**2. capital-application-notification**
- Notifies admins of new capital applications
- Sends acknowledgment to merchant
- Updates application status
- Triggers review workflow

**3. compute-eligibility**
- Checks customer eligibility for deals
- Validates purchase limits
- Checks account status
- Returns eligibility result

**4. deal-approve-with-qr**
- Approves deals from admin
- Generates QR codes for redemption
- Updates deal status
- Notifies merchant

**5. expansion-manage**
- Handles partner expansion requests
- Validates eligibility
- Approves/declines requests
- Updates territories

**6. expansion-request**
- Processes new expansion requests
- Checks partner qualifications
- Validates territory availability
- Creates request record

**7. partner-application-approve**
- Approves partner applications
- Creates partner account
- Assigns initial territories
- Sends welcome email

**8. partner-application-decline**
- Declines partner applications
- Records decline reason
- Sends notification email
- Updates application status

**9. partner-health**
- Monitors partner performance
- Identifies issues
- Creates warnings
- Sends notifications

**10. partner-override-manage**
- Manages partner overrides
- Validates admin permissions
- Records override history
- Updates partner settings

**11. paybright-auth**
- Handles GoPayBright OAuth
- Manages API credentials
- Refreshes access tokens
- Validates merchant accounts

**12. paybright-refund**
- Processes refund requests
- Communicates with GoPayBright
- Updates payment status
- Sends confirmation emails

**13. paybright-webhook**
- Receives payment webhooks
- Validates webhook signatures
- Updates payment status
- Triggers post-payment actions
- Records webhook events

**14. scan-inactive-territories**
- Scheduled function
- Scans for inactive territories
- Creates warnings
- Notifies admins and partners
- Calculates performance scores

**15. subscription-payment-webhook**
- Handles subscription payment events
- Updates subscription status
- Manages trial periods
- Handles payment failures
- Upgrades/downgrades plans

**16. support-email**
- Sends support ticket emails
- Handles ticket notifications
- Updates ticket status
- Records email history

**17. territory-action**
- Manages territory actions
- Assigns territories
- Transfers territories
- Updates territory status
- Validates permissions

**18. territory-create**
- Creates new territories
- Validates ZIP codes
- Sets territory boundaries
- Initializes metrics
- Assigns to partners

**19. weekly-payout-batch**
- Scheduled weekly
- Calculates merchant payouts
- Processes batch payments
- Updates payout records
- Sends payout notifications
- Handles errors and retries

### External Integrations

**1. GoPayBright**
- Payment processing
- Secure checkout
- Invoice payments
- Refund processing
- Payout management
- Webhook events
- Transaction reporting

**2. Supabase Auth**
- User authentication
- Session management
- Password reset
- Email verification
- JWT tokens
- Role-based access

**3. Supabase Storage**
- File uploads
- Image storage
- Document storage
- PDF generation
- Secure access
- CDN delivery

**4. Email Service (Planned)**
- Transactional emails
- Marketing emails
- Email templates
- Delivery tracking
- Bounce handling

**5. SMS Service (Planned)**
- Transactional SMS
- Marketing SMS
- Two-factor authentication
- Delivery tracking

### Security Features

**1. Authentication Security**
- Supabase Auth (industry-standard)
- Password hashing (bcrypt)
- JWT token-based sessions
- Secure session storage
- Auto-logout on inactivity
- Two-factor authentication
- Login attempt rate limiting

**2. Data Security**
- Row Level Security (RLS) on all tables
- Field-level encryption for sensitive data
- SSL/TLS encryption in transit
- Data encryption at rest
- PCI DSS compliant payment handling
- Secure file uploads
- Input validation and sanitization

**3. API Security**
- API key authentication
- Rate limiting
- Request validation
- CORS policies
- Webhook signature verification
- SQL injection prevention
- XSS protection

**4. Payment Security**
- PCI DSS Level 1 compliance
- Tokenized payment data
- No card data stored
- Secure payment forms
- 3D Secure support
- Fraud detection
- Chargeback handling

**5. Access Control**
- Role-based access control (RBAC)
- Permission-based features
- User session management
- Admin action logging
- Audit trails
- IP whitelisting (admin)

### Performance Optimization

**1. Database Optimization**
- Indexed foreign keys
- Composite indexes on common queries
- Materialized views for reports
- Query optimization
- Connection pooling
- Read replicas (future)

**2. Caching**
- Edge caching for static content
- API response caching
- Browser caching
- CDN for images
- Redis for session data (future)

**3. Frontend Optimization**
- Code splitting
- Lazy loading
- Image optimization
- Minification
- Gzip compression
- Tree shaking

**4. Backend Optimization**
- Efficient queries
- Batch operations
- Background jobs for heavy tasks
- Edge functions for real-time
- Webhook processing optimization

### Monitoring & Logging

**1. Application Monitoring**
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API response times
- Database query performance

**2. Logging**
- Application logs
- Error logs
- Access logs
- Audit logs (admin actions)
- Payment transaction logs
- Webhook event logs

**3. Alerts**
- Error rate alerts
- Performance degradation
- Security incidents
- Payment failures
- System downtime
- Resource utilization

### Backup & Recovery

**1. Database Backups**
- Daily automated backups
- Point-in-time recovery
- Backup retention (30 days)
- Backup verification
- Disaster recovery plan

**2. File Backups**
- Automated file backups
- Redundant storage
- Version control
- Recovery procedures

### Infrastructure

**1. Hosting**
- Vercel (Frontend)
- Supabase (Backend & Database)
- CloudFlare (CDN, future)
- AWS S3 (File storage, future)

**2. Deployment**
- CI/CD pipeline
- Automated testing
- Staging environment
- Production environment
- Rollback capability
- Zero-downtime deployment

**3. Scaling**
- Horizontal scaling ready
- Load balancing
- Auto-scaling (future)
- Database read replicas (future)
- Multi-region support (future)

---

## 🎯 SUMMARY

### Customer Side:
- 13 pages/features
- Browse and purchase deals
- Manage purchases and favorites
- Profile and preferences management
- Referral program

### Merchant Side:
- 45+ pages/features
- Complete dashboard
- Deal creation and management
- CRM with 3 pricing tiers ($49, $129, $249)
- Invoicing & accounting system
- Marketing tools
- Loyalty programs
- Printing and promotional services
- Website services
- Recruiting tools
- Business capital
- Merchant services
- Settings and support

### Admin & Partner:
- 10+ admin features
- Merchant management
- Territory system
- Partner program
- Analytics and reporting
- Appointment system
- Application reviews

### Backend:
- 65+ database tables
- Comprehensive RLS policies
- 13+ database functions
- 19 edge functions
- GoPayBright integration
- Secure authentication
- Performance optimization
- Monitoring and logging
- Backup and recovery
- Production-ready infrastructure

**Total: 68+ user-facing pages and a complete backend infrastructure powering an all-in-one business growth platform!**
