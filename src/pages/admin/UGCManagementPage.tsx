import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import BackButton from '../../components/ui/BackButton';
import { Video, Users, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface Creator {
  id: string;
  display_name: string;
  bio: string;
  industries: string[];
  sample_video_urls: string[];
  status: string;
  rating: number;
  total_videos_delivered: number;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  business_name: string;
  industry: string;
  created_at: string;
  due_date: string;
  total_price_cents: number;
  ugc_packages: {
    name: string;
  };
  ugc_creators?: {
    display_name: string;
  };
  merchants: {
    business_name: string;
  };
}

export default function UGCManagementPage() {
  const [activeTab, setActiveTab] = useState<'creators' | 'orders'>('creators');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'creators') {
      const { data } = await supabase
        .from('ugc_creators')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setCreators(data);
    } else {
      const { data } = await supabase
        .from('ugc_orders')
        .select(`
          *,
          ugc_packages(name),
          ugc_creators(display_name),
          merchants(business_name)
        `)
        .order('created_at', { ascending: false });

      if (data) setOrders(data as any);
    }
    setLoading(false);
  };

  const handleApproveCreator = async (creatorId: string) => {
    const { error } = await supabase
      .from('ugc_creators')
      .update({ status: 'approved' })
      .eq('id', creatorId);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Creator approved!');
      loadData();
      setSelectedCreator(null);
    }
  };

  const handleRejectCreator = async (creatorId: string) => {
    const reason = prompt('Rejection reason (optional):');
    const { error } = await supabase
      .from('ugc_creators')
      .update({ status: 'rejected', rejection_reason: reason || 'Not approved' })
      .eq('id', creatorId);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Creator rejected');
      loadData();
      setSelectedCreator(null);
    }
  };

  const handleAssignCreator = async (orderId: string) => {
    const { data: availableCreators } = await supabase
      .from('ugc_creators')
      .select('id, display_name')
      .eq('status', 'approved')
      .limit(20);

    if (!availableCreators || availableCreators.length === 0) {
      alert('No approved creators available');
      return;
    }

    const creatorId = prompt(
      'Enter creator ID:\n\n' +
      availableCreators.map(c => `${c.id}: ${c.display_name}`).join('\n')
    );

    if (!creatorId) return;

    const { error } = await supabase
      .from('ugc_orders')
      .update({ creator_id: creatorId, status: 'assigned' })
      .eq('id', orderId);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Creator assigned successfully!');
      loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paused: 'bg-slate-100 text-slate-800',
      paid: 'bg-blue-100 text-blue-800',
      assigned: 'bg-violet-100 text-violet-800',
      in_progress: 'bg-blue-100 text-blue-800',
      submitted: 'bg-green-100 text-green-800',
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
      <DashboardLayout role="admin">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Video className="text-blue-600" />
            UGC Network Management
          </h1>
          <p className="text-slate-600 mt-1">Manage creators and orders</p>
        </div>

        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('creators')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'creators'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Creators ({creators.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'creators' ? (
          <div className="grid md:grid-cols-2 gap-4">
            {creators.map((creator) => (
              <Card key={creator.id}>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">{creator.display_name}</h3>
                        {getStatusBadge(creator.status)}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedCreator(creator)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">{creator.bio}</p>

                    <div className="flex gap-2 flex-wrap">
                      {creator.industries.map((ind) => (
                        <span key={ind} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {ind}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
                      <div>
                        <span className="text-slate-500">Videos:</span>
                        <p className="font-medium">{creator.total_videos_delivered}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Rating:</span>
                        <p className="font-medium">{creator.rating > 0 ? creator.rating.toFixed(1) : 'N/A'}</p>
                      </div>
                    </div>

                    {creator.status === 'pending' && (
                      <div className="flex gap-2 pt-3">
                        <Button
                          size="sm"
                          onClick={() => handleApproveCreator(creator.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRejectCreator(creator.id)}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-900">{order.business_name}</h3>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Package:</span>
                          <p className="font-medium">{order.ugc_packages.name}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Industry:</span>
                          <p className="font-medium">{order.industry}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Creator:</span>
                          <p className="font-medium">{order.ugc_creators?.display_name || 'Unassigned'}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Due:</span>
                          <p className="font-medium">{new Date(order.due_date).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {(order.status === 'paid' || !order.ugc_creators) && (
                        <Button
                          size="sm"
                          onClick={() => handleAssignCreator(order.id)}
                        >
                          Assign Creator
                        </Button>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-600">Total</p>
                      <p className="text-lg font-bold text-slate-900">
                        ${(order.total_price_cents / 100).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {selectedCreator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">{selectedCreator.display_name}</h2>
                    <Button variant="secondary" onClick={() => setSelectedCreator(null)}>
                      Close
                    </Button>
                  </div>

                  {getStatusBadge(selectedCreator.status)}

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Bio</h3>
                    <p className="text-slate-600">{selectedCreator.bio}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Industries</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedCreator.industries.map((ind) => (
                        <span key={ind} className="bg-slate-100 text-slate-700 px-3 py-1 rounded">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Sample Videos</h3>
                    <div className="space-y-2">
                      {selectedCreator.sample_video_urls.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:underline text-sm"
                        >
                          Sample Video #{idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>

                  {selectedCreator.status === 'pending' && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={() => handleApproveCreator(selectedCreator.id)} className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Creator
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleRejectCreator(selectedCreator.id)}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}