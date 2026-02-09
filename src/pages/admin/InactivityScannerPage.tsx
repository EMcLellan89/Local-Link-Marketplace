import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Territory {
  id: string;
  territory_name: string;
  country_code: string;
  status: string;
  partner_name: string | null;
  last_activity_at: string | null;
}

export default function InactivityScannerPage() {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ evaluated: number; movedToRecovering: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTerritories();
  }, []);

  const loadTerritories = async () => {
    try {
      const { data, error } = await supabase
        .from('territories')
        .select('*, partners(company_name)')
        .in('status', ['Assigned', 'Recovering'])
        .order('last_activity_at', { ascending: true, nullsFirst: true })
        .limit(200);

      if (error) throw error;

      const territoriesData = (data || []).map(t => ({
        id: (t as any).id,
        territory_name: (t as any).territory_name,
        country_code: (t as any).country_code,
        status: (t as any).status,
        partner_name: (t as any).partners?.company_name || null,
        last_activity_at: (t as any).last_activity_at
      }));

      setTerritories(territoriesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    setError('');
    setScanResult(null);
    setScanning(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-inactive-territories`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Scan failed' }));
        throw new Error(errorData.error || 'Scan failed');
      }

      const result = await response.json();
      setScanResult(result);

      await loadTerritories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">Territory Inactivity Scanner</h1>
        <p className="text-gray-600">
          Auto-moves Assigned territories to Recovering when inactive {'>'} 21 days and 0 paid transactions in 30 days.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {scanResult && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Scan Complete</p>
          <p className="text-sm mt-1">
            Evaluated {scanResult.evaluated} territories, moved {scanResult.movedToRecovering} to Recovering status.
          </p>
        </div>
      )}

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <h2 className="text-lg font-semibold">Inactivity Scan</h2>
              <p className="text-sm text-gray-600">
                Scan all territories for inactivity and automatically recover them
              </p>
            </div>
          </div>
          <Button
            onClick={handleScan}
            disabled={scanning}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? 'Scanning...' : 'Run Scan Now'}
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold">Territory Activity Status</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing territories with Assigned or Recovering status, sorted by last activity
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Territory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {territories.map((territory) => {
                const daysSinceActivity = territory.last_activity_at
                  ? Math.floor((Date.now() - new Date(territory.last_activity_at).getTime()) / (1000 * 60 * 60 * 24))
                  : null;

                const isInactive = daysSinceActivity === null || daysSinceActivity > 21;

                return (
                  <tr key={territory.id} className={isInactive ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{territory.territory_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{territory.country_code}</td>
                    <td className="px-6 py-4 text-sm">
                      {territory.partner_name || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={territory.status} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {territory.last_activity_at ? (
                        <div>
                          <div>{new Date(territory.last_activity_at).toLocaleDateString()}</div>
                          {daysSinceActivity !== null && (
                            <div className={`text-xs ${isInactive ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                              {daysSinceActivity} days ago
                              {isInactive && ' (inactive)'}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-red-600 font-medium">Never</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {territories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No territories with Assigned or Recovering status found.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Assigned: 'bg-green-100 text-green-800',
    Recovering: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
