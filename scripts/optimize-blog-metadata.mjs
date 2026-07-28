import { readFile, writeFile } from 'node:fs/promises';

const metadata = {
  'complete-guide-bazi': {
    title: 'Complete BaZi Guide: Four Pillars, Elements & Timing',
    description: 'Learn the complete BaZi framework: Four Pillars, Day Master, Five Elements, chart strength, compatibility, and traditional timing concepts.',
  },
  'bazi-day-master-guide': {
    title: 'BaZi Day Master Guide: Your Core Element Explained',
    description: 'Learn what the BaZi Day Master is, how it comes from the Day Pillar, and what each of the ten Heavenly Stems traditionally represents.',
  },
  'what-is-bazi': {
    title: 'What Is BaZi? Four Pillars of Destiny Explained',
    description: 'Learn how BaZi uses birth year, month, day, and hour to form the Four Pillars, identify the Day Master, and interpret the Five Elements.',
  },
  'snake-year-2025': {
    title: '2025 Wood Snake: Chinese Zodiac Year Guide',
    description: 'Learn about the 2025 Wood Snake year, its Chinese zodiac symbolism, Five Element themes, calendar boundaries, and traditional cultural context.',
  },
  'fire-element-personality': {
    title: 'Fire Element Personality: Traits, Career & Love',
    description: 'Explore traditional Fire element personality traits in BaZi, including strengths, growth areas, career tendencies, relationships, and balance.',
  },
  'how-to-read-bazi-chart': {
    title: "How to Read a BaZi Chart: Beginner's Guide",
    description: 'Learn how to read the Four Pillars, find the Day Master, identify Five Elements, and understand the basic structure of a BaZi birth chart.',
  },
  'rat-and-dragon-compatibility': {
    title: 'Rat and Dragon Compatibility: Love, Work & Friendship',
    description: 'Explore traditional Rat and Dragon compatibility in love, friendship, and work, plus the limits of using zodiac animals without full BaZi charts.',
  },
  'becoming-chinese-trend': {
    title: 'Becoming Chinese Trend: Culture, Identity & BaZi',
    description: 'Explore the Becoming Chinese trend, why Chinese cultural practices resonate online, and where BaZi offers cultural context rather than proof.',
  },
  'love-compatibility': {
    title: 'BaZi Love Compatibility: Day Masters & Five Elements',
    description: 'Learn how BaZi compatibility compares Day Masters, Five Elements, branches, and complete birth charts instead of relying on zodiac animals alone.',
  },
  'personality-elements': {
    title: 'BaZi Personality: How the Five Elements Shape You',
    description: 'Learn how Wood, Fire, Earth, Metal, and Water are traditionally used to describe personality tendencies, strengths, and communication styles.',
  },
  'earth-element-personality': {
    title: 'Earth Element Personality: Traits, Career & Love',
    description: 'Explore traditional Earth element personality traits in BaZi, including strengths, growth areas, career tendencies, relationships, and balance.',
  },
  'metal-element-personality': {
    title: 'Metal Element Personality: Traits, Career & Love',
    description: 'Explore traditional Metal element personality traits in BaZi, including strengths, growth areas, career tendencies, relationships, and balance.',
  },
  'wood-element-personality': {
    title: 'Wood Element Personality: Traits, Career & Love',
    description: 'Explore traditional Wood element personality traits in BaZi, including strengths, growth areas, career tendencies, relationships, and balance.',
  },
  'bazi-elements': {
    title: 'Five Elements in BaZi: Complete Wu Xing Guide',
    description: 'Learn how Wood, Fire, Earth, Metal, and Water interact through generating and controlling cycles and shape the structure of a BaZi chart.',
  },
  'water-element-personality': {
    title: 'Water Element Personality: Traits, Career & Love',
    description: 'Explore traditional Water element personality traits in BaZi, including strengths, growth areas, career tendencies, relationships, and balance.',
  },
  'bazi-vs-western-astrology': {
    title: 'BaZi vs Western Astrology: Key Differences',
    description: 'Compare BaZi and Western astrology by chart inputs, calendar systems, symbols, timing methods, interpretation style, and cultural background.',
  },
  'lucky-colors-numbers': {
    title: 'BaZi Lucky Colors, Numbers & Directions',
    description: 'Learn the traditional Five Element correspondences behind BaZi colors, numbers, directions, and seasons, plus how to apply them responsibly.',
  },
  'bazi-wealth-analysis': {
    title: 'BaZi Wealth Analysis: Day Master & Wealth Element',
    description: 'Learn how traditional BaZi defines the Wealth Element through the Day Master, chart strength, elemental relationships, and Luck Pillar concepts.',
  },
  'career-bazi': {
    title: 'BaZi Career Guide: Day Master, Elements & Strengths',
    description: 'Explore how the Day Master and Five Elements are traditionally used to discuss work styles, career strengths, suitable environments, and balance.',
  },
  'chinese-zodiac-2026-predictions': {
    title: '2026 Chinese Zodiac: Fire Horse Guide for 12 Signs',
    description: 'Explore the 2026 Fire Horse year and traditional themes for all 12 Chinese zodiac signs, with clear limits on general year-sign forecasts.',
  },
};

for (const [slug, values] of Object.entries(metadata)) {
  const file = new URL(`../src/content/blog/${slug}.md`, import.meta.url);
  let source = await readFile(file, 'utf8');
  source = source.replace(/^seoTitle:.*$/m, `seoTitle: ${JSON.stringify(values.title)}`);
  source = source.replace(/^description:.*$/m, `description: ${JSON.stringify(values.description)}`);
  await writeFile(file, source);
}

console.log(`Optimized metadata for ${Object.keys(metadata).length} indexed articles.`);
