import { useState, useEffect } from "react";
import { Save, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import BackButton from '../../components/ui/BackButton';

interface Product {
  id: string;
  sku: string;
  name: string;
  type: string;
  price_cents: number;
  currency: string;
  commission_rate_bp: number;
  stripe_price_id: string | null;
  active: boolean;
}

export default function AdminProductsRatesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editedProducts, setEditedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("marketplace_affiliate_products")
      .select("*")
      .order("type", { ascending: true })
      .order("name", { ascending: true });

    if (!error && data) {
      setProducts(data);
    }

    setLoading(false);
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setEditedProducts((prev) => new Set(prev).add(id));
  };

  const saveProduct = async (product: Product) => {
    setSaving(product.id);

    const { error } = await supabase
      .from("marketplace_affiliate_products")
      .update({
        name: product.name,
        type: product.type,
        stripe_price_id: product.stripe_price_id,
        commission_rate_bp: product.commission_rate_bp,
        active: product.active,
      } as any)
      .eq("id", product.id);

    if (!error) {
      setEditedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }

    setSaving(null);
    await loadProducts();
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  const productsByType = products.reduce((acc, product) => {
    if (!acc[product.type]) {
      acc[product.type] = [];
    }
    acc[product.type].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Partner Products & Pricing
          </h1>
          <p className="text-gray-600">
            Manage partner-eligible products, Stripe price IDs, and one-time commission rates
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Important</p>
              <p className="text-sm text-blue-800">
                Make sure each product has a valid Stripe Price ID (starts with{" "}
                <code className="bg-blue-100 px-1 rounded">price_</code>). This is required for
                the checkout system to work properly.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(productsByType).map(([type, typeProducts]) => (
            <div key={type} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 capitalize">
                  {type.replace("_", " ")} Products
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stripe Price ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission %
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Active
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {typeProducts.map((product) => {
                      const isEdited = editedProducts.has(product.id);
                      const isSaving = saving === product.id;

                      return (
                        <tr
                          key={product.id}
                          className={`${isEdited ? "bg-yellow-50" : ""} hover:bg-gray-50`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {product.sku}
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) =>
                                updateProduct(product.id, "name", e.target.value)
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(product.price_cents)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={product.stripe_price_id || ""}
                                onChange={(e) =>
                                  updateProduct(product.id, "stripe_price_id", e.target.value)
                                }
                                placeholder="price_..."
                                className={`flex-1 px-2 py-1 text-sm font-mono border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                  product.stripe_price_id
                                    ? "border-gray-300"
                                    : "border-red-300 bg-red-50"
                                }`}
                              />
                              {product.stripe_price_id &&
                                product.stripe_price_id.startsWith("price_") && (
                                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={product.commission_rate_bp / 100}
                                onChange={(e) =>
                                  updateProduct(
                                    product.id,
                                    "commission_rate_bp",
                                    Number(e.target.value) * 100
                                  )
                                }
                                min="0"
                                max="100"
                                step="0.5"
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-sm text-gray-600">%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={product.active}
                              onChange={(e) =>
                                updateProduct(product.id, "active", e.target.checked)
                              }
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => saveProduct(product)}
                                disabled={isSaving}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                  isEdited
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                <Save className="w-4 h-4" />
                                {isSaving ? "Saving..." : "Save"}
                              </button>
                              <a
                                href={`/join?product=${product.sku}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Test
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-800 text-white rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Commission Rate Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm font-medium mb-1">CRMs & SaaS</p>
              <p className="text-2xl font-bold">10%</p>
              <p className="text-xs text-gray-300 mt-1">One-time commission</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm font-medium mb-1">Courses</p>
              <p className="text-2xl font-bold">20%</p>
              <p className="text-xs text-gray-300 mt-1">High margin, quick win</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm font-medium mb-1">Setup Fees</p>
              <p className="text-2xl font-bold">15-20%</p>
              <p className="text-xs text-gray-300 mt-1">Based on margin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
