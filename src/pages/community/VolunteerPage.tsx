import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HandHeart, MapPin, Calendar, Building2, ChevronDown,
  Users, Clock, ArrowLeft, CheckCircle,
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
  community_organizations?: { name: string } | null;
}

interface Town { id: string; name: string; state: string }

const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: '1', title: 'Food Pantry Distribution Volunteers', description: 'Help sort and distribute food to families in need every Tuesday and Thursday. No experience required – just a warm heart and willingness to help.', category: 'Food Bank', slots_available: 8, slots_filled: 3, date_needed: '2026-06-10', time_commitment: '3 hours/week', location: '5 Mill St, Pepperell', contact_email: 'volunteer@nashobafoodpantry.org', is_recurring: true, community_organizations: { name: 'Greater Nashoba Valley Food Pantry' } },
  { id: '2', title: 'Dog Walkers Needed – Animal Shelter', description: 'Walk and socialize dogs awaiting adoption. Morning and afternoon shifts available 7 days a week.', category: 'Animal Care', slots_available: 4, slots_filled: 1, date_needed: '2026-06-08', time_commitment: '1–2 hours, flexible', location: 'Pepperell Animal Shelter', contact_email: 'shelter@pepperell.org', is_recurring: true, community_organizations: { name: 'Pepperell Animal Shelter' } },
  { id: '3', title: 'Community Garden Helpers', description: 'Help maintain the community garden – weeding, watering, and harvesting produce donated to the food pantry.', category: 'Gardening', slots_available: 6, slots_filled: 2, date_needed: '2026-06-15', time_commitment: 'Weekend mornings', location: 'Pepperell Community Garden', contact_email: 'garden@pepperell.org', is_recurring: true, community_organizations: { name: 'Pepperell Parks & Rec' } },
  { id: '4', title: 'VFW Golf Tournament Day-Of Volunteers', description: 'Help run registration, snack bar, and scoring at the Annual VFW Golf Tournament fundraiser.', category: 'Events', slots_available: 12, slots_filled: 4, date_needed: '2026-07-12', time_commitment: 'Full day (8 AM – 5 PM)', location: 'Country Club of New Hampshire', contact_email: 'events@pepperellvfw.org', is_recurring: false, community_organizations: { name: 'Varnum Post VFW' } },
  { id: '5', title: 'Senior Center Meal Delivery Drivers', description: 'Deliver hot meals to homebound seniors once or twice per week. Must have a valid driver\'s license and your own vehicle.', category: 'Senior Services', slots_available: 5, slots_filled: 3, date_needed: null, time_commitment: '2–3 hours, 1–2x/week', location: 'Pepperell Senior Center', contact_email: 'seniors@pepperell.org', is_recurring: true, community_organizations: { name: 'Pepperell Senior Center' } },
  { id: '6', title: 'Little League Field Crew – Weekend Maintenance', description: 'Help prepare and maintain Little League fields on weekend mornings before game days. Raking, lining, and general upkeep.', category: 'Youth Sports', slots_available: 10, slots_filled: 5, date_needed: null, time_commitment: '2 hours on Saturday mornings', location: 'Pepperell Little League Fields', contact_email: 'info@pepperellll.org', is_recurring: true, community_organizations: { name: 'Pepperell Little League' } },
];

const CATEGORY_FILTERS = ['All', 'Food Bank', 'Animal Care', 'Senior Services', 'Youth Sports', 'Gardening', 'Events'];

