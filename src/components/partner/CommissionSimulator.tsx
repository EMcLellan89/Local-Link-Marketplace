import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calculator, DollarSign, TrendingUp, Package } from 'lucide-react';
import Button from '../ui/Button';
import { DEV_MODE } from '../../lib/devMode';

interface Product {
  id: string;
  sku: string;
  name: string;
  type: string;
  price_cents: number;
  commission_rate_bp: number;
  category?: string;
  recurring?: boolean;
  description?: string;
  metadata?: any;
}

interface TierCommission {
  tier: string;
  commissionCents: number;
  commissionRate: number;
  multiplier: number;
}

const TIER_MULTIPLIERS: Record<string, { label: string; commissionRate: number; description: string; monthlyCost: number; territories: string }> = {
  'starter': {
    label: 'Starter Partner ($218/mo)',
    commissionRate: 0.15,
    description: 'Starter CRM included • 15% commission • 1 territory',
    monthlyCost: 21800,
    territories: '1 territory max'
  },
  'pro': {
    label: 'Pro Partner ($658/mo)',
    commissionRate: 0.20,
    description: 'Professional CRM included • 20% commission • 3 territories',
    monthlyCost: 65800,
    territories: '3 territories max'
  },
  'enterprise': {
    label: 'Enterprise Partner ($1,798/mo)',
    commissionRate: 0.25,
    description: 'Enterprise CRM included • 25% commission • Unlimited territories',
    monthlyCost: 179800,
    territories: 'Unlimited territories'
  }
};

