import assert from 'node:assert/strict';
import { createEntitlement, parseEntitlement, validateCompletedOrder } from '../src/lib/paypal/server.ts';

function completedOrder(overrides: Record<string, unknown> = {}) {
  return {
    status: 'COMPLETED',
    purchase_units: [{
      custom_id: 'pro',
      payee: { merchant_id: 'MERCHANT-123' },
      payments: { captures: [{ id: 'CAPTURE-123', amount: { currency_code: 'USD', value: '9.90' } }] },
    }],
    ...overrides,
  };
}

assert.deepEqual(validateCompletedOrder(completedOrder(), 'pro', 'MERCHANT-123'), { captureId: 'CAPTURE-123' });
assert.throws(() => validateCompletedOrder(completedOrder({ status: 'APPROVED' }), 'pro'), /verification failed/);
assert.throws(() => validateCompletedOrder(completedOrder({
  purchase_units: [{ custom_id: 'synergy', payments: { captures: [{ id: 'X', amount: { currency_code: 'USD', value: '9.90' } }] } }],
}), 'pro'), /verification failed/);
assert.throws(() => validateCompletedOrder(completedOrder({
  purchase_units: [{ custom_id: 'pro', payments: { captures: [{ id: 'X', amount: { currency_code: 'USD', value: '0.01' } }] } }],
}), 'pro'), /verification failed/);
assert.throws(() => validateCompletedOrder(completedOrder(), 'pro', 'OTHER-MERCHANT'), /verification failed/);

process.env.PAYMENT_SIGNING_SECRET = 'test-only-secret-with-enough-entropy';
const entitlement = createEntitlement({
  orderId: 'TESTORDER123',
  captureId: 'CAPTURE-123',
  tier: 'pro',
  amount: '9.90',
  currency: 'USD',
  status: 'COMPLETED',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
assert.deepEqual(parseEntitlement(entitlement, 'pro'), { orderId: 'TESTORDER123' });
assert.equal(parseEntitlement(entitlement, 'synergy'), null, 'entitlements cannot cross product tiers');
assert.equal(parseEntitlement(`${entitlement.slice(0, -1)}x`, 'pro'), null, 'tampered entitlements are rejected');

console.log('paypal-server: order and entitlement validation passed');
