import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

const animals = {
  rat: {
    en: 'Rat', zh: '鼠', traits: ['resourceful', 'adaptable', 'observant'],
    profile: 'Rat symbolism emphasizes quick judgment, practical intelligence, and the ability to find opportunity in changing conditions.',
    zhProfile: '生肖鼠的传统象征包括机敏、适应力和对机会的敏锐观察。',
    harmony: ['Dragon', 'Monkey', 'Ox'], clash: 'Horse', zhHarmony: ['龙', '猴', '牛'], zhClash: '马',
  },
  ox: {
    en: 'Ox', zh: '牛', traits: ['steady', 'patient', 'dependable'],
    profile: 'Ox symbolism emphasizes persistence, reliability, and progress built through consistent effort.',
    zhProfile: '生肖牛的传统象征包括耐力、可靠和通过持续投入取得进展。',
    harmony: ['Snake', 'Rooster', 'Rat'], clash: 'Goat', zhHarmony: ['蛇', '鸡', '鼠'], zhClash: '羊',
  },
  tiger: {
    en: 'Tiger', zh: '虎', traits: ['bold', 'independent', 'direct'],
    profile: 'Tiger symbolism emphasizes courage, initiative, and a strong preference for acting independently.',
    zhProfile: '生肖虎的传统象征包括勇气、行动力和鲜明的独立意识。',
    harmony: ['Horse', 'Dog', 'Pig'], clash: 'Monkey', zhHarmony: ['马', '狗', '猪'], zhClash: '猴',
  },
  rabbit: {
    en: 'Rabbit', zh: '兔', traits: ['diplomatic', 'observant', 'considerate'],
    profile: 'Rabbit symbolism emphasizes diplomacy, sensitivity to context, and a preference for thoughtful cooperation.',
    zhProfile: '生肖兔的传统象征包括圆融、细腻和重视合作关系。',
    harmony: ['Goat', 'Pig', 'Dog'], clash: 'Rooster', zhHarmony: ['羊', '猪', '狗'], zhClash: '鸡',
  },
  dragon: {
    en: 'Dragon', zh: '龙', traits: ['confident', 'ambitious', 'energetic'],
    profile: 'Dragon symbolism emphasizes confidence, aspiration, and the drive to take on visible responsibilities.',
    zhProfile: '生肖龙的传统象征包括自信、进取和承担重要责任的动力。',
    harmony: ['Rat', 'Monkey', 'Rooster'], clash: 'Dog', zhHarmony: ['鼠', '猴', '鸡'], zhClash: '狗',
  },
  snake: {
    en: 'Snake', zh: '蛇', traits: ['perceptive', 'strategic', 'composed'],
    profile: 'Snake symbolism emphasizes careful observation, strategic thinking, and calm decision-making.',
    zhProfile: '生肖蛇的传统象征包括洞察力、策略思维和沉着判断。',
    harmony: ['Ox', 'Rooster', 'Monkey'], clash: 'Pig', zhHarmony: ['牛', '鸡', '猴'], zhClash: '猪',
  },
  horse: {
    en: 'Horse', zh: '马', traits: ['active', 'sociable', 'independent'],
    profile: 'Horse symbolism emphasizes movement, social energy, and a strong need for autonomy.',
    zhProfile: '生肖马的传统象征包括行动力、社交活力和对自主空间的重视。',
    harmony: ['Tiger', 'Dog', 'Goat'], clash: 'Rat', zhHarmony: ['虎', '狗', '羊'], zhClash: '鼠',
  },
  goat: {
    en: 'Goat', zh: '羊', traits: ['empathetic', 'creative', 'cooperative'],
    profile: 'Goat symbolism emphasizes empathy, aesthetic awareness, and strength expressed through cooperation.',
    zhProfile: '生肖羊的传统象征包括同理心、审美意识和合作中的韧性。',
    harmony: ['Rabbit', 'Pig', 'Horse'], clash: 'Ox', zhHarmony: ['兔', '猪', '马'], zhClash: '牛',
  },
  monkey: {
    en: 'Monkey', zh: '猴', traits: ['inventive', 'curious', 'quick-witted'],
    profile: 'Monkey symbolism emphasizes curiosity, experimentation, and solving problems through flexible thinking.',
    zhProfile: '生肖猴的传统象征包括好奇、灵活和善于用新方法解决问题。',
    harmony: ['Rat', 'Dragon', 'Snake'], clash: 'Tiger', zhHarmony: ['鼠', '龙', '蛇'], zhClash: '虎',
  },
  rooster: {
    en: 'Rooster', zh: '鸡', traits: ['organized', 'candid', 'observant'],
    profile: 'Rooster symbolism emphasizes order, direct communication, and close attention to standards and detail.',
    zhProfile: '生肖鸡的传统象征包括条理、坦率和对标准与细节的重视。',
    harmony: ['Ox', 'Snake', 'Dragon'], clash: 'Rabbit', zhHarmony: ['牛', '蛇', '龙'], zhClash: '兔',
  },
  dog: {
    en: 'Dog', zh: '狗', traits: ['loyal', 'fair-minded', 'protective'],
    profile: 'Dog symbolism emphasizes loyalty, fairness, and a willingness to protect people and principles that matter.',
    zhProfile: '生肖狗的传统象征包括忠诚、公正和守护重要关系与原则。',
    harmony: ['Tiger', 'Horse', 'Rabbit'], clash: 'Dragon', zhHarmony: ['虎', '马', '兔'], zhClash: '龙',
  },
  pig: {
    en: 'Pig', zh: '猪', traits: ['generous', 'sincere', 'pragmatic'],
    profile: 'Pig symbolism emphasizes sincerity, generosity, and an appreciation for practical comfort and mutual trust.',
    zhProfile: '生肖猪的传统象征包括真诚、慷慨和对实际生活与相互信任的重视。',
    harmony: ['Rabbit', 'Goat', 'Tiger'], clash: 'Snake', zhHarmony: ['兔', '羊', '虎'], zhClash: '蛇',
  },
};

