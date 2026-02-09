import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { RefreshCw, DollarSign } from "lucide-react";

type Row = {
  id: string;
  recipient_partner_id: string;
  order_id: string | null;
  stripe_invoice_id: string;
  event_type: string;
  amount_gross_cents: number;
  commission_rate_bps: number;
  commission_owed_cents: number;
  status: string;
  created_at: string;
};

export default function AdminCommissionsPage() {
  const [status, setStatus] = useState("owed");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("commission_ledger")
        .select("id, recipient_partner_id, order_id, stripe_invoice_id, event_type, amount_gross_cents, commission_rate_bps, commission_owed_cents, status, created_at")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load commissions:", error);
        setRows([]);
      } else {
        setRows(data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  const total = useMemo(
    () => rows.reduce((sum, r) => sum + r.commission_owed_cents, 0),
    [rows]
  );

  async function runPayouts() {
    if (!confirm("Run payouts for all owed commissions? This will create Stripe transfers.")) {
      return;
    }

    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-run-payouts", {
        body: { run_type: "manual", notes: "Admin payout run" },
      });

      if (error) {
        alert(`Payout run failed: ${error.message}`);
      } else if (data?.error) {
        alert(`Payout run failed: ${data.error}`);
      } else {
        alert("Payout run completed successfully!");
        await load();
      }
    } catch (err: any) {
      alert(`Payout run failed: ${err.message}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="border rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Commissions
            </h1>
            <p className="mt-1 text-gray-600">Auto-created from Stripe invoice events.</p>
          </div>
          <button
            onClick={runPayouts}
            disabled={running || status !== "owed" || rows.length === 0}
            className="rounded-xl bg-black text-white px-4 py-2 font-medium disabled:opacity-60 flex items-center gap-2"
          >
            {running ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running payouts…
              </>
            ) : (
              "Run payouts now"
            )}
          </button>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-xl px-4 py-3 md:w-60"
          >
            <option value="owed">Owed</option>
            <option value="paid">Paid</option>
            <option value="void">Void</option>
          </select>
          <button
            onClick={load}
            className="rounded-xl border px-4 py-3 font-medium md:w-40 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <div className="md:ml-auto text-sm text-gray-700">
            Total: <span className="font-semibold text-lg">${(total / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4">Recipient</th>
                <th className="py-2 pr-4">Invoice</th>
                <th className="py-2 pr-4">Gross</th>
                <th className="py-2 pr-4">Rate</th>
                <th className="py-2 pr-4">Owed</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-gray-600">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-gray-600">
                    No rows.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-3 pr-4 text-gray-600">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">
                      {r.recipient_partner_id.slice(0, 8)}…
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">{r.stripe_invoice_id}</td>
                    <td className="py-3 pr-4">${(r.amount_gross_cents / 100).toFixed(2)}</td>
                    <td className="py-3 pr-4">{(r.commission_rate_bps / 100).toFixed(2)}%</td>
                    <td className="py-3 pr-4 font-semibold">
                      ${(r.commission_owed_cents / 100).toFixed(2)}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
