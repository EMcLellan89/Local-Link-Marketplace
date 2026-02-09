import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Tag, Clock, AlertCircle, Heart, Share2, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface DealDetail {
  id: string;
  title: string;
  description: string;
  short_description: string;
  original_value_cents: number;
  price_cents: number;
  image_url: string | null;
  redemption_instructions: string | null;
  max_quantity: number | null;
  quantity_sold: number;
  per_customer_limit: number | null;
  end_at: string | null;
  merchant: {
    id: string;
    business_name: string;
    address_line1: string;
    city: string;
    state: string;
    phone: string;
  };
}

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
  customer: {
    user_id: string;
  };
  profiles: {
    full_name: string;
  };
}

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [deal, setDeal] = useState<DealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDeal();
      fetchReviews();
      if (user) {
        checkFavorite();
      }
    }
  }, [id, user]);

  const fetchDeal = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dealError } = await supabase
        .from('deals')
        .select(`
          id,
          title,
          description,
          short_description,
          original_value_cents,
          price_cents,
          image_url,
          redemption_instructions,
          max_quantity,
          quantity_sold,
          per_customer_limit,
          end_at,
          merchant:merchants (
            id,
            business_name,
            address_line1,
            city,
            state,
            phone
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .maybeSingle();

      if (dealError) throw dealError;

      setDeal(data as DealDetail);
    } catch (err) {
      console.error('Error fetching deal:', err);
      setError('Failed to load deal details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;

    try {
      const { data, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          comment,
          is_verified_purchase,
          created_at,
          customer:customers!inner (
            user_id
          )
        `)
        .eq('deal_id', id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsError) throw reviewsError;

      if (data) {
        const reviewsWithProfiles = await Promise.all(
          data.map(async (review: any) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('user_id', review.customer.user_id)
              .maybeSingle();

            return {
              ...review,
              profiles: profileData || { full_name: 'Anonymous' }
            };
          })
        );

        setReviews(reviewsWithProfiles as Review[]);

        if (reviewsWithProfiles.length > 0) {
          const avg = reviewsWithProfiles.reduce((sum, r) => sum + r.rating, 0) / reviewsWithProfiles.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const checkFavorite = async () => {
    if (!user || !id) return;

    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (customerError) throw customerError;
      if (!customerData) return;

      const { data, error: favoriteError } = await supabase
        .from('favorites')
        .select('id')
        .eq('customer_id', customerData.id)
        .eq('deal_id', id)
        .maybeSingle();

      if (favoriteError) throw favoriteError;

      setIsFavorite(!!data);
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !id) return;

    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (customerError) throw customerError;
      if (!customerData) return;

      if (isFavorite) {
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('customer_id', customerData.id)
          .eq('deal_id', id);

        if (deleteError) throw deleteError;
        setIsFavorite(false);
      } else {
        const { error: insertError } = await supabase
          .from('favorites')
          .insert({
            customer_id: customerData.id,
            deal_id: id
          });

        if (insertError) throw insertError;
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorite. Please try again.');
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out this deal: ${deal?.title}`;

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }

      if (user && id) {
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (customerError) throw customerError;

        if (customerData) {
          const { error: shareError } = await supabase.from('social_shares').insert({
            customer_id: customerData.id,
            deal_id: id,
            platform
          });

          if (shareError) throw shareError;
        }
      }

      setShowShareMenu(false);
    } catch (err) {
      console.error('Error sharing deal:', err);
    }
  };

  const handlePurchase = () => {
    if (!deal || !isAvailable()) return;
    navigate(`/checkout/${deal.id}?quantity=${quantity}`);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const calculateSavings = (original: number, price: number) => {
    const savings = ((original - price) / original) * 100;
    return Math.round(savings);
  };

  const isAvailable = () => {
    if (!deal) return false;
    if (deal.max_quantity && deal.quantity_sold >= deal.max_quantity) return false;
    if (deal.end_at && new Date(deal.end_at) < new Date()) return false;
    return true;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading deal...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !deal) {
    return (
      <DashboardLayout>
        <Card variant="bordered">
          <CardBody>
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {error ? 'Error Loading Deal' : 'Deal Not Found'}
              </h3>
              <p className="text-slate-600 mb-4">
                {error || 'This deal may no longer be available'}
              </p>
              <div className="flex gap-3 justify-center">
                {error && <Button onClick={fetchDeal}>Try Again</Button>}
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Browse Other Deals
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Back to Deals
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={toggleFavorite}
              className={isFavorite ? 'text-red-500' : ''}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 className="w-5 h-5" />
              </Button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                  >
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                  >
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                  >
                    Share via Email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {deal.image_url ? (
              <img
                src={deal.image_url}
                alt={deal.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-lg flex items-center justify-center">
                <Tag className="w-24 h-24 text-white/50" />
              </div>
            )}
          </div>

          <Card variant="elevated">
            <CardHeader>
              <h1 className="text-2xl font-bold text-slate-900">{deal.title}</h1>
              <p className="text-slate-600 mt-2">{deal.short_description}</p>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#2BB673]">
                  {formatPrice(deal.price_cents)}
                </span>
                <span className="text-xl text-slate-500 line-through">
                  {formatPrice(deal.original_value_cents)}
                </span>
                <span className="text-sm font-medium text-[#F5B82E] bg-[#F5B82E]/10 px-2 py-1 rounded">
                  Save {calculateSavings(deal.original_value_cents, deal.price_cents)}%
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {deal.merchant.business_name}
                </div>
                <div className="ml-6">
                  {deal.merchant.address_line1}<br />
                  {deal.merchant.city}, {deal.merchant.state}
                </div>
                {deal.merchant.phone && (
                  <div className="ml-6">
                    {deal.merchant.phone}
                  </div>
                )}
              </div>

              {isAvailable() ? (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  {deal.per_customer_limit && (
                    <p className="text-sm text-slate-600">
                      Limit: {deal.per_customer_limit} per customer
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-700">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-slate-300 rounded-lg px-3 py-2"
                    >
                      {Array.from({ length: Math.min(deal.per_customer_limit || 5, 5) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div className="text-lg font-medium text-slate-900">
                    Total: {formatPrice(deal.price_cents * quantity)}
                  </div>

                  <Button
                    fullWidth
                    size="lg"
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    {purchasing ? 'Processing...' : 'Buy Now'}
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-200">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    This deal is no longer available
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">About This Deal</h2>
          </CardHeader>
          <CardBody>
            <p className="text-slate-700 whitespace-pre-line">{deal.description}</p>
            {deal.redemption_instructions && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h3 className="font-medium text-slate-900 mb-2">Redemption Instructions</h3>
                <p className="text-slate-600 whitespace-pre-line">{deal.redemption_instructions}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Customer Reviews</h2>
              {averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {reviews.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No reviews yet. Be the first to review this deal!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-200 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900">
                            {review.profiles.full_name}
                          </span>
                          {review.is_verified_purchase && (
                            <span className="text-xs bg-[#2BB673] text-white px-2 py-0.5 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-slate-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="font-medium text-slate-900 mb-1">{review.title}</h4>
                    )}
                    <p className="text-slate-700">{review.comment}</p>
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
