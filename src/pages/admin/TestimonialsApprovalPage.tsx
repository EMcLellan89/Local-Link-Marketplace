import { useState, useEffect } from 'react';
import { MessageSquare, Check, X, Star, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface Testimonial {
  id: string;
  role: string;
  display_name: string;
  business_type: string;
  content: string;
  result_badge: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
  approved_at: string | null;
}

type FilterTab = 'pending' | 'approved' | 'all';

export default function TestimonialsApprovalPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>('pending');
  const [working, setWorking] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [tab]);

  async function load() {
    setLoading(true);
    let q = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (tab === 'pending') q = q.eq('approved', false);
    if (tab === 'approved') q = q.eq('approved', true);
    const { data } = await q.limit(50);
    setItems(data || []);
    setLoading(false);
  }

  async function approve(id: string) {
    setWorking(id);
    await supabase.from('testimonials').update({ approved: true, approved_at: new Date().toISOString() }).eq('id', id);
    setItems(prev => prev.filter(t => tab === 'pending' ? t.id !== id : true).map(t => t.id === id ? { ...t, approved: true } : t));
    setWorking(null);
  }

  async function reject(id: string) {
    setWorking(id);
    await supabase.from('testimonials').delete().eq('id', id);
    setItems(prev => prev.filter(t => t.id !== id));
    setWorking(null);
  }

  async function toggleFeatured(id: string, current: boolean) {
    setWorking(id);
    await supabase.from('testimonials').update({ featured: !current }).eq('id', id);
    setItems(prev => prev.map(t => t.id === id ? { ...t, featured: !current } : t));
    setWorking(null);
  }

  async function unapprove(id: string) {
    setWorking(id);
    await supabase.from('testimonials').update({ approved: false, approved_at: null }).eq('id', id);
    setItems(prev => prev.map(t => t.id === id ? { ...t, approved: false } : t));
    setWorking(null);
  }

  const counts = {
    pending: items.filter(t => !t.approved).length,
    approved: items.filter(t => t.approved).length,
  };

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'pending', label: 'Pending Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'all', label: 'All' },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Testimonials Manager</h1>
              <p className="text-blue-100">Review and publish user-submitted results for the Proof Engine</p>
            </div>
            <Link to="/results" target="_blank" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <ExternalLink className="w-4 h-4" />
              View Results Page
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending Review', value: items.filter(t => !t.approved).length, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Approved & Live', value: items.filter(t => t.approved).length, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Featured', value: items.filter(t => t.featured).length, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map(s => (
            <Card key={s.label}>
              <CardBody>
                <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-gray-900">
              {tab === 'pending' ? 'Pending Testimonials' : tab === 'approved' ? 'Approved Testimonials' : 'All Testimonials'}
            </h2>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No testimonials here yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((t) => (
                  <div key={t.id} className={`border rounded-xl p-4 ${t.approved ? 'border-green-200 bg-green-50/30' : 'border-orange-200 bg-orange-50/20'}`}>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.role === 'partner' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>
                            {t.role}
                          </span>
                          <span className="font-semibold text-gray-900 text-sm">{t.display_name}</span>
                          {t.business_type && <span className="text-gray-500 text-sm">· {t.business_type}</span>}
                          {t.result_badge && (
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              {t.result_badge}
                            </span>
                          )}
                          {t.featured && (
                            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3" /> Featured
                            </span>
                          )}
                          {t.approved && (
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Live
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm italic">&ldquo;{t.content}&rdquo;</p>
                        <p className="text-gray-400 text-xs mt-2">
                          Submitted {new Date(t.created_at).toLocaleDateString()}
                          {t.approved_at && ` · Approved ${new Date(t.approved_at).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {!t.approved && (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={working === t.id}
                            onClick={() => approve(t.id)}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                        )}
                        {t.approved && (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={working === t.id}
                            onClick={() => toggleFeatured(t.id, t.featured)}
                          >
                            {t.featured ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Star className="w-3.5 h-3.5 mr-1" />}
                            {t.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                        )}
                        {t.approved && (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={working === t.id}
                            onClick={() => unapprove(t.id)}
                          >
                            <EyeOff className="w-3.5 h-3.5 mr-1" />
                            Unpublish
                          </Button>
                        )}
                        <button
                          disabled={working === t.id}
                          onClick={() => reject(t.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 justify-center py-1 disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
