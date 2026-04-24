import { Link } from 'react-router-dom';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import {
  Phone, Mail, MessageSquare, Zap, ArrowRight, CheckCircle,
  Mic, Bot, Clock, Shield
} from 'lucide-react';

const FEATURES = [
  {
    icon: Phone,
    title: 'AI Voice Calling (Retell)',
    desc: 'Automated outbound calling for merchant follow-ups, appointment reminders, and lead qualification — powered by Retell AI.',
    badge: 'AI-Powered',
    badgeColor: 'bg-blue-100 text-blue-700',
    action: null,
  },
  {
    icon: Mail,
    title: 'Email Outreach (Brevo)',
    desc: 'Send professional, branded email sequences to prospects and merchants. Includes templates, tracking, and automation.',
    badge: 'Included',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    action: null,
  },
  {
    icon: MessageSquare,
    title: 'SMS Campaigns',
    desc: 'Reach merchants and prospects via text. High open rates, direct responses, and two-way conversation support.',
    badge: 'Included',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    action: null,
  },
  {
    icon: Bot,
    title: 'AI Chat Sequences',
    desc: 'Automated follow-up sequences that nurture leads from first touch to signed merchant — without any manual effort.',
    badge: 'Coming Soon',
    badgeColor: 'bg-amber-100 text-amber-700',
    action: null,
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    desc: 'Perfect for partners just getting started.',
    features: [
      '500 emails/month',
      '250 SMS messages',
      'Email templates library',
      'Basic tracking',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$97',
    period: '/mo',
    desc: 'For partners actively growing their territory.',
    features: [
      'Unlimited emails',
      '1,000 SMS messages',
      '50 AI voice calls/month',
      'Advanced automation',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$197',
    period: '/mo',
    desc: 'For high-volume partners with multiple territories.',
    features: [
      'Unlimited everything',
      'Dedicated AI agent',
      'Custom integrations',
      'White-label options',
      'Dedicated success manager',
    ],
    cta: 'Contact Us',
    highlight: false,
  },
];

export default function PartnerCommunicationsPage() {
  return (
    <PartnerHubLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Communications Hub</h1>
          <p className="text-slate-500 mt-1">Multi-channel outreach tools built for partner success.</p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-[#2BB673] transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-[#2BB673] group-hover:text-white text-[#2BB673] transition-colors">
                  <f.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${f.badgeColor}`}>{f.badge}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Clock, label: 'Avg Response Time', value: '< 2 min', desc: 'AI-assisted responses' },
            { icon: Shield, label: 'Delivery Rate', value: '98.4%', desc: 'Email & SMS combined' },
            { icon: Zap, label: 'Open Rate', value: '44%', desc: 'Avg across partner accounts' },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-center">
              <s.icon className="w-6 h-6 text-[#2BB673] mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm font-medium text-slate-700">{s.label}</p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map(p => (
              <div
                key={p.name}
                className={`rounded-xl border p-6 relative ${p.highlight ? 'border-[#2BB673] bg-emerald-50 shadow-lg' : 'border-slate-200 bg-white'}`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#2BB673] text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <h3 className="font-semibold text-slate-900">{p.name}</h3>
                <div className="flex items-baseline gap-0.5 mt-2 mb-1">
                  <span className="text-3xl font-bold text-slate-900">{p.price}</span>
                  <span className="text-slate-500 text-sm">{p.period}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{p.desc}</p>
                <ul className="space-y-2 mb-6">
                  {p.features.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-[#2BB673] flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/partner/communications/checkout"
                  className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    p.highlight
                      ? 'bg-[#2BB673] text-white hover:bg-[#22995f]'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold text-lg">Ready to automate your outreach?</h3>
            <p className="text-slate-400 text-sm mt-1">Partners using the Communications Hub close 2.4x more merchants.</p>
          </div>
          <Link
            to="/partner/communications/checkout"
            className="flex items-center gap-2 bg-[#2BB673] text-white px-5 py-2.5 rounded-lg hover:bg-[#22995f] font-medium text-sm transition-colors"
          >
            Activate Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PartnerHubLayout>
  );
}
