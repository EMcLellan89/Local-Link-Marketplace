import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award, CheckCircle, Star, Shield, Heart, Users,
  ArrowLeft, ChevronRight, ExternalLink, BadgeCheck,
  Briefcase, Truck, Leaf, Baby, HandHeart, AlertCircle,
  Phone, Clock,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Certification {
  id: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  badge: string;
  description: string;
  requirements: string[];
  benefits: string[];
  fee: string;
  renewalPeriod: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    id: 'senior_friendly',
    name: 'Senior Friendly',
    tagline: 'Trusted by Seniors & Caregivers',
    icon: Heart,
    color: 'text-pink-700',
    gradient: 'from-pink-500 to-rose-500',
    badge: 'bg-pink-100 text-pink-800',
    description: 'Businesses that earn this certification have demonstrated a commitment to serving older adults with dignity, accessibility, and patience.',
    requirements: [
      'Staff trained in senior-friendly communication and assistance',
      'Accessible entrance, seating, and restrooms',
      'Large-print materials or accommodations available',
      'Patient service standards — no rushing or high-pressure tactics',
      'Background checks on staff with regular senior contact',
      'Discount or priority service option for seniors 65+',
    ],
    benefits: [
      'Listed in Senior Services directory',
      'Referred by Council on Aging and Senior Center',
      'Senior Friendly badge on your Local-Link profile',
      'Featured in monthly senior newsletter',
    ],
    fee: '$149/year',
    renewalPeriod: 'Annual with staff re-verification',
  },
  {
    id: 'veteran_friendly',
    name: 'Veteran Friendly',
    tagline: 'Committed to Those Who Served',
    icon: Shield,
    color: 'text-indigo-700',
    gradient: 'from-indigo-600 to-blue-600',
    badge: 'bg-indigo-100 text-indigo-800',
    description: 'Recognizes businesses that actively support veterans through employment, discounts, and community involvement.',
    requirements: [
      'Veteran or military family discount (minimum 10%)',
      'At least one veteran or military spouse employed (or active hiring commitment)',
      'Partnership with or donation to local veterans organization',
      'Staff trained to recognize veteran-specific needs and PTSD awareness',
      'Participates in or sponsors at least one veteran community event annually',
    ],
    benefits: [
      'Listed in Veteran Services directory',
      'Referred by local VFW and Veterans Services Office',
      'Veteran Friendly badge on Local-Link profile',
      'Co-marketing with Veterans Day and Memorial Day campaigns',
    ],
    fee: '$129/year',
    renewalPeriod: 'Annual',
  },
  {
    id: 'municipal_approved',
    name: 'Municipal Approved',
    tagline: 'Vetted & Endorsed by Local Government',
    icon: Briefcase,
    color: 'text-blue-700',
    gradient: 'from-blue-700 to-blue-500',
    badge: 'bg-blue-100 text-blue-800',
    description: 'Businesses on the town\'s approved vendor list for government contracts, public works, and municipal purchasing.',
    requirements: [
      'Current Certificate of Insurance on file with the town',
      'Registered with SAM.gov or Massachusetts Supplier Diversity',
      'No outstanding violations, liens, or contract disputes with the town',
      'Business License current and in good standing',
      'References from at least one prior public project or municipal work',
    ],
    benefits: [
      'Eligible for municipal RFQ consideration',
      'Listed as preferred vendor on town website',
      'Municipal Approved badge on Local-Link profile',
      'Priority notification for upcoming town contracts',
    ],
    fee: '$199/year',
    renewalPeriod: 'Annual — insurance and license re-verification',
  },
  {
    id: 'emergency_vendor',
    name: 'Emergency Response Vendor',
    tagline: 'Ready When the Community Needs It Most',
    icon: AlertCircle,
    color: 'text-red-700',
    gradient: 'from-red-600 to-orange-500',
    badge: 'bg-red-100 text-red-800',
    description: 'Pre-approved vendors ready to provide critical goods and services during declared emergencies, disasters, or public health crises.',
    requirements: [
      'Signed MOU with local Emergency Management office',
      'Demonstrated capacity for surge operations (extended hours, inventory)',
      'After-hours or on-call contact for emergency dispatch',
      'Priority local fulfillment commitment — no price gouging policy',
      'Participation in at least one Emergency Management drill or tabletop per year',
    ],
    benefits: [
      'First-call vendor during declared emergencies',
      'Listed on Emergency Management resource page',
      'Emergency Response badge prominently featured on profile',
      'Resident trust and visibility during crisis events',
    ],
    fee: '$249/year',
    renewalPeriod: 'Annual with Emergency Management sign-off',
  },
  {
    id: 'background_verified',
    name: 'Background Verified',
    tagline: 'Trust Starts with Transparency',
    icon: BadgeCheck,
    color: 'text-green-700',
    gradient: 'from-green-600 to-emerald-500',
    badge: 'bg-green-100 text-green-800',
    description: 'Service businesses (contractors, cleaners, caregivers, tutors) whose owners and key personnel have passed criminal background checks.',
    requirements: [
      'Owner and all employees with client-facing roles pass criminal background check',
      'Sex offender registry clearance for all personnel',
      'Annual re-verification for any new hires',
      'Signed attestation and consent for annual re-checks',
      'Complaints or incidents reported to Local-Link within 7 days',
    ],
    benefits: [
      'Background Verified seal on all profile listings',
      'Preferred in directory searches for home services, childcare, and eldercare',
      'Higher conversion rate — residents trust verified businesses',
      'Featured in "Safe Hire" category for families and seniors',
    ],
    fee: '$179/year + background check fees',
    renewalPeriod: 'Annual with re-check for new hires',
  },
  {
    id: 'family_friendly',
    name: 'Family & Child Friendly',
    tagline: 'Safe Spaces for Every Family',
    icon: Baby,
    color: 'text-teal-700',
    gradient: 'from-teal-500 to-cyan-500',
    badge: 'bg-teal-100 text-teal-800',
    description: 'Businesses that go above and beyond to welcome families — with safe, clean, child-appropriate environments.',
    requirements: [
      'Child-safe environment (no exposed hazards, age-appropriate materials)',
      'Changing table or family restroom available',
      'Background-verified staff in direct child contact roles',
      'No smoking policy on all premises',
      'Kid-friendly menu, seating, or programming where applicable',
    ],
    benefits: [
      'Listed in family and youth organization directories',
      'Featured in Parent Resource Guide distributed at schools',
      'Family Friendly badge on Local-Link profile',
      'Partnership with PTO/PTA organizations for referrals',
    ],
    fee: '$129/year',
    renewalPeriod: 'Annual',
  },
  {
    id: 'eco_certified',
    name: 'Eco Certified',
    tagline: 'Committed to a Greener Community',
    icon: Leaf,
    color: 'text-emerald-700',
    gradient: 'from-emerald-600 to-green-500',
    badge: 'bg-emerald-100 text-emerald-800',
    description: 'Businesses that demonstrate meaningful environmental practices — reducing waste, supporting local sustainability, and protecting natural resources.',
    requirements: [
      'Active recycling and composting program on premises',
      'Documented reduction in single-use plastics',
      'Participation in town transfer station or recycling program',
      'At least one documented sustainability initiative annually',
      'Energy-efficient equipment or lighting (documentation required)',
    ],
    benefits: [
      'Featured in Earth Month community campaigns',
      'Eco Certified badge and green indicator on profile',
      'Listed in town sustainability resources',
      'Recognized at annual Community Day event',
    ],
    fee: '$99/year',
    renewalPeriod: 'Annual with initiative documentation',
  },
  {
    id: 'nonprofit_partner',
    name: 'Community Impact Partner',
    tagline: 'Giving Back Is Good Business',
    icon: HandHeart,
    color: 'text-orange-700',
    gradient: 'from-orange-500 to-amber-500',
    badge: 'bg-orange-100 text-orange-800',
    description: 'Businesses that have a verified, ongoing partnership with local nonprofits, schools, or community organizations.',
    requirements: [
      'Documented partnership with at least one local nonprofit or school',
      'Annual donation or in-kind contribution (min. $500 value)',
      'Volunteer hours or event sponsorship contribution',
      'Written endorsement from the nonprofit partner organization',
      'Impact reported annually — hours, dollars, items donated',
    ],
    benefits: [
      'Community Impact badge on Local-Link profile',
      'Co-featured with partner nonprofit in community posts',
      'Recognized in annual Local-Link Community Impact Report',
      'Residents see your community investment when browsing deals',
    ],
    fee: '$99/year',
    renewalPeriod: 'Annual with partner attestation',
  },
];

