# Local Link Marketplace

**Complete Business Growth Platform for Local Merchants**

A comprehensive SaaS platform that provides local businesses with everything they need to grow: deal marketplace, loyalty programs, CRM, marketing automation, printing services, website templates, business capital, and more.

## Overview

**Tagline:** Local Deals. Local Loyalty. Local Growth.

Local Link Marketplace is an all-in-one business platform featuring:
- **Deal Marketplace** - Connect merchants with customers through local deals
- **Business Hub** - Complete suite of marketing and operational tools
- **Partner Network** - Territory-based partner system with expansion management
- **Payment Processing** - Integrated PayBright financing and subscriptions

## Platform Features

### Deal Marketplace
- Browse and purchase local deals by category
- QR code redemption system
- Loyalty points and rewards
- Customer reviews and ratings
- Favorites and notifications
- Gift cards and memberships

### Business Hub Services

**Marketing & CRM**
- Full-featured CRM with auto lead capture
- Marketing campaign builder and segmentation
- Email marketing automation
- Customer preference tracking
- Referral program management
- Review request automation

**Content & Design**
- 1,000+ Marketing templates (Swipe File):
  - 36 Facebook & Instagram ad templates
  - 7 Google ad campaigns
  - 20 Landing page templates (7 industries)
  - 9 Email campaign templates
  - 15 Sales & phone scripts
  - 18 Social posts & deal ideas
- Professional design services
- Custom landing page builder
- AI-powered marketing bots

**Printing Services**
- Business cards, flyers, brochures
- Banners, posters, yard signs
- Direct mail postcards with targeting
- Promotional products and swag

**Recruiting & HR**
- Job posting templates
- Applicant tracking system
- Resume writing services
- Hiring funnel management

**Business Operations**
- Appointment booking and scheduling
- Support ticket system
- Multi-location management
- Analytics and reporting

**Financial Services**
- Business capital applications
- PayBright payment financing
- Subscription management
- Automated weekly payouts

### Partner System
- Territory management and assignment
- Partner applications and approval workflow
- Expansion request system
- Performance analytics and health monitoring
- Partner override capabilities
- Inactivity scanning and alerts
- Commission tracking

### Admin Dashboard
- Merchant and partner application reviews
- Deal approval workflow
- Territory creation and management
- Platform-wide analytics
- Support ticket management
- Payment and payout oversight

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and builds
- **React Router v7** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **QRCode** library for QR generation

### Backend & Infrastructure
- **Supabase** (PostgreSQL, Auth, Edge Functions, Storage):
  - PostgreSQL database with advanced schema
  - Row Level Security (RLS) on all tables
  - Email/password authentication
  - 20+ Edge Functions for serverless operations
  - Real-time subscriptions
- **Vercel** for hosting and deployments
- **PayBright** for payment processing and financing

### Database Schema

The platform uses 50+ PostgreSQL tables organized into modules:

**Core Platform**
- profiles, categories, merchants, customers, deals, purchases, redemptions, payouts, loyalty_events

**Subscriptions & Loyalty**
- subscription_tiers, subscriptions, subscription_features, loyalty_contracts, loyalty_contract_uploads, postcards, postcard_campaigns

**Business Hub Services**
- printing_products, printing_orders, promotional_swag, website_templates, swipe_file_templates

**CRM & Marketing**
- crm_contacts, crm_deals, crm_activities, crm_subscriptions, lead_sources, reviews, favorites, customer_preferences, referrals, marketing_campaigns, customer_segments, deal_templates, surveys, gift_cards, memberships

**Support & Multi-location**
- support_tickets, merchant_locations

**Partner System**
- partner_applications, territories, territory_assignments, partner_metrics, expansion_requests, partner_overrides, partner_warnings, territory_pricing_tiers, global_program_metrics

**Payments & Billing**
- paybright_transactions, paybright_payment_plans, merchant_orders, webhook_events

**Appointments**
- admin_appointments

All tables include comprehensive Row Level Security policies ensuring data isolation and security.

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub account
- Supabase project (already configured)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Environment Variables

Add these in Vercel project settings (Settings → Environment Variables):

```env
VITE_SUPABASE_URL=https://aqfcewyribyxnsqqrqut.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZmNld3lyaWJ5eG5zcXFycXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjA2MTIsImV4cCI6MjA4MDg5NjYxMn0.dhwcPIazDuvgOIwwP7MOvJMqieWZbAmCEkGiaCv0frw
```

### Step 4: Deploy

Click "Deploy" and Vercel will:
- Install dependencies
- Run the build
- Deploy to production
- Provide a production URL (e.g., `your-app.vercel.app`)

### Step 5: Custom Domain (Optional)

