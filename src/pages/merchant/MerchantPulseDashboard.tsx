import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Award,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BOOST_PRICING,
  PERFORMANCE_PRICING,
  hasPerformanceSubscription,
  getMerchantMilestones,
} from '../../lib/pulse';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';

export default function MerchantPulseDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [hasPerformance, setHasPerformance] = useState(false);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalClaims: 0,
    activeBoostedDeals: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;

    try {
      // Get merchant ID
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id, performance_enabled')
        .eq('user_id', user.id)
        .single();

      if (!merchant) {
        setLoading(false);
        return;
      }

      setMerchantId(merchant.id);

      // Check Performance subscription
      const performance = await hasPerformanceSubscription(merchant.id);
      setHasPerformance(performance);

      // Load deals with Pulse stats
      const { data: dealsData } = await supabase
        .from('deals')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false });

      setDeals(dealsData || []);

      // Calculate stats
      const totalViews = (dealsData || []).reduce((sum, d) => sum + (d.view_count || 0), 0);
      const totalClaims = (dealsData || []).reduce((sum, d) => sum + (d.claim_count || 0), 0);
      const activeBoosted = (dealsData || []).filter(
        (d) =>
          d.boost_type !== 'none' &&
          d.boost_expires_at &&
          new Date(d.boost_expires_at) > new Date()
      ).length;

      setStats({
        totalViews,
        totalClaims,
        activeBoostedDeals: activeBoosted,
        totalRevenue: 0, // TODO: Calculate from purchases
      });

      // Load milestones
      const milestonesData = await getMerchantMilestones(merchant.id);
      setMilestones(milestonesData);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const handlePurchaseBoost = async (dealId: string, boostType: string) => {
    // TODO: Create Stripe checkout session
    alert(`Boost purchase flow coming soon! Deal: ${dealId}, Type: ${boostType}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading Pulse Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2BB673] to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Pulse Dashboard</h1>
          </div>
          <p className="text-emerald-50 text-lg">
            Amplify your reach. Drive more revenue. Get discovered.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">{stats.totalViews}</span>
              </div>
              <p className="text-sm text-slate-600">Total Views</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-[#2BB673]" />
                <span className="text-2xl font-bold text-slate-900">{stats.totalClaims}</span>
              </div>
              <p className="text-sm text-slate-600">Total Claims</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-8 h-8 text-amber-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {stats.activeBoostedDeals}
                </span>
              </div>
              <p className="text-sm text-slate-600">Active Boosts</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-rose-600" />
                <span className="text-2xl font-bold text-slate-900">
                  ${(stats.totalRevenue / 100).toFixed(0)}
                </span>
              </div>
              <p className="text-sm text-slate-600">Revenue Generated</p>
            </CardBody>
          </Card>
        </div>

        {/* Performance Subscription Upsell */}
        {!hasPerformance && (
          <Card variant="bordered" className="mb-8 border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500 rounded-full p-3">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Unlock Pulse Performance™
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Get AI-powered Growth Coach, priority boost pricing, advanced analytics, and more.
                    Starting at $149/mo for partners, $199/mo standard.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="primary">
                      Learn More
                    </Button>
                    <Button variant="outline">
                      Watch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Boost Options */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#2BB673]" />
              Boost Your Deals
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <BoostCard
                title="Standard 7-Day Boost"
                price={BOOST_PRICING.standard_7day}
                description="Increase visibility for 7 days with priority placement"
                multiplier="5x"
                color="blue"
                icon={<TrendingUp className="w-6 h-6" />}
              />

              <BoostCard
                title="Flash Friday"
                price={BOOST_PRICING.flash_friday}
                description="Premium Friday placement with Flash Friday badge"
                multiplier="10x"
                color="amber"
                icon={<Zap className="w-6 h-6" />}
              />

              <BoostCard
                title="Homepage Featured"
                price={BOOST_PRICING.homepage_featured}
                description="Top placement on homepage for 7 days"
                multiplier="15x"
                color="purple"
                icon={<Star className="w-6 h-6" />}
              />

              <BoostCard
                title="Push Blast"
                price={BOOST_PRICING.push_blast}
                description="Push notification to all users + homepage featured"
                multiplier="20x"
                color="rose"
                icon={<Sparkles className="w-6 h-6" />}
              />
            </div>

            {/* Active Deals */}
            <h3 className="text-xl font-bold text-slate-900 mb-4">Your Active Deals</h3>
            {deals.length === 0 ? (
              <Card variant="bordered">
                <CardBody className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No deals yet
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Create your first deal to start using Pulse boosts
                  </p>
                  <Button onClick={() => navigate('/merchant/deals/new')}>
                    Create Deal
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-4">
                {deals.map((deal) => (
                  <DealPerformanceCard
                    key={deal.id}
                    deal={deal}
                    onBoost={(boostType) => handlePurchaseBoost(deal.id, boostType)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Milestones */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#2BB673]" />
              Milestones
            </h2>

            <div className="space-y-3">
              {milestones.map((milestone) => (
                <Card key={milestone.id} variant="bordered">
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      {milestone.progress?.completed ? (
                        <CheckCircle className="w-6 h-6 text-[#2BB673] flex-shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {milestone.name}
                        </h4>
                        <p className="text-xs text-slate-600 mb-2">
                          {milestone.description}
                        </p>
                        {!milestone.progress?.completed && (
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-[#2BB673] h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((milestone.progress?.current_value || 0) /
                                    (milestone.target_value || 1)) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Boost Card Component
function BoostCard({
  title,
  price,
  description,
  multiplier,
  color,
  icon,
}: {
  title: string;
  price: number;
  description: string;
  multiplier: string;
  color: string;
  icon: React.ReactNode;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    rose: 'bg-rose-50 border-rose-200 text-rose-600',
  };

  return (
    <Card variant="bordered" className="hover:shadow-lg transition-shadow">
      <CardBody className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
          <span className="text-2xl font-bold text-slate-900">
            ${(price / 100).toFixed(0)}
          </span>
        </div>
        <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-600 mb-3">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#2BB673]">{multiplier} visibility</span>
          <Button size="sm" variant="outline">
            Select
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

// Deal Performance Card
function DealPerformanceCard({
  deal,
  onBoost,
}: {
  deal: any;
  onBoost: (boostType: string) => void;
}) {
  const hasActiveBoost =
    deal.boost_type !== 'none' &&
    deal.boost_expires_at &&
    new Date(deal.boost_expires_at) > new Date();

  const boostLabel = hasActiveBoost ? {
    standard_7day: { text: 'SPONSORED', color: 'bg-blue-600' },
    flash_friday: { text: 'FLASH FRIDAY', color: 'bg-amber-600' },
    homepage_featured: { text: 'FEATURED', color: 'bg-purple-600' },
    push_blast: { text: 'TRENDING', color: 'bg-rose-600' },
  }[deal.boost_type] : null;

  return (
    <Card variant="bordered">
      <CardBody className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-slate-900">{deal.title}</h4>
              {boostLabel && (
                <span
                  className={`${boostLabel.color} text-white text-xs font-bold px-2 py-1 rounded`}
                >
                  {boostLabel.text}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-3">{deal.short_description}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-1 text-slate-600">
              <Eye className="w-4 h-4" />
              <span className="text-xs">Views</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{deal.view_count || 0}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-slate-600">
              <Users className="w-4 h-4" />
              <span className="text-xs">Claims</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{deal.claim_count || 0}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-slate-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Conversion</span>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {deal.view_count > 0
                ? ((deal.claim_count / deal.view_count) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
        </div>

        {hasActiveBoost ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Active boost until</span>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">
                {new Date(deal.boost_expires_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onBoost('standard_7day')}
          >
            Boost This Deal
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
