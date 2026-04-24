import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import {
  Phone, MessageSquare, Mail, Calendar, CheckCircle2, XCircle,
  Clock, ChevronRight, User, Tag, Building2, DollarSign,
  TrendingUp, PhoneCall, BarChart3, Plus, X, ChevronDown,
  FileText, AlertCircle, Zap
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SalesUser = {
  id: string;
  full_name: string;
  role: string;
  commission_rate: number;
};

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  business_name: string | null;
  product_interest: string | null;
  status: string;
  notes: string | null;
  next_follow_up_at: string | null;
  created_at: string;
};

type CallLog = {
  id: string;
  lead_id: string;
  call_result: string;
  notes: string | null;
  next_follow_up_at: string | null;
  created_at: string;
};

type SaleRecord = {
  id: string;
  product_code: string | null;
  product_name: string | null;
  sale_amount: number;
  bonus_amount: number;
  status: string;
  created_at: string;
};

type Task = {
  id: string;
  lead_id: string | null;
  title: string;
  task_type: string;
  due_at: string | null;
  completed: boolean;
  priority: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CALL_RESULTS = [
  { key: "no_answer", label: "No Answer", color: "text-gray-600" },
  { key: "left_voicemail", label: "Left Voicemail", color: "text-gray-600" },
  { key: "interested", label: "Interested", color: "text-emerald-600" },
  { key: "call_back", label: "Call Back", color: "text-blue-600" },
  { key: "demo_booked", label: "Demo Booked", color: "text-blue-700" },
  { key: "not_interested", label: "Not Interested", color: "text-orange-600" },
  { key: "closed_won", label: "Closed Won", color: "text-emerald-700" },
  { key: "closed_lost", label: "Closed Lost", color: "text-red-600" },
];

const PIPELINE_COLS = [
  { key: "new", label: "New", dot: "bg-gray-400" },
  { key: "contacted", label: "Contacted", dot: "bg-blue-400" },
  { key: "demo_booked", label: "Demo Booked", dot: "bg-yellow-500" },
  { key: "proposal_sent", label: "Proposal Sent", dot: "bg-orange-500" },
  { key: "closed_won", label: "Won", dot: "bg-emerald-500" },
  { key: "closed_lost", label: "Lost", dot: "bg-red-400" },
];

const SCRIPTS: Record<string, { title: string; body: string }> = {
  "Merchant Plan": {
    title: "Merchant Call Script",
    body: `Hi, is this [Name]? This is [Rep] with Local-Link Marketplace.\n\nI'm reaching out because we're helping local businesses get found in the community, post offers and events, receive leads, and manage everything inside a built-in CRM.\n\nAre you currently doing anything to consistently bring in local customers?\n\n[If interested]: Local-Link gives you a business profile, community visibility, special offers, booking tools, and CRM follow-up in one place. Would you like me to show you the plans and get your business page started?`,
  },
  "1Hub CRM": {
    title: "1Hub CRM Call Script",
    body: `Hi [Name], this is [Rep] with 1Hub CRM through Local-Link.\n\nWe help businesses organize leads, automate follow-up, manage tasks, track revenue, and keep everything ready for tax time.\n\nAre you currently using a CRM, or are leads still coming in through calls, texts, emails, and spreadsheets?\n\n[If pain point]: That's exactly what 1Hub fixes — one place for leads, follow-ups, appointments, deals, revenue tracking, and automation. Would it make sense to schedule a quick demo?`,
  },
  "1Hub CPA": {
    title: "CPA / Accounting Firm Call Script",
    body: `Hi [Name], this is [Rep] with 1Hub CPA.\n\nWe're helping CPA and accounting firms streamline client onboarding, document collection, messaging, checklists, billing, and year-end workflows.\n\nAre you still collecting client info through email, portals, spreadsheets, or manual follow-ups?\n\n[If yes]: That's where 1Hub CPA helps — structured client system so onboarding, document requests, communication, and client status are all organized in one place. Would you like to see the CPA workflow in a quick demo?`,
  },
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtMoney(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}
function isOverdue(d: string | null) {
  return d ? new Date(d) < new Date() : false;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SalesDashboard() {
  const { user } = useAuth();

  const [salesUser, setSalesUser] = useState<SalesUser | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Active lead workspace
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [callResult, setCallResult] = useState("");
  const [callNotes, setCallNotes] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [saving, setSaving] = useState(false);

  // Script panel
  const [showScript, setShowScript] = useState(false);

  // Task add
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", task_type: "call", due_at: "", priority: "normal" });

  // Sales add
  const [showAddSale, setShowAddSale] = useState(false);
  const [newSale, setNewSale] = useState({ product_name: "", product_code: "", sale_amount: "", bonus_amount: "" });

  useEffect(() => {
    if (user?.id) loadAll();
  }, [user?.id]);

  const loadAll = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: su } = await supabase
        .from("internal_sales_users")
        .select("id, full_name, role, commission_rate")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!su) { setLoading(false); return; }
      setSalesUser(su as SalesUser);

      const [assignRes, callRes, saleRes, taskRes] = await Promise.all([
        // leads assigned to this employee
        supabase
          .from("internal_lead_assignments")
          .select("lead_id, partner_leads!inner(*)")
          .eq("assigned_to", su.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(100),
        // their call logs
        supabase
          .from("internal_call_logs")
          .select("*")
          .eq("sales_user_id", su.id)
          .order("created_at", { ascending: false })
          .limit(200),
        // their sales
        supabase
          .from("internal_sales_records")
          .select("*")
          .eq("sales_user_id", su.id)
          .order("created_at", { ascending: false })
          .limit(50),
        // their tasks
        supabase
          .from("internal_tasks")
          .select("*")
          .eq("sales_user_id", su.id)
          .eq("completed", false)
          .order("due_at", { ascending: true })
          .limit(50),
      ]);

      if (assignRes.data) {
        const extracted = assignRes.data.map((r: any) => r.partner_leads).filter(Boolean);
        setLeads(extracted as Lead[]);
      }
      if (callRes.data) setCallLogs(callRes.data as CallLog[]);
      if (saleRes.data) setSales(saleRes.data as SaleRecord[]);
      if (taskRes.data) setTasks(taskRes.data as Task[]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  async function saveCall() {
    if (!activeLead || !salesUser || !callResult) return;
    setSaving(true);
    try {
      // 1. Log the call
      const { data: log } = await supabase.from("internal_call_logs").insert({
        lead_id: activeLead.id,
        sales_user_id: salesUser.id,
        call_result: callResult,
        notes: callNotes || null,
        next_follow_up_at: followUp || null,
      }).select().maybeSingle();
      if (log) setCallLogs(prev => [log as CallLog, ...prev]);

      // 2. Update lead status in partner_leads
      const statusMap: Record<string, string> = {
        interested: "contacted",
        call_back: "contacted",
        demo_booked: "demo_booked",
        closed_won: "closed_won",
        closed_lost: "closed_lost",
      };
      const newStatus = statusMap[callResult];
      if (newStatus) {
        const { data: updatedLead } = await supabase
          .from("partner_leads")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("id", activeLead.id)
          .select()
          .maybeSingle();
        if (updatedLead) {
          setLeads(prev => prev.map(l => l.id === activeLead.id ? updatedLead as Lead : l));
          setActiveLead(updatedLead as Lead);
        }
      }

      // 3. Auto-create follow-up task if follow-up date set
      if (followUp) {
        await supabase.from("internal_tasks").insert({
          sales_user_id: salesUser.id,
          lead_id: activeLead.id,
          title: `Follow up: ${activeLead.name}`,
          task_type: "follow_up",
          due_at: followUp,
          priority: "normal",
        });
      }

      setCallResult("");
      setCallNotes("");
      setFollowUp("");
    } finally {
      setSaving(false);
    }
  }

  async function completeTask(taskId: string) {
    const { error } = await supabase
      .from("internal_tasks")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", taskId);
    if (!error) setTasks(prev => prev.filter(t => t.id !== taskId));
  }

  async function addTask() {
    if (!salesUser || !newTask.title.trim()) return;
    setSaving(true);
    try {
      const { data } = await supabase.from("internal_tasks").insert({
        sales_user_id: salesUser.id,
        title: newTask.title,
        task_type: newTask.task_type,
        due_at: newTask.due_at || null,
        priority: newTask.priority,
      }).select().maybeSingle();
      if (data) setTasks(prev => [...prev, data as Task]);
      setShowAddTask(false);
      setNewTask({ title: "", task_type: "call", due_at: "", priority: "normal" });
    } finally {
      setSaving(false);
    }
  }

  async function addSale() {
    if (!salesUser || !newSale.product_name || !newSale.sale_amount) return;
    setSaving(true);
    try {
      const payload = {
        sales_user_id: salesUser.id,
        lead_id: activeLead?.id ?? null,
        product_code: newSale.product_code || null,
        product_name: newSale.product_name,
        sale_amount: parseFloat(newSale.sale_amount),
        bonus_amount: newSale.bonus_amount ? parseFloat(newSale.bonus_amount) : parseFloat(newSale.sale_amount) * (salesUser.commission_rate ?? 0.05),
        status: "pending",
      };
      const { data } = await supabase.from("internal_sales_records").insert(payload).select().maybeSingle();
      if (data) setSales(prev => [data as SaleRecord, ...prev]);
      setShowAddSale(false);
      setNewSale({ product_name: "", product_code: "", sale_amount: "", bonus_amount: "" });
    } finally {
      setSaving(false);
    }
  }

  // ── Derived stats ─────────────────────────────────────────────────────────
  const today = new Date().toDateString();
  const callsToday = callLogs.filter(c => new Date(c.created_at).toDateString() === today).length;
  const dealsClosedTotal = sales.filter(s => s.status !== "reversed" && s.status !== "cancelled").length;
  const revenueTotal = sales.filter(s => s.status !== "reversed").reduce((s, r) => s + Number(r.sale_amount), 0);
  const bonusTotal = sales.filter(s => s.status !== "reversed").reduce((s, r) => s + Number(r.bonus_amount), 0);
  const overdueTasks = tasks.filter(t => isOverdue(t.due_at));
  const script = activeLead?.product_interest ? SCRIPTS[activeLead.product_interest] ?? null : null;

  const byStatus = (key: string) => leads.filter(l => l.status === key);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading your dashboard…</div>;
  }

  if (!salesUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-orange-400" />
        <h2 className="text-xl font-bold text-gray-900">Access Not Set Up</h2>
        <p className="text-gray-500 max-w-sm">Your account has not been added to the internal sales team yet. Contact your manager.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div>
          <span className="font-bold text-gray-900 text-lg">Local-Link Sales</span>
          <span className="ml-3 text-sm text-gray-500">Welcome back, {salesUser.full_name}</span>
        </div>
        <div className="flex items-center gap-3">
          {overdueTasks.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
              <AlertCircle className="w-3 h-3" /> {overdueTasks.length} overdue
            </span>
          )}
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium capitalize">
            {salesUser.role.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── KPI Row ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Calls Today", value: callsToday.toString(), icon: PhoneCall, color: "text-blue-600" },
            { label: "Assigned Leads", value: leads.length.toString(), icon: User, color: "text-gray-700" },
            { label: "Deals Closed", value: dealsClosedTotal.toString(), icon: CheckCircle2, color: "text-emerald-600" },
            { label: "Revenue Closed", value: fmtMoney(revenueTotal), icon: DollarSign, color: "text-gray-900" },
            { label: "My Bonus/Comm.", value: fmtMoney(bonusTotal), icon: TrendingUp, color: "text-emerald-700" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${color}`} />
                <p className="text-xs text-gray-500">{label}</p>
              </div>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Pipeline + Tasks ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Lead Pipeline — takes 2/3 */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">My Lead Pipeline</h2>
              <span className="text-xs text-gray-400">{leads.length} assigned</span>
            </div>
            <div className="overflow-x-auto p-3">
              <div className="flex gap-3 min-w-max">
                {PIPELINE_COLS.map(col => {
                  const colLeads = byStatus(col.key);
                  return (
                    <div key={col.key} className="w-44 flex-shrink-0">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                        <span className="text-xs font-semibold text-gray-700">{col.label}</span>
                        <span className="ml-auto text-xs text-gray-400">{colLeads.length}</span>
                      </div>
                      <div className="space-y-1.5">
                        {colLeads.map(lead => (
                          <button
                            key={lead.id}
                            onClick={() => { setActiveLead(lead); setShowScript(false); setCallResult(""); setCallNotes(""); setFollowUp(""); }}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                              activeLead?.id === lead.id
                                ? "border-blue-400 bg-blue-50 shadow-sm"
                                : "border-gray-200 bg-white hover:border-blue-300"
                            }`}
                          >
                            <p className="font-semibold text-gray-900 truncate">{lead.name}</p>
                            {lead.business_name && <p className="text-gray-500 truncate">{lead.business_name}</p>}
                            {lead.product_interest && <p className="text-blue-600 truncate">{lead.product_interest}</p>}
                            {lead.next_follow_up_at && (
                              <p className={`mt-1 flex items-center gap-0.5 ${isOverdue(lead.next_follow_up_at) ? "text-red-600" : "text-gray-400"}`}>
                                <Clock className="w-3 h-3" />{fmt(lead.next_follow_up_at)}
                              </p>
                            )}
                          </button>
                        ))}
                        {colLeads.length === 0 && (
                          <p className="text-center text-gray-300 text-xs py-4 italic">Empty</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tasks — 1/3 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Today's Tasks</h2>
              <button onClick={() => setShowAddTask(true)} className="text-blue-600 hover:text-blue-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showAddTask && (
              <div className="p-3 border-b border-gray-100 space-y-2">
                <input
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))}
                  placeholder="Task title…"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newTask.task_type}
                    onChange={e => setNewTask(t => ({ ...t, task_type: e.target.value }))}
                    className="border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none"
                  >
                    {["call","text","email","demo","follow_up","admin","other"].map(v => (
                      <option key={v} value={v}>{v.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask(t => ({ ...t, priority: e.target.value }))}
                    className="border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none"
                  >
                    {["low","normal","high","urgent"].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <input
                  type="datetime-local"
                  value={newTask.due_at}
                  onChange={e => setNewTask(t => ({ ...t, due_at: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowAddTask(false)} className="flex-1 py-1 border border-gray-200 rounded text-xs text-gray-600">Cancel</button>
                  <button onClick={addTask} disabled={saving || !newTask.title.trim()} className="flex-1 py-1 bg-blue-600 text-white rounded text-xs disabled:opacity-40">Add</button>
                </div>
              </div>
            )}

            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {tasks.length === 0 && <p className="text-center text-xs text-gray-400 py-6 italic">No open tasks.</p>}
              {tasks.map(task => (
                <div key={task.id} className="flex items-start gap-2 px-4 py-2.5">
                  <button onClick={() => completeTask(task.id)} className="mt-0.5 flex-shrink-0">
                    <CheckCircle2 className={`w-4 h-4 ${task.completed ? "text-emerald-500" : "text-gray-300 hover:text-emerald-400"}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{task.title}</p>
                    {task.due_at && (
                      <p className={`text-xs ${isOverdue(task.due_at) ? "text-red-600 font-medium" : "text-gray-400"}`}>
                        {fmt(task.due_at)}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    task.priority === "urgent" ? "bg-red-100 text-red-700"
                    : task.priority === "high" ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-500"
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Active Lead Workspace ─────────────────────────────────────────── */}
        {activeLead && (
          <div className="bg-white rounded-xl border-2 border-blue-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-blue-100 bg-blue-50">
              <div>
                <h2 className="font-bold text-gray-900">{activeLead.name}</h2>
                {activeLead.business_name && <p className="text-sm text-gray-500">{activeLead.business_name}</p>}
              </div>
              <div className="flex items-center gap-2">
                {script && (
                  <button
                    onClick={() => setShowScript(!showScript)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-medium text-blue-700 hover:bg-blue-50"
                  >
                    <FileText className="w-3.5 h-3.5" /> Script
                  </button>
                )}
                <button
                  onClick={() => setShowAddSale(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Sale
                </button>
                <button onClick={() => setActiveLead(null)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Lead info + script */}
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {activeLead.phone && (
                    <a href={`tel:${activeLead.phone}`} className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
                      <Phone className="w-4 h-4 text-gray-400" /> {activeLead.phone}
                    </a>
                  )}
                  {activeLead.email && (
                    <a href={`mailto:${activeLead.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Mail className="w-4 h-4 text-gray-400" /> {activeLead.email}
                    </a>
                  )}
                  {activeLead.product_interest && (
                    <span className="flex items-center gap-2 text-gray-700">
                      <Tag className="w-4 h-4 text-gray-400" /> {activeLead.product_interest}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  {activeLead.phone && (
                    <>
                      <a href={`tel:${activeLead.phone}`} className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a href={`sms:${activeLead.phone}`} className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                        <MessageSquare className="w-3.5 h-3.5" /> Text
                      </a>
                    </>
                  )}
                  {activeLead.email && (
                    <a href={`mailto:${activeLead.email}`} className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                  )}
                </div>

                {/* Notes */}
                {activeLead.notes && (
                  <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 border border-gray-100">
                    {activeLead.notes}
                  </div>
                )}

                {/* Script */}
                {showScript && script && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-bold text-blue-900 mb-2">{script.title}</p>
                    <pre className="text-xs text-blue-800 whitespace-pre-wrap font-sans leading-relaxed">{script.body}</pre>
                  </div>
                )}
              </div>

              {/* Call notes panel */}
              <div className="p-5 space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm">Log Call</h3>

                {/* Call result */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Call Result</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CALL_RESULTS.map(r => (
                      <button
                        key={r.key}
                        onClick={() => setCallResult(r.key)}
                        className={`py-1.5 px-2 text-xs rounded-lg border transition-all font-medium ${
                          callResult === r.key
                            ? "border-blue-500 bg-blue-600 text-white"
                            : `border-gray-200 ${r.color} hover:border-gray-300 bg-white`
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                  <textarea
                    value={callNotes}
                    onChange={e => setCallNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="What did they say? Any objections? Pain points?"
                  />
                </div>

                {/* Follow-up */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Next Follow-Up</label>
                  <input
                    type="datetime-local"
                    value={followUp}
                    onChange={e => setFollowUp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={saveCall}
                  disabled={!callResult || saving}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {saving ? "Saving…" : "Save Call"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Sale Modal */}
        {showAddSale && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Log a Sale</h3>
                <button onClick={() => setShowAddSale(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
                  <input type="text" value={newSale.product_name} onChange={e => setNewSale(s => ({ ...s, product_name: e.target.value }))}
                    placeholder="Merchant Starter Plan"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sale Amount ($) *</label>
                  <input type="number" value={newSale.sale_amount} onChange={e => setNewSale(s => ({ ...s, sale_amount: e.target.value }))}
                    placeholder="197.00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Bonus / Commission ($) <span className="text-gray-400">— auto if blank</span>
                  </label>
                  <input type="number" value={newSale.bonus_amount} onChange={e => setNewSale(s => ({ ...s, bonus_amount: e.target.value }))}
                    placeholder="Auto"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 flex gap-3">
                <button onClick={() => setShowAddSale(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700">Cancel</button>
                <button onClick={addSale} disabled={!newSale.product_name || !newSale.sale_amount || saving}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-40">
                  {saving ? "Saving…" : "Log Sale"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── My Sales ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">My Sales</h2>
            <button
              onClick={() => setShowAddSale(true)}
              className="flex items-center gap-1 text-xs text-emerald-600 font-medium hover:text-emerald-700"
            >
              <Plus className="w-3.5 h-3.5" /> Log Sale
            </button>
          </div>
          {sales.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">No sales recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Date</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600">Product</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-600">Revenue</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-600">Bonus</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-xs text-gray-500">{fmt(s.created_at)}</td>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{s.product_name ?? s.product_code ?? "—"}</td>
                      <td className="px-4 py-2.5 text-right text-sm font-medium text-gray-900">{fmtMoney(Number(s.sale_amount))}</td>
                      <td className="px-4 py-2.5 text-right text-sm text-emerald-700 font-medium">{fmtMoney(Number(s.bonus_amount))}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          s.status === "confirmed" || s.status === "paid" ? "bg-emerald-100 text-emerald-700"
                          : s.status === "reversed" ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
