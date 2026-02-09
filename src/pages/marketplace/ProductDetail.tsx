import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Check, CreditCard, Shield, Zap } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  image_url: string;
  product_type: string;
}

interface Price {
  id: string;
  pricing: 'one_time' | 'monthly' | 'annual';
  amount_cents: number;
  stripe_price_id: string;
}

interface CheckoutConfig {
  enable_order_bump: boolean;
  order_bump_product_id: string;
  order_bump_amount_cents: number;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partnerRef = searchParams.get('ref');

  const [product, setProduct] = useState<Product | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<'one_time' | 'monthly' | 'annual'>('one_time');
  const [bumpSelected, setBumpSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    try {
      const { data: productData, error: productError } = await supabase
        .from('marketplace_products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      const { data: pricesData, error: pricesError } = await supabase
        .from('marketplace_product_prices')
        .select('*')
        .eq('product_id', productData.id)
        .eq('is_active', true);

      if (pricesError) throw pricesError;
      setPrices(pricesData || []);

      if (pricesData && pricesData.length > 0) {
        const defaultPrice = pricesData.find(p => p.pricing === 'monthly') || pricesData[0];
        setSelectedPricing(defaultPrice.pricing);
      }

      const { data: configData } = await supabase
        .from('marketplace_checkout_configs')
        .select('*')
        .eq('product_id', productData.id)
        .maybeSingle();

      setConfig(configData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (!product || !email) {
      alert('Please enter your email address');
      return;
    }

    setCheckingOut(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-marketplace-checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': session?.session ? `Bearer ${session.session.access_token}` : '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_slug: product.slug,
            pricing: selectedPricing,
            partner_referral_code: partnerRef || null,
            customer_email: email,
            bump_selected: bumpSelected,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create checkout');

      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout');
    } finally {
      setCheckingOut(false);
    }
  }

  function formatCurrency(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-blue-600 hover:text-blue-700"
          >
            Return to marketplace
          </button>
        </div>
      </div>
    );
  }

  const selectedPrice = prices.find(p => p.pricing === selectedPricing);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            {product.image_url && (
              <div className="rounded-xl overflow-hidden shadow-lg mb-6">
                <img src={product.image_url} alt={product.name} className="w-full" />
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{product.description}</p>
            {product.long_description && (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{product.long_description}</p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Get Started</h3>

              {prices.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose your plan
                  </label>
                  <div className="grid gap-3">
                    {prices.map((price) => (
                      <button
                        key={price.id}
                        onClick={() => setSelectedPricing(price.pricing)}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          selectedPricing === price.pricing
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-900 capitalize">
                              {price.pricing.replace('_', ' ')}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(price.amount_cents)}
                              {price.pricing !== 'one_time' && (
                                <span className="text-base font-normal text-gray-600">
                                  /{price.pricing === 'monthly' ? 'mo' : 'yr'}
                                </span>
                              )}
                            </div>
                          </div>
                          {selectedPricing === price.pricing && (
                            <Check className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {config?.enable_order_bump && (
                <div className="mb-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bumpSelected}
                      onChange={(e) => setBumpSelected(e.target.checked)}
                      className="mt-1 w-5 h-5"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Add order bump</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Special offer - add this to your order
                      </div>
                      {config.order_bump_amount_cents && (
                        <div className="text-lg font-bold text-blue-600 mt-1">
                          +{formatCurrency(config.order_bump_amount_cents)}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut || !email}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {checkingOut ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Continue to Checkout
                  </>
                )}
              </button>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure payment via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span>Instant access after payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
