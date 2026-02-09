import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { RefreshCw } from "lucide-react";

type Order = {
  id: string;
  product_slug: string;
  status: string;
  user_id: string;
  created_at: string;
  stripe_subscription_id?: string | null;
};

const STATUSES = ["all", "new", "onboarding", "queued", "in_progress", "live", "paused", "canceled"];

export default function AdminDFYOrdersPage() {
  const [status, setStatus] = useState("queued");
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      let query = supabase
        .from("dfy_orders")
        .select("id, product_slug, status, user_id, created_at, stripe_subscription_id")
        .order("created_at", { ascending: false });

      if (status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      } else {
        setOrders(data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  const filtered = useMemo(() => {
    if (!q.trim()) return orders;
    const t = q.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(t) ||
        o.product_slug.toLowerCase().includes(t) ||
        o.user_id.toLowerCase().includes(t) ||
        o.status.toLowerCase().includes(t)
    );
  }, [orders, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="border rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">DFY Fulfillment</h1>
            <p className="text-gray-600 mt-1">Track and manage Done For You installs.</p>
          </div>

          <button
            onClick={load}
            className="rounded-xl bg-black text-white px-4 py-2 font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-xl px-4 py-3 md:w-1/4"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by order ID, product slug, user id…"
            className="border rounded-xl px-4 py-3 w-full"
          />
        </div>

        <div className="mt-6 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2 pr-4">Created</th>
                <th className="py-2 pr-4">Order</th>
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Merchant</th>
                <th className="py-2 pr-4">Subscription</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-6 text-gray-600" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="py-6 text-gray-600" colSpan={6}>
                    No orders.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="py-3 pr-4 text-gray-600">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        className="font-medium underline hover:text-blue-600"
                        to={`/admin/dfy/orders/${o.id}`}
                      >
                        {o.id.slice(0, 8)}…
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{o.product_slug}</td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">{o.user_id}</td>
                    <td className="py-3 pr-4 font-mono text-xs">
                      {o.stripe_subscription_id ?? "—"}
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
