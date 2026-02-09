import { useState } from 'react';
import { Target, MapPin } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';

export default function LeadsPage() {
  const [leadCount, setLeadCount] = useState(500);
  const [error, setError] = useState<string | null>(null);

  const totalCost = (leadCount * 0.20).toFixed(2);

  const handleOrderLeads = () => {
    try {
      if (leadCount < 100) {
        alert('Minimum order is 100 leads.');
        return;
      }
      alert('Lead ordering feature coming soon!');
    } catch (error) {
      console.error('Error ordering leads:', error);
      setError('Failed to process order. Please try again.');
    }
  };

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Buy Quality Leads</h1>
          <p className="text-slate-600 mt-2">
            Get verified, high-quality leads delivered directly to your CRM
          </p>
        </div>

        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <p className="text-red-800 font-medium">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Order Leads</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Leads
                  </label>
                  <Input
                    type="number"
                    value={leadCount}
                    onChange={(e) => setLeadCount(Number(e.target.value))}
                    min={100}
                    step={100}
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    Minimum order: 100 leads
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Location
                  </label>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-slate-400 mr-2" />
                    <Input placeholder="Enter city or ZIP code" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Industry / Category
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent">
                    <option>Home Services</option>
                    <option>Restaurants</option>
                    <option>Retail</option>
                    <option>Health & Wellness</option>
                    <option>Automotive</option>
                    <option>Professional Services</option>
                  </select>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">Leads</span>
                    <span className="font-medium">{leadCount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">Price per lead</span>
                    <span className="font-medium">$0.20</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-[#2BB673]">${totalCost}</span>
                    </div>
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={handleOrderLeads}>
                  Order Leads
                </Button>
              </div>
            </CardBody>
          </Card>

          <div className="space-y-6">
            <Card variant="bordered" className="bg-[#2BB673]/5">
              <CardBody>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#2BB673]/10 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-[#2BB673]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">High-Quality Leads</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>• Verified contact information</li>
                      <li>• Pre-qualified by location</li>
                      <li>• Filtered by demographics</li>
                      <li>• Auto-imported to your CRM</li>
                      <li>• Delivered within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
              </CardHeader>
              <CardBody>
                <div className="text-center py-8 text-slate-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No lead orders yet</p>
                  <p className="text-sm">Your lead orders will appear here</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
