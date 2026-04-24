import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Users, Phone, BarChart2, DollarSign, RefreshCw, Search,
  ChevronDown, ChevronUp, UserPlus, X, Check, AlertTriangle,
  Clock, TrendingUp, Briefcase, Star
} from "lucide-react";

type SalesUser = {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  role: string;
  specialties: string[];
  salary_cents: number;
  commission_rate: number;
  active: boolean;
};

type EmployeeStats = {
  assigned_leads: number;
  calls_today: number;
  demos_booked: number;
  closed_won: number;
  revenue_cents: number;
  bonus_cents: number;
};

type EmployeeRow = SalesUser & { stats: EmployeeStats };

type CallLog = {
  id: string;
  call_result: string;
  notes: string | null;
  created_at: string;
  lead_name?: string;
};

type Lead = {
  id: string;
  business_name: string;
  contact_name: string;
  status: string;
  city: string | null;
  state: string | null;
};

const ROLE_BADGE: Record<string, string> = {
  sales_rep: "bg-blue-100 text-blue-700",
  sales_manager: "bg-emerald-100 text-emerald-700",
  support_rep: "bg-yellow-100 text-yellow-700",
  fulfillment_rep: "bg-orange-100 text-orange-700",
  admin: "bg-red-100 text-red-700",
};

