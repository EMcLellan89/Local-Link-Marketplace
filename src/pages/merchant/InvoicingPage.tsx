import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, FileText, DollarSign, Clock,
  CheckCircle2, XCircle, Eye, Send, Mail, Download,
  Edit, Trash2, AlertCircle, Calendar, TrendingUp
} from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  total_cents: number;
  amount_paid_cents: number;
  balance_due_cents: number;
  payment_url: string | null;
}

interface InvoiceStats {
  total_invoices: number;
  total_outstanding_cents: number;
  total_paid_cents: number;
  overdue_count: number;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700', icon: FileText },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700', icon: Send },
  viewed: { label: 'Viewed', color: 'bg-cyan-100 text-cyan-700', icon: Eye },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-500', icon: XCircle },
};

export default function InvoicingPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats>({
    total_invoices: 0,
    total_outstanding_cents: 0,
    total_paid_cents: 0,
    overdue_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [merchantId, setMerchantId] = useState<string>('');

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [invoices, searchTerm, filterStatus]);

  const loadInvoices = async () => {
    try {
      setError(null);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;
      if (!merchant) {
        setError('Merchant profile not found');
        return;
      }

      setMerchantId(merchant.id);

      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;

      setInvoices(invoicesData || []);

      const totalOutstanding = (invoicesData || [])
        .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
        .reduce((sum, inv) => sum + inv.balance_due_cents, 0);

      const totalPaid = (invoicesData || [])
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount_paid_cents, 0);

      const overdueCount = (invoicesData || [])
        .filter(inv => inv.status === 'overdue').length;

      setStats({
        total_invoices: invoicesData?.length || 0,
        total_outstanding_cents: totalOutstanding,
        total_paid_cents: totalPaid,
        overdue_count: overdueCount,
      });
    } catch (error) {
      console.error('Error loading invoices:', error);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...invoices];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice_number.toLowerCase().includes(term) ||
          invoice.customer_name.toLowerCase().includes(term) ||
          invoice.customer_email.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((invoice) => invoice.status === filterStatus);
    }

    setFilteredInvoices(filtered);
  };

  const handleCreateInvoice = () => {
    navigate('/merchant/invoices/new');
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    if (!confirm(`Send invoice ${invoice.invoice_number} to ${invoice.customer_email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', invoice.id);

      if (error) throw error;

      alert('Invoice sent successfully!');
      await loadInvoices();
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice');
    }
  };

  const handleCopyPaymentLink = (invoice: Invoice) => {
    if (!invoice.payment_url) {
      alert('Payment link not available');
      return;
    }

    navigator.clipboard.writeText(invoice.payment_url);
    alert('Payment link copied to clipboard!');
  };

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (!confirm(`Delete invoice ${invoice.invoice_number}? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id);

      if (error) throw error;

      alert('Invoice deleted successfully');
      await loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading invoices...</div>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Invoicing & Accounting</h1>
            <p className="text-slate-600 mt-1">Create invoices and accept online payments</p>
          </div>
          <Button onClick={handleCreateInvoice}>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>

        {error && (
          <Card variant="bordered" className="bg-red-50 border-red-200">
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
                <Button variant="outline" size="sm" onClick={loadInvoices}>
                  Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Invoices</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_invoices}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">All time</p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-orange-50 to-amber-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Outstanding</p>
                  <p className="text-3xl font-bold text-slate-900">
                    ${(stats.total_outstanding_cents / 100).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">Awaiting payment</p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Paid</p>
                  <p className="text-3xl font-bold text-slate-900">
                    ${(stats.total_paid_cents / 100).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">Total collected</p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-red-50 to-pink-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Overdue</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.overdue_count}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">Need attention</p>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="bg-slate-50">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="viewed">Viewed</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">
              Invoices ({filteredInvoices.length})
            </h2>
          </CardHeader>
          <CardBody className="p-0">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No invoices found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first invoice to get started'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <Button onClick={handleCreateInvoice} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredInvoices.map((invoice) => {
                      const statusInfo = statusConfig[invoice.status];
                      const StatusIcon = statusInfo.icon;

                      return (
                        <tr key={invoice.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-slate-900">
                              {invoice.invoice_number}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{invoice.customer_name}</div>
                            <div className="text-xs text-slate-500">{invoice.customer_email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {new Date(invoice.invoice_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {new Date(invoice.due_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-slate-900">
                              ${(invoice.total_cents / 100).toLocaleString()}
                            </div>
                            {invoice.balance_due_cents > 0 && (
                              <div className="text-xs text-orange-600">
                                ${(invoice.balance_due_cents / 100).toLocaleString()} due
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              {invoice.status === 'draft' && (
                                <button
                                  onClick={() => handleSendInvoice(invoice)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Send Invoice"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              )}
                              {invoice.payment_url && (
                                <button
                                  onClick={() => handleCopyPaymentLink(invoice)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Copy Payment Link"
                                >
                                  <DollarSign className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/merchant/invoices/${invoice.id}`)}
                                className="text-slate-600 hover:text-slate-800"
                                title="View Invoice"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/merchant/invoices/${invoice.id}/edit`)}
                                className="text-slate-600 hover:text-slate-800"
                                title="Edit Invoice"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {invoice.status === 'draft' && (
                                <button
                                  onClick={() => handleDeleteInvoice(invoice)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete Invoice"
                                >
                                  <Trash2 className="w-4 h-4" />
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
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardBody>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Accept Payments Online with GoPayBright
                </h3>
                <p className="text-slate-600 mb-4">
                  When you create an invoice, a secure payment link is automatically generated. Your clients can pay
                  online using credit cards, debit cards, or other payment methods. Payments are processed instantly
                  and deposited directly to your account.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" onClick={handleCreateInvoice}>
                    Create Your First Invoice
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate('/merchant/payment-settings')}>
                    Payment Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
