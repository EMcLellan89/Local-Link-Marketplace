import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowLeft, Copy, ExternalLink, Sparkles } from "lucide-react";

type Product = {
  slug: string;
  name: string;
  short_value_prop: string;
  outcomes: string[];
};

type Ad = {
  id: string;
  channel: string;
  headline: string;
  primary_text: string;
  cta: string;
  notes?: string | null;
};

export default function PartnerDFYAdVaultPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [trackingLink, setTrackingLink] = useState("");
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function load() {
    if (!productSlug) return;
    setLoading(true);
    try {
      const { data: productData, error: productError } = await supabase
        .from("dfy_products")
        .select("slug, name, short_value_prop, outcomes")
        .eq("slug", productSlug)
        .eq("is_active", true)
        .maybeSingle();

      if (productError || !productData) {
        console.error("Failed to load product:", productError);
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(productData);

      const { data: adsData } = await supabase
        .from("dfy_ad_vault")
        .select("id, channel, headline, primary_text, cta, notes")
        .eq("product_slug", productSlug)
        .order("created_at", { ascending: true });

      if (adsData && adsData.length > 0) {
        setAds(adsData);
      } else {
        setAds([
          {
            id: "default-1",
            channel: "facebook",
            headline: "Stop losing leads",
            primary_text: `${productData.short_value_prop}\n\nGet it installed and running in 24–72 hours.\n\nTap "Learn More" to see pricing and start setup.`,
            cta: "Learn More",
            notes: "Works well for broad targeting. Do not show pricing inside partner portal; send traffic to merchant page.",
          },
          {
            id: "default-2",
            channel: "facebook",
            headline: "Automate bookings",
            primary_text: `Local businesses are losing jobs because they don't respond fast enough.\n\nThis installs fast and turns leads into booked appointments.\n\nTap "Learn More" to start.`,
            cta: "Learn More",
            notes: "Use with before/after, calendar, phone, or review visuals.",
          },
        ]);
      }

      await generateTrackingLink();
    } finally {
      setLoading(false);
    }
  }

  async function generateTrackingLink() {
    if (!user?.id || !productSlug) return;
    setGeneratingLink(true);
    try {
      const { data: existing } = await supabase
        .from("partner_tracking_links")
        .select("slug")
        .eq("partner_id", user.id)
        .eq("product_slug", productSlug)
        .maybeSingle();

      let refSlug = existing?.slug;

      if (!refSlug) {
        refSlug = Math.random().toString(36).substring(2, 14);
        const { error: insertError } = await supabase
          .from("partner_tracking_links")
          .insert({
            partner_id: user.id,
            product_slug: productSlug,
            slug: refSlug,
          });

        if (insertError) {
          console.error("Failed to create tracking link:", insertError);
          return;
        }
      }

      const appUrl = window.location.origin;
      const url = `${appUrl}/merchant/dfy/${productSlug}?ref=${refSlug}`;
      setTrackingLink(url);
    } finally {
      setGeneratingLink(false);
    }
  }

  useEffect(() => {
    load();
  }, [productSlug]);

  async function copyToClipboard(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-gray-600">Loading…</div>
    );
  }

  if (!product) {
    return <div className="max-w-5xl mx-auto px-4 py-10">Product not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        to="/partner/dfy/tools"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tools
      </Link>

      <div className="border rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-600 mt-1">{product.short_value_prop}</p>
          </div>
        </div>

        {product.outcomes && product.outcomes.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Key Outcomes:</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {product.outcomes.map((outcome, idx) => (
                <li key={idx}>{outcome}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Your Tracking Link
          </h2>
          {generatingLink ? (
            <div className="text-gray-600">Generating link…</div>
          ) : trackingLink ? (
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={trackingLink}
                className="flex-1 border rounded-xl px-3 py-2 bg-white text-sm"
              />
              <button
                onClick={() => copyToClipboard(trackingLink, "tracking-link")}
                className="px-4 py-2 bg-black text-white rounded-xl font-medium flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copiedId === "tracking-link" ? "Copied!" : "Copy"}
              </button>
            </div>
          ) : (
            <div className="text-gray-600">Unable to generate tracking link.</div>
          )}
          <p className="text-xs text-gray-600 mt-2">
            Share this link with merchants. All sales will be attributed to you.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Ad Vault</h2>
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="border rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {ad.channel}
                  </div>
                  <h3 className="text-lg font-semibold mt-1">{ad.headline}</h3>
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap">{ad.primary_text}</p>
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-500">CTA:</span>{" "}
                    <span className="text-sm font-semibold">{ad.cta}</span>
                  </div>
                  {ad.notes && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-xl text-sm text-gray-700">
                      <strong>Note:</strong> {ad.notes}
                    </div>
                  )}
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `Headline: ${ad.headline}\n\nPrimary Text:\n${ad.primary_text}\n\nCTA: ${ad.cta}`,
                      ad.id
                    )
                  }
                  className="ml-4 px-3 py-2 border rounded-xl hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copiedId === ad.id ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border rounded-2xl bg-gray-50 p-6">
        <h2 className="text-lg font-semibold">Partner Tips</h2>
        <ul className="mt-3 space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Don't mention pricing</strong> in your ads. The merchant will see pricing
              when they click your link.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Focus on outcomes:</strong> Faster responses, more bookings, less manual
              work.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Use visuals:</strong> Before/after screenshots, calendar UIs, phone
              notifications work best.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Test multiple ad variants</strong> to see what resonates with your audience.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
