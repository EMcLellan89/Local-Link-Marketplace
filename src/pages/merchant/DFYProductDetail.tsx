import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Clock, HeadphonesIcon, XCircle, ChevronDown } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';

type DFYProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_value_prop: string;
  long_description: string;
  outcomes: string[];
  includes: string[];
  faq: Array<{ q: string; a: string }>;
  setup_price_cents: number;
  monthly_price_cents: number;
  setup_sla_hours: number;
};

type DFYAddon = {
  id: string;
  code: string;
  name: string;
  description: string;
  price_cents: number;
  is_recurring: boolean;
};

export default function DFYProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partnerRef = searchParams.get('ref'); // Partner tracking

  const [product, setProduct] = useState<DFYProduct | null>(null);
  const [addons, setAddons] = useState<DFYAddon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  async function loadProduct() {
    try {
      const { data: productData, error: productError } = await supabase
        .from('dfy_products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Load add-ons
      const { data: addonsData, error: addonsError } = await supabase
        .from('dfy_addons')
        .select('*')
        .eq('product_id', productData.id)
        .eq('is_active', true);

      if (addonsError) throw addonsError;
      setAddons(addonsData || []);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleAddon(addonId: string) {
    const newSet = new Set(selectedAddons);
    if (newSet.has(addonId)) {
      newSet.delete(addonId);
    } else {
      newSet.add(addonId);
    }
    setSelectedAddons(newSet);
  }

  function calculateTotal() {
    if (!product) return { setupTotal: 0, monthlyTotal: 0, dueToday: 0 };

    let setupTotal = product.setup_price_cents;
    let monthlyTotal = product.monthly_price_cents;

    addons.forEach((addon) => {
      if (selectedAddons.has(addon.id)) {
        if (addon.is_recurring) {
          monthlyTotal += addon.price_cents;
        } else {
          setupTotal += addon.price_cents;
        }
      }
    });

    const dueToday = setupTotal + monthlyTotal; // First month included

    return { setupTotal, monthlyTotal, dueToday };
  }

  async function handleCheckout() {
    if (!product) return;

    setCheckingOut(true);
    try {
      // In a real implementation, this would call an Edge Function
      // For now, we'll navigate to a checkout page
      const selectedAddonCodes = addons
        .filter((a) => selectedAddons.has(a.id))
        .map((a) => a.code);

      // Store checkout data in sessionStorage
      sessionStorage.setItem(
        'dfy_checkout',
        JSON.stringify({
          productSlug: product.slug,
          addonCodes: selectedAddonCodes,
          ref: partnerRef,
        })
      );

      // Navigate to checkout (would redirect to Stripe in production)
      navigate(`/merchant/done-for-you/${product.slug}/checkout`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="merchant">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout role="merchant">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/merchant/done-for-you')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Done For You
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { setupTotal, monthlyTotal, dueToday } = calculateTotal();

  return (
    <DashboardLayout role="merchant">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/merchant/done-for-you')}
          className="mb-6 text-blue-600 hover:underline flex items-center gap-2"
        >
          ← Back to Done For You
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-2xl text-gray-600">{product.short_value_prop}</p>

              {/* Trust Chips */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Setup Included</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <HeadphonesIcon className="w-5 h-5 text-green-600" />
                  <span>Support Included</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <XCircle className="w-5 h-5 text-green-600" />
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>

            {/* Long Description */}
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700">{product.long_description}</p>
            </div>

            {/* Outcomes */}
            <div className="bg-blue-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Get</h2>
              <ul className="space-y-3">
                {product.outcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Includes */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {product.includes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    1
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Checkout</h3>
                  <p className="text-gray-600 text-sm">Complete payment securely with Stripe.</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    2
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Intake Form</h3>
                  <p className="text-gray-600 text-sm">Tell us about your business (3-5 minutes).</p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    3
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">We Launch</h3>
                  <p className="text-gray-600 text-sm">Live in {product.setup_sla_hours} hours.</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {product.faq.map((faq, idx) => (
                  <details key={idx} className="bg-white border border-gray-200 rounded-lg p-6 group">
                    <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                      {faq.q}
                      <ChevronDown className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-4 text-gray-600">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Pricing Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border-2 border-gray-200 rounded-xl p-6 bg-white shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h3>

              {/* Base Pricing */}
              <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Setup Fee (one-time)</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${(product.setup_price_cents / 100).toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly Subscription</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${(product.monthly_price_cents / 100).toFixed(0)}/mo
                  </span>
                </div>
              </div>

              {/* Add-ons */}
              {addons.length > 0 && (
                <div className="py-6 border-b border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">Add-ons (Optional)</h4>
                  <div className="space-y-3">
                    {addons.map((addon) => (
                      <label key={addon.id} className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedAddons.has(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 group-hover:text-blue-600">
                              {addon.name}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              ${(addon.price_cents / 100).toFixed(0)}
                              {addon.is_recurring && '/mo'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="py-6 space-y-3">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-600">Setup Total</span>
                  <span className="font-bold text-gray-900">${(setupTotal / 100).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-600">Monthly Total</span>
                  <span className="font-bold text-gray-900">${(monthlyTotal / 100).toFixed(0)}/mo</span>
                </div>
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between text-2xl">
                    <span className="font-bold text-gray-900">Due Today</span>
                    <span className="font-bold text-blue-600">${(dueToday / 100).toFixed(0)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Includes first month</p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkingOut ? 'Processing...' : 'Start Setup'}
              </button>

              {/* SLA */}
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 justify-center">
                <Clock className="w-4 h-4" />
                <span>Live in {product.setup_sla_hours} hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
