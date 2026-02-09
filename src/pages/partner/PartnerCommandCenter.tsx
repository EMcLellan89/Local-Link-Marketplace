import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, DollarSign, Package, GraduationCap,
  TrendingUp, FileText, Building2, Phone, Mail, Plus, Settings, Target, Award
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProductCatalog from '../../components/marketplace/ProductCatalog';

type TabType = 'overview' | 'crm' | 'products' | 'academy' | 'accounting';

interface Partner {
  id: string;
  system_id: string;
  business_name: string;
  status: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  price_cents: number;
}

export default function PartnerCommandCenter() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalMerchants: 0,
    monthlyCommission: 0,
    activeTerritories: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setPartner(partnerData);

      if (partnerData) {
        const { data: merchantsData } = await supabase
          .from('merchants')
          .select('id')
          .eq('referred_by_partner_id', partnerData.id);

        const { data: territoriesData } = await supabase
          .from('partner_territories')
          .select('id')
          .eq('partner_id', partnerData.id)
          .eq('status', 'active');

        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, title, description, slug, price_cents')
          .eq('target_audience', 'partner')
          .eq('published', true)
          .order('created_at', { ascending: false });

        setStats({
          totalMerchants: merchantsData?.length || 0,
          monthlyCommission: 0,
          activeTerritories: territoriesData?.length || 0,
          totalRevenue: 0,
        });

        if (coursesData) setCourses(coursesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Partner Command Center</h1>
                <p className="text-gray-600 mt-1">
                  System ID: <span className="font-mono font-semibold text-purple-600">{partner?.system_id}</span>
                </p>
              </div>
              <Link
                to="/partner/dashboard"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 border-b border-gray-200">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'crm', label: 'CRM', icon: Users },
                { id: 'products', label: 'Product Catalog', icon: Package },
                { id: 'academy', label: 'Partner Academy', icon: GraduationCap },
                { id: 'accounting', label: 'Accounting', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Merchants</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalMerchants}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Commission</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {formatCurrency(stats.monthlyCommission)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Territories</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeTerritories}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {formatCurrency(stats.totalRevenue)}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/partner/crm"
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <Users className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Manage Leads</span>
                </Link>
                <button
                  onClick={() => setActiveTab('products')}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <Package className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">View Catalog</span>
                </button>
                <button
                  onClick={() => setActiveTab('academy')}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <GraduationCap className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Training</span>
                </button>
                <Link
                  to="/partner/accounting"
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <FileText className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Accounting</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Partner CRM</h2>
                  <p className="text-gray-600 mt-1">Manage companies, contacts, and deals</p>
                </div>
                <Link
                  to="/partner/crm"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open CRM Dashboard
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Building2 className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Companies</h3>
                  <p className="text-sm text-gray-600">Track businesses you're working with</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Contacts</h3>
                  <p className="text-sm text-gray-600">Manage decision makers and relationships</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <Target className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Deals</h3>
                  <p className="text-sm text-gray-600">Track pipeline and close more sales</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && partner && (
          <ProductCatalog
            entityType="partner"
            entityId={partner.id}
            onOrderProduct={(productId) => {
              console.log('Order product:', productId);
            }}
            showPricing={true}
          />
        )}

        {activeTab === 'academy' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 p-3 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Partner Academy</h2>
                  <p className="text-gray-600 mt-1">Access training courses, certifications, and resources</p>
                </div>
              </div>
              <Link
                to="/academy"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <GraduationCap className="w-5 h-5" />
                Go to Academy
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(course.price_cents)}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No courses available at the moment</p>
                <p className="text-sm text-gray-400 mt-2">Check back soon for new training opportunities</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'accounting' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Partner Accounting</h2>
              <p className="text-gray-600 mb-6">Track sales, commissions, and financial records</p>
              <Link
                to="/partner/accounting"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Open Accounting Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
