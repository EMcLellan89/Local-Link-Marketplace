import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  DollarSign, TrendingUp, MousePointerClick, Share2,
  Copy, CheckCircle, ExternalLink, Package
} from 'lucide-react';

export default function PartnerDealsHub() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [dealLinks, setDealLinks] = useState<Map<string, any>>(new Map());
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    totalCommission: 0
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPartnerData();
    }
  }, [user]);

  async function loadPartnerData() {
    try {
      // Get partner info
      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!partnerData) {
        throw new Error('Partner not found');
      }

      setPartner(partnerData);

      // Load deals and bundles
      const [dealsRes, bundlesRes] = await Promise.all([
        supabase
          .from('business_deals')
          .select('*, vendor:vendors(name, logo_url)')
          .eq('status', 'active')
          .order('featured', { ascending: false }),
        supabase
          .from('deal_bundles')
          .select('*')
          .eq('status', 'active')
          .order('featured', { ascending: false })
      ]);

      setDeals(dealsRes.data || []);
      setBundles(bundlesRes.data || []);

      // Load partner's tracking links
      const { data: linksData } = await supabase
        .from('partner_deal_links')
        .select('*')
        .eq('partner_id', partnerData.id);

      const linksMap = new Map();
      let totalClicks = 0;
      let totalConversions = 0;
      let totalRevenue = 0;
      let totalCommission = 0;

      linksData?.forEach(link => {
        linksMap.set(link.deal_id || link.bundle_id, link);
        totalClicks += link.click_count || 0;
        totalConversions += link.conversion_count || 0;
        totalRevenue += link.total_revenue_cents || 0;
        totalCommission += link.total_commission_cents || 0;
      });

      setDealLinks(linksMap);
      setStats({
        totalClicks,
        totalConversions,
        totalRevenue,
        totalCommission
      });

    } catch (error) {
      console.error('Error loading partner data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function generateTrackingLink(dealId: string, isBundle: boolean = false) {
    if (!partner) return null;

    try {
      // Check if link already exists
      const existingLink = dealLinks.get(dealId);
      if (existingLink) {
        return existingLink.custom_url || `${window.location.origin}/marketplace/deals/ref/${existingLink.tracking_code}`;
      }

      // Generate new tracking code
      const trackingCode = `${partner.referral_code}-${dealId.substring(0, 8)}-${Date.now()}`;

      const { data, error } = await supabase
        .from('partner_deal_links')
        .insert({
          partner_id: partner.id,
          deal_id: isBundle ? null : dealId,
          bundle_id: isBundle ? dealId : null,
          tracking_code: trackingCode,
          custom_url: `${window.location.origin}/marketplace/${isBundle ? 'bundles' : 'deals'}/ref/${trackingCode}`
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const newMap = new Map(dealLinks);
      newMap.set(dealId, data);
      setDealLinks(newMap);

      return data.custom_url;
    } catch (error) {
      console.error('Error generating tracking link:', error);
      return null;
    }
  }

  async function copyTrackingLink(dealId: string, isBundle: boolean = false) {
    const link = await generateTrackingLink(dealId, isBundle);
    if (link) {
      await navigator.clipboard.writeText(link);
      setCopiedId(dealId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Deals Hub</h1>
        <p className="text-gray-600 mt-2">
          Share deals, earn commissions. Track your performance below.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          icon={<MousePointerClick className="h-6 w-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Conversions"
          value={stats.totalConversions.toLocaleString()}
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 100).toFixed(0)}`}
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="My Commission"
          value={`$${(stats.totalCommission / 100).toFixed(0)}`}
          icon={<DollarSign className="h-6 w-6 text-orange-600" />}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
              Individual Deals ({deals.length})
            </button>
            <button className="border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Bundle Packages ({bundles.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const linkData = dealLinks.get(deal.id);
          const conversionRate = linkData?.click_count > 0
            ? ((linkData.conversion_count / linkData.click_count) * 100).toFixed(1)
            : '0.0';

          return (
            <div key={deal.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {/* Image */}
              <div className="relative h-40 bg-gray-200">
                <img
                  src={deal.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                {deal.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                    FEATURED
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                  {deal.partner_commission_percent}% Commission
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-gray-600 mb-1">{deal.vendor?.name}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{deal.title}</h3>

                {/* Performance Stats */}
                {linkData && (
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Clicks</p>
                      <p className="text-lg font-bold text-gray-900">{linkData.click_count}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Sales</p>
                      <p className="text-lg font-bold text-green-600">{linkData.conversion_count}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Conv.</p>
                      <p className="text-lg font-bold text-blue-600">{conversionRate}%</p>
                    </div>
                  </div>
                )}

                {/* Commission Info */}
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-600">
                      ${((deal.deal_price_cents * deal.partner_commission_percent) / 10000).toFixed(2)}
                    </span> per sale
                  </p>
                  {linkData && linkData.total_commission_cents > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      Total earned: ${(linkData.total_commission_cents / 100).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => copyTrackingLink(deal.id, false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    {copiedId === deal.id ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <Link
                    to={`/marketplace/deals/${deal.slug}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8">
        <div className="flex items-start gap-4">
          <Share2 className="h-8 w-8 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">How to Share Deals</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Click "Copy Link" on any deal to get your unique tracking link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Share the link with your merchants via email, social media, or in person</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Track your clicks, conversions, and earnings in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Get paid {partner?.commission_rate || 30}% commission on every sale automatically</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
