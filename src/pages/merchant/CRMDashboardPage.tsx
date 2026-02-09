import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, Plus, Phone, Mail, Calendar,
  Tag, TrendingUp, Clock, CheckCircle2, XCircle,
  AlertCircle, DollarSign, MapPin, Activity,
  ChevronDown, ChevronRight, Edit, Trash2,
  BarChart3, Target, Zap, MessageSquare, FileText
} from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  lead_source: string;
  pipeline_stage: string;
  lead_score: number;
  estimated_value_cents: number | null;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  tags: string[] | null;
  created_at: string;
  notes: string | null;
}

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  created_by: string;
}

interface PipelineStats {
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  negotiation: number;
  won: number;
  lost: number;
}

const pipelineStages = [
  { id: 'new', name: 'New', color: 'bg-slate-100 text-slate-700', icon: AlertCircle },
  { id: 'contacted', name: 'Contacted', color: 'bg-blue-100 text-blue-700', icon: Phone },
  { id: 'qualified', name: 'Qualified', color: 'bg-cyan-100 text-cyan-700', icon: CheckCircle2 },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100 text-yellow-700', icon: DollarSign },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-700', icon: Target },
  { id: 'won', name: 'Won', color: 'bg-green-100 text-green-700', icon: TrendingUp },
  { id: 'lost', name: 'Lost', color: 'bg-red-100 text-red-700', icon: XCircle },
];

