import { useState } from 'react';
import { Link } from 'react-router-dom';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import { Download, Copy, Check, Image, FileText, Mail, Share2, ExternalLink, Megaphone, Star } from 'lucide-react';

const BRAND_COLORS = [
  { name: 'Primary Green', hex: '#2BB673', cls: 'bg-[#2BB673]' },
  { name: 'Dark Navy', hex: '#0F172A', cls: 'bg-slate-900' },
  { name: 'Light Gray', hex: '#F8FAFC', cls: 'bg-slate-50 border border-slate-200' },
  { name: 'Accent Teal', hex: '#14B8A6', cls: 'bg-teal-500' },
];

const COPY_TEMPLATES = [
  {
    category: 'Social Media',
    icon: <Share2 className="w-4 h-4" />,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    items: [
      {
        label: 'LinkedIn Post',
        text: `Are you a local business owner tired of paying for ads that don't convert?

I partner with 1Hub — a platform that connects local businesses with a community of ready-to-buy customers through verified deals, loyalty programs, and AI-powered marketing tools.

No ad spend required. Just real customers, real results.

DM me to see if your market is still available. ⬇️`,
      },
      {
        label: 'Facebook Post',
        text: `Attention local business owners in [CITY]! 🚨

I'm working with a small group of businesses right now helping them get more customers WITHOUT expensive ads.

Through 1Hub, you get:
✅ Access to a built-in community of local buyers
✅ AI tools that write your marketing for you
✅ A CRM to track every customer and sale
✅ Done-for-you campaigns

Limited spots available in [CITY]. Drop a comment or DM me today!`,
      },
      {
        label: 'Instagram Caption',
        text: `Local business = your community's backbone 💚

I help local businesses grow with real tools — not just promises. Through 1Hub, merchants get a full customer attraction system that actually works.

🔗 Link in bio to see if your city is available.

#LocalBusiness #SmallBusiness #1Hub #LocalMarketing #BusinessGrowth`,
      },
    ],
  },
  {
    category: 'Email Templates',
    icon: <Mail className="w-4 h-4" />,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    items: [
      {
        label: 'Cold Outreach Email',
        text: `Subject: More customers for [BUSINESS NAME] — without ad spend

Hi [FIRST NAME],

I noticed [BUSINESS NAME] on [WHERE YOU FOUND THEM] and wanted to reach out because I help local businesses in [CITY] attract more customers without paying for ads.

I partner with 1Hub — a local customer attraction platform used by businesses like yours to:
• Get in front of buyers already looking for your services
• Automate follow-ups and reviews
• Manage loyalty, referrals, and repeat business

I'd love to show you a quick 10-minute demo. Are you open to a call this week?

Best,
[YOUR NAME]
[YOUR PHONE]`,
      },
      {
        label: 'Follow-Up Email',
        text: `Subject: Quick follow-up — [BUSINESS NAME] + 1Hub

Hi [FIRST NAME],

Just circling back on my last email. I know how busy things get running a local business.

I wanted to share that we recently helped a [BUSINESS TYPE] in [SIMILAR CITY] go from struggling to book out 3 weeks in advance — just by activating their 1Hub profile and running a few campaigns.

The setup takes less than an hour, and there's no long-term commitment to get started.

Would 15 minutes this week work for a quick walkthrough?

[YOUR NAME]`,
      },
    ],
  },
  {
    category: 'SMS Scripts',
    icon: <Megaphone className="w-4 h-4" />,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    items: [
      {
        label: 'Initial Text',
        text: `Hi [FIRST NAME], this is [YOUR NAME]. I help local businesses in [CITY] get more customers without ad spend. Would you be open to a quick 10-min call this week? Reply YES and I'll send you times.`,
      },
      {
        label: 'Follow-Up Text',
        text: `Hey [FIRST NAME] — following up from my message earlier. I work with a platform called 1Hub that's helping local businesses like yours get found by ready-to-buy customers. Takes 15 mins to set up. Free to look at. Interested?`,
      },
    ],
  },
];

const ASSETS = [
  { label: 'Partner One-Pager (PDF)', icon: <FileText className="w-5 h-5" />, size: '1.2 MB', type: 'pdf' },
  { label: 'Logo Pack (PNG + SVG)', icon: <Image className="w-5 h-5" />, size: '4.8 MB', type: 'zip' },
  { label: 'Social Media Banner Kit', icon: <Image className="w-5 h-5" />, size: '12 MB', type: 'zip' },
  { label: 'Pitch Deck (PowerPoint)', icon: <FileText className="w-5 h-5" />, size: '8.3 MB', type: 'pptx' },
  { label: 'Email Signature Template', icon: <Mail className="w-5 h-5" />, size: '200 KB', type: 'html' },
  { label: 'Business Card Design', icon: <Image className="w-5 h-5" />, size: '3.1 MB', type: 'pdf' },
];

export default function PartnerMarketingKitPage() {
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(key);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <PartnerHubLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Marketing Kit</h1>
            <p className="text-slate-500 mt-1">Everything you need to pitch, close, and grow your territory.</p>
          </div>
          <Link
            to="/partner/share-kit"
            className="flex items-center gap-2 bg-[#2BB673] text-white px-4 py-2 rounded-lg hover:bg-[#22995f] transition-colors text-sm font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share Kit
          </Link>
        </div>

        {/* Brand Colors */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#2BB673]" />
            Brand Colors
          </h2>
          <div className="flex gap-4 flex-wrap">
            {BRAND_COLORS.map((c) => (
              <div key={c.hex} className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3">
                <div className={`w-8 h-8 rounded-lg ${c.cls}`} />
                <div>
                  <p className="text-sm font-medium text-slate-900">{c.name}</p>
                  <button
                    onClick={() => copyText(c.hex, c.hex)}
                    className="text-xs text-slate-500 hover:text-[#2BB673] flex items-center gap-1"
                  >
                    {copiedIdx === c.hex ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    {c.hex}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downloadable Assets */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-[#2BB673]" />
            Downloadable Assets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ASSETS.map((a) => (
              <button
                key={a.label}
                className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-[#2BB673] hover:bg-emerald-50 transition-all text-left group"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-[#2BB673] group-hover:text-white text-slate-500 transition-colors">
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{a.label}</p>
                  <p className="text-xs text-slate-400">{a.size} · {a.type.toUpperCase()}</p>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-[#2BB673]" />
              </button>
            ))}
          </div>
        </div>

        {/* Copy Templates */}
        {COPY_TEMPLATES.map((section) => (
          <div key={section.category} className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${section.color}`}>
                {section.icon}
                {section.category}
              </span>
            </h2>
            <div className="space-y-4">
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`;
                return (
                  <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      <button
                        onClick={() => copyText(item.text, key)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#2BB673] transition-colors"
                      >
                        {copiedIdx === key ? (
                          <><Check className="w-3 h-3 text-green-600" /> Copied!</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy</>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {item.text}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Resources */}
        <div className="bg-gradient-to-r from-[#2BB673] to-teal-500 rounded-xl p-6 text-white">
          <h2 className="font-semibold text-lg mb-2">Need custom materials?</h2>
          <p className="text-white/80 text-sm mb-4">
            Reach out to your partner success manager for co-branded assets, custom decks, or territory-specific campaigns.
          </p>
          <a
            href="mailto:partners@1hub.com"
            className="inline-flex items-center gap-2 bg-white text-[#2BB673] px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Contact Partner Success
          </a>
        </div>
      </div>
    </PartnerHubLayout>
  );
}
