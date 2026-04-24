import { useEffect, useState } from 'react';
import {
  Target, Plus, Search, Filter, MoreHorizontal, Phone, Mail,
  ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  lead_source: string | null;
  lead_value: number | null;
  priority: string | null;
  notes: string | null;
  next_follow_up: string | null;
  created_at: string;
}

const STATUS_FLOW = ['new', 'contacted', 'qualified', 'converted', 'lost'];

const STATUS_STYLE: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  new: { label: 'New', cls: 'bg-blue-50 text-blue-700 border-blue-100', icon: AlertCircle },
  contacted: { label: 'Contacted', cls: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock },
  qualified: { label: 'Qualified', cls: 'bg-purple-50 text-purple-700 border-purple-100', icon: ArrowUpRight },
  converted: { label: 'Converted', cls: 'bg-[#2BB673]/10 text-[#2BB673] border-[#2BB673]/20', icon: CheckCircle },
  lost: { label: 'Lost', cls: 'bg-rose-50 text-rose-600 border-rose-100', icon: XCircle },
};

const PRIORITY_COLOR: Record<string, string> = { urgent: 'bg-rose-500', high: 'bg-orange-400', medium: 'bg-amber-400', low: 'bg-slate-300' };

const SOURCES = ['marketplace', 'partner', 'referral', 'walk_in', 'event', 'form', 'direct', 'social'];

const MOCK: Lead[] = [
  { id: 'l1', first_name: 'Marcus', last_name: 'Johnson', email: 'marcus@example.com', phone: '(555) 123-4567', company: 'Johnson LLC', status: 'new', lead_source: 'marketplace', lead_value: 2500, priority: 'high', notes: 'Interested in full setup package', next_follow_up: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'l2', first_name: 'Sarah', last_name: 'Chen', email: 'sarah@example.com', phone: '(555) 987-6543', company: null, status: 'contacted', lead_source: 'partner', lead_value: 1800, priority: 'medium', notes: 'Called twice, left voicemail', next_follow_up: new Date(Date.now() + 86400000).toISOString(), created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'l3', first_name: 'David', last_name: 'Rivera', email: 'david@example.com', phone: null, company: 'Rivera Eats', status: 'qualified', lead_source: 'direct', lead_value: 5000, priority: 'high', notes: 'Restaurant owner, ready to sign', next_follow_up: new Date(Date.now() + 172800000).toISOString(), created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'l4', first_name: 'Lisa', last_name: 'Park', email: 'lisa@example.com', phone: '(555) 444-2222', company: 'Park Boutique', status: 'converted', lead_source: 'event', lead_value: 3200, priority: 'medium', notes: null, next_follow_up: null, created_at: new Date(Date.now() - 604800000).toISOString() },
];

