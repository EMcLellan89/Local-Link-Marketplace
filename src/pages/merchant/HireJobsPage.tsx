import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  Mail,
  PenTool,
  TrendingUp,
  UserCheck,
  Calendar,
  MessageSquare,
  BarChart,
  Camera,
  Calculator,
  Search,
  Users
} from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface JobService {
  id: string;
  title: string;
  description: string;
  icon: any;
  pricing: {
    amount: number;
    unit: string;
    label: string;
  }[];
  deliverables: string[];
  turnaround: string;
  category: string;
}

const jobServices: JobService[] = [
  {
    id: 'virtual-assistant',
    title: 'Virtual Assistant',
    description: 'Professional administrative support for daily business tasks',
    icon: UserCheck,
    pricing: [
      { amount: 350, unit: '10 hours', label: '10 Hours' },
      { amount: 650, unit: '20 hours', label: '20 Hours' },
      { amount: 1200, unit: '40 hours', label: '40 Hours' }
    ],
    deliverables: [
      'Email management & scheduling',
      'Calendar coordination',
      'Data entry & file organization',
      'Customer communication',
      'Research & documentation'
    ],
    turnaround: 'Ongoing support',
    category: 'Administrative'
  },
  {
    id: 'content-writer',
    title: 'Content Writer',
    description: 'Professional blog posts, articles, and web content',
    icon: PenTool,
    pricing: [
      { amount: 200, unit: 'per article', label: '1 Article (500-750 words)' },
      { amount: 350, unit: 'per article', label: '1 Article (1000-1500 words)' },
      { amount: 800, unit: '5 articles', label: '5 Articles (500-750 words each)' }
    ],
    deliverables: [
      'SEO-optimized content',
      'Professional editing & proofreading',
      'Research-backed writing',
      'Engaging headlines',
      '2 rounds of revisions'
    ],
    turnaround: '5-7 days per article',
    category: 'Content Creation'
  },
  {
    id: 'letter-writer',
    title: 'Professional Letter Writer',
    description: 'Business letters, proposals, and formal communications',
    icon: FileText,
    pricing: [
      { amount: 150, unit: 'per letter', label: '1 Business Letter' },
      { amount: 400, unit: '3 letters', label: '3 Letters Package' },
      { amount: 700, unit: '6 letters', label: '6 Letters Package' }
    ],
    deliverables: [
      'Professional formatting',
      'Persuasive & clear messaging',
      'Grammar & spell-checked',
      'Industry-appropriate tone',
      'Unlimited revisions'
    ],
    turnaround: '2-3 days per letter',
    category: 'Business Writing'
  },
  {
    id: 'social-media-manager',
    title: 'Social Media Manager',
    description: 'Monthly social media management and content posting',
    icon: TrendingUp,
    pricing: [
      { amount: 600, unit: 'per month', label: 'Basic (15 posts/month)' },
      { amount: 1000, unit: 'per month', label: 'Standard (30 posts/month)' },
      { amount: 1600, unit: 'per month', label: 'Premium (60 posts/month)' }
    ],
    deliverables: [
      'Content calendar creation',
      'Daily posting & scheduling',
      'Engagement & community management',
      'Hashtag research',
      'Monthly analytics report'
    ],
    turnaround: 'Ongoing monthly',
    category: 'Social Media'
  },
  {
    id: 'email-campaign-manager',
    title: 'Email Campaign Manager',
    description: 'Email marketing campaigns and newsletter management',
    icon: Mail,
    pricing: [
      { amount: 500, unit: 'per month', label: 'Basic (4 campaigns/month)' },
      { amount: 800, unit: 'per month', label: 'Standard (8 campaigns/month)' },
      { amount: 1200, unit: 'per month', label: 'Premium (12 campaigns/month)' }
    ],
    deliverables: [
      'Email copywriting',
      'Template design & setup',
      'List segmentation',
      'A/B testing',
      'Performance reporting'
    ],
    turnaround: 'Ongoing monthly',
    category: 'Email Marketing'
  },
  {
    id: 'customer-service-rep',
    title: 'Customer Service Representative',
    description: 'Professional customer support and inquiry handling',
    icon: MessageSquare,
    pricing: [
      { amount: 450, unit: '15 hours', label: '15 Hours' },
      { amount: 850, unit: '30 hours', label: '30 Hours' },
      { amount: 1500, unit: '60 hours', label: '60 Hours' }
    ],
    deliverables: [
      'Email & chat support',
      'Issue resolution',
      'Customer inquiry handling',
      'Ticket management',
      'Follow-up communications'
    ],
    turnaround: 'Ongoing support',
    category: 'Customer Support'
  },
  {
    id: 'data-entry-specialist',
    title: 'Data Entry Specialist',
    description: 'Accurate data entry and database management',
    icon: Calculator,
    pricing: [
      { amount: 300, unit: 'per project', label: 'Small Project (up to 500 entries)' },
      { amount: 550, unit: 'per project', label: 'Medium Project (501-1500 entries)' },
      { amount: 950, unit: 'per project', label: 'Large Project (1501-3000 entries)' }
    ],
    deliverables: [
      'Accurate data input',
      'Database organization',
      'Quality verification',
      'Format standardization',
      'Progress updates'
    ],
    turnaround: '5-10 days depending on size',
    category: 'Data Management'
  },
  {
    id: 'video-editor',
    title: 'Video Editor',
    description: 'Professional video editing for marketing and content',
    icon: Camera,
    pricing: [
      { amount: 300, unit: 'per video', label: '1 Short Video (under 3 min)' },
      { amount: 500, unit: 'per video', label: '1 Long Video (3-10 min)' },
      { amount: 1200, unit: '5 videos', label: '5 Short Videos Package' }
    ],
    deliverables: [
      'Professional editing & transitions',
      'Color correction',
      'Audio enhancement',
      'Text overlays & graphics',
      '2 rounds of revisions'
    ],
    turnaround: '5-7 days per video',
    category: 'Video Production'
  },
  {
    id: 'bookkeeper',
    title: 'Bookkeeper',
    description: 'Monthly bookkeeping and financial record management',
    icon: BarChart,
    pricing: [
      { amount: 400, unit: 'per month', label: 'Basic (up to 50 transactions)' },
      { amount: 700, unit: 'per month', label: 'Standard (51-150 transactions)' },
      { amount: 1100, unit: 'per month', label: 'Premium (151-300 transactions)' }
    ],
    deliverables: [
      'Transaction categorization',
      'Bank reconciliation',
      'Monthly financial reports',
      'Expense tracking',
      'Invoice management'
    ],
    turnaround: 'Monthly ongoing',
    category: 'Finance'
  },
  {
    id: 'market-researcher',
    title: 'Market Research Analyst',
    description: 'Competitor analysis and market research reports',
    icon: Search,
    pricing: [
      { amount: 400, unit: 'per report', label: 'Basic Research Report' },
      { amount: 700, unit: 'per report', label: 'Comprehensive Report' },
      { amount: 1200, unit: 'per report', label: 'In-Depth Analysis with Strategy' }
    ],
    deliverables: [
      'Competitor analysis',
      'Market trends research',
      'Customer insights',
      'Actionable recommendations',
      'Professional presentation'
    ],
    turnaround: '7-10 days',
    category: 'Research'
  },
  {
    id: 'appointment-setter',
    title: 'Appointment Setter',
    description: 'Outbound calling and appointment booking services',
    icon: Calendar,
    pricing: [
      { amount: 500, unit: 'per month', label: 'Part-Time (20 hours/month)' },
      { amount: 900, unit: 'per month', label: 'Full-Time (40 hours/month)' },
      { amount: 1600, unit: 'per month', label: 'Intensive (80 hours/month)' }
    ],
    deliverables: [
      'Outbound calling',
      'Lead qualification',
      'Calendar scheduling',
      'CRM updates',
      'Daily activity reports'
    ],
    turnaround: 'Ongoing monthly',
    category: 'Sales Support'
  },
  {
    id: 'community-manager',
    title: 'Community Manager',
    description: 'Online community engagement and moderation',
    icon: Users,
    pricing: [
      { amount: 550, unit: 'per month', label: 'Basic (10 hours/week)' },
      { amount: 950, unit: 'per month', label: 'Standard (20 hours/week)' },
      { amount: 1700, unit: 'per month', label: 'Premium (40 hours/week)' }
    ],
    deliverables: [
      'Community moderation',
      'Member engagement',
      'Content posting',
      'Issue resolution',
      'Monthly engagement reports'
    ],
    turnaround: 'Ongoing monthly',
    category: 'Community Management'
  }
];

