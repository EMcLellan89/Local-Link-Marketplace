import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface LookupCustomerRequest {
  call: {
    id: string;
    phoneNumberId: string;
  };
  parameters: {
    phone?: string;
    email?: string;
    name?: string;
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

    const body: LookupCustomerRequest = await req.json();
    console.log('Looking up customer from Vapi call:', body);

    // Get merchant from phone number
    const { data: config, error: configError } = await supabase
      .from('vapi_configurations')
      .select('merchant_id')
      .eq('phone_number_id', body.call.phoneNumberId)
      .single();

    if (configError || !config) {
      throw new Error('Merchant configuration not found');
    }

    // Build query
    let query = supabase
      .from('customers')
      .select(`
        id,
        name,
        email,
        phone,
        created_at,
        customer_purchases!inner(
          id,
          deal_id,
          deals!inner(
            title,
            redemptions_used,
            redemptions_total
          )
        )
      `);

    // Add search criteria
    if (body.parameters.phone) {
      query = query.eq('phone', body.parameters.phone);
    } else if (body.parameters.email) {
      query = query.eq('email', body.parameters.email);
    } else if (body.parameters.name) {
      query = query.ilike('name', `%${body.parameters.name}%`);
    } else {
      throw new Error('Must provide phone, email, or name to lookup customer');
    }

    const { data: customers, error: customerError } = await query;

    if (customerError) throw customerError;

    if (!customers || customers.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        found: false,
        message: 'No customer found matching that information',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the first customer (or most relevant)
    const customer = customers[0];

    // Get recent appointments
    const { data: appointments } = await supabase
      .from('admin_appointments')
      .select('id, appointment_date, service_type, status')
      .eq('customer_id', customer.id)
      .eq('merchant_id', config.merchant_id)
      .order('appointment_date', { ascending: false })
      .limit(3);

    // Format customer data
    const customerInfo = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      customer_since: new Date(customer.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      }),
      total_purchases: customer.customer_purchases?.length || 0,
      active_deals: customer.customer_purchases?.filter((p: any) =>
        p.deals?.redemptions_used < p.deals?.redemptions_total
      ).length || 0,
      recent_appointments: appointments?.map((apt: any) => ({
        date: new Date(apt.appointment_date).toLocaleDateString('en-US'),
        service: apt.service_type,
        status: apt.status,
      })) || [],
    };

    // Log this tool call
    await supabase.rpc('log_vapi_tool_call', {
      p_merchant_id: config.merchant_id,
      p_call_id: body.call.id,
      p_tool_name: 'lookup_customer',
      p_parameters: body.parameters,
      p_result: { customer_id: customer.id, found: true },
    });

    return new Response(JSON.stringify({
      success: true,
      found: true,
      customer: customerInfo,
      message: `Found customer ${customer.name}. They have been a customer since ${customerInfo.customer_since} with ${customerInfo.total_purchases} total purchases.`,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error looking up customer:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
