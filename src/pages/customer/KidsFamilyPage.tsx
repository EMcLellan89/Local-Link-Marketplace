import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Baby, Calendar, Star, MapPin, Clock, Search, Heart, Gift, Sparkles, ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface FamilyItem {
  id: string;
  title: string;
  description: string;
  type: 'Event' | 'Class' | 'Camp' | 'Birthday' | 'Deal';
  date?: string;
  time?: string;
  location?: string;
  ageRange?: string;
  price?: string;
  image: string;
  featured?: boolean;
  business?: string;
}

const MOCK_ITEMS: FamilyItem[] = [
  {
    id: '1', title: 'Summer Art Camp', type: 'Camp', featured: true,
    description: 'Two-week summer art camp for ages 6–12. Painting, ceramics, mixed media, and more. All supplies included.',
    date: 'June 16 – June 27', time: '9:00 AM – 3:00 PM', location: 'Little Canvas Studio',
    ageRange: 'Ages 6–12', price: '$299/session',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600',
    business: 'Little Canvas Studio'
  },
  {
    id: '2', title: 'Kids Karate — Beginner Class', type: 'Class', featured: true,
    description: 'Beginner-friendly martial arts classes. Builds confidence, discipline, and coordination.',
    date: 'Ongoing', time: 'Tue & Thu 4:00 PM', location: 'Tiger Dojo',
    ageRange: 'Ages 4–10', price: '$89/month',
    image: 'https://images.pexels.com/photos/7045527/pexels-photo-7045527.jpeg?auto=compress&cs=tinysrgb&w=600',
    business: 'Tiger Dojo'
  },
  {
    id: '3', title: 'Kids Painting Workshop', type: 'Event',
    description: 'One-day creative painting workshop for families. Walk away with a framed piece of art!',
    date: 'Sat, May 10', time: '10:00 AM – 12:00 PM', location: 'Arts District Gallery',
    ageRange: 'Ages 5+', price: 'FREE',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600',
    business: 'Arts District Gallery'
  },
  {
    id: '4', title: 'Birthday Party Package', type: 'Birthday',
    description: 'Complete birthday venue with arcade, private room, and catering packages. Up to 25 kids.',
    location: 'FunZone Family Center', ageRange: 'Ages 4–14', price: 'From $249',
    image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=600',
    business: 'FunZone Family Center'
  },
  {
    id: '5', title: 'Family Dance Classes', type: 'Class',
    description: 'Parent-and-child dance classes for toddlers to tweens. Ballet, hip-hop, and more.',
    date: 'Ongoing', time: 'Saturdays 9:00 AM', location: 'Step It Up Dance Studio',
    ageRange: 'Ages 2–12', price: '$75/month',
    image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=600',
    business: 'Step It Up Dance Studio'
  },
  {
    id: '6', title: 'Family Portrait Session', type: 'Deal',
    description: 'Professional outdoor family photos. 25+ edited digital images included.',
    location: 'Luminary Photography Co.', ageRange: 'All ages', price: '$199 (was $350)',
    image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=600',
    business: 'Luminary Photography Co.'
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Activities' },
  { id: 'Event', label: 'Events' },
  { id: 'Class', label: 'Classes' },
  { id: 'Camp', label: 'Camps' },
  { id: 'Birthday', label: 'Birthday Ideas' },
  { id: 'Deal', label: 'Family Deals' },
];

const TYPE_COLORS: Record<string, string> = {
  Event: 'bg-blue-500',
  Class: 'bg-[#2BB673]',
  Camp: 'bg-amber-500',
  Birthday: 'bg-pink-500',
  Deal: 'bg-orange-500',
};

export default function KidsFamilyPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<FamilyItem[]>(MOCK_ITEMS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Try to load live community events tagged for kids/family
    (async () => {
      try {
        const { data } = await supabase
          .from('community_events')
          .select('id, title, short_description, event_date, start_time, location_name, image_url, is_free, ticket_price_cents')
          .eq('status', 'approved')
          .contains('tags', ['family'])
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('is_featured', { ascending: false })
          .limit(6);
        if (data && data.length > 0) {
          const mapped = data.map(d => ({
            id: d.id,
            title: d.title,
            description: d.short_description || '',
            type: 'Event' as const,
            date: new Date(d.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: d.start_time || '',
            location: d.location_name || '',
            price: d.is_free ? 'FREE' : d.ticket_price_cents ? `$${(d.ticket_price_cents / 100).toFixed(0)}` : 'See details',
            image: d.image_url || MOCK_ITEMS[0].image,
          }));
          setItems(mapped);
        }
      } catch { /* use mock */ }
      setLoading(false);
    })();
  }, []);

  const filtered = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = search === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.business || '').toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-8 text-white overflow-hidden relative">
          <div className="absolute right-0 bottom-0 w-56 h-56 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />
          <div className="absolute right-32 top-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 text-blue-100 mb-3">
              <Baby className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Kids & Family</span>
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Family Fun Near You</h1>
            <p className="text-blue-100 text-lg max-w-xl mb-6">
              Find kids events, camps, classes, birthday ideas, and family-friendly local offers — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              {['This Weekend', 'Classes', 'Camps', 'Birthday Ideas'].map(label => (
                <button key={label}
                  onClick={() => setActiveTab(label === 'This Weekend' ? 'Event' : label === 'Birthday Ideas' ? 'Birthday' : label.replace('es', 'e').slice(0, -1) as any)}
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
          <input type="text" placeholder="Search activities, classes, camps..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800 placeholder-slate-400" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-400/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-500'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Featured */}
        {filtered.filter(i => i.featured).length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Featured This Month
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.filter(i => i.featured).map(item => (
                <FamilyCard key={item.id} item={item} featured />
              ))}
            </div>
          </div>
        )}

        {/* All items */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            {activeTab === 'all' ? 'All Activities' : CATEGORY_TABS.find(t => t.id === activeTab)?.label}
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : filtered.filter(i => !i.featured).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <Baby className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">No activities found. Try a different filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.filter(i => !i.featured).map(item => (
                <FamilyCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Newsletter / Follow */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Get the Weekly Family Guide</h3>
              <p className="text-sm text-slate-500">Events, classes, camps, and family picks delivered every Tuesday.</p>
            </div>
          </div>
          <button onClick={() => navigate('/register')}
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-colors flex-shrink-0 flex items-center gap-2">
            Follow Family Events <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Merchant CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Running a Program for Kids?</h3>
            <p className="text-slate-300">List your classes, camps, and programs where parents are already looking.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button onClick={() => navigate('/business')} className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-colors whitespace-nowrap">
              List a Program
            </button>
            <button onClick={() => navigate('/marketplace/products/kids-featured-program')} className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors whitespace-nowrap">
              Featured Placement
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FamilyCard({ item, featured = false }: { item: FamilyItem; featured?: boolean }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate('/community')}
      className={`bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group ${featured ? 'border-blue-100' : 'border-slate-100'}`}>
      <div className="relative h-48 overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className={`absolute top-3 left-3 ${TYPE_COLORS[item.type] || 'bg-slate-500'} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
          {item.type}
        </div>
        {item.price === 'FREE' && (
          <div className="absolute top-3 right-3 bg-[#2BB673] text-white text-xs font-bold px-2.5 py-1 rounded-full">FREE</div>
        )}
      </div>
      <div className="p-5">
        {item.business && (
          <div className="text-xs text-slate-400 flex items-center gap-1 mb-1.5">
            <MapPin className="w-3 h-3" />{item.business}
          </div>
        )}
        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-[#2BB673] transition-colors">{item.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.description}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {item.ageRange && (
            <span className="bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <Baby className="w-3 h-3" />{item.ageRange}
            </span>
          )}
          {item.date && (
            <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3" />{item.date}
            </span>
          )}
          {item.price && item.price !== 'FREE' && (
            <span className="bg-[#2BB673]/10 text-[#2BB673] font-semibold px-2.5 py-1 rounded-full">{item.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
