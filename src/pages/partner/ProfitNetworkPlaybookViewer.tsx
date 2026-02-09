import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import PartnerHubLayout from '../../components/layout/PartnerHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import {
  BookOpen,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Megaphone,
  CheckCircle,
  ExternalLink,
  Download
} from 'lucide-react';

interface Playbook {
  id: string;
  title: string;
  description: string;
  target_audience: string;
  selling_strategy: string;
  fb_advertising_info: string;
  commission_info: string;
  year_one_projection: {
    conservative: any;
    moderate: any;
    aggressive: any;
  };
  key_benefits: string[];
  common_objections: any[];
  sales_scripts: any[];
  content: string;
  business: {
    id: string;
    name: string;
    website_url: string;
    logo_url: string;
    category: string;
    base_commission_rate: number;
  };
}

export default function ProfitNetworkPlaybookViewer() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('overview');

  useEffect(() => {
    if (businessId) {
      loadPlaybook();
    }
  }, [businessId]);

  async function loadPlaybook() {
    try {
      const { data, error } = await supabase
        .from('profit_network_playbooks')
        .select(`
          *,
          business:profit_network_businesses(*)
        `)
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPlaybook(data as any);
      }
    } catch (error) {
      console.error('Error loading playbook:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (loading) {
    return (
      <PartnerHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PartnerHubLayout>
    );
  }

  if (!playbook) {
    return (
      <PartnerHubLayout>
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Playbook Not Found</h3>
              <p className="text-gray-500 mb-4">This business doesn't have a playbook yet.</p>
              <Button onClick={() => navigate('/partner/profit-network')}>
                Back to Profit Network
              </Button>
            </div>
          </CardBody>
        </Card>
      </PartnerHubLayout>
    );
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'target', label: 'Target Market', icon: Target },
    { id: 'selling', label: 'How to Sell', icon: Megaphone },
    { id: 'advertising', label: 'FB Advertising', icon: TrendingUp },
    { id: 'commission', label: 'Commission', icon: DollarSign },
    { id: 'projections', label: 'Projections', icon: TrendingUp },
  ];

  return (
    <PartnerHubLayout>
      <div className="space-y-6">
        <BackButton to="/partner/profit-network" />

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
          <div className="flex items-center gap-4 mb-3">
            {playbook.business.logo_url && (
              <img
                src={playbook.business.logo_url}
                alt={playbook.business.name}
                className="w-16 h-16 object-contain bg-white rounded-lg p-2"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{playbook.business.name}</h1>
              <p className="text-blue-100">{playbook.title}</p>
            </div>
            <a
              href={playbook.business.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Site
            </a>
          </div>
          <span className="inline-block px-3 py-1 bg-blue-800 rounded-full text-sm">
            {playbook.business.category}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content Sections */}
        {activeSection === 'overview' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                What This Business Is
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {playbook.description}
              </p>

              {playbook.key_benefits && playbook.key_benefits.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3">Key Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {playbook.key_benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {activeSection === 'target' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Who Benefits From This Product
              </h2>
            </CardHeader>
            <CardBody>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {playbook.target_audience}
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {activeSection === 'selling' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-blue-600" />
                How to Sell This (Manual Sales Strategy)
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {playbook.selling_strategy}
                  </p>
                </div>

                {playbook.sales_scripts && playbook.sales_scripts.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold text-lg mb-4">Sample Sales Scripts</h3>
                    <div className="space-y-4">
                      {playbook.sales_scripts.map((script: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50 rounded-r-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">{script.scenario}</h4>
                          <p className="text-gray-700 italic">"{script.script}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {playbook.common_objections && playbook.common_objections.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-bold text-lg mb-4">Common Objections & Responses</h3>
                    <div className="space-y-4">
                      {playbook.common_objections.map((objection: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <p className="font-semibold text-red-700 mb-2">
                            Objection: "{objection.objection}"
                          </p>
                          <p className="text-gray-700 pl-4 border-l-2 border-green-600">
                            Response: {objection.response}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {activeSection === 'advertising' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                How the Facebook Advertising Works
              </h2>
            </CardHeader>
            <CardBody>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
                <p className="text-lg font-semibold text-blue-900 mb-2">
                  We Handle the Advertising for You
                </p>
                <p className="text-blue-800">
                  Your unique tracking link is embedded in all ads, landing pages, and email sequences.
                  We cover your first 8 weeks of ads at $20/day ($1,120 total).
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {playbook.fb_advertising_info}
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {activeSection === 'commission' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Commission Structure
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      {Number(playbook.business.base_commission_rate)}%
                    </div>
                    <div className="text-gray-600">Commission on All Sales</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-600">Payment</div>
                      <div className="font-semibold">Weekly</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Tracking</div>
                      <div className="font-semibold">Automatic</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-semibold">Lifetime</div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {playbook.commission_info}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {activeSection === 'projections' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Year One Commission Projections
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Conservative */}
                <div className="border-2 border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg text-gray-700 mb-1">Conservative</h3>
                    <p className="text-sm text-gray-500">Minimal effort, safe estimate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-700 mb-1">
                      {formatCurrency(
                        playbook.year_one_projection.conservative.year_one_commission ||
                        playbook.year_one_projection.conservative.annual_commission ||
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-500">Year One Total</div>
                  </div>
                  {playbook.year_one_projection.conservative.notes && (
                    <p className="text-xs text-gray-600 mt-4 text-center">
                      {playbook.year_one_projection.conservative.notes}
                    </p>
                  )}
                </div>

                {/* Moderate */}
                <div className="border-2 border-blue-500 rounded-xl p-6 bg-blue-50 transform scale-105">
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg text-blue-700 mb-1">Moderate</h3>
                    <p className="text-sm text-blue-600">Average performance</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700 mb-1">
                      {formatCurrency(
                        playbook.year_one_projection.moderate.year_one_commission ||
                        playbook.year_one_projection.moderate.annual_commission ||
                        0
                      )}
                    </div>
                    <div className="text-sm text-blue-600">Year One Total</div>
                  </div>
                  {playbook.year_one_projection.moderate.notes && (
                    <p className="text-xs text-blue-700 mt-4 text-center">
                      {playbook.year_one_projection.moderate.notes}
                    </p>
                  )}
                </div>

                {/* Aggressive */}
                <div className="border-2 border-green-500 rounded-xl p-6 hover:border-green-600 transition-colors">
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg text-green-700 mb-1">Aggressive</h3>
                    <p className="text-sm text-green-600">High effort, best results</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700 mb-1">
                      {formatCurrency(
                        playbook.year_one_projection.aggressive.year_one_commission ||
                        playbook.year_one_projection.aggressive.annual_commission ||
                        0
                      )}
                    </div>
                    <div className="text-sm text-green-600">Year One Total</div>
                  </div>
                  {playbook.year_one_projection.aggressive.notes && (
                    <p className="text-xs text-green-700 mt-4 text-center">
                      {playbook.year_one_projection.aggressive.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Remember:</strong> These projections assume you're actively promoting this business.
                  The AI bots handle most of the selling, but you need to drive traffic to your links through
                  social media, networking, and your local presence.
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Full Playbook Content */}
        {playbook.content && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Complete Playbook
                </h2>
                <Button variant="secondary" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="prose prose-lg max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                  {playbook.content}
                </pre>
              </div>
            </CardBody>
          </Card>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Start Earning?</h3>
          <p className="text-green-100 mb-6">
            Enroll in this business to get your unique tracking link and start earning 25% commissions.
          </p>
          <Button
            variant="secondary"
            className="bg-white text-green-600 hover:bg-green-50"
            onClick={() => navigate('/partner/profit-network')}
          >
            Apply for This Business
          </Button>
        </div>
      </div>
    </PartnerHubLayout>
  );
}
