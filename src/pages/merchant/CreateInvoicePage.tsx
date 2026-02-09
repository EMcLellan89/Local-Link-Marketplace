import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../components/ui/BackButton';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    terms: 'Payment due within 30 days'
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const [taxRate, setTaxRate] = useState(0);

  useEffect(() => {
    fetchMerchant();
  }, [user]);

  useEffect(() => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    setFormData(prev => ({ ...prev, dueDate: dueDate.toISOString().split('T')[0] }));
  }, []);

  const fetchMerchant = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setMerchantId(data.id);
    } catch (error) {
      console.error('Error fetching merchant:', error);
    }
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = Number(updated.quantity) * Number(updated.rate);
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now();
    return `INV-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchantId) {
      alert('Merchant information not found');
      return;
    }

    if (!formData.customerName.trim()) {
      alert('Customer name is required');
      return;
    }

    if (lineItems.some(item => !item.description.trim())) {
      alert('All line items must have a description');
      return;
    }

    setLoading(true);

    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax();
      const total = calculateTotal();

      const invoiceData = {
        merchant_id: merchantId,
        invoice_number: generateInvoiceNumber(),
        customer_name: formData.customerName,
        customer_email: formData.customerEmail || null,
        invoice_date: formData.invoiceDate,
        due_date: formData.dueDate,
        status: 'draft',
        subtotal_cents: Math.round(subtotal * 100),
        tax_cents: Math.round(tax * 100),
        total_cents: Math.round(total * 100),
        amount_paid_cents: 0,
        balance_cents: Math.round(total * 100),
        notes: formData.notes || null,
        terms: formData.terms || null,
        line_items: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate_cents: Math.round(item.rate * 100),
          amount_cents: Math.round(item.amount * 100)
        }))
      };

      const { error } = await supabase
        .from('accounting_invoices')
        .insert(invoiceData);

      if (error) throw error;

      navigate('/merchant/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BusinessHubLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/merchant/invoices')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Button>

        <Card variant="bordered">
          <CardHeader>
            <h1 className="text-2xl font-bold text-slate-900">Create New Invoice</h1>
            <p className="text-slate-600 mt-1">Create and send invoices to your customers</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Customer Name"
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  label="Customer Email"
                  placeholder="customer@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Invoice Date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Line Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-5">
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Rate"
                          step="0.01"
                          min="0"
                          value={item.rate}
                          onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700">
                          ${item.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Subtotal</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-slate-700">Tax Rate (%)</label>
                    <Input
                      type="number"
                      className="w-24"
                      placeholder="0"
                      step="0.01"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-lg">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-[#2BB673]">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Additional notes for the customer"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Terms</label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2BB673] focus:border-transparent transition-all"
                  rows={2}
                  placeholder="Payment terms and conditions"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Invoice'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/merchant/invoices')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
