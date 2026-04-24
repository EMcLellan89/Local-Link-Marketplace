import { useState, useEffect } from 'react';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  TrendingUp, Users, DollarSign, BarChart2, ArrowUpRight, ArrowDownRight,
  Calendar, Target, Activity, Loader2
} from 'lucide-react';

const RANGES = [
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
];

// Simulated monthly data for chart
const MONTHLY_DATA = [
  { month: 'Oct', revenue: 4200, merchants: 3, leads: 12 },
  { month: 'Nov', revenue: 6800, merchants: 5, leads: 18 },
  { month: 'Dec', revenue: 8100, merchants: 4, leads: 22 },
  { month: 'Jan', revenue: 11400, merchants: 7, leads: 31 },
  { month: 'Feb', revenue: 13200, merchants: 6, leads: 28 },
  { month: 'Mar', revenue: 16800, merchants: 9, leads: 45 },
  { month: 'Apr', revenue: 19400, merchants: 11, leads: 52 },
];

const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue));

export default function PartnerAnalyticsPage() {
  const { user } = useAuth();
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(false);

  const kpis = [
    { label: 'Total Earnings', value: '$19,420', change: '+18%', up: true, icon: DollarSign, color: 'text-[#2BB673] bg-emerald-100' },
    { label: 'Active Merchants', value: '42', change: '+11%', up: true, icon: Users, color: 'text-blue-600 bg-blue-100' },
    { label: 'Leads Generated', value: '52', change: '+16%', up: true, icon: Target, color: 'text-amber-600 bg-amber-100' },
    { label: 'Conversion Rate', value: '31%', change: '-2%', up: false, icon: Activity, color: 'text-rose-600 bg-rose-100' },
  ];

  const topProducts = [
    { name: '1Hub CRM (Pro)', revenue: '$6,840', count: 18, pct: 35 },
    { name: 'AI Bot Suite', revenue: '$4,210', count: 11, pct: 22 },
    { name: 'AutoScale', revenue: '$3,600', count: 9, pct: 19 },
    { name: 'Executive Solutions', revenue: '$2,880', count: 6, pct: 15 },
    { name: 'Other', revenue: '$1,870', count: 8, pct: 9 },
  ];

  const recentActivity = [
    { type: 'sale', desc: 'Mike\'s Auto Detailing signed up for 1Hub CRM Pro', amount: '+$97/mo', time: '2h ago' },
    { type: 'lead', desc: 'New lead added: Downtown Coffee Co — Austin, TX', amount: null, time: '5h ago' },
    { type: 'sale', desc: 'Bella\'s Salon upgraded to Enterprise tier', amount: '+$297/mo', time: '1d ago' },
    { type: 'commission', desc: 'Commission payout processed', amount: '+$1,240', time: '2d ago' },
    { type: 'lead', desc: 'New lead added: Precision Dental — Round Rock', amount: null, time: '3d ago' },
    { type: 'sale', desc: 'Fresh Cuts Barbershop activated AI Bots', amount: '+$147/mo', time: '4d ago' },
  ];

  return (
    <PartnerHubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Partner Analytics</h1>
            <p className="text-slate-500 mt-1">Performance insights across your entire portfolio.</p>
          </div>
          <div className="flex gap-2">
            {RANGES.map(r => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${range === r.value ? 'bg-[#2BB673] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>
                  <k.icon className="w-5 h-5" />
                </div>
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {k.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {k.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-3">{k.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#2BB673]" />
              Monthly Revenue Trend
            </h2>
            <span className="text-sm text-slate-500">Last 7 months</span>
          </div>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY_DATA.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-slate-700">${(d.revenue / 1000).toFixed(1)}k</span>
                <div className="w-full flex flex-col-reverse">
                  <div
                    className="w-full bg-gradient-to-t from-[#2BB673] to-teal-400 rounded-t-lg transition-all"
                    style={{ height: `${Math.round((d.revenue / maxRevenue) * 160)}px` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top products */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2BB673]" />
              Top Products Sold
            </h2>
            <div className="space-y-3">
              {topProducts.map(p => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-slate-800">{p.name}</span>
                      <span className="text-xs text-slate-400 ml-2">{p.count} merchants</span>
                    </div>
                    <span className="text-sm font-semibold text-[#2BB673]">{p.revenue}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-[#2BB673] h-1.5 rounded-full" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2BB673]" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    a.type === 'sale' ? 'bg-[#2BB673]' : a.type === 'commission' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{a.desc}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{a.time}</span>
                      {a.amount && <span className="text-xs font-semibold text-[#2BB673]">{a.amount}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goal tracker */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold text-lg">April Goal Progress</h3>
              <p className="text-slate-400 text-sm mt-0.5">$25,000 monthly recurring revenue target</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">$19,420</p>
              <p className="text-slate-400 text-sm">of $25,000 goal</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>77.7% complete</span>
              <span>$5,580 remaining</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-[#2BB673] to-teal-400 h-3 rounded-full" style={{ width: '77.7%' }} />
            </div>
          </div>
        </div>
      </div>
    </PartnerHubLayout>
  );
}
