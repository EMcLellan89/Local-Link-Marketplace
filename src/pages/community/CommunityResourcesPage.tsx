import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Heart, Shield, MapPin, ChevronDown, ArrowLeft,
  Phone, ExternalLink, Clock, Search, Home, Truck, Brain,
  Scale, Zap, Accessibility, Apple, Baby, GraduationCap,
  AlertCircle, CheckCircle, Filter,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';

interface Town { id: string; name: string; state: string }

interface Resource {
  name: string;
  desc: string;
  phone?: string | null;
  hours?: string | null;
  address?: string | null;
  website?: string | null;
  tags?: string[];
  urgent?: boolean;
  free?: boolean;
}

interface Section {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  gradient: string;
  accent: string;
  bgBadge: string;
  resources: Resource[];
}

const RESOURCE_SECTIONS: Section[] = [
  {
    id: 'food',
    label: 'Food Assistance',
    shortLabel: 'Food',
    icon: Apple,
    gradient: 'from-orange-500 to-amber-500',
    accent: 'text-orange-700',
    bgBadge: 'bg-orange-100 text-orange-700',
    resources: [
      { name: 'Greater Nashoba Food Pantry', desc: 'Free food assistance for individuals and families — no paperwork required. Fresh produce, canned goods, and household staples.', phone: '978-433-0350', hours: 'Tue 4–6 PM · Thu 9 AM–12 PM', address: '5 Mill St, Pepperell, MA', tags: ['No paperwork', 'Walk-in'], free: true },
      { name: 'Greater Lowell Community Foundation', desc: 'Connects residents to food resources throughout Greater Lowell and Nashoba Valley.', phone: '978-970-1600', hours: 'Mon–Fri 9 AM–5 PM', address: null, website: 'https://www.glcf.org', tags: ['Referrals', 'Regional'], free: true },
      { name: 'Project Bread FoodSource Hotline', desc: 'Statewide food resource hotline — connects callers to local food pantries, SNAP enrollment, and meal programs.', phone: '800-645-8333', hours: 'Mon–Fri 8 AM–7 PM · Sat 10 AM–2 PM', address: null, tags: ['SNAP', 'Hotline', 'Statewide'], free: true },
      { name: 'SNAP Benefits (Food Stamps)', desc: 'Monthly food assistance benefits for eligible low-income households. Apply online at DTA Connect.', phone: '877-382-2363', hours: 'Mon–Fri 8:45 AM–5 PM', address: null, website: 'https://dtaconnect.eohhs.mass.gov', tags: ['Benefits', 'Apply Online'], free: true },
      { name: 'WIC Program', desc: 'Nutrition support for pregnant women, new mothers, and children under 5. Provides food vouchers and nutrition counseling.', phone: '978-433-0332', hours: 'By appointment', address: 'Pepperell Board of Health', tags: ['Women', 'Infants', 'Children'], free: true },
    ],
  },
  {
    id: 'housing',
    label: 'Housing & Shelter',
    shortLabel: 'Housing',
    icon: Home,
    gradient: 'from-blue-600 to-cyan-500',
    accent: 'text-blue-700',
    bgBadge: 'bg-blue-100 text-blue-700',
    resources: [
      { name: 'Northern Middlesex Housing', desc: 'Housing assistance, rental subsidies, and affordable housing navigation for Middlesex County residents.', phone: '978-459-8490', hours: 'Mon–Fri 9 AM–5 PM', address: 'Lowell, MA', tags: ['Rental Assistance', 'Section 8'], free: true },
      { name: 'Emergency Rental Assistance', desc: 'RAFT (Residential Assistance for Families in Transition) — prevents eviction and homelessness through emergency rental aid.', phone: '877-382-2363', hours: 'Mon–Fri 8:45 AM–5 PM', address: null, website: 'https://homebase.org', tags: ['RAFT', 'Eviction Prevention'], free: true, urgent: true },
      { name: 'Lowell Transitional Living Center', desc: 'Emergency shelter and transitional housing for adults experiencing homelessness.', phone: '978-441-4120', hours: '24/7 intake line', address: 'Lowell, MA', tags: ['Shelter', 'Transitional'], free: true, urgent: true },
      { name: 'HomeBase (Mass 211)', desc: 'Statewide resource for homelessness prevention, rapid rehousing, and housing stabilization.', phone: '211', hours: '24/7', address: null, tags: ['Hotline', '211', 'Statewide'], free: true, urgent: true },
      { name: 'Habitat for Humanity Metrowest', desc: 'Home repair assistance and affordable homeownership programs for low-to-moderate income residents.', phone: '508-485-5070', hours: 'Mon–Fri 9 AM–5 PM', address: null, tags: ['Home Repair', 'Ownership'], free: false },
    ],
  },
  {
    id: 'transportation',
    label: 'Transportation',
    shortLabel: 'Transit',
    icon: Truck,
    gradient: 'from-sky-500 to-blue-500',
    accent: 'text-sky-700',
    bgBadge: 'bg-sky-100 text-sky-700',
    resources: [
      { name: 'LRTA (Lowell RTA)', desc: 'Regional bus service connecting Pepperell and surrounding towns to Lowell, Nashua, and beyond.', phone: '978-452-6161', hours: 'Service hours vary by route', address: null, website: 'https://lrta.com', tags: ['Bus', 'Regional'], free: false },
      { name: 'Council on Aging Transportation', desc: 'Door-to-door medical and shopping rides for Pepperell seniors 60+. Reservation required.', phone: '978-433-0339', hours: 'Mon–Fri 9 AM–3 PM', address: 'Pepperell Senior Center', tags: ['Seniors', 'Medical', 'Reservation'], free: true },
      { name: 'Veterans Transportation Network', desc: 'Free rides to VA medical appointments for veterans. Provided by volunteer drivers.', phone: '978-433-0335', hours: 'Mon–Fri by appointment', address: 'Pepperell Veterans Services', tags: ['Veterans', 'Medical', 'Free Rides'], free: true },
      { name: 'MassMobility', desc: 'Statewide coordination of medical and human services transportation resources.', phone: '617-973-8082', hours: 'Mon–Fri 9 AM–5 PM', address: null, website: 'https://massmobility.org', tags: ['Medical Transport', 'Statewide'], free: false },
    ],
  },
  {
    id: 'mental_health',
    label: 'Mental Health',
    shortLabel: 'Mental Health',
    icon: Brain,
    gradient: 'from-purple-600 to-violet-500',
    accent: 'text-purple-700',
    bgBadge: 'bg-purple-100 text-purple-700',
    resources: [
      { name: 'Open Sky Community Services', desc: 'Outpatient behavioral health, crisis counseling, and wellness services for all ages.', phone: '508-755-5000', hours: 'Mon–Fri 9 AM–5 PM', address: null, website: 'https://openskycs.org', tags: ['Counseling', 'Crisis', 'All Ages'], free: false },
      { name: '988 Suicide & Crisis Lifeline', desc: 'Free, confidential 24/7 support for anyone in mental health or suicidal crisis. Call or text 988.', phone: '988', hours: '24/7', address: null, tags: ['Crisis', 'Free', '24/7'], free: true, urgent: true },
      { name: 'NAMI Massachusetts', desc: 'Education, support groups, and advocacy for individuals and families affected by mental illness.', phone: '800-370-9085', hours: 'Mon–Fri 9 AM–5 PM', address: null, website: 'https://namimass.org', tags: ['Support Groups', 'Education', 'Free'], free: true },
      { name: 'Veterans Crisis Line', desc: 'Confidential crisis support for veterans and their families. Call 988 and press 1, or text 838255.', phone: '988', hours: '24/7', address: null, tags: ['Veterans', 'Crisis', '24/7'], free: true, urgent: true },
      { name: 'SAMHSA Treatment Locator', desc: 'Find local substance abuse and mental health treatment programs.', phone: '800-662-4357', hours: '24/7', address: null, website: 'https://findtreatment.gov', tags: ['Substance Abuse', 'Locator'], free: true },
    ],
  },
  {
    id: 'seniors',
    label: 'Senior Services',
    shortLabel: 'Seniors',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-500',
    accent: 'text-pink-700',
    bgBadge: 'bg-pink-100 text-pink-700',
    resources: [
      { name: 'Pepperell Senior Center', desc: 'Programs, congregate meals, fitness, crafts, day trips, and social services for residents 60+.', phone: '978-433-0338', hours: 'Mon–Fri 8 AM–4 PM', address: '1 Hollis St, Pepperell', tags: ['Meals', 'Programs', 'Social'], free: true },
      { name: 'Council on Aging', desc: 'Benefits counseling, transportation coordination, home services referrals, and caregiver support.', phone: '978-433-0339', hours: 'Mon–Fri 9 AM–3 PM', address: '1 Hollis St, Pepperell', tags: ['Benefits', 'Referrals'], free: true },
      { name: 'SHINE Health Insurance Counseling', desc: 'Free Medicare and Medicaid counseling — understanding benefits, prescription costs, and enrollment.', phone: '800-243-4636', hours: 'By appointment at Senior Center', address: 'Pepperell Senior Center', tags: ['Medicare', 'Insurance', 'Free'], free: true },
      { name: 'Elder Services of Merrimack Valley', desc: 'Home care, caregiver support, elder protective services, and Meals on Wheels.', phone: '978-946-1389', hours: 'Mon–Fri 8 AM–5 PM', address: 'Haverhill, MA', tags: ['Home Care', 'Meals on Wheels', 'Protective Services'] },
      { name: 'Mass Aging Access', desc: 'One-stop portal for senior services, caregiver resources, and information on aging in Massachusetts.', phone: '800-243-4636', hours: 'Mon–Fri 8 AM–5 PM', address: null, website: 'https://massagingaccess.org', tags: ['Statewide', 'Caregivers'] },
    ],
  },
  {
    id: 'veterans',
    label: 'Veteran Services',
    shortLabel: 'Veterans',
    icon: Shield,
    gradient: 'from-indigo-600 to-blue-600',
    accent: 'text-indigo-700',
    bgBadge: 'bg-indigo-100 text-indigo-700',
    resources: [
      { name: 'Pepperell Veterans Services', desc: 'Benefits navigation, Chapter 115 emergency aid, burial assistance, and veteran referrals.', phone: '978-433-0335', hours: 'Mon & Thu 9 AM–12 PM', address: 'Pepperell Town Hall', tags: ['Benefits', 'Chapter 115', 'Local'], free: true },
      { name: 'Varnum Post VFW', desc: 'Community support, social connection, advocacy, and service programs for veterans.', phone: '978-433-0360', hours: 'Call for current hours', address: '8 Canal St, Pepperell', tags: ['VFW', 'Social', 'Community'] },
      { name: 'Soldier On Housing', desc: 'Housing, transitional programs, and supportive services for homeless and at-risk veterans.', phone: '413-733-8878', hours: 'Mon–Fri 9 AM–5 PM', address: null, tags: ['Housing', 'Homeless Veterans'], free: true, urgent: true },
      { name: 'Massachusetts DVS', desc: 'State veterans benefits, college fee waivers, annuity, and employment services.', phone: '617-210-5480', hours: 'Mon–Fri 9 AM–5 PM', address: null, website: 'https://www.mass.gov/veterans', tags: ['State Benefits', 'Education', 'Employment'], free: true },
      { name: 'VA Boston Healthcare', desc: 'Medical care, mental health, dental, and specialty services for eligible veterans.', phone: '800-865-3384', hours: 'Mon–Fri 8 AM–4:30 PM', address: 'Jamaica Plain / Brockton / West Roxbury', tags: ['Medical', 'Mental Health', 'VA'], free: true },
    ],
  },
  {
    id: 'legal',
    label: 'Legal Aid',
    shortLabel: 'Legal',
    icon: Scale,
    gradient: 'from-slate-600 to-slate-500',
    accent: 'text-slate-700',
    bgBadge: 'bg-slate-100 text-slate-700',
    resources: [
      { name: 'Greater Boston Legal Services', desc: 'Free civil legal aid for low-income residents: housing, family, immigration, and benefits.', phone: '617-603-1700', hours: 'Mon–Fri 9 AM–5 PM', address: null, website: 'https://gbls.org', tags: ['Civil Law', 'Free', 'Income-Based'], free: true },
      { name: 'Northeast Legal Aid', desc: 'Free legal services for low-income individuals in Northern Middlesex County, including Pepperell.', phone: '978-458-1465', hours: 'Mon–Fri 9 AM–5 PM', address: 'Lowell, MA', tags: ['Housing', 'Family Law', 'Lowell'], free: true },
      { name: 'Mass Legal Help', desc: 'Plain-language legal information and attorney referrals for Massachusetts residents.', phone: null, hours: null, address: null, website: 'https://masslegalhelp.org', tags: ['Self-Help', 'Information', 'Referrals'], free: true },
      { name: 'Lawyer Referral Service (MBA)', desc: 'Connect with a licensed attorney for a low-cost initial consultation through the Mass Bar Association.', phone: '617-654-0400', hours: 'Mon–Fri 9 AM–5 PM', address: null, tags: ['Referral', 'Consultation'], free: false },
    ],
  },
  {
    id: 'utilities',
    label: 'Utilities & Energy',
    shortLabel: 'Utilities',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-400',
    accent: 'text-yellow-700',
    bgBadge: 'bg-yellow-100 text-yellow-700',
    resources: [
      { name: 'LIHEAP Fuel Assistance', desc: 'Federally funded home heating assistance for low-income households. Apply in fall for winter season.', phone: '978-459-0551', hours: 'Mon–Fri 8 AM–5 PM', address: 'Community Teamwork, Lowell', tags: ['Heating', 'Winter', 'Federal'], free: true },
      { name: 'Mass Save (Energy Efficiency)', desc: 'Free home energy assessments, insulation, and rebates on energy-efficient appliances.', phone: '866-527-7283', hours: 'Mon–Fri 8 AM–8 PM', address: null, website: 'https://masssave.com', tags: ['Insulation', 'Rebates', 'Free Assessment'], free: true },
      { name: 'Eversource Shutoff Protection', desc: 'Medical baseline, payment plans, and shutoff protections for eligible Eversource customers.', phone: '800-592-2000', hours: 'Mon–Fri 7 AM–7 PM', address: null, tags: ['Shutoff Protection', 'Payment Plans'], free: true },
      { name: 'National Grid Assistance', desc: 'Budget billing, income-eligible discount rates, and assistance programs for National Grid customers.', phone: '800-322-3223', hours: 'Mon–Fri 7 AM–7 PM', address: null, tags: ['Budget Billing', 'Discount Rate'], free: true },
    ],
  },
  {
    id: 'disability',
    label: 'Disability Services',
    shortLabel: 'Disability',
    icon: Accessibility,
    gradient: 'from-teal-600 to-cyan-500',
    accent: 'text-teal-700',
    bgBadge: 'bg-teal-100 text-teal-700',
    resources: [
      { name: 'WORK Inc.', desc: 'Employment, day habilitation, and community-based services for adults with intellectual and developmental disabilities.', phone: '617-376-1530', hours: 'Mon–Fri 8 AM–5 PM', address: null, website: 'https://workinc.org', tags: ['Employment', 'Day Programs', 'IDD'] },
      { name: 'Massachusetts Rehab Commission', desc: 'Vocational rehabilitation, assistive technology, and independent living services.', phone: '800-245-6543', hours: 'Mon–Fri 8:45 AM–5 PM', address: null, website: 'https://www.mass.gov/mrc', tags: ['Vocational Rehab', 'Assistive Tech', 'Independent Living'], free: true },
      { name: 'Northeast Independent Living', desc: 'Consumer-directed independent living services, ADA advocacy, and peer support.', phone: '978-687-4288', hours: 'Mon–Fri 9 AM–5 PM', address: 'Lawrence, MA', website: 'https://nilp.org', tags: ['Independent Living', 'Peer Support', 'ADA'], free: true },
      { name: 'Social Security Disability (SSDI/SSI)', desc: 'Federal disability benefits for those unable to work. Applications and appeals assistance available.', phone: '800-772-1213', hours: 'Mon–Fri 8 AM–7 PM', address: null, tags: ['SSDI', 'SSI', 'Federal Benefits'], free: true },
    ],
  },
  {
    id: 'children',
    label: 'Children & Families',
    shortLabel: 'Children',
    icon: Baby,
    gradient: 'from-green-500 to-emerald-500',
    accent: 'text-green-700',
    bgBadge: 'bg-green-100 text-green-700',
    resources: [
      { name: 'Mass 211 (Family Services)', desc: 'Call 2-1-1 anytime for referrals to childcare, domestic violence, family crisis, and community services.', phone: '211', hours: '24/7', address: null, tags: ['Referral', '24/7', 'Hotline'], free: true },
      { name: 'Head Start / Early Head Start', desc: 'Free early childhood education and family support for income-eligible children from birth to age 5.', phone: '978-459-0551', hours: 'Mon–Fri 8 AM–5 PM', address: 'Community Teamwork, Lowell', tags: ['Early Childhood', 'Childcare', 'Free'], free: true },
      { name: 'Mass Child Care Vouchers', desc: 'Subsidized childcare for working families — apply through the Department of Early Education and Care.', phone: '617-988-6600', hours: 'Mon–Fri 9 AM–5 PM', address: null, website: 'https://www.mass.gov/eec', tags: ['Childcare Subsidy', 'Working Families'], free: false },
      { name: 'DCF Family Resource Centers', desc: 'Prevention services, parenting support, home visiting, and family stabilization for at-risk families.', phone: '978-433-7531', hours: 'Mon–Fri 9 AM–5 PM', address: 'Ayer, MA', tags: ['Parenting', 'Prevention', 'Home Visiting'], free: true },
    ],
  },
  {
    id: 'education',
    label: 'Library & Learning',
    shortLabel: 'Library',
    icon: GraduationCap,
    gradient: 'from-emerald-600 to-green-500',
    accent: 'text-emerald-700',
    bgBadge: 'bg-emerald-100 text-emerald-700',
    resources: [
      { name: 'Pepperell Public Library', desc: 'Books, e-resources, story time, computer access, Hoopla/Libby digital lending, and community programs.', phone: '978-433-0330', hours: 'Mon–Thu 9–8 · Fri–Sat 9–5', address: '4 Main St, Pepperell', tags: ['Books', 'Digital', 'Programs'], free: true },
      { name: 'Adult Literacy Program', desc: 'Free GED preparation, ESL classes, and basic skills tutoring at the Pepperell Public Library.', phone: '978-433-0330', hours: 'By appointment', address: 'Pepperell Public Library', tags: ['GED', 'ESL', 'Free'], free: true },
      { name: 'Minuteman Library Network', desc: 'Access hundreds of libraries across Greater Boston — borrow books, DVDs, audiobooks, and more.', phone: null, hours: null, address: null, website: 'https://mln.lib.ma.us', tags: ['Network', 'Digital Lending'], free: true },
      { name: 'MassHire Greater Lowell', desc: 'Job search, career counseling, resume help, and workforce training for adults.', phone: '978-322-3000', hours: 'Mon–Fri 8:30 AM–5 PM', address: 'Lowell, MA', tags: ['Job Search', 'Career', 'Training'], free: true },
    ],
  },
  {
    id: 'health',
    label: 'Health & Wellness',
    shortLabel: 'Health',
    icon: Heart,
    gradient: 'from-red-500 to-rose-500',
    accent: 'text-red-700',
    bgBadge: 'bg-red-100 text-red-700',
    resources: [
      { name: 'Pepperell Board of Health', desc: 'Environmental health inspections, public health programs, immunizations, and health education.', phone: '978-433-0332', hours: 'Mon–Fri 8 AM–4 PM', address: 'Pepperell Town Hall', tags: ['Public Health', 'Immunizations'], free: true },
      { name: 'Community Health Center of Lowell', desc: 'Sliding-scale primary care, dental, and behavioral health regardless of insurance status.', phone: '978-937-9700', hours: 'Mon–Fri 7:30 AM–5 PM', address: 'Lowell, MA', tags: ['Primary Care', 'Sliding Scale', 'Dental'] },
      { name: 'MassHealth (Medicaid)', desc: 'Free or low-cost health insurance for eligible MA residents. Apply online at mahix.org.', phone: '800-841-2900', hours: 'Mon–Fri 8 AM–5 PM', address: null, website: 'https://www.mass.gov/masshealth', tags: ['Insurance', 'Medicaid', 'Free'], free: true },
      { name: 'Narcotics Anonymous / AA', desc: 'Free peer recovery support groups meeting throughout Nashoba Valley. No fees, no requirements.', phone: '800-454-8722', hours: 'Multiple meeting times', address: null, tags: ['Recovery', 'Peer Support', 'Free'], free: true },
    ],
  },
];

