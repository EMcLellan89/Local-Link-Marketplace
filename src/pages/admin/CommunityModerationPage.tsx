import { useEffect, useState } from 'react';
import {
  CheckCircle, XCircle, Clock, Building2, MapPin,
  Filter, Eye, Calendar,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface PendingPost {
  id: string;
  title: string;
  body: string | null;
  post_type: string;
  priority: string;
  status: string;
  event_date: string | null;
  event_location: string | null;
  created_at: string;
  community_organizations?: { name: string; org_type: string } | null;
  community_towns?: { name: string; state: string } | null;
}

const MOCK_PENDING: PendingPost[] = [
  { id: '1', title: 'Annual Harvest Festival – September 20', body: 'Community harvest festival with local vendors, food, games, and live music.', post_type: 'community_event', priority: 'normal', status: 'pending', event_date: '2026-09-20', event_location: 'Pepperell Town Common', created_at: new Date().toISOString(), community_organizations: { name: 'Pepperell Historical Society', org_type: 'civic' }, community_towns: { name: 'Pepperell', state: 'MA' } },
  { id: '2', title: 'Free Legal Aid Clinic – August 5', body: 'Volunteer attorneys will provide free 30-minute consultations on family law, housing, and benefits.', post_type: 'nonprofit_event', priority: 'high', status: 'pending', event_date: '2026-08-05', event_location: 'Pepperell Public Library', created_at: new Date(Date.now() - 3600000).toISOString(), community_organizations: { name: 'Greater Lowell Legal Aid', org_type: 'nonprofit' }, community_towns: { name: 'Pepperell', state: 'MA' } },
  { id: '3', title: 'Water Main Replacement – Oak St', body: '4-day water main replacement on Oak Street. Residents will have service interruptions.', post_type: 'public_works', priority: 'high', status: 'pending', event_date: '2026-07-07', event_location: 'Oak Street, Pepperell', created_at: new Date(Date.now() - 7200000).toISOString(), community_organizations: { name: 'Pepperell DPW', org_type: 'government' }, community_towns: { name: 'Pepperell', state: 'MA' } },
];

const STATUS_COLOR: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  published:'bg-blue-100 text-blue-700',
};

export default function CommunityContentModerationPage() {
  const [posts, setPosts] = useState<PendingPost[]>(MOCK_PENDING);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [processing, setProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('community_posts')
      .select('*, community_organizations(name, org_type), community_towns(name, state)')
      .eq('status', filterStatus)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) setPosts(data); });
  }, [filterStatus]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = async (postId: string, newStatus: 'approved' | 'published' | 'rejected') => {
    setProcessing(postId);
    const finalStatus = newStatus === 'approved' ? 'published' : newStatus;
    const { error } = await supabase
      .from('community_posts')
      .update({ status: finalStatus, approved_at: newStatus !== 'rejected' ? new Date().toISOString() : null })
      .eq('id', postId);

    if (!error) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      showToast(newStatus === 'rejected' ? 'Post rejected.' : 'Post approved and published!');
    }
    setProcessing(null);
  };

  const filtered = posts.filter(p => p.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl font-medium text-sm animate-fade-in">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Community Content Moderation</h1>
          <p className="text-slate-600 text-sm mt-1">Review and approve posts from government, nonprofits, and schools</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {(['pending','published','rejected'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filterStatus === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: posts.filter(p => p.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Published Today', value: posts.filter(p => p.status === 'published').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Rejected', value: posts.filter(p => p.status === 'rejected').length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Posts', value: posts.length, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4`}>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-slate-600 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card variant="bordered">
          <CardBody className="text-center py-12">
            <CheckCircle className="w-14 h-14 mx-auto text-green-400 mb-4" />
            <p className="text-slate-600 font-medium">No {filterStatus} posts. All clear!</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => (
            <Card key={post.id} variant="bordered" className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[post.status]}`}>
                        {post.status.toUpperCase()}
                      </span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {post.post_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      {post.priority === 'high' && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">HIGH PRIORITY</span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{post.title}</h3>
                    {post.body && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.body}</p>}
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 flex-wrap">
                      {post.community_organizations && (
                        <div className="flex items-center gap-1.5 font-medium text-slate-600">
                          <Building2 className="w-3.5 h-3.5" />
                          {post.community_organizations.name} · {post.community_organizations.org_type}
                        </div>
                      )}
                      {post.community_towns && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {post.community_towns.name}, {post.community_towns.state}
                        </div>
                      )}
                      {post.event_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                      {post.event_location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {post.event_location}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Submitted {new Date(post.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {filterStatus === 'pending' && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={processing === post.id}
                        onClick={() => updateStatus(post.id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        {processing === post.id ? 'Publishing...' : 'Approve & Publish'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        disabled={processing === post.id}
                        onClick={() => updateStatus(post.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-1.5" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
