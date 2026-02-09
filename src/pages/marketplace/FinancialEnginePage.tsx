import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator, Check, TrendingUp, Shield, Clock, DollarSign, Zap,
  Award, Bot, FileText, AlertCircle, Users, Target, Briefcase,
  Network, Rocket, Crown, MessageSquare, X, Send
} from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface Package {
  id: string;
  name: string;
  description: string;
  category: string;
  tiers?: {
    name: string;
    price: string;
    priceMonthly?: number;
  }[];
  price?: string;
  priceMonthly?: number;
  features: string[];
  icon: typeof Calculator;
  statementDescriptor: string;
  unitLabel: string;
  metadata: Record<string, string>;
  badge?: string;
}

interface ChatMessage {
  role: 'bot' | 'user';
  message: string;
  timestamp: Date;
}

export default function FinancialEnginePage() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      message: "Hi! I'm your AI Sales Assistant. I'm here to help you find the perfect AI Bookkeeping solution for your business. What brings you here today?",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');

  const corePlatform: Package[] = [
    {
      id: 'ai-os',
      name: 'Local-Link AI OS™',
      description: 'The core operating system that powers AI automation, bots, analytics, compliance controls, and partner revenue tracking',
      category: 'platform',
      icon: Bot,
      statementDescriptor: 'LOCALLINK AI OS',
      unitLabel: 'month',
      metadata: { product_key: 'AI_OS', category: 'platform', billing_type: 'recurring', tiered: 'true' },
      tiers: [
        { name: 'Starter', price: '$97', priceMonthly: 97 },
        { name: 'Growth', price: '$297', priceMonthly: 297 },
        { name: 'Pro', price: '$597', priceMonthly: 597 },
        { name: 'Elite', price: '$997', priceMonthly: 997 }
      ],
      features: [
        'AI job engine + automation runners',
        'Feature flags & kill switch',
        'Partner dashboards & revenue attribution',
        'Circuit breaker & reliability layer'
      ]
    },
    {
      id: 'financial-engine',
      name: 'Local-Link Financial Engine™',
      description: 'AI-powered bookkeeping, monthly P&L, receipt automation, tax-ready reporting, and financial insights',
      category: 'financial',
      icon: Calculator,
      statementDescriptor: 'LOCALLINK FIN',
      unitLabel: 'month',
      metadata: { product_key: 'FIN_ENGINE', category: 'financial', includes_tax_ready_score: 'true' },
      tiers: [
        { name: 'Starter', price: '$149', priceMonthly: 149 },
        { name: 'Growth', price: '$299', priceMonthly: 299 },
        { name: 'Pro', price: '$499', priceMonthly: 499 }
      ],
      features: [
        'Monthly P&L + expense reports',
        'Receipt capture + categorization',
        'Tax-Ready Score™ (0–100)',
        'Client Tax Pack generator'
      ]
    },
    {
      id: 'compliance-shield',
      name: 'Compliance Shield™',
      description: 'Automated compliance workflows, audit trails, risk monitoring, document vaults, and defensibility tools',
      category: 'compliance',
      icon: Shield,
      statementDescriptor: 'COMPLIANCE SHIELD',
      unitLabel: 'month',
      metadata: { product_key: 'COMPLIANCE_SHIELD', category: 'compliance', audit_enabled: 'true' },
      tiers: [
        { name: 'Basic', price: '$129', priceMonthly: 129 },
        { name: 'Growth', price: '$349', priceMonthly: 349 },
        { name: 'Elite', price: '$699', priceMonthly: 699 }
      ],
      features: [
        'Audit logs & change tracking',
        'Policy workflows & document vault',
        'Risk detection bots',
        'Compliance certification badges'
      ]
    }
  ];

  const growthEngines: Package[] = [
    {
      id: 'partner-autopilot',
      name: 'Partner Growth Autopilot™',
      description: 'Automated outreach, share kits, follow-ups, lead nurturing, and revenue tracking for partners',
      category: 'growth',
      icon: Rocket,
      statementDescriptor: 'PARTNER AUTOPLT',
      unitLabel: 'month',
      metadata: { product_key: 'AUTOPILOT', category: 'growth', partner_focused: 'true' },
      tiers: [
        { name: 'Starter', price: '$97', priceMonthly: 97 },
        { name: 'Growth', price: '$247', priceMonthly: 247 },
        { name: 'Pro', price: '$497', priceMonthly: 497 }
      ],
      features: [
        'Share Kit generator',
        'Auto follow-up sequences',
        'Partner leaderboard & gamification',
        'Revenue influence tracking'
      ]
    },
    {
      id: 'lead-command',
      name: 'Lead Command™',
      description: 'AI-driven lead qualification, routing, scoring, and conversion automation',
      category: 'sales',
      icon: Target,
      statementDescriptor: 'LEAD COMMAND',
      unitLabel: 'month',
      metadata: { product_key: 'LEAD_COMMAND', category: 'sales' },
      tiers: [
        { name: 'Core', price: '$99', priceMonthly: 99 },
        { name: 'Growth', price: '$249', priceMonthly: 249 },
        { name: 'Pro', price: '$449', priceMonthly: 449 }
      ],
      features: [
        'AI lead scoring',
        'Qualification bots',
        'CRM-ready pipelines',
        'Auto-proposal triggers'
      ]
    }
  ];

  const dfyServices: Package[] = [
    {
      id: 'dfy-cleanup',
      name: 'DFY Bookkeeping Cleanup™',
      description: 'One-time historical cleanup of books with categorized transactions, reconciliations, and tax-ready reports',
      category: 'service',
      icon: FileText,
      statementDescriptor: 'DFY CLEANUP',
      unitLabel: 'project',
      metadata: { product_key: 'DFY_CLEANUP', category: 'service', one_time: 'true' },
      tiers: [
        { name: 'Light Cleanup', price: '$499', priceMonthly: 499 },
        { name: 'Standard Cleanup', price: '$1,200', priceMonthly: 1200 },
        { name: 'Heavy Cleanup', price: '$2,500+', priceMonthly: 2500 }
      ],
      features: [
        'Historical transaction cleanup',
        'Receipt recovery',
        'Tax-ready reports',
        'Upgrade path to monthly service'
      ]
    },
    {
      id: 'compliance-setup',
      name: 'Compliance Setup & Audit Pack™',
      description: 'DFY compliance framework setup, documentation, audit trail configuration, and risk baseline',
      category: 'service',
      icon: Shield,
      statementDescriptor: 'COMPLIANCE SETUP',
      unitLabel: 'project',
      price: '$1,497',
      priceMonthly: 1497,
      metadata: { product_key: 'COMPLIANCE_SETUP', category: 'service' },
      features: [
        'Compliance framework buildout',
        'Document vault setup',
        'Audit trail initialization'
      ]
    }
  ];

  const education: Package[] = [
    {
      id: 'partner-cert',
      name: 'Local-Link Partner Certification™',
      description: 'Training, testing, and certification to sell Local-Link products and earn recurring commissions',
      category: 'education',
      icon: Award,
      statementDescriptor: 'PARTNER CERT',
      unitLabel: 'certification',
      price: '$297',
      priceMonthly: 297,
      metadata: { product_key: 'PARTNER_CERT', category: 'education' },
      features: [
        'Certification badge',
        'Sales playbooks',
        'Commission eligibility'
      ]
    },
    {
      id: 'merchant-academy',
      name: 'Local-Link Merchant Academy™',
      description: 'Step-by-step training for merchants to use automation, financial tools, and compliance systems effectively',
      category: 'education',
      icon: Award,
      statementDescriptor: 'MERCHANT ACAD',
      unitLabel: 'access',
      price: '$197',
      priceMonthly: 197,
      metadata: { product_key: 'MERCHANT_ACADEMY', category: 'education' },
      badge: 'or bundled',
      features: [
        'Video modules',
        'Worksheets & SOPs',
        'Certification tests'
      ]
    }
  ];

  const enterprise: Package[] = [
    {
      id: 'enterprise-stack',
      name: 'Local-Link Enterprise Stack™',
      description: 'Full AI workforce, compliance, financial automation, and partner infrastructure for multi-location or enterprise organizations',
      category: 'enterprise',
      icon: Crown,
      statementDescriptor: 'LOCALLINK ENT',
      unitLabel: 'month',
      price: '$2,500–$5,000',
      priceMonthly: 2500,
      metadata: { product_key: 'ENTERPRISE_STACK', category: 'enterprise' },
      features: [
        'Dedicated AI workflows',
        'Enterprise compliance',
        'Priority support',
        'Custom integrations'
      ]
    }
  ];

  const addons: Package[] = [
    {
      id: 'ai-workforce-addon',
      name: 'AI Workforce Add-On™',
      description: 'Additional AI bots, higher job limits, and advanced automation capacity',
      category: 'addon',
      icon: Bot,
      statementDescriptor: 'AI WORKFORCE',
      unitLabel: 'month',
      price: '$149',
      priceMonthly: 149,
      metadata: { product_key: 'AI_WORKFORCE_ADDON', category: 'addon' },
      features: [
        'Additional AI bots',
        'Higher job limits',
        'Advanced automation capacity'
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage: ChatMessage = {
      role: 'user',
      message: userInput,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');

    // Generate AI response based on user input
    setTimeout(() => {
      let botResponse = '';
      const input = userInput.toLowerCase();

      if (input.includes('price') || input.includes('cost') || input.includes('how much')) {
        botResponse = "Great question! Our AI Bookkeeping services start at $149/month for the Financial Engine Starter tier, which includes monthly P&L, receipt capture, categorization, and Tax-Ready Score. Would you like me to walk you through our different pricing tiers?";
      } else if (input.includes('feature') || input.includes('what do') || input.includes('include')) {
        botResponse = "Our Financial Engine includes: ✅ Monthly P&L & expense reports, ✅ AI-powered receipt capture & categorization, ✅ Tax-Ready Score (0-100), and ✅ Client Tax Pack generator. Plus, all tiers integrate with our AI OS for full automation. Which feature interests you most?";
      } else if (input.includes('difference') || input.includes('compare') || input.includes('tier')) {
        botResponse = "We have 3 tiers: Starter ($149/mo) for basic bookkeeping, Growth ($299/mo) adds multi-entity support and advanced reporting, and Pro ($499/mo) includes dedicated support and API access. What size is your business?";
      } else if (input.includes('demo') || input.includes('try') || input.includes('see')) {
        botResponse = "I'd love to show you! I can connect you with our sales team for a personalized demo. They'll walk you through the platform live and answer all your questions. Would you like me to schedule that for you?";
      } else if (input.includes('start') || input.includes('sign up') || input.includes('get started')) {
        botResponse = "Excellent! Getting started is easy. First, I need to know: Are you currently using any bookkeeping software, or would this be your first system? This helps us tailor the onboarding.";
      } else if (input.includes('tax') || input.includes('irs') || input.includes('audit')) {
        botResponse = "Our Tax-Ready Score monitors your books 24/7 and flags potential issues before they become problems. You'll get a score from 0-100 showing how audit-ready your books are, plus the system auto-generates tax packs for your CPA. It's like having a tax advisor watching your back year-round!";
      } else if (input.includes('help') || input.includes('support')) {
        botResponse = "We've got you covered! All tiers include email support, and Pro tier gets dedicated support with priority response times. Plus, our AI bots handle routine questions 24/7. What type of support are you most concerned about?";
      } else {
        botResponse = "I understand! Let me help you find the right solution. Are you looking for: 1) Basic bookkeeping automation, 2) Full financial management with compliance, or 3) Enterprise-level features for multiple locations? Or would you prefer to speak with a human sales specialist?";
      }

      const botMessage: ChatMessage = {
        role: 'bot',
        message: botResponse,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const renderPackageCard = (pkg: Package, recommended?: boolean) => (
    <Card
      key={pkg.id}
      variant="bordered"
      className={`${
        recommended
          ? 'border-2 border-blue-600 shadow-xl bg-white relative'
          : 'bg-white'
      } hover:shadow-lg transition-shadow`}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
            <Award className="w-4 h-4" />
            Most Popular
          </span>
        </div>
      )}
      <CardHeader className="text-center pt-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center">
          <pkg.icon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
        <p className="text-sm text-slate-600 mb-4">{pkg.description}</p>
      </CardHeader>
      <CardBody>
        {pkg.tiers ? (
          <div className="mb-6">
            <div className="text-sm font-semibold text-slate-700 mb-3">Available Tiers:</div>
            <div className="grid grid-cols-2 gap-2">
              {pkg.tiers.map((tier) => (
                <div key={tier.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-sm font-semibold text-slate-900">{tier.name}</div>
                  <div className="text-lg font-bold text-blue-600">{tier.price}</div>
                  <div className="text-xs text-slate-500">/month</div>
                </div>
              ))}
            </div>
          </div>
        ) : pkg.price ? (
          <div className="mb-6 text-center">
            <div className="text-4xl font-bold text-blue-600">{pkg.price}</div>
            {pkg.category !== 'service' && <div className="text-sm text-slate-500">/month</div>}
          </div>
        ) : null}

        {pkg.badge && (
          <div className="mb-4 text-center">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {pkg.badge}
            </span>
          </div>
        )}

        <ul className="space-y-2 mb-6">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          fullWidth
          onClick={() => setChatOpen(true)}
          className={
            recommended
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
              : ''
          }
          variant={recommended ? undefined : 'outline'}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat with AI Sales
        </Button>
      </CardBody>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl mb-6">
            <Calculator className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            AI Bookkeeping Services
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            Complete AI-powered business automation, financial management, compliance, and growth tools
          </p>
        </div>

        {/* Core Platform Products */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              🧱 Core Platform Products
            </h2>
            <p className="text-slate-600">Recurring subscription services</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {corePlatform.map((pkg, idx) => renderPackageCard(pkg, idx === 1))}
          </div>
        </section>

        {/* Growth & Sales Engines */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              🚀 Growth & Sales Engines
            </h2>
            <p className="text-slate-600">Recurring subscription services</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {growthEngines.map((pkg) => renderPackageCard(pkg))}
          </div>
        </section>

        {/* DFY / Service Products */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              🛠️ Done-For-You Services
            </h2>
            <p className="text-slate-600">One-time projects + optional recurring</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dfyServices.map((pkg) => renderPackageCard(pkg))}
          </div>
        </section>

        {/* Education & Certification */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              🎓 Education, Certification & Partners
            </h2>
            <p className="text-slate-600">Training and certification programs</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {education.map((pkg) => renderPackageCard(pkg))}
          </div>
        </section>

        {/* Enterprise */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              🏆 High-Ticket / Enterprise
            </h2>
            <p className="text-slate-600">Full-service enterprise solutions</p>
          </div>
          <div className="grid grid-cols-1 max-w-2xl mx-auto">
            {enterprise.map((pkg) => renderPackageCard(pkg, true))}
          </div>
        </section>

        {/* Add-Ons */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              🧾 Optional Add-Ons
            </h2>
            <p className="text-slate-600">Recurring monthly add-ons</p>
          </div>
          <div className="grid grid-cols-1 max-w-xl mx-auto">
            {addons.map((pkg) => renderPackageCard(pkg))}
          </div>
        </section>

        {/* CTA Banner */}
        <Card variant="bordered" className="bg-white border-2 border-blue-600">
          <CardBody className="text-center py-12">
            <Zap className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Ready to Transform Your Business?</h2>
            <p className="text-lg text-blue-700 font-medium mb-6 max-w-2xl mx-auto">
              Contact our sales team to find the perfect package for your needs
            </p>
            <Button
              onClick={() => setChatOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 font-bold shadow-lg"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat with AI Sales
            </Button>
          </CardBody>
        </Card>

        {/* Notice */}
        <Card variant="bordered" className="bg-amber-50 border-amber-200 mt-8">
          <CardBody>
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Enterprise Solutions</h3>
                <p className="text-sm text-slate-700">
                  All packages can be customized for enterprise needs. Contact sales for volume pricing,
                  custom integrations, and dedicated support options.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* AI Sales Chat Bot */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setChatOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col" style={{ height: '600px' }}>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">AI Sales Assistant</h3>
                  <p className="text-xs text-blue-100">Online • Instant Response</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {msg.role === 'bot' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-slate-600">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about pricing, features, or schedule a demo..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Powered by Local-Link AI • Instant responses
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