export default function CommissionSimulator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('starter');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selfFulfilled, setSelfFulfilled] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    if (DEV_MODE) {
      const mockProducts: Product[] = [
        { id: '1', sku: 'tradehive_merchant_solo_45', name: 'TradeHive CRM - Solo (Merchant)', type: 'subscription', price_cents: 4500, commission_rate_bp: 10000, category: 'merchant_crm', recurring: true },
        { id: '2', sku: 'tradehive_merchant_scale_499', name: 'TradeHive CRM - Scale (Merchant)', type: 'subscription', price_cents: 49900, commission_rate_bp: 10000, category: 'merchant_crm', recurring: true },
        { id: '3', sku: 'drive_repeat_business_79', name: 'Drive Repeat Business Program', type: 'service', price_cents: 7999, commission_rate_bp: 0, category: 'fixed_commission', metadata: { fixed_commission_cents: 7500 } },
        { id: '4', sku: 'business_capital_129', name: 'Business Capital Application', type: 'service', price_cents: 12999, commission_rate_bp: 0, category: 'fixed_commission', metadata: { fixed_commission_cents: 10000 } },
        { id: '5', sku: 'marketing_services_499', name: 'Marketing Services', type: 'service', price_cents: 49900, commission_rate_bp: 700, category: 'job_board' },
        { id: '6', sku: 'website_design_1499', name: 'Website Design & Development', type: 'service', price_cents: 149900, commission_rate_bp: 700, category: 'job_board' },
        { id: '7', sku: 'course_partner_accelerator', name: 'Partner Accelerator Program', type: 'course', price_cents: 19700, commission_rate_bp: 10000, category: 'course' },
      ];
      setProducts(mockProducts);
      setSelectedProduct(mockProducts[0]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('marketplace_affiliate_products')
        .select('id, sku, name, type, price_cents, commission_rate_bp, category, recurring, description, metadata')
        .eq('active', true)
        .order('category, price_cents desc');

      if (error) throw error;

      const productsData = data as Product[];
      setProducts(productsData);
      if (productsData.length > 0) {
        setSelectedProduct(productsData[0]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCommissions = (): TierCommission[] => {
    if (!selectedProduct) return [];

    return Object.entries(TIER_MULTIPLIERS).map(([tier, config]) => {
      let commissionCents = 0;

      // Calculate commission based on product category
      if (selectedProduct.category === 'fixed_commission') {
        // Fixed commission services (Drive Repeat Business, Merchant Services, Business Capital)
        commissionCents = (selectedProduct.metadata?.fixed_commission_cents || 0) * quantity;
      } else if (selectedProduct.category === 'job_board') {
        // Job board services: 7% if outsourced, tier % if self-fulfilled
        if (selfFulfilled) {
          commissionCents = Math.round(selectedProduct.price_cents * quantity * config.commissionRate);
        } else {
          commissionCents = Math.round(selectedProduct.price_cents * quantity * 0.07);
        }
      } else {
        // Regular products (CRMs, courses): tier % commission
        commissionCents = Math.round(selectedProduct.price_cents * quantity * config.commissionRate);
      }

      return {
        tier,
        commissionCents,
        commissionRate: selectedProduct.category === 'fixed_commission'
          ? ((selectedProduct.metadata?.fixed_commission_cents || 0) / selectedProduct.price_cents * 100)
          : (selectedProduct.category === 'job_board' && !selfFulfilled ? 7 : config.commissionRate * 100),
        multiplier: config.commissionRate / 0.15
      };
    });
  };

  const selectedTierCommission = calculateCommissions().find(c => c.tier === selectedTier);
  const totalAmount = selectedProduct ? selectedProduct.price_cents * quantity : 0;

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'merchant_crm', label: 'Merchant CRMs' },
    { value: 'fixed_commission', label: 'Fixed Commission Services' },
    { value: 'job_board', label: 'Job Board Services' },
    { value: 'course', label: 'Courses' },
  ];

  const filteredProducts = categoryFilter === 'all'
    ? products
    : products.filter(p => p.category === categoryFilter);

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const categoryLabel = product.category || 'other';
    if (!acc[categoryLabel]) {
      acc[categoryLabel] = [];
    }
    acc[categoryLabel].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2BB673]"></div>
          <p className="mt-2 text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calculator className="w-6 h-6 text-[#2BB673]" />
        <h2 className="text-xl font-semibold text-gray-900">Commission Calculator</h2>
      </div>

      <div className="space-y-2 mb-6">
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4">
          <p className="text-sm text-emerald-900 font-bold mb-2">PARTNER PRICING (CRM INCLUDED):</p>
          <ul className="text-sm text-emerald-800 space-y-1">
            <li>• <strong>Starter Partner:</strong> $218/mo (Starter CRM included, 15% commission, 1 territory)</li>
            <li>• <strong>Pro Partner:</strong> $658/mo (Professional CRM included, 20% commission, 3 territories)</li>
            <li>• <strong>Enterprise Partner:</strong> $1,798/mo (Enterprise CRM included, 25% commission, unlimited territories)</li>
          </ul>
          <p className="text-xs text-emerald-700 mt-2 font-semibold">
            ✓ ONE monthly fee includes partner program access AND your CRM - no additional costs!
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Why This Beats Boss Suite:</strong> Boss Suite pays $300-$600 one-time. Local-Link pays 15-25% recurring monthly commissions on CRMs, courses, and services - PLUS job board payouts and 7% upline bonus.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-900 font-semibold mb-1">Special Commission Rules:</p>
          <ul className="text-xs text-amber-800 space-y-1">
            <li>• <strong>Fixed Commissions:</strong> Drive Repeat Business & Merchant Services = $75, Business Capital = $100</li>
            <li>• <strong>Job Board Services:</strong> 7% if outsourced to others, your tier % if you fulfill it yourself</li>
            <li>• <strong>Recurring CRMs:</strong> Monthly recurring commissions based on your tier (15%, 20%, or 25%)</li>
            <li>• <strong>Courses:</strong> One-time commission when merchant purchases</li>
            <li>• <strong>Upline Bonus:</strong> Your upline earns 7% on all your commissionable sales</li>
            <li>• <strong>No Commission:</strong> Academy, Deals, Reviews, Analytics, Invoicing features</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Partner Tier</label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
          >
            {Object.entries(TIER_MULTIPLIERS).map(([tier, config]) => (
              <option key={tier} value={tier}>
                {config.label} - {config.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Filter</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setCategoryFilter(category.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  categoryFilter === category.value
                    ? 'bg-[#2BB673] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product ({filteredProducts.length} available)
          </label>
          <select
            value={selectedProduct?.id || ''}
            onChange={(e) => {
              const product = products.find((p) => p.id === e.target.value);
              if (product) setSelectedProduct(product);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
          >
            {Object.entries(groupedProducts).map(([type, typeProducts]) => (
              <optgroup key={type} label={type.toUpperCase()}>
                {typeProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${(product.price_cents / 100).toFixed(2)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {selectedProduct?.category === 'job_board' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selfFulfilled}
                onChange={(e) => setSelfFulfilled(e.target.checked)}
                className="w-4 h-4 text-[#2BB673] border-gray-300 rounded focus:ring-[#2BB673]"
              />
              <span className="text-sm font-medium text-gray-700">
                I will self-fulfill this service (earn {TIER_MULTIPLIERS[selectedTier].commissionRate * 100}% instead of 7%)
              </span>
            </label>
            <p className="text-xs text-gray-600 mt-1 ml-6">
              {selfFulfilled
                ? `You'll earn your tier commission rate because you're doing the work`
                : `You'll earn 7% because someone else or admin will do the work`
              }
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
          />
        </div>

        <div className="bg-gradient-to-r from-[#2BB673]/10 to-blue-50 rounded-lg p-4 border border-[#2BB673]/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Total Sale Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              ${(totalAmount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          {selectedTierCommission && (
            <>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#2BB673]/20">
                <span className="text-gray-700 font-medium">Your Commission:</span>
                <span className="text-3xl font-bold text-[#2BB673]">
                  ${(selectedTierCommission.commissionCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Commission Rate:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedTierCommission.commissionRate.toFixed(2)}%
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-[#2BB673]" />
            <h3 className="font-semibold text-gray-900">Compare All Tiers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {calculateCommissions().map(({ tier, commissionCents, commissionRate, multiplier }) => {
              const config = TIER_MULTIPLIERS[tier];
              const isSelected = tier === selectedTier;

              return (
                <div
                  key={tier}
                  className={`rounded-lg p-4 border-2 transition-all ${
                    isSelected
                      ? 'border-[#2BB673] bg-[#2BB673]/5'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">{config.label}</h4>
                    {tier === 'pro' && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded-full">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-[#2BB673] mb-1">
                    ${(commissionCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-600">{commissionRate.toFixed(0)}% commission rate</p>
                  <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-green-50 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-900">Monthly Recurring Example</p>
                <p className="text-sm text-green-800 mt-1">
                  If you sell this {quantity}x per month, your monthly recurring income would be:
                </p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {calculateCommissions().map(({ tier, commissionCents }) => {
                    const tierConfig = TIER_MULTIPLIERS[tier];
                    const monthlyCost = tierConfig.monthlyCost;
                    const netIncome = commissionCents - monthlyCost;

                    return (
                      <div key={tier} className="bg-white rounded px-2 py-1.5">
                        <p className="text-xs text-gray-600 mb-0.5">{tierConfig.label.split(' ')[0]}</p>
                        <p className="text-xs font-semibold text-green-600">
                          Gross: ${(commissionCents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cost: ${(monthlyCost / 100).toFixed(0)}
                        </p>
                        <p className={`text-sm font-bold ${netIncome >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                          Net: ${(netIncome / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  * Net income = Gross commissions - Partner tier cost (CRM included in price)
                </p>
              </div>
            </div>
          </div>

          {selectedProduct.type === 'course' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Course Commissions:</strong> Courses typically offer higher commission rates (20%+) because they're digital products with no fulfillment costs.
              </p>
            </div>
          )}

          {selectedProduct.type === 'service' && selectedProduct.price_cents >= 50000 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                <strong>High-Ticket Service:</strong> Premium services like coaching and appointment setting offer substantial one-time commissions. Focus on quality over quantity.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
