import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, TrendingUp, Mail, MessageSquare, Calendar, CheckCircle2, Zap, Target, Facebook, Instagram, Palette } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function AppointmentSettingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [adSpend, setAdSpend] = useState(20);
  const [customAdSpend, setCustomAdSpend] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLaunchAI = () => {
    alert('AI Appointment Booking configuration coming soon!');
  };

  const handleDFYSetup = () => {
    navigate('/merchant/services/appointment-setting/checkout', {
      state: { package: 'dfy_setup', price: 397 }
    });
  };

  const handleOptimization = () => {
    navigate('/merchant/services/appointment-setting/checkout', {
      state: { package: 'optimization', price: 297 }
    });
  };

  const handleAdSpendPurchase = async () => {
    if (!user) {
      alert('Please log in to purchase');
      return;
    }

    setIsProcessing(true);
    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id, business_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!merchant) {
        alert('Merchant profile not found');
        return;
      }

      // Create order or payment intent for ad spend
      alert(`Ad Spend Purchase: $${adSpend}/day configured. Integration with payment processor coming soon.`);
    } catch (error) {
      console.error('Error processing ad spend purchase:', error);
      alert('Failed to process purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSocialMediaAdDesignPurchase = async () => {
    if (!user) {
      alert('Please log in to purchase');
      return;
    }

    setIsProcessing(true);
    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id, business_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!merchant) {
        alert('Merchant profile not found');
        return;
      }

      // Create a job on the partner job board
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // 7 days from now

      const jobRequirements = `
Social Media Ad Design Service

Business: ${merchant.business_name}
Service: Professional Social Media Ad Design

The merchant has requested professional ad design services for their social media campaigns.

Deliverables:
- High-converting ad creative designs
- Multiple size formats (Feed, Story, Reel)
- Brand-aligned visuals
- Ad copy suggestions
- 3-5 design variations

Timeline: 7 days
Budget: $297
      `.trim();

      const { error: jobError } = await supabase
        .from('dfy_jobs')
        .insert({
          service_id: null,
          merchant_id: merchant.id,
          status: 'open',
          title: `Social Media Ad Design - ${merchant.business_name}`,
          requirements: jobRequirements,
          merchant_budget_cents: 29700, // $297
          due_date: dueDate.toISOString()
        });

      if (jobError) throw jobError;

      alert('Social Media Ad Design service purchased! A partner will be assigned to work with you shortly.');

    } catch (error) {
      console.error('Error processing social media ad design purchase:', error);
      alert('Failed to process purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomAdSpendChange = (value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 20 && num <= 10000)) {
      setCustomAdSpend(value);
      if (num >= 20) {
        setAdSpend(num);
      }
    }
  };

  return (
    <BusinessHubLayout>
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Bot className="w-4 h-4" />
            AI-Powered System
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            AI Appointment Booking
          </h1>
          <p className="text-xl text-slate-600">
            Turn $20/day in ads into booked appointments — fully automated
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Attention-Grabbing Ads</h3>
                <p className="text-slate-600 text-sm">
                  High-converting Facebook ads that capture attention
                </p>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">AI Handles Everything</h3>
                <p className="text-slate-600 text-sm">
                  AI qualifies leads and books appointments automatically
                </p>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-orange-50 to-amber-50">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Cold Calls</h3>
                <p className="text-slate-600 text-sm">
                  No staff, no hourly fees, no contracts
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardBody>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">AI Email & SMS Outreach</h3>
                    <p className="text-slate-300 text-sm">Personalized messages that feel human</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Facebook & Instagram DM Automation</h3>
                    <p className="text-slate-300 text-sm">Instant responses to every message</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">AI Lead Qualification</h3>
                    <p className="text-slate-300 text-sm">AI handles objections and qualifies leads</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Calendar Booking & Reminders</h3>
                    <p className="text-slate-300 text-sm">Appointments booked directly on your calendar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">CRM Updates Automatically</h3>
                    <p className="text-slate-300 text-sm">Every conversation tracked and logged</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">24/7 Automated Follow-ups</h3>
                    <p className="text-slate-300 text-sm">Never miss a lead with smart sequences</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
            </CardHeader>
            <CardBody>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Connect your leads</h4>
                    <p className="text-sm text-slate-600">
                      CRM, ads, lists — AI starts working immediately
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">AI starts personalized outreach</h4>
                    <p className="text-sm text-slate-600">
                      Email, SMS, and social DMs sent automatically
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">AI qualifies & handles objections</h4>
                    <p className="text-sm text-slate-600">
                      Conversations that feel natural and helpful
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Qualified leads book themselves</h4>
                    <p className="text-sm text-slate-600">
                      You show up to booked, qualified appointments
                    </p>
                  </div>
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <h2 className="text-2xl font-bold text-slate-900">Pricing</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">Ad Spend</h3>
                    <span className="text-2xl font-bold text-slate-900">${adSpend}<span className="text-base text-slate-600">/day</span></span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    About ${Math.round(adSpend * 30)}/month in high-converting Facebook ads
                  </p>

                  <div className="mb-3">
                    <label className="text-xs font-semibold text-slate-700 mb-2 block">Quick Select:</label>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setAdSpend(20)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          adSpend === 20
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        $20/day
                      </button>
                      <button
                        onClick={() => setAdSpend(40)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          adSpend === 40
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        $40/day
                      </button>
                      <button
                        onClick={() => setAdSpend(60)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          adSpend === 60
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        $60/day
                      </button>
                    </div>

                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Custom Amount (min $20/day):</label>
                    <Input
                      type="number"
                      min="20"
                      placeholder="Enter custom amount"
                      value={customAdSpend}
                      onChange={(e) => handleCustomAdSpendChange(e.target.value)}
                      className="mb-3"
                    />
                  </div>

                  <Button
                    fullWidth
                    onClick={handleAdSpendPurchase}
                    disabled={isProcessing}
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    {isProcessing ? 'Processing...' : 'Set Up Ad Budget'}
                  </Button>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-[#2BB673]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">DFY Setup</h3>
                    <span className="text-2xl font-bold text-[#2BB673]">$397<span className="text-base text-slate-600"> one-time</span></span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    We build and launch your AI system for you
                  </p>
                  <Button
                    fullWidth
                    onClick={handleDFYSetup}
                    className="bg-[#2BB673] hover:bg-[#25a062]"
                  >
                    We'll Set It Up
                  </Button>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">Monthly Optimization</h3>
                    <span className="text-2xl font-bold text-blue-600">$297<span className="text-base text-slate-600">/month</span></span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Ongoing campaign management & improvements
                  </p>
                  <p className="text-xs text-slate-500 mb-3 italic">
                    Optional but recommended
                  </p>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={handleOptimization}
                  >
                    Add Optimization
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-slate-900">Social Media Ad Design</h3>
                  </div>
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-orange-600 mb-1">$297<span className="text-base text-slate-600"> one-time</span></div>
                    <p className="text-sm text-slate-600 mb-2">
                      Professional ad creative design by our expert partners
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1 mb-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-3 h-3 text-orange-600 mr-1 mt-0.5 flex-shrink-0" />
                        <span>3-5 high-converting ad design variations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-3 h-3 text-orange-600 mr-1 mt-0.5 flex-shrink-0" />
                        <span>Multiple formats (Feed, Story, Reel)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-3 h-3 text-orange-600 mr-1 mt-0.5 flex-shrink-0" />
                        <span>Brand-aligned visuals & ad copy suggestions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-3 h-3 text-orange-600 mr-1 mt-0.5 flex-shrink-0" />
                        <span>7-day turnaround</span>
                      </li>
                    </ul>
                  </div>
                  <Button
                    fullWidth
                    onClick={handleSocialMediaAdDesignPurchase}
                    disabled={isProcessing}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isProcessing ? 'Processing...' : 'Order Ad Design'}
                  </Button>
                  <p className="text-xs text-slate-500 mt-2 text-center italic">
                    Work done by vetted partner designers
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-slate-700 text-center">
                  <strong>Total:</strong> ${adSpend}/day + $397 setup + $297/mo optimization (optional)
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-orange-50 to-amber-50">
          <CardBody>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why This Is Better Than Cold Calling
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <p className="text-slate-700 font-medium">Never Stops Working</p>
                  <p className="text-sm text-slate-600 mt-1">AI works around the clock</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">$0</div>
                  <p className="text-slate-700 font-medium">No Hourly Labor</p>
                  <p className="text-sm text-slate-600 mt-1">No staff or payroll costs</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
                  <p className="text-slate-700 font-medium">Infinite Scale</p>
                  <p className="text-sm text-slate-600 mt-1">Handle unlimited leads</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleLaunchAI}
            className="bg-[#2BB673] hover:bg-[#25a062] text-lg px-8 py-6"
          >
            <Zap className="w-5 h-5 mr-2" />
            Launch AI Ads & Booking
          </Button>
          <p className="text-sm text-slate-500 mt-3">
            Modern, scalable, and more profitable than cold calling
          </p>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
