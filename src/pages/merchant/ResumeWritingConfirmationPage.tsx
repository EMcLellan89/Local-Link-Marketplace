import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, FileText, ArrowLeft, Clock } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function ResumeWritingConfirmationPage() {
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
            <Button variant="outline" onClick={() => navigate('/merchant/recruiting')}>
              Back to Recruiting
            </Button>
            <Button onClick={() => navigate('/merchant/recruiting')}>
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
          onClick={() => navigate('/merchant/recruiting')}
          className="flex items-center text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recruiting
        </button>

        <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardBody>
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
              <p className="text-slate-600 mb-2">
                Your professional resume writing service has been purchased successfully
              </p>
              <p className="text-sm text-slate-500">
                Order confirmation has been sent to your email
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#2BB673]/10 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-[#2BB673]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">What Happens Next?</h3>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#2BB673] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Review Your Information</h4>
                    <p className="text-sm text-slate-600">
                      Our team will review the information you provided within 24 hours
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#2BB673] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Professional Writing</h4>
                    <p className="text-sm text-slate-600">
                      Our certified resume writers will craft your professional resume
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#2BB673] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">First Draft Delivery</h4>
                    <p className="text-sm text-slate-600">
                      You'll receive your first draft within 3 business days for review
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#2BB673] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Revisions & Final Delivery</h4>
                    <p className="text-sm text-slate-600">
                      2 rounds of revisions included to ensure your complete satisfaction
                    </p>
                  </div>
                </li>
              </ol>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">What You'll Receive</h3>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>ATS-Optimized Resume</strong> - Formatted to pass applicant tracking systems
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>Industry Keywords</strong> - Relevant terminology for your field
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>Achievement Focus</strong> - Quantified results and accomplishments
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>Professional Layout</strong> - Clean, modern design that stands out
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>Multiple Formats</strong> - PDF and Word versions included
                  </span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="bg-blue-50">
          <CardBody>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Questions or Need Changes?</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Our resume writing team is here to help. You'll receive direct contact information with your first draft,
                  and we offer 2 rounds of revisions to ensure your resume is perfect.
                </p>
                <p className="text-sm text-slate-600">
                  Expected delivery: <strong>Within 3 business days</strong>
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardBody>
              <h3 className="font-bold text-slate-900 mb-3">Need More Recruiting Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Check out our other recruiting services including job description templates and hiring funnel setup.
              </p>
              <Button variant="outline" fullWidth onClick={() => navigate('/merchant/recruiting')}>
                View All Recruiting Services
              </Button>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <h3 className="font-bold text-slate-900 mb-3">Track Your Order</h3>
              <p className="text-sm text-slate-600 mb-4">
                You can track the progress of your resume and view all your orders in your dashboard.
              </p>
              <Button variant="outline" fullWidth onClick={() => navigate('/merchant/dashboard')}>
                Go to Dashboard
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
