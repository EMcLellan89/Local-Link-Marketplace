import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, FileText, CheckCircle, XCircle, Clock, Eye, X } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';

interface Application {
  id: string;
  application_number: string;
  legal_business_name: string;
  dba_name: string;
  business_email: string;
  contact_first_name: string;
  contact_last_name: string;
  status: string;
  submitted_at: string;
  is_high_risk: boolean;
  monthly_volume: number;
  processor: string;
}

export default function MerchantApplicationsAdmin() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [modalData, setModalData] = useState({
    status: '',
    varInfo: '',
    gatewayInfo: '',
    adminNotes: '',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('merchant_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.application_number.toLowerCase().includes(term) ||
        app.legal_business_name.toLowerCase().includes(term) ||
        app.business_email.toLowerCase().includes(term)
      );
    }

    setFilteredApplications(filtered);
  };

  const openModal = async (appId: string) => {
    try {
      const { data: app, error } = await supabase
        .from('merchant_applications')
        .select('*, merchant_application_equipment(*)')
        .eq('id', appId)
        .single();

      if (error) throw error;

      setSelectedApp(app);
      setModalData({
        status: (app as any).status || '',
        varInfo: (app as any).var_info || '',
        gatewayInfo: (app as any).gateway_info || '',
        adminNotes: (app as any).admin_notes || '',
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  const handleUpdate = async () => {
    if (!selectedApp) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('merchant_applications')
        .update({
          status: modalData.status,
          var_info: modalData.varInfo,
          gateway_info: modalData.gatewayInfo,
          admin_notes: modalData.adminNotes,
          reviewed_at: new Date().toISOString(),
        } as any)
        .eq('id', selectedApp.id);

      if (error) throw error;

      // Notify applicant of status change
      const notifyStatuses = ['approved', 'rejected', 'under review'];
      if (notifyStatuses.includes(modalData.status)) {
        const mappedStatus = modalData.status === 'under review' ? 'under_review' : modalData.status;
        supabase.functions.invoke('merchant-application-notify', {
          body: { application_id: selectedApp.id, status: mappedStatus, admin_notes: modalData.adminNotes || undefined }
        }).catch(() => {});
      }

      await fetchApplications();
      closeModal();
      alert('Application updated successfully!');
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      'under review': 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    const icons = {
      pending: Clock,
      'under review': FileText,
      approved: CheckCircle,
      rejected: XCircle,
    };

    const Icon = icons[status as keyof typeof icons] || FileText;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Merchant Processing Applications</h1>
            <p className="text-sm text-gray-600 mt-1">Review and manage merchant application submissions</p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by application number, business name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{app.application_number}</span>
                          {app.is_high_risk && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">High Risk</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{app.legal_business_name}</div>
                        {app.dba_name && <div className="text-xs text-gray-500">DBA: {app.dba_name}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.contact_first_name} {app.contact_last_name}</div>
                        <div className="text-xs text-gray-500">{app.business_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.monthly_volume ? `$${app.monthly_volume.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => openModal(app.id)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          </div>
        </div>
      </div>

      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <p className="text-sm text-gray-600">{selectedApp.application_number}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500">Legal Business Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.legal_business_name}</p>
                    </div>
                    {selectedApp.dba_name && (
                      <div>
                        <p className="text-xs text-gray-500">DBA Name</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApp.dba_name}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Business Type</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.business_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tax ID</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.tax_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Industry</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.industry_category || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.website_url || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500">Primary Contact</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedApp.contact_first_name} {selectedApp.contact_last_name}
                      </p>
                      {selectedApp.contact_title && (
                        <p className="text-xs text-gray-600">{selectedApp.contact_title}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.contact_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.contact_phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Business Phone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.business_phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500">Monthly Volume</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedApp.monthly_volume ? `$${selectedApp.monthly_volume.toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Average Ticket</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedApp.average_ticket ? `$${selectedApp.average_ticket.toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Highest Ticket</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedApp.highest_ticket ? `$${selectedApp.highest_ticket.toLocaleString()}` : 'N/A'}
                      </p>
                    </div>
                    {selectedApp.pricing_structure && (
                      <div>
                        <p className="text-xs text-gray-500">Pricing Structure</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApp.pricing_structure}</p>
                      </div>
                    )}
                    {selectedApp.processor && (
                      <div>
                        <p className="text-xs text-gray-500">Processor</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApp.processor}</p>
                      </div>
                    )}
                    {selectedApp.gateway && (
                      <div>
                        <p className="text-xs text-gray-500">Gateway</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApp.gateway}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedApp.merchant_application_equipment?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2">Type</th>
                            <th className="text-left py-2">Model</th>
                            <th className="text-right py-2">Quantity</th>
                            <th className="text-right py-2">Unit Price</th>
                            <th className="text-right py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedApp.merchant_application_equipment.map((eq: any) => (
                            <tr key={eq.id} className="border-b border-gray-100">
                              <td className="py-2">{eq.equipment_type}</td>
                              <td className="py-2">{eq.equipment_model}</td>
                              <td className="text-right py-2">{eq.quantity}</td>
                              <td className="text-right py-2">${eq.unit_price.toFixed(2)}</td>
                              <td className="text-right py-2 font-medium">${eq.total_price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedApp.is_high_risk && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      Risk Assessment
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">High Risk</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-red-50 rounded-lg p-4">
                      {selectedApp.average_chargeback_rate && (
                        <div>
                          <p className="text-xs text-gray-500">Chargeback Rate</p>
                          <p className="text-sm font-medium text-gray-900">{selectedApp.average_chargeback_rate}%</p>
                        </div>
                      )}
                      {selectedApp.average_refund_rate && (
                        <div>
                          <p className="text-xs text-gray-500">Refund Rate</p>
                          <p className="text-sm font-medium text-gray-900">{selectedApp.average_refund_rate}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500">Bank Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.bank_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Type</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{selectedApp.bank_account_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Routing Number</p>
                      <p className="text-sm font-medium text-gray-900">{selectedApp.bank_routing_number}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Number</p>
                      <p className="text-sm font-medium text-gray-900">****{selectedApp.bank_account_number.slice(-4)}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrative Actions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={modalData.status}
                        onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="under review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">VAR Information</label>
                      <textarea
                        value={modalData.varInfo}
                        onChange={(e) => setModalData({ ...modalData, varInfo: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Enter VAR details upon approval..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gateway Information</label>
                      <textarea
                        value={modalData.gatewayInfo}
                        onChange={(e) => setModalData({ ...modalData, gatewayInfo: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Enter gateway credentials and setup info..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                      <textarea
                        value={modalData.adminNotes}
                        onChange={(e) => setModalData({ ...modalData, adminNotes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Internal notes about this application..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {updating ? 'Updating...' : 'Update Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
