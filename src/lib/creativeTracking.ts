import { supabase } from "./supabase";

type TrackEventParams = {
  business_key?: string;
  vertical_key?: string;
  creative_id?: string | null;
  event_type: "impression" | "click" | "checkout_started" | "purchase";
  ref_code?: string | null;
  partner_id?: string | null;
  meta?: Record<string, any>;
  revenue_cents?: number;
};

export async function trackCreativeEvent(params: TrackEventParams): Promise<void> {
  try {
    const session_id = getOrCreateSessionId();

    const { data: { user } } = await supabase.auth.getUser();

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-creative-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          business_key: params.business_key || "storylab_kids",
          vertical_key: params.vertical_key || "kids",
          creative_id: params.creative_id || null,
          event_type: params.event_type,
          profile_id: user?.id || null,
          session_id,
          ref_code: params.ref_code || getRefCodeFromUrl(),
          partner_id: params.partner_id || null,
          meta: params.meta || {},
          revenue_cents: params.revenue_cents || 0,
        }),
      }
    );

    if (!response.ok) {
      console.warn("Failed to track creative event:", await response.text());
    }
  } catch (error) {
    console.warn("Error tracking creative event:", error);
  }
}

function getOrCreateSessionId(): string {
  const key = "creative_session_id";
  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

function getRefCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref") || params.get("ref_code") || null;
}

export function getCreativeIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("creative_id") || params.get("cid") || null;
}
