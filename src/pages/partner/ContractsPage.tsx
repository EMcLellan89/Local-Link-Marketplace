import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FileText, Download, CheckCircle, Clock, Shield } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';

interface Contract {
  id: string;
  contract_type: string;
  contract_url: string | null;
  signed_at: string | null;
  signed_by_name: string | null;
  terms_version: string;
  created_at: string;
}

interface Partner {
  id: string;
  partner_type: string;
  white_label_enabled: boolean;
}

export default function ContractsPage() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [signerName, setSignerName] = useState('');
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (partnerError) throw partnerError;
      setPartner(partnerData);

      const { data: contractsData, error: contractsError } = await supabase
        .from('partner_contracts')
        .select('*')
        .eq('partner_id', partnerData.id)
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;
      setContracts(contractsData || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signContract() {
    if (!selectedContract || !partner || !signerName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!agreementAccepted) {
      alert('Please accept the agreement to continue');
      return;
    }

    try {
      const { error } = await supabase
        .from('partner_contracts')
        .update({
          signed_at: new Date().toISOString(),
          signed_by_name: signerName,
          ip_address: 'tracked_client_side',
        })
        .eq('id', selectedContract.id);

      if (error) throw error;

      setSignModalOpen(false);
      setSelectedContract(null);
      setSignerName('');
      setAgreementAccepted(false);
      loadContracts();
    } catch (error) {
      console.error('Error signing contract:', error);
      alert('Failed to sign contract');
    }
  }

  function openSignModal(contract: Contract) {
    setSelectedContract(contract);
    setSignModalOpen(true);
  }

  function getContractTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      territory: 'Territory Agreement',
      white_label: 'White Label Agreement',
      reseller: 'Reseller Agreement',
      affiliate: 'Affiliate Agreement',
    };
    return labels[type] || type;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Partner Account Not Found</h2>
          <button
            onClick={() => navigate('/partner')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner Contracts</h1>
          <p className="text-gray-600 mt-2">View and manage your partnership agreements</p>
        </div>

        {contracts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contracts Yet</h3>
            <p className="text-gray-600">Contracts will appear here once your partnership is activated</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {contracts.map((contract) => (
              <div key={contract.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        contract.signed_at ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {contract.signed_at ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getContractTypeLabel(contract.contract_type)}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Terms Version: {contract.terms_version}
                        </p>
                        {contract.signed_at && (
                          <p className="text-sm text-gray-600 mt-1">
                            Signed by {contract.signed_by_name} on{' '}
                            {new Date(contract.signed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {contract.contract_url && (
                        <a
                          href={contract.contract_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      )}
                      {!contract.signed_at && (
                        <button
                          onClick={() => openSignModal(contract)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Sign Agreement
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Contract Information</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>All contracts are legally binding once signed</li>
                <li>You can download a copy of your signed agreements at any time</li>
                <li>Contract terms may be updated with new versions over time</li>
                <li>Contact support if you have questions about any agreement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {signModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Sign {getContractTypeLabel(selectedContract.contract_type)}
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Agreement Terms</h3>
                <div className="prose prose-sm text-gray-700">
                  <p><strong>Terms Version:</strong> {selectedContract.terms_version}</p>
                  <p className="mt-4">
                    By signing this agreement, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions outlined in this {getContractTypeLabel(selectedContract.contract_type).toLowerCase()}.
                  </p>
                  <p className="mt-4">
                    This includes but is not limited to commission structures, territory rights, operational requirements, and termination clauses as detailed in the full agreement document.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="agreement" className="text-sm text-gray-700">
                  I certify that I have the authority to sign this agreement on behalf of my organization and agree to all terms and conditions.
                </label>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={signContract}
                  disabled={!signerName.trim() || !agreementAccepted}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign Agreement
                </button>
                <button
                  onClick={() => {
                    setSignModalOpen(false);
                    setSelectedContract(null);
                    setSignerName('');
                    setAgreementAccepted(false);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
