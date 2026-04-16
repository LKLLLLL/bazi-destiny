/**
 * Vercel Serverless Function — BaZi Love Leaderboard API
 * GET  /api/leaderboard          → return top 100 entries
 * POST /api/leaderboard          → submit a new entry
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../public/data/leaderboard.json');
const MAX_ENTRIES = 100;

// ---------- helpers ----------

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { entries: [], lastUpdated: new Date().toISOString() };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function isValidEntry(body) {
  return (
    body &&
    typeof body.name1 === 'string' && body.name1.trim().length >= 1 && body.name1.trim().length <= 30 &&
    typeof body.name2 === 'string' && body.name2.trim().length >= 1 && body.name2.trim().length <= 30 &&
    typeof body.score === 'number' && body.score >= 0 && body.score <= 100 &&
    typeof body.tier === 'string' && body.tier.trim().length <= 50 &&
    typeof body.elem1 === 'string' && body.elem1.trim().length <= 20 &&
    typeof body.elem2 === 'string' && body.elem2.trim().length <= 20 &&
    typeof body.year1 === 'number' &&
    typeof body.year2 === 'number'
  );
}

// ---------- GET /api/leaderboard ----------

exports.GET = function(req, res) {
  const data = readData();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    entries: data.entries.slice(0, MAX_ENTRIES),
    total: data.entries.length,
    lastUpdated: data.lastUpdated
  });
};

// ---------- POST /api/leaderboard ----------

exports.POST = function(req, res) {
  const data = readData();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (!isValidEntry(req.body)) {
    return res.status(400).json({ error: 'Invalid entry data.' });
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name1: req.body.name1.trim(),
    name2: req.body.name2.trim(),
    score: req.body.score,
    tier: req.body.tier.trim(),
    elem1: req.body.elem1.trim(),
    elem2: req.body.elem2.trim(),
    year1: req.body.year1,
    year2: req.body.year2,
    submittedAt: new Date().toISOString()
  };

  data.entries.push(entry);

  // Keep only top 200 (descending), then slice to MAX_ENTRIES
  data.entries.sort((a, b) => b.score - a.score);
  if (data.entries.length > 200) {
    data.entries = data.entries.slice(0, 200);
  }
  data.entries = data.entries.slice(0, MAX_ENTRIES);
  data.lastUpdated = new Date().toISOString();

  writeData(data);

  res.status(201).json({ success: true, entry, rank: data.entries.findIndex(e => e.id === entry.id) + 1 });
};

// ---------- Vercel handler (unified) ----------

module.exports = function handler(req, res) {
  if (req.method === 'GET')  return exports.GET(req, res);
  if (req.method === 'POST') return exports.POST(req, res);
  res.status(405).json({ error: 'Method not allowed.' });
};
