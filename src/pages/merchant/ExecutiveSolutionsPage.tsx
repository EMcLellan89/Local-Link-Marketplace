import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseBrowser } from '../../lib/supabase-browser';
import { apiPost } from '../../lib/api';
import { requireOrgId } from '../../lib/org';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface ExecProduct {
  id: string;
  product_key: string;
  name: string;
  description: string;
  unit_label: string;
  active: boolean;
}

export default function ExecutiveSolutionsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ExecProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabaseBrowser
        .from('exec_products')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(productKey: string) {
    try {
      setPurchasing(productKey);
      const orgId = requireOrgId();

      // Check gate
      const gateResult = await apiPost('exec-gate-check', {
        org_id: orgId,
        product_key: productKey,
      });

      if (!gateResult.allowed) {
        alert('Migration required. Please complete Local-Link CRM migration first.');
        return;
      }

      // Create checkout
      const checkoutResult = await apiPost('checkout-create', {
        org_id: orgId,
        product_key: productKey,
      });

      // Redirect to case tracker
      if (checkoutResult.checkout_url) {
        navigate(checkoutResult.checkout_url);
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading executive solutions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Executive Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Done-for-you implementation of advanced business systems inside Local-Link CRM.
            Our expert partners build and deploy these solutions for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <div className="flex-1 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  Unit: {product.unit_label}
                </div>
              </div>
              <div className="p-6 pt-0">
                <Button
                  onClick={() => handlePurchase(product.product_key)}
                  disabled={purchasing === product.product_key}
                  className="w-full"
                >
                  {purchasing === product.product_key ? 'Processing...' : 'Purchase'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
