import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Package, TrendingUp, Sparkles, Filter,
  Search, Tag, ArrowRight, Star
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Deals', icon: Tag },
  { id: 'marketing_ads', label: 'Marketing & Ads', icon: TrendingUp },
  { id: 'ai_automation', label: 'AI & Automation', icon: Sparkles },
  { id: 'crm_sms', label: 'CRM & SMS', icon: Package },
  { id: 'web_hosting', label: 'Web & Hosting', icon: Package },
  { id: 'reviews_reputation', label: 'Reviews', icon: Star },
  { id: 'design_video', label: 'Design & Video', icon: Package },
  { id: 'operations', label: 'Operations', icon: Package }
];

export default function BusinessDealsHub() {
  const [deals, setDeals] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBundles, setShowBundles] = useState(false);

  useEffect(() => {
    loadDeals();
    loadBundles();
  }, []);

  async function loadDeals() {
    try {
      const { data, error } = await supabase
        .from('business_deals')
        .select('*, vendor:vendors(name, logo_url)')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadBundles() {
    try {
      const { data, error } = await supabase
        .from('deal_bundles')
        .select('*')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBundles(data || []);
    } catch (error) {
      console.error('Error loading bundles:', error);
    }
  }

  const filteredDeals = deals.filter(deal => {
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Business Tools & Growth Deals
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Everything your local business needs to grow — at insider pricing.
            Vetted tools, exclusive discounts, updated monthly.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for tools, vendors, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toggle between Deals and Bundles */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setShowBundles(false)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              !showBundles
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Individual Deals ({deals.length})
          </button>
          <button
            onClick={() => setShowBundles(true)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              showBundles
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Bundle Packages ({bundles.length})
          </button>
        </div>

        {!showBundles ? (
          <>
            {/* Category Filter */}
            <div className="bg-white rounded-lg shadow mb-8 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Filter by Category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>

            {filteredDeals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No deals found matching your criteria.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Featured Bundles */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                High-Value Bundle Packages
              </h2>
              <p className="text-gray-600 mb-6">
                Save big with curated bundles combining multiple tools and services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bundles.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Growth Guides CTA */}
      <div className="bg-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Not sure where to start?
            </h2>
            <p className="text-gray-600 mb-6">
              Check out our Growth Guides library for step-by-step tutorials, playbooks, and strategies.
            </p>
            <Link
              to="/marketplace/growth-guides"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Growth Guides
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: any }) {
  const savingsAmount = (deal.regular_price_cents - deal.deal_price_cents) / 100;

  return (
    <Link
      to={`/marketplace/deals/${deal.slug}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={deal.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {deal.featured && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
            FEATURED
          </div>
        )}
        {deal.discount_percent > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {deal.discount_percent}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Vendor */}
        {deal.vendor && (
          <p className="text-sm text-gray-600 mb-2">{deal.vendor.name}</p>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {deal.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {deal.description}
        </p>

        {/* Features */}
        {deal.features && deal.features.length > 0 && (
          <ul className="space-y-1 mb-4">
            {deal.features.slice(0, 3).map((feature: string, idx: number) => (
              <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            {deal.regular_price_cents > deal.deal_price_cents && (
              <p className="text-sm text-gray-500 line-through">
                ${(deal.regular_price_cents / 100).toFixed(0)}
              </p>
            )}
            <p className="text-2xl font-bold text-gray-900">
              ${(deal.deal_price_cents / 100).toFixed(0)}
            </p>
            {savingsAmount > 0 && (
              <p className="text-xs text-green-600 font-semibold">
                Save ${savingsAmount.toFixed(0)}
              </p>
            )}
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
            Get Deal
          </button>
        </div>
      </div>
    </Link>
  );
}

function BundleCard({ bundle }: { bundle: any }) {
  const savingsAmount = (bundle.retail_price_cents - bundle.bundle_price_cents) / 100;
  const discountPercent = Math.round((savingsAmount / (bundle.retail_price_cents / 100)) * 100);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        {bundle.featured && (
          <div className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold mb-3">
            MOST POPULAR
          </div>
        )}
        <h3 className="text-2xl font-bold mb-2">{bundle.name}</h3>
        <p className="text-blue-100">{bundle.description}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Features */}
        {bundle.features && bundle.features.length > 0 && (
          <ul className="space-y-3 mb-6">
            {bundle.features.map((feature: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Included Services */}
        {bundle.included_services && bundle.included_services.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-2">Includes:</p>
            <div className="flex flex-wrap gap-2">
              {bundle.included_services.map((service: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="pt-6 border-t">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 line-through">
                ${(bundle.retail_price_cents / 100).toFixed(0)}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ${(bundle.bundle_price_cents / 100).toFixed(0)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {discountPercent}% OFF
              </p>
              <p className="text-sm text-gray-600">
                Save ${savingsAmount.toFixed(0)}
              </p>
            </div>
          </div>

          <Link
            to={`/marketplace/bundles/${bundle.slug}`}
            className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Get Bundle Package
          </Link>
        </div>
      </div>
    </div>
  );
}
