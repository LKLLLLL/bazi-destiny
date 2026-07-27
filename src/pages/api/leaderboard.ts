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

// Seed board so the page is alive before KV is configured / first real entries arrive.
const SEED: Entry[] = [
  { name1: 'Liam', name2: 'Olivia', score: 97, tier: 'Soulmate Bond', elem1: 'Wood', elem2: 'Fire', ts: 1751000000000 },
  { name1: 'Noah', name2: 'Emma', score: 94, tier: 'Soulmate Bond', elem1: 'Water', elem2: 'Wood', ts: 1751100000000 },
  { name1: 'Ethan', name2: 'Ava', score: 92, tier: 'Soulmate Bond', elem1: 'Fire', elem2: 'Earth', ts: 1751200000000 },
  { name1: 'Mason', name2: 'Sophia', score: 89, tier: 'Strong Harmony', elem1: 'Earth', elem2: 'Metal', ts: 1751300000000 },
  { name1: 'Lucas', name2: 'Mia', score: 87, tier: 'Strong Harmony', elem1: 'Metal', elem2: 'Water', ts: 1751400000000 },
  { name1: 'Henry', name2: 'Luna', score: 85, tier: 'Strong Harmony', elem1: 'Wood', elem2: 'Water', ts: 1751500000000 },
  { name1: 'Leo', name2: 'Chloe', score: 82, tier: 'Strong Harmony', elem1: 'Fire', elem2: 'Wood', ts: 1751600000000 },
  { name1: 'Owen', name2: 'Ella', score: 78, tier: 'Growing Bond', elem1: 'Earth', elem2: 'Fire', ts: 1751700000000 },
  { name1: 'Ryan', name2: 'Grace', score: 74, tier: 'Growing Bond', elem1: 'Metal', elem2: 'Earth', ts: 1751800000000 },
  { name1: 'Dylan', name2: 'Zoe', score: 69, tier: 'Growing Bond', elem1: 'Water', elem2: 'Metal', ts: 1751900000000 },
];

const HAS_KV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function kv() {
  const mod = await import('@vercel/kv');
  return mod.kv;
}

async function readEntries(): Promise<Entry[]> {
  if (HAS_KV) {
    try {
      const client = await kv();
      const list = (await client.get<Entry[]>(KV_KEY)) || [];
      return [...list, ...SEED.filter((s) => !list.some((e) => e.name1 === s.name1 && e.name2 === s.name2))];
    } catch {
      return SEED;
    }
  }
  return SEED;
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
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Cache-Control': 'public, max-age=30',
};

export const OPTIONS: APIRoute = () => new Response(null, { status: 204, headers });

export const GET: APIRoute = async () => {
  try {
    const entries = (await readEntries()).sort((a, b) => b.score - a.score || a.ts - b.ts);
    return new Response(JSON.stringify({ entries, kv: HAS_KV }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ entries: SEED, kv: false }), { status: 200, headers });
  }
};

function cleanName(v: unknown): string {
  return String(v ?? '')
    .replace(/[<>"'`&]/g, '')
    .trim()
    .slice(0, 24);
}

export const POST: APIRoute = async ({ request }) => {
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
    tier: cleanName(body?.tier) || '—',
    elem1: cleanName(body?.elem1),
    elem2: cleanName(body?.elem2),
    ts: Date.now(),
  };
  if (!HAS_KV) {
    // No persistent store configured — accept gracefully, rank against seed.
    const all = [...SEED, entry].sort((a, b) => b.score - a.score || a.ts - b.ts);
    const rank = all.findIndex((e) => e === entry) + 1;
    return new Response(
      JSON.stringify({ success: true, entry: { ...entry, rank }, ephemeral: true }),
      { status: 200, headers }
    );
  }
  try {
    const rank = await writeEntry(entry);
    return new Response(JSON.stringify({ success: true, entry: { ...entry, rank } }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Storage unavailable' }), { status: 503, headers });
  }
};
