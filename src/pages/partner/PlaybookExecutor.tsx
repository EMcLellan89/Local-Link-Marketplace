import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Play, Zap, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import { DEV_MODE } from '../../lib/devMode';

interface Module {
  id: string;
  title: string;
  description: string | null;
  display_order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  video_url: string | null;
  video_duration_seconds: number | null;
  display_order: number;
  completed?: boolean;
}

export default function PlaybookExecutor() {
  const { playbookSlug } = useParams<{ playbookSlug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playbook, setPlaybook] = useState<any>(null);
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
        .select('*')
        .eq('playbook_id', playbookData.id)
        .order('display_order');

      const modulesWithLessons = await Promise.all(
        (modulesData || []).map(async (module) => {
          const { data: lessonsData } = await supabase
            .from('partner_playbook_lessons')
            .select('*')
            .eq('module_id', module.id)
            .order('display_order');

          let lessonsWithProgress = lessonsData || [];

          if (user) {
            const { data: progressData } = await supabase
              .from('partner_playbook_progress')
              .select('lesson_id, completed')
              .eq('user_id', user.id)
              .in('lesson_id', lessonsData?.map(l => l.id) || []);

            const progressMap = new Map(progressData?.map(p => [p.lesson_id, p.completed]) || []);
            lessonsWithProgress = lessonsData?.map(lesson => ({
              ...lesson,
              completed: progressMap.get(lesson.id) || false
            })) || [];
          }

          return {
            ...module,
            lessons: lessonsWithProgress
          };
        })
      );

      setModules(modulesWithLessons);
    } catch (err) {
      console.error('Error loading playbook:', err);
      navigate('/partner/playbooks');
    } finally {
      setLoading(false);
    }
  }

  function loadDevModePlaybook() {
    setPlaybook({
      id: playbookSlug,
      slug: playbookSlug,
      title: getPlaybookTitle(playbookSlug || ''),
      subtitle: 'Complete execution system',
      description: 'Follow these steps to execute this playbook and start earning',
      category: 'sales-skills',
      difficulty_level: 'intermediate',
      estimated_duration_minutes: 180
    });

    // Check if this is a product training playbook
    const isProductTraining = playbookSlug?.startsWith('selling-') || playbookSlug === 'bundle-strategy-playbook';

    const mockModules: Module[] = isProductTraining ? getProductTrainingModules() : [
      {
        id: 'module-1',
        title: 'Module 1: Foundation & Setup',
        description: 'Get your systems in place and understand the fundamentals',
        display_order: 1,
        lessons: [
          { id: 'lesson-1-1', title: 'Introduction & Overview', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 720, display_order: 1, completed: false },
          { id: 'lesson-1-2', title: 'Setting Up Your Tools', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 900, display_order: 2, completed: false },
          { id: 'lesson-1-3', title: 'Understanding Your Target Market', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 840, display_order: 3, completed: false },
          { id: 'lesson-1-4', title: 'Your Value Proposition', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 660, display_order: 4, completed: false },
          { id: 'lesson-1-5', title: 'Getting Started Checklist', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 480, display_order: 5, completed: false }
        ]
      },
      {
        id: 'module-2',
        title: 'Module 2: Core Execution',
        description: 'Step-by-step process to execute this playbook',
        display_order: 2,
        lessons: [
          { id: 'lesson-2-1', title: 'Step 1: Prospecting System', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 960, display_order: 1, completed: false },
          { id: 'lesson-2-2', title: 'Step 2: Initial Outreach Scripts', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 1020, display_order: 2, completed: false },
          { id: 'lesson-2-3', title: 'Step 3: Discovery Call Framework', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 1140, display_order: 3, completed: false },
          { id: 'lesson-2-4', title: 'Step 4: Presentation & Demo', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 1080, display_order: 4, completed: false },
          { id: 'lesson-2-5', title: 'Step 5: Handling Objections', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 900, display_order: 5, completed: false },
          { id: 'lesson-2-6', title: 'Step 6: Closing the Deal', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 840, display_order: 6, completed: false }
        ]
      },
      {
        id: 'module-3',
        title: 'Module 3: Advanced Strategies',
        description: 'Take it to the next level with advanced tactics',
        display_order: 3,
        lessons: [
          { id: 'lesson-3-1', title: 'Upselling & Cross-Selling', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 780, display_order: 1, completed: false },
          { id: 'lesson-3-2', title: 'Building Long-Term Relationships', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 720, display_order: 2, completed: false },
          { id: 'lesson-3-3', title: 'Referral Generation System', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 660, display_order: 3, completed: false },
          { id: 'lesson-3-4', title: 'Advanced Negotiation Tactics', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 900, display_order: 4, completed: false }
        ]
      },
      {
        id: 'module-4',
        title: 'Module 4: Implementation & Scaling',
        description: 'Put everything into practice and scale your results',
        display_order: 4,
        lessons: [
          { id: 'lesson-4-1', title: 'Your 30-Day Action Plan', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 960, display_order: 1, completed: false },
          { id: 'lesson-4-2', title: 'Tracking & Measuring Success', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 720, display_order: 2, completed: false },
          { id: 'lesson-4-3', title: 'Scaling Your Territory', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 840, display_order: 3, completed: false },
          { id: 'lesson-4-4', title: 'Building Your Sub-Partner Team', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 1020, display_order: 4, completed: false },
          { id: 'lesson-4-5', title: 'Ongoing Support & Resources', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 600, display_order: 5, completed: false }
        ]
      }
    ];

    setModules(mockModules);
    setLoading(false);
  }

  function getProductTrainingModules(): Module[] {
    return [
      {
        id: 'module-1',
        title: 'Module 1: Product Overview & Value Proposition',
        description: 'Understand the product, features, and why businesses need it',
        display_order: 1,
        lessons: [
          { id: 'lesson-1-1', title: 'Product Introduction & Overview', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 840, display_order: 1, completed: false },
          { id: 'lesson-1-2', title: 'Key Features & Benefits', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 720, display_order: 2, completed: false },
          { id: 'lesson-1-3', title: 'Who This Product Is For (Target Market)', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 660, display_order: 3, completed: false },
          { id: 'lesson-1-4', title: 'Value Proposition & ROI Calculator', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 900, display_order: 4, completed: false },
          { id: 'lesson-1-5', title: 'Competitive Advantages', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 540, display_order: 5, completed: false }
        ]
      },
      {
        id: 'module-2',
        title: 'Module 2: Pricing, Packages & Commission Structure',
        description: 'Complete breakdown of pricing tiers and how you earn',
        display_order: 2,
        lessons: [
          { id: 'lesson-2-1', title: 'Complete Pricing Breakdown', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 1020, display_order: 1, completed: false },
          { id: 'lesson-2-2', title: 'Package Tiers & Add-Ons', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 840, display_order: 2, completed: false },
          { id: 'lesson-2-3', title: 'Your Commission Structure (Exact Numbers)', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 1140, display_order: 3, completed: false },
          { id: 'lesson-2-4', title: 'Recurring vs One-Time Commissions', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 720, display_order: 4, completed: false },
          { id: 'lesson-2-5', title: 'Income Examples & Scenarios', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 900, display_order: 5, completed: false },
          { id: 'lesson-2-6', title: 'How & When You Get Paid', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 480, display_order: 6, completed: false }
        ]
      },
      {
        id: 'module-3',
        title: 'Module 3: Sales Process & Demo',
        description: 'Step-by-step sales scripts and live demo walkthrough',
        display_order: 3,
        lessons: [
          { id: 'lesson-3-1', title: 'Discovery Questions & Qualifying', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 960, display_order: 1, completed: false },
          { id: 'lesson-3-2', title: 'Opening Script & Hook', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 660, display_order: 2, completed: false },
          { id: 'lesson-3-3', title: 'Product Demo Walkthrough', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 1260, display_order: 3, completed: false },
          { id: 'lesson-3-4', title: 'Presenting Pricing & Packages', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 780, display_order: 4, completed: false },
          { id: 'lesson-3-5', title: 'Trial Close & Closing Scripts', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 840, display_order: 5, completed: false }
        ]
      },
      {
        id: 'module-4',
        title: 'Module 4: Objections, Case Studies & Certification',
        description: 'Handle objections, see real results, and get certified',
        display_order: 4,
        lessons: [
          { id: 'lesson-4-1', title: 'Top 10 Objections & Responses', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 1080, display_order: 1, completed: false },
          { id: 'lesson-4-2', title: 'Price Objection Handling', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 720, display_order: 2, completed: false },
          { id: 'lesson-4-3', title: 'Case Studies & Success Stories', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 900, display_order: 3, completed: false },
          { id: 'lesson-4-4', title: 'Sales Assets & Resources', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 540, display_order: 4, completed: false },
          { id: 'lesson-4-5', title: 'Certification Exam (Pass to Sell)', video_url: 'https://player.vimeo.com/video/76979871', video_duration_seconds: 300, display_order: 5, completed: false }
        ]
      }
    ];
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

  async function handleLessonClick(lesson: Lesson) {
    navigate(`/partner/playbooks/${playbookSlug}/lesson/${lesson.id}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!playbook) return null;

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter(l => l.completed).length,
    0
  );
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(`/partner/playbooks/${playbookSlug}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Playbook
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{playbook.title}</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">
              <Zap className="h-4 w-4" />
              FREE
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedLessons} / {totalLessons} steps completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {moduleIndex + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{module.title}</h3>
                    {module.description && (
                      <p className="text-orange-100 text-sm">{module.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {module.lessons.map((lesson, lessonIndex) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Play className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {lessonIndex + 1}. {lesson.title}
                      </div>
                      {lesson.video_duration_seconds && (
                        <div className="text-sm text-gray-500">
                          {Math.ceil(lesson.video_duration_seconds / 60)} min
                        </div>
                      )}
                    </div>

                    <Zap className="h-5 w-5 text-orange-600" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
