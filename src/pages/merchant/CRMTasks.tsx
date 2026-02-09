import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Plus, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
  completed_at: string | null;
  lead: {
    first_name: string;
    last_name: string;
  } | null;
}

export default function CRMTasks() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    if (!profile) return;

    setLoading(true);
    try {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', profile.id)
        .single();

      if (!merchantData) {
        throw new Error('Merchant not found');
      }

      const { data, error } = await supabase
        .from('crm_tasks')
        .select(`
          *,
          lead:lead_id(first_name, last_name)
        `)
        .eq('merchant_id', merchantData.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    try {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', profile.id)
        .single();

      if (!merchantData) {
        throw new Error('Merchant not found');
      }

      const { error } = await supabase
        .from('crm_tasks')
        .insert({
          merchant_id: merchantData.id,
          assigned_to: profile.id,
          created_by: profile.id,
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          priority: formData.priority,
          status: 'pending',
        });

      if (error) throw error;

      setShowNewForm(false);
      setFormData({ title: '', description: '', due_date: '', priority: 'medium' });
      await fetchTasks();
    } catch (error: any) {
      console.error('Error creating task:', error);
      alert(error.message);
    }
  }

  async function toggleTaskStatus(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    try {
      const { error } = await supabase
        .from('crm_tasks')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error: any) {
      console.error('Error updating task:', error);
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => t.status === 'pending' && new Date(t.due_date) < new Date()).length,
  };

  const priorityColors: Record<string, string> = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-blue-500 bg-blue-50',
  };

  if (loading) {
    return (
      <DashboardLayout title="Tasks" role="merchant">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="CRM Tasks" role="merchant">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
            <p className="text-slate-600 mt-1">Manage your follow-ups and to-dos</p>
          </div>
          <Button onClick={() => setShowNewForm(!showNewForm)}>
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardBody>
              <div className="text-sm text-slate-600">Total Tasks</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-sm text-slate-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-sm text-slate-600">Completed</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-sm text-slate-600">Overdue</div>
              <div className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</div>
            </CardBody>
          </Card>
        </div>

        {showNewForm && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="font-bold">Create New Task</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Due Date"
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Create Task</Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 mb-4">No tasks yet</p>
                  <Button onClick={() => setShowNewForm(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Task
                  </Button>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isOverdue = task.status === 'pending' && new Date(task.due_date) < new Date();

                  return (
                    <div
                      key={task.id}
                      className={`p-4 border-l-4 rounded-lg ${priorityColors[task.priority]}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task.id, task.status)}
                          className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                            task.status === 'completed'
                              ? 'bg-[#2BB673] border-[#2BB673]'
                              : 'border-slate-300'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3
                              className={`font-semibold ${
                                task.status === 'completed'
                                  ? 'line-through text-slate-500'
                                  : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isOverdue && (
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Overdue
                                </span>
                              )}
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  task.priority === 'high'
                                    ? 'bg-red-100 text-red-800'
                                    : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Due: {new Date(task.due_date).toLocaleString()}
                            </div>
                            {task.lead && (
                              <div className="flex items-center gap-1">
                                Contact: {task.lead.first_name} {task.lead.last_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
