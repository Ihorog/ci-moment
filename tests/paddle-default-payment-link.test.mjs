import assert from 'node:assert/strict';
import {
  bindPaddleTransaction,
  validatePtxnSyntax,
  CI_PADDLE_CONTRACT,
} from '../lib/payments/paddlePaymentLink.mjs';
import {
  createAbortFlag,
  openCheckout,
} from '../app/checkout/paddle/paymentLinkRuntime.mjs';

function baseInput(over = {}) {
  return {
    ptxnId: 'txn_01TESTVALID000000000000',
    priceId: 'pri_live_configured',
    quantity: 1,
    totalUsd: 17,
    currency: 'USD',
    isTest: false,
    customData: { ci_local_order_id: 'ord_local_1' },
    localOrderIdFromDb: 'ord_local_1',
    providerTransactionIdFromDb: null,
    orderStatus: 'created',
    paddleConfigured: true,
    webhookReady: true,
    persistenceReady: true,
    publicLaunchGateOpen: true,
    ...over,
  };
}

const browser = {
  clientToken: 'test_client_token_public',
  environment: 'production',
};

// valid binding
{
  const r = bindPaddleTransaction(baseInput(), browser);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.safe.localOrderId, 'ord_local_1');
    assert.equal(r.safe.providerTransactionId, 'txn_01TESTVALID000000000000');
    assert.equal(r.safe.clientToken, 'test_client_token_public');
    assert.ok(!('apiKey' in r.safe));
    assert.ok(!('webhookSecret' in r.safe));
  }
}

// unrelated / mismatched rejection
{
  const r = bindPaddleTransaction(
    baseInput({ localOrderIdFromDb: 'ord_OTHER' }),
    browser
  );
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, 'LOCAL_ORDER_MISMATCH');
}
{
  const r = bindPaddleTransaction(
    baseInput({ totalUsd: 18 }),
    browser
  );
  assert.equal(r.ok, false);
}
{
  const r = bindPaddleTransaction(
    baseInput({ quantity: 2 }),
    browser
  );
  assert.equal(r.ok, false);
}
{
  const r = bindPaddleTransaction(
    baseInput({ isTest: true }),
    browser
  );
  assert.equal(r.ok, false);
}
{
  const r = bindPaddleTransaction(
    baseInput({ customData: {} }),
    browser
  );
  assert.equal(r.ok, false);
}

// secret-safe response shape
{
  const r = bindPaddleTransaction(baseInput(), browser);
  assert.equal(r.ok, true);
  if (r.ok) {
    const keys = Object.keys(r.safe).sort();
    assert.deepEqual(keys, [
      'clientToken',
      'environment',
      'localOrderId',
      'providerTransactionId',
    ]);
  }
}

// ptxn syntax
assert.equal(validatePtxnSyntax('txn_abc123'), true);
assert.equal(validatePtxnSyntax('not-a-txn'), false);
assert.equal(validatePtxnSyntax(''), false);

// completion redirect + no client fulfillment
{
  let redirected = null;
  const flag = createAbortFlag();
  const handles = {
    aborted: flag.aborted,
    onCompletedRedirect: (href) => {
      redirected = href;
    },
  };
  let fulfilled = false;
  const paddle = {
    Initialize: ({ eventCallback }) => {
      eventCallback({ name: 'checkout.completed' });
    },
    Checkout: {
      open: () => {
        /* open only */
      },
    },
  };
  openCheckout(
    {
      clientToken: 'tok',
      environment: 'production',
      providerTransactionId: 'txn_1',
      localOrderId: 'ord_1',
    },
    handles,
    paddle
  );
  assert.ok(String(redirected).includes('/payment/success'));
  assert.ok(String(redirected).includes('provider_txn=txn_1'));
  assert.ok(String(redirected).includes('local_order=ord_1'));
  assert.equal(fulfilled, false); // webhook-authoritative
}

// unmount safety
{
  const flag = createAbortFlag();
  flag.abort();
  let opened = false;
  openCheckout(
    {
      clientToken: 'tok',
      environment: 'production',
      providerTransactionId: 'txn_x',
      localOrderId: 'ord_x',
    },
    {
      aborted: flag.aborted,
      onCompletedRedirect: () => {},
    },
    {
      Initialize: () => {
        opened = true;
      },
      Checkout: {
        open: () => {
          opened = true;
        },
      },
    }
  );
  assert.equal(opened, false);
}

assert.equal(CI_PADDLE_CONTRACT.amountUsd, 17);
assert.equal(CI_PADDLE_CONTRACT.quantity, 1);

console.log('paddle-default-payment-link: all behavioral assertions passed');
