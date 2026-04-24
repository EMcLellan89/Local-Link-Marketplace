import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  CreditCard, AlertTriangle, CheckCircle, Loader2,
  DollarSign, BarChart2, Shield, Zap, Calendar
} from 'lucide-react';
import Button from '../../components/ui/Button';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface SubscriptionData {
  status: string;
  tier: string;
  current_period_end: string | null;
  stripe_customer_id: string | null;
}

const INCLUDED = [
  { icon: BarChart2, text: 'Deal & pipeline tracking' },
  { icon: Shield, text: 'Attribution links & partner codes' },
  { icon: DollarSign, text: 'Commission dashboard & payout tracking' },
  { icon: Zap, text: 'Swipe files & AI promo assets' },
  { icon: CheckCircle, text: 'Training & onboarding course' },
  { icon: BarChart2, text: 'Leaderboards & bonus alerts' },
];

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
      window.open('https://billing.stripe.com/p/login/test_00000000', '_blank');
    } catch (error) {
      console.error('Error opening billing portal:', error);
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#2BB673]" />
        </div>
      </DashboardLayout>
    );
  }

  const isActive = subscription?.status === 'active';
  const isPastDue = subscription?.status === 'past_due';
  const isInactive = !subscription || subscription.status === 'inactive';

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner CRM Billing</h1>
          <p className="text-slate-500 mt-1">
            Your Partner CRM subscription is required to track deals and release commission payouts.
          </p>
        </div>

        {/* Alert banners */}
        {isPastDue && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Payment past due</p>
              <p className="text-amber-800 text-sm mt-1">
                Your payment failed. Commission payouts are paused until your payment method is updated.
              </p>
              <Button
                size="sm"
                onClick={handleManageBilling}
                className="mt-3"
              >
                Update payment method
              </Button>
            </div>
          </div>
        )}

        {isInactive && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-900">Partner CRM not active</p>
              <p className="text-rose-800 text-sm mt-1">
                Commission payouts are withheld until your Partner CRM subscription is active.
              </p>
            </div>
          </div>
        )}

        {/* Active subscription card */}
        {isActive && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#2BB673] px-6 py-4">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Active Subscription</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Plan</p>
                  <p className="font-bold text-slate-900 capitalize">{subscription!.tier}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2BB673]">
                    <span className="w-2 h-2 bg-[#2BB673] rounded-full"></span>
                    Active
                  </span>
                </div>
                {subscription!.current_period_end && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Renews</p>
                    <p className="font-bold text-slate-900">
                      {new Date(subscription!.current_period_end).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={processing}
                size="sm"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage billing
              </Button>
            </div>
          </div>
        )}

        {/* Activation panel (inactive/past_due) */}
        {(isInactive || isPastDue) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Activate Partner CRM</h2>
              <p className="text-sm text-slate-500 mt-1">
                Choose a billing cycle to unlock commissions and your full partner toolkit.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Plan toggle */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedTier('monthly')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedTier === 'monthly'
                      ? 'border-[#2BB673] bg-[#2BB673]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">Monthly</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">$49</p>
                  <p className="text-sm text-slate-500">per month</p>
                </button>

                <button
                  onClick={() => setSelectedTier('annual')}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                    selectedTier === 'annual'
                      ? 'border-[#2BB673] bg-[#2BB673]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#2BB673] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Save $98
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">Annual</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">$490</p>
                  <p className="text-sm text-slate-500">per year</p>
                </button>
              </div>

              {/* What's included */}
              <div className="bg-slate-50 rounded-xl p-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">Everything included:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INCLUDED.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-2 text-sm text-slate-700">
                        <Icon className="w-4 h-4 text-[#2BB673] flex-shrink-0" />
                        {item.text}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payout warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                <strong>Important:</strong> Commission payouts are only released while your Partner CRM
                subscription is active. You keep full attribution history, but payouts pause if the
                subscription lapses.
              </div>

              <Button
                onClick={handleSubscribe}
                disabled={processing}
                className="w-full"
                size="lg"
              >
                {processing
                  ? 'Processing...'
                  : `Activate ${selectedTier === 'annual' ? 'Annual' : 'Monthly'} Plan`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
