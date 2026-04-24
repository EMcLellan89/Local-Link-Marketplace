import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Eye,
  Send,
  CheckCircle,
  FileText,
  AlertTriangle,
  DollarSign,
  Clock,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
type FilterTab = 'all' | InvoiceStatus;

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  issue_date: string;
  due_date: string;
  amount_cents: number;
  status: InvoiceStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_INVOICES: Invoice[] = [
  { id: '1', invoice_number: 'INV-2026-001', customer_name: 'Priya Patel', issue_date: '2026-04-01', due_date: '2026-04-30', amount_cents: 360000, status: 'sent' },
  { id: '2', invoice_number: 'INV-2026-002', customer_name: 'Sarah Mitchell', issue_date: '2026-04-05', due_date: '2026-04-20', amount_cents: 180000, status: 'paid' },
  { id: '3', invoice_number: 'INV-2026-003', customer_name: 'Liam Nguyen', issue_date: '2026-04-08', due_date: '2026-04-22', amount_cents: 96000, status: 'overdue' },
  { id: '4', invoice_number: 'INV-2026-004', customer_name: 'Derek Chang', issue_date: '2026-04-10', due_date: '2026-05-10', amount_cents: 39000, status: 'draft' },
  { id: '5', invoice_number: 'INV-2026-005', customer_name: 'James Kowalski', issue_date: '2026-03-20', due_date: '2026-04-20', amount_cents: 59900, status: 'paid' },
  { id: '6', invoice_number: 'INV-2026-006', customer_name: 'Angela White', issue_date: '2026-04-12', due_date: '2026-05-12', amount_cents: 120000, status: 'sent' },
  { id: '7', invoice_number: 'INV-2026-007', customer_name: 'Rosa Kim', issue_date: '2026-04-15', due_date: '2026-04-29', amount_cents: 45000, status: 'sent' },
  { id: '8', invoice_number: 'INV-2026-008', customer_name: 'Tom Buchanan', issue_date: '2026-03-01', due_date: '2026-03-31', amount_cents: 19500, status: 'overdue' },
  { id: '9', invoice_number: 'INV-2026-009', customer_name: 'Nathan Ellis', issue_date: '2026-04-18', due_date: '2026-05-18', amount_cents: 7500, status: 'draft' },
  { id: '10', invoice_number: 'INV-2026-010', customer_name: 'Maria Torres', issue_date: '2026-04-20', due_date: '2026-05-20', amount_cents: 32000, status: 'draft' },
  { id: '11', invoice_number: 'INV-2026-011', customer_name: 'Priya Patel', issue_date: '2026-03-01', due_date: '2026-03-31', amount_cents: 59900, status: 'paid' },
  { id: '12', invoice_number: 'INV-2026-012', customer_name: 'Derek Chang', issue_date: '2026-04-22', due_date: '2026-05-22', amount_cents: 245000, status: 'sent' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BRAND = '#2BB673';
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

/** Effective status: treat sent invoices with past due dates as overdue */
function effectiveStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.status === 'sent') {
    const due = new Date(invoice.due_date);
    due.setHours(0, 0, 0, 0);
    if (due < TODAY) return 'overdue';
  }
  return invoice.status;
}

