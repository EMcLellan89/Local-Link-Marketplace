import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CRMObject {
  type: string;
  table: string;
  requiredColumns: string[];
}

const CRM_OBJECTS: Record<string, CRMObject> = {
  contacts: {
    type: 'contacts',
    table: 'll_crm_contacts',
    requiredColumns: ['first_name', 'last_name', 'email', 'phone', 'merchant_id'],
  },
  tasks: {
    type: 'tasks',
    table: 'll_crm_tasks',
    requiredColumns: ['title', 'description', 'due_date', 'merchant_id'],
  },
  notes: {
    type: 'notes',
    table: 'll_crm_notes',
    requiredColumns: ['content', 'merchant_id'],
  },
  companies: {
    type: 'companies',
    table: 'll_crm_companies',
    requiredColumns: ['name', 'merchant_id'],
  },
  deals: {
    type: 'deals',
    table: 'll_crm_deals',
    requiredColumns: ['title', 'value', 'stage', 'merchant_id'],
  },
  activities: {
    type: 'activities',
    table: 'll_crm_activities',
    requiredColumns: ['type', 'title', 'merchant_id'],
  },
  pipeline: {
    type: 'pipeline',
    table: 'll_crm_pipelines',
    requiredColumns: ['name', 'merchant_id'],
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error('Admin access required');
    }

    // Get next pending installation from queue
    const { data: queueItem, error: queueError } = await supabase
      .from('crm_install_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (queueError || !queueItem) {
      return new Response(
        JSON.stringify({ success: true, message: 'No pending installations' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update status to installing
    await supabase
      .from('crm_install_queue')
      .update({ status: 'installing', started_at: new Date().toISOString() })
      .eq('id', queueItem.id);

    const objectsToInstall = queueItem.objects_to_install || [];
    const objectsInstalled: string[] = [];
    let errorMessage: string | null = null;

    // Install each CRM object
    for (const objectType of objectsToInstall) {
      try {
        const crmObject = CRM_OBJECTS[objectType];
        if (!crmObject) {
          console.warn(`Unknown CRM object type: ${objectType}`);
          continue;
        }

        // Check if table exists (basic verification)
        const { error: tableCheckError } = await supabase
          .from(crmObject.table)
          .select('id')
          .eq('merchant_id', queueItem.merchant_id)
          .limit(1);

        if (tableCheckError) {
          console.error(`Table ${crmObject.table} check failed:`, tableCheckError);
          // Table might not exist or has different schema, skip
          continue;
        }

        // Mark object as installed
        objectsInstalled.push(objectType);

        console.log(`Installed CRM object ${objectType} for merchant ${queueItem.merchant_id}`);
      } catch (err) {
        console.error(`Error installing ${objectType}:`, err);
        errorMessage = `Failed to install ${objectType}: ${err.message}`;
        break;
      }
    }

    // Update queue status
    const finalStatus = objectsInstalled.length === objectsToInstall.length ? 'completed' : 'failed';

    await supabase
      .from('crm_install_queue')
      .update({
        status: finalStatus,
        objects_installed: objectsInstalled,
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
      })
      .eq('id', queueItem.id);

    return new Response(
      JSON.stringify({
        success: finalStatus === 'completed',
        queue_id: queueItem.id,
        merchant_id: queueItem.merchant_id,
        objects_installed: objectsInstalled,
        objects_requested: objectsToInstall,
        error: errorMessage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('CRM auto-install error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
