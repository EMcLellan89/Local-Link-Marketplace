import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Upload, Palette, FileText, Check, ArrowRight } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface WebsiteFormData {
  business_name: string;
  industry: string;
  website_type: string;
  num_pages: number;
  page_details: string;
  about_text: string;
  services_offered: string;
  target_audience: string;
  old_website_url: string;
  color_preferences: string;
  branding_notes: string;
  logo_option: 'have_logo' | 'need_logo' | 'need_design';
  logo_url: string;
  design_inspiration: string;
  special_features: string[];
  deadline_preference: string;
  additional_notes: string;
}

export default function WebsiteIntakeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Get pricing from location state (passed from WebsitesPage)
  const packageType = location.state?.packageType || 'custom';
  const price = location.state?.price || 4995;

  const [formData, setFormData] = useState<WebsiteFormData>({
    business_name: '',
    industry: '',
    website_type: 'business',
    num_pages: 5,
    page_details: '',
    about_text: '',
    services_offered: '',
    target_audience: '',
    old_website_url: '',
    color_preferences: '',
    branding_notes: '',
    logo_option: 'have_logo',
    logo_url: '',
    design_inspiration: '',
    special_features: [],
    deadline_preference: 'standard',
    additional_notes: ''
  });

  const featureOptions = [
    'Contact Form',
    'Online Booking/Scheduling',
    'E-commerce/Shopping Cart',
    'Blog',
    'Photo Gallery',
    'Video Integration',
    'Google Maps',
    'Social Media Integration',
    'Live Chat',
    'Newsletter Signup',
    'Testimonials Section',
    'FAQ Section'
  ];

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      special_features: prev.special_features.includes(feature)
        ? prev.special_features.filter(f => f !== feature)
        : [...prev.special_features, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);

    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id, business_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!merchant) {
        alert('Merchant profile not found. Please complete merchant onboarding first.');
        return;
      }

      const dueDate = new Date();
      if (formData.deadline_preference === 'rush') {
        dueDate.setDate(dueDate.getDate() + 7);
      } else if (formData.deadline_preference === 'express') {
        dueDate.setDate(dueDate.getDate() + 14);
      } else {
        dueDate.setDate(dueDate.getDate() + 21);
      }

      // Create detailed requirements for the partner
      const requirements = `
WEBSITE PROJECT: ${formData.business_name}

BASIC INFORMATION:
- Industry: ${formData.industry}
- Website Type: ${formData.website_type}
- Number of Pages: ${formData.num_pages}
- Package: ${packageType === 'landing' ? 'Landing Page' : packageType === 'standard' ? 'Standard Website' : 'Custom Website'}

PAGE DETAILS:
${formData.page_details}

ABOUT THE BUSINESS:
${formData.about_text}

SERVICES/PRODUCTS:
${formData.services_offered}

TARGET AUDIENCE:
${formData.target_audience}

${formData.old_website_url ? `EXISTING WEBSITE TO UPDATE/REPLACE:\n${formData.old_website_url}\n` : ''}

DESIGN & BRANDING:
- Color Preferences: ${formData.color_preferences || 'Not specified'}
- Branding Notes: ${formData.branding_notes || 'None'}
- Logo: ${formData.logo_option === 'have_logo' ? `Will provide (${formData.logo_url})` : formData.logo_option === 'need_logo' ? 'Client needs logo added to site' : 'Design new logo needed'}
- Design Inspiration: ${formData.design_inspiration || 'None provided'}

SPECIAL FEATURES REQUESTED:
${formData.special_features.length > 0 ? formData.special_features.map(f => `- ${f}`).join('\n') : '- None'}

DEADLINE: ${formData.deadline_preference === 'rush' ? '7 days (Rush)' : formData.deadline_preference === 'express' ? '14 days (Express)' : '21 days (Standard)'}

ADDITIONAL NOTES:
${formData.additional_notes || 'None'}

BUDGET: $${(price / 100).toFixed(2)}
      `.trim();

      // Create job on partner job board
      const { error: jobError } = await supabase
        .from('dfy_jobs')
        .insert({
          service_id: null, // Could link to a specific service product if needed
          merchant_id: merchant.id,
          status: 'open',
          title: `Website ${packageType === 'landing' ? 'Landing Page' : 'Design'} - ${formData.business_name}`,
          requirements: requirements,
          merchant_budget_cents: price,
          due_date: dueDate.toISOString()
        });

      if (jobError) throw jobError;

      alert('Website project submitted successfully! A partner will be assigned to your project within 24 hours. You will receive updates via email.');
      navigate('/merchant/dashboard');
    } catch (error: any) {
      console.error('Error submitting website project:', error);
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Globe className="text-blue-600" />
            Website Project Intake Form
          </h1>
          <p className="text-slate-600 mt-2">
            Tell us about your website project so we can create exactly what you need
          </p>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Selected Package</h3>
                <p className="text-slate-600">
                  {packageType === 'landing' ? 'Landing Page' : packageType === 'standard' ? 'Standard Website' : 'Custom Website'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">${(price / 100).toFixed(0)}</div>
                <p className="text-sm text-slate-600">one-time</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardBody>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Business Name *
                  </label>
                  <Input
                    required
                    placeholder="Your business name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Industry *
                  </label>
                  <Input
                    required
                    placeholder="e.g., Restaurant, Law Firm, Salon, Construction"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Website Type *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.website_type}
                    onChange={(e) => setFormData({...formData, website_type: e.target.value})}
                  >
                    <option value="business">Business/Corporate</option>
                    <option value="ecommerce">E-commerce/Online Store</option>
                    <option value="portfolio">Portfolio/Showcase</option>
                    <option value="service">Service Provider</option>
                    <option value="restaurant">Restaurant/Food Service</option>
                    <option value="medical">Medical/Healthcare</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Website Structure</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Number of Pages *
                  </label>
                  <Input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={formData.num_pages}
                    onChange={(e) => setFormData({...formData, num_pages: parseInt(e.target.value) || 1})}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Example pages: Home, About, Services, Contact, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    List Your Pages & What Should Be On Each Page *
                  </label>
                  <textarea
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    placeholder="Example:&#10;Home: Hero image, welcome message, featured services, testimonials&#10;About: Company history, team photos, mission statement&#10;Services: List of services with descriptions and pricing&#10;Contact: Contact form, phone, email, map"
                    value={formData.page_details}
                    onChange={(e) => setFormData({...formData, page_details: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    About Your Business (for About Page) *
                  </label>
                  <textarea
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Tell us about your business history, mission, values, what makes you different..."
                    value={formData.about_text}
                    onChange={(e) => setFormData({...formData, about_text: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Services/Products You Offer *
                  </label>
                  <textarea
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="List your main services or products with brief descriptions..."
                    value={formData.services_offered}
                    onChange={(e) => setFormData({...formData, services_offered: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Target Audience *
                  </label>
                  <Input
                    required
                    placeholder="Who are your ideal customers?"
                    value={formData.target_audience}
                    onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Existing Website (if updating)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://youroldsite.com"
                    value={formData.old_website_url}
                    onChange={(e) => setFormData({...formData, old_website_url: e.target.value})}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    If you have an existing site you want updated or replaced
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Design & Branding</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Color Preferences *
                  </label>
                  <Input
                    required
                    placeholder="e.g., Blue and white, warm earth tones, professional corporate colors"
                    value={formData.color_preferences}
                    onChange={(e) => setFormData({...formData, color_preferences: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Branding Notes
                  </label>
                  <Input
                    placeholder="Any specific branding guidelines, fonts, or style preferences"
                    value={formData.branding_notes}
                    onChange={(e) => setFormData({...formData, branding_notes: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Logo *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="logo_option"
                        value="have_logo"
                        checked={formData.logo_option === 'have_logo'}
                        onChange={(e) => setFormData({...formData, logo_option: e.target.value as any})}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-slate-700">I have a logo (will provide file)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="logo_option"
                        value="need_logo"
                        checked={formData.logo_option === 'need_logo'}
                        onChange={(e) => setFormData({...formData, logo_option: e.target.value as any})}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-slate-700">I need a logo added to the site</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="logo_option"
                        value="need_design"
                        checked={formData.logo_option === 'need_design'}
                        onChange={(e) => setFormData({...formData, logo_option: e.target.value as any})}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-slate-700">I need a new logo designed</span>
                    </label>
                  </div>

                  {formData.logo_option === 'have_logo' && (
                    <Input
                      className="mt-2"
                      placeholder="Logo file URL or upload after submission"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Design Inspiration
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Links to websites you like, or describe the style you want (modern, classic, minimalist, bold, etc.)"
                    value={formData.design_inspiration}
                    onChange={(e) => setFormData({...formData, design_inspiration: e.target.value})}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Special Features</h3>
              <p className="text-sm text-slate-600 mb-4">
                Select any special features you need (some may require additional fees)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {featureOptions.map((feature) => (
                  <label
                    key={feature}
                    className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.special_features.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </label>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Timeline & Additional Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deadline Preference *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deadline"
                        value="standard"
                        checked={formData.deadline_preference === 'standard'}
                        onChange={(e) => setFormData({...formData, deadline_preference: e.target.value})}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-slate-700">Standard (21 days) - No rush fee</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deadline"
                        value="express"
                        checked={formData.deadline_preference === 'express'}
                        onChange={(e) => setFormData({...formData, deadline_preference: e.target.value})}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-slate-700">Express (14 days) - May incur rush fee</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deadline"
                        value="rush"
                        checked={formData.deadline_preference === 'rush'}
                        onChange={(e) => setFormData({...formData, deadline_preference: e.target.value})}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-slate-700">Rush (7 days) - Rush fee applies</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Notes or Special Requests
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Anything else we should know about your project?"
                    value={formData.additional_notes}
                    onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardBody>
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">What Happens Next?</h3>
                  <ol className="space-y-2 text-sm text-slate-700">
                    <li><strong>1.</strong> Your project will be posted to our partner job board</li>
                    <li><strong>2.</strong> A qualified web designer will claim your project within 24 hours</li>
                    <li><strong>3.</strong> You'll receive an email introduction to your designer</li>
                    <li><strong>4.</strong> Designer will create mockups for your approval</li>
                    <li><strong>5.</strong> Website built and delivered within your chosen timeline</li>
                  </ol>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/merchant/websites')}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Project & Continue to Payment'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Payment will be collected after you approve the initial mockups
          </p>
        </form>
      </div>
    </BusinessHubLayout>
  );
}
