export interface PublicTestResult {
  year: string;
  month: string;
  day: string;
  hour: string;
}

export interface PublicTestObservation {
  label: string;
  date: string;
  inputTime: string;
  effectiveTime: string;
  effectiveHour: number;
  location?: string;
  correctionMinutes?: number;
  expected: PublicTestResult;
}

export interface PublicBaziTestCase {
  id: string;
  category: 'year-boundary' | 'month-boundary' | 'hour-boundary' | 'solar-time';
  title: string;
  rule: string;
  verifies: string;
  observations: PublicTestObservation[];
  result: string;
}

export const PUBLIC_TEST_CASE_VERSION = '1.0.0';
export const PUBLIC_TEST_CASES_UPDATED = '2026-08-02';

export const PUBLIC_TEST_CONVENTIONS = [
  'The Year Pillar changes at Li Chun.',
  'Month Pillars change at the 12 month-starting Jie solar terms.',
  'The entered civil date determines the Day Pillar; 23:00 does not automatically advance the day in this implementation.',
  'Zi hour covers 23:00 through 00:59.',
  'Optional longitude correction changes the effective hour used for the Hour Pillar, not the entered civil date.',
  'City UTC offsets are static and do not include a historical daylight-saving database.',
  'Hidden Stems and personalized Da Yun starting ages are not calculated by the current public calculator.',
] as const;

export const PUBLIC_BAZI_TEST_CASES: PublicBaziTestCase[] = [
  {
    id: 'li-chun-2024',
    category: 'year-boundary',
    title: 'Li Chun changes the BaZi year',
    rule: 'For 2024, the mean solar-term calculation places Li Chun on February 4. The Year Pillar does not change on January 1 or Lunar New Year.',
    verifies: 'Year and Month Pillars immediately before and on the Li Chun boundary.',
    observations: [
      {
        label: 'Before Li Chun',
        date: '2024-02-03',
        inputTime: '12:00',
        effectiveTime: '12:00',
        effectiveHour: 12,
        expected: { year: '癸卯', month: '乙丑', day: '丁酉', hour: '丙午' },
      },
      {
        label: 'On Li Chun',
        date: '2024-02-04',
        inputTime: '12:00',
        effectiveTime: '12:00',
        effectiveHour: 12,
        expected: { year: '甲辰', month: '丙寅', day: '戊戌', hour: '戊午' },
      },
    ],
    result: 'The Year Pillar changes from Gui Mao (癸卯) to Jia Chen (甲辰), and the Month Pillar enters Bing Yin (丙寅).',
  },
  {
    id: 'jing-zhe-2024',
    category: 'month-boundary',
    title: 'A Jie term changes the Month Pillar',
    rule: 'BaZi months use the 12 month-starting Jie terms. For this 2024 test, Jing Zhe falls on March 5 under the published mean-term method.',
    verifies: 'Month Pillars immediately before and on the Jing Zhe boundary.',
    observations: [
      {
        label: 'Before Jing Zhe',
        date: '2024-03-04',
        inputTime: '12:00',
        effectiveTime: '12:00',
        effectiveHour: 12,
        expected: { year: '甲辰', month: '丙寅', day: '丁卯', hour: '丙午' },
      },
      {
        label: 'On Jing Zhe',
        date: '2024-03-05',
        inputTime: '12:00',
        effectiveTime: '12:00',
        effectiveHour: 12,
        expected: { year: '甲辰', month: '丁卯', day: '戊辰', hour: '戊午' },
      },
    ],
    result: 'The Month Pillar changes from Bing Yin (丙寅) to Ding Mao (丁卯); it does not wait for the first day of a Gregorian or lunar month.',
  },
  {
    id: 'zi-hour-2024',
    category: 'hour-boundary',
    title: '23:00 enters Zi hour without changing the Day Pillar',
    rule: 'This implementation uses the entered civil date for the Day Pillar and maps 23:00 through 00:59 to Zi hour. Other BaZi schools may use a different day-boundary convention.',
    verifies: 'Hour Pillar behavior immediately before and at 23:00 on the same entered date.',
    observations: [
      {
        label: 'Before Zi hour',
        date: '2024-02-10',
        inputTime: '22:00',
        effectiveTime: '22:00',
        effectiveHour: 22,
        expected: { year: '甲辰', month: '丙寅', day: '甲辰', hour: '乙亥' },
      },
      {
        label: 'Start of Zi hour',
        date: '2024-02-10',
        inputTime: '23:00',
        effectiveTime: '23:00',
        effectiveHour: 23,
        expected: { year: '甲辰', month: '丙寅', day: '甲辰', hour: '甲子' },
      },
    ],
    result: 'The Hour Pillar changes from Yi Hai (乙亥) to Jia Zi (甲子), while the Day Pillar remains Jia Chen (甲辰).',
  },
  {
    id: 'chengdu-solar-time-2024',
    category: 'solar-time',
    title: 'Longitude correction can change the Hour Pillar',
    rule: 'Chengdu is stored at 104.1 degrees east with UTC+8. Against the 120-degree standard meridian, the published formula gives a -63.6 minute correction.',
    verifies: 'Civil clock time compared with the optional longitude-corrected effective time.',
    observations: [
      {
        label: 'Civil clock time',
        date: '2024-02-10',
        inputTime: '02:00',
        effectiveTime: '02:00',
        effectiveHour: 2,
        location: 'Chengdu, China',
        expected: { year: '甲辰', month: '丙寅', day: '甲辰', hour: '乙丑' },
      },
      {
        label: 'Longitude corrected',
        date: '2024-02-10',
        inputTime: '02:00',
        effectiveTime: '00:56',
        effectiveHour: 0.94,
        location: 'Chengdu, China',
        correctionMinutes: -63.6,
        expected: { year: '甲辰', month: '丙寅', day: '甲辰', hour: '甲子' },
      },
    ],
    result: 'The correction moves the effective time from Chou hour to Zi hour, changing Yi Chou (乙丑) to Jia Zi (甲子). The entered date and Day Pillar do not change.',
  },
];
