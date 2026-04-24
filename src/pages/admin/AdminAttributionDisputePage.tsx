import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  GitBranch, CheckCircle2, XCircle, Clock, RefreshCw,
  Search, ChevronDown, AlertTriangle
} from "lucide-react";

type Dispute = {
  id: string;
  transaction_id: string;
  original_partner_id: string | null;
  requested_partner_id: string | null;
  reason: string | null;
  status: string;
  resolved_by: string | null;
  resolution_notes: string | null;
  created_at: string;
  original_partner_name: string | null;
  requested_partner_name: string | null;
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-emerald-100 text-emerald-700",
  denied: "bg-red-100 text-red-700",
  escalated: "bg-orange-100 text-orange-700",
};

export default function AdminAttributionDisputePage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");

  useEffect(() => { loadDisputes(); }, [filter]);

  async function loadDisputes() {
    setLoading(true);
    try {
      let q = supabase
        .from("attribution_disputes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      if (data) {
        const enriched = await Promise.all((data as any[]).map(async (d) => {
          const [orig, req] = await Promise.all([
            d.original_partner_id
              ? supabase.from("partners").select("profiles!inner(full_name)").eq("id", d.original_partner_id).maybeSingle()
              : Promise.resolve({ data: null }),
            d.requested_partner_id
              ? supabase.from("partners").select("profiles!inner(full_name)").eq("id", d.requested_partner_id).maybeSingle()
              : Promise.resolve({ data: null }),
          ]);
          return {
            ...d,
            original_partner_name: (orig.data as any)?.profiles?.full_name ?? d.original_partner_id ?? "Unknown",
            requested_partner_name: (req.data as any)?.profiles?.full_name ?? d.requested_partner_id ?? "Unknown",
          };
        }));
        setDisputes(enriched as Dispute[]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function resolve(dispute: Dispute, approve: boolean) {
    if (!resolution.trim() && !approve) {
      alert("Please enter a resolution note.");
      return;
    }
    setResolvingId(dispute.id);
    try {
      const { data, error } = await supabase
        .from("attribution_disputes")
        .update({
          status: approve ? "approved" : "denied",
          resolution_notes: resolution || (approve ? "Approved by admin" : "Denied by admin"),
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", dispute.id)
        .select()
        .maybeSingle();
      if (!error) {
        setDisputes(prev => prev.filter(d => d.id !== dispute.id));
        setExpandedId(null);
        setResolution("");
      }
    } finally {
      setResolvingId(null);
    }
  }

  const filtered = disputes.filter(d =>
    !search || d.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
    d.original_partner_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.requested_partner_name?.toLowerCase().includes(search.toLowerCase())
  );

  const pending = disputes.filter(d => d.status === "pending").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attribution Disputes</h1>
          <p className="text-gray-500 text-sm mt-0.5">Review and resolve commission attribution disputes.</p>
        </div>
        <button onClick={loadDisputes} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {pending > 0 && (
        <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800 font-medium">
            {pending} dispute{pending !== 1 ? "s" : ""} pending review
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["pending", "approved", "denied", "all"].map(f => (
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
        <div className="ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>
      </div>

      {/* Disputes */}
      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => (
            <div key={d.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div
                className="flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      TXN: {d.transaction_id?.slice(0, 16)}…
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[d.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                    <span>From: <strong className="text-gray-700">{d.original_partner_name}</strong></span>
                    <span className="text-gray-300">→</span>
                    <span>To: <strong className="text-gray-700">{d.requested_partner_name}</strong></span>
                  </div>
                  {d.reason && (
                    <p className="text-xs text-gray-600 mt-1 truncate">{d.reason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === d.id ? "rotate-180" : ""}`} />
                </div>
              </div>

              {expandedId === d.id && (
                <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Transaction ID</p>
                      <p className="font-mono text-xs text-gray-900 bg-white border border-gray-200 rounded px-2 py-1 break-all">{d.transaction_id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Submitted</p>
                      <p className="text-gray-700">{new Date(d.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Original Partner</p>
                      <p className="text-gray-900">{d.original_partner_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Requested Partner</p>
                      <p className="text-gray-900">{d.requested_partner_name}</p>
                    </div>
                  </div>
                  {d.reason && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Reason</p>
                      <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded p-2">{d.reason}</p>
                    </div>
                  )}

                  {d.status === "pending" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Resolution Notes</label>
                        <textarea
                          value={resolution}
                          onChange={e => setResolution(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={2}
                          placeholder="Add resolution notes…"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => resolve(d, true)}
                          disabled={resolvingId === d.id}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve — Reassign Attribution
                        </button>
                        <button
                          onClick={() => resolve(d, false)}
                          disabled={resolvingId === d.id}
                          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" /> Deny
                        </button>
                      </div>
                    </>
                  )}

                  {d.resolution_notes && d.status !== "pending" && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Resolution</p>
                      <p className="text-sm text-gray-700">{d.resolution_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <Clock className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No disputes found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
