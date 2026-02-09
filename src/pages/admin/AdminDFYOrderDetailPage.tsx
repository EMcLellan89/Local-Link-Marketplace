import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ArrowLeft, RefreshCw } from "lucide-react";

const ORDER_STATUSES = ["new", "onboarding", "queued", "in_progress", "live", "paused", "canceled"];
const TASK_STATUSES = ["todo", "doing", "blocked", "done"];

type Order = {
  id: string;
  product_slug: string;
  status: string;
  user_id: string;
  created_at: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  referral_partner_link_slug?: string | null;
  referral_source?: string | null;
};

type Task = {
  id: string;
  title: string;
  status: string;
  assignee?: string | null;
  due_at?: string | null;
  created_at: string;
};

export default function AdminDFYOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [onboarding, setOnboarding] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savingStatus, setSavingStatus] = useState(false);

  async function load() {
    if (!orderId) return;
    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("dfy_orders")
        .select(
          "id, user_id, product_slug, status, created_at, stripe_customer_id, stripe_subscription_id, referral_partner_link_slug, referral_source"
        )
        .eq("id", orderId)
        .maybeSingle();

      if (orderError || !orderData) {
        console.error("Failed to load order:", orderError);
        setOrder(null);
        setLoading(false);
        return;
      }

      setOrder(orderData);

      const { data: onboardingData } = await supabase
        .from("dfy_onboarding")
        .select("answers, submitted_at")
        .eq("order_id", orderId)
        .maybeSingle();

      setOnboarding(onboardingData ?? null);

      const { data: tasksData } = await supabase
        .from("dfy_fulfillment_tasks")
        .select("id, title, status, assignee, due_at, created_at")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

      setTasks(tasksData ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [orderId]);

  async function updateOrderStatus(next: string) {
    if (!orderId) return;
    setSavingStatus(true);
    try {
      const { error } = await supabase
        .from("dfy_orders")
        .update({ status: next })
        .eq("id", orderId);

      if (error) {
        console.error("Failed to update status:", error);
      } else {
        await load();
      }
    } finally {
      setSavingStatus(false);
    }
  }

  async function updateTask(taskId: string, patch: { status?: string; assignee?: string }) {
    const { error } = await supabase
      .from("dfy_fulfillment_tasks")
      .update(patch)
      .eq("id", taskId);

    if (error) {
      console.error("Failed to update task:", error);
    } else {
      await load();
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-gray-600">Loading…</div>
    );
  }

  if (!order) {
    return <div className="max-w-5xl mx-auto px-4 py-10">Order not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        to="/admin/dfy/orders"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="border rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Order {order.id.slice(0, 8)}…</h1>
            <div className="mt-2 text-gray-700">
              Product: <span className="font-medium">{order.product_slug}</span>
            </div>
            <div className="mt-1 text-gray-600 text-sm">
              Created: {new Date(order.created_at).toLocaleString()}
            </div>
            <div className="mt-1 text-gray-600 text-sm">
              Merchant: <span className="font-mono text-xs">{order.user_id}</span>
            </div>
            <div className="mt-1 text-gray-600 text-sm">
              Sub:{" "}
              <span className="font-mono text-xs">
                {order.stripe_subscription_id ?? "—"}
              </span>
            </div>
            <div className="mt-1 text-gray-600 text-sm">
              Referral:{" "}
              <span className="font-mono text-xs">
                {order.referral_partner_link_slug ?? "—"}
              </span>{" "}
              ({order.referral_source ?? "—"})
            </div>
          </div>

          <div className="border rounded-2xl p-4 w-full md:w-80">
            <div className="text-sm text-gray-500">Order Status</div>
            <select
              className="mt-2 w-full border rounded-xl px-3 py-2"
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={savingStatus}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-gray-500">
              Changing status updates the merchant status page.
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="border rounded-2xl p-4">
            <h2 className="font-semibold">Onboarding / Intake</h2>
            {!onboarding ? (
              <div className="mt-2 text-gray-600">No intake submitted yet.</div>
            ) : (
              <pre className="mt-3 text-xs bg-gray-50 border rounded-xl p-3 overflow-auto max-h-96">
                {JSON.stringify(onboarding, null, 2)}
              </pre>
            )}
          </div>

          <div className="border rounded-2xl p-4">
            <h2 className="font-semibold">Fulfillment Tasks</h2>
            <div className="mt-3 space-y-3">
              {tasks.length === 0 ? (
                <div className="text-gray-600">
                  No tasks yet. (They are auto-created after first invoice is paid.)
                </div>
              ) : (
                tasks.map((t) => (
                  <div key={t.id} className="border rounded-2xl p-3">
                    <div className="font-medium">{t.title}</div>
                    <div className="mt-2 flex flex-col md:flex-row gap-2 md:items-center">
                      <select
                        className="border rounded-xl px-3 py-2 md:w-40"
                        value={t.status}
                        onChange={(e) => updateTask(t.id, { status: e.target.value })}
                      >
                        {TASK_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <input
                        className="border rounded-xl px-3 py-2 w-full"
                        placeholder="Assignee (email or name)"
                        value={t.assignee ?? ""}
                        onChange={(e) => updateTask(t.id, { assignee: e.target.value })}
                      />

                      <div className="text-xs text-gray-500 md:ml-auto whitespace-nowrap">
                        Due: {t.due_at ? new Date(t.due_at).toLocaleString() : "—"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={load}
              className="mt-4 rounded-xl bg-black text-white px-4 py-2 font-medium flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
