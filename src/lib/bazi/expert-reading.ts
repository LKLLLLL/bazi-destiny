import BaZiEngine from './engine.ts';

interface ReadingPillar {
  stem: string;
  branch: string;
  element: string;
}

export interface ExpertReadingData {
  pillars: {
    year: ReadingPillar;
    month: ReadingPillar;
    day: ReadingPillar;
    hour?: ReadingPillar;
  };
  elements: {
    percentages: Record<string, number>;
    dominant: string;
    deficient: string;
  };
  isThreePillar?: boolean;
}

export interface ExpertVerdict {
  title: string;
  lead: string;
  evidence: string[];
  timingTitle: string;
  timing: string;
  action: string;
  maxim: string;
  yearLabel: string;
}

const STEM_ELEMENT: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
};

const STEM_POLARITY: Record<string, 'yang' | 'yin'> = {
  '甲': 'yang', '乙': 'yin', '丙': 'yang', '丁': 'yin', '戊': 'yang',
  '己': 'yin', '庚': 'yang', '辛': 'yin', '壬': 'yang', '癸': 'yin',
};

const STEM_EN: Record<string, string> = {
  '甲': 'Jia Wood', '乙': 'Yi Wood', '丙': 'Bing Fire', '丁': 'Ding Fire', '戊': 'Wu Earth',
  '己': 'Ji Earth', '庚': 'Geng Metal', '辛': 'Xin Metal', '壬': 'Ren Water', '癸': 'Gui Water',
};

const ELEMENT_EN: Record<string, string> = {
  '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water',
};

const GENERATES: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const CONTROLS: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
const BRANCH_ELEMENT: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

const CLASHES = [['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥']];
const HARMONIES = [['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未']];

const STRUCTURES: Record<string, { title: string; lead: string; action: string }> = {
  '比肩': {
    title: 'Self-Command Is Your Central Theme',
    lead: 'Your chart is built to advance through personal conviction. You do best when you choose the direction, set the standard, and stop waiting for outside permission.',
    action: 'Lead one priority directly. Competition sharpens you, but scattered comparison drains the authority this chart is meant to build.',
  },
  '劫财': {
    title: 'Competition Must Become Leverage',
    lead: 'Your chart grows through people, rivalry, and shared momentum. The decisive lesson is to choose allies carefully and keep ownership, money, and responsibility clearly defined.',
    action: 'Collaborate where speed matters, but keep boundaries explicit. Your strongest gains come when collective energy serves a plan you still control.',
  },
  '食神': {
    title: 'Talent Must Become Visible Work',
    lead: 'Your chart carries a productive, expressive current. Skill, teaching, creation, and steady output are not side interests here; they are the route through which fortune opens.',
    action: 'Finish and publish something useful. Consistent craft will create more opportunity than waiting for a perfect moment or a dramatic breakthrough.',
  },
  '伤官': {
    title: 'Your Edge Is Meant to Change the Rules',
    lead: 'Your chart is strongest when intelligence becomes a distinct point of view. You are not designed to disappear inside rigid systems; you are designed to improve, challenge, or outgrow them.',
    action: 'Turn criticism into a proposal, product, or body of work. Directness creates influence when it is paired with timing and proof.',
  },
  '偏财': {
    title: 'Opportunity Favors Movement',
    lead: 'Your chart recognizes openings quickly and gains through circulation: people, projects, information, and resources moving at the right time.',
    action: 'Pursue the opportunity with the clearest real-world return. Keep reserves and terms clear so momentum becomes lasting value rather than temporary excitement.',
  },
  '正财': {
    title: 'Structure Is Your Wealth Engine',
    lead: 'Your chart builds fortune through reliability, stewardship, and accumulated trust. The path is not random luck; it is turning repeatable work into durable resources.',
    action: 'Strengthen the system that already produces results. Stable agreements, measured growth, and disciplined follow-through are your winning pattern.',
  },
  '七杀': {
    title: 'Pressure Is Forging Authority',
    lead: 'Your chart carries decisive pressure. Challenges arrive early or clearly because this structure is meant to develop courage, command, and the ability to act when others hesitate.',
    action: 'Choose the hard responsibility that builds real authority. Discipline turns pressure into rank; impulsive conflict wastes it.',
  },
  '正官': {
    title: 'Responsibility Becomes Recognition',
    lead: 'Your chart advances through order, standards, and trusted responsibility. When your conduct is consistent, status and influence follow naturally.',
    action: 'Take the role that asks for judgment and accountability. Reputation is the main asset this chart is building now.',
  },
  '偏印': {
    title: 'Unusual Insight Is Your Advantage',
    lead: 'Your chart learns through pattern, intuition, and independent study. You often understand the hidden structure before others can name it.',
    action: 'Protect time for deep work and turn private insight into a method others can use. Isolation only helps when it produces a clear result.',
  },
  '正印': {
    title: 'Knowledge Is Becoming Influence',
    lead: 'Your chart is supported by learning, guidance, and the ability to absorb complex systems. Preparation is not delay here; it is how your authority becomes difficult to replace.',
    action: 'Consolidate knowledge, credentials, or a trusted body of work. The next opening comes through mastery rather than speed.',
  },
};

