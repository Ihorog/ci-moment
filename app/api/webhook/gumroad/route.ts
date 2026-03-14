import { NextResponse } from 'next/server';
import { updatePaymentFixation } from '@/lib/paymentFixation';

function getHeader(req: Request, name: string) {
  return req.headers.get(name) || req.headers.get(name.toLowerCase());
}

// Explicit types for parsed body and passthrough
async function readBody(req: Request): Promise<Record<string, string>> {
  const ct = req.headers.get('content-type') || '';
  const raw = await req.text();
  // Gumroad commonly posts x-www-form-urlencoded
  if (ct.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    const out: Record<string, string> = {};
    for (const [k, v] of params.entries()) out[k] = v;
    return out;
  }
  // JSON fallback
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

type PassthroughType = {
  verify_hash?: string;
  verifyHash?: string;
  sale_id?: string;
  order_id?: string;
  transaction_id?: string;
  payment_id?: string;
  [key: string]: unknown;
};

function parsePassthrough(passthrough: unknown): PassthroughType | null {
  if (!passthrough) return null;
  if (typeof passthrough === 'string') {
    try {
      return JSON.parse(passthrough);
    } catch {
      return { raw: passthrough };
    }
  }
  if (typeof passthrough === 'object') return passthrough as PassthroughType;
  return null;
}

export async function POST(request: Request) {
  const secret = process.env.GUMROAD_WEBHOOK_SECRET;
  const provided = getHeader(request, 'x-ci-webhook-secret');

  // secure-by-default: never accept sealing without an explicit secret configured
  if (!secret) {
    return NextResponse.json({ error: 'webhook_disabled' }, { status: 503 });
  }
  if (!provided) {
    return NextResponse.json({ error: 'missing_secret' }, { status: 503 });
  }
  if (provided !== secret) {
    return NextResponse.json({ error: 'invalid_secret' }, { status: 403 });
  }

  const body = await readBody(request);

  // Gumroad fields vary; passthrough is the stable carrier for our verify_hash
  const pt = parsePassthrough(body.passthrough);
  const verifyHash = pt?.verify_hash || pt?.verifyHash || body.verify_hash;

  // Payment id candidates
  const paymentId =
    body.sale_id ||
    body.order_id ||
    body.transaction_id ||
    body.purchase_id ||
    pt?.sale_id ||
    pt?.order_id ||
    pt?.transaction_id ||
    pt?.payment_id;

  if (!verifyHash || !paymentId) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  // idempotency should be handled inside updatePaymentFixation
  await updatePaymentFixation(
    { verifyHash: String(verifyHash), provider: 'gumroad' },
    { paymentId: String(paymentId) }
  );

  return NextResponse.json({ ok: true });
}