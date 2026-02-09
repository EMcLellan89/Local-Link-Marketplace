import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Rocket, Pause, Play, DollarSign, Calendar, TrendingUp, X } from "lucide-react";

type Campaign = {
  id: string;
  creative_id: string;
  status: "active" | "paused" | "stopped";
  daily_budget_cents: number;
  deployed_at: string;
  total_funded_cents: number;
  total_ad_spend_cents: number;
  payback_balance_cents: number;
  funded_until_week: number;
  week_number: number;
  is_in_funded_period: boolean;
  days_active: number;
  ad_creatives: {
    creative_key: string;
    headline: string;
    primary_text: string;
    lifetime_purchases: number;
    lifetime_revenue_cents: number;
  };
};

export default function PartnerCampaignsDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadCampaigns() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please log in to view campaigns");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/campaign-list`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load campaigns");
      }

      setCampaigns(result.campaigns || []);
    } catch (error: any) {
      console.error("Failed to load campaigns:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(campaignId: string, newStatus: "active" | "paused" | "stopped") {
    setUpdatingId(campaignId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/campaign-set-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update status");
      }

      await loadCampaigns();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  }

  async function updateBudget(campaignId: string) {
    const newBudget = prompt("Enter new daily budget (minimum $20):");
    if (!newBudget) return;

    const budgetCents = Math.round(parseFloat(newBudget) * 100);

    if (budgetCents < 2000) {
      alert("Minimum budget is $20/day");
      return;
    }

    setUpdatingId(campaignId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/campaign-set-budget`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            daily_budget_cents: budgetCents,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update budget");
      }

      await loadCampaigns();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const pausedCampaigns = campaigns.filter((c) => c.status === "paused");
  const stoppedCampaigns = campaigns.filter((c) => c.status === "stopped");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Rocket size={32} style={{ color: "#111" }} />
          <h1 style={{ fontSize: 32, margin: 0 }}>My Campaigns</h1>
        </div>
        <p style={{ fontSize: 16, color: "#666", margin: 0 }}>
          Manage your deployed winners. First 8 weeks funded at $20/day, then $50/week payback starts.
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <div style={{ padding: 20, background: "#e7f5ff", borderRadius: 12, border: "1px solid #339af0" }}>
          <div style={{ fontSize: 14, color: "#1971c2", marginBottom: 4 }}>Active Campaigns</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#1971c2" }}>{activeCampaigns.length}</div>
        </div>
        <div style={{ padding: 20, background: "#fff3e0", borderRadius: 12, border: "1px solid #ff9800" }}>
          <div style={{ fontSize: 14, color: "#e65100", marginBottom: 4 }}>Total Ad Spend</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#e65100" }}>
            ${(campaigns.reduce((sum, c) => sum + c.total_ad_spend_cents, 0) / 100).toFixed(2)}
          </div>
        </div>
        <div style={{ padding: 20, background: "#e8f5e9", borderRadius: 12, border: "1px solid #4caf50" }}>
          <div style={{ fontSize: 14, color: "#2e7d32", marginBottom: 4 }}>Payback Owed</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#2e7d32" }}>
            ${(campaigns.reduce((sum, c) => sum + c.payback_balance_cents, 0) / 100).toFixed(2)}
          </div>
        </div>
      </div>

      <button
        onClick={loadCampaigns}
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
          marginBottom: 24,
        }}
      >
        {loading ? "Loading..." : "Refresh"}
      </button>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>Active Campaigns</h2>
          {activeCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onPause={() => updateStatus(campaign.id, "paused")}
              onStop={() => {
                if (confirm("Stop this campaign permanently? This cannot be undone.")) {
                  updateStatus(campaign.id, "stopped");
                }
              }}
              onUpdateBudget={() => updateBudget(campaign.id)}
              updating={updatingId === campaign.id}
            />
          ))}
        </>
      )}

      {/* Paused Campaigns */}
      {pausedCampaigns.length > 0 && (
        <>
          <h2 style={{ fontSize: 24, marginTop: 32, marginBottom: 16 }}>Paused Campaigns</h2>
          {pausedCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onResume={() => updateStatus(campaign.id, "active")}
              onStop={() => {
                if (confirm("Stop this campaign permanently? This cannot be undone.")) {
                  updateStatus(campaign.id, "stopped");
                }
              }}
              onUpdateBudget={() => updateBudget(campaign.id)}
              updating={updatingId === campaign.id}
            />
          ))}
        </>
      )}

      {/* Stopped Campaigns */}
      {stoppedCampaigns.length > 0 && (
        <>
          <h2 style={{ fontSize: 24, marginTop: 32, marginBottom: 16 }}>Stopped Campaigns</h2>
          {stoppedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} updating={false} />
          ))}
        </>
      )}

      {campaigns.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#999" }}>
          No campaigns yet. Deploy a winner from the Winners Feed to get started!
        </div>
      )}
    </div>
  );
}

function CampaignCard({
  campaign,
  onPause,
  onResume,
  onStop,
  onUpdateBudget,
  updating,
}: {
  campaign: Campaign;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onUpdateBudget?: () => void;
  updating: boolean;
}) {
  const statusColor =
    campaign.status === "active" ? "#0a0" : campaign.status === "paused" ? "#ff9800" : "#999";

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        background: campaign.status === "active" ? "#f9fff9" : "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
            {campaign.ad_creatives.creative_key}
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px 0" }}>
            {campaign.ad_creatives.headline}
          </h3>
          <p style={{ fontSize: 14, color: "#666", margin: 0 }}>{campaign.ad_creatives.primary_text}</p>
        </div>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            background: statusColor,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {campaign.status}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 12,
          marginBottom: 16,
          padding: 16,
          background: "#f9f9f9",
          borderRadius: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Daily Budget</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            ${(campaign.daily_budget_cents / 100).toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Week #</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{campaign.week_number}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Days Active</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{campaign.days_active}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Total Spend</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            ${(campaign.total_ad_spend_cents / 100).toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Platform Funded</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0066cc" }}>
            ${(campaign.total_funded_cents / 100).toFixed(2)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Payback Owed</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: campaign.payback_balance_cents > 0 ? "#ff9800" : "#0a0" }}>
            ${(campaign.payback_balance_cents / 100).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Funding Status */}
      <div
        style={{
          padding: 12,
          borderRadius: 8,
          background: campaign.is_in_funded_period ? "#e7f5ff" : "#fff3e0",
          marginBottom: 16,
          fontSize: 14,
          color: campaign.is_in_funded_period ? "#1971c2" : "#e65100",
        }}
      >
        {campaign.is_in_funded_period ? (
          <>
            <strong>Funded Period:</strong> Platform covers ad costs (Weeks 1-8)
          </>
        ) : (
          <>
            <strong>Payback Period:</strong> $50/week deducted from earnings until {`$${(campaign.total_funded_cents / 100).toFixed(2)}`} repaid
          </>
        )}
      </div>

      {/* Controls */}
      {campaign.status !== "stopped" && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {campaign.status === "active" && onPause && (
            <button
              onClick={onPause}
              disabled={updating}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #ff9800",
                background: "#fff",
                color: "#ff9800",
                cursor: updating ? "not-allowed" : "pointer",
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Pause size={16} />
              Pause
            </button>
          )}
          {campaign.status === "paused" && onResume && (
            <button
              onClick={onResume}
              disabled={updating}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #0a0",
                background: "#0a0",
                color: "#fff",
                cursor: updating ? "not-allowed" : "pointer",
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Play size={16} />
              Resume
            </button>
          )}
          {onUpdateBudget && (
            <button
              onClick={onUpdateBudget}
              disabled={updating}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #0066cc",
                background: "#fff",
                color: "#0066cc",
                cursor: updating ? "not-allowed" : "pointer",
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <DollarSign size={16} />
              Change Budget
            </button>
          )}
          {onStop && (
            <button
              onClick={onStop}
              disabled={updating}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #d32f2f",
                background: "#fff",
                color: "#d32f2f",
                cursor: updating ? "not-allowed" : "pointer",
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <X size={16} />
              Stop Campaign
            </button>
          )}
        </div>
      )}
    </div>
  );
}
