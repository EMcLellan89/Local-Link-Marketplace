import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MessageCircle, Clock, Sparkles, Users, Zap, Target } from 'lucide-react';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

export default function AIChatbotBuilderPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Never miss a lead again. Your AI chatbot works around the clock, even when you sleep'
    },
    {
      icon: MessageCircle,
      title: 'Smart Conversations',
      description: 'Answers FAQs, provides quotes, and handles common inquiries naturally'
    },
    {
      icon: Target,
      title: 'Lead Qualification',
      description: 'Asks the right questions to qualify leads before they reach you'
    },
    {
      icon: Users,
      title: 'Appointment Booking',
      description: 'Books appointments directly into your calendar with automatic confirmations'
    },
    {
      icon: Zap,
      title: 'Instant Responses',
      description: 'Responds in seconds, keeping visitors engaged and reducing bounce rate'
    },
    {
      icon: Sparkles,
      title: 'Learns Your Business',
      description: 'Train it on your services, pricing, and policies for accurate answers'
    }
  ];

  const useCases = [
    {
      title: 'After-Hours Support',
      description: 'Capture leads that come in after business hours',
      stat: '40% of leads'
    },
    {
      title: 'FAQ Automation',
      description: 'Answer common questions without staff involvement',
      stat: '200+ questions/day'
    },
    {
      title: 'Appointment Booking',
      description: 'Let customers book appointments instantly',
      stat: '3x more bookings'
    },
    {
      title: 'Lead Qualification',
      description: 'Filter out tire-kickers before they waste your time',
      stat: '60% time saved'
    }
  ];

  const capabilities = [
    'Answer product/service questions',
    'Provide instant quotes',
    'Book appointments',
    'Collect contact information',
    'Qualify leads by budget/timeline',
    'Share business hours & location',
    'Process simple requests',
    'Transfer to human when needed',
    'Send follow-up emails',
    'Multi-language support',
    'Integration with CRM',
    'Custom branding & personality'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />

        <div className="mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Done For You AI Tool
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              AI Chatbot Builder Bot
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Add a smart AI chatbot to your website in minutes. Answer questions, qualify leads,
              and book appointments 24/7.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-3xl font-bold text-slate-900">$197/month</span>
              <Button onClick={() => navigate('/merchant/checkout?product=ai-chatbot-builder')}>
                Add AI Chatbot To My Site
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-2">{useCase.stat}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{useCase.title}</h3>
                <p className="text-sm text-slate-600">{useCase.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">What Your Chatbot Can Do</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {capabilities.map((capability) => (
                <div key={capability} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-center text-white mb-12">
            <h2 className="text-3xl font-bold mb-4">Stop Missing Leads After Hours</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Your AI chatbot never sleeps, never takes breaks, and never has a bad day.
              It qualifies leads and books appointments 24/7.
            </p>
            <Button
              onClick={() => navigate('/merchant/checkout?product=ai-chatbot-builder')}
              className="bg-white text-green-600 hover:bg-green-50"
            >
              Add Chatbot To My Website
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <p className="text-sm text-green-200 mt-4">
              Setup in under 10 minutes. No coding required.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Train Your Bot</h3>
                <p className="text-sm text-slate-600">Tell it about your services, pricing, and policies</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Add To Website</h3>
                <p className="text-sm text-slate-600">Copy-paste one line of code or use our plugin</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Customize Look</h3>
                <p className="text-sm text-slate-600">Match your brand colors and personality</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Start Converting</h3>
                <p className="text-sm text-slate-600">Watch leads roll in 24/7 automatically</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl mb-2">💬</div>
              <h3 className="font-bold text-slate-900 mb-2">Instant Responses</h3>
              <p className="text-sm text-slate-600">
                Visitors get answers in seconds, keeping them engaged instead of bouncing
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-bold text-slate-900 mb-2">Smart Filtering</h3>
              <p className="text-sm text-slate-600">
                Only serious leads reach you, saving hours on unqualified prospects
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl mb-2">📈</div>
              <h3 className="font-bold text-slate-900 mb-2">Better Conversion</h3>
              <p className="text-sm text-slate-600">
                Convert 3x more visitors by providing instant help and capturing info
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
