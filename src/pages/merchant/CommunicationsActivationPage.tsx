import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, AlertCircle, Loader, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface MerchantData {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  website_url: string;
  tax_id: string;
  owner_first_name: string;
  owner_last_name: string;
  business_type: string;
}

export default function CommunicationsActivationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const [error, setError] = useState('');
  const [existingConfig, setExistingConfig] = useState<any>(null);
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  const [formData, setFormData] = useState({
    legalBusinessName: '',
    dbaName: '',
    taxId: '',
    businessType: 'llc',
    websiteUrl: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    smsUseCase: 'two_way_conversational',
    useCaseDescription: '',
    sampleMessage: '',
    optInMethod: 'website_form',
    optInUrl: '',
    privacyPolicyUrl: '',
    termsUrl: '',
    monthlySmsVolume: '10000',
    prepayAmount: 50,
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

        // Check for existing configuration
        const { data: configData } = await supabase
          .from('twilio_configurations')
          .select('*')
          .eq('merchant_id', merchantData.id)
          .maybeSingle();

        if (configData) {
          setExistingConfig(configData);
          setIsAddingFunds(true);

          // Pre-fill from existing config
          setFormData(prev => ({
            ...prev,
            legalBusinessName: configData.legal_business_name || merchantData.business_name || '',
            dbaName: configData.dba_name || merchantData.business_name || '',
            taxId: configData.tax_id || merchantData.tax_id || '',
            businessType: configData.business_type || merchantData.business_type || 'llc',
            websiteUrl: configData.website_url || merchantData.website_url || '',
            addressLine1: configData.address_line1 || merchantData.address_line1 || '',
            addressLine2: configData.address_line2 || merchantData.address_line2 || '',
            city: configData.city || merchantData.city || '',
            state: configData.state || merchantData.state || '',
            zipCode: configData.zip_code || merchantData.zip || '',
            firstName: configData.contact_first_name || merchantData.owner_first_name || '',
            lastName: configData.contact_last_name || merchantData.owner_last_name || '',
            email: configData.contact_email || merchantData.business_email || user.email || '',
            phoneNumber: configData.contact_phone || merchantData.business_phone || '',
            smsUseCase: configData.sms_use_case || 'two_way_conversational',
            useCaseDescription: configData.use_case_description || '',
            sampleMessage: configData.sample_message || '',
            optInMethod: configData.opt_in_method || 'website_form',
            optInUrl: configData.opt_in_url || merchantData.website_url || '',
            privacyPolicyUrl: configData.privacy_policy_url || (merchantData.website_url ? `${merchantData.website_url}/privacy` : ''),
            termsUrl: configData.terms_url || (merchantData.website_url ? `${merchantData.website_url}/terms` : ''),
            monthlySmsVolume: configData.monthly_sms_volume?.toString() || '10000',
          }));
        } else {
          // First time setup - pre-fill from merchant data
          setFormData(prev => ({
            ...prev,
            legalBusinessName: merchantData.business_name || '',
            dbaName: merchantData.business_name || '',
            taxId: merchantData.tax_id || '',
            businessType: merchantData.business_type || 'llc',
            websiteUrl: merchantData.website_url || '',
            addressLine1: merchantData.address_line1 || '',
            addressLine2: merchantData.address_line2 || '',
            city: merchantData.city || '',
            state: merchantData.state || '',
            zipCode: merchantData.zip || '',
            firstName: merchantData.owner_first_name || '',
            lastName: merchantData.owner_last_name || '',
            email: merchantData.business_email || user.email || '',
            phoneNumber: merchantData.business_phone || '',
            privacyPolicyUrl: merchantData.website_url ? `${merchantData.website_url}/privacy` : '',
            termsUrl: merchantData.website_url ? `${merchantData.website_url}/terms` : '',
            optInUrl: merchantData.website_url || '',
          }));
        }
      }
    } catch (err) {
      console.error('Error loading merchant data:', err);
      setError('Failed to load your business information');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: string, value: string | number) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!merchant) return;

    if (formData.prepayAmount < 50) {
      setError('Minimum prepay amount is $50');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (isAddingFunds && existingConfig) {
        // Just add funds to existing configuration
        const newBalance = (existingConfig.prepaid_balance_cents || 0) + (formData.prepayAmount * 100);

        const { error: updateError } = await supabase
          .from('twilio_configurations')
          .update({
            prepaid_balance_cents: newBalance,
            updated_at: new Date().toISOString(),
          })
          .eq('merchant_id', merchant.id);

        if (updateError) throw updateError;

        const { error: transactionError } = await supabase
          .from('communications_transactions')
          .insert({
            merchant_id: merchant.id,
            transaction_type: 'prepay',
            amount_cents: formData.prepayAmount * 100,
            description: `Account top-up - $${formData.prepayAmount}`,
            balance_after_cents: newBalance,
          });

        if (transactionError) throw transactionError;

        navigate('/merchant/communications?activated=true');
      } else {
        // Create new configuration
        const configData = {
          merchant_id: merchant.id,
          legal_business_name: formData.legalBusinessName,
          dba_name: formData.dbaName,
          tax_id: formData.taxId,
          business_type: formData.businessType,
          website_url: formData.websiteUrl,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country,
          contact_first_name: formData.firstName,
          contact_last_name: formData.lastName,
          contact_email: formData.email,
          contact_phone: formData.phoneNumber,
          sms_use_case: formData.smsUseCase,
          use_case_description: formData.useCaseDescription,
          sample_message: formData.sampleMessage,
          opt_in_method: formData.optInMethod,
          opt_in_url: formData.optInUrl,
          privacy_policy_url: formData.privacyPolicyUrl,
          terms_url: formData.termsUrl,
          monthly_sms_volume: parseInt(formData.monthlySmsVolume),
          prepaid_balance_cents: formData.prepayAmount * 100,
          is_active: true,
          verified: true,
        };

        const { error: configError } = await supabase
          .from('twilio_configurations')
          .upsert(configData, { onConflict: 'merchant_id' });

        if (configError) throw configError;

        const { error: transactionError } = await supabase
          .from('communications_transactions')
          .insert({
            merchant_id: merchant.id,
            transaction_type: 'prepay',
            amount_cents: formData.prepayAmount * 100,
            description: `Initial prepayment - $${formData.prepayAmount}`,
            balance_after_cents: formData.prepayAmount * 100,
          });

        if (transactionError) throw transactionError;

        navigate('/merchant/communications?activated=true');
      }
    } catch (err: any) {
      console.error('Error activating communications:', err);
      setError(err.message || 'Failed to activate communications services');
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
            <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Activate VoIP & Voice Services</h3>
              <p className="text-sm text-blue-700">
                Business verification is required before you can send SMS messages. Fill out this profile once,
                and we'll automatically submit verification on your behalf.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">
              {isAddingFunds ? 'Add Funds to Communications Account' : 'Business Profile'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isAddingFunds
                ? 'Top up your prepaid balance to continue using VoIP and messaging services'
                : 'Required for SMS & Voice activation'}
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {!isAddingFunds && (
                <>
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                      Business Information
                    </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Legal Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.legalBusinessName}
                      onChange={(e) => handleChange('legalBusinessName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Acme Corporation LLC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DBA / Trading Name
                    </label>
                    <input
                      type="text"
                      value={formData.dbaName}
                      onChange={(e) => handleChange('dbaName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Acme Solutions (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax ID / EIN
                    </label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => handleChange('taxId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12-3456789 (optional but recommended)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.businessType}
                      onChange={(e) => handleChange('businessType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="llc">LLC</option>
                      <option value="corporation">Corporation</option>
                      <option value="partnership">Partnership</option>
                      <option value="sole_proprietorship">Sole Proprietorship</option>
                      <option value="non_profit">Non-Profit</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.websiteUrl}
                      onChange={(e) => handleChange('websiteUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                  Business Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.addressLine1}
                      onChange={(e) => handleChange('addressLine1', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => handleChange('addressLine2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Suite 100 (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="San Francisco"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="94102"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                  Primary Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                  SMS Use Case (Optional)
                </h3>
                <p className="text-sm text-gray-600">You can fill this out now or later when requesting SMS activation</p>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Use Case Type
                    </label>
                    <select
                      value={formData.smsUseCase}
                      onChange={(e) => handleChange('smsUseCase', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="two_way_conversational">Mixed / General</option>
                      <option value="marketing">Marketing</option>
                      <option value="notifications">Notifications</option>
                      <option value="appointment_reminders">Appointment Reminders</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Use Case Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.useCaseDescription}
                      onChange={(e) => handleChange('useCaseDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe how you'll use SMS (e.g., appointment reminders, order notifications, customer support)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sample Message
                    </label>
                    <textarea
                      rows={2}
                      value={formData.sampleMessage}
                      onChange={(e) => handleChange('sampleMessage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Example: 'Hi! Your appointment is tomorrow at 2pm. Reply STOP to unsubscribe.'"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      How do customers opt in?
                    </label>
                    <select
                      value={formData.optInMethod}
                      onChange={(e) => handleChange('optInMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="website_form">Website Form</option>
                      <option value="paper_form">Paper Form</option>
                      <option value="verbal">Verbal Consent</option>
                      <option value="text_to_join">Text to Join</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opt In URL
                    </label>
                    <input
                      type="url"
                      value={formData.optInUrl}
                      onChange={(e) => handleChange('optInUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/signup"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly SMS Volume
                    </label>
                    <select
                      value={formData.monthlySmsVolume}
                      onChange={(e) => handleChange('monthlySmsVolume', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="10000">Under 10,000</option>
                      <option value="50000">10,000 - 50,000</option>
                      <option value="100000">50,000 - 100,000</option>
                      <option value="500000">100,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Privacy Policy URL
                    </label>
                    <input
                      type="url"
                      value={formData.privacyPolicyUrl}
                      onChange={(e) => handleChange('privacyPolicyUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/privacy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Terms & Conditions URL
                    </label>
                    <input
                      type="url"
                      value={formData.termsUrl}
                      onChange={(e) => handleChange('termsUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/terms"
                    />
                  </div>
                </div>
              </div>
                </>
              )}

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                    {isAddingFunds ? '1' : '5'}
                  </span>
                  {isAddingFunds ? 'Add Funds' : 'Prepay for Services'}
                </h3>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      {isAddingFunds && existingConfig && (
                        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${((existingConfig.prepaid_balance_cents || 0) / 100).toFixed(2)}
                          </p>
                        </div>
                      )}
                      <p className="text-sm text-gray-700 mb-4">
                        {isAddingFunds
                          ? 'Add funds to your account to continue using VoIP and messaging services. When your balance reaches $0, you\'ll need to add more funds to continue.'
                          : 'Add funds to your account to start making calls and sending messages. When your balance reaches $0, you\'ll need to add another $50 to continue using the service.'}
                      </p>

                      <div className="max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prepay Amount (minimum $50) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                          <input
                            type="number"
                            min="50"
                            step="10"
                            required
                            value={formData.prepayAmount}
                            onChange={(e) => handleChange('prepayAmount', parseFloat(e.target.value) || 50)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Usage Rates</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Outbound calls (US & Canada):</span>
                            <span className="font-medium">$0.03/min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Inbound calls:</span>
                            <span className="font-medium">$0.0185/min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Local phone number:</span>
                            <span className="font-medium">$2.15/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Toll-free number:</span>
                            <span className="font-medium">$3.15/month</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/merchant/communications')}
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
                      {isAddingFunds ? 'Adding Funds...' : 'Activating Communications...'}
                    </span>
                  ) : (
                    isAddingFunds
                      ? `Add $${formData.prepayAmount} to Balance`
                      : `Activate & Add $${formData.prepayAmount}`
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
