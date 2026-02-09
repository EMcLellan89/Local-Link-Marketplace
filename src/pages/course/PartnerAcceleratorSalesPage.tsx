import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CheckCircle, BookOpen, Award, Users, TrendingUp, Lock } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';

export default function PartnerAcceleratorSalesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isPartner, setIsPartner] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, []);

  async function loadCourseData() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', 'partner-accelerator')
      .single();

    const { data: modulesData } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseData?.id)
      .order('module_index');

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, partner:partners!inner(*)')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);
      setIsPartner(!!profile?.partner);

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseData?.id)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsEnrolled(!!enrollment);
    }

    setCourse(courseData);
    setModules(modulesData || []);
    setLoading(false);
  }

  async function handleEnroll() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate('/login?redirect=/academy/courses/partner-accelerator');
      return;
    }

    if (isPartner) {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          course_id: course.id,
          user_id: user.id
        });

      if (!error) {
        navigate(`/academy/courses/partner-accelerator/learn`);
      }
    } else {
      const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
      const checkoutUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/course-checkout`;

      const response = await fetch(checkoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          course_slug: 'partner-accelerator',
          success_url: `${window.location.origin}/academy/courses/partner-accelerator/learn`,
          cancel_url: window.location.href
        })
      });

      const { checkout_url } = await response.json();
      window.location.href = checkout_url;
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h1>
          <Link to="/academy" className="text-blue-600 hover:underline">
            Return to Academy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-2">{course.subtitle}</p>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">{course.description}</p>

            <div className="mt-8 flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm opacity-90">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">26</div>
                <div className="text-sm opacity-90">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">30</div>
                <div className="text-sm opacity-90">Exam Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">~2h</div>
                <div className="text-sm opacity-90">Total Duration</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Master Non-Pushy Selling</h3>
                    <p className="text-gray-600">Learn to educate without pressure and close deals through clarity, not manipulation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Build Recurring Income</h3>
                    <p className="text-gray-600">Create a portfolio of 20-50 clients generating $2,000-$10,000+ per month in commissions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Handle Objections Confidently</h3>
                    <p className="text-gray-600">Turn "I need to think" and "too expensive" into opportunities for clarity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Scale Beyond 1-to-1</h3>
                    <p className="text-gray-600">Use referrals, niches, and partnerships to multiply your income.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Earn Certification</h3>
                    <p className="text-gray-600">Become a Certified Local-Link Partner™ and unlock higher commissions.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>

              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{module.title}</h3>
                        <p className="text-gray-600 text-sm">{module.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                {isPartner ? (
                  <>
                    <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
                      Free for Approved Partners
                    </div>
                    <div className="text-4xl font-bold text-gray-900 line-through opacity-50">$197</div>
                    <div className="text-5xl font-bold text-green-600 mt-2">FREE</div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-gray-900">$197</div>
                    <div className="text-gray-600 mt-1">One-time payment</div>
                  </>
                )}
              </div>

              {isEnrolled ? (
                <Link
                  to="/academy/courses/partner-accelerator/learn"
                  className="block w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition mb-4"
                >
                  Continue Learning
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition mb-4"
                >
                  {isPartner ? 'Enroll for Free' : 'Enroll Now'}
                </button>
              )}

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>26 comprehensive lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Certification upon completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Partner community access</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Lifetime access to materials</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span>Secure payment processing</span>
                </div>
              </div>

              {!isPartner && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold mb-2">Want it for free?</p>
                    <p>Apply to become an approved partner and get instant access at no cost.</p>
                    <Link
                      to="/partners/apply"
                      className="text-blue-600 hover:underline font-semibold mt-2 inline-block"
                    >
                      Apply Now →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
