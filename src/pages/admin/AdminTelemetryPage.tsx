import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';
import Card from '../../components/ui/Card';

interface BotTelemetry {
  id: string;
  exec_case_id: string;
  product_key: string;
  ok: boolean;
  used_fallback: boolean;
  attempts: number;
  model: string;
  created_at: string;
}

export default function AdminTelemetryPage() {
  const [telemetry, setTelemetry] = useState<BotTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    fallbackUsed: 0,
  });

  useEffect(() => {
    loadTelemetry();
  }, []);

  async function loadTelemetry() {
    try {
      const { data, error } = await supabaseBrowser
        .from('bot_run_telemetry')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setTelemetry(data || []);

      const successful = data?.filter((t) => t.ok).length || 0;
      const failed = data?.filter((t) => !t.ok).length || 0;
      const fallbackUsed = data?.filter((t) => t.used_fallback).length || 0;

      setStats({
        total: data?.length || 0,
        successful,
        failed,
        fallbackUsed,
      });
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading telemetry...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bot Telemetry</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-500 mb-1">Total Runs</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-500 mb-1">Successful</div>
            <div className="text-3xl font-bold text-green-600">{stats.successful}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-500 mb-1">Failed</div>
            <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-500 mb-1">Fallback Used</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.fallbackUsed}</div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fallback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempts
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {telemetry.map((t) => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.product_key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {t.ok ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Success
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.used_fallback ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {t.attempts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
