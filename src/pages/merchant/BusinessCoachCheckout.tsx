import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, CreditCard, Loader } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { DEV_MODE } from '../../lib/devMode';

interface CoachingPackage {
  id: string;
  name: string;
  description: string;
  session_count: number;
  duration_weeks: number;
  price_cents: number;
  features: string[];
}

export default function BusinessCoachCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('package');

  const [packageData, setPackageData] = useState<CoachingPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (packageId) {
      loadPackage();
    } else {
      navigate('/merchant/business-coach');
    }
  }, [packageId]);

  async function loadPackage() {
    try {
      const { data } = await supabase
        .from('business_coaching_packages')
        .select('*')
        .eq('id', packageId)
        .single();

      if (data) {
        setPackageData(data);
      } else {
        navigate('/merchant/business-coach');
      }
    } catch (error) {
      console.error('Error loading package:', error);
      navigate('/merchant/business-coach');
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (!packageData || !user) return;

    setProcessing(true);
    setError('');

    try {
      if (DEV_MODE) {
        alert('Dev Mode: Payment processing is disabled. You can view the package details but cannot complete purchase.');
        setProcessing(false);
        return;
      }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!merchant) {
        setError('Merchant profile not found');
        setProcessing(false);
        return;
      }

      // TODO: Integrate with Stripe or payment processor
      // For now, create a booking record
      const { data: booking, error: bookingError } = await supabase
        .from('business_coaching_bookings')
        .insert({
          entity_type: 'merchant',
          entity_id: merchant.id,
          package_id: packageData.id,
          status: 'pending',
          sessions_remaining: packageData.session_count,
          sessions_completed: 0,
          payment_status: 'unpaid',
          payment_amount_cents: packageData.price_cents,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Call function to create partner commissions
      await supabase.rpc('create_coaching_commission', {
        p_booking_id: booking.id,
        p_merchant_id: merchant.id,
        p_package_price_cents: packageData.price_cents,
      });

      navigate('/merchant/business-coach?success=true');
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout');
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </BusinessHubLayout>
    );
  }

  if (!packageData) {
    return null;
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/merchant/business-coach')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Coaching
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
            <p className="text-blue-100">You're one step away from expert business coaching</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{packageData.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{packageData.description}</p>

                  <div className="space-y-2 mb-4">
                    {packageData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {packageData.session_count} session{packageData.session_count > 1 ? 's' : ''}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${(packageData.price_cents / 100).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {DEV_MODE && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800 font-semibold">Dev Mode Active</p>
                    <p className="text-xs text-yellow-700">Payment processing is disabled. Button will show alert instead.</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Happens Next?</h2>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Confirmation Email</h4>
                      <p className="text-sm text-gray-600">You'll receive a confirmation email with your booking details</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Schedule Your Sessions</h4>
                      <p className="text-sm text-gray-600">Our team will contact you within 24 hours to schedule your coaching sessions</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Start Growing</h4>
                      <p className="text-sm text-gray-600">Begin your coaching journey and start achieving your business goals</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Complete Purchase
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Secure payment processing. Your information is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
