import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BusinessHubLayout from "../../components/layout/BusinessHubLayout";
import StatusTimeline from "../../components/dfy/StatusTimeline";

interface Order {
  id: string;
  product_slug: string;
  status: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  due_at: string | null;
}

export default function DFYOrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!orderId) return;
    loadOrder();
  }, [orderId]);

  async function loadOrder() {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dfy-order-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        }
      );
      const json = await res.json();
      if (json.order) {
        setOrder(json.order);
        setTasks(json.tasks || []);
      }
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="max-w-3xl mx-auto px-4 py-10 text-gray-600">Loading…</div>
      </BusinessHubLayout>
    );
  }

  if (!order) {
    return (
      <BusinessHubLayout>
        <div className="max-w-3xl mx-auto px-4 py-10">Order not found.</div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="border rounded-2xl p-6 bg-white">
          <h1 className="text-2xl font-semibold">Setup Status</h1>
          <p className="mt-2 text-gray-600">
            Order <span className="font-mono text-xs">{order.id}</span>
          </p>

          <div className="mt-6">
            <StatusTimeline status={order.status} />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">What we're doing</h2>
            <div className="mt-3 space-y-2">
              {tasks.length === 0 ? (
                <div className="text-gray-600">
                  Your build is queued. Tasks will appear shortly.
                </div>
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className="border rounded-2xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-gray-500">Status: {t.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="font-medium">Need help?</div>
            <div className="text-gray-600 mt-1">
              Reply to your confirmation email or contact support in your dashboard.
            </div>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
