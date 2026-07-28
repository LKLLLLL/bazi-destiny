export type EnglishElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

const STYLES: Record<EnglishElement, string> = {
  Wood: '<strong>expresses love through action and creation</strong>—not big on words, but always showing up',
  Fire: '<strong>loves out loud</strong>—warm, expressive, emotional highs and lows are part of the package',
  Earth: '<strong>steady and practical</strong>—affection shows up as reliability, care, and quiet presence',
  Metal: '<strong>precise and composed</strong>—love lives in the details, thoughtful gestures over grand speeches',
  Water: '<strong>deeply intuitive</strong>—connects through emotional sharing, needs to feel truly heard',
};

const ACTIVITIES: Record<string, string> = {
  'Wood-Wood': 'tend a balcony garden together—plant one new green thing each week',
  'Wood-Fire': "cook a new dish from scratch on Sunday evenings—fire's heat meets wood's creativity",
  'Wood-Earth': 'reorganize a shared room—build your own system of order together',
  'Wood-Metal': 'collaborate on a woodworking craft or DIY furniture project',
  'Wood-Water': 'hike a riverside trail every weekend—water nourishes wood in nature',
  'Fire-Wood': "cook a new dish from scratch on Sunday evenings—fire's heat meets wood's creativity",
  'Fire-Fire': 'take a weekly dance or fitness class—channel that double-fire energy together',
  'Fire-Earth': 'repaint a wall or refurbish a vintage piece of furniture',
  'Fire-Metal': "visit galleries or attend live concerts—fire's passion tempered by metal's refinement",
  'Fire-Water': 'walk along the beach at sunrise—fire and water find their peace in nature',
  'Earth-Wood': 'reorganize a shared room—build your own system of order together',
  'Earth-Fire': 'repaint a wall or refurbish a vintage piece of furniture',
  'Earth-Earth': 'plan your monthly finances or next trip—double-earth stability in action',
  'Earth-Metal': "study investing or learn a marketable skill—earth nurtures metal's practicality",
  'Earth-Water': 'set up an aquarium or grow a moss terrarium—earth and water blended daily',
  'Metal-Wood': 'collaborate on a woodworking craft or DIY furniture project',
  'Metal-Fire': "visit galleries or attend live concerts—fire's passion tempered by metal's refinement",
  'Metal-Earth': "study investing or learn a marketable skill—earth nurtures metal's practicality",
  'Metal-Metal': 'share one industry insight or new idea each morning—two sharp minds refining each other',
  'Metal-Water': 'co-write a shared journal or film reviews—water inspires, metal crafts the words',
  'Water-Wood': 'hike a riverside trail every weekend—water nourishes wood in nature',
  'Water-Fire': 'walk along the beach at sunrise—fire and water find their peace in nature',
  'Water-Earth': 'set up an aquarium or grow a moss terrarium—earth and water blended daily',
  'Water-Metal': 'co-write a shared journal or film reviews—water inspires, metal crafts the words',
  'Water-Water': 'stay up late talking, or read the same book on a rainy Sunday—double water understands deepest',
};

const DIRECTIONS: Record<EnglishElement, string> = { Wood: 'east', Fire: 'south', Earth: 'center', Metal: 'west', Water: 'north' };
const OBJECTS: Record<EnglishElement, string> = {
  Wood: 'a potted plant or small tree',
  Fire: 'a warm-toned lamp or candle set',
  Earth: 'ceramic pottery or a natural stone piece',
  Metal: 'a metal wind chime or framed mirror',
  Water: 'a small tabletop fountain or crystal bowl of water',
};
const COOLDOWNS: Record<EnglishElement, string> = {
  Wood: "<strong>step outside alone for ten minutes</strong>—trees and grass are Wood's natural stabilizers",
  Fire: "<strong>drink a glass of cool water slowly, in silence</strong>—water calms fire's heat from within",
  Earth: "<strong>stand barefoot on wood flooring</strong>, or place both hands on a potted plant's soil for a minute",
  Metal: '<strong>organize a single drawer</strong> or polish a metal object—restored order settles a Metal mind',
  Water: '<strong>wash your hands and face with warm water</strong>, or play a recording of gentle rain or flowing stream',
};
const TIMES: Record<EnglishElement, string> = {
  Wood: 'Dawn (5–7 AM)', Fire: 'Late morning (10 AM–noon)', Earth: 'Early morning (7–9 AM)', Metal: 'Daybreak (6–8 AM)', Water: 'First light (5–6 AM)',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char);
}

