import { Heart, TrendingUp, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { SEO } from '../components/SEO';

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: 'Local First',
      description: 'We believe in strengthening local economies by connecting residents with neighborhood businesses'
    },
    {
      icon: TrendingUp,
      title: 'Fair to Merchants',
      description: 'Unlike other platforms, we take fair commissions and give businesses the tools to succeed'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Every deal purchased keeps money in your community and supports local entrepreneurs'
    },
    {
      icon: Shield,
      title: 'Transparent & Trustworthy',
      description: 'We operate with honesty, clear terms, and a commitment to both sides of every transaction'
    }
  ];

  return (
    <>
      <SEO
        title="About Us - Strengthening Local Communities"
        description="Learn about LocalLink's mission to strengthen local economies by connecting residents with neighborhood businesses through fair, transparent deals and community-driven marketplace."
        keywords="about local business, support local economy, community marketplace, fair commissions, local first"
        canonical="https://locallink.com/about"
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900">LocalLink</span>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Built to Help Local Businesses Thrive
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Local Link Marketplace was created to connect residents with the best local businesses —
              and to give those businesses a fair, profitable way to run deals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <div className="space-y-4 text-slate-600 text-lg">
                <p>
                  Instead of taking 50-70% of the sale like some national platforms, we focus on fair commissions,
                  fast payouts, and giving business owners access to real customer data so they can build
                  long-term relationships.
                </p>
                <p>
                  With our combination of monthly postcards, digital Marketplace, loyalty tools, and local-first
                  approach, we're building a stronger local economy — one deal at a time.
                </p>
                <p>
                  We believe that when local businesses succeed, entire communities thrive. That's why we've built
                  a platform that benefits everyone: consumers save money, businesses gain customers, and neighborhoods
                  stay vibrant and connected.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-2xl p-12 text-white">
              <div className="space-y-8">
                <div>
                  <div className="text-6xl font-bold mb-2">500+</div>
                  <div className="text-xl opacity-90">Local Businesses</div>
                </div>
                <div>
                  <div className="text-6xl font-bold mb-2">$2M+</div>
                  <div className="text-xl opacity-90">Saved by Customers</div>
                </div>
                <div>
                  <div className="text-6xl font-bold mb-2">50K+</div>
                  <div className="text-xl opacity-90">Happy Members</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} variant="bordered" className="hover:shadow-lg transition-shadow">
                  <CardBody className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2BB673]/10">
                      <value.icon className="w-8 h-8 text-[#2BB673]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{value.title}</h3>
                    <p className="text-slate-600">{value.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-to-br from-slate-50 to-white">
            <CardBody className="py-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Join the Movement
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                Whether you're a customer looking for great deals or a business owner wanting to grow,
                Local Link Marketplace is your partner in building a stronger local community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Join as a Customer
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/business')}
                  className="border-2"
                >
                  List Your Business
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 LocalLink Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
