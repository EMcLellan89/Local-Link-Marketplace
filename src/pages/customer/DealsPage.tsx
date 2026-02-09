import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Tag, Clock, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { DEV_MODE, MOCK_DEALS } from '../../lib/devMode';

interface Deal {
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

export default function DealsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
    fetchDeals();
    if (user) {
      fetchFavorites();
    }
  }, [selectedCategory, user]);

  const fetchCategories = async () => {
    if (DEV_MODE) {
      setCategories([
        { id: '1', name: 'Restaurant', slug: 'restaurant' },
        { id: '2', name: 'Services', slug: 'services' },
        { id: '3', name: 'Retail', slug: 'retail' },
      ]);
      return;
    }

    try {
      const { data, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');

      if (categoriesError) throw categoriesError;

      if (data) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);

    if (DEV_MODE) {
      setTimeout(() => {
        const formattedDeals = MOCK_DEALS.map(deal => ({
          id: deal.id,
          title: deal.title,
          short_description: deal.description,
          original_value_cents: deal.original_price_cents,
          price_cents: deal.deal_price_cents,
          image_url: deal.image_url,
          merchant: {
            business_name: 'Dev Local Business',
            city: 'Los Angeles',
          }
        }));
        setDeals(formattedDeals);
        setLoading(false);
      }, 300);
      return;
    }

    try {
      let query = supabase
        .from('deals')
        .select(`
          id,
          title,
          short_description,
          original_value_cents,
          price_cents,
          image_url,
          merchant:merchants!inner (
            business_name,
            city,
            category_id,
            categories!inner (
              slug
            )
          )
        `)
        .eq('status', 'active')
        .gte('end_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('merchant.categories.slug', selectedCategory);
      }

      const { data, error: dealsError } = await query;

      if (dealsError) throw dealsError;

      if (data) {
        const formattedDeals = data.map(deal => ({
          id: deal.id,
          title: deal.title,
          short_description: deal.short_description,
          original_value_cents: deal.original_value_cents,
          price_cents: deal.price_cents,
          image_url: deal.image_url,
          merchant: {
            business_name: deal.merchant.business_name,
            city: deal.merchant.city,
          }
        }));
        setDeals(formattedDeals);
      }
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError('Failed to load deals. Please try again.');
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const calculateSavings = (original: number, price: number) => {
    const savings = ((original - price) / original) * 100;
    return Math.round(savings);
  };

  const fetchFavorites = async () => {
    if (!user) return;

    if (DEV_MODE) {
      setFavorites(new Set(['deal-1']));
      return;
    }

    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (customerError) throw customerError;
      if (!customerData) return;

      const { data, error: favoritesError } = await supabase
        .from('favorites')
        .select('deal_id')
        .eq('customer_id', customerData.id);

      if (favoritesError) throw favoritesError;

      if (data) {
        setFavorites(new Set(data.map(f => f.deal_id)));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const toggleFavorite = async (dealId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (DEV_MODE) {
      const isFavorite = favorites.has(dealId);
      if (isFavorite) {
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(dealId);
          return newSet;
        });
      } else {
        setFavorites(prev => new Set(prev).add(dealId));
      }
      console.log('DEV MODE: Favorite toggled');
      return;
    }

    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (customerError) throw customerError;
      if (!customerData) return;

      const isFavorite = favorites.has(dealId);

      if (isFavorite) {
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('customer_id', customerData.id)
          .eq('deal_id', dealId);

        if (deleteError) throw deleteError;

        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(dealId);
          return newSet;
        });
      } else {
        const { error: insertError } = await supabase
          .from('favorites')
          .insert({
            customer_id: customerData.id,
            deal_id: dealId
          });

        if (insertError) throw insertError;

        setFavorites(prev => new Set(prev).add(dealId));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorite. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Browse Local Deals</h1>
          <p className="text-slate-600 mt-2">Support local businesses and save money</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#2BB673] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            All Deals
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-[#2BB673] text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {error && (
          <Card variant="bordered">
            <CardBody>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Couldn't Load Deals</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <Button onClick={fetchDeals}>Try Again</Button>
              </div>
            </CardBody>
          </Card>
        )}

        {!error && loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
            <p className="mt-4 text-slate-600">Loading deals...</p>
          </div>
        ) : !error && deals.length === 0 ? (
          <Card variant="bordered">
            <CardBody>
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No deals found</h3>
                <p className="text-slate-600">Check back soon for new local deals</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Card key={deal.id} variant="bordered" className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {deal.image_url ? (
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#2BB673] to-[#25a062] flex items-center justify-center">
                      <Tag className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  <button
                    onClick={(e) => toggleFavorite(deal.id, e)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        favorites.has(deal.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-slate-400 hover:text-red-400'
                      }`}
                    />
                  </button>
                </div>
                <CardBody className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2">{deal.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{deal.short_description}</p>
                  </div>

                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {deal.merchant?.business_name} · {deal.merchant?.city}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#2BB673]">
                          {formatPrice(deal.price_cents)}
                        </span>
                        <span className="text-sm text-slate-500 line-through">
                          {formatPrice(deal.original_value_cents)}
                        </span>
                      </div>
                      <div className="text-xs text-[#F5B82E] font-medium">
                        Save {calculateSavings(deal.original_value_cents, deal.price_cents)}%
                      </div>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/deal/${deal.id}`)}>
                      View Deal
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
