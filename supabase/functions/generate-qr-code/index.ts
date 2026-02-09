import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    const text = url.searchParams.get("text") || "";
    const size = Math.min(parseInt(url.searchParams.get("size") || "240", 10), 600);

    if (!text) {
      return new Response(JSON.stringify({ error: "Missing text parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate QR code using an external API (qrserver.com is free and reliable)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png`;

    const qrResponse = await fetch(qrApiUrl);
    if (!qrResponse.ok) {
      throw new Error("Failed to generate QR code");
    }

    const imageBuffer = await qrResponse.arrayBuffer();

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Error generating QR code" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
