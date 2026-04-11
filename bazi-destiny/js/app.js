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
  window.currentReading = null;

  // ============================================================
  // TRANSLATION MAPS — Chinese → English
  // ============================================================
  const STEM_TO_EN = {
    '甲': 'Jia (Yang Wood)', '乙': 'Yi (Yin Wood)',
    '丙': 'Bing (Yang Fire)', '丁': 'Ding (Yin Fire)',
    '戊': 'Wu (Yang Earth)', '己': 'Ji (Yin Earth)',
    '庚': 'Geng (Yang Metal)', '辛': 'Xin (Yin Metal)',
    '壬': 'Ren (Yang Water)', '癸': 'Gui (Yin Water)',
  };

  const STEM_SHORT_EN = {
    '甲': 'Yang Wood', '乙': 'Yin Wood',
    '丙': 'Yang Fire', '丁': 'Yin Fire',
    '戊': 'Yang Earth', '己': 'Yin Earth',
    '庚': 'Yang Metal', '辛': 'Yin Metal',
    '壬': 'Yang Water', '癸': 'Yin Water',
  };

  const BRANCH_TO_EN = {
    '子': 'Rat', '丑': 'Ox', '寅': 'Tiger', '卯': 'Rabbit',
    '辰': 'Dragon', '巳': 'Snake', '午': 'Horse', '未': 'Goat',
    '申': 'Monkey', '酉': 'Rooster', '戌': 'Dog', '亥': 'Pig',
  };

  const ELEM_TO_EN = {
    '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water',
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  function showHome() {
    hideAllSections();
    document.getElementById('homeSection').style.display = '';
    document.getElementById('how-it-works').style.display = '';
    document.getElementById('pricing').style.display = '';
    document.getElementById('calcForm').style.display = '';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('userName').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('birthHour').value = '';
    document.getElementById('birthLocation').value = '';
    currentData = null;
    isProUnlocked = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showCalculator() {
    hideAllSections();
    document.getElementById('calculator').style.display = '';
    document.getElementById('calcForm').style.display = '';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('userName').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('birthHour').value = '';
    document.getElementById('birthLocation').value = '';
    currentData = null;
    isProUnlocked = false;
    document.getElementById('calcForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (!menu) return;
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
    const dominantElemEn = ELEM_TO_EN[data.elements.dominant] || data.elements.dominant;

    // Expose for share button
    window.currentReading = data;
    document.getElementById('resultGreeting').textContent =
      `${name}'s BaZi Destiny`;
    document.getElementById('resultSubtitle').textContent =
      `Your Four Pillars reveal a unique energetic profile shaped by ${dominantElemEn} energy. Below is your free foundation reading.`;
    const domLabel = document.getElementById('dominantElemLabel');
    if (domLabel) domLabel.textContent = dominantElemEn;

    // Mini pillars — show English stem + English branch
    const p = data.pillars;
    document.getElementById('resYearPillar').textContent =
      STEM_SHORT_EN[p.year.stem] + ' · ' + BRANCH_TO_EN[p.year.branch];
    document.getElementById('resYearElem').textContent = ELEM_TO_EN[p.year.element];
    document.getElementById('resMonthPillar').textContent =
      STEM_SHORT_EN[p.month.stem] + ' · ' + BRANCH_TO_EN[p.month.branch];
    document.getElementById('resMonthElem').textContent = ELEM_TO_EN[p.month.element];
    document.getElementById('resDayPillar').textContent =
      STEM_SHORT_EN[p.day.stem] + ' · ' + BRANCH_TO_EN[p.day.branch];
    document.getElementById('resDayElem').textContent = ELEM_TO_EN[p.day.element];
    document.getElementById('resHourPillar').textContent =
      STEM_SHORT_EN[p.hour.stem] + ' · ' + BRANCH_TO_EN[p.hour.branch];
    document.getElementById('resHourElem').textContent = ELEM_TO_EN[p.hour.element];

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

    // New visualizations
    if (typeof Viz !== 'undefined') {
      Viz.renderFiveElementsPie('fiveElementsWheel', data.elements);
      Viz.renderCompass('fengShuiCompass', data.directions, data.pillars.day.element);
      Viz.renderPillarStrength('pillarStrength', data.pillars);
      Viz.initShareAndPDF();
      Viz.animateResultsEntrance();
    }

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

    // Clear directional SVG icons
    const dirIcons = {
      'North':     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2L12 22M12 2L7 7M12 2L17 7"/><text x="12" y="8" text-anchor="middle" font-size="6" stroke="none" fill="currentColor" font-family="Inter">N</text></svg>',
      'South':     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22L12 2M12 22L7 17M12 22L17 17"/><text x="12" y="19" text-anchor="middle" font-size="6" stroke="none" fill="currentColor" font-family="Inter">S</text></svg>',
      'East':      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12L22 12M22 12L17 7M22 12L17 17"/><text x="17" y="15" text-anchor="middle" font-size="6" stroke="none" fill="currentColor" font-family="Inter">E</text></svg>',
      'West':      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 12L2 12M2 12L7 7M2 12L7 17"/><text x="7" y="15" text-anchor="middle" font-size="6" stroke="none" fill="currentColor" font-family="Inter">W</text></svg>',
      'Northeast': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20L20 4M20 4L4 4M20 4L20 10"/></svg>',
      'Northwest': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 20L4 4M4 4L20 4M4 4L4 10"/></svg>',
      'Southeast': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4L20 20M4 20L20 20M4 20L10 20"/></svg>',
      'Southwest': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 4L4 20M20 4L4 4M20 4L20 10"/></svg>',
    };

    const auspicious = directions.auspicious.map(d => ({
      name: d,
      icon: dirIcons[d] || '',
      desc: 'Your power direction — maximize energy here'
    }));

    const inauspicious = directions.inauspicious.map(d => ({
      name: d,
      icon: dirIcons[d] || '',
      desc: 'Rest & recover here — minimize effort in this direction'
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
    const features = document.getElementById('modalFeatures');
    const btn = document.getElementById('checkoutBtn');

    // Store selected tier for checkout
    setCheckoutTier(tier);

    if (tier === 'pro') {
      title.textContent = 'Unlock Destiny Master';
      desc.textContent = 'Get the complete BaZi reading with Career, Wealth, Relationships, Health analysis, personalized Feng Shui guidance, and PDF download.';
      price.innerHTML = '$9.90 <small style="font-size:18px;color:var(--text-tertiary);font-weight:400;">one-time</small>';
      features.innerHTML = `
        <div class="modal-feature-item">✓ Full 12-section BaZi reading</div>
        <div class="modal-feature-item">✓ Personalized Feng Shui analysis</div>
        <div class="modal-feature-item">✓ Lucky numbers, colors & directions</div>
        <div class="modal-feature-item">✓ PDF report download</div>
      `;
      btn.innerHTML = '💳 Pay $9.90 — Unlock Now';
    } else {
      title.textContent = 'Upgrade to Soul Guide';
      desc.textContent = 'Everything in Destiny Master plus 1:1 Follow-up Q&A, 30-minute Feng Shui room consultation, and 3 months of monthly horoscopes.';
      price.innerHTML = '$29.90 <small style="font-size:18px;color:var(--text-tertiary);font-weight:400;">one-time</small>';
      features.innerHTML = `
        <div class="modal-feature-item">✓ Everything in Destiny Master</div>
        <div class="modal-feature-item">✓ 1:1 Follow-up Q&A session</div>
        <div class="modal-feature-item">✓ 30-min Feng Shui room consultation</div>
        <div class="modal-feature-item">✓ 3 months of monthly horoscopes</div>
      `;
      btn.innerHTML = '💳 Pay $29.90 — Unlock Now';
    }

    modal.style.display = '';
  }

  function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
  }

  // ============================================================
  // LEMON SQUEEZY CHECKOUT
  // ============================================================

  // PayPal Configuration
  const PAYPAL_CONFIG = {
    businessEmail: 'qwe4320325@gmail.com',
    currency: 'USD',
    products: {
      pro: {
        name: 'Destiny Master - Pro Reading',
        price: '9.90',
        itemId: 'BAZI-PRO'
      },
      ultimate: {
        name: 'Soul Guide - Ultimate Reading',
        price: '29.90',
        itemId: 'BAZI-ULTIMATE'
      }
    },
    returnUrl: 'https://mybazidestiny.com/success.html',
    cancelUrl: 'https://mybazidestiny.com/?payment=cancel'
  };

  // Track selected tier (default to pro)
  let selectedTier = 'pro';

  function startCheckout(tier) {
    // Use provided tier or default to selectedTier
    const checkoutTier = tier || selectedTier;
    const product = PAYPAL_CONFIG.products[checkoutTier];

    // Save current reading to localStorage so we can restore after payment
    if (currentData) {
      localStorage.setItem('pendingReading', JSON.stringify(currentData));
      localStorage.setItem('pendingTier', checkoutTier);
    }

    // Build PayPal checkout URL
    const paypalUrl = new URL('https://www.paypal.com/cgi-bin/webscr');
    paypalUrl.searchParams.set('cmd', '_xclick');
    paypalUrl.searchParams.set('business', PAYPAL_CONFIG.businessEmail);
    paypalUrl.searchParams.set('item_name', product.name);
    paypalUrl.searchParams.set('amount', product.price);
    paypalUrl.searchParams.set('currency_code', PAYPAL_CONFIG.currency);
    paypalUrl.searchParams.set('item_number', product.itemId);
    paypalUrl.searchParams.set('return', PAYPAL_CONFIG.returnUrl);
    paypalUrl.searchParams.set('cancel_return', PAYPAL_CONFIG.cancelUrl);
    paypalUrl.searchParams.set('custom', checkoutTier);

    // Redirect to PayPal checkout
    window.location.href = paypalUrl.toString();
  }

  function setCheckoutTier(tier) {
    selectedTier = tier;
  }

  function checkPaymentSuccess() {
    // Check URL params for success indicator
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment') === 'success';
    const orderId = urlParams.get('order_id');

    if (paymentSuccess || localStorage.getItem('proUnlocked')) {
      // Restore pending reading if exists
      const pending = localStorage.getItem('pendingReading');
      if (pending) {
        currentData = JSON.parse(pending);
        localStorage.removeItem('pendingReading');
      }

      // Unlock pro content
      isProUnlocked = true;
      localStorage.setItem('proUnlocked', 'true');
      unlockPro();

      // Clean URL
      if (paymentSuccess) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      return true;
    }
    return false;
  }

  function unlockPro() {
    isProUnlocked = true;
    // Show pro cards with stagger animation
    const proIds = ['cardCareer','cardRelationships','cardHealth','cardLuckyPro','cardFengShui'];
    proIds.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = '';
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 150);
      }
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
    { stem: 'Yang Wood', branch: 'Rat',    elem: 'Wood'   },
    { stem: 'Yin Wood',  branch: 'Ox',     elem: 'Wood'   },
    { stem: 'Yang Fire', branch: 'Tiger',  elem: 'Fire'   },
    { stem: 'Yin Fire',  branch: 'Rabbit', elem: 'Fire'   },
    { stem: 'Yang Earth',branch: 'Dragon', elem: 'Earth'  },
    { stem: 'Yin Earth', branch: 'Snake',  elem: 'Earth'  },
    { stem: 'Yang Metal',branch: 'Horse',  elem: 'Metal'  },
    { stem: 'Yin Metal', branch: 'Goat',   elem: 'Metal'  },
    { stem: 'Yang Water',branch: 'Monkey', elem: 'Water'  },
    { stem: 'Yin Water', branch: 'Rooster',elem: 'Water'  },
    { stem: 'Yang Wood', branch: 'Dog',    elem: 'Wood'   },
    { stem: 'Yin Wood',  branch: 'Pig',   elem: 'Wood'   },
  ];

  function animateDemo() {
    // Guard: only animate if demo pillar elements exist in the DOM
    if (!document.getElementById('demoStem1')) return;
    const now = new Date();
    const idx = Math.floor(now.getSeconds() / 5) % DEMO_PILLARS.length;
    const p  = DEMO_PILLARS[idx];
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
    // Check for payment success on page load
    checkPaymentSuccess();

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

    // Share button
    const shareBtn = document.getElementById('shareBtn');
    const twitterShare = document.getElementById('twitterShare');
    const facebookShare = document.getElementById('facebookShare');
    const whatsappShare = document.getElementById('whatsappShare');

    const getShareText = () => {
      const elem = window.currentReading ? window.currentReading.elements.dominant : 'Balanced';
      const name = window.currentReading ? (window.currentReading.name || 'My') : 'My';
      return `${name} BaZi Destiny Reading — Dominant Element: ${elem}. Discover yours free:`;
    };

    const updateSocialLinks = () => {
      const text = encodeURIComponent(getShareText());
      const url = encodeURIComponent('https://mybazidestiny.com');
      if (twitterShare) twitterShare.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      if (facebookShare) facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      if (whatsappShare) whatsappShare.href = `https://wa.me/?text=${text}%20${url}`;
    };

    if (shareBtn) {
      shareBtn.addEventListener('click', function() {
        const text = getShareText() + ' https://mybazidestiny.com';
        if (navigator.share) {
          navigator.share({ title: 'BaZi Destiny Reading', text });
        } else {
          navigator.clipboard.writeText(text).then(() => {
            shareBtn.textContent = '✓ Copied!';
            setTimeout(() => { shareBtn.textContent = 'Share Reading'; }, 2500);
          });
        }
      });
    }
    updateSocialLinks();

    // PDF download button
    const pdfBtn = document.getElementById('pdfBtn');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', function() {
        if (!window.currentReading) return;
        if (localStorage.getItem('proUnlocked') === 'true') {
          // Pro user — trigger PDF generation
          if (typeof generatePDF === 'function') generatePDF();
          else window.print();
        } else {
          // Free user — prompt upgrade
          showUpgrade('pro');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }



  // ============================================================
  // LOVE COMPATIBILITY
  // ============================================================

  function hideAllSections() {
    const sections = ['homeSection','how-it-works','pricing','calculator',
                       'resultsSection','compatSection'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    // Close mobile menu if open
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
    }
  }

  function showCompatibility() {
    hideAllSections();
    const compat = document.getElementById('compatSection');
    compat.style.display = 'flex';
    document.getElementById('compatResults').style.display = 'none';
    document.getElementById('compatSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function runCompatibility() {
    console.log('[DEBUG] runCompatibility called');
    console.log('[DEBUG] BaZiEngine:', typeof BaZiEngine);
    console.log('[DEBUG] Compatibility:', typeof Compatibility);
    const name1 = document.getElementById('compatName1').value.trim();
    const date1 = document.getElementById('compatDate1').value;
    const hour1 = parseInt(document.getElementById('compatHour1').value);
    const name2 = document.getElementById('compatName2').value.trim();
    const date2 = document.getElementById('compatDate2').value;
    const hour2 = parseInt(document.getElementById('compatHour2').value);

    console.log('[DEBUG] name1:', name1, '| date1:', date1, '| hour1:', hour1);
    console.log('[DEBUG] name2:', name2, '| date2:', date2, '| hour2:', hour2);

    if (!name1 || !date1 || isNaN(hour1)) {
      alert('Please fill in all fields for Person 1.');
      return;
    }
    if (!name2 || !date2 || isNaN(hour2)) {
      alert('Please fill in all fields for Person 2.');
      return;
    }

    const d1 = date1.split('-');
    const d2 = date2.split('-');
    const year1 = parseInt(d1[0]), month1 = parseInt(d1[1]), day1 = parseInt(d1[2]);
    const year2 = parseInt(d2[0]), month2 = parseInt(d2[1]), day2 = parseInt(d2[2]);

    console.log('[DEBUG] data1 calc...');
    const data1 = BaZiEngine.calculateFourPillars(year1, month1, day1, hour1);
    const data2 = BaZiEngine.calculateFourPillars(year2, month2, day2, hour2);
    console.log('[DEBUG] data1:', data1, '| data2:', data2);

    const result = Compatibility.analyzeCompatibility(data1, data2);
    renderCompatibilityResult(result, name1, name2, data1, data2);

    document.getElementById('compatResults').style.display = '';
    document.getElementById('compatResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderCompatibilityResult(result, name1, name2, data1, data2) {
    const tier = result.tier;
    const scoreColor = tier.color;
    const stemColors = { Wood:'#5aad68', Fire:'#e85d4a', Earth:'#c49a6c', Metal:'#9e9e9e', Water:'#4a90c4' };

    // Score ring SVG
    const circ = 2 * Math.PI * 52;
    const dashOffset = circ * (1 - result.overall / 100);

    const pillarRows = (pillars, label) => {
      const stems = [pillars.year.stem, pillars.month.stem, pillars.day.stem, pillars.hour.stem];
      const branches = [pillars.year.branch, pillars.month.branch, pillars.day.branch, pillars.hour.branch];
      const elems = [pillars.year.element, pillars.month.element, pillars.day.element, pillars.hour.element];
      const STEM_TO_EN_FULL = {
        甲:'Yang Wood', 乙:'Yin Wood', 丙:'Yang Fire', 丁:'Yin Fire',
        戊:'Yang Earth', 己:'Yin Earth', 庚:'Yang Metal', 辛:'Yin Metal',
        壬:'Yang Water', 癸:'Yin Water'
      };
      const BRANCH_TO_EN = {
        子:'Rat', 丑:'Ox', 寅:'Tiger', 卯:'Rabbit', 辰:'Dragon', 巳:'Snake',
        午:'Horse', 未:'Goat', 申:'Monkey', 酉:'Rooster', 戌:'Dog', 亥:'Pig'
      };
      const ELEM_CN = { 木:'Wood', 火:'Fire', 土:'Earth', 金:'Metal', 水:'Water' };
      const labels = ['Year', 'Month', 'Day', 'Hour'];
      return labels.map((lbl, i) => `
        <div class="cp-mini-card">
          <div class="cp-mini-left">
            <span class="cp-mini-pillar">${lbl}</span>
            <span class="cp-mini-stem">${STEM_TO_EN_FULL[stems[i]]}</span>
            <span class="cp-mini-elem">${ELEM_CN[elems[i]]} · ${BRANCH_TO_EN[branches[i]]}</span>
          </div>
        </div>
      `).join('');
    };

    const elemBar = (counts, dominant) => {
      const elems = ['木','火','土','金','水'];
      const names = ['Wood','Fire','Earth','Metal','Water'];
      const colors = ['#5aad68','#e85d4a','#c49a6c','#9e9e9e','#4a90c4'];
      const max = Math.max(...Object.values(counts));
      return elems.map((e, i) => {
        const w = max > 0 ? Math.round((counts[e] / max) * 100) : 0;
        const isDom = e === dominant;
        return `<div class="elem-bar-row">
          <span class="elem-bar-label">${names[i]}</span>
          <div class="elem-bar-track">
            <div class="elem-bar-fill" style="width:${w}%;background:${isDom ? '#d4a574' : colors[i]}"></div>
          </div>
          <span class="elem-bar-count">${counts[e]}</span>
        </div>`;
      }).join('');
    };

    const html = `
      <!-- Score Hero -->
      <div class="compat-score-hero">
        <div class="compat-score-ring">
          <svg viewBox="0 0 120 120">
            <circle class="ring-bg" cx="60" cy="60" r="52"/>
            <circle class="ring-fill" cx="60" cy="60" r="52"
              stroke="${scoreColor}"
              stroke-dasharray="${circ.toFixed(1)}"
              stroke-dashoffset="${dashOffset.toFixed(1)}"
              style="filter: drop-shadow(0 0 6px ${scoreColor})"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
            <div style="font-size:32px;font-weight:700;color:${scoreColor};line-height:1">${result.overall}</div>
            <div style="font-size:10px;color:var(--text-tertiary);letter-spacing:0.05em">out of 100</div>
          </div>
        </div>
        <div class="compat-score-label" style="color:${scoreColor}">${tier.label}</div>
        <div class="compat-pair-names">${name1} & ${name2}</div>
        <div class="compat-today-tip">"${result.dayPillar.title}"</div>
      </div>

      <!-- Three score cards -->
      <div class="compat-grid-3">
        <div class="compat-card">
          <div class="compat-card-label">Day Pillar Harmony</div>
          <div class="compat-card-value" style="color:${scoreColor}">${result.dayPillar.score}/100</div>
          <div class="compat-card-desc">${result.dayPillar.desc}</div>
        </div>
        <div class="compat-card">
          <div class="compat-card-label">Polarity Connection</div>
          <div class="compat-card-value" style="color:${scoreColor}">${result.polarity.score}/100</div>
          <div class="compat-card-desc">${result.polarity.desc}</div>
        </div>
        <div class="compat-card">
          <div class="compat-card-label">Elemental Balance</div>
          <div class="compat-card-value" style="color:${scoreColor}">${result.element.score}/100</div>
          <div class="compat-card-desc">${result.element.elem1Name} & ${result.element.elem2Name}</div>
        </div>
      </div>

      <!-- Day Pillar deep dive -->
      <div class="compat-dp-section">
        <div class="compat-dp-header">
          <div class="compat-dp-title">Day Pillar Analysis — The Core Bond</div>
          <div class="compat-dp-relation">The Day Pillar represents your core self and romantic identity</div>
        </div>
        <div class="compat-dp-pillars">
          <div class="compat-pillar-mini">
            <span style="font-size:11px;color:var(--text-tertiary);letter-spacing:0.1em;text-transform:uppercase">${name1} Day Pillar</span>
            <span class="cpm-stem">${result.dayPillar.p1.stemName}</span>
            <span class="cpm-branch">${result.dayPillar.p1.branchName}</span>
            <span class="cpm-elem" style="background:${stemColors[result.dayPillar.p1.elementName]}22;color:${stemColors[result.dayPillar.p1.elementName]}">${result.dayPillar.p1.elementName}</span>
          </div>
          <div class="cpm-vs">×</div>
          <div class="compat-pillar-mini">
            <span style="font-size:11px;color:var(--text-tertiary);letter-spacing:0.1em;text-transform:uppercase">${name2} Day Pillar</span>
            <span class="cpm-stem">${result.dayPillar.p2.stemName}</span>
            <span class="cpm-branch">${result.dayPillar.p2.branchName}</span>
            <span class="cpm-elem" style="background:${stemColors[result.dayPillar.p2.elementName]}22;color:${stemColors[result.dayPillar.p2.elementName]}">${result.dayPillar.p2.elementName}</span>
          </div>
        </div>
      </div>

      <!-- Harmony analysis -->
      <div class="compat-harmony-card">
        <div class="compat-harmony-title">💫 Elemental Harmony</div>
        <div class="compat-harmony-desc">${result.element.harmonyDesc}</div>
        <div class="compat-harmony-badges">
          ${result.strengths.map(s => `<span class="hbadge habadge-good">✓ ${s}</span>`).join('')}
          ${result.challenges.map(c => `<span class="hbadge habadge-challenge">⚠ ${c}</span>`).join('')}
        </div>
      </div>

      <!-- Both full pillar charts -->
      <div class="compat-pillars-compare">
        <div class="compat-pillars-compare-title">Full Four Pillar Comparison</div>
        <div class="compat-pillars-row">
          <div>
            <div class="cp-col-title">${name1}</div>
            <div class="cp-mini-grid">
              ${pillarRows(data1.pillars, name1)}
              <div style="margin-top:8px">
                <div class="compat-card-label" style="text-align:left;margin-bottom:8px">Element Distribution</div>
                ${elemBar(data1.elements.counts, data1.elements.dominant)}
              </div>
            </div>
          </div>
          <div>
            <div class="cp-col-title">${name2}</div>
            <div class="cp-mini-grid">
              ${pillarRows(data2.pillars, name2)}
              <div style="margin-top:8px">
                <div class="compat-card-label" style="text-align:left;margin-bottom:8px">Element Distribution</div>
                ${elemBar(data2.elements.counts, data2.elements.dominant)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="compat-tips-card">
        <div class="compat-tips-title">🌿 Your Relationship Guidance</div>
        ${result.tips.map(tip => `
          <div class="compat-tip-item">
            <span class="compat-tip-icon">✦</span>
            <span class="compat-tip-text">${tip}</span>
          </div>
        `).join('')}
      </div>

      <!-- Share -->
      <div class="compat-share-row">
        <p>Share your BaZi Love Match with friends! 💕</p>
        <button class="btn-primary" onclick="compatShare('${name1}', '${name2}', ${result.overall}, '${tier.label}')">
          🔮 Share Our Match
        </button>
      </div>
    `;

    document.getElementById('compatResults').innerHTML = html;
  }

  function compatShare(name1, name2, score, label) {
    const text = `💕 Our BaZi Love Match: ${name1} & ${name2}

Compatibility Score: ${score}/100 — "${label}"

Discover yours free at: https://mybazidestiny.com`;
    if (navigator.share) {
      navigator.share({ title: 'BaZi Love Match', text });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        showToast('✨ Love match copied! Share it with your partner 💕');
      });
    }
  }


  // Expose
  window.showHome = showHome;
  window.showCalculator = showCalculator;
  window.scrollToSection = scrollToSection;
  window.toggleMobileMenu = toggleMobileMenu;
  window.calculateBaZi = calculateBaZi;
  window.showUpgrade = showUpgrade;
  window.closePaymentModal = closePaymentModal;
  window.startCheckout = startCheckout;
  window.showCompatibility = showCompatibility;
  window.runCompatibility = runCompatibility;

})();
