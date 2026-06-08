import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HandHeart, MapPin, Calendar, Building2, ChevronDown,
  Users, Clock, ArrowLeft, CheckCircle, Search, Star,
  Heart, GraduationCap, Shield, TreePine, PawPrint,
  Utensils, Church, Baby, Zap, ArrowRight, Plus,
  Award, TrendingUp, RefreshCw,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string | null;
  slots_available: number | null;
  slots_filled: number;
  date_needed: string | null;
  time_commitment: string | null;
  location: string | null;
  contact_email: string | null;
  is_recurring: boolean;
  community_organizations?: { name: string; org_type?: string } | null;
}

interface Town { id: string; name: string; state: string }

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.FC<any>; color: string; bg: string }> = {
  'All':            { label: 'All',            icon: HandHeart,    color: 'text-teal-600',   bg: 'bg-teal-50' },
  'Food Bank':      { label: 'Food Bank',      icon: Utensils,     color: 'text-orange-600', bg: 'bg-orange-50' },
  'Senior Services':{ label: 'Seniors',        icon: Heart,        color: 'text-pink-600',   bg: 'bg-pink-50' },
  'Youth Sports':   { label: 'Youth Sports',   icon: Star,         color: 'text-yellow-600', bg: 'bg-yellow-50' },
  'Animal Care':    { label: 'Animal Care',    icon: PawPrint,     color: 'text-amber-600',  bg: 'bg-amber-50' },
  'Schools':        { label: 'Schools',        icon: GraduationCap,color: 'text-violet-600', bg: 'bg-violet-50' },
  'Veterans':       { label: 'Veterans',       icon: Shield,       color: 'text-blue-600',   bg: 'bg-blue-50' },
  'Gardening':      { label: 'Gardening',      icon: TreePine,     color: 'text-green-600',  bg: 'bg-green-50' },
  'Faith':          { label: 'Faith',          icon: Church,       color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Youth & Family': { label: 'Youth & Family', icon: Baby,         color: 'text-rose-600',   bg: 'bg-rose-50' },
  'Events':         { label: 'Events',         icon: Calendar,     color: 'text-cyan-600',   bg: 'bg-cyan-50' },
  'Emergency':      { label: 'Emergency',      icon: Zap,          color: 'text-red-600',    bg: 'bg-red-50' },
};

const ORG_TYPE_CONFIG: Record<string, { color: string; label: string }> = {
  government: { color: 'bg-blue-100 text-blue-700',    label: 'Government' },
  nonprofit:  { color: 'bg-rose-100 text-rose-700',    label: 'Nonprofit' },
  school:     { color: 'bg-violet-100 text-violet-700',label: 'School' },
  civic:      { color: 'bg-amber-100 text-amber-700',  label: 'Civic Org' },
  religious:  { color: 'bg-indigo-100 text-indigo-700',label: 'Faith' },
  library:    { color: 'bg-emerald-100 text-emerald-700', label: 'Library' },
};

const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: '1', title: 'Food Pantry Distribution Volunteers', description: 'Help sort and distribute food to families in need every Tuesday and Thursday. No experience required – just a warm heart and willingness to help.', category: 'Food Bank', slots_available: 8, slots_filled: 3, date_needed: '2026-06-10', time_commitment: '3 hours/week', location: '5 Mill St, Pepperell', contact_email: 'volunteer@nashobafoodpantry.org', is_recurring: true, community_organizations: { name: 'Greater Nashoba Valley Food Pantry', org_type: 'nonprofit' } },
  { id: '2', title: 'Dog Walkers Needed – Animal Shelter', description: 'Walk and socialize dogs awaiting adoption. Morning and afternoon shifts available 7 days a week.', category: 'Animal Care', slots_available: 4, slots_filled: 1, date_needed: '2026-06-08', time_commitment: '1–2 hours, flexible', location: 'Pepperell Animal Shelter', contact_email: 'shelter@pepperell.org', is_recurring: true, community_organizations: { name: 'Pepperell Animal Shelter', org_type: 'government' } },
  { id: '3', title: 'Community Garden Helpers', description: 'Help maintain the community garden – weeding, watering, and harvesting produce donated to the food pantry.', category: 'Gardening', slots_available: 6, slots_filled: 2, date_needed: '2026-06-15', time_commitment: 'Weekend mornings', location: 'Pepperell Community Garden', contact_email: 'garden@pepperell.org', is_recurring: true, community_organizations: { name: 'Pepperell Parks & Rec', org_type: 'government' } },
  { id: '4', title: 'VFW Golf Tournament Day-Of Volunteers', description: 'Help run registration, snack bar, and scoring at the Annual VFW Golf Tournament fundraiser.', category: 'Veterans', slots_available: 12, slots_filled: 4, date_needed: '2026-07-12', time_commitment: 'Full day (8 AM – 5 PM)', location: 'Country Club of New Hampshire', contact_email: 'events@pepperellvfw.org', is_recurring: false, community_organizations: { name: 'Varnum Post VFW', org_type: 'civic' } },
  { id: '5', title: 'Senior Center Meal Delivery Drivers', description: "Deliver hot meals to homebound seniors once or twice per week. Must have a valid driver's license and your own vehicle.", category: 'Senior Services', slots_available: 5, slots_filled: 3, date_needed: null, time_commitment: '2–3 hours, 1–2x/week', location: 'Pepperell Senior Center', contact_email: 'seniors@pepperell.org', is_recurring: true, community_organizations: { name: 'Pepperell Senior Center', org_type: 'government' } },
  { id: '6', title: 'Little League Field Crew – Weekend Maintenance', description: 'Help prepare and maintain Little League fields on weekend mornings before game days. Raking, lining, and general upkeep.', category: 'Youth Sports', slots_available: 10, slots_filled: 5, date_needed: null, time_commitment: '2 hours on Saturday mornings', location: 'Pepperell Little League Fields', contact_email: 'info@pepperellll.org', is_recurring: true, community_organizations: { name: 'Pepperell Little League', org_type: 'civic' } },
  { id: '7', title: 'Library Summer Reading Program Helpers', description: 'Assist with check-in, crafts, and activities during the Summer Reading Program. Great for teens and adults looking to give back.', category: 'Schools', slots_available: 5, slots_filled: 1, date_needed: '2026-06-13', time_commitment: '2 hours on event days', location: 'Pepperell Public Library', contact_email: 'library@pepperell.org', is_recurring: false, community_organizations: { name: 'Pepperell Public Library', org_type: 'library' } },
  { id: '8', title: 'Senior Bingo & Social Companions', description: 'Sit with seniors during Friday Bingo, share a meal, play cards, and provide friendly companionship. No skills required — just your time.', category: 'Senior Services', slots_available: 6, slots_filled: 2, date_needed: null, time_commitment: 'Fridays 11:30 AM – 1:30 PM', location: 'Pepperell Senior Center', contact_email: 'seniors@pepperell.org', is_recurring: true, community_organizations: { name: 'Pepperell Senior Center', org_type: 'government' } },
];

