import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, CheckCircle, ArrowRight, Play, DollarSign, Calculator, FileText, TrendingUp, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  thumbnail_url: string | null;
  est_minutes: number | null;
  difficulty_level: string | null;
  is_free: boolean;
}

interface BookkeepingService {
  id: string;
  name: string;
  description: string;
  price: string;
  recurring?: boolean;
  interval?: string;
  features: string[];
  icon: any;
}

interface Enrollment {
  course_id: string;
  status: string;
}

export default function AcademyMarketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'bookkeeping'>('courses');

  // Bookkeeping Services catalog
  const bookkeepingServices: BookkeepingService[] = [
    {
      id: 'fin-engine-starter',
      name: 'Financial Engine™ - Starter',
      description: 'AI-powered bookkeeping, monthly P&L, receipt automation, and tax-ready reporting',
      price: '$149',
      recurring: true,
      interval: 'month',
      features: [
        'Monthly P&L + expense reports',
        'Receipt capture + categorization',
        'Tax-Ready Score™ (0–100)',
        'Basic financial insights'
      ],
      icon: Calculator
    },
    {
      id: 'fin-engine-growth',
      name: 'Financial Engine™ - Growth',
      description: 'Advanced bookkeeping with comprehensive tax tracking and financial analytics',
      price: '$299',
      recurring: true,
      interval: 'month',
      features: [
        'Everything in Starter',
        'Advanced tax tracking',
        'Multi-entity support',
        'Client Tax Pack generator',
        'Priority support'
      ],
      icon: TrendingUp
    },
    {
      id: 'fin-engine-pro',
      name: 'Financial Engine™ - Pro',
      description: 'Full-service bookkeeping with dedicated support and custom reporting',
      price: '$499',
      recurring: true,
      interval: 'month',
      features: [
        'Everything in Growth',
        'Dedicated bookkeeper',
        'Custom financial reports',
        'Quarterly reviews',
        'CFO insights'
      ],
      icon: Building
    },
    {
      id: 'cleanup-light',
      name: 'DFY Bookkeeping Cleanup™ - Light',
      description: 'One-time historical cleanup of books with categorized transactions',
      price: '$499',
      recurring: false,
      features: [
        'Up to 3 months historical',
        'Transaction categorization',
        'Basic reconciliations',
        'Tax-ready export'
      ],
      icon: FileText
    },
    {
      id: 'cleanup-standard',
      name: 'DFY Bookkeeping Cleanup™ - Standard',
      description: 'Comprehensive cleanup with reconciliations and tax-ready reports',
      price: '$1,200',
      recurring: false,
      features: [
        'Up to 12 months historical',
        'Full transaction cleanup',
        'Bank reconciliations',
        'Receipt recovery',
        'Tax-ready reports'
      ],
      icon: FileText
    },
    {
      id: 'cleanup-heavy',
      name: 'DFY Bookkeeping Cleanup™ - Heavy',
      description: 'Complete multi-year cleanup with comprehensive documentation',
      price: '$2,500+',
      recurring: false,
      features: [
        '12+ months historical',
        'Multi-year cleanup',
        'Complex reconciliations',
        'Comprehensive documentation',
        'Tax preparation support'
      ],
      icon: FileText
    },
    {
      id: 'compliance-shield-basic',
      name: 'Compliance Shield™ - Basic',
      description: 'Automated compliance workflows and audit trails',
      price: '$129',
      recurring: true,
      interval: 'month',
      features: [
        'Audit logs & change tracking',
        'Basic compliance monitoring',
        'Document storage'
      ],
      icon: Calculator
    },
    {
      id: 'compliance-shield-growth',
      name: 'Compliance Shield™ - Growth',
      description: 'Advanced compliance with risk monitoring and policy workflows',
      price: '$349',
      recurring: true,
      interval: 'month',
      features: [
        'Everything in Basic',
        'Policy workflows',
        'Risk detection bots',
        'Compliance reports'
      ],
      icon: TrendingUp
    },
    {
      id: 'compliance-shield-elite',
      name: 'Compliance Shield™ - Elite',
      description: 'Enterprise compliance with certification and defensibility tools',
      price: '$699',
      recurring: true,
      interval: 'month',
      features: [
        'Everything in Growth',
        'Compliance certification badges',
        'Advanced audit tools',
        'Legal defensibility',
        'Priority support'
      ],
      icon: Building
    },
    {
      id: 'compliance-setup',
      name: 'Compliance Setup & Audit Pack™',
      description: 'DFY compliance framework setup and documentation',
      price: '$1,497',
      recurring: false,
      features: [
        'Compliance framework buildout',
        'Document vault setup',
        'Audit trail initialization',
        'Risk baseline assessment'
      ],
      icon: FileText
    }
  ];

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);

    // Load all merchant courses
    const { data: coursesData } = await supabase
      .from('academy_courses')
      .select('*')
      .or('target_audience.eq.merchant,audience.eq.merchant')
      .eq('is_published', true)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('title');

    if (coursesData) {
      setCourses(coursesData);
    }

    // Load user enrollments
    if (user) {
      const { data: enrollData } = await supabase
        .from('academy_enrollments')
        .select('course_id, status')
        .eq('user_id', user.id);

      if (enrollData) setEnrollments(enrollData);
    }

    setLoading(false);
  }

  function isEnrolled(courseId: string): boolean {
    return enrollments.some(e => e.course_id === courseId && e.status === 'active');
  }

  async function handleCoursePurchase(course: Course) {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Use the course checkout endpoint
      const { data, error } = await supabase.functions.invoke('course-checkout', {
        body: {
          course_id: course.id,
          user_id: user.id
        }
      });

      if (error) throw error;

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  }

  async function handleServicePurchase(service: BookkeepingService) {
    if (!user) {
      navigate('/login');
      return;
    }

    // Navigate to checkout or contact page
    alert(`Purchase ${service.name} - Checkout integration coming soon!`);
  }

  function getCoursePrice(course: Course): string {
    if (course.is_free) return 'Free';

    // Default pricing based on course type
    if (course.slug.includes('automation') || course.slug.includes('ai')) return '$297';
    if (course.slug.includes('facebook') || course.slug.includes('blog')) return '$197';
    if (course.slug.includes('certified-business-coach')) return '$497';
    return '$97';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading academy...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Local-Link Merchant Academy</h1>
          </div>
          <p className="text-xl text-blue-100">
            Build Revenue. Scale Your Business. Expert training for local businesses.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'courses'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Training Courses ({courses.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bookkeeping')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'bookkeeping'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Bookkeeping Services
            </div>
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                All Merchant Training Courses
              </h2>
              <p className="text-gray-600 mt-2">
                {courses.length} courses available to help you grow your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={isEnrolled(course.id)}
                  price={getCoursePrice(course)}
                  onPurchase={handleCoursePurchase}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bookkeeping Services Tab */}
        {activeTab === 'bookkeeping' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Bookkeeping & Compliance Services
              </h2>
              <p className="text-gray-600 mt-2">
                Professional bookkeeping, tax preparation, and compliance solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookkeepingServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPurchase={handleServicePurchase}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  price: string;
  onPurchase: (course: Course) => void;
}

function CourseCard({ course, isEnrolled, price, onPurchase }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex-1">{course.title}</h3>
        {isEnrolled && (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium whitespace-nowrap ml-2">
            <CheckCircle className="w-3 h-3" />
            Enrolled
          </span>
        )}
      </div>

      {course.subtitle && (
        <p className="text-sm text-gray-600 mb-4">{course.subtitle}</p>
      )}

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        {course.est_minutes && (
          <span>{Math.round(course.est_minutes / 60)} hours</span>
        )}
        {course.difficulty_level && (
          <span className="capitalize">{course.difficulty_level}</span>
        )}
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900">
          {price}
        </div>
      </div>

      {isEnrolled ? (
        <button
          onClick={() => navigate(`/academy/courses/${course.slug}`)}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm"
        >
          <Play className="w-4 h-4" />
          Continue Learning
        </button>
      ) : (
        <button
          onClick={() => onPurchase(course)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
        >
          {course.is_free ? 'Start Free Course' : 'Purchase Course'}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface ServiceCardProps {
  service: BookkeepingService;
  onPurchase: (service: BookkeepingService) => void;
}

function ServiceCard({ service, onPurchase }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border border-gray-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">
          {service.price}
          {service.recurring && service.interval && (
            <span className="text-base text-gray-600 font-normal">/{service.interval}</span>
          )}
        </div>
        {!service.recurring && (
          <div className="text-sm text-gray-500 mt-1">One-time service</div>
        )}
      </div>

      <div className="mb-6">
        <ul className="space-y-2">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onPurchase(service)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold text-sm"
      >
        {service.recurring ? 'Subscribe Now' : 'Get Started'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
