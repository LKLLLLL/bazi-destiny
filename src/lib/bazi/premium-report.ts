import Readings from './readings.ts';
import { getLifestyleGuide } from './lifestyle.ts';

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
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string; element: string };
    hour?: { stem: string; branch: string };
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
  const percentageEntries = Object.entries(elements.percentages)
    .sort((a, b) => b[1] - a[1])
    .map(([element, value]) => `${ELEMENT_EN[element] || element}: ${value}%`);
  const hourPillar = data.isThreePillar || !pillars.hour
    ? 'Birth hour unknown - this reading uses the Year, Month, and Day pillars.'
    : `Hour Pillar: ${pillars.hour.stem}${pillars.hour.branch}`;
  const lucky = data.lucky || {};
  const directions = data.directions || {};

  return [
    {
      key: 'chart-overview',
      number: 1,
      icon: '命',
      title: 'Chart Overview',
      intro: `Your chart is led by ${dominantEn} energy, with ${deficientEn} as the main area to strengthen. This creates the central rhythm for the reading below.`,
      groups: [
        group('Four Pillars', [
          `Year Pillar: ${pillars.year.stem}${pillars.year.branch}`,
          `Month Pillar: ${pillars.month.stem}${pillars.month.branch}`,
          `Day Pillar: ${pillars.day.stem}${pillars.day.branch} - your Day Master is ${pillars.day.stem} ${dayMasterEn}`,
          hourPillar,
        ]),
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
      key: 'communication',
      number: 8,
      icon: '言',
      title: 'Communication & Social Style',
      intro: `Your ${dominantEn} energy influences how you express ideas, respond under pressure, and contribute in groups. Your strongest social impact comes from pairing ${persona.strength.toLowerCase()} with conscious communication.`,
      groups: [group('Practical Guidance', lifestyle.conduct)],
    },
    {
      key: 'growth',
      number: 9,
      icon: '长',
      title: 'Personal Growth',
      intro: `Your next stage of growth is less about changing who you are and more about balancing ${dominantEn}'s natural force with the qualities of ${deficientEn}.`,
      groups: [
        group('Growth Focus', [persona.weakness, ...relationship.growthAreas]),
        group('Development Path', [persona.idealPath]),
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
