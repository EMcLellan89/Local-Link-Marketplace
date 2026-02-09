import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import BackButton from '../../components/ui/BackButton';
import { Briefcase, Calendar, DollarSign } from 'lucide-react';

type JobRow = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  merchant_id: string;
  service_product_key: string;
  budget: number | null;
};

export default function AdminJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id,title,status,created_at,merchant_id,service_product_key,budget')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setJobs(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = filter === 'all'
    ? jobs
    : jobs.filter(j => j.status === filter);

  const statusCounts = {
    open: jobs.filter(j => j.status === 'open').length,
    assigned: jobs.filter(j => j.status === 'assigned').length,
    in_progress: jobs.filter(j => j.status === 'in_progress').length,
    submitted: jobs.filter(j => j.status === 'submitted').length,
    approved: jobs.filter(j => j.status === 'approved').length,
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
          <h1 className="text-3xl font-bold text-slate-900">Job Management</h1>
          <p className="text-slate-600 mt-2">
            Manage merchant "Have Local-Link do it" requests and partner assignments
          </p>
        </div>

        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <p className="text-red-800 font-medium">{error}</p>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Open</p>
                  <p className="text-2xl font-bold text-slate-900">{statusCounts.open}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Assigned</p>
                  <p className="text-2xl font-bold text-slate-900">{statusCounts.assigned}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">In Progress</p>
                  <p className="text-2xl font-bold text-slate-900">{statusCounts.in_progress}</p>
                </div>
                <Briefcase className="w-8 h-8 text-orange-600" />
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Submitted</p>
                  <p className="text-2xl font-bold text-slate-900">{statusCounts.submitted}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Approved</p>
                  <p className="text-2xl font-bold text-slate-900">{statusCounts.approved}</p>
                </div>
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({jobs.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'open'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Open ({statusCounts.open})
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'submitted'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Submitted ({statusCounts.submitted})
          </button>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Jobs Queue</h2>
          </CardHeader>
          <CardBody>
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No jobs found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => navigate(`/admin/jobs/${job.id}`)}
                    className="w-full text-left p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{job.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {job.service_product_key} • Merchant: {job.merchant_id.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === 'open'
                              ? 'bg-blue-100 text-blue-700'
                              : job.status === 'assigned'
                              ? 'bg-yellow-100 text-yellow-700'
                              : job.status === 'in_progress'
                              ? 'bg-orange-100 text-orange-700'
                              : job.status === 'submitted'
                              ? 'bg-purple-100 text-purple-700'
                              : job.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {job.status}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                        {job.budget && (
                          <p className="text-sm text-slate-700 mt-1">
                            ${job.budget.toLocaleString()}
                          </p>
                        )}
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
