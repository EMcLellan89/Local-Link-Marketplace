import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  metadata: any;
  prices: Price[];
}

interface Price {
  id: string;
  pricing: string;
  interval: string | null;
  amount_cents: number;
  currency: string;
  is_active: boolean;
}

interface Enrollment {
  course_id: string;
  status: string;
}

export default function AcademyMarketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coreProduct, setCoreProduct] = useState<Product | null>(null);
  const [trackProducts, setTrackProducts] = useState<Product[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);

    const { data: products } = await supabase
      .from('marketplace_products')
      .select('*, prices:marketplace_product_prices(*)')
      .eq('is_active', true)
      .in('metadata->>kind', ['academy_core', 'academy_track']);

    if (products) {
      const core = products.find(p => p.metadata?.kind === 'academy_core');
      const tracks = products.filter(p => p.metadata?.kind === 'academy_track');

      if (core) setCoreProduct(core);
      setTrackProducts(tracks);
    }

    if (user) {
      const { data: enrollData } = await supabase
        .from('course_enrollments')
        .select('course_id, status')
        .eq('user_id', user.id);

      if (enrollData) setEnrollments(enrollData);
    }

    setLoading(false);
  }

  async function handlePurchase(product: Product, priceId: string) {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('academy-tracks-purchase', {
        body: {
          user_id: user.id,
          track_slug: product.slug,
        }
      });

      if (error) throw error;

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  }

  function isEnrolled(product: Product): boolean {
    if (!product.metadata?.course_slug) return false;

    return enrollments.some(e => {
      return e.status === 'active';
    });
  }

  function formatPrice(cents: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  }

  function getPrimaryPrice(product: Product): Price | null {
    if (!product.prices || product.prices.length === 0) return null;
    return product.prices.find(p => p.is_active) || product.prices[0];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading academy products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Revenue Academy</h1>
          </div>
          <p className="text-xl text-blue-100">
            Build Revenue. Then Scale. Step-by-step training built into Local-Link.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {coreProduct && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Academy</h2>
            <CoreProductCard
              product={coreProduct}
              isEnrolled={isEnrolled(coreProduct)}
              onPurchase={handlePurchase}
              formatPrice={formatPrice}
              getPrimaryPrice={getPrimaryPrice}
            />
          </div>
        )}

        {trackProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Industry Tracks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trackProducts.map((product) => (
                <TrackProductCard
                  key={product.id}
                  product={product}
                  isEnrolled={isEnrolled(product)}
                  onPurchase={handlePurchase}
                  formatPrice={formatPrice}
                  getPrimaryPrice={getPrimaryPrice}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isEnrolled: boolean;
  onPurchase: (product: Product, priceId: string) => void;
  formatPrice: (cents: number, currency: string) => string;
  getPrimaryPrice: (product: Product) => Price | null;
}

function CoreProductCard({ product, isEnrolled, onPurchase, formatPrice, getPrimaryPrice }: ProductCardProps) {
  const navigate = useNavigate();
  const primaryPrice = getPrimaryPrice(product);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-500">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
          {product.description && (
            <p className="text-gray-600">{product.description}</p>
          )}
        </div>
        {isEnrolled && (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Enrolled
          </span>
        )}
      </div>

      <div className="mb-6">
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Offer Builder System
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Checkout Optimization
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Campaign Playbooks
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Templates & Assets
          </li>
        </ul>
      </div>

      {primaryPrice && (
        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-900">
            {formatPrice(primaryPrice.amount_cents, primaryPrice.currency)}
            {primaryPrice.pricing === 'recurring' && (
              <span className="text-lg text-gray-600">/{primaryPrice.interval}</span>
            )}
          </div>
        </div>
      )}

      {isEnrolled ? (
        <button
          onClick={() => navigate(`/academy/courses/${product.metadata?.course_slug}`)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          <Play className="w-5 h-5" />
          Continue Learning
        </button>
      ) : (
        <button
          onClick={() => primaryPrice && onPurchase(product, primaryPrice.id)}
          disabled={!primaryPrice}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Academy
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function TrackProductCard({ product, isEnrolled, onPurchase, formatPrice, getPrimaryPrice }: ProductCardProps) {
  const navigate = useNavigate();
  const primaryPrice = getPrimaryPrice(product);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
        {isEnrolled && (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Enrolled
          </span>
        )}
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
      )}

      {primaryPrice && (
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(primaryPrice.amount_cents, primaryPrice.currency)}
            {primaryPrice.pricing === 'recurring' && (
              <span className="text-sm text-gray-600">/{primaryPrice.interval}</span>
            )}
          </div>
        </div>
      )}

      {isEnrolled ? (
        <button
          onClick={() => navigate(`/academy/courses/${product.metadata?.course_slug}`)}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm"
        >
          <Play className="w-4 h-4" />
          Continue
        </button>
      ) : (
        <button
          onClick={() => primaryPrice && onPurchase(product, primaryPrice.id)}
          disabled={!primaryPrice}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Purchase Track
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
