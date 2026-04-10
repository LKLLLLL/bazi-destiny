import xlsxwriter

workbook = xlsxwriter.Workbook('/Users/xiaoxiami/.qclaw/workspace/欧美跨境电商数据报表.xlsx')

# ===== 格式 =====
header_fmt = workbook.add_format({'bold': True, 'bg_color': '#1E3A5F', 'font_color': 'white', 'border': 1, 'align': 'center'})
title_fmt = workbook.add_format({'bold': True, 'font_size': 16, 'font_color': '#1E3A5F'})
sub_fmt = workbook.add_format({'bold': True, 'font_size': 12, 'bg_color': '#E8F0FE', 'border': 1})
num_fmt = workbook.add_format({'num_format': '$#,##0', 'border': 1})
pct_fmt = workbook.add_format({'num_format': '0.0%', 'border': 1})
normal_fmt = workbook.add_format({'border': 1, 'align': 'left'})

# ===== Sheet 1: 总览 =====
ws1 = workbook.add_worksheet('全球概览')
ws1.set_column('A:D', 20)
ws1.set_row(0, 30)

ws1.write('A1', '全球跨境电商市场规模 (万亿美元)', title_fmt)
ws1.merge_range('A1:D1', '全球跨境电商市场规模', title_fmt)

# 数据
overview_data = [
    ['年份', '市场规模(万亿美元)', '同比增长', '跨境用户(亿人)'],
    ['2022', 6.5, '12%', 19.5],
    ['2023', 7.2, '10.8%', 20.8],
    ['2024', 7.9, '9.7%', 22.0],
    ['2025E', 9.0, '13.9%', 23.5],
]

for i, row in enumerate(overview_data):
    for j, val in enumerate(row):
        if i == 0:
            ws1.write(i+2, j, val, header_fmt)
        else:
            ws1.write(i+2, j, val, normal_fmt if j == 0 else num_fmt if j in [1,3] else normal_fmt)

# 图表1: 市场规模趋势
chart1 = workbook.add_chart({'type': 'column'})
chart1.add_series({'name': '市场规模', 'categories': '=全球概览!A5:A8', 'values': '=全球概览!B5:B8', 'fill': {'color': '#1E3A5F'}})
chart1.set_title({'name': '全球跨境电商市场规模趋势'})
chart1.set_x_axis({'name': '年份'})
chart1.set_y_axis({'name': '万亿美元'})
ws1.insert_chart('F3', chart1, {'x_offset': 10, 'y_offset': 10})

# ===== Sheet 2: 美国市场 =====
ws2 = workbook.add_worksheet('美国市场')
ws2.set_column('A:E', 18)

ws2.write('A1', '美国电商与跨境电商规模', title_fmt)
ws2.merge_range('A1:E1', '美国电商与跨境电商规模', title_fmt)

us_data = [
    ['年份', '电商总规模(万亿美元)', '跨境占比', '跨境规模(十亿美元)', '同比增长'],
    ['2022', 1.03, '15%', 155, '8%'],
    ['2023', 1.12, '16%', 179, '15%'],
    ['2024', 1.22, '17%', 207, '16%'],
    ['2025E', 1.33, '18%', 240, '16%'],
]

for i, row in enumerate(us_data):
    for j, val in enumerate(row):
        if i == 0:
            ws2.write(i+2, j, val, header_fmt)
        else:
            ws2.write(i+2, j, val, normal_fmt if j == 0 else num_fmt)

# 美国平台份额
ws2.write('A9', '主要电商平台市场份额 (2024)', sub_fmt)
ws2.merge_range('A9:E9', '主要电商平台市场份额 (2024)', sub_fmt)

platform_data = [
    ['平台', '市场份额'],
    ['Amazon', 37.6],
    ['Walmart', 6.4],
    ['Apple', 3.6],
    ['eBay', 3.5],
    ['Target', 2.1],
    ['其他', 46.8],
]

for i, row in enumerate(platform_data):
    for j, val in enumerate(row):
        if i == 0:
            ws2.write(i+10, j, val, header_fmt)
        else:
            ws2.write(i+10, j, val, normal_fmt)

# 图表2: 平台份额饼图
chart2 = workbook.add_chart({'type': 'pie'})
chart2.add_series({'name': '市场份额', 'categories': '=美国市场!A11:A16', 'values': '=美国市场!B11:B16'})
chart2.set_title({'name': '美国电商平台市场份额 (2024)'})
ws2.insert_chart('D10', chart2, {'x_offset': 10, 'y_offset': 10})

# 美国热门品类
ws2.write('A20', '美国跨境购物热门品类', sub_fmt)
ws2.merge_range('A20:E20', '美国跨境购物热门品类', sub_fmt)

