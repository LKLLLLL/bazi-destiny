// Classical Four Pillars (BaZi) engine.
// - Year pillar switches at 立春 (Start of Spring), not Jan 1
// - Month pillar is driven by the 12 节 solar terms (not calendar months)
// - Day pillar uses the sexagenary day cycle, epoch-corrected and DST-safe (UTC math)
// - Lunar calendar table 1900–2049

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZODIAC_ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const STEM_ELEMENTS = ['木', '火', '土', '金', '水'];
const BRANCH_ELEMENTS = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];

// Lunar year bit table 1900–2049. Per year: bits 4–15 = months 1–12 lengths (1 = 30 days),
// bit 16 = leap-month length, bits 0–3 = leap month number (0 = none).
const LUNAR_INFO = new Uint32Array([
  19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970,
  19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343,
  18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800,
  25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536,
  54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423,
  27808, 46416, 86869, 19872, 42416, 83315, 21168, 43432, 59728, 27296,
  44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176,
  38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846,
  38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256,
  19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600,
  51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893,
  43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312,
  31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576,
  23200, 30371, 38608, 19195, 19152, 42192, 118966, 53840, 54560, 56645,
  46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448,
  84835, 37744, 18936, 18800, 25776, 92326, 59984, 27424, 108228, 43744,
  41696, 53987, 51552, 54615, 54432, 55888, 23893, 22176, 42704, 21972,
  21200, 43448, 43344, 46240, 46758, 44368, 21920, 43940, 42416, 21168,
  45683, 26928, 29495, 27296, 44368, 84821, 19296, 42352, 21732, 53600,
  59752, 54560, 55968, 92838, 22224, 19168, 43476, 41680, 53584, 62034,
]);

// Cumulative mean offsets (minutes) of the 24 solar terms from 小寒, within a tropical year.
// Term order: 0 小寒, 1 大寒, 2 立春, 3 雨水, 4 惊蛰, 5 春分, 6 清明, 7 谷雨,
// 8 立夏, 9 小满, 10 芒种, 11 夏至, 12 小暑, 13 大暑, 14 立秋, 15 处暑,
// 16 白露, 17 秋分, 18 寒露, 19 霜降, 20 立冬, 21 小雪, 22 大雪, 23 冬至.
const S_TERM_INFO = [
  0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551,
  218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447,
  419210, 440795, 462224, 483532, 504758,
];
const TROPICAL_YEAR_MS = 31556925974.7;
const S_TERM_EPOCH_MS = Date.UTC(1900, 0, 6, 2, 5); // 小寒 1900 (Beijing-calendar calibrated)

const DAY_MS = 864e5;

function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

/** Whole days between two civil dates, DST-proof. */
function civilDays(y1: number, m1: number, d1: number, y2: number, m2: number, d2: number): number {
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / DAY_MS);
}

/** Day-of-month of solar term n (0–23) in Gregorian year `year`. Valid 1900–2100. */
function solarTermDay(year: number, n: number): number {
  const ms = TROPICAL_YEAR_MS * (year - 1900) + S_TERM_INFO[n] * 60000 + S_TERM_EPOCH_MS;
  return new Date(ms).getUTCDate();
}

/** Day-of-month of the 节 (month-starting term) in Gregorian month `month` (1–12) of `year`. */
function jieDay(year: number, month: number): number {
  return solarTermDay(year, (month - 1) * 2);
}

// ── Lunar calendar ──

function leapMonth(y: number): number {
  return LUNAR_INFO[y - 1900] & 0xf;
}
function leapDays(y: number): number {
  return leapMonth(y) ? (LUNAR_INFO[y - 1900] & 0x10000 ? 30 : 29) : 0;
}
function monthDays(y: number, m: number): number {
  return LUNAR_INFO[y - 1900] & (0x10000 >> m) ? 30 : 29;
}
function yearDays(y: number): number {
  let sum = 348; // 12 × 29
  for (let i = 0x8000; i > 0x8; i >>= 1) sum += LUNAR_INFO[y - 1900] & i ? 1 : 0;
  return sum + leapDays(y);
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

/** Gregorian → lunar. Valid 1900-01-31 … 2049-12-31; clamps outside the table. */
function solarToLunar(y: number, m: number, d: number): LunarDate {
  // Lunar 1900-01-01 was Gregorian 1900-01-31.
  let offset = civilDays(1900, 1, 31, y, m, d);
  if (offset < 0) return { year: 1900, month: 1, day: 1, isLeap: false };

  let year = 1900;
  for (; year < 2050; year++) {
    const yd = yearDays(year);
    if (offset < yd) break;
    offset -= yd;
  }
  if (year >= 2050) return { year: 2049, month: 12, day: 29, isLeap: false };

  const leap = leapMonth(year);
  let month = 1;
  let isLeap = false;
  while (month <= 12) {
    let dim = monthDays(year, month);
    if (offset < dim) break;
    offset -= dim;
    if (month === leap) {
      dim = leapDays(year);
      if (offset < dim) {
        isLeap = true; // same month number, leap instance
        break;
      }
      offset -= dim;
    }
    month++;
  }
  return { year, month, day: offset + 1, isLeap };
}

// ── Four Pillars ──

export interface Pillar {
  stem: string;
  branch: string;
  stemIdx: number;
  branchIdx: number;
  element: string;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  zodiac: string;
  lunar: LunarDate;
  baziYear: number;
  dayStemIdx: number;
  dayBranchIdx: number;
}

function makePillar(stemIdx: number, branchIdx: number): Pillar {
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
    stemIdx,
    branchIdx,
    element: STEM_ELEMENTS[stemIdx % 5],
  };
}

