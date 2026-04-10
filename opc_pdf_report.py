#!/usr/bin/env python3
"""
OPC 一人公司报告 - 专业 PDF 生成器
使用 reportlab + macOS 系统中文字体
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, String, Circle, Line, Polygon
from reportlab.graphics import renderPDF
from reportlab.platypus import Flowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
import math

# ========== 字体注册 ==========
FONT_DIR = "/System/Library/Fonts"
pdfmetrics.registerFont(TTFont("Heiti", f"{FONT_DIR}/STHeiti Medium.ttc"))
pdfmetrics.registerFont(TTFont("HeitiLight", f"{FONT_DIR}/STHeiti Light.ttc"))
pdfmetrics.registerFont(TTFont("Songti", f"{FONT_DIR}/Supplemental/Songti.ttc"))

# ========== 配色方案 ==========
NAVY = colors.HexColor("#1E2761")
ICE_BLUE = colors.HexColor("#CADCFC")
CORAL = colors.HexColor("#F96167")
WHITE = colors.white
DARK = colors.HexColor("#0F172A")
GRAY = colors.HexColor("#64748B")
LIGHT_GRAY = colors.HexColor("#E2E8F0")
GREEN = colors.HexColor("#10B981")
AMBER = colors.HexColor("#F59E0B")
LIGHT_BG = colors.HexColor("#F8FAFC")

W, H = A4  # 595.27 x 841.89 pts

# ========== 自定义 Flowable ==========
class ColorRect(Flowable):
    def __init__(self, w, h, fill_color, radius=0):
        super().__init__()
        self.w = w
        self.h = h
        self.fill_color = fill_color
        self.radius = radius

    def draw(self):
        self.canv.setFillColor(self.fill_color)
        if self.radius > 0:
            self.canv.roundRect(0, 0, self.w, self.h, self.radius, fill=1, stroke=0)
        else:
            self.canv.rect(0, 0, self.w, self.h, fill=1, stroke=0)

class HeaderBanner(Flowable):
    """顶部彩色横幅"""
    def __init__(self, width, height, bg_color, text, text_color=WHITE, subtext=None):
        super().__init__()
        self.width = width
        self.height = height
        self.bg_color = bg_color
        self.text = text
        self.text_color = text_color
        self.subtext = subtext

    def draw(self):
        c = self.canv
        c.setFillColor(self.bg_color)
        c.rect(0, 0, self.width, self.height, fill=1, stroke=0)
        c.setFillColor(self.text_color)
        c.setFont("Heiti", 20)
        c.drawString(20, self.height - 30, self.text)
        if self.subtext:
            c.setFont("HeitiLight", 11)
            c.setFillColor(ICE_BLUE)
            c.drawString(20, self.height - 52, self.subtext)

class IconEmoji(Flowable):
    """emoji图标（使用Unicode）"""
    def __init__(self, emoji, size=24):
        super().__init__()
        self.emoji = emoji
        self.size = size
        self.width = size * 1.2
        self.height = size

    def draw(self):
        self.canv.setFont("Heiti", self.size)
        self.canv.setFillColor(DARK)
        self.canv.drawString(0, 0, self.emoji)

# ========== 页面样式 ==========
def make_styles():
    base = getSampleStyleSheet()
    
    styles = {
        "h1": ParagraphStyle("h1", fontName="Heiti", fontSize=26,
                              textColor=NAVY, spaceAfter=12, leading=32),
        "h2": ParagraphStyle("h2", fontName="Heiti", fontSize=18,
                              textColor=NAVY, spaceAfter=8, leading=22, spaceBefore=6),
        "h3": ParagraphStyle("h3", fontName="Heiti", fontSize=14,
                              textColor=DARK, spaceAfter=6, leading=18),
        "body": ParagraphStyle("body", fontName="HeitiLight", fontSize=10.5,
                               textColor=DARK, leading=16, spaceAfter=6),
        "body_small": ParagraphStyle("body_small", fontName="HeitiLight", fontSize=9.5,
                                      textColor=GRAY, leading=14, spaceAfter=4),
        "caption": ParagraphStyle("caption", fontName="HeitiLight", fontSize=8.5,
                                   textColor=GRAY, leading=12),
        "label": ParagraphStyle("label", fontName="Heiti", fontSize=9,
                                 textColor=GRAY, leading=12),
        "number": ParagraphStyle("number", fontName="Heiti", fontSize=28,
                                 textColor=CORAL, leading=32, spaceAfter=4),
        "money": ParagraphStyle("money", fontName="Heiti", fontSize=22,
                                textColor=GREEN, leading=28, spaceAfter=2),
        "tag": ParagraphStyle("tag", fontName="Heiti", fontSize=8.5,
                               textColor=WHITE, leading=12),
        "center": ParagraphStyle("center", fontName="Heiti", fontSize=12,
                                 textColor=DARK, alignment=TA_CENTER, leading=18),
    }
    return styles

# ========== PDF 生成器 ==========
class OPCPDFGenerator:
    def __init__(self, output_path):
        self.output_path = output_path
        self.doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=1.5*cm, leftMargin=1.5*cm,
            topMargin=1.5*cm, bottomMargin=1.5*cm
        )
        self.story = []
        self.styles = make_styles()
        self.page_width = W - 3*cm

    def add_slide_header(self, title, subtitle=None, bg=NAVY):
        """添加一页标题横幅"""
        banner = HeaderBanner(self.page_width, 60, bg, title, WHITE, subtitle)
        self.story.append(banner)
        self.story.append(Spacer(1, 12))

    def add_divider(self, color=NAVY):
        self.story.append(HRFlowable(width="100%", thickness=2, color=color, spaceAfter=10, spaceBefore=4))

    def card(self, items, cols=3, card_width=None):
        """三列卡片布局"""
        if card_width is None:
            card_width = (self.page_width - (cols-1)*12) / cols
        
        rows = []
        row = []
        for i, (title, desc, highlight) in enumerate(items):
            # 简化：只用Table实现
            pass
        
        # 用Table实现
        table_data = []
        row_data = []
        for i, (title, desc, highlight, emoji) in enumerate(items):
            title_style = self.styles["h3"]
            desc_style = self.styles["body_small"]
            title_style.textColor = NAVY
            title_para = Paragraph(f"{emoji} {title}" if emoji else title, title_style)
            desc_para = Paragraph(desc, desc_style)
            
            cell_content = [title_para, Spacer(1, 4), desc_para]
            if highlight:
                hl_style = ParagraphStyle("hl", fontName="Heiti", fontSize=12,
                                          textColor=GREEN if "+" in highlight else CORAL)
                cell_content.append(Spacer(1, 4))
                cell_content.append(Paragraph(highlight, hl_style))
            
            from reportlab.platypus import KeepInFrame
            cell = KeepInFrame(card_width - 10, 2*cm, cell_content)
            row.append(cell)
            
            if len(row) == cols:
                rows.append(row)
                row = []
        
        if row:
            while len(row) < cols:
                row.append(Spacer(1, 1))
            rows.append(row)
        
        tbl = Table(rows, colWidths=[card_width]*cols, hAlign="LEFT")
        tbl.setStyle(TableStyle([
            ("ALIGN", (0,0), (-1,-1), "LEFT"),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("LEFTPADDING", (0,0), (-1,-1), 10),
            ("RIGHTPADDING", (0,0), (-1,-1), 10),
            ("TOPPADDING", (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
            ("ROWBACKGROUNDS", (0,0), (-1,-1), [LIGHT_BG, colors.HexColor("#EEF2FF")]),
            ("BOX", (0,0), (-1,-1), 1, ICE_BLUE),
            ("INNERGRID", (0,0), (-1,-1), 0.5, ICE_BLUE),
        ]))
        self.story.append(tbl)
        self.story.append(Spacer(1, 16))

    def highlight_box(self, text, bg=CORAL, text_color=WHITE):
        """高亮提示框"""
        p = Paragraph(f"<b>{text}</b>", ParagraphStyle("hb", fontName="Heiti", fontSize=12,
                                                         textColor=text_color, alignment=TA_CENTER, leading=18))
        tbl = Table([[p]], colWidths=[self.page_width])
        tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), bg),
            ("ALIGN", (0,0), (-1,-1), "CENTER"),
            ("TOPPADDING", (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ("LEFTPADDING", (0,0), (-1,-1), 15),
            ("RIGHTPADDING", (0,0), (-1,-1), 15),
        ]))
        self.story.append(tbl)
        self.story.append(Spacer(1, 16))

    def build(self):
        self._build_cover()
        self._build_what_is_opc()
        self._build_why_now()
        self._build_success_cases()
        self._build_profit_flywheel()
        self._build_cost_comparison()
        self._build_cash_flow()
        self._build_track_selection()
        self._build_roadmap()
        self._build_tools()
        self._build_formula()
        self._build_cta()
        
        self.doc.build(self.story)
        print(f"✅ PDF 已生成: {self.output_path}")

    # ========== 第1页：封面 ==========
    def _build_cover(self):
        # 全页深色背景用Table模拟
        cover_content = [
            Spacer(1, 3*cm),
            Paragraph("OPC", ParagraphStyle("cv1", fontName="Heiti", fontSize=72,
                                              textColor=CORAL, alignment=TA_CENTER, leading=80)),
            Spacer(1, 0.3*cm),
            Paragraph("AI 轻量化创业模式", ParagraphStyle("cv2", fontName="HeitiLight",
                                                           fontSize=28, textColor=ICE_BLUE,
                                                           alignment=TA_CENTER, leading=36)),
            Spacer(1, 0.5*cm),
            Paragraph("一人 + AI 智能体 + 有限公司 = 超级个体", 
                      ParagraphStyle("cv3", fontName="HeitiLight", fontSize=14,
                                      textColor=LIGHT_GRAY, alignment=TA_CENTER, leading=20)),
            Spacer(1, 1.5*cm),
            HRFlowable(width="50%", thickness=2, color=CORAL, hAlign="CENTER"),
            Spacer(1, 1.5*cm),
            Paragraph("2026 年超级个体创业指南", 
                      ParagraphStyle("cv4", fontName="HeitiLight", fontSize=12,
                                      textColor=GRAY, alignment=TA_CENTER)),
            Spacer(1, 0.5*cm),
            Paragraph("qclaw AI 整理", 
                      ParagraphStyle("cv5", fontName="HeitiLight", fontSize=10,
                                      textColor=GRAY, alignment=TA_CENTER)),
        ]
        
        from reportlab.platypus import KeepInFrame
        frame = KeepInFrame(self.page_width, H - 3*cm, cover_content, hAlign="CENTER")
        tbl = Table([[frame]], colWidths=[self.page_width])
        tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), NAVY),
            ("ALIGN", (0,0), (-1,-1), "CENTER"),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ]))
        self.story.append(tbl)
        self.story.append(PageBreak())

    # ========== 第2页：OPC是什么 ==========
    def _build_what_is_opc(self):
        self.add_slide_header("OPC 是什么？", "1 个创始人 + AI 杠杆 + 有限公司 = 超级个体")
        
        # 公式框
        formula_style = ParagraphStyle("formula", fontName="Heiti", fontSize=15,
                                        textColor=NAVY, alignment=TA_CENTER, leading=22)
        frm_tbl = Table([
            [Paragraph("<b>1 个创始人</b> + <b>AI 智能体</b> + <b>一人有限公司</b> = <font color='#F96167'><b>超级个体</b></font>",
                       formula_style)]
        ], colWidths=[self.page_width])
        frm_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
            ("BOX", (0,0), (-1,-1), 2, NAVY),
            ("TOPPADDING", (0,0), (-1,-1), 14),
            ("BOTTOMPADDING", (0,0), (-1,-1), 14),
        ]))
        self.story.append(frm_tbl)
        self.story.append(Spacer(1, 16))
        
        # 三大支柱
        self.add_divider(CORAL)
        self.story.append(Paragraph("三大核心要素", self.styles["h2"]))
        self.story.append(Spacer(1, 8))
        
        pillars = [
            ("🎯 决策者", "一个人就是一支队伍\n承担所有关键决策，快速响应市场变化", "+100% 自主权"),
            ("🤖 AI 杠杆", "替代 70-80% 人力工作\n文案、设计、代码、运营全部 AI 化", "×10 倍效率"),
            ("🏛️ 合规主体", "一人有限责任公司\n有限责任保护，专业形象背书", "+法律保障"),
        ]
        self.card_with_number(pillars, cols=3)

    def card_with_number(self, items, cols=3):
        card_w = (self.page_width - (cols-1)*12) / cols
        rows = []
        row = []
        for title, desc, metric in items:
            title_p = Paragraph(title, self.styles["h3"])
            desc_p = Paragraph(desc.replace("\n", "<br/>"), self.styles["body_small"])
            metric_p = Paragraph(metric, ParagraphStyle("m", fontName="Heiti", fontSize=13,
                                                          textColor=GREEN if "+" in metric or "×" in metric else CORAL))
            from reportlab.platypus import KeepInFrame
            cell = KeepInFrame(card_w - 12, 3*cm, [title_p, Spacer(1,4), desc_p, Spacer(1,6), metric_p])
            row.append(cell)
            if len(row) == cols:
                rows.append(row)
                row = []
        if row:
            while len(row) < cols: row.append(Spacer(1,1))
            rows.append(row)
        tbl = Table(rows, colWidths=[card_w]*cols)
        tbl.setStyle(TableStyle([
            ("ALIGN", (0,0), (-1,-1), "LEFT"),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("LEFTPADDING", (0,0), (-1,-1), 12),
            ("RIGHTPADDING", (0,0), (-1,-1), 12),
            ("TOPPADDING", (0,0), (-1,-1), 14),
            ("BOTTOMPADDING", (0,0), (-1,-1), 14),
            ("ROWBACKGROUNDS", (0,0), (-1,-1), [LIGHT_BG, colors.HexColor("#EEF2FF")]),
            ("BOX", (0,0), (-1,-1), 1, ICE_BLUE),
            ("INNERGRID", (0,0), (-1,-1), 0.5, ICE_BLUE),
        ]))
        self.story.append(tbl)
        self.story.append(Spacer(1, 14))

    # ========== 第3页：黄金期 ==========
    def _build_why_now(self):
        self.story.append(PageBreak())
        self.add_slide_header("为什么 2025-2026 是 OPC 黄金期？", "5 大结构性利好因素")
        
        reasons = [
            ("🚀 AI 能力突破", "GPT-4o、Claude 3.5、DeepSeek 等大模型能力已超越多数专业人士，AI 工具成本从月薪 ¥10,000+ 降到月费 ¥200 以内"),
            ("💰 成本降到极低", "AI 订阅月费 $20-200，可替代高薪岗位。基础设施成熟：无代码平台、云服务、支付系统开箱即用"),
            ("🏗️ 基础设施成熟", "Notion、飞书、钉钉等协作平台；Stripe、支付宝、微信支付等支付系统；AWS、阿里云等云服务一应俱全"),
            ("📋 政策支持", "一人有限责任公司法律完善，部分地区税收优惠明确，注册成本低至 ¥500 起，3 天拿证"),
            ("✅ 市场验证", "全球已有大量单人 $100 万+ ARR 成功案例。Pieter Levels 单人 $300 万+ ARR，国内 90 后单人半年 800 万+"),
        ]
        
        for i, (title, desc) in enumerate(reasons, 1):
            # 编号圆圈
            num_circle = Table([[Paragraph(f"<b>{i}</b>", 
                              ParagraphStyle("n", fontName="Heiti", fontSize=16, textColor=WHITE, alignment=TA_CENTER))]],
                              colWidths=[0.55*cm], rowHeights=[0.55*cm])
            num_circle.setStyle(TableStyle([
                ("BACKGROUND", (0,0), (-1,-1), CORAL),
                ("ALIGN", (0,0), (-1,-1), "CENTER"),
                ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
                ("ROUNDEDCORNERS", [5]),
            ]))
            
            title_p = Paragraph(f"<b>{title}</b>", self.styles["h3"])
            desc_p = Paragraph(desc, self.styles["body"])
            
            from reportlab.platypus import KeepInFrame
            content = KeepInFrame(self.page_width - 1.5*cm, 2*cm, [title_p, Spacer(1,3), desc_p])
            row_tbl = Table([[num_circle, content]], colWidths=[0.8*cm, self.page_width - 1.2*cm])
            row_tbl.setStyle(TableStyle([
                ("VALIGN", (0,0), (-1,-1), "TOP"),
                ("LEFTPADDING", (0,0), (-1,-1), 0),
                ("RIGHTPADDING", (0,0), (-1,-1), 0),
                ("TOPPADDING", (0,0), (-1,-1), 0),
                ("BOTTOMPADDING", (0,0), (-1,-1), 6),
            ]))
            self.story.append(row_tbl)
            self.story.append(HRFlowable(width="100%", thickness=0.5, color=ICE_BLUE, spaceAfter=8, spaceBefore=4))
        
        self.story.append(Spacer(1, 8))
        self.highlight_box("💡 结论：创业门槛从未如此之低，一个人可以完成过去需要 10 人团队的工作", NAVY)

    # ========== 第4页：成功案例 ==========
    def _build_success_cases(self):
        self.story.append(PageBreak())
        self.add_slide_header("真实成功案例", "国内外一人公司营收数据", CORAL)
        
        # 6个案例卡片
        cases = [
            ("🇺🇸 Pieter Levels", "单人运营 NomadList 等\n多产品矩阵", "$3M+ ARR\n≈ ¥2200万/年", GREEN),
            ("🇨🇳 上海 90 后", "AI + 跨境电商\n内容创作自动化", "800万/半年\n成本降低 70%", GREEN),
            ("🇨🇳 成都 AI 短剧", "1 电脑 + 3 编剧\nAI 辅助创作", "50万+/月", GREEN),
            ("🇨🇳 深圳 AI 私教", "垂直领域深耕\n高复购率", "8城市/半年\n客单 ¥2980", GREEN),
            ("🇨🇳 Excel 教练", "财务 VBA 培训\n精准垂直赛道", "10万+/月\n客单 ¥6800", GREEN),
            ("🇨🇳 数字产品", "仅销售模版/素材\n零正式员工", "350万/年", GREEN),
        ]
        
        card_w = (self.page_width - 2*10) / 3
        card_h = 3.2*cm
        
        rows = []
        for i in range(0, len(cases), 3):
            row_cells = []
            for j in range(3):
                if i+j < len(cases):
                    name, desc, revenue, rev_color = cases[i+j]
                    name_p = Paragraph(f"<b>{name}</b>", ParagraphStyle("cn", fontName="Heiti",
                                       fontSize=10, textColor=DARK))
                    desc_p = Paragraph(desc.replace("\n", "<br/>"), ParagraphStyle("cd",
                                       fontName="HeitiLight", fontSize=8.5, textColor=GRAY, leading=13))
                    rev_p = Paragraph(f"<b>{revenue}</b>", ParagraphStyle("cr", fontName="Heiti",
                                        fontSize=12, textColor=rev_color, leading=15))
                    from reportlab.platypus import KeepInFrame
                    cell_content = [name_p, Spacer(1,3), desc_p, Spacer(1,5), rev_p]
                    cell = KeepInFrame(card_w-12, card_h-20, cell_content)
                    
                    # 包装成带背景的卡片
                    inner = Table([[cell]], colWidths=[card_w-12])
                    inner.setStyle(TableStyle([
                        ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
                        ("TOPPADDING", (0,0), (-1,-1), 8),
                        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
                        ("LEFTPADDING", (0,0), (-1,-1), 6),
                    ]))
                    row_cells.append(inner)
                else:
                    row_cells.append(Spacer(1, 1))
            rows.append(row_cells)
        
        tbl = Table(rows, colWidths=[card_w]*3, rowHeights=[card_h]*2)
        tbl.setStyle(TableStyle([
            ("ALIGN", (0,0), (-1,-1), "LEFT"),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("LEFTPADDING", (0,0), (-1,-1), 5),
            ("RIGHTPADDING", (0,0), (-1,-1), 5),
            ("TOPPADDING", (0,0), (-1,-1), 5),
            ("BOTTOMPADDING", (0,0), (-1,-1), 5),
            ("BOX", (0,0), (-1,-1), 1, ICE_BLUE),
            ("INNERGRID", (0,0), (-1,-1), 0.5, ICE_BLUE),
            ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
        ]))
        self.story.append(tbl)
        self.story.append(Spacer(1, 12))
        
        # 底部洞察
        insight = Paragraph(
            "📊 <b>核心洞察：</b>这些案例的共同点 = <b>细分赛道 + AI 杠杆 + 轻资产运营 + 快速迭代</b>",
            ParagraphStyle("ins", fontName="Heiti", fontSize=10.5, textColor=DARK, leading=16)
        )
        self.story.append(insight)

    # ========== 第5页：盈利飞轮 ==========
    def _build_profit_flywheel(self):
        self.story.append(PageBreak())
        self.add_slide_header("三步打造盈利飞轮", "利润 = (客单价 × 转化率) - (获客成本 + 交付成本)")
        
        steps = [
            ("①", "找到最小盈利单元", [
                "🔍 挖掘高频、高付费的真实痛点",
                "🎯 聚焦垂直细分领域，不要贪大",
                "⚡ 用 AI 快速验证，最小成本试错",
            ], NAVY),
            ("②", "设计自动收钱产品", [
                "🎁 引流品：免费/低价筛选精准用户",
                "💰 利润品：核心收入来源，定价 ¥99-999",
                "👑 溢价品：高端定制，提升客单价",
            ], AMBER),
            ("③", "构建自动化闭环", [
                "📥 获客 → 转化 → 交付 全程自动",
                "🔄 复购 → 推荐 → 获客 形成循环",
                "🤖 客服、内容、运营 AI 自动化",
            ], GREEN),
        ]
        
        step_w = (self.page_width - 2*15) / 3
        
        for i, (num, title, items, color) in enumerate(steps, 1):
            # 步骤编号
            num_p = Paragraph(f"<b>{num}</b>", ParagraphStyle("sn", fontName="Heiti", fontSize=22,
                                textColor=WHITE, alignment=TA_CENTER))
            num_tbl = Table([[num_p]], colWidths=[step_w], rowHeights=[1.2*cm])
            num_tbl.setStyle(TableStyle([
                ("BACKGROUND", (0,0), (-1,-1), color),
                ("ALIGN", (0,0), (-1,-1), "CENTER"),
                ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
            ]))
            
            title_p = Paragraph(f"<b>{title}</b>", self.styles["h2"])
            title_tbl = Table([[title_p]], colWidths=[step_w])
            title_tbl.setStyle(TableStyle([
                ("TOPPADDING", (0,0), (-1,-1), 6),
                ("BOTTOMPADDING", (0,0), (-1,-1), 4),
            ]))
            
            item_ps = []
            for item in items:
                item_ps.append(Paragraph(item, ParagraphStyle("si", fontName="HeitiLight",
                                        fontSize=9.5, textColor=DARK, leading=15, spaceAfter=4)))
            
            from reportlab.platypus import KeepInFrame
            items_frame = KeepInFrame(step_w, 4*cm, item_ps)
            
            col_tbl = Table([[num_tbl], [title_tbl], [items_frame]], colWidths=[step_w])
            col_tbl.setStyle(TableStyle([
                ("ALIGN", (0,0), (-1,-1), "CENTER"),
                ("VALIGN", (0,0), (-1,-1), "TOP"),
                ("LEFTPADDING", (0,0), (-1,-1), 8),
                ("RIGHTPADDING", (0,0), (-1,-1), 8),
                ("TOPPADDING", (0,0), (-1,-1), 0),
                ("BOTTOMPADDING", (0,0), (-1,-1), 0),
                ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
                ("BOX", (0,0), (-1,-1), 1, color),
            ]))
            
            self.story.append(col_tbl)
            if i < 3:
                arrow = Paragraph("→", ParagraphStyle("arr", fontName="Heiti", fontSize=24,
                                textColor=color, alignment=TA_CENTER))
                arr_tbl = Table([[arrow]], colWidths=[15], rowHeights=[1.5*cm])
                arr_tbl.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "MIDDLE")]))
        
        self.story.append(Spacer(1, 10))
        self.highlight_box("🎯 核心公式：利润 = (客单价 × 转化率) - (获客成本 + 交付成本)", NAVY)

    # ========== 第6页：成本对比 ==========
    def _build_cost_comparison(self):
        self.story.append(PageBreak())
        self.add_slide_header("成本对比：OPC vs 传统创业", "启动成本降低 90%+")
        
        headers = ["成本项", "传统创业", "OPC 模式", "节省比例"]
        data = [
            ["人力成本", "¥50-200 万/年", "$200-500/月\n(AI 订阅)", "↓ 95%+"],
            ["办公成本", "¥10-50 万/年", "¥0\n(居家/咖啡厅)", "↓ 100%"],
            ["设备成本", "¥10-50 万", "¥1-3 万\n(一台电脑)", "↓ 90%+"],
            ["协调成本", "高（会议/沟通）", "低（AI 自动化）", "↓ 80%+"],
            ["启动总成本", "¥70-300 万/年", "¥2-5 万/年", "↓ 90%+"],
        ]
        
        # 构建表格数据
        table_data = [
            [Paragraph(f"<b>{h}</b>", ParagraphStyle("th", fontName="Heiti", fontSize=10.5,
                           textColor=WHITE, alignment=TA_CENTER)) for h in headers]
        ]
        for row in data:
            table_data.append([
                Paragraph(row[0], ParagraphStyle("td0", fontName="Heiti", fontSize=10,
                              textColor=DARK, alignment=TA_LEFT)),
                Paragraph(row[1], ParagraphStyle("td1", fontName="HeitiLight", fontSize=10,
                              textColor=DARK, alignment=TA_CENTER)),
                Paragraph(row[2].replace("\n", "<br/>"), ParagraphStyle("td2", fontName="Heiti",
                              fontSize=10, textColor=DARK, alignment=TA_CENTER)),
                Paragraph(f"<b>{row[3]}</b>", ParagraphStyle("td3", fontName="Heiti", fontSize=11,
                              textColor=GREEN, alignment=TA_CENTER)),
            ])
        
        col_widths = [self.page_width * x for x in [0.25, 0.25, 0.30, 0.20]]
        tbl = Table(table_data, colWidths=col_widths)
        
        style = [
            ("BACKGROUND", (0,0), (-1,0), NAVY),
            ("BACKGROUND", (0,-1), (-1,-1), colors.HexColor("#DCFCE7")),
            ("ROWBACKGROUNDS", (0,1), (-1,-2), [WHITE, LIGHT_BG]),
            ("ALIGN", (0,0), (-1,-1), "CENTER"),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
            ("FONTNAME", (0,0), (-1,0), "Heiti"),
            ("FONTSIZE", (0,0), (-1,-1), 10),
            ("TOPPADDING", (0,0), (-1,-1), 8),
            ("BOTTOMPADDING", (0,0), (-1,-1), 8),
            ("GRID", (0,0), (-1,-1), 0.5, ICE_BLUE),
            ("BOX", (0,0), (-1,-1), 1.5, NAVY),
        ]
        tbl.setStyle(TableStyle(style))
        self.story.append(tbl)
        self.story.append(Spacer(1, 12))
        
        # 两列解读
        left = Paragraph("💡 <b>关键洞察：</b>传统创业的最大成本是<b>人</b>，OPC 的核心优势是用 AI 替代重复性人力",
                        ParagraphStyle("ki", fontName="Heiti", fontSize=10.5, textColor=DARK, leading=16))
        right = Paragraph("⚠️ <b>注意：</b>OPC 不是不要人，而是把人的价值集中在<b>决策和创意</b>上，重复劳动全部外包给 AI",
                         ParagraphStyle("ki2", fontName="Heiti", fontSize=10.5, textColor=DARK, leading=16))
        
        two_col = Table([[left, right]], colWidths=[self.page_width*0.48, self.page_width*0.48],
                        spaceBefore=4)
        two_col.setStyle(TableStyle([
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("BACKGROUND", (0,0), (0,0), colors.HexColor("#EEF2FF")),
            ("BACKGROUND", (1,0), (1,0), colors.HexColor("#FFF7ED")),
            ("LEFTPADDING", (0,0), (-1,-1), 10),
            ("RIGHTPADDING", (0,0), (-1,-1), 10),
            ("TOPPADDING", (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ("BOX", (0,0), (-1,-1), 1, ICE_BLUE),
            ("INNERGRID", (0,0), (-1,-1), 0.5, ICE_BLUE),
        ]))
        self.story.append(two_col)

    # ========== 第7页：现金流结构 ==========
    def _build_cash_flow(self):
        self.story.append(PageBreak())
        self.add_slide_header("现金流结构：70-20-10 反脆弱设计", "收入分配原则 — 不把鸡蛋放在一个篮子里")
        
        # 饼图
        pie_data = [70, 20, 10]
        pie_labels = ["核心产品 (70%)", "新渠道尝试 (20%)", "未来投资 (10%)"]
        
        d = Drawing(W * 0.45, 220)
        
        pc = Pie()
        pc.x = 10
        pc.y = 30
        pc.width = 180
        pc.height = 180
        pc.data = pie_data
        pc.labels = pie_labels
        pc.slices[0].fillColor = NAVY
        pc.slices[1].fillColor = AMBER
        pc.slices[2].fillColor = CORAL
        pc.slices[0].popout = 8
        pc.slices[1].popout = 8
        pc.slices[2].popout = 8
        pc.slices[0].fontName = "Heiti"
        pc.slices[1].fontName = "Heiti"
        pc.slices[2].fontName = "Heiti"
        pc.slices[0].fontSize = 12
        pc.slices[1].fontSize = 12
        pc.slices[2].fontSize = 12
        pc.slices[0].fontColor = WHITE
        pc.slices[1].fontColor = DARK
        pc.slices[2].fontColor = WHITE
        pc.sideLabels = False
        
        d.add(pc)
        
        # 图例
        legend_colors = [NAVY, AMBER, CORAL]
        legend_labels = ["核心产品 - 稳定收入", "新渠道尝试 - 增长探索", "未来投资 - 长期布局"]
        for i, (label, col) in enumerate(zip(legend_labels, legend_colors)):
            legend_y = 180 - i * 22
            d.add(Rect(230, legend_y, 12, 12, fillColor=col, strokeColor=None))
            leg_text = String(248, legend_y + 2, label)
            leg_text.fontName = "HeitiLight"
            leg_text.fontSize = 9
            leg_text.fillColor = DARK
            d.add(leg_text)
        
        self.story.append(d)
        self.story.append(Spacer(1, 14))
        
        # 说明卡片
        details = [
            ("70%", "核心产品收入", "确保生存的稳定现金流\n不创新，不冒险，专注已有产品", NAVY),
            ("20%", "新渠道尝试", "短视频带货、新平台测试\n小成本实验，寻找新增长点", AMBER),
            ("10%", "未来趋势投资", "AI 工具开发、新赛道探索\n为下一个周期做准备", CORAL),
        ]
        
        card_w = (self.page_width - 2*10) / 3
        rows = []
        for pct, title, desc, color in details:
            pct_p = Paragraph(f"<b>{pct}</b>", ParagraphStyle("pct", fontName="Heiti", fontSize=26,
                             textColor=color, alignment=TA_CENTER))
            title_p = Paragraph(f"<b>{title}</b>", ParagraphStyle("ct", fontName="Heiti",
                              fontSize=11, textColor=DARK, alignment=TA_CENTER))
            desc_p = Paragraph(desc.replace("\n", "<br/>"), ParagraphStyle("cd2", fontName="HeitiLight",
                               fontSize=9, textColor=GRAY, alignment=TA_CENTER, leading=14))
            from reportlab.platypus import KeepInFrame
            cell = KeepInFrame(card_w-12, 2.5*cm, [pct_p, Spacer(1,4), title_p, Spacer(1,4), desc_p])
            inner = Table([[cell]], colWidths=[card_w-12])
            inner.setStyle(TableStyle([
                ("ALIGN", (0,0), (-1,-1), "CENTER"),
                ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
                ("TOPPADDING", (0,0), (-1,-1), 10),
                ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ]))
            rows.append([inner])
        
        tbl = Table(rows, colWidths=[card_w]*3)
        tbl.setStyle(TableStyle([
            ("ALIGN", (0,0), (-1,-1), "CENTER"),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("BOX", (0,0), (-1,-1), 1, ICE_BLUE),
            ("INNERGRID", (0,0), (-1,-1), 0.5, ICE_BLUE),
            ("TOPPADDING", (0,0), (-1,-1), 0),
            ("BOTTOMPADDING", (0,0), (-1,-1), 0),
            ("LEFTPADDING", (0,0), (-1,-1), 5),
            ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ]))
        self.story.append(tbl)

    # ========== 第8页：赛道选择 ==========
    def _build_track_selection(self):
        self.story.append(PageBreak())
        self.add_slide_header("赛道选择矩阵", "按「启动难度 × 收入天花板」排列 — 选适合自己的路")
        
        headers = ["赛道方向", "启动难度", "收入上限", "启动成本", "适合人群"]
        data = [
            ["📚 知识付费/培训", "⭐⭐", "¥10-100万/年", "¥0", "有专业技能"],
            ["✍️ 内容创作/自媒体", "⭐⭐", "¥50-500万/年", "¥0", "有内容能力"],
            ["🤖 AI 工具/智能体", "⭐⭐⭐", "¥100-1000万/年", "¥500/月", "有开发能力"],
            ["📦 数字产品（模版/素材）", "⭐⭐", "¥50-500万/年", "¥0", "有设计能力"],
            ["🎯 垂直领域服务", "⭐⭐", "¥50-200万/年", "¥0-5万", "有行业经验"],
            ["🌏 跨境电商", "⭐⭐⭐", "¥500-5000万/年", "¥5-10万", "有供应链资源"],
        ]
        
        table_data = [
            [Paragraph(f"<b>{h}</b>", ParagraphStyle("th2", fontName="Heiti", fontSize=10,
                           textColor=WHITE, alignment=TA_CENTER)) for h in headers]
        ]
        for row in data:
            table_data.append([
                Paragraph(row[0], ParagraphStyle("tr0", fontName="Heiti", fontSize=10,
                              textColor=DARK, alignment=TA_LEFT)),
                Paragraph(row[1], ParagraphStyle("tr1", fontName="Heiti", fontSize=10,
                              textColor=AMBER, alignment=TA_CENTER)),
                Paragraph(f"<b>{row[2]}</b>", ParagraphStyle("tr2", fontName="Heiti", fontSize=10,
                              textColor=GREEN, alignment=TA_CENTER)),
                Paragraph(row[3], ParagraphStyle("tr3", fontName="HeitiLight", fontSize=10,
                              textColor=DARK, alignment=TA_CENTER)),
                Paragraph(row[4], ParagraphStyle("tr4", fontName="HeitiLight", fontSize=9,
                              textColor=GRAY, alignment=TA_CENTER)),
            ])
        
        col_widths = [self.page_width * x for x in [0.26, 0.13, 0.22, 0.17, 0.22]]
        tbl = Table(table_data, colWidths=col_widths)
        tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,0), NAVY),
            ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, LIGHT_BG]),
            ("ALIGN", (0,0), (-1,-1), "CENTER"),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
            ("TOPPADDING", (0,0), (-1,-1), 7),
            ("BOTTOMPADDING", (0,0), (-1,-1), 7),
            ("GRID", (0,0), (-1,-1), 0.5, ICE_BLUE),
            ("BOX", (0,0), (-1,-1), 1.5, NAVY),
        ]))
        self.story.append(tbl)
        self.story.append(Spacer(1, 12))
        
        # 推荐
        rec = Paragraph(
            "🌟 <b>新手推荐从「知识付费」或「数字产品」切入：</b>成本为零，验证快，现金流好。"
            "有技术背景可考虑「AI 工具」，天花板最高。",
            ParagraphStyle("rec", fontName="Heiti", fontSize=10.5, textColor=DARK, leading=17)
        )
        rec_tbl = Table([[rec]], colWidths=[self.page_width])
        rec_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#FEF3C7")),
            ("LEFTPADDING", (0,0), (-1,-1), 14),
            ("RIGHTPADDING", (0,0), (-1,-1), 14),
            ("TOPPADDING", (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ("BOX", (0,0), (-1,-1), 1, AMBER),
        ]))
        self.story.append(rec_tbl)

    # ========== 第9页：启动路线图 ==========
    def _build_roadmap(self):
        self.story.append(PageBreak())
        self.add_slide_header("OPC 启动路线图", "从零到月入 ¥10 万的最快路径", CORAL)
        
        phases = [
            ("第 0 阶段", "准备", "1 周", [
                "✅ 注册一人有限公司",
                "✅ 开通 AI 工具订阅",
                "✅ 确定细分赛道方向",
            ], NAVY),
            ("第 1 阶段", "MVP 验证", "2-4 周", [
                "✅ 快速上线第一个产品",
                "✅ 获得 10 个付费用户",
                "✅ 验证真实市场需求",
            ], colors.HexColor("#3B82F6")),
            ("第 2 阶段", "产品化", "1-3 月", [
                "✅ 建立自动化交付流程",
                "✅ 开始系统化内容营销",
                "✅ 月入 ¥5K-2 万",
            ], AMBER),
            ("第 3 阶段", "规模化", "3-6 月", [
                "✅ 扩展产品线",
                "✅ 开拓新获客渠道",
                "✅ 月入 ¥2 万-10 万",
            ], GREEN),
        ]
        
        phase_w = (self.page_width - 3*15) / 4
        
        for i, (phase, title, time, tasks, color) in enumerate(phases, 1):
            # 顶部色块
            header_p = Paragraph(f"<b>{phase}</b>", ParagraphStyle("ph", fontName="HeitiLight",
                              fontSize=8.5, textColor=WHITE, alignment=TA_CENTER))
            title_p = Paragraph(f"<b>{title}</b>", ParagraphStyle("pt", fontName="Heiti",
                              fontSize=16, textColor=WHITE, alignment=TA_CENTER))
            time_p = Paragraph(f"⏱ {time}", ParagraphStyle("ptm", fontName="Heiti",
                              fontSize=9, textColor=WHITE, alignment=TA_CENTER))
            
            header_tbl = Table([[header_p], [title_p], [time_p]],
                             colWidths=[phase_w], rowHeights=[0.4*cm, 0.7*cm, 0.4*cm])
            header_tbl.setStyle(TableStyle([
                ("BACKGROUND", (0,0), (-1,-1), color),
                ("ALIGN", (0,0), (-1,-1), "CENTER"),
                ("TOPPADDING", (0,0), (-1,-1), 3),
                ("BOTTOMPADDING", (0,0), (-1,-1), 3),
            ]))
            
            task_ps = []
            for task in tasks:
                task_ps.append(Paragraph(task, ParagraphStyle("task", fontName="HeitiLight",
                                       fontSize=9.5, textColor=DARK, leading=15, spaceAfter=3)))
            
            from reportlab.platypus import KeepInFrame
            tasks_frame = KeepInFrame(phase_w, 3*cm, task_ps)
            tasks_tbl = Table([[tasks_frame]], colWidths=[phase_w])
            tasks_tbl.setStyle(TableStyle([
                ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
                ("LEFTPADDING", (0,0), (-1,-1), 8),
                ("RIGHTPADDING", (0,0), (-1,-1), 8),
                ("TOPPADDING", (0,0), (-1,-1), 8),
                ("BOTTOMPADDING", (0,0), (-1,-1), 8),
            ]))
            
            full_tbl = Table([[header_tbl], [tasks_tbl]], colWidths=[phase_w])
            full_tbl.setStyle(TableStyle([
                ("ALIGN", (0,0), (-1,-1), "CENTER"),
                ("TOPPADDING", (0,0), (-1,-1), 0),
                ("BOTTOMPADDING", (0,0), (-1,-1), 0),
                ("LEFTPADDING", (0,0), (-1,-1), 3),
                ("RIGHTPADDING", (0,0), (-1,-1), 3),
            ]))
            
            self.story.append(full_tbl)
            
            if i < 4:
                arrow = Paragraph("→", ParagraphStyle("arr2", fontName="Heiti", fontSize=20,
                                textColor=ICE_BLUE, alignment=TA_CENTER))
                self.story.append(Paragraph("", self.styles["body"]))
        
        self.story.append(Spacer(1, 8))
        self.highlight_box("⏰ 关键原则：每个阶段设置明确的「通过标准」，达不到就快速调整方向", NAVY)

    # ========== 第10页：工具栈 ==========
    def _build_tools(self):
        self.story.append(PageBreak())
        self.add_slide_header("OPC 核心工具栈", "月费 ¥200 以内，覆盖 90% 工作场景")
        
        tools = [
            ("🤖 AI 对话/写作", [
                "ChatGPT Plus — $20/月",
                "Claude Pro — $20/月",
                "DeepSeek — ¥10/月（国产）",
            ], NAVY),
            ("🎨 AI 设计/图片", [
                "Midjourney — $10-30/月",
                "Canva AI — 免费",
                "Stable Diffusion — 免费（本地）",
            ], colors.HexColor("#EC4899")),
            ("🎬 AI 视频/音频", [
                "Runway — $12/月",
                "ElevenLabs — $5/月",
                "CapCut — 免费",
            ], colors.HexColor("#8B5CF6")),
            ("🔧 智能体平台", [
                "扣子 Coze — 免费",
                "Dify — 免费/付费（自托管）",
                "n8n — 免费（自托管）",
            ], AMBER),
            ("📊 办公/协作", [
                "Notion AI — $10/月",
                "飞书 — 免费",
                "钉钉 — 免费",
            ], colors.HexColor("#3B82F6")),
            ("💳 支付/交付", [
                "微信支付/支付宝",
                "Gumroad（海外）",
                "面包多/小鹅通（国内）",
            ], GREEN),
        ]
        
        card_w = (self.page_width - 2*10) / 3
        card_h = 2.8*cm
        
        rows = []
        for i in range(0, len(tools), 3):
            row = []
            for j in range(3):
                if i+j < len(tools):
                    name, items, color = tools[i+j]
                    name_p = Paragraph(f"<b>{name}</b>", ParagraphStyle("tn", fontName="Heiti",
                                       fontSize=10, textColor=color))
                    item_ps = [Paragraph(f"• {item}", ParagraphStyle("ti", fontName="HeitiLight",
                                          fontSize=9, textColor=DARK, leading=14)) for item in items]
                    from reportlab.platypus import KeepInFrame
                    cell = KeepInFrame(card_w-12, card_h-16, [name_p, Spacer(1,4)] + item_ps)
                    inner = Table([[cell]], colWidths=[card_w-12])
                    inner.setStyle(TableStyle([
                        ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
                        ("LEFTPADDING", (0,0), (-1,-1), 10),
                        ("TOPPADDING", (0,0), (-1,-1), 8),
                        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
                        ("LINEABOVE", (0,0), (-1,0), 3, color),
                    ]))
                    row.append(inner)
                else:
                    row.append(Spacer(1, 1))
            rows.append(row)
        
        tbl = Table(rows, colWidths=[card_w]*3)
        tbl.setStyle(TableStyle([
            ("ALIGN", (0,0), (-1,-1), "LEFT"),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("BOX", (0,0), (-1,-1), 1, ICE_BLUE),
            ("INNERGRID", (0,0), (-1,-1), 0.5, ICE_BLUE),
            ("TOPPADDING", (0,0), (-1,-1), 5),
            ("BOTTOMPADDING", (0,0), (-1,-1), 5),
            ("LEFTPADDING", (0,0), (-1,-1), 5),
            ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ]))
        self.story.append(tbl)
        self.story.append(Spacer(1, 10))
        
        cost_summary = Paragraph(
            "💰 <b>总月费参考：</b>全套 AI 工具 ≈ ¥200-800/月 ≈ 一顿朋友聚餐，"
            "却能替代月薪 ¥10,000+ 的重复性工作。",
            ParagraphStyle("cs", fontName="Heiti", fontSize=10.5, textColor=DARK, leading=17)
        )
        cs_tbl = Table([[cost_summary]], colWidths=[self.page_width])
        cs_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
            ("LEFTPADDING", (0,0), (-1,-1), 14),
            ("TOPPADDING", (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ("BOX", (0,0), (-1,-1), 1, GREEN),
        ]))
        self.story.append(cs_tbl)

    # ========== 第11页：成功公式 ==========
    def _build_formula(self):
        self.story.append(PageBreak())
        self.add_slide_header("OPC 成功公式", "把四件事同时做好，缺一不可", CORAL)
        
        # 大公式
        formula_p = Paragraph(
            "<b>成功 = 细分赛道 × AI 杠杆 × 自动化闭环 × 快速迭代</b>",
            ParagraphStyle("fml", fontName="Heiti", fontSize=16, textColor=WHITE,
                           alignment=TA_CENTER, leading=24)
        )
        fml_tbl = Table([[formula_p]], colWidths=[self.page_width])
        fml_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), NAVY),
            ("TOPPADDING", (0,0), (-1,-1), 16),
            ("BOTTOMPADDING", (0,0), (-1,-1), 16),
        ]))
        self.story.append(fml_tbl)
        self.story.append(Spacer(1, 16))
        
        # 四个要素
        elements = [
            ("🎯", "细分赛道", "足够小但付费意愿强\n宁做鸡头，不做凤尾", NAVY),
            ("🚀", "AI 杠杆", "个人能力放大 10 倍\nAI 是你最强的合伙人", AMBER),
            ("🔄", "自动化闭环", "获客到交付全自动\n睡觉时也在赚钱", GREEN),
            ("⚡", "快速迭代", "2 周验证，不行就换\n速度是最大的竞争优势", colors.HexColor("#8B5CF6")),
        ]
        
        card_w = (self.page_width - 3*12) / 4
        
        for emoji, title, desc, color in elements:
            icon_p = Paragraph(emoji, ParagraphStyle("ic", fontName="Heiti", fontSize=32, alignment=TA_CENTER))
            title_p = Paragraph(f"<b>{title}</b>", ParagraphStyle("et", fontName="Heiti",
                              fontSize=12, textColor=color, alignment=TA_CENTER))
            desc_p = Paragraph(desc.replace("\n", "<br/>"), ParagraphStyle("ed", fontName="HeitiLight",
                               fontSize=9, textColor=GRAY, alignment=TA_CENTER, leading=14))
            
            from reportlab.platypus import KeepInFrame
            cell_content = [icon_p, Spacer(1,6), title_p, Spacer(1,6), desc_p]
            cell = KeepInFrame(card_w-8, 3.5*cm, cell_content)
            
            tbl = Table([[cell]], colWidths=[card_w])
            tbl.setStyle(TableStyle([
                ("ALIGN", (0,0), (-1,-1), "CENTER"),
                ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
                ("BOX", (0,0), (-1,-1), 2, color),
                ("TOPPADDING", (0,0), (-1,-1), 14),
                ("BOTTOMPADDING", (0,0), (-1,-1), 14),
            ]))
            self.story.append(tbl)

    # ========== 第12页：行动号召 ==========
    def _build_cta(self):
        self.story.append(PageBreak())
        
        # 全页深色背景
        cta_content = [
            Spacer(1, 2*cm),
            Paragraph("开始你的 OPC 之旅", ParagraphStyle("cta1", fontName="Heiti", fontSize=36,
                                textColor=WHITE, alignment=TA_CENTER, leading=44)),
            Spacer(1, 0.5*cm),
            Paragraph("选择一个细分赛道，用 AI 把个人能力放大 10 倍",
                      ParagraphStyle("cta2", fontName="HeitiLight", fontSize=14,
                                      textColor=ICE_BLUE, alignment=TA_CENTER, leading=20)),
            Spacer(1, 1.5*cm),
        ]
        
        actions = [
            ("① 注册一人有限公司", "最快 3 天拿证，成本 ¥500 起"),
            ("② 开通 AI 工具订阅", "ChatGPT + Claude，月费 $40 ≈ ¥300"),
            ("③ 2 周内上线 MVP", "不要等到完美，先跑通最小闭环"),
        ]
        
        action_w = (self.page_width - 2*15) / 3
        for text, sub in actions:
            text_p = Paragraph(f"<b>{text}</b>", ParagraphStyle("act", fontName="Heiti", fontSize=13,
                               textColor=WHITE, alignment=TA_CENTER))
            sub_p = Paragraph(sub, ParagraphStyle("actsub", fontName="HeitiLight", fontSize=9,
                             textColor=ICE_BLUE, alignment=TA_CENTER))
            from reportlab.platypus import KeepInFrame
            cell = KeepInFrame(action_w-16, 1.5*cm, [text_p, Spacer(1,4), sub_p])
            inner = Table([[cell]], colWidths=[action_w-16])
            inner.setStyle(TableStyle([
                ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#334155")),
                ("ALIGN", (0,0), (-1,-1), "CENTER"),
                ("TOPPADDING", (0,0), (-1,-1), 12),
                ("BOTTOMPADDING", (0,0), (-1,-1), 12),
            ]))
            cta_content.append(inner)
        
        from reportlab.platypus import KeepInFrame
        frame = KeepInFrame(self.page_width, H - 4*cm, cta_content, hAlign="CENTER")
        tbl = Table([[frame]], colWidths=[self.page_width])
        tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), NAVY),
            ("ALIGN", (0,0), (-1,-1), "CENTER"),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ]))
        self.story.append(tbl)
        
        # 底部金句
        sep = Table([[HRFlowable(width="40%", thickness=2, color=CORAL, hAlign="CENTER")]],
                    colWidths=[self.page_width])
        sep.setStyle(TableStyle([("ALIGN", (0,0), (-1,-1), "CENTER"),
                                  ("TOPPADDING", (0,0), (-1,-1), 8),
                                  ("BOTTOMPADDING", (0,0), (-1,-1), 8)]))
        self.story.append(sep)
        
        footer = Paragraph(
            "2026 年，<font color='#F96167'><b>一个人也可以是一支队伍</b></font>",
            ParagraphStyle("ft", fontName="Heiti", fontSize=12, textColor=ICE_BLUE, alignment=TA_CENTER)
        )
        self.story.append(footer)
        self.story.append(Spacer(1, 0.5*cm))
        credit = Paragraph("由 qclaw AI 整理 · OpenClaw Agent",
                           ParagraphStyle("cr", fontName="HeitiLight", fontSize=9, textColor=GRAY, alignment=TA_CENTER))
        self.story.append(credit)


# ========== 主程序 ==========
if __name__ == "__main__":
    output = "/Users/xiaoxiami/.qclaw/workspace/OPC-AI轻量化创业模式.pdf"
    generator = OPCPDFGenerator(output)
    generator.build()
    print(f"文件已保存: {output}")
