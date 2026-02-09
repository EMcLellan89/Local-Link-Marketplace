import { createClient } from 'npm:@supabase/supabase-js@2';
import QRCode from 'npm:qrcode@1.5.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function buildLockedUrl(dealId: string, baseUrl: string): string {
  return `${baseUrl}/deal/${dealId}`;
}

function isAllowedLockedUrl(url: string): boolean {
  return url.includes('/deal/') || url.includes('/territory/');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { deal_id } = await req.json();

    if (!deal_id) {
      return new Response(JSON.stringify({ error: 'Deal ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: deal, error: dealError } = await supabaseClient
      .from('deals')
      .select('*, merchants!inner(*), partners!inner(*), territories!inner(*)')
      .eq('id', deal_id)
      .single();

    if (dealError || !deal) {
      return new Response(JSON.stringify({ error: 'Deal not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: partner } = await supabaseClient
      .from('partners')
      .select('*')
      .eq('id', deal.partner_id)
      .single();

    if (!partner) {
      return new Response(JSON.stringify({ error: 'Partner not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: cert } = await supabaseClient
      .from('certifications')
      .select('*')
      .eq('partner_id', partner.id)
      .single();

    if (!cert) {
      return new Response(
        JSON.stringify({ error: 'Partner certification record not found' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (partner.status !== 'Active') {
      return new Response(
        JSON.stringify({ error: `Partner status is ${partner.status}, must be Active` }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (cert.status !== 'Active') {
      return new Response(
        JSON.stringify({ error: `Certification status is ${cert.status}, must be Active` }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (cert.training_completed_percent < 100) {
      return new Response(
        JSON.stringify({
          error: `Training only ${cert.training_completed_percent}% complete. Must be 100% to publish deals.`,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const baseUrl = Deno.env.get('APP_URL') || Deno.env.get('SUPABASE_URL') || 'https://locallink.com';
    const lockedUrl = buildLockedUrl(deal.id, baseUrl);

    if (!isAllowedLockedUrl(lockedUrl)) {
      return new Response(JSON.stringify({ error: 'QR URL blocked by compliance rules' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const qrDataUrl = await QRCode.toDataURL(lockedUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 512,
      margin: 2,
    });

    const { data: qrCode, error: qrError } = await supabaseClient
      .from('qr_codes')
      .insert({
        created_by_partner_id: partner.id,
        destination_type: 'Deal',
        destination_id: deal.id,
        locked_url: lockedUrl,
        compliance_status: 'Valid',
        scan_count: 0,
      })
      .select()
      .single();

    if (qrError) {
      return new Response(JSON.stringify({ error: `QR creation failed: ${qrError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: updateError } = await supabaseClient
      .from('deals')
      .update({
        status: deal.status === 'draft' ? 'active' : 'active',
        qr_code_id: qrCode.id,
      })
      .eq('id', deal.id);

    if (updateError) {
      return new Response(JSON.stringify({ error: `Deal update failed: ${updateError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: territory } = await supabaseClient
      .from('territories')
      .select('*')
      .eq('id', deal.territory_id)
      .single();

    if (territory && !territory.launch_date) {
      await supabaseClient
        .from('territories')
        .update({ launch_date: new Date().toISOString() })
        .eq('id', territory.id);
    }

    await supabaseClient.from('audit_logs').insert({
      actor_user_id: user.id,
      action: 'DEAL_APPROVED',
      entity_type: 'Deal',
      entity_id: deal.id,
      metadata_json: {
        qr_code_id: qrCode.id,
        partner_id: partner.id,
        certification_level: cert.training_completed_percent,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        deal_id: deal.id,
        qr_code_id: qrCode.id,
        qr_data_url: qrDataUrl,
        locked_url: lockedUrl,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});