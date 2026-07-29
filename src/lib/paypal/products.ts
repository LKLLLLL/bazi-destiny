export const PAYPAL_PRODUCTS = {
  pro: {
    name: 'Life Blueprint - Full BaZi Reading',
    price: '9.90',
    itemId: 'BAZI-PRO',
  },
  synergy: {
    name: 'Synergy Boost Guide - Love Match',
    price: '4.90',
    itemId: 'BAZI-SYNERGY',
  },
} as const;

// Keep paid product definitions intact so checkout can be restored with one switch.
export const TEMPORARY_FREE_ACCESS = true;

export type Tier = keyof typeof PAYPAL_PRODUCTS;

export function isTier(value: unknown): value is Tier {
  return typeof value === 'string' && Object.hasOwn(PAYPAL_PRODUCTS, value);
}
