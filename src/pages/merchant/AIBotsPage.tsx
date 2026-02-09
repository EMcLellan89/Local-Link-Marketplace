import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Globe, Smartphone, Phone, Star, Share2, Mail, Megaphone, FileText, Calculator, Calendar, Target, RefreshCw, DollarSign, Heart, Eye, Package } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function AIBotsPage() {
  const navigate = useNavigate();

  const botTypes = [
    {
      type: 'Messenger Bot',
      icon: MessageSquare,
      price: 149,
      features: ['Auto-respond to messages', 'Book appointments', 'Answer FAQs', 'Collect leads'],
      color: 'blue'
    },
    {
      type: 'Website Chat Bot',
      icon: Globe,
      price: 299,
      features: ['24/7 website support', 'Lead qualification', 'Book appointments', 'Custom scripts'],
      color: 'purple'
    },
    {
      type: 'SMS Bot',
      icon: Smartphone,
      price: 499,
      features: ['Auto-follow up leads', 'Appointment reminders', 'Review requests', 'SenText compatible'],
      color: 'green'
    },
    {
      type: 'VoIP AI Assistant',
      icon: Phone,
      price: 799,
      features: ['Answer incoming calls 24/7', 'Book appointments by phone', 'Qualify leads automatically', 'Transfer to staff when needed'],
      color: 'orange'
    }
  ];

  const aiAssistants = [
    {
      name: 'AI Quote Assistant',
      icon: Calculator,
      price: 49,
      description: 'Generate professional quotes in seconds with AI-powered pricing suggestions',
      features: ['Smart pricing recommendations', 'Industry-standard rates', 'Professional templates', 'Cost breakdowns'],
      route: '/merchant/ai-quote-assistant',
      color: 'blue'
    },
    {
      name: 'AI Review Responder',
      icon: Star,
      price: 79,
      description: 'Craft thoughtful, professional responses to all your customer reviews',
      features: ['Respond to positive reviews', 'Handle negative feedback', 'Brand voice matching', 'Multi-platform support'],
      route: '/merchant/ai-review-responder',
      color: 'yellow'
    },
    {
      name: 'AI Social Media Manager',
      icon: Share2,
      price: 99,
      description: 'Create engaging social media content that drives customer engagement',
      features: ['Post ideas & captions', 'Hashtag suggestions', 'Multi-platform content', 'Content calendar planning'],
      route: '/merchant/ai-social-media',
      color: 'pink'
    },
    {
      name: 'AI Email Composer',
      icon: Mail,
      price: 69,
      description: 'Write professional business emails for any situation in seconds',
      features: ['Follow-up emails', 'Proposals & quotes', 'Customer communication', 'Professional tone'],
      route: '/merchant/ai-email-composer',
      color: 'green'
    },
    {
      name: 'AI Ad Copy Writer',
      icon: Megaphone,
      price: 89,
      description: 'Generate high-converting ad copy for all your marketing campaigns',
      features: ['Google Ads copy', 'Facebook/Instagram ads', 'A/B testing variants', 'Call-to-action optimization'],
      route: '/merchant/ai-ad-copy',
      color: 'orange'
    }
  ];

  const newBots = [
    {
      name: 'AI Appointment Scheduler',
      icon: Calendar,
      price: 199,
      description: 'Fully automated appointment scheduling system. Handles bookings, rescheduling 24/7',
      features: ['24/7 automated booking', 'Calendar sync', 'Smart scheduling', 'Reduces no-shows by 40%+'],
      route: '/merchant/ai-appointment-scheduler',
      color: 'blue',
      badge: 'NEW'
    },
    {
      name: 'AI Lead Qualifier',
      icon: Target,
      price: 249,
      description: 'Pre-qualifies all incoming leads. Only talk to serious customers',
      features: ['Automatic qualification', 'Lead scoring', 'CRM auto-population', 'Saves 10+ hours/week'],
      route: '/merchant/ai-lead-qualifier',
      color: 'blue',
      badge: 'NEW'
    },
    {
      name: 'AI Follow-Up Automation',
      icon: RefreshCw,
      price: 179,
      description: 'Never lose a deal to lack of follow-up. Automate your entire process',
      features: ['Quote follow-ups', 'Review requests', 'Lead re-engagement', 'Increases close rate 30%+'],
      route: '/merchant/ai-follow-up-automation',
      color: 'green',
      badge: 'NEW'
    },
    {
      name: 'AI Invoice Reminder',
      icon: DollarSign,
      price: 149,
      description: 'Get paid faster without awkward conversations. Professional automated reminders',
      features: ['Payment reminders', 'Escalation sequences', 'Payment plans', 'Reduces DSO by 40%+'],
      route: '/merchant/ai-invoice-reminder',
      color: 'green',
      badge: 'NEW'
    },
    {
      name: 'AI Customer Retention',
      icon: Heart,
      price: 199,
      description: 'Keep customers coming back automatically. Repeat customers are 5x cheaper',
      features: ['Maintenance reminders', 'Seasonal outreach', 'Win-back campaigns', '50%+ more repeat business'],
      route: '/merchant/ai-customer-retention',
      color: 'pink',
      badge: 'NEW'
    },
    {
      name: 'AI Reputation Monitor',
      icon: Eye,
      price: 129,
      description: 'Never miss a review again. Real-time monitoring with intelligent alerts',
      features: ['Multi-platform monitoring', 'Real-time alerts', 'Sentiment analysis', 'Respond 10x faster'],
      route: '/merchant/ai-reputation-monitor',
      color: 'purple',
      badge: 'NEW'
    },
    {
      name: 'AI Proposal Generator',
      icon: FileText,
      price: 159,
      description: 'Win more business with professional proposals. Includes e-signature integration',
      features: ['Automated proposals', 'Professional formatting', 'E-signature integration', 'Win rate +35%'],
      route: '/merchant/ai-proposal-generator',
      color: 'orange',
      badge: 'NEW'
    }
  ];

  return (
    <BusinessHubLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI & Automation Hub</h1>
          <p className="text-slate-600 mt-2">
            Supercharge your business with AI-powered tools and automation
          </p>
        </div>

        {/* FrontDesk AI Pro Banner */}
        <Card variant="bordered" className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0">
          <CardBody>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 text-white">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Looking for More AI Solutions?</h3>
                </div>
                <p className="text-blue-50 mb-4">
                  Explore our complete suite of industry-specific AI receptionists and advanced automation tools at FrontDesk AI Pro.
                  Specialized solutions for healthcare, legal, real estate, and more.
                </p>
                <a
                  href="https://frontdeskaipro.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Visit FrontDesk AI Pro
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <CardBody>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">AI Suite Packages - Save Up To $600/Month!</h3>
                    <p className="text-slate-600 mb-3">
                      Bundle AI bots together and save big. Get complete automation for lead generation, customer service, or revenue maximization.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                    onClick={() => navigate('/merchant/ai-suite-packages')}
                  >
                    View All Packages
                  </Button>
                  <Button variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardBody>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Complete AI Suite - $1,497/mo</h3>
                <p className="text-slate-600 mb-3">
                  Get ALL 12+ AI bots and save over $600/month. Everything you need to automate and scale your business.
                </p>
                <Button
                  className="bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => navigate('/merchant/ai-suite-packages')}
                >
                  Get Complete AI Suite
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">New AI Bots</h2>
              <p className="text-slate-600 mt-1">
                Latest automation tools to streamline your business operations
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              7 New Bots
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newBots.map((bot) => {
              const Icon = bot.icon;
              return (
                <Card key={bot.name} variant="bordered" className="hover:shadow-lg transition-shadow relative">
                  {bot.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-emerald-500 text-white rounded text-xs font-bold">
                        {bot.badge}
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <div className={`w-12 h-12 bg-${bot.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 text-${bot.color}-600`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{bot.name}</h3>
                    <p className="text-3xl font-bold text-[#2BB673] mt-2">${bot.price}<span className="text-sm text-slate-600 font-normal">/mo</span></p>
                    <p className="text-sm text-slate-600 mt-2">{bot.description}</p>
                  </CardHeader>
                  <CardBody>
                    <ul className="space-y-2 mb-4">
                      {bot.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start">
                          <span className="text-[#2BB673] mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      fullWidth
                      className="bg-[#2BB673] hover:bg-[#25a866] text-white"
                      onClick={() => navigate(bot.route)}
                    >
                      Try Now
                    </Button>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">AI Content Assistants</h2>
          <p className="text-slate-600 mb-6">
            Create professional content in seconds with AI-powered writing assistants
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiAssistants.map((assistant) => {
              const Icon = assistant.icon;
              return (
                <Card key={assistant.name} variant="bordered" className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-${assistant.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 text-${assistant.color}-600`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{assistant.name}</h3>
                    <p className="text-3xl font-bold text-[#2BB673] mt-2">${assistant.price}<span className="text-sm text-slate-600 font-normal">/mo</span></p>
                    <p className="text-sm text-slate-600 mt-2">{assistant.description}</p>
                  </CardHeader>
                  <CardBody>
                    <ul className="space-y-2 mb-4">
                      {assistant.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start">
                          <span className="text-[#2BB673] mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      fullWidth
                      className="bg-[#2BB673] hover:bg-[#25a866] text-white"
                      onClick={() => navigate(assistant.route)}
                    >
                      Try Now
                    </Button>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">AI Sales Bots</h2>
          <p className="text-slate-600 mb-6">
            Convert more leads automatically with intelligent AI automation
          </p>

          <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-slate-50 mb-6">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Full Bot Suite - $1,097</h3>
                  <p className="text-slate-600 mb-3">
                    Get all four bots (Messenger, Website, SMS, and VoIP) and save $649. Best value for businesses serious about automation.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Get Bot Suite
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {botTypes.map((bot) => {
              const Icon = bot.icon;
              return (
                <Card key={bot.type} variant="bordered">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-${bot.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className={`w-6 h-6 text-${bot.color}-600`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{bot.type}</h3>
                    <p className="text-3xl font-bold text-[#2BB673] mt-2">${bot.price}</p>
                  </CardHeader>
                  <CardBody>
                    <ul className="space-y-2 mb-4">
                      {bot.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-slate-600">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                    <Button fullWidth variant="outline">
                      Add Bot
                    </Button>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">How It Works</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Choose Your Bot', desc: 'Select the platform you want to automate' },
                { step: '2', title: 'We Build It', desc: 'Our team creates custom scripts for your business' },
                { step: '3', title: 'You Review', desc: 'Test the bot and request any changes' },
                { step: '4', title: 'Go Live', desc: 'We activate and monitor performance' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-[#2BB673] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
