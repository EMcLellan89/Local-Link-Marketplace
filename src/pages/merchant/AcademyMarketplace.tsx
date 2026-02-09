import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, CheckCircle, ArrowRight, Play, DollarSign, Calculator, FileText, TrendingUp, Building, Shield, Zap, Award, Users, Target } from 'lucide-react';
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

interface BookkeepingProduct {
  id: string;
  name: string;
  description: string;
  tiers?: {
    name: string;
    price: string;
    interval?: string;
  }[];
  price?: string;
  interval?: string;
  features: string[];
  icon: any;
  category: string;
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

  // Complete Stripe Product Catalog
  const bookkeepingProducts: BookkeepingProduct[] = [
    {
      id: 'ai-os',
      name: 'Local-Link AI OS™',
      description: 'Core operating system that powers AI automation, bots, analytics, compliance controls, and partner revenue tracking',
      category: 'platform',
      tiers: [
        { name: 'Starter', price: '$97', interval: 'month' },
        { name: 'Growth', price: '$297', interval: 'month' },
        { name: 'Pro', price: '$597', interval: 'month' },
        { name: 'Elite', price: '$997', interval: 'month' }
      ],
      features: [
        'AI job engine + automation runners',
        'Feature flags & kill switch',
        'Partner dashboards & revenue attribution',
        'Circuit breaker & reliability layer'
      ],
      icon: Calculator
    },
    {
      id: 'financial-engine',
      name: 'Local-Link Financial Engine™',
      description: 'AI-powered bookkeeping, monthly P&L, receipt automation, tax-ready reporting, and financial insights',
      category: 'financial',
      tiers: [
        { name: 'Starter', price: '$149', interval: 'month' },
        { name: 'Growth', price: '$299', interval: 'month' },
        { name: 'Pro', price: '$499', interval: 'month' }
      ],
      features: [
        'Monthly P&L + expense reports',
        'Receipt capture + categorization',
        'Tax-Ready Score™ (0–100)',
        'Client Tax Pack generator'
      ],
      icon: DollarSign
    },
    {
      id: 'compliance-shield',
      name: 'Compliance Shield™',
      description: 'Automated compliance workflows, audit trails, risk monitoring, document vaults, and defensibility tools',
      category: 'compliance',
      tiers: [
        { name: 'Basic', price: '$129', interval: 'month' },
        { name: 'Growth', price: '$349', interval: 'month' },
        { name: 'Elite', price: '$699', interval: 'month' }
      ],
      features: [
        'Audit logs & change tracking',
        'Policy workflows & document vault',
        'Risk detection bots',
        'Compliance certification badges'
      ],
      icon: Shield
    },
    {
      id: 'partner-autopilot',
      name: 'Partner Growth Autopilot™',
      description: 'Automated outreach, share kits, follow-ups, lead nurturing, and revenue tracking for partners',
      category: 'growth',
      tiers: [
        { name: 'Starter', price: '$97', interval: 'month' },
        { name: 'Growth', price: '$247', interval: 'month' },
        { name: 'Pro', price: '$497', interval: 'month' }
      ],
      features: [
        'Share Kit generator',
        'Auto follow-up sequences',
        'Partner leaderboard & gamification',
        'Revenue influence tracking'
      ],
      icon: Users
    },
    {
      id: 'lead-command',
      name: 'Lead Command™',
      description: 'AI-driven lead qualification, routing, scoring, and conversion automation',
      category: 'sales',
      tiers: [
        { name: 'Core', price: '$99', interval: 'month' },
        { name: 'Growth', price: '$249', interval: 'month' },
        { name: 'Pro', price: '$449', interval: 'month' }
      ],
      features: [
        'AI lead scoring',
        'Qualification bots',
        'CRM-ready pipelines',
        'Auto-proposal triggers'
      ],
      icon: Target
    },
    {
      id: 'dfy-cleanup',
      name: 'DFY Bookkeeping Cleanup™',
      description: 'One-time historical cleanup of books with categorized transactions, reconciliations, and tax-ready reports',
      category: 'service',
      tiers: [
        { name: 'Light Cleanup', price: '$499' },
        { name: 'Standard Cleanup', price: '$1,200' },
        { name: 'Heavy Cleanup', price: '$2,500+' }
      ],
      features: [
        'Historical transaction cleanup',
        'Receipt recovery',
        'Tax-ready reports',
        'Upgrade path to monthly service'
      ],
      icon: FileText
    },
    {
      id: 'compliance-setup',
      name: 'Compliance Setup & Audit Pack™',
      description: 'DFY compliance framework setup, documentation, audit trail configuration, and risk baseline',
      category: 'service',
      price: '$1,497',
      features: [
        'Compliance framework buildout',
        'Document vault setup',
        'Audit trail initialization'
      ],
      icon: Shield
    },
    {
      id: 'partner-cert',
      name: 'Local-Link Partner Certification™',
      description: 'Training, testing, and certification to sell Local-Link products and earn recurring commissions',
      category: 'education',
      price: '$297',
      features: [
        'Certification badge',
        'Sales playbooks',
        'Commission eligibility'
      ],
      icon: Award
    },
    {
      id: 'merchant-academy',
      name: 'Local-Link Merchant Academy™',
      description: 'Step-by-step training for merchants to use automation, financial tools, and compliance systems effectively',
      category: 'education',
      price: '$197',
      features: [
        'Video modules',
        'Worksheets & SOPs',
        'Certification tests'
      ],
      icon: GraduationCap
    },
    {
      id: 'enterprise-stack',
      name: 'Local-Link Enterprise Stack™',
      description: 'Full AI workforce, compliance, financial automation, and partner infrastructure for multi-location or enterprise organizations',
      category: 'enterprise',
      price: '$2,500-$5,000',
      interval: 'month',
      features: [
        'Dedicated AI workflows',
        'Enterprise compliance',
        'Priority support',
        'Custom integrations'
      ],
      icon: Building
    },
    {
      id: 'ai-workforce',
      name: 'AI Workforce Add-On™',
      description: 'Additional AI bots, higher job limits, and advanced automation capacity',
      category: 'addon',
      price: '$149',
      interval: 'month',
      features: [
        'Additional AI bots',
        'Higher job limits',
        'Advanced automation capacity'
      ],
      icon: Zap
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

  async function handleServicePurchase(product: BookkeepingProduct) {
    if (!user) {
      navigate('/login');
      return;
    }

    alert(`Purchase ${product.name} - Checkout integration coming soon!`);
  }

  function getCoursePrice(course: Course): string {
    if (course.is_free) return 'Free';
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
            Training courses and AI-powered business services for local merchants
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
              AI Bookkeeping Services ({bookkeepingProducts.length})
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

        {/* AI Bookkeeping Services Tab */}
        {activeTab === 'bookkeeping' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                AI Bookkeeping Services
              </h2>
              <p className="text-gray-600 mt-2">
                Complete Stripe product catalog - AI automation, bookkeeping, compliance, and growth tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookkeepingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
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

interface ProductCardProps {
  product: BookkeepingProduct;
  onPurchase: (product: BookkeepingProduct) => void;
}

function ProductCard({ product, onPurchase }: ProductCardProps) {
  const Icon = product.icon;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border border-gray-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>
      </div>

      {/* Pricing Display */}
      <div className="mb-4">
        {product.tiers ? (
          <div className="space-y-2">
            {product.tiers.map((tier, idx) => (
              <div key={idx} className="flex justify-between items-baseline border-l-2 border-blue-500 pl-3">
                <span className="text-sm font-medium text-gray-700">{tier.name}</span>
                <span className="text-lg font-bold text-gray-900">
                  {tier.price}
                  {tier.interval && <span className="text-sm text-gray-600">/{tier.interval}</span>}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-3xl font-bold text-gray-900">
            {product.price}
            {product.interval && (
              <span className="text-base text-gray-600 font-normal">/{product.interval}</span>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mb-6">
        <ul className="space-y-2">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
          {product.category}
        </span>
      </div>

      <button
        onClick={() => onPurchase(product)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold text-sm"
      >
        {product.tiers ? 'View Plans' : 'Get Started'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
