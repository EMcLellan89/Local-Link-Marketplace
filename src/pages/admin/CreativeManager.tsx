import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Check, X, RefreshCw, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Creative = {
  id: string;
  creative_key: string;
  headline: string;
  primary_text: string;
  cta: string;
  landing_path: string;
  is_approved: boolean;
  is_active: boolean;
  asset_path: string | null;
  lifetime_impressions: number;
  lifetime_clicks: number;
  lifetime_purchases: number;
  lifetime_revenue_cents: number;
};

export default function CreativeManager() {
  const navigate = useNavigate();
  const [businessKey, setBusinessKey] = useState("storylab_kids");
  const [verticalKey, setVerticalKey] = useState("kids");
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newCreative, setNewCreative] = useState({
    creative_key: "",
    headline: "",
    primary_text: "",
    cta: "Learn More",
    landing_path: "/storylab/kids/checkout",
  });

  async function loadCreatives() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ad_creatives")
        .select("*")
        .eq("business_key", businessKey)
        .eq("vertical_key", verticalKey)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setCreatives((data as Creative[]) || []);
    } catch (e: any) {
      console.error("Failed to load creatives:", e);
    } finally {
      setLoading(false);
    }
  }

  async function toggleApproval(id: string, currentValue: boolean) {
    try {
      const { error } = await supabase
        .from("ad_creatives")
        .update({ is_approved: !currentValue })
        .eq("id", id);

      if (error) throw error;
      await loadCreatives();
    } catch (e: any) {
      alert(`Failed to update: ${e.message}`);
    }
  }

  async function toggleActive(id: string, currentValue: boolean) {
    try {
      const { error } = await supabase
        .from("ad_creatives")
        .update({ is_active: !currentValue })
        .eq("id", id);

      if (error) throw error;
      await loadCreatives();
    } catch (e: any) {
      alert(`Failed to update: ${e.message}`);
    }
  }

  async function createCreative() {
    if (!newCreative.creative_key || !newCreative.headline || !newCreative.primary_text) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("ad_creatives").insert({
        business_key: businessKey,
        vertical_key: verticalKey,
        creative_key: newCreative.creative_key,
        headline: newCreative.headline,
        primary_text: newCreative.primary_text,
        cta: newCreative.cta,
        landing_path: newCreative.landing_path,
        is_approved: false,
        is_active: true,
      });

      if (error) throw error;

      setNewCreative({
        creative_key: "",
        headline: "",
        primary_text: "",
        cta: "Learn More",
        landing_path: "/storylab/kids/checkout",
      });
      setShowCreateForm(false);
      await loadCreatives();
    } catch (e: any) {
      alert(`Failed to create: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function calculateWinners() {
    if (!confirm("Calculate weekly winners now? This will refresh the leaderboard.")) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-weekly-winners`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            business_key: businessKey,
            vertical_key: verticalKey,
          }),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();
      alert(`Success! ${result.count} winners calculated.`);
    } catch (e: any) {
      alert(`Failed to calculate winners: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCreatives();
  }, [businessKey, verticalKey]);

  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, margin: "0 0 8px 0" }}>Creative Manager</h1>
        <p style={{ fontSize: 16, color: "#666", margin: 0 }}>
          Manage approved creatives for the Profit Network. Partners see only approved + active creatives.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <select
          value={businessKey}
          onChange={(e) => setBusinessKey(e.target.value)}
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
        >
          <option value="storylab_kids">StoryLab Kids</option>
          <option value="storylab_teen">StoryLab Teen</option>
          <option value="storylab_adult">StoryLab Adult</option>
        </select>

        <select
          value={verticalKey}
          onChange={(e) => setVerticalKey(e.target.value)}
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
        >
          <option value="kids">Kids</option>
          <option value="teen">Teen</option>
          <option value="adult">Adult</option>
        </select>

        <button
          onClick={loadCreatives}
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Plus size={16} />
          New Creative
        </button>

        <button
          onClick={calculateWinners}
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #0066cc",
            background: "#0066cc",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <TrendingUp size={16} />
          Calculate Winners
        </button>

        <button
          onClick={() => navigate("/partner/winners")}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          View Winners Feed
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20, marginBottom: 24, background: "#f9f9f9" }}>
          <h3 style={{ marginTop: 0 }}>Create New Creative</h3>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              value={newCreative.creative_key}
              onChange={(e) => setNewCreative({ ...newCreative, creative_key: e.target.value })}
              placeholder="Creative Key (e.g., kids_v1_winner)"
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <input
              value={newCreative.headline}
              onChange={(e) => setNewCreative({ ...newCreative, headline: e.target.value })}
              placeholder="Headline"
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <textarea
              value={newCreative.primary_text}
              onChange={(e) => setNewCreative({ ...newCreative, primary_text: e.target.value })}
              placeholder="Primary Text"
              rows={4}
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <input
              value={newCreative.cta}
              onChange={(e) => setNewCreative({ ...newCreative, cta: e.target.value })}
              placeholder="CTA"
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <input
              value={newCreative.landing_path}
              onChange={(e) => setNewCreative({ ...newCreative, landing_path: e.target.value })}
              placeholder="Landing Path"
              style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={createCreative}
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: "1px solid #111",
                  background: "#111",
                  color: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creatives List */}
      <div style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
        Showing {creatives.length} creatives
      </div>

      {creatives.map((creative) => (
        <div
          key={creative.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>{creative.creative_key}</div>
              <h4 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>{creative.headline}</h4>
              <p style={{ fontSize: 14, color: "#444", margin: "0 0 8px 0" }}>{creative.primary_text}</p>
              <div style={{ fontSize: 13, color: "#666" }}>
                CTA: <strong>{creative.cta}</strong> • Landing: <strong>{creative.landing_path}</strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => toggleApproval(creative.id, creative.is_approved)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: creative.is_approved ? "#e0ffe0" : "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {creative.is_approved ? <Check size={16} /> : <X size={16} />}
                {creative.is_approved ? "Approved" : "Approve"}
              </button>

              <button
                onClick={() => toggleActive(creative.id, creative.is_active)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: creative.is_active ? "#fff" : "#ffeeee",
                  cursor: "pointer",
                }}
              >
                {creative.is_active ? "Disable" : "Enable"}
              </button>
            </div>
          </div>

          {/* Stats */}
          {(creative.lifetime_impressions > 0 || creative.lifetime_clicks > 0) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
                padding: 12,
                background: "#f9f9f9",
                borderRadius: 8,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "#666" }}>Impressions</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{creative.lifetime_impressions.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666" }}>Clicks</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{creative.lifetime_clicks.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666" }}>Purchases</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0a0" }}>{creative.lifetime_purchases.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666" }}>Revenue</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0a0" }}>{formatMoney(creative.lifetime_revenue_cents)}</div>
              </div>
            </div>
          )}
        </div>
      ))}

      {creatives.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#999" }}>
          No creatives yet. Click "New Creative" to add one.
        </div>
      )}
    </div>
  );
}
