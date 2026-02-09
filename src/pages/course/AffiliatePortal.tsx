import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, Copy, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import BackButton from '../../components/ui/BackButton';
import { SwipeAssetsPanel } from '../../components/SwipeAssetsPanel';

interface Affiliate {
  id: string;
  code: string;
  rate_standard: number;
  rate_launch: number;
  is_active: boolean;
  total_referrals: number;
  total_earned_cents: number;
  total_paid_cents: number;
}

interface Referral {
  id: string;
  product_slug: string;
  order_amount_cents: number;
  commission_amount_cents: number;
  commission_rate: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

interface Payout {
  id: string;
  amount_cents: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

export default function AffiliatePortal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/affiliate');
      return;
    }
    loadAffiliateData();
  }, [user, navigate]);

  async function loadAffiliateData() {
    if (!user) return;

    try {
      const { data: affiliateData } = await supabase
        .from('course_affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (affiliateData) {
        setAffiliate(affiliateData);

        const { data: referralsData } = await supabase
          .from('course_affiliate_referrals')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('created_at', { ascending: false });

        setReferrals(referralsData || []);

        const { data: payoutsData } = await supabase
          .from('course_affiliate_payouts')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('created_at', { ascending: false });

        setPayouts(payoutsData || []);
      }
    } catch (err) {
      console.error('Error loading affiliate data:', err);
    } finally {
      setLoading(false);
    }
  }

  function copyAffiliateLink() {
    if (!affiliate) return;

    const link = `${window.location.origin}/marketplace/products/online-sales-without-ads?ref=${affiliate.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading affiliate portal...</p>
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <>
        <SEO title="Affiliate Portal" />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="p-8 text-center">
              <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Become a Course Affiliate
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Join our affiliate program and earn 40% commission on course sales
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Program Benefits:</h3>
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    40% commission during launch period
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    30% standard commission rate
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    30-day cookie tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Real-time reporting dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Monthly payouts
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Contact support to apply for the affiliate program
              </p>
              <Button onClick={() => navigate('/support')}>
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const earnedPending = affiliate.total_earned_cents - affiliate.total_paid_cents;
  const affiliateLink = `${window.location.origin}/marketplace/products/online-sales-without-ads?ref=${affiliate.code}`;

  return (
    <>
      <SEO title="Course Affiliate Portal" />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-2">Course Affiliate Portal</h1>
            <p className="text-xl text-blue-100">
              Earn {Math.round(affiliate.rate_launch * 100)}% commission promoting Online Sales Without Ads™
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(affiliate.total_earned_cents / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Payout</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(earnedPending / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Referrals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {affiliate.total_referrals}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Affiliate Link</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={affiliateLink}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
              />
              <Button onClick={copyAffiliateLink} className="flex items-center gap-2">
                {copied ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Share this link to earn {Math.round(affiliate.rate_launch * 100)}% commission on each sale
            </p>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Referrals</h2>
              {referrals.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No referrals yet. Start sharing your link!
                </p>
              ) : (
                <div className="space-y-4">
                  {referrals.slice(0, 10).map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          ${(referral.order_amount_cents / 100).toFixed(2)} Sale
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(referral.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +${(referral.commission_amount_cents / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600 capitalize">
                          {referral.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payout History</h2>
              {payouts.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No payouts yet. Keep promoting!
                </p>
              ) : (
                <div className="space-y-4">
                  {payouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          ${(payout.amount_cents / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payout.paid_at
                            ? new Date(payout.paid_at).toLocaleDateString()
                            : 'Scheduled'}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          payout.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : payout.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {payout.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-green-50">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Commission Structure</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Launch Rate</h4>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  {Math.round(affiliate.rate_launch * 100)}%
                </p>
                <p className="text-sm text-gray-600">
                  Currently active - limited time
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Standard Rate</h4>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {Math.round(affiliate.rate_standard * 100)}%
                </p>
                <p className="text-sm text-gray-600">
                  After launch period ends
                </p>
              </div>
            </div>
          </Card>

          <div className="mt-8">
            <SwipeAssetsPanel />
          </div>
        </div>
      </div>
    </>
  );
}