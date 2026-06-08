import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Heart, Shield, MapPin, ChevronDown, ArrowLeft,
  Phone, ExternalLink, Clock, Users, Building2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';

interface Town { id: string; name: string; state: string }

const RESOURCE_SECTIONS = [
  {
    id: 'seniors',
    label: 'Senior Services',
    icon: Heart,
    color: 'from-pink-600 to-rose-500',
    accent: 'text-pink-700',
    bg: 'bg-pink-50 border-pink-200',
    resources: [
      { name: 'Pepperell Senior Center', desc: 'Programs, meals, activities, and services for residents 60+', phone: '978-433-0338', hours: 'Mon–Fri 8 AM–4 PM', address: '1 Hollis St, Pepperell' },
      { name: 'Council on Aging', desc: 'Assistance with benefits, transportation, and home services', phone: '978-433-0339', hours: 'Mon–Fri 9 AM–3 PM', address: '1 Hollis St, Pepperell' },
      { name: 'SHINE (Health Insurance)', desc: 'Free Medicare/Medicaid counseling for seniors', phone: '800-243-4636', hours: 'By appointment', address: 'Pepperell Senior Center' },
    ],
  },
  {
    id: 'veterans',
    label: 'Veteran Services',
    icon: Shield,
    color: 'from-indigo-600 to-blue-600',
    accent: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200',
    resources: [
      { name: 'Pepperell Veterans Services', desc: 'Benefits assistance, chapter 115 aid, and veteran referrals', phone: '978-433-0335', hours: 'Mon & Thu 9 AM–12 PM', address: 'Pepperell Town Hall' },
      { name: 'Varnum Post VFW', desc: 'Community support, social events, and veteran advocacy', phone: '978-433-0360', hours: 'Call for hours', address: '8 Canal St, Pepperell' },
      { name: 'Soldier On Housing', desc: 'Housing and supportive services for homeless veterans', phone: '413-733-8878', hours: 'Mon–Fri 9 AM–5 PM', address: null },
    ],
  },
  {
    id: 'library',
    label: 'Library & Learning',
    icon: BookOpen,
    color: 'from-emerald-600 to-green-500',
    accent: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    resources: [
      { name: 'Pepperell Public Library', desc: 'Books, e-resources, story time, computer access, and community programs', phone: '978-433-0330', hours: 'Mon–Thu 9–8, Fri–Sat 9–5', address: '4 Main St, Pepperell' },
      { name: 'Adult Literacy Program', desc: 'Free GED prep, ESL classes, and basic skills tutoring', phone: '978-433-0330', hours: 'By appointment', address: 'Pepperell Public Library' },
      { name: 'Minuteman Library Network', desc: 'Borrow from hundreds of libraries across Greater Boston', phone: null, hours: null, address: null },
    ],
  },
  {
    id: 'health',
    label: 'Health & Wellness',
    icon: Heart,
    color: 'from-red-600 to-rose-600',
    accent: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    resources: [
      { name: 'Board of Health', desc: 'Environmental health, food safety, and public health programs', phone: '978-433-0332', hours: 'Mon–Fri 8 AM–4 PM', address: 'Pepperell Town Hall' },
      { name: 'Greater Nashoba Food Pantry', desc: 'Free food assistance – no paperwork required', phone: '978-433-0350', hours: 'Tue 4–6 PM, Thu 9 AM–12 PM', address: '5 Mill St, Pepperell' },
      { name: 'Open Sky Community Services', desc: 'Behavioral health and wellness services for all ages', phone: '508-755-5000', hours: 'Mon–Fri 9 AM–5 PM', address: null },
    ],
  },
];

export default function CommunityResourcesPage() {
  const navigate = useNavigate();
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownDrop, setShowTownDrop] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('community_towns').select('id,name,state').eq('is_active', true).order('name').then(({ data }) => {
      if (data?.length) { setTowns(data); setSelectedTown(data.find((t: Town) => t.name === 'Pepperell') || data[0]); }
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 text-white">
          <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-slate-300 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-6 h-6 text-slate-300" />
                <span className="text-slate-300 text-sm font-semibold uppercase tracking-wider">Community Resources</span>
              </div>
              <h1 className="text-3xl font-bold">Local Resources for {selectedTown?.name}</h1>
              <p className="text-slate-300 mt-1">Seniors · Veterans · Library · Health · Local Services</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowTownDrop(!showTownDrop)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2.5 rounded-xl text-white font-medium transition-colors">
                <MapPin className="w-4 h-4 text-slate-300" />{selectedTown?.name || 'Select Town'}, {selectedTown?.state}<ChevronDown className="w-4 h-4" />
              </button>
              {showTownDrop && (
                <div className="absolute top-full mt-2 right-0 w-60 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto">
                  {towns.map(t => <button key={t.id} onClick={() => { setSelectedTown(t); setShowTownDrop(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-900 hover:bg-slate-50">{t.name}, {t.state}</button>)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick nav tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {RESOURCE_SECTIONS.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  activeSection === section.id
                    ? `bg-gradient-to-br ${section.color} text-white border-transparent shadow-lg`
                    : `bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-900`
                }`}
              >
                <Icon className={`w-8 h-8 mb-2 ${activeSection === section.id ? 'text-white/80' : 'text-slate-400'}`} />
                <div className="font-bold text-sm">{section.label}</div>
                <div className={`text-xs mt-0.5 ${activeSection === section.id ? 'text-white/70' : 'text-slate-500'}`}>
                  {section.resources.length} resources
                </div>
              </button>
            );
          })}
        </div>

        {/* Resource listings */}
        {RESOURCE_SECTIONS.filter(s => !activeSection || s.id === activeSection).map(section => {
          const Icon = section.icon;
          return (
            <div key={section.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{section.label}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.resources.map(res => (
                  <Card key={res.name} variant="bordered" className="hover:shadow-md transition-shadow">
                    <CardBody className="space-y-3">
                      <div>
                        <h3 className="font-bold text-slate-900">{res.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{res.desc}</p>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-500">
                        {res.hours && <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{res.hours}</div>}
                        {res.address && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{res.address}</div>}
                      </div>
                      {res.phone && (
                        <a href={`tel:${res.phone.replace(/[^0-9]/g, '')}`} className={`flex items-center gap-1.5 text-sm font-semibold ${section.accent} hover:underline`}>
                          <Phone className="w-3.5 h-3.5" />{res.phone}
                        </a>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
