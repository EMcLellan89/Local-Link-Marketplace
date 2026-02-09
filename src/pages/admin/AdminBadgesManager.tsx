import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../lib/supabase';
import { Award, Edit, Save, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';

interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_key: string;
  audience: string;
  sort_order: number;
  is_active: boolean;
  earned_count?: number;
}

export default function AdminBadgesManager() {
  const { adminUser: user } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Badge>>({});

  useEffect(() => {
    if (user) {
      fetchBadges();
    }
  }, [user]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('admin-badges', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      setBadges(data.badges);
    } catch (err: any) {
      console.error('Error fetching badges:', err);
      alert(err.message || 'Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (badge: Badge) => {
    setEditingId(badge.id);
    setEditForm(badge);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-badges', {
        method: 'PUT',
        body: {
          badge_id: editingId,
          updates: editForm,
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      await fetchBadges();
      setEditingId(null);
      setEditForm({});
      alert('Badge updated successfully');
    } catch (err: any) {
      console.error('Error updating badge:', err);
      alert(err.message || 'Failed to update badge');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton to="/admin/dashboard" label="Back to Admin" />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Badge Management</h1>
          <p className="text-gray-600 mt-1">Manage badge definitions and settings</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Badge</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Icon</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Audience
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Earned</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {badges.map((badge) => (
                <tr key={badge.id} className="hover:bg-gray-50">
                  {editingId === badge.id ? (
                    <>
                      <td className="px-6 py-4">
                        <Input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          type="text"
                          value={editForm.icon_key || ''}
                          onChange={(e) => setEditForm({ ...editForm, icon_key: e.target.value })}
                          className="text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{badge.audience}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          type="number"
                          value={editForm.sort_order || 0}
                          onChange={(e) =>
                            setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })
                          }
                          className="w-20 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{badge.earned_count || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.is_active !== false}
                            onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                            className="rounded text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-600">Active</span>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button onClick={saveEdit} className="text-xs px-3 py-1">
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-xs px-3 py-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">{badge.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md">{badge.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{badge.icon_key}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            badge.audience === 'enterprise_only'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {badge.audience}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{badge.sort_order}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {badge.earned_count || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            badge.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {badge.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button onClick={() => startEdit(badge)} className="text-xs px-3 py-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
