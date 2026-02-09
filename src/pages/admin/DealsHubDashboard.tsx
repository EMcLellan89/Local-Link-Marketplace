import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  TrendingUp, DollarSign, Package, Users,
  ShoppingBag, Eye, MousePointerClick, Star
} from 'lucide-react';

export default function DealsHubDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeDeals: 0,
    totalBundles: 0,
    totalVendors: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    totalViews: 0,
    totalClicks: 0,
    averageConversion: 0
  });

  const [recentDeals, setRecentDeals] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      // Load stats
      const [dealsRes, bundlesRes, vendorsRes, transactionsRes] = await Promise.all([
        supabase.from('business_deals').select('id, status, view_count, click_count, purchase_count'),
        supabase.from('deal_bundles').select('id, status'),
        supabase.from('vendors').select('id, active'),
        supabase.from('deal_transactions').select('amount_cents, status')
      ]);

      const deals = dealsRes.data || [];
      const activeDeals = deals.filter(d => d.status === 'active');
      const totalViews = deals.reduce((sum, d) => sum + (d.view_count || 0), 0);
      const totalClicks = deals.reduce((sum, d) => sum + (d.click_count || 0), 0);
      const totalPurchases = deals.reduce((sum, d) => sum + (d.purchase_count || 0), 0);

      const transactions = transactionsRes.data || [];
      const completedTransactions = transactions.filter(t => t.status === 'completed');
      const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.amount_cents || 0), 0);

      setStats({
        totalDeals: deals.length,
        activeDeals: activeDeals.length,
        totalBundles: bundlesRes.data?.length || 0,
        totalVendors: vendorsRes.data?.filter(v => v.active).length || 0,
        totalRevenue,
        totalTransactions: completedTransactions.length,
        totalViews,
        totalClicks,
        averageConversion: totalClicks > 0 ? (totalPurchases / totalClicks * 100) : 0
      });

      // Load recent deals
      const { data: recent } = await supabase
        .from('business_deals')
        .select('*, vendor:vendors(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentDeals(recent || []);

      // Load top performers
      const { data: top } = await supabase
        .from('business_deals')
        .select('*, vendor:vendors(name)')
        .order('purchase_count', { ascending: false })
        .limit(5);
      setTopPerformers(top || []);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Deals Hub</h1>
        <p className="text-gray-600 mt-2">Manage vendors, deals, bundles, and revenue</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Deals"
          value={stats.activeDeals}
          subtitle={`of ${stats.totalDeals} total`}
          icon={<ShoppingBag className="h-6 w-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 100).toFixed(0)}`}
          subtitle={`${stats.totalTransactions} transactions`}
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Bundles"
          value={stats.totalBundles}
          subtitle="active packages"
          icon={<Package className="h-6 w-6 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Vendors"
          value={stats.totalVendors}
          subtitle="active partners"
          icon={<Users className="h-6 w-6 text-orange-600" />}
          color="orange"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={<Eye className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          icon={<MousePointerClick className="h-5 w-5" />}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${stats.averageConversion.toFixed(2)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link
          to="/admin/deals-hub/vendors"
          className="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Manage Vendors</h3>
          <p className="text-sm text-gray-600">Add and edit vendor partnerships</p>
        </Link>
        <Link
          to="/admin/deals-hub/deals"
          className="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-green-500 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Manage Deals</h3>
          <p className="text-sm text-gray-600">Create and edit deals</p>
        </Link>
        <Link
          to="/admin/deals-hub/bundles"
          className="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Manage Bundles</h3>
          <p className="text-sm text-gray-600">Create high-ticket packages</p>
        </Link>
        <Link
          to="/admin/deals-hub/campaigns"
          className="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Seasonal Campaigns</h3>
          <p className="text-sm text-gray-600">Manage marketing campaigns</p>
        </Link>
      </div>

      {/* Recent Deals & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Deals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Deals</h2>
          <div className="space-y-4">
            {recentDeals.map((deal) => (
              <div key={deal.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{deal.title}</h3>
                  <p className="text-sm text-gray-600">{deal.vendor?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ${(deal.deal_price_cents / 100).toFixed(0)}
                    {deal.discount_percent > 0 && (
                      <span className="ml-2 text-green-600">({deal.discount_percent}% off)</span>
                    )}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  deal.status === 'active' ? 'bg-green-100 text-green-800' :
                  deal.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {deal.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Deals</h2>
          <div className="space-y-4">
            {topPerformers.map((deal, idx) => (
              <div key={deal.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{deal.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      <span>{deal.purchase_count} sales</span>
                      <span>{deal.click_count} clicks</span>
                      <span className="text-green-600">
                        {deal.click_count > 0 ? ((deal.purchase_count / deal.click_count) * 100).toFixed(1) : 0}% conv
                      </span>
                    </div>
                  </div>
                </div>
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
}

function MetricCard({ title, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gray-100 rounded-lg">
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
