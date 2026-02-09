import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, FileText, ArrowLeft } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function JobTemplatesConfirmationPage() {
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

  const templates = [
    { category: 'Sales', roles: ['Sales Associate', 'Sales Manager', 'Account Executive', 'Business Development Rep'] },
    { category: 'Hospitality', roles: ['Restaurant Server', 'Host/Hostess', 'Bartender', 'Line Cook'] },
    { category: 'Retail', roles: ['Store Manager', 'Assistant Manager', 'Cashier', 'Stock Associate'] },
    { category: 'Marketing', roles: ['Marketing Coordinator', 'Social Media Manager', 'Content Creator', 'Brand Manager'] },
    { category: 'Customer Service', roles: ['Customer Service Rep', 'Call Center Agent', 'Support Specialist', 'Client Success Manager'] },
    { category: 'Administrative', roles: ['Administrative Assistant', 'Office Manager', 'Receptionist', 'Data Entry Clerk'] },
    { category: 'Management', roles: ['General Manager', 'Operations Manager', 'Department Head', 'Team Leader'] },
    { category: 'Technical', roles: ['IT Support', 'Web Developer', 'Systems Administrator', 'Technical Support'] }
  ];

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
            <Button onClick={() => navigate('/merchant/recruiting/job-templates-checkout')}>
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
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Purchase Complete!</h1>
              <p className="text-slate-600 mb-6">
                You now have access to all 50+ job description templates
              </p>
              <div className="flex justify-center gap-3">
                <Button className="bg-[#2BB673] hover:bg-[#25a062]">
                  <Download className="w-5 h-5 mr-2" />
                  Download All Templates
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Templates Library</h2>
          <p className="text-slate-600 mb-6">
            Browse and download any template below. All templates are fully customizable for your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((category) => (
            <Card key={category.category} variant="bordered">
              <CardHeader>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#2BB673]/10 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-[#2BB673]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{category.category}</h3>
                    <p className="text-sm text-slate-600">{category.roles.length} templates</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2 mb-4">
                  {category.roles.map((role) => (
                    <li key={role} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{role}</span>
                      <button className="text-[#2BB673] hover:text-[#25a062] font-medium">
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" fullWidth size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Category Pack
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        <Card variant="bordered" className="bg-blue-50">
          <CardBody>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">How to Use Your Templates</h3>
                <ol className="space-y-2 text-sm text-slate-600">
                  <li>1. Download the template for the role you're hiring</li>
                  <li>2. Customize it with your company name, benefits, and specific requirements</li>
                  <li>3. Post it to job boards, your website, or social media</li>
                  <li>4. Start receiving qualified applications</li>
                </ol>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardBody>
            <div className="text-center py-4">
              <h3 className="font-bold text-slate-900 mb-2">Need More Recruiting Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Check out our other recruiting services including resume writing and hiring funnel setup
              </p>
              <Button variant="outline" onClick={() => navigate('/merchant/recruiting')}>
                View All Recruiting Services
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
