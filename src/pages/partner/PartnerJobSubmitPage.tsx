import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  service_product_key: string;
  budget: number;
  due_at: string;
  status: string;
  created_at: string;
  merchant: {
    business_name: string;
  };
}

interface JobAssignment {
  id: string;
  status: string;
  assigned_at: string;
  auto_assigned: boolean;
  score_at_assignment: number;
}

interface Deliverable {
  id: string;
  file_url: string;
  note: string;
  status: string;
  submitted_at: string;
  reviewed_at: string;
  merchant_feedback: string;
}

export default function PartnerJobSubmitPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [assignment, setAssignment] = useState<JobAssignment | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [fileUrl, setFileUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get partner ID
      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!partner) throw new Error('Partner profile not found');

      // Get job details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select(`
          *,
          merchants!inner(business_name)
        `)
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      setJob({
        ...jobData,
        merchant: jobData.merchants,
      });

      // Get assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('job_assignments')
        .select('*')
        .eq('job_id', jobId)
        .eq('partner_id', partner.id)
        .single();

      if (assignmentError) throw new Error('You are not assigned to this job');

      setAssignment(assignmentData);

      // Get existing deliverables
      const { data: deliverablesData, error: deliverablesError } = await supabase
        .from('job_deliverables')
        .select('*')
        .eq('job_id', jobId)
        .eq('partner_id', partner.id)
        .order('submitted_at', { ascending: false });

      if (deliverablesError) throw deliverablesError;

      setDeliverables(deliverablesData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!partner) throw new Error('Partner profile not found');

      // Insert deliverable
      const { error: insertError } = await supabase
        .from('job_deliverables')
        .insert({
          job_id: jobId,
          partner_id: partner.id,
          file_url: fileUrl,
          note: notes,
          status: 'pending',
        });

      if (insertError) throw insertError;

      // Update assignment status
      await supabase
        .from('job_assignments')
        .update({ status: 'submitted' })
        .eq('id', assignment?.id);

      // Update job status
      await supabase
        .from('jobs')
        .update({ status: 'submitted' })
        .eq('id', jobId);

      setSuccess('Deliverable submitted successfully!');
      setFileUrl('');
      setNotes('');

      // Reload data
      await loadJobDetails();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const canSubmit = assignment?.status !== 'completed' && assignment?.status !== 'cancelled';

  if (loading) {
    return (
      <PartnerHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading job details...</div>
        </div>
      </PartnerHubLayout>
    );
  }

  if (error && !job) {
    return (
      <PartnerHubLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Error</h2>
            </div>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => navigate('/partner/jobs')} className="mt-4">
              Back to Jobs
            </Button>
          </Card>
        </div>
      </PartnerHubLayout>
    );
  }

  return (
    <PartnerHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate('/partner/jobs')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        {/* Job Details */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
              <p className="text-gray-600 mt-1">Client: {job?.merchant.business_name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Budget</div>
              <div className="text-2xl font-bold text-green-600">
                ${job?.budget ? (job.budget / 100).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700">{job?.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div>
              <div className="text-sm text-gray-500">Service</div>
              <div className="font-medium">{job?.service_product_key}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Due Date</div>
              <div className="font-medium">
                {job?.due_at ? new Date(job.due_at).toLocaleDateString() : 'Not specified'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-medium capitalize">{job?.status}</div>
            </div>
            {assignment?.auto_assigned && (
              <div>
                <div className="text-sm text-gray-500">Assignment Score</div>
                <div className="font-medium">{assignment.score_at_assignment}/100</div>
              </div>
            )}
          </div>
        </Card>

        {/* Submit Deliverable Form */}
        {canSubmit && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Submit Deliverable
            </h2>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitDeliverable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File URL *
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Share a link to your completed work (Google Drive, Dropbox, etc.)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any notes or instructions for the client..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting || !fileUrl}
                className="w-full"
              >
                {submitting ? 'Submitting...' : 'Submit Deliverable'}
              </Button>
            </form>
          </Card>
        )}

        {/* Previous Deliverables */}
        {deliverables.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Submission History
            </h2>

            <div className="space-y-4">
              {deliverables.map((deliverable) => (
                <div key={deliverable.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(deliverable.status)}
                        <span className="text-sm text-gray-500">
                          Submitted {new Date(deliverable.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                      {deliverable.reviewed_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          Reviewed {new Date(deliverable.reviewed_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <a
                    href={deliverable.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center space-x-1"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Deliverable</span>
                  </a>

                  {deliverable.note && (
                    <p className="text-sm text-gray-700 mt-2">{deliverable.note}</p>
                  )}

                  {deliverable.merchant_feedback && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        Client Feedback
                      </div>
                      <p className="text-sm text-gray-700">{deliverable.merchant_feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PartnerHubLayout>
  );
}
