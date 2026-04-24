import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, Calendar, Utensils, Baby, Briefcase, Gift, MapPin, Clock,
  Users, ArrowRight, Sparkles, Bell, Heart, ChevronRight, Flame,
  TrendingUp, Zap, Plus, Search
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface FeedEvent {
  id: string;
  title: string;
  short_description: string;
  event_date: string;
  start_time: string | null;
  location_name: string | null;
  is_free: boolean;
  ticket_price_cents: number;
  image_url: string | null;
  rsvp_count: number;
  is_featured: boolean;
  category?: { name: string; color: string } | null;
}

interface FeedOffer {
  id: string;
  title: string;
  short_description: string;
  price_cents: number;
  original_value_cents: number;
  image_url: string | null;
  merchant: { business_name: string; city: string };
}

interface FeedGiveaway {
  id: string;
  title: string;
  prize: string;
  end_date: string;
  entry_count: number;
  image_url: string | null;
}

interface FollowedCategory {
  follow_slug: string;
  follow_type: string;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  food: { icon: Utensils, color: 'text-orange-500', label: 'Food & Dining' },
  kids: { icon: Baby, color: 'text-blue-500', label: 'Kids & Family' },
  jobs: { icon: Briefcase, color: 'text-slate-600', label: 'Local Jobs' },
  giveaways: { icon: Gift, color: 'text-pink-500', label: 'Giveaways' },
  events: { icon: Calendar, color: 'text-green-500', label: 'Events' },
  business: { icon: Briefcase, color: 'text-blue-600', label: 'Business Events' },
};

const MOCK_EVENTS: FeedEvent[] = [
  {
    id: 'e1', title: 'Spring Farmers Market', short_description: 'Fresh produce, artisan goods, live music.',
    event_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    start_time: '8:00 AM', location_name: 'Town Square', is_free: true, ticket_price_cents: 0,
    image_url: 'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600',
    rsvp_count: 142, is_featured: true, category: { name: 'Community', color: '#10B981' }
  },
  {
    id: 'e2', title: 'Business Networking Breakfast', short_description: 'Connect with local business owners.',
    event_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    start_time: '7:30 AM', location_name: 'The Grand Hotel', is_free: false, ticket_price_cents: 1500,
    image_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600',
    rsvp_count: 47, is_featured: false, category: { name: 'Business', color: '#3B82F6' }
  },
];

const MOCK_OFFERS: FeedOffer[] = [
  {
    id: 'o1', title: 'Signature Facial + Consultation',
    short_description: 'Personalized skin treatment. Deep cleanse, exfoliation, custom mask.',
    price_cents: 8500, original_value_cents: 12000,
    image_url: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=600',
    merchant: { business_name: 'Radiance Spa', city: 'Austin' }
  },
  {
    id: 'o2', title: "Chef's Tasting Menu for Two",
    short_description: 'Five-course seasonal menu from local ingredients.',
    price_cents: 13500, original_value_cents: 19000,
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    merchant: { business_name: 'Oak & Ember Kitchen', city: 'Austin' }
  },
];

const MOCK_GIVEAWAY: FeedGiveaway = {
  id: 'g1', title: '$500 Local Business Gift Card Bundle',
  prize: '$500 in gift cards to 5 local businesses',
  end_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
  entry_count: 312,
  image_url: 'https://images.pexels.com/photos/1179762/pexels-photo-1179762.jpeg?auto=compress&cs=tinysrgb&w=600',
};

const FOLLOW_OPTIONS = [
  { slug: 'food', label: 'Food & Dining', icon: Utensils, color: 'bg-orange-50 border-orange-200 text-orange-600' },
  { slug: 'kids', label: 'Kids & Family', icon: Baby, color: 'bg-blue-50 border-blue-200 text-blue-600' },
  { slug: 'events', label: 'Local Events', icon: Calendar, color: 'bg-green-50 border-green-200 text-green-600' },
  { slug: 'jobs', label: 'Local Jobs', icon: Briefcase, color: 'bg-slate-50 border-slate-200 text-slate-600' },
  { slug: 'giveaways', label: 'Giveaways', icon: Gift, color: 'bg-pink-50 border-pink-200 text-pink-600' },
  { slug: 'business', label: 'Business Events', icon: TrendingUp, color: 'bg-blue-50 border-blue-200 text-blue-700' },
];

