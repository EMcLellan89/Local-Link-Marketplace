import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import BackButton from '../components/ui/BackButton';
import { CheckCircle, Globe, TrendingUp, Users, DollarSign } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function PartnerApplication() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    partner_type: 'Agency' as 'Agency' | 'Publisher' | 'Media' | 'SalesTeam',
    requested_territory: '',
    current_coverage: '',
    est_merchants_30d: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('partner_applications')
        .insert([{
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone || null,
          partner_type: formData.partner_type,
          requested_territory: formData.requested_territory,
          current_coverage: formData.current_coverage || null,
          est_merchants_30d: formData.est_merchants_30d ? parseInt(formData.est_merchants_30d) : null,
          notes: formData.notes || null,
          status: 'New'
        }] as any);

      if (submitError) throw submitError;

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="mb-4">
        <BackButton />
      </div>
      <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Application Received!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for applying to become a Local Link Partner. Our team will review your
              application and reach out within 2-3 business days.
            </p>
            <p className="text-sm text-gray-500">
              We've sent a confirmation email to <strong>{formData.email}</strong>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Partner Application - Join Our Territory Partner Program"
        description="Become a LocalLink territory partner. Earn recurring commissions by bringing local businesses to the platform. Apply now for agencies, publishers, media companies, and sales teams."
        keywords="partner program, territory partner, agency partnership, publisher network, sales partnership, recurring commission"
        canonical="https://locallink.com/partner-application"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Become a Local Link Partner</h1>
          <p className="text-xl text-gray-600 mb-8">
            Secure your territory and build a local deals marketplace with 70% revenue share
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <Globe className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Territory-First Rollout</h3>
            <p className="text-gray-600">
              Secure exclusive territories globally. Not limited by geography — any partner can claim any
              available territory based on readiness and capability.
            </p>
          </Card>

          <Card className="p-6">
            <DollarSign className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">70% Revenue Share</h3>
            <p className="text-gray-600">
              Industry-leading partner economics. You keep 70% of net revenue from your territory
              with weekly automated payouts.
            </p>
          </Card>

          <Card className="p-6">
            <Users className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Full Platform Access</h3>
            <p className="text-gray-600">
              White-label ready platform with merchant onboarding, deal creation, QR codes,
              payment processing, and analytics.
            </p>
          </Card>

          <Card className="p-6">
            <TrendingUp className="w-10 h-10 text-orange-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Certification & Support</h3>
            <p className="text-gray-600">
              Complete training program with ongoing support. Advance from Local to Global
              certification levels as you scale.
            </p>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Submit Your Application</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <Input
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Your Company LLC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Name *</label>
                <Input
                  required
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Partner Type *</label>
                <select
                  required
                  value={formData.partner_type}
                  onChange={(e) => setFormData({ ...formData, partner_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Agency">Agency</option>
                  <option value="Publisher">Publisher</option>
                  <option value="Media">Media</option>
                  <option value="SalesTeam">Sales Team</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Requested Territory *</label>
                <Input
                  required
                  value={formData.requested_territory}
                  onChange={(e) => setFormData({ ...formData, requested_territory: e.target.value })}
                  placeholder="e.g., Los Angeles Metro, Toronto, London"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Current Coverage Areas</label>
              <textarea
                value={formData.current_coverage}
                onChange={(e) => setFormData({ ...formData, current_coverage: e.target.value })}
                placeholder="Describe where you currently operate or have existing merchant relationships..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Estimated Merchants in First 30 Days
              </label>
              <Input
                type="number"
                value={formData.est_merchants_30d}
                onChange={(e) => setFormData({ ...formData, est_merchants_30d: e.target.value })}
                placeholder="e.g., 25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Tell us about your team, experience, and why you'd be a great partner..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By submitting this application, you agree to our Partner Terms and Conditions.</p>
          <p className="mt-2">Questions? Email <a href="mailto:partners@locallink.com" className="text-blue-600 hover:underline">partners@locallink.com</a></p>
        </div>
      </div>
    </div>
    </>
  );
}
