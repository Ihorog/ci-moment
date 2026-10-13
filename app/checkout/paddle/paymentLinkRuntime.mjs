export function createAbortFlag() {
  let dead = false;
  return {
    abort: () => { dead = true; },
    aborted: () => dead,
  };
}

export async function resolvePaymentLink(ptxn, handles) {
  if (handles.aborted()) return null;
  const res = await fetch(
    `/api/payment/paddle/payment-link?_ptxn=${encodeURIComponent(ptxn)}`,
    { credentials: 'same-origin' }
  );
  if (handles.aborted()) return null;
  if (!res.ok) return null;
  const data = await res.json();
  if (handles.aborted()) return null;
  return data;
}

export async function loadPaddleJs(handles) {
  if (handles.aborted()) return false;
  return true;
}

export function openCheckout(payload, handles, paddle) {
  if (handles.aborted()) return;
  paddle.Initialize({
    token: payload.clientToken,
    eventCallback: (event) => {
      if (handles.aborted()) return;
      if (event?.name === 'checkout.completed') {
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
