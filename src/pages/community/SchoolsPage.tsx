import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, MapPin, Calendar, Building2, BookOpen,
  Users, ChevronDown, Phone, ExternalLink, ArrowLeft, Star,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Organization { id: string; name: string; org_type: string; description: string | null; phone: string | null; website_url: string | null; is_verified: boolean }
interface Post { id: string; title: string; body: string | null; post_type: string; image_url: string | null; event_date: string | null; event_time: string | null; event_location: string | null; community_organizations?: { name: string } | null }
interface Town { id: string; name: string; state: string }

const MOCK_ORGS: Organization[] = [
  { id: '1', name: 'North Middlesex Regional School District', org_type: 'school', description: 'Public school district serving Pepperell, Townsend, and Ashby. Home of the Patriots.', phone: '978-433-0100', website_url: 'https://www.nmrsd.org', is_verified: true },
  { id: '2', name: 'Varnum Brook Elementary', org_type: 'school', description: 'K–4 elementary school in Pepperell serving the local community.', phone: '978-433-0200', website_url: null, is_verified: true },
  { id: '3', name: 'Pepperell Middle School', org_type: 'school', description: 'Grades 5–8, part of the North Middlesex Regional School District.', phone: '978-433-0210', website_url: null, is_verified: true },
  { id: '4', name: 'Pepperell Elementary PTA', org_type: 'civic', description: 'Parent-Teacher Association supporting school programs, events, and family engagement.', phone: null, website_url: null, is_verified: false },
  { id: '5', name: 'Pepperell Public Library', org_type: 'library', description: 'Adult education, storytime, youth programs, and lifelong learning resources.', phone: '978-433-0330', website_url: null, is_verified: true },
];

const MOCK_POSTS: Post[] = [
  { id: '1', title: 'End of Year Concert – June 19', body: 'Annual NMRSD End of Year Concert featuring bands, chorus, and orchestra from all grade levels.', post_type: 'school_event', image_url: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: '2026-06-19', event_time: '6:30 PM', event_location: 'NMRSD Auditorium', community_organizations: { name: 'North Middlesex Regional School District' } },
  { id: '2', title: 'PTA Fundraiser – Book Fair', body: 'Annual Spring Book Fair at Varnum Brook Elementary. Purchase books and support the school library.', post_type: 'school_event', image_url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: '2026-06-12', event_time: '8:00 AM – 3:00 PM', event_location: 'Varnum Brook Elementary Library', community_organizations: { name: 'Pepperell Elementary PTA' } },
  { id: '3', title: 'Summer Library Reading Program', body: 'Kids and teens read books, earn prizes, and join activities all summer long at the library!', post_type: 'library', image_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600', event_date: '2026-06-21', event_time: 'Starts June 21', event_location: 'Pepperell Public Library', community_organizations: { name: 'Pepperell Public Library' } },
  { id: '4', title: 'Early Release – Parent Conferences', body: '1:00 PM early release on June 17 for parent-teacher conferences. Aftercare available, call the school to reserve.', post_type: 'school_event', image_url: null, event_date: '2026-06-17', event_time: '1:00 PM Dismissal', event_location: 'All NMRSD Schools', community_organizations: { name: 'North Middlesex Regional School District' } },
];

export default function SchoolsPage() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<Organization[]>(MOCK_ORGS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownDrop, setShowTownDrop] = useState(false);
  const [activeTab, setActiveTab] = useState<'schools' | 'events'>('schools');

  useEffect(() => {
    supabase.from('community_towns').select('id,name,state').eq('is_active', true).order('name').then(({ data }) => {
      if (data?.length) { setTowns(data); setSelectedTown(data.find((t: Town) => t.name === 'Pepperell') || data[0]); }
    });
  }, []);

  useEffect(() => {
    if (!selectedTown) return;
    supabase.from('community_organizations').select('*').eq('town_id', selectedTown.id).in('org_type', ['school','library']).eq('is_active', true).then(({ data }) => { if (data?.length) setOrgs(data); });
    supabase.from('community_posts').select('*, community_organizations(name)').eq('town_id', selectedTown.id).eq('status', 'published').in('post_type', ['school_event','schools','library']).order('created_at', { ascending: false }).then(({ data }) => { if (data?.length) setPosts(data); });
  }, [selectedTown]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-violet-900 to-violet-600 rounded-2xl p-8 text-white">
          <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-violet-200 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-6 h-6 text-violet-300" />
                <span className="text-violet-200 text-sm font-semibold uppercase tracking-wider">Schools & Education</span>
              </div>
              <h1 className="text-3xl font-bold">Schools, Libraries & Learning</h1>
              <p className="text-violet-100 mt-1">School events, PTA news, library programs, and adult education</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowTownDrop(!showTownDrop)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2.5 rounded-xl text-white font-medium transition-colors">
                <MapPin className="w-4 h-4 text-violet-300" />{selectedTown?.name || 'Select Town'}, {selectedTown?.state}<ChevronDown className="w-4 h-4" />
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
          {(['schools', 'events'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl font-medium text-sm capitalize transition-all ${activeTab === tab ? 'bg-violet-700 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
              {tab === 'schools' ? 'Schools & Libraries' : 'Events & Notices'}
            </button>
          ))}
        </div>

        {activeTab === 'schools' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {orgs.map(org => (
              <Card key={org.id} variant="bordered" className="hover:shadow-lg transition-shadow">
                <CardBody className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${org.org_type === 'library' ? 'bg-emerald-100' : 'bg-violet-100'}`}>
                      {org.org_type === 'library' ? <BookOpen className="w-6 h-6 text-emerald-700" /> : <GraduationCap className="w-6 h-6 text-violet-700" />}
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
                    {org.phone && <a href={`tel:${org.phone}`} className="flex items-center gap-1 text-xs text-violet-700 font-medium hover:underline"><Phone className="w-3 h-3" />{org.phone}</a>}
                    {org.website_url && <a href={org.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-violet-700 font-medium hover:underline ml-auto">Website <ExternalLink className="w-3 h-3" /></a>}
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
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
                    <GraduationCap className="w-3 h-3" />{post.post_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
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

        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-violet-900">School or Library? Join Local-Link.</h3>
            <p className="text-sm text-violet-700 mt-1">Post events, closings, and news to instantly reach parents and community members.</p>
          </div>
          <Button onClick={() => navigate('/register?type=school')} className="whitespace-nowrap bg-violet-700 hover:bg-violet-800">
            Register Your School
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
