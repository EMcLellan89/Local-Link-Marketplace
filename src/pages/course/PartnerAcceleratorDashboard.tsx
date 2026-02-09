import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Circle, Lock, Award, BookOpen, Play } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';

export default function PartnerAcceleratorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [examAttempts, setExamAttempts] = useState<any[]>([]);
  const [certificate, setCertificate] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate('/login?redirect=/academy/courses/partner-accelerator/learn');
      return;
    }

    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', 'partner-accelerator')
      .single();

    if (!courseData) {
      navigate('/academy/courses/partner-accelerator');
      return;
    }

    const { data: modulesData } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseData.id)
      .order('module_index');

    const { data: lessonsData } = await supabase
      .from('course_lessons')
      .select('*, module:course_modules(module_index)')
      .in('module_id', modulesData?.map(m => m.id) || [])
      .order('lesson_index');

    const { data: progressData } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .in('lesson_id', lessonsData?.map(l => l.id) || []);

    const completed = new Set(progressData?.map(p => p.lesson_id) || []);
    const totalLessons = lessonsData?.length || 0;
    const progressPercent = totalLessons > 0 ? Math.round((completed.size / totalLessons) * 100) : 0;

    const { data: attemptsData } = await supabase
      .from('course_exam_attempts')
      .select('*')
      .eq('course_id', courseData.id)
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false });

    const { data: certData } = await supabase
      .from('certificates_issued')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', 'partner-accelerator')
      .maybeSingle();

    setCourse(courseData);
    setModules(modulesData || []);
    setLessons(lessonsData || []);
    setCompletedLessons(completed);
    setProgress(progressPercent);
    setExamAttempts(attemptsData || []);
    setCertificate(certData);
    setLoading(false);
  }

  const allLessonsComplete = lessons.length > 0 && completedLessons.size === lessons.length;
  const examPassed = examAttempts.some(a => a.passed);
  const canTakeExam = allLessonsComplete && !examPassed;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course?.title}</h1>
          <p className="text-gray-600">{course?.subtitle}</p>
        </div>

        {certificate && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12 text-green-600" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-1">Congratulations! You're Certified</h3>
                <p className="text-green-700">You've earned the Certified Local-Link Partner™ badge.</p>
              </div>
              <Link
                to={`/certificate/${certificate.certificate_code}`}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                View Certificate
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Course Progress</h3>
              <span className="text-2xl font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {completedLessons.size} of {lessons.length} lessons completed
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Next Lesson</h3>
            </div>
            {lessons.length > 0 ? (
              <p className="text-gray-600">
                {completedLessons.size === lessons.length
                  ? 'All lessons complete!'
                  : lessons.find(l => !completedLessons.has(l.id))?.title || 'Loading...'}
              </p>
            ) : (
              <p className="text-gray-600">No lessons available</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Certification</h3>
            </div>
            {examPassed ? (
              <p className="text-green-600 font-semibold">Certified ✓</p>
            ) : allLessonsComplete ? (
              <p className="text-amber-600 font-semibold">Ready for exam</p>
            ) : (
              <p className="text-gray-600">Complete all lessons first</p>
            )}
          </div>
        </div>

        {canTakeExam && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-1">Ready to Get Certified?</h3>
                <p className="text-blue-700">You've completed all lessons. Take the exam to earn your certification.</p>
              </div>
              <Link
                to="/academy/courses/partner-accelerator/exam"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap"
              >
                Take Exam
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {modules.map((module) => {
            const moduleLessons = lessons.filter(l => l.module_id === module.id);
            const moduleComplete = moduleLessons.every(l => completedLessons.has(l.id));

            return (
              <div key={module.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {moduleComplete ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Module {module.module_index}: {module.title}
                        </h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {moduleLessons.filter(l => completedLessons.has(l.id)).length}/{moduleLessons.length} complete
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {moduleLessons.map((lesson, index) => {
                    const isComplete = completedLessons.has(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        to={`/academy/courses/partner-accelerator/lesson/${lesson.id}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex-shrink-0">
                          {isComplete ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {module.module_index}.{lesson.lesson_index} {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {lesson.video_duration_minutes} min
                            {lesson.is_preview && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                Preview
                              </span>
                            )}
                          </p>
                        </div>

                        <Play className="w-5 h-5 text-blue-600" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {examAttempts.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam History</h3>
            <div className="space-y-3">
              {examAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">
                      Score: {attempt.score}% {attempt.passed && '✓'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(attempt.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    {attempt.passed ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Passed
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        Failed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
