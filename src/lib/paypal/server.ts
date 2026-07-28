import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { kv } from '@vercel/kv';
import { PAYPAL_PRODUCTS, isTier, type Tier } from './products.ts';

const ORDER_PREFIX = 'bazi:paypal:order:';
const COOKIE_PREFIX = '__Host-bazi_entitlement_';
export const CHECKOUT_COOKIE = '__Host-bazi_checkout';
const ENTITLEMENT_VERSION = 1;
const ENTITLEMENT_MAX_AGE = 60 * 60 * 24 * 365 * 5;

export interface PaymentOrderRecord {
  orderId: string;
  captureId?: string;
  tier: Tier;
  amount: string;
  currency: 'USD';
  status: 'CREATED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  checkoutNonceHash?: string;
}

interface PayPalLink {
  rel?: string;
  href?: string;
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function paypalBaseUrl(): string {
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

function orderKey(orderId: string): string {
  return `${ORDER_PREFIX}${orderId}`;
}

export function entitlementCookieName(tier: Tier): string {
  return `${COOKIE_PREFIX}${tier}`;
}

export function paypalIsConfigured(): boolean {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_CLIENT_SECRET &&
    process.env.PAYMENT_SIGNING_SECRET &&
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
    (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

async function accessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${requiredEnv('PAYPAL_CLIENT_ID')}:${requiredEnv('PAYPAL_CLIENT_SECRET')}`
  ).toString('base64');
  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || typeof body.access_token !== 'string') {
    throw new Error(`PayPal authentication failed (${response.status})`);
  }
  return body.access_token;
}

async function paypalRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await accessToken();
  return fetch(`${paypalBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

function now(): string {
  return new Date().toISOString();
}

function hashCheckoutNonce(nonce: string): string {
  return createHash('sha256').update(nonce).digest('base64url');
}

export async function createOrder(tier: Tier, origin: string): Promise<{ orderId: string; approveUrl: string; checkoutToken: string }> {
  if (!paypalIsConfigured()) throw new Error('Payments are not configured');
  const product = PAYPAL_PRODUCTS[tier];
  const returnUrl = new URL('/success.html', origin);
  returnUrl.searchParams.set('tier', tier);
  const cancelUrl = new URL(tier === 'synergy' ? '/love-match-result.html' : '/calculator.html', origin);
  cancelUrl.searchParams.set('payment', 'cancel');

  const response = await paypalRequest('/v2/checkout/orders', {
    method: 'POST',
    headers: { 'PayPal-Request-Id': randomUUID() },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: tier,
        custom_id: tier,
        description: product.name,
        amount: { currency_code: 'USD', value: product.price },
      }],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: 'BaZi Destiny',
            user_action: 'PAY_NOW',
            return_url: returnUrl.toString(),
            cancel_url: cancelUrl.toString(),
          },
        },
      },
    }),
  });
  const body = await response.json().catch(() => ({}));
  const orderId = typeof body.id === 'string' ? body.id : '';
  const approveUrl = Array.isArray(body.links)
    ? body.links.find((link: PayPalLink) => link.rel === 'payer-action' || link.rel === 'approve')?.href
    : undefined;
  if (!response.ok || !orderId || !approveUrl) {
    throw new Error(`PayPal order creation failed (${response.status})`);
  }

  const timestamp = now();
  const checkoutNonce = randomBytes(32).toString('base64url');
  const record: PaymentOrderRecord = {
    orderId,
    tier,
    amount: product.price,
    currency: 'USD',
    status: 'CREATED',
    createdAt: timestamp,
    updatedAt: timestamp,
    checkoutNonceHash: hashCheckoutNonce(checkoutNonce),
  };
  await kv.set(orderKey(orderId), record);
  return { orderId, approveUrl, checkoutToken: `${orderId}.${checkoutNonce}` };
}

