import { useState, useEffect } from 'react';
import { InternalCRMLayout } from '../../components/layout/InternalCRMLayout';
import { FileText, DollarSign, TrendingUp, Users, LifeBuoy, Building2, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TaxObligation {
  id: string;
  quarter: string;
  year: number;
  state: string;
  taxable_sales_cents: number;
  state_sales_tax_cents: number;
  federal_income_tax_cents: number;
  total_tax_owed_cents: number;
  due_date: string;
  paid: boolean;
}

export default function AccountingPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    monthlyRevenue: 0,
    totalSales: 0,
    pendingInvoices: 0,
    openTickets: 0,
    businessUnits: 0,
  });
  const [taxObligation, setTaxObligation] = useState<TaxObligation | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setStats({
        totalCustomers: 0,
        monthlyRevenue: 0,
        totalSales: 0,
        pendingInvoices: 0,
        openTickets: 0,
        businessUnits: 0,
      });

      const currentMonth = new Date();
      const currentQuarter = Math.floor(currentMonth.getMonth() / 3) + 1;
      const currentYear = currentMonth.getFullYear();

      const { data: taxData } = await supabase
        .from('tax_obligations_quarterly')
        .select('*')
        .eq('entity_type', 'admin')
        .eq('quarter', `Q${currentQuarter}`)
        .eq('year', currentYear)
        .maybeSingle();

      if (taxData) {
        setTaxObligation(taxData);
      }
    } catch (error) {
      console.error('Error loading accounting data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoPayTax() {
    if (!taxObligation) return;

    try {
      const { error } = await supabase
        .from('tax_obligations_quarterly')
        .update({
          paid: true,
          paid_at: new Date().toISOString(),
          payment_method: 'auto_pay',
        })
        .eq('id', taxObligation.id);

      if (!error) {
        alert('Tax payment scheduled successfully!');
        loadData();
      }
    } catch (error) {
      console.error('Error processing tax payment:', error);
      alert('Failed to process tax payment');
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getCurrentQuarterDates = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    const year = now.getFullYear();
    const quarterStart = new Date(year, (quarter - 1) * 3, 1);
    const quarterEnd = new Date(year, quarter * 3, 0);
    return {
      quarter: `Q${quarter}`,
      year,
      start: `${quarterStart.getMonth() + 1}/${quarterStart.getDate()}/${year}`,
      end: `${quarterEnd.getMonth() + 1}/${quarterEnd.getDate()}/${year}`,
    };
  };

  const quarterInfo = getCurrentQuarterDates();
  const dueDate = taxObligation?.due_date
    ? new Date(taxObligation.due_date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : `Thursday, April 30, ${quarterInfo.year}`;

  if (loading) {
    return (
      <InternalCRMLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading accounting data...</div>
        </div>
      </InternalCRMLayout>
    );
  }

  return (
    <InternalCRMLayout>
      <div className="space-y-6 mb-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening across all your businesses.</p>
        </div>

        {/* Quarterly Tax Obligations */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Quarterly Tax Obligations - Massachusetts
                </h2>
                <p className="text-sm text-gray-700">
                  {quarterInfo.quarter} {quarterInfo.year} ({quarterInfo.start} - {quarterInfo.end})
                </p>
              </div>
            </div>
            {taxObligation?.paid ? (
              <div className="bg-green-500 px-2 py-1 rounded-full text-white text-xs font-medium">
                Paid
              </div>
            ) : (
              <div className="bg-orange-500 px-2 py-1 rounded-full text-white text-xs font-medium">
                Due: 4/30/{quarterInfo.year}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Taxable Sales</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(taxObligation?.taxable_sales_cents || 0)}
              </p>
              <p className="text-xs text-gray-500">Est. 91%</p>
            </div>

            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">MA State Sales Tax</p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(taxObligation?.state_sales_tax_cents || 0)}
              </p>
              <p className="text-xs text-gray-500">Est. 6.25%</p>
            </div>

            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Federal Income Tax</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(taxObligation?.federal_income_tax_cents || 0)}
              </p>
              <p className="text-xs text-gray-500">Est. 21%</p>
            </div>

            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total Tax Owed</p>
              <p className="text-lg font-bold text-orange-600">
                {formatCurrency(taxObligation?.total_tax_owed_cents || 0)}
              </p>
              <p className="text-xs text-gray-500">Combined</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-xs">
            <p className="font-medium text-blue-900 mb-1">Payment Instructions:</p>
            <ul className="text-blue-800 space-y-1">
              <li>
                • <strong>MA Sales Tax:</strong> Pay online at{' '}
                <a
                  href="https://mtc.dor.state.ma.us/mtc/_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  MassTaxConnect <ExternalLink className="inline w-2 h-2" />
                </a>
              </li>
              <li>
                • <strong>Federal Taxes:</strong> File Form 1040-ES or pay via{' '}
                <a href="https://www.irs.gov/payments" target="_blank" rel="noopener noreferrer" className="underline">
                  IRS Direct Pay <ExternalLink className="inline w-2 h-2" />
                </a>
              </li>
              <li>• <strong>Deadline:</strong> {dueDate}</li>
            </ul>
          </div>

          {!taxObligation?.paid && (
            <button
              onClick={handleAutoPayTax}
              className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Auto-Pay Tax Obligations
            </button>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.totalCustomers} active</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.monthlyRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalSales)}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending Invoices</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingInvoices}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <LifeBuoy className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Open Tickets</h3>
                <p className="text-xs text-gray-600">Needs attention</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.openTickets}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Business Units</h3>
                <p className="text-xs text-gray-600">Active businesses</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.businessUnits}</p>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sales</h2>
              <button className="text-[#2BB673] hover:text-[#259a5f] text-sm font-medium">View All</button>
            </div>
          </div>
          <div className="p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-600">
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Business</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="pt-6 text-center text-gray-500 text-sm">
                    No recent sales found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 items-center text-xs text-gray-600">
          <span>Press</span>
          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">K</kbd>
          <span>for quick search</span>
        </div>
      </div>
    </InternalCRMLayout>
  );
}
