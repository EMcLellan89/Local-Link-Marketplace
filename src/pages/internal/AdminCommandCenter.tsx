import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, GraduationCap, FileText,
  Settings, TrendingUp, DollarSign, Building2, BookOpen, Edit
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { InternalCRMLayout } from '../../components/layout/InternalCRMLayout';
import ProductCatalog from '../../components/marketplace/ProductCatalog';

type TabType = 'overview' | 'crm' | 'products' | 'courses' | 'accounting';

interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  price_cents: number;
  target_audience: 'merchant' | 'partner';
  published: boolean;
}

interface AdminStats {
  totalCustomers: number;
  totalMerchants: number;
  totalPartners: number;
  totalRevenue: number;
}

export default function AdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalCustomers: 0,
    totalMerchants: 0,
    totalPartners: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [customersRes, merchantsRes, partnersRes, coursesRes] = await Promise.all([
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('merchants').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase
          .from('courses')
          .select('id, title, description, slug, price_cents, target_audience, published')
          .order('target_audience', { ascending: true })
          .order('title', { ascending: true }),
      ]);

      setStats({
        totalCustomers: customersRes.count || 0,
        totalMerchants: merchantsRes.count || 0,
        totalPartners: partnersRes.count || 0,
        totalRevenue: 0,
      });

      if (coursesRes.data) setCourses(coursesRes.data);
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
      <InternalCRMLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </InternalCRMLayout>
    );
  }

  return (
    <InternalCRMLayout>
      <div className="space-y-6">
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
                <p className="text-gray-600 mt-1">Manage all platform operations</p>
              </div>
              <Link
                to="/internal/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>

            <div className="flex space-x-1 border-b border-gray-200">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'crm', label: 'CRM', icon: Users },
                { id: 'products', label: 'Product Catalog', icon: Package },
                { id: 'courses', label: 'Course Management', icon: GraduationCap },
                { id: 'accounting', label: 'Accounting', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
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

        <div className="px-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Customers</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Merchants</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalMerchants}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Partners</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPartners}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Platform Revenue</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {formatCurrency(stats.totalRevenue)}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <DollarSign className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link
                    to="/internal/customers"
                    className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Users className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium">Manage Customers</span>
                  </Link>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Package className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium">View Catalog</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <GraduationCap className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium">Manage Courses</span>
                  </button>
                  <Link
                    to="/internal/accounting"
                    className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <FileText className="w-8 h-8 text-blue-600 mb-2" />
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
                    <h2 className="text-2xl font-semibold text-gray-900">Internal CRM</h2>
                    <p className="text-gray-600 mt-1">Manage all customers, merchants, and partners</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link
                    to="/internal/customers"
                    className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Users className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Customers</h3>
                    <p className="text-sm text-gray-600">Manage customer accounts and data</p>
                    <p className="text-2xl font-bold text-blue-600 mt-3">{stats.totalCustomers}</p>
                  </Link>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <Building2 className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Merchants</h3>
                    <p className="text-sm text-gray-600">View and manage business accounts</p>
                    <p className="text-2xl font-bold text-green-600 mt-3">{stats.totalMerchants}</p>
                  </div>

                  <Link
                    to="/admin/partner-applications"
                    className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Users className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Partners</h3>
                    <p className="text-sm text-gray-600">Manage partner network</p>
                    <p className="text-2xl font-bold text-purple-600 mt-3">{stats.totalPartners}</p>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <ProductCatalog
              entityType="admin"
              showPricing={true}
            />
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-3 rounded-lg">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Course Management</h2>
                      <p className="text-gray-600 mt-1">Manage merchant and partner training courses</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Merchant Courses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses
                      .filter((c) => c.target_audience === 'merchant')
                      .map((course) => (
                        <div
                          key={course.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="bg-green-50 p-2 rounded-lg">
                              <BookOpen className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  course.published
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {course.published ? 'Published' : 'Draft'}
                              </span>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(course.price_cents)}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              For Merchants
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                  {courses.filter((c) => c.target_audience === 'merchant').length === 0 && (
                    <p className="text-center text-gray-500 py-8">No merchant courses available</p>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Partner Courses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses
                      .filter((c) => c.target_audience === 'partner')
                      .map((course) => (
                        <div
                          key={course.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="bg-purple-50 p-2 rounded-lg">
                              <BookOpen className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  course.published
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {course.published ? 'Published' : 'Draft'}
                              </span>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(course.price_cents)}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              For Partners
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                  {courses.filter((c) => c.target_audience === 'partner').length === 0 && (
                    <p className="text-center text-gray-500 py-8">No partner courses available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounting' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Platform Accounting</h2>
                <p className="text-gray-600 mb-6">Track revenue, expenses, and tax obligations</p>
                <Link
                  to="/internal/accounting"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Open Accounting Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </InternalCRMLayout>
  );
}
