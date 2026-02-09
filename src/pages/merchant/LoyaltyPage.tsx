import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Gift, TrendingUp, MessageSquare, X, Download, Upload, CheckCircle, FileText } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function LoyaltyPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    loadContracts();
  }, [profile]);

  const loadContracts = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_contract_uploads')
        .select('*')
        .eq('merchant_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowContractModal(true);
  };

  const handleDownloadContract = () => {
    const link = document.createElement('a');
    link.href = '/repeat-business-program-client-agreement-79_99_159.pdf';
    link.download = 'repeat-business-program-contract.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile || !selectedPlan) return;

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `loyalty-contracts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('loyalty_contract_uploads')
        .insert({
          merchant_id: profile.id,
          plan_name: selectedPlan.name,
          plan_price: selectedPlan.price,
          contract_url: publicUrl,
          submitted_at: new Date().toISOString(),
          status: 'pending'
        });

      if (dbError) throw dbError;

      setSuccess('Contract uploaded successfully! We will review it and contact you soon.');
      setShowContractModal(false);
      loadContracts();
    } catch (error) {
      console.error('Error uploading contract:', error);
      setError('Failed to upload contract. Please try again or email it to apptpipeline@gmail.com');
    } finally {
      setUploading(false);
    }
  };

  const loyaltyPlans = [
    {
      name: '$79 Plan',
      price: 79,
      sms: 500,
      overageRate: 9.9,
      features: [
        '500 FREE SMS messages/month',
        'FREE Kiosk ($500 value)',
        'FREE Signage ($200 value)',
        'Opt-in signage package included',
        'SMS overages at 9.9¢ per message'
      ]
    },
    {
      name: '$99 Plan',
      price: 99,
      sms: 750,
      overageRate: 8.9,
      features: [
        '750 FREE SMS messages/month',
        'FREE Kiosk ($500 value)',
        'FREE Signage ($200 value)',
        'Opt-in signage package included',
        'SMS overages at 8.9¢ per message'
      ],
      popular: true
    },
    {
      name: '$159 Plan',
      price: 159,
      sms: 1500,
      overageRate: 7.9,
      features: [
        '1,500 FREE SMS messages/month',
        'FREE Kiosk ($500 value)',
        'FREE Signage ($200 value)',
        'Opt-in signage package included',
        'SMS overages at 7.9¢ per message'
      ]
    }
  ];

  const getPlanStatus = (planPrice: number) => {
    const contract = contracts.find(c => c.plan_price === planPrice);
    return contract?.status || null;
  };

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        {showContractModal && selectedPlan && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Complete Your Agreement</h2>
                  <p className="text-sm text-slate-600">Selected: {selectedPlan.name} - ${selectedPlan.price}/month</p>
                </div>
                <button
                  onClick={() => setShowContractModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <Card variant="bordered" className="bg-blue-50 border-blue-200">
                  <CardBody>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Step 1: Download & Complete Contract
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Download the Repeat Business Program Client Agreement, print it, fill it out completely, and sign it.
                    </p>
                    <Button
                      onClick={handleDownloadContract}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Contract PDF
                    </Button>
                  </CardBody>
                </Card>

                <Card variant="bordered" className="bg-[#2BB673]/5 border-[#2BB673]/20">
                  <CardBody>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <Upload className="w-5 h-5 mr-2 text-[#2BB673]" />
                      Step 2: Upload Signed Contract
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Once completed and signed, upload your contract here or email it to{' '}
                      <a href="mailto:apptpipeline@gmail.com" className="text-[#2BB673] font-semibold hover:underline">
                        apptpipeline@gmail.com
                      </a>
                    </p>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        id="contract-upload"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="contract-upload"
                        className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-600 font-medium mb-1">
                          {uploading ? 'Uploading...' : 'Click to upload signed contract'}
                        </p>
                        <p className="text-sm text-slate-500">PDF, JPG, or PNG (max 10MB)</p>
                      </label>
                    </div>
                  </CardBody>
                </Card>

                <Card variant="bordered">
                  <CardBody>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-orange-600" />
                      Alternative: Email Your Contract
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Prefer to email? Send your completed contract to:
                    </p>
                    <a
                      href="mailto:apptpipeline@gmail.com"
                      className="text-[#2BB673] font-semibold text-lg hover:underline"
                    >
                      apptpipeline@gmail.com
                    </a>
                    <p className="text-xs text-slate-500 mt-2">
                      Please include your business name and selected plan in the email subject line
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Drive Repeat Business</h1>
          <p className="text-slate-600 mt-2">
            We will increase the number of times your customers do business with you!
          </p>
        </div>

        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <p className="text-red-800 font-medium">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {success && (
          <Card variant="bordered" className="border-green-300 bg-green-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSuccess(null)}>
                  Dismiss
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {contracts.length > 0 && (
          <Card variant="bordered" className="bg-blue-50 border-blue-200">
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">Your Contract Submissions</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">{contract.plan_name}</p>
                      <p className="text-sm text-slate-600">
                        Submitted: {new Date(contract.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      contract.status === 'approved' ? 'bg-green-100 text-green-800' :
                      contract.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="bordered">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#2BB673]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#2BB673]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Build Your List</h3>
                <p className="text-slate-600 text-sm">
                  Customers text a keyword to join your loyalty program
                </p>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Send Campaigns</h3>
                <p className="text-slate-600 text-sm">
                  Broadcast deals, updates, and promotions to your entire list
                </p>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Drive Revenue</h3>
                <p className="text-slate-600 text-sm">
                  Get customers to return 2-3x more often with timely messages
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Choose Your SMS Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loyaltyPlans.map((plan) => {
              const status = getPlanStatus(plan.price);
              return (
                <Card
                  key={plan.name}
                  variant="bordered"
                  className={plan.popular ? 'ring-2 ring-[#2BB673] relative' : ''}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#2BB673] text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-3xl font-bold text-[#2BB673] mt-2">${plan.price}/mo</p>
                    <p className="text-sm text-slate-500 mt-1">{plan.sms} FREE SMS messages</p>
                  </CardHeader>
                  <CardBody>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start">
                          <span className="text-[#2BB673] mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {status ? (
                      <div className={`p-3 rounded-lg text-center font-semibold ${
                        status === 'approved' ? 'bg-green-100 text-green-800' :
                        status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {status === 'pending' && 'Contract Under Review'}
                        {status === 'approved' && 'Active Plan'}
                        {status === 'rejected' && 'Contract Rejected'}
                      </div>
                    ) : (
                      <Button
                        fullWidth
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handleSelectPlan(plan)}
                        className={plan.popular ? 'bg-[#2BB673] hover:bg-[#25a062]' : ''}
                      >
                        Select Plan
                      </Button>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        <Card variant="bordered" className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">What's Included in All Plans</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">FREE Kiosk</h4>
                  <p className="text-sm text-slate-600">Physical kiosk for in-store sign-ups ($500 value)</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">FREE Opt-In Signage</h4>
                  <p className="text-sm text-slate-600">Banner, cards, digital sign, social media graphics ($200 value)</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Automated Programs</h4>
                  <p className="text-sm text-slate-600">Bounce back, birthday rewards, anniversary offers, punch card</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Advanced Analytics</h4>
                  <p className="text-sm text-slate-600">Check-in tracking and campaign performance metrics</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">How It Works</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  title: 'Choose Keyword',
                  desc: 'Pick a keyword like "PIZZA" or "DEALS"'
                },
                {
                  step: '2',
                  title: 'Promote It',
                  desc: 'Customers text your keyword to join'
                },
                {
                  step: '3',
                  title: 'Send Campaigns',
                  desc: 'Broadcast messages to your list'
                },
                {
                  step: '4',
                  title: 'Track Results',
                  desc: 'See opens, clicks, and redemptions'
                }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-[#2BB673] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-gradient-to-br from-[#2BB673]/5 to-[#25a062]/5">
          <CardBody>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#2BB673]/10 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-[#2BB673]" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Integrate with Marketplace Deals
                </h3>
                <p className="text-slate-600 mb-3">
                  When customers purchase your marketplace deals, they're automatically added to your loyalty list.
                  Send them follow-up messages and exclusive offers to keep them coming back.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/merchant/deals')}
                >
                  View Your Deals
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="bordered" className="bg-blue-50">
            <CardBody>
              <h3 className="font-bold text-slate-900 mb-3">Campaign Ideas</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Welcome message with exclusive offer</li>
                <li>• Birthday/anniversary specials</li>
                <li>• Flash sales and limited-time deals</li>
                <li>• New product announcements</li>
                <li>• Re-engagement for inactive customers</li>
                <li>• Event invitations</li>
              </ul>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-purple-50">
            <CardBody>
              <h3 className="font-bold text-slate-900 mb-3">Best Practices</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Send 2-4 messages per month</li>
                <li>• Include clear call-to-action</li>
                <li>• Make offers time-sensitive</li>
                <li>• Personalize with customer name</li>
                <li>• Always include opt-out option</li>
                <li>• Track which messages perform best</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
