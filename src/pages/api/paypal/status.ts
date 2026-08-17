import type { APIRoute } from 'astro';
import { hasEntitlement, json } from '../../../lib/paypal/http';
import { TEMPORARY_FREE_ACCESS } from '../../../lib/paypal/products';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  if (TEMPORARY_FREE_ACCESS) {
    return json({ pro: true, synergy: true, naming: true, promotion: 'limited-time-free' });
  }
  try {
    const [pro, synergy, naming] = await Promise.all([
      hasEntitlement(context, 'pro'),
      hasEntitlement(context, 'synergy'),
      hasEntitlement(context, 'naming'),
    ]);
    return json({ pro, synergy, naming });
  } catch (error) {
    console.error('Payment status error:', error);
    return json({ pro: false, synergy: false, naming: false });
  }
};
