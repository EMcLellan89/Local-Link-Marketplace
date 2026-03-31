import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Upload, CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function ResumeWritingCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const resumeOption = location.state?.resumeOption || 'template';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    fullName: '',
    professionalSummary: '',
    workExperience: '',
    education: '',
    skills: '',
    certifications: '',
    additionalNotes: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let fileUrl = null;

      if (uploadedFile) {
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
        const filePath = `resume-requests/${fileName}`;

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
          order_type: 'resume_writing',
          status: 'pending',
          amount: 150,
          details: {
            resume_option: resumeOption,
            resume_file_url: fileUrl,
            resume_data: resumeOption === 'template' ? {
              full_name: formData.fullName,
              professional_summary: formData.professionalSummary,
              work_experience: formData.workExperience,
              education: formData.education,
              skills: formData.skills,
              certifications: formData.certifications
            } : null,
            additional_notes: formData.additionalNotes,
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
        amount: 150,
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
        orderType: 'resume_writing',
        returnUrl: `${window.location.origin}/merchant/recruiting/resume-writing-confirmation`
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
          onClick={() => navigate('/merchant/recruiting')}
          className="flex items-center text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recruiting
        </button>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Complete Your Purchase</h1>
          <p className="text-slate-600 mt-2">
            Professional Resume Writing Service - {resumeOption === 'upload' ? 'Resume Enhancement' : 'New Resume Creation'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Resume Information & Billing</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {resumeOption === 'upload' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Upload Your Current Resume *
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#2BB673] transition-colors">
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                          {uploadedFile ? (
                            <div>
                              <p className="text-[#2BB673] font-medium mb-2">{uploadedFile.name}</p>
                              <button
                                type="button"
                                onClick={() => setUploadedFile(null)}
                                className="text-sm text-slate-600 hover:text-slate-900"
                              >
                                Remove file
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="text-slate-600 mb-2">Drag and drop your resume here, or click to browse</p>
                              <p className="text-xs text-slate-500">Accepts PDF, DOC, DOCX (Max 5MB)</p>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="resume-upload"
                            required={!uploadedFile}
                          />
                          <label
                            htmlFor="resume-upload"
                            className="inline-block mt-3 px-4 py-2 bg-[#2BB673] text-white rounded-lg cursor-pointer hover:bg-[#25a062]"
                          >
                            Choose File
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          value={formData.additionalNotes}
                          onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                          rows={4}
                          placeholder="Any specific requirements or areas of focus?"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-bold text-slate-900 mb-3">Resume Information</h3>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                        <Input
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Professional Summary *</label>
                        <textarea
                          required
                          value={formData.professionalSummary}
                          onChange={(e) => setFormData({ ...formData, professionalSummary: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                          rows={3}
                          placeholder="Brief overview of your professional background and expertise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Work Experience *</label>
                        <textarea
                          required
                          value={formData.workExperience}
                          onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                          rows={6}
                          placeholder="List your previous positions, companies, dates, and key achievements (one per line)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Education *</label>
                        <textarea
                          required
                          value={formData.education}
                          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                          rows={3}
                          placeholder="Degrees, institutions, graduation dates"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Skills *</label>
                        <Input
                          required
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                          placeholder="e.g., Project Management, Sales, Marketing, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Certifications (Optional)</label>
                        <Input
                          value={formData.certifications}
                          onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                          placeholder="Any relevant certifications or licenses"
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-bold text-slate-900 mb-4">Billing Information</h3>
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

                    <div className="mt-4">
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

                    <div className="mt-4">
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

                    <div className="mt-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                    disabled={loading}
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
                    <FileText className="w-6 h-6 text-[#2BB673]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Resume Writing</h3>
                    <p className="text-sm text-slate-600">Professional {resumeOption === 'upload' ? 'Enhancement' : 'Creation'}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <h4 className="font-semibold text-slate-900 mb-2">Included:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">ATS-optimized formatting</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">Industry-specific keywords</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">Achievement-focused content</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">2 rounds of revisions</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">3-day turnaround</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">$150.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-semibold text-slate-900">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
                    <span className="text-slate-900">Total</span>
                    <span className="text-[#2BB673]">$150.00</span>
                  </div>
                </div>

                <div className="bg-[#2BB673]/5 rounded-lg p-3">
                  <p className="text-xs text-slate-600">
                    Your professionally written resume will be delivered within 3 business days.
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
