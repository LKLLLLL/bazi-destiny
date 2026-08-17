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

function getChartStructure(data: ExpertReadingData) {
  const dayStem = data.pillars.day.stem;
  const dayElement = data.pillars.day.element;
  const rolePillars = [
    { label: 'Year Stem', pillar: data.pillars.year },
    { label: 'Month Stem', pillar: data.pillars.month },
  ];
  if (!data.isThreePillar && data.pillars.hour) rolePillars.push({ label: 'Hour Stem', pillar: data.pillars.hour });
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
      title: 'Pressure Is Meant to Become Authority',
      lead: 'Your chart carries the classical Seven Killings with Resource pattern: decisive pressure is present, but it is met by the force that turns pressure into learning, protection, and command. This is a chart that becomes stronger through real responsibility.',
      action: 'Accept the responsibility that develops rank, skill, or authority. Structure your effort before pressure structures it for you.',
      basis: `${sevenKillings.label} ${sevenKillings.pillar.stem} carries 七杀, while ${ELEMENT_EN[resourceElement]} Resource is present in the chart. Traditional BaZi calls this 杀印相生: challenge feeds learning, and learning becomes authority.`,
    };
  }
  if (properOfficer && hasResource) {
    return {
      title: 'Discipline Is Becoming Recognition',
      lead: 'Your chart forms an Officer-and-Resource current. Standards, learning, and trusted responsibility reinforce one another, making reputation the main vehicle of advancement.',
      action: 'Choose the path with the clearest standards and strongest long-term credibility. Your chart gains status through mastery, not shortcuts.',
      basis: `${properOfficer.label} ${properOfficer.pillar.stem} carries 正官, supported by ${ELEMENT_EN[resourceElement]} Resource in the chart. This 官印相生 pattern turns preparation and conduct into recognition.`,
    };
  }
  if (outputRole && wealthRole) {
    return {
      title: 'Talent Is Designed to Create Wealth',
      lead: 'Your chart links expression with resources. Ideas, craft, communication, or visible output become valuable when they are finished, positioned, and exchanged in the real world.',
      action: 'Package one skill into a result people can understand and pay for. The chart opens when talent leaves the private stage.',
      basis: `${outputRole.label} ${outputRole.pillar.stem} carries ${outputRole.role}, while ${ELEMENT_EN[wealthElement]} Wealth is present. This is the traditional 食伤生财 route: output creates resources.`,
    };
  }
  if (wealthRole && properOfficer) {
    return {
      title: 'Resources Are Building Position',
      lead: 'Your chart links wealth with responsibility. Managing people, money, or opportunities well does more than create income; it creates standing and durable influence.',
      action: 'Treat the next opportunity as a stewardship test. Clear terms and reliable delivery convert access into position.',
      basis: `${wealthRole.label} ${wealthRole.pillar.stem} carries ${wealthRole.role}, while ${properOfficer.label} ${properOfficer.pillar.stem} carries 正官. Traditional 财官相生 turns resources into responsibility and responsibility into status.`,
    };
  }
  if (outputRole && sevenKillings) {
    return {
      title: 'Skill Is the Answer to Pressure',
      lead: 'Your chart answers challenge through competence. Pressure does not need to be fought head-on; it is controlled by producing better work, sharper judgment, and a result others cannot ignore.',
      action: 'When pressure rises, respond with a finished result rather than an argument. Skill is the authority this chart trusts most.',
      basis: `${sevenKillings.label} activates 七杀 while ${outputRole.label} ${outputRole.pillar.stem} carries ${outputRole.role}. This follows the 食伤制杀 logic: ability and production bring pressure under control.`,
    };
  }

  const monthTenGod = getTenGod(dayStem, data.pillars.month.stem);
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

function getAnnualReading(data: ExpertReadingData, year: number) {
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
      title: `${label}: A Year of Decisive Movement`,
      text: `${annual.branch} directly clashes with the ${clash.stem}${clash.branch} pillar in your natal chart. Traditional BaZi reads this as movement, restructuring, and decisions that can no longer be postponed. ${tenGod} is active, so the change centers on ${TEN_GOD_FOCUS[tenGod]}.`,
    };
  }
  if (harmony) {
    return {
      label,
      title: `${label}: A Year of Alliance and Consolidation`,
      text: `${annual.branch} harmonizes with the ${harmony.stem}${harmony.branch} pillar in your natal chart. This opens cooperation, smoother timing, and the chance to turn an existing connection into a durable result. ${tenGod} sets the year's operating style.`,
    };
  }
  if (annual.element === data.elements.deficient) {
    return {
      label,
      title: `${label}: The Missing Element Arrives`,
      text: `${ELEMENT_EN[annual.element]} is the least represented force in your natal chart, and ${annual.stem}${annual.branch} brings it forward. This year restores a capacity that is usually harder for you to access, making it a strong period for deliberate expansion in that direction.`,
    };
  }
  if (annual.element === data.elements.dominant) {
    return {
      label,
      title: `${label}: Your Strongest Current Intensifies`,
      text: `${ELEMENT_EN[annual.element]} already leads your chart, and the annual stem reinforces it. Momentum rises quickly. Use the year to achieve something visible, while refusing the excess habits that come with too much of your strongest element.`,
    };
  }
  return {
    label,
    title: `${label}: Pressure Converts into Progress`,
    text: `${annual.stem}${annual.branch} activates ${tenGod} in relation to your Day Master. The year rewards a direct response: choose the role this energy demands and turn it into a concrete result before the cycle moves on.`,
  };
}

export function getExpertVerdict(data: ExpertReadingData, forecastYear = new Date().getFullYear()): ExpertVerdict {
  const dayStem = data.pillars.day.stem;
  const structure = getChartStructure(data);
  const dominant = data.elements.dominant;
  const deficient = data.elements.deficient;
  const dominantPct = data.elements.percentages[dominant] || 0;
  const deficientPct = data.elements.percentages[deficient] || 0;
  const annual = getAnnualReading(data, forecastYear);

  return {
    title: structure.title,
    lead: structure.lead,
    evidence: [
      structure.basis,
      `${ELEMENT_EN[dominant]} leads at ${dominantPct}%, while ${ELEMENT_EN[deficient]} is lowest at ${deficientPct}%. Your path opens when ${ELEMENT_EN[dominant]}'s strength is directed and ${ELEMENT_EN[deficient]}'s missing function is deliberately supplied.`,
    ],
    timingTitle: annual.title,
    timing: annual.text,
    action: structure.action,
    maxim: ELEMENT_MAXIMS[data.pillars.day.element] || ELEMENT_MAXIMS['土'],
    yearLabel: annual.label,
  };
}

export default getExpertVerdict;
