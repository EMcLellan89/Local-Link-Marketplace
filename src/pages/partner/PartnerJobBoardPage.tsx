import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseBrowser } from '../../lib/supabase-browser';
import Card from '../../components/ui/Card';

interface JobTicket {
  id: string;
  title: string;
  description: string;
  requirements: string;
  deliverables: string;
  payout_cents: number;
  status: string;
  created_at: string;
  exec_cases: {
    exec_products: {
      name: string;
    };
  };
}

export default function PartnerJobBoardPage() {
  const navigate = useNavigate();
  const [openJobs, setOpenJobs] = useState<JobTicket[]>([]);
  const [myJobs, setMyJobs] = useState<JobTicket[]>([]);
  const [activeTab, setActiveTab] = useState<'open' | 'mine'>('open');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      const { data: openData, error: openError } = await supabaseBrowser
        .from('job_tickets')
        .select('*, exec_cases(exec_products(name))')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (openError) throw openError;
      setOpenJobs(openData || []);

      const { data: myData, error: myError } = await supabaseBrowser
        .from('job_tickets')
        .select('*, exec_cases(exec_products(name))')
        .eq('claimed_by', user.id)
        .in('status', ['claimed', 'in_review', 'approved', 'paid'])
        .order('created_at', { ascending: false });

      if (myError) throw myError;
      setMyJobs(myData || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  function JobCard({ job }: { job: JobTicket }) {
    return (
      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => navigate(`/partner/jobs/${job.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-500">
              {(job.exec_cases as any)?.exec_products?.name || 'Unknown Product'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${(job.payout_cents / 100).toFixed(2)}
            </div>
            {job.status !== 'open' && (
              <div className="text-xs text-gray-500 mt-1">
                {job.status.replace('_', ' ').toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-700 mb-4">{job.description}</p>

        {job.requirements && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Requirements:</h4>
            <p className="text-sm text-gray-600">{job.requirements}</p>
          </div>
        )}

        {job.deliverables && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Deliverables:</h4>
            <p className="text-sm text-gray-600">{job.deliverables}</p>
          </div>
        )}
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading job board...</div>
      </div>
    );
  }

  const jobs = activeTab === 'open' ? openJobs : myJobs;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Partner Job Board</h1>

        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'open'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Open Jobs ({openJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'mine'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Jobs ({myJobs.length})
          </button>
        </div>

        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">
              {activeTab === 'open'
                ? 'No open jobs available at the moment.'
                : 'You have not claimed any jobs yet.'}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