function fmt$(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function KPICard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminSalesTeamPage() {
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedCalls, setExpandedCalls] = useState<CallLog[]>([]);
  const [expandedLeads, setExpandedLeads] = useState<Lead[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<string>("");
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => { loadTeam(); }, []);

  async function loadTeam() {
    setLoading(true);
    try {
      const { data: users } = await supabase
        .from("internal_sales_users")
        .select("*")
        .eq("active", true)
        .order("full_name");

      if (!users) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const enriched: EmployeeRow[] = await Promise.all(
        (users as SalesUser[]).map(async (u) => {
          const [assignments, calls, records] = await Promise.all([
            supabase.from("internal_lead_assignments").select("id").eq("assigned_to", u.id).eq("status", "active"),
            supabase.from("internal_call_logs").select("call_result, created_at").eq("sales_user_id", u.id).gte("created_at", today.toISOString()),
            supabase.from("internal_sales_records").select("sale_amount, bonus_amount, status").eq("sales_user_id", u.id),
          ]);

          const allCalls = calls.data ?? [];
          const allRecords = records.data ?? [];
          const closedRecords = allRecords.filter(r => r.status === "confirmed" || r.status === "paid");

          return {
            ...u,
            stats: {
              assigned_leads: assignments.data?.length ?? 0,
              calls_today: allCalls.length,
              demos_booked: allCalls.filter(c => c.call_result === "demo_booked").length,
              closed_won: closedRecords.length,
              revenue_cents: closedRecords.reduce((s, r) => s + (r.sale_amount ?? 0), 0),
              bonus_cents: closedRecords.reduce((s, r) => s + (r.bonus_amount ?? 0), 0),
            },
          };
        })
      );

      setEmployees(enriched);
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(userId: string) {
    setLoadingDetail(true);
    try {
      const [callsRes, assignmentsRes] = await Promise.all([
        supabase.from("internal_call_logs").select("id, call_result, notes, created_at").eq("sales_user_id", userId).order("created_at", { ascending: false }).limit(10),
        supabase.from("internal_lead_assignments").select("lead_id, partner_leads!inner(id, business_name, contact_name, status, city, state)").eq("assigned_to", userId).eq("status", "active").limit(20),
      ]);

      setExpandedCalls((callsRes.data ?? []) as CallLog[]);
      setExpandedLeads(((assignmentsRes.data ?? []) as any[]).map(a => a.partner_leads as Lead));
    } finally {
      setLoadingDetail(false);
    }
  }

  async function openAssignModal(userId: string) {
    setAssignTarget(userId);
    setSelectedLeadId("");
    const { data } = await supabase
      .from("partner_leads")
      .select("id, business_name, contact_name, status, city, state")
      .not("id", "in", `(SELECT lead_id FROM internal_lead_assignments WHERE status = 'active')`)
      .order("created_at", { ascending: false })
      .limit(50);
    setAvailableLeads((data ?? []) as Lead[]);
    setShowAssignModal(true);
  }

  async function assignLead() {
    if (!selectedLeadId || !assignTarget) return;
    setAssigning(true);
    try {
      await supabase.from("internal_lead_assignments").insert({
        lead_id: selectedLeadId,
        assigned_to: assignTarget,
        assignment_reason: "manual_admin",
        status: "active",
      });
      setShowAssignModal(false);
      await loadTeam();
      if (expandedId === assignTarget) await loadDetail(assignTarget);
    } finally {
      setAssigning(false);
    }
  }

  const totals = employees.reduce(
    (acc, e) => ({
      leads: acc.leads + e.stats.assigned_leads,
      calls: acc.calls + e.stats.calls_today,
      closed: acc.closed + e.stats.closed_won,
      revenue: acc.revenue + e.stats.revenue_cents,
    }),
    { leads: 0, calls: 0, closed: 0, revenue: 0 }
  );

  const filtered = employees.filter(e =>
    !search || e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  const CALL_RESULT_COLOR: Record<string, string> = {
    no_answer: "text-gray-500",
    left_voicemail: "text-gray-600",
    interested: "text-emerald-600",
    call_back: "text-blue-600",
    demo_booked: "text-blue-700 font-semibold",
    not_interested: "text-orange-600",
    closed_won: "text-emerald-700 font-semibold",
    closed_lost: "text-red-600",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Team Manager</h1>
          <p className="text-gray-500 text-sm mt-0.5">Employee performance, lead assignments, and call tracking.</p>
        </div>
        <button onClick={loadTeam} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Active Employees" value={employees.length} icon={Users} color="bg-blue-50 text-blue-600" />
        <KPICard label="Total Assigned Leads" value={totals.leads} icon={Briefcase} color="bg-amber-50 text-amber-600" />
        <KPICard label="Calls Today" value={totals.calls} icon={Phone} color="bg-emerald-50 text-emerald-600" />
        <KPICard label="Revenue Closed" value={fmt$(totals.revenue)} sub={`${totals.closed} deals`} icon={DollarSign} color="bg-teal-50 text-teal-600" />
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search employees…"
          className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading team data…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Employee</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Leads</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Calls Today</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Demos</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Closed</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Revenue</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Bonus</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(emp => (
                  <>
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-blue-700">{emp.full_name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{emp.full_name}</p>
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${ROLE_BADGE[emp.role] ?? "bg-gray-100 text-gray-600"}`}>
                                {emp.role.replace("_", " ")}
                              </span>
                              {emp.specialties?.length > 0 && (
                                <span className="text-xs text-gray-400">{emp.specialties.slice(0, 2).join(", ")}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-semibold text-gray-900">{emp.stats.assigned_leads}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-semibold ${emp.stats.calls_today > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                          {emp.stats.calls_today}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-semibold text-blue-600">{emp.stats.demos_booked}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-semibold text-emerald-700">{emp.stats.closed_won}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{fmt$(emp.stats.revenue_cents)}</td>
                      <td className="px-4 py-3 text-right text-sm text-emerald-700 font-medium">{fmt$(emp.stats.bonus_cents)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openAssignModal(emp.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50"
                          >
                            <UserPlus className="w-3 h-3" /> Assign
                          </button>
                          <button
                            onClick={async () => {
                              if (expandedId === emp.id) {
                                setExpandedId(null);
                              } else {
                                setExpandedId(emp.id);
                                await loadDetail(emp.id);
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                          >
                            {expandedId === emp.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedId === emp.id && (
                      <tr key={`${emp.id}-detail`}>
                        <td colSpan={8} className="bg-gray-50 border-t border-gray-100 px-4 py-4">
                          {loadingDetail ? (
                            <p className="text-sm text-gray-400 text-center py-4">Loading…</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Assigned Leads */}
                              <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  <Briefcase className="w-4 h-4 text-gray-400" /> Assigned Leads ({expandedLeads.length})
                                </h3>
                                {expandedLeads.length === 0 ? (
                                  <p className="text-xs text-gray-400 py-2">No active assignments.</p>
                                ) : (
                                  <div className="space-y-1.5">
                                    {expandedLeads.map(lead => (
                                      <div key={lead.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                                        <div>
                                          <p className="text-xs font-semibold text-gray-900">{lead.business_name}</p>
                                          <p className="text-xs text-gray-500">{lead.contact_name} · {lead.city}{lead.state ? `, ${lead.state}` : ""}</p>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{lead.status?.replace("_", " ")}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Recent Calls */}
                              <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-400" /> Recent Calls
                                </h3>
                                {expandedCalls.length === 0 ? (
                                  <p className="text-xs text-gray-400 py-2">No calls logged yet.</p>
                                ) : (
                                  <div className="space-y-1.5">
                                    {expandedCalls.map(call => (
                                      <div key={call.id} className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                                        <div className="flex items-center justify-between">
                                          <span className={`text-xs font-medium ${CALL_RESULT_COLOR[call.call_result] ?? "text-gray-600"}`}>
                                            {call.call_result.replace(/_/g, " ")}
                                          </span>
                                          <span className="text-xs text-gray-400">
                                            {new Date(call.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                          </span>
                                        </div>
                                        {call.notes && <p className="text-xs text-gray-500 mt-0.5 truncate">{call.notes}</p>}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-gray-400">
                      {employees.length === 0 ? "No active employees found." : "No employees match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Lead Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Assign Lead</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {availableLeads.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-400">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No unassigned leads available.
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">Select an unassigned lead to assign to this employee:</p>
                  <div className="max-h-72 overflow-y-auto space-y-2 border border-gray-200 rounded-xl p-2">
                    {availableLeads.map(lead => (
                      <button
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                          selectedLeadId === lead.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{lead.business_name}</p>
                            <p className="text-xs text-gray-500">{lead.contact_name} · {lead.city}{lead.state ? `, ${lead.state}` : ""}</p>
                          </div>
                          {selectedLeadId === lead.id && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={assignLead}
                      disabled={!selectedLeadId || assigning}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
                    >
                      {assigning ? "Assigning…" : "Assign Lead"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