const leadSources = [
  { value: 'marketplace', label: 'Marketplace Purchase', color: 'bg-green-100 text-green-700' },
  { value: 'website', label: 'Website', color: 'bg-blue-100 text-blue-700' },
  { value: 'referral', label: 'Referral', color: 'bg-purple-100 text-purple-700' },
  { value: 'walk-in', label: 'Walk-in', color: 'bg-orange-100 text-orange-700' },
  { value: 'phone', label: 'Phone', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'social', label: 'Social Media', color: 'bg-pink-100 text-pink-700' },
  { value: 'other', label: 'Other', color: 'bg-slate-100 text-slate-700' },
];

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    lead_source: 'marketplace',
    pipeline_stage: 'new',
    lead_score: 85,
    estimated_value_cents: 50000,
    last_contact_date: null,
    next_follow_up_date: new Date(Date.now() + 86400000).toISOString(),
    tags: ['hot-lead', 'vip'],
    created_at: new Date(Date.now() - 3600000).toISOString(),
    notes: 'Purchased $500 deal package. Very interested in monthly marketing services.',
  },
  {
    id: '2',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    lead_source: 'website',
    pipeline_stage: 'contacted',
    lead_score: 72,
    estimated_value_cents: 35000,
    last_contact_date: new Date(Date.now() - 7200000).toISOString(),
    next_follow_up_date: new Date(Date.now() + 172800000).toISOString(),
    tags: ['warm-lead'],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Left inquiry about website design services. Responded within 2 hours.',
  },
  {
    id: '3',
    first_name: 'Jennifer',
    last_name: 'Martinez',
    email: 'jennifer.m@email.com',
    phone: '(555) 345-6789',
    lead_source: 'referral',
    pipeline_stage: 'qualified',
    lead_score: 90,
    estimated_value_cents: 75000,
    last_contact_date: new Date(Date.now() - 14400000).toISOString(),
    next_follow_up_date: new Date(Date.now() + 259200000).toISOString(),
    tags: ['hot-lead', 'recurring-revenue'],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    notes: 'Referred by existing customer. Looking for full marketing package with monthly retainer.',
  },
  {
    id: '4',
    first_name: 'David',
    last_name: 'Thompson',
    email: 'dthompson@email.com',
    phone: '(555) 456-7890',
    lead_source: 'marketplace',
    pipeline_stage: 'proposal',
    lead_score: 78,
    estimated_value_cents: 125000,
    last_contact_date: new Date(Date.now() - 28800000).toISOString(),
    next_follow_up_date: new Date(Date.now() + 345600000).toISOString(),
    tags: ['proposal-sent'],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    notes: 'Sent proposal for comprehensive marketing campaign. Waiting for decision by Friday.',
  },
  {
    id: '5',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 567-8901',
    lead_source: 'social',
    pipeline_stage: 'negotiation',
    lead_score: 82,
    estimated_value_cents: 95000,
    last_contact_date: new Date(Date.now() - 43200000).toISOString(),
    next_follow_up_date: new Date(Date.now() + 86400000).toISOString(),
    tags: ['negotiating-price'],
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    notes: 'Negotiating pricing on printing services. Very close to closing.',
  },
  {
    id: '6',
    first_name: 'James',
    last_name: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '(555) 678-9012',
    lead_source: 'marketplace',
    pipeline_stage: 'won',
    lead_score: 95,
    estimated_value_cents: 150000,
    last_contact_date: new Date(Date.now() - 86400000).toISOString(),
    next_follow_up_date: null,
    tags: ['customer', 'high-value'],
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    notes: 'Deal closed! Signed contract for 12-month marketing package.',
  },
  {
    id: '7',
    first_name: 'Lisa',
    last_name: 'Anderson',
    email: 'lisa.anderson@email.com',
    phone: '(555) 789-0123',
    lead_source: 'phone',
    pipeline_stage: 'contacted',
    lead_score: 65,
    estimated_value_cents: 25000,
    last_contact_date: new Date(Date.now() - 172800000).toISOString(),
    next_follow_up_date: new Date(Date.now() + 86400000).toISOString(),
    tags: null,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    notes: 'Called inquiring about postcard services. Needs to check budget.',
  },
  {
    id: '8',
    first_name: 'Robert',
    last_name: 'Taylor',
    email: 'robert.t@email.com',
    phone: '(555) 890-1234',
    lead_source: 'walk-in',
    pipeline_stage: 'new',
    lead_score: 55,
    estimated_value_cents: 15000,
    last_contact_date: null,
    next_follow_up_date: new Date(Date.now() + 43200000).toISOString(),
    tags: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    notes: 'Walked in asking about services. Gave brochure and collected contact info.',
  },
  {
    id: '9',
    first_name: 'Amanda',
    last_name: 'Brown',
    email: 'amanda.brown@email.com',
    phone: '(555) 901-2345',
    lead_source: 'referral',
    pipeline_stage: 'won',
    lead_score: 88,
    estimated_value_cents: 85000,
    last_contact_date: new Date(Date.now() - 259200000).toISOString(),
    next_follow_up_date: null,
    tags: ['customer', 'referral-source'],
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    notes: 'Converted! Purchased website design package. Said she will refer others.',
  },
  {
    id: '10',
    first_name: 'Christopher',
    last_name: 'Davis',
    email: 'chris.davis@email.com',
    phone: '(555) 012-3456',
    lead_source: 'website',
    pipeline_stage: 'lost',
    lead_score: 45,
    estimated_value_cents: 20000,
    last_contact_date: new Date(Date.now() - 604800000).toISOString(),
    next_follow_up_date: null,
    tags: ['price-too-high'],
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    notes: 'Lost to competitor. Said our pricing was too high for their budget.',
  },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    activity_type: 'call',
    description: 'Initial discovery call completed - 30 minutes',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    created_by: 'You',
  },
  {
    id: '2',
    activity_type: 'email',
    description: 'Sent welcome email and service overview',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    created_by: 'You',
  },
  {
    id: '3',
    activity_type: 'note',
    description: 'Customer expressed strong interest in monthly retainer model',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    created_by: 'You',
  },
];

