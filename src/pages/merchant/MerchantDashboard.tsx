import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, ShoppingBag, Users, TrendingUp, ArrowRight, Bot,
  FileText, Target, Phone, CreditCard, Briefcase, Mail, Sparkles, BookOpen, Gift, Zap, Calculator, Package
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { checkBlogCourseAccess, CourseAccessInfo } from '../../lib/courseAccess';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

interface Stats {
  totalRevenue: number;
  totalDeals: number;
  activeDealsPurchases: number;
  pendingPayout: number;
  loyaltySubscribers: number;
  aiBotConversations: number;
  appointmentsSet: number;
  leadsDelivered: number;
  merchantServicesSavings: number;
}

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalDeals: 0,
    activeDealsPurchases: 0,
    pendingPayout: 0,
    loyaltySubscribers: 0,
    aiBotConversations: 0,
    appointmentsSet: 0,
    leadsDelivered: 0,
    merchantServicesSavings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [merchantStatus, setMerchantStatus] = useState<string>('pending');
  const [hasProSubscription, setHasProSubscription] = useState(false);
  const [enrollingCourse, setEnrollingCourse] = useState(false);
  const [blogCourseAccess, setBlogCourseAccess] = useState<CourseAccessInfo | null>(null);

  useEffect(() => {
    if (user) {
      checkMerchantStatus();
      checkBlogCourse();
    }
  }, [user]);

  const checkBlogCourse = async () => {
    if (!user) return;
    const access = await checkBlogCourseAccess(user.id);
    setBlogCourseAccess(access);
  };

  const checkMerchantStatus = async () => {
    if (!user) return;

    if (DEV_MODE) {
      setMerchantStatus('approved');
      setStats({
        totalRevenue: 125000,
        totalDeals: 12,
        activeDealsPurchases: 47,
        pendingPayout: 35000,
        loyaltySubscribers: 87,
        aiBotConversations: 234,
        appointmentsSet: 18,
        leadsDelivered: 150,
        merchantServicesSavings: 120000,
      });
      setLoading(false);
      return;
    }

    try {
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id, status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (!merchant) {
        setMerchantStatus('not_found');
        setLoading(false);
        return;
      }

      setMerchantStatus(merchant.status);

      if (merchant.status === 'approved') {
        await fetchStats(merchant.id);
        await checkProSubscription();
      }

      setLoading(false);
    } catch (err) {
      console.error('Error checking merchant status:', err);
      setError('Failed to load merchant status. Please refresh the page.');
      setLoading(false);
    }
  };

  const checkProSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('plan_slug', 'local-link-pro')
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      if (error) throw error;
      setHasProSubscription(!!data);
    } catch (err) {
      console.error('Error checking Pro subscription:', err);
    }
  };

  const handleEnrollFreeCourse = async () => {
    if (!user || enrollingCourse) return;

    setEnrollingCourse(true);
    try {
      const { error } = await supabase.rpc('sync_free_course_access', {
        p_user_id: user.id
      });

      if (error) throw error;

      navigate('/academy/courses/reviews-that-convert');
    } catch (err) {
      console.error('Error enrolling in free course:', err);
      setError('Failed to enroll in course. Please try again.');
    } finally {
      setEnrollingCourse(false);
    }
  };

  const fetchStats = async (merchantId: string) => {
    try {
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('id, status')
        .eq('merchant_id', merchantId);

      if (dealsError) throw dealsError;

      const dealIds = deals?.map(d => d.id) || [];

      let totalRevenue = 0;
      let activeDealsPurchases = 0;

      if (dealIds.length > 0) {
        const { data: purchases, error: purchasesError } = await supabase
          .from('purchases')
          .select('amount_paid_cents, merchant_payout_cents, deal_id')
          .in('deal_id', dealIds);

        if (purchasesError) throw purchasesError;

        totalRevenue = purchases?.reduce((sum, p) => sum + p.amount_paid_cents, 0) || 0;
        activeDealsPurchases = purchases?.length || 0;
      }

      const { data: payouts, error: payoutsError } = await supabase
        .from('payouts')
        .select('amount_cents')
        .eq('merchant_id', merchantId)
        .eq('status', 'pending');

      if (payoutsError) throw payoutsError;

      const pendingPayout = payouts?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;

      const { data: bots, error: botsError } = await supabase
        .from('ai_bot_setups')
        .select('performance_metrics')
        .eq('merchant_id', merchantId)
        .eq('status', 'active');

      if (botsError) throw botsError;

      const aiBotConversations = bots?.reduce((sum, bot) => {
        const metrics = bot.performance_metrics as { conversations?: number };
        return sum + (metrics?.conversations || 0);
      }, 0) || 0;

      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointment_setting_bookings')
        .select('appointments_set')
        .eq('merchant_id', merchantId)
        .eq('status', 'active');

      if (appointmentsError) throw appointmentsError;

      const appointmentsSet = appointments?.reduce((sum, a) => sum + a.appointments_set, 0) || 0;

      const { data: leads, error: leadsError } = await supabase
        .from('lead_list_orders')
        .select('lead_count')
        .eq('merchant_id', merchantId);

      if (leadsError) throw leadsError;

      const leadsDelivered = leads?.reduce((sum, l) => sum + l.lead_count, 0) || 0;

      const { data: merchantServices, error: servicesError } = await supabase
        .from('merchant_services_applications')
        .select('estimated_savings')
        .eq('merchant_id', merchantId)
        .eq('application_status', 'active')
        .maybeSingle();

      if (servicesError) throw servicesError;

      const merchantServicesSavings = merchantServices?.estimated_savings || 0;

      setStats({
        totalRevenue,
        totalDeals: deals?.length || 0,
        activeDealsPurchases,
        pendingPayout,
        loyaltySubscribers: 87,
        aiBotConversations,
        appointmentsSet,
        leadsDelivered,
        merchantServicesSavings,
      });
    } catch (err) {
      console.error('Error fetching merchant stats:', err);
      setError('Failed to load dashboard statistics. Please try again.');
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </BusinessHubLayout>
    );
  }

  if (error) {
    return (
      <BusinessHubLayout>
        <Card variant="bordered">
          <CardBody>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Something Went Wrong</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </CardBody>
        </Card>
      </BusinessHubLayout>
    );
  }

  if (merchantStatus === 'not_found') {
    return (
      <BusinessHubLayout>
        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Complete Your Merchant Profile</h2>
          </CardHeader>
          <CardBody>
            <p className="text-slate-600 mb-4">
              To start creating deals, you need to complete your merchant profile.
            </p>
            <Button onClick={() => navigate('/merchant/onboarding')}>
              Complete Profile
            </Button>
          </CardBody>
        </Card>
      </BusinessHubLayout>
    );
  }

  if (merchantStatus === 'pending') {
    return (
      <BusinessHubLayout>
        <Card variant="bordered">
          <CardBody>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#F5B82E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#F5B82E]" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Account Under Review</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Your merchant account is currently being reviewed by our team.
                You'll receive an email once your account is approved.
              </p>
            </div>
          </CardBody>
        </Card>
      </BusinessHubLayout>
    );
  }

  if (merchantStatus === 'rejected' || merchantStatus === 'suspended') {
    return (
      <BusinessHubLayout>
        <Card variant="bordered">
          <CardBody>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-2">Account Status: {merchantStatus}</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Please contact support for more information.
              </p>
            </div>
          </CardBody>
        </Card>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Business Command Center</h1>
          <p className="text-slate-600 mt-2">Your all-in-one business growth dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Deals Active</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalDeals}</p>
                </div>
                <div className="w-12 h-12 bg-[#F5B82E]/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#F5B82E]" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Deals Sold This Week</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.activeDealsPurchases}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Marketplace Revenue</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatPrice(stats.totalRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#2BB673]/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#2BB673]" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Payouts Pending</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatPrice(stats.pendingPayout)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Loyalty Subscribers</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.loyaltySubscribers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">AI Bot Conversations</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.aiBotConversations}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Appointments Set</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.appointmentsSet}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Leads Delivered</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.leadsDelivered}</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Processing Savings</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatPrice(stats.merchantServicesSavings)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white">
          <CardBody className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Local-Link Academy™</h2>
                  <p className="text-white mb-4 max-w-2xl">
                    Master local marketing, sales, and business growth with our expert-led courses. Learn proven strategies to attract more customers and increase revenue.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm mb-4 text-white font-medium">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>15+ Courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Certifications Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Lifetime Access</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/academy')}
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg"
                  >
                    Browse All Courses <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="bordered" className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    AutoScale™ — Automate Your Growth
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    AI responds to every lead in under 1 minute, books appointments 24/7, and generates reviews on autopilot. From $697/mo
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/merchant/autoscale')}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    View Plans <Zap className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Getting Traffic? Add an AI Chatbot
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Book more leads automatically with AI-powered bots on Messenger, your website, and SMS
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/merchant/ai-bots')}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    Add Bot <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Unlock 1,000+ Ad Templates
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    See what's working in your industry with proven marketing assets
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/merchant/swipe-file')}
                  >
                    Unlock Library <Sparkles className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Need More Customers?
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Get 500 additional leads this month at just 20¢ per lead
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/merchant/leads')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Buy Leads <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Approved for 0% Processing
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Save $500-$1,500/month on payment processing fees
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/merchant/merchant-services')}
                  >
                    Apply Now <DollarSign className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Financial Engine™ — Books Done Right
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    AI-powered bookkeeping, monthly close, and tax-ready reports. From $79/mo
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/marketplace/financial-engine')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Plans <Calculator className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Business Deals Hub
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Access insider deals on marketing tools, software, and services. Save 30-70% off retail
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/marketplace/business-deals')}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    Browse Deals <Package className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {hasProSubscription && (
            <Card variant="bordered" className="bg-gradient-to-br from-[#2BB673]/10 to-blue-50 border-[#2BB673]/30">
              <CardBody>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#2BB673]/20 rounded-lg flex items-center justify-center">
                      <Gift className="w-6 h-6 text-[#2BB673]" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        FREE with Your Pro Plan
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#2BB673] text-white rounded-full">
                        $49 VALUE
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      <strong>Reviews That Bring Customers In™</strong> — Build a review machine that increases trust and conversions
                    </p>
                    <Button
                      size="sm"
                      onClick={handleEnrollFreeCourse}
                      disabled={enrollingCourse}
                      className="bg-[#2BB673] hover:bg-[#229a5f]"
                    >
                      {enrollingCourse ? 'Enrolling...' : 'Start Free Course'} <BookOpen className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {blogCourseAccess?.hasAccess && (
            <Card variant="bordered" className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-300">
              <CardBody>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-cyan-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        Your Blog Growth System
                      </h3>
                      {blogCourseAccess.tier && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-cyan-600 text-white rounded-full">
                          {blogCourseAccess.tier.toUpperCase()} TIER
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Master blogging to drive organic traffic and leads to your business
                    </p>
                    <Button
                      size="sm"
                      onClick={() => navigate('/merchant/courses/blog-growth-system/dashboard')}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      Continue Learning <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                fullWidth
                onClick={() => navigate('/merchant/deals/new')}
              >
                Create New Deal
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/merchant/deals')}
              >
                Manage Deals
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/merchant/capital')}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Get Funding
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/merchant/redemptions')}
              >
                Scan QR Code
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
