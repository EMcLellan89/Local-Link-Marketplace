import { MapPin, Tag, TrendingUp, Users, ShoppingBag, CheckCircle, ArrowRight, Sparkles, Shield, Zap, Heart, Store, Award, DollarSign, Target, BookOpen, Briefcase, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import { SEO } from '../components/SEO';
import { useEffect, useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainFeatures = [
    {
      icon: Store,
      title: 'For Merchants',
      description: 'Transform your local business with our complete growth platform',
      color: 'from-emerald-500 to-teal-600',
      path: '/business',
      stats: '500+ Active Merchants'
    },
    {
      icon: GraduationCap,
      title: 'Learn & Grow',
      description: 'Master digital marketing with our comprehensive academy courses',
      color: 'from-blue-500 to-cyan-600',
      path: '/academy',
      stats: '18 Expert Courses'
    },
    {
      icon: Briefcase,
      title: 'Earn as a Partner',
      description: 'Build a profitable business helping local merchants succeed',
      color: 'from-orange-500 to-amber-600',
      path: '/earn',
      stats: 'Up to 25% Commission'
    },
    {
      icon: Tag,
      title: 'Shop Local Deals',
      description: 'Save up to 70% on local restaurants, services, and experiences',
      color: 'from-rose-500 to-pink-600',
      path: '/deals',
      stats: '1000+ Active Deals'
    }
  ];

  const platformStats = [
    { number: '500+', label: 'Local Businesses', icon: Store },
    { number: '$2M+', label: 'Customer Savings', icon: DollarSign },
    { number: '50K+', label: 'Happy Members', icon: Users },
    { number: '98%', label: 'Success Rate', icon: Award }
  ];

  const benefits = [
    { icon: Shield, text: 'Enterprise-grade security & reliability' },
    { icon: Zap, text: 'Instant activation & digital delivery' },
    { icon: Heart, text: 'Support your local community' },
    { icon: Target, text: 'Proven revenue-driving strategies' },
    { icon: Award, text: 'Award-winning customer support' },
    { icon: Sparkles, text: 'Cutting-edge AI-powered tools' }
  ];

  return (
    <>
      <SEO
        title="Local-Link | Complete Platform for Local Business Growth"
        description="The all-in-one platform connecting local businesses, entrepreneurs, and communities. Academy courses, partnership opportunities, merchant tools, and exclusive local deals."
        keywords="local business platform, merchant services, business academy, partner program, local deals, digital marketing courses"
        canonical="https://locallink.com"
      />
      <div className="min-h-screen bg-black">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 20 ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-emerald-500/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <img
                src="/local-link_marketplace_logo.png"
                alt="Local-Link Marketplace"
                className="h-12 w-auto cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate('/')}
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate('/deals')}
                className="text-slate-300 hover:text-rose-400 font-medium transition-all hover:scale-105"
              >
                Deals For Shoppers
              </button>
              <button
                onClick={() => navigate('/business')}
                className="text-slate-300 hover:text-emerald-400 font-medium transition-all hover:scale-105"
              >
                For Merchants
              </button>
              <button
                onClick={() => navigate('/earn')}
                className="relative text-slate-300 hover:text-orange-400 font-medium transition-all hover:scale-105 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Partner Program
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">NEW</span>
              </button>
            </nav>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-slate-300 hover:text-white font-medium transition-all hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-black via-slate-950 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-purple-500/10"></div>

        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto mb-20">
            {/* Large Logo */}
            <div className="mb-12 flex justify-center">
              <img
                src="/local-link_marketplace_logo.png"
                alt="Local-Link Marketplace"
                className="h-48 md:h-64 lg:h-72 w-auto drop-shadow-2xl animate-fadeIn"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg shadow-emerald-500/20 mb-8 hover:shadow-xl hover:shadow-cyan-500/30 transition-all">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">The Complete Local Business Ecosystem</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-white drop-shadow-2xl">
                Where Local
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 drop-shadow-2xl animate-pulse">
                Business Thrives
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              One platform. Three powerful solutions. Unlimited growth potential.
              <span className="block mt-2 text-emerald-400 font-semibold">
                Shoppers • Merchants • Partners
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="text-lg px-10 py-6 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-purple-600 shadow-2xl shadow-emerald-500/50 hover:shadow-purple-500/50 transition-all hover:scale-110 group border border-white/20"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button
                onClick={() => navigate('/about')}
                className="text-lg px-10 py-6 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-lg font-semibold text-white hover:border-emerald-400 hover:bg-white/20 transition-all hover:scale-105 shadow-lg"
              >
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-slate-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              One Platform, Four Paths to Success
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Choose your journey or combine multiple paths to maximize your impact and earnings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  onClick={() => navigate(feature.path)}
                  className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/10 hover:border-transparent hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 bg-slate-900/50 group-hover:bg-transparent transition-colors duration-300"></div>

                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/30`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-slate-300 group-hover:text-white mb-6 transition-colors duration-300">
                      {feature.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-400 group-hover:text-white/90 transition-colors duration-300">
                        {feature.stats}
                      </span>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-slate-300">
              Real impact. Real results. Real community.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center group hover:scale-110 transition-transform duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg group-hover:shadow-emerald-500/50 transition-all">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-black to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Local-Link is Different
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We're not just another platform. We're a complete ecosystem built for sustainable local business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border-2 border-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/30">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300 group-hover:text-white font-medium leading-relaxed transition-colors">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/20 to-transparent"></div>

        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Limited Time: Get Started Today</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="block mt-2">Local Business Journey?</span>
          </h2>

          <p className="text-xl md:text-2xl text-emerald-900 mb-12 leading-relaxed max-w-2xl mx-auto font-semibold">
            Join thousands of shoppers, businesses and partners building a thriving local economy together
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="text-lg px-12 py-6 bg-white !text-blue-600 font-bold hover:bg-slate-50 shadow-2xl hover:shadow-white/50 transition-all hover:scale-105 group"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={() => navigate('/about')}
              className="text-lg px-12 py-6 bg-transparent border-2 border-white rounded-lg font-semibold text-white hover:bg-white hover:text-emerald-600 transition-all hover:scale-105"
            >
              Learn More
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Professional Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Flexible Plans</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>24/7 Access</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/local-link_marketplace_logo.png"
                  alt="Local-Link Marketplace"
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-sm text-slate-400 mb-6 max-w-md">
                The complete platform for local business growth. Connecting merchants, partners, and shoppers in one powerful ecosystem.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-500">All Systems Operational</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-500" />
                For Businesses
              </h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => navigate('/business')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Merchant Platform</button></li>
                <li><button onClick={() => navigate('/business/pricing')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Pricing Plans</button></li>
                <li><button onClick={() => navigate('/merchant/dfy')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Done-For-You Services</button></li>
                <li><button onClick={() => navigate('/merchant/crm')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">CRM Tools</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-500" />
                Partners & Learning
              </h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => navigate('/earn')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Partner Program</button></li>
                <li><button onClick={() => navigate('/academy')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Academy Courses</button></li>
                <li><button onClick={() => navigate('/partner/playbooks')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Partner Playbooks</button></li>
                <li><button onClick={() => navigate('/affiliate')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Affiliate Program</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-500" />
                Resources
              </h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => navigate('/deals')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">Browse Deals</button></li>
                <li><button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">How It Works</button></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">FAQ</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">About Us</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Local-Link. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm">
                <button className="text-slate-500 hover:text-white transition-colors">Privacy Policy</button>
                <button className="text-slate-500 hover:text-white transition-colors">Terms of Service</button>
                <button className="text-slate-500 hover:text-white transition-colors">Contact</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
