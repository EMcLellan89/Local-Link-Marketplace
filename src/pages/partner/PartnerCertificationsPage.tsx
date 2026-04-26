import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { GraduationCap, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { Link } from 'react-router-dom';

interface Certification {
  id: string;
  slug: string;
  name: string;
  description: string;
  required_for_job_categories: string[];
  earned: boolean;
  earned_at: string | null;
  score: number | null;
}

export default function PartnerCertificationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [earnedCount, setEarnedCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCertifications();
    }
  }, [user]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('partner-certifications', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      setCertifications(data.certifications);
      setEarnedCount(data.earned_count);
    } catch (err: any) {
      console.error('Error fetching certifications:', err);
      alert(err.message || 'Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading certifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton to="/partner/progress" label="Back to Progress" />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Certifications</h1>
          <p className="text-gray-600 mt-1">
            {earnedCount} of {certifications.length} certifications completed
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Training Progress</h2>
              <p className="text-sm text-gray-600 mt-1">
                Complete training to unlock job categories and earn more
              </p>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {Math.round((earnedCount / certifications.length) * 100)}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(earnedCount / certifications.length) * 100}%` }}
            ></div>
          </div>
        </Card>

        <div className="space-y-6">
          {certifications.map((cert) => (
            <Card
              key={cert.id}
              className={`p-6 transition-all ${
                cert.earned
                  ? 'bg-gradient-to-br from-green-50 to-white border-green-200 shadow-md'
                  : 'bg-white hover:shadow-lg'
              }`}
            >
              <div className="flex items-start gap-6">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                    cert.earned ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  {cert.earned ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : (
                    <Lock className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl mb-1">{cert.name}</h3>
                      {cert.earned && cert.earned_at && cert.score !== null && (
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            Completed {new Date(cert.earned_at).toLocaleDateString()}
                          </span>
                          <span className="font-semibold text-green-600">Score: {cert.score}%</span>
                        </div>
                      )}
                    </div>
                    {!cert.earned && (
                      <Link to="/academy">
                        <Button className="bg-green-600 hover:bg-green-700">
                          Start Training
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{cert.description}</p>

                  {cert.required_for_job_categories && cert.required_for_job_categories.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Unlocks Job Categories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cert.required_for_job_categories.map((category) => (
                          <span
                            key={category}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              cert.earned
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {earnedCount === certifications.length && (
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
            <div className="text-center">
              <GraduationCap className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Certifications Complete!</h2>
              <p className="text-gray-700">
                You've completed all available training certifications. You're now qualified for all job
                categories!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
