import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Play, Award, Download, Lock, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { NudgeBanner } from '../../components/NudgeBanner';
import { devCourseData } from '../../lib/devCourseData';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface Enrollment {
  id: string;
  status: string;
  enrolled_at: string;
  completed_at: string | null;
}

interface Module {
  id: string;
  module_index: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  lesson_index: number;
  title: string;
  video_duration_minutes: number | null;
  is_preview: boolean;
  completed?: boolean;
}

interface Certificate {
  certificate_code: string;
  issued_at: string;
}

export default function CourseDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/learn/online-sales-without-ads');
      return;
    }

    const success = searchParams.get('success');
    if (success === '1') {
      setTimeout(() => {
        window.history.replaceState({}, '', '/learn/online-sales-without-ads');
      }, 100);
    }

    loadCourseData();
  }, [user, navigate, searchParams]);

  async function loadCourseData() {
    if (!user) return;

    if (DEV_MODE) {
      setEnrollment({
        id: 'dev-enrollment',
        status: 'active',
        enrolled_at: new Date().toISOString(),
        completed_at: null,
      });

      const courseSlug = 'online-sales-without-ads';
      const courseData = devCourseData[courseSlug];

      if (!courseData) {
        setLoading(false);
        return;
      }

      const mockModules: Module[] = courseData.modules.map(m => ({
        id: m.id,
        module_index: m.module_index,
        title: m.title,
        description: m.description,
        lessons: m.lessons.map(l => ({
          id: l.id,
          lesson_index: l.lesson_index,
          title: l.title,
          video_duration_minutes: l.video_duration_minutes,
          is_preview: true,
          completed: false,
        })),
      }));

      const totalLessons = mockModules.reduce((sum, m) => sum + m.lessons.length, 0);

      setModules(mockModules);
      setTotalLessons(totalLessons);
      setCompletedLessons(0);
      setLoading(false);
      return;
    }

    try {
      const { data: courseData } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', 'online-sales-without-ads')
        .single();

      if (!courseData) {
        navigate('/marketplace/products/online-sales-without-ads');
        return;
      }

      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseData.id)
        .single();

      if (!enrollmentData) {
        navigate('/marketplace/products/online-sales-without-ads');
        return;
      }

      setEnrollment(enrollmentData);

      const { data: modulesData } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseData.id)
        .order('module_index');

      if (modulesData) {
        const modulesWithLessons = await Promise.all(
          modulesData.map(async (module) => {
            const { data: lessonsData } = await supabase
              .from('course_lessons')
              .select('*')
              .eq('module_id', module.id)
              .order('lesson_index');

            const lessonIds = (lessonsData || []).map((l) => l.id);
            const { data: progressData } = await supabase
              .from('lesson_progress')
              .select('lesson_id, completed')
              .eq('user_id', user.id)
              .in('lesson_id', lessonIds);

            const completedSet = new Set(
              (progressData || []).filter((p) => p.completed).map((p) => p.lesson_id)
            );

            const lessons = (lessonsData || []).map((lesson) => ({
              ...lesson,
              completed: completedSet.has(lesson.id),
            }));

            return {
              ...module,
              lessons,
            };
          })
        );

        setModules(modulesWithLessons);

        const total = modulesWithLessons.reduce(
          (sum, m) => sum + m.lessons.length,
          0
        );
        const completed = modulesWithLessons.reduce(
          (sum, m) => sum + m.lessons.filter((l) => l.completed).length,
          0
        );

        setTotalLessons(total);
        setCompletedLessons(completed);
      }

      const { data: certData } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseData.id)
        .single();

      setCertificate(certData);
    } catch (err) {
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleLessonClick(lessonId: string) {
    navigate(`/learn/online-sales-without-ads/lesson/${lessonId}`);
  }

  function handleCertificateDownload() {
    if (certificate) {
      navigate(`/certificate/${certificate.certificate_code}`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <>
      <SEO title="Online Sales Without Ads™ - Course Dashboard" />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">
              Online Sales Without Ads™
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Welcome back! Continue your learning journey.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-blue-100 mb-1">Your Progress</div>
                  <div className="text-3xl font-bold">
                    {completedLessons} / {totalLessons} Lessons
                  </div>
                </div>
                {certificate && (
                  <Button
                    onClick={handleCertificateDownload}
                    variant="outline"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <Award className="h-5 w-5 mr-2" />
                    View Certificate
                  </Button>
                )}
              </div>

              <div className="w-full bg-white/20 rounded-full h-4">
                <div
                  className="bg-white rounded-full h-4 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-sm text-blue-100 mt-2 text-right">
                {progressPercent}% Complete
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <NudgeBanner />

          {certificate && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-4">
                <Award className="h-12 w-12 text-green-600" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Congratulations! You've completed the course
                  </h3>
                  <p className="text-gray-600">
                    You've earned your certificate. Download it and share your achievement!
                  </p>
                </div>
                <Button
                  onClick={handleCertificateDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Certificate
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {modules.map((module) => {
              const moduleCompleted = module.lessons.every((l) => l.completed);
              const moduleProgress = module.lessons.length > 0
                ? Math.round(
                    (module.lessons.filter((l) => l.completed).length /
                      module.lessons.length) *
                      100
                  )
                : 0;

              return (
                <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                          moduleCompleted
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {moduleCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          module.module_index
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {module.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{module.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-blue-600 rounded-full h-2 transition-all"
                              style={{ width: `${moduleProgress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {module.lessons.filter((l) => l.completed).length} /{' '}
                            {module.lessons.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson.id)}
                        className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              lesson.completed
                                ? 'bg-green-100 text-green-700'
                                : lesson.is_preview
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : lesson.is_preview ? (
                              <Play className="h-5 w-5" />
                            ) : (
                              <Lock className="h-5 w-5" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              Lesson {lesson.lesson_index}: {lesson.title}
                            </h3>
                            {lesson.video_duration_minutes && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.video_duration_minutes} min</span>
                              </div>
                            )}
                          </div>

                          {lesson.completed && (
                            <div className="flex-shrink-0 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                              Completed
                            </div>
                          )}

                          {lesson.is_preview && !lesson.completed && (
                            <div className="flex-shrink-0 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                              Preview
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {!certificate && progressPercent === 100 && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                You're almost there!
              </h3>
              <p className="text-gray-600">
                Complete the final lesson to receive your certificate
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}