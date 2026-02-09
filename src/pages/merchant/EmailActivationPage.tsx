import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, Loader, Check } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface MerchantData {
  id: string;
  business_name: string;
  business_email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  website_url: string;
}

export default function EmailActivationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const [error, setError] = useState('');
  const [existingConfig, setExistingConfig] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    website: '',
    billingAddress: '',
    selectedTier: 'essentials' as 'essentials' | 'pro',
  });

  useEffect(() => {
    loadMerchantData();
  }, [user]);

  async function loadMerchantData() {
    if (!user) return;

    try {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (merchantData) {
        setMerchant(merchantData);

        // Check for existing email configuration
        const { data: configData } = await supabase
          .from('twilio_configurations')
          .select('*')
          .eq('merchant_id', merchantData.id)
          .maybeSingle();

        if (configData) {
          setExistingConfig(configData);
        }

        // Auto-fill from merchant data
        const fullAddress = [
          merchantData.address_line1,
          merchantData.address_line2,
          merchantData.city,
          merchantData.state,
          merchantData.zip
        ].filter(Boolean).join(', ');

        setFormData({
          name: merchantData.business_name || '',
          address: fullAddress || '',
          website: merchantData.website_url || '',
          billingAddress: fullAddress || '',
          selectedTier: 'essentials',
        });
      }
    } catch (err) {
      console.error('Error loading merchant data:', err);
      setError('Failed to load your business information');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!merchant) return;

    if (!formData.name || !formData.address || !formData.website) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const tierPrices = {
        essentials: 1995, // $19.95 in cents
        pro: 8995, // $89.95 in cents
      };

      const tierLimits = {
        essentials: 100000,
        pro: 2500000,
      };

      // Update or create email configuration
      const emailConfigData = {
        merchant_id: merchant.id,
        email_enabled: true,
        email_from_name: formData.name,
        email_from_address: merchant.business_email,
        is_active: true,
      };

      const { error: configError } = await supabase
        .from('twilio_configurations')
        .upsert(emailConfigData, { onConflict: 'merchant_id' });

      if (configError) throw configError;

      // Create email subscription record
      const subscriptionData = {
        merchant_id: merchant.id,
        tier: formData.selectedTier,
        monthly_price_cents: tierPrices[formData.selectedTier],
        monthly_email_limit: tierLimits[formData.selectedTier],
        emails_sent_this_month: 0,
        status: 'active',
        billing_name: formData.name,
        billing_address: formData.billingAddress,
        website: formData.website,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const { error: subscriptionError } = await supabase
        .from('email_subscriptions')
        .upsert(subscriptionData, { onConflict: 'merchant_id' });

      if (subscriptionError) throw subscriptionError;

      navigate('/merchant/crm?email_activated=true');
    } catch (err: any) {
      console.error('Error activating email services:', err);
      setError(err.message || 'Failed to activate email services');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="merchant">
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="merchant">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Activate Email Marketing</h3>
              <p className="text-sm text-blue-700">
                Send professional email campaigns directly from your CRM. Choose the plan that fits your needs.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Select Your Email Plan</h2>
            <p className="text-sm text-gray-600 mt-1">Choose the plan that matches your email volume</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => handleChange('selectedTier', 'essentials')}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    formData.selectedTier === 'essentials'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Essentials</h3>
                      <p className="text-sm text-gray-600 mt-1">Perfect for small businesses</p>
                    </div>
                    {formData.selectedTier === 'essentials' && (
                      <div className="bg-blue-600 p-1 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      $19.95
                      <span className="text-base font-normal text-gray-600">/mo</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Send 50,000 - 100,000 emails/month</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Email campaign builder</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Contact management</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Basic analytics</span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handleChange('selectedTier', 'pro')}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    formData.selectedTier === 'pro'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                      <p className="text-sm text-gray-600 mt-1">For growing businesses</p>
                    </div>
                    {formData.selectedTier === 'pro' && (
                      <div className="bg-blue-600 p-1 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      $89.95
                      <span className="text-base font-normal text-gray-600">/mo</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Send 100,000 - 2,500,000 emails/month</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Advanced email builder</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Unlimited contacts</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Advanced analytics & reporting</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>A/B testing</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Business Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Main St, City, State, ZIP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Billing</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice/Sold To Address
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress}
                    onChange={(e) => handleChange('billingAddress', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Billing address (if different from business address)"
                  />
                  {!formData.billingAddress && (
                    <p className="text-xs text-gray-500 mt-1">No invoice address on file</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Payment Method</p>
                    <p className="text-sm text-gray-600">No payment method on file</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Monthly Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${formData.selectedTier === 'essentials' ? '19.95' : '89.95'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/merchant/crm')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Activating Email Services...
                    </span>
                  ) : (
                    `Activate ${formData.selectedTier === 'essentials' ? 'Essentials' : 'Pro'} Plan`
                  )}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
