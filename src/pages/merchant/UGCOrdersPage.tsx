import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { Video, Clock, CheckCircle, Download, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UGCOrder {
  id: string;
  status: string;
  created_at: string;
  due_date: string;
  total_price_cents: number;
  ugc_packages: {
    name: string;
    video_count: number;
  };
  ugc_creators?: {
    display_name: string;
  };
  ugc_assets: Array<{
    id: string;
    file_url: string;
    file_name: string;
    approved: boolean;
  }>;
}

export default function UGCOrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<UGCOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    const { data: merchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!merchant) return;

    const { data } = await supabase
      .from('ugc_orders')
      .select(`
        *,
        ugc_packages(name, video_count),
        ugc_creators(display_name),
        ugc_assets(id, file_url, file_name, approved)
      `)
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false });

    if (data) setOrders(data as any);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-blue-100 text-blue-800',
      submitted: 'bg-green-100 text-green-800',
      approved: 'bg-green-100 text-green-800',
      completed: 'bg-slate-100 text-slate-800'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded font-medium ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout role="merchant">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="merchant">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Video className="text-blue-600" />
              My UGC Orders
            </h1>
            <p className="text-slate-600 mt-1">Track and manage your UGC content orders</p>
          </div>
          <Button onClick={() => navigate('/merchant/ugc-request')}>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No UGC orders yet</h3>
                <p className="text-slate-600 mb-6">Get started by ordering authentic video content from creators.</p>
                <Button onClick={() => navigate('/merchant/ugc-request')}>
                  Request UGC Content
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {order.ugc_packages.name}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-slate-500">Videos:</span>
                          <p className="font-medium text-slate-900">{order.ugc_packages.video_count}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Creator:</span>
                          <p className="font-medium text-slate-900">
                            {order.ugc_creators?.display_name || 'Pending assignment'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Due Date:</span>
                          <p className="font-medium text-slate-900">
                            {new Date(order.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Price:</span>
                          <p className="font-medium text-slate-900">
                            ${(order.total_price_cents / 100).toFixed(0)}
                          </p>
                        </div>
                      </div>

                      {order.ugc_assets.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">
                            Delivered Assets ({order.ugc_assets.length})
                          </h4>
                          <div className="flex gap-2 flex-wrap">
                            {order.ugc_assets.map((asset) => (
                              <div key={asset.id} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded">
                                {asset.approved ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-yellow-600" />
                                )}
                                <span className="text-sm text-slate-700">{asset.file_name || 'Video'}</span>
                                <a
                                  href={asset.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/merchant/ugc-orders/${order.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
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