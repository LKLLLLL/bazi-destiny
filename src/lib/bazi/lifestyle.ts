// Lifestyle guidance library — 5 dimensions of daily alignment
// Based on dominant element and Day Master stem

export interface LifestyleGuide {
  wear: string[];
  carry: string[];
  routine: string[];
  diet: string[];
  conduct: string[];
}

// Mapping by dominant element
const ELEM_GUIDE: Record<string, LifestyleGuide> = {
  Wood: {
    wear: [
      'Green, teal, and forest tones strengthen your natural growth energy. Avoid white and metallic silver for daily wear.',
      'Natural fabrics — cotton, linen, hemp — resonate with Wood\'s organic nature. Avoid synthetic polyesters.',
      'Vertical stripes and tall silhouettes echo the upward-reaching quality of trees. Floral patterns are auspicious.',
      'Wood accessories: wooden bead bracelets, bamboo watches, jade pendants. Green aventurine is your power stone.',
    ],
    carry: [
      'A small wooden charm or bamboo keychain in your bag or pocket — keeps growth energy close.',
      'Green aventurine or jade stone in your dominant hand pocket — rub when making decisions.',
      'A leather-bound notebook (brown or green) for ideas — Wood types thrive when they externalize plans.',
      'Carry a live plant or small succulent at your workspace — it feeds your element passively.',
    ],
    routine: [
      'Morning: 10 minutes barefoot on grass or soil — grounds Wood\'s upward energy. Best before 8 AM.',
      'Midday: a 15-minute walk in a park or near trees resets your creative flow. Do this between 11 AM–1 PM.',
      'Evening: journaling or sketching before bed — Wood types process best through reflection, not reaction.',
      'Weekly: one day fully offline in nature — hiking, gardening, or simply sitting under a tree.',
    ],
    diet: [
      'Green vegetables are your fuel — spinach, kale, broccoli, bok choy. Eat them daily.',
      'Sour foods strengthen Wood: lemon water in the morning, fermented foods (kimchi, sauerkraut), vinegar-based dressings.',
      'Grains and seeds: brown rice, oats, chia seeds, pumpkin seeds — they carry growth potential.',
      'Avoid excessive dairy and fried foods — they dampen Wood\'s natural upward movement.',
    ],
    conduct: [
      'Speak in growth language: "Let\'s build," "Here\'s what we can create," "This will develop into..."',
      'When stuck, physically move — Wood energy flows through action. A walk solves more than a sit-down meeting.',
      'Practice saying "not yet" instead of "no" — Wood doesn\'t reject, it redirects growth.',
      'In conflict, lead with "What do we both want to see grow here?" — turns opposition into co-creation.',
    ],
  },
  Fire: {
    wear: [
      'Red, crimson, orange, and warm coral amplify your natural radiance. Avoid black and deep navy for daily wear.',
      'Dynamic fabrics with movement — silk, flowing cuts, anything that catches light and creates motion.',
      'Triangular or pointed accessories echo Fire\'s upward-reaching flame. A single bold statement piece per outfit.',
      'Fire stones: carnelian, red garnet, ruby (even garnet works). Gold jewelry amplifies your element.',
    ],
    carry: [
      'A small red pouch with carnelian or garnet — Fire types benefit from having a "spark" in their pocket.',
      'A mini notebook for spontaneous ideas — Fire energy flashes bright but fades fast without capture.',
      'Peppermint or cinnamon essential oil — a quick inhale reignites focus when energy dips.',
      'A portable charger for your devices — Fire types burn through batteries as fast as they burn through ideas.',
    ],
    routine: [
      'Morning: 5 minutes of sun exposure (face and palms) within 30 minutes of waking — directly fuels Fire.',
      'Midday peak (11 AM–2 PM): your power hours. Schedule creative work, presentations, and social energy here.',
      'Evening: a deliberate "cool-down" ritual — herbal tea, dimmed lights, no screens 30 minutes before bed.',
      'Exercise: high-intensity intervals, dance, martial arts — Fire needs to burn, not simmer. 3–4x per week.',
    ],
    diet: [
      'Bitter foods balance Fire: dark chocolate, coffee (in moderation), bitter greens (arugula, dandelion), green tea.',
      'Red foods resonate: tomatoes, red peppers, strawberries, goji berries, pomegranate.',
      'Hydration is critical — Fire types burn through water fast. Aim for 8+ glasses, ideally with a squeeze of lemon.',
      'Avoid excessive alcohol and spicy foods — they overheat an already-hot system.',
    ],
    conduct: [
      'Your superpower is enthusiasm — lead with it. People follow Fire not because they must, but because they want to.',
      'When passionate, pause 3 seconds before speaking — Fire\'s intensity can overwhelm quieter types.',
      'Practice "spotlight sharing" — after every story you tell, ask someone else to share theirs.',
      'In meetings, sit facing south (your natural power direction) for extra presence and conviction.',
    ],
  },
  Earth: {
    wear: [
      'Warm earth tones — terracotta, beige, mustard yellow, camel, warm brown. These colors stabilize and ground you.',
      'Structured, well-tailored clothing with clean lines. Earth types look best in timeless, classic pieces.',
      'Square or rectangular accessories echo Earth\'s solid geometry. A quality leather belt or bag is your signature.',
      'Earth stones: yellow jasper, citrine, tiger\'s eye. Wear as a bracelet or pendant touching the skin.',
    ],
    carry: [
      'A small citrine or tiger\'s eye stone — rub when feeling scattered. Earth\'s stability comes from touch.',
      'A high-quality planner or calendar — Earth types thrive on structure and visible progress.',
      'Healthy snacks (nuts, dried fruit) — Earth energy dips without regular fuel. Never skip meals.',
      'A scarf or wrap in earth tones — provides literal and energetic warmth when you feel exposed.',
    ],
    routine: [
      'Morning: a consistent wake-up time — Earth craves rhythm. Same time every day, even weekends.',
      'Mid-morning: 10 minutes of grounding — feet flat on floor, deep breathing, visualizing roots into the earth.',
      'Afternoon: a 20-minute "stability check" — review your day\'s progress, adjust, then continue. No rushing.',
      'Weekly: one home ritual — cooking a meal from scratch, repotting a plant, or rearranging a room. Tangible creation.',
    ],
    diet: [
      'Root vegetables are your foundation: sweet potatoes, carrots, beets, parsnips. Eat them roasted or in soups.',
      'Sweet flavors (natural, not processed) strengthen Earth: dates, figs, honey, maple syrup, squash.',
      'Warm, cooked meals over raw foods — your digestion prefers gentle, slow-cooked nourishment.',
      'Grains: millet, barley, oats, corn. Avoid excessive cold drinks and ice water.',
    ],
    conduct: [
      'Your gift is reliability — lean into it. Being the person others count on IS your brand.',
      'When overwhelmed, physically ground: both feet on floor, hands on a solid surface, three deep breaths.',
      'Practice saying a warm "let me think about that" instead of an immediate yes — Earth\'s generosity needs boundaries.',
      'In teams, position yourself as the stabilizer — you\'re the foundation, not the fireworks. Both are needed.',
    ],
  },
  Metal: {
    wear: [
      'White, cream, silver, gray, and metallic tones enhance Metal\'s clarity. A crisp white shirt is your power piece.',
      'Clean, minimalist lines with sharp tailoring. Avoid cluttered patterns — Metal thrives in precision.',
      'Silver or white gold jewelry — a simple chain, a clean watch face, geometric earrings. Less is more.',
      'Metal stones: clear quartz, moonstone, hematite. Wear as a single, deliberate piece, not layered.',
    ],
    carry: [
      'A clear quartz crystal — the "master healer" stone amplifies Metal\'s natural clarity and precision.',
      'A quality metal pen — writing by hand helps Metal types organize thoughts before speaking.',
      'A small mirror compact — Metal energy benefits from literal reflection. Use before important decisions.',
      'Minimalist wallet or card holder — decluttered carry equals decluttered mind for Metal types.',
    ],
    routine: [
      'Morning: 10 minutes of silent contemplation or meditation — Metal types sharpen through stillness, not action.',
      'Work blocks: 90-minute focused sprints with 15-minute breaks. Metal performs best with defined edges.',
      'Evening: a "declutter ritual" — clear your desk, organize tomorrow\'s priorities, physically close the day.',
      'Weekly: one deep clean or organization task — a tidy space is a tidy mind for Metal constitutions.',
    ],
    diet: [
      'White and pale foods resonate: rice, cauliflower, white fish, tofu, pears, white beans.',
      'Pungent flavors strengthen Metal: ginger, garlic, white pepper, radish, wasabi. Use generously in cooking.',
      'Light, clean meals over heavy, greasy foods. Your system processes best with clarity and simplicity.',
      'Herbal teas: white tea, chrysanthemum, peppermint. Avoid excessive dairy and mucus-forming foods.',
    ],
    conduct: [
      'Your precision is a gift — don\'t apologize for high standards. Frame feedback as "raising the bar together."',
      'When frustrated by chaos, create one small piece of order — organize one drawer, clean one file. It resets you.',
      'Practice saying "I appreciate that perspective" before critiquing — Metal\'s sharpness needs a velvet sheath.',
      'In negotiations, lead with facts, close with fairness. Metal types win by being the clearest voice in the room.',
    ],
  },
  Water: {
    wear: [
      'Deep blue, navy, black, and indigo tones amplify Water\'s depth and intuition. Avoid bright red and orange.',
      'Flowing, draped silhouettes — water moves in curves, not angles. Soft fabrics that drape rather than structure.',
      'Wave-like or circular patterns, asymmetrical hemlines. A single flowing scarf or wrap completes any outfit.',
      'Water stones: lapis lazuli, blue apatite, aquamarine. Wear as a pendant close to the heart or throat.',
    ],
    carry: [
      'A lapis lazuli or aquamarine stone — rub when needing clarity. Water types access wisdom through touch.',
      'A journal for dreams and intuitions — Water\'s insights come in ripples, not waves. Capture them immediately.',
      'A high-quality water bottle — staying physically hydrated keeps Water\'s mental currents flowing.',
      'Earbuds and a calming playlist — water types need sonic shelter in noisy environments.',
    ],
    routine: [
      'Morning: 10 minutes of free writing (stream of consciousness) — clears the mental channels before the day begins.',
      'Midday: a short walk near water if possible (fountain, river, even a sink ritual). Water by water restores you.',
      'Evening: a warm bath or foot soak — physical water immersion is the fastest reset for Water constitutions.',
      'Sleep: prioritize 7-8 hours minimum. Water types process deeply during sleep; skimping here damages intuition.',
    ],
    diet: [
      'Dark-colored foods resonate: black beans, black rice, seaweed, eggplant, dark berries, black sesame.',
      'Salty flavors in moderation: miso, tamari, sea salt, seaweed snacks. Salt carries Water\'s mineral intelligence.',
      'Soups and broths are your medicine — bone broth, miso soup, congee. Warm liquids nourish your element.',
      'Stay hydrated (obviously) but especially with warm water. Cold water contracts Water energy.',
    ],
    conduct: [
      'Your intuition is your compass — trust it even when you can\'t articulate why. Water knows before words form.',
      'When overwhelmed by others\' energy, physically wash your hands or splash your face. Water cleanses energetically.',
      'Practice saying "I need to sit with that" — Water types need processing time. It\'s not hesitation, it\'s depth.',
      'In teams, position yourself as the strategist — you see patterns others miss. Your value is in the currents beneath.',
    ],
  },
};

