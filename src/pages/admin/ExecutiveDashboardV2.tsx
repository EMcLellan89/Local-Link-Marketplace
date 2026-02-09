import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  Award,
  Activity,
} from 'lucide-react';

interface DashboardStats {
  totalPartners: number;
  activePartners: number;
  totalJobs: number;
  openJobs: number;
  assignedJobs: number;
  completedJobs: number;
  pendingDeliverables: number;
  autoAssignedJobs: number;
  avgPartnerScore: number;
  pendingCRMInstalls: number;
  totalRevenue: number;
  pendingPayouts: number;
}

interface TopPartner {
  id: string;
  business_name: string;
  total_score: number;
  active_job_count: number;
  certifications_score: number;
  activity_score: number;
  quality_score: number;
  availability_score: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: string;
}

export default function ExecutiveDashboardV2() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPartners: 0,
    activePartners: 0,
    totalJobs: 0,
    openJobs: 0,
    assignedJobs: 0,
    completedJobs: 0,
    pendingDeliverables: 0,
    autoAssignedJobs: 0,
    avgPartnerScore: 0,
    pendingCRMInstalls: 0,
    totalRevenue: 0,
    pendingPayouts: 0,
  });
  const [topPartners, setTopPartners] = useState<TopPartner[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get partner stats
      const { data: partners } = await supabase
        .from('partners')
        .select('id, status');

      const totalPartners = partners?.length || 0;
      const activePartners = partners?.filter((p) => p.status === 'active').length || 0;

      // Get job stats
      const { data: jobs } = await supabase.from('jobs').select('id, status');
      const totalJobs = jobs?.length || 0;
      const openJobs = jobs?.filter((j) => j.status === 'open').length || 0;
      const assignedJobs = jobs?.filter((j) => j.status === 'assigned').length || 0;
      const completedJobs = jobs?.filter((j) => j.status === 'approved').length || 0;

      // Get auto-assigned jobs count
      const { data: autoAssignments } = await supabase
        .from('job_assignments')
        .select('id')
        .eq('auto_assigned', true);
      const autoAssignedJobs = autoAssignments?.length || 0;

      // Get deliverables stats
      const { data: deliverables } = await supabase
        .from('job_deliverables')
        .select('id')
        .eq('status', 'pending');
      const pendingDeliverables = deliverables?.length || 0;

      // Get average partner score
      const { data: scores } = await supabase
        .from('partner_scores')
        .select('total_score');
      const avgPartnerScore =
        scores && scores.length > 0
          ? Math.round(scores.reduce((sum, s) => sum + s.total_score, 0) / scores.length)
          : 0;

      // Get CRM install queue stats
      const { data: crmQueue } = await supabase
        .from('crm_install_queue')
        .select('id')
        .eq('status', 'pending');
      const pendingCRMInstalls = crmQueue?.length || 0;

      // Get revenue and payout stats
      const { data: payouts } = await supabase
        .from('job_payouts')
        .select('gross_amount, status');
      const totalRevenue = payouts?.reduce((sum, p) => sum + (p.gross_amount || 0), 0) || 0;
      const pendingPayouts = payouts?.filter((p) => p.status === 'pending').length || 0;

      setStats({
        totalPartners,
        activePartners,
        totalJobs,
        openJobs,
        assignedJobs,
        completedJobs,
        pendingDeliverables,
        autoAssignedJobs,
        avgPartnerScore,
        pendingCRMInstalls,
        totalRevenue,
        pendingPayouts,
      });

      // Get top partners by score
      const { data: topPartnersData } = await supabase
        .from('partner_scores')
        .select(
          `
          *,
          partners!inner(id, business_name)
        `
        )
        .order('total_score', { ascending: false })
        .limit(5);

      setTopPartners(
        topPartnersData?.map((p) => ({
          id: p.partners.id,
          business_name: p.partners.business_name,
          total_score: p.total_score,
          active_job_count: p.active_job_count,
          certifications_score: p.certifications_score,
          activity_score: p.activity_score,
          quality_score: p.quality_score,
          availability_score: p.availability_score,
        })) || []
      );

      // Build recent activity (mock for now - would integrate with audit log)
      const activities: RecentActivity[] = [];

      // Add job submissions
      const { data: recentJobs } = await supabase
        .from('jobs')
        .select('id, title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(3);

      recentJobs?.forEach((job) => {
        activities.push({
          id: job.id,
          type: 'job',
          description: `New job created: ${job.title}`,
          timestamp: job.created_at,
          status: job.status,
        });
      });

      // Add recent deliverables
      const { data: recentDeliverables } = await supabase
        .from('job_deliverables')
        .select(
          `
          id,
          submitted_at,
          status,
          jobs!inner(title)
        `
        )
        .order('submitted_at', { ascending: false })
        .limit(3);

      recentDeliverables?.forEach((del) => {
        activities.push({
          id: del.id,
          type: 'deliverable',
          description: `Deliverable submitted for: ${del.jobs.title}`,
          timestamp: del.submitted_at,
          status: del.status,
        });
      });

      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 10));
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
          <div className={`text-3xl font-bold ${color}`}>{value}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
        <Icon className={`w-10 h-10 ${color.replace('text-', 'text-').replace('-600', '-500')} opacity-50`} />
      </div>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <Button onClick={loadDashboardData}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Partners"
            value={stats.activePartners}
            subtitle={`${stats.totalPartners} total`}
            icon={Users}
            color="text-blue-600"
          />
          <StatCard
            title="Open Jobs"
            value={stats.openJobs}
            subtitle={`${stats.completedJobs} completed`}
            icon={Briefcase}
            color="text-green-600"
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingDeliverables}
            subtitle="Awaiting approval"
            icon={Clock}
            color="text-yellow-600"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue / 100).toLocaleString()}`}
            subtitle={`${stats.pendingPayouts} pending payouts`}
            icon={DollarSign}
            color="text-purple-600"
          />
        </div>

        {/* Auto-Assignment & Scoring */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatCard
            title="Auto-Assigned Jobs"
            value={stats.autoAssignedJobs}
            subtitle={`${Math.round((stats.autoAssignedJobs / Math.max(stats.totalJobs, 1)) * 100)}% automation rate`}
            icon={Zap}
            color="text-orange-600"
          />
          <StatCard
            title="Avg Partner Score"
            value={`${stats.avgPartnerScore}/100`}
            subtitle="Platform average"
            icon={Target}
            color="text-indigo-600"
          />
          <StatCard
            title="CRM Installations"
            value={stats.pendingCRMInstalls}
            subtitle="In queue"
            icon={CheckCircle}
            color="text-teal-600"
          />
        </div>

        {/* Top Partners Leaderboard */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-500" />
              Top Partners by Score
            </h2>
            <Button variant="outline" onClick={() => window.location.href = '/admin/partners'}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {topPartners.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No partner scores available</div>
            ) : (
              topPartners.map((partner, index) => (
                <div key={partner.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{partner.business_name}</div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                      <span>Cert: {partner.certifications_score}</span>
                      <span>Activity: {partner.activity_score}</span>
                      <span>Quality: {partner.quality_score}</span>
                      <span>Avail: {partner.availability_score}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{partner.total_score}</div>
                    <div className="text-xs text-gray-500">{partner.active_job_count} active jobs</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
              Recent Activity
            </h2>
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No recent activity</div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border-l-4 border-gray-300 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.status === 'approved' || activity.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'pending' || activity.status === 'open'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button onClick={() => window.location.href = '/admin/deliverables-review'} className="w-full">
              Review Deliverables
            </Button>
            <Button onClick={() => window.location.href = '/admin/jobs'} variant="outline" className="w-full">
              Manage Jobs
            </Button>
            <Button onClick={() => window.location.href = '/admin/partners'} variant="outline" className="w-full">
              Partner Management
            </Button>
            <Button onClick={() => window.location.href = '/admin/payouts'} variant="outline" className="w-full">
              Process Payouts
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
