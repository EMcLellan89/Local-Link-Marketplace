import { useState } from 'react';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import {
  TrendingUp, Search, DollarSign, Star, MapPin, Bot,
  Shield, Users, Rocket, Target, CheckCircle, UserPlus, Award
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface ExecutiveSolution {
  id: string;
  name: string;
  icon: typeof TrendingUp;
  price: string;
  description: string;
  commission: string;
  avgDeal: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  badge?: string;
}

export default function PartnerExecutiveSolutions() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'easy' | 'medium' | 'advanced'>('all');

  const solutions: ExecutiveSolution[] = [
    {
      id: '1',
      name: 'Business Systems Audit™',
      icon: Search,
      price: '$7,500',
      commission: '20-25%',
      avgDeal: '$1,500-$1,875',
      difficulty: 'Easy',
      description: 'Gateway diagnostic — easiest to refer, feeds into everything else',
      badge: 'START HERE'
    },
    {
      id: '2',
      name: 'Sales Engine™',
      icon: Target,
      price: '$9,500',
      commission: '20-25%',
      avgDeal: '$1,900-$2,375',
      difficulty: 'Medium',
      description: 'High-ROI sales system — businesses know they need this'
    },
    {
      id: '3',
      name: 'Profit Optimization™',
      icon: DollarSign,
      price: '$6,500',
      commission: '20-25%',
      avgDeal: '$1,300-$1,625',
      difficulty: 'Easy',
      description: 'Pricing & packaging — easy sell, low fulfillment stress'
    },
    {
      id: '4',
      name: 'Trust Engine™',
      icon: Star,
      price: '$4,500',
      commission: '20-25%',
      avgDeal: '$900-$1,125',
      difficulty: 'Easy',
      description: 'Reviews & reputation — partners love this one',
      badge: 'POPULAR'
    },
    {
      id: '5',
      name: 'Local Visibility Domination™',
      icon: MapPin,
      price: '$8,500',
      commission: '20-25%',
      avgDeal: '$1,700-$2,125',
      difficulty: 'Medium',
      description: 'Google & maps dominance — easy upsell from Trust Engine'
    },
    {
      id: '6',
      name: 'AI Operations Team™',
      icon: Bot,
      price: '$12,500',
      commission: '20%',
      avgDeal: '$2,500',
      difficulty: 'Advanced',
      description: 'AI workforce replacement — CEO-level decision',
      badge: 'HIGH VALUE'
    },
    {
      id: '7',
      name: 'Compliance & Risk Shield™',
      icon: Shield,
      price: '$5,500',
      commission: '20-25%',
      avgDeal: '$1,100-$1,375',
      difficulty: 'Medium',
      description: 'Legal & risk protection — fear-based sell'
    },
    {
      id: '8',
      name: 'Fractional Growth Team™',
      icon: Users,
      price: '$4,000/mo',
      commission: '20-25% recurring',
      avgDeal: '$800-$1,000/mo',
      difficulty: 'Advanced',
      description: 'Ongoing executive oversight — recurring commission',
      badge: 'MRR'
    },
    {
      id: '9',
      name: 'Expansion Playbooks™',
      icon: Rocket,
      price: '$10,000',
      commission: '20-25%',
      avgDeal: '$2,000-$2,500',
      difficulty: 'Advanced',
      description: 'Multi-location scale planning — vetted partners only'
    },
    {
      id: '10',
      name: 'Exit / PE Readiness™',
      icon: TrendingUp,
      price: '$15,000',
      commission: '20%',
      avgDeal: '$3,000',
      difficulty: 'Advanced',
      description: 'Valuation & exit prep — application only',
      badge: 'TOP TIER'
    }
  ];

  const filteredSolutions = selectedFilter === 'all'
    ? solutions
    : solutions.filter(s => s.difficulty.toLowerCase() === selectedFilter);

  const totalCommissionPotential = solutions.reduce((sum, s) => {
    const avg = parseFloat(s.avgDeal.split('-')[0].replace('$', '').replace(',', ''));
    return sum + avg;
  }, 0);

  const handleSubmitReferral = (solution: ExecutiveSolution) => {
    // TODO: Navigate to referral submission
    console.log('Submit referral for:', solution.name);
  };

  return (
    <PartnerHubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-[#2BB673]" />
            <h1 className="text-3xl font-bold">Executive Solutions</h1>
            <span className="px-3 py-1 bg-[#F5B82E] text-white text-sm font-bold rounded-lg">
              REFERRAL ONLY
            </span>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl mb-6">
            High-ticket solutions you refer (not sell directly). We close the deal,
            you earn commission. These are strategic, CEO-level decisions with big payouts.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-[#2BB673]">$1K-$3K</div>
              <div className="text-sm text-slate-300">Per Referral</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-[#2BB673]">20-25%</div>
              <div className="text-sm text-slate-300">Commission Range</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-[#2BB673]">${(totalCommissionPotential / 1000).toFixed(0)}K+</div>
              <div className="text-sm text-slate-300">Total Potential</div>
            </div>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Solutions' },
            { key: 'easy', label: 'Easy Referrals' },
            { key: 'medium', label: 'Medium Complexity' },
            { key: 'advanced', label: 'Advanced / Vetted' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as typeof selectedFilter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.key
                  ? 'bg-[#2BB673] text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSolutions.map((solution) => {
            const Icon = solution.icon;
            const difficultyColor =
              solution.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              solution.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700';

            return (
              <Card key={solution.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <Icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{solution.name}</h3>
                      <p className="text-sm text-slate-600">{solution.price}</p>
                    </div>
                  </div>
                  {solution.badge && (
                    <span className="px-2 py-1 text-xs font-bold bg-[#F5B82E] text-white rounded">
                      {solution.badge}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 mb-4">{solution.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Your Commission</span>
                    <span className="font-bold text-[#2BB673]">{solution.commission}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Avg Payout</span>
                    <span className="font-bold text-slate-900">{solution.avgDeal}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Difficulty</span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${difficultyColor}`}>
                      {solution.difficulty}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleSubmitReferral(solution)}
                  className="w-full group"
                  variant="outline"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Submit Referral
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Strategy Tips */}
        <Card className="bg-gradient-to-r from-[#2BB673] to-[#25a062] p-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Referral Strategy</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2 text-lg">1. Start Simple</h3>
              <p className="text-white/90 text-sm">
                Begin with <strong>Business Systems Audit™</strong> or <strong>Trust Engine™</strong>.
                Easy yes, opens doors to everything else.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-lg">2. Stack Them</h3>
              <p className="text-white/90 text-sm">
                Audit leads to Sales Engine. Trust Engine leads to Visibility Domination.
                Each referral creates upsell opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-lg">3. Know Your Tier</h3>
              <p className="text-white/90 text-sm">
                Higher partner tiers = higher commissions (10% / 15% / 20% / 25%).
                These payouts add up fast.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PartnerHubLayout>
  );
}
