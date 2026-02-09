import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { ArrowLeft, Save, Trash2, Plus, Mail, Phone, Building2, Calendar, DollarSign, Tag, User, Clock, CheckCircle } from 'lucide-react';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  lead_source: string;
  lead_value: number;
  priority: string;
  notes: string;
  next_follow_up: string | null;
  converted_date: string | null;
  lost_reason: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface Activity {
  id: string;
  activity_type: string;
  subject: string;
  description: string;
  activity_date: string;
  duration_minutes: number | null;
  outcome: string | null;
  created_at: string;
  user: {
    full_name: string;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
  completed_at: string | null;
  created_at: string;
}

export default function CRMContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    lead_source: 'other',
    lead_value: 0,
    priority: 'warm',
    notes: '',
    next_follow_up: '',
    tags: [] as string[],
  });

  const [activityForm, setActivityForm] = useState({
    activity_type: 'note',
    subject: '',
    description: '',
    activity_date: new Date().toISOString().slice(0, 16),
    duration_minutes: 0,
    outcome: '',
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (id) {
      fetchLead();
      fetchActivities();
      fetchTasks();
    }
  }, [id]);

  useEffect(() => {
    if (lead) {
      setFormData({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status,
        lead_source: lead.lead_source,
        lead_value: lead.lead_value,
        priority: lead.priority,
        notes: lead.notes,
        next_follow_up: lead.next_follow_up ? lead.next_follow_up.slice(0, 16) : '',
        tags: lead.tags || [],
      });
    }
  }, [lead]);

  async function fetchLead() {
    if (!profile || !id) return;

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
        .from('crm_leads')
        .select('*')
        .eq('id', id)
        .eq('merchant_id', merchantData.id)
        .single();

      if (error) throw error;
      setLead(data);
    } catch (error: any) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchActivities() {
    if (!profile || !id) return;

    try {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', profile.id)
        .single();

      if (!merchantData) return;

      const { data, error } = await supabase
        .from('crm_activities')
        .select(`
          *,
          user:user_id(full_name)
        `)
        .eq('lead_id', id)
        .eq('merchant_id', merchantData.id)
        .order('activity_date', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
    }
  }

  async function fetchTasks() {
    if (!profile || !id) return;

    try {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', profile.id)
        .single();

      if (!merchantData) return;

      const { data, error } = await supabase
        .from('crm_tasks')
        .select('*')
        .eq('lead_id', id)
        .eq('merchant_id', merchantData.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
    }
  }

  async function handleSave() {
    if (!profile || !id) return;

    setSaving(true);
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
        .from('crm_leads')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email || null,
          phone: formData.phone || null,
          company: formData.company || null,
          status: formData.status,
          lead_source: formData.lead_source,
          lead_value: formData.lead_value,
          priority: formData.priority,
          notes: formData.notes,
          next_follow_up: formData.next_follow_up || null,
          tags: formData.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('merchant_id', merchantData.id);

      if (error) throw error;

      setEditing(false);
      await fetchLead();
    } catch (error: any) {
      console.error('Error saving lead:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this contact? This cannot be undone.')) {
      return;
    }

    if (!profile || !id) return;

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
        .from('crm_leads')
        .delete()
        .eq('id', id)
        .eq('merchant_id', merchantData.id);

      if (error) throw error;
      navigate('/merchant/crm/contacts');
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      alert(error.message);
    }
  }

  async function handleAddActivity() {
    if (!profile || !id) return;

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
        .from('crm_activities')
        .insert({
          merchant_id: merchantData.id,
          lead_id: id,
          user_id: profile.id,
          activity_type: activityForm.activity_type,
          subject: activityForm.subject,
          description: activityForm.description,
          activity_date: activityForm.activity_date,
          duration_minutes: activityForm.duration_minutes || null,
          outcome: activityForm.outcome || null,
        });

      if (error) throw error;

      setShowActivityForm(false);
      setActivityForm({
        activity_type: 'note',
        subject: '',
        description: '',
        activity_date: new Date().toISOString().slice(0, 16),
        duration_minutes: 0,
        outcome: '',
      });
      await fetchActivities();
    } catch (error: any) {
      console.error('Error adding activity:', error);
      alert(error.message);
    }
  }

  async function handleAddTask() {
    if (!profile || !id) return;

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
          lead_id: id,
          assigned_to: profile.id,
          created_by: profile.id,
          title: taskForm.title,
          description: taskForm.description,
          due_date: taskForm.due_date,
          priority: taskForm.priority,
          status: 'pending',
        });

      if (error) throw error;

      setShowTaskForm(false);
      setTaskForm({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
      });
      await fetchTasks();
    } catch (error: any) {
      console.error('Error adding task:', error);
      alert(error.message);
    }
  }

  async function handleToggleTask(taskId: string, currentStatus: string) {
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

  if (loading) {
    return (
      <DashboardLayout title="Loading..." role="merchant">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout title="Contact Not Found" role="merchant">
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Contact not found</p>
          <Button onClick={() => navigate('/merchant/crm/contacts')}>Back to Contacts</Button>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    proposal: 'bg-orange-100 text-orange-800',
    negotiation: 'bg-pink-100 text-pink-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-gray-100 text-gray-800',
  };

  const priorityColors: Record<string, string> = {
    hot: 'bg-red-100 text-red-800',
    warm: 'bg-yellow-100 text-yellow-800',
    cold: 'bg-blue-100 text-blue-800',
  };

  return (
    <DashboardLayout title="Contact Details" role="merchant">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/merchant/crm/contacts')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Button>

          <div className="flex gap-2">
            {editing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Contact Information</h2>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[lead.priority]}`}>
                      {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        required
                      />
                    </div>

                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <Input
                      label="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />

                    <Input
                      label="Company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                        >
                          <option value="hot">Hot</option>
                          <option value="warm">Warm</option>
                          <option value="cold">Cold</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lead Source</label>
                        <select
                          value={formData.lead_source}
                          onChange={(e) => setFormData({ ...formData, lead_source: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                        >
                          <option value="website">Website</option>
                          <option value="printing">Printing</option>
                          <option value="postcards">Postcards</option>
                          <option value="swag">Swag</option>
                          <option value="referral">Referral</option>
                          <option value="direct">Direct</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <Input
                        label="Estimated Value ($)"
                        type="number"
                        value={formData.lead_value}
                        onChange={(e) => setFormData({ ...formData, lead_value: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <Input
                      label="Next Follow-up"
                      type="datetime-local"
                      value={formData.next_follow_up}
                      onChange={(e) => setFormData({ ...formData, next_follow_up: e.target.value })}
                    />

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm text-slate-500">Name</div>
                        <div className="font-medium">{lead.first_name} {lead.last_name}</div>
                      </div>
                    </div>

                    {lead.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-sm text-slate-500">Email</div>
                          <a href={`mailto:${lead.email}`} className="font-medium text-[#2BB673] hover:underline">
                            {lead.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {lead.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-sm text-slate-500">Phone</div>
                          <a href={`tel:${lead.phone}`} className="font-medium text-[#2BB673] hover:underline">
                            {lead.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {lead.company && (
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-sm text-slate-500">Company</div>
                          <div className="font-medium">{lead.company}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm text-slate-500">Estimated Value</div>
                        <div className="font-medium">${lead.lead_value.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="text-sm text-slate-500">Lead Source</div>
                        <div className="font-medium capitalize">{lead.lead_source}</div>
                      </div>
                    </div>

                    {lead.next_follow_up && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-sm text-slate-500">Next Follow-up</div>
                          <div className="font-medium">{new Date(lead.next_follow_up).toLocaleString()}</div>
                        </div>
                      </div>
                    )}

                    {lead.notes && (
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Notes</div>
                        <div className="text-slate-700 whitespace-pre-wrap">{lead.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Activity History</h2>
                  <Button size="sm" onClick={() => setShowActivityForm(!showActivityForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Log Activity
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {showActivityForm && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg space-y-3">
                    <select
                      value={activityForm.activity_type}
                      onChange={(e) => setActivityForm({ ...activityForm, activity_type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                    >
                      <option value="note">Note</option>
                      <option value="call">Call</option>
                      <option value="email">Email</option>
                      <option value="meeting">Meeting</option>
                      <option value="task_completed">Task Completed</option>
                    </select>

                    <Input
                      placeholder="Subject"
                      value={activityForm.subject}
                      onChange={(e) => setActivityForm({ ...activityForm, subject: e.target.value })}
                    />

                    <textarea
                      placeholder="Description"
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                    />

                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddActivity}>
                        Save Activity
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowActivityForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No activity history yet</p>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="border-l-2 border-[#2BB673] pl-4 pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium">
                              {activity.subject || activity.activity_type.replace('_', ' ').toUpperCase()}
                            </div>
                            <div className="text-sm text-slate-500">
                              {new Date(activity.activity_date).toLocaleString()} • {activity.user?.full_name || 'Unknown'}
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            {activity.activity_type}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-slate-700 whitespace-pre-wrap">{activity.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Tasks</h3>
                  <Button size="sm" variant="outline" onClick={() => setShowTaskForm(!showTaskForm)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {showTaskForm && (
                  <div className="mb-4 space-y-3 p-3 bg-slate-50 rounded-lg">
                    <Input
                      placeholder="Task title"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    />
                    <Input
                      type="datetime-local"
                      value={taskForm.due_date}
                      onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddTask}>
                        Add Task
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowTaskForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <p className="text-center text-slate-500 py-4 text-sm">No tasks yet</p>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <button
                          onClick={() => handleToggleTask(task.id, task.status)}
                          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                            task.status === 'completed'
                              ? 'bg-[#2BB673] border-[#2BB673]'
                              : 'border-slate-300'
                          }`}
                        >
                          {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {task.title}
                          </div>
                          {task.due_date && (
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
