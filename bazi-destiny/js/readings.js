/**
 * BaZi Destiny — English Reading Content
 * All interpretative content for the app
 */

(function(global) {
  'use strict';

  // ============================================================
  // PERSONALITY PROFILES (by dominant element + day master combos)
  // ============================================================

  const PERSONALITY_READINGS = {
    // Wood personalities
    '木_甲': {
      title: 'The Rooted Visionary',
      traits: ['Natural born leader with grand vision', 'Thrives on growth and expansion', 'Strong moral compass and integrity', 'Can be inflexible when plans are challenged', 'Deeply loyal to those they respect'],
      summary: 'Your Day Master, Jia (Yang Wood), places you in the company of natural-born leaders and visionaries. Like a great tree, you are rooted in your values but always reaching upward toward your goals. Your strength lies in your ability to inspire others and create structures that endure. The challenge for you is learning when to bend in the wind rather than stand rigid.',
      strength: 'Your strategic vision and unwavering determination make you the person others turn to when something truly matters.',
      weakness: 'You may struggle with impatience and frustration when others cannot see or move at your pace.',
      idealPath: 'Entrepreneurship, leadership, creative direction, or any field where bold vision meets long-term planning.'
    },
    '木_乙': {
      title: 'The Graceful Innovator',
      traits: ['Creative and emotionally intelligent', 'Adaptable like a vine finding sunlight', 'Deep empathy for others', 'Can struggle with indecision', 'Natural mediator and connector'],
      summary: 'With Yi (Yin Wood) as your Day Master, you possess the subtle power of growth — the ability to find cracks in any wall and flourish. You are creative, perceptive, and deeply connected to your emotions and the emotions of those around you. You see solutions where others see obstacles.',
      strength: 'Your adaptability and emotional intelligence make you an exceptional collaborator and creative problem-solver.',
      weakness: 'Your flexibility can tip into indecision, and you may avoid necessary confrontations.',
      idealPath: 'Creative arts, counseling, diplomacy, HR, design, or roles requiring emotional nuance.'
    },

    // Fire personalities
    '火_丙': {
      title: 'The Radiant Pioneer',
      traits: ['Full of energy and enthusiasm', 'Direct and honest communication', 'Natural performer and leader', 'Can burn too bright too fast', 'Optimistic and inspiring'],
      summary: 'Bing (Yang Fire) as your Day Master makes you a natural source of light and energy. You bring warmth and illumination to every room you enter. Your enthusiasm is infectious, and your directness is refreshing. Like fire, you are drawn to movement and change.',
      strength: 'Your vitality and ability to inspire others are extraordinary. You have a gift for making people believe in bold ideas.',
      weakness: 'Fire can consume itself. You may struggle with burnout or become impatient with slower processes.',
      idealPath: 'Entertainment, public speaking, marketing, entrepreneurship, or any role that leverages your radiant energy.'
    },
    '火_丁': {
      title: 'The Inner Flame',
      traits: ['Deep emotional world', 'Perceptive and insightful', 'Quietly powerful', 'Can be perfectionistic', 'Passionate in relationships'],
      summary: 'Ding (Yin Fire) burns within — a flame that illuminates the inner world. You are not loud or attention-seeking, but your presence is deeply felt. You have an extraordinary ability to sense what others are feeling and to communicate with precision and depth.',
      strength: 'Your emotional depth and perceptiveness make you an exceptional friend, partner, and creative professional.',
      weakness: 'You may retreat into your inner world too much, or struggle with perfectionism and high expectations.',
      idealPath: 'Writing, psychology, the arts, research, counseling, or any work requiring depth and sensitivity.'
    },

    // Earth personalities
    '土_戊': {
      title: 'The Unshakeable Foundation',
      traits: ['Reliable and trustworthy', 'Patient and methodical', 'Practical wisdom and common sense', 'Can be stubborn', 'Protective of loved ones'],
      summary: 'Wu (Yang Earth) makes you the bedrock upon which others build their lives. You are stable, grounded, and profoundly reliable. Your practical wisdom comes not from books but from a deep understanding of how things work in the real world.',
      strength: 'Your reliability and groundedness are the anchor others need in turbulent times.',
      weakness: 'Your desire for stability can become resistance to change, and you may struggle to let go of control.',
      idealPath: 'Finance, real estate, agriculture, construction, education, or any field requiring patience and persistence.'
    },
    '土_己': {
      title: 'The Nurturing Sage',
      traits: ['Introspective and thoughtful', 'Nurturing and supportive', 'Strong sense of responsibility', 'Can be self-critical', 'Deeply connected to home and family'],
      summary: 'Ji (Yin Earth) makes you the fertile ground from which life grows. You are introspective, nurturing, and deeply connected to the cycles of nature and life. You have a natural wisdom that comes from paying close attention to the world.',
      strength: 'Your ability to nurture, support, and create safe spaces for others is a rare and precious gift.',
      weakness: 'You may give too much of yourself to others, neglecting your own needs in the process.',
      idealPath: 'Healthcare, social work, teaching, hospitality, wellness, or roles centered on care and service.'
    },

    // Metal personalities
    '金_庚': {
      title: 'The Bold Reformer',
      traits: ['Strong sense of justice', 'Direct and decisive', 'Intellectually sharp', 'Can be critical', 'Values truth and fairness above comfort'],
      summary: 'Geng (Yang Metal) gives you the sharpness of a well-forged blade — precise, powerful, and designed to cut through confusion to the truth. You have an exceptional mind and a strong sense of justice. You are not afraid to speak uncomfortable truths.',
      strength: 'Your intellectual clarity and decisiveness make you an excellent problem-solver and advocate.',
      weakness: 'Your sharpness can become harshness, and you may hurt others unintentionally with your directness.',
      idealPath: 'Law, politics, engineering, military, quality control, or any field requiring precision and integrity.'
    },
    '金_辛': {
      title: 'The Refined Visionary',
      traits: ['Appreciates beauty and quality', 'Intellectually sophisticated', 'Transformative spirit', 'Can be overly self-critical', 'Drawn to beauty in all forms'],
      summary: 'Xin (Yin Metal) is the precious metal of refinement and beauty. You are drawn to quality, beauty, and elegance in all forms. You have a transformative quality — you have the ability to take raw ideas and refine them into something beautiful and valuable.',
      strength: 'Your appreciation for beauty and quality, combined with your transformative mind, creates exceptional creative and aesthetic outcomes.',
      weakness: 'You may be too critical of yourself and others, and struggle with perfectionism.',
      idealPath: 'Art direction, jewelry design, luxury goods, fashion, cosmetics, or any field where aesthetics matter.'
    },

    // Water personalities
    '水_壬': {
      title: 'The Flowing Sage',
      traits: ['Deeply wise and perceptive', 'Adapts to any container', 'Communicates complex ideas easily', 'Can lack direction', 'Emotionally generous'],
      summary: 'Ren (Yang Water) makes you the river that shapes mountains. You are wise, perceptive, and extraordinarily adaptable. You flow around obstacles rather than crashing against them, finding the path of least resistance to your destination.',
      strength: 'Your wisdom and adaptability make you an exceptional advisor, communicator, and strategist.',
      weakness: 'Your adaptability can become a lack of personal direction, and you may drift without a clear purpose.',
      idealPath: 'Writing, media, counseling, trade, travel, or any field requiring broad vision and fluent communication.'
    },
    '水_癸': {
      title: 'The Deep Mystic',
      traits: ['Profoundly introspective', 'Intuitive and psychic', 'Highly sensitive', 'Can withdraw from the world', 'Drawn to hidden knowledge'],
      summary: 'Gui (Yin Water) is the deepest water — rain, dew, underground streams. You are introspective, intuitive, and deeply connected to the invisible currents of life. You see beneath the surface of things, sensing truths that others miss entirely.',
      strength: 'Your depth of perception and intuition give you access to knowledge and insights that others cannot reach.',
      weakness: 'You may withdraw too deeply into your inner world, or struggle with the harsh brightness of everyday reality.',
      idealPath: 'Research, spirituality, healing arts, writing, investigation, or any field requiring deep perception and solitude.'
    }
  };

  // Fallback for any combination
  const PERSONALITY_FALLBACK = {
    title: 'The Balanced Soul',
    traits: ['Adapts to changing circumstances', 'Seeks harmony in all things', 'Has both strength and sensitivity', 'Grows through experience'],
    summary: 'Your BaZi chart reveals a unique combination of elements that creates a balanced and adaptable soul. You possess the strengths of multiple elemental energies, giving you remarkable versatility. Your path is one of integration — bringing together disparate parts of yourself into a cohesive whole.',
    strength: 'Your adaptability and balance give you resilience in the face of challenges.',
    weakness: 'Your desire for balance can make it hard to fully commit to one direction.',
    idealPath: 'Roles requiring versatility, diplomacy, and the ability to see multiple perspectives.'
  };

  function getPersonalityReading(dayStem, dominantElement) {
    const key = `${dominantElement}_${dayStem}`;
    return PERSONALITY_READINGS[key] || PERSONALITY_FALLBACK;
  }

  // ============================================================
  // CAREER & WEALTH READINGS
  // ============================================================

  const CAREER_READINGS = {
    '木': {
      overview: 'Your elemental energy is rooted in growth, expansion, and upward momentum. In career, you are a natural entrepreneur and visionary. You thrive when you can build something from nothing — a company, a team, an idea. Working within rigid hierarchies may frustrate you. Your ideal career involves creation, strategy, and the satisfaction of seeing things grow.',
      strengths: ['Strategic thinking and long-term planning', 'Natural leadership ability', 'Vision for what could be, not just what is', 'Inspiring others with your conviction'],
      challenges: ['Impatience with slow processes', 'Difficulty delegating or trusting others\' methods', 'Can overextend yourself'],
      wealthTips: ['Plant seeds early — your wealth grows steadily over time', 'Invest in growth-oriented assets', 'Your career is your primary wealth engine; prioritize it', 'Be cautious about financial co-signing']
    },
    '火': {
      overview: 'Fire energy burns bright and attracts attention. Your career naturally draws eyes to you — you are often the star of your team or the face of a project. You thrive in dynamic, fast-paced environments where your energy is an asset. Public-facing roles suit you well. The danger is burning out by taking on too much.',
      strengths: ['Natural charisma and ability to inspire', 'Fast decision-making under pressure', 'Optimism that lifts team morale', 'Excellent in sales, entertainment, and leadership'],
      challenges: ['Can be inconsistent or impulsive', 'May prioritize quick wins over sustainable growth', 'Difficulty with long-term patience'],
      wealthTips: ['Your earning potential is high but volatile; save consistently', 'Income may come in surges — build reserves', 'Avoid high-risk speculative investments', 'Consider multiple income streams']
    },
    '土': {
      overview: 'Earth energy is stable, patient, and deeply practical. You are the person others rely on to maintain the foundation while everyone else chases new ideas. Your career benefits from consistency, patience, and compounding — think long-term investments in your skills and reputation. You build wealth slowly but sustainably.',
      strengths: ['Unwavering reliability and work ethic', 'Excellent at managing systems and processes', 'Practical problem-solving skills', 'Strong network of loyal relationships'],
      challenges: ['May resist necessary change or innovation', 'Can be slow to act on opportunities', 'Tendency to undervalue your own contributions'],
      wealthTips: ['Real estate and tangible assets suit your energy well', 'Compound interest is your greatest ally — start early and stay consistent', 'Your loyalty may attract financial dependents; set boundaries', 'Property investments tend to be favorable']
    },
    '金': {
      overview: 'Metal energy is sharp, precise, and justice-oriented. You excel in careers where precision, analysis, and clear standards matter. You are the person who finds the flaw in the plan, the error in the calculation, the weakness in the argument. Your career benefits from structure, clear metrics, and intellectual challenge.',
      strengths: ['Exceptional analytical and critical thinking', 'Clear communication of complex ideas', 'Strong ethical compass and integrity', 'Natural leader in quality-focused roles'],
      challenges: ['Can be overly critical of self and others', 'May struggle with ambiguity or emotional workplace dynamics', 'Perfectionism can slow progress'],
      wealthTips: ['Structured, consistent investing suits you (index funds, retirement accounts)', 'Your precision may lead you to detailed financial planning — this is a strength', 'Avoid emotionally-driven financial decisions', 'Career advancement and professional credentials drive your wealth']
    },
    '水': {
      overview: 'Water energy is fluid, wise, and communicative. You thrive in roles that involve ideas, information, and connection between people. Your career benefits from your extraordinary communication skills and your ability to see the big picture. You may struggle in highly structured environments, but excel when given intellectual freedom.',
      strengths: ['Exceptional communication and persuasion skills', 'Broad vision and strategic thinking', 'Ability to adapt to any environment or audience', 'Natural talent for negotiation and deal-making'],
      challenges: ['May lack focus or direction without external structure', 'Can be overly accommodating', 'May avoid necessary confrontation'],
      wealthTips: ['Your wealth often comes through connections and communication — nurture your network', 'Trading and commerce favor your energy', 'Intellectual property and media can be lucrative', 'Be mindful of over-diversification — focus builds wealth']
    }
  };

  function getCareerReading(element) {
    return CAREER_READINGS[element] || CAREER_READINGS['土'];
  }

  // ============================================================
  // RELATIONSHIP READINGS
  // ============================================================

  const RELATIONSHIP_READINGS = {
    '木': {
      overview: 'As a Wood type in relationships, you are direct, honest, and growth-oriented. You bring energy and direction to your partnerships. You want a relationship that grows and evolves — stagnation is your enemy. You are naturally protective of those you love and deeply loyal once committed.',
      idealPartner: 'Someone who appreciates your drive and can match your energy while providing emotional grounding.',
      communication: 'Direct and straightforward. You say what you mean and expect the same in return. Misunderstandings usually arise when your directness is perceived as harsh.',
      growthAreas: ['Learn to be patient with your partner\'s pace of growth', 'Express appreciation and affection more openly', 'Balance ambition with presence']
    },
    '火': {
      overview: 'Your relationship style is passionate, enthusiastic, and expressive. You bring warmth and excitement to your partnerships. You love deeply and publicly — your partner is likely the center of your world. The challenge is sustaining the fire through the quieter, everyday moments of a relationship.',
      idealPartner: 'Someone who appreciates your passion and can handle the intensity while keeping you grounded.',
      communication: 'Emotional and expressive. You may say things in the heat of the moment that you later regret. Practice pausing before reacting.',
      growthAreas: ['Develop patience for quieter relationship moments', 'Learn to listen more than you speak', 'Express love through consistent actions, not just grand gestures']
    },
    '土': {
      overview: 'You are the rock of your relationships — loyal, patient, and deeply committed. You create a sense of home and security for your partner. You show love through acts of service and steady presence rather than grand gestures. Your relationships deepen over time like fine wine.',
      idealPartner: 'Someone who values stability and is willing to build a life of depth and consistency.',
      communication: 'Considered and careful. You prefer to think before you speak. Your quiet presence can sometimes be misread as emotional distance.',
      growthAreas: ['Learn to express your feelings more openly', 'Embrace change and spontaneity in the relationship', 'Don\'t suppress your own needs for the sake of harmony']
    },
    '金': {
      overview: 'Your relationship style is characterized by clarity, fairness, and mutual respect. You value intellectual connection and clear communication above emotional expression. You are deeply loyal and expect the same level of commitment in return. You may struggle with the emotional intensity that deep love requires.',
      idealPartner: 'Someone who respects your need for space and independence while being equally committed.',
      communication: 'Precise and logical. You prefer to discuss issues objectively. You may avoid emotional conversations that feel messy or irrational.',
      growthAreas: ['Allow yourself to be emotionally vulnerable', 'Practice expressing affection without conditions', 'Understand that emotional expression is not weakness']
    },
    '水': {
      overview: 'You bring deep emotional connection and understanding to your relationships. You are intuitive about your partner\'s needs and can create profound intimacy. You are adaptable and accepting, often going with the flow of the relationship. The challenge is maintaining your own boundaries while being so attuned to your partner.',
      idealPartner: 'Someone who appreciates your emotional depth and provides gentle structure without constraining you.',
      communication: 'Sensitive and perceptive. You pick up on everything unsaid. This is a gift but can also lead to taking on your partner\'s emotional burdens.',
      growthAreas: ['Develop stronger personal boundaries', 'Express your own needs as clearly as you perceive others\'', 'Don\'t always go with the flow — advocate for what you want']
    }
  };

  function getRelationshipReading(element) {
    return RELATIONSHIP_READINGS[element] || RELATIONSHIP_READINGS['土'];
  }

  // ============================================================
  // HEALTH READINGS
  // ============================================================

  const HEALTH_READINGS = {
    '木': {
      overview: 'Wood governs the liver and nervous system in traditional Chinese medicine. As a Wood type, you are prone to stress-related issues when your growth is impeded. Your body responds to frustration and blocked ambition with physical tension. You need space to grow, create, and move forward.',
      commonConcerns: ['Liver and gallbladder health', 'Stress and tension (especially in shoulders/neck)', 'Eye strain and vision issues', 'Muscle tension from frustration'],
      wellnessTips: ['Regular exercise is essential for your mental health', 'Practice letting go of things you cannot control', 'Green foods and bitter flavors support your Wood energy', 'Ensure adequate sleep to manage stress']
    },
    '火': {
      overview: 'Fire governs the heart and circulatory system. As a Fire type, you are prone to issues related to excess — too much heat, too much excitement, too much intensity. Your nervous system can be overstimulated. You need both active movement and genuine rest.',
      commonConcerns: ['Heart and cardiovascular health', 'High blood pressure', 'Anxiety and restlessness', 'Burnout from overstimulation'],
      wellnessTips: ['Prioritize calming practices — meditation, nature, quiet time', 'Avoid excessive caffeine and stimulants', 'Heart-healthy diet (fish, vegetables, dark chocolate)', 'Learn to recognize the signs of burnout before they arrive']
    },
    '土': {
      overview: 'Earth governs the digestive system and spleen. As an Earth type, you are prone to issues related to overthinking and worry. Your digestive system is sensitive to emotional states. You need grounding practices and a regular routine.',
      commonConcerns: ['Digestive issues (bloating, stomach sensitivity)', 'Spleen and stomach health', 'Weight management challenges', 'Overthinking and worry affecting sleep'],
      wellnessTips: ['Regular meal times support your Earth energy', 'Cooked, warm foods are easier for your digestion', 'Grounding practices: walking, gardening, working with your hands', 'Establish consistent sleep and wake times']
    },
    '金': {
      overview: 'Metal governs the lungs and skin in traditional Chinese medicine. As a Metal type, you are prone to issues related to grief, loss, and the inability to let go. Your lungs and skin are sensitive to environmental factors. You need clean spaces and time to process emotions.',
      commonConcerns: ['Respiratory health (lungs, sinuses)', 'Skin conditions', 'Issues related to suppressed grief', 'Immune system sensitivity'],
      wellnessTips: ['Deep breathing exercises support your Metal energy', 'Practice letting go — both emotionally and practically', 'Spend time in clean, open environments', 'Pay attention to grief when it arises; don\'t suppress it']
    },
    '水': {
      overview: 'Water governs the kidneys and adrenal system. As a Water type, you are prone to issues related to fear, anxiety, and overwork. Your kidneys are sensitive to exhaustion and chronic stress. You need genuine rest and hydration — both physical and emotional.',
      commonConcerns: ['Kidney and adrenal health', 'Lower back pain', 'Chronic fatigue', 'Issues related to fear or unresolved anxiety'],
      wellnessTips: ['Prioritize adequate sleep — your body needs it', 'Stay well hydrated', 'Address fears and anxieties rather than suppressing them', 'Gentle exercise (swimming, walking) is better than extreme sports for you']
    }
  };

  function getHealthReading(element) {
    return HEALTH_READINGS[element] || HEALTH_READINGS['土'];
  }

  // ============================================================
  // FENG SHUI CONTENT
  // ============================================================

  function getFengShuiReading(element, dayStem, dominantElement) {
    const tips = {
      '木': [
        'Place living plants in the East and Southeast areas of your home to enhance Wood energy.',
        'Use green and blue colors throughout your living space.',
        'Avoid clutter in the East sector — it blocks your growth energy.',
        'Place a small water feature in the North to create a Water-Wood harmony.',
        'Wake up at sunrise to align with your Wood energy cycle.',
        'Keep your windows clear and unobstructed to let light and growth energy in.'
      ],
      '火': [
        'Use warm lighting (soft white, amber) rather than harsh fluorescent lights.',
        'Place a mirror in the South wall to amplify your Fire energy.',
        'Avoid excessive red or orange in bedrooms — use in living areas sparingly.',
        'Keep the South area of your home well-lit and open.',
        'Candles are excellent for Fire energy but never leave them unattended.',
        'Use the Fire Feng Shui bagua position (South) for your career and fame area.'
      ],
      '土': [
        'Use square and rectangular shapes in your decor — they represent Earth.',
        'Place crystals (citrine, yellow jasper) in the Northeast and Southwest.',
        'Avoid scattered or broken items — Earth energy values order and completeness.',
        'Keep the center of your home clear and well-lit.',
        'Use warm earth tones: terracotta, ochre, sand, and clay colors.',
        'A stable, heavy bed frame and headboard support your Earth energy.'
      ],
      '金': [
        'Use white, gray, and metallic colors throughout your home.',
        'Place metal sculptures or wind chimes in the West and Northwest areas.',
        'Keep your home clean and well-organized — Metal energy values clarity.',
        'Use round and oval shapes in decor.',
        'Place a six-coin feng shui cure in the wealth corner.',
        'White ceramic or porcelain vessels represent Metal well.'
      ],
      '水': [
        'Use flowing water features (fountains) in the North for career luck.',
        'Blue and black colors throughout the home support Water energy.',
        'Avoid heavy, dark energies in the bedroom.',
        'Use mirrors strategically to create a sense of space and flow.',
        'Keep your home free of stagnant energy (clutter, broken items).',
        'Wavy patterns and flowing shapes in decor support Water energy.'
      ]
    };

    const generalTips = tips[element] || tips['土'];

    const elementMeanings = {
      '木': 'Your Wood energy makes you drawn to growth and expansion. In your space, prioritize green living plants, natural wood furniture, and open spaces. Your home should feel like a garden — alive, growing, and breathing.',
      '火': 'Your Fire energy needs warmth and brightness. Soft lighting, warm colors, and good air circulation are essential. Your home should feel welcoming and energizing, but not overwhelming. Balance fire elements with water (a small fountain or aquarium) to prevent excess heat.',
      '土': 'Your Earth energy craves stability and nourishment. Your home should feel like a sanctuary — solid, comfortable, and well-organized. Invest in quality furniture, use earth tones, and keep the center of your home (the heart of the house) clear and beautiful.',
      '金': 'Your Metal energy values clarity, precision, and order. Your home should be clean, minimal, and well-lit. Use metallic accents, white colors, and circular shapes. Remove anything that is broken, unused, or emotionally heavy — Metal cannot tolerate impurity.',
      '水': 'Your Water energy flows through your space. Keep things dynamic and flowing — avoid blocking doors or windows. Water features in the North boost career energy. Your home should feel like a calm harbor — peaceful, spacious, and free of clutter.'
    };

    return {
      overview: elementMeanings[element] || elementMeanings['土'],
      tips: generalTips,
      personalCures: generatePersonalCures(element, dayStem)
    };
  }

  function generatePersonalCures(element, dayStem) {
    const cures = {
      '木': [
        { item: 'Lucky Bamboo (6 stalks)', area: 'East corner of home', purpose: 'Growth and vitality energy' },
        { item: 'Jade Plant', area: 'Southeast corner', purpose: 'Attracts wealth and growth' },
        { item: 'Green Candles', area: 'East wall', purpose: 'Enhances Wood energy cycle' }
      ],
      '火': [
        { item: 'Red Coral', area: 'South wall display', purpose: 'Amplifies career and fame energy' },
        { item: 'Crystal Lamp', area: 'Center of living room', purpose: 'Radiates warmth and positive energy' },
        { item: 'Portrait of Sun/Fire', area: 'South-facing wall', purpose: 'Enhances personal radiance' }
      ],
      '土': [
        { item: 'Yellow Crystal Cluster', area: 'Northeast corner', purpose: 'Wisdom and spiritual growth' },
        { item: 'Earth Statues (elephant, turtle)', area: 'Living room', purpose: 'Stability and grounding' },
        { item: 'Pottery Vase', area: 'Center of home', purpose: 'Harmony and nourishment' }
      ],
      '金': [
        { item: 'Metal Wind Chimes (6 rods)', area: 'West wall', purpose: 'Metal energy clarity' },
        { item: 'White Ceramic', area: 'Entrance hall', purpose: 'Attracts positive chi' },
        { item: 'Six-coin String', area: 'Wealth corner', purpose: 'Financial stability' }
      ],
      '水': [
        { item: 'Small Fountain', area: 'North wall or desk', purpose: 'Career and wisdom flow' },
        { item: 'Aquarium (with 6 goldfish)', area: 'Living room North', purpose: 'Attracts wealth energy' },
        { item: 'Black Obsidian Sphere', area: 'Wealth area', purpose: 'Protection and flow' }
      ]
    };

    return cures[element] || cures['土'];
  }

  // ============================================================
  // EXPORT
  // ============================================================

  const Readings = {
    getPersonality: getPersonalityReading,
    getCareer: getCareerReading,
    getRelationship: getRelationshipReading,
    getHealth: getHealthReading,
    getFengShui: getFengShuiReading
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Readings;
  } else if (typeof window !== 'undefined') {
    window.Readings = Readings;
  }

})(typeof window !== 'undefined' ? window : this);
