import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';

export default function CRMContactNew() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    lead_source: 'other',
    lead_value: 0,
    priority: 'warm',
    notes: '',
    next_follow_up: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', profile.id)
        .single();

      if (!merchantData) {
        throw new Error('Merchant not found');
      }

      const { data, error } = await supabase
        .from('crm_leads')
        .insert({
          merchant_id: merchantData.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email || null,
          phone: formData.phone || null,
          company: formData.company || null,
          status: formData.status,
          lead_source: formData.lead_source,
          lead_value: formData.lead_value,
          priority: formData.priority,
          notes: formData.notes,
          next_follow_up: formData.next_follow_up || null,
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/merchant/crm/contacts/${data.id}`);
    } catch (error: any) {
      console.error('Error creating contact:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="New Contact" role="merchant">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/merchant/crm/contacts')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Button>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Add New Contact</h2>
            <p className="text-slate-600 mt-1">Enter the contact's information below</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                  >
                    <option value="hot">Hot</option>
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={formData.lead_source}
                    onChange={(e) => setFormData({ ...formData, lead_source: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                  >
                    <option value="website">Website</option>
                    <option value="printing">Printing</option>
                    <option value="postcards">Postcards</option>
                    <option value="swag">Swag</option>
                    <option value="referral">Referral</option>
                    <option value="direct">Direct</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <Input
                  label="Estimated Value ($)"
                  type="number"
                  value={formData.lead_value}
                  onChange={(e) => setFormData({ ...formData, lead_value: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <Input
                label="Next Follow-up"
                type="datetime-local"
                value={formData.next_follow_up}
                onChange={(e) => setFormData({ ...formData, next_follow_up: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                  placeholder="Add any notes about this contact..."
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : 'Save Contact'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/merchant/crm/contacts')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
