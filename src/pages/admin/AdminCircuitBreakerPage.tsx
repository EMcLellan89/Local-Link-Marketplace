import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface CircuitBreakerConfig {
  enabled: boolean;
  state: 'open' | 'closed' | 'half_open';
  fail_window_minutes: number;
  max_failures_in_window: number;
  cooldown_minutes: number;
  last_opened_at: string | null;
  manual_override: 'force_open' | 'force_closed' | null;
}

export default function AdminCircuitBreakerPage() {
  const [config, setConfig] = useState<CircuitBreakerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const { data, error } = await supabaseBrowser
        .from('platform_config')
        .select('value')
        .eq('key', 'llm_circuit_breaker')
        .single();

      if (error) throw error;
      setConfig(data?.value as CircuitBreakerConfig);
    } catch (err) {
      console.error('Failed to load config:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateConfig(updates: Partial<CircuitBreakerConfig>) {
    try {
      setUpdating(true);
      const newConfig = { ...config, ...updates };

      const { error } = await supabaseBrowser
        .from('platform_config')
        .update({ value: newConfig })
        .eq('key', 'llm_circuit_breaker');

      if (error) throw error;

      setConfig(newConfig as CircuitBreakerConfig);
      alert('Circuit breaker updated successfully');
    } catch (err) {
      console.error('Failed to update config:', err);
      alert('Failed to update circuit breaker');
    } finally {
      setUpdating(false);
    }
  }

  async function toggleEnabled() {
    await updateConfig({ enabled: !config?.enabled });
  }

  async function forceOpen() {
    await updateConfig({ manual_override: 'force_open', state: 'open' });
  }

  async function forceClosed() {
    await updateConfig({ manual_override: 'force_closed', state: 'closed' });
  }

  async function clearOverride() {
    await updateConfig({ manual_override: null });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading circuit breaker config...</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Circuit breaker config not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Circuit Breaker Controls
        </h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current State</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Enabled</div>
                <div className={`text-2xl font-bold ${config.enabled ? 'text-green-600' : 'text-red-600'}`}>
                  {config.enabled ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">State</div>
                <div className={`text-2xl font-bold ${
                  config.state === 'closed' ? 'text-green-600' :
                  config.state === 'open' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {config.state.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Manual Override</div>
                <div className="text-lg font-medium text-gray-900">
                  {config.manual_override || 'None'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Last Opened</div>
                <div className="text-lg font-medium text-gray-900">
                  {config.last_opened_at ? new Date(config.last_opened_at).toLocaleString() : 'Never'}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Failure Window</span>
                <span className="font-medium">{config.fail_window_minutes} minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Max Failures in Window</span>
                <span className="font-medium">{config.max_failures_in_window}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Cooldown Period</span>
                <span className="font-medium">{config.cooldown_minutes} minutes</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Controls</h2>
            <div className="space-y-4">
              <div>
                <Button
                  onClick={toggleEnabled}
                  disabled={updating}
                  className={`w-full ${
                    config.enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {config.enabled ? 'Disable Circuit Breaker' : 'Enable Circuit Breaker'}
                </Button>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Manual Override</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={forceOpen}
                    disabled={updating}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Force Open
                  </Button>
                  <Button
                    onClick={forceClosed}
                    disabled={updating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Force Closed
                  </Button>
                  <Button
                    onClick={clearOverride}
                    disabled={updating}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Clear Override
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> Manual overrides will prevent the circuit breaker from
                  automatically changing state. Clear the override to restore automatic behavior.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
