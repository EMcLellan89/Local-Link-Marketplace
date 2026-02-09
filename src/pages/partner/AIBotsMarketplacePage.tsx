import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AIBotMarketplace from '../../components/marketplace/AIBotMarketplace';

export default function AIBotsMarketplacePage() {
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartner();
  }, []);

  async function loadPartner() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setPartner(data);
    } catch (error) {
      console.error('Error loading partner:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/partner/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Bot Marketplace</h1>
              <p className="text-gray-600 mt-1">
                Partner System ID: <span className="font-mono font-semibold">{partner?.system_id || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>

        {partner && (
          <AIBotMarketplace entityId={partner.id} entityType="partner" />
        )}
      </div>
    </div>
  );
}
