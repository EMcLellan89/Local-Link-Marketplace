import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';
import { User, Building, Mail, Phone, MapPin } from 'lucide-react';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

export default function CourseEnrollmentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    businessName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (DEV_MODE) {
        console.log('DEV MODE: Skipping actual enrollment, redirecting to course');
        navigate('/learn/online-sales-without-ads?success=1');
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'merchant',
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          role: 'merchant',
        })
        .eq('id', authData.user.id);

      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .insert({
          user_id: authData.user.id,
          business_name: formData.businessName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip,
          status: 'pending',
          subscription_tier: 'free',
        })
        .select()
        .single();

      if (merchantError) throw merchantError;

      const { data: courseData } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', 'online-sales-without-ads')
        .single();

      if (courseData) {
        await supabase.from('enrollments').insert({
          user_id: authData.user.id,
          course_id: courseData.id,
          status: 'active',
        });
      }

      const { data: leadData } = await supabase
        .from('crm_leads')
        .insert({
          merchant_id: merchantData.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.businessName,
          status: 'new',
          lead_source: 'course_enrollment',
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip,
        })
        .select()
        .single();

      navigate('/learn/online-sales-without-ads?success=1');
    } catch (err: any) {
      console.error('Enrollment error:', err);
      setError(err.message || 'Failed to enroll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Enroll in Online Sales Without Ads™" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Enroll in Online Sales Without Ads™
            </h1>
            <p className="text-xl text-gray-600">
              Start your journey to sales success without expensive ads
            </p>
            {DEV_MODE && (
              <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
                <strong>DEV MODE:</strong> Auth is bypassed. Fill out the form to see the flow.
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    First Name *
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Business Name *
                </label>
                <Input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Street Address *
                </label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Los Angeles"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="CA"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <Input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    placeholder="90001"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 text-lg"
                >
                  {loading ? 'Processing...' : 'Complete Enrollment - Free'}
                </Button>

                <p className="mt-4 text-center text-sm text-gray-600">
                  By enrolling, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login?redirect=/learn/online-sales-without-ads')}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
