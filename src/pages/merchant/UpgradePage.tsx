import { useState, useEffect } from 'react';
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface SubscriptionTier {
  id: string;
  name: string;
  monthly_price: string;
  postcard_placement: string;
  features: string[];
  is_active: boolean;
}

interface Merchant {
  id: string;
  subscription_plan: string;
  current_subscription_id: string | null;
}

export default function UpgradePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [profile]);

  const loadData = async () => {
    try {
      const [tiersResult, merchantResult] = await Promise.all([
        supabase
          .from('subscription_tiers')
          .select('*')
          .eq('is_active', true)
          .order('monthly_price'),
        profile ? supabase
          .from('merchants')
          .select('id, subscription_plan, current_subscription_id')
          .eq('user_id', profile.id)
          .maybeSingle() : Promise.resolve({ data: null, error: null })
      ]);

      if (tiersResult.data) {
        setTiers(tiersResult.data);
      }

      if (merchantResult.data) {
        setMerchant(merchantResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierId: string, tierName: string, price: string) => {
    if (!merchant) {
      alert('Please complete merchant onboarding first');
      navigate('/merchant/onboarding');
      return;
    }

    const tierSlug = tierName.toLowerCase().replace(/\s+/g, '_');
    navigate(`/merchant/tier-upgrade/checkout?tier=${tierSlug}`);
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'starter':
        return Check;
      case 'founders':
        return Sparkles;
      case 'standard':
        return Zap;
      case 'premium':
        return Crown;
      default:
        return Check;
    }
  };

  const getTierColor = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'starter':
        return 'from-slate-500 to-slate-600';
      case 'founders':
        return 'from-blue-500 to-indigo-600';
      case 'standard':
        return 'from-[#2BB673] to-[#25a062]';
      case 'premium':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getTierBadge = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'starter':
        return { text: 'BEST FOR STARTERS', color: 'bg-slate-100 text-slate-700' };
      case 'founders':
        return { text: 'LOCKED RATE', color: 'bg-blue-100 text-blue-700' };
      case 'standard':
        return { text: 'MOST POPULAR', color: 'bg-[#2BB673]/10 text-[#2BB673]' };
      case 'premium':
        return { text: 'BEST VALUE', color: 'bg-amber-100 text-amber-700' };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2BB673] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading plans...</p>
          </div>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Upgrade to Scale Your Business
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose the perfect plan to grow your business with our comprehensive marketing and business tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const Icon = getTierIcon(tier.name);
            const badge = getTierBadge(tier.name);
            const isCurrentPlan = merchant?.subscription_plan === tier.name.toLowerCase();
            const isPremium = tier.name.toLowerCase() === 'premium';

            return (
              <Card
                key={tier.id}
                variant="bordered"
                className={`relative ${isPremium ? 'ring-2 ring-[#2BB673] shadow-xl scale-105' : ''}`}
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-[#2BB673] text-white text-sm font-bold rounded-full shadow-lg">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${getTierColor(tier.name)} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>

                  {badge && (
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${badge.color}`}>
                      {badge.text}
                    </span>
                  )}

                  <div className="mb-4">
                    <span className="text-5xl font-bold text-slate-900">
                      ${Number(tier.monthly_price).toFixed(0)}
                    </span>
                    <span className="text-slate-600 ml-2">/month</span>
                  </div>

                  {isCurrentPlan ? (
                    <div className="px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg">
                      Current Plan
                    </div>
                  ) : (
                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => handleUpgrade(tier.id, tier.name, tier.monthly_price)}
                      className={isPremium ? 'bg-gradient-to-r from-[#2BB673] to-[#25a062] hover:shadow-lg' : ''}
                    >
                      Upgrade Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </CardHeader>

                <CardBody>
                  <div className="space-y-3">
                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-700 mb-1">Postcard Placement</p>
                      <p className="text-sm text-slate-600 capitalize">{tier.postcard_placement} Spot</p>
                    </div>

                    <p className="text-sm font-semibold text-slate-700 mb-3">All Features:</p>
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardBody>
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                All Plans Include Our Complete Business Suite
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">CRM & Lead Management</p>
                    <p className="text-sm text-slate-600">Track and nurture your customer relationships</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">AI Chatbots & Automations</p>
                    <p className="text-sm text-slate-600">24/7 customer engagement automation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Marketing Campaign Tools</p>
                    <p className="text-sm text-slate-600">Create and manage targeted campaigns</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Review Management</p>
                    <p className="text-sm text-slate-600">Monitor and respond to customer feedback</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Analytics Dashboard</p>
                    <p className="text-sm text-slate-600">Track performance and ROI metrics</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Priority Support</p>
                    <p className="text-sm text-slate-600">Get help when you need it</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Not ready to upgrade? No problem!
          </p>
          <Button variant="outline" onClick={() => navigate('/merchant/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