export default function VolunteerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownDrop, setShowTownDrop] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [signedUp, setSignedUp] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.from('community_towns').select('id,name,state').eq('is_active', true).order('name').then(({ data }) => {
      if (data?.length) { setTowns(data); setSelectedTown(data.find((t: Town) => t.name === 'Pepperell') || data[0]); }
    });
  }, []);

  useEffect(() => {
    if (!selectedTown) return;
    supabase.from('volunteer_opportunities').select('*, community_organizations(name)').eq('town_id', selectedTown.id).eq('status', 'open').then(({ data }) => { if (data?.length) setOpportunities(data); });
  }, [selectedTown]);

  const filtered = opportunities.filter(op => categoryFilter === 'All' || op.category === categoryFilter);

  const handleSignUp = (id: string) => {
    if (!user) { navigate('/login'); return; }
    setSignedUp(prev => new Set(prev).add(id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-teal-900 to-teal-600 rounded-2xl p-8 text-white">
          <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-teal-200 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HandHeart className="w-6 h-6 text-teal-300" />
                <span className="text-teal-200 text-sm font-semibold uppercase tracking-wider">Volunteer Hub</span>
              </div>
              <h1 className="text-3xl font-bold">Give Back to {selectedTown?.name || 'Your Town'}</h1>
              <p className="text-teal-100 mt-1">{filtered.length} volunteer opportunities available</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowTownDrop(!showTownDrop)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2.5 rounded-xl text-white font-medium transition-colors">
                <MapPin className="w-4 h-4 text-teal-300" />{selectedTown?.name || 'Select Town'}, {selectedTown?.state}<ChevronDown className="w-4 h-4" />
              </button>
              {showTownDrop && (
                <div className="absolute top-full mt-2 right-0 w-60 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto">
                  {towns.map(t => <button key={t.id} onClick={() => { setSelectedTown(t); setShowTownDrop(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-900 hover:bg-slate-50">{t.name}, {t.state}</button>)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_FILTERS.map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${categoryFilter === cat ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Open Opportunities', value: filtered.length, icon: HandHeart },
            { label: 'Total Slots Available', value: filtered.reduce((a, o) => a + ((o.slots_available || 0) - o.slots_filled), 0), icon: Users },
            { label: 'Organizations', value: new Set(filtered.map(o => o.community_organizations?.name)).size, icon: Building2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <Icon className="w-6 h-6 mx-auto text-teal-600 mb-2" />
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(op => {
            const open = (op.slots_available || 0) - op.slots_filled;
            const alreadySigned = signedUp.has(op.id);
            return (
              <Card key={op.id} variant="bordered" className="hover:shadow-lg transition-shadow">
                <CardBody className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {op.category && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">{op.category}</span>
                        )}
                        {op.is_recurring && (
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Recurring</span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 leading-tight">{op.title}</h3>
                    </div>
                    <div className={`flex-shrink-0 text-center px-3 py-1.5 rounded-xl ${open > 0 ? 'bg-green-100' : 'bg-slate-100'}`}>
                      <div className={`text-lg font-bold ${open > 0 ? 'text-green-700' : 'text-slate-500'}`}>{open}</div>
                      <div className={`text-xs ${open > 0 ? 'text-green-600' : 'text-slate-400'}`}>spots</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{op.description}</p>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs text-slate-500">
                    {op.location && <div className="flex items-center gap-1.5 col-span-2"><MapPin className="w-3.5 h-3.5 flex-shrink-0" />{op.location}</div>}
                    {op.time_commitment && <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 flex-shrink-0" />{op.time_commitment}</div>}
                    {op.date_needed && <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 flex-shrink-0" />{new Date(op.date_needed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>}
                    {op.community_organizations && <div className="flex items-center gap-1.5 col-span-2 font-medium text-slate-600"><Building2 className="w-3.5 h-3.5 flex-shrink-0" />{op.community_organizations.name}</div>}
                  </div>
                  <Button
                    size="sm"
                    className={`w-full ${alreadySigned ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    disabled={open <= 0 && !alreadySigned}
                    onClick={() => handleSignUp(op.id)}
                  >
                    {alreadySigned ? (
                      <><CheckCircle className="w-4 h-4 mr-2" />Signed Up!</>
                    ) : open > 0 ? (
                      'Sign Up to Volunteer'
                    ) : (
                      'Join Waitlist'
                    )}
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <HandHeart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No volunteer opportunities found in this category.</p>
          </div>
        )}

        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-teal-900">Need volunteers for your organization?</h3>
            <p className="text-sm text-teal-700 mt-1">Post volunteer opportunities for free and connect with community members ready to help.</p>
          </div>
          <Button onClick={() => navigate('/register?type=nonprofit')} className="whitespace-nowrap bg-teal-600 hover:bg-teal-700">
            Post a Volunteer Need
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
