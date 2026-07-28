import type { APIRoute } from 'astro';

export const prerender = false;

interface Entry {
  name1: string;
  name2: string;
  score: number;
  tier: string;
  elem1: string;
  elem2: string;
  ts: number;
}

const KV_KEY = 'bazi:leaderboard';
const MAX_ENTRIES = 100;

const SEED: Entry[] = [];

const HAS_KV = Boolean(
  (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
  (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
);

async function kv() {
  const mod = await import('@vercel/kv');
  return mod.kv;
}

async function readEntries(): Promise<Entry[]> {
  try {
    const client = await kv();
    return (await client.get<Entry[]>(KV_KEY)) || [];
  } catch {
    return [];
  }
}

async function writeEntry(entry: Entry): Promise<number> {
  const client = await kv();
  const list = ((await client.get<Entry[]>(KV_KEY)) || []).filter(
    (e) => !(e.name1 === entry.name1 && e.name2 === entry.name2)
  );
  list.push(entry);
  list.sort((a, b) => b.score - a.score || a.ts - b.ts);
  const trimmed = list.slice(0, MAX_ENTRIES);
  await client.set(KV_KEY, trimmed);
  // rank across seed + stored
  const all = await readEntries();
  all.sort((a, b) => b.score - a.score || a.ts - b.ts);
  return all.findIndex((e) => e.name1 === entry.name1 && e.name2 === entry.name2 && e.score === entry.score) + 1;
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, max-age=30',
};

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers });

export const GET: APIRoute = async () => {
  try {
    const entries = (await readEntries())
      .filter((e) => e.score > 0)
      .sort((a, b) => b.score - a.score || a.ts - b.ts);
    return new Response(JSON.stringify({ entries, kv: HAS_KV }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ entries: SEED, kv: false }), { status: 200, headers });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const clearKey = process.env.LEADERBOARD_CLEAR_KEY;
  const supplied = request.headers.get('authorization');
  const adminHeaders = { ...headers, 'Cache-Control': 'no-store' };
  if (!clearKey || supplied !== `Bearer ${clearKey}`) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: adminHeaders });
  }
  try {
    const client = await kv();
    await client.set(KV_KEY, []);
    return new Response(JSON.stringify({ entries: [], kv: true, cleared: true }), { status: 200, headers: adminHeaders });
  } catch {
    return new Response(JSON.stringify({ error: 'Clear failed' }), { status: 500, headers: adminHeaders });
  }
};

const VALID_TIERS = [
  'Exceptional Harmony', 'Strong Compatibility', 'Good Match',
  'Balanced Pairing', 'Growth Opportunity', 'Requires Effort', '—',
];
const VALID_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water', ''];

function cleanName(v: unknown): string {
  return String(v ?? '')
    .replace(/[<>"'`&]/g, '')
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\uFEFF]/g, '') // strip control/zero-width chars
    .trim()
    .slice(0, 24);
}

function sanitizeTier(v: unknown): string {
  const cleaned = cleanName(v);
  return VALID_TIERS.includes(cleaned) ? cleaned : '—';
}

function sanitizeElement(v: unknown): string {
  const cleaned = cleanName(v);
  return VALID_ELEMENTS.includes(cleaned) ? cleaned : '';
}

async function rateLimited(clientAddress: string): Promise<boolean> {
  if (!HAS_KV) return false;
  try {
    const client = await kv();
    const bucket = Math.floor(Date.now() / 60_000);
    const key = `bazi:leaderboard:rate:${clientAddress}:${bucket}`;
    const count = await client.incr(key);
    if (count === 1) await client.expire(key, 90);
    return count > 10;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (await rateLimited(clientAddress || 'unknown')) {
    return new Response(
      JSON.stringify({ success: false, error: 'Too many submissions' }),
      { status: 429, headers: { ...headers, 'Cache-Control': 'no-store', 'Retry-After': '60' } }
    );
  }
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), { status: 400, headers });
  }
  const name1 = cleanName(body?.name1);
  const name2 = cleanName(body?.name2);
  const score = Math.max(0, Math.min(100, Math.round(Number(body?.score) || 0)));
  if (!name1 || !name2) {
    return new Response(JSON.stringify({ success: false, error: 'Both names are required' }), { status: 400, headers });
  }
  if (!score) {
    return new Response(JSON.stringify({ success: false, error: 'Score must be 1–100' }), { status: 400, headers });
  }
  const entry: Entry = {
    name1,
    name2,
    score,
    tier: sanitizeTier(body?.tier),
    elem1: sanitizeElement(body?.elem1),
    elem2: sanitizeElement(body?.elem2),
    ts: Date.now(),
  };
  try {
    const rank = await writeEntry(entry);
    return new Response(JSON.stringify({ success: true, entry: { ...entry, rank } }), { status: 200, headers });
  } catch (e) {
    console.error('leaderboard write error:', e);
    const all = [...SEED, entry].sort((a, b) => b.score - a.score || a.ts - b.ts);
    const rank = all.findIndex((e) => e === entry) + 1;
    return new Response(
      JSON.stringify({ success: false, error: 'Storage unavailable', entry: { ...entry, rank } }),
      { status: 200, headers }
    );
  }
};
