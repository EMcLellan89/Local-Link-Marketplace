import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calculator, DollarSign, TrendingUp, Package, Users, Award } from 'lucide-react';
import { DEV_MODE } from '../../lib/devMode';
import type { PartnerTier } from '../../lib/commissionV2';
import {
  getCommissionRate,
  calculatePartnerRecruitBonus,
  calculateMerchantMembershipCommission,
  calculateOneHubCommission,
  calculateRecruitOverride,
  getTierRate,
  getTierFee,
} from '../../lib/commissionV2';

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
  metadata?: Record<string, unknown>;
}

const TIERS: { id: PartnerTier; label: string; fee: number; commissionPct: number; description: string }[] = [
  { id: 'starter',    label: 'Starter',    fee: 49,  commissionPct: 10, description: '10% commission • 1 territory' },
  { id: 'growth',     label: 'Growth',     fee: 99,  commissionPct: 15, description: '15% commission • 2 territories' },
  { id: 'pro',        label: 'Pro',        fee: 149, commissionPct: 20, description: '20% commission • 3 territories' },
  { id: 'enterprise', label: 'Enterprise', fee: 299, commissionPct: 25, description: '25% commission • Unlimited territories' },
];

type SimTab = 'marketplace' | 'recruit_bonus' | 'onehub' | 'recruit_override';

