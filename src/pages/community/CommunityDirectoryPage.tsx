import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Search, Building2, Heart, GraduationCap, Shield,
  Users, Church, Star, HandHeart, AlertTriangle, Phone,
  ExternalLink, ArrowLeft, ChevronDown, CheckCircle, Globe,
  Zap, BookOpen, TreePine, Baby,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Town { id: string; name: string; state: string }

interface DirectoryEntry {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  is_verified?: boolean;
  tags?: string[];
}

const CATEGORY_CONFIG = [
  { id: 'all',            label: 'All Listings',        icon: Building2,    color: 'text-slate-600',    bg: 'bg-slate-50',   border: 'border-slate-200',   active: 'bg-slate-700 text-white' },
  { id: 'businesses',     label: 'Businesses',          icon: Star,         color: 'text-amber-600',    bg: 'bg-amber-50',   border: 'border-amber-200',   active: 'bg-amber-600 text-white' },
  { id: 'nonprofits',     label: 'Nonprofits',          icon: Heart,        color: 'text-rose-600',     bg: 'bg-rose-50',    border: 'border-rose-200',    active: 'bg-rose-600 text-white' },
  { id: 'schools',        label: 'Schools',             icon: GraduationCap,color: 'text-violet-600',   bg: 'bg-violet-50',  border: 'border-violet-200',  active: 'bg-violet-600 text-white' },
  { id: 'government',     label: 'Town Departments',    icon: Building2,    color: 'text-blue-600',     bg: 'bg-blue-50',    border: 'border-blue-200',    active: 'bg-blue-700 text-white' },
  { id: 'veterans',       label: 'Veteran Services',    icon: Shield,       color: 'text-indigo-600',   bg: 'bg-indigo-50',  border: 'border-indigo-200',  active: 'bg-indigo-700 text-white' },
  { id: 'seniors',        label: 'Senior Services',     icon: Heart,        color: 'text-pink-600',     bg: 'bg-pink-50',    border: 'border-pink-200',    active: 'bg-pink-600 text-white' },
  { id: 'faith',          label: 'Churches & Faith',    icon: Church,       color: 'text-purple-600',   bg: 'bg-purple-50',  border: 'border-purple-200',  active: 'bg-purple-700 text-white' },
  { id: 'sports',         label: 'Sports & Recreation', icon: TreePine,     color: 'text-green-600',    bg: 'bg-green-50',   border: 'border-green-200',   active: 'bg-green-600 text-white' },
  { id: 'community',      label: 'Community Groups',    icon: Users,        color: 'text-teal-600',     bg: 'bg-teal-50',    border: 'border-teal-200',    active: 'bg-teal-600 text-white' },
  { id: 'youth',          label: 'Youth & Family',      icon: Baby,         color: 'text-cyan-600',     bg: 'bg-cyan-50',    border: 'border-cyan-200',    active: 'bg-cyan-600 text-white' },
  { id: 'library',        label: 'Libraries & Learning',icon: BookOpen,     color: 'text-emerald-600',  bg: 'bg-emerald-50', border: 'border-emerald-200', active: 'bg-emerald-600 text-white' },
  { id: 'emergency',      label: 'Emergency Resources', icon: Zap,          color: 'text-red-600',      bg: 'bg-red-50',     border: 'border-red-200',     active: 'bg-red-600 text-white' },
];

