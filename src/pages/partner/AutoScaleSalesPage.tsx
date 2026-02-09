import { DollarSign, Users, TrendingUp, Zap, CheckCircle, Target, Award, ArrowRight, Star } from 'lucide-react';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';

const commissionTiers = [
  {
    tier: 'Starter',
    price: '$697/mo',
    commission: '20%',
    monthly: '$139',
    clients10: '$1,390/mo',
    clients50: '$6,950/mo',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    tier: 'Growth',
    price: '$1,997/mo',
    commission: '25%',
    monthly: '$499',
    clients10: '$4,990/mo',
    clients50: '$24,950/mo',
    color: 'from-blue-500 to-indigo-600',
    popular: true
  },
  {
    tier: 'Elite',
    price: '$3,997/mo',
    commission: '30%',
    monthly: '$1,199',
    clients10: '$11,990/mo',
    clients50: '$59,950/mo',
    color: 'from-orange-500 to-red-600'
  },
];

const salesAssets = [
  {
    icon: Target,
    title: 'Pitch Scripts',
    description: 'Ready-to-use scripts for every objection'
  },
  {
    icon: Zap,
    title: 'Demo Videos',
    description: '5-minute demos that close deals'
  },
  {
    icon: Award,
    title: 'Case Studies',
    description: 'Proven results from real businesses'
  },
  {
    icon: Users,
    title: 'Co-Branded Materials',
    description: 'Your brand + Local-Link credibility'
  },
];

const features = [
  'Instant lead response (< 1 min)',
  'Missed-call recovery',
  'Multi-step follow-ups',
  'Booking automation',
  'Review generation',
  'Industry-specific workflows',
  'CRM integration',
  'Custom AI agents (Elite)',
  'White-label options (Elite)',
  'Ongoing optimization',
];

export default function AutoScaleSalesPage() {
  return (
    <PartnerHubLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-full border border-orange-200">
            <DollarSign className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">High-Ticket Recurring Revenue</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900">
            Sell AutoScale™ & Earn Up to 30%
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            High-ticket AI automation system that helps businesses capture more leads, book more appointments,
            and grow faster. Earn recurring monthly commissions on every client.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span>Avg. deal size: $1,997/mo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>20-30% recurring commission</span>
            </div>
          </div>
        </div>

        {/* Commission Calculator */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Earning Potential</h2>

          <div className="grid lg:grid-cols-3 gap-6">
            {commissionTiers.map((tier) => (
              <div
                key={tier.tier}
                className={`bg-white rounded-xl p-6 border-2 ${
                  tier.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      Most Sold
                    </span>
                  </div>
                )}

                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-sm font-medium mb-4`}>
                  {tier.tier}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Client Pays:</span>
                    <span className="font-semibold text-gray-900">{tier.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Your Commission:</span>
                    <span className="font-semibold text-orange-600">{tier.commission}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium">You Earn:</span>
                      <span className="text-2xl font-bold text-gray-900">{tier.monthly}</span>
                    </div>
                    <span className="text-xs text-gray-500">per client/month</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">10 clients:</span>
                    <span className="font-semibold text-gray-900">{tier.clients10}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">50 clients:</span>
                    <span className="font-semibold text-green-600">{tier.clients50}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>All commissions are recurring — as long as the client stays subscribed, you keep earning.</p>
          </div>
        </div>

        {/* The Pitch */}
        <div className="bg-white rounded-2xl p-12 border-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">The Pitch (Copy & Use)</h2>

          <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-8 border border-blue-200">
            <p className="text-lg text-gray-800 leading-relaxed italic">
              "We install an AI follow-up and booking system that responds instantly, recovers missed calls,
              and keeps leads from falling through the cracks. You get more booked jobs without hiring."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{'< 1 min'}</div>
              <div className="text-sm text-gray-600">Lead response time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">+40%</div>
              <div className="text-sm text-gray-600">Lead capture increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Always working</div>
            </div>
          </div>
        </div>

        {/* Objection Handling */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Handle Every Objection</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">"I already have a CRM."</div>
              <div className="text-gray-600">→ "Great — we plug into it or work alongside it."</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">"AI sounds risky."</div>
              <div className="text-gray-600">→ "Everything is monitored + you can pause anytime."</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">"How fast will it work?"</div>
              <div className="text-gray-600">→ "Same day lead capture; compounding results weekly."</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">"That's expensive."</div>
              <div className="text-gray-600">→ "One extra booking per month pays for it. Most get 10+."</div>
            </div>
          </div>
        </div>

        {/* Sales Assets */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Everything You Need to Sell</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {salesAssets.map((asset) => (
              <div key={asset.title} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center mb-4">
                  <asset.icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{asset.title}</h3>
                <p className="text-sm text-gray-600">{asset.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features to Highlight */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What You're Selling</h2>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Minute Demo Flow */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The 5-Minute Demo</h2>

          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Missed Call</h3>
              <p className="text-sm text-gray-600">Show instant text-back</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Lead Flow</h3>
              <p className="text-sm text-gray-600">Show lead → book sequence</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Booking</h3>
              <p className="text-sm text-gray-600">Show booking link automation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reviews</h3>
              <p className="text-sm text-gray-600">Show review request (Growth)</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                5
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safety</h3>
              <p className="text-sm text-gray-600">Show monitor + circuit breaker</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Start Earning Recurring Commissions</h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            High-ticket, recurring revenue. Your clients grow, you earn monthly. Every month, every client.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Download Sales Kit
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-400 transition-all border-2 border-white/20">
              Watch Demo Video
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </PartnerHubLayout>
  );
}
