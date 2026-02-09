import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    // Verify admin user
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError || !adminUser) {
      throw new Error("Unauthorized: Admin access required");
    }

    // Get all unprocessed events
    const { data: events, error: eventsError } = await supabase
      .from("system_events")
      .select("*")
      .eq("processed", false)
      .order("created_at", { ascending: true })
      .limit(100);

    if (eventsError) throw eventsError;

    let processedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const event of events || []) {
      try {
        if (event.event_type === "outreach_logged") {
          // Award "First Pitch Sent" badge
          const partnerId = event.payload.partner_id;

          // Check if badge exists
          const { data: badge, error: badgeError } = await supabase
            .from("badges")
            .select("id")
            .eq("slug", "first-pitch-sent")
            .maybeSingle();

          if (badgeError) throw badgeError;

          if (badge) {
            // Check if partner already has this badge
            const { data: existingBadge, error: existingError } = await supabase
              .from("partner_badges")
              .select("id")
              .eq("partner_id", partnerId)
              .eq("badge_id", badge.id)
              .maybeSingle();

            if (existingError) throw existingError;

            if (!existingBadge) {
              // Award the badge
              const { error: awardError } = await supabase
                .from("partner_badges")
                .insert({
                  partner_id: partnerId,
                  badge_id: badge.id,
                  earned_at: new Date().toISOString(),
                });

              if (awardError) throw awardError;
            }
          }
        }

        // Mark event as processed
        const { error: updateError } = await supabase
          .from("system_events")
          .update({ processed: true })
          .eq("id", event.id);

        if (updateError) throw updateError;

        processedCount++;
      } catch (err: any) {
        console.error(`Error processing event ${event.id}:`, err);
        errors.push(`Event ${event.id}: ${err.message}`);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        errors: errorCount,
        error_details: errors,
        total_events: events?.length || 0,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("Error in internal-process-events:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
