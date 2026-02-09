import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SERVICE_TO_PRODUCT_KEY: Record<string, string> = {
  marketing: 'marketing',
  crm_migration: 'crm_migration',
  ai_automations: 'ai_automations',
  ad_swipe_file: 'ad_swipe_file',
  website_services: 'website_services',
  printing_services: 'printing_services',
  ugc_content: 'ugc_content',
  leads_outreach: 'leads_outreach',
  appointment_setting: 'appointment_setting',
  recruiting_tools: 'recruiting_tools',
  postcard_advertising: 'postcard_advertising',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get the authorization token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { service_slug, title, description, budget, due_at } = body;

    if (!service_slug || !title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: service_slug, title' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1) Find merchant record belonging to this merchant user
    const { data: merchant, error: mErr } = await supabase
      .from('merchants')
      .select('id,status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (mErr) {
      return new Response(
        JSON.stringify({ error: 'Database error', details: mErr.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!merchant) {
      return new Response(
        JSON.stringify({ error: 'Merchant record not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (merchant.status !== 'Active') {
      return new Response(
        JSON.stringify({ error: 'Merchant is not active' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2) Map slug → product_key
    const service_product_key = SERVICE_TO_PRODUCT_KEY[service_slug];
    if (!service_product_key) {
      return new Response(
        JSON.stringify({ error: 'Invalid service slug' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3) Get system admin ID (first admin user)
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .maybeSingle();

    if (!adminProfile) {
      return new Response(
        JSON.stringify({ error: 'No admin user found in system' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4) Create job
    const { data: job, error: jErr } = await supabase
      .from('jobs')
      .insert({
        created_by_admin_id: adminProfile.id,
        merchant_id: merchant.id,
        service_product_key,
        title: title.trim(),
        description: description ? description.trim() : null,
        budget: budget ? Number(budget) : null,
        due_at: due_at || null,
        status: 'open',
      })
      .select('id,status,created_at')
      .single();

    if (jErr) {
      return new Response(
        JSON.stringify({ error: 'Failed to create job', details: jErr.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, job }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in merchant-create-job:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});