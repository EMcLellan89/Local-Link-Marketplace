import { useNavigate } from 'react-router-dom';
import { DollarSign, Video, MapPin, Sparkles, Users, ArrowRight, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { SEO } from '../components/SEO';

export default function EarnHub() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Earn with Local-Link - Partners & Creators"
        description="Join Local-Link and earn money as a partner or UGC creator. AI-powered tools, recurring income, and flexible opportunities."
        keywords="earn money, partner program, UGC creator, side income, passive income"
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
                Earn with Local-Link
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Turn your skills into income. Choose your path: help businesses grow as a partner,
                or create content as a UGC creator. Both powered by AI tools.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="relative overflow-hidden hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2BB673]/20 to-transparent rounded-bl-full"></div>
                <CardBody className="relative p-8 space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-2xl flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Become a Partner</h2>
                    <p className="text-slate-600">
                      Help local businesses join Local-Link and earn 20% recurring commissions. Get AI-generated
                      scripts, territory protection, and full onboarding support.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                      <span className="text-slate-700">20% recurring revenue on all subscriptions</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                      <span className="text-slate-700">AI-powered outreach scripts & tools</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                      <span className="text-slate-700">Protected territory - no competition</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-[#2BB673] rounded-full"></div>
                      <span className="text-slate-700">$200+ bonus per merchant services signup</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Average Partner Earnings</p>
                    <p className="text-3xl font-bold text-slate-900">$2,500<span className="text-lg text-slate-600">/mo</span></p>
                    <p className="text-xs text-slate-500 mt-1">Based on 10 active merchants</p>
                  </div>

                  <Button
                    onClick={() => navigate('/partners/apply')}
                    className="w-full"
                    size="lg"
                  >
                    Become a Partner
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardBody>
              </Card>

              <Card className="relative overflow-hidden hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-transparent rounded-bl-full"></div>
                <CardBody className="relative p-8 space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Become a UGC Creator</h2>
                    <p className="text-slate-600">
                      Create short-form video content for local businesses. No contracts, no influencer status
                      required. Earn $75-$200 per video with steady work.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                      <span className="text-slate-700">$75-$200 per video delivered</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                      <span className="text-slate-700">Simple 15-30 second videos</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                      <span className="text-slate-700">Choose industries you like</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                      <span className="text-slate-700">Get monthly retainer opportunities</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Average Creator Earnings</p>
                    <p className="text-3xl font-bold text-slate-900">$1,000<span className="text-lg text-slate-600">+/mo</span></p>
                    <p className="text-xs text-slate-500 mt-1">Based on 10 videos per week</p>
                  </div>

                  <Button
                    onClick={() => navigate('/creator/apply')}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                    size="lg"
                  >
                    Become a Creator
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Join Local-Link</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We provide everything you need to succeed, from AI-powered tools to full support.
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
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Predictable Income</h3>
                  <p className="text-sm text-slate-600">
                    Partners earn recurring revenue. Creators get steady work. Both track earnings in real-time.
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
              Choose your path and start generating income today. No upfront costs, no hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/partners/apply')}
                className="text-lg px-8 py-4"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Apply as Partner
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/creator/apply')}
                className="text-lg px-8 py-4 bg-violet-600 hover:bg-violet-700"
              >
                <Video className="w-5 h-5 mr-2" />
                Apply as Creator
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}