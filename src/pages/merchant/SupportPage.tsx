import { useState } from 'react';
import { Mail, Send, CheckCircle, HelpCircle } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function SupportPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('support-email', {
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          merchantId: profile?.id,
          timestamp: new Date().toISOString()
        }
      });

      if (functionError) throw functionError;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('Error sending support email:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Support</h1>
          <p className="text-slate-600 mt-2">
            Get help with your account, services, or have a question
          </p>
        </div>

        {success && (
          <Card variant="bordered" className="bg-green-50 border-green-200">
            <CardBody>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <h3 className="font-bold text-green-900">Message Sent Successfully!</h3>
                  <p className="text-sm text-green-700">
                    We've received your message and will respond within 24 hours.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card variant="bordered">
              <CardHeader>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#2BB673]/10 rounded-lg flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-[#2BB673]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Contact Support</h2>
                    <p className="text-sm text-slate-600">We typically respond within 24 hours</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@business.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your question or issue in detail..."
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent resize-none"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    className="bg-[#2BB673] hover:bg-[#25a062]"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card variant="bordered" className="bg-blue-50">
              <CardHeader>
                <h3 className="font-bold text-slate-900">Quick Links</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="block text-sm text-slate-700 hover:text-[#2BB673] transition-colors"
                  >
                    → FAQ & Help Center
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-slate-700 hover:text-[#2BB673] transition-colors"
                  >
                    → Getting Started Guide
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-slate-700 hover:text-[#2BB673] transition-colors"
                  >
                    → Video Tutorials
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-slate-700 hover:text-[#2BB673] transition-colors"
                  >
                    → Billing & Payments
                  </a>
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered" className="bg-purple-50">
              <CardHeader>
                <h3 className="font-bold text-slate-900">Contact Info</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <p className="text-slate-600">apptpipeline@gmail.com</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Response Time</p>
                    <p className="text-slate-600">Within 24 hours</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Business Hours</p>
                    <p className="text-slate-600">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered" className="bg-emerald-50">
              <CardBody>
                <div className="flex items-start">
                  <HelpCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">
                      <strong>Pro Tip:</strong> Include as much detail as possible in your message to help us assist you faster.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
