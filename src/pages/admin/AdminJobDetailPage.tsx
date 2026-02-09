import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';
import { ArrowLeft, CheckCircle, User, DollarSign } from 'lucide-react';

type Job = {
  id: string;
  merchant_id: string;
  service_product_key: string;
  title: string;
  description: string | null;
  budget: number | null;
  status: string;
  created_at: string;
};

type Partner = {
  id: string;
  tier: string;
  status: string;
};

type Assignment = {
  id: string;
  job_id: string;
  partner_id: string;
  status: string;
};

type Application = {
  id: string;
  job_id: string;
  partner_id: string;
  message: string | null;
  status: string;
  created_at: string;
};

export default function AdminJobDetailPage() {
  const { job_id } = useParams<{ job_id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [grossAmount, setGrossAmount] = useState<number | ''>('');
  const [performedBy, setPerformedBy] = useState<'internal' | 'partner' | 'other_partner'>('partner');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const functionsUrl = import.meta.env.VITE_SUPABASE_URL?.replace('.supabase.co', '.supabase.co/functions/v1');

  useEffect(() => {
    if (job_id) {
      loadJobData();
    }
  }, [job_id]);

  const loadJobData = async () => {
    try {
      setLoading(true);

      // Load job
      const { data: jobData, error: jErr } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', job_id!)
        .single();

      if (jErr) throw jErr;
      setJob(jobData);

      // Load assignment if any
      const { data: assignmentData } = await supabase
        .from('job_assignments')
        .select('*')
        .eq('job_id', job_id!)
        .maybeSingle();

      setAssignment(assignmentData);
      if (assignmentData?.partner_id) {
        setSelectedPartner(assignmentData.partner_id);
      }

      // Load applications
      const { data: appsData } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', job_id!)
        .order('created_at', { ascending: false });

      setApplications(appsData || []);

      // Load active partners
      const { data: partnersData, error: pErr } = await supabase
        .from('partners')
        .select('id,tier,status')
        .eq('status', 'Active')
        .order('created_at', { ascending: false })
        .limit(300);

      if (pErr) throw pErr;
      setPartners(partnersData || []);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const defaultGross = useMemo(() => {
    if (!job) return '';
    return job.budget || '';
  }, [job]);

  useEffect(() => {
    if (grossAmount === '' && defaultGross !== '') {
      setGrossAmount(Number(defaultGross));
    }
  }, [defaultGross]);

  const assignToPartner = async () => {
    if (!selectedPartner) {
      setMessage({ type: 'error', text: 'Please select a partner to assign' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (assignment) {
        const { error } = await supabase
          .from('job_assignments')
          .update({ partner_id: selectedPartner, status: 'assigned' })
          .eq('id', assignment.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('job_assignments')
          .insert({
            job_id: job_id!,
            partner_id: selectedPartner,
            assigned_by_admin_id: user.id,
            status: 'assigned',
          });

        if (error) throw error;
      }

      await supabase.from('jobs').update({ status: 'assigned' }).eq('id', job_id!);

      setMessage({ type: 'success', text: 'Successfully assigned partner!' });
      await loadJobData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const approveJob = async () => {
    if (!functionsUrl) {
      setMessage({ type: 'error', text: 'Functions URL not configured' });
      return;
    }

    if (!job) return;

    const gross = Number(grossAmount);
    if (!gross || gross <= 0) {
      setMessage({ type: 'error', text: 'Enter a gross amount > 0' });
      return;
    }

    let worker_partner_id: string | undefined = undefined;

    if (performedBy !== 'internal') {
      worker_partner_id = selectedPartner || assignment?.partner_id || undefined;
      if (!worker_partner_id) {
        setMessage({ type: 'error', text: 'Select/assign a partner worker before approving' });
        return;
      }
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(`${functionsUrl}/job-approve-payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          job_id: job.id,
          gross_amount: gross,
          performed_by: performedBy,
          worker_partner_id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || res.statusText);
      }

      setMessage({
        type: 'success',
        text: `Approved! Worker: $${data.worker_amount} | Sourcing: $${data.sourcing_amount} | Upline: $${data.upline_amount} | Platform: $${data.platform_amount}`,
      });

      await loadJobData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const assignFromApplication = async (applicantId: string) => {
    setSubmitting(true);
    setMessage(null);

    try {
      setSelectedPartner(applicantId);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (assignment) {
        const { error } = await supabase
          .from('job_assignments')
          .update({ partner_id: applicantId, status: 'assigned' })
          .eq('id', assignment.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('job_assignments')
          .insert({
            job_id: job_id!,
            partner_id: applicantId,
            assigned_by_admin_id: user.id,
            status: 'assigned',
          });

        if (error) throw error;
      }

      await supabase.from('jobs').update({ status: 'assigned' }).eq('id', job_id!);
      await supabase.from('job_applications').update({ status: 'accepted' }).eq('id', applicantId).eq('job_id', job_id!);

      setMessage({ type: 'success', text: 'Successfully assigned partner from application!' });
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
          onClick={() => navigate('/admin/jobs')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
          <p className="text-slate-600 mt-2">
            {job.service_product_key} • Merchant: {job.merchant_id.slice(0, 8)}...
          </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Job Details</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Description</label>
                    <p className="text-slate-900 whitespace-pre-wrap mt-1">
                      {job.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Status</label>
                      <p className="text-slate-900 font-semibold mt-1">{job.status}</p>
                    </div>
                    {job.budget && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Budget</label>
                        <p className="text-slate-900 font-semibold mt-1">${job.budget.toLocaleString()}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-slate-600">Created</label>
                      <p className="text-slate-900 mt-1">
                        {new Date(job.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {applications.length > 0 && (
              <Card variant="bordered">
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Applications ({applications.length})</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-400" />
                              <span className="font-medium text-slate-900">
                                {app.partner_id.slice(0, 8)}...
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  app.status === 'accepted'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {app.status}
                              </span>
                            </div>
                            {app.message && (
                              <p className="text-sm text-slate-600 mt-2">{app.message}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {app.status === 'applied' && !assignment && (
                            <Button
                              size="sm"
                              onClick={() => assignFromApplication(app.partner_id)}
                              disabled={submitting}
                            >
                              Assign
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Assignment</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Assign to Partner
                    </label>
                    <select
                      value={selectedPartner}
                      onChange={(e) => setSelectedPartner(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select partner...</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id.slice(0, 8)}... • {p.tier}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    fullWidth
                    onClick={assignToPartner}
                    disabled={submitting || !selectedPartner}
                  >
                    {assignment ? 'Update Assignment' : 'Assign Partner'}
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Approve & Payout</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Performed by
                    </label>
                    <select
                      value={performedBy}
                      onChange={(e) => setPerformedBy(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="partner">Assigned Partner</option>
                      <option value="other_partner">Other Partner</option>
                      <option value="internal">Internal Team</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gross Amount ($)
                    </label>
                    <Input
                      type="number"
                      value={grossAmount}
                      onChange={(e) => setGrossAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="500.00"
                    />
                  </div>

                  <Button
                    fullWidth
                    onClick={approveJob}
                    disabled={submitting || !grossAmount || job.status === 'approved'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Job & Create Payout
                  </Button>

                  {job.status === 'approved' && (
                    <p className="text-sm text-green-600 text-center">
                      Job already approved
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
