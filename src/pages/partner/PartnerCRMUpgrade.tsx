import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Users, Zap, Sparkles, TrendingUp, DollarSign, BookOpen, Video, FileText, Mail, Palette, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import BackButton from '../../components/ui/BackButton';

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  commission: number;
  monthlyRecurring: boolean;
  color: string;
  icon: any;
  features: string[];
  bestFor: string;
  category: 'crm' | 'course' | 'service' | 'subscription';
}

const allProducts: Product[] = [
  {
    id: 'local-link',
    name: 'Local-Link CRM',
    tagline: 'Complete Business Management Platform',
    price: 79,
    commission: 7.90,
    monthlyRecurring: true,
    color: 'from-blue-600 to-cyan-600',
    icon: Users,
    category: 'crm',
    features: [
      'Customer & Lead Management',
      'Automated Follow-ups',
      'Email & SMS Marketing',
      'Appointment Scheduling',
      'Invoice & Payment Processing',
      'Review Management'
    ],
    bestFor: 'Service businesses and local retailers'
  },
  {
    id: 'tradehive',
    name: 'TradeHive CRM',
    tagline: 'Built for Trade Contractors',
    price: 99,
    commission: 9.90,
    monthlyRecurring: true,
    color: 'from-orange-600 to-red-600',
    icon: Zap,
    category: 'crm',
    features: [
      'Job Estimation & Quoting',
      'Work Order Management',
      'Crew Scheduling & Dispatch',
      'Material Tracking',
      'Before/After Photo Gallery',
      'QuickBooks Integration'
    ],
    bestFor: 'Plumbers, electricians, HVAC, contractors'
  },
  {
    id: 'adsuite',
    name: 'AdSuite CRM',
    tagline: 'Marketing Automation Powerhouse',
    price: 149,
    commission: 14.90,
    monthlyRecurring: true,
    color: 'from-purple-600 to-pink-600',
    icon: Sparkles,
    category: 'crm',
    features: [
      'Multi-Channel Campaign Manager',
      'Social Media Automation',
      'Landing Page Builder',
      'Email Drip Campaigns',
      'A/B Testing Suite',
      'Ad Spend Analytics'
    ],
    bestFor: 'Marketing agencies and growth-focused businesses'
  },
  {
    id: 'course_lca',
    name: 'Local-Link Certified Associate',
    tagline: 'Complete Certification Program',
    price: 197,
    commission: 39.40,
    monthlyRecurring: false,
    color: 'from-green-600 to-emerald-600',
    icon: BookOpen,
    category: 'course',
    features: [
      'Full LCA Certification',
      'Business Management Training',
      'Marketing Fundamentals',
      'Sales Training',
      'Certificate upon completion'
    ],
    bestFor: 'New entrepreneurs and business owners'
  },
  {
    id: 'course_ugc',
    name: 'UGC Creator Certification',
    tagline: 'Become a Certified UGC Creator',
    price: 197,
    commission: 39.40,
    monthlyRecurring: false,
    color: 'from-pink-600 to-rose-600',
    icon: Video,
    category: 'course',
    features: [
      'Content Creation Training',
      'Video Production Skills',
      'Client Acquisition',
      'Pricing Strategies',
      'Portfolio Building'
    ],
    bestFor: 'Content creators and influencers'
  },
  {
    id: 'course_ai_marketing',
    name: 'AI Marketing & Automation',
    tagline: 'Master AI Marketing Tools',
    price: 297,
    commission: 59.40,
    monthlyRecurring: false,
    color: 'from-violet-600 to-purple-600',
    icon: Sparkles,
    category: 'course',
    features: [
      'AI Content Generation',
      'Automation Workflows',
      'ChatGPT for Business',
      'AI-Powered Ads',
      'Advanced Analytics'
    ],
    bestFor: 'Digital marketers and agencies'
  },
  {
    id: 'course_recurring_revenue',
    name: 'Selling Recurring Revenue to Trades',
    tagline: 'Build Predictable Income',
    price: 197,
    commission: 39.40,
    monthlyRecurring: false,
    color: 'from-blue-600 to-indigo-600',
    icon: TrendingUp,
    category: 'course',
    features: [
      'Subscription Model Training',
      'Sales Scripts',
      'Pricing Strategies',
      'Customer Retention',
      'Case Studies'
    ],
    bestFor: 'Sales professionals and partners'
  },
  {
    id: 'service_ugc_content',
    name: 'UGC Content Creation',
    tagline: 'Professional Video Content',
    price: 299,
    commission: 44.85,
    monthlyRecurring: false,
    color: 'from-red-600 to-pink-600',
    icon: Video,
    category: 'service',
    features: [
      '3 Professional Videos',
      'Script Writing Included',
      'Full Editing',
      'Multiple Formats',
      '7-Day Turnaround'
    ],
    bestFor: 'Businesses needing video content'
  },
  {
    id: 'service_letter_writing',
    name: 'Professional Sales Letters',
    tagline: 'High-Converting Copy',
    price: 199,
    commission: 29.85,
    monthlyRecurring: false,
    color: 'from-amber-600 to-orange-600',
    icon: FileText,
    category: 'service',
    features: [
      'Custom Sales Letters',
      'Email Sequences',
      'Direct Mail Copy',
      'Professional Copywriting',
      '3-Day Delivery'
    ],
    bestFor: 'Businesses running direct mail campaigns'
  },
  {
    id: 'service_postcard_design',
    name: 'Postcard Design & Printing',
    tagline: 'Design + Print + Ship',
    price: 199,
    commission: 29.85,
    monthlyRecurring: false,
    color: 'from-teal-600 to-cyan-600',
    icon: Mail,
    category: 'service',
    features: [
      'Custom Design',
      '500 Postcards Printed',
      'High-Quality Stock',
      'Free Shipping',
      '10-Day Turnaround'
    ],
    bestFor: 'Local businesses doing direct mail'
  },
  {
    id: 'service_swipe_file',
    name: 'Swipe File Lifetime Access',
    tagline: 'Templates for Everything',
    price: 297,
    commission: 44.55,
    monthlyRecurring: false,
    color: 'from-indigo-600 to-blue-600',
    icon: Palette,
    category: 'service',
    features: [
      '500+ Templates',
      'Email Templates',
      'Social Media Posts',
      'Ad Copy Examples',
      'Lifetime Access'
    ],
    bestFor: 'Marketers and business owners'
  },
  {
    id: 'service_landing_page',
    name: 'Landing Page Design',
    tagline: 'High-Converting Pages',
    price: 299,
    commission: 44.85,
    monthlyRecurring: false,
    color: 'from-emerald-600 to-green-600',
    icon: Globe,
    category: 'service',
    features: [
      'Custom Design',
      'Mobile Responsive',
      'Lead Capture Forms',
      'SEO Optimized',
      '5-Day Delivery'
    ],
    bestFor: 'Businesses launching campaigns'
  },
  {
    id: 'setup_website',
    name: 'Complete Website Setup',
    tagline: 'Professional Website Design',
    price: 999,
    commission: 149.85,
    monthlyRecurring: false,
    color: 'from-slate-600 to-gray-600',
    icon: Globe,
    category: 'service',
    features: [
      'Custom Design',
      'Up to 10 Pages',
      'Mobile Responsive',
      'SEO Setup',
      'Contact Forms',
      'Social Integration'
    ],
    bestFor: 'New businesses needing a website'
  }
];