function fmtDate(d: string) {
  const date = new Date(d + 'T00:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function daysUntil(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff <= 0) return 'Ends today';
  if (diff === 1) return '1 day left';
  return `${diff} days left`;
}

export default function MyFeedPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [offers, setOffers] = useState<FeedOffer[]>([]);
  const [giveaway, setGiveaway] = useState<FeedGiveaway | null>(null);
  const [follows, setFollows] = useState<FollowedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingFollow, setSavingFollow] = useState<string | null>(null);

  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    loadFeed();
  }, [user]);

  async function loadFeed() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    const [eventsRes, offersRes, giveawayRes, followsRes] = await Promise.allSettled([
      supabase.from('community_events')
        .select('id, title, short_description, event_date, start_time, location_name, is_free, ticket_price_cents, image_url, rsvp_count, is_featured, category:event_categories(name, color)')
        .in('status', ['approved', 'active'])
        .gte('event_date', today)
        .order('is_featured', { ascending: false })
        .order('event_date', { ascending: true })
        .limit(6),
      supabase.from('deals')
        .select('id, title, short_description, price_cents, original_value_cents, image_url, merchant:merchants!inner(business_name, city)')
        .eq('status', 'active')
        .gte('end_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(4),
      supabase.from('giveaways')
        .select('id, title, prize, end_date, entry_count, image_url')
        .eq('status', 'active')
        .gte('end_date', today)
        .order('featured', { ascending: false })
        .limit(1)
        .maybeSingle(),
      user ? supabase.from('user_follows').select('follow_slug, follow_type').eq('user_id', user.id) : Promise.resolve({ data: [], error: null }),
    ]);

    const evData = eventsRes.status === 'fulfilled' ? eventsRes.value.data : null;
    const offData = offersRes.status === 'fulfilled' ? offersRes.value.data : null;
    const gvData = giveawayRes.status === 'fulfilled' ? (giveawayRes.value as any).data : null;
    const flData = followsRes.status === 'fulfilled' ? (followsRes.value as any).data : [];

    setEvents(evData && evData.length > 0 ? (evData as unknown as FeedEvent[]) : MOCK_EVENTS);
    setOffers(offData && offData.length > 0 ? (offData as unknown as FeedOffer[]) : MOCK_OFFERS);
    setGiveaway(gvData || MOCK_GIVEAWAY);
    setFollows(flData || []);
    setLoading(false);
  }

  const followedSlugs = useMemo(() => new Set(follows.map(f => f.follow_slug)), [follows]);

  async function toggleFollow(slug: string) {
    if (!user) { navigate('/login'); return; }
    setSavingFollow(slug);
    const isFollowing = followedSlugs.has(slug);
    if (isFollowing) {
      await supabase.from('user_follows').delete().eq('user_id', user.id).eq('follow_slug', slug).eq('follow_type', 'category');
      setFollows(prev => prev.filter(f => f.follow_slug !== slug));
    } else {
      await supabase.from('user_follows').insert({ user_id: user.id, follow_type: 'category', follow_slug: slug });
      setFollows(prev => [...prev, { follow_slug: slug, follow_type: 'category' }]);
    }
    setSavingFollow(null);
  }

  const thisWeekendEvents = events.filter(e => {
    const d = new Date(e.event_date);
    const day = d.getDay();
    return day === 0 || day === 6;
  });

  const summaryStats = [
    { icon: Calendar, label: `${Math.min(events.length, 3)} events this weekend`, color: 'text-green-500' },
    { icon: Utensils, label: '2 food specials nearby', color: 'text-orange-500' },
    { icon: Baby, label: '4 family activities', color: 'text-blue-500' },
    { icon: Gift, label: giveaway ? '1 giveaway ending soon' : 'No active giveaways', color: 'text-pink-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-8">

        {/* Personalized Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2BB673]/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{greeting},</p>
                <h1 className="text-3xl font-extrabold mb-2">{firstName} <span className="text-[#2BB673]">Local Feed</span></h1>
                <p className="text-slate-300 max-w-md">Here's what's happening near you. Personalized just for you.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate('/community')}
                  className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4" /> Browse All
                </button>
                <button onClick={() => navigate('/plan-weekend')}
                  className="px-4 py-2 bg-[#2BB673] text-white text-sm font-bold rounded-xl hover:bg-[#25a062] transition-colors flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Plan Weekend
                </button>
              </div>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {summaryStats.map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                  <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                  <span className="text-xs text-slate-300 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Follow Topics */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Follow Topics You Love</h2>
              <p className="text-sm text-slate-500">Get personalized updates for the things that matter to you.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {FOLLOW_OPTIONS.map(opt => {
              const isFollowing = followedSlugs.has(opt.slug);
              return (
                <button
                  key={opt.slug}
                  onClick={() => toggleFollow(opt.slug)}
                  disabled={savingFollow === opt.slug}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    isFollowing
                      ? 'bg-[#2BB673] text-white border-[#2BB673] shadow-md shadow-[#2BB673]/20'
                      : `${opt.color} hover:shadow-sm`
                  } ${savingFollow === opt.slug ? 'opacity-60' : ''}`}
                >
                  <opt.icon className="w-3.5 h-3.5" />
                  {opt.label}
                  {isFollowing && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">Following</span>}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2BB673]" />
          </div>
        ) : (
          <>
            {/* Recommended Events */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <h2 className="text-xl font-bold text-slate-900">Recommended For You</h2>
                </div>
                <button onClick={() => navigate('/community')}
                  className="text-sm text-[#2BB673] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  See all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.slice(0, 3).map(event => (
                  <FeedEventCard key={event.id} event={event} onClick={() => navigate('/community')} />
                ))}
              </div>
            </section>

            {/* This Weekend */}
            {thisWeekendEvents.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-bold text-slate-900">Happening This Weekend</h2>
                  </div>
                  <button onClick={() => navigate('/community')}
                    className="text-sm text-[#2BB673] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    See all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {thisWeekendEvents.slice(0, 3).map(event => (
                    <WeekendEventRow key={event.id} event={event} onClick={() => navigate('/community')} />
                  ))}
                </div>
              </section>
            )}

            {/* Special Offers */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-slate-900">Local Offers Near You</h2>
                </div>
                <button onClick={() => navigate('/offers')}
                  className="text-sm text-[#2BB673] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  See all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {offers.slice(0, 2).map(offer => (
                  <OfferFeedCard key={offer.id} offer={offer} onClick={() => navigate('/offers')} />
                ))}
              </div>
            </section>

            {/* Active Giveaway */}
            {giveaway && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Gift className="w-5 h-5 text-pink-500" />
                  <h2 className="text-xl font-bold text-slate-900">Active Giveaway</h2>
                </div>
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    {giveaway.image_url && (
                      <img src={giveaway.image_url} alt={giveaway.title}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-lg" />
                    )}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-pink-200 mb-1">
                        {daysUntil(giveaway.end_date)}
                      </div>
                      <h3 className="text-xl font-bold mb-1">{giveaway.title}</h3>
                      <p className="text-pink-100 text-sm">{giveaway.prize}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-pink-200">
                        <Users className="w-3.5 h-3.5" />
                        {giveaway.entry_count} entries so far
                      </div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/community')}
                    className="px-6 py-3 bg-white text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition-colors flex-shrink-0 flex items-center gap-2">
                    Enter Free <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </section>
            )}

            {/* Quick links for followed categories */}
            {followedSlugs.size > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Bell className="w-5 h-5 text-[#2BB673]" />
                  <h2 className="text-xl font-bold text-slate-900">Your Followed Topics</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FOLLOW_OPTIONS.filter(opt => followedSlugs.has(opt.slug)).map(opt => {
                    const routes: Record<string, string> = {
                      food: '/food', kids: '/kids-family', events: '/community',
                      jobs: '/community', giveaways: '/community', business: '/community',
                    };
                    return (
                      <button key={opt.slug} onClick={() => navigate(routes[opt.slug] || '/community')}
                        className={`flex items-center gap-3 p-4 rounded-xl border ${opt.color} hover:shadow-md transition-all text-left`}>
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          <opt.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{opt.label}</div>
                          <div className="text-xs opacity-70">New updates</div>
                        </div>
                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* CTA row */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                <div className="w-10 h-10 bg-[#2BB673]/20 rounded-xl flex items-center justify-center mb-4">
                  <Plus className="w-5 h-5 text-[#2BB673]" />
                </div>
                <h3 className="font-bold text-lg mb-1">Own a Local Business?</h3>
                <p className="text-slate-300 text-sm mb-4">List your business, post events and offers, and reach thousands of local customers.</p>
                <button onClick={() => navigate('/business')}
                  className="flex items-center gap-2 bg-[#2BB673] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#25a062] transition-colors">
                  Get Listed <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">Make Money With Us</h3>
                <p className="text-slate-600 text-sm mb-4">Refer local businesses and earn recurring commissions. No experience needed.</p>
                <button onClick={() => navigate('/earn')}
                  className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function FeedEventCard({ event, onClick }: { event: FeedEvent; onClick: () => void }) {
  const savings = event.is_free ? null : null;
  return (
    <div onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
      <div className="relative h-44 overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2BB673]/20 to-green-100 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-[#2BB673]/40" />
          </div>
        )}
        {event.is_featured && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Featured
          </div>
        )}
        {event.is_free && (
          <div className="absolute top-3 right-3 bg-[#2BB673] text-white text-xs font-bold px-2.5 py-1 rounded-full">FREE</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-[#2BB673] transition-colors">{event.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-1 mb-3">{event.short_description}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{fmtDate(event.event_date)}</span>
          {event.location_name && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location_name}</span>}
        </div>
        {event.rsvp_count > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            <Users className="w-3 h-3" /> {event.rsvp_count} going
          </div>
        )}
      </div>
    </div>
  );
}

function WeekendEventRow({ event, onClick }: { event: FeedEvent; onClick: () => void }) {
  const d = new Date(event.event_date + 'T00:00:00');
  return (
    <div onClick={onClick}
      className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
      <div className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white font-bold"
        style={{ backgroundColor: event.category?.color || '#2BB673' }}>
        <span className="text-xs uppercase">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
        <span className="text-xl leading-tight">{d.getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 group-hover:text-[#2BB673] transition-colors truncate">{event.title}</h4>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
          {event.start_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.start_time}</span>}
          {event.location_name && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location_name}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {event.is_free
          ? <span className="text-xs bg-[#2BB673]/10 text-[#2BB673] font-bold px-2 py-1 rounded-full">Free</span>
          : <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">${((event.ticket_price_cents || 0) / 100).toFixed(0)}</span>
        }
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </div>
    </div>
  );
}

function OfferFeedCard({ offer, onClick }: { offer: FeedOffer; onClick: () => void }) {
  const savings = Math.round(((offer.original_value_cents - offer.price_cents) / offer.original_value_cents) * 100);
  return (
    <div onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group flex">
      <div className="relative w-32 flex-shrink-0 overflow-hidden">
        {offer.image_url ? (
          <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-[#2BB673]/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#2BB673]/30" />
          </div>
        )}
        {savings > 0 && (
          <div className="absolute top-2 left-2 bg-amber-400 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full">-{savings}%</div>
        )}
      </div>
      <div className="p-4 flex-1 min-w-0">
        <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
          <MapPin className="w-3 h-3" />{offer.merchant.business_name}
        </div>
        <h4 className="font-bold text-slate-900 line-clamp-2 group-hover:text-[#2BB673] transition-colors text-sm mb-1">{offer.title}</h4>
        <p className="text-xs text-slate-500 line-clamp-1 mb-3">{offer.short_description}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900">${(offer.price_cents / 100).toFixed(0)}</span>
          <span className="text-sm text-slate-400 line-through">${(offer.original_value_cents / 100).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
