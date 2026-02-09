import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Award, Calendar, PieChart } from 'lucide-react';

interface Lead {
  id: string;
  status: string;
  lead_value: number;
  lead_source: string;
  priority: string;
  created_at: string;
  converted_date: string | null;
}

export default function CRMReports() {
  const { profile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

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
        .eq('merchant_id', merchantData.id);

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }

  const stats = {
    totalLeads: leads.length,
    wonDeals: leads.filter((l) => l.status === 'won').length,
    lostDeals: leads.filter((l) => l.status === 'lost').length,
    activeDeals: leads.filter((l) => !['won', 'lost'].includes(l.status)).length,
    totalValue: leads.reduce((sum, l) => sum + l.lead_value, 0),
    wonValue: leads.filter((l) => l.status === 'won').reduce((sum, l) => sum + l.lead_value, 0),
    pipelineValue: leads.filter((l) => !['won', 'lost'].includes(l.status)).reduce((sum, l) => sum + l.lead_value, 0),
    conversionRate: leads.length > 0 ? ((leads.filter((l) => l.status === 'won').length / leads.length) * 100).toFixed(1) : 0,
  };

  const sourceBreakdown = leads.reduce((acc, lead) => {
    acc[lead.lead_source] = (acc[lead.lead_source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusBreakdown = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityBreakdown = leads.reduce((acc, lead) => {
    acc[lead.priority] = (acc[lead.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <DashboardLayout title="Reports" role="merchant">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="CRM Reports" role="merchant">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">CRM Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">Track your sales performance and metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">Total Leads</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{stats.totalLeads}</div>
                </div>
                <Users className="w-8 h-8 text-slate-400" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">Won Deals</div>
                  <div className="text-2xl font-bold text-green-600 mt-1">{stats.wonDeals}</div>
                </div>
                <Award className="w-8 h-8 text-green-400" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">Conversion Rate</div>
                  <div className="text-2xl font-bold text-[#2BB673] mt-1">{stats.conversionRate}%</div>
                </div>
                <Target className="w-8 h-8 text-[#2BB673]" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">Total Revenue</div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">${stats.wonValue.toLocaleString()}</div>
                </div>
                <DollarSign className="w-8 h-8 text-blue-400" />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="font-bold flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Pipeline Breakdown
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-slate-700">Active Deals</span>
                  <span className="font-bold text-slate-900">{stats.activeDeals}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-slate-700">Won Deals</span>
                  <span className="font-bold text-green-700">{stats.wonDeals}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-slate-700">Lost Deals</span>
                  <span className="font-bold text-red-700">{stats.lostDeals}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Pipeline Value</span>
                  <span className="font-bold text-[#2BB673]">${stats.pipelineValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-600">Total Value</span>
                  <span className="font-bold text-slate-900">${stats.totalValue.toLocaleString()}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-bold">Lead Sources</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {Object.entries(sourceBreakdown).map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-slate-700 capitalize">{source}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-[#2BB673] h-2 rounded-full"
                          style={{ width: `${(count / stats.totalLeads) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="font-bold">Status Distribution</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {Object.entries(statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                    <span className="text-slate-700 capitalize">{status}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-bold">Priority Distribution</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {Object.entries(priorityBreakdown).map(([priority, count]) => (
                  <div key={priority} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                    <span className="text-slate-700 capitalize">{priority}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
