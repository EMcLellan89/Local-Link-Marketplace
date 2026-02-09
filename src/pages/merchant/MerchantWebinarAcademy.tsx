import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Play,
  Clock,
  BookOpen,
  Award,
  DollarSign,
  Lock,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  course_id: string;
  course_slug: string;
  course_title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  price_usd: number;
  compare_at_price_usd: number | null;
  is_free: boolean;
  total_duration_minutes: number | null;
  includes_workbook: boolean;
  includes_templates: boolean;
  certification_available: boolean;
  product_id: string | null;
  product_slug: string | null;
  module_count: number;
  lesson_count: number;
}

export default function MerchantWebinarAcademy() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAccess, setUserAccess] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCourses();
  }, [user]);

  async function loadCourses() {
    setLoading(true);

    try {
      // Load all merchant webinar courses from the view
      const { data: coursesData, error } = await supabase
        .from('merchant_course_catalog')
        .select('*')
        .order('is_free', { ascending: false })
        .order('price_usd', { ascending: false });

      if (error) throw error;

      if (coursesData) {
        setCourses(coursesData);

        // Check access for each course if user is logged in
        if (user) {
          const accessChecks: Record<string, boolean> = {};
          for (const course of coursesData) {
            const { data: hasAccess } = await supabase.rpc('user_has_course_access', {
              p_user_id: user.id,
              p_course_id: course.course_id
            });
            accessChecks[course.course_id] = hasAccess || false;
          }
          setUserAccess(accessChecks);
        }
      }
    } catch (error: any) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(course: Course) {
    if (!user) {
      navigate('/login?redirect=/merchant/webinar-academy');
      return;
    }

    if (!course.product_slug) {
      alert('This course is not available for purchase yet.');
      return;
    }

    try {
      // Create Stripe checkout session for this course
      const { data, error } = await supabase.functions.invoke('create-marketplace-checkout-session', {
        body: {
          user_id: user.id,
          product_slug: course.product_slug,
          success_url: `${window.location.origin}/academy/courses/${course.course_slug}`,
          cancel_url: `${window.location.origin}/merchant/webinar-academy`
        }
      });

      if (error) throw error;

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      alert(`Error: ${error.message}`);
    }
  }

  function handleViewCourse(course: Course) {
    navigate(`/academy/courses/${course.course_slug}`);
  }

  const paidCourses = courses.filter(c => !c.is_free);
  const freeCourses = courses.filter(c => c.is_free);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <GraduationCap className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-5xl font-bold">Merchant Webinar Academy</h1>
              <p className="text-xl text-blue-100 mt-2">
                Master the skills to grow your local business
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 mt-8 text-blue-50">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{courses.length} Complete Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>180+ Hours of Training</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Certifications Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Premium Courses Section */}
        {paidCourses.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Premium Courses</h2>
                <p className="text-gray-600 mt-1">
                  In-depth training to transform your business
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paidCourses.map((course) => (
                <CourseCard
                  key={course.course_id}
                  course={course}
                  hasAccess={userAccess[course.course_id] || false}
                  onPurchase={handlePurchase}
                  onViewCourse={handleViewCourse}
                  isPremium={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Free Courses Section */}
        {freeCourses.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Free Courses</h2>
                <p className="text-gray-600 mt-1">
                  Industry-specific training at no cost
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeCourses.map((course) => (
                <CourseCard
                  key={course.course_id}
                  course={course}
                  hasAccess={true}
                  onPurchase={handlePurchase}
                  onViewCourse={handleViewCourse}
                  isPremium={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of local business owners who have mastered these systems
          </p>
          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 font-bold text-lg transition"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  hasAccess: boolean;
  onPurchase: (course: Course) => void;
  onViewCourse: (course: Course) => void;
  isPremium: boolean;
}

function CourseCard({ course, hasAccess, onPurchase, onViewCourse, isPremium }: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Card Header */}
      <div className={`p-6 ${isPremium ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${isPremium ? 'bg-blue-100' : 'bg-green-100'}`}>
            <GraduationCap className={`w-8 h-8 ${isPremium ? 'text-blue-600' : 'text-green-600'}`} />
          </div>
          {hasAccess && (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Enrolled
            </span>
          )}
          {!hasAccess && !course.is_free && (
            <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
              <Lock className="w-4 h-4" />
              Premium
            </span>
          )}
          {course.is_free && (
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
              FREE
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
          {course.course_title}
        </h3>
        {course.subtitle && (
          <p className="text-sm text-gray-600 font-medium">{course.subtitle}</p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6">
        {course.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {course.description}
          </p>
        )}

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>{course.module_count} Modules</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Play className="w-4 h-4 text-blue-500" />
            <span>{course.lesson_count} Lessons</span>
          </div>
          {course.total_duration_minutes && (
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{course.total_duration_minutes} mins</span>
            </div>
          )}
          {course.certification_available && (
            <div className="flex items-center gap-2 text-gray-700">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Certificate</span>
            </div>
          )}
        </div>

        {/* Includes */}
        <div className="border-t border-gray-100 pt-4 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Includes</p>
          <div className="space-y-1 text-sm text-gray-600">
            {course.includes_workbook && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Downloadable Workbook</span>
              </div>
            )}
            {course.includes_templates && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Ready-to-Use Templates</span>
              </div>
            )}
            {course.certification_available && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Certification Exam</span>
              </div>
            )}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="border-t border-gray-100 pt-4">
          {!course.is_free && (
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                {course.compare_at_price_usd && course.compare_at_price_usd > course.price_usd && (
                  <span className="text-lg text-gray-400 line-through">
                    ${course.compare_at_price_usd}
                  </span>
                )}
                <span className="text-3xl font-bold text-gray-900">
                  ${course.price_usd}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">One-time payment • Lifetime access</p>
            </div>
          )}

          {hasAccess ? (
            <button
              onClick={() => onViewCourse(course)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold transition-all"
            >
              <Play className="w-5 h-5" />
              Continue Learning
            </button>
          ) : course.is_free ? (
            <button
              onClick={() => onViewCourse(course)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold transition-all"
            >
              <Play className="w-5 h-5" />
              Start Free Course
            </button>
          ) : (
            <button
              onClick={() => onPurchase(course)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all"
            >
              <DollarSign className="w-5 h-5" />
              Purchase Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
