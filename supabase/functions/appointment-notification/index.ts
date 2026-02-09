import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { appointmentId, customerName, customerEmail, customerPhone, appointmentDate, appointmentType } = await req.json();

    const formattedDate = new Date(appointmentDate).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const emailBody = `
New Appointment Booking

Appointment Details:
- ID: ${appointmentId}
- Customer: ${customerName}
- Email: ${customerEmail}
- Phone: ${customerPhone || 'Not provided'}
- Type: ${appointmentType}
- Date/Time: ${formattedDate}

Please confirm this appointment with the customer.
    `;

    console.log('Appointment booked - Email would be sent to apptpipeline@gmail.com');
    console.log(emailBody);

    const data = {
      success: true,
      message: 'Appointment notification processed',
      appointmentId,
      notificationEmail: 'apptpipeline@gmail.com'
    };

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing appointment notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});