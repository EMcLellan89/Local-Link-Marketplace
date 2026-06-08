import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Building2, Users, GraduationCap, Heart, Zap,
  AlertTriangle, HandHeart, Search, ChevronDown, Tag,
  Calendar, Megaphone, BookOpen, TreePine, PawPrint,
  Briefcase, ShoppingBag, BadgeAlert, Phone, ExternalLink,
  ArrowRight, Store, Shield, Star,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';

// ── Types ──────────────────────────────────────────────────────────────────

interface Town {
  id: string;
  name: string;
  state: string;
}

interface Organization {
  id: string;
  name: string;
  org_type: string;
  description: string | null;
  logo_url: string | null;
  is_verified: boolean;
  town_id: string | null;
}

interface CommunityPost {
  id: string;
  title: string;
  body: string | null;
  post_type: string;
  priority: string;
  image_url: string | null;
  event_date: string | null;
  event_time: string | null;
  event_location: string | null;
  external_url: string | null;
  contact_info: string | null;
  organization_id: string | null;
  community_organizations?: { name: string; org_type: string } | null;
  created_at: string;
}

interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  alert_type: string;
  severity: string;
  expires_at: string | null;
  community_organizations?: { name: string } | null;
}

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  category: string | null;
  slots_available: number | null;
  slots_filled: number;
  date_needed: string | null;
  time_commitment: string | null;
  location: string | null;
  community_organizations?: { name: string } | null;
}

// ── Category config ────────────────────────────────────────────────────────