category_data = [
    ['品类', '占比'],
    ['电子产品', 28],
    ['服装鞋类', 22],
    ['美妆个护', 14],
    ['家居园艺', 11],
    ['运动户外', 9],
    ['玩具婴童', 7],
    ['其他', 9],
]

for i, row in enumerate(category_data):
    for j, val in enumerate(row):
        if i == 0:
            ws2.write(i+21, j, val, header_fmt)
        else:
            ws2.write(i+21, j, val, normal_fmt)

# ===== Sheet 3: 欧洲市场 =====
ws3 = workbook.add_worksheet('欧洲市场')
ws3.set_column('A:D', 20)

ws3.write('A1', '欧洲主要国家电商规模 (2024)', title_fmt)
ws3.merge_range('A1:D1', '欧洲主要国家电商规模 (2024)', title_fmt)

eu_data = [
    ['国家', '电商规模(亿欧元)', '同比增长', '跨境渗透率'],
    ['英国', 2480, '9%', '55%'],
    ['德国', 1850, '8%', '48%'],
    ['法国', 1590, '7%', '42%'],
    ['西班牙', 870, '11%', '38%'],
    ['意大利', 760, '6%', '35%'],
    ['荷兰', 430, '7%', '52%'],
    ['波兰', 380, '12%', '44%'],
]

for i, row in enumerate(eu_data):
    for j, val in enumerate(row):
        if i == 0:
            ws3.write(i+2, j, val, header_fmt)
        else:
            ws3.write(i+2, j, val, normal_fmt if j == 0 else num_fmt)

# 图表3: 欧洲国家电商规模
chart3 = workbook.add_chart({'type': 'bar'})
chart3.add_series({'name': '电商规模', 'categories': '=欧洲市场!A3:A9', 'values': '=欧洲市场!B3:B9', 'fill': {'color': '#2E86AB'}})
chart3.set_title({'name': '欧洲主要国家电商规模 (2024)'})
chart3.set_x_axis({'name': '亿欧元'})
ws3.insert_chart('F3', chart3, {'x_offset': 10, 'y_offset': 10})

# ===== Sheet 4: 中国出海 =====
ws4 = workbook.add_worksheet('中国出海平台')
ws4.set_column('A:D', 22)

ws4.write('A1', '中国跨境电商平台数据 (2024)', title_fmt)
ws4.merge_range('A1:D1', '中国跨境电商平台数据 (2024)', title_fmt)

china_data = [
    ['平台', 'GMV(亿美元)', '特点', '用户量'],
    ['Temu', 350, '低价闪电扩张', '美国月活1.3亿'],
    ['SHEIN', 450, '快时尚龙头', '全球数亿'],
    ['TikTok Shop', 300, '内容电商', '全球快速起量'],
    ['AliExpress', 280, '老牌平台', '欧美覆盖广'],
]

for i, row in enumerate(china_data):
    for j, val in enumerate(row):
        if i == 0:
            ws4.write(i+2, j, val, header_fmt)
        else:
            ws4.write(i+2, j, val, normal_fmt)

# 图表4: GMV对比
chart4 = workbook.add_chart({'type': 'column'})
chart4.add_series({'name': 'GMV', 'categories': '=中国出海平台!A3:A6', 'values': '=中国出海平台!B3:B6', 'fill': {'color': '#E94F37'}})
chart4.set_title({'name': '中国跨境平台GMV对比 (2024)'})
chart4.set_y_axis({'name': '亿美元'})
ws4.insert_chart('F3', chart4, {'x_offset': 10, 'y_offset': 10})

# ===== Sheet 5: 趋势与机会 =====
ws5 = workbook.add_worksheet('趋势与机会')
ws5.set_column('A:C', 25)

ws5.write('A1', '2025年市场趋势与机会品类', title_fmt)
ws5.merge_range('A1:C1', '2025年市场趋势与机会品类', title_fmt)

trend_data = [
    ['类别', '项目', '说明'],
    ['监管趋势', '美国De Minimis收紧', '$800免税门槛面临调整'],
    ['', '欧盟DSA/DMA', '数字服务法全面实施'],
    ['', 'VAT合规', 'OSS一站式申报成标配'],
    ['消费趋势', '移动端购物', '欧美移动端占比超60%'],
    ['', '社交电商', 'TikTok/Instagram快速增长'],
    ['', '可持续消费', '环保包装关注度提升'],
    ['机会品类', '宠物用品', '欧美年增10%+'],
    ['', '健康保健品', '后疫情需求旺盛'],
    ['', '智能家居', '渗透率快速提升'],
    ['', '户外露营', '疫情后热潮延续'],
    ['', '个性化定制品', '高溢价竞争小'],
]

for i, row in enumerate(trend_data):
    for j, val in enumerate(row):
        if i == 0:
            ws5.write(i+2, j, val, header_fmt)
        else:
            ws5.write(i+2, j, val, normal_fmt)

workbook.close()
print("Excel报表生成完成!")
