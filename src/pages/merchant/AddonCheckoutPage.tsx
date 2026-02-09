import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { initiatePayBrightPayment } from '../../lib/paybright';

export default function AddonCheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addon, setAddon] = useState<any>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const addonSlug = searchParams.get('addon');
  const cycle = searchParams.get('cycle') || 'monthly';

  useEffect(() => {
    if (cycle === 'annual') {
      setBillingCycle('annual');
    }
  }, [cycle]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !addonSlug) return;

      const [addonResult, merchantResult] = await Promise.all([
        supabase
          .from('automation_addons')
          .select('*')
          .eq('slug', addonSlug)
          .maybeSingle(),
        supabase
          .from('merchants')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (addonResult.data) {
        setAddon(addonResult.data);
      }

      if (merchantResult.data) {
        setMerchant(merchantResult.data);
      }
    };

    fetchData();
  }, [user, addonSlug]);

  const handleCheckout = async () => {
    if (!addon || !merchant || !user) return;

    setLoading(true);
    setError('');

    try {
      const amount = billingCycle === 'monthly'
        ? addon.monthly_price_cents
        : addon.annual_price_cents;

      const billingCycleEnd = new Date();
      if (billingCycle === 'monthly') {
        billingCycleEnd.setMonth(billingCycleEnd.getMonth() + 1);
      } else {
        billingCycleEnd.setFullYear(billingCycleEnd.getFullYear() + 1);
      }

      const { data: subscription, error: subError } = await supabase
        .from('merchant_addon_subscriptions')
        .insert({
          merchant_id: merchant.id,
          addon_id: addon.id,
          status: 'pending',
          billing_cycle: billingCycle,
          billing_cycle_start: new Date().toISOString(),
          billing_cycle_end: billingCycleEnd.toISOString()
        })
        .select()
        .single();

      if (subError) throw subError;

      const paymentResult = await initiatePayBrightPayment({
        merchantId: merchant.id,
        transactionType: 'subscription',
        referenceId: subscription.id,
        referenceTable: 'merchant_addon_subscriptions',
        amount: amount,
        customerEmail: user.email!,
        customerName: merchant.business_name || user.email!,
        billingAddress: {
          firstName: merchant.business_name?.split(' ')[0] || 'Business',
          lastName: merchant.business_name?.split(' ').slice(1).join(' ') || 'Owner',
          address1: merchant.address_line1 || '123 Main St',
          city: merchant.city || 'City',
          province: merchant.state || 'ON',
          postalCode: merchant.postal_code || 'A1A 1A1',
          country: merchant.country || 'CA',
          phone: merchant.phone || '5555555555',
        },
        metadata: {
          subscription_id: subscription.id,
          addon_id: addon.id,
          addon_name: addon.name,
          billing_cycle: billingCycle,
        },
      });

      if (!paymentResult.success || !paymentResult.checkoutHtml) {
        throw new Error(paymentResult.error || 'Payment initialization failed');
      }

      const paymentWindow = window.open('', 'paybright_checkout', 'width=800,height=600');
      if (paymentWindow) {
        paymentWindow.document.write(paymentResult.checkoutHtml);
        paymentWindow.document.close();

        const checkWindowClosed = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkWindowClosed);
            navigate(`/merchant/addons/success?subscription=${subscription.id}`);
          }
        }, 1000);
      } else {
        throw new Error('Could not open payment window. Please allow popups for this site.');
      }
    } catch (err) {
      console.error('Error creating checkout:', err);
      setError(err instanceof Error ? err.message : 'Failed to create checkout session');
      setLoading(false);
    }
  };

  if (!addon || !merchant) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const price = billingCycle === 'monthly'
    ? addon.monthly_price_cents / 100
    : addon.annual_price_cents / 100;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/merchant/addons')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Add-Ons
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {addon.name}
          </h1>
          <p className="text-slate-600">{addon.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Billing Cycle</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      billingCycle === 'monthly'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">Monthly</div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">
                      ${(addon.monthly_price_cents / 100).toFixed(0)}
                      <span className="text-sm text-slate-600 font-normal">/mo</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`p-4 rounded-lg border-2 transition-all relative ${
                      billingCycle === 'annual'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="absolute -top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Save 20%
                    </div>
                    <div className="font-semibold text-slate-900">Annual</div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">
                      ${(addon.annual_price_cents / 100).toFixed(0)}
                      <span className="text-sm text-slate-600 font-normal">/yr</span>
                    </div>
                  </button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  What You'll Get
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Immediate activation upon payment</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Full access to all features</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Cancel anytime</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Priority support for this feature</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{addon.name}</span>
                    <span className="font-semibold text-slate-900">${price.toFixed(2)}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Annual savings (20%)</span>
                      <span className="font-semibold">
                        -${((addon.monthly_price_cents * 12 - addon.annual_price_cents) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-slate-900">${price.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Billed {billingCycle === 'monthly' ? 'monthly' : 'annually'}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </span>
                  )}
                </Button>

                <p className="text-xs text-slate-600 text-center mt-4">
                  Secure payment powered by GoPayBright
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
