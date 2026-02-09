import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Users, TrendingUp, Calendar, Mail, Phone, Tag, DollarSign, Zap, Target, BarChart3, Clock, Eye, MousePointer, ShoppingCart, TrendingDown, Activity } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';

interface DealPerformance {
  deal_id: string;
  deal_title: string;
  impressions: number;
  unique_views: number;
  clicks: number;
  click_through_rate: number;
  purchases: number;
  conversion_rate: number;
  total_revenue_cents: number;
  total_cost_cents: number;
  net_profit_cents: number;
  roi_percentage: number;
  avg_order_value_cents: number;
  last_calculated_at: string;
}

interface PerformanceOverview {
  total_impressions: number;
  total_clicks: number;
  total_purchases: number;
  total_revenue: number;
  total_costs: number;
  overall_roi: number;
  avg_conversion_rate: number;
}

const pricingTiers = [
  {
    name: 'Starter',
    price: 149,
    period: 'month',
    description: 'Essential CRM for small businesses',
    features: [
      'Starter CRM (500 contacts)',
      'Basic marketplace listing',
      'Deal scheduling',
      'QR code redemption',
      'Basic analytics',
      'Mobile app access',
      'Email support'
    ],
    popular: false,
    crmTier: 'Starter CRM',
    booksTier: 'None'
  },
  {
    name: 'Founders',
    price: 249,
    period: 'month',
    description: 'Locked rate for early adopters',
    features: [
      'Professional CRM (5,000 contacts)',
      'Local-Link Books Lite included',
      'Enhanced analytics',
      'Email promotion (1x monthly)',
      'Founders rate locked for life',
      'Priority support',
      'Review management'
    ],
    popular: true,
    badge: 'MOST POPULAR',
    crmTier: 'Professional CRM',
    booksTier: 'Books Lite'
  },
  {
    name: 'Standard',
    price: 299,
    period: 'month',
    description: 'For established businesses',
    features: [
      'Business CRM (25,000 contacts)',
      'Local-Link Books Pro included',
      'Featured in 2 email blasts/month',
      'Social media feature (1x/month)',
      'A/B testing tools',
      'Custom branding options',
      'Advanced deal scheduling'
    ],
    popular: false,
    crmTier: 'Business CRM',
    booksTier: 'Books Pro'
  },
  {
    name: 'Premium',
    price: 349,
    period: 'month',
    description: 'Maximum visibility for high-volume businesses',
    features: [
      'Enterprise CRM (100,000 contacts)',
      'Local-Link Books Pro included',
      'TOP ROW premium placement',
      'Featured in 4 email blasts/month',
      'Dedicated account manager',
      'White-label options',
      'API access',
      'Custom integrations'
    ],
    popular: false,
    crmTier: 'Enterprise CRM',
    booksTier: 'Books Pro'
  }
];

