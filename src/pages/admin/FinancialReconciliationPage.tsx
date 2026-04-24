import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, RefreshCw,
  CheckCircle2, Clock, BarChart2, ArrowUpRight, ArrowDownRight,
  ShieldAlert, Download
} from "lucide-react";

type FinancialSummary = {
  total_marketplace_revenue_cents: number;
  total_commissions_cents: number;
  total_payouts_cents: number;
  total_refunds_cents: number;
  net_revenue_cents: number;
  commission_rate_pct: number;
  pending_payouts_cents: number;
  marketplace_order_count: number;
  active_merchant_count: number;
};

type CommissionRow = {
  partner_id: string;
  partner_name: string;
  commission_count: number;
  total_commission_cents: number;
  paid_commission_cents: number;
  pending_commission_cents: number;
  reversed_commission_cents: number;
  latest_payout_date: string | null;
  needs_review: boolean;
};

type WebhookEvent = {
  id: string;
  stripe_event_id: string | null;
  event_type: string;
  status: string;
  error_message: string | null;
  processed_at: string;
  created_at: string;
};

const DAYS_OPTIONS = [7, 14, 30, 60, 90];

function fmt$(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SummaryCard({
  label, value, sub, icon: Icon, color, trend
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string; trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend === "up" && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
        {trend === "down" && <ArrowDownRight className="w-4 h-4 text-red-500" />}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function FinancialReconciliationPage() {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "commissions" | "webhooks">("overview");

  useEffect(() => { loadAll(); }, [days]);

  async function loadAll() {
    setLoading(true);
    try {
      const [summaryRes, commissionsRes, webhooksRes] = await Promise.all([
        supabase.rpc("get_financial_summary", { days_back: days }),
        supabase.rpc("get_commission_reconciliation", { days_back: days }),
        supabase
          .from("stripe_webhook_events")
          .select("*")
          .order("processed_at", { ascending: false })
          .limit(50),
      ]);

      if (summaryRes.data?.[0]) setSummary(summaryRes.data[0] as FinancialSummary);
      if (commissionsRes.data) setCommissions(commissionsRes.data as CommissionRow[]);
      if (webhooksRes.data) setWebhooks(webhooksRes.data as WebhookEvent[]);
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    if (!commissions.length) return;
    const headers = ["Partner", "Sales", "Total Commission", "Paid", "Pending", "Reversed", "Needs Review"];
    const rows = commissions.map(c => [
      c.partner_name,
      c.commission_count,
      (c.total_commission_cents / 100).toFixed(2),
      (c.paid_commission_cents / 100).toFixed(2),
      (c.pending_commission_cents / 100).toFixed(2),
      (c.reversed_commission_cents / 100).toFixed(2),
      c.needs_review ? "YES" : "no",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commission-reconciliation-${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const failedWebhooks = webhooks.filter(w => w.status === "failed");
  const flaggedPartners = commissions.filter(c => c.needs_review);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reconciliation</h1>
          <p className="text-gray-500 text-sm mt-0.5">Revenue, commissions, payouts, and webhook health.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            {DAYS_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${days === d ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {d}d
              </button>
            ))}
          </div>
          <button onClick={loadAll} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {(failedWebhooks.length > 0 || flaggedPartners.length > 0) && (
        <div className="space-y-2">
          {failedWebhooks.length > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm font-medium text-red-800">
                {failedWebhooks.length} failed Stripe webhook{failedWebhooks.length !== 1 ? "s" : ""} — check the Webhooks tab
              </p>
            </div>
          )}
          {flaggedPartners.length > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm font-medium text-amber-800">
                {flaggedPartners.length} partner{flaggedPartners.length !== 1 ? "s" : ""} flagged for commission review
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(["overview", "commissions", "webhooks"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
              tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
            {t === "webhooks" && failedWebhooks.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">{failedWebhooks.length}</span>
            )}
            {t === "commissions" && flaggedPartners.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">{flaggedPartners.length}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-400 text-sm">Loading reconciliation data…</div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <SummaryCard
                  label="Gross Revenue"
                  value={fmt$(summary?.total_marketplace_revenue_cents ?? 0)}
                  sub={`${summary?.marketplace_order_count ?? 0} orders`}
                  icon={DollarSign}
                  color="bg-emerald-50 text-emerald-600"
                  trend="up"
                />
                <SummaryCard
                  label="Commissions Earned"
                  value={fmt$(summary?.total_commissions_cents ?? 0)}
                  sub={`${summary?.commission_rate_pct ?? 0}% of revenue`}
                  icon={TrendingUp}
                  color="bg-blue-50 text-blue-600"
                />
                <SummaryCard
                  label="Payouts Sent"
                  value={fmt$(summary?.total_payouts_cents ?? 0)}
                  icon={ArrowUpRight}
                  color="bg-teal-50 text-teal-600"
                />
                <SummaryCard
                  label="Refunds Issued"
                  value={fmt$(summary?.total_refunds_cents ?? 0)}
                  icon={TrendingDown}
                  color="bg-red-50 text-red-600"
                  trend="down"
                />
                <SummaryCard
                  label="Net Revenue"
                  value={fmt$(summary?.net_revenue_cents ?? 0)}
                  sub={`${summary?.active_merchant_count ?? 0} active merchants`}
                  icon={BarChart2}
                  color="bg-gray-100 text-gray-700"
                />
              </div>

              {/* Pending payouts callout */}
              {(summary?.pending_payouts_cents ?? 0) > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-900">Pending Payouts</p>
                      <p className="text-sm text-amber-700">Amount owed to partners not yet disbursed</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-amber-900">{fmt$(summary?.pending_payouts_cents ?? 0)}</p>
                </div>
              )}

              {/* Revenue breakdown bar */}
              {(summary?.total_marketplace_revenue_cents ?? 0) > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue Breakdown ({days}d)</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Net Revenue (after commissions + refunds)", cents: summary?.net_revenue_cents ?? 0, color: "bg-emerald-500", total: summary?.total_marketplace_revenue_cents ?? 1 },
                      { label: "Commissions", cents: summary?.total_commissions_cents ?? 0, color: "bg-blue-400", total: summary?.total_marketplace_revenue_cents ?? 1 },
                      { label: "Refunds", cents: summary?.total_refunds_cents ?? 0, color: "bg-red-400", total: summary?.total_marketplace_revenue_cents ?? 1 },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{item.label}</span>
                          <span className="font-semibold">{fmt$(item.cents)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${Math.min(100, Math.round((item.cents / item.total) * 100))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMMISSIONS TAB */}
          {tab === "commissions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{commissions.length} partners with activity in the last {days} days</p>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Partner</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Sales</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Total Earned</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Paid Out</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Pending</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Reversed</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Last Payout</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {commissions.map(c => (
                        <tr key={c.partner_id} className={`hover:bg-gray-50 ${c.needs_review ? "bg-amber-50/40" : ""}`}>
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold text-gray-900">{c.partner_name}</p>
                            <p className="text-xs text-gray-400">{c.commission_count} commissions</p>
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-700">{c.commission_count}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{fmt$(c.total_commission_cents)}</td>
                          <td className="px-4 py-3 text-right text-sm text-emerald-700">{fmt$(c.paid_commission_cents)}</td>
                          <td className="px-4 py-3 text-right text-sm text-amber-700 font-medium">{fmt$(c.pending_commission_cents)}</td>
                          <td className="px-4 py-3 text-right text-sm text-red-600">{fmt$(c.reversed_commission_cents)}</td>
                          <td className="px-4 py-3 text-right text-xs text-gray-500">
                            {c.latest_payout_date
                              ? new Date(c.latest_payout_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                              : "Never"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {c.needs_review ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                <AlertTriangle className="w-3 h-3" /> Review
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                <CheckCircle2 className="w-3 h-3" /> OK
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {commissions.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-sm text-gray-400">
                            No partner commission activity in the last {days} days.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* WEBHOOKS TAB */}
          {tab === "webhooks" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Events", count: webhooks.length, color: "text-gray-900" },
                  { label: "Processed", count: webhooks.filter(w => w.status === "processed" || w.status === "processing").length, color: "text-emerald-700" },
                  { label: "Failed", count: failedWebhooks.length, color: "text-red-700" },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Event ID</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Type</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Error</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Processed At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {webhooks.map(w => (
                        <tr key={w.id} className={`hover:bg-gray-50 ${w.status === "failed" ? "bg-red-50/30" : ""}`}>
                          <td className="px-4 py-3">
                            <p className="font-mono text-xs text-gray-500 truncate max-w-[160px]">{w.stripe_event_id ?? w.id}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700">{w.event_type}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              w.status === "processed" ? "bg-emerald-100 text-emerald-700"
                              : w.status === "failed" ? "bg-red-100 text-red-700"
                              : w.status === "processing" ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                            }`}>
                              {w.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-red-600 max-w-[200px] truncate">
                            {w.error_message ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-gray-400">
                            {w.processed_at
                              ? new Date(w.processed_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                              : "—"}
                          </td>
                        </tr>
                      ))}
                      {webhooks.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-sm text-gray-400">No webhook events recorded yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
