import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Sparkles, Copy, Check, Search, Filter,
  Briefcase, Wrench, Sparkle, UtensilsCrossed, Building2
} from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface AdPack {
  id: string;
  industry_key: string;
  product_slug: string;
  pack_name: string;
  description: string;
  ad_variants: string[];
  hook_variants: string[];
  caption_templates: string[];
  dm_scripts: string[];
}

type ContentType = 'ads' | 'hooks' | 'captions' | 'dms';

const INDUSTRIES = [
  { key: 'all', label: 'All Industries', icon: Building2, color: 'gray' },
  { key: 'cleaning', label: 'Cleaning', icon: Sparkle, color: 'blue' },
  { key: 'trades', label: 'Trades', icon: Wrench, color: 'orange' },
  { key: 'medspa', label: 'Med Spa & Beauty', icon: Sparkles, color: 'pink' },
  { key: 'restaurant', label: 'Restaurants', icon: UtensilsCrossed, color: 'green' }
];

export default function IndustryAdVault() {
  const [loading, setLoading] = useState(true);
  const [adPacks, setAdPacks] = useState<AdPack[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedType, setSelectedType] = useState<ContentType>('ads');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  useEffect(() => {
    loadAdPacks();
  }, []);

  async function loadAdPacks() {
    try {
      const { data, error } = await supabase
        .from('industry_ad_packs')
        .select('*')
        .eq('is_active', true)
        .order('industry_key', { ascending: true });

      if (error) throw error;

      if (data) {
        setAdPacks(data);
      }
    } catch (error) {
      console.error('Error loading ad packs:', error);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, index: string) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  const filteredPacks = adPacks.filter(pack => {
    if (selectedIndustry !== 'all' && pack.industry_key !== selectedIndustry) {
      return false;
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        pack.pack_name.toLowerCase().includes(searchLower) ||
        pack.description?.toLowerCase().includes(searchLower) ||
        pack.industry_key.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  function getContent(pack: AdPack): string[] {
    switch (selectedType) {
      case 'ads': return pack.ad_variants;
      case 'hooks': return pack.hook_variants;
      case 'captions': return pack.caption_templates;
      case 'dms': return pack.dm_scripts;
      default: return [];
    }
  }

  function getIndustryColor(industryKey: string) {
    const industry = INDUSTRIES.find(i => i.key === industryKey);
    return industry?.color || 'gray';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading ad vault...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BackButton />

        {/* Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Industry Ad Vault</h1>
              <p className="text-gray-600">Proven ad copy, hooks, and scripts by industry</p>
            </div>
          </div>

          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {INDUSTRIES.map((industry) => {
              const Icon = industry.icon;
              const isSelected = selectedIndustry === industry.key;

              return (
                <button
                  key={industry.key}
                  onClick={() => setSelectedIndustry(industry.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isSelected
                      ? `bg-${industry.color}-100 text-${industry.color}-900 border-2 border-${industry.color}-500`
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {industry.label}
                </button>
              );
            })}
          </div>

          {/* Content Type Selector */}
          <div className="flex gap-2 mb-6">
            {[
              { value: 'ads' as ContentType, label: 'Ad Variants' },
              { value: 'hooks' as ContentType, label: 'Hooks' },
              { value: 'captions' as ContentType, label: 'Captions' },
              { value: 'dms' as ContentType, label: 'DM Scripts' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedType(option.value)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedType === option.value
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search ad packs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Ad Packs Grid */}
        {filteredPacks.length === 0 ? (
          <Card className="p-12 text-center">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No ad packs found</h3>
            <p className="text-gray-600">
              Try selecting a different industry or content type
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredPacks.map((pack) => {
              const content = getContent(pack);
              const color = getIndustryColor(pack.industry_key);

              return (
                <Card key={pack.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 bg-${color}-100 text-${color}-800 text-xs font-semibold rounded-full uppercase`}>
                          {pack.industry_key}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {pack.pack_name}
                      </h3>
                      {pack.description && (
                        <p className="text-sm text-gray-600">{pack.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Content Cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {content.map((item, index) => {
                      const itemKey = `${pack.id}-${selectedType}-${index}`;
                      const isCopied = copiedIndex === itemKey;

                      return (
                        <div
                          key={itemKey}
                          className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4 group hover:border-purple-300 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="text-xs font-semibold text-gray-500 uppercase">
                              {selectedType === 'ads' && 'Ad Variant'}
                              {selectedType === 'hooks' && 'Hook'}
                              {selectedType === 'captions' && 'Caption Template'}
                              {selectedType === 'dms' && 'DM Script'}
                              {' #'}{index + 1}
                            </div>
                            <button
                              onClick={() => copyToClipboard(item, itemKey)}
                              className={`p-2 rounded-lg transition-all ${
                                isCopied
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-white text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                              }`}
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          <div className="text-gray-900 whitespace-pre-line text-sm leading-relaxed">
                            {item}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Need help customizing these for your market?
              </h3>
              <p className="text-sm text-gray-600">
                Use the AI Prompt Library to generate custom variations tailored to your specific niche
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/partner/ai-prompts'}
              variant="outline"
            >
              AI Prompt Library
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
