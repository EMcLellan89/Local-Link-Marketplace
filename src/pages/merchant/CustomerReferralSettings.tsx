import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Save, CheckCircle2, AlertCircle, DollarSign, Gift, CreditCard, Tag } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

interface IndustryPreset {
  id: string;
  industry_key: string;
  industry_name: string;
  program_name: string;
  tagline: string;
  reward_type: string;
  reward_value_cents: number;
  referee_incentive_type: string;
  referee_incentive_value_cents: number;
  qualifying_event: string;
  min_spend_cents: number;
}

interface ReferralProgram {
  id?: string;
  merchant_id: string;
  is_enabled: boolean;
  industry_key: string;
  landing_slug: string;
  program_name: string;
  reward_type: string;
  reward_value_cents: number;
  referee_incentive_type: string;
  referee_incentive_value_cents: number;
  qualifying_event: string;
  min_spend_cents: number;
  fraud_max_rewards_per_customer: number;
  fraud_block_self_referrals: boolean;
}

export default function CustomerReferralSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [merchantId, setMerchantId] = useState<string>('');
  const [presets, setPresets] = useState<IndustryPreset[]>([]);
  const [program, setProgram] = useState<Partial<ReferralProgram>>({
    is_enabled: true,
    industry_key: 'general',
    program_name: 'Refer & Earn',
    reward_type: 'credit',
    reward_value_cents: 2500,
    referee_incentive_type: 'coupon',
    referee_incentive_value_cents: 1500,
    qualifying_event: 'first_paid_invoice',
    min_spend_cents: 0,
    fraud_max_rewards_per_customer: 3,
    fraud_block_self_referrals: true,
    landing_slug: ''
  });
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Check if user is a merchant
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'merchant') {
        navigate('/merchant/dashboard');
        return;
      }

      setMerchantId(profile.id);

      // Load industry presets
      const { data: presetsData } = await supabase
        .from('customer_referral_industry_presets')
        .select('*')
        .order('industry_key', { ascending: true });

      if (presetsData) {
        setPresets(presetsData);
      }

      // Load existing program if any
      const { data: existingProgram } = await supabase
        .from('customer_referral_programs')
        .select('*')
        .eq('merchant_id', profile.id)
        .maybeSingle();

      if (existingProgram) {
        setProgram(existingProgram);
      } else {
        // Generate default landing slug
        setProgram(prev => ({
          ...prev,
          merchant_id: profile.id,
          landing_slug: `m_${profile.id.slice(0, 8)}_referrals`
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(preset: IndustryPreset) {
    setProgram(prev => ({
      ...prev,
      industry_key: preset.industry_key,
      program_name: preset.program_name,
      reward_type: preset.reward_type,
      reward_value_cents: preset.reward_value_cents,
      referee_incentive_type: preset.referee_incentive_type,
      referee_incentive_value_cents: preset.referee_incentive_value_cents,
      qualifying_event: preset.qualifying_event,
      min_spend_cents: preset.min_spend_cents
    }));
  }

  async function saveProgram() {
    if (!merchantId) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const payload = {
        ...program,
        merchant_id: merchantId,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('customer_referral_programs')
        .upsert(payload, { onConflict: 'merchant_id' });

      if (error) throw error;

      setSaveMessage({ type: 'success', text: 'Referral program saved successfully!' });
      await loadData();
    } catch (error: any) {
      console.error('Error saving program:', error);
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save program' });
    } finally {
      setSaving(false);
    }
  }

  function formatCurrency(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  const rewardTypeIcons: Record<string, any> = {
    credit: CreditCard,
    coupon: Tag,
    cash: DollarSign,
    gift_card: Gift
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BackButton />

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Referral Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure your referral program to turn happy customers into your best sales channel
          </p>
        </div>

        {saveMessage && (
          <Card className={`p-4 mb-6 ${saveMessage.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3">
              {saveMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={saveMessage.type === 'success' ? 'text-green-900' : 'text-red-900'}>
                {saveMessage.text}
              </span>
            </div>
          </Card>
        )}

        {/* Industry Presets */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Start: Choose an Industry Preset</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  program.industry_key === preset.industry_key
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">{preset.industry_name}</h3>
                <p className="text-sm text-gray-600 mb-2">{preset.tagline}</p>
                <div className="text-xs text-gray-500">
                  <div>Referrer: {formatCurrency(preset.reward_value_cents)} {preset.reward_type}</div>
                  <div>Friend: {formatCurrency(preset.referee_incentive_value_cents)} {preset.referee_incentive_type}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Program Configuration */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Program Configuration</h2>

          <div className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Referral Program Status</h3>
                <p className="text-sm text-gray-600">Turn your referral program on or off</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={program.is_enabled}
                  onChange={(e) => setProgram({ ...program, is_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Program Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Name
              </label>
              <input
                type="text"
                value={program.program_name}
                onChange={(e) => setProgram({ ...program, program_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Refer & Earn"
              />
            </div>

            {/* Referrer Reward */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referrer Reward Type
                </label>
                <select
                  value={program.reward_type}
                  onChange={(e) => setProgram({ ...program, reward_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="credit">Account Credit</option>
                  <option value="coupon">Discount Coupon</option>
                  <option value="cash">Cash Payment</option>
                  <option value="gift_card">Gift Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referrer Reward Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    value={(program.reward_value_cents || 0) / 100}
                    onChange={(e) => setProgram({ ...program, reward_value_cents: Math.round(parseFloat(e.target.value) * 100) })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Referee Incentive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Friend (Referee) Incentive Type
                </label>
                <select
                  value={program.referee_incentive_type}
                  onChange={(e) => setProgram({ ...program, referee_incentive_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="credit">Account Credit</option>
                  <option value="coupon">Discount Coupon</option>
                  <option value="cash">Cash Payment</option>
                  <option value="gift_card">Gift Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Friend Incentive Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    value={(program.referee_incentive_value_cents || 0) / 100}
                    onChange={(e) => setProgram({ ...program, referee_incentive_value_cents: Math.round(parseFloat(e.target.value) * 100) })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Qualifying Event */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifying Event
              </label>
              <select
                value={program.qualifying_event}
                onChange={(e) => setProgram({ ...program, qualifying_event: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="first_paid_invoice">First Paid Invoice</option>
                <option value="first_purchase">First Purchase</option>
                <option value="first_booking">First Booking</option>
                <option value="minimum_spend">Minimum Spend Reached</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                When does the referrer earn their reward?
              </p>
            </div>

            {/* Minimum Spend */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Spend Required
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-500">$</span>
                <input
                  type="number"
                  value={(program.min_spend_cents || 0) / 100}
                  onChange={(e) => setProgram({ ...program, min_spend_cents: Math.round(parseFloat(e.target.value) * 100) })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Set to $0 for no minimum spend requirement
              </p>
            </div>

            {/* Fraud Protection */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Fraud Protection</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Block Self-Referrals</h4>
                    <p className="text-sm text-gray-600">Prevent customers from referring themselves</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={program.fraud_block_self_referrals}
                      onChange={(e) => setProgram({ ...program, fraud_block_self_referrals: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Rewards Per Customer
                  </label>
                  <input
                    type="number"
                    value={program.fraud_max_rewards_per_customer}
                    onChange={(e) => setProgram({ ...program, fraud_max_rewards_per_customer: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Limit how many rewards a single customer can earn
                  </p>
                </div>
              </div>
            </div>

            {/* Landing Slug (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referral Landing Page URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/r/${program.landing_slug}`}
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/r/${program.landing_slug}`)}
                >
                  Copy
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Customers will use this URL with their personal share code
              </p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/merchant/dashboard')}
          >
            Cancel
          </Button>
          <Button
            onClick={saveProgram}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Program'}
          </Button>
        </div>
      </div>
    </div>
  );
}
