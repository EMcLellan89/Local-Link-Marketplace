import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  MapPin, Users, TrendingUp, CheckCircle, Star,
  Zap, Target, DollarSign, ArrowRight, Shield
} from 'lucide-react';

interface Product {
  sku: string;
  name: string;
  description: string;
  type: string;
  price_cents: number;
  recurring: boolean;
  metadata: any;
  category: string;
}

export default function NetworkNavigatorsPage() {
  const navigate = useNavigate();
  const [territoryProducts, setTerritoryProducts] = useState<Product[]>([]);
  const [dfyProducts, setDfyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('marketplace_affiliate_products')
        .select('*')
        .eq('business_key', 'network-navigators')
        .eq('active', true)
        .order('price_cents', { ascending: false });

      if (error) throw error;

      const territories = data?.filter(p => p.recurring) || [];
      const dfy = data?.filter(p => !p.recurring) || [];

      setTerritoryProducts(territories);
      setDfyProducts(dfy);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(cents: number) {
    return `$${(cents / 100).toFixed(0)}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Network Navigators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Exclusive Territory Rights Available</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Turn Your Customers Into<br />
              <span className="text-yellow-300">Recurring Monthly Revenue</span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Build a private Facebook Group membership program for your local business.
              Transform one-time customers into $2K-$10K monthly recurring revenue.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Protected Territory</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Done-For-You Setup</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Monthly Coaching</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Network Navigators Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A proven system to monetize your existing customer base through private community membership
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Choose Territory</h3>
            <p className="text-gray-600">Select your exclusive 25, 50, or 75-mile radius</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Build Community</h3>
            <p className="text-gray-600">Create private Facebook Group for your customers</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Launch Membership</h3>
            <p className="text-gray-600">Offer exclusive perks, priority service, discounts</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">4. Grow Revenue</h3>
            <p className="text-gray-600">Scale to $2K-$10K/month recurring income</p>
          </div>
        </div>
      </div>

      {/* Territory Subscriptions */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Territory</h2>
            <p className="text-lg text-gray-600">
              Get exclusive rights to build Facebook Group memberships in your area
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {territoryProducts.map((product) => {
              const radius = product.metadata?.territory_radius || 0;
              const includes = product.metadata?.includes || [];
              const isPopular = radius === 50;

              return (
                <div
                  key={product.sku}
                  className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-2xl ${
                    isPopular ? 'border-blue-600 shadow-xl scale-105' : 'border-gray-200'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isPopular ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <MapPin className={`w-6 h-6 ${isPopular ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{radius} Mile</h3>
                        <p className="text-sm text-gray-500">Territory Radius</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatCurrency(product.price_cents)}
                        </span>
                        <span className="text-gray-500">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {includes.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => navigate(`/marketplace/checkout?sku=${product.sku}`)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Claim Territory
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Done-For-You Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Growth Infrastructure</h2>
          <p className="text-lg text-gray-600">
            We handle the technical work so you can focus on growing your membership
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dfyProducts.map((product) => {
            const deliverables = product.metadata?.deliverables || [];
            const turnaround = product.metadata?.turnaround_days || 0;

            return (
              <div
                key={product.sku}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{turnaround} day turnaround</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>

                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-500 mb-2">Includes:</p>
                  <ul className="space-y-1">
                    {deliverables.slice(0, 4).map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {deliverables.length > 4 && (
                    <p className="text-xs text-gray-500 mt-1">+ {deliverables.length - 4} more</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(product.price_cents)}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/marketplace/checkout?sku=${product.sku}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why It Works */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Network Navigators Works</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Built on proven principles of community, exclusivity, and recurring value
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Protected Territory</h3>
              <p className="text-gray-300">
                Exclusive rights mean no competition in your area. Your territory, your customers.
              </p>
            </div>

            <div className="text-center">
              <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Built-In Demand</h3>
              <p className="text-gray-300">
                Your existing customers already trust you. They'll pay for VIP access and perks.
              </p>
            </div>

            <div className="text-center">
              <DollarSign className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Predictable Income</h3>
              <p className="text-gray-300">
                Recurring monthly revenue you can count on. Scale from $1K to $10K+/month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Recurring Revenue?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of local businesses already earning $2K-$10K/month through membership programs
          </p>
          <button
            onClick={() => {
              const firstTerritory = territoryProducts[0];
              if (firstTerritory) {
                navigate(`/marketplace/checkout?sku=${firstTerritory.sku}`);
              }
            }}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            Claim Your Territory Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
