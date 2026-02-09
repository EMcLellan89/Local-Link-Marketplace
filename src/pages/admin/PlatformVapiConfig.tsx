import { useState, useEffect } from 'react';
import { Bot, DollarSign, TrendingUp, Users, Save, Loader, Check, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';

interface PlatformConfig {
  id?: string;
  vapi_api_key: string;
  vapi_public_key: string;
  vapi_account_id: string;
  is_active: boolean;
  monthly_budget_cents: number;
  current_month_spend_cents: number;
}

interface PlatformStats {
  total_merchants: number;
  active_merchants: number;
  total_calls_this_month: number;
  total_minutes_this_month: number;
  total_revenue_cents: number;
  total_cost_cents: number;
  margin_cents: number;
}

export default function PlatformVapiConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [config, setConfig] = useState<PlatformConfig>({
    vapi_api_key: '',
    vapi_public_key: '',
    vapi_account_id: '',
    is_active: false,
    monthly_budget_cents: 100000,
    current_month_spend_cents: 0,
  });

  const [stats, setStats] = useState<PlatformStats>({
    total_merchants: 0,
    active_merchants: 0,
    total_calls_this_month: 0,
    total_minutes_this_month: 0,
    total_revenue_cents: 0,
    total_cost_cents: 0,
    margin_cents: 0,
  });

  useEffect(() => {
    loadConfiguration();
    loadStats();
  }, []);

  async function loadConfiguration() {
    try {
      const { data, error: configError } = await supabase
        .from('platform_vapi_config')
        .select('*')
        .maybeSingle();

      if (configError) throw configError;

      if (data) {
        setConfig(data);
      }
    } catch (err: any) {
      console.error('Error loading config:', err);
      setError('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const { data: merchantsData } = await supabase
        .from('vapi_configurations')
        .select('merchant_id, is_active, current_month_minutes');

      const { data: callsData } = await supabase
        .from('vapi_call_logs')
        .select('duration_seconds, merchant_charge_cents, platform_cost_cents, margin_cents')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (merchantsData) {
        const activeCount = merchantsData.filter(m => m.is_active).length;
        const totalMinutes = merchantsData.reduce((sum, m) => sum + (m.current_month_minutes || 0), 0);

        const totalRevenue = callsData?.reduce((sum, c) => sum + (c.merchant_charge_cents || 0), 0) || 0;
        const totalCost = callsData?.reduce((sum, c) => sum + (c.platform_cost_cents || 0), 0) || 0;

        setStats({
          total_merchants: merchantsData.length,
          active_merchants: activeCount,
          total_calls_this_month: callsData?.length || 0,
          total_minutes_this_month: totalMinutes,
          total_revenue_cents: totalRevenue,
          total_cost_cents: totalCost,
          margin_cents: totalRevenue - totalCost,
        });
      }
    } catch (err: any) {
      console.error('Error loading stats:', err);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (config.id) {
        const { error: updateError } = await supabase
          .from('platform_vapi_config')
          .update({
            vapi_api_key: config.vapi_api_key,
            vapi_public_key: config.vapi_public_key,
            vapi_account_id: config.vapi_account_id,
            is_active: config.is_active,
            monthly_budget_cents: config.monthly_budget_cents,
            updated_at: new Date().toISOString(),
          })
          .eq('id', config.id);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('platform_vapi_config')
          .insert({
            vapi_api_key: config.vapi_api_key,
            vapi_public_key: config.vapi_public_key,
            vapi_account_id: config.vapi_account_id,
            is_active: config.is_active,
            monthly_budget_cents: config.monthly_budget_cents,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setConfig({ ...config, id: data.id });
      }

      setSuccess('Platform Vapi configuration saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error saving configuration:', err);
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Platform Vapi Configuration</h1>
              <p className="text-purple-100">
                White-label reseller configuration - One Vapi account for all merchants
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Merchants</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.active_merchants}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    of {stats.total_merchants} total
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Calls This Month</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total_calls_this_month.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total_minutes_this_month.toLocaleString()} minutes
                  </p>
                </div>
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${(stats.total_revenue_cents / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Cost: ${(stats.total_cost_cents / 100).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Margin</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${(stats.margin_cents / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total_cost_cents > 0
                      ? `${((stats.margin_cents / stats.total_cost_cents) * 100).toFixed(1)}% profit`
                      : '0% profit'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Vapi Account Credentials</h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure your single Vapi account that all merchants will use
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vapi API Key
              </label>
              <input
                type="password"
                value={config.vapi_api_key}
                onChange={(e) => setConfig({ ...config, vapi_api_key: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="sk_live_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vapi Public Key
              </label>
              <input
                type="text"
                value={config.vapi_public_key}
                onChange={(e) => setConfig({ ...config, vapi_public_key: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="pk_live_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vapi Account ID (Optional)
              </label>
              <input
                type="text"
                value={config.vapi_account_id}
                onChange={(e) => setConfig({ ...config, vapi_account_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="From Vapi dashboard"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Budget ($)
              </label>
              <input
                type="number"
                value={config.monthly_budget_cents / 100}
                onChange={(e) =>
                  setConfig({ ...config, monthly_budget_cents: Math.round(parseFloat(e.target.value) * 100) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current month spend: ${(config.current_month_spend_cents / 100).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={config.is_active}
                onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Enable Platform Vapi (All merchants will use this account)
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How White-Label Works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You configure ONE Vapi account here</li>
                <li>• Each merchant gets their own phone number and AI assistant</li>
                <li>• All calls are billed to your Vapi account</li>
                <li>• You track usage and bill merchants separately</li>
                <li>• Merchants never see or need Vapi credentials</li>
              </ul>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving || !config.vapi_api_key || !config.vapi_public_key}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Platform Configuration
              </span>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
