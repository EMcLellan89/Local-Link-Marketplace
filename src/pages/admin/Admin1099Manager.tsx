import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader, FileText, Download, Send, AlertCircle, CheckCircle, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

interface EligiblePartner {
  partner_id: string;
  partner_email: string;
  partner_name: string;
  business_name: string;
  total_compensation: number;
  has_w9: boolean;
  w9_document_id: string;
  w9_status: string;
  has_1099: boolean;
  status_1099: string;
}

interface Form1099 {
  id: string;
  partner_id: string;
  tax_year: number;
  form_type: string;
  total_compensation: number;
  status: string;
  generated_at: string;
  sent_at: string | null;
  filed_at: string | null;
  partner_name: string;
  partner_email: string;
  business_name: string;
}

export default function Admin1099Manager() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);
  const [eligiblePartners, setEligiblePartners] = useState<EligiblePartner[]>([]);
  const [generated1099s, setGenerated1099s] = useState<Form1099[]>([]);
  const [generating, setGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (userRole === 'admin') {
      loadData();
    }
  }, [selectedYear, userRole]);

  async function checkAdminAccess() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/');
        return;
      }

      setUserRole('admin');
    } catch (error) {
      console.error('Access check error:', error);
      navigate('/admin/login');
    }
  }

  async function loadData() {
    try {
      setLoading(true);

      const [eligibleRes, generated1099sRes] = await Promise.all([
        supabase.rpc('get_partners_eligible_for_1099', {
          p_tax_year: selectedYear
        }),
        supabase
          .from('partner_1099_documents')
          .select(`
            *,
            partners!inner (
              full_name,
              email
            ),
            partner_w9_documents (
              business_name
            )
          `)
          .eq('tax_year', selectedYear)
          .order('generated_at', { ascending: false })
      ]);

      if (eligibleRes.error) throw eligibleRes.error;
      if (generated1099sRes.error) throw generated1099sRes.error;

      setEligiblePartners(eligibleRes.data || []);

      const formatted1099s = (generated1099sRes.data || []).map((doc: any) => ({
        ...doc,
        partner_name: doc.partners?.full_name || 'N/A',
        partner_email: doc.partners?.email || 'N/A',
        business_name: doc.partner_w9_documents?.business_name || 'N/A'
      }));

      setGenerated1099s(formatted1099s);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateBatch() {
    if (!confirm(`Generate 1099-NEC forms for all eligible partners in ${selectedYear}?`)) {
      return;
    }

    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('generate_1099_batch', {
        p_tax_year: selectedYear,
        p_generated_by: user.id
      });

      if (error) throw error;

      const successCount = data.filter((r: any) => r.status === 'success').length;
      const errorCount = data.filter((r: any) => r.status === 'error').length;

      alert(`Successfully generated ${successCount} 1099 forms. ${errorCount} errors.`);
      await loadData();
    } catch (error: any) {
      console.error('Error generating batch:', error);
      alert('Failed to generate 1099 batch: ' + error.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownload1099(id: string) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-1099-pdf', {
        body: { form_1099_id: id }
      });

      if (error) throw error;

      if (data?.pdf_url) {
        window.open(data.pdf_url, '_blank');
      } else {
        alert('PDF URL not available');
      }
    } catch (error: any) {
      console.error('Error downloading 1099:', error);
      alert('Failed to download 1099: ' + error.message);
    }
  }

  async function handleMarkAsSent(id: string) {
    if (!confirm('Mark this 1099 as sent?')) return;

    try {
      const { error } = await supabase
        .from('partner_1099_documents')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      alert('1099 marked as sent');
      await loadData();
    } catch (error: any) {
      console.error('Error marking as sent:', error);
      alert('Failed to update status: ' + error.message);
    }
  }

  async function handleMarkAsFiled(id: string) {
    if (!confirm('Mark this 1099 as filed with the IRS?')) return;

    try {
      const { error } = await supabase
        .from('partner_1099_documents')
        .update({
          status: 'filed',
          filed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      alert('1099 marked as filed');
      await loadData();
    } catch (error: any) {
      console.error('Error marking as filed:', error);
      alert('Failed to update status: ' + error.message);
    }
  }

  async function handleExportToCSV() {
    const filtered = filterStatus === 'all'
      ? generated1099s
      : generated1099s.filter(doc => doc.status === filterStatus);

    const csvContent = [
      ['Partner Name', 'Email', 'Business Name', 'Tax Year', 'Compensation', 'Status', 'Generated Date', 'Sent Date', 'Filed Date'].join(','),
      ...filtered.map(doc => [
        doc.partner_name,
        doc.partner_email,
        doc.business_name,
        doc.tax_year,
        doc.total_compensation,
        doc.status,
        new Date(doc.generated_at).toLocaleDateString(),
        doc.sent_at ? new Date(doc.sent_at).toLocaleDateString() : '',
        doc.filed_at ? new Date(doc.filed_at).toLocaleDateString() : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `1099-forms-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const availableYears = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const filtered1099s = filterStatus === 'all'
    ? generated1099s
    : generated1099s.filter(doc => doc.status === filterStatus);

  const eligibleWithoutW9 = eligiblePartners.filter(p => !p.has_w9);
  const eligibleWithW9NoForm = eligiblePartners.filter(p => p.has_w9 && !p.has_1099);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">1099-NEC Form Manager</h1>
          <p className="text-gray-600 mt-2">
            Generate and manage 1099 tax forms for partners
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eligible Partners</p>
                <p className="text-3xl font-bold text-blue-600">{eligiblePartners.length}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Forms Generated</p>
                <p className="text-3xl font-bold text-green-600">{generated1099s.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Missing W-9</p>
                <p className="text-3xl font-bold text-red-600">{eligibleWithoutW9.length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600 opacity-20" />
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Tax Year</h2>
              <p className="text-sm text-gray-600">Select the tax year to manage</p>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {eligibleWithW9NoForm.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">
                    {eligibleWithW9NoForm.length} partners ready for 1099 generation
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    These partners earned $600+ and have completed W-9 forms on file.
                  </p>
                </div>
                <Button
                  onClick={handleGenerateBatch}
                  disabled={generating}
                  className="flex-shrink-0"
                >
                  {generating ? 'Generating...' : 'Generate Batch'}
                </Button>
              </div>
            </div>
          )}

          {eligibleWithoutW9.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900">
                    {eligibleWithoutW9.length} partners missing W-9 forms
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    These partners earned $600+ but haven't completed their W-9. They must complete W-9 before 1099 generation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Generated 1099 Forms</h2>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="generated">Generated</option>
                  <option value="sent">Sent</option>
                  <option value="filed">Filed</option>
                </select>
              </div>
              <Button variant="secondary" onClick={handleExportToCSV}>
                Export CSV
              </Button>
            </div>
          </div>

          {filtered1099s.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No 1099 forms found for {selectedYear}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Partner</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Business Name</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Compensation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Generated</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered1099s.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{doc.partner_name}</p>
                          <p className="text-sm text-gray-600">{doc.partner_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-900">{doc.business_name}</td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">
                        ${doc.total_compensation.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.status === 'filed' ? 'bg-green-100 text-green-800' :
                          doc.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          doc.status === 'generated' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(doc.generated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownload1099(doc.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {doc.status === 'generated' && (
                            <button
                              onClick={() => handleMarkAsSent(doc.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Mark as Sent"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          {doc.status === 'sent' && (
                            <button
                              onClick={() => handleMarkAsFiled(doc.id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                              title="Mark as Filed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {eligiblePartners.length > 0 && (
          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Eligible Partners ({selectedYear})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Partner</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Business Name</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Compensation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">W-9 Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">1099 Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {eligiblePartners.map((partner) => (
                    <tr key={partner.partner_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{partner.partner_name}</p>
                          <p className="text-sm text-gray-600">{partner.partner_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-900">{partner.business_name || 'N/A'}</td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">
                        ${Number(partner.total_compensation).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4">
                        {partner.has_w9 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {partner.w9_status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Missing
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {partner.has_1099 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {partner.status_1099}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Not Generated
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
