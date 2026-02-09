# Local Link Marketplace - Setup Guide

This guide will help you get the Local Link Marketplace application up and running.

## Quick Start

### 1. Database Setup (Already Complete)

The database migration has already been applied to your Supabase instance with the following:

- ✅ All tables created (profiles, merchants, customers, deals, purchases, etc.)
- ✅ Row Level Security enabled on all tables
- ✅ Security policies configured
- ✅ Default categories populated
- ✅ Automatic triggers set up (profile creation, loyalty points)

### 2. Environment Configuration

Your `.env` file should already contain:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These variables are automatically configured in your Supabase project.

### 3. First Steps

#### Create an Admin User

Since you need an admin to approve merchants and deals, you'll need to manually create an admin user:

1. Register a new account at `/register`
2. Go to your Supabase dashboard
3. Navigate to: Table Editor → profiles
4. Find your newly created user
5. Change the `role` field from `customer` to `admin`
6. Log out and log back in

Now you can access the admin dashboard at `/admin/dashboard`

#### Test the Complete Flow

**As Admin:**
1. Create an admin account (follow steps above)
2. Access `/admin/dashboard`

**As Merchant:**
1. Register a new account at `/register` and select "Merchant"
2. Complete the merchant onboarding at `/merchant/onboarding`
3. Wait for admin approval (switch to admin account)
4. Once approved, create deals at `/merchant/deals/new`
5. Submit deals for approval

**As Customer:**
1. Register a new account at `/register` and select "Customer"
2. Browse deals at `/dashboard`
3. Purchase a deal
4. View QR code at `/purchase/:id`
5. Check purchase history at `/purchases`

## Database Schema Overview

### Core Tables

#### profiles
- Extends Supabase Auth users
- Stores role (customer, merchant, admin)
- Automatically created on user signup

#### merchants
- Business profile information
- Linked to user profile
- Status: pending → approved/rejected

#### deals
- Deal offerings
- Pricing and availability
- Status: draft → pending_approval → active

#### purchases
- Customer purchases
- Commission calculation
- Payment tracking

#### redemptions
- QR code redemption records
- One redemption per purchase

### Default Categories

The following categories are pre-populated:
- Restaurants
- Salons & Spas
- Home Services
- Retail
- Health & Wellness
- Activities

## User Roles

### Customer
- Browse and purchase deals
- View purchase history
- Earn loyalty points
- Access: `/dashboard`, `/deal/:id`, `/purchases`

### Merchant
- Create and manage deals
- View analytics
- Scan QR codes for redemption
- Access: `/merchant/dashboard`, `/merchant/deals/new`

### Admin
- Approve merchants
- Approve deals
- View platform analytics
- Access: `/admin/dashboard`

## Key Features

### Authentication
- Email/password authentication
- Role selection on signup
- Protected routes based on role
- Automatic profile creation

### Deal Creation
- Template-based deal creation
- Commission calculation (default 30%)
- Quantity limits
- Customer purchase limits
- Automatic slug generation

### Purchase Flow
1. Customer selects deal
2. Instant checkout (no payment gateway yet)
3. QR code generated
4. Loyalty points awarded
5. Purchase tracked in database

### QR Code Redemption
- QR codes contain purchase ID and timestamp
- Merchants scan to redeem
- One-time redemption
- Redemption tracking

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## Common Tasks

### Add a New Category

```sql
INSERT INTO categories (name, slug, description, icon)
VALUES ('New Category', 'new-category', 'Description here', 'icon-name');
```

### Manually Approve a Merchant

```sql
UPDATE merchants
SET status = 'approved'
WHERE id = 'merchant-id-here';
```

### Manually Approve a Deal

```sql
UPDATE deals
SET status = 'active'
WHERE id = 'deal-id-here';
```

### Check User Role

```sql
SELECT email, role
FROM auth.users
JOIN profiles ON auth.users.id = profiles.id;
```

## Testing Scenarios

### Test Case 1: Merchant Onboarding
1. Register as merchant
2. Complete onboarding form
3. Check merchant status (should be "pending")
4. As admin, approve merchant
5. Verify merchant can now create deals

### Test Case 2: Deal Creation and Purchase
1. As approved merchant, create a deal
2. As admin, approve the deal
3. As customer, browse and purchase the deal
4. Verify purchase record created
5. Verify loyalty points awarded
6. Check QR code generation

### Test Case 3: Deal Redemption
1. Customer purchases deal
2. Customer views QR code
3. Merchant scans QR code (simulated)
4. Verify redemption recorded
5. Verify can't redeem twice

## Troubleshooting

### Issue: Can't see deals
**Solution:** Make sure:
- Deals are in "active" status
- Merchant is "approved"
- Deal's end_at date hasn't passed

### Issue: Can't create merchant profile
**Solution:**
- Check user_id matches auth.users
- Verify all required fields are filled
- Check RLS policies allow insertion

### Issue: Purchase fails
**Solution:**
- Ensure customer profile exists
- Verify deal is available
- Check quantity limits

### Issue: QR code not generating
**Solution:**
- Check purchase was created successfully
- Verify purchase ID is valid
- Check browser console for errors

## Next Steps

To fully productionize this application:

1. **Payment Integration**
   - Integrate Stripe for real payments
   - Set up Stripe Connect for merchant payouts

2. **Notifications**
   - Email notifications (approval, purchase, etc.)
   - SMS notifications via SenText integration

3. **Image Uploads**
   - Supabase Storage for deal images
   - Merchant logo uploads

4. **Advanced Features**
   - Search and filters
   - Review system
   - Merchant analytics
   - Customer loyalty tiers

5. **Mobile App**
   - React Native version
   - Push notifications
   - Camera QR scanning

6. **Integrations**
   - SenText loyalty program
   - TradeHive CRM sync
   - Postcard campaign triggers

## Support

For development questions or issues, please contact your development team.

---

Happy Building! 🚀
