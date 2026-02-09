import { Sparkles } from 'lucide-react';
import { InternalCRMLayout } from '../../components/layout/InternalCRMLayout';
import AIBotMarketplace from '../../components/marketplace/AIBotMarketplace';

export default function AIBotsMarketplacePage() {
  return (
    <InternalCRMLayout>
      <div className="space-y-6 mb-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Bot Marketplace</h1>
            <p className="text-gray-600 mt-1">Admin access to all AI automation tools</p>
          </div>
        </div>

        <AIBotMarketplace entityId="admin" entityType="admin" />
      </div>
    </InternalCRMLayout>
  );
}
