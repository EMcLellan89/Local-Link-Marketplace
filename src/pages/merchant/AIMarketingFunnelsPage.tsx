import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, Zap, BarChart3, Target, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

export default function AIMarketingFunnelsPage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    {
      id: 'lead-magnet',
      name: 'Lead Magnet Funnel',
      description: 'Capture leads with a valuable free offer',
      conversions: '35-45%',
      steps: ['Landing Page', 'Thank You Page', 'Email Sequence', 'Tripwire Offer']
    },
    {
      id: 'webinar',
      name: 'Webinar Funnel',
      description: 'Convert attendees into buyers with automated webinars',
      conversions: '20-30%',
      steps: ['Registration Page', 'Reminder Sequence', 'Webinar Page', 'Replay Page', 'Pitch Sequence']
    },
    {
      id: 'product-launch',
      name: 'Product Launch Funnel',
      description: 'Build anticipation and sell out your offer',
      conversions: '25-35%',
      steps: ['Pre-Launch Page', 'Countdown Timer', 'Sales Page', 'Order Bump', 'Upsell Page']
    },
    {
      id: 'tripwire',
      name: 'Tripwire Funnel',
      description: 'Low-cost entry offer that leads to high-ticket sales',
      conversions: '40-50%',
      steps: ['Tripwire Offer Page', 'OTO Page', 'Thank You Page', 'Ascension Sequence']
    },
    {
      id: 'application',
      name: 'Application Funnel',
      description: 'Qualify high-ticket clients before sales calls',
      conversions: '15-25%',
      steps: ['VSL Landing Page', 'Application Form', 'Calendar Booking', 'Confirmation Sequence']
    },
    {
      id: 'survey',
      name: 'Survey Funnel',
      description: 'Segment your audience and personalize offers',
      conversions: '45-55%',
      steps: ['Survey Page', 'Results Page', 'Personalized Offer', 'Follow-Up Sequence']
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Build In Minutes',
      description: 'AI creates complete funnels with all pages and sequences in under 10 minutes'
    },
    {
      icon: Target,
      title: 'Proven Templates',
      description: 'Choose from 20+ battle-tested funnel templates that convert'
    },
    {
      icon: BarChart3,
      title: 'A/B Testing',
      description: 'Automatically test headlines, images, and CTAs to maximize conversions'
    },
    {
      icon: TrendingUp,
      title: 'Optimization AI',
      description: 'AI monitors performance and suggests improvements in real-time'
    },
    {
      icon: CheckCircle2,
      title: 'Email Integration',
      description: 'Seamlessly integrates with your email platform for automated follow-ups'
    },
    {
      icon: Sparkles,
      title: 'Smart Split Testing',
      description: 'Test multiple variations simultaneously and automatically implement winners'
    }
  ];

  const stats = [
    { label: 'Average Conversion Increase', value: '127%' },
    { label: 'Time Saved Per Funnel', value: '15+ hrs' },
    { label: 'Funnels Created', value: '10,000+' },
    { label: 'Customer Satisfaction', value: '4.9/5' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />

        <div className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Done For You AI Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              AI Marketing Funnels Bot
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Build high-converting marketing funnels in minutes, not weeks. AI creates landing pages,
              email sequences, and optimization tests automatically.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-3xl font-bold text-slate-900">$297/month</span>
              <Button onClick={() => navigate('/merchant/checkout?product=ai-marketing-funnels')}>
                Get Started Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Choose Template</h3>
                <p className="text-sm text-slate-600">
                  Select from proven funnel templates for your goal
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">AI Builds Funnel</h3>
                <p className="text-sm text-slate-600">
                  AI creates all pages, copy, and email sequences
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Customize</h3>
                <p className="text-sm text-slate-600">
                  Add your branding, images, and personal touches
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Launch & Optimize</h3>
                <p className="text-sm text-slate-600">
                  AI tests variations and optimizes for conversions
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Proven Funnel Templates</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`bg-white rounded-xl p-6 shadow-sm cursor-pointer transition-all ${
                    selectedTemplate === template.id ? 'ring-2 ring-blue-600' : 'hover:shadow-md'
                  }`}
                >
                  <h3 className="font-bold text-slate-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-500">Expected Conversion</span>
                    <span className="text-sm font-semibold text-green-600">{template.conversions}</span>
                  </div>
                  <div className="space-y-2">
                    {template.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready To 3X Your Conversions?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 10,000+ businesses using AI to build funnels that convert.
              No coding required. 30-day money-back guarantee.
            </p>
            <Button
              onClick={() => navigate('/merchant/checkout?product=ai-marketing-funnels')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Start Building Funnels Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <p className="text-sm text-blue-200 mt-4">
              Setup takes less than 10 minutes. Cancel anytime.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                '20+ proven funnel templates',
                'Unlimited funnels and pages',
                'AI-powered copywriting',
                'Email sequence builder',
                'A/B testing automation',
                'Analytics dashboard',
                'Mobile-responsive designs',
                'Payment gateway integration',
                'Custom domain support',
                'Email platform integration',
                'Real-time optimization',
                '24/7 support & training'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