const POST_TYPE_CONFIG: Record<string, { label: string; icon: React.FC<any>; color: string }> = {
  town_announcement: { label: 'Town Announcement', icon: Megaphone, color: 'bg-blue-100 text-blue-700' },
  emergency_alert:   { label: 'Emergency Alert',   icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
  public_works:      { label: 'Public Works',       icon: Briefcase,   color: 'bg-orange-100 text-orange-700' },
  senior_services:   { label: 'Senior Services',    icon: Heart,       color: 'bg-pink-100 text-pink-700' },
  veteran_services:  { label: 'Veteran Services',   icon: Shield,      color: 'bg-indigo-100 text-indigo-700' },
  library:           { label: 'Library',             icon: BookOpen,    color: 'bg-emerald-100 text-emerald-700' },
  schools:           { label: 'Schools',             icon: GraduationCap, color: 'bg-violet-100 text-violet-700' },
  parks_rec:         { label: 'Parks & Rec',         icon: TreePine,    color: 'bg-green-100 text-green-700' },
  animal_control:    { label: 'Animal Control',      icon: PawPrint,    color: 'bg-amber-100 text-amber-700' },
  health_dept:       { label: 'Health Dept',         icon: Heart,       color: 'bg-red-100 text-red-700' },
  volunteer:         { label: 'Volunteer',           icon: HandHeart,   color: 'bg-teal-100 text-teal-700' },
  fundraiser:        { label: 'Fundraiser',          icon: Heart,       color: 'bg-pink-100 text-pink-700' },
  lost_found:        { label: 'Lost & Found',        icon: Search,      color: 'bg-yellow-100 text-yellow-700' },
  local_jobs:        { label: 'Local Jobs',          icon: Briefcase,   color: 'bg-slate-100 text-slate-700' },
  nonprofit_event:   { label: 'Nonprofit Event',     icon: Users,       color: 'bg-teal-100 text-teal-700' },
  school_event:      { label: 'School Event',        icon: GraduationCap, color: 'bg-violet-100 text-violet-700' },
  government_notice: { label: 'Government Notice',   icon: Building2,   color: 'bg-blue-100 text-blue-700' },
  community_event:   { label: 'Community Event',     icon: Calendar,    color: 'bg-green-100 text-green-700' },
};

const ALERT_COLOR: Record<string, string> = {
  info:     'bg-blue-50 border-blue-300 text-blue-900',
  warning:  'bg-amber-50 border-amber-400 text-amber-900',
  critical: 'bg-red-50 border-red-500 text-red-900',
};

const ALERT_ICON_COLOR: Record<string, string> = {
  info:     'text-blue-500',
  warning:  'text-amber-500',
  critical: 'text-red-600',
};

// ── Mock Data (fallback when DB is empty) ──────────────────────────────────

const MOCK_TOWNS: Town[] = [
  { id: '1', name: 'Pepperell', state: 'MA' },
  { id: '2', name: 'Groton', state: 'MA' },
  { id: '3', name: 'Townsend', state: 'MA' },
];

const MOCK_EMERGENCY: EmergencyAlert[] = [
  {
    id: '1',
    title: 'Stage 2 Water Restriction in Effect',
    description: 'Due to drought conditions, outdoor watering is restricted to odd/even days. Violators may be fined.',
    alert_type: 'water_ban',
    severity: 'warning',
    expires_at: null,
    community_organizations: { name: 'Pepperell DPW' },
  },
];

const MOCK_POSTS: CommunityPost[] = [
  { id: '1', title: 'Town Meeting – FY2027 Budget Hearing', body: 'Annual Town Meeting to vote on the FY2027 operating budget. All registered voters welcome.', post_type: 'town_announcement', priority: 'high', image_url: null, event_date: '2026-06-22', event_time: '7:00 PM', event_location: 'Pepperell Town Hall', external_url: null, contact_info: '978-433-0333', organization_id: null, community_organizations: { name: 'Town of Pepperell', org_type: 'government' }, created_at: new Date().toISOString() },
  { id: '2', title: 'Road Closure: Mill Street Repaving', body: 'Mill Street between Groton St and Heald St will be closed Mon–Wed for repaving. Use Route 113 as alternate.', post_type: 'public_works', priority: 'high', image_url: null, event_date: '2026-06-11', event_time: null, event_location: 'Mill Street, Pepperell', external_url: null, contact_info: null, organization_id: null, community_organizations: { name: 'Pepperell DPW', org_type: 'government' }, created_at: new Date().toISOString() },
  { id: '3', title: 'Summer Reading Program Kickoff', body: 'Join us for the annual Summer Reading Program! All ages welcome. Prizes, activities, and more.', post_type: 'library', priority: 'normal', image_url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: '2026-06-13', event_time: '10:00 AM', event_location: 'Pepperell Public Library', external_url: null, contact_info: null, organization_id: null, community_organizations: { name: 'Pepperell Public Library', org_type: 'library' }, created_at: new Date().toISOString() },
  { id: '4', title: 'NMRSD End of Year Concert – June 19', body: 'Join us for the North Middlesex Regional School District End of Year Concert featuring bands, chorus, and orchestra.', post_type: 'school_event', priority: 'normal', image_url: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: '2026-06-19', event_time: '6:30 PM', event_location: 'NMRSD Auditorium', external_url: null, contact_info: null, organization_id: null, community_organizations: { name: 'NMRSD', org_type: 'school' }, created_at: new Date().toISOString() },
  { id: '5', title: 'Brush Pickup Week – June 16–20', body: 'Annual curbside brush and yard waste pickup. Place bundles at curb by 7 AM Monday.', post_type: 'public_works', priority: 'normal', image_url: null, event_date: '2026-06-16', event_time: '7:00 AM', event_location: 'Town-wide', external_url: null, contact_info: null, organization_id: null, community_organizations: { name: 'Pepperell DPW', org_type: 'government' }, created_at: new Date().toISOString() },
  { id: '6', title: 'Food Pantry – Open Tuesdays & Thursdays', body: 'Free food assistance. Tuesdays 4–6 PM, Thursdays 9 AM–12 PM. No paperwork required. All are welcome.', post_type: 'volunteer', priority: 'high', image_url: 'https://images.pexels.com/photos/6591162/pexels-photo-6591162.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: null, event_time: null, event_location: '5 Mill St, Pepperell', external_url: null, contact_info: null, organization_id: null, community_organizations: { name: 'Greater Nashoba Valley Food Pantry', org_type: 'nonprofit' }, created_at: new Date().toISOString() },
  { id: '7', title: 'Little League Registration Open', body: 'Register your child (ages 5–12) for Pepperell Little League! Spring season starts in April.', post_type: 'community_event', priority: 'normal', image_url: 'https://images.pexels.com/photos/1679710/pexels-photo-1679710.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: null, event_time: null, event_location: 'Pepperell Little League Fields', external_url: null, contact_info: null, organization_id: null, community_organizations: { name: 'Pepperell Little League', org_type: 'civic' }, created_at: new Date().toISOString() },
  { id: '8', title: 'Senior Center – Bingo & Lunch Fridays', body: 'Join us every Friday for bingo, lunch, and friendly company. Open to all seniors 60+. Free to attend.', post_type: 'senior_services', priority: 'normal', image_url: null, event_date: null, event_time: '11:30 AM Fridays', event_location: 'Pepperell Senior Center', external_url: null, contact_info: '978-433-0338', organization_id: null, community_organizations: { name: 'Pepperell Senior Center', org_type: 'government' }, created_at: new Date().toISOString() },
];

const MOCK_VOLUNTEER: VolunteerOpportunity[] = [
  { id: '1', title: 'Food Pantry Distribution Volunteers', description: 'Help sort and distribute food to families in need every Tuesday and Thursday.', category: 'Food Bank', slots_available: 8, slots_filled: 3, date_needed: '2026-06-10', time_commitment: '3 hours/week', location: '5 Mill St, Pepperell', community_organizations: { name: 'Greater Nashoba Valley Food Pantry' } },
  { id: '2', title: 'Dog Walkers Needed – Animal Shelter', description: 'Walk and socialize dogs awaiting adoption. Morning and afternoon shifts available.', category: 'Animal Care', slots_available: 4, slots_filled: 1, date_needed: '2026-06-08', time_commitment: '1-2 hours, flexible', location: 'Pepperell Animal Shelter', community_organizations: { name: 'Pepperell Animal Shelter' } },
  { id: '3', title: 'Community Garden Helpers', description: 'Help maintain the community garden – weeding, watering, and harvesting for donation.', category: 'Gardening', slots_available: 6, slots_filled: 2, date_needed: '2026-06-15', time_commitment: 'Weekend mornings', location: 'Pepperell Community Garden', community_organizations: { name: 'Pepperell Parks & Rec' } },
];

// ── Tab config ─────────────────────────────────────────────────────────────

const TABS = [
  { id: 'all',        label: 'Town Hub',      icon: Building2 },
  { id: 'government', label: 'Government',    icon: Shield },
  { id: 'events',     label: 'Events',        icon: Calendar },
  { id: 'nonprofits', label: 'Nonprofits',    icon: Heart },
  { id: 'schools',    label: 'Schools',       icon: GraduationCap },
  { id: 'volunteer',  label: 'Volunteer',     icon: HandHeart },
  { id: 'deals',      label: 'Local Deals',   icon: Tag },
  { id: 'resources',  label: 'Resources',     icon: BookOpen },
];

const GOV_TYPES = ['town_announcement','public_works','emergency_alert','government_notice','parks_rec','animal_control','health_dept','senior_services','veteran_services'];
const EVENT_TYPES = ['community_event','school_event','nonprofit_event','library','parks_rec'];
const NONPROFIT_TYPES = ['nonprofit_event','fundraiser','volunteer','lost_found'];
const SCHOOL_TYPES = ['school_event','schools'];
const RESOURCE_TYPES = ['senior_services','veteran_services','library','health_dept'];

// ── Main Component ─────────────────────────────────────────────────────────

export default function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [towns, setTowns] = useState<Town[]>([]);
  const [showTownDropdown, setShowTownDropdown] = useState(false);
  const [townSearch, setTownSearch] = useState('');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [volunteerOps, setVolunteerOps] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTowns();
  }, []);

  useEffect(() => {
    if (selectedTown) loadData(selectedTown.id);
  }, [selectedTown]);

  const loadTowns = async () => {
    try {
      const { data } = await supabase
        .from('community_towns')
        .select('id, name, state')
        .eq('is_active', true)
        .order('name');
      if (data && data.length > 0) {
        setTowns(data);
        setSelectedTown(data.find(t => t.name === 'Pepperell') || data[0]);
      } else {
        setTowns(MOCK_TOWNS);
        setSelectedTown(MOCK_TOWNS[0]);
      }
    } catch {
      setTowns(MOCK_TOWNS);
      setSelectedTown(MOCK_TOWNS[0]);
    }
  };

  const loadData = async (townId: string) => {
    setLoading(true);
    try {
      const [postsRes, alertsRes, volunteerRes] = await Promise.all([
        supabase
          .from('community_posts')
          .select('*, community_organizations(name, org_type)')
          .eq('town_id', townId)
          .eq('status', 'published')
          .order('created_at', { ascending: false }),
        supabase
          .from('emergency_alerts')
          .select('*, community_organizations(name)')
          .eq('town_id', townId)
          .eq('is_active', true),
        supabase
          .from('volunteer_opportunities')
          .select('*, community_organizations(name)')
          .eq('town_id', townId)
          .eq('status', 'open'),
      ]);

      setPosts(postsRes.data?.length ? postsRes.data : MOCK_POSTS);
      setEmergencyAlerts(alertsRes.data?.length ? alertsRes.data : MOCK_EMERGENCY);
      setVolunteerOps(volunteerRes.data?.length ? volunteerRes.data : MOCK_VOLUNTEER);
    } catch {
      setPosts(MOCK_POSTS);
      setEmergencyAlerts(MOCK_EMERGENCY);
      setVolunteerOps(MOCK_VOLUNTEER);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'government') return GOV_TYPES.includes(p.post_type);
    if (activeTab === 'events') return EVENT_TYPES.includes(p.post_type);
    if (activeTab === 'nonprofits') return NONPROFIT_TYPES.includes(p.post_type);
    if (activeTab === 'schools') return SCHOOL_TYPES.includes(p.post_type);
    if (activeTab === 'volunteer') return p.post_type === 'volunteer';
    if (activeTab === 'resources') return RESOURCE_TYPES.includes(p.post_type);
    return true;
  });

  const filteredTowns = towns.filter(t =>
    t.name.toLowerCase().includes(townSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-0">
        {/* Hero / Town Selector */}
        <div className="bg-gradient-to-br from-[#1a3a2a] to-[#2BB673] rounded-2xl p-8 mb-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-6 h-6 text-emerald-300" />
                <span className="text-emerald-300 text-sm font-semibold uppercase tracking-widest">Local-Link CommunityHub™</span>
              </div>
              <h1 className="text-3xl font-bold">The Digital Town Square</h1>
              <p className="text-emerald-100 mt-1 text-sm">
                Residents · Merchants · Government · Nonprofits · Schools · Volunteers
              </p>
            </div>

            {/* Town picker */}
            <div className="relative">
              <button
                onClick={() => setShowTownDropdown(!showTownDropdown)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 px-5 py-3 rounded-xl text-white font-semibold transition-colors min-w-[200px]"
              >
                <MapPin className="w-5 h-5 text-emerald-300" />
                <span className="flex-1 text-left">{selectedTown?.name || 'Select Town'}, {selectedTown?.state}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showTownDropdown && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
                  <div className="p-3 border-b border-slate-100">
                    <input
                      type="text"
                      placeholder="Search towns..."
                      value={townSearch}
                      onChange={e => setTownSearch(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredTowns.map(town => (
                      <button
                        key={town.id}
                        onClick={() => { setSelectedTown(town); setShowTownDropdown(false); setTownSearch(''); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-slate-900 transition-colors ${selectedTown?.id === town.id ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}
                      >
                        {town.name}, {town.state}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 7-side quick nav */}
          <div className="mt-6 grid grid-cols-4 md:grid-cols-7 gap-2">
            {[
              { icon: Shield, label: 'Government', route: '/government' },
              { icon: Store, label: 'Merchants', route: '/deals' },
              { icon: Users, label: 'Partners', route: '/partner/dashboard' },
              { icon: Building2, label: 'Admin', route: '/admin/dashboard' },
              { icon: Heart, label: 'Nonprofits', route: '/nonprofits' },
              { icon: GraduationCap, label: 'Schools', route: '/schools' },
              { icon: HandHeart, label: 'Volunteer', route: '/volunteer' },
            ].map(({ icon: Icon, label, route }) => (
              <button
                key={label}
                onClick={() => navigate(route)}
                className="flex flex-col items-center gap-1 bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors text-white group"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Alerts Banner */}
        {emergencyAlerts.length > 0 && (
          <div className="space-y-2 mb-4">
            {emergencyAlerts.map(alert => (
              <div
                key={alert.id}
                className={`border-l-4 rounded-xl p-4 flex items-start gap-3 ${ALERT_COLOR[alert.severity] || ALERT_COLOR.warning}`}
              >
                <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${ALERT_ICON_COLOR[alert.severity]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{alert.title}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-70 bg-current/10 px-2 py-0.5 rounded-full">
                      {alert.alert_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm mt-1 opacity-90">{alert.description}</p>
                  {alert.community_organizations && (
                    <p className="text-xs mt-1 opacity-60">Issued by: {alert.community_organizations.name}</p>
                  )}
                </div>
                <button
                  onClick={() => navigate('/emergency-alerts')}
                  className="text-xs font-semibold underline opacity-80 hover:opacity-100 whitespace-nowrap"
                >
                  See all
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#2BB673] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Volunteer section (shown in volunteer tab) */}
        {activeTab === 'volunteer' && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HandHeart className="w-5 h-5 text-teal-600" />
                Volunteer Opportunities in {selectedTown?.name}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/volunteer')}>
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteerOps.map(op => (
                <VolunteerCard key={op.id} op={op} />
              ))}
            </div>
            {volunteerOps.length === 0 && (
              <EmptyState icon={HandHeart} message="No volunteer opportunities found for this town." />
            )}
          </div>
        )}

        {/* Posts grid */}
        {activeTab !== 'deals' && activeTab !== 'volunteer' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2BB673]" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <EmptyState icon={Building2} message={`No ${activeTab === 'all' ? '' : activeTab} posts found for ${selectedTown?.name}.`} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Deals tab → redirect banner */}
        {activeTab === 'deals' && (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 mx-auto text-[#2BB673] mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Local Merchant Deals</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Discover exclusive deals and offers from local businesses in {selectedTown?.name}.
            </p>
            <Button onClick={() => navigate('/pulse')}>
              Browse Deals <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function PostCard({ post }: { post: CommunityPost }) {
  const cfg = POST_TYPE_CONFIG[post.post_type] || POST_TYPE_CONFIG.community_event;
  const Icon = cfg.icon;

  return (
    <Card variant="bordered" className="overflow-hidden hover:shadow-lg transition-shadow">
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="w-full h-40 object-cover" />
      )}
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
            <Icon className="w-3 h-3" />
            {cfg.label}
          </span>
          {post.priority === 'high' || post.priority === 'urgent' ? (
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">PRIORITY</span>
          ) : null}
        </div>

        <div>
          <h3 className="font-bold text-slate-900 line-clamp-2">{post.title}</h3>
          {post.body && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.body}</p>}
        </div>

        <div className="space-y-1 text-xs text-slate-500">
          {post.event_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {post.event_time && <> · {post.event_time}</>}
            </div>
          )}
          {post.event_location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {post.event_location}
            </div>
          )}
          {post.community_organizations && (
            <div className="flex items-center gap-1.5 font-medium text-slate-600">
              <Building2 className="w-3.5 h-3.5" />
              {post.community_organizations.name}
            </div>
          )}
        </div>

        {(post.contact_info || post.external_url) && (
          <div className="flex gap-2 pt-1">
            {post.contact_info && (
              <a
                href={`tel:${post.contact_info}`}
                className="flex items-center gap-1 text-xs text-[#2BB673] font-medium hover:underline"
              >
                <Phone className="w-3 h-3" />
                {post.contact_info}
              </a>
            )}
            {post.external_url && (
              <a
                href={post.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#2BB673] font-medium hover:underline ml-auto"
              >
                More Info <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function VolunteerCard({ op }: { op: VolunteerOpportunity }) {
  const open = (op.slots_available || 0) - op.slots_filled;
  return (
    <Card variant="bordered" className="hover:shadow-md transition-shadow">
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">
            <HandHeart className="w-3 h-3" />
            {op.category || 'Volunteer'}
          </span>
          {op.slots_available && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${open > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {open > 0 ? `${open} spots` : 'Full'}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{op.title}</h3>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{op.description}</p>
        </div>
        <div className="space-y-1 text-xs text-slate-500">
          {op.location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{op.location}</div>}
          {op.time_commitment && <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{op.time_commitment}</div>}
          {op.community_organizations && <div className="flex items-center gap-1.5 font-medium text-slate-600"><Building2 className="w-3.5 h-3.5" />{op.community_organizations.name}</div>}
        </div>
        <Button size="sm" className="w-full" disabled={open <= 0}>
          {open > 0 ? 'Sign Up to Volunteer' : 'Join Waitlist'}
        </Button>
      </CardBody>
    </Card>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.FC<any>; message: string }) {
  return (
    <Card variant="bordered">
      <CardBody className="text-center py-14">
        <Icon className="w-14 h-14 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500">{message}</p>
      </CardBody>
    </Card>
  );
}
