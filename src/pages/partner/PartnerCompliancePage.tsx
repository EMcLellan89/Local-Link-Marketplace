import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import {
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle,
  FileText, ExternalLink, Lock
} from "lucide-react";

type ComplianceRecord = {
  id: string;
  agreed_to_terms: boolean;
  agreed_at: string | null;
  violations: number;
  status: string;
  last_violation_at: string | null;
  violation_notes: string | null;
};

const ALLOWED: { icon: typeof CheckCircle2; text: string }[] = [
  { icon: CheckCircle2, text: "Share approved referral links" },
  { icon: CheckCircle2, text: "Share approved organic posts on social media" },
  { icon: CheckCircle2, text: "Send direct messages using approved scripts" },
  { icon: CheckCircle2, text: "Invite businesses to learn more" },
  { icon: CheckCircle2, text: "Share approved QR codes" },
  { icon: CheckCircle2, text: "Refer merchants, partners, and customers" },
  { icon: CheckCircle2, text: "Earn commissions on eligible sales" },
];

const NOT_ALLOWED: { text: string }[] = [
  { text: "Run paid ads on any platform for any Local-Link product" },
  { text: "Boost posts or create paid campaigns" },
  { text: "Modify pricing or make pricing guarantees" },
  { text: "Promise guaranteed income or business results" },
  { text: "Make tax, legal, or financial guarantees" },
  { text: "Claim to be an employee of Local-Link" },
  { text: "Use unapproved claims or screenshots" },
  { text: "Spam businesses or consumers" },
  { text: "Sell 1Hub CRM or CPA products without the required certification" },
];

const AGREEMENT_ITEMS = [
  "I understand I cannot run paid ads for Local-Link or any related business.",
  "I understand all paid ads are run only by Local-Link from their official accounts.",
  "I understand I may share approved organic content only.",
  "I understand commissions may be adjusted for refunds, chargebacks, ad spend, or violations.",
  "I agree to promote Local-Link products honestly and in accordance with approved training.",
];

const STATUS_COLOR: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  warned: "bg-yellow-100 text-yellow-700",
  restricted: "bg-orange-100 text-orange-700",
  suspended: "bg-red-100 text-red-700",
  banned: "bg-gray-100 text-gray-700",
};

