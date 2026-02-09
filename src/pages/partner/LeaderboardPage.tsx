import { useState, useEffect } from "react";
import { Trophy, Award, TrendingUp, Zap, Star, Crown } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import BackButton from '../../components/ui/BackButton';

interface LeaderboardEntry {
  affiliate_code: string;
  display_name: string;
  points: number;
  current_badge: string;
  total_sales: number;
  total_earned: number;
  rank: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  salesRequired: number;
}

const BADGES: Badge[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Welcome to the program",
    icon: Star,
    color: "text-gray-500",
    salesRequired: 0,
  },
  {
    id: "starter_seller",
    name: "Starter Seller",
    description: "First sale completed",
    icon: Zap,
    color: "text-blue-500",
    salesRequired: 1,
  },
  {
    id: "momentum",
    name: "Momentum",
    description: "Building consistency",
    icon: TrendingUp,
    color: "text-green-500",
    salesRequired: 5,
  },
  {
    id: "closer",
    name: "Closer",
    description: "Proven track record",
    icon: Award,
    color: "text-purple-500",
    salesRequired: 10,
  },
  {
    id: "elite",
    name: "Elite",
    description: "Top performer",
    icon: Trophy,
    color: "text-orange-500",
    salesRequired: 25,
  },
  {
    id: "legend",
    name: "Legend",
    description: "Hall of fame",
    icon: Crown,
    color: "text-yellow-500",
    salesRequired: 50,
  },
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myAffiliate, setMyAffiliate] = useState<any>(null);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myBadges, setMyBadges] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);

    const { data: affiliateData } = await supabase
      .from("marketplace_affiliates")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (affiliateData) {
      setMyAffiliate(affiliateData);

      const { data: badgesData } = await supabase
        .from("marketplace_affiliate_badges")
        .select("*")
        .eq("marketplace_affiliate_id", affiliateData.id);

      setMyBadges(badgesData || []);
    }

    const leaderboardRes = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-marketplace-affiliate-leaderboard`
    );

    if (leaderboardRes.ok) {
      const leaderboardData = await leaderboardRes.json();
      setLeaderboard(leaderboardData);

      const myEntry = leaderboardData.find(
        (entry: any) => entry.affiliate_code === affiliateData?.affiliate_code
      );

      if (myEntry) {
        setMyRank(myEntry.rank);
      }
    }

    setLoading(false);
  };

  const getBadgeInfo = (badgeId: string) => {
    return BADGES.find((b) => b.id === badgeId) || BADGES[0];
  };

  const getNextBadge = (currentBadgeId: string) => {
    const currentIndex = BADGES.findIndex((b) => b.id === currentBadgeId);
    return BADGES[currentIndex + 1] || null;
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const currentBadge = getBadgeInfo(myAffiliate?.current_badge || "starter");
  const nextBadge = getNextBadge(myAffiliate?.current_badge || "starter");
  const CurrentBadgeIcon = currentBadge.icon;
  const NextBadgeIcon = nextBadge?.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Leaderboard</h1>
          <p className="text-gray-600">
            Compete with top partners and unlock exclusive badges
          </p>
        </div>

        {myAffiliate && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CurrentBadgeIcon className={`w-8 h-8 ${currentBadge.color}`} />
                <div>
                  <p className="text-sm text-gray-600">Your Badge</p>
                  <p className="text-xl font-bold text-gray-900">{currentBadge.name}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{currentBadge.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Your Rank</p>
                  <p className="text-xl font-bold text-gray-900">
                    {myRank ? `#${myRank}` : "Not Ranked"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{myAffiliate.points} points</p>
            </div>

            {nextBadge && NextBadgeIcon && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <NextBadgeIcon className={`w-8 h-8 ${nextBadge.color}`} />
                  <div>
                    <p className="text-sm text-gray-600">Next Badge</p>
                    <p className="text-xl font-bold text-gray-900">{nextBadge.name}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {nextBadge.salesRequired} sales required
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Badges</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {BADGES.map((badge) => {
                const Icon = badge.icon;
                const earned = myBadges.some((b) => b.badge_type === badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`text-center p-4 rounded-lg transition-all ${
                      earned
                        ? "bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200"
                        : "bg-gray-50 opacity-50"
                    }`}
                  >
                    <Icon className={`w-12 h-12 mx-auto mb-2 ${badge.color}`} />
                    <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                    {earned && (
                      <p className="text-xs text-green-600 mt-2 font-medium">✓ Earned</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Top Partners</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badge
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Earned
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No leaderboard data yet. Be the first to make a sale!
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry) => {
                    const badge = getBadgeInfo(entry.current_badge);
                    const BadgeIcon = badge.icon;
                    const isCurrentUser =
                      entry.affiliate_code === myAffiliate?.affiliate_code;

                    return (
                      <tr
                        key={entry.affiliate_code}
                        className={`${
                          isCurrentUser ? "bg-blue-50" : ""
                        } hover:bg-gray-50 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {entry.rank === 1 && (
                              <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                            )}
                            {entry.rank === 2 && (
                              <Trophy className="w-5 h-5 text-gray-400 mr-2" />
                            )}
                            {entry.rank === 3 && (
                              <Trophy className="w-5 h-5 text-orange-400 mr-2" />
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              #{entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {isCurrentUser ? "You" : entry.display_name || "Anonymous"}
                          </div>
                          <div className="text-xs text-gray-500">{entry.affiliate_code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <BadgeIcon className={`w-5 h-5 ${badge.color}`} />
                            <span className="text-sm text-gray-900">{badge.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                          {entry.points.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {entry.total_sales}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-semibold">
                          {formatCurrency(entry.total_earned)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">How Points Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">10 pts</p>
              <p className="text-sm">Per referral signup</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">100 pts</p>
              <p className="text-sm">Per paid conversion</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">1 pt</p>
              <p className="text-sm">Per $1 commission earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