export default function CommissionSimulator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTier, setSelectedTier] = useState<PartnerTier>('growth');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selfFulfilled, setSelfFulfilled] = useState(true);
  const [activeTab, setActiveTab] = useState<SimTab>('marketplace');

  // Recruit bonus simulator
  const [recruitTier, setRecruitTier] = useState<PartnerTier>('growth');
  const [recruitFirstMonth, setRecruitFirstMonth] = useState(99);

  // 1Hub CRM/CPA simulator
  const [onehubMonthly, setOnehubMonthly] = useState(149);

  // Recruit override simulator
  const [recruitMonthlyCommissionable, setRecruitMonthlyCommissionable] = useState(500);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    if (DEV_MODE) {
      const mockProducts: Product[] = [
        { id: '1', sku: 'merchant_starter_49', name: 'Merchant Subscription - Starter', type: 'subscription', price_cents: 4900, commission_rate_bp: 0, category: 'merchant_membership', recurring: false },
        { id: '2', sku: 'merchant_growth_99', name: 'Merchant Subscription - Growth', type: 'subscription', price_cents: 9900, commission_rate_bp: 0, category: 'merchant_membership', recurring: false },
        { id: '3', sku: 'merchant_pro_149', name: 'Merchant Subscription - Pro', type: 'subscription', price_cents: 14900, commission_rate_bp: 0, category: 'merchant_membership', recurring: false },
        { id: '4', sku: 'merchant_enterprise_299', name: 'Merchant Subscription - Enterprise', type: 'subscription', price_cents: 29900, commission_rate_bp: 0, category: 'merchant_membership', recurring: false },
        { id: '5', sku: 'onehub_crm_cpa', name: '1Hub CRM (CPA)', type: 'subscription', price_cents: 14900, commission_rate_bp: 0, category: 'onehub_crm_cpa', recurring: true },
        { id: '6', sku: 'course_partner_accelerator', name: 'Partner Accelerator Program', type: 'course', price_cents: 19700, commission_rate_bp: 0, category: 'marketplace_product' },
        { id: '7', sku: 'blog_growth_system_97', name: 'Blog Growth System', type: 'course', price_cents: 9700, commission_rate_bp: 0, category: 'marketplace_product' },
        { id: '8', sku: 'dfy_lead_capture', name: 'DFY Lead Capture Setup', type: 'service', price_cents: 49900, commission_rate_bp: 0, category: 'marketplace_product', recurring: false },
        { id: '9', sku: 'marketing_services_499', name: 'Marketing Services', type: 'service', price_cents: 49900, commission_rate_bp: 0, category: 'job_board' },
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
      if (productsData.length > 0) setSelectedProduct(productsData[0]);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductCommission = (product: Product, tier: PartnerTier): number => {
    const sale = product.price_cents * quantity;
    if (product.category === 'merchant_membership') {
      return calculateMerchantMembershipCommission({ partnerTier: tier, firstMonthAmount: sale });
    }
    if (product.category === 'onehub_crm_cpa') {
      return calculateOneHubCommission({ monthlyAmount: sale });
    }
    if (product.category === 'job_board') {
      const rate = selfFulfilled ? getTierRate(tier) : 0.07;
      return Math.round(sale * rate);
    }
    const rate = getCommissionRate(product.category || 'marketplace_product', tier);
    return Math.round(sale * rate);
  };

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'merchant_membership', label: 'Merchant Plans' },
    { value: 'onehub_crm_cpa', label: '1Hub CRM' },
    { value: 'marketplace_product', label: 'Marketplace' },
    { value: 'job_board', label: 'Job Board' },
  ];

  const filteredProducts = categoryFilter === 'all'
    ? products
    : products.filter(p => p.category === categoryFilter);

  const groupedProducts = filteredProducts.reduce((acc, p) => {
    const key = p.category || 'other';
    (acc[key] = acc[key] || []).push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  const tabs: { id: SimTab; label: string; icon: React.ReactNode }[] = [
    { id: 'marketplace', label: 'Product Sale', icon: <Package className="w-4 h-4" /> },
    { id: 'recruit_bonus', label: 'Recruit Bonus', icon: <Users className="w-4 h-4" /> },
    { id: 'onehub', label: '1Hub CRM', icon: <Award className="w-4 h-4" /> },
    { id: 'recruit_override', label: 'Override', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2BB673]"></div>
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-5">
        <Calculator className="w-6 h-6 text-[#2BB673]" />
        <h2 className="text-xl font-semibold text-gray-900">Commission Calculator</h2>
      </div>

      {/* Tier selector */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Partner Tier</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {TIERS.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTier(t.id)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                selectedTier === t.id
                  ? 'border-[#2BB673] bg-[#2BB673]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-sm text-gray-900">{t.label}</p>
              <p className="text-xs text-[#2BB673] font-bold">{t.commissionPct}%</p>
              <p className="text-xs text-gray-500">${t.fee}/mo</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Product Sale Tab */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c.value}
                onClick={() => setCategoryFilter(c.value)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  categoryFilter === c.value
                    ? 'bg-[#2BB673] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select
              value={selectedProduct?.id || ''}
              onChange={e => {
                const p = products.find(x => x.id === e.target.value);
                if (p) setSelectedProduct(p);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
            >
              {Object.entries(groupedProducts).map(([cat, catProducts]) => (
                <optgroup key={cat} label={cat.replace(/_/g, ' ').toUpperCase()}>
                  {catProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${(p.price_cents / 100).toFixed(0)}{p.recurring ? '/mo' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {selectedProduct?.category === 'job_board' && (
            <label className="flex items-center gap-2 cursor-pointer bg-blue-50 rounded-lg p-3">
              <input
                type="checkbox"
                checked={selfFulfilled}
                onChange={e => setSelfFulfilled(e.target.checked)}
                className="w-4 h-4 text-[#2BB673] border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                I will self-fulfill ({selfFulfilled ? `${Math.round(getTierRate(selectedTier) * 100)}%` : '7%'} rate)
              </span>
            </label>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {selectedProduct && (
            <>
              <div className="bg-gradient-to-r from-[#2BB673]/10 to-emerald-50 rounded-lg p-4 border border-[#2BB673]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 font-medium">Sale Total:</span>
                  <span className="font-bold text-gray-900">
                    ${((selectedProduct.price_cents * quantity) / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#2BB673]/20">
                  <span className="text-sm text-gray-700 font-medium">Your Commission:</span>
                  <span className="text-2xl font-bold text-[#2BB673]">
                    ${(getProductCommission(selectedProduct, selectedTier) / 100).toLocaleString()}
                  </span>
                </div>
                {selectedProduct.category === 'merchant_membership' && (
                  <p className="text-xs text-amber-700 mt-2 font-medium">First month only — not recurring</p>
                )}
                {selectedProduct.category === 'onehub_crm_cpa' && (
                  <p className="text-xs text-green-700 mt-2 font-medium">30% recurring every month</p>
                )}
                {selectedProduct.recurring && selectedProduct.category !== 'merchant_membership' && (
                  <p className="text-xs text-green-700 mt-2 font-medium">
                    Recurring: ${(getProductCommission(selectedProduct, selectedTier) / 100).toLocaleString()}/mo per subscription
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Compare All Tiers</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {TIERS.map(t => {
                    const comm = getProductCommission(selectedProduct, t.id);
                    return (
                      <div
                        key={t.id}
                        className={`rounded-lg p-3 border-2 ${
                          t.id === selectedTier ? 'border-[#2BB673] bg-[#2BB673]/5' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <p className="text-xs font-semibold text-gray-900">{t.label}</p>
                        <p className="text-lg font-bold text-[#2BB673]">
                          ${(comm / 100).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{t.commissionPct}% rate</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Recruit Bonus Tab */}
      {activeTab === 'recruit_bonus' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-900 font-semibold">One-Time Recruit Bonus</p>
            <p className="text-xs text-amber-800 mt-1">
              When you recruit a new partner, you earn your tier rate on their first month's fee. This is a one-time bonus — not recurring.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Recruit's Tier</label>
            <select
              value={recruitTier}
              onChange={e => {
                setRecruitTier(e.target.value as PartnerTier);
                setRecruitFirstMonth(getTierFee(e.target.value as PartnerTier));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {TIERS.map(t => (
                <option key={t.id} value={t.id}>{t.label} — ${t.fee}/mo</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Month Fee ($)
            </label>
            <input
              type="number"
              min="1"
              value={recruitFirstMonth}
              onChange={e => setRecruitFirstMonth(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
            <p className="text-sm text-gray-700 font-medium mb-1">Your Recruit Bonus:</p>
            <p className="text-3xl font-bold text-amber-600">
              ${calculatePartnerRecruitBonus({ recruiterTier: selectedTier, firstMonthAmount: recruitFirstMonth }).toFixed(2)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {Math.round(getTierRate(selectedTier) * 100)}% of ${recruitFirstMonth} (your tier rate on their first month)
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Bonus by Your Tier</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TIERS.map(t => {
                const bonus = calculatePartnerRecruitBonus({ recruiterTier: t.id, firstMonthAmount: recruitFirstMonth });
                return (
                  <div
                    key={t.id}
                    className={`rounded-lg p-3 border-2 ${
                      t.id === selectedTier ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <p className="text-xs font-semibold text-gray-900">{t.label}</p>
                    <p className="text-lg font-bold text-amber-600">${bonus.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">{t.commissionPct}% rate</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 1Hub CRM Tab */}
      {activeTab === 'onehub' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-900 font-semibold">1Hub CRM / CPA — 30% Recurring</p>
            <p className="text-xs text-emerald-800 mt-1">
              1Hub CRM pays 30% recurring commission regardless of your tier. Every month your merchant stays active, you earn 30%.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly CRM Fee ($)</label>
            <input
              type="number"
              min="1"
              value={onehubMonthly}
              onChange={e => setOnehubMonthly(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
            <p className="text-sm text-gray-700 font-medium mb-1">Monthly Commission:</p>
            <p className="text-3xl font-bold text-emerald-600">
              ${calculateOneHubCommission({ monthlyAmount: onehubMonthly }).toFixed(2)}/mo
            </p>
            <p className="text-xs text-gray-600 mt-1">
              30% of ${onehubMonthly} — flat rate, no tier dependency
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Projected Recurring Income
            </p>
            <div className="space-y-2">
              {[1, 5, 10, 20].map(count => {
                const monthly = calculateOneHubCommission({ monthlyAmount: onehubMonthly }) * count;
                return (
                  <div key={count} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{count} merchant{count > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-emerald-600">${monthly.toFixed(0)}/mo</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recruit Override Tab */}
      {activeTab === 'recruit_override' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900 font-semibold">7% Recruit Override (1 Level)</p>
            <p className="text-xs text-blue-800 mt-1">
              You earn 7% on all commissionable sales your direct recruits make. This is passive income — one level deep only.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recruit's Monthly Commissionable Sales ($)
            </label>
            <input
              type="number"
              min="0"
              value={recruitMonthlyCommissionable}
              onChange={e => setRecruitMonthlyCommissionable(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-700 font-medium mb-1">Monthly Override Income:</p>
            <p className="text-3xl font-bold text-blue-600">
              ${calculateRecruitOverride({ recruitCommissionableAmount: recruitMonthlyCommissionable }).toFixed(2)}/mo
            </p>
            <p className="text-xs text-gray-600 mt-1">
              7% of ${recruitMonthlyCommissionable.toLocaleString()} per recruit per month
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Scale Your Override Network
            </p>
            <div className="space-y-2">
              {[1, 3, 5, 10].map(count => {
                const monthly = calculateRecruitOverride({ recruitCommissionableAmount: recruitMonthlyCommissionable }) * count;
                return (
                  <div key={count} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{count} active recruit{count > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-blue-600">${monthly.toFixed(0)}/mo</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * Assumes each recruit generates ${recruitMonthlyCommissionable.toLocaleString()} in commissionable sales
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
