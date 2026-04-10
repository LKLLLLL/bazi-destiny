/**
 * BaZi Love Compatibility Engine
 * Analyzes compatibility between two people based on their BaZi charts
 */
(function(global) {

  // Five Elements: 互相关系
  // Wood → Fire → Earth → Metal → Water → Wood (generating cycle)
  // Wood breaks Earth; Earth blocks Water; Water quenches Fire;
  // Fire melts Metal; Metal chops Wood (controlling cycle)
  const ELEM_CN = { 木:'Wood', 火:'Fire', 土:'Earth', 金:'Metal', 水:'Water' };
  const ELEM_CN_REV = { Wood:'木', Fire:'火', Earth:'土', Metal:'金', Water:'水' };
  const STEM_SHORT_EN = { 甲:'Jia', 乙:'Yi', 丙:'Bing', 丁:'Ding', 戊:'Wu', 己:'Ji', 庚:'Geng', 辛:'Xin', 壬:'Ren', 癸:'Gui' };
  const STEM_TO_EN = { 甲:'Yang Wood', 乙:'Yin Wood', 丙:'Yang Fire', 丁:'Yin Fire', 戊:'Yang Earth', 己:'Yin Earth', 庚:'Yang Metal', 辛:'Yin Metal', 壬:'Yang Water', 癸:'Yin Water' };
  const BRANCH_TO_EN = { 子:'Rat', 丑:'Ox', 寅:'Tiger', 卯:'Rabbit', 辰:'Dragon', 巳:'Snake', 午:'Horse', 未:'Goat', 申:'Monkey', 酉:'Rooster', 戌:'Dog', 亥:'Pig' };
  const STEM_EN_PAIR = { 甲:'Jia', 乙:'Yi', 丙:'Bing', 丁:'Ding', 戊:'Wu', 己:'Ji', 庚:'Geng', 辛:'Xin', 壬:'Ren', 癸:'Gui' };
  const BRANCH_EN_PAIR = { 子:'Rat', 丑:'Ox', 寅:'Tiger', 卯:'Rabbit', 辰:'Dragon', 巳:'Snake', 午:'Horse', 未:'Goat', 申:'Monkey', 酉:'Rooster', 戌:'Dog', 亥:'Pig' };

  // Generating cycle: key generates value
  const GENERATING = {
    '木': ['火'], '火': ['土'], '土': ['金'], '金': ['水'], '水': ['木']
  };
  // Each key controls (overcomes) the value(s)
  const CONTROLLING = {
    '木': ['土'], '土': ['水'], '水': ['火'], '火': ['金'], '金': ['木']
  };

  // Polarity compatibility (天干合)
  const STEM_COMBINATIONS = {
    '甲_丙': { score: 80, desc: 'Mutual inspiration — creative and dynamic partnership.', polarity: 'Compatible' },
    '甲_丁': { score: 65, desc: 'Warm connection — fire illuminates wood\'s growth.', polarity: 'Neutral' },
    '甲_戊': { score: 60, desc: 'Wood parts earth — gentle tension that drives change.', polarity: 'Neutral' },
    '甲_己': { score: 70, desc: 'Wood harmonizes with earth — balanced and supportive.', polarity: 'Compatible' },
    '甲_庚': { score: 45, desc: 'Metal chops wood — strong friction, needs maturity.', polarity: 'Challenging' },
    '甲_辛': { score: 50, desc: 'A clash of nature — work through differences.', polarity: 'Challenging' },
    '甲_壬': { score: 75, desc: 'Both growth-oriented — expansive partnership.', polarity: 'Compatible' },
    '甲_癸': { score: 60, desc: 'Water nourishes wood — patience and depth.', polarity: 'Neutral' },
    '乙_丙': { score: 70, desc: 'Yi wood feeds Bing fire — generous warmth.', polarity: 'Compatible' },
    '乙_丁': { score: 80, desc: 'Two fires together — passionate and intense bond.', polarity: 'Very Compatible' },
    '乙_戊': { score: 50, desc: 'Gentle wood vs stubborn earth — requires compromise.', polarity: 'Neutral' },
    '乙_己': { score: 65, desc: 'Wood and earth — nurturing and grounded.', polarity: 'Neutral' },
    '乙_庚': { score: 55, desc: 'Wood meets metal — friction but also refinement.', polarity: 'Challenging' },
    '乙_辛': { score: 75, desc: 'Yi and Xin — elegant and refined partnership.', polarity: 'Compatible' },
    '乙_壬': { score: 60, desc: 'Water flows around wood — adaptive and fluid.', polarity: 'Neutral' },
    '乙_癸': { score: 80, desc: 'Gentle rain nurtures sapling — deep emotional bond.', polarity: 'Very Compatible' },
    '丙_丙': { score: 75, desc: 'Two suns — brilliant but may overheat together.', polarity: 'Neutral' },
    '丙_丁': { score: 90, desc: 'Fire and fire — highest passion and shared vision.', polarity: 'Very Compatible' },
    '丙_戊': { score: 55, desc: 'Fire shapes earth — creative output together.', polarity: 'Neutral' },
    '丙_己': { score: 70, desc: 'Fire softens earth — patience from the earth side.', polarity: 'Compatible' },
    '丙_庚': { score: 40, desc: 'Fire melts metal — one must yield to the other.', polarity: 'Difficult' },
    '丙_辛': { score: 65, desc: 'Fire refines metal — mutual appreciation.', polarity: 'Neutral' },
    '丙_壬': { score: 50, desc: 'Fire vs water — strong tension, conscious effort needed.', polarity: 'Challenging' },
    '丙_癸': { score: 60, desc: 'Fire meets rain — cool relief, natural balance.', polarity: 'Neutral' },
    '丁_丁': { score: 80, desc: 'Two lamps — intimate and quietly brilliant.', polarity: 'Compatible' },
    '丁_戊': { score: 60, desc: 'Fire on earth — practical and creative balance.', polarity: 'Neutral' },
    '丁_己': { score: 75, desc: 'Ding and Ji — fire and earth, deeply grounded passion.', polarity: 'Compatible' },
    '丁_庚': { score: 55, desc: 'Fire vs metal — both strong, must respect each other.', polarity: 'Challenging' },
    '丁_辛': { score: 85, desc: 'Beautiful refinement — artistic and harmonious pair.', polarity: 'Very Compatible' },
    '丁_壬': { score: 60, desc: 'Fire vs water — tension creates creative spark.', polarity: 'Neutral' },
    '丁_癸': { score: 70, desc: 'Fire and water — yin balance, emotionally rich.', polarity: 'Compatible' },
    '戊_戊': { score: 80, desc: 'Two mountains — reliable but can be rigid.', polarity: 'Neutral' },
    '戊_己': { score: 85, desc: 'Twin earth — perfect stability and understanding.', polarity: 'Very Compatible' },
    '戊_庚': { score: 70, desc: 'Earth shapes metal — productive and complementary.', polarity: 'Compatible' },
    '戊_辛': { score: 60, desc: 'Earth and metal — refinement process together.', polarity: 'Neutral' },
    '戊_壬': { score: 50, desc: 'Earth dams water — tension but also dynamic.', polarity: 'Challenging' },
    '戊_癸': { score: 65, desc: 'Earth and rain — quiet and reflective bond.', polarity: 'Neutral' },
    '己_己': { score: 75, desc: 'Twin soil — nurturing, domestic harmony.', polarity: 'Compatible' },
    '己_庚': { score: 60, desc: 'Earth nurtures metal — supportive partnership.', polarity: 'Neutral' },
    '己_辛': { score: 80, desc: 'Soil creates gems — growth and refinement together.', polarity: 'Very Compatible' },
    '己_壬': { score: 55, desc: 'Earth vs water — balance through give and take.', polarity: 'Neutral' },
    '己_癸': { score: 70, desc: 'Earth and moisture — fertile and productive.', polarity: 'Compatible' },
    '庚_庚': { score: 70, desc: 'Two blades — sharp but may cut each other.', polarity: 'Neutral' },
    '庚_辛': { score: 85, desc: 'Metal and metal — refined, shared standards, elite bond.', polarity: 'Very Compatible' },
    '庚_壬': { score: 65, desc: 'Metal parts water — dynamic tension, useful conflict.', polarity: 'Neutral' },
    '庚_癸': { score: 50, desc: 'Metal meets dew — a delicate, sensitive pairing.', polarity: 'Challenging' },
    '辛_辛': { score: 75, desc: 'Two gems — elegant, artistic, high standards.', polarity: 'Compatible' },
    '辛_壬': { score: 60, desc: 'Metal parts water — refreshing but unsettling.', polarity: 'Neutral' },
    '辛_癸': { score: 80, desc: 'Metal and water — wisdom meets refinement.', polarity: 'Very Compatible' },
    '壬_壬': { score: 80, desc: 'Two rivers — free-flowing, adventurous, may drift.', polarity: 'Compatible' },
    '壬_癸': { score: 85, desc: 'Rivers merge — deeply intuitive, emotionally aligned.', polarity: 'Very Compatible' },
    '癸_癸': { score: 75, desc: 'Two springs — poetic, private, very intimate.', polarity: 'Compatible' }
  };

  // Default when combination not listed
  const STEM_DEFAULT = { score: 55, desc: 'A unique pairing — compatibility depends on other chart elements.', polarity: 'Neutral' };

  // Day Pillar combination readings
  const DAY_PILLAR_READINGS = {
    '甲_甲': { score: 70, title: 'Twin Wood — Mutual Growth', desc: 'Both of you share a wood nature — ambitious, expansive, and growth-oriented. You understand each other\'s drive. Together you can build something substantial. Be careful of competition; let each other shine.' },
    '甲_乙': { score: 80, title: 'Wood Harmony — Nurturing Bond', desc: 'Jia and Yi wood complement each other beautifully. You provide warmth and encouragement for each other\'s growth. This is a deeply supportive and harmonious match with strong emotional resonance.' },
    '甲_丙': { score: 85, title: 'The Creative Pair', desc: 'Yang Wood ignites Yang Fire — a powerful creative and intellectual partnership. You inspire each other\'s ambition and passion. This match brings energy, excitement, and a shared sense of purpose.' },
    '甲_丁': { score: 78, title: 'Fire Nurtures Wood', desc: 'Jia wood is nourished by Ding fire — a warm, giving relationship. One provides direction and strength, the other provides warmth and illumination. A balanced and fulfilling pairing.' },
    '甲_戊': { score: 55, title: 'The Gentle Tension', desc: 'Wood parts earth — a relationship that naturally creates some friction but also drives both of you to grow. You\'ll need to consciously appreciate your differences as strengths.' },
    '甲_己': { score: 82, title: 'Heaven Meets Earth', desc: 'The heavenly trunk meets the earthly branch — a profoundly balanced pairing. Wood provides vision, earth provides substance. This is a marriage and partnership archetype in classical BaZi.' },
    '甲_庚': { score: 35, title: 'Metal vs Wood — The Battle', desc: 'Metal chops wood — this is one of the most challenging combinations. Both of you have strong, unyielding energy. Only works if both have high maturity and emotional intelligence.' },
    '甲_辛': { score: 45, title: 'A Delicate Clash', desc: 'Metal on wood creates friction. Your styles of expressing yourself are very different. This pairing requires conscious effort and mutual respect to thrive.' },
    '甲_壬': { score: 75, title: 'Flowing Waters', desc: 'Ren water surrounds Jia wood — a relationship of nourishment and growth. You give each other space to expand while providing emotional depth. A strong intellectual and emotional match.' },
    '甲_癸': { score: 70, title: 'Rain on the Mountain', desc: 'Gui water nourishes Jia wood with gentle rain — a poetic and romantic pairing. You have deep emotional intuition and can sense each other\'s needs without words.' },
    '乙_乙': { score: 75, title: 'Twin Saplings', desc: 'Two Yi wood souls — gentle, artistic, and deeply feeling. You understand each other instinctively. The challenge is that both can be overly sensitive; nurture open communication.' },
    '乙_丙': { score: 80, title: 'Fire Feeds Wood', desc: 'Yi wood is generously fed by Bing fire. This is a warm, encouraging, and growth-oriented relationship. You help each other flourish and bring out the best in one another.' },
    '乙_丁': { score: 88, title: 'Fire Within Wood', desc: 'One of the most romantic and passionate combinations in BaZi. Two types of fire within a wood chart. Your emotional worlds interweave deeply. Strong chemistry, intense connection.' },
    '乙_戊': { score: 58, title: 'Wood and Earth', desc: 'The gentle and the grounded — a balancing act. Wood\'s flexibility meets earth\'s stability. Not always easy, but differences can be complementary with conscious effort.' },
    '乙_己': { score: 78, title: 'The Garden Pair', desc: 'Yi wood and Ji earth — a relationship that feels like tending a beautiful garden. Nurturing, stable, and deeply satisfying over the long term. Strong domestic harmony.' },
    '乙_庚': { score: 40, title: "The Sculptor’s Edge", desc: 'Metal attempts to shape wood — friction is inherent. Your approaches to life and love differ significantly. This can work with much mutual respect and patience.' },
    '乙_辛': { score: 82, title: 'Refined Partnership', desc: 'Yi wood and Xin metal — elegant, artistic, and socially graceful together. You share an appreciation for beauty and refinement. A refined, stylish partnership.' },
    '乙_壬': { score: 65, title: 'Rivers Flow Around', desc: 'Water flows around wood — adaptive and fluid. You give each other room while remaining connected. A relationship that values freedom within intimacy.' },
    '乙_癸': { score: 85, title: 'Rain and Sapling', desc: 'Gui water on Yi wood — the most romantic pairing in BaZi. Deep emotional intuition, psychic-like awareness of each other\'s needs. A soulful, artistic bond.' },
    '丙_丙': { score: 70, title: 'Twin Suns', desc: 'Two Bing suns — brilliant, warm, and commanding attention. You share a zest for life and a creative spark. The challenge is managing the heat — too much fire can burn out.' },
    '丙_丁': { score: 92, title: 'The Blazing Pair — Peak Compatibility', desc: 'Bing and Ding fire together — the highest passion and intensity. Your energies align perfectly. This is a rare, powerful connection. Guard against ego clashes.' },
    '丙_戊': { score: 55, title: 'Fire Shapes Earth', desc: 'Fire melts and shapes earth — a productive but potentially exhausting relationship. You can create great things together but need to balance energy expenditure.' },
    '丙_己': { score: 75, title: 'The Sun and Soil', desc: 'Bing fire with Ji earth — fire illuminates earth\'s beauty, earth grounds fire\'s intensity. A balanced, productive, and mutually appreciative pairing.' },
    '丙_庚': { score: 30, title: 'Fire vs Metal — Critical Clash', desc: 'The most challenging combination. Fire melts metal — you are in direct opposition. This pairing requires extraordinary maturity, patience, and often outside support.' },
    '丙_辛': { score: 72, title: 'Fire Refines Metal', desc: 'Fire\'s heat refines metal\'s beauty — a relationship of mutual appreciation and refinement. You help each other become the best version of yourselves.' },
    '丙_壬': { score: 45, title: 'Fire Meets Water', desc: 'Water quenches fire — a natural opposition. Your fundamental natures pull in opposite directions. This pairing needs very conscious effort to find balance.' },
    '丙_癸': { score: 62, title: 'The Cooling Rain', desc: 'Dew (Gui) tempers the sun (Bing) — tension that can be productive if channeled well. You bring different but complementary energies to the relationship.' },
    '丁_丁': { score: 78, title: 'Twin Flames', desc: 'Two lamps illuminate each other — intimate, quietly brilliant, emotionally rich. You understand each other\'s inner worlds deeply. A private, profound bond.' },
    '丁_戊': { score: 62, title: 'Fire Illuminates Earth', desc: 'Ding fire on Wu earth — you ground each other\'s extremes. Practical wisdom meets emotional depth. A stable, grounding partnership.' },
    '丁_己': { score: 80, title: 'The Mountain Pair', desc: 'Ding fire within Ji earth — a deeply grounded and passionate match. Earth provides stability for fire\'s intensity. Warm, reliable, and emotionally deep.' },
    '丁_庚': { score: 50, title: 'Fire and Blade', desc: 'Metal reshaped by fire — tension with potential for great transformation. You challenge each other constantly. This can be productive friction or destructive conflict.' },
    '丁_辛': { score: 88, title: 'Beauty and Art', desc: 'One of the most aesthetically harmonious pairings. You share refined tastes, emotional intelligence, and social grace. A beautiful partnership in every sense.' },
    '丁_壬': { score: 58, title: 'Fire vs Free Water', desc: 'Tension between fixed fire and flowing water. You pull in different directions. This pairing needs to find shared activities and mutual respect for differences.' },
    '丁_癸': { score: 75, title: 'Fire and Moonlight', desc: 'A poetic pairing — firelight by moonlight. You share emotional depth, creativity, and a rich inner world. A romantic, private, deeply connected bond.' },
    '戊_戊': { score: 72, title: 'Twin Mountains', desc: 'Two mountains side by side — stable, solid, reliable. You understand each other\'s need for security and groundedness. The challenge is embracing change together.' },
    '戊_己': { score: 90, title: 'Earthly Harmony — Near Perfect', desc: 'Wu and Ji earth together — the most stable, reliable pairing in BaZi. You understand each other\'s needs instinctively. A lasting, deeply loyal bond.' },
    '戊_庚': { score: 70, title: 'Earth Nurtures Metal', desc: 'Earth nurtures and shapes metal — a productive, materializing partnership. You manifest ideas into reality together. Strong in business and life partnerships.' },
    '戊_辛': { score: 65, title: 'Earth and Gems', desc: 'Earth produces and holds gems — a refining process. You appreciate each other\'s value. A relationship that grows more beautiful and valuable over time.' },
    '戊_壬': { score: 48, title: 'Earth Dams Water', desc: 'Earth\'s stability vs water\'s flow — natural opposition. Your approaches to life are very different. Balance comes from accepting and channeling each other\'s energy.' },
    '戊_癸': { score: 68, title: 'The Fertile Valley', desc: 'Dew on the mountain — a quiet, reflective pairing. You have different energies but find harmony in your differences. A peaceful, intellectually rich bond.' },
    '己_己': { score: 78, title: 'Twin Soil', desc: 'Two nurturing earth signs — domestic harmony, shared values, strong sense of home. You take care of each other deeply. A comfortable, enduring bond.' },
    '己_庚': { score: 65, title: 'Earth and Metal', desc: 'Earth holds and metal is held — a mutually supportive pairing. You appreciate each other\'s strength and stability. A grounded, practical partnership.' },
    '己_辛': { score: 82, title: 'Soil Creates Jewels', desc: 'Ji earth creates Geng metal — a relationship of refinement and growth. You bring out beauty and value in each other. Elegant, satisfying, and lasting.' },
    '己_壬': { score: 52, title: 'Earth vs Flowing Water', desc: 'Earth\'s solidity vs water\'s fluidity — balance through give and take. Your emotional styles differ but can complement each other with conscious effort.' },
    '己_癸': { score: 75, title: 'Earth and Rain', desc: 'Moisture on soil — fertile, productive, deeply connected. You have rich inner lives and emotional depth together. A quiet, soulful partnership.' },
    '庚_庚': { score: 68, title: 'Twin Blades', desc: 'Two swords side by side — powerful but can cut each other. You share strength, directness, and high standards. The challenge is learning to yield gracefully.' },
    '庚_辛': { score: 90, title: 'Refined Partnership', desc: 'Geng and Xin together — the most refined and elegant pairing in BaZi. You share high standards, social grace, and mutual respect. An elite, prestigious bond.' },
    '庚_壬': { score: 60, title: 'Metal Parts Water', desc: 'Metal\'s sharpness parts water\'s flow — dynamic tension. You create productive friction. This is a partnership of debate, challenge, and mutual sharpening.' },
    '庚_癸': { score: 48, title: 'A Delicate Balance', desc: 'Metal meets morning dew — both delicate and refined, yet easily disrupted. Your emotional sensitivities need careful handling. Nurture this with gentleness.' },
    '辛_辛': { score: 76, title: 'Twin Gems', desc: 'Two beautiful gems — refined, artistic, socially graceful. You appreciate each other\'s beauty and taste. A sophisticated partnership with shared values.' },
    '辛_壬': { score: 58, title: 'Metal in Water', desc: 'Metal in flowing water — refreshing but can feel unstable. Your emotional approaches differ. Balance comes from appreciating your complementary energies.' },
    '辛_癸': { score: 85, title: 'Jewels and Dew', desc: 'One of the most beautiful and refined pairings. You share emotional depth, artistic sensitivity, and a refined worldview. A deeply romantic and intellectual bond.' },
    '壬_壬': { score: 75, title: 'Twin Rivers', desc: 'Two flowing rivers — free-spirited, adventurous, intellectually stimulating. You share a love of exploration and freedom. The risk is drifting apart without anchoring.' },
    '壬_癸': { score: 92, title: 'Rivers Merge — Peak Harmony', desc: 'Yang and Yin water merge — the most emotionally aligned pairing. You share profound intuition, emotional depth, and understanding. A soul-deep bond.' },
    '癸_癸': { score: 78, title: 'Twin Springs', desc: 'Two quiet springs — poetic, private, deeply emotional. You understand each other\'s inner worlds perfectly. A romantic, intimate, and sensitive partnership.' }
  };

  const DAY_DEFAULT = { score: 55, title: 'A Unique Bond', desc: 'Your Day Pillars create a unique chemistry — neither entirely smooth nor difficult. The harmony depends on how you both nurture this relationship.' };

  // Overall score description
  function getScoreTier(score) {
    if (score >= 85) return { label: 'Exceptional Harmony', color: '#5aad68', tier: 5 };
    if (score >= 75) return { label: 'Strong Compatibility', color: '#8fbc8f', tier: 4 };
    if (score >= 65) return { label: 'Good Match', color: '#d4a574', tier: 3 };
    if (score >= 55) return { label: 'Balanced Pairing', color: '#c49a6c', tier: 2 };
    if (score >= 45) return { label: 'Growth Opportunity', color: '#e8a87c', tier: 1 };
    return { label: 'Requires Effort', color: '#e85d4a', tier: 0 };
  }

  // Calculate generating (相生) compatibility
  function calcGeneratingScore(elem1, elem2) {
    let score = 0;
    // elem1 generates elem2
    if (GENERATING[elem1] && GENERATING[elem1].includes(elem2)) score += 35;
    // elem2 generates elem1
    if (GENERATING[elem2] && GENERATING[elem2].includes(elem1)) score += 35;
    // Neither generates the other
    if (score === 0) score += 20;
    return score;
  }

  // Calculate controlling (相克) compatibility
  function calcControllingScore(elem1, elem2) {
    let score = 0;
    if (CONTROLLING[elem1] && CONTROLLING[elem1].includes(elem2)) score -= 15;
    if (CONTROLLING[elem2] && CONTROLLING[elem2].includes(elem1)) score -= 15;
    return score;
  }

  function calcElementCompatibility(elem1, elem2) {
    let score = 50;
    score += calcGeneratingScore(elem1, elem2);
    score += calcControllingScore(elem1, elem2);
    // Both same element
    if (elem1 === elem2) score = 60;
    // Best pairs in generating cycle
    const bestPairs = [['木','火'],['火','土'],['土','金'],['金','水'],['水','木']];
    bestPairs.forEach(pair => {
      if ((elem1 === pair[0] && elem2 === pair[1]) || (elem1 === pair[1] && elem2 === pair[0])) {
        score = Math.max(score, 80);
      }
    });
    return Math.max(0, Math.min(100, score));
  }

  function calcPolarityScore(stem1, stem2) {
    const key = stem1 + '_' + stem2;
    const revKey = stem2 + '_' + stem1;
    const combo = STEM_COMBINATIONS[key] || STEM_COMBINATIONS[revKey] || STEM_DEFAULT;
    return combo;
  }

  function calcDayPillarScore(dayStem1, dayStem2) {
    const key = dayStem1 + '_' + dayStem2;
    const revKey = dayStem2 + '_' + dayStem1;
    return DAY_PILLAR_READINGS[key] || DAY_PILLAR_READINGS[revKey] || DAY_DEFAULT;
  }

  function analyzeCompatibility(data1, data2) {
    // data1 and data2 are BaZi engine results
    const day1 = data1.pillars.day.stem;
    const day2 = data2.pillars.day.stem;
    const elem1 = data1.pillars.day.element;
    const elem2 = data2.pillars.day.element;
    const dom1 = data1.elements.dominant;
    const dom2 = data2.elements.dominant;

    // Day Pillar (最重要的)
    const dayReading = calcDayPillarScore(day1, day2);

    // Polarity (天干合)
    const polarityReading = calcPolarityScore(day1, day2);

    // Element compatibility (from day elements)
    const elemScore = calcElementCompatibility(elem1, elem2);

    // Overall score: weighted average
    const overallScore = Math.round(
      dayReading.score * 0.40 +
      polarityReading.score * 0.30 +
      elemScore * 0.30
    );

    const tier = getScoreTier(overallScore);

    // Element harmony analysis
    const gen1 = GENERATING[elem1] || [];
    const gen2 = GENERATING[elem2] || [];
    const ctrl1 = CONTROLLING[elem1] || [];
    const ctrl2 = CONTROLLING[elem2] || [];

    let harmonyType = 'neutral';
    let harmonyDesc = '';
    if (gen1.includes(elem2) && gen2.includes(elem1)) {
      harmonyType = 'mutual-nurture';
      harmonyDesc = `Your elements naturally nurture each other. ${ELEM_CN[elem1]} and ${ELEM_CN[elem2]} create a flowing, supportive energy that sustains your relationship through challenges.`;
    } else if (gen1.includes(elem2)) {
      harmonyType = 'nurturing';
      harmonyDesc = `${ELEM_CN[elem1]} tends to energize ${ELEM_CN[elem2]}'s nature — one gives more actively while the other receives. A balanced flow when both are aware of it.`;
    } else if (gen2.includes(elem1)) {
      harmonyType = 'receiving';
      harmonyDesc = `${ELEM_CN[elem2]} naturally fuels ${ELEM_CN[elem1]}'s nature. The dynamic is reversed — awareness of this flow prevents misunderstandings.`;
    } else if (ctrl1.includes(elem2) || ctrl2.includes(elem1)) {
      harmonyType = 'challenging';
      harmonyDesc = `Your elements naturally challenge each other. This creates friction but also dynamism — used consciously, this tension can drive growth. It requires maturity from both.`;
    } else if (elem1 === elem2) {
      harmonyType = 'resonant';
      harmonyDesc = `You share the same elemental nature (${ELEM_CN[elem1]}). You understand each other instinctively but may need to consciously develop different perspectives.`;
    } else {
      harmonyDesc = `Your elemental natures are different but not in direct conflict. You bring complementary strengths to the relationship.`;
    }

    // Strengths and challenges
    const strengths = [];
    const challenges = [];

    if (overallScore >= 75) {
      strengths.push('Natural emotional resonance and understanding');
      strengths.push('Shared values and life direction');
    } else if (overallScore >= 60) {
      strengths.push('Good communication potential');
      strengths.push('Complementary elemental energies');
    }

    if (overallScore < 65) {
      challenges.push('Different emotional languages may cause misunderstandings');
      challenges.push('Elemental tensions need conscious navigation');
    }
    if (dayReading.score < 55) {
      challenges.push('Day pillar dynamics may create friction in close quarters');
    }

    // Tips for the relationship
    const tips = [];
    if (harmonyType === 'mutual-nurture') {
      tips.push('Your natural flow of energy is your greatest asset — trust it.');
      tips.push('Channel this harmony into shared creative or nurturing projects.');
    } else if (harmonyType === 'nurturing') {
      tips.push(`${ELEM_CN[elem1]} types: remember to actively appreciate ${ELEM_CN[elem2]}'s unique gifts.`);
      tips.push(`${ELEM_CN[elem2]} types: communicate your needs clearly — ${ELEM_CN[elem1]} responds to directness.`);
    } else if (harmonyType === 'receiving') {
      tips.push(`${ELEM_CN[elem2]} types: your support is deeply felt, don\'t underestimate your influence.`);
      tips.push(`${ELEM_CN[elem1]} types: express gratitude — this nourishment shouldn\'t be taken for granted.`);
    } else if (harmonyType === 'challenging') {
      tips.push('Your friction is productive only when both partners commit to conscious growth.');
      tips.push('Feng Shui adjustments for each person\'s weak element can dramatically help balance.');
    }

    // Best directions for love (shared from each person's chart)
    const bestDirs1 = (data1.directions.auspicious || []).slice(0, 2);
    const bestDirs2 = (data2.directions.auspicious || []).slice(0, 2);
    const sharedGoodDirs = bestDirs1.filter(d => bestDirs2.includes(d));
    const loveDirectionTip = sharedGoodDirs.length > 0
      ? `Align your shared spaces (bedroom, dining area) toward ${sharedGoodDirs[0]} — it\'s auspicious for both of you.`
      : `Create a neutral love corner in your home using elements that balance both your charts.`;

    tips.push(loveDirectionTip);

    return {
      overall: overallScore,
      tier,
      dayPillar: {
        score: dayReading.score,
        title: dayReading.title,
        desc: dayReading.desc,
        p1: { stem: day1, stemName: STEM_TO_EN[day1], branch: data1.pillars.day.branch, branchName: BRANCH_TO_EN[data1.pillars.day.branch], element: elem1, elementName: ELEM_CN[elem1] },
        p2: { stem: day2, stemName: STEM_TO_EN[day2], branch: data2.pillars.day.branch, branchName: BRANCH_TO_EN[data2.pillars.day.branch], element: elem2, elementName: ELEM_CN[elem2] }
      },
      polarity: {
        score: polarityReading.score,
        desc: polarityReading.desc,
        label: polarityReading.polarity
      },
      element: {
        score: elemScore,
        elem1Name: ELEM_CN[elem1], elem2Name: ELEM_CN[elem2],
        harmonyType, harmonyDesc
      },
      strengths,
      challenges,
      tips,
      pillars: {
        p1: data1.pillars, p2: data2.pillars,
        elements1: data1.elements, elements2: data2.elements
      }
    };
  }

  global.Compatibility = {
    analyzeCompatibility,
    getScoreTier
  };

})(typeof window !== 'undefined' ? window : this);