export default function HireJobsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = ['all', ...Array.from(new Set(jobServices.map(job => job.category)))];

  const filteredJobs = selectedCategory === 'all'
    ? jobServices
    : jobServices.filter(job => job.category === selectedCategory);

  const handleHireJob = async (job: JobService, pricing: { amount: number; unit: string; label: string }) => {
    if (!user) {
      alert('Please log in to hire');
      return;
    }

    setIsProcessing(true);
    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id, business_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!merchant) {
        alert('Merchant profile not found');
        return;
      }

      // Calculate partner payout (60% of price for partner, 40% platform fee)
      const partnerPayoutCents = Math.round(pricing.amount * 100 * 0.60);

      // Create job posting
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14 days default

      const jobRequirements = `
${job.title} - ${pricing.label}

Business: ${merchant.business_name}
Service Type: ${job.category}

Description:
${job.description}

Deliverables:
${job.deliverables.map(d => `- ${d}`).join('\n')}

Timeline: ${job.turnaround}
Package: ${pricing.label}
Merchant Budget: $${pricing.amount}
Partner Payout: $${(partnerPayoutCents / 100).toFixed(2)}

The merchant has requested professional ${job.title.toLowerCase()} services. Please review the requirements and submit your proposal if interested.
      `.trim();

      const { error: jobError } = await supabase
        .from('dfy_jobs')
        .insert({
          service_id: null,
          merchant_id: merchant.id,
          status: 'open',
          title: `${job.title} - ${merchant.business_name}`,
          requirements: jobRequirements,
          merchant_budget_cents: pricing.amount * 100,
          partner_payout_cents: partnerPayoutCents,
          due_date: dueDate.toISOString()
        });

      if (jobError) throw jobError;

      alert(`Job posted successfully! Partners can now apply for this ${job.title} position.`);

    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Briefcase className="w-4 h-4" />
            Work-From-Home Talent
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Hire Expert Remote Workers
          </h1>
          <p className="text-xl text-slate-600">
            Post jobs and get matched with skilled professionals from our partner network
          </p>
        </div>

        {/* Category Filter */}
        <Card variant="bordered">
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#2BB673] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category === 'all' ? 'All Services' : category}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Job Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => {
            const Icon = job.icon;
            return (
              <Card key={job.id} variant="bordered" className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2BB673] to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">{job.category}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-slate-600 mb-4">{job.description}</p>

                  {/* Deliverables */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-700 mb-2 uppercase">What You Get:</h4>
                    <ul className="space-y-1">
                      {job.deliverables.slice(0, 3).map((deliverable, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start">
                          <span className="text-[#2BB673] mr-1">•</span>
                          <span>{deliverable}</span>
                        </li>
                      ))}
                      {job.deliverables.length > 3 && (
                        <li className="text-xs text-slate-500 italic">
                          +{job.deliverables.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Turnaround */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-200">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{job.turnaround}</span>
                  </div>

                  {/* Pricing Options */}
                  <div className="space-y-2">
                    {job.pricing.map((pricing, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{pricing.label}</div>
                          <div className="text-xs text-slate-500">{pricing.unit}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold text-[#2BB673]">${pricing.amount}</div>
                          <Button
                            size="sm"
                            onClick={() => handleHireJob(job, pricing)}
                            disabled={isProcessing}
                            className="bg-[#2BB673] hover:bg-[#25a062]"
                          >
                            Hire
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Info Banner */}
        <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardBody>
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-2">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6 text-left">
                <div>
                  <div className="w-10 h-10 bg-[#2BB673] text-white rounded-full flex items-center justify-center font-bold mb-3">1</div>
                  <h4 className="font-semibold text-slate-900 mb-1">Post Your Job</h4>
                  <p className="text-sm text-slate-600">Select a service and package that fits your needs</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-[#2BB673] text-white rounded-full flex items-center justify-center font-bold mb-3">2</div>
                  <h4 className="font-semibold text-slate-900 mb-1">Get Matched</h4>
                  <p className="text-sm text-slate-600">Qualified partners from our network apply for the job</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-[#2BB673] text-white rounded-full flex items-center justify-center font-bold mb-3">3</div>
                  <h4 className="font-semibold text-slate-900 mb-1">Work Begins</h4>
                  <p className="text-sm text-slate-600">Your assigned partner delivers quality work on time</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Benefits */}
        <Card variant="bordered" className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardBody>
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">Why Hire Through Our Network?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2BB673] mb-2">Vetted</div>
                  <p className="text-slate-300 text-sm">All partners are screened and trained</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2BB673] mb-2">Quality</div>
                  <p className="text-slate-300 text-sm">High standards guaranteed or money back</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2BB673] mb-2">Support</div>
                  <p className="text-slate-300 text-sm">Dedicated support throughout the project</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
