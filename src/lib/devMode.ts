export const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';
export const BYPASS_MODE = import.meta.env.VITE_BYPASS_MODE === 'true';

export const MOCK_USER_ID = 'dev-user-mock-id';

// Role switching for dev mode
export type DevRole = 'customer' | 'merchant' | 'partner' | 'admin';

let currentDevRole: DevRole = 'customer';

export function setDevRole(role: DevRole) {
  currentDevRole = role;
  localStorage.setItem('dev_role', role);

  // Navigate to appropriate dashboard for each role
  const roleRoutes: Record<DevRole, string> = {
    customer: '/deals',
    merchant: '/merchant/dashboard',
    partner: '/partner/dashboard',
    admin: '/admin/dashboard',
  };

  window.location.href = roleRoutes[role];
}

export function getDevRole(): DevRole {
  const stored = localStorage.getItem('dev_role');
  if (stored && ['customer', 'merchant', 'partner', 'admin'].includes(stored)) {
    return stored as DevRole;
  }
  return 'customer';
}

// Initialize current role from storage
if (typeof window !== 'undefined') {
  currentDevRole = getDevRole();
}

export const MOCK_MERCHANT = {
  id: 'dev-merchant-id',
  user_id: MOCK_USER_ID,
  business_name: 'Dev Local Business',
  email: 'merchant@local-link.com',
  phone: '555-0100',
  address: '123 Main St',
  city: 'Los Angeles',
  state: 'CA',
  zip_code: '90001',
  status: 'approved',
  subscription_tier: 'scale',
  created_at: new Date().toISOString(),
};

export const MOCK_PARTNER = {
  id: 'dev-partner-id',
  user_id: MOCK_USER_ID,
  business_name: 'Dev Partner Agency',
  email: 'partner@local-link.com',
  phone: '555-0200',
  status: 'Active',
  commission_rate: 30,
  referral_code: 'DEVPARTNER2024',
  ai_credits_remaining: 50,
  total_commission_earned: 12500,
  monthly_recurring_revenue: 3500,
  territories: ['Los Angeles, CA', 'Orange County, CA'],
  created_at: new Date().toISOString(),
};

