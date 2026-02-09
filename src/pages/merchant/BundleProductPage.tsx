import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  CheckCircle2, X, Sparkles, Zap, ArrowRight,
  TrendingUp, Target, Users, Award
} from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

interface BundleProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_value_prop: string;
  long_description: string;
  outcomes: string[];
  includes: string[];
  setup_price_cents: number;
  monthly_price_cents: number;
  metadata: {
    bundle_items?: string[];
    popular?: boolean;
    best_value?: boolean;
    featured?: boolean;
  };
}

const INDUSTRY_VARIATIONS: Record<string, {
  headline: string;
  subhead: string;
  hooks: string[];
}> = {
  cleaning: {
    headline: "Stay visible without being on camera — even when you're booked solid",
    subhead: "Your cleaning business doesn't need influencers. It needs consistency. We build your content system so you don't have to.",
    hooks: [
      "Show up even when you're busy",
      "Stay top-of-mind locally",
      "No filming. No guessing."
    ]
  },
  trades: {
    headline: "The best contractors stay visible — not loud",
    subhead: "We build a faceless content system so your business stays in front of customers without social media becoming another job.",
    hooks: [
      "Focus on the work, not Instagram",
      "Stay top-of-mind without the chaos",
      "Consistent visibility = more calls"
    ]
  },
  medspa: {
    headline: "Consistent visibility without content burnout",
    subhead: "Faceless Growth Engine™ keeps your brand visible without requiring daily filming or staff time.",
    hooks: [
      "Professional content monthly",
      "Zero filming required",
      "No staff time wasted"
    ]
  },
  restaurant: {
    headline: "Focus on the kitchen — not Instagram",
    subhead: "We build your monthly content system so your restaurant stays visible without chasing trends.",
    hooks: [
      "Stay visible consistently",
      "No trend-chasing required",
      "Built for local businesses"
    ]
  },
  default: {
    headline: "Consistent content without showing your face",
    subhead: "Done-for-you faceless content + conversion system that works 24/7 for your business.",
    hooks: [
      "Post consistently",
      "No camera required",
      "Professional content system"
    ]
  }
};

export default function BundleProductPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const industry = searchParams.get('industry') || 'default';

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<BundleProduct | null>(null);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    try {
      const { data, error } = await supabase
        .from('dfy_products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (data) setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(cents: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(cents / 100);
  }

  function handleCheckout() {
    if (!product) return;
    navigate(`/merchant/dfy-checkout/${product.slug}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Button onClick={() => navigate('/merchant/done-for-you')}>
            Back to DFY Hub
          </Button>
        </div>
      </div>
    );
  }

  const variation = INDUSTRY_VARIATIONS[industry] || INDUSTRY_VARIATIONS.default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />

        {/* Hero Section */}
        <div className="mt-8 mb-12 text-center">
          {product.metadata.best_value && (
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full">
                ⭐ BEST VALUE
              </span>
            </div>
          )}
          {product.metadata.popular && !product.metadata.best_value && (
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full">
                🔥 MOST POPULAR
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {variation.headline}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {variation.subhead}
          </p>

          {/* Hooks */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {variation.hooks.map((hook, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium">{hook}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <Card className="max-w-md mx-auto p-8 bg-white shadow-xl">
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">One-time setup</div>
              <div className="text-5xl font-bold text-gray-900 mb-1">
                {formatPrice(product.setup_price_cents)}
              </div>
              <div className="text-gray-600">
                + {formatPrice(product.monthly_price_cents)}/month after
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-4"
            >
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Cancel anytime. No long-term contracts.
            </div>
          </Card>
        </div>

        {/* Comparison Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            DIY Posting vs {product.name}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* DIY Column */}
            <Card className="p-6 bg-white border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <X className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">DIY Posting</h3>
              </div>

              <div className="space-y-3">
                {[
                  "Guess what to post",
                  "Inconsistent schedule",
                  "No funnel behind content",
                  "Stops after a few weeks",
                  "Time-consuming",
                  "No system"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <div className="text-sm text-gray-600 font-medium">Relies on motivation</div>
              </div>
            </Card>

            {/* DFY Column */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
              </div>

              <div className="space-y-3">
                {[
                  "Content built for you",
                  "Monthly consistency",
                  "Funnel included",
                  "Optimized hooks + CTAs",
                  "Zero camera required",
                  "System keeps running"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-green-200 text-center">
                <div className="text-sm text-green-900 font-bold">Relies on structure</div>
              </div>
            </Card>
          </div>
        </div>

        {/* What's Included */}
        <Card className="p-8 mb-12 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.includes.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Outcomes */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You'll Achieve</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {product.outcomes.map((outcome, index) => {
              const icons = [TrendingUp, Target, Users];
              const Icon = icons[index % icons.length];

              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-semibold text-gray-900">{outcome}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* How It Works */}
        <Card className="p-8 mb-12 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Complete Intake", description: "Tell us about your business and preferences" },
              { step: 2, title: "We Build", description: "Our team creates your custom content system" },
              { step: 3, title: "You Review", description: "Approve your content before launch" },
              { step: 4, title: "We Launch", description: "System goes live and runs monthly" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-3 text-white font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Final CTA */}
        <Card className="p-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <Award className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-300 mb-8">
              Most setups go live in 3-5 business days. Get consistent, professional content
              without the camera or the chaos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-center sm:text-right">
                <div className="text-sm text-gray-400 mb-1">Starting at</div>
                <div className="text-4xl font-bold">{formatPrice(product.setup_price_cents)}</div>
                <div className="text-sm text-gray-400">+ {formatPrice(product.monthly_price_cents)}/mo</div>
              </div>

              <Button
                onClick={handleCheckout}
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
