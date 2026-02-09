import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, ArrowLeft, AlertCircle, Star } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { initiatePayBrightPayment } from '../../lib/paybright';

export default function SwipeFileCheckoutPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

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

  const SWIPE_FILE_PRICE = 97;

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    if (!profile) return;

    try {
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (merchantData) {
        setMerchant(merchantData);
        setBillingInfo(prev => ({
          ...prev,
          firstName: merchantData.business_name.split(' ')[0] || '',
          lastName: merchantData.business_name.split(' ').slice(1).join(' ') || '',
          email: merchantData.email || '',
          phone: merchantData.phone || '',
          address1: merchantData.address_line1 || '',
          city: merchantData.city || '',
          province: merchantData.state || '',
          postalCode: merchantData.postal_code || '',
        }));

        const { data: accessData } = await supabase
          .from('swipe_file_access')
          .select('*')
          .eq('merchant_id', profile.id)
          .maybeSingle();

        if (accessData) {
          setHasAccess(true);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load merchant details');
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
    if (!validateForm() || !merchant) return;

    if (hasAccess) {
      setError('You already have access to the Swipe File Library');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { data: accessRecord, error: accessError } = await supabase
        .from('swipe_file_access')
        .insert({
          merchant_id: profile!.id,
          access_type: 'purchased',
          price_paid: SWIPE_FILE_PRICE,
          access_granted_at: null,
        })
        .select()
        .single();

      if (accessError) throw accessError;

      const amountCents = SWIPE_FILE_PRICE * 100;

      const paymentResult = await initiatePayBrightPayment({
        merchantId: merchant.id,
        transactionType: 'merchant_service',
        referenceId: accessRecord.id,
        referenceTable: 'swipe_file_access',
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
          access_id: accessRecord.id,
          product: 'swipe_file_library',
          price: SWIPE_FILE_PRICE,
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
            navigate(`/merchant/swipe-file/payment-complete?access=${accessRecord.id}`);
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

  if (hasAccess) {
    return (
      <BusinessHubLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">You Already Have Access!</h2>
          <p className="text-slate-600 mb-6">You have lifetime access to the Swipe File Library.</p>
          <Button onClick={() => navigate('/merchant/swipe-file')}>
            Go to Swipe File Library
          </Button>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/merchant/swipe-file')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Swipe File
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card variant="bordered" className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Swipe File Library</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Lifetime Access</p>
                  <p className="text-lg font-bold text-slate-900">Ad Swipe File Library</p>
                </div>

                <div className="pt-4 border-t border-purple-200">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-slate-600">One-Time Payment</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">${SWIPE_FILE_PRICE}</div>
                      <div className="text-sm text-slate-500 line-through">$297</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">67% OFF - Limited time offer</p>
                </div>

                <div className="pt-4 border-t border-purple-200">
                  <p className="text-xs text-slate-600 mb-3 font-semibold">What You Get:</p>
                  <ul className="space-y-2">
                    <li className="text-sm text-slate-700 flex items-start">
                      <Star className="w-4 h-4 text-[#F5B82E] mr-2 flex-shrink-0 mt-0.5" />
                      500+ Facebook & Instagram ad templates
                    </li>
                    <li className="text-sm text-slate-700 flex items-start">
                      <Star className="w-4 h-4 text-[#F5B82E] mr-2 flex-shrink-0 mt-0.5" />
                      200+ Google ad campaigns
                    </li>
                    <li className="text-sm text-slate-700 flex items-start">
                      <Star className="w-4 h-4 text-[#F5B82E] mr-2 flex-shrink-0 mt-0.5" />
                      100+ Landing page designs
                    </li>
                    <li className="text-sm text-slate-700 flex items-start">
                      <Star className="w-4 h-4 text-[#F5B82E] mr-2 flex-shrink-0 mt-0.5" />
                      Complete sales scripts library
                    </li>
                    <li className="text-sm text-slate-700 flex items-start">
                      <Star className="w-4 h-4 text-[#F5B82E] mr-2 flex-shrink-0 mt-0.5" />
                      Industry-specific deal ideas
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-purple-200">
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
                  <Lock className="w-5 h-5 mr-2 text-purple-600" />
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                  className="mt-6 bg-purple-600 hover:bg-purple-700"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Complete Secure Payment
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
