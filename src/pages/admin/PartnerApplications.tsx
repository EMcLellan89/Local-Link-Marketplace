import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Application {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  partner_type: string;
  requested_territory: string;
  current_coverage: string | null;
  est_merchants_30d: number | null;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export default function PartnerApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('partner_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setApplications(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (app: Application) => {
    const tempPassword = window.prompt(
      `Set temporary password for ${app.email}:`,
      'ChangeMe123!'
    );

    if (!tempPassword) return;

    if (!window.confirm(`Approve ${app.company_name} for ${app.requested_territory}?`)) return;

    setProcessing(app.id);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-application-approve`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          application_id: app.id,
          temp_password: tempPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Approval failed' }));
        throw new Error(errorData.error || 'Approval failed');
      }

      await loadApplications();
      alert('Partner approved successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleDecline = async (app: Application) => {
    const reason = window.prompt(`Decline reason for ${app.company_name}:`);
    if (!reason?.trim()) return;

    if (!window.confirm(`Decline ${app.company_name}?`)) return;

    setProcessing(app.id);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-application-decline`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          application_id: app.id,
          reason
        })
      });

      if (!response.ok) throw new Error('Decline failed');

      await loadApplications();
      alert('Application declined.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleWaitlist = async (app: Application) => {
    const reason = window.prompt(`Waitlist reason for ${app.company_name}:`, 'Territory unavailable');
    if (!reason?.trim()) return;

    setProcessing(app.id);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('partner_applications')
        .update({
          status: 'Waitlisted',
          admin_notes: reason
        })
        .eq('id', app.id);

      if (updateError) throw updateError;

      await loadApplications();
      alert('Application moved to waitlist.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: any }> = {
      New: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
      Reviewing: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      Approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Declined: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      Waitlisted: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Clock }
    };

    const style = styles[status] || styles.New;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Partner Applications</h1>
        <p className="text-gray-600">
          Review and approve partners for territory-based rollout. Territory availability checked automatically.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6 mb-6">
        <Card className="p-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {applications.filter(a => a.status === 'New').length}
              </div>
              <div className="text-sm text-gray-600">New</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                {applications.filter(a => a.status === 'Reviewing').length}
              </div>
              <div className="text-sm text-gray-600">Reviewing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {applications.filter(a => a.status === 'Approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {applications.filter(a => a.status === 'Waitlisted').length}
              </div>
              <div className="text-sm text-gray-600">Waitlisted</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{app.company_name}</h3>
                  {getStatusBadge(app.status)}
                </div>
                <div className="text-sm text-gray-600">
                  Applied {new Date(app.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Contact:</span> {app.contact_name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{' '}
                    <a href={`mailto:${app.email}`} className="text-blue-600 hover:underline">
                      {app.email}
                    </a>
                  </div>
                  {app.phone && (
                    <div>
                      <span className="font-medium">Phone:</span> {app.phone}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Type:</span> {app.partner_type}
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Requested Territory:</span>{' '}
                    <span className="text-lg font-semibold text-blue-600">
                      {app.requested_territory}
                    </span>
                  </div>
                  {app.est_merchants_30d && (
                    <div>
                      <span className="font-medium">Est. Merchants (30d):</span>{' '}
                      {app.est_merchants_30d}
                    </div>
                  )}
                  {app.current_coverage && (
                    <div>
                      <span className="font-medium">Current Coverage:</span>
                      <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                        {app.current_coverage}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {app.notes && (
              <div className="mb-4">
                <div className="font-medium text-sm mb-1">Notes:</div>
                <div className="p-3 bg-gray-50 rounded text-sm">{app.notes}</div>
              </div>
            )}

            {app.admin_notes && (
              <div className="mb-4">
                <div className="font-medium text-sm mb-1 text-red-600">Admin Notes:</div>
                <div className="p-3 bg-red-50 rounded text-sm">{app.admin_notes}</div>
              </div>
            )}

            {(app.status === 'New' || app.status === 'Reviewing') && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleApprove(app)}
                  disabled={processing === app.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>

                <Button
                  onClick={() => handleWaitlist(app)}
                  disabled={processing === app.id}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Waitlist
                </Button>

                <Button
                  onClick={() => handleDecline(app)}
                  disabled={processing === app.id}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            )}
          </Card>
        ))}

        {applications.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-2">
              <AlertCircle className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600">No applications yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
