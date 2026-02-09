# Merchant Signup with Tier Selection - Complete

## Overview
Updated the merchant registration flow to include tier selection with full CRM details and benefits during signup. Merchants now see exactly what they're signing up for before creating their account.

## Changes Made

### Register.tsx Updates

**1. Added Tier Data**
- Imported 4 merchant tier configurations with complete details
- Each tier includes:
  - Name, price, icon, color scheme
  - CRM tier name and contact limits
  - Accounting level (None, Books Lite, Books Pro)
  - Feature list with top benefits
  - Badge (LOCKED RATE, MOST POPULAR, BEST VALUE)

**2. Added Tier Selection UI**
- Tier selection appears when user selects "Merchant" role
- Shows "CRM Included with Every Plan" badge at top
- Displays all 4 tiers in a scrollable grid (max-height: 384px)
- Each tier card shows:
  - Tier icon with gradient background
  - Tier name and badge
  - Monthly price
  - Blue highlighted CRM info box:
    - "CRM INCLUDED" header
    - CRM tier name
    - Contact limit
    - Accounting level
  - Top 3 features with checkmarks
  - "+X more features" indicator for remaining features

**3. Interactive Selection**
- Tier cards are clickable buttons
- Selected tier has green border and background tint
- Default selection: "Standard" tier (most popular)
- Visual feedback on hover

**4. Backend Integration**
- Added `selectedTier` state to track merchant's choice
- Updated signup flow to store selected tier in profiles table
- Stores tier selection along with referral information
- Field stored: `selected_tier` (string: 'starter', 'founders', 'standard', 'premium')

**5. Fixed Logo Path**
- Updated logo reference from corrupted filename to `/image.png`
- Ensures proper logo display on registration page

## User Experience Flow

### 1. User Arrives at Register Page
- Sees two role options: Customer or Merchant
- Clean, gradient background with logo

### 2. User Selects "Merchant"
- Tier selection section appears
- "CRM Included with Every Plan" badge shows value prop
- 4 tiers displayed in scrollable list

### 3. User Reviews Tiers
- Each tier clearly shows:
  - Monthly price
  - CRM level included
  - Contact limits
  - Accounting level
  - Top features
- Badges highlight special attributes (Locked Rate, Most Popular, Best Value)

### 4. User Selects Tier
- Clicks on preferred tier card
- Visual feedback confirms selection
- Can change selection before completing signup

### 5. User Completes Registration
- Enters email and password
- Optional: Adds referral information
- Clicks "Create Account"
- Selected tier is stored in their profile

### 6. Post-Registration
- User is redirected to `/dashboard`
- Their selected tier is available in their profile
- Can be used for onboarding, billing, feature access

## Tier Display Specifications

### Starter ($149/mo)
- **Icon**: Users (gray gradient)
- **CRM**: Starter CRM - 500 contacts
- **Accounting**: None
- **Top Features**:
  - Contact management & basic pipeline
  - Email marketing
  - Deal tracking
  - Basic reporting
  - Mobile app access
  - 1 postcard spot (rotating)

### Founders ($249/mo) - LOCKED RATE
- **Icon**: Zap (blue gradient)
- **CRM**: Professional CRM - 5,000 contacts
- **Accounting**: Books Lite
- **Top Features**:
  - Everything in Starter
  - Advanced pipelines
  - Email automation
  - Customer segmentation
  - Books Lite accounting
  - Priority support

### Standard ($299/mo) - MOST POPULAR
- **Icon**: TrendingUp (green gradient)
- **CRM**: Business CRM - 25,000 contacts
- **Accounting**: Books Pro
- **Top Features**:
  - Everything in Founders
  - SMS marketing
  - Custom workflows
  - A/B testing
  - Books Pro accounting
  - API access

### Premium ($349/mo) - BEST VALUE
- **Icon**: Crown (amber gradient)
- **CRM**: Enterprise CRM - 100,000 contacts
- **Accounting**: Books Pro
- **Top Features**:
  - Everything in Standard
  - AI-powered insights
  - Unlimited communications
  - White-label options
  - Dedicated account manager
  - 24/7 priority support

## Technical Implementation

### Component Structure
```typescript
// Tier data array
const merchantTiers = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Users,
    price: 149,
    crm: 'Starter CRM',
    contacts: 500,
    accounting: 'None',
    color: 'from-slate-500 to-slate-600',
    features: [...]
  },
  // ... other tiers
];

// State management
const [selectedTier, setSelectedTier] = useState('standard');

// Conditional rendering
{role === 'merchant' && (
  <div className="border-t border-slate-200 pt-4">
    {/* Tier selection UI */}
  </div>
)}
```

### Database Storage
```typescript
// Store in profiles table after signup
if (role === 'merchant' && selectedTier) {
  updates.selected_tier = selectedTier;
}
await supabase.from('profiles').update(updates).eq('id', user.id);
```

## Design Decisions

### 1. Why Show Tiers During Registration?
- **Informed Decision**: Users know exactly what they're paying for upfront
- **Reduced Friction**: No surprise pricing after account creation
- **Clear Value**: CRM inclusion is prominently displayed
- **Competitive Advantage**: Shows complete package immediately

### 2. Why Default to "Standard"?
- Marked as "MOST POPULAR" - social proof
- Middle-tier pricing - balanced value
- Includes robust features (SMS, workflows, A/B testing, Books Pro)
- 25,000 contacts sufficient for most businesses

### 3. Why Scrollable List vs Grid?
- Mobile-friendly: Vertical scroll works on all screen sizes
- More Information: Each card can show more details without being cramped
- Easier Comparison: Users scan top to bottom naturally
- Max height prevents overwhelming long page

### 4. Why Blue for CRM Info Box?
- **Trust**: Blue conveys reliability and professionalism
- **Consistency**: Matches "CRM Included" badge at top
- **Emphasis**: Stands out from green brand color
- **Hierarchy**: Creates clear visual separation from features

## Build Status

✅ **Build Successful** (21.58s)
✅ **No TypeScript Errors**
✅ **Logo Path Fixed**
✅ **Tier Selection Functional**
✅ **Database Integration Complete**

## Files Modified

1. **src/pages/Register.tsx**
   - Added tier data array
   - Added tier selection UI
   - Updated signup logic to store tier
   - Fixed logo path

2. **public/** directory
   - Cleaned corrupted files
   - Maintained essential assets

## Testing Checklist

- [x] Register page renders correctly
- [x] Customer role selection works
- [x] Merchant role selection works
- [x] Tier selection UI appears for merchants
- [x] All 4 tiers display with correct information
- [x] Tier selection updates state
- [x] CRM information displays correctly
- [x] Features list shows properly
- [x] Badges display on correct tiers
- [x] Selected tier is stored in database
- [x] Referral flow still works
- [x] Logo displays correctly
- [x] Build passes successfully

## Next Steps (Optional)

1. **Onboarding Enhancement**: Use `selected_tier` to customize merchant onboarding
2. **Payment Flow**: Direct merchants to payment page with pre-selected tier
3. **Upgrade Prompts**: Show tier comparison when merchant hits limits
4. **Analytics**: Track which tiers are most selected during registration
5. **A/B Testing**: Test different tier presentations and defaults

## Summary

The merchant registration flow now includes complete tier selection with CRM details. Merchants see all 4 subscription options with clear pricing, included CRM tier, contact limits, accounting level, and top features. The selected tier is stored in their profile for use in onboarding and billing flows. This creates a transparent, informed signup experience that highlights the value of bundled CRM with every subscription tier.
