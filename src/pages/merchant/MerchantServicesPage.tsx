import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, DollarSign, Zap, ShoppingBag, Shield, Gift, Info } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';

export default function MerchantServicesPage() {
  const navigate = useNavigate();
  const [monthlyVolume, setMonthlyVolume] = useState<number>(10000);
  const [processingRate, setProcessingRate] = useState<number>(2.9);
  const [processor, setProcessor] = useState<string>('Square');
  const [monthlySavings, setMonthlySavings] = useState<number>(0);
  const [annualSavings, setAnnualSavings] = useState<number>(0);

  useEffect(() => {
    calculateSavings();
  }, [monthlyVolume, processingRate]);

  const calculateSavings = () => {
    if (monthlyVolume && processingRate) {
      const currentFees = (monthlyVolume * processingRate) / 100;
      const monthly = currentFees;
      const annual = monthly * 12;

      setMonthlySavings(monthly);
      setAnnualSavings(annual);
    } else {
      setMonthlySavings(0);
      setAnnualSavings(0);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">0% Processing Fees</h1>
          <p className="text-slate-600 mt-2">
            Save thousands per month on credit card processing
          </p>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-start flex-1">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Save Thousands Every Year</h3>
                  <p className="text-slate-600 mb-2">
                    Switch to 0% processing and save $500-$1,500 every month
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-center text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      No monthly fees
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      Free terminal included
                    </li>
                    <li className="flex items-center text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      Next-day funding once approved
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Calculate Your Savings</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Monthly Processing Volume
                  </label>
                  <Input
                    type="number"
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                    placeholder="10000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Processing Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={processingRate}
                    onChange={(e) => setProcessingRate(Number(e.target.value))}
                    placeholder="2.9"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Processor
                  </label>
                  <select
                    value={processor}
                    onChange={(e) => setProcessor(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                  >
                    <option>Square</option>
                    <option>Stripe</option>
                    <option>PayPal</option>
                    <option>Clover</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600">Monthly Savings</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Annual Savings</span>
                    <span className="text-xl font-bold text-green-600">
                      ${annualSavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={() => navigate('/merchant/merchant-services/application')}
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Apply Now
                </Button>
              </div>
            </CardBody>
          </Card>

          <div className="space-y-6">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">How It Works</h2>
              </CardHeader>
              <CardBody>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Apply in 5 Minutes</h4>
                      <p className="text-sm text-slate-600">
                        Quick and easy application process
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Underwriting Review</h4>
                      <p className="text-sm text-slate-600">
                        Approval typically takes about one week
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Get Your Terminal</h4>
                      <p className="text-sm text-slate-600">
                        Free card reader ships in 2-3 business days after approval
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Start Saving</h4>
                      <p className="text-sm text-slate-600">
                        Process payments with 0% fees and next-day funding
                      </p>
                    </div>
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card variant="bordered" className="bg-blue-50">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-3">Perks of Gift Cards</h3>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-600 mb-3">
                    <strong className="text-slate-900">18% of gift cards remain unredeemed</strong>, leading to more profits for your business.
                  </p>
                  <p className="text-sm text-slate-600">
                    Gift certificates are old and outdated, upgrade to free customized gift cards. Plus, gift cards serve as free ad space in your customers wallets — let's take advantage of it.
                  </p>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Included Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 mr-2" />
                    No monthly fees or hidden charges
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 mr-2" />
                    Accept all major credit cards
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 mr-2" />
                    Next-day funding to your bank
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 mr-2" />
                    Free POS terminal included
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 mr-2" />
                    24/7 customer support
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-slate-50 to-gray-50">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900 text-center">Payment Processing Options</h2>
            <p className="text-slate-600 text-center mt-2">
              Choose the pricing structure that works best for your business
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">Cash Discount / Dual Pricing</h3>
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED - 0% PROCESSING</span>
                    </div>
                    <p className="text-slate-700 mb-3">
                      <strong className="text-green-700">This is our most popular option and what we advertise!</strong> With cash discount/dual pricing, you pass credit card processing fees to your customers who choose to pay with a card, while offering a discount to cash-paying customers. This allows you to eliminate processing fees entirely and keep 100% of your revenue.
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">Perfect For:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Businesses that want to eliminate processing fees completely
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          High-volume merchants looking to maximize profits
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Businesses in competitive markets where every dollar counts
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Merchants who want transparent, straightforward pricing
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Flat Rate / Fee</h3>
                    <p className="text-slate-700 mb-3">
                      A simple, predictable pricing model where you pay the same percentage rate on every transaction, regardless of card type. This option provides consistency and easy budgeting, though rates are typically higher than other models to account for the processor's risk across all card types.
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">Perfect For:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          Small businesses with simple payment needs
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          Merchants who value pricing simplicity and predictability
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          Businesses with lower monthly processing volumes
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          Merchants who don't want to analyze complex fee structures
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Info className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Interchange Plus</h3>
                    <p className="text-slate-700 mb-3">
                      The most transparent pricing model where you pay the actual interchange fee (set by Visa/Mastercard) plus a small markup to your processor. This gives you the clearest view of your costs and typically results in lower overall fees for higher-volume businesses. However, rates can vary slightly by card type.
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">Perfect For:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                          Medium to high-volume businesses ($10k+ monthly)
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                          Merchants who want complete pricing transparency
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                          Businesses that understand credit card processing
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                          Merchants looking for the lowest possible effective rate
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">True Surcharging</h3>
                    <p className="text-slate-700 mb-3">
                      A pricing model where you add a surcharge (typically 3-4%) to credit card transactions only, while debit cards are processed at standard rates. Unlike cash discount programs, surcharging must comply with card brand rules and state regulations, including proper disclosure to customers and registration with card networks.
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">Perfect For:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                          Businesses in states where surcharging is legal
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                          Merchants who process mostly credit (not debit) cards
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                          Businesses willing to manage compliance requirements
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                          Merchants who want to offset credit card fees specifically
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Not Sure Which Option Is Right For You?</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      Our team can help you choose the best pricing structure for your business during the application review process. Most merchants benefit from our <strong>Cash Discount/Dual Pricing (0% processing)</strong> program, but we'll analyze your specific situation to find the perfect fit.
                    </p>
                    <p className="text-sm text-slate-600">
                      You'll be able to indicate your preference on the application, and our underwriting team will work with you to ensure you get the most cost-effective solution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900 text-center">No Hidden Fees</h2>
            <p className="text-slate-600 text-center mt-2">
              Clear pricing with no junk charges buried in fine print
            </p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">No Rate Increases</h4>
                  <p className="text-sm text-slate-600">
                    We guarantee your processing rates will never be increased by PayBright
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Month-to-Month Flexibility</h4>
                  <p className="text-sm text-slate-600">
                    We earn your business every month; no long-term lock-ins
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Free Equipment Options</h4>
                  <p className="text-sm text-slate-600">
                    Access to terminals and POS systems without surprise costs
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Rapid Human Support</h4>
                  <p className="text-sm text-slate-600">
                    Real people, quick responses, and a partner who cares
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  6
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Technology that Works</h4>
                  <p className="text-sm text-slate-600">
                    Solutions that grow with your business, not hold you back
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  7
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Full Transparency</h4>
                  <p className="text-sm text-slate-600">
                    Honest communication, clear reporting, and straightforward agreements
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  8
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Protection from Predatory Practices</h4>
                  <p className="text-sm text-slate-600">
                    No bait-and-switch teaser rates or hidden increases
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  9
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Leadership That's On Your Side</h4>
                  <p className="text-sm text-slate-600">
                    Access to a leadership team that stands behind you — every single day
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  10
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Shared Success</h4>
                  <p className="text-sm text-slate-600">
                    Your growth is our growth; we win only when you win
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="bordered" className="bg-gradient-to-br from-amber-50 to-orange-50">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">GET YOUR MONEY ASAP</h3>
                  <p className="text-slate-600">
                    We offer Next Day and Same Day funding options to help qualified merchants access their money faster and keep cash flow moving.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-sky-50">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">POINT OF SALE</h3>
                  <p className="text-slate-600">
                    Need the right system for your business? PayBright provides fully customized POS solutions tailored to fit every business type and size.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">NO 'GOTCHAS' PRICING</h3>
                  <p className="text-slate-600">
                    Our merchants benefit from ultra-competitive pricing and no surprise rate hikes—just transparent, consistent costs that help your business thrive.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-rose-50 to-pink-50">
            <CardBody>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Gift className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">VALUE ADDED SERVICES</h3>
                  <p className="text-slate-600">
                    From ACH, business loans, MCAs, gift cards, loyalty programs, and more — we give your business the tools to grow, retain customers, and operate smarter.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
