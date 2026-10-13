import { NextRequest, NextResponse } from 'next/server';
import {
  bindPaddleTransaction,
  validatePtxnSyntax,
  type PaddleTxnBindingInput,
} from '../../../../../lib/payments/paddlePaymentLink.mts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET/POST /api/payment/paddle/payment-link?_ptxn=txn_...
 * Fail-closed: validates syntax, live config, webhook readiness, persistence,
 * public launch gate; retrieves txn via authenticated Paddle API; binds ci_orders.
 * Returns only browser-safe fields on success.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}

async function handle(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const ptxn =
      url.searchParams.get('_ptxn') ||
      url.searchParams.get('ptxn') ||
      (await safeBodyPtxn(req));

    if (!validatePtxnSyntax(ptxn)) {
      return NextResponse.json(
        { error: 'INVALID_PTXN', message: 'Invalid _ptxn syntax' },
        { status: 400 }
      );
    }

    const paddleConfigured = Boolean(
      process.env.PADDLE_API_KEY && process.env.PADDLE_PRICE_ID && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
    );
    const webhookReady = Boolean(process.env.PADDLE_WEBHOOK_SECRET);
    const persistenceReady = Boolean(
      process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
    );
    const publicLaunchGateOpen =
      process.env.CI_PUBLIC_LAUNCH_GATE === 'open' ||
      process.env.NEXT_PUBLIC_CI_LAUNCH_GATE === 'open';

    if (!paddleConfigured || !webhookReady || !persistenceReady || !publicLaunchGateOpen) {
      return NextResponse.json(
        {
          error: 'PRECONDITION_FAILED',
          message: 'Live Paddle path not ready (config / webhook / persistence / launch gate)',
        },
        { status: 503 }
      );
    }

    // Authenticated retrieve — implementation uses Paddle API when key present.
    // Without network/credentials in this environment we still enforce contract
    // shape via bind after a structured fetch attempt.
    const txn = await retrievePaddleTransaction(ptxn!);
    if (!txn.ok) {
      return NextResponse.json({ error: txn.code, message: txn.message }, { status: txn.status });
    }

    const order = await lookupCiOrder(txn.localOrderId, ptxn!);
    if (!order.ok) {
      return NextResponse.json({ error: order.code, message: order.message }, { status: 404 });
    }

    const input: PaddleTxnBindingInput = {
      ptxnId: ptxn!,
      priceId: txn.priceId,
      quantity: txn.quantity,
      totalUsd: txn.totalUsd,
      currency: txn.currency,
      isTest: txn.isTest,
      customData: txn.customData,
      localOrderIdFromDb: order.localOrderId,
      providerTransactionIdFromDb: order.providerTransactionId,
      orderStatus: order.status,
      paddleConfigured: true,
      webhookReady: true,
      persistenceReady: true,
      publicLaunchGateOpen: true,
    };

    const bound = bindPaddleTransaction(input, {
      clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      environment: process.env.PADDLE_ENV === 'sandbox' ? 'sandbox' : 'production',
    });

    if (!bound.ok) {
      return NextResponse.json(
        { error: bound.code, message: bound.message },
        { status: 422 }
      );
    }

    return NextResponse.json(bound.safe, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json(
      { error: 'INTERNAL', message: 'Payment link resolution failed' },
      { status: 500 }
    );
  }
}

async function safeBodyPtxn(req: NextRequest): Promise<string | null> {
  try {
    if (req.method !== 'POST') return null;
    const body = await req.json();
    return typeof body?._ptxn === 'string' ? body._ptxn : null;
  } catch {
    return null;
  }
}

async function retrievePaddleTransaction(ptxn: string): Promise<
  | {
      ok: true;
      priceId: string;
      quantity: number;
      totalUsd: number;
      currency: string;
      isTest: boolean;
      customData: Record<string, unknown> | null;
      localOrderId: string;
    }
  | { ok: false; code: string; message: string; status: number }
> {
  const apiKey = process.env.PADDLE_API_KEY!;
  const base =
    process.env.PADDLE_ENV === 'sandbox'
      ? 'https://sandbox-api.paddle.com'
      : 'https://api.paddle.com';

  try {
    const res = await fetch(`${base}/transactions/${encodeURIComponent(ptxn)}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      return {
        ok: false,
        code: 'PADDLE_TXN_FETCH_FAILED',
        message: 'Unable to retrieve transaction',
        status: res.status === 404 ? 404 : 502,
      };
    }
    const json = (await res.json()) as { data?: Record<string, unknown> };
    const data = json.data || {};
    const items = (data.items as Array<Record<string, unknown>>) || [];
    const first = items[0] || {};
    const price = (first.price as Record<string, unknown>) || {};
    const totals = (data.details as Record<string, unknown>)?.totals as
      | Record<string, unknown>
      | undefined;
    const customData = (data.custom_data as Record<string, unknown>) || null;
    const localOrderId =
      typeof customData?.ci_local_order_id === 'string'
        ? customData.ci_local_order_id
        : '';

    const totalRaw = totals?.grand_total ?? totals?.total ?? 0;
    // Paddle amounts often in minor units; prefer explicit USD major if provided
    const totalUsd =
      typeof totalRaw === 'string'
        ? Number(totalRaw) / (String(totalRaw).length > 4 ? 100 : 1)
        : Number(totalUsdSafe(totalRaw));

    return {
      ok: true,
      priceId: String(price.id || first.price_id || ''),
      quantity: Number(first.quantity ?? 1),
      totalUsd: Number.isFinite(totalUsd) ? totalUsd : 0,
      currency: String(
        (totals?.currency_code as string) ||
          (data.currency_code as string) ||
          'USD'
      ),
      isTest: Boolean(data.collection_mode === 'manual' ? false : data.status === 'draft') ||
        process.env.PADDLE_ENV === 'sandbox',
      customData,
      localOrderId,
    };
  } catch {
    return {
      ok: false,
      code: 'PADDLE_NETWORK',
      message: 'Paddle API unreachable',
      status: 502,
    };
  }
}

function totalUsdSafe(v: unknown): number {
  if (typeof v === 'number') return v > 1000 ? v / 100 : v;
  return 0;
}

async function lookupCiOrder(
  localOrderId: string,
  ptxn: string
): Promise<
  | {
      ok: true;
      localOrderId: string;
      providerTransactionId: string | null;
      status: string;
    }
  | { ok: false; code: string; message: string }
> {
  // Persistence via Supabase service role when configured.
  // Minimal select — no secrets returned to caller.
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_KEY!;
    const sb = createClient(url, key);
    const { data, error } = await sb
      .from('ci_orders')
      .select('local_order_id, provider_transaction_id, status')
      .eq('local_order_id', localOrderId)
      .maybeSingle();

    if (error || !data) {
      // Fallback: allow bind only when row exists; fail-closed otherwise
      return {
        ok: false,
        code: 'ORDER_NOT_FOUND',
        message: 'Bound ci_orders row not found',
      };
    }
    return {
      ok: true,
      localOrderId: data.local_order_id as string,
      providerTransactionId: (data.provider_transaction_id as string) || null,
      status: (data.status as string) || 'created',
    };
  } catch {
    return {
      ok: false,
      code: 'ORDER_LOOKUP_FAILED',
      message: 'ci_orders lookup failed',
    };
  }
}
