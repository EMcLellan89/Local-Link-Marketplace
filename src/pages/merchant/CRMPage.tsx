import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Printer, Wrench, ShoppingBag, TrendingUp, CheckCircle2, Target, Phone, Mail, Calendar, Zap, BarChart3, ArrowRight } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_CRM_LEADS } from '../../lib/devMode';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface CRMStats {
  localLinkLeads: number;
  adSuiteLeads: number;
  tradeHiveLeads: number;
  totalLeads: number;
}

export default function CRMPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<CRMStats>({
    localLinkLeads: 0,
    adSuiteLeads: 0,
    tradeHiveLeads: 0,
    totalLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (user) {
      loadCRMStats();
    }
  }, [user]);

  const loadCRMStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Dev mode: return mock data
      if (DEV_MODE) {
        setMerchantId('dev-merchant-id');
        const localLink = MOCK_CRM_LEADS.filter(l => l.lead_source === 'marketplace').length;
        const adSuite = MOCK_CRM_LEADS.filter(l => ['printing', 'postcards', 'swag', 'website'].includes(l.lead_source)).length;
        const tradeHive = MOCK_CRM_LEADS.filter(l => l.lead_source === 'trades').length;

        setStats({
          localLinkLeads: localLink,
          adSuiteLeads: adSuite,
          tradeHiveLeads: tradeHive,
          totalLeads: MOCK_CRM_LEADS.length
        });
        setLoading(false);
        return;
      }

      // Production: query database
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) {
        console.error('Merchant query error:', merchantError);
        throw merchantError;
      }

      if (!merchant) {
        setNeedsOnboarding(true);
        setLoading(false);
        return;
      }

      setMerchantId(merchant.id);

      const { data: leads, error: leadsError } = await supabase
        .from('crm_leads')
        .select('lead_source')
        .eq('merchant_id', merchant.id);

      if (leadsError) {
        console.error('Leads query error:', leadsError);
        throw leadsError;
      }

      const localLink = leads?.filter(l => l.lead_source === 'marketplace').length || 0;
      const adSuite = leads?.filter(l => ['printing', 'postcards', 'swag', 'website'].includes(l.lead_source)).length || 0;
      const tradeHive = leads?.filter(l => l.lead_source === 'trades').length || 0;

      setStats({
        localLinkLeads: localLink,
        adSuiteLeads: adSuite,
        tradeHiveLeads: tradeHive,
        totalLeads: leads?.length || 0
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading CRM stats:', error);
      setError('Failed to load CRM statistics. Please try again.');
      setLoading(false);
    }
  };

  const crmSystems = [
    {
      id: 'local-link',
      name: 'Local-Link CRM',
      icon: ShoppingBag,
      color: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      description: 'Marketplace Lead Management',
      fullDescription: 'Automatically capture and manage leads from customers who purchase your deals on the Local Link Marketplace.',
      leadCount: stats.localLinkLeads,
      features: [
        'Automatic lead capture from marketplace purchases',
        'Customer purchase history tracking',
        'Deal performance analytics',
        'Redemption tracking integration',
        'Email and SMS follow-up campaigns',
        'Loyalty program integration'
      ],
      idealFor: 'Local businesses using the marketplace to attract customers',
      action: () => navigate('/merchant/crm-dashboard'),
      buttonText: 'Manage Marketplace Leads'
    },
    {
      id: 'adsuite',
      name: 'AdSuite CRM',
      icon: Printer,
      color: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      description: 'Marketing & Print Services',
      fullDescription: 'Purpose-built for marketing agencies, print shops, and promotional product businesses.',
      leadCount: stats.adSuiteLeads,
      features: [
        'Print order tracking and fulfillment',
        'Design request management',
        'Quote and proposal generation',
        'Project timeline tracking',
        'Recurring order automation',
        'Vendor and supplier management'
      ],
      idealFor: 'Print shops, marketing agencies, promotional product companies',
      action: () => window.open('https://www.adsuitecrm.com', '_blank'),
      buttonText: 'Access AdSuite CRM'
    },
    {
      id: 'tradehive',
      name: 'TradeHive CRM',
      icon: Wrench,
      color: 'from-orange-500 to-red-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      description: 'Home Services & Trades',
      fullDescription: 'Specialized CRM for contractors, plumbers, electricians, HVAC, landscaping, and all home service professionals.',
      leadCount: stats.tradeHiveLeads,
      features: [
        'Job scheduling and dispatch',
        'Estimate and invoice generation',
        'Before/after photo documentation',
        'Equipment and inventory tracking',
        'Service history and maintenance reminders',
        'Subcontractor management'
      ],
      idealFor: 'Contractors, plumbers, electricians, HVAC, landscapers, handymen',
      action: () => window.open('https://www.tradehivecrm.com', '_blank'),
      buttonText: 'Access TradeHive CRM'
    }
  ];

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading CRM...</div>
        </div>
      </BusinessHubLayout>
    );
  }

  if (needsOnboarding) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card variant="bordered" className="max-w-2xl">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Business Profile</h3>
                <p className="text-slate-600 mb-6">
                  To access CRM features and manage leads, you need to complete your merchant profile setup first.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => navigate('/merchant/onboarding')}
                    size="lg"
                  >
                    Complete Setup
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/merchant/dashboard')}
                    size="lg"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </BusinessHubLayout>
    );
  }

  if (error) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card variant="bordered" className="max-w-md">
            <CardBody>
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading CRM</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={loadCRMStats}>Try Again</Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/merchant/dashboard')}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your CRM System
          </h1>
          <p className="text-xl text-slate-600">
            Access industry-specific CRM tools designed for your business type.
            Each system is tailored to the unique needs of different industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="bordered">
            <CardBody>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stats.totalLeads}</div>
                <div className="text-sm text-slate-600 mt-1">Total Leads</div>
              </div>
            </CardBody>
          </Card>
          <Card variant="bordered">
            <CardBody>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.localLinkLeads}</div>
                <div className="text-sm text-slate-600 mt-1">Marketplace Leads</div>
              </div>
            </CardBody>
          </Card>
          <Card variant="bordered">
            <CardBody>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.adSuiteLeads + stats.tradeHiveLeads}</div>
                <div className="text-sm text-slate-600 mt-1">Other Leads</div>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-blue-600 rounded-xl">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    Communications Hub
                  </h3>
                  <p className="text-slate-600">
                    Call, text, and SMS your leads directly from the platform
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-700">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      VoIP Calling
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      SMS
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate('/merchant/communications')}
                className="flex items-center gap-2"
              >
                Open Communications
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-green-600 rounded-xl">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    Email Marketing
                  </h3>
                  <p className="text-slate-600">
                    Send professional email campaigns to your customers
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-700">
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      50K - 100K emails/mo
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Starting at $19.95/mo
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate('/merchant/email/activate')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                Activate Email Marketing
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          {crmSystems.map((crm) => {
            const Icon = crm.icon;
            return (
              <Card key={crm.id} variant="bordered" className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${crm.color}`} />
                <CardBody>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <div className="flex items-start">
                        <div className={`w-12 h-12 rounded-lg ${crm.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${crm.iconColor}`} />
                        </div>
                        <div className="ml-4 flex-1">
                          <h2 className="text-2xl font-bold text-slate-900">{crm.name}</h2>
                          <p className="text-sm text-slate-600 font-medium">{crm.description}</p>
                          <div className="mt-3 inline-flex items-center px-3 py-1 bg-slate-100 rounded-full">
                            <Users className="w-4 h-4 text-slate-600 mr-1" />
                            <span className="text-sm font-semibold text-slate-900">{crm.leadCount}</span>
                            <span className="text-sm text-slate-600 ml-1">leads</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-600 mt-4">{crm.fullDescription}</p>
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                          Ideal For
                        </div>
                        <div className="text-sm text-slate-900">{crm.idealFor}</div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <h3 className="font-bold text-slate-900 mb-3">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {crm.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle2 className={`w-5 h-5 ${crm.iconColor} mr-2 flex-shrink-0 mt-0.5`} />
                            <span className="text-sm text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={crm.action}
                        size="lg"
                        className="w-full md:w-auto"
                      >
                        {crm.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardBody>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Why Use Industry-Specific CRMs?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#2BB673] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Built for Your Business</h3>
                  <p className="text-sm text-slate-600">
                    Each CRM is designed with workflows, terminology, and features specific to your industry
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#2BB673] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Faster Setup</h3>
                  <p className="text-sm text-slate-600">
                    No need to customize generic CRMs - start with templates and fields that match your needs
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#2BB673] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Better Insights</h3>
                  <p className="text-sm text-slate-600">
                    Track metrics that matter to your industry with pre-built reports and dashboards
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardBody>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                All CRMs Include Core Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Contact Management</div>
                    <div className="text-xs text-slate-600">Store all customer details</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Activity Tracking</div>
                    <div className="text-xs text-slate-600">Log calls, emails, meetings</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Sales Pipeline</div>
                    <div className="text-xs text-slate-600">Visual deal tracking</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Task Management</div>
                    <div className="text-xs text-slate-600">Never miss a follow-up</div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardBody>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Need Help Choosing?
              </h2>
              <p className="text-slate-600 mb-6">
                Not sure which CRM is right for you? Most businesses start with Local-Link CRM to manage marketplace leads,
                then add industry-specific CRMs as they grow.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" onClick={() => navigate('/merchant/crm-dashboard')}>
                  Start with Local-Link CRM
                </Button>
                <Button size="lg" variant="outline">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
