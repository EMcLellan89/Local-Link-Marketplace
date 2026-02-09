import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, Play, Award, Users, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

interface Module {
  id: string;
  module_index: number;
  title: string;
  description: string;
}

interface Product {
  slug: string;
  title: string;
  price_cents: number;
}

export default function CourseSalesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [affiliateCode, setAffiliateCode] = useState<string>('');

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setAffiliateCode(refCode);
      localStorage.setItem('ll_course_ref', refCode);
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `ll_course_ref=${refCode}; expires=${expires.toUTCString()}; path=/`;
    } else {
      const stored = localStorage.getItem('ll_course_ref');
      if (stored) setAffiliateCode(stored);
    }
  }, [searchParams]);

  useEffect(() => {
    loadCourse();
  }, []);

  async function loadCourse() {
    if (DEV_MODE) {
      setCourse({
        id: 'dev-course-id',
        title: 'Online Sales Without Ads™',
        subtitle: 'Sell using DMs, lead lists, and simple systems — no ads needed.',
        description: 'Master the art of selling without spending a fortune on advertising. Learn how to build targeted lead lists, create effective DM strategies, and build simple systems that drive consistent sales.',
      });

      setModules([
        {
          id: 'module-1',
          module_index: 1,
          title: 'Module 1: Foundation',
          description: 'Build the foundation for your sales success without ads',
        },
        {
          id: 'module-2',
          module_index: 2,
          title: 'Module 2: Lead Generation',
          description: 'Master the art of finding and qualifying leads',
        },
        {
          id: 'module-3',
          module_index: 3,
          title: 'Module 3: Outreach Systems',
          description: 'Create repeatable outreach systems that convert',
        },
        {
          id: 'module-4',
          module_index: 4,
          title: 'Module 4: Scaling',
          description: 'Scale your sales process predictably',
        },
      ]);

      setProduct({
        slug: 'online-sales-without-ads',
        title: 'Online Sales Without Ads™',
        price_cents: 19700,
      });

      setLoading(false);
      return;
    }

    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', 'online-sales-without-ads')
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: modulesData } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseData.id)
        .order('module_index');

      setModules(modulesData || []);

      const { data: productData } = await supabase
        .from('products_catalog')
        .select('*')
        .eq('slug', 'online-sales-without-ads')
        .single();

      setProduct(productData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll() {
    if (!user) {
      navigate('/login?redirect=/marketplace/products/online-sales-without-ads');
      return;
    }

    setEnrolling(true);
    setError(null);

    if (DEV_MODE) {
      console.log('DEV MODE: Bypassing payment, redirecting to course dashboard');
      setTimeout(() => {
        navigate('/learn/online-sales-without-ads?success=1');
      }, 1000);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/course-checkout-dual`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productSlug: 'online-sales-without-ads',
            affiliateCode,
            preferredProvider: 'stripe',
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.url) {
        if (result.fallbackUsed) {
          console.log('Using fallback payment provider:', result.provider);
        }
        window.location.href = result.url;
      }
    } catch (err: any) {
      setError(err.message);
      setEnrolling(false);
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

  if (!course || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Course not found</p>
          {error && (
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Error: {error}
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const price = product.price_cents / 100;

  return (
    <>
      <SEO
        title={course.title}
        description={course.subtitle}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4" />
              Certificate Upon Completion
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {course.subtitle}
            </p>

            {DEV_MODE && (
              <div className="max-w-2xl mx-auto mb-6 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
                <strong>DEV MODE:</strong> Payment is bypassed. Click enroll to access the course instantly.
              </div>
            )}

            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>4 Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                <span>Video Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Lifetime Access</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-8 py-4 text-lg"
              >
                {enrolling ? 'Processing...' : `Enroll Now - $${price}`}
              </Button>
              {affiliateCode && (
                <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                  Referred by: {affiliateCode}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg max-w-md mx-auto">
                {error}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What You'll Learn
              </h2>

              <p className="text-gray-600 mb-8">
                {course.description}
              </p>

              <div className="space-y-4">
                {[
                  'Build targeted lead lists without expensive tools',
                  'Master DM sales strategies that convert',
                  'Create simple, repeatable sales systems',
                  'Close deals without paid advertising',
                  'Scale your sales predictably',
                  'Reduce dependency on ad platforms',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Course Investment</h3>
                <div className="mb-6">
                  <div className="text-5xl font-bold mb-2">${price}</div>
                  <div className="text-blue-200">One-time payment</div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Lifetime access to all content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Downloadable templates & resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Future updates included</span>
                  </div>
                </div>
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  variant="outline"
                  className="w-full bg-white text-blue-600 hover:bg-gray-50"
                >
                  {enrolling ? 'Processing...' : 'Get Started Now'}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">100+</div>
                  <div className="text-sm text-gray-600">Success Stories</div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 text-center">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">30</div>
                  <div className="text-sm text-gray-600">Day Guarantee</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Course Curriculum
            </h2>

            <div className="space-y-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                      {module.module_index}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <p className="text-gray-600">{module.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Master Sales Without Ads?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of entrepreneurs who have transformed their sales approach
            </p>
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-white text-blue-700 font-bold hover:bg-blue-50 px-8 py-4 text-lg rounded-lg shadow-lg disabled:opacity-50 transition-colors"
            >
              {enrolling ? 'Processing...' : `Enroll Now - $${price}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}