import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Bot, Check, AlertCircle, Loader, Save, TrendingUp, Clock, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface VapiAssistant {
  id: string;
  name: string;
  description: string;
  system_prompt: string;
  first_message: string;
  voice_provider: string;
  voice_id: string;
  model: string;
  is_active: boolean;
}

interface VapiTool {
  id: string;
  name: string;
  description: string;
  endpoint_url: string;
}

interface VapiUsage {
  included_minutes: number;
  minutes_used: number;
  overage_minutes: number;
  cost_this_month: number;
}

export default function VapiConfigurationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [merchantId, setMerchantId] = useState<string | null>(null);

  const [usage, setUsage] = useState<VapiUsage>({
    included_minutes: 0,
    minutes_used: 0,
    overage_minutes: 0,
    cost_this_month: 0,
  });

  const [assistant, setAssistant] = useState<VapiAssistant>({
    id: '',
    name: 'Sales Assistant',
    description: 'AI assistant for handling customer calls',
    system_prompt: `You are a helpful sales assistant for a local business. Your role is to:
- Greet callers warmly and professionally
- Answer questions about products and services
- Qualify leads by asking about their needs
- Schedule appointments when requested
- Create leads in the CRM for follow-up
- Look up existing customer information

Always be friendly, concise, and helpful. Use the available tools to take actions when appropriate.`,
    first_message: 'Hello! Thank you for calling. How can I help you today?',
    voice_provider: 'playht',
    voice_id: 'jennifer',
    model: 'gpt-4',
    is_active: true,
  });

  const [availableTools] = useState<VapiTool[]>([
    {
      id: 'create_lead',
      name: 'create_lead',
      description: 'Create a new lead in the CRM with contact information',
      endpoint_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vapi-tool-create-lead`,
    },
    {
      id: 'schedule_appointment',
      name: 'schedule_appointment',
      description: 'Schedule an appointment for a customer',
      endpoint_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vapi-tool-schedule-appointment`,
    },
    {
      id: 'lookup_customer',
      name: 'lookup_customer',
      description: 'Look up customer information by phone, email, or name',
      endpoint_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vapi-tool-lookup-customer`,
    },
    {
      id: 'update_lead_status',
      name: 'update_lead_status',
      description: 'Update the status of a lead (new, contacted, qualified, etc.)',
      endpoint_url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vapi-tool-update-lead-status`,
    },
  ]);

  const [selectedTools, setSelectedTools] = useState<string[]>([
    'create_lead',
    'schedule_appointment',
    'lookup_customer',
  ]);

  const [apiKey, setApiKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, [user]);

  async function loadConfiguration() {
    if (!user) return;

    try {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('id, business_name')
        .eq('user_id', user.id)
        .single();

      if (!merchantData) {
        setError('Merchant profile not found');
        setLoading(false);
        return;
      }

      setMerchantId(merchantData.id);

      const { data: configData } = await supabase
        .from('vapi_configurations')
        .select('*')
        .eq('merchant_id', merchantData.id)
        .maybeSingle();

      if (configData) {
        setUsage({
          included_minutes: configData.included_minutes_monthly || 0,
          minutes_used: configData.current_month_minutes || 0,
          overage_minutes: Math.max(0, (configData.current_month_minutes || 0) - (configData.included_minutes_monthly || 0)),
          cost_this_month: configData.current_month_cost_cents || 0,
        });
        setApiKey(configData.vapi_api_key || '');
        setPublicKey(configData.vapi_public_key || '');
        setPhoneNumberId(configData.phone_number_id || '');
        setIsConnected(configData.is_active || false);
      }

      const { data: assistantData } = await supabase
        .from('vapi_assistants')
        .select('*')
        .eq('merchant_id', merchantData.id)
        .eq('is_active', true)
        .maybeSingle();

      if (assistantData) {
        setAssistant(assistantData);

        const { data: toolsData } = await supabase
          .from('vapi_tools')
          .select('name')
          .eq('assistant_id', assistantData.id);

        if (toolsData) {
          setSelectedTools(toolsData.map((t: any) => t.name));
        }
      } else {
        // Pre-fill business name in system prompt
        setAssistant(prev => ({
          ...prev,
          system_prompt: prev.system_prompt.replace('a local business', merchantData.business_name),
          first_message: `Hello! Thank you for calling ${merchantData.business_name}. How can I help you today?`,
        }));
      }
    } catch (err: any) {
      console.error('Error loading configuration:', err);
      setError('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAPIConnection() {
    if (!merchantId) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: existingConfig } = await supabase
        .from('vapi_configurations')
        .select('id')
        .eq('merchant_id', merchantId)
        .maybeSingle();

      if (existingConfig) {
        const { error: updateError } = await supabase
          .from('vapi_configurations')
          .update({
            vapi_api_key: apiKey,
            vapi_public_key: publicKey,
            phone_number_id: phoneNumberId,
            is_active: apiKey.length > 0,
            updated_at: new Date().toISOString(),
          })
          .eq('merchant_id', merchantId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('vapi_configurations')
          .insert({
            merchant_id: merchantId,
            vapi_api_key: apiKey,
            vapi_public_key: publicKey,
            phone_number_id: phoneNumberId,
            is_active: apiKey.length > 0,
          });

        if (insertError) throw insertError;
      }

      setIsConnected(apiKey.length > 0);
      setSuccess('FrontDesk AI Pro connection saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error saving API connection:', err);
      setError(err.message || 'Failed to save API connection');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveConfiguration() {
    if (!merchantId) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let assistantId = assistant.id;

      if (!assistantId) {
        const { data: newAssistant, error: assistantError } = await supabase
          .from('vapi_assistants')
          .insert({
            merchant_id: merchantId,
            ...assistant,
          })
          .select()
          .single();

        if (assistantError) throw assistantError;
        assistantId = newAssistant.id;
        setAssistant(newAssistant);
      } else {
        const { error: updateError } = await supabase
          .from('vapi_assistants')
          .update({
            name: assistant.name,
            description: assistant.description,
            system_prompt: assistant.system_prompt,
            first_message: assistant.first_message,
            voice_provider: assistant.voice_provider,
            voice_id: assistant.voice_id,
            model: assistant.model,
          })
          .eq('id', assistantId);

        if (updateError) throw updateError;
      }

      await supabase
        .from('vapi_tools')
        .delete()
        .eq('assistant_id', assistantId);

      const toolsToInsert = availableTools
        .filter(tool => selectedTools.includes(tool.name))
        .map(tool => ({
          assistant_id: assistantId,
          name: tool.name,
          description: tool.description,
          endpoint_url: tool.endpoint_url,
        }));

      if (toolsToInsert.length > 0) {
        const { error: toolsError } = await supabase
          .from('vapi_tools')
          .insert(toolsToInsert);

        if (toolsError) throw toolsError;
      }

      setSuccess('AI Assistant configuration saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error saving configuration:', err);
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  }

  function toggleTool(toolName: string) {
    setSelectedTools(prev =>
      prev.includes(toolName)
        ? prev.filter(t => t !== toolName)
        : [...prev, toolName]
    );
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

  const percentUsed = usage.included_minutes > 0 ? (usage.minutes_used / usage.included_minutes) * 100 : 0;

  return (
    <DashboardLayout role="merchant">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Voice Assistant</h1>
              <p className="text-blue-100">
                Customize your AI-powered voice assistant to handle customer calls automatically
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">FrontDesk AI Pro Connection</h2>
                <p className="text-sm text-gray-600 mt-1">Connect your FrontDesk AI Pro account</p>
              </div>
              {isConnected && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Connected
                </div>
              )}
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="fdai_ll_ingest_..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your FrontDesk AI Pro API key (starts with fdai_)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key (Optional)
              </label>
              <input
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="public_..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Public key for client-side integrations (optional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number ID (Optional)
              </label>
              <input
                type="text"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                placeholder="Phone number ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                The phone number ID from your FrontDesk AI Pro dashboard
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">How to get your API key:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Log in to your FrontDesk AI Pro account</li>
                  <li>Navigate to Settings &gt; API Keys</li>
                  <li>Copy your API key (starts with fdai_)</li>
                  <li>Paste it above and click Save Connection</li>
                </ol>
              </div>
            </div>

            <Button
              onClick={handleSaveAPIConnection}
              disabled={saving || !apiKey}
              className="w-full"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving Connection...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Connection
                </span>
              )}
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Usage This Month</h2>
            <p className="text-sm text-gray-600 mt-1">Track your AI voice assistant usage</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">Minutes Used</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {usage.minutes_used} <span className="text-sm font-normal">/ {usage.included_minutes}</span>
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Included</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{usage.included_minutes} min</p>
              </div>

              <div className={`rounded-lg p-4 ${usage.overage_minutes > 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className={`w-4 h-4 ${usage.overage_minutes > 0 ? 'text-orange-600' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${usage.overage_minutes > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                    Overage
                  </span>
                </div>
                <p className={`text-2xl font-bold ${usage.overage_minutes > 0 ? 'text-orange-900' : 'text-gray-900'}`}>
                  {usage.overage_minutes} min
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Usage Progress</span>
                <span className="font-medium text-gray-900">{percentUsed.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    percentUsed > 100 ? 'bg-orange-600' : percentUsed > 80 ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {usage.overage_minutes > 0
                  ? `You have ${usage.overage_minutes} overage minutes at $0.08/minute`
                  : `You have ${usage.included_minutes - usage.minutes_used} minutes remaining`}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">AI Assistant Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">Customize your voice assistant's behavior</p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assistant Name
              </label>
              <input
                type="text"
                value={assistant.name}
                onChange={(e) => setAssistant({ ...assistant, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Message
              </label>
              <input
                type="text"
                value={assistant.first_message}
                onChange={(e) => setAssistant({ ...assistant, first_message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Hello! How can I help you today?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Prompt
              </label>
              <textarea
                value={assistant.system_prompt}
                onChange={(e) => setAssistant({ ...assistant, system_prompt: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Define your assistant's personality and capabilities
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Model
                </label>
                <select
                  value={assistant.model}
                  onChange={(e) => setAssistant({ ...assistant, model: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="gpt-4">GPT-4 (Recommended)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Provider
                </label>
                <select
                  value={assistant.voice_provider}
                  onChange={(e) => setAssistant({ ...assistant, voice_provider: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="playht">PlayHT</option>
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="deepgram">Deepgram</option>
                  <option value="azure">Azure</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Available Tools</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select which actions your AI assistant can perform
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {availableTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => toggleTool(tool.name)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTools.includes(tool.name)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1 rounded ${
                        selectedTools.includes(tool.name) ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        {selectedTools.includes(tool.name) ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/merchant/communications')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveConfiguration}
            disabled={saving}
            className="flex-1"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Saving Configuration...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Save Configuration
              </span>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
