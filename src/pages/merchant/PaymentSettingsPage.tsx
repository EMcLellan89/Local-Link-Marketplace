import { useState, useEffect } from 'react';
import { CreditCard, Lock, Check, AlertCircle } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function PaymentSettingsPage() {
  const { user } = useAuth();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [environment, setEnvironment] = useState<'sandbox' | 'live'>('sandbox');
  const [isActive, setIsActive] = useState(true);
  const [hasExistingConfig, setHasExistingConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMerchantAndConfig();
    }
  }, [user]);

  const fetchMerchantAndConfig = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (merchant) {
        setMerchantId(merchant.id);

        const { data: config, error: configError } = await supabase
          .from('paybright_config')
          .select('api_key, environment, is_active')
          .eq('merchant_id', merchant.id)
          .maybeSingle();

        if (configError && configError.code !== 'PGRST116') {
          throw configError;
        }

        if (config) {
          setHasExistingConfig(true);
          setApiKey(config.api_key);
          setEnvironment(config.environment as 'sandbox' | 'live');
          setIsActive(config.is_active);
        }
      }
    } catch (err) {
      console.error('Error fetching config:', err);
      setError('Failed to load payment settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!merchantId) {
      setError('Merchant not found');
      return;
    }

    if (!apiKey || !apiToken) {
      setError('API Key and API Token are required');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const configData = {
        merchant_id: merchantId,
        api_key: apiKey,
        api_token_encrypted: apiToken,
        environment,
        is_active: isActive,
      };

      const { error: saveError } = await supabase
        .from('paybright_config')
        .upsert(configData, {
          onConflict: 'merchant_id',
        });

      if (saveError) throw saveError;

      setSuccess('Payment settings saved successfully!');
      setHasExistingConfig(true);
      setApiToken('');
    } catch (err) {
      console.error('Error saving config:', err);
      setError('Failed to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading payment settings...</p>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payment Settings</h1>
          <p className="text-slate-600 mt-2">
            Configure PayBright to accept payments from customers
          </p>
        </div>

        {error && (
          <Card variant="bordered" className="bg-red-50 border-red-200">
            <CardBody>
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            </CardBody>
          </Card>
        )}

        {success && (
          <Card variant="bordered" className="bg-green-50 border-green-200">
            <CardBody>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-green-700">{success}</p>
              </div>
            </CardBody>
          </Card>
        )}

        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-[#2BB673] mr-3" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">PayBright Configuration</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Connect your PayBright account to start accepting payments
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Contact the PayBright team to get your API credentials</li>
                <li>Start with sandbox mode to test the integration</li>
                <li>Switch to live mode when ready to accept real payments</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Environment
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="environment"
                    value="sandbox"
                    checked={environment === 'sandbox'}
                    onChange={(e) => setEnvironment(e.target.value as 'sandbox')}
                    className="w-4 h-4 text-[#2BB673]"
                  />
                  <span className="ml-2 text-slate-700">Sandbox (Testing)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="environment"
                    value="live"
                    checked={environment === 'live'}
                    onChange={(e) => setEnvironment(e.target.value as 'live')}
                    className="w-4 h-4 text-[#2BB673]"
                  />
                  <span className="ml-2 text-slate-700">Live (Production)</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-2">
                API Key (Account ID)
              </label>
              <Input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your PayBright API Key"
              />
            </div>

            <div>
              <label htmlFor="apiToken" className="block text-sm font-medium text-slate-700 mb-2">
                API Token (Secret)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="apiToken"
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  placeholder={hasExistingConfig ? '••••••••••••' : 'Enter your PayBright API Token'}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {hasExistingConfig
                  ? 'Leave blank to keep existing token'
                  : 'Your token is stored securely and encrypted'}
              </p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#2BB673] rounded"
                />
                <span className="ml-2 text-slate-700">Enable PayBright payments</span>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Button
                onClick={handleSave}
                disabled={saving}
                fullWidth
              >
                {saving ? 'Saving...' : hasExistingConfig ? 'Update Configuration' : 'Save Configuration'}
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <h3 className="text-lg font-bold text-slate-900">Supported Features</h3>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">One-time Payments</p>
                  <p className="text-sm text-slate-600">Accept payments for deal purchases</p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Recurring Subscriptions</p>
                  <p className="text-sm text-slate-600">Manage subscription-based payments</p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Refunds</p>
                  <p className="text-sm text-slate-600">Process full or partial refunds</p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Real-time Updates</p>
                  <p className="text-sm text-slate-600">Webhook integration for instant notifications</p>
                </div>
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
