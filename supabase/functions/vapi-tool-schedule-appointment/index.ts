import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ScheduleAppointmentRequest {
  call: {
    id: string;
    phoneNumberId: string;
  };
  parameters: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    appointment_date: string;
    appointment_time: string;
    service_type?: string;
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

    const body: ScheduleAppointmentRequest = await req.json();
    console.log('Scheduling appointment from Vapi call:', body);

    // Get merchant from phone number
    const { data: config, error: configError } = await supabase
      .from('vapi_configurations')
      .select('merchant_id')
      .eq('phone_number_id', body.call.phoneNumberId)
      .single();

    if (configError || !config) {
      throw new Error('Merchant configuration not found');
    }

    // Find or create customer
    let customerId: string | null = null;

    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', body.parameters.customer_phone)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;

      // Update customer info if needed
      await supabase
        .from('customers')
        .update({
          name: body.parameters.customer_name,
          email: body.parameters.customer_email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customerId);
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: body.parameters.customer_name,
          phone: body.parameters.customer_phone,
          email: body.parameters.customer_email,
        })
        .select()
        .single();

      if (customerError) throw customerError;
      customerId = newCustomer.id;
    }

    // Combine date and time into a proper timestamp
    const appointmentDateTime = new Date(`${body.parameters.appointment_date}T${body.parameters.appointment_time}`);

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('admin_appointments')
      .insert({
        merchant_id: config.merchant_id,
        customer_id: customerId,
        customer_name: body.parameters.customer_name,
        customer_phone: body.parameters.customer_phone,
        customer_email: body.parameters.customer_email,
        appointment_date: appointmentDateTime.toISOString(),
        service_type: body.parameters.service_type || 'General Consultation',
        notes: body.parameters.notes,
        status: 'confirmed',
        source: 'voice_call',
      })
      .select()
      .single();

    if (appointmentError) throw appointmentError;

    // Log this tool call
    await supabase.rpc('log_vapi_tool_call', {
      p_merchant_id: config.merchant_id,
      p_call_id: body.call.id,
      p_tool_name: 'schedule_appointment',
      p_parameters: body.parameters,
      p_result: { appointment_id: appointment.id },
    });

    const formattedDate = appointmentDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = appointmentDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Appointment scheduled for ${body.parameters.customer_name} on ${formattedDate} at ${formattedTime}`,
      appointment_id: appointment.id,
      confirmation_details: {
        date: formattedDate,
        time: formattedTime,
        service: body.parameters.service_type || 'General Consultation',
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error scheduling appointment:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
