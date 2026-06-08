import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Building2, Shield, Heart, GraduationCap, HandHeart,
  AlertTriangle, Tag, MapPin, ArrowLeft, Calendar,
  Phone, ExternalLink, Users,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Town { id: string; name: string; state: string; tier: string | null }
interface Post { id: string; title: string; body: string | null; post_type: string; event_date: string | null; event_time: string | null; event_location: string | null; community_organizations?: { name: string; org_type: string } | null }
interface Alert { id: string; title: string; description: string; alert_type: string; severity: string }

const SECTION_PORTALS = [
  { label: 'Government Notices', icon: Shield, color: 'bg-blue-600', route: '/government' },
  { label: 'Nonprofits', icon: Heart, color: 'bg-rose-600', route: '/nonprofits' },
  { label: 'Schools & Library', icon: GraduationCap, color: 'bg-violet-600', route: '/schools' },
  { label: 'Volunteer', icon: HandHeart, color: 'bg-teal-600', route: '/volunteer' },
  { label: 'Emergency Alerts', icon: AlertTriangle, color: 'bg-red-600', route: '/emergency-alerts' },
  { label: 'Local Deals', icon: Tag, color: 'bg-emerald-600', route: '/pulse' },
  { label: 'Resources', icon: Building2, color: 'bg-slate-600', route: '/community-resources' },
];

const POST_TYPE_COLOR: Record<string, string> = {
  town_announcement: 'bg-blue-100 text-blue-700',
  public_works:      'bg-orange-100 text-orange-700',
  school_event:      'bg-violet-100 text-violet-700',
  community_event:   'bg-green-100 text-green-700',
  nonprofit_event:   'bg-rose-100 text-rose-700',
  senior_services:   'bg-pink-100 text-pink-700',
  library:           'bg-emerald-100 text-emerald-700',
  volunteer:         'bg-teal-100 text-teal-700',
  fundraiser:        'bg-rose-100 text-rose-700',
};

export default function TownPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [town, setTown] = useState<Town | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    loadTownData(slug);
  }, [slug]);

  const loadTownData = async (townSlug: string) => {
    setLoading(true);
    try {
      const { data: townData } = await supabase
        .from('community_towns')
        .select('id, name, state, tier')
        .or(`name.ilike.${townSlug},name.ilike.${townSlug.replace(/-/g, ' ')}`)
        .single();

      if (!townData) { setNotFound(true); setLoading(false); return; }
      setTown(townData);

      const [postsRes, alertsRes] = await Promise.all([
        supabase.from('community_posts').select('*, community_organizations(name, org_type)').eq('town_id', townData.id).eq('status', 'published').order('created_at', { ascending: false }).limit(12),
        supabase.from('emergency_alerts').select('*').eq('town_id', townData.id).eq('is_active', true),
      ]);
      setPosts(postsRes.data || []);
      setAlerts(alertsRes.data || []);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]" />
      </div>
    </DashboardLayout>
  );

  if (notFound) return (
    <DashboardLayout>
      <div className="text-center py-20">
        <MapPin className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Town Not Found</h2>
        <p className="text-slate-500 mb-6">We couldn't find a town matching "{slug}".</p>
        <Button onClick={() => navigate('/community')}>Back to Community Hub</Button>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1a3a2a] to-[#2BB673] rounded-2xl p-8 text-white">
          <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-emerald-200 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">{town?.name}</h1>
              <p className="text-emerald-200 text-lg mt-1">{town?.state} · Local-Link CommunityHub™</p>
              <p className="text-emerald-100 text-sm mt-2">
                Your digital town square — government, businesses, nonprofits, schools & more
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <MapPin className="w-5 h-5 text-emerald-300" />
              <span className="font-semibold">{town?.name}, {town?.state}</span>
            </div>
          </div>
        </div>

        {/* Active emergency alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className={`border-l-4 rounded-xl p-4 flex items-start gap-3 ${alert.severity === 'critical' ? 'bg-red-50 border-red-600' : 'bg-amber-50 border-amber-500'}`}>
                <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${alert.severity === 'critical' ? 'text-red-600' : 'text-amber-500'}`} />
                <div>
                  <p className="font-bold text-sm text-slate-900">{alert.title}</p>
                  <p className="text-sm text-slate-700 mt-0.5">{alert.description}</p>
                </div>
                <button onClick={() => navigate('/emergency-alerts')} className="ml-auto text-xs font-semibold underline text-slate-600 whitespace-nowrap">View all</button>
              </div>
            ))}
          </div>
        )}

        {/* Portal navigation */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Explore {town?.name}</h2>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {SECTION_PORTALS.map(({ label, icon: Icon, color, route }) => (
              <button
                key={label}
                onClick={() => navigate(route)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl text-white text-center transition-transform hover:scale-105 ${color}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-semibold leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent posts */}
        {posts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Latest in {town?.name}</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/community')}>
                View All
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map(post => {
                const colorClass = POST_TYPE_COLOR[post.post_type] || 'bg-slate-100 text-slate-700';
                return (
                  <Card key={post.id} variant="bordered" className="hover:shadow-md transition-shadow">
                    <CardBody className="space-y-3">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
                        {post.post_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900">{post.title}</h3>
                        {post.body && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.body}</p>}
                      </div>
                      <div className="space-y-1 text-xs text-slate-500">
                        {post.event_date && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {post.event_time && ` · ${post.event_time}`}
                          </div>
                        )}
                        {post.event_location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{post.event_location}</div>}
                        {post.community_organizations && <div className="flex items-center gap-1.5 font-medium text-slate-600"><Building2 className="w-3.5 h-3.5" />{post.community_organizations.name}</div>}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {posts.length === 0 && !loading && (
          <Card variant="bordered">
            <CardBody className="text-center py-12">
              <Building2 className="w-14 h-14 mx-auto text-slate-300 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">No posts yet for {town?.name}</h3>
              <p className="text-slate-500 mb-4">Be the first to add your organization or business.</p>
              <Button onClick={() => navigate('/register')}>Get Listed</Button>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