const STRUCTURES_ZH: Record<string, { title: string; lead: string; action: string }> = {
  '比肩': { title: '主见就是你的立命之本', lead: '此命靠自立而成，越能自己定方向、立标准、扛结果，运势越容易打开。', action: '眼下只抓一件最重要的事亲自推进。竞争能催你成长，但不要把精力耗在无谓比较上。' },
  '劫财': { title: '把竞争变成人脉与势能', lead: '此命在合作、竞争和资源流动中见机会，真正的课题是识人、分责，并守住自己的边界。', action: '需要借力时大胆合作，但钱、权、责任必须先讲清楚。人多势众，仍要由你掌握方向。' },
  '食神': { title: '才华落地，福气自来', lead: '此命以技艺、表达、创造和稳定产出开运。你越能把本事做成看得见的成果，机会越会主动靠近。', action: '完成并公开一项有用的作品。持续精进，比等待所谓完美时机更能带来转机。' },
  '伤官': { title: '锋芒不是问题，失去章法才是', lead: '此命贵在见识独到、敢于破旧立新，不适合长期埋没在僵化规则里。', action: '把批评变成方案、作品或方法。锋芒配上时机与证据，就会从冲突变成影响力。' },
  '偏财': { title: '财在流动中来，机会在行动中显', lead: '此命对机会、人脉与资源变化十分敏锐，越能主动周转、连接和落地，越容易见财。', action: '优先追逐回报最清晰的机会，同时留足余地、讲明条件，才能把一时热度变成长久收益。' },
  '正财': { title: '稳定经营，就是你的聚财之道', lead: '此命以可靠、节制和长期积累成事，财富并非偶然，而是把重复有效的事情做成系统。', action: '先加固已经能产生结果的路径。稳定契约、稳步增长和有始有终，就是你的赢法。' },
  '七杀': { title: '压力终会锻成权柄', lead: '此命带着明显的挑战与决断之气，越早学会在压力中行动，越能形成别人难以替代的胆识与掌控力。', action: '主动承担能换来资历、能力或权责的位置。以纪律驾驭压力，切忌逞强硬碰。' },
  '正官': { title: '责任越重，名位越稳', lead: '此命以秩序、标准和可信赖的担当见长。行为越稳定，名望、职位与影响力越会随之而来。', action: '选择需要判断力与责任心的位置。你现在真正积累的资产，是别人对你的信任。' },
  '偏印': { title: '独到洞察，就是你的先手', lead: '此命善于从复杂现象中看见隐藏规律，直觉、策略与独立研究能力是重要优势。', action: '给深度思考留出完整时间，再把私人领悟整理成别人能使用的方法。独处必须产生成果。' },
  '正印': { title: '学识正在变成影响力', lead: '此命得益于学习、贵人与系统知识，准备并非拖延，而是在建立难以被替代的根基。', action: '集中完善知识、资历或可信作品。下一次真正的机会，来自精通，而不是抢快。' },
};