const MOCK_DIRECTORY: DirectoryEntry[] = [
  // Government
  { id: 'g1', name: 'Town of Pepperell – Town Hall', category: 'government', subcategory: 'Municipal Government', description: 'Town Administrator, Board of Selectmen, Town Clerk, and general municipal services.', address: '1 Main St, Pepperell, MA 01463', phone: '978-433-0333', website: 'pepperell.ma.us', hours: 'Mon–Fri 8 AM–4 PM', is_verified: true, tags: ['Town Hall', 'Permits', 'Voting'] },
  { id: 'g2', name: 'Pepperell Department of Public Works', category: 'government', subcategory: 'Public Works', description: 'Road maintenance, trash & recycling, water & sewer, parks upkeep.', address: '26 Canal St, Pepperell, MA', phone: '978-433-0340', hours: 'Mon–Fri 7 AM–3:30 PM', is_verified: true, tags: ['Roads', 'Trash', 'Water'] },
  { id: 'g3', name: 'Pepperell Police Department', category: 'government', subcategory: 'Public Safety', description: 'Local law enforcement, community policing, accident reports, and public safety.', address: '11 Main St, Pepperell, MA', phone: '978-433-2121', hours: '24/7', is_verified: true, tags: ['Emergency', 'Public Safety'] },
  { id: 'g4', name: 'Pepperell Fire Department', category: 'government', subcategory: 'Public Safety', description: 'Fire suppression, emergency medical services, fire safety inspections.', address: '15 Mill St, Pepperell, MA', phone: '978-433-2126', hours: '24/7', is_verified: true, tags: ['Emergency', 'EMS'] },
  { id: 'g5', name: 'Pepperell Board of Health', category: 'government', subcategory: 'Health', description: 'Public health programs, septic permits, food safety inspections, and environmental health.', address: '1 Main St, Pepperell, MA', phone: '978-433-0332', hours: 'Mon–Fri 8 AM–4 PM', is_verified: true, tags: ['Health', 'Permits'] },
  // Nonprofits
  { id: 'n1', name: 'Greater Nashoba Valley Food Pantry', category: 'nonprofits', subcategory: 'Food Assistance', description: 'Free food assistance for families in need. No paperwork, no judgment. Open Tuesdays and Thursdays.', address: '5 Mill St, Pepperell, MA', phone: '978-433-0350', hours: 'Tue 4–6 PM, Thu 9 AM–12 PM', is_verified: true, tags: ['Food', 'Free', 'Assistance'] },
  { id: 'n2', name: 'Pepperell Animal Shelter', category: 'nonprofits', subcategory: 'Animal Services', description: 'Animal adoption, lost & found pets, low-cost spay/neuter programs.', address: '11 Canal St, Pepperell, MA', phone: '978-433-0337', hours: 'Wed–Fri 12–5 PM, Sat 10 AM–2 PM', is_verified: true, tags: ['Pets', 'Adoption', 'Animals'] },
  { id: 'n3', name: 'Open Sky Community Services', category: 'nonprofits', subcategory: 'Mental Health', description: 'Behavioral health, mental health counseling, and disability services for all ages.', phone: '508-755-5000', website: 'opensky.org', hours: 'Mon–Fri 9 AM–5 PM', is_verified: true, tags: ['Mental Health', 'Counseling', 'Disability'] },
  // Schools
  { id: 's1', name: 'NMRSD – North Middlesex Regional School District', category: 'schools', subcategory: 'K-12 Schools', description: 'Public school district serving Pepperell, Townsend, and Ashby. Grades K-12.', address: '78 Townsend St, Pepperell, MA', phone: '978-433-0484', website: 'nmrsd.org', hours: 'Mon–Fri 7:30 AM–4 PM', is_verified: true, tags: ['Public School', 'K-12', 'Education'] },
  { id: 's2', name: 'Pepperell Public Library', category: 'library', subcategory: 'Public Library', description: 'Books, e-resources, digital downloads, story time, computer access, and community programs for all ages.', address: '4 Main St, Pepperell, MA', phone: '978-433-0330', website: 'pepperelllibrary.org', hours: 'Mon–Thu 9–8, Fri–Sat 9–5', is_verified: true, tags: ['Books', 'Programs', 'Learning'] },
  // Veterans
  { id: 'v1', name: 'Varnum Post VFW', category: 'veterans', subcategory: 'Veterans Service Organization', description: 'Advocacy, community service, and support for veterans and their families. Monthly meetings and events.', address: '8 Canal St, Pepperell, MA', phone: '978-433-0360', hours: 'Call for hours', is_verified: true, tags: ['VFW', 'Veterans', 'Community'] },
  { id: 'v2', name: 'Pepperell Veterans Services Office', category: 'veterans', subcategory: 'Government Veterans Services', description: 'Chapter 115 benefits, VA claim assistance, veteran referrals, and emergency aid.', address: '1 Main St, Pepperell, MA', phone: '978-433-0335', hours: 'Mon & Thu 9 AM–12 PM', is_verified: true, tags: ['Benefits', 'VA', 'Assistance'] },
  // Seniors
  { id: 'sr1', name: 'Pepperell Senior Center', category: 'seniors', subcategory: 'Senior Center', description: 'Programs, activities, meals, transportation, and social services for residents 60+.', address: '1 Hollis St, Pepperell, MA', phone: '978-433-0338', hours: 'Mon–Fri 8 AM–4 PM', is_verified: true, tags: ['60+', 'Programs', 'Meals', 'Transport'] },
  { id: 'sr2', name: 'Council on Aging', category: 'seniors', subcategory: 'Government Agency', description: 'Benefits counseling, home care referrals, transportation assistance, and senior advocacy.', address: '1 Hollis St, Pepperell, MA', phone: '978-433-0339', hours: 'Mon–Fri 9 AM–3 PM', is_verified: true, tags: ['Benefits', 'Advocacy', 'Home Care'] },
  // Faith
  { id: 'f1', name: 'Pepperell Congregational Church', category: 'faith', subcategory: 'Protestant', description: 'Sunday worship, community outreach, food pantry support, and youth programs.', address: '2 Main St, Pepperell, MA', phone: '978-433-0289', hours: 'Sun 10 AM worship', is_verified: false, tags: ['Church', 'Worship', 'Community'] },
  { id: 'f2', name: 'St. Joseph Parish', category: 'faith', subcategory: 'Catholic', description: 'Catholic parish offering Mass, sacraments, religious education, and charitable outreach.', address: '10 High St, Pepperell, MA', phone: '978-433-0212', hours: 'Mass Sat 4 PM, Sun 8 AM & 10 AM', is_verified: false, tags: ['Catholic', 'Mass', 'Education'] },
  // Sports & Recreation
  { id: 'sp1', name: 'Pepperell Little League', category: 'sports', subcategory: 'Youth Baseball', description: 'Youth baseball and softball for ages 4–16. Registration open each spring.', address: 'Pepperell Little League Fields', phone: '978-433-0201', website: 'pepperellll.org', hours: 'Spring/Summer season', is_verified: true, tags: ['Baseball', 'Youth', 'Sports'] },
  { id: 'sp2', name: 'Pepperell Parks & Recreation', category: 'sports', subcategory: 'Municipal Parks', description: 'Town parks, athletic fields, summer programs, and recreation facilities.', address: '1 Main St, Pepperell, MA', phone: '978-433-0334', hours: 'Seasonal hours vary', is_verified: true, tags: ['Parks', 'Sports', 'Summer Programs'] },
  // Community Groups
  { id: 'c1', name: 'Pepperell Garden Club', category: 'community', subcategory: 'Civic Organization', description: 'Gardening education, community beautification projects, and the annual plant sale.', phone: '978-433-0401', hours: 'Monthly meetings', is_verified: false, tags: ['Gardening', 'Community', 'Beautification'] },
  { id: 'c2', name: 'Friends of Pepperell Library', category: 'community', subcategory: 'Library Support', description: 'Volunteer organization supporting the library through fundraising, book sales, and programs.', address: '4 Main St, Pepperell, MA', hours: 'Monthly meetings', is_verified: false, tags: ['Library', 'Volunteers', 'Books'] },
  // Youth & Family
  { id: 'y1', name: 'Pepperell PTA', category: 'youth', subcategory: 'Parent Organization', description: 'Parent-Teacher Association supporting NMRSD schools through events, fundraising, and advocacy.', website: 'nmrsdpta.org', hours: 'Monthly meetings', is_verified: true, tags: ['School', 'Parents', 'Advocacy'] },
  // Emergency
  { id: 'e1', name: 'FEMA Region 1', category: 'emergency', subcategory: 'Federal Emergency', description: 'Federal disaster assistance, flood insurance, emergency preparedness resources for New England.', phone: '800-621-3362', website: 'fema.gov', hours: '24/7 hotline', is_verified: true, tags: ['FEMA', 'Disaster', 'Flood Insurance'] },
  { id: 'e2', name: 'American Red Cross – Greater Boston', category: 'emergency', subcategory: 'Disaster Relief', description: 'Disaster relief, blood drives, CPR training, and emergency shelter for local residents.', phone: '617-375-0700', website: 'redcross.org', hours: '24/7', is_verified: true, tags: ['Disaster', 'Blood', 'CPR', 'Shelter'] },
];

