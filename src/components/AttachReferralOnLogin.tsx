import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export function AttachReferralOnLogin() {
  const { user } = useAuth();
  const ranRef = useRef(false);

  useEffect(() => {
    if (!user || ranRef.current) return;

    (async () => {
      ranRef.current = true;

      const referral_id = localStorage.getItem("ll_referral_id");
      const partner_code = localStorage.getItem("ll_partner_code");

      if (!referral_id && !partner_code) return;

      try {
        const session = (await supabase.auth.getSession()).data.session;
        if (!session) return;

        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/attach-marketplace-affiliate-to-signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              referral_id: referral_id || undefined,
              affiliate_code: partner_code || undefined,
            }),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          console.warn("attach-marketplace-affiliate-to-signup failed:", data.error);
          return;
        }

        localStorage.removeItem("ll_referral_id");
        localStorage.removeItem("ll_partner_code");
        localStorage.removeItem("ll_product_sku");
        localStorage.removeItem("ll_utm");
      } catch (error) {
        console.warn("attach referral error:", error);
      }
    })();
  }, [user]);

  return null;
}
