import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DollarSign, Users, TrendingUp, ArrowRight, BookOpen, MapPin,
  Copy, Check, QrCode, Zap, Award, BarChart2, ChevronRight,
  Clock, CheckCircle2, AlertCircle, ExternalLink, Star, MessageSquare, CheckCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import TestimonialSubmitModal from '../../components/TestimonialSubmitModal';
import { DEV_MODE, MOCK_PARTNER } from '../../lib/devMode';

// ── Types ────────────────────────────────────────────────────────────────
interface PartnerData {
  id: string;
  referral_code: string;
  status: string;
  tier: string;
  slug?: string;
}

interface KpiStats {
  earningsThisMonth: number;
  pendingCommission: number;
  activeSales: number;
  conversionRate: number;
}

interface FunnelData { clicks: number; leads: number; sales: number }

interface ActivityRow {
  id: string;
  date: string;
  action: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  commission: number;
  icon: string;
}

interface PayoutStatus {
  available: number;
  pending: number;
  nextPayoutDate: string;
}

// ── Mock data ────────────────────────────────────────────────────────────
const MOCK_STATS: KpiStats = {
  earningsThisMonth: 81240,   // cents
  pendingCommission: 54000,
  activeSales: 12,
  conversionRate: 2.8,
};

const MOCK_FUNNEL: FunnelData = { clicks: 312, leads: 48, sales: 9 };

const MOCK_ACTIVITY: ActivityRow[] = [
  { id: '1', date: 'Apr 22', action: 'Merchant Signup — Pro Plan', amount: 2980, status: 'pending' },
  { id: '2', date: 'Apr 20', action: '1Hub CRM Sale', amount: 8910, status: 'approved' },
  { id: '3', date: 'Apr 18', action: 'Partner Recruit Bonus', amount: 1490, status: 'paid' },
  { id: '4', date: 'Apr 15', action: 'Marketplace Product Sale', amount: 3200, status: 'paid' },
  { id: '5', date: 'Apr 14', action: 'Recruit Override', amount: 420, status: 'pending' },
];

const MOCK_TOP_PRODUCTS: TopProduct[] = [
  { name: 'Merchant Plans', sales: 6, revenue: 74400, commission: 11160, icon: '🏪' },
  { name: '1Hub CRM',       sales: 3, revenue: 89700, commission: 26910, icon: '⚙️' },
  { name: 'CPA Plans',      sales: 2, revenue: 199400, commission: 59820, icon: '📊' },
  { name: 'AI Tools',       sales: 4, revenue: 39600, commission: 5940, icon: '🤖' },
];

const MOCK_PAYOUT: PayoutStatus = {
  available: 42000,
  pending: 18000,
  nextPayoutDate: 'May 2, 2026',
};

// ── Helpers ──────────────────────────────────────────────────────────────
const fmt = (cents: number) =>
  '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtWhole = (cents: number) =>
  '$' + (cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 });

const APP_URL = 'locallinkmarketplace.com';

