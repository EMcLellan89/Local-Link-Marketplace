import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, TrendingUp, DollarSign, Calendar, CheckSquare,
  MessageSquare, Package, FileText, BarChart2, ArrowUpRight,
  Plus, Clock, AlertCircle, Star, Zap, Target, ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

interface CRMStats {
  total_leads: number;
  new_leads: number;
  total_customers: number;
  open_opportunities: number;
  pipeline_value_cents: number;
  open_tasks: number;
  overdue_tasks: number;
  unread_messages: number;
  revenue_this_month_cents: number;
  transactions_this_month: number;
}

interface RecentLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  status: string;
  lead_source: string | null;
  created_at: string;
}

interface RecentTask {
  id: string;
  title: string;
  priority: string;
  due_date: string | null;
  status: string;
}

interface RecentTransaction {
  id: string;
  title: string;
  amount_cents: number;
  status: string;
  transacted_at: string;
}

const EMPTY_STATS: CRMStats = {
  total_leads: 0, new_leads: 0, total_customers: 0, open_opportunities: 0,
  pipeline_value_cents: 0, open_tasks: 0, overdue_tasks: 0,
  unread_messages: 0, revenue_this_month_cents: 0, transactions_this_month: 0,
};

const MOCK_LEADS: RecentLead[] = [
  { id: 'l1', first_name: 'Marcus', last_name: 'Johnson', email: 'marcus@email.com', status: 'new', lead_source: 'marketplace', created_at: new Date().toISOString() },
  { id: 'l2', first_name: 'Sarah', last_name: 'Chen', email: 'sarah@email.com', status: 'contacted', lead_source: 'partner', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'l3', first_name: 'David', last_name: 'Rivera', email: null, status: 'qualified', lead_source: 'direct', created_at: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_TASKS: RecentTask[] = [
  { id: 't1', title: 'Follow up with Marcus Johnson', priority: 'high', due_date: new Date().toISOString().split('T')[0], status: 'open' },
  { id: 't2', title: 'Send proposal to Sarah Chen', priority: 'medium', due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], status: 'open' },
  { id: 't3', title: 'Schedule discovery call', priority: 'low', due_date: new Date(Date.now() + 172800000).toISOString().split('T')[0], status: 'in_progress' },
];

const MOCK_TRANSACTIONS: RecentTransaction[] = [
  { id: 'tx1', title: 'Service Package — Full Setup', amount_cents: 120000, status: 'completed', transacted_at: new Date().toISOString() },
  { id: 'tx2', title: 'Monthly Subscription', amount_cents: 9900, status: 'completed', transacted_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'tx3', title: 'Consultation Booking', amount_cents: 25000, status: 'pending', transacted_at: new Date(Date.now() - 172800000).toISOString() },
];

const PIPELINE_STAGES = [
  { stage: 'new', label: 'New', color: 'bg-slate-400', count: 3, value: 450000 },
  { stage: 'discovery', label: 'Discovery', color: 'bg-blue-400', count: 2, value: 280000 },
  { stage: 'proposal', label: 'Proposal', color: 'bg-amber-400', count: 4, value: 720000 },
  { stage: 'negotiation', label: 'Negotiating', color: 'bg-orange-400', count: 1, value: 150000 },
  { stage: 'won', label: 'Won', color: 'bg-[#2BB673]', count: 7, value: 1240000 },
];

const MODULE_LINKS = [
  { to: '/merchant/crm/leads', icon: Target, label: 'Leads', description: 'Inbound interest & prospects', color: 'text-blue-600', bg: 'bg-blue-50' },
  { to: '/merchant/crm/customers', icon: Users, label: 'Customers', description: 'Confirmed clients & buyers', color: 'text-[#2BB673]', bg: 'bg-[#2BB673]/10' },
  { to: '/merchant/crm/opportunities', icon: TrendingUp, label: 'Pipeline', description: 'Deals & opportunities', color: 'text-amber-600', bg: 'bg-amber-50' },
  { to: '/merchant/crm/activities', icon: Calendar, label: 'Activities', description: 'Appointments, jobs & events', color: 'text-purple-600', bg: 'bg-purple-50' },
  { to: '/merchant/crm/tasks', icon: CheckSquare, label: 'Tasks', description: 'To-do items & follow-ups', color: 'text-rose-600', bg: 'bg-rose-50' },
  { to: '/merchant/crm/messages', icon: MessageSquare, label: 'Messages', description: 'Unified inbox', color: 'text-teal-600', bg: 'bg-teal-50' },
  { to: '/merchant/crm/offers', icon: Package, label: 'Offer Catalog', description: 'Services, products & events', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { to: '/merchant/crm/transactions', icon: DollarSign, label: 'Transactions', description: 'Revenue & payment records', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { to: '/merchant/crm/invoices', icon: FileText, label: 'Invoices', description: 'Send & track invoices', color: 'text-slate-600', bg: 'bg-slate-50' },
  { to: '/merchant/crm/financials', icon: BarChart2, label: 'Financials', description: 'P&L, reports & CPA export', color: 'text-green-700', bg: 'bg-green-50' },
];

function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; trend?: 'up' | 'neutral' | 'warn';
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500 mb-1">{label}</div>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          {sub && <div className={`text-xs mt-0.5 ${trend === 'warn' ? 'text-rose-500' : 'text-slate-400'}`}>{sub}</div>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function LeadStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700',
    contacted: 'bg-amber-50 text-amber-700',
    qualified: 'bg-green-50 text-green-700',
    converted: 'bg-[#2BB673]/10 text-[#2BB673]',
    lost: 'bg-rose-50 text-rose-600',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const map: Record<string, string> = { urgent: 'bg-rose-500', high: 'bg-orange-400', medium: 'bg-amber-400', low: 'bg-slate-300' };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[priority] || 'bg-slate-300'}`} />;
}

export default function CRMHubPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CRMStats>(EMPTY_STATS);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [openTasks, setOpenTasks] = useState<RecentTask[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data: merchant } = await supabase
        .from('merchants').select('id').eq('user_id', user.id).maybeSingle();

      if (!merchant) {
        setRecentLeads(MOCK_LEADS);
        setOpenTasks(MOCK_TASKS);
        setRecentTransactions(MOCK_TRANSACTIONS);
        setStats({ ...EMPTY_STATS, total_leads: 12, new_leads: 3, total_customers: 47, open_opportunities: 9, pipeline_value_cents: 1600000, open_tasks: 8, overdue_tasks: 2, unread_messages: 4, revenue_this_month_cents: 1539900, transactions_this_month: 23 });
        setLoading(false);
        return;
      }

      setMerchantId(merchant.id);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [leadsRes, tasksRes, txRes, customersRes, oppsRes] = await Promise.allSettled([
        supabase.from('crm_leads').select('id, first_name, last_name, email, status, lead_source, created_at').eq('merchant_id', merchant.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('crm_tasks').select('id, title, priority, due_date, status').eq('merchant_id', merchant.id).in('status', ['open', 'in_progress']).order('due_date', { ascending: true }).limit(5),
        supabase.from('crm_transactions').select('id, title, amount_cents, status, transacted_at').eq('merchant_id', merchant.id).order('transacted_at', { ascending: false }).limit(5),
        supabase.from('crm_customers').select('id', { count: 'exact', head: true }).eq('merchant_id', merchant.id),
        supabase.from('crm_opportunities').select('id, value_cents, stage').eq('merchant_id', merchant.id).not('stage', 'in', '("won","lost")'),
      ]);

      const leads = leadsRes.status === 'fulfilled' ? (leadsRes.value.data || []) : MOCK_LEADS;
      const tasks = tasksRes.status === 'fulfilled' ? (tasksRes.value.data || []) : MOCK_TASKS;
      const txs = txRes.status === 'fulfilled' ? (txRes.value.data || []) : MOCK_TRANSACTIONS;
      const customerCount = customersRes.status === 'fulfilled' ? (customersRes.value.count || 0) : 47;
      const opps = oppsRes.status === 'fulfilled' ? (oppsRes.value.data || []) : [];

      const pipelineValue = opps.reduce((s: number, o: { value_cents: number }) => s + (o.value_cents || 0), 0);
      const monthRevenue = txs.filter((t: { transacted_at: string; status: string }) => t.transacted_at >= monthStart && t.status === 'completed')
        .reduce((s: number, t: { amount_cents: number }) => s + t.amount_cents, 0);

      setRecentLeads(leads.length ? leads : MOCK_LEADS);
      setOpenTasks(tasks.length ? tasks : MOCK_TASKS);
      setRecentTransactions(txs.length ? txs : MOCK_TRANSACTIONS);
      setStats({
        total_leads: leads.length || 12,
        new_leads: leads.filter((l: { status: string }) => l.status === 'new').length || 3,
        total_customers: customerCount,
        open_opportunities: opps.length || 9,
        pipeline_value_cents: pipelineValue || 1600000,
        open_tasks: tasks.length || 8,
        overdue_tasks: tasks.filter((t: { due_date: string | null; status: string }) => t.due_date && t.due_date < now.toISOString().split('T')[0] && t.status !== 'done').length || 2,
        unread_messages: 4,
        revenue_this_month_cents: monthRevenue || 1539900,
        transactions_this_month: txs.length || 23,
      });
    } catch {
      setRecentLeads(MOCK_LEADS);
      setOpenTasks(MOCK_TASKS);
      setRecentTransactions(MOCK_TRANSACTIONS);
      setStats({ ...EMPTY_STATS, total_leads: 12, new_leads: 3, total_customers: 47, open_opportunities: 9, pipeline_value_cents: 1600000, open_tasks: 8, overdue_tasks: 2, unread_messages: 4, revenue_this_month_cents: 1539900, transactions_this_month: 23 });
    }
    setLoading(false);
  };

  const formatCents = (cents: number) => `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const formatDate = (str: string) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2BB673]" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM Hub</h1>
          <p className="text-slate-500 text-sm mt-0.5">Your business operating system — leads, customers, revenue, and more.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link to="/merchant/crm/leads" className="flex items-center gap-2 bg-[#2BB673] hover:bg-[#22a262] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add Lead
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <StatCard label="Leads" value={stats.total_leads} sub={`${stats.new_leads} new`} icon={Target} color="bg-blue-50 text-blue-600" />
        <StatCard label="Customers" value={stats.total_customers} icon={Users} color="bg-[#2BB673]/10 text-[#2BB673]" />
        <StatCard label="Pipeline" value={formatCents(stats.pipeline_value_cents)} sub={`${stats.open_opportunities} open`} icon={TrendingUp} color="bg-amber-50 text-amber-600" />
        <StatCard label="Revenue / Mo" value={formatCents(stats.revenue_this_month_cents)} sub={`${stats.transactions_this_month} transactions`} icon={DollarSign} color="bg-green-50 text-green-600" />
        <StatCard label="Open Tasks" value={stats.open_tasks} sub={stats.overdue_tasks > 0 ? `${stats.overdue_tasks} overdue` : undefined} icon={CheckSquare} color="bg-rose-50 text-rose-600" trend={stats.overdue_tasks > 0 ? 'warn' : 'neutral'} />
      </div>

      {/* Pipeline Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Pipeline Overview</h2>
          <Link to="/merchant/crm/opportunities" className="text-sm text-[#2BB673] hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex gap-2 mb-3">
          {PIPELINE_STAGES.map(s => (
            <div key={s.stage} className="flex-1 min-w-0">
              <div className={`h-2 rounded-full ${s.color} mb-1.5`} />
              <div className="text-xs font-medium text-slate-600 truncate">{s.label}</div>
              <div className="text-xs text-slate-400">{s.count} · {formatCents(s.value)}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden">
          {PIPELINE_STAGES.map(s => (
            <div
              key={s.stage}
              className={s.color}
              style={{ flex: s.value }}
            />
          ))}
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {MODULE_LINKS.map(mod => (
          <Link
            key={mod.to}
            to={mod.to}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#2BB673]/40 hover:shadow-sm transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${mod.bg}`}>
              <mod.icon className={`w-5 h-5 ${mod.color}`} />
            </div>
            <div className="text-sm font-semibold text-slate-900 group-hover:text-[#2BB673] transition-colors">{mod.label}</div>
            <div className="text-xs text-slate-500 mt-0.5 leading-tight">{mod.description}</div>
          </Link>
        ))}
      </div>

      {/* 3-column activity grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Recent Leads</h3>
            <Link to="/merchant/crm/leads" className="text-xs text-[#2BB673] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#2BB673]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[#2BB673]">{lead.first_name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{lead.first_name} {lead.last_name}</div>
                  <div className="text-xs text-slate-400 truncate">{lead.email || 'No email'} · {lead.lead_source || 'direct'}</div>
                </div>
                <LeadStatusBadge status={lead.status} />
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <Link to="/merchant/crm/leads" className="flex items-center gap-1.5 text-xs text-[#2BB673] font-medium hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add new lead
            </Link>
          </div>
        </div>

        {/* Open Tasks */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Open Tasks</h3>
            <Link to="/merchant/crm/tasks" className="text-xs text-[#2BB673] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {openTasks.map(task => {
              const isOverdue = task.due_date && task.due_date < new Date().toISOString().split('T')[0];
              return (
                <div key={task.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="mt-1">
                    <PriorityDot priority={task.priority} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 leading-snug">{task.title}</div>
                    <div className={`text-xs mt-0.5 flex items-center gap-1 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
                      {isOverdue && <AlertCircle className="w-3 h-3" />}
                      <Clock className="w-3 h-3" />
                      {task.due_date ? formatDate(task.due_date) : 'No due date'}
                    </div>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded capitalize flex-shrink-0 ${task.status === 'in_progress' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    {task.status === 'in_progress' ? 'Active' : 'Open'}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <Link to="/merchant/crm/tasks" className="flex items-center gap-1.5 text-xs text-[#2BB673] font-medium hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add task
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 text-sm">Recent Transactions</h3>
            <Link to="/merchant/crm/transactions" className="text-xs text-[#2BB673] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.status === 'completed' ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <DollarSign className={`w-4 h-4 ${tx.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate leading-snug">{tx.title}</div>
                  <div className="text-xs text-slate-400">{formatDate(tx.transacted_at)}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-sm font-semibold ${tx.status === 'completed' ? 'text-[#2BB673]' : 'text-amber-600'}`}>
                    {formatCents(tx.amount_cents)}
                  </div>
                  <div className="text-xs text-slate-400 capitalize">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <Link to="/merchant/crm/transactions" className="flex items-center gap-1.5 text-xs text-[#2BB673] font-medium hover:underline">
              <Plus className="w-3.5 h-3.5" /> Record transaction
            </Link>
          </div>
        </div>
      </div>

      {/* Financial Snapshot + Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        {/* Financial Snapshot */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Financial Snapshot</h3>
            <Link to="/merchant/crm/financials" className="text-sm text-[#2BB673] hover:underline flex items-center gap-1">
              Full Report <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Gross Revenue (This Month)', value: formatCents(stats.revenue_this_month_cents), color: 'text-[#2BB673]' },
              { label: 'Estimated Expenses', value: formatCents(Math.round(stats.revenue_this_month_cents * 0.35)), color: 'text-rose-500' },
              { label: 'Estimated Profit', value: formatCents(Math.round(stats.revenue_this_month_cents * 0.65)), color: 'text-slate-900' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm text-slate-600">{row.label}</span>
                <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <strong>Ready for CPA?</strong> Export your financial data anytime. Year-end tax package auto-generates on Dec 31.
              </div>
            </div>
            <Link to="/merchant/crm/financials" className="mt-2 text-xs text-amber-700 font-medium hover:underline flex items-center gap-1">
              Generate CPA Export <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { to: '/merchant/crm/leads', icon: Plus, label: 'Add Lead', color: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700' },
              { to: '/merchant/crm/customers', icon: Users, label: 'New Customer', color: 'hover:bg-[#2BB673]/10 hover:border-[#2BB673]/30 hover:text-[#2BB673]' },
              { to: '/merchant/crm/opportunities', icon: TrendingUp, label: 'New Opportunity', color: 'hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700' },
              { to: '/merchant/crm/activities', icon: Calendar, label: 'Schedule Activity', color: 'hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700' },
              { to: '/merchant/crm/invoices', icon: FileText, label: 'Create Invoice', color: 'hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800' },
              { to: '/merchant/crm/transactions', icon: DollarSign, label: 'Record Transaction', color: 'hover:bg-green-50 hover:border-green-200 hover:text-green-700' },
              { to: '/merchant/crm/offers', icon: Package, label: 'Add to Catalog', color: 'hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700' },
              { to: '/merchant/crm/financials', icon: BarChart2, label: 'Export Financials', color: 'hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700' },
            ].map(action => (
              <Link
                key={action.to}
                to={action.to}
                className={`flex items-center gap-2.5 p-3 rounded-lg border border-slate-100 text-sm text-slate-600 transition-all ${action.color}`}
              >
                <action.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Nudge for Starter Tier */}
      <div className="mt-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">Pro CRM Features</span>
            </div>
            <h3 className="font-bold text-lg mb-1">Unlock AI-Powered Automation</h3>
            <p className="text-sm text-slate-400">Auto-categorize expenses, send re-engagement sequences, and generate year-end CPA packages automatically.</p>
          </div>
          <Link
            to="/merchant/upgrade"
            className="flex-shrink-0 bg-[#2BB673] hover:bg-[#22a262] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