function paragraphs(...values: string[]): string {
  return values.map((value) => `<p>${value}</p>`).join('');
}

export function isEnglishElement(value: unknown): value is EnglishElement {
  return typeof value === 'string' && Object.hasOwn(STYLES, value);
}

export function getSynergyGuide(element1: EnglishElement, element2: EnglishElement, name1: string, name2: string) {
  const n1 = escapeHtml(name1.trim().slice(0, 24) || 'Person 1');
  const n2 = escapeHtml(name2.trim().slice(0, 24) || 'Person 2');
  const activity = ACTIVITIES[`${element1}-${element2}`] || 'complete one small creative project together each week';
  return {
    title: `${name1.trim().slice(0, 24) || 'Person 1'} & ${name2.trim().slice(0, 24) || 'Person 2'}`,
    subtitle: `A personalized aura alignment guide for your ${element1} × ${element2} match. Five practices to deepen your elemental bond.`,
    badge: `${element1} × ${element2}`,
    intro: `Every couple has a unique energy signature. When ${element1} meets ${element2}, the Five Elements dance in a pattern that is entirely yours. This guide translates that ancient wisdom into five simple daily practices—designed for ${name1.trim().slice(0, 24) || 'Person 1'} and ${name2.trim().slice(0, 24) || 'Person 2'} specifically.`,
    cards: [
      {
        title: 'Morning Ritual',
        bodyHtml: paragraphs(
          `<em>${TIMES[element1]}</em> is when ${element1} and ${element2} energies harmonize best—this is your couple's power hour. <strong>Begin each day sitting side by side in silence for five minutes.</strong> No phones, no words, just the shared rhythm of breath.`,
          `${n1} (${element1}) <strong>initiates the calm</strong>; ${n2} (${element2}) <strong>receives</strong>. Over two weeks, this simple ritual will synchronize your energy fields at a level you can both feel.`
        ),
      },
      {
        title: 'Communication Style',
        bodyHtml: paragraphs(
          `${n1} (${element1}) ${STYLES[element1]}.`,
          `${n2} (${element2}) ${STYLES[element2]}.`,
          `Here is the bridge: when ${n1} goes quiet, <strong>do not push</strong>—they are processing internally, and silence is not withdrawal. When ${n2} needs to talk, <strong>pause everything and listen with full presence</strong>—not to fix, but to witness.`,
          'These two simple shifts alone will transform how conflicts resolve between you.'
        ),
      },
      {
        title: 'Shared Activity',
        bodyHtml: paragraphs(
          `<strong>Your elemental prescription:</strong> ${activity}.`,
          'Why this works: <em>physical co-creation is the fastest path to deepening an elemental bond.</em> When your hands build together, your energies merge at the Five Elements level—far deeper than conversation alone can reach.',
          '<strong>Make it a weekly ritual;</strong> consistency matters more than scale.'
        ),
      },
      {
        title: 'Home Energy',
        bodyHtml: paragraphs(
          `<strong>Face your bed toward the ${DIRECTIONS[element1]}</strong>—this aligns ${n1}'s ${element1} energy with the natural flow of your shared space.`,
          `<strong>Place ${OBJECTS[element2]} in the ${DIRECTIONS[element2]} area</strong> of your home to anchor ${n2}'s ${element2} presence.`,
          `Most importantly: <strong>keep the center of your living space open and uncluttered.</strong> ${element1} and ${element2} energies need clear, unobstructed pathways to flow, merge, and strengthen each other.`
        ),
      },
      {
        title: 'Conflict Resolution',
        bodyHtml: paragraphs(
          'When tension rises, <strong>separate into your own spaces for fifteen minutes</strong>—no negotiation, no last word.',
          `${n1}: ${COOLDOWNS[element1]}.`,
          `${n2}: ${COOLDOWNS[element2]}.`,
          'Here is the most important part: when you come back together, <strong>do not begin with words.</strong> <strong>Start with a single touch</strong>—hold hands, embrace, or gently rest a hand on the other\'s shoulder. Physical contact resets your combined energy field <em>before</em> words can undo it. Then speak. This sequence changes everything.'
        ),
      },
    ],
  };
}
