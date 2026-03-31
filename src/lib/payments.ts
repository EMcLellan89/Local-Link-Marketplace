const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

export type PaymentProvider = 'stripe';

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  provider: PaymentProvider;
  checkoutUrl?: string;
  transactionId?: string;
  error?: string;
}

function isStripeConfigured(): boolean {
  return Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
}

async function processStripePayment(request: PaymentRequest): Promise<PaymentResponse> {
  if (!isStripeConfigured()) {
    return {
      success: false,
      provider: 'stripe',
      error: 'Stripe is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment.',
    };
  }

  // Stripe checkout is handled through the create-checkout-session edge function
  // This is a placeholder for direct Stripe SDK usage if needed
  return {
    success: false,
    provider: 'stripe',
    error: 'Please use the create-checkout-session edge function for Stripe payments',
  };
}

export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  if (DEV_MODE) {
    console.warn('🚨 DEV MODE: Payment bypassed! Returning mock success.');
    return {
      success: true,
      provider: 'stripe',
      transactionId: `DEV-${Date.now()}`,
      checkoutUrl: request.successUrl || '/purchase/confirmation',
    };
  }

  console.log('Attempting payment with Stripe...');

  const result = await processStripePayment(request);

  if (result.success) {
    return result;
  }

  return {
    success: false,
    provider: 'stripe',
    error: result.error || 'Stripe payment failed',
  };
}

export function getAvailableProviders(): PaymentProvider[] {
  const providers: PaymentProvider[] = [];

  if (isStripeConfigured()) {
    providers.push('stripe');
  }

  return providers;
}

export function formatPaymentAmount(cents: number, currency: string = 'USD'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}
