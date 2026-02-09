import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseBrowser } from '../../lib/supabase-browser';
import { apiPost } from '../../lib/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface JobTicket {
  id: string;
  title: string;
  description: string;
  requirements: string;
  deliverables: string;
  payout_cents: number;
  status: string;
  claimed_by: string | null;
  submission_notes: string | null;
  proof_urls: string[] | null;
  exec_cases: {
    exec_products: {
      name: string;
    };
  };
}

export default function PartnerJobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  useEffect(() => {
    loadJob();
  }, [id]);

  async function loadJob() {
    try {
      const { data, error } = await supabaseBrowser
        .from('job_tickets')
        .select('*, exec_cases(exec_products(name))')
        .eq('id', id!)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (err) {
      console.error('Failed to load job:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim() {
    try {
      setClaiming(true);
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await apiPost('jobs-claim', {
        job_ticket_id: id!,
        partner_user_id: user.id,
      });

      await loadJob();
      alert('Job claimed successfully!');
    } catch (err) {
      console.error('Failed to claim job:', err);
      alert('Failed to claim job. It may have already been claimed by another partner.');
    } finally {
      setClaiming(false);
    }
  }

  async function handleSubmit() {
    try {
      if (!submissionNotes.trim()) {
        alert('Please provide submission notes');
        return;
      }

      setSubmitting(true);
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const proofUrls = proofUrl.trim() ? [proofUrl.trim()] : [];

      await apiPost('jobs-submit', {
        job_ticket_id: id!,
        partner_user_id: user.id,
        submission_notes: submissionNotes,
        proof_urls: proofUrls,
      });

      await loadJob();
      alert('Job submitted for review!');
      setSubmissionNotes('');
      setProofUrl('');
    } catch (err) {
      console.error('Failed to submit job:', err);
      alert('Failed to submit job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Job not found</div>
      </div>
    );
  }

  const canClaim = job.status === 'open';
  const isClaimed = job.claimed_by !== null;
  const { data: { user } } = supabaseBrowser.auth.getUser();
  const isMyJob = job.claimed_by === (user as any)?.id;
  const canSubmit = isMyJob && job.status === 'claimed';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/partner/job-board')}
          className="mb-6"
        >
          Back to Job Board
        </Button>

        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-gray-600">
                {(job.exec_cases as any)?.exec_products?.name || 'Unknown Product'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${(job.payout_cents / 100).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                Status: {job.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{job.description}</p>
            </div>

            {job.requirements && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
                <p className="text-gray-700">{job.requirements}</p>
              </div>
            )}

            {job.deliverables && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deliverables</h3>
                <p className="text-gray-700">{job.deliverables}</p>
              </div>
            )}

            {canClaim && (
              <div className="pt-6 border-t">
                <Button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full"
                >
                  {claiming ? 'Claiming...' : 'Claim This Job'}
                </Button>
              </div>
            )}

            {canSubmit && (
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Work</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submission Notes
                    </label>
                    <textarea
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe what you've completed..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proof URL (optional)
                    </label>
                    <Input
                      type="url"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'Submitting...' : 'Submit for Review'}
                  </Button>
                </div>
              </div>
            )}

            {job.status === 'in_review' && isMyJob && (
              <div className="pt-6 border-t">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    Your submission is under review by the admin team.
                  </p>
                </div>
              </div>
            )}

            {job.status === 'paid' && isMyJob && (
              <div className="pt-6 border-t">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    This job has been approved and paid. Great work!
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
