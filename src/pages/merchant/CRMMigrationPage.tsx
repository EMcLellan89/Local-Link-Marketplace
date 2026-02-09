import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Check } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

export default function CRMMigrationPage() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const platforms = [
    'Jobber',
    'HouseCall Pro',
    'ServiceTitan',
    'Pipedrive',
    'JobNimbus',
    'Other'
  ];

  const migrationTiers = [
    { size: 'small', price: 399, features: ['Up to 500 contacts', '3 days completion', 'Basic automations'] },
    { size: 'medium', price: 699, features: ['Up to 2,000 contacts', '5 days completion', 'Advanced automations', 'Pipeline setup'] },
    { size: 'large', price: 999, features: ['Unlimited contacts', '7 days completion', 'Full automation suite', 'Custom integrations'] }
  ];

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Done-For-You CRM Migration</h1>
          <p className="text-slate-600 mt-2">
            We'll handle everything - from moving your data to setting up automations
          </p>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-[#2BB673]/5 to-[#25a062]/5">
          <CardBody>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#2BB673]/10 rounded-lg flex items-center justify-center">
                  <ArrowLeftRight className="w-6 h-6 text-[#2BB673]" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What's Included</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-600">
                    <Check className="w-5 h-5 text-[#2BB673] mr-2" />
                    Move all customers, jobs, and invoices
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="w-5 h-5 text-[#2BB673] mr-2" />
                    Build custom automations for your workflow
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="w-5 h-5 text-[#2BB673] mr-2" />
                    Set up SMS and email campaigns
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="w-5 h-5 text-[#2BB673] mr-2" />
                    Connect all your integrations
                  </li>
                  <li className="flex items-center text-slate-600">
                    <Check className="w-5 h-5 text-[#2BB673] mr-2" />
                    1-on-1 training session included
                  </li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Select Your Current Platform</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`p-4 rounded-lg border-2 text-center font-medium transition-all ${
                  selectedPlatform === platform
                    ? 'border-[#2BB673] bg-[#2BB673]/5 text-[#2BB673]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Choose Your Migration Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {migrationTiers.map((tier) => (
              <Card key={tier.size} variant="bordered">
                <CardHeader>
                  <h3 className="text-lg font-bold text-slate-900 capitalize">{tier.size} Business</h3>
                  <p className="text-3xl font-bold text-[#2BB673] mt-2">${tier.price}</p>
                </CardHeader>
                <CardBody>
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <Check className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button fullWidth variant="outline">
                    Select Package
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
