import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, DollarSign, Plus, Search, Filter, CreditCard as Edit2, Trash2, CheckCircle, Clock, Send, AlertCircle, Globe, FileText, Download, ChevronDown, ChevronUp, X, Save, Eye, Calendar, TrendingUp, Banknote } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Contractor = {
  id: string;
  full_name: string;
  email: string;
  country: string;
  timezone: string;
  role: string;
  specialties: string[];
  hourly_rate_cents: number | null;
  monthly_rate_cents: number | null;
  currency: string;
  payment_method: string;
  payment_details: Record<string, string>;
  status: 'active' | 'inactive' | 'paused';
  start_date: string | null;
  notes: string | null;
  created_at: string;
};

type PayPeriod = {
  id: string;
  period_label: string;
  period_start: string;
  period_end: string;
  frequency: string;
  status: 'draft' | 'approved' | 'paid' | 'cancelled';
  total_amount_usd_cents: number;
  contractor_count: number;
  notes: string | null;
  approved_at: string | null;
  paid_at: string | null;
  created_at: string;
};

type Payment = {
  id: string;
  contractor_id: string;
  pay_period_id: string;
  hours_worked: number | null;
  amount_usd_cents: number;
  local_currency_amount: number | null;
  local_currency: string | null;
  exchange_rate: number | null;
  payment_method_used: string | null;
  payment_reference: string | null;
  status: 'pending' | 'sent' | 'confirmed' | 'failed';
  notes: string | null;
  sent_at: string | null;
  confirmed_at: string | null;
  contractor?: Contractor;
};

