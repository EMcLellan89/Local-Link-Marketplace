import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { action, task_id, task_data } = body;

    const { data: merchantData, error: merchantError } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (merchantError || !merchantData) {
      throw new Error('Merchant not found');
    }

    let result;

    if (action === 'create') {
      const { title, description, due_date, priority = 'medium', lead_id } = task_data;

      if (!title || !due_date) {
        throw new Error('Title and due date are required');
      }

      const { data, error } = await supabase
        .from('crm_tasks')
        .insert({
          merchant_id: merchantData.id,
          lead_id,
          assigned_to: user.id,
          created_by: user.id,
          title,
          description,
          due_date,
          priority,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else if (action === 'update') {
      if (!task_id) {
        throw new Error('Task ID is required for update');
      }

      const { data, error } = await supabase
        .from('crm_tasks')
        .update(task_data)
        .eq('id', task_id)
        .eq('merchant_id', merchantData.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else if (action === 'complete') {
      if (!task_id) {
        throw new Error('Task ID is required');
      }

      const { data, error } = await supabase
        .from('crm_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', task_id)
        .eq('merchant_id', merchantData.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else if (action === 'delete') {
      if (!task_id) {
        throw new Error('Task ID is required');
      }

      const { error } = await supabase
        .from('crm_tasks')
        .delete()
        .eq('id', task_id)
        .eq('merchant_id', merchantData.id);

      if (error) throw error;
      result = { deleted: true };
    } else {
      throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
