import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  CheckSquare,
  Square,
  AlertTriangle,
  Clock,
  CheckCircle,
  ListTodo,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Priority = 'high' | 'medium' | 'low';
type PriorityFilter = 'all' | Priority;

interface Task {
  id: string;
  title: string;
  priority: Priority;
  due_date: string; // YYYY-MM-DD
  completed: boolean;
  customer_name: string | null;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Send proposal to Derek Chang', priority: 'high', due_date: '2026-04-24', completed: false, customer_name: 'Derek Chang' },
  { id: '2', title: 'Follow up on SEO audit quote', priority: 'medium', due_date: '2026-04-24', completed: false, customer_name: 'Liam Nguyen' },
  { id: '3', title: 'Update contact info for Maria Torres', priority: 'low', due_date: '2026-04-25', completed: false, customer_name: 'Maria Torres' },
  { id: '4', title: 'Schedule onboarding call', priority: 'high', due_date: '2026-04-23', completed: true, customer_name: null },
  { id: '5', title: 'Review monthly analytics report', priority: 'medium', due_date: '2026-04-26', completed: false, customer_name: null },
  { id: '6', title: 'Send invoice to Priya Patel', priority: 'high', due_date: '2026-04-24', completed: false, customer_name: 'Priya Patel' },
  { id: '7', title: 'Prepare Q2 strategy presentation', priority: 'medium', due_date: '2026-04-28', completed: false, customer_name: null },
  { id: '8', title: 'Call Tom Buchanan re: inactive account', priority: 'high', due_date: '2026-04-22', completed: false, customer_name: 'Tom Buchanan' },
  { id: '9', title: 'Add workshop event to calendar', priority: 'low', due_date: '2026-04-27', completed: false, customer_name: null },
  { id: '10', title: 'Update CRM pipeline stages', priority: 'medium', due_date: '2026-04-29', completed: false, customer_name: null },
  { id: '11', title: 'Send thank-you note to Sarah Mitchell', priority: 'low', due_date: '2026-04-25', completed: false, customer_name: 'Sarah Mitchell' },
  { id: '12', title: 'Review contract renewal terms', priority: 'high', due_date: '2026-04-30', completed: false, customer_name: null },
  { id: '13', title: 'Back up customer database', priority: 'low', due_date: '2026-05-01', completed: false, customer_name: null },
  { id: '14', title: 'Submit tax documents to accountant', priority: 'high', due_date: '2026-04-22', completed: true, customer_name: null },
  { id: '15', title: 'Prepare referral cards for next week', priority: 'medium', due_date: '2026-04-28', completed: false, customer_name: null },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TODAY = '2026-04-24';
const WEEK_END = '2026-04-30';

const priorityBadge: Record<Priority, string> = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

const priorityLabel: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const PRIORITY_TABS: { key: PriorityFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

function formatDueDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(task: Task): boolean {
  return !task.completed && task.due_date < TODAY;
}

function isDueToday(task: Task): boolean {
  return !task.completed && task.due_date === TODAY;
}

function isThisWeek(task: Task): boolean {
  return !task.completed && task.due_date > TODAY && task.due_date <= WEEK_END;
}

function isLater(task: Task): boolean {
  return !task.completed && task.due_date > WEEK_END;
}

// ---------------------------------------------------------------------------
// New Task Modal
// ---------------------------------------------------------------------------

interface NewTaskModalProps {
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'completed'>) => void;
}

function NewTaskModal({ onClose, onSave }: NewTaskModalProps) {
  const [form, setForm] = useState<{
    title: string;
    priority: Priority;
    due_date: string;
    notes: string;
  }>({
    title: '',
    priority: 'medium',
    due_date: TODAY,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.due_date) return;
    onSave({
      title: form.title.trim(),
      priority: form.priority,
      due_date: form.due_date,
      customer_name: null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <Plus className="h-5 w-5 rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Task Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="What needs to be done?"
              required
              autoFocus
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2BB673] focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#2BB673] focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#2BB673] focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Optional notes..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2BB673] focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: '#2BB673' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#23995f')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2BB673')}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Task Row
// ---------------------------------------------------------------------------

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
}

function TaskRow({ task, onToggle }: TaskRowProps) {
  const overdue = isOverdue(task);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
        task.completed
          ? 'border-gray-100 bg-gray-50'
          : overdue
          ? 'border-rose-100 bg-white'
          : 'border-gray-100 bg-white hover:shadow-sm'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 transition-colors"
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed ? (
          <CheckSquare className="h-5 w-5 text-[#2BB673]" />
        ) : (
          <Square className="h-5 w-5 text-gray-300 hover:text-[#2BB673]" />
        )}
      </button>

      {/* Title + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm font-medium ${
              task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}
          >
            {task.title}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              task.completed ? 'bg-slate-100 text-slate-400' : priorityBadge[task.priority]
            }`}
          >
            {priorityLabel[task.priority]}
          </span>
          {overdue && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
              <AlertTriangle className="h-3 w-3" />
              Overdue
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400">
          <span
            className={`flex items-center gap-1 ${overdue && !task.completed ? 'text-rose-500' : ''}`}
          >
            <Clock className="h-3 w-3" />
            {formatDueDate(task.due_date)}
          </span>
          <span>Assigned to: You</span>
          {task.customer_name && (
            <span className="text-[#2BB673] font-medium">{task.customer_name}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Task Group
// ---------------------------------------------------------------------------

interface TaskGroupProps {
  label: string;
  tasks: Task[];
  onToggle: (id: string) => void;
}

function TaskGroup({ label, tasks, onToggle }: TaskGroupProps) {
  if (tasks.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskRow key={task.id} task={task} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CRMTasksPage() {
  useAuth();
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [showModal, setShowModal] = useState(false);

  const handleToggle = async (id: string) => {
    let nextCompleted = false;
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          nextCompleted = !t.completed;
          return { ...t, completed: !t.completed };
        }
        return t;
      })
    );
    try {
      await supabase.from('crm_tasks').update({ completed: nextCompleted }).eq('id', id);
    } catch {
      // Supabase may not have this table; local state is the fallback
    }
  };

  const handleSaveTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = { ...task, id: Date.now().toString(), completed: false };
    setTasks(prev => [newTask, ...prev]);
    try {
      await supabase.from('crm_tasks').insert([newTask]);
    } catch {
      // Supabase may not have this table; local state is the fallback
    }
  };

  const filtered = useMemo(
    () => (priorityFilter === 'all' ? tasks : tasks.filter(t => t.priority === priorityFilter)),
    [tasks, priorityFilter]
  );

  // Stats (always from all tasks, not filtered)
  const openCount = tasks.filter(t => !t.completed).length;
  const dueTodayCount = tasks.filter(isDueToday).length;
  const overdueCount = tasks.filter(isOverdue).length;
  const completedThisWeek = tasks.filter(
    t => t.completed && t.due_date >= '2026-04-21' && t.due_date <= TODAY
  ).length;

  // Groups
  const overdueGroup = filtered.filter(isOverdue).sort((a, b) => a.due_date.localeCompare(b.due_date));
  const todayGroup = filtered.filter(isDueToday).sort((a, b) => a.priority.localeCompare(b.priority));
  const weekGroup = filtered.filter(isThisWeek).sort((a, b) => a.due_date.localeCompare(b.due_date));
  const laterGroup = filtered.filter(isLater).sort((a, b) => a.due_date.localeCompare(b.due_date));
  const completedGroup = filtered.filter(t => t.completed).sort((a, b) => b.due_date.localeCompare(a.due_date));

  const stats = [
    { label: 'Open Tasks', value: openCount, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Due Today', value: dueTodayCount, icon: Clock, color: 'text-[#2BB673]', bg: 'bg-green-50' },
    { label: 'Overdue', value: overdueCount, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Completed This Week', value: completedThisWeek, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

          {/* Back link */}
          <Link
            to="/merchant/crm-hub"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            CRM Hub
          </Link>

          {/* Header */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="mt-1 text-sm text-gray-500">Stay on top of your to-dos</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ backgroundColor: '#2BB673' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#23995f')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2BB673')}
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>

          {/* Stats row */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                  <div className={`mb-2 inline-flex items-center justify-center rounded-lg p-2 ${s.bg}`}>
                    <Icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="mt-0.5 text-xs text-gray-500">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Priority filter tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {PRIORITY_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setPriorityFilter(tab.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  priorityFilter === tab.key
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
                style={priorityFilter === tab.key ? { backgroundColor: '#2BB673' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Task groups */}
          {overdueGroup.length === 0 &&
          todayGroup.length === 0 &&
          weekGroup.length === 0 &&
          laterGroup.length === 0 &&
          completedGroup.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">No tasks found</p>
            </div>
          ) : (
            <>
              {overdueGroup.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-500">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Overdue
                  </h3>
                  <div className="space-y-2">
                    {overdueGroup.map(task => (
                      <TaskRow key={task.id} task={task} onToggle={handleToggle} />
                    ))}
                  </div>
                </div>
              )}
              <TaskGroup label="Today" tasks={todayGroup} onToggle={handleToggle} />
              <TaskGroup label="This Week" tasks={weekGroup} onToggle={handleToggle} />
              <TaskGroup label="Later" tasks={laterGroup} onToggle={handleToggle} />
              <TaskGroup label="Completed" tasks={completedGroup} onToggle={handleToggle} />
            </>
          )}
        </div>
      </div>

      {showModal && (
        <NewTaskModal onClose={() => setShowModal(false)} onSave={handleSaveTask} />
      )}
    </DashboardLayout>
  );
}
