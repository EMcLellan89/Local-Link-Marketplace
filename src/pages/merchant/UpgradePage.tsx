import { useState, useEffect } from 'react';
import {
  Check, Sparkles, Zap, Crown, ArrowRight, Shield,
  Users, Bot, BarChart3, Mail, Star, Headphones,
  TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface SubscriptionTier {
  id: string;
  name: string;
  monthly_price: string;
  postcard_placement: string;
  features: string[];
  is_active: boolean;
}

interface Merchant {
  id: string;
  subscription_plan: string | null;
}

const TIER_META: Record<string, {
  icon: typeof Crown;
  gradient: string;
  accentColor: string;
  badge: string | null;
  badgeClass: string;
  recommended: boolean;
  description: string;
  highlight: string;
}> = {
  starter: {
    icon: Shield,
    gradient: 'from-slate-600 to-slate-700',
    accentColor: 'slate',
    badge: 'GET STARTED',
    badgeClass: 'bg-slate-100 text-slate-700',
    recommended: false,
    description: 'Everything you need to launch and start attracting local customers.',
    highlight: '500 contacts',
  },
  founders: {
    icon: Sparkles,
    gradient: 'from-blue-500 to-blue-700',
    accentColor: 'blue',
    badge: 'FOUNDERS RATE',
    badgeClass: 'bg-blue-100 text-blue-700',
    recommended: false,
    description: 'Locked-for-life pricing for early adopters. Never pay more.',
    highlight: '2,500 contacts',
  },
  standard: {
    icon: Zap,
    gradient: 'from-[#2BB673] to-[#1e9e60]',
    accentColor: 'green',
    badge: 'MOST POPULAR',
    badgeClass: 'bg-[#2BB673]/10 text-[#2BB673]',
    recommended: true,
    description: 'Full business suite for growing businesses ready to scale.',
    highlight: '10,000 contacts',
  },
  premium: {
    icon: Crown,
    gradient: 'from-amber-500 to-orange-600',
    accentColor: 'amber',
    badge: 'BEST VALUE',
    badgeClass: 'bg-amber-100 text-amber-700',
    recommended: false,
    description: 'Enterprise-grade tools with unlimited power and white-label options.',
    highlight: 'Unlimited contacts',
  },
};

const COMPARISON_FEATURES = [
  { label: 'CRM Contacts', starter: '500', founders: '2,500', standard: '10,000', premium: 'Unlimited' },
  { label: 'Team Members', starter: '2', founders: '5', standard: '15', premium: 'Unlimited' },
  { label: 'Email Marketing', starter: false, founders: true, standard: true, premium: true },
  { label: 'SMS Marketing', starter: false, founders: false, standard: true, premium: true },
  { label: 'AI Tools & Automation', starter: false, founders: false, standard: true, premium: true },
  { label: 'A/B Testing', starter: false, founders: false, standard: true, premium: true },
  { label: 'White-label CRM', starter: false, founders: false, standard: false, premium: true },
  { label: 'API Access', starter: false, founders: false, standard: false, premium: true },
  { label: 'Dedicated Account Manager', starter: false, founders: false, standard: false, premium: true },
  { label: 'Books Accounting', starter: 'Lite', founders: 'Pro', standard: 'Pro', premium: 'Pro' },
  { label: 'Marketplace Listing', starter: 'Basic', founders: 'Enhanced', standard: 'Priority', premium: 'Top Placement' },
  { label: 'Support Level', starter: 'Email', founders: 'Priority', standard: 'Priority', premium: '24/7 Dedicated' },
];

const INCLUDED_FEATURES = [
  { icon: Users, title: 'CRM & Pipeline', desc: 'Track leads, contacts, and deals in one place' },
  { icon: Bot, title: 'AI Bots & Automations', desc: '24/7 customer engagement on autopilot' },
  { icon: Mail, title: 'Email Marketing', desc: 'Send campaigns and drip sequences' },
  { icon: Star, title: 'Review Management', desc: 'Monitor and respond to customer reviews' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track performance and growth metrics' },
  { icon: TrendingUp, title: 'Marketplace Listing', desc: 'Be found by local customers' },
  { icon: Headphones, title: 'Support Team', desc: 'Real humans ready to help you succeed' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security, 99.9% uptime' },
];

const FAQS = [
  { q: 'Can I change plans later?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle. Founders members keep their locked rate permanently.' },
  { q: 'Is there a free trial?', a: 'We offer a 14-day free trial on all plans. No credit card required to start.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, ACH bank transfers, and checks for annual plans.' },
  { q: 'What happens to my data if I cancel?', a: 'Your data is yours. You can export everything at any time. We keep your account active for 30 days after cancellation so you can retrieve your data.' },
  { q: 'Do you offer annual billing?', a: 'Yes! Annual billing saves you 2 months — pay for 10, get 12. Contact support to switch to annual.' },
];

export default function UpgradePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    try {
      const [tiersResult, merchantResult] = await Promise.allSettled([
        supabase.from('subscription_tiers').select('*').eq('is_active', true).order('monthly_price'),
        profile
          ? supabase.from('merchants').select('id, subscription_plan').eq('user_id', profile.id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      if (tiersResult.status === 'fulfilled' && tiersResult.value.data?.length) {
        setTiers(tiersResult.value.data);
      }
      if (merchantResult.status === 'fulfilled' && (merchantResult.value as any).data) {
        setMerchant((merchantResult.value as any).data);
      }
    } catch {
      // silently continue with empty state
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (tier: SubscriptionTier) => {
    if (!merchant) {
      navigate('/merchant/onboarding');
      return;
    }
    const slug = tier.name.toLowerCase().replace(/\s+/g, '_');
    navigate(`/merchant/tier-upgrade/checkout?tier=${slug}`);
  };

  const formatPrice = (cents: string) => (Number(cents) / 100).toFixed(0);

  const isCurrentPlan = (tierName: string) =>
    merchant?.subscription_plan?.toLowerCase() === tierName.toLowerCase();

  const cleanFeatures = (features: string[]) =>
    features.filter((f) => f.startsWith('✓')).map((f) => f.replace(/^✓\s*/, ''));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-[#2BB673] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 text-sm">Loading plans...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-16 pb-16">

        {/* Hero */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2BB673]/10 text-[#2BB673] rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Merchant Membership Plans
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Choose the plan that<br className="hidden sm:block" /> fits your business
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Everything you need to attract customers, run operations, and grow — all in one platform.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const key = tier.name.toLowerCase();
            const meta = TIER_META[key] ?? TIER_META.starter;
            const Icon = meta.icon;
            const current = isCurrentPlan(tier.name);
            const features = cleanFeatures(tier.features);

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl border transition-all duration-200
                  ${meta.recommended
                    ? 'border-[#2BB673] shadow-xl shadow-[#2BB673]/10 ring-2 ring-[#2BB673]/30'
                    : 'border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                  }
                  bg-white overflow-hidden`}
              >
                {meta.recommended && (
                  <div className="bg-[#2BB673] text-white text-xs font-bold text-center py-2 tracking-wider">
                    RECOMMENDED
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {meta.badge && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${meta.badgeClass}`}>
                        {meta.badge}
                      </span>
                    )}
                  </div>

                  {/* Name + description */}
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{tier.name}</h3>
                  <p className="text-sm text-slate-500 mb-5 leading-relaxed">{meta.description}</p>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-slate-900">${formatPrice(tier.monthly_price)}</span>
                      <span className="text-slate-500 text-sm mb-1.5">/mo</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Billed monthly · Cancel anytime</p>
                  </div>

                  {/* CTA */}
                  {current ? (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold text-center mb-6">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelect(tier)}
                      className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all mb-6
                        ${meta.recommended
                          ? 'bg-[#2BB673] hover:bg-[#25a062] text-white shadow-lg shadow-[#2BB673]/30 hover:shadow-[#2BB673]/40'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Highlight */}
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Includes
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {features.slice(0, 6).map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${meta.recommended ? 'text-[#2BB673]' : 'text-slate-400'}`} />
                        {f}
                      </li>
                    ))}
                    {features.length > 6 && (
                      <li className="text-xs text-slate-400 pl-6.5">+{features.length - 6} more features</li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compare plans toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-5 py-2.5 rounded-full transition-all"
          >
            {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showComparison ? 'Hide' : 'View'} full comparison table
          </button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-700 bg-slate-50 w-48">Feature</th>
                  {tiers.map((tier) => {
                    const key = tier.name.toLowerCase();
                    const meta = TIER_META[key] ?? TIER_META.starter;
                    return (
                      <th key={tier.id} className={`p-4 font-bold text-center ${meta.recommended ? 'bg-[#2BB673]/5 text-[#2BB673]' : 'bg-slate-50 text-slate-700'}`}>
                        {tier.name}
                        <div className="text-xs font-normal text-slate-500">${formatPrice(tier.monthly_price)}/mo</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="p-4 font-medium text-slate-700">{row.label}</td>
                    {(['starter', 'founders', 'standard', 'premium'] as const).map((key) => {
                      const val = row[key];
                      const isRecommended = key === 'standard';
                      return (
                        <td key={key} className={`p-4 text-center ${isRecommended ? 'bg-[#2BB673]/5' : ''}`}>
                          {typeof val === 'boolean' ? (
                            val
                              ? <Check className="w-4 h-4 text-[#2BB673] mx-auto" />
                              : <span className="block w-4 h-0.5 bg-slate-200 mx-auto rounded" />
                          ) : (
                            <span className="text-slate-700">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Everything included strip */}
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Everything included in every plan</h2>
          <p className="text-slate-400 text-center text-sm mb-8">No hidden fees. No feature gating on core tools.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {INCLUDED_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[#2BB673]" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">{title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800 text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-br from-[#2BB673]/5 to-[#2BB673]/10 rounded-2xl p-10 border border-[#2BB673]/20">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to grow your business?</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => tiers.find(t => t.name.toLowerCase() === 'standard') && handleSelect(tiers.find(t => t.name.toLowerCase() === 'standard')!)}
              className="px-8 py-3 bg-[#2BB673] hover:bg-[#25a062] text-white font-semibold rounded-xl shadow-lg shadow-[#2BB673]/25 transition-all hover:shadow-[#2BB673]/40"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/merchant/dashboard')}
              className="px-8 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
