import { supabaseAdmin } from "./supabaseAdmin";

export async function markStripeEventProcessed(eventId: string): Promise<boolean> {
  // returns true if inserted (not processed yet), false if already exists
  const { data: existing, error: selErr } = await supabaseAdmin
    .from("stripe_webhook_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  if (selErr) throw selErr;
  if (existing?.id) return false;

  const { error: insErr } = await supabaseAdmin.from("stripe_webhook_events").insert({ id: eventId });
  if (insErr) {
    // If insert race, treat as already processed
    if ((insErr as any).code === "23505") return false;
    throw insErr;
  }
  return true;
}
