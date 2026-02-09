import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { Plus, Search, Filter, Mail, Phone, Building2, DollarSign, Calendar } from 'lucide-react';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  lead_source: string;
  lead_value: number;
  priority: string;
  next_follow_up: string | null;
  created_at: string;
}

export default function CRMContactsList() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery, statusFilter, priorityFilter]);

  async function fetchLeads() {
    if (!profile) return;

    setLoading(true);
    try {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', profile.id)
        .single();

      if (!merchantData) {
        throw new Error('Merchant not found');
      }

      const { data, error } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('merchant_id', merchantData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterLeads() {
    let filtered = [...leads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.first_name.toLowerCase().includes(query) ||
          lead.last_name.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query) ||
          lead.company?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.priority === priorityFilter);
    }

    setFilteredLeads(filtered);
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    proposal: 'bg-orange-100 text-orange-800',
    negotiation: 'bg-pink-100 text-pink-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-gray-100 text-gray-800',
  };

  const priorityColors: Record<string, string> = {
    hot: 'bg-red-100 text-red-800',
    warm: 'bg-yellow-100 text-yellow-800',
    cold: 'bg-blue-100 text-blue-800',
  };

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    won: leads.filter((l) => l.status === 'won').length,
    totalValue: leads.reduce((sum, l) => sum + l.lead_value, 0),
  };

  if (loading) {
    return (
      <DashboardLayout title="Contacts" role="merchant">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="CRM Contacts" role="merchant">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
            <p className="text-slate-600 mt-1">Manage your leads and contacts</p>
          </div>
          <Button onClick={() => navigate('/merchant/crm/contacts/new')}>
            <Plus className="w-5 h-5 mr-2" />
            Add Contact
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardBody>
              <div className="text-sm text-slate-600">Total Contacts</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-sm text-slate-600">New Leads</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{stats.new}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-sm text-slate-600">Qualified</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">{stats.qualified}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-sm text-slate-600">Total Pipeline Value</div>
              <div className="text-2xl font-bold text-green-600 mt-1">${stats.totalValue.toLocaleString()}</div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                >
                  <option value="all">All Priority</option>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">
                  {leads.length === 0 ? 'No contacts yet' : 'No contacts match your filters'}
                </p>
                {leads.length === 0 && (
                  <Button onClick={() => navigate('/merchant/crm/contacts/new')}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Contact
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => navigate(`/merchant/crm/contacts/${lead.id}`)}
                    className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">
                            {lead.first_name} {lead.last_name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[lead.priority]}`}>
                            {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600">
                          {lead.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.company && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              <span className="truncate">{lead.company}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${lead.lead_value.toLocaleString()}</span>
                          </div>
                          {lead.next_follow_up && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Follow-up: {new Date(lead.next_follow_up).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="text-slate-400">
                            Added {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