// Day Master — personality-adjusted tips
const STEM_TWEAKS: Record<string, Partial<LifestyleGuide>> = {
  '甲': {
    wear: ['Yang Wood bonus: a single bold wooden accessory — a statement bangle or carved necklace. Your presence IS the accessory.'],
    conduct: ['As Jia Wood, you naturally take charge. Balance this by explicitly asking "What do you think?" at least once per meeting.'],
  },
  '乙': {
    wear: ['Yin Wood bonus: delicate floral or vine motifs. Your power is in the detail — choose pieces others need to lean in to see.'],
    conduct: ['As Yi Wood, your adaptability is legendary. But don\'t bend so far you lose your center — set one non-negotiable per week.'],
  },
  '丙': {
    wear: ['Yang Fire bonus: a single red accent piece. Your natural radiance means one bold item is enough — don\'t compete with yourself.'],
    conduct: ['As Bing Fire, you light up rooms. The discipline: let others finish their sentences before you add your flame.'],
  },
  '丁': {
    wear: ['Yin Fire bonus: a small candle or soft glow light at your desk. Your power is sustained warmth, not explosions.'],
    conduct: ['As Ding Fire, you illuminate quietly. Your gift is making others feel seen — use that deliberately in every conversation.'],
  },
  '戊': {
    wear: ['Yang Earth bonus: a single piece of substantial gold jewelry. Your energy is mountain-like — wear what feels weighty and real.'],
    conduct: ['As Wu Earth, you are the mountain others lean on. Practice receiving support — let someone else carry the weight once a week.'],
  },
  '己': {
    wear: ['Yin Earth bonus: soft, nurturing fabrics like cashmere or brushed cotton. Your energy is the garden, not the mountain.'],
    conduct: ['As Ji Earth, you nurture naturally. Set a "nurture yourself first" appointment each week — you can\'t water from an empty well.'],
  },
  '庚': {
    wear: ['Yang Metal bonus: a sharp, architectural piece — a geometric ring or angular earrings. Precision is your signature.'],
    conduct: ['As Geng Metal, your standards are high. Frame them as "excellence we can achieve together" rather than "what\'s wrong here."'],
  },
  '辛': {
    wear: ['Yin Metal bonus: delicate silver chains or tiny studs. Your refinement speaks in whispers — let people lean in to hear.'],
    conduct: ['As Xin Metal, your discernment is precise. Use it to identify what\'s RIGHT first, then gently suggest refinements.'],
  },
  '壬': {
    wear: ['Yang Water bonus: deep navy or ocean-blue pieces. Your power is the tidal force — wear colors that suggest depth.'],
    conduct: ['As Ren Water, you see the big picture instinctively. The practice: articulate one concrete step even when you see a hundred.'],
  },
  '癸': {
    wear: ['Yin Water bonus: iridescent or subtly changing pieces — moonstone, opal tones. Your magic is in the mystery.'],
    conduct: ['As Gui Water, your wisdom runs deep and quiet. Share one insight per day explicitly — the world needs your depth spoken aloud.'],
  },
};

export function getLifestyleGuide(dominantElement: string, dayStem: string): LifestyleGuide {
  const elementName: Record<string, string> = {
    '木': 'Wood',
    '火': 'Fire',
    '土': 'Earth',
    '金': 'Metal',
    '水': 'Water',
  };
  const base = ELEM_GUIDE[elementName[dominantElement] || dominantElement] || ELEM_GUIDE['Water'];
  const tweaks = STEM_TWEAKS[dayStem] || {};

  return {
    wear: [...(base.wear || []), ...(tweaks.wear || [])],
    carry: [...(base.carry || []), ...(tweaks.carry || [])],
    routine: [...(base.routine || []), ...(tweaks.routine || [])],
    diet: [...(base.diet || []), ...(tweaks.diet || [])],
    conduct: [...(base.conduct || []), ...(tweaks.conduct || [])],
  };
}
