import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Copy, Check, Printer, Mail, MessageSquare } from 'lucide-react';
import QRCode from 'react-qr-code';

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function makeCode(): string {
  return Math.random().toString(16).slice(2, 8).toUpperCase();
}

export default function ReferralPrintCards() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareCode, setShareCode] = useState('');
  const [program, setProgram] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const headline = useMemo(() => {
    if (!program) return 'Refer & Earn';
    return program.program_name || 'Refer & Earn';
  }, [program]);

  const rewardLine = useMemo(() => {
    if (!program) return '';
    return `You earn ${formatCurrency(program.reward_value_cents)} • Your friend gets ${formatCurrency(program.referee_incentive_value_cents)}`;
  }, [program]);

  async function generateCard() {
    if (!user || !email.trim()) return;

    setLoading(true);
    try {
      const { data: programData, error: programError } = await supabase
        .from('customer_referral_programs')
        .select('*')
        .eq('merchant_id', user.id)
        .maybeSingle();

      if (programError) throw programError;
      if (!programData?.is_enabled) {
        alert('Referral program is not enabled');
        return;
      }

      const customerEmail = email.trim().toLowerCase();
      const customerName = fullName.trim() || null;

      const { data: customerData, error: customerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .maybeSingle();

      let customerId: string;

      if (customerData) {
        customerId = customerData.id;
      } else {
        const { data: newCustomer, error: createError } = await supabase.auth.signUp({
          email: customerEmail,
          password: Math.random().toString(36).slice(-12),
          options: {
            data: {
              full_name: customerName,
              role: 'customer'
            }
          }
        });

        if (createError) throw createError;
        if (!newCustomer.user) throw new Error('Failed to create customer');

        customerId = newCustomer.user.id;
      }

      const { data: existingLink, error: linkCheckError } = await supabase
        .from('customer_referral_links')
        .select('share_code')
        .eq('merchant_id', user.id)
        .eq('customer_id', customerId)
        .maybeSingle();

      if (linkCheckError && linkCheckError.code !== 'PGRST116') throw linkCheckError;

      let code = existingLink?.share_code;

      if (!code) {
        for (let i = 0; i < 10; i++) {
          const newCode = makeCode();
          const { data: newLink, error: insertError } = await supabase
            .from('customer_referral_links')
            .insert({
              merchant_id: user.id,
              customer_id: customerId,
              share_code: newCode
            })
            .select('share_code')
            .single();

          if (!insertError) {
            code = newLink.share_code;
            break;
          }
        }
      }

      if (!code) throw new Error('Failed to generate share code');

      const url = `${window.location.origin}/r/${programData.landing_slug}?ref=${code}`;

      setShareUrl(url);
      setShareCode(code);
      setProgram(programData);

    } catch (error: any) {
      console.error('Error generating card:', error);
      alert(error.message || 'Failed to generate card');
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function openPrint(size: '5x7' | 'letter') {
    if (!shareUrl) return;
    const url = `/merchant/referrals/cards/print/${size}?share_url=${encodeURIComponent(shareUrl)}&headline=${encodeURIComponent(headline)}&reward=${encodeURIComponent(rewardLine)}`;
    window.open(url, '_blank');
  }

  async function emailCustomer() {
    if (!email.trim()) {
      alert('Please enter customer email first.');
      return;
    }

    setEmailLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-referral-email`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            full_name: fullName,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send email');

      alert('Email sent successfully!');

      if (result.share_url && result.share_code) {
        setShareUrl(result.share_url);
        setShareCode(result.share_code);
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      alert(error.message || 'Failed to send email');
    } finally {
      setEmailLoading(false);
    }
  }

  async function smsCustomer() {
    if (!phone.trim()) {
      alert('Please enter customer phone number first.');
      return;
    }

    if (!smsConsent) {
      alert('Please confirm customer has consented to receive SMS.');
      return;
    }

    setSmsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-referral-sms`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            full_name: fullName,
            phone: phone,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send SMS');

      alert('SMS sent successfully!');

      if (result.share_url && result.share_code) {
        setShareUrl(result.share_url);
        setShareCode(result.share_code);
      }
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      alert(error.message || 'Failed to send SMS');
    } finally {
      setSmsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/merchant/referrals')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Printable Referral QR Cards</h1>
              <p className="text-gray-600 mt-2">
                Generate a customer's personal referral link, then print a 5x7 card or an 8.5x11 sheet.
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer name (optional)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer phone (for SMS)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+16175551234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="mt-1 text-xs text-gray-500">E.164 format or 10 digits (US)</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="smsConsent"
                checked={smsConsent}
                onChange={(e) => setSmsConsent(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="smsConsent" className="text-sm text-gray-700">
                Customer has consented to receive SMS messages
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <button
                onClick={generateCard}
                disabled={loading || !email.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate card'}
              </button>

              <button
                onClick={emailCustomer}
                disabled={emailLoading || !email.trim()}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4 mr-2" />
                {emailLoading ? 'Sending...' : 'Email customer'}
              </button>

              <button
                onClick={smsCustomer}
                disabled={smsLoading || !phone.trim() || !smsConsent}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {smsLoading ? 'Sending...' : 'Text customer (SMS)'}
              </button>
            </div>
          </div>

          {shareUrl ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-sm text-gray-500">Share code</div>
                <div className="mt-1 font-mono text-sm">{shareCode}</div>

                <div className="mt-3 text-sm text-gray-500">Share link</div>
                <div className="mt-1 break-all font-medium">{shareUrl}</div>

                <div className="mt-3 flex flex-col md:flex-row gap-2">
                  <button
                    onClick={() => copyText(shareUrl)}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy link
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => copyText(`${headline}\n${rewardLine}\n${shareUrl}`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Copy text
                  </button>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium mb-2">QR preview</div>
                  <div className="inline-flex bg-white border border-gray-200 rounded-lg p-4">
                    <QRCode value={shareUrl} size={180} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openPrint('5x7')}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print 5x7
                  </button>
                  <button
                    onClick={() => openPrint('letter')}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print 8.5x11
                  </button>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Tip: In the print dialog, choose <strong>Save as PDF</strong> to download and reuse.
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="font-semibold mb-3">Design preview</div>
                <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                  <div className="text-xl font-bold text-gray-900">{headline}</div>
                  <div className="mt-1 text-sm text-gray-700">{rewardLine}</div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <QRCode value={shareUrl} size={120} />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Scan to claim your perk</div>
                      <div className="text-gray-600 mt-1">Or visit the link:</div>
                      <div className="break-all text-gray-800 text-xs mt-1">{shareUrl}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    Local-Link powered referral program
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-gray-600">
              Generate a customer card above to see the QR + print templates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
