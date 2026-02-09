import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, Check, Phone } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { initiatePayBrightPayment } from '../../lib/paybright';

export default function AppointmentSettingCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const hours = location.state?.hours || 20;
  const weeklyAmount = hours * 25;

  const [loading, setLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada'
  });

  useEffect(() => {
    if (!location.state?.hours) {
      navigate('/merchant/services/appointment-setting');
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('merchant_orders')
        .insert({
          merchant_id: profile?.id,
          order_type: 'appointment_setting',
          status: 'pending',
          amount: weeklyAmount,
          details: {
            hours_per_week: hours,
            weekly_cost: weeklyAmount,
            hourly_rate: 25,
            billing_info: billingInfo
          }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const paymentRequest = {
        merchantId: profile?.id || '',
        transactionType: 'merchant_service' as const,
        referenceId: order.id,
        referenceTable: 'merchant_orders',
        amount: weeklyAmount * 100,
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
          phone: billingInfo.phone
        },
        metadata: {
          order_type: 'appointment_setting',
          hours_per_week: hours,
          weekly_cost: weeklyAmount
        }
      };

      const result = await initiatePayBrightPayment(paymentRequest);

      if (!result.success || !result.checkoutHtml) {
        throw new Error(result.error || 'Failed to initiate payment');
      }

      const paymentWindow = window.open('', 'PayBright Checkout', 'width=800,height=800');
      if (paymentWindow) {
        paymentWindow.document.write(result.checkoutHtml);
        paymentWindow.document.close();

        const checkInterval = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkInterval);
            navigate('/merchant/services/appointment-setting/confirmation', {
              state: { order, hours, weeklyAmount }
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/merchant/services/appointment-setting')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Service
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-2xl font-bold text-slate-900">Billing Information</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Enter your billing details to complete booking
                </p>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        required
                        value={billingInfo.firstName}
                        onChange={(e) => setBillingInfo({ ...billingInfo, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        required
                        value={billingInfo.lastName}
                        onChange={(e) => setBillingInfo({ ...billingInfo, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                      placeholder="you@business.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      required
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Street Address *
                    </label>
                    <Input
                      required
                      value={billingInfo.address1}
                      onChange={(e) => setBillingInfo({ ...billingInfo, address1: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City *
                      </label>
                      <Input
                        required
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                        placeholder="Toronto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Province *
                      </label>
                      <Input
                        required
                        value={billingInfo.province}
                        onChange={(e) => setBillingInfo({ ...billingInfo, province: e.target.value })}
                        placeholder="ON"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Postal Code *
                    </label>
                    <Input
                      required
                      value={billingInfo.postalCode}
                      onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                      placeholder="M5V 3A8"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      fullWidth
                      disabled={loading}
                      className="bg-[#2BB673] hover:bg-[#25a062] flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay ${weeklyAmount.toLocaleString()}/week
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card variant="bordered" className="sticky top-4">
              <CardHeader>
                <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Appointment Setting</h4>
                    <p className="text-sm text-slate-600">Professional service</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">Trained live callers</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">20 calls per hour average</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">3-8 appointments per week</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">CRM integration included</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Hours per week</span>
                    <span className="font-semibold text-slate-900">{hours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Hourly rate</span>
                    <span className="font-semibold text-slate-900">$25.00</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-slate-600">Weekly Cost</span>
                      <span className="text-2xl font-bold text-slate-900">${weeklyAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 flex items-start">
                  <Lock className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600">
                    Secure payment via PayBright. No long-term contracts required.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
