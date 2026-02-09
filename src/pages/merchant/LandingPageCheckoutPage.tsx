import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, Check } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function LandingPageCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const template = location.state?.template;

  const [loading, setLoading] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    notes: ''
  });

  useEffect(() => {
    if (!template) {
      navigate('/merchant/swipe-file/templates?category=Landing Pages', { replace: true });
    }
  }, [template, navigate]);

  if (!template) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2BB673] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      </BusinessHubLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('merchant_orders')
        .insert({
          merchant_id: profile?.id,
          order_type: 'landing_page',
          status: 'pending',
          amount: 99.00,
          details: {
            template_id: template.id,
            template_title: template.title,
            template_industry: template.industry,
            business_info: businessInfo
          }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      navigate('/merchant/swipe-file/landing-page-processing', {
        state: { order: order, template: template }
      });
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!template) return null;

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/merchant/swipe-file/templates?category=Landing Pages')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-2xl font-bold text-slate-900">Business Information</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Provide your business details to customize the landing page
                </p>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Name *
                    </label>
                    <Input
                      required
                      value={businessInfo.businessName}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                      placeholder="Your Business Name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Contact Name *
                      </label>
                      <Input
                        required
                        value={businessInfo.contactName}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, contactName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        required
                        type="tel"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                      placeholder="you@business.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business Address *
                    </label>
                    <Input
                      required
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                      placeholder="123 Main St, City, State 12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Website (if any)
                    </label>
                    <Input
                      value={businessInfo.website}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={businessInfo.notes}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, notes: e.target.value })}
                      placeholder="Any specific requests or information we should know..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      fullWidth
                      disabled={loading}
                      className="bg-[#2BB673] hover:bg-[#25a062] flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Continue to Payment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card variant="bordered" className="sticky top-4">
              <CardHeader>
                <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {template.image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={template.image_url}
                      alt={template.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">{template.title}</h4>
                  <p className="text-sm text-slate-600 capitalize">{template.industry} Landing Page</p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h5 className="text-sm font-semibold text-slate-700 mb-2">Included Features:</h5>
                  <div className="space-y-2">
                    {template.content.split('|').slice(0, 4).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start">
                        <Check className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                    <p className="text-xs text-slate-500 ml-6">+ more features</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-slate-600">Monthly Subscription</span>
                    <span className="text-2xl font-bold text-slate-900">$99</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Setup takes 5-7 business days. Cancel anytime.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 flex items-start">
                  <Lock className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
