import { PAYPAL_PRODUCTS, type Tier } from './paypal/products.ts';

export type { Tier } from './paypal/products.ts';
export { PAYPAL_PRODUCTS } from './paypal/products.ts';

const PENDING_READING_KEY = 'bazi_checkout_reading';
const PENDING_TIER_KEY = 'bazi_checkout_tier';

export interface PaymentStatus {
  pro: boolean;
  synergy: boolean;
}

let statusCache: PaymentStatus | null = null;
let statusRequest: Promise<PaymentStatus> | null = null;

export async function getPaymentStatus(force = false): Promise<PaymentStatus> {
  if (!force && statusCache) return statusCache;
  if (!force && statusRequest) return statusRequest;
  statusRequest = fetch('/api/paypal/status', {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })
    .then(async (response) => {
      if (!response.ok) throw new Error('Unable to check payment status');
      const body = await response.json();
      statusCache = { pro: body?.pro === true, synergy: body?.synergy === true };
      return statusCache;
    })
    .catch(() => ({ pro: false, synergy: false }))
    .finally(() => { statusRequest = null; });
  return statusRequest;
}

export function isUnlocked(tier: Tier): boolean {
  return statusCache?.[tier] === true;
}

export async function startCheckout(tier: Tier, pendingReading?: unknown): Promise<void> {
  if (!Object.hasOwn(PAYPAL_PRODUCTS, tier)) throw new Error('Unknown product');
  try {
    if (pendingReading) sessionStorage.setItem(PENDING_READING_KEY, JSON.stringify(pendingReading));
    sessionStorage.setItem(PENDING_TIER_KEY, tier);
  } catch {
    throw new Error('Your browser could not save this reading for checkout');
  }

  const response = await fetch('/api/paypal/create-order', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ tier }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || typeof body?.approveUrl !== 'string') {
    throw new Error(body?.error || 'Unable to start PayPal checkout');
  }
  const approveUrl = new URL(body.approveUrl);
  if (approveUrl.protocol !== 'https:' || !approveUrl.hostname.endsWith('.paypal.com')) {
    throw new Error('PayPal returned an invalid checkout address');
  }
  window.location.assign(approveUrl.toString());
}

export function readPendingCheckout(expectedTier: Tier): unknown | null {
  try {
    if (sessionStorage.getItem(PENDING_TIER_KEY) !== expectedTier) return null;
    const raw = sessionStorage.getItem(PENDING_READING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingCheckout(): void {
  try {
    sessionStorage.removeItem(PENDING_READING_KEY);
    sessionStorage.removeItem(PENDING_TIER_KEY);
  } catch {
    /* storage unavailable */
  }
}
