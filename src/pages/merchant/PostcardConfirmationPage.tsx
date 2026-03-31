import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function PostcardConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

  useEffect(() => {
    const paymentStatus = searchParams.get('status');
    if (paymentStatus === 'success') {
      setStatus('success');
    } else if (paymentStatus === 'failed') {
      setStatus('failed');
    }
  }, [searchParams]);

  if (status === 'processing') {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2BB673] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Processing your payment...</p>
          </div>
        </div>
      </BusinessHubLayout>
    );
  }

  if (status === 'failed') {
    return (
      <BusinessHubLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h2>
          <p className="text-slate-600 mb-6">
            There was an issue processing your payment. Please try again or contact support if the problem persists.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/merchant/postcards')}>
              Back to Postcards
            </Button>
            <Button onClick={() => navigate('/merchant/postcards')}>
              Try Again
            </Button>
          </div>
        </div>
      </BusinessHubLayout>
    );
  }

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

        <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardBody>
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
              <p className="text-slate-600 mb-2">
                Your postcard placement has been secured
              </p>
              <p className="text-sm text-slate-500">
                Confirmation sent to your email
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="bordered" className="bg-blue-50">
            <CardBody>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Next Mailing</h3>
                  <p className="text-sm text-slate-600">February 15th</p>
                  <p className="text-xs text-slate-500 mt-1">5,000 homes</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-purple-50">
            <CardBody>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Proof Deadline</h3>
                  <p className="text-sm text-slate-600">February 8th</p>
                  <p className="text-xs text-slate-500 mt-1">7 days away</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-emerald-50">
            <CardBody>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Tracking Setup</h3>
                  <p className="text-sm text-slate-600">QR code ready</p>
                  <p className="text-xs text-slate-500 mt-1">Analytics enabled</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">What Happens Next?</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Ad Design & Proof</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-3">
                      <strong>If you uploaded your ad:</strong> We'll review it for print quality and contact you if any adjustments are needed.
                    </p>
                    <p className="text-sm text-slate-600">
                      <strong>If we're designing your ad:</strong> Our team will create a professional design based on your website and brand. You'll receive a proof within 2 business days for your approval.
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Expected: Within 2 business days
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Review & Approve</h3>
                  <p className="text-sm text-slate-600">
                    Once you receive your proof, review it carefully and let us know if you'd like any changes. Final approval must be received by <strong>February 8th</strong> to be included in the February 15th mailing.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Deadline: February 8th, 5:00 PM EST
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Printing & Mailing</h3>
                  <p className="text-sm text-slate-600">
                    We'll print and mail your postcards to 5,000 local households. Each postcard includes a unique QR code for tracking.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Mailing Date: February 15th
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Track Performance</h3>
                  <p className="text-sm text-slate-600">
                    Watch your analytics dashboard to see QR code scans, website visits, and deal purchases from your postcard campaign.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate('/merchant/analytics')}
                  >
                    View Analytics Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">Questions about your ad?</p>
                  <p className="text-slate-600">design@locallink.com</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Need to make changes?</p>
                  <p className="text-slate-600">support@locallink.com</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Phone Support</p>
                  <p className="text-slate-600">(555) 123-4567</p>
                  <p className="text-xs text-slate-500">Mon-Fri, 9am-5pm EST</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <h3 className="text-lg font-bold text-slate-900">Important Reminders</h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Check your email for ad proof (within 2 business days)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Approve or request changes by February 8th</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Postcards mail on February 15th</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Monitor analytics for campaign performance</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-orange-50 to-amber-50">
          <CardBody>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">
                  Maximize Your Results
                </h3>
                <p className="text-slate-600 mb-3">
                  Combine your postcard campaign with email and SMS marketing for up to 3x better response rates. Set up automated follow-ups for people who scan your QR code.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/merchant/merchant-services')}
                  >
                    Setup Follow-Up Campaigns
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/merchant/marketing')}
                  >
                    View Marketing Tools
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="text-center py-6">
          <Button onClick={() => navigate('/merchant/postcards')}>
            Back to Postcard Marketing
          </Button>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
