import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Check, TrendingUp, FileText, Shield, Clock, DollarSign, Zap, Award, AlertTriangle } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  route: string;
  recommended?: boolean;
  tier: string;
}

export default function FinancialEnginePage() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans: Plan[] = [
    {
      name: 'Accounting Lite',
      tier: 'Essential',
      price: billingPeriod === 'monthly' ? '$79' : '$790',
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      route: '/merchant/accounting/lite',
      cta: 'Get Started',
      features: [
        'Monthly revenue & expense tracking',
        'Basic profit & loss reports',
        'Invoice management',
        'Receipt uploads',
        'Customer tracking',
        'Email support'
      ]
    },
    {
      name: 'Accounting Pro',
      tier: 'Professional',
      price: billingPeriod === 'monthly' ? '$197' : '$1,970',
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      route: '/merchant/accounting/pro',
      cta: 'Upgrade Now',
      recommended: true,
      features: [
        'Everything in Lite, plus:',
        'Quarterly tax obligation tracking',
        'State sales tax calculations',
        'Federal income tax estimates',
        'Auto-pay tax scheduling',
        'Direct IRS & state tax filing links',
        'Multi-business unit support',
        'Advanced P&L reports',
        'Balance sheet',
        'Cash flow statements',
        'Priority support'
      ]
    },
    {
      name: 'Full-Service Bookkeeping',
      tier: 'Enterprise',
      price: 'Custom',
      period: 'Based on volume',
      route: '/merchant/support',
      cta: 'Contact Sales',
      features: [
        'Everything in Pro, plus:',
        'Dedicated bookkeeper',
        'Daily transaction categorization',
        'Monthly reconciliation',
        'Financial statement preparation',
        'Tax planning & strategy',
        'CFO advisory services',
        'Audit support',
        'White-glove onboarding',
        '24/7 priority support'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6">
            <Calculator className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Financial Engine™
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            AI-powered bookkeeping that keeps your books clean, your taxes paid, and your business compliant
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            From $79/mo • No setup fees • Cancel anytime
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card variant="bordered" className="bg-white">
            <CardBody className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Save 10+ Hours/Month</h3>
              <p className="text-sm text-slate-600">Let AI handle bookkeeping while you focus on growth</p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-white">
            <CardBody className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Stay Tax Compliant</h3>
              <p className="text-sm text-slate-600">Automatic tax calculations and quarterly reminders</p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-white">
            <CardBody className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Real-Time Insights</h3>
              <p className="text-sm text-slate-600">See your financial health at a glance, anytime</p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-white">
            <CardBody className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Save on Fees</h3>
              <p className="text-sm text-slate-600">Replaces $300-$1,500/mo traditional bookkeepers</p>
            </CardBody>
          </Card>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                Save 16%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant="bordered"
              className={`${
                plan.recommended
                  ? 'border-2 border-blue-600 shadow-xl scale-105 bg-white relative'
                  : 'bg-white'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <div className="text-sm font-semibold text-blue-600 mb-2">{plan.tier}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="text-slate-600">{plan.period}</span>
                  )}
                </div>
                {plan.price !== 'Custom' && billingPeriod === 'annual' && (
                  <p className="text-sm text-green-600 mt-2">
                    Save ${parseInt(plan.price.replace('$', '').replace(',', '')) * 2} per year
                  </p>
                )}
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  fullWidth
                  onClick={() => navigate(plan.route)}
                  className={
                    plan.recommended
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
                      : ''
                  }
                  variant={plan.recommended ? undefined : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <Card variant="bordered" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white mb-16">
          <CardBody className="text-center py-12">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Why Local Business Owners Choose Financial Engine</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-3xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Businesses Trust Us</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">$2.5B+</div>
                <div className="text-blue-100">Transactions Processed</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-blue-100">Accuracy Rate</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card variant="bordered">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-2">What's included in all plans?</h3>
                <p className="text-slate-600 text-sm">
                  All plans include secure data storage, bank-level encryption, unlimited users, mobile access, and regular backups.
                </p>
              </CardBody>
            </Card>

            <Card variant="bordered">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-2">Can I upgrade or downgrade anytime?</h3>
                <p className="text-slate-600 text-sm">
                  Yes! You can change plans at any time. We'll prorate the charges so you only pay for what you use.
                </p>
              </CardBody>
            </Card>

            <Card variant="bordered">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-2">Do you file taxes for me?</h3>
                <p className="text-slate-600 text-sm">
                  Accounting Pro calculates your tax obligations and provides direct links to IRS Direct Pay and state tax portals. Full-Service Bookkeeping includes tax filing assistance.
                </p>
              </CardBody>
            </Card>

            <Card variant="bordered">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-2">What if I need help?</h3>
                <p className="text-slate-600 text-sm">
                  All plans include email support. Pro plans get priority support, and Enterprise customers get dedicated account managers.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Warning Banner */}
        <Card variant="bordered" className="bg-amber-50 border-amber-200 mt-16">
          <CardBody>
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Important Tax Compliance Notice</h3>
                <p className="text-sm text-slate-700">
                  While Financial Engine provides accurate calculations and tracking, it is not a substitute for professional tax advice.
                  We recommend consulting with a CPA for complex tax situations. Financial Engine Pro helps you stay organized and compliant,
                  but ultimate tax filing responsibility remains with the business owner.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
