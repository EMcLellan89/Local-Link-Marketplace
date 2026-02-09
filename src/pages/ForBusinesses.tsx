import { CheckCircle, TrendingUp, DollarSign, Users, Calendar, BarChart, ArrowRight, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { SEO } from '../components/SEO';

export default function ForBusinesses() {
  const navigate = useNavigate();

  const problems = [
    {
      icon: XCircle,
      title: 'High Commissions',
      description: 'Many deal sites take 50-70% of your revenue'
    },
    {
      icon: XCircle,
      title: 'Slow Payouts',
      description: 'You wait weeks to get your money'
    },
    {
      icon: XCircle,
      title: 'No Customer Data',
      description: 'You don\'t get emails or phone numbers — they do'
    }
  ];

  const solutions = [
    {
      icon: DollarSign,
      title: '20-35% Commission',
      description: 'You keep 65-80% of every sale'
    },
    {
      icon: TrendingUp,
      title: 'Instant or Weekly Payouts',
      description: 'Get your money fast, not in 30-60 days'
    },
    {
      icon: Users,
      title: 'You Keep Customer Data',
      description: 'Build your own list with emails and phone numbers'
    },
    {
      icon: Calendar,
      title: 'Monthly Postcard Promotion',
      description: 'Featured on postcards mailed to 5,000+ homes'
    },
    {
      icon: BarChart,
      title: 'QR-Based Analytics',
      description: 'Track views, purchases, and redemptions in real-time'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Your Deal',
      description: 'Set the price, value, and quantity available'
    },
    {
      step: '2',
      title: 'We Promote It',
      description: 'Featured on our website, Marketplace, postcard, email, and text list'
    },
    {
      step: '3',
      title: 'Customers Buy',
      description: 'You get paid fast with a fair commission'
    },
    {
      step: '4',
      title: 'They Redeem with QR',
      description: 'New customers walk in and you get their contact info'
    }
  ];

  return (
    <>
      <SEO
        title="For Merchants - Fair Deals Platform with Low Commissions"
        description="Keep 65-80% of every sale with LocalLink. Get instant payouts, customer data, monthly postcard promotion, and QR-based analytics. Better than traditional deal sites."
        keywords="business deals platform, low commission marketplace, merchant services, customer acquisition, local business marketing"
        canonical="https://locallink.com/for-merchants"
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
                onClick={() => navigate('/business/pricing')}
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Pricing
              </button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2BB673]/5 to-[#F5B82E]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Stop Losing 50-70%
              <span className="block text-[#2BB673] mt-2">on Groupon Deals</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Local Link Marketplace helps you attract new customers, get paid fast, and keep more
              profit — with built-in promotion on our monthly Local Link Postcards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="text-lg px-8 py-4"
              >
                Get Listed — From $179/month
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button
                onClick={() => navigate('/business/pricing')}
                className="text-lg px-8 py-4 border-2 border-slate-300 rounded-lg font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Most Deal Platforms Hurt Small Businesses
            </h2>
            <p className="text-xl text-slate-600">The problems with traditional deal sites</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <Card key={index} variant="bordered" className="border-red-200 bg-red-50/50">
                <CardBody className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                    <problem.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{problem.title}</h3>
                  <p className="text-slate-600">{problem.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Local Deals Built for Local Businesses
            </h2>
            <p className="text-xl text-slate-600">Our fair and profitable approach</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} variant="bordered" className="hover:shadow-lg transition-shadow">
                <CardBody className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2BB673]/10">
                    <solution.icon className="w-8 h-8 text-[#2BB673]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{solution.title}</h3>
                  <p className="text-slate-600">{solution.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works for Merchants</h2>
            <p className="text-xl text-slate-600">Simple, profitable, and effective</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2BB673] text-white text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Pricing Snapshot</h2>
          <p className="text-lg text-slate-600 mb-12">All plans include LocalLink CRM + Marketplace listing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card variant="bordered" className="hover:shadow-lg transition-shadow">
              <CardBody className="space-y-4">
                <div className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>
                <h3 className="text-2xl font-bold text-slate-900">Starter</h3>
                <div className="text-4xl font-bold text-[#2BB673]">$179<span className="text-lg text-slate-600">/mo</span></div>
                <p className="text-sm text-slate-600">Perfect for new businesses</p>
                <ul className="text-left text-sm space-y-2">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />1 postcard spot</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Basic CRM (500 contacts)</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Marketplace listing</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />QR redemption</li>
                </ul>
              </CardBody>
            </Card>

            <Card variant="bordered" className="hover:shadow-lg transition-shadow">
              <CardBody className="space-y-4">
                <div className="inline-block bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">LOCKED RATE</div>
                <h3 className="text-2xl font-bold text-slate-900">Founders</h3>
                <div className="text-4xl font-bold text-[#2BB673]">$279<span className="text-lg text-slate-600">/mo</span></div>
                <p className="text-sm text-slate-600">Rate locked for life</p>
                <ul className="text-left text-sm space-y-2">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Everything in Starter</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Pro CRM (2,500 contacts)</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Email promotions</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Priority support</li>
                </ul>
              </CardBody>
            </Card>

            <Card variant="bordered" className="border-[#2BB673] border-2 hover:shadow-lg transition-shadow">
              <CardBody className="space-y-4">
                <div className="inline-block bg-[#2BB673] text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                <h3 className="text-2xl font-bold text-slate-900">Standard</h3>
                <div className="text-4xl font-bold text-[#2BB673]">$349<span className="text-lg text-slate-600">/mo</span></div>
                <p className="text-sm text-slate-600">Best for growing businesses</p>
                <ul className="text-left text-sm space-y-2">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Everything in Founders</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Business CRM (10k contacts)</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />2 email blasts/month</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Social media features</li>
                </ul>
              </CardBody>
            </Card>

            <Card variant="bordered" className="hover:shadow-lg transition-shadow">
              <CardBody className="space-y-4">
                <div className="inline-block bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">PREMIUM</div>
                <h3 className="text-2xl font-bold text-slate-900">Premium</h3>
                <div className="text-4xl font-bold text-[#2BB673]">$449<span className="text-lg text-slate-600">/mo</span></div>
                <p className="text-sm text-slate-600">Maximum exposure</p>
                <ul className="text-left text-sm space-y-2">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Top-row placement</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Enterprise CRM (unlimited)</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />4 email blasts/month</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 mt-0.5 flex-shrink-0" />Dedicated manager</li>
                </ul>
              </CardBody>
            </Card>
          </div>
          <Button size="lg" onClick={() => navigate('/business/pricing')} className="text-lg px-8 py-4">
            View Full Pricing Details
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#2BB673] to-[#25a062]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            We're Filling Spots for the Next Postcard Now
          </h2>
          <p className="text-xl text-white/90 mb-10">
            We limit the number of businesses per category. Once your category is filled, we'll start a waitlist.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-[#2BB673] hover:bg-slate-50 text-lg px-8 py-4"
          >
            Apply for a Spot
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
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
