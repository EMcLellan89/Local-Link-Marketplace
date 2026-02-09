import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BookOpen, CheckCircle2, Zap, ArrowLeft, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import { SEO } from '../../components/SEO';
import { DEV_MODE } from '../../lib/devMode';

interface Playbook {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  difficulty_level: string;
  estimated_duration_minutes: number;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  display_order: number;
  lesson_count: number;
}

export default function PlaybookDetail() {
  const { playbookSlug } = useParams<{ playbookSlug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaybook();
  }, [playbookSlug]);

  async function loadPlaybook() {
    try {
      if (!DEV_MODE && !user) {
        navigate('/partner/login');
        return;
      }

      if (DEV_MODE) {
        loadDevModePlaybook();
        return;
      }

      const { data: playbookData, error: playbookError } = await supabase
        .from('partner_playbooks')
        .select('*')
        .eq('slug', playbookSlug)
        .single();

      if (playbookError) throw playbookError;

      setPlaybook(playbookData);

      const { data: modulesData } = await supabase
        .from('partner_playbook_modules')
        .select('*, partner_playbook_lessons(count)')
        .eq('playbook_id', playbookData.id)
        .order('display_order');

      const formattedModules = modulesData?.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        display_order: m.display_order,
        lesson_count: m.partner_playbook_lessons?.[0]?.count || 0
      })) || [];

      setModules(formattedModules);
    } catch (err) {
      console.error('Error loading playbook:', err);
      navigate('/partner/playbooks');
    } finally {
      setLoading(false);
    }
  }

  function loadDevModePlaybook() {
    const isProductTraining = playbookSlug?.startsWith('selling-') || playbookSlug === 'bundle-strategy-playbook';

    // Create playbook data based on slug
    const playbookData: Playbook = {
      id: playbookSlug || 'default',
      slug: playbookSlug || 'default',
      title: getPlaybookTitle(playbookSlug || ''),
      subtitle: getPlaybookSubtitle(playbookSlug || ''),
      description: getPlaybookDescription(playbookSlug || ''),
      thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      category: isProductTraining ? 'product-training' : 'core-systems',
      difficulty_level: 'intermediate',
      estimated_duration_minutes: 180
    };

    setPlaybook(playbookData);

    // Create sample modules based on playbook type
    const modulesData: Module[] = isProductTraining ? [
      {
        id: 'module-1',
        title: 'Product Overview & Value Proposition',
        description: 'Understand the product, features, and why businesses need it',
        display_order: 1,
        lesson_count: 5
      },
      {
        id: 'module-2',
        title: 'Pricing, Packages & Commission Structure',
        description: 'Complete breakdown of pricing tiers and how you earn',
        display_order: 2,
        lesson_count: 6
      },
      {
        id: 'module-3',
        title: 'Sales Process & Demo',
        description: 'Step-by-step sales scripts and live demo walkthrough',
        display_order: 3,
        lesson_count: 5
      },
      {
        id: 'module-4',
        title: 'Objections, Case Studies & Certification',
        description: 'Handle objections, see real results, and get certified',
        display_order: 4,
        lesson_count: 5
      }
    ] : [
      {
        id: 'module-1',
        title: 'Foundation & Setup',
        description: 'Get your systems in place and understand the fundamentals',
        display_order: 1,
        lesson_count: 5
      },
      {
        id: 'module-2',
        title: 'Core Execution',
        description: 'Step-by-step process to execute this playbook',
        display_order: 2,
        lesson_count: 6
      },
      {
        id: 'module-3',
        title: 'Advanced Strategies',
        description: 'Take it to the next level with advanced tactics',
        display_order: 3,
        lesson_count: 4
      },
      {
        id: 'module-4',
        title: 'Implementation & Scaling',
        description: 'Put everything into practice and scale your results',
        display_order: 4,
        lesson_count: 5
      }
    ];

    setModules(modulesData);
    setLoading(false);
  }

  function getPlaybookTitle(slug: string): string {
    const titles: Record<string, string> = {
      'partner-accelerator': 'Partner Accelerator',
      'territory-management': 'Territory Management System',
      'commission-maximizer': 'Commission Maximizer',
      'selling-recurring-revenue': 'Selling Recurring Revenue',
      'selling-postcard-ads': 'Selling Postcard Ads',
      'objection-handling': 'Objection Handling Scripts',
      'high-ticket-closing': 'High-Ticket Closing System',
      'discovery-calls': 'Discovery Call Framework',
      'marketing-for-trades': 'Marketing for Trades',
      'local-paws-passport': 'Selling to Pet Businesses',
      'restaurants-bars': 'Restaurants & Bars',
      'health-wellness': 'Health & Wellness',
      'professional-services': 'Professional Services',
      'ai-content-creation': 'AI Content Creation for Clients',
      'ugc-creation': 'UGC Creation for Partners',
      'social-media-management': 'Social Media Management',
      'email-marketing': 'Email Marketing Services',
      'blog-writing': 'Blog Writing for Local Businesses',
      'business-coach-cert': 'Business Coach Certification',
      'marketing-consultant-cert': 'Marketing Consultant Certification',
      'sales-mastery-cert': 'Sales Mastery Certification',
      'referral-engine': 'Referral Engine System',
      'networking-events': 'Networking Events That Convert',
      'cold-outreach': 'Cold Outreach Playbook',
      'time-management': 'Partner Time Management',
      'scaling-your-partnership': 'Scaling Your Partnership',
      'selling-frontdesk-ai-pro': 'Selling FrontDesk AI Pro',
      'selling-vertical-ai-licensing': 'Selling Vertical AI Licensing',
      'selling-dfy-services': 'Selling DFY Services',
      'selling-local-paws-passport': 'Selling Local Paws Passport',
      'selling-my-budget-buster': 'Selling My Budget Buster',
      'selling-customer-referral-engine': 'Selling Customer Referral Engine',
      'selling-partner-crm': 'Selling Partner CRM',
      'selling-communications-hub': 'Selling Communications Hub',
      'selling-merchant-services': 'Selling Merchant Services',
      'selling-job-board-services': 'Selling Job Board Services',
      'selling-blog-growth-system': 'Selling Blog Growth System',
      'selling-business-coaching': 'Selling Business Coaching',
      'selling-printing-swag': 'Selling Printing & Swag',
      'selling-academy-courses': 'Selling Academy Courses',
      'selling-appointment-setting': 'Selling Appointment Setting',
      'bundle-strategy-playbook': 'Bundle Strategy Playbook'
    };
    return titles[slug] || 'Playbook Title';
  }

  function getPlaybookSubtitle(slug: string): string {
    const subtitles: Record<string, string> = {
      'partner-accelerator': 'Complete partner onboarding & business setup',
      'selling-recurring-revenue': 'Monthly income selling subscriptions',
      'selling-postcard-ads': 'Easy $197-$497 commissions per sale',
      'marketing-for-trades': 'Sell to contractors, plumbers, electricians',
      'selling-frontdesk-ai-pro': 'Earn 20-40% recurring commissions',
      'selling-vertical-ai-licensing': 'White-label AI for specific industries',
      'selling-dfy-services': 'Easy commissions on done-for-you work',
      'selling-local-paws-passport': 'Pet business marketing system - $197-$497',
      'selling-my-budget-buster': 'AI budgeting app for consumers',
      'selling-customer-referral-engine': 'Turn customers into affiliates',
      'selling-partner-crm': 'Required subscription for all partners',
      'selling-communications-hub': 'Email, SMS, and voice for businesses',
      'selling-merchant-services': 'Core subscriptions for local businesses',
      'selling-job-board-services': 'Hiring solutions for businesses',
      'selling-blog-growth-system': 'Monthly blog writing service',
      'selling-business-coaching': 'High-ticket coaching packages',
      'selling-printing-swag': 'Physical products & promotional items',
      'selling-academy-courses': 'Digital courses for merchants & partners',
      'selling-appointment-setting': 'AI-powered booking for businesses',
      'bundle-strategy-playbook': 'Package products for maximum value'
    };
    return subtitles[slug] || 'Master this system and start earning';
  }

  function getPlaybookDescription(slug: string): string {
    return 'This comprehensive playbook walks you through everything you need to know to successfully execute this strategy and start earning commissions as a Local-Link partner.';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading playbook...</p>
        </div>
      </div>
    );
  }

  if (!playbook) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Playbook not found</p>
          <Button onClick={() => navigate('/partner/playbooks')} className="mt-4">
            Back to Playbooks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={playbook.title} description={playbook.subtitle || playbook.description || ''} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('/partner/playbooks')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Playbooks
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 rounded-full text-sm font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  FREE - Included with Partnership
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  {playbook.estimated_duration_minutes} minutes
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {playbook.difficulty_level.charAt(0).toUpperCase() + playbook.difficulty_level.slice(1)}
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">{playbook.title}</h1>

              {playbook.subtitle && (
                <p className="text-xl text-orange-100 mb-6">{playbook.subtitle}</p>
              )}

              {playbook.description && (
                <p className="text-orange-100 mb-8">{playbook.description}</p>
              )}

              {playbook.category === 'product-training' && (
                <div className="bg-yellow-500 text-gray-900 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-lg mb-1">Certification Required</p>
                      <p className="text-sm">Complete this training and pass the exam to be approved to sell this product</p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={() => navigate(`/partner/playbooks/${playbookSlug}/execute`)}
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Executing
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Execute</h2>

              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {module.title}
                        </h3>

                        {module.description && (
                          <p className="text-gray-600 mb-3">{module.description}</p>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <BookOpen className="h-4 w-4" />
                          <span>{module.lesson_count} Steps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-4">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold mb-4">
                    <CheckCircle2 className="h-4 w-4" />
                    100% Free for Partners
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">This Playbook Includes:</h3>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Lifetime access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{modules.length} execution modules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Ready-to-use scripts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Video walkthroughs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Downloadable templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Partner community access</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => navigate(`/partner/playbooks/${playbookSlug}/execute`)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start Executing
                </Button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Connect with your partner success manager or join the partner community for support.
                  </p>
                  <Button
                    onClick={() => navigate('/partner/support')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Get Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