const CERTIFIED_BUSINESSES = [
  { name: 'Pepperell Pharmacy', certs: ['senior_friendly', 'background_verified'], type: 'Pharmacy' },
  { name: 'Clean Cut Lawn Care', certs: ['background_verified', 'eco_certified'], type: 'Home Services' },
  { name: 'Nashoba Valley Fuel', certs: ['emergency_vendor', 'veteran_friendly'], type: 'Energy Services' },
  { name: 'Little Sprouts Childcare', certs: ['family_friendly', 'background_verified'], type: 'Childcare' },
  { name: 'Pepperell Hardware', certs: ['municipal_approved', 'veteran_friendly'], type: 'Hardware' },
  { name: 'Main St Diner', certs: ['senior_friendly', 'family_friendly', 'community_impact'], type: 'Restaurant' },
];

export default function CertifiedPage() {
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [activeTab, setActiveTab] = useState<'certifications' | 'directory'>('certifications');

  const getCertById = (id: string) => CERTIFICATIONS.find(c => c.id === id);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.08),transparent_60%)]" />
          <div className="relative">
            <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-slate-300 text-sm mb-4 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Community Hub
            </button>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-300 text-sm font-semibold uppercase tracking-wider">Local-Link Certified™</span>
                </div>
                <h1 className="text-3xl font-bold">Community-Verified Businesses</h1>
                <p className="text-slate-300 mt-2 max-w-xl">Certifications that mean something. Every badge represents real verification — by local government, community organizations, and residents who trust these businesses.</p>
              </div>
              <div className="flex flex-col gap-3 min-w-[200px]">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-300">{CERTIFICATIONS.length}</div>
                  <div className="text-xs text-slate-300">Certification Types</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-300">{CERTIFIED_BUSINESSES.length}+</div>
                  <div className="text-xs text-slate-300">Certified Businesses</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['certifications', 'directory'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all capitalize ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {tab === 'certifications' ? 'Certification Types' : 'Certified Directory'}
            </button>
          ))}
        </div>

        {activeTab === 'certifications' && (
          <>
            {selectedCert ? (
              /* Detail view */
              <div className="space-y-5">
                <button onClick={() => setSelectedCert(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to all certifications
                </button>
                <div className={`bg-gradient-to-br ${selectedCert.gradient} rounded-2xl p-8 text-white`}>
                  <div className="flex items-center gap-3 mb-3">
                    {(() => { const Icon = selectedCert.icon; return <Icon className="w-8 h-8 text-white/80" />; })()}
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCert.name}</h2>
                      <p className="text-white/80 text-sm">{selectedCert.tagline}</p>
                    </div>
                  </div>
                  <p className="text-white/90 max-w-2xl">{selectedCert.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div className="bg-white/20 rounded-lg px-3 py-1.5"><span className="font-bold">{selectedCert.fee}</span></div>
                    <div className="bg-white/20 rounded-lg px-3 py-1.5"><Clock className="w-3.5 h-3.5 inline mr-1.5" />{selectedCert.renewalPeriod}</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Card variant="bordered">
                    <CardBody>
                      <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" />Requirements</h3>
                      <ul className="space-y-2">
                        {selectedCert.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                  <Card variant="bordered">
                    <CardBody>
                      <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" />Benefits</h3>
                      <ul className="space-y-2">
                        {selectedCert.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <Button className="w-full" onClick={() => navigate('/register?type=merchant&cert=' + selectedCert.id)}>
                          Apply for {selectedCert.name} Certification
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            ) : (
              /* Grid of certs */
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {CERTIFICATIONS.map(cert => {
                  const Icon = cert.icon;
                  return (
                    <Card key={cert.id} variant="bordered" className="hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedCert(cert)}>
                      <CardBody className="space-y-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.gradient} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{cert.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{cert.tagline}</p>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{cert.description}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm font-semibold text-slate-700">{cert.fee}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'directory' && (
          <div className="space-y-5">
            <p className="text-slate-600 text-sm">Businesses that have earned one or more Local-Link Certified™ designations, verified by the community.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CERTIFIED_BUSINESSES.map(biz => (
                <Card key={biz.name} variant="bordered" className="hover:shadow-md transition-shadow">
                  <CardBody className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900">{biz.name}</h3>
                        <p className="text-xs text-slate-500">{biz.type}</p>
                      </div>
                      <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {biz.certs.map(certId => {
                        const cert = getCertById(certId);
                        if (!cert) return null;
                        return (
                          <span key={certId} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cert.badge}`}>
                            {cert.name}
                          </span>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-white">Is your business ready to get certified?</h3>
            </div>
            <p className="text-sm text-slate-300">Certifications build resident trust, improve visibility, and connect you to government and community partners.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/register?type=merchant')} className="whitespace-nowrap">
              Get Certified
            </Button>
            <button onClick={() => { const el = document.getElementById('cert-faq'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm text-slate-300 hover:text-white border border-slate-600 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap">
              Learn More
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div id="cert-faq" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          {[
            { q: 'How long does the certification process take?', a: 'Most certifications take 5–10 business days from application submission to approval. Emergency Response Vendor and Municipal Approved certifications may take longer due to government review.' },
            { q: 'What happens if a certified business has a complaint?', a: 'Complaints are reviewed by Local-Link and the issuing body (town, nonprofit, or agency). Certifications can be revoked for verified violations. Businesses are notified and given an opportunity to respond.' },
            { q: 'Can I hold multiple certifications?', a: 'Yes — many businesses hold 2–3 certifications. Each requires its own application and fee. Multi-certification businesses receive additional visibility in directory searches.' },
            { q: 'Are certifications visible to residents?', a: 'Absolutely. Certification badges appear prominently on your Local-Link business profile, in search results, and in category directories where relevant (e.g., Senior Friendly businesses appear in the Senior Services directory).' },
          ].map(item => (
            <Card key={item.q} variant="bordered">
              <CardBody>
                <h4 className="font-semibold text-slate-900">{item.q}</h4>
                <p className="text-sm text-slate-600 mt-2">{item.a}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
