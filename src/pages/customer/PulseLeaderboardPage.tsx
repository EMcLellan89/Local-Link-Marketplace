import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Crown,
  Star,
  Zap,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  getCityLeaderboard,
  getUserLeaderboardPosition,
  getPointsBalance,
} from '../../lib/pulse';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';

type LeaderboardType = 'city_monthly' | 'national_quarterly' | 'lifetime';

export default function PulseLeaderboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<LeaderboardType>('city_monthly');
  const [city, setCity] = useState<string>('Pepperell');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [user, selectedType]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);

      // Get customer info
      let cid = customerId;
      if (user && !cid) {
        const { data: customer } = await supabase
          .from('customers')
          .select('id, city, points_balance')
          .eq('user_id', user.id)
          .single();

        if (customer) {
          cid = customer.id;
          setCustomerId(customer.id);
          setUserPoints(customer.points_balance || 0);
          if (customer.city) {
            setCity(customer.city);
          }
        }
      }

      // Load leaderboard
      const leaders = await getCityLeaderboard(city, selectedType, 100);
      setLeaderboard(leaders);

      // Get user's position if logged in
      if (cid) {
        const position = await getUserLeaderboardPosition(cid, city, selectedType);
        setUserRank(position);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-amber-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-white text-slate-900';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2BB673] to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:bg-white/20"
            onClick={() => navigate('/pulse')}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Feed
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Pulse Leaderboard</h1>
          </div>
          <p className="text-emerald-50 text-lg">
            Compete for prizes and glory in {city}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User's Current Rank Card */}
        {user && userRank && (
          <Card variant="bordered" className="mb-8 border-2 border-[#2BB673]">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#2BB673] rounded-full p-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Your Current Rank</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-slate-900">#{userRank.rank}</span>
                      <span className="text-lg text-slate-600">of {leaderboard.length}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 mb-1">Your Points</p>
                  <div className="flex items-center gap-2 justify-end">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span className="text-3xl font-bold text-slate-900">{userPoints}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setSelectedType('city_monthly')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedType === 'city_monthly'
                ? 'bg-[#2BB673] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            City Monthly
          </button>
          <button
            onClick={() => setSelectedType('national_quarterly')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedType === 'national_quarterly'
                ? 'bg-[#2BB673] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            National Quarterly
          </button>
          <button
            onClick={() => setSelectedType('lifetime')}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedType === 'lifetime'
                ? 'bg-[#2BB673] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            All-Time
          </button>
        </div>

        {/* Prize Info Banner */}
        <Card variant="bordered" className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 rounded-full p-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {selectedType === 'city_monthly' && 'Monthly City Prize: $500'}
                  {selectedType === 'national_quarterly' && 'Quarterly National Prize: $2,500'}
                  {selectedType === 'lifetime' && 'Lifetime Hall of Fame'}
                </h3>
                <p className="text-sm text-slate-700">
                  {selectedType === 'city_monthly' &&
                    'Top 3 players in each city win cash prizes at the end of each month!'}
                  {selectedType === 'national_quarterly' &&
                    'Top 10 national players win big prizes every quarter!'}
                  {selectedType === 'lifetime' && 'Eternal glory for the all-time top performers!'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Leaderboard */}
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <Card variant="bordered">
              <CardBody className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No rankings yet
                </h3>
                <p className="text-slate-600 mb-6">
                  Be the first to claim deals and climb the leaderboard!
                </p>
                <Button onClick={() => navigate('/pulse')}>Browse Deals</Button>
              </CardBody>
            </Card>
          ) : (
            leaderboard.map((entry, index) => {
              const isCurrentUser = customerId === entry.customer_id;
              const rankIcon = getRankIcon(entry.rank);
              const rankColor = getRankColor(entry.rank);

              return (
                <Card
                  key={entry.customer_id}
                  variant="bordered"
                  className={`${
                    isCurrentUser ? 'border-2 border-[#2BB673] shadow-lg' : ''
                  } ${entry.rank <= 3 ? 'shadow-md' : ''}`}
                >
                  <CardBody className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${rankColor}`}
                      >
                        {rankIcon || `#${entry.rank}`}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {entry.customer?.first_name || 'Anonymous'}{' '}
                            {entry.customer?.last_name?.[0] || ''}.
                          </span>
                          {isCurrentUser && (
                            <span className="bg-[#2BB673] text-white text-xs font-bold px-2 py-1 rounded">
                              YOU
                            </span>
                          )}
                          {entry.rank === 1 && (
                            <Crown className="w-4 h-4 text-amber-500 animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600">
                          {selectedType === 'city_monthly' && 'This month'}
                          {selectedType === 'national_quarterly' && 'This quarter'}
                          {selectedType === 'lifetime' && 'All time'}
                        </p>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Award className="w-5 h-5 text-amber-600" />
                          <span className="text-2xl font-bold text-slate-900">
                            {entry.points.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">points</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>

        {/* CTA for non-logged in users */}
        {!user && (
          <Card variant="bordered" className="mt-8">
            <CardBody className="text-center py-12">
              <Zap className="w-16 h-16 mx-auto text-[#2BB673] mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Join the Competition!
              </h3>
              <p className="text-slate-600 mb-6">
                Sign up to claim deals, earn points, and compete for prizes.
              </p>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