function extractCapture(order: any): { captureId: string; amount: string; currency: string; tier: unknown; merchantId?: string } | null {
  const unit = Array.isArray(order?.purchase_units) ? order.purchase_units[0] : null;
  const capture = Array.isArray(unit?.payments?.captures) ? unit.payments.captures[0] : null;
  if (!unit || !capture) return null;
  return {
    captureId: typeof capture.id === 'string' ? capture.id : '',
    amount: String(capture.amount?.value || ''),
    currency: String(capture.amount?.currency_code || ''),
    tier: unit.custom_id || unit.reference_id,
    merchantId: unit.payee?.merchant_id,
  };
}

export function validateCompletedOrder(
  order: unknown,
  requestedTier: Tier,
  expectedMerchant?: string
): { captureId: string } {
  const product = PAYPAL_PRODUCTS[requestedTier];
  const capture = extractCapture(order);
  if (
    (order as any)?.status !== 'COMPLETED' ||
    !capture?.captureId ||
    capture.tier !== requestedTier ||
    capture.amount !== product.price ||
    capture.currency !== 'USD' ||
    (expectedMerchant && capture.merchantId !== expectedMerchant)
  ) {
    throw new Error('PayPal order verification failed');
  }
  return { captureId: capture.captureId };
}

async function readCompletedOrder(orderId: string): Promise<any> {
  const response = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}`);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`PayPal order lookup failed (${response.status})`);
  return body;
}

export async function captureOrder(orderId: string, requestedTier: Tier, checkoutNonce: string): Promise<PaymentOrderRecord> {
  if (!/^[A-Z0-9]{10,30}$/i.test(orderId)) throw new Error('Invalid PayPal order ID');
  const stored = await kv.get<PaymentOrderRecord>(orderKey(orderId));
  const suppliedHash = hashCheckoutNonce(checkoutNonce);
  if (!stored || stored.tier !== requestedTier || stored.checkoutNonceHash !== suppliedHash || stored.status !== 'CREATED') {
    if (stored?.status === 'COMPLETED' && stored.tier === requestedTier && stored.checkoutNonceHash === suppliedHash) return stored;
    throw new Error('Unknown or invalid payment order');
  }

  const captureResponse = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: { 'PayPal-Request-Id': `capture-${orderId}` },
    body: '{}',
  });
  let order = await captureResponse.json().catch(() => ({}));
  if (!captureResponse.ok) order = await readCompletedOrder(orderId);

  const capture = validateCompletedOrder(order, requestedTier, process.env.PAYPAL_MERCHANT_ID?.trim());

  const completed: PaymentOrderRecord = {
    ...stored,
    captureId: capture.captureId,
    status: 'COMPLETED',
    updatedAt: now(),
  };
  await kv.set(orderKey(orderId), completed);
  return completed;
}

function signature(payload: string): string {
  return createHmac('sha256', requiredEnv('PAYMENT_SIGNING_SECRET')).update(payload).digest('base64url');
}

export function createEntitlement(record: PaymentOrderRecord): string {
  const payload = Buffer.from(JSON.stringify({
    v: ENTITLEMENT_VERSION,
    tier: record.tier,
    orderId: record.orderId,
    iat: Date.now(),
  })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function parseEntitlement(raw: string | undefined, requiredTier: Tier): { orderId: string } | null {
  if (!raw) return null;
  const [payload, suppliedSignature, extra] = raw.split('.');
  if (!payload || !suppliedSignature || extra) return null;
  const expected = Buffer.from(signature(payload));
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;

  let claims: any;
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (
    claims?.v !== ENTITLEMENT_VERSION ||
    claims?.tier !== requiredTier ||
    typeof claims?.orderId !== 'string' ||
    !Number.isFinite(claims?.iat) ||
    Date.now() - claims.iat > ENTITLEMENT_MAX_AGE * 1000
  ) return null;

  return { orderId: claims.orderId };
}

export async function verifyEntitlement(raw: string | undefined, requiredTier: Tier): Promise<PaymentOrderRecord | null> {
  const claims = parseEntitlement(raw, requiredTier);
  if (!claims) return null;
  const record = await kv.get<PaymentOrderRecord>(orderKey(claims.orderId));
  return record?.status === 'COMPLETED' && record.tier === requiredTier ? record : null;
}

export function tierFromUnknown(value: unknown): Tier | null {
  return isTier(value) ? value : null;
}
