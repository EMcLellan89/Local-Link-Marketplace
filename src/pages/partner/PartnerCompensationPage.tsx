import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, TrendingUp, Users, Award, ChevronDown, ChevronUp,
  CheckCircle, ArrowRight, Repeat, Star, Zap, Shield
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getTierFee, getTierRate } from '../../lib/commissionV2';
import type { PartnerTier } from '../../lib/commissionV2';

const TIERS: { id: PartnerTier; label: string; badge?: string }[] = [
  { id: 'starter',    label: 'Starter' },
  { id: 'growth',     label: 'Growth' },
  { id: 'pro',        label: 'Pro',        badge: 'Most Popular' },
  { id: 'enterprise', label: 'Enterprise', badge: 'Max Earnings' },
];

interface StreamRow {
  label: string;
  type: string;
  rate: string;
  recurring: boolean;
  notes: string;
  icon: React.ReactNode;
}

const INCOME_STREAMS: StreamRow[] = [
  {
    label: 'Partner Recruit Bonus',
    type: 'One-Time',
    rate: '10–25% of first month fee',
    recurring: false,
    notes: 'Earn your tier rate on the first month paid by any partner you personally recruit.',
    icon: <Users className="w-5 h-5 text-amber-500" />,
  },
  {
    label: 'Merchant Membership Commission',
    type: 'First Month Only',
    rate: '10–25% of plan price',
    recurring: false,
    notes: 'Earn your tier rate on the first month when a merchant signs up through your link. Not recurring.',
    icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
  },
  {
    label: 'Marketplace Product Sales',
    type: 'Per Sale / Recurring',
    rate: '10–25% tier rate',
    recurring: true,
    notes: 'Earn your tier rate on every marketplace product sale. Recurring products pay monthly for as long as the merchant stays active.',
    icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
  },
  {
    label: '1Hub CRM / CPA',
    type: 'Recurring Monthly',
    rate: '30% flat (all tiers)',
    recurring: true,
    notes: '1Hub CRM pays 30% every month regardless of your tier — our highest recurring commission. No tier requirement.',
    icon: <Repeat className="w-5 h-5 text-green-600" />,
  },
  {
    label: 'Recruit Override',
    type: 'Recurring Monthly',
    rate: '7% on recruit sales',
    recurring: true,
    notes: 'Earn 7% on all commissionable sales made by partners you directly recruited. Passive income, 1 level deep.',
    icon: <Zap className="w-5 h-5 text-rose-500" />,
  },
];

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: 'Are merchant membership commissions really first-month only?',
    a: 'Yes. When a merchant signs up for a Local-Link plan through your referral, you earn your tier rate on their first payment. After that, you earn recurring commissions on any marketplace products or 1Hub CRM they buy — which is where the real recurring income lives.',
  },
  {
    q: 'What makes 1Hub CRM different from regular marketplace commissions?',
    a: '1Hub CRM pays 30% recurring every month, regardless of your partner tier. This is higher than the standard tier rates and is designed to reward partners who actively help merchants adopt their CRM — the sticky product that drives long-term value.',
  },
  {
    q: 'Does my recruit override stack on top of my base commission?',
    a: 'Yes. If your direct recruit makes a sale, they earn their full base commission and you separately earn a 7% override on that same sale. There is no double-counting — both are paid.',
  },
  {
    q: 'When do I get paid?',
    a: 'Commissions are processed weekly. Recruit bonuses and first-month merchant commissions have a 30-day hold for refund protection. Marketplace product and 1Hub commissions have a 14-day hold. Recruit overrides are paid the same cycle as the underlying commission.',
  },
  {
    q: 'Can I upgrade my tier later?',
    a: 'Yes. You can upgrade at any time. Your commission rate increases immediately on new sales. Your existing recurring commissions are grandfathered at the rate they were earned.',
  },
  {
    q: 'What products are NOT commissionable?',
    a: 'Academy education access, Deals/Offers features, basic Analytics, and built-in Invoicing features are not commissionable. Everything else in the marketplace is.',
  },
];