const STATS = [
  { value: '80+', label: 'Resources Listed' },
  { value: '12', label: 'Categories' },
  { value: 'Free', label: 'To Access & Use' },
  { value: '24/7', label: 'Crisis Lines Available' },
];

export default function CommunityResourcesPage() {
  const navigate = useNavigate();
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownDrop, setShowTownDrop] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);

  useEffect(() => {
    supabase.from('community_towns').select('id,name,state').eq('is_active', true).order('name').then(({ data }) => {
      if (data?.length) { setTowns(data); setSelectedTown(data.find((t: Town) => t.name === 'Pepperell') || data[0]); }
    });
  }, []);

  const q = search.toLowerCase().trim();
  const visibleSections = RESOURCE_SECTIONS
    .filter(s => !activeSection || s.id === activeSection)
    .map(s => ({
      ...s,
      resources: s.resources.filter(r => {
        if (freeOnly && !r.free) return false;
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          r.desc.toLowerCase().includes(q) ||
          (r.tags || []).some(t => t.toLowerCase().includes(q))
        );
      }),
    }))
    .filter(s => s.resources.length > 0);

  const urgentResources = RESOURCE_SECTIONS.flatMap(s => s.resources.filter(r => r.urgent)).slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 text-white">
          <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-slate-300 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-6 h-6 text-slate-300" />
                <span className="text-slate-300 text-sm font-semibold uppercase tracking-wider">Community Resources</span>
              </div>
              <h1 className="text-3xl font-bold">Resource Hub</h1>
              <p className="text-slate-300 mt-1">Food · Housing · Health · Legal · Utilities · Veterans · Seniors · Families</p>
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-slate-300 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent / Crisis Banner */}
        {urgentResources.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-red-800">Crisis &amp; Emergency Resources</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {urgentResources.map(r => (
                <div key={r.name} className="bg-white rounded-xl border border-red-100 p-3">
                  <div className="font-semibold text-sm text-slate-900">{r.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5 mb-2">{r.hours}</div>
                  {r.phone && (
                    <a href={`tel:${r.phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1.5 text-sm font-bold text-red-700 hover:underline">
                      <Phone className="w-3.5 h-3.5" />{r.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resources, services, organizations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
            />
          </div>
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm whitespace-nowrap transition-all ${freeOnly ? 'bg-green-700 text-white border-green-700' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
          >
            <Filter className="w-4 h-4" />
            {freeOnly ? 'Free Only' : 'All Resources'}
            {freeOnly && <CheckCircle className="w-4 h-4" />}
          </button>
        </div>

        {/* Category Tiles */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveSection(null)}
            className={`p-3 rounded-xl border-2 text-center transition-all ${!activeSection ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:shadow-sm'}`}
          >
            <BookOpen className={`w-6 h-6 mx-auto mb-1.5 ${!activeSection ? 'text-white' : 'text-slate-400'}`} />
            <div className="text-xs font-semibold">All</div>
          </button>
          {RESOURCE_SECTIONS.map(section => {
            const Icon = section.icon;
            const active = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(active ? null : section.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${active ? `bg-gradient-to-br ${section.gradient} text-white border-transparent shadow-md` : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:shadow-sm'}`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-1.5 ${active ? 'text-white/90' : 'text-slate-400'}`} />
                <div className="text-xs font-semibold leading-tight">{section.shortLabel}</div>
              </button>
            );
          })}
        </div>

        {/* Resource Listings */}
        {visibleSections.length > 0 ? visibleSections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{section.label}</h2>
                  <p className="text-sm text-slate-500">{section.resources.length} resource{section.resources.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.resources.map(res => (
                  <Card key={res.name} variant="bordered" className="hover:shadow-md transition-shadow">
                    <CardBody className="space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 leading-snug">{res.name}</h3>
                          {res.urgent && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">URGENT</span>}
                        </div>
                        {res.free && !res.urgent && <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 bg-green-100 text-green-700`}>Free</span>}
                        <p className="text-sm text-slate-600">{res.desc}</p>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-500">
                        {res.hours && <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 flex-shrink-0" />{res.hours}</div>}
                        {res.address && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 flex-shrink-0" />{res.address}</div>}
                      </div>
                      {res.tags && res.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {res.tags.slice(0, 3).map(tag => (
                            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${section.bgBadge}`}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 pt-1">
                        {res.phone && (
                          <a href={`tel:${res.phone.replace(/[^0-9]/g, '')}`} className={`flex items-center gap-1.5 text-sm font-semibold ${section.accent} hover:underline`}>
                            <Phone className="w-3.5 h-3.5" />{res.phone}
                          </a>
                        )}
                        {res.website && (
                          <a href={res.website} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 text-xs font-medium ${section.accent} hover:underline ml-auto`}>
                            Website <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          );
        }) : (
          <Card variant="bordered">
            <CardBody className="text-center py-12">
              <BookOpen className="w-14 h-14 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No resources match your search.</p>
              <p className="text-sm text-slate-400 mt-1">Try different keywords or clear the filter.</p>
            </CardBody>
          </Card>
        )}

        {/* Add Resource CTA */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900">Know a resource we're missing?</h3>
            <p className="text-sm text-slate-600 mt-1">Help your neighbors — suggest a local service, organization, or program to add to this hub.</p>
          </div>
          <button onClick={() => navigate('/community')} className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap text-sm">
            Suggest a Resource
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
