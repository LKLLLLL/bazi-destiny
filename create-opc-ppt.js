const pptxgen = require("pptxgenjs");

// Create presentation
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'OpenClaw AI';
pres.title = 'OPC：AI 轻量化创业模式';

// Color palette - Midnight Executive (dark theme for premium feel)
const colors = {
  primary: "1E2761",      // Navy
  secondary: "CADCFC",    // Ice blue
  accent: "F96167",       // Coral accent
  white: "FFFFFF",
  dark: "0F172A",
  gray: "64748B",
  lightGray: "E2E8F0",
  success: "10B981",      // Green
  warning: "F59E0B",      // Orange
};

// ============ SLIDE 1: Title ============
let slide1 = pres.addSlide();
slide1.background = { color: colors.primary };

slide1.addText("OPC", {
  x: 0.5, y: 1.5, w: 9, h: 1.2,
  fontSize: 72, fontFace: "Arial Black", color: colors.white,
  align: "center", bold: true
});

slide1.addText("AI 轻量化创业模式", {
  x: 0.5, y: 2.7, w: 9, h: 0.8,
  fontSize: 36, fontFace: "Arial", color: colors.secondary,
  align: "center"
});

slide1.addText("1 个创始人 + AI 智能体 + 一人有限公司", {
  x: 0.5, y: 3.8, w: 9, h: 0.5,
  fontSize: 20, fontFace: "Arial", color: colors.white,
  align: "center", italic: true
});

slide1.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 4.5, w: 3, h: 0.05,
  fill: { color: colors.accent }
});

slide1.addText("2026 年超级个体创业指南", {
  x: 0.5, y: 4.8, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: colors.secondary,
  align: "center"
});

// ============ SLIDE 2: What is OPC ============
let slide2 = pres.addSlide();
slide2.background = { color: colors.white };

// Left accent bar
slide2.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.15, h: 5.625,
  fill: { color: colors.primary }
});

slide2.addText("OPC 是什么？", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 36, fontFace: "Arial Black", color: colors.primary
});

// Formula box
slide2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.2, w: 9, h: 1.2,
  fill: { color: colors.lightGray },
  rectRadius: 0.1
});

slide2.addText("1 个创始人  +  AI 智能体/工具  +  一人有限公司  =  超级个体", {
  x: 0.7, y: 1.5, w: 8.6, h: 0.6,
  fontSize: 22, fontFace: "Arial", color: colors.primary,
  align: "center", bold: true
});

// Three pillars
const pillars = [
  { title: "决策者", desc: "一个人就是一支队伍", icon: "👤" },
  { title: "AI 杠杆", desc: "替代 70-80% 人力工作", icon: "🤖" },
  { title: "合规主体", desc: "有限责任 + 独立法人", icon: "🏛️" }
];

pillars.forEach((p, i) => {
  const x = 0.8 + i * 3;
  slide2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 2.8, w: 2.6, h: 2.2,
    fill: { color: colors.white },
    line: { color: colors.secondary, width: 2 },
    rectRadius: 0.1,
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.1 }
  });
  
  slide2.addText(p.icon, {
    x: x, y: 3.0, w: 2.6, h: 0.6,
    fontSize: 32, align: "center"
  });
  
  slide2.addText(p.title, {
    x: x + 0.1, y: 3.6, w: 2.4, h: 0.4,
    fontSize: 18, fontFace: "Arial", color: colors.primary,
    align: "center", bold: true
  });
  
  slide2.addText(p.desc, {
    x: x + 0.1, y: 4.1, w: 2.4, h: 0.6,
    fontSize: 12, fontFace: "Arial", color: colors.gray,
    align: "center"
  });
});

// ============ SLIDE 3: Why Now ============
let slide3 = pres.addSlide();
slide3.background = { color: colors.white };

slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.15, h: 5.625,
  fill: { color: colors.primary }
});

