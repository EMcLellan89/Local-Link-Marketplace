import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, Users, TrendingUp, ArrowRight,
  Briefcase, BookOpen, Target, Sparkles, Gift, MapPin, CreditCard, Phone, Zap, Calculator, Package
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import CommissionSimulator from '../../components/partner/CommissionSimulator';
import { DEV_MODE, MOCK_PARTNER, MOCK_PARTNER_COMMISSIONS } from '../../lib/devMode';

interface PartnerData {
  id: string;
  referral_code: string;
  status: string;
  tier: string;
  ai_credits_remaining: number;
  total_commission_earned: number;
  monthly_recurring_revenue: number;
}

interface Stats {
  totalCommissions: number;
  pendingCommissions: number;
  activeMerchants: number;
  monthlyRecurring: number;
  territoryCount: number;
  aiCredits: number;
}

export default function PartnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalCommissions: 0,
    pendingCommissions: 0,
    activeMerchants: 0,
    monthlyRecurring: 0,
    territoryCount: 0,
    aiCredits: 0,
  });
  const [hasCRMSubscription, setHasCRMSubscription] = useState(false);
  const [enrollingCourse, setEnrollingCourse] = useState(false);

  useEffect(() => {
    if (user) {
      loadPartnerDashboard();
    }
  }, [user]);

  const loadPartnerDashboard = async () => {
    if (!user) return;

    if (DEV_MODE) {
      setPartner(MOCK_PARTNER as PartnerData);
      setStats({
        totalCommissions: 47500,
        pendingCommissions: 12300,
        activeMerchants: 23,
        monthlyRecurring: 3450,
        territoryCount: 2,
        aiCredits: 500,
      });
      setHasCRMSubscription(true);
      setLoading(false);
      return;
    }

    try {
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('id, referral_code, status, tier, ai_credits_remaining, total_commission_earned, monthly_recurring_revenue')
        .eq('user_id', user.id)
        .maybeSingle();

      if (partnerError) throw partnerError;

      if (!partnerData) {
        setLoading(false);
        return;
      }

      setPartner(partnerData as PartnerData);

      const { data: commissions } = await supabase
        .from('partner_ai_commissions')
        .select('amount_cents, status')
        .eq('partner_id', partnerData.id);

      const totalCommissions = commissions?.reduce((sum, c) => sum + c.amount_cents, 0) || 0;
      const pendingCommissions = commissions?.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount_cents, 0) || 0;

      const { data: merchants } = await supabase
        .from('merchants')
        .select('id')
        .eq('partner_id', partnerData.id)
        .eq('status', 'approved');

      const { data: territories } = await supabase
        .from('territories')
        .select('id')
        .eq('partner_id', partnerData.id)
        .eq('is_active', true);

      const { data: crmSub } = await supabase
        .from('partner_crm_subscriptions')
        .select('status')
        .eq('partner_id', partnerData.id)
        .eq('status', 'active')
        .maybeSingle();

      setHasCRMSubscription(!!crmSub);

      setStats({
        totalCommissions,
        pendingCommissions,
        activeMerchants: merchants?.length || 0,
        monthlyRecurring: partnerData.monthly_recurring_revenue || 0,
        territoryCount: territories?.length || 0,
        aiCredits: partnerData.ai_credits_remaining || 0,
      });

      setLoading(false);
    } catch (err) {
      console.error('Error loading partner dashboard:', err);
      setLoading(false);
    }
  };

  const handleEnrollFreeCourse = async (courseSlug: string) => {
    if (!user || enrollingCourse) return;

    setEnrollingCourse(true);
    try {
      navigate(`/academy/courses/${courseSlug}`);
    } catch (err) {
      console.error('Error navigating to course:', err);
    } finally {
      setEnrollingCourse(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toLocaleString()}`;
  };

  if (loading) {
    return (
      <PartnerHubLayout>
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
        </div>
      </PartnerHubLayout>
    );
  }

  if (!partner) {
    return (
      <PartnerHubLayout>
        <Card variant="bordered">
          <CardBody>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-2">Partner Profile Not Found</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-4">
                Please complete your partner application to access the dashboard.
              </p>
              <Button onClick={() => navigate('/partner/apply')}>
                Apply Now
              </Button>
            </div>
          </CardBody>
        </Card>
      </PartnerHubLayout>
    );
  }

  return (
    <PartnerHubLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Partner Command Center</h1>
            <p className="text-slate-600 mt-2">Build your territory and grow your income</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Referral Code</p>
            <p className="text-lg font-bold text-[#2BB673]">{partner.referral_code}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Commissions</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatPrice(stats.totalCommissions)}</p>
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
                  <p className="text-sm text-slate-600">Pending Payout</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatPrice(stats.pendingCommissions)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Merchants</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.activeMerchants}</p>
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
                  <p className="text-sm text-slate-600">Monthly Recurring</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{formatPrice(stats.monthlyRecurring)}</p>
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
                  <p className="text-sm text-slate-600">Your Territories</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.territoryCount}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">AI Credits Left</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.aiCredits}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-cyan-600" />
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
                  <p className="text-blue-100 mb-4 max-w-2xl">
                    Access free partner training courses and paid courses to expand your expertise. Learn what your merchants need so you can sell with confidence.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>15+ Courses Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      <span>Free Partner Training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Industry Certifications</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/academy')}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  >
                    Browse Academy <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="bordered" className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      Sell AutoScale™ AI Systems
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full">
                      HIGH TICKET
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Earn 20-30% recurring on $697-$3,997/mo AI automation packages. Full sales kit included.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/partner/autoscale/sales')}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    View Commission Plan <DollarSign className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Manage Your CRM
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {hasCRMSubscription
                      ? 'Access your partner CRM to manage contacts, deals, and pipeline'
                      : 'Upgrade to partner CRM to manage your merchant pipeline professionally'}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate(hasCRMSubscription ? '/partner/crm' : '/partner/crm/upgrade')}
                    className={hasCRMSubscription ? "bg-blue-600 hover:bg-blue-700" : ""}
                    variant={hasCRMSubscription ? "default" : "outline"}
                  >
                    {hasCRMSubscription ? 'Open CRM' : 'Upgrade to CRM'} <ArrowRight className="w-4 h-4 ml-1" />
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
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Business Coaching - Sell & Earn
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Sell coaching to your merchants or buy for yourself to grow faster
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/partner/business-coach')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    View Packages <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      Financial Engine™ Sales
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                      25% REC
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Sell AI bookkeeping at $79-$799/mo. Earn 25% recurring on every merchant.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/partner/financial-engine/sales')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Commission <DollarSign className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      Business Deals Hub
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-full">
                      30% COMM
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Share exclusive deals. Earn 30% on every tool and bundle sale.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/partner/deals-hub')}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    Get Tracking Links <Package className="w-4 h-4 ml-1" />
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
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    AI Prompt Library
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Access 100+ proven AI prompts for sales, marketing, and operations
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/partner/ai-prompts')}
                  >
                    Browse Library <Sparkles className="w-4 h-4 ml-1" />
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
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Communications Hub
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Professional phone, email, and SMS for your partnership business
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/partner/communications/checkout')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Get Started <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Local-Link Academy - Partner Training</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/academy')}
            >
              View All Courses
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="bordered" className="bg-gradient-to-br from-[#2BB673]/10 to-blue-50 border-[#2BB673]/30">
              <CardBody>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#2BB673]/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-[#2BB673]" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        Partner Accelerator
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#2BB673] text-white rounded-full">
                        PRO
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Master selling Local-Link solutions and build recurring income with confidence
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleEnrollFreeCourse('partner-accelerator')}
                      disabled={enrollingCourse}
                      className="bg-[#2BB673] hover:bg-[#229a5f]"
                    >
                      {enrollingCourse ? 'Loading...' : 'Start Course'} <BookOpen className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardBody>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Selling Recurring Revenue
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Learn how to sell retainers and recurring packages that clients love
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleEnrollFreeCourse('selling-recurring-revenue')}
                      variant="outline"
                      disabled={enrollingCourse}
                    >
                      {enrollingCourse ? 'Loading...' : 'Start Course'} <BookOpen className="w-4 h-4 ml-1" />
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
                      <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Marketing for Trades
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Help trade businesses master local visibility and Google Maps ranking
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleEnrollFreeCourse('marketing-for-trades')}
                      variant="outline"
                      disabled={enrollingCourse}
                    >
                      {enrollingCourse ? 'Loading...' : 'Start Course'} <BookOpen className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

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
                        Blog Growth System
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-bold bg-cyan-600 text-white rounded-full">
                        FREE
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Learn how blogging drives organic traffic so you can sell this service to merchants
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleEnrollFreeCourse('blog-growth-system')}
                      variant="outline"
                      disabled={enrollingCourse}
                      className="border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white"
                    >
                      {enrollingCourse ? 'Loading...' : 'Start Course'} <BookOpen className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <CommissionSimulator />

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                fullWidth
                variant="outline"
                onClick={() => navigate('/partner/contracts')}
              >
                View Contracts
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => navigate('/partner/leaderboard')}
              >
                View Leaderboard
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => navigate('/partner/training')}
              >
                Training Portal
              </Button>
              <Button
                fullWidth
                onClick={() => navigate('/partner/billing')}
              >
                Billing & Payouts
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </PartnerHubLayout>
  );
}
