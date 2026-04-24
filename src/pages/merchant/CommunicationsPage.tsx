import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, MessageSquare, Mail, History, Settings, User, Clock, CheckCircle, XCircle, PhoneCall, Send, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface CallLog {
  id: string;
  lead_id: string;
  direction: string;
  from_number: string;
  to_number: string;
  status: string;
  duration_seconds: number;
  created_at: string;
}

interface SMSLog {
  id: string;
  lead_id: string;
  direction: string;
  from_number: string;
  to_number: string;
  body: string;
  status: string;
  created_at: string;
}

interface EmailLog {
  id: string;
  lead_id: string;
  from_email: string;
  to_email: string;
  subject: string;
  status: string;
  opened_at: string | null;
  created_at: string;
}

export default function CommunicationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [merchant, setMerchant] = useState<any>(null);
  const [phoneConfig, setPhoneConfig] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'call' | 'sms' | 'email' | 'history'>('call');
  const [loading, setLoading] = useState(true);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
    if (searchParams.get('success') === 'true' || searchParams.get('activated') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [user, searchParams]);

  async function loadData() {
    try {
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (merchantData) {
        setMerchant(merchantData);

        const { data: subscriptionData } = await supabase
          .from('communications_subscriptions')
          .select('*')
          .eq('entity_type', 'merchant')
          .eq('entity_id', merchantData.id)
          .maybeSingle();

        setSubscription(subscriptionData);

        const { data: config } = await supabase
          .from('comm_configurations')
          .select('*')
          .eq('merchant_id', merchantData.id)
          .maybeSingle();

        setPhoneConfig(config);

        const { data: leadsData } = await supabase
          .from('crm_leads')
          .select('*')
          .eq('merchant_id', merchantData.id)
          .order('created_at', { ascending: false })
          .limit(50);

        setLeads(leadsData || []);

        loadHistory(merchantData.id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory(merchantId: string) {
    const { data: calls } = await supabase
      .from('comm_call_logs')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: sms } = await supabase
      .from('comm_sms_logs')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: emails } = await supabase
      .from('comm_email_logs')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(50);

    setCallLogs(calls || []);
    setSmsLogs(sms || []);
    setEmailLogs(emails || []);
  }

  async function handleMakeCall() {
    if (!merchant || !phoneNumber) {
      setMessage('Please enter a phone number');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/twilio-make-call`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchantId: merchant.id,
            toNumber: phoneNumber,
            leadId: selectedLead?.id,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setMessage('Call initiated successfully!');
      setPhoneNumber('');
      loadHistory(merchant.id);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  }

  async function handleSendSMS() {
    if (!merchant || !phoneNumber || !smsBody) {
      setMessage('Please enter phone number and message');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/twilio-send-sms`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchantId: merchant.id,
            toNumber: phoneNumber,
            body: smsBody,
            leadId: selectedLead?.id,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setMessage('SMS sent successfully!');
      setPhoneNumber('');
      setSmsBody('');
      loadHistory(merchant.id);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  }

  async function handleSendEmail() {
    if (!merchant || !emailTo || !emailSubject || !emailBody) {
      setMessage('Please fill in all email fields');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/twilio-send-email`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchantId: merchant.id,
            toEmail: emailTo,
            subject: emailSubject,
            bodyText: emailBody,
            leadId: selectedLead?.id,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setMessage('Email sent successfully!');
      setEmailTo('');
      setEmailSubject('');
      setEmailBody('');
      loadHistory(merchant.id);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSending(false);
    }
  }

  function selectLead(lead: Lead) {
    setSelectedLead(lead);
    setPhoneNumber(lead.phone);
    setEmailTo(lead.email);
  }

  if (loading) {
    return (
      <DashboardLayout role="merchant">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!phoneConfig?.is_active) {
    return (
      <DashboardLayout role="merchant">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardBody className="text-center py-12">
              <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Communications Hub Not Active
              </h2>
              <p className="text-gray-600 mb-6">
                Enable the Communications Hub to unlock VoIP calling, SMS messaging, and email campaigns.
                Prepay a minimum of $50 to get started.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/merchant/communications/activate')}>
                  <Phone className="w-4 h-4 mr-2" />
                  Activate Communications
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="merchant">
      <div className="space-y-6">
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Communications Services Activated!</p>
                <p className="text-sm text-green-700">Your account has been funded and services are ready to use.</p>
              </div>
            </div>
          </div>
        )}

        {phoneConfig && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Prepaid Balance</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ${((phoneConfig.balance_cents || 0) / 100).toFixed(2)}
                  </p>
                  {(phoneConfig.balance_cents || 0) < 1000 && (
                    <p className="text-sm text-orange-700 mt-1">
                      Low balance - Add funds to continue using services
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/merchant/communications/activate')}
              >
                Add Funds
              </Button>
            </div>
          </div>
        )}

        {!subscription || subscription.status === 'inactive' ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 text-lg mb-2">Activate Communications Services</h3>
                <p className="text-blue-700 mb-4">
                  Unlock VoIP calling and email marketing to connect with your customers.
                  Pay only for what you use with flexible monthly billing.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/merchant/communications/checkout?type=voip')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    Activate VoIP ($10/user/month)
                  </button>
                  <button
                    onClick={() => navigate('/merchant/communications/checkout?type=email')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Activate Email (from $25/month)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : subscription.status === 'active' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Active Services</p>
                  <div className="text-sm text-green-700 flex gap-4 mt-1">
                    {subscription.voip_enabled && (
                      <span>VoIP: {subscription.voip_user_count} user{subscription.voip_user_count > 1 ? 's' : ''} (${(subscription.voip_monthly_cost_cents / 100).toFixed(2)}/mo)</span>
                    )}
                    {subscription.email_enabled && (
                      <span>Email: {subscription.email_tier === 'tier1' ? 'Starter' : 'Professional'} (${(subscription.email_monthly_cost_cents / 100).toFixed(2)}/mo)</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/merchant/communications/checkout')}
                className="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Manage Services
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communications Hub</h1>
            <p className="text-gray-600 mt-1">
              Call, text, and email your leads directly from Local-Link CRM
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/merchant/vapi/configure')}>
              <Phone className="w-4 h-4 mr-2" />
              Configure AI Voice
            </Button>
            <Button variant="outline" onClick={() => navigate('/merchant/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Leads
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {leads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => selectLead(lead)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedLead?.id === lead.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-600">{lead.company}</div>
                    <div className="text-xs text-gray-500 mt-1">{lead.phone}</div>
                  </button>
                ))}
                {leads.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No leads yet</p>
                )}
              </div>
            </CardBody>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex space-x-4 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('call')}
                    className={`pb-3 px-4 font-medium flex items-center ${
                      activeTab === 'call'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </button>
                  <button
                    onClick={() => setActiveTab('sms')}
                    className={`pb-3 px-4 font-medium flex items-center ${
                      activeTab === 'sms'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    SMS
                  </button>
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`pb-3 px-4 font-medium flex items-center ${
                      activeTab === 'email'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 px-4 font-medium flex items-center ${
                      activeTab === 'history'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </button>
                </div>
              </CardHeader>
              <CardBody>
                {activeTab === 'call' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1234567890"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <Button
                      onClick={handleMakeCall}
                      disabled={sending || !phoneNumber}
                      className="w-full"
                    >
                      <PhoneCall className="w-4 h-4 mr-2" />
                      {sending ? 'Calling...' : 'Make Call'}
                    </Button>
                  </div>
                )}

                {activeTab === 'sms' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1234567890"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={smsBody}
                        onChange={(e) => setSmsBody(e.target.value)}
                        rows={4}
                        placeholder="Enter your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {smsBody.length} / 160 characters
                      </p>
                    </div>
                    <Button
                      onClick={handleSendSMS}
                      disabled={sending || !phoneNumber || !smsBody}
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {sending ? 'Sending...' : 'Send SMS'}
                    </Button>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Email
                      </label>
                      <input
                        type="email"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="contact@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Email subject"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        rows={6}
                        placeholder="Enter your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <Button
                      onClick={handleSendEmail}
                      disabled={sending || !emailTo || !emailSubject || !emailBody}
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {sending ? 'Sending...' : 'Send Email'}
                    </Button>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recent Calls</h4>
                      <div className="space-y-2">
                        {callLogs.slice(0, 5).map((call) => (
                          <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {call.direction === 'inbound' ? call.from_number : call.to_number}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {call.direction} • {call.duration_seconds}s
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              call.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {call.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recent SMS</h4>
                      <div className="space-y-2">
                        {smsLogs.slice(0, 5).map((sms) => (
                          <div key={sms.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">
                                  {sms.direction === 'inbound' ? sms.from_number : sms.to_number}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">{sms.direction}</span>
                            </div>
                            <p className="text-sm text-gray-700">{sms.body}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recent Emails</h4>
                      <div className="space-y-2">
                        {emailLogs.slice(0, 5).map((email) => (
                          <div key={email.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{email.to_email}</span>
                              </div>
                              {email.opened_at && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-700">{email.subject}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {message && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {message}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