const TEN_GOD_FOCUS_ZH: Record<string, string> = {
  '比肩': '自我定位、信心与竞争', '劫财': '合作、边界与共同资源', '食神': '技能、产出与成果',
  '伤官': '表达、改革与个人声量', '偏财': '机会、人脉与流动之财', '正财': '收入、经营与长期积累',
  '七杀': '压力、胆识与权责', '正官': '责任、名望与职位', '偏印': '独立洞察、策略与深研', '正印': '学习、助力与专业根基',
};

const ELEMENT_MAXIMS_ZH: Record<string, string> = {
  '木': '木贵有根，先定一方，再展枝叶；方向一明，生机自盛。',
  '火': '火贵有主，照亮一处胜过四散燃烧；专注才会把热情炼成影响力。',
  '土': '土贵守中，慢筑根基；你能沉淀下来的，终会成为别人倚重的分量。',
  '金': '金贵去杂，标准越清，决断越准；你的好运藏在取舍与边界之中。',
  '水': '水贵流通而不失其向；看见别人忽略的路径，就是你的先机。',
};

const TEN_GOD_FOCUS: Record<string, string> = {
  '比肩': 'self-direction, confidence, and competition',
  '劫财': 'alliances, boundaries, and shared resources',
  '食神': 'craft, output, and visible results',
  '伤官': 'expression, reform, and a stronger public voice',
  '偏财': 'opportunity, circulation, and flexible wealth',
  '正财': 'income, stewardship, and durable resources',
  '七杀': 'pressure, courage, and earned authority',
  '正官': 'responsibility, reputation, and status',
  '偏印': 'independent insight, strategy, and deep study',
  '正印': 'learning, support, and formal mastery',
};

const ELEMENT_MAXIMS: Record<string, string> = {
  '木': 'Grow toward one clear horizon; a tree becomes powerful by committing its roots before spreading its branches.',
  '火': 'Be visible, but direct the flame; focused radiance creates influence, scattered heat creates exhaustion.',
  '土': 'Hold the center and build slowly; what you make durable becomes the ground others rely on.',
  '金': 'Cut away what is vague; precision, standards, and clean decisions are where your fortune gathers.',
  '水': 'Keep moving without losing direction; your advantage is seeing the route that rigid minds miss.',
};

function sourceElement(target: string): string {
  return Object.keys(GENERATES).find((element) => GENERATES[element] === target) || '土';
}

