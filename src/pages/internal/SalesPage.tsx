import { useEffect, useState } from 'react';
import { InternalCRMLayout } from '../../components/layout/InternalCRMLayout';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';

interface Sale {
  id: string;
  product_name: string;
  amount: number;
  tax_amount: number;
  net_amount: number;
  payment_status: string;
  payment_method: string;
  sale_date: string;
  customer: {
    full_name: string | null;
    email: string;
  } | null;
  business_unit: {
    name: string;
  } | null;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [selectedBusiness, setSelectedBusiness] = useState('all');
  const [businesses, setBusinesses] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgSaleValue: 0,
  });

  useEffect(() => {
    loadBusinesses();
  }, []);

  useEffect(() => {
    loadSales();
  }, [dateRange, selectedBusiness]);

  async function loadBusinesses() {
    const { data } = await supabase
      .from('business_units')
      .select('id, name')
      .eq('is_active', true)
      .order('name');

    setBusinesses(data || []);
  }

  async function loadSales() {
    try {
      const daysAgo = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      let query = supabase
        .from('unified_sales')
        .select(`
          *,
          customer:unified_customers(full_name, email),
          business_unit:business_units(name)
        `)
        .gte('sale_date', startDate.toISOString().split('T')[0])
        .order('sale_date', { ascending: false });

      if (selectedBusiness !== 'all') {
        query = query.eq('business_unit_id', selectedBusiness);
      }

      const { data, error } = await query;

      if (error) throw error;

      const salesData = data as any || [];
      setSales(salesData);

      const totalRevenue = salesData.reduce((sum: number, sale: any) => sum + Number(sale.net_amount), 0);
      const totalSales = salesData.length;
      const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;

      setStats({
        totalRevenue,
        totalSales,
        avgSaleValue,
      });
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
      partially_refunded: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <InternalCRMLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sales data...</p>
          </div>
        </div>
      </InternalCRMLayout>
    );
  }

  return (
    <InternalCRMLayout>
      <div className="space-y-6 mb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Dashboard</h1>
            <p className="text-gray-600">Track all sales across your business units</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Last {dateRange} days</p>
              </div>
              <div className="bg-green-500 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSales.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Transactions</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Sale Value</p>
                <p className="text-3xl font-bold text-gray-900">${stats.avgSaleValue.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">Per transaction</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Business:</span>
              <select
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Businesses</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Sales Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Business</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Net</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <p className="text-gray-500">No sales found for the selected period</p>
                    </td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900">
                          {new Date(sale.sale_date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {sale.customer?.full_name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">{sale.customer?.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900">{sale.product_name}</p>
                        {sale.payment_method && (
                          <p className="text-xs text-gray-500 capitalize">{sale.payment_method}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sale.business_unit?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sale.payment_status)}`}>
                          {sale.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${Number(sale.amount).toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ${Number(sale.net_amount).toLocaleString()}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </InternalCRMLayout>
  );
}