const elements = {
  Metal: { zh: '金', season: 'Autumn', direction: 'West', color: 'white and metallic tones', quality: 'structure, precision, and discernment', zhSeason: '秋季', zhDirection: '西方', zhColor: '白色与金属色', zhQuality: '秩序、精确与判断力' },
  Water: { zh: '水', season: 'Winter', direction: 'North', color: 'black and deep blue', quality: 'adaptability, reflection, and communication', zhSeason: '冬季', zhDirection: '北方', zhColor: '黑色与深蓝色', zhQuality: '适应、思考与沟通' },
  Wood: { zh: '木', season: 'Spring', direction: 'East', color: 'green', quality: 'growth, initiative, and flexibility', zhSeason: '春季', zhDirection: '东方', zhColor: '绿色', zhQuality: '成长、主动与弹性' },
  Fire: { zh: '火', season: 'Summer', direction: 'South', color: 'red', quality: 'expression, warmth, and momentum', zhSeason: '夏季', zhDirection: '南方', zhColor: '红色', zhQuality: '表达、温暖与推动力' },
  Earth: { zh: '土', season: 'seasonal transitions', direction: 'Center', color: 'yellow and ochre', quality: 'stability, support, and integration', zhSeason: '季节转换期', zhDirection: '中央', zhColor: '黄色与土色', zhQuality: '稳定、承载与整合' },
};

function elementForYear(year) {
  const digit = year % 10;
  if (digit === 0 || digit === 1) return 'Metal';
  if (digit === 2 || digit === 3) return 'Water';
  if (digit === 4 || digit === 5) return 'Wood';
  if (digit === 6 || digit === 7) return 'Fire';
  return 'Earth';
}