export default function PartnerCRMUpgrade() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'crm' | 'course' | 'service'>('all');
  const [partnerStatus, setPartnerStatus] = useState<'loading' | 'active' | 'inactive' | 'none'>('loading');

  useEffect(() => {
    checkPartnerStatus();
  }, [user]);

  const checkPartnerStatus = async () => {
    if (!user) {
      setPartnerStatus('none');
      return;
    }

    try {
      const { data: partner } = await supabase
        .from('partners')
        .select('id, status')
        .maybeSingle();

      if (!partner) {
        setPartnerStatus('none');
      } else if (partner.status === 'active') {
        setPartnerStatus('active');
      } else {
        setPartnerStatus('inactive');
      }
    } catch (error) {
      console.error('Error checking partner status:', error);
      setPartnerStatus('none');
    }
  };

  const copyReferralLink = (productId: string) => {
    const link = `https://local-link.com/${productId}?ref=PARTNER123`;
    navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
  };

  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  const categoryStats = {
    crm: allProducts.filter(p => p.category === 'crm').length,
    course: allProducts.filter(p => p.category === 'course').length,
    service: allProducts.filter(p => p.category === 'service').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mb-4">
          <BackButton />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/partner/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {(partnerStatus === 'none' || partnerStatus === 'inactive') && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Lock className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">CRM Access Included with Partner Membership</h3>
                <p className="text-gray-700 mb-4">
                  Your CRM is included FREE with your partner tier subscription. No additional purchase needed!
                </p>
                <div className="bg-white/50 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-gray-900 mb-2">Partner Tier Includes:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• <strong>Starter ($218/mo):</strong> Starter CRM + 15% commissions + 1 territory</li>
                    <li>• <strong>Pro ($658/mo):</strong> Professional CRM + 20% commissions + 3 territories</li>
                    <li>• <strong>Enterprise ($1,798/mo):</strong> Enterprise CRM + 25% commissions + unlimited territories</li>
                    <li>• <strong className="text-orange-600">Enterprise+ ($2,997/mo):</strong> White-Label Licensing + 30% rev share + unlimited territories + priority support</li>
                  </ul>
                </div>
                {partnerStatus === 'none' ? (
                  <button
                    onClick={() => navigate('/partner/apply')}
                    className="bg-[#2BB673] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#239f5f] transition-colors"
                  >
                    Apply to Become a Partner
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/partner/dashboard')}
                    className="bg-[#2BB673] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#239f5f] transition-colors"
                  >
                    Activate Your Partner Account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Products You Can Sell
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn commissions on every product and service you sell. Build your income empire.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Products ({allProducts.length})
          </button>
          <button
            onClick={() => setSelectedCategory('crm')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedCategory === 'crm'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            CRMs ({categoryStats.crm})
          </button>
          <button
            onClick={() => setSelectedCategory('course')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedCategory === 'course'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Courses ({categoryStats.course})
          </button>
          <button
            onClick={() => setSelectedCategory('service')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedCategory === 'service'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Services ({categoryStats.service})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {filteredProducts.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-2xl"
              >
                <div className={`bg-gradient-to-r ${product.color} px-6 py-8 text-center`}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-white/90 text-sm mb-4">{product.tagline}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-white">${product.price}</span>
                    {product.monthlyRecurring && <span className="text-white/80">/month</span>}
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Your Commission</span>
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-700">${product.commission}</span>
                      {product.monthlyRecurring && <span className="text-green-600 text-sm">/month</span>}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {product.monthlyRecurring ? 'Recurring monthly • Lifetime' : 'One-time commission per sale'}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Key Features:</p>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Best For:</p>
                    <p className="text-sm text-gray-600">{product.bestFor}</p>
                  </div>

                  <button
                    onClick={() => copyReferralLink(product.id)}
                    className={`w-full py-3 bg-gradient-to-r ${product.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all`}
                  >
                    Get Referral Link
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Income Potential</h2>
            <p className="text-center text-blue-100 mb-8">
              See what's possible when you build your sales portfolio
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <p className="text-blue-100 text-sm mb-3 text-center font-semibold">Starter Package</p>
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-blue-50">• 5 CRM subscriptions</p>
                  <p className="text-blue-50">• 3 courses sold</p>
                  <p className="text-blue-50">• 2 service packages</p>
                </div>
                <div className="text-center pt-4 border-t border-white/20">
                  <p className="text-3xl font-bold mb-1">$520</p>
                  <p className="text-blue-100 text-sm">monthly recurring</p>
                  <p className="text-xs text-blue-200 mt-2">+ $416 one-time</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/30">
                <p className="text-blue-100 text-sm mb-3 text-center font-semibold">Growth Package</p>
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-blue-50">• 15 CRM subscriptions</p>
                  <p className="text-blue-50">• 8 courses sold</p>
                  <p className="text-blue-50">• 6 service packages</p>
                </div>
                <div className="text-center pt-4 border-t border-white/20">
                  <p className="text-3xl font-bold mb-1">$1,560</p>
                  <p className="text-blue-100 text-sm">monthly recurring</p>
                  <p className="text-xs text-blue-200 mt-2">+ $1,578 one-time</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <p className="text-blue-100 text-sm mb-3 text-center font-semibold">Elite Package</p>
                <div className="space-y-2 text-sm mb-4">
                  <p className="text-blue-50">• 30 CRM subscriptions</p>
                  <p className="text-blue-50">• 15 courses sold</p>
                  <p className="text-blue-50">• 12 service packages</p>
                </div>
                <div className="text-center pt-4 border-t border-white/20">
                  <p className="text-3xl font-bold mb-1">$3,120</p>
                  <p className="text-blue-100 text-sm">monthly recurring</p>
                  <p className="text-xs text-blue-200 mt-2">+ $3,021 one-time</p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-blue-100 mt-6">
              Example scenarios. Your results may vary. CRM commissions are recurring monthly.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Partner With Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Recurring Income</h4>
              <p className="text-sm text-gray-600">
                CRM subscriptions pay you monthly for life. Build predictable, passive income streams.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Full Product Portfolio</h4>
              <p className="text-sm text-gray-600">
                From CRMs to courses to services - offer complete solutions and maximize earnings per customer.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">We Do The Work</h4>
              <p className="text-sm text-gray-600">
                We handle fulfillment, support, and billing. You focus on selling and earning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
