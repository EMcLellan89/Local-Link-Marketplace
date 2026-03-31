import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Upload, CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function DesignServiceCheckoutPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    designType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada'
  });

  const designTypes = [
    'Business Cards',
    'Flyers',
    'Brochures',
    'Logo Design',
    'Social Media Graphics',
    'Yard Signs',
    'Door Hangers',
    'Other'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = null;

      if (uploadedFile) {
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
        const filePath = `design-requests/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, uploadedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
      }

      const { data: order, error: orderError } = await supabase
        .from('merchant_orders')
        .insert({
          merchant_id: profile?.id,
          order_type: 'design_service',
          status: 'pending',
          amount: 25,
          details: {
            project_name: formData.projectName,
            project_description: formData.projectDescription,
            design_type: formData.designType,
            reference_file_url: fileUrl,
            billing_info: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address1: formData.address1,
              city: formData.city,
              province: formData.province,
              postalCode: formData.postalCode,
              country: formData.country
            }
          }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const paymentRequest = {
        merchantId: profile?.id || '',
        transactionType: 'merchant_service' as const,
        referenceId: order.id,
        referenceTable: 'merchant_orders',
        amount: 2500,
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address1,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        metadata: {
          order_type: 'design_service',
          project_name: formData.projectName,
          design_type: formData.designType
        }
      };

      const result = await initiatePayBrightPayment(paymentRequest);

      if (!result.success || !result.checkoutHtml) {
        throw new Error(result.error || 'Failed to initiate payment');
      }

      const paymentWindow = window.open('', 'PayBright Checkout', 'width=800,height=800');
      if (paymentWindow) {
        paymentWindow.document.write(result.checkoutHtml);
        paymentWindow.document.close();

        const checkInterval = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkInterval);
            navigate('/merchant/printing/design-service/confirmation', {
              state: { order }
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/merchant/printing')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Printing Services
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card variant="bordered">
              <CardHeader>
                <div className="flex items-center">
                  <Palette className="w-6 h-6 text-orange-600 mr-3" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Design Service</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Professional design for your marketing materials
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Project Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Project Name *
                        </label>
                        <Input
                          required
                          value={formData.projectName}
                          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                          placeholder="e.g., Business Card Design"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Design Type *
                        </label>
                        <select
                          required
                          value={formData.designType}
                          onChange={(e) => setFormData({ ...formData, designType: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Select design type...</option>
                          {designTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Project Description *
                        </label>
                        <textarea
                          required
                          value={formData.projectDescription}
                          onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                          placeholder="Tell us what you need designed, including colors, text, style preferences, etc."
                          rows={4}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Upload Reference Files (Optional)
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept="image/*,.pdf,.ai,.eps,.psd"
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            Choose file
                          </label>
                          <p className="text-sm text-slate-600 mt-2">
                            {uploadedFile ? uploadedFile.name : 'Logo, images, or reference materials (optional)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Billing Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            First Name *
                          </label>
                          <Input
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="John"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Last Name *
                          </label>
                          <Input
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Doe"
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
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@business.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number *
                        </label>
                        <Input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Street Address *
                        </label>
                        <Input
                          required
                          value={formData.address1}
                          onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                          placeholder="123 Main St"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            City *
                          </label>
                          <Input
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Toronto"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Province *
                          </label>
                          <Input
                            required
                            value={formData.province}
                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            placeholder="ON"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Postal Code *
                        </label>
                        <Input
                          required
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          placeholder="M5V 3A8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      fullWidth
                      disabled={loading}
                      className="bg-orange-600 hover:bg-orange-700 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay $25 - Get Design Service
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
                <h3 className="text-lg font-bold text-slate-900">Service Summary</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <Palette className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Design Service</h4>
                    <p className="text-sm text-slate-600">Professional design</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">Professional designer assigned</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">2-3 business days turnaround</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">Revisions included</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">Print-ready files delivered</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-600">Design Service</span>
                    <span className="text-2xl font-bold text-slate-900">$25.00</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 flex items-start">
                  <Lock className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600">
                    Secure payment via PayBright. Once approved, we'll proceed with printing.
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
