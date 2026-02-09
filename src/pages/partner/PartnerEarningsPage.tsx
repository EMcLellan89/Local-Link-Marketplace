import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { DollarSign, TrendingUp, Clock, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";

type Row = {
  id: string;
  stripe_invoice_id: string;
  commission_rate_bps: number;
  commission_owed_cents: number;
  status: string;
  created_at: string;
  paid_at: string | null;
};

type ConnectStatus = {
  has_account: boolean;
  details_submitted: boolean;
  payouts_enabled: boolean;
  charges_enabled: boolean;
};

export default function PartnerEarningsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null);
  const [settingUpConnect, setSettingUpConnect] = useState(false);

  async function load() {
    if (!user?.id) return;

    setLoading(true);
    try {
      // First, get partner record for this user
      const { data: partner } = await supabase
        .from("partners")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!partner) {
        setRows([]);
        setLoading(false);
        return;
      }

      // Get commission ledger
      const { data, error } = await supabase
        .from("commission_ledger")
        .select("id, stripe_invoice_id, commission_rate_bps, commission_owed_cents, status, created_at, paid_at")
        .eq("recipient_partner_id", partner.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load earnings:", error);
        setRows([]);
      } else {
        setRows(data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadConnectStatus() {
    try {
      const { data, error } = await supabase.functions.invoke("partner-get-connect-status", {
        method: "GET",
      });

      if (error) {
        console.error("Failed to load connect status:", error);
      } else if (data) {
        setConnectStatus(data);
      }
    } catch (err) {
      console.error("Error loading connect status:", err);
    }
  }

  async function setupStripeConnect() {
    setSettingUpConnect(true);
    try {
      const { data, error } = await supabase.functions.invoke("partner-setup-stripe-connect", {
        method: "POST",
      });

      if (error) {
        alert(`Failed to set up payouts: ${error.message}`);
      } else if (data?.error) {
        alert(`Failed to set up payouts: ${data.error}`);
      } else if (data?.onboarding_url) {
        window.location.href = data.onboarding_url;
      }
    } finally {
      setSettingUpConnect(false);
    }
  }

  useEffect(() => {
    if (user?.id) {
      load();
      loadConnectStatus();
    }
  }, [user?.id]);

  const totals = useMemo(() => {
    let owed = 0,
      paid = 0;
    for (const r of rows) {
      if (r.status === "owed") owed += r.commission_owed_cents;
      if (r.status === "paid") paid += r.commission_owed_cents;
    }
    return { owed, paid };
  }, [rows]);

  const needsPayoutSetup = connectStatus && (!connectStatus.has_account || !connectStatus.payouts_enabled);
  const payoutReady = connectStatus?.has_account && connectStatus?.payouts_enabled;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="border rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-semibold">Earnings</h1>
            <p className="mt-1 text-gray-600">
              Your commissions from DFY sales you referred.
            </p>
          </div>
        </div>

        {needsPayoutSetup && totals.owed > 0 && (
          <div className="mt-6 border-2 border-orange-200 rounded-2xl p-5 bg-orange-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Payout Setup Required</h3>
                <p className="text-sm text-orange-700 mt-1">
                  You have ${(totals.owed / 100).toFixed(2)} in pending commissions.
                  Set up your payout account to receive automatic weekly transfers via Stripe Connect.
                </p>
                <button
                  onClick={setupStripeConnect}
                  disabled={settingUpConnect}
                  className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                >
                  {settingUpConnect ? "Setting up..." : "Set Up Payouts Now"}
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {payoutReady && (
          <div className="mt-6 border border-green-200 rounded-2xl p-4 bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">
                Payout account active • Automatic weekly transfers enabled
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="border rounded-2xl p-4 bg-yellow-50">
            <div className="flex items-center gap-2 text-sm text-yellow-700">
              <Clock className="w-4 h-4" />
              Pending Payout
            </div>
            <div className="text-3xl font-semibold mt-2 text-yellow-900">
              ${(totals.owed / 100).toFixed(2)}
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Paid out weekly via Stripe Connect
            </p>
          </div>

          <div className="border rounded-2xl p-4 bg-green-50">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <TrendingUp className="w-4 h-4" />
              Total Paid
            </div>
            <div className="text-3xl font-semibold mt-2 text-green-900">
              ${(totals.paid / 100).toFixed(2)}
            </div>
            <p className="text-xs text-green-600 mt-1">
              Lifetime earnings transferred
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Commission History</h2>

          {loading ? (
            <div className="text-gray-600">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="border rounded-2xl p-8 text-center">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No earnings yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Share your DFY tracking links to start earning commissions
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Invoice</th>
                    <th className="py-2 pr-4">Rate</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-3 pr-4 text-gray-600">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs">
                        {r.stripe_invoice_id}
                      </td>
                      <td className="py-3 pr-4">
                        {(r.commission_rate_bps / 100).toFixed(2)}%
                      </td>
                      <td className="py-3 pr-4 font-semibold">
                        ${(r.commission_owed_cents / 100).toFixed(2)}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            r.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : r.status === "owed"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-600 text-xs">
                        {r.paid_at ? new Date(r.paid_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
