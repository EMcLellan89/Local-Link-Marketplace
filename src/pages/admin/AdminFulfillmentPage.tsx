import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Layers, RefreshCw, Search, Plus, X, ChevronDown, ChevronUp,
  Clock, CheckCircle2, AlertCircle, Circle, ArrowRight, User,
  Filter, ExternalLink
} from "lucide-react";

type FulfillmentJob = {
  id: string;
  assigned_to: string | null;
  job_type: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_at: string | null;
  deliverable_url: string | null;
  notes: string | null;
  created_at: string;
  assigned_user?: string;
};

type Employee = {
  id: string;
  full_name: string;
  role: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  queued:      { label: "Queued",      color: "bg-gray-100 text-gray-700",    icon: Circle },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700",    icon: ArrowRight },
  review:      { label: "In Review",   color: "bg-yellow-100 text-yellow-700", icon: Clock },
  completed:   { label: "Completed",   color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  cancelled:   { label: "Cancelled",   color: "bg-red-100 text-red-700",      icon: X },
};

const PRIORITY_CONFIG: Record<string, { color: string; dot: string }> = {
  low:    { color: "text-gray-500", dot: "bg-gray-400" },
  normal: { color: "text-blue-600", dot: "bg-blue-500" },
  high:   { color: "text-orange-600", dot: "bg-orange-500" },
  urgent: { color: "text-red-600", dot: "bg-red-500" },
};

const JOB_TYPES = [
  "crm_setup", "ai_setup", "canva_design", "ad_creative",
  "website_build", "seo_setup", "copywriting", "onboarding", "other"
];

const EMPTY_JOB = {
  title: "",
  job_type: "crm_setup",
  description: "",
  priority: "normal",
  due_at: "",
  assigned_to: "",
};

function statusColumns() {
  return ["queued", "in_progress", "review", "completed"];
}

export default function AdminFulfillmentPage() {
  const [jobs, setJobs] = useState<FulfillmentJob[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ ...EMPTY_JOB });
  const [saving, setSaving] = useState(false);
  const [editDeliverable, setEditDeliverable] = useState<{ id: string; url: string } | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [jobsRes, empsRes] = await Promise.all([
        supabase.from("internal_fulfillment_jobs").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("internal_sales_users").select("id, full_name, role").in("role", ["fulfillment_rep", "sales_rep", "admin"]).eq("active", true),
      ]);

      const jobData = (jobsRes.data ?? []) as FulfillmentJob[];
      const empData = (empsRes.data ?? []) as Employee[];
      setEmployees(empData);

      const empMap = Object.fromEntries(empData.map(e => [e.id, e.full_name]));
      const enriched = jobData.map(j => ({ ...j, assigned_user: j.assigned_to ? empMap[j.assigned_to] ?? "Unknown" : "Unassigned" }));
      setJobs(enriched);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("internal_fulfillment_jobs")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (!error && data) {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, ...data as FulfillmentJob } : j));
    }
  }

  async function updateAssignee(id: string, assigned_to: string) {
    const { data, error } = await supabase
      .from("internal_fulfillment_jobs")
      .update({ assigned_to: assigned_to || null })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (!error && data) {
      const empMap = Object.fromEntries(employees.map(e => [e.id, e.full_name]));
      setJobs(prev => prev.map(j => j.id === id ? { ...j, ...(data as FulfillmentJob), assigned_user: assigned_to ? empMap[assigned_to] ?? "Unknown" : "Unassigned" } : j));
    }
  }

  async function saveDeliverable(id: string, url: string) {
    await supabase.from("internal_fulfillment_jobs").update({ deliverable_url: url }).eq("id", id);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, deliverable_url: url } : j));
    setEditDeliverable(null);
  }

  async function addJob() {
    if (!addForm.title) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("internal_fulfillment_jobs")
        .insert({
          title: addForm.title,
          job_type: addForm.job_type,
          description: addForm.description || null,
          priority: addForm.priority,
          due_at: addForm.due_at || null,
          assigned_to: addForm.assigned_to || null,
          status: "queued",
        })
        .select()
        .maybeSingle();
      if (!error && data) {
        const empMap = Object.fromEntries(employees.map(e => [e.id, e.full_name]));
        const enriched = { ...data as FulfillmentJob, assigned_user: addForm.assigned_to ? empMap[addForm.assigned_to] ?? "Unknown" : "Unassigned" };
        setJobs(prev => [enriched, ...prev]);
        setShowAdd(false);
        setAddForm({ ...EMPTY_JOB });
      }
    } finally {
      setSaving(false);
    }
  }

  const filtered = jobs.filter(j => {
    const matchesSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.job_type.toLowerCase().includes(search.toLowerCase()) ||
      j.assigned_user?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = statusColumns().reduce((acc, s) => {
    acc[s] = jobs.filter(j => j.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fulfillment Queue</h1>
          <p className="text-gray-500 text-sm mt-0.5">DFY service jobs, assignments, and delivery tracking.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> New Job
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-3">
        {statusColumns().map(s => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className={`bg-white border rounded-xl p-4 text-left transition-all ${statusFilter === s ? "border-blue-500 ring-1 ring-blue-200" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-600">{cfg.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counts[s] ?? 0}</p>
            </button>
          );
        })}
      </div>

      {/* Add Job Form */}
      {showAdd && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-900">New Fulfillment Job</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Job Title *</label>
              <input
                type="text"
                value={addForm.title}
                onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Set up LocalLink CRM for ABC Plumbing"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Job Type</label>
              <select
                value={addForm.job_type}
                onChange={e => setAddForm(f => ({ ...f, job_type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select
                value={addForm.priority}
                onChange={e => setAddForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {["low", "normal", "high", "urgent"].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Assign To</label>
              <select
                value={addForm.assigned_to}
                onChange={e => setAddForm(f => ({ ...f, assigned_to: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Unassigned</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
              <input
                type="date"
                value={addForm.due_at}
                onChange={e => setAddForm(f => ({ ...f, due_at: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={addForm.description}
                onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe what needs to be done…"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => { setShowAdd(false); setAddForm({ ...EMPTY_JOB }); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={addJob} disabled={!addForm.title || saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40">
              {saving ? "Creating…" : "Create Job"}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", ...statusColumns(), "cancelled"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="py-16 text-center text-gray-400 text-sm">Loading jobs…</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(job => {
            const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.queued;
            const priorityCfg = PRIORITY_CONFIG[job.priority] ?? PRIORITY_CONFIG.normal;
            const StatusIcon = statusCfg.icon;
            const isOverdue = job.due_at && new Date(job.due_at) < new Date() && job.status !== "completed" && job.status !== "cancelled";

            return (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${priorityCfg.dot}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusCfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 flex-wrap">
                      <span className="capitalize">{job.job_type.replace(/_/g, " ")}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{job.assigned_user}</span>
                      {job.due_at && (
                        <>
                          <span>·</span>
                          <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                            <Clock className="w-3 h-3" />
                            {new Date(job.due_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {job.deliverable_url && (
                      <a
                        href={job.deliverable_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {expandedId === job.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {expandedId === job.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                    {job.description && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                        <p className="text-sm text-gray-700">{job.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Status */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Update Status</label>
                        <select
                          value={job.status}
                          onChange={e => updateStatus(job.id, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <option key={key} value={key}>{cfg.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Assignee */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Reassign To</label>
                        <select
                          value={job.assigned_to ?? ""}
                          onChange={e => updateAssignee(job.id, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Unassigned</option>
                          {employees.map(e => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                        </select>
                      </div>

                      {/* Deliverable */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Deliverable URL</label>
                        {editDeliverable?.id === job.id ? (
                          <div className="flex gap-1">
                            <input
                              type="url"
                              value={editDeliverable.url}
                              onChange={e => setEditDeliverable({ id: job.id, url: e.target.value })}
                              className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="https://…"
                            />
                            <button
                              onClick={() => saveDeliverable(job.id, editDeliverable.url)}
                              className="px-2 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditDeliverable({ id: job.id, url: job.deliverable_url ?? "" })}
                            className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-600 text-left"
                          >
                            {job.deliverable_url ? job.deliverable_url.slice(0, 40) + "…" : "Add deliverable link…"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <Layers className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No fulfillment jobs found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
