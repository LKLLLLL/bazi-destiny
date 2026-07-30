export interface GuardianSpirit {
  name: string;
  chinese: string;
  title: string;
  background: string;
}

interface GuardianPillar {
  stemIdx: number;
  branchIdx: number;
}

export interface GuardianSpiritChart {
  pillars: {
    year: GuardianPillar;
    month: GuardianPillar;
    day: GuardianPillar;
    hour?: GuardianPillar;
  };
  elements: {
    counts: Record<string, number>;
    dominant: string;
  };
  isThreePillar?: boolean;
}

type GuardianEntry = readonly [name: string, chinese: string, title: string, background: string];

const GUARDIAN_GROUPS: readonly (readonly GuardianEntry[])[] = [
  [
    ['Pangu', '盘古', 'Primordial Creator', 'The primordial giant who separated heaven from earth, embodying the courage to create order from chaos.'],
    ['Nuwa', '女娲', 'Mother Goddess Who Mended Heaven', 'The creator goddess who repaired the broken sky, embodying compassion, resilience, and the power to restore.'],
    ['Fuxi', '伏羲', 'First Sage of the Trigrams', 'The culture hero who revealed the Eight Trigrams, embodying insight into the hidden patterns of life.'],
    ['Shennong', '神农', 'Divine Farmer', 'The ancient sage who tested herbs for humankind, embodying curiosity, healing, and service through discovery.'],
    ['Yellow Emperor', '黄帝', 'Xuanyuan Huangdi', 'The legendary sovereign associated with Chinese civilization, embodying leadership, invention, and enduring order.'],
    ['Cangjie', '仓颉', 'Sage of Chinese Writing', 'The legendary inventor of Chinese characters, embodying observation and the power to give lasting form to thought.'],
    ['Leizu', '嫘祖', 'Lady of Silkworms', 'The culture heroine credited with discovering silk, embodying patience, ingenuity, and quiet transformation.'],
    ['Suiren', '燧人氏', 'Bringer of Fire', 'The ancient culture hero who taught people to make fire, embodying resourcefulness and the spark of civilization.'],
    ['Youchao', '有巢氏', 'Builder of the First Shelters', 'The culture hero who taught people to build homes, embodying protection, practicality, and secure foundations.'],
  ],
  [
    ['Nezha', '哪吒', 'Marshal of the Central Altar · 三坛海会大神', 'The fearless young deity who defied fate and remade himself, embodying courage and the will to choose a new path.'],
    ['Sun Wukong', '孙悟空', 'Great Sage Equal to Heaven · 齐天大圣', 'The rebellious Monkey King who mastered transformation, embodying freedom, wit, and resistance to imposed limits.'],
    ['Erlang Shen', '二郎神', 'True Lord of Manifest Holiness · 显圣真君', 'The divine warrior whose third eye sees through deception, embodying discipline, clarity, and decisive strength.'],
    ['Xingtian', '刑天', 'The Unyielding Warrior', 'The headless warrior who continued to fight after defeat, embodying an unconquerable spirit and relentless resolve.'],
    ['Hou Yi', '后羿', 'Divine Archer', 'The legendary archer who shot down nine scorching suns, embodying precision, responsibility, and courage under pressure.'],
    ['Kuafu', '夸父', 'The Sun Chaser', 'The giant who pursued the sun across the earth, embodying magnificent ambition and devotion to an impossible goal.'],
    ['Jingwei', '精卫', 'The Sea-Filling Spirit', 'The transformed maiden who carried stones to fill the sea, embodying persistence that refuses to yield to adversity.'],
    ['Yu the Great', '大禹', 'Tamer of the Floods', 'The flood hero who guided the waters instead of fighting them, embodying endurance, duty, and intelligent action.'],
    ['Chen Xiang', '沉香', 'The Mountain-Splitting Hero', 'The devoted son who split Mount Hua to rescue his mother, embodying courage strengthened by love and loyalty.'],
  ],
  [
    ['Jade Emperor', '玉皇大帝', 'Sovereign of Heaven', 'The celestial ruler who maintains order among heaven, earth, and the spirit world, embodying responsibility and measured authority.'],
    ['Queen Mother of the West', '西王母', 'Sovereign of Kunlun', 'The ancient goddess of Kunlun and keeper of immortality, embodying majesty, independence, and hidden wisdom.'],
    ['Taishang Laojun', '太上老君', 'Supreme Venerable Lord', 'The revered Daoist sage and celestial alchemist, embodying simplicity, transformation, and wisdom beyond appearances.'],
    ['Jiang Ziya', '姜子牙', 'Sage Strategist of the Zhou', 'The patient strategist who helped found a new dynasty and appointed the gods, embodying timing, judgment, and long vision.'],
    ['Jiutian Xuannu', '九天玄女', 'Mysterious Lady of the Nine Heavens', 'The celestial teacher of strategy and hidden arts, embodying intelligence, composure, and mastery in difficult moments.'],
    ['Wenchang Dijun', '文昌帝君', 'Lord of Literature and Learning', 'The guardian of scholarship and writing, embodying disciplined study, eloquence, and achievement through knowledge.'],
    ['Kui Xing', '魁星', 'Star Lord of Examinations', 'The celestial patron of scholars and examinations, embodying sharp intellect and the determination to excel.'],
    ['Nanji Xianweng', '南极仙翁', 'Old Immortal of the South Pole', 'The serene elder associated with wisdom and longevity, embodying patience, perspective, and a life guided by experience.'],
    ['Yue Lao', '月老', 'Old Man Under the Moon', 'The matchmaker who binds destined partners with red thread, embodying connection, timing, and unseen affinity.'],
  ],
  [
    ['Guan Yu', '关羽', 'Martial God of Loyalty · 关圣帝君', 'The deified general revered for loyalty and righteousness, embodying honor that remains firm under pressure.'],
    ['Zhong Kui', '钟馗', 'Demon Queller', 'The fierce guardian who drives away harmful spirits, embodying moral courage and protection without fear.'],
    ['Li Jing', '李靖', 'Pagoda-Bearing Heavenly King · 托塔天王', 'The disciplined heavenly commander who safeguards order, embodying responsibility, restraint, and protective strength.'],
    ['Xuanwu', '玄武大帝', 'Dark Warrior of the North', 'The northern guardian associated with water and endurance, embodying deep composure and formidable protection.'],
    ['Wang Lingguan', '王灵官', 'Great Protector of the Dao', 'The flame-eyed celestial marshal who guards sacred order, embodying vigilance, integrity, and swift justice.'],
    ['Qin Qiong', '秦琼', 'Door God General Qin', 'The celebrated general honored as a guardian of doorways, embodying steadfast courage and dependable protection.'],
    ['Yuchi Gong', '尉迟恭', 'Door God General Yuchi', 'The bold Tang general honored as a door guardian, embodying fearless loyalty and strength at the threshold.'],
    ['Bao Zheng', '包拯', 'Lord Bao, Judge of Justice', 'The incorruptible magistrate remembered as a judge of both living and dead, embodying fairness and fearless truth.'],
    ['Wei Tuo', '韦驮', 'Dharma-Protector General', 'The vigilant temple guardian who protects sacred teachings, embodying discipline, readiness, and loyal service.'],
  ],
  [
    ['Mazu', '妈祖', 'Heavenly Holy Mother · 天上圣母', 'The compassionate sea guardian who guides people through storms, embodying care, courage, and safe passage.'],
    ['Guanyin', '观音', 'Bodhisattva of Compassion', 'The merciful figure who hears the cries of the world, embodying empathy, patience, and help offered without judgment.'],
    ['Magu', '麻姑', 'Immortal Maiden of Longevity', 'The gentle immortal associated with renewal and long life, embodying grace, vitality, and quiet blessing.'],
    ['He Xiangu', '何仙姑', 'Immortal Woman He', 'The only woman among the Eight Immortals, embodying purity, generosity, and freedom from worldly constraint.'],
    ['Sun Simiao', '孙思邈', 'King of Medicine · 药王', 'The physician revered for medical wisdom and ethics, embodying healing guided by humility and compassion.'],
    ['Hua Tuo', '华佗', 'Divine Physician', 'The legendary doctor famed for bold treatments and surgical skill, embodying innovation in the service of healing.'],
    ['Bian Que', '扁鹊', 'Ancestral Healer', 'The master physician celebrated for seeing illness beneath the surface, embodying perception and timely care.'],
    ['Can Nu', '蚕女', 'Silkworm Maiden', 'The maiden of an ancient silk legend who became linked with the silkworm, embodying devotion and transformation through patient work.'],
    ['Bixia Yuanjun', '碧霞元君', 'Sovereign of the Dawn Clouds', 'The beloved goddess of Mount Tai who watches over health and families, embodying protection, renewal, and maternal strength.'],
  ],
  [
    ['Zhurong', '祝融', 'God of Fire', 'The ancient fire deity who governs flame and the southern direction, embodying radiance, order, and controlled power.'],
    ['Gonggong', '共工', 'God of Water', 'The mighty water deity whose force shook heaven itself, embodying tremendous emotion and the power of untamed change.'],
    ['Houtu', '后土', 'Sovereign of Earth', 'The great earth deity who receives and sustains all life, embodying stability, nourishment, and impartial care.'],
    ['Lei Gong', '雷公', 'Duke of Thunder', 'The thunder deity who strikes against hidden wrongdoing, embodying awakening, consequence, and sudden truth.'],
    ['Dian Mu', '电母', 'Mother of Lightning', 'The goddess whose flashing mirrors reveal what darkness conceals, embodying illumination and precise perception.'],
    ['Feng Bo', '风伯', 'Earl of Wind', 'The ancient master of winds who releases them from his celestial bag, embodying movement, change, and invisible influence.'],
    ['Yu Shi', '雨师', 'Master of Rain', 'The rain deity who brings water to fields and rivers, embodying renewal, timing, and life-giving generosity.'],
    ['He Bo', '河伯', 'Lord of the Yellow River', 'The ancient river deity who rules powerful currents, embodying depth, adaptation, and respect for forces larger than oneself.'],
    ['Ao Guang', '敖广', 'Dragon King of the East Sea', 'The dragon sovereign who commands eastern seas and weather, embodying authority, abundance, and elemental power.'],
  ],
  [
    ['Lu Dongbin', '吕洞宾', 'Pure Yang Immortal · 纯阳真人', 'The sword-bearing scholar of the Eight Immortals, embodying discernment, inner cultivation, and freedom from illusion.'],
    ['Tieguai Li', '铁拐李', 'Iron-Crutch Immortal', 'The wandering immortal in an imperfect body, embodying resilience, compassion, and wisdom beyond outward form.'],
    ['Zhongli Quan', '钟离权', 'Leader of the Eight Immortals', 'The genial immortal who turns hardship into awakening, embodying generosity, confidence, and transformative insight.'],
    ['Zhang Guolao', '张果老', 'Elder Immortal Zhang', 'The eccentric immortal who rides his donkey backward, embodying unconventional wisdom and freedom from ordinary rules.'],
    ['Lan Caihe', '蓝采和', 'Wandering Flower Immortal', 'The carefree wanderer of uncertain gender who sings through the streets, embodying authenticity, joy, and detachment.'],
    ['Han Xiangzi', '韩湘子', 'Flute-Playing Immortal', 'The musical immortal who makes flowers bloom, embodying artistry, spontaneity, and harmony with nature.'],
    ['Cao Guojiu', '曹国舅', 'Royal Uncle Immortal', 'The court noble who left privilege to seek the Dao, embodying conscience, humility, and renewal after regret.'],
    ['Bai Suzhen', '白素贞', 'Lady White Snake', 'The white snake spirit who cultivated human form and chose love, embodying devotion, wisdom, and self-determined transformation.'],
    ['Xiaoqing', '小青', 'Green Snake Spirit', 'The spirited companion who stands beside Bai Suzhen, embodying loyalty, independence, and fearless action.'],
  ],
  [
    ['Yugong', '愚公', 'The Old Man Who Moved Mountains', 'The elder who answered impossible mountains with daily effort, embodying patience and faith in cumulative change.'],
    ['Meng Jiangnu', '孟姜女', 'Lady of the Great Wall', 'The faithful woman whose grief shook the Great Wall, embodying devotion powerful enough to confront authority.'],
    ['Zhinu', '织女', 'The Weaver Girl', 'The celestial weaver separated from her beloved by the Milky Way, embodying skill, constancy, and enduring love.'],
    ['Niulang', '牛郎', 'The Cowherd', 'The humble cowherd who crosses the stars to reunite with his beloved, embodying sincerity and steadfast affection.'],
    ['Dong Yong', '董永', 'The Filial Son', 'The devoted son whose selflessness moved heaven, embodying humility, duty, and love expressed through sacrifice.'],
    ['Seventh Fairy', '七仙女', 'Seventh Daughter of Heaven', 'The celestial maiden who descended to choose a mortal life of love, embodying tenderness and courage to follow the heart.'],
    ['Mulian', '目连', 'The Filial Disciple', 'The devoted disciple who journeyed through the underworld to save his mother, embodying compassion and unwavering resolve.'],
    ['Hua Mulan', '花木兰', 'The Warrior Daughter', 'The legendary daughter who took her father’s place in war, embodying courage, devotion, and quiet capability.'],
    ['Lady of Tushan', '涂山女娇', 'Bride of Yu the Great', 'The legendary woman of Tushan who supported Yu during the great floods, embodying partnership, patience, and ancestral strength.'],
  ],
  [
    ["Chang'e", '嫦娥', 'Goddess of the Moon', 'The immortal who dwells in the moon palace, embodying independence, longing, and luminous inner life.'],
    ['Xihe', '羲和', 'Charioteer of the Suns', 'The ancient solar goddess who guides the suns across the sky, embodying rhythm, radiance, and purposeful motion.'],
    ['Changxi', '常羲', 'Mother of the Moons', 'The ancient goddess who gave birth to twelve moons, embodying cycles, reflection, and gentle renewal.'],
    ['Qing Nu', '青女', 'Goddess of Frost', 'The celestial maiden who brings autumn frost, embodying clarity, restraint, and beauty in change.'],
    ['Yaoji', '瑶姬', 'Goddess of Mount Wushan', 'The cloud-and-rain goddess of Wushan, embodying intuition, poetic mystery, and a presence that cannot be confined.'],
    ['Longnu', '龙女', 'Dragon Maiden', 'The dragon king’s daughter who attains wisdom with remarkable speed, embodying insight, compassion, and spiritual potential.'],
    ['Luo Shen', '洛神', 'Goddess of the Luo River', 'The radiant river goddess celebrated in poetry, embodying grace, imagination, and beauty that moves like water.'],
    ['Doumu Yuanjun', '斗姆元君', 'Mother of the Dipper Stars', 'The celestial mother associated with the stars of fate, embodying cosmic order, guidance, and far-reaching care.'],
    ['San Sheng Mu', '三圣母', 'Third Holy Mother of Mount Hua', 'The goddess who chose love across the boundary of heaven and earth, embodying tenderness, conviction, and personal freedom.'],
  ],
];

