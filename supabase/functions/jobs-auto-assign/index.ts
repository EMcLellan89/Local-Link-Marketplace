import { createClient } from 'jsr:@supabase/supabase-js@2';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { job_id } = await req.json();

    if (!job_id) {
      throw new Error('job_id is required');
    }

    // Check if job exists and is open
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', job_id)
      .single();

    if (jobError || !job) {
      throw new Error('Job not found');
    }

    if (job.status !== 'open') {
      throw new Error(`Job status is ${job.status}, cannot auto-assign`);
    }

    // Call the auto_assign_job function
    const { data: result, error: assignError } = await supabase.rpc(
      'auto_assign_job',
      {
        p_job_id: job_id,
        p_admin_id: user.id,
      }
    );

    if (assignError) {
      throw new Error(`Assignment failed: ${assignError.message}`);
    }

    if (!result.success) {
      throw new Error(result.error || 'Assignment failed');
    }

    // Get partner details for response
    const { data: partner } = await supabase
      .from('partners')
      .select('id, business_name, user_id')
      .eq('id', result.partner_id)
      .single();

    // Get partner score details
    const { data: score } = await supabase
      .from('partner_scores')
      .select('*')
      .eq('partner_id', result.partner_id)
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        assignment_id: result.assignment_id,
        partner: {
          id: partner?.id,
          business_name: partner?.business_name,
          score: score?.total_score,
          score_breakdown: {
            certifications: score?.certifications_score,
            activity: score?.activity_score,
            quality: score?.quality_score,
            availability: score?.availability_score,
          },
        },
        job_id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Auto-assign error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
