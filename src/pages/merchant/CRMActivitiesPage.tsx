import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Wrench,
  Ticket,
  Package,
  Truck,
  MessageSquare,
  PhoneCall,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActivityType =
  | 'appointment'
  | 'service_job'
  | 'event_registration'
  | 'order_fulfillment'
  | 'delivery'
  | 'consultation'
  | 'follow_up';

type ActivityStatus = 'upcoming' | 'completed' | 'in_progress' | 'missed' | 'cancelled';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  customer_name: string;
  scheduled_at: string;
  status: ActivityStatus;
  duration_minutes?: number;
  amount_cents?: number;
}

type FilterTab = 'all' | ActivityType;

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', type: 'appointment', title: 'Initial Consultation', customer_name: 'Sarah Mitchell', scheduled_at: '2026-04-24T10:00:00', status: 'upcoming', duration_minutes: 60 },
  { id: '2', type: 'service_job', title: 'Website Update', customer_name: 'James Kowalski', scheduled_at: '2026-04-23T14:00:00', status: 'completed', duration_minutes: 120 },
  { id: '3', type: 'order_fulfillment', title: 'Print Order #1042', customer_name: 'Maria Torres', scheduled_at: '2026-04-23T09:00:00', status: 'completed', amount_cents: 18500 },
  { id: '4', type: 'consultation', title: 'Strategy Session', customer_name: 'Derek Chang', scheduled_at: '2026-04-22T15:30:00', status: 'completed', duration_minutes: 90 },
  { id: '5', type: 'event_registration', title: 'Spring Workshop', customer_name: 'Priya Patel', scheduled_at: '2026-04-26T13:00:00', status: 'upcoming', amount_cents: 9500 },
  { id: '6', type: 'follow_up', title: 'Check-in Call', customer_name: 'Tom Buchanan', scheduled_at: '2026-04-21T11:00:00', status: 'missed', duration_minutes: 15 },
  { id: '7', type: 'appointment', title: 'Review Meeting', customer_name: 'Angela White', scheduled_at: '2026-04-25T09:00:00', status: 'upcoming', duration_minutes: 45 },
  { id: '8', type: 'service_job', title: 'SEO Audit', customer_name: 'Liam Nguyen', scheduled_at: '2026-04-22T10:00:00', status: 'in_progress', duration_minutes: 180 },
  { id: '9', type: 'delivery', title: 'Equipment Delivery', customer_name: 'Rosa Kim', scheduled_at: '2026-04-24T14:00:00', status: 'upcoming', amount_cents: 0 },
  { id: '10', type: 'order_fulfillment', title: 'Custom Signage #89', customer_name: 'Nathan Ellis', scheduled_at: '2026-04-20T08:00:00', status: 'completed', amount_cents: 34000 },
  { id: '11', type: 'consultation', title: 'Onboarding Call', customer_name: 'Priya Patel', scheduled_at: '2026-04-19T10:00:00', status: 'completed', duration_minutes: 60 },
  { id: '12', type: 'follow_up', title: 'Quote Follow-up', customer_name: 'Maria Torres', scheduled_at: '2026-04-25T16:00:00', status: 'upcoming', duration_minutes: 10 },
  { id: '13', type: 'appointment', title: 'Quarterly Review', customer_name: 'Derek Chang', scheduled_at: '2026-04-28T11:00:00', status: 'upcoming', duration_minutes: 60 },
  { id: '14', type: 'event_registration', title: 'Networking Event', customer_name: 'James Kowalski', scheduled_at: '2026-04-30T18:00:00', status: 'upcoming', amount_cents: 4500 },
  { id: '15', type: 'service_job', title: 'Logo Refresh', customer_name: 'Sarah Mitchell', scheduled_at: '2026-04-18T10:00:00', status: 'completed', duration_minutes: 240 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TODAY = '2026-04-24';
const TODAY_START = new Date(`${TODAY}T00:00:00`);
const TODAY_END = new Date(`${TODAY}T23:59:59`);
const WEEK_END = new Date('2026-04-30T23:59:59');

const typeIconMap: Record<ActivityType, { Icon: React.ElementType; color: string; bg: string }> = {
  appointment: { Icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  service_job: { Icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-100' },
  event_registration: { Icon: Ticket, color: 'text-green-600', bg: 'bg-green-100' },
  order_fulfillment: { Icon: Package, color: 'text-slate-600', bg: 'bg-slate-100' },
  delivery: { Icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100' },
  consultation: { Icon: MessageSquare, color: 'text-teal-600', bg: 'bg-teal-100' },
  follow_up: { Icon: PhoneCall, color: 'text-rose-600', bg: 'bg-rose-100' },
};

const statusBadgeMap: Record<ActivityStatus, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  in_progress: 'bg-amber-100 text-amber-700',
  missed: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-slate-100 text-slate-600',
};

const statusLabel: Record<ActivityStatus, string> = {
  upcoming: 'Upcoming',
  completed: 'Completed',
  in_progress: 'In Progress',
  missed: 'Missed',
  cancelled: 'Cancelled',
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'appointment', label: 'Appointments' },
  { key: 'service_job', label: 'Jobs' },
  { key: 'event_registration', label: 'Events' },
  { key: 'order_fulfillment', label: 'Orders' },
  { key: 'consultation', label: 'Consultations' },
];

// ---------------------------------------------------------------------------
// Log Activity Modal
// ---------------------------------------------------------------------------

interface LogActivityModalProps {
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id'>) => void;
}

function LogActivityModal({ onClose, onSave }: LogActivityModalProps) {
  const [form, setForm] = useState<{
    type: ActivityType;
    title: string;
    customer_name: string;
    scheduled_at: string;
    notes: string;
  }>({
    type: 'appointment',
    title: '',
    customer_name: '',
    scheduled_at: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.customer_name.trim() || !form.scheduled_at) return;
    onSave({
      type: form.type,
      title: form.title.trim(),
      customer_name: form.customer_name.trim(),
      scheduled_at: form.scheduled_at,
      status: 'upcoming',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Log Activity</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <Plus className="h-5 w-5 rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Activity Type</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as ActivityType }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-[#2BB673] focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20"
            >
              <option value="appointment">Appointment</option>
              <option value="service_job">Service Job</option>
              <option value="event_registration">Event Registration</option>
              <option value="order_fulfillment">Order Fulfillment</option>
              <option value="delivery">Delivery</option>
              <option value="consultation">Consultation</option>
              <option value="follow_up">Follow Up</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Activity title"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2BB673] focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={form.customer_name}
              onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
              placeholder="Customer name"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#2BB673] focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Scheduled Date & Time</label>
            <input
              type="datetime-local"
              value={form.scheduled_at}
              onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))}
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
              Log Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity Row
// ---------------------------------------------------------------------------

interface ActivityRowProps {
  activity: Activity;
  onStatusChange: (id: string, status: ActivityStatus) => void;
}

function ActivityRow({ activity, onStatusChange }: ActivityRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { Icon, color, bg } = typeIconMap[activity.type];

  return (
    <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-900">{activity.title}</span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeMap[activity.status]}`}>
            {statusLabel[activity.status]}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{activity.customer_name}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatDateTime(activity.scheduled_at)}</span>
        </div>
      </div>

      {/* Right: meta + actions */}
      <div className="flex flex-shrink-0 items-center gap-3">
        {activity.duration_minutes !== undefined && (
          <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{activity.duration_minutes}m</span>
          </div>
        )}
        {activity.amount_cents !== undefined && activity.amount_cents > 0 && (
          <div className="hidden sm:block text-sm font-medium text-gray-700">
            {formatCents(activity.amount_cents)}
          </div>
        )}

        {/* Actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-10 min-w-[140px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => { onStatusChange(activity.id, 'completed'); setMenuOpen(false); }}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                Complete
              </button>
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => { setMenuOpen(false); }}
              >
                <Calendar className="h-4 w-4 text-blue-500" />
                Reschedule
              </button>
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => { onStatusChange(activity.id, 'cancelled'); setMenuOpen(false); }}
              >
                <AlertCircle className="h-4 w-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CRMActivitiesPage() {
  useAuth(); // ensure auth context is available
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showModal, setShowModal] = useState(false);

  // Attempt to load from Supabase; fall back to mock on error
  // (No useEffect fetch for this demo — mock data is pre-loaded)

  const filtered = activeTab === 'all' ? activities : activities.filter(a => a.type === activeTab);

  const todayActivities = activities.filter(a => {
    const d = new Date(a.scheduled_at);
    return d >= TODAY_START && d <= TODAY_END;
  });
  const thisWeekActivities = activities.filter(a => {
    const d = new Date(a.scheduled_at);
    return d >= TODAY_START && d <= WEEK_END;
  });
  const completedActivities = activities.filter(a => a.status === 'completed');
  const upcomingActivities = activities.filter(a => a.status === 'upcoming');

  const handleStatusChange = async (id: string, status: ActivityStatus) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      await supabase.from('activities').update({ status }).eq('id', id);
    } catch {
      // Supabase may not have this table; local state is the fallback
    }
  };

  const handleSaveActivity = async (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = { ...activity, id: Date.now().toString() };
    setActivities(prev => [newActivity, ...prev]);
    try {
      await supabase.from('activities').insert([newActivity]);
    } catch {
      // Supabase may not have this table; local state is the fallback
    }
  };

  const stats = [
    { label: "Today's Activities", value: todayActivities.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'This Week', value: thisWeekActivities.length, icon: Clock, color: 'text-[#2BB673]', bg: 'bg-green-50' },
    { label: 'Completed', value: completedActivities.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Upcoming', value: upcomingActivities.length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

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
              <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
              <p className="mt-1 text-sm text-gray-500">All customer interactions in one place</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ backgroundColor: '#2BB673' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#23995f')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2BB673')}
            >
              <Plus className="h-4 w-4" />
              Log Activity
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

          {/* Filter tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
                style={activeTab === tab.key ? { backgroundColor: '#2BB673' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Activity timeline */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
                <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-gray-500">No activities found</p>
              </div>
            ) : (
              filtered
                .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
                .map(activity => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                    onStatusChange={handleStatusChange}
                  />
                ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <LogActivityModal onClose={() => setShowModal(false)} onSave={handleSaveActivity} />
      )}
    </DashboardLayout>
  );
}