const PAYMENT_METHODS: Record<string, string> = {
  wise: 'Wise',
  paypal: 'PayPal',
  bank_wire: 'Bank Wire',
  gcash: 'GCash',
  remitly: 'Remitly',
  western_union: 'Western Union',
  other: 'Other',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-600',
  paused: 'bg-amber-100 text-amber-700',
  draft: 'bg-slate-100 text-slate-600',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
  sent: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (cents: number) => `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtRate = (cents: number | null, label: string) =>
  cents ? `${fmt(cents)}/${label}` : '—';

// ─── Main Component ───────────────────────────────────────────────────────────

type View = 'contractors' | 'pay-periods' | 'pay-period-detail';

export default function InternationalPayrollPage() {
  const [view, setView] = useState<View>('contractors');
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PayPeriod | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [showCreatePeriod, setShowCreatePeriod] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  useEffect(() => {
    fetchContractors();
    fetchPayPeriods();
  }, []);

  useEffect(() => {
    if (selectedPeriod) fetchPayments(selectedPeriod.id);
  }, [selectedPeriod]);

  // ── Data fetching ──

  const fetchContractors = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('intl_contractors')
      .select('*')
      .order('full_name');
    setContractors((data as Contractor[]) ?? []);
    setLoading(false);
  };

  const fetchPayPeriods = async () => {
    const { data } = await supabase
      .from('intl_contractor_pay_periods')
      .select('*')
      .order('period_start', { ascending: false });
    setPayPeriods((data as PayPeriod[]) ?? []);
  };

  const fetchPayments = async (periodId: string) => {
    const { data } = await supabase
      .from('intl_contractor_payments')
      .select('*, contractor:intl_contractors(*)')
      .eq('pay_period_id', periodId)
      .order('created_at');
    setPayments((data as Payment[]) ?? []);
  };

  // ── Stats ──

  const activeCount = contractors.filter(c => c.status === 'active').length;
  const monthlyBurn = contractors
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + (c.monthly_rate_cents ?? (c.hourly_rate_cents ?? 0) * 160), 0);
  const ytdPaid = payPeriods
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.total_amount_usd_cents, 0);
  const pendingPeriods = payPeriods.filter(p => p.status === 'draft' || p.status === 'approved').length;

  const filteredContractors = contractors.filter(c => {
    const matchSearch = !searchQuery ||
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openPeriodDetail = (period: PayPeriod) => {
    setSelectedPeriod(period);
    setView('pay-period-detail');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Globe className="w-6 h-6 text-[#2BB673]" />
              <h1 className="text-2xl font-bold text-slate-900">International Contractors</h1>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Business Expense
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Manage overseas contractor payments — Philippines & other countries. Not 1099. Fully deductible business expense.
            </p>
          </div>
          <div className="flex gap-3">
            {view === 'contractors' && (
              <button
                onClick={() => setShowAddContractor(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2BB673] text-white rounded-lg hover:bg-[#25a062] transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Contractor
              </button>
            )}
            {view === 'pay-periods' && (
              <button
                onClick={() => setShowCreatePeriod(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#2BB673] text-white rounded-lg hover:bg-[#25a062] transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                New Pay Period
              </button>
            )}
            {view === 'pay-period-detail' && (
              <>
                <button
                  onClick={() => { setView('pay-periods'); setSelectedPeriod(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium"
                >
                  ← Back
                </button>
                {selectedPeriod?.status === 'draft' && (
                  <button
                    onClick={() => setShowAddPayment(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2BB673] text-white rounded-lg hover:bg-[#25a062] transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Payment
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Active Contractors', value: activeCount, icon: Users, color: 'text-[#2BB673]', bg: 'bg-[#2BB673]/10' },
            { label: 'Est. Monthly Cost', value: fmt(monthlyBurn), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'YTD Paid Out', value: fmt(ytdPaid), icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending Pay Runs', value: pendingPeriods, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 mt-6 bg-slate-100 rounded-xl p-1 w-fit">
          {[
            { id: 'contractors', label: 'Contractors', icon: Users },
            { id: 'pay-periods', label: 'Pay Periods', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setView(tab.id as View); setSelectedPeriod(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                (view === tab.id || (view === 'pay-period-detail' && tab.id === 'pay-periods'))
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* ── Contractors View ── */}
        {view === 'contractors' && (
          <ContractorsView
            contractors={filteredContractors}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onEdit={setEditingContractor}
            onRefresh={fetchContractors}
          />
        )}

        {/* ── Pay Periods View ── */}
        {view === 'pay-periods' && (
          <PayPeriodsView
            payPeriods={payPeriods}
            onOpen={openPeriodDetail}
            onRefresh={fetchPayPeriods}
          />
        )}

        {/* ── Pay Period Detail ── */}
        {view === 'pay-period-detail' && selectedPeriod && (
          <PayPeriodDetail
            period={selectedPeriod}
            payments={payments}
            contractors={contractors}
            onRefresh={() => {
              fetchPayments(selectedPeriod.id);
              fetchPayPeriods();
            }}
            onPeriodUpdate={(updated) => setSelectedPeriod(updated)}
          />
        )}
      </div>

      {/* ── Modals ── */}
      {(showAddContractor || editingContractor) && (
        <ContractorModal
          contractor={editingContractor}
          onClose={() => { setShowAddContractor(false); setEditingContractor(null); }}
          onSave={() => { setShowAddContractor(false); setEditingContractor(null); fetchContractors(); }}
        />
      )}

      {showCreatePeriod && (
        <CreatePayPeriodModal
          contractors={contractors.filter(c => c.status === 'active')}
          onClose={() => setShowCreatePeriod(false)}
          onSave={() => { setShowCreatePeriod(false); fetchPayPeriods(); }}
        />
      )}

      {showAddPayment && selectedPeriod && (
        <AddPaymentModal
          period={selectedPeriod}
          contractors={contractors.filter(c => c.status === 'active')}
          existingPayments={payments}
          onClose={() => setShowAddPayment(false)}
          onSave={() => { setShowAddPayment(false); fetchPayments(selectedPeriod.id); fetchPayPeriods(); }}
        />
      )}
    </div>
  );
}

// ─── Contractors View ─────────────────────────────────────────────────────────

function ContractorsView({
  contractors, loading, searchQuery, setSearchQuery,
  statusFilter, setStatusFilter, onEdit, onRefresh
}: {
  contractors: Contractor[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  onEdit: (c: Contractor) => void;
  onRefresh: () => void;
}) {
  const handleDelete = async (id: string) => {
    if (!confirm('Remove this contractor? This cannot be undone.')) return;
    await supabase.from('intl_contractors').delete().eq('id', id);
    onRefresh();
  };

  const toggleStatus = async (c: Contractor) => {
    const next = c.status === 'active' ? 'paused' : 'active';
    await supabase.from('intl_contractors').update({ status: next }).eq('id', c.id);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, email..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {['all', 'active', 'paused', 'inactive'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                statusFilter === s ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2BB673]"></div>
        </div>
      ) : contractors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No contractors found</p>
          <p className="text-sm text-slate-400 mt-1">Add your first international contractor to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contractors.map(c => (
            <ContractorCard
              key={c.id}
              contractor={c}
              onEdit={() => onEdit(c)}
              onDelete={() => handleDelete(c.id)}
              onToggleStatus={() => toggleStatus(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ContractorCard({ contractor: c, onEdit, onDelete, onToggleStatus }: {
  contractor: Contractor;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const initials = c.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'];
  const color = colors[c.full_name.charCodeAt(0) % colors.length];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {initials}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{c.full_name}</div>
            <div className="text-sm text-slate-500">{c.role}</div>
            <div className="text-xs text-slate-400 mt-0.5">{c.email}</div>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[c.status]}`}>
          {c.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-sm">
        <div>
          <div className="text-xs text-slate-400 mb-0.5">Country</div>
          <div className="font-medium text-slate-700">{c.country}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-0.5">Rate</div>
          <div className="font-medium text-slate-700">
            {c.hourly_rate_cents ? fmtRate(c.hourly_rate_cents, 'hr') : fmtRate(c.monthly_rate_cents, 'mo')}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-0.5">Pays Via</div>
          <div className="font-medium text-slate-700">{PAYMENT_METHODS[c.payment_method] ?? c.payment_method}</div>
        </div>
      </div>

      {c.specialties && c.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {c.specialties.map(s => (
            <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={onToggleStatus}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            c.status === 'active'
              ? 'text-amber-600 hover:bg-amber-50 border-amber-200'
              : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
          }`}
        >
          {c.status === 'active' ? 'Pause' : 'Activate'}
        </button>
        <button
          onClick={onDelete}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── Pay Periods View ─────────────────────────────────────────────────────────

function PayPeriodsView({ payPeriods, onOpen, onRefresh }: {
  payPeriods: PayPeriod[];
  onOpen: (p: PayPeriod) => void;
  onRefresh: () => void;
}) {
  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this pay period?')) return;
    await supabase.from('intl_contractor_pay_periods').update({ status: 'cancelled' }).eq('id', id);
    onRefresh();
  };

  return (
    <div className="space-y-3">
      {payPeriods.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No pay periods yet</p>
          <p className="text-sm text-slate-400 mt-1">Create your first pay run to get started.</p>
        </div>
      ) : (
        payPeriods.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-semibold text-slate-900">{p.period_label}</div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    {new Date(p.period_start).toLocaleDateString()} – {new Date(p.period_end).toLocaleDateString()}
                    <span className="ml-2 text-slate-400">· {p.frequency}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-bold text-lg text-slate-900">{fmt(p.total_amount_usd_cents)}</div>
                  <div className="text-xs text-slate-400">{p.contractor_count} contractors</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[p.status]}`}>
                  {p.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpen(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                  {(p.status === 'draft' || p.status === 'approved') && (
                    <button
                      onClick={() => handleCancel(p.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {p.paid_at && (
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                Paid on {new Date(p.paid_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ─── Pay Period Detail ────────────────────────────────────────────────────────

function PayPeriodDetail({ period, payments, contractors, onRefresh, onPeriodUpdate }: {
  period: PayPeriod;
  payments: Payment[];
  contractors: Contractor[];
  onRefresh: () => void;
  onPeriodUpdate: (p: PayPeriod) => void;
}) {
  const [updating, setUpdating] = useState(false);

  const totalUsd = payments.reduce((sum, p) => sum + p.amount_usd_cents, 0);

  const approvePeriod = async () => {
    setUpdating(true);
    const { data } = await supabase
      .from('intl_contractor_pay_periods')
      .update({ status: 'approved', approved_at: new Date().toISOString(), total_amount_usd_cents: totalUsd, contractor_count: payments.length })
      .eq('id', period.id)
      .select()
      .single();
    if (data) onPeriodUpdate(data as PayPeriod);
    setUpdating(false);
    onRefresh();
  };

  const markPaid = async () => {
    if (!confirm('Mark this entire pay period as paid? This confirms all payments were sent.')) return;
    setUpdating(true);
    const { data } = await supabase
      .from('intl_contractor_pay_periods')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', period.id)
      .select()
      .single();
    // Also mark all pending/sent payments as confirmed
    await supabase
      .from('intl_contractor_payments')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('pay_period_id', period.id)
      .in('status', ['pending', 'sent']);
    if (data) onPeriodUpdate(data as PayPeriod);
    setUpdating(false);
    onRefresh();
  };

  const updatePaymentStatus = async (paymentId: string, status: string) => {
    const update: Record<string, string> = { status };
    if (status === 'sent') update.sent_at = new Date().toISOString();
    if (status === 'confirmed') update.confirmed_at = new Date().toISOString();
    await supabase.from('intl_contractor_payments').update(update).eq('id', paymentId);
    onRefresh();
  };

  const updateReference = async (paymentId: string, ref: string) => {
    await supabase.from('intl_contractor_payments').update({ payment_reference: ref }).eq('id', paymentId);
    onRefresh();
  };

  const removePayment = async (paymentId: string) => {
    await supabase.from('intl_contractor_payments').delete().eq('id', paymentId);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Period header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{period.period_label}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {new Date(period.period_start).toLocaleDateString()} – {new Date(period.period_end).toLocaleDateString()}
              &nbsp;·&nbsp;{period.frequency}&nbsp;·&nbsp;
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[period.status]}`}>
                {period.status}
              </span>
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">{fmt(totalUsd)}</div>
              <div className="text-sm text-slate-400">{payments.length} contractors</div>
            </div>
            {period.status === 'draft' && payments.length > 0 && (
              <button
                onClick={approvePeriod}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Run
              </button>
            )}
            {period.status === 'approved' && (
              <button
                onClick={markPaid}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Mark All Paid
              </button>
            )}
          </div>
        </div>

        {period.notes && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">{period.notes}</div>
        )}
      </div>

      {/* Payment rows */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Payment Details</h3>
          <div className="text-xs text-slate-400">
            Tax note: These are international contractor payments — record as business expense, no 1099 required.
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No payments added yet. Add contractors to this pay run.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {payments.map(payment => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                periodStatus={period.status}
                onStatusChange={(s) => updatePaymentStatus(payment.id, s)}
                onReferenceChange={(r) => updateReference(payment.id, r)}
                onRemove={() => removePayment(payment.id)}
              />
            ))}
          </div>
        )}

        {payments.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="font-medium text-slate-700">Total Pay Run</span>
            <span className="text-xl font-bold text-slate-900">{fmt(totalUsd)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentRow({ payment, periodStatus, onStatusChange, onReferenceChange, onRemove }: {
  payment: Payment;
  periodStatus: string;
  onStatusChange: (s: string) => void;
  onReferenceChange: (r: string) => void;
  onRemove: () => void;
}) {
  const [editRef, setEditRef] = useState(false);
  const [ref, setRef] = useState(payment.payment_reference ?? '');
  const contractor = payment.contractor;
  const initials = contractor?.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?';
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'];
  const color = colors[(contractor?.full_name.charCodeAt(0) ?? 0) % colors.length];

  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Contractor info */}
        <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-900 text-sm">{contractor?.full_name ?? 'Unknown'}</div>
          <div className="text-xs text-slate-400">{contractor?.role} · {contractor?.country}</div>
        </div>

        {/* Hours */}
        <div className="text-right w-20">
          <div className="text-xs text-slate-400">Hours</div>
          <div className="font-medium text-sm text-slate-700">{payment.hours_worked ?? '—'}</div>
        </div>

        {/* Amount */}
        <div className="text-right w-28">
          <div className="text-xs text-slate-400">Amount (USD)</div>
          <div className="font-bold text-slate-900">{fmt(payment.amount_usd_cents)}</div>
          {payment.local_currency_amount && payment.local_currency && (
            <div className="text-xs text-slate-400">
              {payment.local_currency_amount.toLocaleString()} {payment.local_currency}
            </div>
          )}
        </div>

        {/* Method */}
        <div className="text-right w-24">
          <div className="text-xs text-slate-400">Method</div>
          <div className="text-sm text-slate-700">{PAYMENT_METHODS[payment.payment_method_used ?? ''] ?? payment.payment_method_used ?? '—'}</div>
        </div>

        {/* Reference */}
        <div className="w-36">
          <div className="text-xs text-slate-400 mb-0.5">Ref #</div>
          {editRef ? (
            <div className="flex gap-1">
              <input
                value={ref}
                onChange={e => setRef(e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#2BB673]"
                placeholder="Transaction ID"
              />
              <button
                onClick={() => { onReferenceChange(ref); setEditRef(false); }}
                className="text-[#2BB673] hover:text-[#25a062]"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditRef(true)}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 group"
            >
              <span>{payment.payment_reference || 'Add ref...'}</span>
              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </button>
          )}
        </div>

        {/* Status */}
        <div className="w-28">
          {periodStatus === 'draft' || periodStatus === 'approved' ? (
            <select
              value={payment.status}
              onChange={e => onStatusChange(e.target.value)}
              className={`text-xs px-2 py-1 rounded-lg border font-medium focus:outline-none cursor-pointer ${STATUS_COLORS[payment.status]} border-transparent`}
            >
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="confirmed">Confirmed</option>
              <option value="failed">Failed</option>
            </select>
          ) : (
            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[payment.status]}`}>
              {payment.status}
            </span>
          )}
        </div>

        {/* Actions */}
        {periodStatus === 'draft' && (
          <button
            onClick={onRemove}
            className="text-slate-300 hover:text-red-500 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {payment.notes && (
        <div className="ml-13 mt-2 text-xs text-slate-400 pl-12">{payment.notes}</div>
      )}
    </div>
  );
}

// ─── Contractor Modal ─────────────────────────────────────────────────────────

function ContractorModal({ contractor, onClose, onSave }: {
  contractor: Contractor | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    full_name: contractor?.full_name ?? '',
    email: contractor?.email ?? '',
    country: contractor?.country ?? 'Philippines',
    timezone: contractor?.timezone ?? 'Asia/Manila',
    role: contractor?.role ?? '',
    specialties: contractor?.specialties?.join(', ') ?? '',
    hourly_rate_cents: contractor?.hourly_rate_cents ? String(contractor.hourly_rate_cents / 100) : '',
    monthly_rate_cents: contractor?.monthly_rate_cents ? String(contractor.monthly_rate_cents / 100) : '',
    currency: contractor?.currency ?? 'PHP',
    payment_method: contractor?.payment_method ?? 'wise',
    payment_account: (contractor?.payment_details as any)?.account ?? '',
    status: contractor?.status ?? 'active',
    start_date: contractor?.start_date ?? '',
    notes: contractor?.notes ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const f = (k: string) => (v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.full_name || !form.email || !form.role) {
      setError('Name, email, and role are required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      full_name: form.full_name,
      email: form.email,
      country: form.country,
      timezone: form.timezone,
      role: form.role,
      specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean),
      hourly_rate_cents: form.hourly_rate_cents ? Math.round(parseFloat(form.hourly_rate_cents) * 100) : null,
      monthly_rate_cents: form.monthly_rate_cents ? Math.round(parseFloat(form.monthly_rate_cents) * 100) : null,
      currency: form.currency,
      payment_method: form.payment_method,
      payment_details: form.payment_account ? { account: form.payment_account } : {},
      status: form.status as Contractor['status'],
      start_date: form.start_date || null,
      notes: form.notes || null,
      updated_at: new Date().toISOString(),
    };

    if (contractor) {
      await supabase.from('intl_contractors').update(payload).eq('id', contractor.id);
    } else {
      await supabase.from('intl_contractors').insert(payload);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {contractor ? 'Edit Contractor' : 'Add International Contractor'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
            International contractors are <strong>not US employees</strong> and do <strong>not receive 1099s</strong>. Payments are recorded as a deductible business expense.
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name *" value={form.full_name} onChange={f('full_name')} placeholder="Maria Santos" />
            <Field label="Email *" value={form.email} onChange={f('email')} type="email" placeholder="maria@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role / Job Title *" value={form.role} onChange={f('role')} placeholder="Virtual Assistant" />
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select value={form.status} onChange={e => f('status')(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Country" value={form.country} onChange={f('country')} placeholder="Philippines" />
            <Field label="Timezone" value={form.timezone} onChange={f('timezone')} placeholder="Asia/Manila" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Hourly Rate (USD)" value={form.hourly_rate_cents} onChange={f('hourly_rate_cents')} type="number" placeholder="5.00" />
            <Field label="Monthly Rate (USD)" value={form.monthly_rate_cents} onChange={f('monthly_rate_cents')} type="number" placeholder="500.00" />
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Local Currency</label>
              <select value={form.currency} onChange={e => f('currency')(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30">
                <option value="PHP">PHP (Philippine Peso)</option>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="MXN">MXN</option>
                <option value="BDT">BDT</option>
                <option value="NGN">NGN</option>
                <option value="PKR">PKR</option>
                <option value="VND">VND</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Payment Method</label>
              <select value={form.payment_method} onChange={e => f('payment_method')(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30">
                {Object.entries(PAYMENT_METHODS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <Field label="Account / Email for Payment" value={form.payment_account} onChange={f('payment_account')} placeholder="email@wise.com" />
          </div>
          <Field label="Specialties (comma-separated)" value={form.specialties} onChange={f('specialties')} placeholder="Social Media, Data Entry, Copywriting" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date" value={form.start_date} onChange={f('start_date')} type="date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Internal Notes</label>
            <textarea
              value={form.notes}
              onChange={e => f('notes')(e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30 resize-none"
              placeholder="Any notes about this contractor..."
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#2BB673] text-white rounded-lg hover:bg-[#25a062] text-sm font-medium disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : contractor ? 'Save Changes' : 'Add Contractor'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Pay Period Modal ──────────────────────────────────────────────────

function CreatePayPeriodModal({ contractors, onClose, onSave }: {
  contractors: Contractor[];
  onClose: () => void;
  onSave: () => void;
}) {
  const now = new Date();
  const [form, setForm] = useState({
    period_label: '',
    period_start: now.toISOString().split('T')[0],
    period_end: new Date(now.getTime() + 6 * 86400000).toISOString().split('T')[0],
    frequency: 'weekly',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.period_label || !form.period_start || !form.period_end) return;
    setSaving(true);
    await supabase.from('intl_contractor_pay_periods').insert({
      ...form,
      status: 'draft',
      total_amount_usd_cents: 0,
      contractor_count: 0,
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Create Pay Period</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Pay Period Label *" value={form.period_label} onChange={v => setForm(p => ({ ...p, period_label: v }))} placeholder="April 2026 — Week 1" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Period Start" value={form.period_start} onChange={v => setForm(p => ({ ...p, period_start: v }))} type="date" />
            <Field label="Period End" value={form.period_end} onChange={v => setForm(p => ({ ...p, period_end: v }))} type="date" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Frequency</label>
            <select value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30 resize-none" placeholder="Any notes for this pay run..." />
          </div>
          <div className="text-xs text-slate-400">
            After creating the pay period, open it to add individual contractor payments.
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#2BB673] text-white rounded-lg hover:bg-[#25a062] text-sm font-medium disabled:opacity-50 transition-colors">
            {saving ? 'Creating...' : 'Create Pay Period'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Payment Modal ────────────────────────────────────────────────────────

function AddPaymentModal({ period, contractors, existingPayments, onClose, onSave }: {
  period: PayPeriod;
  contractors: Contractor[];
  existingPayments: Payment[];
  onClose: () => void;
  onSave: () => void;
}) {
  const alreadyAdded = new Set(existingPayments.map(p => p.contractor_id));
  const available = contractors.filter(c => !alreadyAdded.has(c.id));

  const [selectedId, setSelectedId] = useState(available[0]?.id ?? '');
  const [hours, setHours] = useState('');
  const [amountUsd, setAmountUsd] = useState('');
  const [localAmount, setLocalAmount] = useState('');
  const [localCurrency, setLocalCurrency] = useState('PHP');
  const [exchangeRate, setExchangeRate] = useState('');
  const [method, setMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedContractor = contractors.find(c => c.id === selectedId);

  // Auto-fill when contractor changes
  useEffect(() => {
    if (selectedContractor) {
      setLocalCurrency(selectedContractor.currency);
      setMethod(selectedContractor.payment_method);
      if (hours && selectedContractor.hourly_rate_cents) {
        const usd = (parseFloat(hours) * selectedContractor.hourly_rate_cents) / 100;
        setAmountUsd(usd.toFixed(2));
      }
    }
  }, [selectedId]);

  useEffect(() => {
    if (hours && selectedContractor?.hourly_rate_cents) {
      const usd = (parseFloat(hours) * selectedContractor.hourly_rate_cents) / 100;
      setAmountUsd(usd.toFixed(2));
    }
  }, [hours]);

  const handleSave = async () => {
    if (!selectedId || !amountUsd) return;
    setSaving(true);
    await supabase.from('intl_contractor_payments').insert({
      contractor_id: selectedId,
      pay_period_id: period.id,
      hours_worked: hours ? parseFloat(hours) : null,
      amount_usd_cents: Math.round(parseFloat(amountUsd) * 100),
      local_currency_amount: localAmount ? parseFloat(localAmount) : null,
      local_currency: localCurrency || null,
      exchange_rate: exchangeRate ? parseFloat(exchangeRate) : null,
      payment_method_used: method || null,
      notes: notes || null,
      status: 'pending',
    });
    setSaving(false);
    onSave();
  };

  if (available.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
          <CheckCircle className="w-12 h-12 text-[#2BB673] mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">All contractors added</h3>
          <p className="text-sm text-slate-500 mb-4">Every active contractor already has a payment in this period.</p>
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Add Payment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Contractor</label>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30">
              {available.map(c => (
                <option key={c.id} value={c.id}>{c.full_name} — {c.role}</option>
              ))}
            </select>
          </div>

          {selectedContractor && (
            <div className="bg-slate-50 rounded-lg px-4 py-3 text-xs text-slate-500 flex items-center justify-between">
              <span>{selectedContractor.country} · {PAYMENT_METHODS[selectedContractor.payment_method]}</span>
              <span className="font-medium text-slate-700">
                {selectedContractor.hourly_rate_cents ? `${fmt(selectedContractor.hourly_rate_cents)}/hr` : selectedContractor.monthly_rate_cents ? `${fmt(selectedContractor.monthly_rate_cents)}/mo` : 'Rate not set'}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Hours Worked" value={hours} onChange={setHours} type="number" placeholder="40" />
            <Field label="Amount (USD) *" value={amountUsd} onChange={setAmountUsd} type="number" placeholder="200.00" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Local Amount" value={localAmount} onChange={setLocalAmount} type="number" placeholder="11200" />
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Local Currency</label>
              <select value={localCurrency} onChange={e => setLocalCurrency(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30">
                {['PHP','USD','INR','MXN','BDT','NGN','PKR','VND'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Exchange Rate" value={exchangeRate} onChange={setExchangeRate} type="number" placeholder="56.00" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Payment Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30">
              <option value="">Select...</option>
              {Object.entries(PAYMENT_METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30" placeholder="Week of April 21, design work..." />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium">Cancel</button>
          <button onClick={handleSave} disabled={saving || !selectedId || !amountUsd} className="px-5 py-2 bg-[#2BB673] text-white rounded-lg hover:bg-[#25a062] text-sm font-medium disabled:opacity-50 transition-colors">
            {saving ? 'Adding...' : 'Add Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Field Component ───────────────────────────────────────────────────

function Field({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/30"
      />
    </div>
  );
}
