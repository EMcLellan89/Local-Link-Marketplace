type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendPartnerEmail({ to, subject, html, text }: SendEmailArgs) {
  const provider = import.meta.env.VITE_EMAIL_PROVIDER || 'console';

  if (!provider || provider === 'console') {
    console.log("[EMAIL:DEV]", { to, subject, html: html.slice(0, 200) + "..." });
    return { ok: true, mode: "dev" };
  }

  if (provider === "brevo") {
    console.warn("Brevo email provider configured. Sending via edge function to:", to);
    return { ok: false, error: "Use send-email edge function for Brevo", mode: "edge_function" };
  }

  console.warn(`Unknown EMAIL_PROVIDER: ${provider}. Email would be sent to:`, to);
  return { ok: false, error: `Unknown provider: ${provider}`, mode: "not_configured" };
}
