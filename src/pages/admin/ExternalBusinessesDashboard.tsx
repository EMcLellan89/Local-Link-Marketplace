import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, DollarSign, TrendingUp, Package } from 'lucide-react';

interface BusinessMetrics {
  business_unit: string;
  business_name: string;
  total_sales_cents: number;
  total_commissions_cents: number;
  order_count: number;
  active_partners: number;
  avg_order_value: number;
}

interface BusinessDetail {
  product_key: string;
  revenue_cents: number;
  order_count: number;
}

export default function ExternalBusinessesDashboard() {
  const [businesses, setBusinesses] = useState<BusinessMetrics[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchBusinessMetrics();
  }, [dateRange]);

  useEffect(() => {
    if (selectedBusiness) {
      fetchBusinessDetails(selectedBusiness);
    }
  }, [selectedBusiness, dateRange]);

  const fetchBusinessMetrics = async () => {
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

      // Fetch all external business sales
      const { data: registry, error: registryError } = await supabase
        .from('business_registry')
        .select('business_unit, business_name')
        .eq('is_local_link_marketplace', false);

      if (registryError) throw registryError;

      const businessUnits = registry?.map(b => b.business_unit) || [];

      // Fetch sales for external businesses
      const { data: sales, error: salesError } = await supabase
        .from('sales_ledger')
        .select(`
          id,
          business_unit,
          product_key,
          amount_cents,
          partner_id,
          created_at
        `)
        .in('business_unit', businessUnits)
        .gte('created_at', cutoffDate.toISOString());

      if (salesError) throw salesError;

      // Fetch commissions for these sales
      const { data: earnings, error: earningsError } = await supabase
        .from('partner_earnings')
        .select('amount_cents, sales_ledger_id')
        .in('sales_ledger_id', sales?.map(s => s.id) || []);

      if (earningsError) throw earningsError;

      // Create earnings lookup
      const earningsBySale = new Map<string, number>();
      earnings?.forEach(e => {
        const current = earningsBySale.get(e.sales_ledger_id) || 0;
        earningsBySale.set(e.sales_ledger_id, current + e.amount_cents);
      });

      // Group by business unit
      const businessMap = new Map<string, {
        name: string;
        sales: number;
        commissions: number;
        orders: number;
        partners: Set<string>;
      }>();

      registry?.forEach(b => {
        businessMap.set(b.business_unit, {
          name: b.business_name,
          sales: 0,
          commissions: 0,
          orders: 0,
          partners: new Set()
        });
      });

      sales?.forEach(s => {
        const biz = businessMap.get(s.business_unit);
        if (biz) {
          biz.sales += s.amount_cents;
          biz.commissions += earningsBySale.get(s.id) || 0;
          biz.orders += 1;
          if (s.partner_id) biz.partners.add(s.partner_id);
        }
      });

      const metricsArray = Array.from(businessMap.entries()).map(([unit, data]) => ({
        business_unit: unit,
        business_name: data.name,
        total_sales_cents: data.sales,
        total_commissions_cents: data.commissions,
        order_count: data.orders,
        active_partners: data.partners.size,
        avg_order_value: data.orders > 0 ? data.sales / data.orders : 0
      })).sort((a, b) => b.total_sales_cents - a.total_sales_cents);

      setBusinesses(metricsArray);

    } catch (error) {
      console.error('Error fetching business metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessDetails = async (businessUnit: string) => {
    try {
      const rangeMap: Record<string, number> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };

      const daysAgo = rangeMap[dateRange] || 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      const { data: sales, error } = await supabase
        .from('sales_ledger')
        .select('product_key, amount_cents')
        .eq('business_unit', businessUnit)
        .gte('created_at', cutoffDate.toISOString());

      if (error) throw error;

      // Group by product
      const productMap = new Map<string, { revenue: number; count: number }>();
      sales?.forEach(s => {
        const current = productMap.get(s.product_key) || { revenue: 0, count: 0 };
        productMap.set(s.product_key, {
          revenue: current.revenue + s.amount_cents,
          count: current.count + 1
        });
      });

      const details = Array.from(productMap.entries())
        .map(([key, data]) => ({
          product_key: key,
          revenue_cents: data.revenue,
          order_count: data.count
        }))
        .sort((a, b) => b.revenue_cents - a.revenue_cents);

      setBusinessDetails(details);

    } catch (error) {
      console.error('Error fetching business details:', error);
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

  const totals = businesses.reduce((acc, b) => ({
    sales: acc.sales + b.total_sales_cents,
    commissions: acc.commissions + b.total_commissions_cents,
    orders: acc.orders + b.order_count
  }), { sales: 0, commissions: 0, orders: 0 });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">External Businesses</h1>
          <p className="mt-2 text-gray-600">Performance across all partner businesses</p>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(totals.sales)}
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
                <p className="text-sm font-medium text-gray-600">Commissions</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(totals.commissions)}
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
                <p className="text-sm font-medium text-gray-600">Active Businesses</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {businesses.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Business List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Business Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commissions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partners
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {businesses.map((business) => (
                  <tr key={business.business_unit} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {business.business_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {business.business_unit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {formatCurrency(business.total_sales_cents)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(business.total_commissions_cents)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {business.order_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {business.active_partners}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(business.avg_order_value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => setSelectedBusiness(
                          selectedBusiness === business.business_unit ? null : business.business_unit
                        )}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {selectedBusiness === business.business_unit ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Business Details Panel */}
        {selectedBusiness && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Details - {businesses.find(b => b.business_unit === selectedBusiness)?.business_name}
            </h3>
            <div className="space-y-3">
              {businessDetails.map((detail, index) => (
                <div key={detail.product_key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{detail.product_key}</p>
                      <p className="text-xs text-gray-500">{detail.order_count} orders</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(detail.revenue_cents)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
