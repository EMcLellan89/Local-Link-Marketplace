import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { checkMerchantFeature, FeatureGateError, FEATURE_KEYS, getUpgradeMessage } from '../../lib/featureGating';
import { getMerchantTier, incrementUsage } from '../../lib/usage';

export default function CreateDealPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usageWarning, setUsageWarning] = useState<{ message: string; isHard: boolean } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    originalValue: '',
    price: '',
    maxQuantity: '',
    perCustomerLimit: '',
    endDate: '',
    redemptionInstructions: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchMerchant();
  }, [user]);

  const fetchMerchant = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('id, status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data && data.status === 'approved') {
        setMerchantId(data.id);
        await checkUsageLimit(data.id);
      } else {
        navigate('/merchant/dashboard');
      }
    } catch (error) {
      console.error('Error fetching merchant:', error);
      setError('Failed to load merchant data. Please try again.');
    }
  };

  const checkUsageLimit = async (merchantId: string) => {
    try {
      await checkMerchantFeature(merchantId, FEATURE_KEYS.MERCHANT.ACTIVE_DEALS);
    } catch (err) {
      if (err instanceof FeatureGateError) {
        const tier = await getMerchantTier(merchantId);
        const upgradeMsg = getUpgradeMessage(FEATURE_KEYS.MERCHANT.ACTIVE_DEALS, tier);
        setUsageWarning({
          message: `${err.message}. ${upgradeMsg}`,
          isHard: true
        });
      }
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    const originalValue = parseFloat(formData.originalValue);
    const price = parseFloat(formData.price);

    if (!formData.originalValue || isNaN(originalValue) || originalValue <= 0) {
      newErrors.originalValue = 'Valid original value is required';
    }

    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (originalValue && price && price >= originalValue) {
      newErrors.price = 'Price must be less than original value';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !merchantId) return;

    if (usageWarning?.isHard) {
      alert(usageWarning.message);
      return;
    }

    setLoading(true);

    try {
      await checkMerchantFeature(merchantId, FEATURE_KEYS.MERCHANT.ACTIVE_DEALS);

      const originalValueCents = Math.round(parseFloat(formData.originalValue) * 100);
      const priceCents = Math.round(parseFloat(formData.price) * 100);

      const dealData = {
        merchant_id: merchantId,
        title: formData.title,
        slug: generateSlug(formData.title),
        short_description: formData.shortDescription,
        description: formData.description,
        original_value_cents: originalValueCents,
        price_cents: priceCents,
        max_quantity: formData.maxQuantity ? parseInt(formData.maxQuantity) : null,
        per_customer_limit: formData.perCustomerLimit ? parseInt(formData.perCustomerLimit) : null,
        end_at: formData.endDate || null,
        redemption_instructions: formData.redemptionInstructions || null,
        image_url: formData.imageUrl || null,
        status: 'pending_approval',
      };

      const { error } = await supabase
        .from('deals')
        .insert(dealData);

      if (error) throw error;

      // Get the inserted deal id to notify admin
      const { data: newDeal } = await supabase
        .from('deals')
        .select('id')
        .eq('merchant_id', merchantId)
        .eq('slug', dealData.slug)
        .maybeSingle();

      if (newDeal?.id) {
        supabase.functions.invoke('deal-notify-admin', { body: { deal_id: newDeal.id } }).catch(() => {});
      }

      await incrementUsage('merchant', merchantId, FEATURE_KEYS.MERCHANT.ACTIVE_DEALS);

      navigate('/merchant/deals');
    } catch (err) {
      console.error('Error creating deal:', err);
      if (err instanceof FeatureGateError) {
        alert(err.message);
        navigate('/merchant/upgrade');
      } else {
        alert('Failed to create deal. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAIAssist = async (field: string) => {
    if (!merchantId) return;

    setAiLoading(prev => ({ ...prev, [field]: true }));

    try {
      let prompt = '';

      if (field === 'title') {
        prompt = `Generate a catchy deal title for a ${formData.shortDescription || 'business offering'}. Make it compelling and include value proposition. Return only the title, no explanation.`;
      } else if (field === 'description') {
        const title = formData.title || formData.shortDescription || 'this deal';
        prompt = `Write a compelling deal description for "${title}". Include what's included, why it's valuable, and create urgency. Keep it under 150 words. Return only the description, no preamble.`;
      } else if (field === 'pricing') {
        const originalValue = formData.originalValue;
        prompt = `Suggest an optimal deal price for a product/service originally valued at $${originalValue}. Consider psychology of pricing (50-70% off is sweet spot). Return only the suggested price as a number, nothing else.`;
      }

      const { data, error } = await supabase.functions.invoke('run-prompt', {
        body: { prompt, merchant_id: merchantId }
      });

      if (error) throw error;

      const aiResponse = data?.response || '';

      if (field === 'title') {
        handleChange('title', aiResponse.trim().replace(/^["']|["']$/g, ''));
      } else if (field === 'description') {
        handleChange('description', aiResponse.trim());
      } else if (field === 'pricing') {
        const suggestedPrice = parseFloat(aiResponse.trim().replace(/[^0-9.]/g, ''));
        if (!isNaN(suggestedPrice)) {
          handleChange('price', suggestedPrice.toFixed(2));
        }
      }
    } catch (err) {
      console.error('AI assist error:', err);
      alert('AI assistance is temporarily unavailable. Please try again.');
    } finally {
      setAiLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate('/merchant/deals')}>
            ← Back to Deals
          </Button>
        </div>

        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
              <Button variant="outline" onClick={fetchMerchant} className="mt-3">
                Try Again
              </Button>
            </CardBody>
          </Card>
        )}

        {usageWarning && (
          <div className={`rounded-lg p-4 ${usageWarning.isHard ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-start gap-3">
              {usageWarning.isHard ? (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <TrendingUp className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${usageWarning.isHard ? 'text-red-900' : 'text-yellow-900'}`}>
                  {usageWarning.isHard ? 'Deal Limit Reached' : 'Approaching Deal Limit'}
                </p>
                <p className={`text-sm mt-1 ${usageWarning.isHard ? 'text-red-700' : 'text-yellow-700'}`}>
                  {usageWarning.message}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/merchant/upgrade')}
                >
                  View Upgrade Options
                </Button>
              </div>
            </div>
          </div>
        )}

        <Card variant="bordered">
          <CardHeader>
            <h1 className="text-2xl font-bold text-slate-900">Create New Deal</h1>
            <p className="text-slate-600 mt-1">Attract new customers with an irresistible offer</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Deal Title <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAIAssist('title')}
                    disabled={aiLoading.title || !formData.shortDescription}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                    title={!formData.shortDescription ? 'Fill in short description first' : 'Generate with AI'}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {aiLoading.title ? 'Generating...' : 'AI Assist'}
                  </button>
                </div>
                <Input
                  placeholder="e.g., $40 Dinner for Two - Only $20"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={errors.title}
                  required
                />
              </div>

              <Input
                label="Short Description"
                placeholder="Brief one-liner about your deal"
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                error={errors.shortDescription}
                required
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Full Description <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAIAssist('description')}
                    disabled={aiLoading.description || (!formData.title && !formData.shortDescription)}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                    title={(!formData.title && !formData.shortDescription) ? 'Fill in title or short description first' : 'Generate with AI'}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {aiLoading.description ? 'Writing...' : 'AI Assist'}
                  </button>
                </div>
                <textarea
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent transition-all ${
                    errors.description ? 'border-red-500' : 'border-slate-300'
                  }`}
                  rows={4}
                  placeholder="Detailed description of what's included in the deal"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Pricing
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAIAssist('pricing')}
                    disabled={aiLoading.pricing || !formData.originalValue}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                    title={!formData.originalValue ? 'Enter original value first' : 'Get AI pricing suggestion'}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {aiLoading.pricing ? 'Calculating...' : 'Optimize Price'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Original Value"
                    placeholder="100.00"
                    step="0.01"
                    min="0"
                    value={formData.originalValue}
                    onChange={(e) => handleChange('originalValue', e.target.value)}
                    error={errors.originalValue}
                    required
                  />

                  <Input
                    type="number"
                    label="Deal Price"
                    placeholder="50.00"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    error={errors.price}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Max Quantity"
                  placeholder="Leave blank for unlimited"
                  min="1"
                  value={formData.maxQuantity}
                  onChange={(e) => handleChange('maxQuantity', e.target.value)}
                  helperText="Total number available"
                />

                <Input
                  type="number"
                  label="Per Customer Limit"
                  placeholder="Leave blank for unlimited"
                  min="1"
                  value={formData.perCustomerLimit}
                  onChange={(e) => handleChange('perCustomerLimit', e.target.value)}
                  helperText="Max per customer"
                />
              </div>

              <Input
                type="date"
                label="End Date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                helperText="Leave blank if no end date"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Redemption Instructions
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent transition-all"
                  rows={3}
                  placeholder="How should customers redeem this deal?"
                  value={formData.redemptionInstructions}
                  onChange={(e) => handleChange('redemptionInstructions', e.target.value)}
                />
              </div>

              <Input
                type="url"
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                helperText="Use a high-quality image from Pexels or your own"
              />

              <div className="bg-[#2BB673]/5 border border-[#2BB673]/20 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Deal Preview</h4>
                {formData.originalValue && formData.price && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#2BB673]">
                      ${parseFloat(formData.price).toFixed(2)}
                    </span>
                    <span className="text-lg text-slate-500 line-through">
                      ${parseFloat(formData.originalValue).toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-[#F5B82E]">
                      Save {Math.round(((parseFloat(formData.originalValue) - parseFloat(formData.price)) / parseFloat(formData.originalValue)) * 100)}%
                    </span>
                  </div>
                )}
                <p className="text-sm text-slate-600 mt-2">
                  Your deal will be reviewed before going live. Commission: 30%
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/merchant/deals')}
                >
                  Cancel
                </Button>
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? 'Creating...' : 'Create Deal'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