slide3.addText("为什么 2025-2026 是 OPC 黄金期？", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: colors.primary
});

const reasons = [
  { num: "1", text: "AI 能力突破", desc: "GPT-4、Claude、Midjourney 足够强大" },
  { num: "2", text: "成本降到极低", desc: "AI 工具月费 $20-200，替代月薪 ¥10,000+" },
  { num: "3", text: "基础设施成熟", desc: "无代码平台、支付系统、云服务一应俱全" },
  { num: "4", text: "政策支持", desc: "一人有限公司法律完善，税收优惠明确" },
  { num: "5", text: "市场验证", desc: "已有大量成功案例（单人 $3M+ ARR）" }
];

reasons.forEach((r, i) => {
  const y = 1.2 + i * 0.85;
  
  // Number circle
  slide3.addShape(pres.shapes.OVAL, {
    x: 0.6, y: y, w: 0.5, h: 0.5,
    fill: { color: colors.accent }
  });
  
  slide3.addText(r.num, {
    x: 0.6, y: y, w: 0.5, h: 0.5,
    fontSize: 18, fontFace: "Arial Black", color: colors.white,
    align: "center", valign: "middle"
  });
  
  slide3.addText(r.text, {
    x: 1.3, y: y, w: 3, h: 0.5,
    fontSize: 18, fontFace: "Arial", color: colors.primary,
    bold: true, valign: "middle"
  });
  
  slide3.addText(r.desc, {
    x: 4.3, y: y, w: 5.2, h: 0.5,
    fontSize: 14, fontFace: "Arial", color: colors.gray,
    valign: "middle"
  });
});

// ============ SLIDE 4: Success Cases ============
let slide4 = pres.addSlide();
slide4.background = { color: colors.primary };

slide4.addText("真实成功案例", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 36, fontFace: "Arial Black", color: colors.white
});

const cases = [
  { name: "Pieter Levels", result: "$3M+ ARR", desc: "单人运营 NomadList 等多产品矩阵", flag: "🇺🇸" },
  { name: "上海 90 后", result: "800 万/半年", desc: "AI + 跨境电商，成本降低 70%", flag: "🇨🇳" },
  { name: "成都 AI 短剧", result: "50 万+/月", desc: "1 电脑 + 3 编剧，48h 出剧", flag: "🇨🇳" },
  { name: "深圳 AI 私教", result: "8 城市/半年", desc: "客单价 ¥2980，复购率 45%", flag: "🇨🇳" },
  { name: "Excel 教练", result: "10 万+/月", desc: "财务 VBA 培训，客单价 ¥6800", flag: "🇨🇳" },
  { name: "数字产品平台", result: "350 万", desc: "仅销售模版，0 正式员工", flag: "🇨🇳" }
];

cases.forEach((c, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.5 + col * 3.1;
  const y = 1.2 + row * 2.1;
  
  slide4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 2.9, h: 1.9,
    fill: { color: "2A3A6E" },
    rectRadius: 0.1
  });
  
  slide4.addText(c.flag + " " + c.name, {
    x: x + 0.15, y: y + 0.15, w: 2.6, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: colors.secondary
  });
  
  slide4.addText(c.result, {
    x: x + 0.15, y: y + 0.6, w: 2.6, h: 0.5,
    fontSize: 24, fontFace: "Arial Black", color: colors.accent
  });
  
  slide4.addText(c.desc, {
    x: x + 0.15, y: y + 1.2, w: 2.6, h: 0.5,
    fontSize: 11, fontFace: "Arial", color: colors.white
  });
});

// ============ SLIDE 5: Methodology ============
let slide5 = pres.addSlide();
slide5.background = { color: colors.white };

slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.15, h: 5.625,
  fill: { color: colors.primary }
});

slide5.addText("三步打造盈利飞轮", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 36, fontFace: "Arial Black", color: colors.primary
});

