import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  TrendingDown, AlertTriangle, Shield, User, Search,
  ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";

type QualityRow = {
  partner_id: string;
  score: number;
  refunds: number;
  chargebacks: number;
  violations: number;
  low_quality_leads: number;
  partner_name: string | null;
  partner_email: string | null;
};

const RISK_LABEL = (score: number) => {
  if (score >= 80) return { label: "Good", color: "text-emerald-600 bg-emerald-50" };
  if (score >= 60) return { label: "Watch", color: "text-yellow-600 bg-yellow-50" };
  if (score >= 40) return { label: "At Risk", color: "text-orange-600 bg-orange-50" };
  return { label: "Critical", color: "text-red-700 bg-red-50" };
};

export default function AdminPartnerQualityPage() {
  const [rows, setRows] = useState<QualityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof QualityRow>("score");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("partner_quality_scores")
        .select(`
          partner_id, score, refunds, chargebacks, violations, low_quality_leads,
          partners!inner(profiles!inner(full_name, email))
        `)
        .order("score", { ascending: true })
        .limit(200);

      if (data) {
        setRows(data.map((r: any) => ({
          partner_id: r.partner_id,
          score: r.score,
          refunds: r.refunds,
          chargebacks: r.chargebacks,
          violations: r.violations,
          low_quality_leads: r.low_quality_leads,
          partner_name: r.partners?.profiles?.full_name ?? null,
          partner_email: r.partners?.profiles?.email ?? null,
        })));
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleSort(field: keyof QualityRow) {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  }

  const filtered = rows
    .filter(r =>
      !search || (r.partner_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.partner_email?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = a[sortField] ?? 0;
      const bv = b[sortField] ?? 0;
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const atRisk = rows.filter(r => r.score < 60).length;
  const critical = rows.filter(r => r.score < 40).length;
  const avgScore = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;

  const SortIcon = ({ field }: { field: keyof QualityRow }) =>
    sortField === field
      ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
      : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Quality Scores</h1>
          <p className="text-gray-500 text-sm mt-0.5">Monitor refunds, chargebacks, and violations per partner.</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">Platform Avg Score</p>
          <p className={`text-2xl font-bold mt-1 ${avgScore >= 80 ? "text-emerald-600" : avgScore >= 60 ? "text-yellow-600" : "text-red-600"}`}>{avgScore}/100</p>
        </div>
        <div className="bg-white border border-yellow-200 rounded-xl p-4">
          <p className="text-xs text-yellow-700 font-medium">At Risk (Score &lt; 60)</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{atRisk}</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-4">
          <p className="text-xs text-red-700 font-medium">Critical (Score &lt; 40)</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{critical}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search partners…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Partner</th>
                  {([["score", "Score"], ["refunds", "Refunds"], ["chargebacks", "Chargebacks"], ["violations", "Violations"]] as [keyof QualityRow, string][]).map(([f, l]) => (
                    <th
                      key={f}
                      onClick={() => toggleSort(f)}
                      className="text-right px-4 py-3 text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                    >
                      <span className="flex items-center justify-end gap-1">{l}<SortIcon field={f} /></span>
                    </th>
                  ))}
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => {
                  const risk = RISK_LABEL(r.score);
                  return (
                    <tr key={r.partner_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{r.partner_name ?? "Unknown"}</p>
                            {r.partner_email && <p className="text-xs text-gray-500">{r.partner_email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${r.score >= 80 ? "text-emerald-600" : r.score >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                          {r.score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">{r.refunds}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">{r.chargebacks}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">{r.violations}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${risk.color}`}>
                          {risk.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-10 text-center text-sm text-gray-400">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
