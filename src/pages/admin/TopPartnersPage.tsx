import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trophy, TrendingUp, DollarSign, Star, Award } from 'lucide-react';

interface PartnerStats {
  partner_id: string;
  partner_name: string;
  partner_email: string;
  partner_tier: string;
  total_commissions_cents: number;
  total_sales_cents: number;
  order_count: number;
  recruited_count: number;
  recruited_earnings_cents: number;
}

export default function TopPartnersPage() {
  const [topByCommissions, setTopByCommissions] = useState<PartnerStats[]>([]);
  const [topBySales, setTopBySales] = useState<PartnerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [viewMode, setViewMode] = useState<'commissions' | 'sales'>('commissions');

  useEffect(() => {
    fetchTopPartners();
  }, [dateRange]);

  const fetchTopPartners = async () => {
    try {
      setLoading(true);

      const rangeMap: Record<string, number> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365,
        'all': 3650
      };

      const daysAgo = rangeMap[dateRange] || 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      // Fetch all partners with their earnings
      const { data: earnings, error: earningsError } = await supabase
        .from('partner_earnings')
        .select(`
          partner_id,
          amount_cents,
          earnings_type,
          sales_ledger!inner(
            id,
            amount_cents,
            created_at
          )
        `)
        .eq('status', 'paid')
        .gte('sales_ledger.created_at', cutoffDate.toISOString());

      if (earningsError) throw earningsError;

      // Fetch partner details
      const partnerIds = [...new Set(earnings?.map(e => e.partner_id) || [])];
      const { data: partners, error: partnersError } = await supabase
        .from('partners')
        .select('id, full_name, email, partner_tier, recruiter_partner_id')
        .in('id', partnerIds);

      if (partnersError) throw partnersError;

      // Build partner lookup
      const partnerMap = new Map(partners?.map(p => [p.id, p]) || []);

      // Calculate stats per partner
      const statsMap = new Map<string, {
        commissions: number;
        sales: number;
        orders: Set<string>;
        sellerEarnings: number;
        recruiterEarnings: number;
      }>();

      earnings?.forEach(e => {
        const stats = statsMap.get(e.partner_id) || {
          commissions: 0,
          sales: 0,
          orders: new Set(),
          sellerEarnings: 0,
          recruiterEarnings: 0
        };

        stats.commissions += e.amount_cents;
        stats.orders.add(e.sales_ledger.id);
        stats.sales += e.sales_ledger.amount_cents;

        if (e.earnings_type === 'seller') {
          stats.sellerEarnings += e.amount_cents;
        } else {
          stats.recruiterEarnings += e.amount_cents;
        }

        statsMap.set(e.partner_id, stats);
      });

      // Count recruits per partner
      const recruitsMap = new Map<string, number>();
      partners?.forEach(p => {
        if (p.recruiter_partner_id) {
          const count = recruitsMap.get(p.recruiter_partner_id) || 0;
          recruitsMap.set(p.recruiter_partner_id, count + 1);
        }
      });

      // Build final stats array
      const allStats: PartnerStats[] = Array.from(statsMap.entries()).map(([partnerId, stats]) => {
        const partner = partnerMap.get(partnerId);
        return {
          partner_id: partnerId,
          partner_name: partner?.full_name || 'Unknown',
          partner_email: partner?.email || '',
          partner_tier: partner?.partner_tier || 'starter',
          total_commissions_cents: stats.commissions,
          total_sales_cents: stats.sales,
          order_count: stats.orders.size,
          recruited_count: recruitsMap.get(partnerId) || 0,
          recruited_earnings_cents: stats.recruiterEarnings
        };
      });

      // Sort by commissions (top 10)
      const byCommissions = [...allStats]
        .sort((a, b) => b.total_commissions_cents - a.total_commissions_cents)
        .slice(0, 10);

      // Sort by sales volume (top 10)
      const bySales = [...allStats]
        .sort((a, b) => b.total_sales_cents - a.total_sales_cents)
        .slice(0, 10);

      setTopByCommissions(byCommissions);
      setTopBySales(bySales);

    } catch (error) {
      console.error('Error fetching top partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cents / 100);
  };

  const getTierBadgeColor = (tier: string) => {
    const colors: Record<string, string> = {
      starter: 'bg-gray-100 text-gray-800',
      growth: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-orange-100 text-orange-800'
    };
    return colors[tier] || colors.starter;
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Award className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />;
    return <Star className="w-6 h-6 text-gray-300" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const displayList = viewMode === 'commissions' ? topByCommissions : topBySales;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Top Partners Leaderboard</h1>
          <p className="mt-2 text-gray-600">Recognize your highest performing partners</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Date Range */}
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            {['7d', '30d', '90d', '1y', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range === '7d' && '7 days'}
                {range === '30d' && '30 days'}
                {range === '90d' && '90 days'}
                {range === '1y' && '1 year'}
                {range === 'all' && 'All time'}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setViewMode('commissions')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'commissions'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              By Commissions
            </button>
            <button
              onClick={() => setViewMode('sales')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'sales'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              By Sales Volume
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Top 10 {viewMode === 'commissions' ? 'Earners' : 'Sellers'}
              </h2>
              <div className="text-sm text-gray-600">
                {dateRange === 'all' ? 'All Time' : `Last ${dateRange}`}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {displayList.map((partner, index) => (
              <div
                key={partner.partner_id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-50/30 to-transparent' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Rank + Partner Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0 w-12 text-center">
                      {getMedalIcon(index + 1)}
                      <div className="text-xs font-bold text-gray-500 mt-1">
                        #{index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {partner.partner_name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierBadgeColor(partner.partner_tier)}`}>
                          {partner.partner_tier}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{partner.partner_email}</p>
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(
                          viewMode === 'commissions'
                            ? partner.total_commissions_cents
                            : partner.total_sales_cents
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {viewMode === 'commissions' ? 'Total Earned' : 'Total Sales'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-700">
                        {partner.order_count}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Orders</p>
                    </div>

                    {partner.recruited_count > 0 && (
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">
                          {partner.recruited_count}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Recruits</p>
                      </div>
                    )}

                    {partner.recruited_earnings_cents > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          +{formatCurrency(partner.recruited_earnings_cents)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Override</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Top 10 Commissions</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(
                    topByCommissions.reduce((sum, p) => sum + p.total_commissions_cents, 0)
                  )}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Top 10 Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(
                    topBySales.reduce((sum, p) => sum + p.total_sales_cents, 0)
                  )}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Orders per Partner</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {Math.round(
                    displayList.reduce((sum, p) => sum + p.order_count, 0) / displayList.length
                  )}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
