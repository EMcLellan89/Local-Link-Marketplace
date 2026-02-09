import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';

interface ExpansionRequest {
  id: string;
  partner_id: string;
  requested_name: string;
  country_code: string;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  partner_company_name: string;
  partner_email: string;
}

export default function ExpansionReviewPage() {
  const [requests, setRequests] = useState<ExpansionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/expansion-manage`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load requests' }));
        throw new Error(errorData.error || 'Failed to load requests');
      }

      const data = await response.json();
      const formattedRequests = (data.requests || []).map((r: any) => ({
        id: r.id,
        partner_id: r.partner_id,
        requested_name: r.requested_name,
        country_code: r.country_code,
        notes: r.notes,
        status: r.status,
        admin_notes: r.admin_notes,
        created_at: r.created_at,
        partner_company_name: r.partners?.company_name || 'Unknown',
        partner_email: r.partners?.email || '',
      }));

      setRequests(formattedRequests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, status: string) => {
    setError('');
    setProcessing(requestId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/expansion-manage`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_status',
          request_id: requestId,
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update status' }));
        throw new Error(errorData.error || 'Failed to update status');
      }

      await loadRequests();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleApprove = async (requestId: string, requestedName: string) => {
    if (!window.confirm(`Approve expansion request for "${requestedName}"? This will assign/create the territory.`)) {
      return;
    }

    setError('');
    setProcessing(requestId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/expansion-manage`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          request_id: requestId,
          create_if_missing: true,
          territory_type: 'Metro',
          currency_code: 'USD',
          language_code: 'en',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to approve request' }));
        throw new Error(errorData.error || 'Failed to approve request');
      }

      await loadRequests();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleDecline = async (requestId: string, requestedName: string) => {
    const reason = window.prompt(`Decline expansion request for "${requestedName}"?\n\nEnter reason (optional):`);
    if (reason === null) return;

    setError('');
    setProcessing(requestId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/expansion-manage`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'decline',
          request_id: requestId,
          admin_notes: reason || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to decline request' }));
        throw new Error(errorData.error || 'Failed to decline request');
      }

      await loadRequests();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
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
          <p className="text-gray-600">Loading expansion requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Expansion Requests</h1>
        <p className="text-gray-600">
          Approve or decline partner territory expansion requests. Approval assigns territory (creates if needed).
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Territory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{request.partner_company_name}</div>
                    <div className="text-sm text-gray-600">{request.partner_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">
                      {request.requested_name} ({request.country_code})
                    </div>
                    {request.notes && (
                      <div className="text-sm text-gray-600 mt-1">{request.notes}</div>
                    )}
                    {request.admin_notes && (
                      <div className="text-sm text-red-600 mt-1">
                        Admin: {request.admin_notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {request.status === 'Requested' && (
                        <Button
                          onClick={() => handleUpdateStatus(request.id, 'UnderReview')}
                          disabled={processing === request.id}
                          className="text-xs px-2 py-1 bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                      )}

                      {['Requested', 'UnderReview'].includes(request.status) && (
                        <>
                          <Button
                            onClick={() => handleApprove(request.id, request.requested_name)}
                            disabled={processing === request.id}
                            className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>

                          <Button
                            onClick={() => handleDecline(request.id, request.requested_name)}
                            disabled={processing === request.id}
                            className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No expansion requests found.
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Approval Process
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Approval checks partner eligibility score (must be ≥70 and certified)</li>
          <li>• If territory doesn't exist, it will be created automatically</li>
          <li>• Territory is assigned to partner immediately upon approval</li>
          <li>• Partners are notified of approval/decline (future feature)</li>
        </ul>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Requested: 'bg-blue-100 text-blue-800',
    UnderReview: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Declined: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