export default function CRMDashboardPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pipelineStats, setPipelineStats] = useState<PipelineStats>({
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [view, setView] = useState<'list' | 'pipeline' | 'analytics'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [merchantId, setMerchantId] = useState<string>('');

  useEffect(() => {
    loadCRMData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchTerm, filterStage, filterSource]);

  const loadCRMData = async () => {
    try {
      setError(null);

      // DEV MODE: Use mock data
      if (DEV_MODE) {
        setMerchantId('dev-merchant-id');
        setLeads(MOCK_LEADS);

        const stats: PipelineStats = {
          new: 0,
          contacted: 0,
          qualified: 0,
          proposal: 0,
          negotiation: 0,
          won: 0,
          lost: 0,
        };

        MOCK_LEADS.forEach((lead) => {
          const stage = lead.pipeline_stage as keyof PipelineStats;
          if (stats.hasOwnProperty(stage)) {
            stats[stage]++;
          }
        });

        setPipelineStats(stats);
        setLoading(false);
        return;
      }

      // PRODUCTION MODE: Load from database
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;
      if (!merchant) {
        setError('Merchant profile not found');
        setLoading(false);
        return;
      }

      setMerchantId(merchant.id);

      const { data: leadsData, error: leadsError } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      setLeads(leadsData || []);

      const stats: PipelineStats = {
        new: 0,
        contacted: 0,
        qualified: 0,
        proposal: 0,
        negotiation: 0,
        won: 0,
        lost: 0,
      };

      (leadsData || []).forEach((lead) => {
        const stage = lead.pipeline_stage as keyof PipelineStats;
        if (stats.hasOwnProperty(stage)) {
          stats[stage]++;
        }
      });

      setPipelineStats(stats);
    } catch (error) {
      console.error('Error loading CRM data:', error);
      setError('Failed to load CRM data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadLeadActivities = async (leadId: string) => {
    try {
      // DEV MODE: Use mock activities
      if (DEV_MODE) {
        setActivities(MOCK_ACTIVITIES);
        return;
      }

      // PRODUCTION MODE: Load from database
      const { data, error } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.first_name.toLowerCase().includes(term) ||
          lead.last_name.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term) ||
          (lead.phone && lead.phone.includes(term))
      );
    }

    if (filterStage !== 'all') {
      filtered = filtered.filter((lead) => lead.pipeline_stage === filterStage);
    }

    if (filterSource !== 'all') {
      filtered = filtered.filter((lead) => lead.lead_source === filterSource);
    }

    setFilteredLeads(filtered);
  };

  const handleLeadClick = async (lead: Lead) => {
    setSelectedLead(lead);
    await loadLeadActivities(lead.id);
  };

  const handleStageChange = async (leadId: string, newStage: string) => {
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({ pipeline_stage: newStage })
        .eq('id', leadId);

      if (error) throw error;

      await loadCRMData();
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, pipeline_stage: newStage });
      }
    } catch (error) {
      console.error('Error updating stage:', error);
      alert('Failed to update lead stage');
    }
  };

  const totalValue = leads.reduce(
    (sum, lead) => sum + (lead.estimated_value_cents || 0),
    0
  ) / 100;

  const conversionRate = leads.length > 0
    ? ((pipelineStats.won / leads.length) * 100).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading CRM Dashboard...</div>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">CRM Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage your leads and track your sales pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/merchant/invoices')}>
              <FileText className="w-4 h-4 mr-2" />
              Invoicing
            </Button>
            <Button onClick={() => alert('Add lead form coming soon')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {error && (
          <Card variant="bordered" className="bg-red-50 border-red-200">
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
                <Button variant="outline" size="sm" onClick={loadCRMData}>
                  Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Leads</p>
                  <p className="text-3xl font-bold text-slate-900">{leads.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">All time</p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Pipeline Value</p>
                  <p className="text-3xl font-bold text-slate-900">${totalValue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">Estimated revenue</p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-orange-50 to-amber-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Active Deals</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {pipelineStats.new + pipelineStats.contacted + pipelineStats.qualified + pipelineStats.proposal + pipelineStats.negotiation}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">In progress</p>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Win Rate</p>
                  <p className="text-3xl font-bold text-slate-900">{conversionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">{pipelineStats.won} deals won</p>
            </CardBody>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <Users className="w-4 h-4 mr-2" />
              List View
            </Button>
            <Button
              variant={view === 'pipeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('pipeline')}
            >
              <Target className="w-4 h-4 mr-2" />
              Pipeline View
            </Button>
            <Button
              variant={view === 'analytics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {showFilters && (
          <Card variant="bordered" className="bg-slate-50">
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pipeline Stage
                  </label>
                  <select
                    value={filterStage}
                    onChange={(e) => setFilterStage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                  >
                    <option value="all">All Stages</option>
                    {pipelineStages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lead Source
                  </label>
                  <select
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                  >
                    <option value="all">All Sources</option>
                    {leadSources.map((source) => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {view === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card variant="bordered">
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">
                    Leads ({filteredLeads.length})
                  </h2>
                </CardHeader>
                <CardBody className="p-0">
                  {filteredLeads.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No leads found</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {searchTerm || filterStage !== 'all' || filterSource !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Add your first lead to get started'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {filteredLeads.map((lead) => {
                        const stage = pipelineStages.find((s) => s.id === lead.pipeline_stage);
                        const source = leadSources.find((s) => s.value === lead.lead_source);
                        const StageIcon = stage?.icon || AlertCircle;

                        return (
                          <div
                            key={lead.id}
                            onClick={() => handleLeadClick(lead)}
                            className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                              selectedLead?.id === lead.id ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-slate-900">
                                    {lead.first_name} {lead.last_name}
                                  </h3>
                                  {lead.lead_score >= 80 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <Zap className="w-3 h-3 mr-1" />
                                      Hot
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                                  <span className="flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {lead.email}
                                  </span>
                                  {lead.phone && (
                                    <span className="flex items-center">
                                      <Phone className="w-3 h-3 mr-1" />
                                      {lead.phone}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {stage && (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                                      <StageIcon className="w-3 h-3 mr-1" />
                                      {stage.name}
                                    </span>
                                  )}
                                  {source && (
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${source.color}`}>
                                      {source.label}
                                    </span>
                                  )}
                                  {lead.estimated_value_cents && (
                                    <span className="inline-flex items-center text-xs text-slate-600">
                                      <DollarSign className="w-3 h-3 mr-1" />
                                      ${(lead.estimated_value_cents / 100).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            <div>
              {selectedLead ? (
                <Card variant="bordered" className="sticky top-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900">Lead Details</h2>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {selectedLead.first_name} {selectedLead.last_name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Lead Score: {selectedLead.lead_score}/100
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 text-slate-400 mr-2" />
                          <a href={`mailto:${selectedLead.email}`} className="text-[#2BB673] hover:underline">
                            {selectedLead.email}
                          </a>
                        </div>
                        {selectedLead.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 text-slate-400 mr-2" />
                            <a href={`tel:${selectedLead.phone}`} className="text-[#2BB673] hover:underline">
                              {selectedLead.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                          <span className="text-slate-600">
                            Added {new Date(selectedLead.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Pipeline Stage
                        </label>
                        <select
                          value={selectedLead.pipeline_stage}
                          onChange={(e) => handleStageChange(selectedLead.id, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                        >
                          {pipelineStages.filter(s => s.id !== 'lost').map((stage) => (
                            <option key={stage.id} value={stage.id}>
                              {stage.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedLead.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-700 mb-1">Notes</h4>
                          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                            {selectedLead.notes}
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline" fullWidth>
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" fullWidth>
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline" fullWidth>
                            <Calendar className="w-4 h-4 mr-1" />
                            Schedule
                          </Button>
                          <Button size="sm" variant="outline" fullWidth>
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Note
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">
                          Recent Activity ({activities.length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {activities.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">
                              No activity yet
                            </p>
                          ) : (
                            activities.map((activity) => (
                              <div key={activity.id} className="flex items-start p-2 bg-slate-50 rounded">
                                <Activity className="w-4 h-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-slate-900">{activity.description}</p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {new Date(activity.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card variant="bordered" className="sticky top-6">
                  <CardBody>
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">Select a lead to view details</p>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        )}

        {view === 'pipeline' && (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {pipelineStages.map((stage) => {
              const stageLeads = leads.filter((lead) => lead.pipeline_stage === stage.id);
              const stageValue = stageLeads.reduce(
                (sum, lead) => sum + (lead.estimated_value_cents || 0),
                0
              ) / 100;
              const StageIcon = stage.icon;

              return (
                <Card key={stage.id} variant="bordered" className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stage.color} mb-2`}>
                      <StageIcon className="w-4 h-4 mr-1" />
                      {stage.name}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stageLeads.length}</div>
                    <div className="text-xs text-slate-600">
                      ${stageValue.toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardBody className="flex-1 p-2 space-y-2 max-h-96 overflow-y-auto">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => handleLeadClick(lead)}
                        className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <p className="font-medium text-sm text-slate-900 truncate">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <p className="text-xs text-slate-600 truncate mt-1">{lead.email}</p>
                        {lead.estimated_value_cents && (
                          <p className="text-xs text-[#2BB673] font-medium mt-1">
                            ${(lead.estimated_value_cents / 100).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {view === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Lead Sources</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {leadSources.map((source) => {
                    const count = leads.filter((l) => l.lead_source === source.value).length;
                    const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;

                    return (
                      <div key={source.value}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">{source.label}</span>
                          <span className="text-sm text-slate-600">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-[#2BB673] h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Pipeline Distribution</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {pipelineStages.map((stage) => {
                    const count = (pipelineStats as any)[stage.id] || 0;
                    const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
                    const StageIcon = stage.icon;

                    return (
                      <div key={stage.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="flex items-center text-sm font-medium text-slate-700">
                            <StageIcon className="w-4 h-4 mr-2" />
                            {stage.name}
                          </span>
                          <span className="text-sm text-slate-600">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-[#2BB673] h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </BusinessHubLayout>
  );
}
