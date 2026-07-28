// PayPal checkout — tamper-resistant unlock using hashed signature.
export type Tier = 'pro' | 'ultimate' | 'synergy';

export const PAYPAL_CONFIG = {
  businessEmail: 'qwe4320325@gmail.com',
  currency: 'USD',
  products: {
    pro: { name: 'Life Blueprint - Full BaZi Reading', price: '9.90', itemId: 'BAZI-PRO' },
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

function tierKey(tier: Tier): string {
  return `${STORAGE_KEY}:${tier}`;
}

function storeUnlock(tier: Tier): void {
  const now = Date.now();
  const payload = tier + '|' + now;
  localStorage.setItem(tierKey(tier), sign(payload));
}

function readUnlock(tier: Tier): string | null {
  try {
    const raw = localStorage.getItem(tierKey(tier));
    if (raw) {
      const payload = verify(raw);
      if (payload?.startsWith(`${tier}|`)) return payload;
    }
    // Migrate the earlier single-key format without granting another product.
    const oldRaw = localStorage.getItem(STORAGE_KEY);
    const oldPayload = verify(oldRaw);
    if (oldPayload) {
      const oldTier = oldPayload.split('|')[0] as Tier;
      if (oldTier === 'pro' || oldTier === 'ultimate' || oldTier === 'synergy') {
        storeUnlock(oldTier);
        localStorage.removeItem(STORAGE_KEY);
        if (oldTier === tier) return oldPayload;
      }
    }
    // The original boolean flag represented the Life Blueprint product.
    if (localStorage.getItem('proUnlocked') === 'true') {
      storeUnlock('pro');
      localStorage.removeItem('proUnlocked');
      return tier === 'pro' ? 'pro|legacy' : null;
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

function validPending(tier: Tier, pending: unknown): boolean {
  if (!pending || typeof pending !== 'object') return false;
  const value = pending as Record<string, unknown>;
  return tier === 'synergy'
    ? typeof value.n1 === 'string' && typeof value.n2 === 'string'
    : typeof value.date === 'string';
}

/** Completes a matching checkout return and returns its pending reading. */
export function resolveUnlock(required: 'pro' | 'synergy' = 'pro'): { unlocked: boolean; pending: unknown | null } {
  const params = new URLSearchParams(window.location.search);
  const returned = params.get('payment') === 'success';
  let pending: unknown | null = null;
  try {
    const raw = localStorage.getItem('pendingReading');
    const pendingTier = localStorage.getItem('pendingTier') as Tier | null;
    const tierMatches = required === 'pro'
      ? pendingTier === 'pro' || pendingTier === 'ultimate'
      : pendingTier === 'synergy';
    const parsed = returned && raw ? JSON.parse(raw) : null;
    const paid = Boolean(returned && pendingTier && tierMatches && validPending(pendingTier, parsed));
    if (paid && pendingTier) {
      pending = parsed;
      storeUnlock(pendingTier);
      localStorage.removeItem('pendingReading');
      localStorage.removeItem('pendingTier');
    }
    const unlocked = paid || isUnlocked(required);
    if (returned || params.get('payment') === 'cancel') {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
    return { unlocked, pending };
  } catch {
    return { unlocked: isUnlocked(required), pending };
  }
}

export function isUnlocked(required: 'pro' | 'synergy' = 'pro'): boolean {
  if (required === 'synergy') return readUnlock('synergy') !== null;
  return readUnlock('pro') !== null || readUnlock('ultimate') !== null;
}
