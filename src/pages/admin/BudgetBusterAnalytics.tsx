import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DollarSign, TrendingUp, Users, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MRRData {
  mode: string;
  billing_cycle: string;
  active_subs: number;
  mrr_cents: number;
  avg_price_cents: number;
}

interface MarginData {
  mode: string;
  total_revenue_cents: number;
  total_cost_cents: number;
  gross_profit_cents: number;
  gross_margin_percent: number;
}

interface ModeSwitchData {
  from_mode: string;
  to_mode: string;
  count: number;
}

export default function BudgetBusterAnalytics() {
  const [mrrData, setMrrData] = useState<MRRData[]>([]);
  const [marginData, setMarginData] = useState<MarginData[]>([]);
  const [modeSwitches, setModeSwitches] = useState<ModeSwitchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const [mrrRes, marginRes, switchesRes] = await Promise.all([
        supabase.rpc('get_budget_buster_mrr_by_mode'),
        supabase.rpc('get_budget_buster_margins_by_mode'),
        supabase
          .from('budget_buster_mode_switches')
          .select('from_mode, to_mode')
          .order('created_at', { ascending: false })
      ]);

      if (mrrRes.data) setMrrData(mrrRes.data);
      if (marginRes.data) setMarginData(marginRes.data);

      if (switchesRes.data) {
        const switchCounts: Record<string, number> = {};
        switchesRes.data.forEach((s: { from_mode: string; to_mode: string }) => {
          const key = `${s.from_mode}->${s.to_mode}`;
          switchCounts[key] = (switchCounts[key] || 0) + 1;
        });

        const switches = Object.entries(switchCounts).map(([key, count]) => {
          const [from_mode, to_mode] = key.split('->');
          return { from_mode, to_mode, count };
        });
        setModeSwitches(switches);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalMRR = mrrData.reduce((sum, d) => sum + Number(d.mrr_cents), 0);
  const totalSubs = mrrData.reduce((sum, d) => sum + Number(d.active_subs), 0);
  const blendedARPU = totalSubs > 0 ? totalMRR / totalSubs : 0;

  const manualData = mrrData.filter(d => d.mode === 'manual');
  const connectedData = mrrData.filter(d => d.mode === 'connected');

  const manualSubs = manualData.reduce((sum, d) => sum + Number(d.active_subs), 0);
  const connectedSubs = connectedData.reduce((sum, d) => sum + Number(d.active_subs), 0);

  const manualPercent = totalSubs > 0 ? (manualSubs / totalSubs) * 100 : 0;
  const connectedPercent = totalSubs > 0 ? (connectedSubs / totalSubs) * 100 : 0;

  const manualMargin = marginData.find(m => m.mode === 'manual');
  const connectedMargin = marginData.find(m => m.mode === 'connected');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Budget Buster Analytics</h1>
        <p className="text-gray-600 mt-2">Product performance, margins, and mode insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total MRR</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${(totalMRR / 100).toFixed(2)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Monthly recurring revenue</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Active Subscribers</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalSubs}</div>
          <p className="text-xs text-gray-500 mt-1">
            {manualSubs} manual, {connectedSubs} connected
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Blended ARPU</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${(blendedARPU / 100).toFixed(2)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Average revenue per user</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Automation Rate</span>
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {connectedPercent.toFixed(0)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">Using Plaid automation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Premium Manual</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Subscribers</span>
                <span className="font-medium">{manualSubs}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${manualPercent}%` }}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Gross Margin</span>
                <span className="text-lg font-bold text-green-600">
                  {manualMargin?.gross_margin_percent.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">Revenue</div>
                  <div className="font-medium">
                    ${((manualMargin?.total_revenue_cents || 0) / 100).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Cost</div>
                  <div className="font-medium">
                    ${((manualMargin?.total_cost_cents || 0) / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Pricing</h3>
              {manualData.map(d => (
                <div key={`${d.mode}-${d.billing_cycle}`} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600 capitalize">{d.billing_cycle}</span>
                  <span className="font-medium">${(Number(d.avg_price_cents) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded p-3 text-xs">
              <strong>Value Prop:</strong> Privacy-first, no bank connections required.
              Perfect for users who want full control.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Premium Connected</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Subscribers</span>
                <span className="font-medium">{connectedSubs}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${connectedPercent}%` }}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Gross Margin</span>
                <span className="text-lg font-bold text-green-600">
                  {connectedMargin?.gross_margin_percent.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">Revenue</div>
                  <div className="font-medium">
                    ${((connectedMargin?.total_revenue_cents || 0) / 100).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Plaid Cost</div>
                  <div className="font-medium text-red-600">
                    ${((connectedMargin?.total_cost_cents || 0) / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Pricing</h3>
              {connectedData.map(d => (
                <div key={`${d.mode}-${d.billing_cycle}`} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600 capitalize">{d.billing_cycle}</span>
                  <span className="font-medium">${(Number(d.avg_price_cents) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-100 rounded p-3 text-xs">
              <strong>Value Prop:</strong> Automatic bank sync via Plaid.
              Saves time with real-time data and automation.
            </div>
          </div>
        </div>
      </div>

      {modeSwitches.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mode Switches</h2>
          <div className="space-y-3">
            {modeSwitches.map((sw, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{sw.from_mode}</span>
                  {sw.from_mode === 'manual' && sw.to_mode === 'connected' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-orange-600" />
                  )}
                  <span className="text-sm font-medium capitalize">{sw.to_mode}</span>
                </div>
                <span className="text-sm text-gray-600">{sw.count} switches</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Track how users move between privacy (manual) and convenience (connected)
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Strategic Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-blue-100 bg-blue-50 rounded p-4">
            <h3 className="font-medium text-blue-900 mb-2">Control vs Convenience</h3>
            <p className="text-xs text-blue-800">
              This positioning lets users choose their priority: privacy or automation.
              No wrong answer.
            </p>
          </div>

          <div className="border border-green-100 bg-green-50 rounded p-4">
            <h3 className="font-medium text-green-900 mb-2">Margin Analysis</h3>
            <p className="text-xs text-green-800">
              Manual mode: ~90% margin. Connected: ~70% (Plaid costs $3.90/mo).
              Clear cost justification for pricing.
            </p>
          </div>

          <div className="border border-purple-100 bg-purple-50 rounded p-4">
            <h3 className="font-medium text-purple-900 mb-2">Partner Commission</h3>
            <p className="text-xs text-purple-800">
              20% recurring on all subscriptions. Partners can sell either mode.
              Mode switches tracked for optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
