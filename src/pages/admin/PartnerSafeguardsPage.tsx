import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { AlertTriangle, CheckCircle, XCircle, TrendingDown, Clock, Shield, Users } from 'lucide-react';

interface PartnerWarning {
  id: string;
  partner_id: string;
  warning_type: string;
  severity: string;
  title: string;
  description: string;
  deadline: string;
  resolved: boolean;
  created_at: string;
  partner: {
    company_name: string;
    email: string;
  };
}

interface InactivePartner {
  id: string;
  company_name: string;
  email: string;
  last_merchant_signup: string | null;
  last_login: string | null;
  total_merchants: number;
  active_warnings: number;
  inactivity_strike_count: number;
  days_inactive: number;
}

interface ReassignmentRequest {
  id: string;
  status: string;
  reason: string;
  created_at: string;
  merchant: {
    business_name: string;
  };
  current_partner: {
    company_name: string;
  };
}

export default function PartnerSafeguardsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'warnings' | 'inactive' | 'reassignments'>('overview');
  const [warnings, setWarnings] = useState<PartnerWarning[]>([]);
  const [inactivePartners, setInactivePartners] = useState<InactivePartner[]>([]);
  const [reassignmentRequests, setReassignmentRequests] = useState<ReassignmentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanRunning, setScanRunning] = useState(false);
  const [stats, setStats] = useState({
    total_warnings: 0,
    severe_warnings: 0,
    inactive_partners: 0,
    pending_reassignments: 0
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load warnings
      const { data: warningsData } = await supabase
        .from('partner_warnings')
        .select(`
          *,
          partner:partners(company_name, email)
        `)
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (warningsData) setWarnings(warningsData);

      // Load inactive partners
      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .eq('status', 'Active');

      if (partnersData) {
        const now = new Date();
        const inactive = partnersData
          .map(p => {
            const lastSignup = p.last_merchant_signup ? new Date(p.last_merchant_signup) : null;
            const lastLogin = p.last_login ? new Date(p.last_login) : null;
            const daysSinceSignup = lastSignup ? Math.floor((now.getTime() - lastSignup.getTime()) / (1000 * 60 * 60 * 24)) : 999;
            const daysSinceLogin = lastLogin ? Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)) : 999;
            return {
              ...p,
              days_inactive: Math.max(daysSinceSignup, daysSinceLogin)
            };
          })
          .filter(p => p.days_inactive >= 30)
          .sort((a, b) => b.days_inactive - a.days_inactive);

        setInactivePartners(inactive);
      }

      // Load reassignment requests
      const { data: requestsData } = await supabase
        .from('merchant_reassignment_requests')
        .select(`
          *,
          merchant:merchants(business_name),
          current_partner:partners!current_partner_id(company_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (requestsData) setReassignmentRequests(requestsData);

      // Calculate stats
      setStats({
        total_warnings: warningsData?.length || 0,
        severe_warnings: warningsData?.filter(w => w.severity === 'severe').length || 0,
        inactive_partners: inactive.length,
        pending_reassignments: requestsData?.length || 0
      });

    } catch (error) {
      console.error('Failed to load safeguard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runInactivityScan = async () => {
    setScanRunning(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-inactivity-scanner`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();
      alert(`Scan complete! Warnings issued: ${result.warnings_issued}, Territories recovered: ${result.territories_recovered}`);
      loadData();
    } catch (error) {
      console.error('Scan failed:', error);
      alert('Failed to run inactivity scan');
    } finally {
      setScanRunning(false);
    }
  };

  const resolveWarning = async (warningId: string) => {
    const { error } = await supabase
      .from('partner_warnings')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', warningId);

    if (!error) {
      loadData();
    }
  };

  const approveReassignment = async (requestId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error } = await supabase.rpc('approve_merchant_reassignment', {
      p_request_id: requestId,
      p_admin_id: userData.user.id
    });

    if (!error) {
      alert('Reassignment approved! Original partner will receive residual commission for 3 months.');
      loadData();
    } else {
      alert('Failed to approve reassignment: ' + error.message);
    }
  };

  const denyReassignment = async (requestId: string) => {
    const { error } = await supabase
      .from('merchant_reassignment_requests')
      .update({ status: 'denied' })
      .eq('id', requestId);

    if (!error) {
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Safeguards</h1>
            <p className="text-gray-600 mt-2">Monitor partner activity and manage territory protection</p>
          </div>
          <Button
            onClick={runInactivityScan}
            disabled={scanRunning}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            {scanRunning ? 'Scanning...' : 'Run Inactivity Scan'}
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Warnings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_warnings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Severe Warnings</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.severe_warnings}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Partners</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.inactive_partners}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reassignments</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.pending_reassignments}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'warnings', label: 'Active Warnings' },
            { id: 'inactive', label: 'Inactive Partners' },
            { id: 'reassignments', label: 'Reassignment Requests' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="text-sm">Automatic monitoring active</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                      <span className="text-sm">Exclusivity model: ENABLED</span>
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Last scan: Run manually above</span>
                      <Clock className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Protection Rules</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• 30 days inactivity = Minor warning</li>
                    <li>• 60 days inactivity = Moderate warning</li>
                    <li>• 90 days inactivity = Severe warning (strike)</li>
                    <li>• 3 strikes = Territory recovered</li>
                    <li>• Merchants can request reassignment after 90 days</li>
                    <li>• Original partner gets 3 months residual commission on reassignment</li>
                  </ul>
                </Card>
              </div>
            )}

            {activeTab === 'warnings' && (
              <div className="space-y-4">
                {warnings.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No active warnings</p>
                  </Card>
                ) : (
                  warnings.map(warning => (
                    <Card key={warning.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              warning.severity === 'severe' ? 'bg-red-100 text-red-700' :
                              warning.severity === 'moderate' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {warning.severity.toUpperCase()}
                            </span>
                            <h3 className="font-semibold text-gray-900">{warning.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{warning.description}</p>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>Partner: {warning.partner.company_name} ({warning.partner.email})</p>
                            <p>Deadline: {new Date(warning.deadline).toLocaleDateString()}</p>
                            <p>Created: {new Date(warning.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => resolveWarning(warning.id)}
                          variant="secondary"
                          size="sm"
                        >
                          Resolve
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === 'inactive' && (
              <div className="space-y-4">
                {inactivePartners.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">All partners are active</p>
                  </Card>
                ) : (
                  inactivePartners.map(partner => (
                    <Card key={partner.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{partner.company_name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{partner.email}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Days Inactive:</span>
                              <span className={`ml-2 font-semibold ${
                                partner.days_inactive >= 90 ? 'text-red-600' :
                                partner.days_inactive >= 60 ? 'text-orange-600' :
                                'text-yellow-600'
                              }`}>
                                {partner.days_inactive}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Total Merchants:</span>
                              <span className="ml-2 font-semibold">{partner.total_merchants}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Active Warnings:</span>
                              <span className="ml-2 font-semibold">{partner.active_warnings}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Strikes:</span>
                              <span className="ml-2 font-semibold text-red-600">{partner.inactivity_strike_count}/3</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === 'reassignments' && (
              <div className="space-y-4">
                {reassignmentRequests.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No pending reassignment requests</p>
                  </Card>
                ) : (
                  reassignmentRequests.map(request => (
                    <Card key={request.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {request.merchant.business_name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Current Partner: {request.current_partner.company_name}
                          </p>
                          <p className="text-sm text-gray-700 mb-3">
                            <strong>Reason:</strong> {request.reason}
                          </p>
                          <p className="text-xs text-gray-500">
                            Requested: {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => approveReassignment(request.id)}
                            variant="primary"
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => denyReassignment(request.id)}
                            variant="secondary"
                            size="sm"
                          >
                            Deny
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
