import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Store, Tag, DollarSign, Mail, TrendingUp, CheckCircle, XCircle,
  Calendar, BarChart3, Clock, Phone, Link as LinkIcon, LogOut, Building, Calculator
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalMerchants: number;
  totalCustomers: number;
  totalDeals: number;
  activeDeals: number;
  totalRevenue: number;
  totalPurchases: number;
  pendingMerchants: number;
  pendingDeals: number;
  activeSubscriptions: number;
  totalAppointments: number;
  upcomingAppointments: number;
  totalPrintingOrders: number;
  totalLeads: number;
  totalReviews: number;
  averageRating: number;
}

interface Appointment {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_type: string;
  appointment_date: string;
  duration_minutes: number;
  status: string;
  notes: string;
  created_at: string;
}

export default function EnhancedAdminDashboard() {
  const navigate = useNavigate();
  const { adminUser, signOut, loading: authLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalMerchants: 0,
    totalCustomers: 0,
    totalDeals: 0,
    activeDeals: 0,
    totalRevenue: 0,
    totalPurchases: 0,
    pendingMerchants: 0,
    pendingDeals: 0,
    activeSubscriptions: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalPrintingOrders: 0,
    totalLeads: 0,
    totalReviews: 0,
    averageRating: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !adminUser) {
      navigate('/admin/login');
    } else if (adminUser) {
      loadDashboardData();
    }
  }, [adminUser, authLoading, navigate]);

  const loadDashboardData = async () => {
    try {
      const [
        merchantsResult,
        customersResult,
        dealsResult,
        purchasesResult,
        subscriptionsResult,
        appointmentsResult,
        printingResult,
        leadsResult,
        reviewsResult
      ] = await Promise.all([
        supabase.from('merchants').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('deals').select('*'),
        supabase.from('purchases').select('*'),
        supabase.from('merchant_subscriptions').select('*').eq('status', 'active'),
        supabase.from('appointments').select('*').order('appointment_date', { ascending: true }),
        supabase.from('printing_orders').select('*'),
        supabase.from('crm_leads').select('*'),
        supabase.from('reviews').select('rating')
      ]);

      const merchantsData = merchantsResult.data || [];
      const dealsData = dealsResult.data || [];
      const purchasesData = purchasesResult.data || [];
      const appointmentsData = appointmentsResult.data || [];
      const reviewsData = reviewsResult.data || [];

      const totalRevenue = purchasesData.reduce((sum, p) => sum + ((p as any).amount_paid_cents || 0), 0) / 100;
      const now = new Date();
      const upcomingAppointments = appointmentsData.filter(a =>
        new Date((a as any).appointment_date) > now && (a as any).status === 'scheduled'
      );

      const avgRating = reviewsData.length > 0
        ? reviewsData.reduce((sum, r) => sum + (r as any).rating, 0) / reviewsData.length
        : 0;

      setStats({
        totalMerchants: merchantsData.length,
        totalCustomers: customersResult.data?.length || 0,
        totalDeals: dealsData.length,
        activeDeals: dealsData.filter(d => (d as any).status === 'active').length,
        totalRevenue,
        totalPurchases: purchasesData.length,
        pendingMerchants: merchantsData.filter(m => (m as any).status === 'pending').length,
        pendingDeals: dealsData.filter(d => (d as any).status === 'pending_approval').length,
        activeSubscriptions: subscriptionsResult.data?.length || 0,
        totalAppointments: appointmentsData.length,
        upcomingAppointments: upcomingAppointments.length,
        totalPrintingOrders: printingResult.data?.length || 0,
        totalLeads: leadsResult.data?.length || 0,
        totalReviews: reviewsData.length,
        averageRating: avgRating
      });

      setAppointments(appointmentsData as Appointment[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      await supabase
        .from('appointments')
        .update({ status } as any)
        .eq('id', appointmentId);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const upcomingAppointmentsList = appointments.filter(a =>
    new Date(a.appointment_date) > new Date() && a.status === 'scheduled'
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LinkIcon className="w-8 h-8 text-[#2BB673]" />
              <span className="ml-2 text-xl font-bold text-slate-900">Local Link Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">{adminUser.full_name}</div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-2">Complete overview of Local Link Marketplace</p>
          </div>

          <div className="border-b border-slate-200">
            <nav className="flex space-x-8">
              {['overview', 'calendar', 'merchants', 'customers', 'financials'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-[#2BB673] text-[#2BB673]'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardBody className="flex items-center space-x-4">
                    <div className="p-3 bg-[#2BB673]/10 rounded-lg">
                      <Store className="w-8 h-8 text-[#2BB673]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Merchants</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.totalMerchants}</p>
                      {stats.pendingMerchants > 0 && (
                        <p className="text-xs text-[#F5B82E]">{stats.pendingMerchants} pending</p>
                      )}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Customers</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.totalCustomers}</p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Tag className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Active Deals</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.activeDeals}</p>
                      <p className="text-xs text-slate-500">{stats.totalDeals} total</p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <p className="text-xs text-slate-500">{stats.totalPurchases} purchases</p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="flex items-center space-x-4">
                    <div className="p-3 bg-[#F5B82E]/10 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-[#F5B82E]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.activeSubscriptions}</p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Calendar className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Appointments</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.upcomingAppointments}</p>
                      <p className="text-xs text-slate-500">upcoming</p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <Mail className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Printing Orders</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.totalPrintingOrders}</p>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="flex items-center space-x-4">
                    <div className="p-3 bg-cyan-100 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">CRM Leads</p>
                      <p className="text-2xl font-bold text-slate-900">{stats.totalLeads}</p>
                    </div>
                  </CardBody>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => navigate('/admin/crm')}
                    >
                      <Building className="w-5 h-5 mr-2" />
                      Admin CRM
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => navigate('/admin/accounting')}
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Accounting
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => navigate('/team/dashboard')}
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Team CRM
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => navigate('/admin/partners')}
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Partner Management
                    </Button>
                  </div>
                </CardBody>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">Upcoming Appointments</h3>
                      <Button size="sm" onClick={() => setActiveTab('calendar')}>
                        View Calendar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {upcomingAppointmentsList.length === 0 ? (
                      <p className="text-slate-500 text-center py-4">No upcoming appointments</p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingAppointmentsList.slice(0, 5).map((apt) => (
                          <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{apt.customer_name}</p>
                              <p className="text-sm text-slate-600">{apt.appointment_type}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(apt.appointment_date).toLocaleString()}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => setActiveTab('calendar')}>
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold text-slate-900">Platform Health</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Average Review Rating</span>
                        <span className="font-bold text-[#2BB673]">
                          {stats.averageRating.toFixed(1)} / 5.0
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Total Reviews</span>
                        <span className="font-bold text-slate-900">{stats.totalReviews}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Pending Approvals</span>
                        <span className={`font-bold ${stats.pendingMerchants + stats.pendingDeals > 0 ? 'text-[#F5B82E]' : 'text-green-600'}`}>
                          {stats.pendingMerchants + stats.pendingDeals}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Appointment Calendar</h2>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{stats.totalAppointments} total appointments</span>
                </div>
              </div>

              <div className="grid gap-4">
                {appointments.length === 0 ? (
                  <Card>
                    <CardBody className="text-center py-12">
                      <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">No appointments scheduled yet</p>
                    </CardBody>
                  </Card>
                ) : (
                  appointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.appointment_date);
                    const isPast = appointmentDate < new Date();

                    return (
                      <Card key={appointment.id} variant="bordered" className={isPast ? 'opacity-60' : ''}>
                        <CardBody>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-bold text-slate-900">{appointment.customer_name}</h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                  appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-slate-100 text-slate-800'
                                }`}>
                                  {appointment.status}
                                </span>
                              </div>
                              <div className="mt-2 space-y-1 text-sm">
                                <div className="flex items-center text-slate-600">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {appointmentDate.toLocaleString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit'
                                  })}
                                </div>
                                <div className="flex items-center text-slate-600">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {appointment.duration_minutes} minutes
                                </div>
                                <div className="flex items-center text-slate-600">
                                  <Mail className="w-4 h-4 mr-2" />
                                  {appointment.customer_email}
                                </div>
                                {appointment.customer_phone && (
                                  <div className="flex items-center text-slate-600">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {appointment.customer_phone}
                                  </div>
                                )}
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-slate-600">
                                  <span className="font-semibold">Type:</span> {appointment.appointment_type}
                                </p>
                                {appointment.notes && (
                                  <p className="text-sm text-slate-600 mt-1">
                                    <span className="font-semibold">Notes:</span> {appointment.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              {appointment.status === 'scheduled' && !isPast && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                    className="flex items-center space-x-1"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Complete</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                    className="flex items-center space-x-1"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    <span>Cancel</span>
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'merchants' && (
            <Card>
              <CardBody className="text-center py-12">
                <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Detailed merchant management</p>
                <p className="text-sm text-slate-500 mt-2">View, approve, and manage merchant accounts</p>
              </CardBody>
            </Card>
          )}

          {activeTab === 'customers' && (
            <Card>
              <CardBody className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Customer management</p>
                <p className="text-sm text-slate-500 mt-2">View customer profiles and purchase history</p>
              </CardBody>
            </Card>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Financial Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardBody>
                    <p className="text-sm text-slate-600 mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-slate-900">
                      ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">From {stats.totalPurchases} purchases</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <p className="text-sm text-slate-600 mb-2">Monthly Recurring Revenue</p>
                    <p className="text-3xl font-bold text-[#2BB673]">
                      ${(stats.activeSubscriptions * 249).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{stats.activeSubscriptions} active subscriptions</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <p className="text-sm text-slate-600 mb-2">Estimated Commission</p>
                    <p className="text-3xl font-bold text-slate-900">
                      ${(stats.totalRevenue * 0.25).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">~25% average commission</p>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
