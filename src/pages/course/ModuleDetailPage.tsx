import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { getProgressDetail } from '../../lib/courseProgress';
import { CheckCircle2, Circle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  lesson_index: number;
  est_minutes: number;
}

interface Module {
  id: string;
  title: string;
  summary: string;
  module_index: number;
  course_id: string;
  course_lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

export default function ModuleDetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();

  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!moduleId) return;
      setLoading(true);
      setError('');

      try {
        const { data: moduleData, error: moduleError } = await supabase
          .from('course_modules')
          .select(`
            id,
            title,
            summary,
            module_index,
            course_id,
            course_lessons (
              id,
              title,
              lesson_index,
              est_minutes
            )
          `)
          .eq('id', moduleId)
          .single();

        if (moduleError) throw moduleError;
        if (!mounted) return;

        setModule(moduleData);

        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('id, title, slug')
          .eq('id', moduleData.course_id)
          .single();

        if (courseError) throw courseError;
        if (mounted) setCourse(courseData);

        if (user) {
          try {
            const progress = await getProgressDetail(moduleData.course_id, user.id);
            if (mounted) setCompletedSet(new Set(progress.completedLessonIds));
          } catch (e) {
            console.error('Failed to load progress:', e);
          }
        }
      } catch (e: any) {
        if (mounted) setError(e.message || 'Failed to load module');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [moduleId, user]);

  const lessons = useMemo(() => {
    if (!module?.course_lessons) return [];
    return [...module.course_lessons].sort((a, b) => a.lesson_index - b.lesson_index);
  }, [module]);

  const firstIncomplete = useMemo(() => {
    if (!lessons.length) return null;
    return lessons.find(l => !completedSet.has(l.id)) || lessons[lessons.length - 1];
  }, [lessons, completedSet]);

  const completedCount = useMemo(() => {
    return lessons.filter(l => completedSet.has(l.id)).length;
  }, [lessons, completedSet]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
            Loading module...
          </div>
        </div>
      </div>
    );
  }

  if (error || !module || !course) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-lg border bg-white p-8">
            <h2 className="font-semibold mb-2 text-red-800">
              {error || 'Module not found'}
            </h2>
            <Link to="/academy" className="text-sm text-blue-600 hover:text-blue-800 underline">
              Back to Academy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 space-y-6">
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <div className="text-sm text-gray-600">
            <Link
              to={`/course/${course.slug}`}
              className="hover:text-gray-900 underline"
            >
              {course.title}
            </Link>
            {' '} → Module {module.module_index}
          </div>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
              <p className="text-gray-700">{module.summary}</p>
              <div className="mt-3 text-sm text-gray-500">
                Progress: {completedCount}/{lessons.length} lessons completed
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              {firstIncomplete && (
                <Link
                  to={`/course/lesson/${firstIncomplete.id}`}
                  className="rounded-lg bg-black text-white px-6 py-3 text-sm font-medium text-center hover:bg-gray-800 transition-colors"
                >
                  {completedCount === 0 ? 'Start Module' : 'Continue'}
                </Link>
              )}
              <Link
                to={`/course/${course.slug}`}
                className="rounded-lg border px-6 py-3 text-sm font-medium text-center hover:bg-gray-50 transition-colors"
              >
                Back to Course
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Lessons</h2>
          <div className="space-y-2">
            {lessons.map((lesson) => {
              const isComplete = completedSet.has(lesson.id);
              return (
                <Link
                  key={lesson.id}
                  to={`/course/lesson/${lesson.id}`}
                  className="block rounded-lg border p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      {isComplete ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 group-hover:text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold">
                        Lesson {module.module_index}.{lesson.lesson_index} — {lesson.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {lesson.est_minutes || 10} minutes
                      </div>
                    </div>

                    {isComplete && (
                      <div className="shrink-0">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          Completed
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}

            {lessons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No lessons available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
