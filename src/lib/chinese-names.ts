import BaZiEngine from './bazi/engine.ts';

export type NameGender = 'neutral' | 'feminine' | 'masculine';
type Inspiration = 'poetry' | 'seasonal' | 'botanical';

type Element = '木' | '火' | '土' | '金' | '水';

export interface ChineseNameCandidate {
  hanzi: string;
  pinyin: string;
  pronunciation: string;
  meaning: string;
  characters: Array<{ hanzi: string; meaning: string }>;
  sourceLabel: string;
  sourceQuote: string;
  sourceNote: string;
  impression: string;
  element: Element;
  inspirationLabel: string;
}

interface NameRecord extends Omit<ChineseNameCandidate, 'inspirationLabel'> {
  styles: Inspiration[];
  genders: NameGender[];
  seasons: number[];
}

const NAMES: NameRecord[] = [
  {
    hanzi: '望舒', pinyin: 'Wàngshū', pronunciation: 'wahng-shoo',
    meaning: 'A calm light that guides the way forward.',
    characters: [{ hanzi: '望', meaning: 'to look ahead; hope' }, { hanzi: '舒', meaning: 'ease; unfold' }],
    sourceLabel: 'Chu Ci · Li Sao', sourceQuote: '前望舒使先驱兮，后飞廉使奔属。',
    sourceNote: 'Wangshu is the mythic charioteer of the moon, an image of quiet light and purposeful movement.',
    impression: 'Literary, serene, and naturally gender-neutral.', element: '水',
    styles: ['poetry'], genders: ['neutral', 'feminine', 'masculine'], seasons: [9, 10, 11, 12],
  },
  {
    hanzi: '修远', pinyin: 'Xiūyuǎn', pronunciation: 'shyoh-ywen',
    meaning: 'To cultivate oneself and travel toward a distant ideal.',
    characters: [{ hanzi: '修', meaning: 'to cultivate; refine' }, { hanzi: '远', meaning: 'far-reaching; visionary' }],
    sourceLabel: 'Chu Ci · Li Sao', sourceQuote: '路漫漫其修远兮，吾将上下而求索。',
    sourceNote: 'The verse expresses perseverance in a long search for truth and an ideal.',
    impression: 'Purposeful, learned, and slightly masculine.', element: '木',
    styles: ['poetry'], genders: ['neutral', 'masculine'], seasons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    hanzi: '清扬', pinyin: 'Qīngyáng', pronunciation: 'ching-yahng',
    meaning: 'Clear in spirit, bright in presence.',
    characters: [{ hanzi: '清', meaning: 'clear; pure' }, { hanzi: '扬', meaning: 'to rise; shine forth' }],
    sourceLabel: 'Book of Songs · Wild Vines', sourceQuote: '有美一人，清扬婉兮。',
    sourceNote: 'The line praises a graceful person with a clear and radiant presence.',
    impression: 'Bright, elegant, and contemporary despite its classical source.', element: '水',
    styles: ['poetry'], genders: ['neutral', 'feminine'], seasons: [3, 4, 5, 6, 7, 8],
  },
  {
    hanzi: '静姝', pinyin: 'Jìngshū', pronunciation: 'jing-shoo',
    meaning: 'Quiet grace and considered beauty.',
    characters: [{ hanzi: '静', meaning: 'calm; composed' }, { hanzi: '姝', meaning: 'graceful; beautiful' }],
    sourceLabel: 'Book of Songs · The Quiet Girl', sourceQuote: '静女其姝，俟我于城隅。',
    sourceNote: 'A celebrated line describing a composed and graceful young woman.',
    impression: 'Classical, feminine, and gentle.', element: '金',
    styles: ['poetry'], genders: ['feminine'], seasons: [9, 10, 11, 12],
  },
  {
    hanzi: '景明', pinyin: 'Jǐngmíng', pronunciation: 'jeeng-ming',
    meaning: 'A bright, open landscape after the clouds clear.',
    characters: [{ hanzi: '景', meaning: 'light; vista' }, { hanzi: '明', meaning: 'bright; perceptive' }],
    sourceLabel: 'Spring seasonal imagery', sourceQuote: '春和景明，波澜不惊。',
    sourceNote: 'From Fan Zhongyan\'s Yueyang Tower, evoking mild spring air, clear light, and calm water.',
    impression: 'Open-minded, lucid, and naturally masculine-neutral.', element: '火',
    styles: ['seasonal', 'poetry'], genders: ['neutral', 'masculine'], seasons: [2, 3, 4, 5],
  },
  {
    hanzi: '清和', pinyin: 'Qīnghé', pronunciation: 'ching-huh',
    meaning: 'Clarity held in gentle harmony.',
    characters: [{ hanzi: '清', meaning: 'clear; pure' }, { hanzi: '和', meaning: 'harmony; warmth' }],
    sourceLabel: 'Early-summer seasonal imagery', sourceQuote: '首夏犹清和，芳草亦未歇。',
    sourceNote: 'From Xie Lingyun\'s poem, capturing the fresh, balanced atmosphere of early summer.',
    impression: 'Peaceful, polished, and gender-neutral.', element: '水',
    styles: ['seasonal', 'poetry'], genders: ['neutral', 'feminine', 'masculine'], seasons: [4, 5, 6],
  },
  {
    hanzi: '秋实', pinyin: 'Qiūshí', pronunciation: 'chyoh-shrr',
    meaning: 'The mature fruit of patient growth.',
    characters: [{ hanzi: '秋', meaning: 'autumn; maturity' }, { hanzi: '实', meaning: 'fruit; substance; sincerity' }],
    sourceLabel: 'White Dew and autumn imagery', sourceQuote: '春华秋实',
    sourceNote: 'A traditional expression pairing spring blossoms with autumn fruit: promise fulfilled through steady growth.',
    impression: 'Grounded, sincere, and gender-neutral.', element: '土',
    styles: ['seasonal'], genders: ['neutral', 'masculine'], seasons: [8, 9, 10],
  },
  {
    hanzi: '冬宁', pinyin: 'Dōngníng', pronunciation: 'dong-ning',
    meaning: 'Winter stillness and inner peace.',
    characters: [{ hanzi: '冬', meaning: 'winter; quiet renewal' }, { hanzi: '宁', meaning: 'peace; composure' }],
    sourceLabel: 'Winter Solstice imagery', sourceQuote: '冬至阳生',
    sourceNote: 'The winter solstice marks stillness at the turning point when yang energy begins to return.',
    impression: 'Calm, modern, and gently distinctive.', element: '水',
    styles: ['seasonal'], genders: ['neutral', 'feminine'], seasons: [11, 12, 1],
  },
  {
    hanzi: '杜若', pinyin: 'Dùruò', pronunciation: 'doo-rwoh',
    meaning: 'Fragrant integrity with a quietly independent spirit.',
    characters: [{ hanzi: '杜', meaning: 'a botanical name; steadfastness' }, { hanzi: '若', meaning: 'as if; gentle and receptive' }],
    sourceLabel: 'Chu Ci · Nine Songs', sourceQuote: '山中人兮芳杜若，饮石泉兮荫松柏。',
    sourceNote: 'Du ruo is a fragrant plant in classical literature, associated with virtue and a secluded natural life.',
    impression: 'Poetic, botanical, and feminine-neutral.', element: '木',
    styles: ['botanical', 'poetry'], genders: ['neutral', 'feminine'], seasons: [3, 4, 5, 6],
  },
  {
    hanzi: '辛夷', pinyin: 'Xīnyí', pronunciation: 'sheen-yee',
    meaning: 'A magnolia bud: resilient, fragrant, and ready to open.',
    characters: [{ hanzi: '辛', meaning: 'the name\'s traditional first character' }, { hanzi: '夷', meaning: 'the name\'s traditional second character' }],
    sourceLabel: 'Chinese materia medica · Magnolia flower', sourceQuote: '辛夷',
    sourceNote: 'Xin yi is the dried magnolia flower bud in Chinese herbal tradition and a symbol of early spring bloom.',
    impression: 'Distinctive, botanical, and softly feminine.', element: '木',
    styles: ['botanical'], genders: ['feminine'], seasons: [2, 3, 4],
  },
  {
    hanzi: '紫苏', pinyin: 'Zǐsū', pronunciation: 'dzuh-soo',
    meaning: 'Vivid vitality with a warm, restorative presence.',
    characters: [{ hanzi: '紫', meaning: 'purple; dignity' }, { hanzi: '苏', meaning: 'to revive; awaken' }],
    sourceLabel: 'Chinese materia medica · Perilla', sourceQuote: '紫苏',
    sourceNote: 'Purple perilla is both a culinary herb and a traditional botanical, valued for its fragrance and vitality.',
    impression: 'Warm, memorable, and more artistic than conventional.', element: '火',
    styles: ['botanical'], genders: ['neutral', 'feminine'], seasons: [5, 6, 7, 8],
  },
  {
    hanzi: '青黛', pinyin: 'Qīngdài', pronunciation: 'ching-dye',
    meaning: 'Deep blue-green: poised, artistic, and quietly vivid.',
    characters: [{ hanzi: '青', meaning: 'blue-green; youth' }, { hanzi: '黛', meaning: 'indigo-black pigment' }],
    sourceLabel: 'Chinese materia medica · Natural indigo', sourceQuote: '青黛',
    sourceNote: 'Qing dai is a natural indigo preparation; in art and poetry, dai also evokes elegant blue-black color.',
    impression: 'Highly artistic, feminine, and intentionally uncommon.', element: '木',
    styles: ['botanical'], genders: ['feminine'], seasons: [6, 7, 8, 9],
  },
  {
    hanzi: '怀瑾', pinyin: 'Huáijǐn', pronunciation: 'hweye-jeen',
    meaning: 'To carry precious virtue within.',
    characters: [{ hanzi: '怀', meaning: 'to hold in the heart' }, { hanzi: '瑾', meaning: 'fine jade; virtue' }],
    sourceLabel: 'Chu Ci · Nine Chapters', sourceQuote: '怀瑾握瑜兮，穷不知所示。',
    sourceNote: 'Fine jade is a metaphor for moral character retained even when it goes unrecognized.',
    impression: 'Cultivated, principled, and gender-neutral.', element: '土',
    styles: ['poetry'], genders: ['neutral', 'masculine', 'feminine'], seasons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    hanzi: '星野', pinyin: 'Xīngyě', pronunciation: 'shing-yeh',
    meaning: 'A wide field beneath the stars.',
    characters: [{ hanzi: '星', meaning: 'star; brilliance' }, { hanzi: '野', meaning: 'open country; freedom' }],
    sourceLabel: 'Summer night imagery', sourceQuote: '星垂平野阔，月涌大江流。',
    sourceNote: 'From Du Fu\'s Night Thoughts While Traveling, where stars open above a vast plain.',
    impression: 'Expansive, modern, and gender-neutral.', element: '火',
    styles: ['seasonal', 'poetry'], genders: ['neutral', 'masculine'], seasons: [5, 6, 7, 8],
  },
  {
    hanzi: '云舟', pinyin: 'Yúnzhōu', pronunciation: 'yewn-joh',
    meaning: 'A vessel moving lightly through clouds and distance.',
    characters: [{ hanzi: '云', meaning: 'cloud; openness' }, { hanzi: '舟', meaning: 'boat; journey' }],
    sourceLabel: 'Classical landscape imagery', sourceQuote: '云帆济沧海',
    sourceNote: 'Inspired by Li Bai\'s image of raising a cloud-like sail to cross the great sea.',
    impression: 'Free-spirited, refined, and masculine-neutral.', element: '水',
    styles: ['poetry', 'seasonal'], genders: ['neutral', 'masculine'], seasons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
];

const ELEMENT_EN: Record<Element, string> = { 木: 'Wood', 火: 'Fire', 土: 'Earth', 金: 'Metal', 水: 'Water' };

export interface GenerateNamesInput {
  birthDate: string;
  birthHour?: number;
  englishName?: string;
  gender?: NameGender;
}

export interface ChineseNameResult {
  names: ChineseNameCandidate[];
  deficientElement: Element;
  deficientElementEnglish: string;
  birthMonth: number;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function generateChineseNames(input: GenerateNamesInput): ChineseNameResult {
  const hour = Number.isFinite(input.birthHour) ? Number(input.birthHour) : 12;
  const reading = BaZiEngine.calculate(input.birthDate, hour);
  const deficientElement = reading.elements.deficient as Element;
  const birthMonth = Number(input.birthDate.split('-')[1]);
  const gender = input.gender ?? 'neutral';
  const seed = hash(`${input.englishName ?? ''}|${input.birthDate}|${hour}|${gender}`);

  const scored = NAMES.map((name, index) => {
    let score = 0;
    if (name.element === deficientElement) score += 8;
    if (name.seasons.includes(birthMonth)) score += 5;
    if (name.genders.includes(gender)) score += 6;
    else if (name.genders.includes('neutral')) score += 3;
    else score -= 20;
    score += ((seed + index * 2654435761) >>> 0) % 5;
    return { name, score };
  }).sort((a, b) => b.score - a.score || a.name.hanzi.localeCompare(b.name.hanzi));

  const inspirationLabels: Record<Inspiration, string> = {
    poetry: 'Classical poetry choice',
    seasonal: 'Birth season choice',
    botanical: 'Herbal & botanical choice',
  };
  const chosen: Array<{ name: NameRecord; inspiration: Inspiration }> = [];
  for (const inspiration of ['poetry', 'seasonal', 'botanical'] as Inspiration[]) {
    const match = scored.find(({ name }) =>
      name.styles.includes(inspiration)
      && !chosen.some((item) => item.name.hanzi === name.hanzi)
      && (name.genders.includes(gender) || name.genders.includes('neutral'))
    );
    if (match) chosen.push({ name: match.name, inspiration });
  }

  return {
    names: chosen.map(({ name: { styles: _styles, genders: _genders, seasons: _seasons, ...name }, inspiration }) => ({
      ...name,
      inspirationLabel: inspirationLabels[inspiration],
    })),
    deficientElement,
    deficientElementEnglish: ELEMENT_EN[deficientElement],
    birthMonth,
  };
}
