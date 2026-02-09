import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, FileText, MessageSquare } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function LandingPageProcessingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const template = location.state?.template;

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!order || !template) {
      navigate('/merchant/swipe-file/templates?category=Landing Pages');
      return;
    }

    const steps = [
      { delay: 1000 },
      { delay: 2000 },
      { delay: 2500 },
    ];

    let currentDelay = 0;
    steps.forEach((step, index) => {
      currentDelay += step.delay;
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, currentDelay);
    });
  }, [order, template, navigate]);

  if (!order || !template) return null;

  const steps = [
    {
      icon: FileText,
      title: 'Order Received',
      description: 'Your landing page order has been submitted successfully',
      status: currentStep >= 1 ? 'completed' : 'pending'
    },
    {
      icon: Clock,
      title: 'Design Team Notified',
      description: 'Our team will begin customizing your template within 24 hours',
      status: currentStep >= 2 ? 'completed' : 'pending'
    },
    {
      icon: MessageSquare,
      title: 'Setup Confirmation',
      description: 'We\'ll contact you within 1 business day to confirm details',
      status: currentStep >= 3 ? 'completed' : 'pending'
    }
  ];

  return (
    <BusinessHubLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-[#2BB673] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-slate-600">
            Thank you for ordering your custom landing page
          </p>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">What Happens Next</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-[#2BB673]' : 'bg-slate-200'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <step.icon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Template</p>
                <p className="font-semibold text-slate-900">{template.title}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Industry</p>
                <p className="font-semibold text-slate-900 capitalize">{template.industry}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Order ID</p>
                <p className="font-semibold text-slate-900">{order.id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Monthly Price</p>
                <p className="font-semibold text-slate-900">$99.00</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600 mb-2">Business Information</p>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-slate-700">Business:</span>{' '}
                  <span className="text-slate-600">{order.details.business_info.businessName}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-slate-700">Contact:</span>{' '}
                  <span className="text-slate-600">{order.details.business_info.contactName}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-slate-700">Email:</span>{' '}
                  <span className="text-slate-600">{order.details.business_info.email}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-slate-700">Phone:</span>{' '}
                  <span className="text-slate-600">{order.details.business_info.phone}</span>
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-blue-50 border-blue-200">
          <CardBody>
            <div className="flex items-start">
              <MessageSquare className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Our design team will reach out within 1 business day to discuss your landing page details.
                  You can also contact us anytime at support@locallinkmarket.com
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate('/merchant/dashboard')}
                    className="bg-[#2BB673] hover:bg-[#25a062]"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/merchant/swipe-file/templates?category=Landing Pages')}
                    className="border-slate-300 text-slate-700 hover:bg-white"
                  >
                    Browse More Templates
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
