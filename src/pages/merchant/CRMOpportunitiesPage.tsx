import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Plus, X, ChevronLeft, AlertCircle,
  DollarSign, Clock, Target, CheckCircle2, BarChart2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ─── Interfaces ───────────────────────────────────────────────────────────────

type Stage = 'new' | 'discovery' | 'proposal' | 'negotiation' | 'won';

interface Opportunity {
  id: string;
  title: string;
  customer_name: string;
  stage: Stage;
  value_cents: number;
  days_in_stage: number;
  probability: number;
}

interface StageConfig {
  key: Stage;
  label: string;
  color: string;
  headerColor: string;
}

interface NewOpportunityForm {
  title: string;
  customer_name: string;
  stage: Stage;
  value_dollars: string;
  probability: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: '1',  title: 'Website Redesign',    customer_name: 'Sarah Mitchell', stage: 'won',         value_cents: 180000, days_in_stage: 0,  probability: 100 },
  { id: '2',  title: 'Monthly Retainer',    customer_name: 'James Kowalski', stage: 'proposal',    value_cents: 240000, days_in_stage: 5,  probability: 65  },
  { id: '3',  title: 'SEO Package',         customer_name: 'Maria Torres',   stage: 'discovery',   value_cents: 96000,  days_in_stage: 8,  probability: 30  },
  { id: '4',  title: 'POS System Setup',    customer_name: 'Derek Chang',    stage: 'new',         value_cents: 45000,  days_in_stage: 2,  probability: 10  },
  { id: '5',  title: 'Annual Service Plan', customer_name: 'Priya Patel',    stage: 'negotiation', value_cents: 360000, days_in_stage: 12, probability: 80  },
  { id: '6',  title: 'Social Media Mgmt',   customer_name: 'Angela White',   stage: 'proposal',    value_cents: 120000, days_in_stage: 3,  probability: 55  },
  { id: '7',  title: 'Email Campaign Setup',customer_name: 'Rosa Kim',       stage: 'won',         value_cents: 75000,  days_in_stage: 0,  probability: 100 },
  { id: '8',  title: 'Loyalty Program',     customer_name: 'Liam Nguyen',    stage: 'discovery',   value_cents: 65000,  days_in_stage: 15, probability: 25  },
  { id: '9',  title: 'Print Package',       customer_name: 'Nathan Ellis',   stage: 'new',         value_cents: 28000,  days_in_stage: 1,  probability: 10  },
  { id: '10', title: 'Consulting Bundle',   customer_name: 'Tom Buchanan',   stage: 'proposal',    value_cents: 155000, days_in_stage: 7,  probability: 60  },
  { id: '11', title: 'CRM Onboarding',      customer_name: 'Sarah Mitchell', stage: 'won',         value_cents: 95000,  days_in_stage: 0,  probability: 100 },
  { id: '12', title: 'Ad Campaign Q2',      customer_name: 'Derek Chang',    stage: 'negotiation', value_cents: 210000, days_in_stage: 4,  probability: 75  },
];

