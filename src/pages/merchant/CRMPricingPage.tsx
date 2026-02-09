import { CheckCircle2, Users, Zap, TrendingUp, Crown } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';

const tiers = [
  {
    name: 'Starter',
    icon: Users,
    price: 179,
    crm: 'Basic CRM',
    contacts: 500,
    accounting: 'Books Lite',
    teamMembers: 2,
    color: 'from-slate-500 to-slate-600',
    features: [
      'Contact management & basic pipeline',
      'Email marketing',
      'Deal tracking',
      'Lead auto-capture',
      'Basic reporting',
      'Mobile app access',
      'Books Lite accounting'
    ]
  },
  {
    name: 'Founders',
    icon: Zap,
    price: 279,
    crm: 'Professional CRM',
    contacts: 2500,
    accounting: 'Books Pro',
    teamMembers: 5,
    color: 'from-blue-500 to-indigo-600',
    badge: 'LOCKED RATE',
    features: [
      'Everything in Starter',
      'Advanced pipelines',
      'Email automation',
      'AI prompt library',
      'Customer segmentation',
      'Review management',
      'Books Pro accounting'
    ]
  },
  {
    name: 'Standard',
    icon: TrendingUp,
    price: 349,
    crm: 'Business CRM',
    contacts: 10000,
    accounting: 'Books Pro',
    teamMembers: 15,
    color: 'from-[#2BB673] to-[#25a062]',
    badge: 'MOST POPULAR',
    features: [
      'Everything in Founders',
      'SMS marketing',
      'Custom workflows',
      'AI tools & automation',
      'CRM automations',
      'A/B testing',
      'Advanced forecasting',
      'Books Pro accounting'
    ]
  },
  {
    name: 'Premium',
    icon: Crown,
    price: 449,
    crm: 'Enterprise CRM',
    contacts: 999999,
    accounting: 'Books Pro',
    teamMembers: 'Unlimited',
    color: 'from-amber-500 to-orange-600',
    badge: 'BEST VALUE',
    features: [
      'Everything in Standard',
      'Unlimited contacts',
      'Unlimited team members',
      'Full AI suite',
      'API access',
      'White-label CRM',
      'Unlimited communications',
      'Custom integrations',
      'Dedicated account manager'
    ]
  }
];

export default function CRMPricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" />
            CRM Included with Every Subscription Tier
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Bundled Subscription Tiers
          </h1>
          <p className="text-xl text-slate-600">
            Every subscription includes marketplace access + LocalLink CRM + bookkeeping. One price, everything included. Choose the tier that fits your business size.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;

            return (
              <Card key={tier.name}>
                <CardHeader>
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                        {tier.badge && (
                          <span className="text-xs px-2 py-0.5 rounded bg-[#2BB673]/10 text-[#2BB673] font-semibold">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-3xl font-bold text-slate-900">
                        ${tier.price}
                        <span className="text-base font-normal text-slate-600">/mo</span>
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">CRM Tier:</span>
                        <span className="font-semibold text-slate-900">{tier.crm}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Contacts:</span>
                        <span className="font-semibold text-slate-900">
                          {typeof tier.contacts === 'number' && tier.contacts < 999999 ? tier.contacts.toLocaleString() : 'Unlimited'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Team Members:</span>
                        <span className="font-semibold text-slate-900">
                          {tier.teamMembers}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Accounting:</span>
                        <span className="font-semibold text-slate-900">
                          {tier.accounting}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody>
                  <div className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardBody>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                All Plans Include:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Contact management</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Deal pipeline tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Email marketing tools</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Mobile app access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Performance analytics</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">Postcard marketing</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="text-center">
          <p className="text-slate-600 mb-2">
            CRM is included with your subscription tier at no additional cost.
          </p>
          <p className="text-sm text-slate-500">
            Upgrade or downgrade your tier anytime to adjust contact limits and features.
          </p>
        </div>
      </div>
    </div>
  );
}
