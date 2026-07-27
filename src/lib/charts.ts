// Night-observatory themed SVG charts for BaZi readings.

export interface ElementData {
  counts: Record<string, number>;
  percentages: Record<string, number>;
  dominant: string;
  deficient: string;
}

export const ELEM_ORDER = ['木', '火', '土', '金', '水'] as const;
export const ELEM_EN: Record<string, string> = { 木: 'Wood', 火: 'Fire', 土: 'Earth', 金: 'Metal', 水: 'Water' };
export const ELEM_COLOR: Record<string, string> = {
  木: '#7cc282',
  火: '#e86a4f',
  土: '#d2a35e',
  金: '#c9cddb',
  水: '#63a8d8',
};
export const BRANCH_EN: Record<string, string> = {
  子: 'Rat', 丑: 'Ox', 寅: 'Tiger', 卯: 'Rabbit', 辰: 'Dragon', 巳: 'Snake',
  午: 'Horse', 未: 'Goat', 申: 'Monkey', 酉: 'Rooster', 戌: 'Dog', 亥: 'Pig',
};
export const STEM_EN: Record<string, string> = {
  甲: 'Yang Wood', 乙: 'Yin Wood', 丙: 'Yang Fire', 丁: 'Yin Fire', 戊: 'Yang Earth',
  己: 'Yin Earth', 庚: 'Yang Metal', 辛: 'Yin Metal', 壬: 'Yang Water', 癸: 'Yin Water',
};
export const ZODIAC_EMOJI: Record<string, string> = {
  Rat: '🐭', Ox: '🐂', Tiger: '🐯', Rabbit: '🐰', Dragon: '🐲', Snake: '🐍',
  Horse: '🐴', Goat: '🐐', Monkey: '🐵', Rooster: '🐓', Dog: '🐕', Pig: '🐷',
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Five-elements donut with glow on the dominant slice and center label. */
export function elementsDonut(elements: ElementData): string {
  const cx = 150, cy = 150, rOut = 122, rIn = 74;
  const total = ELEM_ORDER.reduce((s, e) => s + (elements.counts[e] || 0), 0) || 1;
  let angle = -90;
  let paths = '';
  for (const elem of ELEM_ORDER) {
    const val = elements.counts[elem] || 0;
    const pct = val / total;
    const a0 = angle, a1 = angle + pct * 360;
    angle = a1;
    const color = ELEM_COLOR[elem];
    const isDom = elements.dominant === elem;
    const isDef = elements.deficient === elem;
    const p1 = polar(cx, cy, rOut, a0), p2 = polar(cx, cy, rOut, a1);
    const p3 = polar(cx, cy, rIn, a1), p4 = polar(cx, cy, rIn, a0);
    const large = pct > 0.5 ? 1 : 0;
    const opacity = isDom ? 1 : isDef ? 0.45 : 0.8;
    paths += `<path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${rOut} ${rOut} 0 ${large} 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} L ${p3.x.toFixed(1)} ${p3.y.toFixed(1)} A ${rIn} ${rIn} 0 ${large} 0 ${p4.x.toFixed(1)} ${p4.y.toFixed(1)} Z"
      fill="${color}" fill-opacity="${opacity}" stroke="${isDom ? color : 'rgba(7,8,15,0.9)'}" stroke-width="${isDom ? 2 : 1.5}">
      <title>${ELEM_EN[elem]} — ${Math.round(pct * 100)}%</title></path>`;
    if (pct > 0.07) {
      const mid = (a0 + a1) / 2;
      const lp = polar(cx, cy, (rOut + rIn) / 2, mid);
      paths += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 4).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="#0b0d17">${Math.round(pct * 100)}%</text>`;
    }
  }
  const domColor = ELEM_COLOR[elements.dominant];
  paths += `<circle cx="${cx}" cy="${cy}" r="${rIn - 6}" fill="#0b0d17" stroke="rgba(212,175,106,0.14)"/>`;
  paths += `<text x="${cx}" y="${cy - 24}" text-anchor="middle" font-size="9.5" letter-spacing="2.5" fill="${domColor}" opacity="0.9">DOMINANT</text>`;
  paths += `<text x="${cx}" y="${cy + 2}" text-anchor="middle" font-size="30" fill="${domColor}" font-family="'Noto Serif SC',serif">${elements.dominant}</text>`;
  paths += `<text x="${cx}" y="${cy + 26}" text-anchor="middle" font-size="13" fill="#ece7da" font-weight="600">${ELEM_EN[elements.dominant]}</text>`;
  return `<svg viewBox="0 0 300 300" role="img" aria-label="Five elements distribution" class="chart-donut">${paths}</svg>`;
}

/** Element balance bars in generating-cycle order. */
export function elementBars(elements: ElementData): string {
  const max = Math.max(...ELEM_ORDER.map((e) => elements.counts[e] || 0), 1);
  return ELEM_ORDER.map((elem) => {
    const count = elements.counts[elem] || 0;
    const w = Math.max((count / max) * 100, 3);
    const isDom = elements.dominant === elem;
    const isDef = elements.deficient === elem;
    return `<div class="ebar-row">
      <span class="ebar-han" style="color:${ELEM_COLOR[elem]}">${elem}</span>
      <span class="ebar-name">${ELEM_EN[elem]}</span>
      <span class="ebar-track"><span class="ebar-fill${isDom ? ' dom' : ''}${isDef ? ' def' : ''}" style="width:${w}%;background:${ELEM_COLOR[elem]}"></span></span>
      <span class="ebar-count">${count}${isDom ? ' ★' : ''}</span>
    </div>`;
  }).join('');
}

/** Compass rose highlighting auspicious directions. */
export function compass(directions: { auspicious: string[]; inauspicious: string[] }, elemColor: string): string {
  const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
  const FULL: Record<string, string> = {
    N: 'North', NE: 'Northeast', E: 'East', SE: 'Southeast',
    S: 'South', SW: 'Southwest', W: 'West', NW: 'Northwest',
  };
  const cx = 130, cy = 130;
  let out = `<circle cx="${cx}" cy="${cy}" r="118" fill="none" stroke="rgba(212,175,106,0.18)"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="96" fill="none" stroke="rgba(212,175,106,0.1)"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="40" fill="none" stroke="rgba(212,175,106,0.22)"/>`;
  DIRS.forEach((d, i) => {
    const deg = i * 45;
    const full = FULL[d];
    const isGood = directions.auspicious.includes(full);
    const isBad = directions.inauspicious.includes(full);
    const outer = polar(cx, cy, 118, deg);
    const inner = polar(cx, cy, 96, deg);
    const lp = polar(cx, cy, 76, deg);
    out += `<line x1="${inner.x.toFixed(1)}" y1="${inner.y.toFixed(1)}" x2="${outer.x.toFixed(1)}" y2="${outer.y.toFixed(1)}" stroke="${isGood ? elemColor : 'rgba(212,175,106,0.25)'}" stroke-width="${isGood ? 3 : 1.2}"/>`;
    if (isGood) {
      const arc0 = deg - 20, arc1 = deg + 20;
      const a0 = polar(cx, cy, 107, arc0), a1 = polar(cx, cy, 107, arc1);
      out += `<path d="M ${a0.x.toFixed(1)} ${a0.y.toFixed(1)} A 107 107 0 0 1 ${a1.x.toFixed(1)} ${a1.y.toFixed(1)}" fill="none" stroke="${elemColor}" stroke-width="5" stroke-linecap="round" opacity="0.85"/>`;
    }
    out += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 4).toFixed(1)}" text-anchor="middle" font-size="${d.length > 1 ? 11 : 13}" font-weight="${isGood ? 700 : 400}" fill="${isGood ? elemColor : isBad ? '#84806f' : '#b6b1a2'}">${d}</text>`;
  });
  out += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" fill="#ece7da" font-family="'Noto Serif SC',serif">罗盘</text>`;
  out += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="8.5" letter-spacing="1.5" fill="#84806f">FENG SHUI</text>`;
  return `<svg viewBox="0 0 260 260" role="img" aria-label="Lucky directions compass" class="chart-compass">${out}</svg>`;
}

/** Circular score ring used by Love Match. */
export function scoreRing(score: number, color: string, size = 180): string {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return `<svg viewBox="0 0 200 200" style="width:${size}px;height:${size}px" role="img" aria-label="Compatibility score ${score} out of 100">
    <circle cx="100" cy="100" r="${r}" fill="none" stroke="rgba(236,231,218,0.08)" stroke-width="9"/>
    <circle cx="100" cy="100" r="${r}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"
      stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"
      transform="rotate(-90 100 100)" style="filter:drop-shadow(0 0 10px ${color}66);transition:stroke-dashoffset 1.2s var(--ease-out)"/>
    <text x="100" y="96" text-anchor="middle" font-size="44" font-weight="700" fill="${color}" font-family="'Cormorant Garamond',serif">${score}</text>
    <text x="100" y="122" text-anchor="middle" font-size="10.5" letter-spacing="2" fill="#84806f">OUT OF 100</text>
  </svg>`;
}

export interface PillarStrengthData {
  label: string;
  stem: string;
  branch: string;
  stemEn: string;
  branchEn: string;
  element: string;
  strength: number; // 0-100
  isDay: boolean;
}

/** Four Pillars strength cards — visual gauge for each pillar. */
export function pillarStrengthCards(pillars: {
  year: { stem: string; branch: string; stemIdx: number; element: string };
  month: { stem: string; branch: string; stemIdx: number; element: string };
  day: { stem: string; branch: string; stemIdx: number; element: string };
  hour: { stem: string; branch: string; stemIdx: number; element: string };
}): string {
  const data: PillarStrengthData[] = [
    {
      label: 'Year Pillar · 年柱',
      stem: pillars.year.stem,
      branch: pillars.year.branch,
      stemEn: STEM_EN[pillars.year.stem] || pillars.year.stem,
      branchEn: BRANCH_EN[pillars.year.branch] || '',
      element: pillars.year.element,
      strength: Math.round(((pillars.year.stemIdx % 10) / 9) * 90 + 10),
      isDay: false,
    },
    {
      label: 'Month Pillar · 月柱',
      stem: pillars.month.stem,
      branch: pillars.month.branch,
      stemEn: STEM_EN[pillars.month.stem] || pillars.month.stem,
      branchEn: BRANCH_EN[pillars.month.branch] || '',
      element: pillars.month.element,
      strength: Math.round(((pillars.month.stemIdx % 10) / 9) * 90 + 10),
      isDay: false,
    },
    {
      label: 'Day Pillar · 日柱',
      stem: pillars.day.stem,
      branch: pillars.day.branch,
      stemEn: STEM_EN[pillars.day.stem] || pillars.day.stem,
      branchEn: BRANCH_EN[pillars.day.branch] || '',
      element: pillars.day.element,
      strength: Math.round(((pillars.day.stemIdx % 10) / 9) * 90 + 10),
      isDay: true,
    },
    {
      label: 'Hour Pillar · 时柱',
      stem: pillars.hour.stem,
      branch: pillars.hour.branch,
      stemEn: STEM_EN[pillars.hour.stem] || pillars.hour.stem,
      branchEn: BRANCH_EN[pillars.hour.branch] || '',
      element: pillars.hour.element,
      strength: Math.round(((pillars.hour.stemIdx % 10) / 9) * 90 + 10),
      isDay: false,
    },
  ];

  return data
    .map(
      (p, i) => `
    <div class="ps-card${p.isDay ? ' ps-core' : ''}" style="--d:${i * 0.1}s;--pc:${ELEM_COLOR[p.element] || 'var(--gold)'}">
      <span class="ps-label">${p.label}</span>
      <div class="ps-bar-track">
        <span class="ps-bar-fill" style="width:${p.strength}%;background:var(--pc)"></span>
      </div>
      <span class="ps-strength">${p.strength}%</span>
      ${p.isDay ? '<span class="ps-badge">Core</span>' : ''}
    </div>`
    )
    .join('');
}
