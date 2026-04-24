import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Clock, Users, Star, ChevronLeft, ChevronRight,
  Filter, Search, ArrowRight, Sparkles, Tag, Heart, ExternalLink,
  Store, Gift, BookOpen, Briefcase
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface CommunityEvent {
  id: string;
  title: string;
  short_description: string;
  description: string;
  image_url: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  location_address: string | null;
  city: string | null;
  is_free: boolean;
  ticket_price_cents: number;
  ticket_url: string | null;
  is_featured: boolean;
  is_sponsored: boolean;
  homepage_placement: boolean;
  rsvp_count: number;
  tags: string[];
  merchant: {
    id: string;
    business_name: string;
    city: string;
  } | null;
  category: {
    name: string;
    slug: string;
    color: string;
    icon: string;
  } | null;
  promotions?: EventPromotion[];
}

interface EventPromotion {
  id: string;
  title: string;
  description: string;
  discount_percent: number | null;
  discount_amount_cents: number | null;
  promo_code: string | null;
}

interface EventCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Mock events for when DB is empty
const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: '1',
    title: 'Spring Farmers Market',
    short_description: 'Fresh local produce, artisan goods, and live music every Saturday morning.',
    description: '',
    image_url: 'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=800',
    event_date: new Date().toISOString().split('T')[0],
    start_time: '8:00 AM',
    end_time: '1:00 PM',
    location_name: 'Town Square',
    location_address: '100 Main Street',
    city: 'Your City',
    is_free: true,
    ticket_price_cents: 0,
    ticket_url: null,
    is_featured: true,
    is_sponsored: true,
    homepage_placement: true,
    rsvp_count: 142,
    tags: ['family', 'food', 'outdoor'],
    merchant: { id: 'm1', business_name: 'Green Valley Farms', city: 'Your City' },
    category: { name: 'Shopping & Markets', slug: 'shopping', color: '#F97316', icon: 'shopping-bag' },
    promotions: [{ id: 'p1', title: '10% off first purchase', description: 'Show this at checkout', discount_percent: 10, discount_amount_cents: null, promo_code: 'MARKET10' }],
  },
  {
    id: '2',
    title: 'Business Networking Breakfast',
    short_description: 'Connect with local business owners over breakfast. Grow your network, grow your business.',
    description: '',
    image_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    event_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    start_time: '7:30 AM',
    end_time: '9:00 AM',
    location_name: 'The Grand Hotel',
    location_address: '200 Commerce Blvd',
    city: 'Your City',
    is_free: false,
    ticket_price_cents: 1500,
    ticket_url: null,
    is_featured: true,
    is_sponsored: false,
    homepage_placement: false,
    rsvp_count: 47,
    tags: ['business', 'networking'],
    merchant: { id: 'm2', business_name: 'Local Chamber of Commerce', city: 'Your City' },
    category: { name: 'Business & Networking', slug: 'business', color: '#3B82F6', icon: 'briefcase' },
    promotions: [],
  },
  {
    id: '3',
    title: "Kids' Art Workshop",
    short_description: 'Creative art classes for kids ages 5-12. All materials provided. Limited spots!',
    description: '',
    image_url: 'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg?auto=compress&cs=tinysrgb&w=800',
    event_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    start_time: '10:00 AM',
    end_time: '12:00 PM',
    location_name: 'Creative Studio',
    location_address: '45 Arts Lane',
    city: 'Your City',
    is_free: false,
    ticket_price_cents: 2000,
    ticket_url: null,
    is_featured: false,
    is_sponsored: false,
    homepage_placement: false,
    rsvp_count: 18,
    tags: ['kids', 'arts', 'education'],
    merchant: { id: 'm3', business_name: 'Creative Studio', city: 'Your City' },
    category: { name: 'Family & Kids', slug: 'family', color: '#F59E0B', icon: 'users' },
    promotions: [],
  },
  {
    id: '4',
    title: 'Outdoor Yoga in the Park',
    short_description: 'Free community yoga every Sunday morning. All skill levels welcome. Bring your mat!',
    description: '',
    image_url: 'https://images.pexels.com/photos/1599901/pexels-photo-1599901.jpeg?auto=compress&cs=tinysrgb&w=800',
    event_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    start_time: '8:00 AM',
    end_time: '9:00 AM',
    location_name: 'Riverside Park',
    location_address: 'Park Drive',
    city: 'Your City',
    is_free: true,
    ticket_price_cents: 0,
    ticket_url: null,
    is_featured: false,
    is_sponsored: false,
    homepage_placement: false,
    rsvp_count: 63,
    tags: ['fitness', 'free', 'outdoor'],
    merchant: { id: 'm4', business_name: 'Zen Wellness Studio', city: 'Your City' },
    category: { name: 'Health & Fitness', slug: 'fitness', color: '#10B981', icon: 'heart' },
    promotions: [{ id: 'p2', title: 'First class free at our studio', description: 'Mention this event', discount_percent: 100, discount_amount_cents: null, promo_code: 'PARKFREE' }],
  },
  {
    id: '5',
    title: 'Local Food Truck Festival',
    short_description: '20+ food trucks, live music, and family fun. The biggest food event of the season!',
    description: '',
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    event_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    start_time: '11:00 AM',
    end_time: '9:00 PM',
    location_name: 'Central Park Pavilion',
    location_address: '1 Park Ave',
    city: 'Your City',
    is_free: true,
    ticket_price_cents: 0,
    ticket_url: null,
    is_featured: true,
    is_sponsored: true,
    homepage_placement: false,
    rsvp_count: 389,
    tags: ['food', 'family', 'free', 'outdoor'],
    merchant: { id: 'm5', business_name: 'City Events Committee', city: 'Your City' },
    category: { name: 'Food & Drink', slug: 'food', color: '#EF4444', icon: 'utensils' },
    promotions: [],
  },
  {
    id: '6',
    title: 'Small Business Saturday Pop-Up',
    short_description: 'Shop local! 30+ small businesses in one place. Unique gifts, services, and experiences.',
    description: '',
    image_url: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
    event_date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    start_time: '10:00 AM',
    end_time: '5:00 PM',
    location_name: 'Convention Center',
    location_address: '500 Convention Way',
    city: 'Your City',
    is_free: true,
    ticket_price_cents: 0,
    ticket_url: null,
    is_featured: false,
    is_sponsored: false,
    homepage_placement: false,
    rsvp_count: 201,
    tags: ['shopping', 'community', 'free'],
    merchant: { id: 'm6', business_name: 'Local Business Alliance', city: 'Your City' },
    category: { name: 'Community & Civic', slug: 'community', color: '#6B7280', icon: 'home' },
    promotions: [],
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'All Events' },
  { key: 'today', label: 'Today' },
  { key: 'weekend', label: 'This Weekend' },
  { key: 'free', label: 'Free' },
  { key: 'family', label: 'Family' },
  { key: 'business', label: 'Business' },
  { key: 'featured', label: 'Featured' },
];

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getDatesInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [rsvpdEvents, setRsvpdEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadEvents();
    loadCategories();
    if (user) loadUserRsvps();
  }, [user]);

  async function loadCategories() {
    const { data } = await supabase
      .from('event_categories')
      .select('id, name, slug, color')
      .order('sort_order');
    if (data) setCategories(data);
  }

  async function loadEvents() {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('community_events')
        .select(`
          id, title, short_description, description, image_url,
          event_date, start_time, end_time, location_name, location_address, city,
          is_free, ticket_price_cents, ticket_url,
          is_featured, is_sponsored, homepage_placement,
          rsvp_count, tags,
          merchant:merchants(id, business_name, city),
          category:event_categories(name, slug, color, icon),
          promotions:event_promotions(id, title, description, discount_percent, discount_amount_cents, promo_code)
        `)
        .eq('status', 'active')
        .gte('event_date', today)
        .order('is_featured', { ascending: false })
        .order('event_date', { ascending: true })
        .limit(60);

      if (error) throw error;
      setEvents(data && data.length > 0 ? (data as unknown as CommunityEvent[]) : MOCK_EVENTS);
    } catch {
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserRsvps() {
    if (!user) return;
    const { data } = await supabase
      .from('event_rsvps')
      .select('event_id')
      .eq('user_id', user.id)
      .in('status', ['going', 'interested']);
    if (data) setRsvpdEvents(new Set(data.map(r => r.event_id)));
  }

  async function handleRsvp(eventId: string) {
    if (!user) { navigate('/login'); return; }
    const isRsvpd = rsvpdEvents.has(eventId);
    if (isRsvpd) {
      await supabase.from('event_rsvps').delete().eq('event_id', eventId).eq('user_id', user.id);
      setRsvpdEvents(prev => { const s = new Set(prev); s.delete(eventId); return s; });
    } else {
      await supabase.from('event_rsvps').insert({ event_id: eventId, user_id: user.id, status: 'going' });
      setRsvpdEvents(prev => new Set(prev).add(eventId));
    }
  }

  const filteredEvents = events.filter(e => {
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !e.short_description.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const saturday = (() => {
      const d = new Date(); const day = d.getDay();
      d.setDate(d.getDate() + (6 - day)); return d.toISOString().split('T')[0];
    })();
    const sunday = (() => {
      const d = new Date(); const day = d.getDay();
      d.setDate(d.getDate() + (7 - day)); return d.toISOString().split('T')[0];
    })();

    if (activeFilter === 'today') return e.event_date === today;
    if (activeFilter === 'weekend') return e.event_date >= saturday && e.event_date <= sunday;
    if (activeFilter === 'free') return e.is_free;
    if (activeFilter === 'family') return e.category?.slug === 'family' || e.tags.includes('family');
    if (activeFilter === 'business') return e.category?.slug === 'business';
    if (activeFilter === 'featured') return e.is_featured;
    return true;
  });

  const featuredEvents = filteredEvents.filter(e => e.is_featured || e.is_sponsored);
  const regularEvents = filteredEvents.filter(e => !e.is_featured && !e.is_sponsored);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const calendarDays = getDatesInMonth(year, month);
  const eventsByDate = events.reduce((acc, e) => {
    const d = e.event_date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(e);
    return acc;
  }, {} as Record<string, CommunityEvent[]>);

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div>
                <div className="flex items-center gap-2 text-green-400 mb-3 text-sm font-semibold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  What's Happening Nearby
                </div>
                <h1 className="text-4xl font-extrabold mb-3">Community Calendar</h1>
                <p className="text-slate-300 text-lg max-w-xl">
                  Discover events, connect with local businesses, and find what's happening in your community — all in one place.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  <Calendar className="w-4 h-4 inline mr-1.5" />
                  Calendar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, businesses, activities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeFilter === tab.key
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
          </div>
        ) : viewMode === 'calendar' ? (
          /* ── Calendar View ── */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">{MONTHS[month]} {year}</h2>
              <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS.map(d => (
                <div key={d} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                const dayEvents = dateStr ? (eventsByDate[dateStr] || []) : [];
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                return (
                  <div key={idx} className={`min-h-24 p-2 border-b border-r border-gray-50 ${!day ? 'bg-gray-50/50' : 'hover:bg-gray-50/50'}`}>
                    {day && (
                      <>
                        <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-slate-900 text-white' : 'text-gray-700'}`}>
                          {day}
                        </span>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(e => (
                            <div
                              key={e.id}
                              onClick={() => navigate(`/community/event/${e.id}`)}
                              className="text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: e.category?.color + '20', color: e.category?.color || '#374151' }}
                            >
                              {e.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 px-1">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── List View ── */
          <div className="space-y-10">

            {/* Featured / Sponsored Events */}
            {featuredEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <Star className="w-5 h-5 text-amber-500 fill-current" />
                  <h2 className="text-xl font-bold text-gray-900">Featured Events</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isRsvpd={rsvpdEvents.has(event.id)}
                      onRsvp={() => handleRsvp(event.id)}
                      onViewBusiness={() => navigate(`/business/${event.merchant?.id}`)}
                      featured
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Upcoming Events */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeFilter === 'all' ? 'Upcoming Events' : FILTER_TABS.find(t => t.key === activeFilter)?.label}
                  <span className="ml-2 text-sm font-normal text-gray-500">({filteredEvents.length} events)</span>
                </h2>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-700 mb-1">No events found</h3>
                  <p className="text-gray-500 text-sm">Try a different filter or check back soon.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map(event => (
                    <EventListItem
                      key={event.id}
                      event={event}
                      isRsvpd={rsvpdEvents.has(event.id)}
                      onRsvp={() => handleRsvp(event.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Soft Recruitment */}
            <section className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 text-white rounded-2xl p-8">
                <Store className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Own a Business?</h3>
                <p className="text-slate-300 mb-5 text-sm">
                  Post your events to the community calendar, attract local customers, and grow your business on Local-Link.
                </p>
                <button
                  onClick={() => navigate('/for-businesses')}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  Get Listed <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-8">
                <Sparkles className="w-10 h-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Want to Earn?</h3>
                <p className="text-gray-600 mb-5 text-sm">
                  Help local businesses get listed and earn recurring commissions. No experience needed — we give you the tools.
                </p>
                <button
                  onClick={() => navigate('/earn')}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  Become a Partner <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ── EventCard (grid) ── */
function EventCard({
  event, isRsvpd, onRsvp, onViewBusiness, featured = false,
}: {
  event: CommunityEvent;
  isRsvpd: boolean;
  onRsvp: () => void;
  onViewBusiness: () => void;
  featured?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${featured ? 'border-amber-200 ring-1 ring-amber-100' : 'border-gray-100'}`}>
      <div className="relative">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 flex items-center justify-center" style={{ backgroundColor: (event.category?.color || '#2BB673') + '20' }}>
            <Calendar className="w-12 h-12" style={{ color: event.category?.color || '#2BB673' }} />
          </div>
        )}
        {featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )}
        {event.is_free && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            FREE
          </div>
        )}
        {event.category && (
          <div
            className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: event.category.color + '20', color: event.category.color }}
          >
            {event.category.name}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.short_description}</p>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{formatEventDate(event.event_date)}{event.start_time ? ` · ${event.start_time}` : ''}</span>
          </div>
          {event.location_name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{event.location_name}{event.city ? `, ${event.city}` : ''}</span>
            </div>
          )}
          {event.rsvp_count > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{event.rsvp_count} {event.rsvp_count === 1 ? 'person' : 'people'} going</span>
            </div>
          )}
        </div>

        {event.promotions && event.promotions.length > 0 && (
          <div className="mb-4 bg-green-50 border border-green-100 rounded-xl p-3">
            <div className="flex items-center gap-2 text-green-700 text-xs font-bold mb-1">
              <Tag className="w-3.5 h-3.5" />
              Special Offer
            </div>
            <p className="text-green-800 text-sm font-medium">{event.promotions[0].title}</p>
            {event.promotions[0].promo_code && (
              <p className="text-xs text-green-600 mt-1">Code: <span className="font-mono font-bold">{event.promotions[0].promo_code}</span></p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t border-gray-50">
          <button
            onClick={onRsvp}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isRsvpd
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 inline mr-1.5 ${isRsvpd ? 'fill-current' : ''}`} />
            {isRsvpd ? "I'm Going" : 'RSVP'}
          </button>
          {event.merchant && (
            <button
              onClick={onViewBusiness}
              className="px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title="View Business"
            >
              <Store className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── EventListItem (horizontal) ── */
function EventListItem({
  event, isRsvpd, onRsvp,
}: {
  event: CommunityEvent;
  isRsvpd: boolean;
  onRsvp: () => void;
}) {
  const eventDate = new Date(event.event_date + 'T00:00:00');
  const dayNum = eventDate.getDate();
  const monthAbbr = eventDate.toLocaleDateString('en-US', { month: 'short' });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all flex gap-5">
      {/* Date badge */}
      <div
        className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white font-bold"
        style={{ backgroundColor: event.category?.color || '#2BB673' }}
      >
        <span className="text-xs uppercase leading-none">{monthAbbr}</span>
        <span className="text-2xl leading-tight">{dayNum}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {event.is_featured && (
                <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Featured</span>
              )}
              {event.is_free ? (
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Free</span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  ${((event.ticket_price_cents || 0) / 100).toFixed(0)}
                </span>
              )}
              {event.category && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: event.category.color + '15', color: event.category.color }}>
                  {event.category.name}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{event.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-1 mt-0.5">{event.short_description}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 mt-3 text-sm text-gray-500 flex-wrap">
          {event.start_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}
            </span>
          )}
          {event.location_name && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {event.location_name}
            </span>
          )}
          {event.merchant && (
            <span className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              {event.merchant.business_name}
            </span>
          )}
          {event.rsvp_count > 0 && (
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {event.rsvp_count} going
            </span>
          )}
        </div>

        {event.promotions && event.promotions.length > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
            <Gift className="w-3.5 h-3.5" />
            {event.promotions[0].title}
          </div>
        )}
      </div>

      {/* RSVP */}
      <div className="flex-shrink-0 flex items-center">
        <button
          onClick={onRsvp}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            isRsvpd
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {isRsvpd ? "Going" : 'RSVP'}
        </button>
      </div>
    </div>
  );
}
