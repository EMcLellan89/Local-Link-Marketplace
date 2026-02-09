import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BookOpen, Award, Users, GraduationCap, Target, TrendingUp } from 'lucide-react';
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

export default function PartnerTrainingPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartnerCourses();
  }, []);

  async function loadPartnerCourses() {
    try {
      // In dev mode, allow viewing
      if (!DEV_MODE && !user) {
        navigate('/partner/login');
        return;
      }

      // Fetch ALL partner courses (all are free)
      const { data: coursesData, error } = await supabase
        .from('academy_courses')
        .select('*')
        .eq('target_audience', 'partner')
        .eq('is_published', true)
        .order('title');

      if (error) throw error;

      setCourses(coursesData || []);
    } catch (err) {
      console.error('Error loading partner courses:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading training courses...</p>
        </div>
      </div>
    );
  }

  // Categorize courses
  const coreCourses = courses.filter(c =>
    c.slug.includes('partner-accelerator') ||
    c.slug.includes('selling-recurring-revenue') ||
    c.slug.includes('marketplace-deal-selling') ||
    c.slug.includes('local-service-side-hustle')
  );

  const salesCourses = courses.filter(c =>
    c.slug.includes('local-customers-autopilot-partner') ||
    c.slug.includes('selling-services-no-cold-calling-partner') ||
    c.slug.includes('bundle-services-partner') ||
    c.slug.includes('sell-crm-trades')
  );

  const contentCourses = courses.filter(c =>
    c.slug.includes('ugc-from-home') ||
    c.slug.includes('canva-money') ||
    c.slug.includes('ai-marketing') ||
    c.slug.includes('ai-review')
  );

  const industryCourses = courses.filter(c =>
    c.slug.includes('marketing-for-trades-partner') ||
    c.slug.includes('pet-businesses-partner') ||
    c.slug.includes('care-coordination-partner')
  );

  const certificationCourses = courses.filter(c =>
    c.slug.includes('ugc-creator-certification') ||
    c.slug.includes('local-link-certified-associate') ||
    c.slug.includes('certified-business-coach')
  );

  const uncategorized = courses.filter(c =>
    !coreCourses.includes(c) &&
    !salesCourses.includes(c) &&
    !contentCourses.includes(c) &&
    !industryCourses.includes(c) &&
    !certificationCourses.includes(c)
  );

  return (
    <>
      <SEO title="Partner Training Portal" description="Free training and playbooks for Local-Link partners" />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <GraduationCap className="h-4 w-4" />
                Partner Training Portal
              </div>

              <h1 className="text-5xl font-bold mb-4">
                Partner Playbooks & Training
              </h1>

              <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
                Everything you need to succeed as a Local-Link partner - 100% free training on selling, fulfillment, and growing your business
              </p>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{courses.length} Free Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Earn Certifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Unlock Higher Commissions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Core Partner Systems */}
          {coreCourses.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-8 w-8 text-orange-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Core Partner Systems</h2>
                  <p className="text-gray-600">Essential training to get started and grow your partnership</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coreCourses.map(course => (
                  <CourseCard key={course.slug} course={course} navigate={navigate} />
                ))}
              </div>
            </section>
          )}

          {/* Sales & Commission Skills */}
          {salesCourses.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Sales & Commission Skills</h2>
                  <p className="text-gray-600">Master selling to local businesses and maximize your earnings</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salesCourses.map(course => (
                  <CourseCard key={course.slug} course={course} navigate={navigate} />
                ))}
              </div>
            </section>
          )}

          {/* Content & Digital Income */}
          {contentCourses.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-8 w-8 text-orange-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Content & Digital Income</h2>
                  <p className="text-gray-600">Learn to create content and leverage AI for additional income</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentCourses.map(course => (
                  <CourseCard key={course.slug} course={course} navigate={navigate} />
                ))}
              </div>
            </section>
          )}

          {/* Industry-Specific Selling */}
          {industryCourses.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-orange-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Industry-Specific Selling</h2>
                  <p className="text-gray-600">Specialize in selling to specific industries for higher conversions</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industryCourses.map(course => (
                  <CourseCard key={course.slug} course={course} navigate={navigate} />
                ))}
              </div>
            </section>
          )}

          {/* Certification & Enablement */}
          {certificationCourses.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-8 w-8 text-orange-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Certification & Enablement</h2>
                  <p className="text-gray-600">Get certified and unlock premium opportunities</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificationCourses.map(course => (
                  <CourseCard key={course.slug} course={course} navigate={navigate} />
                ))}
              </div>
            </section>
          )}

          {/* Additional Training */}
          {uncategorized.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="h-8 w-8 text-orange-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Additional Training</h2>
                  <p className="text-gray-600">More courses to expand your skills</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uncategorized.map(course => (
                  <CourseCard key={course.slug} course={course} navigate={navigate} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function CourseCard({ course, navigate }: { course: Course; navigate: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-orange-100">
      <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-400 relative">
        <img
          src={course.thumbnail_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
          FREE
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.subtitle || course.description}
        </p>

        <Button
          onClick={() => navigate(`/partner/training/${course.slug}`)}
          variant="outline"
          className="w-full border-orange-500 text-orange-700 hover:bg-orange-50"
        >
          Start Learning
        </Button>
      </div>
    </div>
  );
}
