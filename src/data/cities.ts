export interface City {
  /** Display name in English */
  name: string;
  /** Chinese name */
  nameCN: string;
  /** Country */
  country: string;
  /** Latitude (for solar time correction) */
  lat: number;
  /** Longitude (for solar time correction) */
  lon: number;
  /** UTC offset in hours */
  timezone: number;
  /** Search keywords (lowercase) */
  keywords: string;
}

// ~100 major global cities with coordinates for True Solar Time calculation
export const CITIES: City[] = [
  // ── East Asia ──
  { name: 'Beijing', nameCN: '北京', country: 'China', lat: 39.9, lon: 116.4, timezone: 8, keywords: 'beijing peking 北京' },
  { name: 'Shanghai', nameCN: '上海', country: 'China', lat: 31.2, lon: 121.5, timezone: 8, keywords: 'shanghai 上海' },
  { name: 'Guangzhou', nameCN: '广州', country: 'China', lat: 23.1, lon: 113.3, timezone: 8, keywords: 'guangzhou canton 广州' },
  { name: 'Shenzhen', nameCN: '深圳', country: 'China', lat: 22.5, lon: 114.1, timezone: 8, keywords: 'shenzhen 深圳' },
  { name: 'Chengdu', nameCN: '成都', country: 'China', lat: 30.6, lon: 104.1, timezone: 8, keywords: 'chengdu 成都' },
  { name: 'Hangzhou', nameCN: '杭州', country: 'China', lat: 30.3, lon: 120.2, timezone: 8, keywords: 'hangzhou 杭州' },
  { name: 'Nanjing', nameCN: '南京', country: 'China', lat: 32.1, lon: 118.8, timezone: 8, keywords: 'nanjing 南京' },
  { name: 'Wuhan', nameCN: '武汉', country: 'China', lat: 30.6, lon: 114.3, timezone: 8, keywords: 'wuhan 武汉' },
  { name: "Xi'an", nameCN: '西安', country: 'China', lat: 34.3, lon: 108.9, timezone: 8, keywords: 'xian 西安' },
  { name: 'Chongqing', nameCN: '重庆', country: 'China', lat: 29.6, lon: 106.5, timezone: 8, keywords: 'chongqing 重庆' },
  { name: 'Tianjin', nameCN: '天津', country: 'China', lat: 39.1, lon: 117.2, timezone: 8, keywords: 'tianjin 天津' },
  { name: 'Harbin', nameCN: '哈尔滨', country: 'China', lat: 45.8, lon: 126.5, timezone: 8, keywords: 'harbin 哈尔滨' },
  { name: 'Kunming', nameCN: '昆明', country: 'China', lat: 25.0, lon: 102.7, timezone: 8, keywords: 'kunming 昆明' },
  { name: 'Taipei', nameCN: '台北', country: 'Taiwan, China', lat: 25.0, lon: 121.5, timezone: 8, keywords: 'taipei 台北 taiwan' },
  { name: 'Hong Kong', nameCN: '香港', country: 'Hong Kong, China', lat: 22.3, lon: 114.2, timezone: 8, keywords: 'hongkong hk 香港' },
  { name: 'Macao', nameCN: '澳门', country: 'Macao, China', lat: 22.2, lon: 113.5, timezone: 8, keywords: 'macao macau 澳门' },
  { name: 'Tokyo', nameCN: '东京', country: 'Japan', lat: 35.7, lon: 139.8, timezone: 9, keywords: 'tokyo 东京 japan' },
  { name: 'Osaka', nameCN: '大阪', country: 'Japan', lat: 34.7, lon: 135.5, timezone: 9, keywords: 'osaka 大阪' },
  { name: 'Seoul', nameCN: '首尔', country: 'South Korea', lat: 37.6, lon: 127.0, timezone: 9, keywords: 'seoul 首尔 korea' },
  { name: 'Busan', nameCN: '釜山', country: 'South Korea', lat: 35.2, lon: 129.1, timezone: 9, keywords: 'busan 釜山' },
  { name: 'Ulaanbaatar', nameCN: '乌兰巴托', country: 'Mongolia', lat: 47.9, lon: 106.9, timezone: 8, keywords: 'ulaanbaatar 乌兰巴托 mongolia' },

  // ── Southeast Asia ──
  { name: 'Singapore', nameCN: '新加坡', country: 'Singapore', lat: 1.4, lon: 103.8, timezone: 8, keywords: 'singapore 新加坡' },
  { name: 'Kuala Lumpur', nameCN: '吉隆坡', country: 'Malaysia', lat: 3.1, lon: 101.7, timezone: 8, keywords: 'kualalumpur kl 吉隆坡 malaysia' },
  { name: 'Bangkok', nameCN: '曼谷', country: 'Thailand', lat: 13.8, lon: 100.5, timezone: 7, keywords: 'bangkok 曼谷 thailand' },
  { name: 'Jakarta', nameCN: '雅加达', country: 'Indonesia', lat: -6.2, lon: 106.8, timezone: 7, keywords: 'jakarta 雅加达 indonesia' },
  { name: 'Manila', nameCN: '马尼拉', country: 'Philippines', lat: 14.6, lon: 121.0, timezone: 8, keywords: 'manila 马尼拉 philippines' },
  { name: 'Ho Chi Minh City', nameCN: '胡志明市', country: 'Vietnam', lat: 10.8, lon: 106.7, timezone: 7, keywords: 'hochiminh saigon 胡志明 vietnam' },
  { name: 'Hanoi', nameCN: '河内', country: 'Vietnam', lat: 21.0, lon: 105.8, timezone: 7, keywords: 'hanoi 河内' },
  { name: 'Yangon', nameCN: '仰光', country: 'Myanmar', lat: 16.8, lon: 96.2, timezone: 6.5, keywords: 'yangon 仰光 myanmar burma' },

  // ── South Asia ──
  { name: 'Mumbai', nameCN: '孟买', country: 'India', lat: 19.1, lon: 72.9, timezone: 5.5, keywords: 'mumbai bombay 孟买 india' },
  { name: 'New Delhi', nameCN: '新德里', country: 'India', lat: 28.6, lon: 77.2, timezone: 5.5, keywords: 'delhi newdelhi 新德里 德里' },
  { name: 'Bangalore', nameCN: '班加罗尔', country: 'India', lat: 13.0, lon: 77.6, timezone: 5.5, keywords: 'bangalore bengaluru 班加罗尔' },
  { name: 'Chennai', nameCN: '金奈', country: 'India', lat: 13.1, lon: 80.3, timezone: 5.5, keywords: 'chennai madras 金奈' },
  { name: 'Kolkata', nameCN: '加尔各答', country: 'India', lat: 22.6, lon: 88.4, timezone: 5.5, keywords: 'kolkata calcutta 加尔各答' },
  { name: 'Karachi', nameCN: '卡拉奇', country: 'Pakistan', lat: 24.9, lon: 67.1, timezone: 5, keywords: 'karachi 卡拉奇 pakistan' },
  { name: 'Dhaka', nameCN: '达卡', country: 'Bangladesh', lat: 23.8, lon: 90.4, timezone: 6, keywords: 'dhaka 达卡 bangladesh' },
  { name: 'Colombo', nameCN: '科伦坡', country: 'Sri Lanka', lat: 6.9, lon: 79.9, timezone: 5.5, keywords: 'colombo 科伦坡 srilanka' },
  { name: 'Kathmandu', nameCN: '加德满都', country: 'Nepal', lat: 27.7, lon: 85.3, timezone: 5.75, keywords: 'kathmandu 加德满都 nepal' },

  // ── Middle East ──
  { name: 'Dubai', nameCN: '迪拜', country: 'UAE', lat: 25.2, lon: 55.3, timezone: 4, keywords: 'dubai 迪拜 uae' },
  { name: 'Abu Dhabi', nameCN: '阿布扎比', country: 'UAE', lat: 24.5, lon: 54.4, timezone: 4, keywords: 'abudhabi 阿布扎比' },
  { name: 'Doha', nameCN: '多哈', country: 'Qatar', lat: 25.3, lon: 51.5, timezone: 3, keywords: 'doha 多哈 qatar' },
  { name: 'Riyadh', nameCN: '利雅得', country: 'Saudi Arabia', lat: 24.7, lon: 46.7, timezone: 3, keywords: 'riyadh 利雅得 saudiarabia' },
  { name: 'Istanbul', nameCN: '伊斯坦布尔', country: 'Turkey', lat: 41.0, lon: 29.0, timezone: 3, keywords: 'istanbul 伊斯坦布尔 turkey' },
  { name: 'Tel Aviv', nameCN: '特拉维夫', country: 'Israel', lat: 32.1, lon: 34.8, timezone: 2, keywords: 'telaviv 特拉维夫 israel' },
  { name: 'Tehran', nameCN: '德黑兰', country: 'Iran', lat: 35.7, lon: 51.4, timezone: 3.5, keywords: 'tehran 德黑兰 iran' },

  // ── Europe ──
  { name: 'London', nameCN: '伦敦', country: 'United Kingdom', lat: 51.5, lon: -0.1, timezone: 0, keywords: 'london 伦敦 uk england' },
  { name: 'Manchester', nameCN: '曼彻斯特', country: 'United Kingdom', lat: 53.5, lon: -2.2, timezone: 0, keywords: 'manchester 曼彻斯特' },
  { name: 'Paris', nameCN: '巴黎', country: 'France', lat: 48.9, lon: 2.4, timezone: 1, keywords: 'paris 巴黎 france' },
  { name: 'Berlin', nameCN: '柏林', country: 'Germany', lat: 52.5, lon: 13.4, timezone: 1, keywords: 'berlin 柏林 germany' },
  { name: 'Munich', nameCN: '慕尼黑', country: 'Germany', lat: 48.1, lon: 11.6, timezone: 1, keywords: 'munich 慕尼黑' },
  { name: 'Rome', nameCN: '罗马', country: 'Italy', lat: 41.9, lon: 12.5, timezone: 1, keywords: 'rome roma 罗马 italy' },
  { name: 'Milan', nameCN: '米兰', country: 'Italy', lat: 45.5, lon: 9.2, timezone: 1, keywords: 'milan milano 米兰' },
  { name: 'Madrid', nameCN: '马德里', country: 'Spain', lat: 40.4, lon: -3.7, timezone: 1, keywords: 'madrid 马德里 spain' },
  { name: 'Barcelona', nameCN: '巴塞罗那', country: 'Spain', lat: 41.4, lon: 2.2, timezone: 1, keywords: 'barcelona 巴塞罗那' },
  { name: 'Amsterdam', nameCN: '阿姆斯特丹', country: 'Netherlands', lat: 52.4, lon: 4.9, timezone: 1, keywords: 'amsterdam 阿姆斯特丹 netherlands' },
  { name: 'Brussels', nameCN: '布鲁塞尔', country: 'Belgium', lat: 50.9, lon: 4.4, timezone: 1, keywords: 'brussels 布鲁塞尔 belgium' },
  { name: 'Zurich', nameCN: '苏黎世', country: 'Switzerland', lat: 47.4, lon: 8.5, timezone: 1, keywords: 'zurich 苏黎世 switzerland' },
  { name: 'Vienna', nameCN: '维也纳', country: 'Austria', lat: 48.2, lon: 16.4, timezone: 1, keywords: 'vienna wien 维也纳 austria' },
  { name: 'Stockholm', nameCN: '斯德哥尔摩', country: 'Sweden', lat: 59.3, lon: 18.1, timezone: 1, keywords: 'stockholm 斯德哥尔摩 sweden' },
  { name: 'Oslo', nameCN: '奥斯陆', country: 'Norway', lat: 59.9, lon: 10.8, timezone: 1, keywords: 'oslo 奥斯陆 norway' },
  { name: 'Copenhagen', nameCN: '哥本哈根', country: 'Denmark', lat: 55.7, lon: 12.6, timezone: 1, keywords: 'copenhagen 哥本哈根 denmark' },
  { name: 'Warsaw', nameCN: '华沙', country: 'Poland', lat: 52.2, lon: 21.0, timezone: 1, keywords: 'warsaw 华沙 poland' },
  { name: 'Moscow', nameCN: '莫斯科', country: 'Russia', lat: 55.8, lon: 37.6, timezone: 3, keywords: 'moscow 莫斯科 russia' },
  { name: 'St Petersburg', nameCN: '圣彼得堡', country: 'Russia', lat: 60.0, lon: 30.3, timezone: 3, keywords: 'stpetersburg 圣彼得堡' },
  { name: 'Prague', nameCN: '布拉格', country: 'Czech Republic', lat: 50.1, lon: 14.4, timezone: 1, keywords: 'prague praha 布拉格 czech' },
  { name: 'Budapest', nameCN: '布达佩斯', country: 'Hungary', lat: 47.5, lon: 19.0, timezone: 1, keywords: 'budapest 布达佩斯 hungary' },
  { name: 'Lisbon', nameCN: '里斯本', country: 'Portugal', lat: 38.7, lon: -9.1, timezone: 0, keywords: 'lisbon lisboa 里斯本 portugal' },
  { name: 'Dublin', nameCN: '都柏林', country: 'Ireland', lat: 53.3, lon: -6.3, timezone: 0, keywords: 'dublin 都柏林 ireland' },
  { name: 'Athens', nameCN: '雅典', country: 'Greece', lat: 38.0, lon: 23.7, timezone: 2, keywords: 'athens 雅典 greece' },

  // ── North America ──
  { name: 'New York', nameCN: '纽约', country: 'United States', lat: 40.7, lon: -74.0, timezone: -5, keywords: 'newyork nyc 纽约 usa' },
  { name: 'Los Angeles', nameCN: '洛杉矶', country: 'United States', lat: 34.1, lon: -118.2, timezone: -8, keywords: 'losangeles la 洛杉矶' },
  { name: 'Chicago', nameCN: '芝加哥', country: 'United States', lat: 41.9, lon: -87.6, timezone: -6, keywords: 'chicago 芝加哥' },
  { name: 'San Francisco', nameCN: '旧金山', country: 'United States', lat: 37.8, lon: -122.4, timezone: -8, keywords: 'sanfrancisco sf 旧金山 三藩市' },
  { name: 'Seattle', nameCN: '西雅图', country: 'United States', lat: 47.6, lon: -122.3, timezone: -8, keywords: 'seattle 西雅图' },
  { name: 'Boston', nameCN: '波士顿', country: 'United States', lat: 42.4, lon: -71.1, timezone: -5, keywords: 'boston 波士顿' },
  { name: 'Washington DC', nameCN: '华盛顿', country: 'United States', lat: 38.9, lon: -77.0, timezone: -5, keywords: 'washington dc 华盛顿' },
  { name: 'Houston', nameCN: '休斯顿', country: 'United States', lat: 29.8, lon: -95.4, timezone: -6, keywords: 'houston 休斯顿' },
  { name: 'Miami', nameCN: '迈阿密', country: 'United States', lat: 25.8, lon: -80.2, timezone: -5, keywords: 'miami 迈阿密' },
  { name: 'Las Vegas', nameCN: '拉斯维加斯', country: 'United States', lat: 36.2, lon: -115.1, timezone: -8, keywords: 'lasvegas 拉斯维加斯' },
  { name: 'Toronto', nameCN: '多伦多', country: 'Canada', lat: 43.7, lon: -79.4, timezone: -5, keywords: 'toronto 多伦多 canada' },
  { name: 'Vancouver', nameCN: '温哥华', country: 'Canada', lat: 49.3, lon: -123.1, timezone: -8, keywords: 'vancouver 温哥华' },
  { name: 'Montreal', nameCN: '蒙特利尔', country: 'Canada', lat: 45.5, lon: -73.6, timezone: -5, keywords: 'montreal 蒙特利尔' },
  { name: 'Mexico City', nameCN: '墨西哥城', country: 'Mexico', lat: 19.4, lon: -99.1, timezone: -6, keywords: 'mexicocity 墨西哥城 mexico' },

  // ── South America ──
  { name: 'São Paulo', nameCN: '圣保罗', country: 'Brazil', lat: -23.5, lon: -46.6, timezone: -3, keywords: 'saopaulo 圣保罗 brazil' },
  { name: 'Rio de Janeiro', nameCN: '里约热内卢', country: 'Brazil', lat: -22.9, lon: -43.2, timezone: -3, keywords: 'riodejaneiro rio 里约' },
  { name: 'Buenos Aires', nameCN: '布宜诺斯艾利斯', country: 'Argentina', lat: -34.6, lon: -58.4, timezone: -3, keywords: 'buenosaires 布宜诺斯艾利斯 argentina' },
  { name: 'Santiago', nameCN: '圣地亚哥', country: 'Chile', lat: -33.4, lon: -70.7, timezone: -4, keywords: 'santiago 圣地亚哥 chile' },
  { name: 'Lima', nameCN: '利马', country: 'Peru', lat: -12.0, lon: -77.0, timezone: -5, keywords: 'lima 利马 peru' },
  { name: 'Bogotá', nameCN: '波哥大', country: 'Colombia', lat: 4.7, lon: -74.1, timezone: -5, keywords: 'bogota 波哥大 colombia' },

  // ── Oceania ──
  { name: 'Sydney', nameCN: '悉尼', country: 'Australia', lat: -33.9, lon: 151.2, timezone: 10, keywords: 'sydney 悉尼 australia' },
  { name: 'Melbourne', nameCN: '墨尔本', country: 'Australia', lat: -37.8, lon: 145.0, timezone: 10, keywords: 'melbourne 墨尔本' },
  { name: 'Brisbane', nameCN: '布里斯班', country: 'Australia', lat: -27.5, lon: 153.0, timezone: 10, keywords: 'brisbane 布里斯班' },
  { name: 'Perth', nameCN: '珀斯', country: 'Australia', lat: -32.0, lon: 115.9, timezone: 8, keywords: 'perth 珀斯' },
  { name: 'Auckland', nameCN: '奥克兰', country: 'New Zealand', lat: -36.8, lon: 174.8, timezone: 12, keywords: 'auckland 奥克兰 newzealand' },
  { name: 'Wellington', nameCN: '惠灵顿', country: 'New Zealand', lat: -41.3, lon: 174.8, timezone: 12, keywords: 'wellington 惠灵顿' },

  // ── Africa ──
  { name: 'Cairo', nameCN: '开罗', country: 'Egypt', lat: 30.0, lon: 31.2, timezone: 2, keywords: 'cairo 开罗 egypt' },
  { name: 'Lagos', nameCN: '拉各斯', country: 'Nigeria', lat: 6.5, lon: 3.4, timezone: 1, keywords: 'lagos 拉各斯 nigeria' },
  { name: 'Nairobi', nameCN: '内罗毕', country: 'Kenya', lat: -1.3, lon: 36.8, timezone: 3, keywords: 'nairobi 内罗毕 kenya' },
  { name: 'Cape Town', nameCN: '开普敦', country: 'South Africa', lat: -33.9, lon: 18.4, timezone: 2, keywords: 'capetown 开普敦 southafrica' },
  { name: 'Johannesburg', nameCN: '约翰内斯堡', country: 'South Africa', lat: -26.2, lon: 28.1, timezone: 2, keywords: 'johannesburg joburg 约翰内斯堡' },
  { name: 'Casablanca', nameCN: '卡萨布兰卡', country: 'Morocco', lat: 33.6, lon: -7.6, timezone: 0, keywords: 'casablanca 卡萨布兰卡 morocco' },
  { name: 'Addis Ababa', nameCN: '亚的斯亚贝巴', country: 'Ethiopia', lat: 9.0, lon: 38.7, timezone: 3, keywords: 'addisababa 亚的斯亚贝巴 ethiopia' },

  // ── Extended Asia ──
  { name: 'Shenyang', nameCN: '沈阳', country: 'China', lat: 41.8, lon: 123.4, timezone: 8, keywords: 'shenyang 沈阳' },
  { name: 'Changsha', nameCN: '长沙', country: 'China', lat: 28.2, lon: 113.0, timezone: 8, keywords: 'changsha 长沙' },
  { name: 'Zhengzhou', nameCN: '郑州', country: 'China', lat: 34.7, lon: 113.7, timezone: 8, keywords: 'zhengzhou 郑州' },
  { name: 'Jinan', nameCN: '济南', country: 'China', lat: 36.7, lon: 117.0, timezone: 8, keywords: 'jinan 济南' },
  { name: 'Fuzhou', nameCN: '福州', country: 'China', lat: 26.1, lon: 119.3, timezone: 8, keywords: 'fuzhou 福州' },
  { name: 'Xiamen', nameCN: '厦门', country: 'China', lat: 24.5, lon: 118.1, timezone: 8, keywords: 'xiamen 厦门' },
];