export default function PartnerCompliancePage() {
  const { user } = useAuth();
  const [compliance, setCompliance] = useState<ComplianceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(AGREEMENT_ITEMS.map(() => false));
  const [partnerId, setPartnerId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) loadCompliance();
  }, [user?.id]);

  async function loadCompliance() {
    setLoading(true);
    try {
      const { data: partner } = await supabase
        .from("partners").select("id").eq("user_id", user!.id).maybeSingle();
      if (!partner) return;
      setPartnerId(partner.id);

      const { data } = await supabase
        .from("partner_compliance").select("*").eq("partner_id", partner.id).maybeSingle();
      if (data) {
        setCompliance(data);
        if (data.agreed_to_terms) setChecks(AGREEMENT_ITEMS.map(() => true));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAgree() {
    if (!partnerId || !checks.every(Boolean)) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("partner_compliance")
        .upsert({
          partner_id: partnerId,
          agreed_to_terms: true,
          agreed_at: new Date().toISOString(),
          status: "active",
          updated_at: new Date().toISOString(),
        }, { onConflict: "partner_id" })
        .select()
        .maybeSingle();
      if (!error && data) setCompliance(data);
    } finally {
      setSaving(false);
    }
  }

  const allChecked = checks.every(Boolean);
  const isAgreed = compliance?.agreed_to_terms === true;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading compliance center…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Compliance Center</h1>
          <p className="text-gray-500 mt-1">
            Read the rules, agree to the terms, and keep your account in good standing.
          </p>
        </div>
        {compliance && (
          <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[compliance.status] ?? "bg-gray-100 text-gray-600"}`}>
            {compliance.status}
          </span>
        )}
      </div>

      {/* Violation alert */}
      {compliance && compliance.violations > 0 && (
        <div className="border border-red-200 rounded-xl p-4 bg-red-50 flex gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">
              {compliance.violations} compliance violation{compliance.violations !== 1 ? "s" : ""} recorded
            </p>
            {compliance.violation_notes && (
              <p className="text-sm text-red-700 mt-1">{compliance.violation_notes}</p>
            )}
            <p className="text-xs text-red-600 mt-1">
              Contact support if you believe this is in error.
            </p>
          </div>
        </div>
      )}

      {/* Agreement status */}
      {isAgreed && (
        <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-800">Compliance agreement signed</p>
            {compliance?.agreed_at && (
              <p className="text-xs text-emerald-600 mt-0.5">
                Agreed {new Date(compliance.agreed_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Paid Advertising Rule — most important */}
      <div className="border-2 border-gray-900 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-gray-900" />
          <h2 className="font-bold text-gray-900 text-lg">Paid Advertising Rule</h2>
        </div>
        <p className="text-gray-700 font-medium mb-3">
          All paid advertising is managed by Local-Link Marketplace only.
        </p>
        <p className="text-sm text-gray-600">
          Partners may not run paid ads for Local-Link, 1Hub CRM, 1Hub CPA, AI tools, merchant offers,
          community visibility products, or any Local-Link-owned business — from personal Facebook pages,
          business pages, ad accounts, boosted posts, or any third-party ad platform.
        </p>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700">Want a paid campaign?</p>
          <p className="text-sm text-gray-600 mt-1">
            Partners may prepay ad budget. Local-Link runs the campaign from the official account with your
            slug attached so all leads and sales are attributed to you.
          </p>
        </div>
      </div>

      {/* What you can and cannot do */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50">
          <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> What Partners May Do
          </h3>
          <ul className="space-y-2">
            {ALLOWED.map(({ text }) => (
              <li key={text} className="flex items-start gap-2 text-sm text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-600" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-red-200 rounded-xl p-5 bg-red-50">
          <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> What Partners May Not Do
          </h3>
          <ul className="space-y-2">
            {NOT_ALLOWED.map(({ text }) => (
              <li key={text} className="flex items-start gap-2 text-sm text-red-800">
                <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-500" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Income disclaimer */}
      <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-800">Income Disclaimer</h3>
        </div>
        <p className="text-sm text-gray-600">
          Partner earnings are not guaranteed. Earnings depend on effort, sales activity, market demand,
          product fit, compliance, and customer retention. Do not promise prospects specific income amounts
          from the partner program.
        </p>
      </div>

      {/* 1Hub Certification Requirement */}
      <div className="border border-blue-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-blue-900">1Hub CRM / CPA Certification Requirement</h3>
        </div>
        <p className="text-sm text-gray-600">
          Partners must complete the required certification track before selling 1Hub CRM or CPA products.
          Partners may not promise tax outcomes, savings, IRS approvals, refunds, or legal or accounting results
          to prospects.
        </p>
      </div>

      {/* Commission protection */}
      <div className="border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-800 mb-2">Commission Adjustments</h3>
        <p className="text-sm text-gray-600 mb-2">
          Commissions may be held, reversed, or adjusted for:
        </p>
        <div className="flex flex-wrap gap-2">
          {["Refunds","Chargebacks","Fraud","Policy violations","Attribution disputes","Unpaid balances"].map(item => (
            <span key={item} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Agreement section */}
      {!isAgreed && (
        <div className="border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Agreement Confirmation</h3>
          <div className="space-y-3 mb-6">
            {AGREEMENT_ITEMS.map((item, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={e => {
                    const next = [...checks];
                    next[i] = e.target.checked;
                    setChecks(next);
                  }}
                  className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{item}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleAgree}
            disabled={!allChecked || saving}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700
              disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving…" : "I Agree — Activate My Partner Account"}
          </button>
          {!allChecked && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Check all boxes above to continue.
            </p>
          )}
        </div>
      )}

      {isAgreed && (
        <div className="text-center">
          <a
            href="/partner/certifications"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            View your certifications and unlock selling rights
          </a>
        </div>
      )}
    </div>
  );
}
