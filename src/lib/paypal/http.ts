import type { APIContext } from 'astro';
import { entitlementCookieName, verifyEntitlement } from './server.ts';
import type { Tier } from './products.ts';

export const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...headers } });
}

export function sameOrigin(request: Request, url: URL): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === requestOrigin(request, url);
  } catch {
    return false;
  }
}

export function requestOrigin(request: Request, url: URL): string {
  const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
    || request.headers.get('host')
    || url.host;
  const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
    || url.protocol.replace(':', '');
  return `${protocol}://${host}`;
}

export async function hasEntitlement(context: Pick<APIContext, 'cookies'>, tier: Tier): Promise<boolean> {
  const token = context.cookies.get(entitlementCookieName(tier))?.value;
  return Boolean(await verifyEntitlement(token, tier));
}