export const MOCK_PARTNER_COMMISSIONS = [
  {
    id: 'comm-1',
    partner_id: 'dev-partner-id',
    amount_cents: 15000,
    status: 'paid',
    reason: 'Merchant onboarding - Downtown Restaurant',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'comm-2',
    partner_id: 'dev-partner-id',
    amount_cents: 25000,
    status: 'approved',
    reason: 'Merchant onboarding - Elite Fitness Center',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'comm-3',
    partner_id: 'dev-partner-id',
    amount_cents: 18000,
    status: 'pending',
    reason: 'Merchant onboarding - Sunset Spa',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'comm-4',
    partner_id: 'dev-partner-id',
    amount_cents: 12000,
    status: 'paid',
    reason: 'Monthly recurring commission',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_INTERNAL_TEAM_MEMBER = {
  id: 'dev-internal-team-id',
  email: 'admin@locallink.com',
  full_name: 'Dev Admin User',
  role: 'admin' as const,
  permissions: {},
  is_active: true,
  last_login: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

export const MOCK_DEALS = [
  {
    id: 'deal-1',
    merchant_id: 'dev-merchant-id',
    title: '$50 Off First Service',
    description: 'Get $50 off your first service with us. Perfect for new customers!',
    original_price_cents: 10000,
    deal_price_cents: 5000,
    category: 'Services',
    status: 'active',
    active: true,
    quantity_available: 100,
    quantity_sold: 23,
    image_url: 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'deal-2',
    merchant_id: 'dev-merchant-id',
    title: '2-for-1 Dinner Special',
    description: 'Buy one entree, get one free! Valid Monday-Thursday.',
    original_price_cents: 6000,
    deal_price_cents: 3000,
    category: 'Restaurant',
    status: 'active',
    active: true,
    quantity_available: 50,
    quantity_sold: 12,
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_PURCHASES = [
  {
    id: 'purchase-1',
    deal_id: 'deal-1',
    customer_id: MOCK_USER_ID,
    amount_paid_cents: 5000,
    merchant_payout_cents: 4000,
    redemption_code: 'REDEEM-ABC123',
    redeemed: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deal: MOCK_DEALS[0],
  },
  {
    id: 'purchase-2',
    deal_id: 'deal-2',
    customer_id: MOCK_USER_ID,
    amount_paid_cents: 3000,
    merchant_payout_cents: 2400,
    redemption_code: 'REDEEM-XYZ789',
    redeemed: true,
    redeemed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deal: MOCK_DEALS[1],
  },
];

export const MOCK_CRM_LEADS = [
  {
    id: 'lead-1',
    merchant_id: 'dev-merchant-id',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@email.com',
    phone: '555-0123',
    company: 'Smith Corp',
    status: 'new',
    lead_source: 'website',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead-2',
    merchant_id: 'dev-merchant-id',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '555-0456',
    company: 'Johnson Industries',
    status: 'contacted',
    lead_source: 'referral',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead-3',
    merchant_id: 'dev-merchant-id',
    first_name: 'Mike',
    last_name: 'Davis',
    email: 'mike.davis@email.com',
    phone: '555-0789',
    company: 'Davis LLC',
    status: 'qualified',
    lead_source: 'marketplace',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_INVOICES = [
  {
    id: 'invoice-1',
    merchant_id: 'dev-merchant-id',
    customer_name: 'Acme Corporation',
    customer_email: 'billing@acme.com',
    amount_cents: 150000,
    status: 'sent',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'invoice-2',
    merchant_id: 'dev-merchant-id',
    customer_name: 'Beta Industries',
    customer_email: 'ap@beta.com',
    amount_cents: 75000,
    status: 'paid',
    paid_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_AI_BOTS = [
  {
    id: 'bot-1',
    merchant_id: 'dev-merchant-id',
    bot_type: 'facebook_messenger',
    bot_name: 'Facebook Lead Bot',
    status: 'active',
    performance_metrics: {
      conversations: 156,
      leads_captured: 42,
      conversion_rate: 26.9,
    },
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bot-2',
    merchant_id: 'dev-merchant-id',
    bot_type: 'website_chat',
    bot_name: 'Website Chat Assistant',
    status: 'active',
    performance_metrics: {
      conversations: 234,
      leads_captured: 67,
      conversion_rate: 28.6,
    },
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_REVIEWS = [
  {
    id: 'review-1',
    merchant_id: 'dev-merchant-id',
    customer_name: 'Emily Wilson',
    rating: 5,
    review_text: 'Absolutely fantastic service! Highly recommend to everyone.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-2',
    merchant_id: 'dev-merchant-id',
    customer_name: 'Robert Brown',
    rating: 4,
    review_text: 'Great experience overall. Would definitely come back.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-3',
    merchant_id: 'dev-merchant-id',
    customer_name: 'Lisa Martinez',
    rating: 5,
    review_text: 'Best service in town! The team was professional and efficient.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_PARTNER_MERCHANTS = [
  {
    id: 'merchant-1',
    business_name: 'Downtown Restaurant',
    subscription_tier: 'growth',
    status: 'active',
    monthly_revenue: 45000,
    commission_earned: 13500,
  },
  {
    id: 'merchant-2',
    business_name: 'Elite Fitness Center',
    subscription_tier: 'scale',
    status: 'active',
    monthly_revenue: 79900,
    commission_earned: 23970,
  },
  {
    id: 'merchant-3',
    business_name: 'Sunset Spa',
    subscription_tier: 'growth',
    status: 'active',
    monthly_revenue: 59900,
    commission_earned: 17970,
  },
];

export const MOCK_ADMIN_APPLICATIONS = [
  {
    id: 'app-1',
    business_name: 'New Local Shop',
    contact_name: 'James Wilson',
    email: 'james@newlocalshop.com',
    phone: '555-1234',
    status: 'pending',
    submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-2',
    business_name: 'City Café',
    contact_name: 'Maria Garcia',
    email: 'maria@citycafe.com',
    phone: '555-5678',
    status: 'pending',
    submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_TERRITORIES = [
  {
    id: 'territory-1',
    name: 'Los Angeles Downtown',
    state: 'CA',
    zip_codes: ['90001', '90002', '90003'],
    status: 'available',
    partner_id: null,
  },
  {
    id: 'territory-2',
    name: 'Santa Monica',
    state: 'CA',
    zip_codes: ['90401', '90402', '90403'],
    status: 'assigned',
    partner_id: 'dev-partner-id',
  },
];

export function getDevModeWarning() {
  if (DEV_MODE || BYPASS_MODE) {
    console.warn(
      '%c🚨 BYPASS MODE ENABLED',
      'background: #ff0000; color: #fff; padding: 10px; font-size: 16px; font-weight: bold;',
      '\nAuth and payments are bypassed. You can navigate freely!\nSet VITE_BYPASS_MODE=false before going live!'
    );
  }
}

export function shouldBypassDatabase(): boolean {
  return DEV_MODE || BYPASS_MODE;
}