function calculateFourPillars(year: number, month: number, day: number, hour: number): FourPillars {
  // Year pillar — switches at 立春 (term index 2, early February).
  const lichun = solarTermDay(year, 2);
  const afterLichun = month > 2 || (month === 2 && day >= lichun);
  const baziYear = afterLichun ? year : year - 1;
  const yearStemIdx = mod(baziYear - 4, 10);
  const yearBranchIdx = mod(baziYear - 4, 12);

  // Month pillar — governed by the 节 of each solar month (寅月 starts at 立春, …).
  let govYear = year;
  let govMonth = month;
  if (day < jieDay(year, month)) {
    govMonth = month - 1;
    if (govMonth === 0) {
      govMonth = 12;
      govYear = year - 1;
    }
  }
  const monthBranchIdx = govMonth % 12; // Jan→丑(1), Feb→寅(2), …, Dec→子(0)
  const stemYear = govMonth >= 2 ? govYear : govYear - 1; // 节气-year for 五虎遁
  const stemYearStemIdx = mod(stemYear - 4, 10);
  const monthsFromYin = mod(monthBranchIdx - 2, 12); // 寅月 = 0
  const monthStemIdx = mod(2 * (stemYearStemIdx % 5) + 2 + monthsFromYin, 10);

  // Day pillar — sexagenary cycle; 1900-01-01 was 甲戌 (stem idx 0, branch idx 10).
  const daysSince1900 = civilDays(1900, 1, 1, year, month, day);
  const dayStemIdx = mod(daysSince1900, 10);
  const dayBranchIdx = mod(daysSince1900 + 10, 12);

  // Hour pillar — 五鼠遁; 子时 spans 23:00–00:59.
  const chineseHourIdx = mod(Math.floor((hour + 1) / 2), 12);
  const hourStemIdx = mod(2 * dayStemIdx + chineseHourIdx, 10);

  return {
    year: makePillar(yearStemIdx, yearBranchIdx),
    month: makePillar(monthStemIdx, monthBranchIdx),
    day: makePillar(dayStemIdx, dayBranchIdx),
    hour: makePillar(hourStemIdx, chineseHourIdx),
    zodiac: ZODIAC_ANIMALS[yearBranchIdx],
    lunar: solarToLunar(year, month, day),
    baziYear,
    dayStemIdx,
    dayBranchIdx,
  };
}

// ── Five Elements ──

export interface ElementAnalysis {
  counts: Record<string, number>;
  percentages: Record<string, number>;
  total: number;
  dominant: string;
  deficient: string;
}

function analyzeFiveElements(pillars: FourPillars): ElementAnalysis {
  const elements: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const p of [pillars.year, pillars.month, pillars.day, pillars.hour]) {
    elements[p.element] += 2;
    elements[BRANCH_ELEMENTS[p.branchIdx]] += 1;
  }
  const dayMaster = pillars.day.element;
  elements[dayMaster] += 2;

  const total = Object.values(elements).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};
  for (const [elem, count] of Object.entries(elements)) {
    percentages[elem] = Math.round((count / total) * 100);
  }
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  return { counts: elements, percentages, total, dominant: sorted[0][0], deficient: sorted[4][0] };
}

// ── Lucky kit ──

function getLuckyDirections(pillars: FourPillars) {
  const directionMap: Record<string, { auspicious: string[]; inauspicious: string[]; luckDir: number }> = {
    木: { auspicious: ['East', 'Southeast'], inauspicious: ['West', 'Northeast'], luckDir: 0 },
    火: { auspicious: ['South', 'Southeast'], inauspicious: ['North', 'Northwest'], luckDir: 2 },
    土: { auspicious: ['Northeast', 'Southwest'], inauspicious: ['East', 'Southeast'], luckDir: 8 },
    金: { auspicious: ['West', 'Northwest'], inauspicious: ['South', 'Southeast'], luckDir: 3 },
    水: { auspicious: ['North', 'Northeast'], inauspicious: ['South', 'Southwest'], luckDir: 1 },
  };
  const config = directionMap[pillars.day.element] || directionMap['土'];
  return { auspicious: config.auspicious, inauspicious: config.inauspicious, compassAngle: 45 * config.luckDir };
}

