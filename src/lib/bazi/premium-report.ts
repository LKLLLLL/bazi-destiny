import Readings from './readings.ts';
import { getLifestyleGuide } from './lifestyle.ts';
import { getExpertVerdict } from './expert-reading.ts';

export interface PremiumReportGroup {
  label: string;
  items: string[];
}

export interface PremiumReportSection {
  key: string;
  number: number;
  icon: string;
  title: string;
  intro: string;
  groups: PremiumReportGroup[];
}

interface PremiumReadingData {
  pillars: {
    year: { stem: string; branch: string; element: string };
    month: { stem: string; branch: string; element: string };
    day: { stem: string; branch: string; element: string };
    hour?: { stem: string; branch: string; element: string };
  };
  elements: {
    percentages: Record<string, number>;
    dominant: string;
    deficient: string;
  };
  directions?: {
    auspicious?: string[];
    inauspicious?: string[];
  };
  lucky?: {
    colorNames?: string[];
    numbers?: number[];
    element?: string;
    tones?: string;
  };
  isThreePillar?: boolean;
  lang?: 'en' | 'zh';
  timing?: {
    direction: 'forward' | 'backward';
    startAgeYears: number;
    startDate: string;
    luckPillars: Array<{ stem: string; branch: string; startYear: number; endYear: number; ageStart: number; ageEnd: number; tenGod: string; theme: string }>;
    currentLuckPillar: { stem: string; branch: string; startYear: number; endYear: number; ageStart: number; ageEnd: number; tenGod: string; theme: string } | null;
    annualOutlook: Array<{ label: string; theme: string; intensity: string; guidance: string }>;
    monthlyRhythm: Array<{ label: string; pillar: string; theme: string; guidance: string }>;
    methodNote: string;
  };
}

const ELEMENT_EN: Record<string, string> = {
  '木': 'Wood',
  '火': 'Fire',
  '土': 'Earth',
  '金': 'Metal',
  '水': 'Water',
};

function group(label: string, items: Array<string | undefined>): PremiumReportGroup {
  return { label, items: items.filter((item): item is string => Boolean(item)) };
}

