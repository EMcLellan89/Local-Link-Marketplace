import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MerchantOnboardingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [step, setStep] = useState<string>("welcome");
  const [data, setData] = useState<any>({});

  const [industry, setIndustry] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [primaryOffer, setPrimaryOffer] = useState("");
  const [brandTone, setBrandTone] = useState("friendly");

  const [channels, setChannels] = useState<any>({
    facebook: true,
    instagram: true,
    gbp: true,
    email: true,
    sms: false,
  });

  const [referralProgram, setReferralProgram] = useState<any>({
    reward_type: "credit",
    reward_value: 25,
    reward_value_unit: "USD",
    reward_trigger: "purchase",
    status: "active",
  });

  const firstCampaignOptions = useMemo(
    () => [
      { id: "reactivation", title: "Customer Reactivation Program™", objective: "reactivation" },
      { id: "reviews", title: "Review Growth & Protection Program™", objective: "reviews" },
      { id: "visibility", title: "Local Visibility Booster Program™", objective: "seasonal" },
    ],
    []
  );
  const [firstCampaign, setFirstCampaign] = useState(firstCampaignOptions[0].id);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch("/api/onboarding/status");
        const j = await r.json();
        if (!j.ok) throw new Error("Failed to load onboarding");
        const ob = j.onboarding;

        setStep(ob.step || "welcome");
        setData(ob.data || {});

        const d = ob.data || {};
        setIndustry(d.industry || "");
        setServiceArea(d.service_area || "");
        setPrimaryOffer(d.primary_offer || "");
        setBrandTone(d.brand_tone || "friendly");
        setChannels(d.channels || channels);
        setReferralProgram(d.referral_program || referralProgram);
        setFirstCampaign(d.first_campaign || firstCampaignOptions[0].id);
      } catch (e: any) {
        alert(e.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveStep = async (nextStep: string, completed = false) => {
    setSaving(true);
    try {
      const payload = {
        step: nextStep,
        completed,
        data: {
          industry,
          service_area: serviceArea,
          primary_offer: primaryOffer,
          brand_tone: brandTone,
          channels,
          referral_program: referralProgram,
          first_campaign: firstCampaign,
        },
      };

      const r = await fetch("/api/onboarding/save-step", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!j.ok) throw new Error("Save failed");

      setStep(nextStep);
      setData(payload.data);
    } catch (e: any) {
      alert(e.message || "Save error");
    } finally {
      setSaving(false);
    }
  };

  const next = async () => {
    const order = ["welcome", "business", "channels", "referrals", "first_campaign", "finish"];
    const idx = order.indexOf(step);
    const nextStep = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : "finish";
    await saveStep(nextStep, nextStep === "finish");
  };

  const back = async () => {
    const order = ["welcome", "business", "channels", "referrals", "first_campaign", "finish"];
    const idx = order.indexOf(step);
    const prevStep = idx > 0 ? order[idx - 1] : "welcome";
    await saveStep(prevStep, false);
  };

  const installFirstCampaign = async () => {
    const r = await fetch(`/api/dfy/campaigns?objective=${encodeURIComponent(mapFirstCampaignToObjective(firstCampaign))}`);
    const j = await r.json();
    if (!j.ok) return;

    const c = (j.campaigns || [])[0];
    if (!c?.id) return;

    await fetch("/api/dfy/install-campaign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        dfy_campaign_id: c.id,
        variables: {
          offer: primaryOffer,
          service_area: serviceArea,
          tone: brandTone,
          channels,
        },
      }),
    });
  };

  const finish = async () => {
    await installFirstCampaign();
    await saveStep("finish", true);
    navigate("/merchant/dfy");
  };

  if (loading) return <div className="p-5">Loading onboarding…</div>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-2">Merchant Onboarding</h1>
      <p className="text-gray-600">
        Answer a few questions. We'll install your first campaign and turn on referrals.
      </p>

      <Progress step={step} />

      <div className="border border-gray-200 rounded-xl p-4 mt-4">
        {step === "welcome" && (
          <>
            <h2 className="text-xl font-bold mt-0">Welcome</h2>
            <p className="text-gray-600">
              This setup takes about 3 minutes. You'll leave with:
              <br />• A referral program active
              <br />• A DFY campaign installed
              <br />• Your channels configured
            </p>
          </>
        )}

        {step === "business" && (
          <>
            <h2 className="text-xl font-bold mt-0">Business basics</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-semibold mb-1">Industry</span>
                <select className="w-full px-3 py-2 border rounded" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="">Select…</option>
                  <option value="trades">Trades</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="medspa">Med Spa</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="pet">Pet</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-semibold mb-1">Service area (towns/zip)</span>
                <input className="w-full px-3 py-2 border rounded" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="e.g., Marlboro + 15mi" />
              </label>
              <label className="block col-span-2">
                <span className="block text-sm font-semibold mb-1">Primary offer (what should we promote?)</span>
                <input className="w-full px-3 py-2 border rounded" value={primaryOffer} onChange={(e) => setPrimaryOffer(e.target.value)} placeholder="e.g., $25 off first service" />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold mb-1">Brand tone</span>
                <select className="w-full px-3 py-2 border rounded" value={brandTone} onChange={(e) => setBrandTone(e.target.value)}>
                  <option value="friendly">Friendly</option>
                  <option value="direct">Direct</option>
                  <option value="luxury">Luxury</option>
                  <option value="funny">Funny</option>
                </select>
              </label>
            </div>
          </>
        )}

        {step === "channels" && (
          <>
            <h2 className="text-xl font-bold mt-0">Choose channels</h2>
            <p className="text-gray-600 mt-0">We'll tailor your DFY campaigns to the channels you enable.</p>
            <Toggle label="Facebook" value={!!channels.facebook} onChange={(v) => setChannels({ ...channels, facebook: v })} />
            <Toggle label="Instagram" value={!!channels.instagram} onChange={(v) => setChannels({ ...channels, instagram: v })} />
            <Toggle label="Google Business Profile" value={!!channels.gbp} onChange={(v) => setChannels({ ...channels, gbp: v })} />
            <Toggle label="Email follow-up" value={!!channels.email} onChange={(v) => setChannels({ ...channels, email: v })} />
            <Toggle label="SMS follow-up" value={!!channels.sms} onChange={(v) => setChannels({ ...channels, sms: v })} />
          </>
        )}

        {step === "referrals" && (
          <>
            <h2 className="text-xl font-bold mt-0">Turn on Customer Referral Engine™</h2>
            <p className="text-gray-600 mt-0">
              We'll create share links + QR codes and track rewards automatically.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm font-semibold mb-1">Reward type</span>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={referralProgram.reward_type}
                  onChange={(e) => setReferralProgram({ ...referralProgram, reward_type: e.target.value })}
                >
                  <option value="credit">Store credit</option>
                  <option value="discount">Discount</option>
                  <option value="free_item">Free item</option>
                  <option value="cash">Cash</option>
                  <option value="custom">Custom</option>
                </select>
              </label>

              <label className="block">
                <span className="block text-sm font-semibold mb-1">Reward value</span>
                <input
                  className="w-full px-3 py-2 border rounded"
                  type="number"
                  value={referralProgram.reward_value}
                  onChange={(e) => setReferralProgram({ ...referralProgram, reward_value: Number(e.target.value) })}
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold mb-1">Trigger</span>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={referralProgram.reward_trigger}
                  onChange={(e) => setReferralProgram({ ...referralProgram, reward_trigger: e.target.value })}
                >
                  <option value="lead">Lead</option>
                  <option value="booking">Booking</option>
                  <option value="purchase">Purchase</option>
                  <option value="custom">Custom</option>
                </select>
              </label>

              <label className="block">
                <span className="block text-sm font-semibold mb-1">Status</span>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={referralProgram.status}
                  onChange={(e) => setReferralProgram({ ...referralProgram, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </label>
            </div>

            <div className="mt-3 p-3 border border-gray-200 rounded-lg">
              <div className="font-bold">What customers will see</div>
              <div className="text-gray-600 mt-2">
                "Share your link. When your friend becomes a customer, you earn{" "}
                <b>{referralProgram.reward_type === "credit" ? `$${referralProgram.reward_value} credit` : "a reward"}</b>."
              </div>
            </div>
          </>
        )}

        {step === "first_campaign" && (
          <>
            <h2 className="text-xl font-bold mt-0">Install your first DFY campaign</h2>
            <p className="text-gray-600 mt-0">
              We'll install a campaign and prefill it with your offer + service area.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {firstCampaignOptions.map((c) => (
                <label key={c.id} className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-gray-400">
                  <input
                    type="radio"
                    name="first_campaign"
                    checked={firstCampaign === c.id}
                    onChange={() => setFirstCampaign(c.id)}
                  />{" "}
                  <b>{c.title}</b>
                  <div className="text-gray-600 mt-2">
                    Objective: {c.objective} • Uses: {channels.email ? "Email" : ""} {channels.sms ? "SMS" : ""}{" "}
                    {channels.facebook ? "FB" : ""} {channels.instagram ? "IG" : ""} {channels.gbp ? "GBP" : ""}
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {step === "finish" && (
          <>
            <h2 className="text-xl font-bold mt-0">All set</h2>
            <p className="text-gray-600">
              You're ready. Next we'll take you to the DFY Library so you can install more campaigns and posts.
            </p>
          </>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 border rounded" disabled={saving || step === "welcome"} onClick={back}>
          Back
        </button>

        {step !== "finish" ? (
          <button className="px-4 py-2 bg-black text-white rounded" disabled={saving} onClick={next}>
            {saving ? "Saving…" : "Next"}
          </button>
        ) : (
          <button className="px-4 py-2 bg-black text-white rounded" disabled={saving} onClick={finish}>
            {saving ? "Finishing…" : "Go to DFY Library"}
          </button>
        )}
      </div>

      <div className="mt-5 p-3 border border-gray-100 rounded-lg text-gray-600 text-sm">
        <b>Partner attribution enforcement:</b> Every partner-sold product/checkout must include{" "}
        <b>Referral Name</b> + <b>Referral ID</b>. You already added this on partner flows; keep it consistent on:
        <ul className="mt-2 ml-4 list-disc">
          <li>Merchant plan purchases</li>
          <li>DFY add-ons</li>
          <li>Any marketplace product sold by a partner</li>
        </ul>
      </div>
    </div>
  );
}

function mapFirstCampaignToObjective(id: string) {
  if (id === "reactivation") return "reactivation";
  if (id === "reviews") return "reviews";
  return "seasonal";
}

function Progress({ step }: { step: string }) {
  const steps = [
    ["welcome", "Welcome"],
    ["business", "Business"],
    ["channels", "Channels"],
    ["referrals", "Referrals"],
    ["first_campaign", "First campaign"],
    ["finish", "Finish"],
  ];

  return (
    <div className="flex gap-3 flex-wrap mt-4">
      {steps.map(([k, label]) => (
        <div
          key={k}
          className={`px-3 py-1 rounded-full border text-xs font-bold ${
            k === step ? "bg-black text-white border-black" : "bg-transparent text-gray-700 border-gray-300"
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 mt-2 cursor-pointer">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span className="font-bold">{label}</span>
    </label>
  );
}
