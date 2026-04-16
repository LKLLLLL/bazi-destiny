import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://keen-chipmunk-81278.upstash.io',
  token: 'gQAAAAAAAT1-AAIncDJkZjljZTdkZjY2YWQ0OGM0OTc1MjRmNGU1NWI1YmFmM3AyODEyNzg',
});

const LEADERBOARD_KEY = 'bazi:leaderboard';
const MAX_ENTRIES = 100;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Get top entries from Redis (sorted set, highest score first)
      const entries = await redis.zrange(LEADERBOARD_KEY, 0, MAX_ENTRIES - 1, {
        rev: true,
        withScores: true,
      });

      // Format: [name1, score1, name2, score2, ...]
      const leaderboard = [];
      for (let i = 0; i < entries.length; i += 2) {
        leaderboard.push({
          name: entries[i],
          score: parseInt(entries[i + 1], 10),
          rank: leaderboard.length + 1,
        });
      }

      return res.status(200).json({ leaderboard });
    } catch (error) {
      console.error('Redis GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name1, name2, score } = req.body;

      if (!name1 || !name2 || typeof score !== 'number') {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create entry key: "name1 & name2"
      const entryName = `${name1} & ${name2}`;

      // Add to sorted set (score is the sort key)
      await redis.zadd(LEADERBOARD_KEY, { score, member: entryName });

      // Keep only top MAX_ENTRIES
      const count = await redis.zcard(LEADERBOARD_KEY);
      if (count > MAX_ENTRIES) {
        await redis.zremrangebyrank(LEADERBOARD_KEY, 0, count - MAX_ENTRIES - 1);
      }

      // Get rank of the new entry
      const rank = await redis.zrevrank(LEADERBOARD_KEY, entryName);

      return res.status(200).json({
        success: true,
        entry: { name: entryName, score, rank: rank + 1 },
      });
    } catch (error) {
      console.error('Redis POST error:', error);
      return res.status(500).json({ error: 'Failed to submit to leaderboard' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
