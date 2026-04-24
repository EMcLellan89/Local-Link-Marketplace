import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function makeCode() {
  return Math.random().toString(16).slice(2, 8).toUpperCase();
}

function formatCurrency(cents: number) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

function normalizePhone(phone: string) {
  const p = (phone || "").trim();
  if (!p) return "";
  if (p.startsWith("+")) return p;
  // If they entered 10 digits, assume US +1
  const digits = p.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return p;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const merchantId = user.id;
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const fullName = (body.full_name || "").trim() || null;
    const phoneRaw = (body.phone || "").trim();

    if (!phoneRaw) {
      return new Response(JSON.stringify({ error: "Phone required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const phone = normalizePhone(phoneRaw);
    if (!phone.startsWith("+")) {
      return new Response(JSON.stringify({ error: "Phone must be in E.164 format (ex: +16175551234)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    const brevoSmsSender = Deno.env.get("BREVO_SMS_SENDER") || "LocalLink";

    if (!BREVO_API_KEY) {
      return new Response(JSON.stringify({ error: "SMS service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get referral program
    const { data: program, error: programError } = await supabaseAdmin
      .from("customer_referral_programs")
      .select("*")
      .eq("merchant_id", merchantId)
      .maybeSingle();

    if (programError || !program?.is_enabled) {
      return new Response(JSON.stringify({ error: "Referral program not enabled" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find or create customer
    let customerId: string;

    if (email) {
      const { data: existingCustomer } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          phone: phone,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            role: "customer"
          }
        });

        if (createError || !newUser.user) {
          return new Response(JSON.stringify({ error: "Failed to create customer" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        customerId = newUser.user.id;
      }
    } else {
      // Try to find by phone
      const { data: existingByPhone } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (existingByPhone) {
        customerId = existingByPhone.id;
      } else {
        // Create phone-only customer
        const randomEmail = `${Date.now()}-${Math.random().toString(36).slice(2)}@temp.local-link.com`;
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: randomEmail,
          phone: phone,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            role: "customer"
          }
        });

        if (createError || !newUser.user) {
          return new Response(JSON.stringify({ error: "Failed to create customer" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        customerId = newUser.user.id;
      }
    }

    // Get or create share code
    let shareCode: string | null = null;
    const { data: existingLink } = await supabaseAdmin
      .from("customer_referral_links")
      .select("share_code")
      .eq("merchant_id", merchantId)
      .eq("customer_id", customerId)
      .maybeSingle();

    if (existingLink?.share_code) {
      shareCode = existingLink.share_code;
    } else {
      for (let i = 0; i < 10; i++) {
        const code = makeCode();
        const { data: newLink, error: insertError } = await supabaseAdmin
          .from("customer_referral_links")
          .insert({
            merchant_id: merchantId,
            customer_id: customerId,
            share_code: code
          })
          .select("share_code")
          .single();

        if (!insertError && newLink) {
          shareCode = newLink.share_code;
          break;
        }
      }
    }

    if (!shareCode) {
      return new Response(JSON.stringify({ error: "Failed to generate share code" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const appUrl = Deno.env.get("SUPABASE_URL")?.replace(/\/.*/, "") || "http://localhost:3000";
    const destination = `${appUrl}/r/${program.landing_slug}?ref=${shareCode}`;

    // Create short link
    const { data: shortCode } = await supabaseAdmin.rpc("get_or_create_short_link", {
      p_merchant_id: merchantId,
      p_destination_url: destination
    });

    const shortUrl = `${appUrl}/l/${shortCode}`;

    const rewardLine = `You earn ${formatCurrency(program.reward_value_cents)} • Friend gets ${formatCurrency(program.referee_incentive_value_cents)}`;
    const text = `${program.program_name || "Refer & Earn"}: ${rewardLine}\nShare your link:\n${shortUrl}`;

    // Send SMS via Brevo
    const smsResponse = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: brevoSmsSender,
        recipient: phone,
        content: text,
        type: "transactional",
      }),
    });

    const smsResult = await smsResponse.json().catch(() => ({}));

    if (!smsResponse.ok) {
      console.error("SMS send error:", smsResult);
      return new Response(JSON.stringify({ error: "Failed to send SMS" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Track SMS sent
    await supabaseAdmin
      .from("profiles")
      .update({ referral_link_sms_sent_at: new Date().toISOString() })
      .eq("id", customerId);

    return new Response(JSON.stringify({
      ok: true,
      share_code: shareCode,
      share_url: shortUrl,
      message_id: smsResult.messageId,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending referral SMS:", error);
    return new Response(JSON.stringify({ error: error.message || "Error sending SMS" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
