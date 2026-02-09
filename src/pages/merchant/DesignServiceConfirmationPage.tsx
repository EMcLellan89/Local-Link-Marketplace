import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Palette, Clock, MessageSquare } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function DesignServiceConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/merchant/printing');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <BusinessHubLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Design Service Ordered!</h1>
          <p className="text-lg text-slate-600">
            Your design project is being set up
          </p>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Service Details</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Design Service</h3>
                <p className="text-sm text-slate-600">Professional design team</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">2-3 Business Days</h3>
                <p className="text-sm text-slate-600">Typical turnaround time</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Revisions Included</h3>
                <p className="text-sm text-slate-600">We'll perfect your design</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-3">What Happens Next</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Designer Assignment</h4>
                    <p className="text-sm text-slate-600">
                      We'll assign a professional designer to your project within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Design Creation</h4>
                    <p className="text-sm text-slate-600">
                      Our team will create your design based on your specifications and reference materials
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Review & Revisions</h4>
                    <p className="text-sm text-slate-600">
                      We'll send you the design for review and make any requested revisions
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Final Files & Printing</h4>
                    <p className="text-sm text-slate-600">
                      Once approved, we'll deliver print-ready files and can proceed with printing your materials
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Order ID</span>
                <span className="font-semibold text-slate-900">{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Service</span>
                <span className="font-semibold text-slate-900">Professional Design Service</span>
              </div>
              {order.details?.project_name && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Project Name</span>
                  <span className="font-semibold text-slate-900">{order.details.project_name}</span>
                </div>
              )}
              {order.details?.design_type && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Design Type</span>
                  <span className="font-semibold text-slate-900">{order.details.design_type}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-600">Total Paid</span>
                  <span className="text-2xl font-bold text-slate-900">$25.00</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-blue-50 border-blue-200">
          <CardBody>
            <div className="flex items-start">
              <MessageSquare className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Questions?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Our design team will reach out within 24 hours to confirm your project details.
                  You can also contact us anytime at design@locallinkmarket.com
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
                    onClick={() => navigate('/merchant/printing')}
                    className="border-slate-300 text-slate-700 hover:bg-white"
                  >
                    Back to Printing
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
