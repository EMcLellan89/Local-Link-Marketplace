import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface PurchaseDetails {
  id: string;
  quantity: number;
  amount_paid_cents: number;
  purchased_at: string;
  deal: {
    title: string;
    redemption_instructions: string | null;
    merchant: {
      business_name: string;
      address_line1: string;
      city: string;
      state: string;
      phone: string;
    };
  };
}

export default function PurchaseConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState<PurchaseDetails | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (id) {
      fetchPurchase();
    }
  }, [id]);

  const fetchPurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: purchaseError } = await supabase
        .from('purchases')
        .select(`
          id,
          quantity,
          amount_paid_cents,
          purchased_at,
          deal:deals (
            title,
            redemption_instructions,
            merchant:merchants (
              business_name,
              address_line1,
              city,
              state,
              phone
            )
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (purchaseError) throw purchaseError;

      if (data) {
        setPurchase(data as PurchaseDetails);
        await generateQRCode(data.id);
      }
    } catch (err) {
      console.error('Error fetching purchase:', err);
      setError('Failed to load purchase details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (purchaseId: string) => {
    try {
      const qrData = JSON.stringify({
        type: 'PURCHASE',
        purchaseId,
        timestamp: Date.now(),
      });

      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#2BB673',
          light: '#FFFFFF',
        },
      });

      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `deal-qr-${purchase?.id}.png`;
    link.click();
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading purchase...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card variant="bordered">
          <CardBody>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Couldn't Load Purchase</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={fetchPurchase}>Try Again</Button>
            </div>
          </CardBody>
        </Card>
      </DashboardLayout>
    );
  }

  if (!purchase) {
    return (
      <DashboardLayout>
        <Card variant="bordered">
          <CardBody>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-slate-900 mb-2">Purchase not found</h3>
              <Button onClick={() => navigate('/dashboard')}>Browse Deals</Button>
            </div>
          </CardBody>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card variant="elevated" className="bg-gradient-to-br from-[#2BB673] to-[#25a062] text-white">
          <CardBody className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Purchase Successful!</h1>
            <p className="text-white/90">Thank you for supporting local businesses</p>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Your Deal</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">{purchase.deal?.title}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Quantity: {purchase.quantity} · Total: {formatPrice(purchase.amount_paid_cents)}
              </p>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="font-medium text-slate-900">{purchase.deal?.merchant?.business_name}</div>
              <div>
                {purchase.deal?.merchant?.address_line1}<br />
                {purchase.deal?.merchant?.city}, {purchase.deal?.merchant?.state}
              </div>
              {purchase.deal?.merchant?.phone && <div>{purchase.deal.merchant.phone}</div>}
            </div>
          </CardBody>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">Redemption QR Code</h2>
            <p className="text-sm text-slate-600 mt-1">
              Show this QR code at the business to redeem your deal
            </p>
          </CardHeader>
          <CardBody>
            <div className="bg-white p-6 rounded-lg border-4 border-[#2BB673] mx-auto w-fit">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              ) : (
                <div className="w-64 h-64 bg-slate-100 animate-pulse rounded" />
              )}
            </div>

            <div className="mt-6 space-y-3">
              <Button
                fullWidth
                variant="outline"
                onClick={downloadQRCode}
                disabled={!qrCodeUrl}
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>

              {purchase.deal?.redemption_instructions && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Redemption Instructions</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-line">
                    {purchase.deal.redemption_instructions}
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => navigate('/purchases')}>
            View All Purchases
          </Button>
          <Button fullWidth onClick={() => navigate('/dashboard')}>
            Browse More Deals
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
