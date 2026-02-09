import { initiatePayBrightPayment, type PayBrightPaymentRequest } from './paybright';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

export type PaymentProvider = 'paybright' | 'stripe';

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
  preferredProvider?: PaymentProvider;
}

export interface PaymentResponse {
  success: boolean;
  provider: PaymentProvider;
  checkoutUrl?: string;
  checkoutHtml?: string;
  transactionId?: string;
  error?: string;
  fallbackUsed?: boolean;
}

function isPayBrightConfigured(): boolean {
  const apiKey = import.meta.env.VITE_GOPAYBRIGHT_API_KEY;
  const merchantId = import.meta.env.VITE_GOPAYBRIGHT_MERCHANT_ID;
  return Boolean(apiKey && merchantId);
}

function isStripeConfigured(): boolean {
  return Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
}

async function processPayBrightPayment(request: PaymentRequest): Promise<PaymentResponse> {
  if (!isPayBrightConfigured()) {
    return {
      success: false,
      provider: 'paybright',
      error: 'PayBright is not configured',
    };
  }

  try {
    const names = request.customerName.split(' ');
    const firstName = names[0] || 'Customer';
    const lastName = names.slice(1).join(' ') || 'User';

    const paybrightRequest: PayBrightPaymentRequest = {
      merchantId: import.meta.env.VITE_GOPAYBRIGHT_MERCHANT_ID!,
      transactionType: 'other',
      amount: request.amount,
      customerEmail: request.customerEmail,
      customerName: request.customerName,
      billingAddress: {
        firstName,
        lastName,
        address1: '123 Main St',
        city: 'City',
        province: 'Province',
        postalCode: 'A1A 1A1',
        country: 'CA',
        phone: '555-555-5555',
      },
      metadata: request.metadata,
    };

    const result = await initiatePayBrightPayment(paybrightRequest);

    if (result.success) {
      return {
        success: true,
        provider: 'paybright',
        checkoutHtml: result.checkoutHtml,
        transactionId: result.transactionId,
      };
    }

    return {
      success: false,
      provider: 'paybright',
      error: result.error || 'PayBright payment failed',
    };
  } catch (error) {
    return {
      success: false,
      provider: 'paybright',
      error: error instanceof Error ? error.message : 'PayBright payment failed',
    };
  }
}

async function processStripePayment(): Promise<PaymentResponse> {
  if (!isStripeConfigured()) {
    return {
      success: false,
      provider: 'stripe',
      error: 'Stripe is not configured',
    };
  }

  return {
    success: false,
    provider: 'stripe',
    error: 'Stripe payment not yet implemented for this flow',
  };
}

export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  if (DEV_MODE) {
    console.warn('🚨 DEV MODE: Payment bypassed! Returning mock success.');
    return {
      success: true,
      provider: 'paybright',
      transactionId: `DEV-${Date.now()}`,
      checkoutUrl: request.successUrl || '/purchase/confirmation',
    };
  }

  const preferredProvider = request.preferredProvider || 'paybright';
  const fallbackProvider: PaymentProvider = preferredProvider === 'paybright' ? 'stripe' : 'paybright';

  console.log(`Attempting payment with ${preferredProvider}...`);

  let result: PaymentResponse;

  if (preferredProvider === 'paybright') {
    result = await processPayBrightPayment(request);
  } else {
    result = await processStripePayment();
  }

  if (result.success) {
    return result;
  }

  console.warn(`${preferredProvider} failed, attempting fallback to ${fallbackProvider}...`);

  let fallbackResult: PaymentResponse;
  if (fallbackProvider === 'paybright') {
    fallbackResult = await processPayBrightPayment(request);
  } else {
    fallbackResult = await processStripePayment();
  }

  if (fallbackResult.success) {
    return {
      ...fallbackResult,
      fallbackUsed: true,
    };
  }

  return {
    success: false,
    provider: preferredProvider,
    error: `Both payment providers failed. ${preferredProvider}: ${result.error}, ${fallbackProvider}: ${fallbackResult.error}`,
  };
}

export function getAvailableProviders(): PaymentProvider[] {
  const providers: PaymentProvider[] = [];

  if (isPayBrightConfigured()) {
    providers.push('paybright');
  }

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
