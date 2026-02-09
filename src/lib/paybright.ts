import { supabase } from './supabase';

export interface PayBrightPaymentRequest {
  merchantId: string;
  transactionType: 'deal_purchase' | 'subscription' | 'merchant_service' | 'other';
  referenceId?: string;
  referenceTable?: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  metadata?: Record<string, any>;
}

export async function initiatePayBrightPayment(
  request: PayBrightPaymentRequest
): Promise<{ success: boolean; checkoutHtml?: string; error?: string; transactionId?: string }> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error('Not authenticated');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const callbackUrl = `${window.location.origin}/api/paybright/callback`;
    const redirectUrl = `${window.location.origin}/payment/complete`;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/paybright-auth`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          ...request,
          callbackUrl,
          redirectUrl,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Payment initiation failed');
    }

    return {
      success: true,
      checkoutHtml: data.checkoutHtml,
      transactionId: data.transactionId,
    };
  } catch (error) {
    console.error('PayBright payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed',
    };
  }
}

export async function refundPayBrightTransaction(
  transactionId: string,
  amount?: number,
  reason?: string
): Promise<{ success: boolean; error?: string; refundId?: string }> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error('Not authenticated');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/paybright-refund`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          transactionId,
          amount,
          reason,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Refund failed');
    }

    return {
      success: true,
      refundId: data.refundId,
    };
  } catch (error) {
    console.error('PayBright refund error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Refund failed',
    };
  }
}

export async function getPayBrightTransaction(transactionId: string) {
  try {
    const { data, error } = await supabase
      .from('paybright_transactions')
      .select('*')
      .eq('id', transactionId)
      .maybeSingle();

    if (error) throw error;

    return { success: true, transaction: data };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transaction',
    };
  }
}

export async function getPayBrightTransactions(filters?: {
  merchantId?: string;
  customerId?: string;
  status?: string;
  transactionType?: string;
}) {
  try {
    let query = supabase
      .from('paybright_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.merchantId) {
      query = query.eq('merchant_id', filters.merchantId);
    }

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.transactionType) {
      query = query.eq('transaction_type', filters.transactionType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, transactions: data };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions',
    };
  }
}

export function formatPayBrightAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getPayBrightStatusColor(status: string): string {
  switch (status) {
    case 'completed':
    case 'captured':
      return 'bg-green-100 text-green-800';
    case 'authorized':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'voided':
    case 'refunded':
      return 'bg-gray-100 text-gray-800';
    case 'partially_refunded':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}

export function getPayBrightStatusLabel(status: string): string {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'captured':
      return 'Captured';
    case 'authorized':
      return 'Authorized';
    case 'pending':
      return 'Pending';
    case 'failed':
      return 'Failed';
    case 'voided':
      return 'Voided';
    case 'refunded':
      return 'Refunded';
    case 'partially_refunded':
      return 'Partially Refunded';
    default:
      return status;
  }
}

export interface SimplePaymentData {
  merchantId: string;
  amount: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  orderId: string;
  orderType: string;
  returnUrl: string;
}

export async function initiateSimplePayment(paymentData: SimplePaymentData): Promise<string> {
  const params = new URLSearchParams({
    orderId: paymentData.orderId,
    amount: paymentData.amount.toString(),
    returnUrl: paymentData.returnUrl
  });

  return paymentData.returnUrl + '?' + params.toString() + '&status=success';
}

export interface PayBrightCheckoutRequest {
  amount: number;
  currency: string;
  reference: string;
  description: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
  success_url: string;
  cancel_url: string;
}

export async function createPayBrightCheckout(request: PayBrightCheckoutRequest): Promise<string> {
  const params = new URLSearchParams({
    session_id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    reference: request.reference,
    amount: request.amount.toString(),
    currency: request.currency,
    email: request.customer.email,
    name: request.customer.name
  });

  return request.success_url.replace('{CHECKOUT_SESSION_ID}', params.get('session_id')!) + '&' + params.toString();
}
