import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, HeadphonesIcon, XCircle, Phone, TrendingUp, Star, Globe, Repeat } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';

type DFYCategory = {
  key: string;
  name: string;
  description: string;
  icon: any;
};

type DFYProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_value_prop: string;
  setup_price_cents: number;
  monthly_price_cents: number;
  setup_sla_hours: number;
};

const categories: DFYCategory[] = [
  {
    key: 'lead_capture',
    name: 'AI Lead Capture & Conversion',
    description: 'Capture and convert leads automatically.',
    icon: Phone,
  },
  {
    key: 'funnels',
    name: 'AI Funnels & Sales Automation',
    description: 'Turn clicks into booked jobs on autopilot.',
    icon: TrendingUp,
  },
  {
    key: 'reviews',
    name: 'AI Reviews & Reputation',
    description: 'More 5-star reviews with protection built in.',
    icon: Star,
  },
  {
    key: 'visibility',
    name: 'AI Visibility & Content',
    description: 'Stay visible everywhere without doing content work.',
    icon: Globe,
  },
  {
    key: 'operations',
    name: 'AI Operations & Retention',
    description: 'Reduce churn and improve workflow automatically.',
    icon: Repeat,
  },
];

export default function DFYHub() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<DFYProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('dfy_products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading DFY products:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.short_value_prop.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'lowest_monthly') return a.monthly_price_cents - b.monthly_price_cents;
      if (sortBy === 'fastest_setup') return a.setup_sla_hours - b.setup_sla_hours;
      return 0; // recommended
    });

  return (
    <DashboardLayout role="merchant">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900">Done For You</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We install and run these AI systems for your business. Setup in 24–72 hours.
          </p>

          {/* Trust Chips */}
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-medium">DFY Setup Included</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <HeadphonesIcon className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Monthly Support Included</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <XCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Cancel Anytime</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Explore Tools
            </button>
            <button
              onClick={() => navigate('/merchant/support')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 font-medium"
            >
              Talk to Sales
            </button>
          </div>
        </div>

        {/* Category Tiles */}
        <div id="categories" className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Choose a Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition-all"
                >
                  <Icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                  <p className="text-gray-600">{cat.description}</p>
                  <div className="mt-4 text-blue-600 font-medium">View Tools →</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        <div id="tools" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-3xl font-bold text-gray-900">All Tools</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recommended">Recommended</option>
                <option value="lowest_monthly">Lowest Monthly</option>
                <option value="fastest_setup">Fastest Setup</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/merchant/done-for-you/${product.slug}`)}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.short_value_prop}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Setup SLA:</span>
                      <span className="font-medium text-gray-900">Live in {product.setup_sla_hours} hours</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      ${(product.setup_price_cents / 100).toFixed(0)} setup
                    </div>
                    <div className="text-lg text-gray-600">
                      ${(product.monthly_price_cents / 100).toFixed(0)}/mo
                    </div>
                  </div>

                  <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tools found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pick a Tool</h3>
              <p className="text-gray-600">Choose the AI system that fits your needs.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Checkout</h3>
              <p className="text-gray-600">Complete payment and fill out a quick intake form.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">We Launch It</h3>
              <p className="text-gray-600">Our team builds and launches it within 24–72 hours.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Do I need new software?',
                a: 'No. We integrate with what you already use - your phone, calendar, website, and CRM.',
              },
              {
                q: 'How long does setup take?',
                a: 'Most tools are live in 24–72 hours. Complex integrations may take up to a week.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel anytime without penalty. One-time setup fees are non-refundable.',
              },
              {
                q: 'What do you need from me?',
                a: 'Just a short intake form with your business details and access to the systems we integrate with.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-lg p-6 group">
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