export const GUARDIAN_SPIRITS: readonly GuardianSpirit[] = GUARDIAN_GROUPS.flatMap((group) =>
  group.map(([name, chinese, title, background]) => ({ name, chinese, title, background })),
);

// The Day Master selects one of nine broad mythic archetypes; the remaining
// pillars and element balance select the individual figure within that group.
const GROUP_BY_DAY_STEM = [0, 4, 1, 8, 3, 7, 2, 3, 5, 6] as const;
const ELEMENT_ORDER = ['木', '火', '土', '金', '水'] as const;

export function getGuardianSpirit(chart: GuardianSpiritChart): GuardianSpirit {
  const dayStem = chart.pillars.day.stemIdx;
  const groupIndex = GROUP_BY_DAY_STEM[((dayStem % 10) + 10) % 10];
  const pillars = chart.pillars;
  const values = [
    pillars.year.stemIdx,
    pillars.year.branchIdx,
    pillars.month.stemIdx,
    pillars.month.branchIdx,
    pillars.day.stemIdx,
    pillars.day.branchIdx,
  ];

  if (!chart.isThreePillar && pillars.hour) {
    const dominantIndex = Math.max(0, ELEMENT_ORDER.indexOf(chart.elements.dominant as (typeof ELEMENT_ORDER)[number]));
    const counts = ELEMENT_ORDER.map((element) => chart.elements.counts[element] || 0);
    values.push(dominantIndex, ...counts, pillars.hour.stemIdx, pillars.hour.branchIdx);
  }

  let seed = 2166136261;
  for (const value of values) {
    seed ^= value + 31;
    seed = Math.imul(seed, 16777619) >>> 0;
  }

  const group = GUARDIAN_GROUPS[groupIndex];
  const [name, chinese, title, background] = group[seed % group.length];
  return { name, chinese, title, background };
}
