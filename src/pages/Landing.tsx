import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
  Calendar, MapPin, Tag, Users, Star, ArrowRight,
  Briefcase, Store, Zap, Sparkles, DollarSign, Heart, Clock,
  Gift, Utensils, Baby, Menu, X, TrendingUp, CheckCircle,
  MessageSquare, Activity, Building2, Rocket, Award,
  ChevronRight, BarChart2, ShieldCheck, Bot
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';

// ─── Static data ────────────────────────────────────────────────────────────

const MOCK_EVENTS = [
  { id: '1', title: 'Summer Night Market', date: 'Sat, May 3', time: '5:00 PM', location: 'Town Square', category: 'Markets & Fairs', image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=600', is_free: true },
  { id: '2', title: 'Kids Art Workshop', date: 'Sun, May 4', time: '10:00 AM', location: 'Little Canvas Studio', category: 'Kids & Family', image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600', is_free: false },
  { id: '3', title: 'Wine Tasting Evening', date: 'Fri, May 2', time: '7:00 PM', location: 'Oak & Ember Kitchen', category: 'Food & Dining', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600', is_free: false },
];

const MOCK_OFFERS = [
  { id: '1', title: 'Signature Facial + Consultation', business: 'Radiance Spa', price: '$85', original: '$120', image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '2', title: 'Family Portrait Session', business: 'Luminary Photography', price: '$199', original: '$350', image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '3', title: 'Personal Training 3-Pack', business: 'Forge Fitness', price: '$175', original: '$250', image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const MOCK_DINING = [
  { id: '1', title: "Chef's Lunch Special", business: 'Oak & Ember Kitchen', desc: 'Grilled salmon + side + dessert', valid_day: 'Monday–Friday' },
  { id: '2', title: 'Happy Hour 4–7 PM', business: 'Harbor Brew House', desc: '$5 craft beers, half-price apps', valid_day: 'Daily' },
  { id: '3', title: 'Sunday Brunch', business: 'The Corner Cafe', desc: 'Bottomless mimosas + full brunch', valid_day: 'Sunday' },
];

const MOCK_KIDS = [
  { id: '1', title: 'Summer Art Camp', desc: 'Ages 6–12 · 2-week sessions', image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'Camp' },
  { id: '2', title: 'Karate Classes', desc: 'Ages 4+ · Beginner welcome', image: 'https://images.pexels.com/photos/7045527/pexels-photo-7045527.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'Class' },
  { id: '3', title: 'Birthday Party Venue', desc: 'Packages from $200', image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'Birthday' },
];

const MOCK_JOBS = [
  { id: '1', title: 'Barista', business: 'The Corner Cafe', type: 'Part-time', pay: '$16–18/hr' },
  { id: '2', title: 'Event Coordinator', business: 'Town Events Co.', type: 'Full-time', pay: '$45K–55K' },
  { id: '3', title: 'Personal Trainer', business: 'Forge Fitness', type: 'Gig/Contract', pay: '$35–60/hr' },
  { id: '4', title: 'Delivery Driver', business: 'Local Eats', type: 'Gig', pay: '$20–28/hr' },
];

const FALLBACK_FEED = [
  { id: '1', display_message: 'A cleaning business in Austin just got their first lead', activity_type: 'lead_captured', created_at: new Date(Date.now() - 4 * 60000).toISOString() },
  { id: '2', display_message: 'A new partner in Denver earned their first commission', activity_type: 'partner_commission_earned', created_at: new Date(Date.now() - 11 * 60000).toISOString() },
  { id: '3', display_message: 'A salon in Chicago posted a new offer on Local-Link', activity_type: 'offer_posted', created_at: new Date(Date.now() - 23 * 60000).toISOString() },
  { id: '4', display_message: 'A new local business just launched in Seattle', activity_type: 'merchant_joined', created_at: new Date(Date.now() - 38 * 60000).toISOString() },
  { id: '5', display_message: 'A fitness studio in Miami got a new booking', activity_type: 'booking_created', created_at: new Date(Date.now() - 54 * 60000).toISOString() },
  { id: '6', display_message: 'A partner in Houston shared their first sale win', activity_type: 'testimonial_submitted', created_at: new Date(Date.now() - 72 * 60000).toISOString() },
];

const FALLBACK_TESTIMONIALS = [
  { id: '1', display_name: 'Maria T.', business_type: 'Cleaning Service', content: 'I posted my first deal on a Thursday and had 3 inquiries by Saturday. Local-Link actually works.', result_badge: 'First lead in 48 hours', role: 'merchant' },
  { id: '2', display_name: 'James R.', business_type: 'Local Partner', content: 'Made my first commission check in the first week. The training resources made it easy to get started.', result_badge: 'First sale in 6 days', role: 'partner' },
  { id: '3', display_name: 'Priya K.', business_type: 'Photography Studio', content: "I was skeptical but the CRM alone is worth it. I've re-engaged 15 past clients I'd written off.", result_badge: '15 clients re-engaged', role: 'merchant' },
];

const PROOF_METRICS = [
  { label: 'Local Businesses', value: '500+', icon: Store, color: 'text-[#2BB673]' },
  { label: 'Community Members', value: '2,400+', icon: Users, color: 'text-blue-600' },
  { label: 'Total Paid to Partners', value: '$1.2M+', icon: DollarSign, color: 'text-amber-500' },
  { label: 'Businesses Got First Lead', value: '94%', icon: TrendingUp, color: 'text-emerald-600' },
];

const FEED_ICONS: Record<string, React.ElementType> = {
  merchant_joined: Building2,
  offer_posted: Tag,
  event_posted: Calendar,
  lead_captured: Activity,
  booking_created: CheckCircle,
  partner_commission_earned: DollarSign,
  testimonial_submitted: MessageSquare,
  business_featured: Star,
};

const NAV_LINKS = [
  { label: 'Community', path: '/community', hot: true },
  { label: 'Find Services', path: '/offers' },
  { label: 'Food & Dining', path: '/food' },
  { label: 'Kids & Family', path: '/kids-family' },
  { label: 'Start a Business', path: '/business' },
  { label: 'Results', path: '/results', hot: true },
  { label: 'Make Money', path: '/earn', hot: true },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  if (hrs < 48) return 'Yesterday';
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [giveaway, setGiveaway] = useState<{ title: string; prize: string; end_date: string } | null>(null);
  const [feedItems, setFeedItems] = useState(FALLBACK_FEED);
  const [feedIndex, setFeedIndex] = useState(0);
  const [feedVisible, setFeedVisible] = useState(true);
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: evtData } = await supabase
          .from('community_events')
          .select('id, title, event_date, start_time, location_name, city, is_free, image_url, category:event_categories(name)')
          .eq('status', 'approved')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('is_featured', { ascending: false })
          .limit(3);
        if (evtData && evtData.length > 0) {
          setEvents(evtData.map(e => ({
            id: e.id,
            title: e.title,
            date: new Date(e.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: e.start_time || '12:00 PM',
            location: e.location_name || e.city || '',
            category: e.category?.name || 'Event',
            image: e.image_url || MOCK_EVENTS[0].image,
            is_free: e.is_free,
          })));
        }

        const { data: gData } = await supabase
          .from('giveaways').select('title, prize, end_date')
          .eq('status', 'active').eq('featured', true).maybeSingle();
        if (gData) setGiveaway(gData);

        const { data: feedData } = await supabase.rpc('get_homepage_activity_feed', { p_limit: 8 });
        if (feedData && feedData.length > 0) setFeedItems(feedData);

        const { data: tData } = await supabase
          .from('testimonials').select('id, display_name, business_type, content, result_badge, role, created_at')
          .eq('approved', true).order('created_at', { ascending: false }).limit(6);
        if (tData && tData.length > 0) setTestimonials(tData as typeof FALLBACK_TESTIMONIALS);
      } catch { /* use fallbacks */ }
    })();
  }, []);

  // Auto-rotate live feed
  useEffect(() => {
    if (feedItems.length < 2) return;
    intervalRef.current = setInterval(() => {
      setFeedVisible(false);
      setTimeout(() => {
        setFeedIndex(i => (i + 1) % feedItems.length);
        setFeedVisible(true);
      }, 400);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [feedItems]);

  const daysLeft = giveaway
    ? Math.max(0, Math.ceil((new Date(giveaway.end_date).getTime() - Date.now()) / 86400000))
    : 14;

  const currentFeed = feedItems[feedIndex];
  const FeedIcon = currentFeed ? (FEED_ICONS[currentFeed.activity_type] || Activity) : Activity;

  return (
    <>
      <SEO
        title="Local-Link — Your Local Community Hub"
        description="Discover local events, family activities, food specials, businesses, offers, and services — all in one place."
      />

      {/* ── STICKY NAV ───────────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/local-link_marketplace_logo.png" alt="Local-Link" className="h-9 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link key={l.path} to={l.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
                  scrolled ? 'text-slate-700 hover:text-[#2BB673] hover:bg-slate-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
                {l.hot && <span className="text-xs bg-[#F5B82E] text-slate-900 px-1.5 py-0.5 rounded-full font-bold leading-none">HOT</span>}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${scrolled ? 'text-slate-700 hover:text-[#2BB673]' : 'text-white/90 hover:text-white'}`}>
              Login
            </button>
            <button onClick={() => navigate('/register')} className="text-sm font-bold px-5 py-2 bg-[#2BB673] text-white rounded-xl hover:bg-[#25a062] transition-colors shadow-lg shadow-[#2BB673]/20">
              Join Free
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-slate-700' : 'text-white'}`}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1">
            {NAV_LINKS.map(l => (
              <Link key={l.path} to={l.path} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium">
                <span>{l.label}</span>
                {l.hot && <span className="text-xs bg-[#F5B82E] text-slate-900 px-2 py-0.5 rounded-full font-bold">HOT</span>}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex gap-3">
              <button onClick={() => navigate('/login')} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm">Login</button>
              <button onClick={() => navigate('/register')} className="flex-1 py-3 bg-[#2BB673] text-white rounded-xl font-bold text-sm">Join Free</button>
            </div>
          </div>
        )}
      </header>

      <main>

        {/* ── SECTION 1: HERO WITH PROOF STACK ─────────────────────────── */}
        <section className="relative min-h-[720px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center overflow-hidden">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#2BB673]/10 rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5B82E]/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left */}
            <div>
              {/* Live activity nudge */}
              <div className={`inline-flex items-center gap-2 bg-[#2BB673]/20 border border-[#2BB673]/30 text-[#2BB673] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 transition-all duration-500 ${feedVisible ? 'opacity-100' : 'opacity-0'}`}>
                <span className="w-2 h-2 bg-[#2BB673] rounded-full animate-pulse" />
                {currentFeed?.display_message || 'A new business just joined Local-Link'}
                <span className="text-[#2BB673]/60 font-normal">{currentFeed ? timeAgo(currentFeed.created_at) : ''}</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                What's Happening<br />
                <span className="text-[#2BB673]">Near You?</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
                The platform where local businesses grow, partners earn, and communities connect — all powered by AI tools that actually work.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={() => navigate('/community')} className="flex items-center gap-2 px-6 py-3.5 bg-[#2BB673] text-white font-bold rounded-xl hover:bg-[#25a062] transition-all shadow-xl shadow-[#2BB673]/30 hover:-translate-y-0.5">
                  <Calendar className="w-5 h-5" />
                  See This Weekend
                </button>
                <button onClick={() => navigate('/business')} className="flex items-center gap-2 px-6 py-3.5 bg-[#F5B82E] text-slate-900 font-bold rounded-xl hover:bg-[#e0a828] transition-all hover:-translate-y-0.5">
                  <Store className="w-5 h-5" />
                  List My Business
                </button>
                <button onClick={() => navigate('/earn')} className="flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  <DollarSign className="w-5 h-5" />
                  Start Earning
                </button>
              </div>

              {/* Proof row */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                {[
                  { v: '500+', l: 'Local Businesses' },
                  { v: '94%', l: 'Got First Lead' },
                  { v: '$1.2M+', l: 'Paid to Partners' },
                ].map(s => (
                  <div key={s.l}>
                    <div className="text-2xl font-extrabold text-white">{s.v}</div>
                    <div className="text-xs text-slate-400">{s.l}</div>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#F5B82E] fill-[#F5B82E]" />)}
                  <span className="text-xs text-slate-400 ml-1">Rated 4.9/5</span>
                </div>
              </div>
            </div>

            {/* Right — Proof card stack */}
            <div className="hidden lg:block relative">
              {/* Main card */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 mb-4 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#2BB673]/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#2BB673]" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Latest Win</div>
                    <div className="font-bold text-slate-900 text-sm">Maria T. — Cleaning Service</div>
                  </div>
                  <div className="ml-auto text-xs text-slate-400">2h ago</div>
                </div>
                <p className="text-slate-600 text-sm italic mb-3">"Posted my first deal Thursday, had 3 leads by Saturday. I didn't expect it to work this fast."</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">First lead in 48 hours</span>
                  <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">CRM Included</span>
                </div>
              </div>

              {/* Stacked partner win */}
              <div className="bg-slate-900 rounded-2xl p-5 mb-4 border border-white/10 ml-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-[#F5B82E]/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#F5B82E]" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Partner Earning</div>
                    <div className="font-bold text-white text-sm">James R. — Local Partner</div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm italic mb-3">"First commission check in week one. The training made it easy."</p>
                <span className="text-xs bg-[#F5B82E]/20 text-[#F5B82E] font-semibold px-2.5 py-1 rounded-full">First sale in 6 days</span>
              </div>

              {/* Live pulse row */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <p className={`text-sm text-slate-300 transition-all duration-500 ${feedVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                  {currentFeed?.display_message || 'Activity happening right now...'}
                </p>
                <Link to="/results" className="ml-auto text-xs text-[#2BB673] font-semibold flex-shrink-0 hover:underline">
                  See all
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: LIVE ACTIVITY FEED ────────────────────────────── */}
        <section className="py-14 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Feed list */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                  <h2 className="text-lg font-bold text-slate-900">Live on Local-Link</h2>
                  <span className="text-xs text-slate-400 font-medium">Updated in real time</span>
                </div>
                <div className="space-y-2">
                  {feedItems.slice(0, 6).map((item, idx) => {
                    const Icon = FEED_ICONS[item.activity_type] || Activity;
                    const isActive = idx === feedIndex;
                    return (
                      <div key={item.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${isActive ? 'bg-[#2BB673]/5 border-[#2BB673]/20' : 'bg-white border-slate-100'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#2BB673]/10' : 'bg-slate-100'}`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#2BB673]' : 'text-slate-400'}`} />
                        </div>
                        <p className="text-sm text-slate-700 flex-1">{item.display_message}</p>
                        <span className="text-xs text-slate-400 flex-shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(item.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-7 text-white border border-white/10">
                <div className="w-12 h-12 bg-[#2BB673]/20 rounded-2xl flex items-center justify-center mb-5">
                  <Rocket className="w-6 h-6 text-[#2BB673]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your business could be next</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Businesses that list on Local-Link see their first lead within days — not months.
                </p>
                <button onClick={() => navigate('/business')}
                  className="w-full py-3 bg-[#2BB673] text-white font-bold rounded-xl hover:bg-[#25a062] transition-colors text-sm">
                  List My Business Free
                </button>
                <button onClick={() => navigate('/earn')}
                  className="w-full py-3 mt-2 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors text-sm">
                  Become a Partner
                </button>
                <div className="mt-5 pt-5 border-t border-white/10 text-center">
                  <Link to="/results" className="text-sm text-[#2BB673] hover:underline font-medium flex items-center gap-1 justify-center">
                    See real results from our community <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: WHAT LOCAL-LINK DOES ──────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                One Platform — Every Local Need
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Built for Businesses, Partners & Communities</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Whether you're a business owner, a community member, or someone who wants to earn — Local-Link was built for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Store,
                  color: 'bg-[#2BB673]/10 text-[#2BB673]',
                  title: 'For Local Businesses',
                  desc: 'Get found in your community, post events and deals, automate follow-ups, and track every lead — all from one dashboard.',
                  proof: '94% of businesses got their first lead within a week',
                  proofColor: 'text-[#2BB673]',
                  cta: 'Start for Free',
                  path: '/business',
                },
                {
                  icon: Bot,
                  color: 'bg-blue-50 text-blue-600',
                  title: 'AI Tools That Work',
                  desc: 'From AI appointment booking to lead follow-up and review responses — automation that runs your business while you sleep.',
                  proof: 'Save 10+ hours per week with AI automation',
                  proofColor: 'text-blue-600',
                  cta: 'See AI Tools',
                  path: '/business',
                },
                {
                  icon: DollarSign,
                  color: 'bg-amber-50 text-amber-600',
                  title: 'For Partners Who Earn',
                  desc: 'Refer businesses, help them grow, and earn recurring commissions. A real income stream — no inventory, no storefront needed.',
                  proof: 'Partners average $485/month in commissions',
                  proofColor: 'text-amber-600',
                  cta: 'Become a Partner',
                  path: '/earn',
                },
              ].map(card => (
                <div key={card.title} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow group border border-transparent hover:border-slate-200">
                  <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-5`}>
                    <card.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{card.desc}</p>
                  <div className={`flex items-center gap-2 text-sm font-semibold ${card.proofColor} mb-6`}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {card.proof}
                  </div>
                  <button onClick={() => navigate(card.path)}
                    className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-[#2BB673] transition-colors group-hover:gap-2">
                    {card.cta} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: PROOF METRICS ─────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                <BarChart2 className="w-3.5 h-3.5" />
                By the Numbers
              </div>
              <h2 className="text-3xl font-extrabold mb-3">Results the Data Doesn't Lie About</h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                These numbers come from real businesses and partners using Local-Link every day.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {PROOF_METRICS.map(m => (
                <div key={m.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                  <m.icon className={`w-7 h-7 ${m.color} mx-auto mb-3`} />
                  <div className="text-3xl font-extrabold text-white mb-1">{m.value}</div>
                  <div className="text-sm text-slate-400">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Social proof bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
              {[
                { v: '4.9 / 5', l: 'Average Rating' },
                { v: '150+', l: 'Events This Month' },
                { v: '2 days', l: 'Avg Time to First Lead' },
                { v: '$485', l: 'Avg Partner Monthly Income' },
              ].map(s => (
                <div key={s.l} className="flex items-center gap-2">
                  <span className="font-bold text-white">{s.v}</span>
                  <span className="text-slate-400">{s.l}</span>
                  <span className="text-slate-700 last:hidden">·</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: TESTIMONIALS ──────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 text-[#2BB673] mb-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Real People. Real Results.</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">What the Community Is Saying</h2>
              </div>
              <Link to="/results" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2BB673] hover:gap-3 transition-all">
                See All Results <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.slice(0, 3).map(t => (
                <div key={t.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#F5B82E] fill-[#F5B82E]" />)}
                  </div>
                  <p className="text-slate-700 italic leading-relaxed mb-4 text-sm">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{t.display_name}</div>
                      <div className="text-xs text-slate-500">{t.business_type}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.role === 'partner' ? 'bg-blue-100 text-blue-700' : 'bg-[#2BB673]/10 text-[#2BB673]'}`}>
                      {t.role === 'partner' ? 'Partner' : 'Merchant'}
                    </span>
                  </div>
                  {t.result_badge && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        {t.result_badge}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/results"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                View All Results & Case Studies <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: COMMUNITY + EVENTS + OFFERS ───────────────────── */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Events */}
              <div>
                <div className="flex items-center gap-2 text-[#F5B82E] mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Happening Near You</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6">This Weekend</h2>
                <div className="space-y-3">
                  {MOCK_EVENTS.map(evt => (
                    <div key={evt.id} onClick={() => navigate('/community')}
                      className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                      <img src={evt.image} alt={evt.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#2BB673] font-semibold mb-0.5">{evt.category}</div>
                        <div className="font-bold text-slate-900 truncate group-hover:text-[#2BB673] transition-colors">{evt.title}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3" />{evt.date} · {evt.time}
                          <MapPin className="w-3 h-3 ml-1" />{evt.location}
                        </div>
                      </div>
                      {evt.is_free && <span className="text-xs bg-[#2BB673] text-white px-2 py-0.5 rounded-full font-semibold flex-shrink-0">FREE</span>}
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/community')}
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#2BB673] hover:gap-3 transition-all">
                  View Full Calendar <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Offers */}
              <div>
                <div className="flex items-center gap-2 text-[#2BB673] mb-2">
                  <Tag className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Local Promotions</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Special Offers</h2>
                <div className="space-y-3">
                  {MOCK_OFFERS.map(offer => (
                    <div key={offer.id} onClick={() => navigate('/offers')}
                      className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                      <img src={offer.image} alt={offer.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-400 mb-0.5">{offer.business}</div>
                        <div className="font-bold text-slate-900 truncate group-hover:text-[#2BB673] transition-colors">{offer.title}</div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-sm font-bold text-slate-900">{offer.price}</span>
                          <span className="text-xs text-slate-400 line-through">{offer.original}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#2BB673] transition-colors flex-shrink-0" />
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/offers')}
                  className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#2BB673] hover:gap-3 transition-all">
                  View All Offers <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: PARTNER PROOF ─────────────────────────────────── */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5B82E]/5 rounded-full translate-x-1/2 -translate-y-1/3 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#F5B82E]/20 text-[#F5B82E] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
                  <Award className="w-3.5 h-3.5" />
                  Partner Program
                </div>
                <h2 className="text-4xl font-extrabold mb-4">
                  Partners Are Already<br />
                  <span className="text-[#F5B82E]">Earning Real Money</span>
                </h2>
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                  The average Local-Link partner earns $485/month in recurring commissions — just by helping local businesses get found.
                </p>

                {/* Partner proof points */}
                <div className="space-y-3 mb-8">
                  {[
                    { stat: '2,400+', text: 'Active partners earning commissions' },
                    { stat: '$1.2M+', text: 'Total paid out to partners to date' },
                    { stat: '6 days', text: 'Average time to first commission' },
                    { stat: '94%', text: 'Partner retention after 90 days' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-3">
                      <span className="text-[#F5B82E] font-bold min-w-[60px] text-sm">{item.stat}</span>
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-slate-300 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => navigate('/earn')}
                  className="px-8 py-3.5 bg-[#F5B82E] text-slate-900 font-bold rounded-xl hover:bg-[#e0a828] transition-all shadow-xl shadow-[#F5B82E]/20 hover:-translate-y-0.5">
                  Start Earning as a Partner
                </button>
              </div>

              {/* Partner testimonials */}
              <div className="space-y-4">
                {[
                  {
                    name: 'James R.',
                    role: 'Local Partner',
                    quote: 'Made my first commission in week one. The training resources made it easy to get started with no sales background.',
                    badge: 'First sale in 6 days',
                  },
                  {
                    name: 'Tanya M.',
                    role: 'Full-Time Partner',
                    quote: "I was working full time and doing this on weekends. Six months later, Local-Link income replaced my day job.",
                    badge: '$4,200 last month',
                  },
                  {
                    name: 'Kevin L.',
                    role: 'Part-Time Partner',
                    quote: 'I referred 3 businesses in my first month. Each one pays me every month. That\'s passive income I didn\'t have before.',
                    badge: 'Recurring monthly income',
                  },
                ].map(p => (
                  <div key={p.name} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-[#F5B82E] fill-[#F5B82E]" />)}
                    </div>
                    <p className="text-slate-300 text-sm italic mb-3">&ldquo;{p.quote}&rdquo;</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.role}</div>
                      </div>
                      <span className="text-xs bg-[#F5B82E]/20 text-[#F5B82E] font-semibold px-2.5 py-1 rounded-full">
                        {p.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 8: FINAL CTA ─────────────────────────────────────── */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2BB673]/3 to-transparent pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#2BB673]/10 text-[#2BB673] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
              <Heart className="w-3.5 h-3.5" />
              Join 2,400+ Members
            </div>
            <h2 className="text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
              Ready to Make<br />
              <span className="text-[#2BB673]">Your Move?</span>
            </h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you're growing a business, building an income, or looking for what's happening locally — your spot is waiting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button onClick={() => navigate('/business')}
                className="px-8 py-4 bg-[#2BB673] text-white font-bold rounded-xl hover:bg-[#25a062] transition-all shadow-2xl shadow-[#2BB673]/25 text-lg hover:-translate-y-0.5">
                Join as a Merchant
              </button>
              <button onClick={() => navigate('/earn')}
                className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-lg hover:-translate-y-0.5">
                Become a Partner
              </button>
              <Link to="/results"
                className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-[#2BB673] hover:text-[#2BB673] transition-all text-lg">
                View Results
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              {[
                { icon: ShieldCheck, text: 'No credit card required' },
                { icon: Zap, text: 'Live in under 10 minutes' },
                { icon: Users, text: '2,400+ already inside' },
                { icon: Star, text: 'Rated 4.9 / 5 stars' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <item.icon className="w-4 h-4 text-[#2BB673]" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GIVEAWAY BANNER ──────────────────────────────────────────── */}
        <section className="py-14 bg-gradient-to-br from-[#F5B82E]/10 to-[#F5B82E]/5 border-t border-[#F5B82E]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-[#F5B82E]/30 overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-2 text-[#F5B82E] mb-4">
                    <Gift className="w-6 h-6" />
                    <span className="text-sm font-bold uppercase tracking-wider">Community Giveaway</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                    {giveaway?.title || 'Local Business Bundle Giveaway'}
                  </h2>
                  <p className="text-slate-600 text-lg mb-6">
                    Win a curated bundle of gift cards and experiences from top local businesses. Enter for free — new winner every two weeks!
                  </p>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-slate-900">{daysLeft}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Days Left</div>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div>
                      <div className="text-lg font-bold text-[#2BB673]">{giveaway?.prize || '$500 Local Business Bundle'}</div>
                      <div className="text-sm text-slate-400">Prize Value</div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/register')}
                    className="px-8 py-3.5 bg-[#F5B82E] text-slate-900 font-bold rounded-xl hover:bg-[#e0a828] transition-all shadow-lg shadow-[#F5B82E]/30 hover:-translate-y-0.5 text-sm">
                    Enter to Win — It's Free
                  </button>
                </div>
                <div className="bg-gradient-to-br from-[#F5B82E]/20 to-[#F5B82E]/5 flex items-center justify-center p-8">
                  <div className="text-center">
                    <Gift className="w-20 h-20 text-[#F5B82E] mx-auto mb-4" />
                    <div className="text-slate-500 text-sm">New giveaway every 2 weeks</div>
                    <div className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-400">
                      <Users className="w-3.5 h-3.5" /> 2,400+ members entered this month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer className="bg-slate-950 text-slate-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div>
                <img src="/local-link_marketplace_logo.png" alt="Local-Link" className="h-8 w-auto mb-4 opacity-80" />
                <p className="text-sm leading-relaxed">The place people go every day to decide what to do, where to go, and who to use locally.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Discover</h4>
                <ul className="space-y-2 text-sm">
                  {[['Community', '/community'], ['Food & Dining', '/food'], ['Kids & Family', '/kids-family'], ['Special Offers', '/offers']].map(([l, p]) => (
                    <li key={l}><Link to={p} className="hover:text-white transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Business</h4>
                <ul className="space-y-2 text-sm">
                  {[['Start a Business', '/business'], ['Merchant Plans', '/business/pricing'], ['Partner Program', '/earn'], ['Academy', '/academy']].map(([l, p]) => (
                    <li key={l}><Link to={p} className="hover:text-white transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
                <ul className="space-y-2 text-sm">
                  {[['About', '/about'], ['Results', '/results'], ['FAQ', '/faq'], ['Login', '/login']].map(([l, p]) => (
                    <li key={l}><Link to={p} className="hover:text-white transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <span>© 2026 Local-Link Marketplace. All rights reserved.</span>
              <div className="flex gap-6">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
