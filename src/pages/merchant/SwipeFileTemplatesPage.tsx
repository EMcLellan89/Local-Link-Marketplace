import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, Star, Copy, Check, ArrowLeft, Heart, Search, Filter } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Template {
  id: string;
  category: string;
  industry: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  performance_metrics: any;
  is_favorited?: boolean;
  image_url?: string;
}

export default function SwipeFileTemplatesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const { profile } = useAuth();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (profile) {
      checkAccessAndLoadTemplates();
    }
  }, [profile, category]);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedIndustry]);

  const checkAccessAndLoadTemplates = async () => {
    if (!profile) return;

    try {
      const { data: accessData } = await supabase
        .from('swipe_file_access')
        .select('*')
        .eq('merchant_id', profile.id)
        .maybeSingle();

      if (!accessData || !accessData.access_granted_at) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      setHasAccess(true);

      const { data: templatesData, error: templatesError } = await supabase
        .from('swipe_file_templates')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;

      const { data: favoritesData } = await supabase
        .from('swipe_file_favorites')
        .select('template_id')
        .eq('merchant_id', profile.id);

      const favSet = new Set(favoritesData?.map(f => f.template_id) || []);
      setFavorites(favSet);

      const templatesWithFavorites = templatesData?.map(t => ({
        ...t,
        is_favorited: favSet.has(t.id)
      })) || [];

      setTemplates(templatesWithFavorites);
      setFilteredTemplates(templatesWithFavorites);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        t.content.toLowerCase().includes(term) ||
        t.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(t => t.industry === selectedIndustry);
    }

    setFilteredTemplates(filtered);
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleFavorite = async (templateId: string) => {
    if (!profile) return;

    try {
      const isFavorited = favorites.has(templateId);

      if (isFavorited) {
        await supabase
          .from('swipe_file_favorites')
          .delete()
          .eq('merchant_id', profile.id)
          .eq('template_id', templateId);

        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(templateId);
          return newSet;
        });
      } else {
        await supabase
          .from('swipe_file_favorites')
          .insert({
            merchant_id: profile.id,
            template_id: templateId
          });

        setFavorites(prev => new Set(prev).add(templateId));
      }

      setTemplates(prev => prev.map(t => ({
        ...t,
        is_favorited: t.id === templateId ? !isFavorited : t.is_favorited
      })));
      filterTemplates();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const industries = Array.from(new Set(templates.map(t => t.industry)));

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2BB673] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading templates...</p>
          </div>
        </div>
      </BusinessHubLayout>
    );
  }

  if (!hasAccess) {
    return (
      <BusinessHubLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Required</h2>
          <p className="text-slate-600 mb-6">
            Unlock the full Swipe File Library to access {category}.
          </p>
          <Button onClick={() => navigate('/merchant/swipe-file/checkout')} className="bg-purple-600 hover:bg-purple-700">
            Unlock Now - $97
          </Button>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/merchant/swipe-file')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-slate-900">{category}</h1>
              <p className="text-slate-600 mt-1">
                {filteredTemplates.length} templates available
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5 text-slate-400" />}
            />
          </div>
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
              >
                <option value="all">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <Card variant="bordered">
            <CardBody className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No templates found matching your criteria.</p>
            </CardBody>
          </Card>
        ) : category === 'Landing Pages' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} variant="bordered" className="hover:shadow-lg transition-shadow overflow-hidden">
                {template.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={template.image_url}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{template.title}</h3>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded capitalize">
                          {template.industry}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">{template.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Included Features:</h4>
                    <div className="space-y-2">
                      {template.content.split('|').map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <Check className="w-4 h-4 text-[#2BB673] mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      fullWidth
                      onClick={() => setSelectedTemplate(template)}
                      className="bg-[#2BB673] hover:bg-[#25a062]"
                    >
                      Customize This Template
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} variant="bordered" className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{template.title}</h3>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          {template.industry}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">{template.description}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(template.id)}
                      className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          template.is_favorited
                            ? 'fill-red-500 text-red-500'
                            : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                      {template.content}
                    </pre>
                  </div>

                  {template.performance_metrics && Object.keys(template.performance_metrics).length > 0 && (
                    <div className="flex items-center gap-4 text-sm">
                      <Star className="w-4 h-4 text-[#F5B82E]" />
                      <span className="text-slate-600">
                        Performance Metrics:{' '}
                        {Object.entries(template.performance_metrics).map(([key, value]) => (
                          <span key={key} className="ml-2">
                            {key.replace(/_/g, ' ')}: <strong>{String(value)}</strong>
                          </span>
                        ))}
                      </span>
                    </div>
                  )}

                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[#2BB673]/10 text-[#2BB673] text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      fullWidth
                      onClick={() => handleCopy(template.content, template.id)}
                      className="bg-[#2BB673] hover:bg-[#25a062]"
                    >
                      {copiedId === template.id ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-2" />
                          Copy Template
                        </>
                      )}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Customize Your Website</h2>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {selectedTemplate.image_url && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src={selectedTemplate.image_url}
                    alt={selectedTemplate.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedTemplate.title}</h3>
              <p className="text-slate-600 mb-6">{selectedTemplate.description}</p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Included Features:</h4>
                <div className="space-y-2">
                  {selectedTemplate.content.split('|').map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-[#2BB673] mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-slate-900">$99</span>
                  <span className="text-slate-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Our team will customize this template with your branding, content, and photos. Setup typically takes 5-7 business days.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setSelectedTemplate(null)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    navigate('/merchant/swipe-file/landing-page-checkout', {
                      state: { template: selectedTemplate }
                    });
                  }}
                  className="bg-[#2BB673] hover:bg-[#25a062] flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BusinessHubLayout>
  );
}