/** Standard meridian for each timezone (degrees) */
const TIMEZONE_MERIDIANS: Record<number, number> = {
  '-12': -180, '-11': -165, '-10': -150, '-9': -135,
  '-8': -120, '-7': -105, '-6': -90, '-5': -75,
  '-4': -60, '-3': -45, '-2': -30, '-1': -15,
  0: 0,
  1: 15, 2: 30, 3: 45, 3.5: 52.5, 4: 60,
  5: 75, 5.5: 82.5, 5.75: 86.25, 6: 90, 6.5: 97.5,
  7: 105, 8: 120, 9: 135, 10: 150, 12: 180,
};

/**
 * Calculate True Solar Time correction in minutes.
 * Positive = add minutes to clock time, negative = subtract.
 * Formula: (longitude - standard_meridian) × 4 min/degree
 */
export function solarTimeCorrection(city: City): number {
  const meridian = TIMEZONE_MERIDIANS[city.timezone] ?? city.timezone * 15;
  return (city.lon - meridian) * 4;
}

/**
 * Search cities by keyword (case-insensitive, matches name, nameCN, country, keywords)
 */
export function searchCities(query: string): City[] {
  const q = query.toLowerCase().trim();
  if (!q) return CITIES.slice(0, 10); // top cities by default
  return CITIES.filter((c) => c.keywords.includes(q) || c.name.toLowerCase().includes(q) || c.nameCN.includes(q));
}
