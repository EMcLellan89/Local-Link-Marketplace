import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, MapPin, ChevronDown, ArrowLeft,
  Cloud, Droplets, Zap, Flame, Wind, Building2,
  ShieldAlert, Phone, Clock,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';

interface Alert {
  id: string;
  title: string;
  description: string;
  alert_type: string;
  severity: string;
  issued_at: string;
  expires_at: string | null;
  community_organizations?: { name: string } | null;
}

interface Town { id: string; name: string; state: string }

const ALERT_TYPE_ICONS: Record<string, React.FC<any>> = {
  emergency: ShieldAlert,
  weather: Cloud,
  road_closure: Building2,
  snow_emergency: Cloud,
  water_ban: Droplets,
  power_outage: Zap,
  evacuation: Wind,
  shelter: Building2,
  health: AlertTriangle,
  fire: Flame,
  flood: Droplets,
  other: AlertTriangle,
};

const SEVERITY_STYLES: Record<string, { banner: string; badge: string; icon: string }> = {
  info:     { banner: 'bg-blue-50 border-blue-400',    badge: 'bg-blue-100 text-blue-800',   icon: 'text-blue-500' },
  warning:  { banner: 'bg-amber-50 border-amber-500',  badge: 'bg-amber-100 text-amber-800', icon: 'text-amber-500' },
  critical: { banner: 'bg-red-50 border-red-600',      badge: 'bg-red-100 text-red-800',     icon: 'text-red-600' },
};

const MOCK_ALERTS: Alert[] = [
  { id: '1', title: 'Stage 2 Water Restriction in Effect', description: 'Due to ongoing drought conditions, outdoor water use is now restricted to odd/even house number days. Sprinklers and hoses are prohibited except for vegetable gardens between 5–8 PM. Violations subject to fines up to $200.', alert_type: 'water_ban', severity: 'warning', issued_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), expires_at: null, community_organizations: { name: 'Pepperell DPW' } },
  { id: '2', title: 'Road Closure: Bridge Street Bridge', description: 'Bridge Street bridge over Nashua River is closed for emergency structural repairs. Expected duration: 3–5 weeks. Detour via Main Street and Hollis Street.', alert_type: 'road_closure', severity: 'warning', issued_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), expires_at: null, community_organizations: { name: 'Pepperell DPW' } },
  { id: '3', title: 'Cooling Center Open This Weekend', description: 'With temperatures expected to reach 97°F this weekend, the Pepperell Senior Center will be open as a cooling center Saturday and Sunday 10 AM – 6 PM. Free water and air conditioning available to all residents.', alert_type: 'health', severity: 'info', issued_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), community_organizations: { name: 'Pepperell Board of Health' } },
];

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 };

export default function EmergencyAlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [towns, setTowns] = useState<Town[]>([]);
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showTownDrop, setShowTownDrop] = useState(false);

  useEffect(() => {
    supabase.from('community_towns').select('id,name,state').eq('is_active', true).order('name').then(({ data }) => {
      if (data?.length) { setTowns(data); setSelectedTown(data.find((t: Town) => t.name === 'Pepperell') || data[0]); }
    });
  }, []);

  useEffect(() => {
    if (!selectedTown) return;
    supabase.from('emergency_alerts').select('*, community_organizations(name)').eq('town_id', selectedTown.id).eq('is_active', true).then(({ data }) => {
      if (data?.length) setAlerts(data.sort((a: Alert, b: Alert) => (SEVERITY_ORDER[a.severity as keyof typeof SEVERITY_ORDER] ?? 2) - (SEVERITY_ORDER[b.severity as keyof typeof SEVERITY_ORDER] ?? 2)));
    });
  }, [selectedTown]);

  const formatIssued = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-2xl p-8 text-white">
          <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-red-200 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-6 h-6 text-red-300" />
                <span className="text-red-200 text-sm font-semibold uppercase tracking-wider">Emergency & Public Alerts</span>
              </div>
              <h1 className="text-3xl font-bold">Active Alerts for {selectedTown?.name}</h1>
              <p className="text-red-100 mt-1">
                {alerts.length === 0 ? 'No active alerts. All clear.' : `${alerts.length} active alert${alerts.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="relative">
              <button onClick={() => setShowTownDrop(!showTownDrop)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2.5 rounded-xl text-white font-medium transition-colors">
                <MapPin className="w-4 h-4 text-red-300" />{selectedTown?.name || 'Select Town'}, {selectedTown?.state}<ChevronDown className="w-4 h-4" />
              </button>
              {showTownDrop && (
                <div className="absolute top-full mt-2 right-0 w-60 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto">
                  {towns.map(t => <button key={t.id} onClick={() => { setSelectedTown(t); setShowTownDrop(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-900 hover:bg-slate-50">{t.name}, {t.state}</button>)}
                </div>
              )}
            </div>
          </div>
        </div>

        {alerts.length === 0 ? (
          <Card variant="bordered">
            <CardBody className="text-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">All Clear</h3>
              <p className="text-slate-500">No active emergency alerts for {selectedTown?.name}. Stay safe!</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => {
              const styles = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.warning;
              const Icon = ALERT_TYPE_ICONS[alert.alert_type] || AlertTriangle;
              return (
                <div key={alert.id} className={`border-l-4 rounded-2xl p-6 ${styles.banner}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white ${styles.icon}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="font-bold text-slate-900 text-lg">{alert.title}</h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${styles.badge}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                          {alert.alert_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Issued {formatIssued(alert.issued_at)}
                        </div>
                        {alert.expires_at && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Expires {new Date(alert.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                        {alert.community_organizations && (
                          <div className="flex items-center gap-1.5 font-medium">
                            <Building2 className="w-3.5 h-3.5" />
                            {alert.community_organizations.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Emergency contacts */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-slate-600" />
            Emergency Contacts for {selectedTown?.name}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Police (Non-Emergency)', number: '978-433-2121' },
              { label: 'Fire / EMS', number: '978-433-2291' },
              { label: 'DPW (Public Works)', number: '978-433-0340' },
              { label: 'Town Hall', number: '978-433-0333' },
              { label: 'Board of Health', number: '978-433-0332' },
              { label: 'Emergency (All)', number: '911' },
            ].map(({ label, number }) => (
              <a
                key={label}
                href={`tel:${number.replace(/[^0-9]/g, '')}`}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
              >
                <span className="text-sm text-slate-700 font-medium">{label}</span>
                <span className="text-sm font-bold text-[#2BB673] group-hover:underline">{number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
