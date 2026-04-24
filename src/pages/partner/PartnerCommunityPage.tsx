import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Star, TrendingUp, DollarSign, Users, Package,
  ChevronRight, CheckCircle, Zap, Target, Award, ArrowRight, Copy, Check
} from 'lucide-react';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';

const COMMUNITY_PACKAGES = [
  {
    id: 'basic-event-listing',
    name: 'Basic Event Listing',
    price: 49,
    recurring: false,
    commission: 30,
    description: 'Post one community event for a merchant. Visible on the community calendar for 30 days.',
    features: ['Community calendar listing', '30-day visibility', 'Event page with business link', 'RSVP tracking'],
    color: 'bg-slate-50 border-slate-200',
    highlight: false,
  },
  {
    id: 'featured-event',
    name: 'Featured Event',
    price: 99,
    recurring: false,
    commission: 30,
    description: 'Featured event placement at the top of the community calendar with highlighted card design.',
    features: ['Top of calendar placement', 'Featured badge', 'Highlighted card design', 'Priority RSVP emails', 'Promo code integration'],
    color: 'bg-amber-50 border-amber-200',
    highlight: false,
  },
  {
    id: 'community-presence',
    name: 'Community Presence',
    price: 199,
    recurring: true,
    commission: 30,
    description: 'Monthly package — unlimited event postings plus homepage placement every week.',
    features: ['Unlimited monthly events', 'Homepage spotlight rotation', 'Category sponsorship', 'Analytics dashboard', 'Monthly performance report'],
    color: 'bg-[#2BB673]/5 border-[#2BB673]/30',
    highlight: true,
  },
  {
    id: 'homepage-sponsor',
    name: 'Homepage Sponsor',
    price: 499,
    recurring: true,
    commission: 25,
    description: 'Permanent homepage banner + featured business section on the community landing page.',
    features: ['Permanent homepage banner', 'Featured business spotlight', 'Pinned events at top', 'Custom event graphics', 'Lead capture integration'],
    color: 'bg-blue-50 border-blue-200',
    highlight: false,
  },
  {
    id: 'category-sponsor',
    name: 'Category Sponsor',
    price: 299,
    recurring: true,
    commission: 25,
    description: 'Own a category on the community page — every listing in that category shows your merchant first.',
    features: ['Category ownership badge', 'First position in category', 'Category email newsletter', 'Monthly category analytics', 'Exclusive category branding'],
    color: 'bg-slate-50 border-slate-200',
    highlight: false,
  },
  {
    id: 'seasonal-campaign',
    name: 'Seasonal Campaign',
    price: 399,
    recurring: false,
    commission: 30,
    description: 'Full seasonal campaign package: holiday promotions, events, and community tie-ins for 90 days.',
    features: ['90-day campaign window', '3 featured event slots', 'Seasonal banner placement', 'Social media amplification', 'Email blast to community members'],
    color: 'bg-rose-50 border-rose-200',
    highlight: false,
  },
];

const PITCH_SCRIPTS = [
  {
    title: 'Restaurant Owner Opening',
    script: `"Hey [Name], I noticed you've been doing some great things at [Business]. I work with a local business platform that helps businesses like yours get more visibility in the community — not just through discounts but through actual events and community presence. For example, if you did a wine tasting night or a chef's table, we can put it on the community calendar where thousands of locals actively look for things to do. Would that be worth a 15-minute call?"`,
  },
  {
    title: 'Service Business Cold Outreach',
    script: `"Hi [Name], I help local service businesses get more customers through community events — not just ads. Lots of people are looking for businesses like yours through our community calendar. For about $49 you can post an event — like a free consultation day, a workshop, or a community open house — and get real leads from people already interested in your area. Want me to show you what other businesses in your category are doing?"`,
  },
  {
    title: 'Upgrade Pitch (Basic to Community Presence)',
    script: `"You've already had success with your event listing — you got [X] RSVPs. Imagine if you had that visibility every single week with unlimited events, homepage rotation, and a monthly report showing exactly how many people are seeing your business. That's what the Community Presence package does for $199/month. Want to lock it in?"`,
  },
];