function getChartStructure(data: ExpertReadingData, lang: 'en' | 'zh' = 'en') {
  const zh = lang === 'zh';
  const dayStem = data.pillars.day.stem;
  const dayElement = data.pillars.day.element;
  const rolePillars = [
    { label: zh ? '年干' : 'Year Stem', pillar: data.pillars.year },
    { label: zh ? '月干' : 'Month Stem', pillar: data.pillars.month },
  ];
  if (!data.isThreePillar && data.pillars.hour) rolePillars.push({ label: zh ? '时干' : 'Hour Stem', pillar: data.pillars.hour });
  const roles = rolePillars.map(({ label, pillar }) => ({ label, pillar, role: getTenGod(dayStem, pillar.stem) }));
  const branchElements = [data.pillars.year, data.pillars.month, data.pillars.day, data.pillars.hour]
    .filter((pillar): pillar is ReadingPillar => Boolean(pillar))
    .map((pillar) => BRANCH_ELEMENT[pillar.branch]);
  const resourceElement = sourceElement(dayElement);
  const outputElement = GENERATES[dayElement];
  const wealthElement = CONTROLS[dayElement];
  const sevenKillings = roles.find(({ role }) => role === '七杀');
  const properOfficer = roles.find(({ role }) => role === '正官');
  const resourceRole = roles.find(({ role }) => role === '正印' || role === '偏印');
  const outputRole = roles.find(({ role }) => role === '食神' || role === '伤官');
  const wealthRole = roles.find(({ role }) => role === '正财' || role === '偏财');
  const hasResource = Boolean(resourceRole) || branchElements.includes(resourceElement);

  if (sevenKillings && hasResource) {
    return {
      title: zh ? '压力终会转化为权柄' : 'Pressure Is Meant to Become Authority',
      lead: zh ? '此命构成传统命理所说的“杀印相生”：七杀带来压力、竞争与决断，印星则把压力转成学习、保护与掌控。越承担真正的责任，命局层次越能显出来。' : 'Your chart carries the classical Seven Killings with Resource pattern: decisive pressure is present, but it is met by the force that turns pressure into learning, protection, and command. This is a chart that becomes stronger through real responsibility.',
      action: zh ? '主动承担能换来资历、能力或权责的位置，先用章法统领压力，压力才会为你所用。' : 'Accept the responsibility that develops rank, skill, or authority. Structure your effort before pressure structures it for you.',
      basis: zh ? `${sevenKillings.label}${sevenKillings.pillar.stem}透出七杀，命局又见${resourceElement}印相承，构成杀印相生：挑战生学习，学习化权柄。` : `${sevenKillings.label} ${sevenKillings.pillar.stem} carries 七杀, while ${ELEMENT_EN[resourceElement]} Resource is present in the chart. Traditional BaZi calls this 杀印相生: challenge feeds learning, and learning becomes authority.`,
    };
  }
  if (properOfficer && hasResource) {
    return {
      title: zh ? '守规成器，名位自来' : 'Discipline Is Becoming Recognition',
      lead: zh ? '此命官印相生，标准、学识与责任彼此扶助，名声和信用就是你向上走的主要阶梯。' : 'Your chart forms an Officer-and-Resource current. Standards, learning, and trusted responsibility reinforce one another, making reputation the main vehicle of advancement.',
      action: zh ? '选择标准清晰、长期信用更高的道路。你的地位来自真本事与可信度，不来自捷径。' : 'Choose the path with the clearest standards and strongest long-term credibility. Your chart gains status through mastery, not shortcuts.',
      basis: zh ? `${properOfficer.label}${properOfficer.pillar.stem}透出正官，命局又得${resourceElement}印相扶，官印相生，以学识与操守换来认可。` : `${properOfficer.label} ${properOfficer.pillar.stem} carries 正官, supported by ${ELEMENT_EN[resourceElement]} Resource in the chart. This 官印相生 pattern turns preparation and conduct into recognition.`,
    };
  }
  if (outputRole && wealthRole) {
    return {
      title: zh ? '才华生财，越做越有' : 'Talent Is Designed to Create Wealth',
      lead: zh ? '此命食伤与财星相接，创意、技艺、表达或实际产出，只要完成并进入交换，就能变成真正的资源。' : 'Your chart links expression with resources. Ideas, craft, communication, or visible output become valuable when they are finished, positioned, and exchanged in the real world.',
      action: zh ? '把一项本事包装成别人看得懂、愿意付费的成果。才华离开私域，财路才会打开。' : 'Package one skill into a result people can understand and pay for. The chart opens when talent leaves the private stage.',
      basis: zh ? `${outputRole.label}${outputRole.pillar.stem}为${outputRole.role}，命局又见${wealthElement}财，形成食伤生财，以输出换资源。` : `${outputRole.label} ${outputRole.pillar.stem} carries ${outputRole.role}, while ${ELEMENT_EN[wealthElement]} Wealth is present. This is the traditional 食伤生财 route: output creates resources.`,
    };
  }
  if (wealthRole && properOfficer) {
    return {
      title: zh ? '财能生官，资源终成位置' : 'Resources Are Building Position',
      lead: zh ? '此命财官相生，经营好人、钱与机会，不只会增加收入，也会带来位置、责任和持久影响力。' : 'Your chart links wealth with responsibility. Managing people, money, or opportunities well does more than create income; it creates standing and durable influence.',
      action: zh ? '把下一次机会当作信用考验。条件清楚、交付可靠，才能把资源真正换成位置。' : 'Treat the next opportunity as a stewardship test. Clear terms and reliable delivery convert access into position.',
      basis: zh ? `${wealthRole.label}${wealthRole.pillar.stem}为${wealthRole.role}，${properOfficer.label}${properOfficer.pillar.stem}为正官，财官相生，以资源承责任，以责任得名位。` : `${wealthRole.label} ${wealthRole.pillar.stem} carries ${wealthRole.role}, while ${properOfficer.label} ${properOfficer.pillar.stem} carries 正官. Traditional 财官相生 turns resources into responsibility and responsibility into status.`,
    };
  }
  if (outputRole && sevenKillings) {
    return {
      title: zh ? '以才制杀，本事就是底气' : 'Skill Is the Answer to Pressure',
      lead: zh ? '此命面对压力，最有效的方式不是硬碰，而是拿出更好的作品、更准的判断与无法忽视的结果。' : 'Your chart answers challenge through competence. Pressure does not need to be fought head-on; it is controlled by producing better work, sharper judgment, and a result others cannot ignore.',
      action: zh ? '压力越大，越要用完成度说话，不必把力气浪费在争辩上。' : 'When pressure rises, respond with a finished result rather than an argument. Skill is the authority this chart trusts most.',
      basis: zh ? `${sevenKillings.label}引动七杀，${outputRole.label}${outputRole.pillar.stem}又见${outputRole.role}，符合食伤制杀之理，以能力与产出收束压力。` : `${sevenKillings.label} activates 七杀 while ${outputRole.label} ${outputRole.pillar.stem} carries ${outputRole.role}. This follows the 食伤制杀 logic: ability and production bring pressure under control.`,
    };
  }

  const monthTenGod = getTenGod(dayStem, data.pillars.month.stem);
  if (zh) {
    return {
      ...STRUCTURES_ZH[monthTenGod],
      basis: `月干${data.pillars.month.stem}与日主${dayStem}构成${monthTenGod}。传统命理以月柱为社会环境与现实用事之枢纽，因此此十神定下命局最鲜明的行事主题。`,
    };
  }
  return {
    ...STRUCTURES[monthTenGod],
    basis: `The Month Stem ${data.pillars.month.stem} forms ${monthTenGod} relative to your ${STEM_EN[dayStem]} Day Master. In traditional BaZi, the Month Pillar sets the strongest social and practical climate of the chart.`,
  };
}

