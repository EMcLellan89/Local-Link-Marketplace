import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface Purchase {
  id: string;
  quantity: number;
  amount_paid_cents: number;
  purchased_at: string;
  deal: {
    title: string;
    merchant: {
      business_name: string;
    };
  };
  redemptions: Array<{
    id: string;
    redeemed_at: string;
  }>;
}

export default function PurchasesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (customerError) throw customerError;

      if (!customerData) {
        setLoading(false);
        return;
      }

      const { data, error: purchasesError } = await supabase
        .from('purchases')
        .select(`
          id,
          quantity,
          amount_paid_cents,
          purchased_at,
          deal:deals (
            title,
            merchant:merchants (
              business_name
            )
          ),
          redemptions (
            id,
            redeemed_at
          )
        `)
        .eq('customer_id', customerData.id)
        .order('purchased_at', { ascending: false });

      if (purchasesError) throw purchasesError;

      if (data) {
        setPurchases(data as Purchase[]);
      }
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Failed to load your purchases. Please try again.');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isRedeemed = (purchase: Purchase) => {
    return purchase.redemptions && purchase.redemptions.length > 0;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading purchases...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Purchases</h1>
          <p className="text-slate-600 mt-2">View your purchased deals and redemption status</p>
        </div>

        {error ? (
          <Card variant="bordered">
            <CardBody>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Couldn't Load Purchases</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <Button onClick={fetchPurchases}>Try Again</Button>
              </div>
            </CardBody>
          </Card>
        ) : purchases.length === 0 ? (
          <Card variant="bordered">
            <CardBody>
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No purchases yet</h3>
                <p className="text-slate-600 mb-4">Start saving with local deals today</p>
                <Button onClick={() => navigate('/dashboard')}>
                  Browse Deals
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} variant="bordered">
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-slate-900">{purchase.deal?.title}</h3>
                        {isRedeemed(purchase) ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Redeemed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F5B82E]/20 text-[#F5B82E]">
                            <Clock className="w-3 h-3 mr-1" />
                            Ready to Redeem
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 mb-2">
                        {purchase.deal?.merchant?.business_name}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>Quantity: {purchase.quantity}</span>
                        <span>•</span>
                        <span>Total: {formatPrice(purchase.amount_paid_cents)}</span>
                        <span>•</span>
                        <span>Purchased: {formatDate(purchase.purchased_at)}</span>
                      </div>

                      {isRedeemed(purchase) && purchase.redemptions?.[0] && (
                        <p className="text-xs text-slate-500 mt-2">
                          Redeemed on {formatDate(purchase.redemptions[0].redeemed_at)}
                        </p>
                      )}
                    </div>

                    <div className="ml-4">
                      <Button
                        size="sm"
                        variant={isRedeemed(purchase) ? 'outline' : 'primary'}
                        onClick={() => navigate(`/purchase/${purchase.id}`)}
                      >
                        {isRedeemed(purchase) ? 'View Details' : 'View QR Code'}
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
