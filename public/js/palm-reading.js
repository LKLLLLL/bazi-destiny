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
      resultIntro: "This reflective reading compares visible line contrast, continuity and palm structure with traditional Chinese palmistry patterns.",
      left: "left",
      right: "right",
      scores: ["Inner drive", "Clarity", "Relationships", "Career rhythm"],
      scoreChartTitle: "Four-dimension profile",
      lineNames: ["Life line", "Head line", "Heart line", "Fate line", "Sun line", "Palm mounts"],
      lineTags: ["Grounded", "Focused", "Warm", "Developing", "Expressive", "Balanced"],
      lineTexts: [
        "The visible arc suggests steady reserves and a preference for sustainable effort. In palmistry, line length is not a lifespan measure.",
        "The central line pattern points to practical judgment with room for intuition. You may do best when plans include a clear next action.",
        "The upper-palm pattern suggests selective trust and loyal attachment. Direct communication can keep expectations from accumulating silently.",
        "The vertical structure appears to strengthen toward the center, traditionally associated with direction becoming clearer through experience.",
        "Fine vertical detail below the ring finger is read as creative recognition that grows through consistent craft rather than quick attention.",
        "The overall balance between firmness and texture suggests an adaptable style: deliberate in commitments, flexible in execution."
      ],
      phaseTitle: "Current phase: consolidate before expanding",
      phaseText: "Traditional timing places the clearest central activity in a building phase. Favor one or two durable priorities, review financial decisions with evidence, and let relationships develop through consistency rather than prediction.",
      disclaimer: "For cultural interest and self-reflection only. Palmistry is not scientifically validated and this reading is not medical, legal, financial or mental-health advice.",
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
      resultIntro: "本次解读将照片中可见的线条对比度、连续性与掌面结构，与传统手相学的常见说法进行对照。",
      left: "左",
      right: "右",
      scores: ["内在动力", "思路清晰", "情感互动", "事业节奏"],
      scoreChartTitle: "四维运势画像",
      lineNames: ["生命线", "智慧线", "感情线", "事业线", "太阳线", "掌丘与掌形"],
      lineTags: ["稳健", "专注", "重情", "渐明", "表达", "均衡"],
      lineTexts: [
        "可见弧线偏连贯，传统上多解读为重视稳定节奏、善于保存精力。生命线长短不代表寿命。",
        "掌心中部线条呈现务实判断与直觉并用的倾向。把想法拆成清晰的下一步，通常更容易发挥优势。",
        "上掌纹理显示你在关系中较重承诺、信任建立偏审慎。适时直接表达，可避免期待在沉默中累积。",
        "纵向结构向掌心中段逐渐清楚，传统上常解读为方向感会随经验增加，不必急于一次定终身。",
        "无名指下方的细纵纹更接近“靠持续作品累积认可”的模式，表达与创造需要稳定练习。",
        "掌面整体在厚实感与纹理变化之间较均衡，适合承诺时审慎、执行中保持弹性。"
      ],
      phaseTitle: "近期主题：先整合，再扩张",
      phaseText: "传统流年分段会把掌心较清楚的活动区域视为积累期。可优先守住一至两个长期目标；财务决定以证据为准，关系发展以稳定行动为准，不以预测替代选择。",
      disclaimer: "仅供传统文化体验与自我反思。手相学未经科学验证，本结果不构成医疗、法律、金融或心理健康建议。",
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
    var gray = new Float32Array(size * size);
    var sum = 0;
    var sumSq = 0;
    var dark = 0;
    var i;
    for (i = 0; i < gray.length; i += 1) {
      var p = i * 4;
      var value = pixels[p] * 0.299 + pixels[p + 1] * 0.587 + pixels[p + 2] * 0.114;
      gray[i] = value;
      sum += value;
      sumSq += value * value;
      if (value < 105) dark += 1;
    }
    var mean = sum / gray.length;
    var contrast = Math.sqrt(Math.max(0, sumSq / gray.length - mean * mean));
    var edgeTotal = 0;
    var edgeCount = 0;
    var zoneEdges = [0, 0, 0, 0];
    var zoneCounts = [0, 0, 0, 0];
    for (var y = 1; y < size - 1; y += 2) {
      for (var x = 1; x < size - 1; x += 2) {
        var idx = y * size + x;
        var gx = -gray[idx - size - 1] - 2 * gray[idx - 1] - gray[idx + size - 1] + gray[idx - size + 1] + 2 * gray[idx + 1] + gray[idx + size + 1];
        var gy = -gray[idx - size - 1] - 2 * gray[idx - size] - gray[idx - size + 1] + gray[idx + size - 1] + 2 * gray[idx + size] + gray[idx + size + 1];
        var magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy));
        edgeTotal += magnitude;
        edgeCount += 1;
        var zone = y < size * 0.42 ? 0 : y < size * 0.6 ? 1 : x < size * 0.5 ? 2 : 3;
        zoneEdges[zone] += magnitude;
        zoneCounts[zone] += 1;
      }
    }
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      brightness: mean,
      contrast: contrast,
      edge: edgeTotal / edgeCount,
      darkRatio: dark / gray.length,
      zones: zoneEdges.map(function (value, index) { return value / Math.max(1, zoneCounts[index]); })
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
    var edge = normalize(metrics.edge, 34, 92);
    var contrast = normalize(metrics.contrast, 22, 78);
    var upper = normalize(metrics.zones[0], 30, 100);
    var middle = normalize(metrics.zones[1], 30, 100);
    var left = normalize(metrics.zones[2], 30, 100);
    var right = normalize(metrics.zones[3], 30, 100);
    return [
      Math.round(58 + 26 * (left * 0.6 + contrast * 0.4)),
      Math.round(56 + 30 * (middle * 0.65 + edge * 0.35)),
      Math.round(55 + 29 * (upper * 0.75 + contrast * 0.25)),
      Math.round(54 + 31 * (right * 0.55 + edge * 0.45))
    ];
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
    var hand = state.hand === "left" ? copy.left : copy.right;
    var lineHtml = copy.lineNames.map(function (name, index) {
      return '<article class="reading-item"><div class="reading-item-top"><h3>' + name + '</h3><span class="reading-tag">' + copy.lineTags[index] + '</span></div><p>' + copy.lineTexts[index] + "</p></article>";
    }).join("");
    els.resultBody.innerHTML =
      '<div class="result-header"><div class="result-eyebrow">' + copy.resultEyebrow + '</div><h2>' + interpolateText(copy.resultTitle, { hand: hand }) + '</h2><p>' + copy.resultIntro + "</p></div>" +
      renderRadar(scores) +
      '<div class="reading-grid">' + lineHtml + "</div>" +
      '<div class="phase-reading"><h3>' + copy.phaseTitle + "</h3><p>" + copy.phaseText + "</p></div>" +
      '<p class="disclaimer">' + copy.disclaimer + "</p>";
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
    var lines = [copy.downloadTitle, "", copy.handLabel + ": " + hand, copy.generated, ""];
    copy.scores.forEach(function (label, index) { lines.push(label + ": " + scores[index] + "/100"); });
    lines.push("", copy.phaseTitle, copy.phaseText, "");
    copy.lineNames.forEach(function (name, index) { lines.push(name + " - " + copy.lineTags[index], copy.lineTexts[index], ""); });
    lines.push(copy.disclaimer);
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
