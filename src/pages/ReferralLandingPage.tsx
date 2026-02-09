import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Store, Building2, CheckCircle, Gift } from 'lucide-react';

interface Partner {
  id: string;
  partner_id_num: number;
  name: string;
  tier: string;
  referral_slug: string;
}

export default function ReferralLandingPage() {
  const { referralSlug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (referralSlug) {
      validateAndStoreReferral();
    } else {
      setError('Invalid referral link');
      setLoading(false);
    }
  }, [referralSlug]);

  async function validateAndStoreReferral() {
    try {
      // Call edge function to resolve referral
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/referral-resolve?slug=${encodeURIComponent(referralSlug!)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!data.ok) {
        setError(data.error || 'Invalid referral link');
        setLoading(false);
        return;
      }

      // Store referral in localStorage
      localStorage.setItem('ll_referral_slug', referralSlug!);
      localStorage.setItem('ll_partner_id', data.partner.id);
      localStorage.setItem('ll_partner_id_num', String(data.partner.partner_id_num));

      // Store in cookie (30 days)
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `ll_referral_slug=${encodeURIComponent(referralSlug!)}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`;
      document.cookie = `ll_partner_id=${data.partner.id}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`;

      // Apply referral attribution
      const sessionId = getOrCreateSessionId();
      await fetch(`${supabaseUrl}/functions/v1/referral-apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referral_slug: referralSlug,
          session_id: sessionId,
        }),
      });

      setPartner(data.partner);
      setLoading(false);
    } catch (err: any) {
      console.error('Error validating referral:', err);
      setError('Failed to validate referral link');
      setLoading(false);
    }
  }

  function getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('ll_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('ll_session_id', sessionId);
    }
    return sessionId;
  }

  function handleBrowseDeals() {
    navigate('/deals');
  }

  function handleMerchantTools() {
    navigate('/merchant/onboarding');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Referral Link Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This referral link is invalid or has expired.'}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">You've Been Invited!</h1>
          <p className="text-blue-100 text-lg">
            Welcome to Local-Link Marketplace
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-900 font-semibold mb-1">Referral Applied Automatically</p>
                <p className="text-blue-700 text-sm">
                  If you purchase, your referrer may earn a commission. This doesn't cost you anything extra.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Get Access To:
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Exclusive local deals and promotions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Done-for-you merchant tools and services</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Tracked savings and benefits</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">CRM and marketing automation</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={handleBrowseDeals}
              className="w-full flex items-center justify-center gap-2 py-4 text-lg"
            >
              <Store className="w-5 h-5" />
              Browse Deals & Promotions
            </Button>

            <Button
              variant="secondary"
              onClick={handleMerchantTools}
              className="w-full flex items-center justify-center gap-2 py-4 text-lg"
            >
              <Building2 className="w-5 h-5" />
              See Merchant Tools (CRM + Services)
            </Button>
          </div>

          {/* FAQ Accordion */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <details className="mb-3">
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                Does this cost me more?
              </summary>
              <p className="mt-2 text-sm text-gray-600 pl-4">
                No. Prices are the same whether you use a referral link or not. The referrer earns a commission from Local-Link, not from you.
              </p>
            </details>

            <details className="mb-3">
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                Why am I here?
              </summary>
              <p className="mt-2 text-sm text-gray-600 pl-4">
                Someone shared Local-Link with you because they think you'll benefit from our local deals and merchant tools.
              </p>
            </details>

            <details>
              <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                Do I have to buy?
              </summary>
              <p className="mt-2 text-sm text-gray-600 pl-4">
                No. Browse freely and only purchase if something interests you. There's no obligation.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
