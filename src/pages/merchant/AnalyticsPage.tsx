import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, ShoppingBag, BarChart3, Eye, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

interface DealPerformance {
  deal_id: string;
  deal_title: string;
  views: number;
  favorites: number;
  purchases: number;
  revenue_cents: number;
  conversion_rate: number;
}

interface AnalyticsData {
  totalRevenue: number;
  totalPurchases: number;
  totalCustomers: number;
  averageOrderValue: number;
  topDeals: DealPerformance[];
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    amount: number;
    created_at: string;
  }>;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalPurchases: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    topDeals: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (!merchantData) {
        setLoading(false);
        return;
      }

      setMerchantId(merchantData.id);

      let dateFilter = new Date();
      if (timeRange === '7d') {
        dateFilter.setDate(dateFilter.getDate() - 7);
      } else if (timeRange === '30d') {
        dateFilter.setDate(dateFilter.getDate() - 30);
      } else if (timeRange === '90d') {
        dateFilter.setDate(dateFilter.getDate() - 90);
      }

      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('id')
        .eq('merchant_id', merchantData.id);

      if (dealsError) throw dealsError;

      if (!deals) {
        setLoading(false);
        return;
      }

      const dealIds = deals.map(d => d.id);

      if (dealIds.length === 0) {
        setAnalytics({
          totalRevenue: 0,
          totalPurchases: 0,
          totalCustomers: 0,
          averageOrderValue: 0,
          topDeals: [],
          recentActivity: [],
        });
        setLoading(false);
        return;
      }

      let purchasesQuery = supabase
        .from('purchases')
        .select('*, deal:deals!inner(title)')
        .in('deal_id', dealIds)
        .eq('status', 'paid');

      if (timeRange !== 'all') {
        purchasesQuery = purchasesQuery.gte('created_at', dateFilter.toISOString());
      }

      const { data: purchases, error: purchasesError } = await purchasesQuery;

      if (purchasesError) throw purchasesError;

      const uniqueCustomers = new Set(purchases?.map(p => p.customer_id) || []).size;
      const totalRevenue = purchases?.reduce((sum, p) => sum + (p.merchant_payout_cents || 0), 0) || 0;
      const totalPurchases = purchases?.length || 0;
      const averageOrderValue = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;

      const { data: analyticsData, error: analyticsError } = await supabase
        .from('deal_analytics')
        .select('*, deal:deals!inner(title)')
        .in('deal_id', dealIds)
        .order('revenue_cents', { ascending: false })
        .limit(10);

      if (analyticsError) throw analyticsError;

      const dealPerformance: Record<string, DealPerformance> = {};

      analyticsData?.forEach((record: any) => {
        if (!dealPerformance[record.deal_id]) {
          dealPerformance[record.deal_id] = {
            deal_id: record.deal_id,
            deal_title: record.deal?.title || 'Unknown Deal',
            views: 0,
            favorites: 0,
            purchases: 0,
            revenue_cents: 0,
            conversion_rate: 0,
          };
        }

        dealPerformance[record.deal_id].views += record.views || 0;
        dealPerformance[record.deal_id].favorites += record.favorites || 0;
        dealPerformance[record.deal_id].purchases += record.purchases || 0;
        dealPerformance[record.deal_id].revenue_cents += record.revenue_cents || 0;
      });

      const topDeals = Object.values(dealPerformance)
        .map(deal => ({
          ...deal,
          conversion_rate: deal.views > 0 ? (deal.purchases / deal.views) * 100 : 0,
        }))
        .sort((a, b) => b.revenue_cents - a.revenue_cents)
        .slice(0, 5);

      setAnalytics({
        totalRevenue,
        totalPurchases,
        totalCustomers: uniqueCustomers,
        averageOrderValue,
        topDeals,
        recentActivity: [],
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading analytics...</p>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <p className="text-red-800 font-medium">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
              <Button variant="outline" onClick={fetchAnalytics} className="mt-3">
                Try Again
              </Button>
            </CardBody>
          </Card>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Track your performance and customer insights</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-[#2BB673] text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">Total Revenue</p>
                <DollarSign className="w-5 h-5 text-[#2BB673]" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(analytics.totalRevenue)}
              </p>
              <p className="text-sm text-slate-500 mt-1">Your earnings (70%)</p>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">Total Orders</p>
                <ShoppingBag className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {analytics.totalPurchases}
              </p>
              <p className="text-sm text-slate-500 mt-1">Completed purchases</p>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">Unique Customers</p>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {analytics.totalCustomers}
              </p>
              <p className="text-sm text-slate-500 mt-1">Active buyers</p>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">Avg Order Value</p>
                <TrendingUp className="w-5 h-5 text-[#F5B82E]" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(analytics.averageOrderValue)}
              </p>
              <p className="text-sm text-slate-500 mt-1">Per transaction</p>
            </CardBody>
          </Card>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#2BB673]" />
              <h2 className="text-xl font-bold text-slate-900">Top Performing Deals</h2>
            </div>
          </CardHeader>
          <CardBody>
            {analytics.topDeals.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No deal performance data available yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.topDeals.map((deal, index) => (
                  <div
                    key={deal.deal_id}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 bg-[#2BB673]/10 text-[#2BB673] font-bold rounded-full">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-slate-900">{deal.deal_title}</h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#2BB673]">
                          {formatCurrency(deal.revenue_cents)}
                        </p>
                        <p className="text-sm text-slate-500">Revenue</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="w-4 h-4 text-slate-400" />
                          <p className="text-xs text-slate-500">Views</p>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatNumber(deal.views)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-4 h-4 text-slate-400" />
                          <p className="text-xs text-slate-500">Favorites</p>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatNumber(deal.favorites)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <ShoppingBag className="w-4 h-4 text-slate-400" />
                          <p className="text-xs text-slate-500">Purchases</p>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatNumber(deal.purchases)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-slate-400" />
                          <p className="text-xs text-slate-500">Conversion</p>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          {deal.conversion_rate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Customer Insights</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">New Customers</p>
                    <p className="text-2xl font-bold text-slate-900">{analytics.totalCustomers}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#2BB673]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Repeat Purchase Rate</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {analytics.totalCustomers > 0
                        ? ((analytics.totalPurchases / analytics.totalCustomers - 1) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Performance Summary</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Deal Value</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(Math.round(analytics.totalRevenue / 0.7))}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-[#2BB673]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Platform Fee (30%)</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(Math.round(analytics.totalRevenue / 0.7) - analytics.totalRevenue)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
