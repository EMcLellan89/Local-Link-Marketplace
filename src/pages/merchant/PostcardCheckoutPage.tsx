import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CreditCard, Lock, ArrowLeft, CheckCircle, Upload, Palette } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { initiateSimplePayment } from '../../lib/paybright';

export default function PostcardCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adOption, setAdOption] = useState<'upload' | 'design' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { placement, price, features } = location.state || {
    placement: 'Standard Placement',
    price: 499,
    features: []
  };

  const [formData, setFormData] = useState({
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

  const [designInfo, setDesignInfo] = useState({
    website: '',
    facebook: '',
    email: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/pdf', 'application/pdf'].includes(file.type)) {
        setError('Please upload a JPG, PNG, or PDF file');
        return;
      }
      setUploadedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!adOption) {
        setError('Please select an ad option');
        setLoading(false);
        return;
      }

      if (adOption === 'upload' && !uploadedFile) {
        setError('Please upload your ad design');
        setLoading(false);
        return;
      }

      if (adOption === 'design' && (!designInfo.website || !designInfo.email)) {
        setError('Please provide your website and email for ad design');
        setLoading(false);
        return;
      }

      let adFileUrl = null;

      if (adOption === 'upload' && uploadedFile) {
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('postcard-ads')
          .upload(fileName, uploadedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('postcard-ads')
          .getPublicUrl(fileName);

        adFileUrl = publicUrl;
      }

      const { data: order, error: orderError } = await supabase
        .from('merchant_orders')
        .insert({
          merchant_id: profile?.id,
          order_type: 'postcard_placement',
          status: 'pending',
          amount: price,
          details: {
            placement_type: placement,
            features: features,
            ad_option: adOption,
            ad_file_url: adFileUrl,
            design_request: adOption === 'design' ? designInfo : null,
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

      const paymentData = {
        merchantId: profile?.id || '',
        amount: price,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address1: formData.address1,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country
        },
        orderId: order.id,
        orderType: 'postcard_placement',
        returnUrl: `${window.location.origin}/merchant/postcards/confirmation`
      };

      const paymentUrl = await initiateSimplePayment(paymentData);
      window.location.href = paymentUrl;

    } catch (err) {
      console.error('Error processing order:', err);
      setError(err instanceof Error ? err.message : 'Failed to process order');
      setLoading(false);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/merchant/postcards')}
          className="flex items-center text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Postcards
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Complete Your Booking</h1>
          <p className="text-slate-600 mt-2">
            {placement} - ${price.toLocaleString()} per mailing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Ad Design</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <p className="text-slate-600">How would you like to provide your ad?</p>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    adOption === 'upload'
                      ? 'border-[#2BB673] bg-[#2BB673]/5'
                      : 'border-slate-200 hover:border-[#2BB673]'
                  }`}
                  onClick={() => setAdOption('upload')}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">Upload My Own Ad</h3>
                      <p className="text-sm text-slate-600 mb-3">
                        I have a ready-to-print design (JPG, PNG, or PDF)
                      </p>
                      {adOption === 'upload' && (
                        <div className="mt-3">
                          <label className="block">
                            <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#2BB673] cursor-pointer">
                              <div className="text-center">
                                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600">
                                  {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  JPG, PNG or PDF (max 10MB)
                                </p>
                              </div>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    adOption === 'design'
                      ? 'border-[#2BB673] bg-[#2BB673]/5'
                      : 'border-slate-200 hover:border-[#2BB673]'
                  }`}
                  onClick={() => setAdOption('design')}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <Palette className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">
                        Design My Ad (Free)
                        <span className="ml-2 text-xs bg-[#2BB673]/20 text-[#2BB673] px-2 py-1 rounded-full font-semibold">
                          FREE
                        </span>
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        We'll create a professional ad for you and send a proof for approval
                      </p>
                      {adOption === 'design' && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Your Website *
                            </label>
                            <Input
                              required
                              type="url"
                              value={designInfo.website}
                              onChange={(e) => setDesignInfo({ ...designInfo, website: e.target.value })}
                              placeholder="https://yourbusiness.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Facebook Page (optional)
                            </label>
                            <Input
                              type="url"
                              value={designInfo.facebook}
                              onChange={(e) => setDesignInfo({ ...designInfo, facebook: e.target.value })}
                              placeholder="https://facebook.com/yourbusiness"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Email for Proof *
                            </label>
                            <Input
                              required
                              type="email"
                              value={designInfo.email}
                              onChange={(e) => setDesignInfo({ ...designInfo, email: e.target.value })}
                              placeholder="email@business.com"
                            />
                          </div>
                          <p className="text-xs text-slate-600 bg-blue-50 p-3 rounded-lg">
                            We'll review your website and brand, create a professional ad design, and send you a proof within 2 business days for your approval before printing.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Billing Information</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      Email *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address *
                    </label>
                    <Input
                      required
                      value={formData.address1}
                      onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <select
                        required
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="AB">Alberta</option>
                        <option value="BC">British Columbia</option>
                        <option value="MB">Manitoba</option>
                        <option value="NB">New Brunswick</option>
                        <option value="NL">Newfoundland and Labrador</option>
                        <option value="NS">Nova Scotia</option>
                        <option value="ON">Ontario</option>
                        <option value="PE">Prince Edward Island</option>
                        <option value="QC">Quebec</option>
                        <option value="SK">Saskatchewan</option>
                        <option value="NT">Northwest Territories</option>
                        <option value="NU">Nunavut</option>
                        <option value="YT">Yukon</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Postal Code *
                      </label>
                      <Input
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="M5H 2N2"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                    <Lock className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading || !adOption}
                    className="bg-[#2BB673] hover:bg-[#25a062]"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card variant="bordered" className="sticky top-6">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#2BB673]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#2BB673]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{placement}</h3>
                    <p className="text-sm text-slate-600">5,000 homes per mailing</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <h4 className="font-semibold text-slate-900 mb-2">Included:</h4>
                  <div className="space-y-2">
                    {features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Placement</span>
                    <span className="font-semibold text-slate-900">${price.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Ad Design</span>
                    <span className="font-semibold text-[#2BB673]">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-semibold text-slate-900">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
                    <span className="text-slate-900">Total</span>
                    <span className="text-[#2BB673]">${price.toLocaleString()}.00</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-slate-600">
                    <strong>Next Mailing:</strong> February 15th<br />
                    <strong>Deadline:</strong> February 8th
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
