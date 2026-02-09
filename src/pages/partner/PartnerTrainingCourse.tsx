import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BookOpen, CheckCircle2, GraduationCap, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { SEO } from '../../components/SEO';
import { DEV_MODE } from '../../lib/devMode';

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  thumbnail_url: string | null;
  is_free: boolean;
  target_audience: string;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  display_order: number;
  lesson_count: number;
}

export default function PartnerTrainingCourse() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseSlug]);

  async function loadCourse() {
    try {
      // In dev mode, allow viewing
      if (!DEV_MODE && !user) {
        navigate('/partner/login');
        return;
      }

      const { data: courseData, error: courseError } = await supabase
        .from('academy_courses')
        .select('*')
        .eq('slug', courseSlug)
        .eq('target_audience', 'partner')
        .single();

      if (courseError) throw courseError;

      // If not a partner course, redirect
      if (courseData?.target_audience !== 'partner') {
        navigate('/partner/training');
        return;
      }

      setCourse(courseData);

      const { data: modulesData } = await supabase
        .from('academy_modules')
        .select('*, academy_lessons(count)')
        .eq('course_id', courseData.id)
        .order('display_order');

      const formattedModules = modulesData?.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        display_order: m.display_order,
        lesson_count: m.academy_lessons?.[0]?.count || 0
      })) || [];

      setModules(formattedModules);
    } catch (err) {
      console.error('Error loading course:', err);
      navigate('/partner/training');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
          <Button onClick={() => navigate('/partner/training')} className="mt-4">
            Back to Training Portal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={course.title} description={course.subtitle || course.description || ''} />

      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('/partner/training')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Training Portal
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 rounded-full text-sm font-bold mb-4">
                <CheckCircle2 className="h-4 w-4" />
                FREE - Included with Partnership
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

              {course.subtitle && (
                <p className="text-xl text-orange-100 mb-6">{course.subtitle}</p>
              )}

              {course.description && (
                <p className="text-orange-100 mb-8">{course.description}</p>
              )}

              <Button
                onClick={() => navigate(`/partner/training/${courseSlug}/dashboard`)}
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>

              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {module.title}
                        </h3>

                        {module.description && (
                          <p className="text-gray-600 mb-3">{module.description}</p>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <BookOpen className="h-4 w-4" />
                          <span>{module.lesson_count} Lessons</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-4">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold mb-4">
                    <CheckCircle2 className="h-4 w-4" />
                    100% Free
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included:</h3>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Lifetime access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">All {modules.length} modules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Video lessons</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Downloadable resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Partner support</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => navigate(`/partner/training/${courseSlug}/dashboard`)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Start Learning
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
