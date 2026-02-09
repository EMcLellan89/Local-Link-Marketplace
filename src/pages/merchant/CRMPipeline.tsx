import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import { DollarSign, User, Calendar, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  status: string;
  lead_value: number;
  priority: string;
  next_follow_up: string | null;
}

const stages = [
  { id: 'new', name: 'New', color: 'bg-blue-500' },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-purple-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-orange-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-pink-500' },
  { id: 'won', name: 'Won', color: 'bg-green-500' },
  { id: 'lost', name: 'Lost', color: 'bg-gray-500' },
];

export default function CRMPipeline() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

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

  async function updateLeadStatus(leadId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;
      await fetchLeads();
    } catch (error: any) {
      console.error('Error updating lead:', error);
    }
  }

  function handleDragStart(leadId: string) {
    setDraggedLead(leadId);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent, newStatus: string) {
    e.preventDefault();
    if (draggedLead) {
      updateLeadStatus(draggedLead, newStatus);
      setDraggedLead(null);
    }
  }

  function getLeadsByStage(stageId: string) {
    return leads.filter((lead) => lead.status === stageId);
  }

  function getStageTotal(stageId: string) {
    return getLeadsByStage(stageId).reduce((sum, lead) => sum + lead.lead_value, 0);
  }

  const priorityColors: Record<string, string> = {
    hot: 'border-l-4 border-l-red-500',
    warm: 'border-l-4 border-l-yellow-500',
    cold: 'border-l-4 border-l-blue-500',
  };

  if (loading) {
    return (
      <DashboardLayout title="Pipeline" role="merchant">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Sales Pipeline" role="merchant">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales Pipeline</h1>
          <p className="text-slate-600 mt-1">Drag and drop deals to update their stage</p>
        </div>
        <Button onClick={() => navigate('/merchant/crm/contacts/new')}>
          <Plus className="w-5 h-5 mr-2" />
          New Deal
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="text-sm text-slate-600">Total Deals</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{leads.length}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-slate-600">Active Pipeline</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {leads.filter((l) => !['won', 'lost'].includes(l.status)).length}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-slate-600">Won This Month</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {leads.filter((l) => l.status === 'won').length}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-slate-600">Pipeline Value</div>
            <div className="text-2xl font-bold text-[#2BB673] mt-1">
              ${leads.reduce((sum, l) => sum + (l.status !== 'lost' && l.status !== 'won' ? l.lead_value : 0), 0).toLocaleString()}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <div
                key={stage.id}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className={`${stage.color} text-white p-3 rounded-t-lg`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold">{stage.name}</h3>
                    <span className="bg-white/20 px-2 py-1 rounded text-sm">
                      {stageLeads.length}
                    </span>
                  </div>
                  <div className="text-sm opacity-90">
                    ${stageTotal.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-b-lg min-h-[400px] space-y-3">
                  {stageLeads.length === 0 ? (
                    <div className="text-center text-slate-400 py-8 text-sm">
                      No deals in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead.id)}
                        onClick={() => navigate(`/merchant/crm/contacts/${lead.id}`)}
                        className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move ${priorityColors[lead.priority]}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">
                            {lead.first_name} {lead.last_name}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            lead.priority === 'hot' ? 'bg-red-100 text-red-800' :
                            lead.priority === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {lead.priority}
                          </span>
                        </div>

                        {lead.company && (
                          <div className="text-sm text-slate-600 mb-2">{lead.company}</div>
                        )}

                        <div className="flex items-center gap-1 text-sm font-semibold text-[#2BB673]">
                          <DollarSign className="w-4 h-4" />
                          {lead.lead_value.toLocaleString()}
                        </div>

                        {lead.next_follow_up && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                            <Calendar className="w-3 h-3" />
                            Follow-up: {new Date(lead.next_follow_up).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">How to use the pipeline:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Drag and drop deals between stages to update their status</li>
          <li>• Click on any deal card to view full details and edit</li>
          <li>• Pipeline value shows the total value of active (not won/lost) deals</li>
          <li>• Priority indicators show hot (red), warm (yellow), and cold (blue) leads</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
