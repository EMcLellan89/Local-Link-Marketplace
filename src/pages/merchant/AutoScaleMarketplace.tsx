import { useState } from 'react';
import { Check, Zap, TrendingUp, Shield, Clock, Users, ArrowRight, Star } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const tiers = [
  {
    name: 'Starter',
    price: 697,
    description: 'Stop losing leads',
    color: 'from-emerald-500 to-teal-600',
    features: [
      'Instant lead response (< 1 min)',
      'Missed-call text back',
      'Appointment reminders',
      'Basic follow-up sequences',
      'Weekly activity summary',
    ],
    bestFor: 'Small shops, solo operators',
    tier: 'starter'
  },
  {
    name: 'Growth',
    price: 1997,
    description: 'Automate sales + reviews',
    color: 'from-blue-500 to-indigo-600',
    popular: true,
    features: [
      'Everything in Starter, plus:',
      'Multi-step lead follow-up',
      'CRM automation (optional sync)',
      'Booking + reschedule assistant',
      'Review request + routing',
      'Monthly performance reports',
      'Industry-specific workflows',
    ],
    bestFor: 'Growing businesses, multi-service companies',
    tier: 'growth'
  },
  {
    name: 'Elite',
    price: 3997,
    description: 'Custom AI team + integrations',
    color: 'from-orange-500 to-red-600',
    features: [
      'Everything in Growth, plus:',
      'Custom AI agents',
      'Custom workflow design',
      'Multi-location routing',
      'Custom integrations (CRM, ERP)',
      'Ongoing optimization',
      'Priority support',
      'White-label or co-brand options',
    ],
    bestFor: 'Multi-location, franchises, enterprise',
    tier: 'elite'
  },
];

const benefits = [
  {
    icon: Clock,
    title: 'Instant Response',
    description: 'Reply to every lead in under 60 seconds, 24/7/365'
  },
  {
    icon: TrendingUp,
    title: '+40% Lead Capture',
    description: 'Never miss another opportunity with automated follow-up'
  },
  {
    icon: Users,
    title: 'No Hiring Required',
    description: 'AI handles the work of a full sales team'
  },
  {
    icon: Shield,
    title: 'Always Reliable',
    description: 'Circuit breakers and auto-retry ensure delivery'
  },
];

export default function AutoScaleMarketplace() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleSubscribe = (tier: string) => {
    setSelectedTier(tier);
    // TODO: Implement Stripe checkout
    alert(`Subscribe to ${tier} - Stripe checkout coming soon!`);
  };

  return (
    <DashboardLayout title="AutoScale™ - AI Client Growth System">
      <div className="max-w-7xl mx-auto space-y-12 pb-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">New: AI-Powered Growth System</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900">
            Local-Link AutoScale™
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered client growth, sales, and retention system. Automatically handles leads, follow-ups,
            bookings, and reviews — so your business grows without hiring more staff.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span>4.9/5 from 200+ businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Setup in under 15 minutes</span>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Growth Plan</h2>
            <p className="text-gray-600">All plans include AI automation. Upgrade or downgrade anytime.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-white rounded-2xl border-2 ${
                  tier.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200'
                } overflow-hidden hover:shadow-2xl transition-all`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className={`p-8 ${tier.popular ? 'pt-16' : ''}`}>
                  <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-sm font-medium mb-4`}>
                    {tier.name}
                  </div>

                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>

                  <p className="text-gray-600 mb-6">{tier.description}</p>

                  <button
                    onClick={() => handleSubscribe(tier.tier)}
                    className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                      tier.popular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="mt-8 space-y-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      What's Included:
                    </div>
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-xs text-gray-500">Best For:</div>
                    <div className="text-sm text-gray-900 font-medium">{tier.bestFor}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How AutoScale™ Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Subscribe</h3>
              <p className="text-sm text-gray-600">Choose your tier and subscribe in minutes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Onboarding</h3>
              <p className="text-sm text-gray-600">Our AI collects your business info automatically</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Go Live</h3>
              <p className="text-sm text-gray-600">Workflows deploy and start working instantly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Scale</h3>
              <p className="text-sm text-gray-600">Watch leads convert while you focus on delivery</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Do I need to install anything?</h3>
              <p className="text-gray-600">No. AutoScale™ works through SMS, email, and integrations. No app installation required.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Can I pause or cancel anytime?</h3>
              <p className="text-gray-600">Yes. You can pause or cancel your subscription at any time. No long-term contracts.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Will this work with my existing CRM?</h3>
              <p className="text-gray-600">Growth and Elite tiers can integrate with most CRMs, or AutoScale™ works standalone.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">How quickly will I see results?</h3>
              <p className="text-gray-600">Lead capture improves immediately. Booking improvements compound weekly as AI learns your business.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Is AI reliable and safe?</h3>
              <p className="text-gray-600">Yes. We use circuit breakers, automatic retries, and human oversight. You can monitor and pause anytime.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Business with AI?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 200+ businesses growing faster with AutoScale™. Start with any tier and upgrade as you grow.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            View Plans & Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
