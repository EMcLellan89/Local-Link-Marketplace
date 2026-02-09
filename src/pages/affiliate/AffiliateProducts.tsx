import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import BackButton from '../../components/ui/BackButton';

interface Product {
  sku: string;
  name: string;
  type: string;
  price_cents: number;
  currency: string;
  commission_rate_bp: number;
  commission_amount_cents: number;
  link: string;
}

export default function AffiliateProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadProducts();
  }, [user]);

  async function loadProducts() {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-marketplace-affiliate-links`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.ok) {
        setProducts(data.links);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }

  function copyLink(link: string, sku: string) {
    navigator.clipboard.writeText(link);
    setCopiedLink(sku);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatRate = (bp: number) => `${(bp / 100).toFixed(0)}%`;

  const filteredProducts = filter === "all" ? products : products.filter((p) => p.type === filter);

  const types = [
    { value: "all", label: "All Products" },
    { value: "crm", label: "CRMs" },
    { value: "subscription", label: "Subscriptions" },
    { value: "course", label: "Courses" },
    { value: "service", label: "Services" },
    { value: "setup_fee", label: "Setup Fees" },
    { value: "bundle", label: "Bundles" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/affiliate/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products to Sell</h1>
          <p className="text-gray-600 mt-2">
            Share these links to earn one-time commissions on every sale
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Commission Structure</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• CRMs & Subscriptions: 10% one-time commission</li>
            <li>• Courses: 20% one-time commission</li>
            <li>• Services & Setup Fees: 15% one-time commission</li>
            <li>• All commissions paid Net-30 after first payment</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === type.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.sku} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                      {product.type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Price:</span> {formatCurrency(product.price_cents)}
                    </div>
                    <div>
                      <span className="font-medium">Commission Rate:</span> {formatRate(product.commission_rate_bp)}
                    </div>
                    <div>
                      <span className="font-medium text-green-600">You Earn:</span>{" "}
                      <span className="font-bold text-green-600">{formatCurrency(product.commission_amount_cents)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-600 mb-2">Your Referral Link:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={product.link}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono"
                  />
                  <button
                    onClick={() => copyLink(product.link, product.sku)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    {copiedLink === product.sku ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    title="Preview link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const pitch = `Hey! I wanted to share this with you: ${product.name}. ${
                      product.type === "crm"
                        ? "It's an all-in-one system that helps you manage customers, quotes, jobs, invoices, and payments in one place."
                        : product.type === "course"
                        ? "This course has helped hundreds of business owners grow their revenue."
                        : "This service can help transform your business."
                    } Check it out: ${product.link}`;
                    navigator.clipboard.writeText(pitch);
                    alert("Sales pitch copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                >
                  Copy Pitch
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No products found in this category
          </div>
        )}
      </div>
    </div>
  );
}
