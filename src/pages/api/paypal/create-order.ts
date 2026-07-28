import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';
import { CHECKOUT_COOKIE, createOrder, paypalIsConfigured, tierFromUnknown } from '../../../lib/paypal/server';
import { json, requestOrigin, sameOrigin } from '../../../lib/paypal/http';

export const prerender = false;

async function rateLimited(address: string): Promise<boolean> {
  const bucket = Math.floor(Date.now() / 60_000);
  const key = `bazi:paypal:create:rate:${address}:${bucket}`;
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, 90);
  return count > 10;
}

export const POST: APIRoute = async ({ request, url, clientAddress, cookies }) => {
  if (!sameOrigin(request, url)) return json({ error: 'Invalid request origin' }, 403);
  if (!paypalIsConfigured()) return json({ error: 'Checkout is temporarily unavailable' }, 503);
  try {
    if (await rateLimited(clientAddress || 'unknown')) {
      return json({ error: 'Too many checkout attempts' }, 429, { 'Retry-After': '60' });
    }
    const body = await request.json();
    const tier = tierFromUnknown(body?.tier);
    if (!tier) return json({ error: 'Unknown product' }, 400);
    const order = await createOrder(tier, requestOrigin(request, url));
    cookies.set(CHECKOUT_COOKIE, order.checkoutToken, {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });
    return json({ orderId: order.orderId, approveUrl: order.approveUrl }, 201);
  } catch (error) {
    console.error('PayPal create order error:', error);
    return json({ error: 'Unable to start PayPal checkout' }, 502);
  }
};
