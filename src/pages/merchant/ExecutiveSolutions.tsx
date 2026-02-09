import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import {
  TrendingUp, Search, DollarSign, Star, MapPin, Bot,
  Shield, Users, Rocket, Target, CheckCircle, ArrowRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface ExecutiveSolution {
  id: string;
  name: string;
  icon: typeof TrendingUp;
  price: string;
  description: string;
  features: string[];
  badge?: string;
  productKey: string;
}

export default function ExecutiveSolutions() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'systems' | 'growth' | 'strategic'>('all');

  const solutions: ExecutiveSolution[] = [
    {
      id: '1',
      name: 'Business Systems Audit™',
      icon: Search,
      price: '$7,500',
      description: 'AI-powered executive audit identifying revenue leaks across your entire business system',
      features: [
        'Lead leak & follow-up gap detection',
        'Sales pipeline & conversion analysis',
        'Pricing & offer optimization review',
        'Reputation & visibility risk scan',
        'Prioritized execution roadmap'
      ],
      badge: 'GATEWAY',
      productKey: 'exec_business_systems_audit'
    },
    {
      id: '2',
      name: 'Sales Engine™',
      icon: Target,
      price: '$9,500',
      description: 'Done-for-you sales system eliminating revenue leaks through automated lead handling',
      features: [
        'AI-powered lead intake & routing',
        'Missed-call text-back automation',
        'Sales pipeline configuration',
        'Booking & calendar logic',
        'Conversion tracking & reporting'
      ],
      productKey: 'exec_sales_engine'
    },
    {
      id: '3',
      name: 'Profit Optimization™',
      icon: DollarSign,
      price: '$6,500',
      description: 'Strategic pricing and packaging optimization to maximize revenue per customer',
      features: [
        'AI-powered pricing & margin analysis',
        'Service and package restructuring',
        'Upsell & cross-sell identification',
        'Retainer & recurring revenue design',
        'Profit-first execution roadmap'
      ],
      productKey: 'exec_profit_optimization'
    },
    {
      id: '4',
      name: 'Trust Engine™',
      icon: Star,
      price: '$4,500',
      description: 'Reputation and trust infrastructure to increase conversions across all channels',
      features: [
        'Automated Google review capture',
        'AI-powered review monitoring',
        'Review response workflows',
        'Testimonial syndication',
        'Trust badge deployment'
      ],
      productKey: 'exec_trust_engine'
    },
    {
      id: '5',
      name: 'Local Visibility Domination™',
      icon: MapPin,
      price: '$8,500',
      description: 'Local search and maps dominance to capture high-intent buyers',
      features: [
        'Google Business Profile optimization',
        'Local authority & citation alignment',
        'Structured local content deployment',
        'Map & local ranking diagnostics',
        'Visibility tracking & reporting'
      ],
      productKey: 'exec_local_visibility_domination'
    },
    {
      id: '6',
      name: 'AI Operations Team™',
      icon: Bot,
      price: '$12,500',
      description: 'AI workforce deployment replacing operational labor with 24/7 automation',
      features: [
        'AI receptionist & lead intake',
        'Automated scheduling & confirmations',
        'AI follow-up systems',
        'Internal task routing',
        '24/7 operational coverage'
      ],
      badge: 'ELITE',
      productKey: 'exec_ai_operations_team'
    },
    {
      id: '7',
      name: 'Compliance & Risk Shield™',
      icon: Shield,
      price: '$5,500',
      description: 'Risk prevention and compliance enforcement for growth systems',
      features: [
        'AI compliance audit (SMS, email, ads)',
        'Consent & opt-in flow verification',
        'Messaging & claim risk scanning',
        'Automation safety deployment',
        'Compliance documentation package'
      ],
      productKey: 'exec_compliance_risk_shield'
    },
    {
      id: '8',
      name: 'Fractional Growth Team™',
      icon: Users,
      price: '$4,000/mo',
      description: 'Ongoing executive growth leadership coordinating all systems',
      features: [
        'Fractional executive oversight',
        'Monthly strategy & KPI planning',
        'Performance tracking',
        'Bottleneck identification',
        'Quarterly growth roadmaps'
      ],
      badge: 'RECURRING',
      productKey: 'exec_fractional_growth_team'
    },
    {
      id: '9',
      name: 'Expansion Playbooks™',
      icon: Rocket,
      price: '$10,000',
      description: 'Structured expansion planning for new locations, territories, or services',
      features: [
        'Expansion readiness assessment',
        'Location replication playbooks',
        'Sales & ops standardization',
        'Automation duplication plan',
        'Scale-ready execution roadmap'
      ],
      productKey: 'exec_expansion_playbooks'
    },
    {
      id: '10',
      name: 'Exit / PE Readiness™',
      icon: TrendingUp,
      price: '$15,000',
      description: 'Valuation and systemization preparing your business for acquisition or exit',
      features: [
        'Exit & valuation readiness',
        'Revenue stability review',
        'System hardening & documentation',
        'KPI normalization',
        'Buyer-ready execution roadmap'
      ],
      badge: 'TOP TIER',
      productKey: 'exec_exit_pe_readiness'
    }
  ];

  const filteredSolutions = selectedCategory === 'all'
    ? solutions
    : solutions.filter(s => {
        if (selectedCategory === 'systems') return ['1', '2', '4', '5', '6'].includes(s.id);
        if (selectedCategory === 'growth') return ['3', '8', '9'].includes(s.id);
        if (selectedCategory === 'strategic') return ['7', '10'].includes(s.id);
        return true;
      });

  const handleApply = (solution: ExecutiveSolution) => {
    // TODO: Navigate to application or checkout
    console.log('Apply for:', solution.name);
  };

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-[#2BB673]" />
            <h1 className="text-3xl font-bold">Executive Solutions</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            High-impact systems and strategic services designed to fix revenue leaks,
            scale operations, and prepare your business for the next level of growth.
          </p>
          <div className="mt-6 flex items-center space-x-2 text-sm">
            <CheckCircle className="w-5 h-5 text-[#2BB673]" />
            <span className="text-slate-300">AI-powered diagnostics & execution</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Solutions' },
            { key: 'systems', label: 'Revenue Systems' },
            { key: 'growth', label: 'Growth & Scale' },
            { key: 'strategic', label: 'Strategic & Risk' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key as typeof selectedCategory)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-[#2BB673] text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSolutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <Card key={solution.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <Icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{solution.name}</h3>
                      <p className="text-xl font-bold text-[#2BB673]">{solution.price}</p>
                    </div>
                  </div>
                  {solution.badge && (
                    <span className="px-2 py-1 text-xs font-bold bg-[#F5B82E] text-white rounded">
                      {solution.badge}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 mb-4">{solution.description}</p>

                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleApply(solution)}
                  className="w-full group"
                >
                  Apply / Request Review
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            );
          })}
        </div>

        {/* CTA Banner */}
        <Card className="bg-gradient-to-r from-[#2BB673] to-[#25a062] p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-3">Not Sure Where to Start?</h2>
            <p className="text-white/90 mb-6">
              Start with the <strong>Business Systems Audit™</strong> to get AI-powered
              diagnostics across your entire operation. We'll identify exactly where money
              is leaking and recommend the right solutions for your business.
            </p>
            <Button
              onClick={() => handleApply(solutions[0])}
              className="bg-white text-[#2BB673] hover:bg-slate-100"
            >
              Start with Systems Audit - $7,500
            </Button>
          </div>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
