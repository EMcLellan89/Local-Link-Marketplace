import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Copy, TrendingUp, DollarSign, Users, MousePointer, CheckCircle } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';

interface PartnerData {
  id: string;
  referral_code: string;
  commission_rate: number;
  total_clicks: number;
  total_conversions: number;
  pending_commission_cents: number;
  total_commission_earned: number;
  affiliate_tier: string;
}

interface Commission {
  id: string;
  product_name: string;
  order_total_cents: number;
  commission_cents: number;
  commission_rate: number;
  status: string;
  created_at: string;
}

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAffiliateData();
  }, []);

  async function loadAffiliateData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user.id)
        .eq('affiliate_enabled', true)
        .single();

      if (partnerError) throw partnerError;
      setPartner(partnerData);

      const { data: commissionsData, error: commissionsError } = await supabase
        .from('affiliate_commissions')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (commissionsError) throw commissionsError;
      setCommissions(commissionsData || []);
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    } finally {
      setLoading(false);
    }
  }

  function copyReferralLink() {
    if (!partner) return;
    const link = `${window.location.origin}?ref=${partner.referral_code}`;
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
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Affiliate Program Not Enabled</h2>
          <p className="text-gray-600 mb-6">Contact support to enable your affiliate account.</p>
          <button
            onClick={() => navigate('/partner')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const conversionRate = partner.total_clicks > 0
    ? ((partner.total_conversions / partner.total_clicks) * 100).toFixed(2)
    : '0.00';

  const pendingEarnings = (partner.pending_commission_cents / 100).toFixed(2);
  const totalEarnings = (partner.total_commission_earned / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your referrals and earnings</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-gray-600 px-2 py-1 bg-green-100 rounded">
                {conversionRate}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{partner.total_conversions}</div>
            <div className="text-sm text-gray-600">Total Conversions</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <MousePointer className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{partner.total_clicks}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${pendingEarnings}</div>
            <div className="text-sm text-gray-600">Pending Earnings</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${totalEarnings}</div>
            <div className="text-sm text-gray-600">Total Earned</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Referral Link</h2>
            <p className="text-sm text-gray-600 mt-1">Share this link to earn {(partner.commission_rate * 100).toFixed(0)}% commission</p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm">
                {window.location.origin}?ref={partner.referral_code}
              </div>
              <button
                onClick={copyReferralLink}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <strong>Tier:</strong> {partner.affiliate_tier.charAt(0).toUpperCase() + partner.affiliate_tier.slice(1)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Commissions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No commissions yet. Start sharing your referral link!
                    </td>
                  </tr>
                ) : (
                  commissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(commission.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {commission.product_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${(commission.order_total_cents / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ${(commission.commission_cents / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          commission.status === 'paid' ? 'bg-green-100 text-green-800' :
                          commission.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {commission.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How It Works</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Share your unique referral link with potential customers</li>
            <li>2. When someone signs up or makes a purchase using your link, you earn commission</li>
            <li>3. Track your clicks, conversions, and earnings in real-time</li>
            <li>4. Request payouts once you reach the minimum threshold</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
