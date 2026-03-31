import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Gift, TrendingUp, DollarSign, Check, Heart, Repeat, Sparkles, Users, Award, Target, Star, BarChart3, Zap, ShoppingBag, Info, Shield, TrendingDown, Clock, FileText } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

type Tab = 'processing' | 'loyalty' | 'giftcards';

export default function MerchantServicesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('processing');

  const tabs = [
    { id: 'processing' as Tab, label: 'Credit Card Processing', icon: CreditCard },
    { id: 'loyalty' as Tab, label: 'Loyalty Program', icon: Heart },
    { id: 'giftcards' as Tab, label: 'Gift Cards', icon: Gift },
  ];

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <BackButton />
          <h1 className="text-3xl font-bold text-slate-900 mt-4">GoPayBright Merchant Services</h1>
          <p className="text-slate-600 mt-2">
            Complete payment processing, loyalty programs, gift cards, and fast business funding
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2
                  ${activeTab === tab.id
                    ? 'border-[#2BB673] text-[#2BB673]'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Credit Card Processing Tab */}
        {activeTab === 'processing' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-start flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Credit Card Processing</h2>
                      <p className="text-slate-700 mb-4">
                        Low-cost, transparent payment processing with next-day deposits and industry-leading rates. Accept all major cards with zero hidden fees.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-blue-600 mr-2" />
                          <span>Lowest rates guaranteed</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-blue-600 mr-2" />
                          <span>Next-day deposits</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-blue-600 mr-2" />
                          <span>No hidden fees</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-blue-600 mr-2" />
                          <span>Free equipment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Pricing Models */}
            <Card variant="bordered">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Choose Your Pricing Model
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  We offer three transparent pricing structures to fit your business needs
                </p>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Dual Pricing */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Dual Pricing</h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-green-600">0%</span>
                      <span className="text-slate-600 ml-2">processing fee</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      Pass processing costs to customers who pay with cards while offering a cash discount
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">Zero processing fees for you</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">Customers see two prices: cash and card</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">Fully compliant with card network rules</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">Best for: High-volume, price-sensitive businesses</p>
                      </div>
                    </div>
                  </div>

                  {/* Interchange Plus */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Interchange Plus</h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-blue-600">IC+</span>
                      <span className="text-slate-600 ml-2">transparent pricing</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      Pay actual interchange rates plus a small fixed markup for maximum transparency
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">True cost-plus pricing model</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">See exact interchange fees on statements</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">Lower overall costs for most merchants</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">Best for: Businesses wanting complete transparency</p>
                      </div>
                    </div>
                  </div>

                  {/* Tiered Pricing */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <Star className="w-6 h-6 text-amber-600" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Tiered Pricing</h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-amber-600">Simple</span>
                      <span className="text-slate-600 ml-2">flat rates</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      Straightforward flat-rate pricing with predictable costs each month
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">Easy to understand pricing tiers</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">Predictable monthly statements</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">No surprises or complex calculations</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">Best for: Small businesses wanting simplicity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fast Deposits & Features */}
              <Card variant="bordered">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Fast Deposits & Features
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Next-Day Deposits
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Funds in your account the next business day</li>
                        <li className="text-sm text-slate-600">• Improved cash flow for your business</li>
                        <li className="text-sm text-slate-600">• Automatic deposits, no manual transfers</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-green-500" />
                        Accept All Major Cards
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Visa, Mastercard, American Express</li>
                        <li className="text-sm text-slate-600">• Discover, Apple Pay, Google Pay</li>
                        <li className="text-sm text-slate-600">• Tap-to-pay and contactless payments</li>
                        <li className="text-sm text-slate-600">• EMV chip card security</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* No Hidden Fees */}
              <Card variant="bordered">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    No Hidden Fees
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        Transparent Pricing
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• No application fees</li>
                        <li className="text-sm text-slate-600">• No monthly minimums</li>
                        <li className="text-sm text-slate-600">• No cancellation fees</li>
                        <li className="text-sm text-slate-600">• No annual fees</li>
                        <li className="text-sm text-slate-600">• Straightforward pricing you can trust</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-500" />
                        Rate Match Guarantee
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• We'll beat any competitor's rate</li>
                        <li className="text-sm text-slate-600">• Price match on comparable services</li>
                        <li className="text-sm text-slate-600">• Annual rate review to ensure best pricing</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Equipment & Setup */}
            <Card variant="bordered">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Equipment & Setup
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Free Terminal</h4>
                    <p className="text-sm text-slate-600">Modern SmartPOS terminal with built-in receipt printer. No upfront equipment costs.</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Quick Setup</h4>
                    <p className="text-sm text-slate-600">Be up and running in 24-48 hours. Simple application, fast approval.</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">PCI Compliance</h4>
                    <p className="text-sm text-slate-600">Built-in security and fraud protection. PCI-compliant terminals included.</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Business Benefits */}
            <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Business Benefits
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Detailed Reporting</h4>
                      <p className="text-sm text-slate-600">Real-time dashboard with sales analytics, transaction history, and business insights</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Integrated Invoicing</h4>
                      <p className="text-sm text-slate-600">Send professional invoices and accept online payments from customers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">24/7 Support</h4>
                      <p className="text-sm text-slate-600">Live customer support available whenever you need help</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Chargeback Protection</h4>
                      <p className="text-sm text-slate-600">Industry-leading fraud prevention and chargeback management tools</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* What You Get */}
            <Card variant="bordered" className="bg-blue-50 border-blue-200">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  What's Included
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Free SmartPOS terminal with receipt printer</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Unlimited processing volume</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Next-day deposits to your business account</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Online merchant portal for tracking sales</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Mobile app for on-the-go management</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Free software updates and maintenance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">PCI-compliant security standards</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Integration with accounting software</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => navigate('/merchant/merchant-services/application')}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Apply for Credit Card Processing
              </Button>
            </div>
          </div>
        )}

        {/* Loyalty Program Tab */}
        {activeTab === 'loyalty' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card variant="bordered" className="bg-gradient-to-br from-pink-50 to-rose-50">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-start flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Go Loyalty System</h2>
                      <p className="text-slate-700 mb-4">
                        Fully integrated loyalty and rewards system built directly into your POS. Turn one-time buyers into lifelong customers.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-rose-600 mr-2" />
                          <span>Points-based rewards</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-rose-600 mr-2" />
                          <span>Custom program setup</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-rose-600 mr-2" />
                          <span>POS integration</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-rose-600 mr-2" />
                          <span>Automated marketing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Core Features */}
              <Card variant="bordered">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-600" />
                    Core Features
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        Points-Based Rewards
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Customers earn points per purchase</li>
                        <li className="text-sm text-slate-600">• Redeem for discounts, free items, or perks</li>
                        <li className="text-sm text-slate-600">• Works for restaurants, retail, and service businesses</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        Custom Program Setup
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Visit-based rewards (e.g., "Buy 5 get 1 free")</li>
                        <li className="text-sm text-slate-600">• Spend-based rewards ($1 = 1 point)</li>
                        <li className="text-sm text-slate-600">• Tier/VIP systems for top customers</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-green-500" />
                        POS Integration
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Works inside SmartPOS and Verifone</li>
                        <li className="text-sm text-slate-600">• No extra apps needed for staff</li>
                        <li className="text-sm text-slate-600">• Seamless checkout experience</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Customer Insights & Marketing */}
              <Card variant="bordered">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Customer Insights & Marketing
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        Customer Tracking
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Track purchase history</li>
                        <li className="text-sm text-slate-600">• Monitor visit frequency</li>
                        <li className="text-sm text-slate-600">• Analyze spending habits</li>
                        <li className="text-sm text-slate-600">• Identify high-value customers</li>
                        <li className="text-sm text-slate-600">• Spot at-risk customers</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Automated Marketing Tools
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Send promotions automatically</li>
                        <li className="text-sm text-slate-600">• Trigger win-back campaigns</li>
                        <li className="text-sm text-slate-600">• Example: "Haven't visited in 14 days → send offer"</li>
                        <li className="text-sm text-slate-600">• Birthday rewards</li>
                        <li className="text-sm text-slate-600">• Loyalty reminders</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Business Impact */}
            <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Business Impact
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Repeat className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Increase Repeat Visits</h4>
                      <p className="text-sm text-slate-600">Customers come back more frequently to earn and redeem rewards</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Raise Average Ticket Size</h4>
                      <p className="text-sm text-slate-600">Customers spend more to reach reward thresholds</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Build Customer Database</h4>
                      <p className="text-sm text-slate-600">Collect valuable data on your best customers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white rounded-lg p-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Long-Term Relationships</h4>
                      <p className="text-sm text-slate-600">Transform one-time buyers into loyal clients</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Best Use Cases */}
            <Card variant="bordered">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900">Perfect For</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="font-medium text-slate-900">Restaurants</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-8 h-8 text-pink-600" />
                    </div>
                    <p className="font-medium text-slate-900">Salons & Spas</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="font-medium text-slate-900">Retail Shops</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="font-medium text-slate-900">Service Businesses</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => navigate('/merchant/merchant-services/application')}
              >
                <Heart className="w-5 h-5 mr-2" />
                Get Started with Loyalty Program
              </Button>
            </div>
          </div>
        )}

        {/* Gift Cards Tab */}
        {activeTab === 'giftcards' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-sky-50">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-start flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Gift Card Program</h2>
                      <p className="text-slate-700 mb-4">
                        Fully customizable gift card program (physical + digital) tied into your POS. Immediate cash flow and customer acquisition tool.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-blue-600 mr-2" />
                          <span>Physical & digital cards</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-blue-600 mr-2" />
                          <span>Branded design</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-blue-600 mr-2" />
                          <span>Balance tracking</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-blue-600 mr-2" />
                          <span>No-cost setup</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Features */}
              <Card variant="bordered">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Key Features
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-blue-500" />
                        Physical + Digital Gift Cards
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Sell in-store OR online</li>
                        <li className="text-sm text-slate-600">• Digital cards can be texted or emailed</li>
                        <li className="text-sm text-slate-600">• Scanned via phone at checkout</li>
                        <li className="text-sm text-slate-600">• Instant delivery options</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        Branded Cards
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Custom design with your logo</li>
                        <li className="text-sm text-slate-600">• Perfect for holidays and promotions</li>
                        <li className="text-sm text-slate-600">• Great for local marketing</li>
                        <li className="text-sm text-slate-600">• Professional appearance</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-green-500" />
                        Balance Tracking & Redemption
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Track remaining balances</li>
                        <li className="text-sm text-slate-600">• View usage history</li>
                        <li className="text-sm text-slate-600">• Seamless checkout integration</li>
                        <li className="text-sm text-slate-600">• Real-time updates</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Revenue Benefits */}
              <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Revenue Benefits
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Immediate Cash Flow</h4>
                          <p className="text-sm text-slate-600">You get paid BEFORE service is delivered. Money in your account today for services you'll provide later.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Breakage Revenue</h4>
                          <p className="text-sm text-slate-600"><strong>18% of gift cards are never fully used</strong> — that's extra profit on prepaid revenue.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Customer Acquisition</h4>
                          <p className="text-sm text-slate-600">Someone new walks in using a gifted card — instant new customer opportunity.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Average Overspend</h4>
                          <p className="text-sm text-slate-600">Customers typically spend 20-30% more than the card value when redeeming.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Best Use Cases */}
            <Card variant="bordered">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900">Perfect For</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-8 h-8 text-orange-600" />
                    </div>
                    <p className="font-medium text-slate-900">Restaurants</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-8 h-8 text-pink-600" />
                    </div>
                    <p className="font-medium text-slate-900">Salons</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="font-medium text-slate-900">Home Services</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="font-medium text-slate-900">Retail Shops</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Important Note */}
            <Card variant="bordered" className="bg-blue-50 border-blue-200">
              <CardBody>
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Gift Cards = Free Ad Space in Customer Wallets</h4>
                    <p className="text-sm text-slate-600">
                      Gift certificates are old and outdated. Upgrade to free customized gift cards that serve as constant brand reminders. Every time someone opens their wallet, they see your business — that's powerful, ongoing marketing at zero cost.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => navigate('/merchant/merchant-services/application')}
              >
                <Gift className="w-5 h-5 mr-2" />
                Get Started with Gift Cards
              </Button>
            </div>
          </div>
        )}

      </div>
    </BusinessHubLayout>
  );
}
