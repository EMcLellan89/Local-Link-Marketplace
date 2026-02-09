import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { devCourseData } from '../../lib/devCourseData';
import { markLessonComplete } from '../../lib/courseProgress';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface Lesson {
  id: string;
  lesson_index: number;
  title: string;
  content_md?: string | null;
  content_markdown?: string | null;
  article_content?: string | null;
  video_url: string | null;
  video_duration_minutes?: number | null;
  video_duration_seconds?: number | null;
  module_id: string;
}

interface Module {
  id: string;
  module_index: number;
  title: string;
  course_id: string;
}

interface Progress {
  completed: boolean;
}

interface AllLessons {
  id: string;
  title: string;
  module_index: number;
}

export default function LessonViewer() {
  const { lessonId, courseSlug } = useParams<{ lessonId: string; courseSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [allLessons, setAllLessons] = useState<AllLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [certificateCode, setCertificateCode] = useState<string | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (lessonId) {
      loadLesson();
    }
  }, [user, lessonId, navigate]);

  async function loadLesson() {
    if (!user || !lessonId) return;

    if (DEV_MODE) {
      console.log('DEV MODE: Loading lesson', { courseSlug, lessonId });

      if (!courseSlug) {
        console.error('DEV MODE: No courseSlug provided');
        setLoading(false);
        return;
      }

      const courseData = devCourseData[courseSlug];
      if (!courseData) {
        console.error('DEV MODE: Course not found in devCourseData:', courseSlug);
        console.log('Available courses:', Object.keys(devCourseData));
        setLoading(false);
        navigate('/academy');
        return;
      }

      let foundLesson: any = null;
      let foundModule: any = null;

      for (const module of courseData.modules) {
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) {
          foundLesson = lesson;
          foundModule = module;
          break;
        }
      }

      if (!foundLesson || !foundModule) {
        console.error('DEV MODE: Lesson not found:', { lessonId, courseSlug });
        setLoading(false);
        navigate(`/learn/${courseSlug}`);
        return;
      }

      console.log('DEV MODE: Lesson loaded successfully', { lesson: foundLesson, module: foundModule });

      const genericContent = `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
<h2 style="color: white; margin-top: 0;">${foundLesson.title}</h2>
<p style="color: rgba(255,255,255,0.95); font-size: 16px;">This is a comprehensive lesson covering ${foundLesson.title}. In this session, you'll gain practical knowledge and actionable strategies to implement immediately.</p>
</div>

<h3>What You'll Learn:</h3>
<ul>
<li>Key concepts and foundational principles</li>
<li>Practical implementation strategies</li>
<li>Real-world examples and case studies</li>
<li>Common pitfalls and how to avoid them</li>
<li>Action steps for immediate application</li>
</ul>

<h3>Key Takeaways:</h3>
<ol>
<li>Understand the core principles behind ${foundLesson.title}</li>
<li>Learn proven strategies that work in real-world scenarios</li>
<li>Develop actionable plans you can implement today</li>
<li>Avoid common mistakes that hold others back</li>
</ol>

<div style="background: #f3f4f6; padding: 20px; border-left: 4px solid #3b82f6; margin-top: 24px;">
<p style="margin: 0;"><strong>Next Steps:</strong> Apply what you learn in this lesson to your specific situation and move forward with confidence.</p>
</div>

<div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin-top: 24px;">
<p style="margin: 0; color: #92400e;"><strong>🚨 DEV MODE:</strong> This is sample lesson content. In production, actual course content will be displayed here.</p>
</div>`;

      setLesson({
        id: foundLesson.id,
        lesson_index: foundLesson.lesson_index,
        title: foundLesson.title,
        content_md: genericContent,
        video_url: null,
        video_duration_minutes: foundLesson.video_duration_minutes,
        module_id: foundModule.id,
      });

      setModule({
        id: foundModule.id,
        module_index: foundModule.module_index,
        title: foundModule.title,
        course_id: 'dev-course',
      });

      const allLessonsFlat = courseData.modules.flatMap(m =>
        m.lessons.map(l => ({
          id: l.id,
          title: l.title,
          module_index: m.module_index,
        }))
      );

      setProgress({ completed: false });
      setAllLessons(allLessonsFlat);
      setLoading(false);
      return;
    }

    try {
      // Try academy_lessons first, then fallback to course_lessons
      let lessonData = null;
      let isAcademyLesson = false;

      const { data: academyLesson } = await supabase
        .from('academy_lessons')
        .select('*, module:academy_modules(*)')
        .eq('id', lessonId)
        .maybeSingle();

      if (academyLesson) {
        lessonData = {
          ...academyLesson,
          lesson_index: academyLesson.display_order,
        };
        isAcademyLesson = true;
      } else {
        // Fallback to legacy course_lessons
        const { data: legacyLesson } = await supabase
          .from('course_lessons')
          .select('*, module:course_modules(*)')
          .eq('id', lessonId)
          .maybeSingle();

        if (legacyLesson) {
          lessonData = legacyLesson;
        }
      }

      if (!lessonData) {
        console.error('Lesson not found:', lessonId);
        console.error('Tried academy_lessons and course_lessons tables');
        console.error('CourseSlug:', courseSlug);
        navigate('/academy');
        return;
      }

      console.log('Lesson loaded:', {
        id: lessonData.id,
        title: lessonData.title,
        module_title: lessonData.module?.title,
        isAcademyLesson
      });

      setLesson(lessonData);
      setModule(lessonData.module);

      const courseId = lessonData.module.course_id;

      const { data: progressData } = await supabase
        .from('course_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      setProgress(progressData || { completed: false });

      // Load all lessons for navigation
      const modulesTable = isAcademyLesson ? 'academy_modules' : 'course_modules';
      const lessonsTable = isAcademyLesson ? 'academy_lessons' : 'course_lessons';
      const orderColumn = isAcademyLesson ? 'display_order' : 'module_index';

      const { data: modulesData } = await supabase
        .from(modulesTable)
        .select('id, ' + orderColumn)
        .eq('course_id', courseId)
        .order(orderColumn);

      if (modulesData) {
        const moduleIds = modulesData.map((m) => m.id);
        const lessonOrderColumn = isAcademyLesson ? 'display_order' : 'lesson_index';
        const { data: lessonsData } = await supabase
          .from(lessonsTable)
          .select(`id, title, ${lessonOrderColumn}, module_id`)
          .in('module_id', moduleIds)
          .order(lessonOrderColumn);

        const lessons = lessonsData?.map((l) => {
          const mod = modulesData.find((m) => m.id === l.module_id);
          return {
            id: l.id,
            title: l.title,
            module_index: isAcademyLesson ? (mod as any)?.display_order || 0 : (mod as any)?.module_index || 0,
          };
        }) || [];

        lessons.sort((a, b) => a.module_index - b.module_index);
        setAllLessons(lessons);
      }
    } catch (err) {
      console.error('Error loading lesson:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteLesson() {
    if (!user || !lessonId || !module) return;

    setCompleting(true);

    try {
      if (DEV_MODE) {
        setTimeout(() => {
          setProgress({ completed: true });
          setCompleting(false);
          console.log('DEV MODE: Lesson marked as complete');
        }, 500);
        return;
      }

      const courseId = module.course_id;
      await markLessonComplete(courseId, lessonId, user.id);
      setProgress({ completed: true });

      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/complete-lesson`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lessonId }),
        }
      );

      const result = await response.json();
      if (result.certificate_code) {
        setCertificateCode(result.certificate_code);
        setShowCertificateModal(true);
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
    } finally {
      setCompleting(false);
    }
  }

  function handlePrevious() {
    if (!lessonId || !courseSlug) return;
    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    if (currentIndex > 0) {
      navigate(`/learn/${courseSlug}/lesson/${allLessons[currentIndex - 1].id}`);
    }
  }

  function handleNext() {
    if (!lessonId || !courseSlug) return;
    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    if (currentIndex < allLessons.length - 1) {
      navigate(`/learn/${courseSlug}/lesson/${allLessons[currentIndex + 1].id}`);
    }
  }

  function handleBackToCourse() {
    if (courseSlug) {
      navigate(`/learn/${courseSlug}`);
    } else {
      navigate('/course/academy');
    }
  }

  function handleViewCertificate() {
    if (certificateCode) {
      navigate(`/certificate/${certificateCode}`);
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
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Lesson not found</p>
          <Button onClick={handleBackToCourse} className="mt-4">
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  return (
    <>
      <SEO title={`${lesson.title} - Course Lesson`} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleBackToCourse}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Course
            </button>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Module {module.module_index}: {module.title}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lesson {lesson.lesson_index}: {lesson.title}
                </h1>
              </div>
              {progress?.completed && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {lesson.video_url && (
            <div className="bg-black rounded-lg overflow-hidden mb-8 aspect-video">
              <iframe
                src={lesson.video_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {(lesson.content_markdown || lesson.article_content || lesson.content_md) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{
                  __html: (lesson.content_markdown || lesson.article_content || lesson.content_md || '').replace(/\n/g, '<br />')
                }} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 mb-8">
            <Button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              variant="outline"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous Lesson
            </Button>

            {!progress?.completed && (
              <Button
                onClick={handleCompleteLesson}
                disabled={completing}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                {completing ? 'Completing...' : 'Mark as Complete'}
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!hasNext}
              variant="outline"
            >
              Next Lesson
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Congratulations!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              You've completed the entire course and earned your certificate!
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowCertificateModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={handleViewCertificate}
                className="flex-1"
              >
                View Certificate
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}