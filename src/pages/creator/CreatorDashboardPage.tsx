import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';
import { Video, Upload, DollarSign, Clock, CheckCircle, AlertCircle, Wallet } from 'lucide-react';

interface Creator {
  id: string;
  display_name: string;
  status: string;
  rating: number;
  total_videos_delivered: number;
}

interface Order {
  id: string;
  status: string;
  industry: string;
  business_name: string;
  business_description: string;
  content_goal: string;
  target_audience: string;
  key_messages: string;
  due_date: string;
  creator_payout_cents: number;
  ugc_packages: {
    name: string;
    video_count: number;
  };
  ugc_assets: Array<{
    id: string;
    file_url: string;
    approved: boolean;
  }>;
}

interface Payout {
  id: string;
  amount_cents: number;
  status: string;
  created_at: string;
}

export default function CreatorDashboardPage() {
  const { user } = useAuth();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState('');

  useEffect(() => {
    loadCreatorData();
  }, [user]);

  const loadCreatorData = async () => {
    if (!user) return;

    const { data: creatorData } = await supabase
      .from('ugc_creators')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!creatorData) {
      setLoading(false);
      return;
    }

    setCreator(creatorData);

    const { data: ordersData } = await supabase
      .from('ugc_orders')
      .select(`
        *,
        ugc_packages(name, video_count),
        ugc_assets(id, file_url, approved)
      `)
      .eq('creator_id', creatorData.id)
      .in('status', ['assigned', 'in_progress', 'submitted', 'revision_requested'])
      .order('created_at', { ascending: false });

    if (ordersData) setOrders(ordersData as any);

    const { data: payoutsData } = await supabase
      .from('ugc_payouts')
      .select('*')
      .eq('creator_id', creatorData.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (payoutsData) setPayouts(payoutsData);

    setLoading(false);
  };

  const handleUploadVideo = async (orderId: string) => {
    if (!uploadUrl.trim()) {
      alert('Please enter a video URL');
      return;
    }

    try {
      const { error } = await supabase
        .from('ugc_assets')
        .insert({
          order_id: orderId,
          file_url: uploadUrl,
          file_name: 'Video Upload',
          approved: false
        });

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('ugc_orders')
        .update({ status: 'submitted', submitted_at: new Date().toISOString() })
        .eq('id', orderId);

      if (updateError) throw updateError;

      alert('Video uploaded successfully!');
      setUploadUrl('');
      setUploadingOrderId(null);
      loadCreatorData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">No Creator Profile Found</h2>
              <p className="text-slate-600 mb-6">You haven't applied to be a UGC creator yet.</p>
              <Button onClick={() => window.location.href = '/creator/apply'}>
                Apply Now
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (creator.status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center py-8">
              <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Application Under Review</h2>
              <p className="text-slate-600">
                Thanks for applying! We're reviewing your application and will get back to you within 2-3 business days.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (creator.status === 'rejected') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardBody>
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Application Not Approved</h2>
              <p className="text-slate-600">
                Unfortunately, we're unable to approve your application at this time. Please contact support for more information.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const totalEarnings = payouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount_cents, 0);

  const pendingEarnings = payouts
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount_cents, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {creator.display_name}!
            </h1>
            <Button onClick={() => window.location.href = '/creator/wallet'} variant="secondary">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet & Payouts
            </Button>
          </div>
          <p className="text-slate-600">Manage your UGC jobs and track your earnings</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Earned</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${(totalEarnings / 100).toFixed(0)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${(pendingEarnings / 100).toFixed(0)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Videos Delivered</p>
                  <p className="text-2xl font-bold text-slate-900">{creator.total_videos_delivered}</p>
                </div>
                <Video className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Rating</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {creator.rating > 0 ? creator.rating.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-violet-600" />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Active Jobs</h2>

          {orders.length === 0 ? (
            <Card>
              <CardBody>
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No active jobs</h3>
                  <p className="text-slate-600">New jobs will appear here when they're assigned to you.</p>
                </div>
              </CardBody>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{order.business_name}</h3>
                        <p className="text-sm text-slate-600">{order.ugc_packages.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">You'll earn</p>
                        <p className="text-xl font-bold text-green-600">
                          ${(order.creator_payout_cents / 100).toFixed(0)}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Industry:</span>
                        <p className="text-slate-600">{order.industry}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Videos Needed:</span>
                        <p className="text-slate-600">{order.ugc_packages.video_count}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Due Date:</span>
                        <p className="text-slate-600">{new Date(order.due_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Uploaded:</span>
                        <p className="text-slate-600">{order.ugc_assets.length} / {order.ugc_packages.video_count}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">Content Goal:</p>
                      <p className="text-sm text-slate-600">{order.content_goal}</p>
                    </div>

                    {order.target_audience && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">Target Audience:</p>
                        <p className="text-sm text-slate-600">{order.target_audience}</p>
                      </div>
                    )}

                    {order.key_messages && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">Key Messages:</p>
                        <p className="text-sm text-slate-600">{order.key_messages}</p>
                      </div>
                    )}

                    {uploadingOrderId === order.id ? (
                      <div className="pt-4 border-t space-y-3">
                        <Input
                          placeholder="Enter video URL (YouTube, Vimeo, Drive, etc.)"
                          value={uploadUrl}
                          onChange={(e) => setUploadUrl(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleUploadVideo(order.id)}>
                            <Upload className="w-4 h-4 mr-2" />
                            Submit Video
                          </Button>
                          <Button variant="secondary" onClick={() => setUploadingOrderId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t">
                        <Button onClick={() => setUploadingOrderId(order.id)}>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Video
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}