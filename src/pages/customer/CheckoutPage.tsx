import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Lock, AlertCircle, Check, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';

interface DealDetail {
  id: string;
  title: string;
  price_cents: number;
  image_url: string | null;
  merchant: {
    id: string;
    business_name: string;
  };
}

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [deal, setDeal] = useState<DealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'info' | 'payment'>('info');

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address1: '',
    city: '',
    province: 'ON',
    postalCode: '',
    country: 'CA',
  });

  useEffect(() => {
    if (id) {
      fetchDeal();
    }
  }, [id]);

  useEffect(() => {
    if (profile) {
      setBillingInfo(prev => ({
        ...prev,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user?.email || prev.email,
      }));
    }
  }, [profile, user]);

  const fetchDeal = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          id,
          title,
          price_cents,
          image_url,
          merchant:merchants (
            id,
            business_name
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Deal not found');

      setDeal(data as DealDetail);
    } catch (err) {
      console.error('Error fetching deal:', err);
      setError('Failed to load deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateBillingInfo = (): boolean => {
    if (!billingInfo.firstName || !billingInfo.lastName) {
      setError('Please enter your full name');
      return false;
    }
    if (!billingInfo.email || !billingInfo.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!billingInfo.phone || billingInfo.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!billingInfo.address1) {
      setError('Please enter your address');
      return false;
    }
    if (!billingInfo.city) {
      setError('Please enter your city');
      return false;
    }
    if (!billingInfo.postalCode) {
      setError('Please enter your postal code');
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    setError(null);
    if (validateBillingInfo()) {
      setStep('payment');
    }
  };

  const handlePayBrightPayment = async () => {
    if (!deal || !user) return;

    setProcessing(true);
    setError(null);

    try {
      const { data: merchantConfig } = await supabase
        .from('paybright_config')
        .select('is_active')
        .eq('merchant_id', deal.merchant.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!merchantConfig) {
        setError('This merchant does not accept PayBright payments. Please use direct purchase.');
        setProcessing(false);
        return;
      }

      const totalAmount = (deal.price_cents * quantity) / 100;

      const result = await initiatePayBrightPayment({
        merchantId: deal.merchant.id,
        transactionType: 'deal_purchase',
        referenceId: deal.id,
        referenceTable: 'deals',
        amount: totalAmount,
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
          quantity,
          dealTitle: deal.title,
        },
      });

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      if (result.checkoutHtml && result.transactionId) {
        const checkoutWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        if (checkoutWindow) {
          checkoutWindow.document.write(result.checkoutHtml);
          checkoutWindow.document.close();

          const checkInterval = setInterval(() => {
            if (checkoutWindow.closed) {
              clearInterval(checkInterval);
              navigate(`/payment/status?transaction=${result.transactionId}`);
            }
          }, 1000);
        } else {
          alert('Please allow pop-ups for this site to complete payment.');
          setProcessing(false);
        }
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const handleDirectPurchase = async () => {
    if (!deal || !user) return;

    setProcessing(true);
    setError(null);

    try {
      const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let customerId = customerData?.id;

      if (!customerId) {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({ user_id: user.id })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      const amountPaidCents = deal.price_cents * quantity;
      const commissionCents = Math.round(amountPaidCents * 0.30);
      const merchantPayoutCents = amountPaidCents - commissionCents;

      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          customer_id: customerId,
          deal_id: deal.id,
          quantity,
          amount_paid_cents: amountPaidCents,
          commission_cents: commissionCents,
          merchant_payout_cents: merchantPayoutCents,
          status: 'paid',
          payment_method: 'direct',
        })
        .select('id')
        .single();

      if (purchaseError) throw purchaseError;

      const { data: currentDeal } = await supabase
        .from('deals')
        .select('quantity_sold')
        .eq('id', deal.id)
        .single();

      if (currentDeal) {
        await supabase
          .from('deals')
          .update({ quantity_sold: currentDeal.quantity_sold + quantity })
          .eq('id', deal.id);
      }

      const pointsEarned = Math.floor(amountPaidCents / 100);
      await supabase
        .from('loyalty_events')
        .insert({
          customer_id: customerId,
          source: 'deal_purchase',
          points: pointsEarned,
          description: `Purchased ${deal.title}`,
        });

      navigate(`/purchase/${purchase.id}`);
    } catch (err) {
      console.error('Purchase error:', err);
      setError('Failed to complete purchase. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading checkout...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!deal) {
    return (
      <DashboardLayout>
        <Card variant="bordered">
          <CardBody>
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Deal Not Found</h3>
              <Button onClick={() => navigate('/dashboard')}>Browse Deals</Button>
            </div>
          </CardBody>
        </Card>
      </DashboardLayout>
    );
  }

  const totalAmount = deal.price_cents * quantity;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(`/deal/${id}`)}>
          ← Back to Deal
        </Button>

        {error && (
          <Card variant="bordered" className="bg-red-50 border-red-200">
            <CardBody>
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {step === 'info' ? (
              <Card variant="elevated">
                <CardHeader>
                  <h2 className="text-2xl font-bold text-slate-900">Billing Information</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        value={billingInfo.firstName}
                        onChange={(e) => setBillingInfo({ ...billingInfo, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        value={billingInfo.lastName}
                        onChange={(e) => setBillingInfo({ ...billingInfo, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                      placeholder="416-555-0100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address *
                    </label>
                    <Input
                      value={billingInfo.address1}
                      onChange={(e) => setBillingInfo({ ...billingInfo, address1: e.target.value })}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City *
                      </label>
                      <Input
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Province *
                      </label>
                      <select
                        value={billingInfo.province}
                        onChange={(e) => setBillingInfo({ ...billingInfo, province: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="ON">Ontario</option>
                        <option value="QC">Quebec</option>
                        <option value="BC">British Columbia</option>
                        <option value="AB">Alberta</option>
                        <option value="MB">Manitoba</option>
                        <option value="SK">Saskatchewan</option>
                        <option value="NS">Nova Scotia</option>
                        <option value="NB">New Brunswick</option>
                        <option value="NL">Newfoundland and Labrador</option>
                        <option value="PE">Prince Edward Island</option>
                        <option value="NT">Northwest Territories</option>
                        <option value="YT">Yukon</option>
                        <option value="NU">Nunavut</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Postal Code *
                      </label>
                      <Input
                        value={billingInfo.postalCode}
                        onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                        placeholder="M5H 2N2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country
                      </label>
                      <Input
                        value="Canada"
                        disabled
                      />
                    </div>
                  </div>

                  <Button fullWidth size="lg" onClick={handleContinueToPayment}>
                    Continue to Payment
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
                    <Button variant="ghost" onClick={() => setStep('info')}>
                      Edit Info
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {billingInfo.firstName} {billingInfo.lastName}
                      </span>
                    </div>
                    <div className="text-slate-600 ml-6">
                      {billingInfo.address1}<br />
                      {billingInfo.city}, {billingInfo.province} {billingInfo.postalCode}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      fullWidth
                      size="lg"
                      onClick={handlePayBrightPayment}
                      disabled={processing}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      {processing ? 'Processing...' : 'Pay with PayBright'}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">or</span>
                      </div>
                    </div>

                    <Button
                      fullWidth
                      size="lg"
                      variant="outline"
                      onClick={handleDirectPurchase}
                      disabled={processing}
                    >
                      {processing ? 'Processing...' : 'Complete Purchase'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Lock className="w-3 h-3" />
                    <span>Secure checkout powered by PayBright</span>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          <div className="md:col-span-1">
            <Card variant="elevated" className="sticky top-4">
              <CardHeader>
                <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-start gap-3">
                  {deal.image_url && (
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{deal.title}</h4>
                    <p className="text-sm text-slate-600">{deal.merchant.business_name}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Price</span>
                    <span className="text-slate-900">{formatPrice(deal.price_cents)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Quantity</span>
                    <span className="text-slate-900">{quantity}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-lg font-bold text-[#2BB673]">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2BB673] mt-0.5" />
                    <span className="text-xs text-slate-600">Instant delivery via email</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2BB673] mt-0.5" />
                    <span className="text-xs text-slate-600">Easy redemption at merchant</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2BB673] mt-0.5" />
                    <span className="text-xs text-slate-600">Earn loyalty points</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
