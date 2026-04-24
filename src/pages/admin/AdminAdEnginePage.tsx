import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Megaphone, DollarSign, TrendingUp, Users, RefreshCw,
  Plus, Eye, AlertTriangle, CheckCircle2, Clock, BarChart3
} from "lucide-react";

type AdCampaign = {
  id: string;
  partner_id: string | null;
  partner_name: string | null;
  partner_slug: string | null;
  product: string | null;
  budget_cents: number;
  prepaid_cents: number;
  spent_cents: number;
  leads: number;
  sales: number;
  status: string;
  created_at: string;
};

function formatCents(c: number) {
  return `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

function roi(sales: number, spent: number) {
  if (!spent) return "—";
  const r = ((sales * 5000 - spent) / spent) * 100;
  return `${r >= 0 ? "+" : ""}${r.toFixed(0)}%`;
}

export default function AdminAdEnginePage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "paused">("all");

  useEffect(() => { loadCampaigns(); }, []);

  async function loadCampaigns() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("partner_tracking_links")
        .select("partner_id, slug, partners!inner(profiles!inner(full_name))")
        .limit(100);

      const mockCampaigns: AdCampaign[] = (data ?? []).slice(0, 10).map((row: any, i: number) => ({
        id: row.partner_id + i,
        partner_id: row.partner_id,
        partner_name: row.partners?.profiles?.full_name ?? "Partner",
        partner_slug: row.slug,
        product: ["Merchant Starter", "1Hub CRM", "Visibility Package"][i % 3],
        budget_cents: [50000, 100000, 25000, 75000][i % 4],
        prepaid_cents: [30000, 80000, 20000, 60000][i % 4],
        spent_cents: [18000, 55000, 12000, 40000][i % 4],
        leads: [12, 28, 8, 19][i % 4],
        sales: [3, 9, 2, 7][i % 4],
        status: ["active", "active", "pending", "paused"][i % 4],
        created_at: new Date(Date.now() - i * 86400000 * 7).toISOString(),
      }));

      setCampaigns(mockCampaigns);
    } finally {
      setLoading(false);
    }
  }

  const filtered = campaigns.filter(c => filter === "all" || c.status === filter);
  const totalBudget = campaigns.reduce((s, c) => s + c.budget_cents, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent_cents, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalSales = campaigns.reduce((s, c) => s + c.sales, 0);

  const STATUS_STYLE: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-yellow-100 text-yellow-700",
    paused: "bg-gray-100 text-gray-600",
    ended: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Megaphone className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Central Ad Engine</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            All paid campaigns are run by Local-Link from official accounts. Partners prepay budget — their slug is attached for attribution.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadCampaigns} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
      </div>

      {/* Policy banner */}
      <div className="border-2 border-gray-900 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-gray-900 text-sm">Partner Advertising Policy</p>
          <p className="text-sm text-gray-600 mt-1">
            Partners may NOT run paid ads on any platform. All campaigns are managed here by Local-Link from official accounts only.
            Partners may prepay a budget — their referral slug is attached so all leads and sales are correctly attributed.
          </p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: formatCents(totalBudget), icon: DollarSign, color: "text-blue-600" },
          { label: "Total Spent", value: formatCents(totalSpent), icon: BarChart3, color: "text-gray-700" },
          { label: "Total Leads", value: totalLeads.toString(), icon: Users, color: "text-emerald-600" },
          { label: "Total Sales", value: totalSales.toString(), icon: TrendingUp, color: "text-blue-700" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${color}`} />
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Add Campaign form */}
      {showAdd && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Launch New Campaign</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Partner Slug</label>
              <input type="text" placeholder="partner-slug" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Product</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Merchant Starter Plan</option>
                <option>Merchant Pro Plan</option>
                <option>1Hub CRM</option>
                <option>Visibility Package</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Budget ($)</label>
              <input type="number" placeholder="500.00" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Platform</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Facebook / Instagram</option>
                <option>Google</option>
                <option>TikTok</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target Geography</label>
              <input type="text" placeholder="Dallas, TX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create Campaign</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "active", "pending", "paused"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Campaigns table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Partner / Product</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Budget</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Prepaid</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Spent</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Leads</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Sales</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">ROI Est.</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{c.partner_name}</p>
                    <p className="text-xs text-gray-500">{c.product}</p>
                    {c.partner_slug && (
                      <p className="text-xs text-blue-600 font-mono">/{c.partner_slug}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">{formatCents(c.budget_cents)}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">{formatCents(c.prepaid_cents)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-gray-900">{formatCents(c.spent_cents)}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1 mt-1 ml-auto">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${Math.min(100, (c.spent_cents / c.budget_cents) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">{c.leads}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-emerald-700">{c.sales}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">{roi(c.sales, c.spent_cents)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLE[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-gray-700">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-10 text-center text-sm text-gray-400">No campaigns found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
