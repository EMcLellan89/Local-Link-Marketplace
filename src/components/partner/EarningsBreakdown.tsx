import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';

interface EarningsData {
  today_cents: number;
  week_cents: number;
  month_cents: number;
  today_count: number;
  week_count: number;
  month_count: number;
}

interface RecentSale {
  id: string;
  created_at: string;
  product_key: string;
  amount_cents: number;
  commission_cents: number;
}

interface EarningsBreakdownProps {
  partnerId: string;
}

export default function EarningsBreakdown({ partnerId }: EarningsBreakdownProps) {
  const [earnings, setEarnings] = useState<EarningsData>({
    today_cents: 0,
    week_cents: 0,
    month_cents: 0,
    today_count: 0,
    week_count: 0,
    month_count: 0
  });
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    fetchEarnings();
  }, [partnerId]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch earnings by period
      const { data: todayEarnings, error: todayError } = await supabase
        .from('partner_earnings')
        .select('amount_cents, sales_ledger!inner(id, created_at, product_key, amount_cents)')
        .eq('partner_id', partnerId)
        .in('status', ['approved', 'paid'])
        .gte('sales_ledger.created_at', startOfToday.toISOString());

      const { data: weekEarnings, error: weekError } = await supabase
        .from('partner_earnings')
        .select('amount_cents, sales_ledger!inner(id, created_at, product_key, amount_cents)')
        .eq('partner_id', partnerId)
        .in('status', ['approved', 'paid'])
        .gte('sales_ledger.created_at', startOfWeek.toISOString());

      const { data: monthEarnings, error: monthError } = await supabase
        .from('partner_earnings')
        .select('amount_cents, sales_ledger!inner(id, created_at, product_key, amount_cents)')
        .eq('partner_id', partnerId)
        .in('status', ['approved', 'paid'])
        .gte('sales_ledger.created_at', startOfMonth.toISOString());

      if (todayError || weekError || monthError) {
        throw todayError || weekError || monthError;
      }

      // Calculate totals
      const todayTotal = todayEarnings?.reduce((sum, e) => sum + e.amount_cents, 0) || 0;
      const weekTotal = weekEarnings?.reduce((sum, e) => sum + e.amount_cents, 0) || 0;
      const monthTotal = monthEarnings?.reduce((sum, e) => sum + e.amount_cents, 0) || 0;

      // Get unique sales counts
      const todayCount = new Set(todayEarnings?.map(e => e.sales_ledger.id) || []).size;
      const weekCount = new Set(weekEarnings?.map(e => e.sales_ledger.id) || []).size;
      const monthCount = new Set(monthEarnings?.map(e => e.sales_ledger.id) || []).size;

      setEarnings({
        today_cents: todayTotal,
        week_cents: weekTotal,
        month_cents: monthTotal,
        today_count: todayCount,
        week_count: weekCount,
        month_count: monthCount
      });

      // Build recent sales list (last 10 from this month)
      const salesMap = new Map<string, RecentSale>();
      monthEarnings?.forEach(e => {
        const existing = salesMap.get(e.sales_ledger.id);
        const commissionCents = existing ? existing.commission_cents + e.amount_cents : e.amount_cents;

        salesMap.set(e.sales_ledger.id, {
          id: e.sales_ledger.id,
          created_at: e.sales_ledger.created_at,
          product_key: e.sales_ledger.product_key,
          amount_cents: e.sales_ledger.amount_cents,
          commission_cents: commissionCents
        });
      });

      const recentList = Array.from(salesMap.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      setRecentSales(recentList);

    } catch (error) {
      console.error('Error fetching earnings breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cents / 100);
  };

  const getActiveData = () => {
    switch (activeTab) {
      case 'today':
        return { amount: earnings.today_cents, count: earnings.today_count };
      case 'week':
        return { amount: earnings.week_cents, count: earnings.week_count };
      case 'month':
        return { amount: earnings.month_cents, count: earnings.month_count };
    }
  };

  const activeData = getActiveData();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Earnings Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Earnings</h2>
          <div className="p-2 bg-white/20 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm opacity-90 mb-2">
            {activeTab === 'today' && 'Today'}
            {activeTab === 'week' && 'This Week'}
            {activeTab === 'month' && 'This Month'}
          </p>
          <p className="text-4xl font-bold">{formatCurrency(activeData.amount)}</p>
          <p className="text-sm opacity-90 mt-1">{activeData.count} sales</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'today'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Today
            </div>
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'week'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              Week
            </div>
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'month'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Month
            </div>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">Today</p>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(earnings.today_cents)}</p>
          <p className="text-xs text-gray-500 mt-1">{earnings.today_count} sales</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">This Week</p>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(earnings.week_cents)}</p>
          <p className="text-xs text-gray-500 mt-1">{earnings.week_count} sales</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">This Month</p>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(earnings.month_cents)}</p>
          <p className="text-xs text-gray-500 mt-1">{earnings.month_count} sales</p>
        </div>
      </div>

      {/* Recent Sales */}
      {recentSales.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Recent Sales</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentSales.map((sale) => (
              <div key={sale.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{sale.product_key}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(sale.created_at).toLocaleDateString()} at{' '}
                    {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    +{formatCurrency(sale.commission_cents)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(sale.amount_cents)} sale
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
