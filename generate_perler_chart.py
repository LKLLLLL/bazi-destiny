import matplotlib.pyplot as plt
import numpy as np

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

fig = plt.figure(figsize=(16, 12), facecolor='#FFF5F5')

# 1. 全球市场规模趋势
ax1 = fig.add_subplot(2, 3, 1)
years = ['2022', '2023', '2024', '2025E', '2026E', '2027E', '2028E', '2029E', '2030E']
market_size = [280, 310, 400, 450, 500, 560, 620, 690, 750]  # 百万美元
ax1.plot(years, market_size, marker='o', linewidth=2.5, markersize=8, color='#FF6B6B')
ax1.fill_between(years, market_size, alpha=0.3, color='#FF6B6B')
ax1.set_title('全球拼豆市场规模趋势', fontsize=12, fontweight='bold', pad=10)
ax1.set_ylabel('市场规模（百万美元）')
ax1.grid(True, alpha=0.3)
for i, v in enumerate(market_size):
    if i % 2 == 0:
        ax1.annotate(f'${v}M', (years[i], v), textcoords="offset points", xytext=(0,10), ha='center', fontsize=8)

# 2. 区域市场份额
ax2 = fig.add_subplot(2, 3, 2)
regions = ['北美', '欧洲', '亚太', '其他']
shares = [37, 27, 23, 13]
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
wedges, texts, autotexts = ax2.pie(shares, labels=regions, autopct='%1.0f%%', colors=colors, 
                                   explode=(0.05, 0, 0, 0), shadow=True)
ax2.set_title('全球区域市场份额', fontsize=12, fontweight='bold', pad=10)

# 3. 品牌竞争格局
ax3 = fig.add_subplot(2, 3, 3)
brands = ['Perler\n(美国)', 'Hama\n(丹麦)', 'Pyssla\n(宜家)', 'Artkal\n(中国)', 'Nabbi\n(日本)', '其他']
brand_shares = [30, 25, 15, 10, 8, 12]
colors_brand = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFD93D', '#6BCB77', '#B4A7D6']
bars = ax3.barh(brands, brand_shares, color=colors_brand)
ax3.set_title('主要品牌市场份额', fontsize=12, fontweight='bold', pad=10)
ax3.set_xlabel('市场份额 (%)')
for bar, share in zip(bars, brand_shares):
    ax3.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2, 
             f'{share}%', va='center', fontsize=10, fontweight='bold')

# 4. 消费者年龄分布
ax4 = fig.add_subplot(2, 3, 4)
age_groups = ['儿童\n(3-12岁)', '青少年\n(13-17岁)', '青年\n(18-35岁)', '中年\n(36-50岁)', '50岁以上']
age_dist = [30, 20, 35, 12, 3]
colors_age = ['#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C']
bars = ax4.bar(age_groups, age_dist, color=colors_age, edgecolor='white', linewidth=2)
ax4.set_title('消费者年龄分布', fontsize=12, fontweight='bold', pad=10)
ax4.set_ylabel('占比 (%)')
for bar, dist in zip(bars, age_dist):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, 
             f'{dist}%', ha='center', fontsize=10, fontweight='bold')

# 5. 销售渠道占比
ax5 = fig.add_subplot(2, 3, 5)
channels = ['Amazon等\n电商平台', '品牌独立站', '线下零售', 'TikTok等\n社交电商', '其他']
channel_shares = [35, 20, 25, 15, 5]
colors_channel = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFD93D', '#96CEB4']
wedges, texts, autotexts = ax5.pie(channel_shares, labels=channels, autopct='%1.0f%%', 
                                   colors=colors_channel, startangle=90)
ax5.set_title('销售渠道分布', fontsize=12, fontweight='bold', pad=10)

# 6. 未来趋势关键词
ax6 = fig.add_subplot(2, 3, 6)
ax6.axis('off')
trends = [
    ('🌱 环保材质', '生物基塑料、可回收'),
    ('📱 智能配套', 'AR预览、AI图案生成'),
    ('🎮 IP联名', '游戏动漫授权套装'),
    ('👨‍💼 成人市场', '从玩具转向爱好'),
    ('📦 订阅模式', '月度耗材盒'),
    ('🌍 新兴市场', '东南亚、中东、拉美')
]
y_pos = 0.9
for title, desc in trends:
    ax6.text(0.05, y_pos, title, fontsize=11, fontweight='bold', 
             transform=ax6.transAxes, color='#FF6B6B')
    ax6.text(0.05, y_pos - 0.08, desc, fontsize=9, 
             transform=ax6.transAxes, color='#666666')
    y_pos -= 0.15
ax6.set_title('2025-2030 关键趋势', fontsize=12, fontweight='bold', pad=10)

plt.suptitle('🎨 国外拼豆（Perler Beads）市场分析报告', fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout(rect=[0, 0, 1, 0.96])

plt.savefig('/Users/xiaoxiami/.qclaw/workspace/拼豆市场分析图表.png', dpi=150, bbox_inches='tight', facecolor='#FFF5F5')
print('图表生成完成！')
