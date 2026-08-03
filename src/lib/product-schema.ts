import { BRAND_NAME, ORGANIZATION_ID, SITE_URL } from './brand';

export const DIGITAL_PRODUCTS = {
  lifeBlueprint: {
    id: 'life-blueprint',
    name: 'Life Blueprint',
    price: '9.90',
    sku: 'BAZI-PRO',
    description:
      'A one-time Life Alignment Guide with personalized colors, numbers, directions, clothing, routine, diet, and conduct guidance.',
    purchasePath: '/calculator.html',
    imageSlug: 'life-blueprint',
  },
  synergyBoostGuide: {
    id: 'synergy-boost-guide',
    name: 'Synergy Boost Guide',
    price: '4.90',
    sku: 'BAZI-SYNERGY',
    description:
      'A one-time practical guide added to a love match result, covering communication, shared activities, home energy, and conflict resolution.',
    purchasePath: '/love-match.html',
    imageSlug: 'synergy-boost-guide',
  },
} as const;

export type DigitalProductKey = keyof typeof DIGITAL_PRODUCTS;

export function productImageUrls(imageSlug: string) {
  return [
    `${SITE_URL}/products/${imageSlug}-1x1.png`,
    `${SITE_URL}/products/${imageSlug}-4x3.png`,
    `${SITE_URL}/products/${imageSlug}-16x9.png`,
  ];
}

export function productJsonLd(key: DigitalProductKey) {
  const product = DIGITAL_PRODUCTS[key];
  const canonicalUrl = `${SITE_URL}/pricing.html#${product.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': canonicalUrl,
    name: `${BRAND_NAME} ${product.name}`,
    description: product.description,
    image: productImageUrls(product.imageSlug),
    sku: product.sku,
    category: 'Personalized digital guide',
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    url: canonicalUrl,
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'Delivery method',
      value: 'Online digital access; no physical shipment',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly',
      url: `${SITE_URL}${product.purchasePath}`,
      seller: { '@id': ORGANIZATION_ID },
    },
  };
}
