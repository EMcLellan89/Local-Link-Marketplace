import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Store, User, CheckCircle, XCircle, Users, Zap, TrendingUp, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardBody, CardHeader } from '../components/ui/Card';

const merchantTiers = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Users,
    price: 149,
    crm: 'Starter CRM',
    contacts: 500,
    accounting: 'None',
    color: 'from-slate-500 to-slate-600',
    features: [
      'Contact management & basic pipeline',
      'Email marketing',
      'Deal tracking',
      'Basic reporting',
      'Mobile app access',
      '1 postcard spot (rotating)'
    ]
  },
  {
    id: 'founders',
    name: 'Founders',
    icon: Zap,
    price: 249,
    crm: 'Professional CRM',
    contacts: 5000,
    accounting: 'Books Lite',
    color: 'from-blue-500 to-blue-700',
    badge: 'LOCKED RATE',
    features: [
      'Everything in Starter',
      'Advanced pipelines',
      'Email automation',
      'Customer segmentation',
      'Books Lite accounting',
      'Priority support'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    icon: TrendingUp,
    price: 299,
    crm: 'Business CRM',
    contacts: 25000,
    accounting: 'Books Pro',
    color: 'from-[#2BB673] to-[#25a062]',
    badge: 'MOST POPULAR',
    features: [
      'Everything in Founders',
      'SMS marketing',
      'Custom workflows',
      'A/B testing',
      'Books Pro accounting',
      'API access'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    price: 349,
    crm: 'Enterprise CRM',
    contacts: 100000,
    accounting: 'Books Pro',
    color: 'from-amber-500 to-orange-600',
    badge: 'BEST VALUE',
    features: [
      'Everything in Standard',
      'AI-powered insights',
      'Unlimited communications',
      'White-label options',
      'Dedicated account manager',
      '24/7 priority support'
    ]
  }
];

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [selectedTier, setSelectedTier] = useState('standard');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Referral state
  const [wasReferred, setWasReferred] = useState(false);
  const [referralName, setReferralName] = useState('');
  const [referralId, setReferralId] = useState('');
  const [refVerified, setRefVerified] = useState(false);
  const [refVerifyMsg, setRefVerifyMsg] = useState('');
  const [refGrantsLifetime, setRefGrantsLifetime] = useState(false);
  const [refPartnerDisplay, setRefPartnerDisplay] = useState('');
  const [verifyingRef, setVerifyingRef] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  // Auto-fill from ?ref= query param on page load
  useEffect(() => {
    const refSlug = searchParams.get('ref');
    if (refSlug) {
      setWasReferred(true);
      setAutoFilled(true);
      verifyReferralBySlug(refSlug);
    }
  }, [searchParams]);

  async function verifyReferralBySlug(refSlug: string) {
    setVerifyingRef(true);
    setRefVerifyMsg('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/referral-resolve?ref=${encodeURIComponent(refSlug)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.ok && data.verified) {
        setRefVerified(true);
        setReferralName(data.referral.referral_name || '');
        setReferralId(String(data.referral.referral_id || ''));
        setRefGrantsLifetime(data.referral.grants_lifetime_free || false);
        setRefPartnerDisplay(data.partner?.display_name || '');
        setRefVerifyMsg('');
      } else {
        setRefVerified(false);
        setRefVerifyMsg(data.error || 'Referral not verified');
      }
    } catch (err: any) {
      setRefVerified(false);
      setRefVerifyMsg(err.message || 'Failed to verify referral');
    } finally {
      setVerifyingRef(false);
    }
  }

  async function verifyReferralManual() {
    if (!referralId) {
      setRefVerifyMsg('Please enter Referral ID#');
      return;
    }

    setVerifyingRef(true);
    setRefVerifyMsg('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/referral-resolve?referral_id=${encodeURIComponent(referralId)}&referral_name=${encodeURIComponent(referralName)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.ok && data.verified) {
        setRefVerified(true);
        setReferralName(data.referral.referral_name || referralName);
        setReferralId(String(data.referral.referral_id || ''));
        setRefGrantsLifetime(data.referral.grants_lifetime_free || false);
        setRefPartnerDisplay(data.partner?.display_name || '');
        setRefVerifyMsg('');
      } else {
        setRefVerified(false);
        setRefVerifyMsg(data.error || 'Invalid referral');
      }
    } catch (err: any) {
      setRefVerified(false);
      setRefVerifyMsg(err.message || 'Failed to verify referral');
    } finally {
      setVerifyingRef(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Validate referral if provided
    if (wasReferred && !refVerified) {
      setError('Please verify referral before creating account');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, role);

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const updates: any = {};

        // Store referral info in profiles after signup (if verified)
        if (wasReferred && refVerified && referralId) {
          updates.referral_name = referralName || null;
          updates.referral_id = referralId ? Number(referralId) : null;
        }

        // Store selected tier for merchants
        if (role === 'merchant' && selectedTier) {
          updates.selected_tier = selectedTier;
        }

        // Only update if we have data to update
        if (Object.keys(updates).length > 0) {
          await supabase.from('profiles').update(updates).eq('id', user.id);
        }
      }

      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2BB673] to-[#25a062] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="/local-link_marketplace_logo.png"
              alt="Local Link Marketplace"
              className="h-28 w-auto drop-shadow-2xl"
            />
          </div>
          <p className="text-white/90 text-lg">Join the local deals revolution</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-600 mt-1">Get started in seconds</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === 'customer'
                        ? 'border-[#2BB673] bg-[#2BB673]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <User className={`w-6 h-6 mx-auto mb-2 ${role === 'customer' ? 'text-[#2BB673]' : 'text-slate-400'}`} />
                    <div className="text-sm font-medium">Customer</div>
                    <div className="text-xs text-slate-500">Browse deals</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('merchant')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === 'merchant'
                        ? 'border-[#2BB673] bg-[#2BB673]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Store className={`w-6 h-6 mx-auto mb-2 ${role === 'merchant' ? 'text-[#2BB673]' : 'text-slate-400'}`} />
                    <div className="text-sm font-medium">Merchant</div>
                    <div className="text-xs text-slate-500">Create deals</div>
                  </button>
                </div>
              </div>

              {role === 'merchant' && (
                <div className="border-t border-slate-200 pt-4">
                  <div className="mb-3">
                    <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-xs font-medium mb-2 inline-flex mx-auto">
                      <CheckCircle className="w-3 h-3" />
                      CRM Included with Every Plan
                    </div>
                    <label className="block text-sm font-medium text-slate-700 text-center">
                      Choose Your Subscription Tier
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                    {merchantTiers.map((tier) => {
                      const Icon = tier.icon;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedTier(tier.id)}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            selectedTier === tier.id
                              ? 'border-[#2BB673] bg-[#2BB673]/5'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900">{tier.name}</h4>
                                {tier.badge && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-[#2BB673]/10 text-[#2BB673] font-semibold">
                                    {tier.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-lg font-bold text-slate-900 mb-2">
                                ${tier.price}<span className="text-sm font-normal text-slate-600">/mo</span>
                              </div>

                              <div className="bg-blue-50 rounded p-2 mb-2 text-xs">
                                <div className="font-semibold text-blue-900 mb-1">CRM INCLUDED</div>
                                <div className="text-slate-700">
                                  <strong>{tier.crm}</strong> • {tier.contacts.toLocaleString()} contacts
                                </div>
                                <div className="text-slate-600">
                                  Accounting: {tier.accounting}
                                </div>
                              </div>

                              <ul className="space-y-1">
                                {tier.features.slice(0, 3).map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-1 text-xs text-slate-600">
                                    <CheckCircle className="w-3 h-3 text-[#2BB673] flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                                {tier.features.length > 3 && (
                                  <li className="text-xs text-slate-500 italic">
                                    +{tier.features.length - 3} more features
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {/* Partner Referral Section */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wasReferred}
                      onChange={(e) => {
                        setWasReferred(e.target.checked);
                        if (!e.target.checked) {
                          setReferralName('');
                          setReferralId('');
                          setRefVerified(false);
                          setRefVerifyMsg('');
                        }
                      }}
                      disabled={autoFilled}
                      className="mr-2 h-4 w-4 text-[#2BB673] focus:ring-[#2BB673] border-slate-300 rounded"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      I was referred by a Partner
                    </span>
                  </label>
                </div>

                {wasReferred && (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                    {!autoFilled ? (
                      <>
                        <Input
                          type="text"
                          label="Referral Name"
                          placeholder="e.g., John Smith"
                          value={referralName}
                          onChange={(e) => setReferralName(e.target.value)}
                        />
                        <Input
                          type="number"
                          label="Referral ID#"
                          placeholder="e.g., 3817"
                          value={referralId}
                          onChange={(e) => setReferralId(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={verifyReferralManual}
                          disabled={verifyingRef || !referralId}
                          fullWidth
                        >
                          {verifyingRef ? 'Verifying...' : 'Verify Referral'}
                        </Button>
                      </>
                    ) : (
                      <div className="text-sm text-slate-600">
                        <div><strong>Referral Name:</strong> {referralName}</div>
                        <div><strong>Referral ID#:</strong> {referralId}</div>
                      </div>
                    )}

                    {/* Verification Status */}
                    {refVerified && (
                      <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded">
                        <CheckCircle className="w-4 h-4" />
                        <span>✓ Verified{refPartnerDisplay ? ` - ${refPartnerDisplay}` : ''}</span>
                      </div>
                    )}

                    {!refVerified && refVerifyMsg && (
                      <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded">
                        <XCircle className="w-4 h-4" />
                        <span>{refVerifyMsg}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <a href="/login" className="text-[#2BB673] hover:underline font-medium">
                  Sign in
                </a>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
