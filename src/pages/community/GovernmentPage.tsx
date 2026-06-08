import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, MapPin, Calendar, Building2, AlertTriangle,
  Megaphone, Briefcase, TreePine, PawPrint, Heart,
  ChevronDown, Phone, ExternalLink, ArrowLeft,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const CATEGORY_TABS = [
  { id: 'all',               label: 'All Notices',    icon: Building2 },
  { id: 'town_announcement', label: 'Announcements',  icon: Megaphone },
  { id: 'public_works',      label: 'Public Works',   icon: Briefcase },
  { id: 'parks_rec',         label: 'Parks & Rec',    icon: TreePine },
  { id: 'animal_control',    label: 'Animal Control', icon: PawPrint },
  { id: 'senior_services',   label: 'Senior Services',icon: Heart },
  { id: 'veteran_services',  label: 'Veterans',       icon: Shield },
];

const GOV_POST_TYPES = ['town_announcement','public_works','parks_rec','animal_control','senior_services','veteran_services','government_notice','health_dept','emergency_alert'];

interface Post {
  id: string;
  title: string;
  body: string | null;
  post_type: string;
  priority: string;
  image_url: string | null;
  event_date: string | null;
  event_time: string | null;
  event_location: string | null;
  contact_info: string | null;
  external_url: string | null;
  community_organizations?: { name: string } | null;
}

interface Town { id: string; name: string; state: string }

