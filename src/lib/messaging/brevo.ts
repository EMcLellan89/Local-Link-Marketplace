type BrevoSendEmailParams = {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
  text?: string;
  tags?: string[];
};

export async function brevoSendEmail(p: BrevoSendEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("Missing BREVO_API_KEY");

  const fromEmail = process.env.BREVO_FROM_EMAIL || "no-reply@example.com";
  const fromName = process.env.BREVO_FROM_NAME || "Local-Link";

  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: fromName },
      to: p.to,
      subject: p.subject,
      htmlContent: p.html,
      textContent: p.text,
      tags: p.tags || [],
    }),
  });

  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json?.message || `Brevo send failed (${resp.status})`);
  return json;
}