function englishRecord(rec) {
  const animal = animals[rec.animal];
  const elementName = elementForYear(rec.year);
  const element = elements[elementName];
  const combo = `${elementName} ${animal.en}`;
  return {
    ...rec,
    title: `${rec.year} ${combo}: Chinese Zodiac Sign & Traits | BaZi Destiny`,
    description: `Learn about the ${rec.year} ${combo} Chinese zodiac year: traditional traits, Five Element influence, compatibility, and the calendar boundary to check.`,
    keywords: `${rec.year} Chinese zodiac, ${rec.year} ${animal.en}, ${combo}, ${animal.en} zodiac traits, Chinese astrology`,
    h1: `${rec.year} ${combo} Chinese Zodiac`,
    subs: [
      `Chinese Zodiac: ${animal.en} · Year Element: ${elementName}`,
      'A traditional birth-year profile, with clear limits on what the year sign can reveal',
    ],
    sections: [
      {
        h2: `What the ${rec.year} ${combo} Represents`,
        html: `<p>${rec.year} is traditionally associated with the <strong>${combo}</strong>. The zodiac animal describes broad birth-year symbolism, while the Heavenly Stem supplies the Five Element influence.</p><p>${animal.profile}</p>`,
      },
      {
        h2: `${animal.en} Traits in Chinese Tradition`,
        html: `<p>The ${animal.en} is commonly associated with <strong>${animal.traits.join(', ')}</strong>. These are traditional archetypes rather than fixed personality rules; family, culture, and the rest of a BaZi chart can produce very different expressions.</p>`,
      },
      {
        h2: `How the ${elementName} Element Influences the ${animal.en}`,
        html: `<p>In Five Element theory, ${elementName} is associated with <strong>${element.quality}</strong>. Its traditional correspondences include ${element.season}, the ${element.direction}, and ${element.color}.</p><p>For a ${combo}, these themes are read alongside the ${animal.en}'s birth-year symbolism. They describe a general cultural archetype, not a measured elemental balance.</p>`,
      },
      {
        h2: `Traditional ${animal.en} Compatibility`,
        html: `<p>Traditional zodiac groupings commonly connect the ${animal.en} with the <strong>${animal.harmony.join(', ')}</strong>. The ${animal.en} is opposite the <strong>${animal.clash}</strong> in the twelve-branch cycle.</p><p>Animal signs alone cannot determine relationship compatibility. A BaZi comparison also considers both Day Masters, elemental balance, and interactions across all Four Pillars.</p>`,
      },
      {
        h2: `Check the Zodiac-Year Boundary`,
        html: `<p>A Chinese zodiac year does not begin on January 1. Lunar-zodiac references normally use Lunar New Year, while BaZi practitioners usually change the Year Pillar at <strong>Li Chun (Start of Spring)</strong>.</p><p>If you were born in January or early February ${rec.year}, use your exact birth date and the intended system before assigning the year sign.</p>`,
      },
      {
        h2: `Birth-Year Sign vs. a Complete BaZi Chart`,
        html: `<p>Everyone born in ${rec.year} does not share the same BaZi chart. The year provides only one of four pillars. Month, day, hour, birthplace, and solar-term boundaries determine the rest of the chart, including the Day Master.</p><p>Use this page as a birth-year reference. For a personalized result, generate your Four Pillars chart with the calculator below.</p>`,
      },
    ],
    faqs: [
      { q: `What is the ${rec.year} Chinese zodiac sign?`, a: `${rec.year} is generally known as a ${combo} year. People born in January or early February should check the Lunar New Year or Li Chun boundary used by their chosen system.` },
      { q: `What are the traditional traits of a ${combo}?`, a: `${animal.en} symbolism is commonly associated with ${animal.traits.join(', ')} qualities. The ${elementName} influence adds themes of ${element.quality}. These are general traditions, not a complete personality assessment.` },
      { q: `Does everyone born in ${rec.year} have the same BaZi chart?`, a: `No. The birth year is only one pillar. A complete BaZi chart also depends on the birth month, day, hour, location, and solar-term boundaries.` },
    ],
  };
}

