import { SITE_URL } from './brand';

export const YE_QINGCHUN_PROFILE_PATH = '/authors/ye-qingchun.html';
export const YE_QINGCHUN_ZH_PROFILE_PATH = '/zh/authors/ye-qingchun.html';
export const YE_QINGCHUN_ID = `${SITE_URL}${YE_QINGCHUN_PROFILE_PATH}#person`;
export const YE_QINGCHUN_PUBLIC_REFERENCE = 'https://www.daoisms.com.cn/2023/08/10/92738/';

export const yeQingchunPersonJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': YE_QINGCHUN_ID,
  name: 'Ye Qingchun',
  alternateName: ['叶青春', '叶青春道长', 'Daoist Priest Ye Qingchun'],
  honorificPrefix: 'Daoist Priest',
  jobTitle: 'Taoist priest and abbot of Huizhou Yuanmiao Taoist Temple',
  url: `${SITE_URL}${YE_QINGCHUN_PROFILE_PATH}`,
  description:
    'Daoist Priest Ye Qingchun is the abbot of Huizhou Yuanmiao Taoist Temple and the traditional culture editor for MyBaziDestiny.',
  affiliation: {
    '@type': 'Organization',
    name: 'Huizhou Yuanmiao Taoist Temple',
    alternateName: '惠州元妙古观',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Huizhou',
      addressRegion: 'Guangdong',
      addressCountry: 'CN',
    },
  },
  knowsAbout: [
    'Taoist culture',
    'BaZi (Four Pillars of Destiny)',
    'Heavenly Stems and Earthly Branches',
    'Five Elements',
    'Traditional Chinese calendrical culture',
    'Chinese naming traditions',
  ],
  subjectOf: {
    '@type': 'Article',
    headline: 'Living Taoist culture documentation filmed at Huizhou Yuanmiao Taoist Temple',
    url: YE_QINGCHUN_PUBLIC_REFERENCE,
  },
} as const;
