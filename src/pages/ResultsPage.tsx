import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, ArrowRight, TrendingUp, Users, Target, DollarSign,
  CheckCircle, Zap, Store, Award, MessageSquare, BarChart2,
  ChevronRight, Quote, Activity, Briefcase, Clock, RefreshCw
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  role: string;
  display_name: string;
  business_type: string;
  content: string;
  result_badge: string;
}

interface CaseStudy {
  id: string;
  study_type: string;
  business_type: string;
  plan_used: string;
  before_situation: string;
  tools_used: string[];
  result_summary: string;
  quote: string;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  created_at: string;
}

interface ProofStat {
  stat_key: string;
  stat_value: number;
  display_label: string;
  display_suffix: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  merchant_signup: <Store className="w-4 h-4 text-blue-500" />,
  offer_created: <Tag className="w-4 h-4 text-green-500" />,
  lead_received: <Target className="w-4 h-4 text-orange-500" />,
  booking_created: <CheckCircle className="w-4 h-4 text-teal-500" />,
  partner_signup: <Users className="w-4 h-4 text-sky-500" />,
  commission_earned: <DollarSign className="w-4 h-4 text-emerald-500" />,
};

const Tag = ({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    teal: 'bg-teal-100 text-teal-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ResultsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [feed, setFeed] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<ProofStat[]>([]);
  const [loading, setLoading] = useState(true);
  const feedRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Auto-scroll activity feed every 4s
  useEffect(() => {
    if (feed.length === 0) return;
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setFeed(prev => {
          const [first, ...rest] = prev;
          return [...rest, first];
        });
        setAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [feed]);

  async function loadData() {
    try {
      const [testimonialsRes, caseStudiesRes, feedRes, statsRes] = await Promise.all([
        supabase.from('testimonials').select('*').eq('approved', true).order('featured', { ascending: false }).limit(6),
        supabase.from('case_studies').select('*').eq('published', true).limit(3),
        supabase.rpc('get_public_activity_feed', { p_limit: 12 }),
        supabase.from('platform_proof_stats').select('*'),
      ]);
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
      if (caseStudiesRes.data) setCaseStudies(caseStudiesRes.data);
      if (feedRes.data) setFeed(feedRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (err) {
      console.error('Error loading results data:', err);
    } finally {
      setLoading(false);
    }
  }

  const merchantStats = [
    { key: 'businesses_launched', icon: <Store className="w-7 h-7 text-blue-600" />, fallback: 'Early Access', bg: 'bg-blue-50' },
    { key: 'leads_captured', icon: <Target className="w-7 h-7 text-orange-600" />, fallback: 'Live Tracking', bg: 'bg-orange-50' },
    { key: 'bookings_created', icon: <CheckCircle className="w-7 h-7 text-teal-600" />, fallback: 'Growing Daily', bg: 'bg-teal-50' },
    { key: 'partner_commissions_paid_cents', icon: <DollarSign className="w-7 h-7 text-emerald-600" />, fallback: 'Active Partners', bg: 'bg-emerald-50' },
  ];

  function formatStatValue(key: string, value: number): string {
    if (key === 'partner_commissions_paid_cents') {
      if (value === 0) return '—';
      return '$' + (value / 100).toLocaleString();
    }
    if (value === 0) return '—';
    return value.toLocaleString();
  }

  const getStatData = (key: string) => stats.find(s => s.stat_key === key);

  const partnerTestimonials = testimonials.filter(t => t.role === 'partner');
  const merchantTestimonials = testimonials.filter(t => t.role !== 'partner');

  return (
    <>
      <SEO
        title="Real Results | Local-Link Marketplace"
        description="See how real businesses and partners are using Local-Link to get customers, grow, and automate — all in one connected system."
      />

      <div className="min-h-screen bg-white">
        {/* ── NAV ─────────────────────────────────────────── */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">Local-Link</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to="/community" className="hover:text-blue-600 transition-colors">Community</Link>
              <Link to="/offers" className="hover:text-blue-600 transition-colors">Find Services</Link>
              <Link to="/results" className="text-blue-600 font-semibold">Results</Link>
              <Link to="/earn" className="hover:text-blue-600 transition-colors">Make Money</Link>
              <Link to="/business" className="hover:text-blue-600 transition-colors">Start a Business</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link to="/register" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">Real Results</span>
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                  Real People.<br />
                  Real Businesses.<br />
                  <span className="text-blue-400">Real Results.</span>
                </h1>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
                  See how Local-Link helps businesses get customers, automate follow-up, and grow — all with one connected system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register?role=merchant" className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-7 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2">
                    Start Your Business <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/earn" className="border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2">
                    Make Money With Us <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right — proof cards */}
              <div className="space-y-3">
                {[
                  { icon: <Target className="w-5 h-5 text-orange-400" />, label: 'Leads Captured', value: 'Businesses getting new leads', color: 'from-orange-500/10 to-transparent border-orange-500/20' },
                  { icon: <CheckCircle className="w-5 h-5 text-teal-400" />, label: 'Bookings Created', value: 'Calendars filling automatically', color: 'from-teal-500/10 to-transparent border-teal-500/20' },
                  { icon: <BarChart2 className="w-5 h-5 text-blue-400" />, label: 'Revenue Tracked', value: 'All in one dashboard', color: 'from-blue-500/10 to-transparent border-blue-500/20' },
                  { icon: <DollarSign className="w-5 h-5 text-emerald-400" />, label: 'Partner Commissions', value: 'Partners earning every month', color: 'from-emerald-500/10 to-transparent border-emerald-500/20' },
                ].map((card) => (
                  <div key={card.label} className={`flex items-center gap-4 bg-gradient-to-r ${card.color} border rounded-xl p-4`}>
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      {card.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{card.label}</p>
                      <p className="text-slate-400 text-xs">{card.value}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROOF METRICS ─────────────────────────────────── */}
        <section className="py-16 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Platform Activity</h2>
              <p className="text-gray-500 mt-1">Live results from the Local-Link ecosystem</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {merchantStats.map(({ key, icon, fallback, bg }) => {
                const stat = getStatData(key);
                const value = formatStatValue(key, stat?.stat_value || 0);
                const isEmpty = !stat || stat.stat_value === 0;
                return (
                  <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                    <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      {icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {isEmpty ? fallback : value}
                    </div>
                    {isEmpty && (
                      <div className="text-xs text-blue-600 font-medium mb-1">Starting Soon</div>
                    )}
                    <div className="text-sm text-gray-500">{stat?.display_label || key.replace(/_/g, ' ')}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────── */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">What People Are Saying</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Local Businesses Love Local-Link</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">Real feedback from merchants and partners using the platform every day.</p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(testimonials.length > 0 ? testimonials : []).map((t) => (
                  <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <Quote className="w-8 h-8 text-blue-100 mb-3 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed flex-1 mb-4 italic">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{t.display_name}</p>
                        <p className="text-gray-500 text-xs">{t.business_type || (t.role === 'partner' ? 'Local Partner' : 'Business Owner')}</p>
                      </div>
                      {t.result_badge && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                          {t.result_badge}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CASE STUDIES ──────────────────────────────────── */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">How It Works</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Local-Link in the Real World</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">Step-by-step stories of businesses and partners seeing real results.</p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {(caseStudies.length > 0 ? caseStudies : FALLBACK_CASES).map((cs, idx) => (
                  <div key={cs.id || idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-200" />
                        <span className="text-white font-semibold text-sm">{cs.business_type}</span>
                        {cs.plan_used && (
                          <span className="ml-auto text-xs text-blue-200 font-medium">{cs.plan_used} Plan</span>
                        )}
                      </div>
                    </div>
                    <div className="p-5 flex-1 space-y-4">
                      {/* Before */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 text-xs font-bold">!</span>
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Before</span>
                        </div>
                        <p className="text-sm text-gray-600">{cs.before_situation}</p>
                      </div>
                      {/* Tools */}
                      {cs.tools_used && cs.tools_used.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Zap className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">What They Used</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {cs.tools_used.map((tool, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-md">{tool}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Result */}
                      <div className="bg-green-50 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Result</span>
                        </div>
                        <p className="text-sm text-green-800 font-medium">{cs.result_summary}</p>
                      </div>
                      {/* Quote */}
                      {cs.quote && (
                        <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3">&ldquo;{cs.quote}&rdquo;</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── LIVE ACTIVITY FEED ────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Live Activity</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Happening Inside Local-Link</h2>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Businesses are joining, offers are going live, and leads are coming in. This is your community growing in real time.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: <Store className="w-4 h-4 text-blue-600" />, text: 'Businesses list their services and get discovered' },
                    { icon: <Target className="w-4 h-4 text-orange-600" />, text: 'Leads flow in and get captured automatically' },
                    { icon: <Zap className="w-4 h-4 text-teal-600" />, text: 'AI follow-up handles outreach on autopilot' },
                    { icon: <DollarSign className="w-4 h-4 text-emerald-600" />, text: 'Partners earn commissions for every referral' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <p className="text-gray-700 text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-3 bg-slate-800 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-sm font-semibold">Live Activity</span>
                  </div>
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div className="p-4 space-y-2 min-h-[320px]">
                  {loading ? (
                    Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-10 bg-slate-800 rounded-lg animate-pulse" />
                    ))
                  ) : (
                    feed.slice(0, 8).map((item, i) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 bg-slate-800/60 rounded-lg px-3 py-2.5 transition-all duration-300 ${i === 0 && animating ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}
                      >
                        <div className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center flex-shrink-0">
                          {TYPE_ICONS[item.type] || <Activity className="w-4 h-4 text-slate-400" />}
                        </div>
                        <p className="text-slate-300 text-sm flex-1">{item.message}</p>
                        <span className="text-slate-500 text-xs flex-shrink-0">{timeAgo(item.created_at)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PARTNER SUCCESS ───────────────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-blue-950 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Partner Wins</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">Partners Are Building Income with Local-Link</h2>
              <p className="text-slate-400 max-w-xl mx-auto">Everyday people helping local businesses grow — and earning real income doing it.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {[
                { icon: <DollarSign className="w-6 h-6 text-emerald-400" />, title: 'First Sale', desc: 'Partners earning their first commission within days of starting', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { icon: <RefreshCw className="w-6 h-6 text-blue-400" />, title: 'Recurring Income', desc: 'Monthly commissions that grow as merchants stay subscribed', bg: 'bg-blue-500/10 border-blue-500/20' },
                { icon: <Users className="w-6 h-6 text-sky-400" />, title: 'Merchant Referrals', desc: 'Building a book of merchants and earning on every renewal', bg: 'bg-sky-500/10 border-sky-500/20' },
                { icon: <Award className="w-6 h-6 text-yellow-400" />, title: 'Academy Certified', desc: 'Trained, certified, and ready to close with confidence', bg: 'bg-yellow-500/10 border-yellow-500/20' },
              ].map((card) => (
                <div key={card.title} className={`border ${card.bg} rounded-2xl p-5`}>
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Partner testimonials */}
            {partnerTestimonials.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {partnerTestimonials.slice(0, 3).map((t) => (
                  <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <Quote className="w-7 h-7 text-blue-400/50 mb-3" />
                    <p className="text-slate-300 italic text-sm leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white text-sm">{t.display_name}</p>
                        <p className="text-slate-500 text-xs">Local Partner</p>
                      </div>
                      {t.result_badge && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {t.result_badge}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center">
              <Link to="/earn" className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
                Become a Partner <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 mb-6 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              Ready to Join Them?
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Ready to Start Seeing Results?</h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Join the businesses and partners already using Local-Link to get customers, grow revenue, and build real income.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=merchant" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                <Store className="w-5 h-5" />
                Join as Merchant
              </Link>
              <Link to="/earn" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                Become a Partner
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <footer className="bg-slate-900 text-slate-400 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-white font-semibold">Local-Link</span>
              <span className="text-slate-500">— The All-in-One System to Start, Grow, and Automate a Business</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/results" className="text-white font-medium">Results</Link>
              <Link to="/earn" className="hover:text-white transition-colors">Partners</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// ── Fallback case studies shown before DB loads ──────────────────────────────
const FALLBACK_CASES = [
  {
    id: 'f1',
    study_type: 'merchant',
    business_type: 'Salon',
    plan_used: 'Starter',
    before_situation: 'Slow weekdays and missed messages from potential customers with no follow-up system.',
    tools_used: ['Marketplace Profile', 'Offer', 'AI Follow-up'],
    result_summary: 'More inquiries, easier follow-up, and slow weekdays filling up within the first month.',
    quote: 'I wish I had this two years ago. It just works.',
  },
  {
    id: 'f2',
    study_type: 'merchant',
    business_type: 'Cleaning Service',
    plan_used: 'Growth',
    before_situation: 'No consistent leads and spending money on ads that never converted into real customers.',
    tools_used: ['Marketplace Profile', 'Offer', 'CRM', 'AI Follow-up'],
    result_summary: 'Booked 5 customers in the first week using the marketplace and follow-up automation.',
    quote: 'I stopped paying for ads that didn\'t work and started getting real customers.',
  },
  {
    id: 'f3',
    study_type: 'partner',
    business_type: 'Local Partner',
    plan_used: 'Standard',
    before_situation: 'Looking for a flexible way to earn income while helping local businesses grow.',
    tools_used: ['Marketing Kit', 'Academy Training', 'Partner Dashboard'],
    result_summary: 'Closed first merchant in the first week. Building toward recurring monthly commission.',
    quote: 'The system does the heavy lifting. I just show people what\'s possible.',
  },
];
