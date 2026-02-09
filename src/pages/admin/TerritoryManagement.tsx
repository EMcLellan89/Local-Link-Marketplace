import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { MapPin, Lock, Unlock, RefreshCw, XCircle } from 'lucide-react';

interface Territory {
  id: string;
  territory_name: string;
  country_code: string;
  currency_code: string;
  status: string;
  assigned_partner_id: string | null;
  partner_name: string | null;
  gross_revenue_total: number;
}

interface Partner {
  id: string;
  company_name: string;
}

export default function TerritoryManagement() {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [territoriesRes, partnersRes] = await Promise.all([
        supabase
          .from('territories')
          .select('*, partners(company_name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('partners')
          .select('id, company_name')
          .eq('status', 'Active')
          .order('company_name', { ascending: true })
      ]);

      if (territoriesRes.error) throw territoriesRes.error;
      if (partnersRes.error) throw partnersRes.error;

      const territoriesData = (territoriesRes.data || []).map(t => ({
        id: t.id,
        territory_name: t.territory_name,
        country_code: t.country_code,
        currency_code: t.currency_code,
        status: t.status,
        assigned_partner_id: t.assigned_partner_id,
        partner_name: t.partners?.company_name || null,
        gross_revenue_total: parseFloat(String(t.gross_revenue_total || 0))
      }));

      setTerritories(territoriesData);
      setPartners(partnersRes.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, territoryId: string, partnerId?: string) => {
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/territory-action`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action,
          territory_id: territoryId,
          partner_id: partnerId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Action failed' }));
        throw new Error(errorData.error || 'Action failed');
      }

      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredTerritories = territories.filter(t => {
    const matchesText = !filter ||
      t.territory_name.toLowerCase().includes(filter.toLowerCase()) ||
      t.country_code.toLowerCase().includes(filter.toLowerCase()) ||
      (t.partner_name || '').toLowerCase().includes(filter.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesText && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading territories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Territory Management</h1>
        <p className="text-gray-600">
          Assign partners, recover inactive territories, lock, unlock, or unassign.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search territory, partner, or country..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Recovering">Recovering</option>
            <option value="Locked">Locked</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Territory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTerritories.map((territory) => (
                <tr key={territory.id}>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{territory.territory_name}</div>
                    <div className="text-sm text-gray-500">{territory.currency_code}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{territory.country_code}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={territory.status} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {territory.partner_name || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">
                    ${territory.gross_revenue_total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <TerritoryActions
                      territory={territory}
                      partners={partners}
                      onAction={handleAction}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTerritories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No territories found matching your filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Available: 'bg-blue-100 text-blue-800',
    Assigned: 'bg-green-100 text-green-800',
    Recovering: 'bg-yellow-100 text-yellow-800',
    Locked: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

function TerritoryActions({
  territory,
  partners,
  onAction
}: {
  territory: Territory;
  partners: Partner[];
  onAction: (action: string, territoryId: string, partnerId?: string) => Promise<void>;
}) {
  const [selectedPartner, setSelectedPartner] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleAssign = async () => {
    if (!selectedPartner) return;

    if (!window.confirm(`Assign ${partners.find(p => p.id === selectedPartner)?.company_name} to ${territory.territory_name}?`)) return;

    setProcessing(true);
    try {
      await onAction('ASSIGN', territory.id, selectedPartner);
      setSelectedPartner('');
    } finally {
      setProcessing(false);
    }
  };

  const handleRecover = async () => {
    if (!window.confirm(`Move ${territory.territory_name} to Recovering status?`)) return;
    setProcessing(true);
    try {
      await onAction('RECOVER', territory.id);
    } finally {
      setProcessing(false);
    }
  };

  const handleLock = async () => {
    if (!window.confirm(`Lock ${territory.territory_name}? No assignment changes until unlocked.`)) return;
    setProcessing(true);
    try {
      await onAction('LOCK', territory.id);
    } finally {
      setProcessing(false);
    }
  };

  const handleUnlock = async () => {
    if (!window.confirm(`Unlock ${territory.territory_name}?`)) return;
    setProcessing(true);
    try {
      await onAction('UNLOCK', territory.id);
    } finally {
      setProcessing(false);
    }
  };

  const handleUnassign = async () => {
    if (!window.confirm(`Unassign partner and make ${territory.territory_name} Available?`)) return;
    setProcessing(true);
    try {
      await onAction('UNASSIGN', territory.id);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <select
          value={selectedPartner}
          onChange={(e) => setSelectedPartner(e.target.value)}
          disabled={processing}
          className="text-sm px-2 py-1 border border-gray-300 rounded"
        >
          <option value="">Assign Partner...</option>
          {partners.map(p => (
            <option key={p.id} value={p.id}>{p.company_name}</option>
          ))}
        </select>
        <Button
          onClick={handleAssign}
          disabled={!selectedPartner || processing}
          className="text-xs px-2 py-1"
        >
          Assign
        </Button>
      </div>

      <Button
        onClick={handleRecover}
        disabled={processing}
        className="text-xs px-2 py-1 bg-yellow-600 hover:bg-yellow-700"
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Recover
      </Button>

      {territory.status !== 'Locked' ? (
        <Button
          onClick={handleLock}
          disabled={processing}
          className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700"
        >
          <Lock className="w-3 h-3 mr-1" />
          Lock
        </Button>
      ) : (
        <Button
          onClick={handleUnlock}
          disabled={processing}
          className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700"
        >
          <Unlock className="w-3 h-3 mr-1" />
          Unlock
        </Button>
      )}

      <Button
        onClick={handleUnassign}
        disabled={processing}
        className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-700"
      >
        <XCircle className="w-3 h-3 mr-1" />
        Unassign
      </Button>
    </div>
  );
}
