import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Calendar, Clock, Sparkles, TrendingUp, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

export default function AIContentCalendarPage() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const platforms = [
    { id: 'all', name: 'All Platforms', count: '30 posts' },
    { id: 'facebook', name: 'Facebook', count: '10 posts' },
    { id: 'instagram', name: 'Instagram', count: '10 posts' },
    { id: 'linkedin', name: 'LinkedIn', count: '5 posts' },
    { id: 'twitter', name: 'Twitter/X', count: '5 posts' }
  ];

  const contentTypes = [
    'Educational tips & how-tos',
    'Behind-the-scenes content',
    'Customer testimonials',
    'Seasonal promotions',
    'Industry news & trends',
    'Interactive polls & questions',
    'Before & after showcases',
    'Team spotlights',
    'Local community involvement',
    'Product/service highlights'
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Full 30-Day Calendar',
      description: 'Complete content calendar with posts for every day of the month'
    },
    {
      icon: Sparkles,
      title: 'AI-Generated Content',
      description: 'Engaging posts, captions, and hashtags tailored to your industry'
    },
    {
      icon: Users,
      title: 'Multi-Platform',
      description: 'Optimized for Facebook, Instagram, LinkedIn, and Twitter'
    },
    {
      icon: TrendingUp,
      title: 'Engagement Optimized',
      description: 'Content designed to maximize likes, comments, and shares'
    },
    {
      icon: Clock,
      title: 'Time-Saving',
      description: 'Save 10+ hours every month on content planning and creation'
    },
    {
      icon: CheckCircle2,
      title: 'Industry-Specific',
      description: 'Content tailored to your business type and target audience'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />

        <div className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Done For You AI Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              AI Content Calendar Bot
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Never run out of content ideas again. Get a full 30-day content calendar with ready-to-post
              content for all your social platforms.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-3xl font-bold text-slate-900">$147/month</span>
              <Button onClick={() => navigate('/merchant/checkout?product=ai-content-calendar')}>
                Get My Content Calendar
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What You Get Every Month</h2>
            <div className="space-y-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                    selectedPlatform === platform.id
                      ? 'bg-purple-50 border-2 border-purple-600'
                      : 'bg-slate-50 border-2 border-transparent hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-slate-900">{platform.name}</span>
                  </div>
                  <span className="text-sm text-purple-600 font-medium">{platform.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                ✓ All content includes captions, hashtags, and posting time recommendations
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Content Types Included
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                {contentTypes.map((type) => (
                  <div key={type} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-slate-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 md:p-12 text-center text-white mb-12">
            <h2 className="text-3xl font-bold mb-4">Stop Stressing About Social Media</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Get a full month of content delivered to you. Just customize with your branding and post.
              Save 10+ hours every month.
            </p>
            <Button
              onClick={() => navigate('/merchant/checkout?product=ai-content-calendar')}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              Get My Content Calendar
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <p className="text-sm text-purple-200 mt-4">
              First calendar delivered within 24 hours. Cancel anytime.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Tell Us About You</h3>
                <p className="text-sm text-slate-600">Share your business type and target audience</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">AI Creates Calendar</h3>
                <p className="text-sm text-slate-600">30 days of content generated in minutes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Review & Customize</h3>
                <p className="text-sm text-slate-600">Add your branding and personal touches</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Post & Engage</h3>
                <p className="text-sm text-slate-600">Post according to schedule and watch engagement grow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
