import { supabaseAdmin } from "./supabaseAdmin";

export async function resolvePartnerByRefCode(refCode?: string | null) {
  if (!refCode) return null;

  const { data, error } = await supabaseAdmin
    .from("partner_accounts")
    .select("id, ref_code, profile_id")
    .eq("ref_code", refCode)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}
