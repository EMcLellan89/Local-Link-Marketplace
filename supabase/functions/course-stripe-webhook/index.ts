import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.4.0";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendSaleToLocalLink } from "../_shared/localLinkIntegration.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature",
};

function calcCommission(amountCents: number, rate: number): number {
  return Math.round(amountCents * rate);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-12-18.acacia",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const signature = req.headers.get("stripe-signature")!;
    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET_COURSE")!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle checkout.session.completed (regular course purchases)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.user_id || "";
      const productSlug = session.metadata?.product_slug || "";
      const productType = session.metadata?.product_type || "";
      const affiliateCode = session.metadata?.affiliate_code?.trim() || "";

      const paymentIntentId = String(session.payment_intent || "");
      const amountTotal = session.amount_total || 0;
      const customerId = String(session.customer || "");

      // Store Stripe customer ID for one-click upsells
      if (userId && customerId && customerId.startsWith("cus_")) {
        await supabaseAdmin
          .from("stripe_customers")
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            email: session.customer_email || "",
          }, {
            onConflict: "user_id",
          });
      }

      // 1. Look up partner if affiliate code provided
      let partnerId: string | null = null;
      let customerAccountId: string | null = null;

      if (affiliateCode) {
        const { data: partner } = await supabaseAdmin
          .from("affiliate_partners")
          .select("id")
          .eq("referral_code", affiliateCode)
          .maybeSingle();

        if (partner) {
          partnerId = partner.id;

          // Create or get customer account
          const { data: customerAccount } = await supabaseAdmin
            .from("customer_accounts")
            .upsert({
              email: session.customer_email || "",
              stripe_customer_id: customerId || null,
            }, {
              onConflict: "stripe_customer_id",
            })
            .select()
            .single();

          if (customerAccount) {
            customerAccountId = customerAccount.id;

            // Create partner-customer link for attribution
            await supabaseAdmin
              .from("partner_customer_links")
              .upsert({
                partner_id: partnerId,
                customer_account_id: customerAccountId,
                attribution_source: "course_purchase",
              }, {
                onConflict: "partner_id,customer_account_id",
              });
          }
        }
      }

      // Create order record with partner attribution
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: userId || null,
          product_slug: productSlug,
          product_type: productType,
          amount_cents: amountTotal,
          currency: session.currency || "usd",
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          stripe_customer_id: customerId || null,
          stripe_event_id: event.id,
          status: "paid",
          order_type: "course",
          sku: productSlug,
          description: `Course: ${productSlug}`,
          partner_id: partnerId,
          customer_account_id: customerAccountId,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
      }

      // 2. If course purchase, create enrollment
      if (productSlug && userId) {
        const { data: course } = await supabaseAdmin
          .from("courses")
          .select("id")
          .eq("slug", productSlug)
          .single();

        if (course?.id) {
          const { error: enrollmentError } = await supabaseAdmin
            .from("enrollments")
            .upsert({
              user_id: userId,
              course_id: course.id,
              status: "active",
              stripe_payment_intent_id: paymentIntentId,
            });

          if (enrollmentError) {
            console.error("Error creating enrollment:", enrollmentError);
          }
        }
      }

      // 3. Handle affiliate referral if present
      if (affiliateCode && productSlug) {
        // Try course affiliates first (for course-specific affiliate program)
        const { data: affiliate } = await supabaseAdmin
          .from("course_affiliates")
          .select("id, rate_standard, rate_launch, is_active, total_referrals, total_earned_cents")
          .eq("code", affiliateCode)
          .eq("is_active", true)
          .maybeSingle();

        if (affiliate) {
          const rate = Number(affiliate.rate_launch || 0.40);
          const commission = calcCommission(amountTotal, rate);

          const { error: referralError } = await supabaseAdmin
            .from("course_affiliate_referrals")
            .insert({
              affiliate_id: affiliate.id,
              referred_user_id: userId || null,
              product_slug: productSlug,
              order_id: order?.id || null,
              stripe_checkout_session_id: session.id,
              stripe_payment_intent_id: paymentIntentId,
              order_amount_cents: amountTotal,
              commission_amount_cents: commission,
              commission_rate: rate,
              status: "earned",
            });

          if (!referralError) {
            await supabaseAdmin
              .from("course_affiliates")
              .update({
                total_referrals: (affiliate.total_referrals || 0) + 1,
                total_earned_cents: (affiliate.total_earned_cents || 0) + commission,
              })
              .eq("id", affiliate.id);
          }
        }
      }

      // 4. Create partner commission if partner attribution exists
      if (partnerId && order?.id) {
        // Get commission rate from rules
        const { data: commissionRule } = await supabaseAdmin
          .from("commission_rules")
          .select("rate_bps")
          .eq("order_type", "course")
          .is("ends_at", null)
          .order("starts_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (commissionRule) {
          const rateBps = commissionRule.rate_bps;
          const commissionCents = Math.round((amountTotal * rateBps) / 10000);

          await supabaseAdmin
            .from("commissions")
            .insert({
              partner_id: partnerId,
              order_id: order.id,
              commission_cents: commissionCents,
              rate_bps: rateBps,
              status: "pending",
            });
        }
      }

      // Send sale to LocalLink for accounting/attribution
      if (order?.id) {
        await sendSaleToLocalLink({
          order_id: order.id,
          ref_code: affiliateCode || partnerId,
          amount_cents: amountTotal,
          product_key: productSlug,
          product_name: `Course: ${productSlug}`,
          customer_email: session.customer_email || undefined,
          customer_id: userId || undefined,
          partner_id: partnerId || undefined,
          commission_amount_cents: partnerId && order.id ? Math.round((amountTotal * (commissionRule?.rate_bps || 0)) / 10000) : 0,
          metadata: {
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: paymentIntentId,
            product_type: productType,
            affiliate_code: affiliateCode,
          },
        });
      }
    }

    // Handle payment_intent.succeeded (one-click upsells)
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const userId = paymentIntent.metadata?.user_id || "";
      const productSlug = paymentIntent.metadata?.product_slug || "";
      const productType = paymentIntent.metadata?.product_type || "";
      const upsellOfferId = paymentIntent.metadata?.upsell_offer_id || "";

      // Only process if this is an upsell
      if (productType === "upsell" && upsellOfferId) {
        // Update upsell purchase status
        await supabaseAdmin
          .from("upsell_purchases")
          .update({
            status: "succeeded",
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        // Create order record
        const { data: upsellOrder } = await supabaseAdmin
          .from("orders")
          .insert({
            user_id: userId || null,
            product_slug: productSlug,
            product_type: "upsell",
            amount_cents: paymentIntent.amount,
            currency: paymentIntent.currency || "usd",
            stripe_payment_intent_id: paymentIntent.id,
            status: "paid",
          })
          .select()
          .single();

        // Send upsell to LocalLink
        if (upsellOrder) {
          await sendSaleToLocalLink({
            order_id: upsellOrder.id,
            amount_cents: paymentIntent.amount,
            product_key: productSlug,
            product_name: `Upsell: ${productSlug}`,
            customer_id: userId || undefined,
            metadata: {
              stripe_payment_intent_id: paymentIntent.id,
              product_type: "upsell",
              upsell_offer_id: upsellOfferId,
            },
          });
        }

        // Grant entitlement based on product slug
        if (userId && productSlug) {
          // For script packs, just record the purchase
          // Entitlements can be checked via orders table or separate entitlements table
          console.log(`Upsell completed: ${productSlug} for user ${userId}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});