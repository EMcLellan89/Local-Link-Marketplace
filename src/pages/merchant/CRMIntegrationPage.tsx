import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, Settings, CheckCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface CRMPreference {
  id: string;
  primary_crm: 'locallink' | 'adsuite' | 'tradehive' | 'other';
  enable_csv_export: boolean;
  csv_export_frequency: string;
  auto_sync_enabled: boolean;
  last_sync_at: string | null;
}

interface CSVExport {
  id: string;
  export_status: 'pending' | 'processing' | 'completed' | 'failed';
  target_crm: string;
  lead_count: number;
  exported_at: string | null;
  download_url: string | null;
}

interface MigrationRequest {
  id: string;
  source_crm: string;
  migration_status: string;
  total_records: number;
  migrated_records: number;
  created_at: string;
}

export default function CRMIntegrationPage() {
  const navigate = useNavigate();
  const [merchantId, setMerchantId] = useState<string>('');
  const [preferences, setPreferences] = useState<CRMPreference | null>(null);
  const [exports, setExports] = useState<CSVExport[]>([]);
  const [migrations, setMigrations] = useState<MigrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) return;

      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (merchantError) throw merchantError;
      setMerchantId(merchant.id);

      // Load CRM preferences
      const { data: prefs, error: prefsError } = await supabase
        .from('merchant_crm_preferences')
        .select('*')
        .eq('merchant_id', merchant.id)
        .maybeSingle();

      if (prefsError && prefsError.code !== 'PGRST116') throw prefsError;

      if (prefs) {
        setPreferences(prefs);
      }

      // Load recent exports
      const { data: exportsData, error: exportsError } = await supabase
        .from('crm_csv_exports')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (exportsError) throw exportsError;
      setExports(exportsData || []);

      // Load migration requests
      const { data: migrationsData, error: migrationsError } = await supabase
        .from('crm_migration_requests')
        .select('*')
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (migrationsError) throw migrationsError;
      setMigrations(migrationsData || []);

    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(error.message || 'Failed to load CRM integration data');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async (newCrm: string) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase
        .from('merchant_crm_preferences')
        .upsert({
          merchant_id: merchantId,
          primary_crm: newCrm,
          enable_csv_export: newCrm !== 'locallink',
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      setSuccess('CRM preferences updated successfully');
      await loadData();
    } catch (error: any) {
      setError(error.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = async (targetCrm: 'adsuite' | 'tradehive') => {
    try {
      setExporting(true);
      setError(null);
      setSuccess(null);

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crm-export-csv`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchantId,
            targetCrm,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_export_${targetCrm}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(`CSV exported successfully! Import this file into your ${targetCrm === 'adsuite' ? 'AdSuite' : 'TradeHive'} CRM.`);
      await loadData();
    } catch (error: any) {
      setError(error.message || 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const handleRequestMigration = async (sourceCrm: 'adsuite' | 'tradehive') => {
    try {
      setError(null);
      setSuccess(null);

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crm-migration-request`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchantId,
            sourceCrm,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to request migration');
      }

      const result = await response.json();
      setSuccess(result.message);
      await loadData();
    } catch (error: any) {
      setError(error.message || 'Failed to request migration');
    }
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 animate-spin text-gray-600" />
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Integration</h1>
            <p className="text-gray-600 mt-1">Connect your preferred CRM system and manage lead flow</p>
          </div>
        </div>

        {error && (
          <Card variant="bordered" className="bg-red-50 border-red-200">
            <CardBody>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardBody>
          </Card>
        )}

        {success && (
          <Card variant="bordered" className="bg-green-50 border-green-200">
            <CardBody>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">{success}</p>
              </div>
            </CardBody>
          </Card>
        )}

        <Card variant="bordered">
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Your CRM System
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleSavePreferences('locallink')}
                disabled={saving}
                className={`p-6 rounded-lg border-2 transition-all ${
                  preferences?.primary_crm === 'locallink'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Local Link CRM</h3>
                  {preferences?.primary_crm === 'locallink' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Built-in CRM with automatic lead capture from marketplace
                </p>
                <div className="text-2xl font-bold text-gray-900">$99/mo</div>
              </button>

              <button
                onClick={() => handleSavePreferences('adsuite')}
                disabled={saving}
                className={`p-6 rounded-lg border-2 transition-all ${
                  preferences?.primary_crm === 'adsuite'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">AdSuite CRM</h3>
                  {preferences?.primary_crm === 'adsuite' && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Marketing & print services CRM
                </p>
                <div className="text-2xl font-bold text-gray-900">$149/mo</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://www.adsuitecrm.com', '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit AdSuite
                </Button>
              </button>

              <button
                onClick={() => handleSavePreferences('tradehive')}
                disabled={saving}
                className={`p-6 rounded-lg border-2 transition-all ${
                  preferences?.primary_crm === 'tradehive'
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">TradeHive CRM</h3>
                  {preferences?.primary_crm === 'tradehive' && (
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Home services & trades CRM
                </p>
                <div className="text-2xl font-bold text-gray-900">$99/mo</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://www.tradehivecrm.com', '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit TradeHive
                </Button>
              </button>
            </div>
          </CardBody>
        </Card>

        {(preferences?.primary_crm === 'adsuite' || preferences?.primary_crm === 'tradehive') && (
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Leads to CSV
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600 mb-4">
                Export your marketplace leads to a CSV file and import them into your {
                  preferences.primary_crm === 'adsuite' ? 'AdSuite' : 'TradeHive'
                } CRM manually. We're working on direct integration!
              </p>
              <Button
                onClick={() => handleExportCSV(preferences.primary_crm as 'adsuite' | 'tradehive')}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export to CSV
                  </>
                )}
              </Button>

              {exports.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Recent Exports</h3>
                  <div className="space-y-2">
                    {exports.slice(0, 5).map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <span className="text-sm font-medium">{exp.lead_count} leads</span>
                          <span className="text-xs text-gray-500 ml-3">
                            {new Date(exp.exported_at || exp.id).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          exp.export_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-200'
                        }`}>
                          {exp.export_status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Done-For-You CRM Migration
            </h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700 mb-4">
              Let our AI-powered migration bot automatically migrate your existing CRM data to Local Link CRM.
              Our bots are trained to handle AdSuite and TradeHive data formats.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold mb-2">Migrate from AdSuite</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Export your data from AdSuite and we'll handle the rest
                </p>
                <Button
                  variant="outline"
                  onClick={() => handleRequestMigration('adsuite')}
                >
                  Request Migration
                </Button>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-semibold mb-2">Migrate from TradeHive</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Export your data from TradeHive and we'll handle the rest
                </p>
                <Button
                  variant="outline"
                  onClick={() => handleRequestMigration('tradehive')}
                >
                  Request Migration
                </Button>
              </div>
            </div>

            {migrations.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Migration Requests</h3>
                <div className="space-y-2">
                  {migrations.map((mig) => (
                    <div key={mig.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <span className="text-sm font-medium">From {mig.source_crm}</span>
                        {mig.total_records > 0 && (
                          <span className="text-xs text-gray-500 ml-3">
                            {mig.migrated_records}/{mig.total_records} records migrated
                          </span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        mig.migration_status === 'completed' ? 'bg-green-100 text-green-800' :
                        mig.migration_status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {mig.migration_status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}
