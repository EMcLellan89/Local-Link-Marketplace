import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';
import { ArrowLeft, CheckCircle, Upload, Send } from 'lucide-react';

type Job = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  service_product_key: string;
  budget: number | null;
};

type Assignment = {
  id: string;
  job_id: string;
  partner_id: string;
  status: string;
};

export default function PartnerJobDetailPage() {
  const { job_id } = useParams<{ job_id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableNote, setDeliverableNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (job_id) {
      loadJobData();
    }
  }, [job_id]);

  const loadJobData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: jobData, error: jErr } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', job_id!)
        .single();

      if (jErr) throw jErr;
      setJob(jobData);

      const { data: assignmentData } = await supabase
        .from('job_assignments')
        .select('*')
        .eq('job_id', job_id!)
        .eq('partner_id', user.id)
        .maybeSingle();

      setAssignment(assignmentData);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: job_id!,
          partner_id: user.id,
          message: applicationMessage.trim() || null,
          status: 'applied',
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Application submitted! Admin will review and may assign you to this job.' });
      setApplicationMessage('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const submitDeliverable = async () => {
    if (!deliverableUrl.trim()) {
      setMessage({ type: 'error', text: 'Please provide a deliverable URL' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('job_deliverables')
        .insert({
          job_id: job_id!,
          partner_id: user.id,
          file_url: deliverableUrl.trim(),
          note: deliverableNote.trim() || null,
        });

      if (error) throw error;

      await supabase
        .from('job_assignments')
        .update({ status: 'submitted' })
        .eq('id', assignment!.id);

      await supabase
        .from('jobs')
        .update({ status: 'submitted' })
        .eq('id', job_id!);

      setMessage({ type: 'success', text: 'Deliverable submitted! Admin will review and approve payment.' });
      setDeliverableUrl('');
      setDeliverableNote('');
      await loadJobData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !job) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate('/partner/job-board')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Board
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-slate-600">
            <span>{job.service_product_key}</span>
            <span>•</span>
            <span>{new Date(job.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.status === 'open'
                  ? 'bg-blue-100 text-blue-700'
                  : job.status === 'assigned'
                  ? 'bg-yellow-100 text-yellow-700'
                  : job.status === 'in_progress'
                  ? 'bg-orange-100 text-orange-700'
                  : job.status === 'submitted'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {job.status}
            </span>
          </div>
        </div>

        {message && (
          <Card
            variant="bordered"
            className={message.type === 'error' ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}
          >
            <CardBody>
              <p className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>{message.text}</p>
            </CardBody>
          </Card>
        )}

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Job Description</h2>
          </CardHeader>
          <CardBody>
            <p className="text-slate-700 whitespace-pre-wrap">
              {job.description || 'No description provided'}
            </p>
            {job.budget && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">Budget</p>
                <p className="text-2xl font-bold text-slate-900">${job.budget.toLocaleString()}</p>
              </div>
            )}
          </CardBody>
        </Card>

        {!assignment ? (
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Apply for This Job</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Why are you a good fit? (Optional)
                  </label>
                  <textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    rows={6}
                    placeholder="Share your relevant experience, timeline, and why you're the right person for this job..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button
                  fullWidth
                  onClick={applyToJob}
                  disabled={submitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card variant="bordered" className="border-green-300">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-slate-900">You Are Assigned</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <p className="text-slate-600">
                  Assignment status: <span className="font-semibold">{assignment.status}</span>
                </p>

                {assignment.status !== 'submitted' && assignment.status !== 'completed' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Deliverable Link <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="url"
                        value={deliverableUrl}
                        onChange={(e) => setDeliverableUrl(e.target.value)}
                        placeholder="https://drive.google.com/... or https://dropbox.com/..."
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Share a link to Google Drive, Dropbox, or any other file hosting service
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={deliverableNote}
                        onChange={(e) => setDeliverableNote(e.target.value)}
                        rows={4}
                        placeholder="Describe what you did, how to use it, next steps, etc..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <Button
                      fullWidth
                      onClick={submitDeliverable}
                      disabled={submitting || !deliverableUrl.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Deliverable
                    </Button>
                  </>
                )}

                {(assignment.status === 'submitted' || assignment.status === 'completed') && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      ✓ Deliverable submitted! Waiting for admin review and approval.
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
