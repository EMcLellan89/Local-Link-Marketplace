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

interface SubscriptionTier {
  id: string;
  name: string;
  monthly_price: string;
  postcard_placement: string;
  features: string[];
  is_active: boolean;
}

export default function TierUpgradeCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [merchant, setMerchant] = useState<any>(null);

  const tierSlug = searchParams.get('tier');

  useEffect(() => {
    if (tierSlug && user) {
      fetchData();
    } else {
      setInitialLoading(false);
    }
  }, [tierSlug, user]);

  const fetchData = async () => {
    if (!tierSlug || !user) return;

    try {
      const tierName = tierSlug.charAt(0).toUpperCase() + tierSlug.slice(1).replace(/_/g, ' ');

      const [tierResult, merchantResult] = await Promise.all([
        supabase
          .from('subscription_tiers')
          .select('*')
          .ilike('name', tierName)
          .eq('is_active', true)
          .maybeSingle(),
        profile ? supabase
          .from('merchants')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle() : Promise.resolve({ data: null, error: null })
      ]);

      if (tierResult.data) {
        setSelectedTier(tierResult.data);
      }

      if (merchantResult.data) {
        setMerchant(merchantResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load tier information');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedTier || !merchant || !user) return;

    setLoading(true);
    setError('');

    try {
      const billingCycleEnd = new Date();
      billingCycleEnd.setMonth(billingCycleEnd.getMonth() + 1);

      const { data: subscription, error: subError } = await supabase
        .from('merchant_subscriptions')
        .insert({
          merchant_id: merchant.id,
          tier_id: selectedTier.id,
          status: 'pending',
          billing_cycle_start: new Date().toISOString(),
          billing_cycle_end: billingCycleEnd.toISOString()
        })
        .select()
        .single();

      if (subError) throw subError;

      const amountCents = Math.round(Number(selectedTier.monthly_price) * 100);

      const paymentResult = await initiatePayBrightPayment({
        merchantId: merchant.id,
        transactionType: 'subscription',
        referenceId: subscription.id,
        referenceTable: 'merchant_subscriptions',
        amount: amountCents,
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
          tier_id: selectedTier.id,
          tier_name: selectedTier.name,
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
            navigate(`/merchant/tier-upgrade/success?subscription=${subscription.id}`);
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

  if (initialLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2BB673] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading checkout...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!selectedTier) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Invalid Tier</h2>
            <p className="text-slate-600 mb-6">The selected tier could not be found.</p>
            <Button onClick={() => navigate('/merchant/upgrade')}>
              View Available Tiers
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const price = Number(selectedTier.monthly_price);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/merchant/upgrade')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Upgrade to {selectedTier.name}
          </h1>
          <p className="text-slate-600">
            Unlock powerful features to grow your business
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  What's Included
                </h2>
                <ul className="space-y-3">
                  {selectedTier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Postcard Placement</h3>
                  <p className="text-sm text-slate-600 capitalize">
                    {selectedTier.postcard_placement} Spot
                  </p>
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
                    <span className="text-slate-600">{selectedTier.name} Tier</span>
                    <span className="font-semibold text-slate-900">${price.toFixed(0)}/mo</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">Monthly Total</span>
                      <span className="text-2xl font-bold text-slate-900">${price.toFixed(0)}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Billed monthly, cancel anytime
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
                  className="w-full bg-[#2BB673] hover:bg-[#25a062]"
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
                  Secure payment powered by PayBright
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
