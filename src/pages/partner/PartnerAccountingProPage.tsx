import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Users, MapPin, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface AccountingData {
  total_revenue_cents: number;
  total_commissions_earned_cents: number;
  total_expenses_cents: number;
  net_income_cents: number;
  taxable_income_cents: number;
  state_sales_tax_cents: number;
  federal_income_tax_cents: number;
  total_tax_owed_cents: number;
  merchants_count: number;
  active_territories_count: number;
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

export default function PartnerAccountingProPage() {
  const [loading, setLoading] = useState(true);
  const [accountingData, setAccountingData] = useState<AccountingData | null>(null);
  const [taxObligation, setTaxObligation] = useState<TaxObligation | null>(null);
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setPartner(partnerData);

      const currentMonth = new Date();
      currentMonth.setDate(1);

      const { data: accounting } = await supabase
        .from('partner_accounting_pro')
        .select('*')
        .eq('partner_id', partnerData?.id)
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
        .eq('entity_id', partnerData?.id)
        .eq('entity_type', 'partner')
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
    if (!taxObligation || !partner) return;

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading accounting data...</div>
      </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Partner Accounting Pro</h1>
              <p className="text-gray-600 mt-1">Commission tracking and tax management</p>
            </div>
            <Link
              to="/partner/dashboard"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Quarterly Tax Obligations */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Quarterly Tax Obligations - {partner?.primary_state || 'Multiple States'}
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
                <div className="bg-purple-600 px-3 py-1 rounded-full text-white text-sm font-medium">
                  Due: {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Taxable Income</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(accountingData?.taxable_income_cents || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Commission earnings</p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">State Sales Tax</p>
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
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(accountingData?.total_tax_owed_cents || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Combined</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Payment Instructions:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  <strong>State Taxes:</strong> Pay online at your state's tax portal
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
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
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
                  <p className="text-sm text-gray-600">Total Commissions</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatCurrency(accountingData?.total_commissions_earned_cents || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Net Income</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatCurrency(accountingData?.net_income_cents || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">After expenses</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Merchants</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {accountingData?.merchants_count || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">In your network</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Territories</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {accountingData?.active_territories_count || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Active</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <MapPin className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
            <h3 className="font-semibold text-purple-900 mb-2">Partner Accounting Pro</h3>
            <p className="text-purple-800">
              Track your commission earnings, manage expenses, and stay on top of quarterly tax obligations.
              All tax calculations are estimates and should be verified with your accountant or tax professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
