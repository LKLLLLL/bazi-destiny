import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['PingFang SC', 'SimHei', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False

# ===== 数据 =====
# 全球市场
years = ['2022', '2023', '2024', '2025E']
global_market = [6.5, 7.2, 7.9, 9.0]  # 万亿美元

# 美国数据
us_total = [1.03, 1.12, 1.22, 1.33]  # 万亿美元
us_cross = [155, 179, 207, 240]  # 十亿美元

# 欧洲国家
eu_countries = ['UK', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Poland']
eu_market = [2480, 1850, 1590, 870, 760, 430, 380]  # 亿欧元

# 平台份额
platforms = ['Amazon', 'Walmart', 'Apple', 'eBay', 'Target', 'Others']
platform_share = [37.6, 6.4, 3.6, 3.5, 2.1, 46.8]

# 中国出海平台
china_platforms = ['Temu', 'SHEIN', 'TikTok', 'AliExpress']
china_gmv = [350, 450, 300, 280]  # 亿美元

# ===== 图表 =====
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('欧美跨境电商市场数据报告 2024-2025', fontsize=16, fontweight='bold')

# 1. 全球市场规模
ax1 = axes[0, 0]
bars1 = ax1.bar(years, global_market, color=['#1E3A5F', '#2E86AB', '#4A90D9', '#6BB3F0'])
ax1.set_title('全球跨境电商市场规模', fontsize=12, fontweight='bold')
ax1.set_ylabel('万亿美元')
for bar, val in zip(bars1, global_market):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, f'{val}', ha='center', fontsize=10)

# 2. 美国平台份额
ax2 = axes[0, 1]
colors = ['#E94F37', '#F4A261', '#2A9D8F', '#264653', '#E9C46A', '#CCCCCC']
wedges, texts, autotexts = ax2.pie(platform_share, labels=platforms, autopct='%1.1f%%', colors=colors, startangle=90)
ax2.set_title('美国电商平台市场份额 (2024)', fontsize=12, fontweight='bold')

# 3. 欧洲国家电商规模
ax3 = axes[1, 0]
bars3 = ax3.barh(eu_countries, eu_market, color='#2E86AB')
ax3.set_title('欧洲主要国家电商规模 (2024)', fontsize=12, fontweight='bold')
ax3.set_xlabel('亿欧元')
for bar, val in zip(bars3, eu_market):
    ax3.text(val + 30, bar.get_y() + bar.get_height()/2, f'{val}', va='center', fontsize=9)

# 4. 中国出海平台GMV
ax4 = axes[1, 1]
bars4 = ax4.bar(china_platforms, china_gmv, color=['#E94F37', '#F4A261', '#2A9D8F', '#264653'])
ax4.set_title('中国跨境平台GMV (2024)', fontsize=12, fontweight='bold')
ax4.set_ylabel('亿美元')
for bar, val in zip(bars4, china_gmv):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 10, f'${val}', ha='center', fontsize=10)

plt.tight_layout()
plt.savefig('/Users/xiaoxiami/.qclaw/workspace/欧美跨境电商数据图表.png', dpi=150, bbox_inches='tight')
print("图表生成完成!")

# ===== Excel报表 =====
with pd.ExcelWriter('/Users/xiaoxiami/.qclaw/workspace/欧美跨境电商数据报表.xlsx', engine='openpyxl') as writer:
    # 总览
    pd.DataFrame({'年份': years, '市场规模(万亿美元)': global_market}).to_excel(writer, sheet_name='全球概览', index=False)
    
    # 美国
    pd.DataFrame({'年份': ['2022','2023','2024','2025E'], 
                  '电商总规模(万亿美元)': us_total, 
                  '跨境规模(十亿美元)': us_cross}).to_excel(writer, sheet_name='美国市场', index=False)
    pd.DataFrame({'平台': platforms, '市场份额(%)': platform_share}).to_excel(writer, sheet_name='美国市场', startrow=6, index=False)
    
    # 欧洲
    pd.DataFrame({'国家': eu_countries, '电商规模(亿欧元)': eu_market}).to_excel(writer, sheet_name='欧洲市场', index=False)
    
    # 中国出海
    pd.DataFrame({'平台': china_platforms, 'GMV(亿美元)': china_gmv}).to_excel(writer, sheet_name='中国出海', index=False)

print("Excel报表生成完成!")
