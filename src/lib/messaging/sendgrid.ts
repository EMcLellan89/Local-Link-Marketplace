type SendgridSendEmailParams = {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendgridSendEmail(p: SendgridSendEmailParams) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error("Missing SENDGRID_API_KEY");

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || "no-reply@example.com";
  const fromName = process.env.SENDGRID_FROM_NAME || "Local-Link";

  const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: p.to }],
      from: { email: fromEmail, name: fromName },
      subject: p.subject,
      content: [
        { type: "text/plain", value: p.text || "" },
        { type: "text/html", value: p.html },
      ],
    }),
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`SendGrid send failed (${resp.status}): ${t}`);
  }
  return { ok: true };
}
