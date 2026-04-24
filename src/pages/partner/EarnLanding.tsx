import { Link } from 'react-router-dom';
import {
  DollarSign, Zap, Users, TrendingUp, Sparkles, MapPin,
  CheckCircle, Star, ArrowRight, Award, BarChart3, Shield,
  Briefcase, Target, Clock, ChevronRight, Play
} from 'lucide-react';
import Button from '../../components/ui/Button';

const stats = [
  { value: '2,400+', label: 'Active Partners' },
  { value: '$1.2M+', label: 'Paid Out to Partners' },
  { value: '$485', label: 'Avg. Monthly Earnings' },
  { value: '94%', label: 'Partner Retention Rate' },
];

const steps = [
  {
    number: '01',
    icon: MapPin,
    title: 'Pick Your Territory',
    description: 'Choose a city or region to focus on. You own your outreach — no bidding wars, no overlap with other partners.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Use AI-Powered Tools',
    description: 'Get instant DM scripts, email sequences, call templates, and objection handlers generated for your exact market.',
  },
  {
    number: '03',
    icon: Users,
    title: 'Onboard Local Businesses',
    description: 'Walk merchants through our simple onboarding. We handle the tech — you handle the relationship.',
  },
  {
    number: '04',
    icon: DollarSign,
    title: 'Earn Recurring Income',
    description: 'Get paid every month your merchants stay active. Build a portfolio of residual income that grows over time.',
  },
];

const categories = [
  {
    icon: Briefcase,
    title: 'Business Services',
    description: 'Help local businesses automate their marketing, CRM, and customer communications',
    commission: 'Up to 30% recurring',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Digital Advertising',
    description: 'Sell postcard campaigns, social media ads, and AI-generated content services',
    commission: 'Flat + 20% recurring',
    color: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Zap,
    title: 'AI & Automation',
    description: 'Connect merchants with AI bots, voice AI, and done-for-you automation packages',
    commission: '25% recurring',
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
  },
  {
    icon: Award,
    title: 'Training & Courses',
    description: 'Earn commissions selling our academy courses to merchants and other entrepreneurs',
    commission: '40% one-time',
    color: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
  },
  {
    icon: Target,
    title: 'Merchant Services',
    description: 'Refer businesses for payment processing and earn significant upfront bonuses',
    commission: '$200 - $500 bonus',
    color: 'bg-teal-50 border-teal-200',
    iconColor: 'text-teal-600',
  },
  {
    icon: TrendingUp,
    title: 'Growth Bundles',
    description: 'Package multiple services for bigger contracts and higher total commissions',
    commission: 'Custom rates',
    color: 'bg-slate-50 border-slate-200',
    iconColor: 'text-slate-600',
  },
];

const commissions = [
  { label: 'CRM Starter ($49/mo)', monthly: '$9.80/mo', color: 'bg-slate-50' },
  { label: 'CRM Professional ($129/mo)', monthly: '$25.80/mo', color: 'bg-slate-50' },
  { label: 'CRM Enterprise ($249/mo)', monthly: '$49.80/mo', color: 'bg-slate-50' },
];

const bonuses = [
  { label: 'Merchant Activation', amount: '$50', color: 'bg-emerald-50 text-emerald-700' },
  { label: 'First Deal Created', amount: '$25', color: 'bg-emerald-50 text-emerald-700' },
  { label: 'Merchant Services Signup', amount: '$200', color: 'bg-emerald-50 text-emerald-700' },
];

const testimonials = [
  {
    name: 'Marcus T.',
    role: 'Full-Time Partner',
    city: 'Atlanta, GA',
    quote: 'I replaced my 9-to-5 income in 6 months. The AI tools make cold outreach actually work — I close 3-4 merchants a week now.',
    earnings: '$3,200/mo recurring',
    rating: 5,
  },
  {
    name: 'Priya K.',
    role: 'Part-Time Partner',
    city: 'Phoenix, AZ',
    quote: 'Started on the side while working full-time. The training was excellent and I had my first commission check in 3 weeks.',
    earnings: '$850/mo recurring',
    rating: 5,
  },
  {
    name: 'Derek M.',
    role: 'Agency Partner',
    city: 'Dallas, TX',
    quote: 'We white-labeled the whole platform and now sell it under our brand. Margins are incredible. This is the best partner program I\'ve found.',
    earnings: '$12,000/mo recurring',
    rating: 5,
  },
];

const features = [
  'Free partner account — no upfront cost',
  'AI-generated outreach scripts and emails',
  'Real-time commission dashboard',
  'Dedicated partner success manager',
  'Co-branded marketing materials',
  'White-label options for agencies',
  'Leaderboard and bonus challenges',
  'Weekly payout schedule',
];

