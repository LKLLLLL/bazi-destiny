import matplotlib.pyplot as plt
import matplotlib
import matplotlib.patches as mpatches
import numpy as np
matplotlib.use('Agg')

plt.rcParams['font.sans-serif'] = ['PingFang SC', 'SimHei', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False

# ===== 礼金数据（最终版）=====
gifts = [
    ('罗云慧', 600), ('罗发标', 600), ('王滨', 1000), ('罗建国', 1000),
    ('莲姨', 1000), ('罗静楚', 600), ('小叔小婶', 2000), ('三叔公', 2000),
    ('巧珊', 500), ('王萍', 1000), ('婕姐姐', 600), ('王东', 500),
    ('温小敏', 500), ('张文响', 600), ('王小洪', 1000), ('钟喜萍', 1000),
    ('朱兴伟', 300), ('王秋菊', 300), ('张计晴', 600), ('叶宝嫦', 300),
    ('周佛金', 200), ('叶房桂', 600), ('叶冰峰', 1000), ('王武', 600),
    ('张挚华', 2000), ('王超', 500), ('叶永坚', 600), ('张立浩', 600),
    ('女王群9人', 2700), ('水叔', 600), ('林贵凯', 369), ('谢萍', 200),
    ('张春菊', 300), ('张冬娣', 600), ('李丹琪', 200), ('吴胤', 600),
    ('张战', 600), ('没写名字的', 5000),
]

names = [g[0] for g in gifts]
amounts = [g[1] for g in gifts]
total = sum(amounts)
count = len(gifts)
avg = total / count
max_gift = max(gifts, key=lambda x: x[1])
min_gift = min(gifts, key=lambda x: x[1])

# 金额分档
def tier(a):
    if a >= 2000: return '2000+'
    elif a >= 1000: return '1000-1999'
    elif a >= 600: return '600-999'
    elif a >= 300: return '300-599'
    else: return '200-299'

tier_colors = {
    '2000+': '#C0392B',
    '1000-1999': '#E67E22',
    '600-999': '#27AE60',
    '300-599': '#2980B9',
    '200-299': '#95A5A6',
}
bar_colors = [tier_colors[tier(a)] for a in amounts]

# ===== 画布 =====
fig = plt.figure(figsize=(20, 16))
fig.patch.set_facecolor('#FFF8F0')

# 标题
fig.text(0.5, 0.975, '宝宝百日礼金汇总', ha='center', fontsize=24, fontweight='bold', color='#C0392B')

# ===== 汇总数据栏 =====
summary_ax = fig.add_axes([0.03, 0.895, 0.94, 0.065])
summary_ax.set_facecolor('#C0392B')
summary_ax.set_xlim(0, 10)
summary_ax.set_ylim(0, 1)
summary_ax.axis('off')

stats = [
    ('礼金总计', f'¥{total:,}'),
    ('亲友人数', f'{count} 位'),
    ('人均礼金', f'¥{avg:.0f}'),
    ('最高礼金', f'{max_gift[0]}  ¥{max_gift[1]:,}'),
    ('最低礼金', f'{min_gift[0]}  ¥{min_gift[1]:,}'),
]
for i, (label, val) in enumerate(stats):
    x = 1.0 + i * 2.0
    summary_ax.text(x, 0.72, label, ha='center', fontsize=10, color='#FFE0D0', fontweight='bold')
    summary_ax.text(x, 0.22, val, ha='center', fontsize=12, color='white', fontweight='bold')

# ===== 图1: 每人礼金柱状图 =====
ax1 = fig.add_axes([0.04, 0.50, 0.93, 0.36])
ax1.set_facecolor('#FFF8F0')

x = np.arange(count)
bars = ax1.bar(x, amounts, color=bar_colors, width=0.72, edgecolor='white', linewidth=0.5)

for bar, val in zip(bars, amounts):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 40,
             f'¥{val}', ha='center', va='bottom', fontsize=7.5, color='#333', rotation=90)

ax1.set_xticks(x)
ax1.set_xticklabels(names, rotation=45, ha='right', fontsize=9.5)
ax1.set_ylabel('礼金金额（元）', fontsize=11)
ax1.set_title('每位亲友礼金金额', fontsize=13, fontweight='bold', pad=10)
ax1.set_ylim(0, max(amounts) * 1.38)
ax1.axhline(y=avg, color='#C0392B', linestyle='--', linewidth=1.5, alpha=0.8)
ax1.text(count - 0.5, avg + 80, f'均值 ¥{avg:.0f}', color='#C0392B', fontsize=9.5, ha='right', fontweight='bold')
ax1.grid(axis='y', alpha=0.25)
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)

