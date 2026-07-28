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

export type Tier = keyof typeof PAYPAL_PRODUCTS;

export function isTier(value: unknown): value is Tier {
  return typeof value === 'string' && Object.hasOwn(PAYPAL_PRODUCTS, value);
}
