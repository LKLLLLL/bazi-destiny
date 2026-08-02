export type Lang = 'en' | 'zh';

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.faq': 'FAQ',
    'nav.loveMatch': 'Love Match',
    'nav.leaderboard': 'Leaderboard',
    'nav.about': 'About',
    'nav.cta': 'Free Reading',
    'nav.lang': '中文',

    'footer.tagline': 'Ancient Chinese wisdom for the modern world.',
    'footer.tools': 'Tools',
    'footer.learn': 'Learn',
    'footer.legal': 'Legal',
    'footer.calculator': 'BaZi Calculator',
    'footer.loveMatch': 'Love Match',
    'footer.leaderboard': 'Leaderboard',
    'footer.blog': 'Blog',
    'footer.faq': 'FAQ',
    'footer.about': 'About',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.editorial': 'Editorial Policy',
    'footer.contact': 'Contact',
    'footer.rights': '© 2026 MyBaziDestiny. All rights reserved.',
  },
  zh: {
    'nav.home': '首页',
    'nav.blog': '博客',
    'nav.faq': '常见问题',
    'nav.loveMatch': '缘分配对',
    'nav.leaderboard': '排行榜',
    'nav.about': '关于',
    'nav.cta': '免费测算',
    'nav.lang': 'English',

    'footer.tagline': '古老东方智慧，照亮现代生活。',
    'footer.tools': '工具',
    'footer.learn': '学习',
    'footer.legal': '条款',
    'footer.calculator': '八字排盘',
    'footer.loveMatch': '缘分配对',
    'footer.leaderboard': '排行榜',
    'footer.blog': '博客',
    'footer.faq': '常见问题',
    'footer.about': '关于我们',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.editorial': '编辑方针',
    'footer.contact': '联系我们',
    'footer.rights': '© 2026 八字命运 版权所有',
  },
} as const;

export type UiKey = keyof (typeof ui)['en'];

export function t(lang: Lang, key: UiKey): string {
  return (ui[lang] as Record<string, string>)[key] ?? ui.en[key] ?? key;
}

/** Prefix a path with the locale. Root paths stay bare for EN. */
export function localePath(lang: Lang, path: string): string {
  if (lang === 'zh') return path === '/' ? '/zh/' : `/zh${path}`;
  return path;
}