function LeadRow({ lead, onStatusChange }: { lead: Lead; onStatusChange: (id: string, status: string) => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const s = STATUS_STYLE[lead.status] || STATUS_STYLE.new;
  const Icon = s.icon;

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          {lead.priority && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_COLOR[lead.priority] || 'bg-slate-300'}`} />}
          <div>
            <div className="font-medium text-slate-900 text-sm">{lead.first_name} {lead.last_name}</div>
            {lead.company && <div className="text-xs text-slate-400">{lead.company}</div>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 hidden sm:table-cell">
        <div className="space-y-0.5">
          {lead.email && <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#2BB673]"><Mail className="w-3 h-3" /> {lead.email}</a>}
          {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#2BB673]"><Phone className="w-3 h-3" /> {lead.phone}</a>}
        </div>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell">
        <span className="text-xs text-slate-500 capitalize">{(lead.lead_source || 'direct').replace('_', ' ')}</span>
      </td>
      <td className="px-4 py-3.5">
        <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${s.cls}`}>
          <Icon className="w-3 h-3" />
          {s.label}
        </div>
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell text-sm font-medium text-slate-700">
        {lead.lead_value ? `$${lead.lead_value.toLocaleString()}` : '—'}
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-slate-400">
        {lead.next_follow_up ? new Date(lead.next_follow_up).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
      </td>
      <td className="px-4 py-3.5 relative">
        <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showMenu && (
          <div className="absolute right-4 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[160px]">
            {STATUS_FLOW.filter(s => s !== lead.status).map(s => (
              <button
                key={s}
                onClick={() => { onStatusChange(lead.id, s); setShowMenu(false); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 capitalize"
              >
                Mark as {STATUS_STYLE[s]?.label || s}
              </button>
            ))}
            <hr className="my-1 border-slate-100" />
            <button className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">Delete</button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default function CRMLeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', company: '', lead_source: 'direct', notes: '', priority: 'medium' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadLeads(); }, [user]);

  const loadLeads = async () => {
    if (!user) { setLeads(MOCK); setLoading(false); return; }
    try {
      const { data: m } = await supabase.from('merchants').select('id').eq('user_id', user.id).maybeSingle();
      if (!m) { setLeads(MOCK); setLoading(false); return; }
      setMerchantId(m.id);
      const { data } = await supabase.from('crm_leads').select('*').eq('merchant_id', m.id).order('created_at', { ascending: false });
      setLeads(data?.length ? data : MOCK);
    } catch { setLeads(MOCK); }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (!merchantId) return;
    await supabase.from('crm_leads').update({ status: newStatus }).eq('id', id);
  };

  const handleAddLead = async () => {
    if (!form.first_name || !merchantId) return;
    setSaving(true);
    try {
      const { data } = await supabase.from('crm_leads').insert({
        merchant_id: merchantId,
        ...form,
        status: 'new',
      }).select().maybeSingle();
      if (data) setLeads(prev => [data, ...prev]);
      else setLeads(prev => [{ id: `tmp-${Date.now()}`, ...form, status: 'new', lead_value: null, next_follow_up: null, created_at: new Date().toISOString() }, ...prev]);
    } catch {
      setLeads(prev => [{ id: `tmp-${Date.now()}`, ...form, status: 'new', lead_value: null, next_follow_up: null, created_at: new Date().toISOString() }, ...prev]);
    }
    setShowAddModal(false);
    setForm({ first_name: '', last_name: '', email: '', phone: '', company: '', lead_source: 'direct', notes: '', priority: 'medium' });
    setSaving(false);
  };

  const filtered = leads.filter(l => {
    const matchSearch = !search || `${l.first_name} ${l.last_name} ${l.email} ${l.company}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const countByStatus = (s: string) => leads.filter(l => l.status === s).length;

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <a href="/merchant/crm-hub" className="hover:text-[#2BB673]">CRM Hub</a>
            <span>/</span>
            <span className="text-slate-900 font-medium">Leads</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" /> Leads
          </h1>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Lead
        </Button>
      </div>

      {/* Status Kanban Summary */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {STATUS_FLOW.map(s => {
          const st = STATUS_STYLE[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`p-3 rounded-xl border text-center transition-all ${statusFilter === s ? st.cls : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className="text-xl font-bold text-slate-900">{countByStatus(s)}</div>
              <div className="text-xs text-slate-500 capitalize">{st.label}</div>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20 focus:border-[#2BB673]"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          <Filter className="w-4 h-4" /> Filter
        </button>
        <button onClick={loadLeads} className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Source</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Value</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Follow Up</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">Loading leads...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center">
                <Target className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <div className="text-slate-500 font-medium">No leads found</div>
                <div className="text-slate-400 text-sm mt-1">Add your first lead to get started</div>
              </td></tr>
            ) : filtered.map(l => (
              <LeadRow key={l.id} lead={l} onStatusChange={handleStatusChange} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg text-slate-900 mb-4">Add New Lead</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">First Name *</label>
                  <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20 focus:border-[#2BB673]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
                  <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20 focus:border-[#2BB673]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20 focus:border-[#2BB673]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20 focus:border-[#2BB673]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Company</label>
                <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20 focus:border-[#2BB673]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Source</label>
                  <select value={form.lead_source} onChange={e => setForm(f => ({ ...f, lead_source: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20 focus:border-[#2BB673]">
                    {SOURCES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20 focus:border-[#2BB673]">
                    {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/20 focus:border-[#2BB673] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleAddLead} disabled={saving || !form.first_name} className="flex-1 py-2.5 bg-[#2BB673] hover:bg-[#22a262] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                {saving ? 'Saving...' : 'Add Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
