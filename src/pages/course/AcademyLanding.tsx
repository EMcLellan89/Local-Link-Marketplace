import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Users, Zap, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import { DEV_MODE, getDevRole } from '../../lib/devMode';

type UserRole = 'merchant' | 'partner' | 'creator' | 'general';

interface Course {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail_url: string;
  target_audience?: string;
  audience?: string;
  is_free?: boolean;
}

interface Product {
  slug: string;
  title: string;
  price_cents: number;
  metadata: any;
}

interface CourseWithPricing {
  course: Course;
  products: Product[];
  minPrice: number;
}

export default function AcademyLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithPricing[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('general');

  useEffect(() => {
    loadCourses();
  }, [user]);

  async function loadCourses() {
    try {
      // Determine user role
      let role: UserRole = 'general';

      if (DEV_MODE) {
        // In dev mode, use the dev role switcher
        const devRole = getDevRole();
        if (devRole === 'merchant') role = 'merchant';
        else if (devRole === 'partner') role = 'partner';
        else if (devRole === 'customer') role = 'general';
        else if (devRole === 'admin') role = 'general';
      } else if (user) {
        // In production, check database for actual role
        const [merchantCheck, partnerCheck, creatorCheck] = await Promise.all([
          supabase.from('merchants').select('id').eq('user_id', user.id).maybeSingle(),
          supabase.from('partners').select('id').eq('user_id', user.id).maybeSingle(),
          supabase.from('ugc_creators').select('id').eq('user_id', user.id).maybeSingle()
        ]);

        if (merchantCheck.data) role = 'merchant';
        else if (partnerCheck.data) role = 'partner';
        else if (creatorCheck.data) role = 'creator';
      }
      setUserRole(role);

      // Fetch merchant courses only for Local-Link Academy
      const { data: coursesData } = await supabase
        .from('academy_courses')
        .select('*')
        .eq('is_published', true)
        .eq('target_audience', 'merchant')
        .order('title');

      const { data: productsData } = await supabase
        .from('products_catalog')
        .select('*')
        .eq('is_active', true);

      console.log(`📚 Raw data: ${coursesData?.length || 0} courses, ${productsData?.length || 0} products`);

      const courseMap = new Map<string, CourseWithPricing>();

      coursesData?.forEach(course => {
        const isFree = course.is_free;

        // Only load products for non-free courses
        const courseProducts = !isFree
          ? (productsData?.filter(p => p.metadata?.course_slug === course.slug) || [])
          : [];

        console.log(`Course: ${course.slug}, Free: ${isFree}, Products: ${courseProducts.length}`);

        // Display course if it's free OR has products
        if (isFree || courseProducts.length > 0) {
          const minPrice = isFree ? 0 : (
            courseProducts.length > 0
              ? Math.min(...courseProducts.map(p => p.price_cents))
              : 0
          );

          courseMap.set(course.slug, {
            course,
            products: isFree ? [] : courseProducts,
            minPrice
          });
        } else {
          console.warn(`❌ Skipping ${course.slug}: not free and no products found`);
        }
      });

      const finalCourses = Array.from(courseMap.values());
      console.log(`📚 Academy: Loaded ${finalCourses.length} merchant courses`);
      console.log('Course slugs:', finalCourses.map(c => c.course.slug));
      setCourses(finalCourses);
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  }

  function loadDevModeCourses() {
    const mockCourses: CourseWithPricing[] = [
      // PAID COURSES - Tiered (multiple products)
      {
        course: {
          slug: 'local-customers-on-autopilot',
          title: 'Local Customers on Autopilot™',
          subtitle: 'Get customers without ads using Local-Link',
          description: 'Master the Local-Link platform and generate predictable revenue',
          thumbnail_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'lca-starter', title: 'Starter', price_cents: 9700, metadata: {} },
          { slug: 'lca-certified', title: 'Certified', price_cents: 19700, metadata: {} },
          { slug: 'lca-pro', title: 'Pro', price_cents: 29700, metadata: {} }
        ],
        minPrice: 9700
      },
      {
        course: {
          slug: 'automation-ai-local',
          title: 'Automation & AI for Local Business™',
          subtitle: 'Automate operations and leverage AI tools',
          description: 'Use automation and AI to streamline your business',
          thumbnail_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'automation-basic', title: 'Basic', price_cents: 49700, metadata: {} },
          { slug: 'automation-advanced', title: 'Advanced', price_cents: 99700, metadata: {} }
        ],
        minPrice: 49700
      },
      // PAID COURSES - Single price
      {
        course: {
          slug: 'ai-receptionist-missed-calls',
          title: 'AI Receptionist & Missed Call Recovery™',
          subtitle: 'Never miss a customer call again',
          description: 'Set up AI-powered call handling and follow-up',
          thumbnail_url: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'ai-receptionist', title: 'AI Receptionist Course', price_cents: 9700, metadata: {} }
        ],
        minPrice: 9700
      },
      {
        course: {
          slug: 'facebook-monetization-local',
          title: 'Facebook Monetization for Local Businesses™',
          subtitle: 'Turn your Facebook page into a revenue machine',
          description: 'Monetize your Facebook presence and drive sales',
          thumbnail_url: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'facebook-monetization', title: 'Facebook Monetization', price_cents: 19700, metadata: {} }
        ],
        minPrice: 19700
      },
      {
        course: {
          slug: 'reviews-that-convert',
          title: 'Reviews That Bring Customers In™',
          subtitle: 'Get more 5-star reviews automatically',
          description: 'Build a review generation system that runs on autopilot',
          thumbnail_url: 'https://images.pexels.com/photos/5717641/pexels-photo-5717641.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'reviews-course', title: 'Reviews Mastery', price_cents: 9700, metadata: {} }
        ],
        minPrice: 9700
      },
      {
        course: {
          slug: 'marketing-for-trades',
          title: 'Marketing for Trades (No Ads Required)™',
          subtitle: 'Sell to contractors, plumbers, electricians',
          description: 'Industry-specific marketing for trade businesses',
          thumbnail_url: 'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'trades-marketing', title: 'Trades Marketing', price_cents: 9700, metadata: {} }
        ],
        minPrice: 9700
      },
      {
        course: {
          slug: 'local-paws-passport-petconnect-crm',
          title: 'Pet Businesses That Get Found First™',
          subtitle: 'Dominate local search for pet services',
          description: 'Get found by pet owners in your area',
          thumbnail_url: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'pet-businesses', title: 'Pet Business Marketing', price_cents: 9700, metadata: {} }
        ],
        minPrice: 9700
      },
      {
        course: {
          slug: 'online-sales-without-ads',
          title: 'Online Sales Without Ads™',
          subtitle: 'Generate online revenue organically',
          description: 'Drive online sales without paying for ads',
          thumbnail_url: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'online-sales', title: 'Online Sales Course', price_cents: 19700, metadata: {} }
        ],
        minPrice: 19700
      },
      {
        course: {
          slug: 'lead-conversion-local',
          title: 'Lead Conversion Mastery™',
          subtitle: 'Turn more leads into paying customers',
          description: 'Master the art of converting leads to sales',
          thumbnail_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'lead-conversion-starter', title: 'Starter', price_cents: 29700, metadata: {} },
          { slug: 'lead-conversion-pro', title: 'Pro', price_cents: 69700, metadata: {} }
        ],
        minPrice: 29700
      },
      {
        course: {
          slug: 'customer-reactivation',
          title: 'Customer Reactivation Mastery™',
          subtitle: 'Win back lost customers automatically',
          description: 'Bring back customers who haven\'t bought in a while',
          thumbnail_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'reactivation-basic', title: 'Basic', price_cents: 29700, metadata: {} },
          { slug: 'reactivation-complete', title: 'Complete', price_cents: 59700, metadata: {} }
        ],
        minPrice: 29700
      },
      {
        course: {
          slug: 'local-seo-foundations',
          title: 'Local SEO Foundations™',
          subtitle: 'Get found on Google in your area',
          description: 'Master local SEO to dominate your market',
          thumbnail_url: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'local-seo', title: 'Local SEO Course', price_cents: 4900, metadata: {} }
        ],
        minPrice: 4900
      },
      {
        course: {
          slug: 'blog-growth-system',
          title: 'Blog Growth System™',
          subtitle: 'Turn Your Blog Into a Customer-Getting Machine',
          description: 'Master blogging to attract and convert local customers to YOUR business',
          thumbnail_url: 'https://images.pexels.com/photos/34600/pexels-photo.jpg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'blog-growth-merchant', title: 'Blog Growth Course', price_cents: 9700, metadata: {} }
        ],
        minPrice: 9700
      }
    ];

    setCourses(mockCourses);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Separate courses by pricing model (all merchant courses)
  const freeCourses = courses.filter(c => c.course.is_free || c.minPrice === 0);
  const tieredCourses = courses.filter(c => !c.course.is_free && c.minPrice > 0 && c.products.length > 1);
  const singleCourses = courses.filter(c => !c.course.is_free && c.minPrice > 0 && c.products.length === 1);

  console.log(`📊 Course breakdown: Free=${freeCourses.length}, Tiered=${tieredCourses.length}, Single=${singleCourses.length}, Total=${courses.length}`);

  return (
    <>
      <SEO title="Local-Link Academy™" description="Master local marketing, sales, and service delivery with expert-led courses" />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Award className="h-4 w-4" />
                Professional Certifications Available
              </div>

              <h1 className="text-5xl font-bold mb-4">
                Local-Link Academy™
              </h1>

              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Master local marketing, sales, and service delivery with expert-led courses that drive real business results
              </p>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{courses.length} Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Expert Instructors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Certifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Lifetime Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {freeCourses.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Complimentary Business Resources
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  FREE
                </span>
              </div>
              <p className="text-gray-600 mb-8">
                Free introductory resources to help grow your business
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {freeCourses.map(({ course }) => (
                  <div
                    key={course.slug}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-green-200"
                  >
                    <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-400 relative">
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
                        {course.subtitle}
                      </p>

                      <Button
                        onClick={() => navigate(`/academy/${course.slug}`)}
                        variant="outline"
                        className="w-full border-green-500 text-green-700 hover:bg-green-50"
                      >
                        Start Learning
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tieredCourses.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Professional Certification Programs
              </h2>
              <p className="text-gray-600 mb-8">
                Choose your tier: Starter, Certified, or Pro
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {tieredCourses.map(({ course, products, minPrice }) => (
                  <div
                    key={course.slug}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-green-500">
                      <img
                        src={course.thumbnail_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>

                      <p className="text-gray-600 mb-4">{course.subtitle}</p>

                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm text-gray-500">Starting at</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${minPrice / 100}
                        </span>
                      </div>

                      {products.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {products.map(product => (
                            <div
                              key={product.slug}
                              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                            >
                              {product.title.split('—')[1]?.trim() || product.title}
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        onClick={() => navigate(`/academy/${course.slug}`)}
                        className="w-full"
                      >
                        View Course
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {singleCourses.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Specialized Training Courses
              </h2>
              <p className="text-gray-600 mb-8">
                Focused training on specific skills and topics
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {singleCourses.map(({ course, products, minPrice }) => (
                  <div
                    key={course.slug}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-400 to-green-400">
                      <img
                        src={course.thumbnail_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.subtitle}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-blue-600">
                          ${minPrice / 100}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm text-gray-600">Course</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate(`/academy/${course.slug}`)}
                        variant="outline"
                        className="w-full"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
            <Zap className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Become a Local-Link Partner
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Earn 20% commissions by referring businesses to Local-Link courses and services
            </p>
            <Button
              onClick={() => navigate('/partner/apply')}
              variant="outline"
              className="bg-white text-blue-600 hover:bg-gray-50"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
