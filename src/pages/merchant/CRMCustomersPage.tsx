import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, Search, ChevronLeft, X, Phone, Mail,
  Tag, Clock, DollarSign, Eye, AlertCircle,
  TrendingUp, UserCheck
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Customer {
  id: string;
  display_name: string;
  email: string;
  phone: string;
  status: 'active' | 'at_risk' | 'inactive' | 'vip';
  total_spent_cents: number;
  last_activity_at: string;
  tags: string[];
}

interface NewCustomerForm {
  display_name: string;
  email: string;
  phone: string;
  notes: string;
}

type StatusFilter = 'all' | 'active' | 'at_risk' | 'inactive' | 'vip';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', display_name: 'Sarah Mitchell', email: 'sarah@example.com', phone: '555-0101', status: 'vip', total_spent_cents: 425000, last_activity_at: '2026-04-20', tags: ['loyal', 'referrer'] },
  { id: '2', display_name: 'James Kowalski', email: 'james@example.com', phone: '555-0102', status: 'active', total_spent_cents: 189000, last_activity_at: '2026-04-18', tags: [] },
  { id: '3', display_name: 'Maria Torres', email: 'maria@example.com', phone: '555-0103', status: 'at_risk', total_spent_cents: 67500, last_activity_at: '2026-02-14', tags: ['needs-follow-up'] },
  { id: '4', display_name: 'Derek Chang', email: 'derek@example.com', phone: '555-0104', status: 'active', total_spent_cents: 234000, last_activity_at: '2026-04-22', tags: [] },
  { id: '5', display_name: 'Priya Patel', email: 'priya@example.com', phone: '555-0105', status: 'vip', total_spent_cents: 612000, last_activity_at: '2026-04-21', tags: ['loyal'] },
  { id: '6', display_name: 'Tom Buchanan', email: 'tom@example.com', phone: '555-0106', status: 'inactive', total_spent_cents: 45000, last_activity_at: '2025-11-30', tags: [] },
  { id: '7', display_name: 'Angela White', email: 'angela@example.com', phone: '555-0107', status: 'active', total_spent_cents: 156000, last_activity_at: '2026-04-10', tags: [] },
  { id: '8', display_name: 'Liam Nguyen', email: 'liam@example.com', phone: '555-0108', status: 'at_risk', total_spent_cents: 82000, last_activity_at: '2026-01-25', tags: [] },
  { id: '9', display_name: 'Rosa Kim', email: 'rosa@example.com', phone: '555-0109', status: 'active', total_spent_cents: 198000, last_activity_at: '2026-04-15', tags: [] },
  { id: '10', display_name: 'Nathan Ellis', email: 'nathan@example.com', phone: '555-0110', status: 'active', total_spent_cents: 91000, last_activity_at: '2026-04-08', tags: [] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<Customer['status'], { label: string; classes: string }> = {
  active: { label: 'Active', classes: 'bg-green-100 text-green-700' },
  at_risk: { label: 'At Risk', classes: 'bg-amber-100 text-amber-700' },
  inactive: { label: 'Inactive', classes: 'bg-slate-100 text-slate-600' },
  vip: { label: 'VIP', classes: 'bg-blue-100 text-blue-700' },
};

function StatusBadge({ status }: { status: Customer['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-sky-500', 'bg-teal-500', 'bg-rose-500',
  'bg-orange-500', 'bg-indigo-500', 'bg-pink-500', 'bg-cyan-500',
];

function avatarColor(id: string): string {
  const idx = parseInt(id, 10) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] ?? 'bg-slate-500';
}

// ─── CustomerRow Sub-component ────────────────────────────────────────────────

interface CustomerRowProps {
  customer: Customer;
  onSelect: (c: Customer) => void;
}

function CustomerRow({ customer, onSelect }: CustomerRowProps) {
  return (
    <tr
      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
      onClick={() => onSelect(customer)}
    >
      {/* Name + Avatar */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${avatarColor(customer.id)}`}>
            {getInitials(customer.display_name)}
          </div>
          <span className="font-medium text-slate-800 text-sm">{customer.display_name}</span>
        </div>
      </td>

      {/* Contact */}
      <td className="px-4 py-3">
        <div className="text-sm text-slate-600">{customer.email}</div>
        <div className="text-xs text-slate-400">{customer.phone}</div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={customer.status} />
      </td>

      {/* Total Spent */}
      <td className="px-4 py-3 text-sm font-medium text-slate-700">
        {formatCents(customer.total_spent_cents)}
      </td>

      {/* Last Activity */}
      <td className="px-4 py-3 text-sm text-slate-500">
        {formatDate(customer.last_activity_at)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onSelect(customer)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded px-2 py-1 hover:border-slate-300 transition-colors"
        >
          <Eye className="w-3 h-3" />
          View
        </button>
      </td>
    </tr>
  );
}

// ─── Detail Slide-Over ────────────────────────────────────────────────────────

function CustomerPanel({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Customer Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-5 py-5 space-y-5">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${avatarColor(customer.id)}`}>
              {getInitials(customer.display_name)}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800">{customer.display_name}</h3>
              <StatusBadge status={customer.status} />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{customer.phone}</span>
            </div>
          </div>

          {/* Financials */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Financials</h4>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">Total Spent:</span>
              <span className="text-sm font-semibold text-slate-800">{formatCents(customer.total_spent_cents)}</span>
            </div>
          </div>

          {/* Last Activity */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Last active {formatDate(customer.last_activity_at)}</span>
            </div>
          </div>

          {/* Tags */}
          {customer.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {customer.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes</h4>
            <div className="min-h-[80px] bg-slate-50 rounded-lg border border-slate-200 p-3 text-sm text-slate-400 italic">
              No notes yet.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Add Customer Modal ───────────────────────────────────────────────────────

interface AddCustomerModalProps {
  onClose: () => void;
  onSave: (customer: Customer) => void;
  merchantId: string | null;
}

function AddCustomerModal({ onClose, onSave, merchantId }: AddCustomerModalProps) {
  const [form, setForm] = useState<NewCustomerForm>({ display_name: '', email: '', phone: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field: keyof NewCustomerForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.display_name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSaving(true);
    setError('');

    const newCustomer: Customer = {
      id: String(Date.now()),
      display_name: form.display_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: 'active',
      total_spent_cents: 0,
      last_activity_at: new Date().toISOString().split('T')[0],
      tags: [],
    };

    try {
      if (merchantId) {
        await supabase.from('crm_customers').insert({
          merchant_id: merchantId,
          display_name: form.display_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          notes: form.notes.trim(),
          status: 'active',
        });
      }
    } catch {
      // optimistic add regardless
    }

    onSave(newCustomer);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md pointer-events-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Add Customer</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={form.display_name}
                onChange={(e) => update('display_name', e.target.value)}
                placeholder="Jane Smith"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="jane@example.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="555-0100"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Any notes about this customer..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60"
                style={{ backgroundColor: '#2BB673' }}
              >
                {saving ? 'Saving...' : 'Add Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CRMCustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (user) {
          const { data: merchant } = await supabase
            .from('merchants')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (merchant) {
            setMerchantId(merchant.id);
            const { data } = await supabase
              .from('crm_customers')
              .select('*')
              .eq('merchant_id', merchant.id)
              .order('created_at', { ascending: false });

            if (data?.length) {
              setCustomers(data);
              setLoading(false);
              return;
            }
          }
        }
      } catch {
        // fall through to mock
      }
      setCustomers(MOCK_CUSTOMERS);
      setLoading(false);
    }
    load();
  }, [user]);

  // Stats
  const total = customers.length;
  const active = customers.filter((c) => c.status === 'active').length;
  const atRisk = customers.filter((c) => c.status === 'at_risk').length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const newThisMonth = customers.filter((c) => c.last_activity_at?.startsWith(currentMonth)).length;

  // Filtered list
  const filtered = customers.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.display_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const STATUS_TABS: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'at_risk', label: 'At Risk' },
    { key: 'inactive', label: 'Inactive' },
    { key: 'vip', label: 'VIP' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Back Link */}
        <Link
          to="/merchant/crm-hub"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          CRM Hub
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage and track your customer relationships</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ backgroundColor: '#2BB673' }}
          >
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Customers"
            value={String(total)}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
          />
          <StatCard
            icon={<UserCheck className="w-5 h-5" />}
            label="Active"
            value={String(active)}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5" />}
            label="At-Risk"
            value={String(atRisk)}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="New This Month"
            value={String(newThisMonth)}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 flex-wrap">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === tab.key
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  style={statusFilter === tab.key ? { backgroundColor: '#2BB673' } : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-16 flex items-center justify-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-[#2BB673] rounded-full animate-spin" />
                <span className="text-sm">Loading customers...</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No customers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => (
                    <CustomerRow key={customer.id} customer={customer} onSelect={setSelectedCustomer} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedCustomer && (
        <CustomerPanel customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <AddCustomerModal
          merchantId={merchantId}
          onClose={() => setShowAddModal(false)}
          onSave={(newCustomer) => {
            setCustomers((prev) => [newCustomer, ...prev]);
            setShowAddModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon, label, value, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

