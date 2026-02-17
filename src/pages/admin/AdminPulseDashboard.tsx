import { useEffect, useState } from 'react';
import {
  Zap,
  DollarSign,
  Users,
  TrendingUp,
  MapPin,
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  Activity,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';

export default function AdminPulseDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCities: 0,
    activeCities: 0,
    totalBoostsRevenue: 0,
    performanceSubscriptions: 0,
    performanceRevenue: 0,
    totalClaims: 0,
    totalPoints: 0,
    activeDeals: 0,
    activeBoostedDeals: 0,
  });
  const [cities, setCities] = useState<any[]>([]);
  const [recentBoosts, setRecentBoosts] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // Get city stats
      const { data: citiesData } = await supabase
        .from('pulse_cities')
        .select('*')
        .order('name');

      setCities(citiesData || []);

      const totalCities = citiesData?.length || 0;
      const activeCities =
        citiesData?.filter((c) => c.status === 'pilot' || c.status === 'public').length || 0;

      // Get boost revenue
      const { data: boosts } = await supabase
        .from('pulse_boosts')
        .select('price_cents');

      const totalBoostsRevenue = (boosts || []).reduce(
        (sum, b) => sum + (b.price_cents || 0),
        0
      );

      // Get performance subscriptions
      const { data: perfSubs } = await supabase
        .from('pulse_performance_subscriptions')
        .select('price_cents, status')
        .eq('status', 'active');

      const performanceSubscriptions = perfSubs?.length || 0;
      const performanceRevenue = (perfSubs || []).reduce(
        (sum, s) => sum + (s.price_cents || 0),
        0
      );

      // Get claims and points
      const { data: claims } = await supabase.from('pulse_claims').select('points_awarded');

      const totalClaims = claims?.length || 0;
      const totalPoints = (claims || []).reduce(
        (sum, c) => sum + (c.points_awarded || 0),
        0
      );

      // Get deals stats
      const { data: deals } = await supabase
        .from('deals')
        .select('id, boost_type, boost_expires_at')
        .eq('status', 'active');

      const activeDeals = deals?.length || 0;
      const activeBoostedDeals =
        deals?.filter(
          (d) =>
            d.boost_type !== 'none' &&
            d.boost_expires_at &&
            new Date(d.boost_expires_at) > new Date()
        ).length || 0;

      setStats({
        totalCities,
        activeCities,
        totalBoostsRevenue,
        performanceSubscriptions,
        performanceRevenue,
        totalClaims,
        totalPoints,
        activeDeals,
        activeBoostedDeals,
      });

      // Get recent boosts
      const { data: recentBoostsData } = await supabase
        .from('pulse_boosts')
        .select(
          `
          *,
          merchants(business_name),
          deals(title)
        `
        )
        .order('purchased_at', { ascending: false })
        .limit(10);

      setRecentBoosts(recentBoostsData || []);

      // Get top performers (most points)
      const { data: topPerformersData } = await supabase
        .from('customers')
        .select('id, first_name, last_name, lifetime_points, city')
        .order('lifetime_points', { ascending: false })
        .limit(10);

      setTopPerformers(topPerformersData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const handleActivateCity = async (cityId: string) => {
    try {
      const { error } = await supabase
        .from('pulse_cities')
        .update({ status: 'public' })
        .eq('id', cityId);

      if (error) throw error;

      alert('City activated successfully!');
      loadDashboard();
    } catch (error) {
      console.error('Error activating city:', error);
      alert('Failed to activate city');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Pulse Admin Dashboard</h1>
          </div>
          <p className="text-slate-300">System-wide Pulse management and analytics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Revenue Stats */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Revenue Overview</h2>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-[#2BB673]" />
                <span className="text-2xl font-bold text-slate-900">
                  ${(stats.totalBoostsRevenue / 100).toFixed(0)}
                </span>
              </div>
              <p className="text-sm text-slate-600">Boost Sales</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">
                  ${((stats.performanceRevenue / 100) * 12).toFixed(0)}
                </span>
              </div>
              <p className="text-sm text-slate-600">Performance ARR</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {stats.performanceSubscriptions}
                </span>
              </div>
              <p className="text-sm text-slate-600">Performance Subs</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-amber-600" />
                <span className="text-2xl font-bold text-slate-900">
                  ${((stats.totalBoostsRevenue + stats.performanceRevenue * 12) / 100).toFixed(0)}
                </span>
              </div>
              <p className="text-sm text-slate-600">Total Revenue</p>
            </CardBody>
          </Card>
        </div>

        {/* Engagement Stats */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Engagement Metrics</h2>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">{stats.totalClaims}</span>
              </div>
              <p className="text-sm text-slate-600">Total Claims</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-amber-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {stats.totalPoints.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600">Points Awarded</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-slate-600" />
                <span className="text-2xl font-bold text-slate-900">{stats.activeDeals}</span>
              </div>
              <p className="text-sm text-slate-600">Active Deals</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8 text-rose-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {stats.activeBoostedDeals}
                </span>
              </div>
              <p className="text-sm text-slate-600">Boosted Deals</p>
            </CardBody>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Cities Management */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Cities ({stats.totalCities})</h2>
            <div className="space-y-3">
              {cities.map((city) => (
                <Card key={city.id} variant="bordered">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-slate-600" />
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {city.name}, {city.state}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {city.merchant_count || 0} merchants · {city.active_deal_count || 0}{' '}
                            deals
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {city.status === 'pilot' && (
                          <>
                            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">
                              PILOT
                            </span>
                            <Button size="sm" onClick={() => handleActivateCity(city.id)}>
                              Activate
                            </Button>
                          </>
                        )}
                        {city.status === 'public' && (
                          <span className="bg-[#2BB673] text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            PUBLIC
                          </span>
                        )}
                        {city.status === 'inactive' && (
                          <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            INACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Boosts */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Boost Purchases</h2>
            <div className="space-y-3">
              {recentBoosts.length === 0 ? (
                <Card variant="bordered">
                  <CardBody className="text-center py-8">
                    <Zap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-600">No boosts purchased yet</p>
                  </CardBody>
                </Card>
              ) : (
                recentBoosts.map((boost) => (
                  <Card key={boost.id} variant="bordered">
                    <CardBody className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {boost.merchants?.business_name}
                          </h3>
                          <p className="text-sm text-slate-600">{boost.deals?.title}</p>
                        </div>
                        <span className="text-lg font-bold text-[#2BB673]">
                          ${(boost.price_cents / 100).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                          {boost.boost_type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(boost.purchased_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Top Performers (All-Time)</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topPerformers.map((customer, index) => (
            <Card key={customer.id} variant="bordered">
              <CardBody className="p-4">
                <div className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-lg mb-2 ${
                      index === 0
                        ? 'bg-amber-500 text-white'
                        : index === 1
                        ? 'bg-slate-400 text-white'
                        : index === 2
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {customer.first_name} {customer.last_name?.[0]}.
                  </h3>
                  <p className="text-xs text-slate-600 mb-2">{customer.city || 'Unknown'}</p>
                  <div className="flex items-center justify-center gap-1">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-slate-900">
                      {customer.lifetime_points.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
