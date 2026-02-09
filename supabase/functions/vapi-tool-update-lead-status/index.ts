import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface UpdateLeadStatusRequest {
  call: {
    id: string;
    phoneNumberId: string;
  };
  parameters: {
    phone: string;
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
    notes?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: UpdateLeadStatusRequest = await req.json();
    console.log('Updating lead status from Vapi call:', body);

    // Get merchant from phone number
    const { data: config, error: configError } = await supabase
      .from('vapi_configurations')
      .select('merchant_id')
      .eq('phone_number_id', body.call.phoneNumberId)
      .single();

    if (configError || !config) {
      throw new Error('Merchant configuration not found');
    }

    // Find lead by phone
    const { data: lead, error: leadError } = await supabase
      .from('crm_leads')
      .select('id, name, status')
      .eq('merchant_id', config.merchant_id)
      .eq('phone', body.parameters.phone)
      .maybeSingle();

    if (leadError) throw leadError;

    if (!lead) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No lead found with that phone number',
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update lead status
    const updateData: any = {
      status: body.parameters.status,
      last_contacted: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (body.parameters.notes) {
      updateData.notes = body.parameters.notes;
    }

    const { data: updatedLead, error: updateError } = await supabase
      .from('crm_leads')
      .update(updateData)
      .eq('id', lead.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log this tool call
    await supabase.rpc('log_vapi_tool_call', {
      p_merchant_id: config.merchant_id,
      p_call_id: body.call.id,
      p_tool_name: 'update_lead_status',
      p_parameters: body.parameters,
      p_result: { lead_id: lead.id, previous_status: lead.status, new_status: body.parameters.status },
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Updated ${lead.name}'s status from ${lead.status} to ${body.parameters.status}`,
      lead_id: updatedLead.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
