import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "Missing order_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("marketplace_orders")
      .select("*, product:marketplace_products(id, slug, metadata)")
      .eq("id", order_id)
      .maybeSingle();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (order.status !== "completed") {
      return new Response(
        JSON.stringify({ error: "Order not completed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const product = order.product;
    const courseSlug = product?.metadata?.course_slug;

    if (!courseSlug) {
      return new Response(
        JSON.stringify({ error: "Product is not linked to a course" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: course } = await supabaseAdmin
      .from("course_products")
      .select("*")
      .eq("slug", courseSlug)
      .maybeSingle();

    if (!course) {
      return new Response(
        JSON.stringify({ error: "Course not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const existingEnrollment = await supabaseAdmin
      .from("course_enrollments")
      .select("id")
      .eq("user_id", order.buyer_user_id)
      .eq("course_id", course.id)
      .maybeSingle();

    if (existingEnrollment.data) {
      return new Response(
        JSON.stringify({
          ok: true,
          message: "User already enrolled",
          enrollment_id: existingEnrollment.data.id
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from("course_enrollments")
      .insert({
        user_id: order.buyer_user_id,
        course_id: course.id,
        enrolled_at: new Date().toISOString(),
        progress_percent: 0,
        status: "active",
      })
      .select()
      .single();

    if (enrollError) {
      throw enrollError;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        enrollment_id: enrollment.id,
        course_slug: courseSlug
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error creating academy entitlement:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create entitlement" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
