import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Users,
  Target,
  Briefcase,
  List,
  Plus,
  TrendingUp,
  Store,
  UserCheck,
  ShoppingBag
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  total_companies: number;
  total_contacts: number;
  active_projects: number;
  active_goals: number;
  team_members: number;
  merchants: number;
  partners: number;
}

interface Goal {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
  end_date: string;
  team_member: { first_name: string; last_name: string };
}

interface Project {
  id: string;
  project_name: string;
  status: string;
  priority: string;
  due_date: string;
  budget_cents: number;
}

export default function AdminCRMDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentGoals, setRecentGoals] = useState<Goal[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsResult, goalsResult, projectsResult] = await Promise.all([
        supabase.rpc('get_admin_crm_dashboard_stats'),
        supabase
          .from('admin_crm_goals')
          .select('*, team_member:team_members(first_name, last_name)')
          .eq('status', 'active')
          .order('end_date', { ascending: true })
          .limit(5),
        supabase
          .from('admin_crm_projects')
          .select('*')
          .in('status', ['planning', 'active', 'in_progress'])
          .order('due_date', { ascending: true })
          .limit(5)
      ]);

      if (statsResult.data) setStats(statsResult.data);
      if (goalsResult.data) setRecentGoals(goalsResult.data as any);
      if (projectsResult.data) setActiveProjects(projectsResult.data);

    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  function getProgressPercentage(current: number, target: number): number {
    return Math.min(Math.round((current / target) * 100), 100);
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-700';
      case 'active':
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'on_hold': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2">Admin CRM</h1>
          <p className="text-blue-100">Manage your team, goals, projects, and business relationships</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Companies</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.total_companies || 0}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Store className="w-4 h-4" />
                    <span>{stats?.merchants || 0} Merchants</span>
                  </div>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Partners</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.partners || 0}</p>
                  <Link to="/admin/crm/companies?type=partner" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    View all
                  </Link>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.active_projects || 0}</p>
                  <Link to="/admin/crm/projects" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    Manage
                  </Link>
                </div>
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Team Goals</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.active_goals || 0}</p>
                  <Link to="/admin/crm/goals" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    Set goals
                  </Link>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/admin/crm/goals/new">
                <Button variant="secondary" className="w-full justify-center">
                  <Target className="w-5 h-5 mr-2" />
                  Set New Goal
                </Button>
              </Link>
              <Link to="/admin/crm/projects/new">
                <Button variant="secondary" className="w-full justify-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Create Project
                </Button>
              </Link>
              <Link to="/admin/crm/companies">
                <Button variant="secondary" className="w-full justify-center">
                  <Building className="w-5 h-5 mr-2" />
                  View All Companies
                </Button>
              </Link>
              <Link to="/admin/crm/lists">
                <Button variant="secondary" className="w-full justify-center">
                  <List className="w-5 h-5 mr-2" />
                  Manage Lists
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Active Goals</h2>
                </div>
                <Link to="/admin/crm/goals">
                  <Button variant="secondary" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {recentGoals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No active goals</p>
                  <Link to="/admin/crm/goals/new">
                    <Button variant="primary" size="sm" className="mt-3">
                      Set First Goal
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentGoals.map((goal) => {
                    const progress = getProgressPercentage(goal.current_value, goal.target_value);
                    return (
                      <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                            <p className="text-sm text-gray-600">
                              {goal.team_member.first_name} {goal.team_member.last_name}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            Due: {new Date(goal.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {goal.current_value} / {goal.target_value} {goal.unit}
                            </span>
                            <span className="font-semibold text-gray-900">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Active Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
                </div>
                <Link to="/admin/crm/projects">
                  <Button variant="secondary" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {activeProjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No active projects</p>
                  <Link to="/admin/crm/projects/new">
                    <Button variant="primary" size="sm" className="mt-3">
                      Create First Project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeProjects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/admin/crm/projects/${project.id}`}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{project.project_name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className={`font-medium ${getPriorityColor(project.priority)}`}>
                              {project.priority} priority
                            </span>
                            {project.due_date && (
                              <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/crm/companies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody>
                <div className="text-center py-4">
                  <Building className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Companies & Contacts</h3>
                  <p className="text-sm text-gray-600">Manage all your business relationships</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{stats?.total_companies || 0}</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link to="/admin/crm/lists">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody>
                <div className="text-center py-4">
                  <List className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">CRM Lists</h3>
                  <p className="text-sm text-gray-600">Segment and organize your contacts</p>
                  <Button variant="primary" size="sm" className="mt-3">
                    Manage Lists
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link to="/team/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody>
                <div className="text-center py-4">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Team Members</h3>
                  <p className="text-sm text-gray-600">Manage your sales team</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">{stats?.team_members || 0}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
