import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CreditCard, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface SubscriptionData {
  status: string;
  tier: string;
  current_period_end: string | null;
  stripe_customer_id: string | null;
}

export default function PartnerBillingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [selectedTier, setSelectedTier] = useState<'monthly' | 'annual'>('monthly');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadSubscription();
  }, [user]);

  async function loadSubscription() {
    try {
      const { data, error } = await supabase
        .from('partner_crm_subscriptions')
        .select('status, tier, current_period_end, stripe_customer_id')
        .eq('partner_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe() {
    setProcessing(true);
    try {
      const { data: sessionData, error } = await supabase.functions.invoke('partner-crm-checkout', {
        body: { tier: selectedTier },
      });

      if (error) throw error;

      if (sessionData.url) {
        window.location.href = sessionData.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
      setProcessing(false);
    }
  }

  async function handleManageBilling() {
    setProcessing(true);
    try {
      if (!subscription?.stripe_customer_id) {
        alert('No customer ID found');
        return;
      }

      window.open('https://billing.stripe.com/p/login/test_00000000', '_blank');
    } catch (error) {
      console.error('Error opening billing portal:', error);
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isActive = subscription?.status === 'active';
  const isPastDue = subscription?.status === 'past_due';
  const isInactive = !subscription || subscription.status === 'inactive';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner CRM Billing</h1>
          <p className="text-gray-600 mt-2">
            Manage your Partner CRM subscription and billing details
          </p>
        </div>

        {isPastDue && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Payment Past Due</h3>
              <p className="text-yellow-800 text-sm mt-1">
                Your payment failed. Commission payouts are paused until payment is received.
              </p>
              <Button
                variant="primary"
                onClick={handleManageBilling}
                className="mt-3"
              >
                Update Payment Method
              </Button>
            </div>
          </div>
        )}

        {isInactive && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Partner CRM Inactive</h3>
              <p className="text-red-800 text-sm mt-1">
                Commissions are currently withheld. Activate Partner CRM to release payouts.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
          </div>

          {isActive ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Active Subscription</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Plan</p>
                  <p className="font-semibold text-gray-900 capitalize">{subscription.tier}</p>
                </div>
                {subscription.current_period_end && (
                  <div>
                    <p className="text-gray-600">Renews</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={handleManageBilling}
                  disabled={processing}
                >
                  Manage Billing
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No active subscription</p>
          )}
        </div>

        {isInactive && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Activate Partner CRM
            </h2>
            <p className="text-gray-600 mb-6">
              Partner CRM is required to track deals, manage leads, and release commission payouts.
            </p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedTier('monthly')}
                className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                  selectedTier === 'monthly'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Monthly</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$49</p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTier('annual')}
                className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                  selectedTier === 'annual'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Annual</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Save $98
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$490</p>
                  <p className="text-sm text-gray-600">per year</p>
                </div>
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Includes:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Deal & pipeline tracking
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Attribution links & partner codes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Commission dashboard & payout tracking
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Swipe files & promo assets
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Training & onboarding
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Leaderboards & bonuses
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-900">
                <strong>Important:</strong> Commissions are only released while your Partner CRM subscription is active.
                You keep attribution history, but payouts pause if the subscription is inactive.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleSubscribe}
              disabled={processing}
              className="w-full"
            >
              {processing ? 'Processing...' : `Activate ${selectedTier === 'annual' ? 'Annual' : 'Monthly'} Plan`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}