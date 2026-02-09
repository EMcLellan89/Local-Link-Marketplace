import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function TierUpgradeSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [upgradeDetails, setUpgradeDetails] = useState<any>(null);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyUpgrade = async () => {
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

        const { data: transaction, error: txError } = await supabase
          .from('transactions')
          .select('*, merchant:merchants(*)')
          .eq('paybright_transaction_id', sessionId)
          .maybeSingle();

        if (txError) {
          console.error('Transaction lookup error:', txError);
        }

        setUpgradeDetails({
          merchantName: merchant.business_name,
          tier: merchant.subscription_plan,
          transaction: transaction || null
        });
      } catch (err) {
        console.error('Error verifying upgrade:', err);
        setError(err instanceof Error ? err.message : 'Failed to verify upgrade');
      } finally {
        setLoading(false);
      }
    };

    verifyUpgrade();
  }, [sessionId, user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Verifying your upgrade...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={() => navigate('/merchant/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const tierName = upgradeDetails?.tier?.replace('_', ' ').toUpperCase() || 'GROWTH';

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-12">
        <Card>
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Upgrade Successful!
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Welcome to the {tierName} tier
            </p>

            <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-slate-900 mb-4">
                What happens next?
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Your account has been upgraded immediately</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All new features and limits are now active</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>You'll receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Your next billing date will be shown in settings</span>
                </li>
              </ul>
            </div>

            {upgradeDetails?.transaction && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left text-sm">
                <div className="font-semibold text-slate-900 mb-2">Transaction Details</div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-xs">
                      {upgradeDetails.transaction.id.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">
                      ${(upgradeDetails.transaction.gross_amount_cents / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                onClick={() => navigate('/merchant/settings')}
                variant="secondary"
                size="lg"
              >
                View Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
