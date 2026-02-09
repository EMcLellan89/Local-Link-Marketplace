import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';
import { MapPin, TrendingUp, AlertCircle } from 'lucide-react';

interface EligibilityResult {
  eligible: boolean;
  score: number;
  reasons: string[];
  metrics: {
    certified: boolean;
    trainingPercent: number;
    activeTerritories: number;
    liveDeals: number;
    paidTx30d: number;
    gross30d: number;
    chargebacks30d: number;
    chargebackRate30d: number;
  };
}

interface ExpansionRequest {
  id: string;
  requested_name: string;
  country_code: string;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export default function ExpansionRequestPage() {
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [requests, setRequests] = useState<ExpansionRequest[]>([]);
  const [requestedName, setRequestedName] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/expansion-request`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load data' }));
        throw new Error(errorData.error || 'Failed to load data');
      }

      const data = await response.json();
      setEligibility(data.eligibility || null);
      setRequests(data.requests || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/expansion-request`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requested_name: requestedName,
          country_code: countryCode,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || 'Request failed');
      }

      setSuccess('Expansion request submitted successfully!');
      setRequestedName('');
      setNotes('');

      setTimeout(() => {
        loadData();
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
          <p className="text-gray-600">Loading expansion data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Territory Expansion</h1>
        <p className="text-gray-600">
          Request new territories globally. Eligibility is performance + certification gated.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {eligibility && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">Eligibility Score</h2>
                <p className="text-sm text-gray-600">Based on performance and certification</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{eligibility.score}/100</div>
              <div className={`text-sm font-medium ${eligibility.eligible ? 'text-green-600' : 'text-red-600'}`}>
                {eligibility.eligible ? 'Eligible' : 'Not Eligible'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Paid Tx (30d)</div>
              <div className="text-lg font-semibold">{eligibility.metrics.paidTx30d}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Gross (30d)</div>
              <div className="text-lg font-semibold">${eligibility.metrics.gross30d.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Chargebacks</div>
              <div className="text-lg font-semibold">{eligibility.metrics.chargebacks30d}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Live Deals</div>
              <div className="text-lg font-semibold">{eligibility.metrics.liveDeals}</div>
            </div>
          </div>

          {!eligibility.eligible && eligibility.reasons.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-medium text-red-800 mb-2">Requirements not met:</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {eligibility.reasons.slice(0, 3).map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          New Expansion Request
        </h2>

        {!eligibility?.eligible && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              Expansion requests are locked until your eligibility score meets the threshold (70/100).
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Territory Name *
              </label>
              <Input
                type="text"
                placeholder="City/Metro/Region"
                value={requestedName}
                onChange={(e) => setRequestedName(e.target.value)}
                disabled={!eligibility?.eligible || submitting}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Code *
              </label>
              <Input
                type="text"
                placeholder="US"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                disabled={!eligibility?.eligible || submitting}
                maxLength={2}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Why this territory, your plan, estimated merchants in 30 days, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!eligibility?.eligible || submitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={!eligibility?.eligible || submitting || !requestedName.trim() || countryCode.length < 2}
            className="w-full"
          >
            {submitting ? 'Submitting...' : 'Submit Expansion Request'}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold">My Expansion Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Territory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{request.requested_name}</div>
                    {request.notes && (
                      <div className="text-sm text-gray-600 mt-1">{request.notes}</div>
                    )}
                    {request.admin_notes && (
                      <div className="text-sm text-red-600 mt-1">Admin: {request.admin_notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{request.country_code}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No expansion requests yet. Submit your first request above!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Requested: 'bg-blue-100 text-blue-800',
    UnderReview: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Declined: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
