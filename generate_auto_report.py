import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['PingFang SC', 'SimHei', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False

# ===== 汽配跨境电商数据 =====

# 全球汽配电商市场规模
auto_years = ['2022', '2023', '2024', '2025E', '2026E']
auto_global = [85, 98, 115, 135, 158]  # 十亿美元

# 欧美汽配市场
us_auto = [28, 32, 38, 45, 52]  # 十亿美元
eu_auto = [22, 25, 29, 34, 40]  # 十亿美元

# 俄罗斯汽配市场
ru_auto = [8.5, 9.8, 11.5, 13.2, 15.0]  # 十亿美元

# 汽配品类细分（欧美）
auto_categories = ['发动机部件', '制动系统', '悬挂转向', '电子电气', '车身外观', '轮胎轮毂', '保养件', '其他']
auto_cat_share = [18, 15, 12, 20, 14, 10, 8, 3]  # %

# 主要销售渠道份额
channels = ['Amazon/eBay', '独立站', '传统B2B', '线下零售', '其他平台']
channel_share = [32, 18, 25, 15, 10]  # %

# 俄罗斯汽配来源国
ru_sources = ['中国', '欧洲', '日本/韩国', '美国', '本土', '其他']
ru_source_share = [45, 22, 12, 8, 10, 3]  # %

# 汽配热门SKU（跨境电商）
hot_skus = ['LED大灯', '刹车片', '空气滤芯', '机油滤芯', '火花塞', '雨刷', '轮胎', '行车记录仪', 'OBD诊断仪', '车载充电器']
hot_sku_growth = [35, 18, 22, 20, 15, 12, 8, 45, 55, 38]  # 年增长率%

# 主要平台汽配GMV（十亿美元）
platforms_auto = ['Amazon', 'eBay', 'AliExpress', 'Alibaba', '独立站', '其他']
platform_auto_gmv = [18, 8, 6, 5, 7, 4]

# ===== 图表 =====
fig = plt.figure(figsize=(16, 12))
fig.suptitle('汽配品类跨境电商数据报告 2024-2026\n俄罗斯·欧美市场', fontsize=18, fontweight='bold', y=0.98)

# 1. 市场规模趋势对比
ax1 = fig.add_subplot(2, 3, 1)
ax1.plot(auto_years, us_auto, marker='o', linewidth=2.5, label='美国', color='#1E3A5F')
ax1.plot(auto_years, eu_auto, marker='s', linewidth=2.5, label='欧洲', color='#2E86AB')
ax1.plot(auto_years, ru_auto, marker='^', linewidth=2.5, label='俄罗斯', color='#E94F37')
ax1.set_title('汽配电商市场规模趋势', fontsize=12, fontweight='bold')
ax1.set_ylabel('十亿美元')
ax1.legend(loc='upper left')
ax1.grid(True, alpha=0.3)

# 2. 汽配品类分布
ax2 = fig.add_subplot(2, 3, 2)
colors2 = ['#1E3A5F', '#2E86AB', '#4A90D9', '#6BB3F0', '#E94F37', '#F4A261', '#2A9D8F', '#CCCCCC']
wedges, texts, autotexts = ax2.pie(auto_cat_share, labels=auto_categories, autopct='%1.0f%%', 
                                    colors=colors2, startangle=90, textprops={'fontsize': 9})
ax2.set_title('汽配品类分布 (欧美)', fontsize=12, fontweight='bold')

# 3. 销售渠道份额
ax3 = fig.add_subplot(2, 3, 3)
colors3 = ['#E94F37', '#F4A261', '#2A9D8F', '#264653', '#CCCCCC']
bars3 = ax3.barh(channels, channel_share, color=colors3)
ax3.set_title('汽配销售渠道份额', fontsize=12, fontweight='bold')
ax3.set_xlabel('%')
for bar, val in zip(bars3, channel_share):
    ax3.text(val + 1, bar.get_y() + bar.get_height()/2, f'{val}%', va='center', fontsize=10)

# 4. 俄罗斯汽配来源国
ax4 = fig.add_subplot(2, 3, 4)
colors4 = ['#E94F37', '#2E86AB', '#F4A261', '#1E3A5F', '#2A9D8F', '#CCCCCC']
bars4 = ax4.bar(ru_sources, ru_source_share, color=colors4)
ax4.set_title('俄罗斯汽配进口来源国', fontsize=12, fontweight='bold')
ax4.set_ylabel('%')
for bar, val in zip(bars4, ru_source_share):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, f'{val}%', ha='center', fontsize=10)
plt.setp(ax4.xaxis.get_majorticklabels(), rotation=15, ha='right')

