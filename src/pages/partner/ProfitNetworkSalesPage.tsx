import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Download,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Sale {
  id: string;
  sale_date: string;
  business: {
    name: string;
  };
  product_name: string;
  sale_amount_cents: number;
  commission_amount_cents: number;
  total_deductions_cents: number;
  net_commission_cents: number;
  status: string;
}

interface WeeklySummary {
  week_start: string;
  week_end: string;
  total_sales: number;
  gross_commission_cents: number;
  total_deductions_cents: number;
  net_commission_cents: number;
}

interface MonthlySummary {
  month: number;
  year: number;
  total_sales: number;
  gross_commission_cents: number;
  startup_payback_cents: number;
  ad_costs_cents: number;
  subscription_cents: number;
  total_deductions_cents: number;
  net_commission_cents: number;
}

export default function ProfitNetworkSalesPage() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>([]);
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'sales' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (!partner) return;

      const [salesResult, weeklyResult, monthlyResult] = await Promise.all([
        supabase
          .from('profit_network_sales')
          .select(`
            *,
            business:profit_network_businesses(name)
          `)
          .eq('partner_id', partner.id)
          .order('sale_date', { ascending: false })
          .limit(100),
        supabase.rpc('get_partner_profit_network_weekly_summary', {
          p_partner_id: partner.id
        }),
        supabase
          .from('profit_network_statements')
          .select('*')
          .eq('partner_id', partner.id)
          .order('year', { ascending: false })
          .order('month', { ascending: false })
      ]);

      if (salesResult.data) setSales(salesResult.data as any);
      if (weeklyResult.data) setWeeklySummaries(weeklyResult.data);
      if (monthlyResult.data) setMonthlySummaries(monthlyResult.data);
    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(cents: number) {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function getMonthName(month: number) {
    return new Date(2000, month - 1).toLocaleDateString('en-US', { month: 'long' });
  }

  if (loading) {
    return (
      <PartnerHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PartnerHubLayout>
    );
  }

  return (
    <PartnerHubLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profit Network Sales & Statements</h1>
            <p className="text-gray-600 mt-1">Track your commission earnings and deductions</p>
          </div>
          <Button variant="secondary" onClick={loadData}>
            <Download className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === 'weekly' ? 'primary' : 'secondary'}
            onClick={() => setView('weekly')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Weekly
          </Button>
          <Button
            variant={view === 'monthly' ? 'primary' : 'secondary'}
            onClick={() => setView('monthly')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Monthly Statements
          </Button>
          <Button
            variant={view === 'sales' ? 'primary' : 'secondary'}
            onClick={() => setView('sales')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            All Sales
          </Button>
        </div>

        {view === 'weekly' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Weekly Commission Summary</h2>
            {weeklySummaries.length === 0 ? (
              <Card>
                <CardBody>
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No sales data yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start sharing your tracking links to see commission data</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              weeklySummaries.map((week, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {formatDate(week.week_start)} - {formatDate(week.week_end)}
                        </h3>
                        <p className="text-sm text-gray-600">{week.total_sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Net Commission</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(week.net_commission_cents)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 mb-1">Gross Commission</p>
                        <p className="text-lg font-bold text-green-900">
                          {formatCurrency(week.gross_commission_cents)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-orange-600 mb-1">Deductions</p>
                        <p className="text-lg font-bold text-orange-900">
                          -{formatCurrency(week.total_deductions_cents)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">You Receive</p>
                        <p className="text-lg font-bold text-blue-900">
                          {formatCurrency(week.net_commission_cents)}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}

        {view === 'monthly' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Monthly Statements</h2>
            {monthlySummaries.length === 0 ? (
              <Card>
                <CardBody>
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No monthly statements yet</p>
                    <p className="text-sm text-gray-500 mt-1">Statements are generated at the end of each month</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              monthlySummaries.map((statement, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {getMonthName(statement.month)} {statement.year}
                        </h3>
                        <p className="text-sm text-gray-600">{statement.total_sales} sales this month</p>
                      </div>
                      <Button variant="secondary" className="text-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-gray-700">Gross Commission Earned:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {formatCurrency(statement.gross_commission_cents)}
                        </span>
                      </div>

                      {statement.startup_payback_cents > 0 && (
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <span className="text-sm text-gray-700">8-Week Startup Payback:</span>
                          <span className="font-semibold text-yellow-700">
                            -{formatCurrency(statement.startup_payback_cents)}
                          </span>
                        </div>
                      )}

                      {statement.ad_costs_cents > 0 && (
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                          <span className="text-sm text-gray-700">Ad Costs:</span>
                          <span className="font-semibold text-orange-700">
                            -{formatCurrency(statement.ad_costs_cents)}
                          </span>
                        </div>
                      )}

                      {statement.subscription_cents > 0 && (
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm text-gray-700">Partner Subscription:</span>
                          <span className="font-semibold text-blue-700">
                            -{formatCurrency(statement.subscription_cents)}
                          </span>
                        </div>
                      )}

                      <div className="border-t-2 border-gray-200 pt-3">
                        <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                          <span className="font-medium text-gray-700">Total Deductions:</span>
                          <span className="font-bold text-gray-900">
                            -{formatCurrency(statement.total_deductions_cents)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200">
                        <span className="font-bold text-gray-900 text-lg">Net Commission (You Receive):</span>
                        <span className="font-bold text-green-600 text-2xl">
                          {formatCurrency(statement.net_commission_cents)}
                        </span>
                      </div>

                      {statement.payback_remaining_cents > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-900">Startup Payback Progress</span>
                          </div>
                          <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-yellow-600 h-2 rounded-full"
                              style={{ width: `${statement.payback_progress_percent}%` }}
                            />
                          </div>
                          <p className="text-xs text-yellow-700">
                            {formatCurrency(statement.payback_remaining_cents)} remaining
                          </p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}

        {view === 'sales' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">All Sales</h2>
            {sales.length === 0 ? (
              <Card>
                <CardBody>
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No sales yet</p>
                    <p className="text-sm text-gray-500 mt-1">Share your tracking links to start earning commissions</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card>
                <CardBody>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sale Amount</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Commission</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Deductions</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Earned</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(sale.sale_date)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {sale.business.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {sale.product_name || 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                              {formatCurrency(sale.sale_amount_cents)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-green-600">
                              {formatCurrency(sale.commission_amount_cents)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-orange-600">
                              -{formatCurrency(sale.total_deductions_cents)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-blue-600">
                              {formatCurrency(sale.net_commission_cents)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                sale.status === 'paid' ? 'bg-green-100 text-green-700' :
                                sale.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                sale.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {sale.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </div>
    </PartnerHubLayout>
  );
}
