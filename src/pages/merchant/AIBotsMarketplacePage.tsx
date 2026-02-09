import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AIBotMarketplace from '../../components/marketplace/AIBotMarketplace';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';

export default function AIBotsMarketplacePage() {
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMerchant();
  }, []);

  async function loadMerchant() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setMerchant(data);
    } catch (error) {
      console.error('Error loading merchant:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#2BB673] to-[#259a5f] p-3 rounded-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Bot Marketplace</h1>
            <p className="text-gray-600 mt-1">
              Business ID: <span className="font-mono font-semibold">{merchant?.system_id || 'N/A'}</span>
            </p>
          </div>
        </div>

        {merchant && (
          <AIBotMarketplace entityId={merchant.id} entityType="merchant" />
        )}
      </div>
    </BusinessHubLayout>
  );
}
