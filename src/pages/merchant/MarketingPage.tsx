import { useEffect, useState } from 'react';
import { Mail, Users, Send, Eye, MousePointer, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';

interface Campaign {
  id: string;
  name: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number;
  opened_count: number;
  clicked_count: number;
  created_at: string;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  customer_count: number;
  filters: any;
  created_at: string;
}

export default function MarketingPage() {
  const { user } = useAuth();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'segments'>('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email',
    subject: '',
    message: '',
    segment_id: '',
  });

  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (user) {
      fetchMerchantData();
    }
  }, [user]);

  const fetchMerchantData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (merchantData) {
        setMerchantId(merchantData.id);
        await Promise.all([
          fetchCampaigns(merchantData.id),
          fetchSegments(merchantData.id),
        ]);
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      setError('Failed to load marketing data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async (merchId: string) => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('merchant_id', merchId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  };

  const fetchSegments = async (merchId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_segments')
        .select('*')
        .eq('merchant_id', merchId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setSegments(data);
      }
    } catch (error) {
      console.error('Error fetching segments:', error);
      throw error;
    }
  };

  const createCampaign = async () => {
    if (!merchantId || !newCampaign.name || !newCampaign.message) return;

    try {
      const { error } = await supabase.from('marketing_campaigns').insert({
        merchant_id: merchantId,
        name: newCampaign.name,
        type: newCampaign.type,
        subject: newCampaign.subject,
        message: newCampaign.message,
        segment_id: newCampaign.segment_id || null,
        status: 'draft',
      });

      if (error) throw error;

      setNewCampaign({ name: '', type: 'email', subject: '', message: '', segment_id: '' });
      setShowCreateModal(false);
      fetchCampaigns(merchantId);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    }
  };

  const createSegment = async () => {
    if (!merchantId || !newSegment.name) return;

    try {
      const { error } = await supabase.from('customer_segments').insert({
        merchant_id: merchantId,
        name: newSegment.name,
        description: newSegment.description,
        filters: {},
        customer_count: 0,
      });

      if (error) throw error;

      setNewSegment({ name: '', description: '' });
      setShowCreateModal(false);
      fetchSegments(merchantId);
    } catch (error) {
      console.error('Error creating segment:', error);
      alert('Failed to create segment. Please try again.');
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase.from('marketing_campaigns').delete().eq('id', campaignId);

      if (error) throw error;

      setCampaigns(campaigns.filter(c => c.id !== campaignId));
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign. Please try again.');
    }
  };

  const deleteSegment = async (segmentId: string) => {
    if (!confirm('Are you sure you want to delete this segment?')) return;

    try {
      const { error } = await supabase.from('customer_segments').delete().eq('id', segmentId);

      if (error) throw error;

      setSegments(segments.filter(s => s.id !== segmentId));
    } catch (error) {
      console.error('Error deleting segment:', error);
      alert('Failed to delete segment. Please try again.');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const calculateOpenRate = (opened: number, recipients: number) => {
    if (recipients === 0) return 0;
    return Math.round((opened / recipients) * 100);
  };

  const calculateClickRate = (clicked: number, recipients: number) => {
    if (recipients === 0) return 0;
    return Math.round((clicked / recipients) * 100);
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading marketing tools...</p>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <p className="text-red-800 font-medium">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
              <Button variant="outline" onClick={fetchMerchantData} className="mt-3">
                Try Again
              </Button>
            </CardBody>
          </Card>
        )}

        <Card variant="elevated">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Marketing Hub</h1>
                <p className="text-slate-600 mt-2">Create campaigns and manage customer segments</p>
              </div>
              <Button onClick={() => setShowCreateModal(true)} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                {activeTab === 'campaigns' ? 'New Campaign' : 'New Segment'}
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-lg p-6 text-white">
                <Mail className="w-8 h-8 mb-2 opacity-90" />
                <p className="text-sm opacity-90 mb-1">Total Campaigns</p>
                <p className="text-4xl font-bold">{campaigns.length}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6">
                <Users className="w-8 h-8 mb-2 text-slate-400" />
                <p className="text-sm text-slate-600 mb-1">Active Segments</p>
                <p className="text-4xl font-bold text-slate-900">{segments.length}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6">
                <Send className="w-8 h-8 mb-2 text-slate-400" />
                <p className="text-sm text-slate-600 mb-1">Sent This Month</p>
                <p className="text-4xl font-bold text-slate-900">
                  {campaigns.filter(c => c.status === 'sent').length}
                </p>
              </div>
            </div>

            <div className="flex gap-2 border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'campaigns'
                    ? 'text-[#2BB673] border-b-2 border-[#2BB673]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setActiveTab('segments')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'segments'
                    ? 'text-[#2BB673] border-b-2 border-[#2BB673]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer Segments
              </button>
            </div>

            {activeTab === 'campaigns' ? (
              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No campaigns yet</h3>
                    <p className="text-slate-600 mb-4">Create your first marketing campaign</p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
                  campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                campaign.status === 'sent'
                                  ? 'bg-green-100 text-green-800'
                                  : campaign.status === 'draft'
                                  ? 'bg-slate-100 text-slate-800'
                                  : campaign.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {campaign.status}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                              {campaign.type}
                            </span>
                          </div>
                          {campaign.subject && (
                            <p className="text-sm text-slate-600 mb-2">Subject: {campaign.subject}</p>
                          )}
                          <p className="text-sm text-slate-500">
                            Created on {formatDate(campaign.created_at)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteCampaign(campaign.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {campaign.status === 'sent' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Recipients</p>
                            <p className="text-2xl font-bold text-slate-900">{campaign.recipient_count}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Eye className="w-4 h-4 text-slate-400" />
                              <p className="text-xs text-slate-500">Opened</p>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                              {calculateOpenRate(campaign.opened_count, campaign.recipient_count)}%
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <MousePointer className="w-4 h-4 text-slate-400" />
                              <p className="text-xs text-slate-500">Clicked</p>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                              {calculateClickRate(campaign.clicked_count, campaign.recipient_count)}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {segments.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No segments yet</h3>
                    <p className="text-slate-600 mb-4">Create customer segments to target specific audiences</p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Segment
                    </Button>
                  </div>
                ) : (
                  segments.map((segment) => (
                    <div
                      key={segment.id}
                      className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{segment.name}</h3>
                          {segment.description && (
                            <p className="text-slate-600 mb-3">{segment.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-500">
                              {segment.customer_count} customers
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">
                              Created {formatDate(segment.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSegment(segment.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card variant="elevated" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">
                  {activeTab === 'campaigns' ? 'Create New Campaign' : 'Create New Segment'}
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {activeTab === 'campaigns' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Campaign Name
                      </label>
                      <Input
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                        placeholder="Summer Sale 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Campaign Type
                      </label>
                      <select
                        value={newCampaign.type}
                        onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="push">Push Notification</option>
                      </select>
                    </div>
                    {newCampaign.type === 'email' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Subject
                        </label>
                        <Input
                          value={newCampaign.subject}
                          onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                          placeholder="Don't miss our summer deals!"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={newCampaign.message}
                        onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                        placeholder="Enter your message here..."
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                        rows={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Target Segment (Optional)
                      </label>
                      <select
                        value={newCampaign.segment_id}
                        onChange={(e) => setNewCampaign({ ...newCampaign, segment_id: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                      >
                        <option value="">All Customers</option>
                        {segments.map((segment) => (
                          <option key={segment.id} value={segment.id}>
                            {segment.name} ({segment.customer_count} customers)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={createCampaign} fullWidth>
                        Create Campaign
                      </Button>
                      <Button variant="ghost" onClick={() => setShowCreateModal(false)} fullWidth>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Segment Name
                      </label>
                      <Input
                        value={newSegment.name}
                        onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                        placeholder="High-value customers"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newSegment.description}
                        onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                        placeholder="Customers who have spent over $500"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={createSegment} fullWidth>
                        Create Segment
                      </Button>
                      <Button variant="ghost" onClick={() => setShowCreateModal(false)} fullWidth>
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </BusinessHubLayout>
  );
}