function chineseRecord(rec) {
  const animal = animals[rec.animal];
  const elementName = elementForYear(rec.year);
  const element = elements[elementName];
  const combo = `${element.zh}${animal.zh}`;
  return {
    ...rec,
    title: `${rec.year}年${combo}生肖：五行、性格与配对 | BaZi Destiny`,
    description: `了解${rec.year}年${combo}的传统生肖含义、年柱五行、性格倾向、生肖配对，以及年初出生者需要核对的历法边界。`,
    keywords: `${rec.year}年生肖,${rec.year}年属什么,${combo},生肖${animal.zh},五行${element.zh}`,
    h1: `${rec.year}年${combo}生肖详解`,
    subs: [
      `生肖：${animal.zh} · 年柱五行：${element.zh}`,
      '出生年份的传统文化概览，并说明年柱解读的适用范围',
    ],
    sections: [
      {
        h2: `${rec.year}年${combo}代表什么`,
        html: `<p>${rec.year}年传统上对应<strong>${combo}</strong>。生肖描述出生年份的地支象征，天干则赋予该年份五行属性。</p><p>${animal.zhProfile}</p>`,
      },
      {
        h2: `生肖${animal.zh}的传统性格`,
        html: `<p>生肖性格属于传统文化中的概括性原型，并不是固定的人格结论。同一年出生的人仍会因为家庭、环境以及其余三柱不同而呈现明显差异。</p>`,
      },
      {
        h2: `${element.zh}元素如何影响生肖${animal.zh}`,
        html: `<p>在五行理论中，${element.zh}常与<strong>${element.zhQuality}</strong>相关。传统对应包括${element.zhSeason}、${element.zhDirection}以及${element.zhColor}。</p><p>${combo}应理解为年柱层面的文化象征，不能代替完整命盘的五行强弱分析。</p>`,
      },
      {
        h2: `生肖${animal.zh}的传统配对关系`,
        html: `<p>传统生肖关系常将${animal.zh}与<strong>${animal.zhHarmony.join('、')}</strong>视为较和谐的组合；在十二地支中，${animal.zh}与<strong>${animal.zhClash}</strong>相冲。</p><p>生肖并不能单独决定感情结果。八字合盘还需要比较双方日主、五行分布及四柱之间的合冲关系。</p>`,
      },
      {
        h2: `年初出生需要核对生肖边界`,
        html: `<p>生肖年份并不从公历1月1日开始。民俗生肖通常以农历新年为界，子平八字的年柱则通常以<strong>立春</strong>为界。</p><p>如果出生在${rec.year}年1月或2月初，应根据具体出生日期和所采用的体系核对生肖与年柱。</p>`,
      },
      {
        h2: `出生年份不等于完整八字`,
        html: `<p>${rec.year}年出生的人并不拥有相同的八字。年份只构成四柱中的一柱；月份、日期、时辰、出生地点和节气边界共同决定完整命盘与日主。</p><p>本页适合作为出生年份参考。如需个性化结果，请使用下方计算器生成四柱命盘。</p>`,
      },
    ],
    faqs: [
      { q: `${rec.year}年属什么生肖？`, a: `${rec.year}年通常称为${combo}年。1月或2月初出生者需要核对农历新年或立春边界。` },
      { q: `${combo}有什么传统性格特征？`, a: `传统上，生肖${animal.zh}具有其地支象征，${element.zh}元素则加入${element.zhQuality}等主题。这只是出生年份层面的概括。` },
      { q: `${rec.year}年出生的人八字都一样吗？`, a: `不一样。出生年份只是年柱，完整八字还取决于出生月、日、时、地点和节气边界。` },
    ],
  };
}

async function rewrite(file, transform) {
  const url = new URL(file, root);
  const records = JSON.parse(await readFile(url, 'utf8'));
  await writeFile(url, `${JSON.stringify(records.map(transform), null, 2)}\n`);
}

await rewrite('src/data/destiny-en.json', englishRecord);
await rewrite('src/data/destiny-zh.json', chineseRecord);
console.log('Rebuilt English and Chinese destiny-year pages with verified evergreen content.');
