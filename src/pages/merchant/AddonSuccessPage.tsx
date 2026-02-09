import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader, Sparkles } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function AddonSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [addonDetails, setAddonDetails] = useState<any>(null);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPurchase = async () => {
      if (!sessionId || !user) {
        setError('Invalid session');
        setLoading(false);
        return;
      }

      try {
        const { data: merchant, error: merchantError } = await supabase
          .from('merchants')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (merchantError || !merchant) {
          throw new Error('Merchant not found');
        }

        const { data: subscription, error: subError } = await supabase
          .from('merchant_addon_subscriptions')
          .select(`
            *,
            automation_addons (
              name,
              description,
              feature_flag
            )
          `)
          .eq('merchant_id', merchant.id)
          .eq('paybright_transaction_id', sessionId)
          .maybeSingle();

        if (subError) {
          console.error('Subscription lookup error:', subError);
        }

        setAddonDetails({
          merchantName: merchant.business_name,
          subscription: subscription || null
        });
      } catch (err) {
        console.error('Error verifying purchase:', err);
        setError(err instanceof Error ? err.message : 'Failed to verify purchase');
      } finally {
        setLoading(false);
      }
    };

    verifyPurchase();
  }, [sessionId, user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Activating your add-on...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={() => navigate('/merchant/addons')}>
            Return to Add-Ons
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const addon = addonDetails?.subscription?.automation_addons;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-12">
        <Card>
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Add-On Activated!
            </h1>
            {addon && (
              <p className="text-lg text-slate-600 mb-8">
                {addon.name} is now active on your account
              </p>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-slate-900">
                  You now have access to:
                </h2>
              </div>
              {addon && (
                <p className="text-slate-700">
                  {addon.description}
                </p>
              )}
            </div>

            <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-slate-900 mb-4">
                What happens next?
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Your add-on is active immediately</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All features are now unlocked in your dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>You'll receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Billing details are available in your settings</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/merchant/dashboard')}
                variant="primary"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
              <Button
                onClick={() => navigate('/merchant/addons')}
                variant="secondary"
                size="lg"
              >
                Browse More Add-Ons
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
