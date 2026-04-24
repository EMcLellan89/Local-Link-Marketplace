import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  CheckCircle2, Circle, Clock, Phone, Mail, MessageSquare,
  CalendarCheck, AlertTriangle, RefreshCw, Plus, X, ChevronRight
} from "lucide-react";

type Task = {
  id: string;
  sales_user_id: string;
  lead_id: string | null;
  title: string;
  task_type: string;
  due_at: string | null;
  completed: boolean;
  priority: string;
  lead?: { business_name: string; contact_name: string; phone: string | null } | null;
};

type SalesUser = {
  id: string;
  full_name: string;
  role: string;
};

const TASK_ICON: Record<string, React.ElementType> = {
  call: Phone,
  text: MessageSquare,
  email: Mail,
  demo: CalendarCheck,
  follow_up: Clock,
  admin: Circle,
  other: Circle,
};

const PRIORITY_CONFIG: Record<string, { label: string; class: string; dot: string }> = {
  urgent: { label: "Urgent",  class: "bg-red-100 text-red-700",    dot: "bg-red-500" },
  high:   { label: "High",    class: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  normal: { label: "Normal",  class: "bg-blue-100 text-blue-700",   dot: "bg-blue-400" },
  low:    { label: "Low",     class: "bg-gray-100 text-gray-600",   dot: "bg-gray-400" },
};

function isOverdue(due: string | null) {
  if (!due) return false;
  return new Date(due) < new Date();
}

function isToday(due: string | null) {
  if (!due) return false;
  const d = new Date(due);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function WorkQueuePage() {
  const [salesUser, setSalesUser] = useState<SalesUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ title: "", task_type: "call", priority: "normal", due_at: "" });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overdue" | "today" | "upcoming" | "all">("today");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: su } = await supabase
        .from("internal_sales_users")
        .select("id, full_name, role")
        .eq("auth_user_id", user.id)
        .eq("active", true)
        .maybeSingle();

      if (!su) { setLoading(false); return; }
      setSalesUser(su as SalesUser);

      const { data: taskData } = await supabase
        .from("internal_tasks")
        .select("*, partner_leads(business_name, contact_name, phone)")
        .eq("sales_user_id", su.id)
        .eq("completed", false)
        .order("due_at", { ascending: true })
        .order("priority", { ascending: false })
        .limit(100);

      setTasks(((taskData ?? []) as any[]).map(t => ({
        ...t,
        lead: t.partner_leads ?? null,
      })));
    } finally {
      setLoading(false);
    }
  }

  async function completeTask(id: string) {
    setCompleting(id);
    try {
      await supabase.from("internal_tasks").update({ completed: true, updated_at: new Date().toISOString() }).eq("id", id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } finally {
      setCompleting(null);
    }
  }

  async function addTask() {
    if (!addForm.title || !salesUser) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("internal_tasks")
        .insert({
          sales_user_id: salesUser.id,
          title: addForm.title,
          task_type: addForm.task_type,
          priority: addForm.priority,
          due_at: addForm.due_at || null,
          completed: false,
        })
        .select("*, partner_leads(business_name, contact_name, phone)")
        .maybeSingle();
      if (!error && data) {
        setTasks(prev => [{ ...(data as any), lead: (data as any).partner_leads ?? null }, ...prev]);
        setShowAdd(false);
        setAddForm({ title: "", task_type: "call", priority: "normal", due_at: "" });
      }
    } finally {
      setSaving(false);
    }
  }

  const overdue = tasks.filter(t => isOverdue(t.due_at));
  const todayTasks = tasks.filter(t => isToday(t.due_at) && !isOverdue(t.due_at));
  const upcoming = tasks.filter(t => t.due_at && !isOverdue(t.due_at) && !isToday(t.due_at));
  const noDue = tasks.filter(t => !t.due_at);

  const displayTasks = activeTab === "overdue" ? overdue
    : activeTab === "today" ? [...overdue, ...todayTasks]
    : activeTab === "upcoming" ? upcoming
    : tasks;

  if (!salesUser && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm px-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Not Set Up</h2>
          <p className="text-gray-600 text-sm">Your account has not been configured as an internal team member. Contact your manager.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Work Queue</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {salesUser?.full_name ? `${salesUser.full_name} · ` : ""}
            {overdue.length > 0 && <span className="text-red-600 font-medium">{overdue.length} overdue · </span>}
            {todayTasks.length} due today · {upcoming.length} upcoming
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdue.length > 0 && (
        <div className="border border-red-200 bg-red-50 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">{overdue.length} overdue task{overdue.length !== 1 ? "s" : ""}</p>
            <p className="text-xs text-red-700">These were due in the past and still need to be completed.</p>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      {showAdd && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm">New Task</h3>
          <input
            type="text"
            value={addForm.title}
            onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
            placeholder="What needs to be done?"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={addForm.task_type}
              onChange={e => setAddForm(f => ({ ...f, task_type: e.target.value }))}
              className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {["call", "text", "email", "demo", "follow_up", "admin", "other"].map(t => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </select>
            <select
              value={addForm.priority}
              onChange={e => setAddForm(f => ({ ...f, priority: e.target.value }))}
              className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {["low", "normal", "high", "urgent"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input
              type="datetime-local"
              value={addForm.due_at}
              onChange={e => setAddForm(f => ({ ...f, due_at: e.target.value }))}
              className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setShowAdd(false); setAddForm({ title: "", task_type: "call", priority: "normal", due_at: "" }); }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={addTask} disabled={!addForm.title || saving} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40">
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {([
          ["today", `Today${overdue.length ? ` (${overdue.length + todayTasks.length})` : ` (${todayTasks.length})`}`],
          ["overdue", `Overdue (${overdue.length})`],
          ["upcoming", `Upcoming (${upcoming.length})`],
          ["all", `All (${tasks.length})`],
        ] as [typeof activeTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${activeTab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading your tasks…</div>
      ) : (
        <div className="space-y-2">
          {displayTasks.length === 0 && (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {activeTab === "today" ? "No tasks due today — great work!" : "No tasks in this view."}
              </p>
            </div>
          )}

          {displayTasks.map(task => {
            const TaskIcon = TASK_ICON[task.task_type] ?? Circle;
            const pCfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.normal;
            const overduTask = isOverdue(task.due_at);
            const todayTask = isToday(task.due_at);

            return (
              <div
                key={task.id}
                className={`bg-white border rounded-xl p-4 flex items-start gap-3 group transition-shadow hover:shadow-sm ${
                  overduTask ? "border-red-200" : todayTask ? "border-blue-200" : "border-gray-200"
                }`}
              >
                {/* Complete button */}
                <button
                  onClick={() => completeTask(task.id)}
                  disabled={completing === task.id}
                  className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex items-center justify-center group-hover:border-emerald-400"
                >
                  {completing === task.id ? (
                    <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-transparent group-hover:text-emerald-500 transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                      {task.lead && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          {task.lead.business_name}
                          {task.lead.phone && (
                            <a href={`tel:${task.lead.phone}`} className="ml-1 text-blue-600 hover:underline">{task.lead.phone}</a>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${pCfg.class}`}>{pCfg.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1 capitalize">
                      <TaskIcon className="w-3 h-3" />
                      {task.task_type.replace("_", " ")}
                    </span>
                    {task.due_at && (
                      <span className={`flex items-center gap-1 ${overduTask ? "text-red-600 font-medium" : todayTask ? "text-blue-600 font-medium" : ""}`}>
                        <Clock className="w-3 h-3" />
                        {overduTask ? "Overdue: " : todayTask ? "Today: " : ""}
                        {new Date(task.due_at).toLocaleString("en-US", {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    )}
                    {!task.due_at && <span className="text-gray-300">No due date</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {/* No-due-date tasks shown at bottom of "all" view */}
          {activeTab === "all" && noDue.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-400 mb-2 px-1">No due date</p>
              <div className="space-y-2">
                {noDue.map(task => {
                  const TaskIcon = TASK_ICON[task.task_type] ?? Circle;
                  const pCfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.normal;
                  return (
                    <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3 group hover:shadow-sm">
                      <button
                        onClick={() => completeTask(task.id)}
                        disabled={completing === task.id}
                        className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 border-gray-200 hover:border-emerald-500 flex items-center justify-center"
                      >
                        {completing === task.id && <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-gray-700">{task.title}</p>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${pCfg.class}`}>{pCfg.label}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 capitalize">
                          <TaskIcon className="w-3 h-3" />
                          {task.task_type.replace("_", " ")}
                          {task.lead && ` · ${task.lead.business_name}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
