import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import BusinessHubLayout from "../../components/layout/BusinessHubLayout";
import { supabase } from "../../lib/supabase";

export default function DFYOnboardingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");

  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState({
    business_name: "",
    main_phone: "",
    website: "",
    services: "",
    service_area: "",
    booking_link: "",
    hours: "",
  });

  useEffect(() => {
    if (!orderId) return;
  }, [orderId]);

  if (!orderId) {
    return (
      <BusinessHubLayout>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="border rounded-2xl p-6 bg-white">
            <h1 className="text-2xl font-semibold">Missing order</h1>
            <p className="mt-2 text-gray-600">
              We couldn't find your orderId. Please return to the tool page and try again.
            </p>
          </div>
        </div>
      </BusinessHubLayout>
    );
  }

  async function submit() {
    if (!orderId) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to continue");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dfy-onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          answers,
        }),
      });

      const json = await res.json();
      if (json.ok) {
        navigate(`/merchant/done-for-you/orders/${orderId}`);
      } else {
        alert(json.error || "Could not submit intake");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred during submission");
    } finally {
      setSaving(false);
    }
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="border rounded-2xl p-6 bg-white">
          <h1 className="text-2xl font-semibold">Quick setup intake</h1>
          <p className="mt-2 text-gray-600">
            This takes about 3–5 minutes. We use this to launch{" "}
            <span className="font-medium">{slug}</span> fast.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              className="border rounded-xl px-4 py-3"
              placeholder="Business name"
              value={answers.business_name}
              onChange={(e) => setAnswers({ ...answers, business_name: e.target.value })}
            />
            <input
              className="border rounded-xl px-4 py-3"
              placeholder="Main phone number"
              value={answers.main_phone}
              onChange={(e) => setAnswers({ ...answers, main_phone: e.target.value })}
            />
            <input
              className="border rounded-xl px-4 py-3"
              placeholder="Website URL"
              value={answers.website}
              onChange={(e) => setAnswers({ ...answers, website: e.target.value })}
            />
            <textarea
              className="border rounded-xl px-4 py-3"
              placeholder="Services (comma separated)"
              rows={3}
              value={answers.services}
              onChange={(e) => setAnswers({ ...answers, services: e.target.value })}
            />
            <input
              className="border rounded-xl px-4 py-3"
              placeholder="Service area (towns/zip codes)"
              value={answers.service_area}
              onChange={(e) => setAnswers({ ...answers, service_area: e.target.value })}
            />
            <input
              className="border rounded-xl px-4 py-3"
              placeholder="Booking link (Calendly / etc.)"
              value={answers.booking_link}
              onChange={(e) => setAnswers({ ...answers, booking_link: e.target.value })}
            />
            <textarea
              className="border rounded-xl px-4 py-3"
              placeholder="Business hours"
              rows={2}
              value={answers.hours}
              onChange={(e) => setAnswers({ ...answers, hours: e.target.value })}
            />
          </div>

          <button
            onClick={submit}
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-black text-white py-3 font-medium disabled:opacity-60 hover:bg-gray-800 transition-colors"
          >
            {saving ? "Submitting…" : "Submit intake & start setup"}
          </button>
        </div>
      </div>
    </BusinessHubLayout>
  );
}
