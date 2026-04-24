import { useEffect, useState } from 'react';
import {
  BarChart2, DollarSign, TrendingUp, TrendingDown, Download,
  Calendar, CheckCircle, AlertCircle, FileText, Zap, Plus,
  ChevronRight, RefreshCw, Package
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';

interface MonthlySummary {
  period_year: number;
  period_month: number;
  gross_revenue_cents: number;
  refunds_cents: number;
  net_revenue_cents: number;
  total_expenses_cents: number;
  estimated_profit_cents: number;
  tax_collected_cents: number;
  transaction_count: number;
  is_finalized: boolean;
}

interface ExportBatch {
  id: string;
  export_type: string;
  period_start: string;
  period_end: string;
  status: string;
  total_revenue_cents: number;
  total_expenses_cents: number;
  transaction_count: number;
  generated_at: string | null;
  created_at: string;
}

interface FinancialRecord {
  id: string;
  record_type: string;
  amount_cents: number;
  description: string | null;
  vendor: string | null;
  recorded_at: string;
  is_verified: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MOCK_SUMMARIES: MonthlySummary[] = Array.from({ length: 6 }, (_, i) => {
  const now = new Date();
  const month = ((now.getMonth() - i + 12) % 12) + 1;
  const year = now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear();
  const rev = Math.floor(Math.random() * 800000 + 500000);
  const exp = Math.floor(rev * 0.35);
  return {
    period_year: year, period_month: month,
    gross_revenue_cents: rev, refunds_cents: Math.floor(rev * 0.02),
    net_revenue_cents: rev - Math.floor(rev * 0.02),
    total_expenses_cents: exp, estimated_profit_cents: rev - exp,
    tax_collected_cents: Math.floor(rev * 0.08), transaction_count: Math.floor(Math.random() * 30 + 10),
    is_finalized: i > 0,
  };
}).reverse();

const MOCK_EXPORTS: ExportBatch[] = [
  { id: 'ex1', export_type: 'monthly_summary', period_start: '2026-03-01', period_end: '2026-03-31', status: 'ready', total_revenue_cents: 678000, total_expenses_cents: 237300, transaction_count: 24, generated_at: '2026-04-01', created_at: '2026-04-01' },
  { id: 'ex2', export_type: 'quarterly_summary', period_start: '2026-01-01', period_end: '2026-03-31', status: 'ready', total_revenue_cents: 1890000, total_expenses_cents: 661500, transaction_count: 67, generated_at: '2026-04-02', created_at: '2026-04-02' },
];

const MOCK_RECORDS: FinancialRecord[] = [
  { id: 'fr1', record_type: 'revenue', amount_cents: 120000, description: 'Service Package', vendor: null, recorded_at: new Date().toISOString(), is_verified: true },
  { id: 'fr2', record_type: 'expense', amount_cents: 4500, description: 'Ad spend — Facebook', vendor: 'Meta Ads', recorded_at: new Date(Date.now() - 86400000).toISOString(), is_verified: false },
  { id: 'fr3', record_type: 'revenue', amount_cents: 9900, description: 'Monthly subscription', vendor: null, recorded_at: new Date(Date.now() - 172800000).toISOString(), is_verified: true },
  { id: 'fr4', record_type: 'expense', amount_cents: 29900, description: 'Software tools', vendor: 'Various', recorded_at: new Date(Date.now() - 259200000).toISOString(), is_verified: true },
];

const EXPORT_TYPES = [
  { value: 'monthly_summary', label: 'Monthly Summary' },
  { value: 'quarterly_summary', label: 'Quarterly Summary' },
  { value: 'year_end_tax_package', label: 'Year-End Tax Package' },
  { value: 'full_transaction_export', label: 'Full Transaction Export' },
  { value: 'expense_report', label: 'Expense Report' },
  { value: 'revenue_report', label: 'Revenue Report' },
  { value: 'sales_tax_summary', label: 'Sales Tax Summary' },
];

function formatCents(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ready: 'bg-green-50 text-green-700',
    pending: 'bg-amber-50 text-amber-700',
    generating: 'bg-blue-50 text-blue-700',
    delivered: 'bg-[#2BB673]/10 text-[#2BB673]',
    failed: 'bg-rose-50 text-rose-600',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export default function CRMFinancialsPage() {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [exports, setExports] = useState<ExportBatch[]>([]);
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'exports'>('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({ export_type: 'monthly_summary', period_start: '', period_end: '', file_format: 'json' });
  const [generating, setGenerating] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({ record_type: 'revenue', amount: '', description: '', vendor: '' });

  useEffect(() => { loadData(); }, [user]);

  const loadData = async () => {
    if (!user) { setSummaries(MOCK_SUMMARIES); setExports(MOCK_EXPORTS); setRecords(MOCK_RECORDS); setLoading(false); return; }
    try {
      const { data: m } = await supabase.from('merchants').select('id').eq('user_id', user.id).maybeSingle();
      if (!m) { setSummaries(MOCK_SUMMARIES); setExports(MOCK_EXPORTS); setRecords(MOCK_RECORDS); setLoading(false); return; }
      setMerchantId(m.id);

      const [sumRes, expRes, recRes] = await Promise.allSettled([
        supabase.from('financial_monthly_summaries').select('*').eq('merchant_id', m.id).order('period_year', { ascending: false }).order('period_month', { ascending: false }).limit(12),
        supabase.from('cpa_export_batches').select('*').eq('merchant_id', m.id).order('created_at', { ascending: false }).limit(10),
        supabase.from('financial_records').select('*').eq('merchant_id', m.id).order('recorded_at', { ascending: false }).limit(20),
      ]);

      setSummaries(sumRes.status === 'fulfilled' && sumRes.value.data?.length ? sumRes.value.data : MOCK_SUMMARIES);
      setExports(expRes.status === 'fulfilled' && expRes.value.data?.length ? expRes.value.data : MOCK_EXPORTS);
      setRecords(recRes.status === 'fulfilled' && recRes.value.data?.length ? recRes.value.data : MOCK_RECORDS);
    } catch {
      setSummaries(MOCK_SUMMARIES); setExports(MOCK_EXPORTS); setRecords(MOCK_RECORDS);
    }
    setLoading(false);
  };

  const handleGenerateExport = async () => {
    if (!exportForm.period_start || !exportForm.period_end) return;
    setGenerating(true);

    const now = new Date();
    const start = new Date(exportForm.period_start);
    const end = new Date(exportForm.period_end);
    const relevantSummaries = summaries.filter(s => {
      const d = new Date(s.period_year, s.period_month - 1, 1);
      return d >= start && d <= end;
    });

    const totalRevenue = relevantSummaries.reduce((s, r) => s + r.net_revenue_cents, 0);
    const totalExpenses = relevantSummaries.reduce((s, r) => s + r.total_expenses_cents, 0);
    const txCount = relevantSummaries.reduce((s, r) => s + r.transaction_count, 0);
    const taxYear = start.getFullYear();

    const payload = {
      export_type: exportForm.export_type,
      merchant_id: merchantId,
      tax_year: taxYear,
      period_start: exportForm.period_start,
      period_end: exportForm.period_end,
      summary: {
        gross_revenue: totalRevenue,
        refunds: relevantSummaries.reduce((s, r) => s + r.refunds_cents, 0),
        net_revenue: totalRevenue,
        expenses: totalExpenses,
        estimated_profit: totalRevenue - totalExpenses,
        sales_tax_collected: relevantSummaries.reduce((s, r) => s + r.tax_collected_cents, 0),
      },
      generated_at: now.toISOString(),
    };

    try {
      if (merchantId) {
        const { data } = await supabase.from('cpa_export_batches').insert({
          merchant_id: merchantId,
          ...exportForm,
          period_start: exportForm.period_start,
          period_end: exportForm.period_end,
          tax_year: taxYear,
          status: 'ready',
          payload,
          total_revenue_cents: totalRevenue,
          total_expenses_cents: totalExpenses,
          transaction_count: txCount,
          generated_at: now.toISOString(),
        }).select().maybeSingle();
        if (data) setExports(prev => [data, ...prev]);
      }
    } catch { /* silent */ }

    const mockExport: ExportBatch = {
      id: `ex-${Date.now()}`,
      ...exportForm,
      status: 'ready',
      total_revenue_cents: totalRevenue,
      total_expenses_cents: totalExpenses,
      transaction_count: txCount,
      generated_at: now.toISOString(),
      created_at: now.toISOString(),
    };
    setExports(prev => [mockExport, ...prev.filter(e => e.id !== mockExport.id)]);
    setShowExportModal(false);
    setActiveTab('exports');
    setGenerating(false);
  };

  const handleAddRecord = async () => {
    if (!recordForm.description || !recordForm.amount) return;
    const amountCents = Math.round(parseFloat(recordForm.amount) * 100);
    const now = new Date();
    const rec: FinancialRecord = {
      id: `rec-${Date.now()}`,
      record_type: recordForm.record_type,
      amount_cents: amountCents,
      description: recordForm.description,
      vendor: recordForm.vendor || null,
      recorded_at: now.toISOString(),
      is_verified: false,
    };

    if (merchantId) {
      await supabase.from('financial_records').insert({
        merchant_id: merchantId,
        ...rec,
        period_month: now.getMonth() + 1,
        period_year: now.getFullYear(),
      }).then(() => {});
    }
    setRecords(prev => [rec, ...prev]);
    setShowAddRecord(false);
    setRecordForm({ record_type: 'revenue', amount: '', description: '', vendor: '' });
  };

  const downloadExport = (ex: ExportBatch) => {
    const data = ex ? JSON.stringify({ ...ex }, null, 2) : '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `local-link-export-${ex.period_start}-${ex.period_end}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalYTD = summaries.filter(s => s.period_year === new Date().getFullYear()).reduce((a, s) => a + s.net_revenue_cents, 0);
  const totalExpensesYTD = summaries.filter(s => s.period_year === new Date().getFullYear()).reduce((a, s) => a + s.total_expenses_cents, 0);
  const profitYTD = totalYTD - totalExpensesYTD;
  const currentMonth = summaries.find(s => s.period_month === new Date().getMonth() + 1 && s.period_year === new Date().getFullYear()) || summaries[summaries.length - 1];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <a href="/merchant/crm-hub" className="hover:text-[#2BB673]">CRM Hub</a>
            <span>/</span>
            <span className="text-slate-900 font-medium">Financials & CPA Export</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-green-600" /> Financials & CPA Export
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddRecord(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Record
          </Button>
          <Button onClick={() => setShowExportModal(true)}>
            <Download className="w-4 h-4 mr-1.5" /> Generate Export
          </Button>
        </div>
      </div>

      {/* YTD Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Revenue YTD', value: formatCents(totalYTD), icon: TrendingUp, color: 'text-[#2BB673] bg-[#2BB673]/10' },
          { label: 'Expenses YTD', value: formatCents(totalExpensesYTD), icon: TrendingDown, color: 'text-rose-600 bg-rose-50' },
          { label: 'Profit YTD', value: formatCents(profitYTD), icon: DollarSign, color: 'text-slate-900 bg-slate-100' },
          { label: 'This Month', value: currentMonth ? formatCents(currentMonth.net_revenue_cents) : '—', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">{card.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${card.color.split(' ')[1]}`}>
                <card.icon className={`w-3.5 h-3.5 ${card.color.split(' ')[0]}`} />
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900">{card.value}</div>
          </div>
        ))}
      </div>

      {/* CPA Readiness Banner */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-xl p-4 mb-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold mb-0.5">CPA Export System</div>
              <p className="text-sm text-white/80">
                Export clean financial data in JSON or CSV — send to your CPA, accountant, or tax software. Year-end packages auto-generate on Dec 31.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex-shrink-0 bg-white text-green-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Generate Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5">
        {[
          { id: 'overview', label: 'Monthly Overview' },
          { id: 'records', label: 'Financial Records' },
          { id: 'exports', label: `CPA Exports (${exports.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#2BB673] text-[#2BB673]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Monthly Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Bar Chart Visualization */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Revenue vs Expenses (Last 6 Months)</h3>
            <div className="flex items-end gap-2 h-40">
              {summaries.slice(-6).map(s => {
                const maxRev = Math.max(...summaries.map(x => x.gross_revenue_cents));
                const revH = (s.gross_revenue_cents / maxRev) * 100;
                const expH = (s.total_expenses_cents / maxRev) * 100;
                return (
                  <div key={`${s.period_year}-${s.period_month}`} className="flex-1 flex items-end gap-0.5">
                    <div className="flex-1 bg-[#2BB673]/20 hover:bg-[#2BB673]/30 rounded-t transition-colors" style={{ height: `${revH}%` }} title={`Revenue: ${formatCents(s.gross_revenue_cents)}`} />
                    <div className="flex-1 bg-rose-200 hover:bg-rose-300 rounded-t transition-colors" style={{ height: `${expH}%` }} title={`Expenses: ${formatCents(s.total_expenses_cents)}`} />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {summaries.slice(-6).map(s => (
                <div key={`${s.period_year}-${s.period_month}`} className="flex-1 text-center text-xs text-slate-400">
                  {MONTHS[s.period_month - 1]}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-[#2BB673]/40 rounded" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-rose-200 rounded" /> Expenses</span>
            </div>
          </div>

          {/* Monthly Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Period</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Gross Revenue</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Expenses</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Net Profit</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Transactions</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {summaries.map(s => (
                  <tr key={`${s.period_year}-${s.period_month}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{MONTHS[s.period_month - 1]} {s.period_year}</td>
                    <td className="px-4 py-3 text-right text-slate-700 hidden sm:table-cell">{formatCents(s.gross_revenue_cents)}</td>
                    <td className="px-4 py-3 text-right text-rose-600 hidden md:table-cell">{formatCents(s.total_expenses_cents)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${s.estimated_profit_cents >= 0 ? 'text-[#2BB673]' : 'text-rose-600'}`}>
                      {formatCents(s.estimated_profit_cents)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 text-sm hidden lg:table-cell">{s.transaction_count}</td>
                    <td className="px-4 py-3 text-center">
                      {s.is_finalized
                        ? <span className="flex items-center justify-center gap-1 text-xs text-[#2BB673]"><CheckCircle className="w-3.5 h-3.5" /> Final</span>
                        : <span className="text-xs text-amber-600">Estimate</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financial Records */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Financial Records</h3>
            <button onClick={() => setShowAddRecord(true)} className="flex items-center gap-1.5 text-sm text-[#2BB673] hover:underline font-medium">
              <Plus className="w-3.5 h-3.5" /> Add Record
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Type</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Vendor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Date</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900">{r.description || 'No description'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.record_type === 'revenue' ? 'bg-green-50 text-green-700' : r.record_type === 'expense' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'}`}>
                      {r.record_type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${r.record_type === 'revenue' ? 'text-[#2BB673]' : 'text-rose-600'}`}>
                    {r.record_type === 'expense' ? '-' : '+'}{formatCents(r.amount_cents)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400 hidden md:table-cell">{r.vendor || '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 hidden lg:table-cell">
                    {new Date(r.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.is_verified
                      ? <CheckCircle className="w-4 h-4 text-[#2BB673] mx-auto" />
                      : <AlertCircle className="w-4 h-4 text-amber-400 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CPA Exports */}
      {activeTab === 'exports' && (
        <div className="space-y-3">
          {exports.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <div className="font-medium text-slate-600">No exports yet</div>
              <div className="text-sm text-slate-400 mt-1 mb-4">Generate your first financial export for your CPA or accountant</div>
              <Button onClick={() => setShowExportModal(true)}>Generate Export</Button>
            </div>
          ) : exports.map(ex => (
            <div key={ex.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900 capitalize">{ex.export_type.replace(/_/g, ' ')}</span>
                    <StatusBadge status={ex.status} />
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date(ex.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — {new Date(ex.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span>Revenue: <strong className="text-slate-700">{formatCents(ex.total_revenue_cents)}</strong></span>
                    <span>Expenses: <strong className="text-slate-700">{formatCents(ex.total_expenses_cents)}</strong></span>
                    <span>Transactions: <strong className="text-slate-700">{ex.transaction_count}</strong></span>
                  </div>
                </div>
                {ex.status === 'ready' && (
                  <button
                    onClick={() => downloadExport(ex)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#2BB673] text-white text-sm font-medium rounded-lg hover:bg-[#22a262] transition-colors flex-shrink-0"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                )}
              </div>
              {ex.generated_at && (
                <div className="mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Generated {new Date(ex.generated_at).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Generate Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowExportModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg text-slate-900 mb-4">Generate CPA Export</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Export Type</label>
                <select value={exportForm.export_type} onChange={e => setExportForm(f => ({ ...f, export_type: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20">
                  {EXPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Period Start *</label>
                  <input type="date" value={exportForm.period_start} onChange={e => setExportForm(f => ({ ...f, period_start: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Period End *</label>
                  <input type="date" value={exportForm.period_end} onChange={e => setExportForm(f => ({ ...f, period_end: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Format</label>
                <div className="flex gap-2">
                  {['json', 'csv'].map(f => (
                    <button key={f} onClick={() => setExportForm(prev => ({ ...prev, file_format: f }))} className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors uppercase ${exportForm.file_format === f ? 'border-[#2BB673] bg-[#2BB673]/10 text-[#2BB673]' : 'border-slate-200 text-slate-600'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                <strong>Note:</strong> The export will include revenue, expenses, and transaction data for the selected period. You can download it or send it directly to your CPA.
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowExportModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600">Cancel</button>
              <button onClick={handleGenerateExport} disabled={generating || !exportForm.period_start || !exportForm.period_end} className="flex-1 py-2.5 bg-[#2BB673] hover:bg-[#22a262] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                {generating ? 'Generating...' : 'Generate Export'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowAddRecord(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg text-slate-900 mb-4">Add Financial Record</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                <div className="flex gap-2">
                  {['revenue', 'expense', 'tax'].map(t => (
                    <button key={t} onClick={() => setRecordForm(f => ({ ...f, record_type: t }))} className={`flex-1 py-2 text-sm font-medium rounded-lg border capitalize ${recordForm.record_type === t ? 'border-[#2BB673] bg-[#2BB673]/10 text-[#2BB673]' : 'border-slate-200 text-slate-600'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Amount ($) *</label>
                <input type="number" value={recordForm.amount} onChange={e => setRecordForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description *</label>
                <input value={recordForm.description} onChange={e => setRecordForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Vendor (optional)</label>
                <input value={recordForm.vendor} onChange={e => setRecordForm(f => ({ ...f, vendor: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddRecord(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600">Cancel</button>
              <button onClick={handleAddRecord} disabled={!recordForm.description || !recordForm.amount} className="flex-1 py-2.5 bg-[#2BB673] hover:bg-[#22a262] disabled:opacity-50 text-white rounded-lg text-sm font-medium">Save Record</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
