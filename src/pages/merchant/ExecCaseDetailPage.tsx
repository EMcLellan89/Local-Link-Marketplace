import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabaseBrowser } from '../../lib/supabase-browser';
import { requireOrgId } from '../../lib/org';
import Card from '../../components/ui/Card';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ExecCase {
  id: string;
  status: string;
  created_at: string;
  score_json: any;
  exec_products: {
    name: string;
    description: string;
  };
}

interface TimelineEvent {
  id: string;
  event: string;
  detail: any;
  created_at: string;
}

interface JobTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  payout_cents: number;
  claimed_by: string | null;
}

export default function ExecCaseDetailPage() {
  const { id } = useParams();
  const [execCase, setExecCase] = useState<ExecCase | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [jobs, setJobs] = useState<JobTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCase();
    loadTimeline();
    loadJobs();
  }, [id]);

  async function loadCase() {
    try {
      const { data, error } = await supabaseBrowser
        .from('exec_cases')
        .select('id, status, created_at, score_json, exec_products(name, description)')
        .eq('id', id!)
        .eq('org_id', requireOrgId())
        .single();

      if (error) throw error;
      setExecCase(data);
    } catch (err) {
      console.error('Failed to load case:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadTimeline() {
    try {
      const { data, error } = await supabaseBrowser
        .from('exec_case_timeline')
        .select('*')
        .eq('exec_case_id', id!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimeline(data || []);
    } catch (err) {
      console.error('Failed to load timeline:', err);
    }
  }

  async function loadJobs() {
    try {
      const { data, error } = await supabaseBrowser
        .from('job_tickets')
        .select('*')
        .eq('exec_case_id', id!)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  }

  function getJobStatusIcon(status: string) {
    switch (status) {
      case 'open':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'claimed':
      case 'in_review':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading case details...</div>
      </div>
    );
  }

  if (!execCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Case not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {(execCase.exec_products as any)?.name}
          </h1>
          <p className="text-gray-600">
            {(execCase.exec_products as any)?.description}
          </p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Status: </span>
            <span className="font-medium text-gray-900">{execCase.status.replace('_', ' ').toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Implementation Jobs</h2>
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <Card className="p-6 text-center text-gray-500">
                  Jobs are being generated...
                </Card>
              ) : (
                jobs.map((job) => (
                  <Card key={job.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getJobStatusIcon(job.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            Status: <span className="font-medium">{job.status.replace('_', ' ')}</span>
                          </span>
                          <span className="text-gray-500">
                            Payout: ${(job.payout_cents / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              {timeline.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.event}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
