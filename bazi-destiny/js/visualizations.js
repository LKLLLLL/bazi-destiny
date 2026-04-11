/**
 * BaZi Destiny — SVG Visualizations
 * Five Elements Wheel, Feng Shui Compass, Pillar Strength Chart
 */

(function(global) {
  'use strict';

  // ============================================================
  // TRANSLATION MAPS — Chinese → English
  // ============================================================
  const STEM_SHORT_EN = {
    '甲': 'Yang Wood', '乙': 'Yin Wood',
    '丙': 'Yang Fire', '丁': 'Yin Fire',
    '戊': 'Yang Earth', '己': 'Yin Earth',
    '庚': 'Yang Metal', '辛': 'Yin Metal',
    '壬': 'Yang Water', '癸': 'Yin Water',
  };
  const BRANCH_TO_EN = {
    '子':'Rat', '丑':'Ox', '寅':'Tiger', '卯':'Rabbit',
    '辰':'Dragon', '巳':'Snake', '午':'Horse', '未':'Goat',
    '申':'Monkey', '酉':'Rooster', '戌':'Dog', '亥':'Pig',
  };
  const ELEM_TO_EN = {
    '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water',
  };
  const STEM_TO_EN = {
    '甲': 'Jia', '乙': 'Yi', '丙': 'Bing', '丁': 'Ding',
    '戊': 'Wu', '己': 'Ji', '庚': 'Geng', '辛': 'Xin',
    '壬': 'Ren', '癸': 'Gui',
  };

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

  // ============================================================
  // FIVE ELEMENTS PIE CHART
  // ============================================================

  function renderFiveElementsPie(containerId, elements) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = 300;
    const cx = size / 2, cy = size / 2;
    const outerR = 125;
    const innerR = 70;
    const elemOrder = ['木','火','土','金','水'];
    const elemLabels = { 木:'Wood', 火:'Fire', 土:'Earth', 金:'Metal', 水:'Water' };
    const counts = elements.counts;
    const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;

    let currentAngle = -90;
    const slices = elemOrder.map((elem) => {
      const val = counts[elem] || 0;
      const pct = val / total;
      const startA = currentAngle;
      const endA = currentAngle + pct * 360;
      currentAngle = endA;
      return { elem, val, pct, label: elemLabels[elem], color: ELEM_COLORS[elem], startA, endA };
    });

    let svgPaths = '';
    slices.forEach(s => {
      const sa = s.startA * Math.PI / 180;
      const ea = s.endA * Math.PI / 180;
      const isDom = elements.dominant === s.elem;
      const isDef = elements.deficient === s.elem;
      const opacity = isDom ? 1 : isDef ? 0.5 : 0.85;
      const strokeC = isDom ? s.color.primary : 'rgba(212,165,116,0.2)';
      const strokeW = isDom ? 2.5 : 1;
      const x1 = (cx + outerR * Math.cos(sa)).toFixed(2);
      const y1 = (cy + outerR * Math.sin(sa)).toFixed(2);
      const x2 = (cx + outerR * Math.cos(ea)).toFixed(2);
      const y2 = (cy + outerR * Math.sin(ea)).toFixed(2);
      const x3 = (cx + innerR * Math.cos(ea)).toFixed(2);
      const y3 = (cy + innerR * Math.sin(ea)).toFixed(2);
      const x4 = (cx + innerR * Math.cos(sa)).toFixed(2);
      const y4 = (cy + innerR * Math.sin(sa)).toFixed(2);
      const large = s.pct > 0.5 ? 1 : 0;
      svgPaths += `<path d="M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z" fill="${s.color.primary}" fill-opacity="${opacity}" stroke="${strokeC}" stroke-width="${strokeW}"${isDom ? ' filter="url(#pie-glow)"' : ''}/>`;
      if (s.pct > 0.06) {
        const midA = ((s.startA + s.endA) / 2) * Math.PI / 180;
        const labelR = (outerR + innerR) / 2;
        const lx = (cx + labelR * Math.cos(midA)).toFixed(1);
        const ly = (cy + labelR * Math.sin(midA) + 4).toFixed(1);
        svgPaths += `<text x="${lx}" y="${ly}" text-anchor="middle" fill="rgba(255,255,255,0.95)" font-size="11" font-weight="700" font-family="var(--font-body)">${Math.round(s.pct * 100)}%</text>`;
      }
    });

    svgPaths += `<circle cx="${cx}" cy="${cy}" r="${innerR - 1}" fill="rgba(7,7,16,0.9)"/>`;
    const dom = elements.dominant;
    const domColor = ELEM_COLORS[dom] || {};
    svgPaths += `<text x="${cx}" y="${cy - 14}" text-anchor="middle" fill="${domColor.primary || '#d4a574'}" font-size="10" font-family="var(--font-body)" letter-spacing="1" opacity="0.9">DOMINANT</text>`;
    svgPaths += `<text x="${cx}" y="${cy + 3}" text-anchor="middle" fill="var(--text-primary)" font-size="16" font-weight="600" font-family="var(--font-display)">${elemLabels[dom] || dom}</text>`;
    svgPaths += `<text x="${cx}" y="${cy + 19}" text-anchor="middle" fill="var(--text-tertiary)" font-size="10" font-family="var(--font-body)">${counts[dom]} pillars</text>`;

    let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="overflow:visible">`;
    svg += `<defs>
      <filter id="pie-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>${svgPaths}</svg>`;

    let legend = `<div class="pie-legend">`;
    slices.forEach(s => {
      const isDom = elements.dominant === s.elem;
      const isDef = elements.deficient === s.elem;
      const badge = isDom ? '▲' : isDef ? '▼' : '';
      const badgeColor = isDom ? '#5aad68' : isDef ? '#e85d4a' : 'transparent';
      legend += `<div class="pie-legend-item">
        <span class="pie-legend-dot" style="background:${s.color.primary}"></span>
        <span class="pie-legend-name">${s.label}</span>
        <span class="pie-legend-bar"><span style="width:${Math.round(s.pct*100)}%;background:${s.color.primary}"></span></span>
        <span class="pie-legend-val">${s.val} <span style="color:${badgeColor};font-size:10px">${badge}</span></span>
      </div>`;
    });
    legend += `</div>`;
    container.innerHTML = `<div class="pie-wrapper">${svg}${legend}</div>`;
  }

  function renderCompass(containerId, directions, dayElement) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = 360;
    const cx = size / 2, cy = size / 2;
    const r1 = 167, r2 = 128, r3 = 90, r4 = 52;
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
      const lp = polarToXY(cx, cy, r1 + 16, angle);
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
      { label: 'Year Pillar',  enStem: STEM_SHORT_EN[pillars.year.stem],   branch: pillars.year.branch,   element: pillars.year.element,   stemIdx: pillars.year.stemIdx },
      { label: 'Month Pillar', enStem: STEM_SHORT_EN[pillars.month.stem],  branch: pillars.month.branch,  element: pillars.month.element,  stemIdx: pillars.month.stemIdx },
      { label: 'Day Pillar',   enStem: STEM_SHORT_EN[pillars.day.stem],    branch: pillars.day.branch,    element: pillars.day.element,    stemIdx: pillars.day.stemIdx },
      { label: 'Hour Pillar',  enStem: STEM_SHORT_EN[pillars.hour.stem],   branch: pillars.hour.branch,   element: pillars.hour.element,   stemIdx: pillars.hour.stemIdx },
    ];

    const elemColors = {
      '木': '#5aad68', '火': '#e85d4a', '土': '#c49a6c', '金': '#9e9e9e', '水': '#4a90c4'
    };

    let html = '<div class="pillar-strength-grid">';
    pillarData.forEach((p, i) => {
      const color = elemColors[p.element];
      const branchEn = BRANCH_TO_EN[p.branch] || '';
      html += `
        <div class="pillar-str-card" style="animation-delay:${i * 120}ms">
          <div class="psc-label">${p.label}</div>
          <div class="psc-stem" style="color:${color}">${p.enStem}</div>
          <div class="psc-branch"><span class="psc-branch-en">${branchEn}</span> <small>(${p.branch})</small></div>
          <div class="psc-elem-bar">
            <div class="psc-elem-fill" style="background:${color};width:${Math.round((parseInt(p.stemIdx % 5) + 1) * 20)}%"></div>
          </div>
          <div class="psc-elem-name" style="color:${color}">${ELEM_TO_EN[p.element]}</div>
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
    renderFiveElementsPie,
    renderCompass,
    renderPillarStrength,
    initShareAndPDF,
    animateResultsEntrance,
    showToast
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Viz;
  } else if (typeof window !== 'undefined') {
    window.Viz = Viz;
  }

})(typeof window !== 'undefined' ? window : this);
