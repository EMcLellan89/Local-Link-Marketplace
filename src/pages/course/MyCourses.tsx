import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Clock, CheckCircle2, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface Enrollment {
  course_id: string;
  purchased_product_slug: string;
  created_at: string;
  course: {
    slug: string;
    title: string;
    subtitle: string;
    image_url: string;
  };
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export default function MyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/learn');
      return;
    }

    loadEnrollments();
  }, [user]);

  async function loadEnrollments() {
    if (DEV_MODE) {
      loadDevModeEnrollments();
      return;
    }

    try {
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(slug, title, subtitle, image_url)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (enrollmentsData) {
        const enrichedEnrollments = await Promise.all(
          enrollmentsData.map(async (enrollment) => {
            const { data: modules } = await supabase
              .from('course_modules')
              .select('id')
              .eq('course_id', enrollment.course_id);

            if (!modules || modules.length === 0) {
              return { ...enrollment, progress: { completed: 0, total: 0, percentage: 0 } };
            }

            const moduleIds = modules.map(m => m.id);

            const { data: lessons } = await supabase
              .from('course_lessons')
              .select('id')
              .in('module_id', moduleIds);

            const lessonIds = lessons?.map(l => l.id) || [];

            const { data: progress } = await supabase
              .from('lesson_progress')
              .select('*')
              .eq('user_id', user?.id)
              .in('lesson_id', lessonIds)
              .eq('completed', true);

            const completed = progress?.length || 0;
            const total = lessonIds.length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
              ...enrollment,
              progress: { completed, total, percentage }
            };
          })
        );

        setEnrollments(enrichedEnrollments);
      }
    } catch (err) {
      console.error('Error loading enrollments:', err);
    } finally {
      setLoading(false);
    }
  }

  function loadDevModeEnrollments() {
    setEnrollments([
      {
        course_id: '1',
        purchased_product_slug: 'ugc-certified',
        created_at: new Date().toISOString(),
        course: {
          slug: 'ugc-from-home',
          title: 'UGC From Home™',
          subtitle: 'SAHM income creating content',
          image_url: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg'
        },
        progress: { completed: 8, total: 24, percentage: 33 }
      },
      {
        course_id: '2',
        purchased_product_slug: 'lca-pro',
        created_at: new Date().toISOString(),
        course: {
          slug: 'local-customers-on-autopilot',
          title: 'Local Customers on Autopilot™',
          subtitle: 'Get customers without ads',
          image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'
        },
        progress: { completed: 15, total: 15, percentage: 100 }
      }
    ]);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <>
        <SEO title="My Courses" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Courses Yet</h2>
            <p className="text-gray-600 mb-6">
              Browse Local-Link Academy to find courses that will help you grow your business
            </p>
            <Button onClick={() => navigate('/academy')}>
              Browse Courses
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="My Courses - Local-Link Academy" />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">My Courses</h1>
            <p className="text-blue-100">Continue learning and growing your skills</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.course_id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-green-500 relative">
                  <img
                    src={enrollment.course.image_url}
                    alt={enrollment.course.title}
                    className="w-full h-full object-cover"
                  />
                  {enrollment.progress && enrollment.progress.percentage === 100 && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Complete</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {enrollment.course.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    {enrollment.course.subtitle}
                  </p>

                  {enrollment.progress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-900">
                          {enrollment.progress.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {enrollment.progress.completed} of {enrollment.progress.total} lessons completed
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/learn/${enrollment.course.slug}`)}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Continue
                    </Button>

                    {enrollment.progress && enrollment.progress.percentage === 100 && (
                      <Button
                        onClick={() => navigate(`/learn/${enrollment.course.slug}/exam`)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Award className="h-4 w-4" />
                        Exam
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Want to Learn More?
            </h3>
            <p className="text-gray-600 mb-6">
              Explore more courses in Local-Link Academy
            </p>
            <Button onClick={() => navigate('/academy')}>
              Browse All Courses
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
