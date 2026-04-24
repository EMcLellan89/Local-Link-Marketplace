import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  DollarSign, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, Clock, Filter, User
} from "lucide-react";

type PayoutRow = {
  id: string;
  partner_id: string;
  amount_cents: number;
  status: string;
  created_at: string;
  period_start: string | null;
  period_end: string | null;
  partner_name: string | null;
  partner_email: string | null;
  quality_score: number | null;
  refund_risk: boolean;
};

function formatCents(c: number) {
  return `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export default function AdminPayoutApprovalPage() {
  const [rows, setRows] = useState<PayoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  useEffect(() => { loadData(); }, [filter]);

  async function loadData() {
    setLoading(true);
    try {
      let q = supabase
        .from("partner_payouts")
        .select(`
          id, partner_id, amount_cents, status, created_at, period_start, period_end,
          partners!inner(
            profiles!inner(full_name, email),
            quality:partner_quality_scores(score, refunds, chargebacks)
          )
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (filter === "pending") q = q.in("status", ["pending", "pending_approval"]);

      const { data } = await q;
      if (data) {
        setRows(data.map((r: any) => ({
          id: r.id,
          partner_id: r.partner_id,
          amount_cents: r.amount_cents ?? 0,
          status: r.status,
          created_at: r.created_at,
          period_start: r.period_start,
          period_end: r.period_end,
          partner_name: r.partners?.profiles?.full_name ?? null,
          partner_email: r.partners?.profiles?.email ?? null,
          quality_score: r.partners?.quality?.[0]?.score ?? null,
          refund_risk: (r.partners?.quality?.[0]?.refunds ?? 0) > 0 || (r.partners?.quality?.[0]?.chargebacks ?? 0) > 0,
        })));
      }
    } finally {
      setLoading(false);
    }
  }

  async function approvePayout(id: string) {
    setApproving(id);
    try {
      const { error } = await supabase
        .from("partner_payouts")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", id);
      if (!error) setRows(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    } finally {
      setApproving(null);
    }
  }

  async function holdPayout(id: string) {
    const reason = prompt("Reason for hold:");
    if (!reason) return;
    setApproving(id);
    try {
      const { error } = await supabase
        .from("partner_payouts")
        .update({ status: "held", notes: reason, updated_at: new Date().toISOString() } as any)
        .eq("id", id);
      if (!error) setRows(prev => prev.map(r => r.id === id ? { ...r, status: "held" } : r));
    } finally {
      setApproving(null);
    }
  }

  const pending = rows.filter(r => r.status === "pending" || r.status === "pending_approval");
  const totalPending = pending.reduce((s, r) => s + r.amount_cents, 0);
  const highRisk = pending.filter(r => (r.quality_score ?? 100) < 60 || r.refund_risk).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payout Approval</h1>
          <p className="text-gray-500 text-sm mt-0.5">Review and approve partner payouts before disbursement.</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">Pending Payouts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{pending.length}</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-700 font-medium">Total Pending Amount</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{formatCents(totalPending)}</p>
        </div>
        <div className={`bg-white rounded-xl p-4 ${highRisk > 0 ? "border border-red-200" : "border border-gray-200"}`}>
          <p className={`text-xs font-medium ${highRisk > 0 ? "text-red-700" : "text-gray-500"}`}>High-Risk Partners</p>
          <p className={`text-2xl font-bold mt-1 ${highRisk > 0 ? "text-red-600" : "text-gray-900"}`}>{highRisk}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["pending", "all"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "pending" ? "Pending Approval" : "All Payouts"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Partner</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Amount</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Quality</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Risk</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Period</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(r => {
                  const isPending = r.status === "pending" || r.status === "pending_approval";
                  const qs = r.quality_score ?? 100;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{r.partner_name ?? "Unknown"}</p>
                            {r.partner_email && <p className="text-xs text-gray-500">{r.partner_email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-gray-900">{formatCents(r.amount_cents)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold ${qs >= 80 ? "text-emerald-600" : qs >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                          {qs}/100
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.refund_risk ? (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Refund Risk
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          r.status === "approved" ? "bg-emerald-100 text-emerald-700"
                          : r.status === "paid" ? "bg-blue-100 text-blue-700"
                          : r.status === "held" ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {r.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {(r.period_start || r.period_end) ? (
                          <span className="text-xs text-gray-500">
                            {r.period_start ? new Date(r.period_start).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                            {" – "}
                            {r.period_end ? new Date(r.period_end).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isPending && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => approvePayout(r.id)}
                              disabled={approving === r.id}
                              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => holdPayout(r.id)}
                              disabled={approving === r.id}
                              className="flex items-center gap-1 px-3 py-1 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
                            >
                              <Clock className="w-3 h-3" /> Hold
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-sm text-gray-400">No payouts found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
