import { useState, useEffect } from 'react';
import { QrCode, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';

interface Purchase {
  id: string;
  redemption_code: string;
  is_redeemed: boolean;
  redeemed_at: string | null;
  deal: {
    title: string;
  };
  customer: {
    first_name: string;
    last_name: string;
  };
}

export default function RedemptionPage() {
  const { user } = useAuth();
  const [redemptionCode, setRedemptionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | 'warning' | null;
    message: string;
    purchase?: Purchase;
  }>({ type: null, message: '' });
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMerchant();
    }
  }, [user]);

  const loadMerchant = async () => {
    if (!user) return;

    try {
      const { data: merchant, error } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (merchant) {
        setMerchantId(merchant.id);
      }
    } catch (error) {
      console.error('Error loading merchant:', error);
      setError('Failed to load merchant data. Please try again.');
    }
  };

  const handleRedeem = async () => {
    if (!redemptionCode.trim() || !merchantId) return;

    setLoading(true);
    setResult({ type: null, message: '' });

    try {
      const { data: purchase, error } = await supabase
        .from('purchases')
        .select(`
          id,
          redemption_code,
          is_redeemed,
          redeemed_at,
          deal:deals (
            title,
            merchant_id
          ),
          customer:customers (
            first_name,
            last_name
          )
        `)
        .eq('redemption_code', redemptionCode.toUpperCase())
        .maybeSingle();

      if (error || !purchase) {
        setResult({
          type: 'error',
          message: 'Invalid redemption code. Please check and try again.'
        });
        setLoading(false);
        return;
      }

      if (purchase.deal.merchant_id !== merchantId) {
        setResult({
          type: 'error',
          message: 'This voucher is not for your business.'
        });
        setLoading(false);
        return;
      }

      if (purchase.is_redeemed) {
        setResult({
          type: 'warning',
          message: `This voucher was already redeemed on ${new Date(purchase.redeemed_at!).toLocaleString()}`
        });
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('purchases')
        .update({
          is_redeemed: true,
          redeemed_at: new Date().toISOString()
        })
        .eq('id', purchase.id);

      if (updateError) {
        setResult({
          type: 'error',
          message: 'Failed to redeem voucher. Please try again.'
        });
        setLoading(false);
        return;
      }

      setResult({
        type: 'success',
        message: 'Voucher successfully redeemed!',
        purchase: purchase as Purchase
      });
      setRedemptionCode('');
    } catch (error) {
      setResult({
        type: 'error',
        message: 'An error occurred. Please try again.'
      });
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2BB673]/10 rounded-full mb-4">
            <QrCode className="w-8 h-8 text-[#2BB673]" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Redeem Voucher</h1>
          <p className="text-slate-600 mt-2">Scan or enter the customer's redemption code</p>
        </div>

        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <p className="text-red-800 font-medium">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
              <Button variant="outline" onClick={loadMerchant} className="mt-3">
                Try Again
              </Button>
            </CardBody>
          </Card>
        )}

        <Card variant="bordered">
          <CardBody className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
                Redemption Code
              </label>
              <Input
                id="code"
                type="text"
                value={redemptionCode}
                onChange={(e) => setRedemptionCode(e.target.value.toUpperCase())}
                placeholder="Enter code (e.g., ABC-123-XYZ)"
                className="text-center text-lg tracking-wider font-mono"
                onKeyPress={(e) => e.key === 'Enter' && handleRedeem()}
              />
            </div>

            <Button
              fullWidth
              onClick={handleRedeem}
              disabled={loading || !redemptionCode.trim()}
            >
              {loading ? 'Validating...' : 'Redeem Voucher'}
            </Button>
          </CardBody>
        </Card>

        {result.type && (
          <Card
            variant="bordered"
            className={
              result.type === 'success'
                ? 'border-green-300 bg-green-50'
                : result.type === 'warning'
                ? 'border-yellow-300 bg-yellow-50'
                : 'border-red-300 bg-red-50'
            }
          >
            <CardBody>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {result.type === 'success' && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {result.type === 'warning' && (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  )}
                  {result.type === 'error' && (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      result.type === 'success'
                        ? 'text-green-900'
                        : result.type === 'warning'
                        ? 'text-yellow-900'
                        : 'text-red-900'
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.purchase && (
                    <div className="mt-3 space-y-1 text-sm text-slate-700">
                      <p>
                        <span className="font-medium">Deal:</span> {result.purchase.deal.title}
                      </p>
                      <p>
                        <span className="font-medium">Customer:</span>{' '}
                        {result.purchase.customer.first_name} {result.purchase.customer.last_name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <Card variant="bordered">
          <CardBody>
            <h3 className="font-bold text-slate-900 mb-3">How to Redeem</h3>
            <ol className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="font-bold text-[#2BB673] mr-2">1.</span>
                <span>Ask the customer to show their digital voucher</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-[#2BB673] mr-2">2.</span>
                <span>Enter or scan the redemption code shown on their voucher</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-[#2BB673] mr-2">3.</span>
                <span>Click "Redeem Voucher" to validate and mark as used</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-[#2BB673] mr-2">4.</span>
                <span>Provide the service or product as described in the deal</span>
              </li>
            </ol>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
