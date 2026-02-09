import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';

interface ReferralVerificationProps {
  onVerified?: (data: {
    referralName: string;
    referralId: string;
    partnerId: string | null;
    grantsLifetimeFree: boolean;
  }) => void;
}

export default function ReferralVerification({ onVerified }: ReferralVerificationProps) {
  const [searchParams] = useSearchParams();

  const [wasReferred, setWasReferred] = useState(false);
  const [referralName, setReferralName] = useState('');
  const [referralId, setReferralId] = useState('');
  const [refVerified, setRefVerified] = useState(false);
  const [refVerifyMsg, setRefVerifyMsg] = useState('');
  const [refGrantsLifetime, setRefGrantsLifetime] = useState(false);
  const [refPartnerDisplay, setRefPartnerDisplay] = useState('');
  const [refPartnerId, setRefPartnerId] = useState<string | null>(null);
  const [verifyingRef, setVerifyingRef] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  useEffect(() => {
    const refSlug = searchParams.get('ref');
    if (refSlug) {
      setWasReferred(true);
      setAutoFilled(true);
      verifyReferralBySlug(refSlug);
    }
  }, [searchParams]);

  useEffect(() => {
    if (refVerified && onVerified) {
      onVerified({
        referralName,
        referralId,
        partnerId: refPartnerId,
        grantsLifetimeFree: refGrantsLifetime,
      });
    }
  }, [refVerified, referralName, referralId, refPartnerId, refGrantsLifetime, onVerified]);

  async function verifyReferralBySlug(refSlug: string) {
    setVerifyingRef(true);
    setRefVerifyMsg('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/referral-resolve?ref=${encodeURIComponent(refSlug)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.ok && data.verified) {
        setRefVerified(true);
        setReferralName(data.referral.referral_name || '');
        setReferralId(String(data.referral.referral_id || ''));
        setRefGrantsLifetime(data.referral.grants_lifetime_free || false);
        setRefPartnerDisplay(data.partner?.display_name || '');
        setRefPartnerId(data.referral.partner_id || null);
        setRefVerifyMsg('');
      } else {
        setRefVerified(false);
        setRefVerifyMsg(data.error || 'Referral not verified');
      }
    } catch (err: any) {
      setRefVerified(false);
      setRefVerifyMsg(err.message || 'Failed to verify referral');
    } finally {
      setVerifyingRef(false);
    }
  }

  async function verifyReferralManual() {
    if (!referralId) {
      setRefVerifyMsg('Please enter Referral ID#');
      return;
    }

    setVerifyingRef(true);
    setRefVerifyMsg('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/referral-resolve?referral_id=${encodeURIComponent(referralId)}&referral_name=${encodeURIComponent(referralName)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.ok && data.verified) {
        setRefVerified(true);
        setReferralName(data.referral.referral_name || referralName);
        setReferralId(String(data.referral.referral_id || ''));
        setRefGrantsLifetime(data.referral.grants_lifetime_free || false);
        setRefPartnerDisplay(data.partner?.display_name || '');
        setRefPartnerId(data.referral.partner_id || null);
        setRefVerifyMsg('');
      } else {
        setRefVerified(false);
        setRefVerifyMsg(data.error || 'Invalid referral');
      }
    } catch (err: any) {
      setRefVerified(false);
      setRefVerifyMsg(err.message || 'Failed to verify referral');
    } finally {
      setVerifyingRef(false);
    }
  }

  return (
    <div className="border-t border-slate-200 pt-4">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={wasReferred}
            onChange={(e) => {
              setWasReferred(e.target.checked);
              if (!e.target.checked) {
                setReferralName('');
                setReferralId('');
                setRefVerified(false);
                setRefVerifyMsg('');
                setRefPartnerId(null);
                setRefGrantsLifetime(false);
              }
            }}
            disabled={autoFilled}
            className="mr-2 h-4 w-4 text-[#2BB673] focus:ring-[#2BB673] border-slate-300 rounded"
          />
          <span className="text-sm font-medium text-slate-700">
            I was referred by a Partner
          </span>
        </label>
      </div>

      {wasReferred && (
        <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
          {!autoFilled ? (
            <>
              <Input
                type="text"
                label="Referral Name"
                placeholder="e.g., John Smith"
                value={referralName}
                onChange={(e) => setReferralName(e.target.value)}
              />
              <Input
                type="number"
                label="Referral ID#"
                placeholder="e.g., 3817"
                value={referralId}
                onChange={(e) => setReferralId(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={verifyReferralManual}
                disabled={verifyingRef || !referralId}
                fullWidth
              >
                {verifyingRef ? 'Verifying...' : 'Verify Referral'}
              </Button>
            </>
          ) : (
            <div className="text-sm text-slate-600">
              <div><strong>Referral Name:</strong> {referralName}</div>
              <div><strong>Referral ID#:</strong> {referralId}</div>
            </div>
          )}

          {refVerified && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded">
              <CheckCircle className="w-4 h-4" />
              <span>✓ Verified{refPartnerDisplay ? ` - ${refPartnerDisplay}` : ''}</span>
            </div>
          )}

          {!refVerified && refVerifyMsg && (
            <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded">
              <XCircle className="w-4 h-4" />
              <span>{refVerifyMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Export getter functions for parent components
  return {
    component: (
      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={wasReferred}
              onChange={(e) => {
                setWasReferred(e.target.checked);
                if (!e.target.checked) {
                  setReferralName('');
                  setReferralId('');
                  setRefVerified(false);
                  setRefVerifyMsg('');
                  setRefPartnerId(null);
                  setRefGrantsLifetime(false);
                }
              }}
              disabled={autoFilled}
              className="mr-2 h-4 w-4 text-[#2BB673] focus:ring-[#2BB673] border-slate-300 rounded"
            />
            <span className="text-sm font-medium text-slate-700">
              I was referred by a Partner
            </span>
          </label>
        </div>

        {wasReferred && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
            {!autoFilled ? (
              <>
                <Input
                  type="text"
                  label="Referral Name"
                  placeholder="e.g., John Smith"
                  value={referralName}
                  onChange={(e) => setReferralName(e.target.value)}
                />
                <Input
                  type="number"
                  label="Referral ID#"
                  placeholder="e.g., 3817"
                  value={referralId}
                  onChange={(e) => setReferralId(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={verifyReferralManual}
                  disabled={verifyingRef || !referralId}
                  fullWidth
                >
                  {verifyingRef ? 'Verifying...' : 'Verify Referral'}
                </Button>
              </>
            ) : (
              <div className="text-sm text-slate-600">
                <div><strong>Referral Name:</strong> {referralName}</div>
                <div><strong>Referral ID#:</strong> {referralId}</div>
              </div>
            )}

            {refVerified && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded">
                <CheckCircle className="w-4 h-4" />
                <span>✓ Verified{refPartnerDisplay ? ` - ${refPartnerDisplay}` : ''}</span>
              </div>
            )}

            {!refVerified && refVerifyMsg && (
              <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded">
                <XCircle className="w-4 h-4" />
                <span>{refVerifyMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>
    ),
    getReferralData: () => ({
      wasReferred,
      referralName,
      referralId,
      refVerified,
      partnerId: refPartnerId,
      grantsLifetimeFree: refGrantsLifetime,
    }),
  };
}
