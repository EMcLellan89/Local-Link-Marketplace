import { useState, useEffect } from 'react';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  Plus, Search, Phone, Mail, MapPin, Building2, ChevronDown, ChevronUp,
  Check, Clock, X, Loader2, Star, MessageSquare, Calendar
} from 'lucide-react';

type Lead = {
  id: string;
  business_name: string;
  contact_name: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  category?: string;
  status: string;
  notes?: string;
  created_at: string;
};

const STATUS_OPTS = ['prospect', 'contacted', 'interested', 'demo_scheduled', 'signed', 'lost'];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  prospect:       { label: 'Prospect',        color: 'bg-slate-100 text-slate-700' },
  contacted:      { label: 'Contacted',       color: 'bg-blue-100 text-blue-700' },
  interested:     { label: 'Interested',      color: 'bg-amber-100 text-amber-700' },
  demo_scheduled: { label: 'Demo Scheduled',  color: 'bg-purple-100 text-purple-700' },
  signed:         { label: 'Signed',          color: 'bg-emerald-100 text-emerald-700' },
  lost:           { label: 'Lost',            color: 'bg-red-100 text-red-700' },
};

const CATEGORIES = [
  'Restaurant', 'Salon & Spa', 'Auto Repair', 'Dental', 'Fitness',
  'Retail', 'Real Estate', 'Legal', 'Healthcare', 'Home Services', 'Other'
];

export default function PartnerOutreachPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: '', contact_name: '', phone: '', email: '',
    city: '', state: '', category: 'Restaurant', notes: '', status: 'prospect'
  });

  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data: partnerRow } = await supabase
      .from('partners')
      .select('id')
      .eq('user_id', user?.id)
      .maybeSingle();
    if (!partnerRow) { setLoading(false); return; }
    const { data } = await supabase
      .from('partner_leads')
      .select('*')
      .eq('partner_id', partnerRow.id)
      .order('created_at', { ascending: false });
    setLeads(data || []);
    setLoading(false);
  }

  async function addLead() {
    if (!form.business_name || !form.contact_name) return;
    setSaving(true);
    const { data: partnerRow } = await supabase
      .from('partners')
      .select('id')
      .eq('user_id', user?.id)
      .maybeSingle();
    if (!partnerRow) { setSaving(false); return; }
    await supabase.from('partner_leads').insert({
      ...form,
      name: form.contact_name,
      partner_id: partnerRow.id,
    });
    setForm({ business_name: '', contact_name: '', phone: '', email: '', city: '', state: '', category: 'Restaurant', notes: '', status: 'prospect' });
    setShowForm(false);
    await fetchLeads();
    setSaving(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('partner_leads').update({ status }).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }

  async function updateNotes(id: string, notes: string) {
    await supabase.from('partner_leads').update({ notes }).eq('id', id);
  }

  const filtered = leads.filter(l => {
    const matchSearch = !search ||
      l.business_name.toLowerCase().includes(search.toLowerCase()) ||
      l.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      (l.city || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = STATUS_OPTS.reduce((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <PartnerHubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Merchant Outreach</h1>
            <p className="text-slate-500 mt-1">Track your leads and close new merchants.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#2BB673] text-white px-4 py-2 rounded-lg hover:bg-[#22995f] transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Merchant
          </button>
        </div>

        {/* Pipeline summary */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {STATUS_OPTS.map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                className={`rounded-lg p-3 text-center border transition-all ${filterStatus === s ? 'border-[#2BB673] bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className={`text-lg font-bold ${filterStatus === s ? 'text-[#2BB673]' : 'text-slate-900'}`}>{statusCounts[s] || 0}</div>
                <div className="text-xs text-slate-500 leading-tight">{cfg.label}</div>
              </button>
            );
          })}
        </div>

        {/* Add lead form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Add New Merchant Lead</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'business_name', label: 'Business Name *' },
                { key: 'contact_name', label: 'Contact Name *' },
                { key: 'phone', label: 'Phone' },
                { key: 'email', label: 'Email' },
                { key: 'city', label: 'City' },
                { key: 'state', label: 'State' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={addLead}
                disabled={saving || !form.business_name || !form.contact_name}
                className="flex items-center gap-2 bg-[#2BB673] text-white px-4 py-2 rounded-lg hover:bg-[#22995f] disabled:opacity-50 text-sm font-medium transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save Lead
              </button>
              <button onClick={() => setShowForm(false)} className="flex items-center gap-2 text-slate-600 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by business, contact, or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
          />
        </div>

        {/* Leads list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#2BB673]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No leads yet</p>
            <p className="text-slate-400 text-sm mt-1">Add your first merchant prospect above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(lead => {
              const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG['prospect'];
              const isOpen = expanded === lead.id;
              return (
                <div key={lead.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setExpanded(isOpen ? null : lead.id)}
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-[#2BB673]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900">{lead.business_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                        {lead.category && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{lead.category}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 flex-wrap">
                        <span>{lead.contact_name}</span>
                        {lead.city && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{lead.city}{lead.state ? `, ${lead.state}` : ''}</span>}
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Update Status</label>
                          <select
                            value={lead.status}
                            onChange={e => updateStatus(lead.id, e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                          >
                            {STATUS_OPTS.map(s => (
                              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          {lead.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {lead.phone}</p>}
                          {lead.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {lead.email}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Notes</label>
                        <textarea
                          defaultValue={lead.notes || ''}
                          onBlur={e => updateNotes(lead.id, e.target.value)}
                          rows={3}
                          placeholder="Add notes about this merchant..."
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2BB673] resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PartnerHubLayout>
  );
}
