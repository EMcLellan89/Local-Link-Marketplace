import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  Store,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Copy,
  Info,
  Gift,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface ProfitNetworkBusiness {
  id: string;
  name: string;
  description: string;
  website_url: string;
  logo_url: string;
  category: string;
  base_commission_rate: number;
  bonus_commission_rate: number;
  bonus_active: boolean;
  bonus_expires_at: string | null;
}

interface Enrollment {
  id: string;
  business_id: string;
  unique_link_code: string;
  tracking_url: string;
  status: string;
  startup_weeks_remaining: number;
  payback_owed_cents: number;
  payback_paid_cents: number;
  payback_complete: boolean;
  daily_ad_spend_cents: number;
  total_sales: number;
  total_revenue_cents: number;
  total_commission_earned_cents: number;
  total_commission_paid_cents: number;
  approved_at: string | null;
  created_at: string;
  business: ProfitNetworkBusiness;
}

export default function ProfitNetworkPage() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<ProfitNetworkBusiness[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      const businessesResult = await supabase
        .from('profit_network_businesses')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (businessesResult.data) {
        setBusinesses(businessesResult.data);
      }

      if (partner) {
        const enrollmentsResult = await supabase
          .from('profit_network_enrollments')
          .select(`
            *,
            business:profit_network_businesses(*)
          `)
          .eq('partner_id', partner.id);

        if (enrollmentsResult.data) {
          setEnrollments(enrollmentsResult.data as any);
        }
      }
    } catch (error) {
      console.error('Error loading profit network data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll(businessId: string) {
    setEnrolling(businessId);
    try {
      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (!partner) throw new Error('Partner not found');

      const { data, error } = await supabase.rpc('enroll_in_profit_network', {
        p_partner_id: partner.id,
        p_business_id: businessId
      });

      if (error) throw error;

      if (data.success) {
        alert('Enrollment submitted! Our team will review and approve your application.');
        await loadData();
      } else {
        alert(data.error || 'Failed to enroll');
      }
    } catch (error: any) {
      console.error('Error enrolling:', error);
      alert(error.message || 'Failed to enroll');
    } finally {
      setEnrolling(null);
    }
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  function formatCurrency(cents: number) {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  function getEnrollmentForBusiness(businessId: string) {
    return enrollments.find(e => e.business_id === businessId);
  }

  if (loading) {
    return (
      <PartnerHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PartnerHubLayout>
    );
  }

  return (
    <PartnerHubLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Store className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">Local-Link Profit Network™</h1>
              <p className="text-green-100">Pre-sold businesses. Just collect the commission.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">How the Profit Network Works</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span><strong>Flat 25% commission</strong> on all sales from your unique tracking link</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span><strong>We cover your first 8 weeks</strong> of ads at $20/day ($1,120 total)</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span><strong>Starting week 9:</strong> Pay back $50/week until the $1,120 is repaid</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span><strong>After payback:</strong> Ad costs deducted from your weekly commission before payment</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span><strong>Control your ad spend:</strong> Adjust daily budget (min $20/day) after 8 weeks</span>
                </p>
                <p className="flex items-start gap-2">
                  <Gift className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                  <span><strong>Bonus opportunities:</strong> Up to 10% extra commission on select months!</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {enrollments.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">My Active Businesses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {enrollment.business.logo_url && (
                          <img
                            src={enrollment.business.logo_url}
                            alt={enrollment.business.name}
                            className="w-12 h-12 object-contain rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-bold text-gray-900">{enrollment.business.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            enrollment.status === 'active' ? 'bg-green-100 text-green-700' :
                            enrollment.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                            enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {enrollment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    {enrollment.status === 'active' && (
                      <>
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <label className="text-xs text-gray-600 block mb-1">Your Tracking Link</label>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-sm font-mono bg-white px-3 py-2 rounded border overflow-x-auto">
                              {enrollment.tracking_url}
                            </code>
                            <Button
                              variant="secondary"
                              onClick={() => copyToClipboard(enrollment.tracking_url, enrollment.id)}
                              className="flex-shrink-0"
                            >
                              {copiedLink === enrollment.id ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-600 mb-1">Total Sales</p>
                            <p className="text-2xl font-bold text-green-900">{enrollment.total_sales}</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600 mb-1">Revenue Generated</p>
                            <p className="text-xl font-bold text-blue-900">
                              {formatCurrency(enrollment.total_revenue_cents)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs text-purple-600 mb-1">Total Earned</p>
                            <p className="text-xl font-bold text-purple-900">
                              {formatCurrency(enrollment.total_commission_earned_cents)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <p className="text-xs text-orange-600 mb-1">Paid Out</p>
                            <p className="text-xl font-bold text-orange-900">
                              {formatCurrency(enrollment.total_commission_paid_cents)}
                            </p>
                          </div>
                        </div>

                        {!enrollment.payback_complete && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm font-semibold text-yellow-900">
                                Startup Payback Progress
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-yellow-700">
                                <span>Paid: {formatCurrency(enrollment.payback_paid_cents)}</span>
                                <span>Remaining: {formatCurrency(enrollment.payback_owed_cents - enrollment.payback_paid_cents)}</span>
                              </div>
                              <div className="w-full bg-yellow-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-600 h-2 rounded-full transition-all"
                                  style={{
                                    width: `${(enrollment.payback_paid_cents / enrollment.payback_owed_cents) * 100}%`
                                  }}
                                />
                              </div>
                              <p className="text-xs text-yellow-600">$50 deducted weekly until paid in full</p>
                            </div>
                          </div>
                        )}

                        {enrollment.startup_weeks_remaining > 0 && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Gift className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-900">
                                {enrollment.startup_weeks_remaining} weeks of free ads remaining!
                              </span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              We're covering ${(enrollment.daily_ad_spend_cents / 100).toFixed(0)}/day
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {enrollment.status === 'pending' && (
                      <div className="text-center py-6">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">Application Under Review</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Our team will review your application and set up your tracking link shortly.
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-4">Available Businesses</h2>
          {businesses.length === 0 ? (
            <Card>
              <CardBody>
                <div className="text-center py-12">
                  <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Businesses Available</h3>
                  <p className="text-gray-500">
                    Check back soon - we're constantly adding new businesses to the network!
                  </p>
                </div>
              </CardBody>
            </Card>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => {
              const enrollment = getEnrollmentForBusiness(business.id);
              const isEnrolled = !!enrollment;
              const totalRate = business.base_commission_rate + (business.bonus_active ? business.bonus_commission_rate : 0);

              return (
                <Card key={business.id}>
                  <CardBody>
                    <div className="mb-4">
                      {business.logo_url && (
                        <img
                          src={business.logo_url}
                          alt={business.name}
                          className="w-full h-32 object-contain mb-3"
                        />
                      )}
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{business.name}</h3>
                      {business.category && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {business.category}
                        </span>
                      )}
                    </div>

                    {business.description && (
                      <p className="text-sm text-gray-600 mb-4">{business.description}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm text-gray-700">Base Commission:</span>
                        <span className="font-bold text-green-600">{Number(business.base_commission_rate)}%</span>
                      </div>

                      {business.bonus_active && (
                        <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <span className="text-sm text-gray-700 flex items-center gap-1">
                            <Gift className="w-4 h-4 text-orange-600" />
                            Bonus Active:
                          </span>
                          <span className="font-bold text-orange-600">+{Number(business.bonus_commission_rate)}%</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm text-gray-700">Total Rate:</span>
                        <span className="font-bold text-blue-600 text-lg">{Number(totalRate)}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => window.location.href = `/partner/profit-network/playbook/${business.id}`}
                      >
                        <BookOpen className="w-4 h-4" />
                        View Partner Playbook
                      </Button>

                      <div className="flex items-center gap-2">
                        {isEnrolled ? (
                          <Button variant="secondary" className="flex-1" disabled>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {enrollment.status === 'active' ? 'Active' :
                             enrollment.status === 'pending' ? 'Pending' : 'Enrolled'}
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            className="flex-1"
                            onClick={() => handleEnroll(business.id)}
                            disabled={enrolling === business.id}
                          >
                            {enrolling === business.id ? 'Enrolling...' : 'Apply Now'}
                          </Button>
                        )}
                        <a
                          href={business.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-600" />
                        </a>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
          )}
        </section>

        {enrollments.some(e => e.status === 'active') && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">View Detailed Sales & Statements</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Track your sales, view weekly/monthly breakdowns, and download your commission statements.
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/partner/profit-network/sales'}>
              <DollarSign className="w-4 h-4 mr-2" />
              View My Sales & Statements
            </Button>
          </div>
        )}
      </div>
    </PartnerHubLayout>
  );
}
