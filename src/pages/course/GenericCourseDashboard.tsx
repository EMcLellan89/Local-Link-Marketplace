import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle, Play, Award, Download, Lock, Clock, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { devCourseData } from '../../lib/devCourseData';
import { getProgressDetail } from '../../lib/courseProgress';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
}

interface Enrollment {
  id: string;
  purchased_product_slug: string;
  created_at: string;
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
  completed?: boolean;
}

interface Certificate {
  certificate_code: string;
  created_at: string;
}

export default function GenericCourseDashboard() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/learn/${courseSlug}`);
      return;
    }

    const success = searchParams.get('success');
    if (success === '1') {
      setTimeout(() => {
        window.history.replaceState({}, '', `/learn/${courseSlug}`);
      }, 100);
    }

    loadCourseData();
  }, [user, courseSlug]);

  async function loadCourseData() {
    if (!user || !courseSlug) return;

    if (DEV_MODE) {
      loadDevModeData();
      return;
    }

    try {
      // Try academy_courses first
      let courseData = null;
      let isAcademyCourse = false;

      const { data: academyCourse } = await supabase
        .from('academy_courses')
        .select('*')
        .eq('slug', courseSlug)
        .maybeSingle();

      if (academyCourse) {
        courseData = academyCourse;
        isAcademyCourse = true;
      } else {
        // Fallback to legacy courses table
        const { data: legacyCourse } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', courseSlug)
          .maybeSingle();

        if (legacyCourse) {
          courseData = legacyCourse;
        }
      }

      if (!courseData) {
        console.error('Course not found:', courseSlug);
        console.error('Tried academy_courses and courses tables');
        navigate('/academy');
        return;
      }

      console.log('Course loaded:', {
        slug: courseData.slug,
        title: courseData.title,
        is_free: courseData.is_free,
        isAcademyCourse
      });

      setCourse(courseData);

      // Check enrollment/access
      if (isAcademyCourse) {
        // Check if user is a partner
        const { data: partnerData } = await supabase
          .from('partners')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        const isPartner = !!partnerData;
        const isPartnerCourse = courseData.target_audience === 'partner';
        const isFreeForUser = courseData.is_free || (isPartner && isPartnerCourse);

        // For academy courses, check if free or has purchase
        if (isFreeForUser) {
          // Free course or partner accessing partner course - automatically enrolled
          console.log('Free access - granting access automatically', {
            is_free: courseData.is_free,
            isPartner,
            isPartnerCourse
          });

          // Create enrollment record if it doesn't exist
          const { data: existingEnrollment } = await supabase
            .from('academy_enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', courseData.id)
            .maybeSingle();

          if (!existingEnrollment) {
            await supabase
              .from('academy_enrollments')
              .insert({
                user_id: user.id,
                course_id: courseData.id
              });
          }

          setEnrollment({
            id: existingEnrollment?.id || 'free-access',
            purchased_product_slug: 'free',
            created_at: existingEnrollment?.enrolled_at || new Date().toISOString(),
          });
        } else {
          // Check for purchase in academy_enrollments (paid courses also use this table)
          console.log('Paid course - checking academy_enrollments');
          const { data: accessData } = await supabase
            .from('academy_enrollments')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', courseData.id)
            .maybeSingle();

          if (!accessData) {
            console.error('Not enrolled in paid course - redirecting to purchase page');
            navigate(`/academy/${courseSlug}`);
            return;
          }

          console.log('Has access - enrollment found');
          setEnrollment({
            id: accessData.id,
            purchased_product_slug: 'purchased',
            created_at: accessData.enrolled_at,
          });
        }
      } else {
        // Legacy course - check enrollments table
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseData.id)
          .maybeSingle();

        if (!enrollmentData) {
          console.error('Not enrolled');
          navigate(`/academy/${courseSlug}`);
          return;
        }

        setEnrollment(enrollmentData);
      }

      // Load modules
      const modulesTable = isAcademyCourse ? 'academy_modules' : 'course_modules';
      const { data: modulesData } = await supabase
        .from(modulesTable)
        .select('*')
        .eq('course_id', courseData.id)
        .order(isAcademyCourse ? 'display_order' : 'module_index');

      if (modulesData && modulesData.length > 0) {
        let completedSet = new Set<string>();
        try {
          const progress = await getProgressDetail(courseData.id, user.id);
          completedSet = new Set(progress.completedLessonIds);
        } catch (e) {
          console.error('Failed to load progress:', e);
        }

        const lessonsTable = isAcademyCourse ? 'academy_lessons' : 'course_lessons';
        const lessonOrderColumn = isAcademyCourse ? 'display_order' : 'lesson_index';

        const modulesWithLessons = await Promise.all(
          modulesData.map(async (module) => {
            const { data: lessonsData } = await supabase
              .from(lessonsTable)
              .select('*')
              .eq('module_id', module.id)
              .order(lessonOrderColumn);

            const lessons = (lessonsData || []).map((lesson) => ({
              ...lesson,
              lesson_index: isAcademyCourse ? lesson.display_order : lesson.lesson_index,
              completed: completedSet.has(lesson.id),
            }));

            return {
              ...module,
              module_index: isAcademyCourse ? module.display_order : module.module_index,
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

      // Check for certificates
      if (isAcademyCourse) {
        const { data: certData } = await supabase
          .from('certificates_issued')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_slug', courseSlug)
          .maybeSingle();

        if (certData) {
          setCertificate({
            certificate_code: certData.certificate_code,
            created_at: certData.issued_at,
          });
        }
      } else {
        const { data: certData } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseData.id)
          .maybeSingle();

        if (certData) {
          setCertificate(certData);
        }
      }
    } catch (err) {
      console.error('Error loading course:', err);
      navigate('/academy');
    } finally {
      setLoading(false);
    }
  }

  function loadDevModeData() {
    console.log('DEV MODE: Loading course dashboard', courseSlug);
    console.log('Available courses:', Object.keys(devCourseData));

    const currentCourse = devCourseData[courseSlug!] || {
      title: 'Course Title',
      subtitle: 'Course subtitle',
      modules: [
        {
          id: 'module-1',
          module_index: 1,
          title: 'Module 1: Getting Started',
          description: 'Learn the fundamentals',
          lessons: [
            { id: 'lesson-1-1', lesson_index: 1, title: 'Introduction', video_duration_minutes: 12 },
            { id: 'lesson-1-2', lesson_index: 2, title: 'Core Concepts', video_duration_minutes: 15 },
          ],
        },
      ],
    };

    console.log('DEV MODE: Course data loaded', currentCourse);

    setCourse({
      id: 'dev-course-id',
      slug: courseSlug!,
      title: currentCourse.title,
      subtitle: currentCourse.subtitle,
    });

    setEnrollment({
      id: 'dev-enrollment',
      purchased_product_slug: 'dev-product',
      created_at: new Date().toISOString(),
    });

    const mockModules: Module[] = currentCourse.modules.map((m: any) => ({
      ...m,
      lessons: m.lessons.map((l: any) => ({ ...l, completed: false })),
    }));

    const totalLessons = mockModules.reduce((sum, m) => sum + m.lessons.length, 0);

    setModules(mockModules);
    setTotalLessons(totalLessons);
    setCompletedLessons(0);
    setLoading(false);
  }

  function handleLessonClick(lessonId: string) {
    navigate(`/learn/${courseSlug}/lesson/${lessonId}`);
  }

  function handleExamClick() {
    navigate(`/learn/${courseSlug}/exam`);
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/academy')}>
            Back to Academy
          </Button>
        </div>
      </div>
    );
  }

  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const allLessonsComplete = totalLessons > 0 && completedLessons === totalLessons;

  return (
    <>
      <SEO title={`${course.title} - Course Dashboard`} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
              onClick={() => navigate('/learn')}
              className="text-blue-100 hover:text-white mb-4"
            >
              ← Back to My Courses
            </button>

            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-xl text-blue-100 mb-6">
              {course.subtitle || 'Continue your learning journey'}
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
                  Download
                </Button>
              </div>
            </div>
          )}

          {allLessonsComplete && !certificate && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-4">
                <Award className="h-12 w-12 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Ready for the Exam?
                  </h3>
                  <p className="text-gray-600">
                    You've completed all lessons. Take the certification exam to earn your certificate!
                  </p>
                </div>
                <Button
                  onClick={handleExamClick}
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700"
                >
                  <Award className="h-5 w-5" />
                  Take Exam
                </Button>
              </div>
            </div>
          )}

          {modules.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Course content coming soon
              </h3>
              <p className="text-gray-600">
                This course is being updated with new content. Check back soon!
              </p>
            </div>
          ) : (
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
                          {module.description && (
                            <p className="text-gray-600 mb-4">{module.description}</p>
                          )}
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
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <Play className="h-5 w-5" />
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
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
