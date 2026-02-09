import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../lib/supabase';
import { Activity, Filter, RefreshCw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface SystemEvent {
  id: string;
  event_type: string;
  actor_type: string;
  actor_id: string;
  payload: any;
  dedupe_key: string | null;
  processed: boolean;
  processed_at: string | null;
  created_at: string;
}

export default function AdminSystemEventsPage() {
  const { adminUser: user } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [filterProcessed, setFilterProcessed] = useState<string>('false');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [user, filterProcessed]);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-events`);
      url.searchParams.set('processed', filterProcessed);
      url.searchParams.set('limit', '50');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error('Error fetching system events:', err);
      setError(err.message || 'Failed to load system events');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('internal-process-events', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      alert(`Processed ${data.processed_count} events. Awarded ${data.awarded_badges} badges.`);
      await fetchEvents();
    } catch (err: any) {
      console.error('Error processing events:', err);
      alert(err.message || 'Failed to process events');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton to="/admin/dashboard" label="Back to Admin" />
          <Card className="p-8 text-center">
            <p className="text-red-600">{error}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton to="/admin/dashboard" label="Back to Admin" />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Events</h1>
            <p className="text-gray-600 mt-1">Monitor badge awarding engine and system events</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleProcessEvents} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Process Events
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterProcessed}
              onChange={(e) => setFilterProcessed(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Events</option>
              <option value="false">Unprocessed Only</option>
              <option value="true">Processed Only</option>
            </select>
            <span className="text-sm text-gray-600">Total: {total} events</span>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.length === 0 ? (
              <Card className="p-8 text-center text-gray-600">
                No events found matching your filters.
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      event.processed ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <Activity className={`w-5 h-5 ${
                        event.processed ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{event.event_type}</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {event.actor_type}
                          </span>
                          {event.processed && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                              Processed
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Actor ID: <span className="font-mono text-xs">{event.actor_id}</span></div>
                        {event.dedupe_key && (
                          <div>Dedupe Key: <span className="font-mono text-xs">{event.dedupe_key}</span></div>
                        )}
                        {Object.keys(event.payload).length > 0 && (
                          <div className="mt-2">
                            <details className="cursor-pointer">
                              <summary className="text-blue-600 hover:text-blue-700">View Payload</summary>
                              <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                                {JSON.stringify(event.payload, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
