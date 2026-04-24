import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Tag, Clock, Heart, Star, Sparkles, Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface Offer {
  id: string;
  title: string;
  short_description: string;
  original_value_cents: number;
  price_cents: number;
  image_url: string | null;
  merchant: {
    business_name: string;
    city: string;
  };
}

const MOCK_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    title: 'Signature Facial + Skin Consultation',
    short_description: 'Personalized skin care treatment with a licensed esthetician. Includes deep cleanse, exfoliation, and custom mask.',
    original_value_cents: 12000,
    price_cents: 8500,
    image_url: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=600',
    merchant: { business_name: 'Radiance Spa & Wellness', city: 'Austin' }
  },
  {
    id: 'offer-2',
    title: 'Family Portrait Session',
    short_description: 'Professional outdoor photo session for families up to 5. Digital gallery included with 25+ edited photos.',
    original_value_cents: 35000,
    price_cents: 19900,
    image_url: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=600',
    merchant: { business_name: 'Luminary Photography Co.', city: 'Austin' }
  },
  {
    id: 'offer-3',
    title: "Chef's Tasting Menu for Two",
    short_description: 'Five-course seasonal tasting menu crafted daily from local ingredients. Wine pairings available.',
    original_value_cents: 19000,
    price_cents: 13500,
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    merchant: { business_name: 'Oak & Ember Kitchen', city: 'Austin' }
  },
  {
    id: 'offer-4',
    title: 'Personal Training — 3-Session Pack',
    short_description: 'Customized fitness plan with one-on-one coaching from a certified trainer. Suitable for all levels.',
    original_value_cents: 25000,
    price_cents: 17500,
    image_url: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600',
    merchant: { business_name: 'Forge Fitness Studio', city: 'Austin' }
  },
  {
    id: 'offer-5',
    title: 'Premium Car Detail Package',
    short_description: 'Full interior/exterior detail with ceramic coating. Your car will look showroom-ready.',
    original_value_cents: 45000,
    price_cents: 29900,
    image_url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
    merchant: { business_name: 'Elite Auto Care', city: 'Austin' }
  },
  {
    id: 'offer-6',
    title: 'Kids Art Workshop — 4 Classes',
    short_description: 'Creative art classes for ages 5–12. Covers painting, clay, mixed media, and more. Supplies included.',
    original_value_cents: 16000,
    price_cents: 9900,
    image_url: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600',
    merchant: { business_name: 'Little Canvas Studio', city: 'Austin' }
  },
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Offers' },
  { id: 'wellness', label: 'Health & Wellness' },
  { id: 'dining', label: 'Dining & Food' },
  { id: 'services', label: 'Services' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'family', label: 'Family' },
  { id: 'fitness', label: 'Fitness' },
];

