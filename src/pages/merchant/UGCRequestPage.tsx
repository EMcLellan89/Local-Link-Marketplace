import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Video, Check, ArrowRight, Sparkles } from 'lucide-react';

interface UGCPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  video_count: number;
  hook_variations: number;
  turnaround_days: number;
  ad_usage_days: number;
  includes_raw_footage: boolean;
  is_monthly: boolean;
  features: string[];
}

export default function UGCRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [packages, setPackages] = useState<UGCPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<UGCPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    industry: '',
    business_name: '',
    business_description: '',
    content_goal: '',
    target_audience: '',
    key_messages: '',
    brand_guidelines_url: ''
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const { data } = await supabase
      .from('ugc_packages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (data) setPackages(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !user) return;

    setSubmitting(true);

    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!merchant) {
        alert('Merchant profile not found. Please complete merchant onboarding first.');
        return;
      }

      const creatorPayoutCents = Math.floor(selectedPackage.price_cents * 0.4);
      const platformFeeCents = selectedPackage.price_cents - creatorPayoutCents;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + selectedPackage.turnaround_days);

      const { data: order, error } = await supabase
        .from('ugc_orders')
        .insert({
          merchant_id: merchant.id,
          package_id: selectedPackage.id,
          status: 'paid',
          industry: formData.industry,
          business_name: formData.business_name,
          business_description: formData.business_description,
          content_goal: formData.content_goal,
          target_audience: formData.target_audience,
          key_messages: formData.key_messages,
          brand_guidelines_url: formData.brand_guidelines_url,
          total_price_cents: selectedPackage.price_cents,
          creator_payout_cents: creatorPayoutCents,
          platform_fee_cents: platformFeeCents,
          due_date: dueDate.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Create a job on the partner job board
      const jobRequirements = `
Industry: ${formData.industry}
Business: ${formData.business_name}
Package: ${selectedPackage.name}

Business Description:
${formData.business_description}

Content Goal:
${formData.content_goal}

Target Audience: ${formData.target_audience || 'Not specified'}

Key Messages:
${formData.key_messages || 'Not specified'}

Brand Guidelines: ${formData.brand_guidelines_url || 'None provided'}

Deliverables:
- ${selectedPackage.video_count} UGC videos
- ${selectedPackage.hook_variations} hook variations
- ${selectedPackage.includes_raw_footage ? 'Raw footage included' : 'Edited videos only'}
- Ad usage rights: ${selectedPackage.ad_usage_days} days

Turnaround Time: ${selectedPackage.turnaround_days} days
      `.trim();

      await supabase
        .from('dfy_jobs')
        .insert({
          service_id: selectedPackage.id,
          merchant_id: merchant.id,
          status: 'open',
          title: `UGC Content - ${formData.business_name}`,
          requirements: jobRequirements,
          merchant_budget_cents: creatorPayoutCents,
          due_date: dueDate.toISOString()
        });

      alert('UGC order submitted successfully! A creator will be assigned shortly.');
      navigate('/merchant/ugc-orders');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="merchant">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="merchant">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Video className="text-blue-600" />
            User-Generated Content (UGC)
          </h1>
          <p className="text-slate-600 mt-2">
            Get authentic video content from real creators for your ads, website, and social media.
          </p>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardBody>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">What is User-Generated Content (UGC)?</h3>
            <p className="text-slate-700 mb-6 text-lg">
              UGC is authentic video content created by real people (not professional actors) that showcases your products or services.
              These videos are perfect for social media ads, website testimonials, and marketing campaigns because they feel
              genuine and relatable to your audience.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Authentic & Relatable</h4>
                <p className="text-sm text-slate-600">Real people sharing genuine experiences with your brand</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">High Conversion</h4>
                <p className="text-sm text-slate-600">UGC ads typically convert 4-5x better than traditional ads</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">Fast Turnaround</h4>
                <p className="text-sm text-slate-600">Get professional content in days, not weeks</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4 text-lg">Real Examples of UGC Content:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Restaurant Review</p>
                    <p className="text-sm text-slate-600">A customer filming themselves trying your signature dish, talking about the flavors and atmosphere</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Salon Transformation</p>
                    <p className="text-sm text-slate-600">Before and after hair/nail transformation with genuine reactions and testimonial</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Home Service Demo</p>
                    <p className="text-sm text-slate-600">A customer showing the results of your cleaning, repair, or renovation service</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Fitness Journey</p>
                    <p className="text-sm text-slate-600">A member sharing their progress and experience training at your gym</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Product Unboxing</p>
                    <p className="text-sm text-slate-600">A customer excitedly opening and reviewing your product for the first time</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardBody>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How UGC Helps Your Business</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  Increases Trust
                </h4>
                <p className="text-slate-700 text-sm pl-10">
                  87% of consumers trust peer recommendations over brand advertising. UGC builds credibility instantly.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  Boosts Conversions
                </h4>
                <p className="text-slate-700 text-sm pl-10">
                  UGC ads convert 4-5x better than traditional ads because they feel more genuine and relatable.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  Saves Money
                </h4>
                <p className="text-slate-700 text-sm pl-10">
                  Professional video production can cost $5,000-$10,000. UGC gives you the same results for a fraction of the cost.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  Fills Your Pipeline
                </h4>
                <p className="text-slate-700 text-sm pl-10">
                  Use UGC videos across Facebook, Instagram, TikTok, your website, and email campaigns for consistent content.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {!selectedPackage ? (
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="space-y-4">
                    {pkg.is_monthly && (
                      <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        RECURRING
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-slate-900">
                      ${(pkg.price_cents / 100).toFixed(0)}
                      {pkg.is_monthly && <span className="text-lg text-slate-600">/mo</span>}
                    </div>
                    <p className="text-slate-600 text-sm">{pkg.description}</p>

                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => setSelectedPackage(pkg)}
                      className="w-full"
                    >
                      Select Package <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedPackage.name}</h3>
                    <p className="text-slate-600">${(selectedPackage.price_cents / 100).toFixed(0)}</p>
                  </div>
                  <Button variant="secondary" onClick={() => setSelectedPackage(null)}>
                    Change Package
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Industry *
                    </label>
                    <Input
                      required
                      placeholder="e.g., Restaurant, Salon, Fitness, Real Estate"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    />
                  </div>

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
                      Business Description *
                    </label>
                    <textarea
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Brief description of what you do"
                      value={formData.business_description}
                      onChange={(e) => setFormData({...formData, business_description: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Content Goal *
                    </label>
                    <textarea
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="What do you want to achieve? (e.g., drive foot traffic, increase bookings, showcase products)"
                      value={formData.content_goal}
                      onChange={(e) => setFormData({...formData, content_goal: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Target Audience
                    </label>
                    <Input
                      placeholder="Who are you trying to reach?"
                      value={formData.target_audience}
                      onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Key Messages
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Main points you want the creator to communicate"
                      value={formData.key_messages}
                      onChange={(e) => setFormData({...formData, key_messages: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Brand Guidelines URL
                    </label>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={formData.brand_guidelines_url}
                      onChange={(e) => setFormData({...formData, brand_guidelines_url: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'Submitting...' : 'Submit Order & Pay'}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Payment will be processed securely. A creator will be assigned within 24 hours.
                  </p>
                </div>
              </CardBody>
            </Card>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}