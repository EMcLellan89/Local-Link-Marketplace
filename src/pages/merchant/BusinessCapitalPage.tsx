import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, TrendingUp, Clock, Check } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function BusinessCapitalPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessType: 'LLC',
    industry: 'Retail',
    yearsInBusiness: 'Less than 1 year',
    requestedAmount: '',
    useOfFunds: 'Expand operations',
    monthlyRevenue: '',
    annualRevenue: 'Under $100,000',
    employees: 'Just me',
    creditScore: '700+ (Qualifies for 0% Financing)',
    hasEIN: 'Yes',
    hasBusinessAccount: 'Yes, for 3+ months',
    outstandingDebts: 'None'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        setError('You must be logged in to apply');
        setLoading(false);
        return;
      }

      const applicationData = {
        use_of_funds: formData.useOfFunds,
        business_type: formData.businessType,
        industry: formData.industry,
        years_in_business: formData.yearsInBusiness,
        monthly_revenue: formData.monthlyRevenue,
        annual_revenue: formData.annualRevenue,
        employees: formData.employees,
        credit_score: formData.creditScore,
        has_ein: formData.hasEIN === 'Yes',
        has_business_account: formData.hasBusinessAccount,
        outstanding_debts: formData.outstandingDebts,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        business_name: formData.businessName,
        business_address: formData.businessAddress,
        business_phone: formData.businessPhone
      };

      const { data: application, error: dbError } = await supabase
        .from('business_capital_applications')
        .insert({
          merchant_id: user.id,
          requested_amount: parseFloat(formData.requestedAmount) || 0,
          status: 'applied',
          application_data: applicationData
        })
        .select()
        .maybeSingle();

      if (dbError) throw dbError;

      const notificationPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        businessPhone: formData.businessPhone,
        businessType: formData.businessType,
        yearsInBusiness: formData.yearsInBusiness,
        monthlyRevenue: formData.monthlyRevenue,
        loanAmount: formData.requestedAmount,
        useOfFunds: formData.useOfFunds,
        timelineNeeded: 'As soon as possible',
        creditScore: formData.creditScore
      };

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/capital-application-notification`;

      try {
        await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(notificationPayload)
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      const agentInfo = encodeURIComponent('Erica McLellan apptpipeline@gmail.com');
      const calendlyUrl = `https://calendly.com/d/cnjs-k5n-89p/consultation?a1=${agentInfo}`;

      window.location.href = calendlyUrl;

    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
      setLoading(false);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Get Money FAST</h1>
          <p className="text-slate-600 mt-2">
            We can have you approved and money in your account in as little as 72 hours
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-700">
            <span className="font-semibold">Funding from $20,000 to $500K</span>
            <span>•</span>
            <span className="font-semibold">3 month to 3 year loans</span>
            <span>•</span>
            <span className="font-semibold">650+ FICO score or higher</span>
          </div>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-start flex-1">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Fast Funding Solutions</h3>
                  <p className="text-slate-600 mb-3">
                    Get approved in as little as 72 hours with funding from $20K to $500K
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">72 Hours</div>
                      <div className="text-xs text-slate-600">Fast Approval</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">$20K-$500K</div>
                      <div className="text-xs text-slate-600">Funding Range</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="bordered">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Fast Approval</h3>
                <p className="text-slate-600 text-sm">
                  Get approved in as little as 24 hours
                </p>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Flexible Terms</h3>
                <p className="text-slate-600 text-sm">
                  Choose repayment terms that work for you
                </p>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Quick Funding</h3>
                <p className="text-slate-600 text-sm">
                  Receive funds in 3-5 business days
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Apply for Funding</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Name & Address *
                  </label>
                  <Input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Business Name"
                    className="mb-2"
                    required
                  />
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    rows={2}
                    placeholder="Business Address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Cell Phone Number *
                  </label>
                  <Input
                    type="tel"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type of Business *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    required
                  >
                    <option>LLC</option>
                    <option>Corporation</option>
                    <option>Sole Proprietorship</option>
                    <option>Partnership</option>
                    <option>S-Corporation</option>
                    <option>Non-Profit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Years in Business *
                  </label>
                  <select
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    required
                  >
                    <option>Less than 1 year</option>
                    <option>1-2 years</option>
                    <option>2-5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Average Monthly Revenue (Past 6 Months) *
                  </label>
                  <Input
                    type="text"
                    name="monthlyRevenue"
                    value={formData.monthlyRevenue}
                    onChange={handleChange}
                    placeholder="$25,000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Loan Amount Requested *
                  </label>
                  <Input
                    type="number"
                    name="requestedAmount"
                    value={formData.requestedAmount}
                    onChange={handleChange}
                    placeholder="$50,000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    How Will You Use The Funds *
                  </label>
                  <textarea
                    name="useOfFunds"
                    value={formData.useOfFunds}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estimated Credit Score *
                  </label>
                  <select
                    name="creditScore"
                    value={formData.creditScore}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                    required
                  >
                    <option>700+ (Qualifies for 0% Financing)</option>
                    <option>650-699 (Qualifies for Unsecured Financing)</option>
                    <option>Below 650</option>
                    <option>Not sure</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Application & Schedule Consultation'}
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  No impact to your credit score to check offers. After submitting, you'll be redirected to schedule your consultation with our funding specialist.
                </p>
              </form>
            </CardBody>
          </Card>

          <div className="space-y-6">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Popular Fast Funding Solutions</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-bold text-slate-900 mb-2">Unsecured Financing</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Access quick cash for immediate needs, repaid through a percentage of your daily sales revenue
                    </p>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Amount:</span>
                      <span className="font-medium">$20K - $500K</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Terms:</span>
                      <span className="font-medium">3 months - 3 years</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Credit Required:</span>
                      <span className="font-medium">650+ FICO</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Approval Time:</span>
                      <span className="font-medium text-green-600">As fast as 72 hours</span>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900">0% Financing</h4>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">BEST RATE</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      Unlock up to $150K in 0% interest credit for 12–18 months—no collateral or revenue needed, just a 700+ credit score
                    </p>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Amount:</span>
                      <span className="font-medium">Up to $150K</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Interest Rate:</span>
                      <span className="font-medium text-green-600">0% for 12-18 months</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Credit Required:</span>
                      <span className="font-medium">700+ FICO</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Collateral:</span>
                      <span className="font-medium">None required</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Revenue Required:</span>
                      <span className="font-medium">No minimum</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered" className="bg-green-50">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-3">Why Choose Us?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Fast approval in as little as 72 hours
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Funding from $20K to $500K
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    0% interest options available
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    No collateral required
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Flexible 3 month to 3 year terms
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Dedicated support team
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
