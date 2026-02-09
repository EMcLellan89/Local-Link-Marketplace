import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Award, Target, TrendingUp, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { Link } from 'react-router-dom';

interface ProgressData {
  badges_earned: number;
  total_badges: number;
  certs_earned: number;
  total_certs: number;
  outreach_count: number;
  completion_percentage: number;
  next_badge: {
    name: string;
    description: string;
  } | null;
}

export default function PartnerProgressPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('partner-progress', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      setProgress(data);
    } catch (err: any) {
      console.error('Error fetching progress:', err);
      alert(err.message || 'Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <BackButton to="/partner/dashboard" label="Back to Dashboard" />
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-gray-600">Unable to load progress data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton to="/partner/dashboard" label="Back to Dashboard" />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
          <p className="text-gray-600 mt-1">Track your growth and unlock achievements</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">
                {progress.badges_earned}/{progress.total_badges}
              </span>
            </div>
            <h3 className="font-semibold text-gray-700">Badges Earned</h3>
            <p className="text-sm text-gray-600 mt-1">Complete milestones to earn badges</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                {progress.certs_earned}/{progress.total_certs}
              </span>
            </div>
            <h3 className="font-semibold text-gray-700">Certifications</h3>
            <p className="text-sm text-gray-600 mt-1">Training completed and verified</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-yellow-600" />
              <span className="text-3xl font-bold text-gray-900">{progress.outreach_count}</span>
            </div>
            <h3 className="font-semibold text-gray-700">Outreach Activity</h3>
            <p className="text-sm text-gray-600 mt-1">Total contacts made</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{progress.completion_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress.completion_percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            You've completed {progress.badges_earned + progress.certs_earned} of{' '}
            {progress.total_badges + progress.total_certs} achievements
          </p>
        </Card>

        {progress.next_badge && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Next Up: {progress.next_badge.name}</h2>
            <p className="text-gray-700 mb-4">{progress.next_badge.description}</p>
            <Link to="/partner/badges">
              <Button>
                View All Badges
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/partner/badges">
                <Button className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  View All Badges
                </Button>
              </Link>
              <Link to="/partner/certifications">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                  <Target className="w-4 h-4 mr-2" />
                  View Certifications
                </Button>
              </Link>
              <Link to="/partner/outreach-log">
                <Button className="w-full justify-start bg-yellow-600 hover:bg-yellow-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Log Outreach Activity
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
            <h3 className="font-bold text-gray-900 mb-3">Pro Tip</h3>
            <p className="text-gray-700">
              Consistently logging your outreach activity helps you track your progress and unlocks the "First
              Pitch Sent" badge. Make it a daily habit!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
