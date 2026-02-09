import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { CheckCircle, XCircle, FileText, Clock, AlertCircle, ExternalLink } from 'lucide-react';

interface Deliverable {
  id: string;
  file_url: string;
  note: string;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  merchant_feedback: string | null;
  job: {
    id: string;
    title: string;
    service_product_key: string;
    budget: number;
    merchant: {
      business_name: string;
    };
  };
  partner: {
    id: string;
    business_name: string;
  };
}

export default function AdminDeliverablesReview() {
  const navigate = useNavigate();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadDeliverables();
  }, [statusFilter]);

  const loadDeliverables = async () => {
    try {
      setLoading(true);
      setError('');

      const query = supabase
        .from('job_deliverables')
        .select(`
          *,
          jobs!inner(
            id,
            title,
            service_product_key,
            budget,
            merchants!inner(business_name)
          ),
          partners!inner(
            id,
            business_name
          )
        `)
        .order('submitted_at', { ascending: false });

      if (statusFilter !== 'all') {
        query.eq('status', statusFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setDeliverables(
        data?.map((d) => ({
          ...d,
          job: {
            ...d.jobs,
            merchant: d.jobs.merchants,
          },
          partner: d.partners,
        })) || []
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (deliverableId: string) => {
    setActionLoading(deliverableId);
    try {
      const deliverable = deliverables.find((d) => d.id === deliverableId);
      if (!deliverable) throw new Error('Deliverable not found');

      // Update deliverable status
      const { error: updateError } = await supabase
        .from('job_deliverables')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          merchant_feedback: feedback || 'Approved',
        })
        .eq('id', deliverableId);

      if (updateError) throw updateError;

      // Update job status to approved
      await supabase
        .from('jobs')
        .update({ status: 'approved' })
        .eq('id', deliverable.job.id);

      // Update assignment status
      await supabase
        .from('job_assignments')
        .update({ status: 'completed' })
        .eq('job_id', deliverable.job.id)
        .eq('partner_id', deliverable.partner.id);

      // Create payout record
      await supabase
        .from('job_payouts')
        .insert({
          job_id: deliverable.job.id,
          merchant_id: deliverable.job.merchant.id,
          worker_partner_id: deliverable.partner.id,
          gross_amount: deliverable.job.budget,
          worker_commission_rate: 0.70,
          worker_amount: deliverable.job.budget * 0.70,
          platform_amount: deliverable.job.budget * 0.30,
          status: 'pending',
        });

      setFeedback('');
      setSelectedDeliverable(null);
      await loadDeliverables();
    } catch (err: any) {
      alert(`Error approving deliverable: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestRevision = async (deliverableId: string) => {
    if (!feedback.trim()) {
      alert('Please provide feedback for the revision request');
      return;
    }

    setActionLoading(deliverableId);
    try {
      const deliverable = deliverables.find((d) => d.id === deliverableId);
      if (!deliverable) throw new Error('Deliverable not found');

      // Update deliverable status
      const { error: updateError } = await supabase
        .from('job_deliverables')
        .update({
          status: 'revision_requested',
          reviewed_at: new Date().toISOString(),
          merchant_feedback: feedback,
        })
        .eq('id', deliverableId);

      if (updateError) throw updateError;

      // Update assignment status back to in_progress
      await supabase
        .from('job_assignments')
        .update({ status: 'in_progress' })
        .eq('job_id', deliverable.job.id)
        .eq('partner_id', deliverable.partner.id);

      // Update job status
      await supabase
        .from('jobs')
        .update({ status: 'in_progress' })
        .eq('id', deliverable.job.id);

      setFeedback('');
      setSelectedDeliverable(null);
      await loadDeliverables();
    } catch (err: any) {
      alert(`Error requesting revision: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (deliverableId: string) => {
    if (!feedback.trim()) {
      alert('Please provide feedback for the rejection');
      return;
    }

    if (!confirm('Are you sure you want to reject this deliverable?')) {
      return;
    }

    setActionLoading(deliverableId);
    try {
      const deliverable = deliverables.find((d) => d.id === deliverableId);
      if (!deliverable) throw new Error('Deliverable not found');

      // Update deliverable status
      const { error: updateError } = await supabase
        .from('job_deliverables')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          merchant_feedback: feedback,
        })
        .eq('id', deliverableId);

      if (updateError) throw updateError;

      // Update job status to cancelled
      await supabase
        .from('jobs')
        .update({ status: 'cancelled' })
        .eq('id', deliverable.job.id);

      // Update assignment status
      await supabase
        .from('job_assignments')
        .update({ status: 'cancelled' })
        .eq('job_id', deliverable.job.id)
        .eq('partner_id', deliverable.partner.id);

      setFeedback('');
      setSelectedDeliverable(null);
      await loadDeliverables();
    } catch (err: any) {
      alert(`Error rejecting deliverable: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      revision_requested: 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const stats = {
    pending: deliverables.filter((d) => d.status === 'pending').length,
    approved: deliverables.filter((d) => d.status === 'approved').length,
    revision_requested: deliverables.filter((d) => d.status === 'revision_requested').length,
    rejected: deliverables.filter((d) => d.status === 'rejected').length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Deliverables Review</h1>
          <Button onClick={() => navigate('/admin/jobs')}>View All Jobs</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.revision_requested}</div>
                <div className="text-sm text-gray-600">Revision Requested</div>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {['pending', 'approved', 'revision_requested', 'rejected', 'all'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </Card>

        {/* Deliverables List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading deliverables...</div>
          </div>
        ) : error ? (
          <Card className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </Card>
        ) : deliverables.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No deliverables found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {deliverables.map((deliverable) => (
              <Card key={deliverable.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {deliverable.job.title}
                      </h3>
                      {getStatusBadge(deliverable.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Partner: <span className="font-medium">{deliverable.partner.business_name}</span></p>
                      <p>Client: <span className="font-medium">{deliverable.job.merchant.business_name}</span></p>
                      <p>Budget: <span className="font-medium text-green-600">${(deliverable.job.budget / 100).toFixed(2)}</span></p>
                      <p>Submitted: {new Date(deliverable.submitted_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Deliverable:</span>
                    <a
                      href={deliverable.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center space-x-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open File</span>
                    </a>
                  </div>
                  {deliverable.note && (
                    <p className="text-sm text-gray-700 mt-2">{deliverable.note}</p>
                  )}
                </div>

                {deliverable.merchant_feedback && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-xs font-medium text-blue-700 mb-1">Previous Feedback</div>
                    <p className="text-sm text-gray-700">{deliverable.merchant_feedback}</p>
                  </div>
                )}

                {deliverable.status === 'pending' && (
                  <div className="space-y-4">
                    {selectedDeliverable === deliverable.id ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Feedback
                          </label>
                          <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={3}
                            placeholder="Provide feedback for the partner..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleApprove(deliverable.id)}
                            disabled={actionLoading === deliverable.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve & Create Payout
                          </Button>
                          <Button
                            onClick={() => handleRequestRevision(deliverable.id)}
                            disabled={actionLoading === deliverable.id}
                            variant="outline"
                            className="border-orange-500 text-orange-600 hover:bg-orange-50"
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Request Revision
                          </Button>
                          <Button
                            onClick={() => handleReject(deliverable.id)}
                            disabled={actionLoading === deliverable.id}
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedDeliverable(null);
                              setFeedback('');
                            }}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        onClick={() => setSelectedDeliverable(deliverable.id)}
                        className="w-full"
                      >
                        Review Deliverable
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
