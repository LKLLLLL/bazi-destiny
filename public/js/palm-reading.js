(function () {
  "use strict";

  var root = document.querySelector("[data-palm-app]");
  if (!root) return;

  var lang = root.dataset.lang === "zh" ? "zh" : "en";
  var state = { gender: "male", hand: "left", file: null, image: null, metrics: null, ready: false };
  var els = {
    genderButtons: root.querySelectorAll("[data-gender]"),
    fixedHand: root.querySelector("[data-fixed-hand]"),
    tradition: root.querySelector("[data-tradition-note]"),
    input: root.querySelector("[data-photo-input]"),
    drop: root.querySelector("[data-drop-area]"),
    empty: root.querySelector("[data-upload-empty]"),
    previewWrap: root.querySelector("[data-preview-wrap]"),
    preview: root.querySelector("[data-preview]"),
    choose: root.querySelector("[data-choose-photo]"),
    replace: root.querySelector("[data-replace-photo]"),
    consent: root.querySelector("[data-consent]"),
    analyze: root.querySelector("[data-analyze]"),
    quality: root.querySelector("[data-quality-list]"),
    qualityMessage: root.querySelector("[data-quality-message]"),
    setupPanel: root.querySelector("[data-setup-panel]"),
    progressPanel: root.querySelector("[data-progress-panel]"),
    resultPanel: root.querySelector("[data-result-panel]"),
    resultBody: root.querySelector("[data-result-body]"),
    download: root.querySelector("[data-download]"),
    steps: root.querySelectorAll("[data-step]")
  };

  var copy = {
    en: {
      traditionMale: "The fixed traditional convention reads the <strong>left hand for men</strong>.",
      traditionFemale: "The fixed traditional convention reads the <strong>right hand for women</strong>.",
      noFile: "Choose a JPG, PNG, HEIC or WebP image.",
      tooLarge: "This image is over 20 MB. Please choose a smaller photo.",
      cannotRead: "We could not read this image. Try a JPG, PNG or WebP file.",
      qualityGood: "Photo quality is suitable for a traditional reading.",
      qualityWarn: "This photo can still be analyzed. More light and a closer view may improve the reference.",
      qualityLabels: ["Resolution", "Lighting", "Line clarity"],
      waiting: "Quality checks appear after you choose a photo.",
      analyzing: "Reading visible palm structure...",
      resultEyebrow: "Traditional palm reading",
      resultTitle: "Your {hand} palm profile",
      resultIntro: "Your visible line contrast, continuity and palm structure point to a clear traditional palmistry pattern.",
      left: "left",
      right: "right",
      scores: ["Inner drive", "Clarity", "Relationships", "Career rhythm"],
      scoreChartTitle: "Four-dimension profile",
      lineNames: ["Life line", "Head line", "Heart line", "Fate line", "Sun line", "Palm mounts"],
      lineTagVariants: [
        ["Restorative", "Steady", "Vital"],
        ["Reflective", "Balanced", "Decisive"],
        ["Reserved", "Measured", "Open"],
        ["Exploring", "Developing", "Directed"],
        ["Private", "Craft-led", "Expressive"],
        ["Adaptive", "Balanced", "Firm"]
      ],
      lineVariants: [
        [
          "The life-line arc appears lighter or less continuous in this photo, a traditional prompt to protect your energy and use shorter, repeatable routines. Line length is not a lifespan measure.",
          "The life-line arc reads as a steady reserve pattern. Sustainable effort and regular recovery are likely to serve you better than dramatic bursts. Line length is not a lifespan measure.",
          "The life-line arc is one of the more defined structures in this photo. Traditional palmistry associates that visual emphasis with strong momentum; pacing still matters more than intensity."
        ],
        [
          "The head-line signal is soft in the captured image. Externalize decisions in writing, define the next action, and revisit complex choices after the picture is clearer.",
          "The head-line pattern looks balanced between texture and continuity. You may work best when practical steps leave room for intuition and revision.",
          "The head-line structure is visually pronounced. Traditional readings associate this with a decisive, focused style; leave a deliberate pause before locking in a plan."
        ],
        [
          "The upper-palm signal is quieter here, suggesting a private way of processing trust. Name expectations early so silence does not do the communicating for you.",
          "The upper-palm pattern suggests measured warmth and selective trust. Direct, specific communication can keep close relationships easy to navigate.",
          "The upper-palm pattern carries strong visible contrast. Traditional readings connect that emphasis with open feeling; pair generosity with clear boundaries."
        ],
        [
          "The vertical direction signal is faint in this frame. Treat the next season as an experiment: choose one practical route and review it after real experience.",
          "The central vertical structure develops gradually. A direction can become clearer through consistent practice rather than one irreversible decision.",
          "The vertical structure is one of the clearer signals in this photo. Use that sense of direction to commit to one or two durable priorities instead of scattering effort."
        ],
        [
          "Fine detail below the ring finger is limited in this image. Let finished work, not immediate recognition, be the measure of creative progress.",
          "The visible detail below the ring finger suggests recognition that grows through consistent craft and useful expression.",
          "The ring-finger zone shows stronger visible detail. Traditional palmistry reads this as expressive potential; give it a public form through a project or practice."
        ],
        [
          "The palm texture is uneven across the frame, so keep commitments simple and leave room to adapt as new information arrives.",
          "The overall palm balance looks adaptable: deliberate when committing, flexible when carrying the plan out.",
          "The palm structure reads as firm and well-defined in this image. Use that steadiness to hold a boundary while keeping execution practical."
        ]
      ],
      phaseVariants: [
        { title: "Current phase: restore your base", text: "The quieter signals in this photo favor a smaller operating rhythm. Protect attention, finish one useful task at a time, and let consistency rebuild momentum." },
        { title: "Current phase: simplify and decide", text: "The clearest pattern is in the thinking and structure zones. Reduce competing options, write down the next move, and review the result before adding more." },
        { title: "Current phase: communicate with clarity", text: "The strongest emphasis sits around the upper-palm pattern. Say what you need plainly, keep boundaries visible, and let steady contact prove what matters." },
        { title: "Current phase: commit to a direction", text: "The vertical structure carries the strongest signal. Choose one or two durable priorities, test them in real work, and adjust from evidence rather than prediction." }
      ],
      verdictVariants: [
        { title: "Your momentum is the main force", text: "This palm is built to move through action. You recover direction by doing, not by waiting for certainty, and your best outcomes come when effort is concentrated on one durable goal.", action: "Choose the one commitment that deserves your full energy and give it a fixed weekly rhythm.", maxim: "Your path opens when strength becomes consistency." },
        { title: "Clarity is your decisive advantage", text: "This palm is led by judgment and mental structure. You are at your best when you reduce noise, name the real problem, and make a clean decision before others are ready.", action: "Write down the next decision, the evidence that matters, and the deadline for acting on it.", maxim: "Your path opens when thought becomes a decision." },
        { title: "Relationships are shaping the next chapter", text: "This palm is led by the upper-palm pattern: trust, boundaries, and communication now influence the rest of your fortune more than isolated effort does.", action: "Have the direct conversation you have been postponing and make expectations visible.", maxim: "Your path opens when feeling becomes clear language." },
        { title: "Direction is becoming destiny", text: "This palm is led by its vertical structure. The next chapter rewards commitment, responsibility, and the willingness to stay with one path long enough for it to compound.", action: "Select one long-term priority and remove the competing obligation that weakens it.", maxim: "Your path opens when direction becomes devotion." }
      ],
      signalIntro: "Visible pattern: {clarity} line contrast, {texture} palm texture, and {balance} visual balance.",
      signalClarity: ["soft", "moderate", "defined"],
      signalTexture: ["quiet", "mixed", "pronounced"],
      signalBalance: ["uneven", "fairly even", "strong"],
      downloadTitle: "My BaZi Destiny - Palm Reading",
      handLabel: "Selected hand",
      generated: "Generated locally in your browser"
    },
    zh: {
      traditionMale: "按固定传统规则，男性分析<strong>左手</strong>。",
      traditionFemale: "按固定传统规则，女性分析<strong>右手</strong>。",
      noFile: "请选择 JPG、PNG、HEIC 或 WebP 图片。",
      tooLarge: "图片超过 20 MB，请选择更小的照片。",
      cannotRead: "无法读取这张图片，请换用 JPG、PNG 或 WebP 文件。",
      qualityGood: "照片质量适合进行传统手相参考分析。",
      qualityWarn: "这张照片仍可继续分析；如果方便，增加光线或靠近掌心可让参考更清楚。",
      qualityLabels: ["分辨率", "光线", "掌纹清晰度"],
      waiting: "选择照片后会显示质量检查结果。",
      analyzing: "正在读取可见掌纹结构……",
      resultEyebrow: "中国传统手相参考",
      resultTitle: "你的{hand}手掌画像",
      resultIntro: "照片中可见的线条对比度、连续性与掌面结构，已经形成一条清楚的传统手相主线。",
      left: "左",
      right: "右",
      scores: ["内在动力", "思路清晰", "情感互动", "事业节奏"],
      scoreChartTitle: "四维运势画像",
      lineNames: ["生命线", "智慧线", "感情线", "事业线", "太阳线", "掌丘与掌形"],
      lineTagVariants: [
        ["蓄养", "稳健", "有力"],
        ["沉思", "均衡", "果断"],
        ["内敛", "有分寸", "开放"],
        ["探索", "渐明", "定向"],
        ["低调", "重积累", "善表达"],
        ["善调整", "均衡", "坚定"]
      ],
      lineVariants: [
        [
          "照片中的生命线弧度较淡或不够连续，传统上可作为节奏偏慢的提示：把精力分配给短而稳定的行动。生命线长短不代表寿命。",
          "照片中的生命线弧度较连贯，传统上多解读为重视稳定节奏、善于保存精力。持续恢复比突然用力更重要。",
          "照片中的生命线是较清楚的结构之一，传统上多解读为行动动力较强；仍应把握节奏，不以强度代替持续。"
        ],
        [
          "智慧线在这张照片里偏柔和。把决定写下来、拆出下一步，并在信息更完整后复盘，会比凭感觉硬撑更有帮助。",
          "智慧线的纹理与连续性较均衡，适合让务实判断和直觉并用，并为计划保留修正空间。",
          "智慧线的可见结构较突出，传统上常解读为专注、决断；在落定之前刻意留一个停顿，会让选择更稳。"
        ],
        [
          "上掌区的可见信号较安静，关系中可能更习惯先观察再信任。尽早说清期待，能减少沉默带来的误会。",
          "上掌纹理显示温和而有分寸的互动方式。直接、具体地表达，通常能让亲近关系保持轻松。",
          "上掌区的对比度较强，传统上多解读为情感表达更直接；在热情之外保留清晰边界，会更有安全感。"
        ],
        [
          "照片里的纵向方向感较弱，可把近期视为试行期：先选一条可执行的路径，用实际体验代替一次性定论。",
          "纵向结构向掌心中段逐渐清楚，传统上常解读为方向感会随经验增加，不必急于一次定终身。",
          "纵向结构是照片里较清楚的信号之一，适合守住一至两个长期目标，减少精力分散。"
        ],
        [
          "无名指下方的细节在这张照片里有限，先让完成的作品成为反馈，不必把即时认可当成进展标准。",
          "无名指下方的可见细节更接近靠持续作品累积认可的模式，表达与创造需要稳定练习。",
          "无名指下方的纹理较突出，传统上常与表达潜力联系在一起；把它落到一个公开、可完成的项目里。"
        ],
        [
          "掌面纹理在不同区域间差异较大，承诺可以简单一些，执行中为新信息留下调整空间。",
          "掌面整体在厚实感与纹理变化之间较均衡，适合承诺时审慎、执行中保持弹性。",
          "掌形与纹理在照片里较清楚，传统上可读作定力较足；守住边界，同时让行动保持务实。"
        ]
      ],
      phaseVariants: [
        { title: "近期主题：先恢复基础节奏", text: "照片里的信号偏安静，适合缩小运行半径：保护注意力，一次完成一件有用的事，用连续行动找回推进感。" },
        { title: "近期主题：简化选择，再行动", text: "思考与结构区的信号较清楚，先减少同时推进的选项，把下一步写下来，完成后再决定是否加码。" },
        { title: "近期主题：把话说清楚", text: "上掌区的视觉强调更明显，适合直接表达需要与边界，让稳定的联系代替猜测。" },
        { title: "近期主题：确定一条方向", text: "纵向结构的信号更突出，可守住一至两个长期目标，以真实行动和反馈调整方向，而不是交给预测。" }
      ],
      verdictVariants: [
        { title: "你的主运在行动力", text: "这只手掌的核心力量是推进。你不是靠等待确定性找到方向的人，而是在行动中把局面做清楚；力量集中到一个长期目标时，运势最容易打开。", action: "选出当前最值得投入的一件事，为它建立固定的每周节奏。", maxim: "力气变成持续，路自然会开。" },
        { title: "你的关键优势是判断力", text: "这只手掌由思考与结构感主导。真正适合你的不是同时保留所有可能，而是减少噪音、抓住关键，并在别人还犹豫时做出清楚决定。", action: "把下一项决定、真正重要的证据和行动期限写下来。", maxim: "想法落成决定，运才开始转。" },
        { title: "关系正在决定下一阶段", text: "上掌区是这只手最有分量的部分。近期的信任、边界和表达，会比一个人硬撑更直接地影响事业与生活节奏。", action: "完成那场一直拖延的直接沟通，把双方期待说清楚。", maxim: "情意说得清楚，关系才能带来助力。" },
        { title: "方向正在沉淀成命运", text: "这只手掌由纵向结构主导。下一阶段真正有利的是承诺、责任和长期积累；守住一条路，比不断寻找新答案更重要。", action: "确定一个长期目标，同时删掉那个持续分散精力的次要承诺。", maxim: "方向守得住，时间就会替你加力。" }
      ],
      signalIntro: "可见结构：掌纹对比度{clarity}，掌面纹理{texture}，左右视觉平衡{balance}。",
      signalClarity: ["偏柔和", "中等", "较清楚"],
      signalTexture: ["较安静", "有变化", "较突出"],
      signalBalance: ["偏弱", "中等", "较强"],
      downloadTitle: "MyBaZiDestiny 手相参考解读",
      handLabel: "所选手掌",
      generated: "在你的浏览器中本地生成"
    }
  }[lang];

  function iconRefresh() {
    if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
  }

  function setChoice(buttons, key, value) {
    state[key] = value;
    buttons.forEach(function (button) {
      var selected = button.dataset[key] === value;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function updateTradition() {
    var recommendation = state.gender === "female" ? "right" : "left";
    state.hand = recommendation;
    els.fixedHand.textContent = lang === "zh" ? (recommendation === "left" ? "左手" : "右手") : (recommendation === "left" ? "Left palm" : "Right palm");
    els.tradition.innerHTML = state.gender === "male" ? copy.traditionMale : copy.traditionFemale;
  }

  function updateAnalyzeButton() {
    els.analyze.disabled = !(state.ready && els.consent.checked);
  }

  function setStep(active) {
    els.steps.forEach(function (step) {
      var num = Number(step.dataset.step);
      step.classList.toggle("is-active", num === active);
      step.classList.toggle("is-done", num < active);
    });
  }

  function qualityItem(label, good) {
    return '<div class="quality-item ' + (good ? "is-good" : "is-warn") + '"><i data-lucide="' + (good ? "circle-check" : "triangle-alert") + '"></i><span>' + label + "</span></div>";
  }

  function computeMetrics(image) {
    var canvas = document.createElement("canvas");
    var size = 320;
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, size, size);
    var scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
    var width = image.naturalWidth * scale;
    var height = image.naturalHeight * scale;
    ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
    var pixels = ctx.getImageData(0, 0, size, size).data;
    var pixelCount = size * size;
    var gray = new Float32Array(pixelCount);
    var skin = new Uint8Array(pixelCount);
    var sum = 0;
    var sumSq = 0;
    var dark = 0;
    var skinCount = 0;
    var skinSum = 0;
    var skinSumSq = 0;
    var skinWarmth = 0;
    var minX = size;
    var minY = size;
    var maxX = 0;
    var maxY = 0;
    var i;
    for (i = 0; i < gray.length; i += 1) {
      var p = i * 4;
      var red = pixels[p];
      var green = pixels[p + 1];
      var blue = pixels[p + 2];
      var value = red * 0.299 + green * 0.587 + blue * 0.114;
      gray[i] = value;
      sum += value;
      sumSq += value * value;
      if (value < 105) dark += 1;
      var x = i % size;
      var y = Math.floor(i / size);
      var warm = red - blue;
      var isSkin = red > 45 && green > 24 && blue > 12 && warm > 12 && red >= green * 0.94 && green >= blue * 0.78 && Math.max(red, green, blue) - Math.min(red, green, blue) > 8;
      if (isSkin) {
        skin[i] = 1;
        skinCount += 1;
        skinSum += value;
        skinSumSq += value * value;
        skinWarmth += warm;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    var mean = sum / gray.length;
    var contrast = Math.sqrt(Math.max(0, sumSq / gray.length - mean * mean));
    var useSkin = skinCount >= pixelCount * 0.06 && skinCount <= pixelCount * 0.88;
    var analysisMean = useSkin ? skinSum / Math.max(1, skinCount) : mean;
    var analysisSq = useSkin ? skinSumSq / Math.max(1, skinCount) : sumSq / gray.length;
    var texture = Math.sqrt(Math.max(0, analysisSq - analysisMean * analysisMean));
    var coverage = useSkin ? skinCount / pixelCount : width * height / pixelCount;
    var palmWidth = useSkin ? Math.max(1, maxX - minX + 1) : size;
    var palmHeight = useSkin ? Math.max(1, maxY - minY + 1) : size;
    var aspect = palmWidth / palmHeight;
    var edgeTotal = 0;
    var edgeCount = 0;
    var lineTotal = 0;
    var linePixels = 0;
    var verticalSignal = 0;
    var leftSignal = 0;
    var rightSignal = 0;
    var zoneEdges = [0, 0, 0, 0];
    var zoneLines = [0, 0, 0, 0];
    var zoneCounts = [0, 0, 0, 0];
    var maskLeft = 0;
    var maskRight = 0;
    for (var y = 1; y < size - 1; y += 2) {
      for (var x = 1; x < size - 1; x += 2) {
        var idx = y * size + x;
        var inMask = !useSkin || skin[idx];
        if (!inMask) continue;
        var relativeX = useSkin ? (x - minX) / palmWidth : x / size;
        var relativeY = useSkin ? (y - minY) / palmHeight : y / size;
        if (relativeX < 0.5) maskLeft += 1;
        else maskRight += 1;
        var gx = -gray[idx - size - 1] - 2 * gray[idx - 1] - gray[idx + size - 1] + gray[idx - size + 1] + 2 * gray[idx + 1] + gray[idx + size + 1];
        var gy = -gray[idx - size - 1] - 2 * gray[idx - size] - gray[idx - size + 1] + gray[idx + size - 1] + 2 * gray[idx + size] + gray[idx + size + 1];
        var magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy));
        var darkness = Math.max(0, (analysisMean - gray[idx]) / (texture + 12));
        var lineSignal = magnitude * (0.45 + Math.min(1.5, darkness));
        edgeTotal += magnitude;
        lineTotal += lineSignal;
        if (magnitude > 24 && darkness > 0.08) linePixels += 1;
        if (relativeX > 0.4 && relativeX < 0.6) verticalSignal += lineSignal;
        if (relativeX < 0.5) leftSignal += lineSignal;
        else rightSignal += lineSignal;
        edgeCount += 1;
        var zone = relativeY < 0.42 ? 0 : relativeY < 0.6 ? 1 : relativeX < 0.5 ? 2 : 3;
        zoneEdges[zone] += magnitude;
        zoneLines[zone] += lineSignal;
        zoneCounts[zone] += 1;
      }
    }
    var edgeScale = Math.max(1, edgeCount);
    var lineScale = Math.max(1, edgeCount);
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      brightness: mean,
      contrast: contrast,
      edge: edgeTotal / edgeScale,
      darkRatio: dark / gray.length,
      texture: texture,
      skinCoverage: coverage,
      palmAspect: aspect,
      warmth: useSkin ? skinWarmth / Math.max(1, skinCount) : 0,
      lineSignal: lineTotal / lineScale,
      lineDensity: linePixels / lineScale,
      verticalSignal: verticalSignal / lineScale,
      balance: 1 - Math.abs(leftSignal - rightSignal) / Math.max(1, leftSignal + rightSignal),
      maskBalance: 1 - Math.abs(maskLeft - maskRight) / Math.max(1, maskLeft + maskRight),
      zones: zoneEdges.map(function (value, index) { return value / Math.max(1, zoneCounts[index]); }),
      lineZones: zoneLines.map(function (value, index) { return value / Math.max(1, zoneCounts[index]); })
    };
  }

  function assessQuality(metrics) {
    // Keep quality feedback helpful without blocking ordinary phone photos.
    var resolutionGood = Math.min(metrics.width, metrics.height) >= 320;
    var lightGood = metrics.brightness >= 35 && metrics.brightness <= 240 && metrics.contrast >= 12;
    var clarityGood = metrics.edge >= 14;
    var qualityGood = resolutionGood && lightGood && clarityGood;
    state.ready = true;
    els.quality.innerHTML = qualityItem(copy.qualityLabels[0], resolutionGood) + qualityItem(copy.qualityLabels[1], lightGood) + qualityItem(copy.qualityLabels[2], clarityGood);
    els.qualityMessage.textContent = qualityGood ? copy.qualityGood : copy.qualityWarn;
    iconRefresh();
    updateAnalyzeButton();
  }

  function loadFile(file) {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      els.qualityMessage.textContent = copy.tooLarge;
      return;
    }
    var hasImageType = file.type && /^image\//.test(file.type);
    var hasImageExtension = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name || "");
    if (!hasImageType && !hasImageExtension) {
      els.qualityMessage.textContent = copy.noFile;
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var image = new Image();
      image.onload = function () {
        state.file = file;
        state.image = image;
        state.metrics = computeMetrics(image);
        els.preview.src = reader.result;
        els.preview.alt = lang === "zh" ? "待分析的手掌照片预览" : "Palm photo ready for analysis";
        els.empty.hidden = true;
        els.previewWrap.hidden = false;
        setStep(2);
        assessQuality(state.metrics);
      };
      image.onerror = function () { els.qualityMessage.textContent = copy.cannotRead; };
      image.src = reader.result;
    };
    reader.onerror = function () { els.qualityMessage.textContent = copy.cannotRead; };
    reader.readAsDataURL(file);
  }

  function normalize(value, low, high) {
    return Math.max(0, Math.min(1, (value - low) / (high - low)));
  }

  function getScores(metrics) {
    var edge = normalize(metrics.edge, 4, 48);
    var contrast = normalize(metrics.contrast, 8, 64);
    var texture = normalize(metrics.texture, 7, 56);
    var line = normalize(metrics.lineSignal, 3, 48);
    var density = normalize(metrics.lineDensity, 0.02, 0.22);
    var upper = normalize(metrics.lineZones[0], 2, 48);
    var middle = normalize(metrics.lineZones[1], 2, 48);
    var left = normalize(metrics.lineZones[2], 2, 48);
    var right = normalize(metrics.lineZones[3], 2, 48);
    var vertical = normalize(metrics.verticalSignal, 0.4, 13);
    var coverage = normalize(metrics.skinCoverage, 0.08, 0.72);
    var shape = normalize(metrics.palmAspect, 0.55, 1.45);
    var balance = Math.max(0, Math.min(1, (metrics.balance * 0.7 + metrics.maskBalance * 0.3)));
    var warmth = normalize(metrics.warmth, 12, 82);
    var clampScore = function (value) { return Math.round(42 + 48 * Math.max(0, Math.min(1, value))); };
    return [
      clampScore(coverage * 0.25 + line * 0.25 + left * 0.2 + warmth * 0.12 + edge * 0.1 + shape * 0.08),
      clampScore(upper * 0.34 + contrast * 0.25 + texture * 0.18 + density * 0.13 + shape * 0.1),
      clampScore(upper * 0.22 + middle * 0.2 + balance * 0.25 + warmth * 0.16 + contrast * 0.1 + texture * 0.07),
      clampScore(right * 0.3 + vertical * 0.22 + middle * 0.17 + coverage * 0.13 + line * 0.1 + balance * 0.08)
    ];
  }

  function scoreBand(score) {
    return score < 60 ? 0 : score < 75 ? 1 : 2;
  }

  function lineScores(scores) {
    return [scores[0], scores[1], scores[2], scores[3], Math.round(scores[1] * 0.55 + scores[2] * 0.45), Math.round(scores[0] * 0.45 + scores[3] * 0.55)];
  }

  function getPhase(scores) {
    var index = 0;
    scores.forEach(function (score, i) { if (score > scores[index]) index = i; });
    return copy.phaseVariants[index];
  }

  function getVerdict(scores) {
    var strongest = 0;
    var weakest = 0;
    scores.forEach(function (score, index) {
      if (score > scores[strongest]) strongest = index;
      if (score < scores[weakest]) weakest = index;
    });
    return { content: copy.verdictVariants[strongest], strongest: strongest, weakest: weakest };
  }

  function getSignalSummary(metrics) {
    var clarity = scoreBand(getScores(metrics)[1]);
    var texture = scoreBand(Math.round(normalize(metrics.texture, 7, 56) * 100));
    var balance = scoreBand(Math.round((metrics.balance * 0.6 + metrics.maskBalance * 0.4) * 100));
    return interpolateText(copy.signalIntro, {
      clarity: copy.signalClarity[clarity],
      texture: copy.signalTexture[texture],
      balance: copy.signalBalance[balance]
    });
  }

  function interpolateText(text, values) {
    return text.replace(/\{(\w+)\}/g, function (_, key) { return values[key] || ""; });
  }

  function radarPoint(cx, cy, radius, angle) {
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  }

  function renderRadar(scores) {
    var cx = 180;
    var cy = 142;
    var radius = 96;
    var angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
    var grid = [20, 40, 60, 80, 100].map(function (level) {
      var points = angles.map(function (angle) {
        var point = radarPoint(cx, cy, radius * level / 100, angle);
        return point.x.toFixed(1) + "," + point.y.toFixed(1);
      }).join(" ");
      return '<polygon class="radar-grid" points="' + points + '"></polygon>';
    }).join("");
    var axes = angles.map(function (angle) {
      var point = radarPoint(cx, cy, radius, angle);
      return '<line class="radar-axis" x1="' + cx + '" y1="' + cy + '" x2="' + point.x.toFixed(1) + '" y2="' + point.y.toFixed(1) + '"></line>';
    }).join("");
    var dataPoints = scores.map(function (score, index) {
      var point = radarPoint(cx, cy, radius * score / 100, angles[index]);
      return point.x.toFixed(1) + "," + point.y.toFixed(1);
    }).join(" ");
    var labels = copy.scores.map(function (label, index) {
      var point = radarPoint(cx, cy, radius + 25, angles[index]);
      var anchor = index === 1 ? "start" : index === 3 ? "end" : "middle";
      return '<text class="radar-label" x="' + point.x.toFixed(1) + '" y="' + point.y.toFixed(1) + '" text-anchor="' + anchor + '">' + label + '</text>';
    }).join("");
    var dots = scores.map(function (score, index) {
      var point = radarPoint(cx, cy, radius * score / 100, angles[index]);
      return '<circle class="radar-dot" cx="' + point.x.toFixed(1) + '" cy="' + point.y.toFixed(1) + '" r="4"></circle>';
    }).join("");
    var scoreCards = copy.scores.map(function (label, index) {
      return '<div class="result-score"><span>' + label + '</span><strong>' + scores[index] + '</strong><div class="score-track"><i style="width:' + scores[index] + '%"></i></div></div>';
    }).join("");
    return '<div class="score-overview"><div class="radar-chart"><div class="radar-title">' + copy.scoreChartTitle + '</div><svg viewBox="0 0 360 292" role="img" aria-label="' + copy.scoreChartTitle + '"><title>' + copy.scoreChartTitle + '</title>' + grid + axes + '<polygon class="radar-data" points="' + dataPoints + '"></polygon>' + dots + labels + '</svg></div><div class="result-score-grid">' + scoreCards + '</div></div>';
  }

  function renderResults() {
    var scores = getScores(state.metrics);
    var readingScores = lineScores(scores);
    var phase = getPhase(scores);
    var verdict = getVerdict(scores);
    var hand = state.hand === "left" ? copy.left : copy.right;
    var lineHtml = copy.lineNames.map(function (name, index) {
      var band = scoreBand(readingScores[index]);
      var variant = copy.lineVariants[index][band];
      return '<article class="reading-item"><div class="reading-item-top"><h3>' + name + '</h3><span class="reading-tag">' + copy.lineTagVariants[index][band] + '</span></div><p>' + variant + "</p></article>";
    }).join("");
    els.resultBody.innerHTML =
      '<div class="result-header"><div class="result-eyebrow">' + copy.resultEyebrow + '</div><h2>' + interpolateText(copy.resultTitle, { hand: hand }) + '</h2><p>' + copy.resultIntro + '</p><p class="signal-summary">' + getSignalSummary(state.metrics) + "</p></div>" +
      '<article class="palm-verdict"><span>' + (lang === "zh" ? "掌相主断" : "Core palm verdict") + '</span><h3>' + verdict.content.title + '</h3><p>' + verdict.content.text + '</p><div class="palm-verdict-basis"><strong>' + (lang === "zh" ? "最强维度" : "Strongest dimension") + ':</strong> ' + copy.scores[verdict.strongest] + ' ' + scores[verdict.strongest] + '/100 · <strong>' + (lang === "zh" ? "需要补足" : "Growth edge") + ':</strong> ' + copy.scores[verdict.weakest] + ' ' + scores[verdict.weakest] + '/100</div><p class="palm-verdict-action"><strong>' + (lang === "zh" ? "现在要做" : "What to do now") + ':</strong> ' + verdict.content.action + '</p><blockquote>“' + verdict.content.maxim + '”</blockquote></article>' +
      renderRadar(scores) +
      '<div class="reading-grid">' + lineHtml + "</div>" +
      '<div class="phase-reading"><h3>' + phase.title + "</h3><p>" + phase.text + "</p></div>";
    iconRefresh();
  }

  function runAnalysis() {
    if (!state.ready || !els.consent.checked) return;
    els.setupPanel.hidden = true;
    els.progressPanel.hidden = false;
    els.resultPanel.hidden = true;
    setStep(3);
    window.setTimeout(function () {
      renderResults();
      els.progressPanel.hidden = true;
      els.resultPanel.hidden = false;
      els.resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 900);
  }

  function downloadReading() {
    if (!state.metrics) return;
    var hand = state.hand === "left" ? copy.left : copy.right;
    var scores = getScores(state.metrics);
    var readingScores = lineScores(scores);
    var phase = getPhase(scores);
    var verdict = getVerdict(scores);
    var lines = [copy.downloadTitle, "", copy.handLabel + ": " + hand, copy.generated, ""];
    copy.scores.forEach(function (label, index) { lines.push(label + ": " + scores[index] + "/100"); });
    lines.push("", getSignalSummary(state.metrics), "", verdict.content.title, verdict.content.text, verdict.content.action, verdict.content.maxim, "", phase.title, phase.text, "");
    copy.lineNames.forEach(function (name, index) {
      var band = scoreBand(readingScores[index]);
      lines.push(name + " - " + copy.lineTagVariants[index][band], copy.lineVariants[index][band], "");
    });
    var blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = lang === "zh" ? "手相参考解读.txt" : "palm-reading.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  els.genderButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setChoice(els.genderButtons, "gender", button.dataset.gender);
      updateTradition();
    });
  });
  els.choose.addEventListener("click", function () { els.input.click(); });
  els.replace.addEventListener("click", function () { els.input.click(); });
  els.input.addEventListener("change", function () { loadFile(els.input.files[0]); });
  els.consent.addEventListener("change", updateAnalyzeButton);
  els.analyze.addEventListener("click", runAnalysis);
  els.download.addEventListener("click", downloadReading);
  ["dragenter", "dragover"].forEach(function (eventName) {
    els.drop.addEventListener(eventName, function (event) { event.preventDefault(); els.drop.classList.add("is-dragover"); });
  });
  ["dragleave", "drop"].forEach(function (eventName) {
    els.drop.addEventListener(eventName, function (event) { event.preventDefault(); els.drop.classList.remove("is-dragover"); });
  });
  els.drop.addEventListener("drop", function (event) { loadFile(event.dataTransfer.files[0]); });

  updateTradition();
  updateAnalyzeButton();
  iconRefresh();
})();
