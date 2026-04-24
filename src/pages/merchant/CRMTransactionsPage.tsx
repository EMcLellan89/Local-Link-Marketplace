import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Search,
  TrendingUp,
  RefreshCcw,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionType = 'sale' | 'refund' | 'subscription' | 'event';
type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';
type PaymentMethod = 'card' | 'cash' | 'check' | 'invoice';
type DateRange = 'this_month' | 'last_month' | 'last_3_months' | 'this_year';

interface Transaction {
  id: string;
  customer_name: string;
  description: string;
  type: TransactionType;
  amount_cents: number;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  created_at: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', customer_name: 'Priya Patel', description: 'Annual Service Plan - Deposit', type: 'sale', amount_cents: 180000, payment_method: 'card', status: 'completed', created_at: '2026-04-22T10:00:00' },
  { id: '2', customer_name: 'Sarah Mitchell', description: 'Website Redesign - Final Payment', type: 'sale', amount_cents: 90000, payment_method: 'card', status: 'completed', created_at: '2026-04-21T14:00:00' },
  { id: '3', customer_name: 'James Kowalski', description: 'Monthly Retainer - April', type: 'subscription', amount_cents: 59900, payment_method: 'card', status: 'completed', created_at: '2026-04-20T09:00:00' },
  { id: '4', customer_name: 'Derek Chang', description: 'Strategy Consulting x2', type: 'sale', amount_cents: 39000, payment_method: 'cash', status: 'completed', created_at: '2026-04-19T11:00:00' },
  { id: '5', customer_name: 'Angela White', description: 'Social Media - March Refund', type: 'refund', amount_cents: -25000, payment_method: 'card', status: 'refunded', created_at: '2026-04-18T16:00:00' },
  { id: '6', customer_name: 'Rosa Kim', description: 'Logo Design', type: 'sale', amount_cents: 45000, payment_method: 'check', status: 'completed', created_at: '2026-04-17T10:00:00' },
  { id: '7', customer_name: 'Priya Patel', description: 'Monthly Retainer - April', type: 'subscription', amount_cents: 59900, payment_method: 'card', status: 'completed', created_at: '2026-04-15T09:00:00' },
  { id: '8', customer_name: 'Nathan Ellis', description: 'Business Cards x500', type: 'sale', amount_cents: 7500, payment_method: 'card', status: 'completed', created_at: '2026-04-14T12:00:00' },
  { id: '9', customer_name: 'Tom Buchanan', description: 'Consulting Hour', type: 'sale', amount_cents: 19500, payment_method: 'cash', status: 'completed', created_at: '2026-04-12T15:00:00' },
  { id: '10', customer_name: 'Maria Torres', description: 'Workshop Ticket', type: 'event', amount_cents: 9500, payment_method: 'card', status: 'completed', created_at: '2026-04-10T09:00:00' },
  { id: '11', customer_name: 'Liam Nguyen', description: 'SEO Package - Pending', type: 'sale', amount_cents: 96000, payment_method: 'invoice', status: 'pending', created_at: '2026-04-08T11:00:00' },
  { id: '12', customer_name: 'Angela White', description: 'Email Campaign Setup', type: 'sale', amount_cents: 32000, payment_method: 'card', status: 'completed', created_at: '2026-04-06T14:00:00' },
  { id: '13', customer_name: 'James Kowalski', description: 'Monthly Retainer - March', type: 'subscription', amount_cents: 59900, payment_method: 'card', status: 'completed', created_at: '2026-03-20T09:00:00' },
  { id: '14', customer_name: 'Derek Chang', description: 'Branding Bundle', type: 'sale', amount_cents: 245000, payment_method: 'card', status: 'completed', created_at: '2026-03-15T10:00:00' },
  { id: '15', customer_name: 'Sarah Mitchell', description: 'Website Redesign - Deposit', type: 'sale', amount_cents: 90000, payment_method: 'card', status: 'completed', created_at: '2026-03-10T11:00:00' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BRAND = '#2BB673';

const formatCents = (cents: number): string => {
  const abs = Math.abs(cents);
  const formatted = `$${(abs / 100).toFixed(2)}`;
  return cents < 0 ? `-${formatted}` : formatted;
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TYPE_COLORS: Record<TransactionType, string> = {
  sale: 'bg-green-100 text-green-700',
  refund: 'bg-rose-100 text-rose-700',
  subscription: 'bg-blue-100 text-blue-700',
  event: 'bg-amber-100 text-amber-700',
};

const TYPE_LABELS: Record<TransactionType, string> = {
  sale: 'Sale',
  refund: 'Refund',
  subscription: 'Subscription',
  event: 'Event',
};

const STATUS_COLORS: Record<TransactionStatus, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-rose-100 text-rose-700',
  refunded: 'bg-slate-100 text-slate-600',
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: 'Card',
  cash: 'Cash',
  check: 'Check',
  invoice: 'Invoice',
};

const DATE_RANGE_OPTIONS: { key: DateRange; label: string }[] = [
  { key: 'this_month', label: 'This Month' },
  { key: 'last_month', label: 'Last Month' },
  { key: 'last_3_months', label: 'Last 3 Months' },
  { key: 'this_year', label: 'This Year' },
];

function getDateRangeBounds(range: DateRange): { start: Date; end: Date } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (range) {
    case 'this_month':
      return { start: new Date(year, month, 1), end: new Date(year, month + 1, 0, 23, 59, 59) };
    case 'last_month':
      return { start: new Date(year, month - 1, 1), end: new Date(year, month, 0, 23, 59, 59) };
    case 'last_3_months':
      return { start: new Date(year, month - 2, 1), end: new Date(year, month + 1, 0, 23, 59, 59) };
    case 'this_year':
      return { start: new Date(year, 0, 1), end: new Date(year, 11, 31, 23, 59, 59) };
  }
}

function exportCSV(transactions: Transaction[]) {
  const headers = ['Date', 'Customer', 'Description', 'Type', 'Amount', 'Payment Method', 'Status'];
  const rows = transactions.map((t) => [
    formatDate(t.created_at),
    t.customer_name,
    `"${t.description.replace(/"/g, '""')}"`,
    TYPE_LABELS[t.type],
    formatCents(t.amount_cents),
    PAYMENT_LABELS[t.payment_method],
    STATUS_LABELS[t.status],
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CRMTransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('this_month');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setTransactions(MOCK_TRANSACTIONS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('crm_transactions')
          .select('*')
          .eq('merchant_id', user.id)
          .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
          setTransactions(MOCK_TRANSACTIONS);
        } else {
          setTransactions(data as Transaction[]);
        }
      } catch {
        setTransactions(MOCK_TRANSACTIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  // Filter by date range + search
  const filteredTransactions = useMemo(() => {
    const { start, end } = getDateRangeBounds(dateRange);
    return transactions.filter((t) => {
      const created = new Date(t.created_at);
      const inRange = created >= start && created <= end;
      const matchSearch = searchQuery.trim() === ''
        || t.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
      return inRange && matchSearch;
    });
  }, [transactions, dateRange, searchQuery]);

  // Stats (based on full date-range filtered set, not search)
  const rangeTransactions = useMemo(() => {
    const { start, end } = getDateRangeBounds(dateRange);
    return transactions.filter((t) => {
      const created = new Date(t.created_at);
      return created >= start && created <= end;
    });
  }, [transactions, dateRange]);

  const totalRevenue = rangeTransactions
    .filter((t) => t.status === 'completed' && t.type !== 'refund')
    .reduce((sum, t) => sum + t.amount_cents, 0);

  const completedCount = rangeTransactions.filter((t) => t.status !== 'refunded' && t.status !== 'failed').length;

  const avgTransaction = completedCount > 0
    ? rangeTransactions
        .filter((t) => t.status === 'completed' && t.type !== 'refund')
        .reduce((sum, t) => sum + t.amount_cents, 0) /
      rangeTransactions.filter((t) => t.status === 'completed' && t.type !== 'refund').length
    : 0;

  const totalRefunds = rangeTransactions
    .filter((t) => t.type === 'refund')
    .reduce((sum, t) => sum + Math.abs(t.amount_cents), 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          to="/merchant/crm"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          CRM Hub
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-500 mt-0.5">Payment history and revenue overview</p>
          </div>
          <button
            onClick={() => exportCSV(filteredTransactions)}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} style={{ color: BRAND }} />
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Revenue</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCents(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard size={14} className="text-blue-500" />
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Transactions</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{rangeTransactions.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCcw size={14} className="text-amber-500" />
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Avg Transaction</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {avgTransaction > 0 ? formatCents(Math.round(avgTransaction)) : '—'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={14} className="text-rose-500" />
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Refunds</p>
            </div>
            <p className="text-2xl font-bold text-rose-600">
              {totalRefunds > 0 ? `-${formatCents(totalRefunds)}` : '$0.00'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Date range tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg flex-wrap">
            {DATE_RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setDateRange(opt.key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  dateRange === opt.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent w-full sm:w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No transactions found for this period.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Type</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Method</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {formatDate(t.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {t.customer_name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs">
                        <span className="line-clamp-1">{t.description}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[t.type]}`}>
                          {TYPE_LABELS[t.type]}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${t.amount_cents < 0 ? 'text-rose-600' : 'text-gray-900'}`}>
                        {formatCents(t.amount_cents)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize whitespace-nowrap">
                        {PAYMENT_LABELS[t.payment_method]}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[t.status]}`}>
                          {STATUS_LABELS[t.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          {!loading && filteredTransactions.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs text-gray-500">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </span>
              <span className="text-xs font-medium text-gray-700">
                Net:{' '}
                <span style={{ color: BRAND }}>
                  {formatCents(filteredTransactions.reduce((sum, t) => sum + t.amount_cents, 0))}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