export default function CRMMarketplacePage() {
  const navigate = useNavigate();
  const [merchantId, setMerchantId] = useState<string>('');
  const [hasCRMAccess, setHasCRMAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<DealPerformance[]>([]);
  const [overview, setOverview] = useState<PerformanceOverview>({
    total_impressions: 0,
    total_clicks: 0,
    total_purchases: 0,
    total_revenue: 0,
    total_costs: 0,
    overall_roi: 0,
    avg_conversion_rate: 0,
  });

  useEffect(() => {
    checkCRMAccess();
  }, []);

  const checkCRMAccess = async () => {
    try {
      setError(null);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return;

      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (merchant) {
        setMerchantId(merchant.id);

        const { data: leads, error: leadsError } = await supabase
          .from('crm_leads')
          .select('id')
          .eq('merchant_id', merchant.id)
          .limit(1);

        if (leadsError) throw leadsError;

        const hasAccess = leads && leads.length > 0;
        setHasCRMAccess(hasAccess);

        if (hasAccess) {
          await loadPerformanceData(merchant.id);
        }
      }
    } catch (error) {
      console.error('Error checking CRM access:', error);
      setError('Failed to load CRM information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadPerformanceData = async (merchantId: string) => {
    try {
      setError(null);
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select(`
          id,
          title,
          deal_performance_stats (
            impressions,
            unique_views,
            clicks,
            click_through_rate,
            purchases,
            conversion_rate,
            total_revenue_cents,
            total_cost_cents,
            net_profit_cents,
            roi_percentage,
            avg_order_value_cents,
            last_calculated_at
          )
        `)
        .eq('merchant_id', merchantId)
        .eq('status', 'active');

      if (dealsError) throw dealsError;

      if (deals) {
        const performanceList: DealPerformance[] = deals
          .filter((d: any) => d.deal_performance_stats)
          .map((d: any) => ({
            deal_id: d.id,
            deal_title: d.title,
            impressions: d.deal_performance_stats.impressions || 0,
            unique_views: d.deal_performance_stats.unique_views || 0,
            clicks: d.deal_performance_stats.clicks || 0,
            click_through_rate: d.deal_performance_stats.click_through_rate || 0,
            purchases: d.deal_performance_stats.purchases || 0,
            conversion_rate: d.deal_performance_stats.conversion_rate || 0,
            total_revenue_cents: d.deal_performance_stats.total_revenue_cents || 0,
            total_cost_cents: d.deal_performance_stats.total_cost_cents || 0,
            net_profit_cents: d.deal_performance_stats.net_profit_cents || 0,
            roi_percentage: d.deal_performance_stats.roi_percentage || 0,
            avg_order_value_cents: d.deal_performance_stats.avg_order_value_cents || 0,
            last_calculated_at: d.deal_performance_stats.last_calculated_at || '',
          }));

        setPerformanceData(performanceList);

        const totalImpressions = performanceList.reduce((sum, p) => sum + p.impressions, 0);
        const totalClicks = performanceList.reduce((sum, p) => sum + p.clicks, 0);
        const totalPurchases = performanceList.reduce((sum, p) => sum + p.purchases, 0);
        const totalRevenue = performanceList.reduce((sum, p) => sum + p.total_revenue_cents, 0);
        const totalCosts = performanceList.reduce((sum, p) => sum + p.total_cost_cents, 0);
        const netProfit = totalRevenue - totalCosts;
        const overallROI = totalCosts > 0 ? ((netProfit / totalCosts) * 100) : 0;
        const avgConversion = totalImpressions > 0 ? ((totalPurchases / totalImpressions) * 100) : 0;

        setOverview({
          total_impressions: totalImpressions,
          total_clicks: totalClicks,
          total_purchases: totalPurchases,
          total_revenue: totalRevenue / 100,
          total_costs: totalCosts / 100,
          overall_roi: overallROI,
          avg_conversion_rate: avgConversion,
        });
      }
    } catch (error) {
      console.error('Error loading performance data:', error);
      setError('Failed to load performance data. Please try again.');
    }
  };

  const handlePurchase = async (tierName: string, price: number) => {
    alert(`Purchase flow for ${tierName} plan at $${price}/month will be integrated with payment system.`);
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading...</div>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="space-y-12">
        {error && (
          <Card variant="bordered" className="bg-red-50 border-red-200">
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="text-red-600 mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={checkCRMAccess}>
                  Try Again
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Local Link CRM
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Manage Every Customer Lead in One Place
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Automatically capture leads from your marketplace deals and turn them into loyal customers.
            Track every interaction, never miss a follow-up, and grow your business faster.
          </p>
          {hasCRMAccess ? (
            <Button size="lg" onClick={() => navigate('/merchant/crm-dashboard')} className="text-lg px-8 py-6">
              Access Your CRM Dashboard
            </Button>
          ) : (
            <Button size="lg" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-lg px-8 py-6">
              Get Started Today
            </Button>
          )}
        </div>

        {hasCRMAccess && performanceData.length > 0 && (
          <div className="space-y-8">
            <div className="border-t pt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Ad Performance & ROI</h2>
                  <p className="text-slate-600 mt-1">Track how your marketplace deals are performing</p>
                </div>
                <Button variant="outline" onClick={() => loadPerformanceData(merchantId)}>
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Total Impressions</p>
                        <p className="text-3xl font-bold text-slate-900">{overview.total_impressions.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">People who viewed your deals</p>
                  </CardBody>
                </Card>

                <Card variant="bordered" className="bg-gradient-to-br from-violet-50 to-purple-50">
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Total Clicks</p>
                        <p className="text-3xl font-bold text-slate-900">{overview.total_clicks.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                        <MousePointer className="w-6 h-6 text-violet-600" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">Engagement with your deals</p>
                  </CardBody>
                </Card>

                <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Total Purchases</p>
                        <p className="text-3xl font-bold text-slate-900">{overview.total_purchases.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{overview.avg_conversion_rate.toFixed(2)}% conversion rate</p>
                  </CardBody>
                </Card>

                <Card variant="bordered" className={`bg-gradient-to-br ${overview.overall_roi >= 0 ? 'from-emerald-50 to-teal-50' : 'from-red-50 to-orange-50'}`}>
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Overall ROI</p>
                        <p className={`text-3xl font-bold ${overview.overall_roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {overview.overall_roi >= 0 ? '+' : ''}{overview.overall_roi.toFixed(1)}%
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${overview.overall_roi >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {overview.overall_roi >= 0 ? (
                          <TrendingUp className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">Return on investment</p>
                  </CardBody>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card variant="bordered">
                  <CardBody>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Total Revenue</span>
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">${overview.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </CardBody>
                </Card>

                <Card variant="bordered">
                  <CardBody>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Total Ad Costs</span>
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">${overview.total_costs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </CardBody>
                </Card>

                <Card variant="bordered">
                  <CardBody>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Net Profit</span>
                      <DollarSign className="w-5 h-5 text-slate-600" />
                    </div>
                    <p className={`text-2xl font-bold ${(overview.total_revenue - overview.total_costs) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(overview.total_revenue - overview.total_costs).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </CardBody>
                </Card>
              </div>

              <Card variant="bordered">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900">Deal Performance Breakdown</h3>
                  <p className="text-sm text-slate-600 mt-1">Individual performance metrics for each active deal</p>
                </CardHeader>
                <CardBody>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Deal Name</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Impressions</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Clicks</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">CTR</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Purchases</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Conv. Rate</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Revenue</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performanceData.map((deal) => (
                          <tr key={deal.deal_id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 text-sm text-slate-900 font-medium">{deal.deal_title}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 text-right">{deal.impressions.toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 text-right">{deal.clicks.toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 text-right">{deal.click_through_rate.toFixed(2)}%</td>
                            <td className="py-3 px-4 text-sm text-slate-600 text-right">{deal.purchases.toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 text-right">{deal.conversion_rate.toFixed(2)}%</td>
                            <td className="py-3 px-4 text-sm text-green-600 text-right font-medium">
                              ${(deal.total_revenue_cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className={`py-3 px-4 text-sm text-right font-bold ${deal.roi_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {deal.roi_percentage >= 0 ? '+' : ''}{deal.roi_percentage.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {performanceData.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No performance data available yet</p>
                      <p className="text-sm">Data will appear once your deals start getting views and purchases</p>
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card variant="bordered" className="bg-gradient-to-br from-slate-50 to-slate-100">
                <CardBody>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Understanding Your Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Impressions</h4>
                      <p className="text-sm text-slate-600">Number of times your deals were displayed to potential customers</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Click-Through Rate (CTR)</h4>
                      <p className="text-sm text-slate-600">Percentage of viewers who clicked on your deal (Clicks / Impressions)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Conversion Rate</h4>
                      <p className="text-sm text-slate-600">Percentage of viewers who purchased your deal (Purchases / Impressions)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">ROI (Return on Investment)</h4>
                      <p className="text-sm text-slate-600">How much profit you made compared to costs ((Revenue - Costs) / Costs × 100)</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardBody>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automatic Lead Capture</h3>
              <p className="text-slate-600">
                Every customer who purchases your marketplace deal is automatically added to your CRM
              </p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardBody>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pipeline Management</h3>
              <p className="text-slate-600">
                Track leads through your sales process from first contact to closed deal
              </p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-orange-50 to-amber-50">
            <CardBody>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics & Reports</h3>
              <p className="text-slate-600">
                See which marketing channels bring the best leads and highest conversion rates
              </p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardBody>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Never Miss Follow-ups</h3>
              <p className="text-slate-600">
                Set reminders and tasks to ensure timely follow-up with every lead
              </p>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardBody>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
                How It Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Customer Purchases Your Deal</h3>
                    <p className="text-slate-600">
                      When someone buys your deal on the Local Link Marketplace, their information is instantly captured
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Lead Added to Your CRM</h3>
                    <p className="text-slate-600">
                      The customer becomes a lead in your CRM with all their contact details and purchase history
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Track & Follow Up</h3>
                    <p className="text-slate-600">
                      Log calls, emails, and meetings. Set reminders. Move leads through your pipeline to close more sales
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Turn Buyers into Repeat Customers</h3>
                    <p className="text-slate-600">
                      Stay connected with your customers and bring them back for more business
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="bordered">
            <CardBody>
              <Users className="w-8 h-8 text-[#2BB673] mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Contact Management</h3>
              <p className="text-slate-600 text-sm">
                Store all customer details, purchase history, and communication in one organized place
              </p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <TrendingUp className="w-8 h-8 text-[#2BB673] mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Sales Pipeline</h3>
              <p className="text-slate-600 text-sm">
                Visual pipeline shows exactly where each lead is in your sales process
              </p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <Calendar className="w-8 h-8 text-[#2BB673] mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Task Management</h3>
              <p className="text-slate-600 text-sm">
                Create tasks, set due dates, and get reminders so nothing falls through the cracks
              </p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <Mail className="w-8 h-8 text-[#2BB673] mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Activity Tracking</h3>
              <p className="text-slate-600 text-sm">
                Log every call, email, and meeting to maintain complete customer history
              </p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <Tag className="w-8 h-8 text-[#2BB673] mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Lead Source Tracking</h3>
              <p className="text-slate-600 text-sm">
                Know which marketing efforts bring in the best leads and highest ROI
              </p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <DollarSign className="w-8 h-8 text-[#2BB673] mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Deal Value Tracking</h3>
              <p className="text-slate-600 text-sm">
                Forecast revenue by tracking the potential value of every opportunity
              </p>
            </CardBody>
          </Card>
        </div>

        <div id="pricing" className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">
              Choose the plan that fits your business. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier: any) => (
              <Card
                key={tier.name}
                variant="bordered"
                className={`relative ${tier.popular ? 'ring-2 ring-[#2BB673] shadow-xl' : ''}`}
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      {tier.badge}
                    </span>
                  </div>
                )}
                {tier.comingSoon && (
                  <div className="absolute -top-4 right-4 z-10">
                    <span className="bg-slate-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Coming Soon
                    </span>
                  </div>
                )}
                <CardHeader>
                  <h3 className="text-2xl font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-slate-600 text-sm mt-2">{tier.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">${tier.price}</span>
                    <span className="text-slate-600">/{tier.period}</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start text-sm text-slate-600">
                        <CheckCircle2 className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    fullWidth
                    variant={tier.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handlePurchase(tier.name, tier.price)}
                    disabled={tier.comingSoon}
                    className={tier.badge ? 'bg-orange-600 hover:bg-orange-700' : ''}
                  >
                    {tier.comingSoon ? 'Coming Soon' : tier.badge ? 'Claim Black Friday Deal' : 'Get Started'}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardBody>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Ready to Convert More Leads into Customers?
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Start managing your marketplace leads like a pro. No credit card required for 14-day trial.
              </p>
              <Button size="lg" onClick={() => handlePurchase('Professional', 159)} className="text-lg px-8 py-6">
                Start Free Trial
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="border-t pt-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">How does automatic lead capture work?</h4>
                <p className="text-slate-600">
                  When a customer purchases your deal on the Local Link Marketplace, their information (name, email, phone)
                  is automatically added to your CRM as a new lead. You can then follow up, track interactions, and convert
                  them into repeat customers.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Can I import leads from other sources?</h4>
                <p className="text-slate-600">
                  Yes! In addition to automatic marketplace lead capture, you can manually add leads from website inquiries,
                  referrals, walk-ins, or any other source. Higher tier plans include CSV import and API access.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">What happens if I exceed my lead limit?</h4>
                <p className="text-slate-600">
                  We'll notify you when you're approaching your limit. You can easily upgrade to the next tier to
                  accommodate more leads. We'll never delete your data or stop capturing marketplace leads.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Can multiple team members use the CRM?</h4>
                <p className="text-slate-600">
                  Yes! The Professional plan includes up to 5 users, and the Enterprise plan includes unlimited users.
                  Each team member gets their own login to track activities and manage leads.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Is my data secure?</h4>
                <p className="text-slate-600">
                  Absolutely. We use bank-level encryption, secure data centers, and follow industry best practices.
                  Your data is backed up daily and you can export it anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
