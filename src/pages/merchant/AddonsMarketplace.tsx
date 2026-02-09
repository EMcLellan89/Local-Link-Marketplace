import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Check, ShoppingCart, Sparkles, Shield, BarChart, Globe, Bot, ArrowRight, Calculator, Package } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Addon {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthly_price_cents: number;
  annual_price_cents: number;
  feature_flag: string;
  category: string;
  is_active: boolean;
}

interface ActiveSubscription {
  addon_id: string;
  status: string;
}

const CATEGORY_ICONS: { [key: string]: any } = {
  automation: Zap,
  compliance: Shield,
  analytics: BarChart,
  global: Globe,
  other: Sparkles
};

const CATEGORY_COLORS: { [key: string]: string } = {
  automation: 'bg-blue-100 text-blue-700',
  compliance: 'bg-green-100 text-green-700',
  analytics: 'bg-purple-100 text-purple-700',
  global: 'bg-orange-100 text-orange-700',
  other: 'bg-slate-100 text-slate-700'
};

export default function AddonsMarketplace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([]);
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [addonsResult, merchantResult] = await Promise.all([
        supabase
          .from('automation_addons')
          .select('*')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('merchants')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (addonsResult.data) {
        setAddons(addonsResult.data);
      }

      if (merchantResult.data) {
        setMerchant(merchantResult.data);

        const { data: subscriptions } = await supabase
          .from('merchant_addon_subscriptions')
          .select('addon_id, status')
          .eq('merchant_id', merchantResult.data.id)
          .eq('status', 'active');

        if (subscriptions) {
          setActiveSubscriptions(subscriptions);
        }
      }
    } catch (error) {
      console.error('Error loading addons:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAddon = (addonId: string) => {
    return activeSubscriptions.some(sub => sub.addon_id === addonId);
  };

  const handlePurchase = (addon: Addon) => {
    if (!merchant) {
      alert('Please complete merchant onboarding first');
      navigate('/merchant/onboarding');
      return;
    }

    navigate(`/merchant/addons/checkout?addon=${addon.slug}&cycle=${billingCycle}`);
  };

  const groupedAddons = addons.reduce((acc, addon) => {
    if (!acc[addon.category]) {
      acc[addon.category] = [];
    }
    acc[addon.category].push(addon);
    return acc;
  }, {} as { [key: string]: Addon[] });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Add-Ons Marketplace
          </h1>
          <p className="text-slate-600">
            Supercharge your platform with powerful automation and compliance tools
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-sm border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>

          {activeSubscriptions.length > 0 && (
            <div className="text-sm text-slate-600">
              {activeSubscriptions.length} active add-on{activeSubscriptions.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Featured: AutoScale */}
        <Card className="mb-12 bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 border-none text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="inline-block px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-bold rounded-full mb-2">
                  FEATURED SYSTEM
                </div>
                <h2 className="text-3xl font-black">Local-Link AutoScale™</h2>
              </div>
            </div>

            <p className="text-lg text-white/90 mb-6 max-w-3xl">
              The complete AI automation system for local businesses. Instantly respond to every lead, book appointments 24/7, automate follow-ups, and generate reviews on autopilot. Your business never sleeps.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">{'< 1 min'}</div>
                <div className="text-sm text-white/80">Lead Response Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm text-white/80">Automated Booking</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">8 AI Bots</div>
                <div className="text-sm text-white/80">Working For You</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={() => navigate('/merchant/autoscale')}
                className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-3 text-lg"
              >
                View Pricing & Plans <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="text-white/90">
                <span className="font-semibold">Starting at $697/mo</span>
                <span className="mx-2">•</span>
                <span>3 plans available</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Financial Engine */}
        <Card className="mb-12 bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 border-none text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="inline-block px-3 py-1 bg-cyan-400 text-slate-900 text-xs font-bold rounded-full mb-2">
                  NEW SERVICE
                </div>
                <h2 className="text-3xl font-black">Financial Engine™</h2>
              </div>
            </div>

            <p className="text-lg text-white/90 mb-6 max-w-3xl">
              AI-powered bookkeeping that keeps you tax-ready year-round. Automated transaction categorization, monthly close, P&L reports, and Tax-Ready Score™ so you never scramble at tax time.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">100% Accurate</div>
                <div className="text-sm text-white/80">AI + Human Verification</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">Tax-Ready</div>
                <div className="text-sm text-white/80">Monthly Close Process</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">$79/mo</div>
                <div className="text-sm text-white/80">Starting Price</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={() => navigate('/marketplace/financial-engine')}
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3 text-lg"
              >
                View Plans <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="text-white/90">
                <span className="font-semibold">3 tiers: SmartBooks, ProBooks, CFO</span>
                <span className="mx-2">•</span>
                <span>$79-$799/mo</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Business Deals Hub */}
        <Card className="mb-12 bg-gradient-to-br from-rose-600 via-pink-600 to-orange-600 border-none text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="inline-block px-3 py-1 bg-orange-400 text-slate-900 text-xs font-bold rounded-full mb-2">
                  INSIDER DEALS
                </div>
                <h2 className="text-3xl font-black">Business Deals Hub</h2>
              </div>
            </div>

            <p className="text-lg text-white/90 mb-6 max-w-3xl">
              Access exclusive deals on marketing tools, software, and services. Everything a local business needs to grow — at insider pricing with 30-70% off retail prices.
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">50+ Deals</div>
                <div className="text-xs text-white/80">Verified Vendors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">30-70%</div>
                <div className="text-xs text-white/80">Average Savings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">4 Bundles</div>
                <div className="text-xs text-white/80">High-Ticket Packages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold mb-1">Free Access</div>
                <div className="text-xs text-white/80">For All Merchants</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={() => navigate('/marketplace/business-deals')}
                className="bg-white text-rose-600 hover:bg-rose-50 font-bold px-8 py-3 text-lg"
              >
                Browse All Deals <Package className="w-5 h-5 ml-2" />
              </Button>
              <div className="text-white/90">
                <span className="font-semibold">Categories: Marketing, AI, CRM, Design & More</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-12">
          {Object.entries(groupedAddons).map(([category, categoryAddons]) => {
            const Icon = CATEGORY_ICONS[category] || Sparkles;
            const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 capitalize">
                    {category}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryAddons.map((addon) => {
                    const price = billingCycle === 'monthly'
                      ? addon.monthly_price_cents / 100
                      : addon.annual_price_cents / 100;
                    const active = hasAddon(addon.id);

                    return (
                      <Card key={addon.id} className={`relative ${active ? 'border-green-500 border-2' : ''}`}>
                        {active && (
                          <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Active
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="font-bold text-slate-900 mb-2">
                            {addon.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-4 min-h-[40px]">
                            {addon.description}
                          </p>

                          <div className="mb-4">
                            <div className="text-3xl font-black text-slate-900">
                              ${price.toFixed(0)}
                              <span className="text-sm text-slate-600 font-normal">
                                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                              </span>
                            </div>
                            {billingCycle === 'annual' && (
                              <div className="text-xs text-green-600 mt-1">
                                Save ${((addon.monthly_price_cents * 12 - addon.annual_price_cents) / 100).toFixed(0)}/year
                              </div>
                            )}
                          </div>

                          {active ? (
                            <Button
                              variant="secondary"
                              className="w-full"
                              disabled
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Subscribed
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handlePurchase(addon)}
                              variant="primary"
                              className="w-full"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Purchase
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {addons.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No Add-Ons Available
              </h3>
              <p className="text-slate-600">
                Check back soon for new features and integrations
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
