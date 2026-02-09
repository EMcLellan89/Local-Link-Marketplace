import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Check, Sparkles, X, ShoppingCart } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface WebsiteTemplate {
  id: string;
  industry: string;
  name: string;
  description: string;
  preview_image_url: string | null;
  features: string[];
  price_cents: number;
}

export default function WebsitesPage() {
  const navigate = useNavigate();
  const [hasCRMSubscription, setHasCRMSubscription] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | null>(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const industries = [
    {
      name: 'Restaurant & Cafe',
      description: 'Perfect for food businesses with menu showcase and online ordering',
      icon: '🍽️'
    },
    {
      name: 'Professional Services',
      description: 'Ideal for consultants, lawyers, and service providers',
      icon: '💼'
    },
    {
      name: 'Retail & E-commerce',
      description: 'Showcase products with beautiful galleries and contact options',
      icon: '🛍️'
    },
    {
      name: 'Health & Wellness',
      description: 'For spas, gyms, clinics, and wellness professionals',
      icon: '💪'
    }
  ];

  const customPackages = [
    {
      name: 'Landing Page',
      price: 1500,
      features: [
        'Single high-converting page',
        'Mobile responsive design',
        'Contact form integration',
        'SEO optimization',
        '2 rounds of revisions',
        '5 day delivery'
      ]
    },
    {
      name: 'Standard Website',
      price: 4995,
      features: [
        '5 custom pages',
        'Mobile responsive design',
        'CRM integration',
        'Contact forms & booking',
        'SEO optimization',
        'Google Analytics',
        'Unlimited revisions',
        '14 day delivery'
      ],
      popular: true
    },
    {
      name: 'Complex Website',
      price: 9995,
      features: [
        'Unlimited pages',
        'Custom functionality',
        'E-commerce capability',
        'Member portal',
        'Advanced integrations',
        'Priority support',
        'Ongoing maintenance',
        '21 day delivery'
      ]
    }
  ];

  useEffect(() => {
    checkCRMSubscription();
    fetchMerchantId();
  }, []);

  const fetchMerchantId = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (user) {
        const { data: merchant, error: merchantError } = await supabase
          .from('merchants')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (merchantError) throw merchantError;

        if (merchant) {
          setMerchantId(merchant.id);
        }
      }
    } catch (error) {
      console.error('Error fetching merchant ID:', error);
      setError('Failed to load merchant information');
    }
  };

  const checkCRMSubscription = async () => {
    try {
      setError(null);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return;

      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (merchant) {
        const { data: subscription, error: subError } = await supabase
          .from('merchant_subscriptions')
          .select('status')
          .eq('merchant_id', merchant.id)
          .eq('status', 'active')
          .maybeSingle();

        if (subError) throw subError;

        setHasCRMSubscription(!!subscription);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setError('Failed to load subscription information');
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handlePaidClick = () => {
    navigate('/merchant/websites/intake', {
      state: { packageType: 'landing', price: 59900 }
    });
  };

  const handleCustomPackageClick = (packageName: string, price: number) => {
    const packageType = packageName.toLowerCase().includes('landing') ? 'landing' :
                        packageName.toLowerCase().includes('standard') ? 'standard' : 'custom';
    navigate('/merchant/websites/intake', {
      state: { packageType, price: price * 100 }
    });
  };

  const handleSelectTemplate = async (industry: string) => {
    setSelectedIndustry(industry);
    setLoadingTemplates(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('website_templates')
        .select('*')
        .eq('industry', industry)
        .eq('is_active', true);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates. Please try again.');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleCustomizeTemplate = (template: WebsiteTemplate) => {
    setSelectedTemplate(template);
    setShowCustomizeModal(true);
  };

  const handleAddToCart = async () => {
    if (!selectedTemplate || !merchantId) {
      alert('Missing required information. Please try again.');
      return;
    }

    const price = hasCRMSubscription ? 0 : 9900;

    try {
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('business_name, email, phone')
        .eq('id', merchantId)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (!merchant) {
        throw new Error('Merchant not found');
      }

      const { error } = await supabase
        .from('website_orders')
        .insert({
          merchant_id: merchantId,
          template_id: selectedTemplate.id,
          website_type: 'landing',
          price: price / 100,
          status: 'ordered',
          requirements: {
            business_name: merchant?.business_name || '',
            template_name: selectedTemplate.name,
            industry: selectedTemplate.industry
          }
        });

      if (error) throw error;

      alert('Template added to your order! Our team will reach out to customize it for your business.');
      setShowCustomizeModal(false);
      setSelectedTemplate(null);
      setSelectedIndustry(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add template to cart. Please try again.');
    }
  };

  return (
    <BusinessHubLayout>
      <div className="space-y-12">
        {error && (
          <Card variant="bordered" className="bg-red-50 border-red-200">
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="text-red-600 mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setError(null); checkCRMSubscription(); fetchMerchantId(); }}>
                  Try Again
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Website Services</h1>
            <p className="text-slate-600 mt-2">
              Choose from 4 beautiful, professionally designed landing pages per industry
            </p>
          </div>

          <Card variant="bordered" className="bg-gradient-to-br from-[#2BB673]/5 to-[#2BB673]/10 border-[#2BB673]/20">
            <CardBody>
              <div className="text-center py-4">
                <Sparkles className="w-12 h-12 text-[#2BB673] mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Special Pricing Landing Page</h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">$500</p>
                    <p className="text-sm text-slate-600 mt-1">setup</p>
                  </div>
                  <div className="text-slate-400 text-2xl font-light">+</div>
                  <div>
                    <p className="text-3xl font-bold text-[#2BB673]">$99<span className="text-lg">/mo</span></p>
                    <p className="text-sm text-slate-600 mt-1">ongoing</p>
                  </div>
                </div>
                <button
                  onClick={handlePaidClick}
                  className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  Let's Go
                </button>
              </div>
            </CardBody>
          </Card>

          {!selectedIndustry && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industries.map((industry) => (
                <Card key={industry.name} variant="bordered" className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-4xl mb-3">{industry.icon}</div>
                    <h3 className="text-lg font-bold text-slate-900">{industry.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{industry.description}</p>
                  </CardHeader>
                  <CardBody>
                    <Button
                      fullWidth
                      variant="default"
                      onClick={() => handleSelectTemplate(industry.name)}
                    >
                      Select Template
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {selectedIndustry && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedIndustry} Templates
                </h2>
                <button
                  onClick={() => {
                    setSelectedIndustry(null);
                    setTemplates([]);
                  }}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {loadingTemplates ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2BB673]"></div>
                  <p className="mt-2 text-slate-600">Loading templates...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {templates.map((template) => (
                    <Card key={template.id} variant="bordered" className="overflow-hidden">
                      {template.preview_image_url && (
                        <img
                          src={template.preview_image_url}
                          alt={template.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CardHeader>
                        <h3 className="text-lg font-bold text-slate-900">{template.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                      </CardHeader>
                      <CardBody>
                        <ul className="space-y-2 mb-4">
                          {template.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm text-slate-600">
                              <Check className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          fullWidth
                          variant="default"
                          onClick={() => handleCustomizeTemplate(template)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Customize & Add to Cart
                        </Button>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div id="custom" className="space-y-6 pt-8 border-t-2 border-slate-200">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Custom Website Design Services</h2>
            <p className="text-slate-600 mt-2">
              Professional custom websites that convert visitors into customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customPackages.map((pkg) => (
              <Card
                key={pkg.name}
                variant="bordered"
                className={pkg.popular ? 'ring-2 ring-[#2BB673] relative' : ''}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#2BB673] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="w-12 h-12 bg-[#2BB673]/10 rounded-lg flex items-center justify-center mb-3">
                    <Globe className="w-6 h-6 text-[#2BB673]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-[#2BB673] mt-2">
                    ${pkg.price.toLocaleString()}
                  </p>
                </CardHeader>
                <CardBody>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-600">
                        <Check className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    fullWidth
                    variant={pkg.popular ? 'default' : 'outline'}
                    onClick={() => handleCustomPackageClick(pkg.name, pkg.price)}
                  >
                    Order Now
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card variant="bordered">
            <CardHeader>
              <h3 className="text-xl font-bold text-slate-900">Our Process</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { step: '1', title: 'Discovery', desc: 'We learn about your business and goals' },
                  { step: '2', title: 'Design', desc: 'Create mockups based on your brand' },
                  { step: '3', title: 'Development', desc: 'Build your custom website' },
                  { step: '4', title: 'Review', desc: 'You provide feedback and revisions' },
                  { step: '5', title: 'Launch', desc: 'Go live with full support' }
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 bg-[#2BB673] text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {showCustomizeModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Customize Your Website</h2>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedTemplate.preview_image_url && (
                <img
                  src={selectedTemplate.preview_image_url}
                  alt={selectedTemplate.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedTemplate.name}</h3>
                <p className="text-slate-600 mt-1">{selectedTemplate.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Included Features:</h4>
                <ul className="space-y-2">
                  {selectedTemplate.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-600">
                      <Check className="w-5 h-5 text-[#2BB673] mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#2BB673]/10 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  <span className="font-bold">
                    {hasCRMSubscription ? 'FREE with your CRM subscription!' : '$99/month'}
                  </span>
                  {' - '}Our team will customize this template with your branding, content, and photos.
                  Setup typically takes 5-7 business days.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowCustomizeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BusinessHubLayout>
  );
}
