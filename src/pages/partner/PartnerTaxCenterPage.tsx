import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import {
  FileText, DollarSign, Download, Calendar, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, Info
} from "lucide-react";

type TaxReport = {
  id: string;
  tax_year: number;
  total_earned_cents: number;
  total_paid_cents: number;
  total_withheld_cents: number;
  report_url: string | null;
  form_1099_url: string | null;
  created_at: string;
};

type Payout = {
  id: string;
  amount_cents: number;
  status: string;
  paid_at: string | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
};

type QualityScore = {
  score: number;
  refunds: number;
  chargebacks: number;
  violations: number;
};

function formatCents(c: number) {
  return `$${(c / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const THRESHOLD_1099 = 60000; // $600 in cents

export default function PartnerTaxCenterPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [taxReports, setTaxReports] = useState<TaxReport[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [quality, setQuality] = useState<QualityScore | null>(null);
  const [currentYearEarned, setCurrentYearEarned] = useState(0);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  async function loadData() {
    setLoading(true);
    try {
      const { data: partner } = await supabase
        .from("partners").select("id").eq("user_id", user!.id).maybeSingle();
      if (!partner) return;
      setPartnerId(partner.id);

      const [taxRes, payoutRes, qualityRes] = await Promise.all([
        supabase.from("partner_tax_reports").select("*").eq("partner_id", partner.id).order("tax_year", { ascending: false }),
        supabase.from("partner_payouts").select("*").eq("partner_id", partner.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("partner_quality_scores").select("score,refunds,chargebacks,violations").eq("partner_id", partner.id).maybeSingle(),
      ]);

      if (taxRes.data) setTaxReports(taxRes.data as TaxReport[]);
      if (payoutRes.data) {
        setPayouts(payoutRes.data as Payout[]);
        const currentYear = new Date().getFullYear();
        const ytd = (payoutRes.data as Payout[])
          .filter(p => p.status === "paid" && p.paid_at && new Date(p.paid_at).getFullYear() === currentYear)
          .reduce((s, p) => s + (p.amount_cents ?? 0), 0);
        setCurrentYearEarned(ytd);
      }
      if (qualityRes.data) setQuality(qualityRes.data as QualityScore);
    } finally {
      setLoading(false);
    }
  }

  const currentReport = taxReports.find(r => r.tax_year === selectedYear);
  const years = Array.from(new Set([new Date().getFullYear(), ...taxReports.map(r => r.tax_year)])).sort((a, b) => b - a);
  const needs1099 = currentYearEarned >= THRESHOLD_1099;
  const payoutsForYear = payouts.filter(p => {
    const year = p.paid_at ? new Date(p.paid_at).getFullYear() : (p.created_at ? new Date(p.created_at).getFullYear() : 0);
    return year === selectedYear && p.status === "paid";
  });
  const yearTotal = payoutsForYear.reduce((s, p) => s + (p.amount_cents ?? 0), 0);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Loading tax center…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Center</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Your year-end earnings summary, payout history, and 1099 documents.
          </p>
        </div>
      </div>

      {/* 1099 Notice */}
      {needs1099 && (
        <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">You may receive a 1099-NEC this year</p>
            <p className="text-sm text-yellow-700 mt-1">
              You have earned {formatCents(currentYearEarned)} so far this year. Partners who earn $600 or more
              in a calendar year may receive a Form 1099-NEC. Consult a tax professional for guidance.
            </p>
          </div>
        </div>
      )}

      {/* YTD Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">YTD Earnings</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{formatCents(currentYearEarned)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{new Date().getFullYear()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">Paid Payouts</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {payouts.filter(p => p.status === "paid").length}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">All time</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">Quality Score</p>
          <p className={`text-xl font-bold mt-1 ${
            (quality?.score ?? 100) >= 80 ? "text-emerald-600"
            : (quality?.score ?? 100) >= 60 ? "text-yellow-600" : "text-red-600"
          }`}>
            {quality?.score ?? 100}/100
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Partner standing</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium">1099 Threshold</p>
          <p className="text-xl font-bold text-gray-900 mt-1">$600</p>
          <p className={`text-xs mt-0.5 ${needs1099 ? "text-yellow-600 font-medium" : "text-gray-400"}`}>
            {needs1099 ? "Threshold reached" : "Not yet reached"}
          </p>
        </div>
      </div>

      {/* Quality breakdown */}
      {quality && (quality.refunds > 0 || quality.chargebacks > 0 || quality.violations > 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" /> Quality Score Breakdown
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{quality.refunds}</p>
              <p className="text-xs text-gray-500 mt-0.5">Refunds</p>
              <p className="text-xs text-red-600 font-medium">-5 pts each</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-700">{quality.chargebacks}</p>
              <p className="text-xs text-gray-500 mt-0.5">Chargebacks</p>
              <p className="text-xs text-red-700 font-medium">-10 pts each</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{quality.violations}</p>
              <p className="text-xs text-gray-500 mt-0.5">Violations</p>
              <p className="text-xs text-orange-600 font-medium">-15 pts each</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-3">
            A quality score below 60 may trigger a commission hold review. Contact support to dispute any items.
          </p>
        </div>
      )}

      {/* Year selector + Tax documents */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Tax Documents</h3>
          <div className="flex gap-2">
            {years.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedYear === y ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {currentReport ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Total Earned</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{formatCents(currentReport.total_earned_cents)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Total Paid</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{formatCents(currentReport.total_paid_cents)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Withheld</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{formatCents(currentReport.total_withheld_cents)}</p>
                </div>
              </div>

              <div className="space-y-2">
                {currentReport.report_url && (
                  <a
                    href={currentReport.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedYear} Earnings Summary</p>
                        <p className="text-xs text-gray-500">Annual partner earnings report</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </a>
                )}
                {currentReport.form_1099_url && (
                  <a
                    href={currentReport.form_1099_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Form 1099-NEC ({selectedYear})</p>
                        <p className="text-xs text-gray-500">Nonemployee compensation form</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                  </a>
                )}
                {!currentReport.report_url && !currentReport.form_1099_url && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Documents for {selectedYear} will be available after year-end processing (typically January 31).
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {selectedYear === new Date().getFullYear()
                  ? `No tax documents yet for ${selectedYear}. Your year-end summary will be generated after December 31.`
                  : `No tax records found for ${selectedYear}.`}
              </p>
              {selectedYear === new Date().getFullYear() && currentYearEarned > 0 && (
                <p className="text-sm text-gray-700 mt-2 font-medium">
                  Current YTD: {formatCents(currentYearEarned)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payout history */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Payout History — {selectedYear}</h3>
          {yearTotal > 0 && (
            <span className="text-sm font-semibold text-gray-900">{formatCents(yearTotal)} total</span>
          )}
        </div>

        {payoutsForYear.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {payoutsForYear.map(p => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatCents(p.amount_cents)}</p>
                  {(p.period_start || p.period_end) && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.period_start ? new Date(p.period_start).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                      {p.period_start && p.period_end ? " – " : ""}
                      {p.period_end ? new Date(p.period_end).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" /> Paid
                  </span>
                  {p.paid_at && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(p.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center">
            <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No paid payouts recorded for {selectedYear}.</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="border border-gray-200 rounded-xl p-4 flex gap-3 bg-gray-50">
        <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600">
          This page displays estimated earnings and payout records. It is not tax advice.
          Consult a qualified tax professional regarding your reporting obligations.
          Form 1099-NEC is issued to partners who earn $600 or more in a calendar year.
        </p>
      </div>
    </div>
  );
}
