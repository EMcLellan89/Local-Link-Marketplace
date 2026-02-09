import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  DollarSign, TrendingUp, Users, Package,
  Download, Calendar, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function DealsRevenueReport() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    platformRevenue: 0,
    partnerCommissions: 0,
    vendorCommissions: 0,
    totalTransactions: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    topVendors: [],
    topPartners: [],
    revenueByCategory: []
  });

  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadRevenue();
  }, [dateRange]);

  async function loadRevenue() {
    try {
      const daysAgo = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Load completed transactions
      const { data: txData, error: txError } = await supabase
        .from('deal_transactions')
        .select(`
          *,
          deal:business_deals(title, slug),
          bundle:deal_bundles(name, slug),
          vendor:vendors(name),
          partner:partners(business_name)
        `)
        .eq('status', 'completed')
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: false });

      if (txError) throw txError;

      const transactions = txData || [];
      setTransactions(transactions);

      // Calculate stats
      const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.amount_cents || 0), 0);
      const platformRevenue = transactions.reduce((sum, tx) => sum + (tx.platform_revenue_cents || 0), 0);
      const partnerCommissions = transactions.reduce((sum, tx) => sum + (tx.partner_commission_cents || 0), 0);
      const vendorCommissions = transactions.reduce((sum, tx) => sum + (tx.vendor_commission_cents || 0), 0);

      // Calculate average order value
      const averageOrderValue = transactions.length > 0 ? totalRevenue / transactions.length : 0;

      // Calculate revenue by vendor
      const vendorRevenue = new Map<string, { name: string; revenue: number; count: number }>();
      transactions.forEach(tx => {
        if (tx.vendor) {
          const current = vendorRevenue.get(tx.vendor.name) || { name: tx.vendor.name, revenue: 0, count: 0 };
          current.revenue += tx.vendor_commission_cents || 0;
          current.count += 1;
          vendorRevenue.set(tx.vendor.name, current);
        }
      });

      const topVendors = Array.from(vendorRevenue.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate revenue by partner
      const partnerRevenue = new Map<string, { name: string; revenue: number; count: number }>();
      transactions.forEach(tx => {
        if (tx.partner) {
          const current = partnerRevenue.get(tx.partner.business_name) || {
            name: tx.partner.business_name,
            revenue: 0,
            count: 0
          };
          current.revenue += tx.partner_commission_cents || 0;
          current.count += 1;
          partnerRevenue.set(tx.partner.business_name, current);
        }
      });

      const topPartners = Array.from(partnerRevenue.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calculate revenue by category
      const categoryRevenue = new Map<string, number>();
      for (const tx of transactions) {
        if (tx.deal_id) {
          const { data: deal } = await supabase
            .from('business_deals')
            .select('category')
            .eq('id', tx.deal_id)
            .single();

          if (deal) {
            const current = categoryRevenue.get(deal.category) || 0;
            categoryRevenue.set(deal.category, current + (tx.amount_cents || 0));
          }
        } else if (tx.bundle_id) {
          const { data: bundle } = await supabase
            .from('deal_bundles')
            .select('category')
            .eq('id', tx.bundle_id)
            .single();

          if (bundle) {
            const current = categoryRevenue.get(bundle.category) || 0;
            categoryRevenue.set(bundle.category, current + (tx.amount_cents || 0));
          }
        }
      }

      const revenueByCategory = Array.from(categoryRevenue.entries())
        .map(([category, revenue]) => ({ category, revenue }))
        .sort((a, b) => b.revenue - a.revenue);

      // Calculate growth (compare to previous period)
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - daysAgo);

      const { data: previousTxData } = await supabase
        .from('deal_transactions')
        .select('amount_cents')
        .eq('status', 'completed')
        .gte('completed_at', previousStartDate.toISOString())
        .lt('completed_at', startDate.toISOString());

      const previousRevenue = previousTxData?.reduce((sum, tx) => sum + (tx.amount_cents || 0), 0) || 0;
      const revenueGrowth = previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

      setStats({
        totalRevenue,
        platformRevenue,
        partnerCommissions,
        vendorCommissions,
        totalTransactions: transactions.length,
        averageOrderValue,
        revenueGrowth,
        topVendors,
        topPartners,
        revenueByCategory
      });

    } catch (error) {
      console.error('Error loading revenue:', error);
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    const headers = [
      'Date',
      'Type',
      'Item',
      'Amount',
      'Vendor Commission',
      'Partner Commission',
      'Platform Revenue',
      'Vendor',
      'Partner'
    ];

    const rows = transactions.map(tx => [
      new Date(tx.completed_at).toLocaleDateString(),
      tx.transaction_type,
      tx.deal?.title || tx.bundle?.name || 'N/A',
      `$${(tx.amount_cents / 100).toFixed(2)}`,
      `$${(tx.vendor_commission_cents / 100).toFixed(2)}`,
      `$${(tx.partner_commission_cents / 100).toFixed(2)}`,
      `$${(tx.platform_revenue_cents / 100).toFixed(2)}`,
      tx.vendor?.name || 'N/A',
      tx.partner?.business_name || 'N/A'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deals-revenue-${dateRange}days.csv`;
    a.click();
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals Hub Revenue</h1>
          <p className="text-gray-600 mt-2">Complete revenue breakdown and analytics</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
            <Calendar className="h-5 w-5 text-gray-600" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-none focus:ring-0 text-sm font-medium"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 365 days</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 100).toLocaleString()}`}
          change={stats.revenueGrowth}
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Platform Revenue"
          value={`$${(stats.platformRevenue / 100).toLocaleString()}`}
          subtitle={`${stats.totalRevenue > 0 ? ((stats.platformRevenue / stats.totalRevenue) * 100).toFixed(1) : 0}% of total`}
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Partner Commissions"
          value={`$${(stats.partnerCommissions / 100).toLocaleString()}`}
          subtitle={`${stats.totalRevenue > 0 ? ((stats.partnerCommissions / stats.totalRevenue) * 100).toFixed(1) : 0}% of total`}
          icon={<Users className="h-6 w-6 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Vendor Commissions"
          value={`$${(stats.vendorCommissions / 100).toLocaleString()}`}
          subtitle={`${stats.totalRevenue > 0 ? ((stats.vendorCommissions / stats.totalRevenue) * 100).toFixed(1) : 0}% of total`}
          icon={<Package className="h-6 w-6 text-orange-600" />}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Order Value</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(stats.averageOrderValue / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
          <div className="space-y-3">
            {stats.revenueByCategory.slice(0, 5).map((cat: any) => (
              <div key={cat.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {cat.category.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ${(cat.revenue / 100).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Vendors */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Vendors by Commission</h2>
          <div className="space-y-4">
            {stats.topVendors.map((vendor: any, idx: number) => (
              <div key={vendor.name} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{vendor.name}</p>
                    <p className="text-xs text-gray-600">{vendor.count} transactions</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  ${(vendor.revenue / 100).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Partners */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Partners by Commission</h2>
          <div className="space-y-4">
            {stats.topPartners.map((partner: any, idx: number) => (
              <div key={partner.name} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{partner.name}</p>
                    <p className="text-xs text-gray-600">{partner.count} referrals</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  ${(partner.revenue / 100).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 20).map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(tx.completed_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {tx.deal?.title || tx.bundle?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${(tx.amount_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    ${(tx.platform_revenue_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                    ${(tx.partner_commission_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                    ${(tx.vendor_commission_cents / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, change, icon, color }: any) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-600">{subtitle}</p>
      )}
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm mt-2 ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          <span className="font-semibold">{Math.abs(change).toFixed(1)}%</span>
          <span className="text-gray-600">vs previous period</span>
        </div>
      )}
    </div>
  );
}
