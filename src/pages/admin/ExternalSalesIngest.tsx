import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Copy, Check, Eye, EyeOff, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface ExternalSystem {
  id: string;
  system_key: string;
  system_name: string;
  description: string;
  api_key: string;
  webhook_secret: string;
  is_active: boolean;
  settings: any;
  created_at: string;
}

interface SaleEvent {
  id: string;
  external_order_id: string;
  product_key: string;
  product_name: string;
  amount_cents: number;
  status: string;
  partner_ref_code: string | null;
  customer_email: string | null;
  processed_at: string | null;
  error_message: string | null;
  created_at: string;
  external_systems: {
    system_name: string;
  };
  partners: {
    business_name: string;
  } | null;
}

interface Commission {
  id: string;
  sale_amount_cents: number;
  commission_rate: number;
  commission_amount_cents: number;
  product_key: string;
  product_name: string;
  payout_status: string;
  created_at: string;
  partners: {
    business_name: string;
  };
  external_systems: {
    system_name: string;
  };
}

export default function ExternalSalesIngest() {
  const [systems, setSystems] = useState<ExternalSystem[]>([]);
  const [events, setEvents] = useState<SaleEvent[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'systems' | 'events' | 'commissions'>('systems');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Load external systems
      const { data: systemsData } = await supabase
        .from('external_systems')
        .select('*')
        .order('created_at', { ascending: false });

      if (systemsData) setSystems(systemsData);

      // Load recent events
      const { data: eventsData } = await supabase
        .from('external_sales_events')
        .select(`
          *,
          external_systems!inner(system_name),
          partners(business_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsData) setEvents(eventsData as any);

      // Load recent commissions
      const { data: commissionsData } = await supabase
        .from('external_sale_commissions')
        .select(`
          *,
          partners!inner(business_name),
          external_systems!inner(system_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (commissionsData) setCommissions(commissionsData as any);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  function toggleSecret(systemId: string) {
    setShowSecrets((prev) => ({ ...prev, [systemId]: !prev[systemId] }));
  }

  function formatCents(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'duplicate':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  }

  function getStatusBadge(status: string) {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
      duplicate: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      approved: 'bg-green-100 text-green-800',
      paid: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {getStatusIcon(status)}
        {status}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">External Sales Ingest</h1>
        <p className="mt-2 text-gray-600">
          Manage external systems, monitor incoming sales, and track commissions
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('systems')}
            className={`${
              activeTab === 'systems'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            External Systems ({systems.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`${
              activeTab === 'events'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Sale Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`${
              activeTab === 'commissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Commissions ({commissions.length})
          </button>
        </nav>
      </div>

      {/* Systems Tab */}
      {activeTab === 'systems' && (
        <div className="space-y-6">
          {systems.map((system) => (
            <Card key={system.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{system.system_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{system.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Key: {system.system_key}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${system.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {system.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <Button onClick={loadData} variant="secondary" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 mt-6">
                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showSecrets[`${system.id}-api`] ? 'text' : 'password'}
                      value={system.api_key}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                    />
                    <Button
                      onClick={() => toggleSecret(`${system.id}-api`)}
                      variant="secondary"
                      size="sm"
                    >
                      {showSecrets[`${system.id}-api`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(system.api_key, `${system.id}-api`)}
                      variant="secondary"
                      size="sm"
                    >
                      {copiedField === `${system.id}-api` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Webhook Secret */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook Secret
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showSecrets[`${system.id}-secret`] ? 'text' : 'password'}
                      value={system.webhook_secret}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                    />
                    <Button
                      onClick={() => toggleSecret(`${system.id}-secret`)}
                      variant="secondary"
                      size="sm"
                    >
                      {showSecrets[`${system.id}-secret`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(system.webhook_secret, `${system.id}-secret`)}
                      variant="secondary"
                      size="sm"
                    >
                      {copiedField === `${system.id}-secret` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Webhook URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook Endpoint
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/functions/v1/external-sale-ingest`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                    />
                    <Button
                      onClick={() => copyToClipboard(`${window.location.origin}/functions/v1/external-sale-ingest`, `${system.id}-url`)}
                      variant="secondary"
                      size="sm"
                    >
                      {copiedField === `${system.id}-url` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Example Request */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Example Request
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg text-xs overflow-x-auto">
{`curl -X POST ${window.location.origin}/functions/v1/external-sale-ingest \\
  -H "X-API-Key: ${system.api_key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "external_order_id": "order_12345",
    "product_key": "storylab-kids-basic",
    "product_name": "StoryLab Kids - Basic Book",
    "amount_cents": 2997,
    "partner_ref_code": "PARTNER123",
    "customer_email": "customer@example.com",
    "customer_name": "John Doe"
  }'`}
                  </pre>
                </details>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    System
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {event.external_order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.external_systems.system_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{event.product_name || event.product_key}</div>
                      <div className="text-xs text-gray-500">{event.product_key}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCents(event.amount_cents)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.partners ? (
                        <div>
                          <div className="font-medium">{event.partners.business_name}</div>
                          <div className="text-xs text-gray-500">{event.partner_ref_code}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No partner</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(event.status)}
                      {event.error_message && (
                        <div className="text-xs text-red-600 mt-1">{event.error_message}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Commissions Tab */}
      {activeTab === 'commissions' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    System
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissions.map((commission) => (
                  <tr key={commission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {commission.partners.business_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {commission.external_systems.system_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{commission.product_name || commission.product_key}</div>
                      <div className="text-xs text-gray-500">{commission.product_key}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCents(commission.sale_amount_cents)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(commission.commission_rate * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCents(commission.commission_amount_cents)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(commission.payout_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(commission.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
