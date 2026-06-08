import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, MapPin, Calendar, Building2, HandHeart,
  Users, ChevronDown, Phone, ExternalLink, ArrowLeft, Star,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Organization {
  id: string;
  name: string;
  org_type: string;
  description: string | null;
  logo_url: string | null;
  phone: string | null;
  website_url: string | null;
  is_verified: boolean;
}

interface Post {
  id: string;
  title: string;
  body: string | null;
  post_type: string;
  image_url: string | null;
  event_date: string | null;
  event_time: string | null;
  event_location: string | null;
  community_organizations?: { name: string } | null;
}

interface Town { id: string; name: string; state: string }

const MOCK_ORGS: Organization[] = [
  { id: '1', name: 'Greater Nashoba Valley Food Pantry', org_type: 'nonprofit', description: 'Free food assistance for community members in need. No paperwork required.', logo_url: null, phone: '978-433-0350', website_url: null, is_verified: true },
  { id: '2', name: 'Pepperell Animal Shelter', org_type: 'nonprofit', description: 'Animal control and adoption services for the Pepperell area.', logo_url: null, phone: '978-433-0337', website_url: null, is_verified: true },
  { id: '3', name: 'Varnum Post VFW', org_type: 'civic', description: 'Veterans of Foreign Wars Pepperell Post – supporting veterans and community.', logo_url: null, phone: '978-433-0360', website_url: null, is_verified: true },
  { id: '4', name: 'Pepperell Little League', org_type: 'civic', description: 'Youth baseball and softball programs for ages 5–12. Serving Pepperell families since 1952.', logo_url: null, phone: null, website_url: null, is_verified: true },
  { id: '5', name: 'Pepperell Elementary PTA', org_type: 'civic', description: 'Parent-Teacher Association supporting Pepperell Elementary School students and families.', logo_url: null, phone: null, website_url: null, is_verified: false },
];

const MOCK_POSTS: Post[] = [
  { id: '1', title: 'Food Pantry Open – Tuesdays & Thursdays', body: 'Free food assistance every Tuesday 4–6 PM and Thursday 9 AM–12 PM. All are welcome, no paperwork required.', post_type: 'volunteer', image_url: 'https://images.pexels.com/photos/6591162/pexels-photo-6591162.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: null, event_time: 'Tue 4–6 PM, Thu 9–12 PM', event_location: '5 Mill St, Pepperell', community_organizations: { name: 'Greater Nashoba Valley Food Pantry' } },
  { id: '2', title: 'Annual Golf Tournament Fundraiser', body: 'Join us for the 10th Annual VFW Golf Tournament. All proceeds support local veteran services and scholarships.', post_type: 'fundraiser', image_url: 'https://images.pexels.com/photos/1325659/pexels-photo-1325659.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: '2026-07-12', event_time: '8:00 AM Shotgun Start', event_location: 'Country Club of New Hampshire', community_organizations: { name: 'Varnum Post VFW' } },
  { id: '3', title: 'Little League Tryouts – Spring 2027', body: 'Open tryouts for all skill levels. Ages 5–12 welcome. No experience necessary.', post_type: 'community_event', image_url: 'https://images.pexels.com/photos/1679710/pexels-photo-1679710.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: '2026-08-15', event_time: '9:00 AM', event_location: 'Pepperell Little League Fields', community_organizations: { name: 'Pepperell Little League' } },
];

export default function NonprofitsPage() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<Organization[]>(MOCK_ORGS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownDrop, setShowTownDrop] = useState(false);
  const [activeTab, setActiveTab] = useState<'organizations' | 'events'>('organizations');

  useEffect(() => {
    supabase.from('community_towns').select('id,name,state').eq('is_active', true).order('name').then(({ data }) => {
      if (data?.length) { setTowns(data); setSelectedTown(data.find((t: Town) => t.name === 'Pepperell') || data[0]); }
    });
  }, []);

  useEffect(() => {
    if (!selectedTown) return;
    supabase.from('community_organizations').select('*').eq('town_id', selectedTown.id).in('org_type', ['nonprofit','civic','religious']).eq('is_active', true).then(({ data }) => { if (data?.length) setOrgs(data); });
    supabase.from('community_posts').select('*, community_organizations(name)').eq('town_id', selectedTown.id).eq('status', 'published').in('post_type', ['nonprofit_event','fundraiser','volunteer','lost_found']).order('created_at', { ascending: false }).then(({ data }) => { if (data?.length) setPosts(data); });
  }, [selectedTown]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-rose-900 to-rose-600 rounded-2xl p-8 text-white">
          <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-rose-200 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-6 h-6 text-rose-300" />
                <span className="text-rose-200 text-sm font-semibold uppercase tracking-wider">Nonprofits & Community Organizations</span>
              </div>
              <h1 className="text-3xl font-bold">Community Heart</h1>
              <p className="text-rose-100 mt-1">Nonprofits, civic groups, charities, and community organizations</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowTownDrop(!showTownDrop)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2.5 rounded-xl text-white font-medium transition-colors">
                <MapPin className="w-4 h-4 text-rose-300" />{selectedTown?.name || 'Select Town'}, {selectedTown?.state}<ChevronDown className="w-4 h-4" />
              </button>
              {showTownDrop && (
                <div className="absolute top-full mt-2 right-0 w-60 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto">
                  {towns.map(t => <button key={t.id} onClick={() => { setSelectedTown(t); setShowTownDrop(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-900 hover:bg-slate-50">{t.name}, {t.state}</button>)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {(['organizations', 'events'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl font-medium text-sm capitalize transition-all ${activeTab === tab ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'organizations' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {orgs.map(org => (
              <Card key={org.id} variant="bordered" className="hover:shadow-lg transition-shadow">
                <CardBody className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{org.name}</h3>
                        {org.is_verified && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-slate-500 capitalize">{org.org_type}</span>
                    </div>
                  </div>
                  {org.description && <p className="text-sm text-slate-600 line-clamp-2">{org.description}</p>}
                  <div className="flex gap-3">
                    {org.phone && <a href={`tel:${org.phone}`} className="flex items-center gap-1 text-xs text-rose-600 font-medium hover:underline"><Phone className="w-3 h-3" />{org.phone}</a>}
                    {org.website_url && <a href={org.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-rose-600 font-medium hover:underline ml-auto">Website <ExternalLink className="w-3 h-3" /></a>}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => (
              <Card key={post.id} variant="bordered" className="overflow-hidden hover:shadow-lg transition-shadow">
                {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-40 object-cover" />}
                <CardBody className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
                    <Heart className="w-3 h-3" />{post.post_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{post.title}</h3>
                    {post.body && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.body}</p>}
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    {post.event_date && <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(post.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}{post.event_time && ` · ${post.event_time}`}</div>}
                    {post.event_location && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{post.event_location}</div>}
                    {post.community_organizations && <div className="flex items-center gap-1.5 font-medium text-slate-600"><Building2 className="w-3.5 h-3.5" />{post.community_organizations.name}</div>}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-rose-900">Is your nonprofit or organization on Local-Link?</h3>
            <p className="text-sm text-rose-700 mt-1">Post events, volunteer needs, and fundraisers to reach your entire community for free.</p>
          </div>
          <Button onClick={() => navigate('/register?type=nonprofit')} className="whitespace-nowrap bg-rose-600 hover:bg-rose-700">
            Register Your Organization
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
