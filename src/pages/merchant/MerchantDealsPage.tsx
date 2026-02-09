import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface Deal {
  id: string;
  title: string;
  short_description: string;
  status: string;
  price_cents: number;
  original_value_cents: number;
  quantity_total: number;
  quantity_sold: number;
  start_at: string;
  end_at: string;
  created_at: string;
}

export default function MerchantDealsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMerchant();
    }
  }, [user]);

  const loadMerchant = async () => {
    if (!user) return;

    try {
      const { data: merchant, error } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (merchant) {
        setMerchantId(merchant.id);
        await loadDeals(merchant.id);
      }
    } catch (error) {
      console.error('Error loading merchant:', error);
      setError('Failed to load merchant data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDeals = async (merchantId: string) => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setDeals(data);
      }
      setError(null);
    } catch (error) {
      console.error('Error loading deals:', error);
      setError('Failed to load deals. Please try again.');
    }
  };

  const toggleDealStatus = async (dealId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const { error } = await supabase
        .from('deals')
        .update({ status: newStatus })
        .eq('id', dealId);

      if (error) throw error;

      if (merchantId) {
        await loadDeals(merchantId);
      }
    } catch (error) {
      console.error('Error toggling deal status:', error);
      alert('Failed to update deal status. Please try again.');
    }
  };

  const deleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;

      if (merchantId) {
        await loadDeals(merchantId);
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Failed to delete deal. Please try again.');
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-slate-100 text-slate-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-slate-100 text-slate-600',
      draft: 'bg-blue-100 text-blue-800'
    };

    return badges[status as keyof typeof badges] || 'bg-slate-100 text-slate-800';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading deals...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Deals</h1>
            <p className="text-slate-600 mt-2">Manage your active and past deals</p>
          </div>
          <Button onClick={() => navigate('/merchant/deals/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Deal
          </Button>
        </div>

        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <p className="text-red-800 font-medium">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
              <Button variant="outline" onClick={loadMerchant} className="mt-3">
                Try Again
              </Button>
            </CardBody>
          </Card>
        )}

        {deals.length === 0 ? (
          <Card variant="bordered">
            <CardBody className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Plus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No deals yet</h3>
              <p className="text-slate-600 mb-6">Create your first deal to start attracting customers</p>
              <Button onClick={() => navigate('/merchant/deals/new')}>
                Create Your First Deal
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {deals.map((deal) => (
              <Card key={deal.id} variant="bordered">
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{deal.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(deal.status)}`}>
                          {deal.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{deal.short_description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Price</p>
                          <p className="font-semibold text-[#2BB673]">{formatPrice(deal.price_cents)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Original Value</p>
                          <p className="font-semibold text-slate-900">{formatPrice(deal.original_value_cents)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Sold</p>
                          <p className="font-semibold text-slate-900">{deal.quantity_sold}/{deal.quantity_total}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Ends</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(deal.end_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {deal.status === 'active' && (
                        <button
                          onClick={() => toggleDealStatus(deal.id, deal.status)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Deactivate"
                        >
                          <EyeOff className="w-5 h-5" />
                        </button>
                      )}
                      {deal.status === 'inactive' && (
                        <button
                          onClick={() => toggleDealStatus(deal.id, deal.status)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Activate"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteDeal(deal.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
