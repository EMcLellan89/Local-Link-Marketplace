import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { InternalCRMLayout } from '../../components/layout/InternalCRMLayout';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Eye,
  LogIn,
} from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  business_name: string | null;
  customer_type: string;
  status: string;
  total_lifetime_value: number;
  created_at: string;
  referred_by_partner_id: string | null;
  referred_by_partner_name: string | null;
  referred_by_partner_system_id: string | null;
  primary_business_unit: {
    name: string;
  } | null;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const { data, error } = await supabase
        .from('unified_customers')
        .select(`
          *,
          primary_business_unit:business_units(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCustomers(data as any || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      searchTerm === '' ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.business_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    const matchesType = filterType === 'all' || customer.customer_type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      churned: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      individual: 'bg-blue-100 text-blue-800',
      business: 'bg-purple-100 text-purple-800',
      merchant: 'bg-orange-100 text-orange-800',
      partner: 'bg-green-100 text-green-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <InternalCRMLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customers...</p>
          </div>
        </div>
      </InternalCRMLayout>
    );
  }

  return (
    <InternalCRMLayout>
      <div className="space-y-6 mb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
            <p className="text-gray-600">Manage all customers across all business units</p>
          </div>
          <Link to="/internal/customers/new">
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="churned">Churned</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="merchant">Merchant</option>
              <option value="partner">Partner</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <p>
              Showing <span className="font-semibold">{filteredCustomers.length}</span> of{' '}
              <span className="font-semibold">{customers.length}</span> customers
            </p>
          </div>
        </Card>

        {/* Customers Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Partner</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Primary Business</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">LTV</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <p className="text-gray-500 mb-2">No customers found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold">
                              {(customer.full_name || customer.email)[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {customer.full_name || 'No name'}
                            </p>
                            {customer.business_name && (
                              <p className="text-sm text-gray-600 truncate flex items-center mt-0.5">
                                <Building2 className="w-3 h-3 mr-1" />
                                {customer.business_name}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 truncate flex items-center mt-0.5">
                              <Mail className="w-3 h-3 mr-1" />
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(customer.customer_type)}`}>
                          {customer.customer_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {customer.referred_by_partner_name ? (
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{customer.referred_by_partner_name}</p>
                            <p className="text-xs text-gray-500">ID: {customer.referred_by_partner_system_id}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Direct</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900">
                          {customer.primary_business_unit?.name || '-'}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ${Number(customer.total_lifetime_value).toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link to={`/internal/customers/${customer.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" title="Impersonate">
                            <LogIn className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </InternalCRMLayout>
  );
}