const MOCK_POSTS: Post[] = [
  { id: '1', title: 'Town Meeting – FY2027 Budget Hearing', body: 'Annual Town Meeting. All registered voters welcome to attend and vote on the FY2027 operating budget.', post_type: 'town_announcement', priority: 'high', image_url: null, event_date: '2026-06-22', event_time: '7:00 PM', event_location: 'Pepperell Town Hall, 1 Main St', contact_info: '978-433-0333', external_url: null, community_organizations: { name: 'Town of Pepperell' } },
  { id: '2', title: 'Road Closure: Mill Street Repaving', body: 'Mill Street between Groton St and Heald St will be closed Mon–Wed. Use Route 113 as alternate route.', post_type: 'public_works', priority: 'high', image_url: null, event_date: '2026-06-11', event_time: null, event_location: 'Mill Street, Pepperell', contact_info: '978-433-0340', external_url: null, community_organizations: { name: 'Pepperell DPW' } },
  { id: '3', title: 'Brush Pickup Week – June 16–20', body: 'Annual curbside brush and yard waste pickup. Place bundles at curb by 7 AM Monday.', post_type: 'public_works', priority: 'normal', image_url: null, event_date: '2026-06-16', event_time: '7:00 AM', event_location: 'Town-wide', contact_info: null, external_url: null, community_organizations: { name: 'Pepperell DPW' } },
  { id: '4', title: 'Senior Center – Summer Social', body: 'Join us for an outdoor summer social at the Senior Center. Music, food, and fun. All seniors 60+ welcome.', post_type: 'senior_services', priority: 'normal', image_url: 'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: '2026-06-25', event_time: '11:30 AM', event_location: 'Pepperell Senior Center', contact_info: '978-433-0338', external_url: null, community_organizations: { name: 'Pepperell Senior Center' } },
  { id: '5', title: 'Pepperell Dog Park Grand Opening', body: 'The new fenced dog park at Shattuck Park is now open! Off-leash area available for all licensed dogs.', post_type: 'parks_rec', priority: 'normal', image_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: '2026-06-14', event_time: '10:00 AM', event_location: 'Shattuck Park, Pepperell', contact_info: '978-433-0334', external_url: null, community_organizations: { name: 'Pepperell Parks & Recreation' } },
  { id: '6', title: 'Rabies Clinic – June 21', body: 'Free rabies vaccination clinic for dogs and cats. Must bring current license for dogs. No appointment necessary.', post_type: 'animal_control', priority: 'normal', image_url: null, event_date: '2026-06-21', event_time: '9:00 AM – 12:00 PM', event_location: 'Pepperell Town Hall Parking Lot', contact_info: '978-433-0337', external_url: null, community_organizations: { name: 'Pepperell Animal Control' } },
];

const TYPE_COLOR: Record<string, string> = {
  town_announcement: 'bg-blue-100 text-blue-700',
  public_works:      'bg-orange-100 text-orange-700',
  parks_rec:         'bg-green-100 text-green-700',
  animal_control:    'bg-amber-100 text-amber-700',
  senior_services:   'bg-pink-100 text-pink-700',
  veteran_services:  'bg-indigo-100 text-indigo-700',
  government_notice: 'bg-blue-100 text-blue-700',
  health_dept:       'bg-red-100 text-red-700',
  emergency_alert:   'bg-red-100 text-red-700',
};

export default function GovernmentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownDrop, setShowTownDrop] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('community_towns').select('id,name,state').eq('is_active', true).order('name').then(({ data }) => {
      if (data?.length) {
        setTowns(data);
        setSelectedTown(data.find((t: Town) => t.name === 'Pepperell') || data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedTown) return;
    setLoading(true);
    supabase
      .from('community_posts')
      .select('*, community_organizations(name)')
      .eq('town_id', selectedTown.id)
      .eq('status', 'published')
      .in('post_type', GOV_POST_TYPES)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) setPosts(data);
        else setPosts(MOCK_POSTS);
        setLoading(false);
      });
  }, [selectedTown]);

  const filtered = posts.filter(p => activeTab === 'all' || p.post_type === activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 text-white">
          <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-blue-200 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-6 h-6 text-blue-300" />
                <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider">Government Portal</span>
              </div>
              <h1 className="text-3xl font-bold">Town Notices & Public Information</h1>
              <p className="text-blue-100 mt-1">Official announcements from your local government</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowTownDrop(!showTownDrop)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2.5 rounded-xl text-white font-medium transition-colors"
              >
                <MapPin className="w-4 h-4 text-blue-300" />
                {selectedTown?.name || 'Select Town'}, {selectedTown?.state}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showTownDrop && (
                <div className="absolute top-full mt-2 right-0 w-60 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto">
                  {towns.map(t => (
                    <button key={t.id} onClick={() => { setSelectedTown(t); setShowTownDrop(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-900 hover:bg-slate-50">
                      {t.name}, {t.state}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'bg-blue-700 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(post => {
              const colorClass = TYPE_COLOR[post.post_type] || 'bg-slate-100 text-slate-600';
              return (
                <Card key={post.id} variant="bordered" className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-40 object-cover" />}
                  <CardBody className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
                        {post.post_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      {post.priority === 'high' && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">URGENT</span>}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{post.title}</h3>
                      {post.body && <p className="text-sm text-slate-600 mt-1 line-clamp-3">{post.body}</p>}
                    </div>
                    <div className="space-y-1 text-xs text-slate-500">
                      {post.event_date && (
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />
                          {new Date(post.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          {post.event_time && <> · {post.event_time}</>}
                        </div>
                      )}
                      {post.event_location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{post.event_location}</div>}
                      {post.community_organizations && <div className="flex items-center gap-1.5 font-medium text-slate-600"><Building2 className="w-3.5 h-3.5" />{post.community_organizations.name}</div>}
                    </div>
                    {(post.contact_info || post.external_url) && (
                      <div className="flex items-center gap-3 pt-1">
                        {post.contact_info && <a href={`tel:${post.contact_info}`} className="flex items-center gap-1 text-xs text-blue-700 font-medium hover:underline"><Phone className="w-3 h-3" />{post.contact_info}</a>}
                        {post.external_url && <a href={post.external_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-700 font-medium hover:underline ml-auto">More Info <ExternalLink className="w-3 h-3" /></a>}
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <Card variant="bordered">
            <CardBody className="text-center py-12">
              <Shield className="w-14 h-14 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No government notices found for this category.</p>
            </CardBody>
          </Card>
        )}

        {/* Post your own notice CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-blue-900">Are you a town official or government agency?</h3>
            <p className="text-sm text-blue-700 mt-1">Post official notices, announcements, and updates to reach your community instantly.</p>
          </div>
          <Button onClick={() => navigate('/register?type=government')} className="whitespace-nowrap">
            Register Your Organization
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
