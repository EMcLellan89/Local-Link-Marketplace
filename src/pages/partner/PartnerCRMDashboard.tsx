import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Building2, Users, FileText, DollarSign, TrendingUp, Plus, Wallet, Calculator, PiggyBank } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import { DEV_MODE } from '../../lib/devMode';

interface Company {
  id: string;
  company_name: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company_id: string | null;
  companies?: { company_name: string };
}

interface Deal {
  id: string;
  deal_name: string;
  stage: string;
  deal_value_cents: number;
  expected_commission_cents: number;
  payment_status: string;
  company_id: string;
  companies: { company_name: string };
  created_at: string;
}

export default function PartnerCRMDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accountingTier, setAccountingTier] = useState<'none' | 'lite' | 'pro'>('none');
  const [partnerId, setPartnerId] = useState<string>('');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalContacts: 0,
    totalDeals: 0,
    pipelineValue: 0,
    expectedCommission: 0,
    wonDeals: 0
  });

  useEffect(() => {
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
    if (!user) {
      navigate('/partner/apply');
      return;
    }

    // DEV MODE: Bypass subscription checks
    if (DEV_MODE) {
      setAccountingTier('pro');
      setPartnerId('dev-partner-id');
      setHasAccess(true);
      setLoading(false);
      return;
    }

    try {
      const { data: partner } = await supabase
        .from('partners')
        .select('id, status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!partner) {
        navigate('/partner/apply');
        return;
      }

      if (partner.status !== 'Active') {
        navigate('/partner/crm/upgrade');
        return;
      }

      // Check for partner tier subscription (CRM included)
      // partner_tier_starter_218, partner_tier_pro_658, partner_tier_enterprise_1798
      const { data: tierSub } = await supabase
        .from('user_subscriptions')
        .select('status, stripe_subscription_id, metadata')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      // Also check legacy partner_crm_subscriptions for backwards compatibility
      const { data: crmSub } = await supabase
        .from('partner_crm_subscriptions')
        .select('status, accounting_tier')
        .eq('partner_id', partner.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      const hasAccessCheck = tierSub || crmSub;

      if (!hasAccessCheck) {
        navigate('/partner/crm/upgrade');
        return;
      }

      // Determine accounting tier from subscription
      let tier: 'lite' | 'pro' = 'lite';
      if (crmSub?.accounting_tier) {
        tier = crmSub.accounting_tier as 'lite' | 'pro';
      } else if (tierSub?.metadata) {
        const metadata = tierSub.metadata as any;
        if (metadata.sku?.includes('pro') || metadata.sku?.includes('enterprise')) {
          tier = 'pro';
        }
      }

      setAccountingTier(tier);
      setPartnerId(partner.id);
      setHasAccess(true);
      await loadData(partner.id);
    } catch (error) {
      console.error('Error checking access:', error);
      navigate('/partner/apply');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (partnerId: string) => {
    try {
      const [companiesRes, contactsRes, dealsRes] = await Promise.all([
        supabase
          .from('partner_crm_companies')
          .select('*')
          .eq('partner_id', partnerId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('partner_crm_contacts')
          .select('*, companies:company_id(company_name)')
          .eq('partner_id', partnerId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('partner_crm_deals')
          .select('*, companies:company_id(company_name)')
          .eq('partner_id', partnerId)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (companiesRes.data) setCompanies(companiesRes.data);
      if (contactsRes.data) setContacts(contactsRes.data);
      if (dealsRes.data) setDeals(dealsRes.data);

      const pipelineValue = dealsRes.data?.filter(d => ['prospecting', 'qualified', 'proposal', 'negotiation'].includes(d.stage)).reduce((sum, d) => sum + d.deal_value_cents, 0) || 0;
      const expectedCommission = dealsRes.data?.filter(d => ['prospecting', 'qualified', 'proposal', 'negotiation'].includes(d.stage)).reduce((sum, d) => sum + (d.total_commission_cents ?? 0), 0) || 0;
      const wonDeals = dealsRes.data?.filter(d => d.stage === 'closed_won').length || 0;

      setStats({
        totalCompanies: companiesRes.data?.length || 0,
        totalContacts: contactsRes.data?.length || 0,
        totalDeals: dealsRes.data?.length || 0,
        pipelineValue,
        expectedCommission,
        wonDeals
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Partner CRM...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner CRM Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage companies, contacts, deals, and finances in one place
            {accountingTier !== 'none' && (
              <span className="ml-2 text-sm px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">
                Local-Link {accountingTier === 'pro' ? 'Pro' : 'Lite'} Accounting
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Companies</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCompanies}</p>
              </div>
              <Building2 className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contacts</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalContacts}</p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${(stats.pipelineValue / 100).toFixed(0)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expected Commission</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${(stats.expectedCommission / 100).toFixed(0)}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>
        </div>

        {accountingTier !== 'none' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => navigate('/partner/crm/accounting')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow p-6 hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="w-8 h-8" />
                <h3 className="text-lg font-semibold">Accounting</h3>
              </div>
              <p className="text-sm text-blue-100">
                Track income, expenses, and profit & loss
              </p>
            </button>

            <button
              onClick={() => navigate('/partner/crm/tax-center')}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow p-6 hover:from-green-700 hover:to-green-800 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8" />
                <h3 className="text-lg font-semibold">Tax Center</h3>
              </div>
              <p className="text-sm text-green-100">
                Quarterly tax estimates and autopay
              </p>
            </button>

            <button
              onClick={() => navigate('/partner/crm/bank-accounts')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow p-6 hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-8 h-8" />
                <h3 className="text-lg font-semibold">Bank Accounts</h3>
              </div>
              <p className="text-sm text-purple-100">
                Connect accounts for payouts and taxes
              </p>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Companies</h2>
                <button
                  onClick={() => navigate('/partner/crm/companies/add')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
            <div className="p-6">
              {companies.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No companies yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add companies to track deals
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {companies.slice(0, 5).map((company) => (
                    <div
                      key={company.id}
                      onClick={() => navigate(`/partner/crm/companies/${company.id}`)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <p className="font-semibold text-gray-900">{company.company_name}</p>
                      <p className="text-sm text-gray-600">{company.city}, {company.state}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
                <button
                  onClick={() => navigate('/partner/crm/contacts/add')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
            <div className="p-6">
              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No contacts yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add contacts within companies
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.slice(0, 5).map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => navigate(`/partner/crm/contacts/${contact.id}`)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <p className="font-semibold text-gray-900">
                        {contact.first_name} {contact.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Deals</h2>
                <button
                  onClick={() => navigate('/partner/crm/deals/add')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
            <div className="p-6">
              {deals.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No deals yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Create deals to track commissions
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {deals.slice(0, 5).map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => navigate(`/partner/crm/deals/${deal.id}`)}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-gray-900">{deal.deal_name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          deal.stage === 'closed-won' ? 'bg-green-100 text-green-700' :
                          deal.stage === 'closed-lost' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {deal.stage}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{deal.companies.company_name}</p>
                      <p className="text-sm font-semibold text-green-600 mt-2">
                        Commission: ${(deal.expected_commission_cents / 100).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