// Three steps with arrows
const steps = [
  { num: "1", title: "找到最小盈利单元", items: ["挖掘高频、高付费痛点", "聚焦垂直领域", "用 AI 快速验证"] },
  { num: "2", title: "设计自动收钱产品", items: ["引流品：免费/低价筛选用户", "利润品：核心收入来源", "溢价品：提升客单价"] },
  { num: "3", title: "构建自动化闭环", items: ["获客 → 转化 → 交付", "复购 → 推荐 → 获客", "全程 AI 自动化"] }
];

steps.forEach((s, i) => {
  const x = 0.5 + i * 3.2;
  
  // Step number
  slide5.addShape(pres.shapes.OVAL, {
    x: x + 1.1, y: 1.1, w: 0.8, h: 0.8,
    fill: { color: colors.accent }
  });
  
  slide5.addText(s.num, {
    x: x + 1.1, y: 1.1, w: 0.8, h: 0.8,
    fontSize: 32, fontFace: "Arial Black", color: colors.white,
    align: "center", valign: "middle"
  });
  
  // Title
  slide5.addText(s.title, {
    x: x, y: 2.1, w: 3, h: 0.5,
    fontSize: 16, fontFace: "Arial", color: colors.primary,
    align: "center", bold: true
  });
  
  // Items
  s.items.forEach((item, j) => {
    slide5.addText("• " + item, {
      x: x + 0.1, y: 2.7 + j * 0.5, w: 2.8, h: 0.5,
      fontSize: 12, fontFace: "Arial", color: colors.gray
    });
  });
  
  // Arrow (except last)
  if (i < 2) {
    slide5.addText("→", {
      x: x + 2.8, y: 1.2, w: 0.5, h: 0.6,
      fontSize: 28, fontFace: "Arial", color: colors.accent,
      align: "center"
    });
  }
});

// Formula at bottom
slide5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 4.5, w: 9, h: 0.8,
  fill: { color: colors.lightGray },
  rectRadius: 0.05
});

slide5.addText("利润 = (客单价 × 转化率) - (获客成本 + 交付成本)", {
  x: 0.5, y: 4.6, w: 9, h: 0.6,
  fontSize: 20, fontFace: "Arial", color: colors.primary,
  align: "center", bold: true
});

// ============ SLIDE 6: Cost Comparison ============
let slide6 = pres.addSlide();
slide6.background = { color: colors.white };

slide6.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.15, h: 5.625,
  fill: { color: colors.primary }
});

slide6.addText("成本对比：OPC vs 传统创业", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: colors.primary
});

// Comparison table data
const tableData = [
  [
    { text: "成本项", options: { fill: { color: colors.primary }, color: colors.white, bold: true, align: "center" } },
    { text: "传统创业", options: { fill: { color: colors.primary }, color: colors.white, bold: true, align: "center" } },
    { text: "OPC 模式", options: { fill: { color: colors.primary }, color: colors.white, bold: true, align: "center" } }
  ],
  ["人力成本", "¥50-200 万/年", "$200-500/月 (AI 订阅)"],
  ["办公成本", "¥10-50 万/年", "¥0 (居家/咖啡厅)"],
  ["设备成本", "¥10-50 万", "¥1-3 万 (一台电脑)"],
  ["协调成本", "高 (会议、沟通)", "低 (AI 自动化)"],
  [
    { text: "总成本", options: { bold: true, fill: { color: colors.lightGray } } },
    { text: "¥70-300 万/年", options: { bold: true, fill: { color: colors.lightGray } } },
    { text: "¥2-5 万/年", options: { bold: true, color: colors.success, fill: { color: colors.lightGray } } }
  ]
];

slide6.addTable(tableData, {
  x: 0.5, y: 1.2, w: 9, h: 3.5,
  colW: [2.5, 3.25, 3.25],
  border: { pt: 0.5, color: colors.lightGray },
  fontFace: "Arial",
  fontSize: 14,
  color: colors.dark,
  align: "center",
  valign: "middle"
});

