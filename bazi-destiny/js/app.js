/**
 * BaZi Destiny — App Logic
 * Handles navigation, calculations, and UI rendering
 */

(function() {
  'use strict';

  // ============================================================
  // STATE
  // ============================================================

  let currentData = null;
  let isProUnlocked = false;

  // ============================================================
  // NAVIGATION
  // ============================================================

  function showHome() {
    document.getElementById('homeSection').style.display = '';
    document.getElementById('how-it-works').style.display = '';
    document.getElementById('pricing').style.display = '';
    document.getElementById('calculator').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('calcForm').style.display = '';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('userName').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('birthHour').value = '';
    document.getElementById('birthLocation').value = '';
    currentData = null;
    isProUnlocked = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showCalculator() {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('how-it-works').style.display = 'none';
    document.getElementById('pricing').style.display = 'none';
    document.getElementById('calculator').style.display = '';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('calcForm').style.display = '';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('userName').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('birthHour').value = '';
    document.getElementById('birthLocation').value = '';
    currentData = null;
    isProUnlocked = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToSection(id) {
    showHome();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const header = document.getElementById('siteHeader');
        const offset = header ? header.offsetHeight + 20 : 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
  }

  function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
  }

  // ============================================================
  // HEADER SCROLL EFFECT
  // ============================================================

  function initScrollEffect() {
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ============================================================
  // FORM VALIDATION & SUBMISSION
  // ============================================================

  function validateForm() {
    const date = document.getElementById('birthDate').value;
    const hour = document.getElementById('birthHour').value;
    if (!date) { alert('Please enter your birth date.'); return false; }
    if (hour === '') { alert('Please select your birth hour.'); return false; }
    // Check date range (1900-2030)
    const d = new Date(date);
    if (d < new Date('1900-01-01') || d > new Date('2030-12-31')) {
      alert('Please enter a date between 1900 and 2030.');
      return false;
    }
    return true;
  }

  function calculateBaZi() {
    if (!validateForm()) return;

    const name = document.getElementById('userName').value.trim();
    const date = document.getElementById('birthDate').value;
    const hour = parseInt(document.getElementById('birthHour').value, 10);
    const gender = document.getElementById('userGender').value;
    const location = document.getElementById('birthLocation').value.trim();

    // Show loading
    document.getElementById('calcForm').style.display = 'none';
    document.getElementById('loadingState').style.display = '';

    // Animate loading steps
    const steps = ['ls1','ls2','ls3','ls4'];
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      if (stepIdx > 0) document.getElementById(steps[stepIdx - 1]).classList.remove('active');
      if (stepIdx < steps.length) document.getElementById(steps[stepIdx]).classList.add('active');
      stepIdx++;
      if (stepIdx >= steps.length + 1) clearInterval(stepInterval);
    }, 600);

    setTimeout(() => {
      // Calculate BaZi
      const data = BaZiEngine.calculate(date, hour);
      currentData = {
        ...data,
        name: name || 'Friend',
        gender,
        location,
        birthDate: date
      };

      clearInterval(stepInterval);
      displayResults(currentData);
    }, 2400);
  }

  // ============================================================
  // DISPLAY RESULTS
  // ============================================================

  function displayResults(data) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultsSection').style.display = '';

    // Update summary
    const name = data.name;
    document.getElementById('resultGreeting').textContent =
      `${name}'s BaZi Destiny`;
    document.getElementById('resultSubtitle').textContent =
      `Your Four Pillars reveal a unique energetic profile shaped by ${data.elements.dominant} energy. Below is your free foundation reading.`;

    // Mini pillars
    document.getElementById('resYearPillar').textContent = data.pillars.year.stem + data.pillars.year.branch;
    document.getElementById('resYearElem').textContent = data.pillars.year.element;
    document.getElementById('resMonthPillar').textContent = data.pillars.month.stem + data.pillars.month.branch;
    document.getElementById('resMonthElem').textContent = data.pillars.month.element;
    document.getElementById('resDayPillar').textContent = data.pillars.day.stem + data.pillars.day.branch;
    document.getElementById('resDayElem').textContent = data.pillars.day.element;
    document.getElementById('resHourPillar').textContent = data.pillars.hour.stem + data.pillars.hour.branch;
    document.getElementById('resHourElem').textContent = data.pillars.hour.element;

    // Element bars
    renderElementBars(data.elements);

    // Lucky directions
    renderLuckyDirections(data.directions);

    // Personality (free)
    const personality = Readings.getPersonality(data.pillars.day.stem, data.elements.dominant);
    document.getElementById('readingPersonality').innerHTML = renderPersonalityReading(personality);

    // Paywall card (always shown for free users)
    document.getElementById('paywallCard').style.display = '';

    // Pro content (hidden until paid)
    renderProContent(data);

    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderElementBars(elements) {
    const container = document.getElementById('elementBars');
    const elemOrder = ['木','火','土','金','水'];
    const elemLabels = { 木:'Wood', 火:'Fire', 土:'Earth', 金:'Metal', 水:'Water' };
    const maxCount = Math.max(...Object.values(elements.counts));

    let html = '';
    elemOrder.forEach(elem => {
      const count = elements.counts[elem];
      const pct = elements.percentages[elem];
      const barWidth = Math.round((count / maxCount) * 100);
      html += `
        <div class="elem-bar-row elem-${elem === '木' ? 'wood' : elem === '火' ? 'fire' : elem === '土' ? 'earth' : elem === '金' ? 'metal' : 'water'}">
          <span class="elem-bar-label">${elemLabels[elem]}</span>
          <div class="elem-bar-track">
            <div class="elem-bar-fill" style="width:${barWidth}%"></div>
          </div>
          <span class="elem-bar-count">${count}</span>
        </div>
      `;
    });
    container.innerHTML = html;

    // Analysis text
    const analysis = document.getElementById('elementAnalysis');
    const dominant = elements.dominant;
    const deficient = elements.deficient;
    const dominantLabel = {木:'Wood',火:'Fire',土:'Earth',金:'Metal',水:'Water'}[dominant];
    const deficientLabel = {木:'Wood',火:'Fire',土:'Earth',金:'Metal',水:'Water'}[deficient];

    analysis.innerHTML = `
      <h4>${dominantLabel} Dominant · ${deficientLabel} Deficient</h4>
      <p>Your elemental profile shows <strong>${dominantLabel} energy</strong> as your strongest force. This shapes your personality, decision-making, and life path significantly. Meanwhile, <strong>${deficientLabel}</strong> is your weakest element — this represents an area where you may face challenges or where additional harmony is needed. Feng Shui adjustments and conscious lifestyle choices can help balance your elemental energy.</p>
    `;
  }

  function renderLuckyDirections(directions) {
    const container = document.getElementById('luckyDirections');
    const directionEmojis = {
      'East': '🌅', 'Southeast': '🌄', 'South': '☀️', 'Southwest': '🌇',
      'West': '🌆', 'Northwest': '🌬️', 'North': '🌌', 'Northeast': '🏔️'
    };

    const auspicious = directions.auspicious.map(d => ({
      name: d,
      icon: directionEmojis[d] || '🧭',
      desc: d + ' is your power direction'
    }));

    const inauspicious = directions.inauspicious.map(d => ({
      name: d,
      icon: directionEmojis[d] || '⚠️',
      desc: 'Use with caution'
    }));

    let html = '';
    [...auspicious, ...inauspicious].forEach(d => {
      const isGood = directions.auspicious.includes(d.name);
      html += `
        <div class="direction-card">
          <div class="direction-icon">${d.icon}</div>
          <div class="direction-info">
            <strong style="color:${isGood ? 'var(--gold)' : 'var(--text-tertiary)'}">${d.name}</strong>
            <span>${d.desc}</span>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function renderPersonalityReading(p) {
    const traits = p.traits.map(t => `<li>• ${t}</li>`).join('');
    return `
      <p><strong>${p.title}</strong></p>
      <p>${p.summary}</p>
      <p><strong>Your Strength:</strong> ${p.strength}</p>
      <p><strong>Your Challenge:</strong> ${p.weakness}</p>
      <p><strong>Ideal Path:</strong> ${p.idealPath}</p>
      <div style="margin-top:16px;">
        <strong>Key Traits:</strong>
        <ul style="margin-top:8px;">${traits}</ul>
      </div>
    `;
  }

  function renderProContent(data) {
    const career = Readings.getCareer(data.elements.dominant);
    const rel = Readings.getRelationship(data.elements.dominant);
    const health = Readings.getHealth(data.elements.dominant);
    const fengshui = Readings.getFengShui(data.elements.dominant, data.pillars.day.stem, data.elements.dominant);
    const lucky = data.lucky;

    // Career
    const careerStrengths = career.strengths.map(s => `<li>• ${s}</li>`).join('');
    const careerChallenges = career.challenges.map(c => `<li>• ${c}</li>`).join('');
    const wealthTips = career.wealthTips.map(t => `<li>• ${t}</li>`).join('');
    document.getElementById('readingCareer').innerHTML = `
      <p><strong>Career Overview:</strong> ${career.overview}</p>
      <p><strong>Your Career Strengths:</strong></p>
      <ul style="margin:8px 0 16px 0;">${careerStrengths}</ul>
      <p><strong>Challenges to Watch:</strong></p>
      <ul style="margin:8px 0 16px 0;">${careerChallenges}</ul>
      <p><strong>Wealth-Building Tips:</strong></p>
      <ul style="margin:8px 0 0 0;">${wealthTips}</ul>
    `;
    document.getElementById('fengshuiCareer').textContent =
      fengshui.overview.substring(0, 200) + '...';

    // Relationships
    const relGrowth = rel.growthAreas.map(g => `<li>• ${g}</li>`).join('');
    document.getElementById('readingRelationships').innerHTML = `
      <p><strong>Your Relationship Style:</strong> ${rel.overview}</p>
      <p><strong>Ideal Partner:</strong> ${rel.idealPartner}</p>
      <p><strong>Communication Pattern:</strong> ${rel.communication}</p>
      <p><strong>Growth Areas for Deeper Connection:</strong></p>
      <ul style="margin:8px 0 0 0;">${relGrowth}</ul>
    `;

    // Health
    const healthTips = health.wellnessTips.map(t => `<li>• ${t}</li>`).join('');
    const healthConcerns = health.commonConcerns.map(c => `<li>• ${c}</li>`).join('');
    document.getElementById('readingHealth').innerHTML = `
      <p><strong>Your Health Profile:</strong> ${health.overview}</p>
      <p><strong>Areas to Watch:</strong></p>
      <ul style="margin:8px 0 16px 0;">${healthConcerns}</ul>
      <p><strong>Wellness Recommendations:</strong></p>
      <ul style="margin:8px 0 0 0;">${healthTips}</ul>
    `;
    document.getElementById('fengshuiHealth').textContent =
      health.wellnessTips[0] + ' ' + health.wellnessTips[1];

    // Lucky Pro
    const colorsHtml = lucky.colors.map((c, i) =>
      `<span style="background:${c}" title="${lucky.colorNames[i]}"></span>`
    ).join('');
    document.getElementById('luckyProGrid').innerHTML = `
      <div class="lucky-pro-item">
        <h4>Lucky Numbers</h4>
        <div class="lucky-pro-values">${lucky.numbers.join(' · ')}</div>
      </div>
      <div class="lucky-pro-item">
        <h4>Element</h4>
        <div class="lucky-pro-values">${lucky.element}<small>${lucky.tones}</small></div>
      </div>
      <div class="lucky-pro-item">
        <h4>Lucky Colors</h4>
        <div class="lucky-pro-colors">${colorsHtml}</div>
      </div>
    `;

    // Feng Shui
    const fengshuiTipsHtml = fengshui.tips.slice(0, 4).map(t => {
      const parts = t.split(' — ');
      return `<div class="fshui-tip"><strong>${parts[0]}</strong>${parts[1] ? ' — ' + parts[1] : ''}</div>`;
    }).join('');
    document.getElementById('readingFengShui').innerHTML = `
      <p>${fengshui.overview}</p>
      <h4 style="margin-top:20px; font-family:var(--font-display);">Personal Feng Shui Cures</h4>
    `;
    document.getElementById('fshuiTips').innerHTML = fengshuiTipsHtml;
  }

  // ============================================================
  // PAYMENT / UPGRADE
  // ============================================================

  function showUpgrade(tier) {
    const modal = document.getElementById('paymentModal');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDesc');
    const price = document.getElementById('modalPrice');

    if (tier === 'pro') {
      title.textContent = 'Unlock Destiny Master';
      desc.textContent = 'Get the complete BaZi reading with Career, Wealth, Relationships, Health analysis, personalized Feng Shui guidance, and PDF download.';
      price.textContent = '$9.90';
    } else {
      title.textContent = 'Upgrade to Soul Guide';
      desc.textContent = 'Everything in Destiny Master plus 1:1 AI follow-up Q&A, 30-minute Feng Shui room consultation, and 3 months of monthly horoscopes.';
      price.textContent = '$29.90';
    }

    modal.style.display = '';
  }

  function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    // For demo purposes, unlock pro content
    if (currentData) {
      unlockPro();
    }
  }

  function unlockPro() {
    isProUnlocked = true;
    // Show pro cards
    ['cardCareer','cardRelationships','cardHealth','cardLuckyPro','cardFengShui'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
    // Hide paywall
    const paywall = document.getElementById('paywallCard');
    if (paywall) paywall.style.display = 'none';

    if (currentData) {
      renderProContent(currentData);
    }

    // Scroll to career card
    const card = document.getElementById('cardCareer');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ============================================================
  // DEMO: ANIMATE HERO PILLARS
  // ============================================================

  const DEMO_PILLARS = [
    { stem: '甲', branch: '子', elem: '木' },
    { stem: '乙', branch: '丑', elem: '木' },
    { stem: '丙', branch: '寅', elem: '火' },
    { stem: '丁', branch: '卯', elem: '火' },
    { stem: '戊', branch: '辰', elem: '土' },
    { stem: '己', branch: '巳', elem: '火' },
    { stem: '庚', branch: '午', elem: '金' },
    { stem: '辛', branch: '未', elem: '金' },
    { stem: '壬', branch: '申', elem: '水' },
    { stem: '癸', branch: '酉', elem: '水' },
    { stem: '甲', branch: '戌', elem: '木' },
    { stem: '乙', branch: '亥', elem: '木' }
  ];

  function animateDemo() {
    const now = new Date();
    // Pick a pseudo-random pillar based on time
    const idx = Math.floor(now.getSeconds() / 5) % DEMO_PILLARS.length;
    const p = DEMO_PILLARS[idx];
    const p2 = DEMO_PILLARS[(idx + 1) % DEMO_PILLARS.length];
    const p3 = DEMO_PILLARS[(idx + 2) % DEMO_PILLARS.length];
    const p4 = DEMO_PILLARS[(idx + 3) % DEMO_PILLARS.length];

    document.getElementById('demoStem1').textContent = p.stem;
    document.getElementById('demoBranch1').textContent = p.branch;
    document.getElementById('demoElem1').textContent = p.elem;
    document.getElementById('demoStem2').textContent = p2.stem;
    document.getElementById('demoBranch2').textContent = p2.branch;
    document.getElementById('demoElem2').textContent = p2.elem;
    document.getElementById('demoStem3').textContent = p3.stem;
    document.getElementById('demoBranch3').textContent = p3.branch;
    document.getElementById('demoElem3').textContent = p3.elem;
    document.getElementById('demoStem4').textContent = p4.stem;
    document.getElementById('demoBranch4').textContent = p4.branch;
    document.getElementById('demoElem4').textContent = p4.elem;
  }

  // ============================================================
  // INIT
  // ============================================================

  function init() {
    initScrollEffect();
    animateDemo();
    setInterval(animateDemo, 5000);

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('mobileMenu');
      const btn = document.querySelector('.mobile-menu-btn');
      if (menu && menu.classList.contains('open')) {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
          menu.classList.remove('open');
        }
      }
    });

    // Modal overlay click to close
    document.getElementById('paymentModal').addEventListener('click', (e) => {
      if (e.target.id === 'paymentModal') closePaymentModal();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePaymentModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose
  window.showHome = showHome;
  window.showCalculator = showCalculator;
  window.scrollToSection = scrollToSection;
  window.toggleMobileMenu = toggleMobileMenu;
  window.calculateBaZi = calculateBaZi;
  window.showUpgrade = showUpgrade;
  window.closePaymentModal = closePaymentModal;

})();
