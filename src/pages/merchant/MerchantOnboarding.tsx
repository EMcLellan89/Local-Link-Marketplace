import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';

export default function MerchantOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    categoryId: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setError(null);
      const { data, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (catError) throw catError;

      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    }
  };

  const generateSlug = (businessName: string) => {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    setLoading(true);

    try {
      const merchantData = {
        user_id: user.id,
        business_name: formData.businessName,
        slug: generateSlug(formData.businessName),
        category_id: formData.categoryId,
        phone: formData.phone,
        email: formData.email,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2 || null,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        description: formData.description || null,
        status: 'approved',
      };

      const { error } = await supabase
        .from('merchants')
        .insert(merchantData);

      if (error) throw error;

      navigate('/merchant/dashboard');
    } catch (error) {
      console.error('Error creating merchant profile:', error);
      alert('Failed to create merchant profile. Please try again.');
    } finally {
      setLoading(false);
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
                <Button variant="outline" size="sm" onClick={() => { setError(null); fetchCategories(); }}>
                  Try Again
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
        <Card variant="bordered">
          <CardHeader>
            <h1 className="text-2xl font-bold text-slate-900">Complete Your Merchant Profile</h1>
            <p className="text-slate-600 mt-1">Tell us about your business to get started</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Business Name"
                placeholder="Your Business Name"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                error={errors.businessName}
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Business Category <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent transition-all ${
                    errors.categoryId ? 'border-red-500' : 'border-slate-300'
                  }`}
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Business Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Tell customers about your business"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="tel"
                  label="Phone"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={errors.phone}
                  required
                />

                <Input
                  type="email"
                  label="Email"
                  placeholder="business@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  required
                />
              </div>

              <Input
                label="Address Line 1"
                placeholder="123 Main Street"
                value={formData.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                error={errors.addressLine1}
                required
              />

              <Input
                label="Address Line 2"
                placeholder="Suite 100"
                value={formData.addressLine2}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="City"
                  placeholder="Boston"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  error={errors.city}
                  required
                />

                <Input
                  label="State"
                  placeholder="MA"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  error={errors.state}
                  required
                />

                <Input
                  label="Postal Code"
                  placeholder="02101"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  error={errors.postalCode}
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Our team will review your application</li>
                  <li>2. You'll receive an email within 1-2 business days</li>
                  <li>3. Once approved, you can start creating deals</li>
                </ul>
              </div>

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
