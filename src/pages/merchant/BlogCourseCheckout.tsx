import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Lock, CreditCard, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const TIER_INFO = {
  core: {
    id: 'core',
    name: 'Self-Implement',
    price: 997,
    features: [
      'Full 8-Module Blog Growth System',
      'Step-by-step blog writing training',
      'AI prompt frameworks',
      'Distribution & ROI tracking',
      'Lifetime access to updates',
      'Merchant Blog Certification',
    ],
  },
  accelerator: {
    id: 'accelerator',
    name: 'Implementation Accelerator',
    price: 1997,
    features: [
      'Everything in Self-Implement',
      'Blog topic plan (12 months)',
      'Writing templates + checklists',
      'Partner hiring guidance',
      'Priority job posting in Local-Link',
      'Verified Merchant badge',
      'Direct implementation support',
    ],
  },
  dfy: {
    id: 'dfy',
    name: 'Done-For-You Path',
    price: 2997,
    features: [
      'Everything in Accelerator',
      'Blog strategy & complete setup',
      'DFY blog execution via vetted partners',
      'Monthly performance reporting',
      'Content management oversight',
      'Dedicated account manager',
    ],
  },
};

export default function BlogCourseCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();

  const tierId = (searchParams.get('tier') || 'core') as keyof typeof TIER_INFO;
  const tier = TIER_INFO[tierId];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: profile?.email || '',
    fullName: profile?.full_name || '',
    businessName: '',
    phone: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('You must be logged in to purchase');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/course-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userId: user.id,
          courseId: 'blog-growth-system',
          tier: tierId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const { checkoutUrl } = await response.json();

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        navigate('/merchant/courses/blog-growth-system/success?tier=' + tierId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">Complete Your Purchase</h1>
          <p className="text-lg text-slate-600">You're one step away from mastering blog growth</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Billing Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="john@business.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                    placeholder="Smith Plumbing LLC"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Lock className="h-4 w-4" />
                    Secure Checkout
                  </div>
                  <p className="text-sm text-slate-600">
                    Your payment information is processed securely through Stripe. We never store your card details.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-6 text-lg font-semibold hover:from-cyan-600 hover:to-blue-600"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Continue to Payment
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-slate-500">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6 p-6">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Order Summary</h3>

              <div className="mb-6 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
                <div className="mb-1 text-sm font-semibold text-cyan-900">Selected Package</div>
                <div className="text-2xl font-bold text-slate-900">{tier.name}</div>
              </div>

              <div className="mb-6 space-y-3">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-slate-600">Course Price</span>
                  <span className="text-2xl font-bold text-slate-900">${tier.price.toLocaleString()}</span>
                </div>
                <div className="mb-4 flex items-baseline justify-between text-sm">
                  <span className="text-slate-500">Tax</span>
                  <span className="text-slate-600">Calculated at checkout</span>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-900">
                  <Check className="h-4 w-4" />
                  30-Day Money-Back Guarantee
                </div>
                <p className="text-sm text-green-800">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-600">
            Questions about the course?{' '}
            <button
              onClick={() => navigate('/support')}
              className="font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Contact our team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
