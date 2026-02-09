import { useState, useEffect } from 'react';
import { Mail, Send, Users, Filter, Plus, Trash2, Edit, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useInternalTeamAuth } from '../../contexts/InternalTeamAuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';

interface BusinessUnit {
  id: string;
  name: string;
}

interface EmailSegment {
  id: string;
  name: string;
  description: string | null;
  business_unit_id: string | null;
  customer_count: number;
  created_at: string;
}

interface EmailCampaign {
  id: string;
  campaign_name: string;
  business_unit_id: string | null;
  segment_id: string | null;
  subject_line: string;
  email_body: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  created_at: string;
}

export default function MarketingCampaignsPage() {
  const { teamMember } = useInternalTeamAuth();
  const [businesses, setBusinesses] = useState<BusinessUnit[]>([]);
  const [segments, setSegments] = useState<EmailSegment[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'segments' | 'campaigns'>('segments');

  const [showSegmentForm, setShowSegmentForm] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [segmentBusiness, setSegmentBusiness] = useState<string>('');

  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [campaignBusiness, setCampaignBusiness] = useState<string>('');
  const [campaignSegment, setCampaignSegment] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [businessesRes, segmentsRes, campaignsRes] = await Promise.all([
      supabase.from('business_units').select('id, name').order('name'),
      supabase.from('customer_email_segments').select('*').order('created_at', { ascending: false }),
      supabase.from('marketing_email_campaigns').select('*').order('created_at', { ascending: false })
    ]);

    if (businessesRes.data) setBusinesses(businessesRes.data);
    if (segmentsRes.data) setSegments(segmentsRes.data);
    if (campaignsRes.data) setCampaigns(campaignsRes.data);
    setLoading(false);
  };

  const createSegment = async () => {
    if (!segmentName) {
      alert('Please enter a segment name');
      return;
    }

    const { error } = await supabase.from('customer_email_segments').insert({
      name: segmentName,
      description: segmentDescription || null,
      business_unit_id: segmentBusiness || null,
      created_by: teamMember?.id
    });

    if (error) {
      alert('Failed to create segment: ' + error.message);
      return;
    }

    setSegmentName('');
    setSegmentDescription('');
    setSegmentBusiness('');
    setShowSegmentForm(false);
    loadData();
  };

  const deleteSegment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this segment?')) return;

    const { error } = await supabase.from('customer_email_segments').delete().eq('id', id);
    if (!error) loadData();
  };

  const createCampaign = async () => {
    if (!campaignName || !campaignSubject || !campaignBody) {
      alert('Please fill in all campaign fields');
      return;
    }

    const { error } = await supabase.from('marketing_email_campaigns').insert({
      campaign_name: campaignName,
      business_unit_id: campaignBusiness || null,
      segment_id: campaignSegment || null,
      subject_line: campaignSubject,
      email_body: campaignBody,
      status: 'draft',
      created_by: teamMember?.id
    });

    if (error) {
      alert('Failed to create campaign: ' + error.message);
      return;
    }

    setCampaignName('');
    setCampaignSubject('');
    setCampaignBody('');
    setCampaignBusiness('');
    setCampaignSegment('');
    setShowCampaignForm(false);
    loadData();
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    const { error } = await supabase.from('marketing_email_campaigns').delete().eq('id', id);
    if (!error) loadData();
  };

  const getBusinessName = (businessId: string | null) => {
    if (!businessId) return 'All Businesses';
    return businesses.find(b => b.id === businessId)?.name || 'Unknown';
  };

  const getSegmentName = (segmentId: string | null) => {
    if (!segmentId) return 'All Customers';
    return segments.find(s => s.id === segmentId)?.name || 'Unknown';
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      draft: 'bg-slate-100 text-slate-700',
      scheduled: 'bg-blue-100 text-blue-700',
      sending: 'bg-amber-100 text-amber-700',
      sent: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status] || styles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Marketing Campaigns</h1>
        <p className="mt-2 text-slate-600">
          Create customer segments and send targeted email campaigns
        </p>
      </div>

      <div className="border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('segments')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'segments'
                ? 'border-[#2BB673] text-[#2BB673]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Customer Segments
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'campaigns'
                ? 'border-[#2BB673] text-[#2BB673]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email Campaigns
          </button>
        </div>
      </div>

      {activeTab === 'segments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Customer Segments</h2>
              <p className="text-sm text-slate-600 mt-1">
                Organize customers into groups for targeted marketing
              </p>
            </div>
            <Button onClick={() => setShowSegmentForm(!showSegmentForm)}>
              <Plus className="w-4 h-4 mr-2" />
              New Segment
            </Button>
          </div>

          {showSegmentForm && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Segment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Segment Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    placeholder="e.g., Active Subscribers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={segmentDescription}
                    onChange={(e) => setSegmentDescription(e.target.value)}
                    placeholder="Describe this segment..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business (optional)
                  </label>
                  <select
                    value={segmentBusiness}
                    onChange={(e) => setSegmentBusiness(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                  >
                    <option value="">All Businesses</option>
                    {businesses.map(business => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={createSegment}>Create Segment</Button>
                  <Button variant="outline" onClick={() => setShowSegmentForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {segments.length === 0 ? (
            <Card className="p-12 text-center">
              <Filter className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500">No segments created yet</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {segments.map(segment => (
                <Card key={segment.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{segment.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{segment.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSegment(segment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Business:</span>
                      <span className="font-medium">{getBusinessName(segment.business_unit_id)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Customers:</span>
                      <span className="font-medium text-[#2BB673]">{segment.customer_count}</span>
                    </div>
                    <div className="text-xs text-slate-500 pt-2 border-t">
                      Created: {new Date(segment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Email Campaigns</h2>
              <p className="text-sm text-slate-600 mt-1">
                Send targeted emails to customer segments
              </p>
            </div>
            <Button onClick={() => setShowCampaignForm(!showCampaignForm)}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>

          {showCampaignForm && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Campaign</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Campaign Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="e.g., Spring Promotion 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business
                    </label>
                    <select
                      value={campaignBusiness}
                      onChange={(e) => setCampaignBusiness(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    >
                      <option value="">All Businesses</option>
                      {businesses.map(business => (
                        <option key={business.id} value={business.id}>
                          {business.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Segment
                  </label>
                  <select
                    value={campaignSegment}
                    onChange={(e) => setCampaignSegment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                  >
                    <option value="">All Customers</option>
                    {segments.map(segment => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name} ({segment.customer_count} customers)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject Line <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={campaignSubject}
                    onChange={(e) => setCampaignSubject(e.target.value)}
                    placeholder="Email subject line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Body <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={campaignBody}
                    onChange={(e) => setCampaignBody(e.target.value)}
                    placeholder="Write your email content here..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    rows={8}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={createCampaign}>Create Campaign</Button>
                  <Button variant="outline" onClick={() => setShowCampaignForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {campaigns.length === 0 ? (
            <Card className="p-12 text-center">
              <Mail className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500">No campaigns created yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <Card key={campaign.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{campaign.campaign_name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <p className="text-sm text-slate-600">
                        <strong>Subject:</strong> {campaign.subject_line}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        <strong>Business:</strong> {getBusinessName(campaign.business_unit_id)} •
                        <strong> Segment:</strong> {getSegmentName(campaign.segment_id)}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {campaign.status === 'sent' && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">{campaign.total_sent}</div>
                        <div className="text-xs text-slate-600">Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#2BB673]">{campaign.total_opened}</div>
                        <div className="text-xs text-slate-600">Opened</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{campaign.total_clicked}</div>
                        <div className="text-xs text-slate-600">Clicked</div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-500 mt-4 pt-4 border-t">
                    Created: {new Date(campaign.created_at).toLocaleDateString()}
                    {campaign.sent_at && ` • Sent: ${new Date(campaign.sent_at).toLocaleDateString()}`}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
