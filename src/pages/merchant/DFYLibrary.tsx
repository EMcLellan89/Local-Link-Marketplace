import React, { useEffect, useState } from "react";

export default function DFYLibraryPage() {
  const [packs, setPacks] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [my, setMy] = useState<any>({ campaigns: [], content: [] });

  const [industry, setIndustry] = useState<string>("");
  const [objective, setObjective] = useState<string>("");

  const load = async () => {
    const [p, c, m] = await Promise.all([
      fetch(`/api/dfy/packs${industry ? `?industry=${encodeURIComponent(industry)}` : ""}`).then((x) => x.json()),
      fetch(`/api/dfy/campaigns${objective ? `?objective=${encodeURIComponent(objective)}` : ""}`).then((x) => x.json()),
      fetch(`/api/dfy/my-installs`).then((x) => x.json()),
    ]);
    if (p.ok) setPacks(p.packs || []);
    if (c.ok) setCampaigns(c.campaigns || []);
    if (m.ok) setMy(m);
  };

  useEffect(() => {
    load();
  }, [industry, objective]);

  const installCampaign = async (id: string) => {
    const r = await fetch("/api/dfy/install-campaign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dfy_campaign_id: id, variables: {} }),
    });
    const j = await r.json();
    if (!j.ok) return alert("Install failed");
    load();
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-2">DFY Content & Campaign Library</h1>
      <p className="text-gray-600">
        Install proven campaigns in one click. Everything is prewritten and editable.
      </p>

      <div className="flex gap-3 flex-wrap mt-3">
        <select className="px-3 py-2 border rounded" value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="">All industries</option>
          <option value="trades">Trades</option>
          <option value="cleaning">Cleaning</option>
          <option value="medspa">Med Spa</option>
          <option value="restaurant">Restaurant</option>
          <option value="pet">Pet</option>
          <option value="other">Other</option>
        </select>

        <select className="px-3 py-2 border rounded" value={objective} onChange={(e) => setObjective(e.target.value)}>
          <option value="">All objectives</option>
          <option value="leads">Leads</option>
          <option value="bookings">Bookings</option>
          <option value="reviews">Reviews</option>
          <option value="reactivation">Reactivation</option>
          <option value="referrals">Referrals</option>
          <option value="seasonal">Seasonal</option>
        </select>

        <button className="px-4 py-2 bg-black text-white rounded" onClick={load}>Refresh</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="font-bold mb-3">Campaigns</div>
          {campaigns.length === 0 ? (
            <div className="text-gray-600">No campaigns found.</div>
          ) : (
            <div className="grid gap-3">
              {campaigns.map((c) => (
                <div key={c.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="font-bold">{c.title}</div>
                  <div className="text-gray-600 mt-2 text-sm">
                    {c.industry || "All"} • {c.objective}
                  </div>
                  <div className="mt-3">
                    <button className="px-3 py-1 bg-black text-white rounded text-sm" onClick={() => installCampaign(c.id)}>Install</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <div className="font-bold mb-3">Content packs</div>
          {packs.length === 0 ? (
            <div className="text-gray-600">No packs found.</div>
          ) : (
            <div className="grid gap-3">
              {packs.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="font-bold">{p.title}</div>
                  <div className="text-gray-600 mt-2 text-sm">
                    {p.industry || "All"} • {p.season || "Any"} • {Array.isArray(p.tags) ? p.tags.join(", ") : ""}
                  </div>
                  <div className="mt-2 text-gray-600 text-sm">{p.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 border border-gray-200 rounded-xl p-4">
        <div className="font-bold mb-3">My installs</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold mb-2 text-sm">Campaigns</div>
            {(my.campaigns || []).length === 0 ? (
              <div className="text-gray-600 text-sm">No installs yet.</div>
            ) : (
              <ul className="list-disc ml-4 text-sm">
                {(my.campaigns || []).map((x: any) => (
                  <li key={x.id}>
                    {x.dfy_campaigns?.title} — <b>{x.status}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="font-bold mb-2 text-sm">Content</div>
            {(my.content || []).length === 0 ? (
              <div className="text-gray-600 text-sm">No content installs yet.</div>
            ) : (
              <ul className="list-disc ml-4 text-sm">
                {(my.content || []).map((x: any) => (
                  <li key={x.id}>
                    {x.dfy_content_items?.title} — <b>{x.status}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
