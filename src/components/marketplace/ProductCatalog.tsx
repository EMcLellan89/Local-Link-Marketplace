import { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Product {
  id: string;
  sku: string;
  name: string;
  type: string;
  price_cents: number;
  commission_rate_bp: number;
  currency: string;
  active: boolean;
}

interface ProductCatalogProps {
  entityType: 'merchant' | 'partner' | 'admin';
  entityId?: string;
  onOrderProduct?: (productId: string) => void;
  showPricing?: boolean;
}

export default function ProductCatalog({ entityType, entityId, onOrderProduct, showPricing = true }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadProducts();
  }, [entityType]);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('marketplace_affiliate_products')
        .select('id, sku, name, type, price_cents, commission_rate_bp, currency, active')
        .eq('active', true)
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      if (data) setProducts(data as Product[]);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.type)))];
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.type === selectedCategory);

  const getCommissionInfo = (product: Product) => {
    const baseRate = product.commission_rate_bp / 100;
    if (baseRate === 0) return 'No Commission';
    if (product.sku.includes('repeat_business') || product.sku.includes('merchant_services_setup')) {
      return 'Fixed $75';
    }
    if (product.sku.includes('business_capital')) {
      return 'Fixed $100';
    }
    const isRecurring = product.name.includes('/mo');
    return `${baseRate}% ${isRecurring ? 'monthly recurring' : 'one-time'}`;
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      'courses': 'GraduationCap',
      'ai-bots': 'Sparkles',
      'crm': 'Users',
      'marketing': 'Megaphone',
      'printing': 'Printer',
      'services': 'Briefcase'
    };
    return iconMap[category] || 'Package';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading product catalog...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Complete Product Catalog</h2>
          <p className="text-gray-600 mt-1">
            {entityType === 'partner'
              ? 'All products available for recording sales and ordering'
              : 'All Local-Link products and services'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {category === 'all' ? 'All Products' : category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              {showPricing && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(product.price_cents)}
                  </div>
                  {product.recurring && (
                    <div className="text-xs text-gray-500">/{product.billing_period}</div>
                  )}
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {product.type}
                </span>
                {product.name.includes('/mo') && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    Recurring
                  </span>
                )}
                {entityType === 'partner' && (
                  <span className="px-2 py-1 bg-[#2BB673]/10 text-[#2BB673] rounded-full font-medium">
                    {getCommissionInfo(product)}
                  </span>
                )}
              </div>
            </div>

            {entityType === 'partner' && product.commission_rate_bp > 0 && (
              <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                <div className="font-semibold">Partner Commission:</div>
                <div className="mt-1">Base {(product.commission_rate_bp / 100).toFixed(0)}% • Master +15% • Enterprise +25%</div>
                {product.name.includes('/mo') && <div className="mt-1 text-blue-700 font-medium">💰 Recurring monthly income!</div>}
              </div>
            )}

            <div className="flex gap-2">
              {onOrderProduct && (
                <button
                  onClick={() => onOrderProduct(product.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Order
                </button>
              )}
              {entityType === 'admin' && (
                <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No products found in this category</p>
        </div>
      )}
    </div>
  );
}
