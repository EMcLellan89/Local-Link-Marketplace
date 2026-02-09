import { useState, useEffect } from 'react';
import { Phone, PhoneCall, FileText, CheckSquare, Mail, Calendar, MessageCircle, UserCheck, RefreshCw, Bot, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AIBot {
  id: string;
  name: string;
  description: string;
  bot_type?: string;
  features: string[];
  price_monthly_cents: number;
  price_yearly_cents: number;
  icon: string;
  demo_url?: string;
  category?: string;
  slug?: string;
  monthly_price_cents?: number;
  is_package?: boolean;
}

interface AIBotMarketplaceProps {
  entityId: string;
  entityType: 'merchant' | 'partner' | 'admin';
}

export default function AIBotMarketplace({ entityId, entityType }: AIBotMarketplaceProps) {
  const [bots, setBots] = useState<AIBot[]>([]);
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBots();
    loadSubscriptions();
  }, [entityId]);

  async function loadBots() {
    try {
      // Load individual AI bots from ai_bot_products
      const { data: botProducts } = await supabase
        .from('ai_bot_products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      // Load AI bot packages from automation_addons
      const { data: botPackages } = await supabase
        .from('automation_addons')
        .select('*')
        .eq('is_active', true)
        .in('category', ['ai_bots', 'ai_packages'])
        .order('sort_order');

      // Combine and normalize the data
      const allBots: AIBot[] = [];

      if (botProducts) {
        allBots.push(...botProducts.map((bot: any) => ({
          ...bot,
          is_package: false,
        })));
      }

      if (botPackages) {
        allBots.push(...botPackages.map((pkg: any) => ({
          id: pkg.id,
          name: pkg.name,
          description: pkg.description,
          features: pkg.description?.split('.').filter((f: string) => f.trim()).slice(0, 5) || [],
          price_monthly_cents: pkg.monthly_price_cents,
          price_yearly_cents: pkg.annual_price_cents || pkg.monthly_price_cents * 10,
          icon: pkg.category === 'ai_packages' ? 'bot' : 'bot',
          category: pkg.category,
          slug: pkg.slug,
          is_package: pkg.category === 'ai_packages',
        })));
      }

      setBots(allBots);
    } catch (error) {
      console.error('Error loading AI bots:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSubscriptions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('ai_bot_subscriptions')
        .select('bot_product_id')
        .eq('user_id', user.id)
        .eq('entity_id', entityId)
        .eq('status', 'active');

      if (data) {
        setSubscriptions(new Set(data.map(s => s.bot_product_id)));
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  }

  async function handleSubscribe(botId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('ai_bot_subscriptions')
        .insert({
          user_id: user.id,
          entity_id: entityId,
          entity_type: entityType,
          bot_product_id: botId,
          status: 'trial',
          billing_cycle: 'monthly',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (!error) {
        alert('Bot activated! You have a 14-day free trial.');
        loadSubscriptions();
      }
    } catch (error) {
      console.error('Error subscribing to bot:', error);
      alert('Failed to activate bot');
    }
  }

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      phone: Phone,
      'phone-call': PhoneCall,
      'file-text': FileText,
      'check-square': CheckSquare,
      mail: Mail,
      calendar: Calendar,
      'message-circle': MessageCircle,
      'user-check': UserCheck,
      'refresh-cw': RefreshCw,
      bot: Bot,
    };
    const IconComponent = icons[iconName] || Bot;
    return <IconComponent className="w-8 h-8" />;
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (loading) {
    return <div className="text-center py-8">Loading AI Bots...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Bot Marketplace</h2>
          <p className="text-gray-600 mt-1">Automate your business with intelligent AI assistants</p>
        </div>
      </div>

      {/* FrontDesk AI Pro Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => {
          const isSubscribed = subscriptions.has(bot.id);
          const isPackage = bot.is_package || bot.category === 'ai_packages';

          return (
            <div key={bot.id} className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow ${isPackage ? 'border-[#2BB673] ring-2 ring-[#2BB673]/20' : 'border-gray-200'}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg text-white ${isPackage ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-[#2BB673] to-[#259a5f]'}`}>
                    {getIcon(bot.icon)}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {isPackage && (
                      <div className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-full">
                        BUNDLE
                      </div>
                    )}
                    {isSubscribed && (
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Active
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{bot.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{bot.description}</p>

                <div className="space-y-2 mb-4 min-h-[80px]">
                  {bot.features && bot.features.length > 0 ? (
                    <>
                      {bot.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-[#2BB673]" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {bot.features.length > 3 && (
                        <p className="text-xs text-gray-500">+ {bot.features.length - 3} more features</p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#2BB673]" />
                      <span>Full automation included</span>
                    </div>
                  )}
                  {isPackage && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs font-semibold text-orange-600">Save money with bundle pricing!</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(bot.price_monthly_cents || bot.monthly_price_cents || 0)}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>

                  {isSubscribed ? (
                    <button
                      className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                      disabled
                    >
                      Already Activated
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(bot.id)}
                      className="w-full bg-[#2BB673] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#259a5f] transition-colors"
                    >
                      Start 14-Day Free Trial
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">About AI Bots</h3>
        <p className="text-blue-800 text-sm">
          All AI bots come with a 14-day free trial. After the trial, you'll be charged monthly unless you cancel.
          Each bot integrates seamlessly with your Local-Link CRM and can be configured to match your business needs.
        </p>
      </div>
    </div>
  );
}
