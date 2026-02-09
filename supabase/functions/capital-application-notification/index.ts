import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CapitalApplication {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessType: string;
  yearsInBusiness: string;
  monthlyRevenue: string;
  loanAmount: string;
  useOfFunds: string;
  timelineNeeded: string;
  creditScore: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const application: CapitalApplication = await req.json();

    const emailBody = `
New Business Capital Application Received

CONTACT INFORMATION:
- Name: ${application.firstName} ${application.lastName}
- Email: ${application.email}
- Business Phone: ${application.businessPhone}

BUSINESS DETAILS:
- Business Name: ${application.businessName}
- Business Address: ${application.businessAddress}
- Business Type: ${application.businessType}
- Years in Business: ${application.yearsInBusiness}

FINANCIAL INFORMATION:
- Average Monthly Revenue: ${application.monthlyRevenue}
- Loan Amount Requested: ${application.loanAmount}
- Use of Funds: ${application.useOfFunds}
- Timeline Needed: ${application.timelineNeeded}
- Estimated Credit Score: ${application.creditScore}

Agent Contact: Erica McLellan - apptpipeline@gmail.com

---
This application has been saved to the database and the customer will be redirected to schedule a consultation.
    `.trim();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      console.log("Application details:", emailBody);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Application logged (email service not configured)",
          emailPreview: emailBody
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LocalLink <noreply@locallinkmarketplace.com>",
        to: ["apptpipeline@gmail.com"],
        subject: `New Business Capital Application - ${application.businessName}`,
        text: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Email send failed:", errorText);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send email notification",
          details: errorText
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailData = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification sent successfully",
        emailId: emailData.id
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error processing capital application notification:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
