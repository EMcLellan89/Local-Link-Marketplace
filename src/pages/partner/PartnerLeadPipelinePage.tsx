import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import {
  Plus, X, Phone, Mail, Building2, DollarSign,
  Calendar, ChevronRight, User, Tag, Clock, CheckCircle2
} from "lucide-react";

type LeadStatus = "new" | "contacted" | "demo_booked" | "proposal_sent" | "closed_won" | "closed_lost";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  business_name: string | null;
  source: string | null;
  status: LeadStatus;
  product_interest: string | null;
  estimated_value_cents: number | null;
  notes: string | null;
  next_follow_up_at: string | null;
  created_at: string;
};

const COLUMNS: { key: LeadStatus; label: string; color: string; dot: string }[] = [
  { key: "new", label: "New", color: "bg-gray-50 border-gray-200", dot: "bg-gray-400" },
  { key: "contacted", label: "Contacted", color: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  { key: "demo_booked", label: "Demo Booked", color: "bg-yellow-50 border-yellow-200", dot: "bg-yellow-500" },
  { key: "proposal_sent", label: "Proposal Sent", color: "bg-orange-50 border-orange-200", dot: "bg-orange-500" },
  { key: "closed_won", label: "Closed / Won", color: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  { key: "closed_lost", label: "Closed / Lost", color: "bg-red-50 border-red-200", dot: "bg-red-400" },
];

const SOURCES = ["referral", "social_media", "direct_message", "networking", "partner_referral", "other"];
const PRODUCTS = ["Merchant Plan", "1Hub CRM", "1Hub CPA", "Visibility Package", "AI Tools", "Job Board", "Other"];

const STATUS_NEXT: Partial<Record<LeadStatus, LeadStatus>> = {
  new: "contacted",
  contacted: "demo_booked",
  demo_booked: "proposal_sent",
  proposal_sent: "closed_won",
};

function formatCents(c: number | null) {
  if (!c) return null;
  return `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

function daysAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function isOverdue(d: string | null) {
  if (!d) return false;
  return new Date(d) < new Date();
}

type AddLeadForm = {
  name: string;
  email: string;
  phone: string;
  business_name: string;
  source: string;
  product_interest: string;
  estimated_value_cents: string;
  notes: string;
  next_follow_up_at: string;
};

const EMPTY_FORM: AddLeadForm = {
  name: "", email: "", phone: "", business_name: "",
  source: "direct_message", product_interest: "Merchant Plan",
  estimated_value_cents: "", notes: "", next_follow_up_at: "",
};

export default function PartnerLeadPipelinePage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<AddLeadForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailNotes, setDetailNotes] = useState("");
  const [detailFollowUp, setDetailFollowUp] = useState("");
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) loadLeads();
  }, [user?.id]);

  async function loadLeads() {
    setLoading(true);
    try {
      const { data: partner } = await supabase
        .from("partners").select("id").eq("user_id", user!.id).maybeSingle();
      if (!partner) return;
      setPartnerId(partner.id);

      const { data } = await supabase
        .from("partner_leads")
        .select("*")
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false });
      if (data) setLeads(data as Lead[]);
    } finally {
      setLoading(false);
    }
  }

  async function addLead() {
    if (!partnerId || !form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        partner_id: partnerId,
        name: form.name.trim(),
        email: form.email || null,
        phone: form.phone || null,
        business_name: form.business_name || null,
        source: form.source || null,
        status: "new" as LeadStatus,
        product_interest: form.product_interest || null,
        estimated_value_cents: form.estimated_value_cents
          ? Math.round(parseFloat(form.estimated_value_cents) * 100) : null,
        notes: form.notes || null,
        next_follow_up_at: form.next_follow_up_at || null,
      };
      const { data, error } = await supabase.from("partner_leads").insert(payload).select().maybeSingle();
      if (!error && data) {
        setLeads(prev => [data as Lead, ...prev]);
        setShowAdd(false);
        setForm(EMPTY_FORM);
      }
    } finally {
      setSaving(false);
    }
  }

  async function moveLead(lead: Lead, newStatus: LeadStatus) {
    setMovingId(lead.id);
    try {
      const { data, error } = await supabase
        .from("partner_leads")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", lead.id)
        .select()
        .maybeSingle();
      if (!error && data) {
        setLeads(prev => prev.map(l => l.id === lead.id ? data as Lead : l));
        if (selectedLead?.id === lead.id) setSelectedLead(data as Lead);
      }
    } finally {
      setMovingId(null);
    }
  }

  async function saveLead(lead: Lead) {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("partner_leads")
        .update({
          notes: detailNotes,
          next_follow_up_at: detailFollowUp || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", lead.id)
        .select()
        .maybeSingle();
      if (!error && data) {
        setLeads(prev => prev.map(l => l.id === lead.id ? data as Lead : l));
        setSelectedLead(data as Lead);
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("partner_leads").delete().eq("id", id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
  }

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    setDetailNotes(lead.notes ?? "");
    setDetailFollowUp(lead.next_follow_up_at?.slice(0, 16) ?? "");
  }

  const byStatus = (status: LeadStatus) => leads.filter(l => l.status === status);
  const pipeline = leads.filter(l => l.status !== "closed_won" && l.status !== "closed_lost");
  const totalPipelineValue = pipeline.reduce((s, l) => s + (l.estimated_value_cents ?? 0), 0);
  const wonValue = leads.filter(l => l.status === "closed_won").reduce((s, l) => s + (l.estimated_value_cents ?? 0), 0);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Loading pipeline…</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track and manage your prospects from first contact to close.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">Total Leads</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{leads.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">Pipeline Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCents(totalPipelineValue) ?? "$0"}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">Closed / Won</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCents(wonValue) ?? "$0"}</p>
        </div>
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map(col => {
            const colLeads = byStatus(col.key);
            return (
              <div key={col.key} className="w-64 flex-shrink-0">
                <div className={`rounded-xl border ${col.color} p-3`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <span className="font-semibold text-gray-800 text-sm">{col.label}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                      {colLeads.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {colLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => openLead(lead)}
                        className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{lead.name}</p>
                          {lead.estimated_value_cents && (
                            <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded flex-shrink-0">
                              {formatCents(lead.estimated_value_cents)}
                            </span>
                          )}
                        </div>
                        {lead.business_name && (
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {lead.business_name}
                          </p>
                        )}
                        {lead.product_interest && (
                          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {lead.product_interest}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">{daysAgo(lead.created_at)}</span>
                          {lead.next_follow_up_at && (
                            <span className={`text-xs flex items-center gap-1 ${isOverdue(lead.next_follow_up_at) ? "text-red-600" : "text-gray-400"}`}>
                              <Clock className="w-3 h-3" />
                              {new Date(lead.next_follow_up_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                        {STATUS_NEXT[lead.status] && (
                          <button
                            onClick={e => { e.stopPropagation(); moveLead(lead, STATUS_NEXT[lead.status]!); }}
                            disabled={movingId === lead.id}
                            className="mt-2 w-full text-xs text-blue-600 border border-blue-200 rounded py-1 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            Move to {COLUMNS.find(c => c.key === STATUS_NEXT[lead.status])?.label}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {colLeads.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4 italic">No leads here</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Add New Lead</h2>
              <button onClick={() => { setShowAdd(false); setForm(EMPTY_FORM); }}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Smith"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={form.business_name}
                  onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Acme Plumbing Co."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
                  <select
                    value={form.source}
                    onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SOURCES.map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Product Interest</label>
                  <select
                    value={form.product_interest}
                    onChange={e => setForm(f => ({ ...f, product_interest: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Est. Value ($)</label>
                  <input
                    type="number"
                    value={form.estimated_value_cents}
                    onChange={e => setForm(f => ({ ...f, estimated_value_cents: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Follow-up Date</label>
                  <input
                    type="datetime-local"
                    value={form.next_follow_up_at}
                    onChange={e => setForm(f => ({ ...f, next_follow_up_at: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Met at networking event. Interested in the Starter plan…"
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { setShowAdd(false); setForm(EMPTY_FORM); }}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addLead}
                disabled={!form.name.trim() || saving}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Adding…" : "Add Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm h-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">{selectedLead.name}</h2>
                {selectedLead.business_name && (
                  <p className="text-xs text-gray-500 mt-0.5">{selectedLead.business_name}</p>
                )}
              </div>
              <button onClick={() => setSelectedLead(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="p-5 space-y-4 flex-1">
              {/* Status */}
              <div className="flex items-center gap-2 flex-wrap">
                {COLUMNS.map(col => (
                  <button
                    key={col.key}
                    onClick={() => moveLead(selectedLead, col.key)}
                    disabled={movingId === selectedLead.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedLead.status === col.key
                        ? `${col.dot} text-white border-transparent`
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    } ${selectedLead.status === col.key ? "" : ""}`}
                    style={selectedLead.status === col.key ? { backgroundColor: "" } : {}}
                  >
                    {col.label}
                  </button>
                ))}
              </div>

              {/* Contact info */}
              <div className="space-y-2">
                {selectedLead.email && (
                  <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Mail className="w-4 h-4 text-gray-400" /> {selectedLead.email}
                  </a>
                )}
                {selectedLead.phone && (
                  <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Phone className="w-4 h-4 text-gray-400" /> {selectedLead.phone}
                  </a>
                )}
                {selectedLead.product_interest && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Tag className="w-4 h-4 text-gray-400" /> {selectedLead.product_interest}
                  </div>
                )}
                {selectedLead.estimated_value_cents && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <DollarSign className="w-4 h-4 text-gray-400" /> {formatCents(selectedLead.estimated_value_cents)} est. value
                  </div>
                )}
                {selectedLead.source && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="w-4 h-4 text-gray-400" /> Source: {selectedLead.source.replace(/_/g, " ")}
                  </div>
                )}
              </div>

              {/* Move forward button */}
              {STATUS_NEXT[selectedLead.status] && (
                <button
                  onClick={() => moveLead(selectedLead, STATUS_NEXT[selectedLead.status]!)}
                  disabled={movingId === selectedLead.id}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Move to {COLUMNS.find(c => c.key === STATUS_NEXT[selectedLead.status])?.label}
                </button>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={detailNotes}
                  onChange={e => setDetailNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Add notes about this lead…"
                />
              </div>

              {/* Follow-up */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Follow-up Date
                </label>
                <input
                  type="datetime-local"
                  value={detailFollowUp}
                  onChange={e => setDetailFollowUp(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => saveLead(selectedLead)}
                disabled={saving}
                className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>

              <button
                onClick={() => deleteLead(selectedLead.id)}
                className="w-full py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