// ── Sub-components ───────────────────────────────────────────────────────
function KpiCard({ title, value, sub, icon, color }: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function StatusBadge({ status }: { status: ActivityRow['status'] }) {
  const map = {
    pending:  { cls: 'bg-amber-100 text-amber-800', label: 'Pending' },
    approved: { cls: 'bg-blue-100 text-blue-800', label: 'Approved' },
    paid:     { cls: 'bg-emerald-100 text-emerald-800', label: 'Paid' },
  };
  const { cls, label } = map[status];
  return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${cls}`}>{label}</span>;
}

// ── Main component ───────────────────────────────────────────────────────
export default function PartnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [kpi, setKpi] = useState<KpiStats>(MOCK_STATS);
  const [funnel, setFunnel] = useState<FunnelData>(MOCK_FUNNEL);
  const [activity, setActivity] = useState<ActivityRow[]>(MOCK_ACTIVITY);
  const [topProducts] = useState<TopProduct[]>(MOCK_TOP_PRODUCTS);
  const [payout, setPayout] = useState<PayoutStatus>(MOCK_PAYOUT);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  useEffect(() => {
    if (user) loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;

    if (DEV_MODE) {
      setPartner({ ...MOCK_PARTNER as PartnerData, slug: 'erica123' });
      setLoading(false);
      return;
    }

    try {
      const { data: partnerData } = await supabase
        .from('partners')
        .select('id, referral_code, status, tier, slug')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!partnerData) { setLoading(false); return; }
      setPartner(partnerData as PartnerData);

      // Monthly stats
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthKey = thisMonth.toISOString().slice(0, 7) + '-01';

      const { data: stats } = await supabase
        .from('partner_dashboard_stats')
        .select('*')
        .eq('partner_id', partnerData.id)
        .eq('month', monthKey)
        .maybeSingle();

      if (stats) {
        setKpi({
          earningsThisMonth: Math.round(Number(stats.commission_earned) * 100),
          pendingCommission:  Math.round(Number(stats.pending_commission) * 100),
          activeSales:       stats.active_subscriptions,
          conversionRate:    Number(stats.conversion_rate),
        });
        setFunnel({ clicks: stats.clicks, leads: stats.leads, sales: stats.sales });
      }

      // Recent commissions as activity
      const { data: comms } = await supabase
        .from('partner_commissions')
        .select('id, created_at, commission_type, commission_amount, status')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (comms?.length) {
        setActivity(comms.map(c => ({
          id: c.id,
          date: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          action: c.commission_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          amount: Math.round(Number(c.commission_amount) * 100),
          status: c.status as ActivityRow['status'],
        })));
      }

      // Payout status
      const { data: payouts } = await supabase
        .from('partner_payouts')
        .select('payout_amount, status')
        .eq('partner_id', partnerData.id);

      const avail = payouts?.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.payout_amount), 0) || 0;
      setPayout({ available: Math.round(avail * 100), pending: 0, nextPayoutDate: 'Next Friday' });

    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PartnerHubLayout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
        </div>
      </PartnerHubLayout>
    );
  }

  if (!partner) {
    return (
      <PartnerHubLayout>
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Partner Profile</h3>
          <p className="text-slate-600 mb-4">Complete your partner application to access the dashboard.</p>
          <button
            onClick={() => navigate('/partner/apply')}
            className="bg-[#2BB673] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#22a363] transition-colors"
          >
            Apply Now
          </button>
        </div>
      </PartnerHubLayout>
    );
  }

  const slug = partner.slug || partner.referral_code || 'your-link';
  const baseUrl = `${APP_URL}/${slug}`;
  const referralLinks = [
    { label: 'Main Partner Link', url: `https://${baseUrl}`, product: null },
    { label: 'Merchant Signup',   url: `https://${baseUrl}/merchant`, product: 'merchant' },
    { label: '1Hub CRM',          url: `https://${baseUrl}/1hub`, product: '1hub' },
    { label: 'CPA Plans',         url: `https://${baseUrl}/cpa`, product: 'cpa' },
    { label: 'Partner Recruit',   url: `https://${baseUrl}/join`, product: 'join' },
  ];

  const funnelConvL = funnel.clicks > 0 ? ((funnel.leads / funnel.clicks) * 100).toFixed(1) : '0.0';
  const funnelConvS = funnel.leads > 0 ? ((funnel.sales / funnel.leads) * 100).toFixed(1) : '0.0';

  const tierLabel = (partner.tier || 'starter').charAt(0).toUpperCase() + (partner.tier || 'starter').slice(1);

  return (
    <>
    <PartnerHubLayout>
      <div className="space-y-6 pb-10">

        {/* ── Inline proof banner ── */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Partners are already earning commissions.</span>{' '}
              The average partner makes their first sale within 6 days.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-[#F5B82E] fill-[#F5B82E]" />)}
              <span className="text-xs text-slate-500 ml-1">4.9/5</span>
            </div>
            <Link to="/results" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
              See proof <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── First-result nudge (shown when no sales yet) ── */}
        {kpi.activeSales === 0 && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Made your first sale? Share it.</p>
                <p className="text-xs text-slate-500">Your win inspires other new partners to keep going.</p>
              </div>
            </div>
            <button
              onClick={() => setShowTestimonialModal(true)}
              className="flex-shrink-0 text-xs font-bold bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors"
            >
              Share My Win
            </button>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Partner Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {tierLabel} tier &nbsp;·&nbsp; Code: <span className="font-mono font-semibold text-slate-700">{partner.referral_code}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/partner/compensation"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
            >
              <BarChart2 className="w-4 h-4" /> Comp Plan
            </Link>
            <Link
              to="/academy"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Academy
            </Link>
          </div>
        </div>

        {/* ── ROW 1: KPI Strip ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            title="Earnings This Month"
            value={fmtWhole(kpi.earningsThisMonth)}
            sub="all commission types"
            icon={<DollarSign className="w-5 h-5 text-white" />}
            color="bg-emerald-500"
          />
          <KpiCard
            title="Pending Commission"
            value={fmtWhole(kpi.pendingCommission)}
            sub="in review / hold"
            icon={<Clock className="w-5 h-5 text-white" />}
            color="bg-amber-500"
          />
          <KpiCard
            title="Active Sales"
            value={String(kpi.activeSales)}
            sub="subscriptions active"
            icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            color="bg-blue-500"
          />
          <KpiCard
            title="Conversion Rate"
            value={`${kpi.conversionRate}%`}
            sub="clicks to sales"
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            color="bg-slate-700"
          />
        </div>

        {/* ── ROW 2: Performance + Quick Actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Performance section */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900">Earnings Overview</h2>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">This Month</span>
            </div>

            {/* Simplified bar chart using CSS */}
            <div className="space-y-3">
              {[
                { label: 'Merchant Memberships', value: 18600, max: 80000, color: 'bg-blue-500' },
                { label: 'Marketplace Products', value: 24300, max: 80000, color: 'bg-emerald-500' },
                { label: '1Hub CRM / CPA', value: 26910, max: 80000, color: 'bg-teal-500' },
                { label: 'Recruit Bonuses', value: 7400, max: 80000, color: 'bg-amber-500' },
                { label: 'Override Income', value: 4030, max: 80000, color: 'bg-rose-500' },
              ].map(row => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">{row.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{fmtWhole(row.value)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.color}`}
                      style={{ width: `${(row.value / row.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total This Month</p>
                <p className="text-2xl font-bold text-slate-900">{fmt(kpi.earningsThisMonth)}</p>
              </div>
              <Link
                to="/partner/earnings"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                Full Report <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2.5">
              {[
                { label: 'Copy My Link', icon: <Copy className="w-4 h-4" />, color: 'text-slate-700 border-gray-200 hover:bg-gray-50', onClick: () => navigator.clipboard.writeText(`https://${baseUrl}`) },
                { label: 'Get Marketing Kit', icon: <Star className="w-4 h-4" />, color: 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100', to: '/partner/marketing-kit' },
                { label: 'View Leads', icon: <Users className="w-4 h-4" />, color: 'text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100', to: '/partner/crm' },
                { label: 'Add Merchant', icon: <ArrowRight className="w-4 h-4" />, color: 'text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100', to: '/partner/outreach' },
                { label: 'View Comp Plan', icon: <BarChart2 className="w-4 h-4" />, color: 'text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100', to: '/partner/compensation' },
                { label: 'Academy', icon: <BookOpen className="w-4 h-4" />, color: 'text-teal-700 border-teal-200 bg-teal-50 hover:bg-teal-100', to: '/academy' },
                { label: 'Share My Win', icon: <MessageSquare className="w-4 h-4" />, color: 'text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100', onClick: () => setShowTestimonialModal(true) },
              ].map((action, i) => {
                const cls = `w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${action.color}`;
                if ('to' in action && action.to) {
                  return (
                    <Link key={i} to={action.to} className={cls}>
                      {action.icon}
                      {action.label}
                    </Link>
                  );
                }
                return (
                  <button key={i} className={cls} onClick={action.onClick}>
                    {action.icon}
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ROW 3: Funnel ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-5">Conversion Funnel</h2>
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {[
              { label: 'Clicks', value: funnel.clicks, color: 'bg-blue-100 text-blue-800 border-blue-200' },
              { label: 'Leads', value: funnel.leads, color: 'bg-amber-100 text-amber-800 border-amber-200', conv: `${funnelConvL}%` },
              { label: 'Sales', value: funnel.sales, color: 'bg-emerald-100 text-emerald-800 border-emerald-200', conv: `${funnelConvS}%` },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 flex-shrink-0">
                <div className={`flex flex-col items-center rounded-xl border px-8 py-5 ${step.color}`}>
                  <span className="text-3xl font-extrabold">{step.value.toLocaleString()}</span>
                  <span className="text-sm font-medium mt-1">{step.label}</span>
                </div>
                {i < 2 && (
                  <div className="flex flex-col items-center gap-1 px-2">
                    <span className="text-xs font-semibold text-slate-600">{'conv' in step ? step.conv : ''}</span>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            <div className="flex-1 hidden md:block" />
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-slate-500">Overall conversion</p>
              <p className="text-xl font-bold text-slate-900">
                {funnel.clicks > 0 ? ((funnel.sales / funnel.clicks) * 100).toFixed(2) : '0.00'}%
              </p>
              <p className="text-xs text-slate-400">clicks to sales</p>
            </div>
          </div>
        </div>

        {/* ── ROW 4: Referral Links ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Your Referral Links</h2>
            <button
              onClick={() => navigate('/partner/share-kit')}
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
            >
              Full Share Kit <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {referralLinks.map(link => (
              <div key={link.label} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-slate-50 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{link.label}</p>
                  <p className="text-xs text-slate-500 truncate">{link.url}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <CopyButton text={link.url} />
                  <button
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    onClick={() => navigate('/partner/share-kit')}
                  >
                    <QrCode className="w-3.5 h-3.5" /> QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 5: Recent Activity ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            <Link to="/partner/earnings" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                  <th className="text-right py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activity.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{row.date}</td>
                    <td className="py-3 pr-4 text-slate-800 font-medium">{row.action}</td>
                    <td className="py-3 pr-4 text-right font-semibold text-slate-900">{fmt(row.amount)}</td>
                    <td className="py-3 text-right"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── ROW 6: Top Products ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Top Products Sold</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topProducts.map(p => (
              <div key={p.name} className="rounded-xl bg-slate-50 border border-gray-100 p-4">
                <p className="text-2xl mb-2">{p.icon}</p>
                <p className="font-semibold text-slate-900 text-sm">{p.name}</p>
                <p className="text-xs text-slate-500 mt-1">{p.sales} sale{p.sales !== 1 ? 's' : ''}</p>
                <p className="text-emerald-600 font-bold text-sm mt-1">{fmtWhole(p.commission)}</p>
                <p className="text-xs text-slate-400">commission</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 7: Payout + Academy CTA ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Payout Status */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="font-semibold text-slate-900">Payout Status</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-slate-600">Available to Withdraw</span>
                <span className="font-bold text-emerald-600 text-lg">{fmtWhole(payout.available)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-slate-600">Pending (in hold)</span>
                <span className="font-semibold text-amber-600">{fmtWhole(payout.pending)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600">Next Payout Date</span>
                <span className="font-semibold text-slate-900">{payout.nextPayoutDate}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/partner/earnings')}
              className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              Manage Payouts
            </button>
          </div>

          {/* 1Hub CRM High-Ticket CTA */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white flex flex-col">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 text-xs font-semibold text-emerald-300 w-fit mb-4">
              <Zap className="w-3.5 h-3.5" /> High-Ticket Track
            </div>
            <h3 className="font-bold text-lg mb-2">Sell 1Hub CRM / CPA</h3>
            <p className="text-slate-300 text-sm mb-4 flex-1">
              Earn 30% recurring commission on every active account. Business CRM from $197/mo, CPA firms from $497/mo. Our highest-commission product.
            </p>
            <div className="flex flex-wrap gap-3 text-sm mb-5">
              <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full">30% recurring</span>
              <span className="bg-white/10 border border-white/20 text-white/80 px-3 py-1 rounded-full">7% override</span>
            </div>
            <Link
              to="/academy/courses/sell-1hub-crm-cpa"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-lg text-sm text-center transition-colors block"
            >
              Start 1Hub Training <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>
        </div>

        {/* ── ROW 8: Mini Leaderboard ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-slate-900">Top Partners This Month</h2>
            </div>
            <Link to="/partner/leaderboard" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              Full Board <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {[
              { rank: 1, name: 'John M.',  earnings: 824000, badge: '🥇' },
              { rank: 2, name: 'Erica T.', earnings: 590000, badge: '🥈' },
              { rank: 3, name: 'Sarah K.', earnings: 310000, badge: '🥉' },
              { rank: 4, name: 'Marcus B.',earnings: 198000, badge: '4' },
              { rank: 5, name: 'Diana L.', earnings: 142000, badge: '5' },
            ].map(row => (
              <div key={row.rank} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50">
                <span className="text-lg w-7 text-center">{row.badge}</span>
                <span className="flex-1 font-medium text-slate-900 text-sm">{row.name}</span>
                <span className="font-bold text-slate-900 text-sm">{fmtWhole(row.earnings)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 9: Partner Academy Tracks ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-900">Partner Academy</h2>
            </div>
            <Link to="/academy" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Browse All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Partner Launch Academy',
                desc: '10 modules — from signup to first sale in 7 days.',
                badge: 'Free',
                badgeCls: 'bg-emerald-100 text-emerald-800',
                to: '/academy/courses/partner-launch-academy',
                icon: '🚀',
              },
              {
                title: 'Sell 1Hub CRM / CPA',
                desc: '10 modules — earn 30% recurring on every active account.',
                badge: 'High Ticket',
                badgeCls: 'bg-amber-100 text-amber-800',
                to: '/academy/courses/sell-1hub-crm-cpa',
                icon: '💼',
              },
              {
                title: 'Selling Recurring Revenue',
                desc: 'Build a book of recurring income across all product lines.',
                badge: 'Partner',
                badgeCls: 'bg-blue-100 text-blue-800',
                to: '/academy/courses/selling-recurring-revenue',
                icon: '📈',
              },
            ].map(track => (
              <Link
                key={track.title}
                to={track.to}
                className="rounded-xl border border-gray-200 bg-slate-50 hover:bg-white hover:border-gray-300 p-4 transition-all block"
              >
                <p className="text-2xl mb-2">{track.icon}</p>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-slate-900 text-sm">{track.title}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${track.badgeCls}`}>
                    {track.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{track.desc}</p>
                <p className="text-xs text-emerald-600 font-medium mt-3 flex items-center gap-1">
                  Start Now <ArrowRight className="w-3 h-3" />
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Territory + Status bar ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active Territories</p>
              <p className="text-xl font-bold text-slate-900">2</p>
            </div>
            <Link to="/partner/territories" className="ml-auto text-xs text-blue-600 font-medium hover:underline">
              Manage
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Merchants Signed</p>
              <p className="text-xl font-bold text-slate-900">6</p>
            </div>
            <Link to="/partner/crm" className="ml-auto text-xs text-emerald-600 font-medium hover:underline">
              View
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Partner Status</p>
              <p className="text-xl font-bold text-emerald-600 capitalize">{partner.status || 'Active'}</p>
            </div>
            <Link to="/partner/billing" className="ml-auto text-xs text-amber-600 font-medium hover:underline">
              Billing
            </Link>
          </div>
        </div>

      </div>
    </PartnerHubLayout>
    {showTestimonialModal && user && (
      <TestimonialSubmitModal
        userId={user.id}
        role="partner"
        onClose={() => setShowTestimonialModal(false)}
      />
    )}
    </>
  );
}