legend_patches = [mpatches.Patch(color=v, label=k) for k, v in tier_colors.items()]
ax1.legend(handles=legend_patches, title='金额档位', loc='upper right', fontsize=9, title_fontsize=9, framealpha=0.8)

# ===== 图2: 档位人数饼图 =====
ax2 = fig.add_axes([0.03, 0.04, 0.28, 0.40])
ax2.set_facecolor('#FFF8F0')

order = ['2000+', '1000-1999', '600-999', '300-599', '200-299']
tier_count = {o: 0 for o in order}
tier_sum = {o: 0 for o in order}
for a in amounts:
    t = tier(a)
    tier_count[t] += 1
    tier_sum[t] += a

tc = [tier_count[o] for o in order]
tc_colors = [tier_colors[o] for o in order]

wedges, texts, autotexts = ax2.pie(
    tc,
    labels=[f'{o}\n({tier_count[o]}人)' for o in order],
    autopct='%1.0f%%',
    colors=tc_colors,
    startangle=90,
    textprops={'fontsize': 9.5},
    pctdistance=0.72,
    wedgeprops={'edgecolor': 'white', 'linewidth': 1.5}
)
for at in autotexts:
    at.set_fontsize(9)
    at.set_color('white')
    at.set_fontweight('bold')
ax2.set_title('礼金档位人数分布', fontsize=12, fontweight='bold', pad=10)

# ===== 图3: 各档位礼金总额 =====
ax3 = fig.add_axes([0.36, 0.04, 0.28, 0.40])
ax3.set_facecolor('#FFF8F0')

ts = [tier_sum[o] for o in order]
bars3 = ax3.bar(order, ts, color=tc_colors, edgecolor='white', linewidth=0.8, width=0.6)
for bar, val in zip(bars3, ts):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 80,
             f'¥{val:,}', ha='center', fontsize=9.5, fontweight='bold', color='#333')
ax3.set_title('各档位礼金总额', fontsize=12, fontweight='bold', pad=10)
ax3.set_ylabel('金额（元）')
ax3.set_ylim(0, max(ts) * 1.22)
ax3.grid(axis='y', alpha=0.25)
ax3.spines['top'].set_visible(False)
ax3.spines['right'].set_visible(False)
plt.setp(ax3.xaxis.get_majorticklabels(), rotation=15, ha='right', fontsize=9)

# ===== 图4: TOP10 排行 =====
ax4 = fig.add_axes([0.69, 0.04, 0.29, 0.40])
ax4.set_facecolor('#FFF8F0')

sorted_gifts = sorted(gifts, key=lambda x: x[1], reverse=True)[:10]
top_names = [g[0] for g in sorted_gifts]
top_vals = [g[1] for g in sorted_gifts]
top_colors = [tier_colors[tier(v)] for v in top_vals]

bars4 = ax4.barh(range(len(top_names)), top_vals, color=top_colors, edgecolor='white', linewidth=0.8)
ax4.set_yticks(range(len(top_names)))
ax4.set_yticklabels(top_names, fontsize=10.5)
ax4.invert_yaxis()
for bar, val in zip(bars4, top_vals):
    ax4.text(val + 50, bar.get_y() + bar.get_height()/2,
             f'¥{val:,}', va='center', fontsize=10, fontweight='bold', color='#333')
ax4.set_title('礼金 TOP 10', fontsize=12, fontweight='bold', pad=10)
ax4.set_xlabel('金额（元）')
ax4.set_xlim(0, max(top_vals) * 1.28)
ax4.grid(axis='x', alpha=0.25)
ax4.spines['top'].set_visible(False)
ax4.spines['right'].set_visible(False)

plt.savefig('/Users/xiaoxiami/.qclaw/workspace/宝宝百日礼金图表_最终版.png',
            dpi=160, bbox_inches='tight', facecolor='#FFF8F0')
print(f"生成完成！总礼金: ¥{total:,}，共{count}人，人均¥{avg:.0f}")
