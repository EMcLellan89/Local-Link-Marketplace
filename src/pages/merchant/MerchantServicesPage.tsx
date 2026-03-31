import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Gift, TrendingUp, DollarSign, Check, Heart, Repeat, Sparkles, Users, Award, Target, Star, BarChart3, Zap, ShoppingBag, Info, Shield, TrendingDown, Clock, FileText, Calculator, ArrowRight } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import Input from '../../components/ui/Input';

type Tab = 'processing' | 'loyalty' | 'giftcards' | 'capital';

export default function MerchantServicesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('processing');

  // Savings Calculator State
  const [monthlyVolume, setMonthlyVolume] = useState<string>('');
  const [currentRate, setCurrentRate] = useState<string>('');
  const [monthlyFees, setMonthlyFees] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const calculateSavings = () => {
    if (!monthlyVolume || !currentRate) return null;

    const volume = parseFloat(monthlyVolume);
    const rate = parseFloat(currentRate);
    const fees = parseFloat(monthlyFees || '0');

    // Current costs
    const currentProcessingCost = (volume * rate) / 100;
    const currentTotalCost = currentProcessingCost + fees;

    // Our rate (average competitive rate)
    const ourRate = 2.29; // Competitive rate
    const ourProcessingCost = (volume * ourRate) / 100;
    const ourTotalCost = ourProcessingCost; // No monthly fees

    // Savings
    const monthlySavings = currentTotalCost - ourTotalCost;
    const annualSavings = monthlySavings * 12;
    const savingsPercentage = ((monthlySavings / currentTotalCost) * 100).toFixed(1);

    return {
      currentProcessingCost: currentProcessingCost.toFixed(2),
      currentTotalCost: currentTotalCost.toFixed(2),
      ourProcessingCost: ourProcessingCost.toFixed(2),
      ourTotalCost: ourTotalCost.toFixed(2),
      monthlySavings: monthlySavings.toFixed(2),
      annualSavings: annualSavings.toFixed(2),
      savingsPercentage,
      ourRate: ourRate.toFixed(2)
    };
  };

  const handleCalculate = () => {
    if (monthlyVolume && currentRate) {
      setShowResults(true);
    }
  };

  const savings = calculateSavings();

  const tabs = [
    { id: 'processing' as Tab, label: 'Credit Card Processing', icon: CreditCard },
    { id: 'loyalty' as Tab, label: 'Loyalty Program', icon: Heart },
    { id: 'giftcards' as Tab, label: 'Gift Cards', icon: Gift },
    { id: 'capital' as Tab, label: 'Business Capital', icon: TrendingUp },
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

            {/* Savings Calculator */}
            <Card variant="bordered" className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
              <CardHeader>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-emerald-600" />
                  Savings Calculator
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Compare your current processing costs with our competitive rates and see how much you could save
                </p>
              </CardHeader>
              <CardBody>
                <div className="bg-white rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Monthly Card Volume
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <Input
                          type="number"
                          value={monthlyVolume}
                          onChange={(e) => {
                            setMonthlyVolume(e.target.value);
                            setShowResults(false);
                          }}
                          placeholder="10,000"
                          className="pl-7"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Total card sales per month</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Current Processing Rate
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          value={currentRate}
                          onChange={(e) => {
                            setCurrentRate(e.target.value);
                            setShowResults(false);
                          }}
                          placeholder="2.9"
                          className="pr-7"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Your current processing rate</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Monthly Fees (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <Input
                          type="number"
                          value={monthlyFees}
                          onChange={(e) => {
                            setMonthlyFees(e.target.value);
                            setShowResults(false);
                          }}
                          placeholder="0"
                          className="pl-7"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Statement fees, minimums, etc.</p>
                    </div>
                  </div>

                  <div className="flex justify-center mb-6">
                    <Button
                      onClick={handleCalculate}
                      disabled={!monthlyVolume || !currentRate}
                      size="lg"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate My Savings
                    </Button>
                  </div>

                  {showResults && savings && parseFloat(savings.monthlySavings) > 0 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg p-6 text-white">
                        <div className="text-center">
                          <p className="text-emerald-100 text-sm font-medium mb-2">Your Estimated Annual Savings</p>
                          <p className="text-5xl font-bold mb-2">${Number(savings.annualSavings).toLocaleString()}</p>
                          <p className="text-emerald-100 text-lg">
                            That's ${Number(savings.monthlySavings).toLocaleString()}/month
                          </p>
                          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <TrendingDown className="w-5 h-5" />
                            <span className="font-semibold">{savings.savingsPercentage}% savings</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5 text-slate-600" />
                            Your Current Costs
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Processing ({currentRate}%)</span>
                              <span className="font-medium text-slate-900">${Number(savings.currentProcessingCost).toLocaleString()}</span>
                            </div>
                            {parseFloat(monthlyFees || '0') > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Monthly Fees</span>
                                <span className="font-medium text-slate-900">${Number(monthlyFees).toLocaleString()}</span>
                              </div>
                            )}
                            <div className="border-t border-slate-300 pt-2 flex justify-between font-semibold">
                              <span className="text-slate-900">Total/Month</span>
                              <span className="text-slate-900">${Number(savings.currentTotalCost).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <Star className="w-5 h-5 text-emerald-600" />
                            Our Competitive Pricing
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Processing ({savings.ourRate}%)</span>
                              <span className="font-medium text-slate-900">${Number(savings.ourProcessingCost).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Monthly Fees</span>
                              <span className="font-medium text-emerald-600">$0</span>
                            </div>
                            <div className="border-t border-emerald-300 pt-2 flex justify-between font-semibold">
                              <span className="text-slate-900">Total/Month</span>
                              <span className="text-emerald-600">${Number(savings.ourTotalCost).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-slate-700">
                            <p className="font-semibold text-slate-900 mb-1">This is an estimate based on the information provided</p>
                            <p>Actual rates may vary based on your business type, processing volume, and card mix. We'll provide a personalized quote after reviewing your processing statements.</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-4">
                        <Button
                          size="lg"
                          onClick={() => navigate('/merchant/merchant-services/application')}
                        >
                          Get My Custom Quote
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <p className="text-sm text-slate-600 mt-2">
                          No obligation. Free rate review of your current statement.
                        </p>
                      </div>
                    </div>
                  )}

                  {showResults && savings && parseFloat(savings.monthlySavings) <= 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <Info className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-slate-900 mb-2">You Already Have Great Rates!</h4>
                      <p className="text-slate-700 mb-4">
                        Based on your current rate of {currentRate}%, you're already getting competitive pricing. However, we might still be able to help with:
                      </p>
                      <div className="text-left max-w-md mx-auto space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-slate-700">Eliminating monthly fees</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-slate-700">Better equipment and technology</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-slate-700">Superior customer service</span>
                        </div>
                      </div>
                      <Button onClick={() => navigate('/merchant/merchant-services/application')}>
                        Get a Free Rate Review
                      </Button>
                    </div>
                  )}
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

        {/* Business Capital Tab */}
        {activeTab === 'capital' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card variant="bordered" className="bg-gradient-to-br from-emerald-50 to-green-50">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-start flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Business Capital & Funding by PayBright</h2>
                      <p className="text-slate-700 mb-4">
                        Fast, flexible funding solutions for small and medium-sized businesses. Same-day or next-day funding available.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-green-600 mr-2" />
                          <span>Same/next-day funding</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-green-600 mr-2" />
                          <span>Flexible repayment</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-green-600 mr-2" />
                          <span>Based on sales, not credit</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Check className="w-5 h-5 text-green-600 mr-2" />
                          <span>Expert support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Funding Types */}
              <Card variant="bordered">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Funding Options
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Merchant Cash Advances (MCA)
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Advance based on future sales</li>
                        <li className="text-sm text-slate-600">• Paid back via daily card sales percentage</li>
                        <li className="text-sm text-slate-600">• No fixed monthly payment</li>
                        <li className="text-sm text-slate-600">• Perfect for seasonal businesses</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                        Small Business Loans
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Fixed repayment structure</li>
                        <li className="text-sm text-slate-600">• Larger funding amounts possible</li>
                        <li className="text-sm text-slate-600">• Predictable payments</li>
                        <li className="text-sm text-slate-600">• Traditional loan structure</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        Revenue-Based Financing
                      </h4>
                      <ul className="space-y-2 ml-6">
                        <li className="text-sm text-slate-600">• Payments scale with your income</li>
                        <li className="text-sm text-slate-600">• Lower payments during slow periods</li>
                        <li className="text-sm text-slate-600">• Higher payments during busy seasons</li>
                        <li className="text-sm text-slate-600">• Matches your cash flow</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Key Features */}
              <Card variant="bordered">
                <CardHeader>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    Key Features
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Fast Funding</h4>
                          <p className="text-sm text-slate-600">Same-day and next-day approvals available. Get cash when you need it most.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Based on Sales</h4>
                          <p className="text-sm text-slate-600">Easier approval vs banks. We look at your sales, not just credit score.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Repeat className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Flexible Repayment</h4>
                          <p className="text-sm text-slate-600">Payments adjust with revenue. Slow month? Lower payment. Busy season? Pay faster.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Expert Support</h4>
                          <p className="text-sm text-slate-600">Led by fintech experts. Recognized on the Inc. 5000 list.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Common Use Cases */}
            <Card variant="bordered" className="bg-gradient-to-br from-slate-50 to-gray-50">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Common Use Cases
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Marketing Campaigns</h4>
                    <p className="text-sm text-slate-600">Fund new customer acquisition and advertising initiatives</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Hiring Staff</h4>
                    <p className="text-sm text-slate-600">Bring on new team members to handle growth</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                      <ShoppingBag className="w-6 h-6 text-amber-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Buying Equipment</h4>
                    <p className="text-sm text-slate-600">Invest in tools and machinery to scale operations</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Expanding Locations</h4>
                    <p className="text-sm text-slate-600">Open new stores or service areas</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-3">
                      <TrendingUp className="w-6 h-6 text-rose-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Covering Slow Seasons</h4>
                    <p className="text-sm text-slate-600">Bridge cash flow gaps during off-peak times</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                      <Award className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Inventory Purchases</h4>
                    <p className="text-sm text-slate-600">Stock up for busy seasons or take advantage of bulk discounts</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Ideal For */}
            <Card variant="bordered" className="bg-blue-50 border-blue-200">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  Ideal For Businesses That
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Need quick capital to seize opportunities</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Don't qualify for traditional bank loans</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Have steady card sales and revenue</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">Want flexible, revenue-matched payments</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => navigate('/merchant/business-capital')}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Apply for Business Capital
              </Button>
              <p className="text-sm text-slate-600 mt-2">
                Fast approval. Funds as soon as next business day.
              </p>
            </div>
          </div>
        )}

      </div>
    </BusinessHubLayout>
  );
}