// Highlight box
slide6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 2.5, y: 4.9, w: 5, h: 0.5,
  fill: { color: colors.success },
  rectRadius: 0.05
});

slide6.addText("OPC 成本优势：降低 90%+", {
  x: 2.5, y: 4.95, w: 5, h: 0.4,
  fontSize: 18, fontFace: "Arial Black", color: colors.white,
  align: "center"
});

// ============ SLIDE 7: Cash Flow Structure ============
let slide7 = pres.addSlide();
slide7.background = { color: colors.white };

slide7.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.15, h: 5.625,
  fill: { color: colors.primary }
});

slide7.addText("现金流结构：70-20-10 反脆弱设计", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: colors.primary
});

// Pie chart for 70-20-10
slide7.addChart(pres.charts.PIE, [{
  name: "现金流分配",
  labels: ["核心产品 (70%)", "新渠道尝试 (20%)", "未来投资 (10%)"],
  values: [70, 20, 10]
}], {
  x: 0.5, y: 1.2, w: 4, h: 3.5,
  chartColors: [colors.primary, colors.warning, colors.accent],
  showPercent: true,
  showLegend: true,
  legendPos: "b"
});

// Right side explanation
const flowItems = [
  { pct: "70%", title: "核心产品收入", desc: "确保生存的稳定现金流", color: colors.primary },
  { pct: "20%", title: "新渠道尝试", desc: "短视频带货、新平台测试", color: colors.warning },
  { pct: "10%", title: "未来趋势投资", desc: "AI 工具开发、新赛道探索", color: colors.accent }
];

flowItems.forEach((item, i) => {
  const y = 1.4 + i * 1.2;
  
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: 5, y: y, w: 0.1, h: 1,
    fill: { color: item.color }
  });
  
  slide7.addText(item.pct + " " + item.title, {
    x: 5.3, y: y, w: 4, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: colors.primary, bold: true
  });
  
  slide7.addText(item.desc, {
    x: 5.3, y: y + 0.4, w: 4, h: 0.4,
    fontSize: 13, fontFace: "Arial", color: colors.gray
  });
});

// ============ SLIDE 8: Track Selection ============
let slide8 = pres.addSlide();
slide8.background = { color: colors.white };

slide8.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.15, h: 5.625,
  fill: { color: colors.primary }
});

slide8.addText("赛道选择矩阵", {
  x: 0.5, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: colors.primary
});

const tracks = [
  { name: "知识付费/培训", stars: 5, income: "¥10-100 万/年", cost: "¥0" },
  { name: "内容创作/自媒体", stars: 4, income: "¥50-500 万/年", cost: "¥0" },
  { name: "AI 工具/智能体", stars: 4, income: "¥100-1000 万/年", cost: "¥500/月" },
  { name: "数字产品", stars: 4, income: "¥50-500 万/年", cost: "¥0" },
  { name: "垂直服务", stars: 3, income: "¥50-200 万/年", cost: "¥0-5 万" },
  { name: "跨境电商", stars: 3, income: "¥500-5000 万/年", cost: "¥5-10 万" }
];

// Table for tracks
const trackTable = [
  [
    { text: "赛道", options: { fill: { color: colors.primary }, color: colors.white, bold: true } },
    { text: "成功率", options: { fill: { color: colors.primary }, color: colors.white, bold: true } },
    { text: "收入上限", options: { fill: { color: colors.primary }, color: colors.white, bold: true } },
    { text: "启动成本", options: { fill: { color: colors.primary }, color: colors.white, bold: true } }
  ],
  ...tracks.map(t => [
    t.name,
    "⭐".repeat(t.stars),
    t.income,
    t.cost
  ])
];

slide8.addTable(trackTable, {
  x: 0.5, y: 1.1, w: 9, h: 4,
  colW: [2.5, 1.5, 2.5, 2.5],
  border: { pt: 0.5, color: colors.lightGray },
  fontFace: "Arial",
  fontSize: 13,
  color: colors.dark,
  align: "center",
  valign: "middle"
});

