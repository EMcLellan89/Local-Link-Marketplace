import { useNavigate } from 'react-router-dom';
import { Package, Check, ArrowRight } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function AISuitePackagesPage() {
  const navigate = useNavigate();

  const packages = [
    {
      name: 'Lead Generation Package',
      price: 497,
      regularPrice: 597,
      savings: 100,
      description: 'Complete lead generation system. Attract, qualify, and convert more leads on autopilot.',
      includes: [
        'AI Lead Qualifier Bot ($249/mo)',
        'AI Ad Copy Writer ($149/mo)',
        'AI Social Media Manager ($199/mo)',
      ],
      features: [
        'Integrated lead pipeline',
        'Unified analytics dashboard',
        'Cross-bot optimization',
        'Priority setup & support',
        'Complete lead generation automation'
      ],
      color: 'blue',
      icon: '🎯'
    },
    {
      name: 'Customer Service Package',
      price: 497,
      regularPrice: 577,
      savings: 80,
      description: 'Ultimate customer experience automation. Deliver 5-star service 24/7.',
      includes: [
        'AI Appointment Scheduler Bot ($199/mo)',
        'AI Review Responder ($149/mo)',
        'AI Follow-Up Automation Bot ($179/mo)',
      ],
      features: [
        'Seamless customer journey',
        'Unified communication platform',
        'Customer satisfaction tracking',
        'Priority setup & support',
        'Complete customer service automation'
      ],
      color: 'green',
      icon: '⭐'
    },
    {
      name: 'Revenue Maximization Package',
      price: 447,
      regularPrice: 527,
      savings: 80,
      description: 'Maximize cash flow and customer lifetime value. Get paid faster and keep customers longer.',
      includes: [
        'AI Invoice Reminder Bot ($149/mo)',
        'AI Customer Retention Bot ($199/mo)',
        'AI Email Composer ($179/mo)',
      ],
      features: [
        'Cash flow optimization',
        'Retention campaign automation',
        'Revenue analytics dashboard',
        'Priority setup & support',
        'Complete revenue automation'
      ],
      color: 'emerald',
      icon: '💰'
    },
    {
      name: 'Complete AI Suite',
      price: 1497,
      regularPrice: 2100,
      savings: 603,
      description: 'Every AI bot we offer in one mega package. Complete business automation from lead generation to customer retention.',
      includes: [
        'All 12+ AI Bots Included',
        'AI Ad Copy Writer',
        'AI Social Media Manager',
        'AI Email Composer',
        'AI Review Responder',
        'AI Quote Assistant',
        'AI Appointment Scheduler',
        'AI Lead Qualifier',
        'AI Follow-Up Automation',
        'AI Invoice Reminder',
        'AI Customer Retention',
        'AI Reputation Monitor',
        'AI Proposal Generator',
      ],
      features: [
        'White-glove setup & training',
        'Priority 24/7 support',
        'Custom integrations',
        'Complete business automation',
        'Maximum value & savings'
      ],
      color: 'purple',
      icon: '🚀',
      featured: true
    }
  ];

  return (
    <BusinessHubLayout>
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">AI Suite Packages</h1>
          <p className="text-xl text-slate-600 mt-3 max-w-3xl mx-auto">
            Save big by bundling AI bots together. Get complete automation for your business at a fraction of the cost.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              variant="bordered"
              className={`hover:shadow-xl transition-all ${pkg.featured ? 'ring-2 ring-[#2BB673] relative' : ''}`}
            >
              {pkg.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#2BB673] to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    BEST VALUE
                  </span>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl mb-3">{pkg.icon}</div>
                    <h3 className="text-2xl font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-slate-600 mt-2">{pkg.description}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#2BB673]">${pkg.price}</span>
                    <span className="text-lg text-slate-600">/month</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 line-through">${pkg.regularPrice}/mo</span>
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      Save ${pkg.savings}/mo
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">What's Included:</h4>
                    <ul className="space-y-2">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-start">
                          <Check className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Key Features:</h4>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start">
                          <span className="text-[#2BB673] mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    fullWidth
                    className={`${pkg.featured ? 'bg-gradient-to-r from-[#2BB673] to-emerald-600' : 'bg-[#2BB673]'} hover:opacity-90 text-white mt-4`}
                  >
                    Get This Package
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardBody>
            <div className="text-center py-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Not sure which package is right for you?</h3>
              <p className="text-slate-600 mb-4">
                Explore individual AI bots and build your own custom solution
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/merchant/ai-bots')}
              >
                View All AI Bots
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <h3 className="text-xl font-bold text-slate-900">Package Comparison</h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Package</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Bots Included</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Regular Price</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Package Price</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">You Save</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-900">{pkg.name}</td>
                      <td className="text-center py-3 px-4 text-slate-600">{pkg.includes.length}</td>
                      <td className="text-center py-3 px-4 text-slate-500 line-through">${pkg.regularPrice}</td>
                      <td className="text-center py-3 px-4 font-bold text-[#2BB673]">${pkg.price}</td>
                      <td className="text-center py-3 px-4 font-semibold text-emerald-600">${pkg.savings}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
