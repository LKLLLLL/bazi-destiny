import assert from 'node:assert/strict';
import {
  getPaymentStatus,
  isUnlocked,
  readPendingCheckout,
  startCheckout,
  startPaidCheckout,
  TEMPORARY_FREE_ACCESS,
} from '../src/lib/paypal.ts';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
  removeItem(key: string) { this.values.delete(key); }
}

const sessionStorage = new MemoryStorage();
let assignedUrl = '';
let status = { pro: false, synergy: false };
let lastRequest: { url: string; init?: RequestInit } | null = null;

Object.assign(globalThis, {
  sessionStorage,
  window: { location: { assign: (url: string) => { assignedUrl = url; } } },
  fetch: async (url: string, init?: RequestInit) => {
    lastRequest = { url, init };
    if (url === '/api/paypal/status') {
      return new Response(JSON.stringify(status), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url === '/api/paypal/create-order') {
      return new Response(JSON.stringify({
        orderId: 'TESTORDER123',
        approveUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=TESTORDER123',
      }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
    throw new Error(`Unexpected request: ${url}`);
  },
});

await getPaymentStatus(true);
assert.equal(TEMPORARY_FREE_ACCESS, true, 'limited-time free promotion must be explicit');
assert.equal(isUnlocked('pro'), true, 'Life Blueprint is unlocked during the promotion');
assert.equal(isUnlocked('synergy'), true, 'Synergy Guide is unlocked during the promotion');

const reading = { date: '1990-06-15', pillars: { day: 'test' } };
await assert.rejects(startCheckout('pro', reading), /paused during limited-time free access/);
assert.equal(lastRequest, null, 'the free promotion must not create a PayPal order');

await startPaidCheckout('pro', reading);
assert.equal(assignedUrl, 'https://www.sandbox.paypal.com/checkoutnow?token=TESTORDER123');
assert.deepEqual(readPendingCheckout('pro'), reading, 'pending reading survives the PayPal redirect');
assert.equal(lastRequest?.url, '/api/paypal/create-order');
assert.deepEqual(JSON.parse(String(lastRequest?.init?.body)), { tier: 'pro' }, 'the client must never submit a price');

console.log('paypal-unlock: free promotion and paid checkout isolation passed');
