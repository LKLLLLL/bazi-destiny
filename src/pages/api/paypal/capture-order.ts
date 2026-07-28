import type { APIRoute } from 'astro';
import {
  CHECKOUT_COOKIE,
  captureOrder,
  createEntitlement,
  entitlementCookieName,
  paypalIsConfigured,
  tierFromUnknown,
} from '../../../lib/paypal/server';
import { json, sameOrigin } from '../../../lib/paypal/http';

export const prerender = false;

export const POST: APIRoute = async ({ request, url, cookies }) => {
  if (!sameOrigin(request, url)) return json({ error: 'Invalid request origin' }, 403);
  if (!paypalIsConfigured()) return json({ error: 'Checkout is temporarily unavailable' }, 503);
  try {
    const body = await request.json();
    const tier = tierFromUnknown(body?.tier);
    const orderId = typeof body?.orderId === 'string' ? body.orderId.trim() : '';
    if (!tier || !orderId) return json({ error: 'Invalid payment return' }, 400);
    const checkoutToken = cookies.get(CHECKOUT_COOKIE)?.value || '';
    const separator = checkoutToken.indexOf('.');
    const cookieOrderId = separator > 0 ? checkoutToken.slice(0, separator) : '';
    const checkoutNonce = separator > 0 ? checkoutToken.slice(separator + 1) : '';
    if (cookieOrderId !== orderId || !checkoutNonce) return json({ error: 'Checkout session expired' }, 403);
    const record = await captureOrder(orderId, tier, checkoutNonce);
    cookies.set(entitlementCookieName(tier), createEntitlement(record), {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 5,
    });
    cookies.delete(CHECKOUT_COOKIE, { path: '/' });
    return json({ success: true, tier });
  } catch (error) {
    console.error('PayPal capture order error:', error);
    return json({ error: 'Payment could not be verified' }, 422);
  }
};
