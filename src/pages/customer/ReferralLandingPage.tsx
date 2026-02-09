import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Gift, Copy, Check, Sparkles, TrendingUp, Users, ArrowRight } from 'lucide-react';

interface ReferralProgram {
  id: string;
  merchant_id: string;
  is_enabled: boolean;
  program_name: string;
  reward_type: string;
  reward_value_cents: number;
  referee_incentive_type: string;
  referee_incentive_value_cents: number;
  qualifying_event: string;
  min_spend_cents: number;
  merchant?: {
    business_name: string;
  };
}

interface ReferralLink {
  id: string;
  share_code: string;
}

export default function ReferralLandingPage() {
  const { landingSlug } = useParams<{ landingSlug: string }>();
  const [searchParams] = useSearchParams();
  const referrerCode = searchParams.get('ref');

  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<ReferralProgram | null>(null);
  const [step, setStep] = useState<'intro' | 'form' | 'success'>('intro');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: ''
  });
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (landingSlug) {
      loadProgram();
    }
  }, [landingSlug]);

  async function loadProgram() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_referral_programs')
        .select(`
          *,
          merchant:profiles!customer_referral_programs_merchant_id_fkey(
            business_name
          )
        `)
        .eq('landing_slug', landingSlug)
        .eq('is_enabled', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError('This referral program is no longer active.');
      } else {
        setProgram(data);
      }
    } catch (error) {
      console.error('Error loading program:', error);
      setError('Failed to load referral program.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!program) return;

    setSubmitting(true);
    setError('');

    try {
      const { data: existingCustomer, error: lookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (lookupError) throw lookupError;

      let customerId: string;

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: Math.random().toString(36).slice(-12),
          options: {
            data: {
              full_name: formData.full_name,
              role: 'customer'
            }
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create customer account');

        customerId = authData.user.id;
      }

      const shareCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { data: linkData, error: linkError } = await supabase
        .from('customer_referral_links')
        .insert({
          merchant_id: program.merchant_id,
          customer_id: customerId,
          share_code: shareCode
        })
        .select()
        .single();

      if (linkError) {
        if (linkError.code === '23505') {
          const { data: existingLink } = await supabase
            .from('customer_referral_links')
            .select('share_code')
            .eq('merchant_id', program.merchant_id)
            .eq('customer_id', customerId)
            .single();

          if (existingLink) {
            const url = `${window.location.origin}/r/${landingSlug}?ref=${existingLink.share_code}`;
            setGeneratedLink(url);
            setStep('success');
            return;
          }
        }
        throw linkError;
      }

      if (referrerCode) {
        const { data: referrerLink } = await supabase
          .from('customer_referral_links')
          .select('id, customer_id')
          .eq('share_code', referrerCode)
          .eq('merchant_id', program.merchant_id)
          .maybeSingle();

        if (referrerLink && referrerLink.customer_id !== customerId) {
          await supabase
            .from('customer_referrals')
            .insert({
              merchant_id: program.merchant_id,
              referral_link_id: referrerLink.id,
              referee_email: formData.email,
              referee_name: formData.full_name,
              status: 'lead'
            });
        }
      }

      const url = `${window.location.origin}/r/${landingSlug}?ref=${linkData.share_code}`;
      setGeneratedLink(url);
      setStep('success');

    } catch (error: any) {
      console.error('Error submitting:', error);
      setError(error.message || 'Failed to generate your referral link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function formatCurrency(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function getIncentiveLabel(type: string): string {
    const labels: Record<string, string> = {
      credit: 'Account Credit',
      coupon: 'Discount Coupon',
      cash: 'Cash Reward',
      gift_card: 'Gift Card'
    };
    return labels[type] || type;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h2>
          <p className="text-gray-600">{error || 'This referral program is no longer active.'}</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              You're All Set!
            </h2>
            <p className="text-lg text-gray-600">
              Share your link and start earning rewards
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Personal Referral Link
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={generatedLink}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white font-mono text-sm"
              />
              <button
                onClick={copyLink}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">How It Works:</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  1
                </div>
                <div>
                  <div className="font-medium text-gray-900">Share Your Link</div>
                  <div className="text-sm text-gray-600">
                    Send it to friends, family, or social media
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  2
                </div>
                <div>
                  <div className="font-medium text-gray-900">They Sign Up</div>
                  <div className="text-sm text-gray-600">
                    New customers use your link and get {formatCurrency(program.referee_incentive_value_cents)} {getIncentiveLabel(program.referee_incentive_type)}
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                  3
                </div>
                <div>
                  <div className="font-medium text-gray-900">You Get Rewarded</div>
                  <div className="text-sm text-gray-600">
                    Receive {formatCurrency(program.reward_value_cents)} {getIncentiveLabel(program.reward_type)} for each qualified referral
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Your Referral Link
            </h2>
            <p className="text-gray-600">
              Start earning {formatCurrency(program.reward_value_cents)} for every friend you refer
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Generating Link...' : 'Get My Referral Link'}
            </button>
          </form>

          <button
            onClick={() => setStep('intro')}
            className="mt-4 text-sm text-gray-600 hover:text-gray-900 w-full text-center"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl font-bold mb-3">{program.program_name}</h1>
            <p className="text-xl text-blue-100 mb-6">
              Earn {formatCurrency(program.reward_value_cents)} for Every Friend You Refer
            </p>
            <div className="text-lg text-blue-100">
              Powered by {program.merchant?.business_name || 'Local Business'}
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(program.reward_value_cents)}
                </div>
                <div className="text-sm text-gray-600">You Earn Per Referral</div>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Gift className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(program.referee_incentive_value_cents)}
                </div>
                <div className="text-sm text-gray-600">Your Friends Get</div>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">Unlimited</div>
                <div className="text-sm text-gray-600">Earning Potential</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Get Your Unique Link</div>
                    <div className="text-gray-600">
                      Sign up in seconds and receive your personal referral link
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Share With Friends</div>
                    <div className="text-gray-600">
                      Send your link via text, email, or social media
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Earn Rewards</div>
                    <div className="text-gray-600">
                      Get {formatCurrency(program.reward_value_cents)} {getIncentiveLabel(program.reward_type)} when they make a qualifying purchase
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('form')}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg"
              >
                Start Earning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Free to join • No commitment required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
