// PayPal checkout — identical merchant config to the live site.
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
    if (paid) localStorage.setItem('proUnlocked', 'true');
    const unlocked = paid || localStorage.getItem('proUnlocked') === 'true';
    if (paid || params.get('payment') === 'cancel') {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
    return { unlocked, pending };
  } catch {
    return { unlocked: paid, pending };
  }
}

export function isUnlocked(): boolean {
  try {
    return localStorage.getItem('proUnlocked') === 'true';
  } catch {
    return false;
  }
}
