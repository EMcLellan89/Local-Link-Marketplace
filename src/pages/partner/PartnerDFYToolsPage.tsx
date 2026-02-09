import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Bot, ExternalLink, Sparkles } from "lucide-react";

type Product = {
  slug: string;
  name: string;
  short_value_prop: string;
  is_active: boolean;
};

export default function PartnerDFYToolsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("dfy_products")
        .select("slug, name, short_value_prop, is_active")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } else {
        setProducts(data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Done-For-You AI Tools
        </h1>
        <p className="text-gray-600 mt-2">
          Promote these fully-managed AI tools to your merchants. We handle setup, configuration,
          and ongoing support. You earn commissions on every sale.
        </p>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading tools…</div>
      ) : products.length === 0 ? (
        <div className="text-gray-600">No tools available yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.slug}
              to={`/partner/dfy/ad-vault/${product.slug}`}
              className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <Bot className="w-8 h-8 text-blue-600" />
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>

              <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
              <p className="text-gray-600 mt-2 text-sm">{product.short_value_prop}</p>

              <div className="mt-4 pt-4 border-t">
                <div className="text-sm font-medium text-blue-600">
                  View Ad Vault & Get Your Link →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 border rounded-2xl bg-gray-50 p-6">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="mt-4 space-y-3 text-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              1
            </div>
            <div>
              <strong>Pick a tool</strong> from the list above
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              2
            </div>
            <div>
              <strong>View the Ad Vault</strong> for pre-written ad copy, headlines, and CTAs
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              3
            </div>
            <div>
              <strong>Get your unique tracking link</strong> to share with merchants
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              4
            </div>
            <div>
              <strong>Earn commissions</strong> on setup fees and monthly subscriptions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
