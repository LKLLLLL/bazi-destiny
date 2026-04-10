/**
 * BaZi Destiny — SVG Visualizations
 * Five Elements Wheel, Feng Shui Compass, Pillar Strength Chart
 */

(function(global) {
  'use strict';

  // ============================================================
  // UTILITIES
  // ============================================================

  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  function polarToXY(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(cx, cy, r, startAngle, endAngle) {
    const s = polarToXY(cx, cy, r, endAngle);
    const e = polarToXY(cx, cy, r, startAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 0 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  }

  const ELEM_COLORS = {
    木: { primary: '#5aad68', glow: 'rgba(90,173,104,0.3)', bg: 'rgba(90,173,104,0.08)', label: '#7ac98a' },
    火: { primary: '#e85d4a', glow: 'rgba(232,93,74,0.3)', bg: 'rgba(232,93,74,0.08)', label: '#f07b6a' },
    土: { primary: '#c49a6c', glow: 'rgba(196,154,108,0.3)', bg: 'rgba(196,154,108,0.08)', label: '#d4b28a' },
    金: { primary: '#9e9e9e', glow: 'rgba(180,180,180,0.3)', bg: 'rgba(180,180,180,0.08)', label: '#c0c0c0' },
    水: { primary: '#4a90c4', glow: 'rgba(74,144,196,0.3)', bg: 'rgba(74,144,196,0.08)', label: '#6aaad4' }
  };

  // ============================================================
  // FIVE ELEMENTS WHEEL
  // ============================================================

  function renderFiveElementsWheel(containerId, elements) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = 320;
    const cx = size / 2, cy = size / 2;
    const outerR = 145, innerR = 100;
    const elemOrder = ['木','火','土','金','水'];
    const elemLabels = { 木:'Wood', 火:'Fire', 土:'Earth', 金:'Metal', 水:'Water' };
    const step = 360 / 5;

    // Generators (相生): 木→火→土→金→水→木
    const generators = [
      { from: '木', to: '火' }, { from: '火', to: '土' },
      { from: '土', to: '金' }, { from: '金', to: '水' }, { from: '水', to: '木' }
    ];
    // Overcomers (相克): 木→土, 火→金, 土→水, 金→木, 水→火
    const overcomers = [
      { from: '木', to: '土' }, { from: '火', to: '金' },
      { from: '土', to: '水' }, { from: '金', to: '木' }, { from: '水', to: '火' }
    ];

    let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="elements-wheel-svg" style="overflow:visible">`;

    // Defs
    svg += `<defs>
      <filter id="glow-w" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;

    // Background ring
    svg += svgEl('circle', { cx, cy, r: outerR + 10, fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(212,165,116,0.06)', 'stroke-width': 1 });

    // Generator arrows (相生) - dashed gold lines
    generators.forEach(g => {
      const fi = elemOrder.indexOf(g.from);
      const ti = elemOrder.indexOf(g.to);
      const fa = fi * step - 90;
      const ta = ti * step - 90;
      const rMid = (outerR + innerR) / 2 + 5;
      const p1 = polarToXY(cx, cy, rMid, fa + step / 2 - 20);
      const p2 = polarToXY(cx, cy, rMid, fa + step / 2 + 20);
      const arc = describeArc(cx, cy, rMid, fa + step / 2 - 20, fa + step / 2 + 20);
      svg += `<path d="${arc}" fill="none" stroke="rgba(212,165,116,0.25)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      // Arrow head
      const ap = polarToXY(cx, cy, rMid, fa + step / 2 + 18);
      svg += svgEl('polygon', { points: `${ap.x},${ap.y} ${ap.x-6},${ap.y-4} ${ap.x-6},${ap.y+4}`, fill: 'rgba(212,165,116,0.3)' });
    });

    // Overcomer arrows (相克) - dotted red lines
    overcomers.forEach(o => {
      const fi = elemOrder.indexOf(o.from);
      const ti = elemOrder.indexOf(o.to);
      const fa = fi * step - 90;
      const ta = ti * step - 90;
      const rOuter = outerR + 8;
      const p1 = polarToXY(cx, cy, rOuter, fa + 5);
      const p2 = polarToXY(cx, cy, rOuter, ta - 5);
      svg += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="rgba(232,93,74,0.15)" stroke-width="1" stroke-dasharray="2 4"/>`;
    });

    // Element sectors
    const counts = elements.counts;
    const maxCount = Math.max(...Object.values(counts));
    elemOrder.forEach((elem, i) => {
      const angle = i * step - 90;
      const count = counts[elem];
      const pct = Math.round((count / maxCount) * 100);
      const color = ELEM_COLORS[elem];
      const isDominant = elements.dominant === elem;
      const isDeficient = elements.deficient === elem;

      const sa = angle - step / 2;
      const ea = angle + step / 2;
      const arc = describeArc(cx, cy, outerR, sa, ea);
      const arcInner = describeArc(cx, cy, innerR, ea, sa).replace('M', 'L');
      const close = `L ${polarToXY(cx, cy, outerR, sa).x.toFixed(2)} ${polarToXY(cx, cy, outerR, sa).y.toFixed(2)} Z`;

      // Glow for dominant
      if (isDominant) {
        const glowPath = `M ${polarToXY(cx, cy, innerR, sa).x.toFixed(2)} ${polarToXY(cx, cy, innerR, sa).y.toFixed(2)} ${arc} ${close}`;
        svg += `<path d="${glowPath}" fill="${color.glow}" filter="url(#glow-strong)"/>`;
      }

      // Main sector
      const sectorPath = `M ${polarToXY(cx, cy, innerR, sa).x.toFixed(2)} ${polarToXY(cx, cy, innerR, sa).y.toFixed(2)} ${arc} L ${polarToXY(cx, cy, innerR, ea).x.toFixed(2)} ${polarToXY(cx, cy, innerR, ea).y.toFixed(2)} Z`;
      svg += `<path d="${sectorPath}" fill="${color.bg}" stroke="${isDominant ? color.primary : 'rgba(212,165,116,0.15)'}" stroke-width="${isDominant ? 2 : 1}"/>`;

      // Radial bar for count
      const barR = innerR - 12;
      const barLen = 14 + (pct / 100) * (innerR - 22);
      const p1 = polarToXY(cx, cy, barR, angle - 6);
      const p2 = polarToXY(cx, cy, barLen, angle - 6);
      const p3 = polarToXY(cx, cy, barLen, angle + 6);
      const p4 = polarToXY(cx, cy, barR, angle + 6);
      svg += `<polygon points="${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)} ${p3.x.toFixed(1)},${p3.y.toFixed(1)} ${p4.x.toFixed(1)},${p4.y.toFixed(1)}" fill="${color.primary}" opacity="0.7"/>`;

      // Label
      const labelR = innerR - 30;
      const lp = polarToXY(cx, cy, labelR, angle);
      svg += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 5).toFixed(1)}" text-anchor="middle" fill="${color.label}" font-size="15" font-family="var(--font-display)" font-weight="600">${elemLabels[elem]}</text>`;
      svg += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 20).toFixed(1)}" text-anchor="middle" fill="${color.primary}" font-size="9" fill-opacity="0.7" font-family="var(--font-body)" letter-spacing="1">${count}</text>`;

      // Badge for dominant/deficient
      if (isDominant || isDeficient) {
        const badgeR = outerR + 18;
        const bp = polarToXY(cx, cy, badgeR, angle);
        const badgeColor = isDominant ? '#5aad68' : '#e85d4a';
        const badgeText = isDominant ? '▲' : '▼';
        svg += `<text x="${bp.x.toFixed(1)}" y="${(bp.y + 4).toFixed(1)}" text-anchor="middle" fill="${badgeColor}" font-size="10" font-weight="bold">${badgeText}</text>`;
      }
    });

    // Center text
    svg += svgEl('circle', { cx, cy, r: innerR - 14, fill: 'rgba(7,7,16,0.8)', stroke: 'rgba(212,165,116,0.2)', 'stroke-width': 1 });
    svg += `<text x="${cx}" y="${cy - 8}" text-anchor="middle" fill="var(--gold)" font-size="11" font-family="var(--font-body)" letter-spacing="1" opacity="0.8">FIVE</text>`;
    svg += `<text x="${cx}" y="${cy + 8}" text-anchor="middle" fill="var(--text-primary)" font-size="13" font-family="var(--font-display)" font-weight="600">ELEMENTS</text>`;
    svg += `<text x="${cx}" y="${cy + 24}" text-anchor="middle" fill="var(--text-tertiary)" font-size="9" font-family="var(--font-body)" letter-spacing="0.5">Wood · Fire · Earth · Metal · Water</text>`;

    svg += '</svg>';

    // Legend
    const dominant = elements.dominant;
    const deficient = elements.deficient;
    let legend = `<div class="el-wheel-legend">
      <div class="el-legend-item el-legend-gen">
        <span class="el-legend-line gen-line"></span>
        <span>Generates (nurtures)</span>
      </div>
      <div class="el-legend-item el-legend-over">
        <span class="el-legend-line over-line"></span>
        <span>Controls (overcomes)</span>
      </div>
      <div class="el-legend-item" style="color:#5aad68">▲ Dominant: ${elemLabels[dominant] || dominant}</div>
      <div class="el-legend-item" style="color:#e85d4a">▼ Deficient: ${elemLabels[deficient] || deficient}</div>
    </div>`;

    container.innerHTML = `<div class="wheel-wrapper">${svg}${legend}</div>`;
  }

  // ============================================================
  // FENG SHUI COMPASS
  // ============================================================

  function renderCompass(containerId, directions, dayElement) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = 280;
    const cx = size / 2, cy = size / 2;
    const r1 = 130, r2 = 100, r3 = 70, r4 = 40;
    const auspicious = directions.auspicious || [];
    const inauspicious = directions.inauspicious || [];

    const dirAngles = {
      'East': 0, 'Southeast': 45, 'South': 90, 'Southwest': 135,
      'West': 180, 'Northwest': 225, 'North': 270, 'Northeast': 315
    };
    const dirSymbols = {
      'East': 'E', 'Southeast': 'SE', 'South': 'S', 'Southwest': 'SW',
      'West': 'W', 'Northwest': 'NW', 'North': 'N', 'Northeast': 'NE'
    };

    let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="compass-svg">`;

    svg += `<defs>
      <filter id="compass-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;

    // Background rings
    svg += svgEl('circle', { cx, cy, r: r1 + 4, fill: 'none', stroke: 'rgba(212,165,116,0.1)', 'stroke-width': 1 });
    svg += svgEl('circle', { cx, cy, r: r1, fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(212,165,116,0.2)', 'stroke-width': 1.5 });
    svg += svgEl('circle', { cx, cy, r: r2, fill: 'none', stroke: 'rgba(212,165,116,0.08)', 'stroke-width': 1 });
    svg += svgEl('circle', { cx, cy, r: r3, fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(212,165,116,0.1)', 'stroke-width': 1 });

    // Cardinal ticks
    ['East','South','West','North'].forEach(d => {
      const angle = dirAngles[d];
      const p1 = polarToXY(cx, cy, r1 - 2, angle);
      const p2 = polarToXY(cx, cy, r1 + 4, angle);
      svg += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="rgba(212,165,116,0.5)" stroke-width="2"/>`;
    });

    // Direction zones (fill sectors)
    Object.entries(dirAngles).forEach(([dir, angle]) => {
      const isAuspicious = auspicious.includes(dir);
      const isInauspicious = inauspicious.includes(dir);
      const color = isAuspicious ? 'rgba(90,173,104,0.25)' : isInauspicious ? 'rgba(232,93,74,0.12)' : 'rgba(212,165,116,0.04)';
      const strokeColor = isAuspicious ? 'rgba(90,173,104,0.6)' : isInauspicious ? 'rgba(232,93,74,0.3)' : 'rgba(212,165,116,0.1)';
      const sa = angle - 22;
      const ea = angle + 22;
      const p1 = polarToXY(cx, cy, r1, sa);
      const p2 = polarToXY(cx, cy, r1, ea);
      const p3 = polarToXY(cx, cy, r2, ea);
      const p4 = polarToXY(cx, cy, r2, sa);
      svg += `<path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r1} ${r1} 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} L ${p3.x.toFixed(1)} ${p3.y.toFixed(1)} A ${r2} ${r2} 0 0 0 ${p4.x.toFixed(1)} ${p4.y.toFixed(1)} Z" fill="${color}" stroke="${strokeColor}" stroke-width="1"/>`;
    });

    // Direction labels
    Object.entries(dirAngles).forEach(([dir, angle]) => {
      const labelR = r2 - 15;
      const lp = polarToXY(cx, cy, labelR, angle);
      const isAuspicious = auspicious.includes(dir);
      const isInauspicious = inauspicious.includes(dir);
      const color = isAuspicious ? '#5aad68' : isInauspicious ? '#e85d4a' : 'rgba(212,165,116,0.5)';
      const symbol = dirSymbols[dir];
      svg += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 4).toFixed(1)}" text-anchor="middle" fill="${color}" font-size="11" font-family="var(--font-body)" font-weight="600" letter-spacing="0.5">${symbol}</text>`;
    });

    // Cardinal labels
    ['East','South','West','North'].forEach(d => {
      const angle = dirAngles[d];
      const lp = polarToXY(cx, cy, r1 + 12, angle);
      svg += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 4).toFixed(1)}" text-anchor="middle" fill="rgba(212,165,116,0.6)" font-size="9" font-family="var(--font-body)" letter-spacing="1">${d.toUpperCase()}</text>`;
    });

    // Compass needle
    const needleAngle = directions.compassAngle || 0;
    const np = polarToXY(cx, cy, r3 - 5, needleAngle);
    const np2 = polarToXY(cx, cy, r3 - 5, needleAngle + 180);
    const nl = polarToXY(cx, cy, r3 + 10, needleAngle + 180);

    // Needle shadow
    svg += `<line x1="${np.x.toFixed(1)}" y1="${np.y.toFixed(1)}" x2="${nl.x.toFixed(1)}" y2="${nl.y.toFixed(1)}" stroke="rgba(0,0,0,0.3)" stroke-width="3" stroke-linecap="round"/>`;
    // Needle body
    svg += `<line x1="${np.x.toFixed(1)}" y1="${np.y.toFixed(1)}" x2="${np2.x.toFixed(1)}" y2="${np2.y.toFixed(1)}" stroke="rgba(212,165,116,0.3)" stroke-width="2" stroke-linecap="round"/>`;
    // Needle point (red/gold)
    svg += `<line x1="${np.x.toFixed(1)}" y1="${np.y.toFixed(1)}" x2="${np.x.toFixed(1)}" y2="${np.y.toFixed(1)}" stroke="#e85d4a" stroke-width="2.5" stroke-linecap="round" filter="url(#compass-glow)"/>`;

    // Animated glow ring
    svg += svgEl('circle', { cx, cy, r: r3 + 2, fill: 'none', stroke: 'rgba(212,165,116,0.2)', 'stroke-width': 1, class: 'compass-ring-anim' });

    // Center dot
    svg += svgEl('circle', { cx, cy, r: 5, fill: 'var(--gold)', filter: 'url(#compass-glow)' });
    svg += svgEl('circle', { cx, cy, r: 2, fill: '#0a0806' });

    // BaGua trigrams around outer ring
    const bagua = [
      { sym: '☰', angle: 0, label: 'Heaven' },
      { sym: '☱', angle: 45, label: 'Lake' },
      { sym: '☲', angle: 90, label: 'Fire' },
      { sym: '☳', angle: 135, label: 'Thunder' },
      { sym: '☴', angle: 180, label: 'Wind' },
      { sym: '☵', angle: 225, label: 'Water' },
      { sym: '☶', angle: 270, label: 'Mountain' },
      { sym: '☷', angle: 315, label: 'Earth' }
    ];
    bagua.forEach(b => {
      const lp = polarToXY(cx, cy, r1 + 22, b.angle - 90);
      svg += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 4).toFixed(1)}" text-anchor="middle" fill="rgba(212,165,116,0.25)" font-size="10">${b.sym}</text>`;
    });

    svg += '</svg>';

    // Direction cards
    const dirSVG = {
      'East': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
      'Southeast': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/><line x1="16" y1="8" x2="8" y2="16"/></svg>',
      'South': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="17"/><line x1="12" y1="22" x2="12" y2="17"/></svg>',
      'Southwest': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/></svg>',
      'West': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
      'Northwest': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="8" x2="16" y2="16"/></svg>',
      'North': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>',
      'Northeast': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="16" y1="8" x2="8" y2="16"/></svg>'
    };

    let dirCards = '<div class="compass-dir-grid">';
    [...auspicious, ...inauspicious].forEach(d => {
      const isGood = auspicious.includes(d);
      const svgIcon = dirSVG[d] || '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';
      dirCards += `<div class="compass-dir-card ${isGood ? 'dir-good' : 'dir-bad'}">
        <div class="cdir-emoji" style="color:${isGood ? '#5aad68' : '#e85d4a'}">${svgIcon}</div>
        <span class="cdir-name">${d}</span>
        <span class="cdir-status">${isGood ? 'Auspicious' : 'Use Caution'}</span>
      </div>`;
    });
    dirCards += '</div>';

    container.innerHTML = `<div class="compass-wrapper">${svg}${dirCards}</div>`;
  }

  // ============================================================
  // PILLAR STRENGTH VISUALIZATION
  // ============================================================

  function renderPillarStrength(containerId, pillars) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pillarData = [
      { label: 'Year',  name: 'Year',  ...pillars.year },
      { label: 'Month', name: 'Month', ...pillars.month },
      { label: 'Day',   name: 'Day',   ...pillars.day },
      { label: 'Hour',  name: 'Hour',  ...pillars.hour }
    ];

    const elemColors = {
      木: '#5aad68', 火: '#e85d4a', 土: '#c49a6c', 金: '#9e9e9e', 水: '#4a90c4'
    };
    const zodiacAnimals = {
      子:'Rat', 丑:'Ox', 寅:'Tiger', 卯:'Rabbit', 辰:'Dragon', 巳:'Snake',
      午:'Horse', 未:'Goat', 申:'Monkey', 酉:'Rooster', 戌:'Dog', 亥:'Pig'
    };

    let html = '<div class="pillar-strength-grid">';
    pillarData.forEach((p, i) => {
      const color = elemColors[p.element];
      html += `
        <div class="pillar-str-card" style="animation-delay:${i * 120}ms">
          <div class="psc-label">${p.label} · ${p.name}</div>
          <div class="psc-stem" style="color:${color}">${p.stem}</div>
          <div class="psc-branch">${p.branch} <small>${zodiacAnimals[p.branch] || ''}</small></div>
          <div class="psc-elem-bar">
            <div class="psc-elem-fill" style="background:${color};width:${Math.round((parseInt(p.stemIdx % 5) + 1) * 20)}%"></div>
          </div>
          <div class="psc-elem-name" style="color:${color}">${p.element}</div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // ============================================================
  // SHARE & PDF
  // ============================================================

  function initShareAndPDF() {
    const shareBtn = document.getElementById('shareBtn');
    const pdfBtn = document.getElementById('pdfBtn');
    if (!shareBtn && !pdfBtn) return;

    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const name = document.getElementById('resultGreeting')?.textContent || 'My BaZi Destiny';
        const dominant = document.querySelector('.elem-bar-row:first-child .elem-bar-label')?.textContent || '';
        const text = `🔮 I just discovered my BaZi Destiny on BaZi Destiny!\n\nMy Four Pillars reveal I'm driven by ${dominant} energy.\n\nFind your destiny at: bazidestiny.com`;
        if (navigator.share) {
          try {
            await navigator.share({ title: name, text });
          } catch (e) { /* user cancelled */ }
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(text).then(() => {
            showToast('✨ Link copied! Share it with your friends.');
          }).catch(() => {
            showToast('Could not copy. Try again!');
          });
        }
      });
    }

    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => {
        generatePDF();
      });
    }
  }

  function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:rgba(7,7,16,0.95);border:1px solid rgba(212,165,116,0.3);color:var(--text-primary);padding:14px 24px;border-radius:100px;font-size:14px;z-index:9999;backdrop-filter:blur(10px);animation:toastIn 0.3s ease forwards;';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function generatePDF() {
    showToast('📄 Generating your PDF reading...');
    // Simple canvas-based PDF using html2canvas approach
    // For a real implementation, use jsPDF + html2canvas
    // Here we create a printable summary
    const name = document.getElementById('resultGreeting')?.textContent || 'BaZi Reading';
    const yearP = document.getElementById('resYearPillar')?.textContent || '';
    const monthP = document.getElementById('resMonthPillar')?.textContent || '';
    const dayP = document.getElementById('resDayPillar')?.textContent || '';
    const hourP = document.getElementById('resHourPillar')?.textContent || '';
    const elemAnalysis = document.getElementById('elementAnalysis')?.textContent || '';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><meta charset="UTF-8">
      <title>${name}</title>
      <style>
        body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 40px; color: #1a1a1a; }
        h1 { color: #d4a574; border-bottom: 2px solid #d4a574; padding-bottom: 12px; }
        h2 { color: #333; margin-top: 32px; }
        .pillars { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin: 24px 0; }
        .pillar { background: #f9f5ef; border: 1px solid #d4a574; border-radius: 8px; padding: 16px; text-align: center; }
        .pillar .stem { font-size: 28px; color: #d4a574; }
        .pillar .branch { font-size: 18px; color: #555; }
        .pillar .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; }
        .footer { margin-top: 48px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 16px; text-align: center; }
        @media print { body { margin:0; padding:20px; } }
      </style></head>
      <body>
        <h1>🔮 ${name}</h1>
        <p style="color:#888">Generated by BaZi Destiny — bazidestiny.com</p>
        <div class="pillars">
          <div class="pillar"><div class="label">Year</div><div class="stem">${yearP}</div><div class="branch">Year Pillar</div></div>
          <div class="pillar"><div class="label">Month</div><div class="stem">${monthP}</div><div class="branch">Month Pillar</div></div>
          <div class="pillar"><div class="label">Day</div><div class="stem">${dayP}</div><div class="branch">Day Pillar</div></div>
          <div class="pillar"><div class="label">Hour</div><div class="stem">${hourP}</div><div class="branch">Hour Pillar</div></div>
        </div>
        <h2>Five Elements Analysis</h2>
        <p>${elemAnalysis}</p>
        <div class="footer">© 2025 BaZi Destiny · Ancient Chinese Wisdom for the Modern World</div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  // ============================================================
  // ANIMATE RESULTS ENTRANCE
  // ============================================================

  function animateResultsEntrance() {
    const cards = document.querySelectorAll('.result-card, .result-summary-card, .paywall-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.classList.add('card-hidden');
      observer.observe(card);
    });
  }

  // ============================================================
  // EXPORT
  // ============================================================

  const Viz = {
    renderFiveElementsWheel,
    renderCompass,
    renderPillarStrength,
    initShareAndPDF,
    animateResultsEntrance,
    showToast
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Viz;
  } else {
    global.Viz = Viz;
  }

})(typeof window !== 'undefined' ? window : this);
