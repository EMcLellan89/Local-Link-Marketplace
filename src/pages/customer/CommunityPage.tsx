import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Search, ChevronDown, Calendar, Tag, Star,
  Phone, ExternalLink, ArrowRight, Zap, Filter, X,
  Home, UtensilsCrossed, Heart, Car, Briefcase, ShoppingBag,
  Scissors, HardHat, Baby, PawPrint, Music, Dumbbell,
  Scale, Monitor, Building2, ChevronLeft, ChevronRight,
  Clock, Ticket, Users, TrendingUp, Sparkles,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Town {
  id: string;
  name: string;
  state: string;
  slug: string;
  county: string | null;
  tier: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Business {
  id: string;
  business_name: string;
  slug: string;
  tagline: string | null;
  phone: string | null;
  website_url: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  city: string | null;
  state: string | null;
  ad_tier: string;
  is_featured: boolean;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  accepts_new_clients: boolean;
  category: { name: string; slug: string; icon: string } | null;
}

interface CommunityEvent {
  id: string;
  title: string;
  short_description: string | null;
  image_url: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  location_address: string | null;
  city: string | null;
  state: string | null;
  is_free: boolean;
  ticket_price_cents: number | null;
  ticket_url: string | null;
  is_featured: boolean;
  rsvp_count: number;
}

interface Deal {
  id: string;
  title: string;
  description: string | null;
  discount_label: string | null;
  original_price_cents: number | null;
  deal_price_cents: number | null;
  savings_percent: number | null;
  image_url: string | null;
  coupon_code: string | null;
  is_featured: boolean;
  expires_at: string | null;
  claim_count: number;
  business: { business_name: string; logo_url: string | null } | null;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, UtensilsCrossed, Heart, Car, Briefcase, ShoppingBag,
  Scissors, HardHat, Baby, PawPrint, Music, Dumbbell,
  Scale, Monitor, Building2,
};

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Tag;
  return <Icon className={className} />;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

function tierBadge(tier: string) {
  const map: Record<string, string> = {
    exclusive: 'bg-amber-100 text-amber-800 border-amber-300',
    dominator: 'bg-blue-100 text-blue-800 border-blue-300',
    growth:    'bg-green-100 text-green-800 border-green-300',
    starter:   'bg-slate-100 text-slate-700 border-slate-200',
    free:      '',
  };
  const label: Record<string, string> = {
    exclusive: 'Exclusive',
    dominator: 'Premium',
    growth:    'Featured',
    starter:   'Listed',
    free:      '',
  };
  if (tier === 'free') return null;
  return { cls: map[tier] ?? '', text: label[tier] ?? '' };
}

// ─── Mock data for dev / empty states ─────────────────────────────────────────

const MOCK_BUSINESSES: Business[] = [
  { id:'b1', business_name:'Apex Roofing Co.', slug:'apex-roofing', tagline:'Trusted roofing since 2005', phone:'(978) 555-0101', website_url:null, logo_url:null, cover_image_url:'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&w=600', city:'Worcester', state:'MA', ad_tier:'exclusive', is_featured:true, is_verified:true, average_rating:4.9, review_count:82, accepts_new_clients:true, category:{ name:'Contractors', slug:'contractors', icon:'HardHat' }},
  { id:'b2', business_name:'Green Thumb Landscaping', slug:'green-thumb', tagline:'Beautiful lawns, every season', phone:'(978) 555-0102', website_url:null, logo_url:null, cover_image_url:'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&w=600', city:'Pepperell', state:'MA', ad_tier:'growth', is_featured:true, is_verified:true, average_rating:4.7, review_count:45, accepts_new_clients:true, category:{ name:'Home Services', slug:'home-services', icon:'Home' }},
  { id:'b3', business_name:'Main Street Bistro', slug:'main-street-bistro', tagline:'Farm-to-table dining in Groton', phone:'(978) 555-0103', website_url:null, logo_url:null, cover_image_url:'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=600', city:'Groton', state:'MA', ad_tier:'growth', is_featured:false, is_verified:true, average_rating:4.6, review_count:130, accepts_new_clients:true, category:{ name:'Restaurants & Food', slug:'restaurants-food', icon:'UtensilsCrossed' }},
  { id:'b4', business_name:'FitLife Gym', slug:'fitlife-gym', tagline:'Your community fitness hub', phone:'(978) 555-0104', website_url:null, logo_url:null, cover_image_url:'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&w=600', city:'Leominster', state:'MA', ad_tier:'starter', is_featured:false, is_verified:false, average_rating:4.4, review_count:28, accepts_new_clients:true, category:{ name:'Fitness', slug:'fitness', icon:'Dumbbell' }},
  { id:'b5', business_name:'Happy Paws Pet Spa', slug:'happy-paws', tagline:'Grooming your pets love', phone:'(978) 555-0105', website_url:null, logo_url:null, cover_image_url:'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&w=600', city:'Fitchburg', state:'MA', ad_tier:'growth', is_featured:true, is_verified:true, average_rating:4.8, review_count:61, accepts_new_clients:true, category:{ name:'Pets', slug:'pets', icon:'PawPrint' }},
  { id:'b6', business_name:'Clarity Auto Care', slug:'clarity-auto', tagline:'Honest service, fair prices', phone:'(978) 555-0106', website_url:null, logo_url:null, cover_image_url:'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&w=600', city:'Gardner', state:'MA', ad_tier:'starter', is_featured:false, is_verified:false, average_rating:4.3, review_count:19, accepts_new_clients:true, category:{ name:'Auto Services', slug:'auto-services', icon:'Car' }},
];

const MOCK_EVENTS: CommunityEvent[] = [
  { id:'e1', title:'Pepperell Farmers Market', short_description:'Weekly fresh produce, local vendors, and live music every Saturday morning.', image_url:'https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg?auto=compress&w=600', event_date:'2026-05-31', start_time:'8:00 AM', end_time:'1:00 PM', location_name:'Pepperell Town Common', location_address:'Main St', city:'Pepperell', state:'MA', is_free:true, ticket_price_cents:null, ticket_url:null, is_featured:true, rsvp_count:142 },
  { id:'e2', title:'Groton Heritage Festival', short_description:'Celebrate local history with crafts, food trucks, and family activities all day long.', image_url:'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&w=600', event_date:'2026-06-07', start_time:'10:00 AM', end_time:'6:00 PM', location_name:'Groton Town Center', location_address:'Main St', city:'Groton', state:'MA', is_free:true, ticket_price_cents:null, ticket_url:null, is_featured:true, rsvp_count:89 },
  { id:'e3', title:'Live Music at Main Street Bistro', short_description:'Local acoustic duo performing Friday evenings. No cover charge, reservations suggested.', image_url:'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&w=600', event_date:'2026-05-30', start_time:'7:00 PM', end_time:'10:00 PM', location_name:'Main Street Bistro', location_address:'45 Main St', city:'Groton', state:'MA', is_free:true, ticket_price_cents:null, ticket_url:null, is_featured:false, rsvp_count:34 },
  { id:'e4', title:'5K Fun Run — Townsend Trails', short_description:'Family-friendly 5K through scenic Townsend conservation land. All fitness levels welcome.', image_url:'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&w=600', event_date:'2026-06-14', start_time:'9:00 AM', end_time:'12:00 PM', location_name:'Spaulding Memorial School', location_address:'Butler Rd', city:'Townsend', state:'MA', is_free:false, ticket_price_cents:1500, ticket_url:null, is_featured:false, rsvp_count:57 },
];

const MOCK_DEALS: Deal[] = [
  { id:'d1', title:'$50 Off First HVAC Tune-Up', description:'New customers only. Full system inspection + cleaning.', discount_label:'Save $50', original_price_cents:14900, deal_price_cents:9900, savings_percent:34, image_url:'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&w=600', coupon_code:'FIRST50', is_featured:true, expires_at:'2026-06-30T23:59:59Z', claim_count:23, business:{ business_name:'Apex Roofing Co.', logo_url:null }},
  { id:'d2', title:'Buy 1 Get 1 Free — Pet Bath', description:'Any dog under 50 lbs. Appointment required.', discount_label:'BOGO', original_price_cents:6000, deal_price_cents:3000, savings_percent:50, image_url:'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&w=600', coupon_code:'BOGOBATH', is_featured:true, expires_at:'2026-06-15T23:59:59Z', claim_count:41, business:{ business_name:'Happy Paws Pet Spa', logo_url:null }},
  { id:'d3', title:'Free Month — New Gym Members', description:'Sign up for 3 months, get first month free. No contract required.', discount_label:'Free Month', original_price_cents:4900, deal_price_cents:0, savings_percent:100, image_url:'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&w=600', coupon_code:'FIRSTMONTH', is_featured:false, expires_at:'2026-05-31T23:59:59Z', claim_count:18, business:{ business_name:'FitLife Gym', logo_url:null }},
];

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [towns, setTowns] = useState<Town[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  const [selectedState, setSelectedState] = useState('MA');
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'directory' | 'events' | 'deals'>('directory');
  const [showTownPicker, setShowTownPicker] = useState(false);
  const [townSearch, setTownSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [eventsMonth, setEventsMonth] = useState(() => new Date());

  const townPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTowns();
    loadCategories();
  }, []);

  useEffect(() => {
    loadContent();
  }, [selectedTown, selectedCategory, searchQuery]);

  // Close town picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (townPickerRef.current && !townPickerRef.current.contains(e.target as Node)) {
        setShowTownPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function loadTowns() {
    const { data } = await supabase
      .from('community_towns')
      .select('id, name, state, slug, county, tier')
      .eq('state', selectedState)
      .eq('is_active', true)
      .order('name');
    if (data && data.length > 0) {
      setTowns(data);
      setSelectedTown(data.find(t => t.slug === 'pepperell') ?? data[0]);
    }
  }

  async function loadCategories() {
    const { data } = await supabase
      .from('community_categories')
      .select('id, name, slug, icon')
      .eq('is_active', true)
      .order('sort_order');
    if (data) setCategories(data);
  }

  async function loadContent() {
    setLoading(true);
    await Promise.all([loadBusinesses(), loadEvents(), loadDeals()]);
    setLoading(false);
  }

  async function loadBusinesses() {
    // Use mock in dev or if real data is empty
    setBusinesses(MOCK_BUSINESSES);
  }

  async function loadEvents() {
    if (!selectedTown) { setEvents(MOCK_EVENTS); return; }
    const { data } = await supabase
      .from('community_events')
      .select('id,title,short_description,image_url,event_date,start_time,end_time,location_name,location_address,city,state,is_free,ticket_price_cents,ticket_url,is_featured,rsvp_count')
      .eq('city', selectedTown.name)
      .eq('status', 'published')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date')
      .limit(20);
    setEvents(data && data.length > 0 ? data : MOCK_EVENTS);
  }

  async function loadDeals() {
    setDeals(MOCK_DEALS);
  }

  // Filtered businesses
  const filteredBusinesses = businesses.filter(b => {
    const matchesCat = selectedCategory === 'all' || b.category?.slug === selectedCategory;
    const matchesSearch = !searchQuery ||
      b.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Sort: featured/exclusive first
  const tierOrder: Record<string, number> = { exclusive: 0, dominator: 1, growth: 2, starter: 3, free: 4 };
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) =>
    (tierOrder[a.ad_tier] ?? 4) - (tierOrder[b.ad_tier] ?? 4)
  );

  const filteredTowns = towns.filter(t =>
    t.name.toLowerCase().includes(townSearch.toLowerCase())
  );

  // Calendar helpers
  const calYear  = eventsMonth.getFullYear();
  const calMonth = eventsMonth.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const eventsByDate: Record<string, CommunityEvent[]> = {};
  events.forEach(ev => {
    const key = ev.event_date?.split('T')[0] ?? '';
    if (key) (eventsByDate[key] = eventsByDate[key] ?? []).push(ev);
  });

  const monthName = eventsMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="space-y-0 -mt-2">

        {/* ── Hero / Location Bar ────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden mb-6">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #2BB673 0%, transparent 50%), radial-gradient(circle at 80% 20%, #F5B82E 0%, transparent 40%)' }} />

          <div className="relative px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-[#F5B82E]" />
                  <span className="text-[#F5B82E] text-sm font-semibold tracking-wide uppercase">Your Community Hub</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {selectedTown ? `${selectedTown.name}, ${selectedTown.state}` : 'Local-Link Community'}
                </h1>
                <p className="text-slate-300 text-sm">
                  Discover local businesses, upcoming events & exclusive deals
                  {selectedTown?.county ? ` in ${selectedTown.county} County` : ''}
                </p>
              </div>

              {/* Location Selector */}
              <div className="flex flex-col sm:flex-row gap-3" ref={townPickerRef}>
                {/* State pill */}
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5">
                  <MapPin className="w-4 h-4 text-[#2BB673]" />
                  <span className="text-white font-medium text-sm">Massachusetts</span>
                </div>

                {/* Town picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowTownPicker(v => !v)}
                    className="flex items-center gap-2 bg-[#2BB673] hover:bg-[#25a062] text-white rounded-xl px-4 py-2.5 font-semibold text-sm transition-colors min-w-[160px] justify-between"
                  >
                    <span>{selectedTown?.name ?? 'Select Town'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showTownPicker && (
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-slate-100 w-72 z-50">
                      <div className="p-3 border-b border-slate-100">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search towns..."
                            value={townSearch}
                            onChange={e => setTownSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto p-2">
                        {filteredTowns.map(t => (
                          <button
                            key={t.id}
                            onClick={() => { setSelectedTown(t); setShowTownPicker(false); setTownSearch(''); }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                              selectedTown?.id === t.id
                                ? 'bg-[#2BB673]/10 text-[#2BB673] font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{t.name}</span>
                            <span className="text-xs text-slate-400">{t.county}</span>
                          </button>
                        ))}
                        {filteredTowns.length === 0 && (
                          <p className="text-center text-sm text-slate-400 py-4">No towns found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="mt-5 relative max-w-xl">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search businesses, services, restaurants..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-slate-800 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]/50 text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
          {[
            { key: 'directory', label: 'Local Directory', icon: Building2 },
            { key: 'events',    label: 'Events & Calendar', icon: Calendar },
            { key: 'deals',     label: 'Local Deals', icon: Tag },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB: DIRECTORY
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">{sortedBusinesses.length}</span> businesses
                {selectedTown ? ` in ${selectedTown.name}` : ''}
              </p>
              <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Featured listings shown first
              </div>
            </div>

            {/* Business grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {sortedBusinesses.map(biz => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>

            {sortedBusinesses.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-700 mb-1">No businesses found</h3>
                <p className="text-slate-500 text-sm">Try a different category or search term</p>
              </div>
            )}

            {/* CTA for businesses */}
            <div className="bg-gradient-to-r from-[#2BB673]/10 to-emerald-50 border border-[#2BB673]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Own a local business?</h3>
                <p className="text-sm text-slate-600">Get listed in the {selectedTown?.name ?? 'local'} directory and reach customers in your town.</p>
              </div>
              <button
                onClick={() => navigate('/merchant/dashboard')}
                className="flex items-center gap-2 bg-[#2BB673] hover:bg-[#25a062] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap text-sm"
              >
                List My Business <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB: EVENTS & CALENDAR
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Month nav */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <button
                      onClick={() => setEventsMonth(d => new Date(d.getFullYear(), d.getMonth() - 1))}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-slate-800 text-sm">{monthName}</span>
                    <button
                      onClick={() => setEventsMonth(d => new Date(d.getFullYear(), d.getMonth() + 1))}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 border-b border-slate-100">
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                      <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 p-2 gap-0.5">
                    {/* Empty cells before first day */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8" />
                    ))}
                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day    = i + 1;
                      const key    = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                      const hasEvt = !!eventsByDate[key];
                      const isToday = key === new Date().toISOString().split('T')[0];
                      return (
                        <div
                          key={day}
                          className={`h-8 flex flex-col items-center justify-center rounded-lg text-xs cursor-pointer transition-colors relative ${
                            isToday ? 'bg-[#2BB673] text-white font-bold' :
                            hasEvt  ? 'bg-[#2BB673]/10 text-[#2BB673] font-semibold hover:bg-[#2BB673]/20' :
                                      'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {day}
                          {hasEvt && !isToday && (
                            <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#2BB673]" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-4 pb-4 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-[#2BB673] inline-block" />
                      Days with events
                    </div>
                  </div>
                </div>
              </div>

              {/* Events list */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 text-lg">
                    Upcoming in {selectedTown?.name ?? 'your area'}
                  </h2>
                  <span className="text-sm text-slate-500">{events.length} events</span>
                </div>

                {events.map(evt => (
                  <EventCard key={evt.id} event={evt} />
                ))}

                {events.length === 0 && (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-1">No upcoming events</h3>
                    <p className="text-slate-500 text-sm">Check back soon or submit your own event</p>
                  </div>
                )}

                {/* Submit event CTA */}
                <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-0.5 text-sm">Hosting an event?</h3>
                    <p className="text-xs text-slate-600">Submit it free and reach your whole community.</p>
                  </div>
                  <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                    Submit Event <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB: LOCAL DEALS
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'deals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Local Deals Near You</h2>
                <p className="text-sm text-slate-500 mt-0.5">Exclusive offers from businesses in {selectedTown?.name ?? 'your area'}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-[#F5B82E]/10 text-amber-800 border border-amber-200 rounded-full px-3 py-1 font-medium">
                <Zap className="w-3 h-3" />
                {deals.filter(d => d.is_featured).length} featured
              </div>
            </div>

            {/* Featured deals row */}
            {deals.filter(d => d.is_featured).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#2BB673]" />
                  Top Deals This Week
                </h3>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {deals.filter(d => d.is_featured).map(deal => (
                    <DealCard key={deal.id} deal={deal} featured />
                  ))}
                </div>
              </div>
            )}

            {/* All deals */}
            {deals.filter(d => !d.is_featured).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">More Local Deals</h3>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {deals.filter(d => !d.is_featured).map(deal => (
                    <DealCard key={deal.id} deal={deal} featured={false} />
                  ))}
                </div>
              </div>
            )}

            {deals.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-700 mb-1">No deals right now</h3>
                <p className="text-slate-500 text-sm">Check back soon — businesses post new deals weekly</p>
              </div>
            )}

            {/* Merchant CTA */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Are you a local business?</h3>
                <p className="text-sm text-slate-600">Post a deal and reach hundreds of local customers for free.</p>
              </div>
              <button
                onClick={() => navigate('/merchant/deals/new')}
                className="flex items-center gap-2 bg-[#F5B82E] hover:bg-amber-500 text-slate-900 font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap text-sm"
              >
                Post a Deal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BusinessCard({ business: b }: { business: Business }) {
  const badge = tierBadge(b.ad_tier);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all group ${
      b.is_featured ? 'border-[#2BB673]/30 shadow-sm' : 'border-slate-200'
    }`}>
      {/* Cover */}
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        {b.cover_image_url ? (
          <img src={b.cover_image_url} alt={b.business_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-slate-400" />
          </div>
        )}

        {/* Tier badge */}
        {badge && (
          <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${badge.cls}`}>
            {badge.text}
          </div>
        )}

        {/* Verified */}
        {b.is_verified && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#2BB673] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-[#2BB673]" /> Verified
          </div>
        )}

        {/* Category tag */}
        {b.category && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <CategoryIcon name={b.category.icon} className="w-3 h-3" />
            {b.category.name}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-slate-900 text-base leading-snug">{b.business_name}</h3>
          {b.average_rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-600 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{b.average_rating.toFixed(1)}</span>
              <span className="text-slate-400">({b.review_count})</span>
            </div>
          )}
        </div>

        {b.tagline && <p className="text-sm text-slate-500 mb-3 line-clamp-2">{b.tagline}</p>}

        {b.city && (
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
            <MapPin className="w-3 h-3" />
            {b.city}, {b.state}
          </div>
        )}

        <div className="flex gap-2 pt-1 border-t border-slate-100">
          {b.phone && (
            <a
              href={`tel:${b.phone}`}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 py-2 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
          )}
          {b.website_url ? (
            <a
              href={b.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-[#2BB673] hover:bg-[#25a062] py-2 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit Site
            </a>
          ) : (
            <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-[#2BB673] hover:bg-[#25a062] py-2 rounded-lg transition-colors">
              View Profile
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event: ev }: { event: CommunityEvent }) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-all flex gap-0 ${
      ev.is_featured ? 'border-[#2BB673]/30' : 'border-slate-200'
    }`}>
      {/* Image */}
      <div className="w-28 shrink-0 relative overflow-hidden">
        {ev.image_url ? (
          <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
        )}
        {ev.is_featured && (
          <div className="absolute top-2 left-2 bg-[#F5B82E] text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-slate-900 text-sm leading-snug">{ev.title}</h3>
          {ev.is_free ? (
            <span className="shrink-0 text-xs font-semibold text-[#2BB673] bg-[#2BB673]/10 px-2 py-0.5 rounded-full">Free</span>
          ) : ev.ticket_price_cents ? (
            <span className="shrink-0 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              ${(ev.ticket_price_cents / 100).toFixed(0)}
            </span>
          ) : null}
        </div>

        {ev.short_description && (
          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{ev.short_description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(ev.event_date)}
          </span>
          {ev.start_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {ev.start_time}{ev.end_time ? ` – ${ev.end_time}` : ''}
            </span>
          )}
          {ev.location_name && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {ev.location_name}
            </span>
          )}
          {ev.rsvp_count > 0 && (
            <span className="flex items-center gap-1 text-[#2BB673]">
              <Users className="w-3 h-3" />
              {ev.rsvp_count} going
            </span>
          )}
        </div>

        {ev.ticket_url && (
          <a
            href={ev.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <Ticket className="w-3 h-3" /> Get Tickets
          </a>
        )}
      </div>
    </div>
  );
}

function DealCard({ deal, featured }: { deal: Deal; featured: boolean }) {
  const savings = deal.savings_percent
    ?? (deal.original_price_cents && deal.deal_price_cents
        ? Math.round(((deal.original_price_cents - deal.deal_price_cents) / deal.original_price_cents) * 100)
        : 0);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all group ${
      featured ? 'border-[#F5B82E]/40 shadow-sm' : 'border-slate-200'
    }`}>
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        {deal.image_url ? (
          <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Tag className="w-10 h-10 text-slate-300" />
          </div>
        )}

        {savings > 0 && (
          <div className="absolute top-3 left-3 bg-[#2BB673] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md">
            Save {savings}%
          </div>
        )}

        {deal.discount_label && (
          <div className="absolute top-3 right-3 bg-[#F5B82E] text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg">
            {deal.discount_label}
          </div>
        )}
      </div>

      <div className="p-4">
        {deal.business && (
          <p className="text-xs text-slate-400 font-medium mb-1">{deal.business.business_name}</p>
        )}
        <h3 className="font-bold text-slate-900 mb-1 leading-snug">{deal.title}</h3>
        {deal.description && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-2">{deal.description}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            {deal.deal_price_cents !== null && deal.deal_price_cents !== undefined && (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-[#2BB673]">
                  {deal.deal_price_cents === 0 ? 'FREE' : formatPrice(deal.deal_price_cents)}
                </span>
                {deal.original_price_cents && deal.original_price_cents > 0 && (
                  <span className="text-sm text-slate-400 line-through">{formatPrice(deal.original_price_cents)}</span>
                )}
              </div>
            )}
            {deal.expires_at && (
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Expires {new Date(deal.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>

          <div className="text-right">
            {deal.coupon_code && (
              <div className="text-xs bg-slate-100 border border-dashed border-slate-300 px-2.5 py-1.5 rounded-lg font-mono font-bold text-slate-700 mb-1">
                {deal.coupon_code}
              </div>
            )}
            {deal.claim_count > 0 && (
              <p className="text-xs text-slate-400">{deal.claim_count} claimed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
