import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Upload, Package, Check, X, Palette, ExternalLink, Gift, ShoppingBag } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';
import { supabase } from '../../lib/supabase';

interface PrintingProduct {
  id: string;
  category: string;
  name: string;
  description: string | null;
  stock_type: string | null;
  size: string | null;
  turnaround: string | null;
  pricing: Record<string, number>;
  is_active: boolean;
  image_url: string | null;
}

interface OrderForm {
  productId: string;
  quantity: string;
  needsDesign: boolean;
  designNotes: string;
  uploadedFile: File | null;
}

export default function PrintingServicesPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<PrintingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<PrintingProduct | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    productId: '',
    quantity: '',
    needsDesign: false,
    designNotes: '',
    uploadedFile: null
  });

  const categories = [
    { id: 'business_cards', name: 'Business Cards', icon: '💼', description: 'Professional business cards' },
    { id: 'flyers', name: 'Flyers', icon: '📄', description: 'Full color promotional flyers' },
    { id: 'brochures', name: 'Brochures', icon: '📰', description: 'Multi-page brochures' },
    { id: 'door_hangers', name: 'Door Hangers', icon: '🚪', description: 'UV coated door hangers' },
    { id: 'rack_cards', name: 'Rack Cards', icon: '🎴', description: 'Display rack cards' },
    { id: 'envelopes', name: 'Envelopes', icon: '✉️', description: 'Business envelopes' },
    { id: 'letterhead', name: 'Letterhead', icon: '📝', description: 'Professional letterhead' },
    { id: 'yard_signs', name: 'Yard Signs', icon: '🪧', description: 'Outdoor yard signs' },
    { id: 'a_frame_signs', name: 'A-Frame Signs', icon: '📋', description: 'Double-sided signs' },
    { id: 'notepads', name: 'Notepads', icon: '📓', description: 'Custom branded notepads' },
    { id: 'promotional_swag', name: 'Promotional Swag & Apparel', icon: '🎁', description: 'Branded merchandise and promotional items' }
  ];

  useEffect(() => {
    fetchProducts();
    fetchMerchantId();
  }, []);

  const fetchMerchantId = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (user) {
        const { data: merchant, error: merchantError } = await supabase
          .from('merchants')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (merchantError) throw merchantError;

        if (merchant) {
          setMerchantId(merchant.id);
        }
      }
    } catch (error) {
      console.error('Error fetching merchant ID:', error);
      setError('Failed to load merchant information');
    }
  };

  const fetchProducts = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('printing_products')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load printing products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category);
  };

  const handleProductClick = (product: PrintingProduct) => {
    setSelectedProduct(product);
    setOrderForm({
      productId: product.id,
      quantity: '',
      needsDesign: false,
      designNotes: '',
      uploadedFile: null
    });
    setShowOrderModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOrderForm({ ...orderForm, uploadedFile: file });
    }
  };

  const calculatePrice = () => {
    if (!selectedProduct || !orderForm.quantity) return 0;

    const quantities = Object.keys(selectedProduct.pricing).map(Number).sort((a, b) => a - b);
    const qty = parseInt(orderForm.quantity);

    let priceForQty = 0;
    for (const q of quantities) {
      if (qty >= q) {
        priceForQty = selectedProduct.pricing[q.toString()];
      }
    }

    const designFee = orderForm.needsDesign ? 2500 : 0;
    return priceForQty + designFee;
  };

  const handleSubmitOrder = async () => {
    if (!selectedProduct || !merchantId || !orderForm.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      let fileUrl = null;

      if (orderForm.uploadedFile) {
        const fileExt = orderForm.uploadedFile.name.split('.').pop();
        const fileName = `${merchantId}-${Date.now()}.${fileExt}`;
        const filePath = `printing-orders/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('merchant-files')
          .upload(filePath, orderForm.uploadedFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('merchant-files')
          .getPublicUrl(filePath);

        fileUrl = urlData?.publicUrl;
      }

      const totalPrice = calculatePrice();

      const { error } = await supabase
        .from('printing_orders')
        .insert({
          merchant_id: merchantId,
          product_id: orderForm.productId,
          quantity: parseInt(orderForm.quantity),
          total_price_cents: totalPrice,
          needs_design: orderForm.needsDesign,
          design_notes: orderForm.designNotes || null,
          uploaded_file_url: fileUrl,
          status: 'pending'
        });

      if (error) throw error;

      alert('Order submitted successfully! Our team will review and contact you shortly.');
      setShowOrderModal(false);
      setSelectedProduct(null);
      setOrderForm({
        productId: '',
        quantity: '',
        needsDesign: false,
        designNotes: '',
        uploadedFile: null
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="space-y-8">
        {error && (
          <Card variant="bordered" className="bg-red-50 border-red-200">
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="text-red-600 mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setError(null); fetchProducts(); }}>
                  Try Again
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Printing Services</h1>
          <p className="text-slate-600 mt-2">
            Professional printing for all your business marketing materials
          </p>
        </div>

        <Card variant="bordered" className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300">
          <CardBody>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Need a Designer?</h3>
                  <p className="text-slate-700 mb-2">
                    We can design your project for <span className="font-bold text-orange-600">$25</span>.
                  </p>
                  <p className="text-sm text-slate-600">
                    Once approved, we'll print it for you. No design skills needed!
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/merchant/printing/design-service')}
                className="bg-orange-600 hover:bg-orange-700 text-white flex-shrink-0"
              >
                <Palette className="w-4 h-4 mr-2" />
                Get Design Service
              </Button>
            </div>
          </CardBody>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2BB673]"></div>
            <p className="mt-2 text-slate-600">Loading products...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryProducts = getProductsByCategory(category.id);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
                      <p className="text-sm text-slate-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryProducts.map((product) => (
                      <Card key={product.id} variant="bordered" className="hover:shadow-lg transition-shadow">
                        {product.image_url && (
                          <div className="w-full h-48 overflow-hidden rounded-t-lg">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-900">{product.name}</h3>
                              {product.description && (
                                <p className="text-sm text-slate-600 mt-1">{product.description}</p>
                              )}
                            </div>
                            <Package className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                          </div>
                        </CardHeader>
                        <CardBody>
                          <div className="space-y-2 mb-4">
                            {product.stock_type && (
                              <p className="text-xs text-slate-600">
                                <span className="font-semibold">Stock:</span> {product.stock_type}
                              </p>
                            )}
                            {product.size && (
                              <p className="text-xs text-slate-600">
                                <span className="font-semibold">Size:</span> {product.size}
                              </p>
                            )}
                            {product.turnaround && (
                              <p className="text-xs text-slate-600">
                                <span className="font-semibold">Turnaround:</span> {product.turnaround}
                              </p>
                            )}
                            <div className="pt-2 border-t border-slate-200">
                              <p className="text-xs font-semibold text-slate-700 mb-1">Pricing:</p>
                              <div className="grid grid-cols-2 gap-1">
                                {Object.entries(product.pricing).slice(0, 4).map(([qty, price]) => (
                                  <p key={qty} className="text-xs text-slate-600">
                                    {qty}: ${(price / 100).toFixed(2)}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            fullWidth
                            variant="default"
                            onClick={() => handleProductClick(product)}
                          >
                            Order Now
                          </Button>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Promotional Items Store Banner */}
        <div className="mt-8 rounded-2xl overflow-hidden border border-[#2BB673]/20 bg-gradient-to-br from-[#2BB673]/5 via-white to-emerald-50">
          <div className="px-8 py-10 md:px-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2BB673] to-emerald-600 flex items-center justify-center shadow-lg shadow-[#2BB673]/25">
                  <Gift className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 bg-[#2BB673]/10 text-[#2BB673] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Promotional Products Store
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                  Order Promotional Items for Your Business
                </h2>
                <p className="text-slate-600 text-base leading-relaxed mb-1">
                  Browse thousands of branded promotional products — apparel, drinkware, bags, tech accessories, and more. All customizable with your business logo.
                </p>
                <p className="text-sm text-slate-500">
                  Shirts, sweatshirts, hats, pens, mugs, tote bags, and anything in between. If you can put a logo on it, we can source it.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <a
                  href="https://mypipelinesolutions.espwebsites.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#2BB673] hover:bg-[#25a062] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#2BB673]/25 hover:shadow-[#2BB673]/40 hover:-translate-y-0.5 text-base w-full md:w-auto"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Shop Promo Items
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
                <p className="text-xs text-center text-slate-400 mt-2">Opens in a new tab</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Apparel', detail: 'Shirts, polos, hoodies' },
                { label: 'Drinkware', detail: 'Mugs, tumblers, bottles' },
                { label: 'Bags & Totes', detail: 'Branded carry bags' },
                { label: 'Tech & More', detail: 'USB, pens, desk items' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Embroidery & Silk Screen */}
        <Card variant="bordered" className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300">
          <CardBody>
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Custom Embroidery & Silk Screen</h2>
              <p className="text-slate-700">Business logo shirts, sweatshirts, and embroidered apparel</p>
              <p className="text-[#2BB673] font-semibold">
                Anything you need printed — we can do it. Ask us and we'll quote it!
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {showOrderModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Order {selectedProduct.name}</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Product Details</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  {selectedProduct.stock_type && (
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Stock:</span> {selectedProduct.stock_type}
                    </p>
                  )}
                  {selectedProduct.size && (
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Size:</span> {selectedProduct.size}
                    </p>
                  )}
                  {selectedProduct.turnaround && (
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Turnaround:</span> {selectedProduct.turnaround}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Select Quantity
                </label>
                <select
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                >
                  <option value="">Choose quantity...</option>
                  {Object.keys(selectedProduct.pricing).map((qty) => (
                    <option key={qty} value={qty}>
                      {qty} - ${(selectedProduct.pricing[qty] / 100).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={orderForm.needsDesign}
                    onChange={(e) => setOrderForm({ ...orderForm, needsDesign: e.target.checked })}
                    className="w-5 h-5 text-[#2BB673] border-slate-300 rounded focus:ring-[#2BB673]"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">I need design services (+$25)</p>
                    <p className="text-sm text-slate-600">Our design team will create your materials</p>
                  </div>
                </label>
              </div>

              {orderForm.needsDesign && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Design Notes
                  </label>
                  <textarea
                    value={orderForm.designNotes}
                    onChange={(e) => setOrderForm({ ...orderForm, designNotes: e.target.value })}
                    placeholder="Tell us what you need designed..."
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Upload Your Logo or Artwork {!orderForm.needsDesign && '(Required)'}
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-[#2BB673] transition-colors">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.ai,.eps,.psd"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-[#2BB673] hover:text-[#239a5e] font-semibold"
                  >
                    Choose file
                  </label>
                  <p className="text-sm text-slate-600 mt-2">
                    {orderForm.uploadedFile ? orderForm.uploadedFile.name : 'PDF, AI, EPS, PSD, or high-res images'}
                  </p>
                </div>
              </div>

              {orderForm.quantity && (
                <div className="bg-[#2BB673]/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">Product Price:</span>
                    <span className="text-slate-900">
                      ${((selectedProduct.pricing[orderForm.quantity] || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                  {orderForm.needsDesign && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">Design Services:</span>
                      <span className="text-slate-900">$25.00</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-[#2BB673]/20">
                    <span className="font-bold text-slate-900 text-lg">Total:</span>
                    <span className="font-bold text-[#2BB673] text-lg">
                      ${(calculatePrice() / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowOrderModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  onClick={handleSubmitOrder}
                  disabled={uploading || !orderForm.quantity || (!orderForm.needsDesign && !orderForm.uploadedFile)}
                >
                  {uploading ? 'Submitting...' : 'Submit Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BusinessHubLayout>
  );
}
