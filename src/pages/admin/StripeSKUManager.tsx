import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusCircle, CheckCircle, AlertCircle, Copy, RefreshCw } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  metadata: any;
  is_active: boolean;
}

interface Price {
  id: string;
  product_id: string;
  pricing: string;
  interval: string | null;
  amount_cents: number;
  currency: string;
  stripe_price_id: string | null;
  is_active: boolean;
}

export default function StripeSKUManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [adminKey, setAdminKey] = useState('');

  useEffect(() => {
    loadProducts();
    const storedKey = localStorage.getItem('admin_key');
    if (storedKey) setAdminKey(storedKey);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      loadPrices(selectedProduct.id);
    }
  }, [selectedProduct]);

  async function loadProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('marketplace_products')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (data) {
      setProducts(data);
      if (data.length > 0 && !selectedProduct) {
        setSelectedProduct(data[0]);
      }
    }
    setLoading(false);
  }

  async function loadPrices(productId: string) {
    const { data } = await supabase
      .from('marketplace_product_prices')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .order('amount_cents');

    if (data) {
      setPrices(data);
    }
  }

  function getStatusPill(price: Price) {
    if (price.stripe_price_id) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
          <CheckCircle className="w-4 h-4" />
          Created
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
        <AlertCircle className="w-4 h-4" />
        Missing
      </span>
    );
  }

  function formatPrice(cents: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  }

  async function createProductAndPrice(priceId: string) {
    if (!adminKey) {
      alert('Please enter admin key');
      return;
    }

    if (!selectedProduct) return;

    setCreating(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stripe-create-product-price`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'X-Admin-Key': adminKey,
          },
          body: JSON.stringify({
            product_id: selectedProduct.id,
            price_id: priceId,
          }),
        }
      );

      const result = await response.json();

      if (result.ok) {
        alert('Stripe product and price created successfully!');
        localStorage.setItem('admin_key', adminKey);
        await loadProducts();
        if (selectedProduct) {
          await loadPrices(selectedProduct.id);
        }
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setCreating(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  }

  function hasStripeProduct() {
    return selectedProduct?.metadata?.stripe_product_id;
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stripe SKU Manager</h1>
            <p className="text-gray-600 mt-1">Create Stripe products and prices for marketplace items</p>
          </div>
          <button
            onClick={() => {
              loadProducts();
              if (selectedProduct) loadPrices(selectedProduct.id);
            }}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Key
          </label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Required for creating Stripe products and prices
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product
          </label>
          <select
            value={selectedProduct?.id || ''}
            onChange={(e) => {
              const product = products.find(p => p.id === e.target.value);
              setSelectedProduct(product || null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          {selectedProduct && (
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Slug:</span>
                <span className="text-gray-600">{selectedProduct.slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Kind:</span>
                <span className="text-gray-600">{selectedProduct.metadata?.kind || 'standard'}</span>
              </div>
              {selectedProduct.metadata?.stripe_product_id && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Stripe Product ID:</span>
                  <span className="text-gray-600 font-mono text-xs">{selectedProduct.metadata.stripe_product_id}</span>
                  <button
                    onClick={() => copyToClipboard(selectedProduct.metadata.stripe_product_id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
              {!selectedProduct.metadata?.stripe_product_id && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>No Stripe product ID yet - will be created with first price</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Prices</h2>

          {prices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No prices found for this product
            </div>
          ) : (
            <div className="space-y-3">
              {prices.map((price) => (
                <div
                  key={price.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusPill(price)}
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                          {price.pricing === 'one_time' ? 'One-Time' : `${price.interval}`}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(price.amount_cents, price.currency)}
                        </span>
                      </div>
                      {price.stripe_price_id && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Stripe Price ID:</span>
                          <span className="text-gray-700 font-mono text-xs">{price.stripe_price_id}</span>
                          <button
                            onClick={() => copyToClipboard(price.stripe_price_id!)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      {!price.stripe_price_id && (
                        <button
                          onClick={() => createProductAndPrice(price.id)}
                          disabled={creating}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusCircle className="w-4 h-4" />
                          {hasStripeProduct() ? 'Create Price' : 'Create Product + Price'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
