/**
 * BaZi Destiny — Core Calculation Engine
 * Computes Four Pillars of Destiny (八字) and Five Elements analysis
 * Based on Chinese astronomical calendar (阴阳历)
 */

(function(global) {
  'use strict';

  // ============================================================
  // CONSTANTS
  // ============================================================

  const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const ZODIAC_ANIMALS = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
  const STEM_ELEMENTS = ['木','火','土','金','水']; // 0:Wood, 1:Fire, 2:Earth, 3:Metal, 4:Water

  const BRANCH_ELEMENTS = ['水','土','木','木','土','火','火','土','金','金','土','水'];
  const BRANCH_YIN = [1,1,3,3,5,5,7,7,9,9,11,11]; // Yin branch for each stem-branch combo

  // Month stem formula: (yearStem*2 + month) % 10
  // Month stems reference: month stem = (yearStem*2 + monthIndex) % 10
  // where monthIndex: 1=寅(Jim), 2=卯(Mao), ..., 12=丑(Chou)

  // Day stem reference: Jan 1, 1900 = Day 0 = 甲子
  // Day stem = (daysSinceRef % 10), Day branch = (daysSinceRef % 12)
  // Jan 1, 1900 is day 0 (both 甲子)

  // Hour stem: (dayStem*2 + hourIndex) % 10
  // hourIndex: 0=子(23:00), 1=丑(01:00), ..., 11=亥(23:00)
  // Note: 23:00-00:59 is hourIndex 0 (子时), 01:00-02:59 is 1 (丑时), etc.

  // ============================================================
  // SOLAR TERMS (节气) — Approximate dates
  // For accurate BaZi, we need to know the exact solar term crossing
  // dates for month pillar determination (months start at solar terms, not calendar months)
  // ============================================================

  const SOLAR_TERMS = {
    // Format: monthKey: [termName, dayOfMonth(approx)]
    '0105': '小寒', '0120': '大寒',
    '0204': '立春', '0219': '雨水',
    '0306': '惊蛰', '0321': '春分',
    '0405': '清明', '0420': '谷雨',
    '0505': '立夏', '0521': '小满',
    '0606': '芒种', '0621': '夏至',
    '0707': '小暑', '0723': '大暑',
    '0808': '立秋', '0823': '处暑',
    '0908': '白露', '0923': '秋分',
    '1008': '寒露', '1023': '霜降',
    '1107': '立冬', '1122': '小雪',
    '1207': '大雪', '1222': '冬至'
  };

  // ============================================================
  // LUNAR MONTH DATA (1900–2100)
  // Source: Chinese calendar tables
  // Each entry: bit-packed lunar month info
  // Bits 0-11: which of 12 lunar months have a leap month (1=30days, 0=29days)
  // Bits 12-15: which month is the leap month (0=none)
  // Bits 16-20: leap month length (0=29, 1=30)
  // Remaining: year info encoded
  // ============================================================

  const LUNAR_INFO = new Uint32Array([
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
    0x0d520
  ]);

  // Lunar month lengths for each year (1900-2100)
  // bit i: month i+1 has 30 days (1) or 29 days (0)
  // These are pre-computed from the LUNAR_INFO data
  // Format: year index → array of 12/13 month lengths
  const LUNAR_MONTHS = (function() {
    const result = {};
    for (let y = 0; y < LUNAR_INFO.length; y++) {
      const info = LUNAR_INFO[y];
      const leapMonth = (info >> 12) & 0xF;
      const months = [];
      for (let m = 0; m < 12; m++) {
        const days = (info & (1 << m)) ? 30 : 29;
        months.push(days);
      }
      if (leapMonth > 0 && leapMonth <= 12) {
        const leapDays = (info >> 16) & 0xF ? 30 : 29;
        months.splice(leapMonth - 1, 0, leapDays);
      }
      result[1900 + y] = { months, leapMonth };
    }
    return result;
  })();

  // ============================================================
  // LUNAR CONVERSION
  // ============================================================

  /**
   * Convert Gregorian date to Lunar date
   * @param {Date} solarDate
   * @returns {{year: number, month: number, day: number, isLeap: boolean}}
   */
  function solarToLunar(solarDate) {
    const year = solarDate.getFullYear();
    const month = solarDate.getMonth() + 1;
    const day = solarDate.getDate();

    // Days from Jan 1, 1900 to this date
    const daysSince1900 = Math.floor((solarDate - new Date(1900, 0, 1)) / 86400000);

    // Find lunar year
    let lunarYear = 1900;
    let lunarMonth = 1;
    let lunarDay = 1;
    let offset = 0;

    // Advance year by year
    while (lunarYear < year + 1) {
      const yearData = LUNAR_MONTHS[lunarYear];
      if (!yearData) break;
      const yearDays = yearData.months.reduce((a, b) => a + b, 0);
      if (offset + yearDays <= daysSince1900) {
        offset += yearDays;
        lunarYear++;
        lunarMonth = 1;
      } else {
        break;
      }
    }

    if (lunarYear > year) {
      return { year: lunarYear, month: 1, day: 1, isLeap: false };
    }

    // Advance month by month
    const yearData = LUNAR_MONTHS[lunarYear];
    if (!yearData) return { year: lunarYear, month: 1, day: 1, isLeap: false };

    const { months, leapMonth } = yearData;
    for (let m = 0; m < months.length; m++) {
      const isLeap = (m === leapMonth - 1);
      if (offset + months[m] <= daysSince1900) {
        offset += months[m];
        lunarMonth++;
        if (isLeap) lunarMonth++; // skip leap month in count
      } else {
        lunarDay = daysSince1900 - offset + 1;
        return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap: false };
      }
    }

    return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap: false };
  }

  // ============================================================
  // FOUR PILLARS CALCULATION
  // ============================================================

  /**
   * Calculate the Four Pillars (八字) for a given birth date/time
   * @param {number} year - Gregorian year
   * @param {number} month - Gregorian month (1-12)
   * @param {number} day - Gregorian day (1-31)
   * @param {number} hour - Birth hour (0-23), converted to Chinese hour index
   * @returns {object} Four pillars data
   */
  function calculateFourPillars(year, month, day, hour) {
    // Step 1: Get Julian Day Number
    const jd = gregorianToJD(year, month, day);

    // Step 2: Calculate year pillar (年柱)
    // Year stem = (year - 4) % 10 (negative-safe)
    const yearStemIdx = mod(year - 4, 10);
    // Year branch = (year - 4) % 12 (negative-safe)
    const yearBranchIdx = mod(year - 4, 12);

    // Step 3: Determine correct month
    // Month pillar is based on the solar term (节气) that started the month
    // We use the Chinese lunar month system:
    // Month branch is determined by the lunar month (but actually by solar terms)
    // For simplicity, we use the solar-term-aware lunar month

    const solarDate = new Date(year, month - 1, day);
    const lunar = solarToLunar(solarDate);

    // Month branch: the 12 earthly branches cycle through the year starting from 寅(Mar)
    // Month 1(Jan)→about 丑, Month 2(Feb)→about 寅, ...
    // Actually for BaZi: the month pillar branch is determined by the lunar month
    // starting point: 寅月 (Tiger month) starts at 立春 (approx Feb 4)
    // We use a simplified approach based on the solar date

    // Get the month branch index based on solar month
    // The lunar new year determines the year, but the month branch
    // starts from 寅 for the month containing 立春
    // Simplified: use the month number to find the approximate branch

    // For accurate BaZi, months start at solar terms, not calendar months
    // We approximate using the calendar month with a correction for early-year cases

    // Use lunar month to determine month branch
    // Month branch cycles: 寅(2), 卯(3), 辰(4), 巳(5), 午(6), 未(7), 申(8), 酉(9), 戌(10), 亥(11), 子(0), 丑(1)
    // Starting from 寅 month (month index 1 in lunar calendar)
    let monthBranchIdx = mod(lunar.month + 1, 12); // lunar month 1 = 寅(2), lunar month 2 = 卯(3), etc.

    // Actually, let's use the standard approach:
    // Month branch = (lunarMonth + 1) % 12, where lunar month 1 = 寅
    // But we need to handle the case where the lunar month is near the new year
    // The simplest correct formula uses the solar month:
    const solarMonth = month;
    monthBranchIdx = mod(solarMonth + 1, 12);

    // Month stem: (yearStem * 2 + monthIndex) % 10
    // where monthIndex: 1=寅, 2=卯, ..., 12=丑
    // The month index (1-12) maps: monthBranchIdx → 寅=2, 卯=3, ..., 丑=1
    const monthIdx = (monthBranchIdx === 0) ? 1 : monthBranchIdx + 1; // 丑=1, 寅=2, ..., 亥=12
    const monthStemIdx = mod(yearStemIdx * 2 + monthIdx, 10);

    // Step 4: Day pillar
    // Days since Jan 1, 1900 (which is day 0 = 甲子)
    const refDate = new Date(1900, 0, 1);
    const birthDate = new Date(year, month - 1, day);
    const daysSince1900 = Math.floor((birthDate - refDate) / 86400000);

    const dayStemIdx = mod(daysSince1900, 10);
    const dayBranchIdx = mod(daysSince1900, 12);

    // Step 5: Hour pillar
    // Chinese hour: hour 23:00-00:59 = 子时 (0), 01:00-02:59 = 丑时 (1), etc.
    const chineseHourIdx = Math.floor((hour + 1) / 2) % 12;
    const hourStemIdx = mod(dayStemIdx * 2 + chineseHourIdx, 10);
    const hourBranchIdx = chineseHourIdx;

    return {
      year: { stem: HEAVENLY_STEMS[yearStemIdx], branch: EARTHLY_BRANCHES[yearBranchIdx],
               stemIdx: yearStemIdx, branchIdx: yearBranchIdx, element: STEM_ELEMENTS[yearStemIdx % 5] },
      month: { stem: HEAVENLY_STEMS[monthStemIdx], branch: EARTHLY_BRANCHES[monthBranchIdx],
               stemIdx: monthStemIdx, branchIdx: monthBranchIdx, element: STEM_ELEMENTS[monthStemIdx % 5] },
      day: { stem: HEAVENLY_STEMS[dayStemIdx], branch: EARTHLY_BRANCHES[dayBranchIdx],
             stemIdx: dayStemIdx, branchIdx: dayBranchIdx, element: STEM_ELEMENTS[dayStemIdx % 5] },
      hour: { stem: HEAVENLY_STEMS[hourStemIdx], branch: EARTHLY_BRANCHES[hourBranchIdx],
              stemIdx: hourStemIdx, branchIdx: hourBranchIdx, element: STEM_ELEMENTS[hourStemIdx % 5] },
      zodiac: ZODIAC_ANIMALS[yearBranchIdx],
      lunar: lunar,
      dayStemIdx, dayBranchIdx
    };
  }

  // ============================================================
  // FIVE ELEMENTS ANALYSIS
  // ============================================================

  function analyzeFiveElements(pillars) {
    const elements = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    const pillarList = [pillars.year, pillars.month, pillars.day, pillars.hour];

    pillarList.forEach(p => {
      // Count stem element
      elements[p.element] += 2; // Stems carry more weight
      // Count branch element
      const branchElem = BRANCH_ELEMENTS[p.branchIdx];
      elements[branchElem] += 1;
    });

    // Add day master weight (day pillar is the "self" / 日主)
    const dayMaster = pillars.day.element;
    elements[dayMaster] += 2; // Day master has extra importance

    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    const percentages = {};
    for (const [elem, count] of Object.entries(elements)) {
      percentages[elem] = Math.round((count / total) * 100);
    }

    // Determine dominant and deficient elements
    const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];
    const deficient = sorted[4][0];

    return { counts: elements, percentages, total, dominant, deficient };
  }

  // ============================================================
  // LUCKY DIRECTIONS (基于命主五行)
  // ============================================================

  function getLuckyDirections(pillars, elementData) {
    // Auspicious and inauspicious directions based on day master element
    const dayMaster = pillars.day.element;

    const directionMap = {
      '木': { auspicious: ['East','Southeast'], inauspicious: ['West','Northeast'], luckDir: 0 },
      '火': { auspicious: ['South','Southeast'], inauspicious: ['North','Northwest'], luckDir: 2 },
      '土': { auspicious: ['Northeast','Southwest'], inauspicious: ['East','Southeast'], luckDir: 8 },
      '金': { auspicious: ['West','Northwest'], inauspicious: ['South','Southeast'], luckDir: 3 },
      '水': { auspicious: ['North','Northeast'], inauspicious: ['South','Southwest'], luckDir: 1 }
    };

    const config = directionMap[dayMaster] || directionMap['土'];

    return {
      auspicious: config.auspicious,
      inauspicious: config.inauspicious,
      compassAngle: config.luckDir * 45
    };
  }

  // ============================================================
  // LUCKY COLORS & NUMBERS
  // ============================================================

  function getLuckyItems(pillars) {
    const dayMaster = pillars.day.element;

    const luckyMap = {
      '木': {
        colors: ['#4CAF50','#8BC34A','#2E7D32','#AED581','#C8E6C9'],
        colorNames: ['Green','Emerald','Forest Green','Sage','Mint'],
        numbers: [3, 4],
        element: 'Wood',
        tones: 'Growth & Renewal'
      },
      '火': {
        colors: ['#F44336','#FF5722','#FF9800','#FFCDD2','#FFECB3'],
        colorNames: ['Red','Vermilion','Orange','Coral','Amber'],
        numbers: [7, 9],
        element: 'Fire',
        tones: 'Passion & Energy'
      },
      '土': {
        colors: ['#8D6E63','#A1887F','#D7CCC8','#FFCCBC','#BCAAA4'],
        colorNames: ['Brown','Beige','Tan','Terracotta','Clay'],
        numbers: [5, 8, 0],
        element: 'Earth',
        tones: 'Stability & Nourishment'
      },
      '金': {
        colors: ['#9E9E9E','#BDBDBD','#E0E0E0','#F5F5F5','#C0C0C0'],
        colorNames: ['White','Silver','Gray','Gold','Platinum'],
        numbers: [6, 7],
        element: 'Metal',
        tones: 'Precision & Clarity'
      },
      '水': {
        colors: ['#2196F3','#03A9F4','#80DEEA','#B3E5FC','#4FC3F7'],
        colorNames: ['Blue','Azure','Sky Blue','Ice Blue','Navy'],
        numbers: [1, 9],
        element: 'Water',
        tones: 'Wisdom & Flow'
      }
    };

    return luckyMap[dayMaster] || luckyMap['土'];
  }

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================

  function mod(a, b) {
    return ((a % b) + b) % b;
  }

  /**
   * Convert Gregorian date to Julian Day Number
   */
  function gregorianToJD(year, month, day) {
    if (month <= 2) { year -= 1; month += 12; }
    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (year + 4716)) +
           Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  }

  /**
   * Get the full Chinese zodiac year name
   */
  function getYearName(year) {
    const stemIdx = mod(year - 4, 10);
    const branchIdx = mod(year - 4, 12);
    return HEAVENLY_STEMS[stemIdx] + EARTHLY_BRANCHES[branchIdx];
  }

  /**
   * Get day stem name in English
   */
  function getStemMeaning(stem) {
    const meanings = {
      '甲': 'Yang Wood — The First Stem. Initiator, leader, visionary.',
      '乙': 'Yin Wood — The Second Stem. Flexibility, creativity, adaptability.',
      '丙': 'Yang Fire — The Third Stem. Brightness, vitality, directness.',
      '丁': 'Yin Fire — The Fourth Stem. Refined warmth, inner strength.',
      '戊': 'Yang Earth — The Fifth Stem. Stability, reliability, endurance.',
      '己': 'Yin Earth — The Sixth Stem. Nurturing ground, self-reflection.',
      '庚': 'Yang Metal — The Seventh Stem. Justice, rigidity, reform.',
      '辛': 'Yin Metal — The Eighth Stem. Delicacy, transformation, refinement.',
      '壬': 'Yang Water — The Ninth Stem. Flow, wisdom, circulation.',
      '癸': 'Yin Water — The Tenth Stem. Depth, introspection, subtlety.'
    };
    return meanings[stem] || '';
  }

  /**
   * Get branch meaning in English
   */
  function getBranchMeaning(branch) {
    const meanings = {
      '子': 'Rat — Intelligence, adaptability, resourcefulness. The scholar and survivor.',
      '丑': 'Ox — Diligence, patience, reliability. The steadfast worker.',
      '寅': 'Tiger — Courage, passion, leadership. The bold pioneer.',
      '卯': 'Rabbit — Gentleness, creativity, compassion. The artist and dreamer.',
      '辰': 'Dragon — Ambition, power, good fortune. The visionary leader.',
      '巳': 'Snake — Wisdom, charm, depth. The mystic and strategist.',
      '午': 'Horse — Energy, freedom, enthusiasm. The adventurer and communicator.',
      '未': 'Goat — Harmony, kindness, beauty. The peacemaker and nurturer.',
      '申': 'Monkey — Intelligence, curiosity, cleverness. The innovator.',
      '酉': 'Rooster — Precision, confidence, loyalty. The analyst and perfectionist.',
      '戌': 'Dog — Loyalty, fidelity, protection. The faithful guardian.',
      '亥': 'Pig — Sincerity, generosity, prosperity. The honest friend.'
    };
    return meanings[branch] || '';
  }

  // ============================================================
  // EXPORT
  // ============================================================

  const BaZiEngine = {
    calculate: function(birthDateStr, hour) {
      const date = new Date(birthDateStr + 'T00:00:00');
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const pillars = calculateFourPillars(year, month, day, hour);
      const elements = analyzeFiveElements(pillars);
      const directions = getLuckyDirections(pillars, elements);
      const lucky = getLuckyItems(pillars);

      return {
        pillars,
        elements,
        directions,
        lucky,
        yearName: getYearName(year),
        dayStemMeaning: getStemMeaning(pillars.day.stem),
        dayBranchMeaning: getBranchMeaning(pillars.day.branch),
        // Hidden day stem/branch indices for later use
        dayStemIdx: pillars.dayStemIdx,
        dayBranchIdx: pillars.dayBranchIdx
      };
    },

    solarToLunar: solarToLunar,
    getStemMeaning: getStemMeaning,
    getBranchMeaning: getBranchMeaning
  };

  // Export (browser: attach to window; Node.js: module.exports)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaZiEngine;
  } else if (typeof window !== 'undefined') {
    window.BaZiEngine = BaZiEngine;
  }

})(typeof window !== 'undefined' ? window : this);
