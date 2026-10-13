export const CI_PADDLE_CONTRACT = {
  currency: 'USD',
  amountUsd: 17,
  quantity: 1,
  requireLiveNonTest: true,
  requireCustomDataLocalOrderId: true,
};

const PTXN_RE = /^txn_[a-zA-Z0-9]+$/;

export function validatePtxnSyntax(raw) {
  if (!raw || typeof raw !== 'string') return false;
  return PTXN_RE.test(raw.trim());
}

export function bindPaddleTransaction(input, browser) {
  if (!input.paddleConfigured) {
    return { ok: false, code: 'PADDLE_NOT_CONFIGURED', message: 'Live Paddle configuration required' };
  }
  if (!input.webhookReady) {
    return { ok: false, code: 'WEBHOOK_NOT_READY', message: 'Signed webhook readiness required' };
  }
  if (!input.persistenceReady) {
    return { ok: false, code: 'PERSISTENCE_NOT_READY', message: 'Order persistence required' };
  }
  if (!input.publicLaunchGateOpen) {
    return { ok: false, code: 'LAUNCH_GATE_CLOSED', message: 'Public launch gate closed' };
  }
  if (!validatePtxnSyntax(input.ptxnId)) {
    return { ok: false, code: 'INVALID_PTXN', message: 'Invalid _ptxn syntax' };
  }
  if (input.isTest && CI_PADDLE_CONTRACT.requireLiveNonTest) {
    return { ok: false, code: 'TEST_ORDER_REJECTED', message: 'Live non-test order required' };
  }
  if (input.quantity !== CI_PADDLE_CONTRACT.quantity) {
    return { ok: false, code: 'QUANTITY_MISMATCH', message: 'Quantity must be 1' };
  }
  if (input.currency !== CI_PADDLE_CONTRACT.currency) {
    return { ok: false, code: 'CURRENCY_MISMATCH', message: 'USD required' };
  }
  if (Number(input.totalUsd) !== CI_PADDLE_CONTRACT.amountUsd) {
    return { ok: false, code: 'AMOUNT_MISMATCH', message: 'Total must be USD 17' };
  }
  const localFromCustom = input.customData?.ci_local_order_id;
  if (
    CI_PADDLE_CONTRACT.requireCustomDataLocalOrderId &&
    (typeof localFromCustom !== 'string' || !localFromCustom.trim())
  ) {
    return { ok: false, code: 'MISSING_LOCAL_ORDER_ID', message: 'custom_data.ci_local_order_id required' };
  }
  if (String(localFromCustom) !== input.localOrderIdFromDb) {
    return { ok: false, code: 'LOCAL_ORDER_MISMATCH', message: 'Local order identity mismatch' };
  }
  if (
    input.providerTransactionIdFromDb &&
    input.providerTransactionIdFromDb !== input.ptxnId
  ) {
    return { ok: false, code: 'PROVIDER_TXN_MISMATCH', message: 'Provider transaction identity mismatch' };
  }
  return {
    ok: true,
    safe: {
      clientToken: browser.clientToken,
      environment: browser.environment,
      providerTransactionId: input.ptxnId,
      localOrderId: input.localOrderIdFromDb,
    },
  };
}
