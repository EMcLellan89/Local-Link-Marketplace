export type NormalizedEvent =
  | {
      provider: "gopaybright";
      eventId: string;
      eventTypeRaw: string;
      type: "payment_succeeded";
      externalPaymentId: string;
      amount: number;
      currency: string;
      meta: any;
    }
  | {
      provider: "gopaybright";
      eventId: string;
      eventTypeRaw: string;
      type: "payment_refunded";
      externalPaymentId: string;
      amount: number;
      currency: string;
      meta: any;
    }
  | {
      provider: "gopaybright";
      eventId: string;
      eventTypeRaw: string;
      type: "payment_chargeback";
      externalPaymentId: string;
      amount: number;
      currency: string;
      meta: any;
    };

function header(req: Request, ...names: string[]) {
  for (const n of names) {
    const v = req.headers.get(n) || req.headers.get(n.toLowerCase());
    if (v) return v;
  }
  return "";
}

export function sha256Hex(buf: Uint8Array): string {
  const crypto = globalThis.crypto;
  if (!crypto || !crypto.subtle) {
    throw new Error("Web Crypto API not available");
  }

  return crypto.subtle.digest('SHA-256', buf).then(hash => {
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }) as any;
}

export async function verifyHmacSHA256(args: {
  secret: string;
  signature: string;
  rawBody: Uint8Array;
  timestamp?: string;
  tolerateTimestampSkewSeconds?: number;
}) {
  const { secret, signature, rawBody } = args;

  const sig = signature.replace(/^sha256=/, "").trim().toLowerCase();
  if (!sig) throw new Error("Empty signature");

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  const crypto = globalThis.crypto;
  if (!crypto || !crypto.subtle) {
    throw new Error("Web Crypto API not available");
  }

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const h1Buffer = await crypto.subtle.sign('HMAC', key, rawBody);
  const h1 = Array.from(new Uint8Array(h1Buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toLowerCase();

  let h2 = "";
  if (args.timestamp) {
    const combined = encoder.encode(`${args.timestamp}.${new TextDecoder().decode(rawBody)}`);
    const h2Buffer = await crypto.subtle.sign('HMAC', key, combined);
    h2 = Array.from(new Uint8Array(h2Buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toLowerCase();
  }

  const ok = sig === h1 || (h2 && sig === h2);
  if (!ok) throw new Error("Invalid signature");

  if (args.timestamp) {
    const skew = args.tolerateTimestampSkewSeconds ?? 300;
    const ts = Number(args.timestamp);
    if (!Number.isFinite(ts)) return true;

    const now = Math.floor(Date.now() / 1000);
    const diff = Math.abs(now - ts);
    if (diff > skew) throw new Error(`Timestamp outside tolerance (${diff}s > ${skew}s)`);
  }

  return true;
}

export async function verifyGoPayBrightWebhook(req: Request, rawBody: Uint8Array) {
  const secret = import.meta.env.VITE_GOPAYBRIGHT_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing GOPAYBRIGHT_WEBHOOK_SECRET");

  const signature =
    header(req, "X-Signature", "X-Webhook-Signature", "GoPayBright-Signature", "Gopaybright-Signature") || "";

  if (!signature) throw new Error("Missing signature header");

  const timestamp = header(req, "X-Timestamp", "X-Webhook-Timestamp", "GoPayBright-Timestamp") || undefined;

  await verifyHmacSHA256({
    secret,
    signature,
    rawBody,
    timestamp,
    tolerateTimestampSkewSeconds: 300,
  });

  return true;
}

function pickEventType(payload: any) {
  return String(payload?.type || payload?.event || payload?.name || payload?.event_type || "").trim();
}

function pickData(payload: any) {
  return payload?.data ?? payload?.payload ?? payload?.object ?? payload;
}

function pickEventId(payload: any) {
  return String(payload?.event_id || payload?.eventId || payload?.id || payload?.data?.event_id || payload?.data?.id || "");
}

function pickPaymentId(data: any, payload: any) {
  return String(
    data?.payment_id ||
      data?.paymentId ||
      data?.paymentID ||
      data?.id ||
      payload?.payment_id ||
      payload?.paymentId ||
      payload?.id ||
      ""
  );
}

function pickAmount(data: any, payload: any) {
  const v = data?.amount ?? data?.gross_amount ?? data?.grossAmount ?? data?.total ?? payload?.amount ?? 0;
  return Number(v || 0) || 0;
}

function pickCurrency(data: any, payload: any) {
  const v = data?.currency ?? data?.currency_code ?? data?.currencyCode ?? payload?.currency ?? "USD";
  return String(v).toUpperCase();
}

function pickMeta(data: any, payload: any) {
  return data?.metadata ?? data?.meta ?? data?.custom_fields ?? payload?.metadata ?? payload?.meta ?? {};
}

function mapEventType(raw: string) {
  const t = raw.toLowerCase();
  if (t.includes("succeed") || t.includes("paid") || t.includes("payment_success") || t.includes("captured")) {
    return "payment_succeeded" as const;
  }
  if (t.includes("refund")) return "payment_refunded" as const;
  if (t.includes("chargeback") || t.includes("dispute")) return "payment_chargeback" as const;
  return null;
}

export function normalizeGoPayBrightEvent(payload: any): NormalizedEvent | null {
  const eventTypeRaw = pickEventType(payload);
  const eventId = pickEventId(payload);
  const data = pickData(payload);

  const mapped = mapEventType(eventTypeRaw);
  if (!mapped) return null;

  const externalPaymentId = pickPaymentId(data, payload);
  const amount = pickAmount(data, payload);
  const currency = pickCurrency(data, payload);
  const meta = pickMeta(data, payload);

  if (!eventId) return null;

  return {
    provider: "gopaybright",
    eventId,
    eventTypeRaw,
    type: mapped,
    externalPaymentId,
    amount,
    currency,
    meta,
  };
}
