import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Settings, Users, MousePointerClick, CheckCircle, Gift, TrendingUp, Copy, Check, ExternalLink, Printer } from 'lucide-react';

interface ReferralProgram {
  id: string;
  merchant_id: string;
  is_enabled: boolean;
  landing_slug: string;
  program_name: string;
  reward_type: string;
  reward_value_cents: number;
}

interface ReferralStats {
  total_clicks: number;
  total_leads: number;
  total_qualified: number;
  total_rewarded: number;
  conversion_rate: number;
}

interface ReferralActivity {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  created_at: string;
  qualified_at: string | null;
  rewarded_at: string | null;
  clicks: number;
  leads: number;
}

export default function CustomerReferralDashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<ReferralProgram | null>(null);
  const [stats, setStats] = useState<ReferralStats>({
    total_clicks: 0,
    total_leads: 0,
    total_qualified: 0,
    total_rewarded: 0,
    conversion_rate: 0
  });
  const [activities, setActivities] = useState<ReferralActivity[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user && profile?.role === 'merchant') {
      loadDashboardData();
    }
  }, [user, profile]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const { data: programData, error: programError } = await supabase
        .from('customer_referral_programs')
        .select('*')
        .eq('merchant_id', user!.id)
        .maybeSingle();

      if (programError) throw programError;

      if (!programData) {
        setProgram(null);
        setLoading(false);
        return;
      }

      setProgram(programData);

      const { data: linksData, error: linksError } = await supabase
        .from('customer_referral_links')
        .select(`
          id,
          customer_id,
          share_code,
          created_at,
          customer:profiles!customer_referral_links_customer_id_fkey(
            full_name,
            email
          )
        `)
        .eq('merchant_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (linksError) throw linksError;

      const enrichedActivities: ReferralActivity[] = await Promise.all(
        (linksData || []).map(async (link: any) => {
          const { data: referralsData } = await supabase
            .from('customer_referrals')
            .select('*')
            .eq('referral_link_id', link.id);

          const clicks = referralsData?.filter(r => r.status === 'clicked').length || 0;
          const leads = referralsData?.filter(r => r.status === 'lead').length || 0;
          const qualified = referralsData?.filter(r => r.status === 'qualified').length || 0;

          const { data: rewardsData } = await supabase
            .from('customer_referral_rewards')
            .select('distributed_at')
            .eq('customer_id', link.customer_id)
            .not('distributed_at', 'is', null)
            .maybeSingle();

          return {
            id: link.id,
            customer_name: link.customer?.full_name || 'Unknown',
            customer_email: link.customer?.email || '',
            status: qualified > 0 ? 'qualified' : (leads > 0 ? 'lead' : 'active'),
            created_at: link.created_at,
            qualified_at: qualified > 0 ? referralsData?.find(r => r.status === 'qualified')?.updated_at || null : null,
            rewarded_at: rewardsData?.distributed_at || null,
            clicks,
            leads
          };
        })
      );

      setActivities(enrichedActivities);

      const totalClicks = enrichedActivities.reduce((sum, a) => sum + a.clicks, 0);
      const totalLeads = enrichedActivities.reduce((sum, a) => sum + a.leads, 0);
      const totalQualified = enrichedActivities.filter(a => a.status === 'qualified').length;
      const totalRewarded = enrichedActivities.filter(a => a.rewarded_at).length;

      setStats({
        total_clicks: totalClicks,
        total_leads: totalLeads,
        total_qualified: totalQualified,
        total_rewarded: totalRewarded,
        conversion_rate: totalClicks > 0 ? (totalQualified / totalClicks) * 100 : 0
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function copyLandingUrl() {
    if (!program) return;
    const url = `${window.location.origin}/r/${program.landing_slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function formatCurrency(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function getStatusBadge(status: string) {
    const badges = {
      active: { label: 'Active', class: 'bg-blue-100 text-blue-800' },
      lead: { label: 'Lead Generated', class: 'bg-yellow-100 text-yellow-800' },
      qualified: { label: 'Qualified', class: 'bg-green-100 text-green-800' }
    };
    const badge = badges[status as keyof typeof badges] || badges.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.label}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/merchant/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Referral Program Yet
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Set up your Customer Referral Engine to turn happy customers into your best sales channel.
            </p>
            <button
              onClick={() => navigate('/merchant/referrals/settings')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-5 h-5 mr-2" />
              Configure Program
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/merchant/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/merchant/referrals/cards')}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Cards
            </button>
            <button
              onClick={() => navigate('/merchant/referrals/settings')}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{program.program_name}</h1>
              <p className="text-gray-600 mt-1">
                Reward: {formatCurrency(program.reward_value_cents)} {program.reward_type}
              </p>
            </div>
            <div className="flex items-center">
              {program.is_enabled ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Paused
                </span>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-blue-900">Referral Landing Page</div>
                <div className="text-sm text-blue-700 font-mono">
                  {window.location.origin}/r/{program.landing_slug}
                </div>
              </div>
            </div>
            <button
              onClick={copyLandingUrl}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <MousePointerClick className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total_clicks}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total_leads}</div>
            <div className="text-sm text-gray-600">Leads Generated</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total_qualified}</div>
            <div className="text-sm text-gray-600">Qualified</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Gift className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total_rewarded}</div>
            <div className="text-sm text-gray-600">Rewards Sent</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.conversion_rate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Referral Activity</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track customer referral performance
            </p>
          </div>

          {activities.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No referral activity yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Share your landing page with customers to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qualified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rewarded
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {activity.customer_name}
                          </div>
                          <div className="text-sm text-gray-500">{activity.customer_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(activity.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.clicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.leads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(activity.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(activity.qualified_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(activity.rewarded_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
