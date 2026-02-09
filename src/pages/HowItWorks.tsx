import { Search, CreditCard, Smartphone, Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { SEO } from '../components/SEO';

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      title: 'Browse Local Deals',
      description: 'Explore offers from restaurants, salons, shops, and service providers in your area. Filter by category or search for specific businesses.'
    },
    {
      icon: CreditCard,
      title: 'Buy Instantly Online',
      description: 'Secure checkout with no paper coupons needed. Your deal is stored digitally on your phone for easy access anytime.'
    },
    {
      icon: Smartphone,
      title: 'Redeem with Simple QR Code',
      description: 'Show your QR code at the business, they scan it, and you\'re done. No printing, no hassle — just instant savings.'
    },
    {
      icon: Gift,
      title: 'Earn Loyalty Rewards',
      description: 'Earn points on every purchase and redemption. Get access to VIP offers and bonus deals as a valued member.'
    }
  ];

  const benefits = [
    'Built for local communities',
    'Fair to small businesses',
    'No complicated subscriptions',
    'All-digital — easy, fast, eco-friendly',
    'Support businesses you love',
    'Discover hidden gems in your area'
  ];

  return (
    <>
      <SEO
        title="How It Works - Simple QR Code Redemption"
        description="Discover how easy it is to save with LocalLink: Browse local deals, buy instantly online, redeem with QR codes, and earn loyalty rewards. No paper coupons, all digital."
        keywords="how to use local deals, qr code redemption, digital vouchers, loyalty rewards, buy local deals online"
        canonical="https://locallink.com/how-it-works"
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
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              How Local Link Marketplace Works
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Saving money and supporting local businesses has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {steps.map((step, index) => (
              <Card key={index} variant="bordered" className="hover:shadow-lg transition-shadow relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-[#2BB673] text-white flex items-center justify-center text-xl font-bold">
                    {index + 1}
                  </div>
                </div>
                <CardBody className="pt-10 space-y-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2BB673]/10">
                    <step.icon className="w-8 h-8 text-[#2BB673]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                For Shoppers
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#2BB673] mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Browse Local Deals</h4>
                    <p className="text-slate-600">Use our website to see offers from local restaurants, salons, shops, and service providers.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#2BB673] mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Buy Instantly Online</h4>
                    <p className="text-slate-600">Checkout securely — your deal is stored on your phone. No paper coupons.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#2BB673] mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Redeem with QR Code</h4>
                    <p className="text-slate-600">Show your QR at the business; they scan it and apply the deal.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#2BB673] mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Earn Loyalty Rewards</h4>
                    <p className="text-slate-600">Earn points on purchases and redemptions. Get access to VIP offers and bonus deals.</p>
                  </div>
                </div>
              </div>
              <Button size="lg" onClick={() => navigate('/register')}>
                Start Saving Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-2xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-6">Why It's Better</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-slate-50 to-white">
            <CardBody className="text-center py-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Every Purchase Supports a Local Business
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                When you buy through Local Link, you're not just saving money — you're helping keep
                your community vibrant and supporting the entrepreneurs who make it special.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#2BB673] to-[#25a062]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands discovering amazing local deals every day
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-[#2BB673] hover:bg-slate-50 text-lg px-8 py-4"
          >
            Create Free Account
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
