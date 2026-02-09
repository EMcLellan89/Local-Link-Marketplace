import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Trophy, Medal, Flame, TrendingUp, Award,
  Users, Target, Zap, Crown, Star
} from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import Card from '../../components/ui/Card';

interface LeaderboardEntry {
  id: string;
  system_id: string;
  company_name: string;
  primary_contact: string;
  current_streak: number;
  longest_streak: number;
  total_active_days: number;
  total_points: number;
  points_last_7_days: number;
  points_last_30_days: number;
  total_merchants_signed: number;
  total_sales: number;
  challenge_status: string | null;
  challenge_days_completed: number;
  overall_rank: number;
  monthly_rank: number;
}

type TimeFrame = 'all-time' | 'monthly' | 'weekly';

export default function PartnerLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly');
  const [myPartnerId, setMyPartnerId] = useState<string>('');

  useEffect(() => {
    loadLeaderboard();
  }, [timeFrame]);

  async function loadLeaderboard() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current partner
      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (partner) {
        setMyPartnerId(partner.id);
      }

      // Load leaderboard
      const { data, error } = await supabase
        .from('partner_leaderboard_view')
        .select('*')
        .order(
          timeFrame === 'weekly' ? 'points_last_7_days' :
          timeFrame === 'monthly' ? 'points_last_30_days' :
          'total_points',
          { ascending: false }
        )
        .limit(50);

      if (error) throw error;

      if (data) {
        setLeaderboard(data);

        // Find my entry
        const me = data.find(entry => entry.id === partner?.id);
        if (me) {
          setMyEntry(me);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return <span className="text-sm font-bold text-gray-600">#{rank}</span>;
  }

  function getPoints(entry: LeaderboardEntry): number {
    if (timeFrame === 'weekly') return entry.points_last_7_days;
    if (timeFrame === 'monthly') return entry.points_last_30_days;
    return entry.total_points;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />

        {/* Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Partner Leaderboard</h1>
              <p className="text-gray-600">Compete, earn points, and climb the ranks</p>
            </div>
          </div>

          {/* Time Frame Selector */}
          <div className="flex gap-2 mb-6">
            {[
              { value: 'weekly' as TimeFrame, label: 'This Week' },
              { value: 'monthly' as TimeFrame, label: 'This Month' },
              { value: 'all-time' as TimeFrame, label: 'All Time' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeFrame(option.value)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  timeFrame === option.value
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* My Stats */}
          {myEntry && (
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Your Rank</div>
                  <div className="text-3xl font-bold text-gray-900">
                    #{timeFrame === 'monthly' ? myEntry.monthly_rank : myEntry.overall_rank}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Points</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {getPoints(myEntry)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-blue-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <div className="text-xs text-gray-600">Streak</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{myEntry.current_streak}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-green-600" />
                    <div className="text-xs text-gray-600">Best</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{myEntry.longest_streak}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <div className="text-xs text-gray-600">Merchants</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{myEntry.total_merchants_signed}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <div className="text-xs text-gray-600">Sales</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{myEntry.total_sales}</div>
                </div>
              </div>
            </Card>
          )}

          {/* Points System */}
          <Card className="p-6 mb-6 bg-white">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              How to Earn Points
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Challenge Day</div>
                  <div className="text-gray-600">10 points</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Link Clicked</div>
                  <div className="text-gray-600">5 points</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Merchant Signed</div>
                  <div className="text-gray-600">100 points</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Sale Made</div>
                  <div className="text-gray-600">50 points</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      Streak
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-purple-500" />
                      Merchants
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Sales
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isMe = entry.id === myPartnerId;
                  const points = getPoints(entry);

                  return (
                    <tr
                      key={entry.id}
                      className={`${
                        isMe ? 'bg-blue-50' : 'hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getRankIcon(rank)}
                          {rank <= 3 && (
                            <div className={`w-2 h-2 rounded-full ${
                              rank === 1 ? 'bg-yellow-500' :
                              rank === 2 ? 'bg-gray-400' :
                              'bg-orange-600'
                            }`} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`font-medium ${isMe ? 'text-blue-900' : 'text-gray-900'}`}>
                            {entry.company_name || 'Partner'}
                            {isMe && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{entry.system_id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {entry.current_streak > 0 && (
                            <Flame className="w-4 h-4 text-orange-500" />
                          )}
                          <span className={`font-semibold ${
                            entry.current_streak >= 7 ? 'text-orange-600' :
                            entry.current_streak >= 3 ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}>
                            {entry.current_streak}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-lg text-gray-900">
                          {points.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-900">{entry.total_merchants_signed}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-900">{entry.total_sales}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Bottom Encouragement */}
        <Card className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-4">
            <Award className="w-12 h-12 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Keep Going!
              </h3>
              <p className="text-sm text-gray-600">
                Complete the 7-Day Challenge to earn points, or sign up merchants to jump the leaderboard.
                Every action counts.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