1. Purchase domain from Cloudflare, Namecheap, or Porkbun
2. In Vercel: Settings → Domains → Add Domain
3. Follow DNS configuration instructions
4. SSL certificate auto-configures

### Automatic Deployments

Every push to `main` branch automatically triggers a new deployment on Vercel.

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## User Journeys

### Customer Journey
1. Register and browse local deals by category
2. Purchase deals with PayBright financing options
3. Receive QR codes for redemption
4. Earn loyalty points on every purchase
5. Leave reviews and save favorites
6. Receive notifications about new deals
7. Track purchase history and gift cards

### Merchant Journey
1. Apply for merchant account (with partner referral)
2. Get approved by admin
3. Choose subscription tier and complete onboarding
4. Access Business Hub dashboard
5. Create and manage deals
6. Use marketing tools (CRM, email campaigns, swipe file templates)
7. Order printing services and promotional materials
8. Track analytics and customer insights
9. Redeem customer purchases via QR scanning
10. Receive automated weekly payouts
11. Apply for business capital
12. Manage appointments and support tickets

### Partner Journey
1. Submit partner application with territory preferences
2. Get approved by admin and assigned territories
3. Recruit merchants in assigned territories
4. Earn commissions on merchant subscriptions
5. Monitor territory performance metrics
6. Request territory expansions
7. Manage merchant relationships

### Admin Journey
1. Review and approve merchant/partner applications
2. Create and assign territories
3. Approve deals and marketing content
4. Monitor platform-wide analytics
5. Handle support escalations
6. Process appointment requests
7. Review expansion requests
8. Manage partner overrides and warnings
9. Run territory health scans

## Design System

### Colors
- **Primary Green**: #2BB673 - Main brand color
- **Community Gold**: #F5B82E - Accent color
- **Slate**: #2D2D2D - Text color
- **White**: #FFFFFF - Background

### Typography
- Clean, modern sans-serif fonts
- Clear hierarchy with appropriate font sizes
- Readable contrast ratios

### Components
- Reusable Button, Input, Card components
- Consistent spacing (8px grid system)
- Professional, modern UI design

## Security

### Authentication
- Email/password authentication via Supabase Auth
- JWT-based sessions
- Automatic profile creation on signup

### Authorization
- Role-based access control (customer, merchant, admin)
- Protected routes based on user role
- Row Level Security on all database tables

### RLS Policies
- Users can only access their own data
- Merchants can only manage their own deals
- Customers can only view their own purchases
- Admins have full access for management

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   └── BusinessHubLayout.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── AppointmentBooking.tsx
│   └── ErrorBoundary.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── AdminAuthContext.tsx
├── lib/
│   ├── supabase.ts
│   ├── database.types.ts
│   ├── eligibility.ts
│   ├── featureGating.ts
│   ├── paybright.ts
│   ├── usage.ts
│   ├── email/
│   │   ├── send.ts
│   │   └── templates.ts
│   └── webhooks/
│       └── gopaybright.ts
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── About.tsx
│   ├── FAQ.tsx
│   ├── HowItWorks.tsx
│   ├── ForBusinesses.tsx
│   ├── BusinessPricing.tsx
│   ├── PricingPage.tsx
│   ├── PartnerApplication.tsx
│   ├── admin/
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── EnhancedAdminDashboard.tsx
│   │   ├── PartnerApplications.tsx
│   │   ├── PartnerAnalytics.tsx
│   │   ├── TerritoryManagement.tsx
│   │   ├── TerritoryCreationPage.tsx
│   │   ├── ExpansionReviewPage.tsx
│   │   └── InactivityScannerPage.tsx
│   ├── customer/
│   │   ├── DealsPage.tsx
│   │   ├── DealDetailPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── PaymentStatusPage.tsx
│   │   ├── PurchaseConfirmationPage.tsx
│   │   ├── PurchasesPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   └── ProfilePage.tsx
│   ├── merchant/
│   │   ├── MerchantDashboard.tsx
│   │   ├── MerchantOnboarding.tsx
│   │   ├── CreateDealPage.tsx
│   │   ├── MerchantDealsPage.tsx
│   │   ├── RedemptionPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── SubscriptionCheckoutPage.tsx
│   │   ├── SubscriptionPaymentCompletePage.tsx
│   │   ├── UpgradePage.tsx
│   │   ├── TierUpgradeCheckout.tsx
│   │   ├── TierUpgradeSuccess.tsx
│   │   ├── PaymentSettingsPage.tsx
│   │   ├── MerchantServicesPage.tsx
│   │   ├── LoyaltyPage.tsx
│   │   ├── PostcardsPage.tsx
│   │   ├── PostcardCheckoutPage.tsx
│   │   ├── PostcardConfirmationPage.tsx
│   │   ├── PrintingServicesPage.tsx
│   │   ├── WebsitesPage.tsx
│   │   ├── SwipeFilePage.tsx
│   │   ├── SwipeFileTemplatesPage.tsx
│   │   ├── SwipeFileCheckoutPage.tsx
│   │   ├── SwipeFilePaymentCompletePage.tsx
│   │   ├── CRMPage.tsx
│   │   ├── CRMMarketplacePage.tsx
│   │   ├── CRMMigrationPage.tsx
│   │   ├── LeadsPage.tsx
│   │   ├── MarketingPage.tsx
│   │   ├── ReviewsPage.tsx
│   │   ├── AddonsMarketplace.tsx
│   │   ├── AddonCheckoutPage.tsx
│   │   ├── AddonSuccessPage.tsx
│   │   ├── AppointmentSettingPage.tsx
│   │   ├── AppointmentSettingCheckoutPage.tsx
│   │   ├── AppointmentSettingConfirmationPage.tsx
│   │   ├── LandingPageCheckoutPage.tsx
│   │   ├── LandingPageProcessingPage.tsx
│   │   ├── DesignServiceCheckoutPage.tsx
│   │   ├── DesignServiceConfirmationPage.tsx
│   │   ├── BusinessCapitalPage.tsx
│   │   ├── RecruitingPage.tsx
│   │   ├── HiringFunnelCheckoutPage.tsx
│   │   ├── HiringFunnelConfirmationPage.tsx
│   │   ├── JobTemplatesCheckoutPage.tsx
│   │   ├── JobTemplatesConfirmationPage.tsx
│   │   ├── ResumeWritingCheckoutPage.tsx
│   │   ├── ResumeWritingConfirmationPage.tsx
│   │   ├── AIBotsPage.tsx
│   │   └── SupportPage.tsx
│   └── partner/
│       └── ExpansionRequestPage.tsx
├── App.tsx
└── main.tsx

