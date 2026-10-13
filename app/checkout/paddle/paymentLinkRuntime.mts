/**
 * Browser runtime for Paddle payment link.
 * Unmount guards after resolve / load / before init+open.
 * checkout.completed → /payment/success with verified IDs only.
 * NO client-side fulfillment.
 */

export type SafeLinkPayload = {
  clientToken: string;
  environment: 'sandbox' | 'production';
  providerTransactionId: string;
  localOrderId: string;
};

export type RuntimeHandles = {
  aborted: () => boolean;
  onCompletedRedirect: (href: string) => void;
};

export function createAbortFlag(): { abort: () => void; aborted: () => boolean } {
  let dead = false;
  return {
    abort: () => {
      dead = true;
    },
    aborted: () => dead,
  };
}

export async function resolvePaymentLink(
  ptxn: string,
  handles: RuntimeHandles
): Promise<SafeLinkPayload | null> {
  if (handles.aborted()) return null;
  const res = await fetch(
    `/api/payment/paddle/payment-link?_ptxn=${encodeURIComponent(ptxn)}`,
    { credentials: 'same-origin' }
  );
  if (handles.aborted()) return null;
  if (!res.ok) return null;
  const data = (await res.json()) as SafeLinkPayload;
  if (handles.aborted()) return null;
  return data;
}

export async function loadPaddleJs(
  handles: RuntimeHandles
): Promise<boolean> {
  if (handles.aborted()) return false;
  // Caller injects Paddle.js; this gate only checks abort between steps
  if (handles.aborted()) return false;
  return true;
}

export function openCheckout(
  payload: SafeLinkPayload,
  handles: RuntimeHandles,
  paddle: {
    Initialize: (o: { token: string; eventCallback?: (e: { name?: string }) => void }) => void;
    Checkout: { open: (o: { transactionId: string }) => void };
  }
): void {
  if (handles.aborted()) return;

  paddle.Initialize({
    token: payload.clientToken,
    eventCallback: (event) => {
      if (handles.aborted()) return;
      if (event?.name === 'checkout.completed') {
        // Redirect only — webhook fulfills
        const href =
          `/payment/success?provider_txn=${encodeURIComponent(payload.providerTransactionId)}` +
          `&local_order=${encodeURIComponent(payload.localOrderId)}`;
        handles.onCompletedRedirect(href);
      }
    },
  });

  if (handles.aborted()) return;
  paddle.Checkout.open({ transactionId: payload.providerTransactionId });
}
