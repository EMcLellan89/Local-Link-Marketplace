import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Clock, MapPin, Star, Search, ChevronRight, Flame, Coffee, Calendar, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface DiningSpecial {
  id: string;
  title: string;
  description: string;
  valid_day: string;
  start_time: string | null;
  end_time: string | null;
  featured: boolean;
  merchant: { business_name: string; city: string };
}

const MOCK_SPECIALS: DiningSpecial[] = [
  {
    id: '1', title: "Chef's Lunch Special", description: 'Grilled salmon + roasted veg + house dessert. A different protein every day.',
    valid_day: 'Monday–Friday', start_time: '11:00', end_time: '14:00', featured: true,
    merchant: { business_name: 'Oak & Ember Kitchen', city: 'Austin' }
  },
  {
    id: '2', title: 'Happy Hour Bites', description: '$5 craft beers, half-price apps, and $4 house wines every single day.',
    valid_day: 'Daily', start_time: '16:00', end_time: '19:00', featured: true,
    merchant: { business_name: 'Harbor Brew House', city: 'Austin' }
  },
  {
    id: '3', title: 'Sunday Bottomless Brunch', description: 'Full brunch menu + bottomless mimosas or bloody marys for 2 hours.',
    valid_day: 'Sunday', start_time: '10:00', end_time: '14:00', featured: false,
    merchant: { business_name: 'The Corner Cafe', city: 'Austin' }
  },
  {
    id: '4', title: "Taco Tuesday Deal", description: '$3 street tacos, $5 margaritas, live music starting at 7 PM.',
    valid_day: 'Tuesday', start_time: '17:00', end_time: '21:00', featured: false,
    merchant: { business_name: 'Cantina Verde', city: 'Austin' }
  },
  {
    id: '5', title: 'Early Bird Dinner', description: 'Three-course prix fixe for $29. Reserve in advance — tables go fast.',
    valid_day: 'Thursday–Saturday', start_time: '17:00', end_time: '18:30', featured: false,
    merchant: { business_name: 'Bistro 42', city: 'Austin' }
  },
  {
    id: '6', title: 'Cold Brew Flight', description: 'Try all 4 of our rotating cold brews side-by-side with house-made syrups.',
    valid_day: 'Daily', start_time: null, end_time: null, featured: false,
    merchant: { business_name: 'Roam Coffee Collective', city: 'Austin' }
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Specials', icon: Utensils },
  { id: 'daily', label: "Today's Pick", icon: Flame },
  { id: 'happy-hour', label: 'Happy Hour', icon: Clock },
  { id: 'coffee', label: 'Coffee & Cafes', icon: Coffee },
  { id: 'events', label: 'Food Events', icon: Calendar },
];

export default function FoodDiningPage() {
  const navigate = useNavigate();
  const [specials, setSpecials] = useState<DiningSpecial[]>(MOCK_SPECIALS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('dining_specials')
          .select('id, title, description, valid_day, start_time, end_time, featured, merchant:merchants(business_name, city)')
          .eq('status', 'active')
          .order('featured', { ascending: false })
          .limit(20);
        if (data && data.length > 0) {
          setSpecials(data.map(d => ({
            id: d.id, title: d.title, description: d.description,
            valid_day: d.valid_day, start_time: d.start_time, end_time: d.end_time,
            featured: d.featured,
            merchant: { business_name: d.merchant.business_name, city: d.merchant.city }
          })));
        }
      } catch { /* use mock */ }
      setLoading(false);
    })();
  }, []);

  const formatTime = (t: string | null) => {
    if (!t) return null;
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const filtered = specials.filter(s =>
    search === '' ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.merchant.business_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-600 to-amber-500 rounded-2xl p-8 text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="relative">
            <div className="flex items-center gap-2 text-orange-100 mb-3">
              <Utensils className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Food & Dining</span>
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Where Should We Eat Today?</h1>
            <p className="text-orange-100 text-lg max-w-xl mb-6">
              Find local restaurants, daily specials, happy hours, coffee shops, and food events all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Today's Specials", 'Food Events', 'Restaurants'].map(label => (
                <button key={label} onClick={() => navigate('/community')}
                  className="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search restaurants, specials, or dishes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-400/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-400 hover:text-orange-500'
              }`}>
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured specials */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Featured Today
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.filter(s => s.featured).map(special => (
              <SpecialCard key={special.id} special={special} formatTime={formatTime} featured />
            ))}
          </div>
        </div>

        {/* All specials */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-5">All Specials</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.filter(s => !s.featured).map(special => (
                <SpecialCard key={special.id} special={special} formatTime={formatTime} />
              ))}
            </div>
          )}
        </div>

        {/* Merchant CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Own a Restaurant or Food Business?</h3>
            <p className="text-slate-300">Post your daily specials, happy hours, and events. Get seen by locals every day.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button onClick={() => navigate('/business')} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors whitespace-nowrap">
              Post a Special
            </button>
            <button onClick={() => navigate('/marketplace/products/food-todays-special-feature')} className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors whitespace-nowrap">
              Boost Visibility
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SpecialCard({ special, formatTime, featured = false }: {
  special: DiningSpecial;
  formatTime: (t: string | null) => string | null;
  featured?: boolean;
}) {
  const startFmt = formatTime(special.start_time);
  const endFmt = formatTime(special.end_time);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all ${featured ? 'border-orange-200 ring-1 ring-orange-200' : 'border-slate-100'}`}>
      {featured && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-1.5 flex items-center gap-2">
          <Flame className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Featured Today</span>
        </div>
      )}
      <div className={`${featured ? 'h-36' : 'h-28'} bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center`}>
        <Utensils className="w-10 h-10 text-orange-200" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          {special.merchant.business_name} · {special.merchant.city}
        </div>
        <h3 className="font-bold text-slate-900 mb-1">{special.title}</h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{special.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="bg-orange-50 text-orange-600 font-medium px-2.5 py-1 rounded-full">{special.valid_day}</span>
          {startFmt && (
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {startFmt}{endFmt ? ` – ${endFmt}` : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
