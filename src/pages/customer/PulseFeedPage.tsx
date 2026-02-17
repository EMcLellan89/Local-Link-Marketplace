import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Heart,
  TrendingUp,
  Users,
  Clock,
  Zap,
  Award,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  getPulseFeed,
  getFlashFridayDeals,
  claimDeal,
  hasClaimedToday,
  getActiveCities,
  detectUserCity,
  getPointsBalance,
  PulseDeal,
} from '../../lib/pulse';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';

export default function PulseFeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deals, setDeals] = useState<any[]>([]);
  const [flashFridayDeals, setFlashFridayDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cities, setCities] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [claimingDeal, setClaimingDeal] = useState<string | null>(null);
  const [claimedDeals, setClaimedDeals] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadInitialData();
  }, [user]);

  useEffect(() => {
    if (selectedCity) {
      loadFeed();
    }
  }, [selectedCity]);

  const loadInitialData = async () => {
    try {
      // Load cities
      const activeCities = await getActiveCities();
      setCities(activeCities);

      // Detect or get user's city
      let userCity = await detectUserCity();

      if (user) {
        const { data: customerData } = await supabase
          .from('customers')
          .select('id, city, points_balance')
          .eq('user_id', user.id)
          .single();

        if (customerData) {
          setCustomerId(customerData.id);
          setPoints(customerData.points_balance || 0);

          if (customerData.city) {
            userCity = customerData.city;
          }
        }
      }

      setSelectedCity(userCity || activeCities[0]?.name || 'Pepperell');
      setLoading(false);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLoading(false);
    }
  };

  const loadFeed = async () => {
    try {
      // Load main feed
      const feedDeals = await getPulseFeed(selectedCity, 50);
      setDeals(feedDeals);

      // Load Flash Friday if it's Friday
      const flashDeals = await getFlashFridayDeals(selectedCity);
      setFlashFridayDeals(flashDeals);

      // Check which deals user has claimed today
      if (customerId) {
        const claimedSet = new Set<string>();
        for (const deal of feedDeals) {
          const claimed = await hasClaimedToday(customerId, deal.id);
          if (claimed) {
            claimedSet.add(deal.id);
          }
        }
        setClaimedDeals(claimedSet);
      }
    } catch (error) {
      console.error('Error loading feed:', error);
    }
  };

  const handleClaimDeal = async (dealId: string) => {
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/pulse&dealId=${dealId}`);
      return;
    }

    if (!customerId) {
      alert('Customer profile not found. Please complete registration.');
      return;
    }

    setClaimingDeal(dealId);

    try {
      const result = await claimDeal(customerId, dealId);

      if (result.success) {
        setClaimedDeals(new Set([...claimedDeals, dealId]));

        // Update points
        const pointsData = await getPointsBalance(customerId);
        setPoints(pointsData.balance);

        alert('Deal claimed! +10 points earned!');
      } else {
        alert(result.message || 'Already claimed today');
      }
    } catch (error) {
      console.error('Error claiming deal:', error);
      alert('Failed to claim deal. Please try again.');
    } finally {
      setClaimingDeal(null);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const calculateSavings = (original: number, price: number) => {
    const savings = ((original - price) / original) * 100;
    return Math.round(savings);
  };

  const getBoostLabel = (boostType: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      homepage_featured: { text: 'FEATURED', color: 'bg-purple-600' },
      push_blast: { text: 'TRENDING', color: 'bg-rose-600' },
      flash_friday: { text: 'FLASH FRIDAY', color: 'bg-amber-600' },
      standard_7day: { text: 'SPONSORED', color: 'bg-blue-600' },
    };
    return labels[boostType] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading Pulse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with City Selector */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-[#2BB673]" />
                Pulse
              </h1>
              <p className="text-sm text-slate-600">What's happening now</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Points Display */}
              {user && (
                <button
                  onClick={() => navigate('/pulse/leaderboard')}
                  className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Award className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-amber-900">{points}</span>
                  <span className="text-sm text-amber-700">points</span>
                </button>
              )}

              {/* City Selector */}
              <div className="relative">
                <button className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">{selectedCity}</span>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Share Button */}
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/pulse/referral')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Share & Earn
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Flash Friday Section */}
        {flashFridayDeals.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Flash Friday</h2>
              </div>
              <p className="text-amber-50">Today only! These deals disappear at midnight.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashFridayDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onClaim={handleClaimDeal}
                  isClaimed={claimedDeals.has(deal.id)}
                  isClaiming={claimingDeal === deal.id}
                  onClick={() => navigate(`/deal/${deal.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Feed */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#2BB673]" />
            What's Hot in {selectedCity}
          </h2>
          <p className="text-sm text-slate-600">{deals.length} active deals</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClaim={handleClaimDeal}
              isClaimed={claimedDeals.has(deal.id)}
              isClaiming={claimingDeal === deal.id}
              onClick={() => navigate(`/deal/${deal.id}`)}
            />
          ))}
        </div>

        {deals.length === 0 && (
          <Card variant="bordered">
            <CardBody className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No active deals in {selectedCity}
              </h3>
              <p className="text-slate-600 mb-6">
                Be the first to know when new deals launch!
              </p>
              <Button>Notify Me</Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

// Deal Card Component
function DealCard({
  deal,
  onClaim,
  isClaimed,
  isClaiming,
  onClick,
}: {
  deal: any;
  onClaim: (dealId: string) => void;
  isClaimed: boolean;
  isClaiming: boolean;
  onClick: () => void;
}) {
  const savings = ((deal.original_value_cents - deal.price_cents) / deal.original_value_cents) * 100;
  const boostLabel = deal.boost_type !== 'none' ? getBoostLabel(deal.boost_type) : null;

  return (
    <Card variant="bordered" className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
      <div onClick={onClick}>
        {/* Image */}
        <div className="relative h-48 bg-slate-200">
          {deal.image_url ? (
            <img
              src={deal.image_url}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <MapPin className="w-12 h-12" />
            </div>
          )}

          {/* Boost Badge */}
          {boostLabel && (
            <div className={`absolute top-3 right-3 ${boostLabel.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
              {boostLabel.text}
            </div>
          )}

          {/* Savings Badge */}
          <div className="absolute top-3 left-3 bg-[#2BB673] text-white font-bold px-3 py-2 rounded-lg">
            Save {Math.round(savings)}%
          </div>

          {/* Social Proof */}
          {deal.claim_count > 0 && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <Users className="w-3 h-3" />
              {deal.claim_count} claimed today
            </div>
          )}
        </div>

        <CardBody>
          <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{deal.title}</h3>
          <p className="text-sm text-slate-600 mb-2">{deal.merchants?.business_name}</p>
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{deal.short_description}</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-[#2BB673]">
              ${(deal.price_cents / 100).toFixed(2)}
            </span>
            <span className="text-sm text-slate-500 line-through">
              ${(deal.original_value_cents / 100).toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onClaim(deal.id);
              }}
              disabled={isClaimed || isClaiming}
            >
              {isClaimed ? 'Claimed' : isClaiming ? 'Claiming...' : 'Claim +10pts'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle favorite
              }}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </CardBody>
      </div>
    </Card>
  );
}

function getBoostLabel(boostType: string) {
  const labels: Record<string, { text: string; color: string }> = {
    homepage_featured: { text: 'FEATURED', color: 'bg-purple-600' },
    push_blast: { text: 'TRENDING', color: 'bg-rose-600' },
    flash_friday: { text: 'FLASH FRIDAY', color: 'bg-amber-600' },
    standard_7day: { text: 'SPONSORED', color: 'bg-blue-600' },
  };
  return labels[boostType] || null;
}