// ============ SLIDE 9: Roadmap ============
let slide9 = pres.addSlide();
slide9.background = { color: colors.primary };

slide9.addText("OPC 启动路线图", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: colors.white
});

const phases = [
  { phase: "第 0 阶段", title: "准备", time: "1 周", tasks: ["注册公司", "开通 AI 工具", "确定赛道"] },
  { phase: "第 1 阶段", title: "MVP 验证", time: "2-4 周", tasks: ["快速上线", "获得 10 付费用户", "验证需求"] },
  { phase: "第 2 阶段", title: "产品化", time: "1-3 月", tasks: ["自动化交付", "内容营销", "月入 ¥5K-2W"] },
  { phase: "第 3 阶段", title: "规模化", time: "3-6 月", tasks: ["扩展产品线", "新渠道", "月入 ¥2W-10W"] }
];

phases.forEach((p, i) => {
  const x = 0.4 + i * 2.4;
  
  // Phase box
  slide9.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 0.9, w: 2.2, h: 4.3,
    fill: { color: "2A3A6E" },
    rectRadius: 0.1
  });
  
  // Phase number
  slide9.addText(p.phase, {
    x: x, y: 1.0, w: 2.2, h: 0.4,
    fontSize: 12, fontFace: "Arial", color: colors.secondary,
    align: "center"
  });
  
  // Title
  slide9.addText(p.title, {
    x: x, y: 1.4, w: 2.2, h: 0.5,
    fontSize: 20, fontFace: "Arial Black", color: colors.white,
    align: "center"
  });
  
  // Time
  slide9.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.4, y: 2.0, w: 1.4, h: 0.35,
    fill: { color: colors.accent },
    rectRadius: 0.05
  });
  
  slide9.addText(p.time, {
    x: x + 0.4, y: 2.0, w: 1.4, h: 0.35,
    fontSize: 12, fontFace: "Arial", color: colors.white,
    align: "center", valign: "middle"
  });
  
  // Tasks
  p.tasks.forEach((task, j) => {
    slide9.addText("✓ " + task, {
      x: x + 0.15, y: 2.6 + j * 0.5, w: 1.9, h: 0.5,
      fontSize: 11, fontFace: "Arial", color: colors.white
    });
  });
  
  // Arrow (except last)
  if (i < 3) {
    slide9.addText("→", {
      x: x + 2.0, y: 2.5, w: 0.5, h: 0.5,
      fontSize: 24, fontFace: "Arial", color: colors.accent,
      align: "center"
    });
  }
});

// ============ SLIDE 10: Tool Stack ============
let slide10 = pres.addSlide();
slide10.background = { color: colors.white };

slide10.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.15, h: 5.625,
  fill: { color: colors.primary }
});

slide10.addText("OPC 核心工具栈", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: colors.primary
});

const tools = [
  { category: "AI 对话/写作", items: "ChatGPT Plus ($20/月)\nClaude Pro ($20/月)\nDeepSeek (¥10/月)" },
  { category: "AI 设计", items: "Midjourney ($10-30/月)\nCanva AI (免费)" },
  { category: "AI 视频", items: "Runway ($12/月)\nElevenLabs ($5/月)\nCapCut (免费)" },
  { category: "智能体平台", items: "扣子 Coze (免费)\nDify (免费/付费)" },
  { category: "办公协作", items: "Notion AI ($10/月)\n飞书 (免费)" },
  { category: "支付/交付", items: "微信支付/支付宝\nGumroad/面包多" }
];

