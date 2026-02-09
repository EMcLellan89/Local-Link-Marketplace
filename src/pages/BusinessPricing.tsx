import { CheckCircle, ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { SEO } from '../components/SEO';

export default function BusinessPricing() {
  const navigate = useNavigate();

  const addOns = [
    { name: 'Extra deal spot on postcard', price: '$149' },
    { name: 'Full postcard ad (4x size)', price: '$349' },
    { name: 'Professional deal copywriting', price: '$49' },
    { name: 'Monthly loyalty text marketing', price: '$29/mo' }
  ];

  return (
    <>
      <SEO
        title="Business Pricing - Transparent, Fair Subscription Plans"
        description="LocalLink business pricing: $149-$349/month. CRM included with all plans. Keep 65-80% of every sale. Includes postcard promotion, customer data, instant payouts."
        keywords="business pricing, merchant subscription, deal platform costs, small business marketing pricing, crm included"
        canonical="https://locallink.com/business-pricing"
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
                onClick={() => navigate('/business')}
                className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                For Merchants
              </button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              CRM Included with Every Plan
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              4 Tiers, One Perfect Fit
            </h1>
            <p className="text-xl text-slate-600">Professional CRM, accounting, and marketing—all in one simple price. No long-term contracts. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* STARTER */}
            <Card variant="bordered" className="hover:shadow-xl transition-shadow relative">
              <div className="absolute top-4 right-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  NEW
                </span>
              </div>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                  <div className="text-5xl font-bold text-[#2BB673] mb-2">
                    $149<span className="text-xl text-slate-600">/mo</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Perfect for new businesses</p>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-900 mb-1">CRM INCLUDED</div>
                    <div className="text-sm font-bold text-slate-900">Starter CRM</div>
                    <div className="text-xs text-slate-600">500 contacts</div>
                    <div className="text-xs text-slate-600 mt-1">No accounting</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Contact management & pipeline</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Email marketing</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">1 postcard spot (rotating)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Basic marketplace listing</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">QR code redemption</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Basic analytics</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Mobile app access</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </CardBody>
            </Card>

            {/* FOUNDERS */}
            <Card variant="bordered" className="hover:shadow-xl transition-shadow relative">
              <div className="absolute top-4 right-4">
                <span className="bg-[#F5B82E] text-white text-xs font-bold px-3 py-1 rounded-full">
                  LOCKED RATE
                </span>
              </div>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Founders</h3>
                  <div className="text-5xl font-bold text-[#2BB673] mb-2">
                    $249<span className="text-xl text-slate-600">/mo</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Locked rate for early adopters</p>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-900 mb-1">CRM INCLUDED</div>
                    <div className="text-sm font-bold text-slate-900">Professional CRM</div>
                    <div className="text-xs text-slate-600">5,000 contacts</div>
                    <div className="text-xs text-slate-600 mt-1">Books Lite accounting</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">Everything in Starter</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Advanced pipelines & automation</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Customer segmentation</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Value section placement</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Enhanced analytics</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Email promotion (1x/mo)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Priority support</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">Rate locked for life</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  Join Founders
                </Button>
              </CardBody>
            </Card>

            {/* STANDARD */}
            <Card variant="bordered" className="border-[#2BB673] border-2 hover:shadow-xl transition-shadow relative">
              <div className="absolute top-4 right-4">
                <span className="bg-[#2BB673] text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              </div>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Standard</h3>
                  <div className="text-5xl font-bold text-[#2BB673] mb-2">
                    $299<span className="text-xl text-slate-600">/mo</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Best for growing businesses</p>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-900 mb-1">CRM INCLUDED</div>
                    <div className="text-sm font-bold text-slate-900">Business CRM</div>
                    <div className="text-xs text-slate-600">25,000 contacts</div>
                    <div className="text-xs text-slate-600 mt-1">Books Pro accounting</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">Everything in Founders</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">SMS marketing</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Custom workflows</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Standard placement</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Priority marketplace listing</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Featured in 2 email blasts/mo</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Social media feature (1x/mo)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">A/B testing tools</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  Choose Standard
                </Button>
              </CardBody>
            </Card>

            {/* PREMIUM */}
            <Card variant="bordered" className="hover:shadow-xl transition-shadow">
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium</h3>
                  <div className="text-5xl font-bold text-[#2BB673] mb-2">
                    $349<span className="text-xl text-slate-600">/mo</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Maximum exposure</p>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-900 mb-1">CRM INCLUDED</div>
                    <div className="text-sm font-bold text-slate-900">Enterprise CRM</div>
                    <div className="text-xs text-slate-600">100,000 contacts</div>
                    <div className="text-xs text-slate-600 mt-1">Books Pro accounting</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">Everything in Standard</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">AI-powered insights</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Unlimited communications</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">TOP ROW placement</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">Featured deal badge</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Advanced analytics + heat maps</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Featured in 4 email blasts/mo</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Boosted social (2x/mo)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">Dedicated account manager</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">White-label + API access</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  Go Premium
                </Button>
              </CardBody>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <Card>
              <CardBody>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Optional Add-Ons</h3>
                <div className="space-y-4">
                  {addOns.map((addon, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-0">
                      <span className="text-slate-700">{addon.name}</span>
                      <span className="text-xl font-bold text-[#2BB673]">{addon.price}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <Card className="bg-slate-50">
              <CardBody className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">All Plans Include</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold">Professional CRM included</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Deal pipeline management</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">20-35% commission (you keep 65-80%)</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Instant or weekly payouts</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">You keep customer data</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">FREE design of your deal box</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Month-to-month, cancel anytime</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">No setup fees</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 pt-4 border-t border-slate-200">
                  All plans renew month-to-month. Cancel any time; service continues through the current billing cycle.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#2BB673] to-[#25a062]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join Local Link Marketplace with CRM included and start attracting new customers today
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-[#2BB673] hover:bg-slate-50 text-lg px-8 py-4"
          >
            Apply Now
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