function samePair(a: string, b: string, pair: string[]): boolean {
  return (a === pair[0] && b === pair[1]) || (a === pair[1] && b === pair[0]);
}

export function getTenGod(dayStem: string, otherStem: string): string {
  const dayElement = STEM_ELEMENT[dayStem];
  const otherElement = STEM_ELEMENT[otherStem];
  const samePolarity = STEM_POLARITY[dayStem] === STEM_POLARITY[otherStem];
  if (dayElement === otherElement) return samePolarity ? '比肩' : '劫财';
  if (GENERATES[dayElement] === otherElement) return samePolarity ? '食神' : '伤官';
  if (CONTROLS[dayElement] === otherElement) return samePolarity ? '偏财' : '正财';
  if (CONTROLS[otherElement] === dayElement) return samePolarity ? '七杀' : '正官';
  return samePolarity ? '偏印' : '正印';
}

function getAnnualReading(data: ExpertReadingData, year: number, lang: 'en' | 'zh' = 'en') {
  const zh = lang === 'zh';
  const annual = BaZiEngine.calculateFourPillars(year, 8, 8, 12).pillars.year;
  const natalPillars = [data.pillars.year, data.pillars.month, data.pillars.day];
  if (!data.isThreePillar && data.pillars.hour) natalPillars.push(data.pillars.hour);
  const clash = natalPillars.find((pillar) => CLASHES.some((pair) => samePair(pillar.branch, annual.branch, pair)));
  const harmony = natalPillars.find((pillar) => HARMONIES.some((pair) => samePair(pillar.branch, annual.branch, pair)));
  const tenGod = getTenGod(data.pillars.day.stem, annual.stem);
  const label = `${year} ${annual.stem}${annual.branch}`;

  if (clash) {
    return {
      label,
      title: zh ? `${label}：变动与决断之年` : `${label}: A Year of Decisive Movement`,
      text: zh ? `流年${annual.branch}与命局${clash.stem}${clash.branch}构成${clash.branch}${annual.branch}冲。冲主动、主改、主重新安排，拖延已久的事情会被推到台前；同时${tenGod}发动，变化重点落在${TEN_GOD_FOCUS_ZH[tenGod]}。` : `${annual.branch} directly clashes with the ${clash.stem}${clash.branch} pillar in your natal chart. Traditional BaZi reads this as movement, restructuring, and decisions that can no longer be postponed. ${tenGod} is active, so the change centers on ${TEN_GOD_FOCUS[tenGod]}.`,
    };
  }
  if (harmony) {
    return {
      label,
      title: zh ? `${label}：合力成事之年` : `${label}: A Year of Alliance and Consolidation`,
      text: zh ? `流年${annual.branch}与命局${harmony.stem}${harmony.branch}构成${harmony.branch}${annual.branch}合，人缘、合作与时机更容易接上。已有关系有望沉淀为长期成果，全年以${tenGod}的方式推进最为顺势。` : `${annual.branch} harmonizes with the ${harmony.stem}${harmony.branch} pillar in your natal chart. This opens cooperation, smoother timing, and the chance to turn an existing connection into a durable result. ${tenGod} sets the year's operating style.`,
    };
  }
  if (annual.element === data.elements.deficient) {
    return {
      label,
      title: zh ? `${label}：所缺五行到位` : `${label}: The Missing Element Arrives`,
      text: zh ? `命局以${annual.element}为最弱，而${annual.stem}${annual.branch}把这股力量带到眼前。平时不容易调动的能力开始得到补足，正适合主动扩张、学习和补齐短板。` : `${ELEMENT_EN[annual.element]} is the least represented force in your natal chart, and ${annual.stem}${annual.branch} brings it forward. This year restores a capacity that is usually harder for you to access, making it a strong period for deliberate expansion in that direction.`,
    };
  }
  if (annual.element === data.elements.dominant) {
    return {
      label,
      title: zh ? `${label}：旺势再起，宜成大事` : `${label}: Your Strongest Current Intensifies`,
      text: zh ? `${annual.element}本已是命局最旺之气，流年再来相助，推进速度与个人气势都会明显增强。宜借旺势做出可见成果，同时防止过犹不及。` : `${ELEMENT_EN[annual.element]} already leads your chart, and the annual stem reinforces it. Momentum rises quickly. Use the year to achieve something visible, while refusing the excess habits that come with too much of your strongest element.`,
    };
  }
  return {
    label,
    title: zh ? `${label}：顺势而为，压力可化进展` : `${label}: Pressure Converts into Progress`,
    text: zh ? `${annual.stem}${annual.branch}相对日主引动${tenGod}，今年要用行动承接这股气。越早认清它要求你承担的角色，越能在运势转换前留下实际成果。` : `${annual.stem}${annual.branch} activates ${tenGod} in relation to your Day Master. The year rewards a direct response: choose the role this energy demands and turn it into a concrete result before the cycle moves on.`,
  };
}