export default function PartnerCommunityPage() {
  const navigate = useNavigate();
  const [copiedScript, setCopiedScript] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'packages' | 'scripts' | 'howItWorks'>('packages');

  const copyScript = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(index);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <PartnerHubLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#2BB673]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[#2BB673] mb-3">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Community Revenue Channel</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">Sell Community Visibility</h1>
            <p className="text-slate-300 text-lg max-w-2xl mb-6">
              Your merchants want more than a discount page. They want a community presence. Help them get found through events, sponsorships, and local calendar listings — and earn recurring commissions doing it.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-lg">
              {[
                { label: 'Avg Commission', value: '28%' },
                { label: 'Recurring Packages', value: '3' },
                { label: 'Avg MRR per Merchant', value: '$60' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          {(['packages', 'scripts', 'howItWorks'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#2BB673] text-[#2BB673]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'packages' ? 'Packages to Sell' : tab === 'scripts' ? 'Pitch Scripts' : 'How It Works'}
            </button>
          ))}
        </div>

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <p className="text-slate-600">
              These are the community packages you can sell to any merchant. Present them as a way to grow community visibility — not just run discounts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {COMMUNITY_PACKAGES.map(pkg => (
                <div
                  key={pkg.id}
                  className={`border rounded-2xl p-5 relative ${pkg.color} ${pkg.highlight ? 'ring-2 ring-[#2BB673]' : ''}`}
                >
                  {pkg.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2BB673] text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-900">{pkg.name}</h3>
                    {pkg.recurring && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        Recurring
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-slate-900">${pkg.price}</span>
                    <span className="text-slate-500 text-sm">{pkg.recurring ? '/mo' : ' one-time'}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{pkg.description}</p>
                  <ul className="space-y-1.5 mb-4">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-[#2BB673] mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Your commission
                    </div>
                    <div className="text-sm font-bold text-[#2BB673]">
                      {pkg.commission}% = ${Math.round(pkg.price * pkg.commission / 100)}{pkg.recurring ? '/mo' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Commission summary */}
            <div className="bg-[#2BB673]/5 border border-[#2BB673]/20 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#2BB673]" />
                Recurring Revenue Potential
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { merchants: 5, pkg: 'Community Presence ($199/mo)', commission: 30, total: 5 * 199 * 0.30 },
                  { merchants: 10, pkg: 'Community Presence ($199/mo)', commission: 30, total: 10 * 199 * 0.30 },
                  { merchants: 20, pkg: 'Mix of packages', commission: 28, total: 20 * 180 * 0.28 },
                ].map((row, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-100">
                    <div className="text-2xl font-bold text-[#2BB673]">${row.total.toFixed(0)}/mo</div>
                    <div className="text-sm text-slate-700 mt-1">{row.merchants} merchants on {row.pkg}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{row.commission}% commission</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pitch Scripts Tab */}
        {activeTab === 'scripts' && (
          <div className="space-y-5">
            <p className="text-slate-600 mb-6">
              Use these ready-made scripts to pitch community packages to your merchants. Copy, customize, and close.
            </p>
            {PITCH_SCRIPTS.map((script, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-slate-900">{script.title}</h3>
                  <button
                    onClick={() => copyScript(i, script.script)}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#2BB673] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#2BB673]/5 border border-slate-200 hover:border-[#2BB673]/30"
                  >
                    {copiedScript === i ? (
                      <>
                        <Check className="w-4 h-4 text-[#2BB673]" />
                        <span className="text-[#2BB673]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed italic">
                  {script.script}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How It Works Tab */}
        {activeTab === 'howItWorks' && (
          <div className="space-y-6">
            <p className="text-slate-600">
              Here's how the community channel works — from you pitching a merchant to earning recurring commissions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  step: 1,
                  icon: Target,
                  title: 'Identify the Right Merchant',
                  desc: 'Any merchant who wants more community visibility is a fit — restaurants, salons, fitness studios, family services, entertainment venues, and more.',
                  color: 'bg-blue-50 text-blue-600',
                },
                {
                  step: 2,
                  icon: Package,
                  title: 'Present a Package',
                  desc: 'Show them the community packages. Start with the Basic Event Listing at $49 to get a yes, then upsell to Community Presence for recurring revenue.',
                  color: 'bg-amber-50 text-amber-600',
                },
                {
                  step: 3,
                  icon: Calendar,
                  title: 'Merchant Posts Their Event',
                  desc: 'Once they\'re on the platform, they post events directly. You earn your commission immediately on the package sale.',
                  color: 'bg-[#2BB673]/10 text-[#2BB673]',
                },
                {
                  step: 4,
                  icon: TrendingUp,
                  title: 'Community Discovers Them',
                  desc: 'Their events show up on the community calendar, in category feeds, on the homepage, and in email digests — driving real foot traffic.',
                  color: 'bg-slate-100 text-slate-600',
                },
                {
                  step: 5,
                  icon: Star,
                  title: 'Merchant Sees Results',
                  desc: 'Events drive RSVPs, RSVPs become customers, customers become regulars. The merchant sees ROI and naturally stays on recurring packages.',
                  color: 'bg-rose-50 text-rose-600',
                },
                {
                  step: 6,
                  icon: DollarSign,
                  title: 'You Earn Every Month',
                  desc: 'Recurring packages pay you every month as long as the merchant stays active. One closed merchant on Community Presence = $60/month forever.',
                  color: 'bg-[#2BB673]/10 text-[#2BB673]',
                },
              ].map(item => (
                <div key={item.step} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-100">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Step {item.step}</div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">The Community Advantage</h3>
              <p className="text-slate-300 mb-4">
                Unlike discount platforms, community calendar listings aren't devaluing the business — they're amplifying it.
                Merchants love this pitch because it feels like marketing, not couponing.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'No coupon stigma — it\'s community presence',
                  'Events drive repeat visits, not one-time deal hunters',
                  'Merchants stay on platform for visibility, not discounts',
                  'Families and locals search the calendar weekly',
                ].map(point => (
                  <div key={point} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#2BB673] mt-0.5 flex-shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/community')}
            className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#2BB673] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2BB673]/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#2BB673]" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900">View Community Calendar</div>
                <div className="text-sm text-slate-500">See what's live in the community</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#2BB673] transition-colors" />
          </button>

          <button
            onClick={() => navigate('/partner/share-kit')}
            className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#2BB673] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900">Get Your Pitch Materials</div>
                <div className="text-sm text-slate-500">Co-branded flyers and decks</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#2BB673] transition-colors" />
          </button>
        </div>
      </div>
    </PartnerHubLayout>
  );
}
