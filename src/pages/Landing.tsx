import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Calendar, MapPin, Tag, Users, Star, ArrowRight, ChevronRight,
  Briefcase, Store, Zap, Sparkles, DollarSign, Heart, Clock,
  Gift, BookOpen, Utensils, Baby, Menu, X, TrendingUp, CheckCircle
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';

// ─── Mock data for sections ────────────────────────────────────────────────

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
  { id: '1', title: "Chef's Lunch Special", business: 'Oak & Ember Kitchen', desc: 'Grilled salmon + side + dessert', valid_day: 'Monday–Friday', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '2', title: 'Happy Hour 4–7 PM', business: 'Harbor Brew House', desc: '$5 craft beers, half-price apps', valid_day: 'Daily', image: 'https://images.pexels.com/photos/乌brew/pexels-photo-乌brew.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '3', title: 'Sunday Brunch', business: 'The Corner Cafe', desc: 'Bottomless mimosas + full brunch', valid_day: 'Sunday', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
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

const NAV_LINKS = [
  { label: 'Community', path: '/community', hot: true },
  { label: 'Find Services', path: '/offers' },
  { label: 'Food & Dining', path: '/food' },
  { label: 'Kids & Family', path: '/kids-family' },
  { label: 'Start a Business', path: '/business' },
  { label: 'Make Money', path: '/earn', hot: true },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [giveaway, setGiveaway] = useState<{ title: string; prize: string; end_date: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Try to load live events and giveaway
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
          .from('giveaways')
          .select('title, prize, end_date')
          .eq('status', 'active')
          .eq('featured', true)
          .maybeSingle();
        if (gData) setGiveaway(gData);
      } catch { /* use mock */ }
    })();
  }, []);

  const daysLeft = giveaway
    ? Math.max(0, Math.ceil((new Date(giveaway.end_date).getTime() - Date.now()) / 86400000))
    : 14;

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

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.path}
                to={l.path}
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

        {/* Mobile menu */}
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

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[680px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2BB673]/10 rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5B82E]/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#2BB673]/20 text-[#2BB673] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Your Local Community Hub
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                What's Happening<br />
                <span className="text-[#2BB673]">Near You?</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
                Discover local events, family activities, food specials, businesses, offers, and services — all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/community')} className="flex items-center gap-2 px-6 py-3.5 bg-[#2BB673] text-white font-bold rounded-xl hover:bg-[#25a062] transition-all shadow-xl shadow-[#2BB673]/30 hover:-translate-y-0.5">
                  <Calendar className="w-5 h-5" />
                  See This Weekend
                </button>
                <button onClick={() => navigate('/offers')} className="flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  <Tag className="w-5 h-5" />
                  Find Services
                </button>
                <button onClick={() => navigate('/business')} className="flex items-center gap-2 px-6 py-3.5 bg-[#F5B82E] text-slate-900 font-bold rounded-xl hover:bg-[#e0a828] transition-all hover:-translate-y-0.5">
                  <Store className="w-5 h-5" />
                  Join as a Business
                </button>
              </div>

              {/* Quick stats */}
              <div className="mt-10 flex flex-wrap gap-6">
                {[
                  { v: '500+', l: 'Local Businesses' },
                  { v: '2,400+', l: 'Community Members' },
                  { v: '150+', l: 'Events This Month' },
                ].map(s => (
                  <div key={s.l}>
                    <div className="text-2xl font-extrabold text-white">{s.v}</div>
                    <div className="text-xs text-slate-400">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — event preview cards */}
            <div className="hidden lg:block relative">
              <div className="space-y-3">
                {MOCK_EVENTS.map((evt, i) => (
                  <div key={evt.id} className={`flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer ${i === 1 ? 'ml-6' : ''}`}
                    onClick={() => navigate('/community')}>
                    <img src={evt.image} alt={evt.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#2BB673] font-semibold mb-0.5">{evt.category}</div>
                      <div className="font-bold text-white truncate">{evt.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3" />{evt.date} · {evt.time}
                        <MapPin className="w-3 h-3 ml-1" />{evt.location}
                      </div>
                    </div>
                    {evt.is_free && <span className="text-xs bg-[#2BB673] text-white px-2 py-0.5 rounded-full font-semibold flex-shrink-0">FREE</span>}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button onClick={() => navigate('/community')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1 mx-auto">
                  View Full Calendar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── THIS WEEKEND ─────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-[#F5B82E] mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Happening Near You</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">This Weekend</h2>
              </div>
              <button onClick={() => navigate('/community')} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2BB673] hover:gap-3 transition-all">
                View Full Calendar <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_EVENTS.map(evt => (
                <div key={evt.id} onClick={() => navigate('/community')}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 bg-white/95 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      {evt.category}
                    </div>
                    {evt.is_free && (
                      <div className="absolute top-3 right-3 bg-[#2BB673] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        FREE
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-[#2BB673] transition-colors">{evt.title}</h3>
                    <div className="space-y-1 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{evt.date} at {evt.time}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{evt.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <button onClick={() => navigate('/community')} className="text-[#2BB673] font-semibold flex items-center gap-2 mx-auto">
                View Full Calendar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOD & DINING ─────────────────────────────────────────────── */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                  <Utensils className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Today's Picks</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Where Should We Eat?</h2>
              </div>
              <button onClick={() => navigate('/food')} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2BB673] hover:gap-3 transition-all">
                See All Dining <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MOCK_DINING.map(item => (
                <div key={item.id} onClick={() => navigate('/food')}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <div className="h-36 bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
                    <Utensils className="w-12 h-12 text-orange-300" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-orange-500 font-semibold mb-1">{item.valid_day}</div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#2BB673] transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    <div className="mt-2 text-xs text-slate-400 font-medium">{item.business}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KIDS & FAMILY ──────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Baby className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Family Fun</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Family-Friendly Things To Do</h2>
              </div>
              <button onClick={() => navigate('/kids-family')} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2BB673] hover:gap-3 transition-all">
                See All Family Activities <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MOCK_KIDS.map(item => (
                <div key={item.id} onClick={() => navigate('/kids-family')}
                  className="relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{item.type}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 group-hover:text-[#2BB673] transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPECIAL OFFERS ──────────────────────────────────────────────── */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-[#2BB673] mb-2">
                  <Tag className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Local Promotions</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Special Offers from Local Businesses</h2>
                <p className="text-slate-500 mt-1">Exclusive experiences and services from trusted local businesses.</p>
              </div>
              <button onClick={() => navigate('/offers')} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2BB673] hover:gap-3 transition-all">
                View All Offers <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MOCK_OFFERS.map(offer => (
                <div key={offer.id} onClick={() => navigate('/offers')}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-slate-400 mb-1">{offer.business}</div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#2BB673] transition-colors mb-2">{offer.title}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-slate-900">{offer.price}</span>
                      <span className="text-sm text-slate-400 line-through">{offer.original}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOCAL JOBS ──────────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Briefcase className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Now Hiring Locally</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900">Local Jobs & Gigs</h2>
              </div>
              <button onClick={() => navigate('/community')} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2BB673] hover:gap-3 transition-all">
                View All Jobs <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_JOBS.map(job => (
                <div key={job.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#2BB673]/30 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-[#2BB673] transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-[#2BB673] transition-colors">{job.title}</h3>
                      <div className="text-sm text-slate-500">{job.business}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-slate-700">{job.pay}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{job.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GIVEAWAY ─────────────────────────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-br from-[#F5B82E]/10 to-[#F5B82E]/5">
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
                    Win a curated bundle of gift cards and experiences from top local businesses.
                    Enter for free — new winner every two weeks!
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

        {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">One Platform — Every Local Need</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-14">
              Whether you're looking for something to do, a service to hire, or a business to grow — it all starts here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Calendar, color: 'bg-[#2BB673]/10 text-[#2BB673]', title: 'Discover', desc: 'Find local events, weekend activities, dining specials, kids programs, and community happenings.' },
                { icon: TrendingUp, color: 'bg-blue-50 text-blue-600', title: 'Grow', desc: 'Local businesses get visible through events, promotions, and community presence — not just ads.' },
                { icon: Zap, color: 'bg-amber-50 text-amber-600', title: 'Automate', desc: 'AI tools help businesses follow up, book appointments, and keep customers coming back automatically.' },
              ].map(item => (
                <div key={item.title} className="p-8 bg-slate-50 rounded-2xl text-left hover:shadow-md transition-shadow">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-5`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MAKE MONEY WITH US ──────────────────────────────────────────── */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#F5B82E]/20 text-[#F5B82E] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
                  <DollarSign className="w-3.5 h-3.5" />
                  Partner Program
                </div>
                <h2 className="text-4xl font-extrabold mb-4">Want to Earn<br />Helping Local Businesses?</h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Become a Local-Link partner and earn recurring commissions by helping local businesses get found, post events, promote offers, and grow.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    'Share offers, earn on every sale',
                    'Refer merchants for recurring commissions',
                    'Sell community visibility packages',
                    'Pick up local job-board work',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-[#2BB673] flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/earn')} className="px-8 py-3.5 bg-[#2BB673] text-white font-bold rounded-xl hover:bg-[#25a062] transition-all shadow-xl shadow-[#2BB673]/30 hover:-translate-y-0.5">
                  Become a Partner — Free
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Avg Monthly Earnings', value: '$485' },
                  { label: 'Active Partners', value: '2,400+' },
                  { label: 'Total Paid Out', value: '$1.2M+' },
                  { label: 'Partner Retention', value: '94%' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/10 rounded-2xl p-6 text-center border border-white/10">
                    <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── OWN A BUSINESS CTA ──────────────────────────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-[#2BB673]/5 to-[#2BB673]/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Store className="w-14 h-14 text-[#2BB673] mx-auto mb-5" />
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Own a Local Business?</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Get found, post events, promote offers, and get booked — all from one platform designed for local businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/business')} className="px-8 py-4 bg-[#2BB673] text-white font-bold rounded-xl hover:bg-[#25a062] transition-all shadow-xl shadow-[#2BB673]/25 text-lg">
                Join as a Merchant
              </button>
              <button onClick={() => navigate('/business/pricing')} className="px-8 py-4 bg-white text-slate-800 font-semibold rounded-xl border border-slate-200 hover:border-[#2BB673] hover:text-[#2BB673] transition-all text-lg">
                View Plans &amp; Pricing
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
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
                  {[['About', '/about'], ['How It Works', '/how-it-works'], ['FAQ', '/faq'], ['Login', '/login']].map(([l, p]) => (
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
