import { useState, useEffect } from 'react';
import { Key, Copy, RefreshCw, CheckCircle, XCircle, AlertTriangle, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useInternalTeamAuth } from '../../contexts/InternalTeamAuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';

interface BusinessUnit {
  id: string;
  name: string;
  domain: string;
  business_type: string;
}

interface APIKey {
  id: string;
  business_unit_id: string;
  api_key: string;
  api_secret: string;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  permissions: any;
  notes: string | null;
  created_at: string;
}

export default function APIIntegrationPage() {
  const { teamMember } = useInternalTeamAuth();
  const [businesses, setBusinesses] = useState<BusinessUnit[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<string>('');
  const [showSecret, setShowSecret] = useState<{ [key: string]: boolean }>({});
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [notes, setNotes] = useState('');

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/internal-crm-webhook`;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [businessesRes, apiKeysRes] = await Promise.all([
      supabase.from('business_units').select('*').order('name'),
      supabase.from('business_api_keys').select('*').order('created_at', { ascending: false })
    ]);

    if (businessesRes.data) setBusinesses(businessesRes.data);
    if (apiKeysRes.data) setApiKeys(apiKeysRes.data);
    setLoading(false);
  };

  const generateAPIKey = async () => {
    if (!selectedBusiness) {
      alert('Please select a business');
      return;
    }

    const { data: keyData } = await supabase.rpc('generate_api_key');
    const { data: secretData } = await supabase.rpc('generate_api_secret');

    if (!keyData || !secretData) {
      alert('Failed to generate API credentials');
      return;
    }

    const { error } = await supabase.from('business_api_keys').insert({
      business_unit_id: selectedBusiness,
      api_key: keyData,
      api_secret: secretData,
      created_by: teamMember?.id,
      notes: notes || null
    });

    if (error) {
      alert('Failed to save API key: ' + error.message);
      return;
    }

    setNotes('');
    setSelectedBusiness('');
    loadData();
  };

  const toggleAPIKey = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('business_api_keys')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) loadData();
  };

  const deleteAPIKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase.from('business_api_keys').delete().eq('id', id);
    if (!error) loadData();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const getBusinessName = (businessId: string) => {
    return businesses.find(b => b.id === businessId)?.name || 'Unknown';
  };

  const toggleSecretVisibility = (keyId: string) => {
    setShowSecret(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">API Integration Management</h1>
        <p className="mt-2 text-slate-600">
          Manage API keys for external business integrations and view webhook documentation
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-[#2BB673]" />
          <h2 className="text-xl font-bold text-slate-900">Webhook Integration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL</label>
            <div className="flex gap-2">
              <Input
                value={webhookUrl}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(webhookUrl, 'Webhook URL')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {copySuccess === 'Webhook URL' && (
              <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Integration Instructions</h3>
            <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
              <li>Generate an API key for your business below</li>
              <li>Configure your business platform to send webhooks to the URL above</li>
              <li>Include these headers in all webhook requests:
                <ul className="ml-6 mt-1 space-y-1">
                  <li><code className="bg-slate-200 px-2 py-0.5 rounded">X-API-Key: your_api_key</code></li>
                  <li><code className="bg-slate-200 px-2 py-0.5 rounded">X-API-Secret: your_api_secret</code></li>
                  <li><code className="bg-slate-200 px-2 py-0.5 rounded">Content-Type: application/json</code></li>
                </ul>
              </li>
              <li>Send POST requests with event data in the body</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Supported Event Types</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
              <div><code className="bg-blue-100 px-2 py-0.5 rounded">customer.created</code></div>
              <div><code className="bg-blue-100 px-2 py-0.5 rounded">customer.updated</code></div>
              <div><code className="bg-blue-100 px-2 py-0.5 rounded">sale.completed</code></div>
              <div><code className="bg-blue-100 px-2 py-0.5 rounded">payment.succeeded</code></div>
              <div><code className="bg-blue-100 px-2 py-0.5 rounded">subscription.created</code></div>
              <div><code className="bg-blue-100 px-2 py-0.5 rounded">subscription.updated</code></div>
              <div><code className="bg-blue-100 px-2 py-0.5 rounded">subscription.cancelled</code></div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Generate New API Key</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
            >
              <option value="">Select a business...</option>
              {businesses.map(business => (
                <option key={business.id} value={business.id}>
                  {business.name} ({business.domain})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes (optional)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Production API Key"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={generateAPIKey}
              disabled={!selectedBusiness}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate API Key
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Active API Keys</h2>

        {apiKeys.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Key className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No API keys generated yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map(key => (
              <div
                key={key.id}
                className={`border rounded-lg p-4 ${
                  key.is_active ? 'border-slate-200 bg-white' : 'border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">
                        {getBusinessName(key.business_unit_id)}
                      </h3>
                      {key.is_active ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded">
                          <XCircle className="w-3 h-3" />
                          Disabled
                        </span>
                      )}
                    </div>
                    {key.notes && (
                      <p className="text-sm text-slate-600">{key.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAPIKey(key.id, key.is_active)}
                    >
                      {key.is_active ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAPIKey(key.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-slate-600">API Key</label>
                    <div className="flex gap-2 mt-1">
                      <code className="flex-1 text-sm bg-slate-100 px-3 py-2 rounded border border-slate-300 font-mono">
                        {key.api_key}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(key.api_key, key.id + '-key')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {copySuccess === key.id + '-key' && (
                      <p className="text-xs text-green-600 mt-1">Copied!</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600">API Secret</label>
                    <div className="flex gap-2 mt-1">
                      <code className="flex-1 text-sm bg-slate-100 px-3 py-2 rounded border border-slate-300 font-mono">
                        {showSecret[key.id] ? key.api_secret : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSecretVisibility(key.id)}
                      >
                        {showSecret[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(key.api_secret, key.id + '-secret')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    {copySuccess === key.id + '-secret' && (
                      <p className="text-xs text-green-600 mt-1">Copied!</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
                    <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                    {key.last_used_at ? (
                      <span>Last used: {new Date(key.last_used_at).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Never used
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Security Best Practices</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Store API keys and secrets securely - never commit them to version control</li>
              <li>• Use environment variables in your business platforms</li>
              <li>• Disable or delete API keys that are no longer in use</li>
              <li>• Generate separate API keys for production and testing environments</li>
              <li>• Monitor the "Last Used" timestamp to detect unauthorized access</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
