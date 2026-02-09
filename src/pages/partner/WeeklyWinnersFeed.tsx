import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Copy, TrendingUp, Target, DollarSign, Rocket } from "lucide-react";

type Winner = {
  id: string;
  creative_key: string;
  headline: string;
  primary_text: string;
  cta: string;
  landing_path: string;
  impressions: number;
  clicks: number;
  purchases: number;
  revenue_cents: number;
  ctr: number;
  cvr: number;
  recommended_budget_daily_cents: number;
  targeting_notes: string;
  rank: number;
  week_start_date: string;
};

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatPercent(decimal: number) {
  return `${(decimal * 100).toFixed(2)}%`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function WeeklyWinnersFeed() {
  const [businessKey, setBusinessKey] = useState("storylab_kids");
  const [verticalKey, setVerticalKey] = useState("kids");
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [deployedIds, setDeployedIds] = useState<Set<string>>(new Set());

  async function loadWinners() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("weekly_creative_winners")
        .select("*")
        .eq("business_key", businessKey)
        .eq("vertical_key", verticalKey)
        .order("rank", { ascending: true })
        .limit(10);

      if (error) throw error;
      setWinners((data as Winner[]) || []);
    } catch (e: any) {
      console.error("Failed to load winners:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWinners();
  }, [businessKey, verticalKey]);

  const handleCopy = (text: string, id: string) => {
    copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeploy = async (creativeId: string) => {
    setDeployingId(creativeId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please log in to deploy campaigns");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/campaign-deploy-winner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            creative_id: creativeId,
            business_key: businessKey,
            vertical_key: verticalKey,
            daily_budget_cents: 2000, // $20 default
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Deployment failed");
      }

      setDeployedIds((prev) => new Set([...prev, creativeId]));
      alert(`Campaign deployed! ${result.message || ""}`);
    } catch (error: any) {
      if (error.message?.includes("campaign_already_exists")) {
        alert("You already have an active campaign for this winner. Check your Campaigns page.");
      } else {
        alert(`Deployment failed: ${error.message}`);
      }
    } finally {
      setDeployingId(null);
    }
  };

  const latestWeek = winners.length > 0 ? new Date(winners[0].week_start_date).toLocaleDateString() : "—";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <TrendingUp size={32} style={{ color: "#111" }} />
          <h1 style={{ fontSize: 32, margin: 0 }}>Weekly Winners Feed</h1>
        </div>
        <p style={{ fontSize: 16, color: "#666", margin: 0 }}>
          Top performing creatives this week. Copy the exact copy + targeting notes to run winning ads immediately.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <select
          value={businessKey}
          onChange={(e) => setBusinessKey(e.target.value)}
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd", fontSize: 14 }}
        >
          <option value="storylab_kids">StoryLab Kids</option>
          <option value="storylab_teen">StoryLab Teen</option>
          <option value="storylab_adult">StoryLab Adult</option>
        </select>

        <select
          value={verticalKey}
          onChange={(e) => setVerticalKey(e.target.value)}
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd", fontSize: 14 }}
        >
          <option value="kids">Kids</option>
          <option value="teen">Teen</option>
          <option value="adult">Adult</option>
        </select>

        <button
          onClick={loadWinners}
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>

        <div style={{ marginLeft: "auto", fontSize: 14, color: "#666", display: "flex", alignItems: "center" }}>
          Week of: <strong style={{ marginLeft: 6 }}>{latestWeek}</strong>
        </div>
      </div>

      {/* Winners List */}
      {winners.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#999" }}>
          No winners yet this week. Check back soon!
        </div>
      )}

      {winners.map((winner) => (
        <div
          key={winner.id}
          style={{
            border: winner.rank <= 3 ? "2px solid #111" : "1px solid #ddd",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            background: winner.rank === 1 ? "#fffbf0" : "#fff",
            position: "relative",
          }}
        >
          {/* Rank Badge */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: winner.rank === 1 ? "#FFD700" : winner.rank === 2 ? "#C0C0C0" : winner.rank === 3 ? "#CD7F32" : "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 20,
              color: winner.rank <= 3 ? "#fff" : "#666",
            }}
          >
            #{winner.rank}
          </div>

          {/* Creative Info */}
          <div style={{ marginBottom: 16, paddingRight: 60 }}>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>{winner.creative_key}</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px 0" }}>{winner.headline}</h3>
            <p style={{ fontSize: 15, color: "#444", margin: 0, lineHeight: 1.6 }}>{winner.primary_text}</p>
          </div>

          {/* Copy Buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <button
              onClick={() => handleCopy(winner.headline, `${winner.id}-headline`)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: copiedId === `${winner.id}-headline` ? "#111" : "#fff",
                color: copiedId === `${winner.id}-headline` ? "#fff" : "#111",
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Copy size={16} />
              {copiedId === `${winner.id}-headline` ? "Copied!" : "Copy Headline"}
            </button>

            <button
              onClick={() => handleCopy(winner.primary_text, `${winner.id}-text`)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: copiedId === `${winner.id}-text` ? "#111" : "#fff",
                color: copiedId === `${winner.id}-text` ? "#fff" : "#111",
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Copy size={16} />
              {copiedId === `${winner.id}-text` ? "Copied!" : "Copy Primary Text"}
            </button>

            <button
              onClick={() => handleCopy(`${winner.headline}\n\n${winner.primary_text}\n\nCTA: ${winner.cta}`, `${winner.id}-all`)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #111",
                background: copiedId === `${winner.id}-all` ? "#111" : "#fff",
                color: copiedId === `${winner.id}-all` ? "#fff" : "#111",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Copy size={16} />
              {copiedId === `${winner.id}-all` ? "Copied!" : "Copy Complete Ad"}
            </button>

            <button
              onClick={() => handleDeploy(winner.id)}
              disabled={deployingId === winner.id || deployedIds.has(winner.id)}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "2px solid #0066cc",
                background: deployedIds.has(winner.id) ? "#0a0" : "#0066cc",
                color: "#fff",
                cursor: deployingId === winner.id || deployedIds.has(winner.id) ? "not-allowed" : "pointer",
                fontSize: 14,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginLeft: "auto",
              }}
            >
              <Rocket size={16} />
              {deployingId === winner.id
                ? "Deploying..."
                : deployedIds.has(winner.id)
                ? "Deployed!"
                : "Deploy Winner For Me"}
            </button>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
              marginBottom: 16,
              padding: 16,
              background: "#f9f9f9",
              borderRadius: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Impressions</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{winner.impressions.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Clicks</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{winner.clicks.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Purchases</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0a0" }}>{winner.purchases.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Revenue</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0a0" }}>{formatMoney(winner.revenue_cents)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>CTR</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{formatPercent(winner.ctr)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>CVR</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{formatPercent(winner.cvr)}</div>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#e7f5ff",
                border: "1px solid #339af0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <DollarSign size={20} style={{ color: "#339af0" }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1971c2" }}>Recommended Budget</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#1971c2" }}>
                {formatMoney(winner.recommended_budget_daily_cents)}/day
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#fff3e0",
                border: "1px solid #ff9800",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Target size={20} style={{ color: "#ff9800" }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e65100" }}>Targeting Notes</div>
              </div>
              <div style={{ fontSize: 14, color: "#e65100", lineHeight: 1.5 }}>{winner.targeting_notes}</div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 16, fontSize: 13, color: "#666" }}>
            CTA: <strong>{winner.cta}</strong> • Landing: <strong>{winner.landing_path}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
