// PayPal checkout — tamper-resistant unlock using hashed signature.
export type Tier = 'pro' | 'ultimate' | 'synergy';

export const PAYPAL_CONFIG = {
  businessEmail: 'qwe4320325@gmail.com',
  currency: 'USD',
  products: {
    pro: { name: 'Destiny Master - Pro Reading', price: '9.90', itemId: 'BAZI-PRO' },
    ultimate: { name: 'Soul Guide - Ultimate Reading', price: '29.90', itemId: 'BAZI-ULTIMATE' },
    synergy: { name: 'Synergy Boost Guide - Love Match', price: '4.90', itemId: 'BAZI-SYNERGY' },
  } as Record<Tier, { name: string; price: string; itemId: string }>,
  returnUrl: 'https://mybazidestiny.com/success.html',
  cancelUrl: 'https://mybazidestiny.com/?payment=cancel',
};

// ── Tamper-resistant unlock ──
// Uses a simple hash to prevent casual localStorage.setItem bypass.
// Not cryptographically strong — a determined user can still reverse-engineer this.
// For real security, move unlock verification server-side (Vercel KV + API).

const STORAGE_KEY = '__bazi_v2';
const SALT = 0x5a3f7b2c;

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

function sign(payload: string): string {
  const raw = payload + ':' + (djb2(payload) ^ SALT).toString(36);
  return raw;
}

function verify(raw: string | null): string | null {
  if (!raw) return null;
  const lastColon = raw.lastIndexOf(':');
  if (lastColon === -1) return null;
  const payload = raw.substring(0, lastColon);
  const expected = djb2(payload) ^ SALT;
  const actual = parseInt(raw.substring(lastColon + 1), 36);
  if (expected !== actual) return null;
  return payload;
}

function storeUnlock(tier: string): void {
  const now = Date.now();
  const payload = tier + '|' + now;
  localStorage.setItem(STORAGE_KEY, sign(payload));
}

function readUnlock(): string | null {
  try {
    // Try new signed format first
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const payload = verify(raw);
      if (payload) return payload;
    }
    // Fallback: migrate legacy proUnlocked key
    if (localStorage.getItem('proUnlocked') === 'true') {
      storeUnlock('pro');
      localStorage.removeItem('proUnlocked');
      return 'pro|legacy';
    }
    return null;
  } catch {
    return null;
  }
}

export function startCheckout(tier: Tier, pendingReading?: unknown): void {
  const product = PAYPAL_CONFIG.products[tier];
  if (pendingReading) {
    try {
      localStorage.setItem('pendingReading', JSON.stringify(pendingReading));
      localStorage.setItem('pendingTier', tier);
    } catch {
      /* storage unavailable */
    }
  }
  const url = new URL('https://www.paypal.com/cgi-bin/webscr');
  url.searchParams.set('cmd', '_xclick');
  url.searchParams.set('business', PAYPAL_CONFIG.businessEmail);
  url.searchParams.set('item_name', product.name);
  url.searchParams.set('amount', product.price);
  url.searchParams.set('currency_code', PAYPAL_CONFIG.currency);
  url.searchParams.set('item_number', product.itemId);
  url.searchParams.set('return', PAYPAL_CONFIG.returnUrl);
  url.searchParams.set('cancel_return', PAYPAL_CONFIG.cancelUrl);
  url.searchParams.set('custom', tier);
  window.location.href = url.toString();
}

/** Returns the pending reading (and clears the flag) when the user is unlocked. */
export function resolveUnlock(): { unlocked: boolean; pending: unknown | null } {
  const params = new URLSearchParams(window.location.search);
  const paid = params.get('payment') === 'success';
  let pending: unknown | null = null;
  try {
    const raw = localStorage.getItem('pendingReading');
    if (paid && raw) {
      pending = JSON.parse(raw);
      localStorage.removeItem('pendingReading');
    }
    if (paid) storeUnlock('pro');
    const unlocked = paid || readUnlock() !== null;
    if (paid || params.get('payment') === 'cancel') {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
    return { unlocked, pending };
  } catch {
    return { unlocked: paid, pending };
  }
}

export function isUnlocked(): boolean {
  return readUnlock() !== null;
}