function getLuckyItems(pillars: FourPillars) {
  const luckyMap: Record<string, { colors: string[]; colorNames: string[]; numbers: number[]; element: string; tones: string }> = {
    木: { colors: ['#4CAF50', '#8BC34A', '#2E7D32', '#AED581', '#C8E6C9'], colorNames: ['Green', 'Emerald', 'Forest Green', 'Sage', 'Mint'], numbers: [3, 4], element: 'Wood', tones: 'Growth & Renewal' },
    火: { colors: ['#F44336', '#FF5722', '#FF9800', '#FFCDD2', '#FFECB3'], colorNames: ['Red', 'Vermilion', 'Orange', 'Coral', 'Amber'], numbers: [7, 9], element: 'Fire', tones: 'Passion & Energy' },
    土: { colors: ['#8D6E63', '#A1887F', '#D7CCC8', '#FFCCBC', '#BCAAA4'], colorNames: ['Brown', 'Beige', 'Tan', 'Terracotta', 'Clay'], numbers: [5, 8, 0], element: 'Earth', tones: 'Stability & Nourishment' },
    金: { colors: ['#9E9E9E', '#BDBDBD', '#E0E0E0', '#F5F5F5', '#C0C0C0'], colorNames: ['White', 'Silver', 'Gray', 'Gold', 'Platinum'], numbers: [6, 7], element: 'Metal', tones: 'Precision & Clarity' },
    水: { colors: ['#2196F3', '#03A9F4', '#80DEEA', '#B3E5FC', '#4FC3F7'], colorNames: ['Blue', 'Azure', 'Sky Blue', 'Ice Blue', 'Navy'], numbers: [1, 9], element: 'Water', tones: 'Wisdom & Flow' },
  };
  return luckyMap[pillars.day.element] || luckyMap['土'];
}

// ── Meanings ──

function getYearName(year: number): string {
  return HEAVENLY_STEMS[mod(year - 4, 10)] + EARTHLY_BRANCHES[mod(year - 4, 12)];
}

function getStemMeaning(stem: string): string {
  const map: Record<string, string> = {
    甲: 'Yang Wood — The First Stem. Initiator, leader, visionary.',
    乙: 'Yin Wood — The Second Stem. Flexibility, creativity, adaptability.',
    丙: 'Yang Fire — The Third Stem. Brightness, vitality, directness.',
    丁: 'Yin Fire — The Fourth Stem. Refined warmth, inner strength.',
    戊: 'Yang Earth — The Fifth Stem. Stability, reliability, endurance.',
    己: 'Yin Earth — The Sixth Stem. Nurturing ground, self-reflection.',
    庚: 'Yang Metal — The Seventh Stem. Justice, rigidity, reform.',
    辛: 'Yin Metal — The Eighth Stem. Delicacy, transformation, refinement.',
    壬: 'Yang Water — The Ninth Stem. Flow, wisdom, circulation.',
    癸: 'Yin Water — The Tenth Stem. Depth, introspection, subtlety.',
  };
  return map[stem] || '';
}

function getBranchMeaning(branch: string): string {
  const map: Record<string, string> = {
    子: 'Rat — Intelligence, adaptability, resourcefulness. The scholar and survivor.',
    丑: 'Ox — Diligence, patience, reliability. The steadfast worker.',
    寅: 'Tiger — Courage, passion, leadership. The bold pioneer.',
    卯: 'Rabbit — Gentleness, creativity, compassion. The artist and dreamer.',
    辰: 'Dragon — Ambition, power, good fortune. The visionary leader.',
    巳: 'Snake — Wisdom, charm, depth. The mystic and strategist.',
    午: 'Horse — Energy, freedom, enthusiasm. The adventurer and communicator.',
    未: 'Goat — Harmony, kindness, beauty. The peacemaker and nurturer.',
    申: 'Monkey — Intelligence, curiosity, cleverness. The innovator.',
    酉: 'Rooster — Precision, confidence, loyalty. The analyst and perfectionist.',
    戌: 'Dog — Loyalty, fidelity, protection. The faithful guardian.',
    亥: 'Pig — Sincerity, generosity, prosperity. The honest friend.',
  };
  return map[branch] || '';
}

// ── Public API ──

export const BaZiEngine = {
  /** Full reading from an ISO date string ("YYYY-MM-DD") and hour (0–23, fractional allowed). */
  calculate(birthDateStr: string, hour: number) {
    const [year, month, day] = birthDateStr.split('-').map(Number);
    const pillars = calculateFourPillars(year, month, day, hour);
    return {
      pillars,
      elements: analyzeFiveElements(pillars),
      directions: getLuckyDirections(pillars),
      lucky: getLuckyItems(pillars),
      yearName: getYearName(pillars.baziYear),
      dayStemMeaning: getStemMeaning(pillars.day.stem),
      dayBranchMeaning: getBranchMeaning(pillars.day.branch),
      dayStemIdx: pillars.dayStemIdx,
      dayBranchIdx: pillars.dayBranchIdx,
    };
  },

  calculateFourPillars(year: number, month: number, day: number, hour: number) {
    const pillars = calculateFourPillars(year, month, day, hour);
    return {
      pillars,
      elements: analyzeFiveElements(pillars),
      directions: getLuckyDirections(pillars),
      lucky: getLuckyItems(pillars),
    };
  },

  solarToLunar,
  getStemMeaning,
  getBranchMeaning,
  getYearName,
};

export default BaZiEngine;
