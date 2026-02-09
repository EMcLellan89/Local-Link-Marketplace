import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Plus, AlertCircle, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

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

interface Company {
  id: string;
  company_name: string;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
}

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_type: 'follow_up',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    company_id: '',
    contact_id: ''
  });

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!teamMember) return;

      let taskQuery = supabase
        .from('crm_tasks')
        .select(`
          *,
          crm_companies(company_name),
          crm_contacts(first_name, last_name)
        `)
        .eq('assigned_to', teamMember.id)
        .order('due_date', { ascending: true });

      if (filterStatus !== 'all') {
        taskQuery = taskQuery.eq('status', filterStatus);
      }

      const [tasksResult, companiesResult, contactsResult] = await Promise.all([
        taskQuery,
        supabase
          .from('crm_companies')
          .select('id, company_name')
          .eq('assigned_to', teamMember.id),
        supabase
          .from('crm_contacts')
          .select('id, first_name, last_name')
          .eq('assigned_to', teamMember.id)
      ]);

      if (tasksResult.data) {
        setTasks(tasksResult.data.map((t: any) => ({
          ...t,
          company_name: t.crm_companies?.company_name,
          contact_name: t.crm_contacts
            ? `${t.crm_contacts.first_name} ${t.crm_contacts.last_name}`
            : undefined
        })));
      }

      if (companiesResult.data) setCompanies(companiesResult.data);
      if (contactsResult.data) setContacts(contactsResult.data);

    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!teamMember) return;

      await supabase.from('crm_tasks').insert([{
        ...formData,
        assigned_to: teamMember.id,
        created_by: teamMember.id,
        company_id: formData.company_id || null,
        contact_id: formData.contact_id || null
      }]);

      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        task_type: 'follow_up',
        priority: 'medium',
        status: 'pending',
        due_date: '',
        company_id: '',
        contact_id: ''
      });
      loadData();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  }

  async function completeTask(id: string) {
    try {
      await supabase
        .from('crm_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', id);
      loadData();
    } catch (err) {
      console.error('Error completing task:', err);
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  function isOverdue(dueDate: string) {
    return new Date(dueDate) < new Date();
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

  return (
    <DashboardLayout role="team">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-1">Manage your daily tasks</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </Button>
        </div>

        <Card>
          <CardBody>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'secondary'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'primary' : 'secondary'}
                onClick={() => setFilterStatus('pending')}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'in_progress' ? 'primary' : 'secondary'}
                onClick={() => setFilterStatus('in_progress')}
                size="sm"
              >
                In Progress
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'primary' : 'secondary'}
                onClick={() => setFilterStatus('completed')}
                size="sm"
              >
                Completed
              </Button>
            </div>
          </CardBody>
        </Card>

        {tasks.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  Add Task
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {isOverdue(task.due_date) && task.status !== 'completed' && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {task.company_name && <span>Company: {task.company_name}</span>}
                        {task.contact_name && <span>Contact: {task.contact_name}</span>}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(task.due_date).toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.status === 'completed' ? 'bg-green-100 text-green-700' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {task.status !== 'completed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => completeTask(task.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Task</h2>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Type
                      </label>
                      <select
                        value={formData.task_type}
                        onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="follow_up">Follow Up</option>
                        <option value="call">Call</option>
                        <option value="email">Email</option>
                        <option value="meeting">Meeting</option>
                        <option value="demo">Demo</option>
                        <option value="proposal">Proposal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <Input
                      type="datetime-local"
                      required
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <select
                        value={formData.company_id}
                        onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">None</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.company_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact
                      </label>
                      <select
                        value={formData.contact_id}
                        onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">None</option>
                        {contacts.map((contact) => (
                          <option key={contact.id} value={contact.id}>
                            {contact.first_name} {contact.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" variant="primary" className="flex-1">
                      Add Task
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
