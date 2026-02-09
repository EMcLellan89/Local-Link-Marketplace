import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import { Link } from 'react-router-dom';

interface AccountingData {
  total_revenue_cents: number;
  total_expenses_cents: number;
  net_income_cents: number;
  customers_count: number;
  invoices_count: number;
}

export default function AccountingLitePage() {
  const [loading, setLoading] = useState(true);
  const [accountingData, setAccountingData] = useState<AccountingData | null>(null);
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
        .from('merchant_accounting_lite')
        .select('*')
        .eq('merchant_id', merchantData?.id)
        .eq('month', currentMonth.toISOString().split('T')[0])
        .maybeSingle();

      if (accounting) {
        setAccountingData(accounting);
      } else {
        setAccountingData({
          total_revenue_cents: 0,
          total_expenses_cents: 0,
          net_income_cents: 0,
          customers_count: 0,
          invoices_count: 0,
        });
      }
    } catch (error) {
      console.error('Error loading accounting data:', error);
    } finally {
      setLoading(false);
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

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Local-Link Lite Accounting</h1>
            <p className="text-gray-600 mt-1">Simple financial overview for your business</p>
          </div>
          <Link
            to="/merchant/upgrade"
            className="px-4 py-2 bg-[#2BB673] text-white rounded-lg hover:bg-[#259a5f] transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(accountingData?.total_revenue_cents || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(accountingData?.total_expenses_cents || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Income</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(accountingData?.net_income_cents || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Profit/Loss</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {accountingData?.customers_count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total customers</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Invoices</h3>
                <p className="text-sm text-gray-600">Total invoices this month</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {accountingData?.invoices_count || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2BB673] to-[#259a5f] p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-semibold text-lg mb-2">Need More Features?</h3>
            <p className="text-sm text-white/90 mb-4">
              Upgrade to Local-Link Pro to get tax tracking, quarterly reports, and advanced analytics.
            </p>
            <Link
              to="/merchant/upgrade"
              className="inline-block px-4 py-2 bg-white text-[#2BB673] rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Local-Link Lite Accounting</h3>
          <p className="text-blue-800">
            This is a simplified accounting view for Start tier merchants. Track your basic revenue,
            expenses, and net income. Upgrade to Growth or Scale tier to unlock advanced features including
            quarterly tax tracking, detailed reports, and automatic tax calculations.
          </p>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
