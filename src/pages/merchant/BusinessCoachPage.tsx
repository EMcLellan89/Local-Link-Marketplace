import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, Lightbulb, Users, DollarSign, BarChart, Briefcase, ArrowRight, CheckCircle, Calendar, MessageSquare, Award, Rocket } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface CoachingPackage {
  id: string;
  name: string;
  description: string;
  session_count: number;
  duration_weeks: number;
  price_cents: number;
  features: string[];
}

export default function BusinessCoachPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<CoachingPackage[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const { data: packagesData } = await supabase
        .from('business_coaching_packages')
        .select('*')
        .eq('is_active', true)
        .order('price_cents', { ascending: true });

      if (packagesData) {
        setPackages(packagesData);
      }

      if (user) {
        const { data: merchant } = await supabase
          .from('merchants')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (merchant) {
          const { data: bookingsData } = await supabase
            .from('business_coaching_bookings')
            .select('*, business_coaching_packages(*)')
            .eq('entity_type', 'merchant')
            .eq('entity_id', merchant.id)
            .order('created_at', { ascending: false });

          setMyBookings(bookingsData || []);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const coachingAreas = [
    {
      icon: TrendingUp,
      title: 'Growth Strategy',
      description: 'Develop actionable plans to scale your business, increase revenue, and expand your market reach.',
    },
    {
      icon: Lightbulb,
      title: 'Problem Solving',
      description: 'Work through challenges, identify root causes, and implement effective solutions to business obstacles.',
    },
    {
      icon: Target,
      title: 'Strategic Planning',
      description: 'Create comprehensive business plans, set clear goals, and establish roadmaps for long-term success.',
    },
    {
      icon: DollarSign,
      title: 'Financial Optimization',
      description: 'Improve profitability, manage cash flow, create budgets, and develop pricing strategies.',
    },
    {
      icon: Users,
      title: 'Marketing & Sales',
      description: 'Build effective marketing strategies, optimize sales processes, and improve customer acquisition.',
    },
    {
      icon: BarChart,
      title: 'Operations Excellence',
      description: 'Streamline workflows, improve efficiency, implement systems, and optimize business operations.',
    },
    {
      icon: Award,
      title: 'Leadership Development',
      description: 'Enhance leadership skills, build strong teams, improve management capabilities, and foster company culture.',
    },
    {
      icon: Rocket,
      title: 'Startup Guidance',
      description: 'Launch new businesses, pivot existing ones, validate ideas, and navigate the entrepreneurial journey.',
    },
  ];

  return (
    <BusinessHubLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Coaching</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One-on-one expert guidance to help you overcome challenges, seize opportunities,
            and achieve your business goals faster.
          </p>
        </div>

        {myBookings.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Your Active Coaching
            </h3>
            <div className="space-y-3">
              {myBookings.filter(b => b.status === 'active').map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{booking.business_coaching_packages.name}</p>
                    <p className="text-sm text-gray-600">
                      {booking.sessions_remaining} of {booking.business_coaching_packages.session_count} sessions remaining
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/merchant/coaching/booking/${booking.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What Business Coaching Can Do For You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coachingAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <area.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{area.title}</h3>
                <p className="text-sm text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Business Coaching Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Choose Package</h3>
              <p className="text-sm text-gray-600">Select the coaching package that fits your needs and schedule</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Schedule Sessions</h3>
              <p className="text-sm text-gray-600">Book your one-on-one coaching sessions at convenient times</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Work Together</h3>
              <p className="text-sm text-gray-600">Collaborate with your coach to develop strategies and solutions</p>
            </div>
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Grow & Succeed</h3>
              <p className="text-sm text-gray-600">Implement strategies and watch your business thrive</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Choose Your Coaching Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-xl border-2 p-6 hover:shadow-xl transition-all ${
                  index === 1 ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200'
                }`}
              >
                {index === 1 && (
                  <div className="bg-blue-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full inline-block mb-3">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    ${(pkg.price_cents / 100).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {pkg.session_count} session{pkg.session_count > 1 ? 's' : ''} • {pkg.duration_weeks} week{pkg.duration_weeks > 1 ? 's' : ''}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(`/merchant/coaching/checkout?package=${pkg.id}`)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    index === 1
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Not sure which package is right for you?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Book a free 15-minute consultation call to discuss your business goals and find the perfect coaching package.
          </p>
          <button
            onClick={() => navigate('/merchant/support')}
            className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-semibold"
          >
            Schedule Free Consultation
          </button>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
