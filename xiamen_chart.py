import matplotlib.pyplot as plt
import matplotlib
import numpy as np
matplotlib.use('Agg')

plt.rcParams['font.sans-serif'] = ['PingFang SC', 'SimHei', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False

fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#E3F2FD')

# 标题
fig.text(0.5, 0.97, '🌊 厦门30小时精华攻略 🌊', ha='center', fontsize=22, fontweight='bold', color='#1565C0')
fig.text(0.5, 0.94, '到达：厦门北站 ｜ 游玩时间：30小时', ha='center', fontsize=12, color='#666666')

# ===== 图1: 每日行程时间分配 =====
ax1 = fig.add_axes([0.04, 0.68, 0.44, 0.23])
ax1.set_facecolor('#FFFFFF')

day1_hours = [1, 1, 2, 1]  # 交通,住宿,美食,夜景
day2_hours = [1, 3.5, 1.5, 1, 2.5, 1.5, 2]  # 早餐,鼓浪屿,午餐,下午,傍晚,晚餐,夜景
day3_hours = [1, 2.5, 1, 1, 1]  # 早餐,植物园,午餐,购物,返程

categories = ['Day1\n晚上', 'Day2\n全天', 'Day3\n上午']
hours = [sum(day1_hours), sum(day2_hours), sum(day3_hours)]
colors_bar = ['#FF7043', '#43A047', '#1E88E5']

bars1 = ax1.bar(categories, hours, color=colors_bar, width=0.5, edgecolor='white', linewidth=2)
for bar, val in zip(bars1, hours):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
             f'{val}h', ha='center', fontsize=12, fontweight='bold')
ax1.set_title('每日游玩时间分配', fontsize=13, fontweight='bold', pad=10)
ax1.set_ylabel('小时')
ax1.set_ylim(0, 16)
ax1.grid(axis='y', alpha=0.3)
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)

# ===== 图2: 费用预算对比 =====
ax2 = fig.add_axes([0.52, 0.68, 0.44, 0.23])
ax2.set_facecolor('#FFFFFF')

budget_items = ['住宿', '交通', '门票', '餐饮', '伴手礼']
eco = [200, 65, 150, 175, 100]
comf = [400, 125, 150, 350, 200]
lux = [900, 250, 200, 650, 400]

x = np.arange(len(budget_items))
width = 0.25

bars2a = ax2.bar(x - width, eco, width, label='经济型', color='#66BB6A')
bars2b = ax2.bar(x, comf, width, label='舒适型', color='#FFA726')
bars2c = ax2.bar(x + width, lux, width, label='豪华型', color='#EF5350')

ax2.set_title('费用预算对比 (元)', fontsize=13, fontweight='bold', pad=10)
ax2.set_xticks(x)
ax2.set_xticklabels(budget_items)
ax2.legend(loc='upper right')
ax2.grid(axis='y', alpha=0.3)
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)

# ===== 图3: 景点推荐热度 =====
ax3 = fig.add_axes([0.04, 0.38, 0.44, 0.25])
ax3.set_facecolor('#FFFFFF')

spots = ['鼓浪屿', '厦门大学', '南普陀寺', '植物园', '环岛路', '曾厝垵', '中山路']
scores = [95, 90, 85, 88, 82, 75, 78]
colors3 = plt.cm.Blues(np.linspace(0.4, 0.9, len(spots)))[::-1]

bars3 = ax3.barh(spots[::-1], scores[::-1], color=colors3, edgecolor='white')
for bar, val in zip(bars3, scores[::-1]):
    ax3.text(val + 1, bar.get_y() + bar.get_height()/2, f'{val}', va='center', fontsize=10)
ax3.set_title('必去景点推荐度', fontsize=13, fontweight='bold', pad=10)
ax3.set_xlabel('推荐度 (分)')
ax3.set_xlim(0, 105)
ax3.grid(axis='x', alpha=0.3)
ax3.spines['top'].set_visible(False)
ax3.spines['right'].set_visible(False)

# ===== 图4: 美食必吃清单 =====
ax4 = fig.add_axes([0.52, 0.38, 0.44, 0.25])
ax4.set_facecolor('#FFFFFF')

