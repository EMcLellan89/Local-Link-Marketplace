import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, Mail, Check, ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';

interface Product {
  id: string;
  product_type: 'voip' | 'email';
  name: string;
  description: string;
  base_price_cents: number;
  usage_price_cents: number;
  included_units: number;
  max_units: number;
  features: string[];
}

export default function CommunicationsCheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [merchantId, setMerchantId] = useState<string>('');

  const [selections, setSelections] = useState({
    voip: false,
    voipUsers: 1,
    email: false,
    emailTier: 'tier1' as 'tier1' | 'tier2',
  });

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;

    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (merchant) {
        setMerchantId(merchant.id);
      }

      const { data: productsData } = await supabase
        .from('communications_products')
        .select('*')
        .eq('active', true);

      if (productsData) {
        setProducts(productsData);
      }

      const type = searchParams.get('type');
      if (type === 'voip') {
        setSelections(prev => ({ ...prev, voip: true }));
      } else if (type === 'email') {
        setSelections(prev => ({ ...prev, email: true }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const voipProduct = products.find(p => p.product_type === 'voip');
  const emailTier1 = products.find(p => p.product_type === 'email' && p.included_units === 100000);
  const emailTier2 = products.find(p => p.product_type === 'email' && p.included_units === 2500000);

  const calculateTotal = () => {
    let total = 0;

    if (selections.voip && voipProduct) {
      total += voipProduct.base_price_cents * selections.voipUsers;
    }

    if (selections.email) {
      const emailProduct = selections.emailTier === 'tier1' ? emailTier1 : emailTier2;
      if (emailProduct) {
        total += emailProduct.base_price_cents;
      }
    }

    return total;
  };

  async function handleCheckout() {
    if (!merchantId) return;

    setProcessing(true);
    try {
      const total = calculateTotal();

      if (total === 0) {
        alert('Please select at least one service');
        setProcessing(false);
        return;
      }

      const voipMonthlyCost = selections.voip ? voipProduct!.base_price_cents * selections.voipUsers : 0;
      const emailMonthlyCost = selections.email
        ? (selections.emailTier === 'tier1' ? emailTier1!.base_price_cents : emailTier2!.base_price_cents)
        : 0;

      const { data: subscription, error } = await supabase
        .from('communications_subscriptions')
        .upsert({
          entity_type: 'merchant',
          entity_id: merchantId,
          voip_enabled: selections.voip,
          voip_user_count: selections.voip ? selections.voipUsers : 0,
          voip_monthly_cost_cents: voipMonthlyCost,
          email_enabled: selections.email,
          email_tier: selections.email ? selections.emailTier : null,
          email_monthly_cost_cents: emailMonthlyCost,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }, {
          onConflict: 'entity_type,entity_id'
        })
        .select()
        .single();

      if (error) throw error;

      navigate('/merchant/communications?success=true');
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to activate communications services. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/merchant/communications')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Communications Hub
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activate Communications Services</h1>
          <p className="text-gray-600 mt-2">
            Choose the communication tools you need to connect with your customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {voipProduct && (
            <div
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selections.voip
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelections(prev => ({ ...prev, voip: !prev.voip }))}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                {selections.voip && (
                  <div className="bg-blue-600 p-1 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{voipProduct.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{voipProduct.description}</p>

              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${(voipProduct.base_price_cents / 100).toFixed(2)}
                  <span className="text-sm font-normal text-gray-600"> /user/month</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  + ${(voipProduct.usage_price_cents / 100).toFixed(2)} per call
                </div>
              </div>

              {selections.voip && (
                <div className="pt-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Users
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={selections.voipUsers}
                    onChange={(e) => setSelections(prev => ({ ...prev, voipUsers: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Monthly: ${((voipProduct.base_price_cents * selections.voipUsers) / 100).toFixed(2)}
                  </div>
                </div>
              )}

              <ul className="space-y-2 mt-4">
                {voipProduct.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <div
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selections.email
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setSelections(prev => ({ ...prev, email: !prev.email }))}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-600 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                {selections.email && (
                  <div className="bg-green-600 p-1 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Marketing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Send professional email campaigns to your customers
              </p>

              {selections.email && emailTier1 && emailTier2 && (
                <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                  <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: selections.emailTier === 'tier1' ? '#10b981' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      checked={selections.emailTier === 'tier1'}
                      onChange={() => setSelections(prev => ({ ...prev, emailTier: 'tier1' }))}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{emailTier1.name}</div>
                      <div className="text-sm text-gray-600">Up to 100,000 emails/month</div>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        ${(emailTier1.base_price_cents / 100).toFixed(2)}/month
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: selections.emailTier === 'tier2' ? '#10b981' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      checked={selections.emailTier === 'tier2'}
                      onChange={() => setSelections(prev => ({ ...prev, emailTier: 'tier2' }))}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{emailTier2.name}</div>
                      <div className="text-sm text-gray-600">Up to 2,500,000 emails/month</div>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        ${(emailTier2.base_price_cents / 100).toFixed(2)}/month
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
          </div>

          <div className="space-y-2 mb-4">
            {selections.voip && voipProduct && (
              <div className="flex justify-between text-gray-700">
                <span>VoIP ({selections.voipUsers} user{selections.voipUsers > 1 ? 's' : ''})</span>
                <span className="font-semibold">
                  ${((voipProduct.base_price_cents * selections.voipUsers) / 100).toFixed(2)}/mo
                </span>
              </div>
            )}
            {selections.email && (
              <div className="flex justify-between text-gray-700">
                <span>Email Marketing ({selections.emailTier === 'tier1' ? 'Starter' : 'Professional'})</span>
                <span className="font-semibold">
                  ${((selections.emailTier === 'tier1' ? emailTier1?.base_price_cents : emailTier2?.base_price_cents) || 0) / 100}/mo
                </span>
              </div>
            )}
            {selections.voip && (
              <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                Plus usage: $0.05 per call (inbound/outbound)
              </div>
            )}
          </div>

          <div className="pt-4 border-t-2 border-gray-300 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Monthly</span>
            <span className="text-2xl font-bold text-gray-900">
              ${(calculateTotal() / 100).toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={processing || calculateTotal() === 0}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="w-5 h-5 animate-spin" />
              Activating Services...
            </span>
          ) : (
            'Activate Services'
          )}
        </button>
      </div>
    </BusinessHubLayout>
  );
}
