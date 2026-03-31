import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface SubscriptionTier {
  id: string;
  name: string;
  monthly_price: string;
  postcard_placement: string;
  features: string[];
}

export default function SubscriptionCheckoutPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const tierId = searchParams.get('tier');

  const [tier, setTier] = useState<SubscriptionTier | null>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'CA',
  });

  useEffect(() => {
    if (tierId && profile) {
      loadData();
    }
  }, [tierId, profile]);

  const loadData = async () => {
    if (!tierId) return;

    try {
      const [tierResult, merchantResult] = await Promise.all([
        supabase
          .from('subscription_tiers')
          .select('*')
          .eq('id', tierId)
          .maybeSingle(),
        profile ? supabase
          .from('merchants')
          .select('*')
          .eq('user_id', profile.id)
          .maybeSingle() : Promise.resolve({ data: null, error: null })
      ]);

      if (tierResult.data) {
        setTier(tierResult.data);
      } else {
        setError('Subscription plan not found');
      }

      if (merchantResult.data) {
        setMerchant(merchantResult.data);
        setBillingInfo(prev => ({
          ...prev,
          firstName: merchantResult.data.business_name.split(' ')[0] || '',
          lastName: merchantResult.data.business_name.split(' ').slice(1).join(' ') || '',
          email: merchantResult.data.email || '',
          phone: merchantResult.data.phone || '',
          address1: merchantResult.data.address_line1 || '',
          city: merchantResult.data.city || '',
          province: merchantResult.data.state || '',
          postalCode: merchantResult.data.postal_code || '',
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!billingInfo.firstName || !billingInfo.lastName) {
      setError('First and last name are required');
      return false;
    }
    if (!billingInfo.email) {
      setError('Email is required');
      return false;
    }
    if (!billingInfo.phone) {
      setError('Phone number is required');
      return false;
    }
    if (!billingInfo.address1 || !billingInfo.city || !billingInfo.province || !billingInfo.postalCode) {
      setError('Complete billing address is required');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateForm() || !tier || !merchant) return;

    setProcessing(true);
    setError(null);

    try {
      const billingCycleEnd = new Date();
      billingCycleEnd.setMonth(billingCycleEnd.getMonth() + 1);

      const { data: subscription, error: subError } = await supabase
        .from('merchant_subscriptions')
        .insert({
          merchant_id: merchant.id,
          tier_id: tier.id,
          status: 'pending',
          billing_cycle_start: new Date().toISOString(),
          billing_cycle_end: billingCycleEnd.toISOString()
        })
        .select()
        .single();

      if (subError) throw subError;

      const amountCents = Math.round(Number(tier.monthly_price) * 100);

      const paymentResult = await initiatePayBrightPayment({
        merchantId: merchant.id,
        transactionType: 'subscription',
        referenceId: subscription.id,
        referenceTable: 'merchant_subscriptions',
        amount: amountCents,
        customerEmail: billingInfo.email,
        customerName: `${billingInfo.firstName} ${billingInfo.lastName}`,
        billingAddress: {
          firstName: billingInfo.firstName,
          lastName: billingInfo.lastName,
          address1: billingInfo.address1,
          city: billingInfo.city,
          province: billingInfo.province,
          postalCode: billingInfo.postalCode,
          country: billingInfo.country,
          phone: billingInfo.phone,
        },
        metadata: {
          subscription_id: subscription.id,
          tier_id: tier.id,
          tier_name: tier.name,
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
            navigate(`/merchant/subscription/payment-complete?subscription=${subscription.id}`);
          }
        }, 1000);
      } else {
        throw new Error('Could not open payment window. Please allow popups for this site.');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2BB673] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading checkout...</p>
          </div>
        </div>
      </BusinessHubLayout>
    );
  }

  if (!tier) {
    return (
      <BusinessHubLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Subscription Not Found</h2>
          <p className="text-slate-600 mb-6">The subscription plan you selected could not be found.</p>
          <Button onClick={() => navigate('/merchant/upgrade')}>
            Back to Plans
          </Button>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/merchant/upgrade')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Subscription Summary</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Selected Plan</p>
                  <p className="text-lg font-bold text-slate-900">{tier.name}</p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-slate-600">Monthly Subscription</span>
                    <span className="text-2xl font-bold text-slate-900">
                      ${Number(tier.monthly_price).toFixed(0)}/mo
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Billed monthly, cancel anytime</p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-3">Included Features:</p>
                  <ul className="space-y-2">
                    {tier.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-start">
                        <span className="text-[#2BB673] mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center text-sm text-slate-600">
                    <Lock className="w-4 h-4 mr-2" />
                    Secure encrypted payment
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Billing Information
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={billingInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={billingInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={billingInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={billingInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />

                <Input
                  label="Address"
                  value={billingInfo.address1}
                  onChange={(e) => handleInputChange('address1', e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={billingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                  <Input
                    label="Province"
                    value={billingInfo.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    value={billingInfo.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Country
                    </label>
                    <select
                      value={billingInfo.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    >
                      <option value="CA">Canada</option>
                      <option value="US">United States</option>
                    </select>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleCheckout}
                  disabled={processing}
                  className="mt-6"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Complete Secure Checkout
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-slate-500">
                  Your payment information is processed securely through PayBright. We never store your card details.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