foods = ['沙茶面', '海蛎煎', '花生汤', '土笋冻', '姜母鸭', '烧肉粽', '鱼丸汤']
must_try = [100, 95, 90, 85, 88, 82, 80]
colors4 = plt.cm.Oranges(np.linspace(0.4, 0.9, len(foods)))[::-1]

bars4 = ax4.barh(foods[::-1], must_try[::-1], color=colors4, edgecolor='white')
for bar, val in zip(bars4, must_try[::-1]):
    ax4.text(val + 1, bar.get_y() + bar.get_height()/2, f'{val}%', va='center', fontsize=10)
ax4.set_title('必吃美食推荐度', fontsize=13, fontweight='bold', pad=10)
ax4.set_xlabel('必吃指数 (%)')
ax4.set_xlim(0, 110)
ax4.grid(axis='x', alpha=0.3)
ax4.spines['top'].set_visible(False)
ax4.spines['right'].set_visible(False)

# ===== 图5: 交通方式对比 =====
ax5 = fig.add_axes([0.04, 0.06, 0.44, 0.26])
ax5.set_facecolor('#FFFFFF')

trans_modes = ['地铁1号线', 'BRT快1', '出租车', '机场大巴']
time_cost = [50, 60, 40, 60]  # 分钟
money_cost = [7, 4, 100, 15]  # 元

x5 = np.arange(len(trans_modes))
width5 = 0.35

ax5_twin = ax5.twinx()
bars5a = ax5.bar(x5 - width5/2, time_cost, width5, label='时间(分钟)', color='#42A5F5')
bars5b = ax5_twin.bar(x5 + width5/2, money_cost, width5, label='费用(元)', color='#FF7043')

ax5.set_title('厦门北站→市区 交通方式对比', fontsize=13, fontweight='bold', pad=10)
ax5.set_xticks(x5)
ax5.set_xticklabels(trans_modes)
ax5.set_ylabel('时间 (分钟)', color='#42A5F5')
ax5_twin.set_ylabel('费用 (元)', color='#FF7043')
ax5.set_ylim(0, 80)
ax5_twin.set_ylim(0, 130)
ax5.grid(axis='y', alpha=0.3)
ax5.spines['top'].set_visible(False)

# 合并图例
lines1, labels1 = ax5.get_legend_handles_labels()
lines2, labels2 = ax5_twin.get_legend_handles_labels()
ax5.legend(lines1 + lines2, labels1 + labels2, loc='upper right')

# ===== 图6: 行程亮点时间轴 =====
ax6 = fig.add_axes([0.52, 0.06, 0.44, 0.26])
ax6.set_facecolor('#FFFFFF')
ax6.axis('off')

timeline = [
    ('Day1 晚', '中山路逛吃', '#FF7043'),
    ('Day2 早', '鼓浪屿日光岩', '#43A047'),
    ('Day2 中', '南普陀+厦大', '#1E88E5'),
    ('Day2 晚', '白城沙滩日落', '#FF9800'),
    ('Day3 早', '植物园打卡', '#9C27B0'),
    ('Day3 中', '买伴手礼返程', '#795548'),
]

ax6.set_xlim(0, 10)
ax6.set_ylim(0, 7)

for i, (time, event, color) in enumerate(timeline):
    y = 6 - i
    # 时间点
    ax6.scatter(1, y, s=200, c=color, zorder=3, edgecolors='white', linewidth=2)
    ax6.text(1, y, str(i+1), ha='center', va='center', fontsize=10, color='white', fontweight='bold')
    # 时间标签
    ax6.text(2.2, y, time, ha='left', va='center', fontsize=10, fontweight='bold', color=color)
    # 事件
    ax6.text(4.5, y, event, ha='left', va='center', fontsize=10, color='#333333')
    # 连线
    if i < len(timeline) - 1:
        ax6.plot([1, 1], [y-0.3, y-0.7], color='#CCCCCC', linewidth=2)

ax6.set_title('行程亮点时间轴', fontsize=13, fontweight='bold', pad=10)

plt.savefig('/Users/xiaoxiami/.qclaw/workspace/厦门30小时攻略图表.png', dpi=160, bbox_inches='tight', facecolor='#E3F2FD')
print("厦门攻略图表生成完成！")
