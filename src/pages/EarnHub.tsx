import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, MapPin, Sparkles, Users, ArrowRight, Zap,
  CheckCircle, TrendingUp, Shield, Star, ChevronDown, ChevronUp,
  Clock, Award, BarChart2, Briefcase
} from 'lucide-react';
import Button from '../components/ui/Button';
import { SEO } from '../components/SEO';

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    fee: 49,
    commission: '10%',
    commissionNum: 10,
    color: 'bg-slate-100 border-slate-200',
    headerColor: 'bg-slate-700',
    badge: null,
    description: 'Learn the system, make your first sales, build momentum.',
    perks: [
      'Partner dashboard & tracking',
      'Swipe file library',
      'AI outreach scripts',
      'Weekly commission payouts',
      'Community access',
    ],
    example: { merchants: 5, avgPlan: 249, result: 124 },
  },
  {
    id: 'growth',
    name: 'Growth',
    fee: 99,
    commission: '15%',
    commissionNum: 15,
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'bg-blue-600',
    badge: null,
    description: 'Serious about building a recurring income stream.',
    perks: [
      'Everything in Starter',
      'Territory protection (1 zip)',
      'Priority support channel',
      'Bonus on first 3 merchants',
      'Access to DFY ad vault',
    ],
    example: { merchants: 10, avgPlan: 299, result: 448 },
  },
  {
    id: 'pro',
    name: 'Pro',
    fee: 149,
    commission: '20%',
    commissionNum: 20,
    color: 'bg-[#2BB673]/5 border-[#2BB673]',
    headerColor: 'bg-[#2BB673]',
    badge: 'MOST POPULAR',
    description: 'Your primary income source. Run it like a business.',
    perks: [
      'Everything in Growth',
      'Territory protection (3 zips)',
      'Sub-partner override (7%)',
      'Monthly strategy call',
      'White-label pitch deck',
      'Featured on partner leaderboard',
    ],
    example: { merchants: 20, avgPlan: 349, result: 1397 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    fee: 299,
    commission: '25%',
    commissionNum: 25,
    color: 'bg-amber-50 border-amber-300',
    headerColor: 'bg-amber-500',
    badge: 'HIGHEST EARNINGS',
    description: 'Agency-level operator building a regional network.',
    perks: [
      'Everything in Pro',
      'Unlimited territory coverage',
      'Multi-level override network',
      'Dedicated account manager',
      'Custom training portal',
      'Co-branded marketing materials',
      'Volume bonuses',
    ],
    example: { merchants: 40, avgPlan: 349, result: 3490 },
  },
];

const FAQS = [
  {
    q: 'What exactly do I sell?',
    a: 'You help local businesses get on Local-Link — a platform that gets them customers, manages their CRM, tracks revenue, and prepares them for tax time. It replaces 4–5 tools they\'re already paying for. Most merchants see the value immediately.',
  },
  {
    q: 'How do I get paid?',
    a: 'You earn a percentage of every merchant\'s monthly subscription — recurring, every month they stay active. Plus flat bonuses on merchant services (payment processing, etc.). Payouts go out weekly via Stripe.',
  },
  {
    q: 'Do I need sales experience?',
    a: 'No. We give you AI scripts, pitch decks, objection-handling guides, and a full training course. Most top partners have zero sales background — they just follow the system.',
  },
  {
    q: 'Is there a territory lock?',
    a: 'Growth and above get protected territory so other partners can\'t poach your area. Pro partners get 3 zip codes, Enterprise get unlimited coverage.',
  },
  {
    q: 'Can I build a team under me?',
    a: 'Yes. Pro and Enterprise partners earn override commissions on partners they recruit. You build a downline and earn on their production too.',
  },
  {
    q: 'What if I\'m not ready to go full-time?',
    a: 'Start with Starter at $49/mo. Many partners begin part-time and scale up once they have 5–10 merchants. Your tier can be upgraded any time.',
  },
];