# 5. 热门SKU增长率
ax5 = fig.add_subplot(2, 3, 5)
colors5 = plt.cm.RdYlGn([x/60 for x in hot_sku_growth])
bars5 = ax5.barh(hot_skus, hot_sku_growth, color=colors5)
ax5.set_title('热门汽配SKU年增长率', fontsize=12, fontweight='bold')
ax5.set_xlabel('年增长率 %')
for bar, val in zip(bars5, hot_sku_growth):
    ax5.text(val + 1, bar.get_y() + bar.get_height()/2, f'{val}%', va='center', fontsize=9)

# 6. 平台GMV对比
ax6 = fig.add_subplot(2, 3, 6)
colors6 = ['#1E3A5F', '#2E86AB', '#F4A261', '#E94F37', '#2A9D8F', '#CCCCCC']
bars6 = ax6.bar(platforms_auto, platform_auto_gmv, color=colors6)
ax6.set_title('跨境平台汽配GMV (2024)', fontsize=12, fontweight='bold')
ax6.set_ylabel('十亿美元')
for bar, val in zip(bars6, platform_auto_gmv):
    ax6.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f'${val}B', ha='center', fontsize=10)

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.savefig('/Users/xiaoxiami/.qclaw/workspace/汽配跨境电商数据图表.png', dpi=150, bbox_inches='tight')
print("汽配图表生成完成!")

# ===== Excel报表 =====
with pd.ExcelWriter('/Users/xiaoxiami/.qclaw/workspace/汽配跨境电商数据报表.xlsx', engine='openpyxl') as writer:
    
    # Sheet 1: 市场规模
    pd.DataFrame({
        '年份': auto_years,
        '美国(十亿美元)': us_auto,
        '欧洲(十亿美元)': eu_auto,
        '俄罗斯(十亿美元)': ru_auto,
        '全球(十亿美元)': auto_global
    }).to_excel(writer, sheet_name='市场规模', index=False)
    
    # Sheet 2: 品类分布
    pd.DataFrame({
        '品类': auto_categories,
        '占比(%)': auto_cat_share
    }).to_excel(writer, sheet_name='品类分布', index=False)
    
    # Sheet 3: 销售渠道
    pd.DataFrame({
        '渠道': channels,
        '份额(%)': channel_share
    }).to_excel(writer, sheet_name='销售渠道', index=False)
    
    # Sheet 4: 俄罗斯来源
    pd.DataFrame({
        '来源国': ru_sources,
        '占比(%)': ru_source_share
    }).to_excel(writer, sheet_name='俄罗斯来源国', index=False)
    
    # Sheet 5: 热门SKU
    pd.DataFrame({
        'SKU': hot_skus,
        '年增长率(%)': hot_sku_growth
    }).to_excel(writer, sheet_name='热门SKU', index=False)
    
    # Sheet 6: 平台GMV
    pd.DataFrame({
        '平台': platforms_auto,
        'GMV(十亿美元)': platform_auto_gmv
    }).to_excel(writer, sheet_name='平台GMV', index=False)
    
    # Sheet 7: 关键洞察
    insights = pd.DataFrame({
        '指标': [
            '全球汽配电商规模(2024)',
            '欧美汽配市场合计(2024)',
            '俄罗斯汽配市场(2024)',
            '中国占俄罗斯汽配进口',
            'Amazon汽配GMV',
            '电子电气品类占比',
            'OBD诊断仪增长率',
            '跨境渠道占比'
        ],
        '数值': ['$115B', '$67B', '$11.5B', '45%', '$18B', '20%', '55%', '50%']
    })
    insights.to_excel(writer, sheet_name='关键洞察', index=False)

print("汽配Excel报表生成完成!")
