import { useState } from 'react';
import { Building, User, CreditCard, Bell, Shield } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [error, setError] = useState<string | null>(null);

  const handleSaveChanges = (section: string) => {
    try {
      alert(`${section} settings save functionality coming soon!`);
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      setError(`Failed to save ${section} settings. Please try again.`);
    }
  };

  const tabs = [
    { id: 'business', label: 'Business Profile', icon: Building },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-2">
            Manage your business profile and account preferences
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card variant="bordered">
              <CardBody className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-[#2BB673]/10 text-[#2BB673]'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-[#2BB673]' : 'text-slate-400'}`} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'business' && (
              <Card variant="bordered">
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Business Profile</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Business Name
                        </label>
                        <Input placeholder="Your Business Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Category
                        </label>
                        <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent">
                          <option>Home Services</option>
                          <option>Restaurant</option>
                          <option>Retail</option>
                          <option>Health & Wellness</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Business Description
                      </label>
                      <textarea
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                        rows={4}
                        placeholder="Describe your business..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <Input type="tel" placeholder="(555) 123-4567" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email
                        </label>
                        <Input type="email" placeholder="business@example.com" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Street Address
                      </label>
                      <Input placeholder="123 Main Street" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          City
                        </label>
                        <Input placeholder="City" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          State
                        </label>
                        <Input placeholder="State" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          ZIP Code
                        </label>
                        <Input placeholder="12345" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <Button onClick={() => handleSaveChanges('Business Profile')}>Save Changes</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab === 'personal' && (
              <Card variant="bordered">
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          First Name
                        </label>
                        <Input placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Last Name
                        </label>
                        <Input placeholder="Doe" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <Input type="tel" placeholder="(555) 123-4567" />
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <Button onClick={() => handleSaveChanges('Personal Information')}>Update Profile</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card variant="bordered">
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Billing & Payments</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-slate-900 mb-3">Current Subscription</h3>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-lg text-slate-900">Starter Plan</p>
                            <p className="text-sm text-slate-600">$399/month</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Upgrade Plan
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900 mb-3">Payment Method</h3>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CreditCard className="w-8 h-8 text-slate-400 mr-3" />
                            <div>
                              <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                              <p className="text-sm text-slate-600">Expires 12/25</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-900 mb-3">Billing History</h3>
                      <div className="space-y-2">
                        {[
                          { date: 'Jan 1, 2025', amount: '$399.00', status: 'Paid' },
                          { date: 'Dec 1, 2024', amount: '$399.00', status: 'Paid' },
                          { date: 'Nov 1, 2024', amount: '$399.00', status: 'Paid' }
                        ].map((invoice, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{invoice.date}</p>
                              <p className="text-sm text-slate-600">{invoice.status}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-slate-900">{invoice.amount}</p>
                              <button className="text-sm text-[#2BB673] hover:underline">
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card variant="bordered">
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {[
                      { label: 'New deal purchases', desc: 'Get notified when customers buy your deals' },
                      { label: 'Deal redemptions', desc: 'Alert when customers redeem their vouchers' },
                      { label: 'Payout notifications', desc: 'Updates on pending and completed payouts' },
                      { label: 'Marketing tips', desc: 'Weekly tips to improve your deals' },
                      { label: 'System updates', desc: 'New features and platform updates' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
                        <div>
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <p className="text-sm text-slate-600">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2BB673]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2BB673]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card variant="bordered">
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Security Settings</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-slate-900 mb-3">Change Password</h3>
                      <div className="space-y-3">
                        <Input type="password" placeholder="Current password" />
                        <Input type="password" placeholder="New password" />
                        <Input type="password" placeholder="Confirm new password" />
                        <Button onClick={() => handleSaveChanges('Password')}>Update Password</Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      <h3 className="font-medium text-slate-900 mb-3">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-600 mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      <h3 className="font-medium text-slate-900 mb-3">Active Sessions</h3>
                      <div className="space-y-2">
                        {[
                          { device: 'Chrome on Windows', location: 'New York, US', current: true },
                          { device: 'Safari on iPhone', location: 'New York, US', current: false }
                        ].map((session, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">
                                {session.device}
                                {session.current && (
                                  <span className="ml-2 text-xs bg-[#2BB673] text-white px-2 py-0.5 rounded">
                                    Current
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-slate-600">{session.location}</p>
                            </div>
                            {!session.current && (
                              <button className="text-sm text-red-600 hover:underline">
                                Revoke
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
