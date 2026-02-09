import { useEffect, useState } from 'react';
import { Copy, Check, Mail, MessageSquare, Video, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Card from './ui/Card';

interface SwipeAsset {
  id: string;
  asset_type: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
}

export function SwipeAssetsPanel() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<SwipeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [user]);

  async function fetchAssets() {
    try {
      const { data, error } = await supabase
        .from('partner_assets')
        .select('*')
        .eq('partner_id', user?.id as string)
        .order('asset_type', { ascending: true });

      if (error) throw error;
      setAssets((data as any) || []);
    } catch (error) {
      console.error('Error fetching swipe assets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(content: string, assetId: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(assetId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }

  function getAssetIcon(type: string) {
    switch (type) {
      case 'email_swipe':
        return <Mail className="w-5 h-5" />;
      case 'sms_swipe':
      case 'dm_swipe':
        return <MessageSquare className="w-5 h-5" />;
      case 'ugc_script':
        return <Video className="w-5 h-5" />;
      case 'subject_line':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  }

  function getAssetTypeLabel(type: string) {
    switch (type) {
      case 'email_swipe':
        return 'Email Swipe';
      case 'sms_swipe':
        return 'SMS Swipe';
      case 'dm_swipe':
        return 'DM Script';
      case 'ugc_script':
        return 'UGC Video Script';
      case 'subject_line':
        return 'Subject Line';
      default:
        return type;
    }
  }

  const assetTypes = [
    { value: 'all', label: 'All Assets' },
    { value: 'email_swipe', label: 'Email Swipes' },
    { value: 'sms_swipe', label: 'SMS Swipes' },
    { value: 'dm_swipe', label: 'DM Scripts' },
    { value: 'ugc_script', label: 'UGC Scripts' },
    { value: 'subject_line', label: 'Subject Lines' },
  ];

  const filteredAssets = selectedType === 'all'
    ? assets
    : assets.filter(a => a.asset_type === selectedType);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading swipe assets...</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Swipe Assets Yet
          </h3>
          <p className="text-gray-600">
            Swipe assets will appear here once your Partner CRM is activated.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Swipe Copy & Assets
        </h2>
        <p className="text-gray-600">
          Copy-paste ready promotional materials for Selling Recurring Revenue™
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Commission: 30% per sale
            </h3>
            <p className="text-sm text-gray-700">
              Earn <strong>$104.70</strong> per bundle sale ($349 bundle price)
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                No ads required
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                Includes execution templates
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                Ethical selling approach
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {assetTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedType === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredAssets.map((asset) => (
          <Card key={asset.id}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg text-blue-600">
                {getAssetIcon(asset.asset_type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {getAssetTypeLabel(asset.asset_type)}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {asset.title}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {asset.content}
                  </pre>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => copyToClipboard(asset.content, asset.id)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  {asset.metadata?.commission && (
                    <span className="text-sm text-gray-600">
                      Commission: {asset.metadata.commission}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}