type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendPartnerEmail({ to, subject, html }: SendEmailArgs) {
  const provider = import.meta.env.VITE_EMAIL_PROVIDER || 'console';

  if (!provider || provider === 'console') {
    console.log("[EMAIL:DEV]", { to, subject, html: html.slice(0, 200) + "..." });
    return { ok: true, mode: "dev" };
  }

  if (provider === "sendgrid") {
    console.warn("SendGrid email provider not yet implemented. Email would be sent to:", to);
    return { ok: false, error: "SendGrid not implemented", mode: "not_configured" };
  }

  if (provider === "resend") {
    console.warn("Resend email provider not yet implemented. Email would be sent to:", to);
    return { ok: false, error: "Resend not implemented", mode: "not_configured" };
  }

  console.warn(`Unknown EMAIL_PROVIDER: ${provider}. Email would be sent to:`, to);
  return { ok: false, error: `Unknown provider: ${provider}`, mode: "not_configured" };
}
