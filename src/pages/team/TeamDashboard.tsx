import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Users,
  DollarSign,
  Calendar,
  Plus,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  tasks_today: number;
  tasks_overdue: number;
  deals_to_close: number;
  companies_count: number;
  contacts_count: number;
  deals_value_cents: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: string;
  priority: string;
  status: string;
  due_date: string;
  company_name?: string;
  contact_name?: string;
}

interface Deal {
  id: string;
  deal_name: string;
  deal_value_cents: number;
  stage: string;
  probability: number;
  expected_close_date: string;
  company_name: string;
}

export default function TeamDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [upcomingDeals, setUpcomingDeals] = useState<Deal[]>([]);
  const [teamMemberId, setTeamMemberId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // Check if admin is logged in (admins have full access to team features)
      const adminToken = localStorage.getItem('admin_token');
      let isAdmin = false;
      let currentTeamMemberId: string | null = null;

      if (adminToken) {
        const { data } = await supabase
          .from('admin_sessions')
          .select('admin_user_id, expires_at, admin_users(id)')
          .eq('token', adminToken)
          .maybeSingle();

        if (data && new Date((data as any).expires_at) > new Date()) {
          isAdmin = true;
          // For admin, use a dummy team member ID to load all data
          currentTeamMemberId = 'admin-access';
          setTeamMemberId('admin-access');
        }
      }

      // If not admin, check for regular team member
      if (!isAdmin) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: teamMember } = await supabase
          .from('team_members')
          .select('id, role')
          .eq('user_id', user.id)
          .single();

        if (!teamMember) {
          console.error('Team member not found');
          setLoading(false);
          return;
        }

        // If user is a manager, redirect to manager dashboard
        if (teamMember.role === 'manager') {
          navigate('/team/manager');
          return;
        }

        currentTeamMemberId = teamMember.id;
        setTeamMemberId(teamMember.id);
      }

      // Skip RPC calls for admin - they'll see aggregate data
      if (!isAdmin && currentTeamMemberId) {
        const { data: statsData } = await supabase.rpc('get_team_dashboard_stats', {
          p_team_member_id: currentTeamMemberId
        });

        if (statsData) setStats(statsData);
      } else if (isAdmin) {
        // For admin, get aggregate stats
        const { data: statsData } = await supabase.rpc('get_team_dashboard_stats_admin');
        if (statsData) setStats(statsData);
      }

      // Load tasks - for admin, load all recent tasks; for team members, load their assigned tasks
      const tasksQuery = supabase
        .from('crm_tasks')
        .select(`
          id,
          title,
          description,
          task_type,
          priority,
          status,
          due_date,
          crm_companies(company_name),
          crm_contacts(first_name, last_name)
        `);

      if (!isAdmin && currentTeamMemberId) {
        tasksQuery.eq('assigned_to', currentTeamMemberId);
      }

      const { data: tasks } = await tasksQuery
        .neq('status', 'completed')
        .lte('due_date', new Date(new Date().setHours(23, 59, 59, 999)).toISOString())
        .order('due_date', { ascending: true })
        .limit(10);

      if (tasks) {
        setTodayTasks(tasks.map((task: any) => ({
          ...task,
          company_name: task.crm_companies?.company_name,
          contact_name: task.crm_contacts
            ? `${task.crm_contacts.first_name} ${task.crm_contacts.last_name}`
            : undefined
        })));
      }

      const { data: deals } = await supabase
        .from('crm_deals')
        .select(`
          id,
          deal_name,
          deal_value_cents,
          stage,
          probability,
          expected_close_date,
          crm_companies(company_name)
        `)
        .eq('assigned_to', teamMember.id)
        .eq('status', 'open')
        .gte('expected_close_date', new Date().toISOString().split('T')[0])
        .order('expected_close_date', { ascending: true })
        .limit(5);

      if (deals) {
        setUpcomingDeals(deals.map((deal: any) => ({
          ...deal,
          company_name: deal.crm_companies?.company_name || 'Unknown Company'
        })));
      }

    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  async function completeTask(taskId: string) {
    try {
      await supabase
        .from('crm_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      loadDashboardData();
    } catch (err) {
      console.error('Error completing task:', err);
    }
  }

  function formatCurrency(cents: number): string {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  function getStageColor(stage: string): string {
    switch (stage) {
      case 'prospecting': return 'bg-gray-100 text-gray-700';
      case 'qualification': return 'bg-blue-100 text-blue-700';
      case 'proposal': return 'bg-purple-100 text-purple-700';
      case 'negotiation': return 'bg-orange-100 text-orange-700';
      case 'closed_won': return 'bg-green-100 text-green-700';
      case 'closed_lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="team">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!teamMemberId) {
    return (
      <DashboardLayout role="team">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need to be registered as a team member to access this area.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="team">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-blue-100">Your daily tasks and deals at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tasks Today</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.tasks_today || 0}</p>
                  {stats && stats.tasks_overdue > 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      {stats.tasks_overdue} overdue
                    </p>
                  )}
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Deals to Close</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.deals_to_close || 0}</p>
                  <p className="text-sm text-gray-500 mt-1">This month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pipeline Value</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(stats?.deals_value_cents || 0)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Open deals</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Companies</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.companies_count || 0}</p>
                  <Link to="/team/companies" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                    View all
                  </Link>
                </div>
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contacts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.contacts_count || 0}</p>
                  <Link to="/team/contacts" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                    View all
                  </Link>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-center h-full">
                <Link to="/team/tasks/new">
                  <Button variant="primary" className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Quick Add Task
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Today's Tasks</h2>
              </div>
              <Link to="/team/tasks">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No tasks due today. You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {task.company_name && (
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {task.company_name}
                          </span>
                        )}
                        {task.contact_name && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {task.contact_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(task.due_date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => completeTask(task.id)}
                    >
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Upcoming Deals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Upcoming Deals to Close</h2>
              </div>
              <Link to="/team/deals">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {upcomingDeals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No upcoming deals to close.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeals.map((deal) => (
                  <Link
                    key={deal.id}
                    to={`/team/deals/${deal.id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{deal.deal_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{deal.company_name}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStageColor(deal.stage)}`}>
                            {deal.stage.replace('_', ' ')}
                          </span>
                          <span className="text-gray-500">
                            Close: {new Date(deal.expected_close_date).toLocaleDateString()}
                          </span>
                          <span className="text-gray-500">
                            {deal.probability}% probability
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(deal.deal_value_cents)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/team/companies/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody>
                <div className="text-center py-4">
                  <Building className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Add Company</h3>
                  <p className="text-sm text-gray-600">Create a new company record</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link to="/team/contacts/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody>
                <div className="text-center py-4">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Add Contact</h3>
                  <p className="text-sm text-gray-600">Create a new contact</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link to="/team/deals/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody>
                <div className="text-center py-4">
                  <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Add Deal</h3>
                  <p className="text-sm text-gray-600">Create a new deal</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
