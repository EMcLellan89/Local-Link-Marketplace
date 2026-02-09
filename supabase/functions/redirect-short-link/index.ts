import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const code = pathParts[pathParts.length - 1]?.trim().toUpperCase();

    if (!code) {
      return Response.redirect(new URL('/', url.origin).toString(), 302);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Look up the short link
    const { data: shortLink, error } = await supabase
      .from("referral_short_links")
      .select("destination_url")
      .eq("short_code", code)
      .maybeSingle();

    if (error || !shortLink?.destination_url) {
      return Response.redirect(new URL('/', url.origin).toString(), 302);
    }

    // Increment click count (fire and forget)
    supabase
      .from("referral_short_links")
      .update({ click_count: supabase.rpc('increment', { x: 1 }) })
      .eq("short_code", code)
      .then(() => {});

    // Redirect to the destination
    return Response.redirect(shortLink.destination_url, 302);
  } catch (error: any) {
    console.error("Error redirecting short link:", error);
    const url = new URL(req.url);
    return Response.redirect(new URL('/', url.origin).toString(), 302);
  }
});