export function getPremiumReport(data: PremiumReadingData): PremiumReportSection[] {
  const { pillars, elements } = data;
  const dominant = elements.dominant;
  const deficient = elements.deficient;
  const dayMasterElement = pillars.day.element;
  const dominantEn = ELEMENT_EN[dominant] || dominant;
  const deficientEn = ELEMENT_EN[deficient] || deficient;
  const dayMasterEn = ELEMENT_EN[dayMasterElement] || dayMasterElement;
  const persona = Readings.getPersonality(pillars.day.stem, dayMasterElement);
  const career = Readings.getCareer(dominant);
  const relationship = Readings.getRelationship(dominant);
  const health = Readings.getHealth(dominant);
  const fengShui = Readings.getFengShui(dominant, pillars.day.stem, dominant);
  const lifestyle = getLifestyleGuide(dominant, pillars.day.stem);
  const balanceLifestyle = getLifestyleGuide(deficient, '');
  const verdict = getExpertVerdict(data);
  const percentageEntries = Object.entries(elements.percentages)
    .sort((a, b) => b[1] - a[1])
    .map(([element, value]) => `${ELEMENT_EN[element] || element}: ${value}%`);
  const hourPillar = data.isThreePillar || !pillars.hour
    ? 'Birth hour unknown - this reading uses the Year, Month, and Day pillars.'
    : `Hour Pillar: ${pillars.hour.stem}${pillars.hour.branch}`;
  const lucky = data.lucky || {};
  const directions = data.directions || {};
  const timing = data.timing;
  const zh = data.lang === 'zh';
  const currentCycle = timing?.currentLuckPillar;
  const timingDirection = timing?.direction === 'forward' ? 'Forward' : 'Reverse';

  return [
    {
      key: 'chart-overview',
      number: 1,
      icon: '命',
      title: 'Chart Overview',
      intro: verdict.lead,
      groups: [
        group('Four Pillars', [
          `Year Pillar: ${pillars.year.stem}${pillars.year.branch}`,
          `Month Pillar: ${pillars.month.stem}${pillars.month.branch}`,
          `Day Pillar: ${pillars.day.stem}${pillars.day.branch} - your Day Master is ${pillars.day.stem} ${dayMasterEn}`,
          hourPillar,
        ]),
        group('Structural Verdict', [verdict.title, ...verdict.evidence]),
        group(verdict.timingTitle, [verdict.timing]),
      ],
    },
    {
      key: 'day-master',
      number: 2,
      icon: '日',
      title: `Day Master - ${persona.title}`,
      intro: persona.summary,
      groups: [
        group('Natural Strength', [persona.strength]),
        group('Watch For', [persona.weakness]),
        group('Core Traits', persona.traits),
      ],
    },
    {
      key: 'element-balance',
      number: 3,
      icon: '五',
      title: 'Five-Element Balance',
      intro: `${dominantEn} is your strongest current, while ${deficientEn} is least represented. Balance comes from using your dominant qualities deliberately and making room for the missing element.`,
      groups: [
        group('Element Distribution', percentageEntries),
        group(`Strengthen ${deficientEn}`, balanceLifestyle.routine.slice(0, 2)),
      ],
    },
    {
      key: 'career',
      number: 4,
      icon: '业',
      title: 'Career & Vocation',
      intro: career.overview,
      groups: [
        group('Career Strengths', career.strengths),
        group('Career Challenges', career.challenges),
        group('Natural Direction', [persona.idealPath]),
      ],
    },
    {
      key: 'wealth',
      number: 5,
      icon: '财',
      title: 'Wealth Pattern',
      intro: `Your ${dominantEn} pattern shapes how you build resources, recognize opportunities, and handle financial momentum. Consistency with your natural working style is the main theme.`,
      groups: [group('Wealth Strategy', career.wealthTips)],
    },
    {
      key: 'relationships',
      number: 6,
      icon: '缘',
      title: 'Love & Relationships',
      intro: relationship.overview,
      groups: [
        group('Supportive Partner Dynamic', [relationship.idealPartner]),
        group('Communication Style', [relationship.communication]),
        group('Relationship Growth', relationship.growthAreas),
      ],
    },
    {
      key: 'health',
      number: 7,
      icon: '养',
      title: 'Health & Wellbeing',
      intro: health.overview,
      groups: [
        group('Areas to Support', health.commonConcerns),
        group('Wellbeing Practices', health.wellnessTips),
        group('Food Rhythm', lifestyle.diet.slice(0, 3)),
      ],
    },
    {
      key: 'timing',
      number: 8,
      icon: '运',
      title: zh ? '大运 · 流年 · 流月' : 'Timing & Outlook',
      intro: timing
        ? (zh ? `这不是一份只看一年的报告。时间层把眼前选择放进${timingDirection === 'Forward' ? '顺排' : '逆排'}大运，再把未来三年的流年信号翻译成可以执行的行动。` : `Your chart is not a one-year product. The timing layer places today's choices inside a longer ${timingDirection.toLowerCase()} Luck Pillar sequence, then translates the next three annual signals into practical moves.`)
        : (zh ? '补充出生日期、时辰与性别后，时间判断会更具体。' : 'Timing becomes more specific when birth date, time, and gender convention are available.'),
      groups: timing ? [
        group(zh ? '当前大运' : 'Current Major Cycle / 大运', [currentCycle
          ? `${currentCycle.stem}${currentCycle.branch} · ${currentCycle.startYear}-${currentCycle.endYear} · age ${currentCycle.ageStart}-${currentCycle.ageEnd} · ${currentCycle.tenGod} · ${currentCycle.theme}`
          : `${zh ? '顺逆' : 'Direction'}: ${timingDirection}; ${zh ? '起运约' : 'starting age approximately'} ${timing.startAgeYears} ${zh ? '岁' : 'years'} (${timing.startDate})`]),
        group(zh ? '大运排布' : 'Luck Pillar Sequence', timing.luckPillars.slice(0, 5).map((p) => `${p.stem}${p.branch} · ${p.startYear}-${p.endYear} · ${p.tenGod} · ${p.theme}`)),
        group(zh ? '近三年流年' : 'Near-Term Outlook / 流年', timing.annualOutlook.map((a) => `${a.label} · ${a.theme} · ${a.guidance}`)),
        group(zh ? '流月节奏' : 'Monthly Rhythm / 流月', timing.monthlyRhythm.map((m) => `${m.label} · ${m.pillar} · ${m.theme} · ${m.guidance}`)),
        group(zh ? '如何使用时间层' : 'How to Use This Layer', [timing.methodNote, zh ? '先用流年定方向，再用流月决定推进、沉淀或复盘的时机。' : 'Use the annual signal to choose a direction, then use the monthly rhythm to decide when to push, consolidate, or review.']),
      ] : [group('Practical Guidance', lifestyle.conduct)],
    },
    {
      key: 'growth',
      number: 9,
      icon: '长',
      title: 'Personal Growth',
      intro: verdict.action,
      groups: [
        group('Growth Focus', [persona.weakness, ...relationship.growthAreas]),
        group('Development Path', [persona.idealPath]),
        group('Three-Line Destiny Summary', [verdict.title, verdict.timingTitle, verdict.maxim]),
      ],
    },
    {
      key: 'daily-alignment',
      number: 10,
      icon: '行',
      title: 'Daily Alignment',
      intro: `Small, repeatable choices help your ${dominantEn} energy work with greater clarity and steadiness throughout the day.`,
      groups: [
        group('Daily Rhythm', lifestyle.routine),
        group('What to Wear', lifestyle.wear.slice(0, 3)),
        group('What to Carry', lifestyle.carry.slice(0, 3)),
      ],
    },
    {
      key: 'lucky-elements',
      number: 11,
      icon: '吉',
      title: 'Lucky Elements & Directions',
      intro: `Use these chart-aligned details as recurring cues in your workspace, wardrobe, planning, and important activities.`,
      groups: [
        group('Lucky Palette', [(lucky.colorNames || []).join(' · ')]),
        group('Lucky Numbers', [(lucky.numbers || []).join(' · ')]),
        group('Supportive Element', [`${lucky.element || dominantEn}${lucky.tones ? ` - ${lucky.tones}` : ''}`]),
        group('Supportive Directions', [(directions.auspicious || []).join(' · ')]),
      ],
    },
    {
      key: 'feng-shui',
      number: 12,
      icon: '宅',
      title: 'Personalized Feng Shui',
      intro: fengShui.overview,
      groups: [
        group('Space Alignment', fengShui.tips),
        group('Personal Enhancements', fengShui.personalCures.map((cure) => `${cure.item} - ${cure.area}: ${cure.purpose}`)),
      ],
    },
  ];
}

export default getPremiumReport;