supabase/
├── migrations/
│   └── [40+ migration files]
└── functions/
    ├── paybright-auth/
    ├── paybright-webhook/
    ├── paybright-refund/
    ├── subscription-payment-webhook/
    ├── deal-approve-with-qr/
    ├── compute-eligibility/
    ├── partner-application-approve/
    ├── partner-application-decline/
    ├── partner-health/
    ├── territory-create/
    ├── territory-action/
    ├── expansion-request/
    ├── expansion-manage/
    ├── partner-override-manage/
    ├── scan-inactive-territories/
    ├── weekly-payout-batch/
    ├── capital-application-notification/
    ├── appointment-notification/
    └── support-email/
```

## Key Features Summary

### Business Model
- **Subscription-based**: 3 tiers (Starter $159/mo, Growth $299/mo, Enterprise $499/mo)
- **Partner commissions**: Territory-based partner system with recurring revenue
- **Fair marketplace**: 20-35% commission vs Groupon's 50-70%
- **Fast payouts**: Weekly automated payouts vs Groupon's 2-8 weeks

### Technology Highlights
- **50+ database tables** with comprehensive RLS policies
- **20+ Supabase Edge Functions** for serverless operations
- **100+ React pages** covering all user journeys
- **PayBright integration** for payment processing and financing
- **Real-time updates** via Supabase subscriptions
- **QR code system** for secure deal redemption
- **Automated workflows** for approvals, payouts, and notifications

### Security & Performance
- Row Level Security on all database tables
- Indexed foreign keys for optimal query performance
- Function-based RLS policies to eliminate recursion
- Webhook event logging for audit trails
- Territory-based access control for partners
- Secure admin authentication system

## Development Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run typecheck   # TypeScript type checking
```

## Production Deployment

The platform is deployed on Vercel with:
- Automatic deployments from GitHub
- Environment variables configured
- SSL/HTTPS enabled
- Global CDN distribution
- Edge network optimization

## Documentation

- `SETUP.md` - Initial setup guide
- `ADMIN_SYSTEM_GUIDE.md` - Admin dashboard documentation
- `PAYBRIGHT_SETUP.md` - PayBright integration guide
- `PRE_LAUNCH_CHECKLIST.md` - Production readiness checklist
- `PRODUCTION_READINESS_REPORT.md` - Comprehensive production review
- `SECURITY_PERFORMANCE_FIXES.md` - Security and performance improvements

## License

This project is proprietary software developed for Local Link Marketplace.

## Support

For technical support or questions, use the built-in support ticket system at `/merchant/support`.

---

**Local Link Marketplace** - Empowering local businesses with enterprise-level tools at affordable prices.
