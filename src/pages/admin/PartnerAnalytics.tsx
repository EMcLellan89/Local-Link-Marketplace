import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import BackButton from '../../components/ui/BackButton';
import { Users, DollarSign, TrendingUp, MapPin, Lock } from 'lucide-react';

interface AnalyticsData {
  totalPartners: number;
  activePartners: number;
  totalTerritories: number;
  assignedTerritories: number;
  totalRevenue: number;
  partnerRevenue: number;
  platformRevenue: number;
  fillRate: number;
  topPartners: Array<{
    id: string;
    company_name: string;
    partner_id_num: number;
    referral_slug: string;
    total_revenue: number;
    territory_count: number;
  }>;
  territoryStats: Array<{
    id: string;
    territory_name: string;
    country_code: string;
    status: string;
    partner_name: string | null;
    gross_revenue_total: number;
  }>;
}

export default function PartnerAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [partnersRes, territoriesRes, transactionsRes] = await Promise.all([
        supabase.from('partners').select('*'),
        supabase.from('territories').select('*, partners(company_name)'),
        supabase.from('transactions').select('*').eq('payment_status', 'Paid')
      ]);

      if (partnersRes.error) throw partnersRes.error;
      if (territoriesRes.error) throw territoriesRes.error;
      if (transactionsRes.error) throw transactionsRes.error;

      const partners = partnersRes.data || [];
      const territories = territoriesRes.data || [];
      const transactions = transactionsRes.data || [];

      const activePartners = partners.filter(p => (p as any).status === 'Active').length;
      const assignedTerritories = territories.filter(t => (t as any).status === 'Assigned').length;
      const fillRate = territories.length > 0 ? (assignedTerritories / territories.length) * 100 : 0;

      const totalRevenue = transactions.reduce((sum, t) => sum + parseFloat(String((t as any).gross_amount || 0)), 0);
      const partnerRevenue = transactions.reduce((sum, t) => sum + parseFloat(String((t as any).partner_share || 0)), 0);
      const platformRevenue = transactions.reduce((sum, t) => sum + parseFloat(String((t as any).platform_share || 0)), 0);

      const partnerRevenueMap = new Map<string, number>();
      const partnerTerritoryMap = new Map<string, number>();

      transactions.forEach(t => {
        const current = partnerRevenueMap.get((t as any).partner_id) || 0;
        partnerRevenueMap.set((t as any).partner_id, current + parseFloat(String((t as any).partner_share || 0)));
      });

      territories.forEach(t => {
        if ((t as any).assigned_partner_id) {
          const current = partnerTerritoryMap.get((t as any).assigned_partner_id) || 0;
          partnerTerritoryMap.set((t as any).assigned_partner_id, current + 1);
        }
      });

      const topPartners = partners
        .map(p => ({
          id: p.id,
          company_name: p.company_name,
          partner_id_num: (p as any).partner_id_num || 0,
          referral_slug: (p as any).referral_slug || '',
          total_revenue: partnerRevenueMap.get(p.id) || 0,
          territory_count: partnerTerritoryMap.get(p.id) || 0,
        }))
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 10);

      const territoryStats = territories.map(t => ({
        id: t.id,
        territory_name: t.territory_name,
        country_code: t.country_code,
        status: t.status,
        partner_name: t.partners?.company_name || null,
        gross_revenue_total: parseFloat(String(t.gross_revenue_total || 0)),
      }));

      setAnalytics({
        totalPartners: partners.length,
        activePartners,
        totalTerritories: territories.length,
        assignedTerritories,
        totalRevenue,
        partnerRevenue,
        platformRevenue,
        fillRate,
        topPartners,
        territoryStats,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Partner & Territory Analytics</h1>
        <p className="text-gray-600">
          Global territory-first rollout performance and revenue metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Partners</div>
              <div className="text-2xl font-bold">
                {analytics.activePartners}
                <span className="text-sm text-gray-500 ml-2">/ {analytics.totalPartners}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Territory Fill Rate</div>
              <div className="text-2xl font-bold">
                {analytics.fillRate.toFixed(1)}%
                <span className="text-sm text-gray-500 ml-2">
                  {analytics.assignedTerritories}/{analytics.totalTerritories}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-2xl font-bold">
                ${analytics.totalRevenue.toFixed(2)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Partner Share (70%)</div>
              <div className="text-2xl font-bold">
                ${analytics.partnerRevenue.toFixed(2)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Split</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Partner Share (70%)</span>
                <span className="text-sm font-bold">${analytics.partnerRevenue.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Platform Share (30%)</span>
                <span className="text-sm font-bold">${analytics.platformRevenue.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: '30%' }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Territory Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Assigned</span>
              <span className="font-bold text-green-600">
                {analytics.territoryStats.filter(t => t.status === 'Assigned').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Available</span>
              <span className="font-bold text-blue-600">
                {analytics.territoryStats.filter(t => t.status === 'Available').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Recovering</span>
              <span className="font-bold text-yellow-600">
                {analytics.territoryStats.filter(t => t.status === 'Recovering').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Locked</span>
              <span className="font-bold text-red-600">
                {analytics.territoryStats.filter(t => t.status === 'Locked').length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Top Partners by Revenue</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Partner</th>
                <th className="text-left py-3 px-4">Partner ID</th>
                <th className="text-left py-3 px-4">Referral Slug</th>
                <th className="text-left py-3 px-4">Territories</th>
                <th className="text-left py-3 px-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topPartners.map((partner, idx) => (
                <tr key={partner.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">#{idx + 1}</span>
                      <span className="font-semibold">{partner.company_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-gray-400" />
                      <span className="font-mono text-sm text-gray-700">{partner.partner_id_num}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-gray-400" />
                      <span className="font-mono text-sm text-blue-600">{partner.referral_slug}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {partner.territory_count}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-green-600">
                    ${partner.total_revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">All Territories</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Territory</th>
                <th className="text-left py-3 px-4">Country</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Partner</th>
                <th className="text-left py-3 px-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.territoryStats.map((territory) => (
                <tr key={territory.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold">{territory.territory_name}</td>
                  <td className="py-3 px-4">{territory.country_code}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        territory.status === 'Assigned'
                          ? 'bg-green-100 text-green-800'
                          : territory.status === 'Available'
                          ? 'bg-blue-100 text-blue-800'
                          : territory.status === 'Recovering'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {territory.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{territory.partner_name || '-'}</td>
                  <td className="py-3 px-4 font-mono">
                    ${territory.gross_revenue_total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
