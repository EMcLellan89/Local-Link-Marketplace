import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import BackButton from '../../components/ui/BackButton';
import { Briefcase, DollarSign, Calendar } from 'lucide-react';

type Job = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  service_product_key: string;
  budget: number | null;
};

export default function PartnerJobBoardPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'my_jobs'>('all');

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (filter === 'my_jobs') {
        // Load jobs assigned to me
        const { data: assignments } = await supabase
          .from('job_assignments')
          .select('job_id')
          .eq('partner_id', user.id);

        if (!assignments || assignments.length === 0) {
          setJobs([]);
          return;
        }

        const jobIds = assignments.map(a => a.job_id);

        const { data, error } = await supabase
          .from('jobs')
          .select('id,title,description,status,created_at,service_product_key,budget')
          .in('id', jobIds)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } else {
        const { data, error } = await supabase
          .from('jobs')
          .select('id,title,description,status,created_at,service_product_key,budget')
          .in('status', filter === 'open' ? ['open'] : ['open', 'assigned', 'in_progress', 'submitted'])
          .order('created_at', { ascending: false })
          .limit(200);

        if (error) throw error;
        setJobs(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Job Board</h1>
          <p className="text-slate-600 mt-2">
            Apply for open jobs or manage your assigned work
          </p>
        </div>

        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <p className="text-red-800 font-medium">{error}</p>
            </CardBody>
          </Card>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'open'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Open Jobs
          </button>
          <button
            onClick={() => setFilter('my_jobs')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'my_jobs'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            My Jobs
          </button>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Available Opportunities</h2>
          </CardHeader>
          <CardBody>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  {filter === 'open' ? 'No open jobs available' : filter === 'my_jobs' ? 'You have no assigned jobs' : 'No jobs found'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => navigate(`/partner/job-board/${job.id}`)}
                    className="w-full text-left border border-slate-200 rounded-lg p-4 hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.service_product_key}
                          </span>
                        </p>
                        {job.description && (
                          <p className="text-sm text-slate-700 mt-2 line-clamp-2">
                            {job.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                          {job.budget && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${job.budget.toLocaleString()} budget
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
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
                  </button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
