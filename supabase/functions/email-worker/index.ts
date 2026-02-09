import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmailQueueItem {
  id: string;
  user_id: string;
  template_key: string;
  payload: Record<string, any>;
  send_after: string;
}

interface EmailTemplate {
  template_key: string;
  name: string;
  subject_line: string;
  category: string;
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch queued emails due to send
    const { data: queuedEmails, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'queued')
      .lte('send_after', new Date().toISOString())
      .limit(50);

    if (fetchError) {
      throw fetchError;
    }

    if (!queuedEmails || queuedEmails.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: 'No emails to send' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each email
    for (const email of queuedEmails as EmailQueueItem[]) {
      try {
        // Get template info
        const { data: template } = await supabase
          .from('system_email_templates')
          .select('*')
          .eq('template_key', email.template_key)
          .single();

        if (!template) {
          throw new Error(`Template ${email.template_key} not found`);
        }

        const emailContent = buildEmailContent(email.template_key, email.payload, template as EmailTemplate);

        // Send via Resend (if API key configured)
        if (RESEND_API_KEY) {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'Local-Link <noreply@locallink.com>',
              to: email.payload.email,
              subject: template.subject_line,
              html: emailContent.html,
              text: emailContent.text,
            }),
          });

          if (!resendResponse.ok) {
            const errorData = await resendResponse.text();
            throw new Error(`Resend API error: ${errorData}`);
          }
        }

        // Mark as sent
        await supabase
          .from('email_queue')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', email.id);

        results.sent++;
      } catch (error) {
        // Mark as failed
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            error_message: String(error),
            updated_at: new Date().toISOString(),
          })
          .eq('id', email.id);

        results.failed++;
        results.errors.push(`${email.template_key}: ${String(error)}`);
      }
    }

    return new Response(
      JSON.stringify({
        processed: queuedEmails.length,
        sent: results.sent,
        failed: results.failed,
        errors: results.errors,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Email worker error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function buildEmailContent(
  templateKey: string,
  payload: Record<string, any>,
  template: EmailTemplate
): { html: string; text: string } {
  const baseUrl = payload.base_url || 'https://locallink.com';

  switch (templateKey) {
    case 'SRR_PURCHASED_ACCESS':
      return {
        html: `
          <h1>Welcome to Selling Recurring Revenue™</h1>
          <p>You're all set! Your course is ready.</p>
          <p><strong>Quick Start:</strong> Complete Module 1 today (15 minutes)</p>
          <p><a href="${baseUrl}/learn/selling-recurring-revenue" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Start Module 1</a></p>
          <p>What you'll learn:</p>
          <ul>
            <li>Why recurring beats one-time</li>
            <li>The 3 recurring offer types</li>
            <li>What local businesses pay monthly for</li>
            <li>Pricing psychology</li>
            <li>Building your MRR offer stack</li>
          </ul>
          <p>See you inside,<br>The Local-Link Team</p>
        `,
        text: `Welcome to Selling Recurring Revenue™\n\nYou're all set! Your course is ready.\n\nQuick Start: Complete Module 1 today (15 minutes)\n\nStart here: ${baseUrl}/learn/selling-recurring-revenue\n\nSee you inside,\nThe Local-Link Team`,
      };

    case 'SRR_TOOLKIT_UPSELL':
      return {
        html: `
          <h1>Skip guessing — use the templates</h1>
          <p>You have the course. Now get the toolkit that makes it ridiculously easy.</p>
          <p><strong>Pro Toolkit includes:</strong></p>
          <ul>
            <li>✓ Interactive pricing calculator</li>
            <li>✓ Proposal templates (3 versions)</li>
            <li>✓ Onboarding checklist template</li>
            <li>✓ Role-play objection library</li>
            <li>✓ Close + onboarding pipeline blueprint</li>
          </ul>
          <p><a href="${payload.upsell_url || baseUrl + '/one-click-upsell/selling-recurring-revenue-pro-toolkit'}" style="display:inline-block;padding:12px 24px;background:#10b981;color:white;text-decoration:none;border-radius:6px;">Add Toolkit for $97</a></p>
          <p>Stop guessing. Start executing.</p>
        `,
        text: `Skip guessing — use the templates\n\nYou have the course. Now get the toolkit that makes it ridiculously easy.\n\nPro Toolkit includes:\n- Interactive pricing calculator\n- Proposal templates\n- Onboarding checklist\n- Objection scripts\n- Pipeline blueprint\n\nAdd it here: ${payload.upsell_url || baseUrl + '/one-click-upsell/selling-recurring-revenue-pro-toolkit'}`,
      };

    case 'SRR_FIRST_OFFER':
      return {
        html: `
          <h1>Your first recurring offer in 15 minutes</h1>
          <p>You've learned the foundations. Now it's time to build your offer.</p>
          <p><strong>Quick exercise:</strong></p>
          <ol>
            <li>Pick your niche (who you help)</li>
            <li>Write your promise statement</li>
            <li>Build your 3-tier pricing ladder</li>
          </ol>
          <p><a href="${baseUrl}/learn/selling-recurring-revenue" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Continue Module 2</a></p>
          <p>The faster you build it, the faster you can start selling.</p>
        `,
        text: `Your first recurring offer in 15 minutes\n\nYou've learned the foundations. Now build your offer:\n1. Pick your niche\n2. Write your promise\n3. Build your 3-tier pricing\n\nContinue here: ${baseUrl}/learn/selling-recurring-revenue`,
      };

    case 'SRR_BUNDLE_ACCESS':
      return {
        html: `
          <h1>Access + Toolkit download</h1>
          <p>You're all set with the complete bundle!</p>
          <p><strong>Course Access:</strong> <a href="${baseUrl}/learn/selling-recurring-revenue">Start Module 1</a></p>
          <p><strong>Pro Toolkit:</strong> All templates are available in each module</p>
          <p><strong>Start here:</strong> Use the pricing calculator today to build your first tier ladder.</p>
          <p><a href="${baseUrl}/learn/selling-recurring-revenue/lesson/build-your-three-tier-ladder" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">Use Pricing Calculator</a></p>
        `,
        text: `Access + Toolkit download\n\nYou're all set with the complete bundle!\n\nCourse: ${baseUrl}/learn/selling-recurring-revenue\nToolkit: Available in each module\n\nStart by using the pricing calculator today.`,
      };

    case 'SRR_CERTIFIED_CRM':
      return {
        html: `
          <h1>Certified → earn commissions</h1>
          <p>Congrats on passing the exam!</p>
          <p>Now activate Partner CRM to start earning 30% commissions on course referrals.</p>
          <p><strong>What you get:</strong></p>
          <ul>
            <li>30% recurring commission on all referrals</li>
            <li>Custom referral link</li>
            <li>Real-time commission tracking</li>
            <li>Monthly payouts</li>
          </ul>
          <p><a href="${baseUrl}/partner/crm/upgrade" style="display:inline-block;padding:12px 24px;background:#10b981;color:white;text-decoration:none;border-radius:6px;">Activate Partner CRM ($49/mo)</a></p>
        `,
        text: `Certified → earn commissions\n\nCongrats on passing!\n\nActivate Partner CRM to earn 30% commissions.\n\nLearn more: ${baseUrl}/partner/crm/upgrade`,
      };

    default:
      return {
        html: `<h1>${template.name}</h1><p>Email content for ${templateKey}</p>`,
        text: `${template.name}\n\nEmail content for ${templateKey}`,
      };
  }
}