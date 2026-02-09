import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Award, Lock, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import BackButton from '../../components/ui/BackButton';

interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_key: string;
  audience: string;
  sort_order: number;
  earned: boolean;
  earned_at: string | null;
}

export default function PartnerBadgesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedCount, setEarnedCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchBadges();
    }
  }, [user]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('partner-badges', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      setBadges(data.badges);
      setEarnedCount(data.earned_count);
    } catch (err: any) {
      console.error('Error fetching badges:', err);
      alert(err.message || 'Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton to="/partner/progress" label="Back to Progress" />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achievement Badges</h1>
          <p className="text-gray-600 mt-1">
            {earnedCount} of {badges.length} badges earned
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
              <p className="text-sm text-gray-600 mt-1">
                Complete milestones to unlock badges and track your growth
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round((earnedCount / badges.length) * 100)}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(earnedCount / badges.length) * 100}%` }}
            ></div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`p-6 transition-all ${
                badge.earned
                  ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-md'
                  : 'bg-white opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    badge.earned ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  {badge.earned ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                {badge.audience === 'enterprise_only' && (
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    Enterprise
                  </span>
                )}
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-2">{badge.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{badge.description}</p>

              {badge.earned && badge.earned_at && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">
                    Earned {new Date(badge.earned_at).toLocaleDateString()}
                  </span>
                </div>
              )}

              {!badge.earned && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Locked</span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {earnedCount === badges.length && (
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
            <div className="text-center">
              <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
              <p className="text-gray-700">
                You've earned all available badges. Keep up the outstanding work!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
