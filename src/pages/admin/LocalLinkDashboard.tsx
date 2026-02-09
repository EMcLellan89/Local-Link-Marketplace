import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

interface DashboardMetrics {
  total_sales_cents: number;
  total_commissions_cents: number;
  total_orders: number;
  active_partners: number;
  top_products: Array<{
    product_key: string;
    revenue_cents: number;
    order_count: number;
  }>;
  recent_sales: Array<{
    id: string;
    created_at: string;
    product_key: string;
    amount_cents: number;
    partner_name: string;
  }>;
}

export default function LocalLinkDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);

      const rangeMap: Record<string, number> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };

      const daysAgo = rangeMap[dateRange] || 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      // Fetch sales ledger for Local-Link Marketplace
      const { data: sales, error: salesError } = await supabase
        .from('sales_ledger')
        .select(`
          id,
          created_at,
          product_key,
          amount_cents,
          partners!inner(full_name)
        `)
        .eq('business_unit', 'local_link')
        .gte('created_at', cutoffDate.toISOString())
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      // Fetch partner earnings for commissions
      const { data: earnings, error: earningsError } = await supabase
        .from('partner_earnings')
        .select('amount_cents, partner_id')
        .in('sales_ledger_id', sales?.map(s => s.id) || []);

      if (earningsError) throw earningsError;

      // Calculate metrics
      const totalSales = sales?.reduce((sum, s) => sum + s.amount_cents, 0) || 0;
      const totalCommissions = earnings?.reduce((sum, e) => sum + e.amount_cents, 0) || 0;
      const activePartnerIds = new Set(sales?.map(s => s.partner_id).filter(Boolean));

      // Top products
      const productMap = new Map<string, { revenue: number; count: number }>();
      sales?.forEach(s => {
        const current = productMap.get(s.product_key) || { revenue: 0, count: 0 };
        productMap.set(s.product_key, {
          revenue: current.revenue + s.amount_cents,
          count: current.count + 1
        });
      });

      const topProducts = Array.from(productMap.entries())
        .map(([key, data]) => ({
          product_key: key,
          revenue_cents: data.revenue,
          order_count: data.count
        }))
        .sort((a, b) => b.revenue_cents - a.revenue_cents)
        .slice(0, 10);

      // Recent sales with partner names
      const recentSales = sales?.slice(0, 20).map(s => ({
        id: s.id,
        created_at: s.created_at,
        product_key: s.product_key,
        amount_cents: s.amount_cents,
        partner_name: s.partners?.full_name || 'Direct'
      })) || [];

      setMetrics({
        total_sales_cents: totalSales,
        total_commissions_cents: totalCommissions,
        total_orders: sales?.length || 0,
        active_partners: activePartnerIds.size,
        top_products: topProducts,
        recent_sales: recentSales
      });

    } catch (error) {
      console.error('Error fetching Local-Link metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Local-Link Marketplace</h1>
          <p className="mt-2 text-gray-600">Performance metrics and analytics</p>
        </div>

        {/* Date Range Filter */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            {['7d', '30d', '90d', '1y'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range === '7d' && 'Last 7 days'}
                {range === '30d' && 'Last 30 days'}
                {range === '90d' && 'Last 90 days'}
                {range === '1y' && 'Last year'}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(metrics?.total_sales_cents || 0)}
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
                <p className="text-sm font-medium text-gray-600">Commissions Paid</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(metrics?.total_commissions_cents || 0)}
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
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {metrics?.total_orders || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Partners</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {metrics?.active_partners || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {metrics?.top_products.map((product, index) => (
                  <div key={product.product_key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.product_key}</p>
                        <p className="text-xs text-gray-500">{product.order_count} orders</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.revenue_cents)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sales</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {metrics?.recent_sales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sale.product_key}</p>
                      <p className="text-xs text-gray-500">
                        {sale.partner_name} • {new Date(sale.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(sale.amount_cents)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
