import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

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

    const { application_id, temp_password } = await req.json();

    if (!application_id || !temp_password) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: app, error: fetchError } = await supabaseClient
      .from('partner_applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (fetchError || !app) {
      return new Response(JSON.stringify({ error: 'Application not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: newUser, error: userError } = await supabaseClient.auth.admin.createUser({
      email: app.email,
      password: temp_password,
      email_confirm: true,
    });

    if (userError) {
      return new Response(JSON.stringify({ error: `User creation failed: ${userError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabaseClient.from('profiles').update({ role: 'merchant' }).eq('id', newUser.user.id);

    const { data: partner, error: partnerError } = await supabaseClient
      .from('partners')
      .insert({
        user_id: newUser.user.id,
        company_name: app.company_name,
        primary_contact: app.contact_name,
        email: app.email,
        phone: app.phone,
        partner_type: app.partner_type,
        status: 'Active',
        certification_level: 'Local',
        rev_share_percent: 70.0,
        white_label_enabled: false,
      })
      .select()
      .single();

    if (partnerError) {
      await supabaseClient.auth.admin.deleteUser(newUser.user.id);
      return new Response(JSON.stringify({ error: `Partner creation failed: ${partnerError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabaseClient.from('certifications').insert({
      partner_id: partner.id,
      training_completed_percent: 0,
      compliance_score: 100,
      violations_count: 0,
      status: 'Active',
    });

    const { data: territory } = await supabaseClient
      .from('territories')
      .select('*')
      .ilike('territory_name', app.requested_territory)
      .eq('status', 'Available')
      .single();

    let territoryAssigned = false;
    let territoryId = null;

    if (territory) {
      const { error: assignError } = await supabaseClient
        .from('territories')
        .update({
          status: 'Assigned',
          assigned_partner_id: partner.id,
          launch_date: null,
        })
        .eq('id', territory.id);

      if (!assignError) {
        territoryAssigned = true;
        territoryId = territory.id;
      }
    }

    await supabaseClient
      .from('partner_applications')
      .update({
        status: territoryAssigned ? 'Approved' : 'Waitlisted',
        admin_notes: territoryAssigned
          ? `Approved and assigned territory: ${app.requested_territory}`
          : `Approved but waitlisted (territory ${app.requested_territory} unavailable)`,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', application_id);

    await supabaseClient.from('profiles').update({ partner_id: partner.id }).eq('id', newUser.user.id);

    await supabaseClient.from('audit_logs').insert({
      actor_user_id: user.id,
      action: 'PARTNER_APPLICATION_APPROVED',
      entity_type: 'PartnerApplication',
      entity_id: application_id,
      metadata_json: {
        partner_id: partner.id,
        territory_assigned: territoryAssigned,
        territory_id: territoryId,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        partner_id: partner.id,
        territory_assigned: territoryAssigned,
        territory_id: territoryId,
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