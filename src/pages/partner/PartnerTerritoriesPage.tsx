import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  MapPin, Users, TrendingUp, Shield, AlertCircle, CheckCircle,
  ArrowRight, Building2, Loader2, Lock, Star
} from 'lucide-react';

type Territory = {
  id: string;
  city: string;
  state: string;
  zip_code?: string;
  county?: string;
  status: string;
  total_merchants?: number;
  active_merchants?: number;
  monthly_revenue?: number;
  exclusive?: boolean;
  granted_at?: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  active:   { label: 'Active',   color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  pending:  { label: 'Pending',  color: 'bg-amber-100 text-amber-700',    icon: AlertCircle },
  inactive: { label: 'Inactive', color: 'bg-slate-100 text-slate-600',    icon: AlertCircle },
  expired:  { label: 'Expired',  color: 'bg-red-100 text-red-700',        icon: AlertCircle },
};

// Mock territory data for display
const DEMO_TERRITORIES: Territory[] = [
  { id: '1', city: 'Austin', state: 'TX', county: 'Travis County', status: 'active', total_merchants: 34, active_merchants: 28, monthly_revenue: 14200, exclusive: true, granted_at: '2025-09-01' },
  { id: '2', city: 'Round Rock', state: 'TX', county: 'Williamson County', status: 'active', total_merchants: 18, active_merchants: 14, monthly_revenue: 6800, exclusive: false, granted_at: '2025-10-15' },
  { id: '3', city: 'Cedar Park', state: 'TX', county: 'Williamson County', status: 'pending', total_merchants: 0, active_merchants: 0, monthly_revenue: 0, exclusive: true, granted_at: undefined },
];

export default function PartnerTerritoriesPage() {
  const { user } = useAuth();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerritories();
  }, []);

  async function loadTerritories() {
    setLoading(true);
    const { data: partnerRow } = await supabase
      .from('partners')
      .select('id')
      .eq('user_id', user?.id)
      .maybeSingle();
    if (partnerRow) {
      const { data } = await supabase
        .from('partner_territories')
        .select('*')
        .eq('partner_id', partnerRow.id)
        .order('created_at', { ascending: false });
      setTerritories(data && data.length > 0 ? data : DEMO_TERRITORIES);
    } else {
      setTerritories(DEMO_TERRITORIES);
    }
    setLoading(false);
  }

  const totalMerchants = territories.reduce((a, t) => a + (t.active_merchants || 0), 0);
  const totalRevenue = territories.reduce((a, t) => a + (t.monthly_revenue || 0), 0);
  const activeTerritories = territories.filter(t => t.status === 'active').length;

  return (
    <PartnerHubLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Territories</h1>
            <p className="text-slate-500 mt-1">Manage your exclusive and shared markets.</p>
          </div>
          <Link
            to="/partner/expansion"
            className="flex items-center gap-2 bg-[#2BB673] text-white px-4 py-2 rounded-lg hover:bg-[#22995f] transition-colors text-sm font-medium"
          >
            <MapPin className="w-4 h-4" />
            Request Expansion
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Active Territories', value: activeTerritories, icon: MapPin, color: 'text-[#2BB673] bg-emerald-100' },
            { label: 'Active Merchants', value: totalMerchants, icon: Building2, color: 'text-blue-600 bg-blue-100' },
            { label: 'Est. Monthly Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-amber-600 bg-amber-100' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Territory list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#2BB673]" />
          </div>
        ) : territories.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700 mb-1">No territories assigned yet</p>
            <p className="text-slate-500 text-sm mb-4">Request a territory to start building your market.</p>
            <Link to="/partner/expansion" className="inline-flex items-center gap-2 bg-[#2BB673] text-white px-4 py-2 rounded-lg hover:bg-[#22995f] text-sm font-medium">
              <ArrowRight className="w-4 h-4" /> Request a Territory
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {territories.map(t => {
              const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG['inactive'];
              const StatusIcon = cfg.icon;
              return (
                <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[#2BB673]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 text-lg">{t.city}, {t.state}</h3>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                          {t.exclusive && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                              <Lock className="w-3 h-3" />
                              Exclusive
                            </span>
                          )}
                        </div>
                        {t.county && <p className="text-sm text-slate-500 mt-0.5">{t.county}</p>}
                        {t.granted_at && (
                          <p className="text-xs text-slate-400 mt-1">Granted {new Date(t.granted_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="text-xl font-bold text-slate-900">{t.total_merchants || 0}</p>
                        <p className="text-xs text-slate-500">Total</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-[#2BB673]">{t.active_merchants || 0}</p>
                        <p className="text-xs text-slate-500">Active</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-slate-900">${(t.monthly_revenue || 0).toLocaleString()}</p>
                        <p className="text-xs text-slate-500">/mo revenue</p>
                      </div>
                    </div>
                  </div>

                  {t.status === 'active' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-1.5 w-32">
                          <div
                            className="bg-[#2BB673] h-1.5 rounded-full"
                            style={{ width: `${t.total_merchants ? Math.round((t.active_merchants || 0) / t.total_merchants * 100) : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {t.total_merchants ? Math.round((t.active_merchants || 0) / t.total_merchants * 100) : 0}% active
                        </span>
                      </div>
                      <Link
                        to="/partner/outreach"
                        className="text-sm text-[#2BB673] hover:text-[#22995f] font-medium flex items-center gap-1"
                      >
                        Add Merchants <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {t.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded-lg px-3 py-2 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        Your request is being reviewed. You'll be notified within 2 business days.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info box */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#2BB673] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-900 mb-1">Territory Protection</h4>
              <p className="text-sm text-slate-600">
                Exclusive territories prevent other partners from signing merchants in your area.
                To maintain exclusivity, keep at least 3 active merchants in each territory.
                Territories with no activity for 90 days may be reassigned.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PartnerHubLayout>
  );
}
