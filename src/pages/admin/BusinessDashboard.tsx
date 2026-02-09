import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface BusinessMetrics {
  business_name: string;
  business_id: string;
  gross_revenue_cents: number;
  net_revenue_cents: number;
  refunds_cents: number;
  commissions_paid_cents: number;
  commissions_pending_cents: number;
  total_orders: number;
  profit_cents: number;
}

interface DateRange {
  start: string;
  end: string;
}

export default function BusinessDashboard() {
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<BusinessMetrics[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  async function loadData() {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_multi_business_accounting', {
        p_start_date: dateRange.start,
        p_end_date: dateRange.end
      });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (err) {
      console.error('Error loading business data:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(cents: number): string {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function exportToCSV() {
    const headers = ['Business', 'Gross Revenue', 'Net Revenue', 'Refunds', 'Commissions Paid', 'Commissions Pending', 'Orders', 'Profit'];
    const rows = businesses.map(b => [
      b.business_name,
      formatCurrency(b.gross_revenue_cents),
      formatCurrency(b.net_revenue_cents),
      formatCurrency(b.refunds_cents),
      formatCurrency(b.commissions_paid_cents),
      formatCurrency(b.commissions_pending_cents),
      b.total_orders,
      formatCurrency(b.profit_cents)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-accounting-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
  }

  const totals = businesses.reduce((acc, b) => ({
    gross_revenue: acc.gross_revenue + b.gross_revenue_cents,
    net_revenue: acc.net_revenue + b.net_revenue_cents,
    refunds: acc.refunds + b.refunds_cents,
    commissions_paid: acc.commissions_paid + b.commissions_paid_cents,
    commissions_pending: acc.commissions_pending + b.commissions_pending_cents,
    orders: acc.orders + b.total_orders,
    profit: acc.profit + b.profit_cents
  }), {
    gross_revenue: 0,
    net_revenue: 0,
    refunds: 0,
    commissions_paid: 0,
    commissions_pending: 0,
    orders: 0,
    profit: 0
  });

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Local-Link Business Dashboard</h1>
              <p className="text-blue-100">Multi-business accounting and commission tracking</p>
            </div>
            <Building2 className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-600">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="secondary" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <Button variant="primary" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Gross Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(totals.gross_revenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All businesses</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Net Revenue</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(totals.net_revenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">After refunds</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Commissions Paid</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatCurrency(totals.commissions_paid)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">To partners</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Net Profit</p>
                  <p className="text-3xl font-bold text-green-700">
                    {formatCurrency(totals.profit)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">After commissions</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-700" />
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Business Breakdown</h2>
              <Link to="/admin/commission-payouts">
                <Button variant="secondary" size="sm">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Manage Commissions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {businesses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No business data found</p>
                <p className="text-sm mt-1">Select a different date range or check back later</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gross Revenue
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Revenue
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Refunds
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comm. Paid
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comm. Pending
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {businesses.map((business) => (
                      <tr key={business.business_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                            <div className="text-sm font-medium text-gray-900">{business.business_name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-semibold">
                          {formatCurrency(business.gross_revenue_cents)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 font-semibold">
                          {formatCurrency(business.net_revenue_cents)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                          {formatCurrency(business.refunds_cents)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-purple-600 font-semibold">
                          {formatCurrency(business.commissions_paid_cents)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-orange-600">
                          {formatCurrency(business.commissions_pending_cents)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {business.total_orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-700 font-bold">
                          {formatCurrency(business.profit_cents)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(totals.gross_revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600">
                        {formatCurrency(totals.net_revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                        {formatCurrency(totals.refunds)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-purple-600">
                        {formatCurrency(totals.commissions_paid)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-orange-600">
                        {formatCurrency(totals.commissions_pending)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {totals.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-700">
                        {formatCurrency(totals.profit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