export default function OffersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOffers();
    if (user) fetchFavorites();
  }, [selectedCategory, user]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('deals')
        .select(`id, title, short_description, original_value_cents, price_cents, image_url, merchant:merchants!inner(business_name, city)`)
        .eq('status', 'active')
        .gte('end_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setOffers(data.map(d => ({
          id: d.id,
          title: d.title,
          short_description: d.short_description,
          original_value_cents: d.original_value_cents,
          price_cents: d.price_cents,
          image_url: d.image_url,
          merchant: { business_name: d.merchant.business_name, city: d.merchant.city }
        })));
      } else {
        setOffers(MOCK_OFFERS);
      }
    } catch {
      setOffers(MOCK_OFFERS);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const { data: customerData } = await supabase
        .from('customers').select('id').eq('user_id', user.id).maybeSingle();
      if (!customerData) return;
      const { data } = await supabase
        .from('favorites').select('deal_id').eq('customer_id', customerData.id);
      if (data) setFavorites(new Set(data.map(f => f.deal_id)));
    } catch { /* silent */ }
  };

  const toggleFavorite = async (offerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    const isFav = favorites.has(offerId);
    setFavorites(prev => {
      const next = new Set(prev);
      isFav ? next.delete(offerId) : next.add(offerId);
      return next;
    });
    try {
      const { data: customerData } = await supabase
        .from('customers').select('id').eq('user_id', user.id).maybeSingle();
      if (!customerData) return;
      if (isFav) {
        await supabase.from('favorites').delete().eq('customer_id', customerData.id).eq('deal_id', offerId);
      } else {
        await supabase.from('favorites').insert({ customer_id: customerData.id, deal_id: offerId });
      }
    } catch { /* silent */ }
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`;
  const savingsPercent = (orig: number, price: number) => Math.round(((orig - price) / orig) * 100);

  const filteredOffers = offers.filter(o =>
    searchQuery === '' ||
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.merchant.business_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-2 text-[#2BB673] mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Local Business Offers</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Special Offers from Local Businesses</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Discover exclusive experiences, services, and savings from the best local businesses in your community.
          </p>
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search offers or businesses..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#2BB673] text-white shadow-md shadow-[#2BB673]/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#2BB673] hover:text-[#2BB673]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active Offers', value: `${filteredOffers.length}+` },
            { label: 'Local Businesses', value: '120+' },
            { label: 'Avg. Savings', value: '32%' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Offers grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#2BB673]"></div>
            <p className="mt-4 text-slate-500">Finding great offers near you...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No offers found</h3>
            <p className="text-slate-500">Try a different search or check back soon for new offers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isFavorited={favorites.has(offer.id)}
                onFavorite={toggleFavorite}
                onView={() => navigate(`/deal/${offer.id}`)}
                formatPrice={formatPrice}
                savingsPercent={savingsPercent}
              />
            ))}
          </div>
        )}

        {/* Merchant CTA */}
        <div className="bg-gradient-to-br from-[#2BB673]/5 to-[#2BB673]/10 border border-[#2BB673]/20 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Own a Local Business?</h3>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Reach thousands of local customers by posting your own special offer. Join the community of local businesses growing with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/merchant/deals')}
              className="px-6 py-3 bg-[#2BB673] text-white font-semibold rounded-xl hover:bg-[#25a062] transition-colors shadow-md shadow-[#2BB673]/20"
            >
              Post an Offer
            </button>
            <button
              onClick={() => navigate('/community')}
              className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-[#2BB673] hover:text-[#2BB673] transition-colors"
            >
              View Community Events
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function OfferCard({
  offer,
  isFavorited,
  onFavorite,
  onView,
  formatPrice,
  savingsPercent,
}: {
  offer: Offer;
  isFavorited: boolean;
  onFavorite: (id: string, e: React.MouseEvent) => void;
  onView: () => void;
  formatPrice: (cents: number) => string;
  savingsPercent: (orig: number, price: number) => number;
}) {
  const savings = savingsPercent(offer.original_value_cents, offer.price_cents);

  return (
    <div
      onClick={onView}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      <div className="relative h-52 overflow-hidden">
        {offer.image_url ? (
          <img
            src={offer.image_url}
            alt={offer.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2BB673] to-[#25a062] flex items-center justify-center">
            <Tag className="w-14 h-14 text-white/40" />
          </div>
        )}
        {/* Savings badge */}
        {savings > 0 && (
          <div className="absolute top-3 left-3 bg-[#F5B82E] text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full">
            Save {savings}%
          </div>
        )}
        {/* Favorite button */}
        <button
          onClick={e => onFavorite(offer.id, e)}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{offer.merchant.business_name}</span>
          <span className="text-slate-300">·</span>
          <span>{offer.merchant.city}</span>
        </div>

        <h3 className="font-bold text-slate-900 mb-1.5 line-clamp-2 group-hover:text-[#2BB673] transition-colors">
          {offer.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{offer.short_description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="text-2xl font-bold text-slate-900">{formatPrice(offer.price_cents)}</span>
            <span className="text-sm text-slate-400 line-through ml-2">{formatPrice(offer.original_value_cents)}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-slate-600">4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
