import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BookOpen, Award, Users, GraduationCap, Target, TrendingUp, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';
import { SEO } from '../../components/SEO';
import { DEV_MODE, BYPASS_MODE } from '../../lib/devMode';

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
  is_published: boolean;
}

export default function PlaybooksPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaybooks();
  }, []);

  async function loadPlaybooks() {
    try {
      if (!DEV_MODE && !BYPASS_MODE && !user) {
        navigate('/partner/login');
        return;
      }

      // In bypass mode or dev mode, query the real database
      // The database has 26 real playbooks seeded from migrations
      if (!DEV_MODE) {
        const { data, error } = await supabase
          .from('partner_playbooks')
          .select('*')
          .eq('is_published', true)
          .order('category', { ascending: true })
          .order('title', { ascending: true });

        if (error) {
          console.error('Error loading playbooks:', error);
          // If RLS blocks us in bypass mode, that's OK - show empty state
          setPlaybooks([]);
        } else {
          setPlaybooks(data || []);
        }
        setLoading(false);
        return;
      }

      if (DEV_MODE) {
        // Dev Mode: Load comprehensive playbook library (26 playbooks)
        setPlaybooks([
          // CORE SYSTEMS (3 playbooks)
          {
            id: '1',
            slug: 'partner-accelerator',
            title: 'Partner Accelerator',
            subtitle: 'Complete partner onboarding & business setup',
            description: 'Everything you need to launch as a Local-Link partner and start earning commissions',
            thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
            category: 'core-systems',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 240,
            is_published: true
          },
          {
            id: '2',
            slug: 'territory-management',
            title: 'Territory Management System',
            subtitle: 'Build and protect your territory',
            description: 'Learn how to claim, expand, and protect your territory for maximum earnings',
            thumbnail_url: 'https://images.pexels.com/photos/6224/hands-people-woman-working.jpg',
            category: 'core-systems',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '3',
            slug: 'commission-maximizer',
            title: 'Commission Maximizer',
            subtitle: 'Earn more on every sale',
            description: 'Advanced strategies to maximize your commission on every deal you close',
            thumbnail_url: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg',
            category: 'core-systems',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 90,
            is_published: true
          },
          // SALES SKILLS (5 playbooks)
          {
            id: '4',
            slug: 'selling-recurring-revenue',
            title: 'Selling Recurring Revenue',
            subtitle: 'Monthly income selling subscriptions',
            description: 'Master selling high-ticket subscription services to local businesses',
            thumbnail_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
            category: 'sales-skills',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 180,
            is_published: true
          },
          {
            id: '5',
            slug: 'selling-postcard-ads',
            title: 'Selling Postcard Ads',
            subtitle: 'Easy $197-$497 commissions per sale',
            description: 'Simple system to sell postcard advertising to local businesses',
            thumbnail_url: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
            category: 'sales-skills',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '6',
            slug: 'objection-handling',
            title: 'Objection Handling Scripts',
            subtitle: 'Turn "no" into "yes"',
            description: 'Word-for-word scripts to handle every common objection from local businesses',
            thumbnail_url: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg',
            category: 'sales-skills',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 90,
            is_published: true
          },
          {
            id: '7',
            slug: 'high-ticket-closing',
            title: 'High-Ticket Closing System',
            subtitle: 'Close $1,000+ deals consistently',
            description: 'Step-by-step system for closing high-value packages to businesses',
            thumbnail_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
            category: 'sales-skills',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 180,
            is_published: true
          },
          {
            id: '8',
            slug: 'discovery-calls',
            title: 'Discovery Call Framework',
            subtitle: 'Book and convert discovery calls',
            description: 'Proven framework for running discovery calls that close',
            thumbnail_url: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
            category: 'sales-skills',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 120,
            is_published: true
          },
          // INDUSTRY-SPECIFIC (5 playbooks)
          {
            id: '9',
            slug: 'marketing-for-trades',
            title: 'Marketing for Trades',
            subtitle: 'Sell to contractors, plumbers, electricians',
            description: 'Industry-specific selling playbook for trade businesses',
            thumbnail_url: 'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg',
            category: 'industry-specific',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 150,
            is_published: true
          },
          {
            id: '10',
            slug: 'local-paws-passport',
            title: 'Selling to Pet Businesses',
            subtitle: 'Groomers, vets, trainers, kennels',
            description: 'Specialized playbook for selling to pet service businesses',
            thumbnail_url: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg',
            category: 'industry-specific',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '11',
            slug: 'restaurants-bars',
            title: 'Restaurants & Bars',
            subtitle: 'Sell to food & beverage businesses',
            description: 'Scripts and systems for selling to restaurants, bars, and cafes',
            thumbnail_url: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
            category: 'industry-specific',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '12',
            slug: 'health-wellness',
            title: 'Health & Wellness',
            subtitle: 'Gyms, spas, salons, chiropractors',
            description: 'Tailored approach for selling to health and wellness businesses',
            thumbnail_url: 'https://images.pexels.com/photos/3768163/pexels-photo-3768163.jpeg',
            category: 'industry-specific',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '13',
            slug: 'professional-services',
            title: 'Professional Services',
            subtitle: 'Lawyers, accountants, consultants',
            description: 'How to sell to high-end professional service providers',
            thumbnail_url: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg',
            category: 'industry-specific',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 150,
            is_published: true
          },
          // CONTENT & DIGITAL (5 playbooks)
          {
            id: '14',
            slug: 'ai-content-creation',
            title: 'AI Content Creation for Clients',
            subtitle: 'Use AI to create content',
            description: 'Leverage AI tools to create content and earn additional income',
            thumbnail_url: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
            category: 'content-digital',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 150,
            is_published: true
          },
          {
            id: '15',
            slug: 'ugc-creation',
            title: 'UGC Creation for Partners',
            subtitle: 'Create content from home',
            description: 'Learn to create UGC content and earn from Local-Link businesses',
            thumbnail_url: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
            category: 'content-digital',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '16',
            slug: 'social-media-management',
            title: 'Social Media Management',
            subtitle: 'Monthly retainer income',
            description: 'Offer social media management services to your clients for recurring revenue',
            thumbnail_url: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
            category: 'content-digital',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 180,
            is_published: true
          },
          {
            id: '17',
            slug: 'email-marketing',
            title: 'Email Marketing Services',
            subtitle: 'Sell email campaigns to businesses',
            description: 'Package and sell email marketing services for consistent commissions',
            thumbnail_url: 'https://images.pexels.com/photos/5952647/pexels-photo-5952647.jpeg',
            category: 'content-digital',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 150,
            is_published: true
          },
          {
            id: '18',
            slug: 'blog-writing',
            title: 'Blog Writing for Local Businesses',
            subtitle: 'Get paid to write',
            description: 'Create blog content for local businesses and earn monthly retainers',
            thumbnail_url: 'https://images.pexels.com/photos/34600/pexels-photo.jpg',
            category: 'content-digital',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 120,
            is_published: true
          },
          // CERTIFICATIONS (3 playbooks)
          {
            id: '19',
            slug: 'business-coach-cert',
            title: 'Business Coach Certification',
            subtitle: 'Get certified as a business coach',
            description: 'Complete certification program to become a certified business coach',
            thumbnail_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
            category: 'certifications',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 360,
            is_published: true
          },
          {
            id: '20',
            slug: 'marketing-consultant-cert',
            title: 'Marketing Consultant Certification',
            subtitle: 'Become a certified marketing consultant',
            description: 'Earn your marketing consultant certification and unlock premium opportunities',
            thumbnail_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
            category: 'certifications',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 300,
            is_published: true
          },
          {
            id: '21',
            slug: 'sales-mastery-cert',
            title: 'Sales Mastery Certification',
            subtitle: 'Master the art of selling',
            description: 'Complete certification in sales methodology and psychology',
            thumbnail_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
            category: 'certifications',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 240,
            is_published: true
          },
          // GENERAL (5 playbooks)
          {
            id: '22',
            slug: 'referral-engine',
            title: 'Referral Engine System',
            subtitle: 'Get referrals from every client',
            description: 'Build a system that generates consistent referrals from satisfied clients',
            thumbnail_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
            category: 'general',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 90,
            is_published: true
          },
          {
            id: '23',
            slug: 'networking-events',
            title: 'Networking Events That Convert',
            subtitle: 'Turn networking into sales',
            description: 'System for attending events and converting contacts into clients',
            thumbnail_url: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg',
            category: 'general',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 90,
            is_published: true
          },
          {
            id: '24',
            slug: 'cold-outreach',
            title: 'Cold Outreach Playbook',
            subtitle: 'Book meetings with cold prospects',
            description: 'Proven cold outreach sequences that get responses and book calls',
            thumbnail_url: 'https://images.pexels.com/photos/4467855/pexels-photo-4467855.jpeg',
            category: 'general',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '25',
            slug: 'time-management',
            title: 'Partner Time Management',
            subtitle: 'Work smarter, not harder',
            description: 'Optimize your schedule to close more deals in less time',
            thumbnail_url: 'https://images.pexels.com/photos/273011/pexels-photo-273011.jpeg',
            category: 'general',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 60,
            is_published: true
          },
          {
            id: '26',
            slug: 'scaling-your-partnership',
            title: 'Scaling Your Partnership',
            subtitle: 'Go from solo to team',
            description: 'Build a team of sub-partners and scale your territory',
            thumbnail_url: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg',
            category: 'general',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 180,
            is_published: true
          },
          // PRODUCT TRAINING (15+ playbooks covering all Local-Link products)
          {
            id: '27',
            slug: 'selling-frontdesk-ai-pro',
            title: 'Selling FrontDesk AI Pro',
            subtitle: 'Earn 20-40% recurring commissions',
            description: 'Complete training on selling our flagship AI platform - pricing, demos, objections, and commissions',
            thumbnail_url: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg',
            category: 'product-training',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 240,
            is_published: true
          },
          {
            id: '28',
            slug: 'selling-vertical-ai-licensing',
            title: 'Selling Vertical AI Licensing',
            subtitle: 'White-label AI for specific industries',
            description: 'Learn to sell CleanDesk, VetDesk, PawsDesk, and other vertical AI solutions with recurring revenue',
            thumbnail_url: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg',
            category: 'product-training',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 180,
            is_published: true
          },
          {
            id: '29',
            slug: 'selling-dfy-services',
            title: 'Selling DFY Services',
            subtitle: 'Easy commissions on done-for-you work',
            description: 'Complete guide to selling websites, funnels, lead capture, and all DFY services - pricing & commissions included',
            thumbnail_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
            category: 'product-training',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 180,
            is_published: true
          },
          {
            id: '30',
            slug: 'selling-local-paws-passport',
            title: 'Selling Local Paws Passport',
            subtitle: 'Pet business marketing system',
            description: 'Everything about Local Paws Passport - target market, pricing ($197-$497), commissions, and why pet businesses need it',
            thumbnail_url: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg',
            category: 'product-training',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '31',
            slug: 'selling-my-budget-buster',
            title: 'Selling My Budget Buster',
            subtitle: 'AI budgeting app for consumers',
            description: 'Position and sell My Budget Buster to individual customers - pricing, features, and commission structure',
            thumbnail_url: 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg',
            category: 'product-training',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 90,
            is_published: true
          },
          {
            id: '32',
            slug: 'selling-customer-referral-engine',
            title: 'Selling Customer Referral Engine',
            subtitle: 'Turn customers into affiliates',
            description: 'Sell businesses the Customer Referral Engine - pricing, ROI case studies, and setup process',
            thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
            category: 'product-training',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 150,
            is_published: true
          },
          {
            id: '33',
            slug: 'selling-partner-crm',
            title: 'Selling Partner CRM',
            subtitle: 'Required subscription for all partners',
            description: 'Position and sell Partner CRM tiers - why partners need it and how to upgrade them through tiers',
            thumbnail_url: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
            category: 'product-training',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 90,
            is_published: true
          },
          {
            id: '34',
            slug: 'selling-communications-hub',
            title: 'Selling Communications Hub',
            subtitle: 'Email, SMS, and voice for businesses',
            description: 'Complete training on Communications Hub - pricing tiers, use cases, and commission structure',
            thumbnail_url: 'https://images.pexels.com/photos/4050298/pexels-photo-4050298.jpeg',
            category: 'product-training',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 150,
            is_published: true
          },
          {
            id: '35',
            slug: 'selling-merchant-services',
            title: 'Selling Merchant Services',
            subtitle: 'Core subscriptions for local businesses',
            description: 'Master selling CRM, marketing automation, loyalty programs, and all merchant platform features',
            thumbnail_url: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg',
            category: 'product-training',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 240,
            is_published: true
          },
          {
            id: '36',
            slug: 'selling-job-board-services',
            title: 'Selling Job Board Services',
            subtitle: 'Hiring solutions for businesses',
            description: 'Position job board services - pricing, target market, and how partners earn on placements',
            thumbnail_url: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
            category: 'product-training',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '37',
            slug: 'selling-blog-growth-system',
            title: 'Selling Blog Growth System',
            subtitle: 'Monthly blog writing service',
            description: 'Complete playbook for selling blog writing services - pricing, deliverables, and recurring commissions',
            thumbnail_url: 'https://images.pexels.com/photos/34600/pexels-photo.jpg',
            category: 'product-training',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '38',
            slug: 'selling-business-coaching',
            title: 'Selling Business Coaching',
            subtitle: 'High-ticket coaching packages',
            description: 'Position and sell business coaching services - $997-$5,000 packages with high commissions',
            thumbnail_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
            category: 'product-training',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 180,
            is_published: true
          },
          {
            id: '39',
            slug: 'selling-printing-swag',
            title: 'Selling Printing & Swag',
            subtitle: 'Physical products & promotional items',
            description: 'Sell postcards, business cards, promotional swag - pricing, margins, and fulfillment process',
            thumbnail_url: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
            category: 'product-training',
            difficulty_level: 'beginner',
            estimated_duration_minutes: 90,
            is_published: true
          },
          {
            id: '40',
            slug: 'selling-academy-courses',
            title: 'Selling Academy Courses',
            subtitle: 'Digital courses for merchants & partners',
            description: 'Sell Merchant Academy and Partner Academy courses - pricing, commissions, and upsell strategies',
            thumbnail_url: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg',
            category: 'product-training',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 150,
            is_published: true
          },
          {
            id: '41',
            slug: 'selling-appointment-setting',
            title: 'Selling Appointment Setting',
            subtitle: 'AI-powered booking for businesses',
            description: 'Position AI appointment setting service - pricing models, ROI, and recurring revenue opportunities',
            thumbnail_url: 'https://images.pexels.com/photos/5699478/pexels-photo-5699478.jpeg',
            category: 'product-training',
            difficulty_level: 'intermediate',
            estimated_duration_minutes: 120,
            is_published: true
          },
          {
            id: '42',
            slug: 'bundle-strategy-playbook',
            title: 'Bundle Strategy Playbook',
            subtitle: 'Package products for maximum value',
            description: 'Learn to create high-value bundles combining multiple products - maximize commissions per sale',
            thumbnail_url: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg',
            category: 'product-training',
            difficulty_level: 'advanced',
            estimated_duration_minutes: 180,
            is_published: true
          }
        ]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('partner_playbooks')
        .select('*')
        .eq('is_published', true)
        .order('title');

      if (error) throw error;

      setPlaybooks(data || []);
    } catch (err) {
      console.error('Error loading playbooks:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading playbooks...</p>
        </div>
      </div>
    );
  }

  const categoryMap = {
    'core-systems': {
      icon: Target,
      title: 'Core Partner Systems',
      description: 'Essential playbooks to launch and scale your partnership'
    },
    'product-training': {
      icon: GraduationCap,
      title: 'Product Training & Certification',
      description: 'Learn to sell every Local-Link product - pricing, commissions, scripts, and certification'
    },
    'sales-skills': {
      icon: TrendingUp,
      title: 'Sales & Commission Skills',
      description: 'Master selling to local businesses and maximize earnings'
    },
    'content-digital': {
      icon: Zap,
      title: 'Content & Digital Income',
      description: 'Create content and leverage AI for additional revenue'
    },
    'industry-specific': {
      icon: Users,
      title: 'Industry-Specific Selling',
      description: 'Specialize in specific industries for higher conversions'
    },
    'certifications': {
      icon: Award,
      title: 'Certifications & Enablement',
      description: 'Get certified and unlock premium opportunities'
    },
    'general': {
      icon: BookOpen,
      title: 'Additional Playbooks',
      description: 'More execution systems to grow your business'
    }
  };

  const categorizedPlaybooks = playbooks.reduce((acc, playbook) => {
    const category = playbook.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(playbook);
    return acc;
  }, {} as Record<string, Playbook[]>);

  return (
    <>
      <SEO title="Partner Playbooks" description="Free execution playbooks for Local-Link partners - scripts, systems, and selling guides" />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Partner Playbooks
              </div>

              <h1 className="text-5xl font-bold mb-4">
                Execution Playbooks for Partners
              </h1>

              <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
                Step-by-step systems, scripts, and selling guides - Everything you need to close deals and earn commissions. 100% FREE for partners.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{playbooks.length} Free Playbooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span>Ready-to-Use Scripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Proven Selling Systems</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {Object.entries(categoryMap).map(([categoryKey, categoryInfo]) => {
            const categoryPlaybooks = categorizedPlaybooks[categoryKey];
            if (!categoryPlaybooks || categoryPlaybooks.length === 0) return null;

            const Icon = categoryInfo.icon;

            return (
              <section key={categoryKey} className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="h-8 w-8 text-orange-600" />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{categoryInfo.title}</h2>
                    <p className="text-gray-600">{categoryInfo.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPlaybooks.map(playbook => (
                    <PlaybookCard key={playbook.slug} playbook={playbook} navigate={navigate} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* Profit Network Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Local-Link Profit Network™</h2>
                  <p className="text-green-100 text-lg">Pre-sold businesses. 25% flat commission. We cover your first 8 weeks of ads.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">25%</div>
                  <div className="text-green-100 text-sm">Flat Commission Rate</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">$1,120</div>
                  <div className="text-green-100 text-sm">Free Ad Startup (8 weeks)</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">+10%</div>
                  <div className="text-green-100 text-sm">Bonus Opportunities</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-3">How It Works:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 mt-0.5">✓</span>
                    <span>Choose from approved businesses that are pre-sold with FB ads and bots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 mt-0.5">✓</span>
                    <span>Get your unique tracking link - we set everything up for you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 mt-0.5">✓</span>
                    <span>We cover $20/day in ads for your first 8 weeks ($1,120 total)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 mt-0.5">✓</span>
                    <span>Starting week 9: Pay back $50/week until the $1,120 is repaid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 mt-0.5">✓</span>
                    <span>After payback: Your ad costs are deducted from commission before payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300 mt-0.5">✓</span>
                    <span>You collect 25% commission on every sale - just share your link!</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="secondary"
                className="w-full md:w-auto bg-white text-green-600 hover:bg-gray-100 font-bold text-lg px-8 py-4"
                onClick={() => navigate('/partner/profit-network')}
              >
                View Available Businesses →
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function PlaybookCard({ playbook, navigate }: { playbook: Playbook; navigate: any }) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-orange-100">
      <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-400 relative">
        <img
          src={playbook.thumbnail_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'}
          alt={playbook.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
          FREE
        </div>
        <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${difficultyColors[playbook.difficulty_level as keyof typeof difficultyColors] || difficultyColors.beginner}`}>
          {playbook.difficulty_level.toUpperCase()}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {playbook.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {playbook.subtitle || playbook.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{playbook.estimated_duration_minutes} min</span>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
            Playbook
          </span>
        </div>

        <Button
          onClick={() => navigate(`/partner/playbooks/${playbook.slug}`)}
          variant="outline"
          className="w-full border-orange-500 text-orange-700 hover:bg-orange-50"
        >
          <Zap className="h-4 w-4 mr-2" />
          Execute Now
        </Button>
      </div>
    </div>
  );
}