export default function EarnLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-lg">Local-Link</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
              <a href="#earnings" className="hover:text-slate-900 transition-colors">Earnings</a>
              <a href="#categories" className="hover:text-slate-900 transition-colors">What You'll Sell</a>
              <a href="#testimonials" className="hover:text-slate-900 transition-colors">Success Stories</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
              <Link to="/earn/wizard">
                <Button size="sm">
                  Become a Partner
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-800 text-white py-24 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Join 2,400+ Partners Already Earning</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Start, Grow, and Automate<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
              Your Partner Business
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Earn recurring commissions helping local businesses join the Local-Link platform.
            Use AI-powered tools, proven scripts, and a full marketplace of services to build
            real monthly income — starting today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/earn/wizard">
              <button className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <Sparkles className="w-5 h-5 inline mr-2" />
                Become a Partner — Free
              </button>
            </Link>
            <Link to="/partner/training">
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-lg border border-white/20 transition-all flex items-center gap-2 justify-center">
                <Play className="w-5 h-5" />
                Watch Partner Overview
              </button>
            </Link>
          </div>
          <p className="text-slate-400 text-sm mt-6">
            No upfront fees. Free to join. You earn when merchants succeed.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">The Process</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">How You Earn</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four simple steps from getting started to collecting recurring income every month.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                  <div className="absolute top-6 right-6 text-5xl font-black text-slate-100">{step.number}</div>
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What You'll Sell */}
      <section id="categories" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Product Categories</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">What You'll Sell</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A full marketplace of services businesses actually need — all with competitive commissions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className={`rounded-2xl border p-6 ${cat.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{cat.title}</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{cat.commission}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Earnings Section */}
      <section id="earnings" className="py-24 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Real Numbers</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">What Partners Earn</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent commission structure. Know exactly what you'll make before you start.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Recurring Monthly Revenue
              </h3>
              <div className="space-y-3">
                {commissions.map((item) => (
                  <div key={item.label} className={`flex items-center justify-between p-4 ${item.color} rounded-xl`}>
                    <span className="text-gray-700 text-sm">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.monthly}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                One-Time Bonuses
              </h3>
              <div className="space-y-3">
                {bonuses.map((item) => (
                  <div key={item.label} className={`flex items-center justify-between p-4 ${item.color} rounded-xl`}>
                    <span className="text-gray-700 text-sm">{item.label}</span>
                    <span className={`font-bold ${item.color.includes('emerald') ? 'text-emerald-700' : 'text-slate-900'}`}>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 bg-slate-900 text-white rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="text-lg font-bold mb-2">Partner Earnings Example</h4>
                <p className="text-slate-400 text-sm">
                  Partner signs up 10 merchants (5 on Professional, 3 on Starter, 2 on Enterprise)
                  plus earns activation bonuses:
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-slate-300">Monthly Recurring:</span>
                  <span className="text-2xl font-extrabold text-emerald-400">$258/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Activation Bonuses:</span>
                  <span className="text-2xl font-extrabold text-amber-400">$500 one-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Partner Benefits</span>
              <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We've built the tools, the training, and the technology. You bring the relationships.
                This is the most complete partner program for local business sales.
              </p>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: 'Protected Territory', desc: 'Exclusive areas prevent partner competition' },
                { icon: Zap, title: 'AI Tools Built In', desc: 'Scripts and emails generated instantly' },
                { icon: Clock, title: 'Weekly Payouts', desc: 'Get paid every week, no waiting' },
                { icon: BarChart3, title: 'Live Dashboard', desc: 'Track all commissions in real time' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Success Stories</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Partners Who Are Crushing It</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real results from real partners in real cities across the country.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 flex-1 italic">"{t.quote}"</p>
                <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role} — {t.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Earning</div>
                    <div className="font-bold text-emerald-600">{t.earnings}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Limited Territories Available
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Build<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
              Recurring Income?
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of partners earning monthly commissions by helping local businesses
            grow with AI-powered tools and automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/earn/wizard">
              <button className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Start the Partner Wizard
              </button>
            </Link>
            <Link to="/partner/application">
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-lg border border-white/20 transition-all flex items-center gap-2">
                Apply as Agency Partner
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Free to join
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              No sales quotas
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Weekly payouts
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 px-4 text-center text-sm">
        <p>© {new Date().getFullYear()} Local-Link Marketplace. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/partner/dashboard" className="hover:text-white transition-colors">Partner Dashboard</Link>
          <Link to="/partner/ai-prompts" className="hover:text-white transition-colors">AI Prompt Library</Link>
          <Link to="/partner/training" className="hover:text-white transition-colors">Training Portal</Link>
        </div>
      </footer>
    </div>
  );
}
