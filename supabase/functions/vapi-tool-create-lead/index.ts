import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CreateLeadRequest {
  call: {
    id: string;
    phoneNumberId: string;
  };
  parameters: {
    name: string;
    email?: string;
    phone: string;
    notes?: string;
    source?: string;
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

    const body: CreateLeadRequest = await req.json();
    console.log('Creating lead from Vapi call:', body);

    // Get merchant from phone number
    const { data: config, error: configError } = await supabase
      .from('vapi_configurations')
      .select('merchant_id')
      .eq('phone_number_id', body.call.phoneNumberId)
      .single();

    if (configError || !config) {
      throw new Error('Merchant configuration not found');
    }

    // Check if lead/customer already exists
    const { data: existingLead } = await supabase
      .from('crm_leads')
      .select('id')
      .eq('merchant_id', config.merchant_id)
      .eq('phone', body.parameters.phone)
      .maybeSingle();

    if (existingLead) {
      // Update existing lead
      const { data: updatedLead, error: updateError } = await supabase
        .from('crm_leads')
        .update({
          name: body.parameters.name,
          email: body.parameters.email,
          notes: body.parameters.notes,
          source: body.parameters.source || 'voice_call',
          last_contacted: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return new Response(JSON.stringify({
        success: true,
        message: `Updated existing lead for ${body.parameters.name}`,
        lead_id: updatedLead.id,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create new lead
    const { data: newLead, error: createError } = await supabase
      .from('crm_leads')
      .insert({
        merchant_id: config.merchant_id,
        name: body.parameters.name,
        email: body.parameters.email,
        phone: body.parameters.phone,
        notes: body.parameters.notes,
        source: body.parameters.source || 'voice_call',
        status: 'new',
        last_contacted: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) throw createError;

    // Log this tool call
    await supabase.rpc('log_vapi_tool_call', {
      p_merchant_id: config.merchant_id,
      p_call_id: body.call.id,
      p_tool_name: 'create_lead',
      p_parameters: body.parameters,
      p_result: { lead_id: newLead.id },
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Created new lead for ${body.parameters.name}`,
      lead_id: newLead.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
