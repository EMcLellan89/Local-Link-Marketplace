import Twilio from "twilio";

export function twilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  return Twilio(sid, token);
}

export async function twilioSendSMS(params: { to: string; body: string }) {
  const client = twilioClient();
  const from = process.env.TWILIO_FROM_NUMBER;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  if (!from && !messagingServiceSid) throw new Error("Missing TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID");

  const msg = await client.messages.create({
    to: params.to,
    body: params.body,
    ...(messagingServiceSid ? { messagingServiceSid } : { from }),
  });

  return msg.sid;
}
