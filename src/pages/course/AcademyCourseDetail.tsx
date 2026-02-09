import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Check, Award, Star, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail_url: string;
  is_free?: boolean;
  target_audience?: string;
  audience?: string;
}

interface Product {
  slug: string;
  title: string;
  description: string;
  price_cents: number;
  metadata: any;
}

interface Module {
  id: string;
  display_order: number;
  title: string;
  description: string;
  lesson_count?: number;
}

export default function AcademyCourseDetail() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isFreeForUser, setIsFreeForUser] = useState(false);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem(`ll_course_ref_${courseSlug}`, refCode);
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `ll_course_ref=${refCode}; expires=${expires.toUTCString()}; path=/`;
    }
  }, [searchParams, courseSlug]);

  useEffect(() => {
    loadCourseDetails();
  }, [courseSlug]);

  async function loadCourseDetails() {
    if (DEV_MODE) {
      loadDevModeData();
      return;
    }

    try {
      const { data: courseData } = await supabase
        .from('academy_courses')
        .select('*')
        .eq('slug', courseSlug)
        .single();

      // Check user role BEFORE doing anything else
      let isPartner = false;
      let isMerchant = false;
      if (user) {
        const [partnerCheck, merchantCheck] = await Promise.all([
          supabase.from('partners').select('id').eq('user_id', user.id).maybeSingle(),
          supabase.from('merchants').select('id').eq('user_id', user.id).maybeSingle()
        ]);

        isPartner = !!partnerCheck.data;
        isMerchant = !!merchantCheck.data;
      }

      // BLOCK: Partners can ONLY access partner courses
      if (isPartner && courseData?.target_audience !== 'partner') {
        console.log('Partner blocked from non-partner course');
        navigate('/academy');
        return;
      }

      // BLOCK: Merchants can ONLY access merchant courses
      if (isMerchant && courseData?.target_audience !== 'merchant') {
        console.log('Merchant blocked from non-merchant course');
        navigate('/academy');
        return;
      }

      setCourse(courseData);

      // CRITICAL: Partner target_audience courses are ALWAYS free, no exceptions
      const isPartnerCourse = courseData?.target_audience === 'partner';
      const freeForUser = courseData?.is_free || isPartnerCourse;
      setIsFreeForUser(freeForUser);

      // NEVER load products for partner courses, even if they exist
      if (!freeForUser && !isPartnerCourse) {
        const { data: productsData } = await supabase
          .from('products_catalog')
          .select('*')
          .eq('is_active', true);

        const courseProducts = productsData?.filter(p =>
          p.metadata?.course_slug === courseSlug
        ) || [];

        courseProducts.sort((a, b) => a.price_cents - b.price_cents);
        setProducts(courseProducts);

        if (courseProducts.length > 0) {
          setSelectedProduct(courseProducts[0].slug);
        }
      } else {
        // Free course - no products needed
        setProducts([]);
      }

      const { data: modulesData } = await supabase
        .from('academy_modules')
        .select('*, academy_lessons(count)')
        .eq('course_id', courseData.id)
        .order('display_order');

      const formattedModules = modulesData?.map(m => ({
        ...m,
        lesson_count: m.academy_lessons?.[0]?.count || 0
      })) || [];

      setModules(formattedModules);
    } catch (err) {
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  }

  function loadDevModeData() {
    // In dev mode, partners get free access to partner courses
    const devRole = localStorage.getItem('ll_dev_role') || 'customer';
    const isDevPartner = devRole === 'partner';
    const isDevMerchant = devRole === 'merchant';

    const courseData: Record<string, { course: Course, products: Product[], modules: Module[] }> = {
      'local-customers-on-autopilot': {
        course: {
          id: 'course-1',
          slug: 'local-customers-on-autopilot',
          title: 'Local Customers on Autopilot™',
          subtitle: 'Get customers without ads using Local-Link',
          description: 'Master the Local-Link platform and generate predictable revenue',
          thumbnail_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'lca-starter', title: 'Starter', description: 'Course only', price_cents: 9700, metadata: {} },
          { slug: 'lca-certified', title: 'Certified', description: 'Course + exam + badge', price_cents: 19700, metadata: {} },
          { slug: 'lca-pro', title: 'Pro', description: 'Certified + featured listing', price_cents: 29700, metadata: {} }
        ],
        modules: [
          { id: '1', module_index: 1, title: 'How Local Customers Buy Today (2026)', description: 'Understand modern local buyer behavior and where Local-Link wins.', lesson_count: 6 },
          { id: '2', module_index: 2, title: 'Listing That Converts (Local-Link Listing Mastery)', description: 'Build a listing that turns views into calls/messages.', lesson_count: 6 },
          { id: '3', module_index: 3, title: 'Offers That Bring Buyers Without Killing Margin', description: 'Offer ladder + scarcity without discounting yourself into loss.', lesson_count: 6 },
          { id: '4', module_index: 4, title: 'Reviews Engine + Reputation Protection', description: 'Automate reviews and protect against reputation damage.', lesson_count: 5 },
          { id: '5', module_index: 5, title: 'Loyalty + Repeat Business Systems', description: 'Turn first-time customers into repeat buyers.', lesson_count: 6 },
          { id: '6', module_index: 6, title: 'CRM Tracking + Follow-Up Automation', description: 'Install a simple pipeline that prints revenue.', lesson_count: 5 }
        ]
      },
      'ugc-from-home': {
        course: {
          id: 'course-2',
          slug: 'ugc-from-home',
          title: 'UGC From Home™',
          subtitle: 'Stay-at-home income creating content (no followers needed)',
          description: 'Build a portfolio, master outreach, and price your services',
          image_url: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'ugc-starter', title: 'Starter', description: 'Course only', price_cents: 9700, metadata: {} },
          { slug: 'ugc-certified', title: 'Certified', description: 'Course + exam + badge', price_cents: 19700, metadata: {} },
          { slug: 'ugc-pro', title: 'Pro', description: 'Certified + featured listing', price_cents: 29700, metadata: {} }
        ],
        modules: [
          { id: '3', module_index: 1, title: 'UGC Foundations (No Followers Needed)', description: 'What brands actually pay for and how to position yourself.', lesson_count: 5 },
          { id: '4', module_index: 2, title: 'High-Converting UGC Structure + Hooks', description: 'Make videos brands can run as ads (even if you\'re shy).', lesson_count: 6 },
          { id: '5', module_index: 3, title: 'Portfolio + Offer That Sells', description: 'Build a portfolio before you get clients and sell packages.', lesson_count: 6 },
          { id: '6', module_index: 4, title: 'Outreach Pipeline (Daily Routine That Works)', description: 'Find brands and get replies consistently.', lesson_count: 5 },
          { id: '7', module_index: 5, title: 'Pricing + Negotiation (Without Feeling Weird)', description: 'Charge confidently and handle objections cleanly.', lesson_count: 5 },
          { id: '8', module_index: 6, title: 'Retainers + Monthly Income', description: 'Turn one-off projects into predictable monthly revenue.', lesson_count: 5 }
        ]
      },
      'ai-receptionist-missed-calls': {
        course: {
          id: 'course-3',
          slug: 'ai-receptionist-missed-calls',
          title: 'AI Receptionist & Missed Call Recovery™',
          subtitle: 'Automate appointment booking and customer service',
          description: 'Set up AI phone answering to capture every lead 24/7',
          image_url: 'https://images.pexels.com/photos/4050302/pexels-photo-4050302.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'air-single', title: 'Single Course', description: 'Complete course access', price_cents: 9700, metadata: {} }
        ],
        modules: [
          { id: '5', module_index: 1, title: 'Missed Call Math', description: 'Know exactly what missed calls cost you.', lesson_count: 4 },
          { id: '6', module_index: 2, title: 'Receptionist Setup', description: 'Configure tone, rules, and boundaries.', lesson_count: 5 },
          { id: '7', module_index: 3, title: 'Booking Workflow', description: 'Turn calls into appointments automatically.', lesson_count: 5 },
          { id: '8', module_index: 4, title: 'Follow-Up Automation', description: 'Recover jobs you would have lost.', lesson_count: 5 },
          { id: '9', module_index: 5, title: 'CRM Handoff + Reporting', description: 'Track and improve performance.', lesson_count: 3 }
        ]
      },
      'reviews-that-convert': {
        course: {
          id: 'course-4',
          slug: 'reviews-that-convert',
          title: 'Reviews That Bring Customers In™',
          subtitle: 'Turn 5-star reviews into paying customers',
          description: 'Systematic review generation and showcasing strategies',
          image_url: 'https://images.pexels.com/photos/5475754/pexels-photo-5475754.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'rtc-single', title: 'Single Course', description: 'Complete course access', price_cents: 4900, metadata: {} }
        ],
        modules: [
          { id: '10', module_index: 1, title: 'Review Psychology', description: 'Why reviews drive calls more than ads.', lesson_count: 4 },
          { id: '11', module_index: 2, title: 'Asking Scripts', description: 'Get reviews without awkwardness.', lesson_count: 6 },
          { id: '12', module_index: 3, title: 'Automation System', description: 'Make reviews consistent.', lesson_count: 5 },
          { id: '13', module_index: 4, title: 'Responding Like a Pro', description: 'Protect reputation with responses.', lesson_count: 5 },
          { id: '14', module_index: 5, title: 'Turn Reviews Into Content', description: 'Use reviews to market everywhere.', lesson_count: 3 }
        ]
      },
      'partner-accelerator': {
        course: {
          id: 'course-5',
          slug: 'partner-accelerator',
          title: 'Local-Link Partner Accelerator™',
          subtitle: 'Build a 6-figure Local-Link partnership',
          description: 'Territory management, sales systems, and scaling strategies',
          image_url: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg',
          target_audience: 'partner',
          is_free: true
        },
        products: [
          { slug: 'pap-single', title: 'Single Course', description: 'Complete course access', price_cents: 19700, metadata: {} }
        ],
        modules: [
          { id: '15', module_index: 1, title: 'Ecosystem Overview + What to Sell', description: 'Know what to recommend and why.', lesson_count: 5 },
          { id: '16', module_index: 2, title: 'Prospecting + Lead Sources', description: 'Find business owners daily.', lesson_count: 6 },
          { id: '17', module_index: 3, title: 'Sales Calls (Non-Pushy)', description: 'Convert without pressure.', lesson_count: 5 },
          { id: '18', module_index: 4, title: 'Bundling + Pricing Strategy', description: 'Increase deal size and retention.', lesson_count: 5 },
          { id: '19', module_index: 5, title: 'Partner Ops + Scaling Income', description: 'Run partner income like a business.', lesson_count: 5 }
        ]
      },
      'selling-recurring-revenue': {
        course: {
          id: 'course-6',
          slug: 'selling-recurring-revenue',
          title: 'Selling Recurring Revenue™',
          subtitle: 'Land monthly retainers from local businesses',
          description: 'Positioning, pricing, and closing predictable income',
          image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
          target_audience: 'partner',
          is_free: true
        },
        products: [
          { slug: 'srr-single', title: 'Single Course', description: 'Complete course access', price_cents: 29700, metadata: {} }
        ],
        modules: [
          { id: '20', module_index: 1, title: 'Recurring Revenue Foundations', description: 'Why subscriptions win and how to package them.', lesson_count: 5 },
          { id: '21', module_index: 2, title: 'Discovery Calls That Convert', description: 'Get to the real pain and budget.', lesson_count: 5 },
          { id: '22', module_index: 3, title: 'Objections + Negotiation', description: 'Handle pushback like a pro.', lesson_count: 6 },
          { id: '23', module_index: 4, title: 'Retention + Renewals', description: 'Keep clients long-term.', lesson_count: 5 },
          { id: '24', module_index: 5, title: 'Systems + Forecasting', description: 'Predict revenue and hit targets.', lesson_count: 5 }
        ]
      },
      'marketing-for-trades': {
        course: {
          id: 'course-7',
          slug: 'marketing-for-trades',
          title: 'Marketing for Trades (No Ads Required)™',
          subtitle: 'Plumbing, HVAC, electrical, roofing & more',
          description: 'Industry-specific marketing that actually works for trades',
          image_url: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'mft-single', title: 'Single Course', description: 'Complete course access', price_cents: 19700, metadata: {} }
        ],
        modules: [
          { id: '25', module_index: 1, title: 'Trade Buyer Behavior', description: 'Know what makes homeowners call now.', lesson_count: 5 },
          { id: '26', module_index: 2, title: 'Google Maps Optimization', description: 'Win local search without ads.', lesson_count: 5 },
          { id: '27', module_index: 3, title: 'Local-Link Listing + Offers', description: 'Turn Local-Link into a job pipeline.', lesson_count: 5 },
          { id: '28', module_index: 4, title: 'Follow-Up Systems That Win Jobs', description: 'Close more estimates.', lesson_count: 5 },
          { id: '29', module_index: 5, title: 'Referral Flywheel', description: 'Turn jobs into neighbors and repeats.', lesson_count: 5 }
        ]
      },
      'pet-businesses-first': {
        course: {
          id: 'course-8',
          slug: 'pet-businesses-first',
          title: 'Pet Businesses That Get Found First™',
          subtitle: 'Marketing for groomers, vets, trainers & pet stores',
          description: 'Attract pet owners and build loyalty in your community',
          image_url: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'pbf-single', title: 'Single Course', description: 'Complete course access', price_cents: 19700, metadata: {} }
        ],
        modules: [
          { id: '30', module_index: 1, title: 'Pet Owner Search Behavior', description: 'How pet parents choose who to trust.', lesson_count: 5 },
          { id: '31', module_index: 2, title: 'PawConnect Integration (Use, Not Build)', description: 'Become PawConnect-ready and visible.', lesson_count: 5 },
          { id: '32', module_index: 3, title: 'Emergency Alerts + Community Trust', description: 'Use urgency ethically to build loyalty.', lesson_count: 5 },
          { id: '33', module_index: 4, title: 'Reviews + Reputation in Pet Services', description: 'Handle emotional reviews and keep 5-star status.', lesson_count: 5 },
          { id: '34', module_index: 5, title: 'Repeat Booking + Loyalty', description: 'Increase frequency without discounting.', lesson_count: 5 }
        ]
      },
      'care-coordination-for-families': {
        course: {
          id: 'course-9',
          slug: 'care-coordination-for-families',
          title: 'Care Coordination for Families™',
          subtitle: 'Home health, senior care & family services marketing',
          description: 'Build trust and reach families who need your care services',
          image_url: 'https://images.pexels.com/photos/7551662/pexels-photo-7551662.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'ccf-single', title: 'Single Course', description: 'Complete course access', price_cents: 9700, metadata: {} }
        ],
        modules: [
          { id: '35', module_index: 1, title: 'The Care Chaos Problem', description: 'What breaks families and how to fix it.', lesson_count: 5 },
          { id: '36', module_index: 2, title: 'Setting Up the System', description: 'Roles, permissions, and routines.', lesson_count: 5 },
          { id: '37', module_index: 3, title: 'Safety + Emergency Planning', description: 'Be ready without panic.', lesson_count: 4 },
          { id: '38', module_index: 4, title: 'Communication + Providers', description: 'Keep everyone aligned.', lesson_count: 5 },
          { id: '39', module_index: 5, title: 'Routines That Reduce Stress', description: 'Make it sustainable.', lesson_count: 4 }
        ]
      },
      'local-service-side-hustle': {
        course: {
          id: 'course-10',
          slug: 'local-service-side-hustle',
          title: 'Start a Local Service Side Hustle™',
          subtitle: 'Start a service business with little to no startup cost',
          description: 'Lawn care, cleaning, handyman, pressure washing & more',
          image_url: 'https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'lssh-single', title: 'Single Course', description: 'Complete course access', price_cents: 9700, metadata: {} }
        ],
        modules: [
          { id: '40', module_index: 1, title: 'Pick the Right Hustle', description: 'Choose based on speed-to-cash.', lesson_count: 5 },
          { id: '41', module_index: 2, title: 'Setup Basics', description: 'Start clean and professional.', lesson_count: 5 },
          { id: '42', module_index: 3, title: 'Get Customers Without Ads', description: 'Local outreach that works.', lesson_count: 6 },
          { id: '43', module_index: 4, title: 'Customer Experience', description: 'Get repeat buyers fast.', lesson_count: 5 },
          { id: '44', module_index: 5, title: 'Scale Safely', description: 'Grow without chaos.', lesson_count: 5 }
        ]
      },
      'online-sales-without-ads': {
        course: {
          id: 'course-11',
          slug: 'online-sales-without-ads',
          title: 'Online Sales Without Ads™',
          subtitle: 'Systematic outreach, relationships & closing',
          description: 'Build a sales pipeline without spending on advertising',
          image_url: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg',
          target_audience: 'merchant'
        },
        products: [
          { slug: 'oswa-single', title: 'Single Course', description: 'Complete course access', price_cents: 9700, metadata: {} }
        ],
        modules: [
          { id: '45', module_index: 1, title: 'Offer Design That Sells', description: 'Build an irresistible offer without ads.', lesson_count: 5 },
          { id: '46', module_index: 2, title: 'Organic Content That Converts', description: 'Post with intention and get DMs.', lesson_count: 5 },
          { id: '47', module_index: 3, title: 'DM Closing System', description: 'Close without being salesy.', lesson_count: 6 },
          { id: '48', module_index: 4, title: 'Simple Funnel Setup', description: 'Minimal tech, maximum results.', lesson_count: 5 },
          { id: '49', module_index: 5, title: 'Delivery + Retention', description: 'Create happy buyers who refer.', lesson_count: 6 }
        ]
      }
    };

    const data = courseData[courseSlug!] || courseData['local-customers-on-autopilot'];

    // DEV MODE: Block role mismatches
    if (isDevPartner && data.course.target_audience !== 'partner') {
      console.log('DEV MODE: Partner blocked from non-partner course, redirecting to academy');
      navigate('/academy');
      setLoading(false);
      return;
    }

    if (isDevMerchant && data.course.target_audience !== 'merchant') {
      console.log('DEV MODE: Merchant blocked from non-merchant course, redirecting to academy');
      navigate('/academy');
      setLoading(false);
      return;
    }

    setCourse(data.course);

    // Set isFreeForUser based on dev role and course target audience
    const freeForUser = data.course.is_free || (isDevPartner && data.course.target_audience === 'partner');
    setIsFreeForUser(freeForUser);

    // Only show products if not free for user
    if (!freeForUser) {
      setProducts(data.products);
      setSelectedProduct(data.products[0]?.slug || null);
    } else {
      setProducts([]);
      setSelectedProduct(null);
    }

    setModules(data.modules);
    setLoading(false);
  }

  async function handleEnroll() {
    if (!user) {
      navigate(`/login?redirect=/academy/${courseSlug}`);
      return;
    }

    setEnrolling(true);

    if (DEV_MODE) {
      console.log('DEV MODE: Bypassing payment, redirecting to course');
      setTimeout(() => {
        navigate(`/learn/${courseSlug}?success=1`);
      }, 1000);
      return;
    }

    try {
      // Check if user is a partner and this is a partner course
      const { data: partnerData } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const isPartner = !!partnerData;
      const isFreeForUser = course?.is_free || (isPartner && course?.target_audience === 'partner');

      // If free for this user, create enrollment and redirect to course
      if (isFreeForUser) {
        // Check if already enrolled
        const { data: existingEnrollment } = await supabase
          .from('academy_enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', course.id)
          .maybeSingle();

        // Create enrollment if doesn't exist
        if (!existingEnrollment) {
          await supabase
            .from('academy_enrollments')
            .insert({
              user_id: user.id,
              course_id: course.id
            });
        }

        // Redirect to course dashboard
        navigate(`/learn/${courseSlug}?success=1`);
        return;
      }

      // For paid courses, require product selection and proceed to checkout
      if (!selectedProduct) {
        alert('Please select a course tier');
        setEnrolling(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const affiliateCode = localStorage.getItem(`ll_course_ref_${courseSlug}`) || '';

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/course-checkout-dual`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productSlug: selectedProduct,
            affiliateCode,
            preferredProvider: 'stripe',
          }),
        }
      );

      const result = await response.json();

      if (result.url) {
        window.location.href = result.url;
      } else if (result.error) {
        alert(result.error);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Failed to start enrollment');
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Course not found</p>
          <Button onClick={() => navigate('/academy')}>Back to Academy</Button>
        </div>
      </div>
    );
  }

  const selectedProductData = products.find(p => p.slug === selectedProduct);

  return (
    <>
      <SEO title={course.title} description={course.subtitle} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate('/academy')}
              className="text-blue-100 hover:text-white mb-4"
            >
              ← Back to Academy
            </button>

            <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
            <p className="text-xl text-blue-100 mb-6">{course.subtitle}</p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>Certificate Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{modules.length} Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-gray-700 text-lg">{course.description}</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                          {module.display_order}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                          {module.lesson_count !== undefined && module.lesson_count > 0 && (
                            <p className="text-xs text-blue-600 font-medium">
                              {module.lesson_count} {module.lesson_count === 1 ? 'Lesson' : 'Lessons'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white rounded-xl shadow-xl p-6">
                  {isFreeForUser ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-lg mb-4">
                          FREE COURSE
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {course.target_audience === 'partner' ? 'Included with Partnership' : 'Free Access'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {course.target_audience === 'partner'
                            ? 'This course is included free with your partner subscription at no additional cost'
                            : 'This course is available to you at no cost'}
                        </p>
                      </div>

                      <Button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full mb-4 bg-green-600 hover:bg-green-700"
                      >
                        {enrolling ? 'Processing...' : 'Start Learning'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-4">Choose Your Tier</h3>

                      <div className="space-y-3 mb-6">
                        {products.map((product) => (
                          <label
                            key={product.slug}
                            className={`block border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedProduct === product.slug
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="tier"
                              value={product.slug}
                              checked={selectedProduct === product.slug}
                              onChange={(e) => setSelectedProduct(e.target.value)}
                              className="sr-only"
                            />

                            <div className="flex items-start justify-between mb-2">
                              <div className="font-semibold text-gray-900">
                                {product.title.split('—')[1]?.trim() || product.title}
                              </div>
                              <div className="text-xl font-bold text-blue-600">
                                ${product.price_cents / 100}
                              </div>
                            </div>

                            <p className="text-sm text-gray-600">{product.description}</p>
                          </label>
                        ))}
                      </div>

                      <Button
                        onClick={handleEnroll}
                        disabled={enrolling || !selectedProduct}
                        className="w-full mb-4"
                      >
                        {enrolling ? 'Processing...' : `Enroll Now - $${selectedProductData?.price_cents ? selectedProductData.price_cents / 100 : 0}`}
                      </Button>
                    </>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Lifetime access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>All {modules.length} modules</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Video lessons</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Downloadable resources</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
