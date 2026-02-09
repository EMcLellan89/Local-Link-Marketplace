import { useState, useEffect } from 'react';
import {
  Users,
  Store,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  BarChart3,
  Calendar,
  UserPlus,
  ShoppingCart,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';

interface CombinedStats {
  total_merchants: number;
  total_partners: number;
  total_customers: number;
  new_partners_this_month: number;
  new_partners_last_month: number;
  partner_growth_rate: number;
  total_revenue_cents: number;
  partner_revenue_cents: number;
  platform_revenue_cents: number;
  active_subscriptions: number;
  total_course_enrollments: number;
  total_affiliate_commissions_cents: number;
}

interface PlatformStats {
  direct_sales_this_month_cents: number;
  direct_sales_last_month_cents: number;
  sales_growth_rate: number;
  mrr_cents: number;
  new_merchants_this_month: number;
  new_merchants_last_month: number;
  merchant_growth_rate: number;
  churn_rate: number;
  total_deals: number;
  active_deals: number;
  average_deal_value_cents: number;
  course_revenue_this_month_cents: number;
  vapi_revenue_this_month_cents: number;
}

interface PartnerStats {
  total_partner_revenue_cents: number;
  total_partner_commissions_cents: number;
  avg_revenue_per_partner_cents: number;
  partners_with_sales_this_month: number;
  partners_without_sales_this_month: number;
  total_partner_merchants: number;
  partner_course_sales_cents: number;
  partner_crm_sales_cents: number;
  top_partners: Array<{
    partner_id: string;
    business_name: string;
    revenue_cents: number;
    merchant_count: number;
  }>;
}

interface MonthlyPartners {
  month_date: string;
  partners_joined: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [combinedStats, setCombinedStats] = useState<CombinedStats | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [partnerStats, setPartnerStats] = useState<PartnerStats | null>(null);
  const [monthlyPartners, setMonthlyPartners] = useState<MonthlyPartners[]>([]);

  useEffect(() => {
    loadAllStats();
  }, []);

  async function loadAllStats() {
    try {
      const [combinedResult, platformResult, partnerResult, monthlyResult] = await Promise.all([
        supabase.rpc('get_combined_overview_stats'),
        supabase.rpc('get_platform_sales_stats'),
        supabase.rpc('get_partner_totals_stats'),
        supabase.rpc('get_partners_joined_by_month')
      ]);

      if (combinedResult.data) setCombinedStats(combinedResult.data);
      if (platformResult.data) setPlatformStats(platformResult.data);
      if (partnerResult.data) setPartnerStats(partnerResult.data);
      if (monthlyResult.data) setMonthlyPartners(monthlyResult.data);

    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(cents: number): string {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatPercent(value: number): string {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  function GrowthIndicator({ value }: { value: number }) {
    if (value > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUp className="w-4 h-4" />
          <span className="text-sm font-medium">{formatPercent(value)}</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <ArrowDown className="w-4 h-4" />
          <span className="text-sm font-medium">{formatPercent(value)}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Minus className="w-4 h-4" />
        <span className="text-sm font-medium">0%</span>
      </div>
    );
  }

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
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Complete overview of Local Link performance and growth</p>
        </div>

        {/* DASHBOARD 1: Combined Overview */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Combined Overview</h2>
          </div>
          <p className="text-gray-600 mb-6">Total Local Link sales, partner sales, and all platform metrics</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(combinedStats?.total_revenue_cents || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">All sources</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Businesses</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {combinedStats?.total_merchants.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Active merchants</p>
                  </div>
                  <Store className="w-8 h-8 text-blue-600" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Partners</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {combinedStats?.total_partners.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Active partners</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {combinedStats?.total_customers.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Platform-wide</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-orange-600" />
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-gray-900">Revenue Breakdown</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Platform Direct:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(combinedStats?.platform_revenue_cents || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Partner Sales:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(combinedStats?.partner_revenue_cents || 0)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(combinedStats?.total_revenue_cents || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <p className="font-semibold text-gray-900">Partner Growth</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Month:</span>
                    <span className="font-semibold text-gray-900">
                      {combinedStats?.new_partners_this_month || 0} new
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Month:</span>
                    <span className="font-semibold text-gray-900">
                      {combinedStats?.new_partners_last_month || 0} new
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">Growth Rate:</span>
                      <GrowthIndicator value={combinedStats?.partner_growth_rate || 0} />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-gray-900">Additional Revenue</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subscriptions:</span>
                    <span className="font-semibold text-gray-900">
                      {combinedStats?.active_subscriptions || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Course Sales:</span>
                    <span className="font-semibold text-gray-900">
                      {combinedStats?.total_course_enrollments || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Commissions:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(combinedStats?.total_affiliate_commissions_cents || 0)}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* DASHBOARD 2: Platform Sales & Growth */}
        <section className="pt-8 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Platform Sales & Growth</h2>
          </div>
          <p className="text-gray-600 mb-6">Direct platform sales and growth metrics (excluding partner sales)</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">MRR</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(platformStats?.mrr_cents || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Monthly recurring</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Sales This Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(platformStats?.direct_sales_this_month_cents || 0)}
                    </p>
                    <div className="mt-2">
                      <GrowthIndicator value={platformStats?.sales_growth_rate || 0} />
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">New Merchants</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {platformStats?.new_merchants_this_month || 0}
                    </p>
                    <div className="mt-2">
                      <GrowthIndicator value={platformStats?.merchant_growth_rate || 0} />
                    </div>
                  </div>
                  <Store className="w-8 h-8 text-purple-600" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Churn Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {platformStats?.churn_rate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">This month</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-orange-600" />
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-gray-900">Deals Performance</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Deals:</span>
                    <span className="font-semibold text-gray-900">
                      {platformStats?.total_deals || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Deals:</span>
                    <span className="font-semibold text-gray-900">
                      {platformStats?.active_deals || 0}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">Avg Value:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(platformStats?.average_deal_value_cents || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <p className="font-semibold text-gray-900">Course Revenue</p>
                </div>
                <div className="space-y-3">
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-purple-600">
                      {formatCurrency(platformStats?.course_revenue_this_month_cents || 0)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">This Month</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-gray-900">Vapi Revenue</p>
                </div>
                <div className="space-y-3">
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(platformStats?.vapi_revenue_this_month_cents || 0)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">This Month</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* DASHBOARD 3: Partner Totals */}
        <section className="pt-8 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Partner Performance</h2>
          </div>
          <p className="text-gray-600 mb-6">Comprehensive partner sales and performance metrics</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Partner Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(partnerStats?.total_partner_revenue_cents || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total attributed</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Commissions Paid</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(partnerStats?.total_partner_commissions_cents || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total earned</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg per Partner</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(partnerStats?.avg_revenue_per_partner_cents || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Revenue average</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Partner Merchants</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {partnerStats?.total_partner_merchants || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total attributed</p>
                  </div>
                  <Store className="w-8 h-8 text-orange-600" />
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-gray-900">Partner Activity (This Month)</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">With Sales:</span>
                    <span className="font-semibold text-green-600">
                      {partnerStats?.partners_with_sales_this_month || 0} partners
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Without Sales:</span>
                    <span className="font-semibold text-orange-600">
                      {partnerStats?.partners_without_sales_this_month || 0} partners
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">Active Rate:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {partnerStats && (partnerStats.partners_with_sales_this_month + partnerStats.partners_without_sales_this_month) > 0
                          ? ((partnerStats.partners_with_sales_this_month / (partnerStats.partners_with_sales_this_month + partnerStats.partners_without_sales_this_month)) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <p className="font-semibold text-gray-900">Revenue Sources</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CRM Sales:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(partnerStats?.partner_crm_sales_cents || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Course Sales:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(partnerStats?.partner_course_sales_cents || 0)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency((partnerStats?.partner_crm_sales_cents || 0) + (partnerStats?.partner_course_sales_cents || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Top Partners */}
          {partnerStats && partnerStats.top_partners && partnerStats.top_partners.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-bold text-gray-900">Top 5 Partners (This Month)</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {partnerStats.top_partners.map((partner, index) => (
                    <div
                      key={partner.partner_id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{partner.business_name}</p>
                          <p className="text-sm text-gray-600">{partner.merchant_count} merchants</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(partner.revenue_cents)}
                        </p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </section>

        {/* Partner Growth Chart */}
        {monthlyPartners.length > 0 && (
          <section className="pt-8 border-t border-gray-200">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Partners Joined (Last 12 Months)</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {monthlyPartners.map((month) => (
                    <div key={month.month_date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(month.month_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${Math.min((month.partners_joined / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-12 text-right">
                          {month.partners_joined}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