const IMPACT_STATS = [
  { label: 'Volunteers This Month', value: '127', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Hours Contributed', value: '384', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Families Served', value: '210', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Active Organizations', value: '18', icon: Building2, color: 'text-violet-600', bg: 'bg-violet-50' },
];

const ORG_SPOTLIGHTS = [
  { name: 'Greater Nashoba Valley Food Pantry', type: 'Nonprofit', need: 'Distribution volunteers Tu & Th', impact: 'Feeds 60+ families weekly', color: 'border-orange-200 bg-orange-50', icon: Utensils, iconColor: 'text-orange-600' },
  { name: 'Pepperell Senior Center', type: 'Government', need: 'Meal drivers & companions', impact: 'Serves 85 seniors per week', color: 'border-pink-200 bg-pink-50', icon: Heart, iconColor: 'text-pink-600' },
  { name: 'Varnum Post VFW', type: 'Civic Org', need: 'Event volunteers this July', impact: 'Supporting 200+ local veterans', color: 'border-blue-200 bg-blue-50', icon: Shield, iconColor: 'text-blue-600' },
];

export default function VolunteerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownDrop, setShowTownDrop] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [signedUp, setSignedUp] = useState<Set<string>>(new Set());
  const [signingUp, setSigningUp] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'opportunities' | 'organizations'>('opportunities');

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
    supabase
      .from('volunteer_opportunities')
      .select('*, community_organizations(name, org_type)')
      .eq('town_id', selectedTown.id)
      .eq('status', 'open')
      .then(({ data }) => { if (data?.length) setOpportunities(data); });
  }, [selectedTown]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('volunteer_signups')
      .select('opportunity_id')
      .eq('user_id', user.id)
      .in('status', ['signed_up', 'confirmed'])
      .then(({ data }) => {
        if (data?.length) setSignedUp(new Set(data.map(r => r.opportunity_id)));
      });
  }, [user]);

  const filtered = opportunities.filter(op => {
    const matchCat = categoryFilter === 'All' || op.category === categoryFilter;
    const matchSearch = !searchQuery || op.title.toLowerCase().includes(searchQuery.toLowerCase()) || op.description.toLowerCase().includes(searchQuery.toLowerCase()) || op.community_organizations?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSignUp = async (id: string) => {
    if (!user) { navigate('/login'); return; }
    if (signedUp.has(id)) return;
    setSigningUp(id);
    try {
      await supabase.from('volunteer_signups').insert({ opportunity_id: id, user_id: user.id, status: 'signed_up' });
      setSignedUp(prev => new Set(prev).add(id));
    } catch {
      setSignedUp(prev => new Set(prev).add(id));
    } finally {
      setSigningUp(null);
    }
  };

  const categories = Object.keys(CATEGORY_CONFIG);
  const totalSlots = filtered.reduce((a, o) => a + Math.max(0, (o.slots_available || 0) - o.slots_filled), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-700 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <button onClick={() => navigate('/community')} className="relative flex items-center gap-2 text-teal-200 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <HandHeart className="w-5 h-5 text-teal-200" />
                </div>
                <span className="text-teal-200 text-sm font-semibold uppercase tracking-wider">Volunteer Hub</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">Give Back to {selectedTown?.name || 'Your Town'}</h1>
              <p className="text-teal-100 mt-2 max-w-xl">
                Connecting government, nonprofits, schools, veterans, seniors, churches, and residents through the power of community service.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Government', 'Nonprofits', 'Schools', 'Veterans', 'Seniors', 'Faith', 'Residents'].map(type => (
                  <span key={type} className="text-xs bg-white/15 border border-white/20 px-3 py-1 rounded-full font-medium">{type}</span>
                ))}
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowTownDrop(!showTownDrop)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2.5 rounded-xl text-white font-medium transition-colors min-w-[200px]"
              >
                <MapPin className="w-4 h-4 text-teal-300" />
                {selectedTown?.name || 'Select Town'}, {selectedTown?.state}
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>
              {showTownDrop && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-64 overflow-y-auto">
                  {towns.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedTown(t); setShowTownDrop(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-slate-900 transition-colors ${selectedTown?.id === t.id ? 'bg-teal-50 text-teal-700 font-semibold' : ''}`}
                    >
                      {t.name}, {t.state}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IMPACT_STATS.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 text-center border border-white`}>
              <Icon className={`w-7 h-7 mx-auto ${color} mb-2`} />
              <div className="text-3xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 mt-1 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* View Toggle + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveView('opportunities')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeView === 'opportunities' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <HandHeart className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Opportunities ({filtered.length})
            </button>
            <button
              onClick={() => setActiveView('organizations')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeView === 'organizations' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Building2 className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Organizations
            </button>
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
            />
          </div>
        </div>

        {activeView === 'opportunities' && (
          <>
            {/* Category filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => {
                const cfg = CATEGORY_CONFIG[cat];
                const Icon = cfg.icon;
                const isActive = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md'
                        : `bg-white text-slate-600 hover:bg-slate-50 border border-slate-200`
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : cfg.color}`} />
                    {cfg.label}
                    {cat !== 'All' && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                        {opportunities.filter(o => o.category === cat).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Availability banner */}
            {totalSlots > 0 && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-800 font-medium">
                  <span className="font-bold">{totalSlots} open volunteer spots</span> in {selectedTown?.name} — your community needs you!
                </p>
              </div>
            )}

            {/* Opportunity cards */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
                <HandHeart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No opportunities found.</p>
                <p className="text-slate-400 text-sm mt-1">Try a different category or search term.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(op => {
                  const open = (op.slots_available || 0) - op.slots_filled;
                  const alreadySigned = signedUp.has(op.id);
                  const isLoading = signingUp === op.id;
                  const catCfg = CATEGORY_CONFIG[op.category || ''];
                  const orgType = op.community_organizations?.org_type;
                  const orgCfg = orgType ? ORG_TYPE_CONFIG[orgType] : null;

                  return (
                    <Card key={op.id} variant="bordered" className={`hover:shadow-lg transition-all duration-200 ${alreadySigned ? 'ring-2 ring-teal-500 ring-offset-1' : ''}`}>
                      <CardBody className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {op.category && catCfg && (
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${catCfg.bg} ${catCfg.color}`}>
                                  <catCfg.icon className="w-3 h-3" />
                                  {op.category}
                                </span>
                              )}
                              {op.is_recurring && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  <RefreshCw className="w-3 h-3" />
                                  Recurring
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-slate-900 leading-tight">{op.title}</h3>
                          </div>
                          <div className={`flex-shrink-0 text-center px-3 py-2 rounded-xl ${open > 0 ? 'bg-green-100' : 'bg-slate-100'}`}>
                            <div className={`text-lg font-bold leading-none ${open > 0 ? 'text-green-700' : 'text-slate-400'}`}>{open > 0 ? open : '—'}</div>
                            <div className={`text-xs mt-0.5 ${open > 0 ? 'text-green-600' : 'text-slate-400'}`}>{open > 0 ? 'spots' : 'full'}</div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 line-clamp-2">{op.description}</p>

                        <div className="space-y-1.5 text-xs text-slate-500">
                          {op.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                              <span className="truncate">{op.location}</span>
                            </div>
                          )}
                          {op.time_commitment && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                              {op.time_commitment}
                            </div>
                          )}
                          {op.date_needed && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                              {new Date(op.date_needed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          )}
                          {op.community_organizations && (
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                              <span className="font-medium text-slate-700 truncate">{op.community_organizations.name}</span>
                              {orgCfg && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${orgCfg.color}`}>{orgCfg.label}</span>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          disabled={(open <= 0 && !alreadySigned) || isLoading}
                          onClick={() => handleSignUp(op.id)}
                          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                            alreadySigned
                              ? 'bg-teal-50 text-teal-700 border border-teal-300 cursor-default'
                              : open > 0
                              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md active:scale-95'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          }`}
                        >
                          {alreadySigned ? (
                            <><CheckCircle className="w-4 h-4" />Signed Up!</>
                          ) : isLoading ? (
                            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing up...</>
                          ) : open > 0 ? (
                            <><HandHeart className="w-4 h-4" />Sign Up to Volunteer</>
                          ) : (
                            'Join Waitlist'
                          )}
                        </button>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeView === 'organizations' && (
          <div className="space-y-6">
            {/* Org spotlights */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                Organizations Seeking Volunteers in {selectedTown?.name}
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {ORG_SPOTLIGHTS.map(org => {
                  const Icon = org.icon;
                  return (
                    <div key={org.name} className={`rounded-2xl border-2 p-5 ${org.color}`}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <Icon className={`w-5 h-5 ${org.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{org.name}</h3>
                          <span className="text-xs text-slate-500">{org.type}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-700">
                          <HandHeart className="w-3.5 h-3.5 flex-shrink-0" />
                          <span><span className="font-semibold">Needs:</span> {org.need}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                          <span><span className="font-semibold">Impact:</span> {org.impact}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveView('opportunities'); setCategoryFilter('All'); }}
                        className="mt-3 text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
                      >
                        View opportunities <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All org types grid */}
            <div>
              <h3 className="font-bold text-slate-900 mb-4">Who Can Post Volunteer Needs?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Government',       desc: 'Towns, DPW, Police, Fire',          icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                  { label: 'Nonprofits',        desc: 'Food banks, shelters, advocacy',    icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
                  { label: 'Schools',           desc: 'K-12, libraries, tutoring',         icon: GraduationCap, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
                  { label: 'Veterans Orgs',     desc: 'VFW, American Legion',              icon: Shield, color: 'text-blue-700', bg: 'bg-indigo-50 border-indigo-200' },
                  { label: 'Faith Communities', desc: 'Churches, temples, mosques',        icon: Church, color: 'text-indigo-600', bg: 'bg-purple-50 border-purple-200' },
                  { label: 'Civic Groups',      desc: 'Little League, clubs, associations', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                ].map(({ label, desc, icon: Icon, color, bg }) => (
                  <div key={label} className={`rounded-xl border p-4 text-center ${bg}`}>
                    <Icon className={`w-7 h-7 mx-auto ${color} mb-2`} />
                    <div className="font-bold text-xs text-slate-900">{label}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-tight">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Post a volunteer need CTA */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-teal-900 text-lg">Need volunteers for your organization?</h3>
              <p className="text-sm text-teal-700 mt-1">Government agencies, nonprofits, schools, churches, and civic groups can post volunteer opportunities for free.</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/register?type=nonprofit')}
            className="whitespace-nowrap bg-teal-600 hover:bg-teal-700 flex-shrink-0"
          >
            Post a Volunteer Need
          </Button>
        </div>

        {/* My volunteer history (if signed in) */}
        {user && signedUp.size > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              My Volunteer Commitments ({signedUp.size})
            </h3>
            <div className="space-y-2">
              {opportunities.filter(op => signedUp.has(op.id)).map(op => (
                <div key={op.id} className="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{op.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{op.community_organizations?.name} · {op.time_commitment || 'Flexible'}</p>
                  </div>
                  <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Signed Up
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
