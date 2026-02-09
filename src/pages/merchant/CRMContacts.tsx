import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  ChevronRight,
  Tag,
  Star
} from 'lucide-react';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  job_title: string;
  tags: string[];
  lead_status: string;
  lead_score: number;
  lifetime_value: number;
  created_at: string;
}

export default function CRMContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, [user]);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery, filterStage]);

  async function loadContacts() {
    if (!user) return;

    try {
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!merchant) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('ll_crm_contacts')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterContacts() {
    let filtered = [...contacts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (contact) =>
          contact.first_name?.toLowerCase().includes(query) ||
          contact.last_name?.toLowerCase().includes(query) ||
          contact.email?.toLowerCase().includes(query) ||
          contact.company_name?.toLowerCase().includes(query)
      );
    }

    if (filterStage !== 'all') {
      filtered = filtered.filter((contact) => contact.lead_status === filterStage);
    }

    setFilteredContacts(filtered);
  }

  const lifecycleStages = [
    { value: 'all', label: 'All Contacts' },
    { value: 'lead', label: 'Leads' },
    { value: 'prospect', label: 'Prospects' },
    { value: 'customer', label: 'Customers' },
    { value: 'opportunity', label: 'Opportunities' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/merchant/crm"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Users className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
                <p className="mt-1 text-sm text-gray-600">
                  {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
                </p>
              </div>
            </div>
            <Link
              to="/merchant/crm/contacts/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {lifecycleStages.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || filterStage !== 'all' ? 'No contacts found' : 'No contacts yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterStage !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first contact'}
              </p>
              {!searchQuery && filterStage === 'all' && (
                <Link
                  to="/merchant/crm/contacts/new"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Contact
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <ContactRow key={contact.id} contact={contact} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ContactRowProps {
  contact: Contact;
}

function ContactRow({ contact }: ContactRowProps) {
  const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
  const statusColors = {
    lead: 'bg-blue-100 text-blue-800',
    prospect: 'bg-yellow-100 text-yellow-800',
    customer: 'bg-green-100 text-green-800',
    opportunity: 'bg-purple-100 text-purple-800',
  };

  return (
    <Link
      to={`/merchant/crm/contacts/${contact.id}`}
      className="block p-6 hover:bg-gray-50 transition"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            {(contact.first_name?.[0] || contact.email?.[0] || '?').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {fullName || contact.email || 'Unnamed Contact'}
              </h3>
              {contact.lead_score > 75 && (
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-800">Hot Lead</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {contact.company_name && (
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {contact.company_name}
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {contact.phone}
                </div>
              )}
            </div>
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex gap-2">
                  {contact.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {contact.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{contact.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                statusColors[contact.lead_status as keyof typeof statusColors] ||
                'bg-gray-100 text-gray-800'
              }`}
            >
              {contact.lead_status}
            </span>
            {contact.lifetime_value > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                LTV: ${Number(contact.lifetime_value).toLocaleString()}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
