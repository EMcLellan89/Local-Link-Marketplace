import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';
import { apiPost } from '../../lib/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface JobTicket {
  id: string;
  title: string;
  description: string;
  requirements: string;
  deliverables: string;
  payout_cents: number;
  status: string;
  submission_notes: string | null;
  proof_urls: string[] | null;
  submitted_at: string | null;
  exec_cases: {
    org_id: string;
    exec_products: {
      name: string;
    };
  };
}

export default function AdminJobReviewPage() {
  const [jobs, setJobs] = useState<JobTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const { data, error } = await supabaseBrowser
        .from('job_tickets')
        .select('*, exec_cases(org_id, exec_products(name))')
        .eq('status', 'in_review')
        .order('submitted_at', { ascending: true });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(jobId: string, decision: 'approve' | 'reject') {
    try {
      setProcessing(jobId);
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await apiPost('jobs-review', {
        job_ticket_id: jobId,
        admin_user_id: user.id,
        decision,
        notes: '',
      });

      await loadJobs();
      alert(`Job ${decision}d successfully!`);
    } catch (err) {
      console.error('Failed to review job:', err);
      alert('Failed to review job. Please try again.');
    } finally {
      setProcessing(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading jobs for review...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Job Review Dashboard
        </h1>

        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No jobs pending review.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {(job.exec_cases as any)?.exec_products?.name || 'Unknown Product'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Org ID: {(job.exec_cases as any)?.org_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${(job.payout_cents / 100).toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {job.submitted_at ? new Date(job.submitted_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Description</h4>
                    <p className="text-sm text-gray-700">{job.description}</p>
                  </div>

                  {job.requirements && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Requirements</h4>
                      <p className="text-sm text-gray-700">{job.requirements}</p>
                    </div>
                  )}

                  {job.deliverables && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Deliverables</h4>
                      <p className="text-sm text-gray-700">{job.deliverables}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Submission Notes</h4>
                    <p className="text-sm text-blue-800">{job.submission_notes || 'No notes provided'}</p>
                    
                    {job.proof_urls && job.proof_urls.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-semibold text-blue-900 mb-1">Proof URLs:</h5>
                        {job.proof_urls.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:underline"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleReview(job.id, 'approve')}
                    disabled={processing === job.id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {processing === job.id ? 'Processing...' : 'Approve & Pay'}
                  </Button>
                  <Button
                    onClick={() => handleReview(job.id, 'reject')}
                    disabled={processing === job.id}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
