import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';

export default function SubscriptionPaymentCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subscriptionId = searchParams.get('subscription');

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'checking' | 'success' | 'pending' | 'failed'>('checking');
  const [subscription, setSubscription] = useState<any>(null);
  const [tier, setTier] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (subscriptionId) {
      checkPaymentStatus();
    }
  }, [subscriptionId]);

  const checkPaymentStatus = async () => {
    if (!subscriptionId) return;

    try {
      let attempts = 0;
      const maxAttempts = 10;

      const checkStatus = async (): Promise<boolean> => {
        const { data: sub, error: subError } = await supabase
          .from('merchant_subscriptions')
          .select('*, subscription_tiers(*)')
          .eq('id', subscriptionId)
          .maybeSingle();

        if (subError) throw subError;

        if (!sub) {
          throw new Error('Subscription not found');
        }

        setSubscription(sub);
        setTier(sub.subscription_tiers);

        const { data: txData, error: txError } = await supabase
          .from('paybright_transactions')
          .select('*')
          .eq('reference_id', subscriptionId)
          .eq('reference_table', 'merchant_subscriptions')
          .maybeSingle();

        if (txError && txError.code !== 'PGRST116') {
          throw txError;
        }

        if (txData) {
          setTransaction(txData);

          if (txData.status === 'authorized' || txData.status === 'captured' || txData.status === 'completed') {
            if (sub.status === 'active') {
              setStatus('success');
              return true;
            } else {
              await supabase
                .from('merchant_subscriptions')
                .update({ status: 'active' })
                .eq('id', subscriptionId);

              const { data: merchant } = await supabase
                .from('merchants')
                .select('id')
                .eq('id', sub.merchant_id)
                .maybeSingle();

              if (merchant) {
                await supabase
                  .from('merchants')
                  .update({
                    subscription_plan: sub.subscription_tiers.name.toLowerCase(),
                    current_subscription_id: subscriptionId
                  })
                  .eq('id', merchant.id);
              }

              setStatus('success');
              return true;
            }
          } else if (txData.status === 'failed') {
            setStatus('failed');
            return true;
          }
        }

        return false;
      };

      const pollStatus = async () => {
        while (attempts < maxAttempts) {
          const isComplete = await checkStatus();
          if (isComplete) {
            setLoading(false);
            return;
          }

          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        setStatus('pending');
        setLoading(false);
      };

      await pollStatus();
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('failed');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2BB673] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Verifying your payment...</p>
          </div>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-2xl mx-auto py-12">
        <Card variant="bordered">
          <CardBody className="text-center py-12">
            {status === 'success' && (
              <>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Welcome to {tier?.name}!
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  Your subscription has been successfully activated. You now have access to all premium features.
                </p>

                <div className="bg-slate-50 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Plan</p>
                      <p className="font-semibold text-slate-900">{tier?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Monthly Cost</p>
                      <p className="font-semibold text-slate-900">
                        ${Number(tier?.monthly_price).toFixed(0)}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Next Billing</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(subscription?.billing_cycle_end).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Status</p>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/merchant/dashboard')}
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => navigate('/merchant/settings')}
                  >
                    Manage Subscription
                  </Button>
                </div>
              </>
            )}

            {status === 'pending' && (
              <>
                <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Payment Processing
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  Your payment is being processed. This may take a few moments. We'll send you a confirmation email once complete.
                </p>

                <div className="space-y-3">
                  <Button
                    fullWidth
                    onClick={() => window.location.reload()}
                  >
                    Check Status Again
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => navigate('/merchant/dashboard')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </>
            )}

            {status === 'failed' && (
              <>
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Payment Failed
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  We were unable to process your payment. Please try again or contact support if the problem persists.
                </p>

                {transaction?.failure_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                    <p className="text-sm text-red-800">
                      <strong>Reason:</strong> {transaction.failure_reason}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/merchant/upgrade')}
                  >
                    Try Again
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => navigate('/merchant/dashboard')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