tools.forEach((t, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.5 + col * 3.1;
  const y = 1.0 + row * 2.2;
  
  slide10.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 2.9, h: 2,
    fill: { color: colors.lightGray },
    rectRadius: 0.1
  });
  
  slide10.addText(t.category, {
    x: x + 0.15, y: y + 0.15, w: 2.6, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: colors.primary, bold: true
  });
  
  slide10.addText(t.items, {
    x: x + 0.15, y: y + 0.6, w: 2.6, h: 1.2,
    fontSize: 11, fontFace: "Arial", color: colors.gray
  });
});

// ============ SLIDE 11: Key Formula ============
let slide11 = pres.addSlide();
slide11.background = { color: colors.primary };

slide11.addText("OPC 成功公式", {
  x: 0.5, y: 0.5, w: 9, h: 0.8,
  fontSize: 36, fontFace: "Arial Black", color: colors.white,
  align: "center"
});

// Main formula
slide11.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.5, w: 9, h: 1.2,
  fill: { color: "2A3A6E" },
  rectRadius: 0.1
});

slide11.addText("成功 = 细分赛道 × AI 杠杆 × 自动化闭环 × 快速迭代", {
  x: 0.5, y: 1.7, w: 9, h: 0.8,
  fontSize: 24, fontFace: "Arial", color: colors.white,
  align: "center", bold: true
});

// Four elements
const elements = [
  { icon: "🎯", title: "细分赛道", desc: "足够小但付费意愿强" },
  { icon: "🚀", title: "AI 杠杆", desc: "个人能力放大 10 倍" },
  { icon: "🔄", title: "自动化闭环", desc: "获客到交付全自动" },
  { icon: "⚡", title: "快速迭代", desc: "2 周验证，不行就换" }
];

elements.forEach((e, i) => {
  const x = 0.5 + i * 2.4;
  
  slide11.addText(e.icon, {
    x: x, y: 3.0, w: 2.2, h: 0.6,
    fontSize: 36, align: "center"
  });
  
  slide11.addText(e.title, {
    x: x, y: 3.6, w: 2.2, h: 0.4,
    fontSize: 16, fontFace: "Arial", color: colors.white,
    align: "center", bold: true
  });
  
  slide11.addText(e.desc, {
    x: x, y: 4.1, w: 2.2, h: 0.5,
    fontSize: 12, fontFace: "Arial", color: colors.secondary,
    align: "center"
  });
});

// ============ SLIDE 12: Call to Action ============
let slide12 = pres.addSlide();
slide12.background = { color: colors.primary };

slide12.addText("开始你的 OPC 之旅", {
  x: 0.5, y: 1.5, w: 9, h: 1,
  fontSize: 42, fontFace: "Arial Black", color: colors.white,
  align: "center"
});

slide12.addText("选择一个细分赛道，用 AI 把个人能力放大 10 倍", {
  x: 0.5, y: 2.6, w: 9, h: 0.6,
  fontSize: 20, fontFace: "Arial", color: colors.secondary,
  align: "center"
});

// Three action items
const actions = ["注册一人有限公司", "开通 AI 工具订阅", "2 周内上线 MVP"];

actions.forEach((a, i) => {
  const x = 1.5 + i * 2.5;
  
  slide12.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 3.5, w: 2.2, h: 0.8,
    fill: { color: colors.accent },
    rectRadius: 0.1
  });
  
  slide12.addText((i + 1) + ". " + a, {
    x: x, y: 3.6, w: 2.2, h: 0.6,
    fontSize: 14, fontFace: "Arial", color: colors.white,
    align: "center", valign: "middle", bold: true
  });
});

slide12.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 4.8, w: 3, h: 0.05,
  fill: { color: colors.secondary }
});

slide12.addText("2026 年，一个人也可以是一支队伍", {
  x: 0.5, y: 5.0, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: colors.secondary,
  align: "center", italic: true
});

// Save presentation
pres.writeFile({ fileName: "/Users/xiaoxiami/.qclaw/workspace/OPC-AI轻量化创业模式.pptx" })
  .then(() => console.log("PPT created successfully!"))
  .catch(err => console.error("Error:", err));