export default function EarnHub() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [calcMerchants, setCalcMerchants] = useState(10);
  const [calcTier, setCalcTier] = useState('pro');

  const tierData = TIERS.find(t => t.id === calcTier)!;
  const avgPlan = 299;
  const monthlyRecurring = Math.round(calcMerchants * avgPlan * (tierData.commissionNum / 100));
  const annualRecurring = monthlyRecurring * 12;

  return (
    <>
      <SEO
        title="Become a Partner — Earn Recurring Commissions | LocalLink"
        description="Help local businesses get customers, run their CRM, and track their finances. Earn 10–25% recurring commissions. No sales experience needed."
        keywords="partner program, recurring commissions, earn money, local business, affiliate program"
      />
      <div className="min-h-screen bg-white">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => navigate('/')}
                className="text-slate-700 hover:text-slate-900 font-semibold transition-colors"
              >
                LocalLink
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                >
                  Sign In
                </button>
                <Button onClick={() => navigate('/partners/apply')} size="sm">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="bg-slate-900 text-white py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#2BB673]/20 text-[#2BB673] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Partner Program — Open for Applications
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build a recurring income<br />
              <span className="text-[#2BB673]">helping local businesses win.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              You introduce local businesses to a platform that replaces their CRM,
              marketing tools, and accounting software. They pay monthly. You earn every month they stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => navigate('/partners/apply')}
                className="text-lg px-8"
              >
                Apply as Partner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button
                onClick={() => document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-slate-300 hover:text-white text-lg font-medium transition-colors"
              >
                See commission tiers →
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { label: 'Avg monthly earnings', value: '$1,200+' },
                { label: 'Commission rate', value: '10–25%' },
                { label: 'Recurring per merchant', value: 'Every month' },
                { label: 'Payout frequency', value: 'Weekly' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you're actually selling */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What you're selling</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Not software. Not a marketing tool. You're selling the answer to 4 problems every local business owner has.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  icon: Users,
                  color: 'bg-[#2BB673]/10 text-[#2BB673]',
                  problem: 'Need more customers',
                  solution: 'Marketplace exposure, postcard ads, community deals — customers find them and book.',
                },
                {
                  icon: BarChart2,
                  color: 'bg-blue-100 text-blue-600',
                  problem: 'Losing track of leads',
                  solution: 'CRM is included — contacts, pipeline, follow-up automation. No extra cost.',
                },
                {
                  icon: DollarSign,
                  color: 'bg-amber-100 text-amber-600',
                  problem: 'Messy finances',
                  solution: 'Revenue tracking and CPA-ready reports built in. Know your numbers every month.',
                },
                {
                  icon: Clock,
                  color: 'bg-rose-100 text-rose-600',
                  problem: 'No time to manage it all',
                  solution: 'AI handles follow-ups, review requests, booking confirmations, and more — automatically.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.problem} className="bg-white rounded-xl border border-slate-200 p-6 flex gap-4">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Business owner problem
                      </div>
                      <div className="font-bold text-slate-900 mb-2">{item.problem}</div>
                      <div className="text-sm text-slate-600">{item.solution}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
              <p className="text-xl font-semibold mb-2">Your pitch in one sentence:</p>
              <p className="text-2xl md:text-3xl font-bold text-[#2BB673] leading-tight">
                "We help local businesses get customers, manage them,<br className="hidden md:block" />
                and know their numbers — all in one place."
              </p>
            </div>
          </div>
        </section>

        {/* Commission Tiers */}
        <section id="tiers" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Partner Tiers</h2>
              <p className="text-lg text-slate-600">
                Start where you are. Upgrade as you grow. Your commission rate rises with your tier.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`rounded-2xl border-2 overflow-hidden ${tier.color} flex flex-col`}
                >
                  {/* Card header */}
                  <div className={`${tier.headerColor} text-white p-5`}>
                    {tier.badge && (
                      <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full inline-block mb-3">
                        {tier.badge}
                      </div>
                    )}
                    <div className="text-2xl font-bold">{tier.name}</div>
                    <div className="text-4xl font-bold mt-1">
                      {tier.commission}
                      <span className="text-base font-normal opacity-80 ml-1">recurring</span>
                    </div>
                    <div className="text-sm opacity-80 mt-1">${tier.fee}/mo partner fee</div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-slate-600 mb-4">{tier.description}</p>

                    <ul className="space-y-2 flex-1">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-[#2BB673] flex-shrink-0 mt-0.5" />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 pt-4 border-t border-slate-200">
                      <div className="text-xs text-slate-500 mb-1">Example: {tier.example.merchants} merchants</div>
                      <div className="text-lg font-bold text-slate-900">
                        ${tier.example.result.toLocaleString()}/mo
                      </div>
                      <div className="text-xs text-slate-500">recurring commission</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-slate-500">
              All tiers include: Partner dashboard, commission tracking, swipe files, AI scripts, and weekly payouts.
              Partner fee is separate from merchant subscriptions — you earn on merchant fees, not your own.
            </p>
          </div>
        </section>

        {/* Earnings Calculator */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Earnings Calculator</h2>
              <p className="text-lg text-slate-600">See what your book of business could look like.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Your Partner Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIERS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setCalcTier(t.id)}
                        className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                          calcTier === t.id
                            ? 'border-[#2BB673] bg-[#2BB673]/10 text-[#2BB673]'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {t.name} ({t.commission})
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Active Merchants: <span className="text-[#2BB673]">{calcMerchants}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={calcMerchants}
                    onChange={(e) => setCalcMerchants(Number(e.target.value))}
                    className="w-full accent-[#2BB673]"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Based on avg merchant plan of ${avgPlan}/mo (Standard tier)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2BB673]/10 rounded-xl p-5 text-center">
                  <div className="text-sm text-slate-600 mb-1">Monthly recurring</div>
                  <div className="text-4xl font-bold text-[#2BB673]">
                    ${monthlyRecurring.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {calcMerchants} merchants × ${avgPlan} × {tierData.commissionNum}%
                  </div>
                </div>
                <div className="bg-slate-100 rounded-xl p-5 text-center">
                  <div className="text-sm text-slate-600 mb-1">Annual projection</div>
                  <div className="text-4xl font-bold text-slate-900">
                    ${annualRecurring.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">If merchants stay 12 months</div>
                </div>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Bonus revenue:</strong> Earn an additional $150–$500 flat per merchant that activates
                payment processing. At 10 merchants, that's $1,500–$5,000 in one-time bonuses on top of recurring.
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
              <p className="text-lg text-slate-600">5 steps from application to first paycheck.</p>
            </div>

            <div className="space-y-6">
              {[
                { step: '01', icon: Briefcase, title: 'Apply & get approved', desc: 'Fill out a short application. We review and approve most partners within 24 hours.' },
                { step: '02', icon: Award, title: 'Complete onboarding training', desc: 'Our Partner Accelerator course walks you through the pitch, objections, onboarding flow, and first sale.' },
                { step: '03', icon: MapPin, title: 'Pick your territory', desc: 'Lock in your zip codes (Growth tier and above) so no other partner can compete in your area.' },
                { step: '04', icon: Zap, title: 'Use AI scripts to reach out', desc: 'Our AI generates personalized outreach for any business type — restaurants, salons, gyms, trades, and more.' },
                { step: '05', icon: TrendingUp, title: 'Earn every month they stay', desc: 'Every merchant you bring on pays you recurring. The more you build, the more you make — month after month.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#2BB673] text-white rounded-2xl flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex-1 flex gap-4">
                      <Icon className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                        <div className="text-sm text-slate-600">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: 'Territory protection', desc: 'Growth+ partners get exclusive zip codes. No competing with other partners in your area.' },
                { icon: Star, title: 'Weekly payouts', desc: 'Commissions are processed weekly via Stripe. No waiting 30–60 days like other programs.' },
                { icon: Users, title: 'Team override income', desc: 'Pro+ partners earn on their downline. Build a team and earn on every sale they make too.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                    <div className="w-12 h-12 bg-[#2BB673]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-[#2BB673]" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Common questions</h2>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#2BB673]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to build your recurring income?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join the partner program today. Your first merchant could be earning you commissions within the week.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/partners/apply')}
              className="bg-white text-[#2BB673] hover:bg-slate-50 text-lg px-10 py-4 font-bold"
            >
              Apply as Partner
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-white/70 text-sm mt-6">
              Application takes 5 minutes. Approval within 24 hours.
            </p>
          </div>
        </section>

        <footer className="bg-slate-900 text-slate-400 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p>&copy; 2026 LocalLink Marketplace. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
