import { UserPlus, FileText, Users, BookOpen, Upload } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';

export default function RecruitingPage() {
  const navigate = useNavigate();
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [showJobTemplates, setShowJobTemplates] = useState(false);
  const [showHiringTemplates, setShowHiringTemplates] = useState(false);
  const [selectedHiringTemplate, setSelectedHiringTemplate] = useState<string | null>('retail');

  const services = [
    {
      name: 'Resume Writing',
      icon: FileText,
      price: 150,
      description: 'Professional resume creation for key hires',
      features: [
        'ATS-optimized formatting',
        'Industry-specific keywords',
        'Achievement-focused content',
        '2 rounds of revisions',
        '3-day turnaround'
      ]
    },
    {
      name: 'Job Description Templates',
      icon: BookOpen,
      price: 150,
      description: 'Pre-written job postings for common roles',
      features: [
        '50+ role templates',
        'Customizable for your business',
        'Compliance-checked',
        'Instant download',
        'Lifetime access'
      ]
    },
    {
      name: 'Hiring Funnel Setup',
      icon: Users,
      price: 750,
      description: 'Complete recruitment automation system',
      features: [
        'Application tracking',
        'Automated screening',
        'Interview scheduling',
        'Candidate scoring',
        'Email templates'
      ]
    }
  ];

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recruiting Tools & Services</h1>
          <p className="text-slate-600 mt-2">
            Hire better talent faster with professional recruiting support
          </p>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-[#2BB673]/5 to-[#25a062]/5">
          <CardBody>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#2BB673]/10 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-[#2BB673]" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Build Your Dream Team
                </h3>
                <p className="text-slate-600">
                  From resume writing to onboarding, we help you attract, hire, and retain top talent.
                  Our recruiting tools streamline your hiring process and help you build a stronger team.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            const handleOrderClick = () => {
              if (service.name === 'Resume Writing') {
                setShowResumeForm(true);
              } else if (service.name === 'Job Description Templates') {
                setShowJobTemplates(true);
              } else if (service.name === 'Hiring Funnel Setup') {
                setShowHiringTemplates(true);
              }
            };

            return (
              <Card key={service.name} variant="bordered">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#2BB673]/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-[#2BB673]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                  <p className="text-sm text-slate-600 mt-1 mb-3">{service.description}</p>
                  <p className="text-3xl font-bold text-[#2BB673]">${service.price}</p>
                </CardHeader>
                <CardBody>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                  <Button fullWidth variant="outline" onClick={handleOrderClick}>
                    Let's Go
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">New Employee Onboarding Package</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-600 mb-4">
                  Get your new hires up to speed quickly with our comprehensive onboarding templates
                  and checklists. Everything you need to welcome and train new team members.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900">Includes:</h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Welcome email templates</li>
                    <li>• First week checklist</li>
                    <li>• Training schedules</li>
                    <li>• Employee handbook template</li>
                    <li>• Performance review templates</li>
                    <li>• Company policies & procedures</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="bg-slate-50 rounded-lg p-6 text-center mb-4">
                  <p className="text-sm text-slate-600 mb-2">Complete Package</p>
                  <p className="text-4xl font-bold text-[#2BB673] mb-4">$299</p>
                  <p className="text-xs text-slate-500">One-time purchase</p>
                </div>
                <Button fullWidth>
                  Purchase Onboarding Package
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="bordered" className="bg-blue-50">
            <CardBody>
              <h3 className="font-bold text-slate-900 mb-3">Why Recruiting Matters</h3>
              <p className="text-sm text-slate-600 mb-3">
                Your team is your most valuable asset. Hiring the right people can:
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Increase revenue by 2-3x</li>
                <li>• Improve customer satisfaction</li>
                <li>• Reduce turnover costs</li>
                <li>• Build a stronger company culture</li>
                <li>• Scale your operations faster</li>
              </ul>
            </CardBody>
          </Card>

          <Card variant="bordered" className="bg-purple-50">
            <CardBody>
              <h3 className="font-bold text-slate-900 mb-3">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Not sure where to start with hiring? Our team can help you develop a complete
                recruitment strategy tailored to your business needs.
              </p>
              <Button variant="outline" fullWidth>
                Schedule Consultation
              </Button>
            </CardBody>
          </Card>
        </div>

        {showResumeForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card variant="bordered" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Resume Writing Service</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <p className="text-slate-600 mb-4">Choose how you'd like to proceed:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        navigate('/merchant/recruiting/resume-writing-checkout', {
                          state: { resumeOption: 'upload' }
                        });
                      }}
                      className="p-6 border-2 border-slate-200 rounded-lg hover:border-[#2BB673] hover:bg-[#2BB673]/5 transition-all"
                    >
                      <Upload className="w-8 h-8 text-[#2BB673] mx-auto mb-3" />
                      <h3 className="font-bold text-slate-900 mb-2">Upload Existing Resume</h3>
                      <p className="text-sm text-slate-600">Upload your current resume for professional enhancement</p>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/merchant/recruiting/resume-writing-checkout', {
                          state: { resumeOption: 'template' }
                        });
                      }}
                      className="p-6 border-2 border-slate-200 rounded-lg hover:border-[#2BB673] hover:bg-[#2BB673]/5 transition-all"
                    >
                      <FileText className="w-8 h-8 text-[#2BB673] mx-auto mb-3" />
                      <h3 className="font-bold text-slate-900 mb-2">Start from Template</h3>
                      <p className="text-sm text-slate-600">Fill out our template to create a new resume</p>
                    </button>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => setShowResumeForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {showJobTemplates && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card variant="bordered" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Job Description Templates</h2>
                <p className="text-sm text-slate-600 mt-1">Choose from 50+ pre-written templates</p>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[
                    { title: 'Sales Associate', category: 'Sales', preview: 'Seeking energetic sales professional...' },
                    { title: 'Restaurant Server', category: 'Hospitality', preview: 'Looking for friendly server with...' },
                    { title: 'Store Manager', category: 'Management', preview: 'Experienced retail manager needed...' },
                    { title: 'Marketing Coordinator', category: 'Marketing', preview: 'Creative marketing professional...' },
                    { title: 'Customer Service Rep', category: 'Support', preview: 'Customer-focused individual...' },
                    { title: 'Administrative Assistant', category: 'Admin', preview: 'Organized professional for office...' }
                  ].map((template) => (
                    <div key={template.title} className="p-4 border border-slate-200 rounded-lg hover:border-[#2BB673] cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900">{template.title}</h3>
                        <span className="text-xs bg-[#2BB673]/10 text-[#2BB673] px-2 py-1 rounded">{template.category}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{template.preview}</p>
                      <Button size="sm" fullWidth variant="outline">Preview & Use</Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-slate-600">+ 44 more templates available</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowJobTemplates(false)}>
                      Cancel
                    </Button>
                    <Button>Purchase All Templates - $150</Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {showHiringTemplates && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card variant="bordered" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <h2 className="text-xl font-bold text-slate-900">Hiring Funnel Setup Templates</h2>
                <p className="text-sm text-slate-600 mt-1">Complete recruitment automation system</p>
              </CardHeader>
              <CardBody>
                <div className="space-y-4 mb-6">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedHiringTemplate === 'retail'
                        ? 'border-[#2BB673] bg-[#2BB673]/5'
                        : 'border-slate-200 hover:border-[#2BB673]'
                    }`}
                    onClick={() => setSelectedHiringTemplate('retail')}
                  >
                    <h3 className="font-bold text-slate-900 mb-2">Retail Hiring Funnel</h3>
                    <p className="text-sm text-slate-600 mb-3">Pre-configured for retail and customer-facing positions</p>
                    <ul className="space-y-1 text-sm text-slate-600 mb-3">
                      <li>✓ Application screening questions</li>
                      <li>✓ Automated email responses</li>
                      <li>✓ Interview scheduling templates</li>
                      <li>✓ Candidate scoring rubric</li>
                      <li>✓ Onboarding checklist</li>
                    </ul>
                    <Button
                      size="sm"
                      fullWidth
                      className={selectedHiringTemplate === 'retail' ? 'bg-[#2BB673]' : ''}
                      variant={selectedHiringTemplate === 'retail' ? 'primary' : 'outline'}
                    >
                      {selectedHiringTemplate === 'retail' ? 'Selected' : 'Select This Template'}
                    </Button>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedHiringTemplate === 'restaurant'
                        ? 'border-[#2BB673] bg-[#2BB673]/5'
                        : 'border-slate-200 hover:border-[#2BB673]'
                    }`}
                    onClick={() => setSelectedHiringTemplate('restaurant')}
                  >
                    <h3 className="font-bold text-slate-900 mb-2">Restaurant Hiring Funnel</h3>
                    <p className="text-sm text-slate-600 mb-3">Optimized for front and back-of-house positions</p>
                    <ul className="space-y-1 text-sm text-slate-600 mb-3">
                      <li>✓ Quick application form</li>
                      <li>✓ Availability screening</li>
                      <li>✓ Group interview scheduler</li>
                      <li>✓ Skills assessment checklist</li>
                      <li>✓ Training schedule template</li>
                    </ul>
                    <Button
                      size="sm"
                      fullWidth
                      className={selectedHiringTemplate === 'restaurant' ? 'bg-[#2BB673]' : ''}
                      variant={selectedHiringTemplate === 'restaurant' ? 'primary' : 'outline'}
                    >
                      {selectedHiringTemplate === 'restaurant' ? 'Selected' : 'Select This Template'}
                    </Button>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedHiringTemplate === 'professional'
                        ? 'border-[#2BB673] bg-[#2BB673]/5'
                        : 'border-slate-200 hover:border-[#2BB673]'
                    }`}
                    onClick={() => setSelectedHiringTemplate('professional')}
                  >
                    <h3 className="font-bold text-slate-900 mb-2">Professional Services Funnel</h3>
                    <p className="text-sm text-slate-600 mb-3">For office, admin, and professional roles</p>
                    <ul className="space-y-1 text-sm text-slate-600 mb-3">
                      <li>✓ Detailed application review</li>
                      <li>✓ Skills testing templates</li>
                      <li>✓ Multi-round interview guides</li>
                      <li>✓ Reference check forms</li>
                      <li>✓ Offer letter template</li>
                    </ul>
                    <Button
                      size="sm"
                      fullWidth
                      className={selectedHiringTemplate === 'professional' ? 'bg-[#2BB673]' : ''}
                      variant={selectedHiringTemplate === 'professional' ? 'primary' : 'outline'}
                    >
                      {selectedHiringTemplate === 'professional' ? 'Selected' : 'Select This Template'}
                    </Button>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedHiringTemplate === 'custom'
                        ? 'border-[#2BB673] bg-[#2BB673]/5'
                        : 'border-slate-200 hover:border-[#2BB673]'
                    }`}
                    onClick={() => setSelectedHiringTemplate('custom')}
                  >
                    <h3 className="font-bold text-slate-900 mb-2">Custom Funnel Builder</h3>
                    <p className="text-sm text-slate-600 mb-3">Create your own customized hiring process</p>
                    <ul className="space-y-1 text-sm text-slate-600 mb-3">
                      <li>✓ Blank templates to customize</li>
                      <li>✓ Modular components library</li>
                      <li>✓ Drag-and-drop builder</li>
                      <li>✓ All automation features</li>
                      <li>✓ Priority support</li>
                    </ul>
                    <Button
                      size="sm"
                      fullWidth
                      className={selectedHiringTemplate === 'custom' ? 'bg-[#2BB673]' : ''}
                      variant={selectedHiringTemplate === 'custom' ? 'primary' : 'outline'}
                    >
                      {selectedHiringTemplate === 'custom' ? 'Selected' : 'Select This Template'}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-slate-600">All templates include lifetime access and updates</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowHiringTemplates(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/merchant/recruiting/hiring-funnel-checkout', {
                          state: { selectedTemplate: selectedHiringTemplate }
                        });
                      }}
                      disabled={!selectedHiringTemplate}
                    >
                      Continue - $750
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </BusinessHubLayout>
  );
}
