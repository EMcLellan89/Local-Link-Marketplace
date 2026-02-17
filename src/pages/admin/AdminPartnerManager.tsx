import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { Users, Lock, Unlock, CheckCircle, XCircle, Shield, Crown } from 'lucide-react';

interface Partner {
  id: string;
  company_name: string;
  email: string;
  tier_key: string | null;
  tier_locked: boolean;
  stripe_connect_id: string | null;
  status: string;
  created_at: string;
  user_id: string | null;
}

interface PartnerTier {
  key: string;
  name: string;
  monthly_cost_usd: number;
  commission_rate_bps: number;
}

export default function AdminPartnerManager() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [tiers, setTiers] = useState<PartnerTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [partnersResult, tiersResult] = await Promise.all([
        supabase
          .from('partners')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('partner_tiers')
          .select('*')
          .order('commission_rate_bps', { ascending: true })
      ]);

      if (partnersResult.error) throw partnersResult.error;
      if (tiersResult.error) throw tiersResult.error;

      setPartners(partnersResult.data || []);
      setTiers(tiersResult.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePartnerTier = async (partnerId: string, tierKey: string) => {
    if (!window.confirm(`Change partner tier to ${tierKey.toUpperCase()}?`)) return;

    setProcessing(partnerId);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('partners')
        .update({ tier_key: tierKey })
        .eq('id', partnerId);

      if (updateError) throw updateError;

      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const toggleTierLock = async (partnerId: string, currentLocked: boolean) => {
    const action = currentLocked ? 'unlock' : 'lock';
    if (!window.confirm(`${action.toUpperCase()} tier for this partner?`)) return;

    setProcessing(partnerId);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('partners')
        .update({ tier_locked: !currentLocked })
        .eq('id', partnerId);

      if (updateError) throw updateError;

      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const updatePartnerStatus = async (partnerId: string, status: string) => {
    if (!window.confirm(`Change partner status to ${status.toUpperCase()}?`)) return;

    setProcessing(partnerId);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('partners')
        .update({ status })
        .eq('id', partnerId);

      if (updateError) throw updateError;

      await loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const getTierBadge = (tierKey: string | null) => {
    const tier = tiers.find(t => t.key === tierKey);
    if (!tier) return <span className="text-gray-400 text-sm">No Tier</span>;

    const colors: Record<string, string> = {
      starter: 'bg-gray-100 text-gray-800',
      growth: 'bg-blue-100 text-blue-800',
      pro: 'bg-green-100 text-green-800',
      elite: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${colors[tier.key] || 'bg-gray-100 text-gray-800'}`}>
        {tier.name} ({tier.commission_rate_bps / 100}%)
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'bg-green-100 text-green-800',
      Suspended: 'bg-red-100 text-red-800',
      Inactive: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const filteredPartners = filterStatus === 'all'
    ? partners
    : partners.filter(p => p.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Partner Manager</h1>
        </div>
        <p className="text-gray-600">
          Manage partner tiers, lock tier upgrades, and view Stripe Connect status.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('all')}>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{partners.length}</div>
            <div className="text-sm text-gray-600">Total Partners</div>
          </div>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('Active')}>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {partners.filter(p => p.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('Inactive')}>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {partners.filter(p => p.status === 'Inactive').length}
            </div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
        </Card>
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('Suspended')}>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {partners.filter(p => p.status === 'Suspended').length}
            </div>
            <div className="text-sm text-gray-600">Suspended</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {partners.filter(p => p.tier_locked).length}
            </div>
            <div className="text-sm text-gray-600">Tier Locked</div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stripe Connect
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{partner.company_name}</div>
                      <div className="text-sm text-gray-500">{partner.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Joined {new Date(partner.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTierBadge(partner.tier_key)}
                      {partner.tier_locked && (
                        <Lock className="w-4 h-4 text-orange-500" title="Tier Locked" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(partner.status)}
                  </td>
                  <td className="px-6 py-4">
                    {partner.stripe_connect_id ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
                        <XCircle className="w-4 h-4" />
                        Not Connected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={partner.tier_key || ''}
                        onChange={(e) => updatePartnerTier(partner.id, e.target.value)}
                        disabled={processing === partner.id}
                        className="text-xs border rounded px-2 py-1 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        <option value="">Select Tier</option>
                        {tiers.map(tier => (
                          <option key={tier.key} value={tier.key}>
                            {tier.name} ({tier.commission_rate_bps / 100}%)
                          </option>
                        ))}
                      </select>

                      <Button
                        onClick={() => toggleTierLock(partner.id, partner.tier_locked)}
                        disabled={processing === partner.id}
                        className={`text-xs px-3 py-1 ${
                          partner.tier_locked
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {partner.tier_locked ? (
                          <>
                            <Unlock className="w-3 h-3 mr-1" />
                            Unlock
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Lock
                          </>
                        )}
                      </Button>

                      {partner.status === 'Active' ? (
                        <Button
                          onClick={() => updatePartnerStatus(partner.id, 'Suspended')}
                          disabled={processing === partner.id}
                          className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700"
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          onClick={() => updatePartnerStatus(partner.id, 'Active')}
                          disabled={processing === partner.id}
                          className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700"
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No partners found.</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-blue-600" />
          Partner Tier Structure
        </h2>
        <div className="grid md:grid-cols-5 gap-4">
          {tiers.map(tier => (
            <div key={tier.key} className="border rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-1">{tier.name}</div>
              <div className="text-sm text-gray-600 mb-2">
                ${tier.monthly_cost_usd}/month
              </div>
              <div className="text-lg font-bold text-blue-600">
                {tier.commission_rate_bps / 100}% Commission
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Important Notes</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>Tier locked partners will not automatically upgrade based on performance</li>
              <li>Commission rates are calculated as basis points (100 bps = 1%)</li>
              <li>Stripe Connect status is for reference only - payouts use Deluxe eCheck system</li>
              <li>Suspended partners cannot access partner features or earn commissions</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
