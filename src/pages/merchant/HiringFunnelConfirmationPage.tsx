import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Users, ArrowLeft, FileText } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

const templateContent = {
  retail: {
    name: 'Retail Hiring Funnel',
    documents: [
      { name: 'Application Screening Questions', type: 'Template', size: '2 pages' },
      { name: 'Automated Email Response Templates', type: 'Email Pack', size: '8 templates' },
      { name: 'Interview Scheduling Guide', type: 'Process', size: '4 pages' },
      { name: 'Candidate Scoring Rubric', type: 'Spreadsheet', size: '1 page' },
      { name: 'Onboarding Checklist', type: 'Checklist', size: '3 pages' },
      { name: 'First Week Training Schedule', type: 'Schedule', size: '2 pages' },
      { name: 'Performance Review Template', type: 'Form', size: '4 pages' }
    ]
  },
  restaurant: {
    name: 'Restaurant Hiring Funnel',
    documents: [
      { name: 'Quick Application Form', type: 'Form', size: '1 page' },
      { name: 'Availability Screening Matrix', type: 'Template', size: '1 page' },
      { name: 'Group Interview Scheduler', type: 'Calendar', size: '2 pages' },
      { name: 'Skills Assessment Checklist - FOH', type: 'Checklist', size: '2 pages' },
      { name: 'Skills Assessment Checklist - BOH', type: 'Checklist', size: '2 pages' },
      { name: 'Training Schedule Template', type: 'Schedule', size: '3 pages' },
      { name: 'Food Safety Certification Tracker', type: 'Tracker', size: '1 page' }
    ]
  },
  professional: {
    name: 'Professional Services Funnel',
    documents: [
      { name: 'Detailed Application Review Form', type: 'Form', size: '4 pages' },
      { name: 'Skills Testing Templates (5 tests)', type: 'Test Pack', size: '15 pages' },
      { name: 'First Round Interview Guide', type: 'Guide', size: '6 pages' },
      { name: 'Second Round Interview Guide', type: 'Guide', size: '5 pages' },
      { name: 'Reference Check Form', type: 'Form', size: '2 pages' },
      { name: 'Offer Letter Template', type: 'Template', size: '3 pages' },
      { name: 'Negotiation Guide', type: 'Guide', size: '4 pages' },
      { name: 'Onboarding Plan - 90 Days', type: 'Plan', size: '8 pages' }
    ]
  },
  custom: {
    name: 'Custom Funnel Builder',
    documents: [
      { name: 'Blank Application Template', type: 'Template', size: 'Customizable' },
      { name: 'Email Template Builder', type: 'Builder', size: '20+ templates' },
      { name: 'Interview Guide Framework', type: 'Framework', size: 'Modular' },
      { name: 'Scoring System Templates', type: 'Templates', size: '5 systems' },
      { name: 'Onboarding Component Library', type: 'Library', size: '30+ components' },
      { name: 'Automation Workflow Builder', type: 'Software', size: 'Unlimited' },
      { name: 'Custom Form Builder', type: 'Builder', size: 'Unlimited' },
      { name: 'Priority Support Access', type: 'Service', size: '24/7' }
    ]
  }
};

export default function HiringFunnelConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

  const orderId = searchParams.get('orderId');
  const [templateType, setTemplateType] = useState<keyof typeof templateContent>('retail');

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

  const template = templateContent[templateType];

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
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Purchase Complete!</h1>
              <p className="text-slate-600 mb-6">
                You now have lifetime access to your {template.name}
              </p>
              <div className="flex justify-center gap-3">
                <Button className="bg-[#2BB673] hover:bg-[#25a062]">
                  <Download className="w-5 h-5 mr-2" />
                  Download Complete Package
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Hiring Funnel Templates</h2>
                <p className="text-slate-600 mt-1">All documents are ready to download and customize</p>
              </div>
              <div className="flex gap-2">
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value as keyof typeof templateContent)}
                  className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                >
                  <option value="retail">Retail Funnel</option>
                  <option value="restaurant">Restaurant Funnel</option>
                  <option value="professional">Professional Funnel</option>
                  <option value="custom">Custom Builder</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {template.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-[#2BB673] hover:bg-[#2BB673]/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2BB673]/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#2BB673]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                      <p className="text-sm text-slate-600">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Getting Started</h3>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <ol className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="font-bold text-[#2BB673] mr-2">1.</span>
                  <span>Download all templates to your computer</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-[#2BB673] mr-2">2.</span>
                  <span>Customize each document with your company branding</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-[#2BB673] mr-2">3.</span>
                  <span>Set up your email automation sequences</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-[#2BB673] mr-2">4.</span>
                  <span>Train your team on the new hiring process</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-[#2BB673] mr-2">5.</span>
                  <span>Start posting jobs and managing candidates</span>
                </li>
              </ol>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Support & Resources</h3>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Video Tutorials</p>
                    <p className="text-sm text-slate-600">Step-by-step setup guides</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Email Support</p>
                    <p className="text-sm text-slate-600">Response within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Lifetime Updates</p>
                    <p className="text-sm text-slate-600">Free access to all future versions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Community Access</p>
                    <p className="text-sm text-slate-600">Join our hiring best practices forum</p>
                  </div>
                </div>
              </div>
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
                <h3 className="font-bold text-slate-900 mb-2">Need Help Getting Started?</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Our team is here to help you set up your hiring funnel. Book a free 30-minute consultation call to get personalized guidance.
                </p>
                <Button variant="outline" size="sm">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="text-center py-6">
          <p className="text-slate-600 mb-4">Ready to explore more recruiting tools?</p>
          <Button variant="outline" onClick={() => navigate('/merchant/recruiting')}>
            View All Recruiting Services
          </Button>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
