const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'OpenClaw AI';
pres.title = '一人公司（OPC）创业全景分析';

// 配色方案 - 深蓝+金色主题
const colors = {
  primary: "1E3A5F",      // 深蓝
  secondary: "F5B041",    // 金色
  accent: "E74C3C",       // 红色强调
  light: "F8F9FA",        // 浅灰背景
  dark: "2C3E50",         // 深灰文字
  white: "FFFFFF",
  gray: "7F8C8D"
};

// ========== 封面 ==========
let slide1 = pres.addSlide();
slide1.background = { color: colors.primary };

slide1.addText("一人公司（OPC）", {
  x: 0.5, y: 1.5, w: 9, h: 1,
  fontSize: 48, fontFace: "Arial Black", color: colors.white, align: "center"
});

slide1.addText("创业全景分析报告", {
  x: 0.5, y: 2.5, w: 9, h: 0.8,
  fontSize: 36, fontFace: "Arial", color: colors.secondary, align: "center"
});

slide1.addText("One Person Company · 超级个体时代", {
  x: 0.5, y: 3.5, w: 9, h: 0.5,
  fontSize: 20, fontFace: "Arial", color: colors.white, align: "center", italic: true
});

slide1.addText("2026年4月", {
  x: 0.5, y: 4.8, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Arial", color: colors.gray, align: "center"
});

// ========== 目录 ==========
let slide2 = pres.addSlide();
slide2.background = { color: colors.light };

slide2.addText("目录", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: colors.primary
});

slide2.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 0.9, w: 0.1, h: 0.5, fill: { color: colors.secondary }
});

const toc = [
  "1. 什么是 OPC（一人公司）？",
  "2. 为什么现在是 OPC 的黄金时代？",
  "3. 成功案例深度分析",
  "4. 赚钱的商业模式",
  "5. 方法论：从 0 到盈利",
  "6. 中国市场机会",
  "7. 行动建议"
];

slide2.addText(toc.map((item, i) => ({
  text: item, options: { bullet: false, breakLine: true, paraSpaceAfter: 12 }
})), {
  x: 0.8, y: 1.3, w: 8, h: 4,
  fontSize: 20, fontFace: "Arial", color: colors.dark
});

// ========== 什么是 OPC ==========
let slide3 = pres.addSlide();
slide3.background = { color: colors.light };

slide3.addText("什么是 OPC？", {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Arial Black", color: colors.primary
});

slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 0.9, w: 0.1, h: 0.5, fill: { color: colors.secondary }
});

slide3.addText("OPC = One Person Company（一人公司）", {
  x: 0.5, y: 1.2, w: 9, h: 0.5,
  fontSize: 24, fontFace: "Arial", color: colors.secondary, bold: true
});

slide3.addText([
  { text: "核心定义：", options: { bold: true, breakLine: true } },
  { text: "1位核心创业者 + 小团队（0-5人）+ AI工具", options: { breakLine: true, paraSpaceAfter: 10 } },
  { text: "", options: { breakLine: true } },
  { text: "本质特征：", options: { bold: true, breakLine: true } },
  { text: "• 轻资产、数字化、高度灵活", options: { breakLine: true } },
  { text: "• 借力 AI 完成传统需要10人以上的工作", options: { breakLine: true } },
  { text: "• 不追求规模，追求利润率和自由度", options: { breakLine: true } }
], {
  x: 0.5, y: 1.8, w: 4.5, h: 3,
  fontSize: 18, fontFace: "Arial", color: colors.dark
});

// 右侧卡片
slide3.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 5.3,