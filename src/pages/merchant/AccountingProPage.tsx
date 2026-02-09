import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, FileText, LifeBuoy, Building2, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';

interface AccountingData {
  total_revenue_cents: number;
  total_expenses_cents: number;
  net_income_cents: number;
  taxable_sales_cents: number;
  state_sales_tax_cents: number;
  federal_income_tax_cents: number;
  total_tax_owed_cents: number;
  customers_count: number;
  invoices_count: number;
  pending_invoices_count: number;
  open_tickets_count: number;
}

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

export default function AccountingProPage() {
  const [loading, setLoading] = useState(true);
  const [accountingData, setAccountingData] = useState<AccountingData | null>(null);
  const [taxObligation, setTaxObligation] = useState<TaxObligation | null>(null);
  const [merchant, setMerchant] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: merchantData } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setMerchant(merchantData);

      const currentMonth = new Date();
      currentMonth.setDate(1);

      const { data: accounting } = await supabase
        .from('merchant_accounting_pro')
        .select('*')
        .eq('merchant_id', merchantData?.id)
        .eq('month', currentMonth.toISOString().split('T')[0])
        .maybeSingle();

      if (accounting) {
        setAccountingData(accounting);
      }

      const currentQuarter = Math.floor(currentMonth.getMonth() / 3) + 1;
      const currentYear = currentMonth.getFullYear();

      const { data: taxData } = await supabase
        .from('tax_obligations_quarterly')
        .select('*')
        .eq('entity_id', merchantData?.id)
        .eq('entity_type', 'merchant')
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
    if (!taxObligation || !merchant) return;

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

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading accounting data...</div>
        </div>
      </BusinessHubLayout>
    );
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
      start: quarterStart.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      end: quarterEnd.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
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
    : 'Not set';

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Local-Link Pro Accounting</h1>
          <p className="text-gray-600 mt-1">Advanced financial management with tax tracking</p>
        </div>

        {/* Quarterly Tax Obligations */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Quarterly Tax Obligations - {merchant?.state || 'Massachusetts'}
                </h2>
                <p className="text-sm text-gray-700">
                  {quarterInfo.quarter} {new Date().getFullYear()} ({quarterInfo.start} - {quarterInfo.end})
                </p>
              </div>
            </div>
            {taxObligation?.paid && (
              <div className="bg-green-500 px-3 py-1 rounded-full text-white text-sm font-medium">
                Paid
              </div>
            )}
            {!taxObligation?.paid && (
              <div className="bg-orange-500 px-3 py-1 rounded-full text-white text-sm font-medium">
                Due: {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Taxable Sales</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(accountingData?.taxable_sales_cents || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Est. 91%</p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{merchant?.state || 'MA'} State Sales Tax</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(accountingData?.state_sales_tax_cents || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Est. 6.25%</p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Federal Income Tax</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(accountingData?.federal_income_tax_cents || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Est. 21%</p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Tax Owed</p>
              <p className="text-xl font-bold text-orange-600">
                {formatCurrency(accountingData?.total_tax_owed_cents || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Combined</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Payment Instructions:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                <strong>MA Sales Tax:</strong> Pay online at{' '}
                <a
                  href="https://mtc.dor.state.ma.us/mtc/_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  MassTaxConnect <ExternalLink className="inline w-3 h-3" />
                </a>
              </li>
              <li>
                <strong>Federal Taxes:</strong> File Form 1040-ES or pay via{' '}
                <a
                  href="https://www.irs.gov/payments"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  IRS Direct Pay <ExternalLink className="inline w-3 h-3" />
                </a>
              </li>
              <li>
                <strong>Deadline:</strong> {dueDate}
              </li>
            </ul>
          </div>

          {!taxObligation?.paid && (
            <button
              onClick={handleAutoPayTax}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Schedule Auto-Pay for Tax Obligations
            </button>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {accountingData?.customers_count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">{accountingData?.customers_count || 0} active</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(accountingData?.total_revenue_cents || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(accountingData?.total_revenue_cents || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Invoices</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {accountingData?.pending_invoices_count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <FileText className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-50 p-2 rounded-lg">
                <LifeBuoy className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Open Tickets</h3>
                <p className="text-sm text-gray-600">Needs attention</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {accountingData?.open_tickets_count || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Business Units</h3>
                <p className="text-sm text-gray-600">Active businesses</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
              <button className="text-[#2BB673] hover:text-[#259a5f] text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Business</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="pt-8 text-center text-gray-500">
                    No recent sales found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 items-center text-sm text-gray-600">
          <span>Press</span>
          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">K</kbd>
          <span>for quick search</span>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