export default function PartnerCompensationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [calcTier, setCalcTier] = useState<PartnerTier>('pro');
  const [merchantsPerMonth, setMerchantsPerMonth] = useState(4);
  const [avgProductSales, setAvgProductSales] = useState(300);
  const [recruitsPerMonth, setRecruitPerMonth] = useState(2);
  const [onehubMerchants, setOnehubMerchants] = useState(5);

  const rate = getTierRate(calcTier);
  const fee = getTierFee(calcTier);

  const merchantMembershipRevenue = merchantsPerMonth * fee * rate;
  const productRevenue = avgProductSales * rate;
  const onehubRevenue = onehubMerchants * 149 * 0.30;
  const recruitBonus = recruitsPerMonth * fee * rate;
  const overrideRevenue = (productRevenue * recruitsPerMonth) * 0.07;
  const totalMonthly = merchantMembershipRevenue + productRevenue + onehubRevenue + recruitBonus + overrideRevenue;
  const netMonthly = totalMonthly - fee;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10 pb-16">

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-1.5 mb-4">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">Partner Compensation Plan</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Build Real Recurring Income<br />
              <span className="text-emerald-400">Helping Local Businesses Grow</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              Five distinct income streams. One platform. No gimmicks.
              Every commission is earned by delivering real value to local businesses — and the structure
              rewards you more as you grow.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/partner/billing"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#calculator"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Calculate My Earnings
              </a>
            </div>
          </div>
        </div>

        {/* Tier Overview */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Tier</h2>
          <p className="text-slate-600 mb-6">
            Your monthly membership unlocks tools, territories, and your commission rate. Higher tier = higher percentage on every sale.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TIERS.map(t => {
              const pct = Math.round(getTierRate(t.id) * 100);
              const mFee = getTierFee(t.id);
              return (
                <div key={t.id} className={`rounded-xl border-2 p-5 relative ${
                  t.id === 'pro' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'
                }`}>
                  {t.badge && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      t.id === 'pro' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
                    }`}>
                      {t.badge}
                    </span>
                  )}
                  <p className="font-bold text-slate-900 text-lg">{t.label}</p>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-1">{pct}%</p>
                  <p className="text-sm text-slate-500">commission rate</p>
                  <p className="text-sm font-semibold text-slate-700 mt-3">${mFee}/mo</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            * 1Hub CRM/CPA pays 30% recurring for all tiers — not affected by tier rate.
          </p>
        </div>

        {/* Income Streams */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">5 Income Streams</h2>
          <p className="text-slate-600 mb-6">
            Each stream is designed to reward a different activity — signing merchants, growing their tool stack, or building a team.
          </p>
          <div className="space-y-4">
            {INCOME_STREAMS.map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{s.label}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      s.recurring
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.recurring ? 'Recurring' : 'One-Time'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 mb-1">{s.rate}</p>
                  <p className="text-sm text-slate-600">{s.notes}</p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{s.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timing & Payout Rules */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-bold text-slate-900">Payout Timing & Refund Windows</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 text-slate-700 font-semibold">Commission Type</th>
                  <th className="text-center py-2 px-3 text-slate-700 font-semibold">Hold Period</th>
                  <th className="text-center py-2 px-3 text-slate-700 font-semibold">Refund Window</th>
                  <th className="text-center py-2 px-3 text-slate-700 font-semibold">Recurring?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { label: 'Partner Recruit Bonus',           hold: '30 days', refund: '30 days', rec: false },
                  { label: 'Merchant Membership (1st month)', hold: '30 days', refund: '30 days', rec: false },
                  { label: 'Marketplace Product',             hold: '14 days', refund: '14 days', rec: true  },
                  { label: '1Hub CRM / CPA',                  hold: 'None',    refund: 'None',    rec: true  },
                  { label: 'Recruit Override',                hold: 'None',    refund: 'None',    rec: true  },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-4 text-slate-800">{row.label}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{row.hold}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{row.refund}</td>
                    <td className="py-2.5 px-3 text-center">
                      {row.rec
                        ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                        : <span className="text-slate-400 text-xs">—</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Commissions are processed every Friday. Held commissions release automatically after the hold period if no refund/chargeback is recorded.
          </p>
        </div>

        {/* Earnings Calculator */}
        <div id="calculator" className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">Earnings Estimator</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Tier</label>
                <div className="grid grid-cols-2 gap-2">
                  {TIERS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setCalcTier(t.id)}
                      className={`rounded-lg border-2 py-2.5 px-3 text-sm font-semibold transition-all ${
                        calcTier === t.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {t.label} ({Math.round(getTierRate(t.id) * 100)}%) — ${getTierFee(t.id)}/mo
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: 'New merchants signed/month', value: merchantsPerMonth, setter: setMerchantsPerMonth, min: 0, max: 50 },
                { label: 'Avg monthly marketplace sales ($)', value: avgProductSales, setter: setAvgProductSales, min: 0, max: 5000 },
                { label: 'Active 1Hub CRM merchants', value: onehubMerchants, setter: setOnehubMerchants, min: 0, max: 50 },
                { label: 'New partner recruits/month', value: recruitsPerMonth, setter: setRecruitPerMonth, min: 0, max: 20 },
              ].map(({ label, value, setter, min, max }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-slate-700">{label}</label>
                    <span className="text-sm font-bold text-slate-900">{value}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={e => setter(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="bg-slate-900 rounded-xl p-6 text-white flex flex-col">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Monthly Breakdown</p>
              <div className="space-y-3 flex-1">
                {[
                  { label: 'Merchant Membership Commissions', value: merchantMembershipRevenue, note: 'first month' },
                  { label: 'Marketplace Product Sales', value: productRevenue, note: 'recurring' },
                  { label: '1Hub CRM (30% recurring)', value: onehubRevenue, note: 'recurring' },
                  { label: 'Partner Recruit Bonuses', value: recruitBonus, note: 'one-time' },
                  { label: 'Recruit Override (7%)', value: overrideRevenue, note: 'recurring' },
                ].map(({ label, value, note }) => (
                  <div key={label} className="flex justify-between items-center py-1 border-b border-slate-700/50">
                    <div>
                      <p className="text-sm text-slate-300">{label}</p>
                      <p className="text-xs text-slate-500">{note}</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-400">${value.toFixed(0)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 text-sm">Gross Monthly</span>
                  <span className="font-bold text-white">${totalMonthly.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-400 text-sm">Membership Fee</span>
                  <span className="text-slate-400 text-sm">− ${fee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Net Monthly</span>
                  <span className={`text-2xl font-extrabold ${netMonthly >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${netMonthly.toFixed(0)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Annual estimate: ${(netMonthly * 12).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Estimates are illustrative. Actual results depend on your activity, market, and product mix. Recurring streams compound over time as your book of business grows.
          </p>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Build Your Business?</h2>
          <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
            Pick your tier, set your territory, and start earning on every merchant you bring onto the platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/partner/billing"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Choose My Tier <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/partner/dashboard"
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-lg hover:border-white transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
