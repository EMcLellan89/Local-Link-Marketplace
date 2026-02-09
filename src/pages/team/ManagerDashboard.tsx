import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Target, CheckCircle, Clock, TrendingUp, Plus, BarChart3, Calendar
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface ManagerStats {
  team_size: number;
  active_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  active_goals: number;
  achieved_goals: number;
}

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  is_active: boolean;
}

interface Project {
  id: string;
  project_name: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  task_count: number;
  completed_count: number;
}

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [managerId, setManagerId] = useState<string | null>(null);

  useEffect(() => {
    loadManagerData();
  }, []);

  async function loadManagerData() {
    try {
      const adminToken = localStorage.getItem('admin_token');
      let currentManagerId: string | null = null;

      if (adminToken) {
        const { data } = await supabase
          .from('admin_sessions')
          .select('admin_user_id')
          .eq('token', adminToken)
          .maybeSingle();

        if (data) {
          currentManagerId = 'admin-access';
          setManagerId('admin-access');
        }
      }

      if (!currentManagerId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: manager } = await supabase
          .from('team_members')
          .select('id, role')
          .eq('user_id', user.id)
          .single();

        if (!manager || manager.role !== 'manager') {
          navigate('/team/dashboard');
          return;
        }

        currentManagerId = manager.id;
        setManagerId(manager.id);
      }

      if (currentManagerId === 'admin-access') {
        const { data: allMembers } = await supabase
          .from('team_members')
          .select('*')
          .order('full_name');

        setTeamMembers(allMembers || []);

        const { data: allProjects } = await supabase
          .from('team_projects')
          .select('*')
          .order('created_at', { ascending: false });

        setProjects(allProjects || []);
      } else {
        const { data: statsData } = await supabase.rpc('get_manager_team_stats', {
          p_manager_id: currentManagerId
        });

        if (statsData) setStats(statsData);

        const { data: members } = await supabase
          .from('team_members')
          .select('*')
          .eq('manager_id', currentManagerId)
          .order('full_name');

        setTeamMembers(members || []);

        const { data: projectsData } = await supabase
          .from('team_projects')
          .select('*, project_assignments(count)')
          .eq('manager_id', currentManagerId)
          .order('created_at', { ascending: false });

        setProjects(projectsData as any || []);
      }
    } catch (error) {
      console.error('Error loading manager data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-slate-600">Loading manager dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Manager Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your team, projects, and goals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-600">Team Size</div>
                  <div className="text-3xl font-bold text-slate-900 mt-1">
                    {stats?.team_size || teamMembers.length}
                  </div>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-600">Active Projects</div>
                  <div className="text-3xl font-bold text-slate-900 mt-1">
                    {stats?.active_projects || projects.filter(p => p.status === 'active').length}
                  </div>
                </div>
                <BarChart3 className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-600">Total Tasks</div>
                  <div className="text-3xl font-bold text-slate-900 mt-1">{stats?.total_tasks || 0}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {stats?.completed_tasks || 0} completed
                  </div>
                </div>
                <CheckCircle className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-600">Goals</div>
                  <div className="text-3xl font-bold text-slate-900 mt-1">{stats?.active_goals || 0}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {stats?.achieved_goals || 0} achieved
                  </div>
                </div>
                <Target className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Team Members</h2>
                <Button size="sm" onClick={() => navigate('/team/manager/members')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No team members assigned
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.slice(0, 5).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/team/manager/member/${member.id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {member.full_name?.charAt(0) || 'T'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{member.full_name}</div>
                          <div className="text-sm text-slate-500">{member.role}</div>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        member.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Active Projects</h2>
                <Button size="sm" onClick={() => navigate('/team/manager/projects')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {projects.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No projects assigned
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.filter(p => p.status === 'active').slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => navigate(`/team/manager/project/${project.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-slate-900">{project.project_name}</div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          project.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          project.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          project.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {project.priority}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">{project.description}</div>
                      {project.due_date && (
                        <div className="flex items-center text-xs text-slate-500 mt-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          Due: {new Date(project.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            className="w-full justify-center"
            onClick={() => navigate('/team/manager/assign-tasks')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Assign Tasks
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => navigate('/team/manager/set-goals')}
          >
            <Target className="w-5 h-5 mr-2" />
            Set Goals
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-center"
            onClick={() => navigate('/team/manager/reports')}
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View Reports
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
