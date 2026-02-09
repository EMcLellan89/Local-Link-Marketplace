import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../lib/supabase';
import { Award, Plus, Trash2, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';

interface Partner {
  id: string;
  business_name: string;
  status: string;
}

interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_key: string;
  audience: string;
  sort_order: number;
  earned: boolean;
  earned_at: string | null;
  metadata: any;
}

export default function AdminPartnerBadgesPage() {
  const { adminUser: user } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  const [partnerData, setPartnerData] = useState<{
    partner: Partner;
    badges: Badge[];
  } | null>(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [awardReason, setAwardReason] = useState('');

  const fetchPartnerBadges = async (partnerId: string) => {
    if (!user || !partnerId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('admin-partner-badges', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      setPartnerData(data);
    } catch (err: any) {
      console.error('Error fetching partner badges:', err);
      alert(err.message || 'Failed to load partner badges');
    } finally {
      setLoading(false);
    }
  };

  const handleAwardBadge = async () => {
    if (!selectedBadgeId || !partnerData) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-award-badge', {
        body: {
          partner_id: partnerData.partner.id,
          badge_id: selectedBadgeId,
          reason: awardReason.trim() || null,
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setShowAwardModal(false);
      setSelectedBadgeId('');
      setAwardReason('');
      await fetchPartnerBadges(partnerData.partner.id);
      alert('Badge awarded successfully');
    } catch (err: any) {
      console.error('Error awarding badge:', err);
      alert(err.message || 'Failed to award badge');
    }
  };

  const handleRevokeBadge = async (badgeId: string) => {
    if (!partnerData || !confirm('Are you sure you want to revoke this badge?')) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-revoke-badge', {
        body: {
          partner_id: partnerData.partner.id,
          badge_id: badgeId,
          reason: 'Revoked by admin',
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      await fetchPartnerBadges(partnerData.partner.id);
      alert('Badge revoked successfully');
    } catch (err: any) {
      console.error('Error revoking badge:', err);
      alert(err.message || 'Failed to revoke badge');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton to="/admin/dashboard" label="Back to Admin" />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Badges</h1>
          <p className="text-gray-600 mt-1">Manage badges for individual partners</p>
        </div>

        <Card className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter partner ID to view badges..."
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
              />
            </div>
            <Button onClick={() => fetchPartnerBadges(selectedPartnerId)} disabled={!selectedPartnerId || loading}>
              <Search className="w-4 h-4 mr-2" />
              Load Partner
            </Button>
          </div>
        </Card>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading partner badges...</p>
          </div>
        )}

        {partnerData && !loading && (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{partnerData.partner.business_name}</h2>
                  <p className="text-sm text-gray-600">
                    Status: <span className="font-semibold">{partnerData.partner.status}</span>
                  </p>
                </div>
                <Button onClick={() => setShowAwardModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Award Badge
                </Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {partnerData.badges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`p-6 ${
                    badge.earned
                      ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200'
                      : 'bg-white opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Award className={`w-6 h-6 ${badge.earned ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <h3 className="font-bold text-gray-900">{badge.name}</h3>
                        {badge.earned && badge.earned_at && (
                          <p className="text-xs text-gray-600">
                            Earned: {new Date(badge.earned_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {badge.earned && (
                      <Button
                        onClick={() => handleRevokeBadge(badge.id)}
                        className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </Card>
              ))}
            </div>
          </>
        )}

        {showAwardModal && partnerData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full p-6 m-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Award Badge</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Badge
                  </label>
                  <select
                    value={selectedBadgeId}
                    onChange={(e) => setSelectedBadgeId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a badge...</option>
                    {partnerData.badges
                      .filter((b) => !b.earned)
                      .map((badge) => (
                        <option key={badge.id} value={badge.id}>
                          {badge.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={awardReason}
                    onChange={(e) => setAwardReason(e.target.value)}
                    placeholder="Why are you awarding this badge?"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleAwardBadge} disabled={!selectedBadgeId}>
                    Award Badge
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAwardModal(false);
                      setSelectedBadgeId('');
                      setAwardReason('');
                    }}
                    className="bg-gray-500 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
