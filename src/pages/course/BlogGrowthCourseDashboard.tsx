import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Lock,
  CheckCircle,
  Clock,
  Award,
  FileText,
  Users,
  Briefcase,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { checkBlogCourseAccess, getTierFeatures, CourseAccessInfo } from '../../lib/courseAccess';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Module {
  id: string;
  module_index: number;
  title: string;
  description: string | null;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  lesson_index: number;
  title: string;
  video_duration_minutes: number | null;
  is_preview: boolean;
  completed: boolean;
}

export default function BlogGrowthCourseDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accessInfo, setAccessInfo] = useState<CourseAccessInfo | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/merchant/courses/blog-growth-system/dashboard');
      return;
    }

    loadCourseData();
  }, [user]);

  const loadCourseData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Check access
      const access = await checkBlogCourseAccess(user.id);
      setAccessInfo(access);

      if (!access.hasAccess) {
        setLoading(false);
        return;
      }

      // Get course modules and lessons
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', 'blog-growth-system')
        .maybeSingle();

      if (!course) {
        throw new Error('Course not found');
      }

      const { data: modulesData } = await supabase
        .from('course_modules')
        .select(`
          id,
          module_index,
          title,
          description,
          course_lessons (
            id,
            lesson_index,
            title,
            video_duration_minutes,
            is_preview
          )
        `)
        .eq('course_id', course.id)
        .order('module_index');

      // Get completed lessons
      const { data: completedData } = await supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('user_id', user.id);

      const completedLessonIds = new Set(completedData?.map(c => c.lesson_id) || []);

      // Format modules with completion status
      const formattedModules = (modulesData || []).map(module => ({
        ...module,
        lessons: ((module as any).course_lessons || [])
          .map((lesson: any) => ({
            ...lesson,
            completed: completedLessonIds.has(lesson.id)
          }))
          .sort((a: Lesson, b: Lesson) => a.lesson_index - b.lesson_index)
      }));

      setModules(formattedModules);

      // Calculate progress
      const totalLessons = formattedModules.reduce((sum, m) => sum + m.lessons.length, 0);
      const completedLessons = formattedModules.reduce(
        (sum, m) => sum + m.lessons.filter(l => l.completed).length,
        0
      );
      setProgress({ completed: completedLessons, total: totalLessons });
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tierFeatures = accessInfo?.tier ? getTierFeatures(accessInfo.tier) : null;
  const progressPercentage = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!accessInfo?.hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="p-8 text-center">
            <Lock className="mx-auto mb-4 h-16 w-16 text-slate-400" />
            <h2 className="mb-4 text-3xl font-bold text-slate-900">Course Access Required</h2>
            <p className="mb-6 text-lg text-slate-600">
              You need to purchase the Blog Growth System to access this content.
            </p>
            <Button
              onClick={() => navigate('/academy/courses/blog-growth-system')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              View Course Details
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/merchant/dashboard')}
            className="mb-4 flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-slate-900">The Blog Growth System</h1>
              <p className="text-lg text-slate-600">
                Your Path to Consistent Organic Traffic & Leads
              </p>
            </div>
            {tierFeatures && (
              <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-2">
                <div className="text-sm font-semibold text-cyan-900">{tierFeatures.name}</div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Your Progress</h3>
                <span className="text-2xl font-bold text-cyan-600">{progressPercentage}%</span>
              </div>
              <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-slate-600">
                {progress.completed} of {progress.total} lessons completed
              </p>
            </Card>

            {/* Modules */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Course Curriculum</h2>
              {modules.map((module) => (
                <Card key={module.id} className="p-6">
                  <div className="mb-4">
                    <div className="mb-1 text-sm font-semibold text-cyan-600">
                      Module {module.module_index}
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">{module.title}</h3>
                    {module.description && (
                      <p className="text-slate-600">{module.description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => navigate(`/course/lesson/${lesson.id}`)}
                        className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-4 transition-all hover:border-cyan-300 hover:bg-cyan-50"
                      >
                        <div className="flex items-center gap-4">
                          {lesson.completed ? (
                            <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                          ) : (
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-slate-300">
                              <span className="text-xs text-slate-500">{lesson.lesson_index}</span>
                            </div>
                          )}
                          <div className="text-left">
                            <div className="font-semibold text-slate-900">{lesson.title}</div>
                            {lesson.video_duration_minutes && (
                              <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Clock className="h-3 w-3" />
                                {lesson.video_duration_minutes} min
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Exam Card */}
            {progressPercentage === 100 && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Award className="h-12 w-12 flex-shrink-0 text-yellow-500" />
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-slate-900">Ready for Certification?</h3>
                    <p className="mb-4 text-slate-600">
                      You\'ve completed all lessons! Take the final exam to earn your Merchant Blog Certification.
                    </p>
                    <Button
                      onClick={() => navigate('/course/exam/blog-growth-system')}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      Take Final Exam
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tier Benefits */}
            {tierFeatures && (
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Your Benefits</h3>
                <div className="space-y-3">
                  {tierFeatures.canAccessTemplates && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 flex-shrink-0 text-cyan-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Writing Templates</div>
                        <p className="text-sm text-slate-600">Access proven blog templates</p>
                      </div>
                    </div>
                  )}
                  {tierFeatures.canAccessJobBoard && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 flex-shrink-0 text-cyan-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Job Board Access</div>
                        <p className="text-sm text-slate-600">Hire vetted blog writers</p>
                      </div>
                    </div>
                  )}
                  {tierFeatures.canAccessPartnerNetwork && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 flex-shrink-0 text-cyan-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Partner Network</div>
                        <p className="text-sm text-slate-600">Connect with specialists</p>
                      </div>
                    </div>
                  )}
                  {tierFeatures.canRequestDFY && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-cyan-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Done-For-You Service</div>
                        <p className="text-sm text-slate-600">Full blog management</p>
                      </div>
                    </div>
                  )}
                </div>

                {accessInfo.tier !== 'dfy' && (
                  <div className="mt-6 rounded-lg bg-slate-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-900">
                      Want More Support?
                    </div>
                    <p className="mb-3 text-sm text-slate-600">
                      Upgrade to get additional templates, partner access, and DFY services.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => navigate('/academy/courses/blog-growth-system')}
                      variant="outline"
                      className="w-full"
                    >
                      View Upgrade Options
                    </Button>
                  </div>
                )}
              </Card>
            )}

            {/* Resources Card */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Course Resources</h3>
              <div className="space-y-3">
                <a
                  href="/support"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
                >
                  <AlertCircle className="h-5 w-5 text-cyan-600" />
                  <span className="font-medium text-slate-900">Get Support</span>
                </a>
                <a
                  href="/merchant/courses/blog-growth-system/downloads"
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
                >
                  <FileText className="h-5 w-5 text-cyan-600" />
                  <span className="font-medium text-slate-900">Downloadable Resources</span>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