const formatCents = (cents: number): string =>
  `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-slate-100 text-slate-400',
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'sent', label: 'Sent' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
];

// ─── Toast notification ───────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-sm">
        <FileText size={15} className="shrink-0 text-gray-300" />
        <span>{message}</span>
        <button onClick={onDismiss} className="ml-2 text-gray-400 hover:text-white transition-colors text-xs">
          Dismiss
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CRMInvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) {
        setInvoices(MOCK_INVOICES);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('crm_invoices')
          .select('*')
          .eq('merchant_id', user.id)
          .order('issue_date', { ascending: false });

        if (error || !data || data.length === 0) {
          setInvoices(MOCK_INVOICES);
        } else {
          setInvoices(data as Invoice[]);
        }
      } catch {
        setInvoices(MOCK_INVOICES);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  // Invoices with computed effective status
  const invoicesWithStatus = useMemo(
    () => invoices.map((inv) => ({ ...inv, _effectiveStatus: effectiveStatus(inv) })),
    [invoices]
  );

  // Filtered list
  const filteredInvoices = useMemo(() => {
    if (activeTab === 'all') return invoicesWithStatus;
    return invoicesWithStatus.filter((inv) => inv._effectiveStatus === activeTab);
  }, [invoicesWithStatus, activeTab]);

  // Stats
  const outstandingAmount = useMemo(
    () =>
      invoicesWithStatus
        .filter((inv) => inv._effectiveStatus === 'sent' || inv._effectiveStatus === 'overdue')
        .reduce((sum, inv) => sum + inv.amount_cents, 0),
    [invoicesWithStatus]
  );

  const overdueAmount = useMemo(
    () =>
      invoicesWithStatus
        .filter((inv) => inv._effectiveStatus === 'overdue')
        .reduce((sum, inv) => sum + inv.amount_cents, 0),
    [invoicesWithStatus]
  );

  const paidThisMonth = useMemo(() => {
    const now = new Date();
    return invoicesWithStatus
      .filter((inv) => {
        if (inv._effectiveStatus !== 'paid') return false;
        const issued = new Date(inv.issue_date + 'T00:00:00');
        return issued.getMonth() === now.getMonth() && issued.getFullYear() === now.getFullYear();
      })
      .reduce((sum, inv) => sum + inv.amount_cents, 0);
  }, [invoicesWithStatus]);

  const draftCount = useMemo(
    () => invoicesWithStatus.filter((inv) => inv._effectiveStatus === 'draft').length,
    [invoicesWithStatus]
  );

  // Actions
  const handleSendInvoice = async (invoiceId: string) => {
    // Optimistic update
    setInvoices((current) =>
      current.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'sent' as InvoiceStatus } : inv))
    );

    try {
      await supabase
        .from('crm_invoices')
        .update({ status: 'sent' })
        .eq('id', invoiceId);
    } catch {
      // Revert on failure
      setInvoices((current) =>
        current.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'draft' as InvoiceStatus } : inv))
      );
    }
  };

  const handleMarkPaid = async (invoiceId: string, previousStatus: InvoiceStatus) => {
    // Optimistic update
    setInvoices((current) =>
      current.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'paid' as InvoiceStatus } : inv))
    );

    try {
      await supabase
        .from('crm_invoices')
        .update({ status: 'paid' })
        .eq('id', invoiceId);
    } catch {
      // Revert on failure
      setInvoices((current) =>
        current.map((inv) => (inv.id === invoiceId ? { ...inv, status: previousStatus } : inv))
      );
    }
  };

  const handleViewInvoice = () => {
    setToast('Invoice viewer coming soon');
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage and track all client invoices</p>
          </div>
          <Link
            to="/merchant/invoices/new"
            className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:opacity-90 w-fit"
            style={{ backgroundColor: BRAND }}
          >
            <Plus size={16} />
            New Invoice
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} style={{ color: BRAND }} />
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Outstanding</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCents(outstandingAmount)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-rose-500" />
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Overdue</p>
            </div>
            <p className="text-2xl font-bold text-rose-600">{formatCents(overdueAmount)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={14} style={{ color: BRAND }} />
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Paid This Month</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: BRAND }}>{formatCents(paidThisMonth)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-slate-500" />
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Drafts</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  {invoicesWithStatus.filter((inv) => inv._effectiveStatus === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading invoices...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText size={36} className="mb-3 opacity-40" />
              <p className="text-sm">No invoices in this category.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Invoice #</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Issue Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Due Date</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.map((invoice) => {
                    const effStatus = invoice._effectiveStatus;
                    const isDraft = effStatus === 'draft';
                    const isActionable = effStatus === 'sent' || effStatus === 'overdue';

                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        {/* Invoice number */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-mono text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                            {invoice.invoice_number}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                          {invoice.customer_name}
                        </td>

                        {/* Issue date */}
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {formatDate(invoice.issue_date)}
                        </td>

                        {/* Due date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={effStatus === 'overdue' ? 'text-rose-600 font-medium' : 'text-gray-500'}>
                            {formatDate(invoice.due_date)}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                          {formatCents(invoice.amount_cents)}
                        </td>

                        {/* Status badge */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[effStatus]}`}
                          >
                            {STATUS_LABELS[effStatus]}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {/* View button — always visible */}
                            <button
                              onClick={handleViewInvoice}
                              title="View invoice"
                              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Send Invoice — only for drafts */}
                            {isDraft && (
                              <button
                                onClick={() => handleSendInvoice(invoice.id)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
                              >
                                <Send size={11} />
                                Send
                              </button>
                            )}

                            {/* Mark Paid — for sent and overdue */}
                            {isActionable && (
                              <button
                                onClick={() => handleMarkPaid(invoice.id, invoice.status)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border text-white transition-colors whitespace-nowrap hover:opacity-90"
                                style={{ backgroundColor: BRAND, borderColor: BRAND }}
                              >
                                <CheckCircle size={11} />
                                Mark Paid
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          {!loading && filteredInvoices.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs text-gray-500">
                {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
              </span>
              <span className="text-xs font-medium text-gray-700">
                Total:{' '}
                <span className="text-gray-900">
                  {formatCents(filteredInvoices.reduce((sum, inv) => sum + inv.amount_cents, 0))}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </DashboardLayout>
  );
}
