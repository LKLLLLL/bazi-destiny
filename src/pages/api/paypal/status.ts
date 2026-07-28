import type { APIRoute } from 'astro';
import { hasEntitlement, json } from '../../../lib/paypal/http';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const [pro, synergy] = await Promise.all([
      hasEntitlement(context, 'pro'),
      hasEntitlement(context, 'synergy'),
    ]);
    return json({ pro, synergy });
  } catch (error) {
    console.error('Payment status error:', error);
    return json({ pro: false, synergy: false });
  }
};
