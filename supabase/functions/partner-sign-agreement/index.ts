import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const AGREEMENT_SIGNING_SECRET = Deno.env.get('AGREEMENT_SIGNING_SECRET') || 'default-secret-change-in-production';

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { template_version, signed_name, signed_title, signed_email } = await req.json();

    if (!signed_name || !signed_email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const partner_id = user.id;
    const signed_at = new Date().toISOString();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const ua = req.headers.get('user-agent') || '';

    const signature_hash = await sha256(
      `${partner_id}|${template_version || 'v1.0'}|${signed_name}|${signed_email}|${signed_at}|${AGREEMENT_SIGNING_SECRET}`
    );

    const snapshot = {
      partner_id,
      template_version: template_version || 'v1.0',
      signed_name,
      signed_title,
      signed_email,
      signed_at,
    };

    const { data: agreement, error: insertError } = await supabase
      .from('partner_agreements')
      .insert({
        partner_id,
        template_version: template_version || 'v1.0',
        signed_name,
        signed_title,
        signed_email,
        signed_at,
        signer_ip: ip,
        signer_user_agent: ua,
        signature_hash,
        raw_snapshot: snapshot,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    await supabase.from('partner_onboarding_progress').upsert(
      {
        partner_id,
        step_key: 'agreement_signed',
        completed: true,
        completed_at: new Date().toISOString(),
        meta: { agreement_id: agreement.id, template_version: template_version || 'v1.0' },
      },
      { onConflict: 'partner_id,step_key' }
    );

    return new Response(
      JSON.stringify({ ok: true, agreement_id: agreement.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Partner sign agreement error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});