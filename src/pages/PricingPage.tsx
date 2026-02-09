import { useState } from 'react';
import { Check, Zap, TrendingUp, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { SEO } from '../components/SEO';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const merchantTiers = [
    {
      name: 'Starter',
      price: { monthly: 149, annual: 1596 },
      description: 'Essential CRM + Deals for small businesses',
      features: [
        'Starter CRM (500 contacts)',
        '1 postcard spot (rotating placement)',
        'Basic marketplace listing',
        'Business directory',
        'QR code redemption',
        'Basic analytics',
        'Deal scheduling',
        'Mobile app access',
        'Email support'
      ],
      cta: 'Start Free Trial',
      href: '/register',
      popular: false
    },
    {
      name: 'Founders',
      price: { monthly: 249, annual: 2664 },
      description: 'Locked rate for early adopters',
      features: [
        'Professional CRM (5,000 contacts)',
        'Local-Link Books Lite included',
        '1 postcard spot (value placement)',
        'Enhanced analytics dashboard',
        'Email promotion (1x monthly)',
        'Founders rate locked for life',
        'Review management',
        'Advanced deal scheduling',
        'Priority support'
      ],
      cta: 'Get Started',
      href: '/register',
      popular: true
    },
    {
      name: 'Standard',
      price: { monthly: 299, annual: 3197 },
      description: 'Most popular for established businesses',
      features: [
        'Business CRM (25,000 contacts)',
        'Local-Link Books Pro included',
        '1 postcard spot (standard placement)',
        'Priority marketplace listing',
        'Featured in 2 email blasts/month',
        'Social media feature (1x/month)',
        'A/B testing tools',
        'Custom branding options',
        'Priority support'
      ],
      cta: 'Get Started',
      href: '/register',
      popular: false
    },
    {
      name: 'Premium',
      price: { monthly: 349, annual: 3732 },
      description: 'Maximum visibility for high-volume businesses',
      features: [
        'Enterprise CRM (100,000 contacts)',
        'Local-Link Books Pro included',
        'TOP ROW premium placement',
        'Featured deal badge',
        'Featured in 4 email blasts/month',
        'Boosted social media (2x/month)',
        'Dedicated account manager',
        'White-label options',
        'API access',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      href: '/register',
      popular: false
    }
  ];

  const partnerTiers = [
    {
      name: 'Starter Partner',
      price: { monthly: 79, annual: 837 },
      commission: '10%',
      features: [
        'Partner Dashboard',
        'Territory Management',
        'Merchant Invites',
        'Deal Creation',
        'Analytics & Payouts',
        'Training & Support'
      ]
    },
    {
      name: 'Growth Partner',
      price: { monthly: 218, annual: 2310 },
      commission: '15%',
      features: [
        'Everything in Starter',
        'Priority Support',
        'Advanced Analytics',
        'AI Prompt Library',
        '7% Recruiter Override'
      ]
    },
    {
      name: 'Pro Partner',
      price: { monthly: 498, annual: 5278 },
      commission: '20%',
      features: [
        'Everything in Growth',
        'Enhanced Territory Rights',
        'White-Label Options',
        'API Access',
        'Dedicated Support'
      ]
    },
    {
      name: 'Enterprise Partner',
      price: { monthly: 1798, annual: 19056 },
      commission: '25%',
      features: [
        'Everything in Pro',
        'Maximum Commission Rate',
        'Custom Integrations',
        'Multi-Territory Management',
        'Priority Payouts'
      ]
    }
  ];

  const territoryPricing = [
    { name: 'City / Metro', monthly: 97, annual: 970 },
    { name: 'Region', monthly: 197, annual: 1970 },
    { name: 'State / Province', monthly: 297, annual: 2970 },
    { name: 'Country', monthly: 497, annual: 4970 }
  ];

  const automationAddons = [
    { name: 'Real-Time Webhook Processing', price: 49, category: 'Automation' },
    { name: 'Automated Inactivity Scanner', price: 29, category: 'Automation' },
    { name: 'Partner Eligibility Scoring', price: 49, category: 'Compliance' },
    { name: 'Admin Overrides & Controls', price: 29, category: 'Compliance' },
    { name: 'Compliance Warnings & Emails', price: 49, category: 'Compliance' },
    { name: 'Reinstatement Automation', price: 29, category: 'Compliance' },
    { name: 'Real-Time Analytics Widgets', price: 19, category: 'Analytics' },
    { name: 'Chargeback & Refund Triggers', price: 19, category: 'Analytics' }
  ];

  const globalAddons = [
    { name: 'Multi-Country Support', price: 299 },
    { name: 'Multi-Currency & Exchange', price: 199 },
    { name: 'Multi-Language Support', price: 99 }
  ];

  const professionalServices = [
    { name: 'Onboarding & Training', price: 997, type: 'one-time' },
    { name: 'White-Label Branding', price: 2000, type: 'one-time' },
    { name: 'Territory Rollout Strategy', price: 1500, type: 'one-time' },
    { name: 'Custom Workflow Development', price: 150, type: 'hourly' },
    { name: 'Email Templates & Sequences', price: 499, type: 'one-time' },
    { name: 'GoPayBright Integration Tuning', price: 799, type: 'one-time' },
    { name: 'Compliance Process Design', price: 1200, type: 'one-time' },
    { name: 'Zoom Coaching Session', price: 150, type: 'hourly' },
    { name: 'Fast-Start Launch Pack', price: 2997, type: 'package' }
  ];

  return (
    <>
      <SEO
        title="Pricing Plans - Merchant & Partner Subscriptions"
        description="Transparent pricing for LocalLink merchants and partners. Starter at $127/mo, Growth at $199/mo, Enterprise at $349/mo. Save 20% with annual billing. All-in-one CRM, deals, and marketing."
        keywords="merchant pricing, partner pricing, subscription plans, saas pricing, business platform costs"
        canonical="https://locallink.com/pricing"
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            Pricing Built for Growth
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Transparent pricing that scales with your business
          </p>

          <div className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-sm border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Merchant Platform Tiers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {merchantTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${
                  tier.popular
                    ? 'border-2 border-blue-600 shadow-xl'
                    : 'border border-slate-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-slate-600 mb-6 min-h-[48px]">
                    {tier.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-black text-slate-900">
                      ${tier.price[billingCycle]}
                    </span>
                    <span className="text-slate-600">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  <Link to={tier.href}>
                    <Button
                      variant={tier.popular ? 'primary' : 'secondary'}
                      className="w-full mb-6"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20 bg-slate-50 rounded-2xl p-12">
          <div className="text-center mb-12">
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Partner Program
            </h2>
            <p className="text-xl text-slate-600">
              Earn 10-25% recurring commissions based on your tier
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {partnerTiers.map((tier) => (
              <div
                key={tier.name}
                className="bg-white rounded-xl p-8 border border-slate-200"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {tier.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-black text-slate-900">
                    ${tier.price[billingCycle]}
                  </span>
                  <span className="text-slate-600">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6 p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-slate-600">Commission Rate</span>
                  <span className="font-bold text-green-700">{tier.commission}</span>
                </div>
                <div className="text-xs text-slate-500 mb-6 text-center p-2 bg-blue-50 rounded">
                  + 7% recruiter override on referrals
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/partner-application">
              <Button variant="primary" size="lg">
                Apply to Become a Partner
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Territory Licensing
            </h2>
            <p className="text-xl text-slate-600">
              Own exclusive territories and build your local empire
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {territoryPricing.map((territory) => (
              <div
                key={territory.name}
                className="bg-white rounded-xl p-6 border border-slate-200 text-center"
              >
                <h3 className="font-bold text-slate-900 mb-4">{territory.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-black text-slate-900">
                    ${billingCycle === 'monthly' ? territory.monthly : territory.annual}
                  </span>
                </div>
                <span className="text-slate-600 text-sm">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-12">
          <div className="text-center mb-12">
            <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Automation Add-Ons
            </h2>
            <p className="text-xl text-slate-600">
              Supercharge your platform with powerful automations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {automationAddons.map((addon) => (
              <div
                key={addon.name}
                className="bg-white rounded-xl p-6 border border-slate-200"
              >
                <div className="text-xs font-semibold text-blue-600 mb-2">
                  {addon.category}
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-sm">
                  {addon.name}
                </h3>
                <div className="text-2xl font-black text-slate-900">
                  ${addon.price}
                  <span className="text-sm text-slate-600 font-normal">/mo</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
              Global Expansion Add-Ons
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {globalAddons.map((addon) => (
                <div
                  key={addon.name}
                  className="bg-white rounded-xl p-6 border border-slate-200 text-center"
                >
                  <h3 className="font-bold text-slate-900 mb-3">{addon.name}</h3>
                  <div className="text-3xl font-black text-slate-900">
                    ${addon.price}
                    <span className="text-sm text-slate-600 font-normal">/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Professional Services
            </h2>
            <p className="text-xl text-slate-600">
              Expert help to launch and scale faster
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {professionalServices.map((service) => (
              <div
                key={service.name}
                className="bg-white rounded-xl p-6 border border-slate-200"
              >
                <h3 className="font-bold text-slate-900 mb-3">{service.name}</h3>
                <div className="text-2xl font-black text-slate-900 mb-2">
                  ${service.price.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600 capitalize">
                  {service.type === 'one-time' ? 'One-time fee' :
                   service.type === 'hourly' ? 'Per hour' :
                   'Package deal'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center bg-blue-50 rounded-xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Fast-Start Launch Pack
            </h3>
            <p className="text-slate-600 mb-6">
              Complete setup: Onboarding + Branding + Training
            </p>
            <div className="text-4xl font-black text-blue-600 mb-6">
              $2,997
            </div>
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Get Started with Launch Pack
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-20 text-center">
          <div className="bg-slate-900 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Plan?</h2>
            <p className="text-slate-300 mb-8 text-lg">
              Let's discuss your specific requirements and create a tailored solution
            </p>
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
