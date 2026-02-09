import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Phone, Clock, Calendar } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function AppointmentSettingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const hours = location.state?.hours || 20;
  const weeklyAmount = location.state?.weeklyAmount || hours * 25;

  useEffect(() => {
    if (!order) {
      navigate('/merchant/services/appointment-setting');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <BusinessHubLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-[#2BB673] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-slate-600">
            Your appointment setting service is being set up
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
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Live Callers</h3>
                <p className="text-sm text-slate-600">Professional team assigned</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{hours} Hours/Week</h3>
                <p className="text-sm text-slate-600">${weeklyAmount} weekly</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Start Date</h3>
                <p className="text-sm text-slate-600">Within 2-3 business days</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-3">What Happens Next</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Team Assignment</h4>
                    <p className="text-sm text-slate-600">
                      We'll assign trained callers familiar with your industry within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Onboarding Call</h4>
                    <p className="text-sm text-slate-600">
                      Our team will contact you to discuss your business, script, and calendar integration
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">CRM Integration</h4>
                    <p className="text-sm text-slate-600">
                      We'll connect to your CRM and calendar system for seamless booking
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-[#2BB673] text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">Calls Begin</h4>
                    <p className="text-sm text-slate-600">
                      Your team starts calling leads and booking appointments according to your schedule
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
                <span className="font-semibold text-slate-900">Appointment Setting</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Hours per Week</span>
                <span className="font-semibold text-slate-900">{hours}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Hourly Rate</span>
                <span className="font-semibold text-slate-900">$25.00</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-600">Weekly Cost</span>
                  <span className="text-2xl font-bold text-slate-900">${weeklyAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered" className="bg-blue-50 border-blue-200">
          <CardBody>
            <div className="flex items-start">
              <Phone className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Questions?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Our support team is here to help. We'll reach out within 24 hours to begin onboarding.
                  You can also contact us anytime at appointments@locallinkmarket.com
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
                    onClick={() => navigate('/merchant/merchant-services')}
                    className="border-slate-300 text-slate-700 hover:bg-white"
                  >
                    Browse Services
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