export default function CommunityDirectoryPage() {
  const navigate = useNavigate();
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownDrop, setShowTownDrop] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dbOrgs, setDbOrgs] = useState<DirectoryEntry[]>([]);

  useEffect(() => {
    supabase.from('community_towns').select('id,name,state').eq('is_active', true).order('name').then(({ data }) => {
      if (data?.length) { setTowns(data); setSelectedTown(data.find((t: Town) => t.name === 'Pepperell') || data[0]); }
    });
  }, []);

  useEffect(() => {
    if (!selectedTown) return;
    supabase
      .from('community_organizations')
      .select('id, name, org_type, description, is_verified')
      .eq('town_id', selectedTown.id)
      .then(({ data }) => {
        if (data?.length) {
          const mapped: DirectoryEntry[] = data.map(o => ({
            id: o.id,
            name: o.name,
            category: orgTypeToCategory(o.org_type),
            description: o.description || '',
            is_verified: o.is_verified,
          }));
          setDbOrgs(mapped);
        }
      });
  }, [selectedTown]);

  const orgTypeToCategory = (type: string): string => {
    const map: Record<string, string> = {
      government: 'government', nonprofit: 'nonprofits', school: 'schools',
      library: 'library', religious: 'faith', civic: 'community',
    };
    return map[type] || 'community';
  };

  const allEntries = dbOrgs.length > 0 ? dbOrgs : MOCK_DIRECTORY;

  const filtered = allEntries.filter(entry => {
    const matchCat = activeCategory === 'all' || entry.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      entry.name.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      entry.subcategory?.toLowerCase().includes(q) ||
      entry.tags?.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const catCfg = CATEGORY_CONFIG.find(c => c.id === activeCategory) || CATEGORY_CONFIG[0];

  const counts = CATEGORY_CONFIG.reduce<Record<string, number>>((acc, cat) => {
    if (cat.id === 'all') acc[cat.id] = allEntries.length;
    else acc[cat.id] = allEntries.filter(e => e.category === cat.id).length;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <button onClick={() => navigate('/community')} className="relative flex items-center gap-2 text-slate-400 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-slate-300" />
                </div>
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Community Directory</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                The {selectedTown?.name || 'Local'} Yellow Pages
              </h1>
              <p className="text-slate-300 mt-2 max-w-xl">
                Your complete guide to every organization, service, and resource in {selectedTown?.name || 'your town'} — businesses, nonprofits, schools, government, faith communities, and more.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-white">{allEntries.length}</span>
                  <span className="text-slate-400">listings</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">{allEntries.filter(e => e.is_verified).length}</span>
                  <span className="text-slate-400">verified</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowTownDrop(!showTownDrop)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl text-white font-medium transition-colors min-w-[200px]"
              >
                <MapPin className="w-4 h-4 text-slate-400" />
                {selectedTown?.name || 'Select Town'}, {selectedTown?.state}
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>
              {showTownDrop && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-64 overflow-y-auto">
                  {towns.map(t => (
                    <button key={t.id} onClick={() => { setSelectedTown(t); setShowTownDrop(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-slate-900 transition-colors ${selectedTown?.id === t.id ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}>
                      {t.name}, {t.state}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-6 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search organizations, services, departments..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all text-sm"
            />
          </div>
        </div>

        {/* Category tiles */}
        <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-2">
          {CATEGORY_CONFIG.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = counts[cat.id] || 0;
            if (count === 0 && cat.id !== 'all') return null;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                  isActive
                    ? `${cat.active} border-transparent shadow-md`
                    : `bg-white ${cat.border} hover:shadow-sm text-slate-700 hover:bg-slate-50`
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : cat.color}`} />
                <span className="text-xs font-semibold leading-tight">{cat.label}</span>
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${catCfg.bg}`}>
              <catCfg.icon className={`w-5 h-5 ${catCfg.color}`} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">{catCfg.label}</h2>
              <p className="text-sm text-slate-500">{filtered.length} {filtered.length === 1 ? 'listing' : 'listings'} in {selectedTown?.name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/register')}>
            + Add Your Organization
          </Button>
        </div>

        {/* Directory listings */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <MapPin className="w-14 h-14 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No listings found.</p>
            <p className="text-slate-400 text-sm mt-1">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(entry => {
              const cfg = CATEGORY_CONFIG.find(c => c.id === entry.category) || CATEGORY_CONFIG[0];
              const Icon = cfg.icon;
              return (
                <Card key={entry.id} variant="bordered" className="hover:shadow-lg transition-all duration-200 group">
                  <CardBody className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                          <Icon className={`w-5 h-5 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">{entry.name}</h3>
                            {entry.is_verified && (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" title="Verified" />
                            )}
                          </div>
                          {entry.subcategory && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{entry.subcategory}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">{entry.description}</p>

                    <div className="space-y-1.5 text-xs text-slate-500">
                      {entry.address && (
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
                          <span>{entry.address}</span>
                        </div>
                      )}
                      {entry.hours && (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                          <span>{entry.hours}</span>
                        </div>
                      )}
                    </div>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      {entry.phone && (
                        <a
                          href={`tel:${entry.phone.replace(/[^0-9]/g, '')}`}
                          className={`flex items-center gap-1.5 text-xs font-semibold ${cfg.color} hover:underline`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {entry.phone}
                        </a>
                      )}
                      {entry.website && (
                        <a
                          href={entry.website.startsWith('http') ? entry.website : `https://${entry.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 hover:underline ml-auto"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* Get listed CTA */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Is your organization missing from the directory?</h3>
            <p className="text-sm text-slate-600 mt-1">Nonprofits, government agencies, churches, civic groups, and businesses can all get listed for free.</p>
          </div>
          <Button onClick={() => navigate('/register')} className="whitespace-nowrap flex-shrink-0">
            Get Listed Free
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