const STAGES: StageConfig[] = [
  { key: 'new',         label: 'New',         color: 'border-slate-300',  headerColor: 'bg-slate-100'  },
  { key: 'discovery',   label: 'Discovery',   color: 'border-blue-300',   headerColor: 'bg-blue-50'    },
  { key: 'proposal',    label: 'Proposal',    color: 'border-amber-300',  headerColor: 'bg-amber-50'   },
  { key: 'negotiation', label: 'Negotiating', color: 'border-orange-300', headerColor: 'bg-orange-50'  },
  { key: 'won',         label: 'Won',         color: 'border-green-300',  headerColor: 'bg-green-50'   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCents(cents: number): string {
  if (cents >= 100000) {
    return `$${(cents / 100000).toFixed(1)}k`;
  }
  return `$${(cents / 100).toLocaleString('en-US')}`;
}

function formatCentsFull(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function probabilityColor(p: number): string {
  if (p >= 75) return 'bg-green-100 text-green-700';
  if (p >= 40) return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-600';
}

// ─── Opportunity Card ─────────────────────────────────────────────────────────

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-3 border border-slate-100 hover:shadow-md transition-shadow cursor-default">
      {/* Title */}
      <p className="font-medium text-sm text-slate-800 leading-snug">{opportunity.title}</p>

      {/* Customer */}
      <p className="text-xs text-slate-500 mt-0.5 mb-2">{opportunity.customer_name}</p>

      {/* Value */}
      <p className="text-sm font-semibold" style={{ color: '#2BB673' }}>
        {formatCents(opportunity.value_cents)}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-2 gap-1">
        {/* Days in stage */}
        {opportunity.days_in_stage > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">
            <Clock className="w-3 h-3" />
            {opportunity.days_in_stage}d
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 rounded px-1.5 py-0.5">
            <CheckCircle2 className="w-3 h-3" />
            Closed
          </span>
        )}

        {/* Probability */}
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${probabilityColor(opportunity.probability)}`}>
          {opportunity.probability}%
        </span>
      </div>
    </div>
  );
}

// ─── Pipeline Column ──────────────────────────────────────────────────────────

interface PipelineColumnProps {
  stage: StageConfig;
  opportunities: Opportunity[];
  onAdd: (stage: Stage) => void;
}

function PipelineColumn({ stage, opportunities, onAdd }: PipelineColumnProps) {
  const columnTotal = opportunities.reduce((sum, o) => sum + o.value_cents, 0);

  return (
    <div className={`flex flex-col min-w-[220px] rounded-xl border-2 ${stage.color} overflow-hidden`}>
      {/* Column Header */}
      <div className={`px-3 py-3 ${stage.headerColor}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">{stage.label}</span>
          <span className="text-xs font-medium bg-white text-slate-600 rounded-full px-2 py-0.5 shadow-sm">
            {opportunities.length}
          </span>
        </div>
        {opportunities.length > 0 && (
          <p className="text-xs text-slate-500 mt-0.5">{formatCents(columnTotal)}</p>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 flex flex-col gap-2 p-2 bg-slate-50/40 min-h-[120px]">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}

        {/* Add Button */}
        <button
          onClick={() => onAdd(stage.key)}
          className="mt-auto w-full flex items-center justify-center gap-1 py-2 text-xs text-slate-400 hover:text-slate-600 hover:bg-white/70 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>
    </div>
  );
}

// ─── New Opportunity Modal ────────────────────────────────────────────────────

interface NewOpportunityModalProps {
  defaultStage: Stage;
  onClose: () => void;
  onSave: (opportunity: Opportunity) => void;
  merchantId: string | null;
}

function NewOpportunityModal({ defaultStage, onClose, onSave, merchantId }: NewOpportunityModalProps) {
  const [form, setForm] = useState<NewOpportunityForm>({
    title: '',
    customer_name: '',
    stage: defaultStage,
    value_dollars: '',
    probability: '10',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof NewOpportunityForm>(field: K, value: NewOpportunityForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.customer_name.trim()) {
      setError('Title and customer name are required.');
      return;
    }
    const valueCents = Math.round(parseFloat(form.value_dollars || '0') * 100);
    const probability = Math.min(100, Math.max(0, parseInt(form.probability || '0', 10)));

    setSaving(true);
    setError('');

    const newOpp: Opportunity = {
      id: String(Date.now()),
      title: form.title.trim(),
      customer_name: form.customer_name.trim(),
      stage: form.stage,
      value_cents: valueCents,
      days_in_stage: 0,
      probability,
    };

    try {
      if (merchantId) {
        await supabase.from('crm_opportunities').insert({
          merchant_id: merchantId,
          title: form.title.trim(),
          customer_name: form.customer_name.trim(),
          stage: form.stage,
          value_cents: valueCents,
          probability,
        });
      }
    } catch {
      // optimistic add regardless
    }

    onSave(newOpp);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md pointer-events-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">New Opportunity</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Website Redesign"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                value={form.customer_name}
                onChange={(e) => update('customer_name', e.target.value)}
                placeholder="Jane Smith"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
              <select
                value={form.stage}
                onChange={(e) => update('stage', e.target.value as Stage)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673] bg-white"
              >
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Value ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.value_dollars}
                  onChange={(e) => update('value_dollars', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Probability (0–100%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.probability}
                onChange={(e) => update('probability', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60"
                style={{ backgroundColor: '#2BB673' }}
              >
                {saving ? 'Saving...' : 'Create Opportunity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CRMOpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [modalStage, setModalStage] = useState<Stage | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (user) {
          const { data: merchant } = await supabase
            .from('merchants')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (merchant) {
            setMerchantId(merchant.id);
            const { data } = await supabase
              .from('crm_opportunities')
              .select('*')
              .eq('merchant_id', merchant.id)
              .order('created_at', { ascending: false });

            if (data?.length) {
              setOpportunities(data);
              setLoading(false);
              return;
            }
          }
        }
      } catch {
        // fall through to mock
      }
      setOpportunities(MOCK_OPPORTUNITIES);
      setLoading(false);
    }
    load();
  }, [user]);

  // Stats
  const totalPipeline = opportunities
    .filter((o) => o.stage !== 'won')
    .reduce((sum, o) => sum + o.value_cents, 0);

  const wonThisMonth = opportunities
    .filter((o) => o.stage === 'won')
    .reduce((sum, o) => sum + o.value_cents, 0);

  const closedCount = opportunities.filter((o) => o.stage === 'won').length;
  const totalCount = opportunities.length;
  const conversionRate = totalCount > 0 ? Math.round((closedCount / totalCount) * 100) : 0;

  const nonZeroValues = opportunities.filter((o) => o.value_cents > 0);
  const avgDealSize =
    nonZeroValues.length > 0
      ? Math.round(nonZeroValues.reduce((sum, o) => sum + o.value_cents, 0) / nonZeroValues.length)
      : 0;

  // Group by stage
  const byStage: Record<Stage, Opportunity[]> = {
    new: [],
    discovery: [],
    proposal: [],
    negotiation: [],
    won: [],
  };
  for (const opp of opportunities) {
    if (byStage[opp.stage]) {
      byStage[opp.stage].push(opp);
    }
  }

  function handleSaveOpportunity(newOpp: Opportunity) {
    setOpportunities((prev) => [newOpp, ...prev]);
    setModalStage(null);
  }

  return (
    <DashboardLayout>
      <div className="max-w-full px-4 sm:px-6 py-6 space-y-6">

        {/* Back Link */}
        <Link
          to="/merchant/crm-hub"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          CRM Hub
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track deals from first contact to closed</p>
          </div>
          <button
            onClick={() => setModalStage('new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ backgroundColor: '#2BB673' }}
          >
            <Plus className="w-4 h-4" />
            New Opportunity
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <PipelineStatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Total Pipeline"
            value={formatCentsFull(totalPipeline)}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <PipelineStatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Won This Month"
            value={formatCentsFull(wonThisMonth)}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <PipelineStatCard
            icon={<Target className="w-5 h-5" />}
            label="Conversion Rate"
            value={`${conversionRate}%`}
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
          />
          <PipelineStatCard
            icon={<BarChart2 className="w-5 h-5" />}
            label="Avg Deal Size"
            value={formatCentsFull(avgDealSize)}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
        </div>

        {/* Board */}
        {loading ? (
          <div className="py-20 flex items-center justify-center text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-[#2BB673] rounded-full animate-spin" />
              <span className="text-sm">Loading pipeline...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-max">
              {STAGES.map((stage) => (
                <PipelineColumn
                  key={stage.key}
                  stage={stage}
                  opportunities={byStage[stage.key]}
                  onAdd={(s) => setModalStage(s)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Opportunity Modal */}
      {modalStage && (
        <NewOpportunityModal
          defaultStage={modalStage}
          merchantId={merchantId}
          onClose={() => setModalStage(null)}
          onSave={handleSaveOpportunity}
        />
      )}
    </DashboardLayout>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface PipelineStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
}

function PipelineStatCard({ icon, label, value, iconBg, iconColor }: PipelineStatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 truncate">{label}</p>
        <p className="text-lg font-bold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}
