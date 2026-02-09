import { useState, useEffect } from 'react';
import {
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Play,
  Download,
  Calendar
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface CommissionStats {
  total_pending_cents: number;
  total_pending_count: number;
  total_queued_cents: number;
  total_queued_count: number;
  partners_awaiting_payout: number;
}

interface PendingPayout {
  partner_id: string;
  partner_name: string;
  partner_email: string;
  total_owed_cents: number;
  commission_count: number;
  oldest_commission: string;
}

interface PayoutBatch {
  id: string;
  batch_number: string;
  total_amount_cents: number;
  payout_count: number;
  status: string;
  created_at: string;
  processed_at: string | null;
}

export default function CommissionPayoutsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CommissionStats | null>(null);
  const [pendingPayouts, setPendingPayouts] = useState<PendingPayout[]>([]);
  const [recentBatches, setRecentBatches] = useState<PayoutBatch[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [statsResult, pendingResult, batchesResult] = await Promise.all([
        supabase.rpc('get_commission_payout_stats'),
        supabase.rpc('get_pending_partner_payouts'),
        supabase
          .from('commission_payout_batches')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (statsResult.data) setStats(statsResult.data);
      if (pendingResult.data) setPendingPayouts(pendingResult.data);
      if (batchesResult.data) setRecentBatches(batchesResult.data);
    } catch (err) {
      console.error('Error loading payout data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function queueApprovedCommissions() {
    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('queue_approved_commissions');

      if (error) throw error;

      alert(`Successfully queued ${data?.queued_count || 0} commissions for payout`);
      await loadData();
    } catch (err) {
      console.error('Error queuing commissions:', err);
      alert('Failed to queue commissions');
    } finally {
      setProcessing(false);
    }
  }

  async function processPayouts() {
    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('process_commission_payouts');

      if (error) throw error;

      alert(`Successfully processed ${data?.processed_count || 0} payouts totaling $${((data?.total_amount_cents || 0) / 100).toFixed(2)}`);
      await loadData();
    } catch (err) {
      console.error('Error processing payouts:', err);
      alert('Failed to process payouts');
    } finally {
      setProcessing(false);
    }
  }

  function formatCurrency(cents: number): string {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function exportPayoutReport() {
    const headers = ['Partner', 'Email', 'Amount Owed', 'Commissions', 'Oldest Commission'];
    const rows = pendingPayouts.map(p => [
      p.partner_name,
      p.partner_email,
      formatCurrency(p.total_owed_cents),
      p.commission_count,
      new Date(p.oldest_commission).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commission-payouts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Commission Payouts</h1>
              <p className="text-purple-100">Automated daily commission processing and partner payments</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Automated Daily Payouts</h3>
              <p className="text-sm text-blue-700">
                Commission payouts are automatically processed daily at 2:00 AM UTC. You can also manually queue and process payouts anytime using the buttons below.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {formatCurrency(stats?.total_pending_cents || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stats?.total_pending_count || 0} commissions</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Queued for Payout</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(stats?.total_queued_cents || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stats?.total_queued_count || 0} commissions</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Partners Awaiting</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats?.partners_awaiting_payout || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Active partners</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Owed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency((stats?.total_pending_cents || 0) + (stats?.total_queued_cents || 0))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All pending</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={loadData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="secondary" onClick={exportPayoutReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="primary"
                onClick={queueApprovedCommissions}
                disabled={processing || (stats?.total_pending_count || 0) === 0}
                className="justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Queue Approved Commissions
                {stats?.total_pending_count ? ` (${stats.total_pending_count})` : ''}
              </Button>

              <Button
                variant="primary"
                onClick={processPayouts}
                disabled={processing || (stats?.total_queued_count || 0) === 0}
                className="justify-center bg-green-600 hover:bg-green-700"
              >
                <Play className="w-5 h-5 mr-2" />
                Process Payouts
                {stats?.total_queued_count ? ` (${stats.total_queued_count})` : ''}
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Pending Payouts by Partner</h2>
          </CardHeader>
          <CardBody>
            {pendingPayouts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-300" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm mt-1">No pending payouts at this time</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Owed
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commissions
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Oldest
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingPayouts.map((payout) => (
                      <tr key={payout.partner_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payout.partner_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{payout.partner_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-bold text-green-600">
                            {formatCurrency(payout.total_owed_cents)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">{payout.commission_count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-500">
                            {new Date(payout.oldest_commission).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Recent Payout Batches</h2>
            </div>
          </CardHeader>
          <CardBody>
            {recentBatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No payout batches yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBatches.map((batch) => (
                  <div key={batch.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{batch.batch_number}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            batch.status === 'completed' ? 'bg-green-100 text-green-700' :
                            batch.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {batch.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {batch.payout_count} payouts • Created {new Date(batch.created_at).toLocaleString()}
                        </p>
                        {batch.processed_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Processed {new Date(batch.processed_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(batch.total_amount_cents)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
