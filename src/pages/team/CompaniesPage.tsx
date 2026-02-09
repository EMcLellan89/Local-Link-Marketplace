import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Plus,
  Search,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  Trash2,
  Users,
  DollarSign
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

interface Company {
  id: string;
  company_name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address_line1: string;
  city: string;
  state: string;
  status: string;
  revenue_potential_cents: number;
  employee_count: number;
  created_at: string;
}

export default function CompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    website: '',
    phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    status: 'lead',
    revenue_potential_cents: 0,
    employee_count: 0,
    notes: ''
  });

  useEffect(() => {
    loadCompanies();
  }, [statusFilter]);

  async function loadCompanies() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!teamMember) return;

      let query = supabase
        .from('crm_companies')
        .select('*')
        .eq('assigned_to', teamMember.id)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setCompanies(data);

    } catch (err) {
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!teamMember) return;

      const { error } = await supabase
        .from('crm_companies')
        .insert([{
          ...formData,
          assigned_to: teamMember.id
        }]);

      if (error) throw error;

      setShowAddModal(false);
      setFormData({
        company_name: '',
        industry: '',
        website: '',
        phone: '',
        email: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'USA',
        status: 'lead',
        revenue_potential_cents: 0,
        employee_count: 0,
        notes: ''
      });
      loadCompanies();
    } catch (err) {
      console.error('Error adding company:', err);
      alert('Failed to add company');
    }
  }

  async function handleDeleteCompany(id: string) {
    if (!confirm('Are you sure you want to delete this company?')) return;

    try {
      const { error } = await supabase
        .from('crm_companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadCompanies();
    } catch (err) {
      console.error('Error deleting company:', err);
      alert('Failed to delete company');
    }
  }

  function formatCurrency(cents: number): string {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'lead': return 'bg-gray-100 text-gray-700';
      case 'prospect': return 'bg-blue-100 text-blue-700';
      case 'customer': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout role="team">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="team">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
            <p className="text-gray-600 mt-1">Manage your assigned companies</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Company
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardBody>
        </Card>

        {/* Companies List */}
        {filteredCompanies.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first company</p>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  Add Company
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Building className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">{company.company_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(company.status)}`}>
                          {company.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {company.industry && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>{company.industry}</span>
                          </div>
                        )}
                        {company.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${company.email}`} className="hover:text-blue-600">
                              {company.email}
                            </a>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${company.phone}`} className="hover:text-blue-600">
                              {company.phone}
                            </a>
                          </div>
                        )}
                        {company.website && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Globe className="w-4 h-4" />
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600"
                            >
                              Website
                            </a>
                          </div>
                        )}
                        {(company.city || company.state) && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{[company.city, company.state].filter(Boolean).join(', ')}</span>
                          </div>
                        )}
                        {company.employee_count > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{company.employee_count} employees</span>
                          </div>
                        )}
                      </div>

                      {company.revenue_potential_cents > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            Revenue Potential: {formatCurrency(company.revenue_potential_cents)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        Added {new Date(company.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/team/companies/${company.id}`}>
                        <Button variant="secondary" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCompany(company.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Add Company Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Company</h2>
                <form onSubmit={handleAddCompany} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                      <Input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="lead">Lead</option>
                        <option value="prospect">Prospect</option>
                        <option value="customer">Customer</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <Input
                      type="url"
                      placeholder="https://"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                    <Input
                      type="text"
                      value={formData.address_line1}
                      onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                    <Input
                      type="text"
                      value={formData.address_line2}
                      onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <Input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <Input
                        type="text"
                        value={formData.zip_code}
                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revenue Potential ($)
                      </label>
                      <Input
                        type="number"
                        value={formData.revenue_potential_cents / 100}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            revenue_potential_cents: parseInt(e.target.value) * 100 || 0
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee Count
                      </label>
                      <Input
                        type="number"
                        value={formData.employee_count}
                        onChange={(e) =>
                          setFormData({ ...formData, employee_count: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" variant="primary" className="flex-1">
                      Add Company
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
