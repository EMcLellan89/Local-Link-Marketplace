import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface FavoriteDeal {
  id: string;
  deal: {
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
  };
  created_at: string;
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (customerError) throw customerError;

      if (!customerData) {
        setLoading(false);
        return;
      }

      const { data, error: favoritesError } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          deal:deals!inner (
            id,
            title,
            short_description,
            original_value_cents,
            price_cents,
            image_url,
            merchant:merchants (
              business_name,
              city
            )
          )
        `)
        .eq('customer_id', customerData.id)
        .not('deal_id', 'is', null)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      if (data) {
        setFavorites(data as FavoriteDeal[]);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load your favorites. Please try again.');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (deleteError) throw deleteError;

      setFavorites(favorites.filter(f => f.id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Failed to remove favorite. Please try again.');
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const calculateSavings = (original: number, price: number) => {
    const savings = ((original - price) / original) * 100;
    return Math.round(savings);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading favorites...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <h1 className="text-2xl font-bold text-slate-900">My Favorites</h1>
            </div>
            <p className="text-slate-600 mt-2">Deals you've saved for later</p>
          </CardHeader>
          <CardBody>
            {error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Couldn't Load Favorites</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <Button onClick={fetchFavorites}>Try Again</Button>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No favorites yet</h3>
                <p className="text-slate-600 mb-4">Start adding deals to your favorites to see them here</p>
                <Button onClick={() => navigate('/dashboard')}>
                  Browse Deals
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(favorite.id);
                      }}
                      className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </button>

                    <div
                      onClick={() => navigate(`/deal/${favorite.deal.id}`)}
                    >
                      {favorite.deal.image_url ? (
                        <img
                          src={favorite.deal.image_url}
                          alt={favorite.deal.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-[#2BB673] to-[#25a062] flex items-center justify-center">
                          <Tag className="w-12 h-12 text-white/50" />
                        </div>
                      )}

                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                          {favorite.deal.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {favorite.deal.short_description}
                        </p>

                        <div className="flex items-center text-sm text-slate-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="truncate">{favorite.deal?.merchant?.business_name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-[#2BB673]">
                              {formatPrice(favorite.deal.price_cents)}
                            </span>
                            <span className="text-sm text-slate-500 line-through ml-2">
                              {formatPrice(favorite.deal.original_value_cents)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-[#F5B82E] bg-[#F5B82E]/10 px-2 py-1 rounded">
                            {calculateSavings(favorite.deal.original_value_cents, favorite.deal.price_cents)}% OFF
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
