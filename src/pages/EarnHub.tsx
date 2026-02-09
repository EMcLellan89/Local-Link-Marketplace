import { useNavigate } from 'react-router-dom';
import { DollarSign, MapPin, Sparkles, Users, ArrowRight, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { SEO } from '../components/SEO';

export default function EarnHub() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Become a Partner - Earn Recurring Commissions"
        description="Join Local-Link as a partner and earn 10-30% recurring commissions. AI-powered tools, territory protection, and full support included."
        keywords="partner program, recurring commissions, earn money, affiliate program, business opportunity"
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => navigate('/')}
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                ← Back to Home
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

        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2BB673]/5 to-[#F5B82E]/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Income Platform
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Earn as a Partner
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Help local businesses join Local-Link and earn recurring commissions on every sale.
                Get AI-powered tools, territory protection, and full support.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Card className="relative overflow-hidden hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2BB673]/20 to-transparent rounded-bl-full"></div>
                <CardBody className="relative p-8 space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-2xl flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">Partner Program</h2>
                    <p className="text-lg text-slate-600">
                      Help local businesses join Local-Link and earn 10-30% recurring commissions based on your tier.
                      Get AI-generated scripts, territory protection, and full onboarding support.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                        <span className="text-slate-700">10-30% recurring commissions</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                        <span className="text-slate-700">AI-powered outreach tools</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                        <span className="text-slate-700">Protected territory</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                        <span className="text-slate-700">Full training & support</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                        <span className="text-slate-700">$150 flat per merchant services</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                        <span className="text-slate-700">Real-time earnings tracking</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                        <span className="text-slate-700">Weekly payouts</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                        <span className="text-slate-700">Access to ad vault & swipe files</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Starter Partner</p>
                      <p className="text-2xl font-bold text-slate-900">10%</p>
                      <p className="text-xs text-slate-500 mt-1">$79/month</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-lg p-4 border border-[#2BB673]">
                      <p className="text-xs text-white/90 mb-1">Pro Partner</p>
                      <p className="text-2xl font-bold text-white">20%</p>
                      <p className="text-xs text-white/80 mt-1">$498/month</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Enterprise</p>
                      <p className="text-2xl font-bold text-slate-900">30%</p>
                      <p className="text-xs text-slate-500 mt-1">$1,798/month</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <p className="text-sm text-blue-900 font-semibold mb-2">Example Earnings (Pro Partner at 20%)</p>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span>10 merchants at $349/mo:</span>
                        <span className="font-bold">$698/mo recurring</span>
                      </div>
                      <div className="flex justify-between">
                        <span>5 merchant services at $150:</span>
                        <span className="font-bold">$750 one-time</span>
                      </div>
                      <div className="flex justify-between border-t border-blue-300 pt-2 mt-2">
                        <span className="font-semibold">Total Month 1:</span>
                        <span className="font-bold text-lg">$1,448</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/partners/apply')}
                    className="w-full"
                    size="lg"
                  >
                    Apply as Partner
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Become a Partner</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We provide everything you need to succeed as a partner, from AI-powered tools to full training and support.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="w-12 h-12 bg-[#2BB673]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-[#2BB673]" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">AI-Powered Tools</h3>
                  <p className="text-sm text-slate-600">
                    Get AI-generated scripts, prompts, and content templates. No guessing, no writer's block.
                  </p>
                </CardBody>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Recurring Income</h3>
                  <p className="text-sm text-slate-600">
                    Earn recurring commissions on every merchant subscription. Track your earnings in real-time and get paid weekly.
                  </p>
                </CardBody>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Full Support</h3>
                  <p className="text-sm text-slate-600">
                    Join a community with dedicated support, training resources, and direct access to our team.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Start Earning?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Join hundreds of partners earning recurring commissions. Apply now and start building your income.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/partners/apply')}
              className="text-lg px-8 py-4"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Apply as Partner
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}