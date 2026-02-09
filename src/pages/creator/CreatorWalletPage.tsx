import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CreatorWalletBanner } from '../../components/creator/CreatorWalletBanner';
import { PayoutSetupProgress } from '../../components/creator/PayoutSetupProgress';
import { WhyPayoutSetupMatters } from '../../components/creator/WhyPayoutSetupMatters';
import Card, { CardBody } from '../../components/ui/Card';
import BackButton from '../../components/ui/BackButton';
import { DollarSign, Clock, AlertCircle, ChevronLeft } from 'lucide-react';

interface ConnectStatus {
  stripe_connect_account_id: string | null;
  connect_details_submitted: boolean;
  connect_charges_enabled: boolean;
  connect_payouts_enabled: boolean;
  connect_enabled: boolean;
  connect_disabled_reason?: string | null;
  payout_email?: string | null;
}

interface Payout {
  id: string;
  amount_cents: number;
  status: string;
  created_at: string;
}

export default function CreatorWalletPage() {
  const { user } = useAuth();
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>({
    stripe_connect_account_id: null,
    connect_details_submitted: false,
    connect_charges_enabled: false,
    connect_payouts_enabled: false,
    connect_enabled: false,
  });
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWalletData();
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;

    try {
      const { data: creator } = await supabase
        .from('ugc_creators')
        .select('id, stripe_connect_account_id, connect_details_submitted, connect_charges_enabled, connect_payouts_enabled, connect_enabled, connect_disabled_reason, payout_email')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!creator) {
        setError('Creator profile not found. Please apply to be a creator first.');
        setLoading(false);
        return;
      }

      setConnectStatus({
        stripe_connect_account_id: creator.stripe_connect_account_id,
        connect_details_submitted: creator.connect_details_submitted || false,
        connect_charges_enabled: creator.connect_charges_enabled || false,
        connect_payouts_enabled: creator.connect_payouts_enabled || false,
        connect_enabled: creator.connect_enabled || false,
        connect_disabled_reason: creator.connect_disabled_reason,
        payout_email: creator.payout_email,
      });

      const { data: payoutsData } = await supabase
        .from('ugc_payouts')
        .select('*')
        .eq('creator_id', creator.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (payoutsData) {
        setPayouts(payoutsData);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading wallet data:', err);
      setError('Failed to load wallet data');
      setLoading(false);
    }
  };

  const startConnectOnboarding = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to continue');
        return;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const res = await fetch(`${supabaseUrl}/functions/v1/create-stripe-connect-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to start onboarding');
      }

      const data = await res.json();
      window.location.href = data.onboarding_url;
    } catch (err) {
      console.error('Error starting onboarding:', err);
      alert(err instanceof Error ? err.message : 'Failed to start onboarding. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Error</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.href = '/creator/apply'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Apply to be a Creator
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const isFullyEnabled =
    connectStatus.connect_enabled &&
    connectStatus.connect_charges_enabled &&
    connectStatus.connect_payouts_enabled;

  const totalEarnings = payouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount_cents, 0);

  const pendingEarnings = payouts
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount_cents, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => window.location.href = '/creator/dashboard'}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Creator Wallet</h1>
          <p className="text-slate-600">Manage your payouts and earnings</p>
        </div>

        <CreatorWalletBanner
          status={connectStatus}
          onCompleteSetup={startConnectOnboarding}
        />

        {!isFullyEnabled && (
          <>
            <PayoutSetupProgress
              status={connectStatus}
              onCompleteSetup={startConnectOnboarding}
            />
            <WhyPayoutSetupMatters
              isEnabled={isFullyEnabled}
              onCompleteSetup={startConnectOnboarding}
            />
          </>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Earned</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${(totalEarnings / 100).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${(pendingEarnings / 100).toFixed(2)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardBody>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Payout History</h2>
            {payouts.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No payouts yet</h3>
                <p className="text-slate-600">Complete projects to start earning!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        ${(payout.amount_cents / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {new Date(payout.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          payout.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : payout.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
