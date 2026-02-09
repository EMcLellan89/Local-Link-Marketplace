import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "lucide-react";
import BackButton from '../components/ui/BackButton';

function safeGet(sp: URLSearchParams, key: string): string | null {
  const value = sp.get(key);
  return value && value.trim().length ? value.trim() : null;
}

function buildUtm(sp: URLSearchParams): Record<string, string> {
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const utm: Record<string, string> = {};
  for (const key of keys) {
    const value = safeGet(sp, key);
    if (value) utm[key] = value;
  }
  return utm;
}

function pickNextRoute(productSku: string | null): string {
  if (!productSku) return "/register";

  const sku = productSku.toLowerCase();

  if (sku.includes("tradehive")) return "/business/pricing?product=tradehive";
  if (sku.includes("adsuite")) return "/business/pricing?product=adsuite";
  if (sku.includes("petconnect")) return "/business/pricing?product=petconnect";
  if (sku.includes("carecompanion")) return "/business/pricing?product=carecompanion";
  if (sku.includes("marketplace")) return "/pricing";
  if (sku.includes("course")) return "/academy";
  if (sku.includes("swipe")) return "/merchant/swipe-file";
  if (sku.includes("setup")) return "/business";

  return "/register";
}

export default function JoinPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const partner = useMemo(() => safeGet(searchParams, "partner") || safeGet(searchParams, "ref"), [searchParams]);
  const product = useMemo(() => safeGet(searchParams, "product"), [searchParams]);
  const utm = useMemo(() => buildUtm(searchParams), [searchParams]);

  useEffect(() => {
    (async () => {
      setError(null);

      if (!partner) {
        setError("Missing partner code. Please use a valid referral link.");
        setTimeout(() => navigate("/register"), 3000);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-marketplace-affiliate-click`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              affiliate_code: partner,
              product,
              utm,
            }),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to track referral");
        }

        const data = await res.json();
        const referralId = data?.referral_id as string | undefined;

        if (referralId) {
          localStorage.setItem("ll_referral_id", referralId);
        }
        localStorage.setItem("ll_partner_code", partner);
        if (product) {
          localStorage.setItem("ll_product_sku", product);
        }
        localStorage.setItem("ll_utm", JSON.stringify(utm));

        const nextRoute = pickNextRoute(product);
        navigate(nextRoute, { replace: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        setTimeout(() => navigate("/register"), 3000);
      }
    })();
  }, [partner, product, utm, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">Getting things ready...</h1>

          <p className="text-gray-600 mb-6">
            We're connecting you to your referral link and sending you to the right page.
          </p>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">
                {error}
              </p>
              <p className="text-xs text-red-600 mt-2">
                Redirecting you to signup...
              </p>
            </div>
          )}

          {!error && partner && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Partner Code:</span> {partner}
              </p>
              {product && (
                <p className="text-sm text-blue-800 mt-1">
                  <span className="font-medium">Product:</span> {product}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
