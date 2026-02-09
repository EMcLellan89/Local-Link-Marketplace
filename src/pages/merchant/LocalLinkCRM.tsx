import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  FileText,
  Zap,
  BarChart3,
  Settings
} from 'lucide-react';

interface CRMStats {
  total_contacts: number;
  total_deals: number;
  total_deal_value: number;
  won_deals: number;
  activities_today: number;
  overdue_tasks: number;
}

interface SubscriptionStatus {
  is_active: boolean;
  tier_name: string;
  contact_limit: number;
  contact_count: number;
  ai_credits_remaining: number;
  books_tier: string;
}

export default function LocalLinkCRM() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCRMData();
  }, [user]);

  async function loadCRMData() {
    if (!user) return;

    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!merchant) {
        setLoading(false);
        return;
      }

      const [statsResult, subResult] = await Promise.all([
        supabase.rpc('get_ll_crm_dashboard_stats', { merchant_id_input: merchant.id }),
        supabase.rpc('get_ll_crm_subscription_status', { merchant_id_input: merchant.id })
      ]);

      if (statsResult.data) setStats(statsResult.data[0]);
      if (subResult.data) setSubscription(subResult.data[0]);

    } catch (error) {
      console.error('Error loading CRM data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your CRM...</p>
        </div>
      </div>
    );
  }

  if (!subscription?.is_active) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Local-Link CRM</h2>
          <p className="text-gray-600 mb-6">
            CRM is included with all tier subscriptions. Upgrade your tier to access full CRM features.
          </p>
          <Link
            to="/merchant/upgrade"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Tier Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Local-Link CRM</h1>
              <p className="mt-1 text-sm text-gray-600">
                {subscription.tier_name} • {subscription.contact_count} / {subscription.contact_limit} contacts used
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/merchant/crm/settings"
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              {subscription.ai_credits_remaining > 0 && (
                <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    {subscription.ai_credits_remaining} AI Credits
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Contacts"
            value={stats?.total_contacts || 0}
            color="blue"
            link="/merchant/crm/contacts"
          />
          <StatCard
            icon={Target}
            label="Active Deals"
            value={stats?.total_deals || 0}
            color="green"
            link="/merchant/crm/deals"
          />
          <StatCard
            icon={DollarSign}
            label="Pipeline Value"
            value={`$${((stats?.total_deal_value || 0) / 100).toLocaleString()}`}
            color="emerald"
            link="/merchant/crm/deals"
          />
          <StatCard
            icon={TrendingUp}
            label="Won Deals"
            value={stats?.won_deals || 0}
            color="purple"
            link="/merchant/crm/reports"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <QuickActionCard
                  icon={Users}
                  title="Add Contact"
                  description="Create a new contact"
                  link="/merchant/crm/contacts/new"
                  color="blue"
                />
                <QuickActionCard
                  icon={Target}
                  title="Create Deal"
                  description="Start a new sales opportunity"
                  link="/merchant/crm/deals/new"
                  color="green"
                />
                <QuickActionCard
                  icon={FileText}
                  title="Send Invoice"
                  description="Create and send an invoice"
                  link="/merchant/crm/invoices/new"
                  color="orange"
                />
                <QuickActionCard
                  icon={Mail}
                  title="Email Campaign"
                  description="Send email to contacts"
                  link="/merchant/crm/campaigns"
                  color="purple"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <Link
                  to="/merchant/crm/activities"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </Link>
              </div>
              <p className="text-gray-500 text-sm">No recent activities to display.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Today's Tasks</h3>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-gray-900">{stats?.activities_today || 0}</p>
                <p className="text-sm text-gray-600 mt-1">activities scheduled</p>
              </div>
              {(stats?.overdue_tasks || 0) > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    {stats?.overdue_tasks} overdue tasks
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-sm p-6 text-white">
              <Zap className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg mb-2">AI Features</h3>
              <p className="text-blue-100 text-sm mb-4">
                Supercharge your CRM with AI-powered tools
              </p>
              <Link
                to="/merchant/crm/ai-features"
                className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
              >
                Explore AI Tools
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Books Integration</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {subscription.books_tier === 'pro' ? 'Books Pro' : 'Books Lite'} is included with your plan
              </p>
              <Link
                to="/merchant/crm/books"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Open Books →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  link: string;
}

function StatCard({ icon: Icon, label, value, color, link }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <Link to={link} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </Link>
  );
}

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  color: string;
}

function QuickActionCard({ icon: Icon, title, description, link, color }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
  };

  return (
    <Link
      to={link}
      className="group border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition"
    >
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-3 transition`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