export function getExpertVerdict(data: ExpertReadingData, forecastYear = new Date().getFullYear(), lang: 'en' | 'zh' = 'en'): ExpertVerdict {
  const zh = lang === 'zh';
  const dayStem = data.pillars.day.stem;
  const structure = getChartStructure(data, lang);
  const dominant = data.elements.dominant;
  const deficient = data.elements.deficient;
  const dominantPct = data.elements.percentages[dominant] || 0;
  const deficientPct = data.elements.percentages[deficient] || 0;
  const annual = getAnnualReading(data, forecastYear, lang);

  return {
    title: structure.title,
    lead: structure.lead,
    evidence: [
      structure.basis,
      zh ? `${dominant}气占比${dominantPct}%，为命局主势；${deficient}气仅${deficientPct}%，是当前最需要补足的环节。用好${dominant}的长处，同时主动引入${deficient}的功能，运势才会真正平衡。` : `${ELEMENT_EN[dominant]} leads at ${dominantPct}%, while ${ELEMENT_EN[deficient]} is lowest at ${deficientPct}%. Your path opens when ${ELEMENT_EN[dominant]}'s strength is directed and ${ELEMENT_EN[deficient]}'s missing function is deliberately supplied.`,
    ],
    timingTitle: annual.title,
    timing: annual.text,
    action: structure.action,
    maxim: zh ? (ELEMENT_MAXIMS_ZH[data.pillars.day.element] || ELEMENT_MAXIMS_ZH['土']) : (ELEMENT_MAXIMS[data.pillars.day.element] || ELEMENT_MAXIMS['土']),
    yearLabel: annual.label,
  };
}

export default getExpertVerdict;
